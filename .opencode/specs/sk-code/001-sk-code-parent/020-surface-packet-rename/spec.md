---
title: "Feature Specification: Phase 20 sk-code surface-packet rename to code- prefix"
description: "Rename the four sk-code sub-skill folders (review, webflow, opencode, animation) to the code- prefix so every sub-skill is visually distinct from hub infrastructure, and update every live reference across the repo — internal markdown links, textual paths, the routing doc, the hub SKILL, advisor metadata paths, and the link-checker allowlist."
trigger_phrases:
  - "sk-code surface packet rename"
  - "code- prefix rename"
  - "phase 20 sk-code rename"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/001-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/020-surface-packet-rename"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rename executed; internal links + textual refs + hub docs + metadata swept"
    next_safe_action: "Complete the reference sweep, run gates, close out and roll up 124"
---
# Feature Specification: Phase 20 sk-code surface-packet rename to code- prefix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the phase 013 two-axis restructure, four sk-code sub-skills kept bare folder names — `review`, `webflow`, `opencode`, `animation` — while the four workflow-mode packets already carried the `code-` prefix (`code-implement`, `code-quality`, `code-debug`, `code-verify`). The mixed convention makes the four sub-skills visually indistinguishable from the hub's infrastructure folders (`shared/`, `benchmark/`, `changelog/`, `manual_testing_playbook/`) and leaves the two-axis registry inconsistent: the workflow axis is half-prefixed and the surface axis is unprefixed.

### Purpose
Rename the four sub-skill folders to the `code-` prefix so every acting/evidence sub-skill reads as `code-*` and only true infrastructure stays unprefixed, then repair every live reference the rename touches so the hub router, the markdown link graph, and the advisor metadata all resolve. Per an explicit operator decision ("prefix everything"), the public `workflowMode` registry keys for the four also carry the prefix, not just the folder and packet identity.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename four folders: `review -> code-review`, `webflow -> code-webflow`, `opencode -> code-opencode`, `animation -> code-animation` (via `git mv`, preserving history).
- Update the two-axis contract: `mode-registry.json` (`workflowMode`, `packet`, `packetSkillName`, `surfaces`), `hub-router.json` (`tieBreak`, `routerSignals` keys, `resources`, and the ten `<mode>-*` vocabulary classes), and each renamed packet's `SKILL.md` `name:` field.
- Fix every internal markdown link the rename broke (the workflow-mode and `code-webflow` packets link to the surface packets via `../webflow/`, `../opencode/`, `../animation/`, `../review/`).
- Update every live textual `sk-code/{name}/` path reference across the repo (hub docs, playbooks, scripts, external command assets, agent docs).
- Update the hub routing doc (`shared/references/smart_routing.md`) and hub `SKILL.md` (Layout, key list, surface tables, resolved-key example, References).
- Update advisor metadata **path** references in `graph-metadata.json` and `description.json`.
- Update the `check-markdown-links.cjs` allowlist key whose file moved under the rename.

### Out of Scope
- Renaming the four already-prefixed workflow modes (`code-implement`, `code-quality`, `code-debug`, `code-verify`).
- Rewriting historical or archived references that describe the pre-rename state (spec-tree phase records for 013/014/016; `z_archive/**`) — left per the packet's standing "leave historical records" decision.
- Regenerating advisor **semantics** (keyword tokens, `derived.*` topics, causal summary) — owned by the gated advisor reindex handoff; only dangling paths are repaired here.
- Rewriting the sk-code Lane-C benchmark gold or re-freezing a baseline beyond confirming the router resolves (the benchmark re-baseline is tracked separately).
- Platform / product / surface-detection names ("Webflow", "WEBFLOW", "OpenCode", "OPENCODE", "Motion.dev", "MOTION_DEV") and filenames that merely contain these words.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/{review,webflow,opencode,animation}/` | Rename | `git mv` to the `code-` prefixed folder names |
| `.opencode/skills/sk-code/mode-registry.json` | Update | Prefix `workflowMode`/`packet`/`packetSkillName`/`surfaces` for the four |
| `.opencode/skills/sk-code/hub-router.json` | Update | Prefix `tieBreak`, `routerSignals` keys, `resources`, and the ten vocabulary classes |
| `.opencode/skills/sk-code/code-*/SKILL.md` | Update | `name:` field to match the new folder; fix broken cross-packet links |
| `.opencode/skills/sk-code/**/*.md` | Update | Internal broken markdown links + textual `sk-code/{name}/` refs |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Update | Bare surface-path routing refs to `code-*` (preserve detection labels) |
| `.opencode/skills/sk-code/SKILL.md` | Update | Layout, workflowMode key list, surface tables, resolved-key example, References |
| `.opencode/skills/sk-code/{graph-metadata,description}.json` | Update | Advisor metadata path references (path-only) |
| `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` | Update | Allowlist key for the moved illustrative-example file |
| `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.opencode/commands/speckit/assets/speckit_complete_{auto,confirm}.yaml`, `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` | Update | External live `sk-code/{name}/` path references |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Four folders renamed with history preserved | `git status` shows R (rename) for all four sub-skill trees; the hub lists exactly `code-*` sub-skills plus unprefixed infrastructure | operator directive "all should start with code- prefix" |
| REQ-002 | Two-axis contract is internally consistent | `mode-registry.json`, `hub-router.json`, and each packet `SKILL.md` `name:` agree on the `code-*` identity; folder == packetSkillName invariant holds | parent-skill-check invariants 3c/5b |
| REQ-003 | Zero internal markdown links broken by the rename | `check-markdown-links.cjs` reports zero sk-code broken links (pre-existing non-sk-code breakage unchanged from baseline) | link-checker oracle |
| REQ-004 | Every live reference across the repo is updated | No live file references `sk-code/{review,webflow,opencode,animation}/` as a path; the router doc and hub SKILL name the `code-*` identity | operator directive "all references across the repo needs updating" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-005 | Structural gates stay green | `parent-skill-check` STRICT 0 warnings and `vocab-sync` score 100 / driftDetected false after the rename | program-level hub gates |
| REQ-006 | Platform names and filenames are preserved | No "Webflow"/"OpenCode" platform name, CAPS detection label, or filename containing these words is altered; no `code-code-` double-prefix | scope guardrail |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-007 | Advisor metadata semantics refreshed | Keyword/topic tokens regenerated to reflect the rename | deferred to the gated advisor reindex handoff |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four folders are `code-*` and the two-axis registry/router/packet identity agree. [EVIDENCE: pending close-out]
- **SC-002**: `check-markdown-links.cjs` reports zero sk-code broken links. [EVIDENCE: pending close-out]
- **SC-003**: Zero live `sk-code/{name}/` path references remain outside historical/archived records. [EVIDENCE: pending close-out]
- **SC-004**: `parent-skill-check` STRICT 0 and `vocab-sync` 100/clean. [EVIDENCE: pending close-out]
- **SC-005**: Platform names, detection labels, and filenames intact; no double-prefix. [EVIDENCE: pending close-out]

### Acceptance Scenarios

- **Scenario 1**: **Given** the four folders are renamed, **when** the hub router resolves any mode or surface, **then** it loads the `code-*` packet path with no dangling reference.
- **Scenario 2**: **Given** the rename broke cross-packet markdown links, **when** the link checker runs, **then** it reports zero sk-code broken links.
- **Scenario 3**: **Given** a line mixes a platform name and a folder path (e.g. "keep the surface as WEBFLOW and add `animation/references/`"), **when** the sweep runs, **then** only the folder path is prefixed and the detection label is preserved.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-broad substitution hits platform names / filenames | Corrupts prose or breaks file paths | Segment-anchored substitutions; preserve-list; git-diff review each round |
| Risk | Relative-link depth miscount | New broken links | Use the deterministic link-checker oracle to verify to zero |
| Dependency | Shared branch with a live agent | Accidental clobber of unrelated dirty files | File-scoped staging; scratch-index push seeded from remote tip; blast-radius gate |
| Risk | Advisor metadata path drift | Dangling metadata paths | Repair path references; defer semantic regen to the gated reindex |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every substitution is idempotent and segment-anchored so re-running produces no `code-code-` double-prefix.
- **NFR-R02**: The rename preserves git history (`git mv`, detected as R).

### Maintainability
- **NFR-M01**: The four sub-skills read as `code-*`; only genuine infrastructure stays unprefixed, so the two axes are legible at a glance.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Historical spec-tree records (124 phases 013/014/016) and `z_archive/**` are read-only inputs; their pre-rename references are left intentionally.
- `changelog/` and `benchmark/` history under sk-code are frozen and excluded from the sweep.

### Error Scenarios
- If a substitution would touch a platform name, CAPS detection label, or filename, it must not fire (anchored on path-segment context).
- If the link checker reports a new sk-code broken link, the round is not complete.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One rename fanning out across internal links, textual refs, routing doc, hub SKILL, and metadata |
| Risk | 14/25 | Wide blast radius but deterministic and oracle-verified; shared-branch discipline required |
| Research | 8/20 | Scope is bounded by checker/grep oracles; little unknown |
| **Total** | **37/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. The advisor metadata semantic refresh (REQ-007) is deferred to the gated advisor reindex handoff; only dangling paths are repaired in this phase.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
