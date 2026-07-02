---
title: "Implementation Summary: mcp-open-design generation-flow correction"
description: "Corrected the mcp-open-design skill from a one-shot generation model to the live-verified multi-turn reality: turn 1 returns a discovery form, od ui respond fires the build, od artifacts create only adds a file. Added od run verbs and the HTTP API surface, bumped to v1.1.0, validated clean."
trigger_phrases:
  - "mcp-open-design correction summary"
  - "open design generation flow outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/007-mcp-open-design-generation-flow-correction"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Correction shipped to v1.1.0; package check and strict validate clean"
    next_safe_action: "Operator reviews the corrected skill and v1.1.0.0 changelog"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:b280e6c42ff242802f330a89293edbf45252ae8d9bb0624c3f5bd341486f5086"
      session_id: "session-150-007-mcp-open-design-generation-flow-correction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-mcp-open-design-generation-flow-correction |
| **Completed** | 2026-06-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet corrected the `mcp-open-design` skill to the live-verified reality of how Open Design generates designs. The v1.0.0 skill, built from a reverse-engineering pass, described generation as a one-shot `start_run` that returns finished files. A live generation test this session proved that wrong, and every affected doc now matches what was proven.

### The load-bearing fix: generation is multi-turn
A single `start_run` (MCP) or `od run start` (CLI) fires turn 1 only, which returns a GenUI discovery question-form and ends `awaiting_input` with zero files. The design is built only after the form is answered with `od ui respond` (or a follow-up message), which fires the build run that writes `index.html` and gives the project an `entryFile` and a `previewUrl`. This is corrected in `SKILL.md` Section 3, `tool_surface.md` Section 5, `od_cli_reference.md` Section 5, the feature catalog, the manual testing playbook, and the README, and locked in by a new ALWAYS rule and a new NEVER rule.

### The user-facing bug: a file-add is not a design
`od artifacts create` only adds one file to a project. It does not spawn a run, render a design, or update the preview. Every run-direction doc now separates "add a file" from "create a visible design".

### Added surfaces
The `od run start|watch|cancel|list|info` verbs were added to the CLI reference. The HTTP API surface is now documented (the four interchangeable surfaces, the verified endpoints, `/api/mcp/install-info` as the canonical config source, and the ephemeral-port-rotation warning). The wiring config shape was confirmed correct, with `command[0]` named as the "Open Design Helper" binary.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `SKILL.md` | Modified | Multi-turn Run Direction, artifacts callout, four-surface note, ALWAYS rule 8, NEVER rule 5, version 1.1.0 |
| `references/tool_surface.md` | Modified | Corrected start_run, multi-turn generation flow, artifacts separation |
| `references/od_cli_reference.md` | Modified | od run verbs, multi-turn section, HTTP API surface, resolved command[0] item |
| `references/mcp_wiring.md` | Modified | install-info canonical, command[0] is the Helper binary, shape confirmed |
| `feature_catalog/feature_catalog.md`, `04--runs/headless-runs.md` | Modified | Run feature to multi-turn |
| `manual_testing_playbook/manual_testing_playbook.md`, `03--gated-runs/gated-verb-confirm.md` | Modified | RUN-001 to the multi-turn flow with the discovery-form answer |
| `README.md` | Modified | Run narrative, troubleshooting rows, FAQ |
| `changelog/v1.1.0.0.md` | Created | Generation-flow correction changelog |
| `graph-metadata.json` | Modified | Topics, source_docs, causal summary, changelog entry |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this file | Created | Packet control docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A source-of-truth correction. The live-verified facts were the source of truth, and each affected doc was edited to match, with each corrected claim tagged confirmed (live-verified this session) or inferred so a reader can tell proven facts from reasoning. The order followed the requested priority: generation-is-multi-turn plus the artifacts separation first, then the `od ui respond` linkage, then the `od run` verbs, then the HTTP API surface. The confirmed facts from v1.0.0 (wiring shape, gating, daemon-running, node invocation, roughly 18 tools) were preserved. SKILL.md was trimmed back under the 3000-word cap after the additions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the live test as authoritative, do not re-run it | The facts were supplied as proven; re-running risks a closed app and adds nothing to a documentation correction |
| Lock the fix with an ALWAYS rule and a NEVER rule | A grep-clean correction can still regress later; the rules make the multi-turn contract explicit at the point agents read |
| Keep `od artifacts create` in the gating lists but disclaim it everywhere | It is a real verb to gate, but it must never read as the design path |
| Tag every corrected claim confirmed or inferred | Legibility: a reader can separate live-verified facts from reasoning |
| Leave pre-existing prose semicolons in unrelated rules untouched | Scope lock; only new prose follows the no-semicolon rule |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS, skill valid, no word-count warning |
| One-shot regression grep | PASS, no doc claims a single run produces a finished visible design; every start_run mention is qualified |
| Artifacts-create separation | PASS, each run-direction doc disclaims artifacts create as a design path |
| Voice sweep | PASS, no em dashes, no new prose semicolons |
| `validate.sh --strict` (this packet) | PASS, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Documentation correction, not a code change.** The skill is markdown; the behavioral fix lands by changing what an agent reads, not by changing a binary.
2. **The live test is the only evidence.** The multi-turn flow, the HTTP surface, and the port rotation are tagged live-verified this session; they were not independently re-run in this packet.
3. **Headless `od --no-open` not re-exercised.** Whether the full drive-without-GUI path works end to end remains inferred (`od_cli_reference.md` Section 7, item 5).
4. **Per-verb auth requirements partly open.** Token needs for a user-invoked generation or media call are still uncertain (Section 7, item 6).
<!-- /ANCHOR:limitations -->
