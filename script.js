let openTagCounter = 0;
let intendationMultiplier = 4;
let output = [];

let author;
let workoutName;
let description;
let minutes;
let power;

let checkbox;
let customTags;

function getIntendation() {
    return " ".repeat(openTagCounter * intendationMultiplier);
}

function createOpenTag(tag) {
    updateOutput(`<${tag}>\n`);
    openTagCounter++;
}

function createCloseTag(tag) {
    openTagCounter--;
    updateOutput(`</${tag}>\n`);
}

function createFullTag(tag, content) {
    updateOutput(`<${tag}>${content}</${tag}>\n`);
}

function createHalfTag(content) {
    updateOutput(`<${content}/>\n`);
}

function updateOutput(string) {
    output.push(getIntendation() + string);
}

function downloadFile(name, content) {
    const a = document.createElement('a');
    const blob = new Blob([content]);
    const url = URL.createObjectURL(blob);
    a.setAttribute('href', url);
    a.setAttribute('download', name);
    a.click();
    output = [];
}

function reset() {
    author.value = "";
    workoutName.value = "";
    description.value = "";
    checkbox.checked = false;
    customTags.value = "";
    minutes.value = "125";
    power.value = "40";
}

function createWorkoutTags() {
    if (!checkbox.checked && !customTags.value) {
        createHalfTag("tags");
        return;
    }

    createOpenTag("tags");
    
    if (checkbox.checked) {
        createHalfTag(`tag name="${checkbox.name}"`);
    }
    
    if (customTags.value) {
        customTags.value.split(/\s+/).forEach(element => {
            element = element.replace(/#/g, "");
            if (!element.length) {
                return;
            }
            createHalfTag(`tag name="${element}"`);
        });
    }

    createCloseTag("tags");
}

function createOutput() {
    createOpenTag("workout_file");
    createFullTag("author", author.value);
    createFullTag("name", workoutName.value);
    createFullTag("description", description.value);
    createFullTag("sportType", "bike");

    createWorkoutTags();
    
    createOpenTag("workout");
    
    let powerPercentage = power.value / 100;
    for (let i = 0; i < minutes.value; i++) {
        createHalfTag(`IntervalsT Repeat="1" OnDuration="30" OffDuration="31" OnPower="${powerPercentage}" OffPower="${powerPercentage}" pace="0"`);
    }

    createCloseTag("workout");
    createCloseTag("workout_file");
}

function main() {
    author = document.getElementById("author");
    workoutName = document.getElementById("name");
    description = document.getElementById("description");
    minutes = document.getElementById("minutes");
    power = document.getElementById("power");

    checkbox = document.getElementById("recovery-checkbox");
    customTags = document.getElementById("custom-tags");

    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        createOutput();
        downloadFile((workoutName.value || "XPWorkout") + ".zwo", output.join(""));
    });

    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", () => {
        reset();
    });

    document.querySelectorAll("input[type=number]").forEach((element) => {
        element.addEventListener("input", (event) => {
            if (event.data && event.data.includes(".")) {
                element.value = element.value.slice(1);
            }

            if (element.value === "") {
                element.value = "0";
                element.classList.add("error");
            } else if (element.value[0] === "0" && element.value.length > 1) {
                element.value = element.value.slice(1);
                element.classList.remove("error");
            } else if (parseInt(element.value) > parseInt(element.max)) {
                element.value = element.max;
            }
        });
    });

    document.querySelectorAll(".bottom-button").forEach((element) => {
        element.addEventListener("mousedown", () => {
            element.classList.add("active");
        });
        element.addEventListener("mouseup", () => {
            element.classList.remove("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
