console.log("SCRIPT START");

const box = document.getElementById("gachaBox");
const result = document.getElementById("resultRarity");

console.log("BOX:", box);
console.log("RESULT:", result);

box.addEventListener("click", function () {

    console.log("BOX CLICKED");

    result.textContent = "R";

    box.classList.add("rolling");

    setTimeout(function () {
        box.classList.remove("rolling");
    }, 750);

});
