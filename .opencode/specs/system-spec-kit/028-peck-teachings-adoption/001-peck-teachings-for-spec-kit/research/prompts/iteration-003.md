DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent for ONE iteration. Act as the @deep-research agent. (Spec folder: .opencode/specs/system-spec-kit/028-peck-teachings-adoption/001-peck-teachings-for-spec-kit — pre-approved, skip Gate 3.)

## STATE

STATE SUMMARY:
Segment 1 | Iteration 3 of 5
Questions: ~2/5 answered (Q1/T3: comment guidance; Q2/T4: INFO severity, start with implementation-summary.md, exempt historical docs) | Last focus: T4 advisory rule
Last 2 ratios: 0.86 -> 0.78 | Stuck count: 0
Resource map: not present; skipping coverage gate
Next focus: Q3 (T2 — constitutional-rule review surface): metadata field + read-only diagnostic mechanism; staleness/expiry handling in comparable always-on-rule systems.

Research Topic: peck teachings adoption — T3 (done), T4 (done), T2 constitutional-rule review surface, deferred T1 AC-coverage gate. Feasibility, risks, prior art, refinements.
Iteration: 3 of 5
Focus Area: Q3 (T2) primary.
Remaining Key Questions:
- Q3 (T2): best mechanism for a read-only review surface listing constitutional rules with last-confirmed metadata + staleness; where should the diagnostic live (standalone script vs /doctor memory route vs /memory:manage)? How do policy-as-code / lint-rule / alerting systems (OPA, ESLint rule deprecation, Renovate, alert "review-by" dates, ADR review cadences) handle rule staleness WITHOUT auto-deleting? What metadata field (last_confirmed date vs review_by deadline) is best, and how to backfill honestly (git dates)?
- Q4 (T1, deferred): prior art for mechanical AC->test coverage mapping + blocking threshold.
- Q5 (cross-cutting): rollout/sequencing risks across T3/T4/T2 + deferred T1.
Last 3 Iterations Summary: run 1: T3 feasibility (0.86); run 2: T4 advisory rule (0.78)

## GROUNDING (read in the repo worktree)

- T2 targets: `.opencode/skills/system-spec-kit/constitutional/` (the 14 rule files + README), and decay behavior in `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- Diagnostic host candidates: `/doctor` memory route and `/memory:manage` (look under `.opencode/commands/` and `.opencode/skills/system-spec-kit`)
- Phase spec: `.../028-peck-teachings-adoption/004-constitutional-rule-review/spec.md`
- Sibling analysis (T2 section): `.../001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`
- Use web search for EXTERNAL prior art on rule/policy staleness review (OPA/conftest, ESLint deprecated-rule patterns, ADR review cadence, alerting review-by metadata, "rule expiry"/"sunset" patterns).

## CONSTRAINTS

- LEAF agent. No sub-agents. 3-5 research actions, max 12 tool calls, ~9 minutes. Findings only — do NOT edit spec-kit source. Write ALL findings to files.

## STATE FILES (paths relative to repo root = this worktree)

- State Log: .opencode/specs/system-spec-kit/028-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-state.jsonl
- Write iteration narrative to: .opencode/specs/system-spec-kit/028-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/028-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deltas/iter-003.jsonl

## OUTPUT CONTRACT (all THREE required)

1. **Iteration narrative** at `.../iterations/iteration-003.md`: headings Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. Cite evidence (repo file:line or URL).
2. **Canonical JSONL APPENDED** to the State Log (single line), EXACT type "iteration": `{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<insight|evidence|thought>","focus":"T2 constitutional review"}`. Append via `echo '<json>' >> <state-log-path>`.
3. **Delta file** at `.../deltas/iter-003.jsonl`: one iteration line + one record per finding/ruled_out.

Begin now. Focus Q3 (T2); write the three artifacts before finishing.
