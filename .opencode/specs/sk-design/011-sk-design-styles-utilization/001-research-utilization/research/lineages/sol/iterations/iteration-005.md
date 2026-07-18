# Iteration 5: Operational Anti-Slop Proof Gate

## Focus

Define and attempt to falsify an operational anti-slop gate for corpus-assisted design. The gate must preserve one named thesis and a content-addressed source fingerprint, subordinate corpus evidence to the user and target, expose every transformation and synthesis owner, prevent copying, averaging, and trope accumulation, and fit the existing sk-design context/proof contract. The narrow interpretation is proof of disciplined corpus use; visual-quality scoring remains with the existing modes and audit contract.

## Actions Taken

1. Re-read the lineage config, state, strategy, registry, dispatch prompt, and prior consumption contract before using the strategy's `NEXT FOCUS`.
2. Located current hub/mode rules for anti-slop, register-first context, proof, evidence labels, mode authority, and direct fallback.
3. Reused the contrasting Kobu and 19–86 evidence as a coherent-source test fixture rather than re-measuring the corpus.
4. Defined `CORPUS_USE_PROOF v1`, then challenged it with a token-averaging scenario and a superficially distinctive trope-stack scenario.

## Operational Gate: `CORPUS_USE_PROOF v1`

The card is required whenever a retrieved corpus artifact influences a design decision. Its verdict is binary: `PASS` permits a corpus-informed ready/proof claim; `FAIL` blocks that claim and invokes the row's fallback. This extends rather than replaces the existing context manifest, register/dials, interface preflight, and audit evidence fields. The shared contract already blocks design decisions before required context is named and blocks ready/audit claims when their proof is absent. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:20-28] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:44-65] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:266-281]

| Gate row | Required evidence | Deterministic pass rule | Failure / fallback |
|---|---|---|---|
| **1. Authority** | public mode; target artifact/evidence; user-owned system and pins; `REGISTER`, `WHY`, `DIALS`; applicable mode proof bar | `PASS` only when every corpus-derived decision is subordinate to those fields and no rank/result silently changes mode, register, user pin, measured extraction, or observed target truth | `FAIL`; remove the conflicting corpus decision and use the user/target or mode-native evidence |
| **2. Selection rationale** | task requirement; considered candidate IDs; selected anchor ID; why it fits; rejected alternatives; evidence sources and validation plan | `PASS` when `ONE` is the default and the chosen anchor answers a named requirement rather than merely ranking highly; options and trade-offs are non-placeholder | `FAIL`; return to candidate cards or no-corpus mode. This aligns with the existing decision-rationale proof shape. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:196-214] |
| **3. Coherent-source fingerprint** | anchor style ID; corpus generation; SHA-256 for hydrated `DESIGN.md`; `source.md` URL/capture timestamp/license-known state; one-sentence thesis; 3–5 identity locks; explicit `Do not` constraints | `PASS` when one content-addressed anchor owns composition, imagery/signature motif, component grammar, and geometry/elevation, and the output does not contradict its declared locks without an explicit target-driven delta | `FAIL`; rehydrate one complete anchor or proceed without corpus grounding. Kobu demonstrates why the thesis and prohibitions must travel together. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:6-8] [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:164-173] |
| **4. Transformation delta** | one row per applied decision: output axis, source owner, source anchor, source relationship/rationale, transformed result, explicit delta, target reason | `PASS` when every corpus influence has exactly one owner and a reviewable delta; no unlogged import, interpolation, mean/median, or blended raw token is present | `FAIL`; derive values from the target/brief or select one source owner. The proof contract already requires evidence sources, trade-offs, validation, and source proofs for direction-setting. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:196-214] |
| **5. Bounded synthesis** | source ledger; requested axes; one owner per axis; mode-specific source count | `PASS` only within the established caps: global maximum 3 and lower mode caps prevail; only color/surface semantics, typography roles, spacing/layout rhythm, and a separate temporal owner are detachable; identity locks remain with one anchor | `FAIL`; collapse to `ONE`, drop the unsupported axis, or use mode-native evidence. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:27-36] |
| **6. Provenance and anti-copy** | provenance row for every owner; use label `inspiration`, `comparison`, `user-owned reuse`, or `rights-verified reuse`; copied strings/assets/exact source-specific values scan | `PASS` when inspiration/comparison derives relationships rather than copying source-specific expression; any copied asset, text, or exact source-specific value requires user ownership or explicit rights evidence | `FAIL`; refuse exact reuse and retain only attributed inspiration/comparison. Representative corpus provenance lacks an explicit license field. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:35-36] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:61-63] |
| **7. Trope budget** | predeclared high-salience-device budget; applied-device list; each device's target/brief/thesis purpose; source owner; `unsupportedTropeCount` | Default budget is one high-salience signature device per surface; a resolved user brief may raise it explicitly. `PASS` requires `applied <= budget`, `unsupportedTropeCount = 0`, and no signature motifs from multiple corpus anchors | `FAIL`; remove unsupported devices until the budget and single-anchor rule pass. Audit may use its slop and model-fingerprint resources to identify candidate devices, but evidence—not familiarity—decides the row. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:85-106] |
| **8. Application proof** | context manifest; proof-of-application card; target code/render/design evidence labels; mode-specific preflight/contrast/motion evidence | `PASS` when the card reconciles source claims against the actual target and all applicable evidence is `confirmed`, `inferred`, or `blocked` with reason; `not-assessed` blocks readiness | `FAIL`; report the missing evidence and do not claim ready. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:148-194] |

### Refusal boundary

Any authority override, missing fingerprint/provenance, overlapping axis ownership, raw-value averaging, cap violation, unsupported trope, unlicensed exact reuse, or unreconciled target evidence is a hard failure. The deterministic fallback order is: remove the failing influence; return to one coherent anchor; use the selected mode's native references and target evidence; or explicitly report that corpus grounding is unavailable. A failed gate never degrades into an undocumented “inspired by” blend. [INFERENCE: combined failure semantics of gate rows 1–8 and the established ONE-versus-SYNTHESIS refusal contract]

## Falsification Tests

| Scenario | Attempted counterexample | Gate result | Why / smallest valid fallback |
|---|---|---|---|
| **Bad averaging** | Use Kobu's 60–80px section rhythm and 19–86's 24px rhythm, average them into 42px, then claim a coherent synthesis | `FAIL` rows 4 and 5: one spacing axis has two owners and a raw-value average has no source relationship or target-derived delta. It also risks mixing Kobu's photography-led composition with 19–86's no-imagery lock. Choose one spacing owner or derive a new rhythm from target density, recording the delta. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:42-48] |
| **Trope-stacked distinctiveness** | Name Kobu as anchor, then add an oversized wordmark, gradient mesh, glass bento cards, pill controls, heavy shadows, animated grain, and a decorative watermark because each looks distinctive | `FAIL` rows 3 and 7: the stack contradicts Kobu's no-gradient/no-shadow/sharp-surface constraints and exceeds the default one-device budget with unsupported devices. Naming a thesis does not excuse contradictory decoration. Retain at most one target-motivated signature device and rebuild the rest from the anchor's relationships. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:6-8] [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:164-173] [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:188-188] |
| **Coherent transformed reference** | Use Kobu only for warm editorial surface relationships and restrained geometry, but select user-owned fonts/colors, document every delta, and retain one target-relevant image-led motif | `PASS` if rows 1–8 are evidenced: the output preserves a traceable thesis without copying exact source expression or accumulating foreign motifs. This control shows the gate does not reject all transformation. [INFERENCE: application of gate rows 1–8 to the Kobu fixture] |

The two negative fixtures did not falsify the gate; both were rejected for independently observable reasons rather than subjective dislike. This is a bounded logical falsification, not empirical proof that every rendered slop case will be detected. A later implementation should fixture-test proof-card validation and target reconciliation.

## Audit Boundary

Audit verifies the gate without becoming taste authority. It checks that required fields exist, hashes/provenance reconcile, counts and ownership obey caps, the rendered/code evidence matches claimed deltas, contradictions are labeled, and the verdict follows the hard rules. It may raise a candidate AI-tell or trope as a finding, but interface owns visual direction, foundations owns static-system judgment, motion owns temporal judgment, and the user/target owns brief truth. The shared contract explicitly says mode packets retain craft and audit owns evidence-backed audit claims; audit labels `confirmed`, `inferred`, `blocked`, and `not-assessed` rather than silently deciding another mode's taste. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:14-16] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:148-194] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:140-169]

## Findings

1. **`CORPUS_USE_PROOF v1` makes anti-slop a blocking evidence contract, not an aesthetic slogan.** Eight rows connect authority, rationale, fingerprint, deltas, synthesis, rights, trope budget, and target proof to a binary verdict and explicit fallback. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:44-79] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:266-281] [INFERENCE: operational gate defined and fixture-tested in this iteration]
2. **A coherent-source fingerprint must bind content identity and design identity.** Generation/hash and provenance prevent stale or anonymous use, while thesis, identity locks, and explicit prohibitions prevent a valid file reference from legitimizing an incoherent result. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:6-8] [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:164-173] [INFERENCE: gate row 3 combines content-addressability with the corpus document's own relational constraints]
3. **Transformation deltas and exclusive axis ownership are the mechanical barrier to generic averaging.** Every applied influence must name one owner, the source relationship, the changed result, and a target reason; means, medians, interpolation, or dual ownership fail without a taste judgment. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:27-36] [INFERENCE: bad-averaging falsification in this iteration]
4. **Provenance does not grant copy authority.** A use label plus an exact-expression scan distinguishes attributed inspiration/comparison from exact reuse; missing rights evidence forces transformation or refusal even when source metadata is otherwise complete. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:35-36] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:61-63]
5. **A trope budget catches superficially distinctive incoherence that a named thesis alone misses.** Predeclaring one high-salience device by default, requiring purpose for every device, enforcing zero unsupported tropes, and prohibiting multi-anchor signature motifs rejects a stack of individually fashionable elements without banning deliberate variance. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:85-106] [INFERENCE: trope-stack falsification and control scenario in this iteration]
6. **Audit can verify compliance while leaving taste with the owning modes.** It validates evidence, reconciliation, counts, contradictions, and verdict logic; it does not choose the thesis, transformations, register, or visual direction. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:14-16] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:148-194] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:140-169]

## Ruled Out

- A prose-only “be distinctive” reminder with no blocking evidence fields.
- A source citation alone as proof of coherence; content identity does not establish design consistency.
- Any numeric distinctiveness score that rewards adding more motifs.
- Audit choosing the design thesis or overruling interface/foundations/motion taste decisions.

## Dead Ends

- **Similarity or novelty scoring as the anti-slop authority:** a visually unusual trope stack can score as novel while violating its named thesis. Use evidence rows and hard contradictions; similarity may only be diagnostic.

## Edge Cases

- Ambiguous input: none; strategy and dispatch both require an operational anti-slop gate and two explicit negative tests.
- Contradictory evidence: none. The test scenarios intentionally contradict source constraints and are rejected rather than reconciled.
- Missing dependencies: none required for this proof-definition iteration. A future deterministic checker and rendered fixtures are implementation work, not prerequisites for specifying the gate.
- Partial success: none. The gate covers every dispatch-required field, rejects both negative fixtures, preserves a valid transformed control, and defines audit's non-taste boundary.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json:1-75`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl:1-6`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md:11-160`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:8-145,147-553`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/prompts/iteration-5.md:6-48`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:1-119`
- `.opencode/skills/sk-design/shared/context_loading_contract.md:14-328`
- `.opencode/skills/sk-design/design-audit/SKILL.md:85-106,140-169`
- `.opencode/skills/sk-design/design-motion/SKILL.md:264-292`
- `.opencode/skills/sk-design/styles/kobu/DESIGN.md:6-8,117-188`

## Assessment

- New information ratio: **0.93**
- Novelty calculation: 4 fully new findings + 2 partially new findings = `(4 + 0.5×2) / 6 = 0.83`; add the `+0.10` simplicity bonus because the gate closes the anti-slop key question, yielding `0.93` after rounding.
- Questions addressed: `Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?`
- Questions answered: `Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?`
- Remaining uncertainty: checker implementation, rendered-fixture calibration, and whether mode-specific trope defaults should override the one-device fallback belong to later validation; they do not leave the operational contract undefined.

## Reflection

- **What worked and why:** Building on the existing context and hard-gate vocabulary made each anti-slop claim inspectable. Contrasting averaging with trope stacking tested both generic-middle and novelty-without-coherence failures.
- **What did not work and why:** A single scalar “distinctiveness” score could not separate coherent transformation from ornamental novelty, so it was rejected as authority.
- **What I would do differently:** In tooling research, encode this card as a schema and run valid/invalid fixtures through a checker, including a rendered target whose implementation contradicts an otherwise valid proof card.

## Recommended Next Focus

Specify the repository-native build/query/refresh/validation toolchain, including manifest schema fields for generation/hash/provenance/mode eligibility, deterministic stale-index checks, `CORPUS_USE_PROOF v1` fixture validation, and fail-open grep fallback.
