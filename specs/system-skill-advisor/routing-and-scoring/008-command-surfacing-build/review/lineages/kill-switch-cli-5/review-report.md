# Review Report: Command Surfacing Build — kill-switch-cli-5 (pass five)

<!-- MACHINE-OWNED: lineage=kill-switch-cli-5; sessionId=fanout-kill-switch-cli-5-1794760565927-i99t40; generation=1; lineageMode=new; stopReason=maxIterationsReached -->

## 1. Executive Summary

- **Overall verdict:** PASS
- **hasAdvisories:** true (six active P2 findings; no P0 or P1)
- **Active findings:** P0 = 0, P1 = 0, P2 = 6
- **Review scope:** the pass-five `kill-switch-cli` area of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`. The reviewed files are `runtime/lib/advisor-disabled.ts`, `runtime/skill-advisor-cli.ts`, `runtime/handlers/advisor-recommend.ts`, `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/hooks/hook-flags.env.example`, the CP-003 manual scenario, `runtime/lib/README.md`, the four switch test files, the shared CLI test utils and `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, plus the shared docs that describe them (`INSTALL-GUIDE.md`, `feature-catalog/cli-surface/advisor-recommend.md`, `changelog/v1.1.0.0.md`, `.skilled/hooks/README.md`).
- **Operator review focus:** pass-five code review of command surfacing. Read `review-brief-5.txt` first. Review the `kill-switch-cli` files plus docs that describe them. Check the kill switch and direct-call switch paths, command offers on refusal/question/history/mention, Vibe journal scoring, the doctor hooks-file reading, docs against code, and holdout hygiene. Never open the three prompt files except through `jq del(.prompt)`; counts only. Change no code and write only inside the lineage folder.
- **Headline:** the kill switch and the direct-call switch work on every path this area claims. `SYSTEM_SKILL_ADVISOR_DISABLED`, its aliases, `SYSTEM_HOOKS_DISABLED` and a flags-file entry all make the CLI abstain before any daemon starts or the scorer runs; the daemon handler abstains from its own environment; the launcher's exact-set child-env allowlist no longer carries a switch, so a flagged caller cannot silence later callers. The six active P2s are documentation and test-maintenance gaps: the env index's alias column contradicts the resolver, the advisor row's Source column omits the direct-call readers, CP-003's control command does not isolate the full alias set, the launcher switch fixture covers two of ten names, the CLI alias loop excludes every `MK_` name, and the lib module map omits five modules.
- **Loop state:** four iterations completed; all four dimensions covered; the final stabilization pass found no new finding. The legal stop reason is `maxIterationsReached` because the coverage graph was unavailable and no graph-backed convergence decision exists. Release readiness is `in-progress`: the state follows the stop reason, not the verdict, so this run does not claim the graph-backed `converged` state even though no active P0 or P1 remains. The six P2s are advisories.

---

## 2. Planning Trigger

No remediation plan is required for this lineage: it has no active P0 or P1. The six P2s are advisories for a follow-up changelog/docs-maintenance pass.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": 6,
  "nextCommand": "/create:changelog",
  "remediationWorkstreams": 2,
  "specSeed": [
    "State the switch set as one table: canonical, aliases, master and the readers at the CLI, handler and prompt surfaces",
    "State the CP-003 isolation rule: the control call must unset every name the resolver honors, not only the four in the scenario"
  ],
  "planSeed": [
    "Fix ENV-REFERENCE.md:74-75 and .skilled/hooks/README.md:44 to name the MK_ aliases and the direct-call readers",
    "Extend the CP-003 control command to unset SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED, SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED and the MK_ names",
    "Drive the launcher fixture from ADVISOR_DISABLED_FLAGS instead of two literals",
    "Assert abstention for the three MK_ names in the CLI disable loop without asserting the exact reason string",
    "Refresh the runtime/lib/README.md directory tree against the real directory"
  ],
  "findingClasses": [
    "traceability/alias-table",
    "traceability/source-column",
    "traceability/scenario-isolation",
    "maintainability/test-fixture",
    "maintainability/test-filter",
    "maintainability/module-map"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md",
    ".skilled/hooks/README.md",
    ".skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md",
    ".skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/README.md"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First / last seen | Status |
|----|----------|-----------|-------|----------|-------------------|--------|
| `iter2-P2-env-alias-column` | P2 | traceability | The master-switch row says "No aliases" while the resolver honors `MK_HOOKS_DISABLED` | `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74`; `.skilled/hooks/shared/hook-flags.cjs:38-41,256-258`; `.skilled/hooks/shared/env-aliases.cjs:20-33` | 2 / 2 | active |
| `iter2-P2-env-source-column` | P2 | traceability | The advisor switch row's Source column omits the direct-call readers it claims | `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75`; `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:70-93`; `runtime/skill-advisor-cli.ts:1540`; `runtime/handlers/advisor-recommend.ts:646` | 2 / 2 | active |
| `iter2-P2-cp003-control-aliases` | P2 | traceability | CP-003's unflagged control call can abstain under a switch alias it never unsets | `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49,80`; `.skilled/hooks/shared/hook-flags.cjs:41,70-78` | 2 / 2 | active |
| `iter3-P2-launcher-switch-fixture` | P2 | maintainability | The launcher test covers two of the ten switch names it claims to keep out of the daemon env | `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:124-145`; `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81` | 3 / 3 | active |
| `iter3-P2-cli-mk-alias-filter` | P2 | maintainability | The CLI disable loop filters out every `MK_` alias, so the direct-call path never exercises those names | `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:219-221`; `.skilled/hooks/shared/env-aliases.cjs:20-49` | 3 / 3 | active |
| `iter3-P2-lib-readme-tree` | P2 | maintainability | The lib README tree omits five flat modules that exist on disk | `.skilled/skills/system-skill-advisor/runtime/lib/README.md:100-122,138-140` | 3 / 3 | active |

Every active finding carries a concrete input in its iteration narrative; none relies on inference alone. The resolver and the CLI/handler/launcher switch paths are clean.

---

## 4. Remediation Workstreams

| Lane | Findings | Order | Work |
|------|----------|-------|------|
| A. Switch docs and scenario | `iter2-P2-env-alias-column`, `iter2-P2-env-source-column`, `iter2-P2-cp003-control-aliases` | 1 | Correct the env index's alias and Source columns against `MASTER_ALIASES`/`LEGACY_ALIASES`, add the MK_ names, name the CLI/handler readers, and unset the full alias set in CP-003's control command. |
| B. Switch tests and module map | `iter3-P2-launcher-switch-fixture`, `iter3-P2-cli-mk-alias-filter`, `iter3-P2-lib-readme-tree` | 2 | Drive the launcher fixture from `ADVISOR_DISABLED_FLAGS`, stop excluding `MK_` from the CLI abstain loop, and refresh the lib tree from the directory. |

Lane A does not depend on Lane B; both are advisory and can land in one documentation-maintenance change.

---

## 5. Spec Seed

- Record the switch set as one canonical table: `SYSTEM_SKILL_ADVISOR_DISABLED`, its aliases (including the `MK_` names), `SYSTEM_HOOKS_DISABLED`, and the readers (`runtime/lib/advisor-disabled.ts`, the CLI, the daemon handler, the prompt hook and the plugin).
- Record the disabled-envelope contract: empty recommendations, `freshness: unavailable`, `ADVISOR_DISABLED`, the deciding switch name, no prompt text, and the caller's workspace root.
- Record the launcher isolation rule: the daemon child env is an exact-set allowlist and never carries a switch name.
- Record the CP-003 control rule: the unflagged control call must unset every name the resolver honors, not only the four names in the current command.
- Add a `## Rule overrides`-free, plain note that the lib README tree is a file map and must list every flat module.

---

## 6. Plan Seed

1. Edit `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74-75` and `.skilled/hooks/README.md:44`: replace "No aliases" with the `MK_HOOKS_DISABLED` alias; add the three `MK_SKILL_ADVISOR_*` names; add `runtime/lib/advisor-disabled.ts`, `runtime/skill-advisor-cli.ts` and `runtime/handlers/advisor-recommend.ts` to the advisor row's Source column.
2. Edit `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49`: extend the `env -u` list with `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`, `MK_SKILL_ADVISOR_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED`, `MK_SKILL_ADVISOR_PLUGIN_DISABLED` and `MK_HOOKS_DISABLED`.
3. Edit `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:127-145`: build the source env from `ADVISOR_DISABLED_FLAGS` so all ten names are filtered, keeping the exact-set assertion.
4. Edit `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:221`: include the three `MK_` names and assert `recommendations: []` and `daemon.calls.length === 0` for them; assert the exact reason only for the names whose string is stable.
5. Edit `.skilled/skills/system-skill-advisor/runtime/lib/README.md:100-122`: add `caller-context.ts`, `compiled-routing-flag.ts`, `df-idf.ts`, `private-skill-target.ts` and `route-exclusions.ts`, and align the key-files table with the tree.

No source change is required for the switch behavior itself; the six items are docs and regression-guard work.

---

## 7. Traceability Status

| Protocol | Level | Status | Iteration | Evidence |
|----------|-------|--------|-----------|----------|
| `spec_code` | core | pass | 1, 2, 4 | Switch claims read against the resolver and the CLI/handler/launcher readers; each active P2 re-read at its cited line. |
| `checklist_evidence` | core | pass | 1-4 | Switch paths, docs/scenario, switch tests and module map, and holdout hygiene each covered. |
| `skill_agent` | overlay | notApplicable | 1 | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No runtime mirror changed in this area. |
| `feature_catalog_code` | overlay | pass | 2 | `feature-catalog/cli-surface/advisor-recommend.md:23` matches the CLI/file and daemon/own-env split. |
| `playbook_capability` | overlay | partial (one P2) | 2 | CP-003's control command is the one playbook defect (`iter2-P2-cp003-control-aliases`). |

Holdout hygiene: the three prompt files were read only through `jq -c 'del(.prompt)' | wc -l`; counts are 224, 63 and 36 rows. No prompt text appears in any iteration, delta, report or registry entry.

---

## 8. Deferred Items

- **Cross-area switch readers**: the Python shim's `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`-only reader and the OpenCode plugin's reason-label fallback are outside the pass-five `kill-switch-cli` file list. They were checked as context and are recorded as edge cases, not findings. If a future pass reviews those files, the canonical-name question should be raised there.
- **Vibe journal scoring and the doctor hooks-file reading**: both are named in the shared pass-five focus but neither file is in the `kill-switch-cli` area of `review-scope-5.txt`. They are owned by the `vibe-hooks-doctor-5` and `accuracy-runner-5` lineages; this lineage did not review them and makes no claim about them.
- **Command-offer fit on refusal/question/history/mention**: `runtime/lib/command-attach.ts` is not in the pass-five scope list, so it was not reviewed here. The brief's offer checks belong to the lineage whose area owns that module; this lineage reports no claim about it.
- **Graph-backed convergence**: the coverage graph stayed unavailable across all four iterations. The run stops at `maxIterationsReached`; the final iteration's new-finding ratio is 0, but that is telemetry, not a graph-backed STOP.
- **Performance and security hardening beyond the switch**: no workload or exploit path was named for the switch, so no performance or security finding was raised beyond the prompt-safety check in iteration 1.

---

## 9. Audit Appendix

### Iteration Table

| Iteration | Focus | Dimensions | New findings | Ratio | Verdict | Files written |
|-----------|-------|------------|--------------|-------|---------|---------------|
| 1 | Correctness and security of the switch | correctness, security | 0 | 0.00 | PASS | `iterations/iteration-001.md`, `deltas/iter-001.jsonl` |
| 2 | Docs and scenario traceability | traceability | 3 P2 | 1.00 | PASS | `iterations/iteration-002.md`, `deltas/iter-002.jsonl` |
| 3 | Switch tests and module map | maintainability | 3 P2 | 0.50 | PASS | `iterations/iteration-003.md`, `deltas/iter-003.jsonl` |
| 4 | Stabilization and holdout hygiene | all four | 0 | 0.00 | PASS | `iterations/iteration-004.md`, `deltas/iter-004.jsonl` |

### Coverage Matrix

| File | Dimensions reviewed | Last iteration | Findings | Status |
|------|--------------------|----------------|----------|--------|
| `runtime/lib/advisor-disabled.ts` | D1, D2, D3, D4 | 4 | 0 | complete |
| `runtime/skill-advisor-cli.ts` | D1, D2, D3 | 2 | 0 | complete |
| `runtime/handlers/advisor-recommend.ts` | D1, D2, D3 | 2 | 0 | complete |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | D1, D2, D4 | 3 | 0 | complete |
| `.skilled/hooks/hook-flags.env.example` | D3 | 2 | 0 | complete |
| `manual-testing-playbook/compat-and-disable/global-disable-flag.md` | D3 | 4 | 1 P2 | complete |
| `runtime/lib/README.md` | D4 | 3 | 1 P2 | complete |
| `runtime/tests/advisor-disabled.vitest.ts` | D4 | 3 | 0 | complete |
| `runtime/tests/handlers/advisor-recommend.vitest.ts` | D1, D4 | 3 | 0 | complete |
| `runtime/tests/launcher-bootstrap.vitest.ts` | D4 | 3 | 1 P2 | complete |
| `runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | D1, D4 | 3 | 1 P2 | complete |
| `runtime/tests/skill-advisor-cli-test-utils.ts` | D1, D4 | 3 | 0 | complete |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | D3 | 2 | 2 P2 | complete |
| Shared docs (`INSTALL-GUIDE`, feature catalog, changelog, hooks README) | D3 | 2 | 0 on their own claims | complete |

### Convergence Replay

- Resolver and readers re-read: `hook-flags.cjs:38-41,70-78,256-258`, `env-aliases.cjs:20-49`, `advisor-disabled.ts:74-93`, `skill-advisor-cli.ts:1540`, `advisor-recommend.ts:646`, `system-skill-advisor-launcher.cjs:312-315`.
- Final registry: 0 P0, 0 P1, 6 P2; all four dimensions covered; `convergenceScore` 1 after the stabilization pass; `graphDecision` null, so the stop reason is `maxIterationsReached`.
- Read-only switch probes (no daemon started): `SYSTEM_SKILL_ADVISOR_DISABLED=1`, `SYSTEM_HOOKS_DISABLED=1`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=yes`, `MK_SKILL_ADVISOR_DISABLED=1` and `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` each returned empty recommendations, `freshness: unavailable`, `ADVISOR_DISABLED` and an abstain reason naming the deciding switch. The control probe with `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` reproduced `iter2-P2-cp003-control-aliases`.
- No reviewed file was modified; every write landed inside `review/lineages/kill-switch-cli-5/`.

### Dimension Breakdown

| Dimension | Verdict | Iteration(s) | Note |
|-----------|---------|--------------|------|
| Correctness | pass | 1, 4 | The switch stops the CLI and handler before daemon/scorer I/O; the launcher filter is clean. |
| Security | pass | 1, 4 | No prompt text in the disabled envelope; no switch bypass; the disabled path cannot reach an unvalidated workspace root. |
| Traceability | pass with advisories | 2, 4 | Three P2 doc/scenario gaps; the feature catalog and changelog claims hold. |
| Maintainability | pass with advisories | 3, 4 | Three P2 test/map gaps; the switch code is otherwise pinned at both boundaries. |

**Overall verdict: PASS** (six P2 advisories; no P0 or P1 active).
