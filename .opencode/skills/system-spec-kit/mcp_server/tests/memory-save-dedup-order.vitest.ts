import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Memory-save dedup ordering regressions', () => {
  it('T080-1 checks content-hash dedup before the chunking branch', () => {
    const sourcePath = path.resolve(__dirname, '..', 'handlers', 'memory-save.ts');
    const source = fs.readFileSync(sourcePath, 'utf8');

    const duplicatePrecheckIndex = source.indexOf('const duplicatePrecheck = checkContentHashDedup');
    const chunkBranchIndex = source.indexOf('if (shouldChunkContent)');
    const chunkedIndexerIndex = source.indexOf('const chunkedResult = await indexChunkedMemoryFile(');

    expect(duplicatePrecheckIndex).toBeGreaterThan(-1);
    expect(chunkBranchIndex).toBeGreaterThan(-1);
    expect(chunkedIndexerIndex).toBeGreaterThan(-1);
    expect(duplicatePrecheckIndex).toBeLessThan(chunkBranchIndex);
    expect(duplicatePrecheckIndex).toBeLessThan(chunkedIndexerIndex);
  });

  it('repairs replay enrichment before both dedup returns', () => {
    const sourcePath = path.resolve(__dirname, '..', 'handlers', 'memory-save.ts');
    const source = fs.readFileSync(sourcePath, 'utf8');

    const duplicatePrecheckBranchIndex = source.indexOf('if (duplicatePrecheck) {');
    const duplicatePrecheckRepairIndex = source.indexOf(
      'await repairReplayEnrichmentIfNeeded(database, duplicatePrecheck.id, routedParsed);',
      duplicatePrecheckBranchIndex,
    );
    const duplicatePrecheckReturnIndex = source.indexOf('return duplicatePrecheck;', duplicatePrecheckBranchIndex);

    const dupResultBranchIndex = source.indexOf('if (dupResult) {');
    const dupResultRepairIndex = source.indexOf(
      'await repairReplayEnrichmentIfNeeded(database, dupResult.id, routedParsed);',
      dupResultBranchIndex,
    );
    const dupResultReturnIndex = source.indexOf('return dupResult;', dupResultBranchIndex);

    expect(duplicatePrecheckBranchIndex).toBeGreaterThan(-1);
    expect(duplicatePrecheckRepairIndex).toBeGreaterThan(duplicatePrecheckBranchIndex);
    expect(duplicatePrecheckRepairIndex).toBeLessThan(duplicatePrecheckReturnIndex);

    expect(dupResultBranchIndex).toBeGreaterThan(-1);
    expect(dupResultRepairIndex).toBeGreaterThan(dupResultBranchIndex);
    expect(dupResultRepairIndex).toBeLessThan(dupResultReturnIndex);
  });

  it('marks enrichment pending in the write transaction and records the post-insert result afterward', () => {
    const sourcePath = path.resolve(__dirname, '..', 'handlers', 'memory-save.ts');
    const source = fs.readFileSync(sourcePath, 'utf8');

    const transactionIndex = source.indexOf('const writeTransaction = database.transaction((): number => {');
    const markPendingIndex = source.indexOf(
      'markEnrichmentPending(database, memoryId, POST_INSERT_ENRICHMENT_VERSION);',
      transactionIndex,
    );
    const transactionReturnIndex = source.indexOf('return memoryId;', markPendingIndex);
    const transactionEndIndex = source.indexOf('});', transactionReturnIndex);

    // Enrichment moved behind an async/sync branch (let-declared above the if); the synchronous
    // branch preserves the pending-then-record ordering this test guards.
    const runPostInsertIndex = source.indexOf('postInsertEnrichmentResult = await runPostInsertEnrichmentIfEnabled(');
    const recordResultIndex = source.indexOf('recordEnrichmentResult(database, id, postInsertEnrichmentResult);', runPostInsertIndex);
    const invalidateIndex = source.indexOf('invalidateEntityDensityCacheAfterSave();', recordResultIndex);

    expect(transactionIndex).toBeGreaterThan(-1);
    expect(markPendingIndex).toBeGreaterThan(transactionIndex);
    expect(markPendingIndex).toBeLessThan(transactionEndIndex);

    expect(runPostInsertIndex).toBeGreaterThan(-1);
    expect(recordResultIndex).toBeGreaterThan(runPostInsertIndex);
    expect(recordResultIndex).toBeLessThan(invalidateIndex);
  });
});
