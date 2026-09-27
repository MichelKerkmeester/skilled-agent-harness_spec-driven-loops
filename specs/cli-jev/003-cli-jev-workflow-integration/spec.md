---
title: "Feature Specification: cli-jev workflow integration"
description: "Research where Jev typed judgments earn a place in .skilled skills, workflows and logic, measured and opt-in, then scaffold the recommended build phases as Planned children."
trigger_phrases:
  - "cli-jev workflow integration"
  - "jev typed judgment integration"
  - "jev skills and workflows research"
  - "jev opt-in integration"
  - "jev integration build phases"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration"
    last_updated_at: "2026-09-27T11:56:00Z"
    last_updated_by: "parent-leaf"
    recent_action: "Filled the phase-map, handoff and scope rows for phases 010 to 018"
    next_safe_action: "Validate each of phases 010 to 018, then the packet recursively"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/goal.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Which recommendations pass the usefulness bar and become build phases"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: cli-jev workflow integration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phased packet) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-26 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | `specs/cli-jev/` (track root) |
| **Parent Packet** | `cli-jev` |
| **Predecessor** | `cli-jev/002-cli-jev-hub-migration` |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 closes with a ranked `research/research.md`, and every build phase it proposes exists as a Planned child that passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `cli-jev` hub can ask the Jev model for a typed judgment (a probability, a score, a choice or a ranking) through its `cli-usage` transport. Nothing else in `.skilled` asks for one yet. The operator has four ideas for where judgments could help: grading AI responses, active skill-advisor recommendations, a smarter goal hook, and Jev paired with a compressor for compaction. `context/` also vendors five outside Jev integrations and a set of posts. None of these ideas has been checked against the real seams in this repository or measured against a baseline. Building from them now would mean guessing where Jev fits and adding machinery nobody has shown to be useful.

### Purpose

Find which Jev-powered skills, workflows and logic earn a place in `.skilled`. Each one must plug into a named seam, improve a metric we can measure on an existing harness, stay opt-in, and stay dormant unless a Jev key resolves. With no key it behaves exactly as today. Phase 001 answers that with 30 forced-depth research iterations across three model families and one fresh synthesis. The phases after it are scaffolded from that synthesis as Planned work, so the operator decides what gets built.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A deep-research phase: context digests on the repository rules, the Jev seams, the vendored material and the measurement harnesses, then 30 iterations over three lineages and a fresh Opus synthesis.
- Adding the Grok 4.7 model id to the cli-cursor allowlist, its tests and its docs, because the research needs a Grok 4.7 lane.
- Scaffolding the build phases the synthesis proposes as Planned children, with filled documents and no implementation.
- A second research round: an AI Council review of round 1, a council-based re-synthesis, 20 forced iterations over four model families, a final synthesis, and Planned build phases reconciled with it.
- A third research round on classifier models, Jev and a local Deem, with Deem 0.8B served on this Mac on the operator's yes and kept current with Deem's releases, the Planned build phases amended for both backends, and the `cli-classifier` hub phases the synthesis proposes.
- Planned owner fixes and follow-ups the research and its runs found: the trigger index, the spec and sk-doc validators, sk-prompt, sk-design, the fan-out merge and steering, the local Deem install, an offline Deem search-narrowing arm and worktree provisioning (phases 010 to 018). Each fix changes files another skill owns, so its build follows that owner's `SKILL.md`, templates and tests. Only phase 017 uses a classifier.

### Out of Scope

- Building any phase the operator has not released. On 2026-09-27 the operator released 018, then 010. Each other build phase is its own later decision.
- Changing the `cli-jev` hub or its `cli-usage` transport contract, except the move under `cli-classifier` that phase 009 plans for D2 of `goal.md`.
- Editing the vendored repositories under `context/`. They are reference material.
- Storing any key or secret in Jev state, in a digest or in a research artifact.
- Any feature that calls a classifier or changes behavior while its backend's check fails. Jev: `command -v jev && jev auth status --provider <the provider its judgments use>`, which only reads, never prints the key and spends no quota (`cli-usage/SKILL.md:98-102`). Deem: the local server passes a health check that refuses the stub backend (`007-classifier-deep-research/context/deem-local.md`). Each feature also keeps its own opt-in switch per backend, and with neither backend it runs exactly as it does today.
- Patching Deem's own code, or any install, before the operator's yes to a plan that names its rollback. Phases 016 and 018 plan these as decisions.
- Changing a default another skill owns without that owner's yes, such as the score-0 rows the trigger-index lookup keeps. Phase 010 records it as an open decision.
- Pushing or merging the worktree branch. Both are the operator's call.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-deep-research/context/*.md`, `001-deep-research/scratch/*` | Create | 001 | Context digests, research angles, the research topic and the synthesis brief |
| `001-deep-research/research/**` | Create | 001 | Three lineages and the merged synthesis |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | 001 | Add the Grok 4.7 id to the cli-cursor allowlist |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | 001 | Mirror the allowlist the runner checks |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modify | 001 | Cover the new id |
| `.skilled/skills/cli-external-orchestration/cli-cursor/**` | Modify | 001 | Document the new id and add a changelog entry |
| `NNN-*/{spec,plan,tasks,goal}.md` for each proposed phase | Create | 002 onward | Planned build phases from the synthesis |
| `007-classifier-deep-research/{context,scratch,research}/**` | Create | 007 | The Deem install record and measurements, 45 angles, briefs, five lineages and the round-3 synthesis |
| `002-*`, `003-*`, `005-*`, `006-*` phase docs | Modify | 007 | The two-backend amendments from the round-3 synthesis |
| `008-cli-classifier-hub/*`, `009-cli-jev-hub-move/*` | Create | 007 | The two new Planned phases from the round-3 synthesis |
| `010-*` to `018-*` phase docs | Create | 010 to 018 | The Planned owner-fix and follow-up phases. Each build changes the owner files its own `spec.md` names |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Context digests and research angles, the Grok 4.7 roster entry, a 30-iteration fan-out over DeepSeek, MiMo and Grok, and a fresh Opus synthesis | Complete |
| 2 | 002-advisor-jev-tiebreak-arm/ | A zero-call census of the advisor's near-tie rows with three comparators and a power line first, then, offline and by hand, whether a Jev or Deem `choice` beats the scorer under a keep rule that can fail, each backend in its own column. Dormant without a Jev key or a healthy local Deem | Planned |
| 3 | 003-goal-verifier-jev-shadow/ | A zero-call Pi census of goal-verify nudges, then the verifier's first error rates from three zero-call arms on an operator-labeled set. A model arm and an opt-in shadow mode in the OpenCode goal plugin, preferring Deem, follow only past a gate fixed before the build. Dormant without a Jev key or a healthy local Deem | Planned |
| 4 | 004-deep-research-expansion/ | Re-synthesize round 1 from the AI Council review, run 20 forced iterations over Grok 4.7, MiMo V2.6 Pro, SWE-2 Max and DeepSeek V4.1 Flash, write the final synthesis and reconcile the Planned build phases | Complete |
| 5 | 005-compaction-recall-harness/ | A zero-call census of host compactions over transcripts the operator names: what the stock summary and the recorded brief keep, and a printed stop line that decides whether an offline deletion arm on either backend is worth building. Dormant without a Jev key or a healthy local Deem | Planned |
| 6 | 006-goal-criteria-lint/ | A lexical lint of goal criteria against rules 4 and 5 of `sk-create-goal`, under a rubric the operator adopts before labeling. A model arm on either backend only past the stop rule. Dormant without a Jev key or a healthy local Deem | Planned |
| 7 | 007-classifier-deep-research/ | Research round 3 on classifier models, Jev and a local Deem 0.8B: context reduction, validator judgment calls, sk-prompt, sk-design and a `cli-classifier` hub, over 45 forced iterations on five model families with one Opus 5.5 high lead per lineage, a fresh Opus 5.5 max synthesis and the Planned phases reconciled for both backends | Complete |
| 8 | 008-cli-classifier-hub/ | Mint the `cli-classifier` hub with `cli-deem` as its first mode, a Node standard-library client for the local Deem server, tested against a fake server first. `cli-jev` stays where it is | Planned |
| 9 | 009-cli-jev-hub-move/ | Move `cli-jev` into `cli-classifier` as mode `cli-jev` over its unchanged `cli-usage` packet, with a route-replay baseline before and after | Planned |
| 10 | 010-trigger-index-search-fixes/ | Unblock the trigger-index rebuild that this packet's vendored model cards refuse, regenerate the stale committed index and keep a build aimed elsewhere off every tracked file. A staleness check is measured before it is placed, and the score-0 miss shape stays the owner's open decision. Owner `system-spec-kit`, no classifier | Complete |
| 11 | 011-spec-validator-fixes/ | Make `AC_COVERAGE` report a cited `file:line` that does not resolve, with the enforce switch's floor, cutoff and advisory default unchanged. Let `check-goal.cjs` accept a path ending in `goal.md`, exit contract frozen. Owners `system-spec-kit` and `sk-create-goal`, no classifier | Planned |
| 12 | 012-sk-doc-validator-and-reference-fixes/ | Replace `validate_document.py`'s silent README fallback with a visible notice or failure and give `quick_validate.py` one severity for a non-qualified MCP tool token. Repoint or remove three dead `file:line` references in the deep-research and spec-kit playbooks. Owners `sk-doc`, `system-deep-loop` and `system-spec-kit`, no classifier | Planned |
| 13 | 013-sk-prompt-framework-docs/ | Reconcile sk-prompt's promise of 7 frameworks with the 5 its registry holds, from the owner's own sources, and make a run read only the chosen framework's section, checked by a before-and-after byte count. Owner `sk-prompt`, no classifier | Planned |
| 14 | 014-sk-design-doc-and-routing-check/ | Rewrite sk-design's stale rule 6 after a live compiled-route rerun and put the md-generator's 80-point gate to the owner as two options with a recommendation. Record the hub's first routing accuracy by replaying its playbook scenarios. Owner `sk-design`, no classifier | Planned |
| 15 | 015-fanout-merge-and-steering-fixes/ | Diagnose from the three rounds' committed lineage files why `fanout-merge.cjs` rebuilds fewer count-only findings than the lineages recorded, then fix it with a regression test built from those files. Give each iteration its lineage's `steer.md` when one exists. Owner `system-deep-loop`, no classifier | Planned |
| 16 | 016-deem-local-hardening/ | Operator decisions on the local Deem install: the open CORS exposure (patch, proxy or accept, each with its rollback), a local access log through `deem-ctl`, `DEEM_N_ORDERS` held at 1 until 002's accuracy result and a versioned home for `deem-ctl`. No install or patch before the operator's yes, no classifier | Planned |
| 17 | 017-deem-search-narrowing-arm/ | An offline arm where one Deem `choice` picks the spec track a question is about and ripgrep searches inside it, kept only if it beats a zero-call ripgrep and trigger-index baseline by a margin fixed before the build. Needs 008 and 010. Dormant without a Jev key or a healthy local Deem | Planned |
| 18 | 018-worktree-provision-shared-link/ | Stop worktree provisioning from skipping a package whose only dependencies are `@spec-kit/*` `file:` links, with a fixture test, and plan this worktree's one-time sk-doc repair as an install that waits for the operator's yes. Owner `sk-git`, no classifier | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | proposed build phases | `research/research.md` ranks every recommendation and lists the phases to scaffold | The synthesis opens every cited `file:line`, and `validate.sh --strict` passes on 001 |
| 001-deep-research | 002-advisor-jev-tiebreak-arm | `research/research.md` ranks R1 build-now with its seam, metric and first slice | `validate.sh --strict` passes on 001 |
| 002-advisor-jev-tiebreak-arm | 003-goal-verifier-jev-shadow | Not a hard gate: 003's offline slice can start any time. Its plugin mode waits on 002's per-call latency record | 002's per-call JSONL shows a wall time for every call |
| 001-deep-research | 004-deep-research-expansion | `ai-council/council-report.md` and `proposed-resynthesis.md` exist | `validate.sh --strict` passes on 001 |
| 004-deep-research-expansion | 002, 003, 005 and 006 | `research/research.md` ranks R1 and R19 build-now and R2 and R20 next, each with its seam, metric, key gate and first slice. Build order: 002's census first, with 005's census and 003's Pi census beside it, since none makes a call | `validate.sh --strict` passes on 004 |
| 005-compaction-recall-harness | 006-goal-criteria-lint | Not a hard gate: 006's lexical lint waits only on the operator's adopted rubric and labels | 006's `spec.md` records the adopted rubric before any labeling |
| 004-deep-research-expansion | 007-classifier-deep-research | The operator approved the round-3 prompt, and `004`'s synthesis is the baseline the new round re-ranks under Deem | `validate.sh --strict` passes on 004 |
| 007-classifier-deep-research | 002, 003, 005 and 006 | `research/research.md` section 14 lists each phase's two-backend amendment line by line, and the build order is unchanged: 002's census first | `validate.sh --strict` passes on 007 and on each amended phase |
| 007-classifier-deep-research | 008-cli-classifier-hub | `research/research.md` ranks R23, the `cli-deem` client, next, with its wire verdict settled from code and a live check | `validate.sh --strict` passes on 007 |
| 008-cli-classifier-hub | 009-cli-jev-hub-move | The hub exists with `cli-deem` routed, and the operator keeps a Deem arm result (research open question 49) | `parent-skill-check` passes on the hub, and a route replay sends a Deem prompt to `cli-deem` |
| 009-cli-jev-hub-move | 010-trigger-index-search-fixes | Not a hard gate: 010 needs nothing from 009 and can start any time. Its first step reproduces the refused index rebuild | `generate-trigger-index.mjs` exits 1 with `refused: 2 document(s)` before the fix and exits 0 after it, and `validate.sh --strict` passes on 010 |
| 010-trigger-index-search-fixes | 011-spec-validator-fixes | Not a hard gate: 011 changes two validators that 010 does not touch | 010's and 011's Files to Change tables name no common file, and `validate.sh --strict` passes on both |
| 011-spec-validator-fixes | 012-sk-doc-validator-and-reference-fixes | Not a hard gate: 012 changes sk-doc validators and three playbook files that 011 does not touch | 011's and 012's Files to Change tables name no common file, and `validate.sh --strict` passes on both |
| 012-sk-doc-validator-and-reference-fixes | 013-sk-prompt-framework-docs | Not a hard gate: 013 changes only sk-prompt files | 012's and 013's Files to Change tables name no common file, and `validate.sh --strict` passes on both |
| 013-sk-prompt-framework-docs | 014-sk-design-doc-and-routing-check | Not a hard gate: 014 changes only sk-design files, and its gate change waits on the owner's choice | 014's `spec.md` records the owner's choice between the two gate options before any gate edit, and `validate.sh --strict` passes on 014 |
| 014-sk-design-doc-and-routing-check | 015-fanout-merge-and-steering-fixes | Not a hard gate: 015 changes only `system-deep-loop` fan-out files, and its diagnosis runs before its fix | 015's diagnosis names the dropped findings by lineage and round before any fix, and `validate.sh --strict` passes on 015 |
| 015-fanout-merge-and-steering-fixes | 016-deem-local-hardening | Not a hard gate: 016 plans operator decisions and changes nothing before the operator's yes | 016's `spec.md` records each option with its rollback and the operator's answer, and `validate.sh --strict` passes on 016 |
| 016-deem-local-hardening | 017-deem-search-narrowing-arm | 017 waits on 010's regenerated index and 008's `cli-deem` client, not on 016. Its Deem arm also needs a healthy local Deem (D1 of `goal.md`) | `lookup-trigger-index.mjs` returns `deem-local.md` with a nonzero score for "deem local server", `validate.sh --strict` passes on 008 and 010, and `deem-ctl status` passes its health check, which refuses the stub backend |
| 017-deem-search-narrowing-arm | 018-worktree-provision-shared-link | Not a hard gate on 017: 018 changes only `sk-git` provisioning files. The dependency runs the other way: 008's and 009's `parent-skill-check.cjs` checks cannot exit 0 in a freshly provisioned worktree until 018's fix lands, because `sk-doc/node_modules/@spec-kit/shared` is never linked | In a freshly provisioned worktree `parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK` and exits 0, 018's fixture test passes, and `validate.sh --strict` passes on 018 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which recommendations clear the usefulness bar and become build phases. The synthesis decides the ranking and the operator decides what gets built.
- Whether any integration needs the npm `jevctl` package that `context/` vendors as "jev-cli", or whether the Python `jev-cli` that `cli-usage` wraps covers every case. Both install a `jev` command.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Packet goal**: See `goal.md` for the durable directive and completion criteria
- **Source material**: See `context/` for the vendored Jev repositories, posts and the operator's ideas file
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
