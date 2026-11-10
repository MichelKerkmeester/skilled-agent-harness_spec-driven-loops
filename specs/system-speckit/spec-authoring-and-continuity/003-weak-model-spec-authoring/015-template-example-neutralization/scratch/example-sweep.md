# Example sweep, 2026-10-26

Read-only sweep of every place a model reads that names the speed benchmark's own task: adding `--quiet` to `recommend-level.sh` so it prints only its `Recommended Level:` line instead of the full report. Run from the worktree root at the state after phase 014. `S` is `.skilled/skills/system-spec-kit`.

## Commands

Direct terms (the task's own words):

```bash
D='quiet|recommend-level|17-line|1 and 17|prints 17|Recommended Level|level line|line 510|parseable|report block|skip the report|the default report|Default line count'
rg -n -i -e "$D" S/templates/
```

Story terms (fill notes that tell the same flag-on-a-script story without the direct words):

```bash
I='flag|stderr|one line|1 line|the report|label|--json|exit 2|40 ms|10,000|12 lines|wc -l|bash -n|output block|script'
rg -n 'FILL:' S/templates/ | rg -v -i -e "$D" | rg -i -e "$I"
```

Then every remaining `FILL:` line in `templates/core` and `templates/addons` (111 in all) was read by hand. Three more tell the task story: `plan.md.tmpl:167`, `plan.md.tmpl:221` and `debug-delegation.md.tmpl:61`.

Wider sweeps: `rg -n -i -e "$D"` over `S/references/`, `S/SKILL.md`, `S/README.md`, the golden snapshot and `S/templates/examples/`; and a hidden-file sweep of the whole repository outside `specs/`, `changelog/`, `.git/` and `node_modules/` for `quiet flag|quiet branch|recommend-level-quiet|17-line|prints 1 and 17|Recommended Level:`.

## Model-read guidance to rewrite: 87 lines in 12 files

Every template hit sits inside a `<!-- FILL: ... -->` note: `rg -n -i -e "$D" S/templates/ | rg -v 'FILL:'` printed nothing.

| File | Direct | Story | Lines |
|------|--------|-------|-------|
| `templates/core/spec.md.tmpl` | 13 | 8 | 59 74 100 113 135 172 182 199 204 245 250 278 282 318 328 336 345 384 412 423 433 |
| `templates/core/plan.md.tmpl` | 5 | 8 | 48 67 84 102 124 133 167 221 248 293 305 331 379 |
| `templates/core/tasks.md.tmpl` | 6 | 4 | 44 60 71 83 94 143 155 182 193 242 |
| `templates/core/implementation-summary.md.tmpl` | 5 | 1 | 86 99 119 128 139 150 |
| `templates/addons/research.md.tmpl` | 7 | 10 | 22 83 111 157 226 302 337 403 490 559 621 670 727 777 843 905 924 |
| `templates/addons/handover.md.tmpl` | 3 | 1 | 38 51 108 122 |
| `templates/addons/debug-delegation.md.tmpl` | 3 | 1 | 44 61 79 95 |
| `templates/addons/goal.md.tmpl` | 3 | 0 | 39 79 90 |
| `templates/addons/acceptance-criteria.md.tmpl` | 2 | 0 | 42 54 |
| `templates/addons/timeline.md.tmpl` | 1 | 1 | 36 49 |
| `templates/addons/decision-record.md.tmpl` | 0 | 1 | 36 |
| `references/workflows/spec-authoring-card.md` | 4 | 0 | 97 99 100 111 (the section 6 Step example and the section 7 task-line example) |
| **Total** | **52** | **35** | **87** |

The narrow count the review used (`--quiet|recommend-level|17-line|prints 1 and 17`) gives spec 11, tasks 6, plan 4, implementation-summary 5 in `templates/core/`; the wide count above adds the lines that use other task words.

Notable lines: `spec.md.tmpl:318`, `:423` and `:433` answer the benchmark's own upkeep question in advance ("Does `--quiet` suppress warnings? No, stderr is unchanged"); `spec.md.tmpl:59` and `:100` state the report length ("a 17-line report"); `tasks.md.tmpl:83` gives the expected counts ("prints 1 and 17"); `timeline.md.tmpl:36` and `goal.md.tmpl:90` give the real source line (`line 510`, which is the `Recommended Level:` echo at `S/runtime/cli/spec/recommend-level.sh:510`).

## Regenerated, not hand-edited: the golden snapshot

| File | Hit lines | Entries | Action |
|------|-----------|---------|--------|
| `S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | 96 | 23 `exports[` entries | Regenerate with vitest `-u` after the template edits; every hit is a rendered `FILL:` note |

## Zero hits

| Surface | Result |
|---------|--------|
| `S/templates/examples/level-1`, `level-2`, `level-3`, `level-3+` | No direct term; all four are the "Add User Authentication" example |
| `S/templates/packet-types/`, `templates/README.md`, `CONTRACT.md`, `EXTENSION-GUIDE.md`, `MIGRATION.md` | No direct term |
| `S/references/workflows/spec-folder-authoring-checklist.md`, `S/leaf-manifest.json`, `S/leaf-aliases.json` (the other surfaces `check-card-sync.sh` ties to the card) | No task example |
| Runtime mirrors outside `.skilled/` (`.opencode .claude .codex .pi .devin .cursor .hermes`) | No hit; `.hermes/skills/system-spec-kit/` holds only `SKILL.md`, which has no task example |

## Hits that stay: real tool use, tests, fixtures and records

| Location | Why it stays |
|----------|--------------|
| `references/workflows/spec-authoring-card.md:35` | Tells the author to run the level helper; a real instruction, not an example |
| `references/workflows/spec-authoring-card.md:140 145 147 149 150 159` | `validate.sh --quiet` is the validator's own flag |
| `references/templates/level-selection-guide.md:38`, `template-guide.md:104 151 200`, `references/structure/phase-definitions.md:60 62`, `phase-system.md:32 89`, `references/workflows/quick-reference.md:56 576`, `intake-contract.md:64 139 285`, `execution-methods.md:155 162 165`, `S/README.md:513 620`, `S/SKILL.md:114` | Name `recommend-level.sh` as the level helper |
| `references/config/environment-variables.md`, `execution-methods.md:37 38 100 129`, `validation/path-scoped-rules.md:127`, `validation-rules.md:820`, `quick-reference.md:145` | Describe `validate.sh --quiet` and `SPECKIT_QUIET` |
| `S/runtime/cli/spec/recommend-level.sh` | The script itself |
| `S/runtime/cli/tests/test-phase-system.js`, `test-phase-validation.js`, `test-validation*.sh`, `S/runtime/tests/progressive-validation.vitest.ts`, `system-deep-loop/.../advise-council-completion.vitest.ts` | Tests that exercise real scripts and flags |
| `S/runtime/cli/tests/template-fill-guidance.vitest.ts` | Checks fill-note shape only (GOOD then WEAK); its fixtures name no task |
| `S/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:79` | A test brief that asks a model to describe this feature; a test input like the benchmark brief, not guidance. Phase 018 decides whether it moves to the new task |
| `S/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md` | A record of a past run |
| `cli-external-orchestration/cli-codex/README.md:238` | About `codex exec`, which has no quiet flag |
| `S/runtime/data/trigger-index.json`, `S/runtime/cli/retrieval/fixtures/` | Generated; CI rebuilds them |

## Guard surfaces

- `check-card-sync.sh` ties the card to `SKILL.md`, `leaf-manifest.json`, `leaf-aliases.json` and `spec-folder-authoring-checklist.md`; it checks paths and the card length limit (260 lines), not example text.
- `check-example-drift.sh` checks that each `templates/examples/level-*` doc keeps the template's anchors and a usable description; it reads anchors, not fill-note text.
- `template-fill-guidance.vitest.ts` checks that every fill note has a GOOD and then a WEAK example.

## Baselines taken during the sweep

| Check | Output |
|-------|--------|
| `bash S/runtime/cli/spec/check-card-sync.sh \| tail -1` | `CARD SYNC OK`, exit 0 |
| `bash S/runtime/cli/spec/check-example-drift.sh \| tail -1` | `EXAMPLE_DRIFT_OK` |
| `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `npx vitest run tests/template-fill-guidance.vitest.ts --config ../../vitest.config.ts --project cli` (from `S/runtime/cli`) | `Tests  24 passed (24)` |
| `npx vitest run tests/scaffold-golden-snapshots.vitest.ts --config ../../vitest.config.ts --project cli` (from `S/runtime/cli`) | `Tests  12 passed (12)` |
| Combined gate: direct terms plus `\bflags?\b`, `the report`, `output branch`, restricted to `FILL:` lines in `templates/core` and `templates/addons`, piped to `wc -l` | `63` |
| `rg --hidden -l -i 'rotate-logs' --glob '!.git/**' .` | nothing, exit 1: the chosen neutral example names no existing file |
