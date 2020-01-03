function doGet(param) {
    var output = HtmlService.createTemplateFromFile("main");
    var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle("Administration des Commandes groupées APE").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);;

    html.setContent(html.getContent().replace('{content}', getOrders()));
    html.setContent(html.getContent().replace('{stats}', getStats()));
    return html;
}

function include(filename) {
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

function getParam(name) {
    return PropertiesService.getScriptProperties().getProperty(name);
}

function updatePaid(ref) {
    var oSs = SpreadsheetApp.openById(getParam('dataSource'));
    var oSheet = oSs.getSheetByName("Commandes");
    var oData = oSheet.getRange(1, 1, oSheet.getLastRow(), oSheet.getLastColumn()).getValues();

    for (var i = 0; i < oData.length; i++) {

        if (oData[i][0] === ref) oSheet.getRange(i + 1, 10).setValue('Oui');
    }

    return ref;
}

function updateIssue(ref) {
    var oSs = SpreadsheetApp.openById(getParam('dataSource'));
    var oSheet = oSs.getSheetByName("Commandes");
    var oData = oSheet.getRange(1, 1, oSheet.getLastRow(), oSheet.getLastColumn()).getValues();

    for (var i = 0; i < oData.length; i++) {

        if (oData[i][0] === ref) {
            if (oSheet.getRange(i + 1, 11).getValue() == 'Oui')
                oSheet.getRange(i + 1, 11).setValue('');
            else
                oSheet.getRange(i + 1, 11).setValue('Oui');

        }
    }

    return ref;
}

function getStats() {
    var oSs = SpreadsheetApp.openById(getParam('dataSource'));
    var oStat = oSs.getSheetByName("Statistiques");
    var stats = '<tr class="thead-dark"><th class="text-center">&nbsp;</th><th class="text-center">Louise Michel</th><th class="text-center">Jules Ferry</th><th class="text-center">Total</th></tr>';
    stats += '<tr><td>Nombre de commandes</td><td class="text-center">' + oStat.getRange("F4").getValue() + ' (' + (100 * oStat.getRange("I4").getValue()).toFixed(2) + ' %)</td><td class="text-center">' + oStat.getRange("G4").getValue() + ' (' + (100 * oStat.getRange("J4").getValue()).toFixed(2) + ' %)</td><td class="text-center">' + oStat.getRange("H4").getValue() + '</td></tr>' +
        '<tr><td>Commandes payée</td><td class="text-center">' + oStat.getRange("F5").getValue() + ' (' + (100 * oStat.getRange("I5").getValue()).toFixed(2) + ' %)</td><td class="text-center">' + oStat.getRange("G5").getValue() + ' (' + (100 * oStat.getRange("J5").getValue()).toFixed(2) + ' %)</td><td class="text-center">' + oStat.getRange("H5").getValue() + ' (' + (100 * oStat.getRange("K5").getValue()).toFixed(2) + ' %)</td></tr>' +
        '<tr><td>Commandes en ligne</td><td class="text-center">' + oStat.getRange("F6").getValue() + ' (' + (100 * oStat.getRange("I6").getValue()).toFixed(2) + ' %)</td><td class="text-center">' + oStat.getRange("G6").getValue() + ' (' + (100 * oStat.getRange("J6").getValue()).toFixed(2) + ' %)</td><td class="text-center">' + oStat.getRange("H6").getValue() + ' (' + (100 * oStat.getRange("K6").getValue()).toFixed(2) + ' %)</td></tr>' +
        '<tr><td>Commandes papier</td><td class="text-center">' + oStat.getRange("F7").getValue() + ' (' + (100 * oStat.getRange("I7").getValue()).toFixed(2) + ' %)</td><td class="text-center">' + oStat.getRange("G7").getValue() + ' (' + (100 * oStat.getRange("J7").getValue()).toFixed(2) + ' %)</td><td class="text-center">' + oStat.getRange("H7").getValue() + ' (' + (100 * oStat.getRange("K7").getValue()).toFixed(2) + ' %)</td></tr>';
    return stats;
}

function getOrders() {
    var oSs = SpreadsheetApp.openById(getParam('dataSource'));
    var oSheet = oSs.getSheetByName("Commandes");
    var oData = oSheet.getRange(1, 1, oSheet.getLastRow(), oSheet.getLastColumn()).getValues();

    var content = '<tr class="thead-dark table-dark">' +
        '<th class="text-center">Statut</th>' +
        '<th class="text-center"><i class="text-center fa fa-info-circle"></i></th>' +
        '<th class="text-center" onClick="sortTable(2);">Référence</th>' +
        '<th class="text-center" onClick="sortTable(3);">Groupe</th>' +
        '<th class="text-center" onClick="sortTable(4);">Classe</th>' +
        '<th class="text-center" onClick="sortTable(5);">Classe Liv.</th>' +
        '<th class="text-left" onClick="sortTable(6);">Nom</th>' +
        '<th class="text-left" onClick="sortTable(7);">Prénom</th>' +
        '<th class="text-center" onClick="sortTable(9);">Prix</th>' +
        '<th class="text-center"><i class="far fa-file-pdf"></i></th>' +
        '<th class="text-center"><i class="far fa-angry">&nbsp;?</i></th>' +
        '</tr>';
    /* Recherche lien fichier suivi commandes */
    var oFolder = DriveApp.getFolderById(getParam('folderBons')).getFiles();
    var tabFiles = [];

    while (oFolder.hasNext()) {
        var oFile = oFolder.next();
        var sFileName = oFile.getName();
        var sRef = (sFileName.split('_')[4]).split('.')[0];
        tabFiles[sRef] = oFile.getUrl();
    }


    for (var i = 1; i < oData.length; i++) {
        var currentData = oData[i];
        content += '<tr class="commande">' +
            '<td class="text-center align-middle"><a href="#" id="link_' + currentData[0] + '" class="btn  ' + (currentData[9] == '' ? 'btn-primary' : 'btn-success disabled') + '" onclick="return paid(\'' + currentData[0] + '\');">' +
            (currentData[9] == '' ? 'A payer' : 'Payé') + '</a></td>' +
            '<td class="text-center align-middle"><i class="' + (currentData[7] == "aussonneape@gmail.com" ? 'far fa-paper-plane' : 'fab fa-internet-explorer') + '" title="' + (currentData[7] == "aussonneape@gmail.com" ? 'Commande papier' : 'Commande en ligne') + '"></i></td>' +
            '<td class="text-center align-middle">' + currentData[0] + '</td>' +
            '<td class="text-center align-middle">' + currentData[1] + '</td>' +
            '<td class="text-center align-middle">' + currentData[2] + '</td>' +
            '<td class="text-left align-middle">' + currentData[3] + '</td>' +
            '<td class="text-left align-middle">' + currentData[4].toUpperCase() + '</td>' +
            '<td class="text-left align-middle">' + currentData[5].charAt(0).toUpperCase() + currentData[5].slice(1).toLowerCase() + '</td>' +
            '<td class="text-right align-middle">' + currentData[8].toFixed(2) + ' €</td>' +
            '<td class="text-center align-middle"><a target="_blank" href="' + tabFiles[currentData[0]] + '"><i class="far fa-file-pdf" title="Afficher le bon de commande"></i></a></td>' +
            '<td class="text-center align-middle"><a href="#" id="issue_' + currentData[0] + '" class="btn  ' + (currentData[10] == '' ? 'btn-success' : 'btn-warning') + '" onclick="return issue(\'' + currentData[0] + '\');">' + (currentData[10] == '' ? '' : '!') + '</tr>';
    }
    return content;
}