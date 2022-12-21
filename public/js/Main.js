function PageRedirection(url) {
    
    window.location.href = url;
  }
  function ChangeIframeSrc(src) {
     
    var iframe = document.getElementById('HtmlIFrame');
    iframe.src = src;
  }

  function NavigateonNavBar(src) {    
    var iframe = document.getElementById('NavBarIFrame');
    iframe.src = src;
}
$(document).ready(function () {
  console.log("ready!");
  $(".single-room-slider").owlCarousel({
    margin: 30,
    autoplay: false,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

 });
  