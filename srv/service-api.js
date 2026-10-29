const cds = require('@sap/cds')

const getOrderHandler = require('./handlers/get-order')
const updatePhoneHandler = require('./handlers/update-phone')
const updateCustDetailsHandler = require('./handlers/update-custdetails')
const saveReceiptHandler = require('./handlers/save-receipt')

module.exports = class OrderService extends cds.ApplicationService {

  async init() {
// getOrder action call --- implementation in handler section
    this.on('getOrder', getOrderHandler);
// updatePhone action call --- implementation in handler section		
    this.on('updatePhone', updatePhoneHandler);
// update customer details section in header level
    this.on('updateCustDetails', updateCustDetailsHandler)    ;
// save receipt
    this.on('saveReceipt', saveReceiptHandler) ;
    return super.init()
  }

}
