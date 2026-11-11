# Review Iteration 004

## Dispatcher

- Run: fanout-luna-1794335564064-t156gg; lifecycle: new; fan-out lineage mode: auto.
- Focus dimension: maintainability. Operator review_focus: The env-secret-guard change: core .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs, its runtime adapters (Claude, Codex, Cursor, Devin, Pi, DSH, OpenCode plugin), the hook-registry entry, CE-P06/CE-P07 playbook scenarios and the docs that list it. Hunt for dotenv reads or writes the guard misses, false denials, value leaks from the inspection tools, and doc claims the code does not back. Never open a real .env file.
- This pass reviewed the shared core’s organization, public exports, dependency footprint, parser boundaries, and documented recursion/file-size limits. It addresses maintainability and defensive control flow without re-running exhausted adapter-error, inspection-boundary, runtime, test, or playbook approaches.
- Budget profile: scan.

## Files Reviewed

- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:16
- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:31
- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:94
- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:656

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Command-substitution path assignment can read .env without refusal (carried active)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:270 -- The maintainability scan did not change the active security finding; see iteration 1 adjudication.
Finding class: security
Scope proof: The packet includes direct shell reading programs and cat is supported.
Affected surface hints: Shared core shell classifier and core-backed adapters.
Case: f="$(printf .env)"; cat "$f" reads .env in a shell without a guard denial.

### P2 Findings

2. **Single-quoted variable reference is expanded and falsely denied (carried active)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:200 -- The parser's quote-context loss remains active.
Finding class: correctness
Scope proof: Quoted shell-reader arguments are classified by the core.
Affected surface hints: Shared shell tokenizer.
Case: With f=.env, cat '$f' targets a literal file named $f, while the guard expands it and denies.

3. **.env* is denied when only the exempt .env.example exists (carried active)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:305 -- The glob branch still evaluates a synthetic .env candidate.
Finding class: correctness
Scope proof: The core defines .env.example as exempt and evaluates shell globs.
Affected surface hints: Shared core glob matcher.
Case: With .env.example and no .env, cat .env* matches only the template but is denied.

4. **The central DSH coverage table omits grep although the registered guard handles it (carried active)** -- .skilled/hooks/env-secret-guard/README.md:77 -- The central runtime matrix remains incomplete for DSH grep coverage.
Finding class: traceability
Scope proof: DSH documentation lists grep; its adapter registers on every tool event; shared FILE_TOOLS includes grep.
Affected surface hints: Central runtime matrix; DSH docs; shared core.
Case: An operator reading only the central matrix is not told that DSH grep calls are checked.

## Findings - New

None. No new or refined finding was found in the maintainability pass.

## Traceability Checks

- Maintainability: clean. The core uses built-in dependencies, named constants, sectioned path/shell/inspection helpers, and a narrow explicit export surface.
- Defensive bounds: documented. MAX_INPUT_DEPTH and MAX_SHELL_NESTING bound recursive analysis; MAX_DOTENV_BYTES bounds inspection reads. This pass found no additional actionable issue beyond the active findings.
- Cross-reference fallback: performed after all four dimensions were covered. Iterations 1-3 and their deltas align on three initial findings plus one traceability finding, and the reducer registry holds the same four active findings. Iteration 1's field-shape warnings are recorded below; verify-iteration.cjs returned ok for its narrative, route proof, and delta.

## Integration Evidence

No new runtime integration surface was reviewed in this maintainability pass. Exact adapter and registry evidence is recorded in iterations 001-003.

## Edge Cases

- All four dimensions are now covered; the no-dimensions cross-reference fallback was performed.
- Cross-reference found four active registry findings: R1-P1-001, R1-P2-001, R1-P2-002, and R3-P2-001. Iterations 001-003 each ended CONDITIONAL, consistent with the active P1.
- Iteration 1's state row has reducer field-shape warnings because findingsSummary was a string and findingsNew was numeric. The workflow verifier accepted its narrative, route proof, and delta; iterations 2-4 use the prompt-pack shape. The append-only first record remains unchanged.
- No real .env file or runtime scenario was opened or executed.
- Graph writes remain outside this lineage's write authority and were not attempted.

## Confirmed-Clean Surfaces

- Core module dependency and export boundaries are explicit; no TODO/FIXME markers appear in the reviewed core/adapters.
- Explicit resource bounds are present for recursive shell/input analysis and dotenv file reads.

## Ruled Out

- The maintainability pass found no vague cleanup or abstraction concern with a concrete in-scope failure mode.
- No fifth finding was supported by this pass.

## Next Focus

- dimension: cross-reference
- focus area: Reconcile four iteration records, deltas, active findings, and final review verdict as the no-dimensions fallback.
- reason: All four review dimensions are complete and iteration 4 reached the configured cap.
- rotation status: dimensions exhausted; cross-reference fallback.
- blocked/productive carry-forward: Productive: compare canonical state against artifacts. Blocked: do not repeat graph writes, live runtime execution, or exhausted test/playbook directions.
- required evidence: four iteration records, four deltas, active registry rows, and exact verdicts.
- recovery note: Synthesize with stopReason maxIterationsReached.

Review verdict: CONDITIONAL
