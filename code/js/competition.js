// Keep shared deadlines here rather than repeating them in JavaScript
// on every page.
//
// +02:00 specifies Estonian winter time for these dates.
const competitionRounds = {
    round1: {
        deadline: "2026-12-21T12:59:00+02:00",
        openLabel: "Meene tähtaeg",
        expiredLabel: "Meene tähtaeg on möödunud",
    },

    round1Final: {
        deadline: "2027-02-15T12:59:00+02:00",
        openLabel: "Salavõtme tähtaeg",
        expiredLabel: "Tähtaeg on möödunud",
    },

    round2: {
        opens: "2026-12-21T13:00:00+02:00",
        deadline: "2027-03-01T12:59:00+02:00",
        openLabel: "Voor on avatud",
        expiredLabel: "Tähtaeg on möödunud",
    },

    final: {
        deadline: "2027-03-13",
        daysOnly: true,
        openLabel: "Voor on tulekul",
        expiredLabel: "Lõppvooru kuupäev on möödunud",
    }
};

const deadlineFormatter = new Intl.DateTimeFormat("et-EE", {
    timeZone: "Europe/Tallinn",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

function getCountdownParts(milliseconds) {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));

    return [
        Math.floor(totalSeconds / 86400),
        Math.floor((totalSeconds % 86400) / 3600),
        Math.floor((totalSeconds % 3600) / 60),
        totalSeconds % 60,
    ].map((value) => String(value).padStart(2, "0"));
}

function renderCountdown(element, milliseconds, isUpcoming) {
    // Build the markup once. Subsequent updates change only the numbers.
    if (!element.querySelector(".countdown-digits")) {
        const units = ["P", "H", "M", "S"];

        element.innerHTML = `
            <span class="countdown-heading" aria-hidden="true"></span>

            <span class="countdown-digits" aria-hidden="true">
                ${units.map((unit) => `
                    <span class="countdown-unit">
                        <span class="countdown-number"></span>
                        <span class="countdown-suffix">${unit}</span>
                    </span>
                `).join("")}
            </span>
        `;
    }

    // Avoid announcing every second to screen-reader users.
    element.setAttribute("role", "timer");
    element.setAttribute("aria-live", "off");

    const heading = element.querySelector(".countdown-heading");
    const numbers = element.querySelectorAll(".countdown-number");
    const parts = getCountdownParts(milliseconds);

    heading.textContent = isUpcoming ? "AVAMISENI :" : "TÄHTAJANI :";

    numbers.forEach((number, index) => {
        const nextValue = parts[index];

        // Do not animate units whose values have not changed.
        if (number.textContent === nextValue) return;

        const hadPreviousValue = number.textContent !== "";
        number.textContent = nextValue;

        if (hadPreviousValue) {
            number.classList.remove("is-changing");

            // Force layout so adding the class restarts the animation.
            number.getBoundingClientRect();

            number.classList.add("is-changing");
        }
    });

    const label = isUpcoming ? "Avamiseni" : "Tähtajani";

    element.setAttribute(
        "aria-label",
        `${label}: ${Number(parts[0])} päeva, ` +
        `${Number(parts[1])} tundi, ` +
        `${Number(parts[2])} minutit, ` +
        `${Number(parts[3])} sekundit`
    );
}

function updateDeadlineDisplay(element, round, deadline) {
    if (!element) return;

    element.dateTime = round.deadline;

    const formattedDeadline =
        `${deadlineFormatter.format(deadline)} (Eesti aeg)`;

    if (element.textContent !== formattedDeadline) {
        element.textContent = formattedDeadline;
    }
}

function showExpiredCountdown(element, expiredLabel) {
    if (!element || element.dataset.expired === "true") return;

    element.textContent = expiredLabel;
    element.dataset.expired = "true";

    element.removeAttribute("aria-label");
    element.removeAttribute("role");
    element.removeAttribute("aria-live");
}

const calendarDateFormatter = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Tallinn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

function getEstonianCalendarDate(now) {
    const parts = calendarDateFormatter.formatToParts(new Date(now));
    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    return `${values.year}-${values.month}-${values.day}`;
}

function getDaysOnlyStatus(days, round) {
    if (days < 0) {
        return { state: "closed", label: round.expiredLabel };
    }

    if (days === 0) {
        return { state: "open", label: "Lõppvoor toimub täna" };
    }

    return { state: "upcoming", label: round.openLabel };
}

function updateDaysOnlyCard(card, round, now) {
    const today = getEstonianCalendarDate(now);

    // Compare calendar dates, rather than hours remaining.
    const days = Math.round(
        (Date.parse(round.deadline) - Date.parse(today)) / 86_400_000
    );

    const status = card.querySelector("[data-round-status]");
    const countdown = card.querySelector("[data-countdown]");

    const { state, label } = getDaysOnlyStatus(days, round);

    card.dataset.status = state;

    if (status && status.textContent !== label) {
        status.textContent = label;
    }

    if (!countdown) return;

    if (days <= 0) {
        countdown.textContent = days === 0
            ? "Lõppvoor toimub täna!"
            : round.expiredLabel;
        return;
    }

    if (!countdown.querySelector(".countdown-number")) {
        countdown.innerHTML = `
            <span class="countdown-heading">LÕPPVOORUNI:</span>
            <span class="countdown-digits">
                <span class="countdown-unit">
                    <span class="countdown-number"></span>
                    <span class="countdown-suffix"></span>
                </span>
            </span>
        `;
    }

    const number = countdown.querySelector(".countdown-number");
    const suffix = countdown.querySelector(".countdown-suffix");
    const nextValue = String(days);

    if (number.textContent !== nextValue) {
        number.textContent = nextValue;
        suffix.textContent = days === 1 ? "päev" : "päeva";
    }
}

function updateActiveCountdown(element, targetTime, now, isUpcoming) {
    if (!element) return;

    delete element.dataset.expired;
    renderCountdown(element, targetTime - now, isUpcoming);
}

function updateRoundCard(card, now) {
    const round = competitionRounds[card.dataset.round];
    if (!round) return;

    if (round.daysOnly) {
        updateDaysOnlyCard(card, round, now);
        return;
    }

    const deadline = new Date(round.deadline);
    const deadlineTime = deadline.getTime();
    const opensAt = round.opens
        ? new Date(round.opens).getTime()
        : null;

    const timeElement = card.querySelector("[data-round-deadline]");
    const countdownElement = card.querySelector("[data-countdown]");
    const statusElement = card.querySelector("[data-round-status]");

    updateDeadlineDisplay(timeElement, round, deadline);

    let status;
    let statusText;

    if (now >= deadlineTime) {
        status = "closed";
        statusText = round.expiredLabel;

        showExpiredCountdown(countdownElement, round.expiredLabel);
    } else {
        const isUpcoming = opensAt !== null && now < opensAt;

        status = isUpcoming ? "upcoming" : "open";
        statusText = isUpcoming ? "Voor on tulekul" : round.openLabel;

        const targetTime = isUpcoming ? opensAt : deadlineTime;

        updateActiveCountdown(
            countdownElement,
            targetTime,
            now,
            isUpcoming
        );
    }

    card.dataset.status = status;

    if (statusElement && statusElement.textContent !== statusText) {
        statusElement.textContent = statusText;
    }
}

function initializeCountdowns() {
    const cards = document.querySelectorAll("[data-round]");
    if (!cards.length) return;

    function updateAllCountdowns() {
        const now = Date.now();

        cards.forEach((card) => {
            updateRoundCard(card, now);
        });
    }

    updateAllCountdowns();
    window.setInterval(updateAllCountdowns, 1000);

    // Refresh immediately when returning to a backgrounded tab.
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            updateAllCountdowns();
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCountdowns);
} else {
    initializeCountdowns();
}