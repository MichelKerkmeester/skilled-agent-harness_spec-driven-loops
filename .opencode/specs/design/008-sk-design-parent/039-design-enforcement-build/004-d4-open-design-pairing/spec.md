---
title: "D4 — mcp-open-design Pairing Guarantee"
description: "Make every design-feeding/mutating Open Design op deny-by-default behind a content-bound proof token — one phase per recommendation, D4-R1..R11."
trigger_phrases:
  - "d4 open-design pairing build"
  - "mcp-open-design gate phases"
  - "design pairing enforcement backlog"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented D4 Open Design pairing phase parent"
    next_safe_action: "Execute child phases under this parent"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-parent-154-039-d4-open-design-pairing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
# D4 — mcp-open-design Pairing Guarantee

## 1. PURPOSE
Put a deny-by-default precondition on every design-feeding or mutating Open Design operation. Each such op must carry a content-bound, run-scoped `DESIGN_PROOF_TOKEN v1` (loaded-file sha256s, workflow-mode bundle, subject/brief/form-answer digests, lineage, TTL) that is recomputed against the actual outgoing payload at the tool boundary and fails closed on absence, staleness, or mismatch. This replaces the never-executed `design_gate()` pseudocode and inverts the caller-supplied `feeds_design_decision=False` default into an explicit three-state classification. Because one daemon backs four interchangeable surfaces, the invariant is enforced at the convergent run/build boundary — authoritatively a guarded MCP/HTTP proxy, with Codex PreToolUse as defense-in-depth. Coverage spans wired MCP, `od`/`daemon-cli.mjs` Bash write verbs, raw HTTP, `od automation` fires, the `start_run --agent` inner model, and cli-* sub-agent delegation.

## 2. RECOMMENDATIONS (one phase each)
| Phase folder | ID | Title | Sev | Class |
|--------------|----|-------|-----|-------|
| `001-all-surface-guarded-gate` | D4-R1 | All-surface authoritative run/build gate via guarded proxy | P0 | enforceable |
| `002-executable-pretooluse-branch` | D4-R2 | Replace never-run `design_gate()` pseudocode with an executable PreToolUse branch | P0 | enforceable |
| `003-design-proof-token-schema` | D4-R3 | `DESIGN_PROOF_TOKEN v1` content-bound token schema | P0 | hybrid |
| `004-codex-policy-schema` | D4-R4 | Codex policy schema: `openDesignPreconditions.guardedTools` + namespace forms | P1 | enforceable |
| `005-od-cli-bash-lane` | D4-R5 | `odCliPreconditions` parser-backed Bash lane + gate-file carrier | P1 | enforceable |
| `006-inner-generator-payload-binding` | D4-R6 | Inner-generator payload binding; deny raw `--skip`/defaults; bind inner model | P1 | hybrid |
| `007-cross-child-laundering-guard` | D4-R7 | Cross-child laundering guard: mandatory token + child re-validate + demand-back | P1 | hybrid |
| `008-positive-exemption-inversion` | D4-R8 | Positive two-token exemption; invert default-false to `unclassified` | P1 | hybrid |
| `009-two-axis-tool-classification` | D4-R9 | Two-axis tool classification + ambiguous-read receipts | P1 | enforceable |
| `010-freshness-invalidation` | D4-R10 | Temporal/subject freshness invalidation + checker support | P1 | enforceable |
| `011-automation-freeze` | D4-R11 | Headless automation freeze at `od automation create` + two-phase validator | P1 | enforceable |

## 3. ENFORCEMENT CEILING — the honest "1000%"
**Enforceable across all surfaces:** tool-boundary deny-by-default; token presence, schema completeness, TTL/expiry, future-issued + single-use/replay rejection; a pure-transport allowlist carrying a positive `openDesignExemption`; and payload-lineage binding (recomputing brief/form/subject digests from the actual outgoing request and denying mismatch), which structurally closes the inner-generator and sub-agent laundering bypasses. **Advisory only:** whether the loaded judgment was *applied* well — the inner model's private reasoning and final taste cannot be proven by a hash. **Residual bypasses that could NOT be fully closed:** (1) the daemon ships unmodifiable in `/Applications/Open Design.app`, so a client hitting the ephemeral raw HTTP port or the in-app Skills UI *around* the guarded proxy escapes — only a true daemon-side validator closes this (`iteration-044.md:103`); (2) a text-only `cli-claude-code` child with no machine-readable tool stream cannot prove it did not replay a stale token (`iteration-040.md:79`); (3) shell aliases/functions the Bash parser cannot resolve from one command string (`iteration-033.md:18`).

## 4. SEQUENCING
P0 spine first, in order: **D4-R1** (all-surface guarded gate), **D4-R2** (executable PreToolUse branch), **D4-R3** (proof-token schema). These three are the enforcement spine — nothing downstream binds without them. The spine shares the content-bound `DESIGN_PROOF_TOKEN` with D3 (loading-side mint). P1 items (D4-R4..R11) layer per-surface coverage, classification, freshness, and the automation freeze onto the spine and can proceed once R1–R3 land.

## 5. RELATED
- Source: [[044-design-routing-and-integration-research]] research.md §7
