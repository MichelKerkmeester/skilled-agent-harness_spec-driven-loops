---
title: "Deep Review Strategy: fan-out write containment remediation (lineage deepseek)"
description: "Externalized strategy for the deepseek fan-out lineage reviewing the remediated containment tree after phases 008 to 013."
---

# Deep Review Strategy

<!-- ANCHOR:topic -->
## Topic

Fresh review of the remediated fan-out write containment tree after phases 008 to 013, against packet `specs/system-deep-loop/045-fanout-write-containment-hardening`. Target type: spec-folder. Dimensions: correctness, security, traceability, maintainability. Traceability protocols: `spec_code` (hard) and `checklist_evidence` (hard, not applicable — the packet has no `checklist.md`); overlays `feature_catalog_code` and `playbook_capability`.

The remediation under review is six commits on top of the seven-phase change set:

| Commit | Phase | Subject |
|--------|-------|---------|
| `47bdca586a` | 008 | never write quarantine evidence through a symlink |
| `efe974e6f0` | 009 | detect a baseline untracked file the lane deleted |
| `df7a1a2cf4` | 010 | run write containment for failed lanes too |
| `2ba05e1a28` | 011 | never write a baseline restore through a symlink |
| `52959f1065` | 012 | keep every containment pass's quarantine evidence |
| `57c02b8592` | 013 | read the right registry field per loop and reject unknown containment keys |

Reviewed read-only against HEAD `57c02b8592c8b74b9972525dde932be333c4c562`.
<!-- /ANCHOR:topic -->

---

<!-- ANCHOR:review-dimensions -->
## Review Dimensions

- [x] correctness — D1, iteration 1
- [x] security — D2, iteration 2
- [x] traceability — D3, iteration 3
- [x] maintainability — D4, iteration 3 (joint pass)
<!-- /ANCHOR:review-dimensions -->

---

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions

| Iteration | Dimension | Verdict | Summary |
|-----------|-----------|---------|---------|
| 1 | correctness | PASS | 2 P2 evidence/detection findings |
| 2 | security | CONDITIONAL | 1 P1 (restore through a symlinked ancestor), 1 P2 (subdirectory repo root on the write path) |
| 3 | traceability + maintainability | CONDITIONAL | 2 P1 (spec worktree residue, stale closure gate), 3 P2 (phase map, parent docs, unswept residue) |
<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## Running Findings

| Severity | Count | Note |
|----------|-------|------|
| P0 | 0 | none |
| P1 | 3 | F-201 (restore ancestor symlink), F-301 (spec still mandates removed worktrees), F-302 (closure gate stale) |
| P2 | 6 | F-101, F-102, F-202, F-303, F-304, F-305 |

Final verdict: **CONDITIONAL** — three active P1 findings, no P0.
<!-- /ANCHOR:running-findings -->

---

<!-- ANCHOR:what-worked -->
## What Worked

- Reading each remediation commit's diff before the current file: the guard's residual gaps (empty-hash sentinel, final-component-only lstat) are only visible against what the fix claimed.
- Mechanical evidence checks: `ls` for a deleted suite, `wc -l` for line drift against cited test lines, and `git log --name-only` to establish which packet docs the remediation actually touched.
- Keeping the pass-identity contract (`iteration` plus `attempt`) next to the runner call site, which passes the retry counter as `iteration`.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## What Failed

- Running the runtime Vitest suite: the lineage write surface forbids commands that write outside the lineage directory, so every finding here is static (file:line reads plus git history). No suite result is re-verified.
- Invoking the append gateway `append-mode-event.cjs`: it is the workflow's canonical state writer, but it may write to shared runtime stores outside the lineage directory. Per this lineage's containment contract the state log is written directly, inside the lineage, and the deviation is recorded in the report's audit appendix.
- Executing `git checkout` experiments to pin the HEAD-restore branch's parent-symlink behaviour: git write commands are banned for this lineage.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches

- Verifying the remediation's suite counts by running tests: banned by the write surface.
- Emitting `resource-map.md` through `reduce-state.cjs --emit-resource-map`: the reducer may write outside the lineage; the packet has no resource map at init, so the coverage gate is skipped and the emission is recorded as not run.
- Sibling-lineage cross-check: the `luna` lineage runs concurrently; its artifacts were not read.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## Ruled Out Directions

| Direction | Why ruled out |
|-----------|---------------|
| Quarantine destination canonicality (phase 008) | The refusal walks every component below the artifact root and resolves the deepest existing ancestor; refusal is recorded, not thrown. Verified correct. |
| Quarantine pass-directory collisions within one run | Pass identity is the retry attempt, and the pool restores retry counts from the ledger, so a resume continues numbering rather than restarting it. |
| Union-issue normalization (phase 013) | The closest-branch heuristic names the offending key for the removed-key shapes it was written for; a tie still throws `ExecutorConfigError`. |
| `containment.worktrees` silent drop (prior F-008) | Fixed: the block is `z.strictObject` and the union error is unwrapped, so the key is rejected by name. |
| Review registry field (prior F-024) | Fixed: `LINEAGE_REGISTRY_FINDINGS_FIELDS` maps review to `openFindings`, which the review reducer writes. |
| Quarantine TOCTOU | The lane process has ended before containment runs; only a concurrent third party could race, which is outside this guard's attribution model. |
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## Next Focus

Loop complete. Three iterations ran on the max-iterations policy; synthesis compiled `review-report.md` and the aggregated registry.
<!-- /ANCHOR:next-focus -->
