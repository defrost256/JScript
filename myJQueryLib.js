var jsonData;
var marginData;

//Use zoom instead?
function animateText(elem, big) {
    var mainStyle = {fontSize: "25px", backgroundColor: "rgba(50, 50, 50, 0.5)"}, sideStyle = {fontSize: "20px", backgroundColor: "rgba(50, 50, 50, 0.3)"};
    var next = elem.next();
    var prev = elem.prev();
    if (!big) {
        mainStyle = {fontSize: "16px", backgroundColor: "rgba(50, 50, 50, 0.2)"};
        sideStyle = {fontSize: "16px", backgroundColor: "rgba(50, 50, 50, 0.2)"};
    }
    elem.stop(true);
    elem.animate(mainStyle, 200);
    /*if(elem.queue().length > 1){
        elem.stop();
    }*/
    if(next != null){
        next.stop(true);
        next.animate(sideStyle, 200);
        /*if(next.queue().length > 1){
            next.stop();
        }*/
    }
    if(prev != null){
        prev.stop(true);
        prev.animate(sideStyle, 200);
        /*if(prev.queue().length > 1){
            prev.stop();
        }*/
    }
}

function showCoutryDataGradient(idx)
{
    var countryData = jsonData[idx];
    var R = Math.round((countryData.life - marginData.life.min) * 255 / marginData.life.range);
    var G = Math.round((countryData.ecological - marginData.ecological.min) * 255 / marginData.ecological.range);
    var B = Math.round((countryData.happy - marginData.happy.min) * 255 / marginData.happy.range);
    //alert("R: " + R + " G: " + G + " B: " + B);
    $("#gradPanel").animate({backgroundImage: "linear-gradient(rgb(" + R + ", 0, 0), rgb(0, " + G + ", 0), rgb(0, 0, " + B + "))"});
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
        $("#countries").append('<div class="vertical" data-idx="' + i + '">' + data[i].country + '</div>');
        if(data[i].wellbeing > marginData.wellbeing.max)
            marginData.wellbeing.max = data[i].wellbeing;
        if(data[i].wellbeing < marginData.wellbeing.min)
            marginData.wellbeing.min = data[i].wellbeing;
        if(data[i].life > marginData.life.max)
            marginData.life.max = data[i].life;
        if(data[i].life < marginData.life.min)
            marginData.life.min = data[i].life;
        if(data[i].inequality > marginData.inequality.max)
            marginData.inequality.max = data[i].inequality;
        if(data[i].inequality < marginData.inequality.min)
            marginData.inequality.min = data[i].inequality;
        if(data[i].ecological > marginData.ecological.max)
            marginData.ecological.max = data[i].ecological;
        if(data[i].ecological < marginData.ecological.min)
            marginData.ecological.min = data[i].ecological;
        if(data[i].happy > marginData.happy.max)
            marginData.happy.max = data[i].happy;
        if(data[i].happy < marginData.happy.min)
            marginData.happy.min = data[i].happy;
    }
    marginData.wellbeing.range = marginData.wellbeing.max - marginData.wellbeing.min;
    marginData.happy.range = marginData.happy.max - marginData.happy.min;
    marginData.inequality.range = marginData.inequality.max - marginData.inequality.min;
    marginData.life.range = marginData.life.max - marginData.life.min;
    marginData.ecological.range = marginData.ecological.max - marginData.ecological.min;
});