---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE. Documented Kimi K2.7 Code's broad-scope over-exploration -> 600s-timeout -> 0-bytes failure mode + mitigation across sk-prompt-small-model + cli-opencode and repaired stale kimi-k2.6 references; card-sync guard + strict validate green."
trigger_phrases:
  - "kimi k2.7 timeout caveat status"
  - "over-exploration mitigation done"
  - "kimi k2.6 refs repaired"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/006-broad-scope-timeout-caveat"
    last_updated_at: "2026-06-17T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented k2.7 over-exploration/timeout caveat + fixed stale k2.6 refs"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/references/models/kimi-k2.7-code.md"
      - ".opencode/skills/sk-prompt-small-model/assets/model_profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-149-006-broad-scope-timeout-caveat"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-broad-scope-timeout-caveat |
| **Status** | DONE - caveat + mitigation in both skills, stale k2.6 refs repaired, guard + strict validate green |
| **Created** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE.** The Kimi K2.7 Code surfaces now record a real operational failure mode they previously missed: at `--variant high` on a broad / large-repo dispatch, `kimi-for-coding/k2p7` **over-explores** (many sequential reads) and **exceeds a 600s timeout WITHOUT emitting** — and because opencode flushes only the final assistant message to stdout, the killed run yields **0 bytes** (looks like a hang though the model was working). The mitigation (hard read-cap in the prompt + 1200s+ timeout + optionally omit `--variant`) is now documented, and adjacent stale `kimi-k2.6` references were repaired.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-prompt-small-model/references/models/kimi-k2.7-code.md` | Modified | §5 load-bearing read-cap + failure mode; §6 `variant_flag` caveat; §2 wall-clock observation |
| `sk-prompt-small-model/assets/model_profiles.json` | Modified | `kimi-k2.7-code` weaknesses: over-exploration/timeout entry |
| `cli-opencode/SKILL.md` | Modified | `kimi-for-coding/k2p7` line operational caveat |
| `cli-opencode/references/cli_reference.md` | Modified | `opencode-go/kimi-k2.6` row → `kimi-for-coding/k2p7` |
| `cli-opencode/references/context-budget.md` | Modified | `kimi-k2.6` → `kimi-k2.7-code` (262,144) + caveat; prose ref |
| `149/spec.md`, `149/graph-metadata.json` | Modified | Phase-6 map row + `children_ids` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The finding came from the 028/007 memory-systems mining run, where `kimi-for-coding/k2p7 --variant high` timed out twice at 600s with 0 bytes; reading the 65 KB stderr showed it was reading files productively the whole time, not hung. A tightly-scoped relaunch (≤4-read cap + 1200s + no `--variant`) returned a clean 863-byte block in exactly 4 reads (exit 0), proving the mitigation. The doc edits put the caveat where future dispatchers read it (profile §5/§6, registry weaknesses, executor card, budget reference). The closing gate is the prompt-card-sync drift guard + a `model_profiles.json` parse + strict `validate.sh` on this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Frame as a dated observation, not a benchmark | n=few (2 timeouts + 1 fixed run); honest about evidence strength |
| Do not claim `--variant high` is the sole driver | The fix changed scope + variant + timeout together, so the driver is not isolated |
| Repair the stale `kimi-k2.6` refs in the same pass | They are the same model-version drift this packet (Kimi K2.7 support) owns |
| Defer the `manual_testing_playbook` CO-036 k2.6 scenario | A test-scenario edit risks the playbook's hard-coded file-count self-check; out of this phase's scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Caveat + mitigation present in both skills | PASS (kimi-k2.7-code.md §5/§6 + model_profiles weaknesses + cli-opencode SKILL.md) |
| `model_profiles.json` parses | PASS (`node` JSON.parse → valid) |
| Registry↔profile↔card sync intact | PASS (`check-prompt-quality-card-sync.sh` → GUARD PASS, CHECK 1–4, exit 0) |
| Stale `kimi-k2.6` cli-opencode refs repaired | PASS (cli_reference.md + context-budget.md now cite `kimi-for-coding/k2p7` / `kimi-k2.7-code`) |
| `validate.sh <this phase> --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Observation, not benchmark (n=few).** Two timeouts + one fixed run. A controlled A/B (broad scope with vs without `--variant high`, same timeout) would isolate whether `--variant high` specifically drives the over-exploration. Recorded as an open question; feeds the parent's §4 `--variant` question.
2. **The `manual_testing_playbook` CO-036 `kimi-k2.6` scenario was not updated.** Deferred to avoid disturbing the playbook's file-count self-check; a separate cleanup can re-point it to `kimi-for-coding/k2p7`.
3. **A linter normalized the pre-existing `149`/`154` packet-id drift during this phase.** That was a bonus side effect of touching the packet metadata, not an authored goal of this phase.
<!-- /ANCHOR:limitations -->
