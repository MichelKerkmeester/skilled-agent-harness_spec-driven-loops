---
title: "Implementation Summary: cli-cursor enforced model allowlist"
description: "Hardened cli-cursor dispatch to a fail-closed 10-id allowlist (Composer 2.5, Grok 4.5, GLM 5.2) at both runtime dispatch entry points, removed auto as the default, and rewrote every cli-cursor skill-doc surface that described the prior unrestricted roster."
trigger_phrases: ["cli-cursor allowlist summary", "cursor model enforcement implementation"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/008-cursor-model-allowlist"
    last_updated_at: "2026-07-27T03:47:58Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, tested, and documented the enforced allowlist"
    next_safe_action: "Re-validate the whole 030 packet --recursive --strict, commit"
    blockers: []
    key_files: [".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts", ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs", ".opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-allowlist-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Allowlist scope: full family per model, 10 ids total.", "New default model: composer-2.5.", "model-profiles.json scope: no new entries; matches phase 005's Composer-only precedent."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 008-cursor-model-allowlist |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

`cli-cursor` dispatch is now hard-scoped to a 10-id allowlist across Composer 2.5, Grok 4.5, and GLM 5.2 — enforced at both places a `cursor-agent` command actually gets constructed, not just documented.

### `executor-config.ts`
`CURSOR_SUPPORTED_MODELS` replaced from a 3-id permissive reference (`['auto', 'composer-2.5', 'composer-2.5-fast']`, explicitly documented as "not exhaustive by design") with the full 10-id allowlist: `cursor-grok-4.5-{low,medium,high}` × `{plain,-fast}` (6), `composer-2.5`/`composer-2.5-fast` (2), `glm-5.2-high`/`glm-5.2-max` (2). New `CURSOR_DEFAULT_MODEL = 'composer-2.5'` and `isCursorModelAllowed(model)` type-guard predicate.

### `fanout-run.cjs` / `dispatch-model.cjs`
Both dispatch-command builders (`buildCursorLineageCommand`, and the cli-cursor case of `buildSpawnSpec`) now duplicate the allowlist as a plain JS `Set` (matching this codebase's established pattern of hand-duplicating small per-kind cursor facts in these `.cjs` files, since threading `executor-config.ts`'s async dynamic import into a synchronous, directly-unit-tested builder would be a larger and riskier change) and throw before constructing any args if the resolved model — defaulting to `composer-2.5`, never `auto` — is not in the set.

### Tests
`executor-config.vitest.ts`: 3 stale `model: 'auto'` fixtures swapped to `composer-2.5`; new `describe('CURSOR_SUPPORTED_MODELS / isCursorModelAllowed')` block (3 tests) asserting the exact 10-id set, the `composer-2.5` default, and accept/reject behavior. `fanout-run.vitest.ts`: 5 stale `'auto'` fixtures swapped; new tests for allowlist acceptance (all 10 ids) and rejection (`auto` + 2 out-of-roster ids). `remediation.vitest.ts`: the shared generic `resolved`/loop fixtures (used across cli-opencode/cli-claude-code/cli-cursor) now pass a cursor-specific `composer-2.5` model where the executor is cli-cursor; new allowlist-rejection test.

### Skill docs
Bulk-replaced 87 literal `--model auto` occurrences across 19 files (`SKILL.md`, `cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `cursor-tools.md`, `README.md`, `assets/prompt-templates.md`, and 12 manual-testing-playbook scenario files), then hand-fixed prose-level claims the mechanical pass could not catch: `SKILL.md`'s Model Selection section rewritten into an explicit allowlist table + a new NEVER rule (#7); `cli-reference.md` §5 rewritten the same way; `README.md`'s FAQ, troubleshooting table, and model-selection prose; `integration-patterns.md`'s decision matrix and 2 gotcha examples; `agent-delegation.md`'s task-routing table; `assets/prompt-templates.md` and `assets/prompt-quality-card.md`'s flag-reference examples; the manual-testing-playbook root's coverage note and Global Precondition #7; and `CU-001`'s title/frontmatter/evidence-table cell (which literally said "auto model" in 4 spots the bulk replace, scoped to the `--model` flag only, did not touch).

### Compiled-routing bookkeeping
The `SKILL.md` content edit staled the hub's pinned compiled-routing hash (confirmed via `sourceInputs()` that only `SKILL.md` files feed this hash, not `README.md`). Realigned via the same verified-safe pattern from phases 003/007: confirmed via `resolve.cjs` that the pinned hash gates only the compiled fast-path's activation (a mismatch falls back to legacy routing, not incorrect routing), then hand-aligned it to the freshly-computed value.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Live-confirmed the exact model ids via `cursor-agent --list-models | grep -iE "grok|glm|composer"` on the already-authenticated account, resolving the operator's named 4 variants into the full 10-id family set per their explicit choice.
2. Traced `CURSOR_SUPPORTED_MODELS` to its only 2 real consumers and confirmed the generic `parseExecutorConfig` zod schema treats `model` as a kind-agnostic free-form string (no per-kind value enum exists anywhere in the schema today) — this determined enforcement belongs at the dispatch-construction layer, not a broader, riskier schema refactor.
3. Hardened `executor-config.ts`, then both dispatch builders, then ran `npm run typecheck` (0 errors) before touching any test.
4. Ran the 2 affected runtime test files — found and fixed 2 additional test failures beyond what a first-pass read had surfaced (a `for (const executor of [...])` loop test in `fanout-run.vitest.ts`'s adapter-contract test, and a `for (const executor of [...])` cwd-propagation test in `remediation.vitest.ts` that both used a generic cross-executor placeholder model incompatible with the new cursor-specific allowlist).
5. Isolated the 1 remaining test failure (`retiredKind` bug) via `git stash` against `HEAD` to confirm it predates this phase's changes, matching the identical documentation already recorded in phase 002.
6. Swept the whole `cli-cursor/` skill tree with a bulk find-and-replace for the exact `--model auto` substring, then re-grepped for residual prose-level `auto`-as-default claims the mechanical pass could not catch and hand-fixed each.
7. Ran `validate_document.py` on every markdown file under `cli-cursor/` and `validate_skill_package.py` against the hub; diagnosed and fixed the resulting stale compiled-routing hash.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **Enforcement at the dispatch-construction layer, not the config-parsing schema.** `parseExecutorConfig`'s `model: z.string().min(1).nullable()` is generic across all 5 executor kinds; adding a cursor-specific value enum there would require a broader cross-field refactor (kind-conditional value validation doesn't exist anywhere in this schema today). The actual point where a "different model" would ever really get dispatched is when the CLI command is constructed — gating there matches the existing `isCursorBinaryAvailable` fail-closed precedent, which is also not schema-level.
- **Duplicated the allowlist as a plain JS literal in both `.cjs` files, rather than threading `executor-config.ts`'s async dynamic import into the synchronous builders.** `buildCursorLineageCommand`/`buildSpawnSpec` are called directly and synchronously by existing unit tests; making the allowlist check depend on an async import would break direct testability. This mirrors the file's own established convention (`SPECKIT_STATE_ENV_BY_KIND` and similar per-kind maps are already hand-duplicated in `fanout-run.cjs`, not imported).
- **New default is `composer-2.5`, a reversible, cheap decision — not specified by the operator.** With `auto` removed, SOME default was needed. Composer is Cursor's own native model (the closest available analog to "let Cursor decide" now that true auto-routing is disallowed) and was already the skill's secondary emphasis throughout. Flagged explicitly here for the operator to override if a different default (e.g. `cursor-grok-4.5-high` or `glm-5.2-max`) was actually intended.
- **No new `sk-prompt/prompt-models` profiles for Grok 4.5 or GLM 5.2.** This phase is a dispatch-allowlist enforcement mechanism, not prompt-craft research — matches phase 005's explicit Composer-only precedent ("Adding profiles for the hosted frontier models... only Composer gets a new profile").
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `npm run typecheck` (runtime) | PASS — 0 errors |
| `executor-config.vitest.ts` + `fanout-run.vitest.ts` | PASS — 157/157 |
| `remediation.vitest.ts` | PASS (with 1 documented pre-existing exception) — 25/26; the 1 failure (`retiredKind` bug) confirmed via `git stash` isolation to predate this phase, identical to phase 002's finding |
| Allowlist accept/reject behavior | PASS — all 10 ids accepted at both dispatch entry points; `auto` + 2 out-of-roster ids rejected with the expected error message at both |
| `validate_document.py` on all `cli-cursor/` markdown | PASS — every file `✅ VALID` |
| `validate_skill_package.py` against the hub | PASS — all 3 checks (default invocation) |
| Compiled-routing manifest freshness | PASS — `fresh: true` after the hash realignment |
| No embedded credential | PASS — security grep across all changed files → 0 matches |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. The `composer-2.5` default choice was not explicitly specified by the operator — a reversible, cheap decision flagged for override (see Key Decisions).
2. `validate_skill_package.py --strict` (not required by this phase's own SC-005, which targets the default invocation, matching phase 007's precedent) still surfaces the same 2 pre-existing, packet-unrelated hub contract warnings documented in phase 007's implementation-summary (`SKILL.md` description length, missing smart-router markers) — untouched, out of scope.
3. If a future Cursor CLI build renames or retires one of the 10 allowlisted ids, dispatch to the old id will start failing — re-verify via `cursor-agent --list-models` and update the allowlist in a follow-up phase rather than loosening enforcement silently.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `../002-deep-loop-executor-support/implementation-summary.md` (original allowlist this phase hardens)
- `../005-cursor-model-registry-and-routing/implementation-summary.md` (Composer-only sk-prompt/prompt-models precedent this phase does not extend)
