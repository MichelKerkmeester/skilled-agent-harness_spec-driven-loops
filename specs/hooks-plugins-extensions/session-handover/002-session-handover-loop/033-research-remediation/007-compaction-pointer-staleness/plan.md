---
title: "Implementation Plan: Phase 7: compaction-pointer-staleness"
description: "Adds the note created_at and a git check step to the after-compaction pointer built by seedText, and passes the date from the Claude, Pi and OpenCode callers."
trigger_phrases:
  - "compaction pointer staleness plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: compaction-pointer-staleness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM, TypeScript for Pi |
| **Framework** | Session relaunch hooks and the OpenCode plugin |
| **Storage** | None; the note frontmatter is read as today |
| **Testing** | `node --test` and vitest |

### Overview
`seedText` gains a `createdAt` option. When `afterCompaction` is true it adds one step before "Continue the work": the note was written at `<created_at>`; run `git log --since=<created_at>` and `git status` and compare them with Remaining work before trusting it. Without a date the step reads "run `git log` and `git status`". The relaunch branch is untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both test commands pass with no relaunch seed expectation edited
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared text builder in `lib/nudge.cjs` with thin runtime adapters.

### Key Components
- **`seedText` in `lib/nudge.cjs`**: builds the pointer; owns the new dated step and step renumbering after compaction.
- **Callers** (`claude/compact-pointer.mjs:209`, `pi/session-relaunch.ts:633`, `.opencode/plugins/session-relaunch.js:280`): each widens its `noteSpecFolder()` helper, which today returns only the `spec_folder` string, to return `{ specFolder, createdAt }` from the one read it already does, and passes `createdAt`. The date goes into the git command through `shellQuote`; empty and missing `created_at` both take the undated step.

### Data Flow
Note frontmatter `created_at` goes to the caller, then to `seedText({ ..., afterCompaction: true, createdAt })`, then into the pointer text the runtime sends. Any comment added explains why the date is there (a note can predate later commits) and carries no spec or phase id.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `seedText` (producer) | Builds relaunch and after-compaction pointer | Update after-compaction branch only | `nudge.test.cjs` |
| `staleNoteText` | Withdrawn compaction text | Unchanged | Existing tests |
| Three callers (consumers) | Send the pointer | Pass `createdAt` | One adapter test each |
| `tests/adapter-conformance.test.cjs` | Holds no pointer text; no test pins the old text exactly | Unchanged | Test run |

Required inventories:
- Same-class producers: `rg -n 'seedText|afterCompaction' .skilled/hooks/session-relaunch .opencode/plugins`.
- Consumers of changed symbols: `rg -n 'seedText\(' . --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.mjs'`.
- Matrix axes: `afterCompaction` (true, false) by `createdAt` (set, missing), four rows.
- Algorithm invariant: the text never contains `undefined` or `null`, and the false branch is byte-identical.
<!-- /ANCHOR:affected-surfaces -->

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
| Unit | `seedText` dated and undated after-compaction text, unchanged relaunch text | `node --test` |
| Integration | Claude, Pi and OpenCode compaction paths send the date | `node --test`, vitest |
| Manual | None; no live proof is required | - |

Baseline before the change and rerun after:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Note frontmatter `created_at` | Internal | Green | Falls back to the undated git step |
| Other phases in this packet | Internal | Green | None; wave 1, independent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any relaunch seed test needs an edited expectation, or a runtime stops sending the pointer.
- **Procedure**: revert the commit for this phase; the text returns to its prior form.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline) --> Core (tests red, then code) --> Verify (test run)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 1-2 hours |
| Verification | Low | 30 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test counts recorded
- [ ] No feature flag needed; text change only
- [ ] Relaunch seed tests pass unedited

### Rollback Procedure
1. Revert the phase commit.
2. Rerun both test commands.
3. Confirm the after-compaction text matches the prior wording.
4. No stakeholder notice needed; the change is internal.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
