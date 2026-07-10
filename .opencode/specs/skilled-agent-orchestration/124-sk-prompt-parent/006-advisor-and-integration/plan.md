---
title: "Implementation Plan: Phase 6: advisor-and-integration"
description: "Plan the phase 006 advisor and integration sweep for the sk-prompt parent-hub merge. The approach is a bounded referrer cleanup, generated advisor graph rebuild, and prompt-card sync gate exercise after the structural move has landed."
trigger_phrases:
  - "phase 006 implementation plan"
  - "advisor integration sweep"
  - "sk-prompt-models referrers"
  - "skill graph regeneration"
  - "prompt card sync"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-prompt-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-09T17:00:00Z"
    last_updated_by: "claude"
    recent_action: "Executed as planned; skill-graph.json regen deferred"
    next_safe_action: "Proceed to phase 007"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/006-advisor-and-integration/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/006-advisor-and-integration/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/006-advisor-and-integration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "draft-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: advisor-and-integration

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown, JSON, shell-scripted repository checks |
| **Framework** | OpenCode skill parent-hub metadata and Spec Kit documentation workflow |
| **Storage** | File-system skill metadata and generated advisor graph artifact |
| **Testing** | `grep -rl`, advisor graph rebuild/compiler command, `check-prompt-quality-card-sync.sh`, spec validation |

### Overview
Phase 006 executes a bounded integration cleanup after the structural fold-in: sweep active prose/doc references to the old flat `sk-prompt-models` skill, regenerate the advisor graph from the merged hub metadata, and exercise the prompt-card sync gate. The implementation should be mechanical and evidence-driven: inventory first, edit by category, verify with a full stale-reference sweep and the relevant generated/CI checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 005 structural move and functional path updates are present before prose is updated
- [ ] Referrer categories match the file groups listed in `spec.md`
- [ ] Historical spec/changelog references are distinguished from active operational references

### Definition of Done
- [ ] Active `sk-prompt-models` references are removed outside the folded `sk-prompt/` packet and historical spec/changelog text
- [ ] `skill-graph.json` is regenerated from metadata, not hand-edited
- [ ] `check-prompt-quality-card-sync.sh` passes against the new layout
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical referrer sweep plus generated-artifact rebuild.

### Key Components
- **Active referrer set**: The documentation, playbook, install-guide, and root-doc files that still mention the old flat skill identity.
- **Advisor graph metadata**: The hub `graph-metadata.json` remains the source of truth; `skill-graph.json` is regenerated from it.
- **Prompt-card sync gate**: The workflow-backed script validates prompt-card content against the new layout.

### Data Flow
The future executor inventories stale strings, updates active referrers by category, rebuilds generated advisor graph output from source metadata, then runs the prompt-card sync script and final grep sweep to prove no active stale references remain.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Advisor and graph files | Own advisor identity and generated graph output | Regenerate graph output from updated hub metadata; do not hand-edit generated JSON | Advisor rebuild/compiler output and generated-file diff review |
| `cli-opencode` docs and assets | Consume small-model prompt-craft guidance before dispatch | Update prose, cards, templates, permission examples, and prompt-template playbooks | Category grep plus prompt-card sync check |
| `system-deep-loop/deep-improvement` docs/assets | Reference small-model prompt-craft and model-benchmark behavior | Update stale references while keeping phase 007 benchmark execution out of scope | Category grep and review of benchmark-profile prose only |
| Manual-testing playbooks | Describe expected advisor/spec-kit integration behavior | Update only active playbook guidance in the named playbook groups | Category grep across named playbook directories |
| Install guides and root docs | Present operator-facing setup and skill inventory guidance | Update references to folded `sk-prompt/prompt-models` structure | Full active-path grep sweep |

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
- [ ] Confirm phase 005 has moved `sk-prompt-models` under `sk-prompt/prompt-models` and repointed the functional runtime/write-target paths.
- [ ] Capture a baseline `grep -rl "sk-prompt-models"` over active paths and separate historical spec/changelog hits from operational referrers.
- [ ] Identify the advisor rebuild/compiler command used by the repository before changing generated graph output.

### Phase 2: Core Implementation
- [ ] Update advisor/graph source references so the surviving hub metadata carries the folded `prompt-models` routing and `enhances -> cli-opencode` signal.
- [ ] Update `cli-opencode` README, skill doc, assets, references, and prompt-template playbooks.
- [ ] Update `system-deep-loop/deep-improvement` docs and benchmark-profile prose without running the Lane-C benchmark.
- [ ] Update `system-skill-advisor` and `system-spec-kit` manual-testing playbooks in the named groups.
- [ ] Update `.opencode/skills/README.md`, install guides, `AGENTS.md`, and `README.md`.
- [ ] Regenerate `skill-graph.json` through the advisor rebuild/compiler path.

### Phase 3: Verification
- [ ] Re-run the full stale-reference sweep and confirm active paths are clean outside the folded packet and historical spec/changelog text.
- [ ] Run `check-prompt-quality-card-sync.sh` through the workflow's sync-check path.
- [ ] Review generated artifact diffs to confirm `skill-graph.json` was regenerated, not manually rewritten.
- [ ] Run the spec-folder validation gate for this phase before claiming completion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Search | Active stale-reference inventory and final clean sweep | `grep -rl "sk-prompt-models"` |
| Generated artifact | Advisor graph output after metadata fold-in | Repository advisor rebuild/compiler command |
| CI integration | Prompt quality card synchronization | `check-prompt-quality-card-sync.sh` and `.github/workflows/prompt-card-sync.yml` path parity |
| Documentation | Phase packet validity | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 structural move and functional path updates | Internal | Required before execution | Prose could point to paths that do not exist, and `/deep:model-benchmark` could still write to the dead path. |
| Hub `graph-metadata.json` folded identity content | Internal | Required before graph regeneration | Generated advisor graph would drop `prompt-models` signals or the `enhances -> cli-opencode` edge. |
| Advisor rebuild/compiler command | Internal | Required for generated graph output | `skill-graph.json` cannot be safely updated. |
| Prompt-card sync script | Internal CI gate | Required for P1 verification | CI could continue to validate the old layout or fail after the rename. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Final grep still finds active stale references, advisor graph regeneration fails, or the prompt-card sync gate fails for reasons introduced by this phase.
- **Procedure**: Revert the phase 006 referrer edits and regenerated graph artifact through normal version-control review, restore the last passing prompt-card state, then re-run the baseline grep before retrying the category that failed.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
