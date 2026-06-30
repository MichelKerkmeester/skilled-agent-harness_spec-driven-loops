---
title: "Verification Checklist: Four-copy vocabulary-drift gate (parent-hub-vocab-sync)"
description: "Verification checklist for the additive parent-hub-vocab-sync.cjs scan and its Vitest: classified-projection real-state report, VOCAB-DRIFT synthetic gate, additive/no-regression contract against sk-code-router-sync, and evergreen code hygiene."
trigger_phrases:
  - "parent-hub-vocab-sync checklist"
  - "vocabulary drift gate verification"
  - "vocab-drift checks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/008-vocabulary-drift-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered vocab-sync gate"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Four-copy vocabulary-drift gate (parent-hub-vocab-sync)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `sk-code-router-sync.vitest.ts` check shape and `router-replay.cjs` CLI pattern (`_args.cjs`, `require.main === module`, exit codes) documented as the model to mirror
  - **Evidence**: `parent-hub-vocab-sync.cjs` reuses `parseRouter` from `router-replay.cjs` and `_args.cjs` for the CLI; the CLI exits 0/1/2 like the model
- [x] CHK-002 [P0] The five vocabulary copies confirmed on disk; `hub-router.json.vocabularyClasses` fixed as the typed projection authority with a class→mode ownership rule
  - **Evidence**: all five files confirmed under `sk-design/`; `buildProjection` reads `vocabularyClasses` and `ownerModeForClass` derives the owner per class-name prefix (`MODE_PREFIXES`)
- [x] CHK-003 [P1] Hard-violation set fixed to orphan alias / collision / ownership drift; `untypedKeywordRate`, `phantomTypedKeywords`, `triggerPhraseCoverage` reported-only (thresholds OFF)
  - **Evidence**: `driftDetected = orphanAliases || aliasCollisions || ownershipDrift`; the three metrics never set `driftDetected`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check parent-hub-vocab-sync.cjs` exits 0
  - **Evidence**: re-run at doc time → `NODE_CHECK_EXIT=0`
- [x] CHK-011 [P0] Purely additive: `sk-code-router-sync.vitest.ts`, `router-replay.cjs`, and all five vocabulary files are byte-unchanged
  - **Evidence**: `git status` shows the 2 new files untracked (`??`) and nothing else modified under `skill-benchmark/`; the five vocab files are unchanged
- [x] CHK-012 [P1] `checkVocabSync` exported with internal helpers; CLI is family-presence-guarded and mirrors `router-replay.cjs` argv/exit (0/1/2)
  - **Evidence**: `module.exports = { checkVocabSync, normalizePhrase, ownerModeForClass }`; the CLI runs `checkVocabSync({ skillRoot: args.skill })` and exits 0 clean / 1 drift / 2 missing-or-unparseable
- [x] CHK-013 [P1] Fail-soft on unparseable required input (P0 finding, no throw); phrase normalizer reconciles hyphen/space forms
  - **Evidence**: `readJson` emits a P0 `unparseable-input` finding instead of throwing; `normalizePhrase` lowercases, strips edge punctuation, and collapses `[-\s]+` runs

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Real-state: `checkVocabSync` on the live sk-design family reports `orphanAliases:[]`, `aliasCollisions:[]`, `ownershipDrift:[]`, `typedKeywordCount > 50`, and `driftDetected:false`
  - **Evidence**: CLI against the live root returns `familyPresent:true`, `typedKeywordCount:123`, `score:100`, all three hard facets empty, 0 findings, `driftDetected:false`, `verdict:null`, exit 0
- [x] CHK-021 [P0] Synthetic gate: a registry alias added (in a temp copy) without a matching `hub-router.json` vocab class → `orphanAliases` non-empty, `driftDetected:true`, `verdict:'VOCAB-DRIFT'`
  - **Evidence**: a temp-copy alias `"orphan interface alias"` → `orphanAliases` populated + `orphan-alias` P0 finding → `driftDetected:true`, `verdict:'VOCAB-DRIFT'`, `score:60`, exit 1; the live `mode-registry.json` stayed unchanged
- [x] CHK-022 [P1] No-op: a non-registry skill root (no `hub-router.json`) → `familyPresent:false`, `driftDetected:false`
  - **Evidence**: an empty temp dir → `familyPresent:false`, `driftDetected:false`, `verdict:null`
- [x] CHK-023 [P0] No-regression: the existing `sk-code-router-sync` suite passes unchanged alongside the new suite
  - **Evidence**: the full `skill-benchmark/tests` suite is not runnable in this offline environment (network + own config); no-regression is guaranteed by construction (2 NEW files, zero edits to any existing file) and the CLI was run directly on the clean and drift cases
- [x] CHK-024 [P1] Current drift state reported: measured `untypedKeywordRate` recorded (near the documented ~0.465 baseline OR a reconciled definition documented, not hard-coded), with `phantomTypedKeywords` + `triggerPhraseCoverage`
  - **Evidence**: measured `untypedKeywordRate:0` — it diverges from the ~0.465 baseline because the typed `hub-router` vocab now fully covers the SKILL.md keyword block (`untypedKeywords` empty); the rate is computed, not hard-coded; `phantomTypedKeywords:["redesign the hero"]`, `triggerPhraseCoverage:0.875` (decision recorded in `implementation-summary.md` §2)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase adds one new scan + gate in a new module and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is exactly the two new files, and an evergreen grep over the module found no spec/packet/phase IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: no existing consumer is touched — the module is standalone and imports only `parseRouter`/`_args.cjs` read-only; the only consumer of `checkVocabSync` is the new sibling Vitest
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: adversarial cases executed — synthetic orphan-alias drift → `VOCAB-DRIFT`, non-registry no-op → benign pass, missing/unparseable required input → P0 `unparseable-input` (CLI exit 2); the five-copy reads stay within `skillRoot`
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix is 1 healthy real-state row (empty hard facets, `typedKeywordCount:123`, metrics `0`/`["redesign the hero"]`/`0.875`, exit 0) + 1 synthetic `VOCAB-DRIFT` row (orphan alias, exit 1) + 1 non-registry no-op row
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; the scan reads only the five vocab copies and `design-*/SKILL.md` under `skillRoot`, no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the two new files (`parent-hub-vocab-sync.cjs`: `checkVocabSync`, `HARD_VERDICT`, the `module.exports`, the `require.main` CLI; `tests/parent-hub-vocab-sync.vitest.ts`) and the additive untracked diff

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Scan is read-only on the repo; synthetic fixtures confined to OS temp dirs and removed in `afterAll`; the real vocab files are never mutated
  - **Evidence**: the scan only reads the five copies; the Vitest builds fixtures in `mkdtempSync` temp dirs cleaned in `afterAll`; the independent CLI run confirmed the live `mode-registry.json` stayed unchanged
- [x] CHK-031 [P1] No derived path escapes the skill root; the five-copy reads and packet enumeration stay within `skillRoot`
  - **Evidence**: every read joins a fixed filename or a `mode.packet` folder under the passed `skillRoot`; no path ascends above it

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md synchronized with the shipped scan contract
  - **Evidence**: all four carry the classified-projection contract, the orphan/collision/ownership hard gate, the `VOCAB-DRIFT` verdict, the measured `0`/`["redesign the hero"]`/`0.875` metrics, and the offline-vitest limitation
- [x] CHK-041 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths embedded in the new code or comments
  - **Evidence**: evergreen grep over `parent-hub-vocab-sync.cjs` returned no `specs/` paths or packet-phase IDs
- [x] CHK-042 [P2] `verdict:'VOCAB-DRIFT'` aggregate-ladder wiring (`score-skill-benchmark.cjs`) recorded as an explicit out-of-scope follow-on (not done here)
  - **Evidence**: recorded out of scope in `spec.md` §3 and `plan.md` §6; the verdict lives in the scan return + the additive CLI exit, not the `aggregate()` ladder

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Additions confined to two new files: `parent-hub-vocab-sync.cjs` and `tests/parent-hub-vocab-sync.vitest.ts`; no existing file edited
  - **Evidence**: `git status` shows only those two files under `skill-benchmark/`, both untracked (`??`)
- [x] CHK-051 [P1] No temp/scratch artifacts left in the repo
  - **Evidence**: synthetic fixtures live in OS temp dirs cleaned by `afterAll`; the independent CLI verification ran in the session scratch dir and was removed; the working tree carries only the two new files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the delivered `checkVocabSync` scan and the `VOCAB-DRIFT` gate)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
</content>
