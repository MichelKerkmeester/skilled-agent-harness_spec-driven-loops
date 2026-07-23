---
title: "Verification Report: REQ-006 Fleet Route-Gold Teeth + Live-Mode Reality Check"
description: "Non-destructive verification that the fleet's deterministic route-gold green is NOT hollow/circular. Deterministic mutation across 6 hubs shows 91/91 gold-corruption teeth and 6/6 router-corruption drops; adversarial audit confirms real teeth with one disclosed sk-code subset caveat; live-mode SOL routing on 4/6 hubs shows 12/12 mode-precision with leaf-recall gaps. Records honest coverage holes: blind holdout, full-corpus live, Layer-0 advisor, and machine confusion matrices remain uncovered."
trigger_phrases:
  - "REQ-006 fleet routing verification"
  - "route-gold teeth proof"
  - "fleet mutation live-mode reality check"
  - "is the route-gold green hollow"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "REQ-006 verification: deterministic teeth-proof (91/91 gold, 6/6 router) + adversarial audit + live-mode reality check (4/6 hubs) synthesized into this report"
    next_safe_action: "Close remaining REQ-006 gaps: blind holdout gold, full-corpus live-mode, Layer-0 advisor pass, machine confusion matrices"
    blockers: []
    key_files:
      - "verification-report.md"
      - "spec.md"
---

# REQ-006 Verification Report: Fleet Route-Gold Teeth + Live-Mode Reality Check

## 1. Verdict

**The fleet route-gold green has REAL TEETH. It is NOT hollow and NOT circular — with one disclosed, residual caveat on sk-code.**

The deterministic route-gold gate responds to corruption in **both** directions, independently reproduced and non-destructively verified:

- **Gold corruption (the anti-circularity proof):** flipping an authored gold leaf to a wrong-but-valid sibling leaf turns `PASS -> BLOCKED-BY-ROUTE-GOLD`, while the **live router output stays correct**. The mutated scenario's own `routeGold.pass` goes `false`. This is the decisive result — a green that survived a wrong gold would be circular; this one does not. **91/91 route-gold-carrying scenarios across all 6 hubs showed teeth** (`fleetGoldTeethRate = 1.0`).
- **Router corruption (the live-router proof):** deleting a **single** `RESOURCE_MAP` leaf line from a copied `smart_routing.md` collapses the router's real assembled output (e.g. sk-prompt `observedResources -> []`) and drops the verdict below PASS on **6/6 hubs** (`fleetRouterTeethRate = 1.0`). The score is driven by live routing, not a constant.

Both guards are honest: the gold-mutation teeth verdict is **double-guarded** (the run verdict must flip AND the mutated row's own `routeGold.pass` must fail), so teeth are never credited to collateral; wrong answers are genuine (`wrongResourceFor` picks a leaf that is `!observed && !expected`), not no-ops.

**Honoring the audit's skepticism:** the adversarial audit found **zero hollow scenarios and zero unmutable scenarios** after a harness file-mapping bug was corrected (see §2 note). It did NOT rubber-stamp the green — it confirmed teeth by independent reproduction and surfaced **one genuine residual weakness**: sk-code's gate is a subset (must-include + forbidden-prefix) gate, not an exact-set gate, so it structurally **cannot detect a router that over-loads a wrong-but-non-forbidden extra resource**. sk-code's teeth are real but **narrower** than the five exact-set hubs. This is a gate-design limitation, honestly disclosed — not a harness cheat.

Two further audit caveats worth stating plainly, both legitimate:
- **Teeth live in the verdict, not the score.** The gate blocks via the hard `BLOCKED-BY-ROUTE-GOLD` verdict; `aggregateScore` itself is largely insensitive to route-gold violations (sk-prompt gold-mutation kept agg=100; router mutations moved deep-loop 99->98, mcp 98->94, sk-code 93->92). A hard gate is the correct teeth mechanism — but "`routerMutDroppedScore`" is a slight misnomer for 5/6 hubs; the real signal is the verdict flip.
- **Coverage is gate-scoped.** The 100% teeth rate is over the **route-gold-applicable subset**, not all scenarios (see sk-code: 15 of 30). Scenarios without resource/intent gold sit outside the gate; the proof says nothing about their routing.

---

## 2. Per-Hub Mutation Table (deterministic teeth-proof)

| Hub | Baseline | Scenarios (total) | Route-gold applicable | Gold-mut teeth | Router-mut dropped verdict | Hollow scenarios |
|-----|----------|-------------------|-----------------------|----------------|----------------------------|------------------|
| sk-prompt | PASS (agg 100) | 4 | 4 | 4/4 | yes (agg 100 -> 58) | none |
| mcp-tooling | PASS (agg 98) | 13 | 13 | 13/13 | yes (agg -> 94) | none |
| cli-external-orchestration | PASS | 7 | 7 | 7/7 | yes | none |
| system-deep-loop | PASS (agg 99) | 20 | 20 | 20/20 | yes (agg 99 -> 98) | none |
| sk-code | PASS (agg 93) | 30 | 15 | 15/15 | yes (agg 93 -> 92) | none |
| sk-doc | PASS | 32 | 32 | 32/32 | yes | none |
| **Fleet** | **6/6 PASS** | **106** | **91** | **91/91 (100%)** | **6/6** | **0** |

- Router perturbation kind: `resource-map-leaf-delete` on all 6 hubs (a leaf a passing scenario expects). Each dropped to `BLOCKED-BY-ROUTE-GOLD`.
- **sk-code subset shape:** its gate uses `resourceOk = expected.every(present)` + forbidden-prefix, not exact-set. The gold mutations swap to a leaf **not** in the observed set, which the subset gate DOES catch (SD-001/SD-002/SD-003 independently reproduced flipping with `resourceOk=false`). By construction these swaps cannot exercise the **over-loading** failure mode, so sk-code teeth are genuine-but-narrower (see §1 verdict + §4 gaps).

**Harness-bug honesty note (why hollow/unmutable started nonzero, then went to zero):** the first run reported sk-code SD-001..003 as hollow and several deep-loop (SC/RB/MO) + sk-doc (SD-004..015) rows as unmutable. This was **not accepted at face value.** Isolated reproduction (mutate ONLY SD-001, dump its `routeGold` row) flipped it to `BLOCKED-BY-ROUTE-GOLD` with `resourceOk=false`, proving teeth were present all along. Root cause was a **file-mapping bug** in the mutation harness (not the frozen scorer): `fileForScenario` matched the first file containing the scenario-id token, which was often the playbook **index** (`manual_testing_playbook.md`), so the string-swap landed on the unscored index and left the real gold untouched. Fix: resolve the authoring file by frontmatter `id:` == scenarioId, else `title:`/H1 leading with `<scenarioId>:` (the sk-code convention, which carries no `id` field), always excluding the index. After the fix, all previously hollow/unmutable rows show teeth and the result is deterministic (two reruns byte-identical: `mutation-results.json` == `mutation-results-run2.json`).

**Non-destructiveness (confirmed):** committed tree byte-identical before/after (shasum-of-shasums unchanged across all 6 hubs' playbooks + `smart_routing.md` + `hub-router.json`); all mutation on scratch copies; frozen scorer invoked, never edited; no git; no `Math.random` (deterministic across reruns). Full per-scenario detail: `scratchpad/req006/mutation-results.json`; harness: `scratchpad/req006/mutate.cjs`.

---

## 3. Live-Mode Reality Check (real SOL routing)

**Subject model:** `openai/gpt-5.6-sol-fast` (variant high). **Coverage: 4 of 6 hubs ran**; 3 sampled route-gold scenarios per running hub; `--route-gold off` (behavior scoring), frozen scorer untouched, no source mutated.

### 3a. Per-hub mode-precision + leaf-recall (confirmed, from sampled scenarios)

| Hub | Ran | Sampled | Mode-precision | Leaf-recall | Confusion note |
|-----|-----|---------|----------------|-------------|----------------|
| sk-prompt | yes | 3 (SP-001/002/004) | **3/3 (100%)** | 3/3 | none — every sample hit the exact expected mode AND expected leaf |
| mcp-tooling | yes | 3 (MT-001/002/003) | **3/3 (100%)** | 1/3 | MT-002 missing `mcp_tools.md`; MT-003 missing `mcp_wiring.md` (surfaced `tool_surface.md` instead). No **mode** confusion |
| cli-external-orchestration | yes | 3 (CE-001/002/003) | **3/3 (100%)** | 3/3 | none — CE-003 correctly `defer`/disambiguation; CE-002 leaf superset (2 gold + 2 extras) |
| system-deep-loop | yes | 3 (MO-001/002/003) | **3/3 (100%)** | 2/3 | MO-003 `ai-council` missing `scoring_rubric.md` + 3 non-gold extras. No **mode** confusion |
| sk-code | **no** | — | — (infra gap) | — | agent errored/timed out — no data |
| sk-doc | **no** | — (infra gap) | — | — | dispatched but did not finish within turn budget; outputs-dir empty, no report JSON — not fabricated |
| **Ran-hub total** | **4/6** | **12** | **12/12 (100%)** | **9/12 (75%)** | **zero mode confusions; all misses are leaf-recall** |

**Plain confusion summary (confirmed):** across all 12 sampled scenarios on the 4 hubs that ran, the real model routed to the **exact expected workflow mode every time** — no mode was ever confused for another. All failures were **leaf-level under-recall** (a gold leaf omitted, sometimes with a non-gold extra surfaced): mcp-tooling on click-up/figma leaves, system-deep-loop on the ai-council scoring rubric.

**Critical caveat on the live reports' own verdicts (do not misread):** every live report shows `verdict = BLOCKED-BY-TOOL-SURFACE` (e.g. aggregate 30/67). This is a **scorer-gate artifact, NOT a routing miss** — the harness flags the `Skill` activation tool (and `mk-spec-memory_memory_match_triggers`) as "tool outside allowed surface" (backend-tool-policy). On the running hubs `gate.hubRoute.failed = false` and `gate.d5Score = 100` — the routing/hub-route gate itself passed. The mode/leaf numbers above are read from `routeTelemetry.workflowMode` / `liveEvidence.responseHead` (source `live-declaration`), independent of the tool-surface block.

### 3b. Live-mode infra gap (honest)

**2 of 6 hubs produced no live data.** sk-code errored/timed out; sk-doc was dispatched correctly (SD-002/SD-017/SD-001, single-expected-mode intent_detection scenarios) but did not complete within the turn budget — at forced-output time the process was still alive, no exit code, outputs-dir empty. Per resilience discipline **no observations were fabricated**. These hubs need a re-run with a longer wait budget. The live-mode reality check is therefore **partial**: strong (12/12 mode-correct) on the 4 hubs that ran, silent on sk-code/sk-doc.

---

## 4. Honest Gaps — what REQ-006 still does NOT cover

| Gap | Status | Why it remains |
|-----|--------|----------------|
| **Blind independently-authored holdout** | NOT done | The mutation teeth-proof corrupts the **authored** gold and checks the gate reacts. It proves the green is non-circular against *its own* gold, but does not test the gold against a fresh, blindly-authored expectation set. A holdout would catch gold that is self-consistent yet wrong. |
| **Full-corpus live-mode** | NOT done | Live ran only **3 sampled scenarios/hub on 4/6 hubs** (12 of 106 scenarios). sk-code + sk-doc did not run at all. The 100% live mode-precision is over a small sample, not the corpus. |
| **Layer-0 right-skill advisor pass** | NOT covered | The harness tests **within-hub** routing (given the hub, does it reach the right mode/leaf). It does not test whether the skill-advisor picks the **correct hub** for a request in the first place. A perfect in-hub route on the wrong hub still misroutes. |
| **Machine-computed confusion matrices** | NOT produced | The confusion notes in §3 are **manual, from small samples**. No automated per-mode confusion matrix exists over the full corpus, so systematic mode-adjacency errors (if any) would not surface. |
| **sk-code over-loading detection** | Structural limitation | sk-code's subset gate (must-include + forbidden-prefix) has teeth against not-observed swaps (confirmed) but **cannot detect a router that loads a wrong-but-non-forbidden extra resource** — narrower than the 5 exact-set hubs. |
| **Router-fidelity sweep** | NOT done | Router mutation deletes exactly **one** leaf/hub (existence proof that the score is live-driven), not a systematic per-leaf sweep. |
| **Vocab-keyword-delete router fallback branch** | Untested | All 6 router mutations used resource-map-leaf-delete; the harness's keyword-delete fallback path was never exercised. Irrelevant to the teeth claim, but it is untested code. |

---

## 5. Confirmed vs Inferred

**Confirmed (with numbers / artifacts):**
- 91/91 gold-mutation teeth; 6/6 router-mutation verdict drops; 0 hollow, 0 unmutable (post-fix). Deterministic across two byte-identical reruns. Source: `mutation-results.json`, `mutation-results-run2.json`.
- Non-destructive: committed tree shasum-of-shasums unchanged; frozen scorer never edited; no git.
- Live 12/12 mode-precision, 9/12 leaf-recall on the 4 hubs that ran; zero mode confusions. Source: `live-*/skill-benchmark-report.json`.
- Live verdicts are `BLOCKED-BY-TOOL-SURFACE` gate artifacts, orthogonal to routing (`hubRoute.failed=false`, `d5Score=100`).
- sk-code subset gate catches not-observed swaps (SD-001/002/003 reproduced flipping) but structurally cannot catch over-loading.

**Inferred / not established:**
- That the authored gold itself is *correct* (would require a blind holdout — not done).
- That full-corpus live routing matches the 100% sampled mode-precision (only 12/106 scenarios probed; 2 hubs silent).
- That sk-code / sk-doc live routing is healthy (no live data — inferred healthy only from their deterministic PASS baselines and mutation teeth).
