---
title: "Implementation Summary: 103 - 101 cli-opencode regression remediation"
description: "Resolved 2 P1 regressions + 3 of 4 P2 advisories from packet 102 deep-review."
trigger_phrases:
  - "103 implementation"
  - "101 regression fix summary"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/008-remediation"
    last_updated_at: "2026-05-08T20:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "6 fixes landed; P2-032 closed via 096/009 cleanup packet"
    next_safe_action: "Track release-ready; optional deep-review #3 to confirm verdict-flip"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 103 - 101 cli-opencode regression remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/008-remediation` |
| **Completed** | 2026-05-08 |
| **Level** | 2 |
| **Findings resolved** | P1-027, P1-028, P2-027, P2-027r, P2-028, P2-032 (6 of 6 — P2-032 closed via 096/009 cleanup packet on 2026-05-08) |
| **Deferred** | None |
| **Actual Effort** | ~30 minutes wall-clock |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### P1-027 — `--pure` flag added to all 4 if_cli_opencode YAML branches

Inserted `--pure` line into each of:
- `commands/speckit/assets/speckit_deep-review_auto.yaml`
- `commands/speckit/assets/speckit_deep-review_confirm.yaml`
- `commands/speckit/assets/speckit_deep-research_auto.yaml`
- `commands/speckit/assets/speckit_deep-research_confirm.yaml`

Position: after `--dangerously-skip-permissions`, before `{optional_variant_flag}`. Now opencode runs with plugin tools stripped, so DeepSeek-family models accept the tool list (no more `:` separator violation). The `executor_fallback` to native that occurred during the 102 dispatch is no longer triggered.

### P1-028 — `sandboxMode` removed from EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']

`mcp_server/lib/deep-loop/executor-config.ts:37-41` updated:

```typescript
// cli-opencode: opencode run --variant <high|medium|minimal> maps to reasoningEffort.
// sandboxMode is NOT supported — opencode CLI has no read-only equivalent and the
// YAML branches always pass --dangerously-skip-permissions. Including sandboxMode
// here without a runtime branch would be a schema-runtime contract violation
// (see packet 102 P1-028); reject it like we reject serviceTier for non-codex.
'cli-opencode': ['model', 'reasoningEffort', 'timeoutSeconds'],
```

Now `parseExecutorConfig({kind:'cli-opencode', sandboxMode:'read-only'})` throws an explicit error. Authorization-surface defect closed: operator no longer gets silent no-op when requesting read-only mode.

### P2-027/P2-027r — cli-opencode advisor scoring lane disambiguation

`mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:240-246`: added regex pattern that matches "cli-opencode", "cli opencode", "opencode-cli", or "opencode cli" and routes to the cli-opencode skill at +0.9 boost while suppressing sk-code by -0.5. Bare "opencode" (without cli prefix) continues to route to sk-code via the existing `opencode` token boost.

Verified via `python3 skill_advisor.py "use cli-opencode for dispatch"` — local fallback path returns cli-opencode at 0.95 confidence (was empty pre-fix).

Note: native advisor bridge has a separate stale-state issue that's not surfaced by this fix; the local fallback (which is the default path) routes correctly. Native bridge is observability-only and tracked as advisory.

### P2-028 — 4 cli-opencode unit-test cases added

`mcp_server/tests/deep-loop/executor-config.vitest.ts`: added 4 tests after the cli-gemini whitelist sanity check:

1. `accepts a cli-opencode executor with a model and reasoningEffort variant`
2. `rejects sandboxMode for cli-opencode because the kind does not support read-only`
3. `rejects serviceTier for cli-opencode (no opencode equivalent)`
4. `accepts cli-opencode without a model (no whitelist enforcement)`

Test count: 21 → 25 (all pass).

### P2-032 — Closed via 096/009 cleanup packet (2026-05-08)

102's `review/deep-review-strategy.md` previously claimed `aliases.ts` was touched by 101, but 101's implementation-summary did not list it. Cosmetic drift in a review artifact; no runtime behavior affected. Closed by `096/009-p2-032-cleanup`: three stale references removed (surface count "6 → 5", line-33 inventory bullet, line-57 cross-reference target, line-100 meta-evidence count). Iter-narrative mentions of aliases.ts were preserved as audit trail of the original false-claim discovery.

### Files Changed

| File | Change Type | Finding |
|------|-------------|---------|
| `commands/speckit/assets/speckit_deep-review_auto.yaml` | Modified | P1-027 (--pure inserted) |
| `commands/speckit/assets/speckit_deep-review_confirm.yaml` | Modified | P1-027 |
| `commands/speckit/assets/speckit_deep-research_auto.yaml` | Modified | P1-027 |
| `commands/speckit/assets/speckit_deep-research_confirm.yaml` | Modified | P1-027 |
| `mcp_server/lib/deep-loop/executor-config.ts:37-41` | Modified | P1-028 (sandboxMode removed) |
| `mcp_server/dist/**` | Regenerated | P1-028 |
| `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:240-246` | Modified | P2-027/P2-027r |
| `mcp_server/tests/deep-loop/executor-config.vitest.ts` | Modified | P2-028 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct Edit + Python script for the 4-YAML --pure insertion (anchor: each block already had `--dangerously-skip-permissions`/`--dir`/`{optional_variant_flag}` pattern, so a 3-line replace was deterministic). executor-config.ts edit was a single one-line sandboxMode removal. explicit.ts added a 4-line regex block in the disambiguation section. Tests added inline using existing test patterns. Rebuilt mcp_server dist; ran 25-test vitest suite + 33-test executor-config + executor-audit suite; all pass. Smoke-tested local advisor for cli-opencode trigger.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Remove sandboxMode rather than implement read-only branch | OpenCode CLI has no read-only equivalent. Removing matches the parser's existing reject-pattern for unsupported fields (e.g., serviceTier-for-cli-claude-code). Cleaner than adding stub-only support |
| Use regex disambiguation for cli-opencode (not single-token) | tokenize() splits on `\b\w+\b` which doesn't include `-`. Single-token boost would require adding a new word. Regex matches the natural CLI-orchestrator phrasing |
| Add 4 test cases in one block | Unit-test coverage gap for cli-opencode was P2-028's specific ask; 4 cases cover the main parse paths (accept default, reject sandboxMode, reject serviceTier, accept no-model) |
| Defer P2-032 then close via 096/009 (cosmetic strategy doc drift) | Strategy doc is in 102 review artifact; doesn't affect any runtime behavior. Closed in a follow-on cleanup packet on 2026-05-08 once track was otherwise release-ready. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| --pure in all 4 YAMLs | Pass | grep returns 1 hit per file inside if_cli_opencode block |
| sandboxMode rejected for cli-opencode | Pass | Smoke test: BLOCKED with "field 'sandboxMode' is not supported by executor kind 'cli-opencode'" |
| executor-config tests pass | Pass | 25/25 vitest |
| executor-audit tests pass | Pass | 33/33 combined run still green |
| cli-opencode advisor routing | Pass | local fallback returns cli-opencode @ 0.95 for "use cli-opencode for dispatch" |
| Bare "opencode" still routes sk-code | Pass | preserved via existing opencode token boost |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| NFR-P01 | All edits + rebuild < 5 min | ~3 min | Pass |
| NFR-S01 | sandboxMode authorization defect closed | Verified | Pass |
| NFR-R01 | 25 tests pass | All pass | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P2-032 cosmetic strategy-doc drift — CLOSED via 096/009** — Three stale aliases.ts references removed from 102's strategy doc and continuity blockers cleared on 2026-05-08.
2. **Native advisor bridge has stale-state issue** — surfaced during P2-027r verification but is a separate observability concern (the local fallback works correctly, which is the default path). Not a release-blocker.
3. **No adversarial test fixture for the YAML --pure correctness** — relies on schema validation in executor-config + manual smoke test. A dedicated YAML-resolver test would lock the contract.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

(none)
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Packet 103 resolves 5 of 6 findings from packet 102 deep-review (2 P1s + 3 P2s) at ship time. The remaining cosmetic P2-032 was closed in 096/009 on 2026-05-08, taking the count to 6 of 6. All 25 executor-config tests + 33 combined executor tests pass. cli-opencode is now correctly wired with --pure flag for DeepSeek-family compatibility, sandboxMode rejection, advisor disambiguation, and unit-test coverage. Track is release-ready pending optional final deep-review #3.
<!-- /ANCHOR:summary -->

---

## Followups

- ~~**P2-032 strategy-doc drift cleanup**~~ — Closed via `096/009-p2-032-cleanup` on 2026-05-08.
- **Native advisor bridge stale-state** (advisory; observability): investigate why native bridge returns [] for explicit-lane matches that local fallback handles correctly.
- **YAML resolver adversarial test fixture** (advisory): dedicated test proving the if_cli_opencode branch resolves correctly with valid + invalid configs.
