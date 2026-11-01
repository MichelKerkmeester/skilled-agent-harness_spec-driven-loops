# post-save-quality-review on OpenCode

- CLI: OpenCode
- Model: llmgateway/deepseek-v4.1-flash-1017#max
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/post-save-quality-review.md
- Exact prompt: `Validate post-save quality review issue detection and remediation guidance.`
- Verdict: **FAIL**

## Result

The save exited 0 and printed a `POST-SAVE QUALITY REVIEW` line, but its status is `SKIPPED`, not the expected `PASSED`, and the block carries no per-field result. The quoted reason is `savedFilePath is a directory (phase-parent or unspecified target): /private/.../specs/demo/001-demo`, so the review never inspects the packet and can never report `issues: 0` from field comparison. A supplementary `--full-auto` save in the same scratch repository produced the same `-- SKIPPED` line, and `POST-SAVE QUALITY REVIEW -- PASSED` appears zero times in either log. Because every as-written command targets a packet folder, the scenario's expected status is unreachable at its documented save target.

## Evidence

```text
Scratch repository F=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/zRIoMN
Built as scenario 3 step 1, with specs/demo/001-demo as the spec folder.

Command 1, payload:
{"sessionSummary":"Verify post-save quality review on the canonical save path","triggerPhrases":["post-save review","quality gate"],"keyDecisions":["Chose amber for the status badge","Chose the canonical save path"],"importanceTier":"important","contextType":"implementation"}

Command 2:
$ (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" --json "$J" specs/demo/001-demo)
exit=0

Command 3-4, locate the REVIEW block:
$ grep -n "POST-SAVE QUALITY REVIEW" "$L"
55:{"timestamp":"2026-11-01T13:33:57.288Z","level":"info","message":"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/zRIoMN/specs/demo/001-demo"}

Command 5, assert status PASSED and 0 issues:
Observed status: SKIPPED (expected PASSED). No PASSED string and no rendered field comparison exist.

Supplementary full-auto save:
$ ... generate-context.js --project-root "$F" --full-auto --json "$J" specs/demo/001-demo
exit=0
55:{"timestamp":"2026-11-01T13:33:59.906Z","level":"info","message":"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory ..."}
$ grep -c "POST-SAVE QUALITY REVIEW -- PASSED" "$L"
0
(grep exit 1 for zero matches)
```
