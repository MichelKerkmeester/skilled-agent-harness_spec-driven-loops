# Gap-Analysis Brief G7 — Surfaces, modes, and executors the plan ignores

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec folders or documentation scope. Do not ask questions; produce the critique.

## Context
Reviewing implementation plan packet 035 (fixes GPT-executor reliability issues measured in packet 033, diagnosed in packet 034). Read: .opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md (phase map) + the relevant child spec under 035/00N-*/spec.md + .opencode/specs/deep-loops/034-gpt-reliability-research/research/{synthesis.md,findings-registry.md}. 033 measured 5 modes x 3 executors; 034 examined a sample of files per angle.

## Find
- Command surfaces or modes NOT touched by any phase but likely to share the same defects (e.g. the deep:ai-council :confirm path, deep:model-benchmark / skill-benchmark / ai-system-improvement lanes of deep-improvement, /doctor and other router commands, the deep:context confirm mode).
- Executors beyond gpt-5.5-fast: the fixes are validated only on that model — do any assume behavior that other opencode providers (deepseek, kimi, minimax, xiaomi) won't share? Is "GPT-safe" actually "executor-safe"?
- Files 034 sampled but did not exhaustively audit: it read 3 of N agent files, 1 prompt-pack, etc. Which un-audited files of the same class likely carry the same defect and are unaddressed?
- MCP tools, hooks, or plugins that inject executor context but weren't in scope.
- Non-deep-loop command surfaces in the repo that share the Gate-3 / presentation / routing machinery.

Output (strict): Markdown, no preamble, no questions. Section GAPS: numbered; each cites phase/finding/file as evidence, states the gap concretely, severity (blocker|major|minor), and a specific recommended amendment. 4-8 gaps. A gap must be REAL and verifiable against the cited docs, not generic advice.


## Format enforcement
Output ONLY the `## GAPS` section. NO preamble, NO process narration ("I will read...", "Now reading..."), NO verdict paragraph, NO coverage-check appendix. Start the response with the line `## GAPS`.
