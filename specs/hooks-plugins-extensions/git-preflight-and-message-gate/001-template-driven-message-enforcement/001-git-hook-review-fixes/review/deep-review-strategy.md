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
The live machine-wide git hooks in the main checkout (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/`), installed through global `core.hooksPath`, plus their libraries, the installer, `.skilled/hooks/git/pre-commit`, and the sk-git message validator (`validate-message.mjs`, `lib/message-contract.mjs`). Review target type: files. These are the hooks as committed on main at `03afeb4552`; they do NOT include the uncommitted fixes in worktree 075.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The worktree 075 copies of these files (an uncommitted fix set for an earlier review).
- Hook tests under `tests/` (read them as evidence only).
- Anything outside the listed scope files.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: all 5 iterations run.

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
- P0 (Blockers): 2
- P1 (Required): 10
- P2 (Suggestions): 16
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Pipeline cross-reading (stamper -> commit-msg -> pre-push): surfaced three producer/consumer disagreements that no single-file read shows (iteration 1)
- Reading the worktree-075 fix set as context, then proving each candidate against main-target lines: precise anchors without citing the modified copy as the target (iteration 1)
- Scratch-repo experiment with a logging prepare-commit-msg hook: settled the cherry-pick `$2` source question empirically (iteration 1)
- Tracing every `source`/`.`/exec site back to its resolver: separated the one trusted resolver (HOOK_DIR beside the real global hook) from the repo-controlled SOURCE_ROOT family, turning D1's deferred pointer into a confirmed P0 (iteration 2)
- Grounding the machine-wide claim with `git config --global core.hooksPath` plus the symlink listing: the threat model is observed, not assumed (iteration 2)
- Reading the acceptance criteria, task ledger and feature catalog against the resolver and CLI line by line: found five doc/evidence drifts no code-centric pass would surface (iteration 3)
- Anchoring evidence to the SHA graph (`merge-base --is-ancestor` plus `git log <evidence-sha>..HEAD` over the reviewed paths): turned "the docs claim X" into a precise stale-evidence claim (iteration 3)
- Reading each installed hook beside its legacy twin and its shared libs: exposed a real behavioral divergence (checker exit taxonomy and output handling) and a hardcoded spec-packet path that single-dimension passes had not surfaced (iteration 4)
- Tracing where the attribution policy actually lives (template vs hardcoded stamper regexes): found the one place the module's "a rule exists exactly once" claim does not hold (iteration 4)
- Adversarial re-verification with a scratch repository: re-measured the cherry-pick `$2` source as `message` on all three invocations, closing the one empirical premise behind R1-P1-002 (iteration 5)
- Diffing main against the worktree-075 fix set over the hunt surface: showed every active P0/P1 site live on main and every intended fix present only in the worktree, corroborating the finding set without citing the modified copy as target (iteration 5)
- Re-observing the global hooksPath symlink listing before the terminal pass: turned the P0 blast-radius premise into fresh evidence at the final revision (iteration 5)

---

## 9. WHAT FAILED
- Reading prepare-commit-msg alone: the subject-deletion path (R1-P1-001) stayed invisible until the commit-msg consumer was traced (iteration 1)
- The node-free `declares rules` grep probe had never been compared against the validator's own heading parser until this pass; the divergence it hides is now R5-P2-001 (iteration 5)
- The first scratch experiment failed on a printf format-reuse bug; re-ran with a simpler hook body (iteration 1)
- Treating `_in_toolchain_repo` as the attack precondition: the autostash and hook-flags source sites never require it, and the no-sentinel fallback to the clone's own `.opencode` is the wider path (iteration 2)
- Trusting the acceptance-criteria "Met" labels at face value: AC-003 names a config key no code path reads, and every row's evidence predates the reviewed revision (iteration 3)
- Budget ran out before the sk-git playbook scenarios (commit-formation/template-rules-block-commits.md, co-authored-by-footer.md) could be executed; recorded as deferred, not passed (iteration 3)
- The pre-push header's gate inventory could not be reconciled against a canonical list: header and code each act as the inventory, so the stale list is recorded as a finding rather than repaired inside a review (iteration 4)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `--status` contract reporting absent: refuted — install-git-hooks.sh:140-149 invokes `validate-message.mjs --explain`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `--status` contract reporting absent: refuted — install-git-hooks.sh:140-149 invokes `validate-message.mjs --explain`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--status` contract reporting absent: refuted — install-git-hooks.sh:140-149 invokes `validate-message.mjs --explain`.

### `post-rewrite` stdin non-consumption: verified clean (see Confirmed-Clean Surfaces). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `post-rewrite` stdin non-consumption: verified clean (see Confirmed-Clean Surfaces).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `post-rewrite` stdin non-consumption: verified clean (see Confirmed-Clean Surfaces).

### `validate-message.mjs` record splitting on `0x1e` (`revListMode:149-153`): a commit message containing the record separator cannot cause a violating commit to skip validation — a mis-keyed fragment misses the exact-SHA map and line 156 re-reads that commit individually. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `validate-message.mjs` record splitting on `0x1e` (`revListMode:149-153`): a commit message containing the record separator cannot cause a violating commit to skip validation — a mis-keyed fragment misses the exact-SHA map and line 156 re-reads that commit individually.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `validate-message.mjs` record splitting on `0x1e` (`revListMode:149-153`): a commit message containing the record separator cannot cause a violating commit to skip validation — a mis-keyed fragment misses the exact-SHA map and line 156 re-reads that commit individually.

### agent_cross_runtime (overlay): **notApplicable — carried.** Native git hooks have no per-runtime adapters (`hooks/git/README.md:52`). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: agent_cross_runtime (overlay): **notApplicable — carried.** Native git hooks have no per-runtime adapters (`hooks/git/README.md:52`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime (overlay): **notApplicable — carried.** Native git hooks have no per-runtime adapters (`hooks/git/README.md:52`).

### agent_cross_runtime (overlay): **notApplicable — carried.** Native git hooks have no per-runtime adapters (hooks/git/README.md:52). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: agent_cross_runtime (overlay): **notApplicable — carried.** Native git hooks have no per-runtime adapters (hooks/git/README.md:52).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime (overlay): **notApplicable — carried.** Native git hooks have no per-runtime adapters (hooks/git/README.md:52).

### agent_cross_runtime (overlay): **notApplicable** — the 14 reviewed files are native git hooks; `.skilled/hooks/git/README.md:52` states this concern has no per-runtime adapters. The seven-runtime agent gate is a different, out-of-target surface. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: agent_cross_runtime (overlay): **notApplicable** — the 14 reviewed files are native git hooks; `.skilled/hooks/git/README.md:52` states this concern has no per-runtime adapters. The seven-runtime agent gate is a different, out-of-target surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime (overlay): **notApplicable** — the 14 reviewed files are native git hooks; `.skilled/hooks/git/README.md:52` states this concern has no per-runtime adapters. The seven-runtime agent gate is a different, out-of-target surface.

### checklist_evidence (core): **fail — carried from iteration 3, not re-run.** R3-P2-001, R3-P2-002 and R3-P2-005 remain active; this iteration added no checklist evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: checklist_evidence (core): **fail — carried from iteration 3, not re-run.** R3-P2-001, R3-P2-002 and R3-P2-005 remain active; this iteration added no checklist evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence (core): **fail — carried from iteration 3, not re-run.** R3-P2-001, R3-P2-002 and R3-P2-005 remain active; this iteration added no checklist evidence.

### checklist_evidence (core): **fail — carried from iteration 3, not re-run.** R3-P2-001, R3-P2-002 and R3-P2-005 remain active. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: checklist_evidence (core): **fail — carried from iteration 3, not re-run.** R3-P2-001, R3-P2-002 and R3-P2-005 remain active.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence (core): **fail — carried from iteration 3, not re-run.** R3-P2-001, R3-P2-002 and R3-P2-005 remain active.

### checklist_evidence (core): **fail** — R3-P2-001, R3-P2-002 and R3-P2-005. The AC table is the closure gate; two of its rows are not reproducible as written or not pinned to the reviewed revision, and the task checklist contradicts the closure statement. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: checklist_evidence (core): **fail** — R3-P2-001, R3-P2-002 and R3-P2-005. The AC table is the closure gate; two of its rows are not reproducible as written or not pinned to the reviewed revision, and the task checklist contradicts the closure statement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence (core): **fail** — R3-P2-001, R3-P2-002 and R3-P2-005. The AC table is the closure gate; two of its rows are not reproducible as written or not pinned to the reviewed revision, and the task checklist contradicts the closure statement.

### checklist_evidence (core): deferred to D3 (checklist not in this iteration's read set). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: checklist_evidence (core): deferred to D3 (checklist not in this iteration's read set).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence (core): deferred to D3 (checklist not in this iteration's read set).

### checklist_evidence (core): deferred to D3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence (core): deferred to D3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence (core): deferred to D3.

### CLI contract drift beyond tasks.md: spec.md:92 matches the implementation exactly; only the tasks.md:51 shorthand `--range` is stale (folded into R3-P2-001), not evidence of a missing feature. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: CLI contract drift beyond tasks.md: spec.md:92 matches the implementation exactly; only the tasks.md:51 shorthand `--range` is stale (folded into R3-P2-001), not evidence of a missing feature.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CLI contract drift beyond tasks.md: spec.md:92 matches the implementation exactly; only the tasks.md:51 shorthand `--range` is stale (folded into R3-P2-001), not evidence of a missing feature.

### Dead mass-deletion staged/commit surface: reachable only from its own test; cleanup-only, no behavioral impact, not filed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Dead mass-deletion staged/commit surface: reachable only from its own test; cleanup-only, no behavioral impact, not filed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead mass-deletion staged/commit surface: reachable only from its own test; cleanup-only, no behavioral impact, not filed.

### Empty `.sk-git/` shadowing committed assets rules: not live in the main checkout (no `.sk-git/` directory); folded into R5-P2-001 as a resolution-order note instead of a standalone finding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Empty `.sk-git/` shadowing committed assets rules: not live in the main checkout (no `.sk-git/` directory); folded into R5-P2-001 as a resolution-order note instead of a standalone finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Empty `.sk-git/` shadowing committed assets rules: not live in the main checkout (no `.sk-git/` directory); folded into R5-P2-001 as a resolution-order note instead of a standalone finding.

### feature_catalog_code (overlay): **partial — carried from iteration 3.** R3-P2-003 remains active; not re-inspected here. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: feature_catalog_code (overlay): **partial — carried from iteration 3.** R3-P2-003 remains active; not re-inspected here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code (overlay): **partial — carried from iteration 3.** R3-P2-003 remains active; not re-inspected here.

### feature_catalog_code (overlay): **partial — carried.** R3-P2-003 remains active. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: feature_catalog_code (overlay): **partial — carried.** R3-P2-003 remains active.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code (overlay): **partial — carried.** R3-P2-003 remains active.

### feature_catalog_code (overlay): **partial** — the feature-catalog entry exists and matches the resolution order, gate list, exit codes and source table, but its range-check paragraph overclaims rebase safety (R3-P2-003). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: feature_catalog_code (overlay): **partial** — the feature-catalog entry exists and matches the resolution order, gate list, exit codes and source table, but its range-check paragraph overclaims rebase safety (R3-P2-003).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code (overlay): **partial** — the feature-catalog entry exists and matches the resolution order, gate list, exit codes and source table, but its range-check paragraph overclaims rebase safety (R3-P2-003).

### Installer installing the legacy helper: it does not; the ownership set covers only `.skilled|.opencode/scripts/git-hooks` (install-git-hooks.sh:77) — re-confirmed clean. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Installer installing the legacy helper: it does not; the ownership set covers only `.skilled|.opencode/scripts/git-hooks` (install-git-hooks.sh:77) — re-confirmed clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Installer installing the legacy helper: it does not; the ownership set covers only `.skilled|.opencode/scripts/git-hooks` (install-git-hooks.sh:77) — re-confirmed clean.

### Installer overwriting foreign hooks: is_our_symlink scopes replacement to owned source dirs (install-git-hooks.sh:83-94). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Installer overwriting foreign hooks: is_our_symlink scopes replacement to owned source dirs (install-git-hooks.sh:83-94).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Installer overwriting foreign hooks: is_our_symlink scopes replacement to owned source dirs (install-git-hooks.sh:83-94).

### Maintainability protocol: no overlay protocol maps to this dimension; the check is the read-and-compare evidence recorded in the six findings. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Maintainability protocol: no overlay protocol maps to this dimension; the check is the read-and-compare evidence recorded in the six findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Maintainability protocol: no overlay protocol maps to this dimension; the check is the read-and-compare evidence recorded in the six findings.

### Mass-deletion arithmetic/injection: digit-sanitized counts and guarded comparisons (mass-deletion-guard.sh:24-39,54-61). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Mass-deletion arithmetic/injection: digit-sanitized counts and guarded comparisons (mass-deletion-guard.sh:24-39,54-61).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mass-deletion arithmetic/injection: digit-sanitized counts and guarded comparisons (mass-deletion-guard.sh:24-39,54-61).

### Native-hook runtime parity gap: the concern has no per-runtime adapters by design (hooks/git/README.md:52) → notApplicable, not a gap. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Native-hook runtime parity gap: the concern has no per-runtime adapters by design (hooks/git/README.md:52) → notApplicable, not a gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Native-hook runtime parity gap: the concern has no per-runtime adapters by design (hooks/git/README.md:52) → notApplicable, not a gap.

### Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): deferred to D3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): deferred to D3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): deferred to D3.

### Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not checked this iteration; D3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not checked this iteration; D3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not checked this iteration; D3.

### Path traversal via skgit.contractDir: resolved against repo root and existence-checked (message-contract.mjs:239-245; message-contract-gate.sh:38-49). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Path traversal via skgit.contractDir: resolved against repo root and existence-checked (message-contract.mjs:239-245; message-contract-gate.sh:38-49).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path traversal via skgit.contractDir: resolved against repo root and existence-checked (message-contract.mjs:239-245; message-contract-gate.sh:38-49).

### playbook_capability (overlay): **deferred — carried from iteration 3.** Not executed; explicitly not a pass. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: playbook_capability (overlay): **deferred — carried from iteration 3.** Not executed; explicitly not a pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability (overlay): **deferred — carried from iteration 3.** Not executed; explicitly not a pass.

### playbook_capability (overlay): **deferred — carried; not executed, never a pass.** -- BLOCKED (iteration 5, 1 attempts)
- What was tried: playbook_capability (overlay): **deferred — carried; not executed, never a pass.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability (overlay): **deferred — carried; not executed, never a pass.**

### playbook_capability (overlay): **deferred** — sk-git playbook scenarios exist (`manual-testing-playbook/commit-formation/template-rules-block-commits.md`, `co-authored-by-footer.md`) but were not executed or line-verified within this iteration's budget; deferred, not passed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: playbook_capability (overlay): **deferred** — sk-git playbook scenarios exist (`manual-testing-playbook/commit-formation/template-rules-block-commits.md`, `co-authored-by-footer.md`) but were not executed or line-verified within this iteration's budget; deferred, not passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability (overlay): **deferred** — sk-git playbook scenarios exist (`manual-testing-playbook/commit-formation/template-rules-block-commits.md`, `co-authored-by-footer.md`) but were not executed or line-verified within this iteration's budget; deferred, not passed.

### Prologue text drift: none exists today (all eight copies byte-identical); the duplication risk is filed as R4-P2-006, not as a present divergence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Prologue text drift: none exists today (all eight copies byte-identical); the duplication risk is filed as R4-P2-006, not as a present divergence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prologue text drift: none exists today (all eight copies byte-identical); the duplication risk is filed as R4-P2-006, not as a present divergence.

### Secrets exposure through hook logs: autostash and mass-deletion logs carry SHAs, timestamps and source labels only (autostash-orphan-guard.sh:39-46; mass-deletion-guard.sh:77-80). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secrets exposure through hook logs: autostash and mass-deletion logs carry SHAs, timestamps and source labels only (autostash-orphan-guard.sh:39-46; mass-deletion-guard.sh:77-80).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets exposure through hook logs: autostash and mass-deletion logs carry SHAs, timestamps and source labels only (autostash-orphan-guard.sh:39-46; mass-deletion-guard.sh:77-80).

### Shell injection via stamped trailer values: SPEC value is regex-constrained (prepare-commit-msg:239); validator only path-joins (message-contract.mjs:476-490); no exec/eval sink. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Shell injection via stamped trailer values: SPEC value is regex-constrained (prepare-commit-msg:239); validator only path-joins (message-contract.mjs:476-490); no exec/eval sink.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection via stamped trailer values: SPEC value is regex-constrained (prepare-commit-msg:239); validator only path-joins (message-contract.mjs:476-490); no exec/eval sink.

### Shell interpolation in the Node validator layer: `execFileSync` argv arrays only (validate-message.mjs:70,77; message-contract.mjs:217). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Shell interpolation in the Node validator layer: `execFileSync` argv arrays only (validate-message.mjs:70,77; message-contract.mjs:217).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell interpolation in the Node validator layer: `execFileSync` argv arrays only (validate-message.mjs:70,77; message-contract.mjs:217).

### skill_agent (overlay): **pass — carried from iteration 3, not re-run.** -- BLOCKED (iteration 4, 1 attempts)
- What was tried: skill_agent (overlay): **pass — carried from iteration 3, not re-run.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent (overlay): **pass — carried from iteration 3, not re-run.**

### skill_agent (overlay): **pass — carried.** -- BLOCKED (iteration 5, 1 attempts)
- What was tried: skill_agent (overlay): **pass — carried.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent (overlay): **pass — carried.**

### skill_agent (overlay): **pass** — SKILL.md:317 (`skgit.contractDir`) and SKILL.md:302 (autostash guard anchors under `refs/autostash-rescue/<sha>` and alerts) agree with message-contract.mjs:239 and lib/README.md:27-38; scripts/README.md:47 agrees. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: skill_agent (overlay): **pass** — SKILL.md:317 (`skgit.contractDir`) and SKILL.md:302 (autostash guard anchors under `refs/autostash-rescue/<sha>` and alerts) agree with message-contract.mjs:239 and lib/README.md:27-38; scripts/README.md:47 agrees.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent (overlay): **pass** — SKILL.md:317 (`skgit.contractDir`) and SKILL.md:302 (autostash guard anchors under `refs/autostash-rescue/<sha>` and alerts) agree with message-contract.mjs:239 and lib/README.md:27-38; scripts/README.md:47 agrees.

### spec_code (core): **pass — carried from iteration 3, not re-run.** D3 matched spec.md:69,92,107,70 to the resolver, CLI flags, `--status` reporting and the skip policy; this iteration found no new spec-drift and made no counter-claim. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: spec_code (core): **pass — carried from iteration 3, not re-run.** D3 matched spec.md:69,92,107,70 to the resolver, CLI flags, `--status` reporting and the skip policy; this iteration found no new spec-drift and made no counter-claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code (core): **pass — carried from iteration 3, not re-run.** D3 matched spec.md:69,92,107,70 to the resolver, CLI flags, `--status` reporting and the skip policy; this iteration found no new spec-drift and made no counter-claim.

### spec_code (core): **pass — carried from iteration 3, not re-run.** No new spec drift found on the live lines read this iteration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: spec_code (core): **pass — carried from iteration 3, not re-run.** No new spec drift found on the live lines read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code (core): **pass — carried from iteration 3, not re-run.** No new spec drift found on the live lines read this iteration.

### spec_code (core): **pass** — spec.md's claims match the implementation at HEAD: resolution order contractDir → `.sk-git/` → repo sk-git assets (message-contract.mjs:235-244, catalog:29), CLI surface from spec.md:92 present (validate-message.mjs:6-13,46), spec.md:107 `--status` reports the resolved contract via `--explain` (install-git-hooks.sh:140-149), and spec.md:70's declared exception survives alone (`SPECKIT_SKIP_PREPARE_COMMIT_MSG`, prepare-commit-msg:14,28). The drifts found are in AC/tasks/catalog docs, not in spec.md. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: spec_code (core): **pass** — spec.md's claims match the implementation at HEAD: resolution order contractDir → `.sk-git/` → repo sk-git assets (message-contract.mjs:235-244, catalog:29), CLI surface from spec.md:92 present (validate-message.mjs:6-13,46), spec.md:107 `--status` reports the resolved contract via `--explain` (install-git-hooks.sh:140-149), and spec.md:70's declared exception survives alone (`SPECKIT_SKIP_PREPARE_COMMIT_MSG`, prepare-commit-msg:14,28). The drifts found are in AC/tasks/catalog docs, not in spec.md.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code (core): **pass** — spec.md's claims match the implementation at HEAD: resolution order contractDir → `.sk-git/` → repo sk-git assets (message-contract.mjs:235-244, catalog:29), CLI surface from spec.md:92 present (validate-message.mjs:6-13,46), spec.md:107 `--status` reports the resolved contract via `--explain` (install-git-hooks.sh:140-149), and spec.md:70's declared exception survives alone (`SPECKIT_SKIP_PREPARE_COMMIT_MSG`, prepare-commit-msg:14,28). The drifts found are in AC/tasks/catalog docs, not in spec.md.

### spec_code (core): partial — prepare-commit-msg header contract (lines 5-9) vs implementation checked; mismatch recorded as R1-P1-002. Full spec.md alignment is D3's. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: spec_code (core): partial — prepare-commit-msg header contract (lines 5-9) vs implementation checked; mismatch recorded as R1-P1-002. Full spec.md alignment is D3's.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code (core): partial — prepare-commit-msg header contract (lines 5-9) vs implementation checked; mismatch recorded as R1-P1-002. Full spec.md alignment is D3's.

### spec_code (core): pending — D3 owns full spec.md alignment; this iteration did not re-run it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code (core): pending — D3 owns full spec.md alignment; this iteration did not re-run it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code (core): pending — D3 owns full spec.md alignment; this iteration did not re-run it.

### Spec-trailer path traversal (distinct from the swept `skgit.contractDir` path): `path.posix.join` then `fs.existsSync` only, no read/write sink (message-contract.mjs:485-488). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Spec-trailer path traversal (distinct from the swept `skgit.contractDir` path): `path.posix.join` then `fs.existsSync` only, no read/write sink (message-contract.mjs:485-488).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Spec-trailer path traversal (distinct from the swept `skgit.contractDir` path): `path.posix.join` then `fs.existsSync` only, no read/write sink (message-contract.mjs:485-488).

### The four swept security/correctness directions were not re-entered (see sweep list above). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The four swept security/correctness directions were not re-entered (see sweep list above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The four swept security/correctness directions were not re-entered (see sweep list above).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Shell injection via stamped trailer values: SPEC value is regex-constrained and the validator only path-joins; no exec/eval sink (iteration 1, evidence: prepare-commit-msg:239, message-contract.mjs:476-490)
- Path traversal via skgit.contractDir: resolved against repo root and existence-checked (iteration 1, evidence: message-contract.mjs:239-245, message-contract-gate.sh:38-49)
- Mass-deletion arithmetic overflow or injection: digit-sanitized counts and guarded comparisons (iteration 1, evidence: mass-deletion-guard.sh:24-39,54-61)
- Installer overwriting foreign hook symlinks: is_our_symlink scopes replacement to this repo's hook source dirs (iteration 1, evidence: install-git-hooks.sh:83-94)
- Spec-trailer path traversal (distinct from the swept contractDir path): `path.posix.join` then `fs.existsSync` only, no read or write sink (iteration 2, evidence: message-contract.mjs:485-488)
- Secrets exposure through hook logs: autostash and mass-deletion logs carry SHAs, timestamps and source labels only (iteration 2, evidence: autostash-orphan-guard.sh:39-46, mass-deletion-guard.sh:77-80)
- Shell interpolation in the Node validator layer: all child processes use execFileSync with argv arrays (iteration 2, evidence: validate-message.mjs:70,77, message-contract.mjs:217)
- CLI surface drift beyond the tasks.md shorthand: spec.md:92's flag list matches validate-message.mjs:6-13,46 exactly; only tasks.md:51 says `--range` (iteration 3, evidence: spec.md:92, tasks.md:51, validate-message.mjs:8,46)
- `install-git-hooks.sh --status` failing to report the resolved contract: refuted; it runs `validate-message.mjs --repo <root> --explain` (iteration 3, evidence: install-git-hooks.sh:140-149, spec.md:107)
- Native-hook runtime-parity gap: this concern has no per-runtime adapters by design (iteration 3, evidence: hooks/git/README.md:52)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
An earlier single-pass review (2026-10-02, base `f8519088b9`) reported 1 P0 (an untrusted clone tree supplies the code the hooks source), 11 P1 and 7 P2. Its fixes live UNCOMMITTED in worktree 075 and are NOT in this target, so those defects are expected to still be present in main. Re-confirm them with fresh evidence, and hunt for NEW defects. Known prior themes: SOURCE_ROOT trust, pre-push range re-checking remote commits, Commit-Id collision on rebase, cherry-pick id reuse, command-scope skgit.contractDir, attribution stripping removing line 1, hygiene on working tree instead of staged blob, mirror/routing parity firing in foreign repos.

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
Scope files:

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-commit` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/prepare-commit-msg` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/commit-msg` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/post-commit` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/post-merge` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/post-rewrite` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-push` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/lib/message-contract-gate.sh` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/install-git-hooks.sh` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/hooks/git/pre-commit` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/validate-message.mjs` | - | 0 | - | pending |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/lib/message-contract.mjs` | - | 0 | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=dr-githooks-20261002T103712Z, parentSessionId=null, generation=1, lineageMode=new
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
