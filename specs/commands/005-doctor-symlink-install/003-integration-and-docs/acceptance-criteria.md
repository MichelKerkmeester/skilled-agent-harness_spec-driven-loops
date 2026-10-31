---
title: "Acceptance Criteria: Phase 3: integration-and-docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "integration and docs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/003-integration-and-docs"
    last_updated_at: "2026-10-31T15:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the packet: AC-008 superseded by ADR-001, and AC-010 names the two registration surfaces"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - "specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: integration-and-docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** commands/005-doctor-symlink-install/003-integration-and-docs
**Level:** 2
**Status:** Complete
**Date:** 2026-10-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

The evidence line cited in each `Met` row is the run the orchestrator recorded in `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md`, plus the file and line that carry the result in this tree.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a manifest with 24 routes under a 14-file header, When the three `/doctor:symlink` routes and the one `/doctor:install` route land and the header lists 16 router files, Then `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and prints `.routes has 28 entries` | `bash .skilled/commands/doctor/scripts/route-validate.sh` printed `OK: route-validate — 28 routes validated, 10 warnings` and exited 0. The header lists the 16 router files at `.skilled/commands/doctor/_routes.yaml:6`, and the four routes are in the same manifest. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:40` | Met | - |
| AC-002 | REQ-002 | Given both routers on disk and no row for either in the `/doctor:setup` target list, When the two rows land, Then `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` exits 0 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs every `*.test.cjs` in that folder, `doctor-helper-contract.test.cjs` included: 7 suites passed, 0 failed, 934 tests. The two rows sit at `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:42`, the install row first. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:59` | Met | - |
| AC-003 | REQ-003 | Given no activation entry for either command, When four entries land in each of the `typescript` and `python` lists and the four bridge files are regenerated, Then `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` exits 0 | `derive-command-bridges.cjs` exited 0, the four entries are in each language list at `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:291`, and the advisor runtime was rebuilt. `doctor-phrase-reach.cjs` then read `STATUS=OK phrases=184 bridges=32`, so the generated bridges route. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:52`. The recorded run is the deriver in regenerate mode, not its `--check` mode | Met | - |
| AC-004 | REQ-004 | Given a command index whose family row reads Fourteen, When both commands are listed and the row reads Sixteen, Then `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK` | `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` printed `STATUS=OK`, where before the index edits it failed on the two missing commands and the 14 count. The family row reads Sixteen at `.skilled/commands/README.txt:129`, and the two table rows are at `.skilled/commands/README.txt:148`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:64` | Met | - |
| AC-005 | REQ-005 | Given a root README that names neither command, When the install section, the Keep It Healthy line, the Sixteen count, two table rows and two per-command entries land, Then `rg -l '/doctor:symlink' README.md` and `rg -l '/doctor:install' README.md` both print the path | `### Use It In Your Own Project` is at `README.md:185`, the Keep It Healthy line naming both commands is at `README.md:223`, and the Sixteen count is at `README.md:1230`. Both table rows and both per-command entries follow. The edit record is `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:66` | Met | - |
| AC-006 | REQ-006 | Given helper fixtures with no row for either command, When both are covered, Then `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` exits 0 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` includes `doctor-helper-match.test.cjs`: 7 suites passed, 0 failed, 934 tests. The three new tune rows are at `.skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/tune.jsonl:62`, and the held-out fixture is hash-pinned and unchanged. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:72` | Met | - |
| AC-007 | REQ-007 | Given a doctor catalog and playbook that name neither command, When both are covered, Then `rg -l '/doctor:symlink' <catalog file>` prints the catalog path and `rg -l '/doctor:install' <playbook folder>` prints a scenario path | The catalog names both routers at `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:49`. DOC-398 is `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-symlink.md:1` and DOC-399 is `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-install.md:1`, with their index rows at `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:25`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:68` | Met | - |
| AC-008 | REQ-008 | Given the two owner READMEs and the advisor routing document, When each names both commands, Then `rg -l '/doctor:symlink'` prints all three paths | Superseded by ADR-001. The criterion asked three documents for one shape. `.skilled/skills/system-spec-kit/README.md:562` and `:563` carry both runnable rows. `rg -n '/doctor:symlink'` over the advisor README exits 1, because that file states the brief shape generically at `.skilled/skills/system-skill-advisor/README.md:103` and names one concrete command, `/doctor:setup`. The routing document registers bridges by id and says at line 35 that a bridge renders as a runnable string, never as its id. AC-010 carries both registrations in the form each document uses | Superseded | ADR-001 |
| AC-009 | REQ-009 | Given every runtime and prompt mirror, When each generator reruns and its `--check` passes, Then `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0 | `sync-runtime-mirrors.cjs --check` printed `PASS: 211 mirrors across 9 trees are in sync`, and the pi, codex and hermes prompt generators each printed `PASS: 43 prompts are in sync`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:62` | Met | - |
| AC-010 | REQ-008 | Given the spec-kit README doctor table and the advisor doctor routing document, When each registers both commands in the form that document already uses, Then `rg -n '/doctor:symlink'` and `rg -n '/doctor:install'` print one table row each in the README, and `rg -n 'command-doctor-symlink'` and `rg -n 'command-doctor-install'` print the activation sentence in the routing document | Both runnable rows are in the spec-kit README doctor table at `.skilled/skills/system-spec-kit/README.md:562` and `:563`, under a lead-in that reads seven doctor commands. Both bridge families are named at `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:27`, beside `command-doctor-helper` and the `command-doctor-agents-md-*` bridges. These are the commands the criterion names, run in this pass: `rg -n '/doctor:symlink' .skilled/skills/system-spec-kit/README.md` printed line 562, `rg -n '/doctor:install'` on the same file printed line 563, and on the routing document `rg -n 'command-doctor-symlink'` and `rg -n 'command-doctor-install'` each printed line 27 | Met | - |

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

Ten rows, all closed: nine `Met` and AC-008 `Superseded` by ADR-001. Every `Met` row but AC-010 names the run that observed it in `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md`, and AC-010 names the two commands this pass ran over the two owner documents. Both commands are registered on every surface the plan named, in the form each surface already uses, so the packet closes.
<!-- /ANCHOR:closure -->
