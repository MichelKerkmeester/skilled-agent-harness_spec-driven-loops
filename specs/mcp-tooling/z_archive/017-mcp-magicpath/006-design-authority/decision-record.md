---
title: "Decision Record: MagicPath design authority"
description: "Frozen decisions for the design-authority binding: why crossHubPairing must stay empty, why sk-design rather than sk-design-md-generator, why the persona's write capability is withheld, and the operator-requested scope amendment for the sibling aggregation symlinks."
trigger_phrases:
  - "crosshubpairing must stay empty"
  - "magicpath design authority adr"
  - "judgment registry missing"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/017-mcp-magicpath/006-design-authority"
    last_updated_at: "2026-08-29T19:45:00Z"
    last_updated_by: "session"
    recent_action: "Froze the ADRs, including the crossHubPairing reversal"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: MagicPath design authority

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

> Provenance: ADR-001 reverses a change this phase had already made and recorded as correct. The reversal was forced by a pre-push gate, and the reasoning is preserved here rather than quietly dropped, because the mistake is more instructive than the fix.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: crossHubPairing stays empty

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Orchestrator, forced by the compiled-routing pre-push gate |

<!-- ANCHOR:adr-001-context -->
### Context

This phase read `"crossHubPairing": {}` in the hub's transport-axis extension as an unfinished field. The axis named each transport's design partner in prose, and a reader could not resolve it from the registry, so populating the field looked like a plain improvement. An `mcp-magicpath` entry was written carrying the paired skill, trigger, persona and conflict resolution, and the phase recorded that as a requirement met.

The pre-push gate refused the push: `BLOCKED [gate:compiled-routing]`, with `mcp-tooling` reported as `Routing inputs do not compile`.

A bisect isolated the cause. Holding the pre-change registry constant and applying one change at a time, the version bump compiled (`stale-manifest`, hash `80619309e451`) and the axis-description rewrite compiled (hash `0ed833d76d9f`), while the `crossHubPairing` entry alone produced `compile-error` with a null policy hash. Reducing the entry to a bare `{"mcp-magicpath": "sk-design"}` failed identically, so the shape was not the problem.

`registry-compiler.cjs:249-255` explains it. The compiler reads `Object.values(pairing)` as **skill ids**, looks each up in `judgmentRegistries`, and fails `JUDGMENT_REGISTRY_MISSING` when one is absent. It then asserts byte-identity of that skill's `mode-registry.json` and `SKILL.md`. `sk-design` is a flat standalone skill with no `mode-registry.json` at all, so it can never be a member of that set.

The comment directly above that code is the decisive part. The pairing is described as retained "purely for provenance hashing and input-integrity checking", explicitly no longer contributing a live composition rule or destination, because a compiled bundle built from it "could add a target legacy never routes — exactly how MT-008 over-routed `sk-design`'s md-generator alongside `mcp-refero`".

### Constraints

- The field is not unfinished. It was deliberately emptied after a recorded over-routing incident.
- Any value at all breaks compilation and blocks every push from the repository, not just this change.
- The pairing must still be discoverable by a reader.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

`crossHubPairing` returns to `{}` and stays there. The pairing is documented in prose only: the packet's `references/design-authority.md`, its `SKILL.md` cross-workflow contracts, the hub's transport-axis description, and both changelogs.

REQ-005 is superseded rather than met. AC-005 carries this ADR as its waiver.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **Skip the gate** (`SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1`, which the gate itself offers) — rejected. The gate was reporting a real compile failure caused by this change, not a stale-manifest nuisance. Skipping would have pushed a registry that no longer compiles and left the next person to discover it.
- **Give `sk-design` a `mode-registry.json` so it qualifies** — rejected. It is a flat standalone skill by design, and manufacturing hub-member metadata for it to satisfy a provenance-hashing field is a large change to an unrelated skill in service of a field that is deliberately inert.
- **Extend the compiler to accept an inert descriptive pairing** — rejected as out of scope. It touches the routing compiler, and the MT-008 incident is the reason the live path was removed; re-opening it needs its own packet and its own evidence.
- **Populate it and also backfill the three siblings**, as later requested — rejected on the same evidence. It fails identically and would re-create the MT-008 class of defect.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- **Positive**: the registry compiles, the push gate passes, and the MT-008 over-routing class stays closed. The field's emptiness is now documented as deliberate, so the next reader does not repeat this.
- **Negative**: the pairing remains prose-only and unresolvable from the registry, which is the exact gap this phase set out to close. The gap is real and now has a recorded reason rather than a fix.
- **Lesson**: an empty field is not evidence of an unfinished one. This phase treated `{}` as a gap without checking whether anything consumed it, and the consumer's own comment recorded both the deliberate emptying and the incident behind it.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

- **Simplicity**: leaving a field empty is simpler than the entry that broke the build.
- **Systems**: the field is consumed by `registry-compiler.cjs`, which resolves its values against `judgmentRegistries` and gates every push through the compiled-routing hook.
- **Bias**: the phase assumed an empty field meant an unfinished one, without checking whether anything read it.
- **Sustainability**: the emptiness is now documented as deliberate, with the incident behind it named.
- **Value**: restores a compiling registry and keeps the MT-008 over-routing class closed.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Return `extensions['transport-axis'].crossHubPairing` to `{}` in `.opencode/skills/mcp-tooling/mode-registry.json`; keep the rewritten axis description, which compiles; correct the spec, criteria, tasks, summary and both changelogs to record the reversal rather than the claim.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: sk-design, not sk-design-md-generator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Operator (named `sk-design` explicitly); orchestrator |

<!-- ANCHOR:adr-002-context -->
### Context

The three sibling design transports all pair with `sk-design-md-generator`, which measures a live surface's real CSS into named tokens. Copying that convention would have been the low-friction choice.

`get_theme` already returns named CSS variables and fonts, authored as a design system. The measurement is what the API hands back.

### Constraints

- The transport must not become a taste authority itself.
- The pairing must be reachable on every request, not on a keyword.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

Pair with `sk-design`, the decide skill, unconditionally at STEP 0. `sk-design-md-generator` still applies when the reference is an external live site rather than a MagicPath theme, and that carve-out is stated where a reader meets the divergence.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

- **Mirror the siblings with `sk-design-md-generator`** — rejected: it would re-measure values the API already returns as tokens, and would leave the decide half still unowned.
- **Gate the pairing on design keywords** — rejected: the request most likely to need judgment is the one phrased as plumbing ("what variables does this theme have?"), which is exactly what a keyword gate misses.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- **Positive**: the judgment has a present owner on every request, and the divergence from the siblings is deliberate and recorded.
- **Negative**: this hub now has two different design pairings, so a reader must check which transport they are on. Several hub sentences that assumed one pairing had to be corrected.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

- **Simplicity**: one skill, loaded once, rather than a conditional pairing with a trigger to maintain.
- **Systems**: touches the packet's entry contract and the hub sentences that assumed one pairing for four transports.
- **Bias**: the sibling convention was the anchor to resist; matching it would have been convention over evidence.
- **Sustainability**: the divergence is recorded where a reader meets it, so it does not read as an oversight.
- **Value**: the judgment MagicPath facts invite now has a present owner.
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

`sk-design` loads at STEP 0 of the packet's phase detection, with an `ALWAYS` row in the Resource Loading Levels table and a first ALWAYS rule stating that loading means reading; `references/design-authority.md` §3 carries the reason for diverging from the siblings.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The persona's write capability is withheld

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Orchestrator |

<!-- ANCHOR:adr-003-context -->
### Context

The design agent declares itself "LEAF-only and write-capable". This transport declares `mutatesWorkspace:false` with Write, Edit and Task forbidden. Adopting the persona wholesale would grant a write authority nobody decided to grant.

### Constraints

- The transport axis' guarantee depends on transports not mutating the workspace.
- The persona's judgment discipline is the reason for adopting it at all.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

Inherit the judgment contract and the LEAF discipline; withhold the write authority explicitly. On conflict, the transport's narrower surface wins.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

- **Adopt the persona as written** — rejected: any transport adopting a write-capable persona would silently leave the transport axis, and the axis would stop meaning anything.
- **Do not adopt a persona at all** — rejected: it was explicitly requested, and the judgment discipline is the useful half.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- **Positive**: verifiable. The permission list and the registered tool count are identical either side of the change.
- **Negative**: the exclusion is documented, not enforced; nothing verifies the reasoning survives a future edit to either document.
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

- **Simplicity**: one stated precedence rule rather than a per-tool reconciliation.
- **Systems**: the transport axis' guarantee, the packet's `allowed-tools`, and the registry's `forbidden` list all depend on this holding.
- **Bias**: adopting a document should never be a way to acquire a permission.
- **Sustainability**: the conflict is named in the contract, so the next adopter meets it rather than rediscovering it.
- **Value**: verifiable — the permission list and tool count are identical either side of the change.
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

ALWAYS rule 7 in the packet's `SKILL.md` states the conflict and its resolution; `references/design-authority.md` §4 lists what is inherited and what is withheld; `allowed-tools` and the registry `toolSurface` are unchanged.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Operator scope amendment for the sibling aggregation symlinks

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Operator (explicit request); orchestrator |

<!-- ANCHOR:adr-004-context -->
### Context

This phase's spec listed the missing `mcp-notion` and `mcp-obsidian` aggregation symlinks as out of scope: they were found while taking the baseline, and neither was this mode. The operator then asked for them explicitly.

### Constraints

- The spec's scope is frozen; widening it requires a recorded amendment, not a silent edit.
- The change is two symlinks with no consumer that could break.
<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision

Amend this phase's scope to include both symlinks rather than opening a phase 007 for them. The work is two links, shares this phase's baseline and verification, and a separate phase would carry more ceremony than content.
<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

- **A new phase 007** — rejected: two symlinks do not warrant a spec, plan, tasks, criteria and metadata set of their own.
- **Do them silently inside the existing scope** — rejected: the spec explicitly excluded them, and editing frozen scope without a record is the failure this document exists to prevent.
<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences

- **Positive**: all ten aggregation entries now resolve; the directory is complete for the first time.
- **Negative**: this phase's scope no longer matches what it was planned as, which is why the amendment is recorded here rather than inferred from the diff.
<!-- /ANCHOR:adr-004-consequences -->

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

- **Simplicity**: two symlinks; a phase of their own would be more ceremony than content.
- **Systems**: the aggregation directory only; no consumer reads it programmatically.
- **Bias**: the temptation was to do them silently inside an existing scope that excluded them.
- **Sustainability**: the amendment is recorded, so the spec's Out of Scope list and the diff do not contradict each other unexplained.
- **Value**: the aggregation directory is complete for the first time.
<!-- /ANCHOR:adr-004-five-checks -->

<!-- ANCHOR:adr-004-impl -->
### Implementation

Create `.opencode/changelog/mcp-tooling/mcp-notion` and `.../mcp-obsidian` pointing at each packet's own `changelog/` directory, matching the sibling pattern; confirm all ten entries resolve.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---
