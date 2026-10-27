---
title: "Implementation Plan: Clear the five doctor:ci drift flags and decide Node 20 CI coverage"
description: "Move event values into step env, add the two missing concurrency blocks, recount the reference claim and add Node 20 steps for the two suites that once failed only there."
trigger_phrases:
  - "ci drift flags plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Clear the five doctor:ci drift flags and decide Node 20 CI coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, bash, TypeScript test |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `ci-report.cjs`, `actionlint`, `node --test`, vitest |

### Overview
Each flagged run script gets its event values from a step `env:` block and reads them as quoted variables. The two workflows without concurrency get a block, the reference claim is recounted, and two Node 20 steps run the two sensitive suites. The ci report before and after, actionlint and the gate-inputs check prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `ci-report.cjs --json` sums to 0 flags over 32 workflows
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Step env indirection.

### Key Components
- **The three flagged steps**: carry `env:` entries for every event value they read.
- **The two concurrency blocks**: the repository's standard block, with `false` for the auto-merge workflow.

### Data Flow
The runner expands each `env:` entry once, the shell reads the value as a variable, and no event text ever becomes script text.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `changed-packet-validation.yml` run block | Producer of the gate's comparison | update | `ci-report.cjs --json`, actionlint |
| `ci-rule-set-comparison.vitest.ts` | Runs that run block against a fixture | update, supplies the step env | vitest `Tests 17 passed (17)` |
| `check-gate-inputs.sh` | Reads workflow paths | unchanged, not edited | main's copy prints `RESULT: PASSED` on this tree |
| `job-shape-rules.md` concurrency line | States the count | update | `grep -h -A2 '^concurrency:'` recount |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the five flags, Implementation fixes each, and Verification reruns the report and every check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Doctor ci report and contract | `node --test` |
| Integration | The changed-packet gate script against a fixture repository | vitest |
| Manual | None | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `actionlint` at `/opt/homebrew/bin/actionlint` | External | Green | Fall back to a YAML parse |
| Node 20.19.5 under `~/.nvm/versions/node/` | External | Green | No local Node 20 proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A required check reports a different base or head SHA, or an auto-merge stops firing.
- **Procedure**: Revert the commit that carries these workflow edits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
