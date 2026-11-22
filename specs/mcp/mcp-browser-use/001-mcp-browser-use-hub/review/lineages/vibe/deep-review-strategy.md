---
title: Deep Review Strategy - mcp-browser-use hub (vibe lineage)
description: Runtime strategy file for the fan-out lineage reviewing the browser-use parent hub.
trigger_phrases:
  - "deep review strategy"
  - "mcp-browser-use hub review"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - mcp-browser-use hub (vibe lineage)

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- **Init:** populated from `deep-review-config.json` and the fan-out review focus.
- **Per iteration:** the executor reads Next Focus, reviews the assigned dimension, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** mutable, updated by the executor throughout the session.

---

## 2. TOPIC

Review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder target): the browser-use parent hub that routes Bladebro, Aside and Chrome DevTools through one skill, plus the advisor routing at both stages, the nested sub-track support in system-spec-kit, and the end-to-end verification.

Operator review focus (bound as `review_focus`, covered by every iteration): the 8 commits `main..HEAD` that build the browser-use parent hub — hub scaffold, move of the Chrome DevTools and Aside modes into the hub, the Bladebro stealth-browser mode, advisor routing at both stages, nested sub-track support in system-spec-kit, and the end-to-end verification. Pure renames of moved spec packets are out of scope; the edited and added files are in scope.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Pure renames of moved spec packets (`git mv` of `specs/mcp/*` packets) are out of scope.
- Re-litigating the frozen decisions D1-D8 in the parent goal; the review checks that the implementation matches them, not whether they were the right choices.
- Reviewing the six unchanged `mcp-tooling` modes beyond confirming they were left unchanged (D3).
- Executing the repo's own tooling (`validate.sh`, `generate-context.js`) — evidence is read from files and recorded runs, not re-run.

---

## 5. STOP CONDITIONS

- `config.stopPolicy: max-iterations` with `config.maxIterations: 5`: the loop runs all five iterations; convergence is telemetry only.
- An active P0 at synthesis forces `Review verdict: FAIL` regardless of iteration count.

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
- P1 (Required): 3
- P2 (Suggestions): 7
- Resolved: 2

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Compiling the hub policy in memory from the three authored files and comparing `effectivePolicyHash` to the live activation manifest: one call proved the manifest is not stale (iteration 1).
- Replaying the canary fixture through `evaluateRoute` in memory instead of running the harness: 14/14 cases verified with no writes outside the lineage (iteration 1).
- Mechanical set-difference between `hub-router.json` vocabulary classes and `ROUTER.md` `INTENT_SIGNALS`: found the P1 in one call, where reading both files by eye had not (iteration 1).
- Running `parent-skill-check.cjs` on the hub: exit 0 with 0 warnings, and it also proved which cross-checks the gate does *not* perform (iteration 1).
- Reading a runbook against the reference it cites, line by line: found the BB-014 teardown contradiction in one pass (iteration 2).
- A full-tree credential scan with a redaction-vocabulary filter: cleared the whole hub of secrets exposure in one call (iteration 2).
- Checking `git diff --name-status -M` before judging a file: proved both `install.sh` files are new in this branch, so the "pure renames are out of scope" exclusion did not apply (iteration 2).
- Running the gate a recorded report cites instead of reading the report alone: `compiled-route-admission.cjs` exits 0 with 7 pass and 0 drift, which separated a stale record from a broken gate and settled R4-P1-001's premise in one call (iteration 5).
- `compiled-route-sync.cjs --check` as a read-only parity probe: it writes nothing, traces the promoted closure, and named the single drifted file by path (iteration 5).
- Attributing a drift with `git log main..HEAD -- <path>` plus `git show main:<path>` before assigning severity: proved the sk-doc drift predates the branch, which held it at P2 instead of inflating it to P1 (iteration 5).

---

## 9. WHAT FAILED
- Reading `hub-router.json` and `ROUTER.md` side by side without a set comparison: the two keyword lists look aligned and are not (iteration 1).
- Expecting `parent-skill-check.cjs` to validate the stage-two map: it validates `routerSignals` against the registry and the vocabulary classes only, so a stage-one/stage-two drift passes the gate (iteration 1).
- Treating the manual-testing-playbook as prose: BB-014's commands are literal shell with a machine-checkable pass criterion, so it has to be reviewed as an executable procedure (iteration 2).
- Piping `compiled-route-sync.cjs --check` to `tail` and reading `$?`: that reports `tail`'s status, not the gate's. The first run looked green at exit 0 while the gate had exited 1 (iteration 5).
- Assuming the iteration-1 in-memory compile technique transfers to every hub: `mcp-tooling`'s `registry-compiler.cjs` exports a different surface with no `HUB_ID`/`REGISTRY_SOURCE`, so the approach does not generalise (iteration 5).
- Reporting a finding before checking the file against `reviewScopeFiles`: two findings (R2-P2-002, R5-P2-001) named files the branch only moved or never touched, and the terminal scope gate rejected both with `findings-out-of-scope`. Check scope membership at classification time, not at synthesis (iterations 2 and 5, caught at synthesis).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`ambiguityDelta: 1` against weight 4 producing spurious bundles.** Ruled out: scores are multiples of 4, so a near-tie can only be an exact tie, and the `named-tools-bundle` canary case confirms the intended bundle behaviour. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`ambiguityDelta: 1` against weight 4 producing spurious bundles.** Ruled out: scores are multiples of 4, so a near-tie can only be an exact tie, and the `named-tools-bundle` canary case confirms the intended bundle behaviour.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ambiguityDelta: 1` against weight 4 producing spurious bundles.** Ruled out: scores are multiples of 4, so a near-tie can only be an exact tie, and the `named-tools-bundle` canary case confirms the intended bundle behaviour.

### **`description.json` duplicating registry-owned keys.** Ruled out by `parent-skill-check` `8b`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`description.json` duplicating registry-owned keys.** Ruled out by `parent-skill-check` `8b`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`description.json` duplicating registry-owned keys.** Ruled out by `parent-skill-check` `8b`.

### **`generatedFrom` pointing at a path the branch's spec move deleted.** `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` exists and holds 20 child folders including `009-parent-hub-rollout` and `013-live-activation`. Clean. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`generatedFrom` pointing at a path the branch's spec move deleted.** `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` exists and holds 20 child folders including `009-parent-hub-rollout` and `013-live-activation`. Clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`generatedFrom` pointing at a path the branch's spec move deleted.** `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` exists and holds 20 child folders including `009-parent-hub-rollout` and `013-live-activation`. Clean.

### **`leaf-scopes.json` covering only `mcp-chrome-devtools`.** Ruled out: the generator walks each mode's full configured leaf roots when no scope is declared, and `parent-skill-check` `10b-byte-drift` proves the committed manifest equals a fresh regeneration. Aside and Bladebro are unscoped by design, not by omission. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`leaf-scopes.json` covering only `mcp-chrome-devtools`.** Ruled out: the generator walks each mode's full configured leaf roots when no scope is declared, and `parent-skill-check` `10b-byte-drift` proves the committed manifest equals a fresh regeneration. Aside and Bladebro are unscoped by design, not by omission.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`leaf-scopes.json` covering only `mcp-chrome-devtools`.** Ruled out: the generator walks each mode's full configured leaf roots when no scope is declared, and `parent-skill-check` `10b-byte-drift` proves the committed manifest equals a fresh regeneration. Aside and Bladebro are unscoped by design, not by omission.

### **`routerSignals[].resources` listing only `<packet>/SKILL.md` while `RESOURCE_MAP` lists two leaves per intent.** Ruled out: stage one declares the mode's entry resource, stage two declares the leaf set; the two are different projections, not duplicates that must match. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`routerSignals[].resources` listing only `<packet>/SKILL.md` while `RESOURCE_MAP` lists two leaves per intent.** Ruled out: stage one declares the mode's entry resource, stage two declares the leaf set; the two are different projections, not duplicates that must match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`routerSignals[].resources` listing only `<packet>/SKILL.md` while `RESOURCE_MAP` lists two leaves per intent.** Ruled out: stage one declares the mode's entry resource, stage two declares the leaf set; the two are different projections, not duplicates that must match.

### **`serving-closure.manifest.json` `fileCount` disagreeing with its `files` array.** Counted: 69 vs 69. Clean. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`serving-closure.manifest.json` `fileCount` disagreeing with its `files` array.** Counted: 69 vs 69. Clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`serving-closure.manifest.json` `fileCount` disagreeing with its `files` array.** Counted: 69 vs 69. Clean.

### **A stale scenario count in the playbook.** Ruled out: seven scenario files against a stated seven. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A stale scenario count in the playbook.** Ruled out: seven scenario files against a stated seven.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale scenario count in the playbook.** Ruled out: seven scenario files against a stated seven.

### **Compiling the `mcp-tooling` bundle in memory to check its manifest.** Its `registry-compiler.cjs` exports a different surface with no `HUB_ID`/`REGISTRY_SOURCE`; the cohort-wide admission line already covers it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Compiling the `mcp-tooling` bundle in memory to check its manifest.** Its `registry-compiler.cjs` exports a different surface with no `HUB_ID`/`REGISTRY_SOURCE`; the cohort-wide admission line already covers it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Compiling the `mcp-tooling` bundle in memory to check its manifest.** Its `registry-compiler.cjs` exports a different surface with no `HUB_ID`/`REGISTRY_SOURCE`; the cohort-wide admission line already covers it.

### **Criterion 1 resting on a missing research artefact.** Ruled out: `research.md` exists and the state log holds 12 iteration records, above the required 10. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Criterion 1 resting on a missing research artefact.** Ruled out: `research.md` exists and the state log holds 12 iteration records, above the required 10.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Criterion 1 resting on a missing research artefact.** Ruled out: `research.md` exists and the state log holds 12 iteration records, above the required 10.

### **Implicit install on the Bladebro path.** Ruled out: `mcp-bladebro/SKILL.md` NEVER rule 1, `references/install-and-verify.md:3` and the macOS run's operator-approval record all keep installation behind an explicit yes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Implicit install on the Bladebro path.** Ruled out: `mcp-bladebro/SKILL.md` NEVER rule 1, `references/install-and-verify.md:3` and the macOS run's operator-approval record all keep installation behind an explicit yes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Implicit install on the Bladebro path.** Ruled out: `mcp-bladebro/SKILL.md` NEVER rule 1, `references/install-and-verify.md:3` and the macOS run's operator-approval record all keep installation behind an explicit yes.

### **Mirror drift between `.opencode`/`.dsh` and `.skilled`.** Ruled out by `diff -rq` (both are symlinks). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Mirror drift between `.opencode`/`.dsh` and `.skilled`.** Ruled out by `diff -rq` (both are symlinks).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Mirror drift between `.opencode`/`.dsh` and `.skilled`.** Ruled out by `diff -rq` (both are symlinks).

### **Nested sub-track support being unbounded recursion.** Ruled out: `MAX_SUB_TRACK_DEPTH = 2` with an explicit refusal diagnostic and a test that asserts the third level is refused before any write. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Nested sub-track support being unbounded recursion.** Ruled out: `MAX_SUB_TRACK_DEPTH = 2` with an explicit refusal diagnostic and a test that asserts the third level is refused before any write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Nested sub-track support being unbounded recursion.** Ruled out: `MAX_SUB_TRACK_DEPTH = 2` with an explicit refusal diagnostic and a test that asserts the third level is refused before any write.

### **Secrets exposure in the hub's MCP wiring.** Ruled out by a full-tree scan for key, token, secret, password and bearer patterns: every hit is a redaction rule or an explicit "no credential field" statement. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Secrets exposure in the hub's MCP wiring.** Ruled out by a full-tree scan for key, token, secret, password and bearer patterns: every hit is a redaction rule or an explicit "no credential field" statement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Secrets exposure in the hub's MCP wiring.** Ruled out by a full-tree scan for key, token, secret, password and bearer patterns: every hit is a redaction rule or an explicit "no credential field" statement.

### **The `--account` rule appearing inside Bladebro's R-SEC-1.** Ruled out as a gap: `mcp-aside-devtools/SKILL.md:89` and `:142` state the same boundary in the packet that owns it, so the Bladebro copy is redundant, not the only statement. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The `--account` rule appearing inside Bladebro's R-SEC-1.** Ruled out as a gap: `mcp-aside-devtools/SKILL.md:89` and `:142` state the same boundary in the packet that owns it, so the Bladebro copy is redundant, not the only statement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `--account` rule appearing inside Bladebro's R-SEC-1.** Ruled out as a gap: `mcp-aside-devtools/SKILL.md:89` and `:142` state the same boundary in the packet that owns it, so the Bladebro copy is redundant, not the only statement.

### **The `mcp-browser-use` bundle drifting from its authored source.** All five files in sync; the single drift is in the `sk-doc` bundle. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The `mcp-browser-use` bundle drifting from its authored source.** All five files in sync; the single drift is in the `sk-doc` bundle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `mcp-browser-use` bundle drifting from its authored source.** All five files in sync; the single drift is in the `sk-doc` bundle.

### **The admission check being broken, which would have made R4-P1-001 a P0.** It exits 0 with 7 pass and 0 drift. R4-P1-001 is stale evidence, not a broken gate. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The admission check being broken, which would have made R4-P1-001 a P0.** It exits 0 with 7 pass and 0 drift. R4-P1-001 is stale evidence, not a broken gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The admission check being broken, which would have made R4-P1-001 a P0.** It exits 0 with 7 pass and 0 drift. R4-P1-001 is stale evidence, not a broken gate.

### **The hub README's verification commands pointing at missing scripts.** Ruled out: `parent-skill-check.cjs` exists and exits 0 on the hub, and `validate_document.py` resolves through a symlink to a real file. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The hub README's verification commands pointing at missing scripts.** Ruled out: `parent-skill-check.cjs` exists and exits 0 on the hub, and `validate_document.py` resolves through a symlink to a real file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hub README's verification commands pointing at missing scripts.** Ruled out: `parent-skill-check.cjs` exists and exits 0 on the hub, and `validate_document.py` resolves through a symlink to a real file.

### **The macOS live run being fabricated or unrecorded.** Ruled out: the report carries per-scenario observed output, a 12/1/1 tally, and an explicit statement that the `$` lines are reconstructed while the output under them is quoted from scratch files. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The macOS live run being fabricated or unrecorded.** Ruled out: the report carries per-scenario observed output, a 12/1/1 tally, and an explicit statement that the `$` lines are reconstructed while the output under them is quoted from scratch files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The macOS live run being fabricated or unrecorded.** Ruled out: the report carries per-scenario observed output, a 12/1/1 tally, and an explicit statement that the `$` lines are reconstructed while the output under them is quoted from scratch files.

### **The new approved divergence being an unreviewed capture.** Ruled out: the entry carries a gold label, both tops, a written reason and an approval date, and the ledger's `scoringInstant` was moved with it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The new approved divergence being an unreviewed capture.** Ruled out: the entry carries a gold label, both tops, a written reason and an approval date, and the ledger's `scoringInstant` was moved with it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The new approved divergence being an unreviewed capture.** Ruled out: the entry carries a gold label, both tops, a written reason and an approval date, and the ledger's `scoringInstant` was moved with it.

### **The relabelled P0 browser cases hiding a regression.** Ruled out: the diff touches only `expected_top_any` on two cases, and the recorded post-relabel metrics equal the committed baseline on all three corpora. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The relabelled P0 browser cases hiding a regression.** Ruled out: the diff touches only `expected_top_any` on two cases, and the recorded post-relabel metrics equal the committed baseline on all three corpora.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The relabelled P0 browser cases hiding a regression.** Ruled out: the diff touches only `expected_top_any` on two cases, and the recorded post-relabel metrics equal the committed baseline on all three corpora.

### **The two-stage replay superseding the hub-routing FAIL.** Ruled out: the replay covers six curated requests and never invokes the admission check. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The two-stage replay superseding the hub-routing FAIL.** Ruled out: the replay covers six curated requests and never invokes the admission check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The two-stage replay superseding the hub-routing FAIL.** Ruled out: the replay covers six curated requests and never invokes the admission check.

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
- Dimension: none remaining — correctness, security, traceability, maintainability and cross-reference are all complete. - Focus area: synthesis. Consolidate the 3 active P1 and 8 active P2 findings into the review report and the planning packet. - Reason: `config.stopPolicy: max-iterations` with `config.maxIterations: 5` is reached; convergence is telemetry only. - Rotation status: all five configured dimensions complete. - Blocked/productive carry-forward: productive — running the gate a recorded report cites, rather than reading the report alone, is what separated a stale record from a broken gate. Reuse it at synthesis when rechecking the carried-forward P1s. - Required evidence: the findings registry, the dashboard, and the three carried-forward P1 findings re-read against current file content. - Recovery note: not applicable. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/mcp-browser-use/` (hub + three mode folders), `.skilled/skills/mcp-tooling/` (six unchanged modes), `.skilled/bin/lib/compiled-routing/` (compiled routing artifacts), `.skilled/skills/system-skill-advisor/` (advisor scorer + fixtures), `.skilled/skills/system-spec-kit/` (nested sub-track support), and the packet docs under `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/`.
- Behavior claims: the parent goal's completion criteria (three modes in the hub registry, six in mcp-tooling, no `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` references, parent-skill checker exits 0, one real browser request per mode returns `mcp-browser-use` from the advisor and the mode from the hub router, three manual testing playbooks with recorded runs, `validate.sh --strict --recursive` PASSED).
- Reuse and conventions: `mcp-tooling` is the reference parent hub shape (mode-registry.json, hub-router.json, leaf-manifest.json, ROUTER.md, SKILL.md, leaf-scopes.json); the compiled-routing rollout under `009-parent-hub-rollout/003-mcp-tooling` is the reference for `010-mcp-browser-use`.
- Review risks and gaps: the `main..HEAD` diff spans 5066 files because of the spec-packet move, so the 277-file `reviewScopeFiles` list is the operative scope; `resource-map.md` is absent so the coverage gate is skipped.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Parent goal criteria 2 and 4 verified (three registry modes; parent-skill checker exit 0 naming the hub). Criterion 3 deferred to iteration 3. |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/mcp-browser-use/mode-registry.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/hub-router.json` | D1 | 1 | 0 P0, 1 P1, 1 P2 | complete |
| `.skilled/skills/mcp-browser-use/ROUTER.md` | D1 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/SKILL.md` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/leaf-manifest.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/leaf-scopes.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` | D1 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-1795299580084-7g6zan, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-21T22:20:26Z
<!-- MACHINE-OWNED: END -->
