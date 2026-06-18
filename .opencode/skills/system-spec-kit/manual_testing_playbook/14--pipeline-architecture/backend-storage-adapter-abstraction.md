---
title: "202 -- Backend storage adapter abstraction"
description: "This scenario validates Backend storage adapter abstraction for `202`. It focuses on verifying that the five typed storage ports exist, keep SQLite as the concrete backend, and have adapter/fake contract coverage."
audited_post_018: true
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

Port exports + adapter implementation trace + fake implementation trace + contract-test transcript + documentation excerpt showing SQLite remains the concrete backend

### Pass / Fail

- **Pass**: all five port families are present with current adapters, fakes, and contract coverage, and the docs preserve the SQLite-remains-concrete boundary
- **Fail**: any port family is missing, fake/contract coverage is absent, or the documentation says only vector storage is abstracted or implies a non-SQLite backend is already shipped

### Failure Triage

Inspect `mcp_server/lib/storage/ports/index.ts`, the five port implementation files, `mcp_server/tests/fakes/storage-ports.ts`, and `mcp_server/tests/storage-ports-contract.vitest.ts`; if behavior drift appears, check the implementation summary decisions for intentionally unrouted lexical/vector lifecycle exceptions

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/backend-storage-adapter-abstraction.md](../../feature_catalog/14--pipeline-architecture/backend-storage-adapter-abstraction.md)
- Implementation anchors: `mcp_server/lib/storage/ports/index.ts`, `mcp_server/tests/storage-ports-contract.vitest.ts`, `mcp_server/tests/fakes/storage-ports.ts`

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 202
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/backend-storage-adapter-abstraction.md`
