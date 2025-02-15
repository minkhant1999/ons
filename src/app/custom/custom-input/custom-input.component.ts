import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss']
})
export class CustomInputComponent implements OnInit {
  @Input() placeholder: string = ''
  @Input() type: string = ''
  @Input() label: string = ''
  @Input() hideTypeAttribute: boolean = false
  @Input() errorMessage: string = ''
  @Output() blur: EventEmitter<void> = new EventEmitter<void>()

  disabled!: boolean
  onChange: (value: any) => void = () => { }
  onTouched: () => void = () => { }

  constructor(@Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this
  }

  ngOnInit(): void {
    const control = this.controlDir.control
    const validators = control?.validator
      ? [control.validator, Validators.required]
      : Validators.required
    control?.setValidators(validators)
  }

  writeValue(value: any): void {
    value && this.controlDir.control?.setValue(value, { emitEvent: false })
  }

  registerOnChange(onChange: (value: any) => void): void {
    this.onChange = onChange
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled
  }
}
