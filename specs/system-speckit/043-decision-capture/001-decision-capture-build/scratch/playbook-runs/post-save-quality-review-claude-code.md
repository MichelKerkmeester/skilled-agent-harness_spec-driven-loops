# post-save-quality-review on Claude Code

- CLI: Claude Code, native (this orchestrator session). cli-claude-code refuses self-invocation because CLAUDECODE=1 is set, and its contract routes a Claude Code run to native execution.
- Model: claude-opus-5-5
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/post-save-quality-review.md
- Exact prompt: `Validate post-save quality review issue detection and remediation guidance.`
- Verdict: **FAIL**

## Result

Expected "POST-SAVE QUALITY REVIEW -- PASSED" with 0 issues; the review always skips for a packet save. 042 did not touch the savedFilePath line (workflow.ts:2155) or post-save-review.ts (last changed b88e91451eb).

## Evidence

```text
Scratch fixture repo; payload with sessionSummary, triggerPhrases, 2 keyDecisions, importanceTier important, contextType implementation.
Plan-only save: exit 0, "POST-SAVE QUALITY REVIEW -- SKIPPED", skipReason "savedFilePath is a directory (phase-parent or unspecified target)".
--full-auto save: exit 0, same SKIPPED line.
Passing a file path instead of the folder: exit 1 with the usage text.
```
