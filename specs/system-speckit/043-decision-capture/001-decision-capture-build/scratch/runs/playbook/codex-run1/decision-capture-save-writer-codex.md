# 144 -- Decision capture save writer on Codex CLI
- CLI: Codex CLI
- Model: gpt-6-luna, model_reasoning_effort xhigh, service_tier fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md
- Exact prompt: Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.
- Verdict: **FAIL**
## Result
No expected save-writer signals were observed because the scratch-repository setup did not start. The command runner rejected the required `rm -rf` line before launching the shell, so the plan-only save, first full-auto save, idempotence check and consumed-log check were not run.
## Evidence
```text
1. Scenario step 1 setup command submitted to the runner:
   R="$PWD"; F="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/XXXXXX")"
   mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
   cp -R specs/system-speckit/042-decision-capture "$F/specs/demo/001-demo"
   rm -rf "$F/specs/demo/001-demo/scratch"
   ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
   git -C "$F" init -q
   cp "$F/specs/demo/001-demo/decision-record.md" "$F/before.md"
   J='{"sessionSummary":"Record the badge colour decision","triggerPhrases":["badge colour decision"],"operatorDecisions":[{"sourceKey":"claude:fixture-session:toolu_fixture:0","decided":"Use amber for the status badge.","why":"Amber reads as a warning without implying failure.","carriedBy":"spec.md REQ-001","question":"Which colour should the status badge use?","options":["Amber","Red"],"answer":"Amber"}]}'
   SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }
   Tool response before shell launch: "rm -f style commands are not permitted. Use a safer approach"
   Process exit status: unavailable; exec_command rejected the command before a child process started.

2. Not run: SAVE > "$F/plan.log" 2>&1; echo "exit=$?"; grep -c "Operator decisions proposed" "$F/plan.log"; cmp "$F/before.md" "$F/specs/demo/001-demo/decision-record.md" && echo UNCHANGED
3. Not run: SAVE --full-auto > "$F/save1.log" 2>&1; echo "exit=$?"; grep -c "Wrote 1 operator decision" "$F/save1.log"; diff "$F/before.md" "$F/specs/demo/001-demo/decision-record.md"; cp "$F/specs/demo/001-demo/decision-record.md" "$F/after1.md"
4. Not run: SAVE --full-auto > "$F/save2.log" 2>&1; echo "exit=$?"; cmp "$F/after1.md" "$F/specs/demo/001-demo/decision-record.md" && echo BYTE_IDENTICAL; grep -c "| Q008 |" "$F/specs/demo/001-demo/decision-record.md"
5. Not run: ls "$F/.skilled/skills/.state/decision-capture/consumed.jsonl" && git -C "$R" status --short specs/system-speckit/042-decision-capture
   No output or exit status, because the scratch repository was not created.
```
