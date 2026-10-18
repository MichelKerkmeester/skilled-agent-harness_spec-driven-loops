---
title: "Acceptance Criteria: Phase 2: pins-imports-dual-export"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "pins imports dual export acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-pins-imports-dual-export"
    last_updated_at: "2026-10-18T12:45:02Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-pins-imports-dual-export"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: pins-imports-dual-export

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 11 mechanical plugins on v2, When `opencode2 api GET /api/plugin` runs with the raw query, Then every name in `scratch/mechanical-11.txt` appears as active | v2 read filtered to this worktree Evidence: `scratch/v2-plugin-final.json:5-83` shows all 11 mechanical plugins `active` (16 entries, 11 active). The five `failed` entries at lines 26, 51, 56, 71 and 76 are the phase 3 hard plugins. | Met | - |
| AC-002 | REQ-002 | Given the 11 mechanical plugins on v1, When `opencode debug config </dev/null` runs with `OPENCODE_DB` under `scratch/`, Then each name appears on a plugin load line and no `failed to load plugin` line appears | v1 load capture Evidence: `scratch/v1-harness-final.jsonl:1-16` reports `loaded` for all 16 plugins, the 11 mechanical ones included, with no failed-to-load row. The phase 1 harness is the v1 capture because v1 1.19.3 logs no plugin lines (`scratch/decisions.txt:7`). `scratch/v1-tool-ids-final.json:18-21` lists the four plugin tools. | Met | - |
| AC-003 | REQ-003 | Given the phase 1 floor in `scratch/baseline-floor.txt`, When the plugin suite runs, Then the pass count is at or above the floor and the fail count is zero | Suite summary against the floor Evidence: `scratch/suite-final.txt:341-344` reports tests 331, pass 331, fail 0, at or above the floor of 303 in `scratch/baseline-floor.txt:1`. | Met | - |
| AC-004 | REQ-004 | Given the registration file, When it runs against the unported tree and then the ported tree, Then all 11 cases fail before the port and pass after it | Registration before and after Evidence: `scratch/negative-control-registration.txt:12-15` reports tests 11, pass 0, fail 11 before the port, and `scratch/registration-final.txt:12-15` reports tests 11, pass 11, fail 0 after it. | Met | - |
| AC-005 | REQ-005 | Given the phase, When it ends, Then no step stopped, started or restarted the v2 service | Service state capture Evidence: `scratch/service-state.txt:2-3` records the v2 service as PID 46220, started 2026-10-18 12:18:22, before the phase began at 16:16:59 (`scratch/service-state.txt:5`), and still the same PID at close, so no step stopped, started or restarted it. `scratch/service-state.txt:8-11` shows every run-log line naming the service commands is quoted rule or criteria text, and `scratch/service-state.txt:14` records zero service commands in the oracle script. | Met | - |
| AC-006 | REQ-006 | Given both package files, When read, Then each pins `@opencode-ai/plugin` to `1.19.3` and declares `zod`, `.skilled/package.json` alone lists `@opencode/plugin` at `2.0.32` under `devDependencies`, `.opencode/package.json` carries no `devDependencies`, and both lock files changed | Pins check Evidence: `scratch/grep-checks.txt:2` prints `1.19.3 true 4.1.8 {}` for `.opencode/package.json` and `scratch/grep-checks.txt:3` prints `1.19.3 true 2.0.32` for `.skilled/package.json`. `scratch/grep-checks.txt:5` prints `0` for `@opencode/plugin` in `.opencode/package.json`. Both installs exited 0 and both lock files were regenerated (`scratch/install.txt:3-9`). Decision 3: `scratch/decisions.txt:4`. | Met | - |
| AC-007 | REQ-007 | Given the plugin folder, When grepped, Then no `@opencode-ai/plugin/tool` import is left in any plugin file | `grep -r -l '@opencode-ai/plugin/tool' .opencode/plugins/` prints nothing Evidence: `scratch/grep-checks.txt:6` heads the `plugin/tool imports (expect none)` section with no line under it. All three import sites plus the test stub were replaced (decision 1, `scratch/decisions.txt:2`). | Met | - |
| AC-008 | REQ-008 | Given the 11 entry modules, When grepped, Then each exports only its default and none carries a `__test` seam | `scratch/grep-checks.txt:7` heads the `__test` section with no line under it, and `scratch/grep-checks.txt:9-19` shows exactly one `export default dualPlugin(...)` line per entry module. | Met | - |
| AC-009 | REQ-009 | Given the phase, When `git status --porcelain` is compared with the snapshot, Then every new or changed path falls inside the file list in `spec.md` section 3, with the concurrent phase 5 paths attributed to commit `d0a4be2080` | Round 2 scope rerun Evidence: `scratch/scope-check.txt:1-78` is the rerun after the xcrun_db removal, and `scratch/scope-check.txt:80-86` attributes every changed path. This phase's files fall inside `spec.md` section 3 (`:81`), the parent oracle is decision 11 (`:82`), the phase 3 preparation captures belong to phase 3 (`:83`), and the phase 5 paths are committed in `d0a4be2080` (`:85`). The xcrun cache was removed with operator approval (`:86`). `scratch/status-after.txt:1-82` is the sorted status the comparison ran over. | Met | - |
| AC-010 | REQ-010 | Given the diff, When DeepSeek reviews it against `sk-code/sk-code-opencode`, Then the review lists no open P0 or P1 item | Review logs Evidence: `scratch/review-2-phase.log:149-150` names the two P1 items and both have fixes (`scratch/decisions.txt:13-14`): the seam fix shows in `scratch/grep-checks.txt:7` with the two core modules, and the session-payload fix shows in `scratch/bridge-final.txt:1-3`. `scratch/review-1-bridge.log:87-95` names 1 P1 and 4 P2, all fixed per decision 9 (`scratch/decisions.txt:10`). The T023 to T028 captures were rerun after the fixes. | Met | - |

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

### Row sources and evidence

AC-001 to AC-004 come from the Acceptance list in the phase brief. AC-005 comes from brief decision D4. AC-006 comes from brief decision D5 and from task T004. If T004 moves the dev dependency, AC-006 changes with it. AC-007 and AC-008 come from the brief's scope-in and from REQ-007 and REQ-008. AC-009 comes from the file list in `spec.md` section 3. AC-010 comes from brief decisions D6 and D7.

The template has no separate evidence column. The Verification column names the check, and it takes the observed evidence once the check runs. Each row stays `Unmet` until that evidence sits in its Verification cell.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All ten rows are `Met`, each with observed evidence in its Verification cell. AC-005 closed on the service-state capture (`scratch/service-state.txt:2-5`) and AC-009 on the scope rerun with every changed path attributed (`scratch/scope-check.txt:80-86`), both from the round 2 captures. The strict validator runs last, in T031.
<!-- /ANCHOR:closure -->
