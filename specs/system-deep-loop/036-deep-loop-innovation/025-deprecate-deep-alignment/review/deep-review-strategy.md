# Deep Review Strategy — deep-alignment deprecation + session work

## Provenance (read first)

This run uses the **operator-approved manual multi-agent orchestration fallback**, not the `/deep:review` state machine. The canonical `/deep:review :auto` loop (via `opencode run --command deep/review`) **hangs at iteration-2 process-nesting fleet-wide** — reproduced with both the cli-devin and cli-pi executors here (0% CPU, ~1.5h, never dispatched iteration 2), and corroborated by other sessions' `/deep:research:auto` hanging identically and by the `016-system-deep-loop-review` hung-casualty packet. The deviation was flagged to the operator and approved per PLAN-WORKFLOW LOCK; a fresh independent Opus review confirmed the strategy. Fixing the orchestrator is deferred to a separate Gate-3 packet (live lead: a stdio/PTY deadlock spawning iteration 2 under `opencode run --auto`; refuted lead: a `MK_` vs `SYSTEM_` spec-gate env-name mismatch — the runtime reads `SYSTEM_SPEC_GATE_ENFORCE`, set correctly).

- **Conductor (single writer of all state artifacts):** Claude Opus.
- **Reviewer (read-only passes):** cli-pi `glm-5.3-flash` via OpenRouter (`openrouter/z-ai/glm-5.3-flash`; the opencode-go route is usage-capped for ~10 days).
- The `@deep-review` LEAF agent is deliberately NOT dispatched (reduces the forbidden-list surface); passes are generic read-only reviewers, and the conductor reproduces the full artifact contract (config, state.jsonl, findings-registry, iterations/*.md, dashboard, review-report.md) + VERDICT_LOCK.

## Known Context

**Scope — three commits (union ≈ 323 files):**
- `8849444aa6` — remove the deep-alignment deep-loop mode + the conformance-benchmark capability it powered. 291 files (174 deletions incl. the 126-file mode packet + 6 agents + conformance-benchmark family; 110 edits to shared runtime/registrations/docs; 7-file Level-2 packet). Also a forced 3-row edit to the frozen packet-001 `state-backend-census.json` (runtime census==manifest invariant after the alignment ledger-schema was deleted).
- `d1a5981b58` — executor single-dispatch routing fix: dispatch one cli-cursor/devin/pi instead of silently going native. 10 files.
- `e41aa1878a` — retire the Phase-0 dispatch-context gate across all `deep/*` commands. 33 files.

**Own spec packets:** `025-deprecate-deep-alignment` (this packet, Level 2, validate --strict 0/0), plus `024-executor-kind-routing` and `023-cross-runtime-dispatch` (predecessors for commits 2/3).

**Claimed final state to verify:** removal is runtime-clean (six surviving deep-loop modes + behavior/model/skill/agent benchmark families intact; generated metadata consistent with sources); node:test 715/16 stable; whole-suite vitest 6 pre-existing failures only.

**Known risk areas:** (1) residue after a 174-file/42,720-line deletion — dangling imports, registry/manifest/advisor-vocab entries, help text, cross-refs, AND stale bare-`alignment` active-mode references in docs (an initial cli-devin pass already CONFIRMED 3 P2s in README.md/SKILL.md/ROUTER.md/playbook); (2) the executor single-dispatch surface + error propagation; (3) whether removing the Phase-0 gate opens a hole across deep/* commands; (4) the frozen packet-001 census edit.

## Iteration plan (10, no early convergence)

- Wave A (breadth, 1-4): correctness · security · spec-alignment · completeness-residue, each over the full union.
- Wave B (depth, 5-7): deletion blast-radius (c1) · executor routing correctness+regression (c2) · Phase-0 gate retirement consistency (c3).
- Wave C (8-9): adversarial refutation of all P0/P1 · residual/cross-cutting sweep + commit-composition.
- Wave D (10): final completeness + no-regression delta + verdict aggregation (VERDICT_LOCK).

Conductor re-verifies every P0/P1 with `git show`/Grep against cited file:line before it enters review-report.md.
