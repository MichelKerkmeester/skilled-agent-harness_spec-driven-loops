---
title: "Feature Specification: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix"
description: "Make the typed routing contract flow end-to-end and be measurable against blind scenarios. Under the ratified Option 3 (ADR-005), collapse the two-classifier router into one authoritative intent->leaf taxonomy with the hub demoted to telemetry, add the coherence invariant + empty-contract tripwire + abstain/DEFER + vocab and coverage lints, wire the skill-benchmark loader/runner/live/scorer to typed gold, correct the false selected-map join, apply SD-015 option C, relocate the contract library out of the sk-doc packet, and land a sealed independently-authored holdout corpus behind offline and live gates in the same change, before any propagation to other skills."
trigger_phrases:
  - "benchmark harness typed wiring"
  - "two classifier decoupling fix"
  - "leaf selection coupled to hub modes"
  - "sealed independent holdout corpus"
  - "selected-map join fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/014-benchmark-harness-typed-wiring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Rewrote 014 to the ratified Option 3 collapse (ADR-005)"
    next_safe_action: "Start Phase 1: design-lock taxonomy schema, freeze fixtures and router"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-benchmark-harness-typed-wiring-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Selection-fix mechanism ratified 2026-07-16: Option 3 (ADR-005). Collapse the two classifiers into one authoritative intent->leaf taxonomy now, hub demoted to telemetry, sealed holdout in the same change. Supersedes the staged ADR-001 coupling, which a probe + 3-model review proved was itself the zero-emission bug"
      - "SD-015 fan-out ratified to option C: mode-aware resolver plus manifest enumeration, with two gold surfaces (public pairs vs disk targets)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix

---

## EXECUTIVE SUMMARY

Sibling packet `012-sk-doc-routing-fixes` built a sound typed-pair namespace foundation (contract library, `leaf-manifest.json`, aliases, guards) and a hand-authored `smart_routing.md` that resolved 18 of 19 fixtures to their typed gold under deterministic router-replay. An independent GPT-5.6-SOL review, adversarially verified against the committed tree, established that the 18/19 is a **fitted replay artifact**: it bypasses the 2-mode dispatch cap, and through the real dispatcher core scenarios resolve to **zero** leaves and collapse entirely off the 19 fixtures. The verification ledger closed at **8 findings confirmed, 3 plausible, 1 refuted** — no core finding was refuted.

This packet makes the typed contract actually flow end-to-end and, critically, makes routing quality **falsifiable** against blind scenarios before it is propagated to any other skill.

**Key Decisions**: The selection fix collapses the two classifiers into one authoritative intent→leaf taxonomy now (ADR-005, Option 3), with the hub demoted to telemetry — superseding the staged ADR-001 coupling that a probe and three independent model reviews proved was itself the zero-emission bug. SD-015 adopts option C. The contract library moves out of the sk-doc packet. A sealed, independently-authored holdout corpus lands in the same change as the collapse and is the real evidence, not the fitted fixtures.

**Critical Dependencies**: The unified taxonomy (Phase 3) and the single-pass router core (Phase 4) unblock every measurement — until the dispatcher stops emitting zero, no downstream metric is meaningful.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-16 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-sk-doc-router-alignment` |
| **Parent Spec** | ../spec.md |
| **Evidence Source** | Verified SOL-redirect ledger (this session); `../012-sk-doc-routing-fixes/decision-record.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The shared skill-benchmark harness and the sk-doc surface router cannot currently prove that the typed routing contract works, and in the real dispatch path it does not. Six concrete, verified defects:

1. **Two independent classifiers (root cause).** Router-replay selects hub modes from `hub-router.json` AND independently re-scores the prompt through `smart_routing.md` for leaf pairs, then intersects them. The hub cannot discriminate authoring intents (every create-* mode shares the `authoring-actions` keyword class → parity tie → the declared `tieBreak` is dead code the replay never reads → insertion order wins), so it over-selects generic modes; the `MAX_WORKFLOW_MODES=2` cap keeps those, and `buildTypedResourceContract` filters the correct leaf pairs to **zero** (confirmed on SD-003/015/016/018/020; core out-of-fixture prompts route to 0 leaves). A probe and three model reviews established the intersection itself is the defect: the mode is a projection of the selected leaves, so two classifiers must not jointly gate one contract.
2. **The benchmark loader never reads typed gold.** `load-playbook-scenarios.cjs` reads only legacy `expected_intent`/`expected_resources`; it never reads `expected_leaf_resources`, `expected_workflow_mode`, or `full_inventory_intent`. The entire typed pipeline — including the shipped scorer taxonomy — is dormant.
3. **The "selected-map join" validates gold against itself.** `validate-playbook-topology.cjs` only checks each pair's `workflowMode` against the fixture's own `expected_workflow_mode` and resolves the leaf in the manifest. It never joins gold against `smart_routing.md`'s `RESOURCE_MAP`, so an arbitrary fixture-fitted map passes "19/19 valid".
4. **The live executor scores self-report.** The Mode-B prompt asks for flat untyped resource strings and emits no `resourceContract`; scoring treats the model's stated resources as primary. A live run cannot prove the typed pair contract.
5. **No pre-dispatch topology gate in the runner.** `run-skill-benchmark.cjs` never invokes `validate-playbook-topology.cjs`, so invalid or fitted fixtures are never blocked before scoring.
6. **The contract library is sk-doc-local; SD-015 fan-out is under-counted.** `router-replay.cjs` hard-imports the contract lib from `sk-doc/create-skill`, and `parent-skill-check.cjs` assumes every hub has `create-skill/scripts/...` — the wrong dependency direction for a framework-wide program. SD-015 conflates logical identity with physical load.

Underneath all of it: every benchmark suite in the program is fitted, with no held-out scenarios, so nothing generalizes yet.

### Purpose

Make the typed routing contract flow through the real dispatch path (not just replay), make the benchmark able to **measure and falsify** routing quality against blind scenarios, and hold Wave-2 propagation until the harness can prove — not assume — that the design generalizes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Single-classifier collapse (ADR-005, Option 3).** Rewrite the router to one scored pass over a typed intent→leaf taxonomy authored in `smart_routing.md`; each pair's `workflowMode` is projected from its leaf via the manifest; the hub keyword pass is demoted to telemetry-only and gates nothing. Implemented across `router-replay.cjs`, `executor-dispatch.cjs`, `smart_routing.md` and `hub-router.json`. Includes the coherence invariant (advertised `workflowModes = orderedUnique(pairs modes)` cap 2), the empty-contract-with-non-empty-raw tripwire, a first-class FULL_INVENTORY intent, the abstain/DEFER path for non-discriminative wins, a negation guard, the vocab-class and coverage lints, and intents for the three currently-unreachable modes.
- **Typed benchmark wiring.** `load-playbook-scenarios.cjs` reads typed gold; `run-skill-benchmark.cjs` runs the topology validator as a pre-dispatch gate; `live-executor.cjs` emits typed pairs and scores actual file reads over self-report; the already-shipped 5-class scorer taxonomy (`score-skill-benchmark.cjs`, `build-report.cjs`) is fed real typed gold.
- **Selected-map join fix.** `validate-playbook-topology.cjs` joins each fixture's gold against the authored `smart_routing.md` `RESOURCE_MAP`, so "topology valid" means "consistent with the actual router".
- **SD-015 option C.** A mode-aware resolver plus manifest enumeration for the full-inventory intent, with two gold surfaces — `expected_public_pairs` (logical identity, both fan-out modes) and `expected_disk_targets` (physical load, deduplicated).
- **Contract-library relocation.** Move `leaf-resource-contract.cjs` out of the sk-doc packet to a shared location and update every consumer's import path (`router-replay.cjs`, `parent-skill-check.cjs`), so the dependency direction fits a framework-wide program.
- **Minor correctness fixes.** Byte-stability of manifest generation (`localeCompare` → locale-independent sort) and a `resourceContractVersion` equality cross-check across registry, manifest and library.
- **Sealed independent holdout corpus.** Freeze the 19 fixtures as `stage: routing`; freeze the router; have the corpus authored without sight of `smart_routing.md`, fixture wording, or router keywords; two reviewers assign private typed gold; 60–80 scenarios spanning paraphrase, implicit, mixed-intent, negation, out-of-scope and noisy cases; a leakage audit; pre-registered exact-set metrics.
- **Gates.** An offline-holdout gate, then a live 3-gate (interpretation, end-to-end, outcome), as the release condition for propagation.

### Out of Scope

- **Deleting the hub keyword pass entirely.** ADR-005 demotes it to shadow telemetry (it still feeds the `intentRecall`/`hubRoute` dimensions); removing it outright is deferred until the telemetry shows it earns no independent value.
- **Wave-2 propagation to sk-code, sk-design, system-code-graph, system-deep-loop, sk-prompt.** Explicitly held until this packet's gates pass. Copying the fitted `smart_routing.md` pattern into five more skills is forbidden until then.
- **Re-authoring 012's contract library internals.** 012's namespace/topology foundation is sound and reused as-is, except for the relocation and the two minor fixes named above.
- **Record correction of 012's "18/19 fixed" claim.** That belongs in `012-sk-doc-routing-fixes` (its tasks and completion metadata), cross-referenced from here, not re-litigated in this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | One scored pass over the taxonomy; project mode from leaves; hub pass → telemetry; abstain/DEFER + negation guard; relocated contract-lib import |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs` | Modify | Coherence invariant (`workflowModes = orderedUnique(pairs modes)` cap 2); pair ∈ manifest; empty-contract tripwire; FULL_INVENTORY intent drives full inventory |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | Modify | Read `expected_leaf_resources`, `expected_workflow_mode`, `full_inventory_intent` |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | Invoke `validate-playbook-topology.cjs` as a pre-dispatch gate |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs` | Modify | Emit typed pairs; score actual reads over stated resources |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Consume typed gold through the shipped 5-class taxonomy |
| `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs` | Modify | Join fixture gold against `smart_routing.md`'s `RESOURCE_MAP` |
| `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` | Move | Relocate to a shared, non-sk-doc location; locale-independent manifest sort |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Update contract-lib path; add `resourceContractVersion` equality cross-check |
| `.opencode/skills/sk-doc/manual_testing_playbook/**` (SD-015) | Modify | Two gold surfaces: `expected_public_pairs` and `expected_disk_targets` |
| `.opencode/skills/sk-doc/shared/references/smart_routing.md` | Modify | Typed intent→pair taxonomy; intents for the 3 unreachable modes; first-class FULL_INVENTORY |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Shrink to policy (outcomes/delta/bundle/defer); keyword scoring → telemetry-only |
| `.opencode/skills/sk-doc/leaf-aliases.json` | Modify | Allow shared-leaf multi-ownership / mode-neutral type |
| `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md` | Modify | Reconcile §7 with the implemented single-pass order (remove the dead-tieBreak promise) |
| Vocab-class + coverage lints | Create | No class >2 sibling signals; every mode reachable by ≥1 intent |
| `.opencode/skills/sk-doc/.../holdout/**` (new corpus) | Create | 60–80 sealed, independently-authored typed-gold holdout scenarios |
| Holdout tooling (leakage audit, metrics, offline gate) | Create | Leakage-overlap audit and pre-registered exact-set metric harness |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Collapse to one authoritative scored pass so the dispatcher stops emitting zero on core scenarios | The router scores the taxonomy once and projects modes from leaves; for SD-003/015/016/018/020 and core out-of-fixture prompts, `buildTypedResourceContract` returns a non-empty, mode-consistent pair set; a regression test pins the previously-zero cases to non-zero |
| REQ-002 | Wire the benchmark loader, runner, live executor and scorer to typed gold | `load-playbook-scenarios.cjs` surfaces `expected_leaf_resources`/`expected_workflow_mode`/`full_inventory_intent`; the runner blocks on topology failure; live output carries typed pairs; the 5-class taxonomy scores against typed gold |
| REQ-003 | Make the topology validator join gold against the authored router | `validate-playbook-topology.cjs` fails a fixture whose gold pair is absent from `smart_routing.md`'s `RESOURCE_MAP`; a deliberately-mismatched synthetic fixture is rejected |
| REQ-004 | Relocate the contract library out of the sk-doc packet and repoint all consumers | No runtime path outside sk-doc imports the contract lib from `sk-doc/create-skill`; `parent-skill-check.cjs` and `router-replay.cjs` resolve it from the shared location; existing unit + guard tests pass unchanged |
| REQ-005 | Apply SD-015 option C with two gold surfaces | Full-inventory resolves by manifest enumeration, not raw-path reverse-mapping; `expected_public_pairs` counts both fan-out modes; `expected_disk_targets` deduplicates shared physical files |
| REQ-009 | Author one authoritative typed intent→leaf taxonomy with full mode coverage | The taxonomy is typed `(workflowMode, leafResourceId)` in `smart_routing.md`; every registered mode (incl. create-benchmark/create-diff/create-skill-parent) is reachable by ≥1 intent; FULL_INVENTORY is a first-class intent |
| REQ-010 | Enforce the coherence invariant and fail closed on empty contracts | Advertised `workflowModes = orderedUnique(pairs[*].workflowMode)` capped at two on every fixture; an empty typed contract while raw resources are non-empty raises a hard error, never a silent zero |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Build a sealed, independently-authored holdout corpus with a leakage audit and pre-registered metrics | 60–80 `stage: holdout` scenarios exist with private typed gold; the leakage audit reports exact-phrase, rare-phrase, n-gram and single-keyword overlap; metrics (mode-set accuracy, typed-pair P/R/F1, negative specificity, over-bundle rate, fitted-to-holdout gap) are pre-registered before unsealing |
| REQ-007 | Establish the offline-holdout gate and the live 3-gate as the propagation release condition | The offline-holdout gate runs the frozen router over the sealed corpus and reports the pre-registered metrics; the live 3-gate (interpretation, end-to-end, outcome) is defined and runnable; Wave-2 is documented as blocked on both |
| REQ-011 | Abstain rather than guess on non-discriminative wins; guard negation | A shared-authoring-verb-only prompt routes to UNKNOWN_FALLBACK/DEFER with a disambiguation checklist; `defaultMode: null`/`outcomes.defer` are honored; a negator within N tokens suppresses the hit |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Byte-stability and version-equality hardening | Manifest generation uses a locale-independent sort; `parent-skill-check.cjs` fails on `resourceContractVersion` skew across registry/manifest/library |
| REQ-012 | Vocab-class and coverage lints; schema-to-impl reconciliation | The vocab-class lint fails any class referenced by >2 sibling signals; the coverage lint fails an unreachable mode; `parent_hub_router_schema.md` §7 matches the implemented order (no dead-tieBreak promise) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The dispatcher emits a non-empty, mode-consistent typed-pair set on the three previously-zero fixtures and on a held sample of core out-of-fixture prompts; a regression test pins this.
- **SC-002**: A benchmark run scores the typed `(workflowMode, leafResourceId)` pairs — not legacy flat strings and not the model's self-report — end to end, with the topology gate blocking invalid fixtures before dispatch.
- **SC-003**: The topology validator rejects a fixture whose gold is inconsistent with the authored `smart_routing.md` router.
- **SC-004**: No runtime path outside sk-doc depends on the contract library living inside the sk-doc packet.
- **SC-005**: A sealed, independently-authored holdout corpus exists, passes a leakage audit, and produces the pre-registered metrics, with the fitted-to-holdout generalization gap reported honestly.
- **SC-006**: Wave-2 propagation is explicitly gated on the offline-holdout and live 3-gate results; the fitted `smart_routing.md` pattern is not copied to any other skill before those gates pass.
- **SC-007**: On every fixture, the advertised `workflowModes` equals the deduplicated modes of the emitted pairs, and an empty contract with non-empty raw resources raises a hard error rather than a silent zero.
- **SC-008**: Every registered mode is reachable by ≥1 taxonomy intent, and a shared-authoring-verb-only prompt DEFERs to a disambiguation question rather than guessing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| The authoritative surface taxonomy is fitted and over-matches on a held-out prompt (the raised blast radius of making it authoritative) | Medium | Medium | The abstain/DEFER path + a small per-intent leaf set bound the failure to precision, not zero; the sealed holdout lands in the same change and measures the fitted-to-holdout gap |
| The holdout corpus is not truly independent (author sees router vocabulary) | Medium | High | Freeze the router before authoring; author from user-facing capabilities and resource contents only; run the leakage audit and report single-keyword dependence |
| Relocating the contract library breaks a consumer not found by grep | Low | Medium | Enumerate consumers with a symbol search before the move; run the full unit + guard + vitest gate after repointing |
| Concurrent-session churn on the shared benchmark harness collides with these edits | Medium | Low | Pathspec-limited commits; verify a clean baseline before each phase; the harness files are owned by this workstream during active phases |

### Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 012's typed-pair contract library and manifest | Internal | Shipped | Reused as-is (relocated); the foundation this packet wires through |
| The shipped 5-class scorer taxonomy (`88c02440ac`) | Internal | On origin | Fed typed gold in Phase 2; already unit-tested and dormant until wired |
| `smart_routing.md` (012) | Internal | Shipped | The authored router the topology join and offline gate validate against |
| An independent author/reviewer for the holdout corpus | Process | Not started | The corpus is only credible if authored without router sight; blocks REQ-006 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Manifest generation stays byte-stable after the locale-independent sort: repeated runs and permuted enumeration order produce identical bytes and digest.
- **NFR-P02**: The offline-holdout gate replays the frozen router over 60–80 scenarios in a single deterministic pass, with no model in the loop, so it stays cheap enough to run on every router edit.

### Reliability
- **NFR-R01**: A fixture that is invalid or inconsistent with the authored router fails closed at the pre-dispatch topology gate: zero dispatch, excluded from every scoring denominator, never silently scored as zero recall.
- **NFR-R02**: Leaf selection is deterministic given a prompt and a frozen router: the single scored pass and its deterministic tie order introduce no run-to-run variance in the offline path.

### Measurability
- **NFR-M01**: Every reported routing number is attributable to a stage (`stage: routing` fitted vs `stage: holdout` sealed) and a metric that was pre-registered before the corpus was unsealed.

---

## 8. EDGE CASES

### Data Boundaries
- The create-skill / create-skill-parent fan-out: SD-015 carries `expected_public_pairs` (both modes) and `expected_disk_targets` (deduplicated), so identity and load are never conflated.
- A prompt that legitimately spans two modes: the taxonomy emits a cross-mode pair set (e.g. AGENT_COMMAND → create-agent + create-command), still bounded by the 2-mode cap; named bundleRules are the sanctioned exception.

### Error Scenarios
- The surface taxonomy over-matches: the abstain/DEFER path routes non-discriminative wins to a disambiguation question rather than a wrong guess; a genuinely wrong-but-specific match is a bounded precision miss the holdout surfaces, not a silent zero.
- A holdout scenario's gold pair is absent from the frozen router's `RESOURCE_MAP`: the topology join rejects the fixture rather than scoring it as a miss.

### State Transitions
- Once a holdout scenario influences a router edit it is retired into the `stage: routing` regression set and a new holdout is sealed; a scenario is never both an influence and a held-out measurement.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: the router core, the typed taxonomy, the six-script benchmark harness, the topology validator, the relocated contract library, hub-router/leaf-aliases/schema, the SD-015 fixture, new lints, and a sealed corpus with tooling. Systems: unified router, benchmark scorer, create-skill contract |
| Risk | 18/25 | No auth or public API surface, but the router rewrite changes runtime dispatch, the relocation moves guard-loaded code, and making the surface taxonomy authoritative raises its blast radius; a bug breaks every benchmark scenario at once |
| Research | 6/20 | Root cause and fix direction are settled by the probe and three model reviews; remaining work is implementation plus corpus authoring, not investigation |
| Multi-Agent | 6/15 | Single implementer per phase, but the holdout corpus needs an independent author and two reviewers |
| Coordination | 13/15 | Ten dependency-ordered phases, an independent-authoring gate, and a concurrently-active shared harness |
| **Total** | **65/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The authoritative surface taxonomy is fitted and over-matches on a held-out prompt | M | M | The abstain/DEFER path bounds non-discriminative wins; each intent maps to a small leaf set (bounded precision failure, not unbounded zero); the sealed holdout lands in the same change and measures it |
| R-002 | The holdout corpus is not truly independent (author saw router vocabulary) | H | M | Freeze the router before authoring; author from capabilities and resource contents only; run the leakage audit and report single-keyword dependence |
| R-003 | Relocating the contract library breaks a consumer grep did not find | M | L | Enumerate consumers by symbol search before the move; run the full unit + guard + vitest gate after repointing |
| R-004 | Concurrent-session churn on the shared harness collides with these edits | L | M | Pathspec-limited commits; capture a clean baseline before each phase |

---

## 11. USER STORIES

### US-001: Non-zero, mode-consistent dispatch (Priority: P0)

**As a** benchmark maintainer, **I want** the dispatcher to emit a non-empty, mode-consistent typed-pair set on core scenarios, **so that** routing recall can be measured at all instead of collapsing to zero through the 2-mode cap.

**Acceptance Criteria**:
1. Given SD-003/015/016/018/020 or a core out-of-fixture prompt, When `buildTypedResourceContract` runs, Then it returns a non-empty pair set whose advertised `workflowModes` equals the deduplicated modes of the emitted pairs.

### US-002: Falsifiable generalization (Priority: P1)

**As a** program owner, **I want** a sealed, independently-authored holdout corpus with pre-registered metrics, **so that** a routing improvement can be shown to generalize before it is propagated to five more skills.

**Acceptance Criteria**:
1. Given the frozen router and the sealed corpus, When the offline-holdout gate runs, Then it reports the pre-registered metrics and the fitted-to-holdout gap, and Wave-2 stays blocked until they clear the ratchet.

---

## 12. OPEN QUESTIONS

- The exact shared location for the relocated contract library (system-level lib vs shared skill-support tree) is an implementation choice deferred to Phase 2 after the consumer inventory.
- Who authors the independent holdout corpus (a fresh agent blind to the taxonomy vs an operator-designated author) is an operator-policy decision that gates Phase 9.
- The starting ratchet thresholds (holdout mode accuracy, typed-pair F1, negative specificity, fitted-to-holdout gap) are proposed in ADR-004 but not yet ratified as release gates.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Evidence Source**: The verified SOL-redirect ledger (this session)
- **Preceding phase (map order)**: `../013-skill-advisor-routing-fixes/spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Sibling (record correction)**: `../012-sk-doc-routing-fixes`
- **Parent**: `../spec.md` (031 router-alignment program)
