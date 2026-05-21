---
title: "Implementation Summary: launcher lease acquisition-time reclaim [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION scaffold for launcher lease acquisition-time reclaim."
trigger_phrases:
  - "launcher lease acquisition reclaim"
  - "stale lease CAS"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/013-launcher-lease-acquisition-reclaim"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Pre-implementation scaffold created"
    next_safe_action: "Implement atomic acquisition reclaim and race regression"
    blockers: []
    completion_pct: 0
---
# Implementation Summary: launcher lease acquisition-time reclaim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: PRE-IMPLEMENTATION.** This packet is a scaffold. The concrete source/test files below are planned targets so the strict validator and future implementer have actionable anchors.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned - PRE-IMPLEMENTATION |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `006-mcp-launcher-concurrency-arc` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No implementation has shipped yet. The planned build targets are:

- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:300` - planned atomic reclaim site.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:226` - existing read-path liveness behavior to preserve.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/daemon/lease-acquisition-reclaim.vitest.ts:1` - planned race regression.

This scaffold itself created the canonical packet files: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was created from the Level 1 structural contract and the requested 008 structural template. No runtime source code was changed in this scaffold. Future implementation should follow `plan.md` Phase A-D and preserve the predecessor links in `spec.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001

Correct phase 011 framing: the missing behavior is acquisition-time atomic reclaim, not another read-path dead-PID probe.

### D-002

Require a two-launcher race regression because single-thread stale reclaim would not prove the bug is closed.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Planned verification:

- Two-contender stale lease regression exits 0.
- Existing lease tests exit 0.
- Strict-validate exits 0.

Scaffold verification must run:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/013-launcher-lease-acquisition-reclaim --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. No lease code is changed by this scaffold.
2. The exact CAS shape depends on current SQLite schema and better-sqlite3 transaction behavior.
<!-- /ANCHOR:limitations -->
