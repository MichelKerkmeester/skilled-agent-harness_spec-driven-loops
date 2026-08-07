DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent for ONE iteration. Act as the @deep-research agent. (Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit — pre-approved, skip Gate 3.)

## STATE

STATE SUMMARY:
Segment 1 | Iteration 4 of 5
Questions: ~3/5 answered (T3 comment guidance; T4 INFO+exempt; T2 read-only diagnostic + last_confirmed/review_by, no auto-expiry) | Last focus: T2 review surface
Last 2 ratios: 0.78 -> 0.69 | Stuck count: 0
Resource map: not present; skipping coverage gate
Next focus: Q4 (deferred T1 — per-criterion AC->test coverage gate): prior art + feasibility risks for spec-kit's completion gate.

Research Topic: peck teachings adoption — T3/T4/T2 (covered), deferred T1 AC-coverage completion gate. Feasibility, risks, prior art, refinements.
Iteration: 4 of 5
Focus Area: Q4 (T1, deferred) primary.
Remaining Key Questions:
- Q4 (T1): prior art for mechanically mapping each acceptance criterion to a test/evidence and BLOCKING below a coverage threshold (peck uses floor(0.9 x ACs)). Survey BDD/spec-coverage tooling (Cucumber/Gherkin step coverage, behave, SpecFlow LivingDoc, requirements-traceability matrices, "spec coverage" gates). What are the feasibility risks of adding an AC_COVERAGE rule to spec-kit's completion gate (parsing ACs, mapping to tests/evidence, false confidence from weak assertions, per-level opt-in, warn-only rollout, who renders the verdict — self vs deep-review)? How does spec-kit currently express ACs (Given/When/Then at L3+, AC column at L1/L2; EVIDENCE_CITED is WARNING; checklist CHK-020 single box)?
- Q5 (cross-cutting): rollout/sequencing risks — addressed iter 5.
Last 3 Iterations Summary: run 1: T3 (0.86); run 2: T4 (0.78); run 3: T2 (0.69)

## GROUNDING (read in the repo worktree)

- spec-kit AC surfaces: `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` (REQUIREMENTS AC column; L3+ Given/When/Then), `checklist.md.tmpl` (CHK-020), `references/validation/validation_rules.md` (EVIDENCE_CITED, SECTION_COUNTS acceptance-scenario counting)
- Completion gate: `CLAUDE.md`/`AGENTS.md` Completion Verification Rule; `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` + `scripts/rules/`
- Sibling analysis (T1 section, highest-value): `.../001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`
- Use web search for EXTERNAL prior art: Gherkin/Cucumber step coverage, SpecFlow LivingDoc, behave, requirements traceability matrix tooling, "acceptance test coverage" gating, mutation/assertion-strength checks.

## CONSTRAINTS

- LEAF agent. No sub-agents. 3-5 research actions, max 12 tool calls, ~9 minutes. Findings only — do NOT edit spec-kit source. Write ALL findings to files.

## STATE FILES (paths relative to repo root = this worktree)

- State Log: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-state.jsonl
- Write iteration narrative to: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deltas/iter-004.jsonl

## OUTPUT CONTRACT (all THREE required)

1. **Iteration narrative** at `.../iterations/iteration-004.md`: headings Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. Cite evidence (repo file:line or URL).
2. **Canonical JSONL APPENDED** to the State Log (single line), EXACT type "iteration": `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<insight|evidence|thought>","focus":"T1 AC-coverage gate"}`. Append via `echo '<json>' >> <state-log-path>`.
3. **Delta file** at `.../deltas/iter-004.jsonl`: one iteration line + one record per finding/ruled_out.

Begin now. Focus Q4 (T1); write the three artifacts before finishing.
