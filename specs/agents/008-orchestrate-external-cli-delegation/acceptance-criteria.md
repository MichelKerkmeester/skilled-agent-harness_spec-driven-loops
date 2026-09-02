---
title: "Acceptance Criteria: Orchestrator external CLI delegation, opt-in by explicit user request"
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
    packet_pointer: "agents/008-orchestrate-external-cli-delegation"
    last_updated_at: "2026-09-02T12:00:32Z"
    last_updated_by: "code-agent"
    recent_action: "Closed the codex sandbox_mode criterion"
    next_safe_action: "Operator confirms closure"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which sandbox_mode is intended for the Codex orchestrate runtime: the generator's read-only, or the workspace-write the committed TOML carried since ace6d0ee66? Answered 2026-09-02 - workspace-write; the generator table was corrected to match."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Orchestrator external CLI delegation, opt-in by explicit user request

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/008-orchestrate-external-cli-delegation
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the orchestrator definition, When §4 is read, Then Rule 7 states an external executor is dispatched only on an explicit user request and never auto-selected | `grep -n "Opt-in only" .opencode/agents/orchestrate.md` -> present in Rule 7 point 1; the §9 anti-pattern row names the same failure | Met | - |
| AC-002 | REQ-002 | Given Rule 7, When point 2 is read, Then it restates AGENTS.md GATE 4 verbatim plus the `command-spec-kit` tiebreaker | Source compared against `AGENTS.md:118` and `AGENTS.md:119`; both sentences reproduced verbatim | Met | - |
| AC-003 | REQ-003 | Given Rule 7, When point 3 is read, Then it requires reading `cli-external-orchestration/cli-X/SKILL.md` before composing any `cli-X` prompt | Requirement sourced from `cli-external-orchestration/SKILL.md:170`, which adds that the advisor recommendation does not waive it | Met | - |
| AC-003b | REQ-003 | Given Rule 7 point 3, When it is read, Then it also carries the hub persona-injection rule (attach the resolved agent persona per subtask, never a bare task) | Sourced from `cli-external-orchestration/SKILL.md:171`; `grep -ac "persona-injection"` = 1 on each of the six surfaces | Met | - |
| AC-004 | REQ-004 | Given Rule 7, When point 4 is read, Then it states the external run is a LEAF at depth 1 that cannot widen scope, dispatch further, or dispatch itself | Self-invocation guard sourced from `cli-external-orchestration/SKILL.md:177` | Met | - |
| AC-005 | REQ-005 | Given Rule 7, When point 5 is read, Then it carries the codex read-only default, the `danger-full-access` approval requirement, and the Cursor `auto` ban | Facts verified at `cli-codex/SKILL.md:260`, `cli-codex/SKILL.md:294`, and `cli-cursor/SKILL.md:216` before being written | Met | - |
| AC-006 | REQ-006 | Given Rule 7, When point 6 is read, Then it states an external run's `COMPLETE`, iteration count and exit status are claims rather than evidence | Sourced from `repo-rules/delegation-and-orchestration.md` §5; the browser-lane sentence carries the durable why without naming any packet | Met | - |
| AC-007 | REQ-007 | Given Rule 7, When point 7 is read, Then it requires an explicit model per dispatch and forbids near-sounding substitution | Consistent with `cli-cursor/SKILL.md:244`, which bans substituting the closest-sounding allowed model without telling the user | Met | - |
| AC-008 | REQ-008 | Given all six runtime surfaces, When each is grepped for `Rule 7`, Then each returns a non-zero count and the two hand-edited `.md` frontmatters are unchanged | `grep -ac "Rule 7"` = 3 on `.opencode`, `.claude`, `.cursor`, `.pi` orchestrate.md, `.codex/agents/orchestrate.toml`, `.devin/agents/orchestrate/AGENT.md`; `git diff` of both hand-edited `.md` files contains no frontmatter line. The generated `.codex` TOML header is unchanged too, once the generator table was corrected to `workspace-write` per `implementation-summary.md` Known Limitations 4 | Met | - |
| AC-009 | REQ-008 | Given the generated mirrors, When the mirror gates run, Then all four exit 0 | codex sync exit 0, codex `--check` exit 0, pi sync exit 0, pi `--check` exit 0, `check-agent-mirror-sync.cjs --all` exit 0 ("12 agent(s) checked - all mirrors in sync"), `agent-roster-mirror-check.cjs` exit 0 (`STATUS=OK`) | Met | - |
| AC-010 | REQ-008 | Given both hand-edited files, When the sk-doc validators run, Then all three exit 0 on each | `validate_document.py --type agent` exit 0, `extract_structure.py` exit 0, `check_authored_name_kebab.py` exit 0 (PASS) on both files; one pre-existing `non_sequential_numbering` warning about `## 0.` | Met | - |

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

**Closeable:** Yes - every criterion below is `Met`, and the operator decision that closure additionally
waited on was given on 2026-09-02 (`workspace-write`), recorded in `implementation-summary.md` Known
Limitations 4. Operator confirmation of the packet itself is the only step left.

AC-001 through AC-007 carried the semantics of the rule, each written only after its claim was checked
against the file that owns it rather than against the brief that requested it; AC-008 through AC-010
carried the propagation, where the real risk lived, since a one-surface edit looks identical to a
correct one until the mirrors are checked. Consciously left out: any change to the
`cli-external-orchestration` hub or its mode packets, and any restructuring of the agent beyond the four
scoped insertions.
<!-- /ANCHOR:closure -->
