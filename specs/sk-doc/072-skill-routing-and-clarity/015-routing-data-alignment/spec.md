---
title: "Feature Specification: Phase 15: routing-data-alignment"
description: "The router-move alignment check found routing data that sends requests to the wrong skill or mode, and it could not fix them because that packet held routing fixed. This phase changes the routing data on purpose, refutes the items that are correct behavior and records a new scorer and replay baseline."
trigger_phrases:
  - "routing data alignment"
  - "phase 15 routing data alignment"
  - "router move follow-up routing fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: routing-data-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/276-routing-data-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-skill-router-files |
| **Successor** | None |
| **Handoff Criteria** | Every routing-data item is fixed, refuted with a reason or left with a named cause, and the scorer and replay baselines are recorded before and after |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the skill routing and clarity program. Phase 014 moved every machine router into a sibling `ROUTER.md` and ran an operator-local alignment check over thirteen skills. That check held routing fixed by design, so it recorded its routing-data findings in the 014 spec under "Follow-up Work Recorded by the Alignment Phases" and pointed them here.

**Scope Boundary**: routing vocabulary and router wiring in the skills the items name, the derived files that follow from them, one new routing gold scenario and the changelog entries of the touched skills. No advisor scoring code changes.

**Dependencies**:
- Phase 014 closed, so the router files exist and the item list is final.

**Deliverables**:
- Each item fixed, refuted or left, with a probe before and after.
- A scorer and replay baseline captured before and after, with every moved number explained.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several skills declare a phrase in one routing stage that the other stage scores differently, so a request lands on the wrong mode, on no mode, or on another skill. Examples: "screen examples" picks `mcp-mobbin` although the hub reserves it for a defer, "Extract DESIGN.md from the marketing site" goes to the Figma transport, and a diagram repaint from a DESIGN.md goes to the extraction mode.

### Purpose
Every item the alignment check recorded is settled: the real ones fixed in their authored vocabulary, the correct-behavior ones refuted with the reason, and any routing number that moves explained.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "screen examples for a paywall"
{"action":"route","targets":[{"packetId":"mcp-mobbin"}]}
$ node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "Repaint diagram from this DESIGN.md style reference."
{"action":"route","targets":[{"packetId":"sk-design-md-generator"}]}
$ node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "audit the diff before merge"
{"action":"defer","targets":[]}
$ advisor_recommend "Extract DESIGN.md from the marketing site"   -> mcp-tooling 0.717833, sk-design 0.552737
$ advisor_recommend "full ownership handoff"                      -> cli-external-orchestration 0.220542 only
$ advisor_recommend "gitlens start review"                        -> sk-code 0.723881, system-deep-loop 0.676041, sk-git 0.606418
$ capture-scorer-eval-baseline.mjs   full corpus 155/195, holdout 49/66, ambiguity 19/24
$ leaf-route-replay.cjs              total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49
```
The route outputs are trimmed to the action and targets. Full output is in `scratch/probes-before.txt`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the real items in their authored source: `hub-router.json` vocabulary classes, `ROUTER.md` intents and `graph-metadata.json` intent signals.
- Add a `DESIGN_MD_THEME` route to the diagram packet and wire sk-prompt's `NO_LOAD_INTENTS`.
- Add routing gold for `mcp-notion` and correct the MT-004 scenario text.
- Regenerate what derives from the edits: compiled route manifests and their authored twins, the skill graph, the Hermes copies and the generated intent signals.
- Record refuted items and the narrowing of new signals in `decision-record.md`.

### Out of Scope
- Advisor scoring code, such as the read-only explainer floor - it decides three of the items, and changing it is a scorer change rather than routing data.
- Widening `generate-router-intent-signals.cjs --check` past hub roots - it would add 118 phrases to five standalone skills, many of them generic, so it is not cheap (ADR-003).
- Reference format debt - it belongs to `specs/sk-doc/074-reference-template-debt/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-tooling/{hub-router.json,mode-registry.json,ROUTER.md,graph-metadata.json}` | Modify | Drop "screen examples" from Mobbin scoring and "extract design.md" from Figma scoring |
| `.skilled/skills/mcp-tooling/manual-testing-playbook/` | Modify/Create | MT-011 notion gold, MT-004 text, index counts |
| `.skilled/skills/sk-design/{hub-router.json,mode-registry.json,ROUTER.md,SKILL.md,graph-metadata.json}` | Modify | "style reference" leaves md-generator scoring, chart theming phrases join the chart class |
| `.skilled/skills/sk-design/sk-design-diagram/` | Modify | `DESIGN_MD_THEME` intent in `ROUTER.md`, its pseudocode reference and the feature catalog |
| `.skilled/skills/system-deep-loop/hub-router.json` | Modify | Eleven router phrases join the mode classes |
| `.skilled/skills/sk-prompt/{ROUTER.md,graph-metadata.json}` | Modify | `NO_LOAD_INTENTS` read before loading, design-generation signals |
| `.skilled/skills/{cli-orca,sk-git,system-skill-advisor,system-spec-kit}/graph-metadata.json` | Modify | Narrow intent signals |
| Nine `changelog/` entries | Modify | One bullet each |
| Derived: route manifests and twins, `skill-graph.json`, `.hermes/skills/` copies | Modify | Regenerated |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modify | Live gold pin 95 to 96 for MT-011 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every item in the follow-up list is fixed, refuted or left, and each has a probe run before and after the change. |
| REQ-002 | No previously correct scorer reading drops: full corpus, holdout and ambiguity top-1 each stay at or above 155/195, 49/66 and 19/24. |
| REQ-003 | Every replay number that moves is explained, and no previously scored replay row gets worse. |
| REQ-004 | Each new stage-one signal is replayed against an out-of-domain prompt and does not take it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The derived files are regenerated and their checks pass: compiled-route guard fresh, intent-signal check passed, Hermes copies in sync, skill graph doctor with no drift. |
| REQ-006 | `package_skill.py --check --strict` passes on each touched skill and `parent-skill-check.cjs` passes on each touched hub. |
| REQ-007 | The advisor scorer and routing suites and the sk-code SA-001 battery pass. |
| REQ-008 | Each touched skill or mode has one bullet in its newest changelog entry, and every changed markdown file is validated. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scorer reads 155/195, 49/66 and 19/24 after the change, the same as before.
- **SC-002**: The replay reads gold=65 scored=57 exact=50 after the change, and the one new row is MT-011.
- **SC-003**: Every fixed item's probe passes after the change and failed before it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The live advisor daemon must index this worktree | Probes would read another checkout | Each probe output names `workspaceRoot`, and it is this worktree |
| Risk | A new stage-one phrase captures unrelated requests | Med | Out-of-domain controls per new signal. Four signals that pulled one were dropped |
| Risk | An edit to a compiled-routing input leaves the manifest stale and the hub serves legacy | High | `compiled-route-guard.cjs` rerun after every edit. It caught one stale sk-design manifest after the SKILL.md edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. Vocabulary lists grow by a few phrases and no code path changes.

### Security
- **NFR-S01**: N/A. No credential, input boundary or permission changes.

### Reliability
- **NFR-R01**: Each hub's compiled route stays fresh, so it serves compiled routing rather than the legacy sentinel.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt that names only provider-neutral design research scores no mcp-tooling mode and defers.
- Maximum input: a chart prompt that names a DESIGN.md scores both the chart and the extraction mode and routes to both as an ordered bundle.
- Failure path: a prose request for "raw passthrough" no longer selects sk-prompt's RAW intent and falls back to the DEPTH default with the disambiguation checklist.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 46 tracked files, under 250 changed lines, nine skills |
| Risk | 12/25 | Global advisor vocabulary changes, guarded by the scorer, the replay and out-of-domain probes |
| Research | 8/20 | Each item needed its cause confirmed live before a fix |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The read-only explainer floor in the advisor scorer decides mcp-tooling N-03, mcp-code-mode D-06 and two system-skill-advisor probes, and it stays as designed (ADR-001).
<!-- /ANCHOR:questions -->

---
