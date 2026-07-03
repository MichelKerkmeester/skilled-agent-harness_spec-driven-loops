# Gap-Analysis Brief G6 — Is the 033 benchmark a sufficient acceptance test?

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec folders or documentation scope. Do not ask questions; produce the critique.

## Context
Reviewing implementation plan packet 035 (fixes GPT-executor reliability issues measured in packet 033, diagnosed in packet 034). Read: .opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md (phase map) + the relevant child spec under 035/00N-*/spec.md + .opencode/specs/deep-loops/034-gpt-reliability-research/research/{synthesis.md,findings-registry.md}. The plan makes the 033 behavior benchmark the acceptance harness for every phase.

## Find
- What can the 033 benchmark NOT catch that these fixes could break? (e.g. behaviors on inputs outside the 32 scenarios, other executors, real user prompts.)
- SINGLE-SAMPLE weakness: every 033 cell is one run; the plan re-runs cells to confirm flips — is a single post-fix pass sufficient given GPT nondeterminism (033 itself saw high fail-close one cell, pass its sibling)? Should acceptance require N-sample?
- MULTI-CAUSE cells: ACB-004 fails via Gate-3 (med) AND stall (high). The plan mentions primary/secondary cause adjudication — is that actually specified anywhere as a concrete mechanism, or hand-waved?
- The benchmark's OWN known gaps (the path-token confound F-025, the rewrite-detection gap F-014) — phase 001 fixes them, but does anything else in the harness undermine acceptance (host confound on latency, watchdog tuning)?
- Does any phase lack a real acceptance cell (007 agent-contracts, 010 injection say "indirect/cross-class") — how would you actually prove those worked?

Output (strict): Markdown, no preamble, no questions. Section GAPS: numbered; each cites phase/finding/file as evidence, states the gap concretely, severity (blocker|major|minor), and a specific recommended amendment. 4-8 gaps. A gap must be REAL and verifiable against the cited docs, not generic advice.


## Format enforcement
Output ONLY the `## GAPS` section. NO preamble, NO process narration ("I will read...", "Now reading..."), NO verdict paragraph, NO coverage-check appendix. Start the response with the line `## GAPS`.
