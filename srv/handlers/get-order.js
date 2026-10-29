const omfService = require('../clients/omf-service')

module.exports = async function(req) {

// call the gettoken method  -----similar to public method
  const token = await omfService.getToken()

// call getOrder using orderId and tokenurl
  const response = await omfService.getOrder(
    req.data.orderId,
    token
  )

  const order = response.data
  console.log(JSON.stringify(order, null, 2));
// return the order
 return {
    id: order.id,
    businessObjectId: order.businessObjectId,
    version: order.version,
    status: order.status,
    modifiedAt: order.metadata?.modifiedAt,

    cakeMessage:
        order.customFields?.cakeMessage,

    specialNotes:
        order.customFields?.specialNotes,

    channel:
        order.customFields?.channel,
      
    fulfillmentRequestId :
        order.orderItems?.[0]
             ?.fulfillment
             ?.fulfillmentRequests?.[0]
             ?.id
}
}