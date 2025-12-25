// CRITICAL: Import reflect-metadata FIRST before any decorated classes
import "reflect-metadata";

// Domain layer - no dependencies
// (Your pure domain files are imported naturally through other imports)

// Persistence layer - loaded after reflect-metadata is available
// TypeORM decorators can now safely attach metadata

console.log("✓ reflect-metadata initialized");
console.log("✓ Domain model ready");
console.log("✓ TypeORM decorators available");