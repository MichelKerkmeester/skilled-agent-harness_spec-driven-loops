# Gap-Analysis Brief G8 — Regression risk & rollback/rollout gaps

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec folders or documentation scope. Do not ask questions; produce the critique.

## Context
Reviewing implementation plan packet 035 (fixes GPT-executor reliability issues measured in packet 033, diagnosed in packet 034). Read: .opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md (phase map) + the relevant child spec under 035/00N-*/spec.md + .opencode/specs/deep-loops/034-gpt-reliability-research/research/{synthesis.md,findings-registry.md}. Several phases edit shared, high-blast-radius surfaces (root policy, classifier, dispatch validator, prompt packs).

## Find
- For each P0/P1 phase, the specific way it could REGRESS Claude's correct behavior or a real interactive session — and whether the plan's risk table actually mitigates it or just names it.
- The rollout/rollback story: 034's synthesis mentioned feature-flagged rollout + per-command opt-in as a GAP — does 035 actually incorporate it, or did the plan drop it? Is there a phase that owns the rollout mechanism, or is every phase expected to hand-roll its own flag?
- Ordering-induced regressions: landing 002 (Gate-3 skip) BEFORE 004 (receipts) — does the autonomous-precedence bridge let an absorbing executor also skip the gate, compounding the problem in the window between phases?
- Missing baseline-protection: the plan says "baseline leg stays green" — but is there a phase or gate that ENFORCES it (CI), or is it aspirational?
- Config/versioning: changing the classifier API (satisfiedBy) — who are the existing callers, and does the plan account for updating all of them?

Output (strict): Markdown, no preamble, no questions. Section GAPS: numbered; each cites phase/finding/file as evidence, states the gap concretely, severity (blocker|major|minor), and a specific recommended amendment. 4-8 gaps. A gap must be REAL and verifiable against the cited docs, not generic advice.


## Format enforcement
Output ONLY the `## GAPS` section. NO preamble, NO process narration ("I will read...", "Now reading..."), NO verdict paragraph, NO coverage-check appendix. Start the response with the line `## GAPS`.
