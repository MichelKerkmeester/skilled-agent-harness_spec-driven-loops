---
title: "Deep Review Iteration 006 — Correctness (Broadened Angle 2: Executor Single-Dispatch Routing Parity)"
trigger_phrases: []
---
# Deep Review Iteration 006 — Correctness (Broadened Angle 2: Executor Single-Dispatch Routing Parity)

## Dimension

**Correctness** — broadened pass focused on executor single-dispatch routing parity across ALL deep-loop command workflows. Focus guidance (4 sub-questions): (1) are the cursor/devin/pi single-dispatch branches present in ALL deep-loop auto.yaml files, or did the fix land only in review+research (parity gap = silent-native-fallback survives elsewhere); (2) each branch's fail-closed contract — buildLineageCommand throw-on-missing-binary, model allowlist, write-containment — consistent across files or drift; (3) confirm no deep-*.yaml still contains an else-fallthrough that silently dispatches native when a CLI executor was requested; (4) confirm deep-alignment-auto.yaml's deletion left no dangling references from sibling yaml assets or fanout-run.cjs mode tables.

## Files Reviewed

- `.opencode/commands/deep/assets/deep-research-auto.yaml:1093-1660` (executor branch block: `branch_on: "config.executor.type"` → if_native, if_cli_claude_code, if_cli_cursor, if_cli_devin, if_cli_pi, if_cli_opencode, if_cli_codex; no else clause; post_dispatch_validate follows)
- `.opencode/commands/deep/assets/deep-review-auto.yaml:1067-1772` (executor branch block: `branch_on: "config.executor.kind"` → if_native, if_cli_copilot, if_cli_claude_code, if_cli_opencode, if_cli_codex, if_cli_cursor, if_cli_devin, if_cli_pi; no else clause in dispatch block; post_dispatch_validate follows)
- `.opencode/commands/deep/assets/deep-research-confirm.yaml:1003-1156` (confirm sibling: `branch_on: "config.executor.type"`, same field convention)
- `.opencode/commands/deep/assets/deep-review-confirm.yaml:1080-1130` (confirm sibling: `branch_on: "config.executor.kind"`, includes if_cli_copilot)
- `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` (NO executor branch_on / if_cli / if_native at dispatch level — in-process council dispatch via `target_agent: ai-council` at :170)
- `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml`, `deep-model-benchmark-auto.yaml`, `deep-skill-benchmark-auto.yaml` (NO executor routing branches — no per-iteration CLI dispatch step)
- `.opencode/commands/prompt/assets/prompt_improve_auto.yaml` (NO executor routing — single-shot prompt improvement, not a deep-loop iteration dispatch)
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:58-73` (executorConfigSchema: `kind` only, no `type`), `:433-457` (normalizeExecutorConfigInput: `type`→`kind` alias with deprecation warning), `:77-100` (EXECUTOR_KIND_FLAG_SUPPORT: native, cli-codex, cli-claude-code, cli-opencode, cli-cursor, cli-devin, cli-pi — NO cli-copilot)
- `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:94` (test: "accepts deprecated executor type as an alias for kind and logs a warning")
- `.opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json:19-26` (config template uses `kind: "native"` — canonical runtime field)
- `.opencode/commands/deep/assets/compiled/deep-research.contract.md:252,268,275` (compiled contract documents `config.executor.type` as the command-layer field; `--executor` → `config.executor.type`; default `native`)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (grep for alignment/command-benchmark/conformance: 0 hits)
- `git show d1a5981b58c -- .opencode/commands/deep/assets/deep-research-auto.yaml` (commit added cursor/devin/pi using `{config.executor.type}` — followed research's existing field convention)
- `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-single-executor-parity-research.md` (DR-054 parity validation contract)

## Findings by Severity

### P0 (Critical)
None.

### P1 (Major)
None.

### P2 (Minor)

#### P2-009 Executor field-name drift: research uses `config.executor.type`, review uses `config.executor.kind` (pre-existing, observation-only)
- **File:** `.opencode/commands/deep/assets/deep-research-auto.yaml:1099` (`branch_on: "config.executor.type"`) vs `.opencode/commands/deep/assets/deep-review-auto.yaml:1073` (`branch_on: "config.executor.kind"`)
- **Claim:** The two deep-loop modes that have single-executor dispatch branch on different config field names — research on `config.executor.type`, review on `config.executor.kind`. This is a maintainability/consistency hazard: a developer porting an executor branch from review to research (or vice versa) must swap every `config.executor.kind`↔`config.executor.type` reference, and the compiled contracts document different field names for the same conceptual config knob.
- **Evidence refs:**
  - `deep-research-auto.yaml:1099` — `branch_on: "config.executor.type"`; all 7 branches substitute `{config.executor.type}` (e.g. :1143 `executorKind: '{config.executor.type}'`, :1191 `const kind = '{config.executor.type}'`).
  - `deep-review-auto.yaml:1073` — `branch_on: "config.executor.kind"`; all 8 branches substitute `{config.executor.kind}` (e.g. :1139-1140).
  - `deep-research-confirm.yaml:1009,1156` — same `type` convention; `deep-review-confirm.yaml:1080` — same `kind` convention.
  - `executor-config.ts:58-59` — schema defines only `kind`; `:433-457` — `normalizeExecutorConfigInput` aliases `type`→`kind` with a deprecation warning; `executor-config.vitest.ts:94` — test confirms the alias.
  - `deep-research.contract.md:252,275` — compiled contract documents `config.executor.type` as the command-layer field populated by `--executor`.
  - `deep-research-config.json:20` — config template uses `kind: "native"` (runtime-layer canonical field).
- **Counterevidence sought:** (1) Is this a correctness bug — does research fail to dispatch because the config template uses `kind` but the YAML branches on `type`? — No: the command layer populates `config.executor.type` from the `--executor` CLI flag (per compiled contract :275), and the runtime normalizes `type`→`kind` inside the dispatched script (executor-config.ts:433). The two layers (command/YAML vs runtime/TS) use different field names by design; the config template's `kind` is the runtime-layer field. (2) Was this drift introduced by commit d1a5981b58c? — No: `git show d1a5981b58c` shows the commit added cursor/devin/pi to research using `{config.executor.type}`, following the file's pre-existing convention. Research always used `type`; review always used `kind`. (3) Do both modes pass their vitest suites? — Yes (commit messages cite 71/71 targeted auto-YAML vitest; executor-config.vitest.ts:94 covers the alias).
- **Alternative explanation:** The `type`/`kind` split is a deliberate two-layer design (command-layer `type` populated by `--executor`, runtime-layer `kind` per the schema). Research predates the `kind` canonicalization and kept its command-layer `type`; review was written later with `kind`. Both resolve correctly via the alias. The drift is cosmetic tech-debt, not a functional defect.
- **Final severity:** P2 — pre-existing, observation-only, not introduced by the commit under review. Both modes dispatch correctly. The hazard is future porting mistakes, not a current failure.
- **Confidence:** 0.80
- **Downgrade trigger:** Would mark out-of-scope (no finding) if a future commit canonicalizes research to `kind` or documents the two-layer field-name split in the contract.
- **Finding class:** tech-debt
- **Scope proof:** `git show d1a5981b58c -- deep-research-auto.yaml` adds cursor/devin/pi with `{config.executor.type}`; the `branch_on: "config.executor.type"` line and all pre-existing branches (claude_code, opencode, codex) are unchanged by the commit.
- **Affected surface hints:** ["executor-routing", "field-naming", "research", "review"]
- **Risk score:** 1 (observation only)
- **Recommendation:** Out of scope for this commit. Consider a follow-up to canonicalize research's command-layer field to `kind` (updating branch_on, all template vars, the compiled contract, and the `--executor` mapping) so both modes share one field name, eliminating the porting hazard.

#### P2-010 Branch-set asymmetry: review has `if_cli_copilot`, research does not (pre-existing, observation-only)
- **File:** `.opencode/commands/deep/assets/deep-review-auto.yaml:1080` (`if_cli_copilot`) — absent from `.opencode/commands/deep/assets/deep-research-auto.yaml`
- **Claim:** The review executor branch block includes an `if_cli_copilot` branch (dispatching copilot but recording it as `kind:'native'`); research has no equivalent. The branch sets are asymmetric: review = {native, copilot, claude_code, opencode, codex, cursor, devin, pi} (8); research = {native, claude_code, cursor, devin, pi, opencode, codex} (7).
- **Evidence refs:**
  - `deep-review-auto.yaml:1080-1178` — `if_cli_copilot` branch with `buildCopilotPromptArg` + `runAuditedExecutorCommand`; comment at :1129-1131: "There is no cli-copilot kind in the executor schema, so it dispatches as kind:'native'".
  - `deep-research-auto.yaml` — no `if_cli_copilot` (grep across all auto.yaml confirms copilot only in review + review-confirm).
  - `executor-config.ts:77-100` — EXECUTOR_KIND_FLAG_SUPPORT has no `cli-copilot` entry; copilot is not a registered executor kind.
  - `deep-research.contract.md:252` — compiled contract documents `config.executor.type` values as `native | cli-opencode | cli-claude-code` (copilot not listed for research).
- **Counterevidence sought:** (1) Is copilot a configurable executor for research? — The research compiled contract (:252) lists only `native | cli-opencode | cli-claude-code` as documented executor values; copilot is not listed, suggesting it is review-specific by design. (2) Would a research config with `executor.type: copilot` silently degrade to native? — No: with no `if_cli_copilot` branch and no `else:` clause, an unmatched branch value produces no dispatch command → the iteration fails `post_dispatch_validate` (no iteration file written). This is fail-closed by validation, not a silent native degrade. (3) Was this asymmetry introduced by d1a5981b58c? — No: the copilot branch is not in the commit's diff for research; it is a pre-existing review-only branch.
- **Alternative explanation:** Copilot single-dispatch is a review-specific capability (review's authority-guard preamble via `buildCopilotPromptArg` is tailored to the review workflow's Gate-3 spec-folder enforcement). Research does not need it. The asymmetry is intentional, not a parity gap.
- **Final severity:** P2 — pre-existing, observation-only. The failure mode for an unsupported executor kind is fail-closed (opaque validation failure, not silent native). The asymmetry is likely by design but is undocumented as such.
- **Confidence:** 0.72
- **Downgrade trigger:** Would mark out-of-scope (no finding) if the research contract explicitly documents copilot as unsupported, or if copilot is confirmed review-only by design.
- **Finding class:** tech-debt
- **Scope proof:** `git show d1a5981b58c` does not touch any `if_cli_copilot` branch; the branch predates the commit in review and was never present in research.
- **Affected surface hints:** ["executor-routing", "cli-copilot", "branch-parity"]
- **Risk score:** 1 (observation only)
- **Recommendation:** Out of scope for this commit. If copilot is intentionally review-only, document that in the research compiled contract's executor-value list. If it should be portable, add an `if_cli_copilot` branch to research mirroring review's `buildCopilotPromptArg` pattern.

## Focus-Question Adjudication

### (1) cursor/devin/pi parity across ALL deep-loop command workflows
**CONFIRMED PRESENT in both modes that have single-executor dispatch.** `deep-research-auto.yaml` has if_cli_cursor (:1170), if_cli_devin (:1261), if_cli_pi (:1352). `deep-review-auto.yaml` has if_cli_cursor (:1496), if_cli_devin (:1587), if_cli_pi (:1678). The fix (d1a5981b58c) landed in BOTH research and review — no parity gap for cursor/devin/pi.

The other deep-loop auto.yaml files (`deep-ai-council-auto.yaml`, `deep-agent-improvement-auto.yaml`, `deep-model-benchmark-auto.yaml`, `deep-skill-benchmark-auto.yaml`) and `prompt_improve_auto.yaml` have NO executor routing branches (`branch_on: config.executor`, `if_cli_*`, `if_native` at dispatch level all absent). This is by design: ai-council dispatches an in-process council (`target_agent: ai-council` at :170), not a per-iteration CLI dispatch; the benchmark and prompt-improve modes have no per-iteration CLI executor dispatch step. **No silent-native-fallback path survives elsewhere.**

### (2) Fail-closed contract consistency
- **cursor/devin/pi (BOTH research and review):** use shared `buildLineageCommand` from `fanout-run.cjs` — throws on missing binary or off-allowlist model → uncaught in heredoc → non-zero exit. Consistent, fail-closed. [SOURCE: deep-research-auto.yaml:1189,1204; deep-review-auto.yaml:1720,1740]
- **codex (BOTH):** inline `execFileSync('/bin/sh', ['-c', 'command -v codex'])` + `process.exit(1)` on absence. Consistent, fail-closed. (Pre-existing asymmetry with buildLineageCommand = carried P2-003.) [SOURCE: deep-research-auto.yaml:1546-1553; deep-review-auto.yaml:1408-1415]
- **claude_code/opencode (BOTH):** rely on `runAuditedExecutorCommand` spawn failure (no explicit binary preflight) — weaker fail-closed (ENOENT vs explicit "executor unavailable" message) but still non-zero exit. Consistent between research and review.
- **write-containment:** cursor/devin/pi/codex branches in BOTH call `enforceWriteContainment` (revert out-of-scope writes + exit 1 on violation). claude_code/opencode/copilot branches do NOT (rely on permission-mode/sandbox flags). This divergence is pre-existing and consistent between research/review for the shared branches. [SOURCE: deep-research-auto.yaml:1604-1614; deep-review-auto.yaml:1751-1761]
- **Model allowlist:** enforced inside `buildLineageCommand` for cursor/devin/pi (one source of truth). codex/claude_code/opencode do not pass through the builder, so their model constraints are enforced by the CLI itself, not the builder. Consistent between research and review.

**Verdict: fail-closed contract is consistent across research and review for the cursor/devin/pi branches (the focus of d1a5981b58c). No drift in the new branches.**

### (3) No else-fallthrough silently dispatching native
**CONFIRMED.** Neither `deep-research-auto.yaml` nor `deep-review-auto.yaml` has an `else:` clause within the executor dispatch branch block. The branch block goes `branch_on` → `if_native` → `if_cli_*`... → `post_dispatch_validate` (no else/default). The two `else:` hits in review (:1978, :2036) are in later convergence/evaluation steps, NOT executor dispatch. An unmatched executor kind produces no dispatch command → `post_dispatch_validate` fails (assert_exists / assert_appended gates) → `on_failure.redispatch_once`. This is fail-closed by validation, not silent native. [SOURCE: grep `^\s+else:` across all three auto.yaml; post_dispatch_validate blocks at deep-research-auto.yaml:1633, deep-review-auto.yaml:1773]

### (4) deep-alignment-auto.yaml deletion — no dangling references
**CONFIRMED.** `grep -niE 'alignment|command-benchmark|conformance'` on `fanout-run.cjs` returns 0 hits. Iteration 5's mechanical sweep already confirmed 0 active alignment references across all yaml assets and all five mirror surfaces. The deleted `deep-alignment-auto.yaml` left no dangling references in sibling yaml assets or the fan-out mode tables. [SOURCE: grep output, 0 matches]

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass (carried) | No spec-code contradiction. The 024-executor-kind-routing spec's single-dispatch requirement is satisfied: cursor/devin/pi branches present in both research and review, fail-closed, no silent native fallback. |
| `checklist_evidence` | core | pass (carried) | Commit d1a5981b58c cites targeted auto-YAML vitest 71/71; not re-run (observation-only). The branch structure inspected matches the cited contract. |
| `skill_agent` | overlay | pass (carried) | ai-council/agent-improvement/benchmark modes have no executor routing by design (in-process or no per-iteration dispatch). |
| `agent_cross_runtime` | overlay | pass (carried) | No mirror-surface executor-routing files (routing lives only in .opencode canonical auto.yaml). |
| `feature_catalog_code` | overlay | pass (carried) | No new feature-catalog references. |
| `playbook_capability` | overlay | pass (carried) | DR-054 parity playbook confirms single-executor parity validation contract for research. |

## SCOPE VIOLATIONS
None. All writes confined to the three allowed state-file paths (`iterations/iteration-006.md`, `deltas/iter-006.jsonl`, `deep-review-strategy.md`) plus the append-state-record gateway write into the run directory. No reviewed source/spec/config file was modified.

## Next Dimension
All four dimensions covered (broadened pass). This iteration confirmed executor single-dispatch routing parity for cursor/devin/pi across research and review, ruled out silent-native-fallthrough and dangling alignment references, and surfaced two pre-existing P2 observations (type/kind field-name drift, copilot branch-set asymmetry). Candidate frontiers for remaining iterations (7-10): (a) generated-metadata regeneration provenance — verify hub-router.json/leaf-manifest.json/mode-registry.json/command-metadata.json/graph-metadata.json are consistent with declared sources after the 291-file removal; (b) the 035 fixture-corpus question (P2-005); (c) deeper write-containment contract divergence between buildLineageCommand branches (cursor/devin/pi/codex) and permission-mode branches (claude_code/opencode/copilot).

## Verdict
No P0 or P1 findings this iteration. Two new P2 advisories (P2-009 executor field-name drift type↔kind, pre-existing; P2-010 copilot branch-set asymmetry, pre-existing). Both are observation-only, not introduced by the commit under review. The broadened parity pass CONFIRMED: cursor/devin/pi single-dispatch branches are present in both research and review (no parity gap); the fail-closed contract is consistent across both modes for the new branches; no else-fallthrough silently dispatches native in any deep-*.yaml; and deep-alignment-auto.yaml's deletion left no dangling references in fanout-run.cjs or sibling yaml assets. P2-only → PASS with advisories.

Review verdict: PASS
