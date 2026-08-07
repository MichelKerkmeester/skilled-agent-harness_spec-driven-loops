---
title: "Tasks: Read-Only cli-codex Deep-Alignment Audit Leaf"
description: "Phased task breakdown for the read-only cli-codex alignment leaf fix."
importance_tier: "standard"
contextType: "general"
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

- [ ] T1.1 Create `runtime/lib/deep-loop/leaf-artifact-writer.ts`: extract JSON object from a final message, validate required audit fields, author narrative + state record + delta, inject route-proof fields, return a fail-closed result on malformed input.
- [ ] T1.2 Create `runtime/tests/unit/leaf-artifact-writer.vitest.ts`: valid → 3 artifacts; malformed → failure, no partial writes; route-proof always wrapper-authored; golden-record shape.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T2.1 Add the read-only OUTPUT CONTRACT variant (emit one structured JSON final message; write nothing) selected when executor kind is `cli-codex`; keep the native Bash-write contract otherwise.
- [ ] T2.2 Confirm the rendered read-only prompt still carries the DEEP-ALIGNMENT marker and resolved-route line.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T3.1 Rewrite the `deep-alignment-auto.yaml` `if_cli_codex` branch: `--sandbox read-only`, `-o <lastmsg>`, call `leaf-artifact-writer`, preserve the 038 containment call, fail-closed on writer failure.
- [ ] T3.2 Run `leaf-artifact-writer.vitest.ts` + the deep-loop runtime suites → green.
- [ ] T3.3 Re-run the LUNA hallmark alignment end-to-end → full budget, sk-code covered, no halt.

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
