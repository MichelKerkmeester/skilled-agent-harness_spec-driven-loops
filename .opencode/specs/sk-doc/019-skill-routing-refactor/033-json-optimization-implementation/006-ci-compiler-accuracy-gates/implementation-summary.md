---
title: "Implementation Outcome: Wire Compiler + Routing-Accuracy Gates into CI"
description: "Planned record of adding skill_graph_compiler.py --validate-only and score-routing-corpus.py (pinned hash) as new gated steps in routing-registry-drift.yml, sequenced after 002/003/004; not yet built."
trigger_phrases:
  - "ci compiler accuracy gate outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "002 corpus hash pin not yet shipped"
      - "003 fleet migration not yet shipped"
      - "004 scaffold born-complete not yet shipped"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact accuracy/F1 floor values, deferred to 003's post-migration baseline"
      - "Whether the compiler step should also run --export-json, or --validate-only alone suffices"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Wire Compiler + Routing-Accuracy Gates into CI

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Delivered** | Not yet — awaiting 002/003/004 |
| **Track** | sk-doc |
| **Depends On** | `002-baseline-capture`, `003-derived-regenerator-migration`, `004-scaffold-journey` |
| **Source Finding** | `029-skill-json-optimization-research/research/research.md` §3 O4 (3/3 lineage agreement) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two new CI steps in `.github/workflows/routing-registry-drift.yml`'s existing `routing-drift` job: a compiler-validation step running `skill_graph_compiler.py --validate-only` (full schema-version-2 `derived` validation plus `key_files`/`source_docs`/`entities[].path` existence checks) and a routing-accuracy step running `score-routing-corpus.py` against the corpus pinned by 002 with accuracy/F1 floors and `--require-historical-clean`. Together they close the "green-root / downstream-failure seam" the 029 research identified: today a skill can pass every CI gate with a malformed `derived` block or a dead file path, and the failure only surfaces at an offline advisor rebuild. Activation is strictly sequenced after 003 (fleet migration) and 004 (scaffold born-complete) ship, so the new gate does not red the fleet on its first run. This phase does not implement 002/003/004 themselves and does not change the compiler's or scorer's validation logic — it only wires two already-correct, already-unmodified scripts into CI.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Setup (Phase 1) confirms 003/004 are merged, reads 002's pinned corpus reference, and establishes a clean local baseline for both target commands before the workflow file is touched. Implementation (Phase 2) adds the two steps after the existing "Skill-root metadata class contract" step, extends the `paths:` trigger filters (push + pull_request) with the compiler script and routing-accuracy directory globs, and documents the pinned-corpus rationale inline citing the 029 O4 finding. Verification (Phase 3) dry-runs both new steps against a fresh clone, deliberately breaks a `derived.key_files` path and a corpus accuracy number in scratch copies to confirm the expected failure modes, and confirms the four pre-existing steps are unaffected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Sequence gate activation strictly after 003 and 004 rather than shipping it eagerly, because turning on `--validate-only` before the fleet migrates to schema-version 2 `derived` would red every unmigrated skill at once — a self-inflicted outage rather than a real regression signal. Pin the routing-accuracy corpus to 002's exact hash rather than reading it live, because the 029 research explicitly warns checked-in baselines are "version-sensitive and contradictory across sources" — an unpinned corpus would make the accuracy floor meaningless. Keep both scripts unmodified: this phase is pure CI wiring, not a validator-logic change, so the blast radius stays scoped to one workflow file.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run — this packet is Planned. Verification will be run per `checklist.md` once 002/003/004 ship: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` on this packet, local reproduction of both new commands, a fresh-clone dry run, and two deliberate-failure dry runs (broken `derived.key_files` path; regressed accuracy number) confirming the expected CI failure diagnostics.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase cannot proceed until its three dependencies ship — it is blocked, not merely sequenced-after, since activating the compiler gate against an unmigrated fleet would produce false-positive CI failures across every non-migrated skill. The exact accuracy/F1 floor numbers are deferred to 003's post-migration baseline and are not committed to in this spec. Whether the compiler step should also run `--export-json` (catching the 4KB output-size warning) versus `--validate-only` alone is left as an open implementation-time choice, since the 029 O4 finding this phase closes only requires schema + path-existence validation, not build-time serialization coverage.
<!-- /ANCHOR:limitations -->
