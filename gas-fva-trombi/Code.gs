function getGroupes() {
    var dataSource = SpreadsheetApp.openById(getParam(__PROPERTY__.file)).getSheetByName(__DATA_TAB__);
    var mGroupes = dataSource.getRange("AT9:BD9").getValues()[0];
    var _groupes = [];


    for (var i = 0; i < mGroupes.length; i++) {
        var sGroupe = mGroupes[i];

        if (sGroupe === '') continue;
        else _groupes.push(sGroupe);
    }
    return _groupes;
}

function _getTags(adherent, groupes) {
    var tags = '';
    for (var i = eColumns.autre; i < 56; i++) {
        var nGroupe = groupes[i - 45];
        var nVal = adherent[i];
        if (adherent[i].toUpperCase() == gas_true) {
            if (tags === '') tags = groupes[i - 45];
            else tags = tags + ', ' + groupes[i - 45];
        }
    }
    return tags;
}

function transTelephone(numero) {
    if (numero.length !== 10) numero = '0' + numero;
    return numero.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}