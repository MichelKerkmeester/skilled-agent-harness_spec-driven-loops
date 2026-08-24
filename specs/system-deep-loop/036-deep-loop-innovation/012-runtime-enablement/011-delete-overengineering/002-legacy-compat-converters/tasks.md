---
title: "Tasks: Phase 002 Legacy-Compat Converters"
description: "Ordered removal manifest for F1's seven per-mode legacy-compat modules — sever barrels and test imports first, then delete, then verify."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/002-legacy-compat-converters"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 002 Legacy-Compat Converters

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Order matters: sever every re-export and test import **before** deleting a target file, so tsc never sees a
dangling import. All paths are under `.opencode/skills/system-deep-loop/runtime/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T1 — Re-confirm zero callers (remover, read-only)
- [ ] `rg -n "decideDeepAiCouncilCompatibility|upcastLegacyDeepAiCouncilRecord"` — expect only `deep-ai-council-ledger-schema/` self + its test.
- [ ] `rg -n "decideDeepImprovementCommonCompatibility|upcastLegacyDeepImprovementCommonRecord"` — expect `deep-improvement-common-ledger-schema/` self + its test **plus** in-wave internal callers in `agent-improvement-ledger-schema/legacy-compatibility.ts`, `model-benchmark-ledger-schema/legacy-compatibility.ts`, `skill-benchmark-ledger-schema/legacy-compatibility.ts` (all four are deleted together — this is expected, not residue).
- [ ] `rg -n "decideModelBenchmarkCompatibility|upcastLegacyModelBenchmarkRecord"` — expect only `model-benchmark-ledger-schema/` self + its test.
- [ ] `rg -n "decideDeepAlignmentCompatibility|upcastLegacyDeepAlignmentRecord"` — expect only `deep-alignment-ledger-schema/` self + its test.
- [ ] `rg -n "decideDeepReviewCompatibility|upcastLegacyDeepReviewRecord"` — expect only `deep-review-ledger-schema/` self + its test.
- [ ] `rg -n "decideSkillBenchmarkCompatibility|upcastLegacySkillBenchmarkRecord"` — expect only `skill-benchmark-ledger-schema/` self + its test.
- [ ] `rg -n "decideAgentImprovementCompatibility|upcastLegacyAgentImprovementRecord"` — expect only `agent-improvement-ledger-schema/` self + its test.
- [ ] `rg -n "legacy-real-log" tests/` — confirm `tests/unit/deep-research-ledger-schema.vitest.ts` is among the hits. If it is not, STOP and report before touching the helper's status in any other file.
- [ ] STOP and report if any hit lands outside a target module's own dir/test, the cross-module cluster noted above, or the deep-research KEEP set.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T2 — Sever barrels & test references (edits first)
- [ ] `lib/deep-ai-council-ledger-schema/index.ts`: remove the `decideDeepAiCouncilCompatibility` + `upcastLegacyDeepAiCouncilRecord` re-export block.
- [ ] `lib/deep-improvement-common-ledger-schema/index.ts`: remove the `decideDeepImprovementCommonCompatibility` + `upcastLegacyDeepImprovementCommonRecord` re-export block.
- [ ] `lib/model-benchmark-ledger-schema/index.ts`: remove the `decideModelBenchmarkCompatibility` + `upcastLegacyModelBenchmarkRecord` re-export block.
- [ ] `lib/deep-alignment-ledger-schema/index.ts`: remove the `decideDeepAlignmentCompatibility` + `upcastLegacyDeepAlignmentRecord` re-export block.
- [ ] `lib/deep-review-ledger-schema/index.ts`: remove the `decideDeepReviewCompatibility` + `upcastLegacyDeepReviewRecord` re-export block.
- [ ] `lib/skill-benchmark-ledger-schema/index.ts`: remove the `decideSkillBenchmarkCompatibility` + `upcastLegacySkillBenchmarkRecord` re-export block.
- [ ] `lib/agent-improvement-ledger-schema/index.ts`: remove the `decideAgentImprovementCompatibility` + `upcastLegacyAgentImprovementRecord` re-export block.
- [ ] `tests/unit/deep-ai-council-ledger-schema.vitest.ts`: remove the legacy-compat `it()` block (calls to `decideDeepAiCouncilCompatibility` / `upcastLegacyDeepAiCouncilRecord`, mid-file — later unrelated `it()` blocks stay); drop the now-dead `decideDeepAiCouncilCompatibility` / `upcastLegacyDeepAiCouncilRecord` / `REAL_LEGACY_LOGS` / `readRealJsonl` / `unknownLegacyRecords` import lines.
- [ ] `tests/unit/deep-improvement-common-ledger-schema.vitest.ts`: remove the legacy-compat `it()` block; drop the now-dead `decideDeepImprovementCommonCompatibility` / `upcastLegacyDeepImprovementCommonRecord` / `REAL_LEGACY_LOGS` / `readRealJsonl` / `unknownLegacyRecords` import lines.
- [ ] `tests/unit/model-benchmark-ledger-schema.vitest.ts`: remove the legacy-compat `it()` block (mid-file — later unrelated `it()` blocks stay); drop the now-dead `decideModelBenchmarkCompatibility` / `upcastLegacyModelBenchmarkRecord` import lines (this file does not import `legacy-real-log`).
- [ ] `tests/unit/deep-alignment-ledger-schema.vitest.ts`: remove the legacy-compat `it()` block(s) (mid-file — later unrelated `it()` blocks stay); drop the now-dead `decideDeepAlignmentCompatibility` / `upcastLegacyDeepAlignmentRecord` / `REAL_LEGACY_LOGS` / `readRealJsonl` / `unknownLegacyRecords` import lines.
- [ ] `tests/unit/deep-review-ledger-schema.vitest.ts`: remove the legacy-compat `it()` block (mid-file — later unrelated `it()` blocks stay); drop the now-dead `decideDeepReviewCompatibility` / `upcastLegacyDeepReviewRecord` / `REAL_LEGACY_LOGS` / `readRealJsonl` / `unknownLegacyRecords` import lines.
- [ ] `tests/unit/skill-benchmark-ledger-schema.vitest.ts`: remove the legacy-compat `it()` block; drop the now-dead `decideSkillBenchmarkCompatibility` / `upcastLegacySkillBenchmarkRecord` / `REAL_LEGACY_LOGS` / `readRealJsonl` / `unknownLegacyRecords` import lines.
- [ ] `tests/unit/agent-improvement-ledger-schema.vitest.ts`: remove the legacy-compat `it()` block; drop the now-dead `decideAgentImprovementCompatibility` / `upcastLegacyAgentImprovementRecord` import lines (this file does not import `legacy-real-log`).
- [ ] Do **not** touch `lib/deep-research-ledger-schema/index.ts`, `lib/deep-research-ledger-schema/legacy-compatibility.ts`, `tests/unit/deep-research-ledger-schema.vitest.ts`, or `tests/helpers/legacy-real-log.ts`.

### T3 — Delete targets
- [ ] Delete `lib/deep-ai-council-ledger-schema/legacy-compatibility.ts`.
- [ ] Delete `lib/deep-improvement-common-ledger-schema/legacy-compatibility.ts`.
- [ ] Delete `lib/model-benchmark-ledger-schema/legacy-compatibility.ts`.
- [ ] Delete `lib/deep-alignment-ledger-schema/legacy-compatibility.ts`.
- [ ] Delete `lib/deep-review-ledger-schema/legacy-compatibility.ts`.
- [ ] Delete `lib/skill-benchmark-ledger-schema/legacy-compatibility.ts`.
- [ ] Delete `lib/agent-improvement-ledger-schema/legacy-compatibility.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T4 — Verify (orchestrator runs; devin cannot run vitest)
- [ ] `node .../typescript/bin/tsc -p runtime/tsconfig.json` → no new `TS2307`; error count ≤ 57 baseline.
- [ ] `node runtime/scripts/verify-authority.cjs` → 8 modes `new_authoritative_final`.
- [ ] Runtime suite (`vitest run --reporter=dot`) → failing set unchanged by name vs baseline; `deep-research-ledger-schema.vitest.ts` still passes its legacy-upcast assertions.
- [ ] `rg` re-scan of every deleted symbol → zero non-deleted references.
- [ ] `git diff --stat` on `lib/deep-research-ledger-schema/**`, `tests/unit/deep-research-ledger-schema.vitest.ts`, `tests/helpers/legacy-real-log.ts` → empty.

### T5 — Commit
- [ ] One conventional commit, `<100` files (21 expected), mass-deletion guard respected (not overridden).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All verification gates pass (see `spec.md` SUCCESS CRITERIA / `plan.md` TESTING STRATEGY)
- [ ] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
