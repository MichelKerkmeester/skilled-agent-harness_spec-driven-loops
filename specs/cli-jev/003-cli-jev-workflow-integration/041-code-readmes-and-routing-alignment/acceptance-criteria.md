---
title: "Acceptance Criteria: Phase 41: code-readmes-and-routing-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "code readmes acceptance criteria"
  - "routing alignment closure gate"
  - "router active criteria"
  - "compiled route probe criteria"
  - "code readmes waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment"
    last_updated_at: "2026-10-01T07:16:01Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Marked all five criteria Met from the build's record and the final-state gates"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-041-code-readmes-and-routing-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 41: code-readmes-and-routing-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The five rows mirror the five completion criteria in `goal.md`. The Verification cell names the command, the expected output and the observed result from the build's record under `scratch/evidence/`. The build landed as commit `2116de635c` on `worktrees/071-cli-jev-sk-alignment`, and the orchestrator commits these phase docs after this closure pass. `H` is the hub at `.skilled/skills/cli-classifier`, `R` one of the eleven code folders of `spec.md` section 3, and `P` the ten-prompt probe corpus.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | Given the eleven code folders of `spec.md` section 3, When the READMEs land, Then each folder holds a code-folder README that `validate_document.py` calls VALID and that documents a test command which passes from the repository root, and the four out-of-scope folders stay untouched | `python3 .skilled/skills/sk-doc/scripts/validate_document.py R/README.md`, then the test command each README's validation section documents, run from the repository root. Expected: eleven VALID lines, and eleven test runs with 0 failed. The four out-of-scope folders gain no file, proven by their paths appearing in no diff. Observed: `scratch/evidence/build-evidence.md:29` records 22 of 22 changed skill docs VALID, 0 invalid, the eleven READMEs among them, `:30` records every documented test command exiting 0, and the build commit adds exactly the eleven README paths of section 3 with nothing under the four out-of-scope folders (`git show --stat --name-status 2116de635c`, this pass) | Met | - |
| AC-002 | REQ-003 | Given the hub's root `ROUTER.md` at `router_state: stage1-only`, When it is promoted, Then it declares `router_state: active` and maps the seven intents to leaves that come from `leaf-manifest.json`, and the hub's own contract check passes with 0 warnings | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier`. Expected: every mapped leaf resolves, 12a passes on the active state, and the last line reads `OK: parent-skill-check — all hard invariants passed, 0 warnings`. Boundary: 12a fails when a mapped leaf has no manifest entry, so a hand-extended leaf list cannot pass. Observed: `.skilled/skills/cli-classifier/ROUTER.md:12-13` declares `router_state: active` at `0.6.0.0` and `:63-104` maps the seven intents; `scratch/evidence/build-evidence.md:31` records the 0-warning check with 12a, 13a and 13b PASS | Met | - |
| AC-003 | REQ-004 | Given both mode section 2s route by a request-to-file lookup table, When they are reshaped, Then each carries the template's subsections and one Smart Router Pseudocode block whose functions include `_guard_in_skill()`, `discover_markdown_resources()`, `classify_intents()`, `load_if_available()` and `UNKNOWN_FALLBACK_CHECKLIST`, `cli-jev`'s transport mechanics sit in section 3, and the package gate passes on the hub and both modes | A read of both mode section 2s counting the five names and the code fences, then `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py` on `H`, `H/cli-jev` and `H/cli-deem`. Expected: each name once per mode inside one block, no lookup table as the routing contract, and PASS on all three packages. Observed: each mode carries one Smart Router Pseudocode block whose five names sit at `cli-jev/SKILL.md:138,147,154,167,192` and `cli-deem/SKILL.md:119,128,135,148,173`, after the template's Prerequisite or Availability, Phase Detection, Resource Domains and Resource Loading Levels subsections; `cli-jev`'s transport text sits in section 3 (`cli-jev/SKILL.md:228`) and is byte-identical after the move (`scratch/evidence/build-evidence.md:41`); and `:32` records PASS, PASS, PASS | Met | - |
| AC-004 | REQ-005, REQ-006 | Given the rename leftovers and the two deferred asks, When the vocabulary moves, Then no current-state file under the hub names `cli-usage-aliases` (the dated `v0.6.0.0` changelog records the rename as history) and the ten-prompt compiled-route probe matches the baseline on its eight correct rows while "which provider and model id does jev use" routes to `cli-jev` and "roll deem back to the previous commit" routes to `cli-deem` | `rg -n 'cli-usage-aliases' .skilled/skills/cli-classifier` must name no current-state file (the dated `changelog/v0.6.0.0.md` line is expected), then `node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "<p>"` for each of the ten prompts, compared against the baseline recording under `scratch/`. Expected: 8 rows with unchanged `workflowMode` and `packetId`, 2 rows with a single target naming their mode, and the off-topic row still deferring. Observed: `grep -rn 'cli-usage-aliases' .skilled/skills/cli-classifier` prints only the dated `changelog/v0.6.0.0.md:20` history line, no current-state file (this pass); the thirteen phrases sit in the two dispatch classes (`.skilled/skills/cli-classifier/hub-router.json:56-60,87-94`); `scratch/evidence/probe-after.txt:1-10` replays with 8 rows identical to `scratch/evidence/probe-before.txt:1-10`, row 8 routing to `cli-jev` and row 9 to `cli-deem`, and the off-topic rows still defer (`scratch/evidence/build-evidence.md:38`) | Met | - |
| AC-005 | REQ-007, REQ-008, REQ-009, REQ-011 | Given the three pre-release version lines and the generated mirrors, When the phase closes, Then the hub's five routing artifacts and the newest hub changelog agree on `0.6.0.0`, `cli-jev` agrees on `0.1.4.0` and `cli-deem` on `0.1.1.0`, the compiled-route manifest and the Hermes mirror are fresh, and `validate.sh --strict` prints `RESULT: PASSED` for this phase, with the parent folder's own generated metadata left to the orchestrator's sweep outside this phase's write scope | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` rules 13a and 13b, `node .skilled/bin/compiled-route-guard.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check`, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment --strict`. Expected: no 13a or 13b soft finding, the guard reports the hub fresh, `--check` passes, and `RESULT: PASSED` for this phase. Observed: the five hub artifacts read `0.6.0.0`, `cli-jev` `0.1.4.0` and `cli-deem` `0.1.1.0`, each against its newest changelog entry (this pass); `scratch/evidence/build-evidence.md:31` records 13a and 13b among the 0-warning check, `:33` the guard exit 0 with all hubs fresh, `:37` `PASS: 72 Hermes skill copies in sync`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment --strict` printed `RESULT: PASSED` (`Errors: 0`) in this closure pass, and the parent folder's own generated metadata is left to the orchestrator's sweep, recorded in `implementation-summary.md` | Met | - |

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

All five rows are Met from the build's record under `scratch/evidence/` and the gates run from the final state in this closure pass. The review recorded five P1s and six P2s across two rounds; every one was fixed and rechecked, round 2 returned `VERDICT: PASS`, and no P0 or P1 is open. The orchestrator commits the build and these docs path-scoped after this pass.
<!-- /ANCHOR:closure -->

---
