---
title: "Feature Specification: deep-context reference-architecture alignment"
description: "The deep-context skill ships only two flat reference files and a non-canonical smart-router, while its mature siblings (deep-research, deep-review, deep-ai-council) use subfoldered references and the canonical router; this phase aligns deep-context's reference layout and router to deep-research's pattern without changing loop behavior."
trigger_phrases:
  - "deep-context references"
  - "reference architecture alignment"
  - "smart router alignment"
  - "reference subfolders"
  - "sibling reference parity"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/004-reference-architecture-alignment"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped reference reorg + canonical router + citation sweep (e73ffe6610)"
    next_safe_action: "None; phase complete. Optional: later test-pattern fix for 2 stale greps"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/references/convergence/convergence.md"
      - ".opencode/skills/deep-context/references/protocol/loop_protocol.md"
    session_dedup:
      fingerprint: "sha256:db845e0d74e2f0decc7e374fefdc3ca128789fc7e931a977111fcaf95099955f"
      session_id: "dc-134-004-20260607"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mirror deep-research's 4-subfolder layout (convergence/ guides/ protocol/ state/), not deep-ai-council's"
      - "MOVE the two flat references into subfolders rather than keep root copies"
      - "Keep new references lean and cross-linked to the existing feature_catalog, no duplication"
---
# Feature Specification: deep-context reference-architecture alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The deep-context skill is the fourth deep loop, but its reference layer never matured to match `deep-research`, `deep-review`, and `deep-ai-council`. It ships only two flat reference files (`references/convergence.md`, `references/loop_protocol.md`) and a smart-router whose `INTENT_SIGNALS` use a bare keyword list rather than the canonical `{weight, keywords}` shape, with `ALWAYS` pinned to `loop_protocol.md` instead of an operator quick-reference. This phase aligns deep-context to the canonical sibling pattern: it moves the two flat files into subfolders, authors eight new lean references mirroring deep-research's `convergence/ guides/ protocol/ state/` layout, rewrites `SKILL.md` §2 SMART ROUTING to the canonical pattern, trims §3 to pointers, and sweeps roughly 62 citations of the old flat paths to the new subfolder paths.

**Key Decisions**: full mirror that MOVES the two flat files into subfolders (the siblings have no root-level reference files); mirror deep-research's four-subfolder layout (`convergence/ guides/ protocol/ state/`) rather than deep-ai-council's (`patterns/ scoring/ structure`) because deep-context is a gather loop like research; keep the new references lean and cross-linked to the existing `feature_catalog/` rather than duplicating it (deep-context uniquely ships a feature_catalog the siblings lack).

**Critical Dependencies**: deep-research's reference layout as the structural template; the `sk-doc` smart-router resilience template and per-doc-type structure validators; the `deep-loop-runtime` source surface (loop YAML, `convergence.cjs`, `coverage-graph-signals.ts`, `reduce-state.cjs`, `loop-lock.cjs`) the new references extract from; the skill-advisor graph and its `graph-metadata.json` schema.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `134-deep-context-gathering` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-context skill is structurally behind its three mature siblings. Its `references/` directory holds exactly two flat files (`convergence.md`, `loop_protocol.md`), where `deep-research` organizes its references into `convergence/`, `guides/`, `protocol/`, and `state/` subfolders, and `deep-review` and `deep-ai-council` are likewise subfoldered. Its `SKILL.md` §2 SMART ROUTING uses a non-canonical router: `INTENT_SIGNALS` carry a bare keyword list instead of the canonical `{weight, keywords}` shape, `RESOURCE_MAP` points at the two flat files, `LOADING_LEVELS` pins `ALWAYS` to `loop_protocol.md` rather than an operator quick-reference, and there is no consolidated `ON_DEMAND` set. The result is a router that diverges from the shared resilience template, a reference layout that cannot grow cleanly, and a skill whose structure does not read as a peer of the loops it sits beside.

### Purpose
Bring deep-context's reference layout and smart-router to structural parity with `deep-research` so the skill is navigable, growable, and recognizably a peer loop, while changing zero loop behavior: every move, new reference, and router rule is documentation-and-routing only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Reference moves**: `references/convergence.md` → `references/convergence/convergence.md`; `references/loop_protocol.md` → `references/protocol/loop_protocol.md`.
- **New convergence references**: `references/convergence/convergence_signals.md` (the 5 signals + composite weights + thresholds), `references/convergence/convergence_recovery.md` (blocked-stop + stuck recovery), `references/convergence/convergence_graph.md` (coverage-graph stop path: `loop_type='context'` node kinds/relations + `evaluateContext`).
- **New state references**: `references/state/state_format.md` (packet file hub), `references/state/state_jsonl.md` (JSONL record types), `references/state/state_outputs.md` (dashboard / Context Report / iteration markdown), `references/state/state_reducer_registry.md` (`reduce-state.cjs` ownership + dedup/agreement + atomic / jsonl-repair / post-dispatch-validate).
- **New guide reference**: `references/guides/quick_reference.md` (operator cheat sheet, the new `ALWAYS` baseline).
- **SKILL.md §2 rewrite**: canonical `INTENT_SIGNALS {weight, keywords}`, `RESOURCE_MAP` → new subfolder paths, `LOADING_LEVELS` with `ALWAYS = references/guides/quick_reference.md` + an `ON_DEMAND` set, shared helper functions, and `UNKNOWN_FALLBACK_CHECKLIST`. §3 HOW IT WORKS trimmed to pointers.
- **README.md structure update**: reference count, structure tree, and reference-table paths updated to the subfoldered layout.
- **Citation sweep**: roughly 62 occurrences of the old flat paths (`references/convergence.md`, `references/loop_protocol.md`) across README, `feature_catalog/**`, `manual_testing_playbook/**`, `commands/deep/start-context-loop.md` + the two `deep_start-context-loop_*.yaml` workflows, and `agents/deep-context.md`, rewritten to the new subfolder paths.
- **Metadata regen**: regenerate the deep-context skill `graph-metadata.json` and reindex the skill advisor so the new reference paths resolve.

### Out of Scope
- Any change to loop runtime behavior, convergence math, dispatch, or the reducer logic - this phase is documentation-and-routing only; the `.cjs` scripts and runtime helpers are unchanged.
- New references beyond the eight listed - deep-research's extra `convergence_reference_only.md`, `guides/capability_matrix.md`, and `protocol/spec_check_protocol.md` are not part of deep-context's gather-loop need and are excluded.
- Removing or rewriting the `feature_catalog/` - it stays the implementation-reality source; the new references cross-link to it rather than absorbing it.
- Adopting deep-ai-council's `patterns/ scoring/ structure` layout - rejected in favor of the research-shaped layout (see decision-record ADR-002).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-context/references/convergence/convergence.md` | Move | From `references/convergence.md` |
| `.opencode/skills/deep-context/references/protocol/loop_protocol.md` | Move | From `references/loop_protocol.md` |
| `.opencode/skills/deep-context/references/convergence/convergence_signals.md` | Create | 5 signals + composite weights + thresholds; cross-links `feature_catalog/04` |
| `.opencode/skills/deep-context/references/convergence/convergence_recovery.md` | Create | Blocked-stop + stuck recovery; cross-links `feature_catalog/04` |
| `.opencode/skills/deep-context/references/convergence/convergence_graph.md` | Create | `loop_type='context'` node kinds/relations + `evaluateContext`; cross-links `feature_catalog/06` |
| `.opencode/skills/deep-context/references/state/state_format.md` | Create | Packet file hub; cross-links README packet layout |
| `.opencode/skills/deep-context/references/state/state_jsonl.md` | Create | JSONL record types |
| `.opencode/skills/deep-context/references/state/state_outputs.md` | Create | Dashboard / Context Report / iteration markdown |
| `.opencode/skills/deep-context/references/state/state_reducer_registry.md` | Create | `reduce-state.cjs` ownership; cross-links `feature_catalog/03`,`05`,`07` |
| `.opencode/skills/deep-context/references/guides/quick_reference.md` | Create | Operator cheat sheet; new `ALWAYS` baseline |
| `.opencode/skills/deep-context/SKILL.md` | Modify | §2 canonical router rewrite; §3 trimmed to pointers; §5/§9 reference tables repathed |
| `.opencode/skills/deep-context/README.md` | Modify | Reference count, structure tree, reference-table paths |
| `.opencode/skills/deep-context/feature_catalog/**` | Modify | Old-flat-path citations repathed |
| `.opencode/skills/deep-context/manual_testing_playbook/**` | Modify | Old-flat-path citations repathed |
| `.opencode/commands/deep/start-context-loop.md` | Modify | Old-flat-path citations repathed |
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Modify | `references_map` paths repathed |
| `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml` | Modify | `references_map` paths repathed |
| `.opencode/agents/deep-context.md` | Modify | Old-flat-path citations repathed |
| `.opencode/skills/deep-context/graph-metadata.json` | Modify | Regenerated key_files / reference paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Two flat references moved into subfolders | `references/convergence/convergence.md` and `references/protocol/loop_protocol.md` exist; no `references/convergence.md` or `references/loop_protocol.md` remains at the root |
| REQ-002 | Eight new references authored from real source | All eight files exist under `convergence/`, `state/`, and `guides/`; each is extracted from the loop YAML / scripts / runtime and passes the sk-doc structure validator |
| REQ-003 | SKILL.md §2 rewritten to the canonical router | `INTENT_SIGNALS` use `{weight, keywords}`; `RESOURCE_MAP` points only at new subfolder paths; `LOADING_LEVELS` sets `ALWAYS = references/guides/quick_reference.md` and defines an `ON_DEMAND` set; `UNKNOWN_FALLBACK_CHECKLIST` retained |
| REQ-004 | Zero old-flat-path citations remain | `rg "references/convergence\.md\|references/loop_protocol\.md"` over the deep-context sweep scope returns zero hits (excluding this spec folder and other skills' own files) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | New references cross-link, do not duplicate, the feature_catalog | Each new reference cross-links its `feature_catalog/0N` counterpart and carries no copied implementation prose; a reviewer confirms no duplication |
| REQ-006 | README structure reflects the subfoldered layout | README reference count, structure tree, and reference-table paths all show the new subfolders; no flat-path remains |
| REQ-007 | Skill graph + advisor resolve the new paths | `graph-metadata.json` regenerated; the advisor reindex completes and resolves deep-context with the new reference paths |
| REQ-008 | Loop behavior unchanged | `deep-loop-runtime` vitest suite passes; no `.cjs` or runtime helper edited; the move/rewrite is documentation-and-routing only |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find references -type f` on deep-context lists the subfoldered layout (`convergence/` with 4 files, `protocol/` with 1, `state/` with 4, `guides/` with 1) and no root-level reference file.
- **SC-002**: A whole-tree grep for the two old flat paths returns zero hits in the deep-context sweep scope; the SKILL.md router resolves every `RESOURCE_MAP` path against the new inventory.
- **SC-003**: The `sk-doc` structure validator passes on every new reference and on the rewritten `SKILL.md`; the `deep-loop-runtime` vitest suite stays green; the advisor reindex resolves deep-context.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A missed citation leaves a dangling flat path | Med - broken reference link | Citation-completeness check (`rg` returns zero) is a P0 gate before completion |
| Risk | New references duplicate feature_catalog content | Med - drift between two sources | ADR-003 mandates lean + cross-linked; a no-duplication review item gates it |
| Risk | Router rewrite breaks path resolution | Med - skill loads wrong/no resource | Router path-resolution check resolves every `RESOURCE_MAP` entry against the new inventory |
| Risk | Stale skill-advisor graph after the move | Low - advisor resolves old paths | Regenerate `graph-metadata.json` and reindex the advisor as a closing step |
| Dependency | deep-research reference layout | High - structural template | Mirror its `convergence/ guides/ protocol/ state/` shape directly |
| Dependency | sk-doc structure validators | Med - gate every new doc | Author each reference to the matching sk-doc template before validating |
| Dependency | deep-loop-runtime source surface | Med - reference accuracy | Extract each reference from the loop YAML / scripts / runtime, not from memory |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rewritten router keeps `ALWAYS` to a single lean `quick_reference.md` load and defers the full reference set to `ON_DEMAND`, so a typical invocation reads one small file rather than the whole reference set.

### Security
- **NFR-S01**: The router's `_guard_in_skill` path guard is preserved so only in-skill markdown resources are routable; the move and rewrite add no path-traversal surface.

### Reliability
- **NFR-R01**: The reference move is loss-free: the two moved files keep their content verbatim, and the citation sweep guarantees every consumer points at the moved location, so no reader hits a missing reference.

---

## 8. EDGE CASES

### Data Boundaries
- A consumer that referenced a heading anchor inside a moved file (e.g. `convergence.md#stop-contract`) must keep the anchor valid; the move preserves in-file headings, so only the path prefix changes.
- deep-research's reference set is a superset (it has `convergence_reference_only.md`, `capability_matrix.md`, `spec_check_protocol.md`); deep-context authors only the eight in scope and the router's `ON_DEMAND` lists only what exists.

### Error Scenarios
- A new reference cannot be sourced cleanly from the runtime: it links to the authoritative `feature_catalog/0N` counterpart instead of inventing detail, keeping the reference lean and accurate.
- The advisor reindex fails: the move and rewrite still stand; reindex is re-runnable and is the final, idempotent step.
<!-- ANCHOR not required for sections 7-10 -->

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | 2 moves + 8 new references + SKILL.md rewrite + README + ~62 citations across 8+ files |
| Risk | 10/25 | Documentation-and-routing only; no runtime behavior change; main risk is a missed citation |
| Research | 12/20 | Extract 8 references accurately from the loop YAML, scripts, runtime, and the feature_catalog |
| Multi-Agent | 4/15 | Single-surface skill alignment; no multi-agent coordination |
| Coordination | 10/15 | Coordinated edits across skill docs, command docs, workflow YAMLs, agent doc, and metadata |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A missed citation leaves a broken flat-path link | M | M | P0 citation-completeness gate (`rg` returns zero in sweep scope) |
| R-002 | New references drift from / duplicate the feature_catalog | M | M | ADR-003 lean + cross-link rule; no-duplication review item |
| R-003 | Router rewrite resolves to a missing resource | M | L | Router path-resolution check against the new inventory |
| R-004 | Loop behavior accidentally changed | H | L | No `.cjs`/runtime edit; vitest regression guard stays green |

---

## 11. USER STORIES

### US-001: Navigable, growable reference layout (Priority: P0)

**As a** maintainer of the deep loops, **I want** deep-context's references organized into the same `convergence/ guides/ protocol/ state/` subfolders as deep-research, **so that** I can find and extend a reference the same way across every loop.

**Acceptance Criteria**:
1. Given the deep-context `references/` tree, When I list it, Then it matches deep-research's subfolder shape and has no root-level reference file.

### US-002: Canonical router with a lean first touch (Priority: P1)

**As an** operator invoking the skill, **I want** the smart-router to load a single quick-reference by default and the deeper references only on matching intent, **so that** a routine invocation is lean and a deep one still pulls the right resources.

**Acceptance Criteria**:
1. Given the rewritten §2 router, When the skill is invoked with no strong intent, Then it loads `references/guides/quick_reference.md` as the `ALWAYS` baseline and offers the `UNKNOWN_FALLBACK_CHECKLIST` when scope is unstated.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None open. The layout target (deep-research), the move-vs-keep decision, and the lean-cross-link rule are settled in the decision record; the remaining work is execution of the move, the eight references, the router rewrite, and the citation sweep.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase Parent**: `../spec.md` (deep-context loop phase parent)
- **Sibling Phase**: `../002-runtime-robustness-parity/spec.md` (the runtime parity phase, structural template for this doc set)
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Decision Records**: `decision-record.md`
