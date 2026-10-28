# After: the first landed lane, final state

Captured 2026-10-28 from the worktree at `9fdae0b7d4` plus this lane's uncommitted change. Raw logs: `.scratch-dc90/072-010/after.txt` and `.scratch-dc90/072-010/after/`, one file per gate, in the log directory beside the worktree root. Runner: `scratch/gates.sh`. Baseline: `before.md`.

This record covers the lane that lands REQ-003 and REQ-004. The phase is not complete, and the prose sweep that REQ-001 and REQ-002 depend on has not run.

## 1. Gate set, before and after

39 gates in both runs, every one exit 0. The runner is the same file for both, and the two runs print byte-identical summaries on 36 gates. The three that differ differ only in elapsed time: `router-tests`, `advisor-routing-suites` and `cite-drift-gate`.

```text
$ diff .scratch-dc90/072-010/baseline.txt .scratch-dc90/072-010/after.txt | grep '^[<>]' | cut -c1-120
< router-tests|0|ℹ duration_ms 20096.23
> router-tests|0|ℹ duration_ms 20151.388
< advisor-routing-suites|0|   Duration  9.61s (transform 180ms, setup 18ms, import 28ms, tests 9.38s, environment 0ms)
> advisor-routing-suites|0|   Duration  11.52s (transform 201ms, setup 19ms, import 34ms, tests 11.26s, environment 0ms)
< cite-drift-gate|0|ℹ duration_ms 733.414417
> cite-drift-gate|0|ℹ duration_ms 871.856625
```

| Gate | Before (exit) | After (exit) |
|------|---------------|--------------|
| psc-cli-classifier | 0 | 0 |
| psc-cli-external-orchestration | 0 | 0 |
| psc-mcp-tooling | 0 | 0 |
| psc-sk-code | 0 | 0 |
| psc-sk-design | 0 | 0 |
| psc-sk-doc | 0 | 0 |
| psc-system-deep-loop | 0 | 0 |
| route-guard | 0 | 0 |
| route-sync-check | 0 | 0 |
| verify-router-sync | 0 | 0 |
| pkg-cli-classifier | 0 | 0 |
| pkg-cli-external-orchestration | 0 | 0 |
| pkg-cli-orca | 0 | 0 |
| pkg-mcp-code-mode | 0 | 0 |
| pkg-mcp-tooling | 0 | 0 |
| pkg-sk-code | 0 | 0 |
| pkg-sk-design | 0 | 0 |
| pkg-sk-doc | 0 | 0 |
| pkg-sk-git | 0 | 0 |
| pkg-sk-prompt | 0 | 0 |
| pkg-sk-vision | 0 | 0 |
| pkg-system-deep-loop | 0 | 0 |
| pkg-system-skill-advisor | 0 | 0 |
| pkg-system-spec-kit | 0 | 0 |
| rule-copies | 0 | 0 |
| router-reach | 0 | 0 |
| hermes | 0 | 0 |
| sk-code-setup | 0 | 0 |
| root-metadata | 0 | 0 |
| leaf-manifest | 0 | 0 |
| router-tests | 0 | 0 |
| accuracy | 0 | 0 |
| validate | 0 | 0 |
| contract-drift | 0 | 0 |
| advisor-routing-suites | 0 | 0 |
| catalog-packages | 0 | 0 |
| sk-doc-script-tests | 0 | 0 |
| cite-drift-gate | 0 | 0 |
| skill-graph-freshness | 0 | 0 |

`package_skill.py --check --strict` prints `Result: PASS` on all fourteen skill folders, so the two prose-bearing skill packages changed here, sk-create-skill and system-spec-kit, still pass the strict contract.

## 2. Routing accuracy

```text
full_corpus_top1  155 / 195
holdout_top1       49 / 66
ambiguity_top1     19 / 24
```

Identical to `before.md` §2 on all three counts, so no route moved. `compiled-route-guard` reports every hub fresh with 0 failures and `compiled-route-sync` reports all 55 served copies matching their authored files.

## 3. Mirrors and carriers

The mirror check is not in the runner, so it was run on the final tree by hand.

```text
$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
[runtime-mirror-sync] PASS: 194 mirrors across 8 trees are in sync.
```

Exit 0. The runner's own carrier gates agree: `hermes` prints `PASS: 67 Hermes skill copies in sync`, and the regenerated `.hermes` copy of sk-create-skill is part of that 67.

`skill-graph-freshness` reports no stale compiled graph, no zombie, no ghost and no signal drift, and writes nothing because the canonical reindex stays operator-gated.

## 4. What changed, measured

Each row is a reading taken before the lane from `git show HEAD:<path>` and after it from the working tree.

| Reading | Before | After |
|---------|--------|-------|
| `Prose Clarity Checklist` mentions in `creation-workflow.md` | 0 | 3 |
| Files that link to the checklist | 0 | 9 |
| Copies of the rule text under `.skilled/` (`Put instructions before background`) | 0 | 1 |
| `human_voice` mentions in each create workflow file | 0 | 9 |
| Blocking human-voice gates in `gate_logic` | 0 | 4, one per workflow file |
| `six` in `memory-handback.md` | 3 | 0 |
| Semicolons in `sk-create-skill/README.md` | 1 | 0 |
| HVR scan of `sk-create-skill/README.md` | 1 hard blocker | 0 hard blockers, ceiling 93/100 |

The checklist is one place. `references/skill/creation-workflow.md` holds it at `:153-166`, and the rule text is not copied anywhere else: the sentence a reader would duplicate, "Put instructions before background", matches one file under `.skilled/`. Nine files link to the anchor `#prose-clarity-checklist`, and `creation-workflow.md` names it three times, the heading plus two internal links.

```text
$ rg -c "Prose Clarity Checklist" .skilled/commands/create/assets/*.yaml \
    .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md \
    .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md \
    .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md \
    .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md \
    .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md \
    .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md
.skilled/commands/create/assets/create-skill-auto.yaml:2
.skilled/commands/create/assets/create-skill-confirm.yaml:2
.skilled/commands/create/assets/create-skill-parent-confirm.yaml:1
.skilled/commands/create/assets/create-skill-parent-auto.yaml:1
.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:1
.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md:1
.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:3
.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md:1
.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:1
.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:3
```

The four activity blocks carry the link alone, `create-skill-auto.yaml:343` and `:361`, `create-skill-confirm.yaml:362` and `:380`, `create-skill-parent-auto.yaml:428` and `create-skill-parent-confirm.yaml:467`. The hub glossary rule sits in the checklist with the rest, at `creation-workflow.md:165`, and the one place whose location depends on the skill kind is also stated where an author of that kind will read it: `parent-skill-hub-template.md:229` opens the `### Terms` section it asks for, and `parent-skills-nested-packets.md:68` says packets link there rather than defining routing terms of their own.

`memory-handback.md` now names the seven siblings in the description, the opening sentence and the §1 overview, and its §4 is a table rather than a pointer. The old claim sent a reader to each sibling's §4 for a prompt-templates section number. The table gives the `SKILL.md` citation and the real template heading side by side, which is what the audit found: `cli-claude-code` cites §11 for a template at §13, `cli-devin` cites §13 for §12, `cli-cursor` carries a file link with no section number, and `cli-hermes` and `cli-pi` carry no handback section at all.

```text
$ grep -c six .skilled/skills/system-spec-kit/references/cli/memory-handback.md
0
$ grep -c ';' .skilled/skills/sk-doc/sk-create-skill/README.md
0
$ /usr/bin/python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py \
    .skilled/skills/sk-doc/sk-create-skill/README.md | tail -4
  hard blockers:          0
  mechanical deductions:  -7
  mechanical ceiling:     93/100
```

## 5. The human-voice gate in the four workflow files

Each file scores the documents the flow generates and blocks completion on a hard blocker. The step sits after generation and before strict validation, and `blocking: true` on its gate is what makes it a stop rather than a report.

| Workflow file | `gate_logic` entry | Step | Step definition | Blocking gate |
|---------------|--------------------|------|-----------------|---------------|
| `create-skill-auto.yaml` | `H4b_human_voice_gate` at `:258` | `step_3b_human_voice_score` at `:296` | `:405` | `:423` |
| `create-skill-confirm.yaml` | `H4b_human_voice_gate` at `:274` | `step_3b_human_voice_score` at `:301` | `:432` | `:450` |
| `create-skill-parent-auto.yaml` | `H6_human_voice_gate` at `:303` | `step_4b_human_voice_score` at `:323` | `:453` | `:469` |
| `create-skill-parent-confirm.yaml` | `H6_human_voice_gate` at `:332` | `step_4b_human_voice_score` at `:360` | `:495` | `:511` |

The targets are the files that exist, which is what makes the gate usable on a skill that carries no README. A full create scores `SKILL.md` and includes `README.md` only when it is present (`create-skill-auto.yaml:411`), a full update scores each existing document, and the hub flows enumerate the `SKILL.md` and `README.md` files their own generation step wrote (`create-skill-parent-auto.yaml:456`).

The exit codes drive the verdict: 0 means no hard blocker, 1 means a hard blocker and blocks completion, 2 means the scan could not run and also blocks completion. Both presentation contracts carry the result, `create-skill-presentation.txt:143-148` and `create-skill-parent-presentation.txt:151-154`, so the operator sees the score per target rather than a single verdict.

## 6. Review, and what was fixed

A read-only review of the uncommitted diff returned no P0, four P1 and four P2 findings (`report.md` ends `FINDINGS: P0=0 P1=4 P2=4`). All eight are fixed in the working tree, and the fixed state is what the gate run above measures.

| Finding | What it was | Fix |
|---------|-------------|-----|
| P1-1 | The seven rules were copied into four workflow YAMLs instead of linked, and the copies had already diverged | Six activity blocks now hold the link alone. `rg -F "Put instructions before background"` matches one file under `.skilled/` |
| P1-2.1 | The tree-to-table rewrite in `parent-skills-nested-packets.md` left a closing fence with no opener, which swallowed six sections | The stray fence is gone. `validate_document.py --json` reports `"valid": true` and no section-numbering warning |
| P1-2.2 | The hub README template failed the scan it teaches, inside its own payload | The command now uses `'\x{2014}|\x{3B}'`. The scan reads 0 hard blockers and 94/100, where it read 2 and 84/100 after the template rewrite |
| P1-4.1 | The anchor claim was false for three of the seven siblings | Replaced by the §4 map, which states the marker status per packet instead of asserting it for all seven |
| P2-2.3 | `benchmark/` was labelled optional while `parent-skill-check` 9b warns without it | Both tables now read "Benchmark baseline (parent-skill-check 9b warns if absent)" |
| P2-3.1 | A full create scored `README.md` with no "when present" guard, so a skill that carries none hit exit 2 | The step resolves targets from existing files only |
| P2-3.2 | The new blocking gate was absent from `gate_logic` in all four files | `H4b` and `H6` added, so the gate inventory lists every stop |
| P2-5.1 | The changelog omitted two author-visible changes in the same diff | The sibling reference rewrite and the Mermaid flow diagrams are both named |

One HVR reading needs its own line because the before and after numbers do not run in one direction. `assets/parent-skill/parent-skill-readme-template.md` read 0 hard blockers and a 95/100 ceiling at `HEAD`, read 2 hard blockers and 84/100 after the template rewrite, and reads 0 and 94/100 now. The middle reading is the defect the review found, and the final reading is the file that ships.

## 7. What this lane did not do

The prose sweep is untouched. All 59 `SKILL.md` files under `.skilled/skills/` still carry 368 prose lines over 400 characters, the longest 2,195 at `.skilled/skills/sk-git/SKILL.md:307`, which is `before.md` §4's reading unchanged. REQ-001's three checks and REQ-002's line length therefore stay open, and they run after phases 008 and 009 finish rewriting those files.

### The template payload still trips the gate it feeds

The create flows now block on a hard blocker, so the documents an author starts from matter more than they did. Three of the four templates moved in the right direction and one moved the wrong way. Each reading is `hvr_scan.py` on the file, the `HEAD` copy scanned from a scratch copy of `git show HEAD:<path>`.

| Template | `HEAD` | Now |
|----------|--------|-----|
| `assets/skill/skill-md-template.md` | 9 hard blockers, 41/100 | 6 hard blockers, 56/100 |
| `assets/skill/skill-readme-template.md` | 0 hard blockers, 92/100 | 0 hard blockers, 92/100 |
| `assets/parent-skill/parent-skill-hub-template.md` | 0 hard blockers, 97/100 | 5 hard blockers, 69/100 |
| `assets/parent-skill/parent-skill-readme-template.md` | 0 hard blockers, 96/100 | 0 hard blockers, 94/100 |

The hub template is the regression. Its `### Terms` section now opens "This is the hub's only glossary; packets link here instead of defining routing terms of their own" (`:231`), and `:285` and `:289` add four more, all semicolons and em dashes. At `HEAD` the same file carried none of them. The skill template improved from 9 to 6 and still carries 6.

None of these readings fails a gate, because no gate scans a template. What it means practically is that an author who follows the hub template will meet the new blocker inside the creation flow rather than before it. The fix is one edit per line, six in the skill template and five in the hub template, and it belongs with the sweep, which owns the prose of every document these templates produce.

### The one scope line that belongs to another phase

`references/cli/shared-smart-router.md` is untouched here, because phase 008 owns that file. As of this record its line 17 still carries the sentence this phase's scope names, and no `cli-*` `SKILL.md` carries the helper bodies it describes. Phase 008's lane has replaced the sentence in its own worktree, and the replacement lands with that phase.
