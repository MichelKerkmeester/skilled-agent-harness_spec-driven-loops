---
title: "Acceptance Criteria: Phase 13: clear-pre-existing-ci-and-doc-debt"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pre-existing ci debt acceptance"
  - "skill-benchmark removal closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/013-clear-pre-existing-ci-and-doc-debt"
    last_updated_at: "2026-09-18T13:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Met every criterion, AC-007 from CI on the pushed tip"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: clear-pre-existing-ci-and-doc-debt

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/013-clear-pre-existing-ci-and-doc-debt
**Level:** 2
**Status:** Complete
**Date:** 2026-09-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase changes, When the whole local gate runs and each commit passes the hooks, Then no failure is new against `d10ec9d549` | Node runner 88 files, 1001 pass, 1 fail, the same as the baseline. The one failure is `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs:118`, a scaffold version mismatch present before this phase. The spec-kit `root` and `cli` projects that Spec-Kit Check runs: 254 files, 2,723 pass, 0 fail. `.skilled/skills/system-spec-kit/runtime/vitest.config.ts:18`, which adds the deep-loop suites: 260 files, 3,928 pass, 0 fail. Commits `71aaaa8b95`, `30b2981762`, `c4b83f6648`, `cafeff809e`, `b1105386ab` and `7e74623188` each passed the hooks with no bypass variable | Met | - |
| AC-002 | REQ-002 | Given the deep-loop hub's new vocabulary, When the scorer ratchet and a per-row dump of 289 prompts run, Then the ratchet passes and no prompt moves | `.skilled/skills/system-deep-loop/SKILL.md:8` carries `iteration-files, iteration-history`. `.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:229` and `:256` pass, 7/7. The dump at `cafeff809e` matches the pre-cleanup dump row for row | Met | - |
| AC-003 | REQ-003 | Given sk-design, When its router and release authority are compared, Then the versions agree | `.skilled/skills/sk-design/ROUTER.md:10` and `.skilled/skills/sk-design/SKILL.md:5` both say `2.0.0.0`. `parent-skill-check` passes on all six hubs | Met | - |
| AC-004 | REQ-004 | Given the playbook fleet, When the validator runs as CI runs it, Then it exits 0 and every fail-closed root is discovered | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` `--strict` exits 0 with no failing package. All 44 allowlisted roots discovered. The containment scenario's signals are at `.skilled/skills/system-deep-loop/manual-testing-playbook/write-containment/shared-checkout-run.md:57` | Met | - |
| AC-005 | REQ-005 | Given a push or pull request, When Command Tree Parity runs, Then a job fails on any stale Hermes skill or prompt copy | `.github/workflows/command-tree-parity.yml:46` defines `hermes-mirror`. `:65` and `:66` run both sync scripts with `--check`, which exit 1 on a stale copy. Triggers at `:5` to `:8`. Both exit 0 locally: 68 skills, 33 prompts | Met | - |
| AC-006 | REQ-006 | Given the live tree, When it is searched for the retired lane, Then no route, command, script or run instruction offers it, and no script imports a removed module | `.skilled/skills/sk-doc/sk-create-benchmark/SKILL.md:108` routes four families, none of them `skill_benchmark`. `rg 'skill-benchmark'` finds nothing in the sk-doc `mode-registry.json`, `hub-router.json` or `command-contract.json`. `.skilled/commands/create/assets/create-benchmark-presentation.txt:83` offers four families. `rg 'scripts/skill-benchmark'` over code finds only the census. The one script that still required a module the retirement deleted, `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:386`, now parses its own arguments; `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/validate-compiled-routing-scenarios.test.cjs:137` runs its CLI and fails against the old script with exit 1 | Met | - |
| AC-007 | REQ-007 | Given the pushed tip, When CI runs, Then Routing Registry Drift Guard, Playbook Operator Contract and the Hermes mirror job pass | At `a22897b1af`, defined in `.github/workflows/command-tree-parity.yml:46`: Routing Registry Drift Guard runs 35358038757 (main) and 35358038847 (skilled/v4.0.0.0), Playbook Operator Contract 35358038681 and 35358038874, and the Hermes mirror job inside Command Tree Parity 35358038672 and 35358038808, all success | Met | - |
| AC-008 | REQ-008 | Given the hub summary, When it is compared with the Hermes roster check, Then both say seven | `.skilled/skills/cli-external-orchestration/graph-metadata.json:440` says seven CLI dispatch orchestrators. `skill_graph_compiler.py --validate-only` passes | Met | - |
| AC-009 | REQ-009 | Given the rewritten files, When the live tree is searched and every prompt re-scored, Then no live file describes the lane as present and no prompt moves | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:79` now says no tool runs the parity step. The per-row dump of all 289 prompts matches the known-good dump row for row after sorting | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met. The residue commits were pushed at `10742789a1` and CI is green on both branches there too: all 25 runs green, among them Routing Registry Drift Guard 35360099934 and 35360102705, Playbook Operator Contract 35360099937 and 35360102901, and Command Tree Parity 35360100027 and 35360102852. Spec-Kit Check did not run because the push touched none of its paths. The write-set conflict census was consciously left as a record of its spec program.
<!-- /ANCHOR:closure -->
