using System.ComponentModel.DataAnnotations.Schema;

namespace InnovuraTaskCraftUI.Models
{
    public class RefreshToken
    {
        public string TokenId { get; set; }
        public string Refresh_Token { get; set; }
        public bool IsActive { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
