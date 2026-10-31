# Verification evidence

The orchestrator ran every command below in the worktree on 2026-10-31 and read both the output and the exit status.

## Phase 001: engine and /doctor:symlink

- `node --check .skilled/commands/doctor/scripts/symlink-engine.cjs`: exit 0
- `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs`: 9 tests, 9 pass, 0 fail. The cases are:
  - whole auto
  - merge keeps the local statusline
  - local conflict byte-identical
  - broken source link replaced, outside link left
  - whole refuses a real folder
  - wrong digest exits 3
  - unlink dry-run and yes round-trip
  - root inside source exits 2
  - git exclude add and remove
- **Fixes the orchestrator made after the build lane, and recorded in the engine contract:**
  - The source-pointing test now canonicalizes the link's deepest existing ancestor and compares on a path-segment boundary. The bare string prefix missed macOS `/var` vs `/private/var` and matched sibling folders.
  - The git `spawnSync` gets `maxBuffer` 256 MB. Obsidian Plugin's 2.9 MB `ls-files` output overflowed the 1 MB default and failed `check`.
  - `.DS_Store`, `.skilled/output` and `.claude/worktrees` are never mirrored.
- **Read-only live check, Obsidian Plugin**, with `--runtimes` set to all seven and `--link-instructions`:
  - every runtime folder, `.skilled`, `AGENTS.md` and `CLAUDE.md` reported `linked-whole`
  - `.mcp.json` reported `missing`
  - `REPO RULES.md` reported `local`
  - exit 0
- **Read-only live check, AI Systems:**
  - `.skilled`, `.claude`, `.codex`, `.cursor`, `.pi` and `.hermes` reported `partial-merge`. The check named the missing new doctor prompts and the broken `vision.md`, `goal-opencode.md`, `plugins` and `scheduled_tasks.lock` links.
  - `.opencode` and `.devin` reported `linked-merge` with local conflicts.
  - `repo-rules` and `.github` reported `linked-whole`.
  - exit 0
- **Scratch round trip.** The scratch git repo held a real `.claude/statusline.sh`. `plan` printed a digest, then `apply --plan-digest`:
  - `.skilled` `linked-whole`
  - `.claude` `linked-merge`
  - `.mcp.json` `linked-whole`
  - `.opencode` `linked-whole`
  - the exclude lines were added

  `unlink --run <dir> --yes` then restored the repo to exactly `.claude/statusline.sh` with the original exclude file. The scratch run record was deleted afterwards.
- `bash .skilled/commands/doctor/scripts/route-validate.sh`: `OK: route-validate — 28 routes validated, 10 warnings`. The warnings are informational: shared flags across targets.

## Phase 002: /doctor:install

- `install.md`, `assets/doctor-install.yaml` and `assets/doctor-install-presentation.txt` exist. The YAML parses with exit 0.
- The route is `/doctor:install` with target `guide`, `mutating: read-only`. `route-validate` J1 parity passes across 13 commands.
- **Orchestrator corrections:**
  - The YAML build check now uses `test -d .skilled/skills/system-spec-kit/runtime/dist`, matching the presentation. It used to be a trigger-index staleness check, which is not a build check.
  - The presentation's `merge` and `/doctor:git setup` wording now matches what those commands do.

## Phase 003: integration and docs

- **Advisor bridges:** `derive-command-bridges.cjs` exit 0. Four entries were added to the typescript and python lists in `scoring-compatibility.json`, and the advisor runtime was rebuilt.
- `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`: `STATUS=OK phrases=184 bridges=32`. Every new symlink and install phrase reaches its own bridge.
  - The link phrase "link skilled runtime folders into a repo" collided with check, and was replaced with "create the skilled links in a repo".
- **Advisor picks:**
  - "symlink skilled into my project" → `command-doctor-symlink-link`
  - "install skilled into my project" → `command-doctor-install`
  - "find broken skilled symlinks" → `command-doctor-symlink-check`
- `bash .skilled/commands/doctor/scripts/tests/run-all.sh`: 7 suites passed, 0 failed, 934 node tests passing. The baseline on main was 925 passing, 0 failing; the delta is the 9 new engine tests.
- **Advisor doctor vitest files** (`doctor-command-bridges`, `doctor-brief-render`, `doctor-ordering`, `doctor-bridge-isolation`): 97/97 on main and 97/97 in the worktree. The `test_skill_advisor.py` suite has 8/8 on both.
- **Mirrors:**
  - `sync-runtime-mirrors.cjs --check`: `PASS: 211 mirrors across 9 trees are in sync`
  - the pi, codex and hermes prompt generators with `--check`: `PASS: 43 prompts are in sync` each
- `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`: `STATUS=OK`. Before the index edits it failed on the two missing commands and the 14 count.
- **Docs edited:**
  - root `README.md`: the Use It In Your Own Project subsection, Keep It Healthy, "Sixteen commands", 2 table rows and 2 entries
  - `.skilled/commands/README.txt`
  - the spec-kit feature catalog `category-overview.md`
  - the spec-kit `README.md` doctor table, now seven
  - the advisor `doctor-command-routing.md`
  - playbook DOC-398 `doctor-symlink.md` and DOC-399 `doctor-install.md`, plus the folder index and `manual-testing-playbook.md` rows
- **Helper fixtures:** three tune rows were added. The held-out fixture is hash-pinned, so it was left unchanged.

## Addendum: acceptance probes the orchestrator ran after the closeout lanes

These were run in bash on throwaway scratch repos, and each repo was removed afterwards. One was a git repo with a real `.claude/local.sh` and a committed absolute link `tracked-abs -> /abs/elsewhere`. Another was a non-git folder.

- **check text and JSON.** Text mode printed one status line per entry. `--json` printed one object with the keys `command,root,source,entries,detected_runtimes,tracked_absolute_links,git,warnings`. `tracked_absolute_links` was `[{"path":"tracked-abs","link_text":"/abs/elsewhere"}]` and `git` was `true`. The root listing afterwards was unchanged: `.claude .git tracked-abs`.
- **Text-mode warning.** It printed `tracked absolute link: tracked-abs -> /abs/elsewhere`.
- **Non-git root.** `--json` reported `git: false` and every entry's `ignored` was `null`.
- **Detection.** With no `--runtimes`:
  - the empty non-git root reported `detected_runtimes: []` and listed only `.skilled`
  - the git root with a real `.claude` reported `["claude"]`
  - `--runtimes core` exited 2 with `ERROR: unknown runtime: core`
- **plan twice.** With the same flags, plus `--include github,env --link-instructions`, plan ran twice. Both runs exited 0, the outputs were byte-identical, and both printed `PLAN DIGEST: ebd51114…`. The root listing was unchanged.
- **Extras in that plan:**
  - `link .mcp.json -> .claude/mcp.json` (the relative text)
  - `link AGENTS.md`, `link CLAUDE.md`, and `link REPO RULES.md` to the checkout
  - `.github` planned as `mkdir .github` plus one `link .github/<child>` per entry (merge, never whole)
  - `warning: .env: links the Skilled checkout's .env, so every tool started in this repository reads its secrets`
- **Ignore override.**
  - `--ignore none` printed `warning: ignore lines skipped because --ignore none was selected` and no `ignore-add`.
  - `--ignore gitignore` printed `ignore-add .gitignore: /.claude, /.mcp.json, /.skilled`.
- **Bad invocations.** Each exited 2 with exactly one stderr line:
  - `--bogus` → `ERROR: unknown flag: --bogus`
  - a missing root → `ERROR: root is missing or is not a directory`
  - `--mode diagonal` → `ERROR: unknown mode: diagonal`
  - `--runtimes vim` → `ERROR: unknown runtime: vim`
  - a root inside the source → `ERROR: root and source must not contain one another`
  - a second positional → `ERROR: unexpected positional argument: extra`
  - apply with no digest → `ERROR: --plan-digest is required for apply`
  - `--root` with no value → `ERROR: --root needs a value`
- **Unlink with no flag.** It exited 2 with `pass --yes to perform this unlink`.
- **Changed path skipped.** After apply, `CLAUDE.md` was replaced with a real file. `unlink --yes` exited 0, printed `changed since apply: CLAUDE.md` and left the real file in place.
- **Two engine defects the probes found, both fixed:**
  - `--include github` on a root without `.github` failed with `cannot read target directory …/.github: ENOENT`. An absent merge-only folder is now read as empty.
  - unlink judged a folder the run created as empty before removing the links inside it, so it left that folder behind. Emptiness now counts the links the same unlink removes.

  After both fixes, the round trip with `--include github --link-instructions` printed `remove empty directory .github`, exited 0 with no changed paths, and restored the listing and the exclude file exactly.
- **Regression test** `a merge-only folder the root lacks is created, filled and removed again by unlink` was added. `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` now runs 10 tests: 10 pass, 0 fail.
- **Router bindings.** `symlink.md:6` holds `<!-- skill_agent: system-spec-kit -->`. Lines 49-51 bind `check`, `link` and `unlink` to `doctor-symlink-check.yaml`, `-link.yaml` and `-unlink.yaml`, and line 68 loads `doctor-symlink-presentation.txt`. `route-validate` G3 passes, and that check requires `default_target` to be read-only and unique, so a bare `/doctor:symlink` reaches only `check`.
- **Route count.** The phase expected 24 routes, but the manifest holds 28. The 4 extra are exactly the routes this packet added: symlink check, link and unlink, and install guide.
- **Worktree target, where `.git` is a file.** `plan` resolved the ignore file through the git common dir (`ignore-add ../main/.git/info/exclude: /.claude, /.mcp.json, /.skilled`). `apply` exited 0 and the lines landed in the main repository's `info/exclude`. `unlink --yes` exited 0 and left only `.git`.
- **Quality gate.** `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files` on the engine and its test returned `"gate": "NO_BLOCKER_FOUND"` with exit 0.
- **Comment hygiene.** `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` on the same two files exited 0.
- **Manifest consumers.** `rg -ln 'symlink-manifest.json' .skilled` names the engine, its test, the three symlink workflows, the router and the playbook scenario. Every one is a file this packet added.
- **Live checks and broken links outside the manifest.** `check` reports only manifest entries. Obsidian Plugin's broken `.pi-subagents` link is therefore not reported, because `.pi-subagents` does not exist in the checkout and is not a framework entry. In AI Systems, check reports every broken link that sits inside a framework folder.

## Phase 004: command contract and README

Scope, from the operator's second request: align `/doctor:symlink` and `/doctor:install` with sk-create-command, give the root README a dedicated setup section built on these two commands, and update the separate DOCTOR commands section.

What changed:
- `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, edited as text so the diff stays small:
  - the doctor family's router_path, argument_hint and selector text name both new commands
  - four execution_targets were added (symlink check, link and unlink, and install guide)
  - the coverage sentence now reads "37 of the 41 shipped commands"
  - owned_assets gained eight entries: the symlink presentation, three symlink YAMLs, the manifest and the engine, plus the install presentation and YAML
  - four loader_requirements, two destructive_policy operations (link, unlink) and two invocation_aliases were added
- The argument-hint of `symlink.md` was shortened to 128 characters, under the 140-character soft budget, and `<csv>` became `<list>`. The argument-hint of `install.md` is 56 characters.
- Root `README.md`:
  - Quick Start (line 187) points to the new top-level section `## 5. 🔗 USE IT IN YOUR OWN PROJECT` (line 221). Its subsections are Run The Guide, The Steps It Prints (a table), What Gets Linked, Plan/Yes/Undo, and Keep Linked Projects Healthy.
  - Later sections are renumbered 6–17, and the internal anchors were updated, for example `#7--deep-loop` and `#13--code-mode-mcp`.
  - "Keep It Healthy" (line 217) names both commands.
  - The DOCTOR section says "Sixteen commands" (line 1292), and its table has the rows `/doctor:install` (line 1298) and `/doctor:symlink` (line 1299) after `/doctor:setup`, plus one entry per command.
  - A DeepSeek draft claimed that `/doctor:install` links. The orchestrator corrected it to say that the command only guides.

Verification, rerun from the final state on 2026-10-31:
- `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type command .skilled/commands/doctor/symlink.md` → `Total issues: 0`. The same command on `install.md` → `Total issues: 0`.
- `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type readme README.md` → `Total issues: 0`.
- `check_authored_name_kebab.py` on each router → `PASS: authored artifact name is kebab-case`, exit 0.
- `python3 -c "import json; json.load(open(...command-contract.json))"` → parses. The file has 16 lines that name the new commands or their assets.
- `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` → `routers=41 clean=41 path-drift=0 shape-drift=0`, exit 0.
- `bash .skilled/commands/doctor/scripts/tests/run-all.sh` → `7 suite(s) passed, 0 failed`, with node:test totals `pass 991`, `fail 0`, exit 0. This includes `doctor-install-contract.test.cjs` (16/16), which reads the command contract's invocation_aliases and loader_requirements, and `doctor-symlink-contract.test.cjs` (34/34).
- `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` → `STATUS=OK`, exit 0.

## Phase 005: central doctor playbook

Scope, from the operator's second request and the two follow-up answers: one top-level manual testing playbook at `.skilled/manual-testing-playbook/` covering every doctor command. Move the doctor-command scenarios out of the skill playbooks and into it. Feature catalogs stay in their skills, and their links are re-pointed.

What changed:
- `.skilled/manual-testing-playbook/manual-testing-playbook.md` (the root) and `doctor-commands/README.md` hold the merged environment guide for the six old category READMEs. The old READMEs are archived under `005-central-doctor-playbook/scratch/old-doctor-readmes/`.
- 57 scenarios were moved with `git mv` from system-spec-kit (21), system-skill-advisor (14), sk-git (7), sk-code (6), mcp-code-mode (5) and system-deep-loop (4):
  - 314 links were rewritten inside the moved files, with 0 left unresolved, and links in 7 other files were rewritten
  - two ID collisions were renumbered: DOC-393 became DOC-400 (`doctor-helper-read-only-pick.md`) and DOC-394 became DOC-401 (`doctor-helper-writing-handoff.md`)
- Four new scenarios cover commands that had none: DOC-402 `doctor-sk-skill-check.md`, DOC-403 `doctor-sk-skill-convert.md`, DOC-404 `doctor-agents-md-check.md` and DOC-405 `doctor-agents-md-embed-restore.md`. `doctor-install.md` and `doctor-symlink.md` came from phase 003.
- The six skill indexes dropped their doctor rows and their counts now match:
  - system-skill-advisor: 48 scenarios across 9 categories
  - sk-code: 17/8/25
  - mcp-code-mode: 27/8
  - sk-git: 9 categories became 8
  - system-spec-kit: 11 listed categories became 10
  - each index links to the central package
- Feature-catalog links in sk-code-quality, sk-code-ci, the sk-git catalog and the system-spec-kit catalog were re-pointed to the central scenarios. The catalogs themselves stay in their skills.
- `validate-playbook-package.cjs` discovers `.skilled/manual-testing-playbook`, the fail-closed allowlist names it, and a discovery test was added.
- Dependent fixtures were regenerated:
  - leaf-manifests and leaf-aliases (mcp-code-mode, sk-git, system-skill-advisor)
  - the advisor's `manual-testing-playbook.vitest.ts` expectations (48/9)
  - the spec-kit `workflow-invariance` and `playbook-provenance-paths` tests, the latter now walking the central package too
  - the sk-doc code-folder fixtures and the trigger index
- **Corrections the orchestrator made at closeout:**
  - Nine central files had no `Provenance:` line, so `playbook-provenance-paths` failed. These were the seven moved advisor routing and setup scenarios, the category README and the root. Each now carries one `Provenance: manual only - …` line.
  - DOC-391 still said the setup target table had 19 rows. Main already had 23, and with the two new rows it has 25, so DOC-391 now says 25.
  - The advisor index line 133 still said "all 62 scenario files", which failed `manual-testing-playbook.vitest.ts`. It now says 48.
  - The D1 lane had rewritten a path inside the released changelog `.skilled/skills/sk-code/changelog/v3.9.23.0.md`. That edit was reverted, because a released changelog records history.

Verification, rerun from the final state on 2026-10-31:
- `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` → `PASS package=.skilled/manual-testing-playbook tier=FAIL_CLOSED scenarios=61 categories=1 operator=61 routing_gold_excluded=0 violations=0 warnings=12`, exit 0. The 12 warnings are `BACKTICK_PATH_UNRESOLVED` on example paths the scenarios carried before the move.
- Fleet run with no arguments: exit 0, with 52 PASS and 4 SKIP. Diffed against main's fleet verdicts, the only difference is the new line `PASS package=.skilled/manual-testing-playbook`.
- Duplicate `DOC-` IDs among the 61 central scenarios: 0.
- `ls -d .skilled/skills/*/manual-testing-playbook/doctor-commands` → no matches, so no skill keeps a doctor-commands folder.
- Coverage: every one of the 16 doctor commands is named by at least one central scenario: setup 5, helper 2, env 6, update 8, git 14, sk-code 4, ci 4, sk-skill 2, agents-md 5, speckit 4, runtime-mirrors 3, skill-advisor 8, deep-loop 5, mcp 6, install 1, symlink 2.
- `npx vitest run --config ../../vitest.config.ts --project cli tests/workflow-invariance.vitest.ts tests/playbook-provenance-paths.vitest.ts` (from `system-spec-kit/runtime/cli`) → 2 files, 5 tests passed.
- `npx vitest run tests/manual-testing-playbook.vitest.ts tests/scorer/native-scorer.vitest.ts` (advisor runtime) → 2 files, 23 tests passed.
- `python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` → `pass=89, fail=0`.
- `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` → `stale documents: 0`, exit 0.
- Mirrors: `sync-runtime-mirrors.cjs --check` reports `211 mirrors across 9 trees are in sync`. The codex, pi and hermes prompt syncs each report `43 prompts are in sync`. `derive-command-bridges.cjs --check` reports `"status": "fresh"`.
- `route-validate.sh` → `OK: 28 routes validated, 10 warnings`. Main has 24 routes and 5 warnings. The 5 new warnings are the informational H1 shared-flag kind on `/doctor:symlink`, the same kind `/doctor:agents-md` already raises.
- `doctor-phrase-reach.cjs` → `STATUS=OK phrases=184 bridges=32`.
