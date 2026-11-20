---
title: "Implementation Summary: Phase 9: close the four Skilled-side open items of the overlay layout"
description: "record-base now records the pinned commit or refuses, every deep-review fan-out lineage carries the run's review scope, the overlay engine's pre-commit check works in a linked worktree, and the large-reorg playbook gives a save command that runs. Merged on local Skilled main as 1ac1fba6a25."
trigger_phrases:
  - "skilled open items implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/009-skilled-open-items"
    last_updated_at: "2026-11-20T16:45:56Z"
    last_updated_by: "orchestrator"
    recent_action: "Merged the four open-item fixes into local main"
    next_safe_action: "Phase 010 in ai-speckit, then the operator push in phase 011"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:d25f410b4b04321625e19d614d30432b01303612745a8ecbd2dd2e3d8cf3ed96"
      session_id: "scaffold-009-skilled-open-items"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-skilled-open-items |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Four Skilled defects left open by Barter's re-pin are fixed at their source, each with a test that fails on the old code. A vendored consumer can now record a pinned base, a fan-out review can pass its scope gate, and a commit in a linked worktree gets the overlay check it should.

### Phase 9: the four open items

- **record-base pin.** The hypothesis was narrower than stated. The engine did not resolve the pin "against the consumer" by design: it fetched the pin from the remote, then read `FETCH_HEAD`, and ai-speckit's `FETCH_HEAD` held an older `git fetch origin` whose first line was ai-speckit's `4610f6bd`. A clean repro with a fresh `FETCH_HEAD` resolved the pin correctly. The pin now resolves its own id after the fetch and must match exactly. A commit with no top-level `.skilled` directory is refused as no framework commit, and a pin found nowhere names the repository and the remote searched. The fetch into the project stays, because check, align and apply read a pinned base from the project's own objects (`release-update.cjs:964`, `:967`, `:1285`).
- **Fan-out review scope.** Confirmed. The workflow now runs scope discovery once at the fan-out root (`step_fanout_scope_discovery`), writes the root config's `reviewScopeFiles` and `fanout-review-scope.txt`, and passes it to `fanout-run.cjs --review-scope-file`. The runner validates every line, binds `review_scope_file` in each lineage and writes the list into each lineage config. Without the flag it behaves as before.
- **Pre-commit probe.** Confirmed, with a worse symptom than stated. Under a linked worktree hook's `GIT_DIR`, the top level came back as the vendored subfolder, so no staged path matched a vendored root and an unowned change went through unchecked. The upstream `pin.checkout` reads inherited the same `GIT_DIR`. Both now use a hook-free environment, and the index reads keep the hook's so `commit -a` still reads its temporary index.
- **Playbook line.** Confirmed, and the proposed replacement was incomplete. `--json '{"specFolder":"<folder>"}' <folder>` aborts with `INSUFFICIENT_CONTEXT_ABORT`, so the line also passes a `sessionSummary`, the form that exits 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modified | Pin resolution and the framework-commit refusal |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modified | `record-base --pin records the named commit when FETCH_HEAD names another one`, `record-base --pin refuses a commit that is no framework commit or is found nowhere` |
| `.skilled/commands/deep/assets/deep-review.yaml` and `compiled/deep-review.contract.markdown` | Modified | Root scope discovery, the runner flag, the lineage pre-bound scope |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | `--review-scope-file`, lineage binding and config seeding |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-lineage-config.vitest.ts` | Modified | Seven seed-input, resume and keep-rule tests |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/fanout-dispatch.md`, `references/state/state-format.md` | Modified | Who writes the lineage scope |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Hook-free top-level probes and upstream reads |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | `pre-commit run as a real hook judges a commit in a linked worktree of the vendoring repository` |
| `.skilled/skills/sk-git/references/large-reorg-playbook.md` | Modified | The save command that runs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Three Opus workers built items 1 to 3 in parallel on `worktrees/481-overlay-framework-root-layout`. The orchestrator wrote item 4, the workflow YAML and contract docs for item 2, and the upstream-read half of item 3. It checked every diff and reran each new test against the old code. An `@review` pass approved the branch with two P2 wording findings, both fixed in `62922548e2b`. The branch merged into local main as `1ac1fba6a25`, and nothing was pushed.

Commits on the branch: `bf51f84b407` (playbook), `3ddeef925dd` (pre-commit), `da0162af612` (fan-out scope), `5ce1cd58dc3` (record-base), `62922548e2b` (review follow-up).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Keep the record-base fetch into the project rather than reading the pin from the upstream checkout | Check, align and apply read a pinned base from the project's own objects, so an upstream-only read would move the failure to the next check |
| Seed the lineage scope from root discovery rather than from frontier scopes | Discovery covers every target type, and frontier admission runs only in expansive depth |
| Strip the hook environment only from probes and reads of another repository | `git commit -a` hands the hook a temporary index that the index reads must still see |
| Add `sessionSummary` to the playbook's `--json` form | The form without it aborts with `INSUFFICIENT_CONTEXT_ABORT` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Overlay engine suite | Baseline 262/262; branch 263/263, exit 0 |
| Overlay guard suite | 20/20 before and after, exit 0 |
| Doctor overlay contract test | 9/9 before and after, exit 0 |
| `route-validate.sh` | exit 0, 32 routes, before and after |
| release-update and doctor-update contract tests | Baseline 93/93; branch 95/95, exit 0; the two new tests fail on the old engine (81/83) |
| system-deep-loop fan-out, terminal-gate and YAML-contract vitest files (11) | Baseline 334/334; branch 341/341, exit 0 |
| Trigger index `--check` | exit 0 on the branch |
| `@review` on `b4799f7d547..HEAD` | `Review status: APPROVED`, P0 0, P1 0, P2 2 fixed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The release-tag path of `tagCommit` still reads `FETCH_HEAD`.** A tag fetch can hit the same stale file. A safe fix needs an `ls-remote` lookup or a local ref, so it is left for its own change.
2. **Pin objects fetched into the project have no ref.** `git gc` can prune them, and a later `--offline` check would then guess the base.
3. **Other engine reads of `pin.checkout` keep the inherited git environment.** `auditVendoredTree` and status are not called from a git hook today, so they were left as they are.
4. **The live deep review's containment guard attributed this phase's packet writes to a lineage.** It quarantined copies of the parent `spec.md`, `graph-metadata.json` and the new phase docs under `review/lineages/deepseek-flash-max/containment/quarantine/1/` and left the files in place. Those writes are this session's.
<!-- /ANCHOR:limitations -->

---


