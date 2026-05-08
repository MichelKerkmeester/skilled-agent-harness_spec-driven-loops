# Iteration 8 — Saturation + Adversarial Re-Verification

## Dispatcher

- **Run**: 8
- **Mode**: review
- **Focus**: saturation
- **Dimensions**: correctness, security, traceability, maintainability
- **Session**: `deep-review-102-2026-05-07T2055`
- **Executor**: cli-codex / gpt-5.5 / reasoning=high / serviceTier=fast
- **Result**: complete

This pass was a narrow STOP-veto check after all four review dimensions were covered. I treated `deep-review-findings-registry.json` as canonical for active counts: 0 P0, 2 P1, 4 P2.

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/iterations/iteration-001.md`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/prompts/iteration-008.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/review-report.md`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/005-remediation/implementation-summary.md`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- Command evidence: `opencode run --help`, `git status -s | grep -v "102-track-rereview-2/review/" | head -20`, targeted `rg`, and one `node --experimental-strip-types --input-type=module` parser probe.

## S1. Adversarial re-verification (P1-027, P1-028 second-lens)

**P1-027 stands as P1.** The contrapositive check does not downgrade it. Removing `--dangerously-skip-permissions` would create an automation/permission defect, but it would not address the recorded DeepSeek tool-name failure. `opencode run --help` exposes `--pure` as the flag that disables external plugins. The cli-opencode skill says the default dispatch target is `opencode-go/deepseek-v4-pro --variant high`, lists `--pure` as a core flag, and says to use it for plugin crashes. That matches the state-log smoke: default plugin loading injects tool names DeepSeek rejects; `--pure` removes that plugin loadout. I found no `--no-tool-prefix` flag, no model-specific exclusion list, and no YAML conditional that would solve the same failure.

Evidence:
- `cli-opencode/SKILL.md:226-234` defines the default DeepSeek-family invocation and lists `--pure`.
- `cli-opencode/SKILL.md:273,299` frames `--pure` as plugin-crash-only, which is exactly this failure mode.
- All four `if_cli_opencode` YAML branches invoke `opencode run` with `--dangerously-skip-permissions` and no `--pure`.
- `opencode run --help` shows `--pure` and `--dangerously-skip-permissions` are separate generic OpenCode run flags.

**P1-028 stands as P1.** `sandboxMode` carries a runtime-effect contract, not a no-op advisory contract. `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` includes `sandboxMode`, and the adjacent comment says it is honored via `--dangerously-skip-permissions` when `danger-full-access`, otherwise default permission prompts. A live parser probe accepted `{ kind: 'cli-opencode', sandboxMode: 'read-only' }`, but grep across the YAML dispatch surface shows every `if_cli_opencode` branch hardcodes `--dangerously-skip-permissions` regardless of the parsed value. That is a schema-to-runtime contract violation.

Evidence:
- `executor-config.ts:37-40` declares the runtime contract.
- `executor-config.ts:116-140` rejects unsupported configured fields, so listed fields are meaningful.
- Parser probe returned `sandboxMode:"read-only"` as accepted for `cli-opencode`.
- Four YAML branches hardcode `--dangerously-skip-permissions`; no downstream `resolveOpencodeSandboxMode` or equivalent exists.

## S2. Closed-gate replay re-verification (2 of 13)

Replayed two prior 099 P1s against live 100 fix surfaces.

**P1-026 reducer findings extraction — RESOLVED.** The live reducer has `deltaRecordToFinding` at `reduce-state.cjs:505-541`, and `buildFindingRegistry` now accepts `deltaRecords = []` and processes `type:"finding"` records first at `reduce-state.cjs:543-575`. That matches the 100 remediation claim and the iter-2 verification.

**Random non-reducer pick: P1-021 smart-router shared CLI path resolver — RESOLVED.** Random command returned `P1-021`. Live code at `check-smart-router.sh:261-275` first checks the owning skill directory and then falls back across sibling skill directories, which is the intended fix for shared `system-spec-kit/references/cli/...` resources.

## S3. Sandbox / write-authority audit

The requested command returned:

```text
?? .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/
```

Expanded porcelain with `--untracked-files=all` shows untracked root packet docs outside `review/` (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`). Under the prompt's baseline-dirty instruction, I did not flag those as this iteration's mutations. No tracked `M`, `A`, or `D` outside `102-track-rereview-2/review/` appeared in the audit.

## S4. Hidden P0/P1 sweep — security-sensitive scope

**Workflow-resolved spec_folder write authority:** no new live P0/P1. The canonical executor schema does not include `cli-copilot`; `EXECUTOR_KINDS` is `native`, `cli-codex`, `cli-gemini`, `cli-claude-code`, and `cli-opencode`. The dormant `if_cli_copilot` YAML branch references `buildCopilotPromptArg`, but that helper is not exported by `executor-config.ts`. Because `cli-copilot` is not an accepted executor kind, this is not a live write-authority bypass in the current schema. The live cli-codex, cli-gemini, cli-claude-code, and cli-opencode branches all consume the workflow-rendered prompt pack from the resolved review artifact root. The only live branch-level authority violation remains P1-028 for cli-opencode sandbox semantics.

**Stop hook env override:** clean. `session-stop.ts:39-47` honors `SPECKIT_GENERATE_CONTEXT_SCRIPT` only when `NODE_ENV === 'test'` or `SPECKIT_TEST === 'true'`; otherwise it falls through to fixed candidate paths.

**OpenCode `--dangerously-skip-permissions` semantics:** no new P0/P1 beyond P1-028. `opencode run --help` confirms the flag is a generic OpenCode run flag that auto-approves permissions not explicitly denied. In the deep-review YAML it is hardcoded for cli-opencode, so it substantiates P1-028. It is not evidence of an additional auth bypass because the command still runs under `--dir "{repo_root}"`, uses the rendered prompt, and the prompt constrains writes to this review packet.

## S5. Verdict-flip headline statement preparation

Re-review #2 of 099->100 verdict-flip: 13 of 13 prior P1s RESOLVED by 100; 0 P0 / 2 P1 / 4 P2 active findings — both active P1s are NEW regressions introduced by 101's cli-opencode wiring (`--pure` missing in 4 YAML branches; `sandboxMode` declared but ignored). Verdict: **CONDITIONAL** — 099 verdict flip from FAIL->PASS technically achieved for the carryover set, but 101 introduced 2 new P1 regressions blocking PASS.

## Findings — New

### P0

None.

### P1

None.

### P2

None.

## Traceability Checks

| Check | Status | Evidence |
| --- | --- | --- |
| P1-027 second-lens | PASS | `--pure` is the canonical plugin-crash mitigation for the recorded DeepSeek tool-name failure; no alternative flag found. |
| P1-028 second-lens | PASS | Parser accepts `sandboxMode` for cli-opencode, but all YAML branches ignore it and hardcode `--dangerously-skip-permissions`. |
| P1-026 closed-gate replay | PASS | `deltaRecordToFinding` and delta-record registry plumbing present in live reducer. |
| P1-021 closed-gate replay | PASS | Sibling skill path fallback present in `check-smart-router.sh`. |
| Sandbox audit | PASS | No tracked M/A/D outside review packet path; untracked root packet docs treated as baseline packet state. |
| Stop hook env override | PASS | Test-only gate confirmed in `session-stop.ts`. |
| Copilot authority branch | PARTIAL | Dormant branch references a missing helper, but `cli-copilot` is not a supported executor kind, so no live P0/P1. |
| OpenCode permission semantics | PASS | Generic flag confirmed; subsumed by P1-028, no additional P0/P1. |

## Confirmed-Clean Surfaces

- 099->100 carryover verdict remains clean for the two replayed P1s: P1-026 and P1-021.
- Stop hook env override is gated to test mode.
- No new tracked worktree mutations outside the authorized review packet path were detected.
- cli-opencode `--pure` and `sandboxMode` findings were re-verified without downgrade.

## Ruled Out

- **P1-027 downgrade to P2** — ruled out. The defect blocks the configured default DeepSeek-family cli-opencode dispatch path.
- **P1-027 alternative fix via removing `--dangerously-skip-permissions`** — ruled out. That flag controls permission approval, not plugin tool-name emission.
- **P1-028 downgrade to doc-only P2** — ruled out. `EXECUTOR_KIND_FLAG_SUPPORT` plus parser validation make `sandboxMode` a runtime contract.
- **New P0/P1 from dormant Copilot authority helper** — ruled out for this pass. The helper appears absent, but `cli-copilot` is not accepted by `parseExecutorConfig`.
- **Stop hook production override** — ruled out. The override variable is ignored outside test mode.

## Verdict (provisional)

**CONDITIONAL.** No new P0/P1 findings were added in iteration 8. Active registry remains 0 P0 / 2 P1 / 4 P2. The 099->100 carryover verdict flip remains valid, but the 101 cli-opencode regressions still block PASS.

## Next Focus

Recommend **STOP and synthesize**. coverage_age is now >=1, all dimensions are covered, the last three effective new-finding ratios are 0.00, 0.00, 0.00 after this pass, and no STOP-veto condition surfaced.
