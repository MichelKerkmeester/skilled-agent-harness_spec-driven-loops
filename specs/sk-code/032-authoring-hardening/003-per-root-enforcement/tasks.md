---
title: "Tasks: Per-Root Enforcement"
description: "Ordered tasks: prove the roll-up defect by injection, fix discovery, graduate the clean packages, ship the gate and allowlist, and reject the first gate version for being false-green."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "per root enforcement tasks"
  - "failclosed gate tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code/032-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-code/032-authoring-hardening/003-per-root-enforcement"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the enforcement tasks; first gate version rejected by its own control"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".github/workflows/playbook-operator-contract.yml"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json"
    session_dedup:
      fingerprint: "sha256:26b2bb7f3e6a6b935c61d243ec461d7fb4fa753cc76f296a2af411cf92c328de"
      session_id: "2026-08-29-sk-code-032-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Per-Root Enforcement

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

- [x] T-001 Prove the roll-up defect by injection rather than by reading the code. Evidence: a real `FORBIDDEN_VERDICT` planted in a fail-closed sub-package produced exit 0 under a fleet run and exit 1 under `--package <that root> --strict`; one violation, two verdicts, decided only by run scope.
- [x] T-002 Establish the true number of playbook roots independently of the validator. Evidence: `find .opencode/skills -type d -name manual-testing-playbook | wc -l` reports 41 roots on disk.
- [x] T-003 Locate the identity and discovery code paths. Evidence: `packageId()` at line 508 derives the id from the path below the skills root; `discoverPackages()` enumerated only first-level skill directories, so a packet-owned root beside a hub's was never in the list.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Fix discovery so a fleet run enumerates packet-owned roots. Evidence: `discoverPackages()` now descends one level past each skill directory and emits each packet root under its own nested id; a fleet run reports 41 packages scanned, matching the filesystem count from T-002.
- [x] T-005 Graduate every measurably clean package out of warn tier. Evidence: `playbook-corpus-manifest.json` `warnPackages` lost 9 entries and retains only `system-spec-kit`, the one package that still carries a backlog.
- [x] T-006 Write the fail-closed root set with its governing rule in its own header. Evidence: `playbook-failclosed-allowlist.txt` lists 39 roots and opens with the rule `Never remove a line to make a red build green — fix the package instead`, alongside an explanation of the parent-identity roll-up that made the file necessary.
- [x] T-007 Record the discipline in the governing SKILL.md rather than only in this packet. Evidence: `sk-create-manual-testing-playbook/SKILL.md` gained two blocks — one warning that a root which is not scanned cannot fail so absence looks exactly like success, and one defining the promotion step from `warnPackages` to the fail-closed allowlist.
- [x] T-008 Reject the first workflow version. Evidence: it relied on the fleet run written before discovery was fixed, so it would have certified exactly the packages it could not see; the injected-regression control caught it before it shipped and it was rewritten.
- [x] T-009 Ship the gate. Evidence: `.github/workflows/playbook-operator-contract.yml` enforces the contract in a first step that fails on any fail-closed violation, and asserts in a second step that every allowlisted root is still present in the run's own discovered set, failing with a named root when one is absent.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-010 Verify the gate is green at baseline across the fail-closed set. Evidence: `node validate-playbook-package.cjs --strict` exits 0 with every fail-closed root clean.
- [x] T-011 Verify the gate goes red on a planted regression and names the offending package. Evidence: the injected-regression run reported the failure against the specific package rather than a fleet-level summary, and returned a blocking exit code.
- [x] T-012 Verify the gate returns green once the plant is reverted. Evidence: the same command run after the revert exits 0 again, so the red result tracked the injected defect rather than an unrelated condition.
- [x] T-013 Verify the remaining backlog is confined to declared warn tier and is measured, not estimated. Evidence: the fleet run reports `warnedViolationCount` of 165, all inside `system-spec-kit`, with `exitCode` 0 because no fail-closed package carries a violation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- A fleet run opens every playbook root on disk, so a root can no longer pass by never being examined.
- A violation in any fail-closed root blocks the build, and a listed root that stops being discovered blocks it too.
- The gate has been observed red on a planted failure and green again after the revert, not merely observed green.
- The fail-closed set carries its own rule, and only genuinely dirty packages remain at warn tier.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Parent phase map: `../spec.md`.
- Predecessor phase: `../002-validator-false-positives/`.
<!-- /ANCHOR:cross-refs -->
