var siestado;
var nomFilePlaying = "";
var jdatos;
var cdatos;

// **************************************
// ************* Eventos ****************
// **************************************
function eventos() {
    $('#reboot').on("click", reboot_click);
    $('#start').on("click", start_click);
    $('#next').on("click", next_click);
    $('#prev').on("click", prev_click);
    $('#cargar').on("click", cargar_click);
    $('#pause').on("click", pause_click);
    $('#stop').on("click", stop_click);
    $('#btrack').on("click", btrack_click);
    $("#sliderc").on("change", sliderc_change);
    $("#slidera").on("change", slidera_change);
}

// ### Event infoitem ###
function infoitem(nomfile) {
    var params = { id: nomfile };
    sndsvr("infoitem.php", params, function (response) {
        var jdatos = JSON.parse(response);
        var slen = jdatos.caps.length;
        var fin = jdatos.caps[slen - 1].fin;
        var html_caps = "";
        var j = 0;
        for (let i = 0; i < slen; i++) {
            ++j;
            html_caps += '<li><a id=c' + j + ' onclick="play(\'' + jdatos.name + '\',' + j + ');">' + j + ': ' + jdatos.caps[i].tit + '</a></li>';
        }
        var html_name = "";
        html_name += '<b><u>' + jdatos.artist + '</u><br>' + jdatos.album + '</b><br>';

        $("#iitracks").html(html_name + html_caps + "<p>" + jdatos.info + "</p>");
        $("#iiwin").show();
    });
}

function sliderc_change() {
    if (cdatos.playing) {
        desactiva_continuo();
        var valor = $("#sliderc").val() * cdatos.fs / 100;
        var params = { seconds: valor };
        sndsvr('seek.php', params, function () {
            activa_continuo();
        });
    } else {
        alert("Press play before");
    }
}

function slidera_change() {
    if (cdatos.playing) {
        desactiva_continuo();
        var p = 100 / $("#slidera").val();
        var s = (jdatos.caps[cdatos.capnum].fin - jdatos.caps[cdatos.capnum].ini) / p
        var valor = jdatos.caps[cdatos.capnum].ini + s;
        var params = { seconds: valor };
        sndsvr('seek.php', params, function () {
            activa_continuo();
        });
    } else {
        alert("Press play before");
    }
}

function btrack_click() {
    $("#ctracks").show();
}

function start_click() {
    var params = { id: nomFilePlaying, cap: 1, start: 'null' };
    sndsvr('start.php', params, null);
}

function prev_click() {
    if (cdatos.playing) {
        sndsvr("prev.php", null, null);
    } else {
        alert("Press play before");
    }
}

function next_click() {
    if (cdatos.playing) {
        sndsvr("next.php", null, null);
    } else {
        alert("Press play before");
    }
}

function cargar_click() {
    $('#cuenta').html("Loading ...");
    $('#filelist').html("");
    sndsvr('cargar.php', null, function (response) {
        var jdatos = JSON.parse(response);
        $("#filelist").html(jdatos.lista);
        $("#cuenta").html("Total: " + jdatos.count);
        $("#myInput").val("");
        $("#myInput").trigger("focus");
    });
}

function pause_click() {
    if (cdatos.playing) {
        sndsvr("pause.php", null, null);
    } else {
        alert("Press play before");
    }
}

function stop_click() {
    sndsvr("stop.php", null, null);
}

function reboot_click() {
    sndsvr("reboot.php", null, null);
}

// ### Event touchmove ###
function touchmove(event, file, id) {
    var x = event.touches[0].clientX;
    var y = event.touches[0].clientY;
    //document.getElementById("b" + id).innerHTML = x + ", " + y;
    if (x < 20) play(file, 1);
}

// **************************************
// *********** Fin eventos **************
// **************************************

function sndsvr(comando, parametros, func) {
    $.ajax({
        data: parametros,
        url: comando,
        type: 'post',
        success: function (response) {
            func(response);
        }
    });
}

function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "block";
        } else {
            li[i].style.display = "none";
        }
    }
}

function myInputProc() {
    $("#myInput").val("");
    myFunction();
    $("#myInput").trigger("focus");
}

function openSidebar() {
    // document.getElementById("mySidebar").style.display = "block";
    // document.getElementById("mibar").style.display = "none";
    // document.getElementById("resto").style.display = "none";
    // document.getElementById("pie").style.display = "none";
    $("#mySidebar").show();
    $("#mibar").hide();
    $("#myInput").trigger("focus");
}

function closeSidebar() {
    // document.getElementById("mySidebar").style.display = "none";
    // document.getElementById("mibar").style.display = "block";
    // document.getElementById("resto").style.display = "block";
    // document.getElementById("pie").style.display = "block";
    $("#mySidebar").hide();
    $("#mibar").show();
    $("#ctracks").hide();
    $("#iiwin").hide();
}

function continuo() {
    sndsvr('continuo.php', null, function (response) {
        // Perform operation on the return value
        cdatos = JSON.parse(response);
        if (nomFilePlaying != cdatos.name) getInfoPlaying();
        if (!cdatos.playing) {
            $("#start").addClass("blink_text");
        } else {
            $("#start").removeClass("blink_text");
        }
        if (cdatos.pausa) {
            $("#pause").addClass("blink_text");
            $("#slc").removeClass("w3-light-blue");
            $("#slc").addClass("w3-dark-grey");
            $("#slc").addClass("blink_text");
            $("#sla").removeClass("w3-light-green");
            $("#sla").addClass("w3-dark-grey");
            $("#sla").addClass("blink_text");
        } else {
            $("#pause").removeClass("blink_text");
            $("#slc").removeClass("blink_text");
            $("#slc").removeClass("w3-dark-grey");
            $("#slc").addClass("w3-light-blue");
            $("#sla").removeClass("blink_text");
            $("#sla").removeClass("w3-dark-grey");
            $("#sla").addClass("w3-light-green");
        }
        $('#titcap').html(cdatos.titcap);
        $("#slc").width(cdatos.porcien + '%');
        $("#slc").html(Math.round(cdatos.porcien) + '%');
        $("#sliderc").val(cdatos.porcien);

        $("#sla").width(cdatos.cporcien + '%');
        $("#sla").html(Math.round(cdatos.cporcien) + '%');
        $("#slidera").val(cdatos.cporcien);
        $('#dtini').html(cdatos.dtini);
        $('#dtcap').html(cdatos.dtcap);
        $('#dtfin').html(cdatos.dtfin);
    });
}

function getInfoPlaying() {
    sndsvr("obtener.php", null, function (response) {
        if (response != '') {
            jdatos = JSON.parse(response);
            nomFilePlaying = jdatos.name;
            var slen = jdatos.caps.length;
            var fin = jdatos.caps[slen - 1].fin;
            var html_marcas = "";
            var html_caps = "";
            var j = 0;
            for (let i = 0; i < slen; i++) {
                ++j;
                //html_caps += '<li>' + jdatos.caps[i].tit + '</li>';
                html_caps += '<li><a id=c' + j + ' onclick="playc(' + j + ');">' + j + ': ' + jdatos.caps[i].tit + '</a></li>';
                var porc = jdatos.caps[i].ini * 100 / fin;
                html_marcas += "<span class=\"w3-text-blue\" style=\"position: absolute; margin-left: -3px; left: " + porc + "%; \">|</span>";
            }
            $("#marcas").html(html_marcas);
            var html_name = "";
            html_name += '<b><u>' + jdatos.artist + '</u><br>' + jdatos.album + '</b><br>';
            $("#infoname").html(html_name);
            $("#infostream").html(jdatos.info);
            $("#tracks").html(html_caps);
        }
    });
}

function playc(capitulo) {
    if (cdatos.playing) {
        document.getElementById('ctracks').style.display = 'none';
        var valor = jdatos.caps[capitulo - 1].ini;
        var params = { seconds: valor };
        sndsvr('seek.php', params, function () {
            activa_continuo();
        });
    } else {
        alert("Press play before");
    }
}

function play(nomfile, capitulo) {
    closeSidebar();
    var params = { id: nomfile, cap: capitulo, start: 'null' };
    sndsvr('start.php', params, function () {
        getInfoPlaying();
    });
}

function activa_continuo() {
    siestado = setInterval(continuo, 1000);
}

function desactiva_continuo() {
    clearInterval(siestado);
}

// **************************************
// ************* Inicio *****************
// **************************************
$(function () {
    getInfoPlaying();
    continuo();
    cargar_click();
    eventos();
    activa_continuo();
});
