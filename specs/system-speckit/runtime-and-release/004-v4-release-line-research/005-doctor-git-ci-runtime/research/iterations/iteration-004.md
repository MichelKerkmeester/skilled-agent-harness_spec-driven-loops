# Iteration 004 — Workflow Claim Audit and Agent Roster Counts

## Focus

Two key questions, in this order:

1. **Q5, redone properly.** List every file in `.github/workflows`; for each name its trigger, the scripts and paths it runs (check each exists), its switch in `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`, and what `/doctor:ci` reports for it; compare with the v4.0.0.16 "CI and GitHub Actions" note claim by claim.
2. **Q7.** The `.skilled/agents` roster versus `AGENTS.md` section 9 and the agent counts the `cli-*` skills claim.

Read-only throughout. No file outside the lineage write zone was touched.

## Actions Taken

1. Read `deep-research-config.json` (session id `2026-11-08T19:57:09.370Z`) and the v4.0.0.16 release note's CI section.
2. Enumerated all 32 `.yml` files in `.github/workflows` and parsed each one's `name`, `on:` triggers, `run:` commands and `SKILLED_CI*` references with a read-only Node parser.
3. Read the repository CI profile `ci.json` and the workflows `README.md`, including the contents table, the push-versus-pull-request table and the on/off switch table.
4. Ran `node .skilled/commands/doctor/scripts/ci-report.cjs --no-gh` to capture exactly what `/doctor:ci report` emits for every workflow.
5. Audited every workflow for job count, `timeout-minutes`, top-level `permissions:`, switch references, `concurrency:` / PR cancellation and checkout depth.
6. Spot-checked referenced script paths against the tree, resolving the `cd` prefixes used inside `run:` blocks.
7. Counted agent files in `.skilled/agents` and all seven runtime mirrors; read `AGENTS.md` section 9 and `.skilled/agents/README.txt`; read the `cli-claude-code` roster references and the count claims in the `cli-devin` and `cli-pi` playbooks.
8. Pulled `git log -1 --format='%h %cs %s'` for each document cited, plus the v4.0.0.16 and v4.0.2.0 tag commits, to place each drift in a release.

## Findings

### F1 — `claude-tools.md` names two agents that do not exist and omits two that do

- **Type:** drift (note vs code vs docs disagree)
- **Severity:** P2
- **Source:** [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247]
- **Release:** v4.0.1.0 (file last touched 2026-11-04, commit `6b61a02c13`; the stale roster predates that edit)
- **Confidence:** 0.85

The Claude Code column says "11 agents via `.claude/agents/*.md`" and splits them into primary (`general`, `plan`, `orchestrate`), subagent (`context`, `markdown`, `review`, `debug`, `ai-council`) and command-owned (`deep-research`, `deep-review`, `prompt-improver`). The tree has no `general.md` and no `plan.md`; the real files are `ai-council`, `code`, `context`, `debug`, `deep-research`, `deep-review`, `design`, `Explore`, `markdown`, `orchestrate`, `prompt-improver`, `review` (12 files, of which `Explore.md` is the sanctioned Claude-only extra per `agent-roster-mirror-check.cjs`). So the table invents two agents and omits `code` and `design`.

**Verify:** `ls .claude/agents; sed -n '247p' .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md`

### F2 — `agent-delegation.md` says 10 agents while its own skill says 11

- **Type:** drift
- **Severity:** P2
- **Source:** [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md:3]
- **Release:** v4.0.1.0 (same 2026-11-04 doc pass)
- **Confidence:** 0.9

The frontmatter description reads "Reference for delegating tasks to 10 specialized Claude Code agents", but `cli-claude-code/SKILL.md:260` calls the same file an "11 agent roster", and `.skilled/agents` holds 11 canonical definitions. `cli-codex/references/agent-delegation.md:3` repeats the same "10 specialized Codex agents" wording while `.codex/agents` holds 11 `.toml` files. The description is the one line a routing index and a skill catalogue read, so the wrong count propagates.

**Verify:** `head -4 .skilled/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md; head -4 .skilled/skills/cli-external-orchestration/cli-codex/references/agent-delegation.md; ls .codex/agents | wc -l`

### F3 — `cli-devin` and `cli-pi` playbooks still claim 13 agents; the trees hold 11

- **Type:** drift
- **Severity:** P2
- **Source:** [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md:66]
- **Release:** v4.0.1.0 (playbook last changed 2026-11-03, commit `8eb55b7844`)
- **Confidence:** 0.85

The `cli-devin` playbook says "all 13 roster agents enumerated alongside subagent_explore/subagent_general" (line 66) and "all 13 mirrored agents" (line 87), and the `cli-pi` benchmark report says "13 project agent files present" and "drift on 9/13 agent mirrors". `.devin/agents` and `.pi/agents` each hold exactly 11 entries, matching `cli-devin/SKILL.md:195` ("All 11 repo agents") and the 11-name roster in `.skilled/agents/README.txt:18`. The 13 figure counts Devin's two built-in subagents (`subagent_explore`, `subagent_general`) as if they were mirrored repository agents.

**Verify:** `ls .devin/agents | wc -l; ls .pi/agents | wc -l; grep -n "13" .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md | head`

### F4 — `AGENTS.md` section 9 states no roster, so the cli-* counts have no canon to match

- **Type:** misalignment with Skilled canon
- **Severity:** P2
- **Source:** [SOURCE: AGENTS.md:279]
- **Release:** v4.0.0.0 (section unchanged through v4.0.2.0; last `AGENTS.md` commit `9d4edcbd3b`, 2026-11-08, touched a different section)
- **Confidence:** 0.8

Section 9 is two lines: a list of runtime agent directories (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.cursor/agents/`, `.pi/agents/`, `.devin/agents/`, `.dsh/agents/`) and an instruction to stay with the active runtime's directory. It names no agent, no class and no count. The only canonical roster is `.skilled/agents/README.txt:18` (11 names). The key question "do the definitions match AGENTS.md section 9" therefore cannot be answered affirmatively: section 9 delegates the roster entirely, while the cli-* skills each restate a count that nothing checks against a single source.

**Verify:** `sed -n '279,282p' AGENTS.md; sed -n '18,29p' .skilled/agents/README.txt`

### F5 — `/doctor:ci report` shows `on` for the one workflow that has no switch

- **Type:** UX for the operator
- **Severity:** P2
- **Source:** [SOURCE: .skilled/skills/sk-code/sk-code-ci/repository/ci.json:20]
- **Release:** v4.0.0.16 (CI doctor introduced)
- **Confidence:** 0.7

The profile marks `dependabot-auto-merge.yml` as `exempt`, and the workflow carries no `SKILLED_CI*` condition on either job. The report still prints its Switch column as `on`, while every switched workflow prints `unknown` under `--no-gh`. A reader cannot tell "no switch exists" from "the switch is set on", and the lone `on` row is the one row where the state is not a variable state at all.

**Verify:** `node .skilled/commands/doctor/scripts/ci-report.cjs --no-gh | grep dependabot-auto-merge`

## Q5 Result — Workflow Claim Audit (no drift found)

The v4.0.0.16 note's CI claims were checked against the files, not the prose:

| Claim | Result |
|---|---|
| "The repository's 33 workflows" before the release | Consistent: 32 `.yml` files now, and the note says two overlapping workflows were merged into one. `/doctor:ci report` and the README both list 32. Not drift. |
| "Every job now carries a timeout" | Confirmed: 45 jobs across 32 workflows, 45 `timeout-minutes` keys. |
| "only the permissions it needs" | Every one of the 32 workflows declares a top-level `permissions:` block; per-job least privilege cannot be proven from the top-level block alone. |
| "A pull-request run cancels the moment a newer push arrives" | Confirmed for 30/32: `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. The two exceptions (`dependabot-auto-merge.yml`, `trigger-index-rebuild.yml`) never run on a pull-request push. |
| "Six repository variables turn CI groups off" | Confirmed: `SKILLED_CI` plus five groups in `ci.json`, and the README's switch table names the same six. |
| Switch coverage per job | Confirmed: 43 switched jobs (45 minus the two Dependabot jobs), 43 references to both `vars.SKILLED_CI` and a group variable. No unswitched job outside the exempt workflow. |
| Group membership in the README | Confirmed: TESTS 17, FRESHNESS 8, REVIEW 3, REPORTS 2, MESSAGES 1, exempt 1 = 32 workflows; every file's literal group variable matches its README row. |
| `/doctor:ci` report | `workflows: 32 jobs: 45`, every README purpose resolved, zero drift flags, `STATUS=OK`; with `--no-gh`, 31 `unknown` and 1 `on` (F5). |
| Referenced script paths exist | Spot-checked: `chart-corpus.yml` → `sk-design-chart/scripts/check-corpus.cjs`, `diagram-corpus.yml` → `sk-design-diagram/scripts/check-diagram-corpus.cjs`, `spec-kit-check.yml` → `.opencode/commands/doctor/scripts/tests/run-all.sh` all resolve. Residual scanner hits were relative paths behind an in-script `cd` or `.js` prefixes of `.json` filenames, not missing files. |
| Rebuild commit skips CI; runner-minute totals | Not re-verified this iteration (no workflow run history is available offline). The README documents the `[skip ci]` body and the `Trigger-Index-Rebuild: ci` trailer. |

**Q5 answered.** The workflow layer matches the v4.0.0.16 note and the `ci.json` profile. The one report defect is F5.

## Questions Answered

- **Q7:** "Do the .skilled/agents definitions match AGENTS.md section 9 and the agent counts the cli-* skills claim?" — No. Section 9 names directories only; the canonical roster is 11 (`README.txt:18`), all seven mirrors hold 11, and the cli-* documents disagree (10 in two `agent-delegation.md` descriptions, 11 in the skills, 13 in the `cli-devin` and `cli-pi` playbooks, plus a wrong named roster in `claude-tools.md`).
- **Q5 (redo):** Every `.github/workflows` file, its trigger, switch, README purpose and `/doctor:ci` row now match; the only defect is the exempt workflow's `on` label.

## Questions Remaining

- Does the Skilled in Your Project and vendored overlay flow from v4.0.2.0 (`/doctor:install`, `/doctor:symlink`, `/doctor:overlay`) hold up read end to end in check or plan mode, and which step would fail?
- Do the `sk-git` hooks behave as the v4.0.0.3, v4.0.0.10 and v4.0.0.15/v4.0.0.16 notes say, with a repro for any wrong accept or reject?
- Which doctor checks, hooks, workflows or mirror files have no caller or duplicate another, and what breaks if each is removed?
- What friction do the operator and the AI user hit in doctor output, hook rejections and CI failures?
- Where do these surfaces depart from sk-code, sk-doc and Skilled canon for command format, skill format and hub routing?
- What concrete extensions to doctor checks, hooks, CI and mirror sync would close a gap found in this run?
- Carried forward: does the `hook_adapter_fallback_health_checks` battery resolve every listed path, and does the full workflow report a degraded adapter when one is missing?
- Carried forward: do the v4.0.0.15/v4.0.0.16 worktree behaviors (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes?
- Carried forward: does `AGENTS.md` match `REPO RULES.md` and the `.skilled/repo-rules` files it routes, and does Devin's 16,384-byte rule cut truncate a binding rule?
- Carried forward: does `pre-push` refuse a pushed non-merge commit without a Commit-Id, and does a wedged git call block with `BLOCKED [gate:git-timeout]` after 20 seconds?
- Carried forward: does a message carrying both `Commit-Id: 0000000` and a valid id get refused?

## Next Focus

Iteration 5 should take the install/overlay end-to-end question and the `sk-git` hook/worktree questions, since Q5 and Q7 are now closed. For the overlay flow, read `/doctor:install`, `/doctor:symlink` and `/doctor:overlay` plus their scripts and run only check or plan modes. For the hooks, target `pre-push` Commit-Id refusal, the 20-second `BLOCKED [gate:git-timeout]` path, and the v4.0.0.15/v4.0.0.16 worktree behaviors that remain open.

## SCOPE VIOLATIONS

None.
