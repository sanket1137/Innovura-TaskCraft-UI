var AppConfig = {
    baseUrl: "https://localhost:44397",
};

$(document).ready(function () {
    //$('#loginForm').on('submit', loginUser);
    

});

function loginUser() {
    var emailid = $('#emailid').val();
    var password = $('#password').val();

    
    var user = {
        userEmailId: emailid,
        password: password
    };

    $.ajax({
        url: AppConfig.baseUrl + '/api/Auth/login',
        method: "POST",
        timeout: 0,
        async: false,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(user),
        success: function (response) {
            if (response.jwtToken && response.refreshToken) {
                localStorage.setItem('jwtToken', response.jwtToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                
                console.log("Login successful!");
                window.location.href = '../home/index';
                setTimeout(function () { document.location.href = "../home/index" }, 500);
                
            } else {
                alert("Invalid username or password.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Login failed:", error);
            alert("Login failed. Please try again.");
        }
    });
}
function registerUser() {
    var UserName = $('#username').val();
    var UserEmailId = $('#emailid').val();
    var Password = $('#password').val();

    var user = {
        userName: UserName,
        userEmailId: UserEmailId,   
        password: Password
    };

    $.ajax({
        url: AppConfig.baseUrl + '/api/Auth/register',
        method: "POST",
        timeout: 0,
        async: false,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(user),
        success: function (response) {
            localStorage.setItem('jwtToken', response.jwtToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            window.location.href = '../home/index';
        },
        error: function (xhr, status, error) {
            if (xhr.status === 401) {
                console.error('Refresh:', error);
                refreshToken();
            } else {
                console.error('Login failed:', error);
            }
        }
    });
}

function refreshToken() {
    var tokenResponse = {
        refreshToken: localStorage.getItem('refreshToken'),
        jwtToken: localStorage.getItem('jwtToken')
    }
    //var refreshToken = localStorage.getItem('refreshToken');
    $.ajax({
        url: AppConfig.baseUrl + '/api/Auth/refreshToken',
        method: "POST",
        timeout: 0,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
            "Content-Type": "application/json"
        },
        data: { tokenResponse },
        success: function (response) { 
            localStorage.setItem('jwtToken', response.jwtToken);
            localStorage.setItem('refreshToken', response.refreshToken);
        },
        error: function (xhr, status, error) {
            window.location.href = '../accounts/login';
        }
    });
}

