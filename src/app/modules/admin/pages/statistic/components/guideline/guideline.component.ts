import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-guideline',
  templateUrl: './guideline.component.html',
  styleUrls: ['./guideline.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class GuidelineComponent implements OnInit {
  left: boolean = false;
  right: boolean = true;
  leftFBB: boolean = false;
  rightFBB: boolean = true;
  guidelineImage: string = 'assets/image/guideline_login.png';
  guidelineImageFBB: string = 'assets/image/FBBguideline.png';

  constructor() {}

  ngOnInit(): void {}

  scrollTo() {
    this.left = !this.left;
    this.right = !this.right;
    this.guidelineImage = this.left
      ? 'assets/image/guideline_login1.png'
      : 'assets/image/guideline_login.png';
  }

  scrollToFBB() {
    this.leftFBB = !this.leftFBB;
    this.rightFBB = !this.rightFBB;
    this.guidelineImageFBB = this.leftFBB
      ? 'assets/image/FBBguideline1.png'
      : 'assets/image/FBBguideline.png';
  }
}
