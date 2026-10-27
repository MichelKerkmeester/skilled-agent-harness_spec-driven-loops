# Deep Review Report: Weak Model Spec Authoring

## Executive Summary

Merged verdict from the lineage registries: **CONDITIONAL**, with P0=0, P1=4, P2=7. The conductor checked each P1 against the code. After that check, two P1s stand as written, and two read better as P2s.

| Lineage | Executor | Iterations | Lineage verdict | P1 | P2 |
|---|---|---|---|---|---|
| deepseek | cli-pi `deepseek-v4.1-flash-1017`, max | 3 | CONDITIONAL | 1 | 6 |
| sol | cli-codex `gpt-6-sol`, max, fast tier | 3 | CONDITIONAL | 3 | 1 |

Target: all work packet 054 shipped in phases 001 to 022, at `558570a83e`. Stop reason: `maxIterationsReached`, because the stop policy forced all three iterations in each lineage.

Run note: the DeepSeek lineage finished its synthesis at 06:20Z, but its `pi` process then sat idle without exiting. The conductor stopped it at 07:11Z (exit 143), and the fan-out then recorded both lineages as fulfilled.

## Adjudicated P1 Findings

| ID | Finding | Conductor check | Adjudicated |
|---|---|---|---|
| SOL-002 | Fence state toggles on either ``` or ~~~, so a ``` line inside a ~~~ fence flips the state and hides a later unfilled token. | Confirmed by code: `orchestrator.ts:794` `TOKEN_GATE_FENCE_RE = /^\s*(```\|~~~)/u` toggles `inCode` on any match, and `check-placeholders.sh:74` does the same in awk. | **P1, confirmed.** It is a false negative in a shipped gate. Fix: close a fence only on its opening marker type with at least as many markers, in both scanners, with a nested-fence test. |
| SOL-003 | `--path` names an existing symlink whose target is outside the repo, and the scaffold writes through it. | Confirmed by code: `create.sh:1240-1242` resolves only the parent and appends the basename. The containment check at `:1252` compares that unresolved path, and `mkdir -p "$FEATURE_DIR"` at `:2103` follows the link. Not executed, because the run would write outside the sandbox. | **P1, confirmed by reading.** It needs a pre-existing symlink in the repo. Fix: resolve an existing final component with `pwd -P` before the containment check, and add a symlink case. |
| SOL-001 | `--track` names a symlink under `specs/` that points elsewhere, and the packet is written there. | Confirmed as a spec-against-code contradiction. Phase 010 REQ-001 (`010/spec.md:142`) says create exits non-zero when the track "resolves outside `specs/`". `create.sh:1135-1137` deliberately never resolves a track, so that a symlinked track keeps working. `create-track-containment.vitest.ts:118` asserts that behavior. | **Downgrade to P2.** The `..` escape the requirement targeted is fixed, and the symlink pass-through is an explicit, tested design choice. One of the two must change: amend REQ-001 to cover `..` and absolute paths only, or make the code refuse an outside-resolving track. |
| F1-P1-001 | `validate.sh --strict` on a phase parent recurses, and each Draft child gets its own derived-metadata auto-repair. | Confirmed by code: `validate.sh:414` re-invokes the orchestrator CLI per child with the same flags, and the refusal list at `orchestrator.ts:1568-1590` has no recursion guard. However, `validation-rules.md` §auto-repair says only a person or model running the validator directly gets the repair, and that is the case here. Every write is announced. | **Downgrade to P2 (documentation gap).** The behavior matches the stated design, but the docs never say a recursive run repairs each Draft child. Fix: add one sentence to `validation-rules.md` and the card. |

Adjudicated totals: P0=0, P1=2, P2=9. The verdict stays **CONDITIONAL**.

## P2 Findings (reviewer severity, not re-verified)

- **SOL-004:** the parent goal's D1 and binding table still name phases 001 to 012. The parent spec's handoff criterion says nine phases while the map lists 22, and the parent status reads In Progress while every child is Complete.
- **F3-P2-001:** phase 021's implementation summary says its work is uncommitted, but it is committed.
- **F3-P2-002:** the phase 020 audit cannot be closed from its own `findings.json`.
- **F1-P2-002:** the header of `check-placeholders.sh` says validate.sh sources it. In production the native rule shadows it (`orchestrator.ts:427`, `:1363`).
- **F1-P2-003:** in `check-placeholders.sh:191`, the legacy scan's Draft-token branch is unreachable after the `continue` at `:174`.
- **F2-P2-001:** the repair's before and after snapshot reads every top-level packet file whole, twice, with no size guard.
- **F1-P2-004:** three command docs describe the rule set in changelog tense.

## Recommended Next Step

Run one remediation phase (023) under packet 054:
- **Code:** fix SOL-002 and SOL-003, each with a failing-first test.
- **Decision:** settle SOL-001 by choosing which side changes.
- **Docs:** add the recursion sentence for F1-P1-001.
- **P2 sweep:** clear the cheap record and doc P2s (SOL-004, F3-P2-001, F1-P2-002, F1-P2-003, F1-P2-004).

Lineage detail: `lineages/deepseek/review-report.md`, `lineages/sol/review-report.md`, `fanout-attribution.md` and the merged `deep-review-findings-registry.json`.

Review verdict: CONDITIONAL
