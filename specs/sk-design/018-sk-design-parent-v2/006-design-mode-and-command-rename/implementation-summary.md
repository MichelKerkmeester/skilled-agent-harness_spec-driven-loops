---
title: "Implementation Summary: the design mode and command rename"
description: "Both moved modes and both commands take the hub name, 249 files move as renames, and the routing comes back byte-identical."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/006-design-mode-and-command-rename"
    last_updated_at: "2026-09-06T16:22:20Z"
    last_updated_by: "claude-code"
    recent_action: "Renamed both modes and both commands to the design hub"
    next_safe_action: "Run phase 007 against the renamed modes"
    blockers: []
    key_files:
      - ".opencode/commands/design/chart.md"
      - ".opencode/commands/design/diagram.md"
      - ".opencode/agents/design.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-design-mode-and-command-rename |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-create-chart` is now `sk-design-chart`, `sk-create-diagram` is `sk-design-diagram`, and their
commands are `/design:chart` and `/design:diagram`. All four modes of the hub now carry its name.

### Why this reverses an earlier decision

Phase 004 kept the `sk-create-` prefix and recorded the reasoning: a rename doubles the path rewrite
across four mirrors, the scorer shim, the command bridges and the canaries, for no measurable gain.
That was sound for what was known then. Two things have since been measured that were not available
to it. The closing phase found a compiled bundle rule pairing an `sk-doc` mode with
`sk-create-diagram` that blocked every push, and four playbook fixtures still asserting `sk-doc` owns
FLOWCHART — both surviving because the old name kept the old association alive. And the renamed modes
score 0.9139 where the old names scored 0.82.

### The move

249 files renamed inside the two trees, 8 more for the commands and their assets, 2 diagram documents
named for the old command. 138 files carrying live references rewritten. 527 files under `specs/` and
8 benchmark report directories deliberately left as written.

The command assets follow the design family's convention rather than the create family's:
`chart-auto.yaml`, not `design-chart-auto.yaml`, matching the `extract-*` files already there.

### The agents

The markdown agent advertised itself as the handler of every `/create:*` command and listed both by
name. It no longer claims either. The design agent gained four capability rows and both commands, and
its description now names four modes rather than two.

Opening it surfaced something no gate reported: nine of its capability paths still pointed at
`sk-design/references/*`, which moved into the fundamentals mode during the hub conversion. Every path
in that agent now resolves.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-chart/**` | Renamed (59) | The chart mode, hub-named |
| `.opencode/skills/sk-design/sk-design-diagram/**` | Renamed (190) | The diagram mode, hub-named |
| `.opencode/commands/design/chart.md`, `diagram.md` | Renamed | Moved off the `/create:` surface |
| `.opencode/commands/design/assets/{chart,diagram}-*` | Renamed (6) | Following the design family's naming |
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Command names and choreography asset paths |
| `.opencode/skills/sk-design/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `graph-metadata.json`, `description.json` | Modified | Mode and command names |
| `.opencode/agents/design.md` and four mirrors | Modified | Four modes, both commands, nine repaired paths |
| `.opencode/agents/markdown.md` and four mirrors | Modified | Stops claiming chart and diagram |
| `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modified | A genuine runtime path |
| `.opencode/bin/lib/compiled-routing/**` | Modified | Canary fixtures and manifests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The pre-rename replay was pinned first, because it cannot be recaptured once names move. Then the
trees, then the references, then the commands, then the agents, then every generated artifact by its
own tool rather than by hand.

The compiled-routing guard was run locally rather than left for the push to discover, which is the
lesson the previous commit paid for.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rename, reversing phase 004's ADR-002 | Operator instruction, plus evidence the old name was keeping dead associations alive |
| Hard cut with no command forwarders | A forwarder doubles a surface that is regenerated in four places, to preserve a name being retired |
| Command assets drop the family prefix | Matches `extract-*`, already the design family's convention |
| Historical records keep the old names | A benchmark report describes the tree it ran against; rewriting it describes a run that never happened |
| Fix the design agent's dead paths while it is open | Nine broken references, no gate reporting them, and the file was already being rewritten |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rename detection | 249 mode files, 8 command files, 2 docs, all `R` |
| Sixteen-phrase replay, generation 650 | Byte-identical to the pinned pre-rename capture |
| The renamed modes themselves | `sk-design-chart` and `sk-design-diagram` at 0.9139, against 0.82 for the old names |
| Fleet metadata audit | 13/13, both hubs class H |
| Leaf-manifest freshness | 13 fresh |
| Derived freshness | 13 fresh, 0 stale |
| `skill_graph_validate` | 0 errors |
| Agent mirror-sync | Both agents, all mirrors in sync |
| `check-corpus.cjs --render` | `RESULT: PASSED` from the renamed path |
| Compiled-routing guard | All hubs fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Four documents inside the chart mode still say twenty-one forms.** The corpus holds 26. The two
   command-surface descriptions were corrected because this phase rewrote those lines anyway; the
   rest belong to the mode's own documentation and are recorded in `scratch/deferred-form-count.md`.
   One of them introduces a per-form table, so the count there is load-bearing.
2. **Three retrieval fixtures still carry the old names.** They are another packet's test corpus, and
   rewriting test data to match a rename risks breaking the tests that read it.
3. **A mid-phase sweep rewrote eight benchmark reports and was reverted.** Verified byte-identical to
   `HEAD` afterwards. The rule that catches this is worth restating: a report records what was on disk
   when it ran.
<!-- /ANCHOR:limitations -->

---
