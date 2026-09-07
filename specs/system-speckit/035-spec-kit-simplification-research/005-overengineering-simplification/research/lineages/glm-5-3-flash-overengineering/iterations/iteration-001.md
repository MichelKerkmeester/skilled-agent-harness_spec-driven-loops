# Iteration 001 — Validator rule inventory (KQ1)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 1 | focus: the 39-rule registry — what exists, what fires, what duplicates
Evidence reads: `runtime/cli/spec/validate.sh` (head + execution-path grep), `runtime/cli/lib/validator-registry.json` (full 410-line dump, 3 category/severity aggregations), `runtime/lib/validation/orchestrator.ts` (registration + gating + report sections). Reads cost: 4 shell/1 read calls.

## What exists

The authoritative rule list is `runtime/cli/lib/validator-registry.json` (410 lines, 39 `rule_id` rows — the dispatch prompt's "39" verified). Script targets: 28 `rules/check-*.sh` + 2 `validation/generated-metadata-*.ts` referenced by `script_path` (confirmed: `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` rows resolve to `.ts` files, unlike every other row). Physical multiplexing exists: 5 `CANONICAL_SAVE_*` rows → 1 physical script (`rules/check-canonical-save.sh`), switched by the `SPECKIT_CANONICAL_SAVE_RULE` env var set/unset around `run_check` (`runtime/lib/validation/orchestrator.ts:152-163`).

Severity mix (counted): **32 error / 5 warn / 2 info**; no row declares `skip`, although `RegistrySeverity` declares it as the documented off-switch (`orchestrator.ts:106-111`: "(`skip` disables it entirely)"). Execution splits into two machineries: TS-native rules appended directly into `entries` (`orchestrator.ts:950-970`) and shell-registry rules dispatched through the 56-line embedded bash wrapper `REGISTRY_SHELL_RULE_WRAPPER` (`orchestrator.ts:119-174`, a `String.raw` template literal with `${'${'}...` brace-escapes). The gating predicate `shouldRunRegistryShellRule` (`orchestrator.ts:417-423`) skips severity-`skip` rows, `strict_only` rows outside `--strict`, and rows already produced natively.

## Findings

**F1 [P1 — clear waste] Registry of 39 rules maintained across 31 physical targets, with three vocabularies.**
- Where: `runtime/cli/lib/validator-registry.json:1-410`; `runtime/lib/validation/orchestrator.ts:119-174,152-163,950-970`.
- Cost: 39 rule descriptions + 39 report rows + 3 separate places that know the severity/status vocabulary (registry JSON, `RegistrySeverity`/`mapShellRuleStatus` at `orchestrator.ts:109-111,293-300`, and validate.sh's `list_registry_rules` printer at `validate.sh:46-64` which re-derives the `"[severity][strict-only]"` display). One vocabulary change = 3 coordinated edits. 5→1 multiplex (CANONICAL_SAVE_*) means 4 report rows exist for one implementation, and the env-var indirection (`SPECKIT_CANONICAL_SAVE_RULE` set → run → unset) adds a silent-failure mode: if the wrapper fails to set it, `run_check` attributes checks to the wrong rule.
- Protects: verdict attribution and the narrowed-run contract (`ruleSubset()` at `orchestrator.ts:430-431`: unrecognized name is fatal "rather than ignored").
- Recommendation: **merge** — collapse the 5 CANONICAL_SAVE_* rows into one rule id with subcodes, drop the dead `skip` variant, target ~31 report rows.

**F2 [P2 — candidate] The registry's own display loop already drifted: it lists 2 of 3 categories.**
- Where: `runtime/cli/spec/validate.sh:52` — the loop is `for (const category of ["authored_template", "operational_runtime"])`; the registry also carries a `structural` category with 6 rows (`validator-registry.json`: GRAPH_METADATA_CHILD_IDENTITY, GRAPH_METADATA_SHAPE, METADATA_DISK_PATH_CONSISTENCY, DESCRIPTION_SHAPE, GENERATED_METADATA_INTEGRITY, GENERATED_METADATA_DRIFT).
- Cost: 6 rules — including the only two `.ts`-scripted rules — are invisible to anyone enumerating rules via that printer. Display-only today; it is the demonstrated-by-existing-evidence instance of the F1 duplication cost.
- Recommendation: **merge** (same remediation as F1; do not carry a third vocabulary).

**F3 [P2 — candidate] 3 of 39 rules (7.7%) run only under `--strict` (CONTINUITY_FRESHNESS, GENERATED_METADATA_INTEGRITY, GENERATED_METADATA_DRIFT) — authored, tested, and documented, but invisible in default validations.**
- Where: `validator-registry.json` (`"strict_only": true` ×3); gating at `orchestrator.ts:420` (`if (rule.strict_only === true && !strict) return false;`).
- Cost: the freshness contract read in the root docs (CONTINUITY_FRESHNESS/FRESHNESS paragraphs; "Regenerate metadata after any spec-doc edit, or GENERATED_METADATA_INTEGRITY fails on a fingerprint that no longer matches") fires only when the caller passes `--strict`. Any invocation that validates without the flag reports pass/warn rows as if freshness were checked; adherence depends on the agent noticing the flag at every call site.
- Recommendation: **keep** (validated capability, and the completion rule mandates `--strict`), but pair the finding with call-site verification in the command-surface pass (angle 4) — if any speckit command validates without `--strict`, that is a silent 3-rule skip.

**F4 [P2 — candidate] `skip` severity is a dead variant: declared and threaded through report mapping, exercised by 0 of 39 rows.**
- Where: `orchestrator.ts:106-111` (declaration), `:419` (`if (rule.severity === 'skip') return false;`), `:226` (report-parse acceptance of `'skip'`), `validator-registry.json` (0 usages).
- Cost: an off-switch nobody uses — one more report-mapping branch (`mapShellRuleStatus:293-300`) to keep correct with no corpus exercising it.
- Recommendation: **keep** (documented capability: it is the only way to disable a rule without deleting it), noting it as a zero-usage variant; cut or exercise it in the next registry revision.

**F5 [P2 — candidate] Severity vocabulary spread over 3 implementation paths (TS-native inline, bash `source`-based wrapper, `.ts`-scripted rows) — the mechanism that made F2's drift possible.**
- Where: `orchestrator.ts:152-163` (env-var dispatch), `:950-970` (native entries), `validator-registry.json` (mixed `script_path` targets: `.sh` and `.ts`).
- Cost: contributors learn two execution conventions for one gate; the status mapping differs (`mapShellRuleStatus` vs direct `entry()`); F2's already-observed drift is the cost cashed.
- Recommendation: **merge** — one execution path; the `.ts`-scripted rows are the natural seam.

**F6 [P2 — candidate] `LEVEL_DECLARED` and `AC_COVERAGE` are info-only, default-on: they add two report rows to every validation and cannot fail.**
- Where: `validator-registry.json` (both rows `info`), `orchestrator.ts:956,958` (`entries.push(entry('LEVEL_DECLARED', 'info', ...))`; AC_COVERAGE documented as "Default-on advisory (non-blocking)").
- Cost: 2 unconditional report rows + read cost per validation. Their outcome contribution is indirect (provenance/coverage-visibility); they earn their keep only if report readers act on them.
- Recommendation: **keep**, flagged as telemetry-dependent — if info rows are unread, demote to `--verbose`-only.

## Provisional counts (to be reconciled in the duplication pass, run 2)

- 39 registry rows → 31 distinct `script_path` targets (28 `rules/check-*.sh`, 2 `validation/*.ts`, 1 file double-counted via the 5→1 CANONICAL_SAVE multiplex); 4 further rows are expected to share physical scripts — full list pending the by-`script_path` count.
- 28 `check-*.sh` + 3 shared helpers (`.cjs`/`.mjs`) + 1 README = 32 entries in `runtime/cli/rules/`.

## Not pursued here (documented for later angles)

- Whether speckit commands call validate.sh without `--strict` → angle 4 (run 5).
- Which of the 39 rules' guard-surface is absent post memory-decommission → run 2.
