---
title: "Acceptance Criteria: Phase 4: v2-review-p2-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "v2 review p2 fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-v2-review-p2-fixes"
    last_updated_at: "2026-11-20T11:31:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-v2-review-p2-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: v2-review-p2-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 004-v2-review-p2-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the tests and live docs, When `opencode2` is searched outside `specs/`, Then every remaining hit is a retirement assertion, the `remove-v1` listing, history or generated data, and the probe still trusts only `opencode`, `/opencode` and `$OPENCODE_BIN` | `git grep -n opencode2 -- ':!specs' ':!*.json' ':!**/changelog/**' ':!**/benchmark/**'` lists only the battery and dispatch-audit parser inputs pinned to `unknown`, the vitest "does not probe an executable named opencode2" case, `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:250` and one dated playbook spec path. Observed 2026-11-20: those seven lines and no other; the models-form, freshness-guard, Pi lint and dispatch-audit suites pass. | Met | - |
| AC-002 | REQ-002 | Given the battery's v2 leg, When it spawns `serve`, Then it passes `--hostname 127.0.0.1`, the flag `serve --help` prints, and the test asserts it | `scratch/serve-help.txt:13` prints the flag, and `.skilled/commands/doctor/scripts/opencode-version-battery.cjs:978` passes it, asserted at `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs:967`; `node --test .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` prints `# fail 0`, and 1 failure with the flag removed; `scratch/battery-v2-live.txt:31` reads `exit=0`. Observed 2026-11-20: 49 of 49 pass, 48 of 49 with the flag removed, four PASS legs live on 2.3.2. | Met | - |
| AC-003 | REQ-003 | Given the plugin tree, When `dualPlugin` is searched outside `specs/`, Then nothing matches and the plugins still build through `definePlugin` with a hidden `factory` | `.opencode/plugins/lib/v2-bridge.js:327` exports `definePlugin`; `git grep -c dualPlugin -- ':!specs' \| wc -l` prints 0; `node --test '.opencode/plugins/tests/*.test.cjs'` prints `# fail 0`. Observed 2026-11-20: 0 files; 595 of 595 plugin tests pass; the live battery reports all 20 plugin files active. | Met | - |
| AC-004 | REQ-004 | Given the gate script, When it reruns from the final tree, Then no leg has more failures than the baseline | `scratch/gate-after.txt:16` against `scratch/gate-baseline.txt:17`; every count line of the two files is identical. Observed 2026-11-20: node 837 tests, 836 pass, 0 fail, 1 skipped; dispatch-audit 133 of 133; deep-loop subset 484 passed, 3 skipped; whole runtime suite 3716 passed, 11 skipped; Vibe 28 of 28, before and after. | Met | - |
| AC-005 | REQ-005 | Given the inventory hook case, When a plugin holds an unmapped key or no plugin is classified as bridged, Then the case fails | `scratch/unmapped-hook-mutation.txt:14` and `scratch/unmapped-hook-mutation.txt:27`, with the assertion at `.opencode/plugins/tests/plugin-inventory.test.cjs:148`. Observed 2026-11-20: dropping `dispose` from the mapped set fails it with `session-cleanup.js unmapped hooks`; a classifier miss fails it after the non-empty assertion, where before it passed on nothing. | Met | - |
| AC-006 | REQ-006 | Given the battery workflow's unit step, When its exact command runs with no `opencode` or `npm` on PATH and a fresh HOME, Then the classify test passes and leaves nothing behind | `scratch/classify-hermetic.txt:5` and `scratch/classify-hermetic.txt:14`; the step lists the file at `.github/workflows/opencode-v2-battery.yml:126`. Observed 2026-11-20: `opencode: not-found`, `npm: not-found`, 79 of 79 pass, `exit=0`, 0 files left in HOME. | Met | - |
| AC-007 | REQ-007 | Given the parity case, When it runs, Then it compares the two parsers on every corpus output and every hand-written output | The loop at `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:529`; `npx vitest run tests/unit/opencode-dual-dispatch.vitest.ts` in the runtime folder. Observed 2026-11-20: 24 passed, 0 failed, over 13 corpus plus 9 hand-written outputs. | Met | - |
| AC-008 | REQ-008 | Given phase 001's evidence, When the event-capture header and CHK-041 are read, Then the header names both parts and the command reproduces 0 | `../001-v1-runtime-code-and-tests/scratch/event-capture.txt:2` and `../001-v1-runtime-code-and-tests/tasks.md:157`. Observed 2026-11-20: the header names Part 1 static and Part 2 live, and the narrowed command prints 0. | Met | - |
| AC-009 | REQ-009 | Given the decision record, When ADR-001 is read, Then it cites Q005 and names each kept `opencode2` hit | `decision-record.md:41` and `decision-record.md:48`. Observed 2026-11-20: ADR-001 cites Q005 and lists the kept groups. | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is Met with evidence observed in this phase.
<!-- /ANCHOR:closure -->
