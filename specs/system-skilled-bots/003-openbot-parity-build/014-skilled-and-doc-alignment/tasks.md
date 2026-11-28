---
title: "Tasks: Phase 14: skilled-and-doc-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skilled and doc alignment tasks"
  - "local-skilled-alignment tasks"
  - "local-doc-alignment tasks"
  - "alignment wave tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: skilled-and-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Five shell variables this list uses: `SK` is `.skilled/skills/system-skilled-bots`, `RT` is `$SK/runtime`, `BOTS` is `node .skilled/bin/bots.cjs`, `STATE` is `${XDG_STATE_HOME:-$HOME/.local/state}`, `SA` is `$STATE/local-skilled-alignment/system-skilled-bots` and `DA` is `$STATE/local-doc-alignment/system-skilled-bots`.

Both commands write outside the checkout, so no task needs a temporary state root: the run folders under `$SA` and `$DA` are the only writes either command makes, and neither stages, commits or pushes [SOURCE: .skilled/commands/local-skilled-alignment.md:15] [SOURCE: .skilled/commands/local-doc-alignment.md:17]. A run folder is named by its UTC timestamp, so `ls -d "$SA"/*/ | tail -1` is the newest run and `RUN` below always means that folder.

The fallback ladder every dispatched wave walks is the parent's: `cli-mistral-vibe` (skipped when `VIBE_SESSION=1` is set, left on a `429` or `402`) → `cli-pi` → `cli-opencode` → `cli-devin` (probed first) → `cli-codex` at `gpt-6-luna` `xhigh` `fast`. The two lane waves walk the commands' `--lanes` presets instead, as their own lines say. `plan.md` §8 owns the roster, the effort policy and the guards. Each wave below names only its entry point and the order it falls through.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T024 Confirm phases 001 to 013 are committed and the working tree is clean before any run scopes a change set (`spec.md`). Verify: `git status --porcelain` prints nothing, and `git log --oneline -1` prints one commit. A dirty tree would put an uncommitted edit into the scope the skilled-alignment run reads and into the diff T023 checks
- [ ] T000 Read the design artifacts this phase ships (`design/records.md`, `design/state-machines.md`, `design/sequences.md`, `design/refusals.md`, `design/mockups.md`, `design/fixtures/README.md`, `evidence/README.md`). Verify: `ls design/records.md design/state-machines.md design/sequences.md design/refusals.md design/mockups.md design/fixtures/README.md evidence/README.md` exits 0 and `rg -c '^## [0-9]+\.' design/records.md` prints `13`
- [ ] T001 Record the skilled-alignment contract (`.skilled/commands/local-skilled-alignment.md`). Verify: `rg -n 'report-only unless|Merge everything with' .skilled/commands/local-skilled-alignment.md` prints two lines
- [ ] T002 Record the doc-alignment contract (`.skilled/commands/local-doc-alignment.md`). Verify: `rg -n 'A new topic is one entry|checks the docs as they stand' .skilled/commands/local-doc-alignment.md` prints two lines
- [ ] T003 Record the topic shape and the ten existing topics (`.skilled/commands/assets/local-doc-alignment/topics.json`). Verify: `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');console.log(Object.keys(t.topics).length)"` prints `10`
- [ ] T004 Record the lane presets and their models (`.skilled/commands/assets/local-skilled-alignment/executors.json`). Verify: `rg -c '"(native|opencode-go|codex|deepseek|deepseek-high|vibe-deepseek|devin)": \{' .skilled/commands/assets/local-skilled-alignment/executors.json` prints `7`
- [ ] T005 Record the surfaces a `.skilled` scope fires (`.skilled/commands/assets/local-skilled-alignment/surface-map.yaml`). Verify: `rg -c 'id: S[0-9]+-' .skilled/commands/assets/local-skilled-alignment/surface-map.yaml` prints `62`
- [ ] T006 Capture the baseline that no doc run exists for this repository (`$DA`). Verify: `ls "$DA"` exits 1
- [ ] T007 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] T008 Record the bots CLI help and its verb table as they stand at this phase's setup (`.skilled/bin/bots.cjs`). Verify: `$BOTS --help | wc -l` prints a number and `rg -n '^const VERB_SPECS' .skilled/bin/bots.cjs` prints one line, and both numbers are written into `scratch/help-baseline.md` rather than asserted here. The 35-line help and the eleven-verb table are the pre-001 measurement, so a task that asserted them would fail on the post-012 tree this phase actually reads
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T009 Add the `system-skilled-bots` topic (`.skilled/commands/assets/local-doc-alignment/topics.json`). Verify: `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');const x=t.topics['system-skilled-bots'];console.log(x.codeRoots.length, x.checks.length)"` prints `3 3`
- [ ] T010 Run the skilled-alignment pass over the packet's `.skilled` change set (`$SA/<UTC timestamp>/`). Verify: `RUN=$(ls -d "$SA"/*/ | tail -1) && ls "$RUN/report.md" "$RUN/findings.json" "$RUN/fix-plan.md"` exits 0
- [ ] T011 Run the doc-alignment pass over the new topic (`$DA/<UTC timestamp>/`). Verify: `RUN=$(ls -d "$DA"/*/ | tail -1) && ls "$RUN/report.md" "$RUN/findings.json" "$RUN/fix-plan.md"` exits 0
- [ ] T012 Fix the skill-doc findings (`$SK/SKILL.md`, `$SK/ROUTER.md`, `$SK/README.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py $SK` exits 0
- [ ] T013 Fix the feature-catalog findings (`$SK/feature-catalog/`). Verify: `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exits 0
- [ ] T014 Fix the playbook findings (`$SK/manual-testing-playbook/`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package $SK/manual-testing-playbook` prints `violations=0`
- [ ] T015 Fix the reference and CLI-help findings (`$SK/*/references/`, `.skilled/bin/bots.cjs`). Verify: `$BOTS --help | rg -o '^  [a-z]+' | sort -u | wc -l` prints the same count as the `VERB_SPECS` keys
- [ ] T025 Name the code standards the skill relies on (`$SK/SKILL.md`, `$SK/README.md`). Both files name `sk-code` and its `sk-code-skilled` surface as the standards for the `.skilled/crates/bots-tui` Rust crate, point at `sk-code-skilled/references/rust/` and `sk-code-skilled/assets/checklists/rust-checklist/`, and say sk-code has no ratatui or crossterm rendering rules yet. Verify: `rg -l 'sk-code-skilled' $SK/SKILL.md $SK/README.md` lists both files, and `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --explain .skilled/crates/bots-tui/src/main.rs` names `rust` as the language and lists a `rust-checklist` part. When the probe shows no Rust route, record it in `scratch/rebuttals.md` as `handed_off` with the probe output, because the routing belongs to sk-code and not to this phase
- [ ] T026 [P] Write the terminal-screen reference from `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` in product voice. It covers every key binding with its context, action and footer label, the glyphs with their `--ascii` fallback and the rule that colour never carries meaning, the panes and components with their states, the four `--json` payloads the screen reads with their fields and version rule, the thread model and the answer path through `bots answer`, and the size floor and the too-small screen. Its facts come from the spec-folder design files, which are byte-equal to the crate copies and stay unchanged, and from the crate source, and it names no packet id, phase number, task or requirement id, spec path or `[SOURCE: specs/...]` citation (`$SK/bots-status/references/terminal-screen.md`). Verify: `test -f $SK/bots-status/references/terminal-screen.md` exits 0, `rg -n 'specs/|\[SOURCE:|REQ-[0-9]|\bT[0-9]{3}\b|\b0[0-9]{2}-' $SK/bots-status/references/terminal-screen.md` exits 1 and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $SK/bots-status/references/terminal-screen.md` exits 0
- [ ] T027 [P] Write the design folder's README to `/create:readme` standards. It says the frame tests in `tests/common/frames.rs` and `tests/chat/support.rs` load frames from `mockups.md` and `chat-mockups.md` by heading and size, that a frame changes in its source design file first and here in the same change, and that the sources are `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md` and `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md`. A FILES table names both fixtures, because `validate_document.py` emits `code_folder_flat_inventory` for a flat folder without one (`.skilled/crates/bots-tui/design/README.md`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/crates/bots-tui/design/README.md` exits 0
- [ ] T028 [P] Remove the five design docs no code or test reads and trim the CI design guard to the two fixtures (`.skilled/crates/bots-tui/design/architecture.md`, `contracts.md`, `key-map.md`, `glyph-table.md`, `component-inventory.md`, `.github/workflows/bots-runtime.yml`). The guard step drops `diff -r -x architecture.md -x contracts.md -x chat-mockups.md "$D1" .skilled/crates/bots-tui/design` and the two `$D2` doc diffs, adds `diff "$D1/mockups.md" .skilled/crates/bots-tui/design/mockups.md` and keeps the `$D3` chat diff, the `D2=` line, the payload loop and the three design path filters. Verify: `ls .skilled/crates/bots-tui/design` prints exactly `README.md`, `chat-mockups.md` and `mockups.md` once T027 has landed, and `diff specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md .skilled/crates/bots-tui/design/mockups.md` and `diff specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md .skilled/crates/bots-tui/design/chat-mockups.md` both exit 0
- [ ] T029 Point the crate README's design rows at the reference (`.skilled/crates/bots-tui/README.md`). The five rows for the removed files become one row that links `../../skills/system-skilled-bots/bots-status/references/terminal-screen.md`, the `mockups.md` and `chat-mockups.md` rows stay, and the two lines that call `design/` a copy of the approved screen designs say it holds the frame fixtures the tests read. Verify: `rg -n 'design/(architecture|contracts|key-map|glyph-table|component-inventory)\.md' .skilled/crates/bots-tui/README.md` exits 1, `rg -c 'terminal-screen\.md' .skilled/crates/bots-tui/README.md` prints a count above 0 and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/crates/bots-tui/README.md` exits 0
- [ ] T030 List the reference in the status mode the way it lists `status-and-inbox.md` (`$SK/bots-status/SKILL.md`, `$SK/bots-status/ROUTER.md`, `$SK/bots-status/README.md`). `SKILL.md` section 5 and both `README.md` lists gain a `references/terminal-screen.md` line. `ROUTER.md` names it in the leaf sentence of section 1 and gains a `SCREEN` intent at weight 4 with the keywords `bots ui`, `bots terminal screen`, `bots ui key bindings`, `bots ui glyphs` and `bots ui too small`, in the intent model prose, `INTENT_SIGNALS` and `RESOURCE_MAP`. Verify: `rg -l 'terminal-screen\.md' $SK/bots-status/SKILL.md $SK/bots-status/ROUTER.md $SK/bots-status/README.md` lists all three files and `rg -n '"SCREEN"' $SK/bots-status/ROUTER.md` prints two lines
- [ ] T031 Regenerate the derived routing files with their generators, never by hand (`$SK/leaf-manifest.json`, `$SK/graph-metadata.json`). Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write $SK` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --write --hub system-skilled-bots`. A `SCREEN` phrase the reach check reports as `wrong-hub` or `outranked` is dropped from `ROUTER.md` and the signals are regenerated, and the hub vocabulary is never hand-edited. Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $SK` exits 0, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub system-skilled-bots` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub system-skilled-bots` both print `RESULT: PASSED`, `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $SK` prints `OK: parent-skill-check` and `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` exits 0, because the frame tests read the two fixtures
- [ ] T016 Record every finding the fix pass settled, with its reason (`scratch/rebuttals.md`). Verify: `rg -c '^## ' scratch/rebuttals.md` prints the settled count the two reports name, `rg -c '^- Status: ' scratch/rebuttals.md` prints the same count, and `rg -c '^- Phase: [0-9]{3}$' scratch/rebuttals.md` prints the same count again, so every heading carries its six fields. The heading grammar is `^## (\S+)$` and the six fields are `design/records.md` section 11. The `Phase` line is the one 015's seeded intake reads, so a `handed_off` row without it is a row 015 cannot seed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run the skilled-alignment pass a second time in full after the fix pass, so a run folder holds a `report.md` that reads zero, then run `--recheck` against that second run (`$SA/<UTC timestamp>/report.md`, then `$SA/<UTC timestamp>/recheck.md`). Verify: `F=$(ls -t "$SA"/*/report.md | head -1) && rg -n '^- Open findings: 0' "$F"` prints one line, and `rg -n '^\| (still_open|new) \| 0 \|' "${F%report.md}recheck.md"` prints two lines. A `--recheck` alone writes no `report.md`, so the evidence copy in T020 would have no clean report to copy
- [ ] T018 Re-run the doc-alignment pass (`$DA/<UTC timestamp>/report.md`). Verify: `RUN=$(ls -d "$DA"/*/ | tail -1) && rg -n '^- Open findings: 0' "$RUN/report.md"` prints one line
- [ ] T019 Record both report folders, the clean criterion and the re-measured counts (`implementation-summary.md`). Verify: `rg -n 'Open findings: 0' implementation-summary.md` prints one line
- [ ] T020 Copy the last run of each command into the packet (`evidence/skilled-alignment/`, `evidence/doc-alignment/`). Verify: `ls evidence/skilled-alignment/report.md evidence/skilled-alignment/findings.json evidence/skilled-alignment/recheck.md evidence/doc-alignment/report.md evidence/doc-alignment/findings.json evidence/doc-alignment/recheck.md` exits 0. The six source paths and the doc run's `recheck.md` rule are `design/records.md` section 12
- [ ] T021 Confirm the copied evidence reads clean (`evidence/*/report.md`). Verify: `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines, one per evidence folder
- [ ] T022 Confirm the packet still validates (`specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment --strict` prints `RESULT: PASSED`
- [ ] T023 Confirm no unrelated file changed (`git status --porcelain`). Verify: `git status --porcelain | rg -v '^(.. )?(\.skilled/|\.github/workflows/bots-runtime\.yml|specs/system-skilled-bots/003-openbot-parity-build/013-)'` prints nothing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:waves -->
## Waves

Twelve waves. W4a, W4b and W4c run after W4 and before W5, so the second runs in W6 read the moved docs. A wave is one dispatch round: every task in it starts together, and the orchestrator reads the wave's verify step before the next wave starts. The worker count is set by file overlap, never by how many tasks a wave holds: two workers never write the same file, so a wave whose tasks write disjoint files runs one worker per task and a wave whose tasks write one file runs one worker.

| Wave | Task ids | Executor | Model | Effort | Workers in parallel | What sets the worker count |
|------|----------|----------|-------|--------|---------------------|----------------------------|
| W1 | T000-T008, T024 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `high` | 4 | No task writes a file, so the bound is the four read groups, not file overlap |
| W2 | T009 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `max` | 1 | T009 is the only writer of `topics.json`, so a second worker would race it |
| W3 | T010-T011 | the commands' own `--lanes=vibe-deepseek` preset | `deepseek-flash` | `max (fixed)` | 2 | The two runs write two different output roots and neither writes the checkout |
| W4 | T012-T015 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `max` | 4 | Four disjoint file sets: hub files, catalog, playbook, references plus the CLI help |
| W4a | T026-T028 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `max` | 3 | Three disjoint file sets: the reference, the design README, and the five removals plus the workflow |
| W4b | T029-T030 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `high` | 2 | The crate README and the three status mode files share no file, and both link the reference W4a wrote |
| W4c | T031 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `high` | 1 | Both generators read the router T030 wrote, and a dropped phrase rewrites that router |
| W5 | T016 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `high` | 1 | T016 is the only writer of `scratch/rebuttals.md` |
| W6 | T017-T018 | the commands' own `--lanes=vibe-deepseek` preset | `deepseek-flash` | `max (fixed)` | 2 | The two second runs write two different output roots and neither writes the checkout |
| W7 | T019 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `high` | 1 | T019 is the only writer of `implementation-summary.md` |
| W8 | T020-T021 | the orchestrator, no dispatch | none | none | 1 | Both tasks are a file copy and a grep over the copy, so a dispatch would add a hop and no judgement |
| W9 | T022-T023 | the orchestrator, no dispatch | none | none | 1 | Both tasks are read-only gates, so a dispatch would cost a run for a grep |

### W1 - Setup reads

- **Task ids**: T000, T001, T002, T003, T004, T005, T006, T007, T008, T024
- **Executor**: `cli-mistral-vibe`, the parent's primary for every phase since 2026-11-27 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`. Fallback tier `high`, because every task is a read and a grep
- **Workers in parallel**: 4. Worker A takes T000 to T002, worker B T003 and T004, worker C T005, worker D T006 to T008. No task writes a file, so file overlap does not bind and the four read groups set the count.
- **Orchestrator verify after the wave**: the eight task verifies are the wave's evidence, and the orchestrator re-reads the two that later waves depend on: `rg -n '^const VERB_SPECS' .skilled/bin/bots.cjs` prints one line and `$BOTS --help | wc -l` prints a number, and both are recorded in `scratch/help-baseline.md`. No task in this wave writes a file, so there is no artifact to check beyond those outputs.
- **Fallback order**: `cli-mistral-vibe` at `deepseek-flash` unless `VIBE_SESSION=1` → `cli-pi` at `--thinking high` → `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` → `cli-devin` at `deepseek-v4-1-flash-max` after a probe → `cli-codex` at `gpt-6-luna` `xhigh` `fast`. A read wave is the cheapest to re-run, so the orchestrator does the reads itself before it spends the last fallback.

### W2 - The topic entry

- **Task ids**: T009
- **Executor**: `cli-mistral-vibe`
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`. Fallback tier `max`, because the `terms` and `codeRoots` decide what the whole doc run reads, and a term that misses a doc hides it from every later wave
- **Workers in parallel**: 1. T009 is the only writer of `topics.json`, so a second worker on that file would race it.
- **Orchestrator verify after the wave**: `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');const x=t.topics['system-skilled-bots'];console.log(x.codeRoots.length, x.checks.length)"` prints `3 3`, and `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');console.log(Object.keys(t.topics).length)"` prints `11`
- **Fallback order**: `cli-mistral-vibe` unless `VIBE_SESSION=1` → `cli-pi` at `--thinking max` → `cli-opencode` at `#max` → `cli-devin` after a probe → `cli-codex` at `xhigh` `fast`. This is the one wave where the last fallback is a real option, because the topic decides the whole doc run and `gpt-6-luna` at `xhigh` is the hardest-task row.

### W3 - The two first runs

- **Task ids**: T010, T011
- **Executor**: the commands' own `--lanes=vibe-deepseek` preset, which is a `cli-vibe` lane at `deepseek-flash` that the shared lane runner starts from its own scratch folder with a fresh home [SOURCE: .skilled/commands/assets/local-skilled-alignment/executors.json:115] [SOURCE: .skilled/commands/local-skilled-alignment.md:66] [SOURCE: .skilled/commands/assets/local-doc-alignment/local-doc-alignment-auto.yaml:79]
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`, the roster row's own tier
- **Workers in parallel**: 2, one per command. The two runs write two different output roots and neither writes the checkout, so they cannot collide.
- **Orchestrator verify after the wave**: `RUN=$(ls -d "$SA"/*/ | tail -1) && ls "$RUN/report.md" "$RUN/findings.json" "$RUN/fix-plan.md"` exits 0, and the same for `$DA`, and `node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))" "$RUN/findings.json"` exits 0 for both
- **Fallback order**: `--lanes=vibe-deepseek` → `--lanes=deepseek` → `--lanes=opencode-go` → `--lanes=codex` → `--lanes=devin` after a probe → `--lanes=native`, which needs no binary and is the last resort. `local-doc-alignment.md` does not list `vibe-deepseek` among its presets, but its workflow binds any preset in the shared `executors.json` and runs every `cli-vibe` preset through the shared lane runner. The preset is a flag on the command, so a fallback is a re-run of the same command with a different `--lanes` value and not a different dispatch.

### W4 - The fixes

- **Task ids**: T012, T013, T014, T015
- **Executor**: `cli-mistral-vibe`
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`. Fallback tier `max`, because 36 of the 40 findings the last full run over this repository reported were `judgment` against 4 `literal`, so a fix changes what a doc claims rather than a string [SOURCE: .skilled/commands/local-skilled-alignment.md:15]
- **Workers in parallel**: 4, one per disjoint file set. Worker A takes T012 and writes `$SK/SKILL.md`, `$SK/ROUTER.md` and `$SK/README.md`. Worker B takes T013 and writes `$SK/feature-catalog/`. Worker C takes T014 and writes `$SK/manual-testing-playbook/`. Worker D takes T015 and writes `$SK/*/references/` and `.skilled/bin/bots.cjs`. No two sets share a file, which is what makes four safe.
- **Orchestrator verify after the wave**: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py $SK` exits 0, `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exits 0, `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package $SK/manual-testing-playbook` prints `violations=0`, and `$BOTS --help | rg -o '^  [a-z]+' | sort -u | wc -l` prints the `VERB_SPECS` key count
- **Fallback order**: `cli-mistral-vibe` unless `VIBE_SESSION=1` → `cli-pi` at `--thinking max` → `cli-opencode` at `#max` → `cli-devin` after a probe → `cli-codex` at `xhigh` `fast`. A worker that runs out mid-fix hands its file set to the next row whole, because a half-fixed file set is worse than an unfixed one.

### W4a - The crate design docs

- **Task ids**: T026, T027, T028
- **Executor**: `cli-mistral-vibe`
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`. Fallback tier `max`, because the reference restates five design docs in product voice and a fact dropped there is lost to every later reader
- **Workers in parallel**: 3, one per disjoint file set. Worker A takes T026 and writes `$SK/bots-status/references/terminal-screen.md`. Worker B takes T027 and writes `.skilled/crates/bots-tui/design/README.md`. Worker C takes T028, removes the five design docs and edits `.github/workflows/bots-runtime.yml`. Worker A reads the spec-folder design files and not the crate copies, so worker C's removals cannot race it.
- **Orchestrator verify after the wave**: T026's `rg` exits 1 and `validate_document.py` exits 0 on the reference, T027's `validate_document.py` exits 0 on `design/README.md`, `ls .skilled/crates/bots-tui/design` prints exactly `README.md`, `chat-mockups.md` and `mockups.md`, and the guard's two `diff` commands exit 0
- **Fallback order**: `cli-mistral-vibe` unless `VIBE_SESSION=1` → `cli-pi` at `--thinking max` → `cli-opencode` at `#max` → `cli-devin` after a probe → `cli-codex` at `xhigh` `fast`.

### W4b - The links

- **Task ids**: T029, T030
- **Executor**: `cli-mistral-vibe`
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`. Fallback tier `high`, because both tasks add link lines and one intent the task text already fixes
- **Workers in parallel**: 2, one per disjoint file set. Worker A takes T029 and writes `.skilled/crates/bots-tui/README.md`. Worker B takes T030 and writes `$SK/bots-status/SKILL.md`, `$SK/bots-status/ROUTER.md` and `$SK/bots-status/README.md`. Both link the reference W4a wrote, which is why the wave waits for W4a.
- **Orchestrator verify after the wave**: T029's two `rg` checks and `validate_document.py` on the crate README pass, and `rg -l 'terminal-screen\.md' $SK/bots-status/SKILL.md $SK/bots-status/ROUTER.md $SK/bots-status/README.md` lists all three files
- **Fallback order**: `cli-mistral-vibe` unless `VIBE_SESSION=1` → `cli-pi` at `--thinking high` → `cli-opencode` at `#high` → `cli-devin` after a probe → `cli-codex` at `xhigh` `fast`.

### W4c - The derived routing files

- **Task ids**: T031
- **Executor**: `cli-mistral-vibe`
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`. Fallback tier `high`, because the task runs two generators and reads their checks
- **Workers in parallel**: 1. Both generators read the router T030 wrote, and a phrase the reach check rejects rewrites that router, so a second worker would race it.
- **Orchestrator verify after the wave**: T031's five checks pass, and `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py $SK` exits 0
- **Fallback order**: `cli-mistral-vibe` unless `VIBE_SESSION=1` → `cli-pi` at `--thinking high` → `cli-opencode` at `#high` → `cli-devin` after a probe → `cli-codex` at `xhigh` `fast`.

### W5 - The rebuttals record

- **Task ids**: T016
- **Executor**: `cli-mistral-vibe`
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`. Fallback tier `high`, because the task transcribes reasons the fix pass already decided
- **Workers in parallel**: 1. T016 is the only writer of `scratch/rebuttals.md`.
- **Orchestrator verify after the wave**: `rg -c '^## ' scratch/rebuttals.md` prints the rebutted count the report names, and every heading names a finding id the report carries
- **Fallback order**: `cli-mistral-vibe` unless `VIBE_SESSION=1` → `cli-pi` at `--thinking high` → `cli-opencode` at `#high` → `cli-devin` after a probe → `cli-codex` at `xhigh` `fast`. The orchestrator writes this file itself before it spends the last fallback, because the reasons are already in the fix pass's own output.

### W6 - The second runs and the recheck

- **Task ids**: T017, T018
- **Executor**: the commands' own `--lanes=vibe-deepseek` preset
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`, the roster row's own tier
- **Workers in parallel**: 2, one per command. The two second runs write two different output roots and neither writes the checkout. T017 then runs its own `--recheck` against the folder its second run wrote, because a recheck of the first run would report the findings the fix pass already closed.
- **Orchestrator verify after the wave**: `F=$(ls -t "$SA"/*/report.md | head -1) && rg -n '^- Open findings: 0' "$F"` prints one line, `rg -n '^\| (still_open|new) \| 0 \|' "${F%report.md}recheck.md"` prints two lines, and `RUN=$(ls -d "$DA"/*/ | tail -1) && rg -n '^- Open findings: 0' "$RUN/report.md"` prints one line
- **Fallback order**: `--lanes=vibe-deepseek` → `--lanes=deepseek` → `--lanes=opencode-go` → `--lanes=codex` → `--lanes=devin` after a probe → `--lanes=native`. A re-run that reports a `new` bucket above `0` reopens W4 rather than falling back, because the finding is real and a different lane would only re-word it.

### W7 - The record

- **Task ids**: T019
- **Executor**: `cli-mistral-vibe`
- **Model**: `deepseek-flash`
- **Effort**: `max (fixed)`. Fallback tier `high`, because the task transcribes two paths, one criterion and two counts
- **Workers in parallel**: 1. T019 is the only writer of `implementation-summary.md`.
- **Orchestrator verify after the wave**: `rg -n 'Open findings: 0' implementation-summary.md` prints one line, and `rg -n 'local-skilled-alignment|local-doc-alignment' implementation-summary.md` prints both roots
- **Fallback order**: `cli-mistral-vibe` unless `VIBE_SESSION=1` → `cli-pi` at `--thinking high` → `cli-opencode` at `#high` → `cli-devin` after a probe → `cli-codex` at `xhigh` `fast`. The orchestrator writes this file itself before it spends the last fallback.

### W8 - The evidence copy

- **Task ids**: T020, T021
- **Executor**: the orchestrator, no dispatch. The copy is six `cp` calls and one grep, and the source paths are the two run folders the orchestrator already resolved in W6, so a dispatch would add a hop and no judgement.
- **Model**: none
- **Effort**: none
- **Workers in parallel**: 1, because T021 reads the files T020 writes
- **Orchestrator verify after the wave**: `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines, one per evidence folder, and `ls evidence/skilled-alignment evidence/doc-alignment` lists three files in each
- **Fallback order**: none. A copy that fails is re-run, never delegated, because the source run folder is the record and the copy is the only thing that can be wrong.

### W9 - The gates

- **Task ids**: T022, T023
- **Executor**: the orchestrator, no dispatch. Both tasks are one command whose output the orchestrator must read anyway, so a dispatch would add a hop and no evidence.
- **Model**: none
- **Effort**: none
- **Workers in parallel**: 1, because T023 reads the tree T022 validates and a concurrent write would make both answers stale
- **Orchestrator verify after the wave**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment --strict` prints `RESULT: PASSED`, and `git status --porcelain | rg -v '^(.. )?(\.skilled/|\.github/workflows/bots-runtime\.yml|specs/system-skilled-bots/003-openbot-parity-build/013-)'` prints nothing
- **Fallback order**: none. A gate that fails is repaired and re-run, never delegated, because the repair is the evidence.
<!-- /ANCHOR:waves -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Both `report.md` files carry `- Open findings: 0`, and the recheck's `still_open` and `new` rows both read `0`
- [ ] `evidence/skilled-alignment/` and `evidence/doc-alignment/` each hold `report.md`, `findings.json` and `recheck.md`, and `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines
- [ ] `scratch/rebuttals.md` carries one heading per settled finding, and every heading names an id a run's `findings.json` carries
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose §8 owns the executor roster, the effort policy and the fallback ladder this file's waves walk
- **Acceptance criteria**: See `acceptance-criteria.md`, which decides whether the packet may close
- **Design artifacts**: See `design/`, which fixes every record field, every state, every sequence, every stop, every screen and one golden per record. T000 reads them before any other task runs, and `spec.md` §5b is the index
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the command that blocked it and its exit status on the same line, and the wave it belongs to does not advance until the block is cleared or the task is re-scoped.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^[|] REQ-0' spec.md` prints `11`
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 8. External orchestration' plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `command -v python3 node` prints both paths
- [ ] CHK-004 [P0] The measured gap still holds. Verify: `rg -c 'system-skilled-bots' .skilled/commands/assets/local-doc-alignment/topics.json` exits 1 before T009
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The topic entry parses as JSON. Verify: `node -e "JSON.parse(require('fs').readFileSync('.skilled/commands/assets/local-doc-alignment/topics.json','utf8'))"` exits 0
- [ ] CHK-011 [P0] The CLI help still exits 0. Verify: `$BOTS --help` exits 0
- [ ] CHK-012 [P1] The runtime suite is unchanged. Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] CHK-013 [P1] No doc names a verb the table lacks. Verify: `rg -o 'bots (activity|routines|ui|remember|secret|skill|chat|channel)' $SK --glob '*.md' -N | sort -u` lists only verbs `VERB_SPECS` carries after 001 to 011 land
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: every row of `acceptance-criteria.md` reads `Met`
- [ ] CHK-021 [P0] The skilled-alignment report is clean. Verify: `RUN=$(ls -d "$SA"/*/ | tail -1) && rg -n '^- Open findings: 0' "$RUN/report.md"` prints one line
- [ ] CHK-022 [P0] The doc-alignment report is clean. Verify: `RUN=$(ls -d "$DA"/*/ | tail -1) && rg -n '^- Open findings: 0' "$RUN/report.md"` prints one line
- [ ] CHK-023 [P1] The recheck's open buckets are empty. Verify: `RUN=$(ls -d "$SA"/*/ | tail -1) && rg -n '^[|] (still_open|new) [|] 0 [|]' "$RUN/recheck.md"` prints two lines
- [ ] CHK-024 [P0] The clean close is checkable from the packet. Verify: `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines, one per evidence folder, and `ls evidence/skilled-alignment evidence/doc-alignment` lists `report.md`, `findings.json` and `recheck.md` in each
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Verify: `rg -c '^## ' scratch/rebuttals.md` plus the fixed count equals the report's finding count
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Verify: `rg -n 'bots (activity|routines|ui|remember|secret|skill|chat|channel)' $SK --glob '*.md'` lists every doc that names a new verb, so a fix to one is checked against the rest
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Verify: `rg -n 'VERB_SPECS' .skilled/bin/bots.cjs` prints the table and its one reader, so the help block's consumers are the two
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. Verify: N/A, because this phase changes no parser, path resolver or redaction rule. The one code edit is a help string
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' plan.md` prints one line naming the two commands, the two report shapes and the three topic checks
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Verify: `rg -c 'VIBE_SESSION=1' plan.md tasks.md` prints a count above 0 for each, so the one process-wide signal this phase reads is written into the ladder and into every wave that walks it
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Verify: `git rev-parse HEAD` is recorded in `implementation-summary.md` beside the two report folders
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n '(api[_-]?key|token|secret)\s*[:=]\s*["'\''][A-Za-z0-9]{16,}' .skilled/commands/assets/local-doc-alignment/topics.json` prints nothing
- [ ] CHK-031 [P0] Neither command writes the checkout. Verify: `git status --porcelain | rg -v '^(.. )?(\.skilled/|\.github/workflows/bots-runtime\.yml|specs/system-skilled-bots/003-openbot-parity-build/013-)'` prints nothing after both runs
- [ ] CHK-032 [P1] No credential value reaches a report. Verify: `rg -n 'MISTRAL_API_KEY=|sk-[A-Za-z0-9]{16,}' "$SA" "$DA"` prints nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: `rg -c 'system-skilled-bots' spec.md plan.md tasks.md` prints a count above 0 for each
- [ ] CHK-041 [P1] The clean criterion is named in one place. Verify: `rg -n 'Open findings: 0' spec.md plan.md tasks.md` prints the criterion in all three
- [ ] CHK-042 [P2] The skill README names the topic when the doc run reports it. Verify: `rg -n 'local-doc-alignment' $SK/README.md` prints one line, or the report carries no README finding and the row is deferred with that reason
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `git status --porcelain | rg '^\?\?' | rg -v 'scratch/'` prints nothing
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `ls -A scratch/` prints `.gitkeep` and `rebuttals.md` and nothing else, because `rebuttals.md` is the one file the packet keeps as evidence
- [ ] CHK-052 [P1] The terminal-screen reference exists in product voice. Verify: `test -f $SK/bots-status/references/terminal-screen.md` exits 0, `rg -n 'specs/|\[SOURCE:|REQ-[0-9]|\bT[0-9]{3}\b|\b0[0-9]{2}-' $SK/bots-status/references/terminal-screen.md` exits 1 and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $SK/bots-status/references/terminal-screen.md` exits 0
- [ ] CHK-053 [P1] The design folder's README validates. Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/crates/bots-tui/design/README.md` exits 0
- [ ] CHK-054 [P1] The design folder holds only the two fixtures and their README, and the CI guard diffs only the fixtures. Verify: `ls .skilled/crates/bots-tui/design` prints exactly `README.md`, `chat-mockups.md` and `mockups.md`, and the guard's two `diff` commands exit 0 when run by hand
- [ ] CHK-055 [P1] Every listing points at the reference and none at a removed file. Verify: `rg -l 'terminal-screen\.md' $SK/bots-status/SKILL.md $SK/bots-status/ROUTER.md $SK/bots-status/README.md .skilled/crates/bots-tui/README.md` lists all four files and `rg -n 'design/(architecture|contracts|key-map|glyph-table|component-inventory)\.md' .skilled/crates/bots-tui/README.md` exits 1
- [ ] CHK-056 [P1] The derived routing files are fresh and the hub checks pass. Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $SK` exits 0, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub system-skilled-bots` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub system-skilled-bots` both print `RESULT: PASSED`, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $SK` prints `OK: parent-skill-check`
- [ ] CHK-057 [P1] The frame tests still read the two fixtures. Verify: `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` exits 0
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | [ ]/15 |
| P1 Items | 18 | [ ]/18 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
