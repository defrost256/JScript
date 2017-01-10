//---- Global constants ----
var AverageData = {
    wellbeing: 5.4,
    life: 70.9,
    inequality: 23,
    ecological: 3.3
};
var GoodColors = {
    wellbeing: "rgb(231, 130, 117)",
    life: "white",
    inequality: "rgb(228, 181,0)",
    ecological: "rgb(121, 150, 0)"
};
var BadColors = {
    wellbeing: "rgb(202, 31, 0)",
    life: "rgb(51, 51, 50)",
    inequality: "rgb(49, 39, 131)",
    ecological: "rgb(47, 36, 72)"
}
//---- Global Variables ----
var jsonData;


//Use zoom instead?
function animateText(elem, big) {
    var mainStyle = {fontSize: "1.6vw", opacity: 1.0}, sideStyle = {fontSize: "1vw", opacity: 0.7};
    var next = elem.next();
    var prev = elem.prev();
    if (!big) {
        mainStyle = {fontSize: "0.4vw", opacity: 0.2};
        sideStyle = {fontSize: "0.4vw", opacity: 0.2};
    }
    if(!elem.hasClass("compared"))
    {
        elem.stop(true);
        elem.animate(mainStyle, 200);
    }
    if(next != null && !next.hasClass("compared")){
        next.stop(true);
        next.animate(sideStyle, 200);
    }
    if(prev != null && !prev.hasClass("compared")){
        prev.stop(true);
        prev.animate(sideStyle, 200);
    }
}

function resetBG()
{
    $(".gradPanel").removeAttr("style");
}

function onClickCountry(elem)
{
    var idx = elem.attr("data-idx");
    if(!elem.hasClass("compared")){
        elem.addClass("compared");
        showCountryDataGradient(idx);
    }
    else{
        elem.removeClass("compared");
        var nextBG = $(".compared").get(0);
        if(nextBG == undefined)
            resetBG();
        else
            showCountryDataGradient(nextBG.getAttribute("data-idx"));
    }
}

function showCountryDataGradient(idx)
{
    var countryData = jsonData[idx];
    var lifeColor = countryData.life ? GoodColors.life : BadColors.life;
    var wellbeingColor = countryData.wellbeing ? GoodColors.wellbeing : BadColors.wellbeing;
    var inequalityColor = countryData.inequality ? GoodColors.inequality : BadColors.inequality;
    var ecologicalColor = countryData.ecological ? GoodColors.ecological : BadColors.ecological;
    var gradBG = "linear-gradient(" + lifeColor + "," + wellbeingColor + "," + inequalityColor + "," + ecologicalColor + ")";
    $(".gradPanel:last-child").css({background: gradBG}).animate({opacity: 1.0}, 500, "swing", function(){
        $(".gradPanel:nth-last-child(2)").css({background: gradBG});
        $(".gradPanel:last-child").css("opacity", "0.0");
    });
    
}

$.getJSON("dataJson.json", function(data){
    jsonData = [];
    for(var i = 0; i < data.length; i++){
        var currentData = data[i];
        jsonData.push({
            country: currentData.country,
            wellbeing: currentData.wellbeing > AverageData.wellbeing,
            life: currentData.life > AverageData.life,
            inequality: currentData.inequality < AverageData.inequality,
            ecological: currentData.ecological < AverageData.ecological
        });
    }
    jsonData.sort(function(a, b){
        if(a.country < b.country) return -1;
        if(b.country < a.country) return 1;
        return 0;
    });
    for(var i = 0; i < jsonData.length; i++)
        $("#countries").append('<div class="vertical" data-idx="' + i + '">' + jsonData[i].country + '</div>');
});
