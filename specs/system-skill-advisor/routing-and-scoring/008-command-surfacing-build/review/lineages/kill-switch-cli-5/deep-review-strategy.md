# Deep Review Strategy - kill-switch-cli-5 Lineage

## 1. REVIEW CHARTER

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder target)
- Fan-out lineage: `kill-switch-cli-5` (artifact dir `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/kill-switch-cli-5`); pass-five area is `kill-switch-cli`
- Dimensions: correctness, security, traceability, maintainability
- Stop conditions: legal convergence at `convergenceThreshold=0.10`, or `maxIterations=4`, whichever comes first
- Success criteria: every pass-five area file reviewed; every finding carries `file:line` and a concrete input; the kill switch and direct-call switch are checked against every path they claim to stop; docs that disagree with code are reported; holdout hygiene is counts-only
- Review focus (operator bound): pass-five code review of command surfacing. Read `review-brief-5.txt` in the packet first and follow it. Review the files whose area is `kill-switch-cli` plus shared docs that describe them. Check the advisor kill switch and the direct-call off switch, the CLI client check, the launcher child-env allowlist, the flags-file resolver, the manual disable scenario, the handler path, the tests that pin the switch, and docs that disagree with code. Never open `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl` except through `jq del(.prompt)`, and print counts only.
- Resource map: `resource-map.md` not present; skipping coverage gate

---

## 2. TOPIC

Advisor kill-switch and direct-call switch behaviour for the routed skill/command advisor, restricted to the pass-five `kill-switch-cli` area: the shared disable resolver, the CLI client abstain path, the daemon handler abstain path, the launcher child-env filter, the manual disable scenario, the docs that describe the switches, and the tests that pin them.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- Not reviewing `vibe-hooks-doctor`, `accuracy-runner` or `docs-metadata` area files except as read-only context when a cross-area contract is required
- Not reviewing `runtime/lib/command-attach.ts` (not in the pass-five scope list); command-offer fit is noted only as out-of-scope context
- Not fixing anything: the review is observation-only
- Not reading or printing holdout prompt text; holdout coverage is counts-only
- Not running repo tooling that writes outside the lineage; runners are audited by reading

---

## 5. STOP CONDITIONS

- Legal convergence (all dimensions covered plus stabilization) at or below `convergenceThreshold`
- `maxIterations=4` reached (`stopReason: maxIterationsReached`)
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
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 6. WHAT WORKED
- Reading the resolver and both call sites together confirmed the switch decision precedes every daemon and scorer path; the no-daemon test pins the CLI half (iteration 1).
- Probing the built CLI read-only under four switch names (canonical, master, SPECKIT_ alias, MK_ alias) confirmed the envelope and the abstain reason without starting a daemon (iteration 1).
- Reading the CLI JSON manifest after the candidate workspace-root bypass showed `advisor_recommend` does not admit `workspaceRoot` at all, so the bypass has no reach and was ruled out (iteration 1).
- Reading the launcher child-env filter against the pass-five diff confirmed the two switch names were removed from the exact-set allowlist (iteration 1).
- Comparing the resolver's `MASTER_ALIASES` and `LEGACY_ALIASES` against the env index and the hooks README found the alias-column drift in one place instead of two guessed ones (iteration 2).
- Reading CP-003's control command against the full alias set found a scenario defect that a switch-only read would miss; the read-only probe reproduced it under `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` (iteration 2).
- Reading each test fixture against `ADVISOR_DISABLED_FLAGS` rather than the test name found both boundary gaps: the launcher fixture sets two names and the CLI loop excludes the `MK_` set (iteration 3).
- Listing `runtime/lib/*.ts` against the README tree found five missing modules and a second disagreement with the key-files table (iteration 3).
- Replaying the six active sites instead of opening a new direction confirmed the set is stable and that no P2 was silently downgraded in synthesis (iteration 4).
- Reading the holdout files through `jq del(.prompt)` for counts only kept the hygiene rule while proving the files are present (224/63/36 rows) (iteration 4).

---

## 7. WHAT FAILED
- Checking `disabledRecommendOutput` alone made the workspace-root bypass look live; the CLI schema and the handler parse boundaries were needed to disprove it (iteration 1).
- Reading the ENV-REFERENCE preamble as a licence to ignore the Source column was too generous: the row's own description claims the direct call, so the direct-call surface still has to be named (iteration 2).
- Trusting the launcher test's name ("keeps the per-request advisor switch out of the daemon env") instead of its fixture would have marked the whole switch set covered; the fixture names only two keys (iteration 3).
- No clean route to a graph-backed convergence existed: the coverage graph stayed unavailable, so the run must stop at `maxIterationsReached` rather than claim `converged` (iteration 4).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`INSTALL-GUIDE.md` rollback table is wrong**: it names `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` as the switch; the resolver honors it and the CLI abstains under it. Ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`INSTALL-GUIDE.md` rollback table is wrong**: it names `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` as the switch; the resolver honors it and the CLI abstains under it. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`INSTALL-GUIDE.md` rollback table is wrong**: it names `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` as the switch; the resolver honors it and the CLI abstains under it. Ruled out.

### **`runtime/lib/command-attach.ts` refusal/question/history behavior**: out of the pass-five declared file scope (not in `review-scope-5.txt`); read only as context and not reported as a finding. The scope note is recorded rather than converted into a silent pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`runtime/lib/command-attach.ts` refusal/question/history behavior**: out of the pass-five declared file scope (not in `review-scope-5.txt`); read only as context and not reported as a finding. The scope note is recorded rather than converted into a silent pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`runtime/lib/command-attach.ts` refusal/question/history behavior**: out of the pass-five declared file scope (not in `review-scope-5.txt`); read only as context and not reported as a finding. The scope note is recorded rather than converted into a silent pass.

### **A finding against the Python shim's canonical-name handling**: CP-003 uses the name the shim honors, and the shim is out of the pass-five scope. Ruled out for this lineage. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A finding against the Python shim's canonical-name handling**: CP-003 uses the name the shim honors, and the shim is out of the pass-five scope. Ruled out for this lineage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding against the Python shim's canonical-name handling**: CP-003 uses the name the shim honors, and the shim is out of the pass-five scope. Ruled out for this lineage.

### **A missed switch path in `advisor_status` or the graph tools**: the docs claim the switch for prompt injection and the `advisor_recommend` direct call, not for status or graph maintenance `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75]` `[SOURCE: .skilled/hooks/hook-flags.env.example:47]`. Ruled out as outside the stated contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A missed switch path in `advisor_status` or the graph tools**: the docs claim the switch for prompt injection and the `advisor_recommend` direct call, not for status or graph maintenance `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75]` `[SOURCE: .skilled/hooks/hook-flags.env.example:47]`. Ruled out as outside the stated contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missed switch path in `advisor_status` or the graph tools**: the docs claim the switch for prompt injection and the `advisor_recommend` direct call, not for status or graph maintenance `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75]` `[SOURCE: .skilled/hooks/hook-flags.env.example:47]`. Ruled out as outside the stated contract.

### **A new finding in the holdout path**: no prompt row was opened or printed; the counts-only check shows the three files are present and non-empty, and no doc or test under review reads them. Ruled out. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A new finding in the holdout path**: no prompt row was opened or printed; the counts-only check shows the three files are present and non-empty, and no doc or test under review reads them. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new finding in the holdout path**: no prompt row was opened or printed; the counts-only check shows the three files are present and non-empty, and no doc or test under review reads them. Ruled out.

### **A new test is needed for every alias in both files**: the CLI loop already parameterizes every non-`MK_` name; the fix is to stop excluding the three `MK_` names and assert the abstain, not to duplicate the loop. Ruled out as over-testing. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A new test is needed for every alias in both files**: the CLI loop already parameterizes every non-`MK_` name; the fix is to stop excluding the three `MK_` names and assert the abstain, not to duplicate the loop. Ruled out as over-testing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new test is needed for every alias in both files**: the CLI loop already parameterizes every non-`MK_` name; the fix is to stop excluding the three `MK_` names and assert the abstain, not to duplicate the loop. Ruled out as over-testing.

### **A P1 for the plugin's reason label**: behavior is disabled correctly; only the diagnostic string is imprecise, and the plugin is outside the pass-five file list. Recorded as an edge case, not raised to P1. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A P1 for the plugin's reason label**: behavior is disabled correctly; only the diagnostic string is imprecise, and the plugin is outside the pass-five file list. Recorded as an edge case, not raised to P1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A P1 for the plugin's reason label**: behavior is disabled correctly; only the diagnostic string is imprecise, and the plugin is outside the pass-five file list. Recorded as an edge case, not raised to P1.

### **A project-level `hook-flags.env` disables the shared daemon for every caller**: the handler passes `{}` as the explicit config, so `hookFlagDecision` uses the daemon's own environment only `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:235-242]`. Ruled out by design; the docs statement that the client reads the file and the daemon reads its own environment is consistent `[SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23]`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A project-level `hook-flags.env` disables the shared daemon for every caller**: the handler passes `{}` as the explicit config, so `hookFlagDecision` uses the daemon's own environment only `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:235-242]`. Ruled out by design; the docs statement that the client reads the file and the daemon reads its own environment is consistent `[SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A project-level `hook-flags.env` disables the shared daemon for every caller**: the handler passes `{}` as the explicit config, so `hookFlagDecision` uses the daemon's own environment only `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:235-242]`. Ruled out by design; the docs statement that the client reads the file and the daemon reads its own environment is consistent `[SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23]`.

### **A prompt or holdout row is quoted in any doc**: no holdout or prompt file was opened; the switch docs cite no prompt text. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A prompt or holdout row is quoted in any doc**: no holdout or prompt file was opened; the switch docs cite no prompt text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A prompt or holdout row is quoted in any doc**: no holdout or prompt file was opened; the switch docs cite no prompt text.

### **Disabled envelope bypasses the workspace allowlist**: `requestWorkspaceRoot` in `disabledRecommendOutput` does not call `isAllowedWorkspaceRoot` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:169-172]`, but the CLI's `advisor_recommend` JSON schema accepts only `prompt` and `options` with `additionalProperties: false` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:43-64]`, and the handler Zod-parses `BoundedWorkspaceRootSchema` before the disabled check `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:285-303]`. No reachable caller supplies an unvalidated root to the disabled envelope. Ruled out, not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Disabled envelope bypasses the workspace allowlist**: `requestWorkspaceRoot` in `disabledRecommendOutput` does not call `isAllowedWorkspaceRoot` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:169-172]`, but the CLI's `advisor_recommend` JSON schema accepts only `prompt` and `options` with `additionalProperties: false` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:43-64]`, and the handler Zod-parses `BoundedWorkspaceRootSchema` before the disabled check `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:285-303]`. No reachable caller supplies an unvalidated root to the disabled envelope. Ruled out, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Disabled envelope bypasses the workspace allowlist**: `requestWorkspaceRoot` in `disabledRecommendOutput` does not call `isAllowedWorkspaceRoot` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:169-172]`, but the CLI's `advisor_recommend` JSON schema accepts only `prompt` and `options` with `additionalProperties: false` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:43-64]`, and the handler Zod-parses `BoundedWorkspaceRootSchema` before the disabled check `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:285-303]`. No reachable caller supplies an unvalidated root to the disabled envelope. Ruled out, not a finding.

### **The `MK_` filter is needed because the alias cannot work**: the resolver bridges `MK_` onto `SYSTEM_` at load `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:20-49]` and the CLI probe under `MK_SKILL_ADVISOR_DISABLED=1` abstains with the canonical reason; the filter is a string-reason convenience, not a behavior exclusion. Ruled out as a behavior finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `MK_` filter is needed because the alias cannot work**: the resolver bridges `MK_` onto `SYSTEM_` at load `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:20-49]` and the CLI probe under `MK_SKILL_ADVISOR_DISABLED=1` abstains with the canonical reason; the filter is a string-reason convenience, not a behavior exclusion. Ruled out as a behavior finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `MK_` filter is needed because the alias cannot work**: the resolver bridges `MK_` onto `SYSTEM_` at load `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:20-49]` and the CLI probe under `MK_SKILL_ADVISOR_DISABLED=1` abstains with the canonical reason; the filter is a string-reason convenience, not a behavior exclusion. Ruled out as a behavior finding.

### **The alias list in `hook-flags.env.example` is incomplete**: the file is a canonical-name checklist, not an alias index; its header points to `.skilled/hooks/README.md` for the canonical index `[SOURCE: .skilled/hooks/hook-flags.env.example:12-15]`. Ruled out as a doc defect in the example; the drift is in the index tables that claim completeness. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The alias list in `hook-flags.env.example` is incomplete**: the file is a canonical-name checklist, not an alias index; its header points to `.skilled/hooks/README.md` for the canonical index `[SOURCE: .skilled/hooks/hook-flags.env.example:12-15]`. Ruled out as a doc defect in the example; the drift is in the index tables that claim completeness.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The alias list in `hook-flags.env.example` is incomplete**: the file is a canonical-name checklist, not an alias index; its header points to `.skilled/hooks/README.md` for the canonical index `[SOURCE: .skilled/hooks/hook-flags.env.example:12-15]`. Ruled out as a doc defect in the example; the drift is in the index tables that claim completeness.

### **The changelog overstates the launcher change**: the launcher child-env allowlist no longer carries a switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189]`, matching "The launcher passes no switch name to a daemon it starts" `[SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:73]`. Ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The changelog overstates the launcher change**: the launcher child-env allowlist no longer carries a switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189]`, matching "The launcher passes no switch name to a daemon it starts" `[SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:73]`. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The changelog overstates the launcher change**: the launcher child-env allowlist no longer carries a switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189]`, matching "The launcher passes no switch name to a daemon it starts" `[SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:73]`. Ruled out.

### **The launcher filter itself still forwards a switch**: the allowlist contains no switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189]`; the finding is the test fixture, not the filter. Ruled out as a code finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The launcher filter itself still forwards a switch**: the allowlist contains no switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189]`; the finding is the test fixture, not the filter. Ruled out as a code finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The launcher filter itself still forwards a switch**: the allowlist contains no switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189]`; the finding is the test fixture, not the filter. Ruled out as a code finding.

### **The launcher still forwards a switch to the daemon**: the pass-five diff removed `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` from `CHILD_ENV_ALLOWLIST`, and the filter is exact-set membership `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189,312-315]`. The remaining switch names are not in the set either. Ruled out for the names inspected; the test-coverage gap for the other names is carried to the maintainability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The launcher still forwards a switch to the daemon**: the pass-five diff removed `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` from `CHILD_ENV_ALLOWLIST`, and the filter is exact-set membership `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189,312-315]`. The remaining switch names are not in the set either. Ruled out for the names inspected; the test-coverage gap for the other names is carried to the maintainability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The launcher still forwards a switch to the daemon**: the pass-five diff removed `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` from `CHILD_ENV_ALLOWLIST`, and the filter is exact-set membership `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189,312-315]`. The remaining switch names are not in the set either. Ruled out for the names inspected; the test-coverage gap for the other names is carried to the maintainability iteration.

### **The Python shim's `SPECKIT_`-only reader contradicts CP-003**: CP-003's shim step uses exactly `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:55]`, and the shim honors that name and value `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:210,5491]`. The broader canonical-name question belongs to the shim's own area and is noted as an edge case, not a finding here. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The Python shim's `SPECKIT_`-only reader contradicts CP-003**: CP-003's shim step uses exactly `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:55]`, and the shim honors that name and value `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:210,5491]`. The broader canonical-name question belongs to the shim's own area and is noted as an edge case, not a finding here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Python shim's `SPECKIT_`-only reader contradicts CP-003**: CP-003's shim step uses exactly `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:55]`, and the shim honors that name and value `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:210,5491]`. The broader canonical-name question belongs to the shim's own area and is noted as an edge case, not a finding here.

### **The README's folder list is a file list and must name every folder**: the package topology is explicitly a folder map `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:54-76]`, and the flat-module tree is the file map. Ruled out for folders; the five flat modules are the finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The README's folder list is a file list and must name every folder**: the package topology is explicitly a folder map `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:54-76]`, and the flat-module tree is the file map. Ruled out for folders; the five flat modules are the finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The README's folder list is a file list and must name every folder**: the package topology is explicitly a folder map `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:54-76]`, and the flat-module tree is the file map. Ruled out for folders; the five flat modules are the finding.

### **The switch leaks the prompt through the abstain reason**: the reason is `Skill advisor disabled by <switch key>.`; the key comes from the resolver's constant names, never from prompt text `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:150-178]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-285]`. Ruled out. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The switch leaks the prompt through the abstain reason**: the reason is `Skill advisor disabled by <switch key>.`; the key comes from the resolver's constant names, never from prompt text `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:150-178]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-285]`. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The switch leaks the prompt through the abstain reason**: the reason is `Skill advisor disabled by <switch key>.`; the key comes from the resolver's constant names, never from prompt text `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:150-178]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-285]`. Ruled out.

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
- Dimension: none; all four dimensions are covered and the run reached `maxIterations=4`. - Focus area: synthesis and the closeout record, not another dispatch. - Reason: the final iteration found no new finding; the active set is six P2 advisories, so the verdict is PASS with `hasAdvisories: true`. The legal stop reason is `maxIterationsReached`, because the coverage graph is unavailable and no graph-backed convergence decision exists. - Rotation status: D1, D2, D3 and D4 covered; no new dimension remains. - Required evidence: the six active findings, the four iteration files, the four deltas and the reducer's final registry. - Recovery note: the run did not claim a graph-backed convergence; the report must say the stop reason is `maxIterationsReached` and that the P2s remain advisories. Review verdict: PASS

<!-- /ANCHOR:next-focus -->

---

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 13 pass-five `kill-switch-cli` files listed in `review/review-scope-5.txt`, plus the shared docs that describe them (`INSTALL-GUIDE.md`, `feature-catalog/cli-surface/advisor-recommend.md`, `changelog/v1.1.0.0.md`, `.skilled/hooks/README.md`) and the pass-four lineage context.
- Behavior claims to verify: `SYSTEM_SKILL_ADVISOR_DISABLED` and its aliases plus `SYSTEM_HOOKS_DISABLED` make a direct `advisor_recommend` call abstain before any daemon starts or the scorer runs; the launcher passes no switch name to a daemon it starts; a flags-file entry disables the caller; a caller's `0` beats the file; the disabled envelope carries empty recommendations, `freshness: unavailable`, `ADVISOR_DISABLED` and no prompt text.
- Reuse and conventions: `hook-flags.cjs` is the single resolver (`MASTER_FLAG`, `MASTER_ALIASES`, `LEGACY_ALIASES`, `concernFlag`, `hookFlagDecision`); `advisor-disabled.ts` is the shared envelope builder; `ADVISOR_DISABLED_FLAGS` is the caller-side strip list.
- Review risks and gaps: the pass-five scope is a changed-file list, not a module map; `runtime/lib/command-attach.ts` and the Python shim are out of scope even though they touch the switch; the coverage graph is unavailable, so STOP is graphless.

---

## 13. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference-status -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | kill-switch claims vs resolver and CLI/handler |
| `checklist_evidence` | core | pending | - | pass-five brief checks against reviewed files |
| `skill_agent` | overlay | notApplicable | - | no agent definition changed in this area |
| `agent_cross_runtime` | overlay | notApplicable | - | no runtime mirror changed in this area |
| `feature_catalog_code` | overlay | pending | - | feature catalog rows that describe the switches |
| `playbook_capability` | overlay | pending | - | CP-003 scenario commands vs the resolver |
<!-- /ANCHOR:cross-reference-status -->

---

## 14. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | - | - | - | pending |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | - | - | - | pending |
| `.skilled/hooks/hook-flags.env.example` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/README.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/advisor-disabled.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts` | - | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | - | - | - | pending |
<!-- /ANCHOR:files-under-review -->

---

## 15. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 4
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-kill-switch-cli-5-1794760565927-i99t40, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-15T16:45:27Z
<!-- /ANCHOR:review-boundaries -->
