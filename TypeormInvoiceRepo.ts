import { Repository } from "typeorm";
import { InvoiceEntity } from "./entities/InvoiceEntity";
import { InvoiceRepo } from "./invoice/InvoiceRepo";
import { Invoice } from "./invoice/Invoice";
import { InvoiceMapper } from "./InvoiceMapper";

/**
 * PERSISTENCE LAYER: TypeORM Implementation of InvoiceRepo
 * 
 * This class implements the domain's InvoiceRepo interface using TypeORM.
 * It knows about:
 * - TypeORM (Repository, entities)
 * - Database operations
 * - Mapping between domain and persistence layers
 * 
 * The domain layer (Invoice.ts, UseCases) depends on the interface, not this class.
 * This is injected where needed (e.g., into UseCases).
 */
export class TypeormInvoiceRepo implements InvoiceRepo {
    constructor(private readonly ormRepo: Repository<InvoiceEntity>) {}

    async getById(id: string): Promise<Invoice> {
        const entity = await this.ormRepo.findOneBy({ id });
        if (!entity) {
            throw new Error(`Invoice with id ${id} not found`);
        }
        return InvoiceMapper.toDomain(entity);
    }

    async save(invoice: Invoice): Promise<void> {
        const entity = InvoiceMapper.toEntity(invoice);
        await this.ormRepo.save(entity);
    }
}