# 144 -- Decision capture save writer on Codex CLI
- CLI: Codex CLI
- Model: gpt-6-luna, model_reasoning_effort xhigh, service_tier fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md
- Exact prompt: Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.
- Verdict: **PASS**
## Result
PASS. The plan-only save exited 0, reported one proposed decision and left decision-record.md unchanged. The first full-auto save exited 0 and added exactly the Q008 row and appendix item with the supplied question, Amber/Red options and Amber answer. The second full-auto save exited 0, reported BYTE_IDENTICAL and showed one Q008 row. The consumed log was under the temporary repository. The real-repository status showed only the two harness directories identified as pre-existing, while tracked-file status and diff-stat were empty.
## Evidence
~~~text
Step 1 setup from the repository root:
R="$PWD"; F="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/XXXXXX")"
mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
rsync -a --exclude scratch specs/system-speckit/042-decision-capture/ "$F/specs/demo/001-demo/"
ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
git -C "$F" init -q
cp "$F/specs/demo/001-demo/decision-record.md" "$F/before.md"
J='{"sessionSummary":"Record the badge colour decision","triggerPhrases":["badge colour decision"],"operatorDecisions":[{"sourceKey":"claude:fixture-session:toolu_fixture:0","decided":"Use amber for the status badge.","why":"Amber reads as a warning without implying failure.","carriedBy":"spec.md REQ-001","question":"Which colour should the status badge use?","options":["Amber","Red"],"answer":"Amber"}]}'
SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }
Output: SCRATCH_REPO=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/ZSl8zu
Exit status: 0

Step 2:
SAVE > "$F/plan.log" 2>&1; echo "exit=$?"; grep -c "Operator decisions proposed" "$F/plan.log"; cmp "$F/before.md" "$F/specs/demo/001-demo/decision-record.md" && echo UNCHANGED
Output: exit=0; 1; UNCHANGED
Command exit status: 0

Step 3:
SAVE --full-auto > "$F/save1.log" 2>&1; echo "exit=$?"; grep -c "Wrote 1 operator decision" "$F/save1.log"; diff "$F/before.md" "$F/specs/demo/001-demo/decision-record.md"; cp "$F/specs/demo/001-demo/decision-record.md" "$F/after1.md"
Output: exit=0; 1
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
> 
311a327,331
> Answer:
> ```text
> Amber
> ```
Command exit status: 0

Step 4:
SAVE --full-auto > "$F/save2.log" 2>&1; echo "exit=$?"; cmp "$F/after1.md" "$F/specs/demo/001-demo/decision-record.md" && echo BYTE_IDENTICAL; grep -c "| Q008 |" "$F/specs/demo/001-demo/decision-record.md"
Output: exit=0; BYTE_IDENTICAL; 1
Command exit status: 0

Step 5, with cleanup omitted:
ls "$F/.skilled/skills/.state/decision-capture/consumed.jsonl" && git -C "$R" status --short specs/system-speckit/042-decision-capture
Output:
/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/ZSl8zu/.skilled/skills/.state/decision-capture/consumed.jsonl
?? specs/system-speckit/042-decision-capture/scratch/playbook-runs/
?? specs/system-speckit/042-decision-capture/scratch/runs/playbook/
Command exit status: 0

Supplementary checks:
R="$PWD"; git -C "$R" status --short --untracked-files=no specs/system-speckit/042-decision-capture
Output: no output
Exit status: 0
R="$PWD"; git -C "$R" diff --stat specs/system-speckit/042-decision-capture
Output: no output
Exit status: 0
~~~

