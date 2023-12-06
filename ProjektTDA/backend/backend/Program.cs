using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class ApiController : ControllerBase
{
    [HttpGet]
    [Route("api")]
    public IActionResult Get()
    {
        var secretMessage = new { message = "secret is hard work" };
        return Ok(secretMessage);
    }
}