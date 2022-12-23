define("MspCustomProfilePage", ["BusinessRuleModule"], function(BusinessRuleModule) {
	return {
		entitySchemaName: "MspCustomProfile",
		attributes: {},
		mixins: {},
		messages: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[],/**SCHEMA_DIFF*/
		rules: {
			"MspValue": {
			    "MspValueEnable": {
			        ruleType: BusinessRuleModule.enums.RuleType.BINDPARAMETER,
			        property: BusinessRuleModule.enums.Property.ENABLED,
			        conditions: [{
			            leftExpression: {
				            type: BusinessRuleModule.enums.ValueType.CONSTANT,
				            value: false
			            },
			            comparisonType: this.Terrasoft.ComparisonType.EQUAL,
			            rightExpression: {
			                type: BusinessRuleModule.enums.ValueType.CONSTANT,
			                value: true
			            }
			        }]
			    }
			}
		}
	};
});
