---
title: "Council Report: 110-auto-review-stretch-config-dedup-gates Pre-Implementation Review"
description: "Multi-seat council deliberation on packet 110 scaffold by cli-codex gpt-5.5 xhigh fast. Verdict + recommended plan + per-seat critiques + risks."
trigger_phrases:
  - "110 council report"
  - "auto-review stretch uplift council verdict"
importance_tier: "important"
contextType: "review"
---

# Council Report: 110-auto-review-stretch-config-dedup-gates Pre-Implementation Review

## 1. Council Composition

| Seat | Lens | Bias / Rationale |
|------|------|------------------|
| Seat 001 | Risk | HIGH/MEDIUM/LOW risks per child phase |
| Seat 002 | Scope | Grouping (by target surface) and phase boundaries |
| Seat 003 | Implementation | File:line accuracy + effort realism + codebase verification |
| Seat 004 | Skeptic | Should any teaching be rejected? |
| Seat 005 | Cost-Benefit | 10-12h MVP ROI vs alternatives |

All seats are simulated inside this single `cli-codex` dispatch. No sub-agents, external CLI executors, or separate AI systems participated.

## 2. Task Classification

tooling | governance | risk-prevention | refactor

## 3. Strategy Comparison

| Strategy | Description | Pros | Cons |
|----------|-------------|------|------|
| A: As-scaffolded (parent + 4 children by target surface) | Current plan | Keeps ownership clear by surface; matches the parent phase map in `110/spec.md:92`; limits cross-phase file churn | Not approvable as written: H-9 assumes evidence interpolation that current deep-review prompt packs do not obviously do; M-3 names the wrong state artifact; packet numbering drifts between 109 and 110 |
| B: Single Level-2 packet | Simpler | One checklist and one validation path; easier for a small operator run | Blurs plugin, skill, YAML, and reducer boundaries; higher risk of unreviewable mixed commits |
| C: Group by IMPACT (HIGH together, MEDIUM together) | Different lens | Lets high-impact teachings ship first as a value batch | Causes each phase to touch unrelated target surfaces, weakening file ownership and tests |
| D: Reject some stretch teachings | Reduce scope | Keeps the work tied to demonstrated current code paths | Requires editing the scaffold before implementation; may leave useful efficiency wins unshipped |
| E: Defer all stretch goals (no packet 110) | No work | Zero implementation risk; operators can keep using packet 108 primitives manually | Leaves repeated-review and config-tuning friction in place; wastes the research already captured in 106 |

## 4. Seat 001 - Risk

The risk shape is uneven. Phase 1 is MEDIUM because config precedence can break existing plugin options if `rawOptions`, legacy env vars, and file-tier overrides are not ordered explicitly. Phase 2 is LOW/MEDIUM because both gates can be safe if they are opt-in and emit `COMMENTED`, but M-2 can silently skip a one-line critical change if enabled too broadly. Phase 3 is HIGH as written: H-7 is useful, but H-9 currently describes bounded evidence around "candidate file:line" before those findings exist. Phase 4 is MEDIUM because mutation dedup is a real optimization, but a too-coarse signature can suppress legitimate variants.

- Phase 1 `001-mk-plugins-config-uplift`: MEDIUM. Backward compatibility requires preserving existing option/env behavior, including disable env handling in `.opencode/plugins/mk-skill-advisor.js:35` through `.opencode/plugins/mk-skill-advisor.js:39` and option normalization in `.opencode/plugins/mk-skill-advisor.js:107` through `.opencode/plugins/mk-skill-advisor.js:127`.
- Phase 2 `002-sk-code-review-uplift`: LOW/MEDIUM. M-1 is content-hash dedup and can be safe; M-2 must stay opt-in because the spec itself acknowledges "small but critical" changes in `002/spec.md:129` through `002/spec.md:132`.
- Phase 3 `003-deep-review-uplift`: HIGH. Existing synthesis already deduplicates by `file:line + normalized_title` in `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1115` through `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1124`, so H-7 should extend that contract rather than invent a disconnected path. H-9 needs a concrete evidence producer before implementation.
- Phase 4 `004-deep-agent-improvement-uplift`: MEDIUM. Current mutation coverage only exhausts `dimension + mutationType` in `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs:122` through `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs:131`; richer signatures are valuable but must not erase target-section distinctions.

## 5. Seat 002 - Scope

Grouping by target surface is the right topology. H-5 and M-6 should stay bundled because both touch the same two mk-* plugins and both are about startup/config behavior. H-7 and H-9 can stay in the same child only if H-9 is rewritten into a concrete deep-review prompt/rendering change; otherwise H-9 should be deferred and the child should become H-7-only. Grouping by impact tier would force one child to edit plugins, review skills, deep-loop YAML, and deep-agent-improvement scripts at once, which is worse for review and rollback.

- Keep Phase 1 bundled: parent mapping puts H-5 + M-6 against `.opencode/plugins/mk-skill-advisor.js` and `.opencode/plugins/mk-code-graph.js` in `110/spec.md:92` through `110/spec.md:95`.
- Keep Phase 2 bundled: M-1 and M-2 are both sk-code-review efficiency gates and share status-output semantics in `002/spec.md:63` through `002/spec.md:68`.
- Split or rewrite Phase 3: H-7 has a real target in deep-review state/synthesis, but H-9's bounded-evidence wording in `003/spec.md:82` through `003/spec.md:87` does not yet map cleanly to the current prompt pack.
- Keep Phase 4 separate: M-3 is isolated to deep-agent-improvement files in `004/spec.md:82` through `004/spec.md:88`, so it should not be merged into Phase 3 despite the signature-dedup family resemblance.

## 6. Seat 003 - Implementation

The codebase verification supports the broad target list, but several implementation claims need tightening. `rg -n 'loadConfig|process\.env\.|config\.[a-z]' .opencode/plugins/mk-skill-advisor.js` found only `process.env.SPEC_KIT_PLUGIN_NODE_BINARY` at `.opencode/plugins/mk-skill-advisor.js:119`, and the same check in mk-code-graph found `process.env.SPEC_KIT_PLUGIN_NODE_BINARY` at `.opencode/plugins/mk-code-graph.js:127` and `.opencode/plugins/mk-code-graph.js:140`; neither plugin currently has `loadConfig`. Both plugin factories are already async (`.opencode/plugins/mk-skill-advisor.js:387`, `.opencode/plugins/mk-code-graph.js:361`), so M-6 is not "make the factory async" so much as "load a config promise before the hooks read options." The effort estimates are plausible only after the spec edits below: Phase 1 3-4h is realistic, Phase 2 2-3h is realistic if it remains skill/spec guidance plus deterministic cache contract, Phase 3 3-4h is too low if H-9 requires a new evidence packer, and Phase 4 2h is optimistic if reducer/dashboard consumers need updates.

- Phase 1 evidence: mk-skill-advisor normalizes current config from `rawOptions` plus env/defaults in `.opencode/plugins/mk-skill-advisor.js:107` through `.opencode/plugins/mk-skill-advisor.js:127`, and its async factory consumes those options at `.opencode/plugins/mk-skill-advisor.js:387` through `.opencode/plugins/mk-skill-advisor.js:389`. mk-code-graph follows the same pattern at `.opencode/plugins/mk-code-graph.js:122` through `.opencode/plugins/mk-code-graph.js:142` and `.opencode/plugins/mk-code-graph.js:361` through `.opencode/plugins/mk-code-graph.js:363`.
- Phase 2 evidence: sk-code-review already has the packet 108 marker insertion contract at `.opencode/skills/sk-code-review/SKILL.md:55` through `.opencode/skills/sk-code-review/SKILL.md:58`, and it already has exact final status lines at `.opencode/skills/sk-code-review/SKILL.md:333` through `.opencode/skills/sk-code-review/SKILL.md:360`. The M-1/M-2 additions should therefore extend status semantics, not redesign the output contract.
- Phase 3 evidence: deep-review's prompt pack starts with the shipped `DEEP-REVIEW` marker at `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:1`, and its current prompt context is state/metadata rather than embedded full-file contents at `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:7` through `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:17`. The auto dispatcher renders that template with variables at `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:654` through `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:670`; the confirm dispatcher mirrors that at `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:654` through `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:662`.
- Phase 3 evidence: final verdict derivation from packet 108 is already present in auto mode at `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1088` through `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1108` and confirm mode at `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1039` through `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1059`. H-7 should avoid conflicting with that existing synthesis flow.
- Phase 4 evidence: `mutation-coverage.cjs` creates a coverage graph with `mutations` and `exhausted` arrays at `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs:59` through `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs:67`, records mutations at `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs:80` through `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs:92`, and exports only coverage helpers at `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs:279` through `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs:290`.
- Phase 4 evidence: the skill says `agent-improvement-state.jsonl` tracks proposal/evaluation data while journal emission is separate at `.opencode/skills/deep-agent-improvement/SKILL.md:281` through `.opencode/skills/deep-agent-improvement/SKILL.md:287`, and reducer replay consumes `mutation-coverage.json` at `.opencode/skills/deep-agent-improvement/SKILL.md:377` through `.opencode/skills/deep-agent-improvement/SKILL.md:393`. The Phase 4 spec must pick the correct artifact boundary before implementation.

## 7. Seat 004 - Skeptic

Do not move all 7 teachings to the reject list. H-5, M-6, M-1, H-7, and M-3 solve real friction in current surfaces. M-2 is acceptable only as an explicit operator opt-in with a conservative skip taxonomy; it should never become a hidden default. H-9 is the only teaching that looks under-proven in this codebase: upstream bounded interpolation is useful in a session prompt, but current deep-review prompts point agents at files and state rather than embedding all evidence. The reject/defer line should be H-9 unless the spec names the exact evidence interpolation path it will bound.

- Keep H-5 + M-6, but require a four-tier compatibility decision that includes existing `rawOptions`.
- Keep M-1; content-hash dedup is more robust than commit-SHA-only dedup, and `002/spec.md:64` through `002/spec.md:68` avoids false approvals by using `COMMENTED`.
- Keep M-2 only if default-off and blocked for security/auth/config/persistence-sensitive changes.
- Keep H-7, but implement it as reducer/synthesis-aware dedup, not as a promise that reviewers can know duplicate candidate findings before reviewing.
- Defer H-9 or rewrite it. As written, it risks solving a hypothetical prompt-bloat problem rather than the actual current deep-review path.
- Keep M-3, but base the signature on `dimension + mutationType + targetSection + normalized body`, and add a bypass for forced re-evaluation as `004/spec.md:73` through `004/spec.md:76` already suggests.

## 8. Seat 005 - Cost-Benefit

The 10-12h stretch spend is only justified after the scaffold is narrowed to mechanisms with current-code fit. Source 106's cost model says the typical auto-review-every-idle cost is $31.50/month and breaks even by preventing 1-2 hours of rework or one CI failure per month (`106/research/review-report.md:191` through `106/research/review-report.md:206`). Source 106 also framed stretch work as 8-12 hours after the MVP and full adoption as 13-20 hours total (`106/research/review-report.md:413` through `106/research/review-report.md:418`). Predecessor 108's council requested changes rather than blind implementation (`108/ai-council/council-report.md:94` through `108/ai-council/council-report.md:106`) and still favored parent-plus-children topology after edits (`108/ai-council/council-report.md:122` through `108/ai-council/council-report.md:124`), which argues for disciplined spec repair here, not abandoning the packet.

- Highest ROI: H-5 + M-6. Runtime config for mk-* plugins pays back whenever operators tune cache, thresholds, paths, or debug behavior without source edits.
- Good ROI: M-1 and H-7. Dedup avoids repeated reviews and repeated findings, which maps directly to the cost-control goals in 106 §3.9.
- Conditional ROI: M-3. It pays off for repeated deep-agent-improvement loops, but only if the signature avoids false exhausted states.
- Weak ROI as written: M-2 and H-9. M-2 saves compute but can skip high-value tiny diffs; H-9 needs proof that current deep-review is actually stuffing large file evidence into prompts.
- Operator rerunning packet 108 primitives on demand is cheaper in the short term, but it does not solve plugin config or stateful dedup. The better trade is to fix the scaffold and implement Phase 1 first.

## 9. Deliberation Notes

All seats agree the packet should not be rejected outright. The target-surface grouping is materially better than impact-tier grouping because it keeps each child phase reviewable and makes rollback simpler. The source research supports the teachings as a family, and packet 108 intentionally left stretch work for a follow-on packet.

The disagreement is how much work may proceed without spec edits. Scope would approve the topology with caveats, while Risk, Implementation, Skeptic, and Cost-Benefit all require edits before implementation. Convergence is therefore REQUEST-CHANGES: the council supports packet 110's direction, but the child specs must align with the actual plugin option flow, deep-review prompt/state architecture, and deep-agent-improvement artifact boundaries before code changes start.

## 10. Recommended Plan

**Verdict**: REQUEST-CHANGES

Required spec edits before implementation:

1. Fix packet numbering drift. Replace `109` references in the packet 110 scaffold where they name this packet or this scope, including parent trigger phrases in `110/spec.md:4` through `110/spec.md:9`, parent problem wording in `110/spec.md:66` through `110/spec.md:70`, parent success criterion `110/spec.md:120` through `110/spec.md:124`, and child Phase 1 out-of-scope wording in `001/spec.md:86` through `001/spec.md:90`.
2. Update Phase 1 to specify config precedence including existing plugin `rawOptions` and legacy env vars. Recommended order: explicit plugin `rawOptions` > config file > env vars > defaults, unless the operator deliberately wants file-tier to override plugin config. Add tests for no file, malformed file, env-only, rawOptions-only, and file-plus-env.
3. Update Phase 2 M-2 to define a conservative skip taxonomy: default off, emit `Review status: COMMENTED`, never skip security/auth/authz/config/persistence/dependency/sandboxing/public-response changes, and name the changed-line counting command.
4. Rewrite Phase 3 H-7 around current deep-review architecture: prior signatures may be passed as prompt hints, but authoritative dedup must occur in synthesis/reducer state. Specify the exact JSONL fields added to iteration records and how they interact with the existing file:line + normalized_title registry.
5. Rewrite or defer Phase 3 H-9. If kept, identify the actual evidence interpolation source and variables to bound; do not describe `candidate file:line` windows as pre-dispatch input unless those candidate locations already exist.
6. Update Phase 4 M-3 to name the correct artifact boundary. If signatures live in `mutation-coverage.json`, say so and update reducer/dashboard expectations; if they must live in `agent-improvement-state.jsonl`, broaden the file list beyond `mutation-coverage.cjs` and add reducer tests.
7. Re-estimate Phase 3 and Phase 4 after the above edits. Phase 3 is likely 5-7h if H-9 remains; Phase 4 is likely 2-4h depending on reducer/test scope.

## 11. Plan Confidence

Confidence: HIGH - convergence: 5/5 seats agreed on REQUEST-CHANGES

## 12. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| H-5 config precedence breaks existing plugin options | HIGH | Include `rawOptions` in the precedence chain and test legacy env names plus malformed/missing config files |
| H-9 bounded evidence targets a non-existent evidence interpolation path | HIGH | Rewrite around actual prompt-pack variables or defer H-9 |
| H-7/M-1/M-3 signatures collide and skip legitimate findings/reviews/mutations | HIGH | Include target surface, normalized location, type, and content snippet/hash; treat collisions as advisory until synthesis verifies |
| M-2 skips critical small changes | MEDIUM | Default off; `COMMENTED` only; block skip for sensitive paths and high-risk change classes |
| Phase estimates cause rushed implementation | MEDIUM | Re-estimate after spec edits; implement Phase 1 first and reassess remaining phases |

## 13. Winning Strategy

Strategy A wins after required edits. Parent-plus-children by target surface is the right structure, but "as-scaffolded" is not implementation-ready. Strategy D partially applies only to H-9 if no real evidence interpolation path is found.

## 14. Implementation Steps

Not applicable until the required spec edits in Section 10 are made and a separate implementation dispatch references this council report. If the revised packet is approved, implement Phase 1 first: read both mk-* plugins, define the precedence chain, add async config loading, test compatibility tiers, document examples, then validate the child and parent specs.

## 15. Prerequisites

- Spec author applies the Section 10 edits.
- Operator confirms config precedence if they prefer file-tier to override existing plugin `rawOptions`.
- H-9 gets either a concrete evidence interpolation path or an explicit deferral.
- Phase 4 chooses whether mutation signatures live in `mutation-coverage.json` or `agent-improvement-state.jsonl`.
- A separate implementation dispatch references this report before code changes start.

## 16. Cross-References

- Source findings: `106/research/review-report.md`
- Predecessor council: `108/ai-council/council-report.md`
- Packet under review: `110/spec.md` + 4 child specs
- Source rankings: `106/research/review-report.md:280` through `106/research/review-report.md:305`
- Source cost model: `106/research/review-report.md:191` through `106/research/review-report.md:206`
- Predecessor requested changes: `108/ai-council/council-report.md:94` through `108/ai-council/council-report.md:106`

## 17. Dropped Alternatives

Strategy B is dropped because a single Level-2 packet would mix plugin config, code-review skill contracts, deep-review YAML, and deep-agent-improvement reducers in one implementation surface. Strategy C is dropped because impact-tier grouping creates worse ownership boundaries than target-surface grouping. Strategy D is dropped as a whole because most teachings are still useful; only H-9 is a defer/rewrite candidate. Strategy E is dropped because packet 108 did not cover plugin config or stateful dedup, and repeated manual reruns do not remove those costs.

## 18. Planning-Only Boundary

This council does NOT implement. Implementation only after a separate dispatch references this council-report.md.
