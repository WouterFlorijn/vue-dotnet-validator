import validators from './validators';

module.exports = (extraValidators = {}) => {
  // Add extraValidators to the default validators.
  for (var attrname in extraValidators) { validators[attrname] = extraValidators[attrname]; }

  return {
    props: {
      // Value is the value that will be validated
      value: {
        default: ''
      },
      // This parameter can be used to provide additional complex validation from your app
      extraErrorMessage: {
        default: ''
      }
    },
    data() {
      return {
        validators: [],
        blurred: false,
        inputValue: this.value,
        hasChanged: false,
        name: '',
        field: null,
        validatorGroup: null
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.field = this.resolveField(this);

        if(!this.field) {
            console.error('Field is missing!', this);
            return;
        }

        this.name = this.field.name;

        this.findValidatorGroup(this);
        this.findValidators();

        if(this.$refs.message.innerText) {
          // When we already have innerText, it means the server has output a validation error.
          // We need to replace that validation message as soon as the user changes the value of the input
          this.blurred = true;
        }

        // Make sure we update the validation message as soon as it changes.
        this.$watch('validationMessage', this.showValidationMessage);

        if(!this.isCheckbox) {
          this.field.addEventListener('blur', this.blurField);
        }
        this.field.addEventListener('change', this.changeField);
        this.field.addEventListener('input', this.changeField);

        if (this.validatorGroup)
          this.validatorGroup.addValidator(this);
      });
    },
    destroyed() {
      this.$nextTick(() => {
        if (this.validatorGroup)
          this.validatorGroup.removeValidator(this);
      });
    },
    methods: {
      resolveField(component) {
          if(!component) {
            return null;
          }

          if(component.$refs.field) {
            return component.$refs.field;
          }

          if(component.$children.length > 0) {
            return component.$children.map(child => this.resolveField(child)).filter(result => !!result)[0];
          }

          return null;
      },
      blurField(event) {
        if(event) {
          this.inputValue = event.target.value;
        }
        this.blurred = true;
        this.$emit('blur-field', this);
        this.showValidationMessage();
      },
      changeField(event) {
        if(event) {
          if(this.isCheckbox) {
            this.blurred = true; // We are not using blur-event on checkbox, so lets force blurred here.
            this.inputValue = event.target.checked ? event.target.value : '';
          } else {
            this.inputValue = event.target.value;
          }
        }
        this.hasChanged = true;
        this.$emit('change-field', this);
        this.showValidationMessage();
      },
      // Initializes custom validators by looking at the attributes in the DOM.
      findValidators() {
        let dataAttributes = this.field.dataset;
        let validatorKeys = Object.keys(validators);
        validatorKeys.forEach(validatorKey => {
          let validationMessage = dataAttributes['val' + validatorKey];
          if(!validationMessage) {
            // Validator should not be activated
            return;
          }
          this.validators.push(new validators[validatorKey](validationMessage, dataAttributes, this.validatorGroup));
        });
      },
      findValidatorGroup(component) {
        if (!component.$parent)
          return;
        else if (component.$parent.isValidatorGroup)
          this.validatorGroup = component.$parent;
        else
          this.findValidatorGroup(component.$parent);
      },
      showValidationMessage() {
        if(!this.blurred)
          return;
        this.$refs.message.innerHTML = this.validationMessage;
      }
    },
    computed: {
      // Returns the error-message
      validationMessage() {
        let message = '';
        this.validators.forEach(validator => {
          const valid = validator.isValid(this.inputValue);
          if (!valid && !message) {
            message = validator.getMessage();
          }
        });
        if(!message && !this.hasChanged) {
          // User has not done anything yet, if server-side message is present, show that.
          message = this.$refs.message.innerHTML;
        }
        return message || this.extraErrorMessage;
      },
      isCheckbox() {
        return this.field && this.field.type == 'checkbox';
      }
    }
  }
};
