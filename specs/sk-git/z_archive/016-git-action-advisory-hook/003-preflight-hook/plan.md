---
title: "Implementation Plan: Preflight Hook"
description: "How the advisory hook was built as a sibling of the proven dispatch lint and registered without new infrastructure."
trigger_phrases:
  - "git preflight hook"
  - "sk-git advisory hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/003-preflight-hook"
    last_updated_at: "2026-07-27T23:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Built and registered the preflight advisory hook"
    next_safe_action: "Phase 004 measures the fire rate"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Preflight Hook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Build a sibling of the proven dispatch preflight lint, register it in the array that already runs on every Bash command, and give it the fatigue controls prior art showed decide whether such a thing gets read at all.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Result |
|------|-------------|--------|
| Non-blocking | Never emits a permission decision | Verified |
| Fail-open | Every error path approves | Verified |
| Quiet | Silent on ordinary and non-git commands | Verified |
| Suppressible | Three tiers | Verified |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The hook reads the same frontmatter the dispatch preflight reads, through the same parser, and evaluates it through the same function. What differs is the registry and the context it passes.

Order of operations is chosen for cost. A regex rejects non-git commands before anything else happens, then the suppression tiers are consulted, then the rules are read, and only then is a repository context created. An unrelated Bash command therefore spawns no git process at all.

Prior art was unambiguous that a single global switch is insufficient: every comparable system ships a per-rule opt-out, a grouped opt-out and a global kill, and the ones that shipped only the last taught their users to flip it once and forget. Grouping works by id prefix, so `commit` silences the commit family without naming each rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | Work | Gate |
|------|------|------|
| 1 | Read the proven sibling's output contract | Contract understood |
| 2 | Hook with fast-exit and lazy context | Silent on non-git |
| 3 | Suppression tiers | All three verified |
| 4 | Register in the existing Bash group | Third entry alongside two existing |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Exercised end to end by feeding real PreToolUse payloads on stdin against a purpose-built repository: the failing shape, an ordinary commit, a non-git command, the global kill and a per-rule opt-out. Five cases, each asserting output or its absence.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Phase 002 rules and evaluator extension | Complete |
| Existing PreToolUse Bash hook group | Existing, appended to |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the entry from the PreToolUse Bash array in `.claude/settings.json`. The hook script becomes unreferenced. Setting `SKGIT_ADVISORY=0` achieves the same silence without editing anything, which is the faster path if the advisory turns out to be noisy in practice.
<!-- /ANCHOR:rollback -->
