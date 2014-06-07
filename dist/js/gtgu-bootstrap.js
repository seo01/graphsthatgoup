//Bootstrap

function showInfo()
{
  $( '#instructions' ).slideDown(1000); $( '#showinfo' ).hide(); $( '#hideinfo' ).show();
}

function hideInfo()
{
  $( '#instructions' ).slideUp(1000); $( '#showinfo' ).show(); $( '#hideinfo' ).hide();
}

function scrollToElement(element)
{
  $('html, body').animate({
    scrollTop: $(element).offset().top-80
 }, 1000);
}
