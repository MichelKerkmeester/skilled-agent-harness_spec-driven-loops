---
title: "Decision Record: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix"
description: "Four decisions from the verified SOL-redirect: staged selection fix (couple leaf to hub modes now, unify to one contract later), SD-015 option C with two gold surfaces, contract-library relocation out of the sk-doc packet, and a sealed independently-authored holdout protocol with pre-registered metrics. Each ADR folds in its eliminated alternatives."
trigger_phrases:
  - "benchmark harness typed wiring decision record"
  - "staged selection fix adr"
  - "sd-015 option c adr"
  - "sealed independent holdout adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/014-benchmark-harness-typed-wiring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored four ADRs from the verified ledger and the ratified selection-fix and SD-015 decisions"
    next_safe_action: "Start Phase 1 under ADR-001 (couple leaf selection to the capped hub modes)"
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
      - "ADR-001 and ADR-002 were operator-ratified this session; ADR-003 and ADR-004 are Proposed under the adopted redirect"
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
| **Status** | Accepted |
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
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Verified SOL-redirect ledger (finding F8, CONFIRMED); pending operator sign-off |

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
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Verified SOL-redirect ledger (overfitting protocol); pending operator sign-off |

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
