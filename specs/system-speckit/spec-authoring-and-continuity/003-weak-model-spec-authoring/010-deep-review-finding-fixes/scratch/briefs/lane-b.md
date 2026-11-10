# Lane B: guidance and guards

Read `common.md` in this folder first. This file adds what is specific to lane B.

## Skills to read

- `.skilled/skills/sk-doc/SKILL.md` and the references its router names for the doc types you edit: a reference doc, templates, an asset, command docs and YAML assets, an agent definition, a feature catalog leaf. Apply its human voice rules to every sentence you write.
- `.skilled/skills/system-spec-kit/SKILL.md` for the templates, the examples and the card.
- `.skilled/skills/sk-code/SKILL.md` and its shell and Vitest references before you edit the two guards or any test.

## Tasks

T040 to T068 in `$P/tasks.md`. Evidence goes to `$P/scratch/evidence/lane-b/`.

## Files you own

- `$S/references/workflows/spec-authoring-card.md`
- `$S/templates/examples/level-1/tasks.md`, `level-2/tasks.md`, `level-3/tasks.md`, `level-3+/tasks.md`
- `$S/templates/core/spec.md.tmpl`, `$S/templates/core/tasks.md.tmpl`, `$S/templates/core/plan.md.tmpl`
- `$S/templates/packet-types/phase-parent.spec.md.tmpl`
- `$S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`
- `$S/runtime/cli/tests/template-fill-guidance.vitest.ts`
- `$S/assets/template-mapping.md`, plus any other `.md` under `$S` that teaches `[PLACEHOLDER]` as the marker to replace and that lanes A and C do not own. Name each in your report.
- `$S/runtime/cli/spec/check-example-drift.sh`, `$S/runtime/cli/spec/check-card-sync.sh`
- `$S/runtime/cli/tests/example-drift.vitest.ts`, `$S/runtime/cli/tests/card-sync.vitest.ts`
- `$S/feature-catalog/tooling-and-scripts/spec-authoring-card.md`
- `.skilled/commands/speckit/assets/speckit-plan.yaml`, `.skilled/commands/speckit/assets/speckit-implement.yaml`, `.skilled/commands/speckit/plan.md`, `.skilled/commands/speckit/implement.md`
- `.skilled/agents/markdown.md` and its runtime copies: `.claude/agents/markdown.md`, `.opencode/agents/markdown.md`, `.codex/agents/markdown.toml`, `.pi/agents/markdown.md`, `.hermes/agents/markdown.md` and any Hermes `agent-markdown` skill mirror the generators write. `.cursor/agents/markdown.md` is a symlink to the Claude copy. `.skilled/bin/agent-mirror-crosswalk.md` says how each copy is produced. Regenerate copies with their generators, never by hand when a generator exists.

Lane A edits `create.sh`, the placeholder scanners and the orchestrator at the same time. You never build: if a test reports a stale build or a missing dist file, wait two minutes and retry once, then report it.

## Facts the conductor checked on this tree

- The card says at `:66` that the examples "are filled and safe to imitate for shape". The card requires a `Verify:` clause on task lines. The Level 2 example's task rows carry none (`templates/examples/level-2/tasks.md:32`).
- The card's task check counts only open task lines (`rg -c '^- \[ \] T[0-9]'`), so a correctly completed packet with `[x]` rows fails it. The corrected form counts every state: `rg -c '^- \[[ xB]\] T[0-9].*Verify: '` against `rg -c '^- \[[ xB]\] T[0-9]'`.
- `rg -l spec-authoring-card .skilled/commands/speckit/` lists only `speckit-complete.yaml`, which names the card under a condition around `:472`. `speckit-implement.yaml:217` routes to the `markdown` agent only for `/create:*` commands.
- Command docs are mirrored by symlink: `.claude/commands/speckit/*.md` link into `.skilled/commands/speckit/`, and `.opencode/commands` links to `.skilled/commands`. They need no mirror work. Agents are real copies per runtime.
- `template-mapping.md` lists `[PLACEHOLDER]` around `:233`. Neither the orchestrator nor the shell rule matches it. The marker strict validation checks in a v2.3 doc is `[YOUR_VALUE_HERE: ...]`.
- On this tree the two guards print `EXAMPLE_DRIFT_OK` and `CARD SYNC OK` and exit 0, in about one second together.
- Word counts before any edit are in `$P/scratch/baseline/words-before.txt`.

## Decisions you keep

- T040 narrows the card's claim to section shape, and T046 to T049 also give every example task line a `Verify:` clause, so the card and the examples agree.
- T053 replaces the retired `/spec_kit:` prefix with the current `/speckit:` prefix.
- T054: the snapshot diff may hold only the lines T050 to T053 changed. If the snapshot test fails on any other line, report it and leave that line alone.
- T058 and T059: each guard fails, with a message, when `rg` is missing from `PATH`. The drift guard also fails on reordered anchors, whose `out_of_order_anchor` result it discards today, and when a level's example is missing. The card guard also requires the checklist's example route, which it checks only negatively today, and reads every mode, not only the last `jq -e` answer. For the `PATH` cases, build a `PATH` that keeps `bash`, `jq`, `awk`, `node` and coreutils but not `rg`, for example a temp directory of symlinks.
- T060 and T061 build every seeded defect in a temp copy, never in the real tree.
- T055 asserts GOOD and WEAK on each core fill note and checks every add-on note.
- T063 to T066 (ADR-006): name the card and the token rule in one conditional line at the step where each asset or entry point already tells the model to write spec docs. The token rule: fill every `[YOUR_VALUE_HERE: ...]` token before the status leaves Draft. Do not add a new step and do not reorder steps.
- T067 and T068: the `markdown` agent's spec-doc row names the token rule and the two guards. Then sync every runtime copy and run each mirror check the crosswalk names.

## Word budgets (ADR-006, CHK-043)

The card may grow by at most 80 words net, and each core template by at most 60, against `words-before.txt`. Each GOOD and each WEAK example is one short line. Each new `Verify:` clause in an example is a command and what it prints, in at most 12 words. Report before and after `wc -w` for every model-facing file you change.

## P2 rows you own

The rows whose Lane column reads `B` in `$P/scratch/p2-ledger.md`, plus your part of `R1-P1-001`, the phase-parent template prefix (T053). Lane C fixes the same prefix in five reference docs.

## Final checks

After T058 and T059, `bash $S/runtime/cli/spec/check-example-drift.sh` must print `EXAMPLE_DRIFT_OK` and `bash $S/runtime/cli/spec/check-card-sync.sh` must print `CARD SYNC OK` on the real tree, each seeded copy must exit 1, and a `PATH` without `rg` must make each guard exit non-zero. Run `bash -n` on both guards.

## Acceptance rows you feed

AC-006, AC-007, AC-008, and your P2 rows for AC-010.
