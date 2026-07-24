---
title: "Implementation Summary: sk-prompt Per-Hub Canary"
description: "Two-mode shared-compiler rollout with bounded prompt-improve default, ordered bundle, real route-gold, document parity, and byte-exact rollback."
trigger_phrases:
  - "sk-prompt canary implementation summary"
  - "prompt default real-green result"
  - "sk-prompt stage gate handoff"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/005-sk-prompt"
    last_updated_at: "2026-07-19T23:59:59Z"
    last_updated_by: "codex"
    recent_action: "Completed REAL-GREEN verification and packet reconciliation"
    next_safe_action: "Retain legacy serving authority pending parent rollout"
    blockers: []
    key_files:
      - "compiled/policy.json"
      - "compiled/route-gold.typed.json"
      - "harness/validate-canary.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-prompt-rollout-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-prompt Per-Hub Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Status** | Complete — REAL-GREEN, shadow-only |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | Legacy |
| **Route-gold** | 8/8 real-green, 0 shadow-partial |
| **Strict validation** | Pass |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The child contains a source-bound adapter for the shared `CompiledPolicyV1` compiler, a bespoke
two-mode request router, a policy-card generator with independent document replay, hard activation
gates, and a destination-local execution fence. It reads the live hub router, registry, hub skill,
and two packet skills as immutable bytes.

The adapter derives only authored modes and resources. `prompt-improve` compiles with weight `4`,
`prompt-models` with weight `6`, and each selects its packet `SKILL.md`. One ordered composition
rule preserves the authored tie-break `[prompt-improve,prompt-models]`. No leaf manifest is created
because the hub's resource contract names the packet skill directly.

The frozen schema has no separate default-mode field, so the content-addressed routing metadata
retains `defaultMode=prompt-improve` and the request adapter emits a `bounded-default` single route
when no authored signal matches. This preserves the live contract without adding a schema field or
changing the shared compiler.

### Files Delivered

| Area | Files | Purpose |
|---|---|---|
| Compiler/router | `lib/registry-compiler.cjs`, `lib/router.cjs` | Source binding, shared compile, weighted decisions |
| Card/authority | `lib/policy-card.cjs`, `lib/execution-fence.cjs` | Document parity and VERIFY-before-COMMIT |
| Activation | `lib/activation-gate.cjs`, `activation/*.json` | Hard blocks, candidate, prior, fence, acceptance |
| Harness | `harness/*.cjs`, `fixtures/canary-cases.v1.json` | Generation, real scorer, falsifiers, rollback |
| Generated | `compiled/*` | Policy, advisor, graph, typed gold, policy card |
| Documentation | Level-2 root files | Scope, plan, evidence, state, metadata |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every parsed authored object is compared to its independently hashed bytes before compilation.
The adapter validates two workflow modes, a registered non-null default, a complete tie-break,
positive weights, vocabulary-class references, and one packet skill resource per mode. It then
calls the shared compiler with deterministic destinations, signals, leaves, authority edges, and
the ordered bundle rule.

The router counts matched authored keywords and multiplies each count by the mode's authored
weight. A score difference within the authored ambiguity delta clarifies once. Exact presence of
both workflow names is treated as the explicit dual-mode request and composes the bundle in the
authored tie-break order. With no score, the bounded default routes `prompt-improve`. Forbidden and
dependency constraints are evaluated before positive routing.

Typed decisions select compiled `(workflowMode, leafResourceId)` pairs and pass them to the shared
projector. The validator scores both in-memory projections and the delivered, hash-bound typed
artifact through the real read-only scorer subprocess. It recomputes row hashes, verifies the
acceptance digest, forbids scorer writes, and confirms coherent resource corruption fails.

Activation remains phase-local. The drill compares the expected prior tuple, advances a fenced
candidate swap, pins the compiled tuple, rejects mixed generations, and swaps back to the retained
prior bytes. No live selector is changed.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Use shared `compile()` | The frozen compiler remains the sole constructor and schema authority. |
| Keep default metadata beside the policy | The schema has no default field; source hashes content-address the metadata and the adapter applies it as bounded default. |
| Treat both exact workflow names as explicit dual intent | This is deterministic and prevents ordinary overlapping vocabulary from silently bundling. |
| Score all other overlaps with authored weights | This preserves `4`, `6`, and ambiguity delta `1` rather than flattening signal strength. |
| Use packet `SKILL.md` as each leaf identity | The router already authors exactly those resources; no leaf manifest is warranted. |
| Keep both workflow destinations as actors | `packetKind=workflow` defines acting destinations; `prompt-models` remains read-only through `mutatesWorkspace=false`. |
| Retain legacy serving authority | The requested rollout is a proven shadow canary, not a live flip. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|---|---|---|
| Canonical compile | Pass | Two destinations, one ordered rule, byte-identical recompile |
| Source binding | Pass | Five authored hashes pinned; caller/source mismatch rejected |
| Default | Pass | Unrelated prompt routes single `prompt-improve`, bounded-default |
| Ordered bundle | Pass | Both explicit modes route in tie-break order; reverse rejected |
| Ambiguity | Pass | Exactly one clarify row with closed alternatives |
| Real route-gold | Pass | 8/8 in-memory and delivered rows real-green; 0 shadow-partial |
| Falsifier | Pass | Corrupted resource fails with `resourceOk: false` |
| Closed algebra | Pass | Negative target/authority and route recovery fail |
| Document parity | Pass | 8/8 match; changed embedded default diverges and is rejected |
| Execution fence | Pass | COMMIT before READY fails; legal path PREPARE→VERIFY→COMMIT |
| Rollback | Pass | Prior/restored SHA-256 identical; fence epoch reaches 2 |
| Static constraints | Pass | Seven code files; zero comment, dependency, or determinism violations |
| Strict packet | Pass | Final strict validator exits 0 |

Protected scorer hashes after final verification:

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This is a phase-local shadow canary; it does not activate a live router generation.
2. Eight cases cover both single routes, the ordered bundle, ambiguity, bounded default, defer,
   prompt-driven reject, and constraint-driven reject. They are not a language corpus.
3. The exact-workflow-name rule is the explicit dual-intent marker. Future authored bundle rules
   would require a new source contract and recompilation.
4. The shared schema records exact-admission threshold policy; the bounded default remains in the
   source-bound routing metadata and policy card because the schema exposes no default field.

<!-- /ANCHOR:limitations -->
