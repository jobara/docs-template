/*
Copyright 2015 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("docsCore");

    docsCore.init = function (libPath) {
        libPath = libPath || "";

        fluid.uiOptions.prefsEditor(".flc-prefsEditor-separatedPanel", {
            terms: {
                templatePrefix: libPath + "lib/infusion/src/framework/preferences/html",
                messagePrefix: libPath + "lib/infusion/src/framework/preferences/messages",
            },
            tocTemplate: libPath + "lib/infusion/src/components/tableOfContents/html/TableOfContents.html"
        });

        docsCore.loadSidebar("body");
    };

    /******************
     * Sidebar Loader *
     ******************/

    /**
     * Save the flag for showing/hiding the side bar into the cookie. Also retrieve and apply the flag at init.
     */
    fluid.defaults("docsCore.loadSidebar", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        components: {
            sidebar: {
                type: "docsCore.sidebar",
                container: "{loadSidebar}.container",
                options: {
                    modelListeners: {
                        "": {
                            listener: "{cookieStore}.set",
                            args: ["{change}.value"]
                        }
                    },
                    model: {
                        sidebarStyleApplied: {
                            expander: {
                                funcName: "fluid.get",
                                args: [{
                                    expander: {
                                        funcName: "{cookieStore}.get"
                                    }
                                }, "sidebarStyleApplied"]
                            }
                        }
                    }
                }
            },
            cookieStore: {
                type: "fluid.cookieStore",
                options: {
                    cookie: {
                        name: "docsCore-settings"
                    }
                }
            }
        }
    });

    /***********
     * Sidebar *
     ***********/

    /**
     * Apply or remove the style for showing/hiding the side bar based on the model value.
     */
    fluid.defaults("docsCore.sidebar", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        styles: {
            visibility: "docs-core-sidebar-visibility"
        },
        selectors: {
            sidebarButton: ".docs-corec-topics"
        },
        model: {
            sidebarStyleApplied: true
        },
        modelListeners: {
            sidebarStyleApplied: {
                this: "{that}.container",
                method: "toggleClass",
                args: ["{that}.options.styles.visibility", "{change}.value"]
            }
        },
        invokers: {
            toggleSidebarStyleApplied: {
                funcName: "docsCore.toggleSidebarStyleApplied",
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.clickTopics": {
                "this": "{that}.dom.sidebarButton",
                method: "click",
                args: ["{that}.toggleSidebarStyleApplied"]
            }
        }
    });

    docsCore.toggleSidebarStyleApplied = function (that) {
        that.applier.change("sidebarStyleApplied", !that.model.sidebarStyleApplied);
    };

})(jQuery, fluid);
