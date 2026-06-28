---
title: "Decision Record: deep-loop parent-skill alignment"
description: "Decision record for deep-loop alignment. ADR-001 is accepted/executed for the deep-ai-council rename; ADR-002 keeps the merged-identity layer by sign-off with drift-guard green; ADR-003 keeps all five feature catalogs as earned; ADR-004 accepts the NFR-S01 per-mode allowed-tools contract."
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
    recent_action: "ADR-001 done; ADR-002 kept; ADR-003 keep-all earned; ADR-004 per-mode allowed-tools accepted"
    next_safe_action: "Optional: run a full live deep-loop e2e; refresh metadata separately"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-002-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "ADR-001 executed: folder/name identity is deep-ai-council."
      - "ADR-002 accepted: keep the merged-identity layer by maintainer sign-off; the routing-registry drift-guard is green."
      - "ADR-003 accepted: keep all five feature catalogs because each mode's catalog is substantial and earned."
      - "ADR-004 accepted: NFR-S01 is resolved on the per-mode allowed-tools contract; optional live-loop e2e remains residual."
      - "R5 required gates are closed; optional live-loop e2e and metadata refresh remain available."
---
# Decision Record: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

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

The former `ai-council` packet had folder `ai-council` but `SKILL.md` name `deep-ai-council`. That mismatch is now resolved on disk: the packet folder and SKILL name are both `deep-ai-council`. The `/deep:ai-council` command and `ai-council` agent remain legacy public surfaces, not filesystem identity.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose and executed**: rename the folder `ai-council` to `deep-ai-council` so `name == folder == deep-ai-council`, matching the `deep-<mode>` convention. The alternative, renaming the packet to `ai-council`, would break the convention and the established `deep-ai-council` identity the advisor and agents use.
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

- Filesystem load paths use `deep-ai-council`.
- The `/deep:ai-council` command name and `ai-council` agent type stay as public compatibility surfaces.
- Package checks pass with warnings per remediation evidence; warning-free validation is not claimed.
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
- The rename is already live on disk. This decision record documents that reality.
- This doc-reconciliation pass does not edit source, command, agent, or skill files.

**How to roll back**: Restore the Stage 0 recovery baseline; the rename and rewire revert as one unit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep or simplify the deep-loop advisor merged-identity layer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted - keep the merged-identity layer (sign-off; drift-guard green) |
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

**Keep the merged-identity layer.** Maintainer sign-off closes the decision, and the routing-registry drift-guard is green. Option E solves invocation through the hub, but it does not replace the advisor's stronger per-mode routing projection. Fixture comparison is optional hardening, not a prerequisite for this accepted keep decision.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Keep the merged-identity layer** | Retains stronger per-mode advisor routing; matches deep-loop's heavy use; drift-guard is green | A drift-guarded Python+TS layer to maintain | CHOSEN |
| **Simplify to hub-only identity** | Removes the drift-guarded layer; matches sk-design | Risk of per-mode routing regression; loses deep-loop's per-mode routing strength | Rejected |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- deep-loop retains stronger per-mode advisor routing than a hub-only projection.
- The divergence from sk-design is recorded as an intentional deep-loop exception, not an oversight.
- The drift-guard remains the consistency contract for the Python and TypeScript merged-identity maps.
- A future fixture comparison may be useful hardening, but it is not required to keep the layer.
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Option E changes the invocation story, so the projection's role must be re-examined |
| 2 | **Beyond Local Maxima?** | PASS | Keep and simplify are both framed with a decision criterion |
| 3 | **Sufficient?** | PASS | Maintainer sign-off plus a green drift-guard settles keep vs simplify for this pass |
| 4 | **Fits Goal?** | PASS | Preserves routing quality while aligning where evidence allows |
| 5 | **Open Horizons?** | PASS | Keeps optional fixture comparison available without making it a blocker |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Stage 4 is closed by maintainer sign-off: keep the merged-identity layer.
- The routing-registry drift-guard remains green and continues to guard consistency.
- No source, fixture, or runtime change is made in this doc-only reconciliation pass.

**How to roll back**: Reopen ADR-002 and run the optional fixture comparison before considering simplification.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Per-mode feature-catalog ruling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted - keep all five (earned) |
| **Date** | 2026-06-26 |
| **Deciders** | User + Claude (this session) |

---

<!-- ANCHOR:adr-003-context -->
### Context

All five deep modes carry a `feature_catalog/`. The sk-design conversion kept `feature_catalog/` only for the one mode whose feature set genuinely warranted the cataloging structure and removed thin catalogs as bloat. The same earned-keep test has now been applied to deep-loop, and the result differs because each deep-loop catalog is substantial: every mode has a version-stamped canonical inventory for a full autonomous-loop engine.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

Apply the same earned-keep test per deep mode and **keep all five** `feature_catalog/` directories. The earlier "remove the rest as bloat" premise was wrong for deep-loop: sk-design pruned thin modes, while deep-loop's five catalogs are all substantial and warranted. No deletion or reference repointing is needed.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Per-mode earned-keep test (mirror sk-design)** | Applies the same evidence standard as sk-design | Can produce a different footprint when all catalogs are earned | CHOSEN |
| **Keep all five `feature_catalog/`** | Preserves substantial version-stamped inventories; no dangling-reference risk | Keeps a larger doc surface | CHOSEN outcome of the earned-keep test |
| **Remove some or all catalogs** | Smaller doc surface | Would delete warranted canonical inventories for full autonomous-loop engines | Rejected |
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- All five `feature_catalog/` directories stay on disk.
- No `SKILL.md` or reference pointer repointing is required for R3.
- The sk-design precedent is preserved as an earned-keep test, not as a forced deletion count.
- The remaining validation work is R5, not catalog removal.

### Current Per-Mode Assessment

| Mode | Files | md-lines | Verdict | Rationale |
|------|-------|----------|---------|-----------|
| `deep-research` | 17 | 1287 | earned | Canonical inventory for a full autonomous research loop with retrieval, iteration, and synthesis surfaces. |
| `deep-review` | 28 | 2145 | earned | Canonical inventory for a full autonomous review loop with findings, convergence, and validation surfaces. |
| `deep-improvement` | 25 | 1908 | earned | Canonical inventory for a full evaluator-first improvement loop with guarded promotion surfaces. |
| `deep-context` | 26 | 2446 | earned | Canonical inventory for a full codebase-context loop with discovery, synthesis, and reuse surfaces. |
| `deep-ai-council` | 33 | 2150 | earned | Canonical inventory for a full multi-seat council loop with convergence and packet-local artifact surfaces. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The current all-five footprint needed the same earned-keep test sk-design applied |
| 2 | **Beyond Local Maxima?** | PASS | Keep-all, remove-all, and earned-keep are all framed |
| 3 | **Sufficient?** | PASS | The per-mode assessment resolves the footprint without deletion or repointing |
| 4 | **Fits Goal?** | PASS | Aligns to the sk-design test while preserving catalogs that actually earn their place |
| 5 | **Open Horizons?** | PASS | Keeps the canonical inventories available for future deep-loop maintenance |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Stage 2 is closed as keep-all earned.
- All five catalogs remain; no deletion, reference repointing, or source change is needed.
- This doc-only reconciliation records the assessment counts and verdicts.

**How to roll back**: Reopen ADR-003 if a future catalog becomes thin enough to reassess; no filesystem rollback is needed for this keep-all decision.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: NFR-S01 hub tool-permission contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted - per-mode allowed-tools contract |
| **Date** | 2026-06-28 |
| **Deciders** | User + Codex (this session) |

---

<!-- ANCHOR:adr-004-context -->
### Context

The deep-loop hub is a routing-only parent skill. Verified current state: the hub declares `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]`; deep-research additionally requires `memory_context` and `memory_search`; deep-review requires `memory_context`, `memory_search`, and `code_graph_query`; deep-review does not include `WebFetch`. So the hub grant is not the union of mode tools. Each mode packet declares its own `allowed-tools`, which is the authoritative per-mode contract.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

Accept the per-mode allowed-tools contract for NFR-S01. Each mode packet declares its own allowed-tools, which is the authoritative per-mode contract; the hub's allowed-tools is the hub's own grant, not the union of mode tools. Modes are not widened by the hub because per-mode frontmatter governs at dispatch. Do **not** strip tools from the hub or modes in this pass.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

- The permission contract is honest about current repo state: hub-level grants are the hub's own grant and are not the union of mode tools.
- The residual risk is accepted for this packet because per-mode frontmatter governs at dispatch; a future runtime dispatch probe can harden that evidence.
- A future runtime dispatch probe is optional hardening, not a blocker for C1 closeout.
- No hub `allowed-tools`, per-mode `allowed-tools`, source files, or generated metadata are changed.
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- NFR-S01 is closed as an accepted per-mode allowed-tools decision.
- Phase 001's carry-forward note is updated to point here as the resolution.
- The optional future hardening path is a runtime dispatch probe, not a permission-stripping proposal.

**How to roll back**: Reopen NFR-S01 and run a runtime dispatch probe before changing any hub or mode tool grants.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
