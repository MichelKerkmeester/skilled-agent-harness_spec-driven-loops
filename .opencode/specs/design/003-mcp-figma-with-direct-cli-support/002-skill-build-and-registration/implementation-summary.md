---
title: "Implementation Summary: mcp-figma skill build and registration"
description: "Built the mcp-figma skill v0.1.0 to drive Figma Desktop from the terminal via the silships figma-cli (npm figma-ds-cli): the gated command surface, eight install and safety scripts, the optional Code Mode figma MCP, schema-2 graph registration with reciprocal sibling edges, and live install of figma-ds-cli 1.2.0 from the repo build. Deliverable is the skill at .opencode/skills/mcp-figma/."
trigger_phrases:
  - "mcp-figma build summary"
  - "figma skill build outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/003-mcp-figma-with-direct-cli-support/002-skill-build-and-registration"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "mcp-figma v0.1.0 shipped, registered, and live-verified; record authored"
    next_safe_action: "Operator reviews the record; both phases are complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-002-skill-build-and-registration"
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
| **Spec Folder** | design/003-mcp-figma-with-direct-cli-support/002-skill-build-and-registration |
| **Completed** | 2026-06-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet records the build of the `mcp-figma` skill, which lets an agent drive Figma Desktop from the terminal. The deliverable lives at `.opencode/skills/mcp-figma/`. This is a retroactive record of completed work and does not re-do the build or edit the skill.

### Terminal control of Figma
The skill carries the install, connect, read, author, and export directions. The install direction selects the full repo build of the silships figma-cli (published to npm as `figma-ds-cli`) over the minimal npm publish, and warns never to install the unrelated npm `figma-cli` package. The connect direction defaults to safe (the FigCli plugin, no patch) and gates yolo (which patches Figma's app.asar) behind confirmation with a rollback script. The read direction calls the read-only commands over the live Figma Desktop session through a local daemon, and the author and export directions cover designs, tokens, variables, components, design-system extract to a DESIGN.md, and import to tailwind, css, tokens, or storybook.

### The gated command surface
The figma-cli command surface is classified read-only, mutating, or destructive, with `eval`, `raw`, and `run` treated as arbitrary mutation. Read-only commands surface freely, mutating commands are gated behind explicit confirmation, and destructive commands are kept off the default path. Local exports require explicit no-overwrite paths.

### The install and safety scripts
Eight bash scripts ship with the skill: `install.sh` (selects the repo build, with `--source auto` upgrading a stale npm install), `connect-safe.sh` and `connect-yolo.sh` (the two connect modes), `daemon.sh` (the local daemon), `doctor.sh` (diagnostics), `unpatch.sh` (rolls back the yolo app.asar patch), `print-utcp-snippets.sh` (the Code Mode wiring snippets), and the shared `_common.sh`.

### The optional Figma MCP
The CLI is the primary surface; the Figma MCP is opt-in. The skill documents the community Framelink `figma` manual reachable through this project's Code Mode, which exposes `get_figma_data` and `download_figma_images`, for pulling design context into the agent for codegen.

### Modeled on the sibling skills and registered
The package follows the sibling terminal-control shape (`mcp-open-design`, `mcp-chrome-devtools`, `mcp-magicpath`): a SKILL.md runtime contract, four references, a feature catalog, a manual testing playbook, a README, an INSTALL_GUIDE, and a v0.1.0.0 changelog. Schema-2 graph metadata was written and reciprocal sibling edges were added so the skills are linked.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `SKILL.md` | Created | Runtime contract: install, connect, read, author, export directions, the traps, and the gating rules |
| `references/figma_cli_reference.md` | Created | The figma-cli command surface and daemon model |
| `references/tool_surface.md` | Created | The read-only, mutating, and destructive command tiers |
| `references/mcp_wiring.md` | Created | The optional Code Mode `figma` MCP |
| `references/troubleshooting.md` | Created | Failure paths and recovery |
| `scripts/` (8 scripts) | Created | Install, safe and yolo connect, daemon, doctor, unpatch, UTCP snippets, shared helpers |
| `feature_catalog/feature_catalog.md` | Created | Capability inventory |
| `manual_testing_playbook/manual_testing_playbook.md` | Created | Operator scenarios |
| `README.md` | Created | Narrative overview, troubleshooting, FAQ |
| `INSTALL_GUIDE.md` | Created | Phase-based install and safety guide |
| `changelog/v0.1.0.0.md` | Created | Initial release changelog |
| `graph-metadata.json` | Created | Skill graph topics, edges, source docs |
| Sibling skills' `graph-metadata.json` | Modified | Reciprocal sibling edges |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this file | Created | Packet control docs (this retroactive record) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A model-on-sibling skill build. The phase 001 research supplied the source of truth for the figma-cli surface, the MCP landscape, and the install path, and the sibling terminal-control skills supplied the structural template. The skill was authored in that shape with the install, connect, read, author, and export directions, the eight install and safety scripts, and a read-only, mutating, and destructive gating policy. It was then checked with `package_skill.py --check`, graph-registered with reciprocal sibling edges, and live-verified: figma-ds-cli 1.2.0 was installed from the repo build (npm publishes only a minimal 1.0.0), and the Code Mode `figma` manual was confirmed to expose `get_figma_data` and `download_figma_images`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Install the full repo build, never npm `figma-cli` | npm publishes only a minimal 1.0.0 of `figma-ds-cli`, and the package literally named `figma-cli` is an unrelated tool |
| Default to safe connect, gate yolo with rollback | Safe (plugin) connect needs no patch, and the yolo app.asar patch must be reversible via unpatch.sh |
| Gate every mutating command, omit destructive ones from the default path | `eval`, `raw`, and `run` can mutate arbitrarily, so the policy keeps them off the default path |
| Keep the Figma MCP optional via Code Mode | The Framelink `figma` manual is already reachable through Code Mode for codegen context, but the CLI is primary |
| Model the skill on the sibling terminal-control skills | A consistent house shape across the terminal-control skills, and a proven package structure |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS, skill valid |
| Command policy coverage | PASS, every command classified read-only, mutating, or destructive |
| Structure parity with the sibling skills | PASS, same SKILL.md, references, catalog, playbook, README, changelog shape |
| Graph registration | PASS, schema-2 metadata plus reciprocal sibling edges |
| Live install | PASS, figma-ds-cli 1.2.0 installed from the repo build (npm has only a minimal 1.0.0) |
| Code Mode MCP discovery | PASS, the `figma` manual exposes `get_figma_data` and `download_figma_images` |
| Voice sweep | PASS, no em dashes, no new prose semicolons |
| `validate.sh --strict` (this packet) | PASS, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full surface needs the repo build.** npm publishes only a minimal `figma-ds-cli@1.0.0` without the safe connect, daemon, or extract commands, so the install path depends on the silships repo being reachable.
2. **The yolo connect patches Figma's app bundle.** It is gated and reversible via `unpatch.sh`, but it modifies the local Figma install, so safe (plugin) connect is the default.
3. **The MCP is community, not first-party.** The optional Figma MCP path uses the community Framelink `figma` manual through Code Mode, which is opt-in and outside the figma-cli surface.
<!-- /ANCHOR:limitations -->
