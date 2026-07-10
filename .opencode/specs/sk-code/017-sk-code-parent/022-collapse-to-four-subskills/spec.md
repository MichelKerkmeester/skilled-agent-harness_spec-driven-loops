---
title: "Feature Specification: Collapse sk-code from 8 sub-skills to 4"
description: "sk-code is a two-axis parent hub with 3 surface skills (code-opencode, code-webflow, code-animation) and 5 workflow-mode skills (code-implement, code-debug, code-verify, code-quality, code-review). This packet collapses it to a surface-primary model with 4 sub-skills: the workflow-mode skills implement/debug/verify dissolve into the two surfaces, code-animation folds into code-webflow as non-skill references/assets, and code-review + code-quality stay standalone. Routing, external references, and the Lane-C benchmark are reconciled to the 4-skill model."
trigger_phrases:
  - "sk-code collapse to four sub-skills"
  - "dissolve code-implement code-debug code-verify"
  - "fold code-animation into code-webflow"
importance_tier: "high"
contextType: "general"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/022-collapse-to-four-subskills"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Scope authored; baseline verified clean (sk-code matches origin, 8 sub-skills)"
    next_safe_action: "Fold code-animation into code-webflow; dissolve mode skills into surfaces"
---
# Feature Specification: Collapse sk-code from 8 sub-skills to 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-code` parent hub carries eight sub-skills split across two axes: three surface skills (`code-opencode`, `code-webflow`, `code-animation`) and five workflow-mode skills (`code-implement`, `code-debug`, `code-verify`, `code-quality`, `code-review`). Three of the mode skills are near-empty routing shells: `code-implement` is two files of surface-agnostic doctrine, `code-debug` is a checklist plus doctrine, and `code-verify` is doctrine plus a few generic scripts. Their content already delegates to the shared surface router, so they add hub-routing surface area and vocabulary-class weight without owning surface-specific behaviour. `code-animation` is a full surface skill even though Motion.dev is only ever an overlay on Webflow work.

### Purpose
Collapse the hub to a surface-primary model with four sub-skills — `code-opencode`, `code-webflow`, `code-review`, `code-quality`. Dissolve `code-implement`/`code-debug`/`code-verify` by consolidating their generic doctrine into `shared/` and symlinking it into both surface skills (preserving their real scripts and checklists), fold `code-animation` into `code-webflow` as non-skill references/assets, and reconcile routing, external references, and the Lane-C benchmark to the new shape.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dissolve `code-implement`, `code-debug`, `code-verify`: move their generic workflow doctrine to `shared/references/` and symlink it into `code-opencode` and `code-webflow`; relocate their real assets (debug + verification checklists, `verify_*.py` scripts) so nothing is lost; delete the three SKILL.md folders.
- Fold `code-animation` into `code-webflow`: move `references/` + `assets/` under `code-webflow`, delete its SKILL.md, remove it from routing.
- Keep `code-review` and `code-quality` standalone (unchanged roles; `code-quality` retains its gate + hook scripts).
- Symlink any `shared/` reference a surviving sub-skill consumes into that sub-skill so each is self-contained; `shared/` stays the source of truth.
- Reconcile routing: `hub-router.json` (drop implement/debug/verify/code-animation signals + their vocabulary classes, keep quality/review/webflow/opencode), `mode-registry.json` (remove the three dissolved modes), `shared/references/smart_routing.md` RESOURCE_MAP (repoint `code-animation/*` → `code-webflow/*`, drop dissolved-mode routes). Run vocab-sync.
- Repoint external references to the dissolved sub-skills in `.opencode/agents/{orchestrate,deep-review,review,code}.md`, `agents/README.txt`, and any specs/docs.
- Re-baseline the Lane-C benchmark: re-translate the playbook gold (`code-animation/*` → `code-webflow/*`, drop dissolved-mode gold), regenerate `benchmark/router-final/`.

### Out of Scope
- `code-review` and `code-quality` internal content (kept as-is).
- The frozen `benchmark/baseline/` snapshot (never regenerated).
- The live-mode benchmark re-baseline (router mode is the deterministic gate) and the pre-existing, unrelated harness `intents` test.
- Any surface authoring behaviour change — this is a structural collapse, not a rewrite of what each surface teaches.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/code-{implement,debug,verify}/` | Delete | Dissolve after doctrine + assets relocated |
| `.opencode/skills/sk-code/code-animation/` | Delete (SKILL) / Move (assets) | Fold references + assets into `code-webflow`, drop SKILL.md |
| `.opencode/skills/sk-code/shared/references/` | Add | Consolidated workflow doctrine (implement/debug/verify) |
| `.opencode/skills/sk-code/code-{opencode,webflow}/` | Modify/Add | Symlinks to shared workflow doctrine; webflow gains animation refs/assets |
| `.opencode/skills/sk-code/{hub-router.json,mode-registry.json}` | Modify | Drop dissolved-mode + code-animation routing |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Modify | Repoint code-animation → code-webflow; drop dissolved-mode routes |
| `.opencode/skills/sk-code/manual_testing_playbook/**`, `benchmark/router-final/**`, `benchmark/README.md` | Modify | Re-translated gold + regenerated baseline |
| `.opencode/agents/{orchestrate,deep-review,review,code}.md`, `agents/README.txt` | Modify | Repoint dissolved sub-skill references |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Hub has exactly 4 sub-skills | Only `code-opencode`, `code-webflow`, `code-review`, `code-quality` retain a SKILL.md; the other four folders are gone or asset-only | purpose |
| REQ-002 | No content or capability lost | Dissolved-mode doctrine reachable from both surfaces; debug/verify checklists + `verify_*.py` scripts + animation refs/assets preserved on disk | scope |
| REQ-003 | Routing reconciled + consistent | `hub-router.json` + `mode-registry.json` + `smart_routing.md` reference only surviving skills; vocab-sync exits 0; drift-guard green | scope |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-004 | External references repointed | No agent or doc routes to a dissolved sub-skill; `code-review` wiring in `agents/review.md` intact | scope |
| REQ-005 | Benchmark re-baselined | `router-final/` regenerated against the new gold; verdict ≥ prior CONDITIONAL 71 | scope |
| REQ-006 | Parent-hub canon clean | `PARENT_HUB_CHECK_STRICT=1 parent-skill-check` on sk-code → 0 fails | purpose |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-007 | Self-contained surfaces | Each surviving sub-skill resolves its shared references via in-skill symlinks (no bare `../shared` cross-refs where a symlink is cleaner) | scope |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-code exposes exactly four routable sub-skills. [EVIDENCE: SKILL.md present only under code-opencode/webflow/review/quality; hub-router + mode-registry list only those]
- **SC-002**: Zero lost content. [EVIDENCE: dissolved-mode doctrine present under shared/ + symlinked into both surfaces; verify_*.py + all checklists + animation refs/assets exist on disk]
- **SC-003**: Gates green. [EVIDENCE: parent-skill-check STRICT 0 fails; vocab-sync exit 0; check-markdown-links clean; drift-guard green; router-final ≥ CONDITIONAL 71; validate.sh --strict exit 0]

### Acceptance Scenarios

- **Scenario 1**: **Given** a Webflow implement task, **when** the hub routes it, **then** it selects `code-webflow` and the implement/debug/verify doctrine is reachable from that surface (no dead route to a dissolved mode).
- **Scenario 2**: **Given** a Motion.dev animation prompt, **when** the hub routes it, **then** it selects `code-webflow` and its folded-in animation references, with no `code-animation` skill in the registry.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Vocabulary-class collisions after removing mode classes | Misrouting | Run vocab-sync with word-boundary care before commit; re-run router-replay spot checks |
| Risk | Symlink doctrine breaks link-checkers or packaging | Broken refs | Verify check-markdown-links clean and each symlink resolves; keep shared/ canonical |
| Risk | Operator/live-agent merge corrupts in-flight restructure | Lost or tangled work | Stage coherent units, seed each push from freshest origin tip, blast-radius gate; rollback = restore sk-code paths to origin tip |
| Dependency | code-*-aware benchmark harness | Gold unmeasurable otherwise | Packets 037 + 038 already landed |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The re-baseline is deterministic (router mode, offline), so the recorded verdict is reproducible.

### Maintainability
- **NFR-M01**: Generic workflow doctrine lives once in `shared/` and is symlinked into consumers, so future edits stay single-source and the surviving skills are self-contained.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Universal-tier shared references (`smart_routing.md`, `stack_detection.md`, `phase_detection.md`) stay canonical in `shared/`; symlinks point inward, never the reverse.

### Error Scenarios
- If a dissolved mode's asset has no natural surface home (a truly cross-cutting script), it lands in `shared/` rather than being duplicated or dropped.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Four folder dissolutions/folds + routing rewrite + external refs + benchmark |
| Risk | 15/25 | Routing correctness + benchmark regression on a shared, actively-pushed branch |
| Research | 9/20 | Content inspected; harness known; integration design decided (shared + symlink) |
| **Total** | **42/70** | **Level 2 (upper edge)** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. Doctrine placement resolved to shared/ + symlink; `code-quality` confirmed standalone (operator-directed). Live-mode re-baseline deferred.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent hub**: `.opencode/skills/sk-code/`
- **Harness dependencies**: `system-deep-loop/036-router-replay-surface-slice-sync`, `system-deep-loop/037-scenario-loader-code-surface-sync`
- **Prior phase**: `sk-code/017-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline`

<!-- /ANCHOR:related-docs -->
