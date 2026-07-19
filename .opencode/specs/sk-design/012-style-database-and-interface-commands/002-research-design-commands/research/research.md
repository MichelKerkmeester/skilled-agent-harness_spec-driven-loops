---
title: "Deep Research: Interface Creation Commands"
description: "Evidence-backed command templates for five interface-design workflows that preserve sk-design mode authority."
---

# Interface Creation Commands

## 1. Executive Summary

The current `/design:*` commands route correctly but expose too little of the creation process. Their owned YAML workflows already contain real mode choreography; the user-facing wrappers and presentation contracts do not turn an underspecified request into a resolved creative brief, evidence-grounded plan, visible build sequence, qualified proof, and accepted implementation handoff. Replacing the mode workflows would discard useful doctrine. The correct change is to add a richer command-level creation scaffold while keeping `sk-design` as design authority. [SOURCE: iterations/iteration-001.md:11-18]

The recommended public surface is:

| Canonical command | Stable internal mode | User job |
|---|---|---|
| `/interface:design` | `interface` | Create or reshape an end-to-end interface direction |
| `/interface:foundations` | `foundations` | Create the static visual system and token/layout scaffold |
| `/interface:motion` | `motion` | Create temporal behavior, choreography, and reduced-motion parity |
| `/interface:audit` | `audit` | Diagnose, specify bounded remediation, and re-verify |
| `/interface:design-reference` | `md-generator` | Extract a provenance-rich validated `DESIGN.md` from a live source |

Each command should instantiate one shared lifecycle: `Route -> Context Manifest -> Progressive Brief -> Grounding -> Mode Plan -> Creative/Diagnostic Work -> Critique/Revision -> Proof -> Handoff`. Commands own public choreography; modes own judgment; transports own retrieval/render/extraction; `sk-code` owns application-code mutation and stack verification. Existing `/design:*` commands should remain as tested compatibility aliases during an additive migration. [SOURCE: iterations/iteration-006.md:11-17] [SOURCE: iterations/iteration-015.md:8-23] [SOURCE: iterations/iteration-017.md:8-25]

## 2. Research Question And Scope

The research answered five required questions:

1. What concrete creation work is absent from each current router, presentation asset, and workflow?
2. Which reusable prompt structures appear in Anthropic's frontend-design skill, Open Design, and Aura skills?
3. What exact `/interface:*` names and user jobs form the smallest coherent surface?
4. What brief, exemplar, build-flow, output, and verification scaffold should each command provide?
5. How should commands hand off to `sk-design` modes without duplicating taste or doctrine?

The loop ran exactly 20 evidence-bearing iterations under `stopPolicy=max-iterations`. It read the five wrappers, presentation assets, owned workflows, `sk-design` hub/mode/reference contracts, handoff schema, Anthropic's frontend-design skill, Open Design documentation, and Aura's shipped skill metadata. It produced recommendations only; implementation, command renames, packet-level spec synchronization, and memory-save writes were outside this lineage. [SOURCE: deep-research-config.json] [SOURCE: deep-research-strategy.md:1-25]

## 3. Current-State Diagnosis

The wrappers are not broken. Each selects one mode, resolves `:auto|:confirm`, supplies sibling discriminators, and delegates to an owned workflow. The workflows are also not empty: interface already performs grounding, a token-system plan, anti-default critique, build, and self-critique; foundations and md-generator contain similarly substantive flows. [SOURCE: iterations/iteration-001.md:11-15]

The missing layer is user-facing creation scaffolding:

- intake is optimized for routing rather than audience, user job, content/data, constraints, preserve/change boundaries, owned systems, references, fidelity, and acceptance;
- useful mode stages are hidden rather than previewed;
- exemplar selection and provenance are not a visible contract;
- assumption and clarification behavior is unclear;
- outputs do not expose a consistent evidence/proof vocabulary;
- accepted design decisions do not visibly cross into the existing `sk-code` handoff.

[SOURCE: iterations/iteration-002.md:11-15]

The implementation should therefore preserve thin authority boundaries while making each command a creation-template entrypoint. “Thin” should mean no duplicated judgment, not no useful user workflow.

## 4. Transferable External Patterns

### Anthropic frontend-design

The reusable structure is a creative contract with quality stakes, a bounded subject/audience/job assumption for thin briefs, one justified direction, a compact token/layout/signature plan, anti-default critique, revision, build, and self-critique. The local interface mode already vendors and expands the judgment doctrine, so commands should expose this sequence rather than copy its style rules. [SOURCE: https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md] [SOURCE: iterations/iteration-003.md:11-16]

### Open Design

Open Design demonstrates that creation can be multi-turn: discovery first, build after clarification, real-render inspection, then targeted one-change revisions. It also enforces the correct authority split: `sk-design` decides direction before the transport realizes it. Open Design is optional; its system library must not become a style menu. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:127-163] [SOURCE: iterations/iteration-004.md:11-16]

### Aura

Aura treats skills as reusable, source-linked workflow packages and recognizes process-specific categories such as layout critique, responsive QA, animation review, accessibility, polish, and design-system alignment. Its heterogeneous references support a normalized evidence record, but not copying exemplar bodies or exposing a marketplace-style aesthetic chooser. [SOURCE: https://aura.build/assets/Skills-DW2PxyfC.js] [SOURCE: https://aura.build/llms.txt] [SOURCE: iterations/iteration-005.md:11-16]

## 5. Public Namespace Decision

Five commands are the smallest coherent surface because the registry exposes five distinct user intents and proof contracts. Audit belongs in the namespace because `/interface` represents the complete interface lifecycle, not generation alone. `design-reference` accurately names source-faithful extraction; `design-md-creation` would overstate authorship and obscure provenance. [SOURCE: .opencode/skills/sk-design/mode-registry.json] [SOURCE: iterations/iteration-006.md:11-17]

Public names must not rename internal workflow IDs. This separates discoverable user vocabulary from stable mode identity:

```text
/interface:design           -> workflowMode=interface
/interface:foundations      -> workflowMode=foundations
/interface:motion           -> workflowMode=motion
/interface:audit            -> workflowMode=audit
/interface:design-reference -> workflowMode=md-generator
```

## 6. Shared Creation Contract

### Nine stages

1. **Route Proof:** identify canonical command, selected stable mode, optional supporting mode, and proof environment.
2. **Context Manifest:** load the target, owned system, real content/data, constraints, existing artifacts, and build/runtime context.
3. **Progressive Brief:** resolve facts, record bounded assumptions, and bundle only material confirmation questions.
4. **Grounding:** select one decision-changing exemplar/control or record explicit `no-fit`.
5. **Mode Plan:** load one registry mode and only its required references/procedures.
6. **Creative/Diagnostic Work:** generate the mode-specific plan or findings before implementation.
7. **Critique/Revision:** test against the brief and one named criterion; revise narrowly.
8. **Proof:** run deterministic and optional runtime gates with typed evidence levels.
9. **Deliver/Handoff:** return visible outputs and emit the accepted `sk-code` envelope only when implementation is requested.

[SOURCE: iterations/iteration-007.md:11-17] [SOURCE: iterations/iteration-018.md:8-20]

### Shared context envelope

```json
{
  "command": "interface:design",
  "workflowMode": "interface",
  "request": "...",
  "resolvedBrief": {},
  "assumptionLedger": [],
  "contextManifest": {},
  "groundingRecord": {},
  "constraints": [],
  "stage": "plan",
  "acceptedDecisions": [],
  "proofPlan": [],
  "mutationBoundary": "advisory|approved-handoff|artifact-write",
  "outputTarget": "..."
}
```

Each stage appends evidence; no downstream layer silently reinterprets accepted decisions. [SOURCE: iterations/iteration-015.md:8-23]

### Common visible output

Every command returns `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact`, `Critique or Validation`, `Evidence Ledger`, and `Next Action/Handoff`. Command-specific labels refine these blocks but do not omit them. [SOURCE: iterations/iteration-018.md:8-20]

## 7. Five Command Templates

### `/interface:design`

Resolve target, subject, audience, one job, Brand/Product register, pinned axes, owned system/components, real content/data, preserve constraints, fidelity, output surface, and proof bar. Ground in the owned system first, then at most one brief-fit exemplar and one contrast. Route to `interface`; use the ordered foundations build bundle when producing a UI. Create a compact token/layout/signature direction, critique it against the brief and defaults, optionally render and inspect it, then hand off accepted values. [SOURCE: iterations/iteration-008.md]

```text
Create or reshape {target}. Resolve the brief and bounded assumptions; ground one
decision in owned or subject-fit evidence; load workflowMode=interface; produce and
critique a brief-specific token/layout/signature plan before build; inspect any real
render; run interface proof; return the common blocks and accepted handoff.
```

### `/interface:foundations`

Resolve register, visual problem, density, existing tokens, accessibility target, viewport/theme matrix, preserve constraints, and output. Classify axes and route dynamic behavior or measured browser diagnosis elsewhere. Build only applicable primitive/semantic/component tokens, type roles, spacing rhythm, grid/measure, hierarchy, and responsive/theme deltas. Distinguish authored direction from measured evidence. [SOURCE: iterations/iteration-009.md]

```text
Create static foundations for {target}; classify axes; ground an owned precedent or
one named static principle; load workflowMode=foundations; produce a semantic token,
type, and layout scaffold tied to real content; validate applicable static gates;
label the runtime evidence ceiling; return the common blocks and accepted handoff.
```

### `/interface:motion`

Resolve trigger, intent, before/after state, affected elements, interruption/reversal, runtime, performance budget, material, accessibility policy, and proof surface. Design behavior and mechanism before duration/easing. Return a choreography table, interruption model, semantic reduced-motion equivalent, and runtime evidence when built. [SOURCE: iterations/iteration-010.md]

```text
Create motion for {transition}; reject behavior with no state or attention purpose;
ground one behavior-fit exemplar when available; load workflowMode=motion; define the
temporal narrative, interruption/reversal, and reduced-motion parity before timings;
prototype/inspect when possible; return typed proof and accepted handoff.
```

### `/interface:audit`

Resolve target state, user journeys, viewports, constraints, baseline, axes, severity policy, mutation boundary, and proof environment. Audit is evidence-first: reproduce observations, label severity/confidence, cluster root causes, create a bounded remediation brief, hand accepted fixes to `sk-code`, and re-run matched scenarios. No baseline means no improvement claim. [SOURCE: iterations/iteration-011.md]

```text
Audit and harden {target}; declare the evidence ceiling; load workflowMode=audit and
the needed measurement transport; capture reproducible evidence; prioritize causes;
create bounded remediation acceptance criteria; mutate only through an approved
sk-code handoff; re-test the same scenarios and report an evidence-qualified verdict.
```

### `/interface:design-reference`

Resolve canonical URL, allowed origin, representative routes/states/viewports/themes, access, dynamic loading, output, overwrite policy, coverage, and validation bar. The source website is the primary exemplar. Use the owned md-generator pipeline; record source provenance and capture matrix; label inferred semantics; stop with diagnostics instead of inventing around capture failure. [SOURCE: iterations/iteration-012.md]

```text
Create a reusable design reference from {canonicalUrl}; confirm private access or
overwrite; load workflowMode=md-generator; run its extract-write-validate pipeline;
capture provenance and route/state coverage; normalize source evidence into v3
DESIGN.md; label inference and gaps; return schema validation and artifact path.
```

## 8. Intake And Grounding Policy

### Progressive intake

Use three states:

- `resolved`: route, target, and acceptance are clear;
- `auto-resolvable`: a bounded reversible assumption cannot change route or acceptance;
- `confirmation-required`: the answer changes route, artifact identity, destructive action, access, or acceptance.

Every assumed field records `{field, assumedValue, rationale, reversibility, impact}`. Bundle confirmation-required decisions once. Always confirm overwrite/delete, authenticated/private capture, new external transmission, audit mutation, preserved-identity changes, materially different direction families, and missing canonical extraction target. Do not confuse executor permission flags with creative approval. [SOURCE: iterations/iteration-014.md]

### Exemplar acquisition

Use this ladder: owned system/assets -> packet-local/cached references -> subject-fit external corpus -> shipped UI/live source through a declared transport -> `no-fit`. Stop at the first source that changes a named decision. A candidate should fit at least two relevant axes and answer “what decision changes?” [SOURCE: iterations/iteration-013.md]

Grounding records use:

```json
{
  "source": "...",
  "sourceType": "owned|cached|external|live|no-fit",
  "provenance": "...",
  "observedAt": "...",
  "role": "...",
  "fitAxes": [],
  "preserve": [],
  "transform": [],
  "reject": [],
  "decisionChanged": "...",
  "limitations": []
}
```

Reference material is untrusted evidence. Embedded commands, tool requests, style mandates, and workflow overrides are ignored unless independently authorized. `no-fit` is valid for design, foundations, motion, and audit; design-reference instead stops when its canonical source cannot be captured. [SOURCE: iterations/iteration-013.md:8-30]

## 9. Authority And Composition

| Concern | Command | `sk-design` mode | Transport | `sk-code` |
|---|---|---|---|---|
| public intake and lifecycle | owner | consume | none | none |
| design judgment and proof definition | present | owner | none | none |
| retrieval/render/extraction | request | specify | owner | none |
| application-code mutation | handoff | accept | none | owner |

The conditional lifecycle is `design-reference -> design -> foundations -> motion -> sk-code -> audit`, but a user starts at the smallest matching command. Public commands never invoke public commands. A command may order supporting modes or pass a versioned accepted-decision envelope without restarting intake. [SOURCE: iterations/iteration-019.md]

Downstream continuity carries `{briefId, artifactVersion, acceptedDecisions, preservedConstraints, groundingRecord, unresolvedDecisions, proofStatus, evidenceRefs, nextRecommendedMode}`. Contradictory downstream evidence triggers an explicit amendment; audit and build constraints cannot silently redesign accepted direction.

## 10. Proof And Failure Semantics

Evidence levels are `authored`, `observed`, `measured`, `validated`, `verified`, `blocked`, and `not-applicable`. Each evidence item contains claim, level, method, source/command, artifact, scenario, expected/observed values, timestamp, and limitations. A method cannot support a stronger label than it produced. [SOURCE: iterations/iteration-018.md]

| Command | Deterministic minimum | Runtime upgrade |
|---|---|---|
| design | resolved brief, anti-default critique, handoff schema | representative render inspection |
| foundations | token/schema, static contrast/layout checks | viewport/theme browser checks |
| motion | state/choreography/reduced-motion contract | interaction and frame-quality scenarios |
| audit | evidence ledger, severity/confidence | matched baseline/re-test delta |
| design-reference | schema validation, provenance | sampled visual coverage |

Degrade from rendered/measured proof to static/artifact proof to advisory direction with an explicit ceiling. Hard-stop only for destructive consent, private access, contradictory accepted constraints, missing canonical extraction source, or inability to meet a user-declared mandatory acceptance test. One failed criterion triggers one targeted revision, not a broad aesthetic reset. [SOURCE: iterations/iteration-016.md]

## 11. Ranked Recommendations

| Rank | Recommendation | Why |
|---:|---|---|
| 1 | Add the five canonical `/interface:*` creation templates | Fixes the visible creation gap while preserving stable mode authority |
| 2 | Define one shared creation-contract reference | Centralizes lifecycle, envelope, intake, grounding, proof labels, and handoff without copying taste |
| 3 | Keep internal workflow modes unchanged | Avoids registry and mode-contract churn |
| 4 | Roll out additive `/design:*` compatibility aliases | Preserves shipped consumers and enables measured deprecation |
| 5 | Add static contract and adversarial scenario tests | Makes route, output, mutation, trust, and evidence boundaries enforceable |
| 6 | Add runtime/render tests only where transports exist | Preserves honest degradation and avoids making optional tools command authority |

Implementation should begin with the shared contract and one broad `/interface:design` fixture, then specialize foundations, motion, audit, and design-reference. Alias conversion follows canonical route tests, not before. [SOURCE: iterations/iteration-020.md]

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Delete/rebuild owned YAML workflows | Existing assets already contain useful creation choreography | Wrapper-plus-asset baseline | 1 |
| Claim current commands contain no generative logic | True only at wrapper level; false across owned assets | Workflow reads | 1 |
| Mandatory eleven-field/exhaustive brief | Adds friction for observable or reversible details | Progressive intake analysis | 2, 14 |
| Public `/interface:brief` | Creates an extra artifact and manual handoff without a distinct user job | Shared intake analysis | 2 |
| Copy Anthropic or mode doctrine into commands | Forks authority and creates drift | Upstream/local comparison | 3, 7, 15 |
| Command-owned palettes, fonts, layouts, or fixed styles | Turns orchestration into taste policy | Authority boundary | 3, 8 |
| Require Open Design or let transport choose direction | Optional realization must not become design authority | Open Design contract | 4, 15 |
| Surface a style/system library as an aesthetic menu | Exemplars need a decision-changing role, not vibe browsing | Open Design/Aura analysis | 4, 5, 13 |
| Treat file creation as completion | Creation requires inspection and claim-qualified proof | Real-UI lifecycle | 4, 18 |
| Store exemplar bodies or execute embedded instructions | Causes staleness, copying, and prompt-injection risk | Aura/provenance/trust analysis | 5, 13 |
| One mega-command or redundant `design-*` child names | Five distinct jobs exist; namespace already supplies context | Registry and naming analysis | 6 |
| `/interface:design-md-creation` | Hides source-faithful extraction and provenance | md-generator behavior | 6, 12 |
| Universal `verified=true` or evidence-free completion | Different claims require different methods and ceilings | Proof contract | 7, 11, 18 |
| Fail when no exemplar fits or require mood-board breadth | Weak references are worse than auditable no-fit | Grounding contract | 7, 13 |
| Auto-build ambiguous high-fidelity direction | Direction families can materially change accepted output | Design template/intake policy | 8, 14 |
| Foundations as motion/browser catch-all or context-free token dump | Violates static-authoring boundary and loses brief linkage | Foundations template | 9 |
| Timing/easing before behavior or zero-duration reduced motion | Produces decorative motion and loses semantic parity | Motion template | 10 |
| Audit as subjective redesign or improvement without matched baseline | Audit authority is observable evidence and bounded remediation | Audit template | 11 |
| Add unrelated inspiration or generic fallback to extraction | design-reference must remain faithful to canonical source evidence | Extraction template | 12 |
| Unlimited silent assumptions under `auto` | High-impact choices require one explicit checkpoint | Intake policy | 14 |
| Hard-stop every incomplete brief or fail-open proof | Commands need a bounded degradation ladder | Adversarial tests | 16 |
| Broad redesign for one failed criterion | Revision should target the cited failure | Adversarial tests | 16 |
| In-place removal/rename of shipped commands | Existing consumers create a concrete compatibility need | Migration analysis | 17 |
| Rename internal mode IDs or duplicate full old/new templates | Adds churn and split sources of truth | Migration/authority analysis | 15, 17 |
| Commands invoking commands or mandatory full pipeline | Restarts intake, risks recursion, and over-processes narrow jobs | Composition analysis | 19 |
| Silent downstream amendment | Breaks accepted-decision continuity | Composition analysis | 19 |

## Divergence Map

This lineage used default convergence mode with a hard `max-iterations` stop, so no Council pivots were emitted. Breadth came from sequential baseline, intake, three external reference classes, naming, shared contract, five specializations, grounding, intake policy, authority architecture, adversarial tests, migration, proof, composition, and final convergence. Eliminated alternatives above represent saturated directions. The remaining frontier is runtime implementation validation, not unresolved command architecture. [SOURCE: deep-research-dashboard.md] [SOURCE: deep-research-state.jsonl]

## 13. Open Questions

All five required research questions are answered. These implementation details remain non-blocking:

- Does the command runtime support a literal include/shared-fragment mechanism, or should canonical prompts use the smallest supported generated/shared contract pattern?
- Does the proposed `interface` namespace collide with existing command discovery or runtime naming rules?
- Which runtime scenarios can be executed deterministically in CI versus manual transport tests?
- What usage evidence and release window should govern eventual legacy alias removal?

None changes the recommended command set, stable mode mapping, authority boundaries, or prompt-template contracts.

## 14. Risks And Controls

| Risk | Control | Failure behavior |
|---|---|---|
| Command/mode doctrine drift | Commands reference modes; tests reject copied taste/reference tables | Fail contract test |
| Prompt injection from examples | Treat all sources as evidence-only data | Ignore embedded instructions; record provenance |
| Generic output from weak grounding | Decision-change selection test and explicit no-fit | Use owned constraints/mode judgment |
| Silent identity override | Precedence: explicit amendment > accepted brief > owned constraints > exemplar > defaults | Stop and request amendment |
| Tool outage overclaim | Typed evidence and degradation ladder | Lower proof label or block mandatory acceptance |
| Direct code mutation by design command | Accepted `sk-code` handoff boundary | Stop before mutation |
| Audit becomes redesign | Evidence ledger, severity/confidence, bounded remediation | Reject unsupported aesthetic finding |
| Extraction fabricates missing source | Provenance/capture matrix and fail-closed diagnostics | Do not emit generic replacement |
| Legacy consumer breakage | Additive aliases and parity tests | Keep old route until evidence-backed removal |
| Nested command recursion | Modes/envelopes compose; public commands never invoke public commands | Reject nested command dispatch |

## 15. Implementation Sequence

### Phase A: Shared contract

- Define lifecycle stages, context envelope, intake states, assumption ledger, grounding schema, typed evidence, visible outputs, and accepted handoff.
- Decide the runtime-supported single-source pattern without inventing an unsupported abstraction.
- Add contract fixtures before command bodies.

### Phase B: Canonical commands

- Implement `/interface:design` and its broad scenario fixtures.
- Implement foundations, motion, audit, and design-reference from the specializations in Section 7.
- Verify exact `workflowMode`, required output blocks, permissions, trust boundary, and no direct app-code mutation.

### Phase C: Compatibility and proof

- Convert current `/design:*` bodies to thin canonical aliases.
- Add argument/output/permission/handoff parity tests.
- Add the adversarial matrix from iteration 16.
- Add representative render/browser/extraction scenarios where the environment supports them.

### Phase D: Discovery and deprecation

- Update command discovery and examples atomically.
- Record alias use when telemetry exists.
- Propose removal only in a separately approved breaking-change packet with usage evidence.

## 16. References

### Iteration evidence

- `iterations/iteration-001.md` through `iteration-007.md`: baseline, intake, external patterns, naming, and shared contract.
- `iterations/iteration-008.md` through `iteration-012.md`: five command-specific templates.
- `iterations/iteration-013.md` through `iteration-015.md`: grounding, intake, and authority architecture.
- `iterations/iteration-016.md` through `iteration-020.md`: adversarial behavior, migration, proof, composition, and final convergence.

### Primary repository sources

- `.opencode/commands/design/{interface,foundations,motion,audit,md-generator}.md`
- `.opencode/commands/design/assets/design-*-{auto,confirm}.yaml`
- `.opencode/commands/design/assets/design-*-presentation.txt`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-{interface,foundations,motion,audit,md-generator}/SKILL.md`
- `.opencode/skills/sk-design/shared/context-loading-contract.md`
- `.opencode/skills/sk-design/shared/sk-code-handoff.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/brief-to-dials.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`

### External sources

- `https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md`
- `https://www.aura.build/skills`
- `https://aura.build/llms.txt`
- `https://aura.build/assets/Skills-DW2PxyfC.js`
- `https://aura.build/assets/githubUtils-zKYT_cu2.js`

See `resource-map.md` for the reducer emission record. It reports zero structured references because these lineage deltas recorded source names rather than resource-map path entries; the cited iteration narratives remain the evidence index.

## 17. Convergence Report

- Stop reason: `maxIterationsReached` under frozen `stopPolicy=max-iterations`.
- Total iterations: 20 of exactly 20 required.
- Minimum iterations: 3, passed.
- Questions answered: 5/5.
- Remaining required questions: 0.
- newInfoRatio trend: `1.00 -> 0.78 -> 0.84 -> 0.82 -> 0.76 -> 0.72 -> 0.68 -> 0.62 -> 0.57 -> 0.55 -> 0.53 -> 0.58 -> 0.49 -> 0.46 -> 0.44 -> 0.41 -> 0.39 -> 0.43 -> 0.37 -> 0.24`.
- Convergence threshold: 0.05, telemetry-only before the hard cap.
- Last three iterations: proof/output contract (0.43), cross-command composition (0.37), final convergence (0.24).
- Mechanical iteration gate: all 20 narratives, route-proof records, and deltas present.
- Reducer state before terminal event: 20 completed, zero corruption, zero open questions.
- Divergent pivots: none; breadth was produced by the frozen sequential research plan.
- Residual uncertainty: implementation packaging, namespace collision, runtime fixture availability, and alias removal timing; none blocks the architecture.

[SOURCE: deep-research-dashboard.md] [SOURCE: findings-registry.json] [SOURCE: deep-research-state.jsonl]
