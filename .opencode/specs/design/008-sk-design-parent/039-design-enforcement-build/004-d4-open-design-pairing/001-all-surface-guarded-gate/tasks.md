---
title: "Tasks: All-surface guarded proxy + openDesignDesignPrecondition contract"
description: "Ordered authoring + verification tasks for references/guarded_proxy.md and its embedded JSON policy block."
trigger_phrases:
  - "guarded proxy tasks"
  - "opendesigndesignprecondition tasks"
  - "all-surface gate tasks"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/001-all-surface-guarded-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all guarded proxy authoring and verification tasks complete with evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: All-surface guarded proxy + openDesignDesignPrecondition contract

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

- [x] T001 Re-read the token boundary contract — §2 schema, §6 boundary, §7 acceptance, §8 consumers (`.opencode/skills/sk-design/references/design_proof_token.md`) [15m]
- [x] T002 [P] Re-read the tool inventory + classification — §2 (11 read-only / 5 mutating / 2 destructive) and §3 (surface / gate / omit) (`.opencode/skills/mcp-open-design/references/tool_surface.md`) [10m]
- [x] T003 [P] Read the anchor + existing gate — one daemon / four surfaces (SKILL.md:209) and `design_gate` prose (SKILL.md:164–175) (`.opencode/skills/mcp-open-design/SKILL.md`) [10m]
- [x] T004 Fix the canonical request field set and the GUARDED-vs-EXEMPT decision rule before writing (working notes, scratch only) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Boundary + normalization
- [x] T005 Write Section 1 Purpose — guarded-proxy boundary; CONTRACT not a running server; the run/build chokepoint and why one hook cannot cover four surfaces (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [20m]
- [x] T006 Write Section 2 Boundary placement — agent-side, before inner-agent spawn / build-fire; the four wired adapters it governs (`references/guarded_proxy.md`) [20m]
- [x] T007 Write Section 3 Request-normalization contract — canonical request shape field table + per-surface (MCP/HTTP/CLI/Skills) adapter mapping; lossless on security fields (`references/guarded_proxy.md`) [40m]

### Classifier + precondition
- [x] T008 Write Section 4 Two-axis classification — `mutationClass × feedsDesignDecision` → GUARDED/EXEMPT, cross-referencing `tool_surface.md` and `design_gate` (`references/guarded_proxy.md`) [25m]
- [x] T009 Write Section 5 `openDesignDesignPrecondition` — deny-by-default; delegate token validity to the `DESIGN_PROOF_TOKEN` boundary contract; add canonical surface-match check; fail-closed rules; ALLOW/DENY decision (`references/guarded_proxy.md`) [40m]
- [x] T010 Write Section 6 Exemption allowlist — positive list of pure-transport tools; unlisted → GUARDED; must NOT block legitimate non-design transport (`references/guarded_proxy.md`) [20m]

### Policy + residual + acceptance
- [x] T011 Write Section 7 Policy block — embedded JSON enumerating `guarded[]` vs `exemptTransport[]`, derived from `tool_surface.md` §2/§3 (`references/guarded_proxy.md`) [25m]
- [x] T012 Write Section 8 Residual & boundary of enforceability — name the daemon-side bypass (raw HTTP port + in-app Skills UI), out of scope because the bundled daemon is unmodifiable (`references/guarded_proxy.md`) [20m]
- [x] T013 Write Section 9 Acceptance — the three acceptance conditions stated in-doc (`references/guarded_proxy.md`) [15m]
- [x] T014 [P] OPTIONAL: add a single anchor cross-link from SKILL.md to the new doc — DEFERRED: SKILL.md left untouched to hold scope to the one new doc (`.opencode/skills/mcp-open-design/SKILL.md`) [10m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance coverage
- [x] T015 Confirm the contract specifies DENY for a design-feeding/mutating call without a valid fresh token on each wired surface — MCP, HTTP, CLI, Skills [15m]
- [x] T016 Confirm a pure-transport exempt call passes (is NOT blocked) per the allowlist [10m]
- [x] T017 Confirm the daemon-side residual is named as out of scope, not silently passed [5m]

### Structural + integrity
- [x] T018 Evergreen grep — no spec/packet/phase IDs or spec paths in `references/guarded_proxy.md` (`rg` for `specs/`, `NNN-`, phase tokens) [10m]
- [x] T019 Reference integrity — relative links resolve to `design_proof_token.md` and `tool_surface.md`; cited section names exist [10m]
- [x] T020 Classifier completeness — every tool in `tool_surface.md` §2 maps to GUARDED or EXEMPT in the policy block; JSON parses (`jq`) [10m]

### Documentation
- [x] T021 Mark all `checklist.md` items with evidence [10m]
- [x] T022 Update `implementation-summary.md` with final state and acceptance evidence [15m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Three acceptance scenarios specified in the doc and verified
- [x] Evergreen [HARD] grep clean (no IDs/paths in the authored doc)
- [x] Policy JSON parses and covers the full tool inventory
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Token contract validated by the precondition**: `.opencode/skills/sk-design/references/design_proof_token.md`
- **Tool inventory + classification source**: `.opencode/skills/mcp-open-design/references/tool_surface.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort per task, explicit verification tasks)
- Deliverable: references/guarded_proxy.md + embedded JSON policy block
- PLANNING ONLY: no live target edits / codex / strict-validate this phase
-->
