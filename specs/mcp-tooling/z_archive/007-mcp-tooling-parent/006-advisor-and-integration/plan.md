---
title: "Implementation Plan: Phase 6: advisor-and-integration"
description: "Plan to unify the hub graph identity, delete the three child graph files, retarget the advisor corpus, repoint doctor_mcp_install.yaml (and fix its stale mcp-open-design entry), update README catalogs, and restate the figma-transport prose."
trigger_phrases:
  - "advisor integration plan"
  - "hub graph union plan"
  - "referrer sweep plan"
  - "phase 006 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled integration plan; 2 P1 items stay deferred"
    next_safe_action: "Rebuild advisor skill-graph DB when scheduled"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: advisor-and-integration

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON graph metadata, YAML command assets, JSONL advisor corpus, Markdown docs |
| **Framework** | OpenCode advisor skill-graph plus doctor command wiring |
| **Storage** | Skill-local graph metadata plus repo-wide referrer files |
| **Testing** | Repo-wide grep sweep; advisor skill-graph rebuild; `validate.sh` for this phase folder |

### Overview
This phase makes the fold-in functionally complete: one hub graph identity, the three child graph files deleted, and every live functional/documentation referrer repointed, so the phase 007 benchmark measures a real hub.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All P0 acceptance criteria met; 2 P1 items are operator-approved deferrals (see Known Limitations)
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Identity union plus a functional-referrer repoint sweep, gated by a zero-live-hits grep.

### Key Components
- **Hub graph union**: Author `mcp-tooling/graph-metadata.json` from the three source graph files; preserve figma to sk-design and the union enhances to sk-code; record code-mode as an external cross-skill dependency; delete the three child files.
- **Reverse-edge repoint**: Repoint the inbound edges in `mcp-code-mode/graph-metadata.json` (`prerequisite_for` for the three bridges, `manual.related_to`) and `sk-design/graph-metadata.json` (`siblings`, `prerequisite_for`, `manual.related_to` for mcp-figma) from the bridge ids to `mcp-tooling` — a metadata-only edit to code-mode, in-bounds per ADR-005's carve-out.
- **Atomic window**: The child-identity deletion, hub-identity authoring, reverse-edge repoints, and advisor rebuild land as one change; the advisor is never rebuilt in the window between deletion and hub-identity authoring.
- **Functional repoint**: `doctor_mcp_install.yaml` bridge refs plus the stale `mcp-open-design` fix.
- **Advisor corpus + rebuild**: Retarget the 3 `labeled-prompts.jsonl` rows and rebuild the skill-graph DB.
- **Documentation**: README catalogs and the CLAUDE.md/AGENTS.md figma-transport restatement.

### Data Flow
The advisor reads the rebuilt skill-graph and routes tooling queries to the single `mcp-tooling` identity; `/doctor:mcp` reads the repointed `doctor_mcp_install.yaml` to find each bridge under its nested path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Three child `graph-metadata.json` | Separate advisor identities | Union into one hub file, then delete | Advisor routes to `mcp-tooling`; three child files gone |
| `mcp-code-mode` + `sk-design` `graph-metadata.json` | Hold inbound/reverse edges pointing at the deleted ids | Repoint reverse edges to `mcp-tooling` (metadata only) | Grep for the bridge ids across all `graph-metadata.json` returns zero after the sweep |
| `doctor_mcp_install.yaml` | `skill_dir`/`install_guide` refs for 3 bridges + stale `mcp-open-design` | Repoint the 3 bridges; correct the stale entry | Grep resolves each ref to a real nested path |
| `labeled-prompts.jsonl` | 3 rows target `mcp-chrome-devtools` | Retarget to `mcp-tooling` | Grep shows 0 rows targeting the old id |
| `mcp-code-mode` + `code_mode` + `.utcp` manuals | Shared substrate / name-keyed manuals | Unchanged | Confirm byte-identical after the sweep |

Required inventories:
- Same-class producers: `rg -n 'mcp-chrome-devtools|mcp-click-up|mcp-figma' .opencode/commands/doctor .opencode/skills/README.md README.md CLAUDE.md AGENTS.md`.
- Consumers of changed symbols: `rg -n '.opencode/skills/mcp-chrome-devtools/|.opencode/skills/mcp-click-up/|.opencode/skills/mcp-figma/' .` for live functional paths.
- Matrix axes: referrer classes (graph identity, functional path, advisor corpus, documentation catalog, constitutional prose).
- Algorithm invariant: the `code_mode` registration key and the name-keyed `.utcp_config.json` manuals must stay byte-unchanged; the only `mcp-code-mode` edit is its graph-metadata reverse edges; and the advisor skill-graph is never rebuilt between deleting the child identities and authoring the hub identity.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phases 004-005 complete: all three trees resolve under the hub
- [x] Re-run the phase 001 referrer sweep to refresh the live-hit inventory
- [x] Read the three source `graph-metadata.json` files for the union inputs

### Phase 2: Core Implementation
- [x] Author `mcp-tooling/graph-metadata.json` (union of intent signals, trigger phrases, outward edges; code-mode as external dep), delete the three child files, and repoint the reverse edges in `mcp-code-mode` and `sk-design` graph metadata — landed atomically; the advisor rebuild itself is a separate, still-deferred step (see Known Limitations)
- [x] Repoint `doctor_mcp_install.yaml` for the 3 bridges and fix the stale `mcp-open-design` entry
- [ ] Retarget the 3 `labeled-prompts.jsonl` rows to `mcp-tooling`; update README catalogs and the CLAUDE.md/AGENTS.md figma-transport prose — labeled-prompts and README catalogs done; CLAUDE.md/AGENTS.md prose restatement deferred (operator decision, repo-wide)

### Phase 3: Verification
- [x] Re-run the grep sweep; confirm zero live hits for the old flat skill-folder paths outside historical text
- [ ] Rebuild the advisor skill-graph DB and confirm `mcp-tooling` is re-keyed — deferred, coordinated operator-gated reindex
- [x] Confirm `mcp-code-mode`, `code_mode`, and the `.utcp` manuals are byte-unchanged; run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Referrer sweep | Repo-wide functional paths | `rg` for the three old skill-folder paths |
| Graph identity | Advisor routing | Skill-graph rebuild plus a routing smoke check |
| Untouched invariants | code-mode / utcp manuals | `git status` byte-identical confirmation |
| Template validation | Phase 006 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 004-005 complete | Internal | Green | Cannot sweep referrers until all trees resolve under the hub |
| Advisor skill-graph tooling | Internal | Green | Needed to re-key the hub identity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The graph union drops a needed edge, a functional referrer is left broken, or code-mode/utcp invariants are disturbed.
- **Procedure**: Restore the three child `graph-metadata.json` files and any over-edited referrer from git; re-run the union and repoint against the phase 001 inventory; re-verify the untouched invariants before retrying.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
