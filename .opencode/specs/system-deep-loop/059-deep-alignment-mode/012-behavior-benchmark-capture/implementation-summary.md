---
title: "Implementation Summary: Phase 12: behavior-benchmark-capture"
description: "Outcome of the first real deep-alignment DAB capture: 11/11 cells captured on claude-opus-4-8, claude-baseline.md populated and three-pass GPT skeptic-verified (9 confirm / 2 dispute), and a P0 resolver gap that made the mode unrunnable e2e found, fixed (working tree), and GPT-verified GO — commit gated on operator sign-off."
trigger_phrases:
  - "deep-alignment benchmark capture summary"
  - "DAB capture results"
  - "alignment resolver P0 outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/012-behavior-benchmark-capture"
    last_updated_at: "2026-07-12T14:40:00Z"
    last_updated_by: "claude"
    recent_action: "Captured + verified the DAB baseline; applied + verified the resolver P0 fix"
    next_safe_action: "Operator sign-off on the shared-runtime resolver commit and the flagged follow-ups"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/baselines/claude-baseline.md"
      - ".opencode/skills/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-behavior-benchmark-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
status: "complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 12 of 12 — behavior-benchmark-capture |
| **Status** | Complete (capture + verification); release-gated items await operator sign-off |
| **Date** | 2026-07-12 |
| **Branch** | `skilled/v4.0.0.0` (no commit/push made) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### DAB behavior-benchmark baseline
First real capture of all 11 DAB cells on `claude-opus-4-8` via the `claude-cli` leg (single-sample). `claude-baseline.md` moved from all-pending to fully populated: per-cell checkpoints, verified classifications, recomputed budgets, provenance, and confounds. Verified distribution: **pass 5, setup_misbind 2, partial 1, timeout_latency 3**.

### Framework registration + fixture
`alignment` mode + `DAB` prefix registered in `shared/behavior-benchmark/framework.md` (runner suite green). The shared fixture `fx_001_alignment_target` was provisioned (docs/docs-clean/src corpus + three lane-configs) and renamed kebab→snake to match the committed scenario references; all three lane-configs resolve via `scoping.cjs` (exit 0) and the sk-doc adapter detects the seeded P0.

### Resolver P0 fix
The first smoke proved the mode had never run e2e: `review-research-paths.cjs` registered only `research`/`review`, so `resolveArtifactRoot(target,'alignment')` threw `TypeError … received undefined` at workflow step 1. Fixed additively (`alignment: 'deep-alignment-config.json'`/`'deep-alignment-state.jsonl'` + JSDoc union). Applied to the working tree only.

### Files Changed
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md` — alignment/DAB registration.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target/` — fixture built + snake-normalized.
- `.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/baselines/claude-baseline.md` — populated.
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` — the P0 fix (2 keys + JSDoc).
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs` — bug #1 (shared/scripts path) restored.
- `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` — bug #2 (union-dedup) restored.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Deterministic mechanics (registry edits, fixture rename, the serial capture driver) ran as direct tool calls. Judgment/adjudication ran through independent `openai/gpt-5.6-sol-fast --variant high` passes via cli-opencode: one fix-verify, one wiring-audit, and three skeptic-verify passes over disjoint cell subsets. Cells ran serially because each writes into `<fixture>/alignment` and would collide in parallel; the driver cleaned that dir between cells.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Fixture instance folder → snake_case.** The committed scenarios reference `fx_001_alignment_target`; the untracked dir was hyphen. Renaming the dir (not reverting the committed refs) honored both the migration's naming and the operator's "benchmark folders use underscores" rule.
- **Record the real host, not the nominal one.** The claude-cli leg has no `--model` flag, so it ran `claude-opus-4-8`. Recorded honestly rather than labelled Sonnet.
- **Keep the verified classification, footnote the raw one.** DAB-004 (partial→setup_misbind) and DAB-009 (pass→setup_misbind) carry the skeptic-verified label with the runner's mechanical label and the classifier blind-spot documented, not silently overwritten.
- **Commit gated on sign-off.** The resolver fix is shared-runtime; applied + verified in the working tree, but no commit/push was made.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Framework/runner**: registration present; runner test suite green.
- **Fixture**: `scoping.cjs` exit 0 (3 lane-configs); sk-doc `check` spawns `validate_document.py` and detects the seeded P0 (bug #1 fix live).
- **Resolver fix**: `resolveArtifactRoot` resolves `alignment`; `review`/`research` byte-identical pre/post (control run). GPT fix-verify → **COMMIT GO**. GPT wiring-audit → **no other HARD gaps**; one SOFT gap (dispatch-guard).
- **Captures**: 11/11 `result.json` with real checkpoints; DAB-001 re-smoke PASS with read-only integrity held.
- **Skeptic-verify**: 3 passes, 9 CONFIRM / 2 DISPUTE; the 3 timeouts confirmed as real progressing-latency, not stuck.
- **Packet**: `validate.sh --strict` — passing at close.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Mode behavior finding:** on specific natural-language halt surfaces (DAB-004, DAB-009) the mode runs the audit inline instead of halting for scope confirmation, while it halts correctly on bare/vague asks (DAB-002/003).
- **Latency ceiling:** three autonomous cells exceed the 900s framework cap on the Opus host; the cap is too low for autonomous multi-iteration alignment cells on this host, compounded by concurrent-session sqlite contention.
- **Single-sample, single-host.** No multi-sample reruns and no non-Opus re-baseline. DAB-006's suppression question is unresolved (timed out before emitting).
- **Fixture-polish (fixture v2):** a getting-started defect, a stale FIXTURE.md count, and a low README DQI — non-blocking; seeded gaps reproduce correctly.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:flags -->
## Flags / Operator Decisions

- **Commit the shared-runtime resolver fix** (`review-research-paths.cjs`) — GPT-verified GO; gated on sign-off.
- **059 status-honesty note** — the mode was unrunnable e2e until this phase; the parent's built/complete framing was overstated.
- **`dispatch-guard.cjs` SOFT gap** — `deep-alignment` absent from `LOOP_EXECUTOR_AGENTS` (:71), so alignment Task dispatches bypass loop-executor protection (runs fine); schedule the guard + YAML hardening as its own phase.
- **Doc-file snake-vs-hyphen naming contradiction** — introduced by the concurrent migration session; a cross-agent decision, deferred.
<!-- /ANCHOR:flags -->
