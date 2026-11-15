---
title: "Feature Specification: Phase 6: ai-council-mode-deprecation"
description: "Phase parent for retiring ai-council as a system-deep-loop workflow mode. The council lives on as a standalone agent with one speckit command, the hub routes two modes and the divergent Council pivot keeps working. Five child phases own the work."
trigger_phrases:
  - "ai council mode deprecation"
  - "phase 6 ai council mode deprecation"
  - "retire deep-ai-council mode"
  - "standalone ai-council agent"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Phase 6: ai-council-mode-deprecation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-command-and-skill-doc-alignment |
| **Successor** | None |
| **Handoff Criteria** | The parent packet closes when all six children print `RESULT: PASSED` under `validate.sh --recursive --strict`, the phase 005 doc drift guard exits 0 and the per-hub gate for `system-deep-loop` passes with two modes on the final tree. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the deep-research and deep-review workflow logic hardening specification. It retires `deep-ai-council` as a deep-loop mode and re-homes the council as a standalone agent. The operator answered "Split now" on 2026-11-14, so this phase is a phase parent and its five children own the plans, tasks and acceptance criteria.

**Scope Boundary**: Every live surface that registers, routes, documents or tests the `ai-council` workflow mode, the `/deep:ai-council` command and the `council` runtime loop type. The `ai-council` agent stays and is rewritten so it depends on no deep-loop file. The divergent Council pivot inside research and review stays. Existing `ai-council/**` artifacts inside spec folders are never touched.

**Dependencies**:
- Phase 004 sets the one-workflow-file-per-command rule that the kept council command follows.
- Phase 005 finished its research and review doc edits first, so this phase does not collide with them.

**Deliverables**:
- A two-mode `system-deep-loop` hub on every routing surface, with its per-hub gate green.
- A self-contained `ai-council` agent in all eight agent folders, carried through the existing mirror generators.
- One council command, `/speckit:ai-council`, with one workflow file and one presentation file outside the `deep` family.
- Removal of the council packet, command assets, runtime council code the pivot does not need, advisor entries and their tests, each with a caller check.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-11-14 the operator decided, in these words: "let's deprecate deep-ai-council completely as a deep mode and instead make it a isolated .agents file maybe with a command workflow and presentation asset for all runtimes". Today the hub still registers `ai-council` as a full workflow mode with its own packet, two workflow files, a `council` loop type in the shared runtime and lexical advisor entries, so a council request routes into the deep-loop hub. The `ai-council` agent body depends on scripts and references inside that packet and tells the agent to run `node` while its frontmatter denies `bash`, so the agent cannot stand alone as it is.

### Purpose
The council runs as one self-contained agent outside `system-deep-loop`, the hub routes only research and review, and the divergent Council pivot keeps working.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level besides `goal.md`. All detailed planning, task breakdowns, checklists and acceptance criteria live in the child phase folders listed in the Phase Documentation Map below. Requirement, task, criterion and checklist ids keep the numbers they had before the split, so an id names the same thing in the child that now owns it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command, run from the repository root on 2026-11-14, with its verbatim output:

```text
$ rg -l --hidden -i 'ai[-_ ]council|aiCouncil|deep-council' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' . | wc -l; rg -l --hidden -i 'ai[-_ ]council|aiCouncil|deep-council' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' . | awk -F/ '{ if ($2==".skilled" && $3=="skills" && $4=="system-deep-loop") print "hub/" $5; else if ($2==".skilled" && $3=="skills") print "skill/" $4; else if ($2==".skilled") print ".skilled/" $3; else print $2 }' | sort | uniq -c | sort -rn | awk '$1>=3'; node -e 'console.log(require("./.skilled/skills/system-deep-loop/mode-registry.json").modes.map(m=>m.workflowMode).join(" "))'; find -L .skilled/agents .claude/agents .codex/agents .cursor/agents .devin/agents .dsh/agents .opencode/agents .pi/agents -maxdepth 1 -name 'ai-council*' | wc -l; find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 -iname '*council*' | wc -l; rg -l -i 'council' .skilled/skills/system-deep-loop/runtime -g '!node_modules' | wc -l; ls .skilled/skills/system-deep-loop/runtime/lib/council | wc -l; rg -n "require\('\.\./council/" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts
     451
 139 hub/deep-ai-council
  73 hub/runtime
  41 skill/cli-external-orchestration
  34 skill/system-spec-kit
  22 skill/system-skill-advisor
  18 skill/sk-doc
  17 .skilled/commands
  10 hub/changelog
   9 hub/manual-testing-playbook
   6 hub/shared
   6 hub/benchmark
   6 .skilled/changelog
   5 hub/deep-research
   5 .skilled/agents
   5 .pi
   5 .dsh
   5 .codex
   5 .claude
   4 hub/deep-review
   4 .github
   3 .skilled/hooks
   3 .skilled/bin
research review ai-council
       8
       6
     143
       9
273:const { dispatchCouncilSeats } = require('../council/multi-seat-dispatch.cjs') as {
```

The output reads as follows. 451 files outside `specs/` name the council. The registry holds three modes. 8 agent entries exist across the eight agent folders. 6 runtime command or prompt entries mirror `/deep:ai-council`. 143 runtime files name `council`. `runtime/lib/council/` holds 9 entries. The divergent pivot reads exactly one of them, `multi-seat-dispatch.cjs`. Groups with fewer than three files are left out of the table. Each child's `spec.md` measures its own surface again at the commit the split was made from.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `ai-council` from the hub registry, router, root `ROUTER.md`, graph metadata, command metadata, description, leaf manifest, hub docs, catalogs and playbooks so the hub routes two modes.
- Rewrite the `ai-council` agent so it names no `system-deep-loop` path and runs no script, then carry it to every agent folder through the existing mirror generators.
- Add one council command, one workflow file and one presentation file in the `speckit` family, and delete the `/deep:ai-council` command, its assets and its six mirrors.
- Delete the `deep-ai-council` packet and the runtime council code the pivot does not read. Remove only the council members from shared runtime libraries.
- Remove the council from advisor maps, scorer lanes, command bridges, fixtures and tests, and from callers in other skills, hooks, plugins, CI and root docs.

### Out of Scope
- `ai-council/**` artifacts inside any spec folder - D5 protects them, and the validator tolerance test for them stays.
- The divergent pivot logic in `runtime/lib/deep-loop/divergent-pivot.ts` - D4 keeps it, including its `ai-council` path guard.
- Research and review workflow behavior - phases 001 to 005 own it. This phase edits only the prose lines in their docs that name the council.
- Changelog files, dated benchmark reports and spec-copy test fixtures - they record history and stay as written. The packet's own `changelog/` moves to a real folder at `.skilled/changelog/system-deep-loop/deep-ai-council/` before the packet is deleted, because that path is a tracked symlink into the packet today.
- Untracked council graph databases on disk - this phase never deletes an untracked file.
- The multi-topic session loop - D10 drops it, because it needs the `council` loop type, the council graph and the session scripts that D4 removes.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/agents/ai-council.md`, `.claude/agents/ai-council.md` and the three generated agent mirrors | Modify/Regenerate | 001 | Self-contained agent |
| `.skilled/commands/speckit/ai-council.md`, `assets/speckit-ai-council.yaml`, `assets/speckit-ai-council-presentation.txt` | Create | 001 | The kept command |
| `.skilled/skills/system-deep-loop/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `command-metadata.json`, `description.json`, `leaf-manifest.json` and the hub docs | Modify/Regenerate | 002 | Two modes |
| `.skilled/skills/system-deep-loop/deep-ai-council/` | Delete | 002 | The mode packet |
| `.skilled/commands/deep/ai-council.md`, its assets, compiled and legacy copies and six runtime mirrors | Delete | 002 | The deep command |
| `.skilled/skills/system-deep-loop/runtime/` council libraries, scripts and tests | Delete/Modify | 003 | The D4 removal list in the child's `plan.md` |
| `.skilled/skills/system-skill-advisor/runtime/` maps, lanes, bridges, fixtures and tests | Modify/Regenerate | 004 | No deep council mode |
| Callers in other skills, `.skilled/hooks/`, `.opencode/plugins/`, `.github/`, `.env.example`, `README.md` | Modify | 005 | The caller inventory in the child's `plan.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-standalone-agent-and-council-command/ | The agent stands alone in all eight agent folders and `/speckit:ai-council` exists in six runtime folders. The gate baseline is captured first. Nothing is deleted. | Complete |
| 2 | 002-hub-two-mode-wiring/ | The hub routes two modes on every routing surface, and the mode packet and the `/deep:ai-council` command are deleted | Complete |
| 3 | 003-runtime-council-removal/ | The runtime keeps only the council file the divergent pivot reads, and its suite and typecheck pass | Complete |
| 4 | 004-advisor-council-removal/ | The advisor names no deep council mode, and research and review routing and every threshold stay unchanged | Complete |
| 5 | 005-caller-sweep-and-verification/ | Callers in other skills, hooks, plugins and CI are updated, and the whole phase is proven on the final tree | Complete |

The children run in folder order. The agent is rewritten first, because it reads packet scripts that child 002 deletes. The hub wiring goes before the runtime and the advisor, because both mirror the registry. The runtime and advisor suites can fail on the branch between children 002 and 004, since they still name the deleted packet until their own child runs. Child 005 reruns every gate on the final tree.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-standalone-agent-and-council-command | 002-hub-two-mode-wiring | The agent reads no packet file and the speckit council command is mirrored, so the packet and the deep command can be deleted | Every row of `001-standalone-agent-and-council-command/acceptance-criteria.md` is `Met` |
| 002-hub-two-mode-wiring | 003-runtime-council-removal | The registry lists two modes and two loop types, and no command names the `council` loop type | Every row of `002-hub-two-mode-wiring/acceptance-criteria.md` is `Met` |
| 003-runtime-council-removal | 004-advisor-council-removal | The runtime suite and typecheck pass with the pivot as the only council reader | Every row of `003-runtime-council-removal/acceptance-criteria.md` is `Met` |
| 004-advisor-council-removal | 005-caller-sweep-and-verification | The advisor suite, typecheck and drift guard pass with two deep modes | Every row of `004-advisor-council-removal/acceptance-criteria.md` is `Met` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None open. The three questions this phase raised were answered on 2026-11-14 and are recorded in the packet `decision-record.md`:

- **D3, the council command.** The operator chose option B, `/speckit:ai-council` owned by `system-spec-kit`, single round, with one workflow file and one presentation file (Q008).
- **Phase parent.** The operator answered "Split now" (Q009), so this phase has five children.
- **Multi-topic session loop.** It is dropped, because it needs the `council` loop type, the council graph and the session scripts that D4 removes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md and acceptance-criteria.md
- **Parent Spec**: See `../spec.md`
- **Goal**: See `goal.md` for the decisions every child honors and the binding to each child goal
- **Shared setup files**: `scratch/` holds the council inventory, the gate baseline and the history allowlist that every child reads
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
