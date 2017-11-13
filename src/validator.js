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
			},
			message: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				fields: null,
				inputValue: this.value,
				validators: [],
				validatorGroup: null,
				showMessage: false
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.initFields();

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
				if (event)
					this.setValue(event);

				this.showMessage = true;
			},
			changeField(event) {
				if (event)
				{
					if (this.isCheckbox)
						this.showMessage = true;
					this.setValue(event);
				}
			},
			setValue(event) {
				this.inputValue = event.target.value;
			}
		},
		computed: {
			isValid() {
				return this.validators.filter(validator => {
					return validator.isValid(this.inputValue);
				}).length === this.validators.length;
			},
			validationMessage() {
				if (!this.showMessage)
					return this.message;

				let msg = '';
				this.validators.forEach(validator => {
					if (!validator.isValid(this.inputValue) && !msg)
						msg = validator.getMessage();
				});

				return msg;
			},
			isCheckbox() {
				return this.type == 'checkbox';
			},
			inputAttrs() {
				return Object.assign(this.$attrs, this.$props);
			}
		}
	}
}