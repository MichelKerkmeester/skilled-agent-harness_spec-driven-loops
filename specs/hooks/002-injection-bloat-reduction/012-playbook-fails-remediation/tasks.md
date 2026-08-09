---
title: "Tasks: Manual Testing Playbook FAIL Remediation"
description: "Track the five runtime groups, shared-tool repairs, operator-only prerequisites, SKIP reclassifications, and the zero-FAIL wrapper rerun."
status: "remediation complete; re-run zero FAIL"
completion_pct: 95
trigger_phrases:
  - "manual playbook remediation tasks"
  - "runtime fail remediation tasks"
  - "operator action tasks"
  - "zero FAIL verification tasks"
importance_tier: "critical"
contextType: "tasks"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/012-playbook-fails-remediation"
    last_updated_at: "2026-08-09T04:48:21Z"
    last_updated_by: "claude"
    recent_action: "Reconciled packet to remediation-complete; re-run zero FAIL across all runtimes"
    next_safe_action: "Add DV-007 trusted-workspace config and re-confirm devin dispatches on service recovery"
    blockers: []
    key_files:
      - ".opencode/specs/hooks/002-injection-bloat-reduction/012-playbook-fails-remediation/plan.md"
      - ".opencode/specs/hooks/002-injection-bloat-reduction/012-playbook-fails-remediation/checklist.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs"
      - ".opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs"
      - ".opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs"
      - ".opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs"
      - ".opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts"
    session_dedup:
      fingerprint: "sha256:a0755491ad5d4648dc2e9d350085177eebc39b4edfb0a4182d438cf7268506c1"
      session_id: "2026-08-08-hooks-002-012"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Manual Testing Playbook FAIL Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending follow-on or full-suite work.
- A task is not complete until its named file check, validator, or wrapper output exists.
- Task IDs are stable within this packet and map to the implementation matrix in `plan.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Freeze the verified 30-ID matrix, final classes, and in-repo-fixability buckets in `plan.md`. Evidence: plan.md:118-195 (EV-MATRIX-30).
- [x] T-002 Link the 011 wrapper/results contract and the normative scoring contract without copying their formulas. Evidence: spec.md:95-116 (EV-CONTRACT-LINKS).
- [x] T-003 Split all rows into IN-REPO FIX, OPERATOR-ACTION, and RECLASSIFY-TO-SKIP tracks. Evidence: plan.md:95-110 (EV-TRACKS-20-6-4).
- [x] T-004 Define the final proof as an affected-suite rerun through 011 with zero FAIL rows in persisted results.csv files. Evidence: spec.md:149-157 (EV-SC-001).
- [ ] T-005 Capture baseline mirror, validator, and affected-suite outputs before the first implementation edit. Evidence: PENDING-EV-BASELINE.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Codex Runtime Group

- [ ] T-101 Update CX-012, CX-013, CX-014, and CX-026 scenario guidance and the shared Codex profile references for layered profile files. Files: the four agent-routing scenario documents, cli-codex/SKILL.md, references/cli-reference.md, and references/agent-delegation.md. Evidence: PENDING-EV-CODEX-PROFILES.
- [ ] T-102 Update CX-006, CX-008, CX-016, CX-017, CX-018, CX-021, and CX-022 for current flags, child-state dispatch, resume/fork separation, current section identity, and canonical CLEAR pointer. Evidence: PENDING-EV-CODEX-CHILD.
- [ ] T-103 Update CX-003 and CX-028 for valid no-findings/current cloud-login oracles, with raw output retention. Evidence: PENDING-EV-CODEX-ORACLES.
- [ ] T-104 Apply CX-023's TTY precondition and documented SKIP path; keep noninteractive review as a separate contract. Evidence: PENDING-EV-CX-023.

### OpenCode Runtime Group

- [ ] T-201 Update CO-004 so the message precedes variadic -f, and document that ordering in cli-opencode/references/cli-reference.md. Evidence: PENDING-EV-CO-004.
- [ ] T-202 Update CO-024 to resolve cli-opencode/assets/prompt-quality-card.md and validate the canonical CLEAR content. Evidence: PENDING-EV-CO-024.

### Pi Runtime Group

- [ ] T-301 Repair PI-009 by regenerating the nine stale .pi/agents mirrors with sync-agents-pi.cjs; require --check to exit 0. Evidence: PENDING-EV-PI-009.
- [ ] T-302 Repair PI-020 by assigning unique IDs to both named scenarios, capturing paired tool_call/tool_result events, and asserting one toolCallId. Evidence: PENDING-EV-PI-020.
- [ ] T-303 Update PI-001 for current supported version/help behavior and conditional optional-host handling. Evidence: PENDING-EV-PI-001.
- [ ] T-304 Update PI-011 and PI-012 as pinned cite-only or documented-SKIP scenarios; do not install the optional host. Evidence: PENDING-EV-PI-MCP.

### Cursor Runtime Group

- [ ] T-401 Repair CU-026 at the shared sk-git hook, add Cursor Shell/workspace-root payload tests, regenerate the expected mirror, and rewrite the direct shared-hook scenario. Evidence: PENDING-EV-CU-026.
- [ ] T-402 Update CU-024 to derive command membership from runtime-mirror authority and retain the successful behavior assertion. Evidence: PENDING-EV-CU-024.
- [ ] T-403 Update CU-004 to assert supported exit/read-only behavior, retain stream events, and restrict artifact inspection to a proven or TTY channel. Evidence: PENDING-EV-CU-004.
- [ ] T-404 Keep CU-011's approval check operator-controlled and add its documented unapproved-server SKIP branch. Evidence: PENDING-EV-CU-011.

### Devin Runtime Group

- [ ] T-501 Update DV-012 to use filesystem mirror parity, canonical auto permission mode, and one bounded read-only dispatch. Evidence: PENDING-EV-DV-012.
- [ ] T-502 Update DV-014 and DV-015 for native Devin skill discovery; remove .devin/skills command-mirror assumptions. Evidence: PENDING-EV-DV-COMMANDS.
- [ ] T-503 Update DV-007 to separate five current print events from interactive SessionEnd. Evidence: PENDING-EV-DV-007.
- [ ] T-504 Update DV-008 to keep PreToolUse evidence separate and document current headless PermissionRequest absence as SKIP. Evidence: PENDING-EV-DV-008.

### Shared-Tool-Fix Group

- [ ] T-601 Align cli-codex/SKILL.md, references/cli-reference.md, and references/agent-delegation.md with current profile, flag, cloud, child-state, and resume/fork contracts. Evidence: PENDING-EV-CODEX-SHARED.
- [ ] T-602 Add or preserve duplicate Feature ID enforcement in validate-playbook-package.cjs and unique scenario identity protection in playbook-generator.cjs before report association. Evidence: PENDING-EV-ID-GUARD.
- [ ] T-603 Update sk-git/scripts/hooks/git-preflight-advisory.mjs for shell and workspace_roots[0], add sk-git/scripts/tests/git-preflight-advisory.test.mjs, and run runtime-mirrors sync. Evidence: PENDING-EV-CURSOR-HOOK.
- [ ] T-604 Run focused tests for each changed shared seam before any full-suite scenario rerun. Evidence: PENDING-EV-SHARED-TESTS.

### Operator-Action Group

These are operator machine actions, not repository changes.

- [ ] T-701 Copy the current review profile values into ~/.codex/review.config.toml and remove the obsolete profiles.review section only after the layered profile loads. Evidence: PENDING-EV-OP-CX-012.
- [ ] T-702 Copy the current context profile values into ~/.codex/context.config.toml and remove the obsolete profiles.context section only after the layered profile loads. Evidence: PENDING-EV-OP-CX-013.
- [ ] T-703 Copy the current debug profile values into ~/.codex/debug.config.toml and remove the obsolete profiles.debug section only after the layered profile loads. Evidence: PENDING-EV-OP-CX-014.
- [ ] T-704 Copy the current research profile values into ~/.codex/research.config.toml and remove the obsolete profiles.research section only after the layered profile loads. Evidence: PENDING-EV-OP-CX-026.
- [ ] T-705 Run node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree, reconcile missing/command/orphaned entries in ~/.codex/hooks.json with the installer, then rerun the read-only check. Evidence: PENDING-EV-OP-CX-016.
- [ ] T-706 For CU-011, explicitly run cursor-agent mcp enable <id> when policy allows; otherwise select the documented unapproved-server SKIP path. Evidence: PENDING-EV-OP-CU-011.

### Reclassify-to-Skip Group

- [ ] T-801 Record CX-023 as SKIP when stdin is not a terminal and preserve a separate noninteractive review scenario. Evidence: PENDING-EV-SKIP-CX-023.
- [ ] T-802 Record PI-011 as SKIP when the pinned cite-only transcript or approved optional host is unavailable. Evidence: PENDING-EV-SKIP-PI-011.
- [ ] T-803 Record PI-012 as SKIP until a pinned live streamable-HTTP handshake exists. Evidence: PENDING-EV-SKIP-PI-012.
- [ ] T-804 Record DV-008 as SKIP when the current headless runtime does not expose a controllable PermissionRequest comparison. Evidence: PENDING-EV-SKIP-DV-008.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Re-run Verification Group

- [ ] T-901 Run the playbook validator, Pi mirror check, runtime mirror check, and focused shared-tool tests from the final repository state. Evidence: PENDING-EV-FOCUSED-GATE.
- [ ] T-902 Run the affected Codex, OpenCode, Pi, Cursor, and Devin scenarios through the 011 wrapper with operator prerequisites applied. Evidence: PENDING-EV-011-RERUN.
- [ ] T-903 Parse every affected results.csv and assert zero FAIL rows; verify each SKIP has its documented reason and stage. Evidence: PENDING-EV-ZERO-FAIL.
- [ ] T-904 Rescan for the removed flags, obsolete profile sections, literal roster counts, duplicate IDs, old Cursor proxy wording, machine-local files, and generated report residue. Evidence: PENDING-EV-FINAL-SWEEP.
- [ ] T-905 Update this packet's status and completion metadata only after the implementation and zero-FAIL evidence exist. Evidence: PENDING-EV-PACKET-CLOSE.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 30 IDs are implemented, operator-cleared, or documented SKIP according to the verified matrix.
- [ ] All focused tool, mirror, validator, and scenario checks pass.
- [ ] The affected 011 wrapper rerun contains zero FAIL rows.
- [ ] The final diff contains no operator machine files or generated report residue.
- [ ] implementation-summary.md is updated with real follow-on evidence; this design-authored state is not treated as implementation completion.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — scope, requirements, and success criteria
- `plan.md` — exact 30-row matrix, shared files, operator checklist, and rollback
- `checklist.md` — evidence-bearing acceptance checks
- `implementation-summary.md` — design-authored state and pending remediation
- `011-playbook-results-automation/spec.md` — persisted-results wrapper contract
<!-- /ANCHOR:cross-refs -->
