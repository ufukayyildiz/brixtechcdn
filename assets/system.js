 var JSON_FOODS_ORJ;

 var JSON_FOODS;


  $(document).on("focusin", ".sepeturunadet", function(){  

    $(this).data('val', $(this).val());

});


 $(document).on("change", ".sepeturunadet", function(){ 

   var prev = $(this).data('val');

    var current = $(this).val();

       var urunadi =$(this).data('urunadi');

       var urunid =$(this).data('urunid');

console.log("artir " + urunid + " + " + prev + " + " + current + " + " + urunadi);

  if (parseInt(prev) > 0 ) {

degerleri_guncelle(urunid,"-",prev);

}

if (parseInt(current) > 0) {

degerleri_guncelle(urunid,"+",current);

}



   $(this).data('val', current);



});



 /*



function onChange() {



    console.log($(this));



    var oldValue = $(this).defaultValue;



    var newValue = $(this).value;



    console.log(oldValue + " - " +newValue );



}



 $(document).on("change", ".sepeturunadet", function(){ 



 var oldValue = $(this).attr("data-initial-value");



 var newValue = $(this).val();



 console.log(oldValue + " - " +newValue );


});*/



function urunsil(urunadi,urunid) {


    var adet = $(".urunadet"+urunid).val();

    var urunadi_text = urunadi;


  degerleri_guncelle(urunid,"-",adet);

  urunadi = String(urunadi).replace(/ /g, "_");

  $("#sepet"+urunid).remove();

    $("#tablosepet"+urunid).remove();

}

function sepete_ekle(urunadi) {

 degerleri_guncelle(urunadi,"+",0);

 $("#menu_arama_input").val("");


}
function menu_kapat() {
  // body...
  var arama_val = $("#menu_arama_input").val().toUpperCase();
   if (arama_val.length == 0) {
      $("#arama_sonuc").html("");
      return;
    }
}

function menu_arama(e) {

var arama_val = $("#menu_arama_input").val().toUpperCase();

    var datalar = "";
    console.log(arama_val.length);
   

    if (arama_val.length < 3 ) {

        $("#arama_sonuc").html("");


 arama_div = "<li class='arama_sonuc_yok'>Search Min. 3 Character</a></li>";

  $("#arama_sonuc").append(arama_div);

   return;

    }

     $.ajax({
            type: 'GET',
           url: 'data/food_search.php?q=' + arama_val,
            success: function (data) { 

datalar =JSON.parse(data); 


if (arama_val === "") {

 datalar =JSON_FOODS; 

    }

                var arama_div = "";

                $("#arama_sonuc").html("");

                     if (datalar.length > 0) {

                    arama_div = "<div class='sonuclar'>";

                    for (var i = 0; i < datalar.length; i++) {

                        arama_div = arama_div + "<li onclick=\"sepete_ekle('" + datalar[i].fdcId + "')\">" + datalar[i].NAME + "</a></li>";

                }

                arama_div = arama_div + "</div>";

                }
                    
                if (datalar.length == 0) {
                    arama_div = "<li class='arama_sonuc_yok'>Not Founds !</a></li>";
                }

                $("#arama_sonuc").append(arama_div);

},



    error: function(data) {



        console.log("hata");



        console.log(data);        



    }



        });



            



    }


function degerleri_guncelle(arama,tip,miktar) {



 $.ajax({



            type: 'GET',

            url: 'https://nutrient.fstdesk.com/nutrients/'+ arama +'.json',

            success: function (data1) { 

            var test = data1;
                console.log(test);


var id = arama;


if (tip == "+" && miktar == 0) {

  $("#sepet").append('<div id="sepet'+ id +'" class="sepeturun">  <div class="sepet_baslik">'+ test.description +'</div>  <div class="sepet_adet"><input type="number" class="ant-input-number-input sepeturunadet urunadet'+ id +'" autocomplete="off"  max="5000" data-urunadi="'+ test.description +'" data-urunid="'+ id +'" min="0" step="1" value="'+ 100 +'"></div>  <div class="sepet_sil" onclick="urunsil(\''+ test.description +'\',\''+ id +'\')"><i class="fa fa-times urunsil"></i></div></div>');

 $("#table_foods").append('<tr id="tablosepet'+ id +'"><td>'+test.description+'</td><td> <b>'+ 100 +'</b></td></tr>');



}else if(miktar > 0){

$("#tablosepet"+ id + " td b").html(miktar);

}


//degerler

for (var i = 0; i < test.foodNutrients.length -1; i++) {
  
 var id = String(test.foodNutrients[i].nutrient.name).replace(/ /g, "_").replace(")", "_").replace("(", "_").replace(/,/gi, "_").replace(/:/gi, "_").replace("+", "_").replace(/-/gi, "_");

if (test.foodNutrients[i].nutrient.unitName == "kJ") {
id = id + "kJ";
}

var eski_miktar = 0;
 try {
 eski_miktar = $("#liste" + id + " .vitamin_miktar b").attr('data-tmiktar');
}
catch(err) {
   eski_miktar = 0;
}


    var adet = 0;

    if (miktar == 0) {
        adet = 100;
    } else {
        adet = miktar;
    }
    var sql_miktar = 0;

    var sql_vitamin_miktari = 0;

    if (isNaN(parseFloat(test.foodNutrients[i].amount)) != true) {
        sql_vitamin_miktari = parseFloat(test.foodNutrients[i].amount);
        sql_miktar = parseFloat(test.foodNutrients[i].amount);
    }
     console.log(parseFloat(test.foodNutrients[i].amount) + " - " + sql_miktar);



    
    /* GELEN BİRİME GÖRE CEVİRİ YAPIYOR*/ 

    var gelen_deger_birimi = test.foodNutrients[i].nutrient.unitName;

    var sql_eklenecek_miktar_ug = 0;

    switch (gelen_deger_birimi) {

        case "g":

            sql_eklenecek_miktar_ug = sql_vitamin_miktari * 1000;

            sql_eklenecek_miktar_ug = sql_eklenecek_miktar_ug * 1000;

            break;

        case "mg":

            sql_eklenecek_miktar_ug = sql_vitamin_miktari * 1000;

            break;

        default:

            sql_eklenecek_miktar_ug = sql_vitamin_miktari;

            break;

    }

    var eklenen_miktar = parseFloat(sql_eklenecek_miktar_ug) * parseFloat(adet);

    var toplam_miktar = "0.0";

    var toplam_miktar_tam = "0.0";

    var birim_text = "";

   // console.log("ust2 " + sql_eklenecek_miktar_ug + " - " + gelen_deger_birimi + " - " + adet + " - " + parseFloat(ustArray[y]) + "-" + eklenen_miktar + " - " + parseFloat(eski_miktar));

    if (tip == "+") {

        toplam_miktar_tam = parseFloat(eklenen_miktar) + parseFloat(eski_miktar);

        toplam_miktar = parseFloat(eklenen_miktar) + parseFloat(eski_miktar);

        $("#arama_sonuc").html("");

    } else {

        toplam_miktar_tam = parseFloat(eski_miktar) - parseFloat(eklenen_miktar);

        toplam_miktar = parseFloat(eski_miktar) - parseFloat(eklenen_miktar);

    }

    //console.log(x +" - "+ eski_miktar + " - " + eklenen_miktar + " - " +toplam_miktar);

    if (gelen_deger_birimi != "kcal" && gelen_deger_birimi != "kJ" ) {

        if (toplam_miktar_tam >= 10000) {

            toplam_miktar = toplam_miktar_tam / 1000;

            birim_text = " mg";

            console.log("alt mg" + toplam_miktar)

            if (toplam_miktar >= 10000) {

                toplam_miktar = toplam_miktar / 1000;

                toplam_miktar = toplam_miktar / 100;

                birim_text = " g";

                console.log("alt g" + toplam_miktar)

            } else {

                toplam_miktar = toplam_miktar / 100;

            }

        } else {

            birim_text = " μg";
toplam_miktar = toplam_miktar_tam / 100;
            console.log("alt ug" + toplam_miktar)

        }

    } else {

if (gelen_deger_birimi == "kcal") {
birim_text = " kcal";
}else{
  birim_text = " kJ";
}
       

        toplam_miktar = toplam_miktar / 100;

    }

    console.log(toplam_miktar_tam + " - " + parseFloat(toplam_miktar).toFixed(3) + " - " + toplam_miktar.toFixed(3));

    $("#liste" + id + " .vitamin_miktar b").text(Number(toplam_miktar).toFixed(3).replace(".",","));

    $("#liste" + id + " .vitamin_miktar b").attr('data-tmiktar', toplam_miktar_tam);

    $("#liste" + id + " .vitamin_miktar strong").text(birim_text);

    $("#tablo" + id + " b").text(parseFloat(toplam_miktar).toFixed(3).replace(".",","));

    $("#tabloBirim" + id + " strong").text(birim_text);

    //ustdeglerise basıyor
    if (id == "Energy" || id == "Protein" || id == "Carbohydrate__by_difference" || id == "Total_lipid__fat_") {

      $("#ust"+id+" b").text(parseFloat(toplam_miktar).toFixed(3).replace(".",","));
      $("#ust"+id+" b").attr('data-tmiktar',toplam_miktar_tam);
      $("#ust"+id+" strong").text(birim_text);

}

    var vitamin_defaultmiktar = $("#liste" + id + " .vitamin_yuzde").attr('data-defaultmiktar');

    var toplam_miktar_yuzde_hesapla = toplam_miktar_tam / 100;
    
    

    var vitami_yuzdedeger = (parseFloat(toplam_miktar_yuzde_hesapla) / parseFloat(vitamin_defaultmiktar)) * 10000;

    var excel_yuzde_deger = Number(vitami_yuzdedeger).toFixed(3);
    
    $("#tabloDV" + id + " strong").text(excel_yuzde_deger);

    var yuzde_renk = "";

    if (vitami_yuzdedeger < 25) {
        yuzde_renk = "#1890ff";
    }

    if (vitami_yuzdedeger > 50) {
        yuzde_renk = "#52c41a";
    }

    if (vitami_yuzdedeger > 100) {
        yuzde_renk = "#f5222d";
    }

    $("#liste" + id + " .vitamin_yuzde .bar").LineProgressbar({
        percentage: vitami_yuzdedeger,
        unit: "%",
        duration: '0',
        animation: false,
        fillBackgroundColor: yuzde_renk,
        height: '8px',
        radius: '0px'
    });
    
$("#liste" + id + " .vitamin_yuzde .bar .progressbar .percentCount").html("%"+Number(vitami_yuzdedeger).toFixed(3).replace(".",","));



 }


}
        });



}







  







   $(document).ready(function() {







     $.ajax({



            type: 'GET',



            url: 'data/food_search.php',



            success: function (data) { 



    JSON_FOODS = JSON.parse(data);



    JSON_FOODS_ORJ = JSON.parse(data);







},



    error: function(data) {



        console.log("hata");



        console.log(data);        



    }



        });











     $.ajax({



            type: 'GET',



            url: 'data/vitamins.php',



            success: function (data) {



                var data =  JSON.parse(data);


$("#vitaminler").append("<h4>Vitamins</h4>");

            $("#mineraller").append("<h4>Minerals</h4>");

            $("#aminoasit").append("<h4>Amino Acids</h4>");
            $("#fattasit").append("<h4>Fatty Acids</h4>");
   
            $("#mainliste").append("<h4>Macro Nutrients</h4>");
            $("#othervit").append("<h4>Other</h4>");
for (var i = 0; i < data.length; i++) {

var id = String(data[i].NAME).replace(/ /g, "_").replace(")", "_").replace("(", "_").replace(/,/gi, "_").replace(/:/gi, "_").replace("+", "_").replace(/-/gi, "_");

if (data[i].BIRIM == "kJ") {
id = id + "kJ";
}
var icerik_data = '<div id="liste'+id+'" class="vitaminliste"><div class="vitamin_baslik">'+data[i].NAME+'</div>  <div class="vitamin_yuzde" data-defaultmiktar="'+ data[i].rda +'"><div class="bar" ></div></div>  <div class="vitamin_miktar"><b data-tmiktar="0">0</b><strong> μg</strong></div></div>';
var icerik_table ='<tr><td>'+ data[i].NAME +'</td><td id="tablo'+id+'"> <b data-tmiktar="0">0</b></td><td id="tabloBirim'+id+'"><strong> μg</strong></td><td id="tabloDV'+id+'"><strong>0</strong></td></tr>';

switch(data[i].GRUP) {
   case "0":
    $("#vitaminler").append(icerik_data);
$("#table_vitamins").append(icerik_table);
    break;
  case "1":
    $("#mineraller").append(icerik_data);
$("#table_minerals").append(icerik_table);
   
    break;
  case "2":
   $("#aminoasit").append(icerik_data);
$("#table_amino").append(icerik_table);
  
    break;
     case "3":
        $("#fattasit").append(icerik_data);
$("#table_fatty").append(icerik_table); 
    break;
     case "4":
       $("#mainliste").append(icerik_data);
$("#table_main").append(icerik_table);     
    break;
      case "5":
       $("#othervit").append(icerik_data);
     $("#table_other").append(icerik_table);  
    break;
    
  default:
   
}


 $("#liste"+id+" .vitamin_yuzde .bar").LineProgressbar({
  percentage: '0',
  fillBackgroundColor: '#1890ff',
  unit:"%",
  duration:'0',
  animation:false,
  height: '8px',
  radius: '0px'
  });

}

                  


            


}



});



     /*



 $.ajax({



            type: 'GET',



            url: 'data/foods.json',



            success: function (data) {



function format(item) { return item.NAME; };







}



     });*/



});


function excel2exportyeni(){

     $.ajax({
            type: 'GET',
            url: 'data/vitamins.php',
            success: function (data) {


$("#NutrientFinder tr:nth-child(n+4)").remove();

    var data =  JSON.parse(data);

    var vitaminler =$(data).filter(function (i,n){
        return n.GRUP==="0";
    });

      var mineraller =$(data).filter(function (i,n){
        return n.GRUP==="1";
    });

        var aminoasit =$(data).filter(function (i,n){
        return n.GRUP==="2";
    });
            var fattasit =$(data).filter(function (i,n){
        return n.GRUP==="3";
    });
                  var general_data =$(data).filter(function (i,n){
        return n.GRUP==="4";
    });
                   var other_data =$(data).filter(function (i,n){
        return n.GRUP==="5";
    });

var toplam_sayi = 0;
var sayilar=[vitaminler.length,mineraller.length,aminoasit.length,fattasit.length,general_data.length,other_data.length];
var min,mak;
min = sayilar[0];
mak = sayilar[0]; 
for(var i=0;i<sayilar.length;i++)
{
    
    if (min > sayilar[i])
    {
         min = sayilar[i];
    }
    
    if (mak < sayilar[i])  
    {
        mak = sayilar[i]; 
    }
}

 for (var i = 0; i < mak; i++) {

    var table = document.getElementById("NutrientFinder");
    var row = table.insertRow(document.getElementById("NutrientFinder").rows.length);

    var cell0 = row.insertCell(0);
    var cell01 = row.insertCell(1);
    var id = "";
    var ad = "";
    var miktar = "";
    var birim = "";
    var dv = "";
    var cell1 ="";
    var cell2 ="";
    var cell3 ="";
    var cell4 ="";
    if (i <= $("#sepet").children().length-1) {
      id=$("#sepet").children()[i].id;

 ad = $("#"+id+" .sepet_baslik").html();
     miktar = $("#"+id+" .sepet_adet .sepeturunadet").val();
  cell0.innerHTML = ad;
  cell01.innerHTML = miktar;
}else{
cell0.innerHTML = "";
  cell01.innerHTML = "";
}




if (i<= general_data.length -1) {

     id = String(general_data[i].NAME).replace(/ /g, "_").replace(")", "_").replace("(", "_").replace(/,/gi, "_").replace(/:/gi, "_").replace("+", "_").replace(/-/gi, "_");
     ad = String(general_data[i].NAME).replace(/-/gi, "-,");
     miktar = $("#liste"+id+" .vitamin_miktar b").html();
     birim = $("#liste"+id+" .vitamin_miktar strong").html();
     dv = $("#tabloDV"+id+" strong").html();
    /* 
console.log("excel -" + id + " - " + miktar + " - " + dv);
console.log("exceltr -" + id + " - " + Number(miktar).toFixed(3).replace(".",",")  + " - " + dv);
console.log("excelt -" + id + " - " + Number(miktar).toFixed(3)  + " - " + dv);
console.log("exceln -" + id + " - " + String(miktar).replace(",",".")  + " - " + dv);
console.log("excelp -" + id + " - " + parseFloat(miktar)  + " - " + dv);*/

   cell1 = row.insertCell(2);
   cell2 = row.insertCell(3);
   cell3 = row.insertCell(4);
   cell4 = row.insertCell(5);
  cell1.innerHTML = ad;
  cell2.innerHTML = String(miktar).replace(",",".");
  cell3.innerHTML = birim;
  cell4.innerHTML = dv;
  }else{
     cell1 = row.insertCell(2);
   cell2 = row.insertCell(3);
   cell3 = row.insertCell(4);
   cell4 = row.insertCell(5);
  cell1.innerHTML = "";
  cell2.innerHTML = "";
  cell3.innerHTML = "";
  cell4.innerHTML = "";
  }

  //
  if (i<= vitaminler.length -1) {
     id = String(vitaminler[i].NAME).replace(/ /g, "_").replace(")", "_").replace("(", "_").replace(/,/gi, "_").replace(/:/gi, "_").replace("+", "_").replace(/-/gi, "_");
     ad = String(vitaminler[i].NAME);
     miktar = $("#liste"+id+" .vitamin_miktar b").html();
     birim = $("#liste"+id+" .vitamin_miktar strong").html();
     dv = $("#tabloDV"+id+" strong").html();

  cell1 = row.insertCell(6);
  cell2 = row.insertCell(7);
  cell3 = row.insertCell(8);
  cell4 = row.insertCell(9);
  cell1.innerHTML = ad;
  cell2.innerHTML = String(miktar).replace(",",".");
  cell3.innerHTML = birim;
  cell4.innerHTML = dv;

  } else{
     cell1 = row.insertCell(6);
  cell2 = row.insertCell(7);
  cell3 = row.insertCell(8);
  cell4 = row.insertCell(9);
  cell1.innerHTML = "";
  cell2.innerHTML = "";
  cell3.innerHTML = "";
  cell4.innerHTML = "";
  }

    //
  if (i<= mineraller.length -1) {
     id = String(mineraller[i].NAME).replace(/ /g, "_").replace(")", "_").replace("(", "_").replace(/,/gi, "_").replace(/:/gi, "_").replace("+", "_").replace(/-/gi, "_");
     ad = String(mineraller[i].NAME);
     
    
     miktar = $("#liste"+id+" .vitamin_miktar b").html();
     birim = $("#liste"+id+" .vitamin_miktar strong").html();
     dv = $("#tabloDV"+id+" strong").html();

  cell1 = row.insertCell(10);
  cell2 = row.insertCell(11);
  cell3 = row.insertCell(12);
  cell4 = row.insertCell(13);
  cell1.innerHTML = ad;
  cell2.innerHTML = String(miktar).replace(",",".");
  cell3.innerHTML = birim;
  cell4.innerHTML = dv;

  } else{
    cell1 = row.insertCell(10);
  cell2 = row.insertCell(11);
  cell3 = row.insertCell(12);
  cell4 = row.insertCell(13);
  cell1.innerHTML = "";
  cell2.innerHTML = "";
  cell3.innerHTML = "";
  cell4.innerHTML = "";
  }
    //
  if (i<= aminoasit.length -1) {
     id = String(aminoasit[i].NAME).replace(/ /g, "_").replace(")", "_").replace("(", "_").replace(/,/gi, "_").replace(/:/gi, "_").replace("+", "_").replace(/-/gi, "_");
     ad = String(aminoasit[i].NAME);
     miktar = $("#liste"+id+" .vitamin_miktar b").html();
     birim = $("#liste"+id+" .vitamin_miktar strong").html();
     dv = $("#tabloDV"+id+" strong").html();
     
    /* console.log("excel -" + id + " - " + miktar + " - " + dv);
console.log("exceltr -" + id + " - " + Number(miktar).toFixed(3).replace(".",",")  + " - " + dv);
console.log("excelt -" + id + " - " + Number(miktar).toFixed(3)  + " - " + dv);
console.log("exceln -" + id + " - " + String(miktar).replace(",",".")  + " - " + dv);
console.log("excelp -" + id + " - " + parseFloat(miktar)  + " - " + dv);*/

  cell1 = row.insertCell(14);
  cell2 = row.insertCell(15);
  cell3 = row.insertCell(16);
  cell4 = row.insertCell(17);
  cell1.innerHTML = ad;
  cell2.innerHTML = String(miktar).replace(",",".");
  cell3.innerHTML = birim;
  cell4.innerHTML = dv;

  } else{
    cell1 = row.insertCell(14);
  cell2 = row.insertCell(15);
  cell3 = row.insertCell(16);
  cell4 = row.insertCell(17);
  cell1.innerHTML = "";
  cell2.innerHTML = "";
  cell3.innerHTML = "";
  cell4.innerHTML = "";
  }
      //
  if (i<= fattasit.length -1) {
     id = String(fattasit[i].NAME).replace(/ /g, "_").replace(")", "_").replace("(", "_").replace(/,/gi, "_").replace(/:/gi, "_").replace("+", "_").replace(/-/gi, "_");
     ad = String(fattasit[i].NAME);
     miktar = $("#liste"+id+" .vitamin_miktar b").html();
     birim = $("#liste"+id+" .vitamin_miktar strong").html();
     dv = $("#tabloDV"+id+" strong").html();

  cell1 = row.insertCell(18);
  cell2 = row.insertCell(19);
  cell3 = row.insertCell(20);
  cell4 = row.insertCell(21);
  cell1.innerHTML = ad;
  cell2.innerHTML = String(miktar).replace(",",".");
  cell3.innerHTML = birim;
  cell4.innerHTML = dv;

  } else{
      cell1 = row.insertCell(18);
  cell2 = row.insertCell(19);
  cell3 = row.insertCell(20);
  cell4 = row.insertCell(21);
  cell1.innerHTML = "";
  cell2.innerHTML = "";
  cell3.innerHTML = "";
  cell4.innerHTML = "";
  }
        //
  if (i<= other_data.length -1) {
     id = String(other_data[i].NAME).replace(/ /g, "_").replace(")", "_").replace("(", "_").replace(/,/gi, "_").replace(/:/gi, "_").replace("+", "_").replace(/-/gi, "_");
     ad = String(other_data[i].NAME);
     miktar = $("#liste"+id+" .vitamin_miktar b").html();
     birim = $("#liste"+id+" .vitamin_miktar strong").html();
     dv = $("#tabloDV"+id+" strong").html();

  cell1 = row.insertCell(22);
  cell2 = row.insertCell(23);
  cell3 = row.insertCell(24);
  cell4 = row.insertCell(25);
  cell1.innerHTML = ad;
  cell2.innerHTML =String(miktar).replace(",",".");
  cell3.innerHTML = birim;
  cell4.innerHTML = dv;

  } else{
      cell1 = row.insertCell(22);
  cell2 = row.insertCell(23);
  cell3 = row.insertCell(24);
  cell4 = row.insertCell(25);
  cell1.innerHTML = "";
  cell2.innerHTML = "";
  cell3.innerHTML = "";
  cell4.innerHTML = "";
  }

}

 var wb = XLSX.utils.table_to_book(document.getElementById('NutrientFinder'), {sheet:"Sheet JS"});
        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
        function s2ab(s) {
                        var buf = new ArrayBuffer(s.length);
                        var view = new Uint8Array(buf);
                        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                        return buf;
        }
       saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'NutrientFinder.xlsx');

/*
$("#NutrientFinder").tableExport({
  headers: true
});
              $(".xlsx:first").click();*/
              }




});


    
//$("#test_table").tableExport();
    
}



function exportTableToExcel(tableID, filename = ''){



    var downloadLink;



    var dataType = 'application/vnd.ms-excel';



    var tableSelect = document.getElementById(tableID);



    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');



    



    // Specify file name



    filename = filename?filename+'.xls':'excel_data.xls';



    



    // Create download link element



    downloadLink = document.createElement("a");



    



    document.body.appendChild(downloadLink);



    



    if(navigator.msSaveOrOpenBlob){



        var blob = new Blob(['\ufeff', tableHTML], {



            type: dataType



        });



        navigator.msSaveOrOpenBlob( blob, filename);



    }else{



        // Create a link to the file



        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;



    



        // Setting the file name



        downloadLink.download = filename;



        



        //triggering the function



        downloadLink.click();



    }



}






/*
!function(a,b,c,d){function e(b,c){this.element=b,this.settings=a.extend({},h,c),this._defaults=h,this._name=g,this.init()}function f(a){return(a.filename?a.filename:"table2excel")+(a.fileext?a.fileext:".xls")}var g="table2excel",h={exclude:".noExl",name:"Table2Excel"};e.prototype={init:function(){var b=this,c='';b.template={head:'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'+c+"<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>",sheet:{head:"<x:ExcelWorksheet><x:Name>",tail:"</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>"},mid:"</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>",table:{head:"<table>",tail:"</table>"},foot:"</body></html>"},b.tableRows=[],a(b.element).each(function(c,d){var e="";a(d).find("tr").not(b.settings.exclude).each(function(b,c){e+="<tr>"+a(c).html()+"</tr>"}),b.tableRows.push(e)}),b.tableToExcel(b.tableRows,b.settings.name,b.settings.sheetName)},tableToExcel:function(d,e,g){var h,i,j,k=this,l="";if(k.uri="data:application/vnd.ms-excel;base64,",k.base64=function(a){return b.btoa(unescape(encodeURIComponent(a)))},k.format=function(a,b){return a.replace(/{(\w+)}/g,function(a,c){return b[c]})},g="undefined"==typeof g?"Sheet":g,k.ctx={worksheet:e||"Worksheet",table:d,sheetName:g},l=k.template.head,a.isArray(d))for(h in d)l+=k.template.sheet.head+g+h+k.template.sheet.tail;if(l+=k.template.mid,a.isArray(d))for(h in d)l+=k.template.table.head+"{table"+h+"}"+k.template.table.tail;l+=k.template.foot;for(h in d)k.ctx["table"+h]=d[h];if(delete k.ctx.table,"undefined"!=typeof msie&&msie>0||navigator.userAgent.match(/Trident.*rv\:11\./))if("undefined"!=typeof Blob){l=[l];var m=new Blob(l,{type:"text/html"});b.navigator.msSaveBlob(m,f(k.settings))}else txtArea1.document.open("text/html","replace"),txtArea1.document.write(k.format(l,k.ctx)),txtArea1.document.close(),txtArea1.focus(),sa=txtArea1.document.execCommand("SaveAs",!0,f(k.settings));else i=k.uri+k.base64(k.format(l,k.ctx)),j=c.createElement("a"),j.download=f(k.settings),j.href=i,c.body.appendChild(j),j.click(),c.body.removeChild(j);return!0}},a.fn[g]=function(b){var c=this;return c.each(function(){a.data(c,"plugin_"+g)||a.data(c,"plugin_"+g,new e(this,b))}),c}}(jQuery,window,document);

*/

function excel_export() {



   var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";

      var textRange; var j=0;

          tab = document.getElementById('excelexporttable');

      for(j = 0 ; j < tab.rows.length ; j++) 

           {     

                tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";

                //tab_text=tab_text+"</tr>";

           }

      tab_text=tab_text+"</table>";

      var ua = window.navigator.userAgent;

      console.log("User agent " + ua);

      var msie = ua.indexOf("Edge "); 

                   //if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

          console.log(tab_text);

           if (ua.match(/Edge/))

                    {

            console.log("Edge browser detected");

                           // txtArea1.document.open("txt/html","replace");

                           // txtArea1.document.write(tab_text);

                           // txtArea1.document.close();

                           // txtArea1.focus(); 

                           // sa=txtArea1.document.execCommand("SaveAs",true,"filename.xls");

                           

                            var blob = new Blob([tab_text], {type: 'data:application/vnd.ms-excel'});

                            window.navigator.msSaveBlob(blob, 'NutrientFinder.xls');



        

         } else{



 $("#excelexporttable").table2excel({

    exclude: ".noExl",

    name: "NutrientFinder",

    filename: "NutrientFinder1.xls",   

    exclude_img: true,

    exclude_links: true,

    exclude_inputs: true

  });

          

 }



 

         /* $("#excelexporttable").table2excel({   



    name: "NutrientFinder",



    filename: "NutrientFinder.xls", // do include extension



    preserveColors: false // set to true if you want background colors and font colors preserved



}); */







}



