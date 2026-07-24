---
title: "Feature Specification: Devin MCP-host integration"
description: "Register this repo's 3 MCP servers (spec-kit-memory, code-graph, skill-advisor) with Devin CLI's native devin mcp surface, using a two-tier deny-by-default permission policy, resolving Open Question 3."
trigger_phrases: ["devin mcp host integration", "devin mcp config", "devin mcp permission policy"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/009-devin-mcp-host-integration"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase 009 spec/plan/tasks/checklist/decision-record"
    next_safe_action: "Wait for phase 001 (already Complete), then live-verify devin mcp surface"
    blockers: ["devin auth login needs an interactive OAuth flow"]
    key_files: ["../research/research.md", "../001-devin-contract-pin/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does Devin normalize hyphenated server IDs to underscores in emitted tool names?", "Which embedding tier is reliable in Devin's sandbox without Ollama?"]
    answered_questions: ["Research already confirmed protocol fit is direct - all 3 servers are stdio-only, matching Devin's devin mcp add -- <command> shape."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Devin MCP-host integration

## EXECUTIVE SUMMARY
Resolves Open Question 3 in the parent `spec.md`: Devin CLI's `devin mcp add/list/get/remove/enable/disable` surface can genuinely host this repo's 3 MCP servers, but the integration is host-level, not CLI-executor-level, and gets its own additive phase rather than being folded into 002-008. The central risk is trust: Devin's MCP permission matchers cannot substitute for server-side trust, so this phase's default posture is deny-by-default for every mutation tool, with an explicit maintainer-only opt-in tier for anyone who accepts that risk.

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `001-devin-contract-pin` |
| **Successor** | None |
| **Handoff Criteria** | All 3 servers registered and live-discoverable via `devin mcp list` + `tools/list`; every mutation tool denies by default; a maintainer-only opt-in path exists and is never silently inherited. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo runs 3 stdio MCP servers (spec-kit-memory, code-graph, skill-advisor) that every other CLI executor (Claude Code, OpenCode) can already reach. Devin CLI has never been wired to them. The `009-devin-mcp-host-integration` research already confirmed the protocol fit is direct - no HTTP/SSE wrapper needed - but flagged that Devin's MCP permission matchers cannot replace server-side trust: `mk-skill-advisor`'s `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` (a boundary designed for OpenCode's transport model) must never be copied into shared Devin config, and `mk-spec-memory` has no independent caller-trust gate at all.

### Purpose
Register all 3 servers under a two-tier permission policy: a shared, committed project config with exact per-tool read-only allows and explicit mutation denies, plus a maintainer-local, gitignored override for anyone who explicitly accepts the mutation risk. Verify the policy live against a real Devin session before considering this phase done - not just schema-correct on paper.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.devin/config.json` (project-level, committed): 3 stdio `mcpServers` entries + exact per-tool read-only permission allows + explicit deny/ask for every enumerated mutation tool.
- `.devin/config.local.json.example` (committed template only): the maintainer-local Tier 2 shape, never the real file.
- `.gitignore` update protecting the real `.devin/config.local.json`.
- Live verification: `tools/list` discovery, deny-rule enforcement, deny-survival against a broader session-level grant, cross-session-mode launcher resolution, cold-bootstrap evidence, rollback test.
- Re-evaluating `008-devin-hook-parity`'s `mcp-route-guard.cjs` dormancy now that real MCP servers exist.
- A new reference doc (`cli-devin/references/mcp-host-integration.md`) documenting the policy, acceptance matrix, and rollback steps.

### Out of Scope
- Any CLI-executor or hook-adapter concern - those live in phases 002-008.
- `devin mcp login`/`logout` - none of the 3 local servers use OAuth.
- HTTP/SSE wrappers - all 3 servers are stdio-only, no protocol gain from wrapping.
- Copying `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` into any shared/committed Devin config file.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.devin/config.json` | Created | Tier 1 shared project config: 3 stdio entries + exact permission allows/denies |
| `.devin/config.local.json.example` | Created | Tier 2 template only, never the real file |
| `.gitignore` | Modified | Protect the real `.devin/config.local.json` |
| `cli-external-orchestration/cli-devin/references/mcp-host-integration.md` | Created | Policy, acceptance matrix, rollback docs |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | All 3 servers registered as stdio `mcpServers` entries pointing at their existing `.opencode/bin/*-launcher.cjs` scripts. | P0 |
| REQ-002 | Every mutation tool across all 3 servers, enumerated from a live `tools/list` call (not just source inspection), gets an explicit deny/ask entry. | P0 |
| REQ-003 | `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` never appears in `.devin/config.json` (the committed, shared file). | P0 |
| REQ-004 | `.devin/config.local.json` is gitignored and never committed. | P0 |
| REQ-005 | Every Tier 1 permission entry is an exact per-tool allow (`mcp__<server>__<tool>`) - no server-wide or global wildcard. | P0 |
| REQ-006 | A project-level deny is confirmed live to survive a broader session-level "allow all on this server" grant. | P0 |
| REQ-007 | Namespace normalization (hyphen vs. underscore in server IDs) is confirmed live before deny rules are treated as final. | P1 |
| REQ-008 | An embedding tier for `mk-spec-memory` is explicitly chosen and verified reachable in Devin's sandbox, with no silent dependency on a developer laptop's local Ollama daemon. | P1 |
| REQ-009 | The 3 launchers resolve from repo root across fresh, resumed, sandboxed, and handed-off Devin session modes. | P1 |
| REQ-010 | `008-devin-hook-parity`'s `mcp-route-guard.cjs` dormancy note is re-evaluated now that real MCP servers exist. | P2 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- SC-001: All 3 servers discoverable via live `devin mcp list` + `tools/list`.
- SC-002: A live attempt at any enumerated mutation tool without Tier 2 opt-in is denied or asked, never silently allowed.
- SC-003: Rollback (disable/remove all 3 entries) leaves every repository database and source file untouched.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **R-001**: Devin's MCP config has no `cwd` field; all 3 launchers assume repo-root invocation. Mitigation: REQ-009 verifies across all 4 session modes before this is trusted.
- **R-002**: Cold-bootstrap native modules (`better-sqlite3`, `sqlite-vec`, tree-sitter/WASM) may not build cleanly on Devin's Linux sandbox. Mitigation: verified live, not assumed from macOS-local success.
- **R-003**: `mk-spec-memory`'s embedding cascade (Ollama → hf-local → cloud) may have no Ollama available under Devin. Mitigation: REQ-008 makes an explicit, verified choice rather than an implicit fallback.
- **R-004 (highest)**: Devin's MCP permission matchers cannot replace server-side trust for `mk-spec-memory` (no independent caller-trust gate exists there). Mitigation: REQ-002/REQ-003 make deny-by-default the hard default, never an assumption.
- **Dependency**: This phase depends only on `001-devin-contract-pin` (Complete). It does not depend on 002-008, per the research's own "Eliminated Alternatives" analysis. Shares the packet-wide `devin auth login` blocker for live verification.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- NFR-P01: No silent dependency on a developer's local daemon (e.g. Ollama) that Devin's sandbox may lack.

## 8. EDGE CASES
- A session-level "allow all tools on this server" grant must not override the project-level deny for mutation tools (REQ-006).
- `mk-skill-advisor`'s startup scan/watcher must not silently assume trusted-caller status the way it does under OpenCode's transport metadata.
- A fresh Devin session, a resumed one, a sandboxed one, and a cloud-handoff session must all resolve the 3 launchers identically.

## 9. COMPLEXITY ASSESSMENT
Medium-high - host-level integration work is more contained than phase 008's hook-adapter work (config + policy, not code delegation), but carries a genuine security-relevant trust-boundary decision (R-004) that must not be gotten wrong.

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Mutation trust boundary copied incorrectly from OpenCode's model | Low (explicitly guarded by REQ-003) | High | Grep-verifiable hard gate; live-tested denial |
| Cold-bootstrap fails on Devin's Linux sandbox | Medium | Medium | Live-verified, not assumed |
| Embedding tier silently depends on a missing local daemon | Medium | Medium | Explicit tier choice + verification (REQ-008) |

## 11. USER STORIES
- As a maintainer, I want Devin to be able to search this repo's spec memory and code graph the same way Claude Code and OpenCode already can.
- As a security-conscious maintainer, I want mutation tools denied by default under Devin, with an explicit, auditable opt-in path only I control.

## 12. OPEN QUESTIONS
- Does Devin normalize hyphenated server IDs (e.g. `mk-spec-memory`) to underscores in emitted tool names, and do deny rules need to match the normalized form? (REQ-007)
- Which embedding tier is reliable and acceptable in Devin's sandbox, especially without an available Ollama daemon on first start? (REQ-008)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (this phase)
- `../research/research.md` (source research, esp. §7 recommended phase shape, §7.3 two-tier policy)
- `../001-devin-contract-pin/implementation-summary.md` (predecessor, live Devin contract)
- `../008-devin-hook-parity/spec.md` (re-evaluates `mcp-route-guard.cjs` dormancy)
