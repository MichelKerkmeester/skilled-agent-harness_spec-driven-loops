---
title: "Feature Specification: Deprecate sk-prompt-models and convert sk-prompt into a standalone prompt-improvement skill"
description: "Phase parent: remove the sk-prompt-models workflow packet and its runtime consumers, then reclassify sk-prompt from a Class H parent hub to a Class S standalone skill while keeping the sk-prompt name and the /prompt:improve command."
trigger_phrases:
  - "008-sk-prompt-standalone-conversion"
  - "sk-prompt standalone"
  - "deprecate sk-prompt-models"
  - "sk-prompt hub to standalone"
  - "prompt-models deletion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/008-sk-prompt-standalone-conversion"
    last_updated_at: "2026-08-28T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the 8-phase decomposition and captured the pre-change gate baseline in phase 001"
    next_safe_action: "Author child phase specs, then execute 002-models-packet-deletion"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/sk-prompt-models/assets/model-profiles.json"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh"
      - ".opencode/bin/lib/compiled-routing/serving-closure.manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-sk-prompt-standalone-conversion-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "sk-prompt-models content is deleted outright, not relocated — operator decision 2026-08-28"
      - "The sk-prompt name and the /prompt:improve command are both retained"
      - "command-metadata.json is dropped; standalone skills bind commands from .opencode/commands/ (precedent: sk-design-md-generator, sk-communication)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Deprecate sk-prompt-models and convert sk-prompt into a standalone prompt-improvement skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | sk-prompt/008-sk-prompt-standalone-conversion |
| **Predecessor** | sk-prompt/007-sk-prompt-parent |
| **Successor** | None |
| **Handoff Criteria** | Every gate in the phase-001 baseline returns to exit 0 from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-prompt` carries two workflow packets behind one advisor identity, but only one of them is a prompt-engineering workflow. `sk-prompt-models` is a read-only per-model reference whose real consumer lives outside the hub, and the hub shape it forces costs four authored routing files, a stage-two router document, and a slot in the compiled-routing serving closure. The operator wants the small-model prompt-craft capability retired and the skill reduced to the one thing it actually does.

### Purpose
`sk-prompt` becomes a Class S standalone prompt-improvement skill that keeps its name and its `/prompt:improve` command, with the small-model prompt-craft capability and every machine consumer of it removed, and with all eight gates green from the final state.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deletion of the `sk-prompt-models` packet and every runtime, test, and CI consumer of its `model-profiles.json` registry
- Recapture of the routing-accuracy corpus pins and scorer-eval ratchet floors that the deletion moves
- Rewrite of the prompt-quality card-sync guard so its surviving checks point at a real canonical home
- Repointing of the `cli-external-orchestration` executor packets away from the deleted canonical card
- Reclassification of the `sk-prompt` root from Class H to Class S per the skill root metadata contract
- Withdrawal of `sk-prompt` from the compiled-routing serving closure and live-activation fence
- Refresh of the operator-facing docs that mandate or advertise the deleted capability

### Out of Scope
- Renaming `sk-prompt` — the name is retained deliberately
- Removing or altering `/prompt:improve` — the command survives the class change
- Relocating any `sk-prompt-models` content to another skill — the operator chose deletion over relocation
- Rewriting git history or touching remote branches
- Changes to the seven skill roots outside `sk-prompt` that the class gate already reports green

### Files to Change
Aggregate file scope. Per-phase detail lives in each child plan.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-prompt/sk-prompt-models/**` | Delete | 002 | The retired workflow packet |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts` | Modify | 002 | Remove the model-alias resolver branch |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Modify | 002 | Remove the parallel Python model-alias branch |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/fixtures/executor-delegation-cases.json` | Modify | 002 | Drop the `direct-alias-model` branch cases |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/holdout-prompts.jsonl` | Modify | 003 | Remove the two model-alias rows |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | 003 | Recapture hashes, holdout counts, delegation bucket |
| `specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture/baseline/routing-baseline.json` | Modify | 003 | Recapture the corpus sha256 pins |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modify | 004 | Drop CHECK 3 and CHECK 4; repoint CHECK 1 and CHECK 2 |
| `.github/workflows/prompt-card-sync.yml` | Modify | 004 | Update the guard's stated coverage |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | 004 | Update the prompt-knowledge path regex |
| `.opencode/skills/cli-external-orchestration/**` | Modify | 005 | Repoint 41 files away from the deleted canonical card |
| `.opencode/skills/sk-prompt/{mode-registry,hub-router,description,command-metadata}.json` | Delete | 006 | Forbidden on a Class S root |
| `.opencode/skills/sk-prompt/ROUTER.md` | Delete | 006 | Stage-two hub control document |
| `.opencode/skills/sk-prompt/sk-prompt-improve/**` | Modify | 006 | Flatten into the skill root |
| `.opencode/skills/sk-prompt/leaf-manifest.config.json` | Create | 006 | Required on a Class S root |
| `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json` | Modify | 007 | Remove sk-prompt from the hub closure |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/005-sk-prompt/**` | Delete | 007 | Hub rollout artifacts |
| `.opencode/bin/{compiled-route-guard,compiled-route-sync}.cjs` | Modify | 007 | Remove the hardcoded hub entries |
| `AGENTS.md` | Modify | 008 | Remove the small-model dispatch mandate |
| `README.md`, `.opencode/install-guides/README.md`, `.opencode/skills/README.txt` | Modify | 008 | Refresh the skill description |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-baseline-capture/ | Record the pre-change exit status of all eight gates as the negative control | Complete |
| 2 | 002-models-packet-deletion/ | Delete the packet and remove its advisor, fixture, and test consumers | Pending |
| 3 | 003-routing-baseline-recapture/ | Recapture corpus sha256 pins and scorer-eval ratchet floors | Pending |
| 4 | 004-card-sync-guard-rewrite/ | Drop CHECK 3 and 4, repoint CHECK 1 and 2, update CI and the pre-commit hook | Pending |
| 5 | 005-cli-orchestration-repoint/ | Repoint 41 cli-external-orchestration files off the deleted canonical card | Pending |
| 6 | 006-standalone-conversion/ | Flip the root from Class H to Class S and flatten the surviving packet | Pending |
| 7 | 007-compiled-routing-withdrawal/ | Remove sk-prompt from the serving closure and activation fence | Pending |
| 8 | 008-docs-and-final-gate/ | Refresh operator docs and re-run every gate from the final state | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume specs/sk-prompt/008-sk-prompt-standalone-conversion/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit
- Phases 002 and 003 are a coupled pair: the deletion in 002 knowingly reds the ratchet, and 003 is the only phase permitted to close it

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-baseline-capture | 002-models-packet-deletion | All eight gates recorded green with exit status captured | `scratch/baseline/*.txt` shows `exit=0` for each gate |
| 002-models-packet-deletion | 003-routing-baseline-recapture | Packet deleted; no source file resolves the deleted registry path | `rg -l 'sk-prompt-models' .opencode/skills/system-skill-advisor` returns no source hits |
| 003-routing-baseline-recapture | 004-card-sync-guard-rewrite | Ratchet and corpus gates green under recaptured pins | `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` exits 0 |
| 004-card-sync-guard-rewrite | 005-cli-orchestration-repoint | Guard runs with surviving checks only and exits 0 | `bash check-prompt-quality-card-sync.sh .` exits 0 |
| 005-cli-orchestration-repoint | 006-standalone-conversion | No cli-external-orchestration file references the deleted card | `rg -l 'cli-prompt-quality-card' .opencode/skills/cli-external-orchestration` returns nothing |
| 006-standalone-conversion | 007-compiled-routing-withdrawal | Root classifies as S with no forbidden files | `ci-skill-root-metadata.cjs` reports `[S] sk-prompt` and exits 0 |
| 007-compiled-routing-withdrawal | 008-docs-and-final-gate | Serving closure carries five hubs and the guard is green | `compiled-route-guard.cjs` exits 0 with no sk-prompt row |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the surviving `sk-prompt` root keep a `benchmark/` folder once it is no longer a hub, or does the standalone shape make the hub-routing benchmark reports dead evidence?
- Does `legacy-projection-manifest.ts` need its `model-benchmark-hub-output` surface removed outright, or repointed to a surviving benchmark path?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Predecessor packet**: See `../007-sk-prompt-parent/spec.md` for the hub this packet retires
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
