---
title: "Tasks: temporal/subject freshness-invalidation consumer"
description: "Task list to author the freshness-invalidation consumer reference (stale/future-issued/TTL-span/replay/subject-mismatch reject rules), name the run-scoped residuals, and optionally harden the boundary time-window check with a TTL-span bound."
trigger_phrases:
  - "freshness invalidation tasks"
  - "proof token freshness consumer tasks"
  - "ttl span bound tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/010-freshness-invalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every task complete with one-line delivery evidence"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/freshness_invalidation.md"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: temporal/subject freshness-invalidation consumer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the boundary time-window and structural token checks; record what freshness is already enforced (`.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`) [20m] — Done: `isValidTokenTimeWindow` enforced `issuedAt <= now < expiresAt` + finite parse; no span bound
- [x] T002 [P] Re-read the proof token schema, boundary, and acceptance sections to anchor reuse points (`.opencode/skills/sk-design/references/design_proof_token.md`) [15m] — Done: §2/§6/§7 anchored as cite-don't-duplicate reuse points
- [x] T003 Scaffold the freshness consumer reference with frontmatter, H1, and section headers (`.opencode/skills/mcp-open-design/references/freshness_invalidation.md`) [15m] — Done: frontmatter + Freshness Axes / Boundary Contract / Acceptance / Implementation Notes

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Contract authoring
- [x] T004 Author the freshness-axis matrix: stale, future-issued, malformed-time, TTL-span, replay, subject/payload-mismatch (`.opencode/skills/mcp-open-design/references/freshness_invalidation.md`) [45m] — Done: six-axis table with one reject rule each
- [x] T005 For each axis, write the reject rule and label it code-enforced (boundary) vs contract-only vs needs-run-scoped-state (`.opencode/skills/mcp-open-design/references/freshness_invalidation.md`) [40m] — Done: four CODE-ENFORCED at the codex boundary, two RUN-SCOPED RESIDUAL
- [x] T006 Document the named residuals: the consumed nonce+runId set and the subject recompute need the run-scoped proxy/parent, not the per-call boundary (`.opencode/skills/mcp-open-design/references/freshness_invalidation.md`) [30m] — Done: residual table names the consumed-set + payload recompute, owned by the proxy/parent
- [x] T007 [P] Reconcile the spec's literal checker target into an optional build/CI lane and flag the spec-vs-landed divergence (`.opencode/skills/mcp-open-design/references/freshness_invalidation.md`) [20m] — Done: the executable freshness spine landed in the codex boundary; `proof_check.py --require-design-token` recorded as the spec-vs-landed divergence

### Optional code hardening (HIGH-BLAST, owner-gated)
- [x] T008 (OPTIONAL) Add a TTL-span upper bound (`0 < expiresAt - issuedAt <= MAX_TTL`) to the boundary time-window check or a sibling helper (`.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`) [45m] — Done: `MAX_DESIGN_TOKEN_TTL_MS = 24h` + `(expiresAt - issuedAt) <= MAX_DESIGN_TOKEN_TTL_MS` in `isValidTokenTimeWindow` (+6/-1)
- [x] T009 (OPTIONAL) No-regression: confirm the canonical ~300s token still passes and only absurd spans reject (`.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`) [30m] — Done: ~300s + `now-30s -> now+270s` ACCEPT; 1yr REJECTS; vitest 11/11 + 1/1, tsc clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Contract walk
- [x] T010 Walk stale + future-issued reject through the boundary code path; confirm the contract matches the enforced behavior [15m] — Done: both REJECT through both lanes; contract matches `now >= expiresAt` / `issuedAt > now`
- [x] T011 Walk the TTL-span, replay, and subject-mismatch reject rules; confirm each names its enforcement home honestly [15m] — Done: TTL-span code-enforced; replay + subject-mismatch named run-scoped residuals at the proxy/parent

### Evergreen + docs
- [x] T012 [P] Grep the reference body for spec/packet/phase IDs and spec paths; confirm none present [10m] — Done: reference body + hook comment scan clean
- [x] T013 Update `implementation-summary.md` and mark `checklist.md` items with evidence [20m] — Done: implementation-summary.md authored; checklist fully `[x]` with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-optional tasks marked `[x]`
- [x] Optional code tasks (T008/T009) resolved: completed with no-regression evidence OR explicitly deferred with owner sign-off — Done: both COMPLETED with no-regression evidence (vitest 11/11 + 1/1)
- [x] Every freshness axis has a reject rule and a named enforcement home
- [x] Residuals (replay, subject-mismatch) attributed to run-scoped state, not the per-call boundary
- [x] Reference body is evergreen (no spec/packet/phase IDs or spec paths)
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---
