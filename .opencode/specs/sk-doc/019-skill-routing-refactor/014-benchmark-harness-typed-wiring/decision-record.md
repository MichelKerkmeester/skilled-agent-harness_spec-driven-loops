---
title: "Decision Record: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix"
description: "Five decisions. ADR-001's staged couple-leaf-to-hub mechanism is superseded by ADR-005 after an empirical 19-fixture probe and three independent model reviews (SOL, GLM, Fable) refuted it as the zero-emission bug; ADR-005 collapses hub and surface into one authoritative intent->leaf taxonomy (Option 3, operator-ratified 2026-07-16). Plus SD-015 option C with two gold surfaces, contract-library relocation out of the sk-doc packet, and a sealed independently-authored holdout protocol with pre-registered metrics that lands in the same change as the collapse."
trigger_phrases:
  - "benchmark harness typed wiring decision record"
  - "staged selection fix adr"
  - "sd-015 option c adr"
  - "sealed independent holdout adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/014-benchmark-harness-typed-wiring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Amended ADR-001 as superseded; ratified Option 3 collapse as ADR-005"
    next_safe_action: "Start Phase 1: design-lock the taxonomy, freeze fixtures and router"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-benchmark-harness-typed-wiring-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "ADR-002 operator-ratified; ADR-001 superseded by ADR-005 (mechanism refuted 2026-07-16); ADR-003/004/005 Accepted under the ratified Option 3 collapse"
---
# Decision Record: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Stage the selection fix — couple leaf selection to hub modes now, unify to one contract later

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded by ADR-005 (mechanism refuted 2026-07-16) |
| **Date** | 2026-07-16 |
| **Deciders** | Operator (ratified this session); verified SOL-redirect ledger |

---

<!-- ANCHOR:adr-001-context -->
### Context

The verified root cause of the dispatcher emitting zero leaves (findings F4→F1, both CONFIRMED) is that router-replay runs two independent keyword classifiers: the hub-mode classifier over `hub-router.json`, and the surface leaf classifier over `smart_routing.md`. The surface leaf classifier is not constrained by the hub-selected modes. The hub over-selects generic authoring modes, the `MAX_WORKFLOW_MODES=2` cap keeps those, and `buildTypedResourceContract` filters the correct leaf pairs out, reaching zero on SD-003/015/016 and on core out-of-fixture prompts.

### Constraints

- The immediate need is to stop the zero-emission so the benchmark can measure anything at all.
- The durable need is to remove the class of defect where two classifiers disagree.
- Betting the fix on hand-tuning the hub keyword scorer would deepen the exact overfitting the whole program exists to escape.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: stage the fix. Now, intersect the surface leaf classifier's output with the hub-selected capped modes so the 2-mode cap keeps the correct leaves instead of filtering them to zero. Design that coupling explicitly as step one toward a single unified routing contract consumed by both hub-mode and leaf selection (Option 3), which is a scoped follow-up after the holdout corpus can prove it.

**How it works**: after the hub selects up to two `workflowMode`s, the leaf pair set is restricted to leaves whose `workflowMode` is in that capped set, at the emission boundary in `router-replay.cjs` / `executor-dispatch.cjs`. The invariant is: no typed pair may carry a `workflowMode` outside the hub selection.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stage: couple now, unify later** | Stops zero-emission immediately, unlocks measurement, commits to the durable architecture without blocking on it | The interim coupling still has two classifiers; a wrong hub pick propagates to leaves | 9/10 |
| Couple leaf→hub only (no successor) | Smallest change | Leaves the two-classifier disagreement class permanently; single point of failure with no exit | 5/10 |
| Fix hub over-selection by tuning keywords | Keeps classifiers independent | Hub-scorer tuning is the overfitting-prone surface the program exists to escape; two classifiers can still disagree | 3/10 |
| Unify into one contract now | Eliminates the disagreement class entirely | Largest blast radius, slowest to a measurable number, unproven before the holdout exists | 6/10 |

**Why this one**: it stops the dispatcher emitting zero on the shortest path (so the benchmark becomes able to falsify), while committing to the unified contract as the terminal design rather than settling for a permanent two-classifier patch.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The previously-zero fixtures (SD-003/015/016) and core out-of-fixture prompts emit non-empty, mode-consistent typed pairs.
- Every downstream measurement becomes meaningful for the first time.

**What to watch**:
- A wrong hub-mode pick now propagates to the leaves. The holdout corpus is the instrument that surfaces this, and the unified-contract follow-up removes the disagreement class.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The dispatcher emits zero on core scenarios today (findings F1/F4, CONFIRMED); nothing downstream can be measured without this |
| 2 | **Beyond Local Maxima?** | PASS | Hub-scorer tuning and immediate unification were both considered and rejected as the interim step |
| 3 | **Sufficient?** | PASS | Constraining leaves to the capped hub modes is enough to stop the zero-emission on the previously-zero cases |
| 4 | **Fits Goal?** | PASS | Directly unblocks measurement, which the North Star's falsifiability depends on |
| 5 | **Open Horizons?** | PASS | Explicitly designed as step one toward the unified single-contract successor |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `router-replay.cjs`, `executor-dispatch.cjs` (modified): intersect the leaf pair set with the hub-selected capped modes at the emission boundary.
- A regression test pins SD-003/015/016 and a core out-of-fixture sample from zero to non-zero, mode-consistent pairs.

**How to roll back**: revert the two emitter commits together; the coupling is gated behind the regression test, so reverting restores the prior behaviour without touching fixtures or the corpus.
<!-- /ANCHOR:adr-001-impl -->

---

### Amendment — 2026-07-16: mechanism refuted; superseded by ADR-005

An empirical probe over all 19 fixtures through the real dispatcher, plus three independent senior-model reviews (GPT-5.6-SOL ultra, GLM-5.2 max, Fable-5 xhigh), refuted this ADR's core invariant. "No typed pair may carry a `workflowMode` outside the hub selection" is exactly what `buildTypedResourceContract` already does, and it **is** the zero-emission bug: the hub over-selects generic `create-*` modes (every mode shares the `authoring-actions` keyword class → parity tie → the declared `routerPolicy.tieBreak` is dead code the replay never reads → insertion order wins), so the surface classifier's correct leaves are filtered to zero on SD-003/015/016/018/020 and on core out-of-fixture prompts. The typed `resourceContract.pairs` drop to zero; the raw flat `resources` stay non-empty, which is why the legacy scorer never surfaced it.

The three reviews converged: the surface classifier must be authoritative for leaves, and the two-classifier design is the root defect (Fable: scoring the hub as an independent decision is a category error — the mode is a *projection* of the selected leaves, resolvable via the manifest and registry). The operator ratified **Option 3** (collapse to one authoritative intent→leaf taxonomy now, holdout in the same change) on 2026-07-16.

This ADR is therefore **superseded by ADR-005**. The staged "couple leaf→hub now" mechanism is abandoned; its "unify later" successor is promoted to the active decision. Full reviews: `reviews/sol-5.6-ultra-amendment-verdict.md`, `reviews/glm-5.2-max-amendment-review.md`, `reviews/fable-5-xhigh-parent-skill-opinion.md`.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: SD-015 adopts option C with two gold surfaces

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | Operator (ratified this session); SOL SD-015 recommendation |

---

<!-- ANCHOR:adr-002-context -->
### Context

The create-skill and create-skill-parent modes share one packet directory (ADR-003 in packet 012's N-to-1 fan-out). A packet-qualified raw path resolves to the first-bound mode, so the fan-out twin dedups away. The SD-015 fixture conflated logical identity (which public pairs exist) with physical load (which files are read), so "100% unique-leaf coverage" was not true against the manifest, and the loader dropping `full_inventory_intent` produced zero typed pairs. The refuted finding corrected the arithmetic (22 fan-out gap, not 28), but the conflation is real.

### Constraints

- Logical identity recall and physical load efficiency are different metrics and must not be collapsed.
- Full inventory must not be reverse-mapped from raw paths (that is where a canonical dimension is destroyed).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: option C. Normal routing carries the selected `workflowMode` into conversion (never inferred from the packet path); full inventory enumerates typed pairs directly from the manifest; runtime loading deduplicates separately by resolved physical `diskPath`. SD-015 carries two gold surfaces: `expected_public_pairs` (both fan-out modes, for logical identity) and `expected_disk_targets` (deduplicated, for load cost).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **C: mode-aware resolver + manifest enumeration + two surfaces** | Preserves canonical identity, separates the two metrics honestly | More fixture and resolver work | 9/10 |
| A: accept on unique-leaf coverage, document the exception | Least work | Silently violates the fan-out canon by destroying a canonical dimension at first-bound conversion | 2/10 |
| B: rewrite gold to not double-count twins | Simple denominators | Hides the public-identity defect; only valid for a separate load-cost oracle | 3/10 |

**Why this one**: identity and load are genuinely different questions, and only two surfaces let the benchmark answer each without the other masking it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Full-inventory recall is measured against the true manifest, and load cost is measured against deduplicated disk targets.

**What to watch**:
- Two surfaces mean two numbers to report; the report must not average them into one misleading figure.
<!-- /ANCHOR:adr-002-consequences -->

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The fan-out twin dedups away and full-inventory dropped to zero pairs (finding F1); the conflation is real |
| 2 | **Beyond Local Maxima?** | PASS | Options A and B were tested and rejected as identity-destroying or defect-hiding |
| 3 | **Sufficient?** | PASS | Two surfaces answer identity and load without either masking the other |
| 4 | **Fits Goal?** | PASS | Makes full-inventory recall measurable against the true manifest |
| 5 | **Open Horizons?** | PASS | The two-surface pattern generalizes to any future N-to-1 fan-out |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- SD-015 fixture gains `expected_public_pairs` and `expected_disk_targets`; full-inventory resolves by manifest enumeration in the resolver.

**How to roll back**: the SD-015 change is additive (new fields alongside the existing gold), so reverting the fixture commit restores the prior shape directly.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Relocate the leaf-resource contract library out of the sk-doc packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (under the ratified Option 3 collapse) |
| **Date** | 2026-07-16 |
| **Deciders** | Operator (ratified Option 3 this session); verified SOL-redirect ledger (finding F8, CONFIRMED) |

---

<!-- ANCHOR:adr-003-context -->
### Context

The shared cross-skill benchmark hard-imports the contract library from `sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`, and `parent-skill-check.cjs` assumes every adopting hub contains `create-skill/scripts/...`. This is the wrong dependency direction for a framework-wide program meant to cover sk-code, sk-design, system-code-graph and others. It is currently masked only because sk-doc is the sole hub with a manifest.

### Constraints

- The move must not change the contract library's behavior, only its location and its consumers' import paths.
- Every consumer must be found before the move; a missed import is a silent runtime break.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: move the contract library to a shared, non-sk-doc location (a system-level library path co-located with the benchmark harness or a shared skill-support tree) and repoint `router-replay.cjs`, `parent-skill-check.cjs` and any other consumer. sk-doc becomes one consumer among many. The exact target path is an implementation choice made in Phase 4 after the consumer inventory.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Relocate to a shared location** | Correct dependency direction for a framework-wide program | One-time move + repoint + test run | 9/10 |
| Leave it in sk-doc, symlink from other hubs | No move | Symlink sprawl; the wrong direction is still encoded | 2/10 |
| Duplicate the library per hub | No shared coupling | Re-creates the unowned-duplication defect the whole program fights | 1/10 |

**Why this one**: a framework-wide contract cannot be owned by one of the skills it governs.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Other hubs can adopt the contract without importing from sk-doc.

**What to watch**:
- The move touches guard code; the full unit + guard + vitest gate must run after repointing.
<!-- /ANCHOR:adr-003-consequences -->

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The shared harness hard-imports the lib from sk-doc (finding F8, CONFIRMED); the direction blocks cross-skill adoption |
| 2 | **Beyond Local Maxima?** | PASS | Symlink-from-sk-doc and per-hub duplication were considered and rejected |
| 3 | **Sufficient?** | PASS | A single shared location with repointed consumers removes the wrong-direction coupling |
| 4 | **Fits Goal?** | PASS | A framework-wide contract cannot be owned by one governed skill |
| 5 | **Open Horizons?** | PASS | Any future hub adopts the contract without importing from sk-doc |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `leaf-resource-contract.cjs` moves to a shared location; `router-replay.cjs`, `parent-skill-check.cjs` and any other consumer are repointed.

**How to roll back**: revert the move and the repoint commits together; the library's behaviour is unchanged, so a revert restores the prior import paths cleanly.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: A sealed, independently-authored holdout corpus with pre-registered metrics is the real evidence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (lands in the same change as the ADR-005 collapse) |
| **Date** | 2026-07-16 |
| **Deciders** | Operator (ratified Option 3 this session); verified SOL-redirect ledger (overfitting protocol) |

---

<!-- ANCHOR:adr-004-context -->
### Context

The 18/19 result was fitted: the router keyword table was hand-authored from the same 19 fixtures it then passes. The program's own charter says no benchmark generalizes without held-out scenarios. Structural self-consistency (topology valid, guards pass) can masquerade as semantic correctness while recall on unseen prompts is near zero.

### Constraints

- The holdout must be authored without sight of `smart_routing.md`, the fixture wording, or the router keywords.
- Gold must be assigned independently of the router, by more than one reviewer.
- Metrics must be pre-registered before unsealing, so a green fitted number cannot be retrofitted into a generalization claim.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: freeze the 19 fixtures as `stage: routing` (never called holdout); freeze the router; have 60–80 `stage: holdout` scenarios authored from user-facing capabilities and resource contents only, spanning paraphrase clusters, explicit/implicit requests, mixed-intent, negation, mention-without-intent, out-of-scope/unknown-fallback and noisy/typo/distractor cases; have two reviewers assign private typed gold and resolve disagreements before any run; run a leakage audit (exact-phrase, rare-phrase, n-gram, single-keyword); pre-register the metrics (mode-set accuracy + macro F1, typed-pair precision/recall/F1, physical-load precision after disk dedup, negative-specificity, over-bundle rate, fitted-to-holdout gap) before unsealing. Once a holdout scenario influences a router edit, retire it into the regression set and seal a new holdout.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sealed independent holdout + pre-registered metrics** | The only design where structural self-consistency cannot masquerade as semantic correctness | Requires an independent author and reviewer discipline | 9/10 |
| Keep expanding the fitted fixtures | No new process | Scales the measurement error faster than the routing improvement | 1/10 |
| k-fold over the existing fixtures only | Cheap, no new authoring | Same author, same vocabulary; leakage across folds; not a true holdout | 3/10 |

**Why this one**: generalization is the entire point of the North Star, and only an independently-authored sealed set with pre-registered metrics can earn that claim.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- For the first time the program can state an honest generalization number and a fitted-to-holdout gap.

**What to watch**:
- The corpus is only as credible as the author's independence; the leakage audit is the check on that, not a formality.
<!-- /ANCHOR:adr-004-consequences -->

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every suite in the program is fitted with no holdout; the charter says nothing generalizes without one |
| 2 | **Beyond Local Maxima?** | PASS | Expanding the fitted fixtures and k-fold over the same set were both rejected as leakage-prone |
| 3 | **Sufficient?** | PASS | Independent authoring + private gold + pre-registered metrics is enough to earn a generalization claim |
| 4 | **Fits Goal?** | PASS | Generalization is the entire point of the North Star |
| 5 | **Open Horizons?** | PASS | The sealed-corpus protocol is reusable for every skill in Wave 2 |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- A new sealed corpus directory (`stage: holdout`), a leakage-audit tool, and a pre-registered metric runner behind the offline gate.

**How to roll back**: the corpus and tooling are additive new files; removing the directory reverts the change without affecting the frozen `stage: routing` fixtures.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Collapse hub and surface into one authoritative intent→leaf taxonomy now (supersedes ADR-001)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | Operator (ratified Option 3 this session); GPT-5.6-SOL ultra + GLM-5.2 max + Fable-5 xhigh (converged); empirical 19-fixture probe |

---

<!-- ANCHOR:adr-005-context -->
### Context

ADR-001 staged the fix as "couple the surface leaf classifier to the hub-selected capped modes now, unify later." An empirical probe over all 19 fixtures through the real dispatcher, corroborated by three independent senior-model reviews, refuted that mechanism: the invariant "no typed pair may carry a `workflowMode` outside the hub selection" is exactly what `buildTypedResourceContract` already does, and it is the zero-emission bug. The hub cannot discriminate authoring intents — every create-* mode shares the `authoring-actions` keyword class, so any authoring verb ties all modes at parity; the declared `routerPolicy.tieBreak` is dead code the replay never reads; insertion order wins and the surface classifier's correct leaves are filtered to zero on SD-003/015/016/018/020 and on core out-of-fixture prompts.

The reviews converged on the deeper diagnosis: two independent keyword classifiers over the same prompt is the root defect. The hub "score" was never an open decision — every leaf already carries its mode through `leaf-manifest.json` and the registry, so the mode is a *projection* of the selected leaves, not a separate classification. Intersecting two noisy classifiers multiplies error and fails silently (an empty contract reads as "nothing to load").

### Constraints

- The one taxonomy must express intents that span modes (an agent+command request) and intents that are sub-mode slices (a single reference within a mode); a mode-shaped taxonomy cannot express either.
- Making the surface classifier authoritative raises its blast radius; the fitted keyword table must not be trusted as generalization without a sealed holdout landing in the same change.
- Full inventory must be a first-class intent inside the taxonomy, not a bypass keyed off a scenario flag the production path cannot set.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Option 3 — collapse hub and surface into one authoritative intent→leaf taxonomy now, with the sealed holdout corpus in the same change. One scored decision (intent → leaf-pairs, authored typed in `smart_routing.md`), two lookups (leaf→mode via the manifest; mode→packet entrypoint via the registry), one policy layer (`hub-router.json` shrinks to outcomes/delta/bundle/defer). The hub keyword pass is demoted to shadow telemetry: computed and exposed for the `intentRecall`/`hubRoute` dimensions, never gating the leaf contract.

**How it works**: the router runs one scored pass over the typed taxonomy and emits leaf pairs. The advertised `workflowModes` is `orderedUnique(pairs[*].workflowMode)` capped at two, so advertised-mode always equals loaded-mode (the coherence invariant). Non-discriminative wins (shared authoring verbs with no mode-owned keyword margin) abstain to `UNKNOWN_FALLBACK`/DEFER rather than guess. An empty typed contract while raw resources are non-empty is a hard ERROR, never a silent zero. Full inventory is driven by a FULL_INVENTORY intent inside the taxonomy.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Collapse to one taxonomy now (Option 3) + holdout same-change** | Removes the two-classifier disagreement class entirely; coherent contract; holdout guards the raised surface blast radius | Largest blast radius, longest build, touches many framework surfaces | 9/10 |
| Surface-authoritative cap + coherence only (Option A, staged) | Smallest change that stops zero-emission; bounded failure | Leaves the two-classifier root in place; a deferred holdout tends never to land | 7/10 |
| Minimal: A + tripwire only | Least work | Ships the surface-overfit risk unguarded until a later holdout | 5/10 |
| Union hub∪surface (Option B) | Stops zero-emission | Over-bundles by definition; trades zero-recall for a precision collapse | 3/10 |
| Tune the hub keyword scorer (Option C) | Keeps classifiers independent | Cannot fix the empty-hub full-inventory case; tunes against a dead tiebreak; deepens overfitting | 2/10 |

**Why this one**: the operator accepted the larger blast radius for the correct terminal architecture, and the holdout-in-same-change discipline turns the collapse into the safest path to a generalization claim rather than the riskiest.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- One authoritative decision; advertised mode always equals loaded mode; the previously-zero fixtures and core prompts emit non-empty mode-consistent pairs.
- Three currently-unreachable modes (create-benchmark, create-diff, create-skill-parent) surface once every mode must be reachable by ≥1 intent.
- Silent empty-contract failures become hard errors.

**What to watch**:
- The surface taxonomy is fitted; the sealed holdout landing in the same change is the only guardrail against rebuilding an overfitted mush with one head. Abstain-by-default raises DEFER friction; the answer is the disambiguation checklist, not fattening keywords.
<!-- /ANCHOR:adr-005-consequences -->

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The ratified ADR-001 mechanism is the zero-emission bug (probe + 3-model review, CONFIRMED) |
| 2 | **Beyond Local Maxima?** | PASS | Options A/B/C and the staged coupling were all considered and rejected |
| 3 | **Sufficient?** | PASS | One taxonomy + coherence invariant + abstain + tripwire + sealed holdout removes the disagreement class and guards the raised blast radius |
| 4 | **Fits Goal?** | PASS | Perfect routing (right mode + right leaves) is exactly one authoritative intent→leaf decision |
| 5 | **Open Horizons?** | PASS | The one-taxonomy pattern and the sealed-holdout protocol generalize to every Wave-2 hub |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: `router-replay.cjs` (one scored pass, hub→telemetry), `executor-dispatch.cjs` (coherence invariant, tripwire, FULL_INVENTORY intent), `smart_routing.md` (typed intent→pairs taxonomy incl. the three unreachable modes), the loader/topology/live/scorer benchmark path, `hub-router.json` (shrunk to policy), `leaf-aliases.json` (shared-leaf multi-ownership), `parent_hub_router_schema.md` (§7 tieBreak reconciled), plus the vocab-class and coverage lints and the sealed holdout corpus with pre-registered metrics.

**How to roll back**: the phases are commit-isolated and dependency-ordered; revert in reverse order. The frozen `stage: routing` fixtures and the additive holdout corpus are never overwritten, so reverting the router phases restores prior behaviour without stranding corpus data.
<!-- /ANCHOR:adr-005 -->
