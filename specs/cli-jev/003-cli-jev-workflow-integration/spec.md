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
    last_updated_at: "2026-09-30T07:32:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the parent with all 35 children Complete"
    next_safe_action: "Operator: push or merge, labels and live runs per goal.md"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/goal.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
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
| **Status** | Complete |
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
- One Planned test phase for each item the round-3 synthesis ranked `later` (`007-classifier-deep-research/research/research.md` section 12), phases 019 to 035, added on 2026-09-29 because the operator asked for a phase per later item "so we can test everything". Each is offline, prints a zero-call first slice, fixes its keep rule before any model run and ends in one verdict line per column. R17, the PR-claims advisory report, is dropped by the operator and has no phase.

### Out of Scope

- Building a phase before the operator releases it. On 2026-09-27 the operator released 018, then 010, then 011 to 015 (014 with gate option A). On 2026-09-28 the operator released every remaining Planned phase in the order 008, 016, 002, 017, 003, 005, 006 and 009, with builds on disjoint paths free to run in parallel (D3 of `goal.md`). 009 was built once 008 was Complete (D4 of `goal.md`, amended by the operator on 2026-09-29, which dropped the earlier need for a Deem `keep` in 002 or 017), in `ea883967d4`. Phases 019 to 035, added on 2026-09-29, were released the same day, when the operator's "Bind and release" amended D3 of `goal.md` and its BINDING table grew to 001 to 035. They build in number order, and builds on disjoint paths may run in parallel. Each stays Planned until it is built (`goal.md` log row "Directive amendment: bind and release 019 to 035 (2026-09-29)").
- Changing the `cli-jev` hub or its `cli-usage` transport contract, except the move under `cli-classifier` that phase 009 made for D2 of `goal.md`.
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
| `008-cli-classifier-hub/*`, `009-cli-jev-hub-move/*` | Create | 007 | The two new phases from the round-3 synthesis, authored as Planned |
| `010-*` to `018-*` phase docs | Create | 010 to 018 | The Planned owner-fix and follow-up phases. Each build changes the owner files its own `spec.md` names |
| `019-*` to `035-*` phase docs | Create | 019 to 035 | The Planned later-item test phases, one per round-3 `later` item except the dropped R17. Each build changes the owner files its own `spec.md` names |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Context digests and research angles, the Grok 4.7 roster entry, a 30-iteration fan-out over DeepSeek, MiMo and Grok, and a fresh Opus synthesis | Complete |
| 2 | 002-advisor-jev-tiebreak-arm/ | A zero-call census of the advisor's near-tie rows with three comparators and a power line first, then, offline and by hand, whether a Jev or Deem `choice` beats the scorer under a keep rule that can fail, each backend in its own column. Dormant without a Jev key or a healthy local Deem | Complete |
| 3 | 003-goal-verifier-jev-shadow/ | A zero-call Pi census of goal-verify nudges, then the verifier's first error rates from three zero-call arms on an operator-labeled set. A model arm and an opt-in shadow mode in the OpenCode goal plugin, Jev first and then Deem (operator, 2026-09-29), follow only past a gate fixed before the build. Dormant without a Jev key or a healthy local Deem | Complete |
| 4 | 004-deep-research-expansion/ | Re-synthesize round 1 from the AI Council review, run 20 forced iterations over Grok 4.7, MiMo V2.6 Pro, SWE-2 Max and DeepSeek V4.1 Flash, write the final synthesis and reconcile the Planned build phases | Complete |
| 5 | 005-compaction-recall-harness/ | A zero-call census of host compactions over transcripts the operator names: what the stock summary and the recorded brief keep, and a printed stop line that decides whether an offline deletion arm on either backend is worth building. Dormant without a Jev key or a healthy local Deem | Complete |
| 6 | 006-goal-criteria-lint/ | A lexical lint of goal criteria against rules 4 and 5 of `sk-create-goal`, under a rubric the operator adopts before labeling. A model arm on either backend only past the stop rule. Dormant without a Jev key or a healthy local Deem | Complete |
| 7 | 007-classifier-deep-research/ | Research round 3 on classifier models, Jev and a local Deem 0.8B: context reduction, validator judgment calls, sk-prompt, sk-design and a `cli-classifier` hub, over 45 forced iterations on five model families with one Opus 5.5 high lead per lineage, a fresh Opus 5.5 max synthesis and the Planned phases reconciled for both backends | Complete |
| 8 | 008-cli-classifier-hub/ | Mint the `cli-classifier` hub with `cli-deem` as its first mode, a Node standard-library client for the local Deem server, tested against a fake server first. `cli-jev` stays where it is | Complete |
| 9 | 009-cli-jev-hub-move/ | Move `cli-jev` into `cli-classifier` as mode `cli-jev` over its unchanged `cli-usage` packet, with a route-replay baseline before and after, and onboard `cli-classifier` to the compiled fleet in `cli-jev`'s place | Complete |
| 10 | 010-trigger-index-search-fixes/ | Unblock the trigger-index rebuild that this packet's vendored model cards refuse, regenerate the stale committed index and keep a build aimed elsewhere off every tracked file. A staleness check is measured before it is placed, and the score-0 miss shape stays the owner's open decision. Owner `system-spec-kit`, no classifier | Complete |
| 11 | 011-spec-validator-fixes/ | Make `AC_COVERAGE` report a cited `file:line` that does not resolve, with the enforce switch's floor, cutoff and advisory default unchanged. Let `check-goal.cjs` accept a path ending in `goal.md`, exit contract frozen. Owners `system-spec-kit` and `sk-create-goal`, no classifier | Complete |
| 12 | 012-sk-doc-validator-and-reference-fixes/ | Replace `validate_document.py`'s silent README fallback with a visible notice or failure and give `quick_validate.py` one severity for a non-qualified MCP tool token. Repoint or remove three dead `file:line` references in the deep-research and spec-kit playbooks. Owners `sk-doc`, `system-deep-loop` and `system-spec-kit`, no classifier | Complete |
| 13 | 013-sk-prompt-framework-docs/ | Reconcile sk-prompt's promise of 7 frameworks with the 5 its registry holds, from the owner's own sources, and make a run read only the chosen framework's section, checked by a before-and-after byte count. Owner `sk-prompt`, no classifier | Complete |
| 14 | 014-sk-design-doc-and-routing-check/ | Rewrite sk-design's stale rule 6 after a live compiled-route rerun and put the md-generator's 80-point gate to the owner as two options with a recommendation. Record the hub's first routing accuracy by replaying its playbook scenarios. Owner `sk-design`, no classifier | Complete |
| 15 | 015-fanout-merge-and-steering-fixes/ | Diagnose from the three rounds' committed lineage files why `fanout-merge.cjs` rebuilds fewer count-only findings than the lineages recorded, then fix it with a regression test built from those files. Give each iteration its lineage's `steer.md` when one exists. Owner `system-deep-loop`, no classifier | Complete |
| 16 | 016-deem-local-hardening/ | The operator's four answers on the local Deem install, 2026-09-28: the open CORS exposure accepted with a revisit trigger, a local access log through `deem-ctl`, `DEEM_N_ORDERS` held at 1 until 002's order-flip rate and a reviewed copy of `deem-ctl` in `007`'s context with a `cmp` check. No patch to Deem's code, no classifier | Complete |
| 17 | 017-deem-search-narrowing-arm/ | An offline arm where one Deem `choice` picks the spec track a question is about and ripgrep searches inside it, kept only if it beats a zero-call ripgrep and trigger-index baseline by a margin fixed before the build. Needs 008 and 010. Dormant without a Jev key or a healthy local Deem | Complete |
| 18 | 018-worktree-provision-shared-link/ | Stop worktree provisioning from skipping a package whose only dependencies are `@spec-kit/*` `file:` links, with a fixture test, and plan this worktree's one-time sk-doc repair as an install that waits for the operator's yes. Owner `sk-git`, no classifier | Complete |
| 19 | 019-advisor-suggested-order/ | R3: whether a Jev or Deem order of the advisor's whole near-tie cluster beats the scorer's own order and fits the hook's 2,200 ms advisor budget when timed inside a child, after a zero-call run that prints the order census, three zero-call orders and the advisor's own child time | Complete |
| 20 | 020-routing-clarify-default/ | R12: whether a Jev or Deem pick among a compiled hub router's `clarify` alternatives beats the first alternative the router lists, after a zero-call census of clarify outcomes over committed prompts that writes unlabeled rows and stops at a 30-row label gate | Complete |
| 21 | 021-stage2-leaf-route-replay/ | R25: a zero-call replay of each hub's `ROUTER.md` keyword block, scored on leaf-set F1 against the committed `expected_leaf_resources` gold beside a recount of `ROUTER.md` reads, where a Jev or Deem `choice` only breaks the ties the replay leaves | Complete |
| 22 | 022-alignment-folder-suggestion/ | R13: whether a Jev or Deem pick among the folders a below-50 alignment save lists beats staying with the target or taking the top-scored alternative, after a zero-call census of below-50 events per save path and a path replay that stop at a 30-row label gate | Complete |
| 23 | 023-reply-harness-blinded-judge/ | R6: whether a Jev or Deem `score` per rubric dimension agrees with the operator's grades of masked reply-harness replies more often than the harness's mechanical scores, after a zero-call census of the masked replies and the mechanical baseline that stops at a 20-reply label gate | Complete |
| 24 | 024-hallucination-grader/ | R7: make the model-benchmark runner reject an unknown `--grader` instead of silently scoring with `mock`, then measure whether a Jev or Deem `noul` flags invented flags, files or functions better than the deterministic hallucination-flag check, after a zero-call census that stops at a 30-output label gate | Complete |
| 25 | 025-reviewer-verdict-fallback/ | R5: whether a Jev or Deem `choice` over `pass`, `fail` and `block` classifies the reviewer outputs the verdict regex misses better than zero-call rules, after a zero-call replay of the regex over every recorded output that stops at a 12-output label gate | Complete |
| 26 | 026-completion-claim-audit/ | R4: how often the completion-evidence sentinel's claim regex fires on a turn that claimed nothing or misses one that did, and whether a Jev or Deem `noul` reads the claim better, after a zero-call census of fires and per-word counts that stops at a 30-turn label gate | Complete |
| 27 | 027-stop-second-rater/ | R8: whether a Jev or Deem `score` of each iteration's novelty moves a replayed deep-research stop closer to the gold derived from first-appearance cited sources than the zero-call stop rules do, after a zero-call census and baselines, with the operator's five-lineage read gating the gold | Complete |
| 28 | 028-confirm-mode-stop-hint/ | R9: whether a confirm-mode stop hint drawn from a zero-call rule or from 027's recorded Jev or Deem rater would be right at least 9 times in 10 and save an iteration on a fifth of lineages, read from 027's report with no model call in any mode | Complete |
| 29 | 029-p0-reread-order/ | R10: whether a Jev or Deem severity `choice` separates real P0 findings from false ones better than the recorded severity, after a zero-call census of registry P0 rows and their transitions that stops at a gate of 20 labeled P0 negatives | Complete |
| 30 | 030-fanout-merge-shadow-record/ | R15: whether a Jev or Deem same-or-different `noul` on cross-lineage finding pairs near the fan-out merge's 0.15 title line or across different bodies matches the operator's labels better than the merge's own decision, after a zero-call pair census that stops at a 40-pair label gate | Complete |
| 31 | 031-debug-next-check/ | R18: whether a Jev or Deem `choice` of the cheapest next check for a debug hypothesis beats the best constant answer, `read_code` included, on an operator-labeled fixture, after a zero-call seam search and constant baselines that stop at a 30-row label gate and a payload gate | Complete |
| 32 | 032-citation-drift-scan/ | R24: whether a Jev or Deem `noul` finds skill-doc `file:line` citations that no longer show what the citing sentence claims better than a zero-call identifier-overlap check, after a zero-call citation census and dead check that stop at a gate of 20 live labels beside 20 constructed drifts | Complete |
| 33 | 033-validator-residue-flagger/ | R26: whether a Jev or Deem `noul` flags correctness and traceability defects in document passages better than flag-nothing, which is the review table today, after a zero-call census of committed deep-review finding rows that stops at a 100-row label gate | Complete |
| 34 | 034-hvr-reader-needed-lens/ | R22: whether a Jev or Deem `noul` flags synonym cycling, significance inflation and false ranges in skill-doc sections better than the HVR scanner's floor and the standard's lexical rules, after a zero-call census of flagged sections that stops at a 150-row label gate | Complete |
| 35 | 035-fetched-text-injection-screen/ | R16: whether a Jev or Deem `noul` spots text that tries to instruct the agent better than flag-nothing and a lexical screen, on public vendored text with operator-planted instructions, after a zero-call fetch and corpus census that stops at a 90-row label gate, with the fetch seam left open | Complete |
| 36 | 036-sk-code-and-sk-doc-alignment/ | Align every file the packet created with sk-code-opencode and sk-doc: code header markers, bracketed stderr tags, playbook and catalog validator failures, voice-rule blockers and one missing README, proved by each skill's own validators | Complete |
| 37 | 037-pi-native-classifier-transport/ | Measure Pi 0.99's native classifier runtime against the jev CLI on the same Jev 1.13 questions (agreement, latency, cost), after a zero-call census of reachable classifier models, with no integration change | Complete |
| 38 | 038-pi-classifier-transport-integration/ | Make Pi a working, opt-in Jev transport for `choice` questions, and document it for Pi workers, with today's behavior unchanged when the switch is off | Complete |
| 39 | 039-hub-cleanup/ | Make the cli-classifier hub say what it is: a `cli-jev` folder for the Jev mode, pre-release versions everywhere, and a testing playbook for each transport. | Complete |
| 40 | 040-hard-rules-sidecar/ | Move every rule, unchanged, into a `hard-rules.json` sidecar beside its SKILL.md, repoint every reader and test in the same change, and document where hard rules live, with enforcement identical before and after. | Complete |
| 41 | 041-code-readmes-and-routing-alignment/ | Give every code folder this packet created a README, and align the cli-classifier hub's and both modes' smart routing with the sk-create-skill canon, with every correct routing decision unchanged. | Complete |
| 42 | 042-label-drafting-and-confirmation/ | Fill the eleven label gates today's corpus can fill, run each zero-call gate, and record the blocked five and 028. | Complete |
| 43 | 043-label-finding-fixes/ | Fix the tool defects 042's labels found: 027's stop-rater gold and lineage filter, 003's goal-core evidence clamp, and 006's model arm. | Complete |
| 44 | 044-deem-answer-shape-fix/ | Make cli-deem read the answer shapes the real local Deem server sends, and make 027's and 026's scorers read judgment output at the `answers.answer` depth real cli-deem and jev print. | Complete |
| 45 | 045-deem-live-runs/ | Run every scorer's Deem arm once on the local Deem server and record each result, and close the three Deem findings 044 recorded. Stopped after 2 of 20 when the operator retired Deem. | Complete |
| 46 | 046-deem-deprecation/ | Remove `cli-deem` and every scorer's Deem arm so `cli-jev` is the only classifier, with `cli-classifier` kept as a parent hub for a future one. Four child phases. | Complete |
| 47 | 047-measure-every-jev-feature/ | Give each of the 15 features without a Jev measurement a live Jev verdict or a zero-call bound from confirmed labels, then resend the benefit overview. | Complete |
| 48 | 048-jev-feature-improvement-research/ | Research how to improve, refine and expand the ten kept or near-kept Jev features, one child each, with a DeepSeek and a Luna lineage. Ten child phases. | Complete |
| 49 | 049-jev-feature-improvement-build/ | Build the recommendations from 048's research that need no new labels, corpus or default-on switch, one child per feature, and fix the deep-research workflow faults 048 hit. Twelve child phases. | Complete |
| 50 | 050-pi-default-review/ | Make Pi the default Jev transport when it can answer, for choice and noul, then have a fresh Opus reviewer test, re-measure and fix the nine features with a measured gain or a near miss. Two child phases. | Complete |
| 51 | 051-followups/ | Build the follow-ups the 050 review left: 032 as a non-blocking check, Pi model and usage on records, the input-wrapping test, the 025 capture, 017 R8, and retiring 026, 029 and 031. | Complete |
| 52 | 052-unproven-feature-proof/ | Apply the 006 research to the three unproven features: one keep rule across their scorers with a strongest-policy bar and a class floor, a masked-state ablation for folder suggestion, a clarify census, and a proof plan per feature. | Complete |
| 53 | 053-retire-unproven-features/ | Retire spec-track narrowing, clarify default and folder suggestion: delete their scorers, tests, catalog entries, playbook scenarios and keep-rule gates, and remove every other mention outside spec folders. | Complete |
| 54 | 054-classifier-module-names/ | Move each kept Jev feature's code outside cli-classifier into a module named `classifier-` plus its host file, and rename the injection screen hook with the same prefix. | Complete |
| 55 | 055-alignment-and-hook-parity/ | Align the Jev code with sk-code-opencode, bring every README and env surface to current reality, and give each hook an adapter on every runtime that can carry it or a recorded reason where none can. | Complete |
| 56 | 056-codex-dispatch-and-checklist/ | Record Codex task dispatch as n/a from a captured spawn payload, make every Codex shell hook fire under the 0.160 `Bash` tool name, and bring the JavaScript checklist header rule to its style guide. | Complete |

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
| 008-cli-classifier-hub | 009-cli-jev-hub-move | The hub exists with `cli-deem` routed and 008 is Complete (D4 of `goal.md`, amended by the operator on 2026-09-29, so no Deem `keep` is needed) | `parent-skill-check` passes on the hub, a route replay sends a Deem prompt to `cli-deem` and `008-cli-classifier-hub/spec.md` says Status Complete |
| 009-cli-jev-hub-move | 010-trigger-index-search-fixes | Not a hard gate: 010 needs nothing from 009 and can start any time. Its first step reproduces the refused index rebuild | `generate-trigger-index.mjs` exits 1 with `refused: 2 document(s)` before the fix and exits 0 after it, and `validate.sh --strict` passes on 010 |
| 010-trigger-index-search-fixes | 011-spec-validator-fixes | Not a hard gate: 011 changes two validators that 010 does not touch | 010's and 011's Files to Change tables name no common file, and `validate.sh --strict` passes on both |
| 011-spec-validator-fixes | 012-sk-doc-validator-and-reference-fixes | Not a hard gate: 012 changes sk-doc validators and three playbook files that 011 does not touch | 011's and 012's Files to Change tables name no common file, and `validate.sh --strict` passes on both |
| 012-sk-doc-validator-and-reference-fixes | 013-sk-prompt-framework-docs | Not a hard gate: 013 changes only sk-prompt files | 012's and 013's Files to Change tables name no common file, and `validate.sh --strict` passes on both |
| 013-sk-prompt-framework-docs | 014-sk-design-doc-and-routing-check | Not a hard gate: 014 changes only sk-design files, and its gate change waits on the owner's choice | 014's `spec.md` records the owner's choice between the two gate options before any gate edit, and `validate.sh --strict` passes on 014 |
| 014-sk-design-doc-and-routing-check | 015-fanout-merge-and-steering-fixes | Not a hard gate: 015 changes only `system-deep-loop` fan-out files, and its diagnosis runs before its fix | 015's diagnosis names the dropped findings by lineage and round before any fix, and `validate.sh --strict` passes on 015 |
| 015-fanout-merge-and-steering-fixes | 016-deem-local-hardening | Not a hard gate: 016 plans operator decisions and changes nothing before the operator's yes | 016's `spec.md` records each option with its rollback and the operator's answer, and `validate.sh --strict` passes on 016 |
| 016-deem-local-hardening | 017-deem-search-narrowing-arm | 017 waits on 010's regenerated index and 008's `cli-deem` client, not on 016. Its Deem arm also needs a healthy local Deem (D1 of `goal.md`) | `lookup-trigger-index.mjs` returns `deem-local.md` with a nonzero score for "deem local server", `validate.sh --strict` passes on 008 and 010, and `deem-ctl status` passes its health check, which refuses the stub backend |
| 017-deem-search-narrowing-arm | 018-worktree-provision-shared-link | Not a hard gate on 017: 018 changes only `sk-git` provisioning files. The dependency runs the other way: 008's and 009's `parent-skill-check.cjs` checks cannot exit 0 in a freshly provisioned worktree until 018's fix lands, because `sk-doc/node_modules/@spec-kit/shared` is never linked | In a freshly provisioned worktree `parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK` and exits 0, 018's fixture test passes, and `validate.sh --strict` passes on 018 |
| 002-advisor-jev-tiebreak-arm | 019-advisor-suggested-order | 019 imports 002's exports read-only and takes 002's two `kill` verdicts as its prior. It also needs 008 and 009 Complete, so `cli-classifier` holds both modes, and the release that D3 of `goal.md` gave on 2026-09-29 | With logging `jev` and `cli-deem` stubs first on `PATH`, `score-suggested-order.mjs` prints holdout top-1 `53/70`, the advisor child p50 and p95 and the power line while the stubs log no call. `validate.sh --strict` passes on 019 |
| 009-cli-jev-hub-move | 020-routing-clarify-default | 008 and 009 are Complete, and D3 of `goal.md` released 020 on 2026-09-29. 020 and 021 both change `sk-create-skill`'s `SKILL.md`, README and changelog, so they build one after the other | With logging stubs first on `PATH`, `score-clarify-default.cjs` prints clarify counts per hub and per source while the stubs log no call, and `--score` on its unlabeled rows prints `stop: fewer than 30 labeled rows (<n> labeled)`. `validate.sh --strict` passes on 020 |
| 009-cli-jev-hub-move | 021-stage2-leaf-route-replay | 008 and 009 are Complete, and D3 of `goal.md` released 021 on 2026-09-29. It never builds beside 020, because both change `sk-create-skill`'s docs | With logging stubs first on `PATH`, `leaf-route-replay.cjs --report <dir>` prints per-hub leaf-set F1 and tied-row counts and `replay verdict: stop (prose arm covers 0 of <N> rows)` while the stubs log no call. `validate.sh --strict` passes on 021 |
| 009-cli-jev-hub-move | 022-alignment-folder-suggestion | 008 and 009 are Complete, and D3 of `goal.md` released 022 on 2026-09-29. It changes system-spec-kit's `SKILL.md`, README and changelog, as 026 and 031 do, so it builds when no other build is changing them. Its model arms wait on 30 labeled rows | With logging stubs first on `PATH`, `score-alignment-suggestion.ts --report <dir>` prints band counts per save path and the path replay's `alternatives listed:` lines while the stubs log no call. `validate.sh --strict` passes on 022 |
| 009-cli-jev-hub-move | 023-reply-harness-blinded-judge | 008 and 009 are Complete, and D3 of `goal.md` released 023 on 2026-09-29. Its model arms also wait on the operator's grades of at least 20 masked replies | With logging stubs first on `PATH`, `judge-agreement.mjs` over the three committed blind runs prints `masked: 42`, `distinct: 38`, `matched: 38` and `stop: fewer than 20 labeled replies` while the stubs log no call. `validate.sh --strict` passes on 023 |
| 009-cli-jev-hub-move | 024-hallucination-grader | 008 and 009 are Complete, and D3 of `goal.md` released 024 on 2026-09-29. It never builds beside 025, because both edit deep-improvement's docs and tests README. Its model arms wait on 30 labeled outputs with at least 5 of each class | `run-benchmark.cjs --grader jev` scores with the stub before the fix and exits 2 with the usage line after it. With logging stubs first on `PATH`, `score-d4-agreement.cjs` prints `allowlist: 0 of 21` and a `stop:` line while the stubs log no call. `validate.sh --strict` passes on 024 |
| 009-cli-jev-hub-move | 025-reviewer-verdict-fallback | 008 and 009 are Complete, and D3 of `goal.md` released 025 on 2026-09-29. It never builds beside 024. Its model arms wait on at least 12 labeled regex-miss outputs covering `pass`, `fail` and `block` | With logging stubs first on `PATH`, `score-verdict-fallback.cjs` prints `fixture cases: 8 hits: 8 misses: 0` and `stop: fewer than 12 labeled regex-miss outputs` while the stubs log no call. `validate.sh --strict` passes on 025 |
| 003-goal-verifier-jev-shadow | 026-completion-claim-audit | 003's 50-row fixture `verifier-labeled-set.jsonl` is 026's row source, read only, and 003 stays byte-identical. 026 also needs 008 and 009 Complete, and D3 of `goal.md` released it on 2026-09-29. Its model arms wait on 30 labeled turns with at least 5 of each class | With logging stubs first on `PATH`, `score-completion-claims.mjs --rows <003's fixture>` prints `rows: 50 fires: 4` and `stop: fewer than 30 labeled rows` with no row text while the stubs log no call. `validate.sh --strict` passes on 026 |
| 009-cli-jev-hub-move | 027-stop-second-rater | 008 and 009 are Complete, and D3 of `goal.md` released 027 on 2026-09-29. Its model arms wait on the operator's read of five lineages, and its doc steps run one after another with those of 028, 029 and 030 | With logging stubs first on `PATH`, `score-stop-rater.cjs` prints the lineage counts, the derived gold, the three zero-call methods and `no headroom` or `planned calls:` while the stubs log no call, and adding `--jev --deem` with no reads file prints `stop: fewer than 5 confirmed lineages`. `validate.sh --strict` passes on 027 |
| 027-stop-second-rater | 028-confirm-mode-stop-hint | 028 reads one 027 run's `report.json` and `calls.jsonl` and makes no model call in any mode. It can be built and tested on a fixture report first, and its verdicts wait on a 027 report whose label gate passed. D3 of `goal.md` released it on 2026-09-29 | `score-stop-hint.cjs --rater-report <027 dir>` prints one verdict line per signal column, or `stop: rater report has no confirmed gold` on an ungated report, and logging stubs record no call. `validate.sh --strict` passes on 028 |
| 009-cli-jev-hub-move | 029-p0-reread-order | 008 and 009 are Complete, and D3 of `goal.md` released 029 on 2026-09-29. Its model arms wait on 20 labeled P0 negatives, and its doc steps run one after another with those of 027, 028 and 030 | With logging stubs first on `PATH`, `score-severity-replay.cjs` prints `registries:`, `findings:`, `transitions:`, `p0 rows:`, `phrases:` and `labels needed:` while the stubs log no call. `validate.sh --strict` passes on 029 |
| 015-fanout-merge-and-steering-fixes | 030-fanout-merge-shadow-record | 015 changed `fanout-merge.cjs` in `7de30fb16f`, and 030 reads the merge through its exports and never edits it. 030 also needs 008 and 009 Complete, and D3 of `goal.md` released it on 2026-09-29. Its model arms wait on 40 labeled pairs with 10 cross-body ones, and its doc steps run one after another with those of 027, 028 and 029 | With logging stubs first on `PATH`, `score-fanout-pairs.cjs` prints `runs:`, `pairs:`, both class lines and `merge decisions:` while the stubs log no call, and `git diff --stat` on `fanout-merge.cjs` is empty. `validate.sh --strict` passes on 030 |
| 009-cli-jev-hub-move | 031-debug-next-check | 008 and 009 are Complete, and D3 of `goal.md` released 031 on 2026-09-29. Its model arms wait on an operator fixture of 30 labeled rows kept outside the repository, and Jev reads only the rows marked `jev_ok` | With logging stubs first on `PATH`, `score-debug-next-check.mjs` prints `seam: none` and `mined rows: 0` while the stubs log no call. `validate.sh --strict` passes on 031 |
| 009-cli-jev-hub-move | 032-citation-drift-scan | 008 and 009 are Complete, with the Jev contract now at `cli-classifier/cli-usage/SKILL.md`, and D3 of `goal.md` released 032 on 2026-09-29. Its model arms wait on 20 live labels beside the 20 constructed drifts | With logging stubs first on `PATH`, `cite-drift-scan.mjs` prints `citations=` and `dead=` lines and `stop: fewer than 40 labeled rows` while the stubs log no call. `validate.sh --strict` passes on 032 |
| 009-cli-jev-hub-move | 033-validator-residue-flagger | 008 and 009 are Complete, and D3 of `goal.md` released 033 on 2026-09-29. Its model arms wait on the operator's 100 labels over 50 finding-cited passages and 50 others | With logging stubs first on `PATH`, `score-residue-flagger.cjs` prints the finding-row census and `stop: fewer than 100 labeled rows` while the stubs log no call. `validate.sh --strict` passes on 033 |
| 009-cli-jev-hub-move | 034-hvr-reader-needed-lens | 008 and 009 are Complete, and D3 of `goal.md` released 034 on 2026-09-29. Its model arms wait on 150 labels, 50 per category, and on at least two categories that can still pass | With logging stubs first on `PATH`, `hvr_reader_lens.py` prints the census and `stop: fewer than 150 labeled rows` while the stubs log no call, and `test_hvr_scan.py` still prints `ALL PASS`. `validate.sh --strict` passes on 034 |
| 009-cli-jev-hub-move | 035-fetched-text-injection-screen | 008 and 009 are Complete, and D3 of `goal.md` released 035 on 2026-09-29. Its model arms wait on 60 natural labels and 30 planted sentences, and the fetch seam stays an open question | With logging stubs first on `PATH`, `score-injection-screen.mjs` prints the fetch and corpus censuses and `stop: fewer than 90 labeled rows` while the stubs log no call, and `git diff --stat .claude/settings.json .skilled/hooks` is empty. `validate.sh --strict` passes on 035 |
| 035-fetched-text-injection-screen | 036-sk-code-and-sk-doc-alignment | 019 to 035 are Complete, so the set of created files is fixed at `089693d899`. Code in the deep-loop, skill-advisor and spec-kit runtime trees is left to the session that owns those align packets | `verify_alignment_drift.py --check-exact-headers` prints `Errors: 0` on the staged scope, and the playbook, catalog, document and voice validators pass on the changed files |
| 036-sk-code-and-sk-doc-alignment | 037-pi-native-classifier-transport | 036 is Complete. The live comparison waits on the operator's yes, and any llama.cpp column waits on an install yes | The default run prints the census with no model call, and the approved run ends in one `verdict pi-transport:` line |
| 037-pi-native-classifier-transport | 038-pi-classifier-transport-integration | 037 is Complete with an `adopt` verdict for `choice`. Runtime-tree callers stay with their owners | With the switch off every changed caller prints the same bytes, and with it on the transport answers `choice` through Pi in stubbed tests |
| 038-pi-classifier-transport-integration | 039-hub-cleanup | 038 is Planned and waits for the rename | `cli-jev/SKILL.md` exists and the routing gates pass |
| 039-hub-cleanup | 040-hard-rules-sidecar | 039 is Complete, so the Jev packet path is final | No SKILL.md declares `hard_rules:` and the engine's verdicts match before and after |
| 040-hard-rules-sidecar | 041-code-readmes-and-routing-alignment | 040 is Complete and the hub's paths are final | Each README validates and its command passes, `ROUTER.md` is active and `parent-skill-check` passes with 0 warnings, and the routing probe keeps its correct rows |
| 041-code-readmes-and-routing-alignment | 042-label-drafting-and-confirmation | 041 is Complete, so the label files and scorers are at their final paths | Every fillable feature's zero-call gate prints its line or a recorded stop, and `validate.sh --strict` passes on 042 |
| 042-label-drafting-and-confirmation | 043-label-finding-fixes | 042 is Complete and its decisions logs record the defects | Each changed suite passes, the cross-family review leaves no open P0 or P1, and `validate.sh --strict` passes on 043 |
| 043-label-finding-fixes | 044-deem-answer-shape-fix | 043 is Complete and the operator asked for the fix | The cli-deem client gets a number or a known key from the local server for `noul`, `choice` and `score`, each changed suite passes, the cross-family review leaves no open P0 or P1, and `validate.sh --strict` passes on 044 |
| 044-deem-answer-shape-fix | 045-deem-live-runs | 044 is Complete, so the client reads real answers, and the operator asked for every Deem item | Every Deem scorer has a recorded run, no run shows an answer-shape error, the cross-family review leaves no open P0 or P1, and `validate.sh --strict` passes on 045 |
| 045-deem-live-runs | 046-deem-deprecation | 045 Complete, with its stopped runs superseded by its ADR-001 | `validate.sh --strict` on 045 |
| 046-deem-deprecation | 047-measure-every-jev-feature | 046 Complete and the operator asked for every feature to be measured | 15 result rows in 047's `results.md` and `validate.sh --strict` on 047 |
| 047-measure-every-jev-feature | 048-jev-feature-improvement-research | 047 Complete and the operator asked for research on every kept feature | `validate.sh --strict --recursive` on 048 |
| 048-jev-feature-improvement-research | 049-jev-feature-improvement-build | 048 Complete and the operator asked for a build phase per researched feature and for the workflow faults | `validate.sh --strict --recursive` on 049 |
| 049-jev-feature-improvement-build | 050-pi-default-review | 049 Complete and the operator asked for Pi as the default transport and a review of nine features | `validate.sh --strict --recursive` on 050 |
| 050-pi-default-review | 051-followups | [Criteria TBD] | [Verification TBD] |
| 051-followups | 052-unproven-feature-proof | 051 Complete and the operator asked to apply the 006 research and plan the proof tests | `validate.sh --strict` on 052 |
| 052-unproven-feature-proof | 053-retire-unproven-features | 052 Complete and the operator retired the three unproven features | `validate.sh --strict` on 053 |
| 053-retire-unproven-features | 054-classifier-module-names | 053 Complete and the operator asked for classifier names on the kept features' code | `validate.sh --strict` on 054 |
| 054-classifier-module-names | 055-alignment-and-hook-parity | 054 Complete and the operator asked for code, doc, env and hook-parity alignment | `validate.sh --strict` on 055 |
| 055-alignment-and-hook-parity | 056-codex-dispatch-and-checklist | 055 Complete with Codex task dispatch unverified and the checklist header rule at odds with its style guide | `validate.sh --strict` on 056 |
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
