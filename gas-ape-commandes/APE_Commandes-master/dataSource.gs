var dataSource = new _dataSource();

function _dataSource() {
    if (this.pointer !== 'object') {
        var pointer2;
        /* Open file on Drive */
        this.pointer = SpreadsheetApp.openById(getParam("dataSourceID"));
        /* Create pointer on each tab */
        this.groupe = this.pointer.getSheetByName("Groupe_Scolaire");
        this.article = this.pointer.getSheetByName("Listes");
        this.classes = this.pointer.getSheetByName("Classes");
        this.current = this.pointer.getSheetByName("Classes_Courantes");
        this.param = this.pointer.getSheetByName("Paramétrage");
        this.display = this.pointer.getSheetByName("Display");
    }
    /* Methods */
    this._getHeaders = function() {
        var lstCol = this.param.getRange("D1:D6").getValues();
        var outputCol = [];

        for (var i = 0; i < lstCol.length; i++) {
            if (lstCol[i][0] != "")
                outputCol.push(lstCol[i][0]);
        }
        return outputCol;
    };

    this.getActiveGroupe = function() {
        var outputGroupe = [];
        var lstGroupe = this.groupe.getRange(2, 1, this.groupe.getLastRow() - 1, this.groupe.getLastColumn()).getValues();

        for (var i = 0; i < lstGroupe.length; i++) {
            if (lstGroupe[i][2] == true)
                outputGroupe.push(lstGroupe[i]);
        }
        return outputGroupe;
    };

    this.getActiveClasse4Groupe = function(groupe) {
        var outputClasses = [];
        var lstClasses = this.classes.getRange(2, 1, this.classes.getLastRow() - 1, this.classes.getLastColumn()).getValues();

        for (var i = 0; i < lstClasses.length; i++) {
            if (lstClasses[i][2] === true && lstClasses[i][0] == groupe)
                outputClasses.push(lstClasses[i]);
        }
        return outputClasses;
    };

    this.getFournitures = function(groupe, classe) {
        var outputFourniture = [];
        var lstFourniture = this.article.getRange(1, 1, this.article.getLastRow(), this.article.getLastColumn()).getValues();

        for (var i = 0; i < lstFourniture.length; i++) {
            if (lstFourniture[i][0] == groupe && lstFourniture[i][1] == classe) outputFourniture.push(lstFourniture[i]);
        }
        return outputFourniture;
    };

    this.getCurrentClasses = function(groupe) {
        var outputCurrent = [];
        var lstCurrent = this.current.getRange(2, 1, this.current.getLastRow() - 1, this.current.getLastColumn()).getValues();
        for (var i = 0; i < lstCurrent.length; i++) {
            if (lstCurrent[i][0] == groupe)
                outputCurrent.push(lstCurrent[i]);
        }
        return outputCurrent;
    }

    this.getCusto = function() {
        var oCusto = [];

        oCusto['frais'] = this.param.getRange("B2").getValue();
        oCusto['header'] = this.param.getRange("B3").getValue();
        return oCusto;
    }

    this.getTheme = function() {
        var cdnTheme = this.param.getRange("B1").getValue();
        var themeURL = this.display.getRange(1, 1, this.display.getLastRow(), this.display.getLastColumn()).getValues();

        for (var i = 0; i < themeURL.length; i++) {

            if (themeURL[i][0] === cdnTheme) return themeURL[i][1].toString();
        }
    }

    this.getLogo = function () {
        return enumConst.urlLogo;
    }

}