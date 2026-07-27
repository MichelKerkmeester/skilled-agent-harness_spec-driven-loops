---
title: "Implementation Plan: Rule Encoding"
description: "How ten state-gated rules were encoded and the shared evaluator extended without disturbing dispatch linting."
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rule Encoding

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Encode the research-confirmed rules as frontmatter, implement each as a state discriminator, and teach the existing evaluator to pass repository state through without changing what it does for command-only rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Result |
|------|-------------|--------|
| Round-trip | Every rule resolves to a check and every check to a rule | 10/10, 0 orphans |
| Non-blocking | No rule may block | All `warn` |
| Regression | Dispatch linting unchanged | Asserted in tests |
| Reproduction | Each test observes real git behaviour first | 18/18 pass |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three pieces, each with one owner.

`git-context.mjs` collects pre-execution state lazily, caching per invocation. Nothing spawns until a check asks, so the cost stays off unrelated commands.

`git-rule-checks.mjs` holds the checks and a deliberately narrow git command parser. Only a directly visible `git` invocation is classified; aliases and wrappers are left alone rather than guessed at.

The shared evaluator gained an options parameter carrying a checks registry and a context object. Checks receive context as a second argument, which the command-only checks ignore because JavaScript discards extra arguments. That property is what makes the change safe.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | Work | Gate |
|------|------|------|
| 1 | Resolve extend-versus-rebuild | Decision recorded |
| 2 | State collector | Lazy, fails soft |
| 3 | Checks with discriminators | No verb-only rule |
| 4 | Frontmatter | Parses under the existing parser |
| 5 | Tests | Reproduce before asserting |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every test builds a real throwaway repository and performs the failing operation before asserting the check. Testing against a mock of git would encode the same misunderstanding the checks exist to catch — and that is not hypothetical here, because writing the reproduction is what exposed a wrong premise in the founding rule.

Test repositories disable hooks explicitly. A global `core.hooksPath` otherwise applies the host's commit gates to every repository on the machine, failing the suite for reasons unrelated to its subject.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Phase 001 research | Complete |
| `dispatch-rule-checks.mjs` parser and evaluator | Existing, extended additively |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:critical-path -->
## 8. CRITICAL PATH

The evaluator question gated everything. Until it was answered, no rule could be written that anyone could run, and the parent spec allowed inverting this phase with the next if extension proved unviable.

`resolve extend-vs-rebuild → state collector → checks → frontmatter → tests`

Nothing after step one could start early, because the shape of a check depends on whether it can receive state at all. Everything after step two could have been parallel, but was not worth splitting at this size.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:dependency-graph -->
## 9. DEPENDENCY GRAPH

```
research (phase 001)
    │
    ├──> rule set + gating discipline
    │            │
    │            v
    │    git-rule-checks.mjs <──── git-context.mjs
    │            │                       │
    │            │                       └── git (subprocess, read-only)
    │            v
    │    SKILL.md hard_rules
    │            │
    v            v
dispatch-rule-checks.mjs (shared parser + evaluator, extended additively)
             │
             v
    git-rule-checks.test.mjs
```

The shared evaluator is the only node with a second consumer. That is the edge worth watching: its options parameter is optional and its default path unchanged, but future edits now carry two callers' expectations.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:milestones -->
## 10. MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Evaluator question resolved | Decision recorded; no phase inversion needed |
| State collector works and fails soft | Git failures return null rather than throwing |
| Ten checks implemented | Round-trip finds no orphan in either direction |
| Frontmatter parses under the existing parser | 10 rules read, all `warn` |
| Suite green with reproductions | 18/18, each observing real git behaviour first |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:rollback -->
## 11. ROLLBACK PLAN

Delete the `hard_rules:` block from the frontmatter. The checks and context modules become unreferenced and inert, and the evaluator's extra parameter is optional, so omitting it restores the prior signature exactly. No git behaviour changes in either direction.
<!-- /ANCHOR:rollback -->
