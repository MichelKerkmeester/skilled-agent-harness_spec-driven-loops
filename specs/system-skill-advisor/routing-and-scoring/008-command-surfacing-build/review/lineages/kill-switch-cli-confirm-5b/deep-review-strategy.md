# Deep Review Strategy - kill-switch-cli-confirm-5b Lineage

## 1. REVIEW CHARTER

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder target)
- Fan-out lineage: `kill-switch-cli-confirm-5b` (artifact dir `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/kill-switch-cli-confirm-5b`); confirming round `5b` area is `kill-switch-cli`
- Dimensions: correctness, security, traceability, maintainability
- Stop conditions: legal convergence at `convergenceThreshold=0.10`, or `maxIterations=3`, whichever comes first
- Success criteria: every `kill-switch-cli` file in `review-scope-5b.txt` reviewed against the fix commit range; each of the six pass-five P2 findings for this area confirmed fixed or re-raised with a new input; every finding carries `file:line` and a concrete input; docs and code agree on the switch names; holdout hygiene is counts-only
- Review focus (operator bound): confirming round `5b` of pass five. Read `review-brief-5b.txt` first. Review the files whose area is `kill-switch-cli` plus docs that describe them. Check that the kill-switch names agree in code and docs, and docs agree with code. Never open `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl` except through `jq del(.prompt)`. Change no code and write only inside the lineage folder.
- Resource map: `resource-map.md` not present; skipping coverage gate

---

## 2. TOPIC

The confirming round for the pass-five `kill-switch-cli` fixes: `ENV-REFERENCE.md` alias and source columns, the CP-003 control command, the launcher child-env fixture, the CLI disable loop, and the `runtime/lib` module map. The round reads the diff `2a1a42263cc..d21dbc1cafe` for those paths, confirms each fix, and looks for defects the fixes added.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- Not reviewing `accuracy-runner`, `vibe-hooks-doctor` or `docs-metadata` area files except as read-only context when a cross-area contract is required
- Not re-reporting `R1-P2-002` (rejected by the verifier), any item decision D13 records, or a limit named in `report-2.txt` or `report-3.txt` without a new input
- Not reviewing files outside the pass-five fix commit range except docs that describe the `kill-switch-cli` files
- Not fixing anything: the review is observation-only
- Not reading or printing holdout prompt text; holdout coverage is counts-only
- Not running repo tooling that writes outside the lineage; probes are read-only or write under the lineage directory

---

## 5. STOP CONDITIONS

- Legal convergence (all dimensions covered plus stabilization) at or below `convergenceThreshold`
- `maxIterations=3` reached (`stopReason: maxIterationsReached`)
- Any active P0 blocks a PASS verdict but does not stop iteration dispatch by itself; the P0 override keeps `newFindingsRatio >= 0.50`

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 6. WHAT WORKED
- Reading the fix diff beside the working tree for the five scope paths confirmed the fix range is not HEAD but none of the five files moved after it, so the citations stay valid (iteration 1).
- Comparing the resolver's `MASTER_ALIASES` and `LEGACY_ALIASES['skill-advisor']` name for name against the two index tables found the one table the fix did not patch instead of a guessed drift (iteration 1).
- Running a read-only probe of `hookFlagDecision` for the four `MK_` names turned "the doc omits them" into "the doc omits names that observably disable the advisor" (iteration 1).
- Diffing `git ls-tree` at the fix commit against both README trees proved section 4 complete and section 3 one folder short without a second directory scan (iteration 1).
- Reading the launcher allowlist and the test scope together proved the ten-name fixture cannot leak a switch into the daemon child env and cannot be bent by a developer's flags file (iteration 2).
- Counting the three prompt files with `wc -l` kept the holdout rule while giving the report a real row count (iteration 2).
- Pinning each scope path's last-touching commit proved the reviewed content is the fix state and that the fix landed at `d0f605b42f8` rather than the range tip (iteration 3).

---

## 7. WHAT FAILED
- Reading `ENV-REFERENCE.md:74-75` alone made the alias fix look complete; the canonical index its own header defers to still disagreed (iteration 1).
- Treating the pass-five verifier's fix column as the full scope of the confirmed finding hid the second site the pass-five iteration had already named (iteration 1).
- Counting the alias list as a finding in both iterations would have doubled one defect; the duplication had to be recorded as the cost on the one incomplete copy (iteration 2).
- The per-iteration tool budget was exceeded while reading the trust boundary; the count is recorded rather than trimmed to look compliant (iteration 2).
- Iteration 1's provenance sentence said the five paths were unchanged "after d21dbc1cafe"; the exact check shows the fix landed at `d0f605b42f8` and nothing after it touched them, so the sentence was true but imprecise (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`ADVISOR_DISABLED_FLAGS` order matters to either test.** One test iterates it, the other builds an object and counts keys; neither depends on order. Ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`ADVISOR_DISABLED_FLAGS` order matters to either test.** One test iterates it, the other builds an object and counts keys; neither depends on order. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ADVISOR_DISABLED_FLAGS` order matters to either test.** One test iterates it, the other builds an object and counts keys; neither depends on order. Ruled out.

### **`MK_HOOKS_DISABLED` is a second master alias that the resolver ignores.** The probe returns `reason: "master"`, so it is honored; the omission is in the doc, not the code `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-258]`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`MK_HOOKS_DISABLED` is a second master alias that the resolver ignores.** The probe returns `reason: "master"`, so it is honored; the omission is in the doc, not the code `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-258]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`MK_HOOKS_DISABLED` is a second master alias that the resolver ignores.** The probe returns `reason: "master"`, so it is honored; the omission is in the doc, not the code `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-258]`.

### **A later commit in the range rewrote the reviewed content.** The last touching commit is `d0f605b42f8` and the diff to `d21dbc1cafe` is empty. Ruled out. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A later commit in the range rewrote the reviewed content.** The last touching commit is `d0f605b42f8` and the diff to `d21dbc1cafe` is empty. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A later commit in the range rewrote the reviewed content.** The last touching commit is `d0f605b42f8` and the diff to `d21dbc1cafe` is empty. Ruled out.

### **A P2 should be raised to fill the third pass.** Both surviving advisories are already recorded and no new evidence supports a third. Ruled out. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A P2 should be raised to fill the third pass.** Both surviving advisories are already recorded and no new evidence supports a third. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A P2 should be raised to fill the third pass.** Both surviving advisories are already recorded and no new evidence supports a third. Ruled out.

### **A second master alias exists beyond `MK_HOOKS_DISABLED`.** `MASTER_ALIASES` holds one entry and `hook-flags.env.example` names no other `MK_` master. Ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A second master alias exists beyond `MK_HOOKS_DISABLED`.** `MASTER_ALIASES` holds one entry and `hook-flags.env.example` names no other `MK_` master. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second master alias exists beyond `MK_HOOKS_DISABLED`.** `MASTER_ALIASES` holds one entry and `hook-flags.env.example` names no other `MK_` master. Ruled out.

### **A tracked dotenv, holdout or prompt file is read by any reviewed file.** No reviewed file opens `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`; the switch docs name no prompt text. Holdout hygiene holds for this area. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A tracked dotenv, holdout or prompt file is read by any reviewed file.** No reviewed file opens `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`; the switch docs name no prompt text. Holdout hygiene holds for this area.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A tracked dotenv, holdout or prompt file is read by any reviewed file.** No reviewed file opens `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`; the switch docs name no prompt text. Holdout hygiene holds for this area.

### **Documenting the `MK_` aliases widens the attack surface.** The names were already honored by the resolver and bridged by `env-aliases.cjs`; the fix changes the doc, not the reader `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:31-49]`. Ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Documenting the `MK_` aliases widens the attack surface.** The names were already honored by the resolver and bridged by `env-aliases.cjs`; the fix changes the doc, not the reader `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:31-49]`. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Documenting the `MK_` aliases widens the attack surface.** The names were already honored by the resolver and bridged by `env-aliases.cjs`; the fix changes the doc, not the reader `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:31-49]`. Ruled out.

### **The `003-` display label in the playbook index is a broken link.** The href resolves to the real file; only the label is stale, and the file belongs to another area. Ruled out here. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `003-` display label in the playbook index is a broken link.** The href resolves to the real file; only the label is stale, and the file belongs to another area. Ruled out here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `003-` display label in the playbook index is a broken link.** The href resolves to the real file; only the label is stale, and the file belongs to another area. Ruled out here.

### **The advisories were fixed after iteration 1.** The replay shows both lines unchanged. Ruled out. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The advisories were fixed after iteration 1.** The replay shows both lines unchanged. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The advisories were fixed after iteration 1.** The replay shows both lines unchanged. Ruled out.

### **The CLI `MK_` assertion can pass with the wrong switch set.** `switchEnv` deletes all ten names before setting one, the scope isolates the flags file, and the loop still asserts one reason, `ADVISOR_DISABLED`, `freshness: unavailable` and zero daemon calls. Ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The CLI `MK_` assertion can pass with the wrong switch set.** `switchEnv` deletes all ten names before setting one, the scope isolates the flags file, and the loop still asserts one reason, `ADVISOR_DISABLED`, `freshness: unavailable` and zero daemon calls. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The CLI `MK_` assertion can pass with the wrong switch set.** `switchEnv` deletes all ten names before setting one, the scope isolates the flags file, and the loop still asserts one reason, `ADVISOR_DISABLED`, `freshness: unavailable` and zero daemon calls. Ruled out.

### **The CLI loop's loose `MK_` assertion can hide a wrong switch.** `switchEnv` deletes every name in `ADVISOR_DISABLED_FLAGS` before setting the one under test `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:151-156]`, and the loop also asserts one reason, the fixed prefix, `ADVISOR_DISABLED`, `freshness: unavailable` and zero daemon calls, so the only switch present is the one under test. The looseness covers the load-time rename, not an unset fixture. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The CLI loop's loose `MK_` assertion can hide a wrong switch.** `switchEnv` deletes every name in `ADVISOR_DISABLED_FLAGS` before setting the one under test `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:151-156]`, and the loop also asserts one reason, the fixed prefix, `ADVISOR_DISABLED`, `freshness: unavailable` and zero daemon calls, so the only switch present is the one under test. The looseness covers the load-time rename, not an unset fixture.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The CLI loop's loose `MK_` assertion can hide a wrong switch.** `switchEnv` deletes every name in `ADVISOR_DISABLED_FLAGS` before setting the one under test `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:151-156]`, and the loop also asserts one reason, the fixed prefix, `ADVISOR_DISABLED`, `freshness: unavailable` and zero daemon calls, so the only switch present is the one under test. The looseness covers the load-time rename, not an unset fixture.

### **The CP-003 control command can still start disabled through a flags file.** The command sets `HOOK_FLAGS_CONFIG=/dev/null`, so the file config is empty, and the ten env names are unset `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49]`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The CP-003 control command can still start disabled through a flags file.** The command sets `HOOK_FLAGS_CONFIG=/dev/null`, so the file config is empty, and the ten env names are unset `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The CP-003 control command can still start disabled through a flags file.** The command sets `HOOK_FLAGS_CONFIG=/dev/null`, so the file config is empty, and the ten env names are unset `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49]`.

### **The duplication of the alias list should be its own finding.** It is the root cause of `c5b-iter1-P2-hooks-index-aliases`, already recommended there; a second finding would count one defect twice. Ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The duplication of the alias list should be its own finding.** It is the root cause of `c5b-iter1-P2-hooks-index-aliases`, already recommended there; a second finding would count one defect twice. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The duplication of the alias list should be its own finding.** It is the root cause of `c5b-iter1-P2-hooks-index-aliases`, already recommended there; a second finding would count one defect twice. Ruled out.

### **The five scope files changed after the fix commit.** The diff and the working tree agree for all five paths; no post-`d21dbc1cafe` edit changes a cited line. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The five scope files changed after the fix commit.** The diff and the working tree agree for all five paths; no post-`d21dbc1cafe` edit changes a cited line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The five scope files changed after the fix commit.** The diff and the working tree agree for all five paths; no post-`d21dbc1cafe` edit changes a cited line.

### **The launcher allowlist comment is a behavior defect.** The fixture pins the behavior the comment describes, and the file is outside the `5b` scope. Recorded as a reading hazard in Edge Cases. Ruled out as a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The launcher allowlist comment is a behavior defect.** The fixture pins the behavior the comment describes, and the file is outside the `5b` scope. Recorded as a reading hazard in Edge Cases. Ruled out as a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The launcher allowlist comment is a behavior defect.** The fixture pins the behavior the comment describes, and the file is outside the `5b` scope. Recorded as a reading hazard in Edge Cases. Ruled out as a finding.

### **The launcher size assertion hides a name added to the constant.** It fails closed instead: a new name makes `toHaveLength(10)` fail and forces the fixture to be re-read, which is the guard the comment claims `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:137-139]`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The launcher size assertion hides a name added to the constant.** It fails closed instead: a new name makes `toHaveLength(10)` fail and forces the fixture to be re-read, which is the guard the comment claims `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:137-139]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The launcher size assertion hides a name added to the constant.** It fails closed instead: a new name makes `toHaveLength(10)` fail and forces the fixture to be re-read, which is the guard the comment claims `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:137-139]`.

### **The round should claim convergence.** The coverage graph is unavailable, so no graph-backed convergence decision exists; the legal stop is `maxIterationsReached`. Ruled out. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The round should claim convergence.** The coverage graph is unavailable, so no graph-backed convergence decision exists; the legal stop is `maxIterationsReached`. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The round should claim convergence.** The coverage graph is unavailable, so no graph-backed convergence decision exists; the legal stop is `maxIterationsReached`. Ruled out.

### **The three added `MK_` cases share state with each other.** Each case creates its own `mkdtempSync` root and socket directory. Ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The three added `MK_` cases share state with each other.** Each case creates its own `mkdtempSync` root and socket directory. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The three added `MK_` cases share state with each other.** Each case creates its own `mkdtempSync` root and socket directory. Ruled out.

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; D1-D4 are covered and the run is at `maxIterations=3`. - Focus area: synthesis and the closeout record, not another dispatch. - Reason: the final iteration found no new finding; the active set is two P2 advisories, so the verdict is PASS with `hasAdvisories: true` and the legal stop reason is `maxIterationsReached`. - Rotation status: all four dimensions covered across three iterations. - Required evidence: the two finding rows, the three iteration files, the three deltas and the reducer's registry. - Recovery note: the synthesis must not claim convergence and must carry the fix-provenance note forward. Review verdict: PASS

<!-- /ANCHOR:next-focus -->

---

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the five `kill-switch-cli` files listed in `review/review-scope-5b.txt` (`.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md`, `.skilled/skills/system-skill-advisor/runtime/lib/README.md`, `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`), plus the shared docs that describe them (`.skilled/hooks/README.md`, `.skilled/hooks/hook-flags.env.example`) and the pass-five lineage context.
- Behavior claims to verify: `SYSTEM_SKILL_ADVISOR_DISABLED` and its seven aliases plus `SYSTEM_HOOKS_DISABLED` and `MK_HOOKS_DISABLED` are the complete env switch set for the advisor; the control command in CP-003 must unset all ten; `ADVISOR_DISABLED_FLAGS` is the single list both tests should read; the `runtime/lib` module map must match the directory.
- Reuse and conventions: `.skilled/hooks/shared/hook-flags.cjs` is the single resolver (`MASTER_FLAG`, `MASTER_ALIASES`, `LEGACY_ALIASES`, `hookFlagDecision`); `.skilled/hooks/shared/env-aliases.cjs` bridges `MK_` onto `SYSTEM_` at load; `ADVISOR_DISABLED_FLAGS` in `runtime/lib/advisor-disabled.ts` is the caller-side strip list.
- Review risks and gaps: the pass-five scope is a changed-file list, not a module map; the fix commit range stops at `d21dbc1cafe` while HEAD has moved on, so the diff and the working tree must be read together; the coverage graph is unavailable, so STOP is graphless.

---

## 13. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference-status -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Ten-name switch set matches the resolver and `ADVISOR_DISABLED_FLAGS`; one index table still omits four `MK_` names |
| `checklist_evidence` | core | partial | 1 | Pass-five confirming brief checks covered; no packet checklist row names this area |
| `skill_agent` | overlay | notApplicable | - | no agent definition changed in this area |
| `agent_cross_runtime` | overlay | notApplicable | - | no runtime mirror changed in this area |
| `feature_catalog_code` | overlay | pass | 1 | CP-003 control command and the launcher/CLI fixtures checked against the resolver |
| `playbook_capability` | overlay | pass | 1 | CP-003's ten `-u` names match the complete env switch set |
<!-- /ANCHOR:cross-reference-status -->

---

## 14. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | D1-D4 | 2 | 0 P0, 0 P1, 0 P2 | complete (fix confirmed) |
| `.skilled/skills/system-skill-advisor/runtime/lib/README.md` | D1-D4 | 2 | 0 P0, 0 P1, 1 P2 | partial (section 4 fixed, section 3 gap) |
| `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts` | D1-D4 | 2 | 0 P0, 0 P1, 0 P2 | complete (fix confirmed) |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | D1-D4 | 2 | 0 P0, 0 P1, 0 P2 | complete (fix confirmed) |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | D1-D4 | 2 | 0 P0, 0 P1, 1 P2 | partial (both rows fixed; canonical index it points to still omits four names) |
<!-- /ANCHOR:files-under-review -->

---

## 15. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-kill-switch-cli-confirm-5b-1794780590351-ezt1v0, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-15T22:15:13Z
<!-- /ANCHOR:review-boundaries -->
