---
title: "Tasks: Directive-Lifecycle Playbook Alignment"
description: "Ordered tasks: confirm numbering and surfaces, author scenario 457 + root index row, add the 119-C lifecycle note, publish the feature-catalog entry + root row, then run the grep gates, stale-assertion re-sweep, and scope diff audit."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle playbook alignment tasks"
  - "directive lifecycle scenario tasks"
importance_tier: "high"
contextType: "tasks"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/016-directive-playbook-alignment"
    last_updated_at: "2026-08-11T09:50:00Z"
    last_updated_by: "claude"
    recent_action: "All playbook and catalog alignment tasks and gates completed"
    next_safe_action: "None; historical packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md"
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md"
      - ".opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md"
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/C--comment-hygiene-opencode-plugin.md"
    session_dedup:
      fingerprint: "sha256:33868e0eb6a8c50c1b35f254238a16915b280669bfdafce2055d05558ff25f02"
      session_id: "2026-08-11-directive-playbook-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Directive-Lifecycle Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T-001 Confirm scenario numbering (457 free in the root index), the ux-hooks group path, the root-index row format, the catalog root and entry format, and the per-runtime adapter surfaces. Evidence: root index rows (450-series free); ux-hooks group path `manual-testing-playbook/ux-hooks/`; catalog root `feature-catalog/feature-catalog.md`; adapter surfaces `hooks/lib/directive-lifecycle.ts`, `hooks/claude/user-prompt-submit.ts`, `plugins/mk-skill-advisor.js`, `hooks/pi/prompt-advisor.ts`; suite paths `mcp-server/tests/hooks/directive-lifecycle.vitest.ts`, `claude-user-prompt-submit-hook.vitest.ts`, `mk-skill-advisor-plugin.vitest.ts`, `.opencode/hooks/dispatch/pi`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Author scenario 457 `ux-hooks/directive-lifecycle-dedup.md` with the five per-runtime behaviors (first-full; repeat route-only with `Advisor:` present and `Comment hygiene` absent; boundary re-delivery via compact/resume/restart; kill-switch revert for both envs; fail-open on unknown/unconfirmed session), per-runtime commands, evidence fragments, and automated-lane pointers. Evidence: scenario file present with frontmatter (`id: ux-hooks-directive-lifecycle-dedup`, `version: 3.7.0.1`) and sections 1-5 (OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA); first/repeat/boundary/kill-switch/no-session commands and PASS/FAIL verdicts.
- [x] T-003 Register the 457 row in the root index `manual-testing-playbook.md` under UX Hooks with scenario + feature-file links. Evidence: root index row `| 457 | UX Hooks | Cross-runtime directive-lifecycle dedup | ... |`.
- [x] T-004 Add the optional lifecycle-aware note to 119-C (`ux-hooks/C--comment-hygiene-opencode-plugin.md`) aligning the comment-hygiene injection cadence with the lifecycle rule and referencing 457. Evidence: 119-C lifecycle note block ("Lifecycle note (directive-lifecycle dedup): ... covered by scenario 457").
- [x] T-005 Publish the feature-catalog entry `feature-catalog/ux-hooks/directive-lifecycle-dedup.md` plus the root `feature-catalog.md` row, documenting the feature, the canonical core, per-runtime adapters, and both kill-switches. Evidence: catalog entry present with trigger phrases incl. `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` and `SPECKIT_PI_DIRECTIVE_DEDUP`; root catalog row `| Skill advisor | Cross-runtime directive-lifecycle dedup (first-full, boundary re-delivery, route-only repeats, fail-open) | ... |`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 Run the grep gates: scenario encodes the five behaviors and their signals; both kill-switch envs named in the scenario and the catalog entry; the 457 root-index row and the catalog root row resolve to existing files in both directions. Evidence: all gates passed (verified by parent re-run).
- [x] T-007 Re-sweep the playbooks and catalogs for stale assertions (always-full per-turn claims, wrong kill-switch semantics, boundary re-delivery contradictions) — expect zero matches. Evidence: re-sweep returned zero matches.
- [x] T-008 Scope diff audit: zero git diff on runtime code, tests, or the 007 activation folder; only the playbook/catalog files + this packet changed; recursive validate.sh on the parent spec folder clean. Evidence: scope audit passed; parent recursive validate Errors 0 (except pre-existing 011/012).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- 457 covers the five behaviors per runtime with assertable signals and is registered in the root index; the catalog entry and its root row document the feature and both kill-switches.
- The re-sweep finds zero stale assertions; the scope diff proves docs-only; the grep gates pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Verification evidence: `checklist.md`, `implementation-summary.md`.
- Behavior being documented: `../013-pi-local-directive-dedup/`, `../014-cross-runtime-directive-lifecycle/`.
- Sibling env/doc alignment phase: `../015-directive-docs-alignment/`.
<!-- /ANCHOR:cross-refs -->
