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


/* =========================
   状態
========================= */

let isRolling = false;


/*
   何回目の抽選なのか

   初期値は1

   例：

   1 / 200
   2 / 200
   3 / 200

   SSRを引いたら

   1 / 200

   に戻る
*/

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
   保存データがない場合
*/

if (
    !Number.isFinite(ssrCount) ||
    ssrCount < 1 ||
    ssrCount > SSR_GUARANTEE
) {

    ssrCount = 1;

}


if (
    !Number.isFinite(xrCount) ||
    xrCount < 1 ||
    xrCount > XR_GUARANTEE
) {

    xrCount = 1;

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


    /*
       表示
    */

    ssrCounter.textContent =
        ssrCount +
        " / " +
        SSR_GUARANTEE;


    xrCounter.textContent =
        xrCount +
        " / " +
        XR_GUARANTEE;


    /*
       プログレスバー
    */

    const ssrProgress =
        (
            (ssrCount - 1) /
            SSR_GUARANTEE
        ) * 100;


    const xrProgress =
        (
            (xrCount - 1) /
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


    /*
       0 ～ 100
    */

    const random =
        Math.random() * 100;


    /*
       R
       90%
    */

    if (
        random <
        R_RATE
    ) {

        return "R";

    }


    /*
       SR
       8.5%
    */

    if (
        random <
        R_RATE +
        SR_RATE
    ) {

        return "SR";

    }


    /*
       SSR
       1.4999%
    */

    if (
        random <
        R_RATE +
        SR_RATE +
        SSR_RATE
    ) {

        return "SSR";

    }


    /*
       XR
       0.0001%
    */

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
        "rare-sr",
        "rare-ssr",
        "rare-xr",
        "flash",
        "flash-ssr",
        "flash-xr"
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

    }
);


/* =========================
   ガチャ開始
========================= */

function openGacha() {


    /*
       連打防止
    */

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
       今回の抽選
       =================================
    */

    let rarity =
        drawRarity();


    /*
       =================================
       カウンターを進める
       =================================
    */

    const nextSSRCount =
        ssrCount + 1;


    const nextXRCount =
        xrCount + 1;


    /*
       =================================
       SSR確定
       =================================

       200回目ならSSR確定

       ただしXRもSSR以上なので、
       XRが出た場合もSSRカウンターを
       リセットする
    */

    if (
        nextSSRCount >=
        SSR_GUARANTEE
    ) {

        rarity = "SSR";

    }


    /*
       =================================
       XR確定
       =================================

       15000回目ならXR確定

       XRのほうを先に判定することで
       XR確定が優先される
    */

    if (
        nextXRCount >=
        XR_GUARANTEE
    ) {

        rarity = "XR";

    }


    /*
       =================================
       カウンター更新
       =================================
    */


    /*
       XR
    */

    if (
        rarity === "XR"
    ) {

        ssrCount = 1;

        xrCount = 1;

    }


    /*
       SSR
    */

    else if (
        rarity === "SSR"
    ) {

        ssrCount = 1;

        xrCount =
            Math.min(
                nextXRCount,
                XR_GUARANTEE
            );

    }


    /*
       R / SR
    */

    else {

        ssrCount =
            Math.min(
                nextSSRCount,
                SSR_GUARANTEE
            );


        xrCount =
            Math.min(
                nextXRCount,
                XR_GUARANTEE
            );

    }


    /*
       保存
    */

    saveCounters();


    /*
       表示
    */

    updateCounters();


    /*
       デバッグ用
    */

    console.log(
        "RESULT:",
        rarity
    );

    console.log(
        "SSR COUNT:",
        ssrCount +
        "/" +
        SSR_GUARANTEE
    );

    console.log(
        "XR COUNT:",
        xrCount +
        "/" +
        XR_GUARANTEE
    );


    /*
       =================================
       レア度による演出
       =================================
    */

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
       チャージ開始
    */

    gachaArea.classList.add(
        "charging"
    );


    gachaBox.classList.add(
        "charging"
    );


    /*
       =================================
       1.8秒チャージ
       =================================
    */

    setTimeout(
        function () {


            /*
               チャージ終了
            */

            gachaArea.classList.remove(
                "charging"
            );


            gachaBox.classList.remove(
                "charging"
            );


            /*
               =================================
               フラッシュ
               =================================
            */

            if (
                rarity === "SSR"
            ) {

                gachaArea.classList.add(
                    "flash-ssr"
                );

            }


            else if (
                rarity === "XR"
            ) {

                gachaArea.classList.add(
                    "flash-xr"
                );

            }


            else {

                gachaArea.classList.add(
                    "flash"
                );

            }


            /*
               =================================
               結果
               =================================
            */

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
                    400
                );

            }


            /*
               =================================
               XR
               =================================
            */

            if (
                rarity === "XR"
            ) {

                setTimeout(
                    function () {

                        xrOverlay.classList.add(
                            "show"
                        );

                    },
                    500
                );

            }


            /*
               =================================
               フラッシュ終了
               =================================
            */

            setTimeout(
                function () {

                    clearAnimationClasses();

                },
                800
            );


            isRolling = false;


        },
        1800
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
