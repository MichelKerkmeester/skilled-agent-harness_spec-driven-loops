# Review Iteration 004

## Dispatcher

- Mode: review
- Target agent: deep-review
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Session: fanout-vibe-1-1795172940208-84a42n, generation 1, lineageMode new
- Artifact directory: `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/review/lineages/vibe-1`
- Dimension this iteration: traceability
- Operator review focus: the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df` and the feature-catalog pages the three feature commits rewrote. This iteration addressed that focus by reading the two catalog pages the feature commits added or rewrote (`daemon-and-freshness/background-vector-refresh.md`, `cli-surface/advisor-status.md`), the catalog index counts, and the ablation page, then comparing every shipped-behavior sentence in them against the code at HEAD.
- Frontier node: F-1-001 (vector refresh lifecycle) and F-1-004 (status and doctor surfaces), both read through their catalog pages.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md:1-60`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md:1-60`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:19-24`
- `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:17-56`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1400-1490`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:200-245`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:392-399`
- `.skilled/hooks/session-handover/lib/nudge.cjs:40-47,91-95`
- `.skilled/hooks/session-handover/pi/session-handover.test.ts:1-20,43-52,368`
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:43-52,1071-1080`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:516-540`
- `.skilled/vitest.config.bin.ts:1-12`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:61,98-126,187`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/review/lineages/vibe-1/steer.md` (absent; no lead ruling to apply)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The refresh page promises a watcher refresh after every reindex, but the single-flight guard drops one that lands mid-refresh** -- `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md:31` -- The page states "`watcher.ts` starts the same refresh after each reindex." `refreshEmbeddingsInBackground` returns the in-flight promise when one is already running (`skill-graph-db.ts:1437-1439`), so a reindex that arrives while a refresh is in progress starts nothing and its changed row is not embedded until some later trigger. The page states an unconditional guarantee the code does not provide.
   Finding class: doc-claim-versus-code
   Scope proof: the page was added by `1ccbb3283c6`, one of the three feature commits named in the review focus; the guard is in the file the page's own SOURCE FILES table names.
   Affected surface hints: `daemon-and-freshness/background-vector-refresh.md` (section 2), `lib/skill-graph/skill-graph-db.ts` single-flight guard, `lib/daemon/watcher.ts` call site.
   Case: a skill's `SKILL.md` description is edited while a startup refresh is still embedding the command corpus; the watcher fires, `refreshEmbeddingsInBackground` returns the running promise, and the edited skill keeps its old vector until the next daemon restart or unrelated reindex.
   Cross-reference: this is the documentation face of `R1-P1-001`. The code fix and the page fix are the same change; the page is reported separately because amending the page alone would leave the operator-facing claim false.

2. **The status page describes `laneEnabled` as "whether the semantic lane is enabled", but the field omits the coverage gate that disables scoring** -- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md:41` -- The page says the diagnostic "reports ... whether the semantic lane is enabled", and two sentences later says "incomplete coverage can have the same effect" (degrading the lane). The field is computed at `advisor-status.ts:242` from `hasActive && adapter && !dimMismatch && !staleness.stale && hasVecTable && embedded > 0 && !disabledReason`; `coverageComplete` is not in that expression. `semantic-shadow.ts:392-393` disables the lane and sets `disabledReason: 'incomplete_skill_vectors'` whenever `embeddingCoverage().complete` is false. So the envelope can carry `laneEnabled: true` beside `coverageComplete: false` while the lane refuses to score, and the page teaches an operator to read `laneEnabled` as the answer.
   Finding class: doc-claim-versus-code
   Scope proof: the page was rewritten by `31ffd18beab` and `1ccbb3283c6`; the field and the gate are both in files the page's SOURCE FILES table names.
   Affected surface hints: `cli-surface/advisor-status.md` (section 2), `handlers/advisor-status.ts` `laneEnabled` expression, `lib/scorer/lanes/semantic-shadow.ts` coverage gate.
   Case: a daemon holds current vectors for 12 of 15 skills after an outage; `advisor_status --include-semantic-health true` returns `coverageComplete: false` with `laneEnabled: true`, and an operator who reads the page's field description concludes the lane is scoring when `scoreSemanticShadowLane` returns an empty contribution.
   Cross-reference: same root cause as `R2-P1-001`. Reported here because the page is a shipped artifact with its own fix, and because the page's own next sentence contradicts its field description.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Summary |
|---|---|---|---|---|
| `feature_catalog_code` | partial | hard | `background-vector-refresh.md:31`, `skill-graph-db.ts:1437-1439` | Every shipped-behavior sentence on the new refresh page was compared with the code. Six of seven hold; the watcher guarantee does not (`R4-P2-001`). |
| `feature_catalog_code` | partial | hard | `advisor-status.md:41`, `advisor-status.ts:242`, `semantic-shadow.ts:392` | The status page's coverage and degradation sentences match the code; its `laneEnabled` field description does not (`R4-P2-002`). |
| `spec_code` | pass | hard | `ablation.md:21`, `implementation-summary.md:113,121` | The ablation page's 156-with / 161-without / 7-flips / no-new-none-gold-fire record matches both the runs 3-4 row and the runs 6-9 row of the summary, and the fail branch it states (default stays 0) matches decision D2. |
| `checklist_evidence` | notApplicable | hard | none | The review target is a file list, not a spec folder, so there is no `checklist.md` to reconcile. |
| `catalog_inventory` | pass | soft | `feature-catalog.md:20,26-32` | The index claims 49 features across 7 groups; the tree holds 49 pages and the per-group counts (8/8/5/5/10/10/3) sum to 49. |
| `test_reference_integrity` | pass | soft | `background-vector-refresh.md:47-48` | Both test files the page names exist at the stated paths. |

## Integration Evidence

- `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md` -- added by `1ccbb3283c6`; its SOURCE FILES table names `skill-graph-db.ts`, `advisor-server.ts` and `watcher.ts`, all three of which were read at HEAD.
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md` -- rewritten by `31ffd18beab` and `1ccbb3283c6`; its `laneEnabled` description was checked against `handlers/advisor-status.ts` and `lib/scorer/lanes/semantic-shadow.ts`.
- `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` -- version bumped to `0.8.6.0` and the daemon group count raised from 7 to 8 by `1ccbb3283c6`; the count was verified against the directory.
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md` -- rewritten by `31ffd18beab` and `1ccbb3283c6`; its numbers were checked against the packet's own ablation table.
- `.skilled/vitest.config.bin.ts` -- read to scope completion criterion 1; it includes only `bin/**/*.vitest.ts`.
- `.skilled/hooks/session-handover/lib/nudge.cjs` and `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` -- read as the sources the two tests changed by `0390556ee2b` assert against.

## Edge Cases

- **Commit message versus diff on the docs commits.** The ten `docs(specs)` commits describe themselves as decisions-only, yet `019-workflow-outcome-measure/description.json` moved `memorySequence` from 0 to 2 and gained two `memoryNameHistory` entries. `memoryNameHistory` is a slug-collision history consumed by `workflow.ts:1807-1816`, not a pointer to files that must exist, so the absent memory files are expected and the sequence gap is harmless. A commit message is not shipped behavior, so this is recorded rather than raised.
- **Two CI rows in the summary describe different runs.** `implementation-summary.md:126` still carries the historical row saying Hook Vitest Suites fails one Pi session-handover test, while `03c7fb56e47` added a later row saying both stale tests now pass. Both are dated records of different runs and do not contradict each other, but a reader who stops at line 126 gets the stale state. Editorial, not a finding.
- **Test-run claims are unverified here.** The summary's "hooks vitest tree passes 509 of 509" and "plugin suites 595 of 595" were not reproduced: this review may not execute the repository's test tooling from inside the lineage write surface. They are recorded as unverified evidence, not as a pass.
- **`0390556ee2b` is a legitimate fix, not a text-matching dodge.** The operator's focus names a test change that matches new text while leaving behavior unchecked as a finding, so both halves of that commit were checked against the source. The Pi test now derives the writer path with `fileURLToPath(new URL(...))` from the test file, which resolves to the same absolute path as `nudge.cjs:43-47`'s `path.join(__dirname, '..', '..', '..', 'skills', ...)`, and `shellQuote` (`nudge.cjs:91-95`) always wraps in single quotes, so the test's hardcoded `node '<abs>'` shape matches what the hook emits. `CONTINUITY_WRITER` is asserted at `session-handover.test.ts:368`, so the behavior is still checked. The OpenCode change adds `additionalContext` to the alternation, and `user-prompt-submit.ts:522-535` does put `additionalContext` into the output and observe it, so the added alternative matches the correct behavior. Residual weakness, not a finding: the `[\s\S]*` span is unbounded, so the assertion proves token order rather than that the observed value is the emitted one.
- **Completion criterion 1 is honestly scoped.** `.skilled/vitest.config.bin.ts` includes only `bin/**/*.vitest.ts`, so the second half of the criterion does not cover `.skilled/hooks/session-handover/pi/session-handover.test.ts`. The `[x]` is not overstated by that test's history.

## Confirmed-Clean Surfaces

- `background-vector-refresh.md`'s coverage rule ("complete when at least one embeddable skill exists and every eligible skill and command vector is current", "a command-only index remains incomplete") matches `skill-graph-db.ts:1428`'s `complete: skills.total > 0 && incompleteIds.length === 0`.
- The page's "complete coverage skips network work" matches the `if (coverage.complete) return null;` early return before the probe.
- The page's "probes Ollama once with a 500 ms timeout" matches `probeOllamaModel(..., 500)`.
- The page's "the value is case-insensitive" for `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` matches `process.env.SYSTEM_SKILL_ADVISOR_EMBED_REFRESH?.toLowerCase() === 'off'` at `skill-graph-db.ts:1445`. This narrows `R3-P2-001`: the case-insensitivity claim is accurate; only the non-`off` falsy spellings fail open.
- The page's "failed embeds keep the old vectors" matches the adapter path verified in iteration 1.
- `feature-catalog.md`'s 49-feature, 7-group inventory and every per-group count are correct.
- `ablation.md`'s "`runLaneAblation` ignores lane weights and includes lanes whose weight is already 0" and "`advisor_validate` returns no ablation slice" are consistent with the summary's alignment-finding rows SK B-03 and SK B-05.
- The 73 changed `decision-record.md` files: `packet_pointer` matches the file path in every case (0 mismatches), and the `_memory.continuity` block with `fingerprint: "sha256:0000…"` and `completion_pct: 0` is the shipped writer's own template at `decision-record-writer.js:395-404`, not a hand-written placeholder.

## Ruled Out

- **The catalog index overstates the feature count.** Counted the tree: 49 pages, per-group 8/8/5/5/10/10/3, summing to 49. The claim holds.
- **The new refresh page names test files that do not exist.** Both `refresh-in-background.vitest.ts` and `embedding-coverage.vitest.ts` exist at the stated paths.
- **The ablation page's numbers disagree with the packet's own record.** Both cite 156 with the lane against 161 without, 7 flips, no new none-gold fire, default stays 0.
- **`0390556ee2b` loosened a test to hide a behavior change.** Both halves were traced to the current source and both still assert the behavior; see Edge Cases.
- **The `docs(specs)` commits wrote answers into the wrong packets.** `packet_pointer` matches the file path in all 73 changed `decision-record.md` files.
- **`vitest.config.bin.ts` silently covers the failing Pi hook test.** It includes only `bin/**/*.vitest.ts`.

## Next Focus

- Dimension: maintainability
- Focus area: the remaining follow-up commits `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d` and the `sk-doc` hub-router vocabulary change, judged for whether the fix leaves a second copy of the same vocabulary or a stale compiled manifest behind.
- Reason: traceability is now covered for the catalog pages and the docs commits; the routing and changelog follow-ups have not been read at HEAD.
- Rotation status: correctness, security and traceability complete; maintainability remaining.
- Blocked/productive carry-forward: productive on catalog-page-versus-code comparison; blocked on executing the repository's test tooling from inside the lineage write surface.
- Required evidence: `hub-router.json`, `sk-create-readme/SKILL.md`, the two `activation/sk-doc/manifest.json` copies, `v4.1.0.0.md`, and the changelog shape checker's test.
- Recovery note: none.

Review verdict: CONDITIONAL
