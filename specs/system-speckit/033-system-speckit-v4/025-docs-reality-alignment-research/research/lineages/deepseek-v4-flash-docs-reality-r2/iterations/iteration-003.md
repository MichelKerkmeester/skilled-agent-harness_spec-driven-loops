# Iteration 3: manual-testing-playbook/doctor-commands, feature-flag-reference, governance (F3)

## Focus

Hold focus F3: audit `manual-testing-playbook/doctor-commands/**`, `manual-testing-playbook/feature-flag-reference/**`, and `manual-testing-playbook/governance/feature-flag-governance.md` against the runtime ground truth — `.opencode/commands/doctor/_routes.yaml`, `.opencode/bin/compiled-route-status.cjs`, `runtime/cli/validation/continuity-freshness.ts`, `runtime/cli/lib/content-filter.ts`, `config/filters.jsonc`, and the compiled-routing tri-state parser. Excludes the pre-supplied already-found/fixed list.

## Findings

### F3-01 — `compiled-route-status.cjs` emits far more than the "four" (or "documented four") `causeCode` values (P2 misleading)

**Doc claim (quoted):** `feature-catalog/governance/feature-flag-governance.md:58` — "`compiled-serving` is the fourth code, meaning the hub is actually being served compiled right now"; and `manual-testing-playbook/governance/feature-flag-governance.md:46` — "confirm ... each with a `causeCode` from the documented four."

**Actual behavior:** `.opencode/bin/compiled-route-status.cjs` assigns at least **eight** distinct `causeCode` values, not four: `compiled-serving` (:267), `flag-off` (:235), `legacy-authority` (:231), `missing-manifest` (:214,222), `engine-throw` (:252), plus `stale-manifest` (:242), `identity-mismatch` (:262), and `compile-error` (:183). The file's own header comment (:19-28) already lists five of them. The docs' "fourth code" / "documented four" enumeration is incomplete and would mislead an operator auditing a record carrying `stale-manifest`, `identity-mismatch`, or `compile-error`.

- Doc: [SOURCE: feature-catalog/governance/feature-flag-governance.md:58]; [SOURCE: manual-testing-playbook/governance/feature-flag-governance.md:46]
- Actual: [SOURCE: .opencode/bin/compiled-route-status.cjs:18-28,183,214-267]
- Severity: P2
- One-line fix: replace "fourth code"/"documented four" with the full `causeCode` contract (at minimum the drift/break set plus `stale-manifest`, `identity-mismatch`, `compile-error`), or point operators at `compiled-route-status.cjs:18-28` as authoritative.

## Sources Consulted

- manual-testing-playbook/doctor-commands/README.md (full)
- manual-testing-playbook/doctor-commands/doctor-deep-loop-convergence.md:111-158,122-124
- manual-testing-playbook/governance/feature-flag-governance.md (full, esp. :26,46,Evidence block)
- manual-testing-playbook/feature-flag-reference/completion-freshness-validator.md (full)
- manual-testing-playbook/feature-flag-reference/filter-config-contract.md (full)
- feature-catalog/governance/feature-flag-governance.md:58,76
- .opencode/commands/doctor/_routes.yaml:1-60 (schema + speckit-retrieval, embeddings)
- .opencode/commands/doctor/assets/ (doctor-*.yaml set)
- .opencode/bin/compiled-route-status.cjs:9-28,153-167,183,198-267
- .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts; runtime/tests/continuity-freshness.vitest.ts; runtime/cli/tests/continuity-freshness.vitest.ts
- .opencode/skills/system-spec-kit/runtime/cli/lib/content-filter.ts; config/filters.jsonc
- .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:173-174 (SPECKIT_COMPLETION_FRESHNESS[_ENFORCE])

## Assessment

- newInfoRatio: 1.0
- Novelty justification: F3-01 is new to this packet. The prior passes corrected the /doctor route lists (feature-catalog category-overview / maintenance) and the strict/freshness semantics, but did NOT flag the `causeCode` enumeration incompleteness in either the governance feature-catalog entry or its playbook scenario. No re-report of the already-fixed list.
- Confidence notes: F3-01 confirmed by directly reading `compiled-route-status.cjs` (all eight `causeCode` assignments at exact lines). The completion-freshness-validator scenario's env vars (`SPECKIT_COMPLETION_FRESHNESS`, `_ENFORCE`) and continuity-freshness source/test paths all exist and match ENV-REFERENCE.md:173-174; the filter-config-contract scenario's `config/filters.jsonc` and `runtime/cli/lib/content-filter.ts` both exist.

## Reflection

- What worked: reading the compiled-route-status source (rather than trusting the doc's "four") exposed the incomplete causeCode enumeration; existence checks confirmed the remaining feature-flag-reference scenarios are accurate.
- What failed: the doctor-commands README route listing correctly names only five of the nine live routes (it omits `speckit-retrieval`, `skill-graph-freshness`, `runtime-mirrors`) — but this is adjacent to the already-fixed "doctor route lists / README.md:22 removed two" item, so it is recorded as ruled-out rather than re-reported, to avoid a duplicate.
- Ruled out: doctor-deep-loop scenarios' `runtime/scripts/{status,query,convergence}.cjs` under `.opencode/skills/system-deep-loop/runtime/scripts/` (all exist); the `.opencode/specs/...` spec folder is a symlink to `specs/` (not a mismatch). completion-freshness-validator and filter-config-contract scenarios are accurate against the runtime.

## Recommended Next Focus

[F4] manual-testing-playbook/memory-quality-and-indexing, tooling-and-scripts, retrieval — exercise the playbook scenarios (not just source-file reference lists) against the runtime to find scenarios that cannot run verbatim today.
