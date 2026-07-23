# Iteration 8: ROADMAP adoption triage and new-capability boundary

## Focus

Evaluate every Hallmark ROADMAP proposal plus the `redesign` verb against shipped sk-design surfaces. Preserve the five-mode hub, prefer argument lanes and owned references over new commands, and keep measured extraction separate from authored design-system invention.

## Findings

1. **Hallmark permits reuse, but substantial copying carries an attribution condition.** Its MIT license permits use, copying, modification, publication, and distribution, provided the copyright and permission notice accompany copies or substantial portions. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:5] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:12] The recommendations below favor clean-room adaptation. Any copied prose, table, example, or substantial cookbook content needs Hallmark's notice in third-party attribution.

2. **Do not add standalone `redesign`, `variant`, or `explain` commands.** `/interface:design` already owns `redesign` and `directions`; its variation card requires 3-5 meaningful options with axes, rationale, risk, and a recommendation, while the public artifact already includes route proof, critique, evidence, and handoff. [SOURCE: .opencode/commands/interface/design.md:13] [SOURCE: .opencode/commands/interface/design.md:57] [SOURCE: .opencode/commands/interface/design.md:71] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:21] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:25] Add `variant` only as an alias of `directions`; retain the existing redesign lane; expose explanation through existing proof fields.

3. **Brand-first authoring is the clearest genuinely new capability, but it must not enter MD-generator.** Hallmark proposes deriving palette, type, voice, imagery, and `design.md` from a brief. sk-design's MD-generator explicitly captures what exists, does not author from a brief, and forbids even partial Style Reference emission for forward authoring. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:15] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:18] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:86] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:98] Add a `brand-system` lane to `/interface:design`, supported by Foundations, emitting a distinctly named authored artifact such as `AUTHORED-DESIGN.md` plus tokens. Never call it a measured Style Reference.

4. **Theme-aware motion should be semantic, not a Hallmark theme multiplier table.** Hallmark proposes fixed per-theme duration tokens; sk-design already has measured timing bands, easing vocabulary, and named-token verification, but lacks a portable motion-character handoff. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:17] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion-strategy.md:46] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion-strategy.md:57] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion-strategy.md:103] Add `motionCharacter` (`quiet`, `snappy`, `elastic`, `static-first`) and rationale to shared vocabulary and the Foundations token starter; Motion resolves it into existing bands.

5. **Structural cookbook value is already partly present; the gap is worked, decision-bearing fingerprints.** Hallmark defines six axes and 42,000 combinations but recommends whole-page macrostructures; sk-design already requires three or more structurally distinct wireframes and meaningful variation deltas. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/structure.md:3] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/structure.md:5] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/structure.md:83] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md:21] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md:25] Add 6-8 abstract structural-fingerprint cards with region diagram, varied axes, failure mode, mobile collapse, and selection evidence; do not copy 12-20 implementation sketches.

6. **Charts are a surgical gap-fill, not a new capability.** sk-design already owns chart/question matching, baseline and encoding rules, scale semantics, small multiples, table fallbacks, responsive adaptation, and accessibility. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:25] [SOURCE: .opencode/skills/sk-design/design-foundations/references/data-viz.md:35] [SOURCE: .opencode/skills/sk-design/design-foundations/references/data-viz.md:54] [SOURCE: .opencode/skills/sk-design/design-foundations/references/data-viz.md:87] [SOURCE: .opencode/skills/sk-design/design-foundations/references/data-viz.md:113] Add explicit anti-slop checks for 3D charts, unearned rainbow palettes, and dual axes without defensible scale/relationship.

7. **Nanobanana is already covered at the design-judgment layer; provider coupling and build mutation do not belong in sk-design.** The guarded native-image branch handles image-led briefs, 1-3 directions, critique, approval, and asset inventory before code. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:9] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:101] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:103] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:107] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:109] Extend the handoff with a provider-neutral image manifest: role, prompt summary, provider/model, rights, content hash, path, crop, and aspect rules. Leave invocation, cache, ingestion, and wiring to the image tool and `sk-code`. Skip the named `Plate` theme.

8. **Multi-page coherence is a high-value missing authored contract.** Hallmark separates stable system axes from page-voice axes. sk-design extraction already classifies multi-page relationships as `unified`, `shared-foundation`, or `independent`, but Interface lacks an equally explicit invariant/delta card. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:27] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:313] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/design-boundary-detect.ts:294] Add a card to `real-ui-loop.md`: lock type/color roles, spacing, affordances, and material/divider language; vary composition, heading placement, density, and one earned signature move.

9. **Codebase study extends the existing extraction command, not the public verb set.** Hallmark wants project-path input; `/interface:design-reference` currently requires a canonical live URL, while its backend already measures multi-page boundaries and writes provenance-rich output. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:29] [SOURCE: .opencode/commands/interface/design-reference.md:20] [SOURCE: .opencode/commands/interface/design-reference.md:31] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:631] Add `--project <path>` only if the adapter can launch or identify a canonical render. Static code evidence may supplement but never masquerade as rendered measurement.

10. **Later ideas split into two small adaptations and two deferrals.** Audit already requires user-impact explanations, so add perceptual/cognitive rationale to anti-pattern records. Interface already grounds decisions in subject and justified risk, so add an emotional-outcome intake field, never an emotion preset menu. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:35] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:36] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:37] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:218] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:222] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design-principles.md:38] Defer sound/haptic until a platform and accessibility contract exists. Skip a dedicated live-preview MCP because sk-design already specifies transport-agnostic render, screenshot, critique, and revise. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:38] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:39] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:82] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:84]

## Reuse / Learning Matrix

| Hallmark asset | sk-design target mode / command / reference | Verdict | Specific concrete change | Value | Effort | Dependencies |
|---|---|---|---|---|---|---|
| `redesign` verb | Interface; `/interface:design redesign`; `redesign-intake.md` | LEARN | Keep existing lane; add no command. Preserve current contract ledger and expose structural divergence in the artifact. | High | None | Existing lane |
| `hallmark variant` | Interface; `/interface:design directions`; variation references | ADAPT | Add `variant` alias; default to three distinct directions; show named structural deltas and recommendation. | High | Low | Router metadata/tests |
| Brand-first flow | Interface + Foundations; new `brand-system` lane | INSPIRE-NEW | Emit `AUTHORED-DESIGN.md` plus tokens with origin labels; never route through MD-generator. | Very high | High | Authored schema, validator, workflow |
| Theme-aware motion tokens | Foundations + Motion; token starter/vocabulary/strategy | ADAPT | Add semantic `motionCharacter`; map to current timing/easing tiers, not named-theme multipliers. | High | Medium | Cross-mode handoff tests |
| Structural cookbook | Interface; new structural-fingerprint card asset | ADAPT | Add 6-8 abstract cards with region diagram, axes, evidence, failure, and responsive collapse. | Medium-high | Medium | Procedure registry/tests |
| Tactile-rebellion | Interface + Foundations; conditional material-imperfection guidance | INSPIRE-NEW | Permit one localized handmade cue; require legibility, restraint, and opt-out for dense/high-trust Product surfaces. | Medium | Low | Routing signal, Audit cross-link |
| Charts reference | Foundations; existing `references/data-viz.md` | ADAPT | Add explicit 3D, rainbow, and dual-axis anti-slop checks. | High | Low | Existing playbook |
| Multi-page coherence | Interface; `real-ui-loop.md`; new coherence card | ADAPT | Record locked system axes separately from page-level expressive deltas. | Very high | Low | Handoff test |
| `study` reads codebase | MD-generator; `/interface:design-reference --project` | ADAPT | Add project adapter that resolves a canonical render; label static-code evidence separately. | High | High | Launch detection, attestation, security |
| `hallmark explain` | Existing Route Proof, Critique, Evidence Ledger | SKIP | No command; ensure existing artifacts expose axis rationale if testing finds a gap. | Low | None | None |
| Negative-capability rules | Audit anti-pattern/AI-tell catalog | ADAPT | Add `perceptualRationale` or `cognitiveRationale` to applicable tells. | High | Low-medium | Registry parity checks |
| Emotion-first prompting | Interface; `brief-to-dials.md` | LEARN | Ask desired audience feeling/confidence posture; translate into grounded decisions, not presets. | Medium | Low | Intake tests |
| Sound + haptic policy | Motion | SKIP | Defer pending concrete platform need, support matrix, and accessibility research. | Low now | Medium-high | Platform research |
| Live preview MCP | Existing real-UI loop and render transports | SKIP | Keep render -> check -> revise; improve adapters only from observed failures. | Medium | High | Empirical gap evidence |
| Nanobanana hook | Guarded native-image branch + `sk-code` handoff | ADAPT | Add provider-neutral image manifest with provenance, rights, hash, path, crop, and role. | High | Medium | Image tool, asset pipeline |
| `Plate` image-led theme | Styles corpus + Interface grounding | SKIP | Retrieve image-led evidence and derive a brief-specific direction; no named theme/preset. | Low | Medium | None |

## Ranked Adoption Order

1. Multi-page coherence card — very high value, low effort.
2. `variant` alias plus structural-delta output — high value, low effort.
3. Data-viz anti-slop checks — high value, low effort.
4. Negative-capability rationale field — high value, low-medium effort.
5. Semantic motion-character handoff — high value, medium effort.
6. Provider-neutral image manifest — high value, medium effort.
7. Emotional-outcome intake — medium value, low effort.
8. Structural-fingerprint cards — medium-high value, medium effort.
9. Authored brand-system lane — very high value, high effort and a new artifact contract.
10. Project-path extraction adapter — high value, high effort and security-sensitive.
11. Controlled-imperfection guidance — medium value, low effort but trend-sensitive.

## Phased Adoption Plan

### Phase A — surgical contract gaps

- Add multi-page invariants/deltas, `variant` alias, data-viz anti-slop checks, rationale fields, and emotional-outcome intake.

### Phase B — cross-mode handoffs

- Add semantic motion character, provider-neutral image manifest, structural-fingerprint cards, and bounded controlled-imperfection guidance.

### Phase C — authored capability

- Design the `brand-system` Interface lane and distinct authored schema; add origin labels, validation, overwrite policy, and tests proving non-equivalence with measured Style Reference `DESIGN.md`.

### Phase D — extraction source expansion

- Prototype `/interface:design-reference --project <path>` behind source attestation; require a live render for measured values and add local-launch, multi-route, security, and provenance fixtures.

## Ruled Out

- New standalone redesign, variant, study, or explain commands.
- Copying named themes, `Plate`, motion multipliers, or cookbook HTML/CSS sketches.
- A Nanobanana-specific integration inside sk-design.
- A new live-preview MCP without observed transport failures.
- Sound/haptic guidance without a platform contract.

## Dead Ends

- Treating every Hallmark ROADMAP label as a sk-design gap failed: variants, charts, image-led direction, extraction, redesign, rationale artifacts, and render critique already exist under different names.
- Treating `design.md` as one universal contract failed: measured extraction and brief-authored invention require distinct artifacts.

## Edge Cases

- Ambiguous input: “every ROADMAP idea” includes all Now, Next, and Later items, nested `Plate`, plus the separately requested redesign decision.
- Contradictory evidence: none; Hallmark describes its own gaps, not necessarily sk-design's.
- Missing dependencies: none required for architecture triage.
- Partial success: none; every item has target, verdict, change, value, effort, and dependencies.

## Sources Consulted

- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1-20`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:1-39`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/structure.md:1-160`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:1-230`
- `.opencode/commands/interface/design.md:13-86`
- `.opencode/commands/interface/design-reference.md:13-80`
- `.opencode/skills/sk-design/design-interface/SKILL.md:20-115`
- `.opencode/skills/sk-design/design-interface/procedures/variation-set.md:13-44`
- `.opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md:13-43`
- `.opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md:13-70`
- `.opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:15-90`
- `.opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:80-130`
- `.opencode/skills/sk-design/design-interface/references/design-process/design-principles.md:15-100`
- `.opencode/skills/sk-design/design-foundations/references/data-viz.md:14-134`
- `.opencode/skills/sk-design/design-motion/references/motion-strategy.md:14-105`
- `.opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:16-111`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:309-324`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/design-boundary-detect.ts:243-303`
- `.opencode/skills/sk-design/shared/design-token-vocabulary.md:14-97`

## Assessment

- New information ratio: 0.79
- Questions addressed: roadmap/new-capability boundary and adoption order.
- Questions answered: complete ROADMAP triage plus redesign/variant command decisions.

## Reflection

- What worked and why: Exact command/reference comparison separated true gaps from Hallmark-only gaps.
- What did not work and why: Filename search alone overstated novelty because several capabilities use different names.
- What I would do differently: Synthesis should distinguish new user-visible capability from new supporting contract; only brand-system authoring is the former here.

## Recommended Next Focus

Complete the recursive asset-matrix coverage audit, then normalize verdicts, licensing flags, duplicates, and phased ordering for synthesis.
