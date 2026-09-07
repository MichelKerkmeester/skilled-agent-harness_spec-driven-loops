---
title: "Implementation Plan: Perfect skill routing across the fleet: why an advertised phrase fails to arrive"
description: "Prove membership causal, repair the gate that could not see the failure, close the one hub whose reachability was unverified, then carry each router's declared vocabulary into the stage the advisor scores."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Perfect skill routing across the fleet: why an advertised phrase fails to arrive

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Routing is two stages. The advisor scores a hub's `graph-metadata.json` `intent_signals` to choose a hub; that hub's `ROUTER.md` and `hub-router.json` then choose a mode. The scorer never reads stage two: a grep for `hub-router` or `ROUTER.md` across the scorer returns nothing, and the projection is built from a SQLite `skill_nodes` row whose `intent_signals` column becomes `projection.intentSignals`.

Exact membership in that column is what fires the `explicit_author` lane, and that lane both raises the score and emits the evidence entries that pull uncertainty below the 0.35 surfacing gate. Absence is therefore not a smaller score, it is deletion: a non-member can reach confidence 0.82 carrying zero evidence, take the 0.42 no-evidence default, and never be offered.

### Overview

Four steps in a forced order. Prove the mechanism before writing anything. Repair the measurement before repairing the defect, because the old measurement would have certified a fix that did not work. Close the one hub whose mode resolution was unverified before generating into it. Then generate, and measure the whole inventory twice.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The mechanism is proven causal with a control, not inferred from correlation.
- The gate can be watched failing.
- Every hub receiving generated vocabulary passes its own structural check.

### Definition of Done

- `wrong-hub` and `no-reach` fall to near zero across all 439 declared phrases.
- A run against an absent advisor fails; a sampled run is refused under CI.
- Every fleet checker stays green and no peer hub regresses.
- The residue is classified and attributed rather than left unexplained.

---

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A generator that derives one artifact from another, plus a check mode that fails when they diverge. The invariant holds by construction rather than by audit.

### Key Components

| Component | Role |
|-----------|------|
| `declaredPhrases()` | Extracts multi-word phrases from a router's `INTENT_SIGNALS` block. Shared by the gate and the generator so they cannot disagree |
| `generate-router-intent-signals.cjs` | Merges those phrases into the hub's stage-one list. `--check` gates, `--write` repairs |
| `ci-router-vocabulary-reach.cjs` | Probes every declared phrase against the live advisor and classifies the outcome |

### Data Flow

`ROUTER.md` `INTENT_SIGNALS` → extractor → merge into `graph-metadata.json` `intent_signals` → advisor rebuild → SQLite projection → `explicit_author` lane fires on exact match → evidence emitted → uncertainty drops below the gate → candidate surfaces.

---

## FIX ADDENDUM: AFFECTED SURFACES

Six hubs receive vocabulary: `sk-design`, `sk-doc`, `sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`. The advisor daemon must be rebuilt for any change to take effect, and `--trusted` is a flag rather than a JSON parameter. Nothing outside `.opencode/skills/*/graph-metadata.json` and the two scripts is touched.

---

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work | Gate |
|-------|------|------|
| 0 | Causality experiment on a scratch projection | The phrase routes as a member and stops on revert, while a control never moves |
| A | Gate fails closed; rank replaces presence | Watched failing against an absent advisor; count moves 19 → 37 |
| B | Close `sk-design`'s six invariants | `parent-skill-check` OK, and the three skipped checks execute |
| C | Generate, rebuild, measure | Whole-inventory before and after at named generations |

Phase C depends on both A and B. A must precede C or the measurement lies; B must precede C or vocabulary is written to a hub whose mode resolution is unverified.

---

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Negative controls, not assertions about intent. The gate is pointed at an advisor that does not exist and must fail. The generator is run twice and the second run must add nothing. The causality experiment carries an untouched control phrase on the same router line, so a fleet-wide rebuild effect cannot be mistaken for the injected one. Every count is taken over the complete inventory at a recorded daemon generation, because a sampled baseline proves only what it sampled.

---

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The advisor daemon and its rebuild path. No network, no credentials, no database migration, no external package.

---

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is a tracked file in a small, explicit commit set. `git revert` on the three commits restores the prior state, and a single advisor rebuild makes the revert live. The generator only ever appended, so reverting cannot orphan an authored entry. No data migration and no deployed consumer speaks the old contract, because the contract is read fresh from disk on each rebuild.

---

<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 ──> Phase A ──┐
                      ├──> Phase C
Phase 0 ──> Phase B ──┘
```

Phase 0 gates everything: a failure there voids the approach rather than delaying it.

---

<!-- /ANCHOR:l2-phase-deps -->

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

The measurement dominates. A full 439-phrase scan takes roughly 37 minutes because each probe spawns a fresh node process, so a before-and-after pair is a 75-minute commitment. The code changes themselves are small.

---

<!-- /ANCHOR:l2-effort -->

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- The working tree holds no other session's files in the staged set.
- Every fleet checker is green before the change, so a regression is attributable.

### Rollback Procedure

Revert the commits in reverse order, rebuild the advisor, re-run the reach check and confirm the counts return to the recorded baseline at generation 698.

### Data Reversal

None required. The only persistent state is the advisor's SQLite projection, which is rebuilt from the JSON files rather than migrated.


<!-- /ANCHOR:l2-rollback -->