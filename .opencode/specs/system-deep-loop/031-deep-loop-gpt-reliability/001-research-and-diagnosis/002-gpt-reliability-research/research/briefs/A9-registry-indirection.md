# Research Brief A9 — Mode-registry / command-router indirection depth

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the analysis.

## Measured problem (packet 033, indirect)

Before a deep-loop command executes, an executor must traverse several layers
of indirection: user prompt → command doc → presentation contract →
setup-resolution contract → auto/confirm YAML → skill SKILL.md → references →
agent definition → runtime scripts. GPT executors lose fidelity across hops
(Gate-3 priority inversion, partial template rendering, absorbed dispatch
steps). Each hop is a chance for a literal executor to drop or reweight an
instruction.

## Your task

Trace the FULL resolution chain for one command, `/deep:review :auto`, counting
files and instruction hand-offs. Read (repo-root relative):
1. `.opencode/commands/deep/review.md` (entry doc — where does it send you?)
2. `.opencode/commands/deep/assets/deep_review_presentation.txt`
3. `.opencode/commands/deep/assets/deep_review_auto.yaml` (skim: count the
   steps that REFERENCE OTHER FILES the executor must open)
4. `.opencode/skills/deep-loop-workflows/mode-registry.json` (what routes here)

Produce the chain as an explicit list: file → what it instructs → what it
defers elsewhere. Count total files an executor must correctly ingest before
its first productive action. Identify which hops exist for maintainer
convenience (DRY, shared includes) vs executor necessity, and which could be
FLATTENED at invocation time (e.g. a build step that compiles command doc +
presentation + YAML into ONE self-contained execution contract per command —
executors read the compiled artifact, maintainers keep the layered sources).

## Output contract (strict)

Markdown, no preamble, no questions. Sections:

### FINDINGS — numbered, each citing `file:line`; include the traced chain.

### PROPOSALS — numbered. Each: **Tag** (simplify|optimize|re-approach),
**Change**, **Expected effect** (failure classes: gate inversion, partial
rendering, absorbed steps — cells RVB-008/RVB-002/RVB-007 class), **Effort**
(S|M|L), **Risk** (source/compiled drift).

3-6 findings, 3-5 proposals.
