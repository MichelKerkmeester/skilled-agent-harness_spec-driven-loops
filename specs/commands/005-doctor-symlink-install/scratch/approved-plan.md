# Plan: `/doctor:symlink` + `/doctor:install`

## Context

People who use Skilled in their own project repos link the framework in by hand today, and two shapes have grown up side by side:
- **Obsidian Plugin** links whole folders at its root (`.claude`, `.codex`, `.cursor`, `.devin`, `.hermes`, `.opencode`, `.pi`, `.skilled` → `Skilled/<name>`), plus `AGENTS.md`/`CLAUDE.md` → `Skilled/AGENTS.md`. Its `.gitignore` says absolute links must never be committed.
- **AI Systems** keeps real `.claude`/`.skilled`/… folders and links each entry inside them (312 links), so its local commands, specs and `AGENTS.md` sit beside the links. This is the shape `_link_shared_split` in `.skilled/bin/worktree-session.sh:380-422` builds.

No script made either set. The exploration found 10 broken links in AI Systems and 1 in Obsidian Plugin (`.pi-subagents`), all pointing at Skilled paths that no longer exist. No doctor command checks any of this.

The goal is a `/doctor:symlink` command that checks, links and unlinks the framework in a user's repo in either shape. A `/doctor:install` command then guides a new user through the whole setup the way `/doctor:helper` routes problems. Both get wired into the helper, the setup list, the advisor and the root README.

Decisions already made: new phased packet; auto-pick the link shape; a git worktree; split lanes (GPT-6 Luna on code, DeepSeek on docs).

## Spec + workspace

- Packet: `specs/commands/005-doctor-symlink-install/` (phased): `001-symlink-engine-and-command`, `002-install-guide-router`, `003-integration-and-docs`. Scaffold it with system-spec-kit templates and pick the level with `recommend-level.sh`.
- Workspace: an sk-git numbered worktree, made through sk-git's own command and never with raw git branch primitives. Main's uncommitted sk-vision deletions stay untouched.
- Rules to load before the first write: `REPO RULES.md` trigger rows (Gate 5), and `sk-code` for code and `sk-doc` for the non-spec `.md` (Gate 2 artifact trigger).

## Phase 001: symlink engine + `/doctor:symlink`

New files in `.skilled/commands/doctor/`:
- `scripts/symlink-engine.cjs` has the subcommands `check | plan | apply | unlink`.
  - **Source root:** the real path of the Skilled checkout, resolved from the script's own `realpath`. `--source <dir>` overrides it.
  - **Target:** `--root <dir>`, which must be an existing dir. It is refused when it equals or sits inside the source.
  - **`--runtimes claude,opencode,codex,cursor,devin,pi,hermes`:** `.skilled` is always in the set. With no list, the engine detects the runtimes already present in the target, and an empty detection is reported back so the workflow asks.
  - **`--mode auto|whole|merge`:**
    - `auto` makes a whole-folder link where the name is absent or already links to the source. Where a real folder exists, it merges.
    - `merge` makes a real dir with one absolute link per entry. It never overwrites a local file and reports name conflicts. It prunes only broken links whose text points into the source root.
    - `whole` refuses a real folder.
  - **Opt-in extras:** `--include repo-rules,github,utcp,env`. `env` prints a secrets warning.
  - **Instruction files:** `--link-instructions` makes the Obsidian-style `AGENTS.md`/`CLAUDE.md` links. By default it hands off to `/doctor:agents-md embed`.
  - **Ignore entries** go to `.git/info/exclude` by default, the practice both repos already follow, because committed absolute links leak the local path. `--ignore gitignore|none` overrides that. `check` warns on tracked absolute symlinks.
  - **`check`** is read-only. It reports each entry as linked-whole, linked-merge, missing, broken, foreign-link, local-conflict or tracked-absolute, and supports `--json`.
  - **Plan/apply** copies the digest gate from `agents-md-embed.cjs`: `plan` prints the actions and a digest, and `apply --plan-digest` recomposes, refuses a digest that has drifted, and writes a run record to `.skilled/output/doctor-symlink/<timestamp>/manifest.json`, the same convention as `doctor-agents-md`. Before reusing the digest and backup helpers, check whether `scripts/lib/` already has them.
  - **`unlink --run <dir> [--dry-run|--yes]`** removes only the links the record lists, plus the dirs that run created that are now empty.
- `assets/symlink-manifest.json` maps each runtime to its entries. Claude, for example, gets `.claude` plus the relative link `.mcp.json` → `.claude/mcp.json`, and Pi gets `.pi` (no `.pi-subagents`, which does not exist in Skilled).
- The router is `symlink.md`, tagged `<!-- skill_agent: system-spec-kit -->`. It is modelled on `agents-md.md`, with targets `check` (default, read-only), `link` (mutates) and `unlink` (mutates).
- The assets are `assets/doctor-symlink-{check,link,unlink}.yaml` and `assets/doctor-symlink-presentation.txt`.
- The tests are `scripts/tests/symlink-engine.test.cjs`. They build temp source and target trees and cover:
  - whole and merge modes
  - a local-conflict refusal
  - pruning broken links into the source, while a foreign link is kept
  - a digest-drift refusal
  - the unlink round-trip
  - a refusal when the target is inside the source

## Phase 002: `/doctor:install` guided router

- The router is `install.md`, built on `helper.md`'s contract. It is **read-only** and never runs a writing target. A writing step is printed for the operator to run.
- The workflow `assets/doctor-install.yaml` has five steps:
  1. Locate the Skilled checkout and check that the spec-kit and advisor builds exist, reusing the `/doctor:setup` script invocations.
  2. Ask one consolidated prompt: target repo path, runtimes, link shape, and the instruction file (link or embed).
  3. Run `symlink-engine.cjs check --root <dir>` in place.
  4. Print the ordered writing checklist: `/doctor:symlink link --root … --runtimes …`, then `/doctor:agents-md embed --root …` (unless the instruction files get linked), `/doctor:mcp install`, `/doctor:git setup`, and finally `/doctor:setup` run from inside the target repo.
  5. Warn that context saves from a linked repo hit the open project-root defect tracked in `specs/system-speckit/037-symlinked-runtime-root` (status Planned) until that packet ships.
- The flags are `--json`, `--root <dir>`, `--runtimes <list>`, plus `list|?|menu`. The presentation is `assets/doctor-install-presentation.txt`.
- The trigger phrases must stay separate from `/doctor:mcp install`, for example "install skilled into my project" and "set up skilled in another repo" rather than "install code mode".

## Phase 003: integration (the `_routes.yaml` recipe, lines 51-56)

1. `_routes.yaml`: add 3 symlink routes and 1 install route, each with `trigger_phrases` of 3+ words, and update the header list and the "14" count to 16.
2. `assets/doctor-setup-presentation.txt` §2: add two target rows. `doctor-helper-contract.test.cjs` fails without them.
3. `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`: add entries to both the `typescript` and `python` lists. Then rerun `derive-command-bridges.cjs`, which regenerates `projection.ts`, `skill_advisor.py` and `render.ts`.
4. Add helper fixtures to `scripts/tests/fixtures/doctor-helper/tune.jsonl` and `heldout.jsonl`.
5. Command index `.skilled/commands/README.txt`: update the family row, the "Fourteen" line and the doctor table.
6. Root `README.md`:
   - a new `### Use It In Your Own Project` subsection after "Check The Setup" (~line 183) that starts with `/doctor:install`
   - a mention in "Keep It Healthy" (line 213)
   - the "Fourteen" count → Sixteen (line 1220), 2 table rows (1224-1237) and 2 per-command entries (1239-1317)
7. The spec-kit doctor feature catalog (`feature-catalog/doctor-commands/category-overview.md`), and new playbook scenarios in `manual-testing-playbook/doctor-commands/`.
8. The owner READMEs: `system-spec-kit/README.md:553` and `system-skill-advisor/README.md:101-103`. Also the advisor's `doctor-command-routing.md`.
9. Mirrors: rerun `sync-runtime-mirrors.cjs` and the pi, codex and hermes `sync-prompts*.cjs` generators. Never hand-edit a mirror.

## Swarm execution

- **Code lane, GPT-6 Luna `xhigh` fast:** `codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<brief>" </dev/null`.
  - It covers the engine, manifest JSON, tests, YAML workflows, scoring-compat JSON and fixtures.
  - Up to 6 run in parallel, each on files no other leaf touches.
  - It uses the GPT provider only. If the quota runs out, stop and ask; never re-route.
- **Docs lane, DeepSeek V4.1 Flash 1017:** `pi -p --offline --provider llmgateway --model deepseek-v4.1-flash-1017 … </dev/null` with `PI_BLACKHOLE_PASSIVE=true`.
  - It covers the routers, presentation texts, README.txt, the root README, feature catalog, playbook and owner READMEs.
- **Every brief** gets `AI_SESSION_CHILD=1`, the child-dispatch preamble, an inlined persona (`code` or `markdown`), and **one change per brief**: file, edit and proving check. The rules are in cli-pi's ALWAYS #12 and the operator's brief feedback.
- **Ordering:**
  - Wave 1, in parallel: the engine plus the manifest, the engine tests, and the phase-001 YAMLs.
  - Wave 2: the symlink router and presentation, plus the install YAML.
  - Wave 3: integration steps 1-4, which run in series because the deriver depends on the routes.
  - Wave 4: the docs, in parallel.
- **I verify every diff** before the next dependent brief and run the checks myself. The codex sandbox can't run `tsx` checks (EPERM).

## Verification

- `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` and the existing doctor tests directory.
- `bash .skilled/commands/doctor/scripts/route-validate.sh`, `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`, and `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`.
- The advisor vitest suite (`doctor-command-bridges`, `doctor-ordering`, `doctor-bridge-isolation`) and `python/test_skill_advisor.py`.
- `sync-runtime-mirrors.cjs --check` and each prompt generator with `--check`.
- **Live dry runs**, with no writes to the user's repos:
  - `symlink-engine.cjs check --root "…/Obsidian Plugin"` should report whole links plus the broken `.pi-subagents`.
  - `check --root "…/AI Systems"` should report merge links plus the 10 broken ones.
  - `plan` against a scratch copy in the scratchpad.
- The advisor prompt "symlink skilled into my project" should surface `/doctor:install` or `/doctor:symlink`, not `/doctor:mcp install`.
- `validate.sh <each phase> --strict` should print `RESULT: PASSED`, followed by a check of the tasks and acceptance-criteria evidence.

## Out of scope (noted, not folded in)

- Fixing the 11 broken links in AI Systems and Obsidian Plugin. Once this ships, `/doctor:symlink link` repairs them under the user's yes.
- `relink-local-specs.sh`'s stale `barter` and `ai-systems` targets.
- The project-root defect in packet 051. The install guide only warns about it.
