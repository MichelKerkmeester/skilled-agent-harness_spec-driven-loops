---
title: "Deep Research: global utilization of the sk-design styles library"
description: "Per-mode integration architecture for using the 1,290-style corpus across the sk-design hub, interface, foundations, motion, audit, and Open Design transport."
---

# Global Utilization of the sk-design Styles Library

## 1. Executive Summary

The 1,290-style library should become a **mode-owned evidence system**, not a global style chooser. Phase 001 already settled the retrieval substrate: canonical captured artifacts, a checked generation manifest, deterministic eligibility, optional same-generation lexical ranking, compact candidate cards, bounded hydration, and `CORPUS_USE_PROOF v1`. This phase should add a thin shared context/proof envelope plus six distinct consumers. It should not build a second retriever or move taste into the hub. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-145] [SOURCE: iterations/iteration-001.md:14-29]

The recommended shape is:

```text
user brief / owned system / target evidence
  -> hub intake and registry route
  -> neutral CORPUS_CONTEXT_PLAN v1
  -> selected mode requests generic capabilities
  -> phase-001 cards and generation-guarded hydration
  -> mode-owned selection, transformation, refusal, and fallback
  -> mode-specific proof and decision-only handoff
  -> optional audit comparison or Open Design transport receipt
  -> target/render/measurement verification remains authoritative
```

The authority order is fixed: **user brief and owned system > selected mode judgment > target evidence and deterministic checks > corpus reference evidence > transport output**. Corpus evidence may explain relationships, expose counterexamples, sharpen critique, and preserve provenance. It may not select a mode, prove accessibility or performance, assign severity, establish copying, authorize exact reuse, or accept transport output. [SOURCE: iterations/iteration-001.md:20-41] [SOURCE: iterations/iteration-002.md:14-26]

Recommended implementation order:

1. Shared `CORPUS_CONTEXT_PLAN v1` and common lineage/proof fields, 2-4 engineer-days after the phase-001 API.
2. Interface relational exemplars and audit comparison as the first two mode pilots, 8-12 and 6-11 days respectively.
3. Foundations relationship/compatibility graph, 10-17 days.
4. Motion polarity-aware evidence and negative baselines, 9-16 days.
5. Open Design grounding receipt and live reconciliation, 8-13 days, last because it depends on stable upstream contracts and an external daemon.

These ranges are independently testable slices and are not strictly additive because schemas, provenance validators, fixtures, and handoff plumbing overlap. [SOURCE: iterations/iteration-003.md:22-26] [SOURCE: iterations/iteration-004.md:18-24] [SOURCE: iterations/iteration-005.md:22-26] [SOURCE: iterations/iteration-006.md:24-34]

## 2. Research Question and Scope

This loop asked how the corpus should be used globally across:

- the routing-only `sk-design` hub;
- `design-interface`;
- `design-foundations`;
- `design-motion`;
- `design-audit`;
- the `design-mcp-open-design` transport.

The answer had to inspect each real contract, build on phase 001 rather than repeat it, exclude `md-generator` because phase 002 owns it, propose smart uses beyond cards/hydration, and estimate rough build cost. No implementation, corpus mutation, live Open Design call, or spec mutation occurred. [SOURCE: deep-research-strategy.md:27-40] [SOURCE: iterations/iteration-001.md:43-43]

## 3. Inherited Baseline from Phase 001

Phase 001 established the reusable substrate and safety boundary:

| Baseline capability | This phase's use |
|---|---|
| Checked, generation-bound manifest | Every consumer records the generation and refuses stale hydration. |
| Deterministic eligibility and exclusions | Modes express required facets and hard negatives before rank. |
| Optional same-generation lexical ranker | Positive-term recall aid only; never authority. |
| At most five compact candidate cards | Discovery stays context-light and does not become a full-corpus prompt. |
| Mode-owned selection | The hub and transport never choose taste. |
| Bounded mode-specific hydration | Each mode loads only the artifact/slice it can legitimately use. |
| `CORPUS_USE_PROOF v1` | Corpus influence is traceable through rationale, transformation, provenance, and target evidence. |
| One coherent anchor by default | Multi-source use is exceptional, ownership-bounded, and never raw-value averaging. |

[SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-145] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:149-191]

The corpus bundle roles remain distinct: `DESIGN.md` preserves coherent design rationale; `design-tokens.json` supports deterministic axis inspection; `source.md` carries provenance; CSS/Tailwind artifacts support explicit implementation handoff; canonical extraction JSON is diagnostic evidence. This phase consumes those roles but does not redesign them. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:37-64]

## 4. Global Integration Architecture

### Shared envelope

`CORPUS_CONTEXT_PLAN v1` is the only hub-visible integration contract. It contains neutral facts before routing and mode-owned decisions after routing:

```json
{
  "generation": "sha256:...",
  "availability": "ready|degraded|unavailable",
  "capabilities": ["coherent-reference", "color", "type", "spacing", "motion", "comparison"],
  "limits": {"cards": 5, "hydration": "mode-owned"},
  "authorityOrder": ["brief/owned-system", "mode", "target-proof", "corpus", "transport"],
  "selectedMode": "interface|foundations|motion|audit",
  "modeDecision": {
    "requestDigest": "...",
    "selectedReferences": [],
    "rejectedReferences": [],
    "fallback": "...",
    "proofRequired": []
  }
}
```

The hub may display capability, generation, fallback, authority, and proof expectations. It may not construct mode-specific facets, hydrate references, select an anchor, or declare proof complete. [SOURCE: iterations/iteration-001.md:29-41]

### Common invariants

1. Resolve mode, register, brief, owned system, and pinned values before corpus use.
2. A generation/hash mismatch refuses source influence and triggers re-query, never stale fallback.
3. `none`, `no-fit`, `unavailable`, and `no corpus authority` are valid results; the baseline mode workflow remains usable.
4. A selected source owns only named dimensions. Unknown dimensions remain target-derived.
5. Provenance proves lineage, not rights, fitness, accessibility, performance, or extraction truth.
6. Handoffs carry accepted target decisions and source lineage, not raw source payloads.
7. Target render, code, browser, and deterministic evidence remain required for ready claims.

[SOURCE: iterations/iteration-003.md:16-26] [SOURCE: iterations/iteration-005.md:16-26] [SOURCE: iterations/iteration-006.md:24-34]

## 5. Hub Integration

### Integration shape

The hub inserts corpus awareness into its existing manager cadence:

```text
five-field intake
  -> resolve smallest useful mode through mode-registry.json
  -> disclose neutral corpus capability/generation
  -> selected mode fills its request and decision
  -> visible plan names source role, fallback, and proof bar
  -> mode executes and returns proof/handoff
```

The hub does not gain a style router or a corpus-specific taste policy. A corpus cannot change `workflowMode`, the Brand/Product register, user pins, the proof bar, or the transport/judgment boundary. [SOURCE: .opencode/skills/sk-design/SKILL.md:40-71] [SOURCE: .opencode/skills/sk-design/SKILL.md:155-184] [SOURCE: iterations/iteration-001.md:20-29]

### Smart extensions

- **Capability-aware intake**: disclose whether coherent references, specific token axes, temporal evidence, or audit comparisons exist before a mode plans source use.
- **Negative-result visibility**: show `no-fit` or `unavailable` as a deliberate plan result rather than silently selecting a weak reference.
- **Cross-mode decision genealogy**: carry generation, source role, transformation, target reason, and verification owner through mode and handoff records.

### Cost

2-4 engineer-days for the envelope schema, shared fields, positive/no-fit/stale fixtures, and hub plan rendering after the phase-001 API exists. [SOURCE: iterations/iteration-001.md:31-41]

## 6. Interface Integration

### Integration shape

Use `INTERFACE_RELATIONAL_EXEMPLAR v1`, with deliberately unequal roles:

- **Anchor**: one coherent mode-selected reference; the only full `DESIGN.md` hydration.
- **Contrast**: optional bounded critique reference that sharpens one named decision; never a second identity source.
- **Rejected default**: optional record of the plausible generic direction deliberately refused.

The insertion order is: register/dials -> context manifest -> relational exemplar decision -> direction/transform work -> real-render critique -> mechanical/content preflight -> source-aware handoff. The context manifest gains generation, role IDs, influence axes, identity locks, prohibited reuse, target-driven deltas, and fallback. [SOURCE: iterations/iteration-003.md:16-24]

### Evidence fixture

Kobu and 19-86 demonstrate why the roles cannot be equal. Kobu couples warm parchment, photography-only color, a humanist/monospace hierarchy, image-led cards, and generous rhythm. 19-86 couples black/white, one hairline family, ruled ledger rows, no imagery, compact rhythm, and a giant numeral watermark. One can be an anchor and the other a bounded structural question, but combining both identities creates an unowned third style. [SOURCE: iterations/iteration-003.md:20-20]

### Smart extensions

- **Counterfactual critique**: record the likely no-corpus default and which brief-specific choices improved after grounding.
- **Relational distance budget**: per axis, record `preserve`, `transform-for-target`, or `reject` with a target reason; never collapse this to a scalar quality/distance score.
- **Controlled variation seeds**: generate up to three directions from one anchor while varying one brief-owned free axis; changing anchors is a new decision.
- **Source-aware handoff lock**: pass transformed decisions, identity locks, prohibited reuse, target proof, and source hashes to `sk-code`, not raw source prose/assets/tokens.

### Failure and fallback

Refuse source use on stale generation, missing provenance, owned-system conflict, unknown-rights exact reuse, or incoherent influence ownership. Continue with `anchor:null` and the ordinary target-derived interface workflow when no source fits. [SOURCE: iterations/iteration-003.md:22-26]

### Cost

8-12 engineer-days: 2-3 for schema/fixtures, 3-5 for context/proof/handoff adapters, and 3-4 for counterfactual, relational-distance, and controlled-variation fixtures. [SOURCE: iterations/iteration-003.md:24-26]

## 7. Foundations Integration

### Integration shape

Use four linked records:

1. `FOUNDATIONS_AXIS_SOURCE v1`: target role/register/pins/request plus coherent-anchor, bounded-synthesis, or none selection.
2. `FOUNDATIONS_AXIS_COMPATIBILITY v1`: typed axis nodes and cross-axis edges with `preserve`, `recalculate-for-target`, `target-derived`, or `incompatible` relations.
3. `RELATIONSHIP_BLUEPRINT v1`: role topology, ordering/grouping, identity locks, do-not constraints, adaptation reason, and transformation policy without a copyable source-value array.
4. `TRANSFORMATION_LEDGER` plus `FOUNDATIONS_CORPUS_PROOF/HANDOFF v1`: one source owner and target reason for every influence, with downstream checks explicitly `not-assessed` until run on target values.

[SOURCE: iterations/iteration-005.md:14-26]

### Why an axis checklist is insufficient

Kobu and 19-86 both expose color, font, typography, and spacing, but their relationships conflict. Key co-presence proves availability, not semantic compatibility. The compatibility graph must reconcile every cross-axis dependency; overlapping owners or unexplained edges fail. Exact target values are recalculated for role, register, platform, density, contrast, gamut, rhythm, and responsive requirements. [SOURCE: iterations/iteration-005.md:18-22]

### Smart extensions

- **Relationship-preserving token blueprint**: reuse role topology and constraints rather than raw values.
- **Axis compatibility graph**: make dependencies and incompatibilities reviewable before bounded synthesis.
- **Counterexample library**: fixture pairs such as Kobu/19-86 prove that structurally similar token documents can be semantically incompatible.
- **Target-context adaptation ledger**: explain every preserve/recalculate/target-derived/reject operation and verification owner.

### Failure and fallback

Refuse overlapping owners, incompatible/unexplained edges, source conflict with pins, stale generation, untraceable target values, and exact reuse without rights evidence. `selectionMode:none` continues through the ordinary foundations workflow. Corpus evidence never sets contrast, gamut, rhythm, naming, responsive, or touch checks to pass. [SOURCE: iterations/iteration-005.md:22-26]

### Cost

10-17 engineer-days: 2-4 for request/selection/refusal fixtures, 4-7 for compatibility graph/blueprint validation, and 4-6 for transformation/proof/handoff adapters. [SOURCE: iterations/iteration-005.md:26-26]

## 8. Motion Integration

### Integration shape

Motion corpus use starts **after** the restraint gate:

```text
frequency -> keyboard rule -> named purpose -> register ceiling
  -> no-motion: queryIssued=false, instant equivalent, preserved feedback
  -> eligible: polarity-aware temporal evidence query
       -> one purpose/state/material temporal owner
       -> or no eligible source and target-native motion
```

`MOTION_EVIDENCE_ELIGIBILITY v1` requires positive, non-negated temporal evidence with a purpose/pattern or state/scene match. It excludes incidental words, static aesthetic similarity, explicit prohibition, and unspecific prose before ranking. Evidence is labeled measured, declared, or inferred. The score orders already-eligible records and never overrides the gate. [SOURCE: iterations/iteration-006.md:24-30]

`MOTION_NEGATIVE_BASELINE v1` distinguishes target `no-motion` from `no corpus temporal authority`. Gate failure proves the target interaction remains instant. Empty corpus evidence only means the mode must derive target-native motion or use no source. [SOURCE: iterations/iteration-006.md:28-30]

### Evidence fixtures

- Positive but differently scoped: Active Theory, Monopo Saigon, and Amplemarket.
- Explicit counterexamples: 099 Supply and Relate prohibit requested spectacle while retaining minimal feedback.
- Incidental vocabulary: 19-86's “section transitions” does not provide motion authority.

[SOURCE: iterations/iteration-006.md:16-20] [SOURCE: iterations/iteration-006.md:30-30]

### Smart extensions

- **Purpose-first motion grammar**: retrieve feedback, orientation, continuity, perceived-performance, or earned-delight relationships, not aesthetic adjectives.
- **Interaction-state archetypes**: query state paths such as default->active or absent->present.
- **Negative motion baselines**: keep explicit no-query, no-eligible-evidence, and source-prohibition outcomes as reusable test fixtures.
- **Temporal drift check**: after target decisions exist, compare purpose, state path, cadence band, material, reduced path, and mechanism; never before the gate.

### Failure and fallback

Refuse negated/incidental evidence, stale generation, no purpose/state fit, source conflict, unknown-rights exact choreography, or corpus-based accessibility/performance claims. Fall back to target-native motion or a no-motion baseline. [SOURCE: iterations/iteration-006.md:32-34]

### Cost

9-16 engineer-days: 2-4 for schema/fixtures, 4-7 for polarity/archetype eligibility, and 3-5 for proof/handoff/drift adapters. [SOURCE: iterations/iteration-006.md:34-34]

## 9. Audit Integration

### Integration shape

Add `AUDIT_CORPUS_COMPARISON v1` as a distinct comparison lane, not another target-evidence class. A row records target, intended anchor when one is actually owned/named, comparison purpose, generation, source IDs/hashes/provenance, axis observations, relation (`aligned`, `intentional-delta`, `unexplained-drift`, `comparison-unavailable`), evidence label, and limitation. [SOURCE: iterations/iteration-002.md:16-18]

Corpus comparison may sharpen findings about intended-anchor drift, systemic token drift, anti-default prevalence, or unexplained differences. It may not supply P0-P3 severity, `/20` score, target truth, WCAG/performance evidence, copying proof, or remediation ownership. No intended anchor means contextual comparison only, never drift. [SOURCE: iterations/iteration-004.md:16-24]

### Smart extensions

- **Per-axis drift fingerprint**: a reproducible descriptive diff against an intended anchor, with no scalar quality verdict.
- **Corpus prevalence context**: show whether a pattern is common without equating common with bad or rare with good.
- **Hard-negative audit fixtures**: similarity-only severity, no-anchor drift, stale comparison, unavailable source, and unknown-rights exact reuse must fail.
- **Decision genealogy audit**: compare the target against the transformations a mode actually approved, not the raw source.

### Cost

6-11 engineer-days: 2-4 for worksheet/report schemas and fixtures, then 4-7 for per-axis fingerprint/provenance validation. [SOURCE: iterations/iteration-004.md:18-24]

## 10. Open Design Transport Integration

### Integration shape

Use `OPEN_DESIGN_GROUNDING_RECEIPT v1` as a temporal handshake around design-bearing reads and runs:

- **Pre-call**: paired mode, `skDesignGate` proof, purpose, explicit target, generation, selected source IDs/hashes/provenance, allowed influence axes, prohibited reuse, brief digest, and `noCache:true`.
- **Transport**: confirm daemon, verify live `tools/list`, revalidate generation, read design-system content live, and pass only mode-owned transformed constraints into the brief/discovery answers.
- **Return**: project/conversation/run IDs, entry file, preview URL, returned artifact hashes, live-read timestamp, and tool-surface evidence.
- **Reconciliation**: paired mode classifies influences as applied, target-modified, or rejected and attaches real target/artifact evidence before acceptance.

[SOURCE: iterations/iteration-002.md:20-24] [SOURCE: iterations/iteration-004.md:18-24]

The receipt never replaces mandatory pairing, live tool verification, mutation approval with target/rollback, multi-turn completion, live reads, or paired-mode acceptance. `awaiting_input`, zero files, missing preview/artifact inspection, changed generation, or unreconciled output remains incomplete. Raw Open Design or corpus payloads are never cached into the repository. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:123-163]

### Smart extensions

- **Generation-bound brief receipt**: make every corpus-influenced brief traceable without embedding source payloads.
- **Influence reconciliation**: compare returned output with the mode-approved influence ledger, not merely whether a run completed.
- **Transport-proof bridge**: attach transport facts to normal mode proof while keeping taste and acceptance outside the transport.

### Cost

8-13 engineer-days: 3-5 for receipt schema/offline validators and 5-8 for live read/run plumbing plus return reconciliation. [SOURCE: iterations/iteration-004.md:20-24]

## 11. Ranked Recommendations

| Rank | Strategy | Leverage | Rough cost | Dependencies | Ship decision |
|---:|---|---|---:|---|---|
| 1 | Shared `CORPUS_CONTEXT_PLAN v1`, common generation/provenance/proof fields, and no-fit/stale fixtures | Very high | 2-4 days | Phase-001 API | Ship first; enables every mode without moving taste into the hub. |
| 2 | Interface relational exemplar pilot | Very high | 8-12 days | Rank 1 + phase-001 coherent hydration | Ship early; directly improves anti-default direction and handoff. |
| 3 | Audit comparison lane and intended-anchor drift fixtures | High | 6-11 days | Rank 1 | Ship with/after interface; validates non-authoritative comparison. |
| 4 | Foundations relationship blueprint and compatibility graph | High | 10-17 days | Rank 1 + token-axis hydration | Ship after pilot schemas stabilize; highest semantic complexity. |
| 5 | Motion polarity-aware eligibility and negative baselines | Medium-high | 9-16 days | Rank 1 + temporal section metadata | Ship after shared proof patterns; sparse evidence needs hard negatives. |
| 6 | Open Design grounding receipt and reconciliation | Medium-high | 8-13 days | Ranks 1-3 + running daemon | Ship last; transport consumes settled judgment/proof contracts. |

### Out-of-the-box ideas worth preserving

1. **Corpus as falsification infrastructure**: use counterexamples, rejected defaults, incompatibility pairs, negated motion evidence, and no-anchor audit cases to prove unsafe integrations fail.
2. **Decision genealogy**: trace source -> mode-owned relationship -> target transformation -> implementation lock -> target evidence -> audit observation.
3. **Counterfactual design critique**: record the plausible median/no-corpus default and the brief-specific decisions that changed after grounding.
4. **Negative-result retrieval**: `no-fit`, `no temporal authority`, `comparison-unavailable`, and `anchor:null` are successful evidence outcomes, not errors to hide.
5. **Relational evidence over scalar scores**: use preserve/transform/reject edges, purpose/state paths, and intended-anchor relations instead of genericness, novelty, similarity, or compatibility numbers.
6. **Fixture atlas, not style gallery**: expose representative positive and negative contract fixtures to maintainers; never surface the corpus to users as pick-a-vibe presets.

[SOURCE: iterations/iteration-001.md:31-41] [SOURCE: iterations/iteration-003.md:20-26] [SOURCE: iterations/iteration-005.md:18-26] [SOURCE: iterations/iteration-006.md:26-34]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Hub-local taste policy or corpus-driven mode routing | Violates the routing-only hub and mode-owned judgment boundaries. | [SOURCE: iterations/iteration-001.md:56-61] | 1 |
| One flattened corpus consumer for every mode | Erases distinct authority, proof, fallback, and handoff contracts. | [SOURCE: iterations/iteration-001.md:20-29] | 1 |
| Equal exemplar choices / style gallery | Becomes a preset chooser and removes anchor/contrast/rejection semantics. | [SOURCE: iterations/iteration-003.md:38-43] | 3 |
| Cross-style signature composition | Produces an unowned third identity; Kobu/19-86 is the negative fixture. | [SOURCE: iterations/iteration-003.md:20-20] | 3 |
| Scalar genericness, quality, compatibility, or distance score | Cannot encode authority, target reason, evidence class, or preserve/transform/reject semantics. | [SOURCE: iterations/iteration-002.md:24-26] [SOURCE: iterations/iteration-003.md:40-43] | 2, 3 |
| Top-level token-axis co-presence as compatibility | Common JSON keys do not preserve cross-axis relationships or identity constraints. | [SOURCE: iterations/iteration-005.md:18-20] | 5 |
| Raw token averaging/interpolation or direct token-starter fill | Loses relationships and bypasses target roles, register, platform, and deterministic checks. | [SOURCE: iterations/iteration-005.md:22-26] | 5 |
| Static similarity or absent prose as a no-motion decision | Only the restraint gate and target evidence can decide no-motion. | [SOURCE: iterations/iteration-006.md:24-30] | 6 |
| Temporal vocabulary/BM25-only motion eligibility | Explicit negations and incidental words rank as false positives. | [SOURCE: iterations/iteration-006.md:26-30] | 6 |
| Corpus evidence as accessibility, performance, severity, or copying proof | These claims require target evidence, measurements, user impact, and independent proof. | [SOURCE: iterations/iteration-002.md:16-26] [SOURCE: iterations/iteration-005.md:22-24] [SOURCE: iterations/iteration-006.md:32-34] | 2, 5, 6 |
| Raw corpus/Open Design payload caching | Conflicts with no-cache/live-read requirements and expands copying exposure. | [SOURCE: iterations/iteration-001.md:56-61] [SOURCE: iterations/iteration-004.md:18-20] | 1, 4 |
| Stale-generation fallback | Breaks provenance and evidence identity; re-query/reselection is required. | [SOURCE: iterations/iteration-002.md:38-43] | 2 |
| Open Design receipt as mutation approval or acceptance | Transport remains subordinate to explicit confirmation, live evidence, and paired-mode judgment. | [SOURCE: iterations/iteration-004.md:18-24] | 4 |
| One-shot Open Design completion | Turn 1 can remain `awaiting_input` with zero files; return evidence and reconciliation are mandatory. | [SOURCE: iterations/iteration-002.md:20-26] | 2, 4 |
| Watcher/daemon or another retrieval substrate | Phase 001 measured a bounded local lifecycle and already settled retrieval; this phase needs consumers, not more infrastructure. | [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:193-255] | inherited |

## Divergence Map

The loop used default convergence mode and made no divergent Council pivots. Breadth came from six sequential focuses: global contract gaps, audit/Open Design, interface, audit/Open Design identity reconciliation, foundations, and motion. Saturated directions are the eliminated alternatives above. The remaining frontier is implementation packaging and evaluation, not a competing architecture. [SOURCE: deep-research-dashboard.md:30-44] [SOURCE: deep-research-dashboard.md:106-120]

## 12. Open Questions

All five required research questions are answered. Optional implementation/evaluation questions remain:

- Which package owns the shared schemas and validators without giving the hub mode logic?
- Which fields can be truly shared across mode proof/handoff records versus merely similarly named?
- How much cost overlap exists among common provenance, generation, fixture, and handoff infrastructure?
- What frozen mode-specific fixture set best measures behavior before implementation is promoted?
- Which styles have authoritative rights evidence beyond `unknown`, and what exact reuse classes does that evidence permit?
- How should corpus changes invalidate mode-specific hard-negative fixtures without requiring a watcher?

None blocks the architecture because all mode contracts fail safely to their ordinary target-derived workflows.

## 13. Cross-Mode Contract Matrix

| Consumer | Corpus role | Default source count | Primary output | Corpus must never override | Rough cost |
|---|---|---:|---|---|---:|
| Hub | Neutral capability/proof plan | 0 hydrated | `CORPUS_CONTEXT_PLAN v1` | Routing, register, user pins, mode judgment | 2-4d |
| Interface | Coherent critique-ground | 1 anchor; optional bounded contrast/rejected default | Relational exemplar + source-aware handoff | Brief/owned system, target render, preflight | 8-12d |
| Foundations | Relationship/token source evidence | 1 coherent; max 3 axis owners | Compatibility graph, blueprint, transformation ledger | Target roles/values, accessibility checks, extraction truth | 10-17d |
| Motion | Temporal evidence after restraint | 0 or 1 temporal owner | Eligibility, negative baseline, purpose exemplar | Restraint, reduced-motion/performance proof, target mechanism | 9-16d |
| Audit | Intended-anchor comparison/context | 0-2 comparison refs | Comparison rows and drift fingerprint | Target evidence, severity, score, WCAG/perf, fix ownership | 6-11d |
| Open Design | Provenance transport handshake | Metadata only; live reads | Grounding receipt + return reconciliation | Taste, confirmation, live tool facts, paired-mode acceptance | 8-13d |

## 14. Risks and Controls

| Risk | Control | Failure behavior |
|---|---|---|
| Style chooser / preset behavior | Unequal source roles, mode-owned selection, no user-facing gallery | Record no-fit or reject integration. |
| Generic averaging | One coherent anchor by default; exclusive source ownership and typed relational edges | Refuse synthesis or derive from target. |
| Copying under attribution | Rights/use label, prohibited reuse, transformed decision ledger, no raw payload handoff | Block exact source-specific reuse. |
| Stale corpus | Generation/hash binding on request, hydration, proof, and receipt | Re-query and supersede; never stale fallback. |
| Corpus rank becomes authority | Deterministic eligibility first; mode decides; scores explain ordering only | Ignore rank or return no selection. |
| False accessibility/performance proof | Explicit `not-assessed` states until target checks run | Block ready claim, not the ordinary workflow. |
| Similarity becomes quality/severity/copying proof | Descriptive per-axis relation plus limitation; target impact and independent evidence remain required | Context-only observation. |
| Transport authority drift | Mandatory pairing, mutation gate, live tool verification, return reconciliation | Incomplete/blocked transport result. |
| Context bloat | Five-card cap, mode-specific hydration, metadata-only transport receipt | Truncate/refuse source influence. |
| Mode contract divergence | Shared lineage fields plus mode-local schemas and fixtures | Fail validator; do not flatten semantics. |

## 15. Implementation Sequence and Cost

### Phase A: shared contract seam

Estimated: 2-4 days, plus the phase-001 retrieval implementation if not already built.

- Define common generation, source identity, provenance/use label, role, transformation, fallback, and proof-state fields.
- Implement `CORPUS_CONTEXT_PLAN v1` as a neutral envelope.
- Add shared positive, no-fit, unavailable, generation-mismatch, and unknown-rights fixtures.
- Keep mode-specific fields outside the hub.

### Phase B: two contrasting pilots

Estimated: interface 8-12 days; audit 6-11 days.

- Interface validates creative grounding, counterfactual critique, and decision-only handoff.
- Audit validates non-authoritative comparison, intended-anchor drift, and evidence labels.
- Use these pilots to stabilize common provenance/proof fields before complex composition.

### Phase C: relationship-heavy modes

Estimated: foundations 10-17 days; motion 9-16 days.

- Foundations implements typed dependency edges, relationship blueprints, transformation ledger, and downstream `not-assessed` checks.
- Motion implements restraint-first query gating, polarity-aware eligibility, purpose/state archetypes, and negative baselines.

### Phase D: transport integration

Estimated: Open Design 8-13 days.

- Add offline receipt validators first.
- Add live read/run plumbing only after the receipt and paired-mode reconciliation fixtures pass.
- Verify no-cache and multi-turn completion behavior against the live tool surface.

### Cost interpretation

Independent mode ranges total 43-73 engineer-days plus the 2-4 day shared seam if naively summed. That is an upper planning envelope, not a forecast: common schema, provenance, generation, fixture, and handoff work should overlap. Re-estimate after the shared seam and two pilots reveal actual reuse.

## 16. References

### Iteration evidence

- `iterations/iteration-001.md`: global contract gap map and hub envelope.
- `iterations/iteration-002.md`: audit comparison and Open Design receipt.
- `iterations/iteration-003.md`: interface relational exemplars.
- `iterations/iteration-004.md`: audit/Open Design identity reconciliation and aggregate costs.
- `iterations/iteration-005.md`: foundations compatibility and transformation contracts.
- `iterations/iteration-006.md`: motion eligibility, negative baselines, and handoff.
- `resource-map.md`: lineage-generated evidence inventory.

### Primary repository sources

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/shared/sk_code_handoff.md`

### Corpus fixtures

- `.opencode/skills/sk-design/styles/kobu/`
- `.opencode/skills/sk-design/styles/19-86/`
- `.opencode/skills/sk-design/styles/active-theory/`
- `.opencode/skills/sk-design/styles/monopo-saigon/`
- `.opencode/skills/sk-design/styles/amplemarket/`
- `.opencode/skills/sk-design/styles/099-supply/`
- `.opencode/skills/sk-design/styles/relate/`

## 17. Convergence Report

- Stop reason: `converged` through `all_questions_answered`.
- Iterations completed: 6 of 10 maximum.
- Minimum iterations: 3, passed.
- Questions answered: 5/5.
- Remaining required questions: 0.
- newInfoRatio history: `0.83 -> 0.92 -> 0.92 -> 0.70 -> 0.92 -> 0.93`.
- Average newInfoRatio: `0.87`.
- Last-three average: `0.85`, above the `0.05` novelty threshold; rolling novelty did not nominate STOP.
- MAD noise signal: latest novelty remained above the estimated noise floor; it did not nominate STOP.
- Question-entropy signal: 100 percent evidence-backed coverage; STOP.
- Composite low-novelty stop score: below `0.60`; the independent all-questions-answered candidate authorized convergence after legal-stop gates passed.
- Evidence: 35 reducer findings and 172 code/file source references across hub, mode, shared proof/handoff, corpus, prior-research, and transport contracts.
- Quality guards: source diversity passed; focus alignment passed; no single weak source dominated; per-mode authority/proof/fallback/cost coverage passed; explicit negative knowledge passed.
- Graph convergence: not applicable; no graph events were emitted.
- Divergent pivots: none; convergence mode was `default`.
- Non-blocking uncertainty: implementation packaging, common-field reuse, rights enrichment, and live behavior fixtures remain future validation.

[SOURCE: deep-research-dashboard.md:17-72] [SOURCE: findings-registry.json:8-170] [SOURCE: deep-research-state.jsonl]
