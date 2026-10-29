const omfService = require('../clients/omf-service')

module.exports = async function (req) {

    // call the gettoken method  -----similar to public method
    const token = await omfService.getToken()

    // call getOrder using orderId and tokenurl
    const response = await omfService.getOrder(
        req.data.orderId,
        token
    );

    const order = response.data;
    // get the fulfillment request id

    const fulfillmentRequestId =
        order.orderItems?.[0]
            ?.fulfillment
            ?.fulfillmentRequests?.[0]
            ?.id;

    //return fulfillmentRequestId;             
    // call the getFulfillmentRequest function 

    const fulfillmentResponse =
        await omfService.getFulfillmentRequest(
            fulfillmentRequestId,
            token
        );
    //move the fulfillmentResponse data to a variable
    const fr = fulfillmentResponse.data;
    /*   console.log(JSON.stringify(
           fulfillmentResponse.data,
           null,
           2
       )); */

    // build intermediate payload
    const items =
        fr.splitOrderPayload.orderItems.map(item => ({
            article:
                item.product
                    .fulfillmentSystemReference.id,

            description:
                item.product.name,

            quantity:
                item.quantity.value,

            amount:
                item.price.aspectsData
                    .physicalItemPrice
                    .priceTotals[0]
                    .finalAmount
        }));
    // to sum the amounts of the items 
    const totalAmount =
        items.reduce(
            (sum, item) => sum + item.amount,
            0
        );
    const receipt = {
        receiptNo: fr.displayId,

        store:
            fr.splitOrderPayload.sourcing.shipments[0]
                .fulfillmentSite.id,

        orderId: fr.orderId,

        items : items,

        payment: {
            amount:
                totalAmount,
            finalAmount:
                fr.splitOrderPayload.prices[0].itemsSubtotal.finalAmount,

            transactionId:
                fr.splitOrderPayload.payment[0]
                    .transactionId
        },


    }

    console.log(JSON.stringify(
        receipt,
        null,
        2
    ));

    /*return JSON.stringify(
        fulfillmentResponse.data,
        null,
        2
    );*/

    return JSON.stringify(
        receipt,
        null,
        2
    );
}
