---
title: "Implementation Plan: Phase 6: advisor-and-integration"
description: "Plan the class-aware referrer sweep: repoint the functional advisor referrers and constitutional path templates, repoint the reciprocal graph edges, regenerate skill-graph.json from metadata, exercise the CI card-sync gate, and leave the logical-name executor-kind strings untouched."
trigger_phrases:
  - "advisor integration plan"
  - "cli referrer sweep plan"
  - "constitutional path repoint plan"
  - "skill graph regeneration plan"
  - "phase 006 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the class-aware referrer sweep plan"
    next_safe_action: "Execute the sweep after phase 005"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - "CLAUDE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 0
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
| **Language/Stack** | Markdown/JSON docs, a Python advisor script, a shell CI gate, generated `skill-graph.json` |
| **Framework** | OpenCode skill hub plus the skill-advisor graph compiler |
| **Storage** | Filesystem docs, advisor mcp_server, generated graph artifact |
| **Testing** | Stale-path grep sweep, logical-name no-op grep, CI card-sync gate, graph regeneration diff |

### Overview
This phase completes the referrer cleanup left after the structural fold-in. It repoints the remaining functional and constitutional path referrers and the reciprocal graph edges, regenerates the advisor graph from metadata, and exercises the CI card-sync gate — while proving the logical-name executor-kind strings stayed untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 005 landed the move, dissolution, and green scorer
- [ ] The phase 001 breakage-class taxonomy is available to gate the sweep
- [ ] The advisor rebuild/compiler command is confirmed available

### Definition of Done
- [ ] Zero stale active old-flat-path references outside `cli-external/` and historical text
- [ ] Constitutional path templates and reciprocal edges name `cli-external`; `skill-graph.json` regenerated
- [ ] CI card-sync gate passes; logical-name executor-kind strings provably untouched
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Class-aware referrer sweep followed by graph regeneration and a CI gate.

### Key Components
- **Functional referrers**: `skill_advisor.py` alias maps and the literal path key; `outsourced-agent-handback-docs.vitest.ts`'s hardcoded flat cli paths; the CI card-sync gate + its workflow (verified — per-skill paths already repointed in 004/005).
- **Constitutional referrers**: the cli-dispatch preload path template in `CLAUDE.md`, `AGENTS.md`, and `cli-dispatch-skill-preload.md`.
- **Reciprocal edges**: `sk-prompt/graph-metadata.json` (and any other) `enhances` edges into the old flat identities, repointed to `cli-external`.
- **Generated graph**: `skill-graph.json`, regenerated from the merged metadata.
- **Logical-name class**: untouched — verified by a targeted no-op grep.

### Data Flow
The sweep reads the phase 001 taxonomy, repoints only the functional and constitutional path referrers, repoints reciprocal edges in `graph-metadata.json`, and then regenerates `skill-graph.json` from that metadata through the advisor rebuild path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill_advisor.py` alias maps | Hardcoded lexical alias-to-id maps incl. a literal path key | Repoint to the hub layout | Alias resolution reaches the hub packets |
| `CLAUDE.md` / `AGENTS.md` / `cli-dispatch-skill-preload.md` | Constitutional cli-dispatch preload path template | Repoint to `.opencode/skills/cli-external/cli-X/SKILL.md` | Grep confirms the nested path form |
| `sk-prompt/graph-metadata.json` reciprocal edges | `enhances` edges into old flat identities | Repoint to `cli-external` | Edge target reads `cli-external` |
| `skill-graph.json` | Generated advisor graph | Regenerate from metadata | Diff shows generated output only |
| logical-name executor-kind strings | Dispatch by config kind, not path | Leave unchanged | Targeted grep shows no change |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 005 landed; load the phase 001 breakage-class taxonomy
- [ ] Re-run the referrer grep sweep for the old flat paths against the live worktree
- [ ] Confirm the advisor rebuild/compiler command is available

### Phase 2: Core Implementation
- [ ] Repoint the `skill_advisor.py` alias maps and the literal path key to the hub layout
- [ ] Repoint the constitutional path templates in `CLAUDE.md`, `AGENTS.md`, and `cli-dispatch-skill-preload.md`
- [ ] Repoint the reciprocal `enhances` edges to `cli-external`, the `outsourced-agent-handback-docs.vitest.ts` hardcoded flat paths, and the active prose referrers
- [ ] Regenerate `skill-graph.json` from metadata; do not hand-edit

### Phase 3: Verification
- [ ] Re-run the stale-path grep sweep; confirm zero active hits outside `cli-external/` and historical text
- [ ] Run `check-prompt-quality-card-sync.sh` against the new layout
- [ ] Run the logical-name no-op grep and phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Stale-path sweep | Active files outside `cli-external/` | `grep -rl` for old flat paths |
| Logical-name no-op | Executor-kind strings | Targeted grep proving no change |
| CI gate | Prompt card sync | `check-prompt-quality-card-sync.sh` |
| Graph regen | Generated artifact | Advisor rebuild command + diff review |
| Template validation | Phase 006 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 structural change | Internal | Yellow until confirmed | Prose could repoint to paths that do not exist yet |
| Advisor rebuild/compiler command | Internal | Green expected | Generated graph drift cannot be closed without it |
| Phase 001 breakage-class taxonomy | Internal | Green | Without it, the sweep risks over-repointing logical-name strings |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The sweep touches a logical-name executor-kind string, corrupts historical text, or the CI gate fails after the repoint.
- **Procedure**: Revert the sweep edits, re-run the class-aware sweep against the phase 001 taxonomy, and re-regenerate `skill-graph.json` from metadata before re-validating.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
