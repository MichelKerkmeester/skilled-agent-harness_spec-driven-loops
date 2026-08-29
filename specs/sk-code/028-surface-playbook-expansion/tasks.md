---
title: "Tasks: Surface Playbook Expansion"
description: "Ordered tasks: confirm the manifest and precedent, expand both playbooks to 7 category dirs, waive agent-dispatch, verify 0 violations."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "surface playbook expansion tasks"
  - "playbook category taxonomy tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/028-surface-playbook-expansion"
    last_updated_at: "2026-08-29T10:24:54Z"
    last_updated_by: "claude"
    recent_action: "Completed the expansion tasks; both packages verified 0 violations"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:ced9d7f5787c678c4ad97eb1b5fb67324adc54df0b8cf836234a2c393469cfc7"
      session_id: "2026-08-29-sk-code-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Surface Playbook Expansion

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

- [x] T-001 Read `playbook-corpus-manifest.json` and confirm sk-doc's `routingGoldRoots` shape, and confirm `sk-code-review`'s prior `FORBIDDEN_VERDICT` count as precedent. Evidence: `validate-playbook-package.cjs --package sk-doc --no-strict` → `SKIP tier=WARN scenarios=32 categories=8 operator=0 routing_gold_excluded=32`; `sk-code-review`'s prior literal alignment carried 24 `FORBIDDEN_VERDICT` violations out of 129 total.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Build 7 category directories in `sk-code-mobile-cli/manual-testing-playbook/`, moving the original 7 scenarios into `intent-detection/` and authoring the other 6 categories. Evidence: `validate-playbook-package.cjs --package sk-code/sk-code-mobile-cli --strict` → `PASS tier=FAIL_CLOSED scenarios=26 categories=7 operator=26 routing_gold_excluded=0 violations=0 warnings=0 exit=0`.
- [x] T-003 Build the same 7 category directories in `sk-code-obsidian/manual-testing-playbook/`. Evidence: `validate-playbook-package.cjs --package sk-code/sk-code-obsidian --strict` → `PASS tier=FAIL_CLOSED scenarios=27 categories=7 operator=27 routing_gold_excluded=0 violations=0 warnings=0 exit=0`.
- [x] T-004 Waive `agent-dispatch` in both packages with a package-grounded reason. Evidence: `sk-code-mobile-cli/manual-testing-playbook/manual-testing-playbook.md` Category 6 note cites `routingClass: metadata`, read-only, never-routes-as-primary, and its source-gates runner targeting a repository this repo does not contain; `sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` Category 6 note cites the same `routingClass: metadata` status and its evidenced work living in a separate Obsidian plugin repository.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-005 Verify every `expected_resources` path added across both expansions resolves on disk. Evidence: 137 paths checked across `sk-code-mobile-cli`'s 26 scenarios, 0 missing; 92 paths checked across `sk-code-obsidian`'s 27 scenarios, 0 missing.
- [x] T-006 Confirm neither package's expansion introduced forbidden verdict vocabulary. Evidence: both `--strict` runs report `violations=0`; `FORBIDDEN_VERDICT` in `validate-playbook-package.cjs` rejects `PARTIAL`/`READY`/`UNAUTOMATABLE`/`BLOCKED`, none of which appear in either package.
- [x] T-007 Record the pre-existing, unrelated `sk-code-opencode` scenario gap as a known limitation. Evidence: `sk-code-opencode/SKILL.md` declares 10 intents including `JAVASCRIPT`; its playbook covers 9, with no `JAVASCRIPT`-specific scenario — out of this packet's two-package scope, not fixed here.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Both `sk-code-mobile-cli` and `sk-code-obsidian` validate `PASS`/`tier=FAIL_CLOSED`/`0 violations`/`exit=0` with 7 category directories each.
- `agent-dispatch` is waived in both with a package-grounded, non-boilerplate reason.
- The four-way sk-doc verdict scheme was deliberately not imported, and the reasoning is grounded in the `sk-code-review` precedent, not assumed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Precedent package (forbidden-verdict evidence): `sk-code-review`.
<!-- /ANCHOR:cross-refs -->
