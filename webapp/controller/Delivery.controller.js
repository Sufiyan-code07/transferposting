sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
    function (Controller, Filter, FilterOperator, MessageBox) {
        "use strict";

        return Controller.extend("transferposting1.controller.Delivery", {
            onInit: function () {
                var oDeliveryData = {
                    "aDeliveryData": []
                }
                var DeliveryModel = new sap.ui.model.json.JSONModel(oDeliveryData);
                this.getView().setModel(DeliveryModel, "DeliveryModel");

                this.getOwnerComponent().getRouter().getRoute("RouteDelivery").attachPatternMatched(this.onRouteMatched, this)
                this.getView().byId("idDeliveryNumber").setValue("");
                this.onChangeDeliveryNumber();
            },
            onRouteMatched: function () {
                this.getView().byId("idDeliveryNumber").setValue("");
                this.onChangeDeliveryNumber();
            },
            onChangeDeliveryNumber: function () {
                var oModel = this.getView().getModel();
                var DeliveryModel = this.getView().getModel("DeliveryModel");
                var aFilter = [];
                if (this.getView().byId("idDeliveryNumber").getValue()) {
                    aFilter.push(new Filter("Vbeln", FilterOperator.EQ, this.getView().byId("idDeliveryNumber").getValue()));
                    sap.ui.core.BusyIndicator.show();
                    oModel.read("/DeliverySet", {
                        filters: aFilter,
                        success: function (response) {
                            console.log(response);
                            for (var i = 0; i < response.results.length; i++) {
                                DeliveryModel.getData().aDeliveryData.push(response.results[i])
                            }
                            DeliveryModel.updateBindings(true);
                            sap.ui.core.BusyIndicator.hide();
                        }.bind(this),
                        error: function (error) {
                            console.log(error);
                            sap.ui.core.BusyIndicator.hide();
                        }.bind(this)
                    })
                } else {
                    sap.ui.core.BusyIndicator.hide();
                    DeliveryModel.getData().aDeliveryData = [];
                    DeliveryModel.updateBindings(true);
                }

            },
            onVHDeliveryNumber: function () {
                if (!this.DeliveryDialog) {
                    this.DeliveryDialog = new sap.ui.xmlfragment("transferposting1.view.fragments.DeliveryNumberVH", this);
                    this.getView().addDependent(this.DeliveryDialog);
                }

                this.DeliveryDialog.open();
            },
            onPressRow: function (oEvent) {
                var Selected = oEvent.getSource().getBindingContext().getObject().Vbeln;

                this.getView().byId("idDeliveryNumber").setValue(Selected);
                this.DeliveryDialog.close();
                this.onChangeDeliveryNumber();
            },
            onPressCloseDeliveryNumber: function () {
                this.DeliveryDialog.close();
            },
            onScanSuccess: function (oEvent) {
                if (oEvent.getParameter("cancelled")) {
                    MessageToast.show("Scan cancelled", { duration: 1000 });
                } else {
                    if (oEvent.getParameter("text")) {
                        this.getView().byId("idDeliveryScan").setValue(oEvent.getParameter("text"));
                    }
                }
            },
            onPressProceed: function () {
                var id = this.getView().byId("idDeliveryScan").getValue();
                var table = this.getView().byId("idDeliveryTable");

                if (id && table.getSelectedItem() !== null) {
                    var oModel = this.getView().getModel();
                    var SelectedObj = table.getSelectedItem().getBindingContext("DeliveryModel").getObject();

                    var payload = {
                        "Vbeln": SelectedObj.Vbeln,
                        "Posnr": SelectedObj.Posnr,
                        "Matnr": SelectedObj.Matnr,
                        "Arktx": SelectedObj.Arktx,
                        "Werks": SelectedObj.Werks,
                        "Lgort": SelectedObj.Lgort,
                        "Lfimg": SelectedObj.Lfimg,
                        "Pikmg": SelectedObj.Pikmg,
                        "Vrkme": SelectedObj.Vrkme,
                        "Charg": SelectedObj.Charg,
                        "Kosta": SelectedObj.Kosta,
                        "Bwart": SelectedObj.Bwart,
                        "Id": id,
                        "Status": SelectedObj.Status
                    };
                    sap.ui.core.BusyIndicator.show();
                    oModel.create("/DeliverySet", payload, {
                        success: function (response) {
                            console.log(response);
                            MessageBox.success(response.Status)
                            table.removeSelections(true);
                            this.getView().byId("idDeliveryScan").setValue("");
                            sap.ui.core.BusyIndicator.hide();
                        }.bind(this),
                        error: function (error) {
                            console.log(error);
                            sap.ui.core.BusyIndicator.hide();
                            MessageBox.error(JSON.parse(error.responseText).error.message.value);
                        }.bind(this)
                    })
                } else {
                    MessageBox.error("please Maintain ID and Select a Record");
                }

            },
            onPressNav: function () {
                this.getView().byId("idDeliveryNumber").setValue("");
                // this.onChangeDeliveryNumber();
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1");
            },
            handleSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Vbeln", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            handleClose: function (oEvent) {
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");
                if (aContexts && aContexts.length) {
                    var Vbeln = aContexts[0].getObject().Vbeln;
                    this.getView().byId("idDeliveryNumber").setValue(Vbeln);
                    this.onChangeDeliveryNumber();
                }

            }
        });
    });
