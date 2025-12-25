class InvoiceIssued extends DomainEvent {
    constructor(public readonly invoiceId: string, public readonly issuedAt: Date, public readonly dueAt: Date  ) 
    {
        super();
    }
}
class InvoicePaid extends DomainEvent {
    constructor(public readonly invoiceId: string, public readonly paidAt: Date) 
    {
        super();
    }
}
class InvoiceOverdue extends DomainEvent {
    constructor(public readonly invoiceId: string, public readonly overdueAt: Date) 
    {
        super();
    }   
}
class InvoiceVoided extends DomainEvent {
    constructor(public readonly invoiceId: string, public readonly voidedAt: Date) 
    {
        super();
    }   
}   