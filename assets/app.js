// Add service worker
window.addEventListener("load", () => {
    if ("serviceWorker" in navigator)
        navigator.serviceWorker.register("/service-worker.js");
});

const img_input = document.getElementById("imginput");
const editor = document.getElementById("editor");
const context = editor.getContext("2d");
const scaleInput = document.getElementsByName("scaling");
const txtBgInput = document.getElementById("txtbackground");
const bottomText = document.getElementById("bottomtext");
const topText = document.getElementById("toptext");
const fontSlider = document.getElementById("fontSize");
const pictureSlider = document.getElementById("pictureOffset");

editor.width = editor.height = 3000;
let image = new Image();
let scaleFit = true;
let textBackground = true;
let baseSize = editor.width * 0.06;
let fontSize = baseSize;
let pictureOffset = 50; // picture-offset on Y-Axis in Percentage

let topLines, bottomLines;

context.font = `bold ${fontSize}px Maximum Impact`;
context.fillStyle = "black";
context.textAlign = "center";
context.fillText("Hier könnte ihr Meme stehen", editor.width / 2, editor.height / 2);

/**
 * Renders Top-Bottom text and text-background of meme according to fontsize and line-count
 */
function renderText() {
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = `${fontSize}px Maximum Impact`;

    // draws white text-brackground
    if (doDrawTextBG(topLines)) {
        context.fillStyle = "white";
        context.fillRect(0, 0, editor.width, getTextBGHeightTop());
        context.fillStyle = "black";
    }
    if (doDrawTextBG(bottomLines)) {
        context.fillStyle = "white";
        context.fillRect(0, editor.height - bottomLines.length * fontSize - fontSize * 0.3, editor.width, getTextBGHeightBottom());
        context.fillStyle = "black";
    }

    // draws lines
    for (let i = 0; i < topLines.length; i++) {
        context.strokeText(topLines[i], editor.width / 2, (i+1) * fontSize);
        context.fillText(topLines[i], editor.width / 2, (i+1) * fontSize);
    }
    for (let i = 0; i < bottomLines.length; i++) {
        context.strokeText(bottomLines[i], editor.width / 2, editor.height + (i - bottomLines.length + 0.7) * fontSize);
        context.fillText(bottomLines[i], editor.width / 2, editor.height + (i - bottomLines.length + 0.7) * fontSize);
    }
}

/**
 * Renders only the image and draws a white border around the whole meme
 */
function renderImage() {
    let scale;
    let border = editor.width * 0.01;
    let offset = 0; // offset the picture if its too big
    let w = editor.width - border * 2;
    let h = editor.height - border * 2;

    if (scaleFit) {
        scale = Math.min(w / image.height, h / image.height);
        let x = (w / 2) - (image.width / 2) * scale;
        let y = (h / 2) - (image.height / 2) * scale;

        // offset of picture
        if (image.width * scale > editor.width - border * 2)
            offset = lerp(x, -x, pictureOffset / 100);

        context.drawImage(image, x + border + offset, y + border, image.width * scale, image.height * scale);
    } else {
        scale = Math.min(w / image.width, h);
        let x = (w / 2) - (image.width / 2) * scale;
        let y = (h / 2) - (image.height / 2) * scale;

        // offset of picture
        if (image.height * scale > editor.height - border * 2)
            offset = lerp(y, -y, pictureOffset / 100);

        context.drawImage(image, x + border, y + border + offset, image.width * scale, image.height * scale);
    }

    // Overpaint picture-overhang on edges
    context.fillStyle = "white";
    context.fillRect(0, 0, editor.width, border);//top
    context.fillRect(0, editor.height - border, editor.width, border);//bottom
    context.fillRect(0, 0, border, editor.height);//left
    context.fillRect(editor.width - border, 0, border, editor.height);//right
}

/** repaints the meme */
function update() {

    // Splits topText into lines
    topLines = topText.value.split("\n");
    bottomLines = bottomText.value.split("\n");

    context.fillStyle = "white";
    context.fillRect(0, 0, editor.width, editor.height);
    renderImage()
    renderText()
}

img_input.onchange = () => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        image.src = reader.result;
        image.onload = () => {
            update()
        }
    })

    reader.readAsDataURL(img_input.files[0])
};

fontSlider.oninput = function () {
    fontSize = baseSize * this.value / 100; // lerp Font-Size between 1% and 200% of basesize
    update();
}

pictureSlider.oninput = function () {
    pictureOffset = this.value;
    update();
}

function download() {
    let img = editor.toDataURL();
    let tmpLink = document.createElement("a");
    tmpLink.download = 'meme.png';
    tmpLink.href = img;
    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
}

function changeScaling() {
    scaleFit = scaleInput[0].checked;
    update()
}

function changeTxtBg() {
    textBackground = txtBgInput.checked;
    update()
}

function doDrawTextBG(lines) {
    return textBackground && (lines.length > 1 || !isEmpty(lines[lines.length - 1].toString()));
}

/** @returns pixel-height of text-background Top-Lines */
function getTextBGHeightTop() {
    if (topLines != null)
        return topLines.length * fontSize + fontSize * 0.3;
    return 0;
}

/** @returns pixel-height of text-background of Bottom-Lines */
function getTextBGHeightBottom() {
    if (bottomLines != null)
        return bottomLines.length * fontSize + fontSize * 1.2;
    return 0;
}

function isEmpty(str) {
    return (!str || str.length === 0);
}

/** @returns linear value between a & b accoding to time t (0<=t<=1) */
function lerp(a, b, t) {
    return a + (b - a) * t;
}