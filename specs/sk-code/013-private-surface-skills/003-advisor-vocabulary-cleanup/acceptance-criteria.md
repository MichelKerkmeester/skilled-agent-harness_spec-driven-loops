---
title: "Acceptance Criteria: Phase 3: advisor-vocabulary-cleanup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor vocabulary cleanup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup"
    last_updated_at: "2026-10-23T07:03:40Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: advisor-vocabulary-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup
**Level:** 2
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the in-scope advisor, plugin, Hermes, CI and doctor files, When `rg -n -i 'webflow\|obsidian'` runs over them, Then the only hits are the D6 out-of-scope vocabulary: `fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181` | `rg -n -i 'webflow\|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer .skilled/skills/system-skill-advisor/runtime/tools .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts .skilled/skills/system-skill-advisor/README.md .opencode/plugins/system-skill-advisor.js .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` prints exactly three `webflow cms` lines and no `WEBFLOW` or `OBSIDIAN` token | Unmet | - |
| AC-002 | REQ-002 | Given a temp skills root holding `alpha` and a `local-beta` symlink that resolves to a directory with `graph-metadata.json`, When `indexSkillMetadata(skillRoot)` runs, Then `local-beta` is a row in the SQLite `skill_nodes` table | `cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts` prints `10 passed` and the new case name mentions the linked skill | Unmet | - |
| AC-003 | REQ-002 | Given the same root without the change, When the new case runs, Then it fails on the missing `local-beta` row | the same command on the parent commit of the phase shows the new case failing and `9 passed` for the pre-existing cases | Unmet | - |
| AC-004 | REQ-003 | Given a workspace whose `.skilled/skills/local-beta` is a symlink to a directory holding `SKILL.md` and `graph-metadata.json`, When the linked `SKILL.md` changes, Then `computeAdvisorSourceSignature(root)` returns a different hash | `cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts` prints a passing run including the new case | Unmet | - |
| AC-005 | REQ-003 | Given the same workspace without the change, When the linked file changes, Then the signature stays the same and the new case fails | the same command on the parent commit of the phase shows the new case failing | Unmet | - |
| AC-006 | REQ-004 | Given a skills dir holding `alpha` and a `local-private` folder, When `discover_graph_metadata(skills_dir)` runs, Then the returned names are `['alpha']` | `cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py` prints `fail=0` and the new `T246-GC-*` case in the `Summary: pass=` line | Unmet | - |
| AC-007 | REQ-004 | Given a Hermes fixture source holding `local-webflow/SKILL.md`, When the sync writes, Then it reports `Wrote 4 of 4` and no `local-webflow` folder exists under the output | `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` prints `pass 5` and `fail 0` | Unmet | - |
| AC-008 | REQ-004 | Given a synthetic skills dir holding a healthy root and a `local-webflow` root, When `findSkillRoots` runs, Then only the healthy root is returned | `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` prints `[sk-doc] skill-root-metadata contract + fleet gate coverage passed` | Unmet | - |
| AC-009 | REQ-004 | Given a repo-shaped temp root whose `.skilled/skills/local-webflow/graph-metadata.json` exists and whose tracked graph does not carry it, When the panel reads disk, Then no `local-webflow` ghost, stale or missing row appears | `cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts` prints a passing run including the new case | Unmet | - |
| AC-010 | REQ-004 | Given the same four suites on the parent commit of the phase, When their new cases run, Then each fails for the private skill being present or absent where it should not be | the four commands above each report the new case failing before its code task lands | Unmet | - |
| AC-011 | REQ-005 | Given phase 2 is merged, When the compiler exports the fallback graph, Then no `sk-code` signal matches `webflow` or `obsidian` | `node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(JSON.stringify(g.signals['sk-code'].filter(x=>/webflow\|obsidian/i.test(x))))"` prints `[]` | Unmet | - |
| AC-012 | REQ-005 | Given the regenerated graph, When the diff is read, Then only sk-code surface signals and the `generated_at` and `skill_count` fields changed | `git diff --stat -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` shows one file, and `git diff` shows no `mcp-tooling` signal removed | Unmet | - |
| AC-013 | REQ-006 | Given every behavior change in this phase, When its test is reverted alone, Then the test fails and the phase tree is otherwise green | each pair in `tasks.md` Phase 2 was observed red between its test task and its code task, recorded in `implementation-summary.md` | Unmet | - |
| AC-014 | REQ-007 | Given the surface-hint test, When it runs, Then the hint it forwards is `SKILLED` and the argv assertion passes | `cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts` prints `3 passed` | Unmet | - |
| AC-015 | REQ-008 | Given the two tool schemas and the advisor README, When they are read, Then the `surfaceHint` example names `SKILLED` and no file names `WEBFLOW` | `rg -n 'WEBFLOW' .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts .skilled/skills/system-skill-advisor/README.md` prints nothing and exits 1 | Unmet | - |
| AC-016 | REQ-009 | Given the no-change decisions, When `implementation-summary.md` is read, Then it records the `native-scorer.vitest.ts:387` assertion as `toBe('sk-code')` with the 22-passing run, and the zero-hit `rg` over `aliases.ts`, `leaf-aliases.json` and `scorer-calibration-baseline.json` | `rg -n -i 'webflow\|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts .skilled/skills/system-skill-advisor/leaf-aliases.json .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json` prints nothing and exits 1, and the summary names both | Unmet | - |
| AC-017 | REQ-005 | Given the ambiguity slice was already red at baseline, When the phase ends, Then the live top-1 count is no lower than the baseline captured before the first edit | `cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/ambiguity-slice.vitest.ts` reports a `live=` value greater than or equal to the recorded pre-phase value | Unmet | - |
| AC-018 | REQ-001 | Given the final tree, When the packet validator runs, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict` prints a line reading `RESULT: PASSED` | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
