
var btn = document.getElementById("btnX");
var form_xin = document.getElementsByClassName("form_xin")[0];
var form_xiu = document.getElementsByClassName("form_xiu")[0];
var xiugai = document.getElementsByClassName("xiugai");

/* btn.onclick = function () {
    form_xin.style.display = 'block';
} */
$("#btnX").click(function () { 
    $(".form_xin").eq(0).show();
 })
var imgSrc = "";
// var name = "";
$(".xiugai").click(function () {
    // console.log(8978978)
    $(".form_xiu").show();
    imgSrc = $(this).parent().parent().children().eq(1).children().attr("src");
    // console.log(imgSrc);
    imgSrc.split("_")[1];
    $(".imgSrc").val(imgSrc);
    var name =$(this).parent().parent().children().eq(2).html();
    $("#name").val(name);
    var brand = $(this).parent().parent().children().eq(3).html();
    $("#brand").val(brand);
    var price = $(this).parent().parent().children().eq(4).html();
    $("#price").val(price);
    var price2 = $(this).parent().parent().children().eq(5).html();
    $("#price2").val(price2);
    // console.log()
    

});/* 
$(".list").children().click(function () { 
    $(this).css({
        "background": "#white"

    })
 }) */
 $("#quxiao ").click(function () { 
     console.log($(this).parent()) ;
     $(this).parent().hide();
  })