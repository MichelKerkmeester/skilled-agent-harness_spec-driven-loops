---
title: "Decision Record: Runtime config mk-code-index parity plus findings"
description: "Decision record for the mk-code-index server-id parity fix and bounded remediation strategy."
trigger_phrases:
  - "016 decision record"
  - "mk-code-index decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings"
    last_updated_at: "2026-05-14T19:27:55Z"
    last_updated_by: "codex"
    recent_action: "Accepted config identity and bounded remediation decisions"
    next_safe_action: "Use deferred packet names for broad P2 fixes"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:4444444444444444444444444444444444444444444444444444444444444444"
      session_id: "016-runtime-config-mk-code-index-parity-plus-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Runtime config mk-code-index parity plus findings

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use `mk_code_index` for runtime config identity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex, operator directive |

---

<!-- ANCHOR:adr-001-context -->
### Context

The rename commit present locally is `50cfabb6e2 fix(010): rename MCP server system_code_graph -> mk-code-index`. Its body states that the runtime server is now `mk-code-index`, the client config key is `mk_code_index`, and tool names such as `code_graph_scan` remain unchanged.

### Constraints

- Only the server id rename is allowed. Tool IDs and `SPECKIT_CODE_GRAPH_*` env vars are locked.
- The `.opencode/skills/system-code-graph/` directory slug remains `system-code-graph`.
- `.claude/mcp.json` was already aligned and should not be churned.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: update stale runtime config mirrors to `mk_code_index` and `.opencode/bin/mk-code-index-launcher.cjs`.

**How it works**: Each runtime keeps its native config shape. Only the code-graph server block key, launcher path, and namespace note change where stale. Other MCP blocks stay untouched.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rename stale mirrors only** | Matches canonical runtime identity and minimizes diff | Requires recording why `.claude` has no diff | 9/10 |
| Rename tool IDs too | Superficially aligns all names | Forbidden and would break stable tool contracts | 0/10 |
| Leave configs mixed | No edit risk | Keeps runtime clients split across old and new identities | 2/10 |

**Why this one**: The rename packet already established the split: skill slug remains `system-code-graph`, runtime identity becomes `mk-code-index`, and config key becomes `mk_code_index`.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- OpenCode, Codex, Gemini, and Claude configs now converge on one runtime server id.
- OpenCode MCP smoke shows `mk_code_index` connected.

**What it costs**:
- Existing local runtime sessions may need reconnect to pick up the new config key. Mitigation: restart or reconnect MCP servers.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Runtime client expects old key | Medium | Rename commit already removed the old launcher; smoke the available OpenCode path. |
| Scope creep into tool IDs | High | Keep stable tool IDs unchanged. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three runtime mirrors still used legacy identity. |
| 2 | **Beyond Local Maxima?** | PASS | Compared key-only, tool-rename, and no-op options. |
| 3 | **Sufficient?** | PASS | Minimal config-block changes. |
| 4 | **Fits Goal?** | PASS | Directly addresses Track A. |
| 5 | **Open Horizons?** | PASS | Leaves tool IDs stable for consumers. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `opencode.json`, `.codex/config.toml`, and `.gemini/settings.json` now use `mk_code_index`.
- Namespace notes now reference `mcp__mk_code_index__*`.

**How to roll back**: revert commit `2ad7f79fa`, then run JSON/TOML parse checks and `opencode mcp list`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Fix bounded findings and name broad P2 follow-ons

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex, operator directive |

---

<!-- ANCHOR:adr-002-context -->
### Context

The operator asked to fix all findings, but also constrained this dispatch to surgical work. The 017 report has 1 P1 and 19 P2 findings; the local 048 report has 2 P1 and 12 P2 findings, not the 5 P1 and 16 P2 counts named in the dispatch.

### Constraints

- P1 findings must be fixed or named-deferred.
- P2 findings are opportunistic when the fix is under roughly 10 LOC.
- Broad parser, env, logging flag, and runner refactor work should not be squeezed into this packet.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: close already-fixed P1s from current source evidence, apply bounded P2 fixes, and defer broader P2 clusters by name.

**How it works**: The implementation summary lists each finding outcome. Commits contain only config/source/doc changes that are scoped to the reviewed findings.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bounded fixes plus named deferrals** | Maximizes safe closure and preserves traceability | Leaves broad P2 work for follow-up | 9/10 |
| Attempt all P2s now | Highest apparent closure count | High regression risk in evidence runner and parser | 4/10 |
| P1-only remediation | Very safe | Ignores operator intent to close practical P2s | 6/10 |

**Why this one**: It satisfies P1 requirements and closes practical P2s without turning a parity packet into a runner-hardening rewrite.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- 048 traceability docs now match shipped two-client wiring.
- Runner error detection catches more common MCP failure shapes.
- Remaining P2 work is visible and grouped.

**What it costs**:
- Some P2 findings remain deferred. Mitigation: use the named follow-on packets.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Local report count differs from dispatch | Low | Record count mismatch and use checked-in report truth. |
| Deferred work is forgotten | Medium | Include packet names in binding trace. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Reports still carried active findings. |
| 2 | **Beyond Local Maxima?** | PASS | Considered all-now and P1-only approaches. |
| 3 | **Sufficient?** | PASS | Fixes are small and targeted. |
| 4 | **Fits Goal?** | PASS | Directly addresses Track B. |
| 5 | **Open Horizons?** | PASS | Follow-on packets keep broad hardening available. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `b74e0c95e` closes bounded review findings.
- `implementation-summary.md` records fixed, already-fixed, accepted, and deferred outcomes.

**How to roll back**: revert `b74e0c95e` and the final packet-doc commit, then restore the previous finding ledger.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
