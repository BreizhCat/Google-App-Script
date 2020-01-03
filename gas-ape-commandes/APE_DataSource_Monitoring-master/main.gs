function onOpen() {
  SpreadsheetApp.getUi().createMenu("Menu APE")
  .addItem('Vider...', "clearOrder")
  .addToUi();
}

function clearOrder () {
  var oCommande = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Commandes");
  var oListe = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Liste");
  
  oListe.getRange(2, 1, oListe.getLastRow(), oListe.getLastColumn()).clear();
  oCommande.getRange(2, 1, oListe.getLastRow(), oListe.getLastColumn()).clear();
}