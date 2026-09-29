---
title: "Implementation Summary"
description: "Nothing is built yet. This Planned phase will measure, over an operator-labeled fixture of debug hypotheses, whether a Jev or Deem choice of the cheapest next check beats the best constant answer, with no caller seam in the repository."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/031-debug-next-check"
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase documents"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-031-debug-next-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-debug-next-check |
| **Completed** | Not completed. Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no file outside this folder has changed for it.

### Phase 31: debug-next-check

The plan adds one read-only script, `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` (proposed). It first shows that nothing in the repository could call a next-check model today. Then, over a fixture of debug hypotheses you label, it scores the four constant answers and asks Jev or Deem which check is cheapest, sending Jev only the rows you accept. See `spec.md` for the Keep Rule and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Not started | The script, its vitest file and the `system-spec-kit` docs the build will change are listed in `spec.md` section 3 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Only the planning documents exist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Beat the best constant answer, not only `read_code` | The best constant includes the research's kill line and cannot be easier to beat |
| Withhold every row you did not mark `jev_ok` | The rows are your own debug notes. Deem keeps them on the machine, so it runs every row |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build verification | Not run. The phase is Planned |
| Planning documents: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check --strict` | Run at authoring time by the authoring session. Its output is reported there, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built.** Every requirement in `spec.md` is open until the build runs. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.
2. **No seam and no reader.** Even a keep leaves R18 short of its promote line until a caller and a reader are named.
<!-- /ANCHOR:limitations -->

---
