---
title: "Phase 002: Legacy-Compat Converters — Seven Per-Mode Ledger Upcasters"
description: "Wave 2 of the over-engineering removal program: delete the seven per-mode legacy-format converters (F1) — decide<Mode>Compatibility + upcastLegacy<Mode>Record and their legacy-compatibility.ts modules — now the ledger is the single writer, and their now-dead test blocks. The deep-research variant is live (append-mode-event.cjs) and stays, along with the shared tests/helpers/legacy-real-log.ts fixture it depends on."
trigger_phrases:
  - "legacy compat converters delete"
  - "per-mode legacy compatibility removal"
  - "ledger schema legacy upcasters delete"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Phase 002: Legacy-Compat Converters

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | .../011-delete-overengineering/002-legacy-compat-converters |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Risk** | Low-Medium — seven modules + their barrels + their tests, no live-loop adjacency |
| **Findings** | F1 (see parent `research/research.md`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Every deep-loop mode was migrated to the append-only ledger as its single write authority. Each of the 8
per-mode `*-ledger-schema` packages shipped a `legacy-compatibility.ts` module — `decide<Mode>Compatibility`
+ `upcastLegacy<Mode>Record` — to classify and upcast pre-ledger JSONL rows during that migration. Seven of
the eight now have zero live callers: the audit's repo-wide re-proof (parent `research/research.md` §3)
found each pair referenced only by its own package barrel `index.ts` and its own unit test block.

The eighth, **`deep-research`**, is different: `scripts/append-mode-event.cjs` still calls
`upcastLegacyDeepResearchRecord` at lines 233 and 453 to upcast real legacy research logs on append. That
variant is load-bearing and is explicitly **out of scope** — see §3.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — delete

| Surface | Change |
|---------|--------|
| `runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts` (411 LOC) | Deleted |
| `runtime/lib/deep-improvement-common-ledger-schema/legacy-compatibility.ts` (397 LOC) | Deleted |
| `runtime/lib/model-benchmark-ledger-schema/legacy-compatibility.ts` (475 LOC) | Deleted |
| `runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts` (367 LOC) | Deleted |
| `runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts` (334 LOC) | Deleted |
| `runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts` (269 LOC) | Deleted |
| `runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts` (253 LOC) | Deleted |
| Each of the 7 modules' `index.ts` | `decide<Mode>Compatibility` + `upcastLegacy<Mode>Record` re-export removed |
| Each of the 7 matching `tests/unit/*-ledger-schema.vitest.ts` | Legacy-compat `it()` block + its now-dead imports removed |

Total: 2,506 module LOC + ~1,800 test LOC across 21 files (7 deletions, 7 barrel edits, 7 test edits) —
matches the parent research doc's F1 total (2,506 + ~1,800 = 4,306).

### Cross-module dependency (in-wave, safe)

`agent-improvement-ledger-schema/legacy-compatibility.ts`, `model-benchmark-ledger-schema/legacy-compatibility.ts`,
and `skill-benchmark-ledger-schema/legacy-compatibility.ts` each import
`decideDeepImprovementCommonCompatibility` + `upcastLegacyDeepImprovementCommonRecord` from
`deep-improvement-common-ledger-schema/index.js` and call them internally. Because all four modules are
deleted together in this same wave, this is not dangling residue — but it means the four must be deleted
as one set, never partially. T1's re-confirm step checks this explicitly.

### Out of Scope — explicit KEEP

| Surface | Why it stays |
|---------|--------------|
| `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` (412 LOC) | **LIVE.** Called by `runtime/scripts/append-mode-event.cjs:233,453` (`upcastLegacyDeepResearchRecord`) to upcast real legacy research logs on append. |
| `deep-research-ledger-schema/index.ts` re-export of `decideDeepResearchCompatibility` / `upcastLegacyDeepResearchRecord` | Stays — the barrel export is live. |
| `tests/unit/deep-research-ledger-schema.vitest.ts` | Stays untouched — it is the test for the live variant. |
| `runtime/tests/helpers/legacy-real-log.ts` (46 LOC) | **Correction to the parent research doc's Wave-2 suggestion** (`research/research.md` §5, item 2, which listed this file for removal): it is imported by `tests/unit/deep-research-ledger-schema.vitest.ts:6-9` (`REAL_LEGACY_LOGS`, `readRealJsonl`, `unknownLegacyRecords`), which is itself out of scope. Deleting it would break the kept deep-research test. Confirmed by direct grep, not assumed from the research doc. |
| `runtime/lib/deep-improvement-common-ledger-schema/` (the package itself, minus `legacy-compatibility.ts`) | The package's non-legacy exports are unaffected; only its `legacy-compatibility.ts` and that file's barrel re-export are removed. |
| The live ledger loop (append gateway, authorized-ledger, event envelopes, projections, replay-fingerprint, the 8 reducers, sealed artifacts, receipts, authority-registry read path) | Load-bearing, untouched by this wave — same posture as the phase-parent Non-Goals. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Barrel exports are severed, and dead test imports removed, before the target files are deleted (no dangling re-export or import).
- **REQ-002**: `deep-research-ledger-schema/legacy-compatibility.ts`, its barrel export, its test file, and `tests/helpers/legacy-real-log.ts` are untouched — verified by diff, not just by intent.
- **REQ-003**: After the wave, tsc shows no new `TS2307` (module-not-found) against the 57-error baseline.
- **REQ-004**: `verify-authority.cjs` still reports all 8 modes on ledger authority.
- **REQ-005**: The runtime suite's failing set does not grow by name against the captured baseline, and `tests/unit/deep-research-ledger-schema.vitest.ts` still passes its legacy-upcast assertions.
- **REQ-006**: `git grep` finds no remaining reference to any deleted symbol or path outside history.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The seven targets and their test blocks are gone; their 7 barrels updated; the eighth (deep-research) and its shared test fixture are unchanged.
- **SC-002**: `rg` for `decideDeepAiCouncilCompatibility|upcastLegacyDeepAiCouncilRecord|decideDeepImprovementCommonCompatibility|upcastLegacyDeepImprovementCommonRecord|decideModelBenchmarkCompatibility|upcastLegacyModelBenchmarkRecord|decideDeepAlignmentCompatibility|upcastLegacyDeepAlignmentRecord|decideDeepReviewCompatibility|upcastLegacyDeepReviewRecord|decideSkillBenchmarkCompatibility|upcastLegacySkillBenchmarkRecord|decideAgentImprovementCompatibility|upcastLegacyAgentImprovementRecord` returns zero non-deleted references.
- **SC-003**: tsc no new errors; authority 8/8 final; runtime suite failing-set unchanged by name.
- **SC-004**: One commit, well under the 100-file mass-deletion ceiling (21 files touched).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Low-Medium — seven modules + barrels + tests, no live-loop adjacency (see METADATA) | Wider surface than wave 1 | Same sever-before-delete pattern; T1 zero-caller re-scan |
| Dependency | In-wave cluster: `agent-improvement`/`model-benchmark`/`skill-benchmark` internally call `deep-improvement-common`'s compat functions | Partial deletion would dangle | All four deleted together, never partially (see §3) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope, sequencing, and verification gates are fully resolved for this wave.
<!-- /ANCHOR:questions -->
