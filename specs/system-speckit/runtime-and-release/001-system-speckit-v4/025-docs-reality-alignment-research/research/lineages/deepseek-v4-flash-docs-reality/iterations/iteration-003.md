# Iteration 3: References contradicting runtime behavior (exit codes, rule names, file layout, defaults) (F3)

## Focus

Hold focus F3: find validation references whose claimed runtime behavior (exit codes, severity meaning, rule names) contradicts the actual orchestrator/registry. This pass centered on `references/validation/validation-rules.md` and the `--strict` warning semantics and the `CONTINUITY_FRESHNESS` rollout note.

## Findings

### F3-01 — `--strict` does NOT turn warnings into validation errors (P1 misleading)

**Doc claim (quoted):** `references/validation/validation-rules.md:44` — "In non-strict mode, warnings are reported without changing the success exit code; in **strict mode, warnings exit as validation errors**." The severity→exit table at `:38-42` carries the same premise (`WARNING | 0 | 2 | Passed with issues, should fix`).

**Actual behavior:** `runtime/lib/validation/orchestrator.ts:984-989` — "A warning is advice. Promoting every one of them to a hard failure under strict made the registry's severity tiers decorative... **Strict still decides which rules RUN; it no longer decides what a warning MEANS.**" The pass determination is `passed: summary.errors === 0` (`:989`), and `summary.errors` counts only `status === 'error'` entries (`:975`). A `warn` entry therefore does not make the run fail; `process.exitCode = report.passed ? 0 : 2` (`:1100`) stays 0 with warnings present. `--strict` selects which rules run (strict_only) and does not promote warnings.

- Doc: [SOURCE: references/validation/validation-rules.md:44] (also :38-42)
- Actual: [SOURCE: runtime/lib/validation/orchestrator.ts:984-989,1100]; [SOURCE: runtime/cli/spec/validate.sh] (help: "--strict Warnings as errors" is itself the misleading phrasing)
- Severity: P1
- One-line fix: change line 44 to "`--strict` selects which rules run; warnings remain advice and do not change the success exit code." Also correct the validate.sh `--strict` help line.

### F3-02 — `CONTINUITY_FRESHNESS` stale `warn` does NOT already block `--strict` (P1 misleading)

**Doc claim (quoted):** `references/validation/validation-rules.md:122` — "When it does run under `--strict`, any warning becomes exit 2, so a stale-freshness `warn` already FAILS the completion gate even with `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` unset." Row `:127` repeats it: "Reclassifies the stale-freshness result label from `warn` to `error`. **Does not change the `--strict` exit code (both already exit 2)**."

**Actual behavior:** The registry entry for `CONTINUITY_FRESHNESS` states: "The rule **reports warn by default and escalates to fail under `SPECKIT_COMPLETION_FRESHNESS_ENFORCE`**." And the orchestrator's `passed: summary.errors === 0` (`:989`) means a `warn` does not fail. So with `ENFORCE` unset, a stale-freshness `warn` reports and passes (exit 0); only with `ENFORCE=true` does the inner label become `error` and block (exit 2). The doc's claim that warn "already FAILS" and that "both already exit 2" is reversed from the registry's own description and the orchestrator.

- Doc: [SOURCE: references/validation/validation-rules.md:122,127]
- Actual: [SOURCE: runtime/cli/lib/validator-registry.json] (CONTINUITY_FRESHNESS description); [SOURCE: runtime/lib/validation/orchestrator.ts:989]
- Severity: P1
- One-line fix: rewrite the "Completion-blocking note" to state a stale `warn` does not block; `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` escalates the inner label to `error` and is what makes `--strict` fail.

## Sources Consulted

- references/validation/validation-rules.md:38-44,70-135
- runtime/lib/validation/orchestrator.ts:31-420,940-999,1030-1104
- runtime/cli/lib/validator-registry.json (CONTINUITY_FRESHNESS entry)
- runtime/cli/spec/validate.sh (help text, exit-code header)
- references/validation/path-scoped-rules.md, five-checks.md, phase-checklists.md (rule-name scan)

## Assessment

- newInfoRatio: 0.95
- Novelty justification: F3-01/F3-02 are new exit-code-semantics findings, directly grounded in orchestrator lines; the rule-name/layout scan (path-scoped, five-checks, phase-checklists) added no new rule-name mismatches.
- Confidence notes: Both findings are confirmed at the code/registry level and align with the framework's own authoritative statement in §Completion Verification Rule (warnings do not fail; ENFORCE escalates to error). F3-01 and F3-02 overlap conceptually but are distinct doc locations/claims; keep both.

## Reflection

- What worked: reading the orchestrator's `passed` summary computation and the registry's own severity description settles the --strict semantics unambiguously — no need to run validate.sh (which the lineage forbids).
- What failed: the rule-summary table in validation-rules.md is explicitly a "partial reference," so rule-name drift was already muted; the meaningful drift is in severity/exit semantics, not rule names.
- Ruled out: `CANONICAL_SAVE_CUTOFF` (validation-rules.md:75) is a prose reference to a real `SPECKIT_CANONICAL_SAVE_CUTOFF` env var, not a phantom rule id.

## Recommended Next Focus

[F4] playbook scenarios that cannot run verbatim today — check playbooks whose commands depend on decommissioned binaries/servers (e.g., MCP memory install, `install.sh`, memory `deploy-mcp.sh`, orphan-sweep launchagent paths).
