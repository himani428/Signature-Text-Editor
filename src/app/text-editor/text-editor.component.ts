import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ColorSketchModule } from 'ngx-color/sketch';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.css'
})
export class TextEditorComponent {
  textColor: string = '#000000';
  bgColor: string = '#ffffff';
  textSize: number = 14;
  textContent: string = '';

  changeTextColor() {
    // No need for specific handling, two-way data binding will take care of it
  }

  changeBgColor() {
    // No need for specific handling, two-way data binding will take care of it
  }

  changeTextSize() {
    // No need for specific handling, two-way data binding will take care of it
  }

  changeText() {
    // No need for specific handling, two-way data binding will take care of it
  }

  clearText() {
    this.textContent = '';
  }

  saveText() {
    const blob = new Blob([this.textContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'text-content.txt';
    link.click();
  }

  reviewText() {
    alert(this.textContent);
  }
}