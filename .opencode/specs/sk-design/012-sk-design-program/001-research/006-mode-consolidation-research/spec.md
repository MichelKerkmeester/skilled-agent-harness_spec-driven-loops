---
title: "Feature Specification: sk-design mode-consolidation research"
description: "Deep research into consolidating sk-design from its seven-mode structure to a target four-mode set (interface, motion, md-generator, open-design transport), resolving the fate of foundations, audit, and the styles database."
trigger_phrases:
  - "sk-design mode consolidation"
  - "design mode bloat"
  - "reduce sk-design modes"
  - "styles database fate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/006-mode-consolidation-research"
    last_updated_at: "2026-07-24T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author mode-consolidation research charter"
    next_safe_action: "Run /deep:research (5 iters, gpt-5.6-sol xhigh standard) bound to this folder"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/styles/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Do foundations + audit fold into interface, into a shared layer, or stay as modes?"
      - "Where does the 7,812-file styles database live post-consolidation?"
      - "Do the four survivors remain hub-modes or become standalone skills?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-design mode-consolidation research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Leaf research packet |
| **Priority** | P1 |
| **Status** | Research pending — deep-research loop bound, not yet run |
| **Created** | 2026-07-24 |
| **Branch** | `sk-design/0103-structure-naming-cleanup` |
| **Parent Packet** | `sk-design/012-sk-design-program/001-research` |
| **Executor** | `cli-codex` · `gpt-5.6-sol` · `xhigh` · `standard` tier · 5 forced iterations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-design has grown to seven modes — interface, foundations, motion, audit, md-generator, the design-mcp-open-design transport, plus a large `styles` resource tree. The operator judges this as mode sprawl and bloat that is not utilized proportionally. The desired end-state is four modes: `design-interface`, `design-motion`, `design-md-generator`, and `design-mcp-open-design`.

The hard uncertainty is not the target list — it is what to do with the modes and assets the target drops: `design-foundations` (48 files), `design-audit` (70 files), and the `styles` database (7,812 files, produced by the 012 program). Some of that is genuine bloat; some is load-bearing capability whose loss would regress the design workflow. This research separates the two with evidence before any consolidation is planned or built.

### Purpose
Produce an evidence-backed consolidation decision: which capabilities survive, where the dropped modes' load-bearing parts fold, what becomes of the styles database, whether survivors stay hub-modes or become standalone skills, and a concrete, risk-assessed migration path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All seven current sk-design modes/assets and their utilization evidence (references invoked vs dead weight).
- The routing surfaces that bind them: `mode-registry.json`, `hub-router.json`, advisor metadata, the `/interface:*` commands.
- The 7,812-file `styles` database and its adapter (legacy/shadow/persistent).
- The shared contract layer (`shared/`) and how consolidation reshapes it.

### Out of Scope
- Executing the consolidation (this packet only researches; a build packet follows).
- The design *taste*/quality doctrine itself (not a mode-count question).
- The external Figma / refero / mobbin transports owned by `mcp-tooling`.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-mode-consolidation-research/research/` | Create | Iteration state, deltas, logs (deep-research loop) |
| `006-mode-consolidation-research/research.md` | Create | Converged synthesis + recommendation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Research Questions

1. **Foundations fate** — Which `design-foundations` capabilities (color/OKLCH, typography, spacing, tokens, data-viz) are load-bearing for interface work, and do they fold into `design-interface`, into `shared/`, or stay? Is foundations a genuine separate job or an interface sub-step?
2. **Audit fate** — Is `design-audit` (anti-slop, WCAG, quality scoring) a distinct workflow that must survive as a mode, fold into interface as a polish gate, or become a shared procedure the survivors call?
3. **Styles-database fate** — What happens to the 7,812-file `styles` tree: shared resource under the hub, folded into `md-generator`, extracted to its own asset package, or retained as-is? What does the adapter (legacy/shadow/persistent) imply for the move?
4. **Utilization evidence** — Per mode and per reference/asset, what is actually invoked vs dead weight? Ground the "bloat" claim in routing/usage signals, not intuition.
5. **Topology** — Do the four survivors remain hub-modes (registry + hub-router) or become standalone skills? What does each choice cost in advisor routing, discoverability, and maintenance?
6. **Migration plan** — A concrete, ordered, risk-assessed consolidation path (what moves where, what breaks, what speaks the old contract, rollback), sized so a follow-up build packet can execute it.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Five forced iterations complete; `research/deep-research-state.jsonl` records route-proof fields per iteration.
- `research.md` synthesizes a ranked, evidence-cited recommendation answering all six questions, with an explicit confidence/ceiling per claim.
- Each dropped mode (foundations, audit) and the styles DB has a decided fate with rationale and named rollback risk.
- `validate.sh --strict` on this packet → Errors:0.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Synthesized Findings

- Keep a four-mode `sk-design` hub: interface, motion, md-generator, and the Open Design transport.
- Fold foundations into an interface-owned subworkflow and retain `/interface:foundations` until observed usage supports removal.
- Extract audit as a standalone skill while retaining `/interface:audit` and the `design-audit` reviewer identity during migration.
- Keep `styles/` as a shared, non-mode hub package behind its existing query/hydration facade; production invocation frequency remains unknown.
- Execute the six gated stages in `research/research.md`; each topology change has a stage-local rollback and must pass before the next begins.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Five immutable lineage iteration and delta pairs | Synthesis cannot be reproduced if lineage evidence changes | Hash all ten files before and after synthesis and reject any mutation |
| Dependency | Fan-out merge and resource-map reducers | Root synthesis can omit registry findings or cited paths | Run focused reducer regressions and verify canonical output counts |
| Risk | Structural reachability is mistaken for production utilization | Consolidation decisions may overstate measured use | Keep invocation-frequency limits explicit in the synthesis |
| Risk | Synthesis copies or renumbers lineage artifacts | Evidence provenance and iteration identity become ambiguous | Consume lineage paths in place and reject any root or sixth iteration |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- **Determinism:** stable lineage ordering must produce byte-identical canonical and compatibility registries.
- **Provenance:** every consumed delta file remains visible with its lineage label in `resource-map.md`.
- **Reproducibility:** synthesis must be recoverable from checked lineage state without manually authoring `research.md`.
- **Safety:** research execution must not modify `sk-design` implementation files.

## 8. EDGE CASES

- An existing but empty root registry is reconstructed from direct lineage state rather than treated as authoritative emptiness.
- Duplicate delta basenames in different lineages remain distinct inputs through their full lineage-relative paths.
- A malformed delta row is skipped with degraded evidence instead of corrupting merged registry state.
- Re-entering synthesis at the hard iteration cap must not create `iteration-006.md` or `iter-006.jsonl`.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Scope | 12/25 | Six research questions spanning routing, workflows, styles, and migration consumers |
| Risk | 12/25 | Consolidation can remove load-bearing design capabilities if evidence is incomplete |
| Research | 16/20 | Five forced evidence iterations and cross-surface synthesis are required |
| Coordination | 8/15 | Research output feeds a separate Level 3 implementation packet |
| **Total** | **48/100** | **Level 2 research packet with workflow-owned synthesis** |

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What observed alias-use threshold would justify future removal of `/interface:foundations` or `/interface:audit`? **Open: requires production telemetry outside this packet.**
- Does `design-md-generator` need structural separation beyond its current packet boundary? **Resolved: no change without a measured coupling defect.**
- Should styles move from the hub-shared facade? **Resolved: retain the existing facade and shared location.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Research theme parent:** `../spec.md`.
- **Program parent + retrospective:** `../../spec.md`, `../../retrospective.md`.
- **Prior style-DB / commands research this extends:** `../001-research-style-database/`, `../002-research-design-commands/`.
- **Current mode surface under study:** `.opencode/skills/sk-design/mode-registry.json`.
