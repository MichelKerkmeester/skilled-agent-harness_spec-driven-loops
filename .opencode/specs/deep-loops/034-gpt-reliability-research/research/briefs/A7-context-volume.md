# Research Brief A7 — Hook/session-start context volume vs GPT context discipline

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the analysis.

## Measured problem (packet 033, indirect)

Every benchmark transcript began with a large burst of SessionStart hook
output before the model saw the user prompt. GPT executors then showed
behaviors consistent with instruction overload: latching onto the repo-wide
gate text (the Gate-3 halt) over the command contract, partial rendering of
presentation templates, and silent stalls in multi-step protocols. Hypothesis:
the injected context is Claude-sized, and GPT's effective adherence degrades
with instruction volume and distance.

## Your task

Inventory what a fresh opencode/GPT session is forced to ingest before its
first token of real work. Read (repo-root relative):
1. `CLAUDE.md` (repo root) — count sections, hard blocks, gates; note ordering.
2. `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` and any
   session-start hook scripts you find under `.opencode/skills/*/scripts/hooks/`
   (list the dir first; read 1-2 representative ones).
3. `AGENTS.md` (repo root) if present.

Estimate the injected token volume and count the DISTINCT imperative rules an
executor is under before executing a command. Rank the top 5 rules by
likelihood a literal executor treats them as overriding a command contract
(Gate 3 will be one — cross-reference, do not re-derive it). Identify which
injected content is (a) load-bearing for correctness, (b) Claude-specific
convention, (c) safely deferrable to on-demand loading for autonomous command
execution. Propose a minimal "autonomous execution profile" — what a GPT
executor should receive INSTEAD when invoked purely to run one command.

## Output contract (strict)

Markdown, no preamble, no questions. Sections:

### FINDINGS — numbered, each citing `file:line` (or file+section+approx size).

### PROPOSALS — numbered. Each: **Tag** (simplify|optimize|re-approach),
**Change**, **Expected effect** (which failure class + cells), **Effort**
(S|M|L), **Risk**.

3-6 findings, 3-5 proposals.
