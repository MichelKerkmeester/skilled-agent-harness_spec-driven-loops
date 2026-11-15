# decision-capture-save-writer on Pi
- CLI: Pi
- Model: openai/gpt-6-luna, --thinking xhigh, --fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md
- Exact prompt: `Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.`
- Verdict: **FAIL**
## Result
The plan-only save exited `0`, logged one `Operator decisions proposed` match and left the decision record `UNCHANGED`; both full-auto saves exited `0`, the first logged one write and added the expected Q008 row and verbatim appendix, the second printed `BYTE_IDENTICAL` and the Q008 count was `1`, and the consumed log was in the scratch repository. The required real-repository status was not empty: it reported untracked `scratch/playbook-runs/` and `scratch/runs/playbook/`, so the scenario's every-signal pass condition was not met.
## Evidence
```text
Scratch repository setup commands:
R="$PWD"; F="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/XXXXXX")"
Exit status: 0
Output:
SETUP_ROOT_EXIT_STATUS=0

mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
Exit status: 0
Output:
MKDIR_EXIT_STATUS=0

cp -R specs/system-speckit/042-decision-capture "$F/specs/demo/001-demo"
Exit status: 0
Output:
COPY_PACKET_EXIT_STATUS=0

rm -rf "$F/specs/demo/001-demo/scratch"
Exit status: 0
Output:
REMOVE_COPIED_SCRATCH_EXIT_STATUS=0

ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
Exit status: 0
Output:
SYMLINK_EXIT_STATUS=0

git -C "$F" init -q
Exit status: 0
Output:
GIT_INIT_EXIT_STATUS=0

cp "$F/specs/demo/001-demo/decision-record.md" "$F/before.md"
Exit status: 0
Output:
COPY_BASELINE_EXIT_STATUS=0

Payload and SAVE function from the scenario:
J='{"sessionSummary":"Record the badge colour decision","triggerPhrases":["badge colour decision"],"operatorDecisions":[{"sourceKey":"claude:fixture-session:toolu_fixture:0","decided":"Use amber for the status badge.","why":"Amber reads as a warning without implying failure.","carriedBy":"spec.md REQ-001","question":"Which colour should the status badge use?","options":["Amber","Red"],"answer":"Amber"}]}'
SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }
Output:
SCRATCH_REPO=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/DyyA34
PAYLOAD_READY

Plan-only save command:
SAVE > "$F/plan.log" 2>&1; echo "exit=$?"; grep -c "Operator decisions proposed" "$F/plan.log"; cmp "$F/before.md" "$F/specs/demo/001-demo/decision-record.md" && echo UNCHANGED
Exit status: 0 for the save, grep and cmp checks
Output:
exit=0
1
PLAN_LOG_GREP_EXIT_STATUS=0
UNCHANGED
PLAN_RECORD_CMP_EXIT_STATUS=0

First full-auto save command:
SAVE --full-auto > "$F/save1.log" 2>&1; echo "exit=$?"; grep -c "Wrote 1 operator decision" "$F/save1.log"; diff "$F/before.md" "$F/specs/demo/001-demo/decision-record.md"; cp "$F/specs/demo/001-demo/decision-record.md" "$F/after1.md"
Exit status: 0 for the save, grep and copy; `diff` returned 1 because the expected changes were present
Output:
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
FIRST_DIFF_EXIT_STATUS=1
COPY_AFTER1_EXIT_STATUS=0

Second full-auto save command:
SAVE --full-auto > "$F/save2.log" 2>&1; echo "exit=$?"; cmp "$F/after1.md" "$F/specs/demo/001-demo/decision-record.md" && echo BYTE_IDENTICAL; grep -c "| Q008 |" "$F/specs/demo/001-demo/decision-record.md"
Exit status: 0 for the save, cmp and grep
Output:
exit=0
BYTE_IDENTICAL
SECOND_CMP_EXIT_STATUS=0
1
Q008_COUNT_GREP_EXIT_STATUS=0

Final check commands:
ls "$F/.skilled/skills/.state/decision-capture/consumed.jsonl"
Exit status: 0
Output:
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/DyyA34/.skilled/skills/.state/decision-capture/consumed.jsonl

git -C "$R" status --short specs/system-speckit/042-decision-capture
Exit status: 0
Output:
?? specs/system-speckit/042-decision-capture/scratch/playbook-runs/
?? specs/system-speckit/042-decision-capture/scratch/runs/playbook/
The temporary repository remains at /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/DyyA34. The final `rm -rf "$F"` cleanup was not run.
```
