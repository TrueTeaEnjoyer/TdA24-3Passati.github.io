using Microsoft.AspNetCore.Mvc;
public class MyDataModel
{
    public string Secret { get; set; }
}


[Route("api/[controller]")]
[ApiController]
public class MyApiController : ControllerBase
{
    [HttpGet]
    public ActionResult<MyDataModel> Get()
    {
        var data = new MyDataModel
        {
            Secret = "The cake is a lie"
        };
        return Ok(data);
    }
}
