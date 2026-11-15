# Iteration 001 - Correctness + Security over the code commits

## Dispatcher
- Lineage: opus-medium (fan-out), session fanout-opus-medium-1794748073879-re9m5r, executor cli-claude-code claude-opus-5-5 (inline, no nested dispatch).
- Dimension: correctness, security (traceability touched where the code contradicted phase docs).
- Review focus coverage: inspected with `git show` the code parts of 198162c7f11, 7973b80ab0b, 50c5472789e, de26d18cbdf, 8cd3fa79da9 (Vibe file) and 4cb3db7a787; read the unlisted files `.skilled/hooks/shared/session-readers/claude.mjs` and `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`; read the v4.0.2.1 changelog section added in 967a825df3a. steer.md: not present.

## Files Reviewed
- .skilled/hooks/session-handover/bin/history-lookup.mjs:1-34
- .skilled/hooks/session-handover/lib/relaunch-core.cjs:685-700, 798-812, 854-995
- .skilled/hooks/session-handover/bin/session-handover.cjs:600-608, 709-725
- .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:20, 82-143
- .skilled/skills/system-spec-kit/runtime/hooks/lib/history/history.ts:327-336
- .skilled/skills/system-spec-kit/runtime/hooks/lib/history/locator-digest.ts:65-95
- .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:228-241, 304-307, 470-473
- .skilled/hooks/shared/session-readers/claude.mjs:139-175
- .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs (whole file after 8cd3fa79da9)
- .skilled/commands/speckit/handoff.md:218-230
- .skilled/changelog/skilled/v4.0.2.1.md (section "A Claimed Note Offers the Sender's History")
- specs/.../spec.md, 003/spec.md, 004/spec.md, 004/tasks.md, 004/implementation-summary.md, 005/spec.md, 005/plan.md

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **Compaction offer removed on five runtimes whose senders the claim path cannot serve, and phase 005 claims a mitigation that does not exist** -- .skilled/hooks/session-handover/lib/relaunch-core.cjs:910-915 -- `mintHandoverLocator` resolves a transcript only for `claude` and `codex` and returns null for every other runtime, so `handoverLookupSection` returns null for Pi, Devin, DSH, Vibe and OpenCode senders. Commit 8cd3fa79da9 removed the only lookup offer those five runtimes had. Phase 005 `plan.md:123` and `spec.md` risk row state "Phase 004's claim tests own the offer that reaches OpenCode", but no OpenCode claim can produce a section. The parent `spec.md` Purpose ("A session that claims a handoff can look up the sending session's earlier turns") and Out of Scope list do not limit the feature to Claude Code and Codex; only 004 `implementation-summary.md:102` and the changelog ("Claude Code and Codex senders get the section", **Breaking**) disclose it.
   Finding class: spec-code drift with capability regression
   Scope proof: relaunch-core.cjs and 005 docs are in commits 7973b80ab0b/50c5472789e/8cd3fa79da9 named by the review focus.
   Affected surface hints: relaunch-core.cjs mintHandoverLocator; 005-deprecate-compaction-offer/spec.md risks; 005/plan.md section 5; parent spec.md scope.
   Case: a Pi or OpenCode session hands over, the receiver claims the note, and no `## History Lookup` section is printed, while before 8cd3fa79da9 a compacted Pi/OpenCode session was offered it.
```json
{"type":"claim-adjudication","claim":"Five runtimes lost the lookup offer with no replacement and phase 005 docs claim the claim path covers OpenCode","evidenceRefs":[".skilled/hooks/session-handover/lib/relaunch-core.cjs:910-915","specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer/plan.md:123","specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/004-offer-lookup-at-claim/implementation-summary.md:102"],"counterevidenceSought":"Looked for a non-claude/codex transcript resolver in relaunch-core.cjs and for a parent-spec out-of-scope line limiting runtimes; found neither. Changelog does disclose the breaking change.","alternativeExplanation":"The operator may have knowingly accepted the regression (changelog marks it Breaking), making this a doc-only drift.","finalSeverity":"P1","confidence":0.75,"downgradeTrigger":"Operator confirms the five-runtime loss was an accepted decision and phase 005 docs are corrected; then P2 traceability."}
```

### P2 Findings
2. **Claim mints and persists a locator before checking that the receiver can use it** -- .skilled/hooks/session-handover/lib/relaunch-core.cjs:983-988 -- `handoverLookupSection` calls `mintHandoverLocator` with the note's `cwd`, which `chdir`s into that workspace and writes the sender's hook-state file (locator-digest.ts:79-95), and only then checks `sameCheckout`. A note whose `cwd` names another checkout still rewrites state for that session and the result is discarded. Note frontmatter is the trust input here.
   Finding class: ordering / side effect before guard
   Scope proof: function added in 50c5472789e.
   Affected surface hints: relaunch-core.cjs handoverLookupSection.
   Case: a receiver in checkout A claims a note whose `cwd` is checkout B; the sender's `historyLocator` is rewritten with a fresh `mintedAt` even though no section is printed.
3. **The prepare-time mint is never read by the claim path** -- .skilled/hooks/session-handover/bin/session-handover.cjs:603-607 -- claim re-mints from the transcript unconditionally (relaunch-core.cjs:983) and never reads the locator stored at prepare, so the 7973b80ab0b mint is a write with no consumer on this path; it also makes 004 SC-003 ("A claim that finds no stored locator ... prints ... no section") false, since a claim with no stored locator still prints a section when the transcript exists.
   Finding class: dead write / spec drift
   Scope proof: commits 7973b80ab0b and 50c5472789e.
   Affected surface hints: session-handover.cjs prepare; 004/spec.md SC-003; 003 purpose.
   Case: a note prepared before 7973b80ab0b (no stored locator) is claimed; the section is printed, contradicting SC-003.
4. **Tasks T005 and T006 checked done for a re-stamp helper and test that were never built** -- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/004-offer-lookup-at-claim/tasks.md:47-48 -- implementation-summary.md:80 says the re-stamp helper "was not needed", and `relaunch-core.test.cjs` has no re-stamp case (grep for re-stamp/three hours finds only unrelated arm tests at relaunch-core.test.cjs:620).
   Finding class: checklist evidence drift
   Scope proof: 004 docs changed in 50c5472789e.
   Affected surface hints: 004/tasks.md T005, T006.
   Case: a reader trusting tasks.md looks for the re-stamp helper and the three-hour test and finds neither.

## Traceability Checks
- spec_code: partial -- claim/prepare behaviour matches 004 REQ-001/REQ-004; SC-003 and the runtime scope disagree with code (findings 1, 3).
- checklist_evidence: partial -- 004 T005/T006 checked without artifacts (finding 4).

## Integration Evidence
- Command: `.skilled/commands/speckit/handoff.md:221` receiver step 3 matches the printed `## History Lookup` heading.
- Lookup entry `.skilled/hooks/session-handover/bin/history-lookup.mjs` imports `runtime/dist/hooks/lib/history/cli.js`; `lookupRunsFrom` gates on both paths (lookup-offer.ts:97-101).

## Edge Cases
- claude.mjs merge: consecutive assistant lines share `message.id`; a user record resets the open id; a skipped sidechain/meta line does not reset it, which is correct because it is not a turn boundary. Merged record keeps the first line's id and timestamp.
- sessionId from note frontmatter is regex-checked (`^[A-Za-z0-9._-]+$`) in both transcript resolvers, so no path traversal.

## Confirmed-Clean Surfaces
- history-lookup.mjs: import failure maps to the CLI's refusal shape, exit 2.
- history.ts LOOKUP_CLI_RUN regex accepts both old and new paths, needs `node` before the path.
- vibe/compaction-context.mjs: removal is clean; `transcriptPath` is still used by `readSession` and `measureJournal`, no orphan import left.
- 4cb3db7a787: comment-only.

## Ruled Out
- Path traversal through note `session_id` (regex guard).
- Hook-state collision across workspaces: state file keyed by sha256(sessionId), so prepare and claim write the same file.

## Next Focus
- Dimension: traceability + maintainability.
- Focus area: f320d9d9bcd docs (feature catalog, playbook pages, READMEs, injection-contract), compaction-adapters.vitest.ts, the changelog section accuracy, and cede6d301ab/70c47ad5e00 sub-track move metadata.
- Reason: code dimensions covered; doc commits and the unlisted test file remain.
- Required evidence: file:line in docs and the test file.

Review verdict: CONDITIONAL
