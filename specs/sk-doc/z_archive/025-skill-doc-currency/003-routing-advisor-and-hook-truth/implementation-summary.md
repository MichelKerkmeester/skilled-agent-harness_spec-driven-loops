---
title: "Implementation Summary: routing-advisor-and-hook-truth"
description: "In-progress evidence for the documentation-only BUILD leaf covering advisor policy, hook topology, prompt routing and CLI-count truth."
trigger_phrases:
  - "routing advisor implementation summary"
  - "hook topology truth evidence"
  - "skd025-003 build evidence"
importance_tier: "important"
contextType: "implementation"
status: "In Progress"
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/003-routing-advisor-and-hook-truth"
    last_updated_at: "2026-08-02T13:04:05.000Z"
    last_updated_by: "skd025-003-build"
    recent_action: "Recorded final smoke, safety and strict-validation receipts"
    next_safe_action: "Handoff; retain In Progress while advisor daemon is unavailable"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "baselines/advisor-validation-pre-edit.txt"
      - "baselines/cli-smoke-pre-edit.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skd025-003-build"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Post-edit advisor validation remains unavailable while the warm daemon socket is absent."
    answered_questions:
      - "DR-6 accepted as a bounded delta from the 2026-07-30 snapshot."
      - "Q3 admits all four supplementary findings; each has an independent evidence line."
      - "Q4 is documentation-only; the user-global installation remains untouched."
---
# Implementation Summary: routing-advisor-and-hook-truth

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Spec folder | `003-routing-advisor-and-hook-truth` |
| Status | In Progress |
| Scope | Documentation and the bounded CLI smoke expectation only; no scorer, snapshot, hook behavior or user-global installation changes |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

This BUILD leaf corrected the confirmed advisor gate, hook topology, prompt-model routing, stale-state, CLI-count and reference-structure documentation defects. The only executable change is the bounded offline smoke expectation in `.opencode/bin/cli-offline-smoke.cjs`; runtime hook behavior, the scorer and the baseline snapshot remain unchanged.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work stayed inside the named documentation scope and child packet. Each supplementary item was checked and evidenced independently. The path/router assertions, document validators, pre-push regression suite and CLI smoke were run against the current worktree.
<!-- /ANCHOR:how-delivered -->

## Pre-edit receipts

The verbatim baseline captures are stored under [`baselines/`](./baselines/):

- Advisor validation: exit `75`, backend unavailable at the warm-only socket. The recorded output is in [`advisor-validation-pre-edit.txt`](./baselines/advisor-validation-pre-edit.txt).
- CLI offline smoke: exit `1`; spec-memory returned `41` while the stale smoke expectation was `39`, skill-advisor returned `9`. The full output is in [`cli-smoke-pre-edit.txt`](./baselines/cli-smoke-pre-edit.txt).
- Six reference validators: `6` blocking errors total, one missing numbered overview per file. The capture is in [`document-validator-pre-edit.txt`](./baselines/document-validator-pre-edit.txt).
- Runtime registration: the pre-edit Cursor registration targeted the absent `.cursor/hooks/git-preflight-advisory.mjs`; the captured HEAD excerpt is in [`runtime-hook-config-pre-edit.txt`](./baselines/runtime-hook-config-pre-edit.txt).
- Safety reproduction: the pre-push regression suite returned `PASS=21 FAIL=0`, including the broken-validator allow case. The capture is in [`fail-open-pre-edit.txt`](./baselines/fail-open-pre-edit.txt).
- Fleet baseline: the first phase records the supplied concurrent re-baseline as `11/11 clean` in its task receipt; this leaf makes no remembered-count no-regression claim.

<!-- ANCHOR:decisions -->
## Key Decisions

DR-6 is recorded as **Accepted** in [`decision-record.md`](./decision-record.md). The validation gate now states a bounded delta from the baseline captured on **2026-07-30**, with the derived policy bounds dated alongside every number. The snapshot JSON, scorer and threshold-consuming code were not edited.

The native hook topology is documented as Claude, Codex, Cursor and Devin source adapters under `system-spec-kit/mcp-server/hooks/`, compiled `dist/hooks` twins, and the OpenCode plugin bridge. Absent Copilot/OpenCode source trees and obsolete settings paths were removed from the references. Cursor now registers the maintained shared Git adapter. The Pi README names `tool_result` content as the model-visible channel. The remote-branch policy prominently states the pre-push fail-open limitation without changing hook behavior.

The prompt-model roster now includes the six active profiled models, Composer-2.5 resolves through `MODEL_COMPOSER`, and the Pi routes are documented for DeepSeek, MiniMax and MiMo. The optional MiMo-ultraspeed route remains explicitly unverified. The six references now have numbered overview sections. The daemon CLI reference and smoke expectation agree at spec-memory `41` and skill-advisor `9`, with code-index removed from that live surface.
<!-- /ANCHOR:decisions -->

## Confirm-against-HEAD dispositions and terminal states

The hook-topology group was confirmed first. The 22 items have one terminal disposition each; the one drifted finding (`RE-007-11`) retained its live count correction while its now-resolving related links were left untouched.

| Item | Confirmed disposition | Terminal state | Evidence |
|---|---|---|---|
| RE-003-01 | Retired hook topology and absent settings path confirmed | repaired | `hook-system.md` runtime matrix and registrations |
| RE-003-02 | Non-runnable hook reference paths confirmed | repaired | both hook references and path assertion |
| RE-003-04 | Codex omission and duplicated runtime roster confirmed | repaired | `system-spec-kit/README.md` runtime inventory |
| RE-003-05 | Provenance-before-numbered-content defect confirmed | repaired | `auto-mode-contract.md` headings 1–9 |
| RE-003-07 | Installation drift is an operator-state escalation | repaired | documented check command and project/global boundary |
| RE-007-01 | Absolute gate conflicted with the 2026-07-30 snapshot | repaired | accepted DR-6 and dated bounded-delta statement |
| RE-007-02 | Obsolete adapter paths and omitted live adapter confirmed | repaired | advisor hook reference and path assertion |
| RE-007-03 | Contradictory stale-state prose confirmed | repaired | one stale row remains and matches code behavior |
| RE-007-04 | Missing Pi and Composer routes confirmed | repaired | prompt-model dispatch matrix |
| RE-007-05 | Composer profile had no router signal/resource map | repaired | `MODEL_COMPOSER` signal and resource map |
| RE-007-06 | Iteration cap conflicted with the three-cycle contract | repaired | prompt-improve rule now allows up to 3 cycles |
| RE-007-07 | Advisor integration inventory topology defect confirmed | repaired | advisor `SKILL.md` integration inventory |
| RE-007-08 | Hub roster omitted Composer-2.5 | repaired | `sk-prompt/README.md` active roster |
| RE-007-09 | Model orientation omitted GLM, Composer and MiMo-ultraspeed | repaired | prompt-models README orientation |
| RE-007-10 | Six references lacked the canonical numbered overview | repaired | six validators: 0 blocking issues post-edit |
| RE-007-11 | Finding drifted: links resolve, count was still overcounted | repaired | 9 unique tool IDs; links deliberately unchanged |
| RE-007-12 | Timeout flag consumers are advisor-owned | repaired | advisor hub ownership section and sibling pointer |
| RE-008-06 | Reference, prose and smoke count authorities disagreed | repaired | live counts 41/9 and smoke expectation update |
| RE-006-04 | Cursor registered an absent adapter | repaired | maintained shared adapter path and individual evidence |
| RE-006-05 | Pi visible return channel was misstated | repaired | `tool_result` content named explicitly |
| RE-006-06 | Fail-open behavior was overclaimed as reliable enforcement | repaired | prominent limitation; hook unchanged |
| RE-006-09 | Packet-history citations were present in evergreen policy | repaired | stable source paths and feature names |

Terminal totals: repaired `22`, stale-finding `0`, already-fixed `0`, deferred-with-reason `0`.

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| Hook and registration path assertion | Pass; 10 live adapter/bridge targets, 55 registered command paths, 0 unresolvable |
| Profile/router assertion | Pass; 6 active authored profiles, 6 signals/resource maps, Composer-2.5 selectable |
| Advisor README stale-state assertion | Pass; exactly one standalone `stale` state row, use-with-caveat |
| Six reference validators | Pass; 6/6 valid, 0 blocking issues |
| Pre-push behavior suite | PASS=21 FAIL=0; source diff remains empty |
| CLI offline smoke | Pass; live count remains 41 and the outdated smoke expectation was corrected |
| Advisor validation | Post-edit exit 75 with the same warm-daemon-unavailable result as pre-edit; no metric delta claimable |
| Child strict validation | PASS; Errors: 0, Warnings: 0, rc 0 |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

No user-global installation was repaired or written. The project-only drift check is documented with `node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree`. Rollback is surgical: restore the policy paragraph for DR-6, the documentation path/roster edits, the prompt reference headings, and the CLI smoke expectation independently; no runtime behavior or baseline artifact needs restoration.
<!-- /ANCHOR:limitations -->
