---
title: "Decision Record: cli-external parent-hub architecture"
description: "Architecture decisions for folding cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes, including the load-bearing hub-aware rewrite of the executor-delegation scorer."
trigger_phrases:
  - "cli-external parent architecture decision record"
  - "cli-opencode cli-claude-code adr"
  - "executor-delegation scorer rewrite adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the five accepted ADRs for the cli-external fold-in"
    next_safe_action: "Human review before phase 003 scaffold"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the shared dispatch-preflight hook lifts to hub root cli-external/scripts/ (ADR-002 sub-decision, resolved at phase 003/004 execution)"
    answered_questions:
      - "Hub topology: two packetKind:workflow modes, zero extensions; transport rejected because both skills orchestrate and their dispatched writes land in this repo"
      - "Full rename via git mv for both packets; grandfatheredFolderMismatch false"
      - "No commands created; hub stays outside checker 3k coverage"
      - "Identity dissolution: delete both children's graph-metadata.json, author one hub graph-metadata.json with family cli, fold both children's edges/signals"
      - "Scorer rewrite: source the executor alias table from the hub mode-registry, not the top-level family filter, while still resolving to the executor-kind strings"
---
# Decision Record: cli-external parent-hub architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Hub topology — two workflow-kind modes, zero extensions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator (via approved plan) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`cli-opencode` and `cli-claude-code` are two flat, independently advisor-routable skills with no structural relationship. This repo's parent-hub canon (already applied to `sk-code`, `sk-design`, `system-deep-loop`, `sk-doc`, `sk-prompt`) exists to fix exactly this shape. We needed to decide the new hub's mode count, `packetKind` for each mode, and whether any named extension (surface-axis, runtime-loop, transport-axis) applies — the last question is real because a "cli dispatch bridge" superficially looks like a transport.

### Constraints

- The transport-packet contract requires a NON-orchestrating packet whose write-locus is external to this repo (the `design-mcp-open-design` precedent bridges to an external tool and does not itself decide anything). Both cli skills fail both halves: they orchestrate (they classify intent, choose an executor, and conduct the dispatched session), and their dispatched CLI writes land in THIS repo's working tree.
- Both skills are already independently advisor-routed today, so their identities cannot collapse into invisible supporting evidence.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One hub, `cli-external`, with exactly two `packetKind: "workflow"` modes — `cli-opencode` and `cli-claude-code` — and zero named extensions (no surface-axis, no runtime-loop, no transport-axis).

**How it works**: Both modes route via `routingClass: "metadata"` (the doctrine default for new hubs). Each mode keeps its existing `allowed-tools` posture (`Bash, Read, Glob, Grep`) and its packet-local self-invocation guard, because a thin routing-only hub SKILL.md does no dispatch and therefore needs no guard of its own.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two workflow modes, zero extensions (chosen)** | Mirrors the proven two-tier core of sk-doc/sk-prompt; both packets keep their orchestrating behavior and independent routability | None material | 9/10 |
| Model both as `transport` packets (the `design-mcp-open-design` precedent) | Matches the surface intuition that "these bridge to an external CLI" | Mechanically fails the transport contract — both skills orchestrate and their dispatched writes land in this repo, not an external locus; the 2026-05-04 RM-8 incident (a dispatch deleted 44 local files) is direct evidence the write-locus is local | 3/10 |
| One mode as workflow, one as surface | — | Neither skill is read-only reference data enriching the other; both are primary dispatch workflows | 2/10 |

**Why this one**: Both packets orchestrate and write into this repo, which rules out transport; both are independently primary-routed today, which rules out surface. `workflow` for both is the only shape consistent with their current behavior and the doctrine's own decision criteria.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One advisor identity with two named modes instead of two flat skills that only narrate their boundary in prose.
- Both modes keep independent routability — no regression in how users reach either dispatch path.

**What it costs**:
- The empirical question of whether `routingClass: "metadata"` preserves today's routing accuracy for delegation queries (vs. a lexical carve-out) is deferred to phase 007's benchmark, not pre-answered.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Advisor routing accuracy regresses for delegation queries after the identity merge | M | Phase 007 Lane-C benchmark plus a live delegation-routing re-baseline before cutover |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fixes a real structural gap: two coupled skills with zero graph relationship |
| 2 | **Beyond Local Maxima?** | PASS | Transport and surface alternatives were weighed and mechanically ruled out, not just workflow assumed by default |
| 3 | **Sufficient?** | PASS | Zero extensions is the minimum shape that satisfies both packets' real behavior — no speculative extension added |
| 4 | **Fits Goal?** | PASS | Directly the operator's stated request: one hub, two named modes |
| 5 | **Open Horizons?** | PASS | Matches the doctrine's own reference shape; future extensions remain addable without restructuring |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/cli-external/mode-registry.json` — two `modes[]` entries, `cli-opencode` and `cli-claude-code`, both `packetKind: "workflow"`.
- `.opencode/skills/cli-external/hub-router.json` — base three outcomes only (`single`, `orderedBundle`, `defer`).

**How to roll back**: Phase 003 has not yet run (additive-only, no content moved). Reverting this ADR before phase 003 costs nothing — just redraft the registry target shape. After phase 003, rollback means restoring the two flat skills from git history and deleting the hub skeleton (still tractable since phases 003-005 are pure moves plus one scorer rewrite, not destructive rewrites).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Full rename via git mv for both packets

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

Folding both skills in required choosing between a full `git mv` rename (`folder == packetSkillName == workflowMode` everywhere) and a lower-blast-radius option that kept the flat folder names and diverged `workflowMode` from `packetSkillName`. A sub-question rides along: the shared `scripts/` tree (the dispatch-preflight hook that lints BOTH binaries) physically lives under `cli-opencode/` today, so the move must decide whether that tree lifts to hub root `cli-external/scripts/` or stays inside the `cli-opencode/` packet.

### Constraints

- Whichever option is chosen, the directory move and the hardcoded functional-path repoints (the PreToolUse hook path especially) must land as one atomic unit — never split across separate commits, because the hook fails open and a split window loses dispatch-rule enforcement silently.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Full `git mv` rename. `cli-opencode/*` (~70 files) → `cli-external/cli-opencode/*`; `cli-claude-code/*` (~50 files) → `cli-external/cli-claude-code/*`. Both packets carry `grandfatheredFolderMismatch: false`.

**Sub-decision (open)**: Whether the shared `scripts/` hook tree lifts to `cli-external/scripts/` is left to phase 003/004 execution. Either placement works as long as the hook is made hub-aware in the same change; lifting it to hub root better reflects that it lints both modes, while keeping it packet-local is the smaller diff. Recorded as an open sub-decision rather than forced here.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full rename (chosen)** | `folder == packetSkillName == workflowMode` holds exactly, zero `grandfatheredFolderMismatch`, maximally canon-pure | Touches ~120 files across both trees; must find and repoint every hardcoded path | 8/10 |
| Keep flat folders, diverge `workflowMode` | Zero files inside the two trees move | Less-traveled pattern; leaves naming debt and a `grandfatheredFolderMismatch` flag on both packets | 6/10 |

**Why this one**: Operator's explicit choice, prioritizing canon purity and long-term consistency over short-term blast-radius minimization.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Zero naming debt (`grandfatheredFolderMismatch`) anywhere in the hub.
- Consistent, predictable packet-naming convention for any future cli-external mode.

**What it costs**:
- Large diff (~120 file moves) across phases 004-005. Mitigation: `git mv` is a rename, not a rewrite — git and review tooling recognize renames as low-risk.
- Every hardcoded path referencing the old flat locations must be found and repointed. Mitigation: phase 001's classified referrer inventory + phase 004/005 bundled repoints + phase 006's broader sweep.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A functional referrer is missed and fails silently (wrong path, not a loud error) — the PreToolUse hook is the worst case because it fails open | H | Repoint the hook path atomically with the move; phase 008 actively triggers a hard-rule violation to confirm the advisory fires from the new path |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator-directed; the fold-in needs a physical home for both trees |
| 2 | **Beyond Local Maxima?** | PASS | The lower-blast-radius alternative was fully specified and presented before the operator chose |
| 3 | **Sufficient?** | PASS | No further naming cleanup remains after this rename — no partial/mixed state |
| 4 | **Fits Goal?** | PASS | Operator explicitly requested full rename over the recommended alternative |
| 5 | **Open Horizons?** | PASS | Removes future naming-debt cleanup a grandfathered mismatch would otherwise require |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/skills/cli-opencode/*` (~70 files) → `.opencode/skills/cli-external/cli-opencode/*` via `git mv` (phase 004).
- `.opencode/skills/cli-claude-code/*` (~50 files) → `.opencode/skills/cli-external/cli-claude-code/*` via `git mv` (phase 005).
- The shared dispatch-preflight hook is made hub-aware in the same change that moves it.

**How to roll back**: `git mv` is reversible with an inverse `git mv` before the commit lands; after commit, `git revert`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Command binding — no commands created

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

Neither skill has a bound `/` command today — both are reached only via advisor routing and cross-skill reference from dispatch flows. `parent-skill-check.cjs` check 3k (command tool-grant-drift) only covers colon-namespaced commands, so a hub with no command falls outside 3k's automated coverage.

### Constraints

- Introducing a command now would add a public surface neither skill has ever exposed, plus a tool-grant contract to maintain, for no requested behavior.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Create no command. `cli-external` and both its modes stay advisor-routed and cross-skill-referenced only, exactly as the two flat skills are today.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No command (chosen)** | Matches both skills' current zero-command shape; no new public surface; same accepted gap as sk-prompt | Hub stays outside checker 3k's automated tool-grant-drift coverage | 8/10 |
| Add `/cli:opencode` + `/cli:claude-code` | Gains checker 3k coverage; conforms to the colon-namespace convention | Invents a public surface neither skill has; unrequested scope | 4/10 |

**Why this one**: Neither skill has ever had a command; adding one is scope the operator did not request. The 3k coverage gap is a known, accepted trade, identical to sk-prompt's.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- No new public command surface to document, secure, or keep in tool-grant sync.

**What it costs**:
- `cli-external` stays outside checker 3k's automated coverage (a known, accepted gap, not an oversight).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future tool-grant drift goes undetected by 3k | L | Manual review during any future command-surface change; colon-namespacing remains addable later without re-litigating this ADR |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Preserves the existing zero-command shape; avoids inventing an unrequested surface |
| 2 | **Beyond Local Maxima?** | PASS | The colon-namespaced command alternative was offered and considered |
| 3 | **Sufficient?** | PASS | No over-scoping into a command migration |
| 4 | **Fits Goal?** | PASS | Matches operator's literal request (no command) |
| 5 | **Open Horizons?** | PASS | Colon-namespacing stays available for a future, separately-scoped change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- No files under `.opencode/commands/` are created or moved.

**How to roll back**: Nothing to roll back — this ADR is a decision not to add a surface.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Identity dissolution, hub family cli, and version reconciliation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-004-context -->
### Context

Parent hubs expose exactly one advisor identity. Both `cli-opencode` and `cli-claude-code` carry their own `graph-metadata.json` today, and both are tagged `family: cli`. We needed to decide the surviving identity's family, how the two graph identities dissolve into one, and how versions reconcile. The family choice is load-bearing: the executor-delegation scorer builds its alias table from a top-level `family === 'cli'` filter, so setting the hub's family to `cli` means that filter would now match the HUB (which has no dispatch behavior of its own) instead of the two leaf skills — which is precisely why the scorer must be rewritten (ADR-005), paired with this decision.

### Constraints

- Neither child has a `description.json` today, so the hub needs a newly authored one.
- The dissolution must preserve, not drop, both children's advisor edges and routing signals.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Delete BOTH children's `graph-metadata.json` and author ONE hub `graph-metadata.json` (`skill_id: cli-external`, `family: cli`) that folds the union of both children's `intent_signals`, `trigger_phrases`, and `edges` (including cli-opencode's `enhances` edge and both siblings' peer edge, re-expressed against the hub). The hub also gets a NEW `description.json`. The hub `SKILL.md` starts at `1.0.0.0`; each child keeps its own independent versioning continuity going forward (cli-opencode at its current 1.3.15.x line, cli-claude-code at 1.1.13.0).

**Consequence to state explicitly**: because the hub's `family` is `cli`, the delegation scorer's `family === 'cli'` filter now selects the hub, not the leaves — so ADR-005's scorer rewrite is mandatory and lands in the same atomic change as this dissolution.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One hub identity, family cli, fold both children's signals (chosen)** | Matches operator's family choice and both children's existing family; single advisor identity; no lost edges | Forces the scorer rewrite (ADR-005) because the family filter now matches the hub | 8/10 |
| Give the hub a new family (e.g. `cli-hub`) to sidestep the scorer | Would avoid an immediate rewrite | With no `family: cli` skill left, the filter matches nothing and the alias table genuinely empties — an even harder silent failure than the chosen path's degradation, and still with no error; also breaks the family convention both children share | 2/10 |
| Keep one child's graph-metadata as the hub's | Less authoring | Inherits one child's signals and drops the other's edges/signals | 3/10 |

**Why this one**: `family: cli` is the operator's choice and the honest inheritance of both children's tag; the resulting scorer exposure is real and is fixed head-on by ADR-005 rather than dodged with a cosmetic family rename that would itself break dispatch.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- One advisor identity carrying the union of both children's routing signals and edges.
- Version metadata becomes internally consistent: a fresh hub line at `1.0.0.0`, each mode continuing its own history.

**What it costs**:
- The `family === 'cli'` scorer exposure must be fixed in the same change (ADR-005), or delegation prompts silently degrade (resolving to the non-executor `cli-external` or losing resolution).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dropping an edge or intent signal during the fold | M | Fold the union of both children's edges/signals into the hub metadata before deleting the packet-local files; verify with the graph regeneration in phase 006 |
| The reciprocal `enhances` edges from other skills dangle after dissolution | M | Repoint reciprocal edges to `cli-external` in phases 005/006 |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A parent hub must have exactly one graph identity; two must dissolve to one |
| 2 | **Beyond Local Maxima?** | PASS | The family-rename dodge was considered and rejected because it silently breaks dispatch |
| 3 | **Sufficient?** | PASS | Union fold plus new description.json covers the full identity surface |
| 4 | **Fits Goal?** | PASS | Operator chose family cli and single-identity dissolution |
| 5 | **Open Horizons?** | PASS | Both modes retain independent version continuity for future changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Delete `cli-opencode/graph-metadata.json` and `cli-claude-code/graph-metadata.json`.
- Create `.opencode/skills/cli-external/graph-metadata.json` (`skill_id: cli-external`, `family: cli`) folding both children's edges/signals.
- Create `.opencode/skills/cli-external/description.json`.
- New hub `SKILL.md` frontmatter `version: 1.0.0.0`; each child mode keeps its current version line.

**How to roll back**: Restore the two packet-local `graph-metadata.json` files from git history and delete the hub metadata; revert via git.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Rewrite the executor-delegation scorer to be hub-aware

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-005-context -->
### Context

`system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` builds its executor alias tables from `projection.skills.filter(family === 'cli' && lifecycleStatus === 'active')` and derives each orchestrator noun from the skill id (`skill.id.replace(/^cli-/, '')`, so `cli-opencode` yields `opencode`). After the identity dissolution in ADR-004, the two leaf skills stop existing as top-level projection entries, so the `family === 'cli'` filter now selects the HUB. Two things then degrade, silently and without any thrown error: (1) `cli-external` contributes the noun `external` into `orchestratorNouns`, so hub-identity and "external" phrases resolve to `cli-external` — which is not a real executor binary; and (2) the model-alias backstop drops, because its `activeExecutorIds` guard no longer contains `cli-opencode`/`cli-claude-code` (they are no longer active cli-family projection entries), so model-named delegation prompts lose their executor fallback. The alias table does not "empty" — it silently DEGRADES, resolving some prompts to the non-executor `cli-external` and losing resolution for others. This silent degradation is the single most dangerous consequence of the whole fold-in, and it is why the operator chose to rewrite the scorer rather than paper over the family filter.

### Constraints

- Downstream, `executor-config.ts` exposes an `EXECUTOR_KINDS` enum whose members are the exact strings `cli-opencode` and `cli-claude-code`. Whatever the scorer sources its aliases from, it must still RESOLVE TO those strings, or the downstream config rejects the result.
- The rewrite must land in the SAME atomic change as the ADR-004 dissolution — there must be no commit window where the leaves are gone but the scorer still reads the family filter.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Rewrite the scorer to source its executor alias table from `cli-external`'s `mode-registry.json` packets — keyed by `packetSkillName` (`cli-opencode`, `cli-claude-code`) — instead of the top-level `family === 'cli'` projection filter, and to NOT derive an orchestrator noun from the hub id (so `external` never enters the alias table). The scorer still resolves each match to the executor-kind strings `cli-opencode` / `cli-claude-code` that `executor-config.ts`'s `EXECUTOR_KINDS` enum expects, so nothing downstream changes contract. The compiled `dist/` build is refreshed in the same change, and the parity fixtures `tests/parity/fixtures/executor-delegation-cases.json` (the actual 11 cases: 6 `expectedTop: cli-opencode`, 2 `cli-claude-code`, 2 `sk-code`, 1 `none`) are re-baselined while keeping `tests/scorer/executor-delegation.vitest.ts` green. Two acceptance invariants are explicit: the 2 `sk-code` and 1 `none` NEGATIVE-for-cli assertions must stay green (a hub-aware rewrite must not let the "external" noun steal them), and NO scenario may resolve to `cli-external`.

**How it works**: The hub's `mode-registry.json` becomes the single source of truth for which executors exist; the scorer reads the two `packetSkillName` values from it and maps them to their aliases and binaries the same way the old id-derivation did, but hub-aware. This is phase 005's atomic bundle (dissolution gated behind the scorer rewrite landing in the same change) and phase 007's parity re-baseline gate.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rewrite the scorer to source from the hub mode-registry (chosen)** | Fixes the root cause; the mode-registry is already the canonical list of hub modes; resolves to the same executor-kind strings, so downstream is untouched | Requires touching runtime advisor code, refreshing dist, and re-baselining parity fixtures | 9/10 |
| Broaden the filter to also match hub packets AND keep the family filter | Smaller diff | Two code paths for the same table; still couples to `family` and re-breaks if the family convention shifts | 4/10 |
| Hardcode the two executor ids in the scorer | Trivial | Brittle; every future cli mode must edit runtime code; abandons the registry as source of truth | 2/10 |

**Why this one**: The mode-registry is the natural, already-canonical source of truth for hub modes. Sourcing from it fixes the silent-misroute root cause without changing the downstream executor-kind contract, and it makes any future cli mode a metadata-only addition.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Delegation prompts continue to resolve the correct executor after the leaf skills stop existing.
- The mode-registry becomes the single source of truth for executors; future cli modes are metadata-only.

**What it costs**:
- Runtime advisor code, its compiled dist, and the parity fixtures all move together — a larger, more carefully-verified change than a pure file move.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The rewrite lands in a separate commit from the dissolution, opening a silent-misroute window | H | Gate the dissolution behind the scorer rewrite: both land in one atomic change (phase 005) |
| A parity fixture is missed and the scorer regresses undetected | H | Re-baseline all 11 cases (incl. the 2 `sk-code` + 1 `none` negatives) and keep `executor-delegation.vitest.ts` green; phase 007 re-runs a live delegation-routing baseline |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it, delegation prompts silently degrade the moment the leaves dissolve (resolving to the non-executor `cli-external` or losing resolution) — a silent, real failure mode with no thrown error |
| 2 | **Beyond Local Maxima?** | PASS | The filter-broaden and hardcode shortcuts were weighed and rejected as brittle |
| 3 | **Sufficient?** | PASS | Sourcing from the mode-registry plus fixture re-baseline covers the full resolution path |
| 4 | **Fits Goal?** | PASS | Operator explicitly chose "rewrite the scorer to be hub-aware" |
| 5 | **Open Horizons?** | PASS | Future cli modes become metadata-only additions to the registry |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` — alias table sourced from the hub `mode-registry.json` packets, resolving to the `EXECUTOR_KINDS` strings.
- The compiled `dist/` artifact for the scorer — rebuilt in the same change.
- `system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json` — 11 cases re-baselined (6 `cli-opencode`, 2 `cli-claude-code`), preserving the 2 `sk-code` + 1 `none` negatives; no scenario resolves to `cli-external`.
- `tests/scorer/executor-delegation.vitest.ts` — kept green.

**How to roll back**: Revert the atomic phase-005 commit as one unit so the scorer source, dist, fixtures, graph dissolution, and directory move return together. Do not partially restore only the scorer or only the move.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!--
Level 3 Decision Record: five ADRs covering hub topology, full rename, command binding, identity dissolution with family choice, and the load-bearing hub-aware scorer rewrite.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
