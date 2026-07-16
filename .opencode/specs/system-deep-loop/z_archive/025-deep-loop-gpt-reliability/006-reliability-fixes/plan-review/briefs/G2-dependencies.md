# Gap-Analysis Brief G2 — Phase boundaries & dependency ordering

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec folders or documentation scope. Do not ask questions; produce the critique.

## Context
Reviewing implementation plan packet 035 (fixes GPT-executor reliability issues measured in packet 033, diagnosed in packet 034). Read: .opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md (phase map) + the relevant child spec under 035/00N-*/spec.md + .opencode/specs/deep-loops/034-gpt-reliability-research/research/{synthesis.md,findings-registry.md}. Focus this iteration on the PHASE STRUCTURE: dependency order, phase boundaries, and independent verifiability.

## Find
- Hidden cross-phase couplings: a phase whose fix cannot actually be verified until a LATER phase lands (the plan claims 002 must precede P1 verification — are there other such orderings the plan misses?).
- Phases that SHARE a file/surface and will conflict or must merge (e.g. do 002 Gate-3, 006 routing, 010 injection all edit the same root policy file? do 004 receipts and 005 progress records both touch the same YAML dispatch step?).
- The claim "each phase ships and verifies independently" — where is it false?
- Whether 001 (harness hardening) is correctly first, or whether a phase depends on a harness capability 001 doesn't add.
- Mis-ordering: a P2 phase that is actually a prerequisite for a P1 phase.

Output (strict): Markdown, no preamble, no questions. Section GAPS: numbered; each cites phase/finding/file as evidence, states the gap concretely, severity (blocker|major|minor), and a specific recommended amendment. 4-8 gaps. A gap must be REAL and verifiable against the cited docs, not generic advice.
