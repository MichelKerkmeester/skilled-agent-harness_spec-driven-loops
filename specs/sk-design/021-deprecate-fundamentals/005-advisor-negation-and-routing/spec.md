---
title: "Feature Specification: Phase 5: advisor-negation-and-routing"
description: "The advisor explicit lane reads a negated write as a real one, so a labeled routing case loses its sk-code gold. Two borderline prompts also stop one mode short of the surface that owns the work. This phase fixes the scorer guard, adds the two missing route phrases and reopens the v4.0.1.0 release entry."
trigger_phrases:
  - "advisor negation and routing"
  - "phase 5 advisor negation and routing"
  - "advisor negated write"
  - "design document route"
  - "chart colour route"
  - "v4.0.1.0 release notes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: advisor-negation-and-routing

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/316-deprecate-design-fundamentals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | The negated-write test passes, the two borderline prompts return their target modes, the five protected routes keep their prior selection and the updated v4.0.1.0 entry is published with its tag. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes specification.

**Scope Boundary**: The advisor explicit lane and its scorer test, the sk-doc and sk-design vocabulary that owns the two borderline prompts and the v4.0.1.0 release entry. It excludes the retirement and reference work phases 1 to 4 shipped and every advisor lane other than the explicit lane.

**Dependencies**:
- Phase 4, because the release entry describes the routing and metadata state that phase closed.
- The built advisor runtime, because the parity and accuracy figures come from the TypeScript runtime after `npm run build`.

**Deliverables**:
- A `NEGATED_WRITE` pattern and an `affirmedWriteText()` helper in the explicit lane, with a scorer test for three affirmed and four negated prompts.
- "document for clarity" in the sk-doc graph metadata, hub alias class and ROUTER intent.
- "chart color system" and "chart colour system" in the sk-design derived trigger phrases.
- An updated v4.0.1.0 release entry that names the retirement and the republished tag.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The explicit lane gives sk-doc a 0.7 write-doc-surface boost whenever a write verb and a doc word co-occur, even when the write is negated. The labeled case rr-iter3-146 asks for a taxonomy review and says not to write anything back. It scored sk-doc 0.8445 over its sk-code gold at 0.8377. Two borderline prompts also stopped one mode short, because sk-doc had no design-document phrase and sk-design had no chart-colour phrase.

### Purpose
Make a negated write stay neutral, send the design-document prompt to sk-doc and the chart-colour prompt to sk-design, then name the branch in the v4.0.1.0 release entry and republish its tag.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ npm run build (in .skilled/skills/system-skill-advisor/runtime)
build completed

parity and accuracy after the build
python-ts-parity: tsAlsoCorrect 103 -> 104
regression list: rr-iter3-146 removed
accepted list and ledger entry: removed, ledger 75 -> 74
scorer eval baseline: full corpus 155 -> 157 at 0.8051
holdout: 49 -> 50
ambiguity: 19 -> 20
legacy advisor-corpus-parity: 108 -> 109
full advisor suite: 1371 passed, 1 failed, 8 skipped
live advisor rr-iter3-146: sk-code 0.8377 first

borderline route replays
Review this design document for clarity.
  before: sk-code 0.9451
  after: sk-doc 0.949 first, single sk-create-quality-control
review the chart colour system
  before: sk-code 0.9159
  after: sk-design 0.9268 first, single sk-design-chart
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `NEGATED_WRITE` pattern and the `affirmedWriteText()` helper to the explicit lane.
- Add a scorer test with three affirmed and four negated write prompts.
- Add "document for clarity" to the sk-doc intent signals, trigger phrases, hub alias class and `DOC_QUALITY` intent.
- Add "chart color system" and "chart colour system" to the sk-design derived trigger phrases.
- Update the v4.0.1.0 release entry and republish its tag.

### Out of Scope
- Change any advisor lane other than the explicit lane - no other lane changed.
- Remove the older chart phrases already in sk-doc's derived trigger phrases - they predate this change and stay as is.
- Retune the five protected routes - they keep their prior selection.
- Change the release version or the other sections of the v4.0.1.0 entry beyond the retirement correction.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Add the `NEGATED_WRITE` pattern and the `affirmedWriteText()` helper |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/negated-write-surface.vitest.ts` | Create | Cover three affirmed and four negated write prompts |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modify | Add "document for clarity" to the intent signals and derived trigger phrases |
| `.skilled/skills/sk-doc/hub-router.json` | Modify | Add the `create-quality-control-aliases` class |
| `.skilled/skills/sk-doc/ROUTER.md` | Modify | Add the `DOC_QUALITY` intent |
| `.skilled/skills/sk-design/graph-metadata.json` | Modify | Add "chart color system" and "chart colour system" to the derived trigger phrases |
| `.skilled/changelog/skilled/v4.0.1.0.md` | Modify | Point open design values at `sk-code-frontend` and name the branch work |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `explicit.ts` carries a `NEGATED_WRITE` pattern that matches don't, don’t, do not, never or without, up to two words, then a write-verb stem. It also carries an `affirmedWriteText()` helper that blanks each negated write phrase before the three write-surface tests. `negated-write-surface.vitest.ts` passes with three affirmed prompts that reach sk-doc and four negated prompts that do not. The live advisor returns sk-code 0.8377 first for rr-iter3-146. |
| REQ-002 | `sk-doc/graph-metadata.json` carries "document for clarity" in `derived.intent_signals` and `derived.trigger_phrases`, `sk-doc/hub-router.json` carries the `create-quality-control-aliases` class and `sk-doc/ROUTER.md` carries the `DOC_QUALITY` intent. The prompt "Review this design document for clarity." returns sk-doc 0.949 first with a single `sk-create-quality-control` route. |
| REQ-003 | `sk-design/graph-metadata.json` carries "chart color system" and "chart colour system" in `derived.trigger_phrases`. The prompt "review the chart colour system" returns sk-design 0.9268 first with a single `sk-design-chart` route. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `.skilled/changelog/skilled/v4.0.1.0.md` stops saying that open design values go to `sk-design-fundamentals` and names the retirement and this branch's routing work. The v4.0.1.0 tag is republished after the entry changes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The negated-write test passes and the live advisor returns sk-code first for rr-iter3-146.
- **SC-002**: python-ts-parity reads tsAlsoCorrect 104 and the scorer eval baseline reads 157 full corpus, 50 holdout and 20 ambiguity cases.
- **SC-003**: The design-document prompt returns sk-doc first and a single `sk-create-quality-control` route.
- **SC-004**: The chart-colour prompt returns sk-design first and a single `sk-design-chart` route.
- **SC-005**: The five protected routes keep their prior selection.
- **SC-006**: The v4.0.1.0 entry names the retirement and the tag is republished.
- **SC-007**: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The built advisor runtime and its labeled corpus | The scorer change cannot be measured without a build | Run `npm run build` before the parity and live replays |
| Dependency | The sk-doc and sk-design routing metadata and their compiled manifests | A stale manifest hides each vocabulary change | Run the compiled-route and parent-skill checks after the metadata edits |
| Risk | The two new routes have thin margins of 0.007 and 0.020 | High | Record both replays and the five protected routes and rerun them on any later vocabulary edit |
| Risk | The v4.0.1.0 tag is republished over an existing release | High | Update the entry before the tag move and confirm the published release body matches the entry |
| Risk | The advisor suite keeps one legacy failure | Low | Compare it with main and record that it is the same legacy pin |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. A route replay is one process per prompt and adds no service path.
- **NFR-P02**: N/A. The scorer runs one prompt at a time and adds no throughput path.

### Security
- **NFR-S01**: N/A. The change adds no credential and no auth surface.
- **NFR-S02**: N/A. The edited files hold no user data.

### Reliability
- **NFR-R01**: N/A. No uptime target applies to a scorer and a release entry.
- **NFR-R02**: N/A. The parity set, the route replays and the packet gate return a pass or fail verdict.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: A prompt with no write verb and no doc word keeps its current score and earns no write-doc-surface boost.
- Maximum input: A prompt that carries a write verb and a doc word inside a negated phrase earns no boost. The four negated test prompts cover both apostrophe forms, `do not edit` and `without changing`.
- Failure path: A missing runtime build leaves the old scorer in place, so rr-iter3-146 returns the old sk-doc route and the parity set blocks.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two scorer files, three routing metadata files and one release entry |
| Risk | 7/25 | Thin route margins and a republished tag, with no auth or data path |
| Research | 5/20 | The operator decisions and the labeled case already name the cause and the fix |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator fixed the four decisions on 2026-11-05.
<!-- /ANCHOR:questions -->

---
