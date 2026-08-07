# Gap-Analysis Brief G5 — Progress records: root cause vs symptom

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec folders or documentation scope. Do not ask questions; produce the critique.

## Context
Reviewing implementation plan packet 035 (fixes GPT-executor reliability issues measured in packet 033, diagnosed in packet 034). Read: .opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md (phase map) + the relevant child spec under 035/00N-*/spec.md + .opencode/specs/deep-loops/034-gpt-reliability-research/research/{synthesis.md,findings-registry.md}. Focus on phase 005 (progress-records) + F-043 (034 iter-014): started/completed JSONL on steps expected >60s.

## Find
- Does the fix address the ROOT CAUSE (protocols license dark windows / heavy atomic units) or just paper over it so the watchdog resets while the underlying slowness/over-work remains?
- Could progress records MASK a real stall — a model emitting heartbeat-shaped records while making no true progress? The design says "step transitions only, no timers" — is that enforceable, or can a literal executor emit started/completed around trivial no-ops?
- Interaction with the budget/pacing phase (009): progress records reset the no-progress watchdog but not the HARD budget — does IMB-001-high still die at the hard cap even with progress records?
- The "60s" threshold: arbitrary? Does it fit the measured stall durations (council 12-14min, context 4min)?
- Does council "persist each seat stepwise" change the OUTPUT contract in a way that breaks persist-artifacts.cjs or the council report schema?

Output (strict): Markdown, no preamble, no questions. Section GAPS: numbered; each cites phase/finding/file as evidence, states the gap concretely, severity (blocker|major|minor), and a specific recommended amendment. 4-8 gaps. A gap must be REAL and verifiable against the cited docs, not generic advice.


## Format enforcement
Output ONLY the `## GAPS` section. NO preamble, NO process narration ("I will read...", "Now reading..."), NO verdict paragraph, NO coverage-check appendix. Start the response with the line `## GAPS`.
