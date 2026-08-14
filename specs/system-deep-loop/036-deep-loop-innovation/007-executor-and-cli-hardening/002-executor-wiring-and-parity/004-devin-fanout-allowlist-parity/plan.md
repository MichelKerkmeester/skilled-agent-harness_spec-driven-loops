---
title: "Implementation Plan: devin fan-out allowlist parity"
description: "Additive alignment of the runtime's enforced cli-devin allowlist and default with the curated catalog, executed by a dispatched GPT-5.6 SOL session and verified by the orchestrator with the runtime unit suites."
trigger_phrases:
  - "devin allowlist parity plan"
  - "executor config devin update plan"
  - "fanout duplicated allowlist alignment"
  - "devin default swe runtime plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/004-devin-fanout-allowlist-parity"
    last_updated_at: "2026-07-30T03:47:10.019Z"
    last_updated_by: "implementer"
    recent_action: "Record the executed approach"
    next_safe_action: "Commit the packet + runtime change"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-044-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: devin fan-out allowlist parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Additive-only runtime change: extend the enforced cli-devin allowlist with the seven catalog-featured model ids and flip the omitted-model default from `adaptive` to `swe`, in both allowlist surfaces (`executor-config.ts` and the plain-JS mirror in `fanout-run.cjs`), with the vitest pins updated to match. Implemented by two GPT-5.6 SOL (high, fast) dispatches via cli-codex under exact-edit briefs; every executor claim re-verified by the orchestrator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria | Result |
|------|----------|--------|
| Unit suites | `executor-config.vitest.ts` + `fanout-run.vitest.ts` fully green | PASS — 180/180 (orchestrator-run) |
| Surface parity | 7/7 new ids + `swe` default present in BOTH allowlist surfaces | PASS (grep) |
| Additive-only | No pre-existing id removed | PASS (allowlist pin retains all prior aliases) |
| Fail-closed proof | Rejection test uses a genuinely off-list id | PASS (`kimi-k3-high`) |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The deep-loop runtime enforces per-executor model allowlists before any CLI command is constructed. For cli-devin there are two surfaces: the typed source of truth (`DEVIN_SUPPORTED_MODELS` / `DEVIN_DEFAULT_MODEL` in `executor-config.ts`) and a duplicated plain-JS copy inside `scripts/fanout-run.cjs` (kept because the CJS dispatcher does not import the TS module). Both must change together; the mirror now carries a comment stating it must track the TS source. De-duplicating the two behind one import was deliberately rejected as an out-of-scope refactor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Brief construction

Read the live allowlist source and every vitest pin, and confirm the concurrent 043 lane quiet, so the dispatch brief lists exact edits with zero creative latitude.

### Phase 2: Dispatched implementation

First SOL pass edits `executor-config.ts` + `fanout-run.vitest.ts`; it stops at its scope boundary on discovering the duplicated list in `fanout-run.cjs`. After authorization, the second SOL pass aligns the mirror. Result: 180/180 green in the executor's run.

### Phase 3: Independent verification

Orchestrator re-runs both suites and greps both surfaces for the seven ids, the `swe` default, and the additive property; packet docs record evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` from the runtime root, run by the orchestrator — not only by the executor
- Content greps: all seven ids present in BOTH surfaces; `DEVIN_DEFAULT_MODEL` is `swe` in both
- Additive check: the allowlist expectation still contains every pre-existing alias
- `node --check` on the edited CJS script
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Live `devin models list` (authenticated) — the provenance for all seven ids; no id inferred from documentation
- The curated cli-devin catalog (`providers-and-models.md`) — the parity target
- Quiet 043 lane — the concurrent fan-out-parity program edits the same file; verified clean before implementing
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single revert of the runtime commit restores the prior allowlist and `adaptive` default; the change is additive and test-pinned, so a revert cannot strand any config that worked before this packet. No data, schema, or persisted state is involved.
<!-- /ANCHOR:rollback -->
