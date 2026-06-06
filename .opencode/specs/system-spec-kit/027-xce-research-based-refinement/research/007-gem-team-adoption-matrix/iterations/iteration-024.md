# Iteration 024: RQ-MV cross-model validation

**Focus:** RQ-MV cross-model validation  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.15.  
**Raw output:** prompts/iteration-024.out  ·  **Prompt:** prompts/iteration-024.prompt

### CROSS-MODEL ASSESSMENT
| Item | gpt-5.5 conclusion | MiMo verdict (agree / disagree / refine) | Evidence (file:line) |
|---|---|---|---|
| Overall verdict | "validate-don't-transform"; spec-kit mature; transformative adoption absent | **Agree.** Spot-checks confirm every major Gem mechanism maps to an existing spec-kit surface. The 2-agent ceiling (orchestrate.md:276), delegator-only orchestrator (orchestrate.md:20-34), 5-phase debug (debug.md:142-159), no-self-review (review.md:424-427), Context Package (context.md:230-284), escalation classifiers (code.md:303-310), and confidence/halt framework (CLAUDE.md §4) all exist. Verdict holds. | orchestrate.md:267-276, code.md:303-310, debug.md:142-159, review.md:424-427, context.md:230-284 |
| P1 — typed-agent-io-adapter | Strongest net-new; adapter over existing @code RETURN / @review gates / @context Context Package | **Refine.** The "scattered prose" characterization is overstated for the *output* side — @code RETURN already has machine-parseable escalation enums and structured fields (code.md:275-310). The *dispatch input* side is genuinely unstructured prose (orchestrate.md:47-58, code.md:55-60). P1's scope should weight the dispatch header as the primary gap, with the output envelope normalization as secondary. The Context Package is a retrieval artifact, not a progressive orchestrator-maintained cache (contrast gem-team AGENTS.md rule 9: `context_envelope.json` enriched between waves). That progressive-enrichment mechanism is a genuine absence not called out by gpt-5.5. | code.md:270-310, orchestrate.md:47-58, gem-team AGENTS.md:72 |
| P2 — scoped-preexec-and-handoff-gates | Three scoped optional-mode gates (debug-handoff schema, boundary contract-first, pre-mortem) | **Agree with minor refinement.** debug-delegation.md exists but is unstructured markdown (debug.md:56-63) — a typed `root_cause/target_files/fix_recommendations` schema is genuinely net-new. Boundary contract-first for API/schema changes is absent (sk-code has general pre-implementation checks at code.md:180-188 but no scoped contract-first gate). Pre-mortem field is absent entirely. However, the research under-reports overlap: Gem's orchestrator pre-wave gate (gem-team AGENTS.md rule 5) verifying `debugger_diagnosis` fields is *stronger* enforcement than what P2 proposes — gpt-5.5 should have noted this is a downscale adoption, not a novel invention. | debug.md:56-63, code.md:180-188, gem-team AGENTS.md:64-68 |
| P3 — planner-review-focus-and-drift-hint | Lowest cost; reviewer_focus/quality_score + spec_drift write-back | **Agree.** Genuinely absent. The @review quality gate protocol (review.md:237-245) receives `threshold` but not a `reviewer_focus` hint routing attention to high-risk areas. Logic-Sync handles hard contradictions (CLAUDE.md §4) but no lightweight `spec_drift`/`update_recommended` recommendation exists. Both are advisory fields layered on P1's envelope — correctly scoped as L1. | review.md:237-245, CLAUDE.md §4 |

### MISSED OR OVER-CLAIMED

1. **Over-claimed: P1 output-side gap magnitude.** gpt-5.5 says "scattered prose" implying the output envelope is unstructured. @code RETURN already has typed escalation enums (`UNKNOWN_STACK`/`SCOPE_CONFLICT`/`LOGIC_SYNC`/`VERIFY_FAIL`) and `confidence` bands at code.md:275,286-287,303-310. The gap is real but narrower than stated — the *dispatch input* side (no `dispatch_id`, no typed `task_definition` schema, no `context_snapshot` header) is the larger hole. research.md:27 and sub-packet-proposals.md:23-25 both overstate the output-side deficit.

2. **Missed: Progressive context enrichment vs. snapshot.** Gem's `context_envelope.json` is a progressive cache enriched by the orchestrator between waves (gem-team AGENTS.md rule 9). The spec-kit's Context Package is a one-shot retrieval artifact (context.md:230-232). This architectural difference — progressive orchestrator-maintained state vs. per-invocation retrieval — is a genuine design gap the research never surfaces. It's defensible to keep the spec-kit's approach, but it should have been discussed as a ruled-out alternative, not ignored.

3. **Under-claimed: P2 debug-handoff is a downscale, not an invention.** Gem's orchestrator pre-wave gate *machine-checks* `debugger_diagnosis` fields with confidence < 0.85 → escalate (gem-team AGENTS.md rule 5). P2 proposes a typed handoff schema but with weaker enforcement. The research frames this as "net-new" without acknowledging the spec-kit is adopting a *narrower* version of an existing Gem mechanism. research.md:86; sub-packet-proposals.md:48.

4. **Missed: @code's existing "dispatch mode" typing.** @code has 7 explicit dispatch modes (code.md:117-128) with per-mode workflow variations. This is a form of typed dispatch the research never references when discussing P1's dispatch header. The modes exist; what's missing is a machine-parseable dispatch envelope carrying `dispatch_id`, `task_definition`, and `context_snapshot`. sub-packet-proposals.md:23.

5. **Over-claimed: Security overlap completeness.** The research claims sk-code-review security minimums cover Gem's OWASP scanning (research.md:105). sk-code-security_checklist.md exists but the research doesn't verify whether it covers the same OWASP categories Gem's reviewer scans. The "ADAPT-narrow → naming/only" downgrade (research.md:73) may be correct but was asserted without evidence of actual checklist content coverage.

### METRICS
newInfoRatio: 0.15
novelty: The three sub-packets are correctly scoped and genuinely net-new, but the gaps are smaller than gpt-5.5 characterized — particularly P1's output-side where @code RETURN already has typed enums and structured fields. The progressive-enrichment vs. snapshot architecture gap is the most significant missed finding.
status: complete
focus: RQ-MV cross-model validation
