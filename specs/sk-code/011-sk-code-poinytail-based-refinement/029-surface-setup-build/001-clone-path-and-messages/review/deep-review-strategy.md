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
version: 1.11.0.13
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
commits 17e465512a, dae07e6286 and d6c30ebdf5 on branch worktrees/133-surface-setup-build (diff a98004816d..d6c30ebdf5): the README sk-code adapting block gains the provision command and skilled.trustRepoHooks under Before you start, the feature catalog in removal step 6, regenerate-skill-derived.cjs in removal step 7, and the surface-count files and leaf-scopes.json in add step 3; compiled-route-guard.cjs prints the refresh command and both manifest paths per stale hub through a shared manifestPair derivation and an exported staleFix; root-router-contract.cjs relabels an unresolvable @spec-kit/shared as SHARED_NOT_BUILT naming the provision command, and ci-skill-root-metadata.cjs prints it with no stack; four tests pin the two code changes.

Dimensions, risk-ordered: correctness, security, traceability, maintainability. Max iterations 5, convergence threshold 0.1, stop policy max-iterations. The full diff is specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/scratch/review-diff.patch. The phase decisions are in specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/goal.md (D1 to D5) and its requirements in specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/spec.md.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The 028 research recommendations not built in this phase (R3, the /doctor:sk-code command, is phase 002).
- The rejected ideas X1 to X11 of the 028 research, and the optional worktree-naming.sh usage retitle the goal rules out.
- Parts of the README outside the "What Adapting `sk-code` Looks Like" block.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: run all 5 iterations; convergence is telemetry only.

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
- P1 (Required): 0
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **agent_cross_runtime — notApplicable.** No runtime-specific file appears in the diff. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **agent_cross_runtime — notApplicable.** No runtime-specific file appears in the diff.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **agent_cross_runtime — notApplicable.** No runtime-specific file appears in the diff.

### **agent_cross_runtime — notApplicable.** No runtime-specific file in the changed set. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: **agent_cross_runtime — notApplicable.** No runtime-specific file in the changed set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **agent_cross_runtime — notApplicable.** No runtime-specific file in the changed set.

### **checklist_evidence — blocked.** Ledger rows L-1..L-6 and T1..T4 live in `implementation-summary.md`, outside the review scope files; carried from iteration 3 and not re-attempted (the strategy's do-not-retry entry covers the R5 verification attempt). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **checklist_evidence — blocked.** Ledger rows L-1..L-6 and T1..T4 live in `implementation-summary.md`, outside the review scope files; carried from iteration 3 and not re-attempted (the strategy's do-not-retry entry covers the R5 verification attempt).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence — blocked.** Ledger rows L-1..L-6 and T1..T4 live in `implementation-summary.md`, outside the review scope files; carried from iteration 3 and not re-attempted (the strategy's do-not-retry entry covers the R5 verification attempt).

### **checklist_evidence (core) — blocked (carried).** Ledger rows L-1..L-6 and T1..T4 live in implementation-summary.md, outside the review scope files. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **checklist_evidence (core) — blocked (carried).** Ledger rows L-1..L-6 and T1..T4 live in implementation-summary.md, outside the review scope files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence (core) — blocked (carried).** Ledger rows L-1..L-6 and T1..T4 live in implementation-summary.md, outside the review scope files.

### **core — checklist_evidence: deferred.** Ledger rows L-1..L-6 and T1..T4 are recorded in `implementation-summary.md`, which is outside this review's scope files; the goal log still shows the build in progress. This iteration records what the change must satisfy, not that the ledger rows ran. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **core — checklist_evidence: deferred.** Ledger rows L-1..L-6 and T1..T4 are recorded in `implementation-summary.md`, which is outside this review's scope files; the goal log still shows the build in progress. This iteration records what the change must satisfy, not that the ledger rows ran.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core — checklist_evidence: deferred.** Ledger rows L-1..L-6 and T1..T4 are recorded in `implementation-summary.md`, which is outside this review's scope files; the goal log still shows the build in progress. This iteration records what the change must satisfy, not that the ledger rows ran.

### **core — spec_code: verified.** R1 → README before-you-start items 1–2 (provision command and `skilled.trustRepoHooks`); R2 → `staleFix` names the refresh command, the skill root and both manifest paths, per hub, after the kept `Re-mint:` line; R4 → removal step 6 names the feature catalog, step 7 runs `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` with only `causal_summary` left by hand, add step 3 names the surface-count files and `leaf-scopes.json`; R5 → the relabel plus the gate's one-line exit 1. All four requirements map to changed lines; D1–D5 hold. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **core — spec_code: verified.** R1 → README before-you-start items 1–2 (provision command and `skilled.trustRepoHooks`); R2 → `staleFix` names the refresh command, the skill root and both manifest paths, per hub, after the kept `Re-mint:` line; R4 → removal step 6 names the feature catalog, step 7 runs `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` with only `causal_summary` left by hand, add step 3 names the surface-count files and `leaf-scopes.json`; R5 → the relabel plus the gate's one-line exit 1. All four requirements map to changed lines; D1–D5 hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core — spec_code: verified.** R1 → README before-you-start items 1–2 (provision command and `skilled.trustRepoHooks`); R2 → `staleFix` names the refresh command, the skill root and both manifest paths, per hub, after the kept `Re-mint:` line; R4 → removal step 6 names the feature catalog, step 7 runs `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` with only `causal_summary` left by hand, add step 3 names the surface-count files and `leaf-scopes.json`; R5 → the relabel plus the gate's one-line exit 1. All four requirements map to changed lines; D1–D5 hold.

### **feature_catalog_code — pass (carried).** README.md:1463 names the hub feature catalog and its two-axis file (confirmed iteration 2). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **feature_catalog_code — pass (carried).** README.md:1463 names the hub feature catalog and its two-axis file (confirmed iteration 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code — pass (carried).** README.md:1463 names the hub feature catalog and its two-axis file (confirmed iteration 2).

### **feature_catalog_code — pass.** `README.md:1463` names the hub feature catalog and its two-axis file (existence confirmed in iteration 2; unchanged here). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **feature_catalog_code — pass.** `README.md:1463` names the hub feature catalog and its two-axis file (existence confirmed in iteration 2; unchanged here).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code — pass.** `README.md:1463` names the hub feature catalog and its two-axis file (existence confirmed in iteration 2; unchanged here).

### **feature_catalog_code — pass.** `README.md:1463` now names `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` and its `two-axis-registry-driven-routing/` file; iteration 2 confirmed both exist. `sk-code/leaf-scopes.json` remains absent by design — `README.md:1472` names it as the file a user creates when `MODE_LEAF_SET_COLLISION` fires, with `.skilled/skills/sk-doc/leaf-scopes.json` as the format exemplar (exists). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **feature_catalog_code — pass.** `README.md:1463` now names `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` and its `two-axis-registry-driven-routing/` file; iteration 2 confirmed both exist. `sk-code/leaf-scopes.json` remains absent by design — `README.md:1472` names it as the file a user creates when `MODE_LEAF_SET_COLLISION` fires, with `.skilled/skills/sk-doc/leaf-scopes.json` as the format exemplar (exists).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code — pass.** `README.md:1463` now names `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` and its `two-axis-registry-driven-routing/` file; iteration 2 confirmed both exist. `sk-code/leaf-scopes.json` remains absent by design — `README.md:1472` names it as the file a user creates when `MODE_LEAF_SET_COLLISION` fires, with `.skilled/skills/sk-doc/leaf-scopes.json` as the format exemplar (exists).

### **overlay — agent_cross_runtime: no runtime-specific file appears in the changed set** (six files: README, two scripts, two test files, and the guard). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **overlay — agent_cross_runtime: no runtime-specific file appears in the changed set** (six files: README, two scripts, two test files, and the guard).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay — agent_cross_runtime: no runtime-specific file appears in the changed set** (six files: README, two scripts, two test files, and the guard).

### **overlay — feature_catalog_code: partial.** Removal step 6 now names the hub's catalog files; the sk-code catalog file existence itself was not directly confirmed in this iteration (stated coverage limit). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **overlay — feature_catalog_code: partial.** Removal step 6 now names the hub's catalog files; the sk-code catalog file existence itself was not directly confirmed in this iteration (stated coverage limit).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay — feature_catalog_code: partial.** Removal step 6 now names the hub's catalog files; the sk-code catalog file existence itself was not directly confirmed in this iteration (stated coverage limit).

### **overlay — playbook_capability: observed unchanged.** The removal recipe's playbook references are untouched, and no capability claim was invalidated. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **overlay — playbook_capability: observed unchanged.** The removal recipe's playbook references are untouched, and no capability claim was invalidated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay — playbook_capability: observed unchanged.** The removal recipe's playbook references are untouched, and no capability claim was invalidated.

### **overlay — skill_agent: no skill agent document changed.** Both script edits are code; D5 (no skill release) is consistent with the diff. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **overlay — skill_agent: no skill agent document changed.** Both script edits are code; D5 (no skill release) is consistent with the diff.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay — skill_agent: no skill agent document changed.** Both script edits are code; D5 (no skill release) is consistent with the diff.

### **playbook_capability — observed unchanged.** The removal recipe's playbook references are untouched and no capability claim is invalidated. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **playbook_capability — observed unchanged.** The removal recipe's playbook references are untouched and no capability claim is invalidated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **playbook_capability — observed unchanged.** The removal recipe's playbook references are untouched and no capability claim is invalidated.

### **playbook_capability — observed.** Removal step 6 keeps the manual-testing-playbook rows; no capability claim invalidated. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: **playbook_capability — observed.** Removal step 6 keeps the manual-testing-playbook rows; no capability claim invalidated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **playbook_capability — observed.** Removal step 6 keeps the manual-testing-playbook rows; no capability claim invalidated.

### **R1** → [SOURCE: README.md:1451] (provision item) and [SOURCE: README.md:1452] (`skilled.trustRepoHooks` item), matching D1 at `goal.md:44`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **R1** → [SOURCE: README.md:1451] (provision item) and [SOURCE: README.md:1452] (`skilled.trustRepoHooks` item), matching D1 at `goal.md:44`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **R1** → [SOURCE: README.md:1451] (provision item) and [SOURCE: README.md:1452] (`skilled.trustRepoHooks` item), matching D1 at `goal.md:44`.

### **R2** → the new `staleFix` derivation at [SOURCE: .skilled/bin/compiled-route-guard.cjs:100], its per-hub return string at [SOURCE: .skilled/bin/compiled-route-guard.cjs:104], the `inspect` branch at [SOURCE: .skilled/bin/compiled-route-guard.cjs:145] and the print at [SOURCE: .skilled/bin/compiled-route-guard.cjs:195]. The line names the refresh command, the runtime manifest, its authored twin, the copy and the hooks alternative — D2 verbatim. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **R2** → the new `staleFix` derivation at [SOURCE: .skilled/bin/compiled-route-guard.cjs:100], its per-hub return string at [SOURCE: .skilled/bin/compiled-route-guard.cjs:104], the `inspect` branch at [SOURCE: .skilled/bin/compiled-route-guard.cjs:145] and the print at [SOURCE: .skilled/bin/compiled-route-guard.cjs:195]. The line names the refresh command, the runtime manifest, its authored twin, the copy and the hooks alternative — D2 verbatim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **R2** → the new `staleFix` derivation at [SOURCE: .skilled/bin/compiled-route-guard.cjs:100], its per-hub return string at [SOURCE: .skilled/bin/compiled-route-guard.cjs:104], the `inspect` branch at [SOURCE: .skilled/bin/compiled-route-guard.cjs:145] and the print at [SOURCE: .skilled/bin/compiled-route-guard.cjs:195]. The line names the refresh command, the runtime manifest, its authored twin, the copy and the hooks alternative — D2 verbatim.

### **R4** → [SOURCE: README.md:1463] (removal step 6, feature catalog), [SOURCE: README.md:1464] (step 7, `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`, with `causal_summary` as the only hand edit), [SOURCE: README.md:1472] (add step 3, the surface-count files plus `leaf-scopes.json` with the sk-doc format exemplar). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **R4** → [SOURCE: README.md:1463] (removal step 6, feature catalog), [SOURCE: README.md:1464] (step 7, `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`, with `causal_summary` as the only hand edit), [SOURCE: README.md:1472] (add step 3, the surface-count files plus `leaf-scopes.json` with the sk-doc format exemplar).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **R4** → [SOURCE: README.md:1463] (removal step 6, feature catalog), [SOURCE: README.md:1464] (step 7, `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`, with `causal_summary` as the only hand edit), [SOURCE: README.md:1472] (add step 3, the surface-count files plus `leaf-scopes.json` with the sk-doc format exemplar).

### **R5** → the loader at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] (`failure.code = 'SHARED_NOT_BUILT'`), message at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:81], rethrow of any other load error at `:79`, and the stack-free gate at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64] with the exit at `:66`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **R5** → the loader at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] (`failure.code = 'SHARED_NOT_BUILT'`), message at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:81], rethrow of any other load error at `:79`, and the stack-free gate at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64] with the exit at `:66`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **R5** → the loader at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] (`failure.code = 'SHARED_NOT_BUILT'`), message at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:81], rethrow of any other load error at `:79`, and the stack-free gate at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64] with the exit at `:66`.

### **skill_agent — notApplicable.** No skill doc or agent document in the changed set; D5 holds. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **skill_agent — notApplicable.** No skill doc or agent document in the changed set; D5 holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent — notApplicable.** No skill doc or agent document in the changed set; D5 holds.

### **skill_agent — notApplicable.** No skill or agent document in the changed set (D5 holds). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **skill_agent — notApplicable.** No skill or agent document in the changed set (D5 holds).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent — notApplicable.** No skill or agent document in the changed set (D5 holds).

### **skill_agent — notApplicable.** No SKILL.md or agent document is in the changed set; D5 holds. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **skill_agent — notApplicable.** No SKILL.md or agent document is in the changed set; D5 holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent — notApplicable.** No SKILL.md or agent document is in the changed set; D5 holds.

### **spec_code — pass.** R2: the fix text built at [SOURCE: .skilled/bin/compiled-route-guard.cjs:99] is printed per stale hub at [SOURCE: .skilled/bin/compiled-route-guard.cjs:195] and pinned by T1/T2 at [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:623]. R5: the loader at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] relabels only the named module and the gate at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64] prints it stack-free, pinned by T3/T4 at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718]. R1/R4 README rows map as recorded in iteration 3. D2, D3 and D5 hold. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **spec_code — pass.** R2: the fix text built at [SOURCE: .skilled/bin/compiled-route-guard.cjs:99] is printed per stale hub at [SOURCE: .skilled/bin/compiled-route-guard.cjs:195] and pinned by T1/T2 at [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:623]. R5: the loader at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] relabels only the named module and the gate at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64] prints it stack-free, pinned by T3/T4 at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718]. R1/R4 README rows map as recorded in iteration 3. D2, D3 and D5 hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code — pass.** R2: the fix text built at [SOURCE: .skilled/bin/compiled-route-guard.cjs:99] is printed per stale hub at [SOURCE: .skilled/bin/compiled-route-guard.cjs:195] and pinned by T1/T2 at [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:623]. R5: the loader at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] relabels only the named module and the gate at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64] prints it stack-free, pinned by T3/T4 at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718]. R1/R4 README rows map as recorded in iteration 3. D2, D3 and D5 hold.

### **spec_code (core) — pass (carried).** R1 → README.md:1451-1452; R2 → .skilled/bin/compiled-route-guard.cjs:99-104, printed at :195; R4 → README.md:1463-1464 and :1472; R5 → .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:76-84 with the gate at ci-skill-root-metadata.cjs:63-66. D1-D5 hold; not re-entered. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **spec_code (core) — pass (carried).** R1 → README.md:1451-1452; R2 → .skilled/bin/compiled-route-guard.cjs:99-104, printed at :195; R4 → README.md:1463-1464 and :1472; R5 → .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:76-84 with the gate at ci-skill-root-metadata.cjs:63-66. D1-D5 hold; not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (core) — pass (carried).** R1 → README.md:1451-1452; R2 → .skilled/bin/compiled-route-guard.cjs:99-104, printed at :195; R4 → README.md:1463-1464 and :1472; R5 → .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:76-84 with the gate at ci-skill-root-metadata.cjs:63-66. D1-D5 hold; not re-entered.

### `agent_cross_runtime` — notApplicable; no runtime-specific file in the changed set. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime` — notApplicable; no runtime-specific file in the changed set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` — notApplicable; no runtime-specific file in the changed set.

### `checklist_evidence` — deferred; ledger rows live in `implementation-summary.md`, outside the review scope. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` — deferred; ledger rows live in `implementation-summary.md`, outside the review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — deferred; ledger rows live in `implementation-summary.md`, outside the review scope.

### `feature_catalog_code` — **pass**; iteration 1's stated coverage limit is closed: `.skilled/skills/sk-code/feature-catalog/feature-catalog.md`, its `two-axis-registry-driven-routing/` and `compiled-routing-and-legacy-fallback/` subdirectories, and `shared/references/phase-detection.md` all exist. `.skilled/skills/sk-code/leaf-scopes.json` is absent, consistent with the README describing the file a user creates when `MODE_LEAF_SET_COLLISION` fires (`.skilled/skills/sk-doc/leaf-scopes.json`, the named format exemplar, exists). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code` — **pass**; iteration 1's stated coverage limit is closed: `.skilled/skills/sk-code/feature-catalog/feature-catalog.md`, its `two-axis-registry-driven-routing/` and `compiled-routing-and-legacy-fallback/` subdirectories, and `shared/references/phase-detection.md` all exist. `.skilled/skills/sk-code/leaf-scopes.json` is absent, consistent with the README describing the file a user creates when `MODE_LEAF_SET_COLLISION` fires (`.skilled/skills/sk-doc/leaf-scopes.json`, the named format exemplar, exists).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — **pass**; iteration 1's stated coverage limit is closed: `.skilled/skills/sk-code/feature-catalog/feature-catalog.md`, its `two-axis-registry-driven-routing/` and `compiled-routing-and-legacy-fallback/` subdirectories, and `shared/references/phase-detection.md` all exist. `.skilled/skills/sk-code/leaf-scopes.json` is absent, consistent with the README describing the file a user creates when `MODE_LEAF_SET_COLLISION` fires (`.skilled/skills/sk-doc/leaf-scopes.json`, the named format exemplar, exists).

### `parent-skill-check.cjs` was not read (see R1-P2-001); the two sk-code catalog/`leaf-scopes.json` files were not directly listed in the search result set. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `parent-skill-check.cjs` was not read (see R1-P2-001); the two sk-code catalog/`leaf-scopes.json` files were not directly listed in the search result set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `parent-skill-check.cjs` was not read (see R1-P2-001); the two sk-code catalog/`leaf-scopes.json` files were not directly listed in the search result set.

### `playbook_capability` — observed unchanged. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability` — observed unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` — observed unchanged.

### `skill_agent` — notApplicable; no skill agent doc in the changed set. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent` — notApplicable; no skill agent doc in the changed set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — notApplicable; no skill agent doc in the changed set.

### `spec_code` — carried from iteration 1 (verified); the citations above re-confirm the changed lines. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` — carried from iteration 1 (verified); the citations above re-confirm the changed lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — carried from iteration 1 (verified); the citations above re-confirm the changed lines.

### A fresh hub carries no stale fix text → trivially unreachable: fresh hubs are never in the failures array, and the print loop filters `stale-manifest` only (guard `:192`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A fresh hub carries no stale fix text → trivially unreachable: fresh hubs are never in the failures array, and the print loop filters `stale-manifest` only (guard `:192`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fresh hub carries no stale fix text → trivially unreachable: fresh hubs are never in the failures array, and the print loop filters `stale-manifest` only (guard `:192`).

### A module other than `@spec-kit/shared` → T4. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A module other than `@spec-kit/shared` → T4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A module other than `@spec-kit/shared` → T4.

### A stale hub other than sk-code → T2. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A stale hub other than sk-code → T2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale hub other than sk-code → T2.

### T1/T2 (guard): `compiled-route-manifest.test.cjs:623–647`, calling `guard.staleFix` at `:628` and `:642`; T2 asserts a second hub gets its own skill root and that no `sk-code` text leaks. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: T1/T2 (guard): `compiled-route-manifest.test.cjs:623–647`, calling `guard.staleFix` at `:628` and `:642`; T2 asserts a second hub gets its own skill root and that no `sk-code` text leaks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: T1/T2 (guard): `compiled-route-manifest.test.cjs:623–647`, calling `guard.staleFix` at `:628` and `:642`; T2 asserts a second hub gets its own skill root and that no `sk-code` text leaks.

### T3/T4 (relabel): `root-router-contract.test.cjs:718–800`; T3 asserts one line naming the provision command with no stack frame (`:753–769`), T4 asserts an unrelated missing module is not relabeled (`:773–797`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: T3/T4 (relabel): `root-router-contract.test.cjs:718–800`; T3 asserts one line naming the provision command with no stack frame (`:753–769`), T4 asserts an unrelated missing module is not relabeled (`:773–797`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: T3/T4 (relabel): `root-router-contract.test.cjs:718–800`; T3 asserts one line naming the provision command with no stack frame (`:753–769`), T4 asserts an unrelated missing module is not relabeled (`:773–797`).

### Tests were not executed: this dispatch is a read-only iteration and repo tooling is out of scope, so all verification here is static. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Tests were not executed: this dispatch is a read-only iteration and repo tooling is out of scope, so all verification here is static.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tests were not executed: this dispatch is a read-only iteration and repo tooling is out of scope, so all verification here is static.

### The doctor loads the library in an unprovisioned tree → no mapped change or test; carried as open R1-P2-001. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The doctor loads the library in an unprovisioned tree → no mapped change or test; carried as open R1-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The doctor loads the library in an unprovisioned tree → no mapped change or test; carried as open R1-P2-001.

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
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- 026/002 added the guard's authored-drift and authored-missing lines with the same fix-line shape the stale line now follows.
- The fresh-clone run (ledger L-1, L-2) and the stale-copy run (L-3, L-4) passed on the build commit; T1 and T3 fail against origin/main and pass after.
- resource-map.md not present; skipping coverage gate.

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
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
- `README.md`
- `.skilled/bin/compiled-route-guard.cjs`
- `.skilled/bin/tests/compiled-route-manifest.test.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/spec.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/goal.md`

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
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
