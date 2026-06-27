---
title: "Implementation Summary: sk-design two real bugs"
description: "Not started. Scaffold for the two real bugs: regenerate the md-generator backend package.json so npm install works, and fix the audit router scoring loop so it iterates (keyword, weight) and loads the shared register. A later subagent implements and verifies."
trigger_phrases:
  - "sk-design real bugs status"
  - "audit router loop outcome"
importance_tier: "important"
contextType: "implementation"
status: not-started
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/017-real-bugs"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the not-started status stub"
    next_safe_action: "Regenerate the manifest, fix the audit loop, then record evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-017-real-bugs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-design two real bugs

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-sk-design-parent/017-real-bugs |
| **Completed** | Not started (scaffold only) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is scaffolded and not started. The planned work fixes two real bugs: the md-generator backend ships a `package-lock.json` with no `package.json`, breaking `cd backend && npm install`, and the audit router scoring loop iterates a plain keyword list as if it held `(keyword, weight)` tuples, so it ignores weights and will not run, while the router-replay never loads the shared register that scoring and remediation require.

A later subagent will record the regenerated manifest, the corrected router loop, the register load, and the verification evidence here.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The bug shapes are grounded in `../015-per-skill-improvement-research/005-md-generator/research/lineages/gpt55fast/research.md` (the missing backend manifest) and `../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md` (R1, the keyword-loop defect and the missing register load), and corroborated by the 015 synthesis "One real bug" finding.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regenerate `package.json` from the lockfile plus documented dependencies | The lockfile and README carry the dependency truth, so the manifest can be reconciled faithfully rather than guessed |
| Reuse the 016 loader mechanism for the audit register load | Avoids a second loader path and keeps the guard tight |
| Preserve the configured intent weights exactly | The scoring-loop fix must change how weights are read, not the weights themselves |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd backend && npm install` succeeds | PENDING |
| Audit router parses, runs, and the replay loads `../shared/register.md` | PENDING |
| Five representative audit prompts route unchanged after the loop fix | PENDING |
| `validate.sh --strict` on this packet | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** This is a scaffold. The manifest is missing and the audit router still crashes on tuple unpacking in the live family.
2. **Register-load depends on 016.** The audit register load reuses the `../016-register-loader-contract` mechanism, so it sequences after or alongside that phase.
<!-- /ANCHOR:limitations -->
