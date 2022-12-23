define("MspCustomProfileDetail", ["ConfigurationEnums", "ConfigurationGrid", "ConfigurationGridGenerator",
	"ConfigurationGridUtilities"], function(ConfigurationEnums) {
	return {
		entitySchemaName: "MspCustomProfile",
		attributes: {
			IsEditable: {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: true
			},
			"ProfileSchema": {
				dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			}
		},
		mixins: {
			ConfigurationGridUtilities: "Terrasoft.ConfigurationGridUtilities"
		},
		messages: {
			"GetGridSettingsInfo": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"GridSettingsChanged": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "DataGrid",
				"values": {
					"className": "Terrasoft.ConfigurationGrid",
					"generator": "ConfigurationGridGenerator.generatePartial",
					"generateControlsConfig": {"bindTo": "generateActiveRowControlsConfig"},
					"changeRow": {"bindTo": "changeRow"},
					"unSelectRow": {"bindTo": "unSelectRow"},
					"onGridClick": {"bindTo": "onGridClick"},
					"activeRowActions": [
						{
							"className": "Terrasoft.Button",
							"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "save",
							"markerValue": "save",
							"imageConfig": {"bindTo": "Resources.Images.SaveIcon"}
						},
						{
							"className": "Terrasoft.Button",
							"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "cancel",
							"markerValue": "cancel",
							"imageConfig": {"bindTo": "Resources.Images.CancelIcon"}
						},
						{
							"className": "Terrasoft.Button",
							"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "remove",
							"markerValue": "remove",
							"imageConfig": {"bindTo": "Resources.Images.RemoveIcon"}
						}
					],
					"listedZebra": true,
					"initActiveRowKeyMap": {"bindTo": "initActiveRowKeyMap"},
					"activeRowAction": {"bindTo": "onActiveRowAction"},
					"multiSelect": false,
					"type": "listed",
					"listedConfig": {
						"name": "DataGridListedConfig",
						"items": []
					}
				}
			},
			{
				"operation": "insert",
				"name": "GridSettingsButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"style": Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
					"caption": {"bindTo": "Resources.Strings.GridSettingsButtonCaption"},
					"visible": {"bindTo": "isAnySelected"},
					"click": {"bindTo": "openCustomGrid"},
					"tag": "onApproveButtonClick"
				}
			}
		]/**SCHEMA_DIFF*/,
		methods: {

			getCustomProfileKey: function() {
				return "MspCustomProfile_" + this.$ActiveRow;
			},

			openCustomGrid: function() {
				const columnValues = this.sandbox.publish("GetColumnsValues", ["MspSchemaName"], [this.sandbox.id]);
				if (columnValues && columnValues.MspSchemaName) {
					this.getEntitySchemaByName(columnValues.MspSchemaName, function(entitySchema) {
						this.$ProfileSchema = entitySchema;
						var data = this.getGridData();
						var row = data.get(this.$ActiveRow);
						row.save({
							callback: this.openCustomGridSettings,
							isSilent: true,
							scope: this
						});
					}, this);
				}
			},

			getCustomGridSettingsInfo: function() {
				const entitySchema = this.$ProfileSchema;
				var moduleName = this.sandbox.moduleName;
				var workAreaMode = this.getHistoryStateInfo().workAreaMode;
				var isEditable = this.getIsEditable();
				var isSingleTypeMode =
					((moduleName !== "DetailModuleV2" && workAreaMode === ConfigurationEnums.WorkAreaMode.COMBINED) ||
						isEditable);
				return {
					baseGridType: this.Terrasoft.GridType.LISTED,
					isSingleTypeMode: isSingleTypeMode,
					entitySchemaName: entitySchema.name,
					entitySchema: entitySchema,
					profileKey: this.getCustomProfileKey(),
					propertyName: this.getDataGridName(),
					notFoundColumns: this.notFoundColumns,
					entityColumns: entitySchema.columns
				};
			},

			getGridSettingsModuleConfig: function(gridSettingsId) {
				return {
					renderTo: "centerPanel",
					id: gridSettingsId,
					keepAlive: true,
					instanceConfig: {
						schemaName: "GridSettingsPage",
						isSchemaConfigInitialized: true
					}
				};
			},

			saveProfileSetings: function(profileId, isTiled, profileValue, callback, scope) {
				var request = {
					serviceName: "MspGridService",
					methodName: "SaveCustomProfiles",
					data: {
						profileData: {
							caption: this.$Caption,
							profileSettingsId: profileId,
							isTiled: isTiled,
							profileValue: profileValue
						}
					}
				};
				this.callService(request, callback, scope);
			},

			openCustomGridSettings: function(record) {
				var gridSettingsId = this.sandbox.id + "_CardModuleV2_GridSettingsPage";
				this.sandbox.subscribe("GetGridSettingsInfo", this.getCustomGridSettingsInfo, this, [gridSettingsId]);
				var params = this.sandbox.publish("GetHistoryState");
				this.sandbox.publish("PushHistoryState", {
					hash: params.hash.historyState,
					silent: true
				});
				this.sandbox.loadModule("CardModuleV2", this.getGridSettingsModuleConfig(gridSettingsId));
				this.sandbox.subscribe("GridSettingsChanged", function(args) {
					var rowId = this.$ActiveRow;
					var gridName = this.getDataGridName();
					var profile = args.newProfileData[gridName];
					if (profile) {
						const profileValue = (!!profile.isTiled) ? profile.tiledConfig : profile.listedConfig;
						this.saveProfileSetings(this.$ActiveRow, profile.isTiled, profileValue, function() {
							this.reloadGridData();
						}, this);
					}
				}, this, [gridSettingsId]);
			}

		}
	};
});
