import { Component, OnInit, ViewChild } from '@angular/core';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css']
})
export class GeneratorComponent implements OnInit {
  // To store things to display on canvas.
  topText:string = "This is the top text";
  bottomText:string = "This is the bottom text";
  imageName:string = "Shablo Fescobar";
  textColor:string = "#000000";
  bgColor:string = "#ffffff";
  
  // To handle uploaded files.
  fileEvent:string = "";
  upload:boolean = false;

  // Available templates.
  images:string[] = [
    "Shablo Fescobar",
    "Chudal win",
    "Chudal loss",
    "Sus Poply",
    "FuggBoi TP",
    "Potato Nose",
    "Messed Up",
    "Poon-al",
    "Saladchips"
  ];

  // HashMap that maps template_name -> template_path.
  nameToImageMap:Map<string,string> = new Map([
    ["Shablo Fescobar", "shablo.jpeg"],
    ["Chudal win", "kunal_win.png"],
    ["Chudal loss", "kunal_loss.png"],
    ["Sus Poply", "sus_poply.jpeg"],
    ["FuggBoi TP", "fugboi.jpeg"],
    ["Potato Nose", "potato_nose.jpeg"],
    ["Messed Up", "messed_up.jpeg"],
    ["Poon-al","poon.jpeg"],
    ["Saladchips","salt_reserve.jpeg"]
  ]);

  @ViewChild("memeCanvas", { static: false }) myCanvas: any;

  ngOnInit() {
    this.drawText();
    this.draw(this.upload, null);
  }

  // Function the draw text onto the canvas.
  drawText() {
    let canvas = this.myCanvas.nativeElement;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill the canvas with the background color.
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(this.upload) {
      this.draw(true, this.fileEvent);
    }
    else {
      this.draw(false, null);
    }

    let x:number = canvas.width / 2;
    let maxWidth:number = 620;
    let lineHeight:number = 30;

    ctx.fillStyle = this.textColor;
    ctx.font = "30px Calibri";
    ctx.textAlign = "center";

    this.wrapText(ctx, x, maxWidth, lineHeight, 0);
    this.wrapText(ctx, x, maxWidth, lineHeight, 1);
  }

  // Function to get lines to wrap text.
  wrapText(ctx:any, x:number, maxWidth:number, lineHeight:number, level:number) {
    var words = level === 0 ? this.topText.split(' ') : this.bottomText.split(' ');
    let y = level === 0 ? 50 : 700;
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  canvasTextColor($event:ColorEvent) {
    this.textColor = $event.color.hex;
    this.drawText();
  }
  canvasBgColor($event:ColorEvent) {
    this.bgColor = $event.color.hex;
    this.drawText();
  }

  downloadImage() {
    let canvas = this.myCanvas.nativeElement;
    let image = canvas.toDataURL("image/png");
    
    let link = document.createElement('a');
    link.download = this.imageName + '.png';
    link.href = image;
    link.click();
  }

  draw(upload:boolean, event:any) {
    let canvas = this.myCanvas.nativeElement;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();

    if(!upload || !event) {
      this.upload = false;
      var imageFile = this.nameToImageMap.get(this.imageName);
      var filePath:string = "../assets/images/" + imageFile;

      img.src = filePath;
      img.onload = function() {
        scaleToFit(this, ctx, canvas);
      }
    }
    else {
      this.upload = true;
      this.fileEvent = event;

      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = function(e) {
        const img = new Image();
        img.src = e.target!.result as string; // ! is the Non-null assertion operator and tells the compiler that e.target is not null.

        img.onload = function () {
          scaleToFit(this, ctx, canvas);
        }
      }
    }

    function scaleToFit(img: any, ctx: any, canvas: any) {
      var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      var x = (canvas.width / 2) - (img.width / 2) * scale;
      var y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y + 80, (img.width * scale), (img.height * scale) - 230);
    }
  }
}
