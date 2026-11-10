---
title: "Goal: Phase 6: one row per file in the ripgrep wrapper"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control"
    last_updated_at: "2026-11-09T18:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: one row per file in the ripgrep wrapper

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the ripgrep wrapper show each matching file once at its best line, cut to `--limit`, with counts of what it hid, shipped with docs, an alignment pass, a measured benchmark and the three-phase benchmark summary.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Shaping runs after the existing rank tuple; there is no second ranker. |
| D2 | `SCHEMA_VERSION` moves to 2 and `ops/retrofit-convention.mjs` reads `matchCount` first. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npx vitest run` from `.skilled/skills/system-spec-kit` on `rg-wrapper-recipes.vitest.ts` and `retrofit-convention-pipeline.vitest.ts` exits 0
- [x] The spec's measured query returns 14 rows, one per file, with `schemaVersion: 2`, and `rg -n structuredCappedRecipe .skilled` prints nothing
- [x] `benchmark/results.md` shows at most 1 row per file and hidden counts on 8/8 queries that hid anything
- [x] Both package validators exit 0 with scenario 491 present, and the `/local-skilled-alignment` recheck shows 0 open P0 and P1 findings
- [x] `benchmark/summary.md` holds the before and after tables of phases 004, 005 and 006 with measured values
- [x] `validate.sh` on this phase prints `RESULT: PASSED` and every `acceptance-criteria.md` row is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning docs | Done | Level 2 spec, plan, tasks, acceptance criteria |
| Build | Done | Shaping, `--limit`, schema 2, tests; suite, validators and recheck in implementation-summary.md |

### Deviations and findings

| Item | Note |
|------|------|
| Human view | Still cut at 20 rows after shaping; fixed with a test proven by mutation |
| Alignment | 11 findings; presentation, scenario check, safe-integer limit and README fixes; C-002 and BAT-01 kept as P2 |
| Benchmark | 14 files shown on the measured query, 8/8 queries report what they hid, median -1.4% |
<!-- /ANCHOR:log -->
