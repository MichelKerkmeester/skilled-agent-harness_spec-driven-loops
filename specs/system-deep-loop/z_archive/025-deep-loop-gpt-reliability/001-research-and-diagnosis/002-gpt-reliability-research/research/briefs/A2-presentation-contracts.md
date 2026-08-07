# Research Brief A2 — Command presentation/setup contracts vs GPT rendering

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the analysis.

## Measured problem (packet 033)

On bare command invocations (`:auto` with no topic/target), executors must halt
and present a consolidated setup question per the command's presentation
contract. The Claude executor renders the full contract; GPT (medium AND high)
halts correctly but renders PARTIAL presentation — benchmark cells RVB-002,
CXB-002 scored presentation 1/2 at both efforts, and vague-ask cells IMB-003
scored 0/2 at both efforts. GPT does the right thing but says it wrong.

## Your task

Read (repo-root relative):
1. `.opencode/commands/deep/assets/deep_review_presentation.txt` and
   `.opencode/commands/deep/assets/deep_context_presentation.txt` and
   `.opencode/commands/deep/assets/deep_agent-improvement_presentation.txt`
2. `.opencode/commands/deep/assets/deep_review_confirm.yaml` (how confirm-mode
   binds the presentation)
3. One command doc: `.opencode/commands/deep/review.md` (or the nearest file
   that wires presentation.txt into the command flow)

Diagnose: how does the presentation contract reach the executor's context —
verbatim template, referenced file, or paraphrased instruction? Would a GPT
executor even see the template text at halt time, or must it reconstruct the
setup question from prose rules? What makes Claude render it fully — is the
contract enforced by structure (fill-this-template) or by convention (know to
use it)? Identify the exact gap that yields partial rendering.

## Output contract (strict)

Markdown, no preamble, no questions. Sections:

### FINDINGS
Numbered, each citing `file:line` evidence. Mechanism-level.

### PROPOSALS
Numbered. Each: **Tag** (simplify|optimize|re-approach), **Change** (file +
concrete edit, e.g. inline the template into the auto/confirm YAML, add a
"render this block verbatim" fence, collapse presentation into one
machine-readable source), **Expected effect** (cells RVB-002, CXB-002, IMB-003
presentation to 2/2), **Effort** (S|M|L), **Risk**.

3-6 findings, 3-5 proposals. Stay on presentation/setup contracts only.
