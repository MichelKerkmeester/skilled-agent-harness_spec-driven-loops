---
title: "Implementation Summary: OpenCode Transform Dedup"
description: "Implemented stable-message-identity dedup for OpenCode system transforms, with flag-off parity and multi-transform receipts."
trigger_phrases:
  - "OpenCode transform dedup implementation"
  - "message identity resolver"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/003-opencode-transform-dedup"
    last_updated_at: "2026-08-06T14:16:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the shared identity resolver and two plugin dedup gates"
    next_safe_action: "Review the downstream phase against the shipped helper API"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: OpenCode Transform Dedup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-opencode-transform-dedup |
| **Completed** | 2026-08-06 - scoped implementation complete in this worktree; packet metadata refresh remains blocked by file scope |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared helper now resolves a stable `{sessionId, messageId, transformCallOrdinal}` identity without consulting prompt text, hashes contributions with the existing canonical policy-block algorithm, and tracks delivered/suppressed contributions in process-local state. Both OpenCode transforms use the same state only when deduplication is explicitly enabled; unresolved identities fall open to the existing full-delivery path.

### Shipped Files

| File | Planned Action | Purpose |
|------|-----------------|---------|
| `.opencode/plugins/lib/opencode-message-identity.js` | Created | Shared identity resolver, canonical block hashing, dedup tracker, lifecycle cleanup, and multi-transform receipt accessors (`:169`, `:285`, `:303`) |
| `.opencode/plugins/mk-skill-advisor.js` | Modified | Independent flag, canonical block gates before every system append, and session cleanup (`:327`, `:576`, `:908`, `:933`, `:945`) |
| `.opencode/plugins/mk-spec-memory.js` | Modified | Independent flag, continuity-block gate, and session cleanup (`:120`, `:276`, `:507`, `:527`) |
| `.opencode/plugins/tests/mk-skill-advisor.test.cjs` | Modified | Same/distinct/flag-off/fail-open fixtures plus multi-transform receipt assertions (`:525-661`) |
| `.opencode/plugins/tests/mk-spec-memory.test.cjs` | Modified | Same/distinct/flag-off/fail-open continuity fixtures (`:411-532`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The flag is `deduplicateTransforms` or `MK_OPENCODE_TRANSFORM_DEDUP=1`; both default to off (`mk-skill-advisor.js:327-328`, `mk-spec-memory.js:120-121`). When enabled, each contribution is keyed by resolved message identity plus the canonical block ID and content hash. The first matching contribution is delivered, later duplicates are suppressed, and every recorded fire is available through the detached multi-transform receipt (`opencode-message-identity.js:285-316`).

The advisor maps its brief, fallback, and compiled-route entries to the canonical policy IDs (`mk-skill-advisor.js:926-952`). The continuity plugin maps its brief to the registered continuity block (`mk-spec-memory.js:507-515`). If identity or canonical hashing cannot be resolved, the gate returns the delivery-open result without recording suppression (`opencode-message-identity.js:169-175`, `mk-skill-advisor.js:577-580`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Identity from session + message/turn ID + ordinal, never prompt text | Research.md's Eliminated Alternatives explicitly rules out content-hash-alone dedup - identical text can be a genuinely distinct message |
| Fail-open (no suppression) when identity cannot be resolved | Matches the parent program's guardrail-preserving principle; an unresolvable identity must never become an excuse to drop a delivery |
| Shared resolver module consumed by both plugins, not duplicated logic | A cross-plugin duplicate can only be detected if both plugins check the same dedup state; independent per-plugin implementations could not see each other's deliveries |
| Keep the new flag independent and off by default | Existing output is byte-preserved until an operator opts into same-message dedup |
| Reuse the canonical block registry and hash algorithm | Dedup keys remain aligned with the policy planner instead of inventing a second block identity scheme |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Same-message duplicate suppression in both plugins | PASS - focused Node command: `ℹ tests 6`, `ℹ pass 6`, `ℹ fail 0`; fixtures at `mk-skill-advisor.test.cjs:525-553` and `mk-spec-memory.test.cjs:411-451` |
| Distinct-message-identical-text non-suppression in both plugins | PASS - focused Node command: `ℹ tests 6`, `ℹ pass 6`, `ℹ fail 0`; fixtures at `mk-skill-advisor.test.cjs:555-576` and `mk-spec-memory.test.cjs:452-482` |
| Identity-resolution-failure fail-open in both plugins | PASS - full Node command: `ℹ tests 42`, `ℹ pass 42`, `ℹ fail 0`; fixtures at `mk-skill-advisor.test.cjs:597-625` and `mk-spec-memory.test.cjs:513-532` |
| Flag-off byte-identical parity in both plugins | PASS - focused Node command: `ℹ tests 6`, `ℹ pass 6`, `ℹ fail 0`; fixtures at `mk-skill-advisor.test.cjs:578-595` and `mk-spec-memory.test.cjs:484-511` |
| Multi-transform receipt records both transforms and outcomes | PASS - `mk-skill-advisor.test.cjs:627-661`; direct state fixture records `mk-skill-advisor/delivered` and `mk-spec-memory/suppressed_duplicate` |
| Canonical policy-plan regression | PASS - policy-plan Vitest: `Test Files 2 passed (2)`, `Tests 37 passed (37)` |
<!-- /ANCHOR:verification -->

### Required Command Output

```text
node --test .opencode/plugins/tests/mk-skill-advisor.test.cjs .opencode/plugins/tests/mk-spec-memory.test.cjs
ℹ tests 42
ℹ pass 42
ℹ fail 0

npm test -- tests/policy-plan.vitest.ts tests/parity/policy-plan-serializer-parity.vitest.ts
> test
> vitest run tests/policy-plan.vitest.ts tests/parity/policy-plan-serializer-parity.vitest.ts
Test Files 2 passed (2)
Tests 37 passed (37)

node --test --test-name-pattern='^(same-message advisor|distinct advisor|flag-off advisor|same-message continuity|distinct continuity|flag-off continuity)'
ℹ tests 6
ℹ pass 6
ℹ fail 0
```

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The flag remains off by default.** Production activation requires `deduplicateTransforms: true` or `MK_OPENCODE_TRANSFORM_DEDUP=1`.
2. **Unresolvable OpenCode identity fails open.** The helper never falls back to prompt-text hashing, so some host shapes will continue to receive full delivery until they expose all three identity components.
3. **Repository-wide drift guards remain noisy.** `run-all-drift-guards.sh` failed on 472 alignment findings outside this phase; the scoped alignment check over `.opencode/plugins` passed with `Findings: 0`, `Errors: 0`, `Warnings: 0`, router-sync passed 10/10, and stack-folder checks passed. The Codex hook installer also reports global hook drift (8 missing, 8 command mismatches, 7 orphaned); no hook files were changed.
4. **No commit was created.** The requested result is left in the current worktree for the operator's existing branch workflow.
5. **Strict packet validation is not green.** `validate.sh ... --strict` reports one `GENERATED_METADATA_INTEGRITY` violation because `description.json` and `graph-metadata.json` still contain hashes from before the required checklist and summary edits. Those generated metadata files are outside the requested change set and were not modified.
<!-- /ANCHOR:limitations -->
