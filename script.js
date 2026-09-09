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
   保証回数
========================= */

const SSR_GUARANTEE = 200;

const XR_GUARANTEE = 15000;


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


    ldmButton.textContent =
        ldmMode
            ? "LDM: ON"
            : "LDM: OFF";

}


ldmButton.addEventListener(
    "click",
    function () {

        if (
            isRolling
        ) {

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


/* =========================
   SKIP MODE
========================= */

let skipMode =
    localStorage.getItem(
        "cyberGachaSkip"
    ) === "true";


function updateSkip() {

    skipButton.textContent =
        skipMode
            ? "SKIP: ON"
            : "SKIP: OFF";

}


skipButton.addEventListener(
    "click",
    function () {

        if (
            isRolling
        ) {

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
    !Number.isFinite(
        ssrCount
    ) ||
    ssrCount < 0 ||
    ssrCount >= SSR_GUARANTEE
) {

    ssrCount = 0;

}


if (
    !Number.isFinite(
        xrCount
    ) ||
    xrCount < 0 ||
    xrCount >= XR_GUARANTEE
) {

    xrCount = 0;

}


/* =========================
   保存
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

    ssrCounter.textContent =
        ssrCount +
        " / " +
        SSR_GUARANTEE;


    xrCounter.textContent =
        xrCount +
        " / " +
        XR_GUARANTEE;


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


    ssrBar.style.width =
        Math.min(
            ssrProgress,
            100
        ) + "%";


    xrBar.style.width =
        Math.min(
            xrProgress,
            100
        ) + "%";


    saveCounters();

}


/* =========================
   抽選
========================= */

function drawRarity() {

    const random =
        Math.random() *
        100;


    if (
        random < R_RATE
    ) {

        return "R";

    }


    if (
        random <
        R_RATE +
        SR_RATE
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

function showResult(
    rarity
) {

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


    historyList.prepend(
        item
    );

}


/* =========================
   クリスタル削除
========================= */

function clearCrystals() {

    crystalContainer.innerHTML =
        "";

}


/* =========================
   パーティクル削除
========================= */

function clearParticles() {

    particleContainer.innerHTML =
        "";

}


/* =========================
   ビーム削除
========================= */

function clearBeams() {

    beamContainer.innerHTML =
        "";

}


/* =========================
   エフェクト削除
========================= */

function clearEffects() {

    clearCrystals();

    clearParticles();

    clearBeams();


    shockwaveContainer.className =
        "";


    shockwaveContainer.style.borderColor =
        "";

}


/* =========================
   クリスタル生成
========================= */

function createCrystals(
    rarity
) {

    clearCrystals();


    if (
        ldmMode
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
        ldmMode
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
            (
                Math.random()
            ) + "s"
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
        ldmMode
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
        ldmMode
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

    boxScreenSmall.textContent =
        small;


    boxScreenMain.textContent =
        main;


    chargeMessage.textContent =
        main;

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
   オーバーレイ
========================= */

function closeOverlays() {

    ssrOverlay.classList.remove(
        "show"
    );


    xrOverlay.classList.remove(
        "show"
    );

}


/* =========================
   SSR CONTINUE
========================= */

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


        isRolling = false;

    }
);


/* =========================
   XR CONTINUE
========================= */

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


        isRolling = false;

    }
);


/* =========================
   SKIP結果
========================= */

function skipResult(
    rarity
) {

    /*
       R / SRのみここに来る
    */


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


    showResult(
        rarity
    );


    addHistory(
        rarity
    );


    /*
       少しだけ待って
       SYSTEM READY
    */

    setTimeout(
        function () {

            clearAnimationClasses();


            clearEffects();


            setChargeMessage(
                "SYSTEM",
                "SYSTEM READY"
            );


            isRolling = false;

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


    /*
       =========================
       抽選
       =========================
    */

    let rarity =
        drawRarity();


    /*
       =========================
       次回カウント
       =========================
    */

    const nextSSRCount =
        ssrCount + 1;


    const nextXRCount =
        xrCount + 1;


    /*
       =========================
       XR保証
       =========================
    */

    if (
        nextXRCount >=
        XR_GUARANTEE
    ) {

        rarity =
            "XR";

    }


    /*
       =========================
       SSR保証
       =========================
    */

    else if (
        nextSSRCount >=
        SSR_GUARANTEE
    ) {

        rarity =
            "SSR";

    }


    /*
       =========================
       カウンター更新
       =========================
    */

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


    /*
       =========================
       SKIP MODE
       
       R / SRだけ即結果
       
       SSR / XRは絶対に
       スキップしない
       =========================
    */

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


    /*
       =========================
       通常演出
       =========================
    */

    gachaArea.classList.add(
        "rare-" +
        rarity.toLowerCase()
    );


    /*
       =========================
       エフェクト生成
       =========================
    */

    createCrystals(
        rarity
    );


    createParticles(
        rarity
    );


    createBeams(
        rarity
    );


    /*
       =========================
       CHARGE START
       =========================
    */

    gachaArea.classList.add(
        "charging"
    );


    gachaBox.classList.add(
        "charging"
    );


    /*
       =========================
       STAGE 1
       =========================
    */

    setChargeMessage(
        "SYSTEM",
        "SYSTEM CHECK"
    );


    /*
       =========================
       STAGE 2
       =========================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "SCANNING",
                "TARGET LOCK"
            );

        },
        350
    );


    /*
       =========================
       STAGE 3
       =========================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "ENERGY",
                "ENERGY CHARGE"
            );

        },
        700
    );


    /*
       =========================
       STAGE 4
       =========================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "CORE",
                "CORE OVERLOAD"
            );

        },
        1050
    );


    /*
       =========================
       STAGE 5
       =========================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "WARNING",
                "ENERGY LIMIT"
            );


            gachaArea.classList.add(
                "limitBreak"
            );


            triggerShockwave(
                rarity
            );

        },
        1400
    );


    /*
       =========================
       STAGE 6
       =========================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "CRITICAL",
                "LIMIT BREAK"
            );


            triggerShockwave(
                rarity
            );


            /*
               通常モードのみ
               再充填
            */

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


    /*
       =========================
       RELEASE
       =========================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "SYSTEM",
                "RELEASE"
            );

        },
        2050
    );


    /*
       =========================
       OPEN
       =========================
    */

    setTimeout(
        function () {


            gachaArea.classList.remove(
                "charging"
            );


            gachaArea.classList.remove(
                "limitBreak"
            );


            gachaBox.classList.remove(
                "charging"
            );


            /*
               =========================
               通常モード爆発
               =========================
            */

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


            /*
               =========================
               FLASH
               
               LDMでは完全に発生しない
               =========================
            */

            gachaArea.classList.remove(
                "flash",
                "flash-ssr",
                "flash-xr"
            );


            if (
                !ldmMode
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


            /*
               =========================
               RESULT
               =========================
            */

            setChargeMessage(
                "RESULT",
                "REVEAL"
            );


            setTimeout(
                function () {


                    gachaArea.classList.add(
                        "reveal"
                    );


                    showResult(
                        rarity
                    );


                    addHistory(
                        rarity
                    );


                    /*
                       ==================
                       SSR
                       ==================
                    */

                    if (
                        rarity === "SSR"
                    ) {

                        setTimeout(
                            function () {

                                ssrOverlay.classList.add(
                                    "show"
                                );

                            },
                            500
                        );

                    }


                    /*
                       ==================
                       XR
                       ==================
                    */

                    else if (
                        rarity === "XR"
                    ) {

                        setTimeout(
                            function () {

                                xrOverlay.classList.add(
                                    "show"
                                );

                            },
                            650
                        );

                    }


                    /*
                       ==================
                       R / SR
                       ==================
                    */

                    else {

                        setTimeout(
                            function () {

                                clearAnimationClasses();


                                clearEffects();


                                setChargeMessage(
                                    "SYSTEM",
                                    "SYSTEM READY"
                                );


                                isRolling = false;

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

gachaBox.addEventListener(
    "click",
    function () {

        openGacha();

    }
);


/* =========================
   初期化
========================= */

resultRarity.textContent =
    "---";


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
