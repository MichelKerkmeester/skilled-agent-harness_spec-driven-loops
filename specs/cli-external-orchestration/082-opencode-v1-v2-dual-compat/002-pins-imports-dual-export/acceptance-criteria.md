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
| AC-001 | REQ-001 | Given the 11 mechanical plugins on v2, When `opencode2 api GET /api/plugin` runs with the raw query, Then every name in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/mechanical-11.txt` appears as active | `comm -23 specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/mechanical-11.txt specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/v2-active.txt` prints no line | Unmet | - |
| AC-002 | REQ-002 | Given the 11 mechanical plugins on v1, When `opencode debug config </dev/null` runs with `OPENCODE_DB` under `scratch/`, Then each name appears on a plugin load line and no `failed to load plugin` line appears | `grep -c 'failed to load plugin' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/v1-load-after.txt` prints 0, and `grep -o -F -f specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/mechanical-11.txt specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/v1-load-after.txt | sort -u | wc -l` prints 11 | Unmet | - |
| AC-003 | REQ-003 | Given the phase 1 floor in `scratch/baseline-floor.txt`, When the plugin suite runs, Then the pass count is at or above the floor and the fail count is zero | `grep -E '^# (pass|fail)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/suite-after.txt` prints a `# pass` count at or above the floor and `# fail 0` | Unmet | - |
| AC-004 | REQ-004 | Given the registration file, When it runs against the unported tree and then the ported tree, Then all 11 cases fail before the port and pass after it | `grep -E '^# (pass|fail)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/registration-before.txt` prints `# fail 11`, and `grep -E '^# (pass|fail)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/registration-after.txt` prints `# pass 11` and `# fail 0` | Unmet | - |
| AC-005 | REQ-005 | Given the phase, When it ends, Then no step stopped, started or restarted the v2 service | `grep -l -E 'opencode2 service (stop\|start\|restart)' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/*.txt` prints nothing | Unmet | - |
| AC-006 | REQ-006 | Given both package files, When read, Then each pins `@opencode-ai/plugin` to `1.19.3`, declares `zod`, and lists `@opencode/plugin` at `2.0.32` as a dev dependency, and both lock files changed | `node -p '(p => [p.dependencies["@opencode-ai/plugin"], !!p.dependencies.zod, p.devDependencies["@opencode/plugin"]].join(" "))(require("./.opencode/package.json"))'` prints `1.19.3 true 2.0.32`, the same check on `./.skilled/package.json` prints the same line, and `git diff --stat -- .opencode/package-lock.json .skilled/package-lock.json` lists both files | Unmet | - |
| AC-007 | REQ-007 | Given the plugin folder, When grepped, Then `@opencode-ai/plugin/tool` appears only in the phase 3 files named in the decision record | `grep -r -l '@opencode-ai/plugin/tool' .opencode/plugins/` prints only `opencode-goal.js`, `system-skill-advisor.js` and `tests/system-skill-advisor.test.cjs` | Unmet | - |
| AC-008 | REQ-008 | Given the 11 entry modules, When grepped, Then each exports only its default and none carries a `__test` seam | `grep -n '^export ' .opencode/plugins/{classifier-injection-screen,cli-dispatch-audit,codex-hooks-watchdog,mcp-route-guard,session-cleanup,sk-code-post-edit-quality,sk-git-message-gate,sk-git-preflight-advisory,system-deep-loop-guard,system-dist-freshness-guard,system-speckit-completion}.js` prints one `export default` line per file, and `grep -n '__test'` on the same list prints nothing | Unmet | - |
| AC-009 | REQ-009 | Given the phase, When `git status --porcelain` is compared with the snapshot, Then every new or changed path falls inside the file list in `spec.md` section 3 | `comm -13 specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/status-before.txt <(git status --porcelain \| sort)` prints only paths named in `spec.md` section 3 | Unmet | - |
| AC-010 | REQ-010 | Given the diff, When DeepSeek reviews it against `sk-code/sk-code-opencode`, Then the review lists no open P0 or P1 item | The orchestrator reads `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/scratch/review.txt`. Each P0 or P1 it names has a fix, and the rerun of T023 to T028 after T030 confirms the fix | Unmet | - |

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

**Closeable:** No

Every row is `Unmet`. The phase closes after its captures sit in `scratch/`, the rerun matches each capture and the strict validator prints `RESULT: PASSED`. Two rows depend on earlier answers. AC-001 depends on the phase 1 verdict on whether v2 reloads a changed plugin without a restart. AC-007 depends on the import-site decision in task T003. The orchestrator confirms both before closure.
<!-- /ANCHOR:closure -->
