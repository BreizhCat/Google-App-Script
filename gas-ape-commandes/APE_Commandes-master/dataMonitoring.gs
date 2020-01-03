var dataMonitoring = new _dataMonitoring();

function _dataMonitoring() {
    if (this.pointer !== 'object') {
        /* Open file on Drive */
        this.pointer = SpreadsheetApp.openById(getParam("dataMonitoring"));

        this.order = this.pointer.getSheetByName("Commandes");
        this.article = this.pointer.getSheetByName("Liste");
    }

    this.setNewOrder = function(orderID, rawData) {
        var upperOrderID = orderID.toUpperCase();
        var newRow = [upperOrderID, rawData.ecole, rawData.classe, rawData.current,
            rawData.nom, rawData.prenom, rawData.tel, rawData.mail, rawData.total.replace('.', ',')
        ];
        this.order.appendRow(newRow);


        for (var i = 0; i < rawData.articles.length; i++) {
            var newArticle = [upperOrderID, rawData.ecole, rawData.current, rawData.articles[i].ref, rawData.articles[i].desc, rawData.articles[i].qte];
            this.article.appendRow(newArticle);
        }

        return this.sendEmail(upperOrderID, rawData);
    };

    this.sendEmail = function(orderID, rawData) {
        var templateDoc = DriveApp.getFileById(getParam("template_pdf"));
        var newFile = templateDoc.makeCopy(enumTexte.prefixPDF + rawData.prenom + "_" + orderID);

        var newDoc = DocumentApp.openById(newFile.getId());
        var newBody = newDoc.getBody();

        var tableStyle = {};
        tableStyle[DocumentApp.Attribute.FONT_SIZE] = 8;
        tableStyle[DocumentApp.Attribute.FONT_FAMILY] = DocumentApp.FontFamily.UBUNTU;
        tableStyle[DocumentApp.Attribute.BOLD] = 0;
        tableStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
        tableStyle[DocumentApp.Attribute.PADDING_RIGHT] = 0;
        tableStyle[DocumentApp.Attribute.HEIGHT] = 0;

        var detailCurrent = rawData.current.split("-");
        newBody.replaceText("{classe}", rawData.classe);
        newBody.replaceText("{ecole}", rawData.groupe);
        newBody.replaceText("{orderNum}", orderID);
        newBody.replaceText("{nom}", rawData.nom);
        newBody.replaceText("{prenom}", rawData.prenom);
        newBody.replaceText("{tel}", rawData.tel);
        newBody.replaceText("{mail}", rawData.mail);
        newBody.replaceText("{current}", detailCurrent[0].trim());
        newBody.replaceText("{instit}", detailCurrent[1].trim());
        newBody.replaceText("{total}", parseFloat(rawData.total).toFixed(2) + enumTexte.euro);
        newBody.replaceText("{frais}", parseFloat(rawData.frais).toFixed(2) + enumTexte.euro);

        var newTable = newBody.getTables()[2];
        var tableIndex = 0;
        for (var i = 0; i < rawData.articles.length; i++) {
            if (rawData.articles[i].qte != 0) {
                tableIndex++;
                var newRow = newTable.insertTableRow(tableIndex);
                var currentArt = rawData.articles[i];

                _appendCell(newRow, currentArt.ref, tableStyle);
                _appendCell(newRow, currentArt.desc, tableStyle);
                _appendCell(newRow, parseFloat(currentArt.pu).toFixed(2) + enumTexte.euro, tableStyle);
                _appendCell(newRow, currentArt.qte, tableStyle);
                _appendCell(newRow, (parseFloat(currentArt.qte) * parseFloat(currentArt.pu)).toFixed(2) + enumTexte.euro, tableStyle);
            }
        }

        newDoc.saveAndClose();

        var blobAttach = newDoc.getAs(MimeType.PDF);
        var newPDF = DriveApp.getFolderById(getParam("archiveFolder")).createFile(blobAttach);
        DriveApp.getFileById(newDoc.getId()).setTrashed(true);
        var titleMail = enumTexte.mailTitle;
        titleMail = titleMail.replace("{ref}", orderID);
        var contentMail = getDocumentasHTML(enumConst.templateMail, false);
        contentMail = contentMail.replace("{ref}", orderID);
        MailApp.sendEmail(rawData.mail, titleMail, '', {
            htmlBody: contentMail,
            attachments: blobAttach,
            name:'APE Aussonne',
            replyTo:'contact@apeaussonne.fr'
        });
        newPDF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        return newPDF.getUrl();
    };
}

function _appendCell(_row, _value, _style) {
    var newCell = _row.appendTableCell(_value)
    newCell.setAttributes(_style);
    newCell.setPaddingTop(enumConst.defaultPadding);
    newCell.setPaddingBottom(enumConst.defaultPadding);
}