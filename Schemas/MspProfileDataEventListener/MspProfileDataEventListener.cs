using Terrasoft.Core.Entities;
using Terrasoft.Core.Entities.Events;
using Terrasoft.Core.Store;

namespace Terrasoft.Configuration
{
	[EntityEventListener(SchemaName = "MspProfileData")]
	public class MspProfileDataEventListener : BaseEntityEventListener
	{
		public override void OnSaved(object sender, EntityAfterEventArgs e)
		{
			base.OnSaved(sender, e);
			Store.Cache[CacheLevel.Application].ExpireGroup("ProfileDataCache");
		}

		public override void OnDeleted(object sender, EntityAfterEventArgs e)
		{
			base.OnDeleted(sender, e);
			Store.Cache[CacheLevel.Application].ExpireGroup("ProfileDataCache");
		}
	}
}
