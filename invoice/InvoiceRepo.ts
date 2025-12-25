import { Invoice } from "./Invoice";

/**
 * DOMAIN LAYER: Repository Interface
 * 
 * This interface defines the contract for invoice persistence.
 * The domain layer NEVER knows about TypeORM, databases, or implementation details.
 * It only depends on this contract.
 * 
 * Implementation lives in persistence layer (TypeormInvoiceRepo.ts)
 */
export interface InvoiceRepo {
    getById(id: string): Promise<Invoice>;
    save(invoice: Invoice): Promise<void>;
}