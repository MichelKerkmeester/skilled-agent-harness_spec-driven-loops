---
title: "Implementation Plan: Phase 2: hub-two-mode-wiring"
description: "Delete the deep command set and its mirrors first, then take the mode out of every hub routing surface, move the packet changelog to a real folder, delete the packet and regenerate the derived files. Then describe a two-mode hub in the docs. Prove it with the per-hub gate run with the hub path, a stage-two replay and the command mirror checkers."
trigger_phrases:
  - "hub two mode wiring plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: hub-two-mode-wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON registries, Markdown docs, YAML workflow files and one CommonJS compiler script |
| **Framework** | None. `skill-hub-routing.md` governs the hub wiring and `sk-doc` governs the doc edits. |
| **Storage** | None changed. |
| **Testing** | `parent-skill-check.cjs` with the hub path, `compiled-route.cjs --hub system-deep-loop`, `compiled-route-guard.cjs`, `check-contract-drift.cjs`, the command mirror checkers and `node --test` for the shared benchmark test |

### Overview
Delete the deep command set and its mirrors first, then take the mode out of every hub routing surface, move the packet changelog to a real folder, delete the packet and regenerate the derived files. Then describe a two-mode hub in the docs. Prove it with the per-hub gate run with the hub path, a stage-two replay and the command mirror checkers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -l -F '| **Status** | Complete' ../001-standalone-agent-and-council-command/spec.md | wc -l` prints 1.
- [ ] `rg -n '^Start SHA: ' ../goal.md` prints 1 line and `ls ../scratch/gate-baseline.md` prints the path.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` ends with `OK: parent-skill-check` and prints `declares 2 modes`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/002-hub-two-mode-wiring --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-mode hub. The registry stays the owner of the mode list, and every other surface follows it.

### Key Components
- **Hub routing surfaces**: `mode-registry.json` owns the mode list. `hub-router.json` and root `ROUTER.md` pick the mode in stage two. `graph-metadata.json` feeds the advisor in stage one. All of them drop the council in the same commit, so the two stages never disagree.
- **Deep command set**: `ai-council.md`, two workflow files, one presentation file, compiled and legacy copies and a contract compiler entry. Three runtime mirrors are symlinks and three are generated, so the sync scripts remove them.
- **Packet changelog**: `.skilled/changelog/system-deep-loop/deep-ai-council` is a tracked symlink into the packet. It becomes a real folder holding the same 20 files before the packet is deleted, as the precedent did for `deep-improvement`.

### Data Flow
After this child a council prompt selects no packet in the hub, because no router signal or vocabulary class names the council. Research and review prompts still select `deep-research` and `deep-review`. The advisor may still score the hub for council words until child 004 removes its entries.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Owner of the shared contract: `system-deep-loop/mode-registry.json`. The contract that must not break is the research and review route through both stages and the divergent pivot's call into `multi-seat-dispatch.cjs`. Real callers this child changes, read on 2026-11-14:

- `.skilled/skills/system-deep-loop/mode-registry.json:80` declares the mode, and `:22` lists `council` in `runtimeLoopTypes`.
- `.skilled/skills/system-deep-loop/hub-router.json:7` tieBreak, `:31` routerSignals and `:44` the `ai-council-aliases` class.
- `.skilled/skills/system-deep-loop/ROUTER.md:67` `AI_COUNCIL` intent and `:81` its resource map.
- `.skilled/skills/system-deep-loop/command-metadata.json:103` the `/deep:ai-council` row and `:48` the sibling hint in the research row.
- `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:45` the `deep/ai-council` contract entry.

Surfaces this child owns, from the inventory of 451 files saved to `../scratch/council-inventory-2026-11-14.txt`:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-ai-council/` packet (139 files) | The mode packet: skill, router, references, scripts, catalogs, playbooks, behavior benchmark, changelog | move `changelog/` to a real folder replacing the tracked symlink `.skilled/changelog/system-deep-loop/deep-ai-council`, then delete the rest | `git ls-files .skilled/skills/system-deep-loop/deep-ai-council` prints nothing and the changelog folder holds no symlink |
| Hub registry, router, root `ROUTER.md`, graph metadata, command metadata, description (1 file each) | Stage one and stage two routing, doctor metadata | update | `parent-skill-check.cjs` with the hub path, both replays |
| `leaf-manifest.json` | Leaf inventory | regenerate with `generate-leaf-manifest.cjs` | Check `10b-byte-drift` passes |
| Hub `SKILL.md`, `README.md`, `ARCHITECTURE.md`, `feature-catalog/` (2), `manual-testing-playbook/` (9), `shared/` (6) | Human-facing contract and shared docs. `shared/rollout/command-injection-rollout.json:4` names `deep/ai-council`. `shared/behavior-benchmark/` names the mode. | update | `rg -n -i 'ai[-_ ]council' .skilled/skills/system-deep-loop/{SKILL.md,README.md,ARCHITECTURE.md}` prints only lines that name the standalone agent |
| `deep-research/` (5) and `deep-review/` (4) | Prose naming the council as a sibling and a 0.20 threshold row | update | `rg -n 'deep-ai-council' .skilled/skills/system-deep-loop/deep-research .skilled/skills/system-deep-loop/deep-review -g '!**/changelog/**'` prints nothing |
| `.skilled/commands/` (17) | `/deep:ai-council` doc, two workflow files, presentation, compiled and legacy copies, command READMEs, doctor deep-loop assets, `create-skill-parent-presentation.txt` | delete the council command set. Update the rest. | REQ-010 `ls` check and `validate-command-tree-parity.sh` |
| Runtime command and prompt mirrors (6) | `.claude/commands/deep/ai-council.md`, `.cursor/commands/deep-ai-council.md` and `.opencode/commands/deep/ai-council.md` are symlinks. `.codex/prompts/`, `.pi/prompts/` and `.dsh/prompts/deep-ai-council.md` are generated. | remove through the sync scripts | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check`, `dsh/sync-prompts-dsh.cjs --check` |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms child 001 is Complete. Implementation removes the deep command set, then the hub wiring, then the packet, then updates the hub docs. Verification runs the per-hub gate with the hub path and validates this folder. `tasks.md` owns the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The shared benchmark test and the contract drift check with two commands | `node --test .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs`, `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` |
| Integration | Hub gate, stage-two replay, command mirror checkers, compiled routing guard | `parent-skill-check.cjs .skilled/skills/system-deep-loop`, `compiled-route.cjs --hub system-deep-loop`, `validate-command-tree-parity.sh`, the Codex, Pi and DSH `sync-prompts` scripts with `--check`, `compiled-route-guard.cjs` |
| Manual | Read the hub `SKILL.md` mode table and confirm it lists two modes and points council readers at the agent | Read the file |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 | Internal | Yellow: must be Complete first | The agent breaks when the packet is deleted. |
| Command mirror generators under `.skilled/skills/system-spec-kit/runtime/cli/` | Internal | Green | Runtime folders keep a dead command. |
| `generate-leaf-manifest.cjs` and `compiled-route-sync.cjs` | Internal | Green | Derived routing files keep the council. |
| `sk-doc` skill | Internal | Green | Doc edits lose template and voice checks. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a research or review prompt stops routing to its mode, or the per-hub gate fails and cannot be repaired in this child.
- **Procedure**: Every deleted file is tracked, so `git revert <sha>` for each commit of this child restores the packet, the command set and the hub wiring. The same revert turns the moved changelog folder back into the tracked symlink. Then rerun the command mirror generators, `generate-leaf-manifest.cjs` and `compiled-route-sync.cjs`, because derived files follow their sources. No untracked file is deleted in this child.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 001 at Status Complete | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Child 003 |
<!-- /ANCHOR:phase-deps -->

---
