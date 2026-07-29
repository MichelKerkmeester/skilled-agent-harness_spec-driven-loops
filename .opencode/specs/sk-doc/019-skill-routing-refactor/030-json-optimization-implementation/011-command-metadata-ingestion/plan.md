---
title: "Implementation Plan: Ingest command-metadata.json into Command Routing"
description: "Derive TS and Python COMMAND_BRIDGES from the fleet's command-metadata.json files behind a shadow-mode-first, corpus-gated rollout; add a 3-way drift-guard and denser command-metadata/leaf-aliases e2e tests."
trigger_phrases:
  - "command bridges generator plan"
  - "command metadata ingestion plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/011-command-metadata-ingestion"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 006 (routing-accuracy CI gate)"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation/011-command-metadata-ingestion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Ingest command-metadata.json into Command Routing

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Build one canonical command-bridge projection from the fleet's 7 `command-metadata.json` files (22 entries) plus a documented allow-list residual, and use it to generate both the TS `COMMAND_BRIDGES` array (`projection.ts`) and the Python `COMMAND_BRIDGES` dict (`skill_advisor.py`) — replacing two hand-authored, already-drifted arrays with one source of truth. Add a drift-guard vitest asserting all three surfaces agree, and denser `command-metadata`/`leaf-aliases` e2e tests. Because `projection.ts` is the advisor's hottest live-routing file, the cutover ships shadow-mode-first: generate, diff against the pre-change baseline, confirm zero corpus regression, and only then land the live swap as its own separate, revertible commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Generation fidelity | Generated TS + Python `COMMAND_BRIDGES` match the projection with zero manual post-edit |
| Granularity preservation | Every current per-subcommand Python distinction survives generation (REQ-003) |
| Drift-guard | New vitest fails loud, naming ids, on any 3-way mismatch (REQ-004) |
| E2E density | Every JSON-declared command has a routing assertion; leaf-aliases gets equivalent coverage (REQ-005) |
| Corpus regression | `score-routing-corpus.py` shows zero regression against the pinned baseline hash, before and after generation (REQ-006) |
| Rollback safety | Shadow-mode landing and live cutover are two separate commits; the cutover alone is one-command revertible (REQ-006) |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
command-metadata.json × 7 hubs (22 entries, schema-gated by ci-skill-root-metadata.cjs)
                    │
                    ├── + documented allow-list residual (/speckit:*, /memory:save —
                    │     system-spec-kit has no command-metadata.json yet)
                    ▼
      canonical command-bridge projection (new derivation module)
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
GENERATED block in       GENERATED block via new
projection.ts             --emit-command-bridges /
(TS COMMAND_BRIDGES,      --check-command-bridges /
mirrors aliases.ts's      --dump-command-bridges
DEEP_ROUTING_PROJECTION   flags on skill_advisor.py
pattern)                  (Python COMMAND_BRIDGES +
                           COMMAND_BRIDGE_OWNER_NORMALIZATION)
        │                       │
        └───────────┬───────────┘
                    ▼
      new drift-guard vitest: JSON ∪ allow-list == TS ids == Python ids
                    │
                    ▼
      shadow-mode diff + score-routing-corpus.py regression check
                    │
        (zero diff, zero regression)
                    ▼
      live cutover — separate, independently revertible commit
```

The generator is a new module (TypeScript, callable from both a build script and the drift-guard test) that reads every `.opencode/skills/*/command-metadata.json`, applies the allow-list residual, and emits the canonical projection. Two emission paths consume it: a TS emitter writing the `projection.ts` GENERATED block, and a Python emitter reachable via `skill_advisor.py --emit-command-bridges` (mirroring the script's existing `--emit-routing-projection` for `mode-registry.json` → `aliases.ts`/`skill_advisor.py`, at `skill_advisor.py:369-427`). `--check-command-bridges` and `--dump-command-bridges` mirror the script's existing `--check-routing-projection`/`--dump-routing-maps` flags so the drift-guard can call the same freshness/dump machinery already proven by `routing-registry-drift-guard.vitest.ts`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Re-confirm the current three-way drift against the live tree, enumerate every `command-metadata.json` file and its entries, document the allow-list residual, and capture the pre-change corpus/dump baseline that every later comparison in this phase is measured against.

### Phase 2: Implementation

Build the canonical projection derivation; add the TS and Python generated-block emitters and CLI flags; write the new drift-guard and the denser command-metadata/leaf-aliases e2e tests; run the shadow-mode diff and corpus regression check; only after zero diff/regression, cut the live `COMMAND_BRIDGES` arrays over to the generated blocks in a separate commit.

### Phase 3: Verification

Run the full advisor vitest suite plus the new drift-guard and e2e files; re-run `score-routing-corpus.py` against the pinned hash and confirm zero regression; confirm `--check-command-bridges` reports both generated blocks fresh; confirm the two-commit (shadow-mode / cutover) structure is in place; run `validate.sh <folder> --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. **Unit** — the projection derivation, tested against fixture `command-metadata.json` files, produces the expected canonical entry set (id, slash markers, owning skill, description, keywords).
2. **Freshness** — `--check-command-bridges` reports "fresh" with an empty diff after generation, mirroring `--check-routing-projection`'s existing contract.
3. **Drift-guard** — the new vitest asserts `(JSON-derived ids ∪ allow-list) == TS COMMAND_BRIDGES ids == Python COMMAND_BRIDGES ids`; a deliberately-broken fixture (one source edited without regenerating the others) must fail the test naming the specific offending ids, not just return a boolean.
4. **E2E density** — one routing assertion per JSON-declared `command-metadata.json` entry (22 today) confirming a representative prompt resolves to the declared `ownerMode`; equivalent per-entry coverage added for `leaf-aliases.json` resolution.
5. **Corpus regression** — `score-routing-corpus.py` run against the pinned corpus hash (195 labeled + 72 holdout + 24 ambiguity prompts, per the program parent's REQ-004) before Phase 2 starts and again after generation; the two runs must show zero regression.
6. **Shadow-mode diff** — the pre-change TS/Python `COMMAND_BRIDGES` dumps (captured in Phase 1) are diffed against the post-generation dumps; zero routing-outcome changes required before the live cutover commit is made.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

006 (`skill_graph_compiler.py` + `score-routing-corpus.py` wired into `.github/workflows/routing-registry-drift.yml`) must land first so this phase's drift-guard and corpus-gate run in CI. The fleet's 7 `command-metadata.json` files and their schema gate (`ci-skill-root-metadata.cjs` / `command-metadata-schema.cjs`) are read but not modified. The existing `--emit-routing-projection`/`--check-routing-projection` machinery in `skill_advisor.py` is the direct precedent this phase's new flags mirror.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase ships as **two separate commits**, matching the program parent's REQ-006 guarded-rollout rule:

- **Commit A — shadow-mode landing.** The projection derivation, the TS/Python generated-block emitters and CLI flags, the drift-guard, and the new e2e tests all land, but the live `COMMAND_BRIDGES` arrays in `projection.ts` and `skill_advisor.py` remain the pre-existing hand-authored ones — the generated output is produced and diffed, not yet wired live. This commit carries no routing-behavior risk; if anything in it is wrong, revert it alone with no effect on live routing.
- **Commit B — live cutover.** Only after Commit A's shadow diff is zero and `score-routing-corpus.py` shows zero regression, `COMMAND_BRIDGES` in both files is switched to reference the generated blocks. This is the only commit capable of changing live routing behavior.

**If Commit B causes any regression** (corpus score drop, drift-guard failure, or a live `advisor_recommend` routing miss reported post-merge): revert Commit B only. Because the swap is isolated to the two `COMMAND_BRIDGES` call sites and the generated blocks are delimited by `BEGIN/END GENERATED` markers, `git revert <cutover-sha>` restores the exact pre-phase hand-authored arrays byte-for-byte, with Commit A's generator/drift-guard/test infrastructure left in place as regression protection for the next attempt.

No `command-metadata.json` file is ever modified by this phase, so rollback never touches the source data — only the two generated-code call sites and the drift-guard/tests, none of which are load-bearing for any other in-flight phase.
<!-- /ANCHOR:rollback -->
