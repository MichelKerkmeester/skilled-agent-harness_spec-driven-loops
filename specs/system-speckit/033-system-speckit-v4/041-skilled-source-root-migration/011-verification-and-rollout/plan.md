---
title: "Implementation Plan: Phase 11: verification-and-rollout"
description: "Verify the .skilled migration at one pinned SHA with runtime canaries, a 13-gate matrix, a residue scan and a mutant-tested independent check, then fast-forward skilled/v4.0.0.0 and main, census CI on both, reconcile the main checkout and clean up."
trigger_phrases:
  - "skilled verification plan"
  - "skilled gate matrix"
  - "skilled push and ci census"
  - "skilled canary smoke plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: verification-and-rollout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node 20 and 22, Python 3 gate scripts |
| **Framework** | Seven CLI runtimes: Claude Code, Codex, Cursor, Devin, Pi, Hermes and opencode |
| **Storage** | Git: worktree 055, remote branches `skilled/v4.0.0.0` and `main`, the primary checkout |
| **Testing** | vitest, `node --test`, pytest, `validate.sh`, GitHub Actions read through `gh` |

### Overview

This phase proves the migration at one pinned SHA and publishes that SHA only. Proof comes from things that could have come out the other way: a random canary token each runtime can only return by reading the current `.skilled/` file, affirmative output markers for 13 gates, a residue scan that must also find a planted positive control and an independent check that must fail on deliberately broken copies. After a second model family reviews the evidence, the SHA fast-forwards onto `skilled/v4.0.0.0` and then `main`, CI is censused on both, the primary checkout is reconciled and the workspace is cleaned.

**Path convention.** Line citations point at files as read on 2026-09-16, when they still sat under `.opencode/`. Commands use the post-move location, `.skilled/` plus the same relative path (`../spec.md:100`). Where phase 004 froze a different layout, 004 wins and the commands follow it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 010 validates `RESULT: PASSED` on its own run and every 010 acceptance row is `Met` (parent D1, `../goal.md:46`)
- [ ] Phase 004's kept set, reference allowlist, freeze policy and rollback window are recorded in the evidence folder
- [ ] Phase 005's independent check contract and phase 010's hook and home-config record are recorded
- [ ] `TIP`, `BASE`, `OLD_V4` and `OLD_MAIN` are pinned, and the push rollback is written in the parent goal log

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met` with observed evidence
- [ ] `origin/skilled/v4.0.0.0` and `origin/main` equal the verified SHA and every expected CI run concluded `success`
- [ ] The parent goal's six criteria are checked with receipts
- [ ] `scratch/evidence/`, every clone and every `.pytest_cache` are gone, and this phase validates `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verify, then publish, at one pinned SHA. Every proof runs against `TIP`. If the remote tip moves before the push lands, the branch is rebased and every proof re-runs at the new `TIP`, three rounds at most before escalating (parent D2, `../goal.md:47`).

### Key Components

- **Canary tokens**: a random token, planted for the run in one skill, one command and one agent under `.skilled/`. A runtime returns it only if it read the current file, directly or through a freshly generated copy. The token never appears in a prompt or an exported variable.
- **Gate matrix**: 13 local gates, each with its command, its affirmative marker, the way it can skip silently and the evidence that it ran (§5.2).
- **Residue scanner**: enumerate every `.opencode` hit with `git grep -a`, split the hits by area, classify each against 004's allowlist and freeze policy, then reconcile the totals (§5.3).
- **Mutant copies**: disposable clones, each carrying one deliberate breakage, used to show the independent check can fail (§5.4).
- **CI census**: the runs expected from each workflow's trigger block, compared with the runs GitHub reports for the SHA (§5.5).

### Data Flow

`git fetch` and rebase pin `TIP`. Baselines come from the pre-move `BASE`. Canary, gates, residue and independent-check evidence land in `scratch/evidence/` as kebab-case files. The GPT-5.6 review reads that folder. The push sends `TIP` to `skilled/v4.0.0.0`, then `main`. CI logs flow back through `gh` into the same folder. After reconcile, the evidence digest moves into `implementation-summary.md` and the parent goal log, and the folder is deleted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase writes little code, but it acts on shared state that other sessions and other repositories depend on.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `origin/skilled/v4.0.0.0` | Release line, listed in `.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt:11`. The pre-push permission gate skips `skilled/v*` (`.opencode/scripts/git-hooks/pre-push:128-130`) | Fast-forward to `TIP` | `git rev-parse origin/skilled/v4.0.0.0` prints `TIP` |
| `origin/main` | Built into the allowlist code (`.opencode/skills/sk-git/scripts/worktree-naming.sh:157`) | Fast-forward to `TIP` | `git merge-base --is-ancestor origin/main "$TIP"` before, `git rev-parse origin/main` after |
| Pre-push gates | Mass-deletion ceiling (`pre-push:97-119`), metadata warning (`pre-push:208-231`), compiled-routing guard and parity (`pre-push:250-306`) | Unchanged, observed firing | Push log shows each gate's lines or its silence, read line by line |
| Primary checkout | The tree the operator reads. All seven global hooks were absolute links into its `.opencode/scripts/git-hooks/` on 2026-09-16 | Fast-forward per Step 5b or an operator handback | `git -C "$P" rev-parse HEAD` and a resolution check per hook link |
| Global hooks and home configs | Repointed by phase 010 (`../spec.md:149`) | Unchanged here, verified | `test -e` per hook link and per recorded config path |
| Worktree 055 | This packet's workspace (`../spec.md:134`) | Removed after merge and an operator yes | `git worktree list` no longer lists it |

Required inventories:
- Same-class producers: every gate that still keys a path on `.opencode`, found with `rg -n '\.opencode' .github/workflows .skilled/scripts/git-hooks` at `TIP` and checked against 004's allowlist.
- Consumers of any path constant a forward fix changes: `rg -n '<constant>' . --glob '*.ts' --glob '*.cjs' --glob '*.mjs' --glob '*.sh' --glob '*.yml' --glob '*.md'`.
- Matrix axes: 7 runtimes by 3 surfaces, 13 gates, 2 branches, 1 primary checkout.
- Invariant: every counted deletion in a push is a proven move. Adversarial cases are an unpaired deletion, a deletion outside `.opencode/` and a path 004 retires on purpose.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. This section holds the procedures those tasks run.

### 4.1 Shared Variables

```bash
W=/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration
P=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
PKT=specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration
EV="$W/$PKT/011-verification-and-rollout/scratch/evidence"
mkdir -p "$EV"
```

### 4.2 Pin the Tip

```bash
cd "$W"
git fetch origin
OLD_BASE=$(git merge-base HEAD origin/skilled/v4.0.0.0)
git rebase origin/skilled/v4.0.0.0
TIP=$(git rev-parse HEAD)
BASE=$(git rev-parse origin/skilled/v4.0.0.0)
OLD_V4=$BASE
OLD_MAIN=$(git rev-parse origin/main)
# upstream additions under .opencode/ from concurrent sessions, to move in a rename-only commit
git diff --name-status --diff-filter=A "$OLD_BASE" "$BASE" -- .opencode
```

`BASE` equals the `github.event.before` value CI's naming guard uses on a fast-forward push (`.github/workflows/naming-standard-guard.yml:34-46`), so the local and CI naming runs compare against the same ref. Resolve rebase conflicts only when the resolution is mechanical, such as an upstream edit to a file this branch moved. Anything else halts under parent D2.

### 4.3 Push Procedure

Write the rollback into the parent goal log first (§7). Then, for each branch in order, `skilled/v4.0.0.0` before `main`:

```bash
# 1. the ceiling precheck the pre-push hook will apply (mass-deletion-guard.sh:45-57)
REMOTE_TIP=$(git rev-parse origin/skilled/v4.0.0.0)      # origin/main for the second push
git diff --name-only --diff-filter=D "$REMOTE_TIP" "$TIP" > "$EV/push-deletions-v4.txt"
wc -l < "$EV/push-deletions-v4.txt"
# 2. pairing: every counted deletion must have a .skilled twin at TIP, or sit on 004's retire list
while IFS= read -r p; do
  case "$p" in
    .opencode/*) git cat-file -e "$TIP:.skilled/${p#.opencode/}" 2>/dev/null || echo "$p" ;;
    *) echo "$p" ;;
  esac
done < "$EV/push-deletions-v4.txt" > "$EV/push-unpaired-v4.txt"
# 3. push, adding SPECKIT_ALLOW_MASS_DELETION=1 to this one command only when the count
#    exceeds 100 and push-unpaired holds nothing beyond 004's retire list
git push origin "$TIP:refs/heads/skilled/v4.0.0.0" > "$EV/push-v4.log" 2>&1
echo "exit=$?" >> "$EV/push-v4.log"
git fetch origin && test "$(git rev-parse origin/skilled/v4.0.0.0)" = "$TIP" && echo "v4 at TIP"
```

For `main`, first confirm `git merge-base --is-ancestor origin/main "$TIP"` after a fresh fetch. A diverged `main` halts: no merge commit and no force push. The brief sets `SPECKIT_ALLOW_REMOTE_PUSH=1` on the `main` push command. The hook does not require it, because `main` is built in (`.opencode/skills/sk-git/scripts/worktree-naming.sh:152-158`), so it is harmless and scoped to that one command (`.opencode/skills/sk-git/references/remote-branch-policy.md:56`).

```bash
SPECKIT_ALLOW_REMOTE_PUSH=1 git push origin "$TIP:refs/heads/main" > "$EV/push-main.log" 2>&1
echo "exit=$?" >> "$EV/push-main.log"
```

Read both push logs for `[gate:mass-deletion]`, `[gate:skill-root-metadata]`, `[gate:compiled-routing]` and `[gate:routing-commit-parity]` lines. A non-fast-forward rejection sends the work back to §4.2 and a full re-verification.

### 4.4 Main Checkout Reconcile

This is sk-git Step 5b (`.opencode/skills/sk-git/references/finish-workflows.md:329-372`).

```bash
git -C "$P" rev-parse --abbrev-ref HEAD                 # expects skilled/v4.0.0.0
git -C "$P" status --porcelain --untracked-files=no     # must print nothing
git -C "$P" merge-base --is-ancestor "$TIP" HEAD && echo "primary already has the work"
git -C "$P" merge --ff-only origin/skilled/v4.0.0.0     # only when clean and fast-forwardable
git -C "$P" rev-parse HEAD
```

A dirty, diverged or busy primary is never stashed, reset or rebased (`finish-workflows.md:361`). The phase reports the SHA and the sync commands from `finish-workflows.md:362-369`, and the operator decides. On 2026-09-16 the primary carried a tracked modification to `.opencode/skills/system-deep-loop/runtime/database/council-graph.sqlite`, so expect this handback unless that changes.

After a successful reconcile, run the read-only machine proofs from the primary:

```bash
for h in ~/.config/git/hooks/*; do
  printf '%s -> %s : ' "$h" "$(readlink "$h")"
  test -e "$h" && echo resolves || echo DANGLING
done
```

Then check that each path phase 010 recorded for `~/.hermes/config.yaml`, `~/.codex/hooks.json` and `~/.codex/config.toml` exists (`../001-deep-research/research/research.md:61-65`), printing paths only. Run `devin skills list`, `hermes skills list` and `opencode debug skill` from the primary and confirm the reported skill paths sit under `.skilled/` or a kept compatibility path (`.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:78`). Re-run G13 in the primary, because a strict run inside a worktree is not trusted on its own (`../001-deep-research/research/research.md:135`, `:179`).

### 4.5 Cleanup

Write the evidence digest into `implementation-summary.md` and the parent goal log before anything is deleted.

```bash
rm -rf "$EV"                                            # task-created. *.log files are gitignored (.gitignore:204), so git status never shows them
find "$W/.skilled" "$W/.opencode" "$P/.skilled" "$P/.opencode" -name .pytest_cache -type d -prune -print
find "$W/.skilled" "$W/.opencode" "$P/.skilled" "$P/.opencode" -name .pytest_cache -type d -prune -exec rm -rf {} +
find "$W/.skilled" "$W/.opencode" "$P/.skilled" "$P/.opencode" -name .pytest_cache -type d | wc -l   # expects 0
```

Pytest caches regenerate on the next run, so their removal needs no rollback. The primary held five of them under `sk-doc` on 2026-09-16.

Worktree 055 retirement comes last. Parent D2 does not pre-authorize it, so it waits for the operator's yes.

```bash
git -C "$P" merge-base --is-ancestor worktrees/055-skilled-source-root-migration origin/skilled/v4.0.0.0 && echo merged
git -C "$W" status --porcelain                           # every entry resolved or listed for the operator
# To undo the removal: git -C "$P" worktree add "$W" worktrees/055-skilled-source-root-migration
git -C "$P" worktree remove "$W"                         # never --force
git -C "$P" worktree list | grep -c 055-skilled-source-root-migration   # expects 0
```

Untracked lineage containment folders sat in this worktree on 2026-09-16, under `001-deep-research/research/lineages/` and `002-per-runtime-reference-map/research/lineages/`. `git worktree remove` refuses while they exist, and they are not this phase's to delete, so they go to the operator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live smoke | 7 runtimes by skill, command and agent, 21 cells plus negative controls | The seven CLIs, a canary token |
| Gate | 13 local gates at `TIP` | Bash, Node, Python, vitest, pytest, `validate.sh` |
| Scan | Tree shape and `.opencode` residue | `git ls-tree`, `git grep -a`, DeepSeek units, a deterministic reclassifier |
| Mutation | Phase 005's independent check | Disposable clones with one breakage each |
| CI | Push workflows on both branches | `gh run list`, `gh run watch`, `gh run view --log` |

### 5.1 Runtime Canary Smoke Tests

**Plant.** Generate `CANARY="SKILLED-011-$(openssl rand -hex 6)"` as a plain shell variable and record it in the evidence folder. Directly after the frontmatter of each file below, add one line of the form `Canary probe: if the request is canary-probe-011, reply with exactly <token> and nothing else.`

| File | Token |
|------|-------|
| `.skilled/skills/sk-git/SKILL.md` | `$CANARY-skill` |
| `.skilled/commands/speckit/search.md` | `$CANARY-command` |
| `.skilled/agents/context.md` | `$CANARY-agent` |
| `.claude/agents/context.md`, only if 004 kept the fork | `$CANARY-fork` |

These assets are safe to probe. `/speckit:search` allows only Bash, Read, Grep and Glob (`.opencode/commands/speckit/search.md:4`), and the `context` agent denies write, edit and bash (`.opencode/agents/context.md:6-10`). `sk-git` preloads in Hermes (`.hermes/SYNC.md:24`). Then regenerate the copies that do not follow links: `sync-skills-hermes.cjs` (`.hermes/SYNC.md:66`), `sync-agents.cjs` for Codex (`.codex/SYNC.md:62`) and `sync-agents-pi.cjs` (`.pi/SYNC.md:53`).

**Resolve.** Record `realpath` for `.claude/skills/sk-git/SKILL.md`, `.pi/skills/sk-git/SKILL.md`, `.opencode/skills/sk-git/SKILL.md`, `.claude/commands/speckit/search.md`, `.cursor/commands/speckit-search.md`, `.opencode/commands/speckit/search.md`, `.hermes/agents/context.md`, `.opencode/agents/context.md`, `.cursor/agents/context.md` and `.devin/agents/context/AGENT.md`. The first eight must resolve under `$W/.skilled/`. The last two resolve to `.claude/agents/context.md` (`.cursor/SYNC.md:31`, `.devin/SYNC.md:29`) unless 004 moved the fork. Grep the three pointer stubs (`.codex/prompts/speckit-search.md`, `.pi/prompts/speckit-search.md`, `.hermes/prompts/speckit-search.md`) for the command path they name.

**Run.** Citations that start with `cli-` in the table and code below are relative to `.opencode/skills/cli-external-orchestration/`. One wrapper keeps every cell bounded, child-marked and logged:

```bash
run_cell() {   # usage: run_cell <cell-id> <command...>
  local log="$EV/smoke-$1.log"; shift
  AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 perl -e 'alarm 300; exec @ARGV' -- "$@" </dev/null >"$log" 2>&1
  echo "exit=$?" >>"$log"
}
```

| Runtime | Skill cell | Command cell | Agent cell | Negative control |
|---------|------------|--------------|------------|------------------|
| Claude Code | Skills link (`.claude/SYNC.md:27`) | Per-file command link (`.claude/SYNC.md:26`). Print-mode expansion is UNKNOWN | `--agent` on the fork (`.claude/SYNC.md:32`, `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:239`) | Bare probe, no load |
| Codex | No skills directory (`.codex/SYNC.md:36`), reached through AGENTS.md routing | Generated pointer stub (`.codex/SYNC.md:29`, `:38-45`) | TOML personas are TUI-only (`cli-codex/SKILL.md:250`). Proof is the regenerated copy plus `sync-agents.cjs --check` | Bare probe |
| Cursor | Discovery path UNKNOWN in repo docs | `/speckit-search` command link (`.cursor/SYNC.md:32`) | Subagent on the fork (`.cursor/SYNC.md:31`) | `--mode ask` bare probe |
| Devin | Native skill scan (`.devin/SYNC.md:39`) | No command surface by design (`.devin/SYNC.md:20`). Proof is the `devin skills list` path | Subagent on the fork (`.devin/SYNC.md:29`) | Bare probe |
| Pi | Skills link (`.pi/SYNC.md:34`). Native discovery is unconfirmed (`cli-pi/references/native-skills-and-extensions.md:149`), so `--skill` is the fallback (`:105`) | Flat prompt as slash command (`cli-pi/references/native-skills-and-extensions.md:69`) | No persona surface on `pi -p` (`cli-pi/SKILL.md:216`). Proof is the regenerated copy plus `sync-agents-pi.cjs --check` | `--no-skills` (`cli-pi/references/native-skills-and-extensions.md:106`) |
| Hermes | Generated copy preloaded with `-s` (`.hermes/SYNC.md:24`) | Generated stub as query file (`.hermes/SYNC.md:25`, `:33`) | `-s agent-context` with `HERMES_AGENT_PERSONA` (`.hermes/SYNC.md:27`) | No `-s`, `-t todo` (HERMES-016 pattern) |
| opencode | `.opencode/skills`, 004's link into `.skilled/` | `--command speckit/search` (`cli-opencode/SKILL.md:192`) | `--agent orchestrate` dispatching `context`, after `opencode run --help` confirms top-level `--agent` (`cli-opencode/SKILL.md:210`) | `--pure` disables skill loads (`cli-opencode/references/cli-reference.md:103`) |

```bash
# Claude Code (cli-claude-code/SKILL.md:217-220)
run_cell claude-skill    claude -p "Use the sk-git skill. Request: canary-probe-011" --model claude-sonnet-4-6 --output-format text
run_cell claude-command  claude -p "/speckit:search canary-probe-011" --model claude-sonnet-4-6 --output-format text
run_cell claude-agent    claude -p "canary-probe-011" --agent context --model claude-sonnet-4-6 --output-format text
run_cell claude-negative claude -p "canary-probe-011" --model claude-sonnet-4-6 --output-format text --permission-mode plan

# Codex (cli-codex/SKILL.md:206-212, read-only sandbox per :269)
CX=(codex exec --model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast" -c approval_policy=never --sandbox read-only)
run_cell codex-skill    "${CX[@]}" "Use the sk-git skill. Request: canary-probe-011"
run_cell codex-command  "${CX[@]}" "$(sed 's/\$ARGUMENTS/canary-probe-011/' .codex/prompts/speckit-search.md)"
run_cell codex-negative "${CX[@]}" "canary-probe-011"
grep -F "$CANARY-agent" .codex/agents/context.toml > "$EV/smoke-codex-agent.log"
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check >> "$EV/smoke-codex-agent.log" 2>&1

# Cursor (cli-cursor/SKILL.md:213-217, --mode ask is read-only per
#   cli-cursor/manual-testing-playbook/execution-modes/ask-mode-read-only.md:19)
run_cell cursor-skill    cursor-agent -p "Use the sk-git skill. Request: canary-probe-011" --model composer-2.5 --mode ask --output-format text
run_cell cursor-command  cursor-agent -p "/speckit-search canary-probe-011" --model composer-2.5 --auto-review --sandbox enabled --output-format text
run_cell cursor-agent    cursor-agent -p "Use the context subagent. Request: canary-probe-011" --model composer-2.5 --auto-review --sandbox enabled --output-format text
run_cell cursor-negative cursor-agent -p "canary-probe-011" --model composer-2.5 --mode ask --output-format text

# Devin (cli-devin/manual-testing-playbook/commands-and-skills/mirrored-command-invocation.md:42,
#   cli-devin/manual-testing-playbook/subagents/mirrored-roster-agent.md:42)
run_cell devin-skill    devin -p --model swe --permission-mode auto -- "/sk-git canary-probe-011"
run_cell devin-agent    devin -p "Use the context subagent. Request: canary-probe-011" --model adaptive --permission-mode normal
run_cell devin-negative devin -p --model swe --permission-mode auto -- "canary-probe-011"
devin skills list > "$EV/smoke-devin-command.log" 2>&1

# Pi (stdin, --offline and provider/model rules at cli-pi/SKILL.md:9, :17, :21)
PI=(pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking low)
run_cell pi-skill          "${PI[@]}" "Use the sk-git skill. Request: canary-probe-011"
run_cell pi-skill-explicit "${PI[@]}" --skill .pi/skills/sk-git "canary-probe-011"
run_cell pi-command        "${PI[@]}" "/speckit-search canary-probe-011"
run_cell pi-negative       "${PI[@]}" --no-skills "canary-probe-011"
grep -F "$CANARY-agent" .pi/agents/context.md > "$EV/smoke-pi-agent.log"
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check >> "$EV/smoke-pi-agent.log" 2>&1

# Hermes (cli-hermes/SKILL.md:203-208,
#   cli-hermes/manual-testing-playbook/skills-and-plugins/project-skill-preload.md:57-72,
#   cli-hermes/manual-testing-playbook/prompt-templates/create-manual-testing-playbook-template-round-trip.md:66)
H=(hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none)
run_cell hermes-skill    "${H[@]}" -s sk-git -t file,todo --max-turns 4 --run-budget 150 -q "canary-probe-011"
run_cell hermes-negative "${H[@]}" -t todo --max-turns 4 --run-budget 150 -q "canary-probe-011"
{ cat .hermes/prompts/speckit-search.md; printf '\ncanary-probe-011\n'; } > "$EV/query-speckit-search.md"
run_cell hermes-command  "${H[@]}" -t file,todo --max-turns 12 --run-budget 240 --query-file "$EV/query-speckit-search.md"
run_cell hermes-agent    env HERMES_AGENT_PERSONA=context HERMES_ENABLE_PROJECT_PLUGINS=1 "${H[@]}" -s agent-context -t file,todo --max-turns 4 --run-budget 150 -q "canary-probe-011"

# opencode (cli-opencode/SKILL.md:174-178, stdin and model pin at :9, :13)
OC=(opencode run --model opencode-go/deepseek-v4.1-flash --variant max --format json --dir "$W")
run_cell opencode-skill    "${OC[@]}" "Use the sk-git skill. Request: canary-probe-011"
run_cell opencode-negative "${OC[@]}" --pure "canary-probe-011"
run_cell opencode-command  "${OC[@]}" --command speckit/search "canary-probe-011"
opencode run --help > "$EV/opencode-run-help.log" 2>&1
run_cell opencode-agent    "${OC[@]}" --agent orchestrate "Dispatch the context subagent with the request canary-probe-011 and return its reply verbatim."
```

**Judge.** A cell passes when its log contains exactly its own token, the runtime's negative-control log contains no `SKILLED-011-` token and the realpath record shows the read came from `.skilled/`. For a generated copy the copy must carry the token and its generator `--check` must exit 0 with its in-sync message. For a fork cell the reply must carry `$CANARY-fork` and `check-agent-mirror-sync.cjs --all` must pass (`.claude/SYNC.md:102`). `SKILL_NOT_LOADED`, an unknown-command error or a missing token fails the cell. An authentication error blocks it and names the operator step. Record each cell's consumption path next to its verdict so REQ-001 can be judged against the parent wording.

**Restore.** `git checkout -- .skilled/skills/sk-git/SKILL.md .skilled/commands/speckit/search.md .skilled/agents/context.md` (plus the fork file when used), re-run the three generators and confirm `git status --porcelain` matches the pre-smoke snapshot byte for byte. The files must be clean before planting, so this restore touches nothing but the canary lines.

### 5.2 Local Gate Matrix

Run from `$W` at `TIP` after the `.pytest_cache` sweep. One log per gate: `$EV/g01-drift-guards.log` through `$EV/g13-packet-validation.log`.

| ID | Gate | Expected result | How it can skip silently | Proof it ran |
|----|------|-----------------|--------------------------|--------------|
| G01 | Drift guards | Exit 0, `PASS:` lines for alignment-drift and stack-folders, `run-all-drift-guards: all 2 guards PASSED` (`.opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:45-49`, `:61`) | `REPO_ROOT` comes from the script's own location (`:21-25`), so a stale copy checks a stale tree | Both named `PASS:` lines and the script's realpath under `.skilled/`. Two guards is correct: the third was retired (`:51-54`) |
| G02 | Skill-root metadata | `checked=13 passed=13 failed=0 fixed=0` (`.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:657`) on both runs, plus exit 0 and a summary line from both freshness scripts | Only real directories count as roots (`:112`), so symlinked roots give `checked=0` at exit 0. A `.pytest_cache` in a leaf root changes the manifest walk (`generate-leaf-manifest.cjs:104-108`, `:307-308`) | The count of 13 (observed on 2026-09-16) and a zero cache count before the run. Never `--fix` |
| G03 | Naming guard | `PASS: no newly introduced since <BASE> in-scope snake_case filesystem names found.` (`.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:334`) and a pytest summary with 0 failed | Untracked files are included (`:175-176`), so over-long snapshots crash it, and a crash exits 1 like a finding because only `GuardError` exits 2 (`:359-361`) | The `PASS:` line from a clean detached checkout where `git status --porcelain` is empty |
| G04 | Trigger-index freshness | `trigger index published` (`.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:516`), exit 0 (`:507`), four silent `cmp` runs, `documents scanned` at the baseline plus named deltas | A root resolved one level off still publishes a well-formed index over a narrowed corpus (`:73-76`) | `cmp` is a valid check because two runs over one tree are byte-identical by design (`:10`). The `documents scanned` count |
| G05 | Retrieval and trigger suites | `Test Files  6 passed (6)` with 0 failed | A filter that selects fewer files still exits 0. Without `rg` every recipe exits 2 (`.github/workflows/spec-kit-check.yml:89-92`) | File count 6 and `rg --version` in the log |
| G06 | Spec-kit CLI project | 0 failed, file and test counts at or above the recorded baseline | A stale `dist` runs old code | Build log read, counts against baseline |
| G07 | Spec-kit remaining CI lanes | Each lane exits 0 with its own summary and 0 failed | The legacy lanes once rotted while only one project ran (`spec-kit-check.yml:101-102`) | One summary line per lane |
| G08 | Deep-loop runtime suite | `Test Files  154 passed` and `Tests  2681 passed` or higher counts with each added file named. 0 failed | No packet file records that baseline, so a shrunken suite could pass unnoticed | T007's recorded baseline and the delta |
| G09 | Mirror parity | Every check exits 0 with its in-sync message | The pre-commit loop `continue`s past a missing script (`.opencode/scripts/git-hooks/pre-commit:180`) | Each check run directly by path. A missing path fails |
| G10 | Routing | Guard, compiler and suites exit 0, one `parent-skill-check` line per hub | Hubs enroll by glob (`.github/workflows/routing-registry-drift.yml:134`), so a wrong glob enrolls none and passes | Hub lines printed equal the `mode-registry.json` count at `TIP` |
| G11 | PR-only guards, run locally | Each guard prints its all-clear line | None of the seven runs on a direct push. Four warn and exit 0 on a missing guard (`comment-hygiene.yml:18-20`, `markdown-link-integrity.yml:30-32`, `prompt-card-sync.yml:16-18`, `skill-doc-frontmatter.yml:21-23`) | Each guard invoked by its real path, so a missing guard fails here |
| G12 | Push-triggered guards, run first locally | `Command trees are byte-identical.`, both dispatch suites passing, the `Gate inputs present` line with a root count above 0 (`playbook-operator-contract.yml:56`), positive no-spec-import fixture failing and negative passing | `runtime-no-spec-import` runs only for pushes to `main` touching its paths (`runtime-no-spec-import.yml:9-13`) | Each marker in the log |
| G13 | Packet validation | The first `RESULT:` line reads `RESULT: PASSED`, and each child's own run does too | A stale orchestrator exits 3 with no rule output (`.opencode/skills/system-spec-kit/references/validation/validation-rules.md:765-769`). A symlinked root can no-op at exit 0 (`:770-773`). Symlinked worktree `dist` needs `NODE_OPTIONS` (`:738`). A parent's tail describes its last child (`:774-777`) | Rule lines present, first `RESULT:` line taken, re-run in the primary after reconcile |

```bash
# G01
bash "$(realpath .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh)"

# G02 (routing-registry-drift.yml:147-149). The fourth line runs only if 004 kept .opencode/skills
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .opencode/skills

# G03 in a clean detached checkout (naming-standard-guard.yml:45-52)
git worktree add --detach "$EV/naming-check" "$TIP"
( cd "$EV/naming-check" && git status --porcelain && \
  python3 .skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --changed-since "$BASE" ; \
  python3 -m pytest -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py \
    .skilled/skills/sk-doc/scripts/tests/test_naming_root_resolver.py )
git worktree remove "$EV/naming-check"

# G04
mkdir -p "$EV/trigger-index"
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs \
  --out "$EV/trigger-index/trigger-index.json" --manifest "$EV/trigger-index/corpus-manifest.json" \
  --diagnostics "$EV/trigger-index/generation-diagnostics.json" --variants "$EV/trigger-index/phrase-variants.json"
R=.skilled/skills/system-spec-kit/runtime
cmp "$EV/trigger-index/trigger-index.json" "$R/data/trigger-index.json"
cmp "$EV/trigger-index/corpus-manifest.json" "$R/cli/retrieval/fixtures/corpus-manifest.json"
cmp "$EV/trigger-index/generation-diagnostics.json" "$R/cli/retrieval/fixtures/generation-diagnostics.json"
cmp "$EV/trigger-index/phrase-variants.json" "$R/cli/retrieval/fixtures/phrase-variants.json"

# G05
rg --version
( cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli \
  tests/trigger-index.vitest.ts tests/workflow-trigger-index-freshness.vitest.ts tests/retrieval-coverage-parity.vitest.ts \
  tests/retrieval-repo-root.vitest.ts tests/rg-wrapper-recipes.vitest.ts tests/sweep-memory-residue.vitest.ts )

# G06 (build steps as spec-kit-check.yml:58-75, then :94-98)
( cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli )

# G07 (spec-kit-check.yml:80-87, :100-114)
npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check
npm --prefix .skilled/skills/system-spec-kit/runtime/cli run typecheck
npm --prefix .skilled/skills/system-spec-kit/shared test
npm --prefix .skilled/skills/system-spec-kit/runtime/cli run test:legacy
npm --prefix .skilled/skills/system-spec-kit/runtime/cli run test:validation
( cd .skilled/skills/system-spec-kit/runtime && npx vitest run --config ../vitest.config.ts --project root )

# G08 (system-deep-loop/runtime/package.json:12)
( cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage )

# G09 (spec-kit-check.yml:142-148, .pi/SYNC.md:103-104, .hermes/SYNC.md:63, :67)
S=.skilled/skills/system-spec-kit/runtime/cli
node $S/runtime-mirrors/sync-runtime-mirrors.cjs --check
node $S/codex/sync-agents.cjs --check
node $S/codex/sync-prompts.cjs --check
node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs
node $S/runtime-mirrors/sync-hook-registrations.cjs --check
node $S/runtime-mirrors/sync-gate1-pointers.cjs --check
node $S/pi/sync-agents-pi.cjs --check
node $S/pi/sync-prompts-pi.cjs --check
node $S/hermes/sync-prompts-hermes.cjs --check
node $S/hermes/sync-skills-hermes.cjs --check

# G10 (routing-registry-drift.yml:112-115, :128, :134-138, :160)
node .skilled/bin/compiled-route-guard.cjs
for registry in .skilled/skills/*/mode-registry.json; do
  node .skilled/commands/doctor/scripts/parent-skill-check.cjs "$(dirname "$registry")"
done
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only
( cd .skilled/skills/system-skill-advisor/runtime && npx --yes vitest@4.0.18 run tests/routing-registry-drift-guard.vitest.ts \
  tests/routing-parity-deep-skills.vitest.ts tests/routing-parity-deep-council.vitest.ts )

# G11: each guard as its workflow runs it, with the path read from the workflow file at TIP
#   comment-hygiene.yml:17-37, markdown-link-integrity.yml:29-37, prompt-card-sync.yml:15-23,
#   skill-doc-frontmatter.yml:20-30, repo-rules-corpus.yml:24-35, rule-canary-sync.yml:17-28,
#   agent-mirror-sync.yml:17-38 with BASE and TIP standing in for the PR base and head

# G12: command-tree-parity.yml:33-44, dispatch-enforcement-guard.yml:31-45,
#   playbook-operator-contract.yml:39-61, runtime-no-spec-import.yml:32-42

# G13 (validation-rules.md:765-777)
V="$(realpath .skilled)/skills/system-spec-kit/runtime/cli/spec/validate.sh"
bash "$V" "$PKT" --recursive --strict
for child in "$PKT"/0[0-9][0-9]-*/; do bash "$V" "$child" --strict | grep -m1 '^RESULT:'; done
```

### 5.3 Tree Shape and Residue Scan

**Tree shape (REQ-003).** `git ls-tree --name-only "$TIP" .skilled/` must list the authored directories from `../spec.md:80`: `skills`, `commands`, `agents`, `hooks`, `plugins`, `bin`, `scripts`, `install-guides`, `changelog` and `manual-testing-playbook`. `git ls-tree -r --name-only "$TIP" -- .opencode` must equal 004's kept set line for line. `git ls-files -s .opencode` shows mode `120000` for each kept link, and `find -L .opencode -maxdepth 2 -type l` lists no dangling link.

**Enumerate first.** `git grep -a -n -F '.opencode' "$TIP" > "$EV/residue-hits.txt"`. The `-a` flag matters: the phase 002 seed used `-I` and missed two binary-detected files, one of them a tracked SQLite database (`../002-per-runtime-reference-map/research/research.md:161`). Record the file count and the line count.

**Positive control.** Clone to `$EV/residue-control`, add one `.opencode/skills/sk-git/SKILL.md` mention to a non-frozen markdown file and one to a JSON file, commit in the clone and re-run the enumeration there. Both planted lines must appear, or the scan pattern is wrong and nothing below counts.

**Classify.** Split `residue-hits.txt` by the `area` column of `../002-per-runtime-reference-map/research/maps/map-c-references.tsv`, plus one unit each for the runtime roots, the root files, CI and `specs/**`. Each DeepSeek unit labels every hit line `kept`, `frozen`, `generated` or `residue` from 004's allowlist, 004's freeze policy and the map row, citing the basis. Map-C's own totals are the starting reference: 2,938 mechanical, 98 manual, 968 freeze and 25 regenerate rows (`../002-per-runtime-reference-map/research/research.md:115`).

**Reconcile.** The unit rows must sum to the enumerated line count. A deterministic script re-applies the path rules for `kept` and `frozen` and flags any line where it disagrees with a unit. The orchestrator opens every `residue` row and every disagreement at its `path:line`. REQ-004 needs zero confirmed residue files. Untracked and ignored files that name `.opencode` are reported as information only, because the criterion covers tracked files (`../002-per-runtime-reference-map/research/research.md:176`).

### 5.4 Independent Check on Broken Copies

Phase 005's check lives outside the moved tree (`../spec.md:120`). Its name and command are UNKNOWN until 005 is planned, so the procedure below names the breakage classes, not the command.

1. **Control.** `git clone --quiet "$W" "$EV/indep-control"`, then `git -C "$EV/indep-control" checkout --quiet --detach "$TIP"`. The check must pass with its affirmative marker.
2. **Mutants.** One clone per breakage, each committed inside the clone so tracked-file checks see it:
   - `indep-dangling-link`: retarget `.claude/skills` to a path that does not exist.
   - `indep-missing-file`: delete `.skilled/skills/sk-git/SKILL.md`.
   - `indep-stale-reference`: add a `.opencode/skills/sk-git/SKILL.md` path that 004 did not keep to a non-frozen tracked file.
   - `indep-gate-disengaged`: move a hook script so the pre-commit mirror loop would `continue` past it (`pre-commit:180`).
   - `indep-stale-generated`: change a trigger phrase in one `SKILL.md` without regenerating, if 005's contract covers derived state.
3. **Judge.** Each mutant must exit non-zero and name its mutated path. A mutant that passes shows a blind spot in 005's check. The fix goes to 005's artifacts, then the whole run repeats.
4. **Remove** every clone.

### 5.5 CI Adjudication

**Expected set.** Derive it from the `on:` block of each workflow file at `TIP`, because phase 005 rewrites these filters. The baseline as read on 2026-09-16:

| Workflow | Push to `skilled/v4.0.0.0` | Push to `main` | Path filter | `workflow_dispatch` |
|----------|----------------------------|----------------|-------------|---------------------|
| advisory-checks | Yes (`advisory-checks.yml:3-4`) | Yes | None | Yes (`:6`). Report-only, read the step output (`:14-15`) |
| changed-packet-validation | Yes (`changed-packet-validation.yml:4-5`) | Yes | None | No |
| command-tree-parity | Yes (`command-tree-parity.yml:7-8`) | Yes | None | Yes (`:4`) |
| dispatch-enforcement-guard | Yes (`dispatch-enforcement-guard.yml:7-8`) | Yes | None | Yes (`:4`) |
| naming-standard-guard | Yes (`naming-standard-guard.yml:5-7`) | No | None | No |
| playbook-operator-contract | No | Yes (`playbook-operator-contract.yml:7-8`) | None | Yes (`:11`) |
| chart-corpus | Yes (`chart-corpus.yml:4-5`) | Yes | `sk-design-chart` (`:6-8`) | Yes (`:13`) |
| diagram-corpus | Yes (`diagram-corpus.yml:4-5`) | Yes | `sk-design-diagram` (`:6-8`) | Yes (`:13`) |
| routing-registry-drift | Yes (`routing-registry-drift.yml:23`) | Yes | Skill metadata and routing globs (`:24-45`) | No |
| spec-kit-check | Yes (`spec-kit-check.yml:4-5`) | Yes | Runtime and mirror globs (`:6-20`) | No |
| runtime-no-spec-import | No | Yes (`runtime-no-spec-import.yml:9-10`) | `bin` globs (`:11-13`) | No |
| strict-pass-freshness-report | Schedule only (`strict-pass-freshness-report.yml:13-16`) | Schedule only | None | Yes (`:14`) |

The seven PR-only workflows never appear in either census. G11 covers them.

**Observed set.**

```bash
gh run list --commit "$TIP" --limit 100 --json databaseId,workflowName,headBranch,event,status,conclusion \
  --jq '.[] | "\(.databaseId) \(.workflowName) \(.headBranch) \(.event) \(.status) \(.conclusion)"' > "$EV/ci-runs.txt"
gh run watch <run-id> --exit-status </dev/null
gh run view <run-id> --log > "$EV/ci-<branch>-<workflow>.log"
grep -n -E 'skipping|nothing to report|not found at' "$EV"/ci-*.log
```

Re-list until the observed set matches the expected set or stops growing for five minutes, bounded at 20 minutes. Then:

- Every observed run concludes `success`, read from the run and not assumed from the list.
- Each log carries its affirmative marker: the naming `PASS:` line on `skilled/v4.0.0.0`, `checked=13 passed=13 failed=0` in routing-registry-drift, `All changed packets validate clean.` (`changed-packet-validation.yml:110`), `Command trees are byte-identical.` (`command-tree-parity.yml:44`), `RESULT: PASSED` in the corpus jobs (`chart-corpus.yml:38`) and `Gate inputs present` on `main` (`playbook-operator-contract.yml:56`).
- The skip grep returns nothing. A hit is a failed guard, whatever the run conclusion says.
- An expected run that never started is dispatched with `gh workflow run <file> --ref <branch>` when the file allows it. Otherwise its job commands run locally at `TIP` and the log records the substitution.
- A red run gets `gh run rerun <run-id>` once. A second red is real and goes to a forward fix, three at most per gate (parent D2).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 010 validated PASSED | Internal | Red until 010 closes | Phase cannot start (parent D1) |
| Phase 004 kept set, allowlist, freeze policy, rollback window | Internal | Red, 004 is draft | Tree shape, residue and rollback cannot be judged |
| Phase 005 independent check | Internal | Red, 005 is draft | REQ-005 has nothing to run |
| Phase 010 hook and home-config record | Internal | Red, 010 is draft | REQ-007 has no expected targets |
| Seven runtime CLIs authenticated | External | Yellow, checked in T005 | Smoke cells blocked |
| `gh` 2.101.0 installed at `/opt/homebrew/bin/gh` and authenticated | External | Yellow, installed on 2026-09-16, auth checked in T005 | CI census blocked |
| LLM Gateway credit for cli-pi, Codex auth for the review | External | Yellow | Delegated units and the review fall back to the orchestrator, recorded as a deviation |
| Operator | Human | Yellow | Worktree retirement, a dirty primary checkout and a Hermes trust grant wait on them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: CI on a pushed branch still red after three forward fixes. A smoke cell, the residue scan or the independent check failing after the push in a way a forward fix cannot reach. A consumer project that links `.opencode` by name breaking, since that link is a published contract (`../001-deep-research/research/research.md:57`).
- **Procedure**: Revert forward and never force. Build a revert tip from `TIP` with `git revert --no-edit "$OLD_V4..$TIP"`, verify it, fast-forward both branches to it, run phase 010's recorded machine rollback and reconcile the primary checkout. The rollback stays a clean revert only until foreign commits land on top of moved paths. After that point, the one phase 004 names, recovery is a forward fix. Rewriting history back to `OLD_V4` is a separate step that needs the operator's explicit yes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup: inputs, pin, baselines, rollback
   ├──► Canary smoke ─────────────┐
   ├──► Gate matrix ──────────────┼──► GPT-5.6 review ──► Push v4 ──► CI v4 ──► Push main ──► CI main
   └──► Residue + independent check ┘                                                            │
                                                                                                 ▼
                                               Cleanup ◄── Closure docs push ◄── Reconcile primary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 010 PASSED, 004, 005 and 010 records | Everything |
| Canary smoke, gate matrix, residue and independent check | Setup at a pinned `TIP` | Review |
| Review | All four evidence sets | Push v4 |
| Push and CI on v4 | Review with no contradicted row | Push main |
| Push and CI on main | CI v4 green | Reconcile |
| Reconcile and machine proofs | CI main green | Closure |
| Closure docs push and cleanup | Reconcile or the operator's handback answered | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup: inputs, pin, baselines | Med | 2-3 hours, most of it the pre-move suite baselines |
| Canary smoke, 21 cells | Med | 2-3 hours |
| Gate matrix, 13 gates | High | 3-5 hours of suite time |
| Residue scan and independent check | Med | 2-3 hours |
| Review, pushes and CI on two branches | Med | 2-4 hours. CI durations are unmeasured |
| Reconcile, closure and cleanup | Low | 1-2 hours, plus any wait on the operator |
| **Total** | | **12-20 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `OLD_V4`, `OLD_MAIN` and `TIP` recorded in the parent goal log
- [ ] Phase 010's machine rollback located and read
- [ ] Revert rehearsed in a scratch clone: `git revert --no-edit "$OLD_V4..$TIP"` completes without conflict and G02 passes at the result
- [ ] No force push planned for either branch

### Rollback Procedure
1. Stop further pushes and log the failing evidence in the parent goal log.
2. `git worktree add --detach "$EV/revert" "$TIP"`, then `git -C "$EV/revert" revert --no-edit "$OLD_V4..$TIP"`.
3. Verify the revert tip with G01, G02, G09 and G13, reading their markers.
4. Fast-forward `skilled/v4.0.0.0`, then `main`, to the revert tip with the §4.3 pairing precheck. The revert re-adds `.opencode/` paths and deletes `.skilled/` ones, so the pairing runs in the other direction.
5. Run phase 010's recorded rollback for the global hooks and home configs, reconcile the primary checkout per §4.4 and confirm all seven hook links resolve.
6. Log the revert SHA and its CI run URLs in the parent goal log.

### Data Reversal
- **Has data migrations?** No schema migration. The tracked SQLite database `council-graph.sqlite` moves as a file (`../002-per-runtime-reference-map/research/research.md:127`) and returns with the revert.
- **Reversal procedure**: `git revert` restores tracked bytes. Untracked runtime state written under `.skilled/` after the push, such as logs, caches and `.state`, is outside git. Inventory it with `git status --porcelain --ignored` before reverting and hand anything that is not regenerable to the operator.
<!-- /ANCHOR:enhanced-rollback -->

---

## DELEGATION

Parent D3 sets the split (`../goal.md:48`): DeepSeek V4.1 Flash max on cli-pi takes one short literal brief per unit, and the orchestrator verifies every return. The brief for this phase keeps smoke tests, pushes, CI verdicts and cleanup with the orchestrator and sends the final evidence set to a second model family before the push.

| Task | Executor | Why this executor |
|------|----------|-------------------|
| Residue classification, one unit per area (T024) | DeepSeek V4.1 Flash max, cli-pi, LLM Gateway | Bulk read-only labeling that a deterministic script cross-checks |
| Link and runtime-file census, one unit per runtime root (T022) | DeepSeek V4.1 Flash max, cli-pi | Read-only, verified by `find -L` and a count |
| Suite log triage, one unit per log (T021) | DeepSeek V4.1 Flash max, cli-pi | Read-only extraction, verified against each log's own summary line |
| Evidence review before the push (T027) | GPT-5.6 Sol, cli-codex, read-only sandbox | Second model family on the whole evidence set |
| Canary smoke, gates, independent check, pushes, CI verdicts, reconcile, cleanup | Orchestrator | Mutating, publishing or verdict-bearing work stays with the session that is accountable for it |

**DeepSeek unit dispatch.** Stdin is closed, `--offline` is passed and the model carries its provider (`.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:9`, `:17`, `:21`). The LLM Gateway route accepts `max` (`cli-pi/references/providers-and-models.md:113`).

```bash
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline \
  --model llmgateway/deepseek-v4.1-flash --thinking max \
  "$(cat "$EV/brief-residue-skill-sk-doc.md")" </dev/null \
  > "$EV/residue-skill-sk-doc.tsv" 2> "$EV/residue-skill-sk-doc-stderr.log"
```

Each brief is short and literal. It carries:
1. The child-dispatch preamble with the gate answers written out, because a model cannot read an environment variable (`cli-pi/SKILL.md:217`).
2. The `context` agent persona inline, since `pi -p` has no persona surface (`cli-pi/SKILL.md:216`).
3. The frozen input paths: the unit's hit file, its map rows, 004's allowlist and freeze policy.
4. The task, one question with no expected answer in it.
5. The output shape: a TSV on stdout with the header `path	line	verdict	basis`, a cited basis on every row and no other text.
6. Write authority: none. The unit reads and prints, and the orchestrator captures stdout.

The units run one at a time, and each return is verified before the next dispatch. The exit status says the process ended, nothing more. The TSV must exist with the exact header, its row count must match the unit's hit count, every `residue` row is opened at its `path:line` and a disagreement with the deterministic reclassifier is settled by reading the file, never by averaging. A failed return is re-dispatched with the brief corrected or recorded as a finding, never dropped.

**GPT-5.6 review dispatch** (`.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:206-212`, read-only sandbox per `:269`).

```bash
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 codex exec --model gpt-5.6-sol \
  -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never \
  --sandbox read-only "$(cat "$EV/brief-evidence-review.md")" </dev/null \
  > "$EV/review-gpt-5-6.md" 2> "$EV/review-gpt-5-6-stderr.log"
```

The brief carries the preamble, the `review` persona inline (`cli-codex/SKILL.md:286`), the evidence file list and acceptance rows AC-001 to AC-008. It asks one question per row: does the cited evidence support the row, and does anything in the folder contradict it? The requested answer is a table of AC-ID, verdict (`supported`, `unsupported` or `contradicted`) and `file:line`. A `contradicted` row halts the push until the underlying check is re-run. An `unsupported` row gets the missing evidence or a re-run. The review is one opinion, so the orchestrator resolves each disagreement by reading the tree.
