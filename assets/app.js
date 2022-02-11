        const img_input = document.getElementById("imginput");
        const editor = document.getElementById("editor");
        const context = editor.getContext("2d");
        const scaleInput = document.getElementsByName("scaling");
        const txtBgInput = document.getElementById("txtbackground");
        const bottomText = document.getElementById("bottomtext");
        const topText = document.getElementById("toptext");
        const slider = document.getElementById("fontSize");

        let image = new Image();
        let scaleFit = true;
        let textBackground = true;
        let fontSize = 30;

        context.font = fontSize+"px Maximum Impact";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText("Hier könnte ihr Meme stehen", editor.width / 2, editor.height / 2);
        
        function renderText() {
            context.font = fontSize+"px Maximum Impact";
            context.fillStyle = "white";
            context.textAlign = "center";

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
            var scale;
            var border = editor.width*0.01;
            if(scaleFit) {
                scale = Math.min(editor.width / image.height, editor.height / image.height);
            } else {
                scale = Math.min(editor.width / image.width, editor.height);
            }
            context.drawImage(image, border, border, image.width * scale - border*2, image.height * scale - border*2);
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

        slider.oninput = function() {
            fontSize = this.value;
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