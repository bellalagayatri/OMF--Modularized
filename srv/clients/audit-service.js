const cds = require('@sap/cds')
const { INSERT } = cds.ql

async function saveCorrelationId(
  orderId,
  correlationId,
  phone,
  description
) {

  const db = await cds.connect.to('db')

  await db.run(
    INSERT.into('omf.OrderChangeRequest').entries({
      ID: cds.utils.uuid(),
      OrderId: orderId,
      CorrelationId: correlationId,
      PhoneNumber: phone,
      Description: description,
      Status: 'PATCH_ACCEPTED',
      CreatedAt: new Date()
    })
  )
}

module.exports = {
  saveCorrelationId
}