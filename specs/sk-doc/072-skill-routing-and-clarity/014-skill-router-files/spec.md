---
title: "Feature Specification: Skill Router Files"
description: "Every SKILL.md carries its machine router inline, which takes 22% of all SKILL.md words and leaves three skills within 25 words of the 5,000-word cap. This phase moves each machine router into a sibling ROUTER.md so the skill body keeps its budget for its own rules."
trigger_phrases:
  - "skill router files"
  - "sibling router md"
  - "machine router out of skill md"
  - "phase 14 skill router files"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files"
    last_updated_at: "2026-10-29T21:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Closed phases 006 and 009 and the 13 per-skill alignment phases"
    next_safe_action: "Build 015-routing-data-alignment"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill Router Files

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/269-skill-router-files` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/072-skill-routing-and-clarity |
| **Predecessor** | 013-mcp-tooling-routing-canon |
| **Successor** | None |
| **Handoff Criteria** | Every skill and mode keeps its machine router in a sibling `ROUTER.md`, the checks enforce it, and routing accuracy holds at its baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every SKILL.md ends with a `## MACHINE ROUTER` section, and that section loads whenever the skill does. Across the 54 skills and modes it is 39,159 of 176,952 words, 22%, with a median of 627 words per skill and 59% of system-skill-advisor. system-spec-kit (4,999 words), sk-design-md-generator (4,997) and mcp-mobbin (4,981) sit against the 5,000-word cap, so they cannot take a new rule. Much of the section is pseudocode that scripts read, such as router replay, compiled routing and the leaf manifest, and the agent does not need it in context on every load.

The two recorded reasons for keeping it inline are tooling limits: router replay reads the router from SKILL.md and falls back only to `references/*.md`, and the router-reach check reads only hub roots. Rule RS-004 then forbids a packet `ROUTER.md`.

### Purpose
Each skill and mode keeps its machine router in a sibling `ROUTER.md`. SKILL.md keeps short Smart Routing prose and a pointer, the tooling reads the new file, and routing accuracy holds.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research the tooling, canon and runtime-loading facts that decide the design, in three deep-research iterations.
- Teach every reader of the machine router to read a sibling `ROUTER.md`.
- Change the routing-shape checks, the canon docs and the create-skill templates to the new shape.
- Fold each hub's MACHINE ROUTER into the `ROUTER.md` it already has.
- Move every mode packet's and standalone skill's machine router into its own `ROUTER.md`.
- Regenerate every derived file and prove routing accuracy against the baseline.

### Out of Scope
- Changing what any skill routes to. The move changes where the router lives, not its decisions.
- The skills' own rule content beyond the router move.

### Files to Change
Set per phase from the research findings; each child's `spec.md` lists its files.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/**/SKILL.md`, `**/ROUTER.md` | Modify/Create | 004, 005 | The router move |
| Router readers and checks | Modify | 002, 003 | Read and enforce the new shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Three Luna iterations on RQ-1 to RQ-5 and one DeepSeek iteration on RQ-6: every reader of the machine router, how each runtime loads a skill, the advisor changes and the design that keeps accuracy | Complete |
| 2 | 002-router-file-tooling/ | One shared resolver for a sibling `ROUTER.md` with a SKILL.md fallback. Router replay, router sync, the dead-route scan and the Hermes generator use it, and the advisor freshness signature, its plugin copy and the daemon watcher see `ROUTER.md` | Complete |
| 3 | 003-check-and-template-canon/ | RS-004 reversed, RS-005 rewritten to require a pointer, RS-002 restated so a section left in SKILL.md fails, the root-router gate widened, a known-debt ledger; both shape checks, the templates, the create-skill workflows and the canon docs | Complete |
| 4 | 004-hub-router-merge/ | Each hub's MACHINE ROUTER joins its existing root `ROUTER.md` | Complete |
| 5 | 005-packet-and-standalone-migration/ | The 47 mode packets and standalone skills each get their own `ROUTER.md`, in batches, until the debt ledger is empty | Complete |
| 6 | 006-regeneration-and-verification/ | Regenerate every derived file, recapture the advisor baseline, compare replay projections and regenerate the per-skill token table | Pending |
| 7 | 007-ai-systems-research/ | Three DeepSeek research iterations over the 16 skills in the AI Systems repository: what each router holds, what loads them, which checks read them and how a Claude Project receives the router | Complete |
| 8 | 008-ai-systems-migration/ | Each AI Systems skill gets its own `ROUTER.md` and a link in SKILL.md, and its Claude Project knowledge files follow | Complete |
| 9 | 009-ai-systems-verification/ | The AI Systems checks pass, every router resolves and the Claude Project mirrors match their skills | Complete |
| 10 | 010-align-cli-classifier/ | An operator-local alignment check over cli-classifier after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 11 | 011-align-cli-external-orchestration/ | An operator-local alignment check over cli-external-orchestration after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 12 | 012-align-cli-orca/ | An operator-local alignment check over cli-orca after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 13 | 013-align-mcp-code-mode/ | An operator-local alignment check over mcp-code-mode after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 14 | 014-align-mcp-tooling/ | An operator-local alignment check over mcp-tooling after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 15 | 015-align-sk-code/ | An operator-local alignment check over sk-code after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 16 | 016-align-sk-design/ | An operator-local alignment check over sk-design after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 17 | 017-align-sk-doc/ | An operator-local alignment check over sk-doc after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 18 | 018-align-sk-git/ | An operator-local alignment check over sk-git after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 19 | 019-align-sk-prompt/ | An operator-local alignment check over sk-prompt after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 20 | 020-align-system-deep-loop/ | An operator-local alignment check over system-deep-loop after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 21 | 021-align-system-skill-advisor/ | An operator-local alignment check over system-skill-advisor after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |
| 22 | 022-align-system-spec-kit/ | An operator-local alignment check over system-spec-kit after the move: the check battery, four review lanes, routing probes and a critic, then a fix lane for every upheld finding that changes no routing, and a recheck against the worktree | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-router-file-tooling | The research names every router reader and recommends one design | `research/research.md` lists each reader with a file:line |
| 002-router-file-tooling | 003-check-and-template-canon | Every reader resolves a sibling `ROUTER.md` | The reader tests pass with a fixture in the new shape |
| 003-check-and-template-canon | 004-hub-router-merge | The checks enforce the new shape behind a debt ledger | Both routing-shape suites pass |
| 004-hub-router-merge | 005-packet-and-standalone-migration | Every hub passes the new shape | `parent-skill-check` 12b passes on every hub |
| 005-packet-and-standalone-migration | 006-regeneration-and-verification | Every skill and mode passes the new shape with an empty ledger | `package_skill.py --strict` passes on every skill |
| 003-check-and-template-canon | 007-ai-systems-research | The canon and the scaffold write the new shape, so the second repository has a target to move to | Both routing-shape suites pass. Phases 007 to 009 do not wait on 004 to 006 |
| 007-ai-systems-research | 008-ai-systems-migration | The research names a target shape for each of the 16 skills and the Claude Project path | `research/research.md` answers RQ-1 to RQ-5 |
| 008-ai-systems-migration | 009-ai-systems-verification | Every AI Systems skill has its router in `ROUTER.md` and a link from SKILL.md | Each skill resolves `router-md` through the resolver, or `none` for a table-form router that declares no `INTENT_SIGNALS`, `RESOURCE_MAP` or `DEFAULT_RESOURCE` assignment; none resolves `skill-md` or `dual-declaration` (amended 2026-10-29: eight AI Systems routers are tables, and each resolved `none` before the move too) |
| 009-ai-systems-verification | 010-align-cli-classifier | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 010-align-cli-classifier | 011-align-cli-external-orchestration | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 011-align-cli-external-orchestration | 012-align-cli-orca | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 012-align-cli-orca | 013-align-mcp-code-mode | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 013-align-mcp-code-mode | 014-align-mcp-tooling | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 014-align-mcp-tooling | 015-align-sk-code | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 015-align-sk-code | 016-align-sk-design | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 016-align-sk-design | 017-align-sk-doc | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 017-align-sk-doc | 018-align-sk-git | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 018-align-sk-git | 019-align-sk-prompt | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 019-align-sk-prompt | 020-align-system-deep-loop | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 020-align-system-deep-loop | 021-align-system-skill-advisor | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |
| 021-align-system-skill-advisor | 022-align-system-spec-kit | The previous skill's fixes are applied and its recheck failures are each fixed or classified as derived, pre-existing or by design | The previous phase folder passes `validate.sh --strict` and its routers parse the same as HEAD |

### Follow-up Work Recorded by the Alignment Phases

The alignment phases found items this packet may not fix, because the packet decision is that no skill routes differently after the move and the completion criteria hold the routing numbers fixed. Each item has a home that is built once this packet closes:

- **Routing data.** Vocabulary in `graph-metadata.json` intent signals, aliases and weights in `hub-router.json`, the sk-prompt `NO_LOAD_INTENTS` wiring, the sk-design-diagram theming route and the mcp-notion routing gold go to `../015-routing-data-alignment/`. That phase changes routing on purpose, records a new scorer and replay baseline, and refutes the items a review found to be correct behavior: cli-classifier D-05, mcp-tooling D-09, the sk-git router-reach allowlist entry and the YAML-frontmatter half of sk-prompt D-03.
- **Reference format debt.** 56 tracked references fail the reference format at the base commit, 34 of them in sk-design-diagram (no `## 1. OVERVIEW`, lowercase numbered H2s). They go to `specs/sk-doc/074-reference-template-debt/`, which renumbers each file's sections and its section references with one script and changes no routing.

<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which runtimes load files beside SKILL.md on their own, and does any of them load `ROUTER.md` without being told to? Phase 001 answers it.
- Does the agent need any of the machine router in context, or only the scripts? Phase 001 answers it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
