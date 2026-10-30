---
title: "Implementation Plan: embed engine"
description: "Compose in memory, show a diff and a ledger, hash what was shown, back up before the first byte, write inside an allowlist and prove preservation after the write."
trigger_phrases:
  - "agents md embed plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: embed engine

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, `node:test` |
| **Framework** | None; `git check-ignore` and `git merge-file` are called as child processes where the design reuses them |
| **Storage** | Backup directory under an ignored output path or the OS temp directory |
| **Testing** | `node:test` over `fs.mkdtempSync` copies of the fixtures |

### Overview
Build the pure pieces first: the composer, the preservation function and the digest. Then the three commands that move bytes, each with a spy proving what it wrote. The suite drives temporary copies only, so a failed run cannot touch a tracked file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 002 reports `STATUS=OK` on this repository and its fixtures exist
- [ ] The update engine's exported classifier is importable without an edit to that engine
- [ ] The six baseline commands are recorded in `scratch/baseline.txt`

### Definition of Done
- [ ] `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` reports `fail 0`
- [ ] `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` prints `NOTHING TO DO` on the pristine template
- [ ] A planted drop restores automatically and ends `STATUS=FAIL`
- [ ] Every written path is inside the allowlist
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure composition, then a three-step write with a proof at the end.

### Key Components
- **Composer**: builds the new `AGENTS.md`, `REPO RULES.md` rows and the cursor mirror in memory, and returns them with a digest.
- **Preservation function**: `preservationCheck(old, new, manifest) -> {dropped, foreign}`, pure and directly testable.
- **Apply and restore**: the only writers, both gated by the allowlist and both leaving a backup behind.

### Data Flow
The check report feeds the composer, the composer returns a set of composed files and a digest, the plan prints them, and apply recomposes and compares digests before writing. After the write the pointer sync regenerates the cursor block, the preservation check runs against the backups, and a violation restores them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The composer and the preservation function | `node:test` |
| Integration | Plan, apply and restore over temporary copies | `node:test` with `fs.mkdtempSync` |
| Manual | A plan on this repository, which must print `NOTHING TO DO` | `agents-md-embed.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 002's check report | Internal | Yellow | No composition without it |
| The exported three-way classifier | Internal | Green | Edited sections fall back to adopt-and-carry |
| `git check-ignore` | External | Green | Backups move to the OS temp directory |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The preservation check reports a dropped line, or a written path falls outside the allowlist.
- **Procedure**: The engine restores from its own backup and ends `STATUS=FAIL`; if it cannot, `restore --run=<dir>` puts the recorded bytes back and the backup directory is never deleted.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 002's fixtures and report | Implementation |
| Implementation | The composer and the preservation function | Verification |
| Verification | All three commands | Child 004, whose workflows invoke them |
<!-- /ANCHOR:phase-deps -->

---
