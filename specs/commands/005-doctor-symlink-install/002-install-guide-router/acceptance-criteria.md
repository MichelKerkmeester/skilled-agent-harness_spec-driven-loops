---
title: "Acceptance Criteria: Phase 2: install-guide-router"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "install guide router acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/002-install-guide-router"
    last_updated_at: "2026-10-31T15:26:00Z"
    last_updated_by: "markdown"
    recent_action: "Superseded AC-004 by ADR-001 and added AC-007, which the recorded run proves"
    next_safe_action: "Run the generated-metadata refresh, then re-run strict validation"
    blockers:
      - "Strict validation reports two generated-metadata errors; repair-derived.cjs --apply clears them and this closeout does not own that rewrite"
    key_files:
      - ".skilled/commands/doctor/install.md"
      - ".skilled/commands/doctor/assets/doctor-install.yaml"
      - ".skilled/commands/doctor/assets/doctor-install-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Whether the live check must name a broken link outside the manifest"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: install-guide-router

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** commands/005-doctor-symlink-install/002-install-guide-router
**Level:** 2
**Status:** Complete
**Date:** 2026-10-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

The `/doctor:install` route landed in phase 003 step 1, so the rows that read `_routes.yaml` are judged against the registered route.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `install.md` and the registered route, When `bash .skilled/commands/doctor/scripts/route-validate.sh` runs, Then it exits 0 with `B3`, `E1`, `F2`, `J1` and `K1/K2` passing, so the router exists, the route's class is a read-only one that holds, its tools stay within its frontmatter union, and its target table matches the route | `bash .skilled/commands/doctor/scripts/route-validate.sh` printed `OK: route-validate — 28 routes validated, 10 warnings` and exits 0 only when no assertion fails, so `B3`, `E1`, `F2`, `K1/K2` and `L1` passed in that run; its `J1` line reports parity across 13 commands. The route row is `.skilled/commands/doctor/_routes.yaml:585` | Met | - |
| AC-002 | REQ-002 | Given `assets/doctor-install.yaml`, When the same gate runs, Then `L1` passes: every local script the route declares is invoked by a parsed value in that YAML, so the five steps have not drifted from the manifest | The same run. `L1` is one of the assertion groups behind that `OK` line; the install route's three declarations open at `.skilled/commands/doctor/_routes.yaml:593` and the steps they must appear in start at `.skilled/commands/doctor/assets/doctor-install.yaml:56`, and both files parse with exit 0 | Met | - |
| AC-003 | REQ-003 | Given the `read-only` route, When the same gate runs, Then `K1/K2` passes: the workflow declares no write activity and grants no mutating advisor command, so every writing step is printed rather than run | The same run. `K1/K2` is one of the assertion groups behind that `OK` line; the workflow declares `read_only: true` at `.skilled/commands/doctor/assets/doctor-install.yaml:24` and its Checklist step at `.skilled/commands/doctor/assets/doctor-install.yaml:60` prints the five commands and runs none of them | Met | - |
| AC-004 | REQ-004 | Given a target repository that holds whole links, When `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "…/Obsidian Plugin"` runs, Then it prints a status line per entry, names the broken `.pi-subagents` link, and exits 0 with nothing changed | Superseded: no run can satisfy it. The expectation came from the approved plan's Verification section, and `check` reads the framework's manifest entries only. `.pi-subagents` is not one of them, and the checkout has no such path, so the command never reports it. ADR-001 settles the standard and AC-007 states the same requirement in the form the command proves | Superseded | ADR-001 |
| AC-005 | REQ-005 | Given the registered route and the setup row, When `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` runs, Then the suite passes, so the install router owns a helper entry and `/doctor:setup` carries its row | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` reported 7 suites passed, 0 failed, 934 node tests passing, and that runner executes every `*.test.cjs` in the folder, which includes `doctor-helper-contract.test.cjs`; that suite fails a router with no setup row or no helper entry. The install row is `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:42` | Met | - |
| AC-006 | REQ-006 | Given the activated bridge, When `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` runs, Then every install phrase and the runnable command reach the `/doctor:install` bridge and it exits 0, so none of them lands on `/doctor:mcp install` | `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` printed `STATUS=OK phrases=184 bridges=32` and fails on any missed phrase; "install skilled into my project" returns `command-doctor-install`, declared at `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:309`, and no install phrase lands on `/doctor:mcp install` | Met | - |
| AC-007 | REQ-004 | Given Obsidian Plugin, When `node .skilled/commands/doctor/scripts/symlink-engine.cjs check` runs with all seven runtimes and `--link-instructions`, Then every framework entry is reported with its real state | The read-only live check on Obsidian Plugin reported every runtime folder, `.skilled`, `AGENTS.md` and `CLAUDE.md` as `linked-whole`, `.mcp.json` as `missing` and `REPO RULES.md` as `local`, then exited 0 with nothing changed. That is every manifest entry for that root. A link outside the manifest, such as the broken `.pi-subagents`, is outside this criterion by ADR-001. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:22` | Met | - |

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

Every row is `Met` or `Superseded`, and none is `Waived`. Six rows rest on recorded observations: the manifest gate (`AC-001`, `AC-002`, `AC-003`), the helper contract suite (`AC-005`), the phrase probe (`AC-006`) and the live check on Obsidian Plugin (`AC-007`). AC-004 is `Superseded` by ADR-001, because it asked `check` to name a link the command never reads. The packet's own closure is therefore settled on the criteria; strict validation still reports two generated-metadata errors, which the metadata refresh owns.
<!-- /ANCHOR:closure -->
