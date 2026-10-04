# Deep-Research Dashboard — swe-2-max (concision)

| field | value |
|---|---|
| Lineage | swe-2-max |
| Session | fanout-swe-2-max-1791120151016-ksetij |
| Executor / model | cli-devin / swe-2-max |
| Loop type | research |
| Angle | CONCISION (steer.md) |
| Iterations run | 3 / 3 (maxIterations) |
| Stop policy | max-iterations |
| **stopReason** | **maxIterationsReached** |
| Convergence threshold | 0.05 (telemetry only under max-iterations) |
| newInfoRatio | 0.92 → 0.85 → 0.80 (never converged) |
| Write surface | lineage dir only — verified (see containment below) |

## Iteration ledger

| iter | focus | key output | newInfo |
|---|---|---|---|
| 1 | part decomposition | all 13 files split into steer parts; grand total 107,092 B reconciles exactly to evidence-pack §1; rule-statement 54.0%, self-check 10.2% | 0.92 |
| 2 | compression patterns + card test | 10 named patterns P1–P10 with measured savings; card test per-file verdict (holds 2 umbrella files, fails 6 enumerated); self-check identified as outside-card carrier; modelled targets ~77,000 B | 0.85 |
| 3 | shortened drafts | communication 11,458→8,279 (−27.8%, 3 named edge losses); evidence-and-proof 11,823→10,465 (−11.5%, ~zero loss); uniform model falsified — floor tracks rule-statement share | 0.80 |

## Headline findings

1. **Imperatives are the unit.** The corpus's one measured effect belongs to a 9-word bare prohibition (semicolons 37.0%→17.0%, evidence-pack:46); the ~500 B justified table block shows none (:45). Labelled n=2 — confounded by detection ambiguity (:51).
2. **54% of the corpus is norms; the rest is apparatus, motivation, restatement.** Compression removes the latter almost for free.
3. **Card-only loading fails enumerated files** — drops every operative prohibition including the measured one. Card+checklist is the corpus's own slim form but keeps norm-shape, not norm-content.
4. **Measured draft floors:** −27.8% (communication) and −11.5% (evidence-and-proof); per-file floor ∝ normative share, not a global rate.
5. **Self-check is enforcement, not redundancy** (10,941 B, 10.2%): it is the compressed restatement a slim loader would otherwise have to synthesize.

## Quality guards

- [x] Every claim cites `file:line` or a prep measurement; unmeasured figures marked UNKNOWN.
- [x] Independent re-measurement of sibling claims (card sizes 18,207 vs 17,882).
- [x] Self-falsification surfaced and recorded (iter-3 refutes iter-2 uniform model; REFUTES edge in deltas).
- [x] Ruled-out directions recorded per iteration.
- [x] Drafts verified against the corpus's own prose rules (0 self-introduced em dashes; semicolons all inherited).

## Containment

All created/modified files live under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max` and nowhere else. No git writes, no parent-spec writeback, no shared telemetry, no nested agent/CLI dispatch — every iteration ran inline in this session.
