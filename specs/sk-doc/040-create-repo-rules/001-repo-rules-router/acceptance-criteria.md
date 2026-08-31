---
title: "Acceptance Criteria: Repo Rules Router and Thinking-Discipline Rule Snippets"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "repo rules closure"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/001-repo-rules-router"
    last_updated_at: "2026-08-31T03:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and verified the router plus six rule leaves"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "REPO RULES.md"
      - "repo-rules/overengineering.md"
      - "repo-rules/scope-discipline.md"
      - "repo-rules/evidence-and-proof.md"
      - "repo-rules/blast-radius.md"
      - "repo-rules/root-cause.md"
      - "repo-rules/uncertainty-and-honesty.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-31-agents-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Router location: root `REPO RULES.md`, because `AGENTS.md` §3 already names that exact path (settled by existing code, 2026-08-31)"
      - "Rule set: six leaves covering restraint, scope, evidence, blast radius, root cause, honesty (operator scoped to thinking/acting, skills excluded, 2026-08-31)"
      - "`AGENTS.md` edits: none — the §3 pointer already binds, so SCOPE LOCK holds (2026-08-31)"
      - "Post-review revision: adopted all 10 findings from an independent Opus review after verifying each against AGENTS.md (2026-08-31)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Repo Rules Router and Thinking-Discipline Rule Snippets

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/001-repo-rules-router
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a runtime following `AGENTS.md` §3, When it resolves `REPO RULES.md` at the repository root, Then the file exists and contains routing, precedence and an index but no rule text of its own | `REPO RULES.md:55` scope statement, `REPO RULES.md:20` precedence tier 1, `REPO RULES.md:52` bounding line — `ls "REPO RULES.md"` → present, 61 lines; §4 states the document holds no rules and names what it excludes, and §3 closes with the bounding line making `AGENTS.md` authoritative on conflict | Met | - |
| AC-002 | REQ-002 | Given the repository root, When `/repo-rules/` is listed, Then it holds one markdown file per rule, each readable without the others | `repo-rules/overengineering.md:1`, `repo-rules/scope-discipline.md:1`, `repo-rules/evidence-and-proof.md:1`, `repo-rules/blast-radius.md:1`, `repo-rules/root-cause.md:1`, `repo-rules/uncertainty-and-honesty.md:1` — 6 files, 642 lines total; each opens with a bounding line, its own `Fires when` and `The rule` | Met | - |
| AC-003 | REQ-003 | Given an agent about to add a module, option, abstraction or dependency, When it loads the over-engineering rule, Then it finds a ladder whose rungs may only be climbed by naming a concrete present-day failure below | `repo-rules/overengineering.md:22` ladder heading, `:29` rung 0, `:40` worked climbing sentence — `repo-rules/overengineering.md` §1 — 7-rung table plus a worked climbing sentence with a real symbol and caller | Met | - |
| AC-004 | REQ-004 | Given the router's trigger table, When every `repo-rules/*.md` link is resolved against the filesystem, Then all resolve | `REPO RULES.md:30` trigger table — Link loop over `REPO RULES.md` → `OK` × 6, `MISSING` × 0 | Met | - |
| AC-005 | REQ-005 | Given the six leaves, When they are swept for `skill`, `workflow`, `spec folder`, `mcp`, `advisor`, `dispatch`, Then nothing matches | `repo-rules/scope-discipline.md:69` and `:89` (the only sweep hits) — `grep -in` sweep → the only hits are two citations of `AGENTS.md` §1 PLAN-WORKFLOW LOCK by name in `scope-discipline.md`, which name a tier-1 hard blocker rather than import routing content. A semantic re-review found one further leak — spec-artifact vocabulary in `evidence-and-proof.md`'s trigger — now rewritten | Met | - |
| AC-006 | REQ-006 | Given any leaf, When its headings are counted, Then it carries exactly one `Fires when`, one `The rule`, and one closing self-check | `repo-rules/blast-radius.md:6`, `:14`, `:97` as the representative shape — Structural check across all six → `fires=1 rule=1 selfcheck=1` for each | Met | - |
| AC-007 | REQ-007 | Given a conflict between a rule file and an `AGENTS.md` hard blocker, When the router's precedence ladder is read, Then the hard blocker wins and the rule file cannot relax it | `REPO RULES.md:16` precedence heading, `:20` tier 1, `:25` no-relax sentence — `REPO RULES.md` §1 precedence table, 4 tiers, plus the sentence "None of them relaxes a HARD BLOCK" | Met | - |
| AC-008 | REQ-008 | Given two rules that compose, When one references the other, Then it points by filename rather than restating the rule | `repo-rules/scope-discipline.md:52` as one instance — 6 cross-reference lines across 5 distinct pairs: `scope-discipline.md`→`blast-radius.md` (×2); `overengineering.md`→`blast-radius.md`; `root-cause.md`→`evidence-and-proof.md`, `scope-discipline.md`; `blast-radius.md`→`evidence-and-proof.md`. Three further pointers were removed with the duplicated rows that carried them; discovery is the router's index | Met | - |
| AC-010 | REQ-010 | Given an agent at its first write of a session, When it runs the §2 pre-execution gates, Then loading `REPO RULES.md` is a HARD BLOCK gate, and neither document lets the loaded rules outrank `AGENTS.md` | `AGENTS.md:111` GATE 5 heading, `AGENTS.md:117` "This gate binds the LOAD, not the loaded content", `REPO RULES.md:37-39` "the obligation to read is tier 1, the content is not" | Met | - |
| AC-009 | REQ-009 | Given an agent that judges part of a frozen scope unnecessary, When it reads the over-engineering rule, Then it finds an explicit statement that restraint never licenses under-delivery | `repo-rules/overengineering.md:93` — `repo-rules/overengineering.md` §5 "What this rule is NOT" — opens "Restraint constrains *how much you build*, never *how much you deliver*", then "Not a license to under-deliver": build the frozen scope, raise the amendment separately | Met | - |

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

AC-001 through AC-004 carried the packet: the file `AGENTS.md` already pointed at
now exists, routes by action rather than topic, and every link it advertises
resolves. AC-005 and AC-009 are the two that constrain what was *not* built —
no skill-routing content, and no reading of restraint that would let an agent
deliver less than the frozen scope. Consciously left out: any edit to `AGENTS.md`
(its §3 pointer already binds), prose-style communication rules (they govern how a
reply reads, not how the AI acts), per-stack conventions (none established for this
repository), and any enforcement tooling.
<!-- /ANCHOR:closure -->
