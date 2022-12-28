define("BaseGridDetailV2", [
    "MspLocalizableHelperResources",
    "RightUtilities",
], function (resources, RightUtilities) {
    return {
        mixins: {},
        details: /**SCHEMA_DETAILS*/ {} /**SCHEMA_DETAILS*/,
        attributes: {
            MspProfileDataId: {
                dataValueType: Terrasoft.DataValueType.TEXT,
                type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
            },

            SavedCustomGridProfile: {
                dataValueType: Terrasoft.DataValueType.COLLECTION,
                type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
            },

            ProfileCollection: {
                dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT,
                type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
            },
            AvtCanManageAdvancedGridSettings: {
                dataValueType: Terrasoft.DataValueType.BOOLEAN,
                type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
            },
            TextUrlMem: {
                dataValueType: Terrasoft.DataValueType.LONG_TEXT,
                type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
            },
            DefaultProfileKey:{
                dataValueType: Terrasoft.DataValueType.TEXT,
                type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
            },
            GridSettingsMenuItemIsVisible: {
                dataValueType: Terrasoft.DataValueType.BOOLEAN,
                type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                value: true
            }
        },
        messages: {},
        modules: /**SCHEMA_MODULES*/ {} /**SCHEMA_MODULES*/,
        diff: /**SCHEMA_DIFF*/ [] /**SCHEMA_DIFF*/,
        methods: {
            init: function (callback, scope) {
                const parentMethod = this.getParentMethod();
                var parentArguments = arguments;
                this.checkAdminRight();
                this.getCustomProfileRecord(function () {
                    parentMethod.call(this, callback, scope);
                }, this);
                this.set("DefaultProfileKey", this.getProfileKey());
            },

            checkAdminRight: function () {
                RightUtilities.checkCanExecuteOperation(
                    {
                        operation: "AvtCanManageAdvancedGridSettings",
                    },
                    function (result) {
                        this.set("AvtCanManageAdvancedGridSettings", result);
                    },
                    this
                );
            },

            getCustomProfileRecord: function (callback, scope) {
                var profile = this.$Profile;
                if (profile && profile.key) {
                    var request = {
                        serviceName: "MspGridService",
                        methodName: "GetCustomProfiles",
                        data: {
                            key: profile.key,
                        },
                    };
                    this.callService(
                        request,
                        function (result) {
                            if (result && result.GetCustomProfilesResult) {
                                var profileResult =
                                    result.GetCustomProfilesResult;
                                this.$MspProfileDataId =
                                    profileResult.profileId;
                                this.$ProfileCollection =
                                    profileResult.profileItems;
                                if (
                                    this.$ProfileCollection &&
                                    this.$ProfileCollection.length > 0
                                ) {
                                    var def = {
                                        caption: "Default",
                                        tag: this.getProfileKey()
                                    };
                                    this.$ProfileCollection.push(def);
                                }
                            }
                            if (callback) callback.call(scope);
                        },
                        scope
                    );
                } else if (callback) callback.call(scope);
            },

            _initSavedProfile: function () {
                var savedProfile = this.get("SavedCustomGridProfile");
                if (!savedProfile) {
                    this.set(
                        "SavedCustomGridProfile",
                        Ext.create("Terrasoft.BaseViewModelCollection")
                    );
                }
            },

            switchProfileButtonConfig: function (config) {
                return {
                    Caption: config.caption,
                    Tag: config.tag,
                    Click: { bindTo: "switchProfileData" },
                };
            },

            initSavedProfileItems: function () {
                this._initSavedProfile();
                var savedProfile = this.get("SavedCustomGridProfile");
                savedProfile.clear();
                Terrasoft.each(
                    this.$ProfileCollection,
                    function (profile) {
                        savedProfile.addItem(
                            this.getButtonMenuItem(
                                this.switchProfileButtonConfig(profile)
                            )
                        );
                    },
                    this
                );
            },

            getCustomProfileMenuItem: function () {
                return this.getButtonMenuItem({
                    Caption: {
                        bindTo: "Resources.Strings.SetupProGridMenuCaption",
                    },
                    Click: { bindTo: "onCustomGridSettingsClick" },
                    ImageConfig: this.get(
                        "Resources.Images.GridSettingsProIcon"
                    ),
                    Visible: { bindTo: "AvtCanManageAdvancedGridSettings" },
                });
            },

            getGridSettingsMenuItem: function() {
				return this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.SetupGridMenuCaption"},
					Click: {"bindTo": "openGridSettings"},
					"ImageConfig": this.get("Resources.Images.GridSettingsIcon"),
                    Visible: {"bindTo": "GridSettingsMenuItemIsVisible"}
				});
			},

            getSwitchProfileMenuItem: function () {
                return this.getButtonMenuItem({
                    Caption: {
                        bindTo: "Resources.Strings.SwitchProGridMenuCaption",
                    },
                    Items: this.get("SavedCustomGridProfile"),
                    ImageConfig: this.get(
                        "Resources.Images.SwitchGridSettingsProIcon"
                    ),
                    Visible: {
                        bindTo: "ProfileCollection",
                        bindConfig: {
                            converter: function (value) {
                                return (
                                    this.$ProfileCollection &&
                                    this.$ProfileCollection.length > 0
                                );
                            },
                        },
                    },
                });
            },

            addGridOperationsMenuItems: function (toolsButtonMenu) {
                this.callParent(arguments);
                this.initSavedProfileItems();
                toolsButtonMenu.addItem(this.getButtonMenuSeparator());
                toolsButtonMenu.addItem(this.getSwitchProfileMenuItem());
                toolsButtonMenu.addItem(this.getCustomProfileMenuItem());
            },

            getNewProfileData: function (profileKey, callback, scope) {
                this.Terrasoft.require(
                    ["profile!" + "MspCustomProfile_" + profileKey],
                    callback,
                    scope
                );
            },

            getStandartProfileData: function (profileKey, callback, scope) {
                this.Terrasoft.require(
                    ["profile!" + profileKey],
                    callback,
                    scope
                );
            },

            _clearProfileCache: function (profileKey) {
                var cache = Terrasoft.ClientPageSessionCache;
                if (cache) {
                    var cacheKeys = Terrasoft.keys(cache.storage);
                    Terrasoft.each(cacheKeys, function (key) {
                        if (key.indexOf(profileKey) !== -1) {
                            cache.removeItem(key);
                        }
                    });
                }
            },

            setCustomColumnsProfile: function (viewColumnsSettingsProfile) {
                var profile = this.get("Profile");
                var gridName = this.getDataGridName();
                if (profile[gridName]) {
                    var profileKey = profile[gridName].key;

                    viewColumnsSettingsProfile.key = profile.key;
                    viewColumnsSettingsProfile[gridName].key = profile.key;
                    viewColumnsSettingsProfile.isCollapsed =
                        profile.isCollapsed;
                    Terrasoft.utils.saveUserProfile(
                        profileKey,
                        viewColumnsSettingsProfile,
                        false
                    );
                }
                this.set("Profile", viewColumnsSettingsProfile);
            },

            switchProfileData: function (tag) {
                if (tag === this.$DefaultProfileKey) {
                    this.getStandartProfileData(tag, this.setProfile, this);
                    this.set("GridSettingsMenuItemIsVisible", true); 
                } else {
                    this.getNewProfileData(tag, this.setProfile, this);
                    this.set("GridSettingsMenuItemIsVisible", false); 
                }
            },

            setProfile: function (newProfile) {
                if (newProfile) {
                    var gridData = this.getGridData();
                    gridData.clear();
                    this.set("GridSettingsChanged", true);
                    this.updateDetail({detail: "OpportunityContacts", reloadAll: true, profile: newProfile});
                }
            },

            updateDetail: function(config) {
				this.callParent(arguments);
				const detailInfo = this.getDetailInfo();
				this.set("IsEnabled", detailInfo.isEnabled);
				if (config.reloadAll) {
					this.set("ActiveRow", null);
					this.set("SelectedRows", []);
                    if (config.profile){
                        this.set("Profile", config.profile);
                        this.set("ProfileKey", config.profile.key);
                        this.set("IsGridLoading", false);
                    }
                    else{
                        this.set("ProfileKey", detailInfo.profileKey);
                    }
					this.initRelationshipButton(this.loadGridData);
                }
			},

            getCustomGridSettingsValues: function () {
                var profile = this.$Profile;
                var defaultValues = [
                    {
                        name: ["MspSchemaName"],
                        value: [this.entitySchemaName],
                    },
                ];
                if (profile) {
                    const name = Terrasoft.getFormattedString(
                        resources.localizableStrings.GridDetailName,
                        this.$Caption
                    );
                    defaultValues.push(
                        {
                            name: ["MspName"],
                            value: [name],
                        },
                        {
                            name: ["MspKey"],
                            value: [profile.key],
                        }
                    );
                }
                return defaultValues;
            },

            onCustomGridSettingsClick: function () {
                var isEditMode =
                    this.$MspProfileDataId !== this.Terrasoft.GUID_EMPTY;
                var config = {
                    schemaName: "MspProfileDataPage",
                    operation: isEditMode
                        ? this.Terrasoft.ConfigurationEnums.CardOperation.EDIT
                        : this.Terrasoft.ConfigurationEnums.CardOperation.ADD,
                    moduleId: this.sandbox.id + "MspProfileDataPage",
                    renderTo: "centerPanel",
                };
                if (isEditMode) {
                    config.id = this.$MspProfileDataId;
                } else {
                    config.defaultValues = this.getCustomGridSettingsValues();
                }
                this.openCardInChain(config);
            }
        },
        rules: {},
    };
});
