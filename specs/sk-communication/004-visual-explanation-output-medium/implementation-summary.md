---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-visual-explanation-output-medium"
    last_updated_at: "2026-09-12T10:00:14Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-visual-explanation-output-medium"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-visual-explanation-output-medium |
| **Completed** | 2026-09-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

The visual explanation lane publishes its output instead of fencing it in the reply.

- `.opencode/commands/rewrite/explain-visually.md` — `--artifact` becomes `--inline`, the default
  inverts to publishing, and Step 6 states where the page goes, that it inlines every style, and what
  to do in a runtime with no publish surface. The status table gains a row per outcome.
- `.opencode/skills/sk-communication/SKILL.md` — the lane table and the command list say the visual is
  published; the out-of-scope rule keeps barring edits to existing files while allowing new material.
- `.opencode/skills/sk-communication/references/visual-explanation.md` — records why the default is
  publishing: a published page renders Mermaid as a diagram, a fenced block in a terminal shows its
  own source, and a command whose job is a visual cannot default to source.
- `.opencode/skills/sk-communication/README.md` — the example and the lane note follow the new flag.

Verified: `ci-skill-root-metadata.cjs` 13 of 13 and `ci-leaf-manifest-freshness.cjs` 13 of 13 both
pass. `parent-skill-check.cjs` was run and its six failures discarded as the wrong gate — this is a
standalone skill with no `mode-registry.json` or `hub-router.json`, and the run predates the change.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

[How was this tested, verified and shipped? What was the rollout approach?]
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| [What was decided] | [Active-voice rationale with specific reasoning] |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| [Validation, lint, tests, manual check] | [PASS/FAIL with specifics] |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **[Limitation]** [Specific detail with workaround if one exists.]
<!-- /ANCHOR:limitations -->

---


