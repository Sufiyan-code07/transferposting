sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("transferposting1.controller.View1", {
        onInit() {
        },
        onPressChangeLoc: function (oEvent) {
            var ButtonText = oEvent.getSource().getText();
            var button;
            if (ButtonText == "Change Loc Only") {
                button = "1";
            } else if (ButtonText == "Change Loc, Qty") {
                button = "2";
            } else if (ButtonText == "Change Loc, Batch") {
                button = "3";
            } else if (ButtonText == "Change Loc, Batch, Qty") {
                button = "4";
            }
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView2", {
                condition: button
            })
        },
        onPressCreate: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteCreate")
        },
        onPressDelivery: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDelivery")
        }

    });
});