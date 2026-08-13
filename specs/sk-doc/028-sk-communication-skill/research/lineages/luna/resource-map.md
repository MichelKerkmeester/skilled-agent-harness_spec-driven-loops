---
title: Communication Projection Research Resource Map
type: resource-map
status: complete
spec_folder: specs/sk-doc/028-sk-communication-skill
artifact_dir: specs/sk-doc/028-sk-communication-skill/research/lineages/luna
session_id: fanout-luna-1786567036073-2o1pe1
---

# Communication Projection Research Resource Map

This map records the implementation, skill, documentation, test, and lineage surfaces consulted by the five-iteration detached research loop. Paths are read-only source references; all generated artifacts remain under this lineage directory.

## Product contract and skill

| Source | Relevant surface | Used for |
|---|---|---|
| `.opencode/skills/sk-communication/SKILL.md:1-39,43-67,117-160,189-195` | Product promise, activation/exclusion, pipeline, tiers, privacy/fidelity rules, release criteria | Scope, invariants, value boundary, architecture recommendation |

## Privacy, support, operations, and rollback

| Source | Relevant surface | Used for |
|---|---|---|
| `packages/cli-communication-projection/docs/configuration.md:1-23` | Local-only, hosted, mixed modes; consent; explicit fallback; doctor setup | Privacy adoption boundary and operator controls |
| `packages/cli-communication-projection/docs/privacy.md:1-32` | Metadata-first routing; hosted facts; content-free telemetry; exact-original fallback | Privacy tradeoffs and fail-closed claims |
| `packages/cli-communication-projection/docs/support-matrix.md:1-26` | Dated runtime/provider/model/prompt/tier evidence; provisional status; live smoke distinction | Evidence freshness and release bar |
| `packages/cli-communication-projection/docs/runbook.md:1-29` | Build, doctor, six-runtime rehearsal, live smoke, human non-inferiority, release-ready, stop conditions | Operational complexity and promotion sequence |
| `packages/cli-communication-projection/docs/rollback.md:1-37` | Previous tarball, original-only emergency mode, digest check, offline recovery | Reversibility and rollout safety |
| `packages/cli-communication-projection/src/doctor/checks.ts:25-90,93-160,163-226,229-301,303-340` | Version, capability, endpoint, credential, privacy, and tier checks | Configuration and evidence gates |
| `packages/cli-communication-projection/src/doctor/doctor.ts:18-45` | Block/degraded/ready decision; original-only route selection; content-free report | Fail-closed behavior |
| `packages/cli-communication-projection/src/release/support-matrix.ts:29-65,67-93,96-160,163-225,228-285` | Matrix dimensions, freshness, runtime/provider/model/prompt/tier rows | Support/evidence model |
| `packages/cli-communication-projection/src/release/rollback.ts:7-27,29-135` | `OriginalOnlyEmergencyMode`, `planRollback`, immutable transcript check | Provider-free rollback claim |

## Assembly, events, and runtime ownership

| Source | Relevant surface | Used for |
|---|---|---|
| `packages/cli-communication-projection/src/contracts/event.ts:16-46,52-87` | Typed event envelope, phases, status, orders, canonical refs, payload/extensions | Deterministic skeleton seam |
| `packages/cli-communication-projection/src/core/assembler.ts:122-259` | Generation, identity, duplicate/order/bounds/terminal validation | Safe terminal assembly |
| `packages/cli-communication-projection/src/core/assembly-output.ts:25-113,145-182` | Final assistant/delta selection and exact-original terminal fallback | Canonical source and streaming boundary |
| `packages/cli-communication-projection/src/core/assembly-types.ts:78-106` | Assembly result/source types | Original/candidate separation |
| `packages/cli-communication-projection/src/runtimes/adapter.ts:82-140` | Runtime adapter normalization and canonical immutability | Runtime boundary |
| `packages/cli-communication-projection/src/runtimes/codex.ts:198-238,271-294,311-338` | Assistant/tool canonical text references and presentation path | Template limitations and judge composition search |
| `packages/cli-communication-projection/src/runtimes/matrix.ts:23-102` | Six-runtime capability matrix, evidence normalization, incompatible-major original-only | Presentation safety and rollout tiers |
| `packages/cli-communication-projection/src/runtimes/capability.ts:16-60,63-100` | Capability and degradation mapping | Safe-native fallback reasoning |
| `packages/cli-communication-projection/src/runtimes/types.ts:166-215` | Runtime presentation and degradation types | Full/safe-native ownership boundary |
| `packages/cli-communication-projection/test/runtimes/matrix.test.ts:26-129` | Eight paths, six families, six full and two safe-native; fail-closed tests | Runtime matrix confirmation |

## Fidelity, tokenization, and semantics

| Source | Relevant surface | Used for |
|---|---|---|
| `packages/cli-communication-projection/src/fidelity/dialect.ts:23-53,134-243,246-301` | Block/inline protected-range collection and no adjacent merge | Token granularity and inflation |
| `packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,117-217,396-415` | Opaque token format, local map, ordered restore, digest/length behavior | Privacy/fidelity invariants and quality burden |
| `packages/cli-communication-projection/src/fidelity/validator.ts:59-84,113-244,315-370` | Staged validation and optional required judge | Fail-closed acceptance and judge seam |
| `packages/cli-communication-projection/src/fidelity/semantics.ts:61-107,121-179` | Meaning signatures and first deterministic veto | Semantic diff scope and limitation |
| `packages/cli-communication-projection/src/fidelity/types.ts` | Protected span kinds and fidelity types | Corpus/category references |

## Prompt, provider, controls, and execution

| Source | Relevant surface | Used for |
|---|---|---|
| `packages/cli-communication-projection/src/contracts/prompt.ts:11-32` | Versioned prompt profile fields | Few-shot/profile extension boundary |
| `packages/cli-communication-projection/src/contracts/validate-policy.ts:124-221` | Prompt/profile policy validation | Contract-safe prompt changes |
| `packages/cli-communication-projection/src/contracts/projection.ts:1-33` | Projection contract/version metadata | Profile/projection evidence identity |
| `packages/cli-communication-projection/src/providers/adapters.ts:96-100` | System/user wire request composition | Minimal prompt and encoded whole-message path |
| `packages/cli-communication-projection/src/providers/controls.ts:29-116` | Fresh capability and control compilation | Model-control evidence requirement |
| `packages/cli-communication-projection/src/providers/presets.ts:43-83,171-178` | OpenCode Go/DeepSeek preset and unknown controls | No source-backed model-tier claim |
| `packages/cli-communication-projection/src/providers/types.ts:150-218` | Provider/model evidence and privacy metadata | Quality-per-cost/provider evidence design |
| `packages/cli-communication-projection/src/providers/executor.ts:102-147` | Provider execution result/candidate boundary | Missing production validator composition |
| `packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56` | Reference-like prompt profile and mappings | Missing token schema/examples and control evidence |
| `packages/cli-communication-projection/test/providers/adapters.test.ts:20-67,71-89` | Confirmed versus unknown control fixture behavior | Synthetic evidence distinction |

## Evaluation and release evidence

| Source | Relevant surface | Used for |
|---|---|---|
| `packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:12-50` | Deterministic fidelity-only release veto with judge disabled | Runtime/evaluation separation |
| `packages/cli-communication-projection/src/evaluation/proxy-judge.ts:18-84` | Masked LLM proxy scores and caller-owned transport | Provisional evidence lane, not runtime judge |
| `packages/cli-communication-projection/src/evaluation/types.ts:11-37,40-67,96-138` | Human/proxy provenance; content-free cases; pilot metrics | Evidence class and metric boundaries |
| `packages/cli-communication-projection/src/evaluation/corpus.ts:18-66` | Five synthetic content-free case categories | Corpus coverage and evidence gap |
| `packages/cli-communication-projection/src/evaluation/pilot.ts:14-70` | Injected candidate/scorer and variance-planning-only samples | Synthetic pilot limitation |
| `packages/cli-communication-projection/src/evaluation/gate.ts:83-145,216-225` | Tier-specific release gates and provisional handling | Human evidence requirement |
| `packages/cli-communication-projection/src/evaluation/report.ts:15-108` | Quality dimensions and latency/cost/rejection/fallback/timeout/degraded metrics | Net-value experiment design |
| `packages/cli-communication-projection/src/release/release-gate.ts:303-357` | Human-certifiable non-provisional release decision | Promotion bar |
| `packages/cli-communication-projection/test/release/release-gate.test.ts:42-80` | Release-gate rejection/approval cases | Evidence behavior confirmation |

## Client presentation

| Source | Relevant surface | Used for |
|---|---|---|
| `packages/cli-communication-projection/src/clients/types.ts:18-105` | Ownership, atomic replacement, append/sidecar, exact-original types | Value/adoption matrix and parity constraints |
| `packages/cli-communication-projection/src/clients/display.ts:18-74` | Atomic/append commit and original-only failure | Safe display behavior |
| `packages/cli-communication-projection/src/clients/sidecar.ts:15-56` | Original-visible sidecar path | Safe-native staged rollout |

## Lineage artifacts and probes

| Source | Relevant surface | Used for |
|---|---|---|
| `iterations/iteration-001.md` | Pipeline/quality-ceiling findings | Protection, prompt, validator baseline |
| `iterations/iteration-002.md` | Granularity/profile/control findings | Probe measurements and admissible levers |
| `iterations/iteration-003.md` | Judge/evaluation findings | Composition gap and evidence separation |
| `iterations/iteration-004.md` | Architecture findings | Structured substrate and hybrid recommendation |
| `iterations/iteration-005.md` | Value/adoption findings | Deterministic-first boundary and rollout decision |
| `prompts/iteration-001.md` through `prompts/iteration-005.md` | Iteration questions and evidence contracts | Loop traceability |
| `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl` | Reducer deltas and graph nodes | Iteration state traceability |
| `deep-research-state.jsonl` | Config plus five canonical iteration records | State-machine proof |
| `findings-registry.json` | Fifteen key findings, six ruled-out directions, one open quality question | Consolidated findings |

## Known gaps and coverage interpretation

- The package has no direct live-provider artifact for the supplied smoke, no source-backed model quality tier, no production deterministic prose renderer, and no user-outcome benchmark. These are explicit evidence gaps, not inferred failures.
- The built-in evaluation corpus is intentionally content-free and synthetic. It verifies metadata shape and protected-span expectations but cannot establish readability or net user value by itself. [SOURCE: packages/cli-communication-projection/src/evaluation/corpus.ts:18-66]
- `coverageBySources` in the lineage registry reports 46 source files across 12 source families after the fifth iteration. Coverage breadth does not substitute for the missing live, human, and user-outcome evidence.
