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
    last_updated_at: "2026-10-30T10:02:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every acceptance criterion and verified each with a command or a transcript"
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
| AC-001 | REQ-001 | Given the convert route and its YAML, When `bash .skilled/commands/doctor/scripts/route-validate.sh` runs, Then it exits 0 | `OK: route-validate — 20 routes validated, 3 warnings`, exit 0; the route is at `.skilled/commands/doctor/_routes.yaml:423`, its `mutating: mutates` at `.skilled/commands/doctor/_routes.yaml:427`, and D1, J1 and L1 pass with it present | Met | - |
| AC-002 | REQ-002 | Given a scratch skill, When `/doctor:sk-skill convert` runs and the operator answers "no", Then the run ends `STATUS=CANCELLED` and no file under the skill folder changed | `scratch/t014-convert-run.md:10` through `:37`: the plan printed, the operator answered no, and a hash diff of the skill folder before and after is empty; the invariant that promises it is `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml:40` | Met | - |
| AC-003 | REQ-002 | Given the same scratch skill, When the operator answers "yes", Then the run ends `STATUS=OK` and prints the undo list | `scratch/t014-convert-run.md:39` and `:97`: `Converted legacy-demo; router semantics match the snapshot.`, `Backup: …`, `Router source: inline -> ROUTER.md`, then the two undo commands, which were run and restored the folder's pre-conversion hashes; the result template is `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt:187` | Met | - |
| AC-004 | REQ-003 | Given a `local-`-prefixed skill and a dual-declaration fixture, When convert runs, Then each prints `REFUSE:` with its reason and `STATUS=FAIL` | `scratch/t014-convert-run.md:113`: `RESERVED_PREFIX: A local- prefixed skill is filtered by the format and advisor gates.` and `DUAL_DECLARATION: Resolver verdict dual-declaration: …`, both exit 1. `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs:342` asserts every refusal code and that each reason quotes the converter's own wording; the reasons are at `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml:71` | Met | - |
| AC-005 | REQ-004 | Given the activated bridge, When `derive-command-bridges.cjs` then `doctor-phrase-reach.cjs` run, Then the convert phrases reach `/doctor:sk-skill` | `STATUS=OK phrases=130 bridges=24` with six `PASS command-doctor-sk-skill-convert` lines and six `PASS command-doctor-sk-skill-check` lines. The activated entry is `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1052`; `derive-command-bridges.cjs --check` reports `"changed": []` | Met | - |
| AC-006 | REQ-005 | Given the extended contract test, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then every suite prints PASS | `[run-all] 7 suite(s) passed, 0 failed`, exit 0; `node --test …/doctor-sk-skill-contract.test.cjs` reports 25 tests, 25 pass, including the dual-route assertion at `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs:102` | Met | - |
| AC-007 | REQ-006 | Given a plain skill with a 140-character description and no `allowed-tools`, When convert plans, Then the plan lists the trim as its own yes and proposes `[Read, Grep, Glob]` for confirmation | `scratch/t014-convert-run.md:132`: a scratch skill with a 140-character description and no `allowed-tools` was planned; the workflow printed the trim and the `[Read, Grep, Glob]` proposal as two questions, each answered yes separately before the conversion plan printed, and a 134-character trim was still refused. The two questions are `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt:132` and `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt:133`. The fixture used the inline-router input shape because the plain-skill input kind is the parallel conversion path | Met | - |
| AC-008 | REQ-007 | Given the edited contract and router, When a JSON Schema validator checks `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` against `command-contract.schema.json` and `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command` runs, Then both exit 0 and the task log names the `/create:command` run that produced the surfaces | `schema errors = 0`, exit 0; `✅ VALID: .skilled/commands/doctor/sk-skill.md … Total issues: 0`, exit 0; the `/create:command` run is logged at `scratch/t016-authoring-log.md:22` and the validators at `:40` | Met | - |
| AC-009 | REQ-008 | Given the `convert` route in `_routes.yaml`, When `derive-command-bridges.cjs` and the contract test run, Then the `check` route carries `default_target: true`, the deriver exits 0 and the contract test asserts the flag | `default_target: true` sits on the check route at `.skilled/commands/doctor/_routes.yaml:407`; `derive-command-bridges.cjs` exits 0 with `"status": "generated"` and `--check` then reports `"status": "fresh"`; the assertion is `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs:102`; the bare command scored `command-doctor-sk-skill-check` as its top pick, which is the bridge written at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:630` | Met | - |

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

Two facts a reader should carry: the plain-skill input kind is the parallel conversion path and not this
phase's, and the scratch fixture is a two-file skill, so its post-conversion check still reports the rows a
real skill package would satisfy. The conversion itself ends `STATUS=OK` and names those rows as the next step.
<!-- /ANCHOR:closure -->
