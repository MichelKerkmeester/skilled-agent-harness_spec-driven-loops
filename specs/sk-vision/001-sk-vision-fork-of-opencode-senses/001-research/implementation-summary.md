---
title: "Implementation Summary: sk-vision 001 research"
description: "You now have a locked fork, housing, and dual-host adapter plan for sk-vision before any skill code is written."
trigger_phrases:
  - "sk-vision research summary"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/001-research"
    last_updated_at: "2026-08-16T06:28:08.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Bumped continuity after successor spec enrichment."
    next_safe_action: "Implement 002-skill-scaffold from its child spec."
    blockers: []
    key_files:
      - "research/research.md"
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-research-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone skill, shipped v0.2.0, Pi registerTool, MIT rebrand."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-research |
| **Completed** | 2026-08-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can start later sk-vision children from four accepted ADRs instead of re-reading the Senses dump. This child turned a source dump into a phase packet and locked housing, fork baseline, and host adapters.

### Research pack

The investigation in `research/research.md` inventories shipped Senses v0.2.0, separates it from PLAN.md, and cites live Pi 0.84.2 types for `registerTool` and `InputEvent.images`. OpenCode hooks come from dumped `plugin.ts`. `@opencode-ai/plugin` `.d.ts` was not installed locally, so that surface stays labeled unknown.

### Architecture lock

Later work puts a standalone skill around a host-agnostic JSON-RPC core, with an OpenCode plugin and a Pi extension as thin adapters. That is ADR-001 through ADR-003. ADR-004 rebrands package, env, and cache names under MIT.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Track metadata was rewritten first. `create.sh --phase` scaffolded the existing dump folder without deleting `context/`. `upgrade-level.sh` failed because L2 addendum files are missing, so L3 addons were rendered with `inline-gate-renderer.sh`. Pi types were read from the installed 0.84.2 package. Close gate is `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Standalone skill with in-skill package | One advisor identity; matches sk-communication |
| Fork shipped v0.2.0 | PLAN.md audio/video/docs are unbuilt |
| Pi `registerTool` plus native images | Live types confirm the API |
| Rebrand to sk-vision | Avoid npm/cache collision; keep MIT notice |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pi registerTool in 0.84.2 types.d.ts | PASS, line ~902 |
| Pi InputEvent.images and ImageContent | PASS, InputEvent ~628; ImageContent in pi-ai types |
| Dump plugin hooks | PASS, `../context/src/plugin.ts` |
| context/ retained after scaffold | PASS, glob still lists README and runtime.py |
| upgrade-level.sh | FAIL, missing addendum; renderer workaround used |
| validate.sh child --strict | close gate; rerun from final metadata |
| validate.sh parent --recursive --strict | close gate; rerun from final metadata |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No GPU run.** First-token latency and VRAM stay unverified. Workaround: measure in a later child on a machine with Ampere or Apple Silicon.
2. **OpenCode plugin types not installed.** Hook names are confirmed from dumped source, not from `@opencode-ai/plugin` `.d.ts`. Workaround: install that package when implementing 004.
3. **upgrade-level.sh is broken** for L1 to L3 in this repo until addendum files return. Workaround: `inline-gate-renderer.sh --level 3`.
<!-- /ANCHOR:limitations -->
