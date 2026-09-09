```javascript
"use strict";


/* =========================
   GACHA PROBABILITY
========================= */

const RATES = {
    R: 90,
    SR: 8.5,
    SSR: 1.4999,
    XR: 0.0001
};


/* =========================
   ELEMENTS
========================= */

const gachaBox =
    document.getElementById("gachaBox");

const resultRarity =
    document.getElementById("resultRarity");

const historyList =
    document.getElementById("historyList");

const ssrOverlay =
    document.getElementById("ssrOverlay");

const xrOverlay =
    document.getElementById("xrOverlay");

const ssrContinue =
    document.getElementById("ssrContinue");

const xrContinue =
    document.getElementById("xrContinue");


/* =========================
   STATE
========================= */

let isRolling = false;


/* =========================
   STARTUP CHECK
========================= */

console.log("CYBER GACHA START");

if (!gachaBox) {
    console.error("gachaBox が見つかりません");
}


/* =========================
   RANDOM RARITY
========================= */

function getRandomRarity() {

    const random =
        Math.random() * 100;

    if (random < RATES.R) {
        return "R";
    }

    if (random < RATES.R + RATES.SR) {
        return "SR";
    }

    if (
        random <
        RATES.R +
        RATES.SR +
        RATES.SSR
    ) {
        return "SSR";
    }

    return "XR";
}


/* =========================
   SHOW RESULT
========================= */

function showResult(rarity) {

    resultRarity.textContent =
        rarity;


    if (rarity === "R") {

        resultRarity.style.color =
            "#00eaff";

        resultRarity.style.textShadow =
            "0 0 15px #00eaff, 0 0 40px #00eaff";

    }


    if (rarity === "SR") {

        resultRarity.style.color =
            "#55ff99";

        resultRarity.style.textShadow =
            "0 0 15px #55ff99, 0 0 40px #55ff99";

    }


    if (rarity === "SSR") {

        resultRarity.style.color =
            "#ffcc33";

        resultRarity.style.textShadow =
            "0 0 15px #ffcc33, 0 0 40px #ffcc33";

    }


    if (rarity === "XR") {

        resultRarity.style.color =
            "#ffffff";

        resultRarity.style.textShadow =
            "0 0 20px white, 0 0 50px white";

    }

}


/* =========================
   HISTORY
========================= */

function addHistory(rarity) {

    const item =
        document.createElement("div");

    item.className =
        "historyItem";

    item.textContent =
        rarity;

    historyList.prepend(item);

}


/* =========================
   CLOSE OVERLAYS
========================= */

function closeOverlays() {

    ssrOverlay.classList.remove("show");

    xrOverlay.classList.remove("show");

}


/* =========================
   SSR / XR CONTINUE
========================= */

ssrContinue.addEventListener(
    "click",
    function () {

        ssrOverlay.classList.remove("show");

    }
);


xrContinue.addEventListener(
    "click",
    function () {

        xrOverlay.classList.remove("show");

    }
);


/* =========================
   OPEN GACHA
========================= */

function openGacha() {

    console.log("GACHA BOX CLICK");

    if (isRolling) {
        return;
    }

    isRolling = true;

    closeOverlays();


    /* アニメーションをリセット */

    gachaBox.classList.remove("rolling");


    /* 強制的に再描画 */

    void gachaBox.offsetWidth;


    /* アニメーション開始 */

    gachaBox.classList.add("rolling");


    /* 結果 */

    setTimeout(function () {

        const rarity =
            getRandomRarity();


        showResult(rarity);

        addHistory(rarity);


        /* SSR演出 */

        if (rarity === "SSR") {

            ssrOverlay.classList.add("show");

        }


        /* XR演出 */

        if (rarity === "XR") {

            xrOverlay.classList.add("show");

        }


        isRolling = false;

    }, 750);


    /* アニメーション終了 */

    setTimeout(function () {

        gachaBox.classList.remove("rolling");

    }, 800);

}


/* =========================
   BOX CLICK
========================= */

gachaBox.addEventListener(
    "click",
    openGacha
);


/* =========================
   INITIAL RESULT
========================= */

resultRarity.textContent = "---";


console.log("CYBER GACHA READY");
```
