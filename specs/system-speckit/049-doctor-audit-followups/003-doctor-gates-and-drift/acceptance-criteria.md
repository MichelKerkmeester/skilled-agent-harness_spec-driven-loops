---
title: "Acceptance Criteria: Phase 3: doctor-gates-and-drift"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/003-doctor-gates-and-drift"
    last_updated_at: "2026-10-03T05:27:42Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-003-doctor-gates-and-drift"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: doctor-gates-and-drift

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-doctor-audit-followups/003-doctor-gates-and-drift
**Level:** 3
**Status:** Planned
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the guard-owned manifest listing Code Mode and the three MCP CLI skills, When the guard runs, Then its output names all four installers and the three doctor scripts with their declared classes, and it exits 0. | `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` exits 0 and its output includes `.skilled/skills/mcp-tooling/mcp-figma/scripts/install.sh`, `mcp-chrome-devtools`, `mcp-click-up` and their `scripts/doctor.sh` rows; output saved to `scratch/`. | Unmet | - |
| AC-002 | REQ-002 | Given the three parent-skill test suites, When they run, Then zero tests fail because the fixture resolves `@spec-kit/shared/frontmatter/parse-frontmatter.js` the way the real tree does. | `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-command-column.test.cjs` and the `-leaf-manifest` and `-root-router` files each report zero failures, with the captured output showing the contract library loaded. | Unmet | - |
| AC-003 | REQ-003 | Given `route-validate`, When a workflow omits a script the route declares, Then the validator fails with the activity rule id, and the live run over the current tree exits 0. | `bash .skilled/commands/doctor/scripts/route-validate.sh --self-test` fails the new fixture, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the activity assertion reported. | Unmet | - |
| AC-004 | REQ-004 | Given the user-global Codex hook file, When the parity check runs with `--allow-worktree`, Then it exits 0 with its OK line, or a drift report names the repair path. | `node .skilled/bin/install-codex-hooks.mjs --check --allow-worktree` output is saved to `scratch/codex-hook-parity.md`; the planning run already returned exit 0 with `install-codex-hooks: OK`. | Unmet | - |
| AC-005 | REQ-005 | Given the four skill-budget text sites, When the fix lands, Then no packet label remains, the presentation row describes the description-budget audit, and the Claude budget reads `SLASH_COMMAND_TOOL_CHAR_BUDGET` with an 8000 fallback. | `rg -n "Packet 086\|packet 086" .skilled/commands/doctor/scripts/audit_descriptions.py .skilled/skills/sk-doc/` finds none; `rg -n "Advisor budget" .skilled/commands/doctor/assets/doctor-rebuild-presentation.txt` finds none; a run of `python3 .skilled/commands/doctor/scripts/audit_descriptions.py` with the variable set and unset shows both budgets. | Unmet | - |
| AC-006 | REQ-006 | Given `ENV-REFERENCE.md`, When the stated count is set from the mechanical recount, Then the sentence's number equals the number of unique variable names the tables hold by the document's own method. | A recount script over the `Variable`-column tables and the sentence at `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:34` report the same number; both are saved to `scratch/env-count.md`. | Unmet | - |
| AC-007 | REQ-007 | Given `fable-baseline.json`, When the fix lands, Then its target names an existing corpus or is explicitly retired, and the wrapper still prints its metric rows. | `rg -n "target" .skilled/skills/system-spec-kit/runtime/cli/metrics/fable-baseline.json` shows no deleted path, and `node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir <existing corpus>` exits 0 with the metric rows. | Unmet | - |
| AC-008 | REQ-008 | Given the speckit presentation, When the fix lands, Then no generic `/doctor <target>` form remains and the route and catalog gates stay green. | `rg -n "/doctor[^:]" .skilled/commands/doctor/assets/doctor-speckit-presentation.txt` finds only the registered command forms, and `bash .skilled/commands/doctor/scripts/route-validate.sh` plus `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` both exit 0. | Unmet | - |
| AC-009 | REQ-009 | Given the two closed-packet documents, When the corrections land, Then the Phase Context describes the redesign and the implementation summary drops the dead pattern claim and names `/doctor:rebuild` as the regeneration owner. | `rg -n "doctor_\*\.yaml" specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval/implementation-summary.md` finds no live claim, `rg -n "doctor:rebuild"` on the same file finds the owner, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval --strict` and the same for `003-update` both print `RESULT: PASSED`. | Unmet | - |

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

All nine criteria are `Unmet` at planning time: the guard still covers one skill, the three suites still fail, and the texts, counts and closed-packet statements are unchanged. The Codex hook comparison was made at planning time and passes; its criterion closes when the recorded output is in the phase's `scratch/`.
<!-- /ANCHOR:closure -->
