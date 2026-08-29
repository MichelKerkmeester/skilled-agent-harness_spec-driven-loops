---
title: "Tasks: Fail-closed graduation"
description: "Ordered tasks: read the grandfather list, graduate each package as it reaches zero, write the allowlist and CI gate, and prove the gate can go red."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "fail-closed graduation tasks"
  - "playbook discovery assertion tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/004-fail-closed-graduation"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the graduation tasks; 41 roots gated and the control run both ways"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".github/workflows/playbook-operator-contract.yml"
    session_dedup:
      fingerprint: "sha256:749918d8c53c61bc635614ad83a3475410219ff9f504ca96afa48f582d945dd6"
      session_id: "2026-08-29-sk-code-031-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Fail-closed graduation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the grandfather list and confirm every entry is a parent identifier whose nested modes inherit its exemption. Evidence: the ten entries are `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`, all parent ids.
- [x] T-002 Establish the discovered root set so the allowlist is written against measurement rather than an assumed inventory. Evidence: a `--strict` fleet run emits exactly 41 package result lines, which is the set the allowlist names.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Remove each package from `warnPackages` as its remediation phase reported zero, rather than emptying the list in one sweep. Evidence: the list is now `[]` in `playbook-corpus-manifest.json`, and the fleet header line reads `warn_packages=` with nothing after it.
- [x] T-004 Write `playbook-failclosed-allowlist.txt` naming every root held as a blocking gate. Evidence: the file carries 41 root paths outside its comment header, in a 55-line file.
- [x] T-005 State the governing rule in the allowlist file itself. Evidence: its header records why the file exists — a fleet run resolves a nested package to its parent id, so a sub-package inherits the parent's warn entry and stops blocking — and instructs that a line is never removed to make a red build green.
- [x] T-006 Add the CI workflow that runs each allowlisted root under its own `--package` path and asserts discovery separately. Evidence: `.github/workflows/playbook-operator-contract.yml` carries the step `Assert every fail-closed root is still discovered`, which emits `::error::fail-closed root is no longer discovered by the fleet scan` naming the missing root.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-007 Run the fleet with `--strict` and read the exit status from the process rather than through a pipe. Evidence: 41 package result lines, `violations` summing to 0 across all of them, zero `FAIL` lines, and exit status 0 captured directly.
- [x] T-008 Confirm the grandfather list is empty in the shipped manifest. Evidence: `warnPackages` parses as an empty list, and the fleet run's own header reports `warn_packages=` with no entries.
- [x] T-009 Prove the gate can go red. Evidence: an injected violation makes the fleet gate exit 1, and restoring the file makes it exit 0 again — a gate seen only green has not been shown to work.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- `warnPackages` is empty and every package that left it did so after measuring zero, not before.
- All 41 roots are named in the fail-closed allowlist and run under their own package identifiers in CI.
- A root that leaves scan range fails the build, because the gate asserts discovery separately from cleanliness.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Parent packet and phase map: `../spec.md`.
- Predecessor phase: `../003-deep-loop-and-spec-kit/`.
- The gate's own construction defects and their repair: `../../038-authoring-hardening/003-per-root-enforcement/`.
<!-- /ANCHOR:cross-refs -->
