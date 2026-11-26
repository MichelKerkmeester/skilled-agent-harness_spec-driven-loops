---
title: Deep Review Strategy - mcp-browser-use hub
description: Runtime strategy for the vibe-1 fan-out lineage reviewing the mcp-browser-use hub packet against its goal criteria.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - mcp-browser-use hub (lineage vibe-1)

## 1. REVIEW CHARTER

- **Target**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder, Level 2, 14 phase children)
- **Dimensions**: correctness, security, traceability, maintainability
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- **Stop conditions**: convergence at 0.10 weighted severity ratio, or max 7 iterations
- **Success criteria**: no active P0; every goal criterion in `goal.md` §3 traced to shipped evidence; the 014 fixes verified at their source; the advisor scorer change verified against its stated intent

---

## 2. TOPIC

Review of the `mcp-browser-use` hub packet: three browser modes (Bladebro, Aside, Chrome DevTools) relocated out of `mcp-tooling` into a new hub skill, routed through both advisor stages, with playbooks, changelogs, benchmark reports and a compiled routing engine.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-litigating the 2026-11-24 deep review's 28 findings: 014 claims to have fixed them; this run verifies the fixes rather than re-deriving the findings.
- Reviewing `mcp-tooling`'s six remaining modes for their own quality; only their browser-pointer edits are in scope.
- Reviewing the archived `specs/sk-doc/z_archive/` copies; they are historical.
- Running the repository's build, test or validation tooling; findings come from reading the shipped files.

---

## 5. STOP CONDITIONS

- Convergence: weighted new-finding ratio below 0.10 with all four dimensions covered.
- Max iterations: 7.
- Any active P0 keeps the verdict at FAIL regardless of convergence.

---

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
- P1 (Required): 4
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Executing the shipped router read-only (`node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt ...`) instead of reading it: one call turned a suspected scoring asymmetry into a decisive P1 with a reproducible case (iteration 1).
- Reading the compiler that builds the routing model (`registry-compiler.cjs`) alongside the router that consumes it: it proved a three-mode bundle rule exists, which isolated the cause to scoring rather than bundle construction (iteration 1).
- Checking a mirror-dependency suspicion with `stat` inode identity instead of assuming drift: `.opencode/skills` is a symlink to `../.skilled/skills`, so the candidate finding collapsed before it was written (iteration 2).
- Reading the admission corpus beside the resolver that names it as admission evidence: it turned a coverage question into a P1 with a named gate (iteration 2).
- Parsing the replay CSV with a quote-aware reader instead of trusting the prose summary: three changelog counts became three exact predicates in one call, which is what surfaced the misstated out-of-domain numbers (iteration 6).
- Diffing a documentation index against the filesystem (`find -type d` beside `grep -c '^| 2026'`) instead of reading the index alone: the missing run folder was invisible from the index and obvious from the pair (iteration 6).
- Rechecking every carried P1 against current file content in one batched read before synthesis: all four were still active at their cited lines, so synthesis carries them on evidence rather than on assumption (iteration 7).
- Reading the prior iteration's P1 text before writing a new one: the `MT-H01` PASS/FAIL candidate turned out to be already stated in R4-P1-001, so it was withdrawn instead of inflating the count (iteration 7).
- Enumerating a convention across the whole skill tree (`ls -d .skilled/skills/*/feature-catalog`) to test a parity claim: ten skills ship a catalog and the hub does not, which is what made the gap a finding rather than a guess (iteration 7).

---

## 9. WHAT FAILED
- Recursive `rg` returns no matches in this sandbox even with `--no-ignore`; `grep -r` works. Every later iteration must use `grep -r` for recursive search (iteration 1).
- A naive `line.match(/("([^"]|"")*"|[^,]*)/g)` CSV split mangled the replay rows and reported 25 PASS / 24 FAIL against a true 48 / 1. A quote-aware character scanner is required before any count is quoted as evidence (iteration 6).
- The maintainability dimension was sampled rather than swept: `changelog/v1.1.0.0.md` and `v1.0.0.0.md` and the three mode packets' own changelogs were not read, so those surfaces are unverified rather than clean (iteration 6).
- A `grep -rn` over `.skilled/skills/mcp-tooling/` without excluding `benchmark/` returned a 554 KB hit from a recorded run log and had to be truncated to disk. Exclude `benchmark/` and `changelog/` from any recursive search over a skill tree (iteration 7).
- The two agent protocols closed as `notApplicable` on a negative search rather than a positive read of an agent contract, so the run never verified agent parity for this target -- there was nothing to verify (iteration 7).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"`graph-metadata.json` is stale after the alias change."** Ruled out. `last_updated_at` is 2026-11-24, the removed aliases are absent, and the added paraphrases are present at `:120-122` and again in the `intent_signals_generated` block at `:280-282`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **"`graph-metadata.json` is stale after the alias change."** Ruled out. `last_updated_at` is 2026-11-24, the removed aliases are absent, and the added paraphrases are present at `:120-122` and again in the `intent_signals_generated` block at `:280-282`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`graph-metadata.json` is stale after the alias change."** Ruled out. `last_updated_at` is 2026-11-24, the removed aliases are absent, and the added paraphrases are present at `:120-122` and again in the `intent_signals_generated` block at `:280-282`.

### **"`mcp-tooling`'s feature catalog still claims the relocated browser modes."** Ruled out. Its only browser mention is `cli-orca`'s embedded browser state. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **"`mcp-tooling`'s feature catalog still claims the relocated browser modes."** Ruled out. Its only browser mention is `cli-orca`'s embedded browser state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`mcp-tooling`'s feature catalog still claims the relocated browser modes."** Ruled out. Its only browser mention is `cli-orca`'s embedded browser state.

### **"`MT-H01`'s PASS/FAIL disagreement is a new finding."** Ruled out as a duplicate. R4-P1-001 already states it and already cites `holdout-browser-inspect.md:46`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **"`MT-H01`'s PASS/FAIL disagreement is a new finding."** Ruled out as a duplicate. R4-P1-001 already states it and already cites `holdout-browser-inspect.md:46`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`MT-H01`'s PASS/FAIL disagreement is a new finding."** Ruled out as a duplicate. R4-P1-001 already states it and already cites `holdout-browser-inspect.md:46`.

### **"`shared/` claims helpers that do not exist."** Ruled out. The README states none exists yet, and the folder holds only that README. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **"`shared/` claims helpers that do not exist."** Ruled out. The README states none exists yet, and the folder holds only that README.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`shared/` claims helpers that do not exist."** Ruled out. The README states none exists yet, and the folder holds only that README.

### **"An agent definition exists for the hub and diverges across runtimes."** Ruled out. No agent file in the three runtime trees names the hub or any of its three modes. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **"An agent definition exists for the hub and diverges across runtimes."** Ruled out. No agent file in the three runtime trees names the hub or any of its three modes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"An agent definition exists for the hub and diverges across runtimes."** Ruled out. No agent file in the three runtime trees names the hub or any of its three modes.

### **"The 2026-11-24 replay report is missing or incomplete."** Ruled out. The folder holds `README.md` (11,843 bytes), `results.csv` (10,512 bytes), `skill-benchmark-report.json` (41,972 bytes) and `source.md` (2,570 bytes). Only its index row is missing. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **"The 2026-11-24 replay report is missing or incomplete."** Ruled out. The folder holds `README.md` (11,843 bytes), `results.csv` (10,512 bytes), `skill-benchmark-report.json` (41,972 bytes) and `source.md` (2,570 bytes). Only its index row is missing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The 2026-11-24 replay report is missing or incomplete."** Ruled out. The folder holds `README.md` (11,843 bytes), `results.csv` (10,512 bytes), `skill-benchmark-report.json` (41,972 bytes) and `source.md` (2,570 bytes). Only its index row is missing.

### **"The changelog's five-copy claim is false because `description.json` lacks the tie-break paraphrases."** Ruled out. The claim at `changelog/v1.1.2.0.md:24` is scoped to the alias removal, and the removal holds in all five files. The paraphrase claim at `:26-28` is a routing claim, and it is verified by the CSV rows, not by keyword presence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **"The changelog's five-copy claim is false because `description.json` lacks the tie-break paraphrases."** Ruled out. The claim at `changelog/v1.1.2.0.md:24` is scoped to the alias removal, and the removal holds in all five files. The paraphrase claim at `:26-28` is a routing claim, and it is verified by the CSV rows, not by keyword presence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The changelog's five-copy claim is false because `description.json` lacks the tie-break paraphrases."** Ruled out. The claim at `changelog/v1.1.2.0.md:24` is scoped to the alias removal, and the removal holds in all five files. The paraphrase claim at `:26-28` is a routing claim, and it is verified by the CSV rows, not by keyword presence.

### **"The global changelog tree still points at the pre-relocation `mcp-tooling` paths."** Ruled out. The four symlinks resolve into `../../skills/mcp-browser-use/`, and `mcp-tooling/` holds no browser mode. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **"The global changelog tree still points at the pre-relocation `mcp-tooling` paths."** Ruled out. The four symlinks resolve into `../../skills/mcp-browser-use/`, and `mcp-tooling/` holds no browser mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The global changelog tree still points at the pre-relocation `mcp-tooling` paths."** Ruled out. The four symlinks resolve into `../../skills/mcp-browser-use/`, and `mcp-tooling/` holds no browser mode.

### **"The hub's `SKILL.md` names an agent contract that has drifted from a runtime agent definition."** Ruled out. The hub's `SKILL.md` names no agent at all, so `skill_agent` has no pair to compare. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **"The hub's `SKILL.md` names an agent contract that has drifted from a runtime agent definition."** Ruled out. The hub's `SKILL.md` names no agent at all, so `skill_agent` has no pair to compare.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The hub's `SKILL.md` names an agent contract that has drifted from a runtime agent definition."** Ruled out. The hub's `SKILL.md` names no agent at all, so `skill_agent` has no pair to compare.

### **"The hub's version fields drifted from the changelog."** Ruled out. All four read `1.1.2.0`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **"The hub's version fields drifted from the changelog."** Ruled out. All four read `1.1.2.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The hub's version fields drifted from the changelog."** Ruled out. All four read `1.1.2.0`.

### **"The playbook index omits a case file."** Ruled out. Seven links, seven files. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **"The playbook index omits a case file."** Ruled out. Seven links, seven files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The playbook index omits a case file."** Ruled out. Seven links, seven files.

### **`ambiguityDelta: 1` being too tight to ever bundle**: ruled out by execution. `"bladebro chrome devtools aside devtools"` returns all three modes as an `orderedBundle`, so the delta and the bundle rules do work when scores tie. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`ambiguityDelta: 1` being too tight to ever bundle**: ruled out by execution. `"bladebro chrome devtools aside devtools"` returns all three modes as an `orderedBundle`, so the delta and the bundle rules do work when scores tie.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ambiguityDelta: 1` being too tight to ever bundle**: ruled out by execution. `"bladebro chrome devtools aside devtools"` returns all three modes as an `orderedBundle`, so the delta and the bundle rules do work when scores tie.

### **`defaultMode: null` causing a silent default route**: ruled out. `router.cjs:126-128` returns a `defer` with reason `no-match` when nothing scores and `defaultMode` is null. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`defaultMode: null` causing a silent default route**: ruled out. `router.cjs:126-128` returns a `defer` with reason `no-match` when nothing scores and `defaultMode` is null.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`defaultMode: null` causing a silent default route**: ruled out. `router.cjs:126-128` returns a `defer` with reason `no-match` when nothing scores and `defaultMode` is null.

### **`fence-state.json` being an unread dead artifact**: ruled out -- `compiled-route-status.cjs`, `compiled-route-sync.cjs` and `compiled-routing-foundation.vitest.ts` read it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`fence-state.json` being an unread dead artifact**: ruled out -- `compiled-route-status.cjs`, `compiled-route-sync.cjs` and `compiled-routing-foundation.vitest.ts` read it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`fence-state.json` being an unread dead artifact**: ruled out -- `compiled-route-status.cjs`, `compiled-route-sync.cjs` and `compiled-routing-foundation.vitest.ts` read it.

### **`leaf-scopes.json` missing Aside and Bladebro entries as a data bug**: ruled out. `SKILL.md:106` and the generator's contract both treat the file as an optional per-mode narrowing list, so a mode with no entry is a mode with no extra scope, not a gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`leaf-scopes.json` missing Aside and Bladebro entries as a data bug**: ruled out. `SKILL.md:106` and the generator's contract both treat the file as an optional per-mode narrowing list, so a mode with no entry is a mode with no extra scope, not a gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`leaf-scopes.json` missing Aside and Bladebro entries as a data bug**: ruled out. `SKILL.md:106` and the generator's contract both treat the file as an optional per-mode narrowing list, so a mode with no entry is a mode with no extra scope, not a gap.

### **A child phase shipping with unchecked goal criteria**: ruled out -- all twelve child goal files have zero unchecked criteria. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A child phase shipping with unchecked goal criteria**: ruled out -- all twelve child goal files have zero unchecked criteria.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A child phase shipping with unchecked goal criteria**: ruled out -- all twelve child goal files have zero unchecked criteria.

### **A missing or malformed manifest causing a throw into the routing hot path**: ruled out -- `readManifest` returns `null` on a read or parse failure and `resolveRoute` then returns `null`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A missing or malformed manifest causing a throw into the routing hot path**: ruled out -- `readManifest` returns `null` on a read or parse failure and `resolveRoute` then returns `null`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing or malformed manifest causing a throw into the routing hot path**: ruled out -- `readManifest` returns `null` on a read or parse failure and `resolveRoute` then returns `null`.

### **A mode missing a recorded playbook run**: ruled out -- each of the three modes has its own `benchmark/reports/` tree with at least three dated runs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A mode missing a recorded playbook run**: ruled out -- each of the three modes has its own `benchmark/reports/` tree with at least three dated runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A mode missing a recorded playbook run**: ruled out -- each of the three modes has its own `benchmark/reports/` tree with at least three dated runs.

### **Credentials embedded in the hub's docs or scripts**: ruled out by the secret-pattern scan above. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Credentials embedded in the hub's docs or scripts**: ruled out by the secret-pattern scan above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Credentials embedded in the hub's docs or scripts**: ruled out by the secret-pattern scan above.

### **Parent criterion 2 or 3 regressing**: ruled out in iterations 1 and 2. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Parent criterion 2 or 3 regressing**: ruled out in iterations 1 and 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Parent criterion 2 or 3 regressing**: ruled out in iterations 1 and 2.

### **The 014 advisor scorer change failing its own goal**: ruled out -- all ten negative and negative-rb replay rows defer with hub confidence 0, which is exactly the out-of-domain behaviour 014 set out to restore. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The 014 advisor scorer change failing its own goal**: ruled out -- all ten negative and negative-rb replay rows defer with hub confidence 0, which is exactly the out-of-domain behaviour 014 set out to restore.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 014 advisor scorer change failing its own goal**: ruled out -- all ten negative and negative-rb replay rows defer with hub confidence 0, which is exactly the out-of-domain behaviour 014 set out to restore.

### **The Aside password boundary being agent-reachable**: ruled out -- `session-management.md:50` states saved password values stay hidden and that MFA, passkeys, CAPTCHA and vault unlock are human-only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The Aside password boundary being agent-reachable**: ruled out -- `session-management.md:50` states saved password values stay hidden and that MFA, passkeys, CAPTCHA and vault unlock are human-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Aside password boundary being agent-reachable**: ruled out -- `session-management.md:50` states saved password values stay hidden and that MFA, passkeys, CAPTCHA and vault unlock are human-only.

### **The Bladebro installer running package lifecycle scripts**: ruled out -- it installs with `--ignore-scripts` and checks digests before `bladebro --version` first runs installed code. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The Bladebro installer running package lifecycle scripts**: ruled out -- it installs with `--ignore-scripts` and checks digests before `bladebro --version` first runs installed code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Bladebro installer running package lifecycle scripts**: ruled out -- it installs with `--ignore-scripts` and checks digests before `bladebro --version` first runs installed code.

### **The compiled engine reading a stale mirror instead of the canonical skill**: ruled out by inode identity -- `.opencode/skills` is a symlink to `../.skilled/skills`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The compiled engine reading a stale mirror instead of the canonical skill**: ruled out by inode identity -- `.opencode/skills` is a symlink to `../.skilled/skills`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The compiled engine reading a stale mirror instead of the canonical skill**: ruled out by inode identity -- `.opencode/skills` is a symlink to `../.skilled/skills`.

### **The hub serving legacy despite the phase 005 claim**: ruled out by execution -- the route returned `effectivePolicyHash` `be9b1fe7...` and `generation: 1`, matching the manifest's `selectedPolicy` exactly. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The hub serving legacy despite the phase 005 claim**: ruled out by execution -- the route returned `effectivePolicyHash` `be9b1fe7...` and `generation: 1`, matching the manifest's `selectedPolicy` exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hub serving legacy despite the phase 005 claim**: ruled out by execution -- the route returned `effectivePolicyHash` `be9b1fe7...` and `generation: 1`, matching the manifest's `selectedPolicy` exactly.

### **The mutation-class guard being blind to the moved scripts**: ruled out -- `HOOK_PATTERN` and `DISCOVERY_GLOBS` both name `mcp-browser-use`, and the manifest carries a row for all three modes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The mutation-class guard being blind to the moved scripts**: ruled out -- `HOOK_PATTERN` and `DISCOVERY_GLOBS` both name `mcp-browser-use`, and the manifest carries a row for all three modes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The mutation-class guard being blind to the moved scripts**: ruled out -- `HOOK_PATTERN` and `DISCOVERY_GLOBS` both name `mcp-browser-use`, and the manifest carries a row for all three modes.

### **The parent-skill checker failing or not naming the hub**: ruled out by execution -- exit 0, 0 warnings, and the hub path printed as the subject. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The parent-skill checker failing or not naming the hub**: ruled out by execution -- exit 0, 0 warnings, and the hub path printed as the subject.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The parent-skill checker failing or not naming the hub**: ruled out by execution -- exit 0, 0 warnings, and the hub path printed as the subject.

### **The replay report being stale relative to the tree**: ruled out -- the CSV carries 49 rows including the paraphrase and negative families the 014 summary describes, so it is the post-fix run rather than the pre-fix one. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The replay report being stale relative to the tree**: ruled out -- the CSV carries 49 rows including the paraphrase and negative families the 014 summary describes, so it is the post-fix run rather than the pre-fix one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The replay report being stale relative to the tree**: ruled out -- the CSV carries 49 rows including the paraphrase and negative families the 014 summary describes, so it is the post-fix run rather than the pre-fix one.

### **The research loop falling short of D1's ten iterations**: ruled out -- 12 records. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The research loop falling short of D1's ten iterations**: ruled out -- 12 records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The research loop falling short of D1's ten iterations**: ruled out -- 12 records.

<!-- /ANCHOR:exhausted-approaches -->
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
- **Dimension**: none remaining -- all four dimensions and all six cross-reference protocols are closed. - **Focus area**: synthesis. The run has converged at a 0.0345 new-findings ratio with four active P1 findings and no P0. - **Reason**: `maxIterations: 7` is reached and the convergence threshold is met, so the main loop has no legal next iteration. - **Rotation status**: correctness, security, traceability, maintainability and cross-reference all complete. - **Blocked/productive carry-forward**: productive -- rechecking each carried P1 against current content in one batch confirmed all four are still active, which is what synthesis needs and what a prose assumption would have got wrong. - **Required evidence for synthesis**: current file:line for each of the four active P1 findings (recorded above), the 13-finding registry rollup, and the release-readiness derivation. - **Recovery note**: if synthesis finds a carried P1 no longer reproducible, it must resolve that finding rather than carry it, and the verdict must be recomputed from the registry rather than from this narrative. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: `goal.md` (durable directive + 7 completion criteria), `spec.md` (phase map 001-014), `decision-record.md`, and the 14 child phase folders. Shipped surfaces: `.skilled/skills/mcp-browser-use/**` (hub + three modes + playbooks + benchmark + changelogs), `.skilled/skills/mcp-tooling/**` (six remaining modes + browser pointers), `.skilled/bin/lib/compiled-routing/**` (compiled engine + activation manifests), `.skilled/skills/system-skill-advisor/**` (scorer change).
- **Behavior claims to verify**: goal.md §3 criteria 1-7; D2 (CLI first, MCP via Code Mode on the three named conditions); D3 (mcp-tooling keeps six modes unchanged); D7 (a mode is integrated only when both routing stages pass).
- **Reuse and conventions**: `mode-registry.json` / `hub-router.json` / `leaf-manifest.json` / `leaf-scopes.json` are the four-file hub contract every mode in this repo follows; changelogs follow `changelog/vX.Y.Z.W.md`; playbooks follow `manual-testing-playbook/<topic>/<case>.md` with a recorded run.
- **Review risks and gaps**: 507 scope files is far more than 7 iterations can read line by line, so iterations sample by surface and cite what they read. The prior deep review (2026-11-24, four lineages, 28 iterations) recorded 0 P0, 2 distinct P1 and 18 distinct P2; 014 claims to have fixed them, so a finding that merely restates a closed 014 item is a regression signal, not a new finding. `resource-map.md` is absent, so the resource-map coverage gate is skipped. No coverage graph exists for this lineage yet.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 2 | Criterion 2 holds; phase 005's compiled-serving claim holds (manifest and executed route agree on hash and generation). |
| `checklist_evidence` | core | partial | 2 | Criterion 5 holds per mode but fails for a combined three-mode request, and the admission corpus never tests it (findings R1-P1-001, R2-P1-001). |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated as iterations read files]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/mcp-browser-use/mode-registry.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/hub-router.json` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/skills/mcp-browser-use/leaf-manifest.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/leaf-scopes.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/README.md` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/SKILL.md` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/bin/compiled-route.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | D1 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | D1 | 2 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/bin/lib/compiled-route-layout.cjs` | D1 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` | D1 | 2 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs` | D1 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json` | D1 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` | D1 | 2 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-1-1795504079797-ay97sx, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T07:08:57Z
<!-- MACHINE-OWNED: END -->
