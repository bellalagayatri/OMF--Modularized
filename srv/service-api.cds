type OrderInfo {
    id               : String;
    businessObjectId : String;
    version          : Integer;
    status           : String;
    modifiedAt       : Timestamp;
    cakeMessage      : String;
    specialNotes     : String;
    channel          : String;
    fulfillmentRequestId : String;
}

service orderService{
    action getOrder(
        orderId: String
    ) returns OrderInfo;

    action updatePhone(
        orderId:String,
        phone : String

    ) returns OrderInfo;

    action updateCustDetails(
        orderId:String,
        description :String
    ) returns OrderInfo;

    action saveReceipt(
        orderId : String
    )returns String;
}