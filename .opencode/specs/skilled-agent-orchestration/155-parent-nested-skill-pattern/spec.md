---
title: "Feature Specification: Parent skill with nested sub-skills — define and optimize the pattern"
description: "Turn deep-loop-workflows (the framework's first parent skill with nested mode packets, created by the 152 merge) into the clean reference implementation of a reusable architectural pattern — 'a parent skill that routes to nested sub-skills' — then research, benchmark, document (sk-doc), and tool (a /create command) that pattern. Phase 1 fixes the user's four-folder rename and records the shared/ boundary decision; later phases run 15-iteration deep research, implement the research-chosen routing model, and formalize."
trigger_phrases:
  - "parent skill with nested sub-skills"
  - "deep-loop-workflows nested skill pattern"
  - "parent skill routing optimization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern"
    last_updated_at: "2026-06-15T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded parent; phase 001 rename-fix done and being documented"
    next_safe_action: "Land phase 001 then run the 15-iteration pattern research"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/ (the parent skill under study)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-parent-nested-skill-pattern"
      parent_session_id: null
    completion_pct: 25
    open_questions:
      - "Routing/identity model A/B/C/D — deliberately open, resolved by the phase-2 research"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Parent skill with nested sub-skills — define and optimize the pattern

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Handoff Criteria** | Phase 001 lands the rename-fix + shared/ decision; the pattern research (phase 2) recommends a routing/identity model with benchmarks before any parent rework; phases 3–4 are research-gated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 152 epic merged five deep-loop skills into one `deep-loop-workflows` skill structured as a thin hub `SKILL.md` + `mode-registry.json` + five internal mode packets, with the packets deliberately **non-discoverable** (one advisor identity). That made `deep-loop-workflows` the framework's **first parent skill with nested sub-skills**. The operator then **renamed four packet folders** to carry the `deep-` prefix that matches each packet's own `SKILL.md` `name:` (`context→deep-context`, `research→deep-research`, `review→deep-review`, `improvement→deep-improvement`; `ai-council` left as-is). This (a) **broke the path references the 152 build had wired to the bare names**, and (b) crystallized a one-off structure into something the operator wants to turn into a **deliberate, advisor-optimized, documented and tooled architectural standard**. A core finding sharpens the optimization target: `mode-registry.json` — the nominal "single source of truth" — is **not actually consumed by the advisor**; routing is hardcoded in Python (`skill_advisor.py` `DEEP_ROUTING_MODE_BY_KEY`) and TypeScript (`aliases.ts` `DEEP_MODE_BY_CANONICAL`) and can drift from the registry.

### Purpose
Make `deep-loop-workflows` the clean reference implementation of a reusable framework pattern — **"a parent skill that routes to nested sub-skills"** — then research, benchmark, document, and tool that pattern. The work is sequenced: Phase 1 makes the renamed structure consistent and working again and records the `shared/` boundary decision; Phase 2 runs a 15-iteration deep-research sweep (fully open on the routing/identity model) and recommends a design with benchmarks; Phase 3 implements the research-chosen model (expected: make routing registry-driven to close the hardcode-drift gap); Phase 4 formalizes the pattern in `sk-doc`, ships a routing/discovery benchmark, and ships a `/create:parent-skill` scaffolder.

> **Phase-parent note:** This `spec.md` is the only authored document at the parent level (lean trio: `spec.md` + `description.json` + `graph-metadata.json`). Per-phase planning, tasks, checklists, and decisions live in the phase children. The 15-iteration research evidence lands at the parent level under `research/` (mirroring the 152 epic's `research/` evidence directory), not as a numbered phase child.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Phase 1 (done, being documented):** fix the four-folder rename across all live surfaces (registry packet keys, command YAML assets, `deep-loop-runtime/scripts/fanout-run.cjs`, hub `graph-metadata.json`/`SKILL.md`/`README.md`, per-packet internal docs); record the `shared/`-stays decision.
- **Phase 2:** a 15-iteration deep-research run (10× `gpt-5.5-fast --variant xhigh` read-only seats + 5× `opus-4.8` via `claude2`) on how to define and optimize a parent skill with nested sub-skills, resolving the routing/identity model and the registry-driven-routing question, with adversarial verification against the real advisor code.
- **Phase 3 (research-gated):** implement the recommended routing/identity model; keep `tests/routing-parity-deep-*.vitest.ts` green (or migrate them deliberately if a different model wins).
- **Phase 4:** `sk-doc/references/skill_creation.md` §21 + parent-skill hub/registry templates; a routing/discovery benchmark dogfooded through `deep-loop-workflows`'s own `skill-benchmark` mode; a `/create:parent-skill` scaffolder (+ optional `/doctor:parent-skill` validator).

### Out of Scope
- Any behavior change to a deep-loop mode's convergence math, state shape, artifacts, or tool-permissions — the 152 merge froze byte-identical per-mode parity; this epic touches **routing identity, documentation, and tooling only**.
- Moving `shared/` into `deep-loop-runtime` (decided NO in phase 001 — see that phase's `decision-record.md`).
- Reintroducing any MCP tool to `deep-loop-runtime` (its MCP-free boundary stays frozen) or adding an `improvement` `loopType` to the runtime convergence engine.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Phase 1 is an executed child spec folder; the 15-iteration research (phase 2) is parent-level evidence under `research/`; phases 3–4 are research-gated and scaffolded as children when picked up.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-rename-fix-and-shared-decision/` | Fix the four-folder rename refs across the repo; record the `shared/`-stays decision | Complete |
| 2 | `research/` (parent-level evidence) | 15-iteration deep research on the parent-nested-skill pattern (10× gpt-5.5-fast xhigh + 5× opus-4.8) → `research/research.md` + adversarial verification | Pending |
| 3 | `002-…` (research-gated) | Implement the research-chosen routing/identity model (expected: registry-driven routing); hold routing-parity fixtures green | Pending |
| 4 | `003-…` | Formalize: `sk-doc` §21 + parent-skill templates + routing/discovery benchmark (dogfooded) + `/create:parent-skill` | Pending |

### Phase Transition Rules
- Each numbered phase child MUST pass `validate.sh --strict` independently before the next begins.
- The parent `spec.md` tracks aggregate progress via this map; `graph-metadata.json.derived.last_active_child_id` points resume at the active phase.
- Phase 3's concrete file changes are genuinely research-gated: this plan commits to the **process**, not a pre-decided routing model.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | research | Zero broken `deep-loop-workflows/{old}/` refs in live surfaces; packet scripts resolve; registry/JSON valid; `shared/` decision recorded | `validate.sh --strict` green on `001`; broken-ref grep returns 0 |
| research | 002 | `research/research.md` present + validates; a clear recommended model + benchmark plan; top recommendations adversarially verified against the advisor code | `research/research.md` validates; recommendation is citable |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Routing/identity model (deliberately open):** A) one-identity + registry-driven routing, B) discoverable nested packets (each with `skill_id==folder` `graph-metadata.json`), C) derived mode-hints, D) hybrid. Resolved by the phase-2 research with benchmarks **before** any parent rework. Option B is known to break `tests/routing-parity-deep-*.vitest.ts`; the research must weigh that.
- **Registry-driven routing:** should `skill_advisor.py` + `aliases.ts` **read** `mode-registry.json` instead of hardcoding the mode map (closing the hardcode-drift gap)? This is the central optimization question.
- **`ai-council` folder ≠ `SKILL.md` name mismatch:** accepted now under one-identity (the operator locked "keep `ai-council`"); the research may revisit naming/discovery conventions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: sub-folders `[0-9][0-9][0-9]-*/` for per-phase docs (001 is authored; 002–003 scaffolded when picked up).
- **Research** (phase 2): `research/research.md` — the converged recommendation, routing-model decision, registry-driven design, conventions, and benchmark plan (created during phase 2).
- **The parent skill under study**: `.opencode/skills/deep-loop-workflows/` (hub `SKILL.md` + `mode-registry.json` + five mode packets + non-discoverable `shared/`).
- **The frozen backend**: `.opencode/skills/deep-loop-runtime/` (MCP-free; `shared/` does NOT move into it — see phase 001 decision-record).
- **Predecessor epic**: `../152-deep-loop-workflows/` — the merge that created the parent skill.
