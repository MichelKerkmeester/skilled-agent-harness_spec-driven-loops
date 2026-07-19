---
title: "Feature Specification: deep-alignment registry seal-state"
description: "Mark the deep-alignment findings registry as sealed only at terminal synthesis so a run that halts mid-loop no longer strands its fail-closed seed as an authoritative verdict."
trigger_phrases:
  - "deep alignment registry sealing"
  - "alignment seed stranded verdict"
  - "overall.sealed preliminary authoritative"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-alignment-registry-sealing"
    last_updated_at: "2026-07-19T15:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Ship the sealed-registry fix + seal-state regression test"
    next_safe_action: "Run strict validation, then commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs"
      - ".opencode/commands/deep/assets/deep-alignment-auto.yaml"
      - ".opencode/commands/deep/assets/deep-alignment-confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: deep-alignment registry seal-state

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** system-deep-loop
- **Packet:** 037-alignment-registry-sealing
- **Level:** 2 (cross-file runtime change touching a shared fail-closed safety contract)
- **Status:** In progress
- **Related:** `system-deep-loop/032-deep-alignment-mode` (the mode this reducer belongs to)

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-alignment loop seeds its findings registry FAIL-closed before the first LEAF dispatch (a non-empty-but-unaudited corpus reduces to `incompleteCoverage` FAIL, so a failed or empty first pass can never terminate as a false PASS). The registry is then rewritten **only** at terminal synthesis (`step_run_reducer`); the `if_continue` path never re-reduces.

Consequently, a run that halts before synthesis — a leaf dispatch failure, timeout, crash, or kill — strands the seed. That stranded seed is byte-identical to a completed audit that genuinely failed (`verdict: FAIL`, `incompleteCoverage: true`, every lane `NOT_APPLICABLE`), so a consumer reads the placeholder as an authoritative verdict. This was observed live in `sk-design/012`: iteration 1 completed (5 artifacts, 1 P2), iteration 2 emitted `dispatch_failure`, and the loop died before synthesis. Re-reducing the *same* on-disk state log yields `verdict: PASS, iterationsRun: 1` [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/alignment/deep-alignment-state.jsonl], proving the reducer was correct and the stored FAIL was the stranded seed — mis-reported as a "structural NOT_APPLICABLE" limitation.

### Purpose

Make the registry self-identify whether it is authoritative, and keep it current with completed iterations even when the loop dies mid-run — without weakening the fail-closed seed.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `runtime/scripts/reduce-alignment-state.cjs` — add `overall.sealed`; `--seal` / `options.seal` sets it true; report banner + CLI output surface it.
- `commands/deep/assets/deep-alignment-auto.yaml` and `deep-alignment-confirm.yaml` — seed unsealed, per-iteration `step_refresh_registry` (unsealed), synthesis reduces with `--seal`.
- `deep-alignment/feature-catalog/loop-lifecycle/alignment-report-reducer.md` — document the field + lifecycle.
- `deep-alignment/scripts/tests/reducer-seal-state.test.cjs` — new regression.

### Out of Scope

- The codex leaf `dispatch_failure` trigger itself (a separate cli-codex reliability concern) — FROZEN.
- Verdict-derivation logic (`FAIL`/`CONDITIONAL`/`PASS`/`NOT_APPLICABLE`) — unchanged.
- Convergence-gate semantics and adapter contracts — unchanged.

### Files to Change

| File | Change |
|---|---|
| `runtime/scripts/reduce-alignment-state.cjs` | `overall.sealed` + `--seal`/`options.seal` + report banner + CLI output. |
| `commands/deep/assets/deep-alignment-auto.yaml` | Seed unsealed note; `step_refresh_registry`; synthesis `--seal`. |
| `commands/deep/assets/deep-alignment-confirm.yaml` | Same three edits, mirrored. |
| `deep-alignment/feature-catalog/loop-lifecycle/alignment-report-reducer.md` | Document `sealed` + lifecycle + test row. |
| `deep-alignment/scripts/tests/reducer-seal-state.test.cjs` | New 5-case regression test. |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | Registry carries a seal flag | Every `overall` rollup includes `sealed: boolean`; it defaults false. |
| REQ-002 | Only synthesis seals | Seed and per-iteration refresh reduces leave `sealed: false`; only the terminal synthesis reduce (`--seal` / `options.seal`) sets `sealed: true`. |
| REQ-003 | Sealing never launders a verdict | Sealing a genuinely fail-closed reduce keeps `verdict: FAIL` and `incompleteCoverage: true`; the pre-existing fail-closed guard is unchanged. |

### P1 - Required

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-004 | Mid-loop death reflects real work | A per-iteration refresh keeps the on-disk registry current with completed iterations, so a halted run shows its real (unsealed) verdict, not the stranded seed. |
| REQ-005 | Both workflows wired | `deep-alignment-auto.yaml` and `deep-alignment-confirm.yaml` each seed unsealed, refresh unsealed per iteration, and seal at synthesis. |
| REQ-006 | Consumers can tell them apart | The rendered report and CLI/JSON output label a `sealed: false` registry PRELIMINARY / not authoritative. |
| REQ-007 | No regression | The reducer's existing tests (`reducer-fail-closed`, `state-machine-wiring`) still pass; the new seal-state test passes. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `reducer-seal-state.test.cjs` passes all 5 cases [TESTED: reducer-seal-state.test.cjs].
- The reducer-relevant suite is green with no new failures vs the pre-change baseline [VERIFIED: stash baseline — the 4 `command-*` failures are pre-existing on 28d9c4a81a].
- Re-reducing the packet-012 log (unsealed) yields `PASS, sealed:false`; with `--seal`, `PASS, sealed:true` [VERIFIED: in-tree reduceAlignmentState run].

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk:** a per-iteration reduce adds cost. Mitigated — alignment runs are ≤10 iterations over small corpora; the reduce reads JSONL + deltas and writes two files (negligible).
- **Risk:** a stranded run at partial coverage could read PASS if `sealed` were ignored. Mitigated — `sealed: false` is the single signal that the verdict is not authoritative; the report banner states it.
- **Dependency:** none new. Node built-ins only.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

A per-iteration reduce over an alignment packet (≤10 iterations, small corpus) reads the JSONL log + deltas and writes two files — sub-millisecond in practice; no measurable loop slowdown.

### Security

`sealed` is additive; a registry written by an older reducer lacks the field (treated as falsy → preliminary), the safe default. Test fixtures live under `os.tmpdir()` within approved roots, honoring the reducer's `resolveArtifactRoot` containment.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. A future enhancement could surface a partial-coverage ratio on sealed-but-incomplete runs, but `sealed` already prevents mis-reading a stranded verdict.

<!-- /ANCHOR:questions -->
