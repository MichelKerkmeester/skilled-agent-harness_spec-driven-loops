---
title: "Decision Record: Canon self-enforcement (parent-hub hardening)"
description: "Five ADRs: lead with the foundational trio; partition and gate the advisor-scorer-adjacent tranche; and the three operator escalation forks — /doc:quality fix-vs-ratchet, the zombie/ghost graph nodes, and the four-hub family question."
trigger_phrases:
  - "canon self-enforcement decisions"
  - "014 sk-doc phase 024 adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/024-canon-self-enforcement"
    last_updated_at: "2026-07-08T04:03:24Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored five ADRs incl. three operator forks"
    next_safe_action: "Operator resolves ADR-003/004/005 forks then execute"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Decision Record: Canon self-enforcement (parent-hub hardening)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Lead with the foundational trio (widen gate + vocab battery + defuse CHECK)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Deciders** | Planning architect (this packet) |

<!-- ANCHOR:adr-001-context -->
### Context

The 022/023 program fixed 18 findings and a Fable-caught P1 (`sk-hub` reached only 3 of 7 enum sites because a stale SQLite `CHECK(family IN …)` wedged the scan). Both that incident and the earlier transport incident were the same failure class: canon is declared once in `mode-registry.json`, hand-copied into ~12 dialects, and every automated guard watches deep-loop only. Fixing the last fire does not stop the next one.

### Constraints
- Must not touch the operator-owned advisor scorer track.
- Must keep `parent-skill-check.cjs` at 4/4 on all four hubs.
- CI additions must stay dependency-light (the current gate installs only vitest on demand).
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Sequence Phase 2 as the trio WU1 (widen the CI gate to all hubs by glob + fix the checker CWD bug), WU2 (a cross-language vocabulary-agreement battery), and WU3 (defuse the `edge_type` CHECK — the exact twin of the family CHECK). Only then land the DO-NOW hardening batch. The trio is chosen because together it would have caught BOTH prior incidents: the widened gate + battery would have flagged the transport dialect drift, and the battery + defused CHECK would have prevented the `sk-hub` wedge.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Foundational trio first** | Prevents the whole failure class; each future dialect drift is caught mechanically | Highest-breadth edits up front (CI + ~12 dialects) | 9/10 |
| Ship easy hardening first (fixtures, panel) | Faster visible progress | Leaves the class-of-bug live; the next drift still ships silently | 5/10 |
| One mega-guard replacing all dialects | Single source of truth | Large refactor; touches the gated scorer track; high blast radius | 3/10 |

**Why Chosen**: the trio is the smallest set that converts enforcement from fire-based to class-based, and none of it touches the gated scorer track.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- A fifth hub auto-enrolls in CI and the vocab battery via glob — no future code edit.
- Dialect drift becomes a red test, not a reviewer's lucky catch.
- The next latent CHECK twin is removed before it can wedge a scan.

**Negative**:
- WU1 is highest-blast (CI + checker) — mitigated by landing and verifying the four-hub loop first.
- The vocab battery must special-case the two deliberate read-only subsets — mitigated by subset-assert, not equality.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | One glob, one vitest, one cloned migration — no new abstraction |
| Systems impact | Touches CI + ~12 dialects but each edit is small and reversible |
| Right problem | Targets the failure class (silent dialect drift), not a symptom |
| Sustainability | A test becomes the single enforcer; future edits cannot drift silently |
| Scope match | Trio is the minimum that would have caught both incidents |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: `routing-registry-drift.yml`, `parent-skill-check.cjs`, `skill-graph-db.ts` (+ the dialect mirrors asserted by WU2).

**Rollback**: each WU is an atomic commit; WU3's migration is idempotent and forward-only.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Partition and gate the advisor-scorer-adjacent tranche

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Deciders** | Planning architect (this packet) |

<!-- ANCHOR:adr-002-context -->
### Context

Three opportunities change what the advisor indexes or scores: WU8 flattens object `derived.entities` (`metadata-sanitizer.ts:60-68`), WU10 fixes the vocab-sync prefix bug (`parent-hub-vocab-sync.cjs:113-118`, Lane-C-baseline adjacent), and WU11 retires dead command ids and rewrites the routing corpus. The 023 remediation already gated its WU5 command-bridge unit on the operator-owned scorer track and its 193-row parity re-baseline (`labeled-prompts.jsonl` = 193 rows; `scorer-eval-baseline.json:16` pins `total:193`).

### Constraints
- The scorer track is operator-owned; edits must not collide with a pending re-baseline.
- A partial scoring shift would corrupt the 193-row parity.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Partition WU8-fix, WU10, and WU11 into a GATE-ADJACENT tranche that executes only after the operator opens the scorer lane, and require them to co-land with the 193-row parity re-baseline as ONE event. Each carries a gate-free PREP step (the WU8 shape-break guard and the WU11 dead-id sequencing doc) done in Phase 1, so the post-gate batch is mechanical.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gate + PREP now, execute post-lane** | No scoring collision; post-gate work is mechanical | The three fixes wait on the operator | 9/10 |
| Execute now alongside DO-NOW | Finishes the whole map in one pass | Corrupts the re-baseline; collides with the gated scorer track | 2/10 |
| Drop the three from scope entirely | Zero risk | Leaves a real shape bug + a real prefix bug + dead ids live | 4/10 |

**Why Chosen**: PREP-now/execute-post-lane captures the value with zero re-baseline risk.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**: the DO-NOW work ships immediately; the gated fixes are ready to land the moment the lane opens; no scoring corruption.

**Negative**: three real fixes remain deferred — mitigated by the PREP artifacts and by co-landing them with the 023 WU5 unit that shares the same gate.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | A clean partition line: does the change shift scoring? |
| Systems impact | Isolates the only high-blast work from the safe majority |
| Right problem | Protects the parity contract the operator owns |
| Sustainability | PREP makes the deferred work mechanical, not re-discovered later |
| Scope match | Only the three scoring-adjacent units are gated; the rest proceed |
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**: `metadata-sanitizer.ts`, `parent-hub-vocab-sync.cjs`, the advisor corpus + ratchets — all deferred.

**Rollback**: not applicable pre-execution; the tranche never lands outside the single re-baseline event.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: `/doc:quality` — fix the binding vs ratchet the id (operator fork D1)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (operator fork) |
| **Date** | 2026-07-07 |
| **Deciders** | Operator (pending) |

<!-- ANCHOR:adr-003-context -->
### Context

`sk-doc/mode-registry.json:145` binds the `create-quality-control` mode to `/doc:quality`, but `.opencode/commands/doc/` does not exist (verified: `create/ deep/ design/ doctor/ memory/ speckit/` exist; `doc/` does not). WU4's command-binding gate will FAIL on this id.

### Constraints
- The gate must be green on a canon-clean fleet, so this id must either resolve or be allowlisted.
- A phantom allowlist entry hides a real missing command.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Recommended default — FIX: create `.opencode/commands/doc/quality` so `/doc:quality` resolves like every other bound mode, and reserve the allowlist strictly for genuinely-dead ids (the WU11 retirees). Escalated to the operator because it creates a new command surface.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix (create the command)** | The binding becomes real; no phantom hidden | Adds a command file to author | 8/10 |
| Ratchet (allowlist the id) | Fastest green gate | Permanently hides a missing command behind an exception | 4/10 |
| Remove the binding (set `command:null`) | Honest about the absence | Loses the intended `/doc:quality` entry point | 5/10 |

**Why Chosen**: fixing makes the registry honest; the allowlist stays reserved for truly dead ids.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**: `/doc:quality` becomes a real, testable command; the gate's allowlist stays small and meaningful.

**Negative**: requires authoring the command doc (a small follow-up) — acceptable versus a permanent exception.
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | One command file vs one allowlist line |
| Systems impact | Makes an existing registry binding resolvable |
| Right problem | The id is bound but unrouteable — fix the absence, not the symptom |
| Sustainability | Avoids a permanent allowlist exception that hides drift |
| Scope match | Small, contained; the gate then stays honest |
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**: `.opencode/commands/doc/` (new), WU4 command-binding gate + its allowlist.

**Rollback**: remove the new command dir and set `command:null` on the mode if the entry point is abandoned.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Zombie/ghost graph nodes — report-only doctor panel (operator fork D2)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (operator fork) |
| **Date** | 2026-07-07 |
| **Deciders** | Operator (pending) |

<!-- ANCHOR:adr-004-context -->
### Context

The live graph carries stale artifacts: a 2026-07-04 graph timestamp, a `cli-codex-retired` zombie node, a sk-design misfiled family, and a `null derived.generated_at`. The canonical reindex that would clean these is operator-gated (per the 124 close-out and the reindex hand-off).

### Constraints
- WU5 must not self-heal — a mid-flight reindex could clobber a concurrent session's writes.
- The panel must be read-only (NFR-P02).
<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Recommended default — WU5 is a REPORT-ONLY 3-way diff (skill-graph.json vs SQLite vs disk graph-metadata) that NAMES the stale set and exits informational; it never writes. The actual cleanup rides the operator-gated canonical reindex. Escalated because it names when/who runs that reindex.
<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Report-only panel; reindex operator-gated** | Zero clobber risk; surfaces the drift now | The stale nodes persist until the reindex | 9/10 |
| Auto-heal in the panel | Cleans immediately | Can clobber concurrent writes; races the reindex | 2/10 |
| Ignore until the reindex | No new code | The drift stays invisible between reindexes | 4/10 |

**Why Chosen**: reporting makes the drift visible without taking a write action the operator owns.
<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**: the drift set is visible on demand; no risk to a concurrent session; the reindex stays the single write path.

**Negative**: the zombie/ghost nodes linger until the next reindex — acceptable, since they are inert to routing.
<!-- /ANCHOR:adr-004-consequences -->

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | A diff-and-print, no mutation logic |
| Systems impact | Read-only; cannot corrupt the graph or a session |
| Right problem | Visibility now; the write stays where the operator controls it |
| Sustainability | Every future reindex has a pre-flight drift report |
| Scope match | Reporting only; cleanup deferred to the gated reindex |
<!-- /ANCHOR:adr-004-five-checks -->

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**: a `/doctor` route or checker sub-report (read-only); no graph writes.

**Rollback**: remove the panel; it holds no state.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Keep the generic `sk-hub` family vs per-hub families (operator fork D3)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (operator fork) |
| **Date** | 2026-07-07 |
| **Deciders** | Operator (pending) |

<!-- ANCHOR:adr-005-context -->
### Context

The 023 remediation added the generic `sk-hub` family and migrated sk-design off the `sk-code` shoehorn. The four-hub fleet (sk-code, sk-design, sk-doc, deep-loop) now shares one `sk-hub` family in most dialects, but the template placeholder still omits it (`parent_skill_graph_metadata_template.json:5`, WU12(a)). The open question: should each hub get its own family, or stay under one generic `sk-hub`?

### Constraints
- More families multiply the dialect surface WU2 must keep in sync.
- The family drives advisor family-reasoning; changing it shifts routing (scorer-adjacent).
<!-- /ANCHOR:adr-005-context -->

<!-- ANCHOR:adr-005-decision -->
### Decision

**Summary**: Recommended default — KEEP the generic `sk-hub` family. It already future-proofs non-code/design hubs, keeps the enum small, and avoids adding scorer-adjacent churn. WU12(a) only patches the stale template line to include `sk-hub`; no new families. Escalated because family choice affects advisor reasoning.
<!-- /ANCHOR:adr-005-decision -->

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep generic `sk-hub`** | Small enum; future hubs fit; no scoring churn | Less granular family-level routing | 8/10 |
| Per-hub families (sk-code-hub, sk-doc-hub, …) | Granular routing signal | Multiplies dialects; scorer-adjacent re-baseline needed | 4/10 |
| Design-only family + sk-hub for the rest | Distinguishes design | Half-measure; still fragments | 5/10 |

**Why Chosen**: one generic family minimizes the very dialect surface this packet is trying to keep in agreement.
<!-- /ANCHOR:adr-005-alternatives -->

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**Positive**: the enum stays small; WU2's battery has fewer values to reconcile; no scorer re-baseline triggered by family churn.

**Negative**: family-level routing is coarse — acceptable, since mode-level routing already discriminates within a hub.
<!-- /ANCHOR:adr-005-consequences -->

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | One family value across the fleet |
| Systems impact | Avoids scorer-adjacent family churn |
| Right problem | Fragmentation would enlarge the drift surface, not reduce it |
| Sustainability | A fifth hub reuses `sk-hub` with no enum edit |
| Scope match | WU12(a) only fixes the stale template line; no remodel |
<!-- /ANCHOR:adr-005-five-checks -->

<!-- ANCHOR:adr-005-impl -->
### Implementation

**Affected Systems**: `parent_skill_graph_metadata_template.json:5` (add `sk-hub`); no dialect-wide family change.

**Rollback**: revert the one-line template edit.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
