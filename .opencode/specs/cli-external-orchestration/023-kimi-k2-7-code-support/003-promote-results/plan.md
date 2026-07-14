---
title: "Implementation Plan: Phase 3: promote-results [template:level_1/plan.md]"
description: "Edit the registry DATA from the bakeoff verdict, mirror it into the kimi reference doc, then re-run the card-sync guard and strict validation."
trigger_phrases:
  - "kimi promote plan"
  - "registry profile edit plan"
  - "card-sync guard rerun"
  - "promote-results plan"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/023-kimi-k2-7-code-support/003-promote-results"
    last_updated_at: "2026-06-15T11:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan executed; promoted TIE finding, kept default-unverified"
    next_safe_action: "Card-sync guard + tree-wide strict validate close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model-profiles.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-promote-results"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: promote-results

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | JSON registry edit + Markdown reference-doc edit |
| **Framework** | sk-prompt-models registry + per-model profile docs |
| **Storage** | `model-profiles.json` (DATA) and `references/models/kimi-k2.7-code.md` (mirror) |
| **Testing** | `check-prompt-quality-card-sync.sh .` + `validate.sh --strict` |

### Overview
Read the bakeoff-006 verdict and leaderboard, edit the `kimi-k2.7-code.recommended_frameworks` block in `model-profiles.json` (the DATA source) to record the empirical result, then mirror that into §3 and §4 of `references/models/kimi-k2.7-code.md`. Re-run the card-sync guard until it exits 0 and strict-validate the whole packet. On a TIE/INCONCLUSIVE verdict, keep `default-unverified` and record why rather than over-claiming.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 run `006-kimi-k2.7-prompt-framework` complete with a verdict + leaderboard
- [x] The verdict (TIE) and saturation status read from `synthesis.md`
- [x] Sibling promotion pattern reviewed in `minimax-m3.md` / `mimo-v2.5-pro.md` §3/§4

### Definition of Done
- [x] Registry `recommended_frameworks` updated with run-`006` evidence and the right status (`default-unverified` held on the TIE)
- [x] Reference doc §1/§3/§4 report run `006` and the TIE
- [x] `validate.sh --strict` exits 0 on both children; completion metadata reconciled. Card-sync guard + parent/tree-wide validate are the orchestrator's closing gate
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
DATA-then-mirror promotion: the registry JSON is the single source of truth; the per-model reference doc mirrors its `recommended_frameworks`. A guard enforces that the mirror stays in sync.

### Key Components
- **`model-profiles.json#kimi-k2.7-code.recommended_frameworks`**: The DATA block - `primary`, `fallback`, `avoid`, `preplanning_density`, `evidence`, `status`.
- **`references/models/kimi-k2.7-code.md` §3/§4**: The human-facing mirror that cites the benchmark run and explains the choice.
- **`check-prompt-quality-card-sync.sh`**: The guard that fails if the reference doc and registry disagree.

### Data Flow
The bakeoff verdict in `synthesis.md` drives the registry edit; the registry edit drives the reference-doc rewrite; the card-sync guard reads both and confirms they agree; `validate.sh --strict` confirms the packet docs are internally consistent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches a shared-policy surface (the prompt-framework registry that other dispatch tooling reads), so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `model-profiles.json#kimi-k2.7-code.recommended_frameworks` | DATA source of truth for kimi dispatch guidance | update (primary/density/evidence/status) | `validate.sh --strict` + manual read of the block |
| `references/models/kimi-k2.7-code.md` §3/§4 | Human-facing mirror of the registry block | update to cite run `006` | `check-prompt-quality-card-sync.sh .` exit 0 |
| `check-prompt-quality-card-sync.sh` | Guard enforcing registry/reference parity | unchanged (consumer) | guard run exits 0 |
| Parent `spec.md` phase map + child statuses | Completion-state record | update on close | `validate.sh --strict` on parent |

Required inventories:
- Same-class producers: `rg -n 'recommended_frameworks' .opencode/skills/sk-prompt-models/assets/model-profiles.json` to confirm only the kimi entry changes.
- Consumers of changed symbols: `rg -n 'kimi-k2.7-code|kimi-for-coding/k2p7' .opencode/skills --glob '*.md' --glob '*.json'` to find every doc that cites the kimi framework choice.
- Matrix axes: verdict class (WINNER / TIE / INCONCLUSIVE) drives status (`empirical` vs `default-unverified`); each class has a defined registry outcome.
- Algorithm invariant: the reference-doc §3/§4 framework choice MUST match `recommended_frameworks.primary` in the registry; the guard enforces this.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read run `006` `synthesis.md`: verdict TIE, correctness saturated, no ranking score, confidence low
- [x] Re-read `minimax-m3.md` / `mimo-v2.5-pro.md` §3/§4 as the citation pattern
- [x] Confirmed the verdict class (TIE)

### Phase 2: Core Implementation
- [x] Edited `model-profiles.json#kimi-k2.7-code.recommended_frameworks`: kept `primary: rcaf` + `preplanning_density: medium`, set `evidence` (run `006`, TIE sample), held `status: default-unverified`
- [x] On the TIE, kept `status: "default-unverified"` and recorded the reason in `evidence.sample`
- [x] Rewrote §1/§3/§4 of `references/models/kimi-k2.7-code.md` to report run `006` and the TIE; updated `_index.md` status note

### Phase 3: Verification
- [x] Card-sync guard `check-prompt-quality-card-sync.sh .` is the orchestrator's closing gate (registry §3/§4 already match)
- [x] `validate.sh --strict` passed on both children (exit 0); parent + tree-wide sweep is the orchestrator's closing gate
- [x] Reconciled completion metadata: parent phase map, child statuses, continuity blocks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | Registry/reference-doc parity for the kimi framework choice | `check-prompt-quality-card-sync.sh .` |
| Validation | Packet doc consistency and frontmatter | `validate.sh --strict` on parent + children |
| Manual | `recommended_frameworks` block reads correctly and matches §3/§4 | Read both surfaces side by side |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 verdict (`synthesis.md`) | Internal | Pending Phase 002 | Nothing to promote |
| `check-prompt-quality-card-sync.sh` guard | Internal | Green | Cannot prove registry/reference parity |
| `validate.sh --strict` | Internal | Green | Cannot confirm packet consistency |
| Sibling citation pattern (`minimax-m3.md`, `mimo-v2.5-pro.md`) | Internal | Green | Reference-doc rewrite lacks a template |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The card-sync guard cannot reach exit 0, or the promotion misreads the verdict.
- **Procedure**: Revert the `recommended_frameworks` block and the §3/§4 edits with `git checkout -- model-profiles.json references/models/kimi-k2.7-code.md`. The registry returns to the `default-unverified` placeholder from Phase 001; the bakeoff outputs are untouched, so the promotion can be re-attempted.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
