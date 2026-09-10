"use strict";


/* =========================================================
   CYBER GACHA
   ========================================================= */


/* =========================================================
   基本確率
   ========================================================= */

const R_RATE = 90;
const SR_RATE = 8.5;
const SSR_RATE = 1.4999;
const XR_RATE = 0.0001;


/* =========================================================
   保証回数
   ========================================================= */

const SSR_GUARANTEE = 200;
const XR_GUARANTEE = 15000;


/* =========================================================
   確率設定
   ========================================================= */

const PROBABILITY_STORAGE_KEY =
    "cyberGachaSimulationRates";


const DEFAULT_PROBABILITIES = {

    R: R_RATE,
    SR: SR_RATE,
    SSR: SSR_RATE,
    XR: XR_RATE

};


let simulationProbabilities =
    loadSimulationProbabilities();


/* =========================================================
   DOM
   ========================================================= */

const gachaBox =
    document.getElementById("gachaBox");


const gachaArea =
    document.getElementById("gachaArea");


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


const ssrCounter =
    document.getElementById("ssrCounter");


const xrCounter =
    document.getElementById("xrCounter");


const ssrBar =
    document.getElementById("ssrBar");


const xrBar =
    document.getElementById("xrBar");


const chargeMessage =
    document.getElementById("chargeMessage");


const boxScreenSmall =
    document.getElementById("boxScreenSmall");


const boxScreenMain =
    document.getElementById("boxScreenMain");


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


/* =========================================================
   ADMIN DOM
   ========================================================= */

const adminButton =
    document.getElementById("adminButton");


const adminOverlay =
    document.getElementById("adminOverlay");


const adminClose =
    document.getElementById("adminClose");


const adminCloseBottom =
    document.getElementById("adminCloseBottom");


const adminRRate =
    document.getElementById("adminRRate");


const adminSRRate =
    document.getElementById("adminSRRate");


const adminSSRRate =
    document.getElementById("adminSSRRate");


const adminXRRate =
    document.getElementById("adminXRRate");


const adminTotal =
    document.getElementById("adminTotal");


const adminStatus =
    document.getElementById("adminStatus");


const adminSaveProbability =
    document.getElementById(
        "adminSaveProbability"
    );


/* =========================================================
   状態
   ========================================================= */

let isRolling = false;


/* =========================================================
   LDM
   ========================================================= */

let ldmMode =
    localStorage.getItem(
        "cyberGachaLDM"
    ) === "true";


function updateLDM() {

    document.body.classList.toggle(
        "ldm-mode",
        ldmMode
    );


    if (ldmButton) {

        ldmButton.textContent =
            ldmMode
                ? "LDM: ON"
                : "LDM: OFF";

    }

}


if (ldmButton) {

    ldmButton.addEventListener(
        "click",
        function () {

            if (isRolling) {

                return;

            }


            ldmMode =
                !ldmMode;


            localStorage.setItem(
                "cyberGachaLDM",
                String(ldmMode)
            );


            updateLDM();

        }
    );

}


/* =========================================================
   SKIP
   ========================================================= */

let skipMode =
    localStorage.getItem(
        "cyberGachaSkip"
    ) === "true";


function updateSkip() {

    if (!skipButton) {

        return;

    }


    skipButton.textContent =
        skipMode
            ? "SKIP: ON"
            : "SKIP: OFF";

}


if (skipButton) {

    skipButton.addEventListener(
        "click",
        function () {

            if (isRolling) {

                return;

            }


            skipMode =
                !skipMode;


            localStorage.setItem(
                "cyberGachaSkip",
                String(skipMode)
            );


            updateSkip();

        }
    );

}


/* =========================================================
   カウンター
   ========================================================= */

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


/* =========================================================
   カウンター保存
   ========================================================= */

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


/* =========================================================
   カウンター表示
   ========================================================= */

function updateCounters() {

    if (ssrCounter) {

        ssrCounter.textContent =
            ssrCount +
            " / " +
            SSR_GUARANTEE;

    }


    if (xrCounter) {

        xrCounter.textContent =
            xrCount +
            " / " +
            XR_GUARANTEE;

    }


    const ssrProgress =
        (
            ssrCount /
            SSR_GUARANTEE
        ) *
        100;


    const xrProgress =
        (
            xrCount /
            XR_GUARANTEE
        ) *
        100;


    if (ssrBar) {

        ssrBar.style.width =
            Math.min(
                ssrProgress,
                100
            ) + "%";

    }


    if (xrBar) {

        xrBar.style.width =
            Math.min(
                xrProgress,
                100
            ) + "%";

    }


    saveCounters();

}


/* =========================================================
   確率設定読み込み
   ========================================================= */

function loadSimulationProbabilities() {

    try {

        const saved =
            localStorage.getItem(
                PROBABILITY_STORAGE_KEY
            );


        if (!saved) {

            return {
                ...DEFAULT_PROBABILITIES
            };

        }


        const parsed =
            JSON.parse(saved);


        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            return {
                ...DEFAULT_PROBABILITIES
            };

        }


        const R =
            Number(parsed.R);


        const SR =
            Number(parsed.SR);


        const SSR =
            Number(parsed.SSR);


        const XR =
            Number(parsed.XR);


        const values = [
            R,
            SR,
            SSR,
            XR
        ];


        if (
            values.some(
                function (value) {

                    return (
                        !Number.isFinite(value) ||
                        value < 0
                    );

                }
            )
        ) {

            return {
                ...DEFAULT_PROBABILITIES
            };

        }


        const total =
            R +
            SR +
            SSR +
            XR;


        if (
            Math.abs(total - 100) >
            0.0000001
        ) {

            return {
                ...DEFAULT_PROBABILITIES
            };

        }


        return {

            R: R,
            SR: SR,
            SSR: SSR,
            XR: XR

        };

    }
    catch (error) {

        console.warn(
            "Probability config could not be loaded.",
            error
        );


        return {
            ...DEFAULT_PROBABILITIES
        };

    }

}


/* =========================================================
   抽選
   ========================================================= */

function drawRarity() {

    const random =
        Math.random() * 100;


    const R =
        simulationProbabilities.R;


    const SR =
        simulationProbabilities.SR;


    const SSR =
        simulationProbabilities.SSR;


    if (
        random < R
    ) {

        return "R";

    }


    if (
        random <
        R + SR
    ) {

        return "SR";

    }


    if (
        random <
        R +
        SR +
        SSR
    ) {

        return "SSR";

    }


    return "XR";

}


/* =========================================================
   結果表示
   ========================================================= */

function showResult(
    rarity
) {

    if (!resultRarity) {

        return;

    }


    resultRarity.textContent =
        rarity;


    if (
        rarity === "R"
    ) {

        resultRarity.style.color =
            "#00eaff";


        resultRarity.style.textShadow =
            "0 0 15px #00eaff, 0 0 40px #00eaff";

    }


    else if (
        rarity === "SR"
    ) {

        resultRarity.style.color =
            "#55ff99";


        resultRarity.style.textShadow =
            "0 0 15px #55ff99, 0 0 40px #55ff99";

    }


    else if (
        rarity === "SSR"
    ) {

        resultRarity.style.color =
            "#ffcc33";


        resultRarity.style.textShadow =
            "0 0 20px #ffcc33, 0 0 50px #ffcc33";

    }


    else {

        resultRarity.style.color =
            "white";


        resultRarity.style.textShadow =
            "0 0 20px white, 0 0 50px white";

    }

}


/* =========================================================
   HISTORY
   ========================================================= */

function addHistory(
    rarity
) {

    if (!historyList) {

        return;

    }


    const item =
        document.createElement("div");


    item.className =
        "historyItem";


    item.textContent =
        rarity;


    if (
        rarity === "SR"
    ) {

        item.style.color =
            "#55ff99";


        item.style.borderColor =
            "#55ff99";

    }


    else if (
        rarity === "SSR"
    ) {

        item.style.color =
            "#ffcc33";


        item.style.borderColor =
            "#ffcc33";

    }


    else if (
        rarity === "XR"
    ) {

        item.style.color =
            "white";


        item.style.borderColor =
            "white";

    }


    else {

        item.style.color =
            "#00eaff";


        item.style.borderColor =
            "#00eaff";

    }


    historyList.prepend(item);

}


/* =========================================================
   エフェクト削除
   ========================================================= */

function clearCrystals() {

    if (crystalContainer) {

        crystalContainer.innerHTML =
            "";

    }

}


function clearParticles() {

    if (particleContainer) {

        particleContainer.innerHTML =
            "";

    }

}


function clearBeams() {

    if (beamContainer) {

        beamContainer.innerHTML =
            "";

    }

}


function clearEffects() {

    clearCrystals();

    clearParticles();

    clearBeams();


    if (shockwaveContainer) {

        shockwaveContainer.className =
            "";


        shockwaveContainer.style.borderColor =
            "";

    }

}


/* =========================================================
   クリスタル
   ========================================================= */

function createCrystals(
    rarity
) {

    clearCrystals();


    if (
        ldmMode ||
        !crystalContainer
    ) {

        return;

    }


    let count =
        45;


    if (
        rarity === "SR"
    ) {

        count =
            75;

    }


    else if (
        rarity === "SSR"
    ) {

        count =
            110;

    }


    else if (
        rarity === "XR"
    ) {

        count =
            160;

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
            (
                4 +
                Math.random() *
                10
            ) + "px"
        );


        crystal.style.setProperty(
            "--duration",
            (
                0.8 +
                Math.random() *
                1.5
            ) + "s"
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


        if (
            rarity === "SR"
        ) {

            crystal.classList.add(
                "crystal-sr"
            );

        }


        else if (
            rarity === "SSR"
        ) {

            crystal.classList.add(
                "crystal-ssr"
            );

        }


        else if (
            rarity === "XR"
        ) {

            crystal.classList.add(
                "crystal-xr"
            );

        }


        crystalContainer.appendChild(
            crystal
        );

    }

}


/* =========================================================
   パーティクル
   ========================================================= */

function createParticles(
    rarity
) {

    clearParticles();


    if (
        ldmMode ||
        !particleContainer
    ) {

        return;

    }


    let count =
        30;


    if (
        rarity === "SR"
    ) {

        count =
            50;

    }


    else if (
        rarity === "SSR"
    ) {

        count =
            75;

    }


    else if (
        rarity === "XR"
    ) {

        count =
            110;

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
            (
                100 +
                Math.random() *
                240
            ) + "px"
        );


        particle.style.setProperty(
            "--size",
            (
                2 +
                Math.random() *
                5
            ) + "px"
        );


        particle.style.setProperty(
            "--duration",
            (
                0.8 +
                Math.random() *
                2
            ) + "s"
        );


        particle.style.setProperty(
            "--delay",
            Math.random() +
            "s"
        );


        if (
            rarity === "SR"
        ) {

            particle.classList.add(
                "particle-sr"
            );

        }


        else if (
            rarity === "SSR"
        ) {

            particle.classList.add(
                "particle-ssr"
            );

        }


        else if (
            rarity === "XR"
        ) {

            particle.classList.add(
                "particle-xr"
            );

        }


        particleContainer.appendChild(
            particle
        );

    }

}


/* =========================================================
   ビーム
   ========================================================= */

function createBeams(
    rarity
) {

    clearBeams();


    if (
        ldmMode ||
        !beamContainer
    ) {

        return;

    }


    let count =
        8;


    if (
        rarity === "SR"
    ) {

        count =
            10;

    }


    else if (
        rarity === "SSR"
    ) {

        count =
            14;

    }


    else if (
        rarity === "XR"
    ) {

        count =
            20;

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
            (
                i *
                (
                    360 /
                    count
                )
            ) +
            "deg"
        );


        if (
            rarity === "SR"
        ) {

            beam.classList.add(
                "beam-sr"
            );

        }


        else if (
            rarity === "SSR"
        ) {

            beam.classList.add(
                "beam-ssr"
            );

        }


        else if (
            rarity === "XR"
        ) {

            beam.classList.add(
                "beam-xr"
            );

        }


        beamContainer.appendChild(
            beam
        );

    }

}


/* =========================================================
   衝撃波
   ========================================================= */

function triggerShockwave(
    rarity
) {

    if (
        ldmMode ||
        !shockwaveContainer
    ) {

        return;

    }


    shockwaveContainer.className =
        "";


    void shockwaveContainer.offsetWidth;


    if (
        rarity === "SSR"
    ) {

        shockwaveContainer.style.borderColor =
            "#ffcc33";

    }


    else if (
        rarity === "XR"
    ) {

        shockwaveContainer.style.borderColor =
            "white";

    }


    else if (
        rarity === "SR"
    ) {

        shockwaveContainer.style.borderColor =
            "#55ff99";

    }


    else {

        shockwaveContainer.style.borderColor =
            "#00eaff";

    }


    shockwaveContainer.classList.add(
        "active"
    );

}


/* =========================================================
   メッセージ
   ========================================================= */

function setChargeMessage(
    small,
    main
) {

    if (boxScreenSmall) {

        boxScreenSmall.textContent =
            small;

    }


    if (boxScreenMain) {

        boxScreenMain.textContent =
            main;

    }


    if (chargeMessage) {

        chargeMessage.textContent =
            main;

    }

}


/* =========================================================
   アニメーション解除
   ========================================================= */

function clearAnimationClasses() {

    if (gachaArea) {

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

            "reveal",

            "xr-special-active"

        );

    }


    if (gachaBox) {

        gachaBox.classList.remove(
            "charging"
        );

    }

}


/* =========================================================
   通常オーバーレイ
   ========================================================= */

function closeOverlays() {

    if (ssrOverlay) {

        ssrOverlay.classList.remove(
            "show"
        );

    }


    if (xrOverlay) {

        xrOverlay.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   XR専用演出システム
   ========================================================= */


/*
    XR専用DOMをJSから生成。

    index.htmlを追加変更しなくても
    XR演出を成立させる。
*/

let xrSpecialScene = null;


let xrSpecialTimers = [];


function clearXRSpecialTimers() {

    xrSpecialTimers.forEach(
        function (timer) {

            clearTimeout(timer);

        }
    );


    xrSpecialTimers = [];

}


function xrDelay(
    callback,
    delay
) {

    const timer =
        setTimeout(
            callback,
            delay
        );


    xrSpecialTimers.push(
        timer
    );


    return timer;

}


/* =========================================================
   XR専用CSS
   ========================================================= */

function injectXRSpecialCSS() {

    if (
        document.getElementById(
            "xrSpecialCSS"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "xrSpecialCSS";


    style.textContent = `

        /* =================================================
           XR SPECIAL SCENE
        ================================================= */

        #xrSpecialScene {

            position: fixed;

            inset: 0;

            z-index: 99999;

            overflow: hidden;

            display: none;

            background:
                radial-gradient(
                    circle at 50% 45%,
                    rgba(5, 20, 35, 0.18),
                    rgba(0, 0, 0, 0.98) 58%,
                    #000 100%
                );

            perspective: 900px;

            transform-style: preserve-3d;

            pointer-events: none;

        }


        #xrSpecialScene.active {

            display: block;

            animation:
                xrSceneIn
                1.2s
                ease
                forwards;

        }


        #xrSpecialScene.ldm {

            background:
                radial-gradient(
                    circle at 50% 48%,
                    rgba(4, 14, 22, 0.16),
                    #000 72%
                );

        }


        @keyframes xrSceneIn {

            0% {

                opacity: 0;

            }

            100% {

                opacity: 1;

            }

        }


        /* =================================================
           遠景
        ================================================= */

        .xr-void {

            position: absolute;

            inset: 0;

            background:
                radial-gradient(
                    ellipse at center,
                    transparent 0%,
                    rgba(0, 0, 0, 0.4) 48%,
                    rgba(0, 0, 0, 0.96) 100%
                );

        }


        /* =================================================
           遠くの箱
        ================================================= */

        .xr-distance-box {

            position: absolute;

            left: 50%;

            top: 56%;

            width: 34px;

            height: 25px;

            transform:
                translate(-50%, -50%)
                translateZ(-500px)
                scale(0.42);

            transform-style: preserve-3d;

            opacity: 0;

        }


        .xr-distance-box.visible {

            animation:
                xrBoxAppear
                2.4s
                cubic-bezier(
                    0.2,
                    0.7,
                    0.2,
                    1
                )
                forwards;

        }


        @keyframes xrBoxAppear {

            0% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    translateZ(-650px)
                    scale(0.22);

            }

            45% {

                opacity: 0.65;

            }

            100% {

                opacity: 1;

                transform:
                    translate(-50%, -50%)
                    translateZ(-400px)
                    scale(0.58);

            }

        }


        .xr-box-body {

            position: absolute;

            width: 100%;

            height: 100%;

            border:
                1px solid
                rgba(190, 245, 255, 0.85);

            background:
                linear-gradient(
                    135deg,
                    #06111a,
                    #122633,
                    #02070b
                );

            box-shadow:
                0 0 8px
                rgba(100, 230, 255, 0.6),

                inset 0 0 8px
                rgba(100, 230, 255, 0.25);

            transform:
                rotateX(-8deg)
                rotateY(16deg);

            transform-style: preserve-3d;

        }


        .xr-box-body::before {

            content: "";

            position: absolute;

            inset: 3px;

            border:
                1px solid
                rgba(255, 255, 255, 0.18);

        }


        .xr-box-core {

            position: absolute;

            left: 50%;

            top: 50%;

            width: 5px;

            height: 5px;

            border-radius: 50%;

            transform:
                translate(-50%, -50%);

            background: white;

            box-shadow:
                0 0 5px white,
                0 0 14px #9ff6ff;

        }


        /* =================================================
           上からのライト
        ================================================= */

        .xr-spotlight {

            position: absolute;

            left: 50%;

            top: -15%;

            width: 130px;

            height: 78%;

            transform:
                translateX(-50%)
                perspective(600px)
                rotateX(7deg);

            transform-origin:
                top center;

            opacity: 0;

            background:
                linear-gradient(
                    180deg,
                    rgba(180, 245, 255, 0.0),
                    rgba(180, 245, 255, 0.04) 20%,
                    rgba(180, 245, 255, 0.11) 65%,
                    rgba(180, 245, 255, 0.28)
                );

            clip-path:
                polygon(
                    42% 0,
                    58% 0,
                    90% 100%,
                    10% 100%
                );

            filter:
                blur(1px);

        }


        .xr-spotlight.active {

            animation:
                xrSpotlight
                3.5s
                ease-in-out
                forwards;

        }


        @keyframes xrSpotlight {

            0% {

                opacity: 0;

            }

            25% {

                opacity: 0.15;

            }

            60% {

                opacity: 0.65;

            }

            100% {

                opacity: 0.95;

            }

        }


        /* =================================================
           箱のライトサークル
        ================================================= */

        .xr-box-light {

            position: absolute;

            left: 50%;

            top: 56%;

            width: 50px;

            height: 20px;

            border-radius: 50%;

            transform:
                translate(-50%, -50%)
                translateZ(-390px);

            opacity: 0;

            border:
                1px solid
                rgba(180, 245, 255, 0.5);

            box-shadow:
                0 0 10px
                rgba(120, 230, 255, 0.55);

        }


        .xr-box-light.active {

            animation:
                xrBoxLight
                2s
                ease
                forwards;

        }


        @keyframes xrBoxLight {

            0% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    translateZ(-390px)
                    scale(0.4);

            }

            100% {

                opacity: 0.9;

                transform:
                    translate(-50%, -50%)
                    translateZ(-390px)
                    scale(1.5);

            }

        }


        /* =================================================
           エネルギー収束コア
        ================================================= */

        .xr-energy-core {

            position: absolute;

            left: 50%;

            top: 56%;

            width: 35px;

            height: 35px;

            border-radius: 50%;

            transform:
                translate(-50%, -50%)
                translateZ(-350px)
                scale(0.15);

            opacity: 0;

            background:
                radial-gradient(
                    circle,
                    white 0%,
                    #d9fbff 8%,
                    #66eaff 25%,
                    rgba(0, 170, 255, 0.25) 55%,
                    transparent 72%
                );

            box-shadow:
                0 0 12px white,
                0 0 35px #55eaff,
                0 0 75px #008cff;

            filter:
                blur(0.3px);

        }


        .xr-energy-core.phase1 {

            animation:
                xrCorePhase1
                4s
                ease-in
                forwards;

        }


        .xr-energy-core.phase2 {

            animation:
                xrCorePhase2
                4.5s
                cubic-bezier(
                    0.15,
                    0.65,
                    0.2,
                    1
                )
                forwards;

        }


        .xr-energy-core.phase3 {

            animation:
                xrCorePhase3
                4s
                cubic-bezier(
                    0.1,
                    0.8,
                    0.1,
                    1
                )
                forwards;

        }


        @keyframes xrCorePhase1 {

            0% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    translateZ(-350px)
                    scale(0.05);

            }

            35% {

                opacity: 0.35;

            }

            100% {

                opacity: 0.8;

                transform:
                    translate(-50%, -50%)
                    translateZ(-350px)
                    scale(2.5);

            }

        }


        @keyframes xrCorePhase2 {

            0% {

                opacity: 0.8;

                transform:
                    translate(-50%, -50%)
                    translateZ(-350px)
                    scale(2.5);

            }

            50% {

                opacity: 0.95;

                transform:
                    translate(-50%, -50%)
                    translateZ(-100px)
                    scale(7);

            }

            100% {

                opacity: 1;

                transform:
                    translate(-50%, -50%)
                    translateZ(100px)
                    scale(13);

            }

        }


        @keyframes xrCorePhase3 {

            0% {

                opacity: 1;

                transform:
                    translate(-50%, -50%)
                    translateZ(100px)
                    scale(13);

            }

            55% {

                opacity: 1;

                transform:
                    translate(-50%, -50%)
                    translateZ(250px)
                    scale(22);

            }

            100% {

                opacity: 0.95;

                transform:
                    translate(-50%, -50%)
                    translateZ(400px)
                    scale(35);

            }

        }


        /* =================================================
           エネルギー粒子
        ================================================= */

        .xr-energy-particle {

            position: absolute;

            left: 50%;

            top: 50%;

            width: var(--size);

            height: var(--size);

            border-radius: 50%;

            background: white;

            box-shadow:
                0 0 5px white,
                0 0 14px #66eaff,
                0 0 28px #008cff;

            opacity: 0;

            transform:
                translate(
                    var(--sx),
                    var(--sy)
                )
                scale(0.3);

        }


        .xr-energy-particle.active {

            animation:
                xrEnergyFly
                var(--duration)
                cubic-bezier(
                    0.15,
                    0.8,
                    0.25,
                    1
                )
                var(--delay)
                forwards;

        }


        @keyframes xrEnergyFly {

            0% {

                opacity: 0;

                transform:
                    translate(
                        var(--sx),
                        var(--sy)
                    )
                    scale(0.15);

            }

            12% {

                opacity: 0.2;

            }

            45% {

                opacity: 0.85;

            }

            100% {

                opacity: 1;

                transform:
                    translate(0, 0)
                    scale(1.2);

            }

        }


        /* =================================================
           エネルギーリング
        ================================================= */

        .xr-energy-ring {

            position: absolute;

            left: 50%;

            top: 56%;

            width: 70px;

            height: 70px;

            border:
                1px solid
                rgba(100, 230, 255, 0.7);

            border-radius: 50%;

            transform:
                translate(-50%, -50%)
                translateZ(-150px)
                scale(0.2);

            opacity: 0;

            box-shadow:
                0 0 14px
                rgba(80, 230, 255, 0.55);

        }


        .xr-energy-ring.active {

            animation:
                xrEnergyRing
                3s
                ease-out
                var(--delay)
                infinite;

        }


        @keyframes xrEnergyRing {

            0% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    translateZ(-150px)
                    scale(0.2);

            }

            20% {

                opacity: 0.8;

            }

            100% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    translateZ(200px)
                    scale(8);

            }

        }


        /* =================================================
           巨大エネルギー球
        ================================================= */

        .xr-mega-energy {

            position: absolute;

            left: 50%;

            top: 56%;

            width: 70px;

            height: 70px;

            border-radius: 50%;

            transform:
                translate(-50%, -50%)
                scale(0.05);

            opacity: 0;

            background:
                radial-gradient(
                    circle,
                    rgba(255,255,255,1) 0%,
                    rgba(200,250,255,0.98) 5%,
                    rgba(70,220,255,0.85) 20%,
                    rgba(0,130,255,0.45) 45%,
                    rgba(0,60,160,0.15) 65%,
                    transparent 75%
                );

            box-shadow:
                0 0 30px white,
                0 0 80px #5eeeff,
                0 0 180px #008cff,
                0 0 300px rgba(0,100,255,0.7);

            filter:
                blur(0.2px);

        }


        .xr-mega-energy.grow {

            animation:
                xrMegaGrow
                4.5s
                cubic-bezier(
                    0.12,
                    0.7,
                    0.18,
                    1
                )
                forwards;

        }


        @keyframes xrMegaGrow {

            0% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    scale(0.05);

            }

            25% {

                opacity: 0.55;

                transform:
                    translate(-50%, -50%)
                    scale(0.35);

            }

            55% {

                opacity: 0.85;

                transform:
                    translate(-50%, -50%)
                    scale(1.8);

            }

            80% {

                opacity: 1;

                transform:
                    translate(-50%, -50%)
                    scale(5.5);

            }

            100% {

                opacity: 1;

                transform:
                    translate(-50%, -50%)
                    scale(11);

            }

        }


        /* =================================================
           限界突破リング
        ================================================= */

        .xr-limit-ring {

            position: absolute;

            left: 50%;

            top: 56%;

            width: 90px;

            height: 90px;

            border-radius: 50%;

            border:
                2px solid
                rgba(210,250,255,0.9);

            transform:
                translate(-50%, -50%)
                scale(0.1);

            opacity: 0;

            box-shadow:
                0 0 15px white,
                0 0 45px #55eaff;

        }


        .xr-limit-ring.active {

            animation:
                xrLimitRing
                2.2s
                cubic-bezier(
                    0.15,
                    0.7,
                    0.15,
                    1
                )
                forwards;

        }


        @keyframes xrLimitRing {

            0% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    scale(0.1)
                    rotateX(65deg);

            }

            25% {

                opacity: 1;

            }

            100% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    scale(18)
                    rotateX(65deg);

            }

        }


        /* =================================================
           XR爆発フラッシュ
        ================================================= */

        .xr-explosion {

            position: absolute;

            inset: 0;

            background:
                radial-gradient(
                    circle at center,
                    white 0%,
                    rgba(220,250,255,0.95) 3%,
                    rgba(80,220,255,0.65) 10%,
                    rgba(0,130,255,0.25) 25%,
                    transparent 60%
                );

            opacity: 0;

            pointer-events: none;

        }


        .xr-explosion.active {

            animation:
                xrExplosion
                1.5s
                ease-out
                forwards;

        }


        @keyframes xrExplosion {

            0% {

                opacity: 0;

                transform:
                    scale(0.1);

            }

            22% {

                opacity: 1;

                transform:
                    scale(0.7);

            }

            45% {

                opacity: 0.95;

                transform:
                    scale(1.3);

            }

            100% {

                opacity: 0;

                transform:
                    scale(2.4);

            }

        }


        /* =================================================
           XR 3Dタイトル
        ================================================= */

        .xr-title-stage {

            position: absolute;

            left: 50%;

            top: 50%;

            width: 100%;

            height: 100%;

            transform:
                translate(-50%, -50%);

            display: flex;

            align-items: center;

            justify-content: center;

            perspective: 700px;

            opacity: 0;

        }


        .xr-title-stage.active {

            animation:
                xrTitleStage
                5.5s
                ease-out
                forwards;

        }


        @keyframes xrTitleStage {

            0% {

                opacity: 0;

            }

            8% {

                opacity: 1;

            }

            100% {

                opacity: 1;

            }

        }


        .xr-title-3d {

            position: relative;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 5vw;

            transform-style:
                preserve-3d;

            transform:
                translateZ(-900px)
                rotateX(30deg)
                rotateY(-55deg)
                rotateZ(-10deg)
                scale(0.05);

        }


        .xr-title-stage.active
        .xr-title-3d {

            animation:
                xrTitle3D
                5.5s
                cubic-bezier(
                    0.12,
                    0.62,
                    0.16,
                    1
                )
                forwards;

        }


        @keyframes xrTitle3D {

            0% {

                transform:
                    translateZ(-1000px)
                    rotateX(35deg)
                    rotateY(-75deg)
                    rotateZ(-12deg)
                    scale(0.04);

            }

            18% {

                transform:
                    translateZ(-650px)
                    rotateX(28deg)
                    rotateY(-40deg)
                    rotateZ(-6deg)
                    scale(0.22);

            }

            38% {

                transform:
                    translateZ(-300px)
                    rotateX(18deg)
                    rotateY(40deg)
                    rotateZ(5deg)
                    scale(0.48);

            }

            58% {

                transform:
                    translateZ(0px)
                    rotateX(-8deg)
                    rotateY(120deg)
                    rotateZ(-2deg)
                    scale(0.82);

            }

            72% {

                transform:
                    translateZ(180px)
                    rotateX(8deg)
                    rotateY(210deg)
                    rotateZ(4deg)
                    scale(1.05);

            }

            86% {

                transform:
                    translateZ(280px)
                    rotateX(-5deg)
                    rotateY(315deg)
                    rotateZ(-2deg)
                    scale(1.18);

            }

            100% {

                transform:
                    translateZ(340px)
                    rotateX(0deg)
                    rotateY(360deg)
                    rotateZ(0deg)
                    scale(1.28);

            }

        }


        /* =================================================
           3D XR文字
        ================================================= */

        .xr-letter {

            position: relative;

            font-family:
                Arial Black,
                Impact,
                sans-serif;

            font-size:
                clamp(
                    100px,
                    22vw,
                    330px
                );

            line-height: 0.8;

            font-weight: 900;

            letter-spacing:
                -0.08em;

            color:
                #f5fdff;

            transform-style:
                preserve-3d;

            text-shadow:

                2px 2px 0 #9defff,

                4px 4px 0 #63ddff,

                6px 6px 0 #20baff,

                8px 8px 0 #0789d8,

                10px 10px 0 #045a9c,

                0 0 20px white,

                0 0 45px #55eaff,

                0 0 100px #008cff,

                0 0 180px #0050aa;

        }


        .xr-letter::before {

            content:
                attr(data-letter);

            position: absolute;

            inset: 0;

            color:
                transparent;

            -webkit-text-stroke:
                2px
                rgba(255,255,255,0.9);

            transform:
                translateZ(-35px);

            text-shadow:
                0 0 20px
                rgba(50,220,255,0.8);

        }


        .xr-letter::after {

            content:
                attr(data-letter);

            position: absolute;

            inset: 0;

            color:
                rgba(80,230,255,0.18);

            transform:
                translateZ(-70px);

            filter:
                blur(1px);

        }


        /* =================================================
           XR文字の外周リング
        ================================================= */

        .xr-title-ring {

            position: absolute;

            left: 50%;

            top: 50%;

            width: 45vw;

            height: 45vw;

            max-width: 650px;

            max-height: 650px;

            border-radius: 50%;

            border:
                1px solid
                rgba(120,235,255,0.6);

            transform:
                translate(-50%, -50%)
                rotateX(70deg);

            box-shadow:
                0 0 20px
                rgba(80,220,255,0.7),

                inset 0 0 30px
                rgba(80,220,255,0.25);

            opacity: 0;

        }


        .xr-title-stage.active
        .xr-title-ring {

            animation:
                xrTitleRing
                5s
                ease-out
                forwards;

        }


        @keyframes xrTitleRing {

            0% {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    rotateX(70deg)
                    scale(0.1)
                    rotateZ(0deg);

            }

            35% {

                opacity: 0.8;

            }

            100% {

                opacity: 0.25;

                transform:
                    translate(-50%, -50%)
                    rotateX(70deg)
                    scale(1.4)
                    rotateZ(360deg);

            }

        }


        /* =================================================
           XR用細かい光
        ================================================= */

        .xr-star {

            position: absolute;

            width: 2px;

            height: 2px;

            border-radius: 50%;

            background: white;

            box-shadow:
                0 0 5px white,
                0 0 15px #55eaff;

            opacity: 0;

        }


        .xr-star.active {

            animation:
                xrStar
                var(--duration)
                ease-out
                var(--delay)
                forwards;

        }


        @keyframes xrStar {

            0% {

                opacity: 0;

                transform:
                    translate3d(
                        var(--sx),
                        var(--sy),
                        -600px
                    )
                    scale(0.2);

            }

            30% {

                opacity: 0.9;

            }

            100% {

                opacity: 0;

                transform:
                    translate3d(
                        var(--ex),
                        var(--ey),
                        500px
                    )
                    scale(1.5);

            }

        }


        /* =================================================
           LDM
        ================================================= */

        #xrSpecialScene.ldm
        .xr-explosion {

            display: none;

        }


        #xrSpecialScene.ldm
        .xr-energy-particle {

            opacity: 0.45;

        }


        #xrSpecialScene.ldm
        .xr-title-3d {

            filter:
                brightness(0.75);

        }


        /* =================================================
           XR演出中は通常UIを暗くする
        ================================================= */

        body.xr-playing
        header,

        body.xr-playing
        main {

            transition:
                opacity 0.8s
                ease;

        }


        body.xr-playing
        header,

        body.xr-playing
        main {

            opacity: 0.05;

        }


        body.xr-playing
        #adminButton {

            opacity: 0;

            pointer-events: none;

        }


        /* =================================================
           mobile
        ================================================= */

        @media (
            max-width: 600px
        ) {

            .xr-title-3d {

                gap: 3vw;

            }


            .xr-letter {

                font-size:
                    30vw;

            }


            .xr-title-ring {

                width: 80vw;

                height: 80vw;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   XR専用シーン生成
   ========================================================= */

function createXRSpecialScene() {

    injectXRSpecialCSS();


    if (
        xrSpecialScene
    ) {

        xrSpecialScene.remove();

    }


    xrSpecialScene =
        document.createElement(
            "div"
        );


    xrSpecialScene.id =
        "xrSpecialScene";


    if (ldmMode) {

        xrSpecialScene.classList.add(
            "ldm"
        );

    }


    /* =========================
       暗闇
    ========================= */

    const voidLayer =
        document.createElement(
            "div"
        );


    voidLayer.className =
        "xr-void";


    xrSpecialScene.appendChild(
        voidLayer
    );


    /* =========================
       遠景BOX
    ========================= */

    const distanceBox =
        document.createElement(
            "div"
        );


    distanceBox.className =
        "xr-distance-box";


    const boxBody =
        document.createElement(
            "div"
        );


    boxBody.className =
        "xr-box-body";


    const boxCore =
        document.createElement(
            "div"
        );


    boxCore.className =
        "xr-box-core";


    boxBody.appendChild(
        boxCore
    );


    distanceBox.appendChild(
        boxBody
    );


    xrSpecialScene.appendChild(
        distanceBox
    );


    /* =========================
       スポットライト
    ========================= */

    const spotlight =
        document.createElement(
            "div"
        );


    spotlight.className =
        "xr-spotlight";


    xrSpecialScene.appendChild(
        spotlight
    );


    /* =========================
       箱ライト
    ========================= */

    const boxLight =
        document.createElement(
            "div"
        );


    boxLight.className =
        "xr-box-light";


    xrSpecialScene.appendChild(
        boxLight
    );


    /* =========================
       エネルギーコア
    ========================= */

    const energyCore =
        document.createElement(
            "div"
        );


    energyCore.className =
        "xr-energy-core";


    xrSpecialScene.appendChild(
        energyCore
    );


    /* =========================
       エネルギーリング
    ========================= */

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const ring =
            document.createElement(
                "div"
            );


        ring.className =
            "xr-energy-ring";


        ring.style.setProperty(
            "--delay",
            (
                i *
                0.42
            ) + "s"
        );


        xrSpecialScene.appendChild(
            ring
        );

    }


    /* =========================
       エネルギー粒子
    ========================= */

    for (
        let i = 0;
        i < 150;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "xr-energy-particle";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            350 +
            Math.random() *
            650;


        const sx =
            Math.cos(angle) *
            radius;


        const sy =
            Math.sin(angle) *
            radius;


        particle.style.setProperty(
            "--sx",
            sx + "px"
        );


        particle.style.setProperty(
            "--sy",
            sy + "px"
        );


        particle.style.setProperty(
            "--size",
            (
                1 +
                Math.random() *
                4
            ) + "px"
        );


        particle.style.setProperty(
            "--duration",
            (
                2.5 +
                Math.random() *
                3.5
            ) + "s"
        );


        particle.style.setProperty(
            "--delay",
            Math.random() *
            5 +
            "s"
        );


        xrSpecialScene.appendChild(
            particle
        );

    }


    /* =========================
       巨大エネルギー
    ========================= */

    const megaEnergy =
        document.createElement(
            "div"
        );


    megaEnergy.className =
        "xr-mega-energy";


    xrSpecialScene.appendChild(
        megaEnergy
    );


    /* =========================
       限界突破リング
    ========================= */

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const ring =
            document.createElement(
                "div"
            );


        ring.className =
            "xr-limit-ring";


        ring.style.transform =
            `
                translate(-50%, -50%)
                rotateZ(${i * 36}deg)
            `;


        xrSpecialScene.appendChild(
            ring
        );

    }


    /* =========================
       爆発
    ========================= */

    const explosion =
        document.createElement(
            "div"
        );


    explosion.className =
        "xr-explosion";


    xrSpecialScene.appendChild(
        explosion
    );


    /* =========================
       XRタイトル
    ========================= */

    const titleStage =
        document.createElement(
            "div"
        );


    titleStage.className =
        "xr-title-stage";


    const titleRing =
        document.createElement(
            "div"
        );


    titleRing.className =
        "xr-title-ring";


    titleStage.appendChild(
        titleRing
    );


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "xr-title-3d";


    const x =
        document.createElement(
            "div"
        );


    x.className =
        "xr-letter";


    x.textContent =
        "X";


    x.dataset.letter =
        "X";


    const r =
        document.createElement(
            "div"
        );


    r.className =
        "xr-letter";


    r.textContent =
        "R";


    r.dataset.letter =
        "R";


    title.appendChild(
        x
    );


    title.appendChild(
        r
    );


    titleStage.appendChild(
        title
    );


    xrSpecialScene.appendChild(
        titleStage
    );


    /* =========================
       スター
    ========================= */

    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const star =
            document.createElement(
                "div"
            );


        star.className =
            "xr-star";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            200 +
            Math.random() *
            600;


        star.style.left =
            "50%";


        star.style.top =
            "50%";


        star.style.setProperty(
            "--sx",
            Math.cos(angle) *
            radius +
            "px"
        );


        star.style.setProperty(
            "--sy",
            Math.sin(angle) *
            radius +
            "px"
        );


        star.style.setProperty(
            "--ex",
            Math.cos(angle) *
            (radius * 0.25) +
            "px"
        );


        star.style.setProperty(
            "--ey",
            Math.sin(angle) *
            (radius * 0.25) +
            "px"
        );


        star.style.setProperty(
            "--duration",
            (
                1.5 +
                Math.random() *
                2
            ) + "s"
        );


        star.style.setProperty(
            "--delay",
            Math.random() *
            3 +
            "s"
        );


        xrSpecialScene.appendChild(
            star
        );

    }


    document.body.appendChild(
        xrSpecialScene
    );


    return {

        scene:
            xrSpecialScene,

        distanceBox:
            distanceBox,

        spotlight:
            spotlight,

        boxLight:
            boxLight,

        energyCore:
            energyCore,

        megaEnergy:
            megaEnergy,

        explosion:
            explosion,

        titleStage:
            titleStage

    };

}


/* =========================================================
   XR専用演出開始
   ========================================================= */

function startXRSpecialAnimation(
    onFinished
) {

    clearXRSpecialTimers();


    const fx =
        createXRSpecialScene();


    const scene =
        fx.scene;


    /* =====================================================
       0. 開始
       ===================================================== */

    document.body.classList.add(
        "xr-playing"
    );


    scene.classList.add(
        "active"
    );


    setChargeMessage(
        "EXTREME",
        "XR PROTOCOL"
    );


    /* =====================================================
       1. 遠くに小さな箱
       0～2.5秒
       ===================================================== */

    xrDelay(
        function () {

            fx.distanceBox.classList.add(
                "visible"
            );


            setChargeMessage(
                "DEEP SCAN",
                "TARGET FOUND"
            );

        },
        300
    );


    /* =====================================================
       2. 上からライト
       1.5～5秒
       ===================================================== */

    xrDelay(
        function () {

            fx.spotlight.classList.add(
                "active"
            );


            fx.boxLight.classList.add(
                "active"
            );


            setChargeMessage(
                "OPTICAL",
                "TARGET ILLUMINATION"
            );

        },
        1700
    );


    /* =====================================================
       3. 小さなエネルギー発生
       4～8秒
       ===================================================== */

    xrDelay(
        function () {

            fx.energyCore.classList.add(
                "phase1"
            );


            setChargeMessage(
                "ENERGY",
                "ENERGY DETECTED"
            );

        },
        4000
    );


    /* =====================================================
       4. 全方向からエネルギー吸収
       5～10秒
       ===================================================== */

    xrDelay(
        function () {

            const particles =
                scene.querySelectorAll(
                    ".xr-energy-particle"
                );


            particles.forEach(
                function (particle) {

                    particle.classList.add(
                        "active"
                    );

                }
            );


            const rings =
                scene.querySelectorAll(
                    ".xr-energy-ring"
                );


            rings.forEach(
                function (ring) {

                    ring.classList.add(
                        "active"
                    );

                }
            );


            setChargeMessage(
                "ENERGY",
                "ENERGY CONVERGENCE"
            );

        },
        5200
    );


    /* =====================================================
       5. エネルギーコア巨大化
       8～12.5秒
       ===================================================== */

    xrDelay(
        function () {

            fx.energyCore.classList.remove(
                "phase1"
            );


            fx.energyCore.classList.add(
                "phase2"
            );


            setChargeMessage(
                "WARNING",
                "ENERGY SURGE"
            );

        },
        8000
    );


    /* =====================================================
       6. さらに巨大化
       11～15秒
       ===================================================== */

    xrDelay(
        function () {

            fx.energyCore.classList.remove(
                "phase2"
            );


            fx.energyCore.classList.add(
                "phase3"
            );


            setChargeMessage(
                "CRITICAL",
                "CORE EXPANSION"
            );

        },
        11000
    );


    /* =====================================================
       7. 巨大エネルギー球
       12.5～17秒
       ===================================================== */

    xrDelay(
        function () {

            fx.megaEnergy.classList.add(
                "grow"
            );


            setChargeMessage(
                "LIMIT",
                "ENERGY LIMIT BREAK"
            );

        },
        12500
    );


    /* =====================================================
       8. 限界突破リング
       16～18秒
       ===================================================== */

    xrDelay(
        function () {

            const rings =
                scene.querySelectorAll(
                    ".xr-limit-ring"
                );


            rings.forEach(
                function (ring, index) {

                    setTimeout(
                        function () {

                            ring.classList.add(
                                "active"
                            );

                        },
                        index * 130
                    );

                }
            );


            setChargeMessage(
                "CRITICAL",
                "OVERLOAD"
            );

        },
        16000
    );


    /* =====================================================
       9. XR爆発
       約18秒
       ===================================================== */

    xrDelay(
        function () {

            if (
                !ldmMode
            ) {

                fx.explosion.classList.add(
                    "active"
                );

            }


            fx.megaEnergy.style.transition =
                "opacity 0.25s ease";


            fx.megaEnergy.style.opacity =
                "0";


            fx.energyCore.style.transition =
                "opacity 0.2s ease";


            fx.energyCore.style.opacity =
                "0";


            fx.distanceBox.style.transition =
                "opacity 0.2s ease";


            fx.distanceBox.style.opacity =
                "0";


            setChargeMessage(
                "SYSTEM",
                "XR RELEASE"
            );

        },
        17800
    );


    /* =====================================================
       10. XR 3Dタイトル
       18.7秒
       ===================================================== */

    xrDelay(
        function () {

            fx.titleStage.classList.add(
                "active"
            );


            setChargeMessage(
                "EXTREME RARE",
                "XR"
            );

        },
        18700
    );


    /* =====================================================
       11. XRタイトル終了
       24秒
       ===================================================== */

    xrDelay(
        function () {

            if (
                typeof onFinished ===
                "function"
            ) {

                onFinished();

            }

        },
        24200
    );

}


/* =========================================================
   XR専用演出終了
   ========================================================= */

function stopXRSpecialAnimation() {

    clearXRSpecialTimers();


    document.body.classList.remove(
        "xr-playing"
    );


    if (
        xrSpecialScene
    ) {

        xrSpecialScene.classList.remove(
            "active"
        );


        xrSpecialScene.remove();


        xrSpecialScene =
            null;

    }

}


/* =========================================================
   SSR CONTINUE
   ========================================================= */

if (ssrContinue) {

    ssrContinue.addEventListener(
        "click",
        function () {

            ssrOverlay.classList.remove(
                "show"
            );


            clearAnimationClasses();

            clearEffects();


            setChargeMessage(
                "SYSTEM",
                "SYSTEM READY"
            );


            isRolling =
                false;

        }
    );

}


/* =========================================================
   XR CONTINUE
   ========================================================= */

if (xrContinue) {

    xrContinue.addEventListener(
        "click",
        function () {

            xrOverlay.classList.remove(
                "show"
            );


            stopXRSpecialAnimation();


            clearAnimationClasses();

            clearEffects();


            setChargeMessage(
                "SYSTEM",
                "SYSTEM READY"
            );


            isRolling =
                false;

        }
    );

}


/* =========================================================
   SKIP結果
   ========================================================= */

function skipResult(
    rarity
) {

    clearAnimationClasses();

    clearEffects();


    if (gachaArea) {

        gachaArea.classList.add(
            "rare-" +
            rarity.toLowerCase()
        );


        gachaArea.classList.add(
            "reveal"
        );

    }


    setChargeMessage(
        "RESULT",
        "REVEAL"
    );


    showResult(
        rarity
    );


    addHistory(
        rarity
    );


    setTimeout(
        function () {

            clearAnimationClasses();

            clearEffects();


            setChargeMessage(
                "SYSTEM",
                "SYSTEM READY"
            );


            isRolling =
                false;

        },
        350
    );

}


/* =========================================================
   通常演出
   ========================================================= */

function openGacha() {

    if (isRolling) {

        return;

    }


    isRolling =
        true;


    closeOverlays();


    clearAnimationClasses();

    clearEffects();


    /* =====================================================
       抽選
       ===================================================== */

    let rarity =
        drawRarity();


    /* =====================================================
       次回カウント
       ===================================================== */

    const nextSSRCount =
        ssrCount + 1;


    const nextXRCount =
        xrCount + 1;


    /* =====================================================
       XR保証
       ===================================================== */

    if (
        nextXRCount >=
        XR_GUARANTEE
    ) {

        rarity =
            "XR";

    }


    /* =====================================================
       SSR保証
       ===================================================== */

    else if (
        nextSSRCount >=
        SSR_GUARANTEE
    ) {

        rarity =
            "SSR";

    }


    /* =====================================================
       カウンター
       ===================================================== */

    if (
        rarity === "XR"
    ) {

        ssrCount =
            0;


        xrCount =
            0;

    }


    else if (
        rarity === "SSR"
    ) {

        ssrCount =
            0;


        xrCount =
            nextXRCount;

    }


    else {

        ssrCount =
            nextSSRCount;


        xrCount =
            nextXRCount;

    }


    updateCounters();


    /* =====================================================
       SKIP
       R / SRのみ
       ===================================================== */

    if (
        skipMode &&
        rarity !== "SSR" &&
        rarity !== "XR"
    ) {

        skipResult(
            rarity
        );


        return;

    }


    /* =====================================================
       XRなら完全別演出
       ===================================================== */

    if (
        rarity === "XR"
    ) {

        startXRSpecialAnimation(
            function () {

                /*
                    XRの特別演出終了後、
                    既存XRオーバーレイを出す。
                */

                showResult(
                    "XR"
                );


                addHistory(
                    "XR"
                );


                if (
                    xrOverlay
                ) {

                    xrOverlay.classList.add(
                        "show"
                    );

                }

            }
        );


        return;

    }


    /* =====================================================
       ここから通常R/SR/SSR演出
       ===================================================== */

    if (gachaArea) {

        gachaArea.classList.add(
            "rare-" +
            rarity.toLowerCase()
        );

    }


    /* =====================================================
       エフェクト
       ===================================================== */

    createCrystals(
        rarity
    );


    createParticles(
        rarity
    );


    createBeams(
        rarity
    );


    /* =====================================================
       CHARGE
       ===================================================== */

    if (gachaArea) {

        gachaArea.classList.add(
            "charging"
        );

    }


    if (gachaBox) {

        gachaBox.classList.add(
            "charging"
        );

    }


    /* =====================================================
       STAGE 1
       ===================================================== */

    setChargeMessage(
        "SYSTEM",
        "SYSTEM CHECK"
    );


    /* =====================================================
       STAGE 2
       ===================================================== */

    setTimeout(
        function () {

            setChargeMessage(
                "SCANNING",
                "TARGET LOCK"
            );

        },
        350
    );


    /* =====================================================
       STAGE 3
       ===================================================== */

    setTimeout(
        function () {

            setChargeMessage(
                "ENERGY",
                "ENERGY CHARGE"
            );

        },
        700
    );


    /* =====================================================
       STAGE 4
       ===================================================== */

    setTimeout(
        function () {

            setChargeMessage(
                "CORE",
                "CORE OVERLOAD"
            );

        },
        1050
    );


    /* =====================================================
       STAGE 5
       ===================================================== */

    setTimeout(
        function () {

            setChargeMessage(
                "WARNING",
                "ENERGY LIMIT"
            );


            if (gachaArea) {

                gachaArea.classList.add(
                    "limitBreak"
                );

            }


            triggerShockwave(
                rarity
            );

        },
        1400
    );


    /* =====================================================
       STAGE 6
       ===================================================== */

    setTimeout(
        function () {

            setChargeMessage(
                "CRITICAL",
                "LIMIT BREAK"
            );


            triggerShockwave(
                rarity
            );


            if (!ldmMode) {

                createCrystals(
                    rarity
                );


                createParticles(
                    rarity
                );


                createBeams(
                    rarity
                );

            }

        },
        1750
    );


    /* =====================================================
       RELEASE
       ===================================================== */

    setTimeout(
        function () {

            setChargeMessage(
                "SYSTEM",
                "RELEASE"
            );

        },
        2050
    );


    /* =====================================================
       OPEN
       ===================================================== */

    setTimeout(
        function () {

            if (gachaArea) {

                gachaArea.classList.remove(
                    "charging"
                );


                gachaArea.classList.remove(
                    "limitBreak"
                );

            }


            if (gachaBox) {

                gachaBox.classList.remove(
                    "charging"
                );

            }


            if (!ldmMode) {

                triggerShockwave(
                    rarity
                );


                setTimeout(
                    function () {

                        triggerShockwave(
                            rarity
                        );

                    },
                    180
                );


                createCrystals(
                    rarity
                );

            }


            /* =================================================
               FLASH
               ================================================= */

            if (gachaArea) {

                gachaArea.classList.remove(
                    "flash",
                    "flash-ssr",
                    "flash-xr"
                );

            }


            if (
                !ldmMode &&
                gachaArea
            ) {

                if (
                    rarity === "SSR"
                ) {

                    gachaArea.classList.add(
                        "flash-ssr"
                    );

                }


                else {

                    gachaArea.classList.add(
                        "flash"
                    );

                }

            }


            /* =================================================
               RESULT
               ================================================= */

            setChargeMessage(
                "RESULT",
                "REVEAL"
            );


            setTimeout(
                function () {

                    if (gachaArea) {

                        gachaArea.classList.add(
                            "reveal"
                        );

                    }


                    showResult(
                        rarity
                    );


                    addHistory(
                        rarity
                    );


                    /* =================================================
                       SSR
                       ================================================= */

                    if (
                        rarity === "SSR"
                    ) {

                        setTimeout(
                            function () {

                                if (
                                    ssrOverlay
                                ) {

                                    ssrOverlay.classList.add(
                                        "show"
                                    );

                                }

                            },
                            500
                        );

                    }


                    /* =================================================
                       R / SR
                       ================================================= */

                    else {

                        setTimeout(
                            function () {

                                clearAnimationClasses();

                                clearEffects();


                                setChargeMessage(
                                    "SYSTEM",
                                    "SYSTEM READY"
                                );


                                isRolling =
                                    false;

                            },
                            950
                        );

                    }

                },
                180
            );


        },
        2300
    );

}


/* =========================================================
   BOX CLICK
   ========================================================= */

if (gachaBox) {

    gachaBox.addEventListener(
        "click",
        function () {

            openGacha();

        }
    );

}


/* =========================================================
   ADMIN
   ========================================================= */

function openAdminPanel() {

    if (
        isRolling ||
        !adminOverlay
    ) {

        return;

    }


    if (adminRRate) {

        adminRRate.value =
            simulationProbabilities.R;

    }


    if (adminSRRate) {

        adminSRRate.value =
            simulationProbabilities.SR;

    }


    if (adminSSRRate) {

        adminSSRRate.value =
            simulationProbabilities.SSR;

    }


    if (adminXRRate) {

        adminXRRate.value =
            simulationProbabilities.XR;

    }


    updateAdminTotal();


    if (adminStatus) {

        adminStatus.textContent =
            "READY";


        adminStatus.className =
            "adminStatus";

    }


    adminOverlay.classList.add(
        "show"
    );

}


function closeAdminPanel() {

    if (!adminOverlay) {

        return;

    }


    adminOverlay.classList.remove(
        "show"
    );

}


function getAdminProbabilityValues() {

    return {

        R: Number(
            adminRRate
                ? adminRRate.value
                : NaN
        ),

        SR: Number(
            adminSRRate
                ? adminSRRate.value
                : NaN
        ),

        SSR: Number(
            adminSSRRate
                ? adminSSRRate.value
                : NaN
        ),

        XR: Number(
            adminXRRate
                ? adminXRRate.value
                : NaN
        )

    };

}


function calculateAdminTotal() {

    const values =
        getAdminProbabilityValues();


    return (
        values.R +
        values.SR +
        values.SSR +
        values.XR
    );

}


function updateAdminTotal() {

    if (!adminTotal) {

        return false;

    }


    const total =
        calculateAdminTotal();


    if (
        !Number.isFinite(total)
    ) {

        adminTotal.textContent =
            "INVALID";


        if (
            adminTotal.parentElement
        ) {

            adminTotal.parentElement.classList.add(
                "invalid"
            );

        }


        return false;

    }


    adminTotal.textContent =
        total.toFixed(4) +
        " %";


    const valid =
        Math.abs(
            total - 100
        ) <
        0.0000001;


    if (
        adminTotal.parentElement
    ) {

        adminTotal.parentElement.classList.toggle(
            "invalid",
            !valid
        );

    }


    return valid;

}


function saveSimulationProbabilities() {

    if (!adminStatus) {

        return;

    }


    const values =
        getAdminProbabilityValues();


    const numbers = [

        values.R,
        values.SR,
        values.SSR,
        values.XR

    ];


    if (
        numbers.some(
            function (value) {

                return !Number.isFinite(
                    value
                );

            }
        )
    ) {

        adminStatus.textContent =
            "ERROR: INVALID NUMBER";


        adminStatus.className =
            "adminStatus error";


        updateAdminTotal();


        return;

    }


    if (
        numbers.some(
            function (value) {

                return value < 0;

            }
        )
    ) {

        adminStatus.textContent =
            "ERROR: NEGATIVE VALUE";


        adminStatus.className =
            "adminStatus error";


        return;

    }


    const total =
        numbers.reduce(
            function (
                sum,
                value
            ) {

                return sum + value;

            },
            0
        );


    if (
        Math.abs(
            total - 100
        ) >
        0.0000001
    ) {

        adminStatus.textContent =
            "ERROR: TOTAL MUST BE 100%";


        adminStatus.className =
            "adminStatus error";


        updateAdminTotal();


        return;

    }


    simulationProbabilities = {

        R: values.R,

        SR: values.SR,

        SSR: values.SSR,

        XR: values.XR

    };


    localStorage.setItem(

        PROBABILITY_STORAGE_KEY,

        JSON.stringify(
            simulationProbabilities
        )

    );


    updateAdminTotal();


    adminStatus.textContent =
        "PROBABILITY SAVED";


    adminStatus.className =
        "adminStatus success";

}


if (adminButton) {

    adminButton.addEventListener(
        "click",
        function () {

            openAdminPanel();

        }
    );

}


if (adminClose) {

    adminClose.addEventListener(
        "click",
        function () {

            closeAdminPanel();

        }
    );

}


if (adminCloseBottom) {

    adminCloseBottom.addEventListener(
        "click",
        function () {

            closeAdminPanel();

        }
    );

}


const adminInputs = [

    adminRRate,
    adminSRRate,
    adminSSRRate,
    adminXRRate

];


adminInputs.forEach(
    function (input) {

        if (!input) {

            return;

        }


        input.addEventListener(
            "input",
            function () {

                updateAdminTotal();


                if (adminStatus) {

                    adminStatus.textContent =
                        "EDITING";


                    adminStatus.className =
                        "adminStatus";

                }

            }
        );

    }
);


if (adminSaveProbability) {

    adminSaveProbability.addEventListener(
        "click",
        function () {

            saveSimulationProbabilities();

        }
    );

}


if (adminOverlay) {

    adminOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                adminOverlay
            ) {

                closeAdminPanel();

            }

        }
    );

}


/* =========================================================
   ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            adminOverlay &&
            adminOverlay.classList.contains(
                "show"
            )
        ) {

            closeAdminPanel();

        }

    }
);


/* =========================================================
   初期化
   ========================================================= */

if (resultRarity) {

    resultRarity.textContent =
        "---";

}


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


console.log(
    "SIMULATION PROBABILITIES:",
    simulationProbabilities
);
