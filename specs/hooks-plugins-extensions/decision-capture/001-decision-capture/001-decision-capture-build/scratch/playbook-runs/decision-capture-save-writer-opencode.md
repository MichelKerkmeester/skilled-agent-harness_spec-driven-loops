# decision-capture-save-writer on OpenCode

- CLI: OpenCode
- Model: llmgateway/deepseek-v4.1-flash-1017#max
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md
- Exact prompt: `Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.`
- Verdict: **PASS**

## Result

Plan-only exited 0, logged `Operator decisions proposed` once and left `decision-record.md` byte-identical to the pre-save copy. The first `--full-auto` save exited 0, logged `Wrote 1 operator decision` and its diff added only the `| Q008 | Use amber for the status badge. |` row plus the `### Q008` appendix item, whose fenced blocks carry `Which colour should the status badge use?`, `Amber`, `Red` and `Amber`, with `<!-- source: claude:fixture-session:toolu_fixture:0 -->`. The second `--full-auto` save exited 0, `cmp` reported `BYTE_IDENTICAL` and the `| Q008 |` count stayed 1, and `consumed.jsonl` resolved inside the scratch repository. One deviation from the Expected text: step 5's `git status --short` printed two untracked scratch paths, `scratch/playbook-runs/` and `scratch/runs/playbook/`, neither written by the save. Both predate this run at 14:24 local, the second holds this session's own stdout log, and `git status --untracked-files=no` plus `git diff --stat` for the packet are both empty, so the save wrote nothing in the real repository and the verdict is PASS on the scenario's substantive criteria. Unrequested finding: `consumed.jsonl` holds two lines for the same source key after the two saves, one per save, even though the second save changed no byte of the record.

## Evidence

```text
Scratch repository F=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/hf2YsI
Step 1 built specs/demo/001-demo from a copy of 042-decision-capture, removed scratch/, symlinked .skilled/skills/system-spec-kit, ran git -C "$F" init -q, and saved before.md. setup-exit=0.

Step 2, plan-only:
$ SAVE > "$F/plan.log" 2>&1; echo "exit=$?"; grep -c "Operator decisions proposed" "$F/plan.log"; cmp "$F/before.md" "$F/specs/demo/001-demo/decision-record.md" && echo UNCHANGED
exit=0
1
UNCHANGED
plan.log: "Operator decisions proposed (written only by a --full-auto save):"
plan.log: "POST-SAVE QUALITY REVIEW -- SKIPPED" skipReason "savedFilePath is a directory (phase-parent or unspecified target)"

Step 3, first full-auto:
$ SAVE --full-auto > "$F/save1.log" 2>&1; echo "exit=$?"; grep -c "Wrote 1 operator decision" "$F/save1.log"; diff "$F/before.md" "$F/specs/demo/001-demo/decision-record.md"; cp ... "$F/after1.md"
exit=0
1
257a258
> | Q008 | Use amber for the status badge. | Amber reads as a warning without implying failure. | None | spec.md REQ-001 |
310a312,325
> 
> ### Q008
> <!-- source: claude:fixture-session:toolu_fixture:0 -->
> 
> Question:
> ```text
> Which colour should the status badge use?
> ```
> 
> Options:
> ```text
> Amber
> Red
> ```
311a327,331
> Answer:
> ```text
> Amber
> ```
> 

Step 4, second full-auto:
$ SAVE --full-auto > "$F/save2.log" 2>&1; echo "exit=$?"; cmp "$F/after1.md" "$F/specs/demo/001-demo/decision-record.md" && echo BYTE_IDENTICAL; grep -c "| Q008 |" "$F/specs/demo/001-demo/decision-record.md"
exit=0
BYTE_IDENTICAL
1

Step 5:
$ ls "$F/.skilled/skills/.state/decision-capture/consumed.jsonl" && git -C "$R" status --short specs/system-speckit/042-decision-capture
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/hf2YsI/.skilled/skills/.state/decision-capture/consumed.jsonl
?? specs/system-speckit/042-decision-capture/scratch/playbook-runs/
?? specs/system-speckit/042-decision-capture/scratch/runs/playbook/
step5-exit=0

Attribution checks for that deviation:
$ ls -laT specs/system-speckit/042-decision-capture/scratch/playbook-runs/
... 14:24:02 ... decision-capture-claude-hook-claude-code.md (six claude-code result files)
$ ls -laT specs/system-speckit/042-decision-capture/scratch/runs/playbook/
... 14:33:09 ... opencode.stdout.log   (this session's own stdout)
$ git status --short --untracked-files=no specs/system-speckit/042-decision-capture
(no output, exit=0)
$ git diff --stat specs/system-speckit/042-decision-capture
(no output, exit=0)

consumed.jsonl after both saves:
       2 .../hf2YsI/.skilled/skills/.state/decision-capture/consumed.jsonl
{"key":"claude:fixture-session:toolu_fixture:0","packet":"specs/demo/001-demo","id":"Q008","at":"2026-11-01T13:33:04.235Z"}
{"key":"claude:fixture-session:toolu_fixture:0","packet":"specs/demo/001-demo","id":"Q008","at":"2026-11-01T13:33:07.264Z"}
```
