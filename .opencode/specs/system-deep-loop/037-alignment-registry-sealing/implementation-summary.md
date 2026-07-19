---
title: "Implementation Summary: deep-alignment registry seal-state"
description: "Shipped the overall.sealed fix so a deep-alignment run that halts before synthesis no longer strands its fail-closed seed as an authoritative verdict."
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-alignment-registry-sealing"
    last_updated_at: "2026-07-19T15:40:00Z"
    last_updated_by: "implementer"
    recent_action: "Implemented + tested the sealed-registry fix across reducer, both workflows, docs"
    next_safe_action: "Strict-validate the packet, then commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs"
      - ".opencode/commands/deep/assets/deep-alignment-auto.yaml"
      - ".opencode/commands/deep/assets/deep-alignment-confirm.yaml"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/reducer-seal-state.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implementer-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Is deep-alignment structurally broken for infra code? No — the reducer is correct; a stranded seed was mis-read as NOT_APPLICABLE."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: deep-alignment registry seal-state

<!-- ANCHOR:metadata -->
## Metadata

- **Packet:** system-deep-loop/037-alignment-registry-sealing
- **Level:** 2
- **Worktree:** `.worktrees/0084-system-deep-loop-alignment-registry-sealing` off origin `28d9c4a81a`
- **State:** Complete pending strict validation + commit.

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`overall.sealed` distinguishes an authoritative terminal verdict from a preliminary one. The seed and every per-iteration refresh reduce leave `sealed: false`; only the terminal synthesis reduce (`--seal`) sets it true. A new per-iteration refresh keeps the on-disk registry current with completed iterations, so a run that dies mid-loop shows its real (unsealed) verdict instead of the stranded fail-closed seed.

### Files Created / Changed

- **`reduce-alignment-state.cjs`** — `overall.sealed` (default false); `--seal` / `options.seal` sets it true; `renderAlignmentReport` PRELIMINARY/SEALED banner; CLI parses `--seal` and emits `sealed`. Verdict logic untouched.
- **`deep-alignment-auto.yaml` + `deep-alignment-confirm.yaml`** — seed annotated unsealed; new `step_refresh_registry` (unsealed) after `step_check_convergence`; synthesis `step_run_reducer` now passes `--seal`.
- **`alignment-report-reducer.md`** — documents the `sealed` field, the seed/refresh/synthesis lifecycle, and the new test.
- **`reducer-seal-state.test.cjs`** — new 5-case regression.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read-first root-cause investigation confirmed the reducer was correct and the stored packet-012 FAIL was a stranded seed (iteration 2 `dispatch_failure` before synthesis). Implemented surgically in an isolated worktree; verified against the real packet-012 log and the reducer test suite before authoring this packet.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **A boolean `sealed`, not a coverage subsystem.** `sealed: false` already means "not authoritative," which subsumes the partial-coverage false-PASS concern without new fields.
- **Per-iteration refresh over halt-path-only reduce.** Placing the refresh after every convergence read is the robust superset of "reduce on halt" — it survives hard kills the halt path can't catch.
- **Preserve the fail-closed seed.** Sealing is orthogonal to the verdict and never launders a fail-closed FAIL.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `reducer-seal-state.test.cjs` — 5/5 pass [TESTED].
- `reducer-fail-closed.test.cjs`, `state-machine-wiring.test.cjs` — pass (no reducer regression) [TESTED].
- No-regression delta: 4 failing `command-*`/`sk-doc-command-adapter` tests fail identically on base `28d9c4a81a` with changes stashed — pre-existing, unrelated [VERIFIED: stash baseline].
- End-to-end: re-reducing the packet-012 log unsealed → `PASS, sealed:false`; `--seal` → `PASS, sealed:true` [VERIFIED].
- Both YAMLs `yaml.safe_load` clean; reducer `node -c` clean [VERIFIED].

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Out of scope and left as a separate follow-up: the iteration-2 `dispatch_failure` itself (cli-codex leaf reliability). A future enhancement could add a partial-coverage ratio to sealed-but-incomplete runs, but `sealed: false` already prevents mis-reading a stranded verdict.

<!-- /ANCHOR:limitations -->
