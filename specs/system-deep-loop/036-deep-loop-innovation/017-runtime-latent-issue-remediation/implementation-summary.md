---
title: "Implementation Summary: System-Deep-Loop Runtime Latent-Issue Remediation"
description: "Verify-then-fix remediation of the 016 audit P0+P1 findings across the deep-loop runtime: 27 confirmed fixes across eight workstreams plus a default-on structural ledger-backing gate (operator option C), with all fan-out regressions triaged and fixed against a captured baseline."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/017-runtime-latent-issue-remediation"
    last_updated_at: "2026-08-26T06:10:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented the P0+P1 fixes, the ledger-backing gate (C), and triaged all regressions"
    next_safe_action: "Confirm final-suite delta, validate --strict, commit locally, present for push go-ahead"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Remediation scope? Full verify-then-fix of P0 + all P1s (operator)."
      - "Executor? Sonnet 5 at xhigh, 8-workstream disjoint-file fan-out."
      - "Ledger-bypass handling? Option C — default-on structural ledger-backing gate with kill-switch."
---
# Implementation Summary: System-Deep-Loop Runtime Latent-Issue Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-runtime-latent-issue-remediation |
| **Level** | 2 |
| **Status** | In Progress (built + verified; commit/push gated on operator) |
| **Source audit** | `016-system-deep-loop-review` (1 P0 / ~19 P1 across review + research) |
| **Build model** | Opus (conductor) + 8× Sonnet-5 (xhigh) verify-then-fix workstreams |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A verify-then-fix remediation of the confirmed P0 and P1 findings, plus the operator-chosen structural ledger-backing gate. No P2s outside a touched file were fixed.

- **WS-GATEWAY** — F-029 (P0): the append gateway now fails closed (`ok:false`, `PROJECTION_FAILED`, CLI exit 2) when an attempted projection refresh fails, while preserving the receipt; benign pre-flight config states stay a durable `ok:true`. F-032: the synthetic zero-SHA cutover-binding fallback was removed in favour of a `BINDING_FAILED` refusal.
- **WS-MERGE** — F-010 (severity no longer silently downgrades to P2), F-011 (per-lineage isolation so one bad count cannot abort the whole merge), the `buildAttributionMd` active-disposition filter, and F-009 cross-list de-duplication.
- **WS-REDUCER** — F-012/F-013 (a warning-class input no longer withholds already-computed output), P1-3 (anchor/heading dialect), F-014 (content-compared dedup), F-016 (alignment dedup key excludes severity).
- **WS-SALVAGE** — F-034 (per-line quarantine instead of truncate-after-first-bad-line), F-039 (no identical recovered text to every gap), F-038 (alignment salvage covered), F-003 (writer-lock on append).
- **WS-POOL** — P1-2 (budget cap gates on guaranteed base spend), F-007 (orphan_requeued restores retry credit), F-022 (explicit sandbox-capability flag).
- **WS-CONTAINMENT** — P1-5 (a genuinely out-of-scope untracked write can fail the iteration; packet-internal writes stay a preserved advisory), P1-6 (the regenerable-state exemption is packet-scoped, not repo-wide).
- **WS-CONVERGENCE** — F-024 (loop-type coverage), F-027 (novelty trace), plus the ledger-backing gate below.
- **WS-DOCS** — P1-4/P1-7/P1-9 and the always-on gateway-adherence hardening in the deep-research/review/alignment packs and the six agent mirrors.
- **Ledger-backing gate (operator option C)** — `verify-iteration` now fails an iteration when, under ledger authority, the projection shows a complete iteration but no `{leaf}-ledger` frames back it. Default-on and fatal, with kill-switch `DEEP_LOOP_LEDGER_BACKING_GATE=0`. An opt-in watermark advisory (`DEEP_LOOP_VERIFY_GATEWAY_RECEIPT=1`) is retained.

### Files Changed

| Area | Files |
|------|-------|
| Runtime lib | `mode-append-gateway/append-mode-event.ts`, `deep-loop/write-containment.ts`, `deep-loop/jsonl-repair.ts`, `deep-loop/executor-config.ts` |
| Runtime scripts | `append-mode-event.cjs`, `fanout-merge.cjs`, `reduce-state.cjs`, `reduce-alignment-state.cjs`, `fanout-salvage.cjs`, `fanout-run.cjs`, `fanout-pool.cjs`, `convergence.cjs`, `verify-iteration.cjs` |
| Packs + mirrors | deep-research/review/alignment prompt-packs, `commands/deep/review.md`, `deep-review/SKILL.md`, `deep-review` agent mirrors (opencode/claude/pi/codex) |
| Tests | 13 runtime test files updated/added (fail-before/pass-after per fix) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A full vitest baseline was captured first (`10 files / 14 tests` failing pre-change) as the regression yardstick. Eight Sonnet-5 (xhigh) agents then verified their findings against source and fixed only the confirmed ones (32 confirmed, 11 false-positive, 1 uncertain; 27 fixed, 17 deliberately not). Six agents resolved relative paths against the main checkout by mistake; their edits were recovered by byte-identical patch-transfer into the worktree and the main checkout was restored to clean (ADR-005). The conductor reviewed every diff against source, then a whole-suite re-run surfaced five code-caused regressions, each traced to root cause and fixed: the gateway over-scope (ADR-002), the bypass check firing mid-migration, the containment fixtures tripping the operator's global `/specs` gitignore, and the cli-codex budget-cap semantics (ADR-004). The operator then chose option C for the ledger issue, which was implemented as the default-on structural gate (ADR-003).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

See `decision-record.md`: ADR-001 (verify-then-fix over blind application), ADR-002 (gateway fails closed only on an attempted-and-failed refresh), ADR-003 (default-on structural ledger-backing gate — operator option C), ADR-004 (budget cap gates on guaranteed base spend), ADR-005 (misplaced edits recovered by patch-transfer).

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Baseline captured | Pass | `10 files / 14 tests` failing pre-change |
| P0 fixed with negative control | Pass | gateway suite 12/12; engine-failure test fails closed, config-gap stays `ok:true` |
| Regressions triaged | Pass | 5 code-caused regressions each root-caused and fixed |
| Ledger-backing gate (C) | Pass | verify-iteration 18/18 incl. incident→`ledger_backing_missing`, backed→pass, kill-switch, legacy-inert |
| Comment hygiene | Pass | sweep across all code diffs: no finding-ids / spec-paths in comments |
| No new code-caused regressions | Pass | clean whole-suite run (157 files, 2590 passed): the only new failure vs baseline is the load-flaky `model-benchmark` timeout (imports no changed module); all 10 baseline failures unchanged, none newly-passing |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| Correctness | Every fix verified against source | 32 confirmed, 11 false-positive recorded | Pass |
| Fail-loud | Silent paths surface (exit code / thrown / gate) | gateway exit 2, ledger gate fatal | Pass |
| Reversibility | High-blast changes reversible | ledger gate kill-switch; per-workstream `git checkout` | Pass |
| Isolation | Scoped diff, no stray edits | only workstream files + tests + packet docs | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Ledger-backing gate residual risk.** The gate is default-on and fatal: any legitimate final-authority flow that does not create a `{leaf}-ledger` will fail until it does. Mitigated by the `DEEP_LOOP_LEDGER_BACKING_GATE=0` kill-switch. A live end-to-end deep-loop run through the gate was not exercised in this build.
2. **F-015 internal contract unchanged.** The reducer still reads the projection, not the ledger; option C catches the divergence at the verify-iteration boundary rather than rewriting the reducer's consumption contract.
3. **`model-benchmark-ledger-schema` is load-flaky** (~32s test straddling the 30s timeout); it passes 13/13 when the machine is quiet and imports none of the changed files. Left as pre-existing.
4. **17 findings deliberately not fixed** — 11 verified false positives and 6 confirmed-but-design-change items (e.g. retry backoff) recorded with reasoning rather than force-fixed.
5. **Environment fix was required for the whole-suite run.** Mid-session the `better-sqlite3` native module went stale against the running Node (`NODE_MODULE_VERSION 141` vs `147`), failing every SQLite-backed test regardless of source. An out-of-band `npm rebuild better-sqlite3` (isolated to the runtime's git-ignored `node_modules`, not part of this commit) restored it, after which the clean whole-suite run above was obtained. The stale-ABI condition is a machine/Node-version artifact, not a packet change.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Agents edit the worktree | Six edited the main checkout | cwd/relative-path split; recovered by patch-transfer (ADR-005) |
| Bypass detection as opt-in advisory | Default-on fatal structural gate | Operator chose option C after the initial build |
| Single whole-suite pass | Two remediation rounds | The gate correctly caught five regressions in the first fan-out |

<!-- /ANCHOR:deviations -->
