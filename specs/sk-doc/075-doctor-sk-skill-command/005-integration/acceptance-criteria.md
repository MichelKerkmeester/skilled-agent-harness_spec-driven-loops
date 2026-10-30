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
    last_updated_at: "2026-10-30T09:15:00Z"
    last_updated_by: "code-agent-worker"
    recent_action: "Recorded the library evidence against every row; all rows wait on the convert wiring"
    next_safe_action: "Meet the rows once the conductor calls applyIntegration from convert"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 80
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
**Status:** In Progress
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a temp repo with `HERMES_SKILLS_OUTPUT_DIR` set, When convert finishes, Then `sync-skills-hermes.cjs --check` passes | Library evidence: the I5 case runs the sync and then `--check` against the override and reads the pass back; `.hermes/` stays absent. Waiting on the conductor: convert does not call the rows yet | Unmet | - |
| AC-002 | REQ-002 | Given the temp repo with `SKILL_GRAPH_FRESHNESS_ROOT` set, When convert finishes, Then `skill-graph-freshness.cjs --strict` exits 0 | Observed: the real panel exits 0 over the graph the I2 row compiled and prints `STALE COMPILED: none`. Waiting on the conductor: convert does not call the rows yet | Unmet | - |
| AC-003 | REQ-003 | Given a converted skill, When `readlink .skilled/changelog/<name>` runs, Then it prints `../skills/<name>/changelog` and that folder holds `v<version>.md` | Observed: the I6 case reads back exactly `../skills/<name>/changelog`, the link resolves to a directory, and `changelog/v1.0.0.0.md` is there. Waiting on the conductor: convert does not call the rows yet | Unmet | - |
| AC-004 | REQ-004 | Given fleet reach output captured before and after the change, When `cmp` compares them, Then it prints nothing | Observed: the case runs the fleet path over a fixture fleet and matches a committed golden report byte for byte, at the same exit 1 on the same stubbed verdict. The golden was recorded from the script before the flag existed, so the comparison does not follow the file it checks; the capture-time `cmp` over the 65536-byte live-shaped report also exited 0 with no output, hashing `670de1bb…` on both sides | Unmet | - |
| AC-005 | REQ-005 | Given no `.hermes/`, When convert runs I5, Then it reports n/a and `.hermes/` still does not exist | Observed: with no `.hermes/` and no override the row reports n/a, spawns nothing, and the directory is still missing afterwards. Waiting on the conductor: convert does not call the rows yet | Unmet | - |
| AC-006 | REQ-006 | Given an adopter skill, When I4 runs, Then `skill-advisor-regression-cases.jsonl` is byte-identical and the output holds the rows and the `--dataset` command | Observed: the corpus bytes are equal before and after, the skill's own `benchmark/advisor-cases.jsonl` holds the three proposed rows, and the output carries the `--dataset` command. Waiting on the conductor: convert does not call the rows yet | Unmet | - |
| AC-008 | REQ-008 | Given a converted adopter fixture, When I4 runs, Then `benchmark/advisor-cases.jsonl` holds the rows, `package_skill.py --check --strict` prints `Result: PASS` and `skill_advisor_regression.py --dataset` on the file exits 0 | Observed: the file holds the proposed rows, the strict package check prints `Result: PASS` with it present, and the printed `--dataset` command runs the file to `"overall_pass": true` and exit 0 on a fixture whose phrases really route. Waiting on the conductor: convert does not call the rows yet | Unmet | - |
| AC-007 | REQ-007 | Given any convert run, When I1 runs, Then no `advisor_rebuild` call is made and `/doctor:skill-advisor rebuild` is printed as the fallback | Observed: the stub advisor logs exactly one `skill_graph_scan --trusted` call, no `advisor_rebuild` substring appears in any argv, and the fallback is printed in both the plan and the result. Waiting on the conductor: convert does not call the rows yet | Unmet | - |

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

The integration rows are built and proven in their own tests, but every criterion above begins "When
convert finishes", and convert does not call the rows yet. The conductor adds the `applyIntegration` call,
after which each row can be re-read against a real convert run. `implementation-summary.md` records why the
rows live in their own library rather than inline in the convert script.
<!-- /ANCHOR:closure -->

---
