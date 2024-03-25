const clickMe = () => {
    alert("Thanks for clicking me. Wishing you to have a nice day!")
}
$(document).ready(function () {
    $('.materialboxed').materialbox();
    $('#clickMeButton').click(() => {
        clickMe();
    })
});
