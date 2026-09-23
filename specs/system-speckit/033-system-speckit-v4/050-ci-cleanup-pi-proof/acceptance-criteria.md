---
title: "Acceptance Criteria: CI Cleanup and Pi Gate-3 Live Proof"
description: "The criteria this packet must satisfy before it may close, each one met, waived by a decision record, or superseded by one, covering the six CI surfaces and the Pi Gate-3 live proof."
trigger_phrases:
  - "pi gate-3 live proof"
  - "ci cleanup pi proof"
  - "cli-jev run keyword"
  - "scorer baseline ratchet"
  - "six ci surfaces"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof"
    last_updated_at: "2026-09-23T12:30:00Z"
    last_updated_by: "cli-pi-mimo-v2.6-pro"
    recent_action: "Pushed 5b522489a2, all 21 CI runs passed on both branches"
    next_safe_action: "Remove the worktree after the closing push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-050-ci-cleanup-pi-proof"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: CI Cleanup and Pi Gate-3 Live Proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof
**Level:** 2
**Status:** Complete
**Date:** 2026-09-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a headless parent-mode probe with AI_SESSION_CHILD=0 and SYSTEM_SPEC_GATE_ENFORCE=0, When pi -p --offline runs with model llmgateway/glm-5.3-flash and stdin closed, Then the run exits 0 with stdout exactly HEADLESS PROBE ACK, the delivery marker records status open with questionDeliveredCount 1 and no spec-gate state residue, and docs/hermes-notes.md stays absent | The probe files evidence/pi-headless-*.txt and evidence/pi-headless-delivery-marker.json record pi_rc=0 and the marker fields. The lines spec-gate-core.mjs:105 and spec-gate-core.mjs:1782 prove the probe ran the real parent classifier in advisory mode | Met | - |
| AC-002 | REQ-002 | Given a live TUI run, When the select dialog and the path input bind the session to specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof, Then the first write is refused with the spec gate message, the retry passes, later edits pass with no second question, and the state file reports satisfied with that bound path | evidence/pi-tui-select.txt, evidence/pi-tui-input.txt, evidence/pi-tui-final.txt, evidence/pi-tui-state.json and evidence/pi-tui-warning.log record the dialog, the first-write refusal, the passing retry and the satisfied state. The warning log records a would-deny for write docs/gate3-probe.md at 2026-09-22T15:10:47Z and the probe files were removed afterwards | Met | - |
| AC-003 | REQ-003 | Given the four regenerated Hermes skill copies and the regenerated deep-ai-council command contract, When the Hermes sync checks and the deep-loop contract tests run, Then every Hermes skill copy is in sync, every prompt is in sync, and the contract tests pass without weakening a gate | node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check reported 70 Hermes skill copies in sync with exit 0. node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check reported 33 prompts in sync with exit 0. The system-deep-loop vitest contract drift and render runs reported 2 files and 42 tests passed with exit 0 | Met | - |
| AC-004 | REQ-003 | Given the 14 cli-orca docs with corrected contextType and the updated skill graph metadata with reciprocal sibling edges, When the frontmatter check, the graph compiler validation and the derived freshness check run, Then each reports zero violations with exit 0 | bash .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh . --coverage reported docs=101 violations=0 with exit 0. python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only reported VALIDATION PASSED with 15 discovered and 1 route-excluded with exit 0. node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs reported checked=15 fresh=15 stale=0 errored=0 with exit 0 | Met | - |
| AC-005 | REQ-003 | Given six broken markdown links repointed to their z_archive locations, When the markdown link check runs, Then it reports zero broken links with exit 0 | node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs reported 7834 files, 13510 links and 0 broken with exit 0, against 2 broken and exit 1 before the fix | Met | - |
| AC-006 | REQ-003 | Given the spec-kit CLI vitest project with the corrected recursive-child-manifest paths, When a clean full project run completes, Then no file fails and no test fails | A clean full re-run of npx vitest run --config ../../vitest.config.ts --project cli in .skilled/skills/system-spec-kit/runtime/cli reported 143 files passed and 3 skipped, 1441 tests passed and 19 skipped of 1460, and exit 0 in 485 s. An earlier full run under heavy concurrent load failed 3 tests in tests/runtime-memory-inputs.vitest.ts, and that file passes 24 of 24 alone. Its failure messages were not captured, so load as the cause is inferred | Met | - |
| AC-007 | REQ-004 | Given a scorer baseline recaptured at 151 of 195 and 26 of 32 against the committed 152 of 195 and 27 of 32, When the drop is root-caused and fixed at the producer, Then the live scores return to 152 of 195 and 27 of 32 and a fresh capture equals the committed baseline on every metric and every fixture hash | Experiments on git-archive copies traced the drop to the bare word "run" in the cli-jev SKILL.md Keywords and derived.key_topics. Removing that word from .skilled/skills/cli-jev/SKILL.md line 8 and .skilled/skills/cli-jev/graph-metadata.json and regenerating .hermes/skills/cli-jev/SKILL.md restored live 152 of 195 and 27 of 32 with corpus row 26 routed to system-deep-loop. The system-skill-advisor routing vitest runs reported 4 files and 28 tests passed including the ratchet 7 of 7 with exit 0 | Met | - |
| AC-008 | REQ-005 | Given the cli-jev SKILL.md edit changed its compiled-routing policy hash, When the compiled-routing manifest is re-minted after merging main with node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-jev --skill-root .skilled/skills/cli-jev, Then the guard reports fresh and CJ-001 routes compiled | The repository's route-remint pre-commit gate re-minted cli-jev inside commit f0411552aa, moving its effectivePolicyHash from 3240ebf5 to 178b10dd, so the re-mint ran at commit time rather than after the merge. On the merged tree at 0b39a1f6c3, node .skilled/bin/compiled-route-guard.cjs reports all seven hubs fresh with exit 0, the CJ-001 prompt routes compiled to cli-usage through node .skilled/bin/compiled-route.cjs under hash 178b10dd, and compiled-route-admission.cjs --hub cli-jev passes 3 of 3 | Met | - |
| AC-009 | REQ-006 | Given the closing packet documents, When the strict validation runs on the packet, Then it reports RESULT: PASSED and the parent records are reconciled | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof --strict printed RESULT: PASSED with 0 errors and 0 warnings. The parent spec.md carries phase map row 50 and the 049 to 050 handoff row, the parent graph-metadata.json children_ids lists 050 as its 50th entry, and the parent folder's own strict checks pass | Met | - |
| AC-010 | REQ-007 | Given the merged tree, When Hermes sync, the scorer ratchet, the link check and the route guard re-run before push, Then each passes on the merged tree | On the merged tree at 0b39a1f6c3, sync-skills-hermes.cjs --check reported 70 copies in sync, the advisor routing and ratchet vitest reported 28 passed, check-markdown-links.cjs reported 0 broken and compiled-route-guard.cjs reported all seven hubs fresh, each with exit 0 | Met | - |
| AC-011 | REQ-003 | Given the pushed tip, When every GitHub workflow runs on main and skilled/v4.0.0.0, Then each run passes, including the two steps the six fixed surfaces had hidden | On 5b522489a2 all 21 workflow runs passed, 10 on main and 11 on skilled/v4.0.0.0. The routing-accuracy corpus gate printed corpus matches the pinned baseline hashes with overall_pass true in runs 35858534321 and 35858537968. The runtime vitest project passed 106 files and 1292 tests with 13 skipped in runs 35858534168 and 35858537973 | Met | - |

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

Every criterion is Met. The push and the CI watch are done, with all 21 workflow runs passing on 5b522489a2, and the worktree is removed after the closing push.
<!-- /ANCHOR:closure -->
