"use strict";

/* =========================================
   CYBER GACHA
========================================= */

/* =========================
   確率
========================= */

const R_RATE = 90;
const SR_RATE = 8.5;
const SSR_RATE = 1.4999;
const XR_RATE = 0.0001;

/* =========================
   保証
========================= */

const SSR_GUARANTEE = 200;
const XR_GUARANTEE = 15000;

/* =========================
   DOM
========================= */

const gachaBox = document.getElementById("gachaBox");
const gachaArea = document.getElementById("gachaArea");

const resultRarity = document.getElementById("resultRarity");
const historyList = document.getElementById("historyList");

const ssrOverlay = document.getElementById("ssrOverlay");
const xrOverlay = document.getElementById("xrOverlay");

const ssrContinue = document.getElementById("ssrContinue");
const xrContinue = document.getElementById("xrContinue");

const ssrCounter = document.getElementById("ssrCounter");
const xrCounter = document.getElementById("xrCounter");

const ssrBar = document.getElementById("ssrBar");
const xrBar = document.getElementById("xrBar");

const chargeMessage = document.getElementById("chargeMessage");

const boxScreenSmall = document.getElementById("boxScreenSmall");
const boxScreenMain = document.getElementById("boxScreenMain");

const crystalContainer =
    document.getElementById("crystalContainer");

const particleContainer =
    document.getElementById("particleContainer");

const beamContainer =
    document.getElementById("beamContainer");

const shockwaveContainer =
    document.getElementById("shockwaveContainer");

const ldmButton =
    document.getElementById("ldmButton");

const skipButton =
    document.getElementById("skipButton");

const resetButton =
    document.getElementById("resetButton");

/* =========================
   状態
========================= */

let isRolling = false;
let animationTimers = [];

/* =========================
   LDM
========================= */

let ldmMode =
    localStorage.getItem("cyberGachaLDM") === "true";

function updateLDM() {

    document.body.classList.toggle(
        "ldm-mode",
        ldmMode
    );

    ldmButton.textContent =
        ldmMode
            ? "LDM: ON"
            : "LDM: OFF";
}

ldmButton.addEventListener(
    "click",
    function () {

        if (isRolling) return;

        ldmMode = !ldmMode;

        localStorage.setItem(
            "cyberGachaLDM",
            String(ldmMode)
        );

        updateLDM();
    }
);

/* =========================
   SKIP
========================= */

let skipMode =
    localStorage.getItem("cyberGachaSkip") === "true";

function updateSkip() {

    skipButton.textContent =
        skipMode
            ? "SKIP: ON"
            : "SKIP: OFF";
}

skipButton.addEventListener(
    "click",
    function () {

        if (isRolling) return;

        skipMode = !skipMode;

        localStorage.setItem(
            "cyberGachaSkip",
            String(skipMode)
        );

        updateSkip();
    }
);

/* =========================
   カウンター
========================= */

let ssrCount =
    Number(
        localStorage.getItem(
            "cyberGachaSSRCount"
        )
    );

let xrCount =
    Number(
        localStorage.getItem(
            "cyberGachaXRCount"
        )
    );

if (
    !Number.isFinite(ssrCount) ||
    ssrCount < 0 ||
    ssrCount >= SSR_GUARANTEE
) {
    ssrCount = 0;
}

if (
    !Number.isFinite(xrCount) ||
    xrCount < 0 ||
    xrCount >= XR_GUARANTEE
) {
    xrCount = 0;
}

/* =========================
   カウンター保存
========================= */

function saveCounters() {

    localStorage.setItem(
        "cyberGachaSSRCount",
        String(ssrCount)
    );

    localStorage.setItem(
        "cyberGachaXRCount",
        String(xrCount)
    );
}

function updateCounters() {

    ssrCounter.textContent =
        ssrCount + " / " + SSR_GUARANTEE;

    xrCounter.textContent =
        xrCount + " / " + XR_GUARANTEE;

    ssrBar.style.width =
        Math.min(
            (ssrCount / SSR_GUARANTEE) * 100,
            100
        ) + "%";

    xrBar.style.width =
        Math.min(
            (xrCount / XR_GUARANTEE) * 100,
            100
        ) + "%";

    saveCounters();
}

/* =========================
   RESET DATA
========================= */

resetButton.addEventListener(
    "click",
    function () {

        if (isRolling) return;

        const ok = confirm(
            "ガチャの記録をすべてリセットしますか？\n\n" +
            "SSR・XRカウンターと履歴が消去されます。\n" +
            "LDM / SKIP設定は維持されます。"
        );

        if (!ok) return;

        ssrCount = 0;
        xrCount = 0;

        localStorage.removeItem(
            "cyberGachaHistory"
        );

        localStorage.setItem(
            "cyberGachaSSRCount",
            "0"
        );

        localStorage.setItem(
            "cyberGachaXRCount",
            "0"
        );

        historyList.innerHTML = "";

        resultRarity.textContent = "---";

        clearAnimationClasses();
        clearEffects();
        closeOverlays();

        updateCounters();

        setChargeMessage(
            "SYSTEM",
            "SYSTEM READY"
        );
    }
);

/* =========================
   抽選
========================= */

function drawRarity() {

    const random =
        Math.random() * 100;

    if (random < R_RATE) {
        return "R";
    }

    if (
        random <
        R_RATE + SR_RATE
    ) {
        return "SR";
    }

    if (
        random <
        R_RATE +
        SR_RATE +
        SSR_RATE
    ) {
        return "SSR";
    }

    return "XR";
}

/* =========================
   結果表示
========================= */

function showResult(rarity) {

    resultRarity.textContent = rarity;

    if (rarity === "R") {

        resultRarity.style.color =
            "#00eaff";

        resultRarity.style.textShadow =
            "0 0 15px #00eaff, 0 0 40px #00eaff";

    } else if (rarity === "SR") {

        resultRarity.style.color =
            "#55ff99";

        resultRarity.style.textShadow =
            "0 0 15px #55ff99, 0 0 40px #55ff99";

    } else if (rarity === "SSR") {

        resultRarity.style.color =
            "#ffcc33";

        resultRarity.style.textShadow =
            "0 0 20px #ffcc33, 0 0 50px #ffcc33";

    } else {

        resultRarity.style.color =
            "white";

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

    if (rarity === "SR") {

        item.style.color =
            "#55ff99";

        item.style.borderColor =
            "#55ff99";

    } else if (rarity === "SSR") {

        item.style.color =
            "#ffcc33";

        item.style.borderColor =
            "#ffcc33";

    } else if (rarity === "XR") {

        item.style.color =
            "white";

        item.style.borderColor =
            "white";
    }

    historyList.prepend(item);
}

/* =========================
   エフェクト削除
========================= */

function clearCrystals() {
    crystalContainer.innerHTML = "";
}

function clearParticles() {
    particleContainer.innerHTML = "";
}

function clearBeams() {
    beamContainer.innerHTML = "";
}

function clearEffects() {

    clearCrystals();
    clearParticles();
    clearBeams();

    shockwaveContainer.className = "";
    shockwaveContainer.style.borderColor = "";
}

/* =========================
   タイマー管理
========================= */

function clearTimers() {

    animationTimers.forEach(
        timer => clearTimeout(timer)
    );

    animationTimers = [];
}

function wait(callback, time) {

    const timer =
        setTimeout(callback, time);

    animationTimers.push(timer);

    return timer;
}

/* =========================
   クリスタル
========================= */

function createCrystals(rarity) {

    clearCrystals();

    if (ldmMode) return;

    let count = 45;

    if (rarity === "SR") {
        count = 75;
    }

    if (rarity === "SSR") {
        count = 130;
    }

    if (rarity === "XR") {
        count = 220;
    }

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const crystal =
            document.createElement("div");

        crystal.className =
            "crystal";

        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            220 +
            Math.random() *
            230;

        crystal.style.setProperty(
            "--startX",
            Math.cos(angle) *
            distance +
            "px"
        );

        crystal.style.setProperty(
            "--startY",
            Math.sin(angle) *
            distance +
            "px"
        );

        crystal.style.setProperty(
            "--size",
            4 +
            Math.random() *
            10 +
            "px"
        );

        crystal.style.setProperty(
            "--duration",
            0.8 +
            Math.random() *
            1.5 +
            "s"
        );

        crystal.style.setProperty(
            "--delay",
            Math.random() *
            1.1 +
            "s"
        );

        crystal.style.setProperty(
            "--rotation",
            Math.random() *
            360 +
            "deg"
        );

        if (rarity === "SR") {
            crystal.classList.add("crystal-sr");
        }

        if (rarity === "SSR") {
            crystal.classList.add("crystal-ssr");
        }

        if (rarity === "XR") {
            crystal.classList.add("crystal-xr");
        }

        crystalContainer.appendChild(crystal);
    }
}

/* =========================
   パーティクル
========================= */

function createParticles(rarity) {

    clearParticles();

    if (ldmMode) return;

    let count = 30;

    if (rarity === "SR") {
        count = 50;
    }

    if (rarity === "SSR") {
        count = 90;
    }

    if (rarity === "XR") {
        count = 150;
    }

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement("div");

        particle.className =
            "particle";

        particle.style.setProperty(
            "--radius",
            100 +
            Math.random() *
            240 +
            "px"
        );

        particle.style.setProperty(
            "--size",
            2 +
            Math.random() *
            5 +
            "px"
        );

        particle.style.setProperty(
            "--duration",
            0.8 +
            Math.random() *
            2 +
            "s"
        );

        particle.style.setProperty(
            "--delay",
            Math.random() + "s"
        );

        if (rarity === "SR") {
            particle.classList.add("particle-sr");
        }

        if (rarity === "SSR") {
            particle.classList.add("particle-ssr");
        }

        if (rarity === "XR") {
            particle.classList.add("particle-xr");
        }

        particleContainer.appendChild(particle);
    }
}

/* =========================
   ビーム
========================= */

function createBeams(rarity) {

    clearBeams();

    if (ldmMode) return;

    let count = 8;

    if (rarity === "SR") {
        count = 10;
    }

    if (rarity === "SSR") {
        count = 18;
    }

    if (rarity === "XR") {
        count = 28;
    }

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const beam =
            document.createElement("div");

        beam.className =
            "beam";

        beam.style.setProperty(
            "--angle",
            i *
            (360 / count) +
            "deg"
        );

        if (rarity === "SR") {
            beam.classList.add("beam-sr");
        }

        if (rarity === "SSR") {
            beam.classList.add("beam-ssr");
        }

        if (rarity === "XR") {
            beam.classList.add("beam-xr");
        }

        beamContainer.appendChild(beam);
    }
}

/* =========================
   衝撃波
========================= */

function triggerShockwave(rarity) {

    if (ldmMode) return;

    shockwaveContainer.className = "";

    void shockwaveContainer.offsetWidth;

    if (rarity === "SSR") {

        shockwaveContainer.style.borderColor =
            "#ffcc33";

    } else if (rarity === "XR") {

        shockwaveContainer.style.borderColor =
            "white";

    } else if (rarity === "SR") {

        shockwaveContainer.style.borderColor =
            "#55ff99";

    } else {

        shockwaveContainer.style.borderColor =
            "#00eaff";
    }

    shockwaveContainer.classList.add("active");
}

/* =========================
   メッセージ
========================= */

function setChargeMessage(small, main) {

    boxScreenSmall.textContent = small;
    boxScreenMain.textContent = main;
    chargeMessage.textContent = main;
}

/* =========================
   アニメーション解除
========================= */

function clearAnimationClasses() {

    gachaArea.classList.remove(
        "charging",
        "limitBreak",
        "rare-r",
        "rare-sr",
        "rare-ssr",
        "rare-xr",
        "flash",
        "flash-ssr",
        "flash-xr",
        "reveal"
    );

    gachaBox.classList.remove(
        "charging"
    );
}

/* =========================
   OVERLAY
========================= */

function closeOverlays() {

    ssrOverlay.classList.remove("show");
    xrOverlay.classList.remove("show");
}

/* =========================
   通常演出
========================= */

function normalAnimation(rarity) {

    const isSSR =
        rarity === "SSR";

    const isXR =
        rarity === "XR";

    /*
       R / SR
       約2.5秒
    */

    if (!isSSR && !isXR) {

        setChargeMessage(
            "SYSTEM",
            "SYSTEM CHECK"
        );

        wait(() => {
            setChargeMessage(
                "SCANNING",
                "TARGET LOCK"
            );
        }, 350);

        wait(() => {
            setChargeMessage(
                "ENERGY",
                "ENERGY CHARGE"
            );
        }, 700);

        wait(() => {
            setChargeMessage(
                "CORE",
                "CORE OVERLOAD"
            );
        }, 1050);

        wait(() => {
            setChargeMessage(
                "WARNING",
                "ENERGY LIMIT"
            );

            gachaArea.classList.add(
                "limitBreak"
            );

            triggerShockwave(rarity);
        }, 1400);

        wait(() => {
            setChargeMessage(
                "CRITICAL",
                "LIMIT BREAK"
            );

            triggerShockwave(rarity);
        }, 1750);

        wait(() => {
            setChargeMessage(
                "SYSTEM",
                "RELEASE"
            );
        }, 2050);

        wait(() => {
            revealResult(rarity);
        }, 2300);

        return;
    }

    /*
       =========================
       SSR SPECIAL
       約9秒
       =========================
    */

    if (isSSR) {

        setChargeMessage(
            "SYSTEM",
            "SYSTEM CHECK"
        );

        wait(() => {
            setChargeMessage(
                "SCANNING",
                "TARGET LOCK"
            );
        }, 700);

        wait(() => {
            setChargeMessage(
                "SIGNAL",
                "RARE SIGNAL"
            );
        }, 1400);

        wait(() => {
            setChargeMessage(
                "ENERGY",
                "ENERGY CHARGE"
            );

            triggerShockwave("SSR");
        }, 2200);

        wait(() => {
            setChargeMessage(
                "CORE",
                "CORE OVERLOAD"
            );

            gachaArea.classList.add(
                "limitBreak"
            );
        }, 3100);

        wait(() => {
            setChargeMessage(
                "WARNING",
                "ENERGY LIMIT"
            );

            triggerShockwave("SSR");
        }, 4000);

        wait(() => {
            setChargeMessage(
                "CRITICAL",
                "LIMIT BREAK"
            );

            triggerShockwave("SSR");
        }, 5000);

        wait(() => {
            setChargeMessage(
                "SIGNAL",
                "SSR SIGNATURE"
            );

            createCrystals("SSR");
            createParticles("SSR");
            createBeams("SSR");
        }, 6000);

        wait(() => {
            setChargeMessage(
                "SYSTEM",
                "FINAL RELEASE"
            );

            triggerShockwave("SSR");
        }, 7100);

        wait(() => {
            gachaArea.classList.remove(
                "charging",
                "limitBreak"
            );

            gachaBox.classList.remove(
                "charging"
            );

            if (!ldmMode) {
                gachaArea.classList.add(
                    "flash-ssr"
                );
            }

            setChargeMessage(
                "RESULT",
                "SSR CONFIRMED"
            );

        }, 8000);

        wait(() => {
            revealResult("SSR");
        }, 8500);

        return;
    }

    /*
       =========================
       XR SPECIAL VIDEO
       約20秒
       =========================
    */

    setChargeMessage(
        "SYSTEM",
        "SYSTEM INITIALIZING"
    );

    wait(() => {

        setChargeMessage(
            "SCANNING",
            "TARGET LOCK"
        );

    }, 1000);

    wait(() => {

        setChargeMessage(
            "SIGNAL",
            "ANOMALY DETECTED"
        );

        triggerShockwave("XR");

    }, 2200);

    wait(() => {

        setChargeMessage(
            "CORE",
            "CORE AWAKENING"
        );

        createCrystals("XR");
        createParticles("XR");

    }, 3400);

    wait(() => {

        setChargeMessage(
            "WARNING",
            "UNKNOWN ENERGY"
        );

        triggerShockwave("XR");

    }, 4700);

    wait(() => {

        setChargeMessage(
            "SYSTEM",
            "SIGNAL LOST"
        );

        clearBeams();

    }, 6000);

    wait(() => {

        setChargeMessage(
            "SYSTEM",
            "SYSTEM REBOOT"
        );

        clearEffects();

    }, 7200);

    wait(() => {

        setChargeMessage(
            "SIGNAL",
            "SIGNATURE DETECTED"
        );

        createCrystals("XR");
        createParticles("XR");
        createBeams("XR");

    }, 8500);

    wait(() => {

        setChargeMessage(
            "CORE",
            "XR CORE AWAKENING"
        );

        triggerShockwave("XR");

    }, 10000);

    wait(() => {

        setChargeMessage(
            "WARNING",
            "ENERGY LIMIT EXCEEDED"
        );

        gachaArea.classList.add(
            "limitBreak"
        );

        triggerShockwave("XR");

    }, 11500);

    wait(() => {

        setChargeMessage(
            "CRITICAL",
            "DIMENSION BREAK"
        );

        createCrystals("XR");
        createParticles("XR");
        createBeams("XR");

        triggerShockwave("XR");

    }, 13000);

    wait(() => {

        setChargeMessage(
            "UNKNOWN",
            "EXTREME RARE"
        );

        triggerShockwave("XR");

    }, 14500);

    wait(() => {

        setChargeMessage(
            "SYSTEM",
            "FINAL RELEASE"
        );

        if (!ldmMode) {
            gachaArea.classList.add(
                "flash-xr"
            );
        }

        triggerShockwave("XR");

    }, 16000);

    wait(() => {

        setChargeMessage(
            "SYSTEM",
            "XR CONFIRMED"
        );

    }, 17500);

    wait(() => {

        gachaArea.classList.remove(
            "charging",
            "limitBreak"
        );

        gachaBox.classList.remove(
            "charging"
        );

        revealResult("XR");

    }, 19000);
}

/* =========================
   結果確定
========================= */

function revealResult(rarity) {

    gachaArea.classList.remove(
        "charging",
        "limitBreak"
    );

    gachaBox.classList.remove(
        "charging"
    );

    if (!ldmMode) {

        if (rarity === "XR") {

            gachaArea.classList.add(
                "flash-xr"
            );

        } else if (rarity === "SSR") {

            gachaArea.classList.add(
                "flash-ssr"
            );

        } else {

            gachaArea.classList.add(
                "flash"
            );
        }
    }

    setChargeMessage(
        "RESULT",
        "REVEAL"
    );

    wait(() => {

        gachaArea.classList.add(
            "reveal"
        );

        showResult(rarity);
        addHistory(rarity);

        if (rarity === "SSR") {

            wait(() => {
                ssrOverlay.classList.add(
                    "show"
                );
            }, 700);

        } else if (rarity === "XR") {

            wait(() => {
                xrOverlay.classList.add(
                    "show"
                );
            }, 1000);

        } else {

            wait(() => {

                clearAnimationClasses();
                clearEffects();

                setChargeMessage(
                    "SYSTEM",
                    "SYSTEM READY"
                );

                isRolling = false;

            }, 1000);
        }

    }, 250);
}

/* =========================
   SKIP
========================= */

function skipResult(rarity) {

    clearTimers();
    clearAnimationClasses();
    clearEffects();

    gachaArea.classList.add(
        "rare-" +
        rarity.toLowerCase()
    );

    gachaArea.classList.add(
        "reveal"
    );

    setChargeMessage(
        "RESULT",
        "REVEAL"
    );

    showResult(rarity);
    addHistory(rarity);

    wait(() => {

        clearAnimationClasses();
        clearEffects();

        setChargeMessage(
            "SYSTEM",
            "SYSTEM READY"
        );

        isRolling = false;

    }, 350);
}

/* =========================
   ガチャ開始
========================= */

function openGacha() {

    if (isRolling) return;

    isRolling = true;

    clearTimers();
    closeOverlays();
    clearAnimationClasses();
    clearEffects();

    let rarity =
        drawRarity();

    const nextSSRCount =
        ssrCount + 1;

    const nextXRCount =
        xrCount + 1;

    /*
       XR保証最優先
    */

    if (
        nextXRCount >=
        XR_GUARANTEE
    ) {

        rarity = "XR";

    } else if (
        nextSSRCount >=
        SSR_GUARANTEE
    ) {

        rarity = "SSR";
    }

    /*
       カウンター
    */

    if (rarity === "XR") {

        ssrCount = 0;
        xrCount = 0;

    } else if (rarity === "SSR") {

        ssrCount = 0;
        xrCount = nextXRCount;

    } else {

        ssrCount = nextSSRCount;
        xrCount = nextXRCount;
    }

    updateCounters();

    /*
       SKIP
       R / SRのみ
    */

    if (
        skipMode &&
        rarity !== "SSR" &&
        rarity !== "XR"
    ) {

        skipResult(rarity);

        return;
    }

    /*
       レア度クラス
    */

    gachaArea.classList.add(
        "rare-" +
        rarity.toLowerCase()
    );

    /*
       エフェクト
    */

    createCrystals(rarity);
    createParticles(rarity);
    createBeams(rarity);

    gachaArea.classList.add(
        "charging"
    );

    gachaBox.classList.add(
        "charging"
    );

    /*
       演出開始
    */

    normalAnimation(rarity);
}

/* =========================
   CONTINUE
========================= */

ssrContinue.addEventListener(
    "click",
    function () {

        ssrOverlay.classList.remove(
            "show"
        );

        clearTimers();
        clearAnimationClasses();
        clearEffects();

        setChargeMessage(
            "SYSTEM",
            "SYSTEM READY"
        );

        isRolling = false;
    }
);

xrContinue.addEventListener(
    "click",
    function () {

        xrOverlay.classList.remove(
            "show"
        );

        clearTimers();
        clearAnimationClasses();
        clearEffects();

        setChargeMessage(
            "SYSTEM",
            "SYSTEM READY"
        );

        isRolling = false;
    }
);

/* =========================
   BOX CLICK
========================= */

gachaBox.addEventListener(
    "click",
    function () {
        openGacha();
    }
);

/* =========================
   初期化
========================= */

resultRarity.textContent = "---";

updateLDM();
updateSkip();
updateCounters();

setChargeMessage(
    "CYBER",
    "GACHA"
);

console.log(
    "CYBER GACHA READY"
);

console.log(
    "SSR GUARANTEE:",
    SSR_GUARANTEE
);

console.log(
    "XR GUARANTEE:",
    XR_GUARANTEE
);
