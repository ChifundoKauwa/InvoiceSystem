import { InvoiceStatus } from "./IncoiceStatus";
import { InvoiceItem } from "./InvoiceItem";
import { Money } from "../shared/Money";
import { DomainEvent } from "./DomainEvent";
import { InvoiceIssued, InvoicePaid, InvoiceOverdue, InvoiceVoided } from "./InvoiceEvent";

export class Invoice {
    private state:InvoiceStatus=InvoiceStatus.draft;
    private readonly id:string;
    private readonly items:InvoiceItem[]=[];
    private events:DomainEvent[]=[];
    private issueAt!:Date;
    private dueAt!:Date;
    private readonly currency:string;
    constructor(id:string,currency:string,items:InvoiceItem[]=[],events:DomainEvent[]=[])  {
        if(!currency){
            throw new Error("currency is required")
        }
        if(items && items.some(i=>!i.subtotal().sameCurrency(Money.zero(currency)))){
            throw new Error ("all items must have the same currency as the invoice")
        }
        if(!id || id.trim().length===0){
            throw new Error("id is required")
        }
        this.currency=currency;
        this.id=id;
        if(items){
            this.items.push(...items)
        }
        if(events && events.length>0){
            this.events.push(...events) 
        }
    }
    addItem(item:InvoiceItem):void{
        if(this.state!==InvoiceStatus.draft){
            throw new Error ("can only add items to draft invoices")
        }
        if(!item.subtotal().sameCurrency(Money.zero(this.currency))){
            throw new Error ("item currency must match invoice currency")
        }
        this.items.push(item);
    }
    issue( dueAt:Date):Invoice{
        if(this.state!==InvoiceStatus.draft){
            throw new Error ("can only issue draft invoices")
        }
        const now =new Date();
        if(this.state!==InvoiceStatus.draft){
            throw new Error("can only issue draft invoices")
        }
        
        if(this.items.length===0){
            throw new Error("cannot issue invoice with no items")
        }
        const issuedInvoice= Object.assign( Object.create( Object.getPrototypeOf(this)), this) as Invoice;
        issuedInvoice.state=InvoiceStatus.issued;
        issuedInvoice.issueAt=now;
        issuedInvoice.events=[...this.events, new InvoiceIssued(this.id, now, dueAt)];
        issuedInvoice.dueAt=dueAt;
        return deepFreeze(issuedInvoice);
    }
    markAsPaid():Invoice{
        if(![InvoiceStatus.issued, InvoiceStatus.overdue].includes(this.state)){
            throw new Error("can only pay issued or overdue invoices")
        }
        const paidInvoice= Object.assign( Object.create( Object.getPrototypeOf(this)), this) as Invoice;
        paidInvoice.state=InvoiceStatus.paid;
        paidInvoice.events=[...this.events, new InvoicePaid(this.id, new Date())];
        return deepFreeze(paidInvoice);
    }
    markAsOverdue():Invoice{
        if(this.state!==InvoiceStatus.issued){
            throw new Error("can only mark issued invoices as overdue")
        }
        const overdueInvoice= Object.assign( Object.create( Object.getPrototypeOf(this)), this) as Invoice;
        overdueInvoice.state=InvoiceStatus.overdue;
        overdueInvoice.events=[...this.events, new InvoiceOverdue(this.id, new Date())];
        return deepFreeze(overdueInvoice);
    }   
    void():Invoice{
        if(this.state===InvoiceStatus.paid){
            throw new Error("cannot void a paid invoice")
        }
        const voidedInvoice= Object.assign( Object.create( Object.getPrototypeOf(this)), this) as Invoice;
        voidedInvoice.state=InvoiceStatus.void;
        voidedInvoice.events=[...this.events, new InvoiceVoided(this.id, new Date())];
        return deepFreeze(voidedInvoice);
    }
    getTotal():Money{
        let total=Money.zero(this.currency);
        for(const item of this.items){
            total=total.add( item.subtotal());
        }
        return total;
    }
    getItems():InvoiceItem[]{
        return [...this.items];
    }
    getStatus():InvoiceStatus{
        return this.state;
    }
    getId():string{
        return this.id;
    }
    getCurrency():string{
        return this.currency;
    }
    getIssueAt():Date{
        return this.issueAt;
    }   
    getDueAt():Date{
        return this.dueAt;
    }  
    getEvents():DomainEvent[]{
        return [...this.events];
    } 
}

function deepFreeze<T>(obj:T): T {
   Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });
    return Object.freeze(obj);
}