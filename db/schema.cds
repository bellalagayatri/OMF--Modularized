namespace omf;

entity OrderChangeRequest {
    key ID            : UUID;
    OrderId           : String(100);
    CorrelationId     : String(100);
    PhoneNumber       : String(50);
    description       : String;
    Status            : String(30);
    CreatedAt         : Timestamp;
}