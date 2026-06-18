import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('write-path reconciliation wiring', () => {
  it('plans scan statediff actions before scan write batches and stale deletes', () => {
    const sourcePath = path.resolve(__dirname, '..', 'handlers', 'memory-index.ts');
    const source = fs.readFileSync(sourcePath, 'utf8');

    const planIndex = source.indexOf('const plannedScanActions = [');
    const batchIndex = source.indexOf('const batchResults = await processBatches(filesToIndex');
    const staleDeleteIndex = source.indexOf('const staleDeleteResult = deleteStaleIndexedRecords(filesToDelete);');
    const deferredCleanupIndex = source.indexOf('Deferring stale cleanup because one or more replacement files failed to index');

    expect(planIndex).toBeGreaterThan(-1);
    expect(batchIndex).toBeGreaterThan(-1);
    expect(staleDeleteIndex).toBeGreaterThan(-1);
    expect(planIndex).toBeLessThan(batchIndex);
    expect(planIndex).toBeLessThan(staleDeleteIndex);
    expect(deferredCleanupIndex).toBeGreaterThan(staleDeleteIndex);
  });

  it('routes save and bulk-delete cache effects through statediff action batches', () => {
    const savePath = path.resolve(__dirname, '..', 'handlers', 'memory-save.ts');
    const responseBuilderPath = path.resolve(__dirname, '..', 'handlers', 'save', 'response-builder.ts');
    const bulkDeletePath = path.resolve(__dirname, '..', 'handlers', 'memory-bulk-delete.ts');
    const saveSource = fs.readFileSync(savePath, 'utf8');
    const responseBuilderSource = fs.readFileSync(responseBuilderPath, 'utf8');
    const bulkDeleteSource = fs.readFileSync(bulkDeletePath, 'utf8');

    expect(saveSource).not.toContain('invalidateEntityDensityCacheAfterSave');
    expect(bulkDeleteSource).not.toContain('invalidateEntityDensityCacheAfterBulkDelete');
    expect(responseBuilderSource).toContain('statediffActions: [createStatediffAction');
    expect(saveSource).toContain("sourceOperation: 'atomic-save'");
    expect(bulkDeleteSource).toContain("sourceOperation: 'bulk-delete'");
  });
});
