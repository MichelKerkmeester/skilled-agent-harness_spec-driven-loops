---
title: "Iteration 1: Correctness — frontmatter boundary, render fallback, budget arithmetic"
trigger_phrases: []
---
# Iteration 1: Correctness — frontmatter boundary, render fallback, budget arithmetic

## Focus

The frontmatter-strip contract across every surface, the render fallback rule for pointer-less records, the two-tier durable budget and its promised set-time check, and the plugin's brief cache.

## Files Reviewed

- `.opencode/hooks/goal/lib/goal-slice.cjs` (full)
- `.opencode/hooks/goal/lib/goal-core.cjs` (constants, `clampText`, `renderGoalBrief`, `bindGoal`, `setGoal`)
- `.opencode/plugins/opencode-goal.js` (`GOAL_ACTIONS`, `setGoal`, `bindGoal`, `renderGoalInjection`, `readGoalForBrief`)
- `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17`
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1017-1076`
- `.opencode/skills/system-spec-kit/runtime/tests/spec-doc-structure.vitest.ts:314-354`
- `.opencode/hooks/goal/lib/goal-slice.test.cjs:66-70`
- `.opencode/hooks/goal/lib/goal-core.test.cjs:788-796`
- `.../002-decisions-and-contract-freeze/decision-record.md` (ADR-001, ADR-002, ADR-003, ADR-004, ADR-006)
- `.opencode/hooks/goal/README.md:37`

## Scorecard

- Dimensions covered: correctness (primary), maintainability (secondary)
- New findings: P0=0 P1=3 P2=1
- New findings ratio: 1.00

## Findings

### P0

- None.

### P1

- **F001**: Opening or closing fence with trailing whitespace leaks frontmatter into every goal surface — `.opencode/hooks/goal/lib/goal-slice.cjs:22` — `FRONTMATTER_PATTERN` requires `---\n` exactly while the validator boundary allows `---\s*\r?\n`; for a document whose opening fence is `--- ` the module returns `frontmatter: null` and `renderChatSlice()` returns the YAML block including `session_id: SECRET`, while the validator regex matches and extracts it as frontmatter. Observed through the shipped module with node; the golden parity test ADR-003 promises does not exist. [SOURCE: .opencode/hooks/goal/lib/goal-slice.cjs:22] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17]
- **F002**: Pointer-less records still inject their stored objective, contradicting ADR-001/ADR-002 and the hook README — `.opencode/hooks/goal/lib/goal-core.cjs:394` — `renderGoalBrief` seeds `objectiveSource` from `goal.objective` and only overrides it when a `packetPath` exists; the plugin does the same at `opencode-goal.js:2713-2720`. ADR-001 says "A missing pointer means the session is unbound: no injection, no fallback", ADR-002 says "a record without a pointer injects nothing until a bind", and `README.md:37` lists unbound as producing no block — yet `goal-core.test.cjs:824` and `goal-pi.test.mjs:227` pin the fallback, and the 004 phase summary records it as intended. [SOURCE: .../decision-record.md:73] [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:824]
- **F003**: ADR-006's set-time consumer length check is absent; over-budget objectives truncate silently — `.opencode/hooks/goal/lib/goal-core.cjs:1115` — `clampText` truncates with an ellipsis and no signal, `setGoal` sanitizes the objective at 4000 characters, and `bindGoal` does the same to `packet.objectiveSlice` (plugin mirrors both at `opencode-goal.js:1758,1820`). ADR-006 promises "a consumer-side length check at set time"; the only enforcement found is the TypeScript validator. [SOURCE: .../decision-record.md:560] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1041]

### P2

- **F004**: Plugin brief cache keys on state-file mtime:size, not the packet slice hash ADR-004 requires — `.opencode/plugins/opencode-goal.js:2790` — `readGoalForBrief` builds the cache key from the per-session state file and never consults the durable-slice hash, while ADR-004's constraints state "The plugin's brief cache must key on the hash". The render path re-resolves the packet each injection, so no stale packet text was observed; the deviation is the unmet constraint. [SOURCE: .../decision-record.md:349] [SOURCE: .opencode/plugins/opencode-goal.js:2790]

## Claim Adjudication

```json
{"findingId":"F001","claim":"A goal.md whose opening or closing fence carries trailing whitespace is not recognized as frontmatter by goal-slice.cjs, so the YAML block (including session_id and the continuity block) is returned by renderChatSlice and the durable/objective slices, while the validator's FRONTMATTER_RE treats the same bytes as frontmatter.","evidenceRefs":[".opencode/hooks/goal/lib/goal-slice.cjs:22",".opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17",".opencode/hooks/goal/lib/goal-slice.test.cjs:66-70"],"counterevidenceSought":"Ran the shipped module against a `--- `-opened document (observed frontmatter:null and the full YAML in chatSlice), compared with FRONTMATTER_RE on the same bytes (matched, frontmatter extracted), and grepped the test suite for a parity assertion on the two regexes (none).","alternativeExplanation":"The pattern could be considered deliberately strict for well-formed files only, but ADR-003 says the extractor splits frontmatter with the validator's own regex and that frontmatter cannot leak from any surface, so strictness is the defect, not an exemption.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if the extractor is amended to the validator boundary or a documented input-normalization step strips fence whitespace before every read.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial observed repro"}]}
```

```json
{"findingId":"F002","claim":"An active goal record without a packetPath injects its stored objective instead of rendering nothing, in both core and plugin.","evidenceRefs":[".opencode/hooks/goal/lib/goal-core.cjs:394-401",".opencode/plugins/opencode-goal.js:2713-2720",".opencode/hooks/goal/lib/goal-core.test.cjs:824",".../decision-record.md:73"],"counterevidenceSought":"Read both render paths, the two tests that pin the behavior, the 004 implementation summary, ADR-001, ADR-002 and README:37; checked whether a later gate strips pointer-less records before render (none found).","alternativeExplanation":"The ADRs may mean 'no packet injection' rather than 'no injection at all', but their own words say no injection and no fallback, and README:37 lists unbound alongside states that produce no block.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade when the ADR/README wording is amended to match the tested fallback, or the code and tests are changed to match the ADRs.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial contract comparison"}]}
```

```json
{"findingId":"F003","claim":"No surface performs the consumer-side length check ADR-006 promises at set time; objectives over the runtime cap are truncated silently by clampText in both core and plugin.","evidenceRefs":[".opencode/hooks/goal/lib/goal-core.cjs:236-243",".opencode/hooks/goal/lib/goal-core.cjs:1115",".opencode/plugins/opencode-goal.js:1758",".../decision-record.md:560"],"counterevidenceSought":"Searched both implementations for a warn/refuse branch on objective length, checked bind paths and the CLI envelope, and confirmed the only tiered enforcement is the TypeScript validator, which runs on documents not on set calls.","alternativeExplanation":"The truncation could be treated as documented runtime behavior, but the template and ADR-006 promise the check, and silent tail loss removes DONE WHEN criteria.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade when a warn/refuse path exists at set or bind time, or ADR-006 is amended to scope enforcement to the validator.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial contract comparison"}]}
```

## Traceability Checks

- Not the dedicated traceability iteration; ADR-003, ADR-004 and ADR-006 were read as the bearing decisions for this iteration's findings.

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, maintainability
- Novelty justification: one observed leak repro, one executable-contract contradiction, one missing enforcement path, one unmet cache constraint.

## Ruled Out

- Budget arithmetic inconsistency: ruled out; preview keeps `floor(4800*0.12)=576` characters (`goal-core.cjs:374-377`), the prompt objective budget is `max(240, min(1200, 4000-1900)) = 1200` (`:344-349`), and the objective slice is pointer-first (`goal-slice.cjs:93-105`). [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:344]
- Validator budget and binding rule presence: ruled out; warn/error tiers and the binding-row existence check are implemented (`spec-doc-structure.ts:1041-1076`) and tested (`spec-doc-structure.vitest.ts:314-354`). [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1045]
- Happy-path frontmatter leak: ruled out; `goal-slice.test.cjs:66-70` and the plugin test both assert no `SECRET` on a well-formed fence. [SOURCE: .opencode/hooks/goal/lib/goal-slice.test.cjs:66]
- Bound record with a missing document: ruled out; both render paths return empty, pinned by `goal-core.test.cjs:788`. [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:788]

## Dead Ends

- Treating the regex difference as cosmetic: the divergence is the leak mechanism, not a style difference.
- Treating the ADR fallback sentence as a stale research note: it is in the frozen decision text and in README:37, so it will be read as binding.

Review verdict: CONDITIONAL
