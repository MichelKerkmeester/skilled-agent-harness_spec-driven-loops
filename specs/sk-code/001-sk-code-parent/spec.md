---
title: "Feature Specification: sk-code parent skill"
description: "Establish sk-code as the parent hub for a family of focused, independently-invokable code sub-skills — folding sk-code-review in as a mode — with the family's composition decided by research and context evidence before any build."
trigger_phrases:
  - "sk-code parent skill"
  - "code skill family"
  - "sk-code sub-skills"
  - "sk-code-review fold-in"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "124 parent-hub canon program complete; phases 001-019 done, parent rolled up"
    next_safe_action: "Close the 124 goal; sk-code re-baseline handed to the rename follow-up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: sk-code parent skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `main` (dedicated `system-speckit/124-sk-code-parent` recommended before build phases) |
| **Parent Spec** | None (root) |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | `117-parent-nested-skill-pattern` (governing pattern); `119-parent-skill-native-invocability` |
| **Successor** | Active child phases listed below |
| **Handoff Criteria** | Each child phase validates independently; parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Code capability is split across two mature-but-uncoordinated skills. `sk-code` (v3.5) is a strong **flat** skill: a surface-aware smart router that detects the active surface (WEBFLOW / OPENCODE / MOTION_DEV) and then walks a phase pipeline (research → implement → quality gate → debug → verify). `sk-code-review` (v1.5) is a separate findings-first review baseline that is *already coupled* to `sk-code` for surface evidence. There is no parent identity that organizes code work under one hub, so: (1) the two skills collide in the advisor (observed this session: `sk-code` 0.88 vs `sk-code-review` 0.85 — an unresolved ambiguity), (2) discovery of the right code lane is ad hoc, and (3) a two-axis router (surface × activity) lives inside one monolithic `SKILL.md` that is hard to extend with new stacks or a dedicated verify/debug lane.

### Purpose
Establish `sk-code` as the **parent hub** for a family of focused, independently-invokable code sub-skills (modes), folding `sk-code-review` in as one mode — mirroring the parent-nested-skill pattern already shipped for `sk-design` (see `design/008-sk-design-parent`). The mode taxonomy (activity lanes vs surface lanes vs hybrid) and the structural model are decided by **evidence first**: a combined deep-research + deep-context pass (phase 001) precedes any build, and every build phase gates behind a human review of that research output.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, blast-radius inventories, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A research- and context-driven **mode taxonomy** for the `sk-code` family (which code sub-skills it contains).
- A **structural decision** for the parent (single hub with nested packets, per the 117 pattern and the sk-design reference).
- Standing up the `sk-code` hub and the code modes the research finalizes.
- Folding `sk-code-review` in as a mode (its findings doctrine, checklists, and playbooks preserved).
- Family-wide routing, validation, and **advisor + skill-graph single-identity integration** (the hub becomes one advisor identity; the former standalone review identity is retired or aliased).
- Repointing every dependent surface: commands, agents (`.opencode` / `.claude` / `.codex`), skill/agent/command YAML frontmatter, READMEs, governance docs, feature catalogs, and deep-loop references.

### Out of Scope
- The code-judgment *content* authored inside each mode is owned by that mode's own phase, not this parent. This parent organizes; it does not rewrite standards.
- CLI executors (`cli-opencode`, `cli-claude-code`) and transports remain separate tools — they are the HOW of dispatch, not code-judgment modes.
- Skills unrelated to code work (`sk-git`, `sk-doc`, `sk-design`, etc.) change only where they reference these two skills.

### Files to Change
Per-phase detail lives in each child's `plan.md`; the authoritative blast-radius inventory is produced in `001-research-and-context/`. Summary for audit trail only:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research-and-context/research/` | Create | 001 | Deep-research + deep-context artifacts (taxonomy, structural model, blast-radius map) |
| `.opencode/skills/sk-code/` | Restructure | 003–006 | Flat skill → parent hub (`SKILL.md`, `mode-registry.json`, `hub-router.json`, `shared/`, per-mode child folders) |
| `.opencode/skills/sk-code-review/` | Migrate / Retire | 005 | Content moved into the `sk-code` `code-review` mode packet; folder retired |
| `.opencode/skills/sk-code-review/graph-metadata.json` | Delete | 005/007 | Deletion de-registers the standalone advisor identity — the advisor **directory-scans** and keys identity off `graph-metadata.json` presence (no flat registry). Merge its keywords into the hub node; regenerate `skill-graph.json` via `advisor-rebuild` (never hand-edit) |
| `.opencode/agents/{code,review,orchestrate,deep-review,ai-council}.md` (+ `.claude` mirror) | Update | 007 | The **real dispatch surface** (no slash command loads these skills). Repoint to hub + `code-review` mode. Note: `deep-review.md` hardcodes the `review_core.md` absolute path |
| `.opencode/commands/speckit/assets/*.yaml`, governance (`CLAUDE.md`, `AGENTS.md`), feature catalogs, deep-loop refs | Update | 007 | `cross_skill_authoring_load` blocks + references to the two skills |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. The arc below is the **initial proposal**; phases 001–002 may refine the downstream shape.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research-and-context/` | Deep-research (mode taxonomy + structural model + migration strategy) **and** deep-context (current-state map + full blast-radius inventory). RESEARCH GATE. | complete (awaiting review) |
| 002 | `002-architecture-decision/` | Bind the mode taxonomy, the hub/registry/router shape, the `sk-code-review` fold-in, the advisor single-identity + native-invocability plan, and the cutover/rollback strategy. | complete (decision recorded) |
| 003 | `003-scaffold-hub/` | Stand up the `sk-code` hub shell (thin `SKILL.md`, `mode-registry.json`, `hub-router.json`, `shared/`, changelog, 5 mode-packet skeletons) + one preserved advisor identity. `command-metadata.json` deferred to 007 (no `/code:*` command surface yet). No content moved yet. | **complete** |
| 004 | `004-onboard-implement/` | Relocate flat `sk-code` content (128 files) into `shared/` + the four `code-*` mode packets; repoint internal links (deterministic pass, 0 broken). Mode contracts authored in 006. | **complete** |
| 005 | `005-foldin-review/` | Fold `sk-code-review` into the `code-review` mode (cohesive move); DELETE its `graph-metadata.json` (de-register); doctrine preserved verbatim; legacy `sk-code-review` alias kept in registry/router/graph-metadata until 009. | **complete** |
| 006 | `006-build-remaining-modes/` | Distribute the pre-hub flat doctrine into the four `code-*` mode contracts (implement=Phase 0/1, quality=Phase 1.5, debug=Phase 2, verify=Phase 3 non-mutating); mirror sk-design shape; registry-exact tool surfaces; consume shared detection. Per-mode playbooks/changelogs deferred. | **complete** |
| 007 | `007-advisor-and-integration/` | Repoint all live references broken by the 004 relocation + 005 fold via a ground-truth deterministic sweep (77 files; restored the silently-broken pre-commit hygiene gate); merge review keywords into the hub advisor node + clean dangling sk-code-review edges (alias kept). Advisor-rebuild/reindex → main; alias-covered NAME refs (agent prose + speckit `baseline:`) → 009. | **complete** |
| 008 | `008-routing-benchmark-and-review/` | Deterministic router-mode benchmark + three-lens family deep-review (zero real router defects); re-layered the shared skill-benchmark harness for thin hubs + fixed its negative-scoring (honest verdict 44 to 71), restored a merge-blocking Iron-Law canary, fixed four cheap defects. Deferred to 009: 8 pre-existing harness-test migrations, parent-hub-vocab-sync generalization, CS-003 matcher. | **complete** |
| 009 | `009-cutover-and-rollout/` | **Branch:** verified cleanup (8 harness migrations, vocab-sync generalization, CS-003 matcher, 29-path smart_routing fix) + 2 fold-broken live fixes. **Review pass:** canonical-scoped `parent-skill-check.cjs` (it failed BOTH non-canonical hubs 10× each; all three hubs now pass in-branch), added the `reviewer` keyword, corrected runbook ordering. **Main-side rollout (runbook in 009/implementation-summary.md):** atomic advisor-rebuild — sk-code-review scorer removal (TS+Python), skill-graph regen + reindex, 4 alias-site deletions, ~350 NAME-ref repoints, version release. Split because the load-bearing cutover can't run in the worktree (no compiled dist). | branch complete · main-side rollout pending |
| 010 | `010-plugin-tui-fix/` | Fix the goal-plugin TUI regression surfaced during cutover. | complete |
| 011 | `011-hub-canon/` | Establish the parent-hub canon (checks 1-9): sk-doc templates, `parent_hub_router_schema.md`, fail-loud vocab-sync, doctor YAML, scaffolder gates. | complete |
| 012 | `012-spec-kit-relocation/` | Relocate spec-kit assets to their canonical home. | complete |
| 013 | `013-sk-code-two-axis-restructure/` | Restructure sk-code into the two-axis hub (5 workflow modes x 3 surface packets); vocab-sync RED to GREEN. | complete |
| 014 | `014-close-out-and-tail/` | Close the tractable code tail: review-mode alignment, three scorer fixes, rename-invariants. | complete |
| 015 | `015-sk-design-canon-alignment/` | Bring sk-design to full canon (packetKind, real-file changelog, description.json, verified playbook, Lane-C baseline). Second canon-clean hub. | complete |
| 016 | `016-sk-code-content-coherence/` | Verify sk-code content coherence and reference integrity; refresh stale metadata placeholders. | complete |
| 017 | `017-canon-hardening/` | Harden the canon: bundleRules alignment and placeholder-tail resolution. | complete |
| 018 | `018-deep-loop-canon-alignment/` | Bring deep-loop-workflows to full canon (description, playbook, benchmark, registry, router, real-file changelog). Third canon-clean hub. | complete |
| 019 | `019-benchmarks-and-promotion/` | Final gate: cross-hub Lane-C baselines, promote parent-skill-check checks 5-9 WARN to FAIL, roll up the 124 parent. | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- **Research gate:** phases 002+ begin only after a human reviews the 001 research + context output.
- **Architecture gate:** build phases 003+ begin only after the user approves the 002 architecture decision.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Decision-ready taxonomy + structural-model recommendation + blast-radius map exist for human review | child strict validation + parent recursive validation |
| 002 | 003 | Architecture decision record approved (taxonomy, hub shape, fold-in, advisor + native-invocability plan, cutover/rollback) | child strict validation + user approval |
| 003 | 004 | Hub shell validates and is natively invocable with no content regressions | child strict validation |
| 004 | 005 | Current `sk-code` behavior preserved behind the hub `implement` mode | child strict validation + routing spot-check |
| 005 | 006 | `sk-code-review` behavior preserved as the `review` mode; standalone retire/alias staged | child strict validation |
| 006 | 007 | All finalized modes complete and independently invocable | child strict validation |
| 007 | 008 | Advisor single-identity live; all dependent surfaces repointed | child strict validation + advisor routing check |
| 008 | 009 | Benchmark + deep-review P0/P1 remediated | child strict validation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

All resolved during execution and bound in the phase children:

- **Mode taxonomy / verify + debug lanes** — activity lanes under a `code-` mode prefix, with surface smart-routing retained **inside** `implement`; verify and debug are first-class modes. Bound in 001-002; built in 003-006.
- **Review-mode folder naming** — the clean `code-review` form (folder == packetSkillName, no grandfather), matching sk-design. Bound in 002; folded in 005.
- **Two-axis mapping** — hub-shared surface detection with per-mode activity packets; realized in the 013 two-axis restructure.
- **`sk-code-review` advisor identity** — retired into the single hub identity (legacy alias kept through 009). Bound in 002; landed in 007.
- **Dedicated feature branch** — work landed on `system-speckit/028-memory-search-intelligence` per operator direction.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Authoritative pattern contract**: `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` (the living spec); templates in `.opencode/skills/sk-doc/assets/skill/`
- **Governing packets**: `../117-parent-nested-skill-pattern/`, `../119-parent-skill-native-invocability/`, `../118-frontmatter-versioning/`
- **Reference implementation (worked example)**: `../../design/008-sk-design-parent/` (the sk-design family — 45 phases, same pattern)
- **Scaffolder**: `.opencode/commands/create/sk-skill-parent.md` (`create:sk-skill-parent`) — PLAN-WORKFLOW LOCK: use it, do not hand-roll the hub
- **Hub validator**: `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (11 invariant checks the migrated hub must pass)
- **Target skills**: `.opencode/skills/sk-code/` (v3.5, flat), `.opencode/skills/sk-code-review/` (v1.5, standalone)
- **Hub reference**: `.opencode/skills/sk-design/` (`SKILL.md`, `mode-registry.json`, `hub-router.json`, `shared/`)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
