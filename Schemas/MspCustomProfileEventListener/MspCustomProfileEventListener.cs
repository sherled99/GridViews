using Terrasoft.Core.Entities;
using Terrasoft.Core.Entities.Events;
using Terrasoft.Core.Store;

namespace Terrasoft.Configuration
{
	[EntityEventListener(SchemaName = "MspCustomProfile")]
	public class MspCustomProfileEventListener : BaseEntityEventListener
	{
		public override void OnSaved(object sender, EntityAfterEventArgs e)
		{
			base.OnSaved(sender, e);
			Store.Cache[CacheLevel.Application].ExpireGroup("CustomProfileItemsCache");
		}

		public override void OnDeleted(object sender, EntityAfterEventArgs e)
		{
			base.OnDeleted(sender, e);
			Store.Cache[CacheLevel.Application].ExpireGroup("CustomProfileItemsCache");
		}
	}
}
