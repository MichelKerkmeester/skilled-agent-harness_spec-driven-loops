---
title: "Feature Specification: Phase 1: frontend-surface-mode"
description: "Skilled's sk-code hub has no frontend surface, so an HTML, CSS or Figma-to-code request reaches no frontend guidance. This phase adds a dedicated read-only sk-code-frontend surface with the five-pass Figma check and the per-mode Frontend overrides contract, proven by its own router-reach run."
trigger_phrases:
  - "frontend surface mode"
  - "phase 1 frontend surface mode"
  - "sk-code-frontend surface packet"
  - "five-pass figma check"
  - "frontend overrides contract"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: frontend-surface-mode

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-tooling-fixes |
| **Handoff Criteria** | Router reach at concurrency 2 prints `outranked=  0` for sk-code, sk-design and mcp-tooling |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Frontend upstream proposals from Barter's frontend practice program specification. It covers proposal ranks 1, 2 and 3, which the proposals' adoption order ships as one change to sk-code with its own reach run.

**Scope Boundary**: The new `sk-code-frontend` packet, its registration and routing in the sk-code hub, and one pointer line in `mcp-figma/SKILL.md`. Nothing in sk-design changes here. Phase 003 owns the fundamentals hand-off.

**Dependencies**:
- The Barter source set in the primary checkout's gitignored tree: `barter/ai-speckit/skilled/barter-overlays/sk-code/shared/references/frontend/` (16 files).
- The operator's answer on React Native in canonical sk-code (open question 1).

**Deliverables**:
- `.skilled/skills/sk-code/sk-code-frontend/`, a surface packet with `SKILL.md`, `ROUTER.md`, `README.md`, the core page, two stack layers, the topic files and `figma-to-code.md`.
- The surface registered in `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, the hub `ROUTER.md` and the hub `SKILL.md` mode table.
- A saved reach run in `scratch/` that shows `outranked=  0` on three hubs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code surface axis lists only `sk-code-ci` and `sk-code-skilled`, and `shared/references/` holds no frontend folder, so a request about HTML forms, the CSS cascade or checking a built screen against Figma gets no frontend practice. No Skilled sk-code file defines a check against a design, and the mcp-figma playbook has no figma-to-code category.

### Purpose
A frontend request reaches a dedicated, stack-agnostic `sk-code-frontend` surface whose vocabulary is proven not to outrank any existing hub.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n '"surfaces"' .skilled/skills/sk-code/mode-registry.json
19:      "surfaces": ["sk-code-ci", "sk-code-skilled"],

$ ls .skilled/skills/sk-code/shared/references
phase-detection.md  stack-detection.md  universal  workflow-debug.md  workflow-implement.md  workflow-verify.md

$ grep -n "tieBreak" .skilled/skills/sk-code/hub-router.json
7:    "tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-ci", "sk-code-skilled"],

$ sed -n 171p .skilled/skills/sk-code/ROUTER.md
Do not load Go/NextJS/React Native resources from canonical sk-code; those surfaces live in the Barter sk-code fork (`barter/.opencode/skills/sk-code/references/`). Canonical sk-code owns the SKILLED surface plus the `sk-code-ci` GitHub Actions surface.

$ ls .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook
daemon-health  detection-setup  intra-routing-recall  manual-testing-playbook.md  optional-mcp  read-only  safety-gate
```
Read at worktree HEAD `a5105fb512`, which descends from the `fca60b13b3` the proposals cite.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the `sk-code-frontend` surface packet (`packetKind: "surface"`, `backendKind: "evidence-base"`, `routingClass: "metadata"`, `mutatesWorkspace: false`). It is reached from request vocabulary alone, the way `sk-code-ci` is, so it declares no `surfaceDetection` block.
- Port the core page, the web stack layer and the web topic files from the Barter set, with every Barter value removed and each Support line rewritten against the web-features Baseline status instead of Barter's declared browsers. The native stack layer and native topic files follow only if ADR-001 allows them.
- Write `figma-to-code.md` with the five-pass check: read-only inputs, five passes, a verdict that is `INCOMPLETE` when any pass did not run, the Figma-side tool ladder and the per-transport pass table with its `UNKNOWN` cells kept. Run each `bdg cdp` web recipe once in a live browser before it ships.
- State the per-mode Frontend overrides contract once in the core page: a mode may replace, extend or disable one statement under a `Frontend overrides` heading, naming the section, the action and the reason, and says so when nothing differs.
- Register and route the surface across the hub, add one pointer in `mcp-figma/SKILL.md` (a read that feeds code ends at the check), and prove the vocabulary with router reach.

### Out of Scope
- `barter-design-tokens.md`, the Angular mappings, the `@ngx-translate` notes, the Safari 18.0 and Firefox ESR floors, the Barter App UI Profile and the eight Barter mode overrides - they are Barter-only by the proposals' own "stays Barter-only" lists.
- A frontend checker for the overrides heading - Barter dropped one because two real overrides did not justify it, and the contract stays a writing convention.
- The `sk-design-fundamentals` hand-off line and the playbook scenarios - phases 003 and 004 own them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-frontend/SKILL.md`, `ROUTER.md`, `README.md` | Create | Packet identity, machine router with one intent per stack layer, reader entry |
| `.skilled/skills/sk-code/sk-code-frontend/references/` | Create | Core page, stack layers, topic files, `figma-to-code.md` |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | `modes[]` entry and the `surfaces` list |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Mode vocabulary, resources and the `tieBreak` slot ahead of `sk-code-skilled` |
| `.skilled/skills/sk-code/leaf-manifest.json`, `graph-metadata.json` | Modify | Leaf entry and the reach-proven intent signals |
| `.skilled/skills/sk-code/ROUTER.md`, `SKILL.md` | Modify | Stage-two map, the section 6 sentence ADR-001 decides, and the mode table |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | Modify | One pointer to the check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `mode-registry.json` lists `sk-code-frontend` in `modes[]` and in the `surfaces` array, and the registry compiler accepts the hub. |
| REQ-002 | `ci-router-vocabulary-reach.cjs --concurrency 2` prints `outranked=  0` and `wrong-hub=  0` for each of `--hub sk-code`, `--hub sk-design` and `--hub mcp-tooling`. An outrank is fixed by renaming the phrase, never by an allowlist entry or a scorer change. |
| REQ-003 | The surface's vocabulary holds multi-word frontend phrases only. No alias or intent signal is a bare stack word such as `css`, `html` or `react`. |
| REQ-004 | `rg -n -i "barter|@barter-bv|ngx-translate|declared browser floor|firefox esr" .skilled/skills/sk-code/sk-code-frontend/` prints no line. |
| REQ-005 | `figma-to-code.md` defines five passes, an `INCOMPLETE` verdict when any pass did not run, and the per-transport table with its `UNKNOWN` cells kept. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every web topic file's Support line cites a web-features Baseline status, not a declared browser list. Every native topic file's Support line names the React Native version it was checked against. |
| REQ-007 | The core page states the Frontend overrides contract: one heading, section plus action plus reason, and an explicit "no overrides" line when nothing differs. |
| REQ-008 | Each `bdg cdp` recipe in the web stack layer ran once in a live browser, with its command and output saved in `scratch/recipe-runs.txt`. |
| REQ-009 | `mcp-figma/SKILL.md` carries one line saying a Figma read that feeds code ends at the frontend check, and mcp-figma keeps its out-of-scope ruling on the official Figma MCP. |
| REQ-010 | The native stack layer and native topic files ship only if ADR-001 records the operator allowing React Native in canonical sk-code. Otherwise the surface ships web-only and ADR-001 records it. |
| REQ-011 | The parent-skill checker run with the sk-code hub path passes, and a real frontend prompt replays through both routing stages to the new surface. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A prompt such as "check this built screen against its Figma frame" resolves to the sk-code hub with `sk-code-frontend` bundled, in an advisor replay saved to `scratch/`.
- **SC-002**: Router reach at concurrency 2 reports `outranked=  0` on sk-code, sk-design and mcp-tooling, compared against a baseline captured before the first edit.
- **SC-003**: The Barter-value grep in REQ-004 prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's ruling on React Native (ADR-001) | The native half cannot be built without it | Build the web half first. The native half waits on ADR-001 and never blocks the web half. |
| Risk | A new phrase outranks an existing hub, as a design phrase outranked sk-code in Barter phase 026 (ADR-007) | High | Baseline reach first, multi-word phrases only, fix by renaming the phrase, rerun all three hubs |
| Risk | The `bdg cdp` web recipes have never run live (Barter open question 27) | Med | REQ-008 runs each once before it ships, and a recipe that fails is cut rather than shipped |
| Risk | A Barter value survives the rewrite | Med | REQ-004 grep gates closure |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each topic file stays at 215 lines or fewer, the ceiling the Barter set already meets.
- **NFR-P02**: A full reach run at concurrency 2 finishes without a `probe-error` row.

### Security
- **NFR-S01**: The surface is read-only: `toolSurface.forbidden` lists `Write`, `Edit` and `Task`, and `mutatesWorkspace` is `false`.
- **NFR-S02**: The figma-to-code inputs are read-only. The check never calls a mutating Figma verb.

### Reliability
- **NFR-R01**: Router reach is rerun from the final state, not from a mid-build state.
- **NFR-R02**: The registry compiler and the hub's existing test suites exit 0 after the change.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with only a bare stack word such as "css" keeps routing to `sk-code-skilled` as before, since no bare word enters the vocabulary.
- Maximum input: a prompt that names a Figma frame, a CSS rule and a GitHub workflow bundles the surfaces in `tieBreak` order, with `sk-code-frontend` placed ahead of the `sk-code-skilled` fallback.
- Failure path: a check where one pass cannot run, such as no browser transport, returns `INCOMPLETE` and names the pass, never a pass verdict.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One new packet of about 17 files, six hub files, one mcp-figma line |
| Risk | 16/25 | Routing outrank risk across three hubs; no runtime code |
| Research | 10/20 | The content is audited; the live recipe runs and the reach baseline remain |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- May canonical sk-code carry React Native guidance? `sk-code/ROUTER.md:171` says React Native resources live in the Barter fork. The answer becomes ADR-001 and decides REQ-010.
- Which Baseline source does a Support line cite: the web-features package version, or the MDN Baseline badge? Decide at T005 and apply it to every file.
<!-- /ANCHOR:questions -->

---
