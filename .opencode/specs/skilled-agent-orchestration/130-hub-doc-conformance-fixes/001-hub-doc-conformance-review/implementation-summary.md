---
title: "Implementation Summary: Hub-doc conformance + reality-alignment review (cli-external + mcp-tooling)"
description: "The bounded deep-review of the cli-external + mcp-tooling hub docs completed with a FAIL verdict: 102 P0 / 5 P1 / 4 P2 raw, 67 P0 / 4 P1 / 2 P2 distinct after dedup, across six themes; durable artifacts under review/; findings handed to the 002 remediation plan."
trigger_phrases:
  - "hub doc conformance review summary"
  - "cli-external mcp-tooling doc audit summary"
importance_tier: "normal"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review"
    last_updated_at: "2026-07-11T09:14:17.440Z"
    last_updated_by: "claude"
    recent_action: "Deep-review closed FAIL; findings handed to the 002 remediation plan"
    next_safe_action: "Execute the 002 remediation plan against the flagged hub docs"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-doc-conformance-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-hub-doc-conformance-review |
| **Completed** | 2026-07-10 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A bounded deep-review (dimensions `sk-doc-conformance` + `reality-alignment`, ≤10 iterations, stop = max-iterations) of the `cli-external` and `mcp-tooling` hub docs. Every reality claim in those docs — CLI flags, MCP tools, transport/auth config, agent routes, playbook meta-counts, links/paths, and vendored `mcp-servers/**/README.md` schema shape — was checked against live CLI/MCP truth and against the sk-doc create-skill templates, rather than assumed. The review edits no hub doc; its product is a ranked, deduped finding set and durable run artifacts that the `002-hub-doc-conformance-fixes` remediation plan consumes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `review/deep-review-findings-registry.json` | Created | Authoritative deduped finding set (severity + evidence) |
| `review/` (deltas, prompts, dispatch receipts) | Created | Per-iteration run telemetry for the ≤10 iterations |
| `spec.md`, `plan.md`, `tasks.md` | Created | Packet framing of the review as completed work |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The review ran as a bounded deep-review loop (`gpt-5.6-sol-fast`, ≤10 iterations, stop = max-iterations) over two dimensions — `sk-doc-conformance` and `reality-alignment`. Each iteration took a scoped slice of the `cli-external` + `mcp-tooling` hub-doc surface and, for every reality claim in it, resolved live truth before recording a verdict: CLI flags and behaviors probed against the actual binaries (`cupt`, `figma-ds-cli`, `bdg`), MCP tools checked against the live registry via Code Mode `tool_info()`/`list_tools()`, doc shape diffed against the sk-doc create-skill templates, and links/paths resolved on disk. Findings were written with file:line + evidence and then deduplicated into `review/deep-review-findings-registry.json`, collapsing the raw 102 P0 / 5 P1 / 4 P2 run tally into the authoritative 67 P0 / 4 P1 / 2 P2 distinct set. Per-iteration deltas, prompts, and dispatch receipts were externalized under `review/` so the downstream `002-hub-doc-conformance-fixes` plan could partition the findings into four collision-free work-streams without re-reading or re-deriving the source review.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Read-only review, no hub-doc edits | Separation of concerns — remediation is a distinct downstream packet (002) |
| Verify every reality claim against live truth | Doc drift is invisible unless checked against the actual CLI/MCP surface |
| Dedup raw findings into a registry | 102/5/4 raw collapses to 67/4/2 distinct; the deduped IDs are the handoff unit |
| Partition findings for collision-free work-streams | Lets a downstream packet fix in parallel without two streams editing one file |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Verdict | FAIL | 67 P0 / 4 P1 / 2 P2 distinct (102 / 5 / 4 raw) across six themes |
| Reality-alignment | Complete | CLI flags, MCP tools, transport/auth, agent routes, meta-counts checked live |
| Conformance | Complete | Hub-doc shape diffed against sk-doc create-skill templates; vendored READMEs schema-checked |
| Artifacts | Durable | Registry + per-iteration deltas/prompts/receipts persisted under `review/` |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Review only** — no hub doc is changed here; the value is realized only once the 002 plan is executed.
2. **Registry telemetry vs deduped totals** — the `review/` snapshot reflects run telemetry; the authoritative counts are the deduped 67 P0 / 4 P1 / 2 P2 carried into the 002 plan.
3. **SKILL.md routing out of scope** — INTENT_SIGNALS / RESOURCE_MAP / mode-registry are coordinated separately, not reviewed here.

<!-- /ANCHOR:limitations -->
