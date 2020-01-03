function saveConfigToDB(id_file, id_folder) {
    setParam(__PROPERTY__.file, id_file);
    setParam(__PROPERTY__.image, id_folder);
}

function getConfigFromDB() {
    var conf = {};

    conf.file = getParam(__PROPERTY__.file);
    conf.img = getParam(__PROPERTY__.image);

    return conf;
}

function getBadisteInfo(licence, id) {
    var sUrl = 'http://badiste.fr/resultat-joueur-badminton/--' + licence + '.html';
    var sContent = UrlFetchApp.fetch(sUrl).getContentText();
    var sRegex = /([NRDP]{1}[0-9]{1,2}|NC)/g;
    var sMatch = sContent.match(sRegex);
    return { id: id, single: sMatch[2], double: sMatch[3], mixte: sMatch[4] };
}

function checkPasswordFromDB(value) {
  return (__PASSWORD__.indexOf(value)>-1?true:false);
}

function getAdherentsFromDB() {
    var dataSource = SpreadsheetApp.openById(getParam(__PROPERTY__.file)).getSheetByName(__DATA_TAB__);
    var mAdherents = dataSource.getRange("A10:BS999").getValues();
    var oContent = DriveApp.getFolderById(getParam(__PROPERTY__.image)).getFiles();
    var mGroupes = getGroupes();
    var mFiles = [];

    /* Récupération des informations liées aux fichiers */
    while (oContent.hasNext()) {
        var oFile = oContent.next();
        var sFileName = oFile.getName().substr(0, oFile.getName().indexOf('.jpg'));
        mFiles[sFileName] = "https://drive.google.com/uc?export=view&id=" + oFile.getId();
    }

    var _adherents = []
    var idxAdh = 0;
    for (var i = 0; i < mAdherents.length; i++) {
        var oAdherent = mAdherents[i];
        if (oAdherent[eColumns.complet] != "") {
            var oAdh = {};
            var dateBirth = oAdherent[eColumns.birth];
            
            oAdh.idx        = idxAdh++;
            oAdh.isFull     = (oAdherent[eColumns.complet] == "INCOMPLET" ? false : true);
            oAdh.isReduc    = (oAdherent[eColumns.type] == "Sans emploi / etudiant"?true:false);
            oAdh.prenom     = oAdherent[eColumns.prenom];
            oAdh.nom        = oAdherent[eColumns.nom];
            oAdh.age        = oAdherent[eColumns.age];
            oAdh.rue        = oAdherent[eColumns.rue];
            oAdh.cp         = oAdherent[eColumns.cp];
            oAdh.city       = oAdherent[eColumns.city];            
            oAdh.birth      = dateBirth.getDate().pad(2) + "/" + (dateBirth.getMonth()+1).pad(2) + "/" + dateBirth.getFullYear();
            oAdh.private    = (oAdherent[eColumns.photo].toUpperCase() != gas_true ? true : false);
            oAdh.src        = mFiles[oAdh.nom + " " + oAdh.prenom];
            oAdh.licence    = parseInt(oAdherent[eColumns.licence]).pad(8);
            oAdh.hasLicence = oAdherent[eColumns.licence] == '' ? false : true;
            oAdh.isAdulte   = ((oAdherent[eColumns.jeune1].toUpperCase() == gas_true || oAdherent[eColumns.jeune2].toUpperCase() == gas_true)?false:true);          
            oAdh.data       = {
              cotisation:(oAdherent[eColumns.cotis].toString().toUpperCase()  != gas_true?fa.icon_false:fa.icon_true),
              fva:       (oAdherent[eColumns.fva].toString().toUpperCase()    != gas_true?fa.icon_false:fa.icon_true),
              ffbad:     (oAdherent[eColumns.ffbad].toString().toUpperCase()  != gas_true?fa.icon_false:fa.icon_true),
              certif:    (oAdherent[eColumns.certif].toString().toUpperCase() != gas_true?fa.icon_false:fa.icon_true),
              photo:     (oAdherent[eColumns.photo].toString().toUpperCase()  != gas_true?fa.icon_false:fa.icon_true),
              parent:    (oAdherent[eColumns.parent].toString().toUpperCase() != gas_true?fa.icon_false:fa.icon_true),
              justif :   (oAdherent[eColumns.justif].toString().toUpperCase() != gas_true?fa.icon_false:fa.icon_true),
            };


            if (!oAdh.isAdulte) {
                oAdh.parent1 = oAdherent[eColumns.email3];
                oAdh.parent2 = oAdherent[eColumns.email4];
            }

            if (oAdherent[eColumns.Urg1Nom] != '')
                oAdh.urg1 = {
                    nom: oAdherent[eColumns.Urg1Nom] + ' ' + oAdherent[eColumns.Urg1Prenom],
                    tel: transTelephone(oAdherent[eColumns.Urg1Tel])
                };
            else oAdh.urg1 = { nom: '', tel: '' };

            if (oAdherent[eColumns.Urg2Nom] != '')
                oAdh.urg2 = {
                    nom: oAdherent[eColumns.Urg2Nom] + ' ' + oAdherent[eColumns.Urg2Prenom],
                    tel: transTelephone(oAdherent[eColumns.Urg2Tel])
                };
            else oAdh.urg2 = { nom: '', tel: '' };

            if (oAdherent[eColumns.Urg3Nom] != '')
                oAdh.urg3 = {
                    nom: oAdherent[eColumns.Urg3Nom] + ' ' + oAdherent[eColumns.Urg3Prenom],
                    tel: transTelephone(oAdherent[eColumns.Urg3Tel])
                };
            else oAdh.urg3 = { nom: '', tel: '' };

            if (oAdherent[eColumns.tel] != '') oAdh.tel = transTelephone(oAdherent[eColumns.tel]);
            if (oAdherent[eColumns.mob] != '') oAdh.mob = transTelephone(oAdherent[eColumns.mob]);

            oAdh.tag = _getTags(oAdherent, mGroupes);
            if (oAdh.tag.length == '0') oAdh.tag = "Adherents";
            else oAdh.tag = oAdh.tag + ",Adherents";

            if (oAdh.isFull == false) oAdh.tag = oAdh.tag + ",Incomplets";
            if (oAdh.private == true) oAdh.tag = oAdh.tag + ",Diffusion";
          
            oAdh.tags = oAdh.tag.split(',');
            
            oAdh.isFull = (oAdherent[eColumns.complet] == 'INCOMPLET' ? false : true);

            if (oAdh.src == undefined) {
                oAdh.src = mFiles["unknown_" + oAdherent[eColumns.sexe]];
                oAdh.tag = oAdh.tag + ",Manquants";
            }
            _adherents.push(oAdh);
        }
    }
    return _adherents;
}

function getGroupesFromDB() {
    var dataSource = SpreadsheetApp.openById(getParam(__PROPERTY__.file)).getSheetByName(__DATA_TAB__);
    var mGroupes = dataSource.getRange("AT9:BD999").getValues();
    var _groupes = [];

    var mGroupesTitle = mGroupes[0];
    for (var i = 0; i < mGroupesTitle.length; i++) {
        var sGroupe = mGroupesTitle[i];

        if (sGroupe === '') continue;
        else {
            // Check if at least one adherent is in this groupe
            for (var j = 1; j < mGroupes.length; j++) {
              if (mGroupes[j][i].toUpperCase() == gas_true) {
                    _groupes.push(sGroupe);
                    break;
                }
            }
        }
    }
    _groupes.push('Incomplets');
    _groupes.push('Diffusion');
    _groupes.push('Manquants');
    return _groupes;
}