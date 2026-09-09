"use strict";


/* =========================================
   CYBER GACHA
========================================= */


/* =========================
   通常確率
========================= */

const R_RATE = 90;

const SR_RATE = 8.5;

const SSR_RATE = 1.4999;

const XR_RATE = 0.0001;


/* =========================
   確定回数
========================= */

const SSR_GUARANTEE = 200;

const XR_GUARANTEE = 15000;


/* =========================
   要素
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
        ) * 100;


    const xrProgress =
        (
            xrCount /
            XR_GUARANTEE
        ) * 100;


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
        Math.random() * 100;


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
            "#ffffff";

        resultRarity.style.textShadow =
            "0 0 20px white, 0 0 50px white";

    }

}


/* =========================
   履歴
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
            "#ffffff";

        item.style.borderColor =
            "#ffffff";

    }


    historyList.prepend(
        item
    );

}


/* =========================
   クリスタル削除
========================= */

function clearCrystals() {

    crystalContainer.innerHTML = "";

    crystalContainer.className = "";

}


/* =========================
   クリスタル生成
========================= */

function createCrystals(
    rarity
) {

    clearCrystals();


    /*
       LDMでは
       クリスタル演出を停止
    */

    if (ldmMode) {

        return;

    }


    let count = 35;


    if (
        rarity === "SR"
    ) {

        count = 55;

    }


    else if (
        rarity === "SSR"
    ) {

        count = 85;

    }


    else if (
        rarity === "XR"
    ) {

        count = 120;

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


        /*
           円周上のランダム位置
        */

        const angle =
            Math.random() *
            Math.PI *
            2;


        /*
           BOXから遠い位置
        */

        const distance =
            180 +
            Math.random() *
            220;


        const startX =
            Math.cos(angle) *
            distance;


        const startY =
            Math.sin(angle) *
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
                9
            ) + "px"
        );


        crystal.style.setProperty(
            "--duration",
            (
                0.9 +
                Math.random() *
                1.2
            ) + "s"
        );


        crystal.style.setProperty(
            "--delay",
            (
                Math.random() *
                1.2
            ) + "s"
        );


        /*
           レア度カラー
        */

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
   クリスタル爆発
========================= */

function crystalBurst(
    rarity
) {

    if (ldmMode) {

        return;

    }


    crystalContainer.classList.add(
        "burst"
    );


    if (
        rarity === "SSR"
    ) {

        crystalContainer.classList.add(
            "burst-ssr"
        );

    }


    if (
        rarity === "XR"
    ) {

        crystalContainer.classList.add(
            "burst-xr"
        );

    }


    setTimeout(
        function () {

            clearCrystals();

        },
        1300
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


        isRolling = false;


        clearAnimationClasses();


        setChargeMessage(
            "SYSTEM",
            "SYSTEM READY"
        );

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


        isRolling = false;


        clearAnimationClasses();


        setChargeMessage(
            "SYSTEM",
            "SYSTEM READY"
        );

    }
);


/* =========================
   ガチャ
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


    clearCrystals();


    /*
       =================================
       結果決定
       =================================
    */

    let rarity =
        drawRarity();


    /*
       =================================
       カウンターを1進める
       =================================
    */

    const nextSSRCount =
        ssrCount + 1;


    const nextXRCount =
        xrCount + 1;


    /*
       =================================
       XR保証
       =================================
    */

    if (
        nextXRCount >=
        XR_GUARANTEE
    ) {

        rarity = "XR";

    }


    /*
       =================================
       SSR保証
       =================================
    */

    else if (
        nextSSRCount >=
        SSR_GUARANTEE
    ) {

        rarity = "SSR";

    }


    /*
       =================================
       カウンター更新
       =================================
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
       =================================
       レア度
       =================================
    */

    gachaArea.classList.add(
        "rare-" +
        rarity.toLowerCase()
    );


    /*
       =================================
       豪華演出用クリスタル
       =================================
    */

    createCrystals(
        rarity
    );


    /*
       =================================
       CHARGE START
       =================================
    */

    gachaArea.classList.add(
        "charging"
    );


    gachaBox.classList.add(
        "charging"
    );


    /*
       =================================
       STAGE 1
       =================================
    */

    setChargeMessage(
        "SYSTEM",
        "SYSTEM CHECK"
    );


    /*
       =================================
       STAGE 2
       =================================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "ENERGY",
                "ENERGY CHARGE"
            );

        },
        500
    );


    /*
       =================================
       STAGE 3
       =================================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "CORE",
                "CORE OVERLOAD"
            );

        },
        1000
    );


    /*
       =================================
       STAGE 4
       =================================
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

        },
        1500
    );


    /*
       =================================
       STAGE 5
       =================================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "SYSTEM",
                "LIMIT BREAK"
            );

        },
        1850
    );


    /*
       =================================
       OPEN
       =================================
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
               クリスタル爆発
            */

            crystalBurst(
                rarity
            );


            /*
               フラッシュ
            */

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


            /*
               OPEN
            */

            setChargeMessage(
                "RESULT",
                "REVEAL"
            );


            /*
               結果表示
            */

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
                       SSR
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
                       XR
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
                       R / SR
                    */

                    else {

                        setTimeout(
                            function () {

                                clearAnimationClasses();

                                clearCrystals();

                                setChargeMessage(
                                    "SYSTEM",
                                    "SYSTEM READY"
                                );

                                isRolling = false;

                            },
                            900
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
