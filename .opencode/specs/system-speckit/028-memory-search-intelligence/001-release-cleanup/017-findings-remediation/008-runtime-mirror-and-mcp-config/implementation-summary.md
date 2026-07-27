---
title: "Implementation Summary: Runtime Mirror and MCP Configuration"
description: "One fix applied to a CI gate that reported success without verifying anything. Two findings were miscounts, one is escalated as a capability decision, and the fix immediately exposed a real hidden drift."
trigger_phrases:
  - "runtime mirror mcp summary"
  - "017 phase 008 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/008-runtime-mirror-and-mcp-config"
    last_updated_at: "2026-07-27T15:28:15Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed a fail-open CI gate; halted for operator verification as required"
    next_safe_action: "Operator decides the codex MCP server question and the orchestrate mirror drift"
    blockers:
      - "HALT: phase 008 halts after execution by design"
    key_files:
      - "approved-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-008"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should codex load sequential_thinking and code_mode?"
      - "Which side is canonical for the orchestrate agent body?"
    answered_questions:
      - "A CI gate that exits 0 having verified nothing is worse than no gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-runtime-mirror-and-mcp-config |
| **Completed** | 2026-07-27 (halted for verification, as designed) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A CI gate that had been reporting success without checking anything now checks, and it found something on its first honest run.

| Finding | Result |
|---------|--------|
| `devin-04:F3` | APPLIED — the mirror-sync checker printed "OK" and exited 0 whenever it received zero agent files. It now discovers the agent trees when run standalone, and says "nothing verified" rather than "OK" when it genuinely has nothing to check |
| `devin-04:F9` | ESCALATED — `.codex/config.toml` really is missing `sequential_thinking` and `code_mode`. Adding them changes what every codex session loads, which is a capability decision |
| `devin-04:F10` | REFUTED — `opencode.json` and `.claude/mcp.json` are runtime-specific siblings with different schemas, not duplicated sources of truth |
| `fanout:SOL-08` | REFUTED — a miscount. All three trees hold exactly 13 agents; two of them also carry a README |

### What the fixed gate found immediately

Its first standalone run reported `orchestrate` as having out-of-sync runtime mirrors, and that is real: the two bodies hash differently. Only one agent of thirteen is flagged, so this is not the frontmatter schema difference that separates the runtimes — those differences are expected and the checker correctly ignores them.

This drift existed before this phase and was invisible because the gate never ran with inputs. It is recorded here and deliberately not fixed: deciding which side is canonical is a separate change.

### Why two findings were miscounts

`SOL-08` reported 14, 14 and 13 agents across three trees and read it as a missing agent. The counts are file counts: `.opencode/agents` and `.claude/agents` each contain 13 agents plus a `README.txt`, and `.codex/agents` contains 13 agents with no README. Nothing is missing.

`devin-04:F10` called two config files duplicates. Every server entry differs between them because the runtimes use different config schemas. This is the same shape triage already refuted for the agent directories, where runtime-specific siblings were mistaken for a stale mirror.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One GPT-5.6-LUNA worker at xhigh effort, tightly constrained. The script it edited runs inside the pre-commit hook, where receiving zero agent files is the normal case for any commit that does not touch agents. Making the gate fail hard would have blocked ordinary commits, so the worker was told to make the zero-input case honest rather than fatal, and to return BLOCKED if its change could block a commit.

Four invocation paths were verified independently afterwards: no arguments now exits 1 and checks the real trees, a clean agent file exits 0, a drifted agent file exits 1, and a non-agent argument exits 0 with an honest message. That last one is the commit-safety case and it holds.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the gate honest rather than fatal | It runs in pre-commit; a hard failure on zero inputs would block every commit that does not touch agents |
| Record the orchestrate drift without fixing it | Choosing which side is canonical is a separate decision, not a mirror-config cleanup |
| Escalate the codex MCP gap | Adding servers changes what every session in that runtime loads |
| Refuse both miscounts | Neither described a real divergence |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Non-agent argument exits 0 | PASS — commits cannot break |
| Clean agent file exits 0 | PASS |
| Drifted agent file exits 1 | PASS |
| Standalone run discovers the trees | PASS |
| Reported drift is genuine | PASS — differing body hashes |
| Not a schema false positive | PASS — 1 of 13 flagged, not 13 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **HALT.** This phase halts after execution by design. Two decisions are open: whether codex should load the two missing MCP servers, and which side is canonical for the `orchestrate` agent body.
2. **The gate may now fail builds it previously passed.** That is the intent, and the first thing it caught was real.
<!-- /ANCHOR:limitations -->
