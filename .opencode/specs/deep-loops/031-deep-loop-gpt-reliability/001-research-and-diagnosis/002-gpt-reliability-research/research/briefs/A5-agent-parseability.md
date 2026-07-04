# Research Brief A5 — Agent definition files: parseability for GPT executors

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the analysis.

## Measured problem (packet 033, indirect)

GPT executors mis-execute multi-section agent contracts where Claude does not:
absorption (ignoring "dispatch, don't do it yourself"), partial presentation
(ignoring output templates), Gate-3 priority inversion. One hypothesis is that
our agent definition files are Claude-shaped: long, many sections, rules spread
across prose, hard blockers mixed with style guidance — and GPT latches onto
the wrong parts. This angle tests that hypothesis against the actual files.

## Your task

Read (repo-root relative):
1. `.opencode/agents/deep-research.md` (LEAF agent GPT absorbed on RSB-007)
2. `.opencode/agents/orchestrate.md` (the router agent for E4 hand-offs)
3. `.opencode/agents/ai-council.md` — skim its section structure (it is long);
   focus on how §8 OUTPUT FORMAT and hard rules are marked vs surrounding prose.

Analyze structure, not content: how many rules per file; where are the HARD
constraints relative to the start; are imperatives distinguishable from
narration (markers, casing, tables vs prose); is there a single authoritative
"do this first" list; how deep must an executor read before hitting the
dispatch/output contract? Contrast against known GPT instruction-following
behavior (recency/primacy sensitivity, literal-mindedness on enumerated lists,
weak adherence to constraints buried mid-document). Identify the top structural
changes that would make these SAME contracts more reliably followed by a
non-Claude executor without changing their meaning.

## Output contract (strict)

Markdown, no preamble, no questions. Sections:

### FINDINGS
Numbered, each citing `file:line` (or file:section). Structural, specific.

### PROPOSALS
Numbered. Each: **Tag** (simplify|optimize|re-approach), **Change** (file +
concrete structural edit, e.g. hoist hard blockers to a numbered contract block
at top, add a machine-readable rules header, split narration from rules),
**Expected effect** (which failure class + benchmark cells), **Effort** (S|M|L),
**Risk**.

3-6 findings, 3-5 proposals.
