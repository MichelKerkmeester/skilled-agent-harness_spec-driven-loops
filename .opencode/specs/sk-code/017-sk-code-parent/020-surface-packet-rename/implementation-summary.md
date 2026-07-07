---
title: "Implementation Summary: Phase 20 sk-code surface-packet rename to code- prefix"
description: "Executed summary for the sk-code rename follow-up: four bare surface packets moved to code-* identities, live references repaired, verification gates green, and scoped semantic/benchmark/history deferrals recorded."
trigger_phrases:
  - "phase 20 implementation summary"
  - "sk-code rename summary"
  - "code prefix rename summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/020-surface-packet-rename"
    last_updated_at: "2026-07-05T14:37:02.169Z"
    last_updated_by: "claude-opus"
    recent_action: "Rename executed; live references repaired and gates green"
    next_safe_action: "Run advisor reindex handoff; keep benchmark-gold rewrite separate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-review/"
      - ".opencode/skills/sk-code/code-webflow/"
      - ".opencode/skills/sk-code/code-opencode/"
      - ".opencode/skills/sk-code/code-animation/"
      - ".opencode/skills/sk-code/mode-registry.json"
      - ".opencode/skills/sk-code/hub-router.json"
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
      - ".opencode/skills/sk-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-020-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Is this phase executed?"
        answer: "Yes. The four bare sk-code surface packets were renamed to code-* identities, live references were repaired, and the verification gates are green."
      - question: "What remains deferred?"
        answer: "REQ-007 advisor metadata semantic refresh is deferred to the gated advisor reindex handoff; the sk-code Lane-C benchmark playbook-gold rewrite and re-baseline are tracked separately; historical and archived references remain unchanged by standing decision."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-surface-packet-rename |
| **Status** | Complete |
| **Level** | 2 |
| **Actual Effort** | Mechanical rename + contract update + live reference repair executed; advisor semantic refresh, benchmark-gold re-baseline, and historical rewrites deferred by scope |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 020 completed the sk-code surface-packet rename. The four formerly bare surface sub-skills now use `code-*` folder and packet identities, the hub's two-axis registry/router contract exposes the same `code-*` public keys, internal markdown links and external live references were repointed, advisor metadata dangling paths were repaired, and the hub documentation now distinguishes acting/evidence sub-skills from unprefixed infrastructure. Platform names, CAPS detection labels, the natural-language utterance, and historical records were preserved.

### Files Changed

| File | Action | Purpose | Commit |
|------|--------|---------|--------|
| `.opencode/skills/sk-code/{review,webflow,opencode,animation}/` | Renamed | Preserve history while moving four bare surface packets to `code-review`, `code-webflow`, `code-opencode`, and `code-animation` | this phase evidence |
| `.opencode/skills/sk-code/mode-registry.json` | Updated | Prefix `workflowMode`, `packet`, `packetSkillName`, and `surfaces` for the four renamed packets | this phase evidence |
| `.opencode/skills/sk-code/hub-router.json` | Updated | Prefix `tieBreak`, `routerSignals` keys, `resources`, and the ten `<mode>-*` vocabulary classes | this phase evidence |
| `.opencode/skills/sk-code/code-*/SKILL.md` | Updated | Match packet `name:` fields to folders and repair broken cross-packet links | this phase evidence |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Updated | Move 56 bare surface-path refs to `code-*` while preserving platform names and detection labels | this phase evidence |
| `.opencode/skills/sk-code/SKILL.md` | Updated | Align layout diagram, workflowMode key list, surface/workflow tables, resolved-key example array, and references list to `code-*` | this phase evidence |
| `.opencode/skills/sk-code/{graph-metadata,description}.json` | Updated | Repoint advisor metadata path references only; semantic tokens intentionally unchanged | this phase evidence |
| `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` | Updated | Repoint allowlist key for the illustrative-example file that moved under the rename | this phase evidence |
| `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.opencode/commands/speckit/assets/speckit_complete_{auto,confirm}.yaml`, `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` | Updated | Repoint external live `sk-code/{name}/` references to `code-*` | this phase evidence |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rename was executed as a mechanical path change across the four surface packets, then followed by contract and reference repair. `mode-registry.json` and `hub-router.json` were updated so the public two-axis keys, packet names, resources, and vocabulary classes all use the `code-*` identity. Each renamed packet's `SKILL.md` `name:` field was aligned with its folder, and broken cross-packet markdown links were repointed from the old bare folder paths.

The live reference sweep then repaired hub routing prose, the hub `SKILL.md`, advisor metadata path references, the markdown link-checker allowlist, agent docs, speckit complete assets, and the deep-review prompt pack template. The sweep deliberately preserved product names (`Webflow`, `OpenCode`, `Motion.dev`), CAPS detection labels (`WEBFLOW`, `OPENCODE`, `MOTION_DEV`), the utterance "review my webflow animation for jank", and the Keywords comment. Historical phase records and archive material were left unchanged per the standing decision.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Prefix the four formerly bare surface packets and their public workflowMode keys | The operator directive was "prefix everything"; the hub should visually distinguish all acting/evidence sub-skills from infrastructure |
| Leave infrastructure folders unprefixed | `benchmark`, `changelog`, `manual_testing_playbook`, and `shared` are not sub-skills and remain easier to identify without `code-` |
| Repair advisor metadata paths but defer semantics | Dangling paths would be wrong immediately; keyword/topic/derived-token refresh belongs to the gated advisor reindex handoff |
| Preserve platform and detection names | The rename targets path identities only, not product names, surface labels, filenames, or natural-language examples |
| Leave historical and archived references unchanged | Those records describe the names that existed when earlier phases ran and are intentionally not live routing inputs |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:blockers -->
## Blockers

None. The rename, reference repair, and verification evidence are complete. Remaining items are scoped deferrals, not blockers: advisor semantic refresh, benchmark-gold rewrite/re-baseline, and historical/archive rewrites.

<!-- /ANCHOR:blockers -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Evidence |
|-----------|--------|----------|----------|
| Folder inventory | Pass | sk-code sub-skills and infrastructure | Hub lists exactly eight `code-*` sub-skills plus `benchmark`, `changelog`, `manual_testing_playbook`, and `shared` |
| Double-prefix sweep | Pass | sk-code tree | `grep -rn "code-code-" sk-code` returned 0 |
| JSON integrity | Pass | Registry, router, metadata | `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, and `description.json` all parse |
| Link-checker oracle | Pass (scoped) | sk-code markdown links | ZERO sk-code broken links; repo-wide exit=1 remains 40 pre-existing broken links outside sk-code in system-spec-kit database README files, baseline unchanged |
| Live stale-ref sweep | Pass | `.opencode` and `.claude` live files | Empty; zero live files reference `sk-code/{review,webflow,opencode,animation}/` as a path after scoped exclusions |
| parent-skill-check STRICT | Pass | sk-code hub invariants | Exit 0, all hard invariants passed, 0 warnings; 3c packets resolve, 5b routerSignals match registry modes, 5c 21 vocabulary classes defined, 5d resources resolve, 3g surface packets are read-only and advisor-invisible |
| vocab-sync | Pass | sk-code hub vocabulary | Score 100, driftDetected false, findings [], orphanAliases [], aliasCollisions [], ownershipDrift [] |

### Test Coverage Summary

| Area | Result |
|------|--------|
| Rename inventory | 4/4 formerly bare folders now `code-*`; 8/8 sub-skills prefixed; 4/4 infrastructure folders unprefixed |
| Reference repair | Internal markdown, hub docs, metadata paths, checker allowlist, agents, command assets, and deep-review template repaired |
| Structural gates | parent-skill-check strict exit 0 and vocab-sync score 100/clean |
| Scoped deferrals | Advisor semantic refresh, benchmark-gold re-baseline, and historical/archive rewrites documented |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Segment-anchored substitutions avoid double-prefixes | `grep -rn "code-code-" sk-code` returned 0; platform/detection labels preserved | Pass |
| NFR-R02 | Rename preserves git history | Four folders were renamed with history preserved via `git mv` per execution evidence | Pass |
| NFR-M01 | Sub-skills read as `code-*` while infrastructure stays unprefixed | Final hub inventory shows eight `code-*` sub-skills and four unprefixed infrastructure folders | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. REQ-007 advisor metadata semantic refresh is not performed in this phase; keyword/topic/derived-token refresh is deferred to the gated advisor reindex handoff. Path references were repaired so metadata no longer dangles.
2. The sk-code Lane-C benchmark playbook-gold rewrite and re-baseline are tracked separately. Phase 020 verifies router resource resolution through parent-skill-check 5d but does not re-freeze the benchmark gold.
3. Historical phase records under 124 phases 013/014/016 and archive material intentionally retain old names because they narrate prior states.
4. The link-checker repo-wide exit remains 1 due to 40 pre-existing broken links entirely outside sk-code in system-spec-kit database README files pointing at old spec paths. The sk-code scoped oracle is zero-broken and the baseline is unchanged.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| REQ-007 advisor metadata semantics refreshed | Deferred; only dangling advisor metadata path references were repaired | Semantic keyword/topic/derived-token refresh is owned by the gated advisor reindex handoff |
| sk-code Lane-C benchmark playbook-gold rewrite and re-baseline | Deferred; router resource paths pass parent-skill-check 5d | This was the phase-019 rename follow-up handoff but is tracked separately from the mechanical rename and reference repair |
| Historical and archived references rewritten | Left unchanged | Standing decision says historical phase records and archive material should narrate what existed at the time |

<!-- /ANCHOR:deviations -->
