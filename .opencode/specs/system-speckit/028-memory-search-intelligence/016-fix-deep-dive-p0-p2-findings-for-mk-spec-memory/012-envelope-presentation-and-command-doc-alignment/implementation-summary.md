---
title: "Implementation Summary: Envelope Presentation and Command-Doc Alignment"
description: "Collapsed the memory_search envelope to a single casing per telemetry block, moved the token budget after attach with an honest tokenCount, closed a cursor-scope tenant leak, made rendering and resume-status truthful, and re-aligned ~18 drifted command-doc claims across both command trees behind a byte-parity gate — the live envelope byte capture is a daemon-side pending, the structural reductions are unit-verified."
trigger_phrases:
  - "envelope presentation"
  - "command doc alignment"
  - "envelope single casing"
  - "cursor scope tenant leak"
  - "dual tree parity"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/012-envelope-presentation-and-command-doc-alignment"
    last_updated_at: "2026-07-04T14:09:14.102Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Integrated 012 (12 REQs); single-casing + cursor-leak fix + doc-drift battery; 563 tests green"
    next_safe_action: "Phase 013 absorb-028-006-review-remediation-closeout"
    blockers: []
    key_files:
      - "mcp_server/handlers/memory-search.ts"
      - "mcp_server/lib/search/progressive-disclosure.ts"
      - "mcp_server/handlers/memory-context.ts"
      - "scripts/validate-command-tree-parity.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-016-012-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The live 5-result envelope byte count (<6KB target) is a daemon-side capture — the daemon IPC socket was unavailable in the worktree; run the live envelope capture after the daemon leases restart to confirm the byte reduction lands"
    answered_questions:
      - "Cursor scope no longer trusts the client offset: the decoded offset must match the server-stored nextOffset for the cursor's scopeKey, and a forged/tampered cursor is denied (adversarial test)"
      - "The dual command trees are byte-identical by construction (.claude/commands resolves to .opencode/commands); the parity script + a new validate rule guard it"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-envelope-presentation-and-command-doc-alignment |
| **Completed** | 2026-07-04 (structural fixes + parity gate; live envelope bytes daemon-side) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `memory_search` envelope was 17.6KB for five results because every telemetry block was emitted twice — once camelCase, once snake_case — and the token budget was enforced before the graph, routing, and envelope data were even attached, so `meta.tokenCount` (6,455) described a payload that no longer existed. This phase emits exactly one casing per block (camelCase, the casing the consumers already read, with the snake twins removed and their readers updated), moves budget enforcement to after attach so `tokenCount` reflects the final serialized payload within ±10%, and compacts metadata before result rows when over budget so a row stays renderable. The unreachable sanity guard in the context path was deleted, `memory_context`'s delegated search envelope is de-nested (structured `data` at the top level instead of a JSON-in-string blob), and the CLI `--format text` path renders one minimal row per result with an explicit notice for suppressed blocks.

### The cursor tenant leak and the truthful-status fixes

The pagination cursor stored a server-side `scopeKey` but still trusted the client-supplied decoded offset, so a forged or cross-scope cursor could walk another tenant's result set. The resolve path now requires the decoded offset to match the server's recorded `nextOffset` for that scopeKey, and a forged or tampered cursor is denied — proven by an adversarial table covering cross-scope, forged, tampered-offset, malformed, and exhausted cases. Session-dedup marks a result "sent" only after budget truncation, so a row trimmed by the budget is re-eligible on the next call instead of silently lost. Rendering stopped lying: a row gets the `semantic_match` label only when vector attribution is real, and a resume-ladder row reports `fingerprintStatus:'verified'` only when an expected fingerprint was actually compared — a read-stability-only read now reports a truthful non-verified status.

### Command-doc drift and the parity gate

The two command trees carried ~18 claims drifted from code. This phase fixed the enumerated battery in both trees — the tool count corrected from 39 to 41 (phase 009 added `memory_learned_expire` and `memory_learned_clear`) across `AGENTS.md` and the root `README.md`, the `/spec_kit:resume` command name corrected to `/speckit:resume` in the live docs and the two spec-tooling scripts that parse it, the hybrid-decay default documented as on, and the `code_graph_scan`/`code_graph_status` rows corrected to their real direct-MCP surface instead of a false `/memory:manage` mapping — then added a byte-parity script comparing the trees, wired into `validate.sh` as a new `COMMAND_TREE_PARITY` rule so drift between the trees now fails validation.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented the 12 REQs; the first pass was verified by **three parallel xhigh reviewers** split by concern (envelope structural / cursor-security-hooks-resume / doc-drift-dual-tree). That parallel pass passed six REQs and failed six — including the cursor security gap (the client offset was still trusted) and two genuinely failing test suites that the implementer's narrower self-report had masked. A comprehensive GPT-high remediation fixed all six plus both suites; it was killed during its final verification pass, but the worktree preserved a consistent state, so Opus 4.8 independently confirmed the result: a clean build, 563–616 passing tests across the touched suites, the cursor mechanism (server-side offset match + forged-cursor denial) confirmed in real code, the doc-drift audit at zero for the in-scope trees, and the dual-tree parity holding.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep camelCase, drop the snake_case twins | camelCase is the casing the envelope consumers already read; dropping the twins halves the telemetry bytes with the fewest consumer updates |
| Cursor resolve must match the server-stored offset | Trusting a client-supplied offset is the tenant leak; the server owning the offset per scopeKey is what actually denies a forged cursor |
| Byte-parity gate wired into validate | The two command trees are only useful if they cannot silently diverge; a validation rule makes drift a failure, not a latent surprise |
| Live envelope bytes are a daemon-side capture | The <6KB target needs the live daemon envelope; the structural single-casing reduction is unit-verified, but the byte number is honest-pending, not fabricated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --build` (integrated main) | PASS (exit 0) |
| 012 targeted vitest (13 suites) | PASS (601 passed, 15 skipped) |
| 012 integrated-main sweep (8 suites) | PASS (563 passed, 1 skipped) |
| REQ verification (3 parallel xhigh) | 6/12 first pass → 12/12 after remediation |
| REQ-004 cursor tenant leak | PASS (server-side offset match + forged-cursor denial, mechanism confirmed) |
| REQ-002/003 envelope single-casing + honest tokenCount | PASS (snake twins absent; tokenCount matches serialized) |
| REQ-008 doc-drift battery (both trees) | PASS (39→41, /speckit:resume, T054 mapping; zero in-scope drift) |
| REQ-009 dual-tree byte-parity | PASS (script + validate rule; negative test detects a 1-byte diff) |
| `validate.sh --strict` | PASS |
| **Live 5-result envelope < 6KB** | **NOT MEASURED — daemon-side capture pending** |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live envelope byte count is daemon-side.** The single-casing reduction and the budget-after-attach tokenCount are unit-verified, but the actual 5-result envelope bytes (< 6KB target) need the live daemon envelope — its IPC socket was unavailable in the isolated worktree. Run the live capture after the daemon leases restart to confirm the reduction lands.
2. **Code effects apply on the next daemon-lease restart.** Like phases 001–010, the envelope, cursor, and rendering changes take effect when the daemon reloads the rebuilt dist.
3. **The command-tree byte-parity holds by construction.** `.claude/commands` resolves to `.opencode/commands`, so the two trees are the same bytes; the new `COMMAND_TREE_PARITY` validate rule guards against a future divergence (e.g. if the symlink is replaced by a real copy).
<!-- /ANCHOR:limitations -->
