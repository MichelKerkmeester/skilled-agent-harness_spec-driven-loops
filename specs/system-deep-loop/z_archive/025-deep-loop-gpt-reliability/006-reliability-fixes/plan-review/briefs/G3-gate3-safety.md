# Gap-Analysis Brief G3 — The P0 Gate-3 fix: safety holes & edge cases

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec folders or documentation scope. Do not ask questions; produce the critique.

## Context
Reviewing implementation plan packet 035 (fixes GPT-executor reliability issues measured in packet 033, diagnosed in packet 034). Read: .opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md (phase map) + the relevant child spec under 035/00N-*/spec.md + .opencode/specs/deep-loops/034-gpt-reliability-research/research/{synthesis.md,findings-registry.md}. Focus on phase 002 (gate3-precedence) + finding F-040's design (034 iter-011). The fix lets an autonomous command with a bound spec_folder SKIP the documentation gate.

## Find
- SAFETY REGRESSIONS: cases where skipping Gate 3 is DANGEROUS — a bound spec_folder that is wrong/stale/points outside intended scope; an autonomous command that binds a folder but then writes OUTSIDE it.
- Edge cases the classifier design (satisfiedBy/requiresGate3Prompt, 6 tests) does NOT cover: partial binding, :confirm mode, orchestrate-routed (E4) hand-offs, nested/phase-child folders, router commands like /doctor with mixed mutation classes.
- Whether "validly bound" is actually verifiable at classify time, or a loophole a literal executor exploits to skip the gate whenever any folder-shaped token appears.
- Interaction with the VIOLATION RECOVERY block and the "answer applies for entire session" rule.
- Does the fix regress CLAUDE's correct behavior anywhere?

Output (strict): Markdown, no preamble, no questions. Section GAPS: numbered; each cites phase/finding/file as evidence, states the gap concretely, severity (blocker|major|minor), and a specific recommended amendment. 4-8 gaps. A gap must be REAL and verifiable against the cited docs, not generic advice.
