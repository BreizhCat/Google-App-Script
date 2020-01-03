function doGet(e) {
  var output = HtmlService.createTemplateFromFile("commande");
  var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle(enumTexte.htmlTitle).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

function include(filename) { return HtmlService.createTemplateFromFile(filename).evaluate().getContent(); }

function getParam(name) { return PropertiesService.getScriptProperties().getProperty(name); }

function updateGroupeList( ) {
  var lstGroupe = dataSource.getActiveGroupe();
  
  if (lstGroupe.length > 0) return lstGroupe;
  else throw enumError.ERR001;
}

function updateClassList(groupe) {
 var lstClasses = dataSource.getActiveClasse4Groupe(groupe); 
 
  if (lstClasses.length > 0) return lstClasses;
  else throw enumError.ERR002;
}

function updateFournList(groupe, classe) {
  var lstFournitures = dataSource.getFournitures(groupe, classe);
  var oCusto = dataSource.getCusto();
  if(lstFournitures.length > 1) return [lstFournitures, oCusto['frais'], oCusto['header']];
  else throw enumError.ERR003;
}

function updateCurrentList(groupe) {
 var lstCurrent = dataSource.getCurrentClasses(groupe);
  
  if (lstCurrent.length > 0) return lstCurrent;
  else throw enumError.ERR004;
}

function validateOrder(rawData) {
  var order =  (new Date().getTime()).toString(36); 
  var docURL = dataMonitoring.setNewOrder(order, rawData);
  return [order, docURL];
}

function getDocumentasHTML(documentID, clean) {
 var exportURL = enumConst.baseURL + getParam(documentID) + enumConst.exportMode;
 var authParam = {
          method      : "get",
          headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
          muteHttpExceptions : true,
        };
  
 var rawHTML = UrlFetchApp.fetch(exportURL, authParam).getContentText();
  if(clean == true) {
  var regExp = /(.*?\<style.*?\>).*?(\..*?\{.*?\}).*?(<\/style>.*)/g;
 var rawCSS = rawHTML.replace(regExp, '$2');
 rawHTML = rawHTML.replace(regExp, '$1$3');
  }
 return rawHTML;
}

function refreshData(rawData) {
 var oCache = CacheService.getUserCache()
 oCache.put("nom", rawData.nom);
 oCache.put("prenom", rawData.prenom);
 oCache.put("mail", rawData.mail);
 oCache.put("tel", rawData.tel);
 oCache.put("isRefreshed", rawData.isRefreshed);  
}

function getCacheKey(key) {
 var sValue = CacheService.getUserCache().get(key);
 CacheService.getUserCache().remove(key);
 return sValue;
}