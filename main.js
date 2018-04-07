/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** Adobe Creative Cloud Extension Builder (based on CC Extension Builder [by davidderaedt])
    Create HTML extensions for Adobe Creative Cloud products
	by KICreATIVO [KIDev] (kicreativo.pro)
*/
define(function (require, exports, module) {
    'use strict';

    //console.log("INITIALIZING ACCBuilder EXTENSION");
        
    var CommandManager      = brackets.getModule("command/CommandManager");
    var DocumentManager     = brackets.getModule("document/DocumentManager");
    var Menus               = brackets.getModule("command/Menus");
    var ProjectManager      = brackets.getModule("project/ProjectManager");
    var FileUtils           = brackets.getModule("file/FileUtils");
    var FileSystem          = brackets.getModule("filesystem/FileSystem");
    var Dialogs             = brackets.getModule("widgets/Dialogs");
    var PanelTemplate       = require("text!html/main.html");
    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
    var AppInit             = brackets.getModule("utils/AppInit");
    var NodeConnection      = brackets.getModule("utils/NodeConnection");
	
	var accLogo = require.toUrl("html/img/acc.svg");
	
    var ACC_MENU_ID  = "ACCBuilder.menu";
    var ACC_MENU_NAME = "ACC Extension Builder";
    var NEW_ACC_CMDID  = "ACCBuilder.newExt";
    var NEW_ACC_MENU_NAME   = "New ACC Extension";
    var DEBUGMODE_ON_CMDID  = "ACCBuilder.setDebugMode";
    var DEBUGMODE_ON_CMDNAME   = "Enable Debug Mode";
    
    var SDK_FOLDER_NAME = "/SDK/";
    var NODE_DOMAIN_LOCATION = "node/ACCDomain";
    var SUCCESS_MSG = "The project was successfully created. Change the manifest file if necessary and use the debug mode. Good luck :)";

    
    var HOSTS = [
            '<Host Name="PHXS" Version="[14.0,19.0]" /><Host Name="PHSP" Version="[14.0,19.0]" />',
            '<Host Name="ILST" Version="[17.0,22.0]" />',
            '<Host Name="PPRO" Version="[7.0,12.0]" />',
            '<Host Name="PRLD" Version="[2.0,7.0]" />',
            '<Host Name="IDSN" Version="[9.0,13.0]" />',
            '<Host Name="FLPR" Version="[13.0,18.0]" />',
            '<Host Name="AEFT" Version="[12.0,15.0]" />'
        ];    
                
    var isWin = true;
    var userHomeDir;
    var nodeConnection;
    var moduleFolder;
    var sdkFolder;
    
        
    function enableDebugging(){
        
        var cmd = "";
        if(isWin) {
            cmd = '"'+sdkFolder.fullPath + 'debugmode.bat"';
        } else {
            cmd = "'"+sdkFolder.fullPath + "debugmode.sh'" ;
        } 
                
        console.log("Brackets cmd:"+cmd);
        
        var exePromise = nodeConnection.domains.ACC.execmd(cmd);
        
        exePromise.fail(function (err) {
            console.error("[brackets-ACC-node] failed to run ACC.execmd", err);
        });
        
        exePromise.done(function (stdout) {            
            alert("Debug Mode ON");
        });    
    }
    
    
    function createExtension(data) {
                
        var cmd = "";
        if(isWin) {
            cmd = '"'+sdkFolder.fullPath + "newext.bat" + '" ' + data.template + ' ' + data.extid + "'";
        } else {
            cmd = "'"+sdkFolder.fullPath + "newext.sh"  + "' " + data.template + " " + data.extid;
        } 
                
        console.log("Brackets cmd:"+cmd);
        
        var exePromise = nodeConnection.domains.ACC.execmd(cmd);
        
        exePromise.fail(function (err) {
            console.error("[brackets-ACC-node] failed to run ACC.execmd", err);
        });
        
        exePromise.done(function (stdout) {
            
            var nstdout = stdout.replace(/[\r\n]/g, "");// remove line breaks
            var path = nstdout.replace(/\\/g,"/");// normalize windows paths       
            
            
            // Modify manifest file             
            var manifestFile =  new FileSystem.getFileForPath(path + "/CSXS/manifest.xml");
            processTemplateFile(manifestFile, data);

            // Modify debug file             
            var debugFile =  new FileSystem.getFileForPath(path + "/.debug");
            processTemplateFile(debugFile, data);
          
            
            // Open project and document
            ProjectManager.openProject(path).done(
                function () {
                    DocumentManager.getDocumentForPath(path + "/CSXS/manifest.xml").done(
                        function (doc) {
                            DocumentManager.setCurrentDocument(doc);
                            alert(SUCCESS_MSG);
                        }
                    );
                }
            );
                                
        });
    }
    
    
    function _processTemplate(templateString, data) {
        
        var str = templateString;
        str = str.replace(new RegExp("com.example.ext", "g"), data.extid);
        str = str.replace(new RegExp("Extension-Name", "g"), data.extname);
        str = str.replace(new RegExp("<!--@defheight-->", "g"), data.defheight);
        str = str.replace(new RegExp("<!--@defwidth-->", "g"), data.defwidth);
        str = str.replace(new RegExp("<!--@minheight-->", "g"), data.minheight);
        str = str.replace(new RegExp("<!--@minwidth-->", "g"), data.minwidth);
        str = str.replace(new RegExp("<!--@maxheight-->", "g"), data.maxheight);
        str = str.replace(new RegExp("<!--@maxwidth-->", "g"), data.maxwidth);
        
        return str;
    }
        
    
    
    function processTemplateFile(srcFile, data) {
        
        var srcTxt = "";
        
        FileUtils.readAsText(srcFile)
            .done(function (rawText, readTimestamp) {
                var newText = _processTemplate(rawText, data);
                FileUtils.writeText(srcFile, newText)
                    .fail(function (err) {
                        console.log(err);
                    });
            })
            .fail(function (err) {
                console.log(err);
            });
    }


        
    function initNodeDomain() {
                    
        var promise = nodeConnection.domains.ACC.initialize();
        promise.fail(function (err) {
            console.error("[brackets-ACC-node] failed to run ACC.initialize", err);
        });
        promise.done(function (path) {
            console.log("Home directory: " + path);
            userHomeDir = path;
        });
        return promise;
    }

                
            
    function initNodeCnx() {
        
        nodeConnection = new NodeConnection();
        
        var connectionPromise = nodeConnection.connect(true);
        connectionPromise.fail(function () {
            console.error("[brackets-ACC-node] failed to connect to node");
        });
        connectionPromise.done(function () {
            var path = ExtensionUtils.getModulePath(module, NODE_DOMAIN_LOCATION);

            var loadPromise = nodeConnection.loadDomains([path], true);
            loadPromise.fail(function () {
                console.log("[brackets-ACC-node] failed to load domain");
            });
            loadPromise.done(function () {
                initNodeDomain();
            });
        });
            
    }
    
    
    function createPanel() {
        
        ExtensionUtils.loadStyleSheet(module, "main.css");
        
        Dialogs.showModalDialogUsingTemplate(PanelTemplate);
		
        $("#html-acc-figure img").attr("src", accLogo);
                
        $("#ACCSubmit").on("click", function (e) {
            
            var data = {
				extid : $("#ACC-id").val(),
				extname : $("#ACC-accname").val(),
				host: HOSTS[parseInt($("#ACC-host").val(), 10)],
		    	width: $("#ACC-accwidth").val(),
			    height: $("#ACC-accheight").val(),
		     	minwidth: $("#ACC-accminwidth").val(),
		    	minheight: $("#ACC-accminheight").val(),
				maxwidth: $("#ACC-accmaxwidth").val(),
		    	maxheight: $("#ACC-accmaxheight").val(),
 				template: $("#ACC-template").val()
            };
                        
            createExtension(data);
        });
                
    }
    
            
            
    AppInit.appReady(function () {
        
        isWin = (brackets.platform!="mac");
        
        moduleFolder = FileUtils.getNativeModuleDirectoryPath(module);
        sdkFolder = new FileSystem.getDirectoryForPath(moduleFolder + SDK_FOLDER_NAME);        
        
        initNodeCnx();
        
    });
    

    function setupMenu(){
        
        CommandManager.register(NEW_ACC_MENU_NAME, NEW_ACC_CMDID, onMenuCreateNewACC);    
        function onMenuCreateNewACC(){
            createPanel();
        }

        CommandManager.register(DEBUGMODE_ON_CMDNAME, DEBUGMODE_ON_CMDID, onMenuDebugModeOn);
        function onMenuDebugModeOn(){
            enableDebugging();
        }		

        var ACCMenu =  Menus.getMenu(ACC_MENU_ID);
        if (!ACCMenu) {
            ACCMenu = Menus.addMenu(ACC_MENU_NAME, ACC_MENU_ID, Menus.LAST);
        }
		
		ACCMenu.addMenuItem(NEW_ACC_CMDID);   
        ACCMenu.addMenuItem(DEBUGMODE_ON_CMDID); 
        
        //ACCMenu.addMenuDivider(Menus.BEFORE, NEW_ACC_COMMAND_ID);

    }
    setupMenu();
    
});