---
title: "Implementation Summary"
description: "Not started. This phase has planning documents only, and it is planned to dispatch cli-opencode and the deep-loop runtime to the argv that each installed OpenCode version accepts."
trigger_phrases:
  - "cli opencode dual dispatch implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/006-cli-opencode-dual-dispatch"
    last_updated_at: "2026-10-18T12:45:06Z"
    last_updated_by: "template-author"
    recent_action: "Planning documents filled"
    next_safe_action: "Start the phase once its open questions are settled"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-cli-opencode-dual-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-cli-opencode-dual-dispatch |
| **Status** | Planned |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not started. This phase has planning documents only. The planned file changes are listed in `spec.md` section 3.

### Phase 6: cli-opencode-dual-dispatch

Not started. When it is built, the deep-loop runtime will pick the dispatch argv from the installed OpenCode major, read from `--version` output, and a v2 child will run standalone with its environment.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Not started | The planned files are listed in `spec.md` section 3. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not started. The planned route is a red-first unit run, a regression run of the deep-loop suite, one smoke dispatch on each version, and a child environment check. The steps are in `plan.md` section 4.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Not started | The frozen choices for this phase are in `goal.md` section 1. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop baseline (T001): `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage` | Not started |
| Red run (T007): the new suite, before the change | Not started |
| Smoke dispatch on 1.19.3 (T015): the builder, exit status, token and lineage file | Not started |
| Smoke dispatch on 2.0.32 (T016): the builder with `--standalone`, exit status, token and lineage file | Not started |
| Child environment (T017): fixture plugin log line `AI_SESSION_CHILD=1` | Not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** No check has run, so no limitation is known yet. The live smoke checks need provider credentials, and the Pi guard blocks a nested `opencode run`, so the orchestrator runs them.
<!-- /ANCHOR:limitations -->

---
