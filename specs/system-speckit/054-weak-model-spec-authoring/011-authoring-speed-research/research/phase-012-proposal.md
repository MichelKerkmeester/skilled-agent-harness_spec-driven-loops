---
title: "Phase 012 proposal: build the authoring-speed changes that are safe tonight"
description: "Three file-disjoint lanes from the phase 011 research: skip the git file-system monitor in the citation scanner, remove two self-contradictions a model reads, and drop inconsistent LOC figures. Each task names its file, its edit and a Verify command with expected output."
trigger_phrases:
  - "phase 012 authoring speed build"
  - "source tags fsmonitor fix"
  - "authoring card raise the level contradiction"
importance_tier: "normal"
contextType: "planning"
---
# Phase 012 proposal: authoring-speed changes to build now

Source: `research/research.md` section 11, ranks 1, 2, 3 and 9. Everything else in that table is deferred to the 2026-10-26 benchmark and is out of scope here.

All commands run from the repository root, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/217-weak-model-spec-authoring`. No lane commits; the conductor commits each lane.

---

## 1. LANES AND SEQUENCING

| Lane | Files (owned by this lane only) | Can start | Routing |
|------|---------------------------------|-----------|---------|
| 1 | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs`, `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Now. Neither file is in phase 010's write set | sk-code |
| 2 | `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl`, `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Only after phase 010's lane B commit is in `git log`. All three files are phase 010 files | sk-doc and system-spec-kit; sk-code for the snapshot run |
| 3 | `.skilled/skills/system-spec-kit/references/templates/level-specifications.md` | Now | sk-doc |

The lanes share no file. Lane 2's gate: `git status --porcelain -- .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` prints nothing (phase 010's edits are committed). If it prints anything, lane 2 waits.

Effort: lane 1 about 20 minutes plus test time, lane 2 about 15 minutes, lane 3 about 5 minutes.

---

## 2. LANE 1: SKIP THE FILE-SYSTEM MONITOR IN THE CITATION SCANNER

Why: `SOURCE_TAGS` spends 6 to 9 seconds per strict run of any packet with `research/` or `review/` waiting on the git file-system monitor. With the monitor off, its output is identical and it takes 0.9 seconds (research.md section 6). Phase 010 fixes the same class in `runtime/cli/retrieval/lib/corpus.mjs` the same way.

Proof plan, before any edit:

- [ ] T100 Record the baseline output and time (scratch only, no source file).
  Verify: `mkdir -p specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/p12 && node .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research > specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/p12/before.txt; tail -1 specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/p12/before.txt` prints a `CHECKED` line, and `for i in 1 2 3; do /usr/bin/time -p node .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research >/dev/null; done 2>&1 | rg '^real'` prints three `real` lines. Record them. Measured tonight: 6.93 and 9.85 seconds.
- [ ] T101 Record both test baselines.
  Verify: from `.skilled/skills/system-spec-kit`, `npx vitest run runtime/cli/tests/check-source-tags.vitest.ts --config vitest.config.ts` prints `Tests  19 passed (19)`; from `.skilled/skills/sk-doc`, `node scripts/tests/test-cite-drift-scan.mjs` prints `ℹ pass 67` and `ℹ fail 0`.

Edits:

- [ ] T102 In `check-source-tags-helper.mjs`, `untrackedFiles` (line 108), change the argument list to `['-c', 'core.fsmonitor=false', '-C', repoRoot, 'ls-files', '--others', '--exclude-standard', '-z']`, and add one comment line above it that says a configured fsmonitor daemon can stall this listing for seconds (the durable why, no packet or phase label).
  Verify: `rg -n "core.fsmonitor=false" .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` prints one line.
- [ ] T103 In `cite-drift-scan.mjs`, `listTrackedFiles` (line 195), change the argument list to `['-c', 'core.fsmonitor=false', '-C', repoRoot, 'ls-files', '-z']`, with the same one-line comment.
  Verify: `rg -n "core.fsmonitor=false" .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` prints one line.

Proof after the edits:

- [ ] T104 Same output.
  Verify: `node .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research | diff specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/p12/before.txt -` prints nothing and exits 0. Nobody may edit the phase 011 folder between T100 and T104; if someone did, rerun T100 first.
- [ ] T105 Faster, with the monitor still configured on.
  Verify: `git config --get core.fsmonitor` prints `true`, then the T100 timing loop prints three `real` lines each under 2.0. Expected near 0.9, from the environment-override run tonight.
- [ ] T106 No behavior regression.
  Verify: the two T101 commands print the same counts as the baseline: `Tests  19 passed (19)`, and `ℹ pass 67` with `ℹ fail 0`.
- [ ] T107 The rule end to end.
  Verify: `time (SPECKIT_RULES=SOURCE_TAGS bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research --strict | tail -1)` prints `RESULT: PASSED` and a real time under 3 seconds. Measured before the change: 18.91 seconds.

No new test. The change alters no output, the two suites above prove that, and T105 proves the speed. An argument-list assertion would mirror the implementation.

---

## 3. LANE 2: REMOVE TWO SELF-CONTRADICTIONS A MODEL READS

Why: the card gives three answers to "the plan needs more than four steps" (section 2 "Do not raise the level yourself", section 6 "Split it or raise the level", section 11 "Stop and write the question"), and the tasks template states its task format twice, once without the `Verify:` clause the body, the card and phase 010's examples require. The only diagnosed authoring failure in the benchmark was a model following the more permissive of two readings.

Start only after the lane 2 gate in section 1 holds. Re-read both files first: phase 010 may have moved the lines named below.

- [ ] T200 Record the baselines.
  Verify: `rg -c 'raise the level' .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` prints `2`; `wc -w < .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` prints a number, recorded as N; `rg -c 'Verify: <command> prints <expected output>' .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` prints `1`; `rg -c '^description: "Task Format' .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` prints `4`.
- [ ] T201 In the card, section 6 (`## 6. THE PLAN SHAPE`, line 89 tonight), replace the sentence `Split it or raise the level.` with `Stop and ask, as section 11 says.`
  Verify: `rg -c 'raise the level' .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` prints `1` (section 2's prohibition only); `wc -w` of the card prints at most N; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh | tail -1` prints `CARD SYNC OK`.
- [ ] T202 In `tasks.md.tmpl`, frontmatter `description` (line 15 tonight), change the value to `"Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"`, matching the body's `**Task Format**` line (line 53 tonight).
  Verify: `rg -c 'Verify: <command> prints <expected output>' .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` prints `2`.
- [ ] T203 Update the golden snapshot for the new description only. From `.skilled/skills/system-spec-kit`, run `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts -u`, then inspect the diff before accepting it.
  Verify: `git diff --numstat -- .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` prints `4	4`, and `git diff -U0 -- .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | rg '^[-+][^-+]' | rg -vc 'description: "Task Format'` prints `0`. Any other changed line means the snapshot picked up something else: stop and report it.
- [ ] T204 The suite and guards still pass without `-u`.
  Verify: from `.skilled/skills/system-spec-kit`, `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts runtime/cli/tests/placeholder-token-gate.vitest.ts runtime/cli/tests/template-fill-guidance.vitest.ts --config vitest.config.ts` prints `Test Files  3 passed`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh | tail -1` prints `EXAMPLE_DRIFT_OK`.

No existing packet changes: the template description is copied only into new scaffolds, and `rg 'Task Format' .skilled/skills/system-spec-kit/runtime --glob '*.{ts,mjs,cjs,js,sh}'` finds no code that reads it.

---

## 4. LANE 3: DROP THE INCONSISTENT DOCUMENT-SIZE LOC FIGURES

Why: `level-specifications.md`, which the skill's `PLAN` route loads, gives document sizes of about 455, 875, 1090 and 1075 LOC per level, ranking Level 3+ below Level 3. The composed Level 1 core templates render 427 lines. No validator or other doc reads these figures. The change-size LOC guidance (`LOC GUIDANCE: <100` and its siblings) stays.

- [ ] T300 Record the baseline.
  Verify: `rg -c '~(455|875|1090|1075) LOC' .skilled/skills/system-spec-kit/references/templates/level-specifications.md` prints `5`; `rg -c 'LOC GUIDANCE' .skilled/skills/system-spec-kit/references/templates/level-specifications.md` prints `3`.
- [ ] T301 In the progressive-enhancement block (lines 55, 57, 59 and 61), delete the trailing ` (~455 LOC)`, ` (~875 LOC)`, ` (~1090 LOC)` and ` (~1075 LOC)`. At line 823, change `**Composed Level 1 (Core only ~455 LOC):**` to `**Composed Level 1 (core only):**`.
  Verify: `rg -n '~(455|875|1090|1075) LOC' .skilled/skills/system-spec-kit/references/templates/level-specifications.md` prints nothing and exits 1; `rg -c 'LOC GUIDANCE' .skilled/skills/system-spec-kit/references/templates/level-specifications.md` still prints `3`; `git diff --numstat -- .skilled/skills/system-spec-kit/references/templates/level-specifications.md` prints `5	5`.

---

## 5. CLOSING GATE (CONDUCTOR)

- [ ] T400 Each lane's diff touches only its own files.
  Verify: `git diff --name-only` after all lanes lists exactly the six files in section 1, plus any files phase 010 still has open.
- [ ] T401 Remove `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/p12/` once T104 has passed, or keep it as evidence in the phase 012 packet.

---

## 6. DOC SURFACES EACH CHANGE MAKES STALE

For the alignment pass. Listed by lane; "check" means the surface describes the area and may or may not quote the changed text.

**Lane 1**
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`: the `SOURCE_TAGS` section (around line 109) should say the scanner's git listings skip fsmonitor; line 821's "about 108ms" strict-validation figure is contradicted by tonight's measurements (1.29 s on an ordinary packet, 15 to 33 s on a packet with `research/` before this fix) and should be re-measured after lane 1.
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` (the `SOURCE_TAGS` entry near line 542) and its feature leaf (check).
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/source-tag-resolution.md` (check; add a timing expectation only if the scenario already states one).
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` (check; it names the scanner).
- `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md`, `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md`, `.skilled/skills/sk-doc/shared/scripts/README.md` (check).
- Changelogs: a sk-doc changelog entry and a system-spec-kit changelog entry, per each skill's release convention.

**Lane 2**
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md` (check; it summarizes the card's steps).
- `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md`, `authoring-card-sync-guard.md`, `authoring-card-router-intents.md` (check for quoted section 6 text).
- `.skilled/skills/system-spec-kit/references/templates/template-guide.md` and `assets/template-mapping.md` (check for the task-format line).
- `.skilled/agents/markdown.md` and its four mirrors, `.skilled/commands/speckit/plan.md` and `implement.md` (check; they reference the card).
- `.skilled/agents/orchestrate.md` `### Task Format` (check against the template's format).
- `.skilled/skills/system-spec-kit/README.md` and `SKILL.md` (check; both reference the card).

**Lane 3**
- `.skilled/skills/system-spec-kit/references/templates/level-selection-guide.md` and `template-guide.md` (check; both link `level-specifications.md`).
- Noticed, not changed by this lane: `level-specifications.md` still names a Level 2 "checklist" (lines 69 and 183) and a Level 3+ "extended checklist" (line 840), which the current level contract may no longer scaffold. Raise it to the alignment pass rather than fixing it here.

---

## 7. NOT IN THIS PHASE

Ranks 4 to 8 and 10 to 12 of `research/research.md` section 11: the `PLAN` bundle cut, the required-anchor check (phase 010 builds it), fill-note trimming, a Level 1 card path, single-proof authoring, a one-document packet, clock stamps and `CONTINUITY_FRESHNESS`. Each needs the 2026-10-26 benchmark or would change an existing packet's verdict.
