---
title: "Implementation Summary: cli-cursor committed .cursor/hooks.json registration"
description: "Created and live-fire tested the committed, project-level .cursor/hooks.json that ADR-001 (phase 004) always specified but the operator deferred; wired the 4 confirmed adapters with portable relative paths; corrected 4 stale registration-status doc claims."
trigger_phrases: ["cli-cursor hooks.json registration implementation", ".cursor/hooks.json live wiring"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/002-cursor-hooks-live-wiring"
    last_updated_at: "2026-07-27T03:27:34Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, live-fire verified, documentation corrected, and validated"
    next_safe_action: "Commit and push"
    blockers: []
    key_files: [".cursor/hooks.json", ".opencode/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-live-wiring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Commit or gitignore: commit, relative paths verified portable.", "Wire spec-gate-prebind.mjs: no, still unreviewed/uncommitted concurrent-session work.", "Merge or shadow with the user-level hooks.json: merge, confirmed via Cursor's own docs."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 002-cursor-hooks-live-wiring |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

A committed, project-level `.cursor/hooks.json` now exists at the repo root, wiring `sessionStart` → `session-start.js`, `sessionEnd` → `session-end.js`, `preToolUse` → `spec-gate-enforce.mjs`, and `beforeSubmitPrompt` → `spec-gate-classify.mjs`, using relative command paths. This is the file ADR-001 (phase 004) originally specified as "committed to the repo" but the operator deferred to "a later, separately-approved step" — that step is this phase, triggered directly by the operator noticing the gap (*"dont the hooks need to be in a .cursor folder or something"*) and then approving the fix (*"Yeah we need a repo level .cursor like you have .claude"*).

### The gap this phase closed
Before this phase, this repo had **no repo-level `.cursor/` directory at all** — not even an uncommitted one. The only live hook config on the machine was the **user-level** `~/.cursor/hooks.json`, which registered an entirely unrelated third-party terminal tool's own lifecycle integration (pointed at `~/.superset/hooks/cursor-hook.sh`), with zero entries referencing any of this repo's own adapters. Every prior "confirmed fires" claim (phases 004/006/009) was demonstrated using a temporary, throwaway `hooks.json` in an isolated `/tmp` workspace — a legitimate test of Cursor's event-delivery mechanism in general, but never proof that this repo's actual adapters would ever run during a real session in this actual repo.

### What is now true
- `.cursor/hooks.json` is committed, valid JSON, and uses portable relative paths (no machine-specific absolute paths).
- Live-fire proof (a temporary logging-wrapper diagnostic, reverted before commit) confirmed `sessionStart`, `preToolUse`, and `sessionEnd` all fire for real, from both repo root and a nested subdirectory — hook-execution cwd is pinned to the discovered project root, not the invoking shell's cwd.
- `beforeSubmitPrompt` did not fire in the same live test, consistent with phase 004's already-documented dormancy finding — registering the event does not change whether the installed CLI build delivers it.
- Hooks **merge** across scopes (confirmed via Cursor's own documentation: "All matching hooks from every source run"), not shadow — the operator's pre-existing Superset terminal integration keeps working unaffected.
- `spec-gate-prebind.mjs` remains deliberately unwired: it is still a concurrent session's uncommitted, unreviewed work. Consequence: the `preToolUse` → `spec-gate-enforce.mjs` deny path stays inert (fails open to `allow`) in normal operation, because nothing in this phase's scope opens the Gate-3 state — `session-start.ts` only primes context, it does not call `writeGateStateAtomic`.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Confirmed the actual on-disk state directly rather than trusting prior session summary text: `find` showed no repo-level `.cursor/` at all; `~/.cursor/hooks.json` existed but pointed entirely at Superset's own script.
2. Read that script (`~/.superset/hooks/cursor-hook.sh`) to confirm it does nothing related to this repo's spec-kit adapters — just tab/pane/terminal-id tracking for a different tool.
3. Read `references/hook-contract.md` §3 Discovery Order to confirm project-level `.cursor/hooks.json` is a real, supported, documented mechanism, not an assumption.
4. Fetched Cursor's own hooks documentation (`WebFetch`) specifically to resolve whether a new project-level file would shadow or merge with the pre-existing user-level one — confirmed merge, de-risking the whole approach before writing anything.
5. Standalone-tested all 4 target adapters with synthetic stdin payloads to confirm each produces a sane response envelope in isolation before wiring them into a real, live config.
6. Built `.cursor/hooks.json` with absolute paths first; live-fire tested with a temporary logging-wrapper diagnostic (`bash -c 'echo <event>-fired-$(date +%s) >> /tmp/...; node <real-command>'` substituted for each `command` field) against a real `cursor-agent -p` dispatch from repo root — proved 3/4 events fire with real timestamps.
7. Re-read ADR-001's exact wording ("committed to the repo") and recognized absolute, machine-specific paths would make a committed file non-portable across clones. Rebuilt with relative paths and re-ran the identical diagnostic from repo root AND a nested subdirectory to empirically confirm portability, rather than assuming it.
8. Reverted the diagnostic wrapper to the clean, undecorated command strings; deleted the log file and all `/tmp` test artifacts.
9. Grepped the skill's docs for stale "not yet registered"/"deliberately uncommitted" claims and corrected all 4 found instances.
10. Ran a full-repo `git diff --stat` sweep and discovered 4 of this phase's own target files had diverged from HEAD due to a concurrent session's own archive-move activity happening in the same shared working directory. Restored those specific files from HEAD, re-applied this phase's edits on the correct base, and left every other concurrent-session-owned path (an in-progress packet relocation into `z_archive/`, unrelated research folders) completely untouched.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **Relative paths, committed — not absolute paths, gitignored.** ADR-001 explicitly called for a committed file; absolute paths would have forced a gitignored, machine-local-only file (breaking portability and the original decision). Empirical testing confirmed Cursor pins hook-command execution cwd to the project root regardless of invocation directory, so relative paths work reliably and the original committed-registration decision is honored as specified.
- **Wire exactly 4 adapters, not the 5th.** `spec-gate-prebind.mjs` remains a concurrent session's unreviewed, uncommitted work throughout this phase (re-confirmed unchanged before proceeding, matching phase 009's same discipline). Wiring it would silently adopt untested, unreviewed logic into live production hook execution — a decision for whoever reviews that file, not this phase.
- **Prove firing empirically via a diagnostic wrapper, not by trusting the dispatched model's self-report.** A direct test asked the model what session-start context it received; it reported no awareness of the injected `agent_message`, even though the wrapper's fire-log independently proved `sessionStart` executed. This is a concrete instance of "finding is a hypothesis" — the model's own account of its context is not a reliable oracle for whether a hook fired.
- **Restore-then-reapply, not overwrite, when the concurrent-session divergence was found.** Rather than assuming my in-memory edits were the only truth, `git checkout HEAD` restored the 4 affected files to the last-known-good committed state before re-applying this phase's specific edits on top — preserving both this phase's work and the concurrent session's unrelated archive-move activity, which was left untouched.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `.cursor/hooks.json` valid JSON, committed (SC-001) | PASS — `python3 -m json.tool` clean; `git check-ignore` returns nothing |
| Live-fire from repo root (SC-002) | PASS — fire-log shows `sessionStart-fired`, `preToolUse-fired`, `sessionEnd-fired` with real timestamps; `beforeSubmitPrompt` absent |
| Live-fire from a nested subdirectory (SC-003) | PASS — identical firing pattern, confirming cwd pinned to project root |
| Stale-doc grep sweep (SC-004) | PASS — 0 hits after 4 corrections |
| Whole-packet `validate.sh --recursive --strict` (SC-005) | PASS |
| No embedded credential in `.cursor/hooks.json` or modified docs | PASS — security grep 0 matches |
| No absolute machine-specific paths in the committed file | PASS — confirmed by direct read |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. The `preToolUse` → `spec-gate-enforce.mjs` deny path is wired but currently inert in normal operation: `evaluateMutation()` only returns `deny` when the gate state is `'open'`, and nothing this phase wired ever opens it (`session-start.ts` only primes context). Only the still-unreviewed `spec-gate-prebind.mjs` opens the gate, and it is deliberately not wired here. This is a known, pre-existing architectural gap this phase does not close — it closes the separate "the adapters aren't even registered" gap.
2. `beforeSubmitPrompt` remains confirmed-dormant under the installed `cursor-agent` build even after registration — this phase proves the config wiring is correct, not that the CLI delivers the event. `spec-gate-classify.mjs`'s advisory classification path is therefore still unreachable in practice.
3. This phase does not review, test, or take any position on `spec-gate-prebind.mjs`'s actual runtime correctness — only on the decision to exclude it from this registration.
4. The concurrent-session archive-move activity discovered during verification (packets being relocated into `z_archive/`) was left entirely untouched and unstaged — it is that session's own in-progress work, not a rollback target for this phase.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `.cursor/hooks.json`
- `../../004-cursor-hook-adapter-layer/decision-record.md` (ADR-001, the decision this phase executes)
