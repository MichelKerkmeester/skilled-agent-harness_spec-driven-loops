# Deep Review Strategy

## 1. REVIEW CHARTER

- Target: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub (spec-folder)
- Topic: Review: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub
- Dimensions: correctness, security, traceability, maintainability
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- Stop conditions: convergence threshold 0.1 on severity-weighted new-finding ratio, or max 7 iterations
- Success criteria: every configured dimension covered at least once; core traceability protocols (spec_code, checklist_evidence) recorded; no active P0 at synthesis
- Scope: 507 pre-bound files from review-scope-files.txt (fan-out root discovery)
- resource-map.md not present; skipping coverage gate

## 2. TOPIC

Review of the mcp-browser-use hub packet: Bladebro, Aside and Chrome DevTools browser modes routed through one hub, with both advisor stages passing.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not re-implementing or fixing anything found; findings only.
- Not reviewing files outside the pre-bound scope list.
- Not auditing the archived review packets under review-archive/.

## 5. STOP CONDITIONS

- Convergence threshold 0.1 reached with all four dimensions covered.
- Max iterations 7 reached.
- Three consecutive failed iterations (stop reason error).

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the advisor scorer change at the line level and then following its constants into `text.ts` and `lanes/lexical.ts`: the reach arithmetic (0.20 against a 0.18 floor) came out of the source, not out of a guess (iteration 1).
- Using the packet own completion criteria as the scope selector: the stale-id grep and the parent-skill checker both settled in one call each and left the rest of the budget for the scorer (iteration 1).
- `git show <commit> -- <path>` to separate what phase 014 changed from what was already there: it proved the `har` removal was complete and that the id-noun anchor was new code (iteration 1).
- Running the guard itself as a shell probe instead of reading it: `case "./tmp/../../etc" in ./tmp | ./tmp/*)` printed GUARD PASSES, which turned a suspicion into a demonstrated gap in one call (iteration 2).
- `diff` on the two `_utils.sh` copies: the phase 014 parity fix settled in one call and needed no further reading (iteration 2).
- Running each acceptance row verification command instead of trusting the Met cell: AC-013 named `OUT_DIR`, which the script does not define, and the command exited 1 with no output (iteration 3).
- Reading both registry snapshots in `review-archive/` to reconstruct the pre-014 and post-014 state: the closure gap showed up as a count change (21 open / 2 resolved to 33 open / 0 resolved) rather than as a claim to argue about (iteration 3).
- Reading the hub `SKILL.md` capability matrix against the mode packet it delegates to instead of against the goal text: the `page.on(...)` row at `SKILL.md:40` contradicts `mcp-aside-devtools/SKILL.md:202-203` in one comparison, and the hub own no-restatement rule at `SKILL.md:96` supplies the severity (iteration 4).
- `rg -o version` across the seven hub metadata files in one call: the README drift to `1.1.3.0` stood out as the single outlier against six `1.1.2.0` files and a `v1.1.2.0.md` changelog (iteration 4).
- Checking the generated `leaf-manifest.json` by reading it rather than by grepping for a packet-qualified path: the leaves are stored packet-relative under each mode `leaves` array, which turned an apparent dead reference into a clean ruled-out (iteration 4).
- Recomputing the hub `effectivePolicyHash` in memory with the hub own `compileRegistry` instead of trusting the manifest: the recorded `be9b1fe7…` matched the recomputed value, which settled a hand-edited-hash suspicion in one probe (iteration 5).
- Evaluating all 15 canary cases through the compiled `evaluateRoute` in memory: fixture-versus-router agreement became a 15-of-15 count rather than a reading exercise (iteration 5).
- `ls -ld .opencode/skills` before assuming a stale mirror: it is a symlink to `../.skilled/skills`, so the harness source root is canonical and the whole stale-copy hypothesis collapsed in one call (iteration 5).

## 9. WHAT FAILED

- Guessing the parent-skill checker path from the goal text: `.skilled/bin/parent-skill-check.cjs` does not exist, the real entry point is `.skilled/commands/doctor/scripts/parent-skill-check.cjs`. One wasted call (iteration 1).
- Reading the replay README before the CSV: the README summarises 48 PASS / 1 FAIL but only the CSV carries the `kind` column that decides whether the phase 014 criterion is met (iteration 1).
- Writing the iteration record as a hand-authored JSON literal: one unescaped quote made the gateway refuse the whole record with a parse error at position 4736. Building the record from a JS object in a script file avoids the class entirely (iteration 2).
- Assuming the parent review registry still sits at the path phase 014 names: it was moved into `review-archive/20261124T070727Z-restart/` by this run restart, so the first read failed with ENOENT and the archive had to be searched (iteration 3).
- Grepping `leaf-manifest.json` for a packet-qualified leaf path: the manifest stores leaves packet-relative, so the empty result looked like a dead reference until a direct read showed the entries (iteration 4).
- Trusting the phase 014 acceptance-criteria search scope as the fix boundary: AC-012 scoped its grep to the Aside packet, so the same wrong claim survived at the hub entry point and only a hub-level read found it (iteration 4).
- Writing a probe to `/tmp/probe2.cjs`: that is outside the lineage write surface. It was deleted in the same command that noticed it and every later probe lives inside the lineage directory (iteration 5).
- Reconstructing the `mcp-tooling` `compileRegistry` call by hand: the probe threw `SOURCE_IDENTITY_MISMATCH` at `registry-compiler.cjs:232` because it did not reproduce the harness call shape, so that hash was confirmed from the tree instead of by recomputation (iteration 5).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`ROUTER.md` routes to leaves that are not in the generated manifest.** Ruled out: all eight `RESOURCE_MAP` paths resolve and each is listed in `leaf-manifest.json` in packet-relative form. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`ROUTER.md` routes to leaves that are not in the generated manifest.** Ruled out: all eight `RESOURCE_MAP` paths resolve and each is listed in `leaf-manifest.json` in packet-relative form.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ROUTER.md` routes to leaves that are not in the generated manifest.** Ruled out: all eight `RESOURCE_MAP` paths resolve and each is listed in `leaf-manifest.json` in packet-relative form.

### **A mode has no recorded playbook run.** Ruled out: Bladebro has one report, Aside has seven, and Chrome DevTools has three with the aggregate table in the README. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A mode has no recorded playbook run.** Ruled out: Bladebro has one report, Aside has seven, and Chrome DevTools has three with the aggregate table in the README.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A mode has no recorded playbook run.** Ruled out: Bladebro has one report, Aside has seven, and Chrome DevTools has three with the aggregate table in the README.

### **Phase 014 dropped a finding.** Ruled out: `tasks.md` names the finding ids each task closes, so no finding is silently dropped; the gap is that the registry was not updated to match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Phase 014 dropped a finding.** Ruled out: `tasks.md` names the finding ids each task closes, so no finding is silently dropped; the gap is that the registry was not updated to match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 014 dropped a finding.** Ruled out: `tasks.md` names the finding ids each task closes, so no finding is silently dropped; the gap is that the registry was not updated to match.

### **Phase 014 hand-edited the `mcp-tooling` activation hash with no source change behind it.** Ruled out: phase 014 edited `.skilled/skills/mcp-code-mode/SKILL.md`, one of that hub's five compiled sources. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Phase 014 hand-edited the `mcp-tooling` activation hash with no source change behind it.** Ruled out: phase 014 edited `.skilled/skills/mcp-code-mode/SKILL.md`, one of that hub's five compiled sources.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 014 hand-edited the `mcp-tooling` activation hash with no source change behind it.** Ruled out: phase 014 edited `.skilled/skills/mcp-code-mode/SKILL.md`, one of that hub's five compiled sources.

### **The `har` removal is incomplete.** Ruled out: both the explicit token boost and the lexical category hint were removed in the same change. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The `har` removal is incomplete.** Ruled out: both the explicit token boost and the lexical category hint were removed in the same change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `har` removal is incomplete.** Ruled out: both the explicit token boost and the lexical category hint were removed in the same change.

### **The Bladebro install gate runs package code before the digest check.** Ruled out: `--ignore-scripts` is on the install, and the first `--version` call is after all three `verify_digest` calls. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The Bladebro install gate runs package code before the digest check.** Ruled out: `--ignore-scripts` is on the install, and the first `--version` call is after all three `verify_digest` calls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Bladebro install gate runs package code before the digest check.** Ruled out: `--ignore-scripts` is on the install, and the first `--version` call is after all three `verify_digest` calls.

### **The browser hub is still lifted on out-of-domain prompts.** Ruled out for the hub itself: `mcp-browser-use` ends in `use`, which is three characters, so `promptNamesIdNoun` returns false and the anchor cannot fire for it. The residual defect is the same class for other skills, recorded as P1 finding 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The browser hub is still lifted on out-of-domain prompts.** Ruled out for the hub itself: `mcp-browser-use` ends in `use`, which is three characters, so `promptNamesIdNoun` returns false and the anchor cannot fire for it. The residual defect is the same class for other skills, recorded as P1 finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The browser hub is still lifted on out-of-domain prompts.** Ruled out for the hub itself: `mcp-browser-use` ends in `use`, which is three characters, so `promptNamesIdNoun` returns false and the anchor cannot fire for it. The residual defect is the same class for other skills, recorded as P1 finding 1.

### **The canary fixture's declared gold disagrees with the compiled router.** Ruled out: 15 of 15 cases agree. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The canary fixture's declared gold disagrees with the compiled router.** Ruled out: 15 of 15 cases agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The canary fixture's declared gold disagrees with the compiled router.** Ruled out: 15 of 15 cases agree.

### **The changelog convention is broken.** Ruled out: `SKILL.md`, `ROUTER.md`, `description.json`, `mode-registry.json` and `hub-router.json` all match the newest changelog entry at 1.1.2.0. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The changelog convention is broken.** Ruled out: `SKILL.md`, `ROUTER.md`, `description.json`, `mode-registry.json` and `hub-router.json` all match the newest changelog entry at 1.1.2.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The changelog convention is broken.** Ruled out: `SKILL.md`, `ROUTER.md`, `description.json`, `mode-registry.json` and `hub-router.json` all match the newest changelog entry at 1.1.2.0.

### **The Chrome DevTools install is unpinned.** Ruled out: `MCP_PACKAGE="browser-debugger-cli@0.6.10"` at `install.sh:30`, and `browser-debugger-cli@alpha` has no match in the packet outside changelog and benchmark reports. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The Chrome DevTools install is unpinned.** Ruled out: `MCP_PACKAGE="browser-debugger-cli@0.6.10"` at `install.sh:30`, and `browser-debugger-cli@alpha` has no match in the packet outside changelog and benchmark reports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Chrome DevTools install is unpinned.** Ruled out: `MCP_PACKAGE="browser-debugger-cli@0.6.10"` at `install.sh:30`, and `browser-debugger-cli@alpha` has no match in the packet outside changelog and benchmark reports.

### **The ClickUp evidence citations are broken.** Ruled out: every path the README cites resolves under the playbook, and every `results.csv` row discloses that raw output was not retained. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The ClickUp evidence citations are broken.** Ruled out: every path the README cites resolves under the playbook, and every `results.csv` row discloses that raw output was not retained.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The ClickUp evidence citations are broken.** Ruled out: every path the README cites resolves under the playbook, and every `results.csv` row discloses that raw output was not retained.

### **The compiled destination graph carries a mode the hub registry does not.** Ruled out: three destinations, three registry modes, identical ids. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The compiled destination graph carries a mode the hub registry does not.** Ruled out: three destinations, three registry modes, identical ids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The compiled destination graph carries a mode the hub registry does not.** Ruled out: three destinations, three registry modes, identical ids.

### **The compiled policy card can attest live activation.** Ruled out: the card is stamped `DOCUMENT_ONLY_UNATTESTED` and replay returns `PREPARED_DRAFT`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The compiled policy card can attest live activation.** Ruled out: the card is stamped `DOCUMENT_ONLY_UNATTESTED` and replay returns `PREPARED_DRAFT`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The compiled policy card can attest live activation.** Ruled out: the card is stamped `DOCUMENT_ONLY_UNATTESTED` and replay returns `PREPARED_DRAFT`.

### **The compiled policy is stale against the hub sources.** Ruled out: the recomputed hash equals the recorded hash. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The compiled policy is stale against the hub sources.** Ruled out: the recomputed hash equals the recorded hash.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The compiled policy is stale against the hub sources.** Ruled out: the recomputed hash equals the recorded hash.

### **The harness compiles from a stale `.opencode` mirror.** Ruled out: `.opencode/skills` is a symlink to `../.skilled/skills`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The harness compiles from a stale `.opencode` mirror.** Ruled out: `.opencode/skills` is a symlink to `../.skilled/skills`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The harness compiles from a stale `.opencode` mirror.** Ruled out: `.opencode/skills` is a symlink to `../.skilled/skills`.

### **The hub `SKILL.md` Layout block lists a folder that does not exist.** Ruled out: `shared/` and every other listed entry exist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The hub `SKILL.md` Layout block lists a folder that does not exist.** Ruled out: `shared/` and every other listed entry exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hub `SKILL.md` Layout block lists a folder that does not exist.** Ruled out: `shared/` and every other listed entry exist.

### **The hub declares a second advisor identity.** Ruled out: `description.json` carries one identity and `mode-registry.json` sets `routingClass: metadata` on every mode. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The hub declares a second advisor identity.** Ruled out: `description.json` carries one identity and `mode-registry.json` sets `routingClass: metadata` on every mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hub declares a second advisor identity.** Ruled out: `description.json` carries one identity and `mode-registry.json` sets `routingClass: metadata` on every mode.

### **The installer parity fix is one-sided.** Ruled out: the two `_utils.sh` copies are byte-identical. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The installer parity fix is one-sided.** Ruled out: the two `_utils.sh` copies are byte-identical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The installer parity fix is one-sided.** Ruled out: the two `_utils.sh` copies are byte-identical.

### **The mode registry and hub router disagree on mode count.** Ruled out: both carry three modes and the parent-skill checker's `10d-reachability` and `12b-routing-shape` checks pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The mode registry and hub router disagree on mode count.** Ruled out: both carry three modes and the parent-skill checker's `10d-reachability` and `12b-routing-shape` checks pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The mode registry and hub router disagree on mode count.** Ruled out: both carry three modes and the parent-skill checker's `10d-reachability` and `12b-routing-shape` checks pass.

### **The parent goal's stale-id criterion regressed.** Ruled out in iteration 1 and re-confirmed here: the search prints no match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The parent goal's stale-id criterion regressed.** Ruled out in iteration 1 and re-confirmed here: the search prints no match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The parent goal's stale-id criterion regressed.** Ruled out in iteration 1 and re-confirmed here: the search prints no match.

### **The serving-closure manifest is incomplete.** Ruled out: `fileCount` matches the array, every listed file exists, and the two unlisted files are test fixtures. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The serving-closure manifest is incomplete.** Ruled out: `fileCount` matches the array, every listed file exists, and the two unlisted files are test fixtures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The serving-closure manifest is incomplete.** Ruled out: `fileCount` matches the array, every listed file exists, and the two unlisted files are test fixtures.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- The browser hub is still lifted on out-of-domain prompts: `mcp-browser-use` ends in `use`, three characters, so `promptNamesIdNoun` returns false and the anchor cannot fire for it (iteration 1, evidence: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332-335`).
- The `har` removal is incomplete: both the explicit `TOKEN_BOOSTS` entry and the `mcp-browser-use` lexical category hint were removed in the same change (iteration 1, evidence: `git show dbea9ff4a25 -- lanes/explicit.ts lanes/lexical.ts`).
- The mode registry and hub router disagree on mode count: both carry three modes and `10d-reachability` plus `12b-routing-shape` pass (iteration 1, evidence: `.skilled/commands/doctor/scripts/parent-skill-check.cjs`).
- Phase 014 completion criterion contradicts the replay: not a contradiction, `MBU-PB-04` is `kind=playbook`, outside the three kinds the criterion names (iteration 1, evidence: `results.csv:38`).
- The Bladebro install gate runs package code before the digest check: `--ignore-scripts` is on the install and all three `verify_digest` calls precede the first `--version` (iteration 2, evidence: `install.sh:151-190`).
- The Chrome DevTools install is unpinned: `install.sh:30` pins `browser-debugger-cli@0.6.10` and `browser-debugger-cli@alpha` has no match outside changelog and benchmark reports (iteration 2).
- The installer parity fix is one-sided: the two `_utils.sh` copies are byte-identical (iteration 2).
- The compiled policy card can attest live activation: the card is stamped `DOCUMENT_ONLY_UNATTESTED` and replay returns `PREPARED_DRAFT` (iteration 2, evidence: `policy-card.cjs:22-52`).
- A mode has no recorded playbook run: Bladebro has one report, Aside has seven, Chrome DevTools has three with the aggregate table in the README (iteration 3).
- The ClickUp evidence citations are broken: every cited path resolves and every `results.csv` row discloses that raw output was not retained (iteration 3).
- Phase 014 dropped a finding: `tasks.md` names the finding ids each task closes, so no finding is silently dropped (iteration 3, evidence: `tasks.md:45-64`).
- `ROUTER.md` routes to leaves that are not in the generated manifest: all eight `RESOURCE_MAP` paths resolve on disk and each is listed in `leaf-manifest.json` in packet-relative form (iteration 4, evidence: `.skilled/skills/mcp-browser-use/ROUTER.md:60-80`).
- The hub declares a second advisor identity: `description.json` carries one identity and `mode-registry.json` sets `routingClass: metadata` on every mode (iteration 4).
- The hub `SKILL.md` Layout block lists a folder that does not exist: `shared/` and every other listed entry exist (iteration 4).
- The changelog convention is broken: `SKILL.md`, `ROUTER.md`, `description.json`, `mode-registry.json` and `hub-router.json` all match the newest changelog entry at `1.1.2.0`; the README is the single outlier and is recorded as finding R4-P2-009 (iteration 4).
- The compiled policy is stale against the hub sources: the recomputed `effectivePolicyHash` equals the recorded `be9b1fe7…` (iteration 5).
- The harness compiles from a stale `.opencode` mirror: `.opencode/skills` is a symlink to `../.skilled/skills` and the three hub sources are identical across both roots (iteration 5).
- The compiled destination graph carries a mode the hub registry does not: three destinations, `skillId` `mcp-browser-use`, the three registry `workflowMode` ids (iteration 5).
- The canary fixture declared gold disagrees with the compiled router: 15 of 15 cases agree on action and mode set (iteration 5).
- Phase 014 hand-edited the `mcp-tooling` activation hash with no source change behind it: phase 014 edited `.skilled/skills/mcp-code-mode/SKILL.md`, one of that hub five compiled sources (iteration 5).
- The serving-closure manifest is incomplete: `fileCount` 69 equals the 69-entry array, no listed file is missing, and the two unlisted files are test fixtures (iteration 5).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining
- Focus area: synthesis
- Reason: iteration 5 recorded a new-findings ratio of 0.0, so the convergence threshold of 0.10 is met and the loop stopped legally at iteration 5 of 7
- Rotation status: all four configured dimensions complete; one cross-reference pass complete
- Blocked/productive carry-forward: validate.sh --strict --recursive stays blocked for this lineage and is left to the cross-lineage merge; three P1 findings stay active and hold the verdict at CONDITIONAL
- Required evidence: none further; synthesis read the registry, the five iteration artifacts and this strategy

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/mcp-browser-use/` (hub SKILL.md, hub-router.json, mode-registry.json, leaf-manifest.json, leaf-scopes.json, description.json, graph-metadata.json, three mode folders, manual-testing-playbook, benchmark, changelog); `.skilled/skills/mcp-tooling/` registries; `.skilled/bin/lib/compiled-routing/`; `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts`; the packet docs under `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/`.
- Behavior claims: three modes only in the browser hub registry, six in mcp-tooling; no `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` ids anywhere under `.skilled` outside changelog and benchmark/reports; parent-skill checker exits 0 naming the hub; one real browser request per mode returns mcp-browser-use from the advisor and the mode from the hub router; each mode has a manual testing playbook with a recorded run including a live Bladebro run on macOS; validate.sh --strict --recursive passes.
- Reuse and conventions: two-stage routing (advisor stage then hub router stage); compiled-routing artifacts under `.skilled/bin/lib/compiled-routing/`; changelog-per-skill convention.
- Review risks and gaps: 507 pre-bound files is a wide surface; the operator focus narrows it to shipped phase work against goal criteria, the phase 014 fixes and the advisor scorer change.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Parent goal criteria for mode counts, stale ids and the parent-skill checker all hold on the tree |
| `checklist_evidence` | core | partial | 3 | 19 of 20 acceptance rows hold; AC-013 names a verification command that cannot produce its evidence, and the replay criterion holds only under a kind-scoped reading |
| `playbook_capability` | overlay | partial | 3 | All three modes have a recorded run; the Chrome DevTools run is 4 PASS / 13 FAIL and the failing scenario text was not corrected |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | D1 | 1 | 1 P1 | partial |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mode-registry.json` | D1 | 1 | 0 | complete |
| `.skilled/skills/mcp-browser-use/hub-router.json` | D1 | 1 | 0 | complete |
| `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv` | D1 | 1 | 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh` | D2 | 2 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh` | D2 | 2 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` | D2 | 2 | 1 P1, 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh` | D2 | 2 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/doctor.sh` | D2 | 2 | 0 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs` | D2 | 2 | 0 | complete |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` | D3 | 3 | 1 P2 | partial |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md` | D3 | 3 | 1 P2 | partial |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/tasks.md` | D3 | 3 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md` | D3 | 3 | 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/SKILL.md` | D4 | 4 | 1 P1 | partial |
| `.skilled/skills/mcp-browser-use/README.md` | D4 | 4 | 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/ROUTER.md` | D4 | 4 | 0 | complete |
| `.skilled/skills/mcp-browser-use/description.json` | D4 | 4 | 0 | complete |
| `.skilled/skills/mcp-browser-use/leaf-scopes.json` | D4 | 4 | 0 | complete |
| `.skilled/skills/mcp-browser-use/leaf-manifest.json` | D4 | 4 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md` | D4 | 4 | 0 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` | X | 5 | 0 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs` | X | 5 | 0 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` | X | 5 | 0 | complete |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json` | X | 5 | 0 | complete |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-tooling/manifest.json` | X | 5 | 0 | complete |
| `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` | X | 5 | 0 | complete |
| `.skilled/skills/mcp-browser-use/graph-metadata.json` | X | 5 | 0 | complete |
| `.skilled/skills/mcp-tooling/hub-router.json` | X | 5 | 0 | complete |
| `.skilled/skills/mcp-tooling/mode-registry.json` | X | 5 | 0 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-2-1795504079797-ay97sx, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T07:08:51.849Z
<!-- MACHINE-OWNED: END -->
