---
title: "Decision Record: deep-loop parent-skill alignment"
description: "Frames the three load-bearing decisions for aligning the deep-loop family with the sk-design parent-skill conventions: how to resolve the ai-council name/folder mismatch, whether the deep-loop-specific advisor merged-identity layer stays once Option E exists, and the per-mode feature-catalog ruling. Recommendations recorded; final calls gated to execution."
trigger_phrases:
  - "ai-council rename decision"
  - "deep-loop merged-identity keep or drop"
  - "deep-loop feature catalog ruling"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Framed the three alignment decisions with recommendations"
    next_safe_action: "Confirm the recommendations at the execution gate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-002-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: How to resolve the ai-council name/folder mismatch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (executed) |
| **Date** | 2026-06-26 |
| **Deciders** | User + Claude (this session) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`ai-council` has folder `ai-council` but `SKILL.md` name `deep-ai-council`, so it fails `package_skill.py --check` (the validator requires `name == folder`). Every other deep mode is `deep-<mode>` with `name == folder`. The sk-design conversion established `name == folder` for all packets, so this is the one grandfathered exception in the family.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: rename the folder `ai-council` → `deep-ai-council` so `name == folder == deep-ai-council`, matching the `deep-<mode>` convention. The alternative — rename the packet to `ai-council` — would break the convention and the established `deep-ai-council` identity the advisor and agents already use. Final confirmation is gated to execution (Stage 1).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Rename folder → `deep-ai-council`** | `name == folder`; matches `deep-<mode>`; keeps the established `deep-ai-council` identity | Requires a one-pass reference rewire | CHOSEN |
| **Rename packet name → `ai-council`** | Folder unchanged | Breaks the `deep-<mode>` convention and the identity the advisor/agents use | Rejected |
| **Leave the grandfather in place** | No work | Family `--check` stays red; blocks R5 | Rejected |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Rewire every `ai-council` reference: the `/deep:ai-council` command, the `ai-council` agent type, `mode-registry.json`, the `deep-loop-runtime` projection, and cross-refs. Inventory first (plan Stage 0), rename in one pass (Stage 1).
- The `/deep:ai-council` *command name* can stay (it is the command surface, not the folder); only the packet folder + load paths change.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The family `--check` is red until the mismatch is resolved; R5 depends on it |
| 2 | **Beyond Local Maxima?** | PASS | Three resolutions framed (rename folder, rename packet, leave) |
| 3 | **Sufficient?** | PASS | A folder rename plus a reference rewire fully resolves `name == folder` |
| 4 | **Fits Goal?** | PASS | Aligns deep-loop to the `deep-<mode>` + `name == folder` convention |
| 5 | **Open Horizons?** | PASS | Keeps the `/deep:ai-council` command surface intact |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Nothing in this packet; it records the decision. Stage 1 renames the `ai-council` folder to `deep-ai-council` and rewires every reference from the Stage 0 inventory.

**How to roll back**: Restore the Stage 0 recovery baseline; the rename and rewire revert as one unit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep or simplify the deep-loop advisor merged-identity layer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted - keep the merged-identity layer |
| **Date** | 2026-06-26 |
| **Deciders** | User + Claude (this session) |

---

<!-- ANCHOR:adr-002-context -->
### Context

deep-loop carries a deep-loop-specific advisor **merged-identity** projection (`lib/scorer/aliases.ts` + `skill_advisor.py`) that lets the advisor surface nested modes as recommendable identities. Phase 001's Option E provides *invocation* through the hub independently of this projection. The two solve different problems (routing-strength vs invocation), so Option E does not automatically make the projection redundant.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Default to keep**; evaluate against evidence in Stage 4. Simplify only if routing fixtures show the hub's aggregated identity routes deep queries as strongly as the per-mode projection does. The sk-design family deliberately skipped this layer (Option E only) and its per-mode routing regressed — evidence the projection has real value and should likely stay for deep-loop.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Keep the merged-identity layer** | Retains stronger per-mode advisor routing; matches deep-loop's heavy use | A drift-guarded Python+TS layer to maintain | Default (pending Stage 4) |
| **Simplify to hub-only identity** | Removes the drift-guarded layer; matches sk-design | Risk of per-mode routing regression (sk-design saw this) | Only if Stage 4 evidence supports it |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- If kept: deep-loop retains stronger per-mode advisor routing than sk-design; the divergence from sk-design is recorded, not an oversight.
- If simplified: removes a drift-guarded Python+TS layer, at a routing-strength cost to weigh against the maintenance saving.
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Option E changes the invocation story, so the projection's role must be re-examined |
| 2 | **Beyond Local Maxima?** | PASS | Keep and simplify are both framed with a decision criterion |
| 3 | **Sufficient?** | PASS | A Stage 4 fixture comparison settles keep vs simplify |
| 4 | **Fits Goal?** | PASS | Preserves routing quality while aligning where evidence allows |
| 5 | **Open Horizons?** | PASS | Defers the irreversible removal until evidence is in hand |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Nothing in this packet. Stage 4 runs the routing-fixture comparison and records keep or simplify; only a "simplify" outcome touches `lib/scorer/aliases.ts` and the `skill_advisor.py` projection.

**How to roll back**: If a Stage 4 simplification regresses routing, restore the projection from the Stage 4 recovery baseline.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Per-mode feature-catalog ruling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (executed) |
| **Date** | 2026-06-26 |
| **Deciders** | User + Claude (this session) |

---

<!-- ANCHOR:adr-003-context -->
### Context

All five deep modes carry a `feature_catalog/`. The sk-design conversion kept `feature_catalog/` only for the one mode whose feature set genuinely warranted the cataloging structure and removed the rest as bloat. deep-loop's actual per-mode need is unassessed.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

Apply the same test per deep mode in Stage 2: keep `feature_catalog/` only where the mode's feature surface earns the cataloging overhead; remove it elsewhere and repoint references. Assess against actual contents during execution rather than pre-committing a count here.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Per-mode earned-keep test (mirror sk-design)** | Lower doc-maintenance surface; consistent with sk-design | Requires per-mode assessment + repointing | CHOSEN |
| **Keep all five `feature_catalog/`** | No work | Carries the bloat sk-design already ruled against | Rejected |
| **Remove all five** | Maximal cleanup | Drops catalogs a mode may genuinely warrant | Rejected |
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- Lower doc-maintenance surface; consistent with sk-design.
- Each removal must repoint `SKILL.md`/reference pointers to avoid dangling `feature_catalog` references.
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The current all-five footprint carries bloat sk-design already ruled against |
| 2 | **Beyond Local Maxima?** | PASS | Keep-all, remove-all, and earned-keep are all framed |
| 3 | **Sufficient?** | PASS | A per-mode earned-keep test plus repointing resolves the footprint |
| 4 | **Fits Goal?** | PASS | Aligns the catalog footprint to the sk-design ruling |
| 5 | **Open Horizons?** | PASS | Assesses against real contents rather than pre-committing a count |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Nothing in this packet. Stage 2 applies the earned-keep test per mode, removes the unearned `feature_catalog/` folders, and repoints every `SKILL.md`/reference pointer.

**How to roll back**: Restore the Stage 2 recovery baseline to bring back any removed `feature_catalog/` and its references.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
