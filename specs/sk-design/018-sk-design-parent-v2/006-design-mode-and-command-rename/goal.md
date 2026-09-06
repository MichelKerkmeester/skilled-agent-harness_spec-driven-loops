---
title: "Goal: give the moved modes and commands the hub's name"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/006-design-mode-and-command-rename"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Renamed both modes and both commands and rebound them to the design agent"
    next_safe_action: "Run phase 007: move the four playbook fixtures onto the renamed modes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Goal: give the moved modes and commands the hub's name

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

Every name a reader or a router sees for chart and diagram says `sk-design`.

### Decisions

**This reverses two earlier decisions, on operator instruction.** Phase 004 kept the `sk-create-`
prefix and recorded it as ADR-002; the parent goal carried "do not rename modes or commands" as a
binding rule. The operator has decided the legibility is worth the cost. Record the reversal; do not
quietly drop the earlier reasoning, which was sound cost-versus-benefit for what was known then.

**Hard cut, no forwarders.** `/create:chart` and `/create:diagram` are removed rather than kept as
thin routers. A forwarder doubles the surface every runtime mirror carries, and this repo regenerates
four of them.

**The rename is not cosmetic.** The closing phase found a compiled bundle rule pairing a `sk-doc`
mode with `sk-create-diagram` that blocked every push, and four playbook fixtures still asserting
`sk-doc` owns FLOWCHART. Both survived because the old name kept the old association alive.

### Operator copy

Both modes and both commands take the hub's name; the old command paths are removed, not aliased.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

1. **Capture the baseline first.** Replay the sixteen phrases before touching anything. It cannot be
   recaptured once names move.
2. **Moves must be renames.** 249 files carry real history. Verify `R` status with
   `git diff --cached --name-status -M` before committing, not after.
3. **Historical records keep the old names.** Only live references follow the rename. A record under
   `specs/` describes what the tree was called when it was written.
4. **Regenerate mirrors, never hand-edit them.** The four runtime command mirrors have their own
   generators; a hand edit drifts silently.
5. **Run the compiled-routing guard before pushing, not at push time.** It refuses a hub whose inputs
   do not compile, and it is not part of any gate sweep.
6. **One commit.** Both hubs, both commands, both agents and the compiled routing move together, or
   the shared branch breaks between commits.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | Both modes renamed | `sk-design-chart` and `sk-design-diagram` on disk, 249 files as renames |
| 2 | Both commands moved | `/design:chart` and `/design:diagram` resolve; the `/create:` paths are gone |
| 3 | Design agent owns them | It claims both; the markdown agent no longer advertises either |
| 4 | The branch can be pushed | The compiled-routing guard reports every hub fresh |
| 5 | Nothing stopped arriving | Sixteen-phrase replay at a named daemon generation, no phrase below baseline |
| 6 | No live reference to the old names | Sweep clean; `specs/` records untouched on purpose |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Done. 249 mode files, 8 command files and 2 docs moved as renames; 138 live reference files rewritten;
every generated artifact regenerated. Replay at generation 650 byte-identical to the pre-rename
capture.

### Deviations and findings

- **The design agent had nine dead reference paths.** Its capability table still pointed at
  `sk-design/references/*`, which moved into the fundamentals mode during the hub conversion. No gate
  reported it; it surfaced only because the rename opened the file. Fixed here.
- **The command-metadata choreography paths are not covered by a name sweep.** The fleet gate caught
  two asset paths that still named the old command family after every textual sweep had passed.
- **A mid-phase sweep rewrote eight benchmark reports and was reverted.** They record runs against a
  tree that was named differently; rewriting them describes a run that never happened. Verified
  byte-identical to `HEAD` after the revert.
- **The new names score higher than the old ones.** `sk-design-chart` and `sk-design-diagram` reach
  0.9139, where `sk-create-chart` reached 0.82. A hub-consistent name is worth advisor score, which
  neither phase 004 nor this phase's own plan predicted.
<!-- /ANCHOR:log -->
