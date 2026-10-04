---
title: "Acceptance Criteria: Phase 9: doctor-git"
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
    packet_pointer: "system-speckit/049-doctor-audit-followups/009-doctor-git"
    last_updated_at: "2026-10-04T09:30:00Z"
    last_updated_by: "doctor-git"
    recent_action: "Marked every criterion met with observed evidence"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-git"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: doctor-git

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-doctor-audit-followups/009-doctor-git
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a saved `speckit.hooks.<key>` value, When a hook applies its gates, Then off in local or global config sets the gate's variable, and on, any other value, a command-scope value or an untrusted repository leaves the gate running | `bash .skilled/scripts/git-hooks/tests/gate-config.test.sh`: `gate-config: 25 passed, 0 failed`, exit 0, covering both scopes, the off spellings, local over global, `GIT_CONFIG_COUNT` in both directions and a repository without the toolchain | Met | - |
| AC-002 | REQ-001 | Given the installed hook is a symlink, When a commit runs with `speckit.hooks.prepareCommitMsg off`, Then the hook finds the helper beside its real file and prints the notice | Case 11 of the same suite passes; with the helper call removed in a scratch copy it failed: `gate-config: 24 passed, 1 failed` | Met | - |
| AC-003 | REQ-002 | Given the registry, When the parity cases run, Then every `SPECKIT_SKIP_*` and `SPECKIT_ALLOW_*` variable the hooks read has one row read by its named hook, and the two approvals are non-persistable | Parity cases 10 pass; `remotePush is not persistable` and `massDeletion is not persistable` pass; `gates.tsv` holds 12 rows for the 12 variables found in the hooks | Met | - |
| AC-004 | REQ-003 | Given `/doctor:git hooks`, When it lists and changes a gate, Then it shows saved and effective values, writes only after `--apply`, and refuses unknown keys and approvals | `node --test tests/git-hook-gates.test.cjs`: 6 of 6, including a dry run that writes nothing, an applied off the helper then reads, the explicit local on over a global off, and six refused requests that leave config empty | Met | - |
| AC-005 | REQ-004 | Given `/doctor:git standards`, When it initializes and edits rules, Then the shipped templates are never written, `init` never overwrites, and a rejected change writes nothing | `node --test tests/git-standards.test.cjs`: 10 of 10, including the shipped-template refusal with the file unchanged, `init` keeping a modified copy, and five rejected values with the file byte-identical | Met | - |
| AC-006 | REQ-005 | Given the route manifest, When `route-validate.sh` runs, Then `/doctor:git` is in parity with its router and presentation | `OK: route-validate — 11 routes validated, 2 warnings`, exit 0, J1 passing across 5 commands and L1 across 29 script invocations; both warnings are the informational shared `--dry-run` | Met | - |
| AC-007 | REQ-005 | Given the changed hooks and scripts, When every suite runs, Then all pass | Nine hook suites exit 0: gate-config 25, commit-msg 39, pre-commit 69, pre-push 46, prepare-commit-msg 66, pre-push message contract 15, source-root selection 58, mass deletion 12, autostash guard 9. `run-all.sh`: 7 suites, node:test 219 of 219, exit 0 | Met | - |
| AC-008 | REQ-006 | Given a rules change, When it is applied, Then it reports rules switched on or off and prose drift, and only the edited lines change | `set changes only the edited line` asserts one changed line and the sk-git validator then enforcing the new length; `set null removes a key` reports `trailer.spec-exists` switched off; the round-trip case holds all three shipped blocks to their layout | Met | - |
| AC-009 | REQ-007 | Given the contract, When it is validated, Then it passes its schema and every router is clean | Ajv against `command-contract.schema.json`: valid, exit 0; `generate-command-routers.cjs --check`: `routers=35 clean=35 path-drift=0 shape-drift=0`, exit 0 | Met | - |
| AC-010 | REQ-008 | Given the regenerated mirrors and docs, When their checks run, Then they pass and `/doctor:env` points at `/doctor:git hooks` | Runtime mirrors: 181 in sync; Codex, Pi and Hermes prompts: 37 in sync each; catalog `STATUS=OK`; route guard exit 0; links: 7,870 files, 0 broken; `doctor-env.yaml` and its presentation name `/doctor:git hooks` for a `SPECKIT_SKIP_*` gate | Met | - |

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

The hook suites and the two script suites carried the packet, and the installed-hook case was shown to fail without the wiring. Left out on purpose: an off switch for `commit-msg` and saved push approvals, both refused by design, and any edit to the sk-git skill, which the operator chose to leave untouched. The Hermes skill check still reports the `cli-jev` copy drifting; that drift predates this phase and touches no file it changed.
<!-- /ANCHOR:closure -->
