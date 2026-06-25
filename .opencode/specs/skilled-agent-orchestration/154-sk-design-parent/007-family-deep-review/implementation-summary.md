---
title: "Implementation Summary: Phase 7: family-deep-review"
description: "Outcome of the sk-design family deep review and remediation: per-skill findings and fixes, the six version bumps, packaging and routing verification, and the deferred repo-wide derived-sync follow-up."
trigger_phrases:
  - "sk-design family deep review summary"
  - "sk-design family remediation outcome"
  - "sk-design family version bumps result"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/007-family-deep-review"
    last_updated_at: "2026-06-25T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the family deep-review outcome, fixes, versions, and follow-ups"
    next_safe_action: "Resolve the deferred repo-wide derived-sync when the regenerator is available"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "review/triage-final.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/007-family-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All six family skills pass package_skill.py --check after remediation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-family-deep-review |
| **Completed** | 2026-06-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The six sk-design family skills went through their first adversarial multi-model review and came out remediated. Two independent models, Opus 4.8 and GPT-5.5-fast (xhigh), each ran five iterations per skill in skill-target mode, roughly 58 iterations in all. No P0 surfaced anywhere. Every confirmed and source-verified finding was then fixed by a per-skill agent, each skill was version-bumped and changelogged, and each still passes its packaging check. The headline correctness fix repointed the umbrella's SPEC/DESIGN route from a child that does not exist on disk to the one that does.

### Cross-model review and triage

You can now trust the family at the package level, not just the build level. The twelve reports are consolidated in `review/triage-final.md`, which carries the verdict matrix, the Tier-1 confirmed findings (flagged by both models and verified at file:line), the Tier-2 single-model hypotheses, and the cross-cutting themes. Verdicts were CONDITIONAL across the board, with two reconciled edge cases: `sk-design-motion` got a gpt PASS while opus stayed CONDITIONAL, and `sk-design` got a gpt FAIL that traced to spec-folder gates being applied to a skill target, an applicability artifact rather than a skill defect (opus marked it n/a).

### Per-skill remediation

Each skill's fix is recorded in its own changelog; this is the cross-family roll-up.

- **sk-design (umbrella) -> 1.0.1.0.** The SPEC / `DESIGN.md` intent routed to `sk-design-spec`, which is not on disk; it now routes to `sk-design-md-generator` in both the routing table and the `ROUTE_TO_CHILD` pseudocode, with a note that a dedicated `sk-design-spec` child may split this out later. Router pseudocode hygiene followed: zero-signal prompts return the `UNKNOWN_FALLBACK` checklist, the dead low-confidence branch was removed, and the `LOAD_LEVELS` map is now actually read. A `metadata.family: sk-code` block was added to match `graph-metadata.json`.
- **sk-design-md-generator -> 1.0.0.1.** The documented extract command was refused by the output guard, because the docs told operators to `cd backend` first, which made the relative `--output` resolve inside the skill. The docs now pin a single canonical contract: one-time setup from `backend/`, every pipeline script from the repo root. The detector and interaction schema docs were reconciled to the real output shape (framework in `tokens.json meta.framework`, interaction diffs in `components[].variants[]`, design boundary in the sibling `extraction-report.json`), several front-door doc inaccuracies were corrected, and `validate.ts` heading matching was anchored to line-start.
- **sk-design-interface -> 1.5.1.0.** `references/aesthetics/` presented brutalist/minimalist/soft/apple-bento as selectable presets, contradicting the skill's own no-preset rule. The corpus is kept but recast as illustrative grounding cues to critique against, never a chooser, and wired into routing/references/`key_files` so it is no longer orphaned. `allowed-tools` was narrowed from a six-tool write-capable set to `[Read, Grep, Glob, Task]`, matching a judgment-only skill, and the Mobbin/Refero lookups are documented as Code Mode manuals rather than in-skill tools.
- **sk-design-foundations -> 1.0.0.1.** A single canonical color-role set (`primary/accent`, `neutral`, `semantic`, `surface`, `border`, `text`) is now referenced identically by the SKILL.md, the color references, and the color playbook, with `focus` documented as an accent state. Layout, spacing, and grid decisions now resolve to `sk-design-foundations` first, ahead of `sk-code`. Router pseudocode and a redundant sibling graph edge were cleaned up.
- **sk-design-motion -> 1.0.1.0.** The Smart Router `DEFAULT_RESOURCE` collided with the STRATEGY intent's resource, so a strategy/timing prompt self-reported a false "no keyed knowledge base" notice; it now points at `references/corpus_map.md`, matching the foundations and audit siblings. The fastest-tier timing guidance was reconciled with the 100/300/500 rule, and a new `MOTION-MICRO-001` playbook scenario plus corpus traceability were added.
- **sk-design-audit -> 1.0.0.1.** `Bash` was removed from `allowed-tools` (a read-only review skill with no shipped shell use); `metadata.family` was set to `sk-code`; `graph-metadata.json` `key_files` were expanded to cover routable resources; the `sk-design` sibling weight was brought into the `[0.4, 0.6]` band; and an unreachable router default was removed. Feature-catalog coverage and playbook repeatability were also improved.

### Files Changed

The substantive skill edits live inside each skill package and are itemized in each skill's changelog. This spec folder is the record of the campaign.

| File | Action | Purpose |
|------|--------|---------|
| `review/triage-final.md` + twelve `review/<skill>/{opus48,gpt55xhigh}/review-report.md` | Created (evidence) | The 2-model review output and consolidated triage |
| `.opencode/skills/sk-design/changelog/v1.0.1.0.md` | Created | Umbrella routing-authority + pseudocode remediation |
| `.opencode/skills/sk-design-interface/changelog/v1.5.1.0.md` | Created | Aesthetics-as-cues + tool-contract remediation |
| `.opencode/skills/sk-design-md-generator/changelog/v1.0.0.1.md` | Created | Extract-contract + schema-doc remediation |
| `.opencode/skills/sk-design-foundations/changelog/v1.0.0.1.md` | Created | Color-role + routing-precedence remediation |
| `.opencode/skills/sk-design-motion/changelog/v1.0.1.0.md` | Created | Router-default + timing remediation |
| `.opencode/skills/sk-design-audit/changelog/v1.0.0.1.md` | Created | Least-privilege + metadata remediation |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Created | This phase record |
| `../spec.md` | Modified | Appended the Phase 7 row to the parent phase-documentation map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran as a fan-out then a fan-in. First a smoke check confirmed each skill was review-ready, then both models reviewed all six skills in parallel in skill-target mode. The twelve reports were merged into one cross-model triage that promoted only the findings both models raised, while every single-model finding was re-verified at its file:line before anyone touched it. Per-skill fix agents then remediated the confirmed and verified findings, bumped each skill's version, and wrote its changelog. Verification closed the loop: `package_skill.py --check` on all six skills, a typecheck plus 68/68 vitest run on the md-generator engine, and a live advisor rebuild whose SPEC/DESIGN query confirmed routing now lands on `sk-design-md-generator`. Because each fix is scoped to one skill package and recorded in that skill's changelog, the rollback unit is a single skill's remediation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require both models to flag a finding before treating it as confirmed | A single model can hallucinate a defect; cross-model agreement plus a source check keeps fixes grounded in real symptoms |
| Repoint the SPEC/DESIGN route to `sk-design-md-generator` rather than create `sk-design-spec` | The real shipped child is the md-generator; pointing the route at a non-existent child was the actual bug, and a future split is left as a noted deferral |
| Keep the aesthetics corpus but reframe it as grounding cues | Deleting it loses useful reference material; the contradiction was the chooser framing, not the content, so reframing fixes the contract without throwing away value |
| Narrow `allowed-tools` on the read-only/judgment skills | audit and interface granted tools they never use; least privilege matches the grant to actual shipped behavior |
| Defer the repo-wide derived-sync instead of forcing it | The schema-v2 regenerator is not locatable in this checkout; the graph is structurally valid and routing works, so a forced hand-edit would risk more than it fixes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` on sk-design | PASS |
| `package_skill.py --check` on sk-design-interface | PASS |
| `package_skill.py --check` on sk-design-md-generator | PASS |
| `package_skill.py --check` on sk-design-foundations | PASS |
| `package_skill.py --check` on sk-design-motion | PASS |
| `package_skill.py --check` on sk-design-audit | PASS |
| `sk-design-md-generator` typecheck + vitest | PASS (68/68) |
| Advisor rebuild + SPEC/DESIGN routing query | PASS (resolves to `sk-design-md-generator`) |
| P0 findings across all twelve reviews | 0 (per `review/triage-final.md`) |
| Version bumps + changelog entries for all six skills | PASS (1.0.1.0 / 1.5.1.0 / 1.0.0.1 / 1.0.0.1 / 1.0.1.0 / 1.0.0.1) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Repo-wide graph-metadata derived-sync is deferred.** The skill `graph-metadata.json` derived blocks lack the schema-v2 `sanitizer_version`, and the regenerator tool that would backfill it is not locatable in this checkout. The graph is still structurally valid and the advisor routes correctly; the scan emits 45 advisory warnings. This belongs to a future family-wide metadata pass, not this review phase.
2. **Design-family reciprocal-edge and weight-band symmetry warnings remain.** Some sibling edges back to the parent are expressed only through `manual.related_to` rather than weighted reciprocal edges, and a few weight bands are advisory-flagged. These are advisory only and belong to the same coordinated family metadata pass.
3. **005/006 spec-doc completion-reconciliation is out of scope here.** The review's Tier-3 flagged the 006-integration-validation and 005-build-subskills "complete" claims for a completion-reconciliation check; that is owned by the orchestrator, not this phase.
4. **Routing was confirmed by a rebuild query, not live telemetry.** The SPEC/DESIGN route was verified against the rebuilt advisor; real-world routing distribution is not measured here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
