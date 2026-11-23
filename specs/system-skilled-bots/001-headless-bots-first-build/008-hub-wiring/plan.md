---
title: "Implementation Plan: Phase 8: hub-wiring"
description: "Scaffold the system-skilled-bots hub and its commands through the purpose-built create workflows, generate mirrors and the leaf manifest, then prove routing with the per-hub gate and a two-stage replay and prove re-pin safety on a staged copy."
trigger_phrases:
  - "hub wiring plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: hub-wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON and Markdown hub files, YAML doctor asset, generated mirrors |
| **Framework** | Skilled parent-hub pattern: `mode-registry.json`, `hub-router.json`, root `ROUTER.md` |
| **Storage** | None |
| **Testing** | `parent-skill-check.cjs`, `compiled-route.cjs`, `skill_advisor.py`, the three mirror checkers, `overlay-engine.cjs repin --stage` |

### Overview
This phase adds the hub and command surfaces that make the phase 1 to 7 runtime reachable. It writes them only through `/create:skill-parent` and `/create:command`, and it generates mirrors and the leaf manifest with their own scripts. It proves the result with the per-hub gate run on this hub's path, a two-stage replay per mode, an alias replay and a staged re-pin.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Every predecessor phase's `acceptance-criteria.md` shows all rows Met: `rg -c '\| Unmet \|' ../00[1-7]-*/acceptance-criteria.md` prints 0 for each.
- [ ] `bots status` from phase 7 runs and exits 0 on a fixture repository.
- [ ] ADR-001 to ADR-006 in `decision-record.md` are settled by the operator or replay.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` exits 0 and its subject line names `system-skilled-bots`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Two-stage parent hub. The advisor picks the hub from its `graph-metadata.json`. The hub's `hub-router.json` and root `ROUTER.md` pick the mode, then its leaves (`skill-hub-routing.md` §1).

### Key Components
- **Hub root**: one advisor identity. Without its `graph-metadata.json` vocabulary, no bots request ever surfaces the hub, because `metadata` modes have no advisor entry of their own.
- **Four mode packets**: author, run, schedule and status. Without them stage two has nothing to resolve to.
- **Router commands**: thin entry points per mode. Without them a runtime that lists commands cannot reach the modes.
- **Doctor asset**: runs the definition checker. Without it the checker from phase 2 has no doctor entry point.

### Data Flow
A request reaches the advisor, which scores the hub on `graph-metadata.json`. `compiled-route.cjs` then matches `routerSignals` and `INTENT_SIGNALS` to pick the mode and loads its `RESOURCE_MAP` leaves. A command invocation skips stage one and routes straight to its mode's packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

N/A as a fix addendum. This phase fixes no reported finding. The surfaces it adds are the eleven rows of `parent-skills-nested-packets.md` §7, and ADR-001 records which of them apply.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Advisor (`skill_advisor.py`) | Scores hubs from `graph-metadata.json` | not a consumer of code changes, reads the new hub metadata | Replay per mode with `--threshold 0.5` |
| Mirror trees (`.claude/commands/`, `.cursor/commands/`, `.codex/prompts/`, `.pi/prompts/`) | Expose commands per runtime | update by sync script | The three mirror checkers |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup re-captures the Measured Behavior block, reads the two create workflow contracts and settles the aliases. Implementation runs `/create:skill-parent` for the hub, `/create:command` for the bots and doctor commands, then the sync scripts and the leaf-manifest generator. Verification runs the per-hub gate with the hub path, the two-stage replay, the alias replay, the mirror checkers and the staged re-pin.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The deciding command is `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots`, which must exit 0 with a subject line naming this hub. It is necessary and not sufficient, so the replays below are also required.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Hub registry, router, tieBreak permutation and leaf-manifest bytes | `parent-skill-check.cjs` with the hub path |
| Integration | One prompt per mode through both stages, plus one out-of-domain phrase per alias | `compiled-route.cjs --hub system-skilled-bots`, `skill_advisor.py --threshold 0.5` |
| Integration | Mirror parity | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check` |
| Integration | Consumer safety | `overlay-engine.cjs repin --upstream <dir> --to <commit> --root <copy> --stage <empty dir>` on a copy, then a hash compare of `bots/` in the copy and in the staged tree |
| Manual | Ungated surfaces: `INTENT_SIGNALS` and `RESOURCE_MAP` keys, `graph-metadata.json` vocabulary, `description.json` | `rg` over each file, recorded in `implementation-summary.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 007 | Internal | Amber (built; phase 002 still has 3 Unmet weekday-probe rows) | Modes would route to missing behavior. Phase cannot start |
| `/create:skill-parent` | Internal | Green (exists at `.skilled/commands/create/skill-parent.md`) | No sanctioned hub scaffold. Stop and flag the deviation |
| `/create:command` | Internal | Green (exists at `.skilled/commands/create/command.md`) | No sanctioned command scaffold. Stop and flag the deviation |
| `/create:skill-parent` owned assets | Internal | Green (written) | Hub root: `SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json`, `command-metadata.json`, `leaf-manifest.json`, `changelog/`, `shared/`, `benchmark/`, `manual-testing-playbook/`, and per packet `SKILL.md`, `ROUTER.md`, `README.md`, `changelog/` |
| `/create:command` owned assets | Internal | Green (written) | Per bots command: `.skilled/commands/bots/<mode>.md` plus `assets/bots-<mode>-auto.yaml`, `assets/bots-<mode>-confirm.yaml` and `assets/bots-<mode>-presentation.txt`. Doctor family: `.skilled/commands/doctor/bots.md`, `assets/doctor-bots-check.yaml`, `assets/doctor-bots-presentation.txt` and its `_routes.yaml` entry |
| `overlay-engine.cjs repin --stage` | Internal | Green (exists at `.skilled/commands/doctor/scripts/overlay-engine.cjs`) | No staged re-pin proof. AC-007 stays Unmet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a bots alias captures an out-of-domain request after ship, the per-hub gate fails or another hub's routing replay regresses.
- **Procedure**: revert the phase commit. That removes the hub files, the commands and the doctor asset. Then rerun each mirror sync script so the mirror trees drop the bots commands, and rerun the advisor rebuild so the hub's vocabulary leaves the index. The runtime from phases 1 to 7 stays usable from its CLI.
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
| Setup | Phases 001 to 007 complete | Implementation |
| Implementation | Setup, settled aliases and command shape | Verification |
| Verification | Implementation | Phase close and any claim that a mode is routed |
<!-- /ANCHOR:phase-deps -->

---
