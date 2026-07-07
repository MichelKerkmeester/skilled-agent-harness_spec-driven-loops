---
title: "Decision Record: Advisor Scorer Eval Hardening"
description: "Architecture decisions for the eval-hardening infrastructure: ratcheted baseline vs fixed floor, honest holdout provenance with no fabricated gold, and capturing the baseline under the deterministic test-harness regime that every scorer gate already uses."
trigger_phrases:
  - "advisor eval hardening decisions"
  - "ratcheted baseline vs floor"
  - "honest holdout provenance"
  - "harness regime capture decision"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/007-eval-hardening"
    last_updated_at: "2026-07-07T07:15:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Recorded the three architectural decisions for eval hardening"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Decision Record: Advisor Scorer Eval Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ratcheted Baseline vs Fixed Floor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Deciders** | Implementer, per approved plan |

---

<!-- ANCHOR:adr-001-context -->
### Context

The validate handler already carries fixed release floors (full-corpus 0.75, holdout 0.725, per-skill 0.7). A fixed floor cannot catch a regression that stays above the floor — a drop from a healthy 0.78 to a still-passing 0.76 is invisible. The scorer is a deterministic function of committed metadata under the reproducible projection, so a "never worse than the last known good" gate is feasible.

### Constraints
- Must not change any routing behavior; the gate is read-only measurement.
- Must catch above-floor regressions without false alarms on legitimate, reviewed improvements.
- Must remain reproducible from the repo alone.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Keep the fixed floors as an absolute minimum and add an exact-match ratchet on top of them.

**Details**: A committed baseline records the top-1 count for every measure. The gate re-scores live and asserts each metric holds exactly. A drop fails as a regression; an increase fails as an unrecaptured improvement ("re-capture the baseline"). Numbers may therefore only hold, and any legitimate movement forces a conscious re-baseline. The floor assertions (full-corpus >= 0.75, holdout >= 0.725) remain as a backstop beneath the ratchet, and fixture sha256 pins force a re-baseline when a fixture changes.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fixed floor + exact-match ratchet** | Catches above-floor drift; forces conscious re-baseline; floor is a hard backstop | Brittle by design — a metadata change that legitimately moves scores requires a re-capture | 9/10 |
| Fixed floor only (status quo) | Simple, no baseline to maintain | Blind to any regression that stays above the floor | 4/10 |
| `>=` ratchet (allow silent improvement) | No re-capture churn on gains | A silent gain becomes the unreviewed new normal; a later regression to the old value passes | 6/10 |

**Why Chosen**: The exact-match ratchet is the honest-baseline discipline already used by the sibling divergence ratchet: the baseline is the current-state truth, improvements are captured rather than absorbed silently, and the floor guarantees a hard minimum even if someone re-captures downward.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Above-floor regressions on contested, single-intent, or holdout prompts now fail loudly.
- The baseline stays an honest record of the current scorer state.
- The floor cannot be silently eroded.

**Negative**:
- A metadata or scorer change that legitimately moves scores requires re-running the capture script. Mitigation: the capture script is committed and one command; the directional failure message names the fix.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Concurrent metadata change shifts the projection and fails the gate | M | `capturedAtSha` records the capture commit; re-baseline is a documented one-command step |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary | Pass | A fixed floor is blind to above-floor drift; the ratchet is the only gate that catches it |
| Beyond Local Maxima | Pass | Weighed fixed-floor-only and `>=`-ratchet alternatives |
| Sufficient | Pass | Exact-match + directional messages + sha256 pins + retained floors cover regression and unrecaptured-improvement |
| Fits Goal | Pass | Directly serves the packet goal of catching hidden scorer regressions |
| Open Horizons | Pass | Leaves room for future per-metric tuning; re-baseline is a one-command step |

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

**Affected Systems**: the ratchet gate, the capture script, and the baseline fixture. The scorer is untouched.

**Rollback**: delete the baseline, the capture script, and the gate; the fixed floors in the handler remain as before.

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Honest Holdout Provenance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Deciders** | Implementer, per approved plan |

---

### Context

The prior holdout was selected by taking every fifth row of the 193-row training corpus — the same corpus the explicit-lane rules were tuned against — so it measured memorization, not generalization. A true holdout needs prompts the rules were not tuned on. There is no never-seen, real-production, gold-labeled prompt set in the repo, and inventing gold labels would be dishonest.

### Constraints
- No fabricated gold: every label must map to a real, existing expected field.
- Must be disjoint from the 193-row training corpus.
- Must be reproducible and auditable.

---

### Decision

**Summary**: Assemble the holdout from three separately-authored, real-labeled fixtures that are all disjoint from the training corpus, with a committed generator and provenance on every row.

**Details**: The harder-intent corpus (22, `expectedSkill`), the regression cases (50, `expected_top_any` / `expect_result`), and the executor-delegation fixture (11, `expectedTop`) form an 83-row pool. Family-normalized dedup removes 4 intra-pool duplicates, and 1 row colliding with a training prompt is dropped, leaving 78 independent rows. Each row keeps a `source_type` and an `origin_fixture` naming its true source. The holdout gate re-proves disjointness from the training corpus at test time.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Repurpose three disjoint labeled fixtures** | Honest (real labels), disjoint, reproducible, auditable provenance | Some rows are referenced elsewhere; not fresh production traffic | 8/10 |
| Fabricate a new gold-labeled set | Fully independent by construction | Dishonest; labels have no ground truth | 1/10 |
| Harvest advisor-hook telemetry and hand-label | Real production prompts | Telemetry deliberately stores no routable prompt content (prompt-safety); cannot be done without violating that invariant | 3/10 |
| Keep the every-Nth-row holdout only | No new work | Measures memorization, not generalization | 3/10 |

**Why Chosen**: Repurposing disjoint, separately-authored labeled fixtures is the only honest way to build an independent holdout from the repo today. The telemetry-labeled upgrade is the legitimate future path and is explicitly deferred, not faked.

---

### Consequences

**Positive**:
- Generalization is measured against prompts disjoint from the training corpus.
- Provenance is auditable per row; the derivation is reproducible via the committed generator.

**Negative**:
- The rows are repurposed labeled fixtures, not fresh held-out production traffic. Mitigation: stated plainly; the telemetry-gold upgrade is documented as out of scope.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future fixture edit reintroduces a training collision | M | The holdout gate re-proves disjointness and fails on any collision |

---

### Implementation

**Affected Systems**: the holdout fixture, its build script, and the holdout gate.

**Rollback**: delete the holdout fixture, the build script, and the gate; the legacy every-Nth-row holdout remains.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Capture Under the Deterministic Test-Harness Regime

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Deciders** | Implementer (documented deviation from the plan's capture recipe) |

---

### Context

The approved plan's capture recipe (empty DB dir for the filesystem projection, semantics disabled, native overrides cleared) was verified deterministic, but it omitted one factor: the semantic-shadow lane substitutes deterministic fixture vectors under the vitest harness flag (real embeddings are not reproducible in CI). Every existing scorer gate — the parity test's 105/101/4, the divergence ratchet — runs in that harness regime. A baseline captured by a plain node script measured the production regime and disagreed with the vitest gate on the near-tie rows (full-corpus 150 vs 147, unknowns 14 vs 10), which would have made the ratchet fail against its own baseline.

### Constraints
- The baseline must be measured in the same regime that re-scores it.
- Must stay consistent with every other scorer gate in the suite.
- Must remain deterministic and reproducible.

---

### Decision

**Summary**: Set the harness flag in the capture and derivation scripts so the baseline is measured in the same deterministic fixture-semantic regime the gates run in.

**Details**: The capture and ambiguity-derivation scripts set the harness flag alongside the plan's projection recipe. This reproduces the vitest numbers exactly (confirmed: node with the flag matches the gate's full-corpus 147, unknowns 10, ambiguity and bucket counts). The baseline is thus the harness-regime measurement, matching all sibling scorer gates — a reproducible-CI trade-off, distinct from the daemon's real-embedding runtime, and stated as such.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Capture under the harness regime** | Baseline matches the gate and every sibling scorer test; deterministic | Not the daemon's real-embedding behavior (a known CI trade-off) | 9/10 |
| Force the gate into production regime | Baseline reflects the daemon | Diverges from every other scorer gate; risks the real-embedding load path the fixture-vector harness avoids | 4/10 |
| Gate the compiled dist under node | Pins capture and gate to the same artifact | Inconsistent with the suite's source-under-vitest convention; couples the gate to dist freshness | 5/10 |

**Why Chosen**: Matching the harness regime keeps the baseline consistent with the entire existing scorer suite and preserves determinism. Forcing production regime would make this one gate an outlier and could trigger the real-embedding path the fixture-vector harness deliberately sidesteps.

---

### Consequences

**Positive**:
- The baseline and the gate agree by construction; the ratchet is stable.
- Consistent with the parity and divergence gates.

**Negative**:
- The measured numbers are the harness regime, not the daemon's real-embedding runtime. Mitigation: documented plainly; the numbers still track relative scorer regressions, which is the gate's purpose.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader mistakes the baseline for production accuracy | L | The env block and this record state the regime explicitly |

---

### Implementation

**Affected Systems**: the capture and ambiguity-derivation scripts (they set the harness flag); the gates inherit the flag from vitest.

**Rollback**: N/A — this is the capture convention for the packet; removing the flag would desynchronize the baseline from the gate.

<!-- /ANCHOR:adr-003 -->

---
