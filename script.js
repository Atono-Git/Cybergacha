```javascript
"use strict";

/* =========================
   DEFAULT SETTINGS
========================= */

const DEFAULT_RATES = {
    R: 90,
    SR: 8.5,
    SSR: 1.4999,
    XR: 0.0001
};

/* =========================
   STATE
========================= */

let rates = { ...DEFAULT_RATES };

let rollCount = 1;

let forceRarity = "RANDOM";

let isRolling = false;


/* =========================
   GET ELEMENTS
========================= */

const gachaBox = document.getElementById("gachaBox");

const adminButton = document.getElementById("adminButton");
const adminPanel = document.getElementById("adminPanel");
const adminClose = document.getElementById("adminClose");

const rollCountInput = document.getElementById("rollCountInput");

const rateR = document.getElementById("rateR");
const rateSR = document.getElementById("rateSR");
const rateSSR = document.getElementById("rateSSR");
const rateXR = document.getElementById("rateXR");

const totalDisplay = document.getElementById("totalDisplay");

const forceStatus = document.getElementById("forceStatus");

const resultRarity = document.getElementById("resultRarity");

const historyList = document.getElementById("historyList");

const ssrOverlay = document.getElementById("ssrOverlay");
const xrOverlay = document.getElementById("xrOverlay");

const ssrContinue = document.getElementById("ssrContinue");
const xrContinue = document.getElementById("xrContinue");

const applyButton = document.getElementById("applyButton");
const resetButton = document.getElementById("resetButton");


/* =========================
   SAFETY CHECK
========================= */

console.log("CYBER GACHA JS LOADED");

if (!gachaBox) {
    console.error("ERROR: gachaBox not found");
}


/* =========================
   ADMIN
========================= */

adminButton.addEventListener("click", function () {

    console.log("ADMIN CLICK");

    adminPanel.classList.add("open");

});


adminClose.addEventListener("click", function () {

    adminPanel.classList.remove("open");

});


/* =========================
   ROLL COUNT
========================= */

rollCountInput.addEventListener("input", function () {

    let value = Number(rollCountInput.value);

    if (!Number.isFinite(value)) {
        value = 1;
    }

    value = Math.floor(value);

    if (value < 1) {
        value = 1;
    }

    if (value > 9999) {
        value = 9999;
    }

    rollCount = value;

});


const quickButtons =
    document.querySelectorAll("[data-count]");


quickButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const count = Number(button.dataset.count);

        rollCount = count;

        rollCountInput.value = count;

    });

});


/* =========================
   RATE INPUT
========================= */

function readRates() {

    rates.R = Number(rateR.value) || 0;
    rates.SR = Number(rateSR.value) || 0;
    rates.SSR = Number(rateSSR.value) || 0;
    rates.XR = Number(rateXR.value) || 0;

    updateTotal();

}


function updateTotal() {

    const total =
        rates.R +
        rates.SR +
        rates.SSR +
        rates.XR;

    totalDisplay.textContent =
        "TOTAL: " + total.toFixed(4) + "%";

    if (Math.abs(total - 100) < 0.0001) {

        totalDisplay.style.borderColor = "#00eaff";
        totalDisplay.style.color = "#00eaff";

    } else {

        totalDisplay.style.borderColor = "#ff3355";
        totalDisplay.style.color = "#ff3355";

    }

}


rateR.addEventListener("input", readRates);
rateSR.addEventListener("input", readRates);
rateSSR.addEventListener("input", readRates);
rateXR.addEventListener("input", readRates);


/* =========================
   FORCE RARITY
========================= */

const forceButtons =
    document.querySelectorAll("[data-force]");


forceButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        forceRarity = button.dataset.force;

        forceButtons.forEach(function (b) {
            b.classList.remove("selected");
        });

        button.classList.add("selected");

        forceStatus.textContent =
            "MODE: " + forceRarity;

    });

});


/* =========================
   APPLY
========================= */

applyButton.addEventListener("click", function () {

    readRates();

    const total =
        rates.R +
        rates.SR +
        rates.SSR +
        rates.XR;

    if (Math.abs(total - 100) > 0.0001) {

        alert(
            "確率の合計を100%にしてください。\n現在: " +
            total.toFixed(4) +
            "%"
        );

        return;
    }

    adminPanel.classList.remove("open");

});


/* =========================
   RESET
========================= */

resetButton.addEventListener("click", function () {

    rates = { ...DEFAULT_RATES };

    rateR.value = rates.R;
    rateSR.value = rates.SR;
    rateSSR.value = rates.SSR;
    rateXR.value = rates.XR;

    rollCount = 1;
    rollCountInput.value = 1;

    forceRarity = "RANDOM";

    forceButtons.forEach(function (button) {

        button.classList.remove("selected");

        if (button.dataset.force === "RANDOM") {
            button.classList.add("selected");
        }

    });

    forceStatus.textContent = "MODE: RANDOM";

    updateTotal();

});


/* =========================
   RANDOM RARITY
========================= */

function getRandomRarity() {

    const random = Math.random() * 100;

    let current = 0;

    current += rates.R;

    if (random < current) {
        return "R";
    }

    current += rates.SR;

    if (random < current) {
        return "SR";
    }

    current += rates.SSR;

    if (random < current) {
        return "SSR";
    }

    return "XR";

}


/* =========================
   RESULT
========================= */

function showResult(rarity) {

    resultRarity.textContent = rarity;

    resultRarity.className = "";

    if (rarity === "R") {

        resultRarity.style.color = "#00eaff";

    }

    if (rarity === "SR") {

        resultRarity.style.color = "#55ff99";

    }

    if (rarity === "SSR") {

        resultRarity.style.color = "#ffcc33";

    }

    if (rarity === "XR") {

        resultRarity.style.color = "#ffffff";

    }

}


/* =========================
   HISTORY
========================= */

function addHistory(rarity) {

    const item = document.createElement("div");

    item.className = "historyItem";

    item.textContent = rarity;

    historyList.prepend(item);

}


/* =========================
   OVERLAYS
========================= */

function closeOverlays() {

    ssrOverlay.classList.remove("show");
    xrOverlay.classList.remove("show");

}


ssrContinue.addEventListener("click", function () {

    ssrOverlay.classList.remove("show");

});


xrContinue.addEventListener("click", function () {

    xrOverlay.classList.remove("show");

});


/* =========================
   SINGLE ROLL
========================= */

function rollOnce() {

    let rarity;

    if (forceRarity === "RANDOM") {

        rarity = getRandomRarity();

    } else {

        rarity = forceRarity;

    }

    showResult(rarity);
    addHistory(rarity);

    return rarity;

}


/* =========================
   GACHA OPEN
========================= */

function openGacha() {

    console.log("GACHA CLICK");

    if (isRolling) {
        return;
    }

    isRolling = true;

    closeOverlays();

    gachaBox.classList.remove("rolling");

    /*
       少し待ってからクラスを追加することで、
       CSSアニメーションが毎回発生する
    */

    setTimeout(function () {

        gachaBox.classList.add("rolling");

    }, 10);


    setTimeout(function () {

        gachaBox.classList.remove("rolling");

        let lastRarity = "R";

        for (let i = 0; i < rollCount; i++) {

            lastRarity = rollOnce();

        }

        /*
           最後の結果がSSRならSSR演出
        */

        if (lastRarity === "SSR") {

            setTimeout(function () {

                ssrOverlay.classList.add("show");

            }, 200);

        }

        /*
           XRならXR演出
        */

        if (lastRarity === "XR") {

            setTimeout(function () {

                xrOverlay.classList.add("show");

            }, 200);

        }

        isRolling = false;

    }, 750);

}


/* =========================
   BOX CLICK
========================= */

gachaBox.addEventListener("click", function () {

    openGacha();

});


/* =========================
   KEYBOARD
   Enter ONLY
========================= */

gachaBox.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        openGacha();

    }

});


/* =========================
   INITIAL VALUES
========================= */

rateR.value = rates.R;
rateSR.value = rates.SR;
rateSSR.value = rates.SSR;
rateXR.value = rates.XR;

rollCountInput.value = rollCount;

updateTotal();


console.log("CYBER GACHA READY");
```
