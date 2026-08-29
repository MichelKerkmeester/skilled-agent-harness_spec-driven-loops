---
title: "Implementation Plan: code-quality + shared-assets research backlog implementation"
description: "Level 2 plan for implementing the five ranked proposals from the 025 research packet: shared/README navigation rewrite plus checklist-label fix, pre-commit hook-doc alignment to both gates, an advisory CODE_QUALITY_RESULT v1 evidence envelope, comment-hygiene hook coverage (TH-002) plus a deep-review consumption note, and additive sk-code quality-mode router/advisor vocabulary, with the advisor-fixture slice and two deep-loop contract bugs deferred to their owning lanes."
trigger_phrases:
  - "code-quality shared implementation plan"
  - "sk-code code-quality implementation plan"
  - "code-quality shared assets implementation plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/026-code-quality-and-shared-implementation"
    last_updated_at: "2026-07-07T14:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Executed the five proposals' un-gated scope across ten files with drift-guards green"
    next_safe_action: "Register 026 under the 124 parent and validate --strict at close-out"
---
# Implementation Plan: code-quality + shared-assets research backlog implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill/hook documentation, YAML frontmatter, manual-testing playbook markdown, and JSON router/advisor metadata |
| **Framework** | sk-code surface-primary parent hub, its `code-quality` workflow sub-skill and `shared/` references, the `.opencode/hooks` pre-commit surface, and the sk-code mode-registry/hub-router/graph-metadata vocabulary |
| **Storage** | Repository filesystem under `.opencode/skills/sk-code/`, `.opencode/hooks/`, and this packet folder |
| **Testing** | vocab-sync drift-guard, parent-skill-check STRICT, sk-code router-sync vitest, grep assertions on display labels, manual-playbook total/index consistency, and strict spec validation at close-out |

### Overview
This packet implements the un-gated scope of the five ranked proposals produced by the `025-code-quality-and-shared-research` deep-research loop. The work is docs and JSON only — no new TypeScript or runtime logic. It rewrites the stale `sk-code/shared/README.md` into real navigation over `shared/references/` and fixes the `assets/opencode-checklists/` display label to `assets/checklists/` (labels only, hrefs preserved); aligns `.opencode/hooks/README.md` to the pre-commit hook's two real gates and adds a one-sentence mirror-sync note to `code-quality/SKILL.md`; adds an advisory `CODE_QUALITY_RESULT v1` evidence-handoff envelope to `code-quality/SKILL.md` Section 3, mirroring the `AGENT_IO_RESULT v1` precedent in `.opencode/agents/code.md`; adds manual scenario `TH-002` for the comment-hygiene hook branch plus a new `09--tooling-and-hooks/comment-hygiene-hook.md` per-feature file with a deep-review consumption note; and adds quality-mode vocabulary additively to `mode-registry.json`, `hub-router.json`, and `graph-metadata.json`, keeping one `sk-code` advisor identity. Two consistency reconciliations bring the playbook §5 figure and the `check-dist-staleness-hook.md` cross-reference into agreement with the new TH-002 scenario. The advisor-fixture slice and two deep-loop contract bugs are deferred to their owning lanes with a documented reason.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 025 research packet ranked and owner-bounded five proposals with cited evidence.
- [x] Three read-only verification passes confirmed every premise held against the live branch (stale README, mismatched checklist label, undercounted hook doc, no evidence envelope, uncovered hook branch, thin quality vocab).
- [x] The un-gated slice was separated from the GATED advisor-fixture rows and the two deep-loop contract bugs owned by other lanes.
- [x] The comment-hygiene envelope precedent (`code.md`'s `AGENT_IO_RESULT v1`) was identified as the shape to mirror.

### Definition of Done
- [x] `shared/README.md` is a navigation index over `shared/references/` at frontmatter version 1.0.0.1, and the `opencode-checklists` display label is gone from both code-quality docs with hrefs intact.
- [x] `.opencode/hooks/README.md` documents two independent gates including the fail-open row, and `code-quality/SKILL.md` carries the mirror-sync note.
- [x] `code-quality/SKILL.md` Section 3 carries a ten-field `CODE_QUALITY_RESULT v1` block fixed to `status: advisory` with the no-success-claim guardrail.
- [x] `TH-002` plus the new per-feature file exist, and playbook totals read 30 scenarios / 9 categories with the §5 figure and dist-staleness cross-reference reconciled.
- [x] Five quality-mode phrases are added additively across the three JSON files with registry ↔ router synced and drift-guards green (vocab-sync 100, parent-skill-check STRICT 0, router-sync vitest 4/4).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs-describe-reality plus additive-vocabulary implementation: bring each shared/code-quality/hook document into agreement with the code it describes, add one advisory (never authoritative) evidence envelope that mirrors an existing agent precedent, add manual-test coverage for a previously uncovered hook branch, and extend router/advisor vocabulary additively behind drift-guards — without granting `code-quality` any new authority or creating a packet-local advisor identity.

### Key Components
- **Shared navigation index**: `sk-code/shared/README.md` now maps `shared/references/` (routing, detection, lifecycle, workflow doctrine, checklists, and `universal/` standards) instead of holding placeholder text.
- **Checklist label**: `code-quality/SKILL.md` and `code-quality/README.md` display `assets/checklists/`, the canonical label, with unchanged `../code-opencode/assets/checklists/` hrefs.
- **Hook documentation**: `.opencode/hooks/README.md` describes the pre-commit hook's two gates (comment-hygiene + staged agent-mirror-sync) including fail-open; `code-quality/SKILL.md` notes the second gate.
- **Evidence envelope**: `code-quality/SKILL.md` Section 3 owns the advisory `CODE_QUALITY_RESULT v1` block and its guardrail.
- **Hook coverage**: the manual-testing playbook (`§15` TH-002, `§16` gap, `§17` index, totals, `§5` figure) and the new `09--tooling-and-hooks/comment-hygiene-hook.md` file with the deep-review consumption note.
- **Quality vocabulary**: `mode-registry.json`, `hub-router.json`, and `graph-metadata.json` carry the five additive quality-mode phrases; the drift-guards own their consistency.

### Data Flow
An author-side quality request routes through sk-code quality-mode vocabulary (now including the added phrases) to the `code-quality` sub-skill. `code-quality` loads the correct surface checklists (labelled `assets/checklists/`), applies its P0/P1/P2 judgment, and may emit an advisory `CODE_QUALITY_RESULT v1` envelope. That envelope carries evidence forward to downstream verification and, when a deep-review runs, feeds its traceability dimension and P0/P1/P2 severity gates — without the envelope itself reading as a completion claim or replacing the `workflow_verify.md` handoff. Independently, the pre-commit hook enforces its two gates, now accurately documented and covered by TH-002.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Premise Verification
- [x] Confirm the packet scope is the un-gated slice of all five ranked proposals.
- [x] Verify each premise on the live branch: stale `shared/README.md`, `opencode-checklists` display label, comment-hygiene-only hook docs, absent evidence envelope, uncovered comment-hygiene hook branch, and thin quality vocabulary.
- [x] Confirm the `AGENT_IO_RESULT v1` envelope precedent in `.opencode/agents/code.md`.
- [x] Isolate the GATED advisor-fixture rows and the two deep-loop contract bugs as other-lane deferrals.

### Phase 2: Documentation and Hook-Doc Alignment (Proposals A + B)
- [x] Rewrite `sk-code/shared/README.md` into navigation over `shared/references/`; bump frontmatter version 1.0.0.0 → 1.0.0.1.
- [x] Replace the `assets/opencode-checklists/` display label with `assets/checklists/` in `code-quality/SKILL.md` and `code-quality/README.md`; preserve hrefs and the system-spec-kit checklist handoff.
- [x] Align `.opencode/hooks/README.md` to two independent gates across the description, overview, files table, ASCII diagram, and BOUNDARIES/fail-open row.
- [x] Add the one-sentence agent-mirror-sync note to `code-quality/SKILL.md`.

### Phase 3: Evidence Envelope and Hook Coverage (Proposals C + D)
- [x] Add the advisory `CODE_QUALITY_RESULT v1` envelope (ten fields, `status: advisory`, no-success guardrail) to `code-quality/SKILL.md` Section 3, mirroring `code.md`.
- [x] Add manual scenario `TH-002` (comment-hygiene hook branch) to playbook §15.
- [x] Create `09--tooling-and-hooks/comment-hygiene-hook.md` with the deep-review consumption note mapping the envelope onto deep-review traceability + P0/P1/P2 verdict.
- [x] Reconcile playbook §16 gap sentence, §17 cross-reference index, and totals 29 → 30 (categories stay 9).

### Phase 4: Vocabulary, Reconciliations, and Close-Out (Proposal E + reconciliations)
- [x] Add the five quality-mode phrases additively to `mode-registry.json`, `hub-router.json`, and `graph-metadata.json`, keeping registry ↔ router synced and one advisor identity.
- [x] Reconcile playbook §5 coverage figure 28 → 30 and repoint the `check-dist-staleness-hook.md` "Related" cross-reference to TH-002.
- [x] Run drift-guards (vocab-sync, parent-skill-check STRICT, router-sync vitest) to green.
- [x] Record the advisor-fixture and deep-loop deferrals and leave `shared/assets/patterns/README.md` untouched.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Vocabulary drift | sk-code quality-mode vocabulary consistency | vocab-sync (score 100 / driftDetected false) |
| Parent hub invariants | sk-code parent hub strict shape | parent-skill-check STRICT (0 warnings) |
| Router drift | sk-code registry ↔ router projection | sk-code router-sync vitest (4/4) |
| Display-label removal | code-quality docs | `grep -c opencode-checklists` returns 0/0 |
| Playbook consistency | Manual-testing playbook | §15/§16/§17 + totals (30/9) + §5 figure internal review |
| Envelope guardrail | `code-quality/SKILL.md` Section 3 | Read-check that `status: advisory` and the no-success-claim guardrail are present |
| Spec validation | Packet close-out docs | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 025 research backlog | Internal | Available | Proposal ranking, owner boundaries, and premises would be undefined |
| `.opencode/agents/code.md` `AGENT_IO_RESULT v1` precedent | Internal | Available | The evidence-envelope shape would lack a proven precedent to mirror |
| Existing `shared/references/` corpus | Internal | Available | The README rewrite would have no real targets to navigate |
| sk-code drift-guards (vocab-sync, parent-skill-check, router-sync) | Internal | Available | Vocabulary additions could desync the router ↔ advisor projection undetected |
| Live advisor TypeScript lane | External | Gated downstream | The advisor-fixture slice and 193-row re-baseline stay deferred to the advisor window |
| deep-loop delta/resource-map contract | External | Deferred to deep-loop | The two contract bugs remain until the deep-loop lane resolves them |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A drift-guard fails, a checklist href regresses, the envelope reads as a completion claim, playbook totals/index desync, or `validate.sh --strict` reports errors.
- **Procedure**: Revert the affected file to the previous branch tip (each edit is file-scoped and additive), re-run vocab-sync, parent-skill-check STRICT, and the router-sync vitest, re-grep for `opencode-checklists`, re-check the playbook totals and the envelope guardrail, then re-run strict spec validation before re-promoting.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Premise Verification | 025 backlog and live-branch verification | Documentation and hook-doc alignment |
| Documentation and Hook-Doc Alignment | Confirmed premises and the shared references corpus | Evidence envelope and hook coverage |
| Evidence Envelope and Hook Coverage | Aligned hook docs and the `AGENT_IO_RESULT v1` precedent | Vocabulary, reconciliations, and close-out |
| Vocabulary, Reconciliations, and Close-Out | Settled docs so drift-guards run against a stable tree | Parent registration and strict validation |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Premise Verification | Low | Premises were pre-ranked by 025 and confirmed by read-only passes |
| Documentation and Hook-Doc Alignment | Medium | Multiple stale doc spots across shared, code-quality, and hook READMEs required careful label-only and gate-count edits |
| Evidence Envelope and Hook Coverage | Medium | The advisory envelope and TH-002 needed to mirror precedent while preserving owner boundaries |
| Vocabulary, Reconciliations, and Close-Out | Medium | Additive vocab across three JSON surfaces had to keep drift-guards green |
| **Total** | | **Medium docs/JSON implementation increment** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm all edits are docs/JSON and additive, with no new runtime logic.
- [x] Confirm the checklist-label change touches display text only and preserves hrefs and the system-spec-kit checklist handoff.
- [x] Confirm the vocabulary additions keep one `sk-code` advisor identity and no packet-local metadata.

### Rollback Procedure
1. Revert the specific file(s) to the previous branch tip; edits are independent and file-scoped.
2. Restore the shared README, checklist labels, hook docs, envelope section, playbook scenario/totals, and the three vocab JSON files as needed.
3. Re-run vocab-sync, parent-skill-check STRICT, the router-sync vitest, and `grep -c opencode-checklists`.
4. Re-run strict spec validation and re-check the envelope guardrail and playbook totals before re-promotion.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Filesystem-only revert of markdown and JSON files; no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
