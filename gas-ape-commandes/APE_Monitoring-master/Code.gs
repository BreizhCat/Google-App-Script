function doGet(param) {
  var oSs = SpreadsheetApp.openById(getParam('dataSource'));
  var oSheet = oSs.getSheetByName("Commandes");
  var oStat = oSs.getSheetByName("Statistiques");
  var oData = oSheet.getRange(1, 1, oSheet.getLastRow(), oSheet.getLastColumn()).getValues();
  
  var output = HtmlService.createTemplateFromFile("main");
  var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle("Administration des Commandes groupées APE");
  var content = '';
  var rowCount = 0;
  for(var i = 1; i < oData.length; i++) {
    var currentData = oData[i];
    //if (rowCount == 0) content += '<div class="card-group">';
    rowCount++;
    var tooltip = '<p class=\'text-left\'><span class=\'fa fa-envelope\'></span>&nbsp;'+currentData[7]+'</p>'+
      '<p class=\'text-left\'><span class=\'fa fa-phone-square\'></span>&nbsp;'+((currentData[6]).toString().charAt(0)=='0'?currentData[6]:'0'+currentData[6])+'</p>';
    content += '<div class="card text-center commande text-white '+(currentData[9]==''?'bg-secondary':'bg-info')+' mb-3" style="max-width: 20rem;" id="'+currentData[0]+
               '"><div class="card-header ">'+currentData[0]+'&nbsp;<span class="fa fa-info-circle" data-toggle="tooltip" data-placement="top" data-html="true" title="'+ tooltip +'"></span></div>' +
               '<div class="card-body"><h6 class="card-title">'+currentData[5]+' '+currentData[4]+'</h6>' +
               '<p class="card-text">Classe de réception <br />'+currentData[1]+' - '+currentData[3]+'</p>'+
               '</div>'+
               '<div class="card-footer text-center"><a href="#" id="link_'+currentData[0]+'" class="btn btn-primary '+(currentData[9]==''?'':'disabled')+'" onclick="return paid(\''+currentData[0]+'\');">'+
                (currentData[9]==''?'Payer':'Payé')+'</a></div></div>';
  // if (rowCount == 4) { content += '</div>'; rowCount = 0; }
  }
     
  html.setContent(html.getContent().replace('{content}', content));
  html.setContent(html.getContent().replace('{paye}', oStat.getRange(5,2).getValue()));
  html.setContent(html.getContent().replace('{due}', oStat.getRange(6,2).getValue()));
  return html;
}

function include(filename) { return HtmlService.createTemplateFromFile(filename).evaluate().getContent();}

function getParam(name) { return PropertiesService.getScriptProperties().getProperty(name); }

function updatePaid(ref) {
  var oSs = SpreadsheetApp.openById(getParam('dataSource'));
  var oSheet = oSs.getSheetByName("Commandes");
  var oData = oSheet.getRange(1, 1, oSheet.getLastRow(), oSheet.getLastColumn()).getValues();  
  
  for(var i = 0; i < oData.length; i++) {
   
   if (oData[i][0] === ref) oSheet.getRange(i+1, 10).setValue('Oui');
  }
  
  return ref;
}
