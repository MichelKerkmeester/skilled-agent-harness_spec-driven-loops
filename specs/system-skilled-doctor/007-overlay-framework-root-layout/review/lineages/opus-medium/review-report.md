# Deep Review Report - 007-overlay-framework-root-layout (fan-out lineage opus-medium)

## 1. Executive Summary

- **Verdict: CONDITIONAL.** No P0 is active. One P1 is active.
- hasAdvisories: true (10 active P2)
- Active counts used by the verdict: P0=0, P1=1, P2=10 (reducer registry after the adversarial self-check)
- Self-check outcomes: R5-P1-001 confirmed at P1. The referee re-read `.skilled/commands/doctor/scripts/overlay-engine.cjs:5862-5869` and recorded a typed claim adjudication (finalSeverity P1). No finding was downgraded or called a false positive.
- Stop: legal convergence after 17 iterations (`STOP`, `composite_converged`). All nine legal-stop gates passed, the graph decision was STOP_ALLOWED, and the terminal gates (evidence, scope, coverage) passed.
  - dimensionCoverageGate passed only after iteration 17 re-ran both core protocols (spec_code and checklist_evidence) against their own objects. That moved them from iteration 15's fail to pass with file:line evidence. The findings behind the earlier fail stay active. See section 7.
- Review scope: the remediation round for the overlay framework/root layout packet.
  - Skilled `origin/main` up to `b5a630c6efa`: the phase 006 engine fixes and the phase 007/008 records.
  - ai-speckit `64cfee51628..e63bd038a5d`, read-only, especially `5dd004f3faa` and `488ea9f49f5`.
  - The work was split into four frontier nodes: F-1-001 engine, F-1-003 doctor docs, F-1-005 Barter hygiene and hooks, and F-1-007 remediation records.
- Prior generation: all 16 findings were re-checked, and every one is fixed (section 7). The remediation tests guard the fix: all 3 rollback tests fail against the engine before `3aab896957e` and pass after it.
- Operator review focus: Follow-up round after remediation. Verify every finding of the previous generation is fixed and that the fixes introduced no regression, then review the whole change again. Skilled: the remediation commits on origin/main up to b5a630c6efa (phase 006 engine fixes: relayout rollback, outside-repository refusal at resolveOverlayDir, LAYOUT and strict-write remedies, overlayOutside on the context, writeBackup split; phases 007 and 008 records). ai-speckit (/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit, read-only): commits 64cfee51628..e63bd038a5d, especially 5dd004f3faa (commit gate fails closed without a manifest, hooks read overlayDir, real-bridge plugin test, relayout-runs ignore, fixture rename) and 488ea9f49f5 (re-pin onto b5a630c). Check engine correctness, path safety, hook fail-open or fail-closed behavior, rollback correctness, test strength, docs against code, and leftover barter-overlays references.

**Headline finding (R5-P1-001):** the engine's `pre-commit` ownership check fails open when git runs it from a hook in a linked worktree.
- In a linked worktree, git exports `GIT_DIR`. `rev-parse --show-toplevel` then reports the tree subfolder as the top level, so no staged name matches a vendored key, and the check prints `allow`.
- Reproduced end to end. With `GIT_DIR` unset the check exits 1 and refuses. With `GIT_DIR` set it exits 0 with `allow`. The `status` step that runs first also exits 0.
- ai-speckit's own workspace rule offers a git worktree, and `core.hooksPath` is shared across worktrees. Phase 006 listed this probe as Known Limitation 1 but predicted it would refuse; it actually allows.

## 2. Planning Trigger

`/speckit:plan` is required: one active P1, which is a fail-open commit gate.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R5-P1-001", "severity": "P1", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:5864", "findingClass": "fail-open-gate"},
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:6534", "findingClass": "message-contract-drift"},
    {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:6533", "findingClass": "test-gap"},
    {"id": "R14-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:6554", "findingClass": "error-contract-gap"},
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563", "findingClass": "doc-contradiction"},
    {"id": "R3-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:79", "findingClass": "naming-leftover"},
    {"id": "R3-P2-002", "severity": "P2", "file": "barter/ai-speckit/overlays/README.md:47", "findingClass": "doc-gap"},
    {"id": "R4-P2-001", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:115", "findingClass": "stale-status-claim"},
    {"id": "R4-P2-002", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md:91", "findingClass": "contradicting-records"},
    {"id": "R5-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:450", "findingClass": "containment-gap"},
    {"id": "R6-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt:560", "findingClass": "doc-code-drift"}
  ],
  "remediationWorkstreams": [
    "WS1 (P1): make overlay-engine pre-commit judge the right staged set under a hook-exported GIT_DIR, and test it",
    "WS2 (P2): relayout error contract - restore-failed message, unguarded backup and prune steps, restore-failed test",
    "WS3 (P2): doctor doc and workflow drift - generic LAYOUT guidance, pre-commit refusal message",
    "WS4 (P2): records and Barter docs - 007/008 summary lines, overlays/README commit hook paragraph",
    "WS5 (P2, decide): the barter-overlays test value and in-tree overlayDir links"
  ],
  "specSeed": [
    "The commit check reads the top level and the staged set correctly when GIT_DIR, GIT_INDEX_FILE and GIT_PREFIX come from a git hook in a linked worktree",
    "A relayout that fails at any write step, including the backup copy and the empty-folder prune, prints a line the apply workflow can classify"
  ],
  "planSeed": [
    "Route stagedUnownedChanges' and trackedTreeKeys' top-level probe through a GIT_DIR-safe resolver that still reads the hook's index",
    "Add a strict-writes test beside the existing hook-GIT_DIR status test that runs pre-commit with a staged unowned edit",
    "Drive relayoutWithFailingRename to fail a move and its restore; assert the kept backup and the line wording"
  ],
  "findingClasses": ["fail-open-gate", "message-contract-drift", "test-gap", "error-contract-gap", "doc-contradiction", "naming-leftover", "doc-gap", "stale-status-claim", "contradicting-records", "containment-gap", "doc-code-drift"],
  "affectedSurfacesSeed": [
    ".skilled/commands/doctor/scripts/overlay-engine.cjs",
    ".skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs",
    ".skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs",
    ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt",
    ".skilled/commands/doctor/assets/doctor-overlay-status.yaml",
    ".skilled/commands/doctor/assets/doctor-overlay-apply.yaml",
    ".skilled/skills/system-skilled-doctor/references/overlays.md",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/implementation-summary.md",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md",
    "barter/ai-speckit/overlays/README.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | file:line | Title, evidence and impact | Fix | Class | Scope proof | Affected surfaces |
|----|-----|-----------|-----------|----------------------------|-----|-------|-------------|-------------------|
| R5-P1-001 | P1 | security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:5864` | **Commit check allows every unowned vendored change under a hook-exported GIT_DIR.** runGit passes the hook env (`:4228`). In a linked worktree, top level = tree subfolder, prefix empty, isVendoredKey (`:5524`) matches nothing, so it prints `allow`. Reproduced: exit 1 without GIT_DIR, exit 0 with it, and status exits 0 too (iterations 5, 6). The Barter hook passes env through (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164`). The only hook-env test runs status, not pre-commit (`overlay-engine-strict-writes.test.cjs:858-872`). | A GIT_DIR-safe top-level probe that keeps the hook's GIT_INDEX_FILE (a `git commit <paths>` uses a temporary index). Add a pre-commit GIT_DIR test. | fail-open-gate | Only hook-env top-level probe on the commit path; trackedTreeKeys (`:5971`) shares it | stagedUnownedChanges, trackedTreeKeys, Barter pre-commit hook, strict-writes tests, 006 Known Limitation 1 |
| R1-P2-001 | P2 | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:6534` | **Restore-failed line and `references/overlays.md:96` say the kept backup holds every moved copy.** copyForBackup skips token-named files (`:6278-6281`). | Name the skipped paths or say "except skipped files" | message-contract-drift | Restore-failed branch only | engine catch block, overlays.md, apply YAML line 116 |
| R1-P2-002 | P2 | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:6533` | **No test covers a failing rollback or an unremovable backup** (branches `:6533-6546`). The apply workflow keys on those lines. | Two-failure test using relayoutWithFailingRename | test-gap | grep finds "restore also failed" in no test | follow-up tests |
| R14-P2-001 | P2 | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:6554` | **Backup copy (`:6501-6504`) and prune (`:6554`) run outside the guarded block.** A throw exits 2 with a raw `[overlay-engine]` error (`:6661-6665`). A prune failure misreports a completed relayout. The apply workflow (`doctor-overlay-apply.yaml:114-116`) has no rule for it. | Guard both steps, or document and classify the line | error-contract-gap | Two unguarded write steps | relayoutUnderLock, apply YAML, overlays.md |
| R2-P2-001 | P2 | correctness | `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563` | **Generic LAYOUT guidance sends root/skilled lines to relayout**, in presentation rows 563 and 595 and in `doctor-overlay-status.yaml:58`. The engine prints the other remedy (`:3693-3696`). | Add the root/skilled exception | doc-contradiction | Three generic statements | presentation, status YAML |
| R3-P2-001 | P2 | correctness | `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:79` | **Engine test still names its custom folder `barter-overlays`**, also vendored into ai-speckit. This disputes a recorded decision (005 AC-009, ai-speckit 039 Known Limitation 6) rather than reporting an oversight. | Rename to a neutral value, or keep it by decision | naming-leftover | Only live hit outside history | fixes test |
| R3-P2-002 | P2 | correctness | `barter/ai-speckit/overlays/README.md:47` | **README omits the commit hook's no-manifest refusal** (`pre-commit:120-146`), its overlayDir lookup and its bypass. | Add one paragraph | doc-gap | Hook paragraph lines 44-48 | README, barter-overlay-first.md:63 |
| R4-P2-001 | P2 | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:115` | **008 says its folder is uncommitted, and next_safe_action says commit it (`:14`).** `b4799f7d547` committed it. | Update limitation 3 and continuity | stale-status-claim | git log shows 3 commits of the folder | 008 summary, graph metadata |
| R4-P2-002 | P2 | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md:91` | **007 says the ai-speckit fix reaches origin with phase 008.** 008 says nothing in ai-speckit is pushed, and `git branch -r --contains 5dd004f3faa` is empty. | Reword 007's delivery line | contradicting-records | Only push forecast in 007 | 007 summary |
| R5-P2-001 | P2 | security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:450` | **An in-tree overlayDir that links outside the repository skips the outside-repository refusal.** The containment check exists only in the `../` sibling branch, and overlayOutside is lexical (`:524`). | Resolve an existing in-tree folder and apply the same repository test | containment-gap | Only canonicalPath sits in the sibling branch | resolveOverlayDir, createContext |
| R6-P2-001 | P2 | security | `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:560` | **Docs attribute the outside-repository refusal to a pre-commit message that is never printed.** resolveOverlayDir refuses first (`:474`), and a tree in no repository gets `allow` (`:5865`), not exit 2. The test regex at `strict-writes.test.cjs:795` cannot tell the two apart. | Quote the printed message; fix `overlays.md:51` | doc-code-drift | Two doc sentences | presentation, overlays.md, strict-writes test |

## 4. Remediation Workstreams

1. **WS1 (P1), R5-P1-001.** Make the commit check GIT_DIR-safe without dropping the hook's index, and add the pre-commit GIT_DIR test. Correct 006 Known Limitation 1 so it records the observed outcome.
2. **WS2 (P2), R1-P2-001, R1-P2-002, R14-P2-001.** Relayout error contract: the restore-failed wording, the unguarded backup and prune steps, and the restore-failed test.
3. **WS3 (P2), R2-P2-001, R6-P2-001.** Doctor doc and workflow drift.
4. **WS4 (P2), R3-P2-002, R4-P2-001, R4-P2-002.** Records and the Barter README.
5. **WS5 (P2, operator decision), R3-P2-001, R5-P2-001.**

## 5. Spec Seed

- The commit check reads the repository top level without trusting a hook-exported GIT_DIR, and reads the staged set from the index the hook was given.
- Every relayout failure prints a line the apply workflow classifies. A completed move never exits as a failure.
- Command docs quote the engine's printed lines and never summarize a remedy without its exceptions.

## 6. Plan Seed

- T: route the top-level probe in stagedUnownedChanges and trackedTreeKeys through a GIT_DIR-safe resolver that keeps an absolute GIT_INDEX_FILE.
- T: add a strict-writes test beside `:858` that runs pre-commit with GIT_DIR and a staged unowned edit, and expects exit 1.
- T: add a two-failure relayout test (move N fails, then its restore fails) that asserts the kept backup and the line.
- T: wrap the backup copy and the prune in the relayout's error contract.
- T: fix `doctor-overlay-status.yaml:58`, presentation rows 560, 563 and 595, and `overlays.md:51` and `:96`.
- T: fix the 007 line 91 and 008 lines 14 and 115 records, and the Barter README hook paragraph.

## 7. Traceability Status

### Core protocols
- **spec_code: pass** (iteration 17). Each of the 19 REQ rows across phases 006-008 is implemented with file:line or rerun evidence. 007 REQ-006 holds with the recorded vendored-test exception.
  - Iteration 15 had recorded fail. Iteration 17 superseded it because the doc-to-code mismatches behind it are not what spec_code measures. Those mismatches stay active as findings.
- **checklist_evidence: pass** (iteration 17). Every rerunnable verify clause reproduced:
  - engine suite 262/262
  - pre-commit.test.cjs 6/6
  - Barter status `in-sync=488`, `checked=136 ok=136 miss=0`, `RESULT: PASSED`
  - `b5a630c6efa` on origin/main
  - vendored engine byte-identical to `b5a630c6efa`
  - 002 pointers match HEAD
- AC_COVERAGE: not evaluated. Phases 006-008 are Level 1 with no acceptance-criteria.md.

### Overlay protocols
- playbook_capability: pass. The apply workflow's relayout branches match the printed lines, and the contract test passes 9/9. R14-P2-001 names one gap.
- skill_agent, agent_cross_runtime, feature_catalog_code: not run. They do not apply to this target.

### Prior-generation findings (16), all fixed

| Prior ID | Fixed by | Verified at |
|----------|----------|-------------|
| R1-P1-001 relayout half-move | rollbackRelayout + done record (`overlay-engine.cjs:6420-6549`); tests fail pre-fix | iterations 1, 16 |
| R2-P1-001 commit gate silent skip | ai-speckit pre-commit hook lines 120-146 | iteration 3 |
| R13-P2-002 writeBackup one-line loop | two loops (`:4684-4697`) | iteration 1 |
| R8-P2-001 one LAYOUT remedy documented | presentation lines 87-88 and 96 | iteration 2 |
| R1-P2-001 overflow advises relayout for refused moves | `:3698-3708`, presentation line 118, overlays.md line 92 | iteration 2 |
| R3-P2-001 relayout-runs not ignored | ai-speckit .gitignore:69, README:459 | iteration 3 |
| R3-P2-002 barter-overlays fixture | compiled-routing-byte-parity test | iteration 3 |
| R14-P2-001 hooks hard-code the folder | overlaysRootFor in all three hooks | iteration 3 |
| R6-P2-001 002 pointers stale | 002 spec.md:109 matches HEAD | iteration 4 |
| R4-P2-001 005 AC rows Met with deviation | AC-008 and AC-009 rewritten; REQ text gap recorded as 006 limitation 4 | iteration 4 |
| R1-P2-001 sibling accepts ../.git | `:466-474` | iteration 5 |
| R13-P2-001 overlayOutside recomputed | `:524`, the only containment test | iteration 5 |
| R12-P2-001 plugin tests stub the bridge | real-bridge case, 3/3 | iteration 7 |
| R2-P2-001 layoutMoves JSDoc | `:3434-3440` | iteration 8 |
| R11-P2-001 strict-write remove-list remedy | `:5605-5614` | iteration 8 |
| R2-P2-001 pre-commit hook untested | pre-commit.test.cjs 6/6 | iterations 4, 11 |

## 8. Deferred Items

- 006 Known Limitation 3 (`managedPathTest` keeps a trailing slash) predates this round and was left unreviewed.
- The edit guard's fail-open warning goes only to stderr (by design, `barter-overlay-guard.js:12-22`).
- The bare `relativeKey(base, filePath)` at `overlay-engine.cjs:4652` is called only for its throw, with no comment. It predates this round.
- The landed push bypassed main's branch rules through the owner account. The record discloses it, and whether that was intended is the operator's call.
- ai-speckit moved to `eaf819282a3` (5 later commits) during this review. Those commits are outside the reviewed range and do not touch the hook or the engine.
- **Concurrent planning (not written by this lineage).** At 17:56, while synthesis ran, another session added phases 009-011 to the packet's uncommitted `spec.md` phase map. Phase 009 lists "the pre-commit probe misreading a hook-exported `GIT_DIR`" among its fixes. That is the same defect as R5-P1-001, reached independently. Point phase 009 at this report's fix-shape note (iteration 13): keep the hook's `GIT_INDEX_FILE`, and add the pre-commit `GIT_DIR` test.

## Dimension Expansion Map

- Swept: correctness, security, traceability and maintainability on all four frontier nodes. All nodes are answered.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Recovery: two stuck-recovery passes (iterations 13-16): a P1 replay, a severity escalation with a function-level pass, a core-protocol replay, and a test-strength run.
- Remaining frontier: none. No frontier proposals were admitted.

## 9. Search Ledger

- searchCoverage (latest record): requiredBugClasses [spec_code_alignment, checklist_evidence], both covered and ruled out; graphCoverageMode graphless_fallback for the per-record coverage (the coverage graph was seeded and upserted from iteration 5 on, backfilled for iterations 1-4).
- candidateCoverage across the run: fail_open_gate, path_containment, doc_code_drift, doc_overclaim, error_message_accuracy, error_contract, naming_leftover, record_contradiction, stale_status, test_coverage, registry_integrity covered; rollback_completeness, sibling_escape, unsafe_guidance, secret_exposure, hidden_bypass, duplication, comment_hygiene, stale_pointer, unevidenced_completion, workflow_sequence, severity_escalation, test_strength ruled out.
- searchDebt: none. hasSearchDebt: false.

## 10. Audit Appendix

### Convergence summary
- 17 iterations; stop `converged` (composite_converged) at iteration 17; weightedStopScore 1; stuck count 1 at stop; all nine legal-stop gates pass; terminal gates evidence/scope/coverage pass.

### Coverage summary
- Dimensions: correctness, security, traceability, maintainability all covered (coverage age 7 at stop).
- Frontier: F-1-001, F-1-003, F-1-005, F-1-007 answered.

### Ruled-out claims
- Half-move on manifest-plan refusal; relayout applying by itself; barter-overlays in history; push without evidence; git-write gate failing open; unsafe bypass guidance; secrets in records; R5-P1-001 unreachable; rollback tests insensitive to the fix.

### Process notes (honest record)
- Iteration 5's narrative had its line citations corrected in place before it was recorded through the gateway (noted at iteration 6).
- Recovery_started was recorded one iteration late (after iteration 13 instead of after 12).
- Iteration 9's P2 refinement of R5-P1-001 lowered it to P2 in the registry. Iteration 15's restatement carried a claim field named `type`, which broke its delta row. Iteration 16 restored P1, and the self-check adjudication pins it.
- Core protocols went partial (iterations 1-14), then fail (15), then pass (17). Iteration 17 gives the reason with evidence, and no finding was dropped.
- The coverage graph and graph-convergence events started at iteration 5 (iterations 1-4 backfilled). Before that, convergence ran only after iteration 1.
- `durationMs` is wrong for iterations 3-17. Each record's start time was typed by hand and ran ahead of the real clock, so those records carry negative durations (from -85870 down to -2025635). The real wall time from init (16:35Z) to synthesis (about 17:13Z) was about 38 minutes. The records are durable and were not rewritten.
- Writes outside the lineage: none in the repository. The root `review/` files that changed during the run (`fanout-run.log`, `observability-events.jsonl`, `orchestration-status.log`) carry `producer: fanout-run`, which is the runner's heartbeat. The packet's `spec.md` and `graph-metadata.json` were changed at 17:56 local by a concurrent session (see Deferred Items). Scratch captures went to `/tmp`, where `rm` is banned for this lineage, so they are left there:
  - `/tmp/opusmed-{barter-status,contract,engine-all,plugin,precommit,relayout}.txt`
  - `/tmp/opusmed-engine-f2a.cjs`
  - the hook-env repository `/tmp/opusmed-hookenv.Z1DF`
  - `/tmp/opusmed-gitdir.1QPv`. node:test removed its own fixture workspaces.

### Sources reviewed
- Skilled: `.skilled/commands/doctor/scripts/overlay-engine.cjs`, its tests (follow-up, strict-writes, fixes), `.skilled/commands/doctor/assets/doctor-overlay-{presentation.txt,apply.yaml,status.yaml}`, `.skilled/skills/system-skilled-doctor/references/overlays.md`, and the packet phases 002, 005, 006, 007 and 008.
- ai-speckit (read-only): `overlays/root/opencode/scripts/git-hooks/pre-commit` and its tests, `overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`, `overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`, `overlays/root/opencode/plugins/*` and their tests, `.gitignore`, `overlays/README.md`, `overlays/framework/repo-rules/barter-overlay-first.md`, `AGENTS.md`, and the 039 record.
- Reruns:
  - engine suite 262/262
  - relayout tests 19/19
  - pre-commit.test.cjs 6/6
  - guard plugin 3/3
  - contract test 9/9
  - Barter status and pre-commit
  - pre-fix engine rollback tests 0/3
  - the GIT_DIR probes
