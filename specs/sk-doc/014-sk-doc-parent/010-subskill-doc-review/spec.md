---
title: "Feature Specification: Sub-skill doc template-alignment + 4-iteration GPT deep review"
description: "Confirm all 10 sk-doc packet docs validate 0-blocking against their template type after the *_creation.md dissection, then run a 4-iteration GPT-5.5 deep review per packet with findings applied and fresh-Sonnet verified."
trigger_phrases:
  - "sk-doc subskill doc review"
  - "125 sk-doc phase 010"
  - "sk-doc 4-iteration deep review"
  - "sk-doc packet template alignment"
importance_tier: "important"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review"
    last_updated_at: "2026-07-07T06:49:14.159Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Spec/plan/tasks authored; review lineages partially complete across 10 packets"
    next_safe_action: "Run remaining GPT-5.5 review iterations; apply and verify findings"
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
# Feature Specification: Sub-skill doc template-alignment + 4-iteration GPT deep review

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | sk-doc 10-packet build (005-012 in the original phase map) + the `*_creation.md` reference dissection |
| **Predecessor** | none (first phase of this follow-up sub-arc) |
| **Successor** | `011-smart-router-alignment/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `*_creation.md` reference dissection split each sk-doc packet's authoring doctrine into its own creation-guideline reference (`skill_creation.md`, `readme_creation.md`, `agent_creation.md`, `command_creation.md`, `feature_catalog_creation.md`, `manual_testing_playbook_creation.md`, `benchmark_creation.md`, `flowchart_creation.md`, `changelog_creation.md`, plus `doc-quality`'s `workflows.md`/`optimization.md`). That split gave every packet real reference substance, but it left two open questions the authoring pass could not answer about itself: whether every packet's docs actually validate cleanly against its own template type, and whether the content survives an adversarial multi-pass review (drift, fabrication, contradicted cross-references).

### Purpose
Close both gaps for all 10 packets. Template-alignment is done: every packet's authored docs pass their template-type validator with 0 blocking issues. The 4-iteration GPT-5.5-fast-high deep review is in progress: each packet has its own review lineage under `00N-<packet>/review/` (config, state ledger, deltas, iteration reports, findings registry), and every accepted finding is applied and independently re-verified by a fresh Sonnet pass before the packet counts as done.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the 0-blocking template-alignment result for all 10 packets (complete).
- Finish the 4-iteration GPT-5.5-fast-high deep review per packet: create-skill, create-command, create-manual-testing-playbook, and create-changelog are at 4/4; create-readme and create-agent are at 3/4; create-feature-catalog, create-benchmark, create-flowchart, and doc-quality have not started.
- Apply every accepted finding to the packet's `SKILL.md` / `references/` / `assets/`, independently re-verified by a fresh Sonnet pass (never the model that raised the finding).
- Keep each packet's review lineage (`deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deltas/`, `iterations/`, `deep-review-findings-registry.json`) current for audit.

### Out of Scope
- Rewriting doc-type doctrine content beyond what a verified finding requires.
- Router alignment, the doc-quality rename, the shared/references reorg, and the markdown agent sync — each is its own phase (011-014).
- Any sk-doc packet outside the current 10-packet set.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/create-*/` (10 packets) | Update | Apply verified GPT-5.5 findings to `SKILL.md` / `references/` / `assets/` per packet |
| `010-subskill-doc-review/00N-<packet>/review/` | Update | Continue each packet's deep-review lineage to iteration 4 (iterations, deltas, state ledger, findings registry) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 10 sk-doc packet docs validate 0-blocking against their template type | Shared template-type validator reports 0 blocking issues for every packet (done; evidence recorded in each packet's review iteration logs) |
| REQ-002 | Each of the 10 packets completes a 4-iteration GPT-5.5-fast-high deep review | `review/deep-review-state.jsonl` shows 4 iterations and a final verdict per packet; 4/10 complete today |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every accepted finding is applied and re-verified by a fresh Sonnet pass | Fixed content cites the finding's evidence; the fresh-Sonnet pass records PASS/CONDITIONAL/FAIL per packet |
| REQ-004 | Review lineage persists per packet for audit | `00N-<packet>/review/{deep-review-config.json,deep-review-state.jsonl,deep-review-strategy.md,deltas/,iterations/,deep-review-findings-registry.json}` present and current |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 packets show a 4/4-iteration review lineage with a recorded final verdict (PASS, or CONDITIONAL with every P0/P1 finding resolved).
- **SC-002**: Zero open P0 findings remain across all 10 packets.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | GPT-5.5-fast-high executor availability | Reviews stall or produce low-signal findings | Fresh-Sonnet verification catches low-signal or fabricated findings before they are applied |
| Risk | Concurrent edits to sk-doc packets from phases 011-014 | Review findings could go stale against a moved/renamed target | Sequence 010 before 011-014 land structural changes; re-run the affected packet's review if a later phase touches its files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a packet that finishes at CONDITIONAL (not PASS) block phase completion, or is CONDITIONAL-with-P0-resolved sufficient? Default: CONDITIONAL is acceptable once every P0/P1 finding is resolved or explicitly deferred with operator sign-off.
<!-- /ANCHOR:questions -->
