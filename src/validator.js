import validators from './validators';

export default (extraValidators = {}) => {

	for (var attrname in extraValidators)
		validators[attrname] = extraValidators[attrname];

	return {
		props: {
			value: {
				default: ''
			},
			name: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: ''
			},
			message: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				inputValue: this.value,
				validators: [],
				validatorGroup: null,
				showMessage: false
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.validatorGroup = this.findValidatorGroup(this);

				this.loadValidators();

				if (this.validatorGroup)
					this.validatorGroup.addValidator(this);
			})
		},
		methods: {
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
			blurField(event) {
				this.setValue(event);
				this.showMessage = true;
			},
			changeField(event) {
				this.setValue(event);
			},
			setValue(event) {
				if (event && event.target)
					this.inputValue = event.target.value;
			}
		},
		computed: {
			realValue() {
				return this.inputValue;
			},
			isValid() {
				return this.validators.filter(validator => {
					return validator.isValid(this.realValue);
				}).length === this.validators.length;
			},
			validationMessage() {
				if (!this.showMessage)
					return this.message;

				let msg = '';
				this.validators.forEach(validator => {
					if (!validator.isValid(this.realValue) && !msg)
						msg = validator.getMessage();
				});

				return msg;
			},
			isCheckbox() {
				return this.type == 'checkbox';
			},
			inputAttrs() {
				return this.$props;
			},
			validationEvents() {
				return {
					blur: this.blurField,
					change: this.changeField,
					input: this.changeField
				}
			}
		}
	}
}