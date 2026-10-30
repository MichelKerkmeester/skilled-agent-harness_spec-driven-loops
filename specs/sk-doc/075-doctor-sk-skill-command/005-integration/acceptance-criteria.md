---
title: "Acceptance Criteria: Phase 5: integration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "integration acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/005-integration"
    last_updated_at: "2026-10-30T10:45:00Z"
    last_updated_by: "code-agent-worker"
    recent_action: "Met every row against a real convert run and closed the packet"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: integration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/005-integration
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
| AC-001 | REQ-001 | Given a temp repo with `HERMES_SKILLS_OUTPUT_DIR` set, When convert finishes, Then `sync-skills-hermes.cjs --check` passes | Observed in a temp repo: the convert run prints `I5 runtime mirrors: Hermes synced and checked` (`.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:957`) and the separate `sync-skills-hermes.cjs --check` spawn exits 0 with `PASS: in sync` (`:995-1000`). Convert calls the rows only after both format validators pass (`.skilled/commands/doctor/scripts/sk-skill-convert.cjs:1413-1434`). Library evidence: the override case records the folder the copies land in (`.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs:750`) | Met | - |
| AC-002 | REQ-002 | Given the temp repo with `SKILL_GRAPH_FRESHNESS_ROOT` set, When convert finishes, Then `skill-graph-freshness.cjs --strict` exits 0 | Observed in a temp repo: with `SKILL_GRAPH_FRESHNESS_ROOT` set to the converted repo the real panel exits 0 and prints `STALE COMPILED: none` (`.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:991-992`), over the graph the I2 row compiled (`:956`). Library evidence: `.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs:524` | Met | - |
| AC-003 | REQ-003 | Given a converted skill, When `readlink .skilled/changelog/<name>` runs, Then it prints `../skills/<name>/changelog` and that folder holds `v<version>.md` | Observed: `readlink .skilled/changelog/brindle-lantern` prints `../skills/brindle-lantern/changelog` (`.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:1004`), the link resolves to a directory (`:1005`) and holds `v1.0.0.0.md` (`:1006`). Library evidence: `.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs:835` | Met | - |
| AC-004 | REQ-004 | Given fleet reach output captured before and after the change, When `cmp` compares them, Then it prints nothing | Observed: the fleet path matches the committed golden byte for byte at the same exit 1 (`.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs:990`). The golden was recorded from the script before the flag existed, so the comparison does not follow the file it checks; the capture-time `cmp` over the 65536-byte live-shaped report also exited 0 with no output, hashing `670de1bb…` on both sides | Met | - |
| AC-005 | REQ-005 | Given no `.hermes/`, When convert runs I5, Then it reports n/a and `.hermes/` still does not exist | Observed: with no `.hermes/` and no override the row reports n/a (`.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs:744`), spawns nothing (`:746`) and the directory is still missing (`:745`); the convert plan prints the same n/a line before any write | Met | - |
| AC-006 | REQ-006 | Given an adopter skill, When I4 runs, Then `skill-advisor-regression-cases.jsonl` is byte-identical and the output holds the rows and the `--dataset` command | Observed: the corpus bytes are equal before and after (`.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs:650`), the skill's own `benchmark/advisor-cases.jsonl` holds the three proposed rows and the output carries the `--dataset` command (`:651-658`). A convert run writes an adopter's rows under its own `benchmark/` for the same reason: the framework corpus is not under the temporary repo root | Met | - |
| AC-008 | REQ-008 | Given a converted adopter fixture, When I4 runs, Then `benchmark/advisor-cases.jsonl` holds the rows, `package_skill.py --check --strict` prints `Result: PASS` and `skill_advisor_regression.py --dataset` on the file exits 0 | Observed: `package_skill.py --check --strict` prints `Result: PASS` with the file present (`.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs:703-704`) and the printed `--dataset` command runs the file to `"overall_pass": true` and exit 0 (`:731-732`). The converted fixture also passes strict in the end-to-end convert case (`.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:1014`) | Met | - |
| AC-007 | REQ-007 | Given any convert run, When I1 runs, Then no `advisor_rebuild` call is made and `/doctor:skill-advisor rebuild` is printed as the fallback | Observed: the stub advisor logs exactly one `skill_graph_scan --trusted` call, no `advisor_rebuild` substring appears in any argv (`.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs:502-505`), and the fallback is printed (`:506`); the convert plan and result print the row's lines (`.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:940`) | Met | - |

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

Every row is met. Convert plans the six rows beside the conversion, applies them after both format
validators pass, prints each row's result and records each write in the undo list. The rows themselves stay
in `lib/sk-skill-integrate.cjs`, so a surface can be tested without a conversion and a conversion can report
a failing surface without losing the staged tree. Each row cites the end-to-end case in the conversion
suite and the library case that isolates it.
<!-- /ANCHOR:closure -->

---
