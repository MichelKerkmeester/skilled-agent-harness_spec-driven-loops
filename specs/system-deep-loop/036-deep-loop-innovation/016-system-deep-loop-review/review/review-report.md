---
title: "Deep Review Report — System-Deep-Loop Broad Audit"
trigger_phrases: []
---
# Deep Review Report — System-Deep-Loop Broad Audit

- Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/016-system-deep-loop-review`
- Review target: the whole system-deep-loop surface — runtime (`lib/` + `scripts/`), the 8 `/deep:*` command docs + 16 orchestrator YAMLs, the deep-loop agents across six runtimes, and the mode-packet SKILLs/references
- Execution: fan-out, 2× cli-pi lineages both at `--thinking xhigh` (cline `x-ai/ox-alpha`, openrouter `stealth/ox-alpha`), stop policy `max-iterations`
- **Converged early on operator instruction.** cline completed 20/20 iterations; openrouter reached 7/20 (its stealth session exited early twice, `salvage_miss`) and contributed its partial registry. Merge is over both.
- Date: 2026-08-26

## 1. Executive Summary

- **Merged verdict: CONDITIONAL** (strongest-restriction over both lineages)
- Active findings: **P0 = 0 · P1 = 10 · P2 = 21** (31 unique after cross-lineage dedup; one P1 is the same issue corroborated by both lineages, so ~9 distinct P1s)
- No release-blocking P0. The P1s are independently actionable and none requires re-architecture.
- The review found real correctness bugs and drift across the runtime **and** caught three gaps in the just-landed 015 remediation.

### Findings that touch the 015 work (shipped to main this session)

- **P1 — prompt-pack self-contradiction (WS1/T002).** `deep-review/assets/prompt-pack-iteration.md.tmpl:78` still lists `{state_paths_state_log}` under ALLOWED WRITE PATHS, contradicting the gateway contract added at `:94,:120` ("read-only projection… never written directly"). The alignment pack got this fixed; the review pack did not. **Verified against source.**
- **P1 — write-containment edge cases (WS5).** `write-containment.ts:357` — untracked out-of-scope writes never fail an iteration and become baseline-exempt after one advisory; `:296` — the regenerable-state exemption suffix-matches every `description.json` repo-wide.
- **P2 — attribution/verdict filter (WS7).** `fanout-merge.cjs:849` `buildAttributionMd` derives its verdict from `findingsBySeverity` without the `(disposition ?? status)==='active'` filter `mergeReviewRegistries` now uses. No live divergence today (producers keep counts aligned).

## 2. Planning Trigger

Verdict CONDITIONAL routes to `/speckit:plan` for remediation. The P1 lanes below are independently actionable.

## 3. Active Finding Registry (P1)

| # | Lineage | Finding | Location |
|---|---------|---------|----------|
| P1-1 | both | Unresolvable cutover binding degrades to a fabricated synthetic zero-SHA operator identity instead of failing closed → unverifiable provenance in the ledger | `runtime/scripts/append-mode-event.cjs:324-347,331` |
| P1-2 | cline | Budget cap counts the worst-case retry ladder as guaranteed spend → the default 20-iteration config is unlaunchable pre-dispatch (this run tripped it) | `runtime/scripts/fanout-run.cjs:795-806` + `lib/deep-loop/executor-config.ts:647` |
| P1-3 | cline | Reducer ANCHOR contract vs template MACHINE-OWNED dialect mismatch duplicates machine-owned sections on fresh runs | `runtime/scripts/reduce-state.cjs:1654-1676` |
| P1-4 | cline | Prompt-pack lists the state log as leaf-writable while the output contract forbids direct writes (015/WS1 drift) | `deep-review/assets/prompt-pack-iteration.md.tmpl:78 vs :94,:120` |
| P1-5 | openrouter | Untracked out-of-scope writes never fail an iteration and become baseline-exempt after one advisory (015/WS5 area) | `lib/deep-loop/write-containment.ts:357` |
| P1-6 | openrouter | Regenerable-state write-containment exemption suffix-matches every `description.json` in the repo, not just the packet's | `lib/deep-loop/write-containment.ts:296` |
| P1-7 | openrouter | The mandatory final-line verdict contract is absent from all six agent mirrors and the prompt pack (only the SKILL states it) | `deep-review/SKILL.md:200` |
| P1-8 | openrouter | Reducer folds same-`findingId` entries with no content comparison, silently dropping colliding distinct findings | `runtime/scripts/reduce-state.cjs:816` |
| P1-9 | openrouter | `review.md` documents raise-above-4h lineage-timeout semantics the runtime rejects outright | `commands/deep/review.md:113` |

(P1-1 counts once here; the merge listed it twice because the two lineages cited overlapping line ranges — a corroboration, not two issues. The review itself flagged this double-count weakness in the merge; see P2 themes.)

## 4. P2 Themes (21 findings)

Correctness / drift: silent 12-iteration budget fallback vs documented default 7 (found by both lineages); `{config.fanout_json}` template variable has no producer so budget overrides never reach the guard; tsx bootstrap failure escapes as an unstructured throw not a JSON envelope; mechanical leaf-gate (`verify-iteration.cjs`) covers only 3 of 8 loop modes; forced-depth stop-policy exposed by only 2 of 8 modes; salvage sweep stamps identical recovered stdout into every missing iteration file; orchestration summary reports terminal failure while the status log shows a live relaunch.

Merge/dedup: corroborating cross-lineage findings surface as CONTRADICTS conflict sets and double-count; near-duplicate dedup is opt-in via an undocumented env var; attribution-table verdict skips the active-disposition filter (015/WS7).

Cross-runtime / docs: codex agent copies hard-pin `gpt-5.5/high` while other runtimes leave the model operator-routed; library README claims 37 domains but 60 exist on disk; protocol docs reference a dashboard Lifecycle section the renderer emits only inside STATUS; `lib/skill-benchmark-reducers` has zero production consumers; changelog sequence gap in the `1.11.0.N` series; YAMLs declare a caller-supplied `session_id` input with no documented supply path.

Security-adjacent: production transition policy is an unconditional ALLOW, making the per-event authorization layer a no-op on that path.

## 5. Convergence Note

Operator converged early after cline's lineage completed (20/20) and openrouter reached 7/20. cline is the authoritative full pass; openrouter contributed 6 P1s and 7 P2s from its partial run before its stealth session exited. A notable operational finding in its own right: **openrouter's ox-alpha stealth channel exited its dispatch after ~4–7 iterations twice, while the Cline provider ran the full 20** — a real reliability difference between the two providers at xhigh.

## 6. Audit Appendix

- Merge: `mergeReviewRegistries` over both lineage registries → CONDITIONAL, activeP0=0/P1=10/P2=21, 31 unique openFindings.
- All P1 citations carry `file:line`; the 015-touching findings (P1-4, P1-5, P1-6, and the WS7 P2) were re-verified against source by the conductor.
- Scope honored: the run was instructed not to re-derive the remediated 014 gateway-alignment findings and to treat 015 as a drift-check focus, which is where P1-4/P1-5/P1-6 came from.
