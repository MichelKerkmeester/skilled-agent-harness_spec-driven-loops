---
title: "Feature Specification: system-code-graph uplift (skill usefulness + marketing README + sk-doc 1:1 alignment)"
description: "Three-phase uplift of the system-code-graph skill: SKILL.md/references polish, marketing-voice README rewrite, and exhaustive sk-doc validate_document.py 1:1 alignment. 20-iter deep-research with cli-devin SWE 1.6 informs the children."
trigger_phrases:
  - "029 system-code-graph uplift"
  - "system-code-graph marketing readme"
  - "sk-doc 1:1 alignment system-code-graph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/009-system-code-graph-uplift-phase-parent"
    last_updated_at: "2026-05-16T10:27:00Z"
    last_updated_by: "main_agent"
    recent_action: "Locked 5 post-research decisions D1-D5 in spec.md §5"
    next_safe_action: "Start child 001 plan from research.md §10 + D2 + D4"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000029"
      session_id: "029-scaffold"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Placement? Top-level under system-spec-kit at 029"
      - "Voice rule for README? Hybrid (root-README structure + HVR-clean prose)"
      - "Phase shape? Parent + 3 implementation children scaffolded after research"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: merge/migration narratives, heavy docs (plan/tasks/checklist/decision/impl-summary).
  REQUIRED: root purpose, sub-phase list, what needs done.
-->

# Feature Specification: system-code-graph Uplift

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (parent: 005-code-graph) |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization/005-code-graph` |
| **Predecessor** | `system-spec-kit/028-system-code-graph-doc-alignment` |
| **Successor** | None (final uplift before downstream skill consumers stabilize) |
| **Handoff Criteria** | 20-iter deep-research converges with `research/research.md` synthesized; 3 children scaffolded from findings; each child ships through its own validate gate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-code-graph` skill ships a runtime that works but a doc surface that under-sells it. Three gaps remain after packet 028's tool-count and topology reconciliation: `INSTALL_GUIDE.md` retained three drift lines (`:49` `1.0.0.0`, `:56` `10 tools`, `:195` `10 tools`); the README opens with implementation prose instead of a problem hook that mirrors the Public root README and system-spec-kit README; and no exhaustive 1:1 pass against sk-doc's `validate_document.py --type <type>` has been run across every authored doc. Operators reading the skill cold get a technical map without a reason to care, and per-doc-type validation drift can hide until the next packet rediscovers it.

### Purpose
Land a single phased uplift that fixes the remaining drift, rewrites the README in a problem-first marketing arc that still passes HVR, and validates every authored doc 1:1 against the sk-doc per-type contract. Deep research at the parent level produces a synthesized `research/research.md` that the three implementation children consume as their evidence base.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 20-iter deep-research (cli-devin SWE 1.6) at the parent root, scoped to the unified uplift question
- Three implementation children scaffolded post-research:
  - `001-skill-docs-install-guide-and-readmes-polish/` — SKILL.md + references + per-folder mcp_server READMEs + INSTALL_GUIDE drift fixes
  - `002-readme-problem-first-rewrite/` — README rewrite in problem→solution→mechanism arc with HVR ≥85
  - `003-sk-doc-type-validation-alignment/` — exhaustive `validate_document.py --type <type>` exit-0 across all authored docs
- Parent-level lean trio (spec + description + graph-metadata) + resource-map authored before research dispatch

### Out of Scope
- Source-code changes under `mcp_server/` (runtime is correct; this is doc work)
- HVR cleanup of the Public root README or system-spec-kit README (separate packet if found drifted)
- Re-running packet 028's tool-count/topology fixes (already shipped at commit `a7b9b8ae8`)
- Implementation execution of the three children — they scaffold and execute as follow-on work after research synthesis

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modify | 001 | Add problem-hook framing to WHEN_TO_USE; HVR pass |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modify | 001 | Lines 49/56/195 drift fixes |
| `.opencode/skills/system-code-graph/references/*.md` | Modify | 001 | HVR pass + 1:1 sk-doc alignment |
| `.opencode/skills/system-code-graph/mcp_server/**/README.md` | Modify | 001 | Usefulness audit + 1:1 sk-doc alignment |
| `.opencode/skills/system-code-graph/README.md` | Modify | 002 | Marketing-voice rewrite (hybrid: root-README arc + HVR-clean prose) |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modify | 003 | 1:1 sk-doc playbook validation |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | Modify | 003 | 1:1 sk-doc playbook validation |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modify | 003 | 1:1 sk-doc validation (no dedicated type; passes as reference) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `research/` (workflow-owned) | 20-iter deep-research with cli-devin SWE 1.6; synthesizes `research.md` informing children | Complete (20 iters, 939 findings, 550-line research.md) |
| 001 | `001-skill-docs-install-guide-and-readmes-polish/` | SKILL.md hook framing, references HVR, mcp_server per-folder README usefulness audit, INSTALL_GUIDE drift fixes | Not Scaffolded |
| 002 | `002-readme-problem-first-rewrite/` | README rewrite in problem→solution→mechanism arc; HVR ≥85 | Not Scaffolded |
| 003 | `003-sk-doc-type-validation-alignment/` | `validate_document.py --type <type>` exit-0 across every authored doc | Not Scaffolded |

### Phase Transition Rules

- Phase 000 (research) MUST converge (or hit iter 20) before any child scaffolds
- Each phase MUST pass `validate.sh --strict` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 000-research | 001/002/003 scaffold | `research/research.md` exists with 17 sections; convergence or iter 20 reached | `wc -l research/research.md > 200`; `jq` on `research/deep-research-state.jsonl` shows ≥20 iteration records OR stop-reason=converged |
| 001 | 002 | All SKILL.md/references/mcp_server READMEs pass `validate_document.py --type <type>`; INSTALL_GUIDE drift cleared | `grep -nE "1\.0\.0\.0\|10 (tools\|MCP tools)" INSTALL_GUIDE.md` returns 0 hits; per-doc validate exits 0 |
| 002 | 003 | README HVR score ≥85; problem→solution→mechanism arc visible | `validate_document.py README.md --type readme --json` returns `hvr_score >= 85` |
| 003 | Packet close | Every authored doc in the skill validates 1:1 against its per-type contract | Manifest of `(file, --type)` pairs all exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None at parent level. Five post-research operating decisions are locked in §5 below.
<!-- /ANCHOR:questions -->

---

## 5. POST-RESEARCH DECISIONS LOCKED

These parameters were confirmed by the operator after research synthesis and govern all three children:

| # | Question | Decision | Applies To |
|---|----------|----------|------------|
| D1 | Marketing voice strictness vs HVR ≥85 floor | Accept resemblance to exemplar READMEs. Allow stylistic carries from Public root + system-spec-kit READMEs even where they nick HVR. Do not enforce strict HVR pass-bar on the marketing rewrite. | Child 002 |
| D2 | plugin_bridges/README.md rewrite scope | Targeted alignment, not full rewrite. Make it work and ensure 100% alignment with current source code. Patch the drifted import paths and any factual inaccuracies; preserve existing structure. | Child 001 |
| D3 | Per-feature + per-scenario validation depth | Validate manually for ALL files. Every `feature_catalog/01--*/*.md` and `manual_testing_playbook/01--*/*.md` per-feature/per-scenario doc gets `validate_document.py` run against it. No sampling. | Child 003 |
| D4 | Useful-gap primer size budget | Match the scale set by similar docs in `system-spec-kit/`. Check sibling primers/glossaries in system-spec-kit references and feature_catalog for the right length. Do not invent a new budget. | Child 001 (SKILL.md hook, references gaps) |
| D5 | Child execution order | Sequentially: 001 → 002 → 003. Each ships and validates before the next begins. No parallel dispatches. | All children |

---

<!-- /ANCHOR:questions placeholder removed; questions anchor pair closed above -->

---

## RELATED DOCUMENTS

- **Phase children**: To be scaffolded post-research as `001-*/`, `002-*/`, `003-*/`
- **Predecessor packet**: `.opencode/specs/system-spec-kit/028-system-code-graph-doc-alignment/`
- **Resource map**: See `resource-map.md` in this folder
- **Research output**: To be synthesized at `research/research.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
