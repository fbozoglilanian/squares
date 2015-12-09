$(function() {

    $("#roomNameForm").submit(function(e){
        $(location).attr('href', '/' + $("#roomName").val());
        return false;
    })
});
