# Iteration 026 — Merge Handover Into One Continuity Stack

Date: 2026-04-10

## Research question
Should `system-spec-kit` keep `@context-prime`, `/speckit:resume`, `/speckit:handover`, and `@handover` as separate operator-facing continuity surfaces, or is that too much fragmentation for one "continue the work safely" concern?

## Hypothesis
Babysitter will show that continuity can stay powerful without being split across multiple top-level concepts, because resume and continuation are handled as one run lifecycle rather than separate bootstrap and handoff products.

## Method
I compared Spec Kit's bootstrap, resume, and handover surfaces with Babysitter's resume wrappers and run-continuation model.

## Evidence
- `@context-prime` exists solely to bootstrap a session, return a Prime Package, and finish in under 15 seconds. [SOURCE: .opencode/agents/context-prime.md:22-39] [SOURCE: .opencode/agents/context-prime.md:57-66]
- `/speckit:resume` already owns spec detection, continuation validation, memory-choice prompts, artifact checks, and progress calculation through a long YAML-driven setup phase. [SOURCE: .opencode/commands/speckit/resume.md:7-18] [SOURCE: .opencode/commands/speckit/resume.md:29-41] [SOURCE: .opencode/commands/speckit/resume.md:73-141] [SOURCE: .opencode/commands/speckit/resume.md:177-216]
- `/speckit:handover` is a separate command with its own setup prompt, validation layer, YAML workflow, and dedicated sub-agent dispatch. [SOURCE: .opencode/commands/speckit/handover.md:7-24] [SOURCE: .opencode/commands/speckit/handover.md:34-48] [SOURCE: .opencode/commands/speckit/handover.md:113-140] [SOURCE: .opencode/commands/speckit/handover.md:168-217]
- `@handover` separately reads spec files, extracts last/next actions, and writes `handover.md`, even though resume already reasons about the same continuation state. [SOURCE: .opencode/agents/handover.md:22-32] [SOURCE: .opencode/agents/handover.md:40-47] [SOURCE: .opencode/agents/handover.md:49-83]
- Babysitter exposes continuity with a thin resume wrapper: the OpenCode `/babysitter:resume` command just invokes the babysit skill and, if needed, helps discover the best unfinished run to continue. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/resume.md:2-8]
- The repo-level guidance treats resume as part of the normal harness lifecycle alongside call and observe, not as a separate documentation subsystem. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:48-62] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:157-180]

## Analysis
Spec Kit currently turns continuity into three related but distinct products: bootstrap (`@context-prime`), resume (`/speckit:resume`), and session export (`/speckit:handover`). Each one makes sense in isolation, but together they create too many operator concepts for what is fundamentally one job: "tell me where I am, what matters, and how to continue safely." [SOURCE: .opencode/agents/context-prime.md:24-45] [SOURCE: .opencode/commands/speckit/resume.md:31-41] [SOURCE: .opencode/commands/speckit/handover.md:126-146]

Babysitter keeps the evidence trail and run lifecycle intact, but continuity stays mentally simple. You resume the run, inspect it if needed, and continue. The model does not require a separate user-facing "bootstrap specialist" plus a separate handover ceremony just to preserve state. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/resume.md:2-8] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:48-62]

The transferable lesson is not to delete handover artifacts. It is to collapse continuity UX into one canonical surface and treat export/bootstrap as modes of that surface, not sibling products.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Continuation is split across `@context-prime`, `/speckit:resume`, `/speckit:handover`, and `@handover`, with separate prompts, validation steps, and output formats.
- **External repo's equivalent surface:** Babysitter exposes continuity mainly as run resume plus run inspection; the same orchestration model owns both active and resumed work.
- **Friction comparison:** Spec Kit asks the operator to understand multiple continuity concepts and when to use each one. Babysitter mostly asks a simpler question: which run are we continuing?
- **What system-spec-kit could DELETE to improve UX:** Delete `/speckit:handover` as a separate top-level lifecycle concept, or demote it to a `resume` sub-mode such as `--save-continuation`.
- **What system-spec-kit should ADD for better UX:** Add one continuity command that can bootstrap, resume, and optionally emit a continuation artifact from the same state model.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge bootstrap, resume, and handover into one continuity stack. Handover artifacts can remain, but they should be outputs of the continuity workflow rather than a separate public product.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Separate continuity commands and agents for bootstrap, resume, and handover. [SOURCE: .opencode/agents/context-prime.md:32-45] [SOURCE: .opencode/commands/speckit/resume.md:37-60] [SOURCE: .opencode/commands/speckit/handover.md:113-140]
- **External repo's approach:** Resume is a thin wrapper over the main babysit lifecycle and run model. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/resume.md:2-8] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:48-62]
- **Why the external approach might be better:** It lowers mental overhead and reduces duplicated continuation logic.
- **Why system-spec-kit's approach might still be correct:** Separate export and bootstrap surfaces can be helpful during migration while the continuity model is still evolving.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Make `/speckit:resume` the canonical continuity entry point and move handover generation plus bootstrap summaries behind flags or sub-modes.
- **Blast radius of the change:** medium
- **Migration path:** route `/speckit:handover` and `@context-prime` behaviors through the continuity stack first, then deprecate the separate public entry points once parity is proven.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/commands/speckit/resume.md`, `.opencode/commands/speckit/handover.md`, `.opencode/agents/context-prime.md`, `.opencode/agents/handover.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** decide the canonical continuity command shape and output modes
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that Babysitter needs a separate public handover product to preserve session continuity, but its run model and resume wrapper indicate the opposite: continuity remains centered on the existing run rather than on a new artifact-centric command family. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/commands/resume.md:2-8] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:48-62]

## Follow-up questions for next iteration
- How many current public skills are actually operator-facing necessities versus internal routing artifacts?
- Should skill routing stay mandatory on every non-trivial turn, or only when intent is genuinely ambiguous?
- Can operator policy be generated instead of hand-maintained across AGENTS, constitutional docs, and command wrappers?
