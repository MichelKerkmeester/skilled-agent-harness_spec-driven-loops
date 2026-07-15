---
title: "Implementation Summary: Ephemeral-pointer guard + comprehensive comment sweep"
description: "Built a dependency-free sk-code §4 comment guard, which revealed 006 was ~10% complete, then swept the whole tree guard-clean: 261 comment-only fixes across 119 files, zero dist drift."
trigger_phrases:
  - "ephemeral pointer guard sweep summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/007-ephemeral-pointer-guard-and-sweep"
    last_updated_at: "2026-05-29T21:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Guard + sweep complete and verified guard-clean"
    next_safe_action: "Land C1 docs, then C2 fixes, then C3 cluster"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/scripts/validation/ephemeral-pointer-audit.mjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003174"
      session_id: "031-007-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Ephemeral-pointer guard + comprehensive comment sweep

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-embedding-stack-hardening/007-ephemeral-pointer-guard-and-sweep |
| **Completed** | 2026-05-29 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A standalone, dependency-free guard (`scripts/validation/ephemeral-pointer-audit.mjs`, ≈470 LOC) that enforces sk-code §4 "No ephemeral-artifact pointers" by inspecting comment regions only and flagging spec folder/number, task/checklist/requirement ids, review-finding ids, ADR ids, and ticket/issue refs — while explicitly allowing durable look-alikes (HTTP codes, embedding dims, token tiers, `V16:` schema tags, JSDoc `@example`, runtime path constants, external standards, internal `Safeguard #N` enumerations).

Running it exposed that packet 006's hand-rolled patterns had caught only ~10% of the debt. The guard found **274 violations across 116 files**. A parallel sweep (11 agents over disjoint roots, each self-verifying) plus an orchestrator pass for stragglers brought the whole tree to **0 violations**: **261 comment-only fixes across 119 files**, keeping the durable WHY in every comment.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/validation/ephemeral-pointer-audit.mjs` | Created | The sk-code §4 comment guard + CI gate |
| `mcp_server/**` (handlers, lib/*, context-server.ts, tool-schemas.ts, api, scripts) | Modified | Comment-only ephemeral-pointer removal |
| `scripts/**` (core, lib, utils, renderers, graph, memory, spec-folder, extractors, optimizer, tests) | Modified | Comment-only removal |
| `shared/**`, `.opencode/bin/**` | Modified | Comment-only removal |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard was authored and self-tested first (BAD/GOOD fixture + a whole-tree run), then tuned to clear two false-positive classes: it was flagging its own documentation strings (self-exclusion added) and `Safeguard #N` internal enumerations (`learned-feedback.ts` documents a numbered "10 Safeguards" list, not GitHub issues — carve-out added). With a trustworthy detector, a sweep workflow fanned 11 agents across disjoint directory roots; each fixed its files and re-ran the guard on its own roots to zero. A final whole-tree guard run caught 8 stragglers in three directories the batching had missed (`lib/telemetry`, `scripts/extractors`, `scripts/optimizer`) plus 3 fixture-value annotations, which the orchestrator fixed directly. Before claiming done: whole-tree guard → 0 (exit 0), both `@spec-kit` workspaces build (`tsc`, exit 0) with **zero `dist/` drift** (proving the edits are behaviorally inert), and `node --check` clean on touched `.cjs`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build a guard before finishing the sweep | 006's hand patterns missed ~90%; a precise detector is the only way to define and verify "done," and it prevents regression |
| Precision over recall, with an explicit ALLOW table | The live tree is full of durable look-alikes (HTTP codes, dims, `V16:`); a broad pattern would flood false positives |
| Treat `Safeguard #N` + fixture-value annotations as false positives | They are durable internal enumerations / test-data annotations, not traceability pointers |
| Sweep comment-only, verify with zero dist drift | Comments are behaviorally inert; the dist check is objective proof no logic changed |
| Orchestrator fixes stragglers, not another agent round | Faster + the whole-tree guard run is the authoritative gate that closes batching gaps |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Whole-tree guard (`node ephemeral-pointer-audit.mjs system-spec-kit bin`) | PASS — 0 violations, exit 0 |
| Guard self-test (BAD/GOOD fixture) | PASS — flags BAD, passes GOOD |
| TS build (`@spec-kit/shared` + `@spec-kit/mcp-server`) | PASS — exit 0 |
| `dist/` drift | PASS — 0 files (edits behaviorally inert) |
| `node --check` touched `.cjs` | PASS |
| `validate.sh --strict` (this packet) | PASS |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Guard not yet wired into CI/pre-commit.** It runs on demand; wiring it into `verify_alignment_drift.py` or a pre-commit hook is proposed in the guard header and deferred to a follow-on decision.
2. **`SPRINT N` is flagged as a spec-folder ref.** Borderline (a sprint is a process artifact); fixed in this sweep where it appeared, but reasonable people could treat bare sprint labels as durable.
3. **Scope was `system-spec-kit` + `bin`.** Other code surfaces (webflow, motion_dev) were not swept.

<!-- /ANCHOR:limitations -->
