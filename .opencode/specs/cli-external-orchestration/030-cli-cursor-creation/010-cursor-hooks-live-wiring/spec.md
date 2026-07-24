---
title: "Feature Specification: cli-cursor committed .cursor/hooks.json registration"
description: "Register the 4 confirmed/reviewed cli-cursor hook adapters (session-start.ts, session-end.ts, spec-gate-enforce.mjs, spec-gate-classify.mjs) in a committed, project-level .cursor/hooks.json, per ADR-001's originally-deferred decision, now explicitly approved by the operator; live-fire tested against the real repo; spec-gate-prebind.mjs deliberately excluded (unreviewed, uncommitted, concurrent-session work)."
trigger_phrases: ["cli-cursor hooks.json registration", "repo-level .cursor hooks", "cursor hooks live wiring"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/010-cursor-hooks-live-wiring"
    last_updated_at: "2026-07-24T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built, live-fire tested, and documentation cross-references updated"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: [".cursor/hooks.json", ".opencode/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md", ".opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-live-wiring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Commit or gitignore the file: commit, with relative paths, per ADR-001's original decision and empirically-verified portability.", "Which adapters to wire: the 4 confirmed/reviewed ones only, not spec-gate-prebind.mjs (unreviewed, uncommitted, concurrent-session work).", "Absolute vs relative paths: relative, empirically confirmed to resolve to the project root regardless of the invoking shell's cwd."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: cli-cursor committed .cursor/hooks.json registration

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../009-cursor-hooks-catalog-and-playbook-coverage/spec.md` |
| **Successor** | None (packet extension) |
| **Handoff Criteria** | `.cursor/hooks.json` exists, is committed, wires the 4 confirmed adapters with correct event names and portable relative paths, is live-fire proven against the real repo (not just an isolated workspace), and every stale "not yet registered" / "deliberately uncommitted" claim across the skill's docs is corrected. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 004's ADR-001 explicitly decided to register the guard adapters in a **committed, project-level** `.cursor/hooks.json`, but the operator deferred the actual file to "a later, separately-approved step." That step never happened: no `.cursor/` directory existed anywhere in this repo. The only hook config live on this machine was the **user-level** `~/.cursor/hooks.json`, and it registered a completely unrelated integration (a third-party terminal tool's own lifecycle hooks pointed at `~/.superset/hooks/cursor-hook.sh`) — zero entries referenced any of this repo's own adapter files.

This means every "confirmed fires" claim made by phase 004/006/009 (`session-start.ts`, `session-end.ts`, `spec-gate-enforce.mjs` deny-blocking a real tool call) was demonstrated using a **temporary, throwaway `hooks.json` in an isolated `/tmp` workspace** (`CU-013`'s own documented methodology) — never against this repo's actual, real configuration, because no such real configuration existed. The operator caught this gap directly: *"dont the hooks need to be in a .cursor folder or something"* — and then explicitly authorized closing it: *"Yeah we need a repo level .cursor like you have .claude."*

### Purpose
Create the committed, project-level `.cursor/hooks.json` ADR-001 always intended, wiring the 4 confirmed/reviewed adapters (excluding the still-unreviewed, uncommitted `spec-gate-prebind.mjs`, which is a concurrent session's own in-flight work), using portable relative command paths, and prove it fires for real against this actual repo — not a throwaway sandbox — before correcting every stale doc claim that the registration file doesn't exist.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.cursor/hooks.json` at the repo root wiring `sessionStart` → `session-start.js` (compiled), `sessionEnd` → `session-end.js` (compiled), `preToolUse` → `spec-gate-enforce.mjs`, `beforeSubmitPrompt` → `spec-gate-classify.mjs`.
- Use relative command paths (e.g. `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/session-start.js`), empirically confirmed to resolve correctly from both the repo root and a nested subdirectory (Cursor executes hook commands with cwd pinned to the project root regardless of invocation cwd).
- Confirm merge-not-shadow semantics with the pre-existing user-level `~/.cursor/hooks.json` (Cursor's own documentation: "All matching hooks from every source run; when responses conflict, higher-priority sources take precedence during merge") — the third-party terminal tool's integration keeps working unaffected.
- Empirically prove firing against the real repo (not an isolated `/tmp` workspace) via a temporary diagnostic logging wrapper around each command, then revert to the clean, undecorated version before committing.
- Correct every stale doc claim that the registration file is deferred/unregistered/deliberately-uncommitted, across `references/hook-contract.md`, the root playbook, `hooks/confirmed-fires-smoke-test.md` (`CU-013`), and the feature catalog.
- Commit `.cursor/hooks.json` (not gitignored — ADR-001's explicit decision, and relative paths make it portable across clones).

### Out of Scope
- Wiring `spec-gate-prebind.mjs` — still authored by a concurrent session, uncommitted, unreviewed; wiring it is a decision for whoever reviews that file, not this phase.
- Fixing `beforeSubmitPrompt`'s confirmed non-delivery under the installed CLI build — registering the event doesn't make the CLI actually deliver it; the dormancy finding from phase 004 stands unchanged.
- Building any new hook adapter or changing `spec-gate-enforce.mjs`'s / `spec-gate-classify.mjs`'s internal logic.
- Running the full 20-scenario manual-testing-playbook suite — that is the surrounding task this phase's finding interrupted; it resumes separately once this registration gap is closed.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.cursor/hooks.json` | Create | Committed, project-level registration for the 4 confirmed adapters. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md` | Modify | Correct the stale "does not yet ship a hook adapter layer" claim. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md` | Modify | Correct the `CU-013` summary's stale "deliberately-uncommitted" claim. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md` | Modify | Correct the same stale claim in the `CU-013` feature file. |
| `.opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` | Modify | State that registration now exists and note the `preToolUse` deny path stays inert without `spec-gate-prebind.mjs`. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | `.cursor/hooks.json` exists at the repo root, is valid JSON, and wires exactly the 4 confirmed adapters to their correct, already-confirmed event names. | P0 |
| REQ-002 | Command paths are relative and empirically confirmed to resolve correctly regardless of the invoking shell's working directory (tested from repo root and from a nested subdirectory). | P0 |
| REQ-003 | Firing is proven against the real repo via a real `cursor-agent -p` dispatch (not an isolated `/tmp` workspace), using a temporary diagnostic wrapper for unambiguous proof, reverted to the clean version before commit. | P0 |
| REQ-004 | `spec-gate-prebind.mjs` is not wired; every place this decision could confuse a reader states the reason (unreviewed, uncommitted, concurrent-session work) and its consequence (the `preToolUse` deny path stays inert). | P0 |
| REQ-005 | Merge-not-shadow behavior with the pre-existing user-level `~/.cursor/hooks.json` is confirmed via Cursor's own documentation before assuming it's safe to add a project-level file. | P1 |
| REQ-006 | Every stale "not yet registered"/"deliberately uncommitted" doc claim identified by a repo-wide grep is corrected. | P1 |
| REQ-007 | The file is committed (not gitignored), consistent with ADR-001's original decision, now that relative paths make it portable. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `.cursor/hooks.json` parses as valid JSON and `git status --porcelain` shows it as trackable (not gitignored). **MET**.
- **SC-002**: A live `cursor-agent -p` dispatch from repo root, using a temporary logging-wrapper diagnostic, shows `sessionStart-fired`, `preToolUse-fired`, and `sessionEnd-fired` log entries with real timestamps; `beforeSubmitPrompt` does not fire (consistent with phase 004's dormancy finding). **MET**.
- **SC-003**: The same dispatch pattern, run from a nested subdirectory, resolves the relative hook command paths identically (cwd for hook execution is the project root). **MET**.
- **SC-004**: `grep` for the stale phrasing (`deliberately uncommitted`, `does not yet ship a hook adapter layer`, `committed-but-unregistered`) across the skill's docs returns 0 hits after this phase. **MET**.
- **SC-005**: `validate.sh 030-cli-cursor-creation --recursive --strict` returns 0/0 after this phase lands.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Editor cross-surface impact.** Per ADR-001, this hooks.json also applies to any teammate opening this repo in the Cursor desktop editor, not just CLI dispatches. Mitigation: every wired adapter is fail-open by design (confirmed in each adapter's own source comments); a malformed payload or internal error never blocks an editor user.
- **Colliding with the pre-existing user-level hooks.json.** Mitigation: confirmed via Cursor's own documentation that hooks merge (all matching hooks from every source run) rather than the project-level file shadowing the user-level one — the third-party terminal integration keeps firing unaffected.
- **Diagnostic wrapper accidentally left in the committed file.** Mitigation: the clean, undecorated version was rewritten and re-validated as JSON immediately before commit; the diagnostic log file itself was deleted after use.
- **`preToolUse` deny path remains inert.** Wiring `spec-gate-enforce.mjs` does not by itself make Gate-3 enforcement deny anything: `evaluateMutation()` only reaches `deny` when the gate state is `'open'`, and nothing in this phase's scope opens it (`session-start.ts` only primes context; only the unwired `spec-gate-prebind.mjs` opens the gate). This is a known, documented limitation, not a defect in this phase's own work.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-P01**: Hook command paths must remain portable across clones/machines — no absolute, machine-specific paths in the committed file.

## 8. EDGE CASES
- `cursor-agent` invoked from a directory outside the repo entirely (no project root discoverable): hooks.json is simply not discovered; behavior is unaffected by this phase (matches Cursor's own discovery-order fallback to user/enterprise scope).
- A future concurrent session commits and reviews `spec-gate-prebind.mjs`: this phase's exclusion of it is a snapshot decision, not a permanent one — wiring it in is a natural, separate follow-up once reviewed.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 8/25 | One new config file + 4 small doc corrections; no runtime code changed. |
| Risk | 12/25 | Real behavior change (editor + CLI hook execution across the whole repo), mitigated by fail-open adapters and empirical live-fire proof before commit. |
| Research | 5/20 | ADR-001 and the adapter source files already fully establish the facts; only the merge-vs-shadow question needed external confirmation. |
| **Total** | **25/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Wrong event name or command breaks silently | Low | Medium (inert, not destructive — every adapter fails open) | Live-fire diagnostic wrapper proved exact event names before committing the clean version |
| Relative path fails to resolve from some invocation context | Low | Low (falls back to no-op, fail-open) | Tested from both repo root and a nested subdirectory |
| Colliding with the operator's existing Superset hooks integration | Low | Medium (would break an unrelated daily-use tool) | Confirmed merge-not-shadow semantics via Cursor's own docs before proceeding |

## 11. USER STORIES
- As the operator, I want the hook adapters this repo built to actually run during real Cursor sessions in this repo, not just in an isolated test sandbox, so the "confirmed fires" claims mean what they say.
- As a maintainer, I want every doc that claims the registration file doesn't exist corrected the moment it does, so the docs never trail the actual repo state.

## 12. OPEN QUESTIONS
All questions below are resolved.
- Commit or gitignore the file? **Resolved: commit.** ADR-001's original decision, now viable because relative paths (verified portable) remove the machine-specific-absolute-path objection that would have forced a gitignored, local-only file.
- Wire `spec-gate-prebind.mjs` too? **Resolved: no.** It remains a concurrent session's unreviewed, uncommitted work; wiring it is that session's (or a reviewer's) call, not this phase's.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../009-cursor-hooks-catalog-and-playbook-coverage/spec.md` (predecessor)
- `../spec.md` (phase-parent packet)
- `../004-cursor-hook-adapter-layer/decision-record.md` (ADR-001, the original committed-registration decision this phase finally executes)
- `.cursor/hooks.json` (the artifact this phase creates)
