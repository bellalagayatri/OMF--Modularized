const omfService = require('../clients/omf-service')
const auditService = require('../clients/audit-service')

module.exports = async function(req) {
// get the token
  const token = await omfService.getToken()
// get the order
  const orderResponse = await omfService.getOrder(
    req.data.orderId,
    token
  )
// get the etag which is mandatory for order change , patch
  const etag = orderResponse.headers.etag
// look at API schema view --> orderChangeHeaderDuringProcessingRequest -->action : 'CHANGE_HEADER_DURING_PROCESSING'
  const payload = {
    action: 'CHANGE_HEADER_DURING_PROCESSING',
    customer: {
      addresses: [
        {
          addressType: 'SHIP_TO',
          phone: req.data.phone
        },
        {
          addressType: 'BILL_TO',
          phone: req.data.phone
        }
      ]
    }
  }

  const patchResponse =
    await omfService.patchOrder(
      req.data.orderId,
      payload,
      token,
      etag
    )
// get the correlation id  and save it in SQLLite db
  const correlationId =
    patchResponse.headers['oms-correlation-id']

  await auditService.saveCorrelationId(
    req.data.orderId,
    correlationId,
    req.data.phone
  )

  return {
    Id: req.data.orderId,
    version: etag.replace(/"/g, ''),
    status: `PATCH_${patchResponse.status}`   
  }
}