---
title: "Implementation Summary: cli-codex README"
description: "The cli-codex README now reads in the narrative voice, grounded in a two-iteration deep-context gather and a DeepSeek + MiMo dual-draft, with the two silent codex exec traps surfaced up front."
trigger_phrases:
  - "cli-codex readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/003-cli-codex-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped cli-codex README via the full recipe"
    next_safe_action: "Begin phase 004 (cli-devin README)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full recipe repeated cleanly: gather, verify, synthesize, dual-draft, merge, validate"
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
| **Spec Folder** | 003-cli-codex-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-codex README now opens with a human pitch and an at-a-glance table, explains the problem before the mechanism, and reads like a sibling of cli-claude-code and the sk-git golden example.

### Narrative rewrite

The README moved to the narrative skeleton: pitch, AT A GLANCE, problem-first OVERVIEW, QUICK START with four worked dispatches (default, web research, diff review), HOW IT WORKS (lifecycle, the two traps, self-invocation guard, profile routing and reasoning effort, auth and handback), INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS. It is 230 lines and HVR-clean.

### The two traps surfaced

The rewrite leads with the two `codex exec` defaults that silently break tasks: the read-only default sandbox (edit tasks no-op without `--sandbox workspace-write` or `--full-auto`) and the implicit service tier (pass `-c service_tier="fast"` explicitly). The old README listed flags but buried these.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-codex/README.md` | Modified | Narrative-voice rewrite with the two traps surfaced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Iteration 1 gathered purpose, modes and invocation; iteration 2 verified flags, sandbox levels and the profile roster, each cited to a file. The host cross-read SKILL.md directly, synthesized a context report, then dispatched both models to draft. The host merged the two drafts, fixed one HVR slip and confirmed every cited path resolves.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead HOW IT WORKS with the two silent traps | They are the failures operators actually hit; the old README buried them in a flag list |
| Keep the profile roster and reasoning-effort table | Codex routes via `-p` profiles in config.toml, and only reasoning effort varies on gpt-5.5 |
| Merge MiMo's quick start with DeepSeek's HOW IT WORKS depth | MiMo showed --search and the review subcommand well; DeepSeek had the fuller traps and profile table |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR scan (em dash, semicolon, Oxford-comma list) | PASS, clean after one semicolon fix |
| Flags and sandbox levels match SKILL.md | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None specific to this README.** The skill's facts were accurate; the rewrite is voice and structure plus surfacing the two traps.
<!-- /ANCHOR:limitations -->
