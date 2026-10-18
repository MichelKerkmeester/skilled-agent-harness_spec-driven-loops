---
title: "Acceptance Criteria: Phase 4: agents-commands-config"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "agents commands config acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-agents-commands-config"
    last_updated_at: "2026-10-18T12:45:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-agents-commands-config"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: agents-commands-config

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config
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
| AC-001 | REQ-001 | Given the agent mirror set, When `node .opencode/bin/check-agent-mirror-sync.cjs` runs, Then it exits 0 and reports 11 agents checked | `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/mirror-check-after.txt` records exit 0 and the line `agent-mirror-sync: 11 agent(s) checked` | Unmet | - |
| AC-002 | REQ-002 | Given the ten agents that carry `chrome_devtools: deny`, When their frontmatter is read, Then each also carries `browser: deny`, and no other frontmatter key changes | `grep -l 'browser: deny' .skilled/agents/*.md \| wc -l` prints 10, and `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/frontmatter-diff.txt` holds only `browser: deny` lines | Unmet | - |
| AC-003 | REQ-003 | Given the eleven agent bodies that name the `Task` tool, When the review marks each remaining mention, Then each mention is a prohibition or a named example, and no runtime-only name is universal | `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/review-004.txt` marks each remaining `Task` mention, and it names no open P0 or P1 item for this rule | Unmet | - |
| AC-004 | REQ-004 | Given the runtime table in `orchestrate.md`, When it is read, Then it lists Devin's `run_subagent`, and it lists UNKNOWN for each runtime with no evidence | `grep -n 'run_subagent' .skilled/agents/orchestrate.md` prints one table row, and `grep -n 'UNKNOWN' .skilled/agents/orchestrate.md` prints a row for each unnamed runtime | Unmet | - |
| AC-005 | REQ-005 | Given the twelve moved files, When `.skilled/commands` is searched, Then no moved file remains there | `find .skilled/commands -name '*.md' \| grep -E '/(scripts\|assets\|fixtures)/\|README'` prints nothing | Unmet | - |
| AC-006 | REQ-006 | Given the v1 command listing and `opencode2 api GET /api/command`, When each is read after the move, Then neither lists a moved file | `grep -c -F -f specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/move-names.txt specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/command-listing-after.txt` prints 0, where `move-names.txt` holds the twelve moved paths from T010 | Unmet | - |
| AC-007 | REQ-007 | Given the contract compiler and drift tests, When they run from the new paths, Then they show the same pass count as the baseline, with no new failure | `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/contract-tests-after.txt` shows the same pass count as `contract-tests-before.txt`, and no failure beyond it | Unmet | - |
| AC-008 | REQ-008 | Given `opencode.json`, When `opencode debug config </dev/null` runs on v1 1.19.3, Then it exits without error | `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/config-load-after.txt` records exit 0, and `grep -c -i 'error' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/config-load-after.txt` prints 0 | Unmet | - |
| AC-009 | REQ-009 | Given the config shape test, When it runs, Then both cases pass, and the negative case fails on the copy that carries a v2-only key | `grep -E '^# (pass\|fail)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/config-shape.txt` prints `# pass 2` and `# fail 0` | Unmet | - |
| AC-010 | REQ-010 | Given the consumers of the moved files, When they are searched for old paths, Then only recorded exceptions remain | `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/stale-paths.txt` lists only the exceptions that the implementation summary records | Unmet | - |
| AC-011 | REQ-011 | Given the phase, When `git status --porcelain` is compared with the snapshot, Then every new or changed path falls inside the file list in `spec.md` section 3 | `comm -13 specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/status-before.txt specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/status-after.txt` prints only paths named in `spec.md` section 3 | Unmet | - |
| AC-012 | REQ-012 | Given the diff, When DeepSeek reviews it against `sk-doc` agent mode and `sk-code/sk-code-opencode`, Then the review lists no open P0 or P1 item | The orchestrator reads `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/review-004.txt`. Each P0 or P1 it names has a fix, and the rerun of T013 to T020 after T022 confirms the fix | Unmet | - |

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

Each row AC-n maps to REQ-n in `spec.md` section 4, so the two lists stay in step. AC-011 checks the file list in `spec.md` section 3, and AC-012 checks the review that decision D7 requires for the agent bodies and the config test.

The template has no separate evidence column. The Verification column names the check, and it takes the observed evidence once the check runs. Each row stays `Unmet` until that evidence sits in its Verification cell.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Every row is `Unmet`. The phase closes after its captures sit in `scratch/`, the rerun matches each capture and the strict validator prints `RESULT: PASSED`. Two rows depend on the orchestrator's decisions in T003. AC-005 and AC-006 depend on the destination of the moved files, and AC-008 depends on the D2 conflict. The orchestrator confirms both before closure.
<!-- /ANCHOR:closure -->
