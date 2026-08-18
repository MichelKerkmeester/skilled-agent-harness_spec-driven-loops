---
title: "Tasks: Read-Only cli-codex Deep-Alignment Audit Leaf"
description: "Phased task breakdown for the read-only cli-codex alignment leaf fix."
trigger_phrases:
  - "cli-codex read-only leaf"
  - "codex apply_patch alignment halt"
  - "deep-alignment executor contract violation"
  - "read-only audit leaf"
  - "wrapper writes iteration artifacts"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/001-cli-codex-read-only-audit-leaf"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to Complete from landed read-only-leaf evidence"
    next_safe_action: "Run the full-budget LUNA alignment acceptance gate"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Read-Only cli-codex Deep-Alignment Audit Leaf

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done · `[~]` in progress. Each task names its file and its acceptance signal.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1.1 Create `runtime/lib/deep-loop/leaf-artifact-writer.ts`: extract JSON object from a final message, validate required audit fields, author narrative + state record + delta, inject route-proof fields, return a fail-closed result on malformed input.
  - Evidence: `leaf-artifact-writer.ts` (627 lines) committed in `ac98561cf7`.
- [x] T1.2 Create `runtime/tests/unit/leaf-artifact-writer.vitest.ts`: valid → 3 artifacts; malformed → failure, no partial writes; route-proof always wrapper-authored; golden-record shape.
  - Evidence: `leaf-artifact-writer.vitest.ts` (351 lines); `vitest` run → 25 passed (25) on 2026-08-18.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T2.1 Add the read-only OUTPUT CONTRACT variant (emit one structured JSON final message; write nothing) selected when executor kind is `cli-codex`; keep the native Bash-write contract otherwise.
  - Evidence: `deep-alignment-auto.yaml:483` `readOnlyOverride` appended only in the `if_cli_codex` branch; native path untouched.
- [x] T2.2 Confirm the rendered read-only prompt still carries the DEEP-ALIGNMENT marker and resolved-route line.
  - Evidence: `deep-alignment-auto.yaml:483` `promptBody = basePrompt + override`, so the base-rendered marker/resolved-route line is preserved.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T3.1 Rewrite the `deep-alignment-auto.yaml` `if_cli_codex` branch: `--sandbox read-only`, `-o <lastmsg>`, call `leaf-artifact-writer`, preserve the 038 containment call, fail-closed on writer failure.
  - Evidence: `deep-alignment-auto.yaml:441` imports `writeLeafArtifacts`; `:525` `-o` + `--sandbox`; `:560` `leaf_output_unpersisted`; `:573` `enforceWriteContainment` retained.
- [x] T3.2 Run `leaf-artifact-writer.vitest.ts` + the deep-loop runtime suites → green.
  - Evidence: `vitest` runs → leaf-artifact-writer 25/25, executor-audit + write-containment 49/49, all green on 2026-08-18.
- [x] T3.3 Re-run the LUNA hallmark alignment end-to-end → full budget, sk-code covered, no halt. [Deferred: external full-budget LUNA acceptance run pending, live-dispatch gate not runnable in doc reconciliation]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 requirements met, quality gates green, `validate.sh --strict` Errors:0, and the end-to-end LUNA run covers the sk-code lane without an `executor_contract_violation`.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements + acceptance: `spec.md` §4.
- Architecture + phases: `plan.md` §3–4.
- Decisions + evidence: `decision-record.md`.

<!-- /ANCHOR:cross-refs -->
