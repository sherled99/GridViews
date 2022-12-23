using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Terrasoft.Configuration
{

	[DataContract]
	public class MspProfileItem
	{
		[DataMember(Name = "caption")]
		public string Caption { get; set; }
		[DataMember(Name = "tag")]
		public Guid Tag { get; set; }
	}

	[DataContract]
	public class MspProfileDataV2
	{
		[DataMember(Name = "caption")]
		public string Caption { get; set; }		
		[DataMember(Name = "profileId")]
		public Guid ProfileId { get; set; }
		[DataMember(Name = "profileSettingsId")]
		public Guid ProfileSettingsId { get; set; }
		[DataMember(Name = "profileItems")]
		public List<MspProfileItem> ProfileItems { get; set; }

		[DataMember(Name = "isTiled")]
		public bool IsTiled { get; set; }

		[DataMember(Name = "profileValue")]
		public string ProfileValue { get; set; }
	}

	[DataContract]
	public class MspProfileSettingsPosition
	{
		[DataMember(Name = "column")]
		public int Column { get; set; }
		[DataMember(Name = "colSpan")]
		public int ColSpan { get; set; }
		[DataMember(Name = "row")]
		public int Row { get; set; }
	}

	[DataContract]
	public class MspProfileSettingsItem
	{
		[DataMember(Name = "column")]
		public int Column { get; set; }
		[DataMember(Name = "caption")]
		public string Caption { get; set; }
		[DataMember(Name = "metaPath")]
		public string MetaPath { get; set; }
		[DataMember(Name = "isTitleText")]
		public bool IsTitleText { get; set; }
		[DataMember(Name = "width")]
		public int Width { get; set; }
		[DataMember(Name = "dataValueType")]
		public int DataValueType { get; set; }
		[DataMember(Name = "bindTo")]
		public string BindTo { get; set; }
		[DataMember(Name = "isBackward")]
		public bool IsBackward { get; set; }
		[DataMember(Name = "position")]
		public MspProfileSettingsPosition Position { get; set; }
		[DataMember(Name = "referenceSchemaName")]
		public string ReferenceSchemaName { get; set; }
	}

	[DataContract]
	public class MspProfileSettings
	{
		[DataMember(Name = "items")]
		public List<MspProfileSettingsItem> Items { get; set; }
	}

}
