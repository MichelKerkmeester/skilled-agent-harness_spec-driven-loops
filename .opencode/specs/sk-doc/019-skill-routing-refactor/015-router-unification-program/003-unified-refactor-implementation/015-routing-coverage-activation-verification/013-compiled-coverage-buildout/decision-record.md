---
title: "Decision Record: Compiled-Routing Coverage Build-Out & Genuine Default-On"
description: "ADR-001: Path 1 (build full compiled-routing coverage) chosen over Path 2 (byte-identical via legacy fallback) and Path 3 (hold), per operator directive of no concessions."
trigger_phrases:
  - "compiled routing coverage decision"
  - "path 1 vs path 2 compiled routing"
  - "no concessions decision"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout"
    last_updated_at: "2026-07-21T12:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Reconciled status to Complete: ADR-001 (Path 1) implemented and shipped fleet-wide (7/7 hubs compiled-serving)."
    next_safe_action: "None; ADR-001 realized. Reference it for any future compiled-routing coverage work."
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/compiled-routing-coverage-diagnosis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-013-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Path 1 vs Path 2 vs Path 3: Path 1 accepted, Path 2 and Path 3 rejected."
---
# Decision Record: Compiled-Routing Coverage Build-Out & Genuine Default-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Build Full Compiled-Routing Coverage (Path 1), Not Byte-Identical-via-Fallback (Path 2)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Operator; Claude Sonnet 5 (diagnosis and spec authoring) |

---

<!-- ANCHOR:adr-001-context -->
### Context

A real route-gold parity run showed the compiled router mechanism is byte-identical to legacy where it has coverage, but coverage was only built out for sk-design (36 matches, 0 defers, 1 over-detection bug). The other six hubs are thin (sk-code 3 matches, cli-external-orchestration 3, mcp-tooling 1, sk-prompt 0) or stale (sk-doc, system-deep-loop manifests unevaluable). The program's own flip gate is `compiled-serving`: compiled routes must match legacy on every scenario in the hub's route-gold set. No hub meets that gate today except sk-design.

### Constraints

- Legacy's routing decisions must never change; coverage is built to match legacy, never by changing what legacy routes.
- The 3 frozen scorer files must never be edited, under any path chosen.
- The default-on flip must stay byte-exact reversible, both fleet-wide (`SPECKIT_COMPILED_ROUTING=0`) and per-hub (cohort removal).
- The operator explicitly rejected holding (Path 3) with the direction "do not accept blocker," and the diagnosis doc frames the remaining two paths as "no concession" (Path 1) versus "a concession" (Path 2).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Path 1 - build full compiled-routing coverage for every thin or stale hub so each reaches `compiled-serving` before any default-on flip, accepting no fallback concessions.

**How it works**: Grow each hub's detectors, router, and canary fixtures to match sk-design's proven pattern; fix the two known over-detection bugs (sk-design TV-003, mcp-tooling MT-008); re-mint the two stale manifests (sk-doc, system-deep-loop); build their coverage once fresh; then flip only hubs that are genuinely `compiled-serving`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Path 1 - build full coverage** | Compiled genuinely serves every hub; proven feasible by sk-design (36 matches, 0 defers); no legacy-fallback dependency at runtime | Major multi-hub engineering effort; largest unknown is per-hub detector coverage | 9/10 |
| Path 2 - byte-identical via fallback | Faster to land: fix the defer contract plus the harness bar plus the 2 bugs plus re-mint; still reversible and enabled-by-default | A concession per the diagnosis doc: compiled serves unevenly and legacy silently backs the gaps; requires touching the defer contract across 7 SKILL.md files and templates | 6/10 |
| Path 3 - hold | Zero implementation risk | Rejected outright by the operator ("do not accept blocker"); does not close the gap between the flip gate and current coverage | 1/10 |

**Why this one**: The program's flip gate is `compiled-serving`, not merely "byte-identical outcome." Path 2 satisfies byte-identical outcomes but leaves the router thin in practice, with legacy silently backing most real prompts. Path 1 is the only path that makes compiled routing genuinely serve every hub, and sk-design already proves end to end that it is achievable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every hub's compiled router becomes production-grade coverage, not a shadow layer riding on a legacy-fallback contract.
- Root cause 4 (the `defer` contract inconsistency between the engine and `sk-code/SKILL.md:56`) and root cause 5 (the parity harness blocking on decision-mismatch rather than effective routing) do not need to be fixed before flipping - those are Path-2-only concerns.

**What it costs**:
- A multi-hub engineering effort, sized by the verified per-hub gaps (sk-code needs the largest lift: 19 safe-defers to convert into real matches). Mitigation: run the sk-code pilot first, then replicate the proven pattern to the remaining thin hubs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Growing detectors introduces new over-detection bugs, same class as TV-003/MT-008 | H | Route-gold parity after every detector change, per hub, before moving on |
| Multi-hub effort under-resourced or rushed across a heavy/post-compaction session | M | Run each hub's build-out fresh, using `compiled-routing-coverage-diagnosis.md` as the technical handoff |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The flip gate (`compiled-serving`) cannot be met by any hub today except sk-design; this is the only path that closes the gap without a concession. |
| 2 | **Beyond Local Maxima?** | PASS | 3 paths compared (build, fallback, hold); Path 2 and Path 3 were explicitly evaluated and rejected with stated reasons, not skipped. |
| 3 | **Sufficient?** | PASS | sk-design's existing 562-line compiler already proves the approach reaches `compiled-serving`; no unproven mechanism is required. |
| 4 | **Fits Goal?** | PASS | Directly implements the program's stated destination in `goal-coverage-buildout.md`: all 7 hubs `compiled-serving`, then default-on. |
| 5 | **Open Horizons?** | PASS | Byte-exact reversibility (fleet kill-switch and per-hub cohort removal) is preserved throughout; the path does not narrow future options. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- sk-code, cli-external-orchestration, mcp-tooling, sk-prompt: compiled policy grown to legacy parity.
- sk-design: TV-003 over-detection fixed; coverage otherwise unchanged.
- mcp-tooling: MT-008 over-detection fixed alongside its coverage build-out.
- sk-doc, system-deep-loop: manifests re-minted, then compiled policy grown to legacy parity.
- Both `resolve.cjs` copies, `compiled-route-sync.cjs`, 7 `SKILL.md` files, 2 create-skill parent templates, and catalog wording: updated at flip time.

**How to roll back**: Remove the affected hub from `DEFAULT_ON_HUBS` in both resolver copies and re-run `compiled-route-sync.cjs`; for a fleet-wide rollback, set `SPECKIT_COMPILED_ROUTING=0`. No data migrations exist to reverse - manifests and compiled artifacts are regenerated, not migrated.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
