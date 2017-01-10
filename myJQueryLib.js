var jsonData;
var marginData;

//Use zoom instead?
function animateText(elem, big) {
    var mainStyle = {fontSize: "25px", opacity: 1.0}, sideStyle = {fontSize: "17px", opacity: 0.7};
    var next = elem.next();
    var prev = elem.prev();
    if (!big) {
        mainStyle = {fontSize: "8px", opacity: 0.2};
        sideStyle = {fontSize: "8px", opacity: 0.2};
    }
    elem.stop(true);
    elem.animate(mainStyle, 200);
    if(next != null && next.attr("compared") != true){
        next.stop(true);
        next.animate(sideStyle, 200);
    }
    if(prev != null && prev.attr("compared") != true){
        prev.stop(true);
        prev.animate(sideStyle, 200);
    }
}

function showCountryDataGradient(idx)
{
    var countryData = jsonData[idx];
    var R = Math.round((countryData.life - marginData.life.min) * 255 / marginData.life.range);
    var G = Math.round((countryData.ecological - marginData.ecological.min) * 255 / marginData.ecological.range);
    var B = Math.round((countryData.happy - marginData.happy.min) * 255 / marginData.happy.range);
    $(".gradPanel:last-child").css({background: "linear-gradient(rgb(" + R + ", 0, 0), rgb(0, " + G + ", 0), rgb(0, 0, " + B + "))"}).animate({opacity: 1.0}, 500, "swing", function(){
        $(".gradPanel:nth-last-child(2)").css({background: "linear-gradient(rgb(" + R + ", 0, 0), rgb(0, " + G + ", 0), rgb(0, 0, " + B + "))"});
        $(".gradPanel:last-child").css("opacity", "0.0");
    });
    
}

$.getJSON("dataJson.json", function(data){
    jsonData = data;
    marginData = {
        wellbeing: {min: 100.0, max: -1.0, range: 0.0},
        life: {min: 100.0, max: -1.0, range: 0.0},
        inequality: {min: 200, max: -1, range: 0.0},
        ecological: {min: 100.0, max: -1.0, range: 0.0},
        happy: {min: 100.0, max: -1.0, range: 0.0}
    };


    for(var i = 0; i < data.length; i++){
        var currentData = data[i];
        $("#countries").append('<div class="vertical" data-idx="' + i + '">' + currentData.country + '</div>');
        marginData.wellbeing.max = Math.max(currentData.wellbeing, marginData.wellbeing.max);
        marginData.wellbeing.min = Math.min(currentData.wellbeing, marginData.wellbeing.min);
        marginData.life.max = Math.max(currentData.life, marginData.life.max);
        marginData.life.min = Math.min(currentData.life, marginData.life.min);
        marginData.inequality.max = Math.max(currentData.inequality, marginData.inequality.max);
        marginData.inequality.min = Math.min(currentData.inequality, marginData.inequality.min);
        marginData.ecological.max = Math.max(currentData.ecological, marginData.ecological.max);
        marginData.ecological.min = Math.min(currentData.ecological, marginData.ecological.min);
        marginData.happy.max = Math.max(currentData.happy, marginData.happy.max);
        marginData.happy.min = Math.min(currentData.happy, marginData.happy.min);
    }
    marginData.wellbeing.range = marginData.wellbeing.max - marginData.wellbeing.min;
    marginData.happy.range = marginData.happy.max - marginData.happy.min;
    marginData.inequality.range = marginData.inequality.max - marginData.inequality.min;
    marginData.life.range = marginData.life.max - marginData.life.min;
    marginData.ecological.range = marginData.ecological.max - marginData.ecological.min;
});