"use strict";

const MAX_DEPARTURES = 4;

function renderBoard(data) {
    const board = document.querySelector("main");
    board.replaceChildren();

    data.departures.slice(0, MAX_DEPARTURES).forEach((departure) => {
        const row = document.createElement("article");
        row.className = "waku";

        const timeBox = document.createElement("div");
        timeBox.className = "time-box";
        const time = document.createElement("span");
        time.className = "time";
        time.textContent = departure.time;
        timeBox.append(time);

        const infoBox = document.createElement("div");
        infoBox.className = "info-box";
        const infoTop = document.createElement("div");
        infoTop.className = "info-top";

        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = departure.type;
        const line = document.createElement("span");
        line.className = "line";
        line.textContent = departure.lineName;
        const destination = document.createElement("span");
        destination.className = "destination";
        destination.textContent = departure.destination;
        const platform = document.createElement("span");
        platform.className = "platform";
        platform.textContent = `${departure.platform} 番線`;
        infoTop.append(badge, line, destination, platform);

        const infoBottom = document.createElement("div");
        infoBottom.className = "info-bottom";
        const remarks = document.createElement("span");
        remarks.className = "remarks";
        remarks.textContent = departure.remarks;
        infoBottom.append(remarks);

        infoBox.append(infoTop, infoBottom);
        row.append(timeBox, infoBox);
        board.append(row);
    });
    startRemarksAutoscroll();
}

function startRemarksAutoscroll() {
    document.querySelectorAll(".remarks").forEach((remarks) => {
        let pauseUntil = 0;

        window.setInterval(() => {
            const maxScroll = remarks.scrollWidth - remarks.clientWidth;
            if (maxScroll <= 0) return;

            if (remarks.scrollLeft >= maxScroll - 1) {
                if (pauseUntil === 0) pauseUntil = Date.now() + 1200;
                if (Date.now() >= pauseUntil) {
                    remarks.scrollLeft = 0;
                    pauseUntil = 0;
                }
                return;
            }

            remarks.scrollLeft += 1;
        }, 35);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("timetable.json");
        if (!response.ok) {
            throw new Error(`時刻表の読み込みに失敗しました (${response.status})`);
        }
        renderBoard(await response.json());
    } catch (error) {
        console.error(error);
        document.querySelector("main").textContent = "時刻表を読み込めませんでした。";
    }
});
