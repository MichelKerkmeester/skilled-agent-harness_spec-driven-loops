---
title: "Goal: bring the md generator in as a mode"
description: "Move 7,946 files as renames, fold one advisor identity into another, rewrite forty path references, and close the routing regression the hub conversion introduced."
importance_tier: important
contextType: reference
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/003-md-generator-as-mode"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Moved sk-design-md-generator in as the EXTRACT mode and rewrote its live references"
    next_safe_action: "None open; phase 005 replays the sixteen phrases from the final state"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
---

# Goal: sk-design-md-generator as the EXTRACT mode

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

`sk-design-md-generator` becomes a mode of `sk-design`, and `validate this design.md` routes again.

### Decisions

**The obligation this phase carries from the last one.** Converting the root created a second
identity carrying design vocabulary, and a weak phrase now splits between them.
`validate this design.md` scored `sk-design-md-generator=0.8451` at baseline and returned nothing
after the hub conversion. Merging the two identities should close it. That is an acceptance
criterion, not an expectation: if the phrase still returns nothing after the generator is a mode,
the vocabulary needs tuning here and the phase does not close until it routes.

**What must go, and why.** The moved packet cannot keep its own identity files. A second identity
below a hub root is rejected outright. So its `graph-metadata.json`, `leaf-manifest.config.json`,
`leaf-manifest.json` and `leaf-aliases.json` are removed, and its intent signals, domains and
cross-skill edges fold into the hub's `graph-metadata.json`. Inbound edges from other skills
retarget to `sk-design`.

**Scale, and the one thing that protects it.** 7,946 tracked files, 216 MB, of which the `styles/`
corpus is 7,812. Do not lift `styles/` out; that is a separate packet and doing it here would bury
the move.

### Operator copy

The generator becomes the hub's EXTRACT mode, and the phrase the last phase broke routes again.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

The move commit must record renames. Verify before committing, not after.

### Paths that break until rewritten, measured rather than estimated

74 files carry the path `skills/sk-design-md-generator`, and they split three ways:

| Group | Count | Action |
|-------|-------|--------|
| Inside the skill itself | 24 | Rewrite |
| Historical records under `specs/`, 30 of them in `016` | 30 | **Leave alone** |
| Live references elsewhere | 20 | Rewrite |

Leaving the historical records is deliberate. Thirty of them are `016`'s own account of graduating
this skill to standalone; rewriting them would make the record of the decision this packet
supersedes describe something that never happened.

The 20 live ones: the design agent in four runtime mirrors (`.claude`, `.codex`, `.opencode`,
`.pi`), the `/design:extract` command and its three assets, three cli-orchestration contracts, a
command contract and a playbook allowlist under `sk-doc`, a durable-directory manifest, two
retrieval fixtures, the lexical `trigger-index.json`, one genuine runtime code path in
`dist-freshness.cjs`, and one boundary playbook inside `sk-design-fundamentals`.

That last one needs reading rather than rewriting: `extraction-defers-to-md-generator.md` asserts
where fundamentals stops and extraction begins, and that boundary changes meaning once both are
modes of one hub.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | Both hub gates green | The class H check on `sk-design` and the fleet metadata audit |
| 2 | No dangling graph edges | `skill_graph_validate` clean |
| 3 | The generator still works from its new home | Its own test suite run from the new location |
| 4 | Its two baseline phrases at or above baseline | Replay compared against `scratch/routing-baseline.txt` |
| 5 | The owned regression closed | `validate this design.md` reaches the merged mode |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Done. The generator is the hub's EXTRACT mode and the 24 internal plus 20 live references were
rewritten; the 30 historical records were left as written.

### Deviations and findings

- A prior planner estimated 16 external references. The measured total was 74. Count, never estimate.
- The `016` historical records were deliberately not rewritten, under parent binding rule 7.
<!-- /ANCHOR:log -->
