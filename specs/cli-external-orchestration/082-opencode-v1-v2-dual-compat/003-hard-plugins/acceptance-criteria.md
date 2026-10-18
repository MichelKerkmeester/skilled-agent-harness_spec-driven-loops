---
title: "Acceptance Criteria: Phase 3: hard-plugins"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "hard plugins acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-hard-plugins"
    last_updated_at: "2026-10-18T12:45:03Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hard-plugins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: hard-plugins

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins
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
| AC-001 | REQ-001 | Given the five hard plugins on v2, When `opencode2 api GET /api/plugin` runs with the raw query, Then all five names in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/hard-5.txt` appear as active | `comm -23 specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/hard-5.txt specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/v2-active-003.txt` prints no line | Unmet | - |
| AC-002 | REQ-002 | Given the five hard plugins on v1, When `opencode debug config </dev/null` runs, Then each name appears on a plugin load line and no `failed to load plugin` line appears | `grep -c 'failed to load plugin' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/v1-load-after-003.txt` prints 0, and `grep -o -F -f specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/hard-5.txt specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/v1-load-after-003.txt \| sort -u \| wc -l` prints 5 | Unmet | - |
| AC-003 | REQ-003 | Given the registration cases, When they run before and after the ports, Then every case fails before its port and passes after it | `grep -E '^# (pass\|fail)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/hard-before.txt` prints a `# fail` count equal to the case count, and `grep -E '^# (pass\|fail)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/hard-after.txt` prints `# fail 0` | Unmet | - |
| AC-004 | REQ-004 | Given the sentinel behaviour case, When it runs before and after its port, Then it fails before the port and passes after it | `grep -E '^\s*(not )?ok .*sentinel' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/hard-before.txt` shows `not ok`, and the same grep on `hard-after.txt` shows `ok` | Unmet | - |
| AC-005 | REQ-005 | Given the spec gate behaviour case, When it runs before and after its port, Then it fails before the port and passes after it, and the denial reaches the caller | `grep -E '^\s*(not )?ok .*spec gate' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/hard-before.txt` shows `not ok`, and the same grep on `hard-after.txt` shows `ok` | Unmet | - |
| AC-006 | REQ-006 | Given the `sk-vision` source and its build, When the bundle is rebuilt and loaded, Then both hosts load it, or the phase 1 blocker is recorded | `test -s .skilled/skills/sk-vision/vision-runtime/dist/plugin.js` exits 0, and `grep -c 'failed to load plugin' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/sk-vision-load.txt` prints 0. Or `test -s specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/sk-vision-blocked.txt` exits 0 and names the phase 1 verdict | Unmet | - |
| AC-007 | REQ-007 | Given the plugin suite, When it runs, Then the failure count is zero and the pass count is at or above the phase 2 floor | `grep -E '^# (pass\|fail)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/suite-after.txt` prints `# fail 0` and a `# pass` count at or above the value in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/baseline-floor.txt` | Unmet | - |
| AC-008 | REQ-008 | Given the phase, When its captures are searched, Then no step stopped, started or restarted the v2 service | `grep -l -E 'opencode2 service (stop\|start\|restart)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/*.txt` prints nothing | Unmet | - |
| AC-009 | REQ-009 | Given the goal port, When its source is searched, Then the prompt enqueue call uses `delivery: "queue"`, and the goal case passes | `grep -n 'delivery: "queue"' .opencode/plugins/opencode-goal.js .opencode/plugins/lib/opencode-goal-core.js` prints the enqueue call, and the goal case in `hard-after.txt` shows `ok` | Unmet | - |
| AC-010 | REQ-010 | Given the skill advisor port, When its source is searched, Then the context hook and the tool transform are registered on v2, and the advisor case passes | `grep -n -E 'session\.hook\("context"\)\|ctx\.tool\.transform' .opencode/plugins/system-skill-advisor.js` prints both calls, and the advisor case in `hard-after.txt` shows `ok` | Unmet | - |
| AC-011 | REQ-011 | Given the defensive null guards in the four entry modules, When they are searched, Then each guard the port touched has a positive capability check and a recorded replacement | `grep -n 'return null' .opencode/plugins/system-completion-sentinel.js .opencode/plugins/system-spec-gate.js .opencode/plugins/system-skill-advisor.js .opencode/plugins/opencode-goal.js` lists each guard, and the implementation summary lists the same count of replacements | Unmet | - |
| AC-012 | REQ-012 | Given the five default exports, When the entry modules are searched, Then each exports only its default, and no seam remains | `grep -n '^export ' <the five entry modules>` prints one `export default` line per file, and `grep -n '__test' <the five entry modules>` prints nothing | Unmet | - |
| AC-013 | REQ-013 | Given the phase, When `git status --porcelain` is compared with the snapshot, Then every new or changed path falls inside the file list in `spec.md` section 3 | `comm -13 specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/status-before.txt specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/status-after-003.txt` prints only paths named in `spec.md` section 3 | Unmet | - |
| AC-014 | REQ-014 | Given the diff, When DeepSeek reviews it against `sk-code/sk-code-opencode`, Then the review lists no open P0 or P1 item | The orchestrator reads `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/review-003.txt`. Each P0 or P1 it names has a fix, and the rerun of T017 to T022 after T024 confirms the fix | Unmet | - |

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

AC-001 and AC-002 come from the brief's load acceptance. AC-003 comes from the brief's registration acceptance. AC-004 and AC-005 come from the brief's behaviour acceptance for the sentinel and the spec gate. AC-006 comes from the brief's `sk-vision` scope. AC-007 carries the floor from phase 2. AC-008 comes from brief decision D4. AC-009 and AC-010 come from the brief's scope for the goal and the skill advisor. AC-011 comes from the brief's defensive guard rule. AC-012 comes from brief decision D1. AC-013 comes from the file list in `spec.md` section 3. AC-014 comes from brief decisions D6 and D7.

The template has no separate evidence column. The Verification column names the check, and it takes the observed evidence once the check runs. Each row stays `Unmet` until that evidence sits in its Verification cell.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Every row is `Unmet`. The phase closes after its captures sit in `scratch/`, the rerun matches each capture and the strict validator prints `RESULT: PASSED`. Three rows depend on phase 1 answers. AC-004 depends on Q5, AC-010 depends on Q6 and AC-006 depends on Q11 and its build. A row that a phase 1 verdict leaves unknown closes as blocked, with the verdict named. The orchestrator confirms each one before closure.
<!-- /ANCHOR:closure -->
