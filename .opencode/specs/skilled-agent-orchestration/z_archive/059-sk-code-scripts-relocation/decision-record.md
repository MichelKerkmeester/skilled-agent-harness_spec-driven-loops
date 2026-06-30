---
title: "Decision Record: Phase 072 sk-code scripts relocation"
description: "ADR-001 records the decision to move root Webflow scripts into the Webflow asset scripts tree and generic alignment-drift scripts into the root asset scripts tree."
trigger_phrases:
  - "phase 072 adr"
  - "sk-code scripts relocation decision"
  - "alignment drift destination"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/059-sk-code-scripts-relocation"
    last_updated_at: "2026-05-05T20:52:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed ADR evidence"
    next_safe_action: "Review final diff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000072"
      session_id: "phase-072-sk-code-scripts-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Alignment-drift validator is generic/OpenCode alignment tooling and belongs in assets/scripts."
---
# Decision Record: Phase 072 sk-code scripts relocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Relocate sk-code/scripts/ to asset script folders

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | cli-codex, user-approved Phase 072 scope |

---

<!-- ANCHOR:adr-001-context -->
### Context

The root `.opencode/skills/sk-code/scripts/` folder currently contains tooling named for Webflow minification plus alignment-drift validation that needs inspection. `sk-code` already organizes stack-specific knowledge under `assets/<surface>/` and `references/<surface>/`, so Webflow-specific scripts fit better under `assets/webflow/scripts/`.

### Constraints

- Use `git mv` for the five scoped scripts.
- Do not change script behavior or delete script content.
- Update old-path references textually, without broader refactors.
- If alignment drift is generic rather than Webflow-specific, move those two files to a sibling generic scripts folder.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Relocate Webflow-specific root scripts to `.opencode/skills/sk-code/assets/webflow/scripts/` and relocate the generic alignment-drift validator/test pair to `.opencode/skills/sk-code/assets/scripts/`.

**How it works**: The three minification scripts move directly to the Webflow scripts asset folder. The alignment-drift validator and its test move to a root asset scripts folder because inspection showed OpenCode and multi-language alignment checks, not Webflow/CDN behavior.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Split Webflow scripts and generic alignment scripts** | Co-locates Webflow tooling with Webflow assets while keeping generic alignment checks in a neutral asset folder. | Requires two destination paths in references. | 10/10 |
| Move all scripts to `assets/webflow/scripts/` | Simple destination and matches minification tooling. | Misclassifies generic OpenCode alignment validation as Webflow-specific. | 6/10 |
| Keep `scripts/` at root with stack-specific filenames | Minimal movement. | Keeps mixed concerns and weakens surface ownership. | 4/10 |
| Move all scripts to generic `assets/scripts/` | Clears root folder. | Hides Webflow ownership for Webflow-only utilities. | 5/10 |

**Why this one**: The evidence splits the files cleanly. Minification utilities are Webflow-specific, while `verify_alignment_drift.py` says it checks OpenCode codebases across TypeScript, JavaScript, Python, Shell, JSON, and JSONC.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- `sk-code` root becomes cleaner because stack-specific tooling leaves the root `scripts/` folder.
- Webflow minification and verification helpers live beside Webflow assets and guidance.
- Future surfaces can follow `assets/<surface>/scripts/` without mixed root ownership.

**What it costs**:
- Existing references must be updated. Mitigation: use inventory-first exact string replacement and stale-reference grep.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Alignment-drift validator is generic | Resolved | Inspection confirms generic/OpenCode alignment scope, so it moves to `assets/scripts/`. |
| Old references remain | Medium | Run the prompt-provided stale-reference grep excluding this packet. |
| Executable bit drift | Low | Use `git mv` and verify with `ls -la`. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The root script folder contains surface-specific tooling. |
| 2 | **Beyond Local Maxima?** | PASS | Generic and status-quo alternatives were compared. |
| 3 | **Sufficient?** | PASS | This is a relocation and reference update, not a behavior rewrite. |
| 4 | **Fits Goal?** | PASS | It directly implements Phase 072 scope. |
| 5 | **Open Horizons?** | PASS | It preserves a pattern for future `assets/<surface>/scripts/` ownership. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Three minification-related `.mjs` scripts move to `.opencode/skills/sk-code/assets/webflow/scripts/`.
- Alignment-drift validator and test move to `.opencode/skills/sk-code/assets/scripts/`.
- All old-path references in the inventory are updated to the selected new paths.

**Inspection verdict**: Generic/OpenCode alignment tooling. The validator docstring says "Lightweight recurring alignment checks for OpenCode codebases" and lists TS, JS, Python, Shell, JSON, and JSONC coverage. `rg` found no Webflow, CDN, `src/2_javascript`, Motion, or gsap references in the validator/test pair.

**Affected references**: 41 non-packet inventory files updated. Full initial inventory is in `scratch/initial-inventory.md`.

**How to roll back**: Move the five scripts back with `git mv`, revert only the path-string updates made from the inventory, and rerun stale-reference grep plus strict spec validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
