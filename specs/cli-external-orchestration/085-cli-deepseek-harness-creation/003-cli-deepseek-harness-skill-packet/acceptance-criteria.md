---
title: "Acceptance Criteria: Phase 3: cli-deepseek-harness-skill-packet"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cli deepseek harness skill packet acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/003-cli-deepseek-harness-skill-packet"
    last_updated_at: "2026-11-06T04:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked all five criteria Met with observed evidence"
    next_safe_action: "Hand off to phase 004 and phase 011"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-003-cli-deepseek-harness-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: cli-deepseek-harness-skill-packet

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/085-cli-deepseek-harness-creation/003-cli-deepseek-harness-skill-packet`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new packet folder, When the skill checker runs on it, Then it reports no errors | `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/cli-external-orchestration/cli-deepseek-harness`. Observed 2026-11-06: no ERROR row, C3 `PASS Format: Strict package validation passed.`, C4, C7 and C12 PASS. It prints `Result: FINDINGS (3)` and exits 1. C8 (stale compiled skill graph) and C9 (Hermes mirror) are fleet-wide and identical on `cli-pi` and `cli-hermes`. C10 (`The changelog index link is missing or does not resolve.`) is the global changelog link that hub registration adds, outside this phase's write scope | Met | - |
| AC-002 | REQ-002 | Given `hard-rules.json`, When it is parsed and scanned, Then it parses and all eleven rule ids are present | `node -e 'JSON.parse(require("fs").readFileSync(process.argv[1]))' <file>` exits 0 and a `rg -q` loop over `headless-only`, `stdin-dash-required`, `route-patch-required`, `closed-roster`, `approval-never-required`, `dsh-home-isolated`, `lineage-patch-required`, `json-final-and-exit-required`, `pinned-version-required`, `no-repo-root-dotenv` and `mcp-opt-in-only` exits 0. Observed: parse exit 0 with 11 rules, id loop exit 0 | Met | - |
| AC-003 | REQ-003 | Given `references/cli-reference.md`, When each flag it names is searched in the phase 002 help capture, Then every flag is found | Scripted `rg -F -q` loop against `002-dsh-offline-contract-pin/evidence/headless-help.txt` exits 0. Observed: 7 app flags found (`--add-dir`, `--approval-policy`, `--help`, `--json`, `--permission-mode`, `--profile`, `--session-id`), loop exit 0. The loop excludes exactly the four launcher flags `--patch`, `--dump-config`, `--dump-default-config` and `--version`, which `cli-reference.md` section 4 grounds separately, and a second loop found each of them in `resource-map.md`, `research.md` or `phase-plan.md`, exit 0. A control loop with no exclusions reports exactly those four as missing | Met | - |
| AC-004 | REQ-004 | Given `references/providers-and-models.md`, When its roster table is read, Then it lists exactly LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash` and marks the OpenCode Go endpoint UNKNOWN | `rg -c 'deepseek-v4.1-flash' <file>` and `rg -n 'UNKNOWN' <file>`. Observed: `rg -c` prints 5, the roster table in section 2 has exactly two rows (LLM Gateway `deepseek-v4.1-flash-1017`, OpenCode Go `deepseek-v4.1-flash`) and `UNKNOWN` sits on the OpenCode Go row and its endpoint subsection | Met | - |
| AC-005 | REQ-005 | Given the filled phase docs, When `validate.sh` runs on the phase folder with `--strict`, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict`. Observed: `RESULT: PASSED`, recorded in `implementation-summary.md` | Met | - |

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

All five criteria are Met with observed evidence. AC-001 is Met on the reading that the checker reports no ERROR row and passes its strict format check. Its exit status is 1 because of three FINDING rows, none of which this packet can clear inside its write scope: two are fleet-wide and the third waits for hub registration.
<!-- /ANCHOR:closure -->
