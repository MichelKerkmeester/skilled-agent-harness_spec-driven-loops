---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite"
    last_updated_at: "2026-09-16T17:54:10Z"
    last_updated_by: "template-author"
    recent_action: "Closed the reference rewrite: eight commits, rescan zero, suites compared"
    next_safe_action: "Start phase 010, the machine and consumer cutover"
    blockers: []
    key_files:
      - "goal.md"
      - "acceptance-criteria.md"
      - "scratch/rescan-final.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-reference-rewrite"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-reference-rewrite |
| **Completed** | 2026-09-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every reference that names this repository's own tree now names `.skilled`, the directory that actually holds it. The move in phase 007 left 16,290 occurrences of the old name in 2,835 tracked files, each one resolving only through a compatibility link. Those references now point at the real path, and the ones that must keep the old name are recorded with a reason rather than left to chance.

### Phase 9: reference-rewrite

One token-bounded rule did the mechanical work: `.opencode` becomes `.skilled` when the next path segment is an entry that moved, and never when the text is an identifier, a home-anchored path, a URL or a line that names both roots on purpose. Everything the rule could not settle went to a decision: 1,673 occurrences, each with an action and a reason, covering the runtime's own view of its directory, consumer projects, the legacy spec alias, and tests that build the old layout to prove it still works.

Thirty-six hand edits gave path matchers both root names. A checker that tested `indexOf('/.opencode/')`, a validator whose allowlist named six runtime directories, a prefix strip and an agent-body normalizer would each have gone half-blind after the rewrite, because the paths they read can arrive under either name.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 2,743 tracked files across skills, commands, agents, hooks, plugins, bin, scripts and the root | Modified | Name the real source directory |
| 88 generated files (agent mirrors, Hermes copies, command contracts, the trigger index, command bridges, the README verdict baseline, hub manifests) | Regenerated | Rebuilt from the rewritten sources, never edited |
| 22 files carrying a hand edit | Modified | A matcher, allowlist or normalizer accepts both root names |
| `scratch/` | Created | The rule, the manifests, every decision with its reason, the ledgers, the verification records and the suite logs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two waves. The first carried code and the 35 dual-root files whose every occurrence took a decision; the second carried documents, the authored runtime files and the manual rows. Each group was applied by a lane running one literal command, then checked against its manifest: every changed path inside the manifest, no automatic occurrence left, no undecided occurrence left, added lines equal to removed lines, no rename, no frozen or routed path touched, and no fenced path that resolved at the base and fails at the tip.

The suites tell the story by comparison rather than by a bare exit code, because the phase base already carried 34 failing test identities. The final run adds none and fixes 21, among them the tests phase 008 left pointing at the old root.

Eight commits follow the commit gates rather than the group boundaries: the mirror-parity gate refuses a commit that stages a mirror source while its regenerated output stays unstaged, and the route re-mint gate refuses a hub whose routing inputs are only half staged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A file that already names `.skilled` changes only by decision | Phases 005 to 008 made 35 files dual-root. A blind rewrite would have changed what a legacy-layout test exercises |
| Matchers accept both root names | A path can reach the same file under either name, so a test that knows one name silently stops matching the other |
| The captured-once retrieval records are frozen | They are acceptance evidence with no runtime reader, so they record the old path the way a changelog does |
| Five fixture packets keep the old spelling | Their generated metadata pins a hash of their own bytes, and no repair tool reaches outside the packet tree |
| One routed file changed here | The agent-body normalizer knew three root names and not `.skilled`, so every rewritten agent body read as drift and the commit gate blocked |
| The `.opencode/specs` alias stays | It is a compatibility link the layout decision keeps; retiring it for the canonical `specs/` root is a separate cleanup and the operator's call |
| Suites run per wave | One suite set per batch would have cost hours without adding a signal, because every check is a comparison against the same base record |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rescan of tracked files outside `specs/` | PASS: `unclassified=0` across 52,311 remaining occurrences, all frozen, generated, routed, kept by a recorded decision or never |
| Independent recount | PASS: an isolated read-only classifier agrees at zero after confirming the five alias call sites |
| Manifest checks V1 to V5 over both waves | PASS: 2,743 changed paths, 0 stray, 0 missing, 0 unbalanced, 0 renames, 0 protected changes, 0 fenced-path regressions |
| Freeze comparison | PASS: 2,674 baseline paths byte-identical, 4 added by the F4 decision |
| Generator checks | PASS: every check exits 0 except the router path drift that predates the phase |
| Suites | PASS by comparison: no new failing identity against the phase base, 21 fixed |
| Commit hygiene | PASS: no rename status and no containment or lineage path in the phase range |
| Comment hygiene | PASS: the checker reports no violation across all 2,913 changed files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Runtime code that resolves paths from a consumer project's working directory now names `.skilled`. Consumer roots need their own `.skilled` link, which phase 010 adds on this machine; its operator checklist covers machines this phase cannot reach.
- `.opencode/specs` references stay as they are. The canonical `specs/` root is the alternative, and retiring the alias is the operator's call.
- Three command-router path drifts predate this phase and still report. They name renamed command assets, not root paths.
- 13 failing test identities remain from the phase base, including the hook registration count that predates phase 005.
<!-- /ANCHOR:limitations -->

---


