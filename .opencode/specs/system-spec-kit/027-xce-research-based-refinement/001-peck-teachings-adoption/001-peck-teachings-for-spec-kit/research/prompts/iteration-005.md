DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent for the FINAL iteration (5 of 5). Act as the @deep-research agent. (Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit — pre-approved, skip Gate 3.)

## STATE

STATE SUMMARY:
Segment 1 | Iteration 5 of 5 (FINAL)
Questions: 4/5 answered (T3 comment guidance; T4 INFO+exempt+implementation-summary-first; T2 read-only diagnostic + last_confirmed/review_by no auto-expiry; T1 feasible via explicit AC IDs + per-AC traceability table, existing signals too brittle for blocking)
Last 2 ratios: 0.69 -> 0.74 | Stuck count: 0
Resource map: not present; skipping coverage gate
Next focus: Q5 (cross-cutting rollout/sequencing) + close any gaps and surface ruled-out directions / residual risks.

Research Topic: peck teachings adoption — synthesize cross-cutting rollout risks across T3 (templates), T4 (advisory rule), T2 (constitutional review), deferred T1 (AC-coverage gate).
Iteration: 5 of 5 (FINAL — be comprehensive; this is the last evidence pass before synthesis)
Focus Area: Q5 (cross-cutting) + gap-closing.
Remaining Key Questions:
- Q5: What rollout/sequencing risks apply across the four teachings? Specifically: (a) warn-only rollout windows + how spec-kit already does this (e.g., SPECKIT_SAVE_QUALITY_GATE warn-only period); (b) per-level opt-in (L1 work may have no tests → T1 must not block L1); (c) strict-mode interaction (WARNING becomes ERROR under --strict — affects T4 and any new rule); (d) ordering rationale (T3 cheapest → T4 → T2 → T1 highest blast radius) and whether any phase technically blocks another; (e) who renders verdicts (self-attestation vs a separate fresh-context reviewer like deep-review); (f) what could make each phase FAIL or regress validation (TEMPLATE_HEADERS for T3, false positives for T4, scope-creep-to-auto-expiry for T2, false-confidence/weak-assertions for T1).
- Also: explicitly capture RULED-OUT directions and residual risks/unknowns to hand to synthesis.
Last 3 Iterations Summary: run 2: T4 (0.78); run 3: T2 (0.69); run 4: T1 (0.74)

## GROUNDING (read in the repo worktree)

- Rollout prior art in spec-kit: search for warn-only / rollout flags (e.g. `SPECKIT_SAVE_QUALITY_GATE`, WARN_ONLY period) under `.opencode/skills/system-spec-kit/mcp_server` and `references/`
- Parent plan + per-phase specs: `.../001-peck-teachings-adoption/spec.md` (phase map, sequencing, open questions) and `00{2,3,4}-*/spec.md`, plus deferred-T1 notes in `001-.../peck-teachings-analysis.md` §8 (sequencing)
- Prior iterations: `.../research/iterations/iteration-00{1,2,3,4}.md`
- Use web search only if it materially strengthens a cross-cutting claim (e.g., phased lint-rule rollout, "warn then error" deprecation cadences).

## CONSTRAINTS

- LEAF agent. No sub-agents. 3-5 research actions, max 12 tool calls, ~9 minutes. Findings only — do NOT edit spec-kit source. Write ALL findings to files.

## STATE FILES (paths relative to repo root = this worktree)

- State Log: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-state.jsonl
- Write iteration narrative to: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deltas/iter-005.jsonl

## OUTPUT CONTRACT (all THREE required)

1. **Iteration narrative** at `.../iterations/iteration-005.md`: headings Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus (write "Converged / final iteration" if no further focus). Cite evidence.
2. **Canonical JSONL APPENDED** to the State Log (single line), EXACT type "iteration": `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<insight|evidence|thought>","focus":"cross-cutting rollout"}`. Append via `echo '<json>' >> <state-log-path>`.
3. **Delta file** at `.../deltas/iter-005.jsonl`: one iteration line + one record per finding/ruled_out.

Begin now. Focus Q5 + gap-closing; write the three artifacts before finishing.
