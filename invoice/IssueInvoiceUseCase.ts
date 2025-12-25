import { InvoiceRepo } from "./InvoiceRepo";

/**
 * DOMAIN LAYER: Use Case
 * 
 * Contains domain logic for issuing an invoice.
 * Depends on the InvoiceRepo interface (not the implementation).
 * No framework, no decorators, pure business logic.
 */
export class IssueInvoiceUseCase {
    constructor(
        private readonly invoiceRepo: InvoiceRepo,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: { invoiceId: string; dueAt: Date }): Promise<void> {
        const invoice = await this.invoiceRepo.getById(command.invoiceId);
        
        // Execute domain logic
        const issuedInvoice = invoice.issue(command.dueAt);
        
        await this.invoiceRepo.save(issuedInvoice);
        await this.eventBus.publish({
            type: "InvoiceIssued",
            invoice: issuedInvoice
        });
    }
}

/**
 * Domain-level abstraction for event publishing
 * Implementation details (message queue, event store) are external concerns
 */
interface EventBus {
    publish(event: any): Promise<void>;
}