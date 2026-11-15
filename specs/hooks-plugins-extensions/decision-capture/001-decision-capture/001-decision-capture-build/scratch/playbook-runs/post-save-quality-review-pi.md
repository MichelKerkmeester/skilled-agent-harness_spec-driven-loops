# post-save-quality-review on Pi
- CLI: Pi
- Model: openai/gpt-6-luna, --thinking xhigh, --fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/post-save-quality-review.md
- Exact prompt: `Validate post-save quality review issue detection and remediation guidance.`
- Verdict: **FAIL**
## Result
The full-payload save exited `0` but emitted `POST-SAVE QUALITY REVIEW -- SKIPPED`, not the expected PASSED review with zero issues. The generic-title saves exited `1` with `INSUFFICIENT_CONTEXT_ABORT` before review output; the path-fragment and importance-mismatch saves exited `0` but also skipped review, and the invalid review signals, score penalty and actionable fix instructions were absent. No newly rendered record was available to patch, so the patch step could not be performed. Expected signals were missing.
## Evidence
```text
Scratch setup commands followed the scenario-3 setup pattern:
R="$PWD"; F="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/XXXXXX")"
mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
cp -R specs/system-speckit/042-decision-capture "$F/specs/demo/001-demo"
rm -rf "$F/specs/demo/001-demo/scratch"
ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
git -C "$F" init -q
cp "$F/specs/demo/001-demo/decision-record.md" "$F/before.md"
Exit status: 0 for all seven setup commands
Scratch repository: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/WtlBFN

Save wrapper used for every scenario payload:
SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }

Full-payload baseline command: SAVE
Payload: sessionSummary="Automatic operator decision capture post-save quality review", triggerPhrases=["operator decision capture","post-save quality review"], keyDecisions=["Decision A","Decision B"], importanceTier="important", contextType="implementation".
Exit status: 0
Output:
"passedThrough":["processed_fields:18"]
"Found 2 decisions"
"Legacy memory artifact write skipped.\n"
"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/WtlBFN/specs/demo/001-demo"

Generic-title case: SAVE > "$F/generic-title.log" 2>&1
Payload: sessionSummary="Next Steps", with user_prompts and recent_context referring to operator decision capture.
Exit status: 1
Output:
ALIGNMENT_HARD_BLOCK: 0% alignment is below minimum non-interactive threshold (20%)
Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. No primary evidence was captured for this memory. Fewer than two spec-relevant evidence items were captured. Semantic substance is too low (36 chars, 4 unique words). Evidence counts: primary=0, support=1, total=1, semanticChars=36, uniqueWords=4.
No `[HIGH]` review issue or `sessionSummary` fix instruction was emitted.

Path-trigger case: SAVE > "$F/path-trigger.log" 2>&1
Payload: triggerPhrases=["auth refactor"], with recent_context containing `runtime/cli/core/workflow.ts` and `src/auth.ts`.
Exit status: 0
Output:
"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/WtlBFN/specs/demo/001-demo"

Importance-mismatch simulation: SAVE > "$F/importance-mismatch.log" 2>&1
Payload: importanceTier="important" and importance_tier="normal".
Exit status: 0
Output:
"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/WtlBFN/specs/demo/001-demo"
The pre-existing scratch frontmatter read showed `6:importance_tier: "normal"`; the save did not emit a `[MEDIUM]` issue or expected-versus-actual values.

Decision-count case: SAVE > "$F/decision-count-mismatch.log" 2>&1
Payload: keyDecisions=["Decision A","Decision B"].
Exit status: 0
Output:
"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/WtlBFN/specs/demo/001-demo"
No `[MEDIUM]` decision-count issue was present.

AI-fix case: SAVE > "$F/ai-fix-high-issue.log" 2>&1
Payload: generic sessionSummary="Next Steps" with decision-capture user_prompts and recent_context.
Exit status: 1
Output:
Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. No primary evidence was captured for this memory. Evidence counts: primary=0, support=2, total=2, semanticChars=462, uniqueWords=23.
`grep -nE 'POST-SAVE QUALITY REVIEW|\[HIGH\]|fix instruction' "$F/ai-fix-high-issue.log"` exited 1 with no output. The copied target still showed `title: "Implementation Summary"`, `trigger_phrases:`, `importance_tier: "normal"` and `contextType: "general"`. No emitted fix instruction or rendered payload field existed, so there was no scenario patch to apply.

Score-penalty case: SAVE > "$F/score-penalty.log" 2>&1
Payload: generic sessionSummary="Next Steps" with decision-capture user_prompts and recent_context.
Exit status: 1
Output:
Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. No primary evidence was captured for this memory. Evidence counts: primary=0, support=2, total=2, semanticChars=505, uniqueWords=24.
`grep -n 'Post-save review: quality_score penalty' "$F/score-penalty.log"` exited 1 with no output.

The expected `POST-SAVE QUALITY REVIEW -- PASSED`, `[HIGH]` and `[MEDIUM]` issues, actionable fix instructions and negative penalty line were not observed. The scratch repository and logs remain under /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/WtlBFN.
```
