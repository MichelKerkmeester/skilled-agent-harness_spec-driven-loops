---
title: "Feature Specification: /interface:design command decomposition research"
description: "Two independent 10-iteration deep-research lineages investigating whether /interface:design — now one of only two public sk-design commands, carrying five argument lanes plus twelve internal lanes including six motion lanes — should be decomposed into smaller commands, and what that would cost against what a just-completed consolidation spent effort removing."
trigger_phrases:
  - "design command decomposition research"
  - "interface design command split"
  - "sk-design command surface research"
  - "design-interface lane seams"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/013-design-command-decomposition-research"
    last_updated_at: "2026-07-27T14:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored packet framing both lineages and the five research questions"
    next_safe_action: "Dispatch Lineage A and Lineage B, 10 forced iterations each"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - "research/lineages/glm/"
      - "research/lineages/composer/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: /interface:design command decomposition research
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned — no iterations started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `012-remaining-mode-conformance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`/interface:design` is now one of only two public sk-design commands (with `/interface:design-reference`), after a consolidation that took the hub from 6 modes / 5 commands to 2 workflow modes + 1 transport / 2 commands. Everything that used to be a separate mode — the static system from the retired `foundations` mode, the temporal layer from the retired `motion` mode (six `motion-*` internal lanes plus a restraint gate), and the pre-delivery review from the retired `audit` mode (seven binary anti-slop checks) — now lives inside `interface`. The `aesthetic` lane was retired entirely. The result: `/interface:design` carries five selectable argument lanes (`direction`, `directions`, `redesign`, `preflight`, `handoff`) plus twelve internal/hidden lanes, and its owning mode's `SKILL.md` was recently trimmed from 5,234 to 4,991 words purely to stay under a 5,000-word hard cap. Consolidation reduced the command count while concentrating responsibility into one command; whether that is the right end state or a new monolith is undetermined.

### Purpose

Run two independent 10-iteration deep-research lineages — `cli-devin` (`glm-5-2`) and `cli-cursor` (`composer-2.5`) — against the five research questions below, each producing a converged, ranked synthesis with explicit confidence. Compare the two lineages' conclusions rather than merge them, since where free models disagree is the more informative signal than where they agree. This packet hosts the research; it does not itself decompose or change any command.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Authoring and driving two independent deep-research lineages, `research/lineages/glm/` (`cli-devin` · `glm-5-2`, GLM-5.2 High, 200K context, free tier) and `research/lineages/composer/` (`cli-cursor` · `composer-2.5`, Cursor's native model), each forced to 10 iterations with no early convergence stop before iteration 10.
- Framing and answering the five research questions in §"Research Questions" against real evidence in `design-interface/SKILL.md` (`INTENT_SIGNALS`, `RESOURCE_MAP`), its five argument lanes, and its twelve internal lanes.
- Each lineage producing its own converged synthesis: ranked recommendations by value-to-cost with explicit confidence, plus an explicit "not worth doing" section.
- A cross-lineage comparison identifying where `glm-5-2` and `composer-2.5` agree and where they diverge, and why.
- Applying the hard constraint (§"Hard Constraint") to every recommendation before it is ranked above "not worth doing."

### Out of Scope

- Actually decomposing `/interface:design`, writing any new command doc/asset/registry entry, or otherwise modifying `design-interface`, `design-mcp-open-design`, `design-md-generator`, or any other sk-design mode — this packet is research-only.
- Merging the two lineages' conclusions into one blended recommendation — they are compared, never averaged.
- Re-litigating the just-completed mode consolidation (foundations/motion/audit retirement, aesthetic-lane removal) — that is settled program history this packet takes as given context, not a question to re-open.
- Any work in sibling packets `011-retirement-residue` or `012-remaining-mode-conformance`, or edits to the program parent's `spec.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/lineages/glm/**` | Create | `cli-devin` (`glm-5-2`) 10-iteration deep-research lineage artifacts + synthesis |
| `research/lineages/composer/**` | Create | `cli-cursor` (`composer-2.5`) 10-iteration deep-research lineage artifacts + synthesis |
| `research.md` | Create (optional, post-loop) | Cross-lineage comparison, if not folded into `implementation-summary.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages complete 10 forced iterations each, with no early convergence stop before iteration 10 | `research/lineages/glm/` and `research/lineages/composer/` each show 10 completed iteration records |
| REQ-002 | Each lineage produces a converged synthesis document ranking its recommendations by value-to-cost with an explicit confidence level per recommendation | Each lineage's synthesis lists every recommendation with a stated confidence (e.g. high/medium/low or a percentage) and a value-to-cost ranking, not an unordered list |
| REQ-003 | Every recommendation is checked against the hard constraint (fixes a demonstrated current problem, is the smallest change that does so, states its cost) before being ranked above "not worth doing" | Each ranked recommendation's write-up names the demonstrated problem it fixes and its cost; recommendations that fail this check are moved to "not worth doing" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The two lineages' conclusions are compared, not merged — points of agreement and disagreement are both explicitly surfaced | A comparison section (in `research.md` or `implementation-summary.md`) names concrete points where `glm-5-2` and `composer-2.5` agree and where they diverge |
| REQ-005 | The packet includes an explicit "not worth doing" section drawn from both lineages | Both lineages' synthesis documents, and the comparison, each carry a named "not worth doing" section, not silence on rejected ideas |
| REQ-006 | All five research questions (lane seams, decomposition cost, middle-path alternatives, `INTENT_SIGNALS`/`RESOURCE_MAP` co-occurrence evidence, and observed failure modes) are addressed by both lineages | Each lineage's synthesis addresses all five questions, even where the answer is "no evidence found" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both lineages converge after exactly 10 forced iterations, each with a ranked, confidence-scored synthesis and a "not worth doing" section.
- **SC-002**: A reader can tell, from the comparison alone, where the two models agree and where they diverge, and which disagreement is most load-bearing for the eventual decision.
- **SC-003**: No recommendation in either synthesis reads as "split it because it is big" — every recommendation states the demonstrated problem, the smallest fix, and its cost.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Either free model defaults to symmetry-driven reasoning ("split because it's big") rather than evidence-driven reasoning | Recommendation is unusable against the hard constraint, forcing a re-ask or manual downgrade to "not worth doing" | Hard constraint stated prominently in this spec and repeated in each lineage's iteration prompt |
| Risk | A lineage converges early (before 10 iterations) on a shallow answer | Under-explored research question, weak evidence base | REQ-001 forces 10 iterations regardless of apparent convergence |
| Dependency | `design-interface/SKILL.md`'s current `INTENT_SIGNALS`/`RESOURCE_MAP` content (read-only evidence source for both lineages) | If the file changes mid-loop (e.g. a concurrent sibling packet edits it), the two lineages could reason from different snapshots | Sibling packets `011-retirement-residue` and `012-remaining-mode-conformance` do not touch `design-interface/SKILL.md`'s intent/resource tables per their own scope; treat as stable for this loop's duration |
| Dependency | Free-tier model availability for `glm-5-2` (cli-devin) and `composer-2.5` (cli-cursor) | Loop stalls if either tier is rate-limited or unavailable | Orchestrator's own retry/backoff handling; outside this packet's scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Neither lineage is stopped early for apparent convergence — both run the full 10 forced iterations per REQ-001, since a premature stop would understate the disagreement this research is designed to surface.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **A lineage's iteration prompt drifts into proposing an actual decomposition (writing files, drafting a new command doc) instead of researching one**: treat as scope violation — the orchestrator must redirect back to research-only output; this packet never expects working code or draft assets from either lineage.
- **The two lineages agree on everything, with zero disagreement**: still valid — report that as a finding (strong signal), rather than manufacturing a disagreement that is not there.
- **A lineage's synthesis proposes decomposition options that violate the hard constraint outright** (e.g. justified only by SKILL.md word count): the synthesis must still capture the proposal, but it is placed in "not worth doing" with the constraint violation named as the reason for rejection, not silently dropped.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Whether a third comparison artifact (`research.md`) is needed as a standalone file, or whether the cross-lineage comparison can live entirely inside `implementation-summary.md`**: left to whichever is cleaner once both lineages' actual synthesis content exists; either satisfies REQ-004.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
- **Predecessor**: `../012-remaining-mode-conformance/`

---

## RESEARCH QUESTIONS

1. **Lane seams**: Does the lane structure reveal natural seams? Which of the five argument lanes (`direction`, `directions`, `redesign`, `preflight`, `handoff`) and twelve internal lanes are genuinely separable jobs versus phases of one job?
2. **Decomposition cost**: What would decomposition cost? Each new command needs a doc, two YAML assets, a presentation asset, `command-metadata.json` entries, registry/router wiring, runtime mirrors, and test-roster updates — the consolidation just spent significant effort *removing* exactly that per-command overhead.
3. **Middle path**: Is there a middle path — argument lanes, subcommands, or mode-internal routing — that separates concerns without multiplying the command surface?
4. **Co-occurrence evidence**: What does the evidence in `design-interface/SKILL.md`'s `INTENT_SIGNALS` and `RESOURCE_MAP` say about which intents co-occur and which never do? Intents that never co-occur are candidate seams; intents that always load together are not.
5. **Observed failure modes**: Which failure modes does the current single-command shape actually produce, if any? A decomposition with no observed problem behind it is speculative.

## HARD CONSTRAINT

The operator has repeatedly rejected over-engineering and has collapsed two over-ceremonious scaffolds during this program. Any recommendation must fix a **demonstrated current problem**, be the smallest change that does so, and state its cost. "Split it because it is big" is not a finding. Reversing a consolidation that was just completed needs a much stronger argument than symmetry.
