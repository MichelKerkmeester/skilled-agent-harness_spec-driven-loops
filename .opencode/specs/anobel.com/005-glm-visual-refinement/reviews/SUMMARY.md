# Multi-model second-opinion panel — SUMMARY

_2026-06-29. Five models (GLM-5.2 max-thinking, MiMo-v2.5-Pro, DeepSeek-v4-Pro max-thinking, Kimi-k2.7, MiniMax-M3) each ran 1 independent second-opinion review per phase over the 6 GPT-5.5-authored phases of `005-glm-visual-refinement`. 30/30 reviews delivered. Per-phase detail: `reviews/<phase>-panel.md`. Reviews are ADVISORY — no phase spec docs were edited._

## Headline
**The program is validated, the plans need revision.** Every phase scored **AGREE-WITH-CHANGES** (29/30; the one DISAGREE — DeepSeek on 001 — was about a fixable dimensional bug, not the approach). All 5 models independently endorse the core thesis: deterministic gates + geometry-out-of-the-model + external-auditor feedback. But the panel converged hard on **two systemic weaknesses GPT-5.5 missed**: (1) the plans front-load engineering before falsifying their own central assumption, and (2) the predicted lifts are optimistic-to-self-rejecting.

## Per-phase verdict
| Phase | Consensus | Mean conf | Net |
|---|---|---|---|
| 001 spatial-contract-and-gate | AGREE-WITH-CHANGES (1 DISAGREE) | ~0.71 | **REVISE (strongest)** — close the 480→560 re-derivation/copy-paste hazard, cheap probe before the 135-gen run, honest SC, freeze the failure-JSON schema |
| 002 primitive-routing | AGREE-WITH-CHANGES | ~0.73 | **REVISE (light)** — closest-to-keep; map-as-prior + render override; route-by-defect too; safe-default unmapped |
| 003 minimax-auditor-in-loop | AGREE-WITH-CHANGES | ~0.74 | **REVISE / RE-SEQUENCE** — strong case to fold into 001 or defer after 004/005; replace regex with audit booleans |
| 004 skeleton-first-2d | AGREE-WITH-CHANGES | ~0.70 | **REVISE ARCHITECTURE** — adopt A7 renderer-first; pilot GLM-obedience first; define best-of-3 |
| 005 gpt5-5-skeleton-author | AGREE-WITH-CHANGES | ~0.73 | **REVISE** — add spatial validator + 1 repair; GPT-5.5 picks template+params not raw coords; lower the +3 bar |
| 006 adoption-gate-and-rerun | AGREE-WITH-CHANGES | ~0.74 | **REVISE** — break circular validation; pre-register ADOPT rule; gate on recovered-2D, not downgrade inflation |

## Top cross-phase improvements GPT-5.5 missed (ranked)
1. **[004+005] Resolve A5-vs-A7 → adopt A7 (deterministic renderer; GLM/GPT-5.5 emit a semantic plan, code computes pixels).** Biggest finding — 5/5 on 004, 4/5 on 005. Removes the untested "model obeys coordinates" risk + the audit-tag circular dependency. MiniMax's reframe: "models pick a template+params; a deterministic engine places coordinates" (LLMs are bad at the exact coordinate math these phases ask for).
2. **[001,004,005,006] Run a cheap falsification PILOT before building.** The meta-theme: every novel phase front-loads 8-20h before testing its central premise. Pilots named: GLM-obeys-skeleton on 2-3 sentinel tiles (004/005, ~2h, <85% compliance kills the thesis); one-shot-repair success rate (001); gate-on-existing-baseline confusion matrix (001/006).
3. **[001,004,005,006] The predicted lifts are optimistic / self-rejecting.** 001 +16-22pp → realistic +7-16; 004 +15 → +8-12 (templated-feel tax); 005 +3 go/no-go bar = the predicted ceiling (~33% chance of self-rejection even if it works); 006 n=45 → ±10-12pt CI, not ±3. Lower bars, report confidence intervals, treat as hypotheses.
4. **[006] Break the circular validation.** The adoption gate *determines* SHIP and SHIP is *measured against* the gate → self-validating. Add 25-30 independent human-labeled tiles to calibrate gate precision/recall + a gate-config ablation (loose vs full = the "gate tax") + a pre-registered ADOPT/ITERATE/REJECT typed function BEFORE the run.
5. **[006] Gate on recovered-2D, not downgrade inflation.** SHIP can rise by converting 2D→linear (the gate rewards downgrades). Hard criterion: ≥50% of recovered tiles must be genuine `recovered-2D`, not `downgraded-to-linear`.
6. **[004,005] best-of-3 is a no-op as written** — deterministic recompute = identical candidates. Name a variation axis (row-height, layout-mode, node-order) or drop it.
7. **[002] Route by DEFECT, not just primitive.** Linear tiles also overflow (RC-1: goedkeuringssysteem-1/3, favorieten-3) but get `repair=failure-only` with no mandatory round-2. Make the map a prior with a render/runtime override + a safe default for unmapped tiles.
8. **[003] Re-sequence or fold A4.** Its value duplicates 001 (procedural RC-1/RC-3) or belongs after 004/005 (gate-blind RC-2). Tally the 18 FIX findings by RC-id first; if ≥70% are RC-2 collisions, skip A4 and fund 004.
9. **[001,003,005] Replace brittle string/regex classifiers with structured signals** — 003's `classifyFixes` regex misroutes fixes (worse than none); 005's `forbid_glm_coordinate_text` regex false-positives on `flex:1`/`transform:translate(-50%)`; use the audit booleans / a permitted-CSS allow-list instead.

## Confirmed red flags
- **001 is a provenance/re-derivation hazard, NOT a fatal contradiction** (re-verified against 001/spec.md): the spec is internally consistent at **560×480** (REQ-001 uses x=30..530, y=30..328, title 356..456; the 480 literals never appear; §3 forbids retargeting to 480). DeepSeek's "FATAL/breakage on every tile" overstated it. The legitimate shared concern: the geometry's provenance is the 480×480 A1 research adapted to 560 without showing the re-derivation (pad 30-vs-24, title-y 356-vs-352, visual width 432→500), and the spec calls that research "copy-pasteable" — a copy-paste hazard to close before coding, not an unimplementable bug.
- **004 + 005 central premise untested**: "GLM/GPT-5.5 faithfully renders from a skeleton/scaffold" — it's the same negative-constraint-following GLM already fails; rated "Low likelihood" with zero evidence.
- **006 MiniMax hard-gate contradiction**: REQ-001 requires MiniMax-pass to ship, but failure-only auditing leaves linear winners `status=unknown` → blocked. Calibrate MiniMax vs human labels or make it a shadow diagnostic.

## Validated vs needs-revision
- **Direction validated (5/5): all 6 phases** — keep the program.
- **Closest-to-ship:** 002 (light revise).
- **Strongest revision / build-blockers:** 001 (480→560 re-derivation hazard + the unmeasured one-shot-repair premise) and 004 (the A5/A7 architecture choice).
- **Re-sequence candidate:** 003 (fold/defer pending the FIX-by-RC tally).
- **No phase should be implemented as currently written** — fold the above before building, starting with 001's revisions (it's still the recommended first build).

All 5 models delivered on all 6 phases (30/30).
