---
title: "Implementation Summary: sk-design-md-generator as the EXTRACT mode"
description: "The md generator becomes a mode of the sk-design hub, 7,942 files move as renames, and the routing regression phase 002 introduced closes."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/003-md-generator-as-mode"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Merged the md generator into the hub as the EXTRACT mode and closed the owned regression"
    next_safe_action: "Run phase 004: move chart and diagram from sk-doc into the hub"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/graph-metadata.json"
      - ".opencode/skills/sk-design/sk-design-md-generator/SKILL.md"
      - ".opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/boundary/extraction-defers-to-md-generator.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A second identity below a hub root is rejected outright, so the packet gives up its own identity files"
      - "Historical records of the decision this packet supersedes are left as written"
      - "Two acceptance criteria written as 'at or above baseline' were corrected rather than declared met"
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
| **Spec Folder** | 003-md-generator-as-mode |
| **Completed** | 2026-09-06 |
| **Commit** | `fa35e09653` |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-design-md-generator` is now a mode of `sk-design`, and `validate this design.md` routes again.

### The regression this phase was written to close

Converting the root in phase 002 created a second advisor identity carrying design vocabulary, and a
weak phrase split between them until neither cleared the bar. `validate this design.md` scored
0.8451 before the conversion and returned nothing after. Merging the two identities was the stated
fix, and it worked.

### The move

7,942 files moved as renames, so the corpus history survived intact. The packet gave up its own
identity files, because a second identity below a hub root is rejected outright: its
`graph-metadata.json`, `leaf-manifest.config.json`, `leaf-manifest.json` and `leaf-aliases.json`
were deleted, and its domains, intent signals and cross-skill edges folded into the hub's
`graph-metadata.json` — 19 domains and 72 intent signals became 24 and 90.

### The 74 path references, which were not treated alike

| Group | Count | Action |
|-------|-------|--------|
| Inside the skill's own tree | 24 | Rewritten |
| Historical records under `specs/`, 30 of them in `016` | 30 | Left as written |
| Live references elsewhere | 20 | Rewritten |

A prior planner estimated 16 external references. The measured total was 74. The live 20 include the
design agent in four runtime mirrors, the `/design:extract` command and its three assets, three
cli-orchestration contracts, and one genuine runtime path in `dist-freshness.cjs`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-md-generator/**` | Renamed (7,942) | The move itself, history intact |
| `.opencode/skills/sk-design-md-generator/graph-metadata.json` | Deleted | A second identity below a hub root is rejected |
| `.opencode/skills/sk-design-md-generator/leaf-manifest.config.json` | Deleted | Standalone-only, forbidden under the hub |
| `.opencode/skills/sk-design/graph-metadata.json` | Modified | 19 domains, 72 signals become 24 and 90 |
| `.opencode/skills/sk-design/command-metadata.json` | Created | `/design:extract` bound to the hub |
| `.claude/agents/design.md`, `.codex`, `.opencode`, `.cursor` mirrors | Modified | Live path references |
| `.opencode/commands/design/extract.md` and its three assets | Modified | Live path references |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/boundary/extraction-defers-to-md-generator.md` | Modified | The boundary it asserts changes meaning once both are modes of one hub |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One commit, `fa35e09653`. Renames verified before committing. The generator's own test suite was run
from the new location rather than trusted from the old one.

The routing numbers were taken after an explicit daemon rebuild at generation 618. The rebuild is
never chained automatically, and a replay against a stale daemon proves nothing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the packet's identity files rather than nest them | A second identity below a hub root is rejected outright by the class contract. Folding its vocabulary into the hub is the only shape that routes. |
| Leave the 30 historical records untouched | They are `016`'s own account of graduating this skill to standalone. Rewriting them would make the record of the decision this packet supersedes describe something that never happened. |
| Do not lift `styles/` out | 7,812 of the 7,942 files are the shared styles corpus. Moving it here would bury the actual change; it is a separate packet. |
| Correct two acceptance criteria rather than declare them met | Both were written as "at or above the baseline score". The baselines belonged to a standalone identity and the answering identity is now the hub, so the numbers describe different things. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Class H gate on `sk-design` and the fleet metadata audit | PASS |
| `skill_graph_validate`, no dangling edges | PASS |
| The generator's own test suite, run from the new path | PASS |
| `validate this design.md` after rebuild at generation 618 | Routes again: 0.8451 became 0.82, still clearing the bar and reaching the owner |
| The generator's second baseline phrase | 0.9157 became 0.896, still clearing the bar |
| Rename detection on the 7,942 moved files | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Both phrase scores moved down, and the residual was not tuned away.** Adding extraction
   vocabulary to the hub description moved neither number, so the residual is the scorer's shape
   rather than a tuning gap. Both still clear the bar and both still reach the owner.
2. **Two retrieval fixtures carrying this path were left uncommitted.** Another session has in-flight
   changes in the same files, and separating them was not possible without capturing that work.
<!-- /ANCHOR:limitations -->

---
