---
title: "Deprecation Residue Tail Closed: CocoIndex / Rerank-Sidecar / CCC Completeness Verdict"
description: "An exhaustive verify-first sweep (correcting a shell-mangling grep bug that had caused prior false-negatives) proved the 014 deprecation residue is closed. Two live-doc dead-path references were removed or reframed. Kept-exceptions and the cross-encoder deferral are recorded so future sessions do not re-litigate them."
trigger_phrases:
  - "deprecation residue completeness verdict"
  - "coco ccc rerank residue tail closed"
  - "exhaustive residue sweep methodology bug"
  - "sidecar ledger README removed"
  - "manual testing playbook CCC reframe"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/016-remediate-residue-tail` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

Prior sweeps for CocoIndex / rerank-sidecar / ccc deprecation residue had been silently producing false-negatives. The `-g '!...'` exclude globs built in an unquoted shell variable were mangled by zsh history-expansion and glob-no-match, causing `rg` under `2>/dev/null` to emit zero results even when matches existed. Switching to inline single-quoted excludes and per-token greps exposed the true picture: all residue was essentially closed except two live-doc dead-path references.

The two remaining items were fixed. The `deep-loop-runtime/lib/deep-loop/README.md` helper list still named `sidecar_ledger.py` as a present artifact after the file had been deleted. The `manual_testing_playbook.md` still used "CCC stubs / CCC trio" in a live test scenario that now exercises the renamed `code_graph` status, scan, verify handlers. Both references were corrected. All other coco / ccc / rerank hits were classified into named KEEP buckets: accurate history, frozen benchmarks, generated artifacts, documented operator exceptions, the live in-process rerank pipeline. The completeness verdict and all kept-exceptions are recorded in the implementation summary so a future session can read the reasoning rather than repeat the sweep.

### Added

- Completeness verdict, kept-exception enumeration, cross-encoder deferral rationale recorded in the implementation summary

### Changed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md`: removed the "Rerank sidecar: `sidecar_ledger.py`" helper-list line pointing at a deleted file
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`: reframed "CCC stubs / CCC trio" to code_graph status, scan, verify handler names

### Fixed

- Corrected the sweep methodology: inline single-quoted `-g '!...'` excludes and per-token `rg` calls replaced variable-expanded exclude globs that zsh silently mangled under `2>/dev/null`, eliminating the false-negative source

### Verification

| Check | Result |
|-------|--------|
| `sidecar_ledger` in deep-loop README | PASS. 0 matches after line removed. |
| "CCC stubs/trio" in playbook scenario | PASS. 0 matches after scenario reframed. |
| Referenced artifacts deleted (`ensure-rerank-sidecar.cjs`, `sidecar_ledger.py`) | PASS. `rg --files` returns 0 for both paths. |
| Live rerank pipeline untouched | PASS. `cross-encoder.ts` and stage3 wiring unchanged. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md` | Modified | Removed the deleted `sidecar_ledger.py` helper-list entry |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | Replaced stale "CCC stubs/trio" label with code_graph handler names |

### Follow-Ups

- Decide whether the in-process cross-encoder (`cross-encoder.ts`, `SPECKIT_CROSS_ENCODER`) is dormant-dead or conditionally-live. That is a rerank-pipeline dead-code question outside this deprecation-residue scope and warrants a dedicated review if desired.
- Resolve the `sidecar-client.ts:170` JSDoc that references the deleted `ensure-rerank-sidecar.cjs`. It was deferred because the cross-encoder subsystem is actively evolving under the 027-xce arc and the allowlist entry remains live. An operator should decide the correct edit once the arc stabilises.
