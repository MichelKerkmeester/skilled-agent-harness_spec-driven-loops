---
title: "Implementation Summary: Dispatch Surface Truthfulness"
description: "Removing a quota-dead default and realigning an under-reported executor roster, after both together turned a four-iteration review into 7h40m of silence."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/059-dispatch-surface-truthfulness"
    last_updated_at: "2026-08-31T03:09:18Z"
    last_updated_by: "claude-code"
    recent_action: "Removed the quota-dead default and realigned the executor roster"
    next_safe_action: "Consider an automated roster check against the runtime constant"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-dispatch-surface-truthfulness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

**Status:** Complete

| Field | Value |
|-------|-------|
| **Spec Folder** | 059-dispatch-surface-truthfulness |
| **Completed** | 2026-08-31 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-opencode dispatch surface no longer names a default model. It states that there is deliberately none, and why: a hardcoded default becomes a deadlock the day its quota runs out, and that failure is indistinguishable from a hang — zero output, zero CPU, indefinitely. In its place is a pre-flight check that runs in under a minute, using the debug log level that surfaces the quota message normal mode swallows entirely.

The deep-loop review contract declared three executors where the runtime accepts seven. The authored source now lists the full roster, and the compiled contract was regenerated from it with the compiler's write flag rather than hand-edited — the first attempt printed to stdout without `--write` and left the file unchanged, which is worth knowing.
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

The cause was confirmed rather than inferred: at debug level the exhausted model reports `AI_APICallError: Monthly usage limit reached. Resets in 7 days`, while at normal verbosity it produces 39 bytes and nothing else. A trivial one-word prompt reproduced the same silence, isolating the model from the command that appeared to hang.

The pre-flight was then proven on both sides — the exhausted model reports quota, and two alternatives answered at exit 0. That check took three minutes and would have replaced 7 hours 40 minutes of silence.

Roster alignment was verified by diffing the executor names in both documents against the runtime's exported constant; all three now agree.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The roster is aligned by hand against an exported constant, which is the same maintenance burden that let it drift in the first place. An automated check comparing the two would remove the class rather than this instance.

The sibling deep commands were not audited for the same stale roster, and historical benchmark reports still name the old default — those record what actually ran and were deliberately left alone.
<!-- /ANCHOR:limitations -->

---


