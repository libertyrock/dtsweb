var siestado;
var nomFilePlaying = "";
var jdatos;

// **************************************
// ************* Eventos ****************
// **************************************
function eventos() {
    $('#reboot').click(reboot_click);
    $('#start').click(start_click);
    $('#next').click(next_click);
    $('#prev').click(prev_click);
    $('#cargar').click(cargar_click);
    $('#pause').click(pause_click);
    $('#stop').click(stop_click);
    $('#btrack').click(btrack_click);
    $("#sliderm").change(sliderm_change);
}

function sliderm_change() {
    desactiva_continuo();
    var valor = $("#sliderm").val();
    var params = { id: nomFilePlaying, cap: 'null', start: valor };
    sndsvr('start.php', params, function () {
        activa_continuo();
    });

}

function btrack_click() {
    $("#ctracks").show();
}

function start_click() {
    var params = { id: nomFilePlaying, cap: 1, start: 'null' };
    sndsvr('start.php', params, null);
}

function prev_click() {
    sndsvr("prev.php", null, null);
}

function next_click() {
    sndsvr("next.php", null, null);
}

function cargar_click() {
    $('#cuenta').html("Loading ...");
    $('#filelist').html("");
    sndsvr('cargar.php', null, function (response) {
        var jdatos = JSON.parse(response);
        $("#filelist").html(jdatos.lista);
        $("#cuenta").html("Total: " + jdatos.count);
        $("#myInput").val("");
        $("#myInput").focus();
    });
}

function pause_click() {
    sndsvr("pause.php", null, null);
}

function stop_click() {
    sndsvr("stop.php", null, null);
}

function reboot_click() {
    sndsvr("reboot.php", null, null);
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
    $("#myInput").focus();
}

function openSidebar() {
    // document.getElementById("mySidebar").style.display = "block";
    // document.getElementById("mibar").style.display = "none";
    // document.getElementById("resto").style.display = "none";
    // document.getElementById("pie").style.display = "none";
    $("#mySidebar").show();
    $("#mibar").hide();
    $("#myInput").focus();
}

function closeSidebar() {
    // document.getElementById("mySidebar").style.display = "none";
    // document.getElementById("mibar").style.display = "block";
    // document.getElementById("resto").style.display = "block";
    // document.getElementById("pie").style.display = "block";
    $("#mySidebar").hide();
    $("#mibar").show();
    $("#ctracks").hide();
}

function continuo() {
    sndsvr('continuo.php', null, function (response) {
        // Perform operation on the return value
        var jdatos = JSON.parse(response);
        if (jdatos.pausa) {
            $("#slide").removeClass("w3-light-blue");
            $("#slide").addClass("w3-dark-grey");
            $("#slide").addClass("blink_text");
        } else {
            $("#slide").removeClass("blink_text");
            $("#slide").removeClass("w3-dark-grey");
            $("#slide").addClass("w3-light-blue");
        }
        $('#titcap').html(jdatos.titcap);
        $("#slide").width(jdatos.porcien + '%');
        $("#slide").html(Math.round(jdatos.porcien) + '%');
        $("#slidec").width(jdatos.cporcien + '%');
        $("#slidec").html(Math.round(jdatos.cporcien) + '%');
        $("#sliderm").val(jdatos.porcien);
        $('#dtini').html(jdatos.dtini);
        $('#dtcap').html(jdatos.dtcap);
        $('#dtfin').html(jdatos.dtfin);
    });
}

function getInfoPlaying() {
    sndsvr("obtener.php", null, function (response) {
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
        var html_info = "";
        html_info += '<b><u>' + jdatos.artist + '</u><br>' + jdatos.album + '</b><br>';
        html_info += jdatos.info0 + ',';
        html_info += jdatos.info1 + '<br>';
        html_info += jdatos.info2 + ',';
        html_info += jdatos.info3 + '<br>';
        html_info += jdatos.info4 + '<br>';
        $("#infoname").html(html_info);
        $("#tracks").html(html_caps);

    });
}

function playc(capitulo) {
    document.getElementById('ctracks').style.display = 'none';
    play(nomFilePlaying, capitulo);
}

function play(nomfile, capitulo) {
    closeSidebar();
    var params = { id: nomfile, cap: capitulo, start: 'null' };
    sndsvr('start.php', params, function () {
        getInfoPlaying();
    });
}

function activa_continuo(){
    siestado = setInterval(continuo, 1000);
}

function desactiva_continuo(){
    clearInterval(siestado);
}

// **************************************
// ************* Inicio *****************
// **************************************
$(document).ready(function () {
    getInfoPlaying();
    continuo();
    cargar_click();
    eventos();
    activa_continuo();
});
