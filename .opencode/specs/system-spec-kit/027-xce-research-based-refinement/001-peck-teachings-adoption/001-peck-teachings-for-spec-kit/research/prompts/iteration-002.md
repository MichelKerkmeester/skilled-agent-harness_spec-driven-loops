DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent for ONE iteration. Act as the @deep-research agent. (Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit — pre-approved, skip Gate 3.)

## STATE

STATE SUMMARY:
Segment 1 | Iteration 2 of 5
Questions: ~1/5 answered (Q1/T3 largely resolved: prefer concise HTML-comment guidance, avoid line-start `## ` inside comments) | Last focus: T3 feasibility
Last 2 ratios: N/A -> 0.86 | Stuck count: 0
Resource map: not present; skipping coverage gate
Next focus: Q2 (T4 — advisory current-state content rule): severity + doc scope + false-positive control; prior art in doc/markdown linters.

Research Topic: Evaluate planned adoption of peck teachings into system-spec-kit — T3 (done iter1), T4 advisory current-state rule, T2 constitutional-rule review surface, deferred T1 AC-coverage gate. Feasibility, risks, prior art, refinements.
Iteration: 2 of 5
Focus Area: Q2 (T4) primary; opportunistically capture Q3 (T2) signals.
Remaining Key Questions:
- Q2 (T4): INFO vs WARNING severity and which docs to scan when broadening the current-state-only rule beyond phase parents; how do doc/prose linters (e.g., Vale, markdownlint, textlint) detect "history narrative"/banned phrasing, and how do they scope/exempt files to avoid false positives? Strict-mode interaction (WARNING becomes ERROR under --strict).
- Q3 (T2): mechanism for a constitutional-rule review surface (metadata field + read-only diagnostic); how comparable always-on-rule systems handle staleness/expiry.
- Q4 (T1, deferred): prior art for mechanical AC->test coverage mapping + blocking threshold.
- Q5 (cross-cutting): rollout/sequencing risks.
Last 3 Iterations Summary: run 1: T3 feasibility + prior art (0.86)

## GROUNDING (read in the repo worktree to anchor findings)

- T4 target rule: `.opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh` (existing fence/comment-aware scanner + forbidden tokens), registry `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`
- Rule docs incl. PHASE_PARENT_CONTENT + severity/strict semantics: `.opencode/skills/system-spec-kit/references/validation/validation_rules.md`
- Phase spec: `.../001-peck-teachings-adoption/003-current-state-discipline/spec.md`
- Sibling analysis (T4 section): `.../001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`
- Use web search for EXTERNAL prior art on prose/doc linters (Vale, textlint, markdownlint, write-good) and how they handle scoping, severity, and false-positive suppression.

## CONSTRAINTS

- LEAF agent. No sub-agents. 3-5 research actions, max 12 tool calls, ~9 minutes.
- Focus Q2 (T4); capture strong Q3 signals if cheap. Findings only — do NOT edit any spec-kit source.
- Write ALL findings to files.

## STATE FILES (paths relative to repo root = this worktree)

- State Log: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-strategy.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deltas/iter-002.jsonl

## OUTPUT CONTRACT (all THREE required)

1. **Iteration narrative** at `.../iterations/iteration-002.md` with headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. Cite evidence (repo file:line or URL).

2. **Canonical JSONL APPENDED** to the State Log (single line, newline-terminated), EXACT type "iteration":
```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<insight|evidence|thought>","focus":"T4 advisory rule"}
```
Append with `echo '<json>' >> <state-log-path>`. Must land in the file.

3. **Delta file** at `.../deltas/iter-002.jsonl`: one `{"type":"iteration",...}` line plus one record per finding/ruled_out.

Begin now. Focus Q2 (T4); write the three artifacts before finishing.
