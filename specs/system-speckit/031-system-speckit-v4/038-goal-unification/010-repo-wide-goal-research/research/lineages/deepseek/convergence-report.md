# Convergence Report — lineage `deepseek`

Session `fanout-deepseek-1789192823658-autusz` · loop `research` · five iterations run.

## Verdict

**Stopped on the max-iterations cap, not on convergence.** The run used its full budget of
five rings; production never fell to zero, and the widest ring (4) was the second-highest
producer of new material. `convergenceThreshold` 0.05 was carried as telemetry and was never
operative under `stopPolicy: max-iterations`.

## Per-iteration metrics

| Iteration | Ring | newInfoRatio | Findings | Corrections | Resolved questions |
|---|---|---|---|---|---|
| 1 | The goal engine | 0.95 | 9 | — | — |
| 2 | Every runtime surface | 0.88 | 9 | 1 (R1-F7) | — |
| 3 | Spec-kit's own goal contract | 0.86 | 6 | 1 narrowing (R2-F8) | — |
| 4 | Everything else that touches a goal | 0.80 | 11 | 1 (R1-F1 downgrade) | 4 |
| 5 | The whole picture + stragglers | 0.30 | 1 | — | — (register consolidated) |

Totals: **36 findings**, 2 corrections, 4 resolved questions, 15 reconciled contradiction
entries (C1–C15), 8 unowned surfaces, 12 consolidated reader traps.

## What convergence would look like, and why this run did not reach it

Novelty held above 0.80 for the first four rings because each ring opened genuinely unread
surfaces (engine → runtime fleet → spec contract → the long tail). Ring 5's job was synthesis,
so its 0.30 is the expected shape of a capstone, not evidence that more rings would add
nothing: ring 4 still produced eleven findings, several of them (the dead constitutional
citation, the resume divergence, the stale playbook counts, the plugins-README flag rule)
outside every earlier ring. A sixth ring could reasonably widen to prior-packet and
cross-repository surfaces (currently excluded by scope) — that is a scope decision, not a
convergence signal.

## Residual unknowns (carried into `research.md` §7)

1. C7 design intent — whether a disabled hook is meant to freeze read-only packet reads.
2. C4's durable answer — rename vs mapping for the two status vocabularies.
3. C10 — the Claude Code / Codex host goal command, unobservable from this repository by construction.
4. The deleted constitutional rule's content — INFERRED from a git `lost-found` object; settle by restoring or repointing the citations.
5. Runtime-observed gap — unit suites were executed (137/137); a live OpenCode bind/transform
   pass was not, and nothing in the register depends on it.
