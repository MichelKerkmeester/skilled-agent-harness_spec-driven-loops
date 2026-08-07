# Iteration 012 — T4 current-state generalization residue + product.md analog

**Focus:** peck product.md "current-state living doc" vs what 003-current-state-discipline shipped + live PHASE_PARENT_CONTENT + description.json.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.62.

## Findings (residue)
- **[F-012-01]** current-state-only discipline is still PHASE-PARENT-scoped — live `PHASE_PARENT_CONTENT` runs only when `is_phase_parent()` true, skips regular folders (`check-phase-parent-content.sh:19,21`). SHIPPED? partial. **ADAPT** · low-med · med false-positive risk · blast: validator + docs.
- **[F-012-02]** 003 intended broader long-lived-doc discipline but is NOT shipped — its impl-summary says "nothing has shipped yet", verification pending (`003/spec.md:94,104`, `003/implementation-summary.md:51,96`). SHIPPED? no. **ADAPT** · M.
- **[F-012-03]** non-parent spec.md generalization is EXPLICIT residue — 003 deferred it to wave 2 to limit false positives (`003/spec.md:94,104`, `validation_rules.md:160`). SHIPPED? no. **DEFER** · M/H · high false-positive risk in requirements/history sections.
- **[F-012-04]** spec-kit lacks a CURATED product.md analog — no single "system is now" narrative surface (peck product.md = shipped features + non-goals + honest limitations) (`product.md:5,10,14` vs `system-spec-kit/README.md:182-192`). SHIPPED? no. **ADAPT** · M · med duplication/drift risk.
- **[F-012-05]** `description.json` is METADATA, not the narrative surface (level/slug/parent-chain/timestamps, not purpose/features/limitations) (`description.json:2-11`). SHIPPED? no. **ADOPT** a curated narrative SEPARATELY; keep description.json metadata-only · M · low-med.

## Ruled out
- phase-parent current-state discipline already shipped (PHASE_PARENT_CONTENT warn-severity, fence/comment-aware).
- hard-blocking current-state enforcement already rejected by 003 (INFO/advisory only, no ERROR).

## Verdict contribution
T4's adoption (003) is NARROWER than its own planned wave-1 AND still pending. Residue: (a) generalize current-state discipline to implementation-summary.md [ADAPT — extends pending 003 wave-1, coordinate]; (b) non-parent spec.md [DEFER, high FP]; (c) a curated product.md-style "system now" narrative surface distinct from description.json [ADOPT, modest]. Most of this belongs as a FOLLOW-ON to the pending 003, not a new packet — coordination note for the proposal.
