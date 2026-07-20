---
title: "Checklist: Benchmark — Compiled Lane C Parity"
description: "Pre-implementation QA gate for the compiled Lane C parity harness. Every item is the acceptance bar implementation must clear; none is verified yet."
trigger_phrases:
  - "compiled lane c parity checklist"
  - "benchmark parity QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: Benchmark — Compiled Lane C Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this child complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Upstream evidence read before authoring code: `review-v1.md`, `synthesis-v1.md` §2.2 (CF-BM-1..8), the SAFETY correction, F-15-3, F-25-8.
  - **Verification (planned)**: this spec's citations re-checked against `../001-research/{review-v1.md,synthesis-v1.md}` at implementation time.
- [ ] CHK-002 [P0] All writes stay inside this phase folder plus the explicitly named shared-script paths in `spec.md`'s Files to Change table.
  - **Verification (planned)**: `git diff --stat` scoped to that table once implementation starts.
- [ ] CHK-003 [P1] The hub activation manifest shape is confirmed stable before the vacuous-parity guard is wired.
  - **Verification (planned)**: manifest fields (`servingAuthority`, `selectedPolicy`, `shadowOnly`) diffed against the sample already on disk before wiring.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `compiled-routing-parity.cjs` introduces no new external dependency beyond what the skill-benchmark scripts already use.
  - **Verification (planned)**: `[Test: planned — node --check plus a package-diff review, not yet run]`.
- [ ] CHK-011 [P0] CommonJS/JSON syntax is valid across every new and changed file.
  - **Verification (planned)**: `[Test: planned — node --check on each .cjs; JSON.parse on every fixture]`.
- [ ] CHK-012 [P1] The frozen scorer files are never opened for write by any new code path.
  - **Verification (planned)**: `[Test: planned — rg -n "writeFile|fs\.write" against score-skill-benchmark.cjs shows no new call site]`.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Frozen-trio SHA-256 digests unchanged pre/post.
  - **Verification (planned)**: `[Test: planned — digest diff before/after the full change set]`.
- [ ] CHK-021 [P0] Vacuous-parity guard hard-fails every `servingAuthority !== 'compiled'` case.
  - **Verification (planned)**: `[Test: planned — fixture sweep across all 7 hub manifests + 1 synthetic legacy fixture]`.
- [ ] CHK-022 [P0] Flag-state matrix covers `unset/0/1/invalid` with correct, distinct outcomes.
  - **Verification (planned)**: `[Test: planned — Vitest table, 4 states]`.
- [ ] CHK-023 [P0] Verdict sub-state produces 3 distinct outer verdicts; no OR-collapse.
  - **Verification (planned)**: `[Test: planned — Vitest asserting 3 reachable outer verdicts]`.
- [ ] CHK-024 [P0] `qualifiedIdToLeaf` bijection holds for every eligible hub's `leaf-manifest.json`.
  - **Verification (planned)**: `[Test: planned — bijection Vitest, all 7 hubs]`.
- [ ] CHK-025 [P1] Rendered report's `compiledRouting` block is populated, not a placeholder.
  - **Verification (planned)**: `[Test: planned — rendered-report fixture test]`.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Every scenario's `compiledParity` result correctly reflects its hub manifest's `servingAuthority`.
  - **Verification (planned)**: `[Test: planned — cross-check row.compiledParity.status against the manifest fixture per scenario]`.
- [ ] CHK-031 [P0] Exactly one blocking drift-gate owner is documented; other consumers are report-only.
  - **Verification (planned)**: reviewed in `spec.md` REQ-007 and `plan.md` FIX ADDENDUM at implementation time.
- [ ] CHK-032 [P1] `--compiled-routing-parity` reaches the orchestrator from both workflow dispatch surfaces, or the unconditional-`auto` fallback is recorded in every report.
  - **Verification (planned)**: `[Test: planned — integration run per dispatch surface]`.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No live routing file (`SKILL.md`, `hub-router.json`, `mode-registry.json`) is edited.
  - **Verification (planned)**: `git diff --stat` shows none of those paths touched.
- [ ] CHK-041 [P0] The shared benchmark scorer trio is untouched.
  - **Verification (planned)**: covered by CHK-020's digest diff.
- [ ] CHK-042 [P1] No network, credential, or dynamic-code surface is introduced by the new harness.
  - **Verification (planned)**: manual code-path review of `compiled-routing-parity.cjs` at implementation time.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] spec, plan, tasks, checklist, and summary agree on Planned status and the soft dependency on 002.
  - **Verification (planned)**: cross-read at implementation kickoff and again at completion.
- [ ] CHK-051 [P1] No item in this checklist is marked verified without an actual command or run once implementation starts; this Planned version marks none as verified.
  - **Verification (planned)**: self-evident from this document's current all-`[ ]` state.
- [ ] CHK-052 [P0] Strict Level-2 packet validation passes on this phase folder.
  - **Verification (planned)**: `[Test: planned — bash .../scripts/spec/validate.sh 004-benchmark-compiled-lane-c --strict]`.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] New files land in the existing skill-benchmark scripts directory and the shared `leaf-resource-contract.cjs`, not scattered ad hoc.
  - **Verification (planned)**: reviewed against `spec.md`'s Files to Change table.
- [ ] CHK-061 [P1] The frozen trio and all seven hub activation manifests remain byte-unchanged.
  - **Verification (planned)**: covered by CHK-020 plus a manifest byte-diff.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: N/A — Planned, not yet implemented.
**Verification Scope**: Pre-implementation QA gate for the compiled Lane C parity harness (`compiled-routing-parity.cjs`, its two orchestrator hooks, the shape bridge, the vacuous-parity guard, and the flag-state/verdict-substate matrices).
**Completion Boundary**: This packet is Planned. No code has been written. `implementation-summary.md` in this folder is a forward-looking build plan, not a completion record, and must not be read as one.

<!-- /ANCHOR:summary -->
