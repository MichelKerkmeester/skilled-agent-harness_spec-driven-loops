DEEP-RESEARCH

# Deep-Research Iteration 004 — reviewer token-budget read discipline

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined peck's README (2026-06-02) -> teachings T1-T4; T2/T3/T4 adopted; T1 DEFERRED. Mine peck-master's ACTUAL SOURCE for NET-NEW mechanisms beyond T1-T4. Do NOT re-derive T2/T3/T4; assess only the DELTA vs spec-kit.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- spec-kit:    `.opencode/skills/system-spec-kit/`
- agent defs:  `.opencode/agents/` and `.claude/agents/`

## FOCUS — answer ONLY this
peck's `code-reviewer` imposes an explicit TOKEN-BUDGET read discipline on the reviewer agent. Read:
- peck `external/peck-master/src/assets/agents/code-reviewer.md` (the DO rule: "Read past the diff when needed, but each file read costs tokens - only open a file when the diff alone doesn't answer your question. Before reading, state the specific reason... Never read a newly added file - the diff is already its full content"); also note `acceptance-reviewer.md` read-scope framing
- spec-kit reviewer/agent budget surfaces: `.opencode/agents/review.md` (read-only review agent), `.opencode/agents/context.md` (LEAF retrieval), `.opencode/skills/deep-review/SKILL.md` and `.opencode/skills/deep-research/SKILL.md` (tool-call budget / "max 12 tool calls per iteration")

Determine: spec-kit caps TOOL CALLS (e.g. max 12 per iteration) but does it have peck's qualitatively different discipline — "justify each file read BEFORE opening it; never re-read a file whose full content you already hold (a newly-added file or the diff itself)"? Is this a real token-efficiency gap for @review / @context / deep-review / deep-research agents? Would adopting a "state the reason before each non-diff read" rule improve cost/focus without harming recall? Verdict for each.

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-7 findings. Each: `[F-004-MM] <claim>` with BOTH a peck `file:line` and a spec-kit `file:line`. For each: GAP (real/partial/none + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: what is NOT net-new (already shipped), cited.
### METRICS
newInfoRatio: <0.0-1.0 vs T1-T4 baseline>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
