---
title: "Feature Specification: Rule Encoding"
description: "Ten state-gated git rules encoded as hard_rules frontmatter, with an additively extended evaluator that can read repository state."
trigger_phrases:
  - "git hard rules encoding"
  - "sk-git advisory rules"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/002-rule-encoding"
    last_updated_at: "2026-07-27T23:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Encoded ten state-gated rules and extended the shared evaluator"
    next_safe_action: "Phase 003 wires the hook"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Extend the shared evaluator additively rather than build a git-specific sibling."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rule Encoding

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

sk-git's rules existed as prose and reached nobody, because prose is surfaced by prompt routing while the damage happens at command time. The evaluator that already runs on every Bash command could not help: it read command text only, and every git rule worth having depends on repository state.

This phase encoded ten rules as frontmatter, implemented each as a state discriminator rather than a verb match, and extended the shared evaluator with an optional context parameter that existing checks structurally ignore. Writing reproductions against real repositories caught three defects, one of which was a wrong premise in the rule the packet was founded on.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `sk-git/0113-016-advisory-hook-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-advisory-research |
| **Successor** | 003-preflight-hook |
| **Handoff Criteria** | Rules parse under the existing parser and every check has an implementation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Git action advisory hook specification.

**Scope Boundary**: The rules and the machinery that evaluates them. Delivery to the operator is phase 003.

**Dependencies**: Phase 001 research, which supplied the rule set and the gating discipline.

**Deliverables**: `hard_rules:` frontmatter, a git checks module, a lazy state collector, an additive evaluator extension, and a test suite that reproduces each failure.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-git declared no `hard_rules:`, so the evaluator that already runs on every Bash command had nothing to read for git. Its rules existed only as prose reachable by prompt routing, never by the command itself.

The obstacle was not the frontmatter but the evaluator: `evaluate(command, rules)` accepted command text and nothing else. Command text is enough for dispatch rules and useless for repository rules, because whether `git reset` deserves a word depends entirely on whether the commit moves.

### Purpose

Give the existing evaluator a git rule set it can actually evaluate, without duplicating it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten rules in `hard_rules:` frontmatter, in the schema `cli-devin` already uses.
- A git checks module owned by sk-git.
- A lazily-evaluated repository state collector.
- An additive third parameter on the shared `evaluate`.

### Out of Scope
- Delivery to the operator — phase 003.
- Blocking behaviour. Every rule ships at `warn`.
- Rules the research classified judgement-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-git/SKILL.md` | Modify | `hard_rules:` frontmatter, version 1.4.0.0 |
| `sk-git/scripts/lib/git-rule-checks.mjs` | Create | Ten checks plus a git command parser |
| `sk-git/scripts/lib/git-context.mjs` | Create | Lazy pre-execution state collector |
| `sk-git/scripts/lib/git-rule-checks.test.mjs` | Create | Reproduction tests against real repositories |
| `cli-opencode/scripts/lib/dispatch-rule-checks.mjs` | Modify | Additive options parameter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every declared rule resolves to an implementation | Parser round-trip finds no orphan in either direction |
| REQ-002 | Every rule advises, never blocks | All severities are `warn` |
| REQ-003 | Existing command-only rules are unaffected | cli-opencode and cli-devin rules still parse and evaluate |
| REQ-004 | Each rule is a state discriminator, not a verb match | Every check reads state or a specific flag shape, never a bare subcommand |
| REQ-005 | Checks fail open | A check that throws is swallowed and approves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Each rule has a reproduction test | The test creates a real repository and observes the failure before asserting the check |
| REQ-007 | State collection is lazy | No git process spawns until a check asks for state |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10 rules parse, 0 orphans either direction, all `warn`.
- **SC-002**: The test suite reproduces each failure against a real repository and passes.
- **SC-003**: The shared evaluator's existing behaviour is unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Extending a shared evaluator breaks dispatch linting | High | The parameter is additive; existing checks ignore it. Regression asserted in tests |
| Risk | A rule encodes a premise that is wrong about git | High | Each test observes real git behaviour before asserting. This caught one wrong premise |
| Dependency | Phase 001 research | Supplied the rule set | Complete |
<!-- /ANCHOR:risks -->

---



---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Attribute | Requirement | How it is met |
|-----------|-------------|---------------|
| Latency | No cost on commands that are not git | State collection is lazy; nothing spawns until a check asks |
| Safety | A defect here must never fail a command | Every check fails open; a throwing check approves |
| Isolation | Git logic must not leak into the dispatch skill | Only an optional parameter changed there; checks live under sk-git |
| Determinism | The same command and state give the same answer | Checks are pure over command text plus a snapshot of state |
| Legibility | A rule must explain itself to someone who did not write it | Every message names the consequence, not just the rule |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

| Case | Behaviour |
|------|-----------|
| Command is not git at all | No rule fires; the parser returns null |
| Command is an alias or wrapper script | Not classified. Guessing at expansion would advise on commands nobody typed |
| Flag takes a value that looks like a path | The value is consumed, so a commit message never lands in the pathspec |
| Pathspec matches a tracked file with no pending change | Silent. Distinct from matching nothing, which is worth a word |
| Pathspec names an untracked file directly | Silent. Git refuses that commit loudly on its own |
| Repository is in an odd or mid-operation state | Git calls fail soft and the check approves |
| `core.ignorecase` is off | The case-folding rule cannot apply and stays silent |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Basis |
|-----------|-------|-------|
| Lines changed | 688 | Three new modules plus frontmatter and one shared-function signature |
| Surfaces touched | 3 | sk-git, the shared dispatch evaluator, and git itself as a subprocess |
| Shared-infrastructure risk | High | The evaluator runs on every Bash command for two other skills |
| Domain subtlety | High | Every rule encodes a claim about git behaviour that can be wrong, and one was |
| Reversibility | High | Deleting the frontmatter block renders everything inert |

**Level 3, and the reason is subtlety rather than size.** The line count alone would justify it, but the real cost is that each rule asserts something about how git behaves, and being confidently wrong is both easy and invisible until someone reproduces it. Three defects surfaced only because the tests exercise real repositories, and one of them was the premise the packet was founded on.

The shared-evaluator change is the other reason. It is one optional parameter, which understates it: the function is on a live hook path for two other skills, so the blast radius is wider than the diff.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| A rule encodes a wrong belief about git | Med | High | Reproduce the failure before asserting the check. This caught one |
| Extending the shared evaluator breaks dispatch linting | Low | High | Compatibility is structural, not promised; regression asserted |
| A rule is noisy in practice | Med | Med | Every rule is state-gated; fire rate measured in the final phase |
| Tests never run and rot | High | Med | Confirmed and recorded as a limitation; the gap is repository-wide |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **US-001**: As an operator committing a directory, I am told when untracked files inside it will be silently excluded, before the commit reports success without them.
- **US-002**: As an operator staging a path, I am told when the pathspec matches nothing or only ignored files, rather than discovering it at commit time.
- **US-003**: As an operator restoring a file, I am told when a staged copy will survive the revert, so I do not believe a change is gone while it waits in the index.
- **US-004**: As a maintainer, I can silence any rule that proves noisy without editing code or losing the rest.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The evaluator question that gated this phase was resolved in favour of extension.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- Research authority: `../001-advisory-research/research.md`
- Decisions: `decision-record.md`
- Successor: `../003-preflight-hook/`
<!-- /ANCHOR:related-docs -->
