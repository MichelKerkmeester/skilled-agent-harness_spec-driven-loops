---
title: "Implementation Plan: Phase 8: claim-error-per-state"
description: "Add a per-state sentence to the claimHandoff refusal while keeping its prefix, with failing-first tests for done, claimed, missing and unknown status."
trigger_phrases:
  - "claim error per state plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: claim-error-per-state

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | Markdown handoff notes with frontmatter |
| **Testing** | `node --test`, vitest for the Pi extension |

### Overview
`claimHandoff` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` throws `cannot claim handoff with status X` for every non-open note. A small helper builds the message: the prefix, then one sentence chosen by status. Done says the work is finished and names `superseded_by` when present, claimed names `claimed_by` and `claimed_at`, missing says it is not a handoff note, and any other status keeps the prefix alone.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Library function inside the session-relaunch hook core.

### Key Components
- **`claimHandoff`**: reads the note under the append lock and refuses a non-open status.
- **Refusal message helper**: a new local function that maps status to prefix plus sentence; note values come from `parseHandoff`, one line per field. Its comment states only why the sentence exists: so a session never continues finished or owned work.

### Data Flow
Note text is parsed to frontmatter, the status is checked, and on refusal the helper reads `status`, `claimed_by` and `claimed_at` from that same frontmatter to build the error. Nothing is written on refusal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claimHandoff` in `relaunch-core.cjs` | Only producer of the claim refusal | Update | New tests |
| `relaunch-core.test.cjs` lines ~302, ~1940 | Match the prefix by regex | Unchanged | Pass unedited |
| `session-relaunch-cli.test.cjs` | Calls claim through the CLI | Unchanged unless it asserts the full message | `rg -n "cannot claim handoff" .skilled/hooks` shows no CLI assertion today |

Required inventories:
- Same-class producers: `rg -n "cannot claim handoff" .skilled/hooks` finds one producer, `relaunch-core.cjs:1074`.
- Consumers of changed symbols: the same search finds only the test regexes at `relaunch-core.test.cjs:302` and `:1940`; no caller parses the message.
- Matrix axes: status (done, done with `superseded_by`, claimed, missing, unknown) by claim fields (present, absent).
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
| Unit | `claimHandoff` refusals for done, done with `superseded_by`, claimed, missing, unknown; existing prefix tests | `node --test` |
| Integration | CLI and plugin suites, Pi extension | `node --test`, vitest |
| Manual | None; no live proof is needed | - |

Run as a baseline before the change and again after:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```

The new tests must fail on the code before the change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | - | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any existing test fails after the change, or a caller depends on the exact old message.
- **Procedure**: Revert the commit that touched `relaunch-core.cjs` and its test file.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **About 1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test run recorded
- [ ] No data changes; no flag needed

### Rollback Procedure
1. Revert the code commit with `git revert`.
2. Rerun both test commands and confirm the baseline counts.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

