---
title: "Implementation Plan: Comment Hygiene — Durable WHY"
description: "Recover the durable behavioural reason behind each ephemeral-artifact pointer in a code comment and write that reason in its place, deleting the comment where the reason is not recoverable. Comment-only diffs enforced by a scripted assertion, with a per-file parse check and a baseline/delta on the repaired checker's violation count."
trigger_phrases:
  - "comment hygiene plan"
  - "durable why replacement"
  - "comment only diff assertion"
importance_tier: "high"
contextType: "planning"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/002-comment-hygiene-durable-why"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan for comment-hygiene remediation"
    next_safe_action: "Wait on child 001, then run T001"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Comment Hygiene — Durable WHY

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP handler), Node CJS/ESM (benchmark rigs, hooks, plugin tests), Python (documentation validator), JavaScript (pattern asset) |
| **Framework** | None. The edits are to comments only, across six unrelated packages |
| **Storage** | None |
| **Testing** | The repaired comment checker as the class gate; per-file parse checks; owning-package suites for the two files that are themselves tests |

### Overview

This is not a find-and-replace. Each pointer is a placeholder where a behavioural reason was never written down, so the work per site is: read enough of the surrounding code to state why the code is the way it is, write that, and delete the pointer. Where the surrounding code does not imply a reason, the honest outcome is deletion with a recorded rationale — a paraphrased guess is worse than no comment. The class is closed when the repaired checker returns clean on the whole tree, not when the nine named files are edited.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Child 001 landed: the repaired checker runs and the generic-label semantic boundary is recorded
- [ ] **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** resolved, so the deep-loop findings' ownership is settled

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Comment-only assertion green on every changed file
- [ ] Checker violation count: N closed, zero introduced
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Per-site recovery under a class gate. There is no shared abstraction to build; the structure is one rule (replace the pointer with the durable WHY) applied independently at each site, with one machine gate proving the class is closed.

### Key Components

- **The repaired checker** (`check-comment-hygiene.sh`, delivered by child 001): the class gate. Its clean run on the whole tree is what "done" means.
- **The comment-only assertion**: a scripted check that every changed hunk lies inside a comment for the file's language. This is what makes "behaviour-preserving" a verified claim rather than an assumption.
- **The six touched packages**: deep-loop improvement scripts, documentation tooling, the prompt-models benchmark rigs, the runtime goal hook, the plugin test suite, and the spec-kit MCP server.

### Data Flow

The checker reads a file, applies its rule set, and emits violations. This child changes only the input side: it removes the constructs the rules match. No control flow, no data, and no emitted output changes anywhere.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-improvement/scripts/agent-improvement/**` | Six comments carry requirement identifiers | update | Checker clean; package suite green |
| `deep-improvement/scripts/skill-benchmark/**` | Comment depends on an ephemeral phase pointer | update | Checker clean |
| `sk-doc/scripts/quick_validate.py` | Validator documentation comment carries a packet-local pointer | update | Checker clean; `python3 -m py_compile` |
| `sk-doc/sk-create-benchmark/scripts/*.cjs` | Archive and snapshot comments name renumberable directories | update | Checker clean; `node --check` |
| `sk-prompt/sk-prompt-models/benchmarks/**/loop.cjs` | Comment points into a packet spec | update | Checker clean; `node --check` |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Lines 5-6 embed a phase path | update | Checker clean; `node --check`; hook smoke on the goal-injection path |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Test comments name archived packets | update | Checker clean; the plugin test suite still passes and still asserts the same behaviour |
| `sk-code-webflow/assets/patterns/performance-patterns.js` | Pattern asset carries a spec-local provenance pointer | update | Checker clean; the asset parses and its examples stay consistent |
| `system-spec-kit/mcp-server/handlers/memory-save.ts` | Four `Feature catalog:` comments at lines 212-215 | update | Checker clean **only after child 001 lands the feature-catalog rule**; package typecheck and suite green |
| `check-comment-hygiene.sh` | The rule engine | not a consumer of this change — owned by child 001 | Read only |
| Security register's shared deep-loop files | Concurrently rewritten by another program | not a consumer — sequencing constraint only | Work-list diff at T001 |

Required inventories:
- Same-class producers: run the repaired checker over the whole tree and treat its output as the population. `rg -n 'Feature catalog:|REQ-[A-Z]+-[0-9]|Phase [0-9]|spec [0-9]{3}' --glob '!node_modules' --glob '!*/dist/*'` is the discovery aid, not the authority.
- Consumers of changed symbols: none — no symbol changes. Record this as a proven instance-only claim rather than an untested assumption.
- Matrix axes: {language: ts, mjs, cjs, js, py} × {context: line comment, block comment, docstring}. Every axis needs at least one verified site so the comment-only assertion is exercised in each form.
- Algorithm invariant: a changed hunk must lie entirely within a comment token for its language. Adversarial cases: a pointer inside a template literal; inside a heredoc; inside a Python docstring that is a runtime-visible `__doc__`; inside a string in a test fixture's expected output.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm every cited pointer at its cited line against HEAD
- [ ] Run the repaired checker tree-wide and reconcile its output against the nine named findings
- [ ] Diff this work list against the security register's active file list and record the sequencing

### Phase 2: Core Implementation
- [ ] Recover and write the durable reason at each site, package by package
- [ ] Delete rather than paraphrase where no reason is recoverable, recording each deletion
- [ ] Execute the four-line `Feature catalog:` edit in the MCP save handler

### Phase 3: Verification
- [ ] Manual testing complete — the two test files still assert what they asserted
- [ ] Edge cases handled — no template-literal or docstring content was touched
- [ ] Documentation updated — spec, plan, tasks and checklist reconciled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Owning-package suites for every touched package | Vitest, `node --test`, pytest |
| Integration | The goal-injection hook still injects after its header comment changes | Hook smoke on the goal path |
| Contract | Every changed hunk lies inside a comment | Scripted comment-only assertion over `git diff` |
| Contract | The class is closed tree-wide, not just at the named sites | Repaired checker, full-tree run |
| Manual | Each replacement states a durable reason and names no artifact | Review of the full diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 — repaired checker | Internal | Red | Without it there is no gate; the class cannot be proven closed |
| Child 001 — generic-label boundary | Internal | Red | Without it, the `Phase N` / `spec N` sites cannot be judged consistently |
| Child 001 — feature-catalog rule | Internal | Red | The four-line MCP edit cannot be verified as closing the class |
| Security register's deep-loop child | External to this program | Yellow | Shared-file edits must land after it; the rest of the work list is unaffected |
| Operator decision Q2 | Internal | Yellow | Two findings' ownership; work list shrinks by two if ruled the other way |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The comment-only assertion fails on a landed file; a touched test file changes behaviour; the checker's violation count rises.
- **Procedure**: Every edit is an independent single-file comment change. `git revert` the offending file's commit, or `git checkout HEAD~1 -- <file>` for a single file. No build artifact, no generated output and no data is involved, so a revert is complete and immediate.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Child 001 (checker + boundary) ──┐
                                 ├──► Phase 2 (Rewrite) ──► Phase 3 (Verify)
Phase 1 (Confirm + reconcile) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm + reconcile | Child 001 | Rewrite |
| Rewrite | Confirm, security-register sequencing | Verify |
| Verify | Rewrite | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + reconcile | Low | 1-2 hours |
| Rewrite | Med | 3-5 hours |
| Verify | Low | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — N/A, no data changes
- [ ] Feature flag configured — N/A, comment-only
- [ ] Monitoring alerts set — N/A; the checker's violation count is the signal

### Rollback Procedure
1. Identify the offending file from the failing assertion or suite.
2. `git checkout <baseline-sha> -- <file>` to restore that file alone.
3. Re-run the file's parse check and its owning suite to confirm restoration.
4. Re-run the checker to confirm the violation count returned to its prior value.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
