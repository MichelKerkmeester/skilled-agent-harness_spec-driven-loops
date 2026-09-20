---
title: "Implementation Plan: Pi manual-testing playbook (planning)"
description: "Plan for the FUTURE authoring of a Pi-native manual-testing playbook (8 category folders, 19 PI-NNN scenarios) mirroring the sk-doc create-manual-testing-playbook template. This phase produces only the plan; no playbook files are created."
trigger_phrases:
  - "pi manual testing playbook plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/010-pi-manual-testing-playbook"
    last_updated_at: "2026-07-27T11:36:00Z"
    last_updated_by: "claude-code"
    recent_action: "Dependency table + Scenario Coverage Plan re-verified against phases 001-009's real facts"
    next_safe_action: "Commit; phase 011 re-judges playbook proportionality at closeout"
    blockers: ["The actual playbook files remain unauthored - out of this planning phase's own scope"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-planning"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Pi manual-testing playbook (planning)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (spec-kit planning docs only; the future playbook itself is also markdown) |
| **Framework** | sk-doc `create-manual-testing-playbook` package conventions |
| **Storage** | None - filesystem markdown files under a skill packet |
| **Testing** | `validate_document.py` (structural), `check-markdown-links.cjs` (cross-file links), manual spot-check (future authoring pass only) |

### Overview
This phase plans (does not yet author) a Pi-native manual-testing playbook: a root `manual-testing-playbook.md` plus 8 category folders holding 19 `PI-NNN` scenario files, split-document style per sk-doc's `create-manual-testing-playbook` contract. The category set maps 1:1 onto the 7 capability areas exercised by phases 001-009 (install/contract, skill discovery, command dispatch, agent bridge, MCP host integration, hook/extension behavior, model dispatch) plus one cli-family-generic `prompt-quality` addition. The actual authoring pass is a FUTURE action, gated on phases 001-009 landing live-verified Pi facts; this plan documents the approach and the Scenario Coverage Plan target that future pass will execute against.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (spec.md §6; phases 001/003/007/008/009)

### Definition of Done (for THIS planning phase)
- [x] spec.md/plan.md/tasks.md/checklist.md authored with concrete, falsifiable acceptance criteria
- [x] Scenario Coverage Plan (spec.md §9) sketches 8 categories / 19 `PI-NNN` scenarios, IDs gap-free
- [x] `validate.sh 010-pi-manual-testing-playbook --strict` returns `Errors: 0` [EVIDENCE: via the main-tree metadata round-trip pattern, recorded in the commit]

### Definition of Done (for the FUTURE authoring pass - NOT this phase)
- [ ] Root playbook + 8 category folders + 19 scenario files actually exist under `cli-pi/manual-testing-playbook/`
- [ ] `validate_document.py` reports 0 structural errors on every playbook file
- [ ] `cli-pi/SKILL.md` cross-references the playbook
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split-document catalog (sk-doc `create-manual-testing-playbook` canonical shape) - not yet materialized. Planned shape: `manual-testing-playbook/manual-testing-playbook.md` (root: banners, policy, category summaries, cross-reference index) plus `manual-testing-playbook/<category>/*.md` (per-scenario execution contracts), no `snippets/` subtree, no packet-local `graph-metadata.json`.

### Key Components
- **Root playbook file (future)**: EXECUTION POLICY + SELF-INVOCATION GUARD banners, Global Preconditions (Pi install + auth gate), Global Evidence Requirements, Deterministic Command Notation, Review Protocol, Sub-Agent Orchestration/Wave Planning, 8 category sections, Automated Test Cross-Reference, Feature Catalog Cross-Reference Index.
- **8 category folders (future)**: `cli-invocation`, `skill-discovery`, `command-dispatch`, `agent-bridge`, `mcp-host-integration`, `hook-extension-layer`, `model-dispatch`, `prompt-quality` - each holding >=1 `PI-NNN` scenario file on the universal per-feature template (Overview, Scenario Contract, Test Execution, Source Files, Source Metadata).
- **Scenario Coverage Plan (spec.md §9, THIS phase's real deliverable)**: the 19-row target table the future authoring pass builds against.

### Data Flow
Not applicable - this is a documentation package, not a runtime data flow. The planning-to-authoring flow is: phases 001-009 land live facts -> future authoring pass consults spec.md §9 -> writes root file + scenario files -> validates -> cross-references `cli-pi/SKILL.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix; included for surface-tracking clarity per plan-core convention. All rows below are FUTURE creates, not touched by this planning phase.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Does not exist yet | Create (future authoring pass, not this phase) | Section set mirrors sk-doc's canonical contract once authored |
| `cli-pi/manual-testing-playbook/<8 categories>/*.md` | Does not exist yet | Create (future authoring pass, not this phase) | 17-20 `PI-NNN` files once authored, matching spec.md §9 |
| `cli-pi/SKILL.md` | Does not exist yet (phase 003 not yet executed) | Update (future, after phase 003 ships the file) | Playbook cross-reference line added once both this phase and phase 003 execute |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` (root) + one scenario file, and `cli-cursor-creation/006-cursor-manual-testing-playbook/spec.md` as the structural and tone precedent
- [x] Read `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` for the canonical package contract (banners, section order, per-feature template, validation gates)
- [x] Sketched the 8-category / 19-`PI-NNN` Scenario Coverage Plan (spec.md §9) against the 7 required capability areas plus one cli-family-generic addition
- [x] Confirm phases 001-009 have landed; re-read their `implementation-summary.md` files for live facts [EVIDENCE: all 9 predecessor phases Complete or Blocked-with-real-evidence; spec.md §9 rows for PI-002/PI-011/PI-015/PI-017 updated with the real findings from phases 001/007/008/009]

### Phase 2: Core Implementation (FUTURE - not this phase)
- [ ] Author the root `manual-testing-playbook.md` (EXECUTION POLICY + SELF-INVOCATION GUARD banners; Global Preconditions gating on Pi CLI install + provider auth, citing phase 001's confirmed self-invocation signal and exit-code semantics)
- [ ] Author the 8 category folders with 19 `PI-NNN` scenarios per spec.md §9, including the hallucination-fixture scenario (`PI-003`)
- [ ] Author the `mcp-host-integration` stdio-vs-streamable-http pairing (`PI-011`/`PI-012`) using phase 007's live-confirmed result, not an assumption
- [ ] Author the `hook-extension-layer` lifecycle-event enumeration scenario (`PI-015`) using phase 008's live-confirmed event list
- [ ] Add the playbook cross-reference into `cli-pi/SKILL.md`

### Phase 3: Verification (FUTURE - not this phase)
- [ ] Run `validate_document.py` on the root file and every scenario file; 0 structural errors
- [ ] Confirm `PI-NNN` sequence is gap-free; confirm category count is 8; confirm total scenario count is in the 17-20 range
- [ ] Confirm the `cli-pi/SKILL.md` cross-reference via `git diff`
- [ ] This phase's own `validate.sh 010-pi-manual-testing-playbook --strict` returns `Errors: 0` (run now, for the planning docs)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural (this phase, now) | spec.md/plan.md/tasks.md/checklist.md anchor integrity, frontmatter validity | `validate.sh <folder> --strict` |
| Structural (future authoring pass) | Root playbook + every scenario file | `validate_document.py --type reference`, `extract_structure.py` |
| Manual (future authoring pass) | Per-feature file frontmatter, section order, prompt synchronization, PI-NNN ID mapping, local link resolution | Manual review per sk-doc §6 (validator does not recurse into category folders) |
| Live execution (future, separate from authoring) | Every `PI-NNN` scenario dispatched for real against a live `pi` CLI | Operator-run, gated on `pi` install + provider auth - out of scope for both this phase and the future authoring pass |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 (`pi-contract-pin`) | Internal | Complete | Exit-code-unreliability and install-verb facts now ground `PI-002`; self-invocation signal still unconfirmed |
| Phase 003 (`cli-pi-skill-packet`) | Internal | Complete | `SKILL.md` cross-reference target now exists (still not edited by this planning phase) |
| Phase 007 (`pi-mcp-host-integration`) | Internal | Blocked | Docs now document stdio transport (narrower gap for `PI-011`), but live-session confirmation stays open |
| Phase 008 (`pi-hook-extension-layer`) | Internal | Blocked | Real 32-event set TYPE-CONFIRMED via the installed package's `types.d.ts`, grounding `PI-015` far better than an assumed list; live-session confirmation stays open |
| Phase 009 (`pi-model-registry-and-routing`) | Internal | Complete | Fail-closed 7-model allowlist landed, grounding `PI-017`/`PI-018` with the real roster |
| `cli-codex`/`cli-cursor` playbooks | Internal | Live (shipped) | Structural + tone precedent for this plan |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The Scenario Coverage Plan proves materially wrong once phases 001-009 land (e.g. a whole category is infeasible, or Pi has a unique surface this plan missed).
- **Procedure**: Revise spec.md §9 (and the matching REQUIREMENTS rows) before the future authoring pass creates any playbook file - no code or shipped docs are ever at risk since this phase creates none. If this phase's own docs need to be reverted, `git checkout` this phase's 4 files; nothing outside this folder is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core Implementation, FUTURE) ──► Phase 3 (Verify, FUTURE)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None (this phase's own reading + Scenario Coverage Plan sketch) | Core Implementation |
| Core Implementation | Setup, AND phases 001/003/007/008/009 executing | Verify |
| Verify | Core Implementation | Phase 011 (closeout) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (this phase, done now) | Low | 1-2 hours (read precedents + sketch Scenario Coverage Plan) |
| Core Implementation (future) | Medium | 3-5 hours (root file + 19 scenario files across 8 categories) |
| Verification (future) | Low | 30-60 min |
| **Total (future authoring pass)** | | **4-6 hours, gated on phases 001-009** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Not applicable this phase - no deployment, no runtime code, no data changes.

### Rollback Procedure
1. If this phase's own planning docs need reverting: `git checkout -- 010-pi-manual-testing-playbook/` (scoped to this folder only).
2. No feature flag, redeploy, or stakeholder notification is applicable - docs-only planning phase.
3. Verify via `validate.sh 010-pi-manual-testing-playbook --strict` after any revert.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md` (this phase)
- `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md` (structural precedent)
- `../030-cli-cursor-creation/006-cursor-manual-testing-playbook/plan.md` (sibling precedent, closest structural match)
- `../029-cli-devin-revival/006-devin-manual-testing-playbook/plan.md` (sibling precedent)
