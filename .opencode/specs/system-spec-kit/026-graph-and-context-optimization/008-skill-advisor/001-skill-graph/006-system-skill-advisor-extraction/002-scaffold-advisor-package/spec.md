---
title: "Feature Specification: Scaffold `system-skill-advisor` skill package (no runtime move)"
description: "Per ADR-001, create the dedicated `.opencode/skills/system-skill-advisor/` package — SKILL.md, README.md, graph-metadata.json, feature_catalog/, manual_testing_playbook/, references/, empty mcp_server/ scaffold, package-local DB-path policy, install-guide stubs. No runtime behavior moves yet."
trigger_phrases:
  - "system-skill-advisor scaffold"
  - "skill advisor package scaffold"
  - "advisor extraction child 002"
  - "system-skill-advisor SKILL.md graph-metadata"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/006-system-skill-advisor-extraction/002-scaffold-advisor-package"
    last_updated_at: "2026-05-14T03:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000150902"
      session_id: "002-scaffold-advisor-package"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Code stays where it is; only the skill package envelope ships in this phase."
      - "ADR-001 already locked the shape; this packet executes the scaffold per that ADR."
      - "Parity test failures introduced by the empty-stub folder pickup will be resolved as a side effect of proper graph-metadata.json + SKILL.md authoring."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Scaffold `system-skill-advisor` skill package (no runtime move)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `002-scaffold-advisor-package` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
ADR-001 (`015/009/001/decision-record.md`) locked the "Standalone Advisor MCP With Legacy Tool Bridge" shape and committed to a 5-phase migration sequence. Child 002's job is the envelope-only step: stand up the `.opencode/skills/system-skill-advisor/` skill package with first-class docs and a working mcp_server skeleton, without moving any runtime code yet. Child 003 moves source/DB/tests; child 004 wires the standalone launcher; etc.

Today the system-skill-advisor folder partially exists from parallel-session collateral that got swept into earlier commits:
- `SKILL.md` exists but is empty
- `graph-metadata.json` is missing
- `README.md`, `ARCHITECTURE.md` exist (parallel-author content)
- `changelog/`, `feature_catalog/`, `manual_testing_playbook/`, `references/` are empty stubs

This partial-stub state is also responsible for 2 parity test regressions noted in 015/010's commit (`1873af544`): the TS scorer's skill projection picks up `system-skill-advisor` as a thin/unknown skill that occasionally wins ambiguous routings, diverging from the Python golden corpus that doesn't see it.

### Purpose
Author the missing files + content per ADR-001 so the package becomes a real first-class skill the discovery system understands. Specifically:

- Author `SKILL.md` with proper frontmatter (description, trigger_phrases, etc.) per ADR-001's "Standalone Advisor" semantics
- Author `graph-metadata.json` with `derived.intent_signals`, `manual.depends_on`, `manual.related_to` matching the advisor's mechanical role
- Populate `feature_catalog/`, `manual_testing_playbook/`, `references/` with placeholder entries citing ADR-001 + the parent 015/009 spec.md for what will land in children 003-006
- Create an empty `mcp_server/` skeleton dir (child 003 fills it)
- Author `references/db-path-policy.md` documenting the constraint that `skill-graph.sqlite` will live under this skill folder once 003 moves the DB code
- Author `INSTALL_GUIDE.md` stub referencing the future launcher (child 004 authors the real install instructions)

No runtime behavior moves; no existing advisor code is touched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author/update `system-skill-advisor/SKILL.md` (overwrite empty stub with full frontmatter + body)
- Author `system-skill-advisor/graph-metadata.json` (new file)
- Audit existing `system-skill-advisor/README.md` + `ARCHITECTURE.md` — keep if content is accurate, replace if parallel-session content disagrees with ADR-001
- Author placeholder entries in `feature_catalog/`, `manual_testing_playbook/`, `references/` directories (at least 1 file each so directory has content beyond .gitkeep)
- Author `references/db-path-policy.md` documenting the future DB location
- Author `INSTALL_GUIDE.md` stub
- Create `mcp_server/` directory with a `.gitkeep` (child 003 fills it)
- Verify the package passes whatever skill-discovery validation exists (skill_graph_scan equivalent, or a quick `node` script that loads SKILL.md frontmatter + graph-metadata.json)

### Out of Scope
- Moving any advisor code from `mcp_server/skill_advisor/` to `system-skill-advisor/mcp_server/` (child 003)
- Moving the skill-graph DB code (child 003)
- Authoring the standalone MCP launcher (`skill-advisor-launcher.cjs`) (child 004)
- Updating 4-runtime MCP configs (child 004)
- Updating any hook wrappers, Python shims, or consumers (child 005)
- Adding deprecation proxies in `spec_kit_memory` (child 005)
- Removing old paths (child 006)
- Modifying the cosine lane, fusion math, weights, or any other 015 work
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | `system-skill-advisor/SKILL.md` has full frontmatter + body. | File parses as a valid SKILL.md (frontmatter present, description ≥ 80 chars, trigger_phrases ≥ 3 entries). |
| REQ-002 | `system-skill-advisor/graph-metadata.json` exists with proper structure. | Validates against the same schema other skill graph-metadata files use; carries `derived.intent_signals`, `manual.depends_on`, `manual.related_to`. |
| REQ-003 | Each non-empty directory carries ≥ 1 real content file (not just .gitkeep). | `feature_catalog/`, `manual_testing_playbook/`, `references/` each have ≥ 1 markdown file. |
| REQ-004 | `references/db-path-policy.md` documents constraint A. | File names the future path `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. |
| REQ-005 | `INSTALL_GUIDE.md` stub references the future launcher. | File mentions `skill-advisor-launcher.cjs` and notes "child 004 wires this". |
| REQ-006 | `mcp_server/` directory exists with `.gitkeep` (or stub README). | Directory present; child 003 will populate. |
| REQ-007 | Parity test regression resolves OR is documented as still-broken. | Run `vitest run skill_advisor/tests/parity` after authoring; if failures drop, note; if not, document why (TS projection may still need a separate fix). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes.
- **SC-002**: `npm run typecheck` passes (no code changed, but typecheck runs anyway as a safety net).
- **SC-003**: skill_advisor Vitest suite stays at ≤ 3 failures (the 3 currently-known: plugin-bridge + 2 parity from prior parallel-session collateral). Improvement to ≤ 1 failure (back to baseline) is a bonus.
- **SC-004**: `system-skill-advisor/SKILL.md` + `graph-metadata.json` parse cleanly via node JSON/YAML load.
- **SC-005**: No production advisor code modified. `mcp_server/skill_advisor/**` byte-identical pre-and-post.
- **SC-006**: `lane-registry.ts` byte-identical (still 0.42/0.28/0.13/0.12/0.05).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The empty SKILL.md / missing graph-metadata.json causes skill-discovery to crash on scan | Advisor calls fail | Author both files before running any scan; verify with `node` JSON/YAML load |
| Risk | Authored SKILL.md content conflicts with parallel-author ARCHITECTURE.md / README.md | Doc drift | Audit the parallel content; treat ADR-001 as source of truth; reconcile or replace |
| Risk | Parity test stays broken after scaffold | Indicates the root cause is elsewhere | Run vitest before + after; document the delta; defer further investigation to a follow-on if needed |
| Dependency | ADR-001 shipped (`07c612f8a`) | Locks the shape | Already on main |
| Dependency | Empty `.opencode/skills/system-skill-advisor/` folder exists with partial stubs | Substrate | Already on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Whether to keep or replace the parallel-author ARCHITECTURE.md content (recommend: audit + keep if accurate, replace if it contradicts ADR-001)
- Whether to author placeholder feature_catalog / playbook content from scratch OR copy-and-rebrand from the current advisor's docs under `mcp_server/skill_advisor/feature_catalog/` (recommend: copy-and-rebrand to preserve intent)
- Whether `mcp_server/` gets `.gitkeep` or a stub README (recommend: stub README naming "child 003 will fill")
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-Q01 | Quality | SKILL.md follows the schema other skills in `.opencode/skills/<id>/` use. |
| NFR-R01 | Reliability | All 17+ active skills still discoverable post-scaffold (the new one becomes 18th). |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Existing SKILL.md stub has any content: overwrite cleanly with proper frontmatter + body.
- Existing graph-metadata.json missing entirely (current state): create from scratch using the per-skill schema seen in other `.opencode/skills/<id>/graph-metadata.json` files.
- ARCHITECTURE.md content conflicts with ADR-001: rewrite to match ADR-001; flag in implementation-summary.
- Parity test still fails after scaffold: document and defer; do not block packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 0 lines of code; ~600-1000 lines of markdown + JSON | Pure scaffold |
| **Surface area** | One skill folder + 1 mcp_server stub | Self-contained |
| **Risk** | Low | No production code touched; envelope-only |
| **Reversibility** | High | Single-commit revert removes the package + restores prior empty-stub state |
<!-- /ANCHOR:complexity -->
