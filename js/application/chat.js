$(document).on('click', '.panel-heading #minim_chat_window', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.children().removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.children().removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});

$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').children().removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});

$(document).on('click', '.navbar-top-links .chat-active', function (e) {
    if($('#chat-etat').css('display') == 'none'){
        $('#chat-etat').css('display','initial');
    } else {
        $('#chat-etat').css('display','none');
    }
});