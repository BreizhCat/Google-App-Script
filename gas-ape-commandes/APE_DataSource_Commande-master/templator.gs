function setEmptyTemplate() {
    /* Access to different tab */
    var oSheetGroupe = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Groupe_Scolaire");
    var oSheetClasse = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Classes");
    var oSheetListes = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Listes");
    /* Access to data from different tab */
    var oRangeGroupe = oSheetGroupe.getRange(2, 1, oSheetGroupe.getLastRow(), oSheetGroupe.getLastColumn()).getValues();
    var oRangeClasse = oSheetClasse.getRange(2, 1, oSheetClasse.getLastRow(), oSheetClasse.getLastColumn()).getValues();
    var oRangeListes = oSheetListes.getRange(2, 1, oSheetListes.getLastRow(), oSheetListes.getLastColumn()).getValues();
    /* Instantiante object the next step */
    var oDocTemplate = DriveApp.getFileById(getParam("templateBon"));
    var oDriveFolder = DriveApp.getFolderById(getParam("templateFolder"));
    /* Style definition */
    var oTableStyle = {};
    oTableStyle[DocumentApp.Attribute.FONT_SIZE] = 9;
    oTableStyle[DocumentApp.Attribute.FONT_FAMILY] = DocumentApp.FontFamily.UBUNTU;
    oTableStyle[DocumentApp.Attribute.VERTICAL_ALIGNMENT] = DocumentApp.VerticalAlignment.CENTER;
    var oTableStyleAlt = {};
    oTableStyleAlt[DocumentApp.Attribute.FONT_SIZE] = 9;
    oTableStyleAlt[DocumentApp.Attribute.FONT_FAMILY] = DocumentApp.FontFamily.UBUNTU;    
    oTableStyleAlt[DocumentApp.Attribute.VERTICAL_ALIGNMENT] = DocumentApp.VerticalAlignment.CENTER;
    oTableStyleAlt[DocumentApp.Attribute.BACKGROUND_COLOR] = "#DDDDDD";
  
    /* Create text table for later */
    var tabGroupe = [];
    for (var idxGroupe = 0; idxGroupe < oRangeGroupe.length; idxGroupe++) {
        var oGroupe = oRangeGroupe[idxGroupe];
        if (oGroupe[enumGroupe.id] == "" || oGroupe[enumGroupe.active] == false) continue;

        tabGroupe[oGroupe[enumGroupe.id]] = oGroupe[enumGroupe.text];   
    }
   
    /* Get only active class */
    var tabClasse = [];
    for (var idxClasse = 0; idxClasse < oRangeClasse.length; idxClasse++) {
        var oClasse = oRangeClasse[idxClasse];
        if (oClasse[enumClasse.active] == "" || oClasse[enumClasse.classe] == "") continue;

        tabClasse[oClasse[enumClasse.groupe] + oClasse[enumClasse.classe]] = true;
    }

    /* Init & generate documents */
    var sCurrentClasse = '';
    var oNewDoc = '';
    var iArticle = 0;
    var bAlter = false;
    
    for (var idxFourn = 0; idxFourn < oRangeListes.length; idxFourn++) {
        
        var oNewDocContent = '';
        
        var oFourniture = oRangeListes[idxFourn];
        var sBreakBon = oFourniture[enumFourn.groupe] + oFourniture[enumFourn.classe];
        if (oFourniture[enumFourn.groupe] == "") continue;

        if (tabClasse[oFourniture[enumFourn.groupe] + oFourniture[enumFourn.classe]] == undefined) continue;

        if (sCurrentClasse != sBreakBon) {
            if (oNewDoc !== '') {
                if (bAlter) oNewDoc.getBody().replaceText('{alternative}', getParam("AltText"));
                else        oNewDoc.getBody().replaceText('{alternative}', '');
              
                oNewDoc.saveAndClose();
                bAlter = false;
                var blobAttach = oNewDoc.getAs("application/pdf");
                oDriveFolder.createFile(blobAttach);
                DriveApp.getFileById(oNewDoc.getId()).setTrashed(true);
                SpreadsheetApp.getActiveSpreadsheet().toast("Groupe " + oRangeListes[idxFourn-1][enumFourn.groupe] + " / Classe "+ oRangeListes[idxFourn-1][enumFourn.classe]+" générée", "Bon généré !")
            }
            sCurrentClasse = sBreakBon;
            var oNewFile = oDocTemplate.makeCopy(oFourniture[enumFourn.groupe] + "_" + oFourniture[enumFourn.classe]);

            oNewDoc = DocumentApp.openById(oNewFile.getId());
            oNewDocContent = oNewDoc.getBody();

            oNewDocContent.replaceText("{classe}", oFourniture[enumFourn.classe]);
            oNewDocContent.replaceText("{ecole}", tabGroupe[oFourniture[enumFourn.groupe]]);
            oNewDocContent.replaceText("{frais}", parseFloat(getParam("frais")).toFixed(2) + " €");
            var oDocTable = oNewDocContent.getTables()[1];
            iArticle = 0;
        }

        var oTableRow = oDocTable.insertTableRow(iArticle + 1);
        var oCurrStyle = oFourniture[enumFourn.alt] == true ? oTableStyleAlt : oTableStyle;
        
        bAlter = (bAlter?true:oFourniture[enumFourn.alt]);
                
        oTableRow.appendTableCell(oFourniture[enumFourn.ref]).setAttributes(oCurrStyle).setPaddingTop(0).setPaddingBottom(0);
        oTableRow.appendTableCell(oFourniture[enumFourn.text]).setAttributes(oCurrStyle).setPaddingTop(0).setPaddingBottom(0);

        oTableRow.appendTableCell(parseFloat(oFourniture[enumFourn.pu]).toFixed(2) + " €").setAttributes(oCurrStyle).setPaddingTop(0).setPaddingBottom(0);
        oTableRow.appendTableCell(oFourniture[enumFourn.qte]).setAttributes(oCurrStyle).setPaddingTop(0).setPaddingBottom(0);
        oTableRow.appendTableCell("").setAttributes(oCurrStyle).setPaddingTop(0).setPaddingBottom(0);
        oTableRow.appendTableCell("").setAttributes(oCurrStyle).setPaddingTop(0).setPaddingBottom(0);
        iArticle++;
    }

  if (bAlter) oNewDoc.getBody().replaceText('{alternative}', getParam("AltText"));
  else        oNewDoc.getBody().replaceText('{alternative}', '');
  
  oNewDoc.saveAndClose();

  var blobAttach = oNewDoc.getAs("application/pdf");
  oDriveFolder.createFile(blobAttach);
  DriveApp.getFileById(oNewDoc.getId()).setTrashed(true);
}