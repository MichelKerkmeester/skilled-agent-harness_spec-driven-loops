# 155 -- Post-save quality review on Codex CLI
- CLI: Codex CLI
- Model: gpt-6-luna, model_reasoning_effort xhigh, service_tier fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/post-save-quality-review.md
- Exact prompt: Validate post-save quality review issue detection and remediation guidance.
- Verdict: **FAIL**
## Result
FAIL. The fully populated clean payload exited 0 but produced POST-SAVE QUALITY REVIEW -- SKIPPED, with the target directory identified as the reason, so the expected PASSED/0 issues block did not appear. The generic-title and decision-count cases exited 1 with INSUFFICIENT_CONTEXT_ABORT. The trigger-phrase and importance-mismatch cases exited 0 but also skipped review. The AI-patch case had no emitted fix instructions or rendered record to patch, and the score-penalty line was absent.
## Evidence
~~~text
Scratch setup from the repository root:
R="$PWD"; F="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/XXXXXX")"
mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
rsync -a --exclude scratch specs/system-speckit/042-decision-capture/ "$F/specs/demo/001-demo/"
ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
git -C "$F" init -q
SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }
Output: SCRATCH_REPO=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/4Gi2cs
Exit status: 0

01 clean review payload:
{"sessionSummary":"Decision capture post-save quality review field propagation","triggerPhrases":["decision capture","post-save quality review"],"keyDecisions":["Preserve the supplied session summary","Keep importance and context values"],"importanceTier":"important","contextType":"implementation"}
SAVE --full-auto; SAVE exit 0.
Output: {"timestamp":"2026-11-01T14:25:14.701Z","level":"info","message":"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/4Gi2cs/specs/demo/001-demo"}.

02 generic title:
{"sessionSummary":"Next Steps","title":"Next Steps","triggerPhrases":["decision capture title quality"],"userPrompts":[{"prompt":"Check the generic title in the decision capture post-save quality review."}],"observations":[{"type":"decision","title":"Decision capture title validation","narrative":"This test checks whether a generic title is reported with actionable fix instructions."}]}
SAVE --full-auto; SAVE exit 1.
Output:
Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. Evidence counts: primary=2, support=3, total=5, semanticChars=791, uniqueWords=37.
Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. Evidence counts: primary=2, support=3, total=5, semanticChars=791, uniqueWords=37.
No [HIGH] title issue or fix instruction appeared.

03 path-fragment trigger:
{"sessionSummary":"Decision capture auth refactor trigger review","triggerPhrases":["auth refactor"],"recentContext":[{"request":"Inspect specs/system-speckit/archive/030-deep/auth/refactor.ts for decision capture context."}],"userPrompts":[{"prompt":"Validate decision capture trigger phrases."}]}
SAVE --full-auto; SAVE exit 0.
Output: {"timestamp":"2026-11-01T14:25:15.414Z","level":"info","message":"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/4Gi2cs/specs/demo/001-demo"}.
No [HIGH] trigger issue or fix instruction appeared.

04 importance mismatch:
{"sessionSummary":"Decision capture importance tier mismatch review","triggerPhrases":["decision capture importance tier"],"keyDecisions":["Preserve the payload importance tier","Detect pipeline overrides"],"importanceTier":"important","importance_tier":"normal","contextType":"implementation"}
SAVE --full-auto; SAVE exit 0.
Output: {"timestamp":"2026-11-01T14:25:15.796Z","level":"info","message":"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/4Gi2cs/specs/demo/001-demo"}.
No [MEDIUM] importance_tier issue or expected/actual values appeared.

05 decision count:
{"sessionSummary":"Decision capture decision count review","triggerPhrases":["decision capture decision count"],"keyDecisions":["Decision A","Decision B"],"decision_count":0}
SAVE --full-auto; SAVE exit 1.
Output:
Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. No primary evidence was captured for this memory. Evidence counts: primary=0, support=2, total=2, semanticChars=782, uniqueWords=28.
Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. No primary evidence was captured for this memory. Evidence counts: primary=0, support=2, total=2, semanticChars=782, uniqueWords=28.
No [MEDIUM] decision_count issue appeared.

06 AI fix instructions:
The generic-title save exited 1 with the same INSUFFICIENT_CONTEXT_ABORT; the log had no POST-SAVE QUALITY REVIEW, fix instruction or [HIGH] output. Search exit status: 0, no output.
The search for rendered Markdown under the copied packet scratch path returned no output, exit 0. Steps to read instructions, patch frontmatter, re-read and assert the patch were not run because neither instructions nor a rendered record existed.

07 score penalty:
The generic-title SAVE --full-auto output was:
Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. Evidence counts: primary=2, support=3, total=5, semanticChars=961, uniqueWords=40.
Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. Evidence counts: primary=2, support=3, total=5, semanticChars=961, uniqueWords=40.
The search for "Post-save review: quality_score penalty" returned no output, exit 0.
The expected negative penalty line was not observed.
The save command in each case expanded to:
(cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" --full-auto --json "$J" specs/demo/001-demo)
~~~

