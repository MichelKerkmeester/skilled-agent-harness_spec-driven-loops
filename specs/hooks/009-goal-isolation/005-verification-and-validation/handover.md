---
title: "Handover: Cross-Runtime Goal Isolation"
description: "Final implementation, operation, recovery, verification, and working-tree context for the session-isolated goal system."
trigger_phrases:
  - "goal isolation handover"
  - "resume goal isolation"
  - "goal plugin final state"
  - "pi goal session isolation"
importance_tier: "critical"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/005-verification-and-validation"
    last_updated_at: "2026-08-10T17:11:52Z"
    last_updated_by: "codex"
    recent_action: "Detailed final handover authored"
    next_safe_action: "Monitor isolated goals during normal Pi use"
    blockers:
      - "Optional spec-memory reindex unavailable: better-sqlite3 ABI mismatch and closed daemon transport"
    key_files:
      - "handover.md"
      - "implementation-summary.md"
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/hooks/goal/pi/goal-context.ts"
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
      - ".pi/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-isolation-final-handover-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Goal state is isolated by workspace, runtime, and native session identity."
      - "Pi injection and management share sessionManager.getSessionId()."
      - "Cursor injection is scoped while prompt management remains unsupported."
      - "Legacy singleton state is diagnostic-only and never injects automatically."
---
# Handover: Cross-Runtime Goal Isolation

The implementation is complete and Pi is re-enabled. The original last-writer-wins singleton has been replaced by explicit session-scoped state for the runtime-neutral goal core. No required code work remains in packet 009; the next session should begin with normal-use observation or a concrete regression report, not another redesign.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS HANDOVER

Read this document first when:

- resuming packet `009-goal-isolation` after compaction or in a new session;
- diagnosing a Pi or Cursor goal that appears in the wrong session;
- changing the runtime-neutral goal core, its CLI, Pi binding, Cursor binding, or legacy migration behavior;
- deciding whether to disable or re-enable Pi goal discovery;
- preparing a commit, pull request, or release from the current dirty worktree.

The recovery order is this handover, Phase 5 `implementation-summary.md`, the parent `implementation-summary.md`, then the relevant code and tests.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

| Field | Final state |
| --- | --- |
| From session | 2026-08-10 implementation and verification session |
| To session | Next Pi, Codex, or OpenCode session working on goal isolation |
| Packet | `specs/hooks/009-goal-isolation` |
| Active child | `005-verification-and-validation` |
| Phase completed | Research, implementation, cutover, documentation, verification, and Pi rollout |
| Overall status | Complete; all five child phases are complete |
| Pi rollout | Enabled through normal trusted-project discovery |
| Required follow-up | None; monitor normal use and reproduce any reported regression before editing |
| Git branch | `skilled/v4.0.0.0` |
| Git delivery | No commit, push, merge, or pull request was requested or performed |
| Handover time | 2026-08-10T17:07:54Z |
| Recent action | Authored this final operational and recovery handover |

The user-visible result is one active goal per session and many concurrent active sessions. Two Pi sessions can now hold different objectives without replacing, injecting, verifying, pausing, completing, or clearing each other's state.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Problem, Cause, and Fix

| Layer | Before | Final state |
| --- | --- | --- |
| Ownership | One repository-wide `active-goal.json` for Pi, Cursor, and the shared CLI | Every operation requires workspace, runtime, and native session identity |
| Persistence | Last writer replaced the prior session's objective | Each scope resolves to its own opaque state file and archive namespace |
| Pi | Lifecycle hooks ignored the native session id | Lifecycle hooks and `/goal-pi` use `ctx.sessionManager.getSessionId()` |
| Cursor | Hook read the shared singleton | Injection uses `session_id`, then `conversation_id`; missing identity produces no injection |
| Management | A global CLI could mutate ambiguous state | Session actions require explicit validated scope; unbound mutation fails closed |
| Legacy | Singleton could be selected implicitly | Legacy data is diagnostic-only; migration or archival is explicit |
| Privacy | Shared path exposed a fixed global ownership model | State names use a runtime prefix plus full SHA-256 digest; raw session ids stay out of paths and default output |

The root cause was architectural, not prompt wording. The runtime-neutral producer stored all active goals in one file, so every consumer inherited the same collision. The fix moved ownership into the storage key and threaded the same native identity through every supported read and mutation boundary.

### 2.2 Key Decisions Made

| Decision | Rationale | Impact |
| --- | --- | --- |
| Scope by normalized workspace, runtime, and native session id | Any smaller key can collide across repositories, runtimes, or sessions | `goal-core.cjs`, CLI flags, adapters, tests, diagnostics |
| Hash the canonical scope | Raw native ids must not become filenames or diagnostic output | Per-session state and archive paths |
| Fail open for prompt delivery, fail closed for selection and mutation | A goal subsystem failure must not block the user turn or guess an owner | Pi/Cursor adapters and CLI error contract |
| Bind Pi management natively | Injection and management must use the same current-session identity | Registered `/goal-pi` command in `goal-context.ts` |
| Keep Cursor prompt management unsupported | Cursor commands do not expose the hook's native identity | `/goal-cursor` returns `UNSUPPORTED_SESSION_BINDING` without tools or writes |
| Keep OpenCode separate | Its `mk-goal` plugin already has native per-session storage and token accounting | OpenCode remains a regression control, not a consumer of the sibling core |
| Keep Devin decommissioned | Tracked adapters and registration show deliberate removal | Documentation and capability claims no longer advertise Devin goal support |
| Never infer legacy ownership | A valid old objective may matter, but no evidence identifies its session owner | Explicit inspect, migrate, or archive actions only |

### 2.3 Runtime Support Truth

| Runtime | Injection | Current-session management | Verification / continuation | Status |
| --- | --- | --- | --- | --- |
| Pi | Native session-bound extension | Native registered `/goal-pi` | `turn_end` heuristic; no forced continuation | Supported and enabled |
| Cursor | `sessionStart` with native identity | Unsupported without native command identity | Turn touch only | Injection-only |
| OpenCode | Native `mk-goal` plugin | `/goal-opencode` tools | Native verifier and guarded continuation | Separate supported system |
| Claude Code | No sibling-core adapter | Runtime-native feature where available | Outside this contract | Not provided here |
| Codex | None | None | None | Unsupported |
| Devin | None | None | None | Decommissioned |

Do not infer support from command visibility. Claude can see mirrored command files through shared directories, but that does not give it the OpenCode plugin tools or the Pi native binding.

### 2.4 State and Action Contract

The default state root is `.opencode/skills/.goal-state/`. Tests and manual canaries must override it with an isolated `MK_GOAL_STATE_DIR`; never point migration fixtures at the operator's live state.

```text
.goal-state/
├── pi-<full-sha256>.json
├── cursor-<full-sha256>.json
├── .archive/
│   ├── pi-<full-sha256>/
│   ├── cursor-<full-sha256>/
│   └── .legacy/
└── active-goal.json        # legacy input only; never a read fallback
```

Current-session actions are `set`, `show`, `history`, `clear`, `complete`, `pause`, and `resume`. The aggregate-only actions `doctor` and `health` require no session binding and report counts without enumerating raw identities.

Persistence invariants:

- state files are mode `0600` and created directories are mode `0700`;
- writes use a temporary file, `fsync`, and atomic rename;
- only `active` records inject;
- paused, completed, cleared, missing, malformed, unbound, or legacy-only state injects nothing;
- a resumed session with the same native id resolves the same goal;
- a new or forked native id starts unbound unless an explicit future clone feature is designed and approved.

### 2.5 Blockers and Residual Limitations

No blocker remains for the implemented scope.

| Item | Status | Operational consequence |
| --- | --- | --- |
| Cursor prompt management lacks native command identity | Intentional limitation | Keep management disabled; do not add an environment, process-global, or user-entered fallback |
| Repository-wide alignment drift | Existing global backlog | Packet-scoped goal files have zero findings; do not claim the entire repository is drift-clean |
| `deep-pi` statistics-lock warning | Unrelated warning seen in isolated discovery canary | `/goal-pi` still registered, wrote correct state, and exited 0 |
| Broad all-plugin suite has unrelated failures | Known workspace state outside the goal regression control | Run the focused `mk-goal-*` suite for this packet; do not describe every plugin test as green |
| Optional Spec Kit Memory reindex is unavailable | Existing local runtime fault | Canonical docs, description metadata, graph metadata, and parent pointer were refreshed; retry `memory_index_scan` after the daemon/Node ABI is repaired |
| No commit or push | Expected | Preserve the dirty worktree until the operator chooses a Git delivery workflow |

The broad accidental command `node --test .opencode/plugins/tests/*.test.cjs` surfaced eight failures outside the goal suite, including unrelated session-cleanup syntax and generated spec-gate-runtime issues. The goal-specific OpenCode regression command remained 119/119.

### 2.6 Files Modified

**Runtime and test surfaces**

| File | Change summary | Status |
| --- | --- | --- |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Composite scope validation, opaque paths, isolated lifecycle, diagnostics, legacy quarantine | Complete |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | Scope, lifecycle, privacy, concurrency, malformed state, legacy, and adversarial identity coverage | Complete |
| `.opencode/hooks/goal/bin/goal.cjs` | Explicit scope flags, stable errors, aggregate diagnostics, legacy actions | Complete |
| `.opencode/hooks/goal/bin/goal.test.cjs` | CLI binding, concurrency, privacy, and legacy behavior | New and complete |
| `.opencode/hooks/goal/pi/goal-context.ts` | Native Pi lifecycle and `/goal-pi` binding | Complete |
| `.opencode/hooks/goal/pi/goal-pi.test.mjs` | A/B session, missing-id, native-command, resume/fork, and lifecycle coverage | Complete |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Session-bound injection with fail-closed missing identity | Complete |
| `.opencode/hooks/goal/cursor/goal-cursor.test.mjs` | Native identity and unsupported-management coverage | Complete |
| `.pi/settings.json` | Removed `-extensions/goal-context.ts`; goal extension is enabled | Complete |
| `.pi/prompts/goal-pi.md` | Fail-closed fallback when the native extension command is unavailable | Complete |
| `.cursor/commands/goal-cursor.md` | Honest unsupported-management response | Complete |

**Contract and operator documentation**

| Surface | Files | Status |
| --- | --- | --- |
| Goal architecture | `.opencode/hooks/goal/README.md`, `.opencode/hooks/goal/goal-plugin.md`, `.opencode/hooks/injection-contract.md`, `.opencode/hooks/README.md` | Complete |
| Cross-runtime constitutional contract | `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | Complete |
| CLI runtime playbooks | Claude Code, Cursor, and Pi goal-hook and root playbooks under `.opencode/skills/cli-external-orchestration/` | Complete |
| Shared operator inventory | Feature catalog, root manual-testing playbook, and `goal-manage-cli.md` | Complete |
| Packet documentation | Parent packet plus five phase children under `specs/hooks/009-goal-isolation/` | Complete |

### 2.7 Traps and Scar Tissue

| Trap / blast site | Activation condition | Type | How to avoid re-paying it |
| --- | --- | --- | --- |
| Reintroducing a default session | A caller omits `sessionId` and code supplies a shared fallback | Load-bearing | Missing identity must yield no injection or `MISSING_SESSION_ID`; never use `default`, PID, or process-global state |
| Injection/management identity mismatch | One path uses native identity while another uses an environment or typed id | Load-bearing | Bind both surfaces to the same runtime API; if unavailable, mark management unsupported |
| Passive legacy fallback | Scoped record is absent and code reads `active-goal.json` | Load-bearing | Legacy is only accepted by `legacy-inspect`, `legacy-migrate`, and `legacy-archive` |
| Occupied migration target | An operator tries to migrate legacy state into a session with an existing goal | Load-bearing | Refuse without overwriting; inspect or archive the legacy record separately |
| Command-only Pi canary has no transcript body | Registered `/goal-pi` completes before a model turn | Defensive | Prove native binding through distinct persisted paths; use adapter tests for model-visible injection separation |
| Isolated Pi config does not trust project resources | Normal-discovery canary runs outside the trusted project state | Defensive | Pass Pi's explicit approval flag for the isolated canary; normal repo config uses `defaultProjectTrust: always` |
| Global drift output obscures packet quality | Repository wrapper scans unrelated worktrees and fixtures | Defensive | Record the global receipt, then apply the documented packet-scoped delta and stack/router gates |
| Direct edits to live goal state | A manual probe writes `.opencode/skills/.goal-state/` | Load-bearing | Use native commands or an isolated `MK_GOAL_STATE_DIR`; never hand-edit state JSON |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `specs/hooks/009-goal-isolation/005-verification-and-validation/handover.md:1`
- **Next safe action:** use `/goal-pi set`, `/goal-pi show`, and a second Pi session during normal work; only reopen implementation if a reproducible cross-session mismatch appears.
- **Cold-read order:** 1. this `handover.md` → 2. Phase 5 `implementation-summary.md` → 3. parent `implementation-summary.md` → 4. `.opencode/hooks/goal/README.md` → 5. the owning code and tests.
- **Context:** the architecture and rollout are complete. Preserve the identity boundary and distinguish accepted packet evidence from unrelated repository backlog.

### 3.2 Priority Tasks Remaining

1. **Required:** none for packet 009.
2. **Operational:** observe two simultaneous Pi sessions in normal use and capture exact commands, session behavior, and state-path evidence if anything crosses boundaries.
3. **Optional new scope:** add Cursor management only after Cursor exposes native command identity; this requires its own Gate 3 decision and must not be patched into packet 009 implicitly.
4. **Separate maintenance:** resolve the repository-wide alignment backlog and unrelated broad-plugin failures in their owning packets.
5. **Git delivery:** if the operator asks to commit or publish, load `sk-git`, inspect the full dirty tree, and ask the required worktree/current-branch and push questions at that time.

### 3.3 Critical Context to Load

- [x] Canonical handover: this file.
- [x] Phase completion evidence: `implementation-summary.md` and `tasks.md` in this folder.
- [x] Parent acceptance and checklist: `../implementation-summary.md` and `../checklist.md`.
- [x] Operator contract: `.opencode/hooks/goal/README.md`.
- [x] Native Pi boundary: `.opencode/hooks/goal/pi/goal-context.ts` and `.pi/prompts/goal-pi.md`.
- [x] Cursor boundary: `.opencode/hooks/goal/cursor/goal-inject.mjs` and `.cursor/commands/goal-cursor.md`.
- [x] Rollout state: `.pi/settings.json` has an empty `extensions` exclusion list.

### 3.4 Normal Operation

In Pi, use the native registered command. The extension supplies the current session identity; the operator does not type one.

```text
/goal-pi set Ship the isolated goal --budget 500
/goal-pi show
/goal-pi pause waiting for external input
/goal-pi resume
/goal-pi complete
/goal-pi clear
```

If the fallback prompt responds with `UNSUPPORTED_SESSION_BINDING`, the extension did not register. Do not bypass it by invoking the CLI without a verified native session id. Check project trust, extension discovery, `.pi/settings.json`, and the Pi extension logs first.

Cursor injection is automatic when the hook payload contains `session_id` or `conversation_id`. `/goal-cursor` is expected to fail closed; that response is correct behavior, not a regression.

### 3.5 Legacy Recovery and Rollback

Legacy inspection is non-mutating:

```bash
node .opencode/hooks/goal/bin/goal.cjs legacy-inspect
```

Archive valid or malformed legacy bytes without assigning an owner:

```bash
node .opencode/hooks/goal/bin/goal.cjs legacy-archive
```

Migration requires a separately obtained, verified native scope. Never copy a visible id from logs or guess one. The CLI refuses malformed input and occupied targets, and it quarantines the source only after the scoped write succeeds.

If cross-session leakage is observed after rollout:

1. Set `MK_GOAL_PLUGIN_DISABLED=1` for the affected process to stop goal behavior immediately.
2. Add `-extensions/goal-context.ts` to `.pi/settings.json` under `extensions` to disable normal Pi discovery.
3. Restart affected Pi sessions.
4. Preserve scoped and legacy state as evidence; do not merge records into a singleton or delete them.
5. Reproduce with two isolated synthetic objectives and the same test matrix before editing code.
6. Return the failure to its owning layer: core/CLI, Pi binding, Cursor binding, legacy cutover, or documentation/configuration.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Implementation has no known mid-change runtime state; all five phases are marked complete with observed evidence.
- [x] No commit, stash, push, merge, or pull request is falsely claimed; the current branch and dirty worktree are documented.
- [x] Canonical packet metadata and the parent active-child pointer were refreshed after handover creation.
- [x] Goal-specific automated suites passed from the final implementation state.
- [x] Real Pi A/B state and normal discovery canaries passed.
- [x] Rollback preserves evidence and disables injection before any code reversal.
- [x] This handover contains no raw native session id or live goal objective.
- [x] Required work, optional follow-up, limitations, and unrelated backlog are separated.

### 4.1 Final Verification Receipts

| Check | Observed result |
| --- | --- |
| Integrated core, CLI, Pi, and Cursor suite | PASS: 82/82 |
| OpenCode `mk-goal` regression suite | PASS: 119/119 |
| JavaScript syntax | PASS for all changed JS, MJS, and CJS files |
| Pi TypeScript | PASS: no-emit compile against installed Pi 0.84.1 declarations |
| Real Pi A/B commands | `PI_TWO_SESSION_CANARY=PASS scoped_files=2 distinct_paths=2 state_modes=0600 session_transcripts=0` |
| Pi normal discovery after re-enable | `PI_NORMAL_DISCOVERY_CANARY=PASS trusted_project=true objective=PHASE5_REENABLED_CANARY mode=0600` |
| Runtime configuration | `FINAL_RUNTIME_CONFIG=PASS pi_goal_enabled=true cursor_goal_registrations=1 devin_goal_registrations=0` |
| Bounded lookup | `BOUNDED_SCOPED_READ=PASS` |
| Documentation structure | PASS: 16/16 documents |
| Relative links | PASS: 199/199 |
| Comment hygiene | PASS: 8/8 changed executable/test files |
| Packet-scoped alignment | PASS: 8 files scanned, 0 findings |
| Stack folders and router sync | PASS; router sync 10/10 |
| Repository-wide alignment | Known backlog: 788,355 files, 24,314 findings, including 12,515 errors and 11,799 warnings |
| Recursive strict packet validation | PASS: parent and all five phases, 0 errors and 0 warnings |
| Scoped diff and residue | PASS: `git diff --check`; task canaries removed from `/tmp` |
| Canonical continuity save | PASS for packet metadata and parent pointer; optional reindex deferred because `better-sqlite3` was built for Node module 127 while this process requires 141, MCP transport was closed, and CLI fallback exited 75 |

### 4.2 Commands to Re-run After Goal Changes

```bash
node --test \
  .opencode/hooks/goal/lib/goal-core.test.cjs \
  .opencode/hooks/goal/bin/goal.test.cjs \
  .opencode/hooks/goal/pi/goal-pi.test.mjs \
  .opencode/hooks/goal/cursor/goal-cursor.test.mjs

node --test .opencode/plugins/tests/mk-goal-*.test.cjs

python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py \
  --root .opencode/hooks/goal

python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh \
  .opencode/hooks/goal/lib/goal-core.cjs \
  .opencode/hooks/goal/bin/goal.cjs \
  .opencode/hooks/goal/pi/goal-context.ts \
  .opencode/hooks/goal/cursor/goal-inject.mjs

bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  specs/hooks/009-goal-isolation --strict --recursive
```

Run the repository wrapper when the change touches OpenCode structure or routing:

```bash
bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
```

Read its exit status and separate global backlog from the packet-scoped delta. Do not replace the authoritative wrapper with the focused command; both receipts answer different questions.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### Working-Tree State

The branch is `skilled/v4.0.0.0`. Goal-isolation runtime, tests, docs, configuration, and the entire packet are uncommitted. The worktree also contains unrelated user or agent changes. Preserve them; no reset, checkout, clean, broad formatter, commit, or push is authorized by this handover.

The packet currently appears as one untracked directory, so a future Git operation must inspect every contained artifact rather than relying on a top-level status line. The new CLI test `.opencode/hooks/goal/bin/goal.test.cjs` is also untracked.

### Evidence Interpretation

- The two live Pi commands produced distinct scoped files and no transcript bodies. That is expected because registered commands finish before model execution. Model-visible separation is covered by the real adapter harness.
- The normal-discovery canary needed explicit project approval in its isolated config. This proves discovery after re-enable; it does not change the repository's normal `defaultProjectTrust: always` setting.
- `extensions: []` in `.pi/settings.json` means there is no negative exclusion for `goal-context.ts`. It does not enumerate every installed package.
- OpenCode's 119-test suite is a separate native-system regression control. The cross-runtime core does not replace its per-session plugin state.
- The global alignment wrapper is not green. Completion is valid under the documented sk-code global-backlog contract because the changed packet delta has zero findings and the independent stack/router gates pass.
- The canonical continuity save refreshed `description.json`, `graph-metadata.json`, and the parent active-child pointer. Its optional auto-index step could not start because of the local Node ABI mismatch; the MCP retry found a closed transport and the daemon CLI fallback returned backend-unavailable exit 75. This affects retrieval freshness, not the on-disk handover or runtime behavior.
- Canaries used synthetic objectives only. No raw session identifier, transcript content, secret, or live user goal belongs in this handover.
<!-- /ANCHOR:session-notes -->

---

<!-- ANCHOR:template-instructions -->
## 6. Recovery and Maintenance Instructions

When a future report says “the wrong goal appeared,” treat it as a hypothesis until the ownership chain is observed:

1. Record the runtime, workspace, native session behavior, action, and exact output without copying raw identifiers into docs.
2. Reproduce with two synthetic goals in an isolated `MK_GOAL_STATE_DIR`.
3. Resolve both scoped paths through the core and prove whether they differ.
4. Compare state bytes before and after one-session mutations.
5. Inspect adapter identity input and verify that management and injection use the same native source.
6. Check whether a legacy singleton exists, but never use it as an automatic fallback.
7. Apply the smallest fix at the first broken boundary and rerun the complete 82-test matrix plus the 119-test OpenCode control.
8. Reconcile runtime docs, Phase 5 evidence, this handover, generated metadata, and recursive strict validation.

Do not solve a future regression by adding a shared default scope, manually typed session id, first-session ownership, PID key, environment-global current goal, or automatic legacy assignment. Each recreates the ambiguity this packet removed.

If only documentation or handover content changes, rerun sk-doc structure extraction and validation for the edited file, refresh `description.json` and `graph-metadata.json`, then run Phase 5 and recursive packet strict validation.
<!-- /ANCHOR:template-instructions -->
