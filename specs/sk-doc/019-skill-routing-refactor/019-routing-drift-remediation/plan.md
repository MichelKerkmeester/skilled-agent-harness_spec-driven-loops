---
title: "Implementation Plan: Post-019 routing drift remediation"
description: "How the six remediation items were sequenced and verified: runtime observability first, then the refresher fix that unblocked re-minting, then the documentation and packaging drift, each gated on ground-truth verification rather than self-report."
trigger_phrases:
  - "routing drift remediation plan"
  - "compiled serving fix plan"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the three-phase remediation approach and its gates"
    next_safe_action: "Repair the stale sync path"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Post-019 Routing Drift Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Two independent surveys produced candidate findings; each was treated as a hypothesis and re-verified against
the live tree before any edit. Four verified items were remediated, and two further defects were found while
remediating them. The riskiest surface — compiled-routing serving state — was handled first and personally,
with the mechanical documentation and packaging work delegated in parallel under a hard scope lock.

### Overview
Make the serving state truthful before changing it: gate the probe, confirm the new report against resolver
ground truth, then fix the refresher that made re-minting impossible, then re-mint. Documentation and
packaging drift proceeds independently because it cannot affect routing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Each finding re-verified against the live tree, not accepted from an agent report.
- A pre-change baseline captured for the manifest test suite and the per-hub status output.
- The activation manifest backed up before any write.

### Definition of Done
- Status output agrees with `resolveRoute` for all seven hubs.
- Manifest suite result identical to baseline.
- Leaf-manifest checker and strict packaging pass.
- Only in-scope files staged; a co-active session's working tree untouched.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Observability is derived from, and must agree with, the serving decision. The resolver is the single source of
truth for whether a hub serves compiled; the probe mirrors its checks rather than approximating them.

### Key Components
- **Status probe** — reports per-hub serving state with a cause code; previously checked authority, flag, and
  engine liveness, but not identity.
- **Resolver** — enforces the serve-time identity binding: the routed snapshot must equal the selected generation.
- **Manifest refresher** — recomputes the current policy and rewrites the selected identity.
- **Freshness check** — already preferred a graduated hub's shadow-child snapshot; the refresher did not.

### Data Flow
Skill content → compiled policy (shadow-child snapshot for graduated hubs) → activation manifest selection →
resolver identity check → serving decision → probe report. Drift anywhere upstream must surface as a cause
code, never as a green report over legacy serving.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Establish truth
Capture baselines, add the freshness and identity gates to the probe, and confirm the new report against
resolver ground truth on a healthy hub and the drifted hub.

### Phase 2: Restore serving
Fix the refresher to prefer the shadow-child snapshot and select its normalized generation, then re-mint the
stale manifests and re-verify against ground truth.

### Phase 3: Close documentation and packaging drift
Correct the seven catalogs, regenerate the leaf manifest, fix the version mismatch, condense the oversized
`SKILL.md`, and add the missing fixture frontmatter — each confirmed by its own checker.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Ground-truth comparison** — call the resolver directly per hub and require the probe to agree; this is the
  primary gate, because a self-consistent probe can still be wrong.
- **Baseline delta** — run the manifest suite before and after and compare pass/fail counts rather than
  asserting "no regressions".
- **Checker-based confirmation** — leaf-manifest checker across every skill, strict packaging for the touched
  packets, word count against the documented cap.
- **Negative case** — a hub whose content drifts after minting must report `stale-manifest`; observed naturally
  when the delegated documentation edits staled a second hub mid-run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Compiled-routing runtime closure and the per-hub activation manifests (read/write).
- The leaf-manifest generator and the skill packager for the documentation-side checks.
- No external services, no network calls, no schema migrations.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is a single commit on the release branch and reverts cleanly with `git revert`. The two activation
manifests were backed up before writing and can be restored by copying the backup over the file; doing so
returns those hubs to legacy serving, which is the state they were already in.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depends on Phase 1: re-minting without a truthful probe would have produced an unverifiable result.
Phase 3 is independent of both and ran in parallel, since documentation and packaging cannot affect routing —
though its edits did stale a hub's manifest, which Phase 1's gate surfaced immediately and Phase 2 resolved.
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Scope | Effort |
|-------|-------|--------|
| 1 | Two gates plus documented cause codes | Small, high care |
| 2 | Two-line behavioural fix plus two re-mints | Small, high blast radius |
| 3 | Eleven files across seven hubs | Moderate, mechanical |

Roughly 350 changed lines across 16 files.
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

| Change | Undo | Effect of undoing |
|--------|------|-------------------|
| Probe gates | Revert the commit | Status returns to reporting green over legacy serving |
| Refresher fix | Revert the commit | Graduated hubs become un-refreshable again |
| Manifest re-mints | Restore the backups | Affected hubs return to legacy serving |
| Catalog / packaging fixes | Revert the commit | Documentation returns to describing the pre-cutover default |
<!-- /ANCHOR:l2-rollback -->
