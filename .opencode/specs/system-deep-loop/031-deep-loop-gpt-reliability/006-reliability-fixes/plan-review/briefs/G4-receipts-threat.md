# Gap-Analysis Brief G4 — Dispatch receipts: threat model & runtime feasibility

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec folders or documentation scope. Do not ask questions; produce the critique.

## Context
Reviewing implementation plan packet 035 (fixes GPT-executor reliability issues measured in packet 033, diagnosed in packet 034). Read: .opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md (phase map) + the relevant child spec under 035/00N-*/spec.md + .opencode/specs/deep-loops/034-gpt-reliability-research/research/{synthesis.md,findings-registry.md}. Focus on phase 004 (dispatch-receipts) + F-041 design (034 iter-012): an HMAC receipt written by the dispatch mechanism, never exposed to the child.

## Find
- THREAT MODEL HOLES: is the HMAC actually unforgeable in this runtime? Where is the key generated/stored? Can a compromised or clever executor obtain it (env leakage, shared filesystem, re-reading the parent process, the audited wrapper itself)?
- Feasibility: does opencode's CLI dispatch expose a child pid/session id the parent can bind? Is runAuditedExecutorCommand actually reachable from the CLI branch, or is that an assumption?
- What breaks: existing consumers of the model-written route-proof fields (reducers, tests, dashboards) when those fields become advisory.
- Does the design cover the NATIVE Task path AND the CLI path symmetrically, or only one?
- Failure modes: what happens on a legitimate dispatch where the receipt write fails (disk, race, concurrent session)?

Output (strict): Markdown, no preamble, no questions. Section GAPS: numbered; each cites phase/finding/file as evidence, states the gap concretely, severity (blocker|major|minor), and a specific recommended amendment. 4-8 gaps. A gap must be REAL and verifiable against the cited docs, not generic advice.


## Format enforcement
Output ONLY the `## GAPS` section. NO preamble, NO process narration ("I will read...", "Now reading..."), NO verdict paragraph, NO coverage-check appendix. Start the response with the line `## GAPS`.
