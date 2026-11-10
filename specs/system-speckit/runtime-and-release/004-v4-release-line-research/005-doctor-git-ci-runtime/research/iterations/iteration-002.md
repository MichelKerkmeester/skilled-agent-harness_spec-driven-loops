# Iteration 2 — Runtime Mirrors and sk-git Hook Behavior

## Focus

Key question 3 (do the runtime mirrors in `.claude`, `.opencode`, `.codex`, `.cursor`, `.pi`, `.devin` and `.dsh` match their `.skilled` sources, and does `/doctor:runtime-mirrors` detect the drift that exists?) and key question 4 (do the sk-git hooks behave as the v4.0.0.3 commit-message and hook-safety notes, the v4.0.0.10 Commit-Id note and the v4.0.0.15/v4.0.0.16 worktree notes say, with a repro for any wrong accept or reject?).

## Actions Taken

1. Read the run config for the session identity (`2026-11-08T19:57:09.370Z`) and the strategy's exact key-question text.
2. Compared the source trees to every mirror. `.opencode/agents` is a symlink to `.skilled/agents`; `.claude/commands` and `.cursor/commands` are directories of symlinks; `.devin/agents` holds one directory per agent; `.codex/agents` is generated TOML; `.pi/agents` is generated Markdown; `.dsh/agents` is a patch overlay. Raw `diff -rq` reports every `.claude` and `.pi` agent file as different, which is the sanctioned frontmatter-dialect translation, not drift.
3. Ran the full `/doctor:runtime-mirrors` checker battery in check-only form: `sync-runtime-mirrors.cjs --check` (247 mirrors across 10 trees), `sync-agents.cjs --check` (11 agents), `sync-prompts.cjs --check` (45 prompts), `sync-agents-pi.cjs --check` (11 agents), `sync-prompts-pi.cjs --check` (45 prompts), `sync-skills-dsh.cjs --check` (55 links), `sync-prompts-dsh.cjs --check` (45 stubs), `sync-agents-dsh.cjs --check` (11 patches), `agent-roster-mirror-check.cjs` (11/11 on five surfaces), `command-catalog-mirror-check.cjs` (44 commands, 13+7+3 hub entries) and `install-codex-hooks.mjs --check --allow-worktree`. Every checker exited 0.
4. Ran the crosswalk's own content-parity checker, `node .skilled/bin/check-agent-mirror-sync.cjs --all`: 11 agents checked, all mirrors in sync, exit 0.
5. Read the doctor's `runtime-mirrors.md`, `_routes.yaml` and `doctor-runtime-mirrors.yaml` against the crosswalk, and read the `.claude/agents` and `.skilled/agents` READMEs.
6. Read the installed hook path and the hook scripts: `core.hooksPath` resolves to `/Users/michelkerkmeester/.config/git/hooks`, which links all six hooks (including `prepare-commit-msg`) into `.skilled/scripts/git-hooks/`. The local `.git/hooks` tree is ignored; its missing `prepare-commit-msg` symlink is not a gap.
7. Ran the message-contract CLI in stdin mode against the repository's own commit template for six cases: no body, prose body, trailer-only body, alias scope, breaking change without sections, an 84-character subject and a 104-character subject. Ran `cip_repo_wants_ids` and `cip_message_has_id` against a valid 7-digit id, `0000000`, and a message with no id.
8. Checked the HEAD commit: it is a `github-actions[bot]` commit made server-side and has no Commit-Id, so client hooks did not run for it; this is not a local wrong accept.

## Findings

### F1 — `/doctor:runtime-mirrors` never runs the agent body-parity checker the crosswalk names

- **Type:** drift
- **Severity:** P1
- **Release:** v4.0.0.3 (the release that gave the runtime mirrors their own doctor command)
- **Confidence:** high (0.95)
- **Claim:** The command's own description says it checks that "the agent, command, prompt and hook mirrors in each runtime directory match `.skilled`." [SOURCE: .skilled/commands/doctor/runtime-mirrors.md:6]
- **Code:** The workflow's `upstream_assets` list and execution steps run `sync-runtime-mirrors.cjs --check` (symlink trees), the Codex and Pi generators, `agent-roster-mirror-check.cjs` (roster coverage), `command-catalog-mirror-check.cjs` (catalog) and the Codex hook installer. [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:34] [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:138] The crosswalk says `.claude` "is itself kept in step with `.skilled` by hand" and names `node .skilled/bin/check-agent-mirror-sync.cjs --all` as the check that "compares every agent body and declared tool surface from `.skilled` to `.claude` and `.codex`." [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:49] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:64] That script is not in the doctor battery: `rg -n 'check-agent-mirror-sync'` over `doctor-runtime-mirrors.yaml` and `_routes.yaml` returns no match. The roster checker's own output names `.claude/agents` as its canonical and reports coverage only (`cursor 11/11 symlinked`, `opencode 11/11 present`), so a body or tool-surface edit in `.claude/agents` that never reached `.skilled/agents` leaves every doctor row green.
- **Observed:** `node .skilled/bin/check-agent-mirror-sync.cjs --all` → `11 agent(s) checked — all mirrors in sync — OK`, exit 0. The gap is latent today, not a current mismatch.
- **Verify:** `rg -n 'check-agent-mirror-sync' .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml .skilled/commands/doctor/_routes.yaml` → no output; `node .skilled/bin/check-agent-mirror-sync.cjs --all` → OK.
- **Fix direction:** Add an `upstream_assets.agent_body_parity` row and an execution step, and report its exit 0/1/2 as the agent-parity surface.

### F2 — The agent crosswalk's "same twelve agents" count is stale

- **Type:** drift
- **Severity:** P2
- **Release:** baseline (crosswalk last touched f8f6156c2d on 2026-10-18; unchanged through v4.0.2.0)
- **Confidence:** high (1.0, counted)
- **Claim:** "Six runtime trees ship the same twelve agents." [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:16]
- **Code:** The roster is 11. The `.skilled/agents/README.txt` lists 11 agents. [SOURCE: .skilled/agents/README.txt:19] The `.claude/agents/README.txt` lists the same 11 plus the Claude-only `Explore.md`, and says "Explore is not a roster agent" and "has no mirror in the other runtimes." [SOURCE: .claude/agents/README.txt:18] Both checkers report 11: `check-agent-mirror-sync.cjs --all` → "11 agent(s) checked"; `agent-roster-mirror-check.cjs` → "canonical: .claude/agents (11 agents)". The crosswalk's own §1 table lists the same six trees, so the count is the only wrong number.
- **Verify:** `rg -n 'twelve agents' .skilled/bin/agent-mirror-crosswalk.md` → one hit; `node .skilled/bin/check-agent-mirror-sync.cjs --all` → 11.
- **Fix direction:** Change "twelve" to "eleven" and name Explore as the Claude-only exception, or say "eleven roster agents plus Claude's Explore."

### F3 — The route manifest still calls the DSH checks "n/a" while `.dsh/` exists

- **Type:** drift
- **Severity:** P2
- **Release:** v4.0.2.0 (route manifest last touched c29f26ded8 on 2026-11-07)
- **Confidence:** high (1.0, observed)
- **Claim:** The three DSH script invocations carry `# n/a, not run, while .dsh/ is absent`. [SOURCE: .skilled/commands/doctor/_routes.yaml:237]
- **Code:** `.dsh/` exists and all three checks run and pass: `sync-skills-dsh.cjs --check` → 55 skill links in sync; `sync-prompts-dsh.cjs --check` → 45 prompt stubs in sync; `sync-agents-dsh.cjs --check` → 11 agent patches in sync. The workflow YAML is conditional and correct ("When `.dsh/` is absent, report the row as n/a...") [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:146], so the stale text is in the route manifest's comments, not in the behavior. An operator reading `_routes.yaml` sees the opposite of what the command does.
- **Verify:** `rg -n 'n/a, not run, while' .skilled/commands/doctor/_routes.yaml` → three hits; `ls -d .dsh` → present; `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check` → exit 0.
- **Fix direction:** Drop the trailing comment, or make it conditional ("n/a only when `.dsh/` is absent").

### O1 — The commit-message and Commit-Id rules match the v4.0.0.3 and v4.0.0.10 notes in the tested matrix

This is an observation, not a finding: no wrong accept or reject surfaced in the tested cases.

| Case | Result |
|------|--------|
| `chore(system-spec-kit): test subject` with no body | exit 1, `body.required` |
| `Spec: specs/foo` trailer only, no prose | exit 1, `body.required` and `trailer.spec-prefix` |
| `chore(spec-kit): ...` alias scope | exit 1, `subject.scope-alias` names `system-spec-kit` |
| `feat(system-spec-kit)!: ...` without sections | exit 1, `breaking.footer` and `body.breaking-sections` (Context, Changes, Verification) |
| 84-character subject | exit 0 with `subject.length-target` warning (target 80) |
| 104-character subject | exit 1, `subject.max-length` (maximum 100) |
| `cip_message_has_id` with `Commit-Id: 0000001` | exit 0 (accepted) |
| `cip_message_has_id` with `Commit-Id: 0000000` | exit 1 (refused) |
| `cip_message_has_id` with no Commit-Id | exit 1 (refused) |

The validator implements the body, scope-alias, breaking-section and 80/100 subject rules. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:487] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:511] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:592] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:608] The Commit-Id policy accepts a non-zero 7-digit id and refuses `0000000`, and the allocator mints exactly 7 digits. [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:23] [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:55] [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:80] The `commit-msg` hook refuses a message without one in a repository the policy covers. [SOURCE: .skilled/scripts/git-hooks/commit-msg:69]

**Ruled out:** The local `.git/hooks` tree has no `prepare-commit-msg` symlink, but `core.hooksPath` is `/Users/michelkerkmeester/.config/git/hooks`, which links `prepare-commit-msg` to `.skilled/scripts/git-hooks/prepare-commit-msg`; `.git/hooks` is ignored. The HEAD commit has no Commit-Id but is a `github-actions[bot]` commit made server-side, where client hooks do not run; it is not a local wrong accept.

**Ruled out:** Raw `diff -rq` reports every `.claude` and `.pi` agent file as different from `.skilled`. That is the sanctioned frontmatter-dialect translation (`.skilled` carries the OpenCode `permission:` map; `.claude` carries `tools:`), and `check-agent-mirror-sync.cjs --all` passes. The raw diff is not evidence of drift.

## Questions Answered

- **Q3 (runtime mirrors): answered.** The mirrors are in sync on every checker the doctor runs (247 links across 10 trees, 11 Codex agents, 45 Codex prompts, 11 Pi agents, 45 Pi prompts, 55 DSH skill links, 45 DSH prompt stubs, 11 DSH agent patches, 11/11 roster coverage on five surfaces, 44 catalog commands). The doctor does **not** run the crosswalk's `.skilled` ↔ `.claude` agent body-parity checker, and its roster checker treats `.claude/agents` as canonical; that is the gap recorded in F1. The crosswalk's agent count is stale (F2), and the route manifest's DSH comments are stale (F3).
- **Q4 (sk-git hooks): partially answered.** The v4.0.0.3 commit-message rules and the v4.0.0.10 Commit-Id rules match the notes in the tested matrix (O1); no wrong accept or reject surfaced. The v4.0.0.15/v4.0.0.16 worktree behavior was not tested this iteration, so Q4 remains open for its worktree half.

## Questions Remaining

- Do the v4.0.0.15/v4.0.0.16 worktree behaviors (private `local-*` command links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes? This is the open half of Q4.
- Does the `hook_adapter_fallback_health_checks` battery in `doctor-runtime-mirrors.yaml` resolve every listed path, and does the full workflow report a degraded adapter when one is missing? The workflow YAML says it does; this iteration ran the checker scripts, not the full workflow.
- Does `pre-push` refuse a pushed non-merge commit without a Commit-Id, and does a wedged git call block with `BLOCKED [gate:git-timeout]` after 20 seconds? The code path is present in `pre-push` and the bounded-git helper; no live timeout was induced.
- Does a message carrying both `Commit-Id: 0000000` and a valid id get refused? `cip_message_has_id` returns true when any line is non-zero, so the zero line is ignored when a valid line is also present. The stamper strips duplicate trailers, so this needs a deliberate hand-written message to trigger.
- Do the `.github/workflows` match the v4.0.0.16 CI note and `/doctor:ci` switch state, and does any workflow call a missing script? (Q5, next iteration.)
- Does `AGENTS.md` match `REPO RULES.md` and the `.skilled/repo-rules` files it routes, and does Devin's 16,384-byte rule cut truncate a binding rule? (Q6, next iteration.)

## Next Focus

Finish Q4's worktree half, then take Q5 (`.github/workflows` against the v4.0.0.16 CI note and `/doctor:ci`) and Q6 (`AGENTS.md` against `REPO RULES.md` and the repo-rules files). For the mirror surface, verify the F1 repair direction by adding `check-agent-mirror-sync.cjs --all` to the doctor battery in a follow-up implementation packet, not in this read-only run.
