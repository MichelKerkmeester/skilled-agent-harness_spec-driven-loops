---
title: "Implementation Summary: cli-external-orchestration Per-Hub Rollout"
description: "Compiled external-executor policy, typed route-gold proof, closed-algebra safety, execution fencing, and byte-exact rollback."
trigger_phrases:
  - "cli external orchestration rollout result"
  - "external executor canary green"
  - "cli router implementation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/004-cli-external-orchestration"
    last_updated_at: "2026-07-19T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Reached REAL-GREEN with frozen scorer digests unchanged"
    next_safe_action: "Keep the candidate shadow-only until parent activation"
    blockers: []
    key_files: ["implementation-summary.md", "harness/validate-canary.cjs", "activation/acceptance.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-07-19-cli-external-rollout-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: cli-external-orchestration Per-Hub Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| Status | Implemented; REAL-GREEN canary |
| Date | 2026-07-19 |
| Level | 2 |
| Serving authority | Legacy |
| Effective policy | `4554f82a2dcb22e940581734e6a958d73fbbcee8344278bcd8408ef7568e1c9d` |
| Destination graph | `aae29ab476ed629167fc89a206b339dcb0e23981ccc7260a8f75989fb6fd35d2` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The child contains a zero-dependency registry compiler, typed router, document policy card, activation gate, execution fence, deterministic artifact builder, and real-green validator. It compiles exactly three authored external-executor modes as actor destinations. Each carries weight 4 and its child `SKILL.md` resource.

Generated outputs include `CompiledPolicyV1`, the destination graph, advisor projection, typed route gold, policy card, blast-radius record, candidate/prior manifests, acceptance digests, and fence state. No live hub or shared file is changed.

### Files Delivered

- `lib/`: compiler, router, policy card, activation gate, execution fence.
- `harness/`: deterministic builder and canary validator.
- `fixtures/`: eight route cases and four advisor cases.
- `compiled/` and `activation/`: eleven generated artifacts.
- Level-2 specification and metadata files.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The compiler reads the hub router, mode registry, hub skill, and executor skills as bytes and verifies their identities before adapting the authored model to the shared compiler. Selector classes and weights come from the router; destinations and resources come from the registry; explicit bundle order comes from `tieBreak`.

The evaluator separates explicit alias selection from semantic scoring. One explicit class is `single`; two or three distinct explicit classes are an `orderedBundle`. Without explicit aliases, a unique top score selects one executor, a tie clarifies once, and zero score defers. Negative admission rejects before scoring.

Every typed decision projects through the shared projector. The validator calls the frozen read-only scorer on all eight rows and verifies a corrupted observation fails. Advisor input is identity-gated, while policy-card replay uses only its embedded canonical payload and rejects ordering tamper.

The shared execution plane owns PREPARE and VERIFY. The local fence permits COMMIT only for actor targets after READY, producing one simulated effect and no real CLI invocation. The shared fenced-manifest implementation blocks wrong preimages and mixed generations, then restores retained prior bytes exactly.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Distinguish explicit multi-select from semantic tie | The authored hub supports explicitly requested multiple executors, while the required closed algebra reserves clarify for ambiguity. |
| Encode every authored pair and triple as a composition rule | The shared decision parser requires exact ordered-bundle membership in compiled policy data. |
| Model all three destinations as actors with external effects | Each executor dispatches a CLI and owns its destination-local commit; there are no evidence or judgment modes in this hub. |
| Keep legacy serving-authoritative | The child proves a candidate and rollback without editing live routing state. |
| Exercise the frozen scorer directly | Compatibility must be proven against the real oracle, not a locally reimplemented approximation. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Compile | PASS | 3 actors, 4 composition rules, byte-identical recompile |
| Route-gold | GREEN | 8/8 real scorer rows; corrupted observation false |
| Outcomes | PASS | 5 route, 1 clarify, 1 defer, 1 reject |
| Closed algebra | PASS | Actor-first routes; 3 negative branches target-free and authority-free |
| Advisor | PASS | 4 states, 1 contribution, 0 decision overrides |
| Document parity | PASS | 8/8 match; tamper detected; no fallback |
| Execution | PASS | PREPARE→VERIFY→COMMIT; commit-without-ready blocked; 0 real effects |
| Activation | PASS | 11 hard blocks, pin checks, mixed-generation refusal |
| Rollback | PASS | Wrong preimage blocked; prior/restored hash `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23` |
| Static | PASS | 7 code files, no external dependencies or nondeterministic calls |
| Source protection | PASS | Six authored inputs and three scorer files unchanged before/after |

Protected scorer digests:

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. No real external CLI effect was executed. The effect is simulated after the real execution plane reaches READY.
2. Legacy remains serving-authoritative and the candidate remains shadow-only.
3. Manifest rollback cannot undo an external effect that already committed; post-COMMIT recovery belongs to the destination.
4. The fixture corpus is representative, not a calibrated natural-language benchmark.
5. The frozen legacy hub router may collapse explicit multi-executor text to one legacy resource. This child follows the authored `orderedBundle` contract and validates its typed projection with the frozen scorer; it does not change the live legacy producer.

<!-- /ANCHOR:limitations -->
