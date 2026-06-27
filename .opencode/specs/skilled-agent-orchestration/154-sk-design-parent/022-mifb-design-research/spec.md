---
title: "Feature Specification: make-interfaces-feel-better corpus → sk-design improvement research"
description: "Level-3 deep-research phase: a single GPT-5.5-xhigh (cli-codex) deep-research lineage runs three iterations studying the external make-interfaces-feel-better skill corpus (SKILL.md, animations.md, performance.md, surfaces.md, typography.md) and deriving concrete, actionable improvements for sk-design and its five modes (interface, foundations, motion, audit, md-generator) plus the shared register. Research deliverables only; no live sk-design changes in this phase."
trigger_phrases:
  - "make-interfaces-feel-better sk-design research"
  - "mifb design improvement research"
  - "external design corpus sk-design"
  - "sk-design technique adoption research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research"
    last_updated_at: "2026-06-27T08:17:12Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 3-iteration deep research; authored research.md synthesis and backlog"
    next_safe_action: "Build phase adopts backlog priorities 1-8 plus the shared-path doc fix"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-022-mifb-design-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Net-new vs covered: the corpus is micro-craft; net-new high-value items are concentric-radius math, pure-rgba image outlines, root font smoothing, and audit detectors — most motion craft is already in design-motion"
      - "Highest-leverage home is design-foundations with design-audit as the enforcement pair; the hub stays logic-free"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: make-interfaces-feel-better corpus → sk-design improvement research

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase runs a single GPT-5.5-xhigh deep-research lineage (cli-codex executor, three iterations) over the external `make-interfaces-feel-better` skill corpus to extract concrete, adoptable design technique and translate it into a prioritized improvement backlog for `sk-design` and its five modes plus the shared register. It deliberately distinguishes genuinely net-new craft from technique sk-design already encodes, so the family adds leverage rather than bloat.

**Key Decisions**: Treat the external corpus as read-only input (ADR-pending), and gate every adoption candidate against sk-design's existing taste, anti-slop posture, and Brand-vs-Product register before recommending it (ADR-pending).

**Critical Dependencies**: The five external corpus files, the live `sk-design` hub and five mode packets, and the sibling `015-per-skill-improvement-research` finding that the family's design knowledge largely already landed.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../015-per-skill-improvement-research/spec.md |
| **Successor** | None yet (a future build phase will act on the backlog) |
| **Handoff Criteria** | The deep-research lineage ran three iterations (or converged earlier), `research/research.md` records the corpus technique inventory, the coverage map against each sk-design mode, and a prioritized improvement backlog with each item traced to a corpus file and an sk-design target file; no live sk-design content was changed by this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design family has a strong internally-grown content baseline (phases 009 and 012). A high-quality external skill, `make-interfaces-feel-better`, encodes design craft across surfaces, animations, typography, and performance that may contain technique sk-design covers weakly or not at all. Without a structured study, the family cannot tell which external technique is genuinely net-new versus already covered, where each adoptable technique belongs, and which external guidance would conflict with sk-design's taste and anti-slop posture. Adopting blindly would bloat the family or drift its taste; ignoring the corpus would leave real craft on the table.

### Purpose
Run a GPT-5.5-xhigh deep-research lineage (cli-codex, three iterations) that reads the full external corpus and the live sk-design surface, builds a technique inventory and a per-mode coverage map, and produces a prioritized, corpus-traced and target-traced improvement backlog. This is a research phase: it changes no live sk-design content; every named improvement routes to a future build phase.

> **Phase note:** `research/research.md` is the canonical deliverable. The external corpus is read-only input, preserved as written and referenced by path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- DR-SEED:SCOPE -->

### In Scope
- Reading the five external corpus files (`SKILL.md`, `animations.md`, `performance.md`, `surfaces.md`, `typography.md`) and the live `sk-design` hub, `mode-registry.json`, the five mode SKILL.md files, and the shared register.
- A technique inventory from the corpus and a coverage map against each sk-design mode (interface, foundations, motion, audit, md-generator) plus the shared register.
- A prioritized improvement backlog, each item traced to a corpus file and an sk-design target file (path + anchor where possible), with leverage and effort noted.
- The synthesis recorded in `research/research.md` and a continuity update.

### Out of Scope
- Any edit to the live sk-design hub, the five mode packets, their references, assets, routers, registry, or the md-generator backend. This phase produces research only.
- Building any named improvement. Each routes to a future build phase.
- Rewriting or relocating the external corpus or its files.

### Inputs (read-only)
- The external corpus under `../external/make-interfaces-feel-better-main/skills/make-interfaces-feel-better/`.
- The live `sk-design` skill and its five mode packets plus shared register.
- The sibling `../015-per-skill-improvement-research` synthesis (plumbing-over-theory meta-finding).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Created | This Level-3 research specification |
| `research/research.md` | Created | The canonical synthesis: technique inventory, coverage map, prioritized backlog |
| `research/deep-research-*.{json,jsonl,md}` | Created | Deep-research state, strategy, registry, dashboard, and iteration artifacts |
| `implementation-summary.md` | Created at synthesis | Short wrapper summarizing the synthesis and the next build phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- DR-SEED:REQUIREMENTS -->

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The deep-research lineage runs and produces canonical findings | `research/research.md` exists and records the corpus technique inventory and the per-mode coverage map; the state log shows the iterations and a stop reason |
| REQ-002 | Every adoption candidate is corpus-traced and target-traced | Each backlog item names the source corpus file and the sk-design target file (and anchor where possible) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Net-new technique is distinguished from already-covered technique | `research/research.md` separates genuinely new craft from technique sk-design already encodes, citing the existing sk-design location for the latter |
| REQ-004 | A prioritized backlog with leverage and effort is produced | The backlog ranks items and notes leverage and rough effort, so a future build phase can sequence the work |
| REQ-005 | The external corpus is preserved unchanged | The five corpus files are referenced by path only and not edited or relocated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A GPT-5.5-xhigh cli-codex deep-research lineage ran up to three iterations over the external corpus and the live sk-design surface, with `research/research.md` preserved as the canonical deliverable and a recorded stop reason.
- **SC-002**: `research/research.md` records a prioritized improvement backlog where each item traces to a corpus file and an sk-design target file, distinguishes net-new from already-covered technique, and changes no live sk-design content in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | External technique adopted wholesale without taste-gating | sk-design taste drift or anti-slop regression | Gate every candidate against sk-design's existing posture and the Brand-vs-Product register before recommending |
| Risk | The corpus is read as a mandate to add bulk references | Family bloats with technique it already covers | Require each candidate to be marked net-new versus already-covered, with the existing location cited for the latter |
| Risk | Recommendations are vague and unactionable | The backlog cannot be built later | Require corpus-file and sk-design target-file traces per item |
| Dependency | The five external corpus files | The research has no input | Confirm all five files are present and read in iteration 1 |
| Dependency | The live sk-design surface | The coverage map has no baseline | Read the hub, registry, five mode SKILL.md files, and shared register |
| Dependency | GPT-5.5-xhigh cli-codex executor | The lineage cannot run | Validated via smoke test before the loop; executor recorded in state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: This is a research phase; it adds zero runtime cost to any sk-design mode router until a build phase acts on it.
- **NFR-P02**: Any recommended addition, when built, must respect the existing per-task resource budget of its target mode rather than broadening default loads.

### Security
- **NFR-S01**: Any recommended file or asset addition must preserve the packet-local path-guard posture of its target mode.

### Reliability
- **NFR-R01**: `research/research.md` is the source of truth for the synthesis; the external corpus stays byte-unchanged so findings remain traceable.

---

## 8. EDGE CASES

### Data Boundaries
- **A technique sk-design already covers better**: recorded as already-covered with the existing sk-design location cited, not re-adopted.
- **A corpus claim that conflicts with sk-design taste**: recorded under ruled-out directions with the rationale, not folded in.

### Error Scenarios
- **An executor timeout or dispatch failure**: the workflow records a typed failure event and the loop continues or enters synthesis with partial findings.
- **Early convergence**: a stop before the three-iteration cap is a valid stop reason, and the deliverable is still authoritative.

### State Transitions
- **Research to build**: every named improvement routes forward to a build phase; the live family state is unchanged until then.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | One lineage across five corpus files mapped onto five modes plus shared, no code change |
| Risk | 10/25 | Research only, reversible; the risk is misreading or over-adopting, not breaking the family |
| Research | 17/20 | Heavy external-corpus study plus live-surface coverage mapping and prioritization |
| Multi-Agent | 6/15 | Single deep-research lineage with an orchestrator |
| Coordination | 9/15 | Cross-mode reconciliation and net-new-versus-covered adjudication |
| **Total** | **56/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | External technique adopted without taste-gating | H | M | Gate every candidate against sk-design posture and the Brand-vs-Product register |
| R-002 | Corpus read as a mandate to add bulk references | M | M | Mark each candidate net-new versus already-covered with the existing location cited |
| R-003 | Recommendations are vague | M | M | Require corpus-file and target-file traces per backlog item |
| R-004 | The backlog never reaches a build phase | M | M | Route each item forward explicitly to a future build phase |

---

## 11. USER STORIES

### US-001: Know which external technique is worth adopting (Priority: P0)

**As a** sk-design family maintainer, **I want** an evidence-backed inventory of make-interfaces-feel-better technique mapped against sk-design coverage, **so that** I adopt only genuinely net-new craft and skip what the family already encodes.

**Acceptance Criteria**:
1. Given the corpus and the live surface, When the synthesis is read, Then each technique is marked net-new or already-covered with a citation.

### US-002: Land each adoption in the right place (Priority: P0)

**As a** maintainer planning the build phase, **I want** each adoptable technique mapped to the correct sk-design mode (or shared register) with a minimal edit, **so that** the work is surgical rather than a broad rewrite.

**Acceptance Criteria**:
1. Given the backlog, When I plan a change, Then each item names a target file and anchor and a minimal edit.

### US-003: Protect taste while adopting (Priority: P1)

**As a** maintainer, **I want** conflicting external guidance ruled out explicitly, **so that** adoption does not drift sk-design's taste or weaken its anti-slop posture.

**Acceptance Criteria**:
1. Given the corpus, When a claim conflicts with sk-design taste, Then it is recorded under ruled-out directions with a rationale.

---

## 12. OPEN QUESTIONS

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Synthesis (converged, 3 iterations, see `research/research.md`).** The external `make-interfaces-feel-better` corpus is compact micro-craft, not a replacement for `sk-design`. Genuinely net-new, high-value items are few: concentric border-radius math, pure-rgba image-edge outlines, root-only macOS font smoothing, and audit detectors that turn subtle polish failures into reviewable checks. Most *motion* craft (interruptible transitions, `AnimatePresence initial={false}`, press-scale `0.96`, zero-bounce springs) is already encoded in `design-motion` — the only real gap there is the contextual icon-swap CSS fallback.

- **Highest-leverage home:** `design-foundations`, with `design-audit` as the enforcement pair. The hub stays logic-free.
- **Top build slice (8 items):** concentric-radius math, image-edge outline exception, shadow-ring-vs-ghost-card detector, icon-swap CSS fallback, root font smoothing, text-wrap caveats, `transition: all` detector, hit-area collision detector. Full 16-item ranked backlog in `research/research.md` §7.
- **Conflicts resolved:** shadow-as-border is adoptable only as a *replacement* for a decorative border (never stacked with one — that is the existing ghost-card tell); image-outline pure-rgba is an optical *exception* to tinted-neutral tokens.
- **Ruled out:** the corpus's global Review Output Format, wholesale numeric defaults (e.g. 40px over 44×44, universal 100ms stagger), and any per-mode logic in the hub.
- **Separate non-corpus cleanup:** the hub `SKILL.md:105` cites a `references/` shared base that does not exist — the real dir is `shared/`. Recorded as a small doc-fix, not a corpus-adoption item.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Canonical deliverable**: `research/research.md`
- **External corpus**: `../external/make-interfaces-feel-better-main/skills/make-interfaces-feel-better/{SKILL.md,animations.md,performance.md,surfaces.md,typography.md}`
- **Sibling research**: `../015-per-skill-improvement-research/implementation-summary.md`
- **Target skill**: `.opencode/skills/sk-design/` (hub + five mode packets + shared register)

<!--
LEVEL 3 ADDENDUM
- research/research.md is the primary evidence, workflow-owned and canonical
- The external corpus is read-only input, preserved and referenced by path
-->
