sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("transferposting1.controller.Create", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("RouteCreate").attachPatternMatched(this.onRouteMatched, this);
            },
            onRouteMatched: function () {
                var oModel = this.getView().getModel();
                oModel.setSizeLimit(1000)
            },
            onPressSave: function () {
                var oView = this.getView();
                var oModel = this.getView().getModel();
                var payload = {
                    "Matnr": oView.byId("idMaterial").getValue(),
                    "Charg": oView.byId("idBatch").getValue(),
                    "Menge": oView.byId("idQuantity").getValue(),
                    "Erfme": oView.byId("idUnit").getValue(),
                    "Lgort": oView.byId("idStorage").getSelectedKey()
                }
                sap.ui.core.BusyIndicator.show();
                oModel.create("/create_printSet", payload, {
                    success: function (response) {
                        console.log(response)
                        sap.ui.core.BusyIndicator.hide();
                        // MessageBox.information(response.Status)
                        MessageBox.success(response.Status,{
                            title: "Information",
                            actions: sap.m.MessageBox.Action.OK,
                            emphasizedAction: sap.m.MessageBox.Action.OK,
                            onClose: function (oAction) { 
                                this.onPressNavBack()
                            }.bind(this)
                        })
                    }.bind(this),
                    error: function (error) {
                        console.log(error)
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error(JSON.parse(error.responseText).error.message.value);
                    }.bind(this)
                })
            },
            onPressNavBack: function () {
                var oView = this.getView();
                var oRouter = this.getOwnerComponent().getRouter();
                oView.byId("idMaterial").setValue("");
                oView.byId("idBatch").setValue("");
                oView.byId("idQuantity").setValue("");
                oView.byId("idUnit").setValue("");
                oView.byId("idStorage").setValue("");
                oRouter.navTo("RouteView1")
            }
        });
    });
