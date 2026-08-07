---
title: "Decision Record: 131/007 — Deep-* Commands Relocation"
description: "ADR for deep-* command asset strategy, co-location, and naming convention."
trigger_phrases:
  - "131/007 ADR"
  - "deep commands relocation decision"
  - "asset naming convention deep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/007-deep-stack-cross-cutting/002-commands-relocation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Authored ADR-001 for asset strategy and naming."
    next_safe_action: "Proceed to WAVE 1: asset relocation."
---
# Decision Record: 131/007 — Deep-* Commands Relocation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Deep-* Command Asset Strategy + Naming Convention

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | deepseek-v4-pro (WAVE 0 scaffolder), operator confirmed in pre-plan clarification |

<!-- ANCHOR:adr-001-context -->
### Context

Three deep-* slash commands (`deep:review`, `deep:research`, `deep:ai-council`) moved their command MD files to `.opencode/commands/deep/` and registered as live skill names in the registry. However, their workflow asset YAMLs, Gemini TOML wrappers, and ~25 live operator-facing references still use the old `spec_kit/` namespace:

1. **6 workflow YAMLs** at `.opencode/commands/speckit/assets/speckit_deep-{review,research,council}_{auto,confirm}.yaml` — loaded by the command MD files via `assets/spec_kit/` path references.
2. **2 Gemini TOMLs** at `.gemini/commands/speckit/deep-{review,research}.toml` — no `ai-council.toml` exists at either location.
3. **~25 live references** across SKILL.md files, `skill_advisor.py` routing tables (~340 lines of trigger-phrase scoring), agent definitions (4 runtimes × 3 skills), root docs (CLAUDE.md, AGENTS.md, README.md), install guides, and 9 `graph-metadata.json` files.
4. **~5,267 historical spec-doc references** in `.opencode/specs/` and `.opencode/skills/` changelogs/playbooks that reference old paths/syntax.

The relocation needs a single coherent strategy for: where assets live relative to commands, how assets are named, and whether historical references get updated or left as audit trail.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**1. Co-locate assets alongside their commands under `commands/deep/assets/`.**

Rationale: Keeping workflow YAMLs in `spec_kit/assets/` while commands live in `commands/deep/` creates cognitive load. Co-location follows the principle that command definition + command assets belong together.

Path mapping:
```
OLD: .opencode/commands/speckit/assets/speckit_deep-{skill}_{auto,confirm}.yaml
NEW: .opencode/commands/deep/assets/deep_{skill}_{auto,confirm}.yaml
```

**2. Name assets with skill slug, not command slug: `deep_ai-council_*` matches `deep:ai-council` skill name.**

The registry skill name is `deep:ai-council` (not `deep:council`). Using `deep_ask-ai-council_auto.yaml` keeps the asset filename consistent with the skill identifier.

Naming table:
```
OLD: spec_kit_deep-review_auto.yaml     → NEW: deep_start-review-loop_auto.yaml
OLD: spec_kit_deep-review_confirm.yaml  → NEW: deep_start-review-loop_confirm.yaml
OLD: spec_kit_deep-research_auto.yaml    → NEW: deep_start-research-loop_auto.yaml
OLD: spec_kit_deep-research_confirm.yaml → NEW: deep_start-research-loop_confirm.yaml
OLD: spec_kit_deep-council_auto.yaml     → NEW: deep_ask-ai-council_auto.yaml
OLD: spec_kit_deep-council_confirm.yaml  → NEW: deep_ask-ai-council_confirm.yaml
```

**3. Preserve historical references in `z_archive/` and early changelogs as audit trail; update all live operator-facing surfaces.**

WAVE 4 (bulk-sed of ~5,267 spec docs) updates historical references for cleanliness. Exclusions: `.git/` (immutable), `z_archive/` (frozen audit trail), and changelogs prior to `v1.0.0.0.md` (historical record).
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **Co-locate assets in `commands/deep/assets/`** | Single directory for command + assets; intuitive | Requires updating ~25 refs + ~5,267 historical | **Accepted** |
| Keep assets shared in `spec_kit/assets/` | Minimal churn (~0 ref updates) | High cognitive load (two directories for one command); violates co-location principle | Rejected |
| Rename `ai-council` back to `council` for naming consistency | Shorter filename (`deep_council_*`) | Loses sibling consistency with `deep:ai-council` skill name; would require re-renaming 13 leaf phases | Rejected |
| Skip WAVE 4 (historical bulk-sed) | Saves ~20 min wall-clock | Leaves grep noisy; undermines "reference cleanliness" success criterion | Rejected (user confirmed inclusion) |
| Use `git mv` for all renames | Preserves git history | `.git/index.lock` conflicts with cli-opencode sandbox | Rejected (use plain `mv`) |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Clean co-location: command definitions + assets in one tree (`commands/deep/`)
- Sibling-consistent naming: `deep_ai-council_*` matches `deep:ai-council` skill name and `commands/deep/ask-ai-council.md` file
- Grep-friendly codebase: no stale `spec_kit/` references in live surfaces after WAVE 1-2
- Cross-runtime consistency: Gemini TOMLs live alongside their opencode command counterparts

**Negative**:
- ~5,267 historical spec-doc references need updating (WAVE 4) — bulk sed operation at scale
- `skill_advisor.py` requires semantic-review edit (not blind sed)
- Gemini `ai-council.toml` must be authored from scratch

**Risks**:
| Risk | Mitigation |
|------|------------|
| DeepSeek-v4-pro may miss edge cases in bulk sed | Apply sed patterns in specificity order; verify with targeted `rg` after WAVE 4; tolerate ≤ 10 residual hits |
| `skill_advisor.py` trigger-phrase edit may break unrelated scoring | Use Edit tool with surrounding-context uniqueness checks; run smoke after WAVE 3 |
| `.claude/commands/deep/` symlinks may break after relocation | Verify and re-create if needed after WAVE 1 |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Check Review

| Lens | Result |
|------|--------|
| **Correctness** | Asset paths resolve correctly: command MDs load YAMLs from `deep/assets/`; Gemini TOMLs point to relocated command MDs; all 4 runtimes resolve via their respective mirror mechanisms. |
| **Completeness** | All asset paths, command refs, slash syntax, and skill-graph edges covered. WAVE 1 covers filesystem, WAVE 2 covers live refs, WAVE 3 covers verification, WAVE 4 covers history. |
| **Consistency** | Naming follows `deep_{skill-slug}_{mode}.yaml` pattern throughout. Slash syntax is `/deep:<skill>` across all surfaces. |
| **Clarity** | Co-location is self-documenting: `commands/deep/` contains everything needed for deep-* commands. |
| **Testability** | Each wave has explicit verification gates. End-to-end gates are deterministic `ls`/`rg`/`vitest` checks. |
<!-- /ANCHOR:adr-001-five-checks -->

### Evidence

- **Explore findings**: Confirmed 6 YAMLs at old path, 2 Gemini TOMLs at old path, ~25 live refs, ~5,267 historical refs.
- **Skill registry**: `deep:review`, `deep:research`, `deep:ai-council` are live skill names.
- **Runtime mirrors**: `.codex/commands/` → `.opencode/commands/` (symlink); `.claude/commands/deep/` mirrors `.opencode/commands/deep/`; `.gemini/commands/deep/` is the target for new TOMLs.
- **This packet's spec.md**: Requirements REQ-001 through REQ-006 map to WAVE 1-4 deliverables.

<!-- ANCHOR:adr-001-impl -->
**Implementation Notes**:
- WAVE 1 uses plain `mv` (not `git mv`) per constraint.
- WAVE 2 splits into sub-batches if DeepSeek context budget is at risk.
- WAVE 4 sed order: `spec_kit_deep-council_` → `spec_kit_deep-review_` → `spec_kit_deep-research_` → path prefixes → slash syntax.
- WAVE 4 exclusions: `.git/`, `z_archive/`, `changelog/v1.0.0.0.md` and earlier.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
