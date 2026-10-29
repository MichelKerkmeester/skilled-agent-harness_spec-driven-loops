---
title: "Decision Record: Phase 15: routing-data-alignment"
description: "Why five follow-up items are refuted as correct behavior, why three are left for the advisor scorer, how chart and diagram theming reach their branch, and why several proposed stage-one signals were dropped."
trigger_phrases:
  - "routing data alignment decision record"
  - "refuted routing items"
  - "read-only explainer floor items"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/015-routing-data-alignment"
    last_updated_at: "2026-10-29T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the refutations, the theming route and the signal narrowing"
    next_safe_action: "Land the phase on main"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0276-routing-data-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 15: routing-data-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Refute What Is Correct Behavior, Leave What the Scorer Decides

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-29 |
| **Deciders** | The conductor of this phase, under the operator's direction to refute the items a review found correct |

---

<!-- ANCHOR:adr-001-context -->
### Context

The follow-up list held items a reviewer marked real, items it marked refute and items it marked plausible. Each was probed live before any change, because a routing fix built on an unconfirmed cause moves routing for nothing.

Five items turned out to be correct behavior:

- **cli-classifier D-05.** "Show me the cli-jev machine router" ranks cli-classifier first (0.639496 against 0.21905) and only misses the surfacing bar. Adding "router" would pull sk-doc and sk-code prompts.
- **mcp-tooling D-09.** The advisor gives "Use the MCP tool bridge for this." to mcp-code-mode (0.779014), the skill that owns the generic bridge. That stage-one choice is defensible, so only the MT-004 text changes.
- **The sk-git router-reach allowlist entry.** The reach check never probes a standalone root, and the entry would record sk-code as the winner of a GitLens phrase. The phrase now reaches sk-git instead.
- **The YAML half of sk-prompt D-03.** sk-doc wins "Turn this instruction into YAML frontmatter config for a prompt file." at 0.713394, and frontmatter is sk-doc's work.
- **cli-classifier P14 and sk-doc P18.** Both prompts go to `memory:save` (0.653333 and 0.7). The system-skill-advisor changelog v0.11.1.0 keeps `memory:save` as the scorer key after the rename to `/speckit:save`, so a top-1 of `memory:save` is the expected answer.

Three items have a real user impact but a cause outside routing data. Each prompt opens with a read-only verb ("Show me", "Explain"), and `isReadOnlyExplainer` in `runtime/lib/scorer/text.ts` matches it. `fusion.ts` then floors the confidence at 0.25 (`readOnlyExplainerFloor`, `scoring-constants.ts`). The items are mcp-tooling N-03, mcp-code-mode D-06 and system-skill-advisor probe P05, which ranks system-skill-advisor first at 0.553091 and still abstains. Probe P04 opens with "Show me" too, and it also has no signal, because the one that reached it pulled a changelog prompt toward the advisor (ADR-003).

### Constraints

- The phase changes routing data, not scorer code. The parent spec keeps advisor scoring changes out of scope.
- A vocabulary change that cannot move a probe still moves global routing, so it has to earn its place.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Refute the five correct-behavior items with their probe as evidence, and leave the three explainer-floor items with the cause named, rather than add vocabulary that cannot change their outcome.

**How it works**: Each refutation cites the probe line in `scratch/probes-after.txt`. For the floor items, a control phrasing proves the vocabulary already reaches the skill. "Find screen examples for a paywall" routes to mcp-tooling at 0.603776, while "Show me screen examples for a paywall" abstains. "How does the code mode architecture fit together" routes to mcp-code-mode, while "Explain Code Mode's architecture" abstains with mcp-code-mode ranked first.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Refute correct behavior, leave floor items with the cause** | No routing change without a probe that moves | Three probes still abstain | 9/10 |
| Add vocabulary until every probe passes | Every probe line turns green | The floor still abstains, so the vocabulary changes nothing for these prompts and adds capture risk elsewhere | 2/10 |
| Change the explainer floor | The three probes would route | A scorer change, out of this phase's scope | 4/10 |

**Why this one**: It changes routing only where a probe shows the change takes effect.

**The floor stays as designed**: The conductor reviewed the third option at closeout and kept the floor. It exists so a request to explain or show something does not load a skill the person never asked to run. Lifting it for three prompts would move every read-only explainer in the scorer corpus, the 155/195 baseline included. So the three items are settled as accepted behavior, not left open.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Each refuted item has its evidence, so a later review can check the reasoning instead of repeating the probe.

**What it costs**:
- "Show me screen examples" still gets no recommendation. Mitigation: the cause and a control phrasing are recorded for the scorer owner.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The floor hides a real routing gap on other "Show me" prompts | M | The decision names the scorer function, so a scorer change can be scoped to it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The follow-up list asked for each refutation to carry its reason |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | No routing change is needed for a refuted item |
| 4 | **Fits Goal?** | PASS | The goal is settled items, not green lines |
| 5 | **Open Horizons?** | PASS | The scorer owner gets the named cause |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp-tooling/manual-testing-playbook/hub-routing/ambiguous-defer.md` says MT-004 tests the hub's own stage-two routing.
- No vocabulary changes for the refuted or floor items. The two mcp-code-mode signals tried during the probe were removed again.

**How to roll back**: Revert the MT-004 paragraph and its version bump.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Canvas Theming Reaches Its Branch Through Canvas-Qualified Phrases

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-29 |
| **Deciders** | The conductor of this phase |

---

<!-- ANCHOR:adr-002-context -->
### Context

The sk-design hub scores a mode as the number of matched keywords times the mode's weight, and keeps every mode within one point of the top. `sk-design-md-generator` scored "design.md" and "style reference" at weight 4, so "Repaint diagram from this DESIGN.md style reference." scored 8 for the generator against 6 for the diagram. Every DESIGN.md theming request therefore landed on the extraction mode, whose own docs refuse application work.

### Constraints

- A request that names only a DESIGN.md, such as "Generate a DESIGN.md for our marketing site", must still reach the generator.
- A bare canvas word added to stage two is carried to stage one by the intent-signal generator. "this chart" at stage one took "Fix the bug that breaks this chart's tooltip in the React dashboard" from sk-code (sk-design 0.4096 against sk-code 0.234966), so it was dropped.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Take "style reference" out of the generator's scoring vocabulary and add "theme this chart" and "theme the chart" to the chart's, while the generator keeps "design.md".

**How it works**: A style reference is the artifact both sides use, so it decides nothing. The diagram repaint now scores 6 against 4 and routes to `sk-design-diagram` alone. The chart theming probe scores 3 against 4, so it routes as an ordered bundle with the generator first and the chart second. Extraction, generation and validation of a DESIGN.md still route to the generator alone. The diagram packet gains a `DESIGN_MD_THEME` intent that loads `references/design-md-theming.md`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Drop "style reference" from the generator, add chart theming phrases** | Diagram routes alone, chart is reached, extraction unchanged | Chart theming is a bundle led by the generator | 7/10 |
| Add bare "design.md" to the canvas classes | Short | "Generate a DESIGN.md" would pull both canvases into a bundle | 2/10 |
| Add "this chart" to the chart class | Chart theming routes alone | Takes a code bug prompt at stage one | 3/10 |
| Raise the chart weight | Chart theming leads | Reorders every existing chart and fundamentals bundle | 3/10 |

**Why this one**: It is the only option that reaches both canvases without moving any extraction prompt or stealing at stage one.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A diagram repaint from a DESIGN.md loads the theming reference the diagram `SKILL.md` promised.
- A chart theming request reaches the chart.

**What it costs**:
- Chart theming loads the generator's resources too. Mitigation: the bundle order puts the generator first, which matches validating a style reference before applying it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| "Write a style reference for our brand" no longer picks the generator | L | It names no surface to extract from, and the default mode answers it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | SD-D01a and SD-D01b routed to the generator before |
| 2 | **Beyond Local Maxima?** | PASS | Four options compared |
| 3 | **Sufficient?** | PASS | One removal and two additions |
| 4 | **Fits Goal?** | PASS | Both stages now agree on the theming phrases |
| 5 | **Open Horizons?** | PASS | A chart-specific phrase can lift the chart to a single route later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `sk-design/hub-router.json`, `mode-registry.json`, `ROUTER.md`, `SKILL.md` and `graph-metadata.json`.
- `sk-design-diagram/ROUTER.md`, `references/foundations/router-pseudocode.md` and its feature catalog entry.

**How to roll back**: Revert those files, then refresh the sk-design manifest and copy it over its twin.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Stage-One Signals Must Survive an Out-of-Domain Prompt

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-29 |
| **Deciders** | The conductor of this phase |

---

<!-- ANCHOR:adr-003-context -->
### Context

The follow-up list proposed advisor signals for cli-orca, system-skill-advisor and system-spec-kit. The advisor matches an intent signal as a bounded substring of the prompt, so a generic phrase fires on any request that contains it. It also suggested widening `generate-router-intent-signals.cjs --check` past the seven hubs.

### Constraints

- The scorer must not drop on any reading.
- The hub-routing rule asks for each new alias to be replayed against an out-of-domain phrase before it ships.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Keep only signals that move an item's probe and leave their out-of-domain control alone, and keep the intent-signal check at hub roots.

**How it works**: Four signals took or nearly took an out-of-domain prompt and were dropped. "daemon watcher" took a Vite build prompt. "advisor router" raised the advisor to 0.49752 on "Draft the changelog entry for the advisor router move", a sk-doc prompt. "card sync check" took "Run the credit card sync check in the payments service". "orphan sweeper" and the sweeper script names took "Write an orphan sweeper for unused rows in the Postgres orders table". cli-orca gets only "full ownership handoff", because its other router phrases name runtime states or skill names a non-Orca request also uses. The widened check would have demanded 118 phrases across five standalone skills, including "not working" and "continue later".
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Narrow signals that pass an out-of-domain control** | No measured capture | Three probes stay unrouted | 8/10 |
| Every phrase the finding proposed | More probes pass | Measured captures of unrelated prompts | 3/10 |
| Widen the intent-signal check to standalone roots | One rule for every skill | 118 phrases into stage one, many generic | 2/10 |

**Why this one**: A probe that passes by capturing unrelated prompts trades one wrong route for several.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- "full ownership handoff" reaches cli-orca at 0.768801, and "gitlens start review" reaches sk-git at 0.783751.
- "Check the Hermes skill copies and report a router copy that drifted from its source" reaches system-spec-kit at 0.709019.

**What it costs**:
- system-spec-kit probes P05 and P09 and system-skill-advisor probes P01 to P04 still miss. Mitigation: the script name `check-card-sync` reaches system-spec-kit (SK-D05a2), and the remaining prompts are recorded as left.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A kept signal captures a prompt no control covered | L | Each kept signal names its skill or a repository-specific artifact |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four proposed signals pulled unrelated prompts |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Each kept signal moves at least one probe |
| 4 | **Fits Goal?** | PASS | The scorer holds and no control is taken |
| 5 | **Open Horizons?** | PASS | A missed probe can gain a narrower signal later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `graph-metadata.json` intent signals of cli-orca, sk-git, sk-prompt, system-skill-advisor and system-spec-kit.
- `skill-graph.json`, recompiled.

**How to roll back**: Remove the added signals with `scratch/add-signals.cjs --remove <skill> <phrase>...`, then recompile the skill graph with `--export-json`.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
