---
title: "Implementation Summary"
description: "The history lookup offer no longer prints an unchecked runtime label, a missing projection schema now fails its suite, engine-only commits trigger the engine suites in CI, the playbooks match the code, and /speckit:complete no longer blocks an independent phase child. SL-510 and I1-P2-004 closed on measured receipts with no code change."
trigger_phrases:
  - "deep review p2 remediation implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/009-deep-review-p2-remediation"
    last_updated_at: "2026-11-15T20:04:12Z"
    last_updated_by: "generate-context"
    recent_action: "Closed seven deep-review P2 findings and measured SL-510; gate review APPROVED"
    next_safe_action: "Review the worktree 419 diff, then commit and merge when the operator approves"
    packet_purpose: "Purpose: Every reproduced advisory is fixed, the one that did not reproduce is closed with its receipt, the search index cost is a measured number instead of open debt, and `/speckit:complete` no longer blocks an independent sibling."
    blockers: []
    key_files:
      - ".skilled/hooks/session-handover/history/lib/lookup-offer.ts"
      - ".skilled/hooks/shared/tests/session-readers/project.test.mjs"
      - ".github/workflows/spec-kit-check.yml"
      - ".skilled/commands/speckit/assets/speckit-complete.yaml"
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md"
    session_dedup:
      fingerprint: "sha256:92b66ca04be6fd1998cc421f8cc9d19167f5b53fe06b29a66ef206d21330b93b"
      session_id: "scaffold-009-deep-review-p2-remediation"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b605670-f7cb-4de9-b085-c762fd46c2f8"
      workspace: "/Users/michelkerkmeester/worktrees/public/419-history-review-p2-fixes"
      savedAt: "2026-11-15T20:04:12Z"
      locatorKind: "transcript_path"
      version: 1
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-deep-review-p2-remediation |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All seven P2 findings from the history lookup deep review are closed. Six were fixed after each one was reproduced. The seventh, I1-P2-004, failed its own negative control and is closed with that receipt. The search-debt item SL-510 now has measured numbers and needed no fix. On the operator's decision, `/speckit:complete` also lost the predecessor hard block that had stopped this phase.

### Phase 9: deep-review-p2-remediation

A claim's lookup offer prints its runtime label without quotes. A label that is not one plain lowercase word now gets no section, so it can never become shell syntax in the receiving session. Every runtime the locator schema names still gets its offer, and a test holds that true for any runtime added later. The reader contract suite now fails when the published schema goes missing, where it used to skip and stay green. CI's spec-kit check now runs for an engine-only commit, which previously ran no suite that imports the engine. The two playbooks name the moved test paths and all three supported senders. The hop-recall page now says the claim prints the offer.

I1-P2-004 said the 66-character session-id bound was held equal in one direction only. Setting either copy to 65 or 67 already fails two existing tests, so drift is caught from both sides, and the operator chose to record it with no code change. SL-510 asked whether the search index costs too much memory. On the largest real transcript that loads (219 MB), the index holds 95.4 MB of heap and the first search takes 1.5 s. The process peaks at 1.09 GB, but the reader's whole-file read sets that peak, not the index, and the CLI exits after one operation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/spec-kit-check.yml` | Modified | `.skilled/hooks/**` added to both path filters (I1-P2-002). |
| `.skilled/hooks/shared/tests/session-readers/project.test.mjs` | Modified | The schema skip became a `schema: published` assertion (I1-P2-003). |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | Modified | `isHistoryLookupRuntime` and a null return for any other label (I2-P2-001). |
| `.skilled/hooks/session-handover/history/tests/history-locator.vitest.ts` | Modified | One test: every schema runtime passes, two unsafe labels get no section. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` | Modified | Moved suite paths (I3-P2-001) and Vibe on lines 147 and 166 (I3-P2-002). |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md` | Modified | Line 18 says the claim prints the section (I3-P2-003). |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | `phase_predecessor_validation` and its two mentions removed. |
| `../spec.md` | Modified | Phase 9 map row and transition row filled. |
| `scratch/measure-search-index.mjs`, `scratch/measure-real-transcript.mjs` | Created | The SL-510 measurement scripts. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines came first, each with its exit status read. Then every finding was reproduced with the check that would later prove its fix, and the receipts went into `spec.md` Measured Behavior. After the edits, each control was rerun and flipped as expected:
- The unsafe label returns null.
- The moved-aside schema exits 1.
- The new test fails when the guard is disabled.

Then the whole gate ran. A read-only review agent gave the gate review APPROVED, with no P0 or P1 findings. Its two P2 wording findings were fixed in `spec.md`, `plan.md` and `tasks.md`. Nothing is committed, merged or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the predecessor hard block entirely, and check every speckit workflow for it | The operator chose this when the block stopped this phase. Child 008 is unfinished, and 009 does not depend on it. Only `speckit-complete.yaml` carried the block. `.opencode/commands/speckit` is a tracked symlink to the same file. |
| Record I1-P2-004 as already held, with no new export or test | The operator chose this after the negative control: drifting either copy to 65 or 67 fails the existing sweep test, so a public export used only by tests would add surface and no protection. |
| Check the runtime label's shape, not `HISTORY_LOCATOR_KINDS` | Importing the list was built and then dropped. Pi's compaction hook loads `lookup-offer.ts` from source and Devin's loads its build, and neither should need the runtime build only to fit sections. One lowercase word cannot be shell syntax. The test holds every schema runtime to that shape. |
| Withhold the offer rather than quote the label | Quoting changes the printed command for six runtimes and ripples into a claim test, two READMEs and a playbook. Withholding matches the module's existing pattern, which prints nothing rather than a command that cannot run. |
| Close SL-510 with no change | The index costs 4.2 to 4.4 times the indexed text on worst-case synthetic stores. It costs far less on real transcripts and lives for one CLI call. The measured peak comes from the reader's whole-file read. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Engine suite `npm --prefix .skilled/hooks/session-handover/history test` | PASS, 140/140, exit 0 (baseline 139) |
| Engine typecheck and build | PASS, exit 0 both |
| Hooks vitest tree | PASS, 501/501, exit 0 (baseline 501) |
| Session readers `node --test` | PASS, 103/103, 0 skipped, exit 0 (baseline 102, the schema test split in two) |
| Handover `node --test` (CLI, entry, hop-history, relaunch-core) | PASS, 390/390, exit 0 (baseline 390) |
| Runtime hook-state vitest and runtime typecheck | PASS, 18/18 and exit 0 (baselines 18 and 0) |
| `sync-runtime-mirrors.cjs --check` | PASS, 257 mirrors in sync |
| Unsafe-label control on the built offer | `codex;touch /tmp/x` returns null, `codex` returns its section |
| Schema control | Schema moved aside: exit 1, `schema: published` and `schema: valid` fail. Restored: 11/11, exit 0 |
| Guard negative control | Guard disabled: the new test fails (1 failed, 31 passed) |
| Gate review | APPROVED, P0 0, P1 0, 2 P2 wording findings fixed |
| Acceptance verification | Level 1, so there is no `acceptance-criteria.md`. REQ-001 to REQ-006 are each met by the rows above and the Measured Behavior block. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Large transcripts are refused before the index runs.** Five of the ten largest local Claude transcripts that were checked, at 77 to 263 MB, fail projection with `INCOMPLETE_TOOL_RESULTS`, so the lookup returns `store_unreadable` for them. That is the session readers' projection contract and outside this review's findings. It is recorded for its own packet.
2. **The reader loads the whole transcript as one string.** That read sets the 1.09 GB peak on a 219 MB file. A streaming reader would lower it. This is also reader-owned and left as is.
3. **Shifted line citations.** `sk-code-ci/references/job-shape-rules.md` cites `spec-kit-check.yml` timeout lines `:104`, `:151`, `:213` and `:251`. The eight new filter lines move those lines down. That table is honour-system, no test pins it, and it was left for its owner.
4. **Parent metadata will conflict on merge.** The primary checkout holds uncommitted edits to the parent `description.json` and `graph-metadata.json`, and `create.sh` edited the same files on this branch.
<!-- /ANCHOR:limitations -->

---
