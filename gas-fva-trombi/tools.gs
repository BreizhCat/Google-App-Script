/**
* Generate the code to include the web page
*
* @param {String} Filename
* @return {String} Returns the webpage evaluated
*/
function include(filename) {
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

/**
* Get script property value
*
* @param {String} Property Name
* @return {String} Value
*/
function getParam(name) {
    return PropertiesService.getScriptProperties().getProperty(name);
}

/**
* Change the property value
*
* @param {String} Property Name
* @param {String} Value
*/
function setParam(name, value) {
    PropertiesService.getScriptProperties().setProperty(name, value);
}

/**
* Generate the code of the main web page
*
* @param {String} Parameters send by the webpage
* @return {String} HTML generated
*/
function doGet(param) {
    return HtmlService.createTemplateFromFile("main").
        evaluate().
        setSandboxMode(HtmlService.SandboxMode.IFRAME).
        setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).
        setFaviconUrl('https://www.shareicon.net/data/128x128/2017/06/21/887415_group_512x512.png').
        addMetaTag('viewport', 'width=device-width, initial-scale=1').
        setTitle(__APP_TITLE__ + ' ' + __VERSION__.major + '.' + __VERSION__.minor);
}

/**
* Add non-significant leading zero
*
* @param {Integer} Size
* @return {String} Returns the number with leading zero
*/
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}