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
        let baseSize = editor.width*0.06;
        let fontSize = baseSize;
        let pictureOffset = 50; // picture-offset on Y-Axis in Percentage
        
        context.font = `bold ${fontSize}px Maximum Impact`;
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText("Hier könnte ihr Meme stehen", editor.width / 2, editor.height / 2);
        
        function renderText() {
            context.fillStyle = "white";
            context.textAlign = "center";
            context.font = `${fontSize}px Maximum Impact`;

            // AaÄäÖöÜüYyJjGgQq

            // Splits topText into lines
            let lines = topText.value.split("\n");

            // draws white text-brackground
            if(textBackground && (lines.length > 1 || !isEmpty(lines[lines.length-1].toString()))) {
                context.fillStyle = "white";
                context.fillRect(0,0,editor.width,lines.length * fontSize+fontSize * 0.3);
                context.fillStyle = "black";
            }

            // draws lines
            for(let i=0;i<lines.length;i++){
                context.strokeText(lines[i], editor.width /2, fontSize*1 + i*fontSize);
                context.fillText(lines[i], editor.width /2, fontSize*1 + i*fontSize);
            }


            // Splits bottomText into lines
            lines = bottomText.value.split("\n");

            // draws white text-brackground
            if(textBackground && (lines.length > 1 || !isEmpty(lines[lines.length-1].toString()))) {
                context.fillStyle = "white";
                context.fillRect(0,editor.height - lines.length * fontSize - fontSize*0.3,editor.width,lines.length * fontSize + fontSize*1.2);
                context.fillStyle = "black";
            }

            // draws lines
            for(let i=0;i<lines.length;i++){
                context.strokeText(lines[i], editor.width / 2, editor.height  + (i-lines.length+0.7) * fontSize);
                context.fillText(lines[i], editor.width / 2, editor.height + (i-lines.length+0.7) * fontSize);
            }
        }

        function renderImage() {
            let scale;
            let border = editor.width*0.01;
            let offset;
            let x;
            let y;
            let w = editor.width - border*2;
            let h = editor.height - border*2;
            if(scaleFit){
                scale = Math.min(w / image.height, h / image.height);
                x = (w / 2) - (image.width / 2) * scale;
                y = (h / 2) - (image.height / 2) * scale;

                // offset of picture
                if(image.width > editor.width-border*2)
                    offset = lerp(x,-x,pictureOffset/100);
                else
                    offset = 0;

                context.drawImage(image, x+border+offset, y+border, image.width * scale, image.height * scale);
            }else{
                scale = Math.min(w / image.width, h);
                x = (w / 2) - (image.width / 2) * scale;
                y = (h / 2) - (image.height / 2) * scale;

                // offset of picture
                if(image.height > editor.height-border*2)
                    offset = lerp(y,-y, pictureOffset/100);
                else
                    offset = 0;

                context.drawImage(image, x+border, y+border+offset, image.width * scale, image.height * scale);
            }


            // Overpaint picture-overhang on edges
            context.fillStyle = "white";
            context.fillRect(0,0,editor.width,border);
            context.fillRect(0,editor.height-border,editor.width,border);
            context.fillRect(0,0,border,editor.height);
            context.fillRect(editor.width-border,0,border,editor.height);
        }

        function update() {
            context.fillStyle = "white";
            context.fillRect(0,0, editor.width, editor.height);
            renderImage()
            renderText()
        }

        function changeScaling() {
            scaleFit = scaleInput[0].checked == true;
            update()
        }

        function changeTxtBg(){
            textBackground = txtBgInput.checked;
            update()
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

        fontSlider.oninput = function() {
            fontSize = baseSize * this.value/100; // lerp Font-Size between 1% and 200% of basesize
            update();
        }

        pictureSlider.oninput = function() {
            pictureOffset = this.value;
            update();
        }

        function download() {
            var img = editor.toDataURL();
            var tmpLink = document.createElement("a");
            tmpLink.download = 'meme.png';
            tmpLink.href = img;
            document.body.appendChild(tmpLink);
            tmpLink.click();
            document.body.removeChild(tmpLink);
        }

    function isEmpty(str) {
        return (!str || str.length === 0 );
    }

    function lerp(a, b, t){
        return a + (b-a)*t;
    }