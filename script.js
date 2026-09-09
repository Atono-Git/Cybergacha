```javascript
/* =========================================
   CYBER GACHA SYSTEM
========================================= */

const DEFAULT_RATES = {
    R: 90,
    SR: 8.5,
    SSR: 1.4999,
    XR: 0.0001
};

let rates = { ...DEFAULT_RATES };
let rollCount = 1;
let forceRarity = "RANDOM";
let rolling = false;

/* =========================================
   ELEMENTS
========================================= */

const gachaBox = document.getElementById("gachaBox");
const rollButton = document.getElementById("rollButton");

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
   ROLL COUNT
========================================= */

function updateRollDisplay() {

    rollCountDisplay.textContent = rollCount;

    rollButtonSub.textContent =
        `${rollCount} ROLL`;
}


document.getElementById("minusButton")
    .addEventListener("click", () => {

        if (rollCount > 1) {
            rollCount--;
            updateRollDisplay();
        }

    });


document.getElementById("plusButton")
    .addEventListener("click", () => {

        if (rollCount < 9999) {
            rollCount++;
            updateRollDisplay();
        }

    });


/* =========================================
   ADMIN PANEL
========================================= */

function toggleAdmin() {

    /*
       ガチャ中は管理者画面を開かない
    */

    if (rolling) return;

    adminPanel.classList.toggle("open");

    if (adminPanel.classList.contains("open")) {

        adminAccess.classList.add("show");

        setTimeout(() => {
            adminAccess.classList.remove("show");
        }, 1800);

    }

}


document.addEventListener("keydown", (event) => {

    /*
       Q = 管理者画面
    */

    if (
        event.key.toLowerCase() === "q" &&
        !event.repeat
    ) {

        /*
           入力欄を操作中なら無視
        */

        const tag =
            document.activeElement?.tagName;

        if (
            tag !== "INPUT" &&
            tag !== "TEXTAREA" &&
            tag !== "SELECT"
        ) {
            toggleAdmin();
        }

        return;
    }


    /*
       SPACE = ガチャ
    */

    if (
        event.code === "Space" &&
        !event.repeat
    ) {

        /*
           入力欄を操作中なら無視
        */

        const tag =
            document.activeElement?.tagName;

        if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT"
        ) {
            return;
        }

        /*
           ページスクロール防止
        */

        event.preventDefault();

        /*
           管理者画面が開いていたら
           スペースではガチャを引かない
        */

        if (
            adminPanel.classList.contains("open")
        ) {
            return;
        }

        /*
           ガチャ実行
        */

        startGacha();
    }

});


document.getElementById("adminClose")
    .addEventListener("click", toggleAdmin);


/* =========================================
   QUICK ROLL BUTTONS
========================================= */

document.querySelectorAll(".quick-rolls button")
    .forEach(button => {

        button.addEventListener("click", () => {

            rollCount =
                Number(button.dataset.roll);

            document.getElementById(
                "adminRollCount"
            ).value = rollCount;

            updateRollDisplay();

        });

    });


document.getElementById("adminRollCount")
    .addEventListener("input", event => {

        let value =
            Number(event.target.value);

        if (!Number.isFinite(value) || value < 1) {
            value = 1;
        }

        if (value > 9999) {
            value = 9999;
        }

        rollCount =
            Math.floor(value);

        event.target.value =
            rollCount;

        updateRollDisplay();

    });


/* =========================================
   RARITY INPUT
========================================= */

const rateInputs = {

    R: document.getElementById("rateR"),

    SR: document.getElementById("rateSR"),

    SSR: document.getElementById("rateSSR"),

    XR: document.getElementById("rateXR")

};


const totalDisplay =
    document.getElementById("totalDisplay");


function checkTotal() {

    const total =
        Number(rateInputs.R.value || 0) +
        Number(rateInputs.SR.value || 0) +
        Number(rateInputs.SSR.value || 0) +
        Number(rateInputs.XR.value || 0);

    totalDisplay.textContent =
        `TOTAL : ${total.toFixed(4)}%`;

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


Object.values(rateInputs)
    .forEach(input => {

        input.addEventListener(
            "input",
            checkTotal
        );

    });


/* =========================================
   FORCE RARITY
========================================= */

document.querySelectorAll("[data-force]")
    .forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(
                "[data-force]"
            ).forEach(b =>
                b.classList.remove("active")
            );

            button.classList.add("active");

            forceRarity =
                button.dataset.force;

            document.getElementById(
                "forceStatus"
            ).textContent =
                `MODE : ${forceRarity}`;

        });

    });


/* =========================================
   APPLY CONFIGURATION
========================================= */

document.getElementById("applyButton")
    .addEventListener("click", () => {

        if (!checkTotal()) {

            alert(
                "確率の合計を100%にしてください。"
            );

            return;

        }

        rates.R =
            Number(rateInputs.R.value);

        rates.SR =
            Number(rateInputs.SR.value);

        rates.SSR =
            Number(rateInputs.SSR.value);

        rates.XR =
            Number(rateInputs.XR.value);

        updateProbabilityDisplay();

        adminPanel.classList.remove(
            "open"
        );

    });


/* =========================================
   RESET
========================================= */

document.getElementById("resetButton")
    .addEventListener("click", () => {

        rates = {
            ...DEFAULT_RATES
        };

        rateInputs.R.value =
            rates.R;

        rateInputs.SR.value =
            rates.SR;

        rateInputs.SSR.value =
            rates.SSR;

        rateInputs.XR.value =
            rates.XR;

        forceRarity =
            "RANDOM";

        document.querySelectorAll(
            "[data-force]"
        ).forEach(b =>
            b.classList.remove("active")
        );

        document
            .querySelector(
                '[data-force="RANDOM"]'
            )
            .classList.add("active");

        document.getElementById(
            "forceStatus"
        ).textContent =
            "MODE : RANDOM";

        checkTotal();

        updateProbabilityDisplay();

    });


/* =========================================
   PROBABILITY DISPLAY
========================================= */

function updateProbabilityDisplay() {

    document.getElementById("rRate")
        .textContent =
        `${rates.R}%`;

    document.getElementById("srRate")
        .textContent =
        `${rates.SR}%`;

    document.getElementById("ssrRate")
        .textContent =
        `${rates.SSR}%`;

    document.getElementById("xrRate")
        .textContent =
        `${rates.XR}%`;

}


/* =========================================
   RANDOM RARITY
========================================= */

function getRandomRarity() {

    if (forceRarity !== "RANDOM") {
        return forceRarity;
    }

    const random =
        Math.random() * 100;

    /*
       XR
    */

    if (
        random <
        rates.XR
    ) {
        return "XR";
    }

    /*
       SSR
    */

    if (
        random <
        rates.XR +
        rates.SSR
    ) {
        return "SSR";
    }

    /*
       SR
    */

    if (
        random <
        rates.XR +
        rates.SSR +
        rates.SR
    ) {
        return "SR";
    }

    /*
       R
    */

    return "R";

}


/* =========================================
   SINGLE ROLL
========================================= */

function rollOnce() {

    return new Promise(resolve => {

        const rarity =
            getRandomRarity();

        /*
           rolling クラスを追加
        */

        gachaBox.classList.add(
            "rolling"
        );

        /*
           CSSにrollingアニメーションが
           無い場合でも動作するように
           少し揺らす
        */

        gachaBox.animate(
            [
                {
                    transform:
                        "translateX(0) rotate(0)"
                },
                {
                    transform:
                        "translateX(-8px) rotate(-3deg)"
                },
                {
                    transform:
                        "translateX(8px) rotate(3deg)"
                },
                {
                    transform:
                        "translateX(-5px) rotate(-2deg)"
                },
                {
                    transform:
                        "translateX(0) rotate(0)"
                }
            ],
            {
                duration: 850,
                easing: "ease-in-out"
            }
        );

        setTimeout(() => {

            gachaBox.classList.remove(
                "rolling"
            );

            resolve(rarity);

        }, 850);

    });

}


/* =========================================
   START GACHA
========================================= */

async function startGacha() {

    if (rolling) return;

    rolling = true;

    rollButton.disabled = true;

    resultArea.classList.add(
        "hidden"
    );

    const results = [];

    /*
       連続ガチャ
    */

    for (
        let i = 0;
        i < rollCount;
        i++
    ) {

        const rarity =
            await rollOnce();

        results.push(rarity);

        addHistory(rarity);

        /*
           XR
        */

        if (rarity === "XR") {

            await showXROverlay();

        }

        /*
           SSR
        */

        else if (
            rarity === "SSR"
        ) {

            await showSSROverlay();

        }

    }

    /*
       最終結果
    */

    showFinalResult(
        results
    );

    rolling = false;

    rollButton.disabled = false;

}


/* =========================================
   BUTTON CLICK
========================================= */

rollButton.addEventListener(
    "click",
    startGacha
);


/* =========================================
   FINAL RESULT
========================================= */

function showFinalResult(results) {

    let best = "R";

    if (
        results.includes("XR")
    ) {

        best = "XR";

    }

    else if (
        results.includes("SSR")
    ) {

        best = "SSR";

    }

    else if (
        results.includes("SR")
    ) {

        best = "SR";

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
        document.createElement("div");

    item.className =
        "history-item";

    item.textContent =
        rarity;

    historyList.prepend(
        item
    );

    /*
       レアリティごとの表示
    */

    item.dataset.rarity =
        rarity;

    /*
       最大100件
    */

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
   XR OVERLAY
========================================= */

function showXROverlay() {

    return new Promise(resolve => {

        xrOverlay.classList.add(
            "active"
        );

        /*
           画面を揺らす
        */

        document.body.animate(
            [
                {
                    transform:
                        "translate(0,0)"
                },
                {
                    transform:
                        "translate(-5px,3px)"
                },
                {
                    transform:
                        "translate(5px,-3px)"
                },
                {
                    transform:
                        "translate(0,0)"
                }
            ],
            {
                duration: 450,
                iterations: 3
            }
        );

        document.getElementById(
            "xrCloseButton"
        ).onclick = () => {

            xrOverlay.classList.remove(
                "active"
            );

            resolve();

        };

    });

}


/* =========================================
   SSR OVERLAY
========================================= */

function showSSROverlay() {

    return new Promise(resolve => {

        ssrOverlay.classList.add(
            "active"
        );

        document.getElementById(
            "ssrCloseButton"
        ).onclick = () => {

            ssrOverlay.classList.remove(
                "active"
            );

            resolve();

        };

    });

}


/* =========================================
   INITIALIZE
========================================= */

updateRollDisplay();

updateProbabilityDisplay();

checkTotal();
```
