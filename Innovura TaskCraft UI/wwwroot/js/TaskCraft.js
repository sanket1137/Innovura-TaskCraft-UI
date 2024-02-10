var AppConfig = {
    baseUrl: "https://localhost:44397",
};
const maxRefreshAttempts = 2; // Set your desired maximum attempts
let refreshAttempts = 0;

var globLabels = {};
$(document).ready(function () {
    var table = $('#example').DataTable({
        lengthChange: false,
        //buttons: ['copy', 'excel', 'pdf', 'colvis']
        buttons: [ 'excel', 'colvis']
    });

    table.buttons().container()
        .appendTo('#example_wrapper .col-md-6:eq(0)');
    getTasks();
    getLabels();
    $('#createAction').on('click', function () {
        // Get the selected value from the dropdown
        var selectedValue = $('#selectedAction').val();

        if (selectedValue === '1') {
            $('#createTask').modal('show');
            
        } else if (selectedValue === '2') {
            $('#createLabel').modal('show');
            
        } else {
            // Handle other cases or show an error message
            alert('Invalid selection');
        }
    });

    //delete Task click
    $(document).on('click', '.deleteTask', function () {
        var taskName = $(this).data('task-name');
        var taskId = $(this).data('task-id');

        $('#deleteTaskTitle').text(taskName);
        $('#deleteTask').text(taskId);
    });

    //Update Task
    $('#UpdateTaskButton').on('click', function () {
        var taskName = $(this).data('task-name');
        var taskId = $(this).data('task-id');
        //$('#updateLabels').val(data.label.labelName);
        var task = {
            Id: taskId,
            taskName: $('#updatetaskName').val(),
            state: $('#updatestate').val(),
            createdDate: $('#updatecreatedDate').val(),
            startedDate: $('#updatestartedDate').val(),
            endDate: $('#updateendDate').val(),
            labelId: $("#updatemyLabels").val()
        };

        if (taskUpdated.taskName !== task.taskName || taskUpdated.state !== task.state || taskUpdated.startedDate !== task.startedDate || taskUpdated.endDate !== task.endDate || taskUpdated.labelName !== task.labelName) {

            // Make AJAX request to create task
            $.ajax({
                url: AppConfig.baseUrl + '/api/taskcraft/taskupdate',
                method: 'PATCH',
                contentType: 'application/json',
                async: false,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
                },
                data: JSON.stringify(task),
                success: function () {

                    $('#updateTaskModal').modal('hide');
                    getTasks()
                },
                error: function (xhr, textStatus, errorThrown) {
                    // Handle error
                    console.error('Failed to create task.', textStatus, errorThrown);
                },
                complete: function () {
                    updateTaskModelClean();
                }
            });
        }

    });

    //create Task click
    $('#createTaskButton').on('click', function () {

        
        var taskData = {
            taskName: $('#taskName').val(),
            state: $('#state').val(),
            /*createdDate: $('#createdDate').val(),*/
            startedDate: $('#startedDate').val(),
            endDate: $('#endDate').val(),
            labelId: $('#cratemyLabels').val()
        };

        // Make AJAX request to create task
        $.ajax({
            url: AppConfig.baseUrl + '/api/taskcraft/taskcreate',
            method: 'POST',
            contentType: 'application/json',
            async: false,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
            },
            data: JSON.stringify(taskData),
            success: function () {

                $('#createTaskModal').modal('hide');
                getTasks();
            },
            error: function (xhr, textStatus, errorThrown) {
                // Handle error
                console.error('Failed to create task.', textStatus, errorThrown);
            },
            complete: function () {
                createTaskModelClean()
            }
        });
    });

    $('#createLabelButton').on('click', function () {

        var input = $('#newLabel').val();
        var timeHours = $('#timeHours').val();
        var labelColor = $('#exampleColorInput').val();
        var label = {
            labelName: input,
            color: labelColor
            //timeSpan: timeHours
        };


        $.ajax({
            url: AppConfig.baseUrl + '/api/taskcraft/createlabel',
            method: 'POST',
            async: false,
            contentType: 'application/json',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
            },
            data: JSON.stringify(label),
            success: function (createdLabel) {
                getLabels();
                createdLabelId = createdLabel;
            },

        });
    });
    $('#confirmDelete').on('click', function () {

        var taskNameToDelete = $('#deleteTaskTitle').text();
        var taskIdToDelete = $('#deleteTask').text();
        //encodeURIComponent(taskIdToDelete)
        $.ajax({
            url: AppConfig.baseUrl + '/api/taskcraft/taskdelete/' + encodeURIComponent(taskIdToDelete),
            method: 'DELETE',
            contentType: 'application/json',
            async: false,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function () {
                console.log('Task ' + taskNameToDelete + ' deleted successfully.');
                $('#deleteModal').find('.modal-body').html('<div class="alert alert-success">Done!</div>');
                $('#deleteModal').modal('hide');

                getTasks();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Failed to delete task ' + taskNameToDelete + '.', textStatus, errorThrown);
            },
            complete: function () {
                $('#deleteModal').modal('hide');
                $('#deleteModal').find('.modal-body').html('Are you sure you want to delete the task with the title: <strong id="deleteTaskTitle"></strong>? <strong id="deleteTask" hidden></strong>');

            }
        });
    });







});
function formatDate(date) {
    // Format date as yyyy-MM-dd
    if (date) {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    }
    return '';
}



function createTaskModelClean() {
    $("#taskName").val("");
    $("#startedDate").val("");
    $("#endDate").val("");
    $("#Labels").val("");
    $("#timeHours").val("");
    $("#exampleColorInput").val("#563d7c");
}

function updateTaskModelClean() {
    $("#updatetaskName").val("");
    $("#updatestate").val("New");
    $("#updatecreatedDate").val("");
    $("#updatestartedDate").val("");
    $("#updateendDate").val("");
    $("#updateLabels").val("");
}
function fillTable(tasks) {
    //var tasks = getTasks();
    var table = $('#example').DataTable();

    table.clear();

    tasks.forEach(function (task) {
        table.row.add([
            task.taskName,
            task.state,
            '<div class="circle" style=" display:inline-block; background-color: ' + task.label.color + '"></div><span style="display:inline-block">' + task.label.labelName +'</span >',
            task.createdDate,
            task.startedDate,
            task.endDate,
            '<button type="button" class="updateTask btn btn-success" data-bs-toggle="modal" data-bs-target="#updateTask" data-task-name="' + task.taskName + '" data-task-id="@task.Id" onclick="updateTask(' + task.id + ')"><i class="fa fa-pencil-square-o"></i></button><button type = "button" class= "deleteTask btn btn-danger" data-target="#deleteModal" data-toggle="modal" data-task-name="' + task.taskName + '" data-task-id="' + task.id +'"> <i class="fa fa-trash-o"></i></button >'
        ]).draw(false);
    })
}


//General Tasks

function getTasks() {
    $.ajax({
        url: AppConfig.baseUrl + '/api/taskcraft/tasks',
        method: 'GET',
        async:false,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (response) {
            console.log(response);
            //return response;
            fillTable(response);
        },
        error: function (xhr, status, error) {
            if (xhr.status === 401 || xhr.status === 0 && refreshAttempts < maxRefreshAttempts) {
                console.warn("Request failed:", error);
                refreshAttempts++; 
                refreshToken(); 
            } else {
                loginRedirect();
            }
            
        }
    });
}

function createTask(taskData) {
    $.ajax({
        url: AppConfig.baseUrl + '/api/taskcraft/tasks',
        method: 'POST',
        data: taskData,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (response) {
        },
        error: function (xhr, status, error) {
            if (xhr.status === 401) {
                refreshToken();
            } else {
                console.error('Task creation failed:', error);
            }
        }
    });
}

function updateTask(id) {
    $.ajax({
        url: AppConfig.baseUrl + '/api/taskcraft/getTask/'+id,
        method: 'GET',
        contentType: 'application/json',
        async: false,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (data) {
            $('#updatetaskName').val(data.taskName);
            $('#updatestate').val(data.state);
            $('#updatecreatedDate').val(formatDate(data.createdDate));
            $('#updatestartedDate').val(formatDate(data.startedDate));
            $('#updateendDate').val(formatDate(data.endDate));

           
            $('#updatemyLabels').val(data.label.id);

            taskUpdated = {
                taskName: data.taskName,
                state: data.state,
                startedDate: data.startedDate,
                endDate: data.endDate,
                labelName: data.label.labelName
            }
            $('#UpdateTaskButton').data('task-id', id);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error('Failed to retrieve tasks.', textStatus, errorThrown);
        }
    });
}
function getLabels() {

        $.ajax({
            url: AppConfig.baseUrl + '/api/taskcraft/labels',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (labels) {
                $('#updatemyLabels').empty();
                $('#cratemyLabels').empty();
                $.each(labels, function (index, label) {
                    $('#updatemyLabels').append('<option class="' + label.id + '" value="' + label.id + '">'+label.labelName+'</option>');
                    $('#cratemyLabels').append('<option class="' + label.id + '" value="' + label.id + '">' + label.labelName +'</option>');
                });

                return labels;
            },
            error: function (xhr, status, error) {
                return error;
            }
        });
  
}

function refreshToken() {
    var tokenResponse={
         refreshToken : localStorage.getItem('refreshToken'),
     jwtToken : localStorage.getItem('jwtToken')
    }
    var settings = {
        "url": "https://localhost:44397/api/Auth/refreshToken",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('jwtToken')
        },
        "data": JSON.stringify({
            "jwtToken": localStorage.getItem('jwtToken'),
            "refreshToken": localStorage.getItem('refreshToken')
        }),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    
    //var refreshToken = localStorage.getItem('refreshToken');
    $.ajax({
        url: AppConfig.baseUrl + '/api/Auth/refreshToken',
        method: "POST",
        timeout: 0,
        async:false,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
        },
        data: JSON.stringify(tokenResponse),
        success: function (response) {
            localStorage.setItem('jwtToken', response.jwtToken);
            localStorage.setItem('refreshToken', response.refreshToken);
        },
        error: function (xhr, status, error) {
            window.location.href = '../accounts/login';
        }
    });
}

function loginRedirect() {
    window.location.href = '../accounts/login';
}