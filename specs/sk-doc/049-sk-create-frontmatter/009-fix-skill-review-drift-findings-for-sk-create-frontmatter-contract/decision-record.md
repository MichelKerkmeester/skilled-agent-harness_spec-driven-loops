---
title: "Decision Record: Fix the skill-review drift findings in the sk-create-frontmatter contract"
description: "Why the contract was corrected to the checker rather than the checker extended, why a spaced alias stands in for a scorer change, and why the hub description was trimmed under a routing baseline."
trigger_phrases:
  - "contract corrected to checker"
  - "spaced alias decision"
  - "hub description trim adr"
  - "adr contract drift"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Recorded the three decisions the phase rests on"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-049-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Fix the skill-review drift findings in the sk-create-frontmatter contract

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Correct the contract to the checker rather than extend the checker

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-05 |
| **Deciders** | Implementation session for this phase |

---

<!-- ANCHOR:adr-001-context -->
### Context

The field reference says every reference and asset carries the five-field block and that the
advisor's checker enforces it in coverage mode. The checker's default is shape mode, which passes a
file carrying no detailed field at all, and its walk reads `references/` and `assets/` directly under
each top-level skill folder, so a nested mode packet's docs are never read. It reports 128 documents
against 818 in the tree. A fleet walk finds 22 reference and asset files short of the block, all
under nested packets.

### Constraints

- The checker lives in `system-skill-advisor`, outside this packet's scope.
- Extending its walk into nested packets would newly fail 22 files owned by other skills.
- The contract must not overstate enforcement, since that is the drift the mode exists to end.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to correct the contract to what the checker does, and to name the packaging gate as
the check that does reach nested packets.

**How it works**: the reference and README template notes now state the checker's default mode, its
walk, the `--coverage` flag, and that `package_skill.py --check --strict` on a packet is the gate that
reads the block there. Section 5 carries the same in an `enforced_by` line.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Correct the contract, name the real gate** | In scope, true today, no other skill breaks | The fleet gap stays open | 9/10 |
| Extend the checker's walk to nested packets | Closes the gap at the source | Out of scope, and 22 files in other skills go red without their owners deciding | 4/10 |
| Weaken the contract to shape mode | Matches the default | Makes the five-field block optional by fiat, which the advisor's harvest does not want | 2/10 |

**Why this one**: it is the only option that leaves the contract true and the fleet unchanged. The
gap is now written where the next reader will look.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A green checker run no longer implies the five-field block is present on nested docs.
- The gate that does reach those docs is named beside the one that does not.

**What it costs**:
- The 22 non-conforming files stay non-conforming. Mitigation: the count and the walk are recorded in the summary for whoever owns the checker.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader still runs the checker and trusts it fleet-wide | M | The note is on the template they copy from, not in a footnote |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The claim was false and on the template authors copy |
| 2 | **Beyond Local Maxima?** | PASS | Three options, two rejected on scope and on what they would break |
| 3 | **Sufficient?** | PASS | Two notes and one YAML line, no new machinery |
| 4 | **Fits Goal?** | PASS | The parent directive keeps ownership where phase 001 drew it |
| 5 | **Open Horizons?** | PASS | The checker owner can extend the walk later without this note becoming wrong |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: three passages in `assets/frontmatter-templates.md`, sections 4 and 5.

**How to roll back**: `git checkout -- .opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A spaced alias stands in for a scorer change

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-05 |
| **Deciders** | Implementation session for this phase |

---

<!-- ANCHOR:adr-002-context -->
### Context

`trigger_phrases` is in the mode's keyword list, the registry aliases, the hub router, `ROUTER.md`
and both stage-one lists, exactly as `importance_tier` is. The advisor scores `importance_tier` at
0.485 on its explicit-author lane and `trigger_phrases` at zero on every lane, even with the
confidence threshold lowered to 0.5. The advisor's normalizer folds underscores to spaces, so the
vocabulary reaches the scorer. Phase 008 recorded this alias routing at the floor at closure.

### Constraints

- The scorer is `system-skill-advisor`'s and outside scope.
- The parent directive's D3 says reachability is proved, never asserted from a registry entry.
- The spaced form `trigger phrases` already reached the hub at 0.9034 but had no stage-two target.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: to add `trigger phrases` to every surface the underscore form is on, keep the
underscore form where it is, and record the zero score against the scorer with the command and
the advisor generation.

**How it works**: the spaced form gets a stage-two target from the registry alias and a stage-one
entry from the hub metadata. The replay shows it routing to `sk-create-frontmatter` at 0.9034. The
underscore form stays declared because stage two would still resolve it if stage one ever scored it.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add the spaced form, record the underscore form** | Routes today, in scope, keeps the declaration honest | Two spellings of one alias | 9/10 |
| Patch the scorer | Fixes the mechanism | Out of scope, and the mechanism is not yet located in the scorer's code | 3/10 |
| Drop the underscore form | One spelling | Removes a trigger a reader may type, and stage two could serve it once stage one does | 4/10 |

**Why this one**: it is the only option that changes what a reader gets today without touching a
file this packet does not own.
<!-- /ADR-002-alternatives -->
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A person typing `trigger phrases` reaches the mode with a compiled target.

**What it costs**:
- The alias list gains an entry. Mitigation: replayed against out-of-domain phrases, one narrow capture recorded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The scorer change later makes the underscore form route and the spaced one redundant | L | Redundant aliases cost nothing at stage two |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A declared trigger returned nothing |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | One string on six surfaces |
| 4 | **Fits Goal?** | PASS | D3, reachability measured in both stages |
| 5 | **Open Horizons?** | PASS | The scorer owner has the command and the generation to reproduce it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json` and
the mode `SKILL.md`, one string each, plus `version field` in the two stage-one lists.

**How to roll back**: `git checkout -- .opencode/skills/sk-doc/{mode-registry.json,hub-router.json,ROUTER.md,graph-metadata.json,sk-create-frontmatter/SKILL.md}`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Trim the hub description under a routing baseline

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-05 |
| **Deciders** | Implementation session for this phase |

---

<!-- ANCHOR:adr-003-context -->
### Context

The mode documents a per-skill soft target of 130 characters and a project cutoff of 8,000, past
which the runtime silently drops the longest descriptions from discovery. The audit put the project
at 7,885. The sk-doc hub's own description was 639 characters, the single largest entry, and it is
the hub that hosts the mode making the rule.

### Constraints

- The description feeds the advisor's lexical lane for the whole hub, so a trim can move routing for every mode under it.
- The hub `SKILL.md` is one of eighteen pinned compiled-routing sources.
- Phase 008 measured its edit to a packet `SKILL.md` making the hub stale, and recorded the refresh sequence.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: to trim the description to 130 characters by the contract's own drop and keep lists,
under a baseline of eight hub-shaped prompts captured first, and to carry the manifest re-mint and
the canary rebuild in the same pass.

**How it works**: the enumeration of fifteen packets and the closing sentence about dispatch were
dropped. The hub noun, the authoring verb and the eight domain nouns the modes route on were kept.
The eight baseline prompts replayed identically. The guard read stale after the edit and fresh after
the re-mint, which is the negative control the phase spec asked for.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Trim to 130 under a baseline, refresh in the same pass** | Closes the largest budget entry with proof nothing moved | The hub edit carries the refresh cost | 9/10 |
| Trim the three other over-budget entries instead | Leaves the hub alone | Other owners' files, and they total less than the hub alone | 3/10 |
| Leave it and record the 115-character margin | No routing risk | The mode's own warning stays unheeded in its own hub | 2/10 |

**Why this one**: the mode says the drop is silent, and the hub was the entry that would trip it.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Headroom under the cutoff goes from 115 to 624 characters.
- The hub description now follows the rule its own mode publishes.

**What it costs**:
- Six compiled and activation artifacts regenerate and the pin set refreshes. Mitigation: every file is tracked, and the summary names each.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A hub prompt outside the eight baselines routed on a dropped token | M | The canary's 23 route-gold rows are the wider net, recorded in the summary |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 115 characters from a silent drop the mode documents |
| 2 | **Beyond Local Maxima?** | PASS | Three options, two rejected on what they leave in place |
| 3 | **Sufficient?** | PASS | One line, measured |
| 4 | **Fits Goal?** | PASS | D4 of the parent, remeasure rather than soften |
| 5 | **Open Horizons?** | PASS | The next hub edit follows the same baseline-and-refresh recipe |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: the description line of `.opencode/skills/sk-doc/SKILL.md`, the runtime and
authored activation manifests, and the compiled artifacts beside the authored canary.

**How to roll back**: `git checkout -- .opencode/skills/sk-doc/SKILL.md`, then re-run
`compiled-route-manifest.cjs refresh --hub sk-doc` and the canary build so the pins match the
restored bytes.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
