---
title: "Implementation Plan: Phase 22: advisor-routing-and-local-install"
description: "Fix four routing and install gaps at their source: a doctor lead phrase, a graph-support bound for typed slash commands, a mode-suffix strip in both advisor scorers, and a sk-git provision step that links private local-* commands from the primary checkout."
trigger_phrases:
  - "advisor routing and local install plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: advisor-routing-and-local-install

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor scorer), Python 3 (scorer twin), bash (sk-git provisioning), YAML (doctor routes) |
| **Framework** | None |
| **Storage** | The advisor's SQLite projection, read only; the compiled `skill-graph.json` |
| **Testing** | vitest, the Python twin's own test script, the sk-git bash harness |

### Overview
Items 1 and 3 are data plus tokenizer fixes: a doctor `lead_phrases` entry, and prompt tokens with `:auto` and its siblings removed after a slash command, so `draft auto-repair` can return to spec-kit's phrases. Item 2 bounds graph-lane support in fusion so a typed command's dependency cannot outrank the command, and item 4 adds a link step to sk-git provisioning. Each is proven by a test that fails before the fix and by live and local probes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Each misroute reproduced with lane evidence (spec.md Measured Behavior)
- [x] The private command's location confirmed: present in worktree 217, absent from the primary checkout
- [x] The ignore rules the link step reads exist in the root `.gitignore`

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] `npx vitest run` from the advisor runtime prints 0 failed files, and the sk-git harness prints `FAIL=0`
- [ ] Docs updated (spec, plan, tasks, implementation summary, sk-git rule 8 and release note)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fix at the producer: each change lands where the wrong value is first made.

### Key Components
- **`_routes.yaml` and its deriver**: the doctor manifest already documents `lead_phrases` for a doctor command that must lead a passing skill; the hooks route gains one.
- **`graph-causal.ts` and `fusion.ts`**: the graph lane now reports how much support each seed lent each target, and fusion caps lent support from a slash-command seed at the seed's own score.
- **`text.ts` and the five prompt lanes, plus `skill_advisor.py`**: `tokenizePrompt` drops command mode suffixes before tokenizing.
- **`worktree-naming.sh`**: `_wn_link_local_commands` runs at the end of `provision_worktree`.

### Data Flow
Prompt, then `tokenizePrompt`, then the five lanes, then the graph lane seeded from three of them, then fusion with the seed bound, then the doctor lead-phrase reorder, then the ranked list. For item 4: the worktree's `.gitignore` command rules, then each `local-*` entry in the primary checkout, then a link in the worktree when that path is free.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fusion.ts` weighted-sum path | Produces every routed score | Update: seed bound | `typed-command-routing.vitest.ts`, pinned routing fixtures unchanged |
| RRF fusion path | Feature-flagged alternative | Unchanged: rank fusion has no lent amount to cap | Code path reads `useRrfFusion` before the bound |
| Prompt lanes (lexical, derived, explicit, semantic shadow, BM25) | Tokenize the prompt | Update: `tokenizePrompt` | `rg -n 'tokenizePrompt' lib/scorer/lanes` lists all five |
| `skill_advisor.py` | Python twin of the scorer | Update: matching strip | Python test T243-SA-029 |
| Divergence ledger and routing-accuracy fixtures | Pin current routing | Unchanged | Their suites pass with no fixture edit |
| `worktree-naming.sh create` | Calls provisioning | Not changed; inherits the link step | sk-git harness |

Matrix for the mode-suffix strip: suffix (`:auto`, `:confirm`, `:autopilot`, `:unattended`) by position (attached to the command, standalone argument, no slash command in the prompt). Only the last position keeps the token.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup reproduces each misroute and locates the command, Implementation makes the four fixes, and Verification reruns the suites, probes and validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Seed bound and mode-suffix strip, each with a control | vitest `typed-command-routing.vitest.ts`, Python T243-SA-029 |
| Integration | Whole advisor suite, doctor slice, parity and ratchet suites; sk-git provisioning in a fixture repo with a linked worktree | vitest, `worktree-naming.test.sh` |
| Manual | The five probe prompts in the live CLI and the local regime | `skill-advisor.cjs advisor_recommend` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| git 2.31 or later (`rev-parse --path-format=absolute`) | External | Green | The link step returns early and links nothing |
| The advisor's compiled graph and SQLite projection | Internal | Green | Live probes would not show the graph-lane fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a routing fixture or the divergence ratchet regresses after merge, or provisioning links a path it should not.
- **Procedure**: revert the phase commit. Links already made in a worktree are removed with `find <worktree> -type l -name 'local-*' -delete`. The primary checkout's command copy is untracked and stays.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation |
| Implementation | The reproduced misroutes | Verification |
| Verification | All four fixes and the rebuilt advisor dist | Close |
<!-- /ANCHOR:phase-deps -->

---
