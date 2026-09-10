"use strict";


/* =========================================
   CYBER GACHA
========================================= */


/* =========================
   基本確率
========================= */

const R_RATE = 90;
const SR_RATE = 8.5;
const SSR_RATE = 1.4999;
const XR_RATE = 0.0001;


/* =========================
   保証回数
   ※変更不可
========================= */

const SSR_GUARANTEE = 200;
const XR_GUARANTEE = 15000;


/* =========================
   確率設定
========================= */

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


/* =========================
   DOM
========================= */

const gachaBox =
    document.getElementById(
        "gachaBox"
    );


const gachaArea =
    document.getElementById(
        "gachaArea"
    );


const resultRarity =
    document.getElementById(
        "resultRarity"
    );


const historyList =
    document.getElementById(
        "historyList"
    );


const ssrOverlay =
    document.getElementById(
        "ssrOverlay"
    );


const xrOverlay =
    document.getElementById(
        "xrOverlay"
    );


const ssrContinue =
    document.getElementById(
        "ssrContinue"
    );


const xrContinue =
    document.getElementById(
        "xrContinue"
    );


const ssrCounter =
    document.getElementById(
        "ssrCounter"
    );


const xrCounter =
    document.getElementById(
        "xrCounter"
    );


const ssrBar =
    document.getElementById(
        "ssrBar"
    );


const xrBar =
    document.getElementById(
        "xrBar"
    );


const chargeMessage =
    document.getElementById(
        "chargeMessage"
    );


const boxScreenSmall =
    document.getElementById(
        "boxScreenSmall"
    );


const boxScreenMain =
    document.getElementById(
        "boxScreenMain"
    );


const crystalContainer =
    document.getElementById(
        "crystalContainer"
    );


const particleContainer =
    document.getElementById(
        "particleContainer"
    );


const beamContainer =
    document.getElementById(
        "beamContainer"
    );


const shockwaveContainer =
    document.getElementById(
        "shockwaveContainer"
    );


const ldmButton =
    document.getElementById(
        "ldmButton"
    );


const skipButton =
    document.getElementById(
        "skipButton"
    );


/* =========================
   ADMIN DOM
========================= */

const adminButton =
    document.getElementById(
        "adminButton"
    );


const adminOverlay =
    document.getElementById(
        "adminOverlay"
    );


const adminClose =
    document.getElementById(
        "adminClose"
    );


const adminCloseBottom =
    document.getElementById(
        "adminCloseBottom"
    );


const adminRRate =
    document.getElementById(
        "adminRRate"
    );


const adminSRRate =
    document.getElementById(
        "adminSRRate"
    );


const adminSSRRate =
    document.getElementById(
        "adminSSRRate"
    );


const adminXRRate =
    document.getElementById(
        "adminXRRate"
    );


const adminTotal =
    document.getElementById(
        "adminTotal"
    );


const adminStatus =
    document.getElementById(
        "adminStatus"
    );


const adminSaveProbability =
    document.getElementById(
        "adminSaveProbability"
    );


/* =========================
   状態
========================= */

let isRolling = false;


/* =========================
   LDM
========================= */

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
                String(
                    ldmMode
                )
            );


            updateLDM();

        }
    );

}


/* =========================
   SKIP MODE
========================= */

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
                String(
                    skipMode
                )
            );


            updateSkip();

        }
    );

}


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
        String(
            ssrCount
        )
    );


    localStorage.setItem(
        "cyberGachaXRCount",
        String(
            xrCount
        )
    );

}


/* =========================
   カウンター表示
========================= */

function updateCounters() {

    if (
        ssrCounter
    ) {

        ssrCounter.textContent =
            ssrCount +
            " / " +
            SSR_GUARANTEE;

    }


    if (
        xrCounter
    ) {

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


/* =========================
   確率設定読み込み
========================= */

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
            JSON.parse(
                saved
            );


        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            return {
                ...DEFAULT_PROBABILITIES
            };

        }


        const R =
            Number(
                parsed.R
            );


        const SR =
            Number(
                parsed.SR
            );


        const SSR =
            Number(
                parsed.SSR
            );


        const XR =
            Number(
                parsed.XR
            );


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
                        !Number.isFinite(
                            value
                        ) ||
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
            Math.abs(
                total - 100
            ) >
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


/* =========================
   抽選
========================= */

function drawRarity() {

    const random =
        Math.random() *
        100;


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
        R +
        SR
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


/* =========================
   結果表示
========================= */

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


/* =========================
   HISTORY
========================= */

function addHistory(
    rarity
) {

    if (!historyList) {

        return;

    }


    const item =
        document.createElement(
            "div"
        );


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


    historyList.prepend(
        item
    );

}


/* =========================
   クリスタル削除
========================= */

function clearCrystals() {

    if (
        crystalContainer
    ) {

        crystalContainer.innerHTML =
            "";

    }

}


/* =========================
   パーティクル削除
========================= */

function clearParticles() {

    if (
        particleContainer
    ) {

        particleContainer.innerHTML =
            "";

    }

}


/* =========================
   ビーム削除
========================= */

function clearBeams() {

    if (
        beamContainer
    ) {

        beamContainer.innerHTML =
            "";

    }

}


/* =========================
   エフェクト削除
========================= */

function clearEffects() {

    clearCrystals();

    clearParticles();

    clearBeams();


    if (
        shockwaveContainer
    ) {

        shockwaveContainer.className =
            "";


        shockwaveContainer.style.borderColor =
            "";

    }

}


/* =========================
   クリスタル生成
========================= */

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
            document.createElement(
                "div"
            );


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


        const startX =
            Math.cos(
                angle
            ) *
            distance;


        const startY =
            Math.sin(
                angle
            ) *
            distance;


        crystal.style.setProperty(
            "--startX",
            startX + "px"
        );


        crystal.style.setProperty(
            "--startY",
            startY + "px"
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
            (
                Math.random() *
                1.1
            ) + "s"
        );


        crystal.style.setProperty(
            "--rotation",
            (
                Math.random() *
                360
            ) + "deg"
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


/* =========================
   パーティクル生成
========================= */

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
            document.createElement(
                "div"
            );


        particle.className =
            "particle";


        const radius =
            100 +
            Math.random() *
            240;


        particle.style.setProperty(
            "--radius",
            radius + "px"
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
            Math.random() + "s"
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


/* =========================
   ビーム生成
========================= */

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
            document.createElement(
                "div"
            );


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
            ) + "deg"
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


/* =========================
   衝撃波
========================= */

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


/* =========================
   メッセージ
========================= */

function setChargeMessage(
    small,
    main
) {

    if (
        boxScreenSmall
    ) {

        boxScreenSmall.textContent =
            small;

    }


    if (
        boxScreenMain
    ) {

        boxScreenMain.textContent =
            main;

    }


    if (
        chargeMessage
    ) {

        chargeMessage.textContent =
            main;

    }

}


/* =========================
   アニメーション解除
========================= */

function clearAnimationClasses() {

    if (
        gachaArea
    ) {

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

    }


    if (
        gachaBox
    ) {

        gachaBox.classList.remove(
            "charging"
        );

    }

}


/* =========================
   オーバーレイ
========================= */

function closeOverlays() {

    if (
        ssrOverlay
    ) {

        ssrOverlay.classList.remove(
            "show"
        );

    }


    if (
        xrOverlay
    ) {

        xrOverlay.classList.remove(
            "show"
        );

    }

}


/* =========================
   SSR CONTINUE
========================= */

if (
    ssrContinue
) {

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


/* =========================
   XR CONTINUE
========================= */

if (
    xrContinue
) {

    xrContinue.addEventListener(
        "click",
        function () {

            xrOverlay.classList.remove(
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


/* =========================
   SKIP結果
========================= */

function skipResult(
    rarity
) {

    clearAnimationClasses();

    clearEffects();


    if (
        gachaArea
    ) {

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


/* =========================
   ガチャ開始
========================= */

function openGacha() {

    if (
        isRolling
    ) {

        return;

    }


    isRolling =
        true;


    closeOverlays();

    clearAnimationClasses();

    clearEffects();


    /* =========================
       抽選
    ========================= */

    let rarity =
        drawRarity();


    /* =========================
       次回カウント
    ========================= */

    const nextSSRCount =
        ssrCount + 1;


    const nextXRCount =
        xrCount + 1;


    /* =========================
       XR保証
    ========================= */

    if (
        nextXRCount >=
        XR_GUARANTEE
    ) {

        rarity =
            "XR";

    }


    /* =========================
       SSR保証
    ========================= */

    else if (
        nextSSRCount >=
        SSR_GUARANTEE
    ) {

        rarity =
            "SSR";

    }


    /* =========================
       カウンター更新
    ========================= */

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


    /* =========================
       SKIP
       R / SRのみ
    ========================= */

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


    /* =========================
       レア度クラス
    ========================= */

    if (
        gachaArea
    ) {

        gachaArea.classList.add(
            "rare-" +
            rarity.toLowerCase()
        );

    }


    /* =========================
       エフェクト
    ========================= */

    createCrystals(
        rarity
    );


    createParticles(
        rarity
    );


    createBeams(
        rarity
    );


    /* =========================
       CHARGE START
    ========================= */

    if (
        gachaArea
    ) {

        gachaArea.classList.add(
            "charging"
        );

    }


    if (
        gachaBox
    ) {

        gachaBox.classList.add(
            "charging"
        );

    }


    /* =========================
       STAGE 1
    ========================= */

    setChargeMessage(
        "SYSTEM",
        "SYSTEM CHECK"
    );


    /* =========================
       STAGE 2
    ========================= */

    setTimeout(
        function () {

            setChargeMessage(
                "SCANNING",
                "TARGET LOCK"
            );

        },
        350
    );


    /* =========================
       STAGE 3
    ========================= */

    setTimeout(
        function () {

            setChargeMessage(
                "ENERGY",
                "ENERGY CHARGE"
            );

        },
        700
    );


    /* =========================
       STAGE 4
    ========================= */

    setTimeout(
        function () {

            setChargeMessage(
                "CORE",
                "CORE OVERLOAD"
            );

        },
        1050
    );


    /* =========================
       STAGE 5
    ========================= */

    setTimeout(
        function () {

            setChargeMessage(
                "WARNING",
                "ENERGY LIMIT"
            );


            if (
                gachaArea
            ) {

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


    /* =========================
       STAGE 6
    ========================= */

    setTimeout(
        function () {

            setChargeMessage(
                "CRITICAL",
                "LIMIT BREAK"
            );


            triggerShockwave(
                rarity
            );


            if (
                !ldmMode
            ) {

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


    /* =========================
       RELEASE
    ========================= */

    setTimeout(
        function () {

            setChargeMessage(
                "SYSTEM",
                "RELEASE"
            );

        },
        2050
    );


    /* =========================
       OPEN
    ========================= */

    setTimeout(
        function () {

            if (
                gachaArea
            ) {

                gachaArea.classList.remove(
                    "charging"
                );


                gachaArea.classList.remove(
                    "limitBreak"
                );

            }


            if (
                gachaBox
            ) {

                gachaBox.classList.remove(
                    "charging"
                );

            }


            /* =========================
               爆発
            ========================= */

            if (
                !ldmMode
            ) {

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


            /* =========================
               FLASH
               
               LDMでは完全OFF
            ========================= */

            if (
                gachaArea
            ) {

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
                    rarity === "XR"
                ) {

                    gachaArea.classList.add(
                        "flash-xr"
                    );

                }


                else if (
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


            /* =========================
               RESULT
            ========================= */

            setChargeMessage(
                "RESULT",
                "REVEAL"
            );


            setTimeout(
                function () {

                    if (
                        gachaArea
                    ) {

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


                    /* =========================
                       SSR
                    ========================= */

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


                    /* =========================
                       XR
                    ========================= */

                    else if (
                        rarity === "XR"
                    ) {

                        setTimeout(
                            function () {

                                if (
                                    xrOverlay
                                ) {

                                    xrOverlay.classList.add(
                                        "show"
                                    );

                                }

                            },
                            650
                        );

                    }


                    /* =========================
                       R / SR
                    ========================= */

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


/* =========================
   BOX CLICK
========================= */

if (
    gachaBox
) {

    gachaBox.addEventListener(
        "click",
        function () {

            openGacha();

        }
    );

}


/* =========================================
   ADMIN PANEL
========================================= */


/* =========================
   ADMINを開く
========================= */

function openAdminPanel() {

    if (
        isRolling
    ) {

        return;

    }


    if (
        !adminOverlay
    ) {

        return;

    }


    if (
        adminRRate
    ) {

        adminRRate.value =
            simulationProbabilities.R;

    }


    if (
        adminSRRate
    ) {

        adminSRRate.value =
            simulationProbabilities.SR;

    }


    if (
        adminSSRRate
    ) {

        adminSSRRate.value =
            simulationProbabilities.SSR;

    }


    if (
        adminXRRate
    ) {

        adminXRRate.value =
            simulationProbabilities.XR;

    }


    updateAdminTotal();


    if (
        adminStatus
    ) {

        adminStatus.textContent =
            "READY";


        adminStatus.className =
            "adminStatus";

    }


    adminOverlay.classList.add(
        "show"
    );

}


/* =========================
   ADMINを閉じる
========================= */

function closeAdminPanel() {

    if (
        !adminOverlay
    ) {

        return;

    }


    adminOverlay.classList.remove(
        "show"
    );

}


/* =========================
   入力値取得
========================= */

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


/* =========================
   合計計算
========================= */

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


/* =========================
   合計表示
========================= */

function updateAdminTotal() {

    if (
        !adminTotal
    ) {

        return false;

    }


    const total =
        calculateAdminTotal();


    if (
        !Number.isFinite(
            total
        )
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


/* =========================
   確率保存
========================= */

function saveSimulationProbabilities() {

    if (
        !adminStatus
    ) {

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


    /* =========================
       数値チェック
    ========================= */

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


    /* =========================
       マイナスチェック
    ========================= */

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


    /* =========================
       合計
    ========================= */

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


    /* =========================
       新しい設定を反映
    ========================= */

    simulationProbabilities = {

        R: values.R,

        SR: values.SR,

        SSR: values.SSR,

        XR: values.XR

    };


    /* =========================
       localStorage保存
    ========================= */

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


/* =========================
   ADMIN BUTTON
========================= */

if (
    adminButton
) {

    adminButton.addEventListener(
        "click",
        function () {

            openAdminPanel();

        }
    );

}


/* =========================
   ADMIN CLOSE
========================= */

if (
    adminClose
) {

    adminClose.addEventListener(
        "click",
        function () {

            closeAdminPanel();

        }
    );

}


if (
    adminCloseBottom
) {

    adminCloseBottom.addEventListener(
        "click",
        function () {

            closeAdminPanel();

        }
    );

}


/* =========================
   入力変更
========================= */

const adminInputs = [

    adminRRate,

    adminSRRate,

    adminSSRRate,

    adminXRRate

];


adminInputs.forEach(
    function (input) {

        if (
            !input
        ) {

            return;

        }


        input.addEventListener(
            "input",
            function () {

                updateAdminTotal();


                if (
                    adminStatus
                ) {

                    adminStatus.textContent =
                        "EDITING";


                    adminStatus.className =
                        "adminStatus";

                }

            }
        );

    }
);


/* =========================
   SAVE
========================= */

if (
    adminSaveProbability
) {

    adminSaveProbability.addEventListener(
        "click",
        function () {

            saveSimulationProbabilities();

        }
    );

}


/* =========================
   背景クリックで閉じる
========================= */

if (
    adminOverlay
) {

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


/* =========================
   ESCで閉じる
========================= */

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


/* =========================================
   初期化
========================================= */

if (
    resultRarity
) {

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


/* =========================
   コンソール
========================= */

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
