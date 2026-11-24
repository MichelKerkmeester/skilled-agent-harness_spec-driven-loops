---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder) across every phase goal in the hub epic, with operator focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Implementing fixes: this lineage reports findings only; remediation is a separate follow-up phase.
- Re-running the repository tooling (`validate.sh`, `generate-context.js`, benchmark harnesses) as proof; evidence is read from source and recorded artifacts.
- Reviewing files outside the declared review scope list (522 files).
- Re-litigating decisions D1-D8 of the parent goal.

---

## 5. STOP CONDITIONS
- Convergence: weighted new-findings ratio below 0.1 after the minimum iteration count.
- Hard ceiling: 7 iterations.
- Any active P0 keeps the verdict at FAIL regardless of convergence.
- Duration ceiling: 120 minutes.

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
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Running the live front door (`compiled-route.cjs`) with paired prompts that differ in one token: the mixed id/alias asymmetry showed up immediately and could not be argued away from source alone (iteration 1)
- Checking the phase 015 claims against their fix sites before judging them: all four claimed fixes are present, which narrowed the review to the paths the claims do not cover (iteration 1)
- Diffing the `.opencode` mirror against the canonical tree before trusting the harness: byte-identical, so the harness evidence stands (iteration 1)
- Running the documented invocation literally with a realistic quoted task: the truncation and the stdin contrast were both observable in one command pair (iteration 2)
- Reading the feature catalog beside the decision record: the D2 contradiction surfaced only by pairing the two (iteration 2)
- Resolving every declared leaf against disk and every cited report folder against the tree: the cross-reference integrity check was cheap and conclusive (iteration 3)
- Comparing the version field across all five hub metadata files at once: the single outlier stood out immediately (iteration 3)
- Resolving every entry of the hub layout block and every benchmark report index against disk in one pass: both checks were cheap and both came back clean, which retired two candidate directions at once (iteration 4)
- Pairing the parent goal's BINDING table against `ls -d 0*` of the packet root: the fifteen-folder count against fourteen rows made the omission visible without reading any phase body (iteration 5)
- Following the goal's own cited report path instead of assuming it was current: the missing file and the archived original were both established in one `find`, and the archived numbers then matched the row exactly (iteration 5)
- Probing the advisor live for each claim in the 2.0.3.0 changelog rather than reading the diff: "staging site" at 0.82 and the doctor row at zero recommendations confirmed both halves of the release note in two commands (iteration 5)
- Re-running each P1's own case instead of re-reading its prose: all four reproduced, and the P1-2 reproduction got sharper because the documented shell form was run literally through `bash -c` rather than as a pre-quoted argv element (iteration 6)
- Checking each finding's recorded `downgradeTrigger` against the current tree: none had fired, which turned a vague "still open" into a stated reason per finding (iteration 6)
- Re-reading all seven P2 findings at their cited lines in one pass: the one-to-one map against the registry entries retired the duplicate-finding and silent-fix directions together (iteration 7)

---

## 9. WHAT FAILED
- Reading the canary fixture as coverage proof: its 17 cases test all-full-id and all-short-form bundles but never the mixed form, so a green harness says nothing about the failing path (iteration 1)
- Trusting the phase 015 verification table as security coverage: it exercises the wrapper and never the catalog line that bypasses it (iteration 2)
- Reading a phase log row as the current state of a playbook: the phase 006 row cites a superseded run (iteration 3)
- Treating a green canary harness as proof of the phase 015 bundle criterion: the harness writes build artifacts outside this lineage's write surface, so the criterion's harness half rests on the recorded `tasks.md:50` evidence and stays unverified here (iteration 5)
- Reading the parent goal's Progress table as a live index: its report path went stale when the run was archived, so the row's numbers had to be checked against `review-archive/` rather than the cited path (iteration 5)
- Testing the P1-2 case by passing the task as one argv element: the CLI routes correctly that way, so a reviewer who tests only the CLI and not the documented shell form would wrongly close the finding (iteration 6)
- Expecting convergence to end this run: the rolling average could not fall below 0.1 while iterations 4 and 5 both recorded 1.0, and the dimension-coverage gate is blocked by the open P1 findings rather than by missing dimensions, so the iteration cap is the correct stop (iteration 7)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`ambiguityDelta` absorbing the mixed-form gap.** Scores are multiples of the weight 4 and the delta is 1, so no non-zero score gap can ever be a near-tie. The delta cannot mask or create the finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`ambiguityDelta` absorbing the mixed-form gap.** Scores are multiples of the weight 4 and the delta is 1, so no non-zero score gap can ever be a near-tie. The delta cannot mask or create the finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ambiguityDelta` absorbing the mixed-form gap.** Scores are multiples of the weight 4 and the delta is 1, so no non-zero score gap can ever be a near-tie. The delta cannot mask or create the finding.

### **A convergence stop reachable inside the cap.** Ruled out: the rolling average cannot fall below 0.1 while iterations 4 and 5 both recorded 1.0, and the dimension-coverage gate is blocked by the open P1 findings rather than by missing dimensions. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A convergence stop reachable inside the cap.** Ruled out: the rolling average cannot fall below 0.1 while iterations 4 and 5 both recorded 1.0, and the dimension-coverage gate is blocked by the open P1 findings rather than by missing dimensions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A convergence stop reachable inside the cap.** Ruled out: the rolling average cannot fall below 0.1 while iterations 4 and 5 both recorded 1.0, and the dimension-coverage gate is blocked by the open P1 findings rather than by missing dimensions.

### **A dead or orphaned `leaf-scopes.json`.** It is read by `generate-leaf-manifest.cjs`, and `SKILL.md:106` documents its purpose. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A dead or orphaned `leaf-scopes.json`.** It is read by `generate-leaf-manifest.cjs`, and `SKILL.md:106` documents its purpose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A dead or orphaned `leaf-scopes.json`.** It is read by `generate-leaf-manifest.cjs`, and `SKILL.md:106` documents its purpose.

### **A finding raised twice under different ids.** Ruled out: the eleven registry entries map one-to-one onto the eleven findings in the iteration narratives, with no duplicate title or duplicate file:line pair. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A finding raised twice under different ids.** Ruled out: the eleven registry entries map one-to-one onto the eleven findings in the iteration narratives, with no duplicate title or duplicate file:line pair.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding raised twice under different ids.** Ruled out: the eleven registry entries map one-to-one onto the eleven findings in the iteration narratives, with no duplicate title or duplicate file:line pair.

### **A gap in the hub changelog series.** Five files cover v1.0.0.0 through v1.1.3.0 with no missing release. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A gap in the hub changelog series.** Five files cover v1.0.0.0 through v1.1.3.0 with no missing release.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A gap in the hub changelog series.** Five files cover v1.0.0.0 through v1.1.3.0 with no missing release.

### **A layout divergence between the hub's mode packets and the `mcp-tooling` sibling.** The three mode packets are identical to each other and differ from `mcp-click-up` only by the `benchmark/` directory that recorded runs require. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A layout divergence between the hub's mode packets and the `mcp-tooling` sibling.** The three mode packets are identical to each other and differ from `mcp-click-up` only by the `benchmark/` directory that recorded runs require.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A layout divergence between the hub's mode packets and the `mcp-tooling` sibling.** The three mode packets are identical to each other and differ from `mcp-click-up` only by the `benchmark/` directory that recorded runs require.

### **A missing Bladebro macOS live run.** The 2026-11-22 Bladebro report records a live run on macOS arm64 with Bladebro v4.8.2, and the 2026-11-21 macOS live folder is also present. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A missing Bladebro macOS live run.** The 2026-11-22 Bladebro report records a live run on macOS arm64 with Bladebro v4.8.2, and the 2026-11-21 macOS live folder is also present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing Bladebro macOS live run.** The 2026-11-22 Bladebro report records a live run on macOS arm64 with Bladebro v4.8.2, and the 2026-11-21 macOS live folder is also present.

### **A missing hub layout entry.** All 16 entries in the `SKILL.md` layout block resolve on disk. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A missing hub layout entry.** All 16 entries in the `SKILL.md` layout block resolve on disk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing hub layout entry.** All 16 entries in the `SKILL.md` layout block resolve on disk.

### **A missing mode playbook.** All three modes carry a `manual-testing-playbook/` tree with scenario files and a recorded run. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A missing mode playbook.** All three modes carry a `manual-testing-playbook/` tree with scenario files and a recorded run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing mode playbook.** All three modes carry a `manual-testing-playbook/` tree with scenario files and a recorded run.

### **A missing phase 015 goal document.** Ruled out: `015-fix-follow-up-review-findings/goal.md` exists with three checked criteria and a Progress table. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A missing phase 015 goal document.** Ruled out: `015-fix-follow-up-review-findings/goal.md` exists with three checked criteria and a Progress table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing phase 015 goal document.** Ruled out: `015-fix-follow-up-review-findings/goal.md` exists with three checked criteria and a Progress table.

### **A second unpinned install path inside the wrapper.** The wrapper downloads to a `mktemp` file and never pipes to a shell. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A second unpinned install path inside the wrapper.** The wrapper downloads to a `mktemp` file and never pipes to a shell.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second unpinned install path inside the wrapper.** The wrapper downloads to a `mktemp` file and never pipes to a shell.

### **A silently fixed P2.** Ruled out: all seven were re-read at their cited lines and all seven are unchanged. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A silently fixed P2.** Ruled out: all seven were re-read at their cited lines and all seven are unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A silently fixed P2.** Ruled out: all seven were re-read at their cited lines and all seven are unchanged.

### **A stale benchmark report index.** All four indexes match their folder counts. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A stale benchmark report index.** All four indexes match their folder counts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale benchmark report index.** All four indexes match their folder counts.

### **Advisor id-noun rule still lifting on a bare noun.** `promptNamesIdNoun` requires a lexical token other than the noun, and `lexicalEvidence` is harvested from the skill's own candidate haystack, so `loop`, `mode` and `tooling` alone no longer name their skills. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Advisor id-noun rule still lifting on a bare noun.** `promptNamesIdNoun` requires a lexical token other than the noun, and `lexicalEvidence` is harvested from the skill's own candidate haystack, so `loop`, `mode` and `tooling` alone no longer name their skills.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Advisor id-noun rule still lifting on a bare noun.** `promptNamesIdNoun` requires a lexical token other than the noun, and `lexicalEvidence` is harvested from the skill's own candidate haystack, so `loop`, `mode` and `tooling` alone no longer name their skills.

### **Broken cross-references in the phase 006 log.** Both cited Bladebro report folders exist on disk. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Broken cross-references in the phase 006 log.** Both cited Bladebro report folders exist on disk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Broken cross-references in the phase 006 log.** Both cited Bladebro report folders exist on disk.

### **P1-1 was fixed by the phase 015 alias addition.** Ruled out: the alias addition fixed the all-id bundle, and the mixed id/alias form still collapses to `single`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **P1-1 was fixed by the phase 015 alias addition.** Ruled out: the alias addition fixed the all-id bundle, and the mixed id/alias form still collapses to `single`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P1-1 was fixed by the phase 015 alias addition.** Ruled out: the alias addition fixed the all-id bundle, and the mixed id/alias form still collapses to `single`.

### **P1-2 no longer reproduces.** Ruled out: the documented form still truncates at the first inner double quote and still executes a command substitution. The earlier reproduction stands. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **P1-2 no longer reproduces.** Ruled out: the documented form still truncates at the first inner double quote and still executes a command substitution. The earlier reproduction stands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P1-2 no longer reproduces.** Ruled out: the documented form still truncates at the first inner double quote and still executes a command substitution. The earlier reproduction stands.

### **P1-3 was fixed by a changelog addition.** Ruled out: no `v1.1.4.0.md` exists. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **P1-3 was fixed by a changelog addition.** Ruled out: no `v1.1.4.0.md` exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P1-3 was fixed by a changelog addition.** Ruled out: no `v1.1.4.0.md` exists.

### **P1-4 was fixed by the phase 015 installer pin.** Ruled out: the pin landed in `install.sh`, and the feature catalog line that bypasses it is untouched. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **P1-4 was fixed by the phase 015 installer pin.** Ruled out: the pin landed in `install.sh`, and the feature catalog line that bypasses it is untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P1-4 was fixed by the phase 015 installer pin.** Ruled out: the pin landed in `install.sh`, and the feature catalog line that bypasses it is untouched.

### **Path traversal through the capture example's session dir.** The `*..*` case runs before the `./tmp` prefix case, so a traversal cannot pass the prefix test. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Path traversal through the capture example's session dir.** The `*..*` case runs before the `./tmp` prefix case, so a traversal cannot pass the prefix test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Path traversal through the capture example's session dir.** The `*..*` case runs before the `./tmp` prefix case, so a traversal cannot pass the prefix test.

### **Shell injection through the capture example's URL.** The guard rejects `'` and `\` across `"$URL$SESSION_DIR"` before either value is spliced, and the splice target is a single-quoted JavaScript string, so no shell metacharacter reaches the shell. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Shell injection through the capture example's URL.** The guard rejects `'` and `\` across `"$URL$SESSION_DIR"` before either value is spliced, and the splice target is a single-quoted JavaScript string, so no shell metacharacter reaches the shell.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shell injection through the capture example's URL.** The guard rejects `'` and `\` across `"$URL$SESSION_DIR"` before either value is spliced, and the splice target is a single-quoted JavaScript string, so no shell metacharacter reaches the shell.

### **Stale runtime mirror feeding the harness.** `build-artifacts.cjs` compiles from `.opencode/skills/mcp-browser-use`. All seven authored files are byte-identical between the mirror and the canonical tree, so the harness is not compiling a stale registry. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Stale runtime mirror feeding the harness.** `build-artifacts.cjs` compiles from `.opencode/skills/mcp-browser-use`. All seven authored files are byte-identical between the mirror and the canonical tree, so the harness is not compiling a stale registry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale runtime mirror feeding the harness.** `build-artifacts.cjs` compiles from `.opencode/skills/mcp-browser-use`. All seven authored files are byte-identical between the mirror and the canonical tree, so the harness is not compiling a stale registry.

### **Substring false positives in the routing vocabulary.** Every keyword in `chrome-devtools-aliases`, `browser-debug`, `aside-devtools-aliases`, `aside-repl-evidence`, `bladebro-aliases` and `bladebro-workflow` was checked for a common-word substring collision. None exists, so `containsSignal`'s substring match is not a defect on this vocabulary. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Substring false positives in the routing vocabulary.** Every keyword in `chrome-devtools-aliases`, `browser-debug`, `aside-devtools-aliases`, `aside-repl-evidence`, `bladebro-aliases` and `bladebro-workflow` was checked for a common-word substring collision. None exists, so `containsSignal`'s substring match is not a defect on this vocabulary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Substring false positives in the routing vocabulary.** Every keyword in `chrome-devtools-aliases`, `browser-debug`, `aside-devtools-aliases`, `aside-repl-evidence`, `bladebro-aliases` and `bladebro-workflow` was checked for a common-word substring collision. None exists, so `containsSignal`'s substring match is not a defect on this vocabulary.

### **The advisor id-noun change regressed the staging anchor.** Ruled out: "staging site" still returns the hub at 0.82 live, and the hub's own MBU-PB-04 failure is the pre-existing long-prompt dilution recorded at `README.md:101`, not a new regression. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The advisor id-noun change regressed the staging anchor.** Ruled out: "staging site" still returns the hub at 0.82 live, and the hub's own MBU-PB-04 failure is the pre-existing long-prompt dilution recorded at `README.md:101`, not a new regression.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The advisor id-noun change regressed the staging anchor.** Ruled out: "staging site" still returns the hub at 0.82 live, and the hub's own MBU-PB-04 failure is the pre-existing long-prompt dilution recorded at `README.md:101`, not a new regression.

### **The doctor control row was left un-re-pinned.** Ruled out: `doctor-prompts.jsonl:52` carries `expected_top: null` and the live probe returns no recommendation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The doctor control row was left un-re-pinned.** Ruled out: `doctor-prompts.jsonl:52` carries `expected_top: null` and the live probe returns no recommendation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The doctor control row was left un-re-pinned.** Ruled out: `doctor-prompts.jsonl:52` carries `expected_top: null` and the live probe returns no recommendation.

### **The generation 2 review counts are wrong.** Ruled out: `review-archive/20261124T070727Z-restart/review-report.md:3` states four opus lineages, 7 iterations each, 28 in all, and its section 1 folds 3 P1 entries to 2 defects and 30 P2 entries to 18 distinct. The goal row's "0 P0, 2 distinct P1, 18 distinct P2" matches. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The generation 2 review counts are wrong.** Ruled out: `review-archive/20261124T070727Z-restart/review-report.md:3` states four opus lineages, 7 iterations each, 28 in all, and its section 1 folds 3 P1 entries to 2 defects and 30 P2 entries to 18 distinct. The goal row's "0 P0, 2 distinct P1, 18 distinct P2" matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The generation 2 review counts are wrong.** Ruled out: `review-archive/20261124T070727Z-restart/review-report.md:3` states four opus lineages, 7 iterations each, 28 in all, and its section 1 folds 3 P1 entries to 2 defects and 30 P2 entries to 18 distinct. The goal row's "0 P0, 2 distinct P1, 18 distinct P2" matches.

### **Understated mutation posture in the compiled policy.** `mutatesWorkspace` is true on every mode and the compiler maps it to `workspace-mutation-capable`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Understated mutation posture in the compiled policy.** `mutatesWorkspace` is true on every mode and the compiler maps it to `workspace-mutation-capable`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Understated mutation posture in the compiled policy.** `mutatesWorkspace` is true on every mode and the compiler maps it to `workspace-mutation-capable`.

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
- Wrong generation 2 review counts in the parent goal: `review-archive/20261124T070727Z-restart/review-report.md:3` states four opus lineages, 7 iterations each, 28 in all, and folds 3 P1 entries to 2 defects and 30 P2 entries to 18 distinct, matching the goal row (iteration 5, evidence: archived report section 1)
- A missing phase 015 goal document: `015-fix-follow-up-review-findings/goal.md` exists with three checked criteria and a Progress table (iteration 5, evidence: direct read)
- The advisor id-noun change regressing the staging anchor: "staging site" still returns the hub at 0.82 live, and MBU-PB-04 is the pre-existing long-prompt dilution recorded at `README.md:101` (iteration 5, evidence: live `skill-advisor.cjs` probe)
- The doctor control row left un-re-pinned: `doctor-prompts.jsonl:52` carries `expected_top: null` and the live probe returns no recommendation (iteration 5, evidence: live probe)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: the iteration cap is reached with all four dimensions complete and both cross-reference passes done - Rotation status: correctness, security, traceability and maintainability complete; cross-reference passes 1 and 2 complete - Blocked/productive carry-forward: nothing blocked; the carry-forward set is four P1 and seven P2 findings, all re-read within the last two iterations - Required evidence: the eleven registry entries, each with a file:line citation and a re-read iteration Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the hub skill `.skilled/skills/mcp-browser-use/` (mode-registry.json, hub-router.json, leaf-manifest.json, SKILL.md, README.md, three mode folders), the compiled-routing fixtures and libs under `.skilled/bin/lib/compiled-routing/`, the advisor scorer under `.skilled/skills/system-skill-advisor/`, and the packet docs `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/{goal.md,spec.md,decision-record.md}` plus phases 001-015.
- Behavior claims: three browser modes route through both advisor stages; `mcp-tooling` keeps six modes; no `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` id survives outside changelog and benchmark/reports; the parent-skill checker exits 0 on the hub; each mode has a playbook with a recorded run; `validate.sh --strict --recursive` prints RESULT: PASSED.
- Reuse and conventions: mode folders mirror the `mcp-tooling` leaf layout; changelogs are per-skill `changelog/vX.Y.Z.W.md`; benchmark reports live under `benchmark/reports/<date>--<slug>/`.
- Review risks and gaps: 522 scope files is far more than one iteration can read; the review therefore samples by phase goal and by the surfaces each goal names, and records what it did not read as deferred rather than as clean.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | Phase 015 fixes present at source; the bundle claim fails for the mixed id/alias form; the hub version-authority invariant is broken at README.md:8 |
| `checklist_evidence` | core | partial | 3 | Recorded canary and replay evidence does not cover the mixed id/alias path; phase 006 cites a superseded Chrome DevTools run |
| `skill_agent` | overlay | pass | 1 | `parent-skill-check.cjs` exits 0 and names the hub |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent definition carries hub logic |
| `feature_catalog_code` | overlay | fail | 2 | Aside install catalog documents an unpinned path that decision D2 forbids |
| `playbook_capability` | overlay | pass | 3 | All three modes carry a playbook with a recorded run; the Bladebro macOS live run is present |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Scope list: `review-scope-files.txt` (522 files). Per-file coverage is recorded as iterations read them.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-2-1795511024070-2cuwlj, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:04:54.883Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
