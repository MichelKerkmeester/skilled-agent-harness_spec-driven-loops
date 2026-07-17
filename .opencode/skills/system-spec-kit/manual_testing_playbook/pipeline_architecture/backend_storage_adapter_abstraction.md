---
title: "202 -- Backend storage adapter abstraction"
description: "This scenario validates Backend storage adapter abstraction for `202`. It focuses on verifying that the five typed storage ports exist, keep SQLite as the concrete backend, and have adapter/fake contract coverage."
audited_post_018: true
version: 3.6.0.13
id: pipeline-architecture-backend-storage-adapter-abstraction
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 202 -- Backend storage adapter abstraction

## 1. OVERVIEW

This scenario validates Backend storage adapter abstraction for `202`. It focuses on verifying that `VectorStore`, `LexicalSearch`, `GraphTraversal`, `Maintenance`, and `ContentionPolicy` exist as typed storage ports, that each current implementation remains behavior-preserving over SQLite-backed code, and that fakes plus contract tests cover the port surface.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the shipped storage abstraction consists of five typed ports with better-sqlite3 adapters, storage-free fakes, and shared contract tests while preserving SQLite as the concrete backend.
- Real user request: `` Please validate Backend storage adapter abstraction against the documented validation surface and tell me whether the expected signals are present: `VectorStore`, `LexicalSearch`, `GraphTraversal`, `Maintenance`, and `ContentionPolicy` are exported from the storage port module; each current adapter preserves the existing SQLite-backed behavior; `tests/storage-ports-contract.vitest.ts` exercises adapter and fake contracts; `tests/fakes/storage-ports.ts` provides storage-free fakes; GraphTraversal and LexicalSearch are supplied by the traversal-helper and packed-BM25 work. ``
- Prompt: `Validate backend storage adapter abstraction against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: five typed ports exported from `mcp_server/lib/storage/ports/index.ts`; better-sqlite3 adapters present for all five current implementations; fakes present for all five ports; shared contract tests cover adapter and fake behavior; docs preserve the SQLite-remains-concrete framing
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all five ports, current adapters, fakes, and contract tests are present and the documentation does not imply a completed non-SQLite backend; FAIL if any port family is missing, adapter/fake parity is absent, or the docs revert to vector-only or overstate multi-backend support

---

## 3. TEST EXECUTION

### Prompt

```
Validate backend storage adapter abstraction against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Review `mcp_server/lib/storage/ports/index.ts` and confirm the five exported port families
2. Review each port implementation file and identify the current better-sqlite3 or packed-BM25 adapter
3. Review `mcp_server/tests/fakes/storage-ports.ts` and confirm storage-free fakes exist for all five ports
4. Review `mcp_server/tests/storage-ports-contract.vitest.ts` and confirm adapter/fake contract coverage for the port families
5. Confirm the documentation keeps the behavior-preserving framing: SQLite remains the concrete backend and the ports do not claim a fully swapped backend

### Expected

`VectorStore`, `LexicalSearch`, `GraphTraversal`, `Maintenance`, and `ContentionPolicy` are exported; better-sqlite3 or packed-BM25 adapters exist for current behavior; fakes exist for all five ports; contract tests cover adapter/fake parity; the docs keep the behavior-preserving SQLite backend framing

### Evidence

Observed port file discovery output:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/lexical-search.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/maintenance.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/contention-policy.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/common.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/graph-traversal.ts
```

Observed port exports from `mcp_server/lib/storage/ports/index.ts`:

```text
11:   ContentionPolicy,
14: export { BetterSqliteContentionPolicy, isSqliteContentionError } from './contention-policy.js';
18:   Maintenance,
22: export { BetterSqliteMaintenance } from './maintenance.js';
24:   BetterSqliteGraphTraversal,
27:   type GraphTraversal,
34:   PackedBm25LexicalSearch,
37:   type LexicalSearch,
42: export { BetterSqliteVectorStore } from './vector-store.js';
48:   VectorStore,
```

Observed adapter implementation trace:

```text
mcp_server/lib/storage/ports/vector-store.ts
126: /** better-sqlite3-backed vector-store adapter. */
127: export class BetterSqliteVectorStore<TMetadata extends VectorMetadata = VectorMetadata>

mcp_server/lib/storage/ports/lexical-search.ts
58: /**
59:  * Packed BM25 lexical-search adapter over the shipped in-memory engine.
66: export class PackedBm25LexicalSearch implements LexicalSearch {

mcp_server/lib/storage/ports/graph-traversal.ts
53: /** better-sqlite3-backed graph traversal adapter. */
54: export class BetterSqliteGraphTraversal implements GraphTraversal {

mcp_server/lib/storage/ports/maintenance.ts
40: /** better-sqlite3 implementation of operational storage maintenance. */
41: export class BetterSqliteMaintenance implements Maintenance {

mcp_server/lib/storage/ports/contention-policy.ts
66: /** better-sqlite3 implementation of contention retry and write-lock policy. */
67: export class BetterSqliteContentionPolicy implements ContentionPolicy {
```

Observed fake implementation trace from `mcp_server/tests/fakes/storage-ports.ts`:

```text
54: /** Storage-free graph traversal test double. */
55: export class FakeGraphTraversal implements GraphTraversal {
122: /** Storage-free lexical search test double. */
123: export class FakeLexicalSearch implements LexicalSearch {
184: /**
185:  * Storage-free vector store test double.
193: export class FakeVectorStore<TMetadata extends VectorMetadata = VectorMetadata> implements VectorStore<TMetadata> {
244: /** Storage-free maintenance test double. */
245: export class FakeMaintenance implements Maintenance {
266: /**
267:  * Storage-free contention policy test double.
274: export class FakeContentionPolicy implements ContentionPolicy {
```

Observed contract-test transcript from `mcp_server/tests/storage-ports-contract.vitest.ts`:

```text
12: import {
13:   BetterSqliteContentionPolicy,
14:   BetterSqliteGraphTraversal,
15:   BetterSqliteMaintenance,
16:   BetterSqliteVectorStore,
17:   PackedBm25LexicalSearch,
18:   type ContentionPolicy,
19:   type GraphTraversal,
20:   type LexicalSearch,
21:   type Maintenance,
22:   type VectorMetadata,
23:   type VectorStore,
24: } from '../lib/storage/ports';
25: import {
26:   FakeContentionPolicy,
27:   FakeGraphTraversal,
28:   FakeLexicalSearch,
29:   FakeMaintenance,
30:   FakeVectorStore,
31: } from './fakes/storage-ports';
485: runGraphTraversalContract('BetterSqliteGraphTraversal contract', () => {
493: runGraphTraversalContract('FakeGraphTraversal contract', () => ({
498: runLexicalSearchContract('PackedBm25LexicalSearch contract', () => ({
503: runLexicalSearchContract('FakeLexicalSearch contract', () => ({
508: runVectorStoreContract('BetterSqliteVectorStore contract', createBetterSqliteVectorSubject);
510: runVectorStoreContract('FakeVectorStore contract', () => ({
515: runMaintenanceContract('BetterSqliteMaintenance contract', createBetterSqliteMaintenanceSubject);
517: runMaintenanceContract('FakeMaintenance contract', () => ({
522: runContentionPolicyContract('BetterSqliteContentionPolicy contract', createBetterSqliteContentionSubject);
524: runContentionPolicyContract('FakeContentionPolicy contract', () => ({
```

Observed documentation excerpt showing SQLite remains the concrete backend from `feature_catalog/pipeline_architecture/backend_storage_adapter_abstraction.md`:

```text
3: description: "Backend storage adapter abstraction now exists as five typed storage ports while SQLite remains the concrete backend."
19: Backend storage adapter abstraction now exists as five shipped typed storage ports while SQLite remains the concrete backend.
21: The system is still SQLite-backed, but it is no longer hard-wired directly at every storage boundary. A port layer now defines contracts for vector storage, lexical search, graph traversal, maintenance, and contention handling. Each port has a better-sqlite3-backed adapter for current production behavior and a storage-free fake for tests. It is like changing from plugging appliances straight into the wall to using standardized socket adapters first: the same power source remains, but the coupling points are cleaner and easier to replace if a real multi-backend need appears.
27: **IMPLEMENTED.** The shipped port set is `VectorStore`, `LexicalSearch`, `GraphTraversal`, `Maintenance`, and `ContentionPolicy` under `mcp_server/lib/storage/ports/`. The current adapters are `BetterSqliteVectorStore`, `PackedBm25LexicalSearch`, `BetterSqliteGraphTraversal`, `BetterSqliteMaintenance`, and `BetterSqliteContentionPolicy`. The 012 traversal-helper work supplied the `GraphTraversal` adapter shape, and the 014 packed-BM25 work supplied the `LexicalSearch` adapter shape.
29: The extraction is behavior-preserving. SQLite remains the concrete backend; the ports make current seams explicit without claiming that every storage call site has moved behind a backend-agnostic API. Contract tests run the same expectations against the better-sqlite3 adapters and the fakes in `mcp_server/tests/fakes/storage-ports.ts`, so new routing can be validated without opening SQLite where a fake is sufficient.
```

### Pass / Fail

- **PASS**: all five port families are exported, current better-sqlite3 or packed-BM25 adapters are present, storage-free fakes cover all five ports, shared contract tests exercise adapter/fake parity, and the feature documentation preserves the SQLite-remains-concrete boundary.

### Failure Triage

Inspect `mcp_server/lib/storage/ports/index.ts`, the five port implementation files, `mcp_server/tests/fakes/storage-ports.ts`, and `mcp_server/tests/storage-ports-contract.vitest.ts`; if behavior drift appears, check the implementation summary decisions for intentionally unrouted lexical/vector lifecycle exceptions

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/backend_storage_adapter_abstraction.md](../../feature_catalog/pipeline_architecture/backend_storage_adapter_abstraction.md)
- Implementation anchors: `mcp_server/lib/storage/ports/index.ts`, `mcp_server/tests/storage-ports-contract.vitest.ts`, `mcp_server/tests/fakes/storage-ports.ts`

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 202
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/backend_storage_adapter_abstraction.md`
