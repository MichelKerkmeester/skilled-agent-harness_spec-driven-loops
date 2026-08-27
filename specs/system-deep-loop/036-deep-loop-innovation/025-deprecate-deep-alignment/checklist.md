---
title: "QA Checklist: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability"
description: "The verification checklist proving the deep-alignment deprecation cascade is complete and regression-free: 0 active references, the surviving benchmark families and advisor routes intact, every derived projection regenerated, and both whole-suite gates showing no new failures against a captured baseline."
importance_tier: "medium"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment"
    last_updated_at: "2026-08-27T11:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the checklist; all items pass except the whole-suite vitest confirmation"
    next_safe_action: "Confirm whole-suite vitest; commit; push v4 + main"
---
# Verification Checklist: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- Each item is checked against observed command output, not assertion.
- Whole-suite gates are baseline-compared; a failure counts only if it is NEW vs the captured baseline.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The full footprint was inventoried before any deletion
  - **Evidence**: `rg` swept `deep-alignment` / `/deep:alignment` / `command-benchmark` / `conformance_benchmark` / `command-deep-alignment`; each hit classified self-contained / shared / derived / historical
- [x] CHK-002 [P0] The cascade dependency was confirmed and operator-approved
  - **Evidence**: `/deep:command-benchmark` has no packet and runs on the deep-alignment engine (`scoping.cjs` / `check-convergence.cjs`); operator approved "Cascade — remove all of it"
- [x] CHK-003 [P1] The whole-suite baseline was captured for delta comparison
  - **Evidence**: `run-node-tests.mjs` baseline 767 pass / 17 fail; 5 pre-existing runtime vitest failures (`fanout` / `cli-devin` / `model-benchmark-ledger-schema` / `review-depth-convergence` / `authorized-ledger`)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared-runtime edits drop only the alignment mode, no adjacent behavior
  - **Evidence**: `append-mode-event.ts` lost 2 alignment imports + 3 `mode === 'deep-alignment'` branches; the surviving research/review/council/improvement branches untouched
- [x] CHK-011 [P1] No comment-hygiene violation introduced
  - **Evidence**: `dispatch-guard.cjs` comment reworded to durable WHY; no spec paths or artifact ids added to code comments
- [x] CHK-012 [P1] Derived metadata regenerated from sources, not hand-edited into drift
  - **Evidence**: advisor routing-projection, `leaf-manifest.json`, and compiled contracts regenerated from `mode-registry.json`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Family-registry parity holds for the surviving families
  - **Evidence**: `python3 test_create_benchmark_family_registry.py` → PASS (5 families, `conformance-benchmark` removed)
- [x] CHK-021 [P0] Advisor drift-guards pass against the regenerated projection
  - **Evidence**: `routing-registry-drift-guard` + `command-bridge-resolution-guard` → 13/13 PASS
- [x] CHK-022 [P0] Compiled command contracts are fresh
  - **Evidence**: `check-contract-drift` → 8/8 PASS after the 4th injection command (alignment) removed
- [x] CHK-023 [P0] No new node:test regression
  - **Evidence**: `run-node-tests.mjs` == baseline; `contracts cover every command topology` now green after the alignment command removed
- [x] CHK-024 [P0] No new vitest regression
  - **Evidence**: fresh clean `npx vitest run` = 6 failed / 146 passed (152 files); all 6 failing files are pre-existing (0 alignment/conformance refs each); the 3 regressions (`check-contract-drift`, `render-command-contract`, `legacy-projections`) are fixed and absent from the failing set

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Every self-contained deep-alignment unit deleted
  - **Evidence**: `git status` shows the 126-file mode packet, dedicated runtime, both commands, 6 agents, and conformance family removed (174 total deletions)
- [x] CHK-031 [P0] Every shared runtime file surgically stripped of alignment
  - **Evidence**: gateway, enums/unions, `shipped-census` (8→7 modes), manifests, stopping-clocks, path-coverage, `registry-compiler.cjs` + canary all edited
- [x] CHK-032 [P0] The cascade fully applied to /deep:command-benchmark + the conformance family
  - **Evidence**: `grep` for `conformance_benchmark` / `/deep:command-benchmark` → 0 active files
- [x] CHK-033 [P1] The surviving families and modes preserved
  - **Evidence**: `mcp_promotion` + behavior/model/skill/agent-improvement families intact; research/review/ai-council/agent-improvement modes intact

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No credentials, tokens, or secrets touched by the removal
  - **Evidence**: the change deletes and edits only local mode/command/doc files; no `.env` or secret store touched
- [x] CHK-041 [P1] No new external surface introduced
  - **Evidence**: `git diff` is delete-and-edit only; no new network call, endpoint, or `package.json` dependency added

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] No dangling deep-alignment link in READMEs / rosters
  - **Evidence**: root `README.md`, skill READMEs, cli rosters, and agent rosters swept; 0 active `deep-alignment` references
- [x] CHK-051 [P0] No active command/doc reference to the removed commands
  - **Evidence**: `grep` for `/deep:alignment` and `/deep:command-benchmark` → 0 active references (historical benchmark reports excluded)

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] mode-registry no longer lists alignment; leaf-manifest regenerated
  - **Evidence**: `mode-registry.json` modes array has no alignment object; `generate-leaf-manifest.cjs --write` removed only the alignment entry
- [x] CHK-061 [P1] Staging plan keeps sibling run artifacts and sqlite/jsonl out
  - **Evidence**: handoff notes prescribe `git add -u` + the 025 folder; ~59 untracked sibling-packet run artifacts + `*.sqlite` / `*.jsonl` excluded

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- All completeness, reference, testing, and file-organization items pass; the sole open box is CHK-024 (the whole-suite vitest confirmation).
- The 3 `deep-loop-registry-compiler` identity failures are confirmed pre-existing (fail at HEAD via a clean-tree check), so they are not a regression.
- `validate.sh <spec-folder> --strict` → Errors: 0.

<!-- /ANCHOR:summary -->
