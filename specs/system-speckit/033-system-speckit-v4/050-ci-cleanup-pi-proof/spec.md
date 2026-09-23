---
title: "Feature Specification: CI Cleanup and Pi Gate-3 Live Proof"
description: "Phase 049 closed the Gate-3 residue but left two loose ends. The Pi Gate-3 dialog had proof only through the fake-ExtensionAPI suite and never in a live Pi run, and six CI surfaces were red before this phase started. This phase proves the dialog live twice and greens the six surfaces without weakening a gate."
trigger_phrases:
  - "pi gate-3 live proof"
  - "ci cleanup pi proof"
  - "cli-jev run keyword"
  - "scorer baseline ratchet"
  - "six ci surfaces"
  - "merged-tree re-verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CI Cleanup and Pi Gate-3 Live Proof

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-22 |
| **Branch** | `worktrees/061-ci-cleanup-pi-proof` |
| **Parent Spec** | ../spec.md |
| **Phase** | 50 of 50 |
| **Predecessor** | 049-gate-3-delivery-residue |
| **Successor** | None |
| **Handoff Criteria** | N/A - final phase of the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 50** of the system-speckit v4 parent specification, the final phase of the parent.

**Scope Boundary**: Only the six CI surfaces, the two Pi live proofs, the scorer fix at the cli-jev producer, the packet docs and the parent records may change. No gate is weakened. Anything outside that list is recorded, not repaired.

**Dependencies**:
- Phase 049-gate-3-delivery-residue, the predecessor that closed the Gate-3 residue.
- Worktree .worktrees/061-ci-cleanup-pi-proof on branch worktrees/061-ci-cleanup-pi-proof at base commit 1cc5dfa692.
- Merged main, because the cli-jev manifest re-mint runs after the merge.

**Deliverables**:
- A live headless Pi probe and a live TUI Pi run that prove the Gate-3 contract, with their captured artifacts under evidence/.
- All six CI surfaces green on the worktree and again on the merged tree.
- The scorer fix at cli-jev with the eval baseline back at the committed 152 of 195 and 27 of 32.
- The packet docs and the parent records, with strict validation passing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 049 closed the Gate-3 residue but left two loose ends. The Pi Gate-3 dialog was proven only through the fake-ExtensionAPI suite, where phase 048 ran 9 of 9 through the production handlers, and it was never proven in a live Pi run. Six CI surfaces were red before this phase started.

### Purpose
The Pi Gate-3 contract is proven in a live headless run and a live TUI run, and the six CI surfaces are green with no weakened gate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The six CI surfaces: Hermes mirror drift, skill doc frontmatter, skill graph metadata, the scorer eval baseline ratchet, Markdown links and the spec-kit CLI tests.
- Both Pi live proofs: the headless parent-mode probe and the TUI run.
- The scorer fix at the cli-jev producer, with the eval baseline equal to its committed content.
- The packet docs and the parent records.

### Out of Scope
- Re-minting the sk-design or sk-doc routing hubs. Their bytes belong to another session.
- The full deep-loop runtime suite. Its earlier baseline run exceeded 900 seconds and the focused contract tests are the evidence for that surface.
- The nine pre-existing run-all-drift-guards.sh errors (6 missing set -uo pipefail, 2 missing references/README.md, 1 missing assets/voice-report-template.md). They match the pre-change baseline and sit outside the six surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Four Hermes skill copies (cli-hermes, cli-opencode, cli-pi, deep-ai-council) and `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.md` | Regenerate | Hermes mirror drift. The four skill copies and the compiled command contract with its two sha256 pins are regenerated |
| 14 cli-orca docs (13 under `references/`, plus `assets/PROVENANCE.md`) | Modify | Skill doc frontmatter. contextType reference becomes contextType general |
| `cli-orca/graph-metadata.json` and the `graph-metadata.json` of cli-external-orchestration, cli-jev, mcp-tooling and sk-git | Modify | Skill graph metadata. Category cli-tool becomes cli-orchestrator, three derived entries kind doc become reference, sibling weights to cli-external-orchestration and mcp-tooling move 0.3 to 0.4, and reciprocal sibling edges are added |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Scorer eval baseline ratchet surface. Restored to its committed content after the cli-jev fix returns the counts to 152 of 195 and 27 of 32 |
| Six link sources (cli-jev manual-testing-playbook (1), system-spec-kit runtime/hooks/cursor/README.md (1), runtime/hooks/devin/README.md (2), sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md (2)) | Modify | Markdown links. Six broken links are repointed to their z_archive/ locations |
| `recursive-child-manifest.vitest.ts` | Modify | Spec-kit CLI tests. Two hardcoded .opencode/specs paths are corrected to the tracked specs/ tree |
| `.github/workflows/routing-registry-drift.yml` | Modify | The corpus gate and two push path filters read the json-optimization baseline from its z_archive/ location. Added with the operator's yes after the first push exposed this failure |
| `.github/workflows/spec-kit-check.yml` | Modify | The runtime vitest step runs with TMPDIR set to the runner's temp dir, outside the spec gate's /tmp exemption. Added with the operator's yes after the first push exposed this failure |
| `.skilled/skills/cli-jev/SKILL.md` | Modify | The bare word run is removed from the Keywords comment on line 8 |
| `.skilled/skills/cli-jev/graph-metadata.json` | Modify | The bare word run is removed from derived.key_topics |
| `.hermes/skills/cli-jev/SKILL.md` | Regenerate | Regenerated from the skill source after the keyword removal |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-jev/manifest.json` | Regenerate | Re-minted after the merge with the compiled-route-manifest refresh command for hub cli-jev |
| `specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/` packet documents | Modify | The packet documents record the phase outcome and the operator decisions, and handover.md is rebuilt from the template |
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Modify | Phase map row 50 and the 049 to 050 handoff row register this phase |
| `specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/implementation-summary.md` | Modify | One Verification row records this phase's live Pi proof |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A live headless parent-mode probe proves the Pi Gate-3 dialog. The probe runs pi -p --offline with AI_SESSION_CHILD=0 and SYSTEM_SPEC_GATE_ENFORCE=0 so the real parent classifier runs in advisory mode, and the delivery marker records one delivered question through the classify-deferral channel. |
| REQ-002 | A live TUI run proves the Pi Gate-3 dialog. The select dialog, the path input and a refused first write with the bound-path message are captured, the retry passes, later edits pass with no second question, and the state file records the bound path as satisfied. |
| REQ-003 | The six CI surfaces pass locally without weakening a gate. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The scorer drop is root-caused and fixed at the producer and the eval baseline equals the committed 152 of 195 and 27 of 32. |
| REQ-005 | The cli-jev compiled routing manifest is re-minted after the merge, the route guard reports fresh and CJ-001 routes compiled. |
| REQ-006 | The packet validates strict with RESULT: PASSED and the parent records are reconciled. |
| REQ-007 | Merged-tree re-verification of Hermes sync, the scorer ratchet, the link check and the route guard runs before any push. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The six CI surfaces pass on the worktree and again on the merged tree.
- **SC-002**: The Pi Gate-3 contract is proven live twice, once in a headless run and once in the TUI.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Merged main before the cli-jev compiled-routing re-mint | Medium | The re-mint runs after the merge with the refresh command, then the guard must report fresh and CJ-001 must route compiled before any push |
| Risk | The skill-advisor hook CLI fallback times out and logs CLI_RETRYABLE_UNAVAILABLE exit 75 | Low | The line comes from the advisor fallback in status fail_open and not from the model provider. A later run logged status ok |
| Risk | The TUI capture carries a tmux extended-keys warning | Low | A future scripted drive configures tmux before Enter-key automation is trusted |
| Risk | The re-mint refuses while the scorer freeze is stale | Medium | Re-mint after merging main, then require the guard to report fresh and CJ-001 to route compiled before any push |
| Risk | Pushing local main carries the other session's two unpushed commits f5a89115b1 and 2c8f243607 | Medium | The operator decision of 2026-09-23 records the push of those two commits with local main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - insufficient source context
- **NFR-P02**: N/A - insufficient source context

### Security
- **NFR-S01**: N/A - insufficient source context
- **NFR-S02**: N/A - insufficient source context

### Reliability
- **NFR-R01**: N/A - insufficient source context
- **NFR-R02**: N/A - insufficient source context
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A - insufficient source context
- Maximum length: N/A - insufficient source context
- Invalid format: N/A - insufficient source context

### Error Scenarios
- External service failure: the skill-advisor hook CLI fallback can time out during a live Pi run. The hook fails open and the run continues with freshness unavailable.
- Network timeout: N/A - insufficient source context
- Concurrent access: another session works in the primary checkout at the same time. This phase writes only in worktree 061 and leaves the primary checkout's dirty entries untouched.

### State Transitions
- Partial completion: if the merged-tree re-verification fails, nothing is pushed. The phase commit can be reverted and the cli-jev manifest re-minted or restored.
- Session expiry: N/A - insufficient source context
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | N/A - insufficient source context | N/A - insufficient source context |
| Risk | N/A - insufficient source context | N/A - insufficient source context |
| Research | N/A - insufficient source context | N/A - insufficient source context |
| **Total** | **N/A - insufficient source context** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. The operator decisions of 2026-09-23 are recorded in implementation-summary.md.
<!-- /ANCHOR:questions -->

---

