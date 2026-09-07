---
title: "Goal: Root Resolver Consolidation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "root resolver consolidation goal"
  - "eval script resolver merge"
  - "shared predicate boundary review"
  - "parity test resolver agreement"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/012-root-resolver-consolidation"
    last_updated_at: "2026-09-07T17:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-012-root-resolver-consolidation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Root Resolver Consolidation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Reduce the repo-root resolution implementations to the minimum the real import and runtime boundaries require, prove the survivors agree with a shared parity test and state the final count and boundary reasoning in shared/README.md.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | check-source-dist-alignment.ts and check-architecture-boundaries.ts's byte-identical resolvePackageRoot bodies merge unconditionally. Their only real question is which marker set (2-dir or 3-dir) the merged version keeps |
| D2 | shared/config.ts and shared/embeddings/factory.ts's disposition is decided by a caller audit, not assumed. Both already live inside shared/ so the cross-package import-boundary reason that justifies other duplicates does not automatically apply to this pair |
| D3 | runtime/hooks/lib/workspace/repo-root.mjs's 7-line re-export shim and the findRepoRoot wrapper functions in retrofit-convention.mjs/generate-trigger-index.mjs are not touched, since they already delegate to the canonical resolver and are not independent implementations |
| D4 | The original 8-implementation count from R6-03 is stale. This packet works from the 7-implementation count this spec re-verified against the current tree, and the discrepancy (profile.ts already removed) is recorded rather than silently inherited |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] check-source-dist-alignment.ts and check-architecture-boundaries.ts share one resolvePackageRoot implementation
- [ ] A parity test proves every surviving resolver agrees on the same fixture trees
- [ ] npm run check passes
- [ ] shared/config.ts and shared/embeddings/factory.ts are either collapsed or their separate survival is documented with a reason
- [ ] shared/README.md states the final resolver count and the boundary for each
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet opened | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md and this goal.md authored from R6-02/R6-03 and lane 002 row 8, re-verified against the current tree (profile.ts's predicate already removed, retrofit-convention.mjs/generate-trigger-index.mjs already delegate rather than implement independently) |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
