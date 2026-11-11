# Review Iteration 003

## Dispatcher

- Run: fanout-luna-1794335564064-t156gg; lifecycle: new; fan-out lineage mode: auto.
- Focus dimension: traceability. Operator review_focus: The env-secret-guard change: core .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs, its runtime adapters (Claude, Codex, Cursor, Devin, Pi, DSH, OpenCode plugin), the hook-registry entry, CE-P06/CE-P07 playbook scenarios and the docs that list it. Hunt for dotenv reads or writes the guard misses, false denials, value leaks from the inspection tools, and doc claims the code does not back. Never open a real .env file.
- This pass compared remaining documentation that lists runtime coverage against DSH registration and the shared core tool set. It addresses documentation claims and registration coverage while avoiding exhausted spec/test/playbook and graph approaches.
- Budget profile: scan.

## Files Reviewed

- .skilled/hooks/env-secret-guard/README.md
- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs
- .skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs
- .dsh/plugins/repo-guards/README.md
- .dsh/plugins/repo-guards/adapters/README.md
- .dsh/plugins/repo-guards/index.mjs
- .skilled/hooks/README.md
- .skilled/hooks/injection-contract.md
- .claude/hooks/README.md
- .codex/hooks/README.md
- .cursor/hooks/README.md
- .devin/hooks/README.md
- .opencode/plugins/README.md
- .opencode/plugins/ARCHITECTURE.md
- .pi/extensions/README.md
- .dsh/SYNC.md
- .skilled/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md
- .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
- .skilled/changelog/skilled/v4.0.2.1.md
- .claude/settings.json
- .codex/hooks.json
- .cursor/hooks.json
- .devin/hooks.v1.json

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Command-substitution path assignment can read .env without refusal (carried active)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:270 -- Documentation review did not surface counterevidence that changes the active security finding; see iteration 1 adjudication.
Finding class: security
Scope proof: Direct shell readers are in packet scope and cat is supported.
Affected surface hints: Shared core shell classifier and adapters.
Case: f="$(printf .env)"; cat "$f" reads .env in a shell without a guard denial.

### P2 Findings

2. **Single-quoted variable reference is expanded and falsely denied (carried active)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:200 -- Quote context is still discarded before expansion.
Finding class: correctness
Scope proof: Quoted shell-reader arguments are classified by the core.
Affected surface hints: Shared shell tokenizer.
Case: With f=.env, cat '$f' targets a literal path named $f, while the guard expands it and denies.

3. **.env* is denied when only the exempt .env.example exists (carried active)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:305 -- The matcher considers a synthetic .env candidate before directory entries.
Finding class: correctness
Scope proof: The core has an explicit template exemption and shared glob evaluation.
Affected surface hints: Shared core glob matcher.
Case: With .env.example and no .env, cat .env* matches only the template but is denied.

4. **The central DSH coverage table omits grep although the registered guard handles it** -- .skilled/hooks/env-secret-guard/README.md:77 -- The central runtime matrix lists DSH tools it judges as read, write, edit, apply_patch, and bash, while the DSH plugin README lists grep and the adapter registers on every tools/pre-execute event. The shared core includes grep in FILE_TOOLS, so the central matrix understates the guarded surface.
Finding class: traceability
Scope proof: The central integration table is in scope and its Tools it judges column enumerates DSH coverage.
Affected surface hints: Env-secret-guard README runtime table; DSH repo-guards docs and adapter; shared core FILE_TOOLS.
Case: An operator consulting only the central README is not told that DSH grep calls are checked, although the DSH README and registered core path show they are.

## Findings - New

- New findings this iteration: one P2 documentation coverage omission; three earlier findings remain active.

## Traceability Checks

- Runtime docs to core: partial. The central runtime matrix matches named hook paths and denial shapes in inspected configurations, but its DSH tools cell omits grep.
- DSH coverage: partial. .dsh/plugins/repo-guards/README.md:91 lists grep; .dsh/plugins/repo-guards/adapters/README.md:31 says every tool; the adapter registers tools/pre-execute at .skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs:32-36; FILE_TOOLS contains grep at .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:32-36.
- Other runtime docs: no conflicting registration or inspection-tool claim found in inspected READMEs, configurations, environment reference, feature catalog, or changelog.
- Graph-backed traceability and live scenario execution remain blocked/not run and were not retried.

## Integration Evidence

- .skilled/hooks/env-secret-guard/README.md:69-79 is the central runtime/tools/denial-shape matrix and omits grep in its DSH row.
- .dsh/plugins/repo-guards/README.md:91 names grep among env-secret-guard pre-execute tools.
- .dsh/plugins/repo-guards/adapters/README.md:31 says the guard runs on every tool.
- .skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs:32-36 subscribes to tools/pre-execute and delegates to evaluateToolCall.
- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:32-36 includes grep in FILE_TOOLS.
- Parsed Claude, Codex, Cursor, and Devin hook configs point to the shared command adapter; the other named runtime docs match their adapters and registry paths.

## Edge Cases

- Three earlier findings remain active; no claim was resolved in this traceability pass.
- No real .env or live runtime scenario was opened or executed.
- Exhausted directions were not retried: no graph writes, playbook runs, or repeated spec/test checks.

## Confirmed-Clean Surfaces

- Named runtime adapter paths align with inspected registration/docs; the DSH tool-coverage omission is the only new discrepancy in this pass.
- The README's OpenCode-native tools and CLI fallback description align with the shared core API and CLI entry point.

## Ruled Out

- No additional runtime-path or kill-switch mismatch was found among inspected docs and configuration surfaces.

## Next Focus

- dimension: maintainability
- focus area: Review control-flow clarity, defensive bounds, error messages, and policy-to-adapter ownership across the shared guard.
- reason: The remaining dimension is maintainability; avoid repeating exhausted runtime, playbook, graph, and test directions.
- rotation status: rotate from traceability to maintainability.
- blocked/productive carry-forward: Productive: inspect boundaries and control flow. Blocked: graph writes, live execution, and exhausted test/playbook directions; do not retry.
- required evidence: bounded input/path behavior, diagnostic clarity, and remaining integration dependencies.
- recovery note: Static review only; do not open real dotenv files.

Review verdict: CONDITIONAL
