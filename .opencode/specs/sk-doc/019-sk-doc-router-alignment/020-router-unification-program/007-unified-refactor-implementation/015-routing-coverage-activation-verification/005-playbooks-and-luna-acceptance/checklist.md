---
title: "Checklist: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "Pre-implementation QA gate for the 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen validators/executor, and the two-plane LUNA-High acceptance stage. Every item is the acceptance bar implementation must clear; none is verified yet."
trigger_phrases:
  - "compiled routing playbook checklist"
  - "luna high acceptance QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance

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

- [ ] CHK-001 [P0] Upstream evidence read before authoring: `review-v1.md`, `synthesis-v1.md` §2.3 (CF-PB-1..5), §2.2 (CF-BM-7).
  - **Verification (planned)**: this spec's citations re-checked against `../001-research/{review-v1.md,synthesis-v1.md}` at implementation time.
- [ ] CHK-002 [P0] All writes stay inside this phase folder plus the explicitly named hub-playbook and shared-script paths in `spec.md`'s Files to Change table.
  - **Verification (planned)**: `git diff --stat` scoped to that table once implementation starts.
- [ ] CHK-003 [P1] The evidence-contract field names are reconciled with `004`'s planned `row.compiledParity` shape before scenario authoring starts.
  - **Verification (planned)**: a side-by-side field comparison against `../004-benchmark-compiled-lane-c/spec.md` REQ-002/REQ-009 before Phase 2.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The new validators, executor, and LUNA-acceptance script introduce no new external dependency beyond what the existing playbook/benchmark scripts already use.
  - **Verification (planned)**: `[Test: planned — node --check plus a package-diff review, not yet run]`.
- [ ] CHK-011 [P0] CommonJS/JSON/Markdown-frontmatter syntax is valid across every new and changed file.
  - **Verification (planned)**: `[Test: planned — node --check on each .cjs; frontmatter parse on every scenario file]`.
- [ ] CHK-012 [P1] The frozen `load-playbook-scenarios.cjs` loader (and the other two frozen scorer files) is never opened for write by any new code path.
  - **Verification (planned)**: `[Test: planned — rg -n "writeFile|fs\.write" against load-playbook-scenarios.cjs shows no new call site]`.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 7 eligible hubs have exactly one compiled-routing scenario file, each with a distinct route shape.
  - **Verification (planned)**: `[Test: planned — enumerate the 7 scenario files, assert distinct route-shape rationale per hub]`.
- [ ] CHK-021 [P0] The content validator rejects id-only and null-pass-criteria scenarios, and requires all 7 evidence-contract fields.
  - **Verification (planned)**: `[Test: planned — validate-compiled-routing-scenarios.cjs fixture sweep]`.
- [ ] CHK-022 [P0] The topology validator recurses into per-feature files; the verdict enum is unified.
  - **Verification (planned)**: `[Test: planned — recursion fixture against a hub with nested per-feature files]`.
- [ ] CHK-023 [P0] The cutover executor's PASS/FAIL/SKIP outcome is derived from captured evidence, not a manual assertion.
  - **Verification (planned)**: `[Test: planned — dry run against >= 1 hub]`.
- [ ] CHK-024 [P0] The LUNA-HIGH stage classifies a seeded transport timeout as `SKIP`, never `PASS`/`FAIL`.
  - **Verification (planned)**: `[Test: planned — seeded-timeout fixture]`.
- [ ] CHK-025 [P1] Every hub has >= 1 gold-bearing held-out paraphrase with its route withheld from the prompt.
  - **Verification (planned)**: `[Test: planned — holdout audit across all 7 hubs]`.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Every scenario's evidence contract correctly reflects its hub manifest's `servingAuthority` at capture time.
  - **Verification (planned)**: `[Test: planned — cross-check captured serving-status against the manifest fixture per scenario]`.
- [ ] CHK-031 [P0] Root-playbook realignment lands for `sk-doc` (no retired-RESOURCE_MAP reference), `mcp-tooling` (Figma+Refero as a primary row), and `sk-prompt` (`orderedBundle` proven or removed).
  - **Verification (planned)**: manual diff against `mode-registry.json`/`hub-router.json` per hub.
- [ ] CHK-032 [P1] Secondary-authority checks (legacy/holdout/disambiguation) live in an Optional Supplemental section, not a duplicate primary matrix.
  - **Verification (planned)**: structural review of the finished scenario files.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No live routing file (`SKILL.md`, `hub-router.json`, `mode-registry.json`) is edited.
  - **Verification (planned)**: `git diff --stat` shows none of those paths touched (only the root playbook Markdown files, per the Files to Change table).
- [ ] CHK-041 [P0] The frozen `load-playbook-scenarios.cjs` loader and the other two frozen scorer files are untouched.
  - **Verification (planned)**: digest diff before/after, mirroring `004`'s frozen-trio gate.
- [ ] CHK-042 [P1] The LUNA-HIGH live stage introduces no credential leakage — model/transport config is read from existing executor-dispatch conventions, not hardcoded.
  - **Verification (planned)**: manual code-path review of `luna-acceptance.cjs` at implementation time.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] spec, plan, tasks, checklist, and summary agree on Planned status and the dependency on both `002` and `004`.
  - **Verification (planned)**: cross-read at implementation kickoff and again at completion.
- [ ] CHK-051 [P1] No item in this checklist is marked verified without an actual command or run once implementation starts; this Planned version marks none as verified.
  - **Verification (planned)**: self-evident from this document's current all-`[ ]` state.
- [ ] CHK-052 [P0] Strict Level-2 packet validation passes on this phase folder.
  - **Verification (planned)**: `[Test: planned — bash .../scripts/spec/validate.sh 005-playbooks-and-luna-acceptance --strict]`.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] New scenario files land in each hub's existing `manual-testing-playbook/` directory; new scripts land alongside the existing validator/executor conventions, not scattered ad hoc.
  - **Verification (planned)**: reviewed against `spec.md`'s Files to Change table.
- [ ] CHK-061 [P1] The frozen loader, the other two frozen scorer files, and all seven hub activation manifests remain byte-unchanged.
  - **Verification (planned)**: covered by CHK-041 plus a manifest byte-diff.

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
**Verification Scope**: Pre-implementation QA gate for the 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen content/topology validators, the cutover executor, and the two-plane LUNA-High acceptance stage.
**Completion Boundary**: This packet is Planned. No code has been written. `implementation-summary.md` in this folder is a forward-looking build plan, not a completion record, and must not be read as one.

<!-- /ANCHOR:summary -->
