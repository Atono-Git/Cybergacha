```javascript
/* =========================================
   CYBER GACHA SYSTEM
========================================= */

"use strict";


/* =========================================
   DEFAULT SETTINGS
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

let rolling = false;


/* =========================================
   ELEMENTS
========================================= */

const gachaBox =
    document.getElementById("gachaBox");

const rollButton =
    document.getElementById("rollButton");

const rollCountDisplay =
    document.getElementById("rollCountDisplay");

const rollButtonSub =
    document.getElementById("rollButtonSub");

const resultArea =
    document.getElementById("resultArea");

const resultRarity =
    document.getElementById("resultRarity");

const resultText =
    document.getElementById("resultText");

const historyList =
    document.getElementById("historyList");

const adminPanel =
    document.getElementById("adminPanel");

const adminAccess =
    document.getElementById("adminAccess");

const xrOverlay =
    document.getElementById("xrOverlay");

const ssrOverlay =
    document.getElementById("ssrOverlay");


/* =========================================
   SAFETY CHECK
========================================= */

if (
    !gachaBox ||
    !rollButton ||
    !rollCountDisplay ||
    !rollButtonSub ||
    !resultArea ||
    !resultRarity ||
    !resultText ||
    !historyList ||
    !adminPanel ||
    !xrOverlay ||
    !ssrOverlay
) {
    console.error(
        "CYBER GACHA SYSTEM: HTML ELEMENT ERROR"
    );
}


/* =========================================
   ROLL COUNT DISPLAY
========================================= */

function updateRollDisplay() {

    rollCountDisplay.textContent =
        String(rollCount);

    rollButtonSub.textContent =
        `${rollCount} ROLL`;
}


/* =========================================
   MINUS
========================================= */

const minusButton =
    document.getElementById("minusButton");

if (minusButton) {

    minusButton.addEventListener(
        "click",
        function () {

            if (rolling) return;

            if (rollCount > 1) {

                rollCount--;

                updateRollDisplay();

            }

        }
    );

}


/* =========================================
   PLUS
========================================= */

const plusButton =
    document.getElementById("plusButton");

if (plusButton) {

    plusButton.addEventListener(
        "click",
        function () {

            if (rolling) return;

            if (rollCount < 9999) {

                rollCount++;

                updateRollDisplay();

            }

        }
    );

}


/* =========================================
   ADMIN PANEL
========================================= */

function toggleAdmin() {

    if (rolling) return;

    adminPanel.classList.toggle("open");

    if (adminPanel.classList.contains("open")) {

        if (adminAccess) {

            adminAccess.classList.add("show");

            setTimeout(
                function () {

                    adminAccess.classList.remove(
                        "show"
                    );

                },
                1800
            );

        }

    }

}


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        const active =
            document.activeElement;

        const tag =
            active ?
            active.tagName :
            "";

        const editing =
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT";


        /* =========================
           Q = ADMIN
        ========================= */

        if (
            event.key.toLowerCase() === "q" &&
            !event.repeat &&
            !editing
        ) {

            event.preventDefault();

            toggleAdmin();

            return;
        }


        /* =========================
           SPACE = GACHA
        ========================= */

        if (
            event.code === "Space" &&
            !event.repeat &&
            !editing
        ) {

            event.preventDefault();

            if (
                adminPanel.classList.contains(
                    "open"
                )
            ) {
                return;
            }

            startGacha();

        }

    }
);


/* =========================================
   ADMIN CLOSE
========================================= */

const adminClose =
    document.getElementById("adminClose");

if (adminClose) {

    adminClose.addEventListener(
        "click",
        function () {

            adminPanel.classList.remove(
                "open"
            );

        }
    );

}


/* =========================================
   ADMIN ROLL COUNT
========================================= */

const adminRollCount =
    document.getElementById(
        "adminRollCount"
    );

if (adminRollCount) {

    adminRollCount.addEventListener(
        "input",
        function () {

            let value =
                Number(this.value);

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

            this.value =
                String(value);

            updateRollDisplay();

        }
    );

}


/* =========================================
   QUICK ROLL
========================================= */

document
    .querySelectorAll(
        ".quick-rolls button"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const value =
                        Number(
                            this.dataset.roll
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

                    if (adminRollCount) {

                        adminRollCount.value =
                            String(rollCount);

                    }

                    updateRollDisplay();

                }
            );

        }
    );


/* =========================================
   RARITY INPUTS
========================================= */

const rateInputs = {

    R:
        document.getElementById("rateR"),

    SR:
        document.getElementById("rateSR"),

    SSR:
        document.getElementById("rateSSR"),

    XR:
        document.getElementById("rateXR")

};


const totalDisplay =
    document.getElementById(
        "totalDisplay"
    );


/* =========================================
   CHECK TOTAL
========================================= */

function getInputRates() {

    return {

        R:
            Math.max(
                0,
                Number(rateInputs.R.value) || 0
            ),

        SR:
            Math.max(
                0,
                Number(rateInputs.SR.value) || 0
            ),

        SSR:
            Math.max(
                0,
                Number(rateInputs.SSR.value) || 0
            ),

        XR:
            Math.max(
                0,
                Number(rateInputs.XR.value) || 0
            )

    };

}


function checkTotal() {

    const inputRates =
        getInputRates();

    const total =
        inputRates.R +
        inputRates.SR +
        inputRates.SSR +
        inputRates.XR;


    if (totalDisplay) {

        totalDisplay.textContent =
            `TOTAL : ${total.toFixed(4)}%`;

        if (
            Math.abs(total - 100) >
            0.000001
        ) {

            totalDisplay.classList.add(
                "invalid"
            );

        } else {

            totalDisplay.classList.remove(
                "invalid"
            );

        }

    }


    return (
        Math.abs(total - 100) <=
        0.000001
    );

}


Object.values(rateInputs)
    .forEach(
        function (input) {

            if (!input) return;

            input.addEventListener(
                "input",
                checkTotal
            );

        }
    );


/* =========================================
   FORCE RARITY
========================================= */

document
    .querySelectorAll(
        "[data-force]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            "[data-force]"
                        )
                        .forEach(
                            function (b) {

                                b.classList.remove(
                                    "active"
                                );

                            }
                        );


                    this.classList.add(
                        "active"
                    );


                    forceRarity =
                        this.dataset.force;


                    const status =
                        document.getElementById(
                            "forceStatus"
                        );

                    if (status) {

                        status.textContent =
                            `MODE : ${forceRarity}`;

                    }

                }
            );

        }
    );


/* =========================================
   APPLY
========================================= */

const applyButton =
    document.getElementById(
        "applyButton"
    );

if (applyButton) {

    applyButton.addEventListener(
        "click",
        function () {

            if (!checkTotal()) {

                alert(
                    "確率の合計を100%にしてください。"
                );

                return;

            }


            rates =
                getInputRates();


            adminPanel.classList.remove(
                "open"
            );

        }
    );

}


/* =========================================
   RESET
========================================= */

const resetButton =
    document.getElementById(
        "resetButton"
    );

if (resetButton) {

    resetButton.addEventListener(
        "click",
        function () {

            rates = {
                ...DEFAULT_RATES
            };


            rateInputs.R.value =
                DEFAULT_RATES.R;

            rateInputs.SR.value =
                DEFAULT_RATES.SR;

            rateInputs.SSR.value =
                DEFAULT_RATES.SSR;

            rateInputs.XR.value =
                DEFAULT_RATES.XR;


            forceRarity =
                "RANDOM";


            document
                .querySelectorAll(
                    "[data-force]"
                )
                .forEach(
                    function (button) {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


            const randomButton =
                document.querySelector(
                    '[data-force="RANDOM"]'
                );

            if (randomButton) {

                randomButton.classList.add(
                    "active"
                );

            }


            const status =
                document.getElementById(
                    "forceStatus"
                );

            if (status) {

                status.textContent =
                    "MODE : RANDOM";

            }


            checkTotal();

        }
    );

}


/* =========================================
   RANDOM RARITY
========================================= */

function getRandomRarity() {

    if (
        forceRarity !== "RANDOM"
    ) {

        return forceRarity;

    }


    const random =
        Math.random() * 100;


    if (
        random < rates.XR
    ) {

        return "XR";

    }


    if (
        random <
        rates.XR +
        rates.SSR
    ) {

        return "SSR";

    }


    if (
        random <
        rates.XR +
        rates.SSR +
        rates.SR
    ) {

        return "SR";

    }


    return "R";

}


/* =========================================
   BOX ANIMATION
========================================= */

function animateBox() {

    return new Promise(
        function (resolve) {

            const animation =
                gachaBox.animate(
                    [
                        {
                            transform:
                                "translate(0, 0) rotate(0deg)"
                        },

                        {
                            transform:
                                "translate(-10px, 0) rotate(-4deg)"
                        },

                        {
                            transform:
                                "translate(10px, 0) rotate(4deg)"
                        },

                        {
                            transform:
                                "translate(-7px, 0) rotate(-3deg)"
                        },

                        {
                            transform:
                                "translate(7px, 0) rotate(3deg)"
                        },

                        {
                            transform:
                                "translate(0, 0) rotate(0deg)"
                        }

                    ],
                    {
                        duration: 800,
                        easing:
                            "ease-in-out"
                    }
                );


            animation.onfinish =
                function () {

                    resolve();

                };

        }
    );

}


/* =========================================
   ONE ROLL
========================================= */

async function rollOnce() {

    const rarity =
        getRandomRarity();


    await animateBox();


    return rarity;

}


/* =========================================
   GACHA START
========================================= */

async function startGacha() {

    if (rolling) {
        return;
    }


    rolling = true;


    rollButton.disabled = true;


    resultArea.classList.add(
        "hidden"
    );


    const results = [];


    for (
        let i = 0;
        i < rollCount;
        i++
    ) {

        const rarity =
            await rollOnce();


        results.push(
            rarity
        );


        addHistory(
            rarity
        );


        /*
           レア演出
        */

        if (
            rarity === "XR"
        ) {

            await showXR();

        }

        else if (
            rarity === "SSR"
        ) {

            await showSSR();

        }

    }


    showFinalResult(
        results
    );


    rolling = false;


    rollButton.disabled = false;

}


/* =========================================
   OPEN BUTTON
========================================= */

rollButton.addEventListener(
    "click",
    function () {

        startGacha();

    }
);


/* =========================================
   FINAL RESULT
========================================= */

function showFinalResult(results) {

    let best =
        "R";


    if (
        results.includes("XR")
    ) {

        best =
            "XR";

    }

    else if (
        results.includes("SSR")
    ) {

        best =
            "SSR";

    }

    else if (
        results.includes("SR")
    ) {

        best =
            "SR";

    }


    resultRarity.textContent =
        best;


    resultText.textContent =
        `${results.length} ROLL COMPLETE`;


    resultArea.classList.remove(
        "hidden"
    );

}


/* =========================================
   HISTORY
========================================= */

function addHistory(rarity) {

    const item =
        document.createElement(
            "div"
        );


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
   SSR
========================================= */

function showSSR() {

    return new Promise(
        function (resolve) {

            ssrOverlay.classList.add(
                "active"
            );


            const button =
                document.getElementById(
                    "ssrCloseButton"
                );


            if (!button) {

                ssrOverlay.classList.remove(
                    "active"
                );

                resolve();

                return;

            }


            button.onclick =
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


            const button =
                document.getElementById(
                    "xrCloseButton"
                );


            if (!button) {

                xrOverlay.classList.remove(
                    "active"
                );

                resolve();

                return;

            }


            button.onclick =
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
   INITIALIZE
========================================= */

updateRollDisplay();

checkTotal();


console.log(
    "CYBER GACHA SYSTEM ONLINE"
);

console.log(
    "SPACE = GACHA"
);

console.log(
    "Q = ADMIN CONSOLE"
);
```
