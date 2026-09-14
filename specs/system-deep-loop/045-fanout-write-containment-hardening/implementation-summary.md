---
title: "Implementation Summary"
description: "What shipped for the fan-out write containment hardening: preserve-by-default containment with baseline-targeted restore, separated lane outcomes, per-lineage worktrees on by default with a per-attempt isolation tally, and a report-only watch of the shared checkout for isolated lanes whose process cwd stays in it."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening"
    last_updated_at: "2026-09-13T11:00:00Z"
    last_updated_by: "operator-session"
    recent_action: "Recorded the checkout-watch extension: report-only checkout watch, counts and tests"
    next_safe_action: "Operator sign-off for the checkout-watch extension; observe checkout_writes on real runs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-045-fanout-write-containment-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-fanout-write-containment-hardening |
| **Status** | Complete |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet shipped in three phases: preserve-by-default containment with baseline-targeted restore and separated lane outcomes; per-lineage worktrees; and concurrent-editor detection. The worktree mechanism then became the default on the operator's decision, with a per-attempt isolation tally in the run summary, because preserve bounds the damage while isolation removes it. A final extension closed the gap that decision left open: an isolated lane whose process cwd is still the shared checkout is watched there, and a change it makes is reported and counted rather than inferred away.

### harden fan-out write containment for shared checkouts

When this ships, you will be able to run a multi-hour deep-loop fan-out on your main checkout and keep working in it. A lane that writes outside its own directory will leave your files exactly where you put them and drop a copy of what it wrote into a quarantine you can read, instead of rewinding your uncommitted work to the last commit. A lane that finished its research or its review will be reported as finished even when containment has something to say about it.

The worktree phase was then reversed. Four research lanes on four models converged that attribution cannot be made exact after the fact on a shared tree, and the operator ruled attribution out as a requirement: what matters is that a lane never halts because of another session's writes and that no output is lost, which preserve by default already delivers. Seven fix phases closed the packet, each one dispatch to DeepSeek V4.1 Flash at max on cli-pi and each verified by the whole runtime suite before the next: an out-of-scope untracked path is advisory under preserve, never fatal (001); a state log holding each iteration twice validates and the references name the append gateway (002); the attribution table and merged registry name each lineage's executor from its invocation metadata (003); containment git calls wait out a neighbour's index.lock and report an exhausted retry (004); the churn detector also trips on slow cumulative churn (005); the reducer writes the registry past a strategy file without anchors and a lane that registered nothing is flagged (006); and the worktree mechanism, its modules, tests, option, events and docs are removed, leaving one shared-checkout code path (007).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs`, `runtime/tests/unit/fanout-run.vitest.ts`, `runtime/tests/unit/executor-config.vitest.ts` | Modified | The worktree default flip, the isolation tally, and their tests. The packet's full file scope is in `spec.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in the three phases the plan sequenced, then extended: the quarantine and baseline work with outcome separation and caller migration; per-lineage worktrees; concurrent-editor detection. Verification is the deep-loop runtime Vitest suite plus manual runs on the real checkout, and the worktree default's flip was verified the same way — a no-flag run that isolates end to end, tally assertions for the on, off and degraded paths, and a full-suite run from the final state. The checkout-watch extension that followed the sign-off was verified the same way: a positive case that reports exactly one write, a negative control with nothing to report, and a full suite from the final state (156 files, 2654 passed, 7 skipped, exit 0).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve and quarantine by default, restore opt-in | The guard cannot attribute a write on a shared checkout, and an unattributable finding must not be met with an irreversible remedy |
| Restore targets the pre-dispatch bytes, not HEAD | HEAD is where the last commit left the file, not where the operator left it; rolling back to HEAD discards work the lane never touched |
| Detached ephemeral worktrees outside the numbered namespace | The numbered allocator issues never-reused values for day-scale human workspaces; a fan-out creates hour-scale sandboxes at a rate that would make the namespace unreadable |
| Worktree isolation off by default, opt-in per run | Isolation is the structural fix and preserve only bounds the damage; the per-attempt degraded count in the summary is what keeps a default honest under a stub-verified mechanism |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop runtime Vitest suite | **GREEN.** 156 files passed, 2651 passed, 7 skipped, 0 failed, exit 0, re-run from the final state after the worktree provisioning change |
| Containment unit suite | 54 passed |
| Fan-out and pool unit suites | 223 passed, 1 skipped across four files |
| End-to-end stress reproduction | 19 passed, 1 skipped. The out-of-scope file keeps the lane's bytes, git reports it modified, the ledger records `preserved_in_head`, and the lane settles `completed_with_containment_advisory` with exit 0 |
| Manual shared-checkout run | **PASSED** on the real main checkout with other sessions live. The lane detected 7 out-of-scope paths and preserved all 7: 3 tracked as `preserved_in_head` (a skill-advisor vitest config belonging to another session, plus two probe files edited mid-lane after the baseline snapshot) and 4 untracked as `preserved_untracked` (three files inside another packet's live research lineage, and a playbook run record). Probe file ended at blob 12da3741, 299 lines, neither the 298-line baseline nor HEAD's 284. The lane settled `fulfilled` with `output.status: completed_with_containment_advisory`; run summary `succeeded 1, failed 0, all_failed false, completed_with_containment_advisory 1` |
| Worktree phase, unit level | **GREEN.** Five modules built in isolation, then wired as a per-run option: ownership lease, create-seed-remove lifecycle, run-keyed publication, path resolution, reclamation. Full suite 156 files, 2639 passed, 7 skipped, 0 failed, up from 151 files and 2550 tests at the pre-phase baseline. The option has since flipped to default-on by ADR-004 |
| Manual uncommitted-packet worktree run | **PASSED** on the real main checkout, with the flag on and a packet HEAD does not carry. The lane ran in its own tree, its lineage directory published into the main checkout under the run-keyed name, the uncommitted packet content arrived in the tree so the seed ran, and no worktree survived: the registered count was 28 before and after, across six attempts that each created and removed one. The executor was a stub, so the run exercises the worktree lifecycle, seeding, publication and cleanup rather than any model output |
| Worktree setup cost, six lineages at concurrency 3 | Measured on the real checkout with a stub executor: 16.5 s without worktrees, 149.7 s with. All six lanes succeeded with zero retries and every lineage published |
| Worktree disk footprint | 1.6 GB of checked-out files per tree, measured directly. Six concurrent lanes is roughly 9.6 GB, and the git object store is shared rather than copied |
| Interrupted-run reclaim | Observed end to end: killing a driver mid-run leaves its tree; a later run keeps it with the reason `resumable-label` while the lane can still be resumed, and reclaims it once it cannot. The liveness proof requires the heartbeat to be stale beyond twice the lease term as well as the owner being gone |
| Restore still reachable per run | A run with the mode set back to restore completes and succeeds, with no code change |
| Worktree default flip and isolation tally | **GREEN.** The schema default `worktrees: true`, the partial containment object and both opt-out shapes are covered in `executor-config.vitest.ts`; a no-flag spawn isolates a lane and reports `isolation { enabled: true, isolated: 1, degraded: 0 }`, the explicit-off case reports `{ enabled: false, isolated: 0, degraded: 0 }`, a lane whose tree cannot be made reports `{ enabled: true, isolated: 0, degraded: 1 }`, and the SIGTERM stopped summary carries the same key. Full suite from the final state: 156 files passed, 2653 passed, 7 skipped, 0 failed, exit 0 |
| Checkout watch for isolated lanes whose cwd stays in the checkout | **GREEN.** An isolated `cli-opencode` lane that writes an in-checkout tracked file is reported exactly once as `checkout_write_detected` naming the path, the bytes stay on disk, the lane still settles fulfilled and its tree-rooted guard reports no violation alongside; the unchanged-checkout control reports `checkout_watched: 1` with `checkout_writes: 0`, and the stopped summary carries both counters. Full suite from the final state: 156 files passed, 2654 passed, 7 skipped, 0 failed, exit 0 |
| Fix phases 001 to 007 | **GREEN.** Each phase's touched files, typecheck and the whole runtime suite exit 0 before the next phase; suite sizes 156 files / 2657 tests at 001 rising to 2670 at 006, then 151 files / 2568 tests after the worktree removal in 007 |
| Live shared-checkout fan-out after removal | **PASSED.** Two DeepSeek lanes on this checkout with a neighbour writing sixty untracked files and another session editing tracked files mid-run: both lanes fulfilled with a containment advisory, empty revert lists, every file still on disk; `007-worktree-removal/research/orchestration-summary.json` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Preserve leaves a dirty tree** A run that trips containment no longer cleans up after itself. The finding is recorded at severity error and counted in the run summary, so it is reported rather than silent, but the operator is the one who decides what to do with it.
2. **Quarantine is bounded** A file over 2 MiB or a lane over 64 MiB stops storing content and keeps only hashes and patches. The truncation is recorded per path; recovery for those paths depends on the patch applying cleanly.
3. **Containment does not run when an earlier gate rejects the lane** Artefact validation and the stop-policy check now precede containment, so a lane that fails either produces no containment finding at all. This is the intended ordering, since a lane that did not do its work should be judged on that first, but it means an out-of-scope write by a failing lane goes unreported.
4. **One unreproduced lane rejection, recorded as an observation rather than a defect** A live forced-depth lane was rejected for `duplicate state records for iterations: 1,1,1,1,1`. A second lane under the same stop policy produced a clean log, exactly one iteration record, and settled fulfilled. The validator filters by record type and only counts iteration records, so events carrying an iteration number are not the cause. The first lane's artifacts were deleted during cleanup before the second run, so the original evidence no longer exists. Treat this as unexplained and unreproduced, not as a known leaf defect; if it recurs, keep the lineage directory.
5. **The wiring's rationale is not in git history** The worktree wiring was committed by a concurrent session under a generic message while this session was verifying it, so the reasons live here instead: a lineage whose worktree cannot be created degrades that lane to the shared checkout under forced preserve because isolation failing must not become the run failing, and preserve is the mode that cannot destroy anything; one executor kind was reclassified after verification showed its builder takes no directory flag, which would have left those lanes in the shared checkout while every signal reported them isolated; and isolation became the default on the operator's decision, with the per-attempt degraded count in the run summary so a run that could not isolate says so instead of reading like a run that did.
6. **A retained worktree is reclaimed only once its lane can no longer resume** When publication fails the lease is marked retained and the tree is kept, which is required. A retry does not collide with it: the tree name carries the attempt, so the next attempt creates its own tree and runs isolated, and the retained tree waits for the startup sweep to find it no longer resumable. (An earlier revision of this entry said the retry degrades on the retained name; the attempt-keyed naming makes that false.)
7. **Isolation is skipped when the artifact tree lives in a different checkout than the working directory** The packet paths cannot then be expressed inside the worktree root, so the lane degrades to the shared checkout rather than seeding from the wrong tree. The safe direction, but the isolation is simply not gained there.
8. **The staging-residue sweep runs before any lane publishes** A publisher that died mid-transaction leaves an incomplete staging copy that nothing would ever rename. It is swept once per run at `runtime/scripts/fanout-run.cjs:3173`, inside the branch that only runs when worktrees are enabled, which is the only time staging exists. Only this run's residue is eligible, and a failed sweep is reported to the ledger rather than failing a run whose lanes have not started.
9. **Baseline capture copies the whole dirty working set, not just what the lane touches** It cannot know in advance which paths a lane will write, so it captures every dirty path outside the lineage directory before dispatch. A measured live run on a busy shared checkout captured 893 files at 8.2 MB into one lineage directory, including in-progress files belonging to eight other packets. The per-file and per-lane bounds cap the size but not the scope, and the cost scales with how dirty the checkout is rather than with what the lane does.
10. **Worktree isolation depends on path rewriting** An executor that resolves a path relative to the original checkout could still write outside its worktree. The rewrite covers the prompt pack and the dispatch flags; anything an executor derives on its own is out of reach. While a lane is isolated, containment and the churn sampler watch the lane's tree rather than the shared checkout, so the runner added a report-only checkout watch for exactly the case where that matters: an isolated lane whose process cwd is still the shared checkout (the directory-flag and read-root kinds) is snapshotted before dispatch and diffed after, and a change is reported as `checkout_write_detected` and counted in `isolation.checkout_watched` / `checkout_writes` instead of going unobserved. It never restores and never changes the lane's outcome. Still unobserved: an absolute-path write by a kind whose cwd is its own tree (`cli-pi`, `cli-claude-code`, `cli-codex`, `cli-devin`), and a lane that fails before the post-dispatch comparison — the watch shares containment's success-path ordering.
11. **Splitting the link costs time on the session launch path** Both provisioners now share a dependency root by linking its entries rather than the root itself, which replaces two link operations with 334 and adds roughly 0.8 s to every session launch. Measured, not estimated, and already reduced from 1.5 s by removing a subprocess per entry; the remaining cost is one link syscall per package and does not compress further without changing the approach.
12. **The entry-point guard is repaired at the call site, not at its source** The metadata generators decide whether to do any work by comparing the path they were invoked with against the location they derive from their own file, and those disagree whenever the invocation path is not canonical. The runner now invokes them by their canonical path, which makes them fire. The guard itself is unchanged and still misfires for any other caller that reaches it through a link; there are fourteen such sites in the spec-kit build output, and fixing them belongs to that skill.

13. **The forced-depth rejection is systematic, and the extra writer is the leaf** Two of four research lanes, LUNA via Codex and GLM via OpenCode, completed three iterations and were rejected for duplicate state records. In both, the log holds each iteration twice: one record carrying the gateway's route-proof fields and the model's rounded timestamp, and one carrying a millisecond clock and no route fields. The runtime has no research-mode writer of that second shape; the legacy appender matches it but is invoked only by review mode. What remains is the leaf writing the state file directly as well as through the gateway, which the agent contract forbids and which two models on two executor kinds both did. The validator counts and rejects where it should deduplicate by iteration and prefer the routed record. Both lineage directories are retained under `research/lineages/`.
14. **A fulfilled lane can register nothing** SWE-2's findings are numbered list items; the lineage reducer's list extractor takes only bullets, so its registry stayed empty while its three deltas and report were complete. The merge's reconstruction path reads both forms, so nothing was lost this time, but an empty registry beside non-empty deltas should be flagged rather than passed.
15. **A lane can write through a shared dependency root into the main checkout** The vendored trees are wholesale-linked by design, so a write into one lands in main and escapes both the tree-rooted guard and the checkout watch. Surfaced by the alternatives research; belongs in its own packet.
16. **The churn detector has no cumulative arm** It fires only on a burst above the threshold within one heartbeat window. A neighbour dirtying one or two files per window never trips it, however long that continues. Surfaced by the alternatives research; belongs in its own packet.

17. **The publish manifest carries no provenance** Its keys are attempt, entries, label, published time, run id and source directory. The attribution table therefore records kind and model as unknown for every lane, and the merged registry cannot say which model produced a finding without reconstructing it from lineage names.
18. **An eighth dependency root is unprovisioned** `.opencode/node_modules` is 96 MB of third-party packages with no workspace links, absent from the seven shared paths and reached only by walk-up resolution. Four lanes ran without it, so research lanes do not need it today, but it is linkable wholesale and should be listed.
19. **A skip-worktree cone would hide writes into its skipped region** Git suppresses status for skip-worktree paths, so if the cone mechanism the alternatives research recommends is adopted, a lane writing outside its cone but inside its own tree would be invisible to the tree-rooted guard. The write surface sits inside the cone by construction and the checkout watch still covers the main checkout; the gap needs a guard that refuses a write surface outside the cone.
<!-- /ANCHOR:limitations -->

---
