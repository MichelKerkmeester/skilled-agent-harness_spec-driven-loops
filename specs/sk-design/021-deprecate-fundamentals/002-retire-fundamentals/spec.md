---
title: "Feature Specification: Phase 2: retire-fundamentals"
description: "sk-design still registered a fourth mode that duplicated the value guidance phase 1 moved into sk-code-frontend, so this phase deletes the fundamentals folder and reduces the hub to three modes."
trigger_phrases:
  - "retire sk-design-fundamentals"
  - "sk-design three modes"
  - "remove fundamentals routing"
  - "design agent decide path"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: retire-fundamentals

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/316-deprecate-design-fundamentals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-frontend-upgrade |
| **Successor** | 003-chart-research-cleanup |
| **Handoff Criteria** | The sk-design hub registers three modes and the design agent decide path points at the sk-code-frontend references. Every live link, mirror and compiled-routing copy resolves without the deleted folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes specification.

**Scope Boundary**: The sk-design side and every link, mirror and compiled-routing file that named the retired mode. It excludes the sk-code frontend work that phase 1 owns and the research citation cleanup that phase 3 owns.

**Dependencies**:
- Phase 1, because the value guidance has to live in `sk-code-frontend` before the source folder is deleted.
- The sk-design hub files that register modes, routes and metadata.
- The compiled-routing manifest chain and the runtime mirror generators.

**Deliverables**:
- The `sk-design-fundamentals` folder removed from `.skilled/skills/sk-design/`.
- A three-mode hub across `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md` and the metadata files.
- A design agent decide path that points at the `sk-code-frontend` references.
- Repointed links, playbook prompts and compiled-routing fixtures.
- sk-design 3.0.0.0 and mcp-figma 1.2.2.0, each with a changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`sk-design-fundamentals` was a fourth design mode whose value and decision guidance moved into `sk-code-frontend` during phase 1. The hub still registered it, so a padding prompt compiled against sk-design routed to that single mode and the advisor answered the same prompt through sk-design at 0.65 confidence. Shipping both copies would leave two owners for one rule and keep a retired mode reachable.

### Purpose
Retire the fundamentals mode and route its work to `sk-code-frontend` so sk-design serves three modes with one owner for each rule.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
compiled-route --hub sk-design "what padding should this card have" -> route single sk-design-fundamentals.
advisor: "what padding should this card have" -> sk-design 0.65.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Delete the `sk-design-fundamentals` folder and its assets from the sk-design hub.
- Reduce the hub registry, router, skill entry and metadata to three modes.
- Point the design agent decide path at the sk-code-frontend references.
- Repoint every live document, playbook prompt and sibling skill that cited the fundamentals path.
- Drop the VALUES and REVIEW owners from compiled routing, drop the two fundamentals canary cases and remint the served copies.

### Out of Scope
- Author the replacement value, hierarchy and motion guidance - phase 1 already wrote it into `sk-code-frontend`.
- Strip research citations from `sk-design-chart` and the other design modes - phase 3 owns that cleanup.
- Keep the slides or print guidance - the operator chose to drop it and neither chart nor diagram linked to it.
- Change the chart, diagram or md-generator modes - each keeps its own contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/sk-design-fundamentals/` | Delete | Entire folder removed by git rm |
| `.skilled/skills/sk-design/mode-registry.json` | Modify | Three modes, no default mode |
| `.skilled/skills/sk-design/hub-router.json` | Modify | `defaultMode` null, tie break entry, `design-decisions` and `design-review` classes removed |
| `.skilled/skills/sk-design/ROUTER.md` | Modify | VALUES and REVIEW intents removed |
| `.skilled/skills/sk-design/SKILL.md` | Modify | Three-mode table and version 3.0.0.0 |
| `.skilled/skills/sk-design/description.json` | Modify | Hub description follows three modes |
| `.skilled/skills/sk-design/command-metadata.json` | Modify | Command list drops the retired mode |
| `.skilled/skills/sk-design/graph-metadata.json` | Modify | Fundamentals and slides or print phrases removed, intent signals 219 to 111 |
| `.skilled/skills/sk-design/leaf-manifest.json` | Regenerate | Leaf list rebuilt from three modes |
| `.skilled/agents/design.md` | Modify | Decide path points at the sk-code-frontend references |
| `.claude/agents/design.md` | Modify | Same decide path for the Claude runtime |
| `.codex/agents/design.toml` | Regenerate | Codex mirror of the design agent, with the pi and hermes mirrors following |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | Modify | Value questions hand off to sk-code-frontend |
| `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/node-to-token-markup.md` | Modify | Scenario points at the frontend reference |
| `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/token-drift.md` | Modify | Drift decision hands off to `web-visual-values.md` |
| `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/check-built-screen.md` | Modify | Contrast pass reads the frontend target values |
| `.skilled/skills/sk-design/sk-design-md-generator/references/design-knowledge/numeric-design-laws.md` | Modify | Authoring direction points at sk-code-frontend |
| `README.md` | Modify | Root skill list describes three design modes |
| `.skilled/skills/sk-design/benchmark/README.md` | Modify | Benchmark list drops the retired mode |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modify | Example names three design modes |
| `.skilled/skills/sk-design/manual-testing-playbook/resource-loading/assets-only.md` | Modify | Prompt expects no fundamentals target |
| `.skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md` | Modify | Prompt expects no fundamentals target |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs` | Modify | VALUES and REVIEW owners dropped |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json` | Modify | Two fundamentals cases dropped and `out-of-domain-defer` added |
| `.skilled/skills/sk-design/changelog/v3.0.0.0.md` | Create | Breaking release entry for the removed mode |
| `.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.2.0.md` | Create | Repoint entry for the Figma skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `.skilled/skills/sk-design/sk-design-fundamentals/` no longer exists, and `rg -n 'sk-design-fundamentals'` over the eight live hub files prints no line. |
| REQ-002 | `mode-registry.json`, `hub-router.json`, `ROUTER.md` and `SKILL.md` describe three modes with no default mode, and `parent-skill-check sk-design` reports all hard invariants passed with 0 warnings at exit 0, including leg 6b with three modes in the hub table. |
| REQ-003 | `graph-metadata.json` carries 111 intent signals down from 219 and names no fundamentals or slides or print phrase. `generate-router-intent-signals --check sk-design` prints orphans=0 missing=0 PASSED. |
| REQ-004 | The design agent decide path in `.skilled/agents/design.md`, `.claude/agents/design.md` and the codex, pi and hermes mirrors points at the sk-code-frontend references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Every live document and playbook prompt that cited the fundamentals path is repointed, so `rg -n 'sk-design-fundamentals'` over those ten files prints no line. |
| REQ-006 | The sk-design registry compiler names no VALUES or REVIEW owner, and `canary-cases.v1.json` drops the two fundamentals cases and expects `out-of-domain-defer` for the out-of-domain prompt. |
| REQ-007 | `compiled-route-sync --check` reports all 55 served copies match their authored files, `--verify` resolves all 7 hubs and `compiled-route-status --all` reports every hub compiled-serving. |
| REQ-008 | `ci-router-vocabulary-reach` reports RESULT PASSED with wrong-hub=0 outranked=0 no-reach=0, and sk-design declared phrases drop from 120 to 84. |
| REQ-009 | sk-design is version 3.0.0.0 and mcp-figma is version 1.2.2.0, each with a changelog entry. |
| REQ-010 | `check-markdown-links` reports 0 broken markdown links across 14494 links, and `runtime-mirrors --check` reports PASS for 213 mirrors. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: A padding prompt compiled against sk-design reaches no fundamentals target, because the mode no longer exists.
- **SC-002**: `parent-skill-check` on sk-design, sk-code and mcp-tooling each report all hard invariants passed with 0 warnings at exit 0.
- **SC-003**: `check-markdown-links` reports 0 broken links across 14494 links.
- **SC-004**: `compiled-route-sync --check` reports all 55 served copies match their authored files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 frontend references | Value work has no destination after the deletion | Hold the deletion until phase 1 ships and the five prompts replay to sk-code-frontend |
| Dependency | Compiled-routing manifest chain | Served copies drift from the authored files | Remint the sk-design, sk-code and mcp-tooling manifests and copy them to the authored archive path |
| Risk | A stale link survives the deletion | High | Run `check-markdown-links` and grep the live skill tree for the retired path |
| Risk | A retired mode stays reachable through the router | High | Set `defaultMode` null, remove the two classes and replay the canary cases |
| Risk | The breaking version change surprises a consumer | Medium | Bump 2.0.11.0 to 3.0.0.0 and write the changelog entry that names the removed mode |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. A documentation and routing packet runs no service, so no response time target applies.
- **NFR-P02**: N/A. No throughput path exists for skill documents.

### Security
- **NFR-S01**: N/A. The change adds no credential and no auth surface.
- **NFR-S02**: N/A. The files hold no user data.

### Reliability
- **NFR-R01**: N/A. No uptime target applies to a skill hub.
- **NFR-R02**: N/A. The hub check and the routing replay are the only checks and both report no error.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: A prompt with no design signal, such as `run the deployment pipeline`, defers with no-match, as the `out-of-domain-defer` canary records.
- Maximum input: A prompt that names a chart and a flowchart together returns an ordered bundle of `sk-design-chart` and `sk-design-diagram`.
- Failure path: A link left on the deleted fundamentals path fails `check-markdown-links`, which must report 0 broken links.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One folder deleted, eight hub files, five agent copies, ten repointed documents and two routing files |
| Risk | 10/25 | A breaking major version and a routing surface, with no auth, data or API path |
| Research | 8/20 | The evidence for what to keep came from the phase 1 references and the baseline replay |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator fixed the folder removal, the worktree and the drop of slides and print guidance on 2026-11-05.
<!-- /ANCHOR:questions -->

---
