---
title: "Implementation Summary: Phase 4: pi-ambiguous-denial"
description: "The Pi guard now tells you how to fix an ambiguous dispatch instead of only refusing it."
trigger_phrases:
  - "pi ambiguous denial implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/004-pi-ambiguous-denial"
    last_updated_at: "2026-10-10T20:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-004-pi-ambiguous-denial"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 4: pi-ambiguous-denial

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-pi-ambiguous-denial |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Pi guard now tells you how to fix an ambiguous dispatch instead of only refusing it.

### Phase 4: pi-ambiguous-denial

An ambiguous command is one that looks like a CLI dispatch but does not name exactly one executor literally. The refusal now adds: call one executor by its literal name, such as `pi -p` or `codex exec`, not through a variable, alias or path, and name that executor in the user request. The first sentence is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modified | Deny reason names the accepted shape |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modified | New case asserting it |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two cli-pi builds by DeepSeek V4.1 Flash at max effort on llmgateway. The orchestrator ran the suite after each: red, then green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Append, not rewrite | Docs and catalogs quote the first sentence |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run .skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` before | 35 passed |
| After the test | 1 failed, 35 passed |
| After the text | 36 passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Why the research run's read-only `node --test` command was classed as ambiguous is not examined here.** That is the inspector's classification, outside this phase.
<!-- /ANCHOR:limitations -->

---
