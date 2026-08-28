---
title: "Decision Record: Rework four external UI-design skills into one standalone sk-design skill"
description: "Six decisions behind sk-design: one skill rather than four, standalone rather than a hub mode, the chosen name, scales kept inline, conflicts stated rather than reconciled, and how promotional content embedded in a source was handled."
trigger_phrases:
  - "sk-design skill decisions"
  - "why one skill not four"
  - "standalone versus hub mode"
  - "cross source conflict handling"
  - "embedded promotional instruction"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/017-design-skill"
    last_updated_at: "2026-08-28T05:16:38Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored six ADRs"
    next_safe_action: "Retry the advisor routing probe"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
      - ".opencode/skills/sk-design/references/review-checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "017-design-skill"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Whether the remaining ten userinterface-wiki rule categories warrant a follow-up packet"
    answered_questions:
      - "Standalone skill rather than a hub mode, since the sk-design hub was retired"
      - "One skill spanning four sources rather than four separate skills"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Rework four external UI-design skills into one standalone sk-design skill

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One skill spanning four sources, not four skills

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Operator, implementing agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The request arrived incrementally. It began as one external repository, then three more sources were added mid-build: a web interface guideline set, an animation-principles skill, and a design-review skill. Each could stand alone as a skill. The question was whether to split them.

### Constraints

- The skill advisor routes by intent, and four skills with overlapping intent signals compete rather than complement.
- All four sources answer the same underlying question at different layers: what should this interface be?
- A user asking "make this look better" cannot be expected to know which of four skills owns the answer.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: one skill, with each source becoming a layer selected by the router rather than a separate advisor identity.

**How it works**: the value systems stay in `SKILL.md` because every task needs them. The other three sources become references under their own router intents — interaction, motion and review — loaded only when the prompt scores for them. A user reaches the right layer without knowing the layers exist.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One skill, four layers** | One identity to route to; layers cross-reference each other; conflicts resolvable in one place | A larger package; `SKILL.md` pressed against its word cap | 8/10 |
| Four separate skills | Each stays close to its source; smaller units | Four competing identities for overlapping prompts; conflicts unresolvable across skill boundaries; a user must pick | 4/10 |
| One skill, sources kept verbatim as separate untouched docs | Fastest; provenance obvious | Four voices, four formats, no cross-references, conflicts left for the reader to trip over | 3/10 |

**Why this one**: the sources overlap in what they cover and disagree in three specific places. Only a single skill can state a resolution; four skills would each assert their own answer and the agent would follow whichever loaded.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- One routable identity covers value selection, interaction, motion and review.
- The three cross-source conflicts are resolved once, in writing, where the guidance lands.
- References cross-link, so a motion question that turns out to be a depth question reaches the right document.

**What it costs**:

- `SKILL.md` sits at 4,730 of 5,000 words. Mitigation: any future addition moves existing prose into a reference first, and the constraint is recorded in the spec risk table.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The skill grows past what one identity should hold | M | The word cap is a hard gate; breaching it forces the split conversation rather than allowing drift |
| A layer gets buried and never routes | M | Each layer has its own scored intent and its own trigger phrases in the advisor metadata |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nothing in the repo decides UI values; only measurement exists |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes weighed, including the cheapest verbatim option |
| 3 | **Sufficient?** | PASS | One identity, six references, no scripts or runtime |
| 4 | **Fits Goal?** | PASS | Directly answers the request as it grew across four messages |
| 5 | **Open Horizons?** | PASS | Layers are independently replaceable; a fifth source becomes a seventh intent |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `.opencode/skills/sk-design/` created as a class-S root with six references.
- The router carries seven intents, one per layer plus the always-available scales.

**How to roll back**: delete the skill root and rerun `ci-skill-root-metadata.cjs`. Nothing else references it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A standalone skill, not a mode under a hub

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The initial plan assumed a design hub existed and that the new capability would become a mode under it. The operator corrected that assumption directly: the `sk-design` hub was retired, and `sk-design-md-generator` is the only surviving design skill, itself standalone.

### Constraints

- Under the root metadata contract, a hub is declared by carrying both a mode registry and a hub router. There is no hub to join.
- Creating a hub for two skills would add a routing tier that neither needs.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a class-S standalone root, sibling to `sk-design-md-generator`.

**How it works**: the root carries `graph-metadata.json` for identity and `leaf-manifest.config.json` as its single authored declaration; the manifest and its alias projection are generated. It carries no registry, router or description file, all of which the contract forbids on a standalone root.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Standalone class-S root** | Matches the sibling; one identity; no extra tier | None material at this size | 9/10 |
| Revive a design hub with two modes | Groups the pair explicitly | Reinstates a hub the operator retired; adds a routing tier for two members | 2/10 |
| Fold into `sk-design-md-generator` as a second mode | One design skill total | That skill is standalone; adding modes would convert it to a hub, and the two jobs are genuinely different | 3/10 |

**Why this one**: the operator's correction settled it, and the contract agrees — a two-member hub is a routing tier that buys nothing.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- The root passes its class gate on the first run with no forbidden files.
- The relationship to `sk-design-md-generator` is expressed as a typed sibling edge rather than shared plumbing.

**What it costs**:

- The two design skills are related only by naming convention and graph edges, not by structure. Mitigation: the shared `sk-design-` prefix keeps them adjacent in any listing, and both carry the boundary in prose.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A third design skill makes the flat arrangement awkward | L | Converting to a hub later is a documented procedure in `sk-create-skill` |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A skill root must be one class or the other |
| 2 | **Beyond Local Maxima?** | PASS | Hub and fold-in both considered |
| 3 | **Sufficient?** | PASS | Two authored metadata files total |
| 4 | **Fits Goal?** | PASS | Operator directed it explicitly |
| 5 | **Open Horizons?** | PASS | A documented upgrade path to a hub exists |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- `init_skill.py --kind standalone` produced the root; the class gate confirms `[S]`.

**How to roll back**: not independently reversible; it is the shape of the artifact in ADR-001.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Named for the domain, not for the first source

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Implementing agent |

---

<!-- ANCHOR:adr-003-context -->
### Context

The skill was scaffolded as `sk-refactoring-ui` when the request named a single source. Three more sources arrived while it was being built, so the name was changed to `sk-design-ui-craft`. The operator then directed a second rename, to `sk-design`.

That name previously belonged to a parent hub that was decommissioned, which made reclaiming it a collision question rather than a preference.

### Constraints

- The folder name and the frontmatter `name` must match exactly.
- A retired hub name may still be registered somewhere as a hub. A standalone root taking that name would either fail its class gate or resurrect a stale route.
- Nothing was committed yet, so a rename cost only a folder move and a metadata regeneration.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: `sk-design`, after verifying the name was genuinely free.

**How it works**: the live compiled-routing hub set (`COMPILED_ROUTING_HUBS`) was checked first and contains six hubs, none of them `sk-design`; no activation manifest directory exists for it; no skill metadata carries an edge targeting it. The only surviving references were prose. One of those — the compiled-routing section of `feature-flag-governance.md` — still described a "fixed 7-hub set" including `sk-design`, which would have become actively misleading once a standalone skill held the name, so it was corrected to the real six.

The name sorts beside `sk-design-md-generator` and signals the family. The H1 stays "UI Craft", which names what the skill covers; attribution to the four sources lives in a sources section in `SKILL.md`, the README and the changelog.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`sk-design`** | Operator-directed; shortest domain-accurate name; sorts first in the design family | Reuses a decommissioned hub name, so stale references had to be found and cleared | 9/10 |
| `sk-design-ui-craft` | No name reuse at all | Longer, and "craft" reads as vague next to a sibling named for what it produces | 6/10 |
| `sk-refactoring-ui` | Recognizable to anyone who knows the book | Names one of four sources; misleads about scope; poor fit for a11y and motion prompts | 4/10 |

**Why this one**: the operator directed it, and the collision check came back clean. Reusing a retired name is only dangerous when something still resolves it, and nothing did.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:

- The name describes the artifact after four sources, and would after five.
- The two design skills sort together, with the authoring skill first.
- A stale governance doc that named the retired hub was found and corrected as a side effect of the collision check.

**What it costs**:

- The recognizable anchor of a well-known book title is gone from the name. Mitigation: the book is named first in every sources list, and "refactoring ui" is a trigger phrase in the advisor metadata.
- Anyone reading old commits or archived specs will find `sk-design` meaning a hub. Mitigation: the changelog states plainly that nothing of the hub survives here, and the sibling's own metadata says the name moved.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A stale `sk-design`-as-hub reference is missed and resurfaces | M | The live sets were checked directly rather than by grep alone: hub set, activation directories, and metadata edges |
| Prefix confusion with `sk-design-md-generator` in routing | L | Probed; the extraction prompt still routes to the sibling at 0.95 |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator-directed, and the scaffold name was already wrong for a four-source skill |
| 2 | **Beyond Local Maxima?** | PASS | Three names weighed |
| 3 | **Sufficient?** | PASS | A folder move plus a metadata regeneration |
| 4 | **Fits Goal?** | PASS | Nothing was committed, so the cost was near zero |
| 5 | **Open Horizons?** | PASS | The name does not constrain future sources |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:

- Skill root and spec packet folder both renamed; `skill_id`, `workflowMode` and frontmatter `name` updated; generated metadata rebuilt.

**How to roll back**: rename the folder and the three identity fields back, then rerun the class gate with `--fix`.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The value scales stay inline in SKILL.md

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Implementing agent |

---

<!-- ANCHOR:adr-004-context -->
### Context

The authoring guidance says to move detail into references and keep `SKILL.md` lean. The scales — spacing, type, weight, color, elevation, radius, opacity, duration — are roughly a third of the file, and moving them would relieve the word-cap pressure documented in ADR-001.

### Constraints

- The word cap is a hard packaging gate at 5,000 words.
- Every task this skill serves needs at least one scale.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: keep all scales in `SKILL.md` Section 3 and move only conditional knowledge into references.

**How it works**: the router's `RESOURCE_MAP` maps the `SCALES` intent to an empty list, because there is nothing to load. Everything else is a reference under its own intent.

**Amended 2026-08-28.** The first cut also kept the seven-step procedure and the full hierarchy method inline, which left 270 words of headroom against the packaging cap and no room for the material still to be imported. Both were moved out: `build-procedure.md` in full, and `hierarchy.md` with a four-rule operative core retained inline. The scales did not move, because the reasoning below still holds for them and not for the other two — a value question needs a scale on every invocation, while a procedure is needed once at the start of a build and the hierarchy elaboration only when the four core rules are not enough. Headroom is now roughly 330 words with three more references in place.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scales inline, procedure and hierarchy detail out** | Zero loads for the most common question; the skill is useful with nothing else loaded; real headroom for growth | Two extra references to route | 9/10 |
| Everything inline | Nothing to route | No headroom; the next import breaks the cap | 4/10 |
| Scales in a reference | Frees roughly 1,200 words | Adds a load to nearly every invocation for content that is always needed; a failed load leaves the skill unable to answer its core question | 3/10 |
| Scales split, common ones inline | Balanced budget | An arbitrary line between "common" and "rare" values; the split itself needs explaining | 4/10 |

**Why this one**: progressive disclosure exists to defer what is *sometimes* needed. A value scale is needed every time, so deferring it adds a load and a failure mode without saving anything.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:

- "What padding should this card have?" is answered with no reference load at all.
- The skill degrades gracefully: if every reference were unreadable, the scales and hard rules still work.

**What it costs**:

- Two more references to route, and a reader wanting the full hierarchy method needs one load. Mitigation: the four operative rules stay inline, so the common case needs no load at all.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future source pushes the file over the cap | L | Headroom restored to roughly 330 words, and the packaging gate blocks a breach rather than allowing silent bloat |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The placement had to be decided one way |
| 2 | **Beyond Local Maxima?** | PASS | Three placements weighed |
| 3 | **Sufficient?** | PASS | No extra machinery; an empty resource map entry |
| 4 | **Fits Goal?** | PASS | The scales are the skill's reason to exist |
| 5 | **Open Horizons?** | PASS | Reversible in one edit if the budget forces it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:

- `SKILL.md` Section 3 holds eight scales; `RESOURCE_MAP["SCALES"]` is empty with a comment saying why.
- The procedure and the hierarchy elaboration live in `references/build-procedure.md` and `references/hierarchy.md`, each under its own router intent.

**How to roll back**: move Section 3 to `references/value-scales.md`, point the `SCALES` intent at it, and re-run the packaging gate.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Cross-source conflicts are stated, not silently reconciled

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Implementing agent |

---

<!-- ANCHOR:adr-005-context -->
### Context

The four sources disagree in three places, and a fourth disagreement crosses into the sibling skill.

Fluid `clamp()` sizing versus a fixed hand-picked type scale. Three different motion-duration ceilings: 200ms, 300ms, and a 300 to 500ms band. Touch-target minimums of 44px versus 32px. And `sk-design-md-generator` records a modular type ratio as a craft target while this skill rejects ratios for authoring.

Merging four sources invites quietly picking a winner and presenting it as consensus.

### Constraints

- An agent reading one reference must not be given guidance that another reference contradicts.
- A reader who knows one of the sources will notice a value that was changed without explanation and lose trust in the rest.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: state each conflict where its guidance lands, give the resolution, and give the reasoning that makes the resolution more than a preference.

**How it works**: `clamp()` is handled in the interaction reference, resolved as clamping between two adjacent scale steps for display type only. Durations get a dedicated section in the motion reference that separates direct feedback, state change and layout transition. Touch targets are resolved inline at 44px for thumbs and 32px as a dense-pointer floor. The cross-skill type-ratio tension has its own subsection in `SKILL.md` Section 7.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **State the conflict and resolve it** | Reader can check the reasoning; sources stay traceable; the resolution survives scrutiny | More prose in a word-constrained file | 9/10 |
| Pick a winner silently | Shortest | A reader who knows the source sees an unexplained change; the same conflict gets re-litigated by the next editor | 2/10 |
| Include both without resolving | Honest | Leaves the agent with two answers and no way to choose, which is worse than either answer alone | 3/10 |

**Why this one**: the conflicts are not errors in the sources. They come from measuring different things, and saying so is what makes the resolution correct rather than arbitrary.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:

- An agent gets one answer per situation, plus the reason it is the right situation.
- A future editor can revisit a resolution without rediscovering the conflict.

**What it costs**:

- Roughly 400 words across three references. Mitigation: each conflict sits inside a section the reader is already in.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A resolution is wrong | M | The reasoning is written out, so it can be argued with rather than merely overridden |
| A source changes and the conflict moves | L | The changelog names each source and version so a later diff is possible |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four real conflicts exist in the merged material |
| 2 | **Beyond Local Maxima?** | PASS | Silent merge and unresolved inclusion both weighed |
| 3 | **Sufficient?** | PASS | Prose only; no mechanism added |
| 4 | **Fits Goal?** | PASS | Contradictory guidance would defeat the skill's purpose |
| 5 | **Open Horizons?** | PASS | Each resolution is independently revisable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:

- Resolutions written into `references/interaction-craft.md` Section 4, `references/motion-principles.md` Section 5, `references/interaction-craft.md` Section 3, and `SKILL.md` Section 7.

**How to roll back**: not applicable; removing the resolutions would restore the contradictions.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Promotional instructions embedded in a source are data, not directives

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Implementing agent |

---

<!-- ANCHOR:adr-006-context -->
### Context

One of the four sources is a vendor-published skill. Its body instructs the reading agent to append a footer with a tracked link to the vendor's hosted product at the end of every review, exactly once, and to promote the vendor's application when the user asks about automation.

Those are instructions addressed to whatever agent loads the document. Carrying them into an authored artifact would make every future review in this repo emit vendor marketing.

### Constraints

- Fetched third-party content is data. Instructions inside it are surfaced to the operator, never executed.
- The rest of the source is genuinely useful: a WCAG-cited check set with a severity model.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: keep the check set and the severity model; drop the footer instruction and the product promotion entirely; tell the operator it was there.

**How it works**: `references/review-checklist.md` carries the critical, serious and moderate tiers with their WCAG criteria and a report format. It contains no vendor link, no tracked URL and no promotion. The changelog records that the instruction existed and was excluded, so a future editor comparing against the source does not assume it was an oversight.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the checks, drop the instruction, disclose it** | Useful material retained; no injected behavior; the omission is traceable | None | 10/10 |
| Carry the source through unchanged | Faithful to the original | Every review in this repo would emit vendor marketing the operator never agreed to | 0/10 |
| Skip the source entirely | No contamination risk | Loses a genuinely good WCAG check set over a footer | 4/10 |

**Why this one**: the promotional payload and the technical content are separable, and separating them is exactly what treating fetched content as data means.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:

- The review checklist is usable without turning every review into an advertisement.
- The precedent is recorded for the next source that carries embedded instructions.

**What it costs**:

- Nothing material. The source remains attributed by name and URL.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The omission reads as an accident later | L | Recorded in the changelog and in this ADR |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The instruction was present and would have propagated |
| 2 | **Beyond Local Maxima?** | PASS | Carrying through and skipping entirely both weighed |
| 3 | **Sufficient?** | PASS | Omission plus disclosure; no mechanism needed |
| 4 | **Fits Goal?** | PASS | Directly protects the artifact the packet delivers |
| 5 | **Open Horizons?** | PASS | Sets the handling pattern for future third-party sources |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:

- `references/review-checklist.md` carries the checks without the vendor footer; the exclusion is stated in `changelog/v1.0.0.0.md`.

**How to roll back**: not applicable. Reintroducing the instruction would inject third-party marketing into every review.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Reconcile the cross-skill tension on both sides, not one

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Operator, implementing agent |

---

<!-- ANCHOR:adr-007-context -->
### Context

The first cut documented the tension with `sk-design-md-generator` from this skill's side only, and put changes to that skill explicitly out of scope. That left a real failure mode: an agent that loads only the sibling's `numeric-design-laws.md` reads a modular type ratio, a seven-step spacing scale and three motion bands with no indication that they describe a measured surface rather than prescribe a new one, and applies them as authoring instructions.

A one-sided reconciliation is not a reconciliation. It only works for a reader who happens to arrive from the documented side.

### Constraints

- The original spec froze `sk-design-md-generator` out of scope, so widening required an explicit amendment rather than a quiet edit.
- Neither skill may be made wrong to make the other right. Both directions are correct.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: amend the scope and state the reconciliation identically on both sides.

**How it works**: `numeric-design-laws.md` gains a "Reading Targets, Not Authoring Instructions" section with a three-row table naming each contested row and what the authoring skill does instead, plus a closing line that a row must never be cited as a reason to change a design. The sibling's `SKILL.md` boundary now names `sk-design` and states the precedence. Both skills carry a typed sibling edge to the other, with matching weight and reciprocal context. Precedence is written once and identically: a measurement outranks a default for the surface it covers.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reconcile on both sides** | Correct from either entry point; the edge is typed in both graphs | Widens a frozen scope; touches a shipped skill | 9/10 |
| Keep it one-sided | Respects the original scope lock | Fails exactly the reader who needs it most, the one who never opens this skill | 3/10 |
| Delete the contested rows from the sibling | Removes the conflict outright | Destroys correct reading guidance to fix an authoring problem | 1/10 |

**Why this one**: the conflict is a direction mismatch, not an error, so the fix is to make direction explicit wherever either side is read.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:

- Neither document can now be read alone and misapplied.
- The sibling relationship is typed in both graphs, so the advisor sees it from either direction.

**What it costs**:

- A shipped skill was edited outside the original scope. Mitigation: the amendment is recorded here and in the spec's scope section, and the edits are additive prose plus one metadata edge.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The two reconciliations drift apart over time | M | Each names the other's exact section, so a stale one is findable rather than silent |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A one-sided note fails the reader who never opens this skill |
| 2 | **Beyond Local Maxima?** | PASS | Keeping it one-sided and deleting the rows were both weighed |
| 3 | **Sufficient?** | PASS | Prose plus one typed edge per side |
| 4 | **Fits Goal?** | PASS | Directly answers the operator's instruction to fix the conflicts |
| 5 | **Open Horizons?** | PASS | The pattern generalizes to any future reading/authoring pair |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:

- `sk-design-md-generator/references/design-knowledge/numeric-design-laws.md` gains the direction section and two caveat lines.
- That skill's `SKILL.md` boundary and `graph-metadata.json` sibling edge and causal summary now name `sk-design`.

**How to roll back**: remove the added section and the sibling edge. The contested rows are unchanged, so nothing else depends on it.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Import five source categories, decline six

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Operator, implementing agent |

---

<!-- ANCHOR:adr-008-context -->
### Context

The `userinterface-wiki` source carries 152 rules across 12 categories. The first cut took two and left "whether the other ten belong in this repo at all" as an open question, which is a question that never answers itself.

Leaving it open had a cost: genuinely in-domain material — the UX laws, the typography rules, the visual-design rules — sat unused while the skill claimed to cover design.

### Constraints

- Importing everything would breach the word cap and dilute the skill into a rule dump.
- Declining everything would leave real value unclaimed for no reason other than inertia.
- The test is domain fit, not rule count.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: import five categories, partly absorb one, and decline six with a stated reason each.

**How it works**: Animation Principles and Timing Functions were already in `motion-principles.md`. Laws of UX became `ux-laws.md`. Typography and Visual Design folded into `depth-and-detail.md` and the `SKILL.md` scales. CSS Pseudo Elements is partly absorbed — hit-target expansion, `::selection`, and pseudo-element shadow animation are covered; the View Transitions API rules are not. The six declined categories are Exit Animations, Audio Feedback, Sound Synthesis, Morphing Icons, Container Animation and Predictive Prefetching, and the reason for each is recorded in the changelog's source-coverage table.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Import by domain fit** | Every rule earns its place; the declines are answerable | Requires judging 152 rules | 9/10 |
| Import all 12 categories | Complete coverage of the source | Audio synthesis and React measurement patterns are not design decisions; the cap breaks | 2/10 |
| Import none beyond the original two | Smallest package | Leaves the UX laws and typography rules unclaimed while the skill claims to cover design | 4/10 |

**Why this one**: the declines are the informative part. A category is declined because it is a different medium, a framework API, or a data-loading strategy — reasons that stay true, so the question does not reopen.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:

- Two new capabilities the skill did not have: the UX laws that decide what is on the screen at all, and the typography and shadow rules that finish a surface.
- The open question is closed with reasons rather than deferred.

**What it costs**:

- A fourth cross-source conflict surfaced with the visual-design import, on shadow color. Mitigation: resolved by surface type and documented alongside the other three.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A declined category turns out to be wanted | L | The table names each decline and its reason, so reversing one is a scoped decision |
| The UX laws duplicate the sibling's cognitive-laws reference | M | Both now state the reading-versus-authoring split explicitly |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The open question blocked the packet from closing |
| 2 | **Beyond Local Maxima?** | PASS | Import-all and import-none were both weighed |
| 3 | **Sufficient?** | PASS | One new reference plus additions to an existing one |
| 4 | **Fits Goal?** | PASS | Operator asked for the notes to be fixed, and this was one |
| 5 | **Open Horizons?** | PASS | Each decline is individually reversible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:

- `references/ux-laws.md` added; `references/depth-and-detail.md` extended with shadow systems, shadow color, button anatomy, line breaking, underlines, numerals, concentric radius and alpha borders.
- The changelog carries the full 12-category coverage table.

**How to roll back**: delete `ux-laws.md`, revert the depth additions, and drop the coverage table.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---
