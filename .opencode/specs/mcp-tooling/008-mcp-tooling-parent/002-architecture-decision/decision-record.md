---
title: "Decision Record: mcp-tooling parent-hub architecture"
description: "Architecture decisions for folding mcp-chrome-devtools, mcp-click-up, and mcp-figma into one parent hub mcp-tooling with two workflow modes and one figma transport, while mcp-code-mode stays flat."
trigger_phrases:
  - "mcp-tooling parent architecture decision record"
  - "mcp bridge topology adr"
  - "figma transport axis adr"
  - "code-mode exclusion adr"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-tooling-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored six planned ADRs for the hub architecture"
    next_safe_action: "Operator reviews the decision gate before phase 003"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "packetKind topology, figma transport, naming, identity dissolution, code-mode exclusion, and versioning are all locked"
---
# Decision Record: mcp-tooling parent-hub architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Hub topology — two workflow bridges, one figma transport, one transport-axis extension

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator (via approved plan) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`mcp-chrome-devtools`, `mcp-click-up`, and `mcp-figma` are three flat, independently advisor-routable bridge skills, all `family: mcp`, all reaching external tools through the shared Code Mode substrate. This repo's parent-hub canon (already applied to `sk-code`, `sk-design`, `system-deep-loop`, `sk-doc`, `sk-prompt`) exists to give a coherent multi-mode surface one identity. We needed to decide each bridge's `packetKind` — the axis discriminator that separates a `workflow` mode (performs judgment/action on a local axis) from a `transport` mode (bridges to an external tool's CLI/MCP surface, `mutatesWorkspace:false`).

### Constraints

- The transport-packet contract (check 3h, mirrored from `sk-design`'s `design-mcp-open-design`) requires `mutatesWorkspace:false` — a transport writes only to the external tool, never to the local workspace.
- Each bridge's real behavior must decide its axis, not convenience: chrome-devtools writes screenshots/HAR/console dumps to the local workspace; click-up carries orchestration judgment (mandatory `cupt statuses` before marking a task done, `--dry-run` gating); figma authors and exports inside Figma Desktop over the local daemon.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One hub, `mcp-tooling`, with three modes — two `packetKind: "workflow"` bridges (`mcp-chrome-devtools`, `mcp-click-up`) and one `packetKind: "transport"` bridge (`mcp-figma`) — plus a single `transport-axis` extension declaring `transports: ["mcp-figma"]`. This mirrors `sk-design`, the repo's live mixed workflow-plus-transport hub.

**How it works**: chrome-devtools and click-up keep their current `allowed-tools` (both grant `Write`/`Edit`, so `mutatesWorkspace:true`) and route by `routingClass:"metadata"` (hub membership). figma keeps its current `allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]` — no `Write`/`Edit`, so `mutatesWorkspace:false` — which satisfies the transport contract; its authored/exported artifacts land in Figma Desktop, not this repo.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two workflow + one transport, transport-axis extension (chosen)** | Each axis matches the bridge's real behavior; mirrors `sk-design`'s proven mixed hub | Requires declaring and defending the transport-axis extension and a cross-hub pairing (ADR-002) | 9/10 |
| All three as `workflow` modes | Simplest registry, no extension | Mechanically wrong for figma — it never mutates the workspace and has a hard external-tool bridge shape; would misrepresent the axis and lose the transport contract's guarantees | 4/10 |
| All three as `transport` modes | Uniform "they all bridge external tools" mental model | Fails for chrome-devtools and click-up — both mutate the workspace (`Write`/`Edit`) and click-up carries orchestration judgment, so both fail transport check 3h | 3/10 |

**Why this one**: The `allowed-tools` evidence is decisive. chrome-devtools and click-up grant `Write`/`Edit` and mutate the workspace, which fails transport check 3h; only figma grants neither and writes solely to Figma Desktop. Matching each bridge to the axis its behavior already implies is the only shape consistent with the transport contract and `sk-design`'s precedent.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One advisor identity (`mcp-tooling`) instead of three, with each bridge reachable as a mode by strong disambiguating signals (chrome/bdg/devtools, clickup/cupt/task, figma/render/design-token).
- The transport axis makes figma's read-only, external-write nature explicit and enforceable rather than implicit.

**What it costs**:
- The transport-axis extension needs a cross-hub pairing adaptation (figma pairs to `sk-design`, a different hub) — see ADR-002.
- Whether hub-membership metadata routing preserves today's figma-transport routing accuracy is deferred, not pre-answered.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Advisor routing accuracy regresses for the figma transport after the identity merge | M | Phase 007 routing benchmark gate before cutover; scaffold metadata routing and amend only if evidence justifies it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fixes a real structural gap: three coupled `family: mcp` bridges with no shared identity |
| 2 | **Beyond Local Maxima?** | PASS | All-workflow and all-transport alternatives were weighed and mechanically ruled out by `allowed-tools` evidence |
| 3 | **Sufficient?** | PASS | One transport-axis extension is the minimum shape that represents figma's real behavior; no speculative surface/runtime axis added |
| 4 | **Fits Goal?** | PASS | Directly the operator's stated request: one hub, two workflow bridges, one figma transport |
| 5 | **Open Horizons?** | PASS | Matches `sk-design`'s reference shape; future modes remain addable without restructuring |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Future `.opencode/skills/mcp-tooling/mode-registry.json` — three `modes[]` entries; `mcp-chrome-devtools` and `mcp-click-up` as `packetKind:"workflow"`, `mcp-figma` as `packetKind:"transport"` with `mutatesWorkspace:false`.
- Future `.opencode/skills/mcp-tooling/hub-router.json` — base three outcomes (`single`, `orderedBundle`, `defer`), `routerPolicy.defaultMode:"mcp-chrome-devtools"`.

**How to roll back**: Phase 003 has not yet run (additive-only, no content moved). Reverting this ADR before phase 003 starts costs nothing — just redraft the registry target shape. After phase 003, rollback means restoring the three flat skills from git history and deleting the hub skeleton.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: figma transport plus cross-hub judgment pairing to sk-design

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator (via approved plan) |

---

<!-- ANCHOR:adr-002-context -->
### Context

`sk-design`'s `transport-axis` contract says a transport packet pairs with "the hub's OWN workflow modes" before any design-affecting operation. But `mcp-figma`'s mandatory judgment partner is `sk-design` — a DIFFERENT hub — recorded today as a `depends_on sk-design` edge (weight 0.7) in figma's `graph-metadata.json`. CLAUDE.md already calls `mcp-figma` "the external sibling Figma transport," so a cross-hub pairing is the existing reality, not a new invention.

### Constraints

- The transport must never make design taste decisions itself; a judgment partner is mandatory before any design-affecting figma operation.
- `mcp-tooling`'s own workflow modes (chrome-devtools, click-up) are browser and task tooling, not design judgment, so figma cannot satisfy its pairing requirement from inside its own hub.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Author the `transport-axis` extension to LICENSE a cross-hub judgment partner. The `mcp-figma` transport declares its mandatory pairing to `sk-design` (a different hub), and the extension's contract documents that a transport may pair cross-hub when no in-hub workflow mode can supply the required judgment.

**How it works**: The hub's `mode-registry.json` `extensions.transport-axis` block records `transports: ["mcp-figma"]` and a mandatory-pairing note pointing at `sk-design`. figma's outward `depends_on sk-design` edge is preserved in the hub graph identity (ADR-004) so the pairing stays discoverable.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **License a cross-hub judgment partner (chosen)** | Matches figma's real, already-recorded `sk-design` dependency and CLAUDE.md's existing "external sibling transport" framing | Adapts the transport-axis contract's "own hub" wording; must be documented, not silent | 8/10 |
| Keep figma a flat standalone transport skill outside the hub | No contract adaptation needed | Loses the whole point of the fold-in for figma; leaves a third flat `family: mcp` skill and no single tooling identity | 5/10 |
| Add a thin in-hub design-judgment shim so figma pairs "inside" the hub | Literal compliance with the "own hub" wording | Invents a redundant judgment surface that duplicates `sk-design`; over-engineering with no behavioral need | 2/10 |

**Why this one**: The cross-hub pairing is a small, defensible contract adaptation that matches reality — figma already depends on `sk-design`, and CLAUDE.md already frames it as a cross-hub sibling transport. Documenting the adaptation as an accepted ADR (rather than hand-rolling a shim or silently deviating) is the honest, minimal path.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- figma's mandatory design-judgment pairing stays intact and explicit after the fold-in, pointing at the correct partner (`sk-design`).
- The transport-axis contract gains a documented, reusable rule for legitimate cross-hub pairings.

**What it costs**:
- A one-time contract-wording adaptation that future readers must reconcile against `sk-design`'s original "own hub" phrasing. Mitigation: this ADR records the adaptation and its precedent.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The cross-hub pairing drifts from `sk-design`'s transport contract over time | L | ADR recorded; phase 006's prose reconciliation restates CLAUDE.md's figma framing to match |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | figma's mandatory judgment partner genuinely lives in a different hub; the pairing must be licensed to survive the fold-in |
| 2 | **Beyond Local Maxima?** | PASS | Flat-standalone and in-hub-shim alternatives were weighed and rejected with reasons |
| 3 | **Sufficient?** | PASS | A documented contract adaptation is the minimum; no redundant judgment surface added |
| 4 | **Fits Goal?** | PASS | Keeps figma in the tooling hub while preserving its real `sk-design` pairing |
| 5 | **Open Horizons?** | PASS | Establishes a reusable rule for any future legitimate cross-hub transport pairing |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Future `mode-registry.json` `extensions.transport-axis` records `transports: ["mcp-figma"]` and a mandatory cross-hub pairing note to `sk-design`.
- The hub `graph-metadata.json` (ADR-004) preserves figma's outward `depends_on sk-design` edge.

**How to roll back**: Redraft the extension block; if figma is instead kept flat (the ADR-002 fallback), remove it from the `transports` list and leave it a standalone skill.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Naming — full git mv, keep the mcp- prefix

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

Folding the three bridges in required choosing packet folder names. The options were to keep the `mcp-` prefix (`mcp-tooling/mcp-chrome-devtools/`, `mcp-tooling/mcp-click-up/`, `mcp-tooling/mcp-figma/`) or to drop it (`mcp-tooling/chrome-devtools/`, etc.). `sk-design` keeps its `design-` prefix on nested packets, so a prefixed nested name is established canon.

### Constraints

- Dropping the prefix would collide the `figma` packet name with the `.utcp_config.json` manual literally named `figma` (the Framelink `figma-developer-mcp` manual) — an avoidable naming hazard.
- `folder == packetSkillName == workflowMode` must hold with `grandfatheredFolderMismatch:false` for clean advisor routing.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Full `git mv` rename that KEEPS the `mcp-` prefix. `mcp-chrome-devtools/*` → `mcp-tooling/mcp-chrome-devtools/*`, `mcp-click-up/*` → `mcp-tooling/mcp-click-up/*`, `mcp-figma/*` → `mcp-tooling/mcp-figma/*`. `folder == packetSkillName == workflowMode` for all three; `grandfatheredFolderMismatch:false`.

**How it works**: Phase 004 moves the 41-file chrome-devtools tree; phase 005 moves the 154-file click-up tree and the 40-file figma tree. `git mv` is a rename, tracked efficiently by git.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full rename, keep the mcp- prefix (chosen)** | Matches `sk-design`'s `design-*` prefixed-packet canon; preserves ~name references; avoids the `figma` manual collision | Prefixed nested names are slightly longer | 9/10 |
| Full rename, drop the prefix | Shorter mode names | Collides the `figma` packet with the `.utcp_config.json` `figma` manual; diverges from the `mcp-` family naming the bridges already use | 4/10 |
| Keep folders flat, diverge `workflowMode` from folder | Zero file moves | Leaves three flat skills with a `grandfatheredFolderMismatch`, defeating the canon-purity goal | 5/10 |

**Why this one**: Keeping the prefix preserves the bridges' existing `mcp-` names (so ~name prose references still resolve), matches `sk-design`'s prefixed-packet precedent, and sidesteps the `figma`/`figma`-manual collision — all while keeping `grandfatheredFolderMismatch:false`.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Zero naming debt (`grandfatheredFolderMismatch:false`) across the hub.
- The `mcp-` family prefix stays consistent and the `figma` manual collision is avoided.

**What it costs**:
- File moves in phases 004-005 (41 + 154 + 40 tracked files). Mitigation: `git mv` renames, not rewrites; functional path referrers are repointed in the same phases and re-swept in phase 006.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A referrer to an old skill-folder path is missed and fails silently | H | Phase 006's re-run grep sweep as an explicit gate before phase 007 |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The fold-in requires a naming decision; keeping the prefix avoids a real manual-name collision |
| 2 | **Beyond Local Maxima?** | PASS | Drop-prefix and keep-flat alternatives were both specified and weighed |
| 3 | **Sufficient?** | PASS | No further naming cleanup remains after the rename — no partial/mixed state |
| 4 | **Fits Goal?** | PASS | Operator-directed full rename with the prefix kept |
| 5 | **Open Horizons?** | PASS | Consistent prefixed-packet naming for any future `mcp-tooling` mode |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.opencode/skills/mcp-chrome-devtools/*` (41 files) → `.opencode/skills/mcp-tooling/mcp-chrome-devtools/*` via `git mv` (phase 004).
- `.opencode/skills/mcp-click-up/*` (154 files) and `.opencode/skills/mcp-figma/*` (40 files) → under `.opencode/skills/mcp-tooling/` via `git mv` (phase 005).

**How to roll back**: `git mv` is reversible with an inverse `git mv` before the commit lands; after commit, `git revert`.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Identity dissolution — one hub graph identity, code-mode edges become cross-skill deps

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-004-context -->
### Context

Each bridge carries its own `graph-metadata.json` today (`skill_id` mcp-chrome-devtools / mcp-click-up / mcp-figma, all `family: mcp`). A parent hub exposes ONE advisor identity, so the three packet graph identities must dissolve into a single hub `graph-metadata.json` without losing useful graph relationships. Two edge classes need care: the intra-set `depends_on mcp-code-mode` edges (code-mode is NOT a hub member — see ADR-005) and the outward `enhances sk-code` / figma `depends_on sk-design` edges.

### Constraints

- The three bridges reach code-mode via the `code_mode` MCP registration KEY, which is unchanged by the move, so their MCP-fallback branch keeps working after they move.
- The sibling edges between chrome-devtools and figma (currently `siblings`) become intra-hub relationships and dissolve into hub membership.
- Deleting the three child identities also strands INBOUND (reverse) edges held by OTHER skills' graph files: `mcp-code-mode/graph-metadata.json` (`prerequisite_for` -> all three bridges at 0.7, plus `manual.related_to` -> mcp-chrome-devtools) and `sk-design/graph-metadata.json` (`siblings` -> mcp-figma 0.45, `prerequisite_for` -> mcp-figma 0.7, `manual.related_to` -> mcp-figma). These must be repointed to `mcp-tooling` or they dangle.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Delete the three children's `graph-metadata.json` and author ONE hub `graph-metadata.json` (`skill_id: mcp-tooling`, `family: mcp`) folding the union of their `intent_signals`/`trigger_phrases` and their OUTWARD edges: figma `depends_on sk-design`, and the union of the `enhances sk-code` edges. The intra-set `depends_on mcp-code-mode` edges become documented cross-skill dependencies (code-mode is external to the hub, reached by the `code_mode` MCP registration key) — NOT dissolved into the hub registry, since code-mode is not a hub member.

**How it works**: Phase 006 authors the hub `graph-metadata.json` union and deletes the three child files. The intra-hub sibling edges (chrome-devtools ↔ figma) collapse into hub membership. Phase 006 ALSO repoints the inbound/reverse edges in `mcp-code-mode/graph-metadata.json` and `sk-design/graph-metadata.json` from the three bridge ids to `mcp-tooling`, so no external graph file is left pointing at a deleted identity. The child-identity deletion, the hub-identity authoring, and the reverse-edge repoints land as one atomic change (see ADR-005 for the code-mode carve-out).
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One hub graph identity, code-mode as cross-skill dep (chosen)** | One advisor identity; preserves the outward `sk-design`/`sk-code` edges; keeps the code-mode dependency honest as an external cross-skill link | Requires carefully unioning three edge sets | 9/10 |
| Keep all three child `graph-metadata.json` files | No union work | Three advisor identities under one hub — breaks the single-identity canon | 2/10 |
| Fold `mcp-code-mode` into the registry as an internal edge | "Everything in one graph" | Wrong — code-mode is excluded (ADR-005) and external; folding it in would misrepresent the hub membership | 3/10 |

**Why this one**: Single identity is the canon requirement; the outward edges to `sk-design` and `sk-code` are genuinely useful and must survive; and the code-mode dependency is real but external, so it belongs as a documented cross-skill dependency rather than a dissolved intra-hub edge.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- One advisor identity for all tooling; the outward `sk-design` (figma judgment pairing) and `sk-code` (implementation enhancement) edges stay discoverable.
- The code-mode dependency stays explicit and correct as an external cross-skill link.

**What it costs**:
- A one-time union of three edge sets, plus retargeting the 3 `labeled-prompts.jsonl` rows that name `mcp-chrome-devtools` to `mcp-tooling` (phase 006), and an advisor skill-graph DB rebuild to re-key the hub.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A useful outward edge is dropped during the union | M | ADR names the exact edges to preserve (figma→sk-design, union enhances→sk-code); phase 006 verifies against the three source files |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Single advisor identity is a hard canon requirement for a parent hub |
| 2 | **Beyond Local Maxima?** | PASS | Keep-all-three and fold-in-code-mode alternatives were weighed and rejected |
| 3 | **Sufficient?** | PASS | Union of outward edges plus a documented cross-skill dependency is the minimum correct shape |
| 4 | **Fits Goal?** | PASS | Operator-directed identity dissolution with edge preservation |
| 5 | **Open Horizons?** | PASS | The hub graph identity accepts future mode edges without restructuring |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Delete `.opencode/skills/mcp-tooling/mcp-chrome-devtools/graph-metadata.json`, `.../mcp-click-up/graph-metadata.json`, `.../mcp-figma/graph-metadata.json` (after the move).
- Author `.opencode/skills/mcp-tooling/graph-metadata.json` unioning intent signals, trigger phrases, and outward edges; record the `mcp-code-mode` dependency as an external cross-skill link.
- Repoint reverse edges in `.opencode/skills/mcp-code-mode/graph-metadata.json` (`prerequisite_for` for all three bridges, `manual.related_to`) and `.opencode/skills/sk-design/graph-metadata.json` (`siblings`, `prerequisite_for`, `manual.related_to` for mcp-figma) from the bridge ids to `mcp-tooling`.

**How to roll back**: Restore the three child `graph-metadata.json` files and the two reverse-edge edits from git history and remove the hub file.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: mcp-code-mode is excluded and stays flat standalone infrastructure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-005-context -->
### Context

`mcp-code-mode` is a fourth `family: mcp` skill and could superficially look like a hub member. But it is the shared MCP execution substrate that the three bridges (and other skills) call through — and it is a core `opencode.json` native-MCP server registered as `code_mode`, serving manuals well beyond this set (`github`, `open_design`, `refero`, and more).

### Constraints

- The `code_mode` registration key is referenced by `opencode.json` / `.claude/mcp.json` and derives the `mcp__code_mode__*` tool ids; moving the skill folder must not disturb it.
- Relocating a live native-MCP server would require an atomic server relocation plus an npm rebuild plus dual-registration repointing — a materially higher blast radius than doc-only skill moves.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: EXCLUDE `mcp-code-mode` from this program. Its folder is not moved into the hub and its live MCP server is not relocated. The three bridges keep reaching it via the unchanged `code_mode` MCP registration key, so their MCP-fallback branch keeps working after they move. One scoped carve-out: phase 006 edits `mcp-code-mode`'s `graph-metadata.json` reverse edges (repointing them from the bridge ids to `mcp-tooling`, per ADR-004) — a metadata edit, not a server relocation, so it stays in-bounds.

**How it works**: The hub has exactly three members (chrome-devtools, click-up, figma). code-mode is referenced as an external cross-skill dependency (ADR-004), never as a mode. The only touch to code-mode is the graph-metadata reverse-edge repoint.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exclude code-mode, keep it flat (chosen)** | Lowest blast radius; the whole program stays doc-only skill moves; the live native-MCP server is untouched | The hub does not contain the shared substrate it depends on (acceptable — the substrate is external by design) | 9/10 |
| Fold code-mode into the hub as a fourth mode | "All mcp skills in one place" | Requires an atomic live-server relocation, npm rebuild, and dual-registration repoint; serves manuals beyond this set, so a move would ripple far outside the hub | 2/10 |

**Why this one**: Excluding code-mode keeps this entire program low-risk (doc-only skill moves) and respects that code-mode is shared infrastructure serving consumers well beyond these three bridges. Operator chose the lower-blast-radius fork.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The program stays a set of low-risk, reversible, doc-only skill moves.
- The live `code_mode` native-MCP server and every consumer beyond these bridges are untouched.

**What it costs**:
- The hub does not physically contain its shared execution substrate. Mitigation: the dependency is documented as an external cross-skill link (ADR-004), which is the correct representation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future reader assumes code-mode should have been folded in | L | This ADR records the exclusion rationale explicitly |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without an explicit exclusion, a future pass might wrongly try to fold in a live shared server |
| 2 | **Beyond Local Maxima?** | PASS | The fold-in alternative was fully specified with its blast radius before rejection |
| 3 | **Sufficient?** | PASS | Excluding one skill is the minimal boundary; nothing else needs carving out |
| 4 | **Fits Goal?** | PASS | Operator explicitly chose the lower-blast-radius fork |
| 5 | **Open Horizons?** | PASS | code-mode can still be reorganized later in its own separately-scoped, higher-rigor change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `mcp-code-mode`'s live MCP server and its `opencode.json` / `.claude/mcp.json` `code_mode` registration stay as-is — no server relocation, no npm rebuild, no re-registration.
- The ONLY edit to `mcp-code-mode` is metadata: its `graph-metadata.json` reverse edges (`prerequisite_for` for the three bridges, `manual.related_to`) are repointed to `mcp-tooling` in phase 006 (ADR-004), so no external graph file dangles after the child-identity deletion.
- The hub `graph-metadata.json` records the `mcp-code-mode` dependency as an external cross-skill link.

**How to roll back**: Revert the phase 006 graph-metadata reverse-edge edit via git; the server and registration were never touched.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Versioning, command binding, and the concrete registry/router target

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-006-context -->
### Context

Two smaller decisions remained: how to version the new hub versus its members, and whether any of the three bridges needs a bound slash command. None of the three has a bound `/` command today; the `/doctor:mcp` router is a separate command that stays. The hub `family` is `mcp` (already shared by all three members).

### Constraints

- `routerPolicy.defaultMode` must be a registered mode in the mode set or explicit null — `parent-skill-check.cjs` check 5h validates registry MEMBERSHIP only, NOT packetKind, so a transport is a legal default. (Check 5i is a separate rule that orders workflow modes before the transport in the tie-break list.) Choosing a workflow default is a design call here, not a checker constraint.
- The three bridges carry distinct, strong disambiguating signals, so the router routes by signal and only falls to `defaultMode` when a query is genuinely ambiguous.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: The hub `SKILL.md` starts at `1.0.0.0`; each child keeps its own version (chrome-devtools `1.0.8.0`, click-up `1.0.0.0`, figma `1.0.0.0`) and independent changelog continuity. No new commands: all three packets carry `command: null` (matching `sk-design`'s transport, which also has no command); the `/doctor:mcp` router is separate and stays. `routerPolicy.defaultMode:"mcp-chrome-devtools"` — browser inspection is the most general "look at something live" default — but this is a weak default: genuinely ambiguous non-matching queries should `defer`/disambiguate rather than silently default.

**How it works**: Phase 003 scaffolds the hub `SKILL.md` at `1.0.0.0` and the registry/router files against the target appendix in `plan.md`. Phases 004-005 move each child tree with its own version and changelog intact.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hub 1.0.0.0, children keep own versions, no commands, default chrome-devtools (chosen)** | Matches the hub-versioning convention used by sk-code/sk-design/sk-doc/sk-prompt; preserves each bridge's changelog continuity; no command churn | The default mode is weak (mitigated by defer-on-ambiguity) | 8/10 |
| Renumber all three children to a shared version | Uniform version | Discards independent changelog continuity for no benefit | 3/10 |
| Add a `/mcp:*` command surface | Interactive entry points | Operator declined; none of the three has a command today, and the `/doctor:mcp` router already covers install/debug | 4/10 |

**Why this one**: Hub-at-1.0.0.0 with independent child versions matches every prior hub in the repo; no-command matches the bridges' current zero-command reality; and a weak `defaultMode` with defer-on-ambiguity is honest about the router's behavior.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Versioning is consistent with prior hubs; each bridge keeps its own changelog history.
- No new command surface to maintain; routing leans on strong per-bridge signals.

**What it costs**:
- The weak `defaultMode` could mis-route a genuinely ambiguous query. Mitigation: the router defers/disambiguates on ambiguity rather than silently defaulting, and phase 007 benchmarks routing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ambiguous queries silently default to chrome-devtools | L | Router `defer` outcome plus phase 007 routing benchmark |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The hub needs a version and a router default; both must be decided before scaffold |
| 2 | **Beyond Local Maxima?** | PASS | Shared-version and add-command alternatives were weighed and rejected |
| 3 | **Sufficient?** | PASS | Minimal: hub version, kept child versions, no commands, one default |
| 4 | **Fits Goal?** | PASS | Matches the operator's no-command choice and the prior-hub versioning convention |
| 5 | **Open Horizons?** | PASS | A command surface or stronger default remains addable later without re-litigating this ADR |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- New hub `.opencode/skills/mcp-tooling/SKILL.md` frontmatter `version: 1.0.0.0` (phase 003).
- Each moved child keeps its own `version:` and `changelog/` (phases 004-005).
- `hub-router.json` sets `defaultMode:"mcp-chrome-devtools"` with a `defer` outcome for ambiguity (phase 003).

**How to roll back**: Single-field edits and file moves; revert via git.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!--
Level 3 Decision Record: 6 ADRs covering hub topology, figma transport plus cross-hub pairing, naming, identity dissolution, code-mode exclusion, and versioning/command binding.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
