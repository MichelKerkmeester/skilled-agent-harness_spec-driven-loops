# Deep Review Iteration 002 - Correctness

## Dimension

correctness

This pass checked the 098 remediation edits themselves, with emphasis on the 001 dist rebuild, the sed-repaired vitest regex, source/dist parity, residual singular-root path drift, and the active rows carried from iteration 001.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:22`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-001.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-001.jsonl:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild/spec.md:50`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild/implementation-summary.md:55`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/002-sk-deep-token-replace/implementation-summary.md:61`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair/implementation-summary.md:60`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/implementation-summary.md:58`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/implementation-summary.md:53`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift/implementation-summary.md:55`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:552`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:409`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185`
- `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.js:172`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:40`
- `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/skill-graph/scan.js:22`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:578`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:700`
- `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement.ts:119`
- `.opencode/skills/system-spec-kit/scripts/dist/observability/smart-router-measurement.js:14`
- `.opencode/skills/system-spec-kit/scripts/observability/smart-router-analyze.ts:42`
- `.opencode/skills/system-spec-kit/scripts/dist/observability/smart-router-analyze.js:9`
- `.opencode/skills/system-spec-kit/scripts/evals/collect-redaction-calibration-inputs.ts:54`
- `.opencode/skills/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js:42`
- `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:47`
- `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/graph-metadata.json:34`

## Correctness Checks

### 098/001 dist rebuild

`index-scope-policy` source/dist parity holds for the code-graph exclusion policy: source has plural globs at `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15-17`, and dist mirrors those values at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-15`.

The sed-mangled vitest regex repair is syntactically credible in source: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185` now uses an escaped regex matching `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/`. The compiled dist test exists and remains parseable around the affected suite at `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.js:172`.

The `git log --oneline -- .opencode/skills/system-spec-kit/mcp_server/dist/ | head -n 12` sweep returned no entries in this checkout, so commit-level rebuild evidence was unavailable from git history. The current file evidence still supports that at least the code-graph policy dist was regenerated or patched to plural.

### Residual singular path audit

The targeted singular sweep found more than historical JSONL logs. Two classes are correctness-relevant:

- `mcp_server/handlers/skill-graph/scan.ts` still defaults `args.skillsRoot` to `.opencode/skill` at line 40, while dist currently defaults to `.opencode/skills` at line 22. This is source/dist drift that will reintroduce the bad runtime default on the next rebuild.
- `scripts/dist/observability/*` and `scripts/dist/evals/collect-redaction-calibration-inputs.js` still contain executable singular defaults even though their TypeScript sources are plural. Examples: dist measurement output defaults at lines 14-17 vs source lines 119-122; dist analyzer defaults at lines 9-10 vs source lines 42-43; dist redaction calibration commands at lines 42-43 vs source lines 54-55.

### 098/002-007 spot checks

`098/002`'s main actionable claim is credible for the command and agent surfaces reviewed in iteration 001. Residual `sk-deep-*` hits found under the skill-advisor scorer/tests and routing corpus are canonical skill IDs, aliases, or historical labeled prompt data rather than the renamed folder-path references targeted by 098/002.

`098/003`'s narrative repair claim is credible for the cited 096 source-state arrows and the smart-router root fix. The remaining singular mentions in 003 docs are deliberate source-state references.

`098/005` remains insufficient for P1-007. The implementation summary says the accepted path was a deferral note at `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/implementation-summary.md:58-64`, but the sampled packet still has unchecked required CHK rows at `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:47-120` while graph metadata remains `status: complete` and `completion_pct: 100` at `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/graph-metadata.json:34-35`.

`098/006` is credible for the explicitly claimed advisor state writer and Python bridge constants: source/dist generation paths are plural at `generation.ts:12` and `generation.js:9`; `audit_descriptions.py` uses plural roots at lines 47, 157, 185, and 220; `skill_advisor.py` native bridge paths use `skills` at lines 58-83; `.opencode/skill/` is absent in this checkout.

`098/007` is credible for install-guide path cleanup and honest deferral of P2-004. It does not cover the source/dist and scripts/dist issues found in this pass.

## Findings by Severity

### P0

None.

### P1

#### P1-007 [P1] Checklist evidence remains unchecked on complete packets

- File: `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:47`
- Claim: 098/005 documented a deferral note but did not backfill evidence or relabel affected packets as not completion-verified.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:47-120`, `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:138-142`, `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/graph-metadata.json:34-35`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/implementation-summary.md:58-64`.
- Counterevidence sought: graph/status relabeling away from completion-verified, inline CHK evidence backfill, or a validator policy that treats explicit deferral as satisfying completion evidence.
- Alternative explanation: 098/005 interpreted the original "OR relabel" option as allowing a deferral note. The sampled graph metadata did not perform that relabel.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: Backfill the required checklist evidence or change affected packet completion semantics so unchecked CHK rows are not represented as complete/100.

#### P1-015 [P1] `skill_graph_scan` source default still points at the deleted singular skills root

- File: `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:40`
- Claim: The remediation leaves source code with a singular default that contradicts the plural rename; current dist is plural, so a future rebuild will regress runtime behavior.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:40`, `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/skill-graph/scan.js:22`, `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:700`, `.opencode/skills/system-spec-kit/mcp_server/dist/tool-schemas.js:633`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/implementation-summary.md:78`.
- Counterevidence sought: a source-level plural default, a documented reason `skill_graph_scan` intentionally scans the deleted singular root, or a build pipeline that does not compile this source into dist.
- Alternative explanation: dist may have been patched manually or generated from a transient source state. That still leaves the checked-in source as the next-build authority.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: Change the source default and schema documentation to `.opencode/skills`, rebuild dist, and add a targeted grep/test proving `skill_graph_scan` cannot default to `.opencode/skill`.

#### P1-016 [P1] `scripts/dist` observability outputs are stale and still write/read `.opencode/skill`

- File: `.opencode/skills/system-spec-kit/scripts/dist/observability/smart-router-measurement.js:14`
- Claim: The TypeScript sources were migrated to plural paths, but generated `scripts/dist` artifacts still use singular defaults for report, JSONL, telemetry, and redaction calibration paths.
- Evidence refs: `.opencode/skills/system-spec-kit/scripts/dist/observability/smart-router-measurement.js:14-17`, `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement.ts:119-122`, `.opencode/skills/system-spec-kit/scripts/dist/observability/smart-router-analyze.js:9-10`, `.opencode/skills/system-spec-kit/scripts/observability/smart-router-analyze.ts:42-43`, `.opencode/skills/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js:42-43`, `.opencode/skills/system-spec-kit/scripts/evals/collect-redaction-calibration-inputs.ts:54-55`.
- Counterevidence sought: evidence that `scripts/dist` is intentionally not shipped or never executed, or a post-098 rebuild of the scripts dist tree.
- Alternative explanation: 098/001 scoped its rebuild to `mcp_server/dist/`. The review prompt explicitly asked for `scripts/dist/*` post-rebuild integrity, and these are executable generated outputs.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: Rebuild `scripts/dist` from the plural TypeScript sources and verify `rg '\.opencode/skill' .opencode/skills/system-spec-kit/scripts/dist --glob '!**/*.map'` leaves only intentional historical comments, if any.

### P2

#### P1-005 [P2] Resolver containment remains deferred

- File: `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`
- Status: Still advisory from iteration 001.
- Evidence: 098/004 explicitly deferred containment hardening; this correctness pass did not find new evidence that upgrades it.

#### P2-002 [P2] Generated test title still carries singular skill wording

- File: `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:409`
- Status: Still active but confirmed as wording drift, not test behavior.
- Evidence: The test title says `.opencode/skill`, but the fixture path below it uses `.opencode/skills/example/SKILL.ts` at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:413`; source mirrors the same title/path split at `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:552-560`.

#### P2-004 [P2] Copilot target-authority helper remains unresolved

- File: `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:690`
- Status: Still active from iteration 001.
- Evidence: 098/007 deferred the finding and did not locate the branch. This pass did not reclassify it.

#### P2-008 [P2] Singular schema/default text remains beyond code-graph policy

- File: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:578`
- Status: Still active, partially subsumed by P1-015 for `skill_graph_scan`.
- Evidence: `includeSkills`, `includeAgents`, and `includeCommands` schema text still says singular `.opencode/skill`, `.opencode/agent`, and `.opencode/command` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:578-581`; the `skill_graph_scan` `skillsRoot` description still advertises default `.opencode/skill` at line 700.

## Traceability Checks

| Protocol | Status | Evidence |
| --- | --- | --- |
| spec_code | fail | `index-scope-policy` parity passes, but `skill-graph/scan.ts:40` conflicts with `dist/scan.js:22`, and `scripts/dist` conflicts with plural TypeScript sources. |
| checklist_evidence | fail | P1-007 remains active: unchecked CHK rows coexist with `complete`/`100` graph metadata. |
| skill_agent | pass | Actionable deep-review/deep-research folder path replacements remain credible; residual `sk-deep-*` hits are aliases/tests/corpus data. |
| agent_cross_runtime | pass | No new cross-runtime agent correctness drift was found in this pass. |
| feature_catalog_code | fail | Tool schema text and the source `skill_graph_scan` default still advertise/use singular roots. |
| playbook_capability | pass | No new playbook-prompt rendering issue was found in this correctness pass. |

## Verdict

FAIL.

The original code-graph policy dist rebuild looks credible, and the sed-mangled vitest regex repair appears correct. The verdict still cannot flip: P1-007 remains active, and this pass adds two correctness P1s around source/dist integrity. Current dist and source disagree for `skill_graph_scan`, and `scripts/dist` is stale relative to plural TypeScript sources.

## New Findings Ratio

2 new findings / 7 total active-or-carried findings = 0.2857.

## Next Dimension

security
