$(document).ready(function () {
    $('#submit').click(function (e) { 
        var data = {
            "user": $('#username').val(),
            "invited": $('#invite').val()
        }
        $.post("/", data,
            function (data, textStatus, jqXHR) {
                var html = data.map((item)=>{
                    return `
                        <tr>
                            <td>${item.user}</td>
                            <td>${item.score}</td>
                        </tr>
                    `
                });
                $('#table').text('');
                $('#table').append(html.join(''));
            }
        );
    });
});