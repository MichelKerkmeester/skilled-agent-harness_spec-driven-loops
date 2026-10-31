---
title: "Implementation Plan: Phase 1: analysis"
description: "Turn the template-reduction research into an implementation-ready contract for recommendations R1 through R6, with exact surfaces, ordering, compatibility requirements, and proof gates."
trigger_phrases:
  - "template reduction analysis"
  - "spec-kit recommendations"
  - "template contract map"
  - "byte budget"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Phase 1: analysis

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, Bash, TypeScript, and Node.js |
| **Framework** | system-spec-kit templates, manifest contracts, validators, and content routing |
| **Storage** | Versioned specification documents, template sources, and golden snapshots |
| **Testing** | Evidence traceability in the research report, followed by golden snapshots and strict validation in child phases |

### Overview
Review `001-analysis/research/research.md` and convert recommendations R1 through R6 into implementation-ready scopes. Tie each recommendation to the phase requirements, exact contract surfaces, dependency order, rollback trigger, and objective verification gate without changing production templates or code in this analysis phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `spec.md` states the problem, six requirements, success criteria, and dependencies.
- [x] `research/research.md` records measured findings, exact source surfaces, and ranked recommendations.
- [x] The downstream phase boundaries and handoff order are identified.

### Definition of Done
- [ ] Each recommendation maps to exactly one requirement and a concrete child-phase scope.
- [ ] The sequence R1, R6, R2, R3, R4, then R5 names its contract update and verification gate.
- [ ] No unresolved analysis gap prevents a child phase from identifying its files, compatibility path, and rollback condition.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-to-contract analysis: findings become ranked recommendations, recommendations become requirements, and requirements become sequenced implementation packets.

### Key Components
- **Research report**: `specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/001-template-duplication-analysis/research/research.md` contains the measured findings and recommendation evidence.
- **Phase specification**: `specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/001-template-duplication-analysis/spec.md` defines the six requirements and acceptance criteria.
- **Contract surfaces**: `.opencode/skills/system-spec-kit/templates/`, `.opencode/skills/system-spec-kit/mcp-server/lib/`, `.opencode/skills/system-spec-kit/scripts/`, and the golden snapshot suite receive the child-phase work.

### Data Flow
Research evidence flows into the six requirement mappings, then into the ordered child phases. Each child phase receives named files, compatibility constraints, and a pass-or-fail verification gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Reconcile the Findings, Recommendations, and Quality sections in `research/research.md` with REQ-001 through REQ-006 in `spec.md`.
- [ ] Record the exact renderer, manifest, validator, status, routing, snapshot, and byte-budget surfaces named by the research.

### Phase 2: Core Implementation
- [ ] Define the R1 and R6 child scopes for byte-preserving deduplication and measured budget assertions.
- [ ] Define the R2, R3, R4, and R5 child scopes with their sidecar, merge, validator-first, and routing-preservation constraints.
- [ ] Preserve the sequence R1, R6, R2, R3, R4, then R5 and carry each research unknown into the phase where it can be resolved.

### Phase 3: Verification
- [ ] Cross-check every REQ id against the phase map and remove phantom or unmapped requirements.
- [ ] Confirm each child phase has a concrete acceptance check, a compatibility boundary, and a rollback trigger before implementation begins.
- [ ] Confirm the handoff references `research/research.md`, `spec.md`, and the downstream phase specifications.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence review | Recommendation claims, cited files, and measured baselines | `rg` and direct document review |
| Contract review | REQ-to-scope mapping, phase order, compatibility paths, and rollback gates | Requirements matrix in `spec.md` and this plan |
| Downstream verification | Render identity, status compatibility, anchor routing, byte budgets, and strict validation | Golden snapshots, `validate.sh --strict`, and targeted rule checks in child phases |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-analysis/research/research.md` | Internal evidence | Green | Recommendation scopes cannot be traced to findings |
| `001-analysis/spec.md` | Internal contract | Green | Child plans cannot map acceptance criteria |
| Inline gate renderer and manifest | Internal implementation | Green | Template changes cannot preserve level-specific output |
| Validator, status, and content-router surfaces | Internal consumers | Green | Compatibility boundaries remain undefined |
| Golden snapshots and measured byte baselines | Internal verification | Green | Output identity and budget claims cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A recommendation cannot map cleanly to its requirement, contract surface, compatibility boundary, or objective gate.
- **Procedure**:
  1. Restore the last reviewed analysis and requirements mapping in the phase documents.
  2. Remove the affected child-phase scope rather than carrying an unsupported assumption forward.
  3. Recheck the remaining sequence against `research/research.md` before reopening the child phase.
<!-- /ANCHOR:rollback -->
