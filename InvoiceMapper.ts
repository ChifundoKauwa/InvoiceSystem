import { InvoiceEntity } from "./entities/InvoiceEntity";
import { InvoiceItemEntity } from "./entities/InvoiceItemEntity";
import { Invoice } from "./invoice/Invoice";
import { InvoiceItem } from "./invoice/InvoiceItem";
import { Money } from "./shared/Money";
import { InvoiceStatus } from "./invoice/IncoiceStatus";

export class InvoiceMapper {
    static toDomain(entity: InvoiceEntity): Invoice {
        const items = entity.items.map(item => 
            new InvoiceItem(
                item.id,
                new Money(item.amount, entity.currency),
                1,
                item.description
            )
        );
        let invoice = new Invoice(entity.id, entity.currency, items);
        
        // Reconstruct state from issueAt/dueAt dates
        if (entity.issueAt) {
            invoice = invoice.issue(entity.dueAt!);
            
            if (entity.state === InvoiceStatus.paid) {
                invoice = invoice.markAsPaid();
            } else if (entity.state === InvoiceStatus.overdue) {
                invoice = invoice.markAsOverdue();
            } else if (entity.state === InvoiceStatus.void) {
                invoice = invoice.void();
            }
        }
        
        return invoice;
    }

    static toEntity(invoice: Invoice): InvoiceEntity {
        const entity = new InvoiceEntity();
        entity.id = invoice.getId();
        entity.currency = invoice.getCurrency();
        entity.state = invoice.getStatus();
        entity.items = invoice.getItems().map((item: InvoiceItem) => {
            const itemEntity = new InvoiceItemEntity();
            itemEntity.id = item.getId();
            itemEntity.description = item.getDescription();
            itemEntity.amount = item.subtotal().getAmount();
            return itemEntity;
        });
        entity.issueAt = invoice.getIssueAt();
        entity.dueAt = invoice.getDueAt();
        
        return entity;
    }
}