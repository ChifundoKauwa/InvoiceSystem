import { DomainEvent } from "./DomainEvent";

export class InvoiceIssued extends DomainEvent {
    constructor(public readonly invoiceId: string, public readonly issuedAt: Date, public readonly dueAt: Date  ) 
    {
        super();
    }
}
export class InvoicePaid extends DomainEvent {
    constructor(public readonly invoiceId: string, public readonly paidAt: Date) 
    {
        super();
    }
}
export class InvoiceOverdue extends DomainEvent {
    constructor(public readonly invoiceId: string, public readonly overdueAt: Date) 
    {
        super();
    }   
}
export class InvoiceVoided extends DomainEvent {
    constructor(public readonly invoiceId: string, public readonly voidedAt: Date) 
    {
        super();
    }   
}   