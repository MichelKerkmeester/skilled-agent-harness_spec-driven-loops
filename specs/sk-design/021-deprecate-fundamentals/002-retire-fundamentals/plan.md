---
title: "Implementation Plan: Phase 2: retire-fundamentals"
description: "Delete the fourth design mode, rebuild the sk-design hub around three modes and repoint every link, mirror and compiled-routing copy that named the retired folder."
trigger_phrases:
  - "retire fundamentals plan"
  - "sk-design three mode hub"
  - "repoint fundamentals links"
  - "compiled routing sk-design"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: retire-fundamentals

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documents, JSON registries and CommonJS routing compilers |
| **Framework** | Skilled skill hub with two-stage compiled routing |
| **Storage** | None |
| **Testing** | `parent-skill-check`, `compiled-route` replay, `compiled-route-sync`, vocabulary reach, `check-markdown-links` and `runtime-mirrors` |

### Overview
Delete the fourth design mode and rebuild the sk-design hub around three modes. Repoint every link, mirror and compiled-routing copy that named the retired folder, then remint the served copies. Prove it with the hub invariant check, both routing replays, the sync check and the link and mirror checks.
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
- [x] `parent-skill-check sk-design` prints `OK: parent-skill-check` with all hard invariants passed and 0 warnings at exit 0
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals --strict` prints RESULT: PASSED
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Hub and nested mode packets with two-stage compiled routing.

### Key Components
- **sk-design hub files**: Register the three modes and carry their metadata.
- **Design agent**: Routes decide work to the sk-code-frontend references.
- **Compiled-routing compiler**: Owns the stage-two targets for the sk-design hub.
- **Served copies and mirrors**: Carry the authored files to each runtime.

### Data Flow
A prompt enters the advisor. Stage one selects a hub from the vocabulary. A value or review prompt now selects sk-code and the frontend router, so sk-design never sees it. A chart, flowchart or extract prompt selects sk-design, whose `ROUTER.md` matches CHART, FLOWCHART or EXTRACT and loads that one mode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section for the duplicate-owner gap that this phase closes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design` hub registry and router | Registers every mode and maps intents | update | `parent-skill-check sk-design` reports three modes in the table and 0 warnings |
| `sk-design` graph metadata | Feeds advisor intent signals | update | `generate-router-intent-signals --check sk-design` prints orphans=0 missing=0 PASSED |
| Design agent decide path | Sends value and behavior work to a skill | update | `rg -n 'sk-code-frontend' .skilled/agents/design.md` prints the decide path |
| Compiled-routing compiler and canaries | Own the stage-two targets for the hub | update | `compiled-route-sync --check` prints all 55 served copies match |
| Runtime mirrors | Serve the agent and skills to codex, pi and hermes | update | `runtime-mirrors --check` reports PASS for 213 mirrors |
| `sk-design-chart`, `sk-design-diagram` and `sk-design-md-generator` | Own their own contracts | not a consumer | Their `SKILL.md` files carry no fundamentals link |

Required inventories:
- Same-class producers: `rg -n 'sk-design-fundamentals' .skilled README.md` finds every reference before the deletion, so the live links and the historical changelog and benchmark records can be told apart.
- Consumers of the retired mode: `rg -n 'fundamentals|VALUES|REVIEW' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design`.
- Matrix axes: stage one replays ten prompts across both hubs. Stage two replays eight value, review and motion prompts plus three sk-design prompts.
- Algorithm invariant: not applicable, no path, parser, resolver or security code changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the baseline and inventories the live references. Implementation deletes the folder, rebuilds the hub, repoints the links and mirrors and remints the routing. Verification replays both routing stages and runs the packet gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Hub registries and metadata files against their schema | `parent-skill-check` and `generated-metadata-integrity` |
| Integration | Both routing stages and the served copies | `skill_advisor.py`, `compiled-route.cjs` and `compiled-route-sync` |
| Manual | Each repointed document read against its new target | Read, no browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 frontend references | Internal | Green | The deletion leaves value work with no destination |
| Node and Python tooling in the repo | Internal | Green | The routing and validation gates cannot run |
| Compiled-routing manifests | Internal | Green | Served copies drift from the authored files |
| Runtime mirror generators | Internal | Green | codex, pi and hermes keep the retired skill |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A hub invariant fails, or a live link still resolves to the deleted folder after the repoint.
- **Procedure**: Revert the phase commits. Git history keeps the folder, so a revert restores the fourth mode and the 2.0.11.0 hub.
<!-- /ANCHOR:rollback -->


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
