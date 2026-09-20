---
title: "Implementation Summary"
description: "The installer stops writing a registration that would segfault, the diagnosis reports an unsatisfiable host before a tool call finds it, and the guide no longer states the wrong Node requirement."
trigger_phrases:
  - "code mode install doctor summary"
  - "install and doctor shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/016-code-mode-node-resolution/004-install-and-doctor"
    last_updated_at: "2026-08-29T10:02:02Z"
    last_updated_by: "session"
    recent_action: "Reconciled the installer-execution records with their evidence"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/scripts/install.sh"
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
      - ".opencode/skills/mcp-code-mode/INSTALL-GUIDE.md"
      - ".opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 4 of 5 |
| **Status** | Complete |
| **Completed** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | gpt-5.6-luna, xhigh reasoning, fast tier, for the two scripts; orchestrator for the documentation surfaces |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three surfaces that would otherwise have undone or hidden the cutover.

The installer was writing `["node", ".../mcp-server/dist/index.js"]` — the server run directly under whatever interpreter is on PATH. That is worse than the absolute path it was meant to replace: on a Node 25 host it is precisely the segfault case. It now writes the launcher.

The diagnostic route gained a per-server check that asks the resolver whether this host can satisfy the declared range, so an unsatisfiable host is reported rather than discovered on the first tool call.

The install guide claimed "Node.js 18 or higher" in six places, which is wrong in both directions: 18 cannot run this server and 25 segfaults it. It now states the real requirement, the reason, and that the launcher makes a host-wide Node 24 unnecessary.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | Emits the launcher registration; the summary output names what is actually registered |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | `diagnose_code_mode()` resolves the interpreter and fails when the host cannot satisfy the range |
| `.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md` | States the real Node requirement and the refusal behavior |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md` | Describes the launcher-fronted pattern and why, instead of restating one machine's path |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Split by agent. The two shell scripts went to the external executor as an explicitly bounded executable-code subtask, which is the only form the code agent's component-authoring gate permits inside a skill tree. The guide and the authoring checklist are component documentation and were written by the orchestrator.

The phase's own file list was corrected during execution: it named four documentation files and one router document, but two of those are symlinks to the other two, and the router turned out to be a thin dispatcher whose per-server checks live in a script.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Put the check in the diagnostic script, not the router document.** The router only binds a workflow asset and defers presentation; the per-server checks live in `diagnose_code_mode()`, which is where a reader looking for this check would go.
- **Read the range through the resolver rather than restating it.** A version number written into the diagnosis would drift from the manifest the moment the manifest moved.
- **Correct the guide's requirement rather than append to it.** Leaving "Node.js 18+" beside a Node 24 note would have left two contradictory claims in one document.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on both scripts | Clean |
| Live diagnosis | `[PASS] Node engine range satisfied by /Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node` |
| Forced-unsatisfiable diagnosis | `[FAIL] No Node.js interpreter satisfies >=99.0.0 <100.0.0 (unsatisfied)`, Fail count 1 |
| Manifest after the forced failure | Restored byte-identical, confirmed by checksum and a clean git status |
| Installer output | Registers `node` plus the launcher; no absolute interpreter path |
| Installer executed end to end | Completed against a scratch project root and a scratch home in the resolution-hardening phase, where the registration is observed as output rather than as an inspected literal |
| Guide | Zero remaining "Node.js 18" claims; validates as `install_guide` |
| Checklist | Validates as `asset`; no absolute interpreter path |
| Workspace node gate | 75 files, 762 pass, 0 fail |

The diagnosis is worth reading twice: the host interpreter is v25.6.1, which would segfault this server, and the check still passes because the resolver finds v24.9.0 among the installed interpreters. That gap between the host default and the satisfying interpreter is exactly what the packet exists to bridge.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The diagnosis reports whether an interpreter satisfying the declared range exists. It does not verify that the compiled addon on disk matches that interpreter, so a manifest that drifts from its own addon would still pass.
- The installer's own prerequisite gate accepts any Node above a fixed floor, which is not the range this server needs; the resolver-backed gate that replaces it belongs to the resolution-hardening phase.
- The guide documents the launcher's refusal behavior in prose; no test asserts that the documented message matches what the launcher actually prints.
<!-- /ANCHOR:limitations -->

---
