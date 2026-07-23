---
title: "Combined Synthesis: Parent-Hub defaultMode Policy (Run-1 + Run-2 Divergent)"
description: "Two-run deep-research study on whether a parent hub's routerPolicy.defaultMode should name a child or be null. Run-1 established keep-1 (sk-prompt) / flip-4 (cli-external, system-deep-loop, mcp-tooling, sk-design) to null with a defer-time-suggestion reframe. Run-2 was told to DIVERGE: 3 usable lineages (sol-ultra, terra-max, glm-max; luna-max failed) add a runnable live-falsification benchmark, a compressed-disambiguation-card fallback (vs the full registry), a one-hub-at-a-time migration/rollback contract, a co-dominance evidence ladder, Layer-0/Layer-1 coupling analysis, a per-axis archetype reframe, second-order anti-patterns of null+mode-map, and one genuine per-hub challenge: cli should be detection-defaulted (runtime-detected), not pure-defer. Verdict direction survives; cli encoding and the fallback-helper shape change; the three nulls are downgraded from settled to directional-pending-measurement."
trigger_phrases:
  - "default mode policy combined synthesis"
  - "run 2 divergent defaultMode findings"
  - "cli detection-defaulted vs pure-defer"
  - "null hub compressed disambiguation card"
  - "defaultMode migration rollback"
importance_tier: "important"
contextType: "research"
---

# Combined Synthesis: Parent-Hub `defaultMode` Policy (Run-1 + Run-2 Divergent)

**Method.** Two research runs. Run-1 (4 iterations: 3 GPT-5.6-SOL + 1 Fable-5 adversarial lens) produced the established answer. Run-2 was a 4-model parallel fan-out told to **diverge** from run-1, not re-derive it — so it deliberately does NOT re-litigate the keep/flip table; it stress-tests the *reasons*, the *encoding*, the *experiment*, and the *edges*. One lineage (luna-max, 7 iterations) **failed entirely** on a workflow Gate-3 loop and produced nothing. Run-2 therefore = **13 usable iterations**, not 20: sol-ultra (3), terra-max (5), glm-max (5).

> **Provenance caveat (honest, up front).** sol-ultra emitted explicit `Route Proof` blocks (iters 2-3) and terra-max ran **real** `router-replay` commands (its findings carry `command output:` citations — the only lineage that actually executed the router). glm-max produced the **most consequential** divergences (the cli recovery, the four-shape rule, the second-order anti-patterns) but carries **no route-proof block and no command output** — it is source-reading + inference only. Its line-citations check out internally, but treat glm-max's *source citations* as the load-bearing evidence and its harness provenance as unconfirmed. Nothing here has been live-model measured; all verdicts remain proposals over a live-routing behavior change.

---

## Bottom line — does run-2 change the run-1 verdict?

**The direction survives. One hub's encoding changes, two encoding details sharpen, and the confidence honesty improves.**

- **Keep-1 / flip-4 stands as a direction.** sk-prompt keep and the three nulls (system-deep-loop, mcp-tooling, sk-design) are not overturned by any run-2 lineage.
- **The one genuine per-hub challenge is `cli-external-orchestration`.** glm-max (iter 4-5) argues cli should **not** be encoded like the other three "pure-defer" flips: cli alone has an *environmental* signal (which CLI runtime you are inside is machine-detectable), so it should be **detection-defaulted** — `defaultMode: null` **plus** a runtime-detection block that auto-picks the in-runtime executor — not `null + mode-map`. This is not really a contradiction of run-1's *insight* (Fable already called cli's default "runtime-dependent … a detection problem, not a default problem"); it converts that observation from "flip to null" into a *positive encoded shape*. Null remains the right first step both agree on; the divergence is whether to stop there.
- **Two fallback/encoding details change under cross-model pressure.** (1) The null-hub fallback should be a **compressed disambiguation card, presented not scored** — *not* the full `mode-registry.json` run-1 named. All three lineages converge here. (2) `defaultApplied` needs **dual telemetry** (configured vs consulted vs selected), not the bare rename run-1 proposed.
- **The three nulls are downgraded from "settled" to "directional-pending-measurement."** Run-1 explicitly "routed around needing a corpus"; run-2 shows you *can* build a falsifiable live experiment (sol-ultra) and that the flips are cheap at Layer-0 (glm-max) — but also that, absent that measurement, the three nulls remain *unfalsified in the over-deferring direction*.

Updated one-line-per-hub table (baseline = run-1; delta = run-2):

| Hub | Run-1 verdict | Run-2 delta | Net |
|---|---|---|---|
| `sk-prompt` | KEEP (catch-all anchor + defer-time suggestion) | Unchanged; glm condition-(b) keep, sol "declared-prior" case | **KEEP** |
| `cli-external-orchestration` | FLIP → null (+ neutralize `defaultResource`) | **glm: null is right first step but incomplete — encode runtime detection (`detection-defaulted`)** | **NULL + runtime-detection block** (contingent on a robust runtime-detection test) |
| `system-deep-loop` | FLIP → null (fully vestigial) | Confidence downgraded to directional-pending-measurement | **NULL** |
| `mcp-tooling` | FLIP → null (already defer-with-suggestion) | Same, plus fallback = compressed card not full registry | **NULL** |
| `sk-design` | FLIP → null + move `hub-identity` off all 6 modes | Confirmed not detection-feasible (no env signal); most likely future detection candidate (URL→md-generator) | **NULL + hub-identity → discovery-only** |

---

## Thread-by-thread: what run-2 ADDED / CHALLENGED / CONFIRMED

### A. Live-routing / benchmark experiment design — *does a real model on a null hub disambiguate well, and what is the runnable test?*
Lineages: sol-ultra (iter 1-2), terra-max (iter 2).

- **CONFIRMED (all).** Run-1's replay semantics hold line-for-line: `defaultApplied = selectedModes.length===0 && policy.defaultMode!=null`; `workflowMode` stays null on zero signal; a named child and `null` are **replay-indistinguishable** except for the flag. (sol-ultra iter 1, citing `router-replay.cjs:342-356,476-480,643-702`; terra-max iter 1-2, same.) So today's exact-set gold *still* cannot tell a keep from a flip — the run-1 finding is independently re-confirmed twice.
- **ADDED — the falsifiable live experiment run-1 said it was routing around.** sol-ultra turns "keep vs null" into a runnable, non-mutating benchmark (sol-ultra iter 2): copy each hub's `SKILL.md` + `hub-router.json` + `mode-registry.json` into an isolated fixture root (never edit live hubs), then run a **2×4 factorial**: policy `{named default, null}` × helper `{full registry, compressed card, child hint, none}`, driven through the existing Lane-C `live-executor.cjs:18-26,60-90,270-342`. Corpus is stratified `{zero-signal / boundary / weak-but-resolvable}` (12 stems/hub), dual **blind**-graded on the repo's 0/1/2 evidence dimensions plus one primary outcome bucket (`correct_pick / targeted_question / unsupported_pick / arbitrary_pick / freeze / invented_mode`), **3 replays** as a screening floor (the stability helper refuses a verdict below 3 — `benchmark-stability.cjs:16-35,112-135`), **10** to confirm threshold-crossers, with **preregistered per-hub falsification margins**. Full screening matrix = 5 hubs × 12 stems × 8 arms × 3 models × 3 replays = **4,320 live dispatches**.
  - Falsification is symmetric: a named default is falsified as harmless if it *raises* unsupported/arbitrary picks on defer strata; null is falsified as preferable if it *raises* freezes/unnecessary questions without reducing wrong picks (sol-ultra iter 1).
  - **Honest ceiling (sol-ultra iter 2 "What This Experiment Cannot Infer").** It still cannot estimate production prevalence or prove ~80% dominance — the corpus is balanced by design, not sampled from traffic. So it answers *falsification*, not *prevalence*.
- **ADDED — the only actually-executed evidence in either run.** terra-max iter 2 *ran* `router-replay` on `sk-doc`: a zero-signal prompt → no intents, `defaultApplied:false`, `deferReason:"no-mode-scored"`; an alias prompt → `create-command`; an adversarial "…but only one; choose one" prompt → tied `create-command`+`create-flowchart`, `deferReason:"ambiguous-multi-axis"` **but replay still returned both candidate modes and resources**. Lesson: deterministic replay is a necessary mechanical baseline but *cannot* grade whether a live model honored the "only one" constraint — you need the live pass. This grounds sol-ultra's design in a real trace.
- **Net.** Mild CHALLENGE to run-1's "deliberately route around needing a corpus": run-2 shows a falsifiable experiment is buildable *and* names precisely what it still can't prove.

### B. Minimum-useful shape of the null-hub routing-helper resource — *full registry vs a compressed card?*
Lineages: terra-max (iter 1), sol-ultra (iter 2, as an experimental factor), glm-max (iter 3).

- **CHALLENGED (strong 3-model convergence against a run-1 detail).** Run-1 said the null fallback loads the **routing helper = `smart_routing.md` + `mode-registry.json`** (the full mode-map). Run-2 pushes back on the *full registry*:
  - terra-max iter 1: the full `mode-registry.json` is **not** a minimal null-state helper — it carries all workflow entries with packet identity, command, aliases, tool surfaces, advisor metadata (`sk-doc/mode-registry.json:17-160`). Payload sizes (measured with `wc -c`): `quick_reference.md` 14,132 B, full registry 10,515 B, `hub-router.json` 5,937 B. Proposes a **newly generated compressed disambiguation card**: defer reason + 0-2 ranked candidate labels (one discriminating alias each) + the four hub confirmation fields + a child hint *only for an already-ranked candidate*.
  - glm-max iter 3 (the mechanism): `smart_routing.md` is **safe** as a fallback resource — its `DEFAULT_RESOURCE = []`, so it loads nothing on zero signal (`sk-design/shared/references/smart_routing.md:72-75`). But `mode-registry.json` is a **menu, not a scorer**; loading it is safe **only if presented as a disambiguation card**, never scored. Fix: an explicit `defaultResourceSemantics: "disambiguation-card"` distinct from a scored resource, and a **compressed card derived from the registry** (iter 3 A4).
  - sol-ultra iter 2 treats helper shape as a *separate experimental factor* and gives a decision rule: prefer the compressed card if it is non-inferior to the full registry within 3 pp and cuts median input tokens ≥20%.
- **Net.** Run-1's `smart_routing.md` half is confirmed safe; its "load the full `mode-registry.json`" half is superseded by a **compressed, presented-not-scored card**. This matters because loading the raw registry is exactly what risks recreating the disease (Thread G).

### C. Migration & rollback — *safe ordering of the 4 flips, regression surface, gating.*
Lineages: sol-ultra (iter 3), terra-max (iter 3).

- **ADDED — the ordered, reversible contract run-1 lacked.**
  - terra-max iter 3: change **one hub's `defaultMode` at a time, single-field only** — never a coupled router/vocab/registry/fallback redesign, because coupled edits destroy causal attribution and clean rollback. Per-change gate: D5 connectivity + hub-registry scan; run the frozen target-owned playbook corpus with route-gold enabled; retain the JSON/Markdown report + topology digest (`run-skill-benchmark.cjs:10-20,65-89,246-298`). Keep two immutable fixture views (baseline gold unchanged + candidate-specific private gold). Promote only when the candidate ≥ predeclared pass rate and cost envelope; roll back by **restoring the one recorded value and rerunning the baseline**. Honest limits: no runtime canary/percentage selector exists — don't assume one; structural + route-gold failures are zero-tolerance; any live tolerance must be predeclared.
  - sol-ultra iter 3: an **8-step additive rollout** — (1) schema/parser + legacy normalization, (2) dual-emit telemetry + teach reports/tests both names, (3) fixtures for all archetypes + empty/single-mode/stale/rename failures, (4) canon/templates, (5) annotate hubs *without changing routing*, (6) deterministic + live gates, (7) *only then* per-hub policy-value changes, (8) remove the old field after a clean repo-wide consumer scan. Rollback reverses dependency order (hub values first; keep tolerant readers + dual telemetry until old artifacts age out). **Legacy packets cannot be auto-classified from `defaultMode` alone** (non-null coexists with defer; null means either defer or detect) → explicit per-hub annotation, **not** an automatic codemod.
- **CONFIRMED + extended.** Both reinforce run-1/Fable's "each flip is a two-field decision" and add the sequencing and rollback discipline run-1 only gestured at.

### D. Co-dominant modes / the dominance evidence rule.
Lineage: terra-max (iter 4).

- **ADDED — an operational ladder that replaces run-1's unfalsifiable inequality.** Run-1 (SOL iter 2) built an expected-loss inequality; Fable judged it "unfalsifiable in practice." terra-max iter 4 gives the testable version: run a contextual detector first → a unique predeclared discriminator ⇒ `single`; if the prompt *independently* requests both compatible tasks and an explicit bundle rule supports order ⇒ `orderedBundle`; if two modes stay co-dominant, or the user wants one but supplies no discriminator ⇒ `defer` + a **ranked helper shown as a non-binding explanation, never dispatched**. A candidate becomes a "true dominant default" **only** after a current-ID, independently private-golded corpus keeps it the unique desired outcome **with `defaultMode` held null during measurement**, invariant under paraphrase/alias-order/context, preserving explicit-bundle and contradictory-single-choice cases (`sk-doc/hub-router.json:4-20`, `run-skill-benchmark.cjs`). Absent that counterfactual, the default is a *presumption* and the correct outcome is `defer`. Explicitly **ruled out**: `tieBreak` order or an already-configured `defaultMode` as dominance proof.
- **Net.** CONFIRMS run-1's "configuration is the hypothesis, not evidence" and gives it a falsifiable measurement (hold the default null, require invariance).

### E. Layer-0 (advisor) ↔ Layer-1 coupling under a null default.
Lineage: glm-max (iter 1).

- **ADDED — an entirely new vertical run-1 never opened, and it strengthens the flips.**
  - The advisor **already** pre-resolves a `(skill, mode)` pair for **one** hub (system-deep-loop) via `_apply_deep_skill_routing_layer()` writing `recommendation["mode"]/["workflowMode"]`, gated on a lexical `has_deep_signal` regex (`skill_advisor.py:2784-2793,2825-2860`). So "should the advisor pre-resolve more so hubs never reach zero-signal" is a **real shipped capability** — but a bespoke, hand-maintained per-hub scoring table; generalizing it would duplicate each hub's `mode-registry.json` discrimination logic into the advisor.
  - The advisor's own low-signal behavior **is** defer-with-clarification (`clarifying_question` below `DEEP_ROUTING_CONFIDENCE_THRESHOLD`; `DEFAULT_RESOURCE_SEMANTICS="fallback-only"` — `skill_advisor.py:2810-2811,2865-2866`, `system-skill-advisor/SKILL.md:122-126`). Layer-0 and a null Layer-1 hub speak the **same** disambiguation vocabulary.
  - **Key reframe:** the "extra clarification" cost run-1/Fable attributed to null is **relocatable, not additive** — with a deep-routing layer it surfaces at Layer-0 (early); without one, in-hub (late); the user sees ~one clarification either way. And there is **no re-escalation loop**: the defer terminates at the *user*, not back at Layer-0 (`system-skill-advisor/SKILL.md:61-73`). Flipping the four hubs moves **zero** work to Layer-0 — only the in-hub fallback branch changes.
- **Net.** CHALLENGES the run-1-spec framing "null pushes cost to Layer-0" (it does not, unless you also build a deep-routing layer) and thereby *lowers* the perceived cost of the flips.

### F. Is detection-routed the universal archetype? (sk-design feasibility)
Lineage: glm-max (iter 2, with iter 4).

- **ADDED / REFRAMED.** sk-code's "detection-routed" works **only** because its discriminator is *environmental* (surface from `CWD + library markers`, `sk-code/SKILL.md:120-122`); it nulls `defaultMode` on the *workflow* axis (intent). So **detection is an axis-level property gated on an environmental signal, not a hub-level one** — sk-code is *both* archetypes at once (detect surface + defer workflow). sk-design has **no** environmental discriminator for its five judgment modes — all aliases are request vocabulary (`sk-design/mode-registry.json:55-118`) — so sk-design **cannot** be detection-routed (the signal isn't there); only `md-generator` is semi-detectable (a URL present), 1 of 6.
- **CHALLENGED (mis-leveling, not direction).** Run-1's "add a *third hub archetype* (defer-routed)" is right in spirit but **mis-leveled** — the canon should describe routing strategy **per axis**, and `routerPolicy` should declare strategy per axis, not one hub-level `defaultMode`. Run-1's third archetype is **not** redundant (detection is not universal), but it should be one of several *per-axis* strategies.

### G. Second-order anti-patterns of `null + mode-map` — *does the fix recreate the disease?*
Lineage: glm-max (iter 3).

- **ADDED — the direct stress-test run-1 skipped.** Answer: **no, provided you present-not-score and use a compressed card** — otherwise yes.
  - The canon *already names* the mechanism: hub-identity belongs on the **default mode only**; a class shared across modes makes them all co-fire — "over-emission that fails the route-gold gate" (`parent_skill_hub_router_template.json:5,37,60-62`). So "flip to null" **evicts hub-identity's only scoring home** — the point (kills bias) *and* the seed of the costs below.
  - **A1 (over-deferring friction):** the skill's own bare name (`design`, `prompt`) then scores no mode and defers every time. Safe but potentially annoying; bounded (menu, not dead end). Canon should *name* this as the expected cost so authors don't re-add a default to suppress it.
  - **A2 (the disease recreated — the central risk):** loading `mode-registry.json` recreates the co-fire over-emission **only if a future author scores the menu** (e.g. tags every mode with the skill name to make it "feel complete"). Fix: explicit `defaultResourceSemantics: "disambiguation-card"`; forbid hub-identity vocabulary in any fallback-*scored* resource.
  - **A3 (drift becomes user-visible):** pre-null a stale `mode-registry.json` is an internal routing bug; post-null it is a *user-facing lie* (the menu shown on defer). Needs drift-validation as a gate / single-source derivation.
  - **A4:** the menu should be a compressed card, not the raw registry (ties to Thread B).

### H. Edge cases that break the archetype rule.
Lineage: glm-max (iter 4).

- **ADDED — the four sharpest edges, including the cli recovery.**
  - **F4.1 (load-bearing):** cli is **not** a pure-defer flip; it is **detection-defaulted** — a distinct shape run-1 collapsed into "flip to null." cli's `hub-router.json:4-14` holds a static `defaultMode:"cli-opencode"` with no runtime field, but the runtime you're inside is machine-detectable. Encode `defaultMode: null` **plus a runtime-detection block** (typed `defaultResolution: "runtime-detected"`) that auto-picks the in-runtime executor and excludes the current runtime's own CLI. "Flip to null" is the right first step (kill the static bias) but leaves cli's best behavior unencoded.
  - **F4.2 (single-mode):** with one mode, named-default and null are operationally identical; the archetype rule applies only at **≥2 modes**. A one-mode entity should **not** adopt hub-router machinery (system-skill-advisor is exactly this — `system-skill-advisor/SKILL.md:87`). Canon threshold correction.
  - **F4.3 (empty/drifting map):** the registry must be the single source; the menu must be **derived, not co-authored**; the bidirectional `hub-router ↔ mode-registry` alignment checker must run as a **gate, not a lint** (`parent_skill_hub_router_template.json:2`). Zero modes ⇒ "no modes configured; cannot route," not a silent empty menu.
  - **F4.4 (contextual default generalized):** detection can target the **default-resolution axis** (cli runtime), not just surface bundling — same environmental-vs-intentional discriminant, broader target. Only cli qualifies among the four flips ⇒ run-1's uniform "flip 4" sharpens into a **1+3 split** with distinct encodings.

### I. The contrarian steelman — *where is run-1's flip-4 actually wrong?* (sol-ultra AND glm-max both ran this — compared)
Lineages: sol-ultra (iter 1), glm-max (iter 5).

Both built a steelman for "auto-default is fine." They reach **different but compatible** conclusions:

- **sol-ultra iter 1 (methodological challenge, no per-hub reversal).** The strongest named-default case is a *declared prior / recommended action*, not deterministic selection — the implementation and gold **already permit "configured name + defer"** (CLI and MCP ambiguous scenarios require `defer` despite a configured default; `.../hub_routing/ambiguous_defer.md`). So run-1 "overreaches if it equates a configured name with an observed silent route." But sol-ultra does **not** overturn any per-hub verdict — it says keep-vs-null is *empirically undecided* and hands over the experiment (Thread A) to decide it. Challenge = **confidence/method**, not direction.
- **glm-max iter 5 (one per-hub reversal + a confidence downgrade).** Its honest steelman: a default is justified when it is **(a) self-correcting/environmentally determined OR (b) a genuine catch-all anchor.** Under that rule: sk-prompt keep (b) — unchanged; **cli satisfies (a)** ⇒ the steelman **overturns run-1's cli flip** in favor of detection-defaulted; the three others (deep-loop, mcp-tooling, sk-design) satisfy neither ⇒ **survive as null, but only "unfalsified-directional," not proven** — because run-1 routed around a corpus, they are unfalsifiable in the over-deferring direction. glm's constructive output is a **falsifiable four-shape decision rule**, each shape nominated by a testable condition (is there an environmental signal for this axis?):

  | Shape | Falsifiable condition | Example |
  |---|---|---|
  | keyword-with-default | one mode is the genuine catch-all anchor (b) | sk-prompt |
  | detection-defaulted | default resolvable from environment (a) | **cli-external-orchestration** |
  | detection-routed (surface) | axis signal is environmental | sk-code (surface axis) |
  | pure-defer (null + card) | no environmental signal AND no catch-all | system-deep-loop, mcp-tooling, sk-design |

- **How the two compare.** They **converge** that sk-prompt keep is right, that the three nulls are directionally right but empirically unproven, and that run-1's method skipped measurement. They **diverge on cli**: sol-ultra leaves cli inside the same undecided experiment; glm-max actively recovers cli as a distinct detection-defaulted shape. Note this is *less* a contradiction than it looks — Fable (run-1) already framed cli as "a detection problem, not a default problem"; glm formalizes that into an encoded shape, while sol keeps it experimental.

---

## Updated recommendation set

1. **sk-prompt — KEEP** (unchanged). Catch-all scoring anchor + defer-time suggestion; still the one default with fresh same-day route-gold receipts. Optionally close the SKILL.md pseudocode hole run-1 flagged.
2. **system-deep-loop, mcp-tooling, sk-design — FLIP → null** (direction unchanged; **confidence downgraded to "directional-pending-measurement"**). sk-design still additionally needs `hub-identity` moved off all six modes to discovery-only classes (the live over-emission bug). These are truth-reconciliation flips, safe but not corpus-proven.
3. **cli-external-orchestration — null as the first step, PLUS encode runtime detection.** Kill the static `cli-opencode` bias (null), but encode `detection-defaulted` (`defaultResolution: "runtime-detected"` / sol-ultra's `selectionPolicy: "detect"` + `selectionSource: "detector"`) so cli auto-picks the in-runtime executor and excludes the current runtime's own CLI. **Contingent** on a runtime-detection robustness test (glm's own confidence on this winning is only ~0.55).
4. **Null-hub fallback = a compressed disambiguation card, presented not scored** — not the full `mode-registry.json`. Keep `smart_routing.md` (safe, `DEFAULT_RESOURCE=[]`); add `defaultResourceSemantics: "disambiguation-card"`; forbid hub-identity vocabulary in any fallback-scored resource; derive the card from the registry (single source) and gate drift.
5. **Telemetry = dual-write, not a bare rename.** Emit `defaultConfigured` (a default/recommendation exists) **and** `defaultConsulted` (no mode scored AND configured) plus `recommendationMode`/`selectionPolicy`; keep `defaultApplied` as a deprecated alias of `defaultConsulted` until consumers migrate. A pure `defaultApplied → defaultConfigured` rename would hide the configuration-vs-consultation distinction.
6. **Canon = per-axis routing strategy, ≥2-mode hub threshold, drift-as-gate.** Describe strategy per axis (a hub may detect one axis and defer another, like sk-code); require ≥2 modes before scaffolding hub-router machinery; run the `hub-router ↔ mode-registry` alignment as a gate. Ship one zero-signal fixture per hub/archetype plus single-mode, empty-map, stale-registry, detector-miss fixtures.
7. **Migration = one hub at a time, single-field, gated, reversible.** Additive schema + legacy normalization → dual telemetry → fixtures → canon → annotate-without-routing-change → deterministic + bounded live gates → per-hub value flips → remove old field after a clean consumer scan. Per-hub annotation, never an auto-codemod. Rollback restores the one recorded value and reruns the frozen baseline.
8. **Optional but decisive: run sol-ultra's 2×4 factorial live benchmark** (policy × helper, blind-graded, ≥3 replays, preregistered margins) to actually measure keep-vs-null and the best helper shape before/after flips. It cannot prove prevalence, but it *can* falsify either policy.

---

## Convergences vs open tensions across the 3 models

**Convergences (2-3 lineages agree):**
- Replay semantics reconfirmed: `defaultApplied` = *configured*, not *selected*; keep vs null is replay-indistinguishable. (sol, terra; consistent with run-1.)
- sk-prompt keep is right. (sol implicitly via "declared prior"; glm explicitly condition-b.)
- The null-hub fallback should be a **compressed disambiguation card, presented not scored** — not the full registry. **(all three — the strongest cross-model convergence, and it revises a run-1 detail.)**
- The three nulls are **directional truth-reconciliation, not proven**. (sol "empirically undecided"; glm "directional-pending-measurement"; terra's "demonstrated vs proposed" framing throughout.)
- `defaultApplied` needs configured/consulted/selected separation, not a bare rename. (sol iter 3 dual-write; terra iter 5 Z/W/A assertions.)
- Detection is **axis-level, gated on an environmental signal**; among the flips only cli has one. (glm iter 2/4; sol iter 3 agrees the runtime preference belongs in *detector* evidence, not a static field.)
- Migration must be single-field, one-hub-at-a-time, gated, reversible. (terra iter 3; sol iter 3.)

**Open tensions (genuine disagreements to resolve at implementation time):**
- **cli encoding — the one real per-hub disagreement.** Pure-defer (null + card, run-1 / sol keeps it experimental) vs detection-defaulted (null + runtime-detection block, glm). Not mutually exclusive — glm's is a superset of "null" — but it commits to building and trusting runtime detection. Resolve via glm's own falsifier: a runtime-detection robustness test across supported runtimes; if detection is unreliable, cli falls back to pure-defer.
- **Archetype count/label — 3 vs 4, and where cli's runtime concept lives.** sol iter 3 uses a **3-value** `selectionPolicy {keyword-default | defer | detect}` + `recommendationMode`, folding cli's runtime resolution under `detect` + a `selectionSource` telemetry field. glm uses **4 shapes**, separating *detection-defaulted* (detect a **default** from env) from *detection-routed-surface* (detect a **mode** from env). They agree on the *concept* (detection resolves cli); they disagree on whether the taxonomy must distinguish detect-the-default from detect-the-mode. (terra took no position — it worked only on sk-doc null-hub mechanics.)
- **Measure first, or flip first and measure later?** run-1 (Fable) routed around a corpus; sol-ultra says build the falsifiable experiment; glm calls the three nulls "directional-pending-measurement" (worth measuring, not blocking); terra's gated one-at-a-time migration is the middle path (each flip gated on deterministic route-gold + a bounded live trace). No lineage claims measurement is a hard blocker to the truth-reconciliation flips; the disagreement is how much live evidence to demand before each.

---

## Honest scope note

- **Coverage: 13 of 20 planned iterations.** luna-max (7 iterations) **failed entirely** on a workflow Gate-3 loop and produced nothing usable. Run-2 = sol-ultra (3) + terra-max (5) + glm-max (5) = 13. sol-ultra was itself truncated to 3 (its own strategy shows more planned); this is not a defect in the 3 it produced.
- **Provenance is uneven, and the most consequential lineage is the least provenanced.** terra-max ran **real** `router-replay` commands (only executed evidence in either run). sol-ultra emitted **route-proof** blocks (strong harness provenance) but ran no live model — its benchmark is a *design*, not a result. **glm-max carries neither a route-proof block nor command output** — it is source-reading + inference, yet it owns the highest-value divergences (cli detection-defaulted, the four-shape rule, the second-order anti-patterns). Its line-citations are internally consistent and check out against the cited files, but its harness provenance is unconfirmed; weight its *source citations*, not its self-asserted thread/timestamp headers.
- **terra-max's null-hub findings derive from one already-null specimen (`sk-doc`).** Its mechanics (compressed card, Z/W/A fixtures, migration discipline) are sound and generalizable but were exercised against a hub that is already flipped, not against the four flip candidates.
- **Nothing is live-model measured.** Every verdict — run-1's and run-2's — is a proposal over a live-routing behavior change. The keep/flip *direction* is well-supported by static evidence and reconfirmed replay semantics; the *magnitude* of the over-deferring cost, the cli runtime-detection robustness, and the compressed-card lift all require the sol-ultra benchmark (or terra's gated per-hub live trace) to settle. Treat the three nulls as directional-pending-measurement and cli's detection-defaulted encoding as contingent on a runtime-detection test.
