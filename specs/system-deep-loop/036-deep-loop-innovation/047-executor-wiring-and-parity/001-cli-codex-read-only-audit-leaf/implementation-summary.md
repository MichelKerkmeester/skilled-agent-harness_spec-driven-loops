---
title: "Implementation Summary: Read-Only cli-codex Deep-Alignment Audit Leaf"
description: "What was built for the read-only cli-codex alignment leaf fix and the verification evidence."
importance_tier: "important"
contextType: "general"
---
# Implementation Summary: Read-Only cli-codex Deep-Alignment Audit Leaf

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | In Progress |
| **Track** | system-deep-loop |
| **Completed** | 2026-07-23 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

1. **`runtime/lib/deep-loop/leaf-artifact-writer.ts`** — parses a read-only leaf's final message (fenced ```json block, whole-message, or trailing object), validates the required audit fields, stamps the route-proof invariants (`mode`, `target_agent`, `agent_definition_loaded`, `resolved_route`, `iteration`) from constants, and writes the three per-iteration artifacts (narrative markdown synthesized from the structured findings, the appended `"type":"iteration"` state-log record, and the write-once delta). All-or-nothing: a malformed/incomplete message writes nothing and returns `ok:false`.
2. **`commands/deep/assets/deep-alignment-auto.yaml` `if_cli_codex` branch** — now dispatches `codex exec --sandbox read-only -o <lastmsg> -`, appends a read-only OUTPUT OVERRIDE to the rendered prompt (write nothing; emit one JSON object), and calls the writer. On writer failure it appends a `leaf_output_unpersisted` event and fails the iteration fail-closed (redispatch), never a workflow halt. The 038 write-containment call is retained as a no-op belt-and-suspenders.
3. **`runtime/tests/unit/leaf-artifact-writer.vitest.ts`** — 12 cases over parse / assemble / narrative / happy-path / fail-closed.

The state-record schema is copied field-for-field from the existing OUTPUT CONTRACT, so the reducer and `check-convergence.cjs` consume the wrapper-written records with no changes.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built helper-first: the pure `leaf-artifact-writer` module and its 12-case vitest were written and green before any dispatch wiring, so the record schema and fail-closed contract were pinned in isolation. The `if_cli_codex` branch was then rewritten to read-only with `-o` capture and a branch-local prompt override, keeping the shared template and native path untouched. Verified by node syntax-check of the extracted branch, the runtime unit suites, and a 3-iteration live LUNA smoke run reproducing the previously-halting configuration.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Read-only sandbox over disabling apply_patch.** Probed codex 0.144.6: `include_apply_patch_tool=false` had no effect and the model catalog declares `apply_patch_tool_type: "freeform"`; there is no clean per-invocation toggle. `--sandbox read-only` denies all writes structurally (probe-verified), so it is the reliable containment. Details in `decision-record.md`.
- **Wrapper writes state; leaf only reports.** A read-only leaf cannot Bash-write, so state-authoring moved to the dispatch wrapper. Route-proof fields are wrapper-owned (never trusted from the model).
- **Branch-local override, not a template rewrite.** The read-only OUTPUT CONTRACT variant is appended in the `if_cli_codex` branch rather than forked in the shared template/render-step — smaller blast radius, native path untouched.
- **Wrapper-synthesized narrative.** The human-facing iteration markdown is derived from the structured record (the reducer never parses it), removing the largest JSON parse-fragility surface.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Unit** — `leaf-artifact-writer.vitest.ts`: 12/12 pass. `executor-audit.vitest.ts`: 25/25. `write-containment.vitest.ts`: pass. Node syntax-check of the extracted `if_cli_codex` block: OK.
- **End-to-end smoke** — a 3-iteration LUNA (`gpt-5.6-luna` xhigh, cli-codex) alignment run over the de-polluted hallmark corpus: **0 workflow halts, 0 `leaf_output_unpersisted` failures**; three `"type":"iteration"` records written by the wrapper with route-proof fields present; iterations advanced through 15 distinct artifacts (`001` → `002` → `003`, zero duplicates), proving the partition consumes the wrapper-written records correctly; `alignment-report.md` produced (Overall verdict PASS). This reproduces the exact configuration that previously halted at iteration 3 on an `executor_contract_violation`, now running clean.
- **Pre-existing/unrelated** — one `prompt-pack.vitest.ts` case fails on a stale underscore template path (`prompt_pack_iteration` vs the renamed hyphen file in `deep-research`); outside this change's surface.
- **Pending** — the full ~22-iteration run to confirm the sk-code lane (reached at iter ~13 once sk-doc is exhausted) audits to completion.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

- **Isolation** — only the cli-codex single-executor alignment path changed; `executor-audit` and `write-containment` suites remain green (native / cli-opencode / fan-out paths untouched).
- **Determinism** — the writer is a pure function of (final message, iteration context); route-proof output is constant.
- **Observability** — a writer failure appends a typed `leaf_output_unpersisted` event naming the reason, consistent with the existing failure taxonomy.

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope is deep-alignment only.** deep-review / deep-research cli-codex leaves have the same underlying exposure but different output contracts; the writer is reusable when those are addressed.
2. **Untouched-lane verdict.** When a lane is not reached within the iteration budget the reducer labels it `NOT_APPLICABLE` (pre-existing reducer behavior, not introduced here); a full-budget run avoids this by covering every lane.
3. **Leaf compliance.** The override + read-only sandbox make writes impossible, but a leaf that emits no parseable JSON fails the iteration (redispatch). Observed compliance in the smoke run was clean (0 unpersist events).

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Read-only OUTPUT CONTRACT variant in the shared prompt template | Appended as a branch-local override in `if_cli_codex` | Smaller blast radius; the shared template + native path stay byte-unchanged. The sandbox is the real enforcement; the override only redirects the leaf to report instead of write. |

<!-- /ANCHOR:deviations -->
