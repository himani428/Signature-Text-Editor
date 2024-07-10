import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas!: ElementRef<HTMLCanvasElement>;

  public textColor: string = '#000000';
  public bgColor: string = '#ffffff';
  public textSize: number = 14;

  private cx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d') as CanvasRenderingContext2D;

    canvasEl.width = 400;
    canvasEl.height = 400;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = this.textColor;

    canvasEl.style.backgroundColor = this.bgColor;

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent<MouseEvent>(canvasEl, 'mousedown')
      .pipe(
        switchMap(() => {
          return fromEvent<MouseEvent>(canvasEl, 'mousemove')
            .pipe(
              takeUntil(fromEvent<MouseEvent>(canvasEl, 'mouseup')),
              takeUntil(fromEvent<MouseEvent>(canvasEl, 'mouseleave')),
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();
    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  changeTextColor() {
    this.cx.strokeStyle = this.textColor;
  }

  changeBgColor() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    canvasEl.style.backgroundColor = this.bgColor;
  }

  changeTextSize() {
    this.cx.lineWidth = this.textSize;
  }

  clearCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }

  saveCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    // Create a temporary canvas to draw the background color and the existing content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasEl.width;
    tempCanvas.height = canvasEl.height;
    const tempCx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;

    // Draw the background color
    tempCx.fillStyle = this.bgColor;
    tempCx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the existing content from the original canvas
    tempCx.drawImage(canvasEl, 0, 0);

    // Save the temporary canvas as an image
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL();
    link.download = 'canvas-image.png';
    link.click();
  }

  reviewCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const img = new Image();
    img.src = canvasEl.toDataURL();
    const w = window.open('');
    if (w) {
      w.document.write(img.outerHTML);
    } else {
      console.error('Failed to open new window.');
    }
  }
}
