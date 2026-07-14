---
title: "Feature Specification: Phase 6: broad-scope-timeout-caveat"
description: "Document Kimi K2.7 Code's broad-scope over-exploration -> 600s-timeout -> 0-bytes failure mode + mitigation (read-cap + 1200s+ + omit --variant) across sk-prompt-models + cli-opencode; fix adjacent stale kimi-k2.6 references."
trigger_phrases:
  - "kimi k2.7 timeout caveat"
  - "kimi over-exploration broad scope"
  - "kimi k2.7 dispatch timeout mitigation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support/006-broad-scope-timeout-caveat"
    last_updated_at: "2026-06-17T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented k2.7 over-exploration/timeout caveat + fixed stale k2.6 refs"
    next_safe_action: "Phase complete; validate + commit"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-149-006-broad-scope-timeout-caveat"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 6: broad-scope-timeout-caveat

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Kimi K2.7 Code docs note `--variant high` is "accepted-unverified" but do NOT capture a real operational failure mode: on a broad / large-repo dispatch at `--variant high`, `kimi-for-coding/k2p7` **over-explores** (many sequential file reads) and **exceeds a 600s timeout WITHOUT emitting** — and because opencode flushes only the final assistant message to stdout, the killed run yields **0 bytes** (looks like a hang though the model was working). The profile even recommends k2.7 for "sprawling / multi-repo" work — exactly the scope that triggers this. Adjacent cli-opencode references also still cite the retired `kimi-k2.6` / `opencode-go/kimi-k2.6`.

### Purpose
Record the failure mode + the proven mitigation (hard read-cap in the prompt + 1200s+ timeout + optionally omit `--variant`) in the canonical surfaces, and repair the stale k2.6 references — so future Kimi dispatches budget correctly instead of re-discovering the timeout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The over-exploration/timeout caveat + mitigation in `sk-prompt-models/references/models/kimi-k2.7-code.md` (§2, §5, §6) and `assets/model_profiles.json` (weaknesses).
- A brief operational caveat on the Kimi line in `cli-opencode/SKILL.md`.
- Repair of stale `kimi-k2.6` references in `cli-opencode/references/{cli_reference.md, context-budget.md}`.

### Out of Scope
- Re-benchmarking Kimi (this is a dated operational OBSERVATION, n=few, not a benchmark).
- Fixing the pervasive `149-`folder vs `154-`metadata packet-id drift (pre-existing; flagged for a separate cleanup).
- The `manual_testing_playbook` CO-036 k2.6 scenario (test-scenario change deferred to avoid the playbook count self-check).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt-models/references/models/kimi-k2.7-code.md` | Modify | §2/§5/§6 over-exploration caveat + mitigation |
| `sk-prompt-models/assets/model_profiles.json` | Modify | weaknesses: over-exploration/timeout entry |
| `cli-opencode/SKILL.md` | Modify | Kimi line operational caveat |
| `cli-opencode/references/cli_reference.md` | Modify | k2.6 row -> k2p7 |
| `cli-opencode/references/context-budget.md` | Modify | k2.6 -> k2.7-code (262,144) + caveat |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The failure mode + mitigation appear in both skills | kimi-k2.7-code.md §5 + model_profiles weaknesses + cli-opencode SKILL.md carry it |
| REQ-002 | Stale `kimi-k2.6` cli-opencode refs repaired | `cli_reference.md` + `context-budget.md` cite `kimi-for-coding/k2p7` / `kimi-k2.7-code` |
| REQ-003 | Caveat framed as observation, not benchmark | Text dated 2026-06-17, n=few, "--variant driver not isolated" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-prompt-quality-card-sync.sh` stays green after the edits (registry↔profile↔card sync intact).
- **SC-002**: `model_profiles.json` parses; both skills name the read-cap + 1200s+ mitigation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-generalizing from n=few | Misleading caveat | Framed as a dated observation; `--variant` driver explicitly not isolated |
| Risk | Breaking the prompt-card-sync guard | CI red | Ran the guard post-edit (PASS); additive notes only, no framework/slug change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is `--variant high` specifically the over-exploration driver, or is it scope alone? (Not isolated; a controlled A/B would confirm — feeds the parent's §4 open question on `--variant`.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Plan**: `plan.md` · **Tasks**: `tasks.md` · **Summary**: `implementation-summary.md`
- **Origin of the finding**: `system-spec-kit/028-memory-search-intelligence/007-memory-systems/research/research.md` (Kimi diagnosis).
- **Parent Spec**: `../spec.md`
<!-- /ANCHOR:related-docs -->
