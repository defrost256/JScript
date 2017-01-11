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
};
//---- Global Variables ----
var jsonData;
var selectedCountries = [];
var clicked = false;

function recalcBGParams() {
    "use strict";
    var i, c, pos, width;
    selectedCountries.sort(function (a, b) { return a - b; });
    for (i = selectedCountries.length - 1; i >= 0; i--) {
        c = selectedCountries[i];
        pos = c.elem.position().left;
        width = (i < selectedCountries.length - 1) ? selectedCountries[i + 1].pos - pos : $(".background").width() - pos;
        if (c.pos !== pos || c.width !== width) {
            c.pos = pos;
            c.width = width;
            c.dirty = true;
        }
        if (c.bg !== null) {
            c.bg.css("z-index", "" + (selectedCountries.length - i + 1));
        }
    }
}

function animateBG() {
    "use strict";
    var i, c;
    for (i = 1; i < selectedCountries.length; i++) {
        c = selectedCountries[i];
        /*console.log(i);
        console.log(c);*/
        if (c.dirty) {
            c.bg.animate({left: "" + c.pos + "px", width: "" + c.width + "px"});
            c.dirty = false;
        }
    }
}

//Use zoom instead?
function animateText(elem, big) {
    "use strict";
    var mainStyle = {fontSize: "1.6vw", opacity: 1.0}, sideStyle = {fontSize: "1vw", opacity: 0.7},
        next = elem.next(),
        prev = elem.prev();

    if (!big) {
        mainStyle = {fontSize: "0.4vw", opacity: 0.2};
        sideStyle = {fontSize: "0.4vw", opacity: 0.2};
    }
    if (!elem.hasClass("compared")) {
        elem.stop(true);
        if (big || !clicked) {
            elem.animate(mainStyle, 200);
        } else {
            elem.animate(mainStyle, 200, "swing", function () {
                recalcBGParams();
                animateBG();
                clicked = false;
            });
        }
    }
    if (next !== null && !next.hasClass("compared")) {
        next.stop(true);
        next.animate(sideStyle, 200);
    }
    if (prev !== null && !prev.hasClass("compared")) {
        prev.stop(true);
        prev.animate(sideStyle, 200);
    }
}

function resetBG() {
    "use strict";
    $(".gradPanel").removeAttr("style");
}

function addCountry(idx) {
    "use strict";
    var cIdx = selectedCountries.findIndex(function (a) {return a.idx === idx; }),
        c = selectedCountries[cIdx],
        lifeColor = c.data.life ? GoodColors.life : BadColors.life,
        wellbeingColor = c.data.wellbeing ? GoodColors.wellbeing : BadColors.wellbeing,
        inequalityColor = c.data.inequality ? GoodColors.inequality : BadColors.inequality,
        ecologicalColor = c.data.ecological ? GoodColors.ecological : BadColors.ecological,
        gradBG = "linear-gradient(" + lifeColor + "," + wellbeingColor + "," + inequalityColor + "," + ecologicalColor + ")";

    $("#countries").css("z-index", "" + (selectedCountries.length + 2));
    $(".background").append('<div class="gradPanel"><span class="gradText">' + c.data.country + '</span></div>');
    c.bg = $(".background .gradPanel:last-child");
    console.log("" + (cIdx < selectedCountries.length - 1 ? selectedCountries[cIdx + 1].pos : $(".background").width()) + "px");
    c.bg.css({
        left: "" + (cIdx < selectedCountries.length - 1 ? selectedCountries[cIdx + 1].pos : $(".background").width()) + "px",
        background: gradBG,
        zIndex: "" + (selectedCountries.length - cIdx + 1)
    });

    /*var countryData = jsonData[idx],
        lifeColor = countryData.life ? GoodColors.life : BadColors.life,
        wellbeingColor = countryData.wellbeing ? GoodColors.wellbeing : BadColors.wellbeing,
        inequalityColor = countryData.inequality ? GoodColors.inequality : BadColors.inequality,
        ecologicalColor = countryData.ecological ? GoodColors.ecological : BadColors.ecological,
        gradBG = "linear-gradient(" + lifeColor + "," + wellbeingColor + "," + inequalityColor + "," + ecologicalColor + ")";

    $(".background").append('<div class="gradPanel">' + countryData.country + '</div>');
    var lastBG = $(".background .gradPanel:last-child");
    lastBG.css({background: gradBG}); */
}

function onClickCountry(elem) {
    "use strict";
    var idx = elem.data("idx"), cIdx, removed;
    if (!elem.hasClass("compared")) {
        elem.addClass("compared");
        selectedCountries.push({
            idx: idx,
            data: jsonData[idx],
            elem: elem,
            bg: null,
            pos: 0,
            width: 0,
            dirty: true
        });
        recalcBGParams();
        addCountry(idx);
    } else {
        elem.removeClass("compared");
        cIdx = selectedCountries.findIndex(function (a) { return a.idx === idx; });
        removed = selectedCountries.splice(cIdx, 1);
        recalcBGParams();
        removed[0].bg.remove();
        delete removed[0];
        clicked = true;
    }
    animateBG();
}

$.getJSON("dataJson.json", function (data) {
    "use strict";
    var i, currentData;
    jsonData = [];
    for (i = 0; i < data.length; i++) {
        currentData = data[i];
        jsonData.push({
            country: currentData.country,
            wellbeing: currentData.wellbeing > AverageData.wellbeing,
            life: currentData.life > AverageData.life,
            inequality: currentData.inequality < AverageData.inequality,
            ecological: currentData.ecological < AverageData.ecological
        });
    }
    jsonData.sort(function (a, b) {
        if (a.country < b.country) {
            return -1;
        }
        if (b.country < a.country) {
            return 1;
        }
        return 0;
    });
    for (i = 0; i < jsonData.length; i++) {
        $("#countries").append('<div class="vertical" data-idx="' + i + '">' + jsonData[i].country + '</div>');
    }
});
