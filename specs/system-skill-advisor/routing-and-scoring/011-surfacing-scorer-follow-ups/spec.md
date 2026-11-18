---
title: "Feature Specification: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check"
description: "Eight advisor surfacing gaps were reported by a project that vendors Skilled. Four are fixed and tested. Two are closed on a recorded verdict with no code change, and two are closed by operator decision to keep current behavior."
trigger_phrases:
  - "surfacing scorer follow ups"
  - "fix eight skill and command surfacing gaps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `worktrees/470-surfacing-scorer-follow-ups`, then `worktrees/472-vendored-layout-and-scorer-fixes` for the second round |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A project that vendors Skilled measured the advisor on its own prompts and reported eight surfacing gaps. Command phrases matched only exact wording, and a skill name inside a hyphenated word could win the route. Ticket-status wording went to code review, and command bridges were compiled in, so an overlay needed a deriver run and a rebuild.

A second report on 2026-11-18 raised four more advisor items. A Figma fetch went to sk-code, and a doctor command that outscored its owner skill still listed second. A short prompt with one clear winner returned nothing when a rival only reached the confidence floor, and the CLI JSON never filled `laneContributions`. The operator chose to fix all four. Measured here, the command-order fix would have flipped a designed skill-first policy for 12 doctor prompts, so the operator kept skill-first. The short-prompt fix went in with one refinement.

### Purpose
Success means the four first-round gaps and three second-round items are fixed and tested, and the remaining claims are closed with a recorded verdict or operator decision.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Command: the advisor vitest suite on clean origin/main `9cda2018330`. The exact command line was not kept. The output below is copied from `scratch/advisor-baseline.txt`. It was not re-run for this packet.

```text
Advisor vitest baseline on clean origin/main 9cda2018330 (2026-11-17):
 Test Files  3 failed | 182 passed (185)
      Tests  6 failed | 2389 passed | 8 skipped (2403)
 FAIL  tests/cli-exit-taxonomy.vitest.ts > skill-advisor CLI exit taxonomy > accepts semantic and embeddings health options for advisor_status
 FAIL  tests/hooks/vibe-prompt-advisor.vitest.ts > Vibe prompt advisor with the real advisor > names the git skill and its doctor follow-up for a hooks prompt
 FAIL  tests/hooks/vibe-prompt-advisor.vitest.ts > Vibe prompt advisor with the real advisor > names the readme command for a documentation prompt
 FAIL  tests/skill-advisor-cli-job-semantics.vitest.ts > skill-advisor CLI rebuild and scan job semantics > keeps status trust-state, shadow telemetry, and scan embedder reporting visible through the CLI
 FAIL  tests/skill-advisor-cli-job-semantics.vitest.ts > skill-advisor CLI rebuild and scan job semantics > reports rebuild mutation wall-time, before/after generation, and successful exit status
 FAIL  tests/skill-advisor-cli-job-semantics.vitest.ts > skill-advisor CLI rebuild and scan job semantics > wraps skill_graph_scan as a trusted progress-reporting job with generation before and after
```

The work record calls these six failures load-flaky. They passed on later runs.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make command bridge phrases match close wording, with a lower score for the looser match.
- Stop a single-word phrase from matching inside a hyphenated name.
- Skip the `review` token boost for ticket-status wording.
- Load the command bridges from the generated JSON at runtime, with the compiled block as fallback.
- Record a verdict for the two claims closed with no code change.
- Second round: send a read from a design tool (Figma, Refero, Mobbin) to mcp-tooling, and skip the `dashboard` boost on such prompts.
- Second round: on a short low-information prompt, a rival that only reached the confidence floor no longer ties a real top into abstention, unless a passing command matched one of its own full phrases.
- Second round: record the operator decision to keep doctor commands below their skills.
- Second round: fill `laneContributions` in the CLI JSON beside `laneBreakdown` when attribution is requested.

### Out of Scope
- Changes to the native index freshness check. The claim is not confirmed for the native scorer, and that verdict is inferred, so no code changes.
- The record-base vendored layout and the overlay-engine loss reports from the second report. They belong to `specs/system-skilled-doctor/001-skill-and-overlay-build/016-vendored-record-base-and-overlay-loss-reports`.
- Deep-research state log route-proof fields. They belong to `specs/system-deep-loop/loop-architecture/005-state-log-route-proof`, a separate packet.
- Paraphrases with different words, such as "bring our skilled copy up to date with upstream." Token tolerance does not reach them, so they still need phrase overlays.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Phrase tolerance for command rows, the hyphen rule for single-word phrases, and the review boost skip for ticket-status wording. |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Modify | Sets the command bridge constant from the loader, with the compiled block as fallback. |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/command-bridge-loader.ts` | Create | Renders the generated bridge JSON the way the deriver renders the compiled block. Returns null when the file is missing or malformed. |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/command-phrase-tolerance.vitest.ts` | Create | Four tests for command phrase tolerance. |
| `.skilled/skills/system-skill-advisor/runtime/tests/name-mention-scoring.vitest.ts` | Modify | A new describe block with three tests for keywords inside hyphenated names. |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/review-status-wording.vitest.ts` | Create | Two tests for ticket-status wording and the review boost. |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/command-bridge-loader.vitest.ts` | Create | Three tests for the bridge loader. |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Second round: the design-tool read rule and the `dashboard` boost skip. |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | Second round: tells the short-prompt rule, in both scoring passes, when a passing command matched its own full phrase. |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` | Modify | Second round: a floor-only rival no longer ties a real top into abstention. |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modify | Second round: `laneContributions` beside `laneBreakdown` with attribution. |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modify | Second round: the output schema allows `laneContributions`. |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/dashboard-design-source.vitest.ts` | Create | Second round: four tests for the boost skip and design-tool reads. |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/advisor-quality-049-003.vitest.ts` | Modify | Second round: the floor-only test now pins the new rule, two tests keep the slip-through guard, and one covers the phrase-command case. |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts` | Modify | Second round: `laneContributions` appears only with attribution and equals `laneBreakdown`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A command bridge phrase with three or more content words also matches when a prompt carries all of its content words and the phrase's leading word, inside a window of phrase length plus 2 content words. The match scores at 0.85 times the phrase specificity. Skill rows keep exact matching. |
| REQ-002 | A single-word phrase does not match when a hyphen joins it to another word on either side. A phrase with its own hyphen still matches as written. |
| REQ-003 | The `review` token boost is skipped when the prompt has status wording, such as `in review`, `to review` or `into review`, or the word `status` before `review`, and the prompt also has a tracker noun such as ticket, issue, task, card, story, ClickUp, Jira, Linear, kanban or column. Plain requests keep the boost. |
| REQ-004 | The command bridges load from `scripts/command-bridges/command-bridges.generated.json` in the advisor runtime folder at runtime. The compiled block stays as fallback when the file is missing or malformed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Superseded by REQ-011 under ADR-001. It kept the wide-cluster floor as it was. |
| REQ-006 | The command ranking keeps its current behavior. The command tie-break recorded at `specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md` line 143 stays, and the command is still offered. Kept by the operator on 2026-11-17 and again on 2026-11-18. No code change. |
| REQ-007 | Determine and record a verdict, with its evidence, on whether a `SKILL.md` keywords edit makes the native index stale. Verdict: not confirmed for the native scorer. The verdict is inferred. No code change. |
| REQ-008 | Confirm and record that the CLI JSON carries per-lane scores on request. Verdict: already available through `advisor_recommend` with `"options":{"includeAttribution":true}`. No code change. |
| REQ-009 | A prompt that reads from a design tool, such as "get the dashboard design from figma", with no build verb, routes to mcp-tooling, and the `dashboard` boost is skipped when a design tool is named. "implement the dashboard from figma" stays with sk-code. |
| REQ-010 | Record the decision on the second report's command-order item. A doctor command that outscores its skill stays listed after it, because a lead-when-it-outscores rule flips 12 pinned doctor prompts (score leads 0.03 to 0.58) and no margin or ownership rule singles out the repin prompt. Kept by the operator on 2026-11-18. No code change. |
| REQ-011 | On a short low-information prompt whose top is a real match, a rival that only reached the confidence floor does not tie that top into abstention. When the prompt does abstain, the floor still covers the wide set, and a floored top still abstains. When a passing command matched one of its own full phrases word for word, the floor ties still count in both scoring passes, so "skill budget audit" keeps routing to `/doctor:skill-advisor skill-budget`. |
| REQ-012 | With `"options":{"includeAttribution":true}`, each CLI recommendation carries `laneContributions` with the same prompt-free numbers as `laneBreakdown`. Without the option, neither field appears. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After the four fixes, the advisor vitest suite passes with no failed test, and `npm run build` exits 0.
- **SC-002**: The second-round fixes pass their new tests, the full advisor suite has no failed test, and the request's prompts route as its done-when lines say on the built CLI.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator decisions on the wide-cluster floor and command ranking | Decided on 2026-11-17 and 2026-11-18. The packet has no open dependency. | ADR-001 records both. |
| Risk | A read verb with "from figma" in a build request routes to mcp-tooling. | Low | Any build verb turns the rule off, and a test covers "implement the dashboard from figma". |
| Risk | A floored skill tops a vague prompt once a floor-only rival stops counting as a tie. | Low | The abstention still floors the whole wide set, and a floored top still abstains. Two tests pin both cases. |
| Dependency | Generated bridge JSON | A bridge edit reaches the scorer only after the deriver writes the file, and a running daemon needs a restart. | Document both steps for the owner of each overlay. |
| Risk | A loose phrase match surfaces a command for a prompt that shares most, but not all, of its words. | Med | The leading word must match. The window is capped at phrase length plus 2 content words. The score is multiplied by 0.85. A test covers a bare problem word beside a phrase-matched skill. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: the change runs inside the in-process advisor scorer. It adds no service, endpoint, credential or stored data, so no response time, throughput, auth, encryption, uptime or error-rate target applies.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a missing bridge JSON file returns null, and the compiled block is used.
- Maximum input: not measured. The work record has no result for a long prompt or a large bridge set.
- Failure path: a malformed bridge JSON file returns null, and the compiled block is used.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

N/A: the work record has no scope, risk or research scores for this packet, so no complexity total is claimed.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Wide-cluster floor: kept on 2026-11-17, changed on 2026-11-18 with the phrase-command refinement. ADR-001 records it.
- Command ranking: kept on 2026-11-17 and again on 2026-11-18. ADR-001 records why.
- Index freshness verdict: inferred, not tested. A native route change after a `SKILL.md` keywords edit would confirm it. This does not block closure.
<!-- /ANCHOR:questions -->

---
