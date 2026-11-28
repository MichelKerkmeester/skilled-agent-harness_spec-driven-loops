Draft at d9159aa94ba: 012's opener re-measures after 011.006 and 011.007 merge, writes the real map to `scratch/move-map.md` and deletes this file.

# Draft move map

This is a read-only draft of T003's map, built from `draft-tree-measure.md`. Nothing has moved. It lists every one-file folder outside the fixture case trees, one row per fixture case tree and the crate, CLI and executor audit roots.

`H` is `.skilled/skills/system-skilled-bots` and `K` is `.skilled/crates/bots-tui`. The last column is the number of files `rg -c -F '<old path>' .` lists for the full path with `H` and `K` expanded. It undercounts any reference that code builds from path parts. `runtime/tests/delivery.vitest.ts:74` builds the `M016` stub path from `'fixtures', 'osascript-stub', 'osascript'`, so its full-path count is 0 while `rg -c -F 'osascript-stub' .` lists 2 files. REQ-004's per-row check misses the same kind of reference, so the opener searches for the last path parts as well.

## Rows

| ID | Old path | Verdict | New path | Reason | Files naming it |
|----|----------|---------|----------|--------|-----------------|
| M001 | `H/assets` | keep | | An allowed hub root folder (`parent-skill-check.cjs` DIRECTORY_ALLOWLIST, lines 117 to 121), and `bots-author` names `bot-template.txt` in it | 68 |
| M002 | `H/benchmark` | keep | | An allowed hub root folder. It holds its README plus the `reports/` tree the benchmark layout fixes | 16 |
| M003 | `H/benchmark/reports` | keep | | The benchmark report layout puts each run in its own dated folder under `reports/` | 14 |
| M004 | `H/bots-author/changelog` | keep | | A mode packet's own changelog folder. `mode-registry.json` fixes the packet folder, and all four packets keep a `changelog/` the same way | 3 |
| M005 | `H/bots-author/references` | keep | | `bots-author/ROUTER.md` resolves `references/bot-definition.md` as its default resource | 30 |
| M006 | `H/bots-run/changelog` | keep | | A mode packet's own changelog folder, as M004 | 3 |
| M007 | `H/bots-schedule/changelog` | keep | | A mode packet's own changelog folder, as M004 | 3 |
| M008 | `H/bots-schedule/references` | keep | | The packet's `ROUTER.md` resolves its reference leaf under `references/`, as M005 | 15 |
| M009 | `H/bots-status/changelog` | keep | | A mode packet's own changelog folder, as M004 | 3 |
| M010 | `H/bots-status/references` | keep | | The packet's `ROUTER.md` resolves its reference leaf under `references/`, as M005 | 21 |
| M011 | `H/changelog` | keep | | `parent-skill-check.cjs` HUB_ROOT_FILES names `changelog` as a hub root entry (lines 112 to 115) | 5 |
| M012 | `H/feature-catalog` | keep | | An allowed hub root folder. It holds the root `feature-catalog.md` index plus one folder per category | 33 |
| M013 | `H/feature-catalog/hub-routing` | keep | | A catalog category folder that the root index links (`feature-catalog.md:390`). A one-feature category still keeps its own folder in the catalog layout | 4 |
| M014 | `H/manual-testing-playbook` | keep | | An allowed hub root folder. It holds the root playbook index plus one folder per category | 42 |
| M015 | `H/manual-testing-playbook/channels` | keep | | A playbook category folder that the package validator walks (`validate-playbook-package.cjs:1439`), with the root index naming each category | 5 |
| M016 | `H/runtime/tests/fixtures/osascript-stub/osascript` | move | `H/runtime/tests/fixtures/osascript-stub.sh` | A folder that holds one file. The test passes the stub by absolute path (`delivery.vitest.ts:74`) and the evidence line is a literal in `delivery.ts:256` and `delivery.ts:257`, so the folder name carries nothing. The move keeps the file's mode 100755 | 0 |
| M017 | `H/scripts/fixtures` | keep | | It holds the fixtures README plus one folder per case, and `bot-check.vitest.ts:115` lists the case folders | 53 |
| M018 | `H/shared` | keep | | An allowed hub root folder, reserved for helpers more than one mode packet needs (`shared/README.md`) | 4 |
| M019 | `H/scripts/fixtures/<case>/bots` and `H/scripts/fixtures/<case>/bots/<id>` | keep | | 90 one-file folders. Each case is a small repository that `bot-check.cjs` reads at `<case>/bots/config.json` and `<case>/bots/<id>/BOT.md` (`bot-check.cjs:81` and `bot-check.cjs:164`). Flattening them changes the input shape the check reads | 53 |
| M020 | `H/runtime/tests/fixtures/bots/<id>` | keep | | 15 one-file folders, one `BOT.md` per bot in the shape the runtime loader reads. `runner-support.ts:22` builds the root from path parts | 0 |
| M021 | `K/design` | keep | | The CI design diff guard compares it with the packet's two design folders (`bots-runtime.yml:184` to `bots-runtime.yml:186`). A move or a new file there fails the guard | 21 |
| M022 | `K/tests/fixtures/payloads` | keep | | The CI guard diffs four of its files against the packet's `design/payloads/` (`bots-runtime.yml:187` to `bots-runtime.yml:189`), and `tests/chat/support.rs:32` reads it by folder | 19 |
| M023 | `K/tests/fixtures` | keep | | `tests/pty_smoke.rs:24` and `tests/common/fixture.rs:10` name the `bots` stub in it | 33 |
| M024 | `K/tests/answer_flow` | keep | | Cargo's integration test layout: `tests/answer_flow.rs` loads its modules from `tests/answer_flow/` | 9 |
| M025 | `K/tests/chat` | keep | | Cargo's integration test layout, as M024 | 2 |
| M026 | `K/tests/common` | keep | | The shared test module behind `tests/common/mod.rs`, which five of the seven top-level test files declare with `mod common` | 11 |
| M027 | `K/tests/panes` | keep | | Cargo's integration test layout, as M024 | 8 |
| M028 | `K/src/view` | keep | | A Rust module folder with `view/mod.rs` | 23 |
| M029 | `.skilled/crates` | keep | | The crate's home outside the skill, chosen in decision Q023, because `parent-skill-check.cjs` allows no `crates` folder at a hub root | 102 |
| M030 | `.skilled/bin/bots.cjs` | keep | | The CLI entry every verb, playbook scenario and CI job names | 540 |
| M031 | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | keep | | It sits in the deep-loop runtime's own lib layout. The build edited the file but does not own the folder | 317 |

## Totals

31 rows: 1 move and 30 keep. M016 would take the skill's one-file folder count from 123 to 122. The other 122 rest on keep rows M001 to M015 and M017 to M020.
