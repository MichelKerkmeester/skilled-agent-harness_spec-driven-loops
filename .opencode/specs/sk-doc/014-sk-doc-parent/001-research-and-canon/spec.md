---
title: "Feature Specification: Research and canon conformance (30-iteration deep research)"
description: "Run the 30-iteration deep research over the deepResearchAngles to settle every open packet-boundary and migration question before any file moves. Re-verify the canon two-axis definition against sk-code/sk-design/deep-loop live registries; confirm sk-doc is WOR"
trigger_phrases:
  - "sk-doc research and canon"
  - "125 research and canon"
  - "sk-doc parent phase 001"
importance_tier: "normal"
contextType: "research"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/001-research-and-canon"
    last_updated_at: "2026-07-06T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "30-iter GPT-5.5 research done; research.md synthesized"
    next_safe_action: "Human review 001; approve 002 architecture"
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
# Feature Specification: Research and canon conformance (30-iteration deep research)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SCAFFOLD: placeholder phase child of skilled-agent-orchestration/125-sk-doc-parent; plan/tasks/implementation-summary authored when the phase is worked (post-001). -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (scaffold; target complexity in parent map) |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | none (entry phase) |
| **Successor** | `002-architecture-decision/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Run the 30-iteration deep research over the deepResearchAngles to settle every open packet-boundary and migration question before any file moves. Re-verify the canon two-axis definition against sk-code/sk-design/deep-loop live registries; confirm sk-doc is WORKFLOW-ONLY with a shared/ backbone and ZERO named extensions; validate the impact-map's ~40 coupling targets still exist and enumerate the exact facade set that yields zero external edits. Produce evidence-backed rulings on the coin-flips (benchmark keep-vs-fold, changelog keep-vs-fold, command fold-target, agent+command merge, feature-catalog+playbook merge, doc-quality routable-vs-backbone, flowchart disposition). Read-only: NO sk-doc mutations in this phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- research.md — findings per deep-research angle with file:line evidence
- resolved packet-boundary table (final count 6 vs 8, each verdict with rationale)
- facade/coupling matrix: every external ref → preserve-facade vs explicit-repoint decision
- canon-conformance checklist vs parent-skill-check.cjs checks 1,2,3,5-9
- input dossier for 002 architecture-decision

### Out of Scope
- Work owned by another phase in the parent Phase Documentation Map.
- Rewriting doc-type doctrine content (this program moves content, it does not rewrite standards).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/` | TBD | Enumerated from the 001 deep-research rulings when this phase is worked |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | research.md — findings per deep-research angle with file:line evidence | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | resolved packet-boundary table (final count 6 vs 8, each verdict with rationale) | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | facade/coupling matrix: every external ref → preserve-facade vs explicit-repoint decision | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | canon-conformance checklist vs parent-skill-check.cjs checks 1,2,3,5-9 | Deliverable exists and validates; canon invariants preserved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase deliverables complete with evidence; `validate.sh` passes for this folder.
- **SC-002**: Zero external-coupling breakage introduced by this phase (facades resolve).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 deep-research rulings | This phase's scope may shift | Do not start build work before 001 + 002 gates clear |
| Risk | Over-decomposition / canon drift | Medium | Enforce the 124/022 packet test; one graph-metadata.json; symlinks inward |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Bound to the parent `spec.md` §4 and settled by the 001 deep research.
<!-- /ANCHOR:questions -->


---

## RESEARCH ANGLES

The 30-iteration loop rotates through these distinct angles (>=3 in parallel; broaden/shift on early convergence):

1. Packet-boundary stress test (124/022 bar): apply the distinct-lifecycle / distinct-output-contract / distinct-tool-permissions test to each provisional packet (benchmark, changelog, command) and each merge candidate (agent+command→create-component; feature-catalog+playbook→create-validation-package). Decide the final workflow-packet count (leanest defensible ~6 vs operator's 8) with per-packet evidence, not volume alone.
2. Shared-vs-packet script placement: prove which scripts are truly universal backbone (extract_structure/validate_document/quick_validate/frontmatter-version/check-frontmatter-versions/validate-doc-model-refs) vs artifact-type-specific (init_skill+package_skill→create-skill, audit_readmes→create-readme). Avoid both backbone pollution and cross-packet reach-arounds; get the split right per script or the symlinks tangle.
3. Symlink facade topology for zero external edits: design the exact facade set (root scripts/, references/skill_creation/, assets/frontmatter_templates.md, and the check-markdown-links allowlist) that preserves the ~151 external READMEs, the 3 sibling-hub method-doc citations, the /doctor import, the pre-commit hook, and the council matrix. Enforce canonical-in-shared / symlink-inward; verify no reverse symlinks and no cyclic links.
4. doc-quality core placement: is doc-quality a routable advisor-visible WORKFLOW packet (sk-design-audit analog, 'improve/score this existing doc') or pure shared backbone the hub absorbs? Does it warrant a /doc:quality command? Where do optimization.md / hvr_rules.md / quick_reference.md / workflows.md live — shared authoring vocabulary vs doc-quality-owned procedure?
5. Command rebinding strategy + self-hosting sequencing: per /create:* YAML, choose facade-preserve vs explicit-repoint; design the ATOMIC ordering that keeps parent_skill_* templates + method docs readable at their old path until the repoint lands, since /create:sk-skill-parent consumes the very templates that scaffold this hub (circular self-hosting hazard).
6. Advisor + skill-graph rewrite scope: how graph-metadata.json derived.trigger_phrases/intent_signals/key_files/entities/source_docs must span all workflow surfaces and repoint off monolith paths; description.json creation; which skill_advisor.py PHRASE_INTENT_BOOSTERS/SINGLE_WORD_INTENT verbs are missing (benchmark/command/feature-catalog/changelog/skill); guaranteeing skill_count stays exactly one sk-doc entry (no phantom family) post-compile.
7. Hooks/plugins/advisor-id continuity: confirm the top-level-slug scan keeps the sk-doc advisor id with zero hook/plugin edits and that nested child packets stay advisor-invisible (matches sk-code). Sequence the advisor rebuild/scan + freshness re-fingerprint; confirm no child needs to be independently routable.
8. Migration safety of fail-open couplings: the three sites that degrade silently rather than crash — audit_descriptions.py:45 ImportError fallback (loses budget-constant SoT sync), pre-commit existence guard (disables the doc-model gate), council matrix under set -e (only unguarded spawn). Decide explicit repoint vs facade per site; NEVER rely on graceful degradation.
9. mode-registry + hub-router schema design: backendKind vocabulary for doc modes (template-scaffold vs doc-quality/quality-pipeline), routingClass=metadata default with a per-mode command field recording the bound /create:*, command-bridge ONLY for command-only modes; routerSignals==modes[].workflowMode bidirectional; vocabularyClasses that disambiguate each create-* verb; tieBreak covering every mode (no surfaces, no surfaceBundle outcome).
10. Named-extensions decision: confirm the base-case ZERO extensions (no surface-axis — the doc-quality pipeline is universal doctrine not orthogonal stack-evidence, so labeling it a surface is a category error; no runtime-loop, no transform-verbs, no advisor-projection). Evaluate whether deprecated-modes is the ONE optional extension needed to shim a retired flat-sk-doc public entry point during migration.
11. Flowchart disposition: confirm ASCII flowcharts are always embedded-in-other-docs (fold assets/flowcharts/* + validate_flowchart.sh into shared/, reachable by any packet) vs a first-class 'make me a flowchart' create-flowchart route; stress against the 124/022 near-empty-shell bar (fat asset library, 3-line workflow).
12. Benchmark design + cross-hub parity: how to benchmark the converted hub (routing accuracy per verb, discovery, efficiency, canon conformance) and measure parity against sk-code/sk-design/deep-loop; design the CONDITIONAL parity gate and its promotion criteria; define what a passing routing profile looks like for a hub with no surface axis.
13. Companion-file completeness + changelog policy: verify the hub carries SKILL.md + mode-registry + hub-router + description.json + graph-metadata + real changelog/ + manual_testing_playbook/ + benchmark/, and each packet carries SKILL.md + README.md + real changelog/; enforce that changelogs are real files at both tiers, NEVER symlinked or cross-pointed (resist the dedupe temptation).
14. Global-references + frontmatter-versioning home split: which references/global/{optimization,hvr_rules,quick_reference,workflows,evergreen_packet_id_rule}.md are cross-cutting shared vocabulary (cited by every create-* during authoring) vs doc-quality-workflow-owned procedure; confirm frontmatter_versioning folds into the backbone (near-empty as its own packet = over-decomposition).
15. Backward-compat of the flat public identity: how the existing flat sk-doc advisor identity, trigger phrases, and /create:* command wiring project cleanly onto the hub; whether any retired public entry point dangles and needs a deprecated-modes shim; validate hub-router routerSignals==registry bidirectionally after the split so no route is orphaned.
