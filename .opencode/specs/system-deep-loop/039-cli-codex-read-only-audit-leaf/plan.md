---
title: "Implementation Plan: Read-Only cli-codex Deep-Alignment Audit Leaf"
description: "Architecture and phased plan to run the cli-codex alignment leaf read-only and move iteration-artifact writing to the dispatch wrapper."
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Read-Only cli-codex Deep-Alignment Audit Leaf

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Replace the "workspace-write leaf writes its own artifacts" contract for the cli-codex alignment executor with a "read-only leaf reports, wrapper writes" contract. The leaf audits under `--sandbox read-only` and emits one structured JSON final message; the dispatch wrapper parses it and authors the three per-iteration artifacts, injecting the route-proof fields. This makes the leaf structurally unable to write (no `apply_patch`, no corruption, no tool-mediated-write halt) while keeping the state schema, reducer, and convergence gate unchanged.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `vitest` for `leaf-artifact-writer` passes (valid / malformed / missing-field / route-proof cases).
- Existing deep-loop runtime vitest suites still pass (no regression).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this packet> --strict` → Errors:0.
- End-to-end: a LUNA cli-codex alignment run completes its full budget and covers the sk-code lane.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

**Before (cli-codex):** `codex exec --sandbox workspace-write -` → leaf Bash-writes iteration.md + state record + delta → 038 containment reverts out-of-scope. Halts when the leaf uses `apply_patch`.

**After (cli-codex):**
1. Wrapper renders the read-only prompt variant (write nothing; emit one JSON object as the final message).
2. `codex exec --sandbox read-only -o <lastmsg> -` — read-only Bash audit permitted; final message captured.
3. `leaf-artifact-writer` parses `<lastmsg>`, extracts the JSON object (last fenced block or trailing object), validates required audit fields, and writes:
   - `iterations/iteration-NNN.md` — narrative synthesized from the structured findings.
   - the appended `"type":"iteration"` state-log record.
   - `deltas/iter-NNN.jsonl` — record line + `{"type":"finding",...}` lines.
   Route-proof fields (`target_agent`, `resolved_route`, `agent_definition_loaded`, `mode`, `iteration`) are authored by the wrapper from config.
4. Malformed/incomplete message → non-zero exit → existing redispatch path; no partial artifacts; no workflow halt.
5. 038 containment still runs (no-op under read-only).

The record schema is copied from the existing OUTPUT CONTRACT so the reducer/convergence read it identically.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Phase 1 — Helper + tests.** Create `leaf-artifact-writer.ts` (parse → author 3 artifacts → route-proof injection → fail-closed) and its vitest. Pure/unit-testable, no YAML dependency.
- **Phase 2 — Prompt pack.** Add the read-only OUTPUT CONTRACT variant selected for `cli-codex`: the leaf writes nothing and emits the structured final message; native path keeps the Bash-write contract.
- **Phase 3 — Wire the dispatch.** Rewrite the `deep-alignment-auto.yaml` `if_cli_codex` branch: `--sandbox read-only`, `-o` capture, call the helper, preserve the 038 containment call.
- **Phase 4 — Verify.** Run the helper vitest + runtime suites; re-run the LUNA hallmark alignment end-to-end and confirm full coverage.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: `leaf-artifact-writer.vitest.ts` over a temp packet dir — asserts the three artifacts' shapes, route-proof authorship, and fail-closed on malformed input.
- Golden-record: pin one canonical `"type":"iteration"` record shape so drift from the reducer's expectation is caught.
- Integration: the live LUNA alignment run is the end-to-end gate (REQ-007).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- codex-cli `--sandbox read-only` denies writes (probe-verified, 0.144.6).
- `runAuditedExecutorCommand` / dispatch-receipt capture in `executor-audit.ts` (reused for `-o` last-message capture).
- The existing reducer (`reduce-alignment-state.cjs`) and `check-convergence.cjs` — consumed unchanged.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git checkout` the two-to-three changed files (`deep-alignment-auto.yaml`, the prompt pack, and delete `leaf-artifact-writer.ts` + its test). The cli-codex path reverts to workspace-write; native / cli-opencode / fan-out are untouched throughout, so no coordinated rollback is needed.

<!-- /ANCHOR:rollback -->
