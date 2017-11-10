import validators from './validators';

export default (extraValidators = {}) => {

	for (var attrname in extraValidators)
		validators[attrname] = extraValidators[attrname];

	return {
		props: {
			value: {
				type: String,
				default: ''
			},
			name: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				fields: null,
				message: null,
				inputValue: this.value,
				validators: [],
				validatorGroup: null,
				showMessage: false
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.initFields();

				this.initMessage();

				this.validatorGroup = this.findValidatorGroup(this);

				this.loadValidators();

				if (this.validatorGroup)
					this.validatorGroup.addValidator(this);
			})
		},
		methods: {
			findFields(component) {
				if (!component)
					return null;
				if (component.$refs.field)
				{
					if (Array.isArray(component.$refs.field))
						return component.$refs.field;
					else
						return [component.$refs.field];
				}
				if (component.$children.length > 0)
					return component.$children.map(child => this.findFields(child)).filter(result => !!result)[0];
				return null;
			},
			initFields() {
				this.fields = this.findFields(this);

				this.fields.forEach(field => {
					if (!this.isCheckbox)
						field.addEventListener('blur', this.blurField);
					field.addEventListener('change', this.changeField);
					field.addEventListener('input', this.changeField);
				});
			},
			initMessage() {
				this.message = this.$refs.message;
				if (this.message.innerText)
					this.showMessage = true;
			},
			findValidatorGroup(component) {
				if (!component.$parent)
					return;
				else if (component.$parent.isValidatorGroup)
					return component.$parent;
				else
					return this.findValidatorGroup(component.$parent);
			},
			loadValidators() {
				let dataAttributes = this.$el.dataset;
				let validatorKeys = Object.keys(validators);

				validatorKeys.forEach(validatorKey => {
					let msg = dataAttributes['val' + validatorKey];
					if (!msg)
						return;
					this.validators.push(new validators[validatorKey](msg, dataAttributes, this.validatorGroup));
				});
			},
			showValidationMessage() {
				if (this.showMessage)
					this.message.innerHTML = this.validationMessage;
			},
			blurField(event) {
				if (event)
					this.inputValue = event.target.value;

				this.showMessage = true;
				this.$emit('blur-field', this);
				this.showValidationMessage();
			},
			changeField(event) {
				if (event)
				{
					if (this.isCheckbox)
					{
						this.showMessage = true;
						this.inputValue = event.target.checked ? event.target.value : '';
					}
					else
						this.inputValue = event.target.value;
				}
				this.hasChanged = true;
				this.$emit('change-field', this);
				this.showValidationMessage();
			},
		},
		computed: {
			isValid() {
				return this.validators.filter(validator => {
					return validator.isValid(this.inputValue);
				}).length === this.validators.length;
			},
			validationMessage() {
				let msg = '';
				this.validators.forEach(validator => {
					if (!validator.isValid(this.inputValue) && !msg)
						msg = validator.getMessage();
				});

				if (!msg && !this.hasChanged)
					msg = this.message.innerHTML;

				return msg;
			},
			isCheckbox() {
				return this.type == 'checkbox';
			}
		}
	}
}