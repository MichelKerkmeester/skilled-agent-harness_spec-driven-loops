---
title: "Feature Specification: Perfect skill routing across the fleet: why an advertised phrase fails to arrive"
description: "A phrase a hub's router advertises could fail to reach that hub, because the advisor never read the router's vocabulary. 173 of 439 declared phrases failed, and 155 of them were invisible to the gate that was supposed to catch it."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Perfect skill routing across the fleet: why an advertised phrase fails to arrive

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Routing decides which skill answers a request, and it runs in two stages that were never connected. The advisor scored stage one from a hub's `graph-metadata.json`; each hub's `ROUTER.md` declared a separate stage-two vocabulary that nothing carried upward. 259 of the 439 phrases the six hubs advertise were therefore words the advisor had never heard, and a phrase that reaches nobody is a capability the fleet has and cannot be asked for.

**Key Decisions**: carry the declared vocabulary up by merging rather than replacing, since the stage-one list is authored and curated; fix the gate before the defect, because the old gate scored presence rather than rank and would have certified the fix while routing stayed wrong.

**Critical Dependencies**: none external. Every change is metadata or a checker, and the residue that remains needs a scorer change that is deliberately out of scope.

---

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A hub's `ROUTER.md` advertises the phrases that reach it, and for 173 of 439 such phrases across six hubs that claim was false. Worse, the check that measured this could not see most of the failure: it asked whether the declaring hub appeared above the confidence bar rather than whether it ranked first, so 18 phrases losing to another hub counted as passes, and every probe failure collapsed into a result that never failed the run.

### Purpose

A phrase a hub advertises reaches that hub, and the gate that asserts it fails when it does not.

---

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Carry every multi-word phrase a router declares into that hub's stage-one `intent_signals`.
- Make the reach gate fail closed, and judge by rank rather than presence.
- Close the six `parent-skill-check` invariants on `sk-design`, the only hub of six that failed.

### Out of Scope

- The scorer itself. Both the lexical lane's score-versus-evidence mismatch and cross-hub arbitration are scorer changes with fleet-wide blast radius, deliberately left for a separate decision.
- Lowering the 0.8 confidence bar, which trades one failure mode for a worse one.
- Compiled routing for `sk-design`, which runs after hub selection and cannot affect reach.

### Files to Change

| File | Change |
|------|--------|
| `sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Fail closed; rank instead of presence; record generation |
| `sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | New: merge declared phrases into stage one |
| `<hub>/graph-metadata.json` × 6 | Receive the merged phrases |
| `sk-design/{mode-registry,hub-router,leaf-manifest}.json`, `SKILL.md`, `sk-design-fundamentals/SKILL.md` | Close the six invariants |
| `sk-design/{changelog,benchmark}/` | The two trees the hub lacked |

---

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Rationale |
|----|-------------|-----------|
| REQ-001 | Membership must be shown causal before any hub metadata is written | The whole approach rests on it, and correlation would not distinguish cause from a selection artifact |
| REQ-002 | The reach gate must fail when a probe cannot run | It printed a clean pass over an advisor that never answered |
| REQ-003 | The gate must require the declaring hub to rank first | Presence above the bar is not routing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Rationale |
|----|-------------|-----------|
| REQ-004 | The generator must merge, never replace | The stage-one list is authored; `sk-design` alone carries 159 curated entries |
| REQ-005 | `sk-design` must pass `parent-skill-check` before receiving generated phrases | Three reachability checks were skipped, so its mode resolution was unverified |
| REQ-006 | Before and after must be measured over the whole inventory at a named generation | A baseline proves only what it samples |

---

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| Criterion | Measure |
|-----------|---------|
| Reach restored | wrong-hub and no-reach fall to near zero across all 439 declared phrases |
| Gate honest | A run against an absent advisor fails; a sampled run is refused under CI |
| No collateral | Every fleet checker stays green and no peer hub regresses |

---

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Generated phrases flood stage one and cause cross-hub collisions | Routing gets worse fleet-wide | Measured first: exactly one phrase of 439 is declared by two hubs. Multi-word-only filter retained |
| A regeneration destroys curated vocabulary | Silent loss of hand-tuned routing | Generator appends and never rewrites; verified idempotent |
| The fix improves the metric without improving routing | False confidence | Rank-based checking landed before the generator, not with it |

**Dependencies**: the advisor daemon must be rebuildable, and `--trusted` is a flag rather than a JSON parameter.

---

<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

The full 439-phrase scan takes roughly 37 minutes because each probe spawns a fresh node process. Acceptable for a gate, and the reason `--limit` exists for by-hand use.

### Security

None. No credential, network or user-data surface is touched.

### Reliability

The gate must fail closed on every probe failure path: a missing binary, a non-zero exit, the timeout, and a cold daemon.

---

<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- A router that parses to zero multi-word phrases is a broken extractor reading as a clean hub, and now fails rather than reporting a quiet zero.
- Single words are excluded deliberately; they are the ones that would over-trigger in stage one.

### Error Scenarios

- Probe failure becomes a `probe-error` record rather than a silent no-reach.
- A sampled inventory is refused under CI, since a truncated run cannot gate a build.


<!-- /ANCHOR:edge-cases -->