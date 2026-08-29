---
title: "Tasks: sk-code family playbook remediation"
description: "Ordered tasks: read the manifest, measure each of the seven roots, remediate the five dirty ones by violation class, and re-measure per root."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "sk-code family playbook remediation tasks"
  - "sk-code per-root measurement tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code/031-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-code/031-playbook-family-remediation/001-sk-code-family"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the sk-code family tasks; all seven roots re-measured at zero"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-review/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:559195ef4700999118293abb3a3e02eac632ee721dc51220a269c99ddf141130"
      session_id: "2026-08-29-sk-code-031-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code family playbook remediation

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

- [x] T-001 Read `playbook-corpus-manifest.json` and establish each sk-code root's tier and exclusions. Evidence: `routingGoldRoots` contains the hub path `.opencode/skills/sk-code/manual-testing-playbook/compiled-routing` and no other sk-code entry; no sk-code root appears in `warnPackages`.
- [x] T-002 Measure the starting count for each of the seven roots with its own `--package <root> --strict` run. Evidence: five dirty roots at hub 181, `sk-code-review` 129, `sk-code-webflow` 156, `sk-code-opencode` 108, `sk-code-quality` 12, for 586 total; `sk-code-mobile-cli` and `sk-code-obsidian` already at zero.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Clear `sk-code-review`'s forbidden grading vocabulary at the class level rather than registering the package for it. Evidence: its largest class was 24 `FORBIDDEN_VERDICT` instances imported by a prior literal alignment to sk-doc; the package keeps `PASS`/`FAIL`/`SKIP` and was not added to `routingGoldRoots`.
- [x] T-004 Remediate the `sk-code` hub, `sk-code-webflow`, `sk-code-opencode`, and `sk-code-quality` by violation class. Evidence: `--package <root> --strict` on each reports `violations=0` after the work, with `tier=FAIL_CLOSED` unchanged.
- [x] T-005 Hold the hub's `compiled-routing/` routing-gold exclusion fixed through the remediation. Evidence: the hub census reports `routing_gold_excluded=1` against `operator=31` in the final run, the same single exclusion it carried before.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 Re-measure all seven roots individually and read each census line in full. Evidence: `PASS package=sk-code scenarios=32 categories=11 operator=31 routing_gold_excluded=1 violations=0`; `sk-code-review` 31 across 9; `sk-code-webflow` 13 across 4; `sk-code-opencode` 9 across 3; `sk-code-quality` 1 across 1; `sk-code-mobile-cli` 26 across 7; `sk-code-obsidian` 27 across 7 — all `violations=0`.
- [x] T-007 Confirm no count was cleared by reclassification. Evidence: every sk-code root reports `tier=FAIL_CLOSED`; only the hub reports a non-zero `routing_gold_excluded`, at the same value of 1 it had before; `warnPackages` contains no sk-code entry.
- [x] T-008 Confirm the two already-clean roots did not regress. Evidence: `sk-code-mobile-cli` and `sk-code-obsidian` both report `violations=0 warnings=0` in the final census.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All five dirty sk-code roots report `violations=0` under their own `--package --strict` runs.
- The hub's routing-gold exclusion is unchanged at one file, so no violation left scope instead of being cleared.
- No sk-code root was added to `routingGoldRoots` or `warnPackages` to reach zero.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Parent packet and phase map: `../spec.md`.
- Successor phase: `../002-cli-and-mcp-transports/`.
- The coverage expansion of the two already-clean roots: `../../028-surface-playbook-expansion/`.
<!-- /ANCHOR:cross-refs -->
