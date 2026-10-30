---
title: "Acceptance Criteria: Phase 6: convert-plumbing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "convert plumbing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/006-convert-plumbing"
    last_updated_at: "2026-10-30T12:20:00Z"
    last_updated_by: "implementer"
    recent_action: "Re-verified every criterion against the engine's current interface"
    next_safe_action: "Run validate.sh --strict on the packet and close the phase"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml"
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/sk-skill.md"
      - ".skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-convert-plumbing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "contract register convert in execution_targets: it did not, so this phase added the target, the workflow asset and the alias"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: convert-plumbing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/006-convert-plumbing
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the convert route and its YAML, When `bash .skilled/commands/doctor/scripts/route-validate.sh` runs, Then it exits 0 | `OK: route-validate — 20 routes validated, 3 warnings`, exit 0. The route is at `.skilled/commands/doctor/_routes.yaml:423`, its `mutating: mutates` at `:427`, and `J1` (target parity) and `L1` (all 51 script invocations invoked by their workflow YAML) pass with it present | Met | - |
| AC-002 | REQ-002 | Given a scratch skill, When `/doctor:sk-skill convert` runs and the operator answers "no", Then the run ends `STATUS=CANCELLED` and no file under the skill folder changed | `scratch/t018-alignment-run.md:57` through `:66` (with the plan at `:20`): the plan printed with exit 0, the tree hash was `c1347114f173c75400b772afa240e307efb6832ff6f5ac6599c49a7cb56dd37a` before and after the declined question, and the rendered result carries `STATUS=CANCELLED ACTION=cancelled`, `Declined: the allowed-tools list` and `Changed: none`. The promise is `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml` `mutation_boundaries.invariant` | Met | - |
| AC-003 | REQ-002 | Given the same scratch skill, When the operator answers "yes", Then the run ends `STATUS=OK` and prints the engine's undo list | `scratch/t018-alignment-run.md:68` through `:145`: `Preservation PASS: 7 original body line(s) found.`, `Result: PASS`, `Backup: …`, then the engine's own `Undo:` block with its `git -c core.fsmonitor=false restore` lines, its two `rm` lines and its `Check:` line, at exit 0, with the source folder's hash unchanged. The result template is `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` section 6 | Met | - |
| AC-004 | REQ-003 | Given a `local-`-prefixed skill and a dual-declaration fixture, When convert runs, Then each prints `REFUSE:` with its reason and `STATUS=FAIL` | `scratch/t014-convert-run.md:113`: `RESERVED_PREFIX: A local- prefixed skill is filtered by the format and advisor gates.` and `DUAL_DECLARATION: Resolver verdict dual-declaration: …`, both exit 1. The contract test now derives all 66 codes the engine can print from its own source, asserts each one is named in the presentation, and asserts every workflow refusal reason is a string the converter actually prints; the follow-up messages are not refusals there | Met | - |
| AC-005 | REQ-004 | Given the activated bridge, When `derive-command-bridges.cjs` then `doctor-phrase-reach.cjs` run, Then the convert phrases reach `/doctor:sk-skill` | `STATUS=OK phrases=130 bridges=24`, with seven `PASS command-doctor-sk-skill-convert` lines including `top "convert a plain agent skill"`, and five `PASS command-doctor-sk-skill-check` lines; the run is recorded at `tasks.md:106`. `derive-command-bridges.cjs --check` reports `"changed": []` | Met | - |
| AC-006 | REQ-005 | Given the extended contract test, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then every suite prints PASS | `[run-all] 7 suite(s) passed, 0 failed`, exit 0, recorded at `tasks.md:105`; `node --test …/doctor-sk-skill-contract.test.cjs` reports 32 tests, 32 pass (`tasks.md:111`), including the phase order, the flags the apply carries and the cancelled wording at both question sites | Met | - |
| AC-007 | REQ-006 | Given the two field messages, When convert meets one, Then each is its own question with its own yes and neither is written by the workflow | `scratch/t018-alignment-run.md:20` through `:41`: the plain-skill plan prints `allowed-tools: approval required; propose ["Read","Grep","Glob"]`, and `:148` through `:167`: an older Skilled skill with a 153-character description refuses `DESCRIPTION_TOO_LONG`, the approved trim is passed as `--description-trim`, and the rerun prints `Set description: "…"` as its own plan line. The questions are `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt:168` and `:169`; the workflow keeps both out of its refusal list and the test asserts it | Met | - |
| AC-008 | REQ-007 | Given the edited contract and router, When a JSON Schema validator checks `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` against `command-contract.schema.json` and `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command` runs, Then both exit 0 and the task log names the `/create:command` run that produced the surfaces | `whole-document schema errors = 0` and `families.doctor schema errors = 0`, exit 0, with the widened sk-skill hint; `✅ VALID: .skilled/commands/doctor/sk-skill.md … Total issues: 0`, exit 0. The `/create:command` run is logged at `scratch/t016-authoring-log.md:22` | Met | - |
| AC-009 | REQ-008 | Given the `convert` route in `_routes.yaml`, When `derive-command-bridges.cjs` and the contract test run, Then the `check` route carries `default_target: true`, the deriver exits 0 and the contract test asserts the flag | `default_target: true` sits on the check route at `.skilled/commands/doctor/_routes.yaml:407`; `derive-command-bridges.cjs --check` exits 0 with `"changed": []`; the contract test asserts the flag on `check` and its absence on `convert`, and the bare command still scores `command-doctor-sk-skill-check` as its top pick | Met | - |

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

Every criterion is `Met`, and each Verification cell names the command output or transcript section that
was observed. Nothing is waived or superseded, so no decision record is owed.

Two facts a reader should carry. The plain-skill path is part of this workflow, not a separate one: the
workflow agent reshapes the prose, `preserve --snapshot` proves the body survived, and the engine stages the
copy under `.skilled/skills/<name>` while the source folder stays untouched. And the scratch fixture is a
two-file skill, so its post-write check still reports rows a real skill package would satisfy; the conversion
itself ends `STATUS=OK`, prints the engine's undo block, and names those rows as the next step.
<!-- /ANCHOR:closure -->
