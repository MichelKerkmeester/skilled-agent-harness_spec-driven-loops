---
title: "Feature Specification: Phase 4: review-remediation"
description: "Nine deep-review findings left the sk-code routing vocabulary, the sk-design metadata and two frontend references short of what the retired design guidance promised, and this phase repairs each one in place."
trigger_phrases:
  - "review remediation"
  - "deep review findings remediation"
  - "sk-code visual review routing"
  - "sk-design metadata cleanup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: review-remediation

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
| **Phase** | 4 of 4 |
| **Predecessor** | 003-chart-research-cleanup |
| **Successor** | None |
| **Handoff Criteria** | Every finding is fixed and the packet gate prints RESULT: PASSED, with the four visual-review phrases returning a surfaceBundle, the ten retired phrases gone from the sk-design metadata and no broken link left behind. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes specification.

**Scope Boundary**: The routing vocabulary, the canary fixture and the metadata that still describe the retired design surfaces, plus four document corrections the review found in the completed phases. It excludes the reference moves phase 1 made, the mode deletion phase 2 made and the citation cleanup phase 3 made.

**Dependencies**:
- Phase 1, because `web-visual-hierarchy.md` must exist on the frontend surface before a route can bundle it.
- Phase 2, because the retired fundamentals phrases only count as stale once that mode is gone.
- Phase 3, because the chart references and this phase share the same document validator and packet gate.

**Deliverables**:
- A `code-frontend-visual` class that bundles `sk-code-review` with `sk-code-frontend` for the four visual-review phrases.
- Three canary cases for value, review and motion prompts, plus the served fixture copied over its authored twin.
- A `WEB_VISUAL_HIERARCHY` intent that loads `web-accessibility-patterns.md` in both router mirrors.
- Ten new sk-design intent signals in place of the retired values phrases, and a sk-code surface description that names the visual references and `tokens.css`.
- Two corrected rows in completed packets and one folded shadow animation rule, proved by the full gate set.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A visual-review request still compiles to `sk-code-review` alone, so `web-visual-hierarchy.md` never loads for the reader who asked for a design review. The sk-design graph metadata still advertises ten phrases from the deleted fundamentals mode, the sk-code hub never names the three visual references or `tokens.css`, and two completed packets claim work and prompt counts the tree does not support.

### Purpose
Close all nine deep-review findings so every routing path, metadata field and reference file describes the state the previous three phases actually shipped.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "design review"
{"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"review-cache","packetId":"sk-code-review","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-review"}],"effectivePolicyHash":"ac7a08cc5d9f0a231744556421bc84df6dd253f395657d8909d7b7534c34bce5","generation":2}
$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "design review findings"
{"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"review-cache","packetId":"sk-code-review","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-review"}],"effectivePolicyHash":"ac7a08cc5d9f0a231744556421bc84df6dd253f395657d8909d7b7534c34bce5","generation":2}
$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review this design"
{"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"review-cache","packetId":"sk-code-review","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-review"}],"effectivePolicyHash":"ac7a08cc5d9f0a231744556421bc84df6dd253f395657d8909d7b7534c34bce5","generation":2}
$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review this screen"
{"hubId":"sk-code","action":"route","selectionKind":"surfaceBundle","targets":[{"backendKind":"review-cache","packetId":"sk-code-review","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-review"},{"backendKind":"evidence-base","packetId":"sk-code-frontend","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-frontend"}],"effectivePolicyHash":"ac7a08cc5d9f0a231744556421bc84df6dd253f395657d8909d7b7534c34bce5","generation":2}
$ node -p 'require("./.skilled/skills/sk-design/graph-metadata.json").derived.intent_signals.join(" | ")'
ui looks off | make this look better | spacing scale | build a color palette | visual hierarchy | contrast ratio failure | focus ring accessibility | animation duration | accessibility review | design review findings
$ git diff 10474a9567 --stat -- .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/node-to-token-markup.md
# prints no output
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add `design review` and `review this design` to the `code-frontend-visual` class and to the `WEB_VISUAL_HIERARCHY` keywords in both router mirrors.
- Add `references/web-accessibility-patterns.md` to the `WEB_VISUAL_HIERARCHY` load set in the prose line and in the `RESOURCE_MAP` of each mirror.
- Add three canary cases for value, review and motion prompts and copy the served fixture over its authored twin.
- Replace the ten retired sk-design intent signals, then correct the sk-code surface table, the surface list, the layout comment and the hub description.
- Fold the shadow animation rule and the session expiry rule back into their references, correct the two completed packet rows and run the full gate set.

### Out of Scope
- Change the review workflow or its output contract - the finding is about reach, not review quality.
- Add or remove a sk-code mode - the three visual references already live on the frontend surface.
- Rewrite the V20 elevation set or the M33 redirect rule - each fix adds the missing constraint to the existing rule.
- Reopen phases 1 to 3 for other cleanup - only the specific rows the review cited change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/hub-router.json` | Modify | `code-frontend-visual` gains `design review`, `review this design` and the alignment-pass visual phrases |
| `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | Modify | `WEB_VISUAL_HIERARCHY` gains both phrases and `web-accessibility-patterns.md`, and the alignment pass repeats the new phrases |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Root mirror carries the same keywords, load set, `RESOURCE_MAP` entry and alignment-pass phrases |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Three cases in the `surface-bundle-frontend` shape |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Authored twin copied from the served fixture |
| `.skilled/skills/sk-design/graph-metadata.json` | Modify | Ten retired intent signals replaced with three-mode phrases |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Surface row, surface list and layout comment name the references and `tokens.css` |
| `.skilled/skills/sk-code/description.json` | Modify | Description wording follows the surface and `lastUpdated` reads 2026-11-05 |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modify | Reminted from the changed hub router and copied to its authored twin |
| `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md` | Modify | Delete the row for a file that never changed |
| `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md` | Modify | AC-005 names the five baseline value prompts and their replay results |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md` | Modify | V20 gains the shadow animation pitfall and its code block |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md` | Modify | M33 restates server-side refusal and client cache clearing |
| `.skilled/skills/sk-design/hub-router.json` | Modify | Alignment pass adds chart-choice, chart-type, scatter, palette and `flow diagram` phrases, and removes bare `spacing` and `text colour` again |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json` | Modify | Alignment pass adds the `chart-choice` case and empties the defer gold intent list |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs` | Modify | Alignment pass removes a stale no-signal comment |
| `.skilled/skills/sk-design/sk-design-md-generator/SKILL.md` | Modify | Alignment pass removes the stale description of the retired mode |
| `.skilled/skills/sk-design/sk-design-md-generator/feature-catalog/procedure-cards/md-generator-procedure-card-inventory.md` | Modify | Alignment pass corrects the inventory to match the mode description |
| `.skilled/skills/sk-code/README.md` | Modify | Alignment pass removes the stale description of the retired mode |
| `.skilled/skills/sk-code/sk-code-frontend/README.md` | Modify | Alignment pass removes the stale description of the retired mode |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | Alignment pass removes the stale description of the retired mode |
| `.skilled/agents/README.txt` | Modify | Alignment pass corrects the shared agent README |
| `.skilled/agents/design.md` | Modify | Alignment pass hands author gates to `sk-code-quality`, with the `.claude` and `.opencode` copies matching |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts` | Modify | Alignment pass pins `tsAlsoCorrect` at 103 |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Alignment pass records `rr-iter3-146` in the divergence ledger |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Alignment pass recaptures the baseline at 156 full-corpus and 50 holdout cases |
| `.skilled/changelog/sk-code/parent/v3.11.0.0.md` | Modify | Alignment pass extends the entry |
| `.skilled/changelog/sk-code/code-frontend/v1.1.0.0.md` | Modify | Alignment pass extends the entry |
| `.skilled/changelog/sk-design/parent/v3.0.0.0.md` | Modify | Alignment pass extends the entry |
| `.skilled/changelog/sk-design/design-md-generator/v1.1.12.0.md` | Add | Alignment pass writes the entry for the corrected mode description |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.11.2.0.md` | Add | Alignment pass writes the entry for the template correction |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

The review carried no P0 finding. REQ-001 is its single P1 finding and it blocks closure, so it sits in the P0 table. The eight P2 findings follow in the P1 table.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `compiled-route --hub sk-code` returns a surfaceBundle of `sk-code-review` and `sk-code-frontend` for `design review`, `design review findings`, `review this design` and `review this screen`, after `design review` and `review this design` join the `code-frontend-visual` class in `hub-router.json` and the `WEB_VISUAL_HIERARCHY` keywords in both router mirrors. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The served canary fixture carries three new cases in the `surface-bundle-frontend` shape: `visual-values-frontend` for `what padding should this have` resolving to `[sk-code-frontend]`, `visual-review-bundle` for `design review findings` resolving to `[sk-code-review, sk-code-frontend]` and `visual-motion-frontend` for `what animation duration should this dropdown use` resolving to `[sk-code-frontend]`, and the served file matches its authored twin. |
| REQ-003 | `WEB_VISUAL_HIERARCHY` loads `references/web-accessibility-patterns.md` in the prose line and in the `RESOURCE_MAP` of `sk-code-frontend/ROUTER.md` and of the root `sk-code/ROUTER.md`, and `verify-router-sync.cjs` passes. |
| REQ-004 | `sk-design/graph-metadata.json` `derived.intent_signals` holds ten phrases for the extract, chart and diagram modes and none of the ten retired values phrases, and `parent-skill-check.cjs .skilled/skills/sk-design` reports OK. |
| REQ-005 | `sk-code/SKILL.md` names the three visual references (visual values, visual hierarchy and review, motion and interaction) and the `tokens.css` asset in the frontend surface row, the surface list and the layout comment. `sk-code/description.json` carries the matching wording and `lastUpdated` reads 2026-11-05, and `parent-skill-check.cjs .skilled/skills/sk-code` reports OK. |
| REQ-006 | `002-retire-fundamentals/implementation-summary.md` holds no row for `node-to-token-markup.md`, and `git diff 10474a9567 --stat` on that file still prints nothing. |
| REQ-007 | `001-frontend-upgrade/acceptance-criteria.md` AC-005 names the five baseline value prompts by text, records each replay result and states no count of eight. |
| REQ-008 | Item V20 of `web-visual-values.md` carries the shadow animation pitfall with the pseudo-element code block and a See also to `web-motion-and-interaction.md` Section 10, and the item numbers stay V1 to V41. |
| REQ-009 | M33 in `web-motion-and-interaction.md` states that the client redirect is UX only, that the server refuses every data request from the expired session and that the client clears cached protected data. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The four visual-review phrases return a surfaceBundle of `sk-code-review` and `sk-code-frontend`.
- **SC-002**: The sk-code canary harness passes with the three new cases and the served fixture matches its authored twin.
- **SC-003**: `parent-skill-check.cjs` reports OK on `.skilled/skills/sk-design` and on `.skilled/skills/sk-code`.
- **SC-004**: A grep over `sk-design/graph-metadata.json` for the ten retired values phrases prints no line.
- **SC-005**: `validate_document.py` reports VALID 0 issues on `web-visual-values.md` and `web-motion-and-interaction.md`.
- **SC-006**: `validate.sh specs/sk-design/021-deprecate-fundamentals --strict --recursive` prints RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The four router files and the sk-code compiled manifest | A stale manifest keeps the old route and hides every vocabulary fix | Remint the manifest, then run `compiled-route-sync --check` and `--verify` before the replay |
| Risk | A vocabulary addition moves an unrelated prompt onto the frontend surface | High | Run the canary harness and `ci-router-vocabulary-reach.cjs` over the full vocabulary before close |
| Risk | The authored twin drifts from the served fixture | Medium | Copy the served file over the twin in the same task and diff the two |
| Risk | A reference edit breaks the document contract | Medium | Run `validate_document.py` on each edited reference before the gate |
| Risk | A correction to a completed packet changes a settled closure verdict | Low | Edit only the cited row and rerun the validator on the phase parent |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. A routing and documentation packet runs no service, so no response time target applies.
- **NFR-P02**: N/A. A route replay is one process per prompt and adds no throughput path.

### Security
- **NFR-S01**: N/A. The change adds no credential and no auth surface.
- **NFR-S02**: N/A. The edited files hold no user data.

### Reliability
- **NFR-R01**: N/A. No uptime target applies to skill metadata and Markdown documents.
- **NFR-R02**: N/A. The route replay and the validator set are the only checks and each returns a pass or fail verdict.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: A prompt that hits no visual keyword keeps its current single route and the canary cases still pass.
- Maximum input: A prompt that hits both a review keyword and a visual keyword returns the bundle, which is the widest selection the hub can make.
- Failure path: A missing manifest remint leaves the old single route and the replay reports `selectionKind":"single"`, so the gate blocks.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Nine fixes over thirteen files, all in routing metadata and skill documents |
| Risk | 6/25 | A vocabulary change can move unrelated prompts, with no auth, data or API path |
| Research | 4/20 | The review already recorded each finding, its cause and its fix |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The review recorded the cause, the fix and the check for each finding, and the work needs no decision the plan does not already state.
<!-- /ANCHOR:questions -->

---
