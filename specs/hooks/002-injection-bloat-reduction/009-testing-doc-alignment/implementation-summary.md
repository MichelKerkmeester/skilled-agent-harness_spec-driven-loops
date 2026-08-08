---
title: "Implementation Summary: Testing-Doc and Feature-Catalog Alignment Sweep"
description: "Final state of the dual-lineage repo-wide playbook and catalog alignment sweep: both models found the surfaces substantially aligned, with one change-derived stale playbook test count (corrected) and additive adapter-catalog omissions (two documented, the broad flag-reference sweep deferred)."
status: complete
completion_pct: 100
trigger_phrases:
  - "testing doc alignment summary"
  - "feature catalog sweep result"
importance_tier: "important"
contextType: "implementation-summary"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/009-testing-doc-alignment"
    last_updated_at: "2026-08-08T09:29:48Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified the must-fix findings from the dual-lineage sweep"
    next_safe_action: "Catalog delegates to ENV-REFERENCE by design; no further action"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md"
      - ".opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md"
    session_dedup:
      fingerprint: "sha256:76ffd4d7e49c52c47916f84af2c503b9a9c754787cef0e6a69e7784504c7296d"
      session_id: "2026-08-07-hooks-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The manual-testing-playbooks and feature-catalogs are substantially aligned; no document asserts the old epoch-0 or configured-receipt confirmation contract — the changed vocabulary lived only in the spec packet and the READMEs fixed in phase 008."
      - "The only change-derived staleness was a playbook expected test count (67 -> 87) that grew when the epoch/observer tests were added."
---
# Implementation Summary: Testing-Doc and Feature-Catalog Alignment Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete (must-fix implemented and verified; broad flag-reference addition deferred) |
| **Sweep executors** | `cli-codex gpt-5.6-luna` (max, fast) and `cli-opencode opencode-go/deepseek-v4-flash`, 10 iterations each, no early convergence |
| **Surface swept** | ~41 manual-testing-playbooks and ~1,498 feature-catalog files, committed at `2af2feb113` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two independent 10-iteration deep-loop lineages swept the repo-wide playbook and catalog surface, followed by the implementation of the verified must-fix findings.

- **Convergent verdict**: Both models found the surfaces substantially aligned. No document asserts the old confirmation contract (epoch-0 or `configured`-receipt confirmation, pre-emission observation). The changed vocabulary existed only in the spec packet and the phase-008 READMEs.
- **P1 must-fix (implemented)**: `spec-mutation-gate-enforce.md` step 2 expected `# tests 67`; the suite grew to 87 when the epoch/observer tests were added. Corrected the expected output to `87/87/0/0` and added the same env-neutralization step 1 already uses (so a child-dispatched run is hermetic).
- **P2 adapter-catalog omissions (implemented)**: added the post-emission delivery-observation note to the cursor spec-gate catalog and the post-emission advisor-policy-observation note to `claude-hook.md`.
- **P2 won't-fix (by design)**: the feature-flag-reference catalog deliberately delegates to `ENV-REFERENCE.md` (8/12 themed files state "no longer enumerate flags" to avoid drift), so the four spec-gate envs are covered via that single source; adding rows would reintroduce the drift the delegation prevents.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `system-deep-loop` fan-out ran two lineages concurrently: `gpt-5.6-luna` via cli-codex and `opencode-go/deepseek-v4-flash` via cli-opencode (the gateway provider, deliberately not the direct DeepSeek API). Each ran ten forced iterations, synthesizing into its own `research/lineages/<label>/research.md`. The two syntheses were reconciled and each must-fix confirmed against the real file — including re-running the cited playbook command, which surfaced and corrected a counting error in the first draft of the fix.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Watch it pass.** The corrected count was re-derived by running the exact playbook command; the module-mocks flag runs the 3 ESM-mock cases (87/87/0), which corrected an initial draft that used a plain-run count (87/84/3).
- **Provider discipline.** The second lineage used `opencode-go/deepseek-v4-flash` (gateway), a surface independent from the direct `deepseek/` API, per the request.
- **Bounded scope.** The two adapter catalogs that inventory the changed surfaces were updated; the feature-flag-reference env-row addition is won't-fix by design — that catalog deliberately delegates to `ENV-REFERENCE.md` (the single source) to avoid the drift that enumeration once caused.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All commands run from the final working-tree state, non-sandboxed.

- **Corrected command matches doc** — `node --experimental-test-module-mocks --test spec-gate-core.test.mjs`: `tests 87 / pass 87 / fail 0 / skipped 0`, matching the corrected `spec-mutation-gate-enforce.md:63`. `[EVIDENCE: node --test with mocks]`
- **Catalog symbols real** — `observeGate3QuestionDelivery` and `observeEmittedAdvisorPolicy` confirmed present in the source before documenting. `[EVIDENCE: grep import/export]`
- **Scope clean** — only three Markdown docs changed (one playbook, two catalogs) plus the packet; `git status` shows 0 `description.json` churn outside the packet tree. `[EVIDENCE: git status --porcelain]`
- **Dual-model convergence** — both lineages independently reported no old-contract assertion and the same one stale count. `[EVIDENCE: research/lineages/luna and deepseek-go research.md]`
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Flag-reference coverage is delegation, not enumeration.** The feature-flag-reference catalog deliberately delegates to `ENV-REFERENCE.md` (8/12 files state "no longer enumerate flags" to avoid drift), so the four spec-gate envs are covered via that single source rather than duplicated into the catalog — won't-fix by design, not a gap.
- **Small-model quirk.** The `opencode-go/deepseek-v4-flash` lineage emitted fabricated timestamps (flagged by the runtime) and exited non-zero while still producing a complete synthesis; its findings were reconciled against the luna lineage and verified against the real files, not trusted on their own.
- **Pre-existing out-of-scope drift.** The sweep noted a WS4 sub-test import-path drift in `mk-spec-gate.test.cjs` predating this work; it was left untouched as out of scope for a change-derived alignment sweep.
<!-- /ANCHOR:limitations -->
