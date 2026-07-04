# Gap-Analysis Brief G1 — Coverage: what the plan fails to address

READ-ONLY CRITIQUE TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask questions; produce the critique.

## What you are reviewing

An implementation plan (packet 035) that fixes GPT-executor reliability problems
measured in a prior benchmark (packet 033) and diagnosed in a prior research
campaign (packet 034). Your job THIS iteration: find COVERAGE gaps — measured
failures or findings the plan does NOT address, and benchmark cells no phase
claims to fix.

Read (repo-root relative):
1. `.opencode/specs/deep-loops/035-gpt-reliability-fixes/spec.md` — the phase map
   (10 phases, what each closes, acceptance cells).
2. `.opencode/specs/deep-loops/034-gpt-reliability-research/research/findings-registry.md`
   — all 44 findings.
3. `.opencode/specs/deep-loops/034-gpt-reliability-research/research/synthesis.md`
   — the ranked packages + verification map.
4. `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/005-scorecard-and-integration/scorecard.md`
   — the measured failures (5 modes x 3 executors) the plan claims to fix.

## Find

- 033 failure classes or cells that NO 035 phase names as an acceptance target.
- 034 findings assigned to no phase (the plan claims 41/44 actionable — verify;
  are any of the "context/no-fix" findings actually actionable?).
- Failure modes present in the 033 scorecard's corrected readings that the
  synthesis under-weighted (e.g. multi-cause cells, the RVB-002 presentation gap
  at BOTH efforts, the ACB-005 confirm-halt).
- Executors, modes, or command surfaces measured in 033 but not covered by any
  fix (e.g. is deep-context fully covered? deep-improvement? the orchestrate
  hand-off path?).

## Output contract (strict)

Markdown, no preamble, no questions. Section GAPS: numbered; each cites the
phase/finding/cell it concerns as evidence, states the gap concretely, assigns
severity (blocker | major | minor), and gives a specific recommended amendment
(new phase, new requirement in an existing phase, or a re-scope). 4-8 gaps.
Precision over breadth; a gap must be REAL (verifiable against the cited docs),
not a generic "consider adding tests."
