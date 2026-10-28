# Baseline: prose clarity pass, the shared gate set

Recorded on 2026-10-28 from the worktree at `9fdae0b7d4`, the commit that recorded the sk-design and system-deep-loop routing-canon phase, before any edit to sk-create-skill or to the create workflows. Raw output: `.scratch-dc90/072-010/baseline.txt`, one line per gate, in the log directory beside the worktree root. Runner: `scratch/gates.sh`, which takes its output directory as its first argument and was called with this phase's.

## 1. Gates

39 gates, every one exit 0.

```text
$ grep -c . .scratch-dc90/072-010/baseline.txt
39
$ awk -F'|' '$2 != 0' .scratch-dc90/072-010/baseline.txt | wc -l
0
```

The runner's order: seven `parent-skill-check` runs (`cli-classifier`, `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `system-deep-loop`), `compiled-route-guard`, `compiled-route-sync`, `verify-router-sync`, fourteen `package_skill.py --check --strict` runs (one per skill folder), the rule-copies canary, router vocabulary reach, the Hermes mirror check, the sk-code setup battery, root metadata, leaf-manifest freshness, the router test files, routing accuracy, recursive strict validation of the parent packet, contract drift, the advisor routing suites, the feature-catalog package validator, the sk-doc script tests, the cite-drift gate and the skill-graph freshness report.

Two lines carry a failure mode rather than a pass word, and both are the gate's own summary: `route-guard` prints the tail of its JSON, `accuracy` prints the tail of its JSON.

## 2. Routing accuracy

| Corpus | Top-1 |
|---|---|
| Full corpus | 155 / 195 |
| Holdout | 49 / 66 |
| Ambiguity | 19 / 24 |

The accuracy log records `"capturedAtSha": "9fdae0b7d4"`, so the run measured the corpus at the commit this baseline names. The same file records `unknown_count` 13 and `gold_none_false_fire` 5.

## 3. The prose at the baseline

Four readings, each the state this lane changes. Run from the worktree root.

```text
$ git -c core.fsmonitor=false show HEAD:.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md | grep -c 'Prose Clarity Checklist'
0
$ git -c core.fsmonitor=false show HEAD:.skilled/commands/create/assets/create-skill-auto.yaml | grep -c 'human_voice\|human-voice'
0
$ git -c core.fsmonitor=false show HEAD:.skilled/skills/system-spec-kit/references/cli/memory-handback.md | grep -c six
3
$ git -c core.fsmonitor=false show HEAD:.skilled/skills/sk-doc/sk-create-skill/README.md | grep -c ';'
1
```

The same `human_voice` search reads 0 on the other three create workflow files, `create-skill-confirm.yaml`, `create-skill-parent-auto.yaml` and `create-skill-parent-confirm.yaml`. So no create workflow scored a generated document at the baseline, and the writing guidance carried no clarity checklist at all.

The three `six` readings in `memory-handback.md` are the description line, the opening sentence and the §1 overview. There are seven `cli-*` siblings, so all three undercount and two of them also assert a prompt-templates section that three siblings do not carry.

The one semicolon in `sk-create-skill/README.md` sits at line 83, and it is a hard blocker under the human-voice rules rather than a style preference.

## 4. Line length across the skill docs

REQ-002 has no gate yet, so the baseline measures it directly. The scan skips fenced blocks and table rows, and counts any remaining line longer than 400 characters.

```text
$ python3 - <<'PY'
import glob
fence = "`" * 3
over = 0
worst = (0, "")
in_fence = False
paths = sorted(glob.glob(".skilled/skills/**/SKILL.md", recursive=True))
for path in paths:
    for number, line in enumerate(open(path, encoding="utf-8"), 1):
        text = line.rstrip("\n")
        if text.lstrip().startswith(fence):
            in_fence = not in_fence
            continue
        if in_fence or text.lstrip().startswith("|"):
            continue
        if len(text) > 400:
            over += 1
            worst = max(worst, (len(text), path + ":" + str(number)))
print("SKILL.md files scanned: " + str(len(paths)))
print("prose lines over 400 characters: " + str(over))
print("longest: " + str(worst[0]) + " characters at " + worst[1])
PY
SKILL.md files scanned: 59
prose lines over 400 characters: 368
longest: 2195 characters at .skilled/skills/sk-git/SKILL.md:307
```

368 lines across 59 files, the longest 2,195 characters. That is the size of the sweep REQ-002 asks for, and it is why the sweep runs after phases 008 and 009 rewrite those files rather than before.

## 5. What the baseline leaves for this phase

Two requirements are measurable and unfinished, and both belong to the prose sweep: REQ-001's three checks and REQ-002's line length. The work this lane can finish without the sweep is the writing side, which is REQ-003 and REQ-004.

One scope line is not this phase's to take. `references/cli/shared-smart-router.md` sits in phase 008's file set. At this commit its line 17 still reads "The helper bodies below are byte-identical across all seven files", and no `cli-*` `SKILL.md` carries those bodies: `grep -c "def _guard_in_skill"` reads 0 in all seven. Phase 008's lane has replaced the sentence in its own worktree. This baseline records the claim as it stands here, so the handoff is on the record rather than assumed.
