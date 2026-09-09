```javascript
"use strict";


/* =========================================
   DEFAULT
========================================= */

const DEFAULT_RATES = {
    R: 90,
    SR: 8.5,
    SSR: 1.4999,
    XR: 0.0001
};


/* =========================================
   STATE
========================================= */

let rates = {
    ...DEFAULT_RATES
};

let rollCount = 1;

let forceRarity = "RANDOM";

let isRolling = false;


/* =========================================
   ELEMENTS
========================================= */

const gachaBox =
    document.getElementById("gachaBox");

const adminButton =
    document.getElementById("adminButton");

const adminPanel =
    document.getElementById("adminPanel");

const adminClose =
    document.getElementById("adminClose");

const rollCountInput =
    document.getElementById("rollCountInput");

const rateR =
    document.getElementById("rateR");

const rateSR =
    document.getElementById("rateSR");

const rateSSR =
    document.getElementById("rateSSR");

const rateXR =
    document.getElementById("rateXR");

const totalDisplay =
    document.getElementById("totalDisplay");

const applyButton =
    document.getElementById("applyButton");

const resetButton =
    document.getElementById("resetButton");

const forceStatus =
    document.getElementById("forceStatus");

const resultArea =
    document.getElementById("resultArea");

const resultRarity =
    document.getElementById("resultRarity");

const resultText =
    document.getElementById("resultText");

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


/* =========================================
   ADMIN OPEN / CLOSE
========================================= */

function openAdmin() {

    if (isRolling) {
        return;
    }

    adminPanel.classList.add("open");
}


function closeAdmin() {

    adminPanel.classList.remove("open");
}


adminButton.addEventListener(
    "click",
    openAdmin
);


adminClose.addEventListener(
    "click",
    closeAdmin
);


/* =========================================
   ROLL COUNT
========================================= */

function updateRollCount() {

    let value =
        Number(rollCountInput.value);

    if (!Number.isFinite(value)) {
        value = 1;
    }

    value =
        Math.floor(value);

    if (value < 1) {
        value = 1;
    }

    if (value > 9999) {
        value = 9999;
    }

    rollCount = value;

    rollCountInput.value =
        String(value);
}


rollCountInput.addEventListener(
    "change",
    updateRollCount
);


/* =========================================
   QUICK COUNT BUTTONS
========================================= */

document
    .querySelectorAll("[data-count]")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const value =
                    Number(
                        this.dataset.count
                    );

                if (
                    !Number.isFinite(value)
                ) {
                    return;
                }

                rollCount =
                    Math.max(
                        1,
                        Math.min(
                            9999,
                            Math.floor(value)
                        )
                    );

                rollCountInput.value =
                    String(rollCount);

            }
        );

    });


/* =========================================
   TOTAL
========================================= */

function readRates() {

    return {

        R:
            Math.max(
                0,
                Number(rateR.value) || 0
            ),

        SR:
            Math.max(
                0,
                Number(rateSR.value) || 0
            ),

        SSR:
            Math.max(
                0,
                Number(rateSSR.value) || 0
            ),

        XR:
            Math.max(
                0,
                Number(rateXR.value) || 0
            )

    };
}


function checkTotal() {

    const inputRates =
        readRates();

    const total =
        inputRates.R +
        inputRates.SR +
        inputRates.SSR +
        inputRates.XR;


    totalDisplay.textContent =
        "TOTAL : " +
        total.toFixed(4) +
        "%";


    if (
        Math.abs(total - 100) >
        0.000001
    ) {

        totalDisplay.classList.add(
            "invalid"
        );

        return false;

    }


    totalDisplay.classList.remove(
        "invalid"
    );

    return true;
}


rateR.addEventListener(
    "input",
    checkTotal
);

rateSR.addEventListener(
    "input",
    checkTotal
);

rateSSR.addEventListener(
    "input",
    checkTotal
);

rateXR.addEventListener(
    "input",
    checkTotal
);


/* =========================================
   FORCE RARITY
========================================= */

document
    .querySelectorAll("[data-force]")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        "[data-force]"
                    )
                    .forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                this.classList.add(
                    "selected"
                );


                forceRarity =
                    this.dataset.force;


                forceStatus.textContent =
                    "MODE : " +
                    forceRarity;

            }
        );

    });


/* =========================================
   APPLY
========================================= */

applyButton.addEventListener(
    "click",
    function () {

        updateRollCount();

        if (!checkTotal()) {

            alert(
                "確率の合計を100%にしてください。"
            );

            return;
        }


        rates =
            readRates();


        closeAdmin();

    }
);


/* =========================================
   RESET
========================================= */

resetButton.addEventListener(
    "click",
    function () {

        rates = {
            ...DEFAULT_RATES
        };


        rateR.value =
            DEFAULT_RATES.R;

        rateSR.value =
            DEFAULT_RATES.SR;

        rateSSR.value =
            DEFAULT_RATES.SSR;

        rateXR.value =
            DEFAULT_RATES.XR;


        rollCount = 1;

        rollCountInput.value =
            "1";


        forceRarity =
            "RANDOM";


        document
            .querySelectorAll(
                "[data-force]"
            )
            .forEach(
                function (button) {

                    button.classList.remove(
                        "selected"
                    );

                }
            );


        const randomButton =
            document.querySelector(
                '[data-force="RANDOM"]'
            );


        randomButton.classList.add(
            "selected"
        );


        forceStatus.textContent =
            "MODE : RANDOM";


        checkTotal();

    }
);


/* =========================================
   RANDOM
========================================= */

function getRarity() {

    if (
        forceRarity !== "RANDOM"
    ) {

        return forceRarity;
    }


    const random =
        Math.random() * 100;


    let border = 0;


    /*
       XR
    */

    border += rates.XR;

    if (
        random < border
    ) {
        return "XR";
    }


    /*
       SSR
    */

    border += rates.SSR;

    if (
        random < border
    ) {
        return "SSR";
    }


    /*
       SR
    */

    border += rates.SR;

    if (
        random < border
    ) {
        return "SR";
    }


    /*
       R
    */

    return "R";
}


/* =========================================
   BOX ANIMATION
========================================= */

function shakeBox() {

    return new Promise(
        function (resolve) {

            gachaBox.animate(
                [
                    {
                        transform:
                            "translateX(0) rotate(0deg)"
                    },

                    {
                        transform:
                            "translateX(-10px) rotate(-4deg)"
                    },

                    {
                        transform:
                            "translateX(10px) rotate(4deg)"
                    },

                    {
                        transform:
                            "translateX(-7px) rotate(-3deg)"
                    },

                    {
                        transform:
                            "translateX(7px) rotate(3deg)"
                    },

                    {
                        transform:
                            "translateX(0) rotate(0deg)"
                    }
                ],
                {
                    duration: 900,
                    easing: "ease-in-out"
                }
            ).onfinish =
                function () {

                    resolve();

                };

        }
    );
}


/* =========================================
   WAIT
========================================= */

function wait(ms) {

    return new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                ms
            );

        }
    );
}


/* =========================================
   SSR
========================================= */

function showSSR() {

    return new Promise(
        function (resolve) {

            ssrOverlay.classList.add(
                "active"
            );


            ssrContinue.onclick =
                function () {

                    ssrOverlay.classList.remove(
                        "active"
                    );

                    resolve();

                };

        }
    );
}


/* =========================================
   XR
========================================= */

function showXR() {

    return new Promise(
        function (resolve) {

            xrOverlay.classList.add(
                "active"
            );


            xrContinue.onclick =
                function () {

                    xrOverlay.classList.remove(
                        "active"
                    );

                    resolve();

                };

        }
    );
}


/* =========================================
   HISTORY
========================================= */

function addHistory(rarity) {

    const item =
        document.createElement("div");

    item.className =
        "history-item";

    item.textContent =
        rarity;


    historyList.prepend(
        item
    );


    while (
        historyList.children.length >
        100
    ) {

        historyList.removeChild(
            historyList.lastChild
        );

    }
}


/* =========================================
   FINAL RESULT
========================================= */

function showFinalResult(results) {

    let highest = "R";


    if (
        results.includes("XR")
    ) {

        highest = "XR";

    }

    else if (
        results.includes("SSR")
    ) {

        highest = "SSR";

    }

    else if (
        results.includes("SR")
    ) {

        highest = "SR";

    }


    resultRarity.textContent =
        highest;


    resultText.textContent =
        results.length +
        " ROLL COMPLETE";


    resultArea.classList.remove(
        "hidden"
    );
}


/* =========================================
   GACHA
========================================= */

async function openGacha() {

    if (isRolling) {
        return;
    }


    /*
       管理者画面を閉じる
    */

    closeAdmin();


    /*
       状態変更
    */

    isRolling = true;

    gachaBox.style.pointerEvents =
        "none";


    resultArea.classList.add(
        "hidden"
    );


    const results = [];


    /*
       連数分実行
    */

    for (
        let i = 0;
        i < rollCount;
        i++
    ) {

        await shakeBox();


        const rarity =
            getRarity();


        results.push(
            rarity
        );


        addHistory(
            rarity
        );


        /*
           XR
        */

        if (
            rarity === "XR"
        ) {

            await showXR();

        }


        /*
           SSR
        */

        else if (
            rarity === "SSR"
        ) {

            await showSSR();

        }


        /*
           少し間隔を開ける
        */

        if (
            i < rollCount - 1
        ) {

            await wait(150);

        }

    }


    showFinalResult(
        results
    );


    isRolling = false;


    gachaBox.style.pointerEvents =
        "auto";
}


/* =========================================
   BOX CLICK
========================================= */

gachaBox.addEventListener(
    "click",
    openGacha
);


/* =========================================
   KEYBOARD ACCESSIBILITY
   Enterだけは残す
========================================= */

gachaBox.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            openGacha();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

checkTotal();

console.log(
    "CYBER GACHA SYSTEM ONLINE"
);
```
