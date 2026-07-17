---
title: "Decision Record: sk-doc Router Path-Contract Fixes"
description: "Six settled design decisions from the 010 research packet: canonical typed-pair identity, composite uniqueness, N-to-1 fan-out, authored shared aliases, dual-read/single-write/fail-closed migration and frozen contract names, plus two implementation-scoped decisions on bundle capping and invalid-oracle handling. Each ADR folds in its eliminated alternatives with rejection rationale."
trigger_phrases:
  - "sk-doc routing fixes decision record"
  - "typed pair identity adr"
  - "composite uniqueness adr"
  - "dual read single write fail closed migration"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored eight ADRs from research.md Section 5 decisions and Section 11 alternatives"
    next_safe_action: "Operator reviews and accepts the ADRs before Phase 1 implementation starts"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-sk-doc-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "All eight ADRs are Proposed, sourced directly from the 10-iteration research packet's settled design decisions"
---
# Decision Record: sk-doc Router Path-Contract Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical public identity is the typed pair (workflowMode, leafResourceId)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Deep-research session dr-20260716-052950-sk-doc-routing (iteration 6, pressure-tested iteration 7) |

---

<!-- ANCHOR:adr-001-context -->
### Context

sk-doc's router lives in two layers. The hub layer selects a `workflowMode` and a packet entrypoint. The packet layer resolves local leaf resources under that packet's own root. No handoff contract ever defined which coordinate frame the public answer uses once those two layers meet. The research traced four of six wrong-root benchmark rows directly to that gap. The create-skill authoring stack makes it worse: standalone packet routers emit packet-root-relative leaf IDs, while the parent-hub schema declares hub-root-relative, packet-qualified resources. Both are internally coherent. Together they are ambiguous.

### Constraints

- The fix cannot change what a packet's own files already look like on disk, only how the router announces them.
- sk-code already emits hub-qualified strings for its own resources. Copying that shape would preserve the exact ambiguity sk-doc needs to remove, not resolve it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the canonical public identity for any sk-doc resource is the typed pair `(workflowMode, leafResourceId)`, where `leafResourceId` is packet-root-relative and begins `references/` or `assets/`.

**How it works**: hub load addresses stay hub-root-relative and packet-qualified for internal use. The contract library converts to the typed pair at one boundary only, after the packet router returns local resources and before serialization to any caller or benchmark. No emitter is allowed to prepend `modes[].packet` to a `leafResourceId`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Typed pair, packet-root-relative** | One coordinate frame, matches how packets already reference their own files, single conversion boundary | Requires every emitter to adopt the same boundary discipline | 9/10 |
| Packet-qualified public IDs (sk-code's shape) | Already implemented elsewhere in the repo | Preserves the exact wrong-root ambiguity this packet exists to fix | 2/10 |
| Copied normalization logic per caller | No shared library to maintain | Each caller drifts independently. The original defect was exactly this kind of unowned duplication | 2/10 |

**Why this one**: a single typed pair with one conversion boundary gives every consumer, guard, fixture, replay, dispatch and scorer, the same answer to "what is this resource called," which is the property the benchmark needs to score real recall.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Six wrong-root benchmark rows (SD-007, SD-009, SD-003, SD-016, SD-011, SD-020) become scoreable against a stable identity instead of a path-format artifact.
- Future packet authors read one contract instead of reconciling two.

**What it costs**:
- Every existing emitter (`router-replay.cjs`, `executor-dispatch.cjs`) needs an update to produce the typed pair. Mitigation: the dual-read bridge in ADR-005 keeps legacy readers working during the transition.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future emitter re-derives its own normalization instead of calling the contract library | M | `parent-skill-check.cjs` guard codes (ADR-006) catch drift at commit time |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four of six wrong-root rows are confirmed manifestations of the undefined handoff (research.md Section 3) |
| 2 | **Beyond Local Maxima?** | PASS | Iteration 6 considered packet-qualified IDs and copied-normalization before settling on the typed pair |
| 3 | **Sufficient?** | PASS | One conversion boundary, no per-caller special cases |
| 4 | **Fits Goal?** | PASS | Directly targets the largest single failure class in the benchmark |
| 5 | **Open Horizons?** | PASS | The same contract serves any future sk-doc packet without rework |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `leaf-resource-contract.cjs` (new): owns normalization and the conversion boundary.
- `router-replay.cjs`, `executor-dispatch.cjs` (modified): call the contract library instead of deriving paths themselves.

**How to roll back**: revert the contract-library and emitter commits together. The dual-read bridge means no fixture data is lost by reverting.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Composite uniqueness, not leaf uniqueness

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Deep-research session dr-20260716-052950-sk-doc-routing (iteration 7) |

---

### Context

`references/README.md` legally exists in ten of sk-doc's packets. A manifest keyed on the local leaf name alone would treat all ten as one collision.

### Constraints

- Every packet needs its own README without an artificial rename.
- The manifest still needs a way to detect a real duplicate within one packet's own tree.

---

### Decision

**We chose**: uniqueness is enforced on the composite pair `(workflowMode, leafResourceId)`, not on `leafResourceId` alone.

**How it works**: the manifest generator groups entries by workflowMode first, then checks for duplicate `leafResourceId` values only inside that group.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Composite-pair uniqueness** | Matches the real duplication boundary (packet root, not repo-wide) | Requires the workflowMode to be part of every key comparison | 9/10 |
| Global `leafResourceId` uniqueness | Simpler key comparison | Collides on the ten legitimate `references/README.md` duplicates | 1/10 |
| Packet-directory-keyed manifest generation | Avoids the collision by construction | Collapses the N-to-1 `create-skill`/`create-skill-parent` fan-out (see ADR-003) | 2/10 |

**Why this one**: the composite pair is the smallest key that reflects how packets actually share filenames without colliding in practice.

---

### Consequences

**What improves**:
- Ten packets keep their own `references/README.md` without a rename or an alias workaround.

**What it costs**:
- Manifest and guard-code comparisons carry two fields instead of one. Mitigation: the contract library exposes a single composite-key helper so callers never hand-roll the comparison.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller compares `leafResourceId` alone out of habit | M | Guard code in `parent-skill-check.cjs` rejects any manifest entry missing its workflowMode |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Ten real duplicate filenames exist today (research.md Section 5, item 2) |
| 2 | **Beyond Local Maxima?** | PASS | Global uniqueness and packet-directory keying were both tested and rejected in iteration 7 |
| 3 | **Sufficient?** | PASS | Composite key resolves every known duplicate case |
| 4 | **Fits Goal?** | PASS | Removes a false-collision failure mode before it can appear in the manifest |
| 5 | **Open Horizons?** | PASS | Scales to any future packet that shares a common filename like `README.md` or `changelog.md` |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `leaf-resource-contract.cjs`: composite-key construction function.
- `generate-leaf-manifest.cjs`: groups by workflowMode before duplicate detection.

**How to roll back**: revert the composite-key function. No data migration involved, this is generation logic only.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: N-to-1 fan-out stays, distinct public key sets per alias

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Deep-research session dr-20260716-052950-sk-doc-routing (iteration 7) |

---

### Context

`create-skill` and `create-skill-parent` both resolve to the same packet directory, `create-skill`, but they answer different questions for a caller and need to keep separate public resource sets.

### Constraints

- The manifest generator must not collapse the two aliases into one entry just because they share a filesystem target.

---

### Decision

**We chose**: keep the N-to-1 fan-out. `create-skill` and `create-skill-parent` both resolve to packet `create-skill` but keep distinct public key sets in the manifest.

**How it works**: the manifest is generated per alias, not per physical packet directory, so each alias's typed pairs stay independently addressable even though they share an underlying folder.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-alias manifest generation** | Preserves the real N-to-1 relationship callers rely on | Two manifest entries point at the same physical files | 8/10 |
| Packet-directory-keyed manifest generation | One entry per physical folder, simpler generation | Collapses the fan-out, breaking any caller that expects `create-skill-parent` as a distinct key | 1/10 |
| Reverse physical-path lookup (derive aliases from disk at read time) | No alias table to maintain | Cannot recover which alias a given physical file was reached through, breaks the same fan-out | 2/10 |

**Why this one**: the fan-out is a real, intentional feature of how sk-doc's router works today. Removing it to simplify manifest generation would break an existing, correct behavior to fix an unrelated defect.

---

### Consequences

**What improves**:
- Callers that address `create-skill-parent` keep working exactly as they do today.

**What it costs**:
- The manifest generator runs once per alias rather than once per physical directory, a small but real increase in generation work. Mitigation: generation is offline and `--check` only, not on a request path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future refactor "deduplicates" the manifest by physical path, silently collapsing the fan-out | M | Guard code in `parent-skill-check.cjs` checks bidirectional selected-map reachability per alias |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The fan-out exists today and is load-bearing for existing callers |
| 2 | **Beyond Local Maxima?** | PASS | Packet-directory keying and reverse physical-path lookup were both tested and rejected |
| 3 | **Sufficient?** | PASS | Per-alias generation resolves the fan-out without new machinery |
| 4 | **Fits Goal?** | PASS | Keeps existing correct behavior stable while fixing the actual defect |
| 5 | **Open Horizons?** | PASS | Any future N-to-1 alias follows the same per-alias generation path |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `generate-leaf-manifest.cjs`: iterates aliases, not physical directories.

**How to roll back**: revert to the previous manifest-generation entry point. No fixture or runtime data affected.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Shared aliases are authored, never inferred

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Deep-research session dr-20260716-052950-sk-doc-routing (iteration 7, hardened iteration 8) |

---

### Context

`(create-changelog, assets/changelog_template.md)` resolves to `shared/assets/changelog_template.md` on disk. No symlink connects the two, so the relationship has to come from somewhere other than the filesystem.

### Constraints

- The manifest generator can only see what is on disk. It cannot infer semantic intent.

---

### Decision

**We chose**: shared aliases live in an authored `leaf-aliases.json`, written by a human, never inferred by the generator.

**How it works**: `generate-leaf-manifest.cjs` reads `leaf-aliases.json` as an input alongside the packet directory scan and merges authored aliases into the manifest rather than trying to detect them.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Authored `leaf-aliases.json`** | Explicit, reviewable, matches the fact that no symlinks exist to infer from | Someone has to remember to add a new alias when a packet starts sharing a file | 8/10 |
| Inferring aliases from symlinks | Zero authoring overhead | No packet symlinks exist today. The mechanism has nothing to read | 0/10 |
| Generated manifest as the alias source of truth | One less file to maintain | Conflates generated output with authored intent, makes the alias relationship non-reviewable in a diff | 2/10 |
| Catch-all canonicalizer (pattern-match shared paths at read time) | No alias file needed | Reintroduces the same generic-stripping ambiguity ADR-001 exists to remove | 1/10 |

**Why this one**: the shared relationship is a fact about intent, not about the filesystem. An authored file is the only mechanism that can carry that intent honestly.

---

### Consequences

**What improves**:
- Every shared alias is visible in one reviewable file, with no hidden inference logic to audit separately.

**What it costs**:
- A new shared resource needs a manual `leaf-aliases.json` entry. Mitigation: `parent-skill-check.cjs` guard codes flag any packet resource that looks shared (same content hash as a `shared/` file) but has no matching alias entry.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `leaf-aliases.json` drifts out of sync with the actual shared files | L | Byte-drift guard code compares alias targets against the manifest on every strict check |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | At least one real shared alias exists today (the changelog template) |
| 2 | **Beyond Local Maxima?** | PASS | Symlink inference, generated-manifest-as-source-of-truth and a catch-all canonicalizer were all tested and rejected |
| 3 | **Sufficient?** | PASS | One authored file covers every current and future shared alias |
| 4 | **Fits Goal?** | PASS | Keeps the alias relationship explicit instead of reintroducing the ambiguity this packet fixes |
| 5 | **Open Horizons?** | PASS | Scales to any future shared resource without new inference machinery |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `leaf-aliases.json` (new): authored table of shared-alias pairs.
- `generate-leaf-manifest.cjs`: merges the authored table into the generated manifest.

**How to roll back**: delete `leaf-aliases.json` and revert the generator's merge step. The underlying shared files are untouched.

---

### Addendum (2026-07-16): four ratified create-quality-control shared-standard aliases

Implementing the fixtures surfaced a Logic-Sync: the doc-quality routing answer includes sk-doc's house standards — `validation`, `core_standards`, `hvr_rules`, and `evergreen_packet_id_rule` — but those four live under `shared/references/` and belong to no packet, so no packet-qualified path can reach them. Under this ADR an authored alias is the only mechanism for a shared-tier file, so the operator ratified adding four aliases mapping `create-quality-control` to each:

| workflowMode | leafResourceId | diskPath |
|---|---|---|
| create-quality-control | references/validation.md | shared/references/validation.md |
| create-quality-control | references/core_standards.md | shared/references/core_standards.md |
| create-quality-control | references/hvr_rules.md | shared/references/hvr_rules.md |
| create-quality-control | references/evergreen_packet_id_rule.md | shared/references/evergreen_packet_id_rule.md |

These joined the two original aliases (`create-changelog` → `assets/changelog_template.md`; `create-quality-control` → `assets/llmstxt_templates.md`), bringing `leaf-aliases.json` to six entries and `create-quality-control` to eleven manifest leaves. Evidence: topology validator 19/19 valid; `parent-skill-check` STRICT all four leaf guards PASS. Scope note: these four are the reason `create-quality-control`'s manifest leaf set is a superset of the SD-015 full-inventory gold, which was authored before the aliases existed — an intended divergence, not a manifest defect.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Migration runs dual-read, single-write, fail-closed

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Deep-research session dr-20260716-052950-sk-doc-routing (iteration 6) |

---

### Context

Nineteen fixtures and every existing emitter currently speak the legacy packet-qualified or shared-prefixed string shape. Switching all of them to the typed pair in one step risks losing fixture data or breaking a caller nobody accounted for.

### Constraints

- No fixture may lose its gold data during migration.
- No new emitter may be allowed to write the legacy shape once the typed pair exists.

---

### Decision

**We chose**: migration runs dual-read, single-write, fail-closed.

**How it works**: legacy packet-qualified or shared-prefixed strings stay readable only under strict, declared conditions (dual-read). Every new emitter writes typed pairs exclusively from the moment it lands (single-write). Any fixture or manifest state that does not resolve cleanly against the contract blocks dispatch rather than falling back silently (fail-closed).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dual-read, single-write, fail-closed** | No fixture data loss during migration, no ambiguity about which shape a new emitter should write | Requires the dual-read bridge to exist for a transition period | 9/10 |
| Big-bang cutover, all 19 fixtures and all emitters in one commit | No transition period to maintain | High blast radius. A single mistake breaks every fixture at once, with no partial-rollback path | 2/10 |
| Generic prefix stripping to reconcile old and new shapes automatically | No dual-read bridge needed | Preserves the exact wrong-root ambiguity ADR-001 exists to remove | 1/10 |

**Why this one**: the migration risk is real (19 fixtures, multiple emitters) and the dual-read bridge is a small, well-scoped cost against that risk.

---

### Consequences

**What improves**:
- Each of the nine fix-plan steps can land and verify independently instead of requiring one atomic cutover.

**What it costs**:
- The dual-read bridge is temporary scaffolding that needs an eventual removal decision. Mitigation: the legacy-read telemetry cutoff is tracked as an open operator-policy question (spec.md Section 12), not silently left in place forever.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The dual-read bridge masks a legacy reader nobody accounted for | M | Grep every consumer of the legacy string shape before any future packet removes dual-read support |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 19 fixtures and multiple emitters need to migrate without a single atomic cutover |
| 2 | **Beyond Local Maxima?** | PASS | Big-bang cutover and generic prefix stripping were both tested and rejected |
| 3 | **Sufficient?** | PASS | The three-part discipline covers reading, writing and failure handling |
| 4 | **Fits Goal?** | PASS | Directly enables the phased rollout in plan.md Section 4 |
| 5 | **Open Horizons?** | PASS | The same pattern applies to any future contract migration in this repo |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `router-replay.cjs`, `executor-dispatch.cjs`: dual-read legacy strings, single-write typed pairs.
- `validate-playbook-topology.cjs`: fail-closed gate on any fixture or manifest mismatch.

**How to roll back**: because reads stay dual-path throughout, reverting any single-write emitter change does not strand fixture data.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Frozen contract names, no command-metadata.json

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Deep-research session dr-20260716-052950-sk-doc-routing (iteration 10, item ruled out iteration 6) |

---

### Context

Four names carry the contract across every downstream consumer: `resourceContractVersion`, `leaf-aliases.json`, `leaf-manifest.json` and `validate-playbook-topology.cjs`. If implementation renames any of them mid-stream, every guard code, test and doc reference written against the research packet goes stale at once.

### Constraints

- The names must match exactly what research.md Sections 8 and 9 already reference, so the verification commands in Section 9 work without edits.

---

### Decision

**We chose**: freeze `resourceContractVersion`, `leaf-aliases.json`, `leaf-manifest.json` and `validate-playbook-topology.cjs` as the four contract names. We do not create `command-metadata.json`.

**How it works**: implementation uses these four names verbatim. `mode-registry.json` already records commands and aliases, so a separate `command-metadata.json` would be a second, unsynchronized projection of the same data.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Freeze the four names, skip command-metadata.json** | Matches the research packet exactly, avoids a duplicate projection | None material | 9/10 |
| Rename during implementation for local style preference | Might read more naturally to a future contributor | Breaks every cross-reference in research.md and this packet's own docs | 1/10 |
| Add `command-metadata.json` for symmetry with other packets | Consistent shape across skills | Unnecessary. `mode-registry.json` already owns commands and aliases for sk-doc | 1/10 |
| Generation-time-only drift checks (no persistent guard code) | Less code to maintain in `parent-skill-check.cjs` | Misses drift introduced between generation runs, the exact gap that let the original defect through undetected | 2/10 |

**Why this one**: naming stability keeps the research-to-implementation handoff traceable. `command-metadata.json` would just duplicate data `mode-registry.json` already owns.

---

### Consequences

**What improves**:
- Every verification command in research.md Section 9 works against this packet's files without modification.

**What it costs**:
- None material. This decision only requires discipline in implementation, not new code.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor adds `command-metadata.json` out of habit from another skill's pattern | L | `parent-skill-check.cjs` documentation notes it is intentionally absent for sk-doc |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Naming drift would break the Section 9 verification commands as written |
| 2 | **Beyond Local Maxima?** | PASS | `command-metadata.json` was explicitly evaluated and ruled out in iteration 6 |
| 3 | **Sufficient?** | PASS | Four names cover every artifact the contract introduces |
| 4 | **Fits Goal?** | PASS | Keeps the research packet as an accurate reference for implementation |
| 5 | **Open Horizons?** | PASS | Stable names support any future packet that extends this contract |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- None beyond using the frozen names throughout Phases 1-9.

**How to roll back**: not applicable. This is a naming discipline, not a code change to revert.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Selected-map union bundle cap, not an arbitrary numeric limit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Deep-research session dr-20260716-052950-sk-doc-routing (iteration 6) |

---

### Context

Five benchmark rows lose material recall to an over-bundled resource set. SD-015 alone routed 65 resources when far fewer were expected. A naive fix would cap the bundle at some fixed count, but sk-doc has at least one legitimate 17-leaf full-inventory scenario that a fixed cap would break.

### Constraints

- The cap must stop unbounded over-bundling without breaking the legitimate wide-bundle case.

---

### Decision

**We chose**: the bundle cap is the selected-map union, with `maxWorkflowModes: 2`, no unmapped leaves and full-inventory reachable only by explicit intent.

**How it works**: `executor-dispatch.cjs` computes the union of resources across at most two selected workflow modes for a normal query. A caller that explicitly asks for the full inventory bypasses the cap through a separate, named code path, so the 17-leaf scenario stays reachable without loosening the default cap for everyone else.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Selected-map union, capped workflow modes, explicit full-inventory intent** | Stops unbounded bundling while keeping the legitimate wide-bundle case reachable | Requires the dispatcher to distinguish a normal query from a full-inventory intent | 8/10 |
| Arbitrary numeric bundle cap (e.g. always return at most 10 resources) | Simple to implement | Breaks the legitimate 17-leaf full-inventory scenario outright | 1/10 |
| No cap, rely on packet maps alone to stay small | No dispatcher change needed | SD-015 already shows a packet map routing 65 resources. The cap has to live at dispatch, not just at authoring time | 2/10 |

**Why this one**: a structural cap tied to the selected-map union scales with what was actually asked for, instead of guessing a fixed number that will eventually be wrong in one direction or the other.

---

### Consequences

**What improves**:
- SD-015, SD-014, SD-006, SD-017 and SD-002 all resolve to the selected-map union with D3 recall equal to 1 where applicable.

**What it costs**:
- The dispatcher needs an explicit code path for full-inventory intent, adding one more branch to test. Mitigation: `sk-doc-leaf-routing-contract.vitest.ts` covers both the capped and the explicit full-inventory path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future caller triggers full-inventory by accident instead of by explicit intent | M | The full-inventory path requires a named flag, not an inferred condition |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | SD-015's 65-resource bundle is a confirmed over-bundle failure (research.md Section 3) |
| 2 | **Beyond Local Maxima?** | PASS | An arbitrary numeric cap was tested and rejected in iteration 6 |
| 3 | **Sufficient?** | PASS | The union-plus-explicit-intent design covers both the narrow and the wide legitimate cases |
| 4 | **Fits Goal?** | PASS | Directly targets the over-bundle failure class in the acceptance matrix |
| 5 | **Open Horizons?** | PASS | The cap logic scales to any future packet without a new numeric constant to tune |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `executor-dispatch.cjs`: selected-map union cap, `maxWorkflowModes: 2`, explicit full-inventory code path.

**How to roll back**: revert the dispatcher's capping logic. Fixtures and the contract library are unaffected.
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Invalid oracle blocks pre-dispatch, excluded from every denominator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Deep-research session dr-20260716-052950-sk-doc-routing (iteration 8) |

---

### Context

A fixture's gold data can go stale relative to the manifest, for example when a packet's leaf resources change but the fixture's frontmatter does not. Scoring such a fixture as zero recall would silently inflate the failure count with a fixture-authoring problem instead of a routing problem.

### Constraints

- The scorer must distinguish "the model routed wrong" from "the fixture's gold no longer matches reality."

---

### Decision

**We chose**: an invalid oracle blocks dispatch entirely and is excluded from every scoring denominator, rather than being scored as zero recall.

**How it works**: `validate-playbook-topology.cjs` runs schema validation, then manifest resolution, then a selected-map join, before any scenario dispatches. A fixture that fails any of those three checks never reaches the model and never enters the scorer's recall calculation.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Block pre-dispatch, exclude from denominators** | Keeps the recall number honest, a stale fixture cannot drag down the real routing score | Requires a pre-dispatch validation pass before every run | 9/10 |
| Score topology-invalid gold as zero recall | Simple, no separate validation stage | Conflates fixture-authoring defects with routing defects, corrupting the recall metric this fix exists to repair | 1/10 |
| Sidecar oracle (a separate gold file checked only at report time, after dispatch) | Keeps dispatch simple | Catches the problem too late. The model already spent a turn on an invalid scenario before anyone finds out | 2/10 |

**Why this one**: the whole point of this packet is an honest recall number. Scoring a broken fixture as a routing failure would reintroduce the same kind of measurement artifact this packet exists to remove.

---

### Consequences

**What improves**:
- The synthetic invalid-oracle acceptance-matrix row (research.md Section 10) has a clean, testable definition of correct behavior.

**What it costs**:
- Every run needs the pre-dispatch validation pass to run first, adding a small amount of wall-clock time before scoring starts. Mitigation: the validator is deterministic and fast, schema and manifest checks only, no model calls.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The validator itself has a bug that blocks a valid fixture | M | `sk-doc-leaf-routing-contract.vitest.ts` covers the validator against every one of the 19 real fixtures, not just synthetic ones |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without pre-dispatch validation, a stale fixture silently corrupts the recall number the whole packet exists to fix |
| 2 | **Beyond Local Maxima?** | PASS | Scoring as zero recall and a sidecar oracle were both tested and rejected in iteration 8 |
| 3 | **Sufficient?** | PASS | Three-stage validation (schema, manifest, selected-map) covers every known invalidity source |
| 4 | **Fits Goal?** | PASS | Keeps the fresh Mode-B run's recall number attributable to routing behavior alone |
| 5 | **Open Horizons?** | PASS | Any future fixture, for sk-doc or another packet reusing this pattern, gets the same protection |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `validate-playbook-topology.cjs` (new): pre-dispatch schema-then-manifest-then-selected-map gate.
- `score-skill-benchmark.cjs`: excludes blocked fixtures from every denominator, reports them under `fixture_topology_error`.

**How to roll back**: revert the validator and the scorer's exclusion logic together. Fixture files themselves are untouched by this decision.
<!-- /ANCHOR:adr-008 -->

---

<!--
Level 3 Decision Record (Addendum): eight ADRs, one per major settled decision from research.md Section 5 plus the two implementation-scoped decisions (bundle cap, invalid-oracle handling) that Section 8's fix plan depends on. Eliminated alternatives are sourced from research.md Section 11.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
