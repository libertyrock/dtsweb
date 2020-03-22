var siestado;
var nomfile_playing = "";

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
}

function start_click() {
    var params = { id: nomfile_playing };
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
}

function continuo() {
    sndsvr('continuo.php',null, function (response) {
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
            $('#continuo').html(jdatos.info);
            $("#slide").width(jdatos.porcien);
            $("#slide").html(jdatos.porcien);
            $('#dtini').html(jdatos.dtini);
            $('#dtfin').html(jdatos.dtfin);
        });
}

function getNomfile_playing() {
    sndsvr("obtener.php", null, function (response) {
        var jdatos = JSON.parse(response);
        nomfile_playing = jdatos.name;
        var slen=jdatos.caps.length;
        var fin=jdatos.caps[slen-1].fin;
        var shtml="";
        for (let i = 0; i < slen; i++) {
            var porc=jdatos.caps[i].ini*100/fin;
            shtml+="<span class=\"w3-text-blue\" style=\"position: fixed; left: -5px; right: 0; padding-left: "+porc+"%; \">|</span>";
        }
        $("#marcas").html(shtml);
    });
}

function play(id) {
    closeSidebar();
    nomfile = id.textContent.trim();
    var params = { id: nomfile };
    sndsvr('start.php', params, function(){
        getNomfile_playing();
    });
}

// **************************************
// ************* Inicio *****************
// **************************************
$(document).ready(function () {
    getNomfile_playing();
    closeSidebar();
    eventos();
    cargar_click();
    $('#continuo').html("Loading info...");
    siestado = setInterval(continuo, 1000);
});
