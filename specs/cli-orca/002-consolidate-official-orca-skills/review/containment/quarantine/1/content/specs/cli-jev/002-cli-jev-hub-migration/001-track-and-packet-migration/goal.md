---
title: "Goal: Phase 1: track-and-packet-migration"
description: "The durable directive this phase executed against and the criteria that decided when it was done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "packet migration"
  - "cli-jev track"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/001-track-and-packet-migration"
    last_updated_at: "2026-09-20T14:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Goal authored at closeout, replacing the scaffold placeholder"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-001-track-and-packet-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: track-and-packet-migration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The cli-jev creation history lives in its own track, and every surface
that cited the old home points at the new one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Move the packet with `git mv`, so the rename is recorded and no document body changes in the move itself |
| D2 | Hand-author the track root metadata, because no scaffolder writes track-level files |
| D3 | Repair derived facts with `repair-derived.cjs` and hand-fix only the fields the tool refuses by design |
| D4 | Regenerate the retrieval surfaces from the final tree rather than patching them |
| D5 | Keep recorded session labels as provenance; repoint only live pointers |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes,
resend this file's chat slice so the operator can update their copy. A child goal
change that alters a parent decision or criterion is an amendment to the parent:
apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] The packet lives at `specs/cli-jev/001-cli-jev-creation` and the old path is gone from disk and from the index as a live file
- [x] The track root describes itself and declares both children
- [x] The derived facts a move invalidates are repaired, and a report-only re-run has nothing left to repair
- [x] A repo-wide census finds no live citation of the retired path
- [x] Both packets clear the recursive strict gate, and the track sweep reports `cli-jev` clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

Everything below is VOLATILE. It is not part of the directive and it is expected to grow.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet moved | Done | `git mv` staged as rename entries; `specs/cli-external-orchestration/074-cli-jev-creation` absent |
| Track root authored | Done | `specs/cli-jev/description.json` (`level: track`) and `graph-metadata.json` declaring both children |
| Derived facts repaired | Done | `repair-derived.cjs --roots specs/cli-jev --apply`, then a report-only run at `repaired=0 failed=0` |
| Citations repointed | Done | One ordered pass over four string forms, 36 files; zero-hit census afterwards |
| Retrieval surfaces regenerated | Done | Trigger index and retrieval fixtures rebuilt from the final tree |
| Recursive strict gate | Done | `validate.sh --strict --recursive` exit 0, six `RESULT: PASSED` lines across the packet and five children |
| Reviewer window | Done | Two dispatched verifiers found stale `description.json` identity and two scaffold goal pointers; both fixed and re-gated |

### Deviations and findings

| Item | Note |
|------|------|
| The repo-wide track sweep cannot pass by design | Fourteen track roots carry drift that predates this program; only the `cli-jev` scope is proven clean |
| The folder description cache carries no cli-jev entry | `specs/descriptions.json` is written as a side effect of the lookup and save flow, so the new track registers there on its next write |
| One untracked runtime cache was rewritten incidentally | A `.state/spec-gate` jsonl carried the old path and was updated by the citation pass; it lives outside git |
<!-- /ANCHOR:log -->

---
