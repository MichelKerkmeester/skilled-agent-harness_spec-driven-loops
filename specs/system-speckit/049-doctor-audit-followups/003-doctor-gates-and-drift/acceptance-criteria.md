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
    last_updated_by: "build-orchestrator"
    recent_action: "Closed every criterion with evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-003-doctor-gates-and-drift"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the guard-owned manifest listing Code Mode and the three MCP CLI skills, When the guard runs, Then its output names all four installers and the three doctor scripts with their declared classes, and it exits 0. | `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` exits 0 and its output includes `.skilled/skills/mcp-tooling/mcp-figma/scripts/install.sh`, `mcp-chrome-devtools`, `mcp-click-up` and their `scripts/doctor.sh` rows; output saved to `scratch/`. Observed: `scratch/guard.log`, exit 0, seven PASS rows naming the four installers and the three `scripts/doctor.sh` files. Cited: scratch/guard.log:9 | Met | - |
| AC-002 | REQ-002 | Given the three parent-skill test suites, When they run, Then zero tests fail because the fixture resolves `@spec-kit/shared/frontmatter/parse-frontmatter.js` the way the real tree does. | `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-command-column.test.cjs` and the `-leaf-manifest` and `-root-router` files each report zero failures, with the captured output showing the contract library loaded. Observed: `scratch/parent-skill-after.log`, each suite `fail 0`; the root-router suite asserts `PASS: 12a-router-contract`, which only prints once the contract library loads. Cited: scratch/parent-skill-after.log:28 | Met | - |
| AC-003 | REQ-003 | Given `route-validate`, When a workflow omits a script the route declares, Then the validator fails with the activity rule id, and the live run over the current tree exits 0. | `bash .skilled/commands/doctor/scripts/route-validate.sh --self-test` fails the new fixture, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the activity assertion reported. Observed: `--self-test` exit 0 including `PASS: Self-test: activity-missing reported L1`; live run exit 0 with `PASS: L1: all 21 route script invocations are invoked by their workflow YAML`. Cited: scratch/route-validate.log:23 and scratch/route-validate-selftest.log:17 | Met | - |
| AC-004 | REQ-004 | Given the user-global Codex hook file, When the parity check runs with `--allow-worktree`, Then it exits 0 with its OK line, or a drift report names the repair path. | `node .skilled/bin/install-codex-hooks.mjs --check --allow-worktree` output is saved to `scratch/codex-hook-parity.md`; the planning run already returned exit 0 with `install-codex-hooks: OK`. Observed: `scratch/codex-hook-parity.md`, exit 0, `install-codex-hooks: OK`. Cited: scratch/codex-hook-parity.md:7 | Met | - |
| AC-005 | REQ-005 | Given the four skill-budget text sites, When the fix lands, Then no packet label remains, the presentation row describes the description-budget audit, and the Claude budget reads `SLASH_COMMAND_TOOL_CHAR_BUDGET` with an 8000 fallback. | `rg -n "Packet 086\|packet 086" .skilled/commands/doctor/scripts/audit_descriptions.py .skilled/skills/sk-doc/` finds none; `rg -n "Advisor budget" .skilled/commands/doctor/assets/doctor-rebuild-presentation.txt` finds none; a run of `python3 .skilled/commands/doctor/scripts/audit_descriptions.py` with the variable set and unset shows both budgets. Observed for the row this phase owns: `rg -n "Advisor budget"` over the rebuild presentation finds nothing. The report title, the two docstrings and the budget source are handled by `specs/sk-doc/063-description-budget`. Cited: .skilled/commands/doctor/assets/doctor-rebuild-presentation.txt:172 | Superseded | ADR-004 |
| AC-006 | REQ-006 | Given `ENV-REFERENCE.md`, When the stated count is set from the mechanical recount, Then the sentence's number equals the number of unique variable names the tables hold by the document's own method. | A recount script over the `Variable`-column tables and the sentence at `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:34` report the same number; both are saved to `scratch/env-count.md`. Observed: `scratch/env-count.md`, the stated method gives 154 and line 34 now says 154. Cited: scratch/env-count.md:7 | Met | - |
| AC-007 | REQ-007 | Given `fable-baseline.json`, When the fix lands, Then its target names an existing corpus or is explicitly retired, and the wrapper still prints its metric rows. | `rg -n "target" .skilled/skills/system-spec-kit/runtime/cli/metrics/fable-baseline.json` shows no deleted path, and `node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir <existing corpus>` exits 0 with the metric rows. Observed: `target` is `null` with a `targetStatus` retirement note; `scratch/fable-mode-check.log` over `specs/agents/010-repo-rule-system-integration/research` exits 0 with five metric rows. Cited: scratch/fable-mode-check.log:15 | Met | - |
| AC-008 | REQ-008 | Given the speckit presentation, When the fix lands, Then no generic `/doctor <target>` form remains and the route and catalog gates stay green. | `rg -n "/doctor[^:]" .skilled/commands/doctor/assets/doctor-speckit-presentation.txt` finds only the registered command forms, and `bash .skilled/commands/doctor/scripts/route-validate.sh` plus `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` both exit 0. Observed: `rg -n "/doctor[^:]"` on the presentation matches only `.skilled/commands/doctor/...` paths; `route-validate.sh` and `command-catalog-mirror-check.cjs` both exit 0. Cited: .skilled/commands/doctor/assets/doctor-speckit-presentation.txt:79 | Met | - |
| AC-009 | REQ-009 | Given the two closed-packet documents, When the corrections land, Then the Phase Context describes the redesign and the implementation summary drops the dead pattern claim and names `/doctor:rebuild` as the regeneration owner. | `rg -n "doctor_\*\.yaml" specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval/implementation-summary.md` finds no live claim, `rg -n "doctor:rebuild"` on the same file finds the owner, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval --strict` and the same for `003-update` both print `RESULT: PASSED`. Observed: no `doctor_*.yaml` match; limitation 5 names `/doctor:rebuild`; recursive strict validation of the 048 packet printed 15 of 15 `RESULT: PASSED`. Cited: specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval/implementation-summary.md:131 | Met | - |

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

Eight criteria are Met with the observed evidence named in each row, and AC-005 is Superseded by ADR-004: this phase fixed the presentation row it owns and the description-budget packet carries the three tooling items.
<!-- /ANCHOR:closure -->
