---
title: "Tasks: Phase 7 — Register mcp-obsidian across the mcp-tooling hub, router, and skill-advisor"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "obsidian hub registration tasks"
  - "mcp-obsidian router advisor tasks"
  - "mcp-obsidian phase 7 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/007-hub-registration-and-advisor"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 7 hub-registration tasks"
    next_safe_action: "Confirm the compiled-routing mint entrypoint, then edit mode-registry.json"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-hub-registration-and-advisor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7 — Register mcp-obsidian across the mcp-tooling hub, router, and skill-advisor

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the compiled-routing mint entrypoint + invocation for the current router-unification revision (`.opencode/bin/compiled-route-sync.cjs`)
- [ ] T002 Read `mcp-click-up`'s entries across all five hub files as the template; record current `description.json` version + `graph-metadata.json` MCP-bridge count word
- [ ] T003 [P] Confirm the trusted-caller path available for `advisor_rebuild`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Router: add the `mcp-obsidian` mode object (`mode-registry.json`) + tieBreak/routerSignals/vocabularyClasses (`hub-router.json`) + OBSIDIAN intent + RESOURCE_MAP (`shared/references/smart-routing.md`)
- [ ] T005 Advisor: append obsidian keywords + version bump (`description.json`) + domains/intent_signals/derived + causal_summary "six"->"seven" (`graph-metadata.json`)
- [ ] T006 Hub doc: update SKILL.md frontmatter counts/version/keywords, §1 mode row, §2 counts, §3 layout subtree, §5 references line (`SKILL.md`)
- [ ] T007 Regenerate `leaf-manifest.json` via `node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/mcp-tooling`; update repo `README.md` integration list + skill table
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-mint compiled router via `.opencode/bin/compiled-route-sync.cjs` (+ `--verify`); document the `SPECKIT_COMPILED_ROUTING=0` legacy-prose fallback
- [ ] T009 Run `advisor_rebuild` (trusted) → `advisor_status`/`advisor_validate`; confirm the advisor returns `mcp-tooling` for obsidian prompts; run `parent-skill-check.cjs .opencode/skills/mcp-tooling` (exit 0) + `route-validate.sh`
- [ ] T010 `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] `parent-skill-check` exits 0; advisor returns `mcp-tooling` for obsidian prompts; no registry<->router drift
- [ ] Compiled router re-minted (or legacy fallback documented); repo README updated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next phase**: `../008-verification-and-closeout/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
