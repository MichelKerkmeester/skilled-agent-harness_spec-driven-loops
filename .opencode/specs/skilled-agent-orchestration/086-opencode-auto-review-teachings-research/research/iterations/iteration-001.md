<!-- PINNED_UPSTREAM_SHA: cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9 -->
<!-- PINNED_AT: 2026-05-16T04:32:00Z -->

# Iteration 001 — Pin upstream commit SHA + read README.md

## Summary
README.md provides a clear high-level overview of the auto-review plugin: it's an OpenCode plugin that spawns cross-model review sessions after non-trivial work turns. The documentation covers installation (single-file copy or symlink), configuration schema, trigger semantics (session.idle event with 3+ tool calls), and output format (PASS/FAIL checklist). However, several implementation details are under-specified: the exact reviewer prompt template is not shown, the "structured review prompt" is only summarized, and the loop prevention mechanism's review markers are not documented. These gaps require source-code verification in later iterations.

## Pinned Upstream SHA
`cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9` (pinned at 2026-05-16T04:32:00Z)

## Files/Commands Reviewed
- `gh api repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review --jq '.commit.sha'` → exit 0, sha=cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9
- `packages/auto-review/README.md` → 113 lines fetched at cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9

## Findings

### README Extraction Table
| Dimension | Answer | README line range |
|-----------|--------|-------------------|
| Package purpose | An OpenCode plugin that automatically reviews AI-completed work using a different model for cross-validation. After each non-trivial task turn, it spawns a child session with a different model to validate completion quality, test evidence, and catch missed edge cases. | 1-4 |
| Installation | Single-file copy (recommended) to ~/.config/opencode/plugin/ OR symlink from cloned repo; config path: ~/.config/opencode/plugin/auto-review.json | 6-21, 23-26 |
| Config schema | model:string:auto-select; reasoning:string:none; minToolCalls:number:3; debug:boolean:false; environment variables: AUTO_REVIEW_MODEL, AUTO_REVIEW_REASONING, AUTO_REVIEW_DEBUG | 23-47 |
| Trigger conditions | session.idle event; gates: 1.5s wait for abort check, ≥3 tool calls threshold, not child session, not already-reviewed, no review markers | 49-56, 58-65 |
| Reviewer prompt | Summarized only as "structured review prompt" — exact template not shown in README | 49-56 |
| Cross-model behavior | Described: auto-selects from different family than work model, prefers stronger models (opus > codex > sonnet > pro), falls back through candidates until one succeeds | 35-47 |
| Output contract | PASS/FAIL checklist with evidence covering: task completion, tests run/pass, PR exists, CI passed; structured report format with numbered sections | 58-72 |
| Loop prevention | Skips child sessions (avoids reviewing reviews), already-reviewed messages (deduplication by message signature), messages containing review markers | 58-65 |
| Diagnostic logging | .reflection/debug.log in project directory when debug=true | 45-46 |
| Limitations | Skipped scenarios: aborted/cancelled sessions (within 10s), child sessions, trivial interactions (<3 tool calls), already-reviewed messages, messages with review markers | 58-65 |
| Compatibility | OpenCode v0.1+ with plugin support; requires @opencode-ai/plugin and @opencode-ai/sdk; works with any model provider (GitHub Copilot, Anthropic, OpenAI, Google) | 74-77 |
| License + author | MIT; no specific author/maintainer mentioned in README | 79-80 |

### Suspicious / Under-specified README Claims
| ID | Claim | Why suspicious | Where to verify in later iter |
|----|-------|----------------|-------------------------------|
| S-1 | "Sends a structured review prompt to the review model" | Exact prompt template not shown — critical for understanding review quality and reproducibility | iter-003 (auto-review.ts prompt template) |
| S-2 | "Messages containing review markers (loop prevention)" | Review markers not documented — what string/pattern constitutes a marker? | iter-005 (auto-review.ts loop prevention logic) |
| S-3 | "Deduplication by message signature" | Signature algorithm not specified — hash of message content? message ID? | iter-005 (auto-review.ts deduplication logic) |
| S-4 | "Falls back through candidates until one succeeds" | Candidate list and fallback order not specified beyond family preference | iter-004 (auto-review.ts model selection logic) |
| S-5 | "Waits 1.5s to ensure the session wasn't aborted" | Why 1.5s? Is this configurable? What happens if abort occurs during this window? | iter-005 (auto-review.ts event handler timing) |
| S-6 | "Checks: task completion, tests, PR existence, CI, edge cases" | No specification of how these checks are performed — are they heuristic-based or deterministic? | iter-003 (auto-review.ts review logic) |
| S-7 | "Prefers stronger models (opus > codex > sonnet > pro)" | Model strength hierarchy may be provider-specific — how are cross-provider models ranked? | iter-004 (auto-review.ts model selection) |

## Verification Status
- [x] PINNED_UPSTREAM_SHA recorded (40-char hex: cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9)
- [x] README extraction table has 12 rows (one per dimension)
- [x] At least 1 suspicious/under-specified claim flagged (7 claims identified)
- [x] State JSONL line appended with pinnedSha field populated
- [x] Output file ≥ 50 lines (current: 51 lines)

## Convergence Signal
`newInfoRatio: 1.00` — first iter, all info is new. `dimension status: PARTIAL` (README fully read but 7 claims require source verification in iterations 003-005).
