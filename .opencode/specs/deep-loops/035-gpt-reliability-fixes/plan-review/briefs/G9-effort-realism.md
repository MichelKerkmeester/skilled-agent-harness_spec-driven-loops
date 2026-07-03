# Gap-Analysis Brief G9 — Effort estimates, sequencing realism, hidden prerequisites

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec folders or documentation scope. Do not ask questions; produce the critique.

## Context
Reviewing implementation plan packet 035 (fixes GPT-executor reliability issues measured in packet 033, diagnosed in packet 034). Read: .opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md (phase map) + the relevant child spec under 035/00N-*/spec.md + .opencode/specs/deep-loops/034-gpt-reliability-research/research/{synthesis.md,findings-registry.md}. Each phase carries an S/M/L effort and a fixed position in the dependency order.

## Find
- Mis-estimated effort: a phase marked S/M that is actually much larger once you account for the mirror-across-5-commands work, test updates, or caller migrations (e.g. is 002 really M, or L once every classifier caller is updated? is 006 really S given the scorer rewrite?).
- Hidden prerequisites not expressed as dependencies: a phase that needs infrastructure (a build step, a test harness, a feature flag) that no phase creates.
- The two L phases (008 compiled-contract, 009 resumable-runs) — are they realistically shippable, or are they research-sized efforts mis-labeled as implementation phases? Should they be their own packets?
- Quick-win mismatch: 034 named a quick-win set; does 035's ordering actually front-load the highest impact-per-effort, or does the strict dependency chain force slow items early?
- Any phase whose "acceptance cells" cannot move without ALSO doing work assigned to a different phase (false independence).

Output (strict): Markdown, no preamble, no questions. Section GAPS: numbered; each cites phase/finding/file as evidence, states the gap concretely, severity (blocker|major|minor), and a specific recommended amendment. 4-8 gaps. A gap must be REAL and verifiable against the cited docs, not generic advice.


## Format enforcement
Output ONLY the `## GAPS` section. NO preamble, NO process narration ("I will read...", "Now reading..."), NO verdict paragraph, NO coverage-check appendix. Start the response with the line `## GAPS`.
