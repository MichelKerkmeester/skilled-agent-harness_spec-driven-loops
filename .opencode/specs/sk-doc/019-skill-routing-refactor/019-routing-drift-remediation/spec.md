---
title: "Feature Specification: Post-019 routing drift remediation"
description: "Fix the confirmed drift a two-agent post-019 survey found across the skill fleet: a compiled-route status probe that reported false-green over legacy serving, a manifest refresher that could never refresh a graduated hub, seven hub catalogs still documenting compiled routing as off-by-default, an omitted leaf-manifest entry, and three packaging/metadata regressions."
trigger_phrases:
  - "routing drift remediation"
  - "compiled serving false green"
  - "post-019 drift fixes"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped all six remediation items; verified serving truthfulness against resolver ground truth"
    next_safe_action: "Decide the promoted-mirror renumbering question for the stale sync path"
    blockers: []
    key_files:
      - ".opencode/bin/compiled-route-status.cjs"
      - ".opencode/bin/lib/compiled-route-manifest.cjs"
    completion_pct: 100
    open_questions:
      - "Should the promoted runtime mirror follow the authored spec renumbering, or should the sync tool's authored path be pinned independently?"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Post-019 Routing Drift Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/019-routing-drift-remediation |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `018-post-019-research` (folder-order adjacency) |
| **Successor** | None (last phase) |
| **Origin** | Two independent GPT-5.6-SOL surveys of all 12 skill hubs; findings recorded in `../research/post-019-angles/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A post-019 survey of every skill hub surfaced drift that had accumulated against the authorities packet 019
established. Four items were independently re-verified against the live tree, and two further defects were
found while remediating them.

The load-bearing one was a **silent routing failure**. The compiled-route status probe declared
`compiled-serving` whenever a hub's activation manifest said `compiled` and the engine did not throw. It never
checked the serve-time identity binding the resolver actually enforces — that the routed snapshot is the exact
generation the manifest selected. One hub's skill content had changed after its generation was minted, so the
resolver correctly fell back to legacy while the probe still reported green. Operators and health consumers
could therefore see compiled serving over a legacy hot path.

Remediating that exposed a second defect: the manifest refresher could never refresh a graduated hub at all. It
called the generic canonical compiler, which throws on those hubs' packet kinds, instead of preferring the
shadow-child snapshot the freshness check already uses — and it wrote a bumped generation the engine never
routes.

### Purpose
Make serving state observable and truthful, restore genuine compiled serving where it had silently lapsed, and
close the documentation and packaging drift that had accumulated since the cutover.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Gate the status probe's compiled-serving claim on manifest freshness and routed-generation identity.
- Fix the manifest refresher to prefer a graduated hub's shadow-child snapshot and select its normalized generation.
- Re-mint the two activation manifests that had gone stale.
- Correct the seven hub feature catalogs that still documented compiled routing as off-by-default.
- Regenerate the leaf manifest that omitted a live model profile.
- Close three packaging/metadata regressions: a hub version mismatch, a `SKILL.md` over the word cap, and fixtures missing frontmatter.

### Out of Scope
- The stale authored-source path in the compiled-route sync tool (see Open Questions) — it predates this work
  and its fix implies renumbering the live promoted mirror.
- Any change to the routing policy itself, the scorer, or the benchmark corpus.
- The remaining survey angles, which are handed to the sibling alignment and research loops.

### Files to Change
| File | Change |
|------|--------|
| `.opencode/bin/compiled-route-status.cjs` | Freshness + identity gates; two new cause codes documented |
| `.opencode/bin/lib/compiled-route-manifest.cjs` | Prefer shadow-child snapshot; select normalized generation |
| `.opencode/bin/lib/compiled-routing/010-live-activation/activation/{sk-design,sk-doc}/manifest.json` | Re-mint |
| `.opencode/skills/*/feature-catalog/feature-catalog.md` (7 hubs) | Default-on wording |
| `.opencode/skills/sk-prompt/leaf-manifest.json` | Regenerate |
| `.opencode/skills/sk-design/description.json` | Version parity with `SKILL.md` |
| `.opencode/skills/sk-doc/create-benchmark/SKILL.md` | Condense under the word cap |
| `.opencode/skills/sk-doc/create-diff/assets/fixtures/onboarding-{before,after}.md` | Add required frontmatter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The status probe must not report `compiled-serving` for any hub the resolver would serve from legacy | A hub with a stale manifest reports a drift cause code, not a green state |
| REQ-002 | Status output must agree with resolver ground truth for all seven activated hubs | `resolveRoute` and `compiled-route-status.cjs --all` name the same serving set |
| REQ-003 | No regression against the pre-change manifest test baseline | Suite result after the change equals the captured baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The manifest refresher must succeed for graduated hubs and select the generation the engine routes | `refreshCanonicalManifest` returns `refreshed: true` and `fresh: true` |
| REQ-005 | Every hub feature catalog must describe compiled routing as default-on with the documented kill-switch | No hub catalog retains off-by-default wording |
| REQ-006 | Every committed leaf manifest must be fresh against its skill corpus | `generate-leaf-manifest.cjs --check` passes for every skill that ships one |
| REQ-007 | The affected packets must pass strict packaging validation | `package_skill.py --check` returns PASS, word count under the documented cap |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All seven activated hubs resolve compiled through `resolveRoute`, and the status probe reports
  `compiled-serving` for exactly those hubs.
- A hub whose content drifts after minting reports `stale-manifest`, not a false green.
- `refreshCanonicalManifest` returns `refreshed: true` / `fresh: true` for a graduated hub.
- The leaf-manifest checker passes for every skill that ships one.
- Strict packaging passes for the two touched `create-*` packets.
- The manifest test suite result is unchanged from the captured baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Re-minting flips a hub from legacy onto a policy never parity-verified against legacy | Re-mint only restores the identity the engine already computes; the manifest was backed up before the write and the refresher fails closed on a compile error |
| A stricter probe reclassifies hubs operators believed healthy | That is the intent: the reclassification is verified against resolver ground truth, not asserted |
| Editing skill content silently staleness a manifest again | Now surfaced immediately by the probe rather than hidden; observed and handled during this work |

**Dependencies:** the compiled-routing runtime closure and the activation manifests; no external services.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Fail-safe:** every new gate returns a drift cause code rather than throwing into a routing hot path.
- **Observability:** each non-serving condition is distinguishable by cause code rather than collapsing into one sentinel.
- **No behaviour change** to the routing decision itself — only to what is reported and which generation is selected.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Probe without an engine load** (prompt-time surfaces pass `probeEngine:false`): the freshness gate still applies, so the no-probe path cannot report a false green either.
- **Concurrent flip during a slow compile:** the refresher re-reads serving state as late as possible and fails closed if the manifest vanished or is corrupt.
- **A hub with no shadow child:** the refresher falls back to the generic compiler at the bumped generation, preserving prior behaviour.
- **A policy object naming its generation `activationGeneration`:** normalized before selection, so the written generation matches what the engine routes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

1. **Stale authored path in the sync tool (unresolved, out of scope).** `compiled-route-sync.cjs` points its
   authored root at a phase path that no longer exists. The promoted runtime mirror reflects the pre-ungroup
   authored numbering, while the authored tree shifted by three positions, so repointing the root would
   renumber the live serving mirror. Decide whether the promoted layout tracks the authored renumbering or the
   sync tool pins its source path independently. This is the one failing case in the manifest suite and it
   predates this packet.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- Survey findings: `../research/post-019-angles/alignment-loop-angles.md`, `../research/post-019-angles/research-angles.md`
- Sibling loops: `../017-post-019-alignment/`, `../018-post-019-research/`
- Parent: `../spec.md`
<!-- /ANCHOR:related-docs -->
