define("MspProfileDataPage", [], function() {
	return {
		entitySchemaName: "MspProfileData",
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"MspCustomProfileDetaile80374fe": {
				"schemaName": "MspCustomProfileDetail",
				"entitySchemaName": "MspCustomProfile",
				"filter": {
					"detailColumn": "MspProfileData",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "SettingsTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.SettingsTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "MspCustomProfileDetaile80374fe",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "SettingsTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "remove",
				"name": "ESNTab"
			},
			{
				"operation": "remove",
				"name": "ESNFeedContainer"
			},
			{
				"operation": "remove",
				"name": "ESNFeed"
			}
		]/**SCHEMA_DIFF*/
	};
});
