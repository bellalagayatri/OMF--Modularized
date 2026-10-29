const omfService = require('../clients/omf-service')

module.exports = async function (req) {

    // call the gettoken method  -----similar to public method
    const token = await omfService.getToken()

    // call getOrder using orderId and tokenurl
    const response = await omfService.getOrder(
        req.data.orderId,
        token
    )

    const etag = response.headers.etag
    console.log('Etag', etag)


    console.log(
        'GET Order Response:',
        JSON.stringify(response.data, null, 2)
    )
    const order = response.data
    const version = order.version
    /* Axios always expects the below
    axios.patch(
       url,
       payload,
       config
    )
    */
    const description = req.data.description

    const payload = {
        action: 'CHANGE_HEADER_DURING_PROCESSING',

        customFields: {
            cakeMessage: description
        }
    }
    const patchCustDetailsResp =
        await omfService.patchCustDetails(
            req.data.orderId,
            payload,
            token,
            etag

        )

    console.log(
        'PATCH Response:',
        JSON.stringify(
            patchCustDetailsResp.data,
            null,
            2
        ))
    console.log(
        'PATCH HEADERS:',
        patchCustDetailsResp.headers
    )
    const correlationId =
        patchCustDetailsResp.headers[
        'oms-correlation-id'
        ]

    console.log(
        'Correlation ID:',
        correlationId
    )
     await auditService.saveCorrelationId(
        req.data.orderId,
        correlationId,
        req.data.cakeMessage
      )
    

    return {
        correlationId
    }
    return patchCustDetailsResp.data
}