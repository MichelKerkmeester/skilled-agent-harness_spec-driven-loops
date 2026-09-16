---
title: "Implementation Plan: Layout Probes for the Skilled Source-Root Move"
description: "Nine probes in disposable clones and read-only lanes answer the runtime and git questions phase 004 needs. The orchestrator runs every live command and DeepSeek V4.1 Flash on cli-pi reads source."
trigger_phrases:
  - "skilled layout probe plan"
  - "probe delegation deepseek pi"
  - "skilled rename rehearsal plan"
  - "gate filter trace plan"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Layout Probes for the Skilled Source-Root Move

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, git 2.50.1 (Apple Git-155), Python 3 for the enumeration and SQLite passes |
| **Framework** | Claude Code 2.1.273, Codex CLI 0.154.0, Cursor Agent 2026.09.10-fd3934a, Devin 3000.10.27, Pi 0.85.1, Hermes Agent 0.21.1, opencode 1.18.11, each read with `--version` on 2026-09-16 |
| **Storage** | Disposable clones, logs and lane returns under `/tmp/skilled-probes-003/`. Records under `probes/` in this folder |
| **Testing** | A baseline positive control per live row, a citation check per lane return and before-and-after status and hash guards |

### Overview
Each of the nine questions gets one probe and one record. Live probes run in clones of branch `worktrees/055-skilled-source-root-migration` under `/tmp`, with each clone's remote removed and its git hooks redirected, so nothing reaches the real repository or this machine's global hooks. Source reading goes to DeepSeek V4.1 Flash on cli-pi with read-only tools, and the orchestrator opens every citation that comes back before it enters a record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001 and 002 validate PASSED, and their open questions map onto Q1 to Q9 in spec.md §3
- [ ] The seven runtime CLIs answer `--version`, and the answers match §1 or are re-recorded
- [ ] The `/tmp` volume has room for one full clone and three shallow clones. The full clone carries 2.07 GiB of packs (`git count-objects -vH`), and worktree 055 occupies 2.68 GiB on disk, so four working trees stay under 13 GiB
- [ ] Both checkouts' status and the home-file hash list are captured before the first probe

### Definition of Done
- [ ] Every acceptance criterion is Met
- [ ] Every lane-produced record carries its verification section
- [ ] `/tmp/skilled-probes-003/` is removed after the records are verified
- [ ] `validate.sh --strict` run from the main checkout ends with `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
An orchestrator with read-only lanes. The orchestrator runs every command that launches a runtime, runs git or scans the home directory. DeepSeek lanes read files and reply with cited tables. No lane writes a file: the orchestrator saves each reply and writes the record.

### Key Components
- **Rehearsal clone** `/tmp/skilled-probes-003/rehearsal`: a full, no-hardlinks clone pinned to the base SHA, used for Q5.
- **Link clones** `/tmp/skilled-probes-003/links-baseline`, `links-shape-a` and `links-shape-b`: depth-1 clones used for Q4 first and Q2 after it.
- **Dangling-hook sandbox** `/tmp/skilled-probes-003/dangling-hook`: a fresh repository with its own bare remote, used for Q3.
- **Home-state guard**: a SHA-256 snapshot of every home file the Q8 scan lists, compared after each live run.
- **Records** under `probes/`: one per question plus `probe-environment.md`, each probe record ending with its shape implications.

### Candidate Shapes

| Shape | `.opencode` after the move | Built in the probes as |
|-------|----------------------------|------------------------|
| Baseline | Today's real directory | `links-baseline`, unmodified |
| A | One link, `.opencode -> .skilled` | `links-shape-a` |
| B | Real directory whose `skills`, `commands`, `agents`, `hooks`, `plugins`, `bin` and `scripts` entries link into `.skilled/` | `links-shape-b` |
| B2 | Shape B with opencode's install files (`.opencode/package.json`, `.opencode/bun.lock`) moved into `.skilled/`, which is phase 004's P2b variant | `links-shape-b2`, run for rows R1 and R13 only |
| C | Real directory holding only what opencode itself reads (`../spec.md:157`) | Not built. Each Q2 and Q8 row records which `.opencode/<surface>` path it needed, which is exactly what C removes |

D5 keeps `.opencode/` resolvable (`../goal.md:50`), so no probe builds a layout without it.

### Data Flow
Setup records the base and captures help text. The home scan seeds the guard. Lanes and live probes write into `/tmp/skilled-probes-003/`. The orchestrator verifies what came back and writes each record. Phase 004 reads the records.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes nothing. The table lists the surfaces the probes must leave untouched and the check that proves it.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Worktree 055 | Holds this phase's documents and records | Only `probes/` and this folder's documents change | `git -C "$WT" status --porcelain` compared with `$P/wt-status-before` |
| Main checkout | Source of every clone, owner of `.git/config` and target of the global hooks | Unchanged | `git -C "$MAIN" status --porcelain` compared with `$P/main-status-before`, and no clone keeps a remote |
| Global hooks `~/.config/git/hooks/` | Seven absolute links into the main checkout (`../002-per-runtime-reference-map/research/maps/map-b-home.tsv:31-37`) | Unchanged and never invoked by a clone write | `-c core.hooksPath=$P/empty-hooks` on every clone write, and `ls -la ~/.config/git/hooks` before and after |
| Home config files listed by Q8 | Runtime, shell and git configuration | Unchanged | Home-state guard compare after every live run |
| `/tmp/skilled-probes-003/` | Disposable clones, logs, briefs, returns and string extracts | Created, then removed | Removal after T022 passes |

Required inventories:
- Matrix axes: Q2 runs 11 surface rows in 3 clones, 33 runs. Q4 covers 12 gates under 2 shapes, 24 rows. Q5 measures 2 commit variants at 3 rename limits, 6 count rows, plus 2 guard verdicts, 2 pre-push runs, 5 follow samples and 1 checkout over ignored files.
- Same-class producers: one gate filter missing `.skilled` implies a class, so Q4 traces all 12 gates in `pre-commit` and `pre-push` instead of only the filters phase 001 cited.
- Consumers: every Q1 `configurable` cell is confirmed by the matching Q2 run where a listing or marker observation exists, and is marked documented but unconfirmed otherwise.
- Invariant: no probe writes outside `/tmp/skilled-probes-003/` and `probes/`, and no clone keeps a remote.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The probe definitions below are what those tasks execute.

### Shared Setup

Run once, by the orchestrator, before any probe (T001, T002):

```bash
P=/tmp/skilled-probes-003
MAIN=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
WT=/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration
REC="$WT/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes/probes"
BR=worktrees/055-skilled-source-root-migration
H=(-c core.hooksPath=/tmp/skilled-probes-003/empty-hooks)
mkdir -p "$P"/{empty-hooks,markers,logs,iso,briefs,returns,strings} "$REC/captures"
git -C "$WT" rev-parse HEAD > "$P/base-sha"
git -C "$WT" status --porcelain > "$P/wt-status-before"
git -C "$MAIN" status --porcelain > "$P/main-status-before"
git clone --quiet --no-hardlinks --branch "$BR" "$MAIN" "$P/rehearsal"
git -C "$P/rehearsal" remote remove origin
git -C "$P/rehearsal" "${H[@]}" checkout --quiet --detach "$(cat "$P/base-sha")"
for s in baseline shape-a shape-b; do
  git clone --quiet --depth 1 --branch "$BR" "file://$MAIN" "$P/links-$s"
  git -C "$P/links-$s" remote remove origin
done
```

The base SHA was `728c4f3efc` when this plan was written. T002 confirms each link clone's HEAD equals `$P/base-sha` and that `git -C <clone> remote` prints nothing.

### Probe P1: Runtime Root Configurability (Q1)

**Question.** Can each runtime load its assets from a directory other than its own name (`../001-deep-research/research/research.md:162`)?

**Executor.** The orchestrator captures help text and two path listings. DeepSeek units U1 to U7 read them and the installed source, one runtime each.

**Command.** Help captures run from `$P`, so no project resources load. The two path listings run in the baseline clone with isolated config directories once the home-state guard snapshot exists (T004). They double as the isolation check for Devin and opencode:

```bash
cd "$P" && C="$REC/captures"
claude --help > "$C/claude-code-help.txt" 2>&1
codex --help > "$C/codex-help.txt" 2>&1; codex debug --help > "$C/codex-debug-help.txt" 2>&1
cursor-agent --help > "$C/cursor-agent-help.txt" 2>&1
devin --help > "$C/devin-help.txt" 2>&1; devin skills --help > "$C/devin-skills-help.txt" 2>&1
pi --offline --help > "$C/pi-help.txt" 2>&1
hermes --help > "$C/hermes-help.txt" 2>&1; hermes skills --help > "$C/hermes-skills-help.txt" 2>&1
opencode --help > "$C/opencode-help.txt" 2>&1; opencode debug --help > "$C/opencode-debug-help.txt" 2>&1
(cd "$P/links-baseline" && SYSTEM_HOOKS_DISABLED=1 XDG_CONFIG_HOME="$P/iso/devin/config" XDG_DATA_HOME="$P/iso/devin/data" \
  devin skills paths > "$C/devin-skills-paths.txt" 2>&1)
(cd "$P/links-baseline" && SYSTEM_HOOKS_DISABLED=1 OPENCODE_CONFIG_DIR="$P/iso/opencode/config" XDG_CONFIG_HOME="$P/iso/opencode/xdg-config" \
  XDG_DATA_HOME="$P/iso/opencode/xdg-data" XDG_STATE_HOME="$P/iso/opencode/xdg-state" XDG_CACHE_HOME="$P/iso/opencode/xdg-cache" \
  opencode debug paths > "$C/opencode-debug-paths.txt" 2>&1)
```

For the four compiled binaries, `strings -n 6 <binary> | rg -n -e '<own directory literal>/' -e '<config env literal>'` writes to `$P/strings/<runtime>.txt`. These extracts stay out of the repository and count as supporting evidence only.

| Unit | Runtime and build | What the unit reads | Surfaces |
|------|-------------------|---------------------|----------|
| U1 | Claude Code 2.1.273, compiled binary at `~/.local/share/claude/versions/2.1.273` | `claude-code-help.txt` (`--plugin-dir`, `--add-dir`, `--agents`, `--settings`) and its strings extract | skills, commands, agents, hooks, plugins |
| U2 | Codex CLI 0.154.0, compiled binary at `/opt/homebrew/Caskroom/codex/0.154.0/bin/codex` | `codex-help.txt` (`-C`, `--add-dir`, `-c`, `CODEX_HOME`), `codex-debug-help.txt` and its strings extract | prompts, agents, hooks |
| U3 | Cursor Agent 2026.09.10-fd3934a, JavaScript bundle under `~/.local/share/cursor-agent/versions/2026.09.10-fd3934a/` | `cursor-agent-help.txt` (`--workspace`, `--add-dir`, `--plugin-dir`) and the bundle chunks | commands, agents, rules, hooks |
| U4 | Devin 3000.10.27, compiled binary at `~/.local/share/devin/cli/_versions/3000.10.27/bin/devin` | `devin-help.txt` (`--config`), `devin-skills-help.txt` (`skills paths`), `devin-skills-paths.txt` and its strings extract | skills, agents, hooks, rules |
| U5 | Pi 0.85.1, JavaScript under `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/` | `pi-help.txt` (`--extension`, `--skill`, `--prompt-template`, `PI_CODING_AGENT_DIR`, `PI_PACKAGE_DIR`), `package.json`, `dist/config.js`, `dist/core/resource-loader.js`, `dist/core/package-manager.js`, `dist/core/extensions/loader.js` | extensions, skills, prompt templates |
| U6 | Hermes Agent 0.21.1, Python under `~/.hermes/hermes-agent/` | `hermes-help.txt`, `hermes-skills-help.txt` and the installed source | skills, plugins |
| U7 | opencode 1.18.11, compiled binary at `~/.local/lib/node_modules/opencode-ai/bin/opencode.exe` | `opencode-help.txt`, `opencode-debug-help.txt`, `opencode-debug-paths.txt` and its strings extract | plugins, commands, agents, skills |

**Distinguishing observation.** A documented flag, environment variable or config key that loads a surface from an arbitrary path makes that surface `configurable`. A hardcoded directory constant makes it `fixed name`. A `configurable` surface can read `.skilled/` directly under any shape. A `fixed name` surface keeps its own directory as a consumer, a link or a generated tree, under every shape.

**Record.** `probes/runtime-root-configurability.md`, one section per runtime, each ending with its verification table.

### Probe P2: Symlink Resolution in Runtime Loaders (Q2)

**Question.** Do opencode's flat plugin glob, Devin's skill scan, Pi's extension imports and the command and agent discovery of Claude Code, Cursor Agent and Codex work through links (`../002-per-runtime-reference-map/research/research.md:170`)?

**Executor.** The orchestrator, because every row launches a runtime.

**Command.** Build the shapes, then count dangling links in each clone. A shape count above the baseline count names links that cross between a moved surface and an unmoved sibling, and those links are listed before any runtime row runs:

```bash
(cd "$P/links-shape-a" && rm -rf .skilled && mv .opencode .skilled && ln -s .skilled .opencode)
(cd "$P/links-shape-b" && rm -rf .skilled && mkdir .skilled && for d in skills commands agents hooks plugins bin scripts; do mv ".opencode/$d" ".skilled/$d" && ln -s "../.skilled/$d" ".opencode/$d"; done)
for s in baseline shape-a shape-b; do (cd "$P/links-$s" && printf '%s %s\n' "$s" "$(find . -path ./.git -prune -o -type l ! -exec test -e {} \; -print | wc -l)"); done
```

Every live run exports `SYSTEM_HOOKS_DISABLED=1`, which turns every repository plugin into a full no-op (`.opencode/plugins/README.md:20`). The repository's own plugins include a process reaper (`.opencode/plugins/README.md:32`), so they must not act from a clone. Probe-owned fixtures are the only code expected to run. Each runtime's isolation directory sits under `$P/iso/<runtime>`. The T005 path listings verify it for Devin and opencode, and T010 verifies it for the other runtimes before their first run.

Fixtures sit inside the authored tree: `.opencode/` in the baseline, `.skilled/` in shapes A and B. Baseline runs reach them through today's layout for that surface, so a positive baseline proves the observation works. Shape A reaches them through today's link text across the `.opencode` link. Shape B reaches them through links retargeted into `.skilled/`. Rows marked "directory link" replace the runtime's own directory with a link in shapes A and B only. Each model-calling run uses a fresh `NONCE=$(uuidgen)`, and `rg -uu -F "$NONCE" <clone>` must find nothing before the fixture is written.

| Row | Runtime and surface | Probe fixture | Observation command | Loaded when |
|-----|---------------------|---------------|---------------------|-------------|
| R1 | opencode plugins | `probe-marker.js` in the authored plugins directory, in the repository's plugin shape (`.opencode/plugins/README.md:16`), writing `$P/markers/<clone>-opencode` from its factory | `opencode debug startup`, then `opencode debug config` if the baseline marker stays absent, with `OPENCODE_CONFIG_DIR` and `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, `XDG_STATE_HOME`, `XDG_CACHE_HOME` under `$P/iso/opencode` | the marker file exists |
| R2 | opencode commands | `probe-nonce-command.md` in the authored `commands` directory | `opencode debug config` with the R1 environment | the command name is listed |
| R3 | opencode agents | `probe-nonce-agent.md` in the authored `agents` directory | `opencode agent list` with the R1 environment | the agent name is listed |
| R4 | Devin skills | none, the repository's own skill packets (`.devin/SYNC.md:20`) | `devin skills list` and `devin skills paths`, with `XDG_CONFIG_HOME` and `XDG_DATA_HOME` under `$P/iso/devin` | the baseline's repository skill count is listed |
| R5 | Pi extensions | `probe-marker.ts` beside `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts`, linked from `.pi/extensions/`, importing `../../.opencode/hooks/shared/hook-flags.mjs` exactly as that file does at line 6. Shape B retargets every `.pi/extensions/*.ts` link into `.skilled/` | the no-model command U5 names from `dist/core/extensions/loader.js`, run with `PI_CODING_AGENT_DIR=$P/iso/pi` and `--offline --approve` | the marker exists and stderr names no extension load failure that the baseline lacks |
| R6 | Claude Code commands | `probe-nonce-command.md` behind a per-file link in `.claude/commands/`, the generated shape (`.claude/SYNC.md:26`) | `claude -p "/probe-nonce-command" --output-format stream-json --verbose` with `CLAUDE_CONFIG_DIR=$P/iso/claude` | the init event lists the command and the reply carries the nonce |
| R7 | Claude Code agents, directory link | `probe-nonce-agent.md` in `.claude/agents/` | the R6 session, asking for the agent's reply | the init event lists the agent and the reply carries the nonce |
| R8 | Cursor Agent commands | `probe-nonce-command.md` behind a per-file link in `.cursor/commands/` (`.cursor/SYNC.md:32`) | `cursor-agent -p --trust --workspace <clone> --output-format stream-json "/probe-nonce-command"` with `CURSOR_CONFIG_DIR` and `CURSOR_DATA_DIR` under `$P/iso/cursor` | the reply carries the nonce |
| R9 | Cursor Agent agents, directory link | `probe-nonce-agent.md` in `.cursor/agents/` | the R8 command, asking for the agent's reply | the reply carries the nonce |
| R10 | Codex prompts, directory link | `probe-nonce-command.md` in `.codex/prompts/` | `codex -C <clone> debug prompt-input` with `CODEX_HOME=$P/iso/codex`, then a `codex exec` nonce run if the baseline input does not list prompts | the prompt name appears in the rendered input, or the reply carries the nonce |
| R11 | Codex agents, directory link | `probe-nonce-agent.toml` in `.codex/agents/` (`.codex/SYNC.md:28`) | the R10 commands | the agent name appears, or the reply carries the nonce |
| R12 | opencode skills | `probe-nonce-skill/SKILL.md` in the authored `skills` directory | `opencode debug skill` with the R1 environment | the nonce skill is listed |
| R13 | opencode `code_mode` launcher | none; the launcher builds its server path from literal `.opencode` segments under `path.resolve(__dirname, '..', '..')` (`.opencode/bin/mcp-code-mode-launcher.cjs:19-28`) | `node .opencode/bin/mcp-code-mode-launcher.cjs </dev/null` in each clone, which has no built `dist/` | stderr names the missing `dist/index.js` of a server whose `package.json` was found, exactly as in the baseline; a missing manifest means the path did not resolve |

A runtime that cannot authenticate with its isolation directory does not fall back to the real home config. Its rows record "not probed: isolation breaks authentication" with the error text (D4 in `goal.md`).

**Distinguishing observation.** A row that loads in the baseline and in both shapes leaves the choice to other probes. A row that loads in shape A but not shape B means the loader follows a linked root but not a linked surface directory, which favours A over B, and the reverse favours B. A row that loads only in the baseline rules out every linked shape for that surface, so the runtime needs a real directory or a generated tree. The R5 result also says whether today's Pi extensions resolve imports from the link location, which decides whether their `.opencode` import literals pin shape C to keeping `.opencode/hooks`.

**Record.** `probes/runtime-symlink-resolution.md`, one row per run with the command, exit status, observation and the guard result.

### Probe P3: Dangling Hook Under core.hooksPath (Q3)

**Question.** Does git skip or fail when a hook under `core.hooksPath` dangles (`../001-deep-research/research/research.md:164`)? The seven installed global hooks are absolute links into the main checkout (`../002-per-runtime-reference-map/research/maps/map-b-home.tsv:31-37`), so this decides whether the machine degrades loudly or silently at cutover.

**Executor.** The orchestrator, because it runs git hooks.

**Command.**

```bash
D="$P/dangling-hook" && mkdir -p "$D/hooks" "$D/nonexec" "$D/failing"
git init --quiet "$D/repo"; git init --quiet --bare "$D/remote.git"; git -C "$D/repo" remote add origin "$D/remote.git"
ln -s "$D/missing/pre-commit" "$D/hooks/pre-commit"; ln -s "$D/missing/pre-push" "$D/hooks/pre-push"
git -C "$D/repo" -c core.hooksPath="$D/hooks" commit --allow-empty -m dangling; echo "commit exit=$?"
git -C "$D/repo" rev-list --count HEAD
git -C "$D/repo" -c core.hooksPath="$D/hooks" push origin HEAD:refs/heads/probe; echo "push exit=$?"
git -C "$D/remote.git" rev-parse --verify --quiet refs/heads/probe; echo "remote ref exit=$?"
printf '#!/bin/sh\nexit 1\n' > "$D/nonexec/pre-commit"; chmod 644 "$D/nonexec/pre-commit"
cp "$D/nonexec/pre-commit" "$D/failing/pre-commit"; chmod 755 "$D/failing/pre-commit"
git -C "$D/repo" -c core.hooksPath="$D/nonexec" commit --allow-empty -m nonexec; echo "nonexec exit=$?"
git -C "$D/repo" -c core.hooksPath="$D/failing" commit --allow-empty -m failing; echo "failing exit=$?"
git config --show-origin --get advice.ignoredHook; git --version
```

The push goes to the sandbox's own bare repository, never to a real remote.

**Distinguishing observation.** Exit 0 with no hook message, a landed commit and a landed push means a dangling global hook disengages silently. A non-zero exit or an error naming the hook means it fails loudly and blocks every repository on the machine that uses the path. The non-executable control shows whether git prints anything for an unusable hook, and the failing control shows a block is observable in this sandbox.

**Record.** `probes/dangling-hook-behavior.md`.

### Probe P4: Gate Filters Under a Linked Root (Q4)

**Question.** With `.opencode` reached through a link, do the gate scripts run while their staged-path filters miss `.skilled` changes (`../001-deep-research/research/research.md:87`, `:165`)?

**Executor.** The orchestrator, because it runs hooks under `bash -x`.

**Gates traced**, with line numbers in `.opencode/scripts/git-hooks/`:

| Gate | Script path and check | Path filter |
|------|-----------------------|-------------|
| Comment hygiene | `pre-commit:45`, `:50` | `pre-commit:76`, every staged ACM file |
| Agent mirror sync | `pre-commit:90`, `:98` | `pre-commit:95`, `^\.(opencode\|claude)/agents/` |
| Mirror parity | `pre-commit:168-180` | `pre-commit:138-145`, pathspecs `.opencode/agents`, `.opencode/commands`, `.opencode/hooks` |
| Prompt card sync | `pre-commit:200-201` | `pre-commit:201-202`, `^\.opencode/skills/` patterns |
| MCP mutation class | `pre-commit:222-223` | `pre-commit:223-224`, `^\.opencode/` patterns |
| Compiled routing re-mint | `pre-commit:254` | `pre-commit:258-260`, pathspecs `.opencode/skills/*/SKILL.md` and siblings |
| Spec metadata re-mint | `pre-commit:503` | `pre-commit:425`, `specs/**/*.md` |
| Mass-deletion ceiling | `pre-push:37-47` | `pre-push:102-104`, deletions in the pushed range |
| Skill change detector | none | `pre-push:121-123`, pathspec `.opencode/skills` |
| Skill metadata gate | `pre-push:209`, `:213-215` | the detector's result |
| Route guard | `pre-push:251-252` | none, reads the working tree |
| Routing bytes parity | none | `pre-push:280-290`, pathspecs under `.opencode/` |

**Command**, in `links-shape-a` and then `links-shape-b`, right after T008 builds the shapes and before any P2 fixture exists there, so the layout commit holds only the move:

```bash
cd "$P/links-shape-a"
git "${H[@]}" add -A && git "${H[@]}" commit --quiet -m "probe: layout commit"
printf '\nprobe edit\n' >> .skilled/agents/markdown.md
printf '\nprobe edit\n' >> .skilled/skills/sk-doc/README.md
git add .skilled/agents/markdown.md .skilled/skills/sk-doc/README.md
git add .opencode/agents/markdown.md; echo "stage through link exit=$?"
git diff --cached --name-only --diff-filter=ACMD | grep -cE '^\.(opencode|claude)/agents/'
git diff --cached --name-only -- .opencode/agents .opencode/commands .opencode/hooks; echo "pathspec exit=$?"
env -u SYSTEM_HOOKS_DISABLED bash -x .opencode/scripts/git-hooks/pre-commit > "$P/logs/shape-a-pre-commit.trace" 2>&1; echo "pre-commit exit=$?"
git "${H[@]}" commit --quiet -m "probe: staged edits"
printf 'refs/heads/skilled/v0.0.0.0-probe %s refs/heads/skilled/v0.0.0.0-probe %s\n' "$(git rev-parse HEAD)" "$(git rev-parse HEAD~1)" \
  | env -u SYSTEM_HOOKS_DISABLED bash -x .opencode/scripts/git-hooks/pre-push origin /nonexistent > "$P/logs/shape-a-pre-push.trace" 2>&1; echo "pre-push exit=$?"
```

The traces run with `SYSTEM_HOOKS_DISABLED` unset. When it is set, `hook_enabled` returns false (`.opencode/hooks/shared/hook-flags.sh:42-43`) and `pre-commit` exits 0 before its first gate (`pre-commit:26`), which would look like a clean pass. The `skilled/v0.0.0.0-probe` ref skips the naming and permission gates (`pre-push:127-130`), so the trace reaches every later gate. Gate 0 runs for every branch (`pre-push:97-102`).

**Distinguishing observation.** For each gate and shape the trace shows the script check result, the filter's match count for the staged `.skilled` edits and the branch taken. "Script found, filter matched nothing" confirms the silent miss phase 001 derived from code. "Script found, filter matched" means the gate still protects that surface. A `beyond a symbolic link` pathspec error swallowed by the hook's `2>/dev/null` is its own outcome, because nothing visible changes. Results that hold under both A and B are gates phase 005 must teach the new root whatever phase 004 picks, and results that differ are a cost of one shape.

**Record.** `probes/gate-filters-under-linked-root.md`, 24 rows with trace excerpts.

### Probe P5: Rename Rehearsal and Mass-Deletion Ceiling (Q5)

**Question.** Does a rename-only commit of 17,767 files keep rename detection and `git log --follow`, and does the pre-push mass-deletion ceiling fire on it (`../001-deep-research/research/research.md:71`, `:166`)? The ceiling defaults to 100 tracked-file deletions (`.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh:17`, `:21-27`), counted by `git diff --name-only --diff-filter=D <base> <tip>` (`mass-deletion-guard.sh:45-47`) and enforced as gate 0 (`.opencode/scripts/git-hooks/pre-push:97-119`). A guard library that fails to load leaves the ceiling unenforced (`pre-push:34-47`).

**Executor.** The orchestrator, because it commits 17,767 renames in a clone.

**Command**, in the full clone. The placeholder goes first, because `git mv` into the existing `.skilled/` nests instead of renaming (`../001-deep-research/research/research.md:73`):

```bash
cd "$P/rehearsal"
git config --show-origin --get-all diff.renames; git config --show-origin --get-all diff.renameLimit
git "${H[@]}" rm --quiet -r .skilled && git "${H[@]}" commit --quiet -m "probe: drop skilled placeholder"
git "${H[@]}" checkout --quiet -b probe-r1 && git "${H[@]}" mv .opencode .skilled && git "${H[@]}" commit --quiet -m "probe: rename only"
git "${H[@]}" checkout --quiet -b probe-r2 probe-r1~1 && git "${H[@]}" mv .opencode .skilled && ln -s .skilled .opencode && git "${H[@]}" add .opencode && git "${H[@]}" commit --quiet -m "probe: rename plus link"
for V in probe-r1 probe-r2; do for L in 1 default 60000; do
  O=(); [ "$L" = default ] || O=(-c diff.renameLimit="$L")
  printf '%s limit=%s renames=%s deletions=%s\n' "$V" "$L" \
    "$(git "${O[@]}" diff --name-status -M "$V~1" "$V" | grep -c '^R')" \
    "$(git "${O[@]}" diff --name-only --diff-filter=D "$V~1" "$V" | wc -l | tr -d ' ')"
done; done
```

The guard verdict comes from the hook's own functions, and the end-to-end run uses the hook as installed today, so both are taken from the base commit:

```bash
git show "$(cat "$P/base-sha")":.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh > "$P/mass-deletion-guard-base.sh"
git show "$(cat "$P/base-sha")":.opencode/scripts/git-hooks/pre-push > "$P/pre-push-base"
for V in probe-r1 probe-r2; do
  bash -c 'source "$1"; n=$(mass_deletion_range_count "$2" "$3"); mass_deletion_verdict "$n"; echo "count=$n verdict=$?"' _ "$P/mass-deletion-guard-base.sh" "$(git rev-parse "$V~1")" "$(git rev-parse "$V")"
  git "${H[@]}" checkout --quiet "$V"
  printf 'refs/heads/skilled/v0.0.0.0-probe %s refs/heads/skilled/v0.0.0.0-probe %s\n' "$(git rev-parse "$V")" "$(git rev-parse "$V~1")" \
    | env -u SYSTEM_HOOKS_DISABLED SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 bash "$P/pre-push-base" origin /nonexistent 2> "$P/logs/$V-pre-push.stderr"; echo "$V pre-push exit=$?"
done
for f in skills/system-spec-kit/SKILL.md scripts/git-hooks/pre-commit agents/markdown.md commands/create/agent.md plugins/opencode-goal.js; do
  printf '%s before=%s follow=%s\n' "$f" \
    "$(git log --oneline "$(cat "$P/base-sha")" -- ".opencode/$f" | wc -l | tr -d ' ')" \
    "$(git log --follow --oneline probe-r1 -- ".skilled/$f" | wc -l | tr -d ' ')"
done
```

The last step checks the rename-plus-link commit out over ignored build output, which is what the main checkout will hold:

```bash
git "${H[@]}" checkout --quiet --detach probe-r2~1
mkdir -p .opencode/node_modules/probe-pkg .opencode/skills/system-spec-kit/runtime/dist
touch .opencode/node_modules/probe-pkg/index.js .opencode/skills/system-spec-kit/runtime/dist/probe.js
git check-ignore -v .opencode/node_modules/probe-pkg/index.js .opencode/skills/system-spec-kit/runtime/dist/probe.js
git "${H[@]}" checkout probe-r2; echo "checkout exit=$?"; ls -ld .opencode; git status --porcelain --ignored -- .opencode | head
```

The pre-push outcome is read from the `BLOCKED [gate:mass-deletion]` line in stderr, not from the exit status alone, because later gates can also exit non-zero.

**Distinguishing observation.** A rename count equal to the moved file count with zero deletions at every limit means one rename-only commit keeps detection and passes the ceiling. More than 100 deletions at the default limit means the ceiling fires on a normal push, so the cutover needs an authorized bypass or a staged series. Follow counts one higher than before mean history survives the rename. The r1 run shows whether the installed hook can find its guard when no link exists, and r2 shows it with shape A's link. A refused or mixed checkout over ignored files means shape A cannot land by a plain checkout in a tree that holds build output.

**Record.** `probes/rename-rehearsal.md`.

### Probe P6: Council Graph Rebuild Command (Q6)

**Question.** Which command rebuilds the tracked `council-graph.sqlite`, and are its stored paths regenerated or copied (`../002-per-runtime-reference-map/research/research.md:173`)?

**Executor.** DeepSeek unit U8 reads the writer. The orchestrator counts path-bearing cells.

**Command.** U8 reads `.opencode/skills/system-deep-loop/runtime/database/README.md`, `runtime/lib/council/council-graph-db.ts`, `runtime/scripts/upsert.cjs`, `runtime/scripts/status.cjs`, `runtime/scripts/query.cjs`, `runtime/scripts/convergence.cjs`, `deep-ai-council/scripts/tests/replay-graph-from-artifacts.vitest.ts` and the playbook scenario `deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md`, all under `.opencode/skills/system-deep-loop/`. The orchestrator works on a copy, because a read-only open of the tracked file failed during planning and SQLite can leave `-wal` and `-shm` files beside a database it opens (`.opencode/skills/system-deep-loop/runtime/database/README.md:29`):

```bash
cp "$WT/.opencode/skills/system-deep-loop/runtime/database/council-graph.sqlite" "$P/council-graph-copy.sqlite"
python3 - "$P/council-graph-copy.sqlite" <<'PY'
import sqlite3, sys
con = sqlite3.connect(f"file:{sys.argv[1]}?immutable=1", uri=True)
for (table,) in con.execute("select name from sqlite_master where type='table'"):
    for col in [row[1] for row in con.execute(f'pragma table_info("{table}")')]:
        hits = con.execute(f'select count(*) from "{table}" where cast("{col}" as text) like ? or cast("{col}" as text) like ?', ("%.opencode%", "%/Users/%")).fetchone()[0]
        if hits:
            print(table, col, hits)
PY
```

**Distinguishing observation.** A named rebuild command whose inputs carry no `.opencode` path means the cutover regenerates the database after the move under any shape. Paths copied from inputs, or no rebuild command at all, mean the stored paths need a migration or the database stays a record that names the old root.

**Record.** `probes/council-graph-rebuild.md`.

### Probe P7: Fixture Path Assertions (Q7)

**Question.** Do tests assert absolute paths beside the 35 recorded fixtures (`../002-per-runtime-reference-map/research/research.md:174`)?

**Executor.** DeepSeek unit U9. No test suite runs, because a run inside a skill leaves caches in the checkout.

**Command.** The orchestrator puts the fixture list into the brief:

```bash
awk -F'\t' 'NR > 1 && $12 ~ /recorded-fixture/ {print $3}' "$WT/specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/research/maps/map-c-references.tsv"
```

The list has 35 paths: 26 under `system-spec-kit`, 4 under `system-deep-loop`, 2 under `.opencode/commands` and one each under `.opencode/bin`, `sk-design` and `system-skill-advisor` (`map-c-references.tsv` rows 62 to 3960). U9 finds the tests that read each fixture and classifies the assertion beside it.

**Distinguishing observation.** A repo-relative `.opencode` literal in an assertion must be rewritten together with its fixture under any shape. An absolute assertion ties to the checkout path rather than the root name, so it survives a root rename and breaks on a checkout move. A fragment assertion survives both. An unread fixture needs no coordinated edit.

**Record.** `probes/fixture-path-assertions.md`, 35 rows.

### Probe P8: Home-Level State (Q8)

**Question.** Which home-level files on this machine name the repository or `.opencode` (`../001-deep-research/research/research.md:167`)? Phase 002 checked 36 fixed paths (`map-b-home.tsv`). Planning found these locations exist and sit outside that list: `~/.cursor`, `~/.devin`, `~/.local/share/devin`, `~/.config/opencode`, `~/.local/share/opencode`, `~/.local/state`, `~/.local/bin`, `~/Library/LaunchAgents`, `~/.bashrc`, `~/.profile` and `~/.npmrc`. The repository ships `.opencode/scripts/launchagents/`, which makes `~/Library/LaunchAgents` a likely consumer.

**Executor.** The orchestrator. Home files can hold credentials, for example `~/.pi/agent/auth.json` (`map-b-home.tsv:18`), and a lane's reads leave the machine through the gateway.

**Command.** A Python pass, recorded verbatim in the record, walks the 36 map-B paths, the locations above, the full `~/.claude`, `~/.codex`, `~/.pi` and `~/.config` trees, `~/.hermes` without its `hermes-agent/` source checkout and `crontab -l`. The patterns are `.opencode`, `Code_Environment/Public` and `worktrees/public`. Per file it prints the path, the link target when that names a pattern, one match count per pattern, and for JSON, TOML, YAML and plist files the key paths whose values contain a pattern. It prints no value. Session and transcript stores under those roots get one aggregate row each, with file count and matching file count.

**Distinguishing observation.** An entry naming `.opencode/<surface>` keeps working under a shape that still resolves that surface and breaks under one that drops it, so the per-surface count weighs shape C against A and B. An entry naming only the checkout path survives every shape.

**Record.** `probes/home-state-enumeration.md`. Its file list seeds the home-state guard.

### Probe P9: Untracked and Ignored Files (Q9)

**Question.** Which untracked or ignored files name `.opencode`, such as `dist` trees, logs and `.state` (`../002-per-runtime-reference-map/research/research.md:176`)? During planning, `git ls-files --others --ignored --exclude-standard --directory -- .opencode` listed 12 entries in worktree 055 and 184 in the main checkout, and neither checkout had an untracked, unignored file under `.opencode/`.

**Executor.** The orchestrator builds the lists. DeepSeek unit U10 classifies them from paths and tracked build sources only, and never opens an ignored file.

**Command.**

```bash
for R in "$WT" "$MAIN"; do
  git -C "$R" ls-files --others --ignored --exclude-standard --directory > "$P/logs/$(basename "$R")-ignored.txt"
  git -C "$R" ls-files --others --exclude-standard > "$P/logs/$(basename "$R")-untracked.txt"
done
```

The orchestrator turns each list into a TSV per checkout: entry, kind, whether it sits under `.opencode/` and a content hit count from `rg -a -c -F .opencode`. `node_modules` totals stay on their own rows.

**Distinguishing observation.** Ignored build output under `.opencode/` either blocks shape A or survives it, as the P5 checkout step shows, and each rebuildable entry needs its build command after the move. Runtime state files that store `.opencode` paths need a writer change or a reset under any shape.

**Record.** `probes/untracked-ignored-files.md`, one table per checkout.

### Delegation

DeepSeek V4.1 Flash runs on cli-pi through the LLM Gateway as `llmgateway/deepseek-v4.1-flash` at `--thinking max` (`.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:113`). Each unit is one dispatch:

```bash
cd "$WT" && AI_SESSION_CHILD=1 pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max \
  --tools read,grep,find,ls "$(cat "$P/briefs/<unit>.md")" > "$P/returns/<unit>.md" 2> "$P/returns/<unit>.stderr"; echo "exit=$?"
```

The cli-pi contract requires `--offline` (`.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:15-17`), a provider-qualified model (`cli-pi/SKILL.md:21`), the tool allowlist as the write boundary (`cli-pi/SKILL.md:165`), an inlined persona (`cli-pi/SKILL.md:216`) and `AI_SESSION_CHILD=1` with the child-dispatch preamble in the prompt (`cli-pi/SKILL.md:217`). The persona is the read-only `context` agent (`.claude/agents/context.md:4`). If the lane's tools cannot read outside its working directory, the orchestrator copies the named files into `$P/sources/<unit>/` with their relative paths intact and dispatches from there.

**Brief shape**, identical for every unit: the child-dispatch preamble, the `context` persona, then four literal lines. They name the question, the files to read, the answer table's columns and the rule "cite `path:line` for every cell and write UNKNOWN when no line settles it". A brief never states an expected answer. Briefs and returns carry kebab-case names such as `u5-pi-loader.md`.

| Unit | Question | Executor | Why this executor | Verification |
|------|----------|----------|-------------------|--------------|
| U1 to U7 | Q1, one runtime each | DeepSeek lane | Reading loader source and captured help is well-specified and read-heavy | The orchestrator opens every `path:line`, strikes misses and confirms each `configurable` cell through the matching P2 run |
| U8 | Q6 writer and rebuild command | DeepSeek lane | Eight named files to read | Every citation opened, and the answer checked against the P6 cell counts |
| U9 | Q7 fixture assertions | DeepSeek lane | 35 fixtures, each a search and a read | Every assertion line opened, and each fixture reported unread re-searched by basename |
| U10 | Q9 classification | DeepSeek lane | Tracing producers through tracked build sources, from paths only | Every producer citation opened |
| Captures and live runs | Q1 captures, Q2, Q3, Q4, Q5 | Orchestrator | They launch runtimes or git, which the phase brief keeps off the lane | Output and exit status read for every command |
| Home scan | Q8 | Orchestrator | Home files can hold credentials, and lane reads leave the machine | The script's output is read for values before it enters the record |
| Lists and counts | Q6 cell count, Q9 lists | Orchestrator | One deterministic command each, cheaper to run than to brief | Output and exit status read |

Every lane-produced record ends with a verification section: the brief verbatim, the dispatch command, the exit status, the stderr tail and one row per returned citation marked matched or struck.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Positive control | Every Q2 row on the baseline clone, and the Q3 failing-hook control | The row's own command |
| Negative control | Each nonce is absent from its clone before its fixture exists, and the Q3 non-executable hook runs beside the dangling ones | `rg -uu -F "$NONCE" <clone>` |
| Citation check | Every `path:line` in a lane-produced record | `sed -n '<line>p' <path>` |
| Safety check | Both checkouts' status and every guarded home file | `git status --porcelain`, `shasum -a 256` |
| Spec validation | This folder | `validate.sh --strict` invoked by its main-checkout path |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 maps and findings | Internal | Green, committed at `728c4f3efc` (`../goal.md:107`) | Q7 and Q8 lose their seed rows |
| The seven runtime CLIs at the §1 versions | External | Green, every CLI answered `--version` on 2026-09-16 | A missing CLI leaves its Q1 and Q2 rows with a recorded reason |
| LLM Gateway credit for DeepSeek V4.1 Flash | External | UNKNOWN until the first dispatch | Units U1 to U10 fall back to the orchestrator, logged as a deviation |
| Runtime authentication with isolated config directories | External | UNKNOWN until T010 | Rows R6 to R11 record a reason instead of a run |
| Free space on the `/tmp` volume | Internal | Green, 444 GiB free on 2026-09-16 | The setup stops before the first clone |
| The main checkout's toolchain | Internal | Green | A worktree toolchain's validation result is not trusted (`.opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md:36`) |

### Risks and Known Traps

| Risk | Evidence | Mitigation |
|------|----------|------------|
| A clone's `origin` is the main repository, so a push from a clone writes real refs | `git clone <path>` records the source as `origin` | `git remote remove origin` right after every clone. Hooks run by feeding stdin, never by pushing |
| Clone commits run the main checkout's hooks | `~/.gitconfig:12` sets `core.hooksPath` to `~/.config/git/hooks`, whose entries link into the main checkout (`map-b-home.tsv:31-37`) | `-c core.hooksPath=$P/empty-hooks` on every clone write that is not the probe itself |
| A fresh clone loses the repository's rename settings | The main repository's `.git/config:18-20` sets `diff.renames = true` and `diff.renameLimit = 60000` | Q5 records the clone's effective config and measures three limits |
| A clone under this folder's `scratch/` would nest 85,159 tracked files inside `specs/`, where spec scanners and the trigger index read | `git ls-files \| wc -l` in worktree 055 on 2026-09-16 | Clones live under `/tmp/skilled-probes-003/` only |
| Fan-out runs write containment snapshots that nest recursively and are never committed | A path under `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/swe2/` in the main checkout nests nine `containment` segments | Units dispatch as one-shot `pi -p`, never as fan-out lineages. A unit moved to the fan-out runner keeps its containment directories out of every commit |
| Lane output filenames outside kebab-case fail CI's naming guard | `.github/workflows/naming-standard-guard.yml:14`, `:45` | Every record, capture, brief and return uses a kebab-case name |
| Iteration records without `iteration` are rejected | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:734` | Applies only to a unit moved to the fan-out runner, whose records then carry `iteration` |
| A convergence threshold above 1 under a convergence stop policy | Default thresholds are 0.05 and 0.1 (`fanout-run.cjs:1530`) | Applies only to fan-out runs, which never pass `--convergence-threshold` above 1 |
| pytest inside a skill leaves `.pytest_cache`, which stales leaf manifests | Phase brief, and five ignored `.pytest_cache` directories under `.opencode/` in the main checkout on 2026-09-16 | No test suite runs in either checkout. Q7 is a read-only scan |
| Validation from a worktree toolchain is meaningless | `large-reorg-playbook.md:36` | `validate.sh` runs by its main-checkout path |
| SQLite can leave `-wal` and `-shm` files beside a database it opens | `runtime/database/README.md:29`, and a read-only open of the tracked file failed during planning | Q6 reads a copy under `/tmp` |
| Live runs load the repository's plugins and hooks, including a process reaper | `.opencode/plugins/README.md:32` | `SYSTEM_HOOKS_DISABLED=1` on every live run (`.opencode/plugins/README.md:20`), with probe-owned fixtures only |
| The kill switch exported for live runs makes `pre-commit` exit 0 before its first gate, which reads as a clean pass | `.opencode/hooks/shared/hook-flags.sh:42-43`, `.opencode/scripts/git-hooks/pre-commit:26` | P4 and P5 hook runs use `env -u SYSTEM_HOOKS_DISABLED` |
| Live runs write trust entries and project registries into home config | UNKNOWN per runtime until T010 | Isolation directories verified first, the hash guard around every run and no automatic restore, because operator sessions write the same files |
| A lane cites a line that does not say what it claims | One model's return is a claim about itself (`repo-rules/delegation-and-orchestration.md:134-146`) | Every citation is opened before it enters a record |
| A CLI auto-updates between planning and probing | Versions in §1 were read on 2026-09-16 | T001 re-reads versions, and T005 re-captures help for any CLI that changed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a post-probe status of either checkout differs from its capture outside `probes/` and this folder's documents, a guarded home file changes or a clone is found with a remote.
- **Procedure**: Stop live runs and record the changed paths or key paths in `probes/probe-environment.md`. Restore a probe-created tracked change in worktree 055 with `git -C "$WT" restore -- <path>` once the change is confirmed as the probe's, and remove probe-created untracked files by name. Report a changed home file to the operator with its key paths instead of restoring it, because live operator sessions write the same files. Probes change nothing else, so removing `/tmp/skilled-probes-003/` completes the rollback.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──┬──► P8 home scan ──► home guard ──────────┐
        ├──► U1-U7 lanes ──► P1 check ─────────────┤
        ├──► shape build ──► P4 gate traces ───────┴──► P2 live runs ──┐
        ├──► P3 dangling hook ─────────────────────────────────────────┤
        ├──► P5 rehearsal ─────────────────────────────────────────────┤
        ├──► U8 lane + P6 cell count ──────────────────────────────────┤
        ├──► U9 lane ──────────────────────────────────────────────────┤
        └──► P9 lists ──► U10 lane ────────────────────────────────────┴──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Every probe |
| P8 home scan and guard | Setup | P2 |
| U1 to U7 and the P1 check | Setup | P2 |
| Shape build and P4 gate traces | Setup | P2, which adds its fixtures to the same shape clones only after P4 commits |
| P2 live runs | P1 check, P8 guard, P4 | Verify |
| P3, P5, P6, P7 and P9 | Setup | Verify |
| Verify | Every record | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Planning estimates, not measurements.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup, captures and home scan | Low | 1.5 hours |
| Lane units U1 to U10 with citation checks | Med | 3 hours |
| Gate traces P4 and live runs P2 | High | 4 hours |
| Git probes P3 and P5 | Med | 2 hours |
| Verification and records | Low | 1.5 hours |
| **Total** | | **12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Both checkouts' status captured under `/tmp/skilled-probes-003/`
- [ ] Home-state guard snapshot taken from the P8 file list
- [ ] `SYSTEM_HOOKS_DISABLED=1` exported in the live-run shell

### Rollback Procedure
1. **Stop**: end the running probe and any runtime process it started.
2. **Checkouts**: compare `git status --porcelain` with the captures and restore only probe-created changes.
3. **Home**: list changed key paths for the operator, with no automatic restore.
4. **Scratch**: remove `/tmp/skilled-probes-003/`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Probes write only to `/tmp/skilled-probes-003/` and `probes/`.
<!-- /ANCHOR:enhanced-rollback -->

---
