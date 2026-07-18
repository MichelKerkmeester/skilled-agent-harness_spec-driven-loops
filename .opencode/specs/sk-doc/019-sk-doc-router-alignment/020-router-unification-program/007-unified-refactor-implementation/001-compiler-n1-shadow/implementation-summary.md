---
title: "Implementation Summary: Shadow Compiler and mcp-code-mode N=1"
description: "Closed the second-review compiler, projection, activation, parity, and read-only harness findings while preserving the shadow-only boundary."
trigger_phrases:
  - "shadow compiler implementation summary"
  - "mcp-code-mode n1 compiled policy"
  - "shadow parity rollback evidence"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary: Shadow Compiler and mcp-code-mode N=1

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Completed** | 2026-07-18 |
| **Level** | 2 |
| **Local Status** | Read-only shadow harness passes; per-hub activation remains deferred |
| **External Status** | Strict packet validation not run, per explicit instruction; metadata was not regenerated |
| **Live Authority** | None; legacy remains serving-authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The phase now compiles authored router sources with locale-independent ordering, complete destination identity, strict authored-input closure, a full pre-hash schema gate, and an explicit N=1 single-selection invariant. The default harness performs no disk writes: it regenerates projections in memory, executes protected scorer/parity code across read-only subprocess boundaries, and runs negative, activation, drift, and rollback drills over copied objects and buffers.

### Artifact Groups

| Group | Action | Purpose |
|-------|--------|---------|
| `compiler/*.cjs` | Created (7) | Parse/clone/validate authored sources, apply shared UTF-16 ordering, close references, evaluate decisions, and generate projections |
| `compiled/mcp-code-mode/` | Created (9) | Canonical policy, three projections, and five typed fixture families |
| `parity/shadow-parity.cjs` | Created | Compare typed and legacy decisions while deriving checked-manifest authority and observed effect totals |
| `activation/` | Created (5) | Validate shadow-only manifests, model fenced transitions in memory, retain prior/candidate manifests, and implement the filesystem CAS path |
| `harness/` | Created (6) | Explicit generation, schema checks, protected subprocess replay, locale/process determinism, in-memory falsifiers, and acceptance driver |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Updated | Record phase-local status, completed tasks, evidence, and the phase-external deferral |
| `implementation-summary.md` | Created | Record delivery, decisions, verification, and limitations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The compiler canonical-clones caller input, rejects unknown or unsupported authored fields, constructs the candidate, validates the complete shape against the frozen policy schema with placeholder digests, then computes and revalidates real hashes. Complete destination identity includes the optional runtime discriminator, while workflow-only references fail when that identity is ambiguous. The harness generates all nine checked artifacts from one snapshot and byte-compares them; only `--write` emits checked-in bytes. Protected router/scorer modules run in read-only child processes, while activation and rollback copy manifests into a pure in-memory fenced state machine.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse Phase 0 `canonical.cjs` for every canonical byte and domain hash | One identity implementation keeps compiler output byte-consistent with the frozen contract (synthesis §2.1) |
| Treat N=1 as partial evaluation over cardinality and empty inputs | The degenerate case remains the default contract, with no singleton compiler or skill-name branch (synthesis §5.1, §5.3) |
| Reject any authored bundle when candidate cardinality is one | A one-candidate policy can expose only `single`; silently retaining a bundle would violate the shared contract |
| Preserve admission and leaf routing inside the single destination | Cardinality one removes ranking, not positive/negative admission, seven-leaf resolution, near-tie clarification, or zero-signal deferral (synthesis §5.2) |
| Keep advisor and parity outputs evidence-only | A recommendation is not a capability; authority remains destination-local and negative decisions carry none (synthesis §2.3, §8.1, §10) |
| Project legacy observation fields without modifying the scorer | Typed decisions can coexist with the current deterministic benchmark contract while preserving baseline comparability (synthesis §8.2, §10) |
| Separate monotonic fence state from byte-exact manifest bytes | Rollback can restore the retained manifest exactly while stale epochs remain permanently fenced out (synthesis §9) |
| Generate the policy card from the compiled snapshot | The document-only view cannot silently drift from machine policy and can state its un-attested terminal honestly (synthesis §8.3) |
| Compare all ordered compiler/projection data by UTF-16 code units | Canonical ordering remains identical under different host locales and matches the frozen canonical serializer |
| Treat `runtimeDiscriminator` as part of destination identity | Two runtime variants remain distinct; ambiguous workflow-only references fail closed instead of choosing one |
| Recursively strip advisor authority-bearing fields before hashing | Nested paths, tools, mutation scope, fences, leases, and commit authority cannot survive future projection reshaping |
| Validate shadow manifests locally and compare current generation/hash immediately before rename | The filesystem CAS cannot install malformed or authority-bearing manifests and closes the final stale-current window |
| Defer receipt idempotency in typed route gold | This phase never executes receipts, so the projection records `false` instead of claiming untested behavior |
| Keep default verification packet-read-only | Read-only sandboxes can run the full gate; checked-in regeneration remains an explicit `--write` operation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 0 dependency | PASS: 11/11 contract harness groups before implementation |
| Determinism | PASS: 3 in-process and 2 isolated-process compiles; body SHA-256 `41fb01c03ce8fa4f8a32d2ca5362dcda3e6c6fa7ed80668067d4cee01e4174e2`; effective hash `3ade42a8ce250ed9b04e6020b7b6782b7de19f7f13e00fcd3c377748647f7de5`; `z`/`ä` fixture matches under `en_US.UTF-8` and `sv_SE.UTF-8` |
| Degeneracy and no name branch | PASS: one candidate, single selection, empty cross-target/bundle/handoff collections, null overlay, static posture, 7 leaves, 6 selectors, and 3 identity-normalized metamorphic variants covering advisor, policy-card, and every typed-route-gold byte projection |
| Fail-closed and reference closure | PASS: eight exact typed errors/no-artifact assertions include an unexpected nested path, unsupported overlay, and N=1 bundle; caller-owned detector objects remain unfrozen |
| Advisor projection | PASS: a nested path/tools object is recursively omitted; two same-name runtime-discriminated modes remain distinct by qualified identity |
| Scorer and inputs untouched | PASS: 5 baseline files, 9 schemas, and the 28-file playbook tree match; protected router/scorer digests match trusted constants; 5 real-scorer rows pass while extra-resource and fabricated-oracle falsifiers fail |
| Shadow parity | SHADOW-PARTIAL: the validated checked manifest derives legacy authority; observed effect arrays total zero; one match and three classified mismatches; per-hub activation remains deferred |
| Rollback | PASS in memory: pre/restored SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`; fence advanced to 2; stale epochs, generation/hash CAS mismatch, malformed manifest, and authority-bearing manifest were rejected |
| One-snapshot projections | PASS: 9 artifacts byte-match in-memory regeneration at effective hash `3ade42a8ce250ed9b04e6020b7b6782b7de19f7f13e00fcd3c377748647f7de5`; a re-hashed drift mutation raises `ARTIFACT_DRIFT` |
| Document-only route | PASS: single route emits `PREPARED_DRAFT`; clarify/defer/reject resolve; all terminate `DOCUMENT_ONLY_UNATTESTED` |
| Static quality | PASS: `node --check` on 14 CommonJS files, comment hygiene clean on all modified code, alignment drift scanned 29 files with 0 findings/errors/warnings/violations |
| Dependencies and network | PASS: every phase import resolves against Node built-ins, phase-local files, two frozen contract files, or the two digest-pinned protected replay files; dynamic imports 0; no network call |
| Default command | PASS: `node harness/run-phase.cjs` exits 0 and asserts the complete phase-tree hash is unchanged before/after verification; the same entry point exits 0 with parent-process filesystem mutation APIs forced to `EROFS` |
| Strict spec validation | NOT RUN: the request explicitly prohibited `validate.sh`; no strict packet-level completion claim is made |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The frozen `CompiledPolicyV1` schema does not define literal `candidateCount`, `selectionKinds`, `crossTargetEdges`, `bundleRules`, `handoffEdges`, or `overlay` fields. The harness derives the N=1 view from declared collections, and the compiler rejects unsupported overlay/cross-target/handoff input plus any one-candidate bundle before producing an artifact.
2. Phase 0 does not provide an `ActivationManifestV1` schema. This phase enforces an exact local V1 shape with `servingAuthority="legacy"` and `shadowOnly=true`; a later contract phase still needs to freeze the shared schema before live activation.
3. Activation evidence is `shadow-partial`. The read-only harness proves the validation, fencing, generation/hash CAS, pinning, and byte-exact rollback state machine in memory. It does not execute the filesystem rename path or prove any installed hub's live serving authority; those remain deferred to per-hub activation.
4. The parity report derives authority from the validated checked manifest and derives zero mutation evidence from emitted effect arrays. It does not claim that a deployed hub emitted no effects outside this run.
5. The metamorphic rename test compares every normalized projection byte family and evaluations. The lexical branch scan remains only a secondary signal; an AST-based scan would provide stronger proof against syntactically disguised name branches.
6. The request prohibited dependency installation. The harness invokes the protected `evaluateRouteGold` implementation in a read-only subprocess for five compatibility-projected rows and proves two falsifiers go red, but it does not claim the repository's full Vitest suite ran.
7. Advancing the monotonic fence before the manifest rename is fail-closed: a crash in that narrow interval consumes an epoch while leaving the old manifest selected. The next operator must read the advanced fence and retry; no automated recovery helper exists in this shadow phase.
8. The master-plan phase map is outside the authorized phase folder and was not updated. Strict validation and metadata regeneration were also not run; local continuity remains at 95% rather than claiming packet-level completion.
<!-- /ANCHOR:limitations -->
