---
title: "Feature Specification: Phase 1: continuity-freshness-claim-binding"
description: "CONTINUITY_FRESHNESS reads completion claims from four documents but can only verify a fingerprint on one of them, so a legitimately closed packet and an unverifiable one both report the same silent pass."
trigger_phrases:
  - "continuity freshness claim binding"
  - "continuity freshness binding spec"
  - "CONTINUITY_FRESHNESS claim rule"
  - "six completion docs fingerprint"
  - "attestation point implementation summary"
  - "no completion claim timestamp"
  - "fingerprint stamp trigger writer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: continuity-freshness-claim-binding

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | `../002-scripts-into-runtime-nesting/spec.md` |
| **Handoff Criteria** | `validate.sh --strict` passes on this folder and the new/extended cases in `continuity-freshness.vitest.ts` are green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the decommission debt fixes specification.

**Scope Boundary**: `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts`, the continuity writer's fingerprint assembly, and the orchestrator's shell-rule status mapping. No other CONTINUITY_FRESHNESS-adjacent rule (`GENERATED_METADATA_INTEGRITY`, `POST_SAVE_FINGERPRINT`) is touched.

**Dependencies**:
- None on the other six phases; this phase can start immediately.

**Deliverables**:
- A documented claim-to-fingerprint binding rule, implemented in `continuity-freshness.ts`.
- A continuity-writer change so a fresh completion claim always carries a fingerprint.
- A distinguishable "skip" signal that does not change the pass/warn/fail severity already shipped.
- Extended `continuity-freshness.vitest.ts` coverage.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`evaluateCompletionFreshness` (`.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:292-349`) scans `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md` and `handover.md` for a completion claim (`completion_pct === 100` or a status matching `complete|completed|done|shipped|implemented`, read from either frontmatter `status` or the metadata-table `**Status**` row). Only `implementation-summary.md` is ever populated with a real `_memory.continuity.session_dedup.fingerprint` by the continuity writer, so any packet that claims completion in `spec.md` without a matching fingerprint anywhere returns `buildPass('missing_fingerprint', ...)` — a `pass`, not a distinguishable skip. Packet `052-memory-decommission-landing` is a live instance: its `implementation-summary.md:23` carries the all-zero `ZERO_CONTINUITY_FINGERPRINT` placeholder while `spec.md`'s metadata table says `Status: Complete`; running the rule directly (`SPECKIT_COMPLETION_FRESHNESS=1 node continuity-freshness.ts --folder specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing --json`) confirms `evaluateCompletionFreshness` resolves to the `zero_fingerprint` code, but because that code's `status` is `pass` and not `no_completion_claim`, `validateContinuityFreshness` (lines 376-382) does not return it — it falls through to the separate `last_updated_at`-versus-`graph-metadata` staleness check, which reported `stale` for this packet. The fingerprint signal is not just silently "pass", it is silently discarded. A prior attempt to make `missing_fingerprint`/`zero_fingerprint` a `warn` was reverted because it then flagged every already-closed packet that predates fingerprint tracking. Separately, `runCli()` (lines 538-546) gates the whole rule on `SPECKIT_COMPLETION_FRESHNESS`, while the exported `validateContinuityFreshness()` performs no such check, so a caller that imports the function directly (as `scripts/tests/continuity-freshness.vitest.ts:9,96-171` already does) bypasses the opt-in entirely.

### Purpose
A completion claim binds to exactly one documented fingerprint owner, the rule can report "no verifiable evidence" as a status distinguishable from "verified fresh" without re-triggering the reverted regression, and the CLI-versus-function opt-in gap is either closed or explicitly tested as intentional.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Decide and document the binding model: `implementation-summary.md`'s `_memory.continuity.session_dedup.fingerprint` is the one attestation point for a packet's completion claim, since it is the only document the continuity writer populates today and it is already the first-checked file in `COMPLETION_DOCS`.
- Add a `skip` status (or an equivalent explicit code family) to `ContinuityFreshnessResult` for `no_completion_claim`, `missing_fingerprint`, `zero_fingerprint`, `missing_frontmatter`, `missing_graph_metadata`, `missing_graph_timestamp`, `implementation_summary_missing` and `not_opted_in`, without changing which of those exit codes are non-blocking today.
- Fix the fall-through in `validateContinuityFreshness` (lines 376-382) so a `zero_fingerprint`/`missing_fingerprint` result is not silently replaced by an unrelated timestamp-staleness verdict.
- Make the continuity writer (`scripts/memory/generate-context.ts`, via `scripts/core/memory-metadata.ts:185` and `runtime/lib/continuity/thin-continuity-record.ts`) stamp a real `session_dedup.fingerprint` whenever it writes a document that carries a completion claim, so a freshly-saved completed packet never lands in `missing_fingerprint`.
- Give the orchestrator's shell-rule bridge (`.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` — `parseShellRuleOutput` and `mapShellRuleStatus`, around lines 275-297) a way to carry the new skip signal into `validate.sh --strict` JSON output without changing the aggregate pass/fail decision for existing packets.
- Extend `scripts/tests/continuity-freshness.vitest.ts` (currently 177 lines covering only the `last_updated_at`-vs-`graph-metadata` drift path) with cases for: claim with a real fingerprint (`fresh_completion`), claim with no fingerprint anywhere (`missing_fingerprint`, now a distinguishable skip), the zero-fingerprint placeholder (`zero_fingerprint`), and the CLI opt-out (`not_opted_in`) versus the unguarded exported function.

### Out of Scope
- Changing what counts as a completion claim (`hasCompletionClaim`'s `completion_pct === 100` / `isCompletionStatus` regex) - a separate decision with its own blast radius across every packet that ever set `status: complete`.
- `GENERATED_METADATA_INTEGRITY` and `POST_SAVE_FINGERPRINT`, the two sibling rules registered against the same `spec-doc-structure.ts` module - they read a different fingerprint contract and are not part of this seam.
- Re-running the reverted "warn on missing fingerprint" change wholesale - this phase changes only the skip/pass distinguishability, not the severity, so it cannot repeat that regression.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts` | Modify | Bind the completion-freshness result ahead of the timestamp-staleness fall-through; add the skip code family |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Trigger a fingerprint stamp when a completion claim is present in the document being written |
| `.opencode/skills/system-spec-kit/scripts/core/memory-metadata.ts` | Modify | Carry the fingerprint through the `session_dedup` assembly path (line 185 reads it; the write side needs the same binding) |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | `parseShellRuleOutput`/`mapShellRuleStatus` recognize the new skip signal without changing aggregate severity |
| `.opencode/skills/system-spec-kit/scripts/tests/continuity-freshness.vitest.ts` | Modify | Add claim-with-fingerprint, claim-without, zero-placeholder and opted-out cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A completion claim in any of the six `COMPLETION_DOCS` binds to `implementation-summary.md`'s `session_dedup.fingerprint` as the single documented attestation point, and this binding is stated in code comments and this spec, not left implicit |
| REQ-002 | `validateContinuityFreshness` returns the completion-freshness verdict (`fresh_completion`, `content_stale`, `dirty_tree`, `missing_fingerprint`, `zero_fingerprint`) without letting the unrelated timestamp-staleness check silently override a `pass`-status completion result |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The continuity writer stamps a real, non-zero `session_dedup.fingerprint` whenever it writes a document carrying a completion claim, so `missing_fingerprint` stops being the default state for a freshly-saved completed packet |
| REQ-004 | The rule's skip codes (`no_completion_claim`, `missing_fingerprint`, `zero_fingerprint`, `missing_frontmatter`, `missing_graph_metadata`, `missing_graph_timestamp`, `implementation_summary_missing`, `not_opted_in`) are distinguishable from a verified pass in the orchestrator's JSON output, with no change to `validate.sh --strict`'s exit code for any existing packet |
| REQ-005 | `validateContinuityFreshness`'s exported-function behavior versus `runCli()`'s `SPECKIT_COMPLETION_FRESHNESS` gate is either unified or covered by a test that pins the current asymmetry as intentional |
| REQ-006 | `continuity-freshness.vitest.ts` covers claim-with-fingerprint, claim-without-fingerprint, zero-fingerprint-placeholder and opted-out CLI paths |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_COMPLETION_FRESHNESS=1 node continuity-freshness.ts --folder <packet> --json` on a packet with a real fingerprint and a completion claim returns `fresh_completion`/`pass`, and the same command on packet `052-memory-decommission-landing` (real, currently zero-fingerprint) returns the completion-freshness skip code directly, not an unrelated `stale` verdict from timestamp comparison.
- **SC-002**: `validate.sh --strict` exits identically (0) before and after this change for every packet in `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/`, `052-memory-decommission-landing/` and `053-spec-kit-runtime-rename/` - the reverted regression does not recur.
- **SC-003**: `npm run test:runtime` (or the workspace command that runs `continuity-freshness.vitest.ts`) passes with the four new/extended cases.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Redefining skip-vs-pass regresses the reverted prior attempt and re-flags already-closed packets | High | Keep exit-code/severity behavior byte-identical; only add a distinguishing field consumed by JSON/orchestrator output, verified by SC-002 against three real packets |
| Dependency | The continuity writer's assembly path (`scripts/core/memory-metadata.ts`, `runtime/lib/continuity/thin-continuity-record.ts`) must accept a "stamp fingerprint on completion claim" trigger without breaking `generate-context-cli-authority.vitest.ts` and `generate-context-save-lock.vitest.ts` | Med | Run both suites before and after; add the new stamp as an additive branch, not a rewrite of the existing write path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `validateContinuityFreshness` stays a single synchronous pass over the six `COMPLETION_DOCS`; no added disk I/O per document beyond the existing read.
- **NFR-P02**: The orchestrator's shell-rule bridge parsing stays O(n) in stdout lines; no new subprocess spawn.

### Security
- **NFR-S01**: No new environment variable; the existing `SPECKIT_COMPLETION_FRESHNESS` / `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` pair stays the only gates.
- **NFR-S02**: The fingerprint stamp never embeds file contents beyond the existing `buildContinuityFingerprint(content)` SHA-256 digest.

### Reliability
- **NFR-R01**: A malformed or missing `graph-metadata.json` continues to produce a `pass`/`fail` outcome identical to today's (this phase does not touch that branch).
- **NFR-R02**: The new skip signal never causes `validate.sh --strict` to exit non-zero for a packet that passed before this phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a spec folder with none of the six `COMPLETION_DOCS` present continues to short-circuit at `implementation_summary_missing`.
- Maximum length: a packet where every one of the six documents claims completion independently still resolves to one fingerprint check against `implementation-summary.md`.
- Invalid format: a `session_dedup.fingerprint` that does not match `^sha256:[a-f0-9]{64}$` is treated identically to today - filtered out before the zero-fingerprint check, not surfaced as a parse error.

### Error Scenarios
- External service failure: not applicable - no network call in this rule.
- Network timeout: not applicable.
- Concurrent access: two processes calling `validateContinuityFreshness` on the same folder read-only never race; the writer path (`generate-context.ts`) already serializes through `releaseFilesystemLock`.

### State Transitions
- Partial completion: a packet mid-save (fingerprint stamped, `last_updated_at` not yet refreshed) still resolves through the existing staleness branch once the completion-freshness branch has returned its own verdict first.
- Session expiry: not applicable to this rule.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Four files, one rule module, one writer seam, one orchestrator bridge |
| Risk | 8/25 | A prior related change was reverted; regression risk is real but scoped and testable against three live packets |
| Research | 3/20 | The exact seam is already isolated by direct source reading and a live reproduction run |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. The binding model (implementation-summary.md as sole attestation point) is recommended in-line above because it is the only document the writer already populates; an operator preferring Option B (every claiming document carries its own fingerprint) can override during planning.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
