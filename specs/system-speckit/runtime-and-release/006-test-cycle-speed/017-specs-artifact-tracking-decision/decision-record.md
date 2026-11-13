---
title: "Decision Record: tracking loop-state artifacts under specs/"
description: "Three Proposed options for the tracked footprint of research, review, scratch and archive folders, with the operator as decider and no option implemented."
trigger_phrases:
  - "specs artifact tracking options"
  - "loop state tracking decision"
  - "keep or untrack research folders"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision"
    last_updated_at: "2026-11-12T11:44:50Z"
    last_updated_by: "code-worker"
    recent_action: "Wrote three Proposed options and the no-action clause"
    next_safe_action: "The operator chooses an option; no file moves until then"
    blockers: []
    key_files:
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/scratch/artifact-inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "code-017-specs-artifact-tracking-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which option the operator chooses"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: tracking loop-state artifacts under specs/

The repository tracks a large body of loop state under `specs/`, and every CI job checks out all of it. The measured footprint is in `scratch/artifact-inventory.md`, with one row per folder kind, the union across the four kinds and the command that produced them. This record does not restate those numbers, because a number copied into a second document drifts away from its source.

<!-- ANCHOR:context -->
## Context

Four folder kinds under `specs/` hold material that no test runner collects: `research/` holds investigation notes, `review/` holds review reports, `scratch/` holds working files and `z_archive/` holds retired packets. They are tracked like source, so a clone fetches them and every CI checkout materializes them.

Tracking them has real benefits. A research note and the code it justified land in the same commit, so a later reader can reconstruct why a change was made without leaving the repository. A review report sits beside the change it reviewed. Nothing has to be fetched from a second system.

The cost is paid per checkout. It is also paid per clone, per worktree and per archive operation, and it grows with every packet that writes research, review or scratch files.

<!-- /ANCHOR:context -->

<!-- ANCHOR:options -->
## Options

### Option A: Keep everything tracked

**Status**: Proposed

**What it changes**: nothing. The current arrangement stays, and the inventory becomes the baseline a future decision measures against.

**What it costs**: every clone, worktree and CI checkout keeps paying for material no test collects. The cost grows as packets accumulate loop state, so the same decision returns with a larger number behind it.

**What it leaves open**: nothing that blocks acting on it. Choosing this option closes the question until someone reopens it with a new measurement.

### Option B: Stop tracking new loop state

**Status**: Proposed

**What it changes**: ignore rules cover the four folder kinds, and files written from that point on stay in the working tree instead of entering the index. Files already tracked keep their place unless a second step untracks them.

**What it costs**: the record of how a change was researched or reviewed stops travelling with the change. Anyone who needs that material needs the machine that holds it, or a separate store. Two variants exist and they cost differently. Ignoring only new writes leaves the current footprint in place and slows its growth. Untracking existing files as well shrinks the footprint, but it rewrites what a checkout contains for every job and every collaborator at once.

**What it leaves open**: which variant is meant. The choice between ignoring future writes and untracking existing files must be settled before this option is acted on, because the two produce different checkouts.

### Option C: Move archives out of the repository

**Status**: Proposed

**What it changes**: retired packets under `z_archive/` leave the repository and live in a separate store. Active packets keep their research, review and scratch folders in place.

**What it costs**: the archive needs a destination with the durability the repository currently provides, and readers need a way to reach it. Every link into an archived packet breaks unless the move preserves paths or adds a forwarding record. The one-time move touches history if the files are also removed from the index.

**What it leaves open**: the destination. Where the archives move to is unknown, and this option cannot be acted on until it is named, with its retention and access rules.

<!-- /ANCHOR:options -->

<!-- ANCHOR:no-action -->
## No Action In This Phase

Delete, move and untrack nothing in this phase. The measurement is the deliverable, and every option above stays available until the operator chooses.

The phase stops catching no regression: it changes no test, workflow, hook or source file, and it writes nothing outside this packet's own documents.

<!-- /ANCHOR:no-action -->

<!-- ANCHOR:decision-point -->
## Decision Point

**Decider**: the operator decides which option to act on, and this phase implements none of the three.

The decision needs one answer: which option becomes the tracking policy, and for option B, which variant. Until that answer exists, every option carries `Proposed` and the inventory stands as the evidence.

**Operator answer, 2026-11-13**: none of the three options. Everything stays tracked, and CI jobs that do not read loop state skip the four folder kinds with a sparse checkout. Phase 22 builds that. Options A, B and C keep `Proposed`, because the tracking policy itself is unchanged.

Two questions stay open beside the decision. Under option B, the variant question above must be answered first. Under option C, the destination must be named before any file moves.

<!-- /ANCHOR:decision-point -->
