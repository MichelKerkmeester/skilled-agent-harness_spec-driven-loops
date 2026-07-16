---
title: "Implementation Summary: Runtime config mk-code-index parity plus findings"
description: "Close-out ledger for packet 016 runtime config parity and deep-review finding remediation."
trigger_phrases:
  - "016 implementation summary"
  - "runtime config mk-code-index findings summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings"
    last_updated_at: "2026-05-14T19:27:55Z"
    last_updated_by: "codex"
    recent_action: "Packet implemented and verified"
    next_safe_action: "Operator may review commits and push"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:5555555555555555555555555555555555555555555555555555555555555555"
      session_id: "016-runtime-config-mk-code-index-parity-plus-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "048 local report contains 2 P1 and 12 P2 findings; counts differ from dispatch text."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Runtime config mk-code-index parity plus findings

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings` |
| **Completed** | 2026-05-14 |
| **Level** | 3 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 016 closes the runtime identity gap left by the `mk-code-index` rename and turns two review reports into an actionable ledger. The available runtime smoke now shows `mk_code_index` live in OpenCode, and every P1 finding in the checked-in reports is either already fixed in current source or fixed by this dispatch.

### Track A: Runtime Config Parity

Updated the three stale runtime mirrors: `opencode.json`, `.codex/config.toml`, and `.gemini/settings.json`. `.claude/mcp.json` was already aligned, so it was verified and left unchanged. All four configs now use `mk_code_index`, the launcher path `.opencode/bin/mk-code-index-launcher.cjs`, and `mcp__mk_code_index__*` namespace language.

### Track B: Deep-Review Finding Remediation

The 017 report was mostly already remediated in current source. This dispatch added the remaining bounded launcher fallback fix for F012 and recorded the non-bounded architecture/source-map items as follow-on work.

The local 048 report contains 2 P1 and 12 P2 findings, not the 5 P1 and 16 P2 counts in the dispatch text. Current `HEAD` already had the two P1 fixes: a null-client cleanup guard and a 60s `client.connect()` timeout. This dispatch closed five P2 items: broader MCP error-pattern detection, primary-key routing test coverage, handover status, formal two-client requirements, and the two-transport trade-off note.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work landed in logical commits. `2ad7f79fa` handles runtime config parity. `b74e0c95e` handles bounded finding fixes. The final packet-doc commit records decisions, tasks, checklist evidence, metadata, and strict validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `mk_code_index` as the config key | The local rename commit body establishes `mk-code-index` as the server name and `mk_code_index` as the config/client key. |
| Keep tool IDs unchanged | The operator explicitly locked `code_graph_*`, `detect_changes`, and `ccc_*`. |
| Count 048 findings from the checked-in report | The report file is the local source of truth and lists 2 P1 plus 12 P2 findings. |
| Defer broad P2 clusters | Safe tokenizer replacement, env allowlisting, stderr flagging, result aggregation, and runner extraction are larger than bounded fixes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git show 50cfabb6e2 --stat` | PASS: local rename commit found; requested SHA `7cfc16ed9` absent. |
| Config legacy grep | PASS: no `system_code_graph` or `system-code-graph-launcher` matches in the four runtime configs. |
| JSON parse | PASS: `opencode.json`, `.claude/mcp.json`, and `.gemini/settings.json` parse with Node/JSON tooling. |
| TOML parse | PASS: `.codex/config.toml` parses with Python 3.11 `tomllib`. |
| OpenCode MCP smoke | PASS for target: `mk_code_index` connected through `.opencode/bin/mk-code-index-launcher.cjs`; unrelated `system_skill_advisor` failed and was not in scope. |
| Launcher syntax | PASS: `node --check .opencode/bin/mk-code-index-launcher.cjs`. |
| Runner syntax | PASS: `node --check _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs`. |
| Focused helper test | PASS: `npx vitest run tests/shared-daemon-runner-helpers.vitest.ts` from `mcp_server`, 1 file / 2 tests. |
| 045 strict validation | PASS: `validate.sh .../046-shared-daemon-suite-runner --strict`, 0 errors and 0 warnings. |
| 016 strict validation | PASS after packet close-out. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **048 count mismatch.** The dispatch says 5 P1 and 16 P2, but the checked-in report and registry contain 2 P1 and 12 P2. Counts in this packet use the checked-in report.
2. **Unrelated MCP failure.** `opencode mcp list` showed `system_skill_advisor` failed with connection closed. This packet did not edit advisor surfaces because the dispatch forbids advisor-server/lib changes.
3. **Pre-existing dirty runtime state remains unstaged.** Launcher timestamp JSON and search-decision logs changed during local MCP/tool startup; they are not part of the logical commits.
4. **Broad P2 work is deferred.** See the named follow-on packets below.
<!-- /ANCHOR:limitations -->

---

## Finding Ledger

### 017 Review Report

| Class | Findings | Outcome |
|-------|----------|---------|
| P1 fixed | F002 | Fixed in current `SKILL.md` naming convention note. |
| P1 deferred | None | No P1 deferral. |
| P2 fixed or accepted as fixed | F001, F003, F004, F005, F007, F008, F009, F010, F012, F013, F014, F015, F016, F018, F019, F020 | Current source/docs plus `b74e0c95e` close these bounded findings. |
| P2 deferred | F006, F011, F017 | Defer to `017-system-code-graph-architecture-and-artifact-policy`. |

### 048 Review Report

| Class | Findings | Outcome |
|-------|----------|---------|
| P1 fixed | F001, F002 | Already fixed in current runner before this packet: null-client cleanup guard and connect timeout. |
| P1 deferred | None | No P1 deferral. |
| P2 fixed | F004, F008, F009, F010, F011 | Fixed by `b74e0c95e`. |
| P2 deferred | F003, F005, F006, F007, F012, F013, F014 | Defer to `049-shared-daemon-runner-hardening` and `050-shared-daemon-test-hygiene`. |

## Deferred Follow-On Packets

| Packet | Findings | Scope |
|--------|----------|-------|
| `017-system-code-graph-architecture-and-artifact-policy` | 017 F006/F011/F017 | Restore/refresh architecture artifact policy and decide source-map path normalization. |
| `049-shared-daemon-runner-hardening` | 048 F003/F005/F006/F007/F014 | Safe argument parser, env allowlist, stderr opt-out, result aggregation, and runner phase extraction. |
| `050-shared-daemon-test-hygiene` | 048 F012/F013 | Broaden helper tests and resolve deep relative import strategy. |

## Binding Trace

```text
AGENT_RECEIVED=findings-sweep
RESULT=PASS
COMMITS=2ad7f79fa,b74e0c95e,packet-closeout-commit
PACKET_SCAFFOLDED=YES
TRACK_A_CONFIGS_FIXED=4
TRACK_A_LAUNCHER_RENAMED=N_A
TRACK_B_P1_017_FIXED=1
TRACK_B_P1_017_DEFERRED=0
TRACK_B_P1_048_FIXED=2
TRACK_B_P1_048_DEFERRED=0
TRACK_B_P2_017_FIXED=16
TRACK_B_P2_048_FIXED=5
TRACK_B_P2_017_DEFERRED=3
TRACK_B_P2_048_DEFERRED=7
DEFERRED_PACKETS=017-system-code-graph-architecture-and-artifact-policy,049-shared-daemon-runner-hardening,050-shared-daemon-test-hygiene
STRICT_VALIDATE_016=PASS
OPENCODE_MCP_SMOKE=PASS
FILES_OUT_OF_SCOPE=0
PRODUCTION_BUG_FOUND=no
PUSH_TO_ORIGIN=NO
NOTES=048 local report count differs from dispatch; broad P2 runner/security/refactor work deferred by named packet.
```


These three follow-on packets were deferred indefinitely; if/when reopened, they should be created under the current track structure. WAIVED 2026-05-21.
