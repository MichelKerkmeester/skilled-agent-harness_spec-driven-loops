---
title: "Implementation Plan: Phase 6: broad-scope-timeout-caveat [template:level_1/plan.md]"
description: "Additive doc edits recording Kimi K2.7 Code's broad-scope over-exploration -> 600s-timeout -> 0-bytes failure mode + mitigation across sk-prompt-models + cli-opencode, plus repair of stale kimi-k2.6 references; verified by the card-sync guard + strict validate."
trigger_phrases:
  - "kimi k2.7 timeout caveat plan"
  - "broad scope over-exploration mitigation"
  - "phase 006 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/023-kimi-k2-7-code-support/006-broad-scope-timeout-caveat"
    last_updated_at: "2026-06-17T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented k2.7 over-exploration/timeout caveat + fixed stale k2.6 refs"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/kimi-k2.7-code.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-149-006-broad-scope-timeout-caveat"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: broad-scope-timeout-caveat

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON skill docs |
| **Framework** | spec-kit phase folder; prompt-card-sync drift guard |
| **Storage** | Files in `sk-prompt-models` + `cli-opencode` |
| **Testing** | `check-prompt-quality-card-sync.sh` + `validate.sh --strict` + JSON parse |

### Overview
Additive, doc-only change. Record the observed Kimi K2.7 Code over-exploration → 600s-timeout → 0-bytes failure mode and its mitigation (hard read-cap in the prompt + 1200s+ timeout + optionally omit `--variant`) in the canonical Kimi surfaces, and repair stale `kimi-k2.6` references in cli-opencode. No code or behavior changes; the only risk is breaking the registry↔profile↔card sync, gated by the drift guard.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Failure mode evidence captured (028/007 research: 65 KB stderr + fixed run)
- [x] Mitigation proven (tight ≤4-read + 1200s + no --variant → clean 863B, 4 reads)
- [x] Honest scope set (observation n=few; --variant driver not isolated)

### Definition of Done
- [x] Caveat + mitigation present in both skills
- [x] Card-sync guard green; model_profiles.json parses
- [x] Strict validate; stale k2.6 refs repaired
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Document-the-gotcha. The finding is data; the doc edits put it where future dispatchers will read it (profile + registry + executor card + budget reference).

### Key Components
- **sk-prompt-models**: `references/models/kimi-k2.7-code.md` (§2 wall-clock, §5 read-cap/failure-mode, §6 variant caveat) + `assets/model_profiles.json` (weaknesses entry).
- **cli-opencode**: `SKILL.md` Kimi line caveat; `references/cli_reference.md` + `references/context-budget.md` stale `kimi-k2.6` → `k2p7`/`k2.7-code`.
- **Guard**: `check-prompt-quality-card-sync.sh` proves the additions didn't desync the registry/profile/card.

### Data Flow
Finding (028/007) → profile + registry + executor card + budget reference → drift guard + strict validate confirm consistency.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Caveat in sk-prompt-models
- [x] kimi-k2.7-code.md §5 (load-bearing read-cap + failure mode), §6 variant_flag caveat, §2 wall-clock observation
- [x] model_profiles.json `kimi-k2.7-code` weaknesses entry

### Phase 2: Caveat + stale-ref repair in cli-opencode
- [x] SKILL.md `kimi-for-coding/k2p7` line operational caveat
- [x] cli_reference.md k2.6 row → k2p7; context-budget.md k2.6 → k2.7-code (262,144) + caveat + prose ref

### Phase 3: Verify
- [x] model_profiles.json parses; card-sync guard exit 0
- [x] Parent phase-map row + children_ids; strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sync integrity | Registry↔profile↔card consistent after edits | `check-prompt-quality-card-sync.sh` |
| Data integrity | `model_profiles.json` still parses | `node` JSON.parse |
| Structure | Phase folder validates | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `check-prompt-quality-card-sync.sh` | Internal | Green | Cannot prove the edits kept the card sync intact |
| 028/007 Kimi diagnosis | Internal | Done | The evidence base for the caveat |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The caveat is later shown wrong (e.g. a controlled A/B proves `--variant high` is not the driver), or the guard goes red.
- **Procedure**: `git revert` the phase-6 commit — the change is additive doc-only and fully reversible from git history; no code/behavior to unwind.
<!-- /ANCHOR:rollback -->
