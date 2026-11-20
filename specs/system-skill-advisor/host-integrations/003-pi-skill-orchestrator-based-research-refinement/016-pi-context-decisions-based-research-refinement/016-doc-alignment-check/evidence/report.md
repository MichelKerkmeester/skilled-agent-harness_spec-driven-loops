# Alignment report: topic advisor-pasted-reply

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic advisor-pasted-reply`
- Commits: `717347fbcba748f4112bb7a94b1466c77aed3070` to `717347fbcba748f4112bb7a94b1466c77aed3070`, 0 first-parent commits
- Files: 15, of which 0 uncommitted or untracked
- Owners: 1
- Findings: 20 (P0 0, P1 5, P2 15), 15 literal, 0 inferred, 0 outside the scope; 1 more overturned by the critic and not counted
- Open findings: 20 (0 handed off, 0 rebutted)
- Lanes: L1, L2, L3, L4
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 15 | lens only |
| D2 | Topic checks pass | yes | 0 | 1 |

## Battery

pass 1, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-advisor-hook-tests` | 0 | 113937 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **L3-2** P1 judgment `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md:54`: The block wraps all three hook runs in `gtimeout 20`, but `gtimeout` is GNU coreutils and is not installed on this macOS host: `gtimeout 20 true` exits 127 with `command not found`. The three runs never start the hook, the captured JSON files stay empty, and the block fails before any advisor behavior is exercised. The doc names `gtimeout` as the runner without stating the coreutils prerequisite o...
  - Evidence: `zsh -c 'gtimeout 20 true'` exit 127: zsh:1: command not found: gtimeout
- **L4-2** P1 literal `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:157`: The row says setting `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` to `0`/`false`/`off`/`no` restores always-full delivery. Route receipts are not gated by this variable: `routeReceiptsEnabled()` checks `hookConcernEnabled('directive-lifecycle')` (`SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED`), and `guardWeakFollowUp` still replaces the brief with `skippedWeakFollowUpResult()` when a receipt and a floored weak foll...
  - Evidence: `rg -n 'routeReceiptsEnabled|hookConcernEnabled|skippedWeakFollowUpResult|isDirectiveLifecycleDedupEnabled|DIRECTIVE_LIFECYCLE_DEDUP_ENV' .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-s...` exit 0: ...system-skill-advisor/hooks/lib/directive-lifecycle.ts:39: const value = process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV]?.trim().toLowerCase(); .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:5:export const DIRECTIVE_LIFECYCLE_DEDUP_ENV = 'SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP';
- **L4-4** P1 judgment `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:382`: The row says the fusion scorer reads `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` once at module load, so a warm daemon keeps the value it read when the daemon starts until a restart. In a launcher-spawned daemon the variable never arrives: `CHILD_ENV_ALLOWLIST` omits it and `createChildEnv()` filters the daemon child's environment to that exact list, so the fusion module always reads the 0.8 default an...
  - Evidence: `rg -n "SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD|CHILD_ENV_ALLOWLIST = new Set|CHILD_ENV_ALLOWLIST.has|env: createChildEnv\(\)" .skilled/bin/system-skill-advisor-launcher.cjs .skilled/skills/system-skill-a...` exit 0: ...ystem-skill-advisor-launcher.cjs:314: Object.entries(sourceEnv).filter(([key, value]) => CHILD_ENV_ALLOWLIST.has(key) && typeof value === 'string'), .skilled/bin/system-skill-advisor-launcher.cjs:1306: env: createChildEnv(), .skilled/bin/system-skill-advisor-launcher.cjs:1552: env: createChildEnv(),
- **L1-4** P2 literal `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:49`: The degraded path's condition is stated over 'the prompt'. `degradedRecommendations()` strips a leading pasted reply first and tests the remaining task text (`const task = stripLeadingPastedReply(prompt);` then `task.includes(row.command.split(' ')[0])`, runtime/skill-advisor-cli.ts:1489-1501), so a slash command named only inside a pasted earlier reply yields the row's owner skill, not the `kind:...
  - Evidence: `rg -n "stripLeadingPastedReply\(prompt\)|task.includes\(row.command" .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` exit 0: 1490: const task = stripLeadingPastedReply(prompt); 1501: if (row && task.includes(row.command.split(' ')[0])) {
- **L3-1** P2 literal `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md:14`: The doc says the memory-backed session-prime, compact-inject, session-stop and session-start hooks were removed with their server. They still exist and are registered: `.claude/settings.json` runs session-prime on SessionStart, compact-inject on PreCompact and session-stop on Stop, and the Codex, Cursor and Devin session-start adapters remain. What was removed is the memory MCP server, not these h...
  - Evidence: `ls .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/ses...` exit 0: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts 3
- **L4-1** P2 judgment `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:153`: The cadence sentence says model-context surfaces deliver the complete advisor brief on the first message and after lifecycle boundaries, then retain only the dynamic `Advisor:` route line on a proven repeat. The shared hook has a third outcome: when a weak follow-up is floored to a different skill and a stored route receipt is current, `guardWeakFollowUp` returns `skippedWeakFollowUpResult()`, and...
  - Evidence: `rg -n 'decideRouteReceiptGuard|skippedWeakFollowUpResult|Advisor: prompt skipped|fallbackCase ===' .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts .skilled/skills/system-skill-advisor/...` exit 0: ...ime/lib/render.ts:658: : classification.fallbackCase === 'skipped' .skilled/skills/system-skill-advisor/runtime/lib/render.ts:659: ? 'Advisor: prompt skipped.' .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:449:export function skippedWeakFollowUpResult(): AdvisorHookResult {
- **L4-3** P2 literal `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:159`: The documented default `os.tmpdir()/speckit-advisor/directive-lifecycle` is not the variable's default base. `FileDirectiveLifecycleStore` defaults it to `join(tmpdir(), 'speckit-advisor')`; the Python helper then creates `directive-lifecycle/<project>` under that base, and the route-receipt store creates `route-receipts` under the same base. Setting the variable to the documented path nests a sec...
  - Evidence: `rg -n "join\(tmpdir\(\), 'speckit-advisor'\)|ROUTE_RECEIPT_DIR|open_child_directory\(base_fd" .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts .skilled/skills/system-sk...` exit 0: ...'speckit-advisor')); .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:225: this.dir = join(this.baseDir, ROUTE_RECEIPT_DIR); .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:75: lifecycle_fd = open_child_directory(base_fd, "directive-lifecycle", uid, create)
- **N1** P2 literal `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:72`: The validation table says the disabled-switch test pins an 'exact-`1` value rule', while line 23 says any truthy value disables the advisor. Both describe the wrong rule: the hooks resolver treats `1`, `true`, `yes` and `on` as active (`hook-flags.cjs:158-159`), and `advisor-disabled.vitest.ts` asserts that `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: 'true'` and `SYSTEM_SKILL_ADVISOR_DISABLED: 'ON'` both...
  - Evidence: `rg -n 'v === "1" \|\| v === "true"' .skilled/hooks/shared/hook-flags.cjs; rg -n "SYSTEM_SKILL_ADVISOR_DISABLED: 'ON'|SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: 'true'" .skilled/skills/system-skill-advisor/ru...` exit 0: 159: return v === "1" || v === "true" || v === "yes" || v === "on"; 45: [{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: 'true' }, 'SYSTEM_SKILL_ADVISOR_HOOK_DISABLED'], 47: [{ SYSTEM_SKILL_ADVISOR_DISABLED: 'ON' }, 'SYSTEM_SKILL_ADVISOR_DISABLED'],
- **N2** P2 literal `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:55`: The source table calls `hooks/lib/skill-advisor-cli-fallback.ts` a 'Shared warm-only CLI fallback for Claude/OpenCode prompt-submit hooks'. The helper runs the CLI with `--no-warm-only` because it needs the CLI to cold-start the daemon (`skill-advisor-cli-fallback.ts:269`), and no OpenCode module imports it: the OpenCode plugin spawns its own CLI path (`ADVISOR_CLI_PATH` at `.opencode/plugins/syst...
  - Evidence: `rg -n 'no-warm-only' .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts; rg -n 'buildSkillAdvisorBriefFromCli' .skilled/skills/system-skill-advisor/hooks .opencode --glob '!*...` exit 0: ...arm-only', skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:52:import { buildSkillAdvisorBriefFromCli } from '../lib/skill-advisor-cli-fallback.js'; 137:const ADVISOR_CLI_PATH = fileURLToPath(new URL('../bin/skill-advisor.cjs', import.meta.url)); 693:function advisorCliArgs() {
- **N3** P2 literal `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:28`: The warm-only sentence names only `SYSTEM_SKILL_ADVISOR_CLI_WARM_ONLY` and `SPECKIT_SKILL_ADVISOR_CLI_WARM_ONLY` as the way warm-only becomes the default. `defaultWarmOnly()` also returns true for any prompt-time marker via `defaultPromptTime()` (`SYSTEM_SKILL_ADVISOR_CLI_PROMPT_TIME`, `SPECKIT_SKILL_ADVISOR_CLI_PROMPT_TIME`, `SPECKIT_CLI_PROMPT_TIME`, `OPENCODE_PROMPT_TIME`, `CLAUDE_CODE_PROMPT_T...
  - Evidence: `rg -n 'function defaultWarmOnly' -A 5 .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts; rg -n 'function defaultPromptTime' -A 7 .skilled/skills/system-skill-advisor/runtime/skill-advi...` exit 0: ...ME') 420- || envFlagEnabled('SPECKIT_CLI_PROMPT_TIME') 421- || envFlagEnabled('OPENCODE_PROMPT_TIME') 422- || envFlagEnabled('CLAUDE_CODE_PROMPT_TIME'); 423-} 435:| `SYSTEM_SKILL_ADVISOR_CLI_PROMPT_TIME` | ... | flag | Marks the skill-advisor CLI invocation as prompt-time, which implies warm-only. |
- **N4** P2 literal `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:190`: The section 8 File column displays `001-claude-user-prompt-submit.md` (and `005-opencode-plugin-bridge.md` at line 192, `006-skill-advisor-cli-fallback.md` at line 193), but those files do not exist; the live filenames are `claude-user-prompt-submit.md`, `opencode-plugin-bridge.md` and `skill-advisor-cli-fallback.md`. The same document says at line 38 that the tree holds no `NNN-*.md` files, so th...
  - Evidence: `rg -n 'CL-001 \|.*001-claude|CL-005 \|.*005-opencode|CL-006 \|.*006-skill' .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md; ls .skilled/skills/system-skill-advi...` exit 0: ...e (028) | [006-skill-advisor-cli-fallback.md](cli-hooks-and-plugin/skill-advisor-cli-fallback.md) | brief-command-policy-word.md claude-user-prompt-submit.md goal-opencode-plugin-conversation.md goal-opencode-plugin.md opencode-plugin-bridge.md skill-advisor-cli-fallback.md vibe-command-documents.md
- **N5** P2 judgment `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-validate.md:40`: The table introduced as 'The current baseline slices remain' reports 80.5% full corpus and 77.5% holdout as measured current values, while the in-scope NC-003 scenario records the run it captured at 51.3% full corpus, 42.5% holdout and UNKNOWN 14, with verdict FAIL (`native-validate-slices.md:430,436`). The catalog therefore claims as current a passing baseline the playbook says the current corpus...
  - Evidence: `rg -n 'The current baseline slices remain|Full corpus top-1|Holdout top-1' .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-validate.md; rg -n 'Current observed baseline|^FAIL:...` exit 0: ... 77.5% | 430:- Current observed baseline was not the Expected Phase 027 baseline: full corpus was `0.513`, holdout was `0.425`, unknown count was `14`, ... 436:FAIL: ... full corpus was `0.513` instead of 80.5%, holdout was `0.425` instead of 77.5%, and unknown count was `14`, above `targetMax: 10`.
- **N6** P2 literal `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-warm-only-no-spawn.md:95`: The anchor table says `hooks/lib/skill-advisor-cli-fallback.ts` is a 'Hook helper relying on this contract' — the warm-only no-spawn contract. The helper does the opposite: it passes `--no-warm-only` so the CLI cold-starts the daemon (`skill-advisor-cli-fallback.ts:269`), and the feature catalog describes that auto-spawn behavior. An operator auditing why a hook still spawns would be sent to the o...
  - Evidence: `rg -n 'Hook helper relying on this contract' .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-warm-only-no-spawn.md; rg -n "'--no-warm-only'" .skilled/skills/system-skil...` exit 0: 95:| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Hook helper relying on this contract | 269: '--no-warm-only',

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **L1-1** P1 literal `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:67`: The Claude row says the runtime shows `{}` 'when disabled or on error'. The shared handler's catch does not return `{}` on an error: with a prompt string present it renders the outage fallback and returns it as `hookSpecificOutput.additionalContext` (renderAdvisorTimeoutFallback at hooks/claude/user-prompt-submit.ts:650, which renders `Advisor: outage (...)` through runtime/lib/render.ts:674), ded... [D5, L1]
  - Evidence: `rg -n "renderAdvisorTimeoutFallback\(renderOptions\)|renderAdvisorFallbackDirective\(renderOptions, skippedResult\)" .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` exit 0: 649: ? renderAdvisorFallbackDirective(renderOptions, skippedResult) 650: : renderAdvisorTimeoutFallback(renderOptions);
  - Critic override: refuted, lane severity P1. The row describes the compiled adapter the Claude runtime actually runs, which is the spec-kit shim: `.claude/settings.json` invokes `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`, and the row's entry symlink points at that shim. That shim's `runShim()` returns `{}` on target-unresolved, spawn error/ETIMEDOUT, nonzero child exit, empty output and invalid JSON (`....

## Probes awaiting the critic

None.

## Files no lane reviewed

None.

