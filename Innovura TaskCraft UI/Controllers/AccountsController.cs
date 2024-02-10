
using InnovuraTaskCraftUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace InnovuraTaskCraftUI.Controllers
{

    public class AccountsController : Controller
    {
        private readonly IConfiguration _configuration;
        public AccountsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Login()
        {
            return View();
        }
        //[AllowAnonymous]
        //[HttpPost("login")]
        //public async Task<IActionResult> Login(User user)
        //{
        //    try
        //    {
        //        string baseURL = _configuration.GetValue<string>("BaseUrl");

        //        var client = new HttpClient();

        //        var userData = new
        //        {
        //            userEmailId = user.UserEmailId,
        //            password = user.Password
        //        };

        //        var request = new HttpRequestMessage(HttpMethod.Post, baseURL + "/api/Auth/Login");
        //        var content = new StringContent(JsonConvert.SerializeObject(userData), Encoding.UTF8, "application/json");
        //        request.Content = content;

        //        var response = await client.SendAsync(request);
        //        response.EnsureSuccessStatusCode();
        //        Console.WriteLine(await response.Content.ReadAsStringAsync());

        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        return BadRequest
        //        ("An error occurred in generating the token");
        //    }
        //    return Unauthorized();

        //}
        public IActionResult Register()
        {
            return View();
        }
    }
}
