# Iteration 4: Audit and Open Design Registry Reconciliation

## Focus

Reconcile why iteration 2's evidence did not close the canonical audit/Open Design registry question, then re-validate the proposed audit comparison lane and Open Design grounding receipt against their checked-in contracts. This iteration adds only clarifying evidence about exact question identity, schema boundaries, negative fixtures, ship order, and aggregate cost; it does not reopen exhausted approaches, invoke Open Design, or edit reducer-owned files.

## Actions Taken

1. Compared iteration 2's `answeredQuestions` value with the registry's canonical question text and reducer-visible state. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-state.jsonl:4] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deltas/iter-002.jsonl:1] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/findings-registry.json:58-67]
2. Re-validated the audit lane against the current severity, evidence-label, worksheet, report, and phase-001 consumer boundaries. [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:36-138] [SOURCE: .opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md:29-80] [SOURCE: .opencode/skills/sk-design/design-audit/assets/audit_report_template.md:116-181] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:134-145]
3. Re-validated the Open Design receipt against mandatory pairing, two-axis gating, live surface verification, no-cache behavior, and multi-turn parity inspection; no live Open Design tool was used. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:123-154] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:38-170] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/design_parity_transport.md:22-45]
4. Recomputed the staged rough-cost range and its audit/transport subtotals from iteration 2's four independently testable slices. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/iterations/iteration-002.md:20-26] [INFERENCE: arithmetic over the cited 2-4, 4-7, 3-5, and 5-8 engineer-day ranges]

## Findings

1. **The reconciliation cause is exact question-identity drift, not an evidence gap.** Iteration 2 emitted the answered question without Markdown backticks around `design-audit` and `design-mcp-open-design`, while the registry's canonical question includes those backticks and therefore retains a different exact string and question identity. The iteration narrative answered the substance, but the reducer could not reconcile that non-canonical `answeredQuestions` value to registry question 5. This iteration emits the registry text byte-for-byte, including backticks and punctuation. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-state.jsonl:4] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deltas/iter-002.jsonl:1] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/findings-registry.json:58-67] [INFERENCE: the only identity-level difference is the missing inline-code delimiters, while iteration 2 contains a substantive answer]

2. **`AUDIT_CORPUS_COMPARISON v1` remains valid only as an additive comparison lane with a strict non-authority boundary.** The existing worksheet inventories target source, render, design artifact, and deterministic-scan evidence, and its finding labels carry into severity, score, and owner handoff; corpus comparison is not one of those target-proof classes. The additive lane may record an intended anchor plus at most one contrast, per-axis observations, hashes/provenance, relation, evidence label, and limitation, but it cannot produce severity, a `/20` score, accessibility/performance proof, copying proof, or remediation authority. Required negative fixtures are: no intended anchor (context only, never drift), generation mismatch or unavailable source (`comparison-unavailable`, never stale fallback), similarity-only severity/quality/copying claims (reject), and exact source-specific reuse under unknown rights (reject). [SOURCE: .opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md:29-80] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:36-138] [SOURCE: .opencode/skills/sk-design/design-audit/assets/audit_report_template.md:116-181] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:134-145] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:172-191] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:350-364] [INFERENCE: a separate lane is necessary because comparison evidence has strictly less proof authority than the checked-in target-evidence classes]

3. **`OPEN_DESIGN_GROUNDING_RECEIPT v1` remains valid only as a corpus-lineage handshake subordinate to every existing transport gate.** Its pre-call fields may bind paired mode, design-gate proof, purpose, target, corpus generation, selected reference IDs/hashes/provenance, allowed influence axes, prohibited reuse, brief digest, and `noCache:true`; its return fields may bind project/conversation/run IDs, entry file, preview URL, artifact hashes, live-read time, and tool-surface evidence. It does not replace live `tools/list` verification, `sk-design` judgment, explicit mutation approval with target and rollback, live reads, or paired-mode acceptance. Required negative fixtures are: pure inventory succeeds without a design receipt; a design-feeding read without the design precondition fails; a mutating call with a receipt but without confirmation/target/rollback fails; a changed corpus generation requires reselection; turn 1 at `awaiting_input` with zero files is incomplete; and a completed build without artifact/preview inspection and paired-mode reconciliation is not accepted. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:123-154] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:60-98] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:114-170] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/design_parity_transport.md:22-45] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:130-132] [INFERENCE: the receipt supplies corpus provenance across a temporal call boundary but cannot absorb independent design or mutation authority]

4. **The validated ship order totals roughly 14-24 engineer-days, split into a 6-11 day audit slice and an 8-13 day Open Design slice.** Ship (1) audit worksheet/report schema plus positive and negative fixtures, 2-4 days; (2) deterministic per-axis drift fingerprint plus provenance validator, 4-7 days; (3) grounding-receipt schema plus offline generation/no-cache/pairing validators, 3-5 days; then (4) live read/run receipt plumbing plus return reconciliation, 5-8 days. Schema fixtures precede validators so scalar authority and stale fallback fail mechanically; live transport remains last because it depends on the settled receipt and an external daemon. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/iterations/iteration-002.md:20-26] [SOURCE: .opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md:38-80] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:143-170] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/design_parity_transport.md:34-45] [INFERENCE: 2-4 + 4-7 = 6-11 audit days; 3-5 + 5-8 = 8-13 transport days; total = 14-24 days]

5. **The canonical audit/Open Design question is evidence-backed for closure.** Audit uses a generation-bound, intended-anchor-aware comparison lane that remains contextual unless target authority supports a drift claim; Open Design uses a no-cache, generation-bound grounding receipt before design-bearing work and paired-mode reconciliation afterward. The first ship tranche is audit schema/fixtures, followed by drift/provenance validation, offline receipt validation, and live transport plumbing at the rough costs above. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/iterations/iteration-002.md:16-30] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:36-138] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:60-170] [INFERENCE: the revalidated authority, failure, dependency, proof, and cost boundaries satisfy every clause of the canonical combined question]

## Questions Answered

- `How should \`design-audit\` and \`design-mcp-open-design\` use the corpus for drift, similarity, provenance, comparison, and transport grounding; which cross-mode ideas should ship first at what rough cost?`

## Questions Remaining

1. How should `design-foundations` turn captured token axes and relationships into safe starting systems, compatibility maps, and implementation-ready evidence without averaging values or claiming accessibility proof?
2. How should `design-motion` discover and use sparse temporal evidence, infer no motion from static styles safely, and build motion-specific exemplars or negative baselines under its restraint gate?

## Ruled Out

- Treating comparison evidence as target evidence, severity, quality, accessibility/performance proof, or copying proof remains invalid. [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:36-138] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:134-145]
- Treating the grounding receipt as mutation approval, transport acceptance, a cache license, or one-shot completion remains invalid. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:127-154] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:143-170]
- Reopening live Open Design evidence was ruled out because the dispatch requires checked-in-contract validation and explicitly forbids Open Design live tools. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/prompts/iteration-4.md:31-38]

## Dead Ends

No new dead end was discovered. The iteration revalidated, rather than retried, the existing blocked directions: similarity as authority, stale/cached fallback, raw exact-value transfer, transport authority, and one-shot completion. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-strategy.md:67-128]

## Edge Cases

- Ambiguous input: none; the prompt supplied the exact canonical question string and named the reconciliation target.
- Contradictory evidence: iteration 2 says the question was answered while the registry leaves it unresolved; the cited string mismatch reconciles the artifact-level conflict without weakening the substantive evidence. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/iterations/iteration-002.md:28-30] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/findings-registry.json:58-67]
- Missing dependencies: none; live Open Design was neither required nor permitted, and checked-in contracts were available.
- Partial success: none; the canonical question identity, both contract boundaries, negative fixtures, ship order, and aggregate costs were verified.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-config.json:1-74`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-state.jsonl:1-6`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-strategy.md:17-206`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/findings-registry.json:8-164`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-dashboard.md:17-121`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/iterations/iteration-002.md:1-76`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deltas/iter-002.jsonl:1`
- `.opencode/skills/sk-design/design-audit/references/audit_contract.md:36-138`
- `.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md:29-80`
- `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md:116-181`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:123-154`
- `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:38-170`
- `.opencode/skills/sk-design/design-mcp-open-design/references/design_parity_transport.md:22-45`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:96-191`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:350-364`

## Assessment

- New information ratio: 0.70
- Novelty calculation: 2 of 5 findings are fully new (exact reducer reconciliation cause and aggregate/subtotal cost ranges), while 3 partially revalidate iteration 2's schema, fixture, and closure conclusions: `(2 + 0.5 × 3) / 5 = 0.70`.
- Questions addressed: the canonical combined audit/Open Design key question.
- Questions answered: 1 this iteration; 3 of 5 cumulatively after reducer reconciliation.
- Edge cases: contradictory evidence, resolved as an artifact string-identity mismatch.

## Reflection

- What worked and why: comparing the canonical registry text directly with the state/delta value exposed a deterministic identity mismatch, while contract-local negative fixtures tested the answer without reopening live transport or exhausted approaches.
- What did not work and why: iteration 2's substantive answer used a visually similar but non-canonical question string; exact-string reconciliation made Markdown punctuation load-bearing.
- What I would do differently: source every `answeredQuestions` entry directly from the registry object rather than retyping it, then fixture-test exact identity before reducer ingestion.

## Recommended Next Focus

Investigate the next unresolved canonical question: how `design-foundations` should turn captured token axes and relationships into safe starting systems, compatibility maps, and implementation-ready evidence without averaging values or claiming accessibility proof. Reuse the phase-001 exclusive-axis ownership boundary and test it with positive and negative token fixtures before considering motion.
