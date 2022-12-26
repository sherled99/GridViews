using Terrasoft.Common;

namespace Terrasoft.Configuration
{
	using Newtonsoft.Json;
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using Terrasoft.Core;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.Store;

	public class MspGridHelper
	{
		private readonly UserConnection _userConnection;

		public MspGridHelper(UserConnection userConnection)
		{
			_userConnection = userConnection;
		}

		private string ParseListedProfile(string profileValue)
		{
			List<string> list = new List<string>();
			MspProfileSettings settings = JsonConvert.DeserializeObject<MspProfileSettings>(profileValue);
			foreach (var item in settings.Items)
			{
				list.Add(item.Caption);
			}
			return String.Join(";", list);
		}

		private string ParseTiledProfile(string profileValue)
		{
			throw new NotImplementedException();
		}

		private Guid GetProfileId(string key)
		{
			Guid profileId = Guid.Empty;
			EntitySchema schema = _userConnection.EntitySchemaManager.GetInstanceByName("MspProfileData");
			EntitySchemaQuery esq = new EntitySchemaQuery(schema) {
				Cache = _userConnection.ApplicationCache.WithLocalCaching("ProfileDataCache"),
				CacheItemName = string.Format("MspProfileKey_{0}", key)
			};
			esq.PrimaryQueryColumn.IsAlwaysSelect = true;
			esq.IgnoreDisplayValues = true;
			esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "MspKey", key));
			EntityCollection entityCollection = esq.GetEntityCollection(_userConnection);
			if (entityCollection.Count > 0)
			{
				profileId = entityCollection[0].PrimaryColumnValue;
			}
			return profileId;
		}

		private List<MspProfileItem> GetProfileItems(Guid profileId)
		{
			List<MspProfileItem> list = new List<MspProfileItem>();
			EntitySchema schema = _userConnection.EntitySchemaManager.GetInstanceByName("MspCustomProfile");
			EntitySchemaQuery esq = new EntitySchemaQuery(schema)
			{
				Cache = _userConnection.ApplicationCache.WithLocalCaching("CustomProfileItemsCache"),
				CacheItemName = string.Format("MspCustomProfile_{0}", profileId)
			};
			esq.PrimaryQueryColumn.IsAlwaysSelect = true;
			esq.IgnoreDisplayValues = true;
			var nameColumn = esq.AddColumn("MspName");
			esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "MspProfileData.Id", profileId));
			esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "MspIsActive", true));
			esq.Filters.Add(esq.CreateIsNotNullFilter("MspValue"));
			EntityCollection entityCollection = esq.GetEntityCollection(_userConnection);
			if (entityCollection.Count > 0)
			{
				foreach (Entity entity in entityCollection)
				{
					list.Add(new MspProfileItem()
					{
						Caption = entity.GetTypedColumnValue<string>(nameColumn.Name),
						Tag = entity.PrimaryColumnValue
					});
				}
			}
			return list;
		}

		/// <summary>
		/// Получение информации о настройках по ключу
		/// </summary>
		/// <param name="key"></param>
		/// <returns></returns>
		public MspProfileDataV2 GetCustomProfiles(string key)
		{
            MspProfileDataV2 profileData = new MspProfileDataV2();
			Guid profileId = GetProfileId(key);
			profileData.ProfileId = profileId;
			if (profileId != Guid.Empty)
			{
				profileData.ProfileItems = GetProfileItems(profileId);
			}
			return profileData;
		}

		/// <summary>
		/// Сохранение настройки колонок
		/// </summary>
		/// <param name="profileData"></param>
		public void SaveCustomProfiles(MspProfileDataV2 profileData)
		{
			string profileValue = (profileData.IsTiled) ? ParseTiledProfile(profileData.ProfileValue) : ParseListedProfile(profileData.ProfileValue);
			EntitySchema profileSchema = _userConnection.EntitySchemaManager.GetInstanceByName("MspCustomProfile");
			var entity = profileSchema.CreateEntity(_userConnection);
			entity.FetchFromDB(profileData.ProfileSettingsId);
			entity.SetColumnValue("MspIsTiled", profileData.IsTiled);
			entity.SetColumnValue("MspValue", profileValue);
			entity.Save(false);
		}

		/// <summary>
		/// Обновлени колонок на стандартные в системе
		/// </summary>
		/// <param name="key"></param>
		public void UpdateDefaultSettings(string key)
		{
			var objectData = GetObjectData(key);
            if (objectData == null)
			{
				if (_userConnection.CurrentUser.ConnectionType.ToString() != "SSP") return;
                objectData = GetObjectData(key.Replace("Portal", String.Empty));
            }

            var update = new Update(_userConnection.AppConnection.SystemUserConnection, nameof(SysProfileData))
                    .Set(("ObjectData"), Column.Parameter(objectData))
                    .Where(nameof(SysProfileData.ContactId)).IsEqual(Column.Const(_userConnection.CurrentUser.ContactId))
					.And(nameof(SysProfileData.Key)).IsEqual(Column.Parameter(key))
					.And(nameof(SysProfileData.SysCultureId)).IsEqual(Column.Const(_userConnection.CurrentUser.SysCultureId)) as Update;
            update.Execute();

        }

		private byte[] GetObjectData(string key)
		{
            var select =
                new Select(_userConnection.AppConnection.SystemUserConnection)
                    .Column("ObjectData")
                    .From(nameof(SysProfileData))
                    .Where(nameof(SysProfileData.Key)).IsEqual(Column.Parameter(key))
					.And(nameof(SysProfileData.ContactId)).IsNull()
                    .And(nameof(SysProfileData.SysCultureId)).IsEqual(Column.Const(_userConnection.CurrentUser.SysCultureId))
                as Select;
            return select.ExecuteScalar<byte[]>();
        }

	}
}
