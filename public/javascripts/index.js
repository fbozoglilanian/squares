$(function() {

    $("#roomNameForm").submit(function(e){
        $(location).attr('href', '/m/' + $("#roomName").val());
        return false;
    })
});
