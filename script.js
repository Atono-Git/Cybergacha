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


const warningText =
    document.getElementById(
        "warningText"
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
            String(ldmMode)
        );


        updateLDM();

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
   表示
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


    ssrBar.style.width =
        Math.min(
            (
                ssrCount /
                SSR_GUARANTEE
            ) * 100,
            100
        ) + "%";


    xrBar.style.width =
        Math.min(
            (
                xrCount /
                XR_GUARANTEE
            ) * 100,
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
        random <
        R_RATE
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
   結果
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


    let count = 45;


    if (
        rarity === "SR"
    ) {

        count = 75;

    }


    else if (
        rarity === "SSR"
    ) {

        count = 110;

    }


    else if (
        rarity === "XR"
    ) {

        count = 160;

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


        const x =
            Math.cos(
                angle
            ) *
            distance;


        const y =
            Math.sin(
                angle
            ) *
            distance;


        crystal.style.setProperty(
            "--startX",
            x + "px"
        );


        crystal.style.setProperty(
            "--startY",
            y + "px"
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


    let count = 30;


    if (
        rarity === "SR"
    ) {

        count = 50;

    }


    else if (
        rarity === "SSR"
    ) {

        count = 75;

    }


    else if (
        rarity === "XR"
    ) {

        count = 110;

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
                Math.random() *
                1
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


    let count = 8;


    if (
        rarity === "SR"
    ) {

        count = 10;

    }


    else if (
        rarity === "SSR"
    ) {

        count = 14;

    }


    else if (
        rarity === "XR"
    ) {

        count = 20;

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
   SHOCKWAVE
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


    shockwaveContainer.classList.add(
        "active"
    );


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

}


/* =========================
   全演出削除
========================= */

function clearEffects() {

    clearCrystals();

    clearParticles();

    clearBeams();

    shockwaveContainer.className =
        "";

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
   SSR
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
   XR
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
   ガチャ開始
========================= */

function openGacha() {


    if (
        isRolling
    ) {

        return;

    }


    isRolling = true;


    closeOverlays();


    clearAnimationClasses();


    clearEffects();


    /*
       =============================
       抽選
       =============================
    */

    let rarity =
        drawRarity();


    /*
       =============================
       今回の回数
       =============================
    */

    const nextSSRCount =
        ssrCount + 1;


    const nextXRCount =
        xrCount + 1;


    /*
       =============================
       XR保証
       =============================
    */

    if (
        nextXRCount >=
        XR_GUARANTEE
    ) {

        rarity = "XR";

    }


    /*
       =============================
       SSR保証
       =============================
    */

    else if (
        nextSSRCount >=
        SSR_GUARANTEE
    ) {

        rarity = "SSR";

    }


    /*
       =============================
       カウンター
       =============================
    */

    if (
        rarity === "XR"
    ) {

        ssrCount = 0;

        xrCount = 0;

    }


    else if (
        rarity === "SSR"
    ) {

        ssrCount = 0;

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
       =============================
       レア度クラス
       =============================
    */

    gachaArea.classList.add(
        "rare-" +
        rarity.toLowerCase()
    );


    /*
       =============================
       派手演出素材
       =============================
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
       =============================
       CHARGE
       =============================
    */

    gachaArea.classList.add(
        "charging"
    );


    gachaBox.classList.add(
        "charging"
    );


    /*
       =============================
       STAGE 0
       =============================
    */

    setChargeMessage(
        "SYSTEM",
        "SYSTEM CHECK"
    );


    warningText.textContent =
        "ENERGY LEVEL: 08%";


    /*
       =============================
       STAGE 1
       =============================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "SCANNING",
                "TARGET LOCK"
            );

            warningText.textContent =
                "ENERGY LEVEL: 24%";

        },
        350
    );


    /*
       =============================
       STAGE 2
       =============================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "ENERGY",
                "ENERGY CHARGE"
            );

            warningText.textContent =
                "ENERGY LEVEL: 46%";

        },
        700
    );


    /*
       =============================
       STAGE 3
       =============================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "CORE",
                "CORE OVERLOAD"
            );

            warningText.textContent =
                "ENERGY LEVEL: 67%";

        },
        1050
    );


    /*
       =============================
       STAGE 4
       =============================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "WARNING",
                "ENERGY LIMIT"
            );

            warningText.textContent =
                "ENERGY LEVEL: 84%";


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
       =============================
       STAGE 5
       =============================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "CRITICAL",
                "LIMIT BREAK"
            );

            warningText.textContent =
                "ENERGY LEVEL: 100%";


            triggerShockwave(
                rarity
            );


            /*
               通常モードだけ
               一気にエフェクト増強
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
       =============================
       一瞬の静止
       =============================
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
       =============================
       OPEN
       =============================
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
               通常モード
               クリスタル爆発
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


                /*
                   クリスタルを再生成して
                   一斉飛散感を出す
                */

                createCrystals(
                    rarity
                );

            }


            /*
               =========================
               フラッシュ
               =========================

               LDMでは完全に実行しない
            */

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


updateCounters();


setChargeMessage(
    "CYBER",
    "GACHA"
);


warningText.textContent =
    "ENERGY LEVEL: 0%";


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
