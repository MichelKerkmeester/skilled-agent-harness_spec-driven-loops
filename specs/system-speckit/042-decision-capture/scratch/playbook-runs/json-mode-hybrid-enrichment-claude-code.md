# json-mode-hybrid-enrichment on Claude Code

- CLI: Claude Code, native (this orchestrator session). cli-claude-code refuses self-invocation because CLAUDECODE=1 is set, and its contract routes a Claude Code run to native execution.
- Model: claude-opus-5-5
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/json-mode-hybrid-enrichment.md
- Exact prompt: `Validate JSON mode structured summary hardening against toolCalls and report cited pass/fail evidence.`
- Verdict: **FAIL**

## Result

The expected signals ("structured fields preserved in rendered output", decision confidence, git_changed_file_count) are not observable: the save no longer renders a memory file. The scenario contract is stale against the current save path; this commit did not cause it.

## Evidence

```text
Scratch fixture repo (specs/demo/001-demo, a copy of the 042 packet); payload with toolCalls, exchanges, user_prompts, trigger_phrases, keyDecisions, filesModified; --full-auto save exit 0.
The save rewrote only implementation-summary.md (continuity fingerprint), description.json and graph-metadata.json. No rendered .md carries the toolCalls or exchanges, and no decision-confidence or git_changed_file_count field exists to compare.
```
