let img_input = document.getElementById("imginput");
        const editor = document.getElementById("editor");
        const context = editor.getContext("2d");
        const scaleInput = document.getElementsByName("scaling");
        const bottomText = document.getElementById("bottomtext");
        const topText = document.getElementById("toptext");
        const slider = document.getElementById("fontSize");
        var image = new Image();
        var scaleFit = true;
        editor.width = editor.height = 3000;
        var baseSize = editor.width*0.05;
        var fontSize = editor.width*0.05;
        
        context.font = `bold ${fontSize}px Maximum Impact`;
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText("Hier könnte ihr Meme stehen", editor.width / 2, editor.height / 2);
        
        function renderText() {
            context.fillStyle = "white";
            context.textAlign = "center";
            context.font = `${fontSize}px Maximum Impact`;

            let lines = topText.value.split("\n");
            for(let i=0;i<lines.length;i++){
                context.strokeText(lines[i], editor.width /2, 10 + fontSize*1 + i*fontSize);
                context.fillText(lines[i], editor.width /2, 10 + fontSize*1 + i*fontSize);
            }

            lines = bottomText.value.split("\n");
            for(let i=0;i<lines.length;i++){
                context.strokeText(lines[i], editor.width / 2, editor.height - 10 - fontSize + (i-lines.length+2) * fontSize);
                context.fillText(lines[i], editor.width / 2, editor.height - 10 - fontSize + (i-lines.length+2) * fontSize);
            }
        }

        function renderImage() {
            var scale;
            var x;
            var y;
            if(scaleFit){
                scale = Math.min(editor.width / image.height, editor.height / image.height);
                x = (editor.width / 2) - (image.width / 2) * scale;
                y = (editor.height / 2) - (image.height / 2) * scale;
            }else{
                scale = Math.min(editor.width / image.width, editor.height);
                x = (editor.width / 2) - (image.width / 2) * scale;
                y = (editor.height / 2) - (image.height / 2) * scale;
            }
            context.drawImage(image,x,y, image.width * scale, image.height * scale);
        }

        function update() {
            context.fillStyle = "white";
            context.fillRect(0,0, editor.width, editor.height);
            renderImage()
            renderText()
        }

        function changeScaling() {
            if(scaleInput[0].checked == true){
                scaleFit = true;
            }else{
                scaleFit = false;
            }
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
            fontSize = baseSize + Number(this.value)*5;
            console.log(fontSize);
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