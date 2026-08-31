---
title: "Feature Specification: Repo Rules Router and Thinking-Discipline Rule Snippets"
description: "AGENTS.md §3 binds every runtime to a REPO RULES.md that does not exist in this repository, and the operating discipline it would hold — restraint, scope, evidence, blast radius, root cause, honesty — is compressed into single table rows inside a 483-line always-loaded document. This packet creates the missing router and six expanded rule snippets under /repo-rules."
trigger_phrases:
  - "repo rules"
  - "repo-rules router"
  - "overengineering rule"
  - "restraint ladder"
  - "blast radius rule"
  - "root cause rule"
  - "evidence and proof"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Repo Rules Router and Thinking-Discipline Rule Snippets

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `claude/repo-rules-structure-24zjsu` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`AGENTS.md` §3 tells every runtime to "apply project-specific conventions from `REPO RULES.md` … when the repository has one", and that file does not exist here — the only other references to it are four `sk-code`-scoped docs pointing at a *different* repository's copy. So the hook is live and the target is empty. At the same time, the operating discipline that hook was meant to carry is compressed to its smallest survivable form inside `AGENTS.md`: over-engineering restraint is a seven-row signal table (§3), proof standards are a seven-row table (§4), blast-radius management is five bullets (§3), debugging is four bullets (§3), and confidence handling is a four-row table (§2). Each row is a correct rule with no room to say *how* to apply it, and `AGENTS.md` cannot expand them without growing an always-loaded 483-line document.

### Purpose
Give the repository a real `REPO RULES.md` that behaves as a router — trigger table in, one rule file out — backed by six expanded, on-demand rule snippets under `/repo-rules/` covering how the AI thinks and acts, so the compressed rows in `AGENTS.md` have somewhere to expand without inflating what loads every turn.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root `REPO RULES.md` as a trigger-table router: loading protocol, precedence ladder, trigger table, index, and an explicit statement of what it does not cover.
- `/repo-rules/overengineering.md` — the restraint ladder, the pre-write pass, the expanded signal table, and per-domain restraints (options, abstraction, error handling, defensive checks, tests, performance, dependencies).
- `/repo-rules/scope-discipline.md` — the three drifts, default in-scope set, always-ask set, adjacent-defect protocol, plan-deviation protocol, amendment over absorption.
- `/repo-rules/evidence-and-proof.md` — observed/derived/inferred tiers, command-evidence rules, the four ways a green run lies, negative control, baselines, finding-as-hypothesis, proof plan, final-state proof.
- `/repo-rules/blast-radius.md` — stakes read, reversibility ladder, the rollback sentence, old-contract consumers, persistence boundaries, install-as-mutation.
- `/repo-rules/root-cause.md` — the diagnostic loop, symptom-fix smells, the two-attempt rule, seam naming, never-weaken-a-check, flake evidence, ownership, escalation format.
- `/repo-rules/uncertainty-and-honesty.md` — confidence bands, UNKNOWN, never-invent list, truth over agreement, contradiction halt, close-out, self-correction.

### Out of Scope
- **Editing `AGENTS.md`** — its §3 bullet already binds this document into the loading path, so no edit is needed and SCOPE LOCK keeps the always-loaded doc untouched.
- **Skill routing, workflow selection, spec-folder mechanics, agent dispatch, MCP routing** - the operator excluded skill-related content; these are owned by `AGENTS.md` §2/§5/§6/§9 and must have exactly one home.
- **Prose-style communication rules** (`AGENTS.md` §8 Writing) - they govern how a reply reads, not how the AI thinks or acts. Honest close-out, which *is* an action, is carried in `uncertainty-and-honesty.md` §5.
- **Per-stack conventions** (lint commands, build gates, framework idioms) - none are established for this repository yet, and inventing them would violate the very rule in `overengineering.md`.
- **Enforcement tooling** - no validator, hook, or CI check for rule-file conformance.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `REPO RULES.md` | Create | Router: loading protocol, precedence, trigger table, index, scope statement |
| `repo-rules/overengineering.md` | Create | Restraint ladder and pre-write pass |
| `repo-rules/scope-discipline.md` | Create | Frozen scope, adjacent defects, plan deviation, amendments |
| `repo-rules/evidence-and-proof.md` | Create | Claim tiers, command evidence, baselines, final-state proof |
| `repo-rules/blast-radius.md` | Create | Reversibility, rollback sentence, persistence boundaries |
| `repo-rules/root-cause.md` | Create | Diagnostic loop, two-attempt rule, seam naming |
| `repo-rules/uncertainty-and-honesty.md` | Create | Confidence bands, UNKNOWN, contradiction halt, close-out |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `REPO RULES.md` exists at the repository root, at the exact path `AGENTS.md` §3 names, and contains no rules of its own — only routing, precedence, and an index. |
| REQ-002 | `/repo-rules/` exists at the repository root and contains one markdown file per rule, each independently readable without the others. |
| REQ-003 | A dedicated rule document prevents over-engineering, and states a ladder whose rungs may only be climbed by naming a concrete present-day failure at the rung below. |
| REQ-004 | Every rule file is reachable from the router's trigger table by a link that resolves to a file that exists. |
| REQ-005 | No rule file contains skill routing, workflow selection, spec-folder mechanics, agent dispatch, or MCP routing content. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Each rule file follows one shape: `Fires when` triggers, a single binding rule sentence, expanded body, and a closing self-check. |
| REQ-007 | The router states a precedence ladder making clear that no rule file relaxes an `AGENTS.md` hard blocker. |
| REQ-008 | Rules that compose across files cross-reference each other by filename rather than restating the other rule. |
| REQ-009 | The over-engineering rule explicitly states what it is *not*, so restraint cannot be read as licence to under-deliver frozen scope. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A runtime following `AGENTS.md` §3 finds a real file at `REPO RULES.md` and can select the governing rule from the trigger table without reading any rule file it does not need.
- **SC-002**: The six rule files together carry expanded treatment of every compressed operating-discipline row in `AGENTS.md` §2, §3, §4, and §7 that concerns thinking and acting, and none of the skill-routing rows.
- **SC-003**: Adding a seventh rule requires exactly two edits — a new file plus two router rows — with no change to any existing rule file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplication drift: a rule restates an `AGENTS.md` rule, then the two diverge | Med — two contradictory sources of truth | Rule files expand *how* to apply; the router's precedence ladder makes `AGENTS.md` authoritative on conflict |
| Risk | Nothing loads the rules, because the trigger is a document instruction rather than a hook | Med — rules exist but never fire | Triggers are written on the *action* about to be taken, which is what an agent can actually match before acting |
| Risk | The rule set itself over-engineers — more rules than the repo earns | Low | Six files, each replacing an existing compressed `AGENTS.md` row; no rule invented for a problem this repo has not had |
| Dependency | `AGENTS.md` §3 pointer to `REPO RULES.md` | Rules are unreachable if that bullet is removed | Pointer verified present at `AGENTS.md:153`; not modified by this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Context Cost
- **NFR-C01**: The always-loaded surface grows by zero lines — `AGENTS.md` is unmodified, and `REPO RULES.md` is read only when the §3 bullet fires.
- **NFR-C02**: Each rule file stays under ~160 lines, so a triggered load costs one file, not a bundle.

### Legibility
- **NFR-L01**: Every rule file is readable standalone; a reader who opens one mid-task needs no other file to act on it.
- **NFR-L02**: Every binding statement is one sentence, set apart under `## The rule`.

### Maintainability
- **NFR-M01**: The router holds no rule text, so a rule change touches exactly one file.
- **NFR-M02**: Rule files carry no version, date, or generated metadata that would need syncing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Trigger Boundaries
- **No trigger matches**: the router says `AGENTS.md` alone governs, and explicitly forbids hunting for a rule to apply.
- **Two triggers match**: load both; they are written to compose, and the more specific trigger wins on apparent conflict.
- **A rule is already in context**: not re-read.

### Conflict Scenarios
- **Rule file versus `AGENTS.md` hard blocker**: the hard blocker wins; the precedence table in the router says so explicitly.
- **Rule file versus in-the-moment operator instruction**: the instruction wins; a rule file never overrides a live directive.
- **Restraint versus frozen scope**: `overengineering.md` §5 resolves it — build the frozen scope, raise the amendment separately.

### Degenerate Reads
- **A rule read after the action it governs**: the router states rules load *before* the action, and calls a late read what it is — a post-mortem.
- **Router link to a missing file**: prevented by REQ-004; verified by resolving every link against the filesystem.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 7 new files, ~900 lines of prose, no code and no runtime surface |
| Risk | 12/25 | No executable change; risk is doctrine drift, not breakage |
| Research | 10/20 | Required a full read of `AGENTS.md` to find the compressed rows worth expanding |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should `AGENTS.md` §3's pointer be strengthened from "when the repository has one" to a named load, now that the file exists? **DEFERRED: `AGENTS.md` is out of scope for this packet; raised for the operator rather than absorbed.**
- Should prose-style communication (`AGENTS.md` §8 Writing) get a seventh rule file? **DEFERRED: the operator scoped this to thinking and acting; §8 governs how a reply reads.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Prior restraint work**: See `../006-restraint-and-routing-gates/spec.md`
- **Prior bloat baseline**: See `../004-agents-md-bloat-audit/`
<!-- /ANCHOR:related-docs -->
