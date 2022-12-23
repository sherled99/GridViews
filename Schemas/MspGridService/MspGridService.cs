using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using Terrasoft.Web.Common;
using Terrasoft.Web.Common.ServiceRouting;

namespace Terrasoft.Configuration
{

    [ServiceContract]
    [DefaultServiceRoute]
    [SspServiceRoute]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class MspGridService : BaseService
	{

		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
		public MspProfileDataV2 GetCustomProfiles(string key)
		{
			MspGridHelper helper = new MspGridHelper(UserConnection);
			return helper.GetCustomProfiles(key);
		}

		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
		public void SaveCustomProfiles(MspProfileDataV2 profileData)
		{
			MspGridHelper helper = new MspGridHelper(UserConnection);
			helper.SaveCustomProfiles(profileData);
		}

	}
	
}
