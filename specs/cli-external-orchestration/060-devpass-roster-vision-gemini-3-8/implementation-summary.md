---
title: "Implementation Summary: the CLI roster truth pass — DevPass, vision, Gemini 3.8, V4 Pro retirement, pi repair"
description: "Placeholder summary for a packet that is planned but not yet implemented; it records the research already banked and states plainly that no in-scope file has been changed."
trigger_phrases:
  - "devpass roster status"
  - "gemini 3.8 swap status"
  - "cli roster truth pass"
  - "v4 pro retirement status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/060-devpass-roster-vision-gemini-3-8"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Created stub doc; implementation not started"
    next_safe_action: "Run T002 baseline capture, then execute WS1-WS3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-060-devpass-vision-gemini"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 060-devpass-roster-vision-gemini-3-8 |
| **Completed** | Not completed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is planned, not implemented. It exists so the DevPass
onboarding, the vision rollout, the Gemini version swap, the DeepSeek V4 Pro retirement
and the pi-config repair are all specified before any skill document or enforced roster
is edited, and this file is the stub that will hold the write-up once that work runs.

What has been done is research, and it is banked rather than remembered. The DevPass
credential was confirmed live, the four chosen models were read out of the provider
catalog with their thinking ladders and prices, the vision variant was checked
provider by provider, and the operator's gate on the widest Gemini reach was run
against both the cursor and devin CLIs. Those captures sit in `scratch/baseline/` so
the next session reads evidence instead of trusting a summary of it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | The scope, the four-model roster, and the two false claims to correct |
| `plan.md` | Created | Three workstreams over one verification gate |
| `tasks.md` | Created | Ordered tasks; Phase 1 complete, Phases 2 and 3 pending |
| `acceptance-criteria.md` | Created | Twelve closure criteria, all Unmet |
| `scratch/baseline/` | Created | Four live captures backing the Phase 1 claims |

No file outside this packet folder has been touched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The verification described in `plan.md` has not run, and the baseline
it depends on has not been captured — `tasks.md` T002 must execute before the first
edit, or the "no regressions" claim at the end will have nothing to measure against.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Four DevPass models, not 183 | The cli-opencode roster is enforced by discipline alone, so its size is the only thing protecting it; the operator chose these four on 2026-09-04 |
| The Gemini swap reaches cursor and devin | The operator chose the widest option; leaving those two at 3.7 would have the hub name one version and enforce another |
| Fix two false claims found in passing | Both sit inside paragraphs this work rewrites anyway; shipping a known-false sentence you just edited is worse than the edit being slightly wider |
| Repair `.pi/` after all | The operator's "also fix pi" instruction overrode the earlier decision to name the gap and leave it; an in-the-moment instruction outranks a scope line in this packet's own spec |
| Remove three V4 Pro ids, not two | `deepseek-v4` is the V4 Pro family uid per the devin catalog, so a `-pro` grep would have reported a clean removal while leaving the model dispatchable |
| Repoint the recommendations, not just the ids | Removing an id while leaving five documents recommending it converts a documentation problem into a dispatch-time rejection |
| Leave the 2026-05-04 incident record naming V4 Pro | Retiring a model does not change what it did; editing that name would falsify a true record |
| Split the GLM `max` fix into packet 061 | What looked like a stale doc sentence turned out to be a shipped runtime pin; a live-behavior defect deserves its own revert story rather than riding inside a feature packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet structure and metadata | PASS pending — recorded here once `validate.sh --strict` prints `RESULT: PASSED` |
| Guard suites, typecheck, live dispatch, vision probe | NOT RUN — implementation has not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Vision is documented from a capability flag, not a round trip.** `attachment: true` describes the provider catalog; only the T024 image dispatch proves an image actually gets read. Until that runs, the vision rows are list-verified and must say so.
2. **DeepSeek V4 Pro stays live upstream.** `devin models list` still offers all three tiers, and `opencode models` still lists V4 Pro on four providers. This retirement is a curation decision for this hub, not an upstream removal, so the catalogs must read as *excluded* rather than *absent*.
3. **`.pi` gets two surgical fixes, not an audit.** WS6 deletes one dead model block and adds one missing id. The other nine `enabledModels` entries and `defaultModel` are not reconciled against the live providers, and a similar drift may exist there.
<!-- /ANCHOR:limitations -->
