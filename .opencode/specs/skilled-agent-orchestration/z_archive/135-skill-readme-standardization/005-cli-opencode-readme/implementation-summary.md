---
title: "Implementation Summary: cli-opencode README"
description: "The cli-opencode README now reads in the narrative voice, leads with the full-runtime dispatch and the two non-obvious rules, and drops the stale version and self-contradictory provider count. Batch A (cli-*) is complete."
trigger_phrases:
  - "cli-opencode readme shipped"
  - "batch A complete"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/005-cli-opencode-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped cli-opencode README; Batch A (4 cli-* skills) complete"
    next_safe_action: "Begin phase 006 (deep-ai-council README), Batch B"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Batch A done; full recipe holds across all four cli-* skills"
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
| **Spec Folder** | 005-cli-opencode-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-opencode README now opens with a human pitch and an at-a-glance table, explains the problem before the mechanism, and reads like a sibling of the other cli-* READMEs. This phase closes Batch A: all four cli-* skills are rewritten.

### Narrative rewrite

The README moved to the narrative skeleton with QUICK START showing the auth pre-flight, the default dispatch and a parallel-detached session, and HOW IT WORKS narrating the lifecycle, the full-runtime difference, the two non-obvious rules, the self-invocation guard, the provider pre-flight and agent delegation. It is 219 lines and HVR-clean.

### Distinctive value foregrounded

The rewrite leads with what makes cli-opencode different: a one-shot dispatch loads the project's whole runtime (memory database, code graph, skill advisor, every plugin and MCP tool), where a sibling cli-* sends only a raw model. The two non-obvious rules (closed stdin via `</dev/null`, never a top-level `--agent`) are stated up front.

### Stale facts dropped

The old README claimed skill version 1.0.0 (the skill is 1.3.13.0) and gave a self-contradictory provider count (three in section 1, two in the FAQ). The skill documents seven providers. The new template carries no version line, and the rewrite lists the seven providers accurately with no count contradiction.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-opencode/README.md` | Modified | Narrative-voice rewrite, full-runtime value and traps foregrounded |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Iteration 1 gathered the three use cases and invocation; iteration 2 verified flags, the provider roster and stale facts, each cited to a file. The host had the full SKILL.md in context. Both seats flagged the same two stale facts. The host synthesized a context report, dispatched both models to draft, then merged the two drafts. The merge favored DeepSeek's full-runtime-difference framing and kept the reference list accurate against the real `references/` directory.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead with the full-runtime difference | It is the reason to pick cli-opencode over a sibling, and the old README under-played it |
| State the two non-obvious rules up front | The closed-stdin hang and the top-level --agent rejection are the failures operators actually hit |
| Drop the version line and provider count | The template carries no version, and the old count was both stale and self-contradictory |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR scan (em dash, semicolon, Oxford-comma list) | PASS, clean |
| Stale version and count removed, seven providers listed | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The reference directory has seven files; the README links the navigable core set.** The README links the five core references SKILL.md highlights plus the two assets, rather than every file (context-budget and permissions-matrix are secondary), by design.
<!-- /ANCHOR:limitations -->
