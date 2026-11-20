# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: F-1-006 (follow-up fixes and answer routing), dimension `correctness`
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by reading the five test and routing follow-ups (86038dfba80, c74042fd559, 571575632a4, 5c91b2f3f5d, 0390556ee2b) and the ten `docs(specs)` commits that wrote the ended-session answers, which is the node's own scope.
- Sources read: `steer.md` (absent), `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git show 571575632a4`, `git show 0390556ee2b`, `git show 86038dfba80`, `git show c74042fd559`, `git diff 2f5fe41bb9e~1 aaaff7dd9df`, and the HEAD files cited below.

## Files Reviewed

- `.skilled/skills/sk-doc/hub-router.json:240-260`
- `.skilled/skills/sk-doc/sk-create-readme/SKILL.md:28`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json`
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:1070-1081`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:535`
- `.skilled/hooks/session-handover/pi/session-handover.test.ts:43-52`, `:368`
- `.skilled/hooks/session-handover/lib/nudge.cjs:36-45`
- `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:389-420`
- `specs/**/decision-record.md` (the ten docs commits, 260 files)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The widened hook assertion accepts variable names the hook does not use** -- `.opencode/plugins/tests/system-skill-advisor.test.cjs:1078` -- the assertion now matches `observeEmittedAdvisorPolicy\((?:effectiveEmitted|emitted|additionalContext)`, but the hook calls `observeEmittedAdvisorPolicy(additionalContext, ...)` (`hooks/claude/user-prompt-submit.ts:535`). Two of the three alternatives name values the hook never passes, so a regression that observed the pre-clamp `emitted` value instead of the emitted context would still satisfy the test. The commit's own purpose was to match the test to the current source, and the alternation goes past that.
   Finding class: maintainability
   Scope proof: `.opencode/plugins/tests/system-skill-advisor.test.cjs` is named in the review target and in frontier node F-1-006's scope.
   Affected surface hints: the Claude prompt-submit hook's emitted-policy observation, the plugin test suite.
   Case: a later edit changes the hook to `observeEmittedAdvisorPolicy(emitted, ...)`, observing the pre-clamp value; the test still passes because `emitted` is an accepted alternative.

## Traceability Checks

- `spec_code` -- pass -- the sk-doc change removes `security policy` from both `hub-router.json:251` and `sk-create-readme/SKILL.md:28`, which is the alignment the commit claims; `security.md` remains in the router's keyword list at `hub-router.json:254`.
- `checklist_evidence` -- partial -- the D3 claim (231 answers written once each) was checked against the diff: 227 rows were added, and the two source markers that appear three times each name all three packets in their `Carried by` column, so the sharing is documented rather than mis-mapped. The 231-versus-227 gap is recorded as an edge case, not a pass.

## Integration Evidence

- `.skilled/skills/sk-doc/hub-router.json:254` -- `security.md` survives the removal, so the route the commit message promises still exists.
- `.skilled/hooks/session-handover/lib/nudge.cjs:41-45` -- the source builds `CONTINUITY_WRITER_COMMAND` from `path.join(__dirname, '..', '..', '..', 'skills', ...)`, which resolves to the same absolute path the updated test computes from `import.meta.url`; the test change matches the source rather than restating it.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:392-418` -- the new guard asserts a non-empty `embeddingText` for every TypeScript bridge entry and a non-empty description for every skill, which is the precondition `embeddingCoverage` relies on.

## Edge Cases

- The ten docs commits add 227 `| Q0` rows, while the packet's decision D3 names 231 answers. Four answers are unaccounted for in the diff. The completion criterion allows an ended session to be skipped with a reason, so the gap is consistent with four skipped answers; it is recorded as an ambiguity rather than a finding because the orphan scan that would settle it was not run in this lineage.
- Two source markers (`toolu_01PipubZwrJFh4cdCyKbBRPG:0` and `toolu_017h44TRQsyvVXxEMTt3iM82:0`) appear in three decision records each. Both questions name Barter handover items 5, 6 and 7, and each record's `Carried by` column lists all three packets, so the duplication is a documented shared decision. Recorded as resolved, not a finding.
- The decision records embed `<!-- source: claude:<session-uuid>:toolu_...:N -->` provenance markers. A session UUID is an internal identifier, not personal data; no email address, home path, token or key value appears in the added lines.

## Confirmed-Clean Surfaces

- No personal data in the 227 added answer rows: a scan for email addresses, `/Users/` paths, key-shaped strings and the operator's name returned only env-var names and prose.
- The compiled sk-doc manifest hash was re-minted in both the live and the archived copy, and the two copies agree.
- `86038dfba80` and `c74042fd559` match the shipped defaults: the semantic lane weight is 0 and `/doctor:setup` is a tracked command, so neither test asserts a value the code does not produce.

## Ruled Out

- "Removing the bare security policy phrase breaks a route that should still reach sk-doc": ruled out -- no sk-doc mode owns that phrase, `security.md` still routes, and the commit's stated intent is to stop the over-match.
- "The session-handover test was loosened to match new text": ruled out -- the test now computes the same absolute path the source builds.
- "The 231 answers were mis-mapped into the wrong packets": ruled out for the two shared answers, whose records name all three packets.

## Next Focus

- Dimension: security
- Focus area: frontier node F-1-006, security pass over the routing vocabulary and the recorded answers
- Reason: correctness is complete for this node; the routing vocabulary and the committed answer text are the surfaces a security pass can still test
- Rotation status: F-1-006 has 1 of 4 dimensions covered
- Blocked/productive carry-forward: productive -- the diff-level duplicate scan and the source-versus-test comparison both produced evidence
- Required evidence: the router's keyword matching path, and whether any recorded answer carries a credential or a private path
- Recovery note: none

Review verdict: PASS
