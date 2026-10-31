---
title: "Acceptance Criteria: Phase 1: mcp-install-code-mode"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor mcp-install audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/001-mcp-install-code-mode"
    last_updated_at: "2026-10-02T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "All five acceptance criteria verified Met"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: mcp-install-code-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/001-mcp-install-code-mode
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:mcp install` route and `doctor-mcp-install.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md:7` and `scratch/reality-check.md:62` — the path table records a `test -e` PRESENT/MISSING probe per entry, and the command, flag and variable table cites the line-numbered source read that showed each one | Met | - |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:mcp install` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:1` and `scratch/doctor-run.log:7` — one read-only run of `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json`, exit code 2, pass 8 / warn 0 / fail 3 (launcher and UTCP JSON pass; `node_engine`, `dist_exists` and `node_modules` fail) | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md:55` and `scratch/proposal.md:3` — "Verdict: fix", evidenced by the pre-fix health run, the multi-server drift in the install YAML and presentation, and the three-config scan against seven registered runtimes | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `implementation-summary.md:121` — `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, "OK: route-validate — 10 routes validated, 2 warnings" | Met | - |
| AC-005 | REQ-005 | Given this checkout, When the phase closes, Then after the change, `doctor-mcp-install.yaml` sets up only MCP Code Mode and `.utcp_config.json`, covering how Code Mode is installed, how it is registered in each runtime config, and how a UTCP manual is added to `.utcp_config.json`; `scratch/reality-check.md` lists every other server the workflow named before. | rewritten `.skilled/commands/doctor/assets/doctor-mcp-install.yaml:1` — `yaml.safe_load` returns `YAML_OK` and the removed-name scan returns no output (exit 1); `scratch/reality-check.md:92` lists `mcp-figma`, `mcp-chrome-devtools`, `mcp-click-up`, Skill Advisor and System Code Graph | Met | - |

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

**Closeable:** Yes

All five rows are `Met`. The verdict is `fix`: `/doctor:mcp` keeps its route, narrowed to MCP
Code Mode and its `.utcp_config.json`, and the post-change checks passed — both scripts pass
`bash -n`, both YAMLs parse, the removed-name scan is clean, the router document validates with
0 issues, the catalog mirror check returns `STATUS=OK`, and `route-validate.sh` exits 0. The
health run still exits 2 on this worktree because `package.json`, `dist/index.js` and
`node_modules` are genuinely absent; each absence is reported by name rather than masked.
<!-- /ANCHOR:closure -->
