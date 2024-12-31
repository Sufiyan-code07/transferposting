sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("transferposting1.controller.View2", {
            onInit: function () {
                var SourceModel = new JSONModel();
                this.getView().setModel(SourceModel, "SourceModel");

                var oEdit = {
                    "Location": false,
                    "Batch": false,
                    "Qty": false
                }
                var EditModel = new JSONModel(oEdit);
                this.getView().setModel(EditModel, "EditModel");
                this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this.onRouteMatched, this);
            },
            onRouteMatched: function (oEvent) {
                this.button = oEvent.getParameter("arguments").condition;
                var EditModel = this.getView().getModel("EditModel");
                var title;
                if (this.button == 1) {
                    title = "Transfer Posting - Change Loc.";
                    EditModel.setProperty("/Location", true);
                    EditModel.setProperty("/Batch", false);
                    EditModel.setProperty("/Qty", false);
                } else if (this.button == 2) {
                    title = "Transfer Posting - Change Loc, Qty";
                    EditModel.setProperty("/Location", true);
                    EditModel.setProperty("/Batch", false);
                    EditModel.setProperty("/Qty", true);
                } else if (this.button == 3) {
                    title = "Transfer Posting - Change Loc, Batch";
                    EditModel.setProperty("/Location", true);
                    EditModel.setProperty("/Batch", true);
                    EditModel.setProperty("/Qty", false);
                } else if (this.button == 4) {
                    title = "Transfer Posting - Change Loc, Batch, Qty";
                    EditModel.setProperty("/Location", true);
                    EditModel.setProperty("/Batch", true);
                    EditModel.setProperty("/Qty", true);
                }
                this.getView().byId("idPageView2").setTitle(title);
                var SourceModel = this.getView().getModel("SourceModel");
                SourceModel.setData({});
                var oModel = this.getView().getModel();
                oModel.setSizeLimit(1000)
            },
            onPressMainMenu: function () {
                var EditModel = this.getView().getModel("EditModel");
                EditModel.setProperty("/Location", false);
                EditModel.setProperty("/Batch", false);
                EditModel.setProperty("/Qty", false);
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1");
            },
            onScanSuccess: async function (oEvent) {
                if (oEvent.getParameter("cancelled")) {
                    MessageToast.show("Scan cancelled", { duration: 1000 });
                } else {
                    if (oEvent.getParameter("text")) {
                        // this.scannedValue = this.getView().byId("idScannedValue").setValue(oEvent.getParameter("text"));
                        // this.onChangeScannedValue();
                        sap.ui.core.BusyIndicator.show();
                        var oModel = this.getView().getModel();
                        var SourceModel = this.getView().getModel("SourceModel");
                        oModel.read("/get_detailSet('" + oEvent.getParameter("text") + "')", {
                            success: function (response) {
                                SourceModel.setData({
                                    Id: response.Id,
                                    Barcode: response.Barcode, //Barcode
                                    Batch: response.Charg, //batch
                                    UnitOfEntry: response.Erfme,  //Unit of Entry
                                    Location: response.Lgort,  //Location
                                    Material: response.Matnr, //Material
                                    Quantity: response.Menge, //Quantity
                                    TMaterial: response.Matnr, //Target Material
                                });
                                if (this.button !== "2" && this.button !== "4") {
                                    this.getView().byId("idTargetQuantity").setValue(response.Menge);
                                }
                                if (this.button !== "3" && this.button !== "4") {
                                    this.getView().byId("idTargetBatch").setSelectedKey(response.Charg);
                                }
                                SourceModel.updateBindings(true)
                                sap.ui.core.BusyIndicator.hide();
                            }.bind(this),
                            error: function (error) {
                                sap.ui.core.BusyIndicator.hide();
                                MessageBox.error(JSON.parse(error.responseText).error.message.value);
                                this.getView().byId("idScannedValue").setValue('');
                            }.bind(this)
                        });
                    } else {
                        this.getView().byId("idScannedValue").setValue('');
                    }
                }
            },
            onScanError: function (oEvent) {
                MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
            },
            onPressSave: function () {
                var oModel = this.getView().getModel();
                var SourceModel = this.getView().getModel("SourceModel");
                var payload = {
                    "Id": SourceModel.getData().Id,
                    "Barcode": SourceModel.getData().Barcode,
                    "Matnr": SourceModel.getData().Material,
                    "Charg": SourceModel.getData().TBatch,
                    "Menge": SourceModel.getData().TQuantity,
                    "Erfme": SourceModel.getData().UnitOfEntry,
                    "Lgort": SourceModel.getData().TLocation
                };
                oModel.create("/get_detailSet", payload, {
                    success: function (response) {
                        console.log("Created SUccess");
                        MessageBox.information(response.Status)
                    },
                    error: function (error) {
                        MessageBox.error("Error While Creating")
                    }
                })
            },
            onChangeScannedValue: function (oEvent) {
                var oModel = this.getView().getModel();
                var value = this.getView().byId("idScannedValue").getValue();
                if (value.length !== 10) {
                    MessageBox.error("Please Enter 10 Digits")
                } else {
                    var SourceModel = this.getView().getModel("SourceModel");
                    sap.ui.core.BusyIndicator.show();
                    oModel.read("/get_detailSet('" + value + "')", {
                        success: function (response) {
                            SourceModel.setData({
                                Id: response.Id,
                                Barcode: response.Barcode, //Barcode
                                Batch: response.Charg, //batch
                                UnitOfEntry: response.Erfme,  //Unit of Entry
                                Location: response.Lgort,  //Location
                                Material: response.Matnr, //Material
                                Quantity: response.Menge, //Quantity
                                TMaterial: response.Matnr, //Target Material
                            });
                            if (this.button !== "2" && this.button !== "4") {
                                this.getView().byId("idTargetQuantity").setValue(response.Menge);
                            }
                            if (this.button !== "3" && this.button !== "4") {
                                this.getView().byId("idTargetBatch").setSelectedKey(response.Charg);
                            }
                            SourceModel.updateBindings(true)
                            sap.ui.core.BusyIndicator.hide();
                        }.bind(this),
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageBox.error(JSON.parse(error.responseText).error.message.value);
                            this.getView().byId("idScannedValue").setValue('');
                        }.bind(this)
                    });
                }
            },
            onSLocScanSuccess: async function (oEvent) {
                if (oEvent.getParameter("cancelled")) {
                    MessageToast.show("Scan cancelled", { duration: 1000 });
                } else {
                    if (oEvent.getParameter("text")) {
                        this.getView().byId("idTargetSLoc").setSelectedKey(oEvent.getParameter("text"));
                    }
                }
            }
        });
    });
