---
title: "Verification Checklist: DeepSeek V4 Flash pinned to the Max thinking tier"
description: "QA checklist for the force-to-max Flash effort pin + catalog corrections."
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/044-deepseek-v4-flash-max-only"
    last_updated_at: "2026-08-16T17:34:05Z"
    last_updated_by: "implementer"
    recent_action: "Verified all checklist items with evidence"
    next_safe_action: "Packet complete"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: DeepSeek V4 Flash pinned to the Max thinking tier

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
Each item carries evidence (command + result, or file:line). No item is `[x]` without observed proof.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Flash capability verified live
  - **Evidence**: `models-store.json` + `opencode models deepseek`/`opencode-go` show `reasoning: true`, `thinkingLevelMap.max`; `deepseek-v4-flash-max` count 0 on both providers
- [x] CHK-002 [P1] Baseline suites recorded
  - **Evidence**: three suites → `207 passed | 1 skipped` before the pin

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Pin predicate added to TS source
  - **Evidence**: `isFlashMaxPinnedModel` + `pinReasoningEffortForModel` in `executor-config.ts`
- [x] CHK-011 [P0] Synchronous mirror added
  - **Evidence**: `isFlashMaxPinnedModel` in `fanout-run.cjs` with a "Mirrors …" comment
- [x] CHK-012 [P0] Pin applied in both builders
  - **Evidence**: `buildPiLineageCommand` (`piEffort`→`--thinking`) and `buildOpencodeLineageCommand` (`opencodeEffort`→`--variant`); recorded effort reflects the pin
- [x] CHK-013 [P1] Devin `-max` uid excluded
  - **Evidence**: `(^|/)deepseek-v4-flash$` does not match `deepseek-v4-flash-max`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Helper unit tests green
  - **Evidence**: `executor-config.vitest.ts` match/exclusion/effort tests pass
- [x] CHK-021 [P0] cli-pi builder pin test green
  - **Evidence**: Flash at `high` → `['-p','--offline','--model','opencode-go/deepseek-v4-flash','--thinking','max','p']`
- [x] CHK-022 [P0] cli-opencode builder pin test green
  - **Evidence**: `deepseek/deepseek-v4-flash` at `high` → `--variant max`
- [x] CHK-023 [P0] Whole-suite green
  - **Evidence**: `212 passed | 1 skipped` (baseline `207`); non-Flash `deepseek-v4-pro` keeps requested effort

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-030 [P1] TS predicate and CJS mirror agree
  - **Evidence**: regex `(^|/)deepseek-v4-flash$` identical in `executor-config.ts:185` and `fanout-run.cjs:1674`; all three suites green (`212 passed | 1 skipped`)
- [x] CHK-031 [P1] Old behavior seen failing first
  - **Evidence**: pre-pin, the provider-map assertion failed because Flash lacked `--thinking max`; passes after the pin
- [x] CHK-032 [P1] Pins persist on disk after test runs
  - **Evidence**: `grep -c isFlashMaxPinnedModel` stable across two vitest runs

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security
- [x] CHK-040 [P2] No secrets/credentials touched
  - **Evidence**: change is a pure-function pin + docs

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-050 [P1] cli-pi catalog corrected + pin note
  - **Evidence**: `cli-pi/references/providers-and-models.md` deepseek section
- [x] CHK-051 [P1] cli-opencode "non-reasoning" claim fixed + pin note
  - **Evidence**: `cli-opencode/references/providers-and-models.md` deepseek + opencode-go rows
- [x] CHK-052 [P1] cli-devin Max-thinking-only note added
  - **Evidence**: `cli-devin/references/providers-and-models.md` "Notes on the roster"
- [x] CHK-053 [P1] Changelog entry added
  - **Evidence**: `changelog/v1.4.3.0.md`

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-060 [P1] Only in-scope files changed
  - **Evidence**: `git status` shows the two runtime source files + 3 tests + 3 catalogs + changelog + this spec folder

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary
- [x] CHK-070 [P0] REQ-001..006 satisfied with evidence
  - **Evidence**: REQ-001/002 by the pi/opencode pin tests (`--thinking max` / `--variant max`); REQ-003 by the non-Flash assertions; REQ-004 by the `-max` exclusion unit test; REQ-005/006 by the mirror check + corrected catalogs — all in the `212 passed` run
- [x] CHK-071 [P0] SC-001..003 observed
  - **Evidence**: `212 passed`; Flash-at-high→max observed; cursor unchanged
- [x] CHK-072 [P1] `validate.sh --strict` clean; metadata reconciled
  - **Evidence**: validator run after metadata regeneration

<!-- /ANCHOR:summary -->
