---
title: "Acceptance Criteria: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "v4 2 0 0 release audit acceptance criteria"
  - "v4.2.0.0 audit fix closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research"
    last_updated_at: "2026-11-25T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded one row per fixed finding with its regression test"
    next_safe_action: "Commit the fix groups in the worktree"
    blockers: []
    key_files:
      - "research/research.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "b8d34bb4-84c2-4b74-9afe-9fa4707cd710"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 007-v4-2-0-0-release-audit-research
**Level:** 2
**Status:** Complete
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Where a row names a regression test for a behavior change, that test failed with the source put back to HEAD and passed with the fix. AC-012, AC-024 and AC-030 change no behavior, so they name a pin or a read instead.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fan-out run, When its lineages are listed, Then both labels hold iteration files | `ls research_archive/20261125T162358Z/lineages/` lists `codex` and `devin`, the first run's state, and `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/research.md:88` opens the second run's iteration log | Met | - |
| AC-002 | REQ-002 | Given `research/research.md`, When a finding is read, Then it carries a commit hash or a `file:line` | `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/research.md:9`, section 2: every row has both columns | Met | - |
| AC-003 | REQ-003 | Given a reported finding, When it is checked, Then it names the read or command that confirmed it | `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/research.md:281`, section 12, the independent verification | Met | - |
| AC-004 | REQ-004 | f-iter004-001: Given a runner stopped by a signal, When a lineage row has no recorded start time, Then the child still ends | `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts:353` | Met | - |
| AC-005 | REQ-004 | f-iter006-001 and V-4: Given a transcript path that ends at a JSON `\n` escape, When the Stop hook detects the packet, Then it resolves the child, not the parent | `.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts:81` | Met | - |
| AC-006 | REQ-004 | f-iter006-002 and V-2: Given a save holding the packet lock, When the Stop hook records answers, Then it leaves them pending and allocates no clashing id | `.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts:962` | Met | - |
| AC-007 | REQ-004 | f-iter008-003: Given an untrusted lineage, When the frontier is merged, Then its nodes claim no coverage | `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts:2203` | Met | - |
| AC-008 | REQ-004 | f-iter002-001: Given an owned destination that changes shape and case at once, When apply runs, Then it applies in one run | `.skilled/commands/doctor/scripts/tests/overlay-engine-shape-change.test.cjs:1100` and `:1112` | Met | - |
| AC-009 | REQ-004 | f-iter002-002: Given a user file or link whose bytes match a record spelled another way, When a layout link is planned, Then the user's entry stays | `.skilled/commands/doctor/scripts/tests/overlay-engine-shape-change.test.cjs:177` and `:200` | Met | - |
| AC-010 | REQ-004 | f-iter006-003: Given a failed consumed append, When the next Stop writes, Then a hand-edited row survives | `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts:278` | Met | - |
| AC-011 | REQ-004 | f-iter003-001: Given an inbox whose only question is resolved, When `--extend` runs, Then the re-stop warning fires | `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-steps.vitest.ts:151` | Met | - |
| AC-012 | REQ-004 | f-iter005-001: Given a refused `/deep:*` command in degraded mode, When the CLI renders it, Then it is not shown as typed | Not a defect end to end: the CLI degraded path drops the typed mark. Pinned by `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:86` and a sentence in `feature-catalog/python-compat/cli-shim.md` | Met | - |
| AC-013 | REQ-004 | f-iter005-002: Given "please do not run /deep:review, just review the parser once", When the scorer ranks it, Then sk-code ranks above system-deep-loop | `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-ask-routing.vitest.ts:165`. The routing baseline was regenerated, and only `sv-05` moved. The `typed-question` head in `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts` and its fixture now expects sk-code, and the command is still not offered | Met | - |
| AC-014 | REQ-004 | f-iter007-001: Given a Stop that wrote or failed a record, When the hook exits, Then one `systemMessage` line tells the operator | `.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts:1062` | Met | - |
| AC-015 | REQ-004 | f-iter007-002: Given a refused level-2 sub-track, When `create.sh` refuses it, Then it prints the folder and the declaration remedy | `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:275`, with the expectation at `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts:264` updated | Met | - |
| AC-016 | REQ-004 | f-iter007-003: Given a non-Claude hop with a worktree goal, When the wrapper relaunches, Then the warning is true and names both remedies | `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs:927` | Met | - |
| AC-017 | REQ-004 | f-iter008-001: Given an empty skill-graph database, When provisioning runs, Then it rebuilds it | `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:725` | Met | - |
| AC-018 | REQ-004 | f-iter008-002: Given a failed skill-graph scan, When provisioning reports it, Then the scan's own error line reaches the terminal | `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:743` | Met | - |
| AC-019 | REQ-004 | f-iter001-001: Given an unknown rollback run id, When the remedy is pasted as printed, Then it runs | `.skilled/commands/doctor/scripts/tests/overlay-engine-ux.test.cjs:72` | Met | - |
| AC-020 | REQ-004 | f-iter001-002 and the relayout root prefix: Given a finished relayout, When its last lines print, Then they name the restore command and the tree root, and the undo lines put relinked links back | `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1065`, `:1117` and `:1778` | Met | - |
| AC-021 | REQ-004 | Stray words: Given `onto` in a repin command line, When it is parsed, Then it is refused instead of read as `--to` | `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:920` | Met | - |
| AC-022 | REQ-004 | `--json` errors: Given `status --json` with a bad flag or root, When it fails, Then the error is JSON | `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:635` | Met | - |
| AC-023 | REQ-004 | Rollback staleness: Given a path changed after a repin run, When `--rollback` runs, Then it restores nothing and says why | `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:532`, `:559` and `:573` | Met | - |
| AC-024 | REQ-004 | `run_extended` lineageId: Given an extended run, When the reducer reads the lineage, Then it gets the value it expects | Checked, no change needed: `.skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:463` reads the same value the step writes | Met | - |
| AC-025 | REQ-004 | Pre-synthesis B on a deep-research fan-out: Given a fan-out run, When the operator picks B, Then the run ends PARTIAL and names the rerun | `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-loop-fanout-wiring.vitest.ts:91` | Met | - |
| AC-026 | REQ-004 | V-1: Given a written decision record, When the consumed log append fails, Then the hook reports the rows it wrote | `.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts:943` | Met | - |
| AC-027 | REQ-004 | V-3: Given `--stop` on win32, When it cannot verify a pid, Then it names the remedy | `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts:240`, inside the test at `:214` | Met | - |
| AC-028 | REQ-004 | Pre-synthesis B on a deep-review fan-out, chosen by the operator as a nearby defect: same outcome as AC-025 | `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-loop-fanout-wiring.vitest.ts:100` | Met | - |
| AC-029 | REQ-004 | Skill-root case fold, chosen by the operator as a nearby defect: Given a skill-root replace path that changes shape and case, When apply runs, Then it applies in one run in both directions | `.skilled/commands/doctor/scripts/tests/overlay-engine-shape-change.test.cjs:1126` and `:1147` | Met | - |
| AC-030 | REQ-004 | Doc drift, chosen by the operator: Given the changed warning and provisioning check, When their docs are read, Then they match | `.skilled/hooks/session-handover/goal-carry-over.md:128` names both remedies. The `provision_worktree` comment in `worktree-naming.sh` says "none or an empty one" | Met | - |
| AC-031 | REQ-005 | Given every touched suite, When it reruns from the final state, Then it passes in full | All eight touched suites exit 0 from the final state, with before and after counts at `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/implementation-summary.md:133` | Met | - |
| AC-032 | REQ-004 | f-iter008-003 at the stop decision: Given a merged registry whose frontier holds `_untrusted` nodes, When the research or review stop facts are built, Then only trusted nodes count toward `frontierOpen`, `frontierTotal` and `frontierAnswered` | `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts:1169`. With the HEAD `convergence.cjs` swapped in it fails, 1 failed and 132 passed. With the fix all 133 pass | Met | - |
| AC-033 | REQ-005 | Given the stop-decision fix on `main`, When the deep-loop runtime suite reruns, Then it passes in full | 225 files, 4067 passed and 11 skipped, exit 0. The baseline on `main` before the fix was 4066 passed and 11 skipped | Met | - |

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
`decision-record.md`.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met. f-iter005-003 and f-iter009-003 have no row because REQ-004 leaves them out by name: the first is pinned by design and the second has no shown consequence.
<!-- /ANCHOR:closure -->
