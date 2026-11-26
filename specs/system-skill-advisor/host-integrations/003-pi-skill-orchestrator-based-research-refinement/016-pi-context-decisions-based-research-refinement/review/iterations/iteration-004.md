# Iteration 4: correctness, deferred scans and generation-4 recheck

## Dispatcher

- Run 4 of 7 (extended run, generation 5, lineageMode completed-continue, session 2026-11-23T21:41:17.101Z). Native executor, LEAF.
- Prompt pack: `review/prompts/iteration-4.md`. HEAD `52f0bcb9a98`.
- Operator focus: the advisor logic in `runtime/` and `hooks/`. This pass covered it through the lifecycle and derived libraries, every handler, and the generation-4 P2s in the scorer, the policy plan, the freshness lock, the Pi hook and the Python fallback.

## Dimension

Correctness. Three tasks: (1) the deferred `lifecycle_and_derived_defect_scan`, (2) the deferred `handler_defect_scan`, (3) recheck of the seven generation-4 P2s the v5-r3 report lists as not rechecked.

## Files Reviewed

- Read in full: every file in `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/` (age-haircut, archive-handling, rollback, schema-migration, status-values, supersession) and `.skilled/skills/system-skill-advisor/runtime/lib/derived/` (anti-stuffing, extract, provenance, sanitizer, sync, trust-lanes).
- Read in full: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts`, `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts`.
- Covered by a catch, parse, throw and status-site grep across all 12 handler files, plus targeted reads: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:296-360,530-548`, `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:60-75,200-222,355-395`, `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:238-318`. Not read line by line: the bodies of `advisor-validate.ts` beyond its error sites, and `skill-graph/query.ts`, `status.ts`, `validate.ts` and `propagate-enhances.ts` beyond their catch sites. Iteration 3 read `status.ts`, `validate.ts` and `propagate-enhances.ts`.
- Caller sweep for the lifecycle and derived exports over `runtime/` and `hooks/`. Live callers are `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1275`, `.skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts:155` and `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts:94`. Everything else is called only from `runtime/stress-test/`.
- Recheck reads: `.skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:1-14`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1108`, `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:18-40`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:182,248`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52,4147`, `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:185-192`, `.skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:198-230`, `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:125-195`, `.skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:35-147`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

Each of these is a generation-4 P2 that still holds at HEAD. Generation 5 started a fresh registry, so they are recorded again under new ids with the full path.

1. **The contract-key header names consumers that do not exist** -- .skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:6 -- The header at :5-9 says the tuples feed `skill_advisor/tools/...` and an `ALLOWED_PARAMETERS` map in `schemas/tool-input-schemas.ts`. `runtime/schemas/` holds no such file, and `ALLOWED_PARAMETERS` appears only in comments (`runtime/tools/advisor-recommend.ts:8`, `runtime/tools/advisor-validate.ts:8`). Recheck of R3-P2-001: holds.
   - Finding class: documentation-contract drift, phantom consumer.
   - Scope proof: `advisor-contract-keys.ts` is in reviewScopeFiles; a grep over `runtime/` and `hooks/` finds no `ALLOWED_PARAMETERS` symbol and no `tool-input-schemas` file.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:5-9`, `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts:8`, `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`.
   - Case: a maintainer adds a key to the tuple and trusts the header, but the Zod input schema is not derived from it, so the handler parse at `advisor-recommend.ts:641` rejects the new key (inferred from the header, not probed).

2. **scoreAdvisorPrompt is one 366-line pipeline with no stage seam** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1108 -- The function runs from :1108 to the end of the file at :1474. Its order-dependent withhold and handoff steps sit inline. Single-step tests exist (`runtime/tests/scorer/typed-command-owner.vitest.ts`, `runtime/tests/command-meaning-anchor.vitest.ts`), but no test or type pins the order of the steps. Recheck of R4-P2-002: holds; the start line moved from 1104 to 1108.
   - Finding class: oversized function, implicit ordering invariant.
   - Scope proof: fusion.ts is in reviewScopeFiles; the span comes from the function-declaration grep and `wc -l`.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1014-1108`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`.
   - Case: a new withhold step is inserted after the handoff step instead of before it, the ranking changes, and no existing test fails.

3. **The Pi adapter hard-copies the Claude hook budget** -- .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:22 -- `PI_ADVISOR_DEFAULT_BUDGET_MS = 2500` and the copied env parse at :30-34 mirror `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500` at `hooks/claude/user-prompt-submit.ts:182`. The Claude side parses through `positiveIntFromEnv` (:248). The comment at :21 admits the mirror. The only test that names the Claude constant (`runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:11,144`) does not touch the Pi value, and no test names `PI_ADVISOR_DEFAULT_BUDGET_MS`. Recheck of R4-P2-003: holds.
   - Finding class: hand-kept duplicate with no guard.
   - Scope proof: both hook files are in reviewScopeFiles; a test grep for `PI_ADVISOR` and `advisorBudgetMs` finds only the source and a hook doc.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:22-34`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:182,248`.
   - Case: the Claude default is raised to 4000 ms, Pi keeps 2500 plus its 300 ms margin, and Pi's deadline fires while the CLI is still inside the new budget, so Pi silently drops briefs.

4. **The prompt cap and confidence floors are hard-coded in both languages** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52 -- `ADVISOR_PROMPT_MAX_CHARS = 10_000` appears at `skill_advisor.py:52` and at `runtime/schemas/advisor-tool-schemas.ts:257`. `_LOOP_OWNER_CONFIDENCE_FLOOR = 0.82` at `skill_advisor.py:4147` mirrors the three 0.82 floors at `runtime/lib/scorer/scoring-constants.ts:185-192`. No cross-language test compares them; the vitest hits on `10000`/`0.82` are unrelated literals. Recheck of R4-P2-004: holds, now including the loop-owner floor that the report said was not rechecked.
   - Finding class: cross-language duplicated constant.
   - Scope proof: both files are in reviewScopeFiles.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52,4147`, `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:185-192`.
   - Case: the TypeScript cap is raised to 20000, and a 15000-character paste is scored by the daemon but truncated or refused by the Python fallback, so the two routes disagree.

5. **The Gate-3 question lookup swallows a load failure** -- .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:203 -- `currentGateQuestion` wraps `requireOwnerModule` for the spec-kit owner module in a bare catch that returns `undefined` (:209-211). Its only consumer is the `GATE_SPEC_FOLDER_QUESTION_ID` block (:226-229), which treats `undefined` as "no content". Recheck of R4-P2-006: holds.
   - Finding class: swallowed failure, absent conflated with broken.
   - Scope proof: policy-plan.ts is in reviewScopeFiles.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:203-212`, `.skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:226-229`.
   - Case: `spec-gate-core.mjs` is moved or renamed, and every policy plan then drops the Gate-3 question with no diagnostic, which looks the same as a deliberately empty block.

6. **The corrupt-lock reclaim deletes a lock that is still being acquired** -- .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:186 -- The lock is created with `openSync(lockPath, 'wx')` (:154), and its token is written in a second call (:155). An empty or short file parses as `token: null, ageMs: null` (:132-135). The null branch removes the lock without a second read (:186-189), unlike the stale branch (:172-183). The test grep found no empty-lock case. Recheck of R5-P2-001: holds. The reach is still cross-process only, as generation 4 corrected it.
   - Finding class: race in lock reclaim.
   - Scope proof: generation.ts is in reviewScopeFiles.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:132-135,154-155,186-189`.
   - Case: during a daemon lease handover, process A has created the empty lock and not yet written its token. Process B reads it as corrupt and deletes it, and both processes then publish generation N+1 for different states.

## Recheck of Generation-4 P2s

| Gen-4 id | Outcome | Gen-5 id | Evidence |
|---|---|---|---|
| R3-P2-001 | holds | G5-I4-P2-001 | `.skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:5-9` |
| R3-P2-002 | holds, out of reviewScopeFiles, not registered | none | `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:16` cites `tests/skill-advisor-cli-manifest-parity.vitest.ts`; only `runtime/tests/...` exists |
| R4-P2-002 | holds | G5-I4-P2-002 | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1108` |
| R4-P2-003 | holds | G5-I4-P2-003 | `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:22` |
| R4-P2-004 | holds, floor now rechecked too | G5-I4-P2-004 | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52,4147` |
| R4-P2-006 | holds | G5-I4-P2-005 | `.skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:203` |
| R5-P2-001 | holds | G5-I4-P2-006 | `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:186` |

## Traceability Checks

- `spec_code` (core): still partial. This pass found no new contradiction, and the two it already carries (G5-I1-P1-001, G5-I2-P2-001) were not reopened. G5-I4-P2-001 is a comment-versus-code drift of the same kind.
- `checklist_evidence` (core): notApplicable. The target has no checklist rows.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:80-87` builds the prompt-cache HMAC key from the normalized prompt, the runtime and `sourceSignature`. It does not use the generation number. This settles the publish-after-commit question below.

## Edge Cases

- Lifecycle precedence: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1273-1276` lets an explicit `lifecycle_status: 'active'` override a `z_archive/` path, while `.skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts:155` filters corpus stats by path alone. A skill under `z_archive/` whose metadata says active would route while its documents stay out of the corpus statistics. At HEAD this cannot happen: no `z_archive` or `z-future` folder exists under `.skilled/skills/`, and `skill-graph-db.ts` has no special case for either name. Recorded, not a finding.
- Publish after commit: in `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:53-61` and `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts:89-96`, `indexSkillMetadata` commits its transaction (`skill-graph-db.ts:975`) before `publishSkillGraphGeneration` can throw on a lock timeout. The handler then reports failure, although the graph changed and the generation was not bumped. The prompt cache keys on the source signature, not the generation, so cached answers do not go stale through this path, and the next rebuild repairs the counter. It is not written up as a finding, because no consumer of the generation counter was shown to misbehave. A test that forces a lock timeout after indexing and then reads `advisor_status` would settle it.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/lib/derived/provenance.ts:43-60`: `workspaceRelativeFilePath` rejects absolute paths and realpath escapes.
- `.skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:127-140`: the walker uses Dirent types, so symlinks are neither followed nor collected.
- `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts:33-45` and `.skilled/skills/system-skill-advisor/runtime/lib/derived/sync.ts:57-69`: atomic temp, fsync and rename, with the temp file removed on failure.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:370-391`: a failure becomes `freshness: 'unavailable'` with the error recorded, never a false live status.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts:119-135`: the trust check runs before any read or write.

## Ruled Out

- lifecycle_and_derived_defect_scan, searched-clean on the serving path. Two weak spots sit in code that only `runtime/stress-test/` calls: the all-or-nothing reject at `.skilled/skills/system-skill-advisor/runtime/lib/derived/anti-stuffing.ts:58-67`, where one instruction-shaped n-gram such as "run tool" empties every derived value of a skill, and the substring match at `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:33-37`, where a prompt naming `sk-code-review` counts as naming `sk-code`. Neither reaches a live route, so they belong under the existing dead-feature finding G5-I3-P2-002 and do not need their own.
- handler_defect_scan, searched-clean. Every handler either parses its input through Zod or returns through a catch that reports an error. No handler reports success on a failed step. The one half-write is the publish-after-commit gap under Edge Cases, shown harmless to the cache.

## Next Focus

- Dimension: traceability.
- Focus area: the `playbook_capability` overlay (search debt SL-305, never run) and the contested R1-P2-005 that generation 5 ruled out without testing generation 4's case.
- Reason: these are the open search-debt and contested items left after this pass.
- Rotation status: all four dimensions covered; the extension passes clear debt.
- Blocked/productive carry-forward: do not reopen the two scans swept here, parity, or the cross-skill-edges symlink path. Productive: caller sweeps that separate live code from stress-test-only code.
- Required evidence: playbook rows mapped to code at file:line; for R1-P2-005, a probe of generation 4's exact case.

## Verdict

Two P1s are still active (G5-I1-P1-001, G5-I2-P1-001). This pass added no P0 or P1.

Review verdict: CONDITIONAL
