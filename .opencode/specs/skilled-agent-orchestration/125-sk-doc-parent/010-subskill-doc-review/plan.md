---
title: "Implementation Plan: Sub-skill doc template-alignment + 4-iteration GPT deep review"
description: "Parallel GPT-5.5-fast-high review swarms (one lineage per packet) with fresh-Sonnet verification of every finding, closing out the 10-packet template-alignment and deep-review requirement."
trigger_phrases:
  - "sk-doc subskill doc review plan"
  - "125 sk-doc phase 010 plan"
  - "sk-doc deep review swarm"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-010 plan"
    next_safe_action: "Dispatch the next GPT-5.5-fast-high review batch for the 6 remaining packets"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Sub-skill doc template-alignment + 4-iteration GPT deep review

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit docs; Python template-type validator (`shared/scripts/`) |
| **Framework** | deep-loop-workflows deep-review harness pattern (config/state/deltas/iterations/findings-registry), reused per sk-doc packet |
| **Storage** | Flat-file review lineage under `010-subskill-doc-review/00N-<packet>/review/` |
| **Testing** | Template-type validator per packet; fresh-Sonnet adversarial read of every accepted finding |

### Overview
Two-part close-out. Part A already ran the shared template-type validator against every packet's authored docs (0 blocking issues, all 10). Part B dispatches parallel GPT-5.5-fast-high review swarms — at least 5 concurrent agents per batch — one review lineage per packet, each producing up to 4 iterations of findings. Every finding a GPT swarm raises is re-verified by a FRESH Sonnet agent (never the model that raised it) before it is accepted and applied, so no single model's blind spots or fabrications reach a packet unchecked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 10-packet sk-doc build complete
- [x] `*_creation.md` reference dissection complete
- [x] Review harness scaffolded per packet (`00N-<packet>/review/`)

### Definition of Done
- [ ] All 10 review lineages reach 4/4 iterations with a recorded final verdict
- [ ] All P0/P1 findings applied and fresh-Sonnet verified
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel swarm-per-packet review lineage — the deep-loop-workflows deep-review state machine, scoped to one sk-doc packet per lineage instead of one code diff.

### Key Components
- **Review lineage** (`00N-<packet>/review/`): `deep-review-config.json` (scope/budget), `deep-review-state.jsonl` (append-only iteration ledger), `deltas/` (per-iteration diffs), `iterations/` (iteration reports), `deep-review-findings-registry.json` (accepted findings).
- **GPT-5.5-fast-high swarm**: at least 5 concurrent review agents per batch, each scoped to one packet, budget profile "verify".
- **Fresh-Sonnet verifier**: a Sonnet agent with no prior context re-checks every GPT-raised finding against the real file before it is applied — a finding is a hypothesis until confirmed, never an automatic truth.

### Data Flow
1. GPT swarm reviews one packet against its `SKILL.md` + references + integration evidence.
2. Swarm writes an iteration report (`iterations/iteration-00N.md`) and a delta (`deltas/iteration-00N.jsonl`).
3. A fresh Sonnet agent re-checks every raised finding against the real files (confirm before accepting).
4. Accepted findings are applied to the packet.
5. The state ledger (`deep-review-state.jsonl`) is appended with the iteration's verdict and counts.
6. Repeat through iteration 4, or converge early on a stable PASS/CONDITIONAL verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Template Alignment (Complete)
- [x] Run the template-type validator against all 10 packets' authored docs
- [x] Record the 0-blocking result per packet

### Phase 2: Finish In-Progress + Start Pending Review Lineages
- [ ] create-readme: run iteration 4, resolve the flagged `install_guide_template.md` credential-pattern finding
- [ ] create-agent: run iteration 4
- [ ] create-feature-catalog, create-benchmark, create-flowchart, doc-quality: run iterations 1-4 each

### Phase 3: Apply + Verify Findings
- [ ] Apply every accepted P0/P1 finding per packet
- [ ] Fresh-Sonnet verification pass per packet (independent of the GPT swarm that raised the finding)
- [ ] Record the final verdict per packet in `deep-review-state.jsonl`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template-type validation | Every packet's authored docs | Shared Python validator (`shared/scripts/`) |
| Adversarial review | 4-iteration review per packet | GPT-5.5-fast-high swarm (cli-opencode), >=5 concurrent |
| Independent verification | Every accepted finding | Fresh Claude Sonnet agent, no prior context |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| GPT-5.5-fast-high executor (cli-opencode) | External | Green | Iterations pause; resume when the executor is available |
| Fresh-Sonnet verifier capacity | Internal | Green | Findings stay unverified and cannot be applied |
| sk-doc 10-packet build (original phase map) | Internal | Green (complete) | Nothing to review |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an applied finding introduces a regression (broken cross-reference, contradicted workflow step).
- **Procedure**:
  1. Revert the specific packet file(s) touched by that iteration's delta (`deltas/iteration-00N.jsonl` records the touched paths).
  2. Re-run the template-type validator on the reverted packet.
  3. Re-open the review at the same iteration rather than advancing.
<!-- /ANCHOR:rollback -->
