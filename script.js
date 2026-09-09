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


/* =========================
   状態
========================= */

let isRolling = false;


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


/*
   初回は0
*/

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


    else if (
        rarity === "XR"
    ) {

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


    if (
        rarity === "SSR"
    ) {

        item.style.color =
            "#ffcc33";

        item.style.borderColor =
            "#ffcc33";

    }


    if (
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
   アニメーション解除
========================= */

function clearAnimationClasses() {

    gachaArea.classList.remove(
        "charging",
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

    }
);


/* =========================
   演出メッセージ
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


    /*
       =================================
       今回の結果を先に決定
       =================================
    */

    let rarity =
        drawRarity();


    /*
       =================================
       今回の回数
       =================================
    */

    const nextSSRCount =
        ssrCount + 1;


    const nextXRCount =
        xrCount + 1;


    /*
       XR保証を最優先
    */

    if (
        nextXRCount >=
        XR_GUARANTEE
    ) {

        rarity = "XR";

    }


    /*
       SSR保証
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


    saveCounters();

    updateCounters();


    /*
       =================================
       レア度クラス
       =================================
    */

    if (
        rarity === "R"
    ) {

        gachaArea.classList.add(
            "rare-r"
        );

    }


    if (
        rarity === "SR"
    ) {

        gachaArea.classList.add(
            "rare-sr"
        );

    }


    if (
        rarity === "SSR"
    ) {

        gachaArea.classList.add(
            "rare-ssr"
        );

    }


    if (
        rarity === "XR"
    ) {

        gachaArea.classList.add(
            "rare-xr"
        );

    }


    /*
       =================================
       TAP BOXを消す
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
        550
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
        1100
    );


    /*
       =================================
       STAGE 4
       =================================
    */

    setTimeout(
        function () {

            setChargeMessage(
                "LIMIT",
                "LIMIT BREAK"
            );

            gachaArea.classList.add(
                "limitBreak"
            );

        },
        1600
    );


    /*
       =================================
       STAGE 5
       =================================

       通常より長めに溜める
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
               =================================
               開放フラッシュ
               =================================
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
               =================================
               REVEAL
               =================================
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
                       =================================
                       SSR
                       =================================
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
                       =================================
                       XR
                       =================================
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
                       =================================
                    */

                    else {

                        setTimeout(
                            function () {

                                clearAnimationClasses();

                                isRolling = false;

                                setChargeMessage(
                                    "SYSTEM",
                                    "SYSTEM READY"
                                );

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
   初期表示
========================= */

resultRarity.textContent =
    "---";


setChargeMessage(
    "CYBER",
    "GACHA"
);


updateCounters();


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
