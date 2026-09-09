"use strict";


/* =========================================
   CYBER GACHA
   R 90%
   SR 8.5%
   SSR 1.4999%
   XR 0.0001%
========================================= */


/* =========================
   確率
========================= */

const R_RATE = 90;
const SR_RATE = 8.5;
const SSR_RATE = 1.4999;
const XR_RATE = 0.0001;


/* =========================
   要素取得
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
   状態
========================= */

let isRolling = false;


/* =========================
   起動確認
========================= */

console.log("================================");
console.log("CYBER GACHA START");
console.log("R   =", R_RATE + "%");
console.log("SR  =", SR_RATE + "%");
console.log("SSR =", SSR_RATE + "%");
console.log("XR  =", XR_RATE + "%");
console.log("TOTAL =", R_RATE + SR_RATE + SSR_RATE + XR_RATE + "%");
console.log("================================");


/* =========================
   確率抽選
========================= */

function drawRarity() {

    /*
       0 ～ 100 の乱数を作る
    */

    const random =
        Math.random() * 100;


    /*
       0 ～ 90
       R = 90%
    */

    if (random < R_RATE) {

        return "R";

    }


    /*
       90 ～ 98.5
       SR = 8.5%
    */

    if (
        random <
        R_RATE + SR_RATE
    ) {

        return "SR";

    }


    /*
       98.5 ～ 99.9999
       SSR = 1.4999%
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
       99.9999 ～ 100
       XR = 0.0001%
    */

    return "XR";

}


/* =========================
   結果表示
========================= */

function showResult(rarity) {

    resultRarity.textContent =
        rarity;


    /* R */

    if (rarity === "R") {

        resultRarity.style.color =
            "#00eaff";

        resultRarity.style.textShadow =
            "0 0 15px #00eaff, 0 0 40px #00eaff";

    }


    /* SR */

    else if (rarity === "SR") {

        resultRarity.style.color =
            "#55ff99";

        resultRarity.style.textShadow =
            "0 0 15px #55ff99, 0 0 40px #55ff99";

    }


    /* SSR */

    else if (rarity === "SSR") {

        resultRarity.style.color =
            "#ffcc33";

        resultRarity.style.textShadow =
            "0 0 20px #ffcc33, 0 0 50px #ffcc33";

    }


    /* XR */

    else if (rarity === "XR") {

        resultRarity.style.color =
            "#ffffff";

        resultRarity.style.textShadow =
            "0 0 20px white, 0 0 50px white";

    }

}


/* =========================
   履歴追加
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
   演出を閉じる
========================= */

function closeOverlays() {

    ssrOverlay.classList.remove("show");

    xrOverlay.classList.remove("show");

}


/* =========================
   SSR CONTINUE
========================= */

ssrContinue.addEventListener(
    "click",
    function () {

        ssrOverlay.classList.remove("show");

    }
);


/* =========================
   XR CONTINUE
========================= */

xrContinue.addEventListener(
    "click",
    function () {

        xrOverlay.classList.remove("show");

    }
);


/* =========================
   ガチャ
========================= */

function openGacha() {

    console.log("GACHA OPEN");


    /*
       連打防止
    */

    if (isRolling) {

        return;

    }


    isRolling = true;


    /*
       前の演出を閉じる
    */

    closeOverlays();


    /*
       アニメーションをリセット
    */

    gachaBox.classList.remove(
        "rolling"
    );


    /*
       強制再描画
       → 毎回アニメーションする
    */

    void gachaBox.offsetWidth;


    /*
       ボックスを動かす
    */

    gachaBox.classList.add(
        "rolling"
    );


    /*
       0.75秒後に結果
    */

    setTimeout(
        function () {


            /*
               確率に従って抽選
            */

            const rarity =
                drawRarity();


            console.log(
                "RESULT:",
                rarity
            );


            /*
               結果表示
            */

            showResult(
                rarity
            );


            /*
               履歴
            */

            addHistory(
                rarity
            );


            /*
               SSR演出
            */

            if (rarity === "SSR") {

                ssrOverlay.classList.add(
                    "show"
                );

            }


            /*
               XR演出
            */

            if (rarity === "XR") {

                xrOverlay.classList.add(
                    "show"
                );

            }


            /*
               ロック解除
            */

            isRolling = false;


        },
        750
    );


    /*
       アニメーション終了
    */

    setTimeout(
        function () {

            gachaBox.classList.remove(
                "rolling"
            );

        },
        800
    );

}


/* =========================
   BOXクリック
========================= */

gachaBox.addEventListener(
    "click",
    function () {

        openGacha();

    }
);


/* =========================
   初期状態
========================= */

resultRarity.textContent =
    "---";


console.log(
    "CYBER GACHA READY"
);
