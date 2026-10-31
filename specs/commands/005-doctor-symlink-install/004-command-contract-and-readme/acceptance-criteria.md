---
title: "Acceptance Criteria: Phase 4: command-contract-and-readme"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "command contract and readme acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/004-command-contract-and-readme"
    last_updated_at: "2026-10-31T15:52:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Every row marked Met against a recorded run"
    next_safe_action: "Refresh the two generated metadata files, then rerun validate --strict"
    blockers: []
    key_files:
      - "specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md"
      - ".skilled/skills/sk-doc/sk-create-command/assets/command-contract.json"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: command-contract-and-readme

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** commands/005-doctor-symlink-install/004-command-contract-and-readme
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
| AC-001 | REQ-001 | Given a doctor family entry that names neither command, When the router path, argument hint and selector text name both and the four execution targets, eight owned assets, four loader requirements, two destructive operations and two invocation aliases land, Then the contract parses and 16 of its lines name the new commands or their assets | The parse printed `parses`, and the file carries 16 such lines. The router path names both routers at `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:210` and `:211`, the argument hint at `:217`, the four execution targets from `:235` to `:238`, the eight owned assets from line 269 at `:269`, the four loader requirements from `:298` to `:301`, the two destructive operations at `:311` and `:312`, and both aliases at `:316`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:142` | Met | - |
| AC-002 | REQ-002 | Given a coverage sentence that counted a different total, When it reads "37 of the 41 shipped commands", Then the router walk prints 41 routers and every one is clean | `generate-command-routers.cjs --check` printed `routers=41 clean=41 path-drift=0 shape-drift=0` and exited 0, which is the census the sentence counts. The sentence sits at `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:8`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:143` | Met | - |
| AC-003 | REQ-003 | Given an argument hint over the 140-character soft budget that spelled the runtime list `<csv>`, When it is 128 characters and spells it `<list>`, Then both routers pass the command validator with `Total issues: 0` | `validate_document.py --type command` printed `Total issues: 0` on `.skilled/commands/doctor/symlink.md` and again on `.skilled/commands/doctor/install.md`. The symlink hint is at `.skilled/commands/doctor/symlink.md:3` at 128 characters and carries `<list>`. The install hint at `.skilled/commands/doctor/install.md:3` is 56. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:139`, with the hint detail at `:130` | Met | - |
| AC-004 | REQ-004 | Given two new routers, When each is written, Then each authored name is kebab-case | `check_authored_name_kebab.py` printed `PASS: authored artifact name is kebab-case: .skilled/commands/doctor/symlink.md` and the same for `install.md`, each exit 0, run in this pass against both files. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:141` | Met | - |
| AC-005 | REQ-005 | Given a README with no top-level setup section, When section 5 built on the two commands lands and the later sections are renumbered 6-17 with their anchors updated, Then `validate_document.py --type readme README.md` prints `Total issues: 0` | The readme validator printed `Total issues: 0`. The new section header is at `README.md:221`, the Quick Start line that points to it at `README.md:187`, and the renumbered sections run through `README.md:1743`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:140`, with the renumbering at `:133` | Met | - |
| AC-006 | REQ-006 | Given a DOCTOR section that named neither command, When it reads "Sixteen commands" and carries a row and an entry for each, Then the readme validator still passes and both rows follow `/doctor:setup` | The readme validator printed `Total issues: 0`, and the section reads `Sixteen commands check and repair the setup` at `README.md:1292`, with the `/doctor:install` row at `README.md:1298` and the `/doctor:symlink` row at `README.md:1299` after `/doctor:setup`, plus one entry per command at `README.md:1326` and `README.md:1332`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:140`, with the row detail at `:135` | Met | - |
| AC-007 | REQ-007 | Given contract fields the two contract tests read, When the doctor suite runs, Then it passes with the two contract tests green and no regression in the totals | `run-all.sh` exited 0 with `7 suite(s) passed, 0 failed`, node:test totals `pass 991` and `fail 0`, and it includes `doctor-install-contract.test.cjs` at 16/16 and `doctor-symlink-contract.test.cjs` at 34/34. The install test reads the contract at `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:1`, the symlink test at `.skilled/commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs:1`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:144` | Met | - |
| AC-008 | REQ-008 | Given each command index, When it is read against the router frontmatter, Then the catalog mirror check reports no drift | `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` printed `STATUS=OK` and exited 0. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:145` | Met | - |

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

Every row reads `Met`, and each one names the recorded run that proves it, so the contract, both routers and the README are all described by a check that passed from the final tree. The two generated metadata files are refreshed before the packet save and do not decide closure.
<!-- /ANCHOR:closure -->
