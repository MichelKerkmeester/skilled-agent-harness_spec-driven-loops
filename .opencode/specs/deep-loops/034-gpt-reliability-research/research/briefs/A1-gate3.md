# Research Brief A1 — Gate-3 / CLAUDE.md gate design for autonomous executors

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope — this task modifies nothing. Do not ask any
questions; produce the analysis directly.

## Measured problem (benchmark evidence, packet 033)

When a GPT executor (gpt-5.5-fast, medium AND high reasoning) is given an
autonomous deep-loop command invocation in this repo, it halts with this exact
shape instead of executing:

> "Before I proceed, I need to ask about documentation: Which spec folder should
> own these writes? A. Use existing… B. New… C. Related… D. Skip… E. Phase folder"

This happened on autonomous cells in ALL four tested command surfaces (review
RVB-008, research RSB-008, ai-council ACB-004, improvement IMB-004/005), while
the Claude executor proceeded autonomously on the same prompts. High reasoning
effort does NOT fix it. It is the single most replicated GPT failure we have.

## Your task

Diagnose WHY the repo's instruction design produces this behavior in GPT but
not Claude, and propose concrete changes. Read these files (paths relative to
repo root):

1. `CLAUDE.md` — especially section "2. MANDATORY GATES" (GATE 3: SPEC FOLDER
   QUESTION, its "Overrides Gates 1-2" and "Ask first, then act" rules), the
   VIOLATION RECOVERY block, and the Self-Check list.
2. `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` — the machine
   contract for when Gate 3 triggers.
3. `.opencode/commands/deep/assets/deep_review_auto.yaml` and
   `.opencode/commands/deep/assets/deep_research_auto.yaml` — the autonomous
   command contracts GPT was executing when it halted.
4. `.opencode/commands/deep/assets/deep_review_presentation.txt` — the
   presentation contract for the same surface.

Analyze the interaction: what does GATE 3's wording instruct an executor to do
when a command YAML says "run autonomously"? Is there ANY explicit precedence
rule? What text would a literal-minded executor latch onto? Consider that
Claude passes — hypothesize what Claude is doing differently (e.g. treating a
prior operator instruction as the standing Gate-3 answer, weighing gate intent
vs letter) and whether the text supports or merely tolerates that reading.

## Output contract (strict)

Markdown, no preamble, no meta-commentary, no questions. Two sections:

### FINDINGS
Numbered. Each finding MUST cite evidence as `file:line` (or `file:line-line`)
from the files above. State the mechanism, not vibes.

### PROPOSALS
Numbered. Each proposal MUST have:
- **Tag**: simplify | optimize | re-approach
- **Change**: the concrete edit (which file, what text/structure changes)
- **Expected effect**: which measured failure it addresses and which benchmark
  cells (RVB-008, RSB-008, ACB-004, IMB-004, IMB-005) should flip to pass
- **Effort**: S | M | L
- **Risk**: what could regress (e.g. Claude behavior, real interactive sessions
  that DO need the spec-folder question)

Aim for 3-6 findings and 3-5 proposals. Depth over breadth: this is one angle
of a larger campaign; stay strictly on the Gate-3-vs-autonomous-command
question.
