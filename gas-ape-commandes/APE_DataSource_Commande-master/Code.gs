function onOpen() {
  SpreadsheetApp.getUi().createMenu("Menu APE")
  .addItem('Paramétrage...', "setCusto")
  .addItem('Générer bons...', 'setEmptyTemplate')
  .addToUi();
}

function getParam(name) { return PropertiesService.getScriptProperties().getProperty(name); }
function setParam(name, value) { PropertiesService.getScriptProperties().setProperty(name, value);}

function setCusto() {
  var oHTML = HtmlService.createHtmlOutputFromFile("settings");
  var oContent = oHTML.getContent();
  var oSs = SpreadsheetApp.getActiveSpreadsheet();  
  var oTheme = oSs.getSheetByName("Display").getRange("A:A").getValues(); 
  
  var sCurrentTheme = getParam("themeID");
  
  var sTexte = "";
  for(var i = 1; i < oTheme.length; i++) {
    if (oTheme[i][0] != "") {
      if (oTheme[i][0] === sCurrentTheme)
        sTexte += "<option value=\""+oTheme[i][0]+"\" selected>"+oTheme[i][0]+"</option>";
      else
        sTexte += "<option value=\""+oTheme[i][0]+"\">"+oTheme[i][0]+"</option>";
    } 
  }
  
  var sHeader = getParam("headerTable").split(';');
  var oHeader = '';
  for(var i = 0; i < sHeader.length; i++) {
    oHeader += '<li class="ui-state-default"><div class="input-group mb-3">' +
               '<div class="input-group-prepend">'+
               '<div class="input-group-prepend"><span class="input-group-text fa fa-bars"></span></div>'+
               '<input class="form-control" type="text" value="'+sHeader[i]+'" name="input"><div class="input-group-append">'+
			   '<span class="input-group-text fa fa-trash" onclick="removeRecord(this);"></span></div></div></li>';
  }
  
  Logger.log(getParam("headerTable"));
  oContent = oContent.replace("{theme_option}", sTexte);  
  oContent = oContent.replace("{frais}", parseFloat(getParam("frais")));
  oContent = oContent.replace("{column}", oHeader);
  
  var oSideBar = HtmlService.createTemplate(oContent);
  SpreadsheetApp.getUi().showSidebar(oSideBar.evaluate().setTitle("Paramétrage")); 
}

function responseForm(e) {
  
  setParam("frais", e.frais);
  setParam("themeID", e.theme);
  var sCols = e.input.join(';');
  setParam("headerTable", sCols);
  
  
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Paramétrage").getRange("B1").setValue(e.theme);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Paramétrage").getRange("B3").setValue(sCols);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Paramétrage").getRange("B2").setValue(parseFloat(e.frais)); 
  
  SpreadsheetApp.getActiveSpreadsheet().toast("Configuration sauvegardée !");
}