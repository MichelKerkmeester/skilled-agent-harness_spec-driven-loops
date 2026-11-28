# Move map
BASE: 1937abca82319d1e985992709464c54300894ca6

This map reads `scratch/tree-baseline.md`, which measured the tree at that commit. No move lands that a row below does not list.

## How the counts were taken

Full-path refs is the number of files this command lists, run from `/Users/michelkerkmeester/worktrees/public/578-openbot-012-folder-architecture`, with the row's old path. For a row with a `<case>` or `<id>` placeholder the command takes the path part before the first placeholder.

```bash
rg -l -F '<old path>' . -g '!specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/**' | wc -l
```

Tail refs is the same count for the old path's last folder name alone, because code can build a path from separate string parts, for example `resolve(dir, 'fixtures', 'osascript-stub', 'osascript')`. For M016 that literal is `osascript-stub`. Tail refs is measured for move rows only and reads n/a on keep rows.

## Rows

| ID | Old path | Verdict | New path | Reason | Full-path refs | Tail refs | Lands in |
|----|----------|---------|----------|--------|----------------|-----------|----------|
| M001 | `.skilled/skills/system-skilled-bots/assets` | keep | | An allowed hub root folder in DIRECTORY_ALLOWLIST (`.skilled/commands/doctor/scripts/parent-skill-check.cjs:119`), and bots-author names `bot-template.txt` in it (`bots-author/SKILL.md:49`) | 68 | n/a | - |
| M002 | `.skilled/skills/system-skilled-bots/benchmark` | keep | | An allowed hub root folder. It holds its README plus the `reports/` tree the benchmark layout fixes (`benchmark/README.md:11`) | 16 | n/a | - |
| M003 | `.skilled/skills/system-skilled-bots/benchmark/reports` | keep | | The benchmark report layout puts each run in its own dated folder under `reports/` (`benchmark/README.md:17`) | 14 | n/a | - |
| M004 | `.skilled/skills/system-skilled-bots/bots-author/changelog` | keep | | parent-skill-check requires every mode packet to carry `SKILL.md`, `README.md` and `changelog/` (`parent-skill-check.cjs:786`), and `mode-registry.json` fixes the packet folder (`mode-registry.json:32`) | 3 | n/a | - |
| M005 | `.skilled/skills/system-skilled-bots/bots-author/references` | keep | | `.skilled/skills/system-skilled-bots/leaf-manifest.json` (`leaf-manifest.json:5`) and `bots-author/ROUTER.md` (`ROUTER.md:55`) resolve `references/bot-definition.md` as the packet's leaf | 30 | n/a | - |
| M006 | `.skilled/skills/system-skilled-bots/bots-run/changelog` | keep | | As M004 | 3 | n/a | - |
| M007 | `.skilled/skills/system-skilled-bots/bots-schedule/changelog` | keep | | As M004 | 3 | n/a | - |
| M008 | `.skilled/skills/system-skilled-bots/bots-schedule/references` | keep | | `leaf-manifest.json` resolves `references/schedule-lifecycle.md` (`leaf-manifest.json:21`), as M005 | 15 | n/a | - |
| M009 | `.skilled/skills/system-skilled-bots/bots-status/changelog` | keep | | As M004 | 3 | n/a | - |
| M010 | `.skilled/skills/system-skilled-bots/bots-status/references` | keep | | `leaf-manifest.json` resolves `references/status-and-inbox.md` (`leaf-manifest.json:28`), as M005 | 21 | n/a | - |
| M011 | `.skilled/skills/system-skilled-bots/changelog` | keep | | HUB_ROOT_FILES names `changelog` as a hub root entry (`parent-skill-check.cjs:113`) | 5 | n/a | - |
| M012 | `.skilled/skills/system-skilled-bots/feature-catalog` | keep | | An allowed hub root folder holding the root `feature-catalog.md` index plus one folder per category | 33 | n/a | - |
| M013 | `.skilled/skills/system-skilled-bots/feature-catalog/hub-routing` | keep | | A catalog category folder the root index links (`feature-catalog/feature-catalog.md:406`). A one-feature category keeps its own folder in the catalog layout | 4 | n/a | - |
| M014 | `.skilled/skills/system-skilled-bots/manual-testing-playbook` | keep | | An allowed hub root folder holding the root playbook index plus one folder per category | 41 | n/a | - |
| M015 | `.skilled/skills/system-skilled-bots/manual-testing-playbook/channels` | keep | | A playbook category the package validator walks (`validate-playbook-package.cjs:1443`), and the root index links BOT-058 at `channels/queue-unknown-not-retried.md` (`manual-testing-playbook.md:948`) | 5 | n/a | - |
| M016 | `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub/osascript` | move | `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub.sh` | A folder that holds one file. The test passes the stub by absolute path built at `runtime/tests/delivery.vitest.ts:74` and the evidence text is a literal in `runtime/lib/delivery.ts:256` and `runtime/lib/delivery.ts:257`, so the folder name carries nothing. The move keeps the file mode 100755. It also rewrites `runtime/tests/fixtures/README.md`, which names the old folder | 0 | 2 | T004 |
| M017 | `.skilled/skills/system-skilled-bots/scripts/fixtures` | keep | | It holds the fixtures README plus one folder per case, and `runtime/tests/bot-check.vitest.ts:115` lists the case folders | 53 | n/a | - |
| M018 | `.skilled/skills/system-skilled-bots/shared` | keep | | An allowed hub root folder, reserved for helpers more than one mode packet needs (`shared/README.md`) | 4 | n/a | - |
| M019 | `.skilled/skills/system-skilled-bots/scripts/fixtures/<case>/bots` and `.skilled/skills/system-skilled-bots/scripts/fixtures/<case>/bots/<id>` | keep | | 89 one-file folders, 34 bots folders and 55 bot folders. Each case is a small repository that `scripts/bot-check.cjs` reads at `<case>/bots/config.json` and `<case>/bots/<id>/BOT.md` (`bot-check.cjs:164` and `bot-check.cjs:81`). Flattening them changes the input shape the check reads | 44 | n/a | - |
| M020 | `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/<id>` | keep | | 15 one-file folders, one `BOT.md` per bot in the shape the runtime loader reads | 0 | n/a | - |
| M021 | `.skilled/crates/bots-tui/design` | keep | | The CI design diff guard compares it with the packet's two design folders (`.github/workflows/bots-runtime.yml`, step "Keep the shipped design copy equal to the packet copies"). A move or a new file there fails the guard. The guard already reports `design/chat-mockups.md` at BASE, see `scratch/gate-baseline.md:206` | 21 | n/a | - |
| M022 | `.skilled/crates/bots-tui/tests/fixtures/payloads` | keep | | The CI guard diffs four of its files against the packet's `design/payloads/` (`.github/workflows/bots-runtime.yml:188`), and `tests/chat/support.rs:32` reads it by folder | 19 | n/a | - |
| M023 | `.skilled/crates/bots-tui/tests/fixtures` | keep | | `tests/pty_smoke.rs:24` and `tests/common/fixture.rs:10` name the bots stub in it | 33 | n/a | - |
| M024 | `.skilled/crates/bots-tui/tests/answer_flow` | keep | | Cargo's integration test layout: `tests/answer_flow.rs` loads its modules from `tests/answer_flow/` | 9 | n/a | - |
| M025 | `.skilled/crates/bots-tui/tests/chat` | keep | | Cargo's integration test layout, as M024 | 2 | n/a | - |
| M026 | `.skilled/crates/bots-tui/tests/common` | keep | | The shared test module behind `tests/common/mod.rs`, which the top-level test files declare with `mod common` | 11 | n/a | - |
| M027 | `.skilled/crates/bots-tui/tests/panes` | keep | | Cargo's integration test layout, as M024 | 8 | n/a | - |
| M028 | `.skilled/crates/bots-tui/src/view` | keep | | A Rust module folder with `view/mod.rs` | 23 | n/a | - |
| M029 | `.skilled/crates` | keep | | The crate's home outside the skill, because parent-skill-check allows no `crates` folder at a hub root and the skill walkers would crawl its build output | 104 | n/a | - |
| M030 | `.skilled/bin/bots.cjs` | keep | | The CLI entry every verb, playbook scenario and CI job names | 543 | n/a | - |
| M031 | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | keep | | It sits in the deep-loop runtime's own lib layout. The build edited the file but does not own the folder | 317 | n/a | - |
| M032 | `.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` | keep | | A fixture case whose root holds `.utcp_config.json`, the file the apps check reads at the case root (`runtime/lib/apps.ts:125` and `runtime/lib/apps.ts:126`). Its one root file is part of the input shape, as M019 | 8 | n/a | - |

## Move groups

- T004 runtime lib and test rows: M016.
- T005 scripts and fixtures: no rows.
- T006 mode packets references and assets: no rows.
- T007 playbook and feature catalog: no rows.
- T008 crate and CLI: no rows.
- T009 deep-loop executor audit: no rows.

## Totals

32 rows: 1 move and 31 keep. M016 takes the skill's one-file folder count from 123 to 122 while the other 122 rest on the keep rows.

## README table

The table holds one row per folder the build created under an in-scope root: the 28 folders `scratch/tree-baseline.md` lists under "Folders the build created". The moves land no new folder, because M016 only removes one. A `readme` row's folder holds a `README.md` written through the sk-doc `sk-create-readme` standard.

| ID | Folder | Verdict | Reason |
|----|--------|---------|--------|
| R001 | .skilled/crates | readme | The crates home outside any skill, which had no README. |
| R002 | .skilled/crates/bots-tui | readme | The crate README, refreshed to say what belongs in the crate folder and what does not. |
| R003 | .skilled/skills/system-skilled-bots/runtime/tests/fixtures/channels | skip | a folder whose parent README already says what it holds: runtime/tests/fixtures/README.md names channels/ and describes its recordings, and the document validator exempts fixture trees. |
| R004 | .skilled/crates/bots-tui/design | skip | the crate's design/ copy the CI diff guard compares: a new file there fails the guard. |
| R005 | .skilled/crates/bots-tui/src | skip | a folder whose parent README already says what it holds: the crate README's KEY FILES section lists every src/ file and src/view/. |
| R006 | .skilled/crates/bots-tui/src/view | skip | Same reason as R005. |
| R007 | .skilled/crates/bots-tui/tests | skip | Same reason as R005, and Cargo's integration test layout puts each target's modules in a folder beside its .rs file. |
| R008 | .skilled/crates/bots-tui/tests/answer_flow | skip | Same reason as R007. |
| R009 | .skilled/crates/bots-tui/tests/chat | skip | Same reason as R007. |
| R010 | .skilled/crates/bots-tui/tests/common | skip | Same reason as R007. |
| R011 | .skilled/crates/bots-tui/tests/fixtures | skip | Same reason as R007. |
| R012 | .skilled/crates/bots-tui/tests/fixtures/payloads | skip | Same reason as R007, and the CI guard diffs four of its files. |
| R013 | .skilled/crates/bots-tui/tests/panes | skip | Same reason as R007. |
| R014 | .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R015 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R016 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R017 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-cron-not-first | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R018 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-empty | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R019 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R020 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple-cron | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R021 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-tell-with-targets | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R022 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-trigger-conflict | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R023 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-check-without-outcome | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R024 | .skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-shell-metacharacters | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R025 | .skilled/skills/system-skilled-bots/scripts/fixtures/skills-clean | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R026 | .skilled/skills/system-skilled-bots/scripts/fixtures/skills-over-budget | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R027 | .skilled/skills/system-skilled-bots/scripts/fixtures/skills-too-large | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |
| R028 | .skilled/skills/system-skilled-bots/scripts/fixtures/skills-unknown | skip | a fixture case folder: scripts/fixtures/README.md describes the cases and bot-check.vitest.ts reads each one as a small repository. |

Two rows read readme and 26 read skip.
