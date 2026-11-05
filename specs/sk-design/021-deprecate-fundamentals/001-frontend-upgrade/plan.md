---
title: "Implementation Plan: Phase 1: frontend-upgrade"
description: "Add three visual references and a token asset to sk-code-frontend, route value, hierarchy and motion intents there and repoint the documents that cited the fundamentals assets."
trigger_phrases:
  - "frontend upgrade plan"
  - "sk-code-frontend value references"
  - "two stage routing for visual values"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: frontend-upgrade

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documents and JSON routing configuration |
| **Framework** | Skilled skill hub with two-stage compiled routing |
| **Storage** | None |
| **Testing** | `validate_document.py`, `parent-skill-check`, compiled-route replay and drift guards |

### Overview
Add three visual references and a token asset to `sk-code-frontend`, then teach both routing stages that value, hierarchy and motion prompts belong there. Repoint the documents that cited the fundamentals assets. Prove it with the document validator, a leak grep, the scale diff and a routing replay.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `validate_document.py` prints VALID 0 issues on each new reference
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade --strict` prints RESULT: PASSED
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Hub and nested mode packets, with two-stage routing.

### Key Components
- **sk-code-frontend reference set**: Owns the value, hierarchy and motion guidance.
- **sk-code-frontend `ROUTER.md`**: Stage two maps an intent to leaf references.
- **sk-code `hub-router.json`**: Stage one vocabulary selects the frontend router.
- **sk-code `graph-metadata.json`**: Intent signals feed the advisor.

### Data Flow
A prompt enters the advisor. The hub vocabulary selects sk-code and the `code-frontend-visual` class selects the frontend router. `ROUTER.md` matches an intent such as `WEB_VISUAL_VALUES` and loads `frontend-practice.md` plus `web-visual-values.md`. The agent answers from the scales in the reference.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section for the reported gap that this phase closes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code-frontend/references` producer | Owns the value, hierarchy and motion rules | update | `validate_document.py` reports VALID 0 issues on each file |
| `sk-code-frontend/ROUTER.md` producer and consumer | Matches intents to leaf references | update | `rg -n 'WEB_VISUAL_VALUES\|WEB_VISUAL_HIERARCHY\|WEB_MOTION'` prints three intent lines |
| `sk-code/hub-router.json` consumer | Selects the frontend router from hub vocabulary | update | `rg -n 'code-frontend-visual'` prints the class |
| `sk-code/graph-metadata.json` consumer | Feeds advisor intent signals | update | `generate-router-intent-signals --check sk-code` prints orphans=0 missing=0 |
| Five repointed documents | Read the value rules from the fundamentals paths | update | `check-markdown-links` prints 0 broken links |
| Design agent decide path | Points at the frontend references after phase 2 | unchanged | Phase 2 owns that repoint and records it there |

Required inventories:
- Same-class producers: `rg -n 'box-shadow|outline' .skilled/skills/sk-code/sk-code-frontend/references` finds every focus rule.
- Consumers of the new intents: `rg -n 'WEB_VISUAL_VALUES|WEB_VISUAL_HIERARCHY|WEB_MOTION' .skilled/skills/sk-code`.
- Matrix axes: stage one has five value prompts. Stage two has eight value, review and motion prompts.
- Algorithm invariant: not applicable, no path, parser, resolver or security code changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the baseline and writes the three briefs. Implementation authors the three references, moves the token file and wires the routing. Verification replays both routing stages and runs the packet gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each new reference, its frontmatter, item sequence and scales | `validate_document.py` |
| Integration | Stage-one advisor and stage-two compiled routing | `skill_advisor.py` and `compiled-route.cjs` |
| Manual | Read of each diagnosis table and the focus rule against A5 and A8 | Read, no browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| DeepSeek dispatch capacity | External | Green | Author the three references in house |
| llmgateway provider | External | Green | Same fallback |
| Node and Python tooling in the repo | Internal | Green | The gates cannot run |
| Existing sk-code-frontend references | Internal | Green | New files lose their link base |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A new reference fails validation, or a value prompt still defers after the routing change.
- **Procedure**: Revert the phase commits. The three references and the token move sit inside `sk-code-frontend`, so a revert restores the baseline at `10474a9567`.
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
