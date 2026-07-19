---
title: "229 -- Lazy-loading migration and warmup compatibility"
description: "This scenario validates Lazy-loading migration and warmup compatibility for `229`. It focuses on confirming lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces."
audited_post_018: true
phase_018_change: "Validated against phase-018 canonical continuity refactor; confirms lazy startup is canonical and warmup flags remain compatibility-only."
version: 3.6.0.13
id: implement-and-remove-deprecated-features-lazy-loading-migration
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 229 -- Lazy-loading migration and warmup compatibility

## 1. OVERVIEW

This scenario validates Lazy-loading migration and warmup compatibility for `229`. It focuses on confirming lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces.
- Real user request: `` Please validate Lazy-loading migration and warmup compatibility against the documented validation surface and tell me whether the expected signals are present: The targeted lazy-loading and context-server tests pass, `shouldEagerWarmup()` stays false by default, startup logs say lazy loading is enabled, and the deprecated warmup flags are only acknowledged in compatibility messaging. ``
- Prompt: `Validate lazy-loading migration and warmup compatibility against the documented validation surface.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: The targeted lazy-loading and context-server tests pass, `shouldEagerWarmup()` stays false by default, startup logs say lazy loading is enabled, and the deprecated warmup flags are only acknowledged in compatibility messaging
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted checks confirm startup always follows the lazy path and the legacy warmup flags do not restore eager initialization behavior

---

## 3. TEST EXECUTION

### Prompt

```
Validate that embedding startup now stays on lazy initialization and that the legacy warmup flags only remain as deprecated compatibility surfaces. Run the targeted checks, capture the evidence that proves lazy startup is the shipped behavior, and return a concise pass/fail verdict with the main reason.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp-server`
2. `npx vitest run tests/lazy-loading.vitest.ts tests/context-server.vitest.ts`
3. `sed -n '2090,2120p' context-server.ts`
4. `rg -n "shouldEagerWarmup|getLazyLoadingStats|preWarmModel|SPECKIT_EAGER_WARMUP|SPECKIT_LAZY_LOADING" lib/providers/embeddings.ts ../shared/embeddings.ts context-server.ts tests/lazy-loading.vitest.ts`

### Expected

The targeted lazy-loading and context-server tests pass, `shouldEagerWarmup()` stays false by default, startup logs say lazy loading is enabled, and the deprecated warmup flags are only acknowledged in compatibility messaging

### Evidence

Command 1:

```console
$ cd .opencode/skills/system-spec-kit/mcp-server
(no output)
```

Command 2:

```console
$ npx vitest run tests/lazy-loading.vitest.ts tests/context-server.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  395 passed (395)
   Start at  01:55:28
   Duration  815ms (transform 395ms, setup 15ms, import 103ms, tests 580ms, environment 0ms)
```

Command 3:

```console
$ sed -n '2090,2120p' context-server.ts
  // Pass sessionManager and incrementalIndex so db-state can refresh their DB
  // handles during reinitializeDatabase(), preventing stale refs.
  initDbState({
    vectorIndex,
    checkpoints: checkpointsLib,
    accessTracker,
    hybridSearch,
    sessionManager,
    incrementalIndex,
    dbConsumers: [
      sessionBoost,
      causalBoost,
      historyStore,
      workingMemory,
      attentionDecay,
      coActivation,
    ],
  });

  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');

  // Integrity check and module initialization
  try {
    const report = vectorIndex.verifyIntegrity();
    console.error(`[context-server] Integrity check: ${report.totalMemories}/${report.totalMemories + report.missingVectors} valid entries`);
    if (report.orphanedVectors > 0) console.error(`[context-server] WARNING: ${report.orphanedVectors} orphaned entries detected`);

    // Validate embedding dimension matches database
    const dimValidation = vectorIndex.validateEmbeddingDimension();
    if (!dimValidation.valid) {
```

Command 4:

```console
$ rg -n "shouldEagerWarmup|getLazyLoadingStats|preWarmModel|SPECKIT_EAGER_WARMUP|SPECKIT_LAZY_LOADING" lib/providers/embeddings.ts ../shared/embeddings.ts context-server.ts tests/lazy-loading.vitest.ts
tests/lazy-loading.vitest.ts:10:  'SPECKIT_EAGER_WARMUP',
tests/lazy-loading.vitest.ts:11:  'SPECKIT_LAZY_LOADING',
tests/lazy-loading.vitest.ts:49:  it('T016: shouldEagerWarmup() is false by default', async () => {
tests/lazy-loading.vitest.ts:50:    delete process.env.SPECKIT_EAGER_WARMUP;
tests/lazy-loading.vitest.ts:51:    delete process.env.SPECKIT_LAZY_LOADING;
tests/lazy-loading.vitest.ts:54:    expect(embeddings.shouldEagerWarmup()).toBe(false);
tests/lazy-loading.vitest.ts:72:    const stats = embeddings.getLazyLoadingStats();
../shared/embeddings.ts:365: * - SPECKIT_EAGER_WARMUP=true: Force eager loading at startup (legacy behavior)
../shared/embeddings.ts:366: * - SPECKIT_LAZY_LOADING=false: Alias for SPECKIT_EAGER_WARMUP=true
../shared/embeddings.ts:378: * SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING env vars are inert.
../shared/embeddings.ts:380:function shouldEagerWarmup(): boolean {
../shared/embeddings.ts:461:function getLazyLoadingStats(): LazyLoadingStats {
../shared/embeddings.ts:465:    eagerWarmupEnabled: shouldEagerWarmup(),
../shared/embeddings.ts:869:async function preWarmModel(): Promise<boolean> {
../shared/embeddings.ts:950:  preWarmModel,
../shared/embeddings.ts:960:  shouldEagerWarmup,
../shared/embeddings.ts:961:  getLazyLoadingStats,
context-server.ts:2110:  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
lib/providers/embeddings.ts:26:  preWarmModel,
lib/providers/embeddings.ts:34:  shouldEagerWarmup,
lib/providers/embeddings.ts:35:  getLazyLoadingStats,
```

Observed comparison: the targeted Vitest command passed, the `sed` output shows startup logs for lazy initialization and deprecated compatibility flags, and the `rg` output shows `shouldEagerWarmup()` is tested false by default plus deprecated flag compatibility references.

### Pass / Fail

- **PASS**: the targeted tests passed, and the documented command sequence produced the expected lazy startup branch/source excerpt evidence.

### Failure Triage

Inspect `context-server.ts`, `lib/providers/embeddings.ts`, and `../shared/embeddings.ts`; confirm no test setup or shell environment is forcing legacy warmup behavior

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [implement-and-remove-deprecated-features/lazy-loading-migration-and-warmup-compatibility.md](../../feature-catalog/implement-and-remove-deprecated-features/lazy-loading-migration-and-warmup-compatibility.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 229
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `implement-and-remove-deprecated-features/lazy-loading-migration.md`
