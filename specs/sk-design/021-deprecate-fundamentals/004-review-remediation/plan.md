---
title: "Implementation Plan: Phase 4: review-remediation"
description: "Route the visual-review vocabulary to both sk-code modes, correct the metadata and the two completed packet rows and fold the two lost reference rules back into their files, then prove the result with the router replays, the canary harness and the packet gate."
trigger_phrases:
  - "review remediation plan"
  - "deep review findings fix plan"
  - "sk-code routing vocabulary plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON and CommonJS routing assets |
| **Framework** | Skilled skill hubs `sk-code` and `sk-design` with a compiled route manifest |
| **Storage** | None |
| **Testing** | `compiled-route.cjs`, the canary harness, `verify-router-sync.cjs`, `parent-skill-check.cjs`, `validate_document.py` and `validate.sh --strict` |

### Overview
Repair the nine findings the deep review recorded, in the order the review ranked them. The routing fixes add two phrases to one keyword class and one load set, the metadata fixes replace ten stale signals and three stale descriptions, and the guidance fixes restore two rules the retirement dropped. Every fix is proved by a command the review named, and the packet gate decides closure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "design review"` prints `selectionKind":"surfaceBundle"` with `sk-code-review` and `sk-code-frontend`
- [ ] `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` exits 0 with the three new cases
- [ ] `node .skilled/bin/compiled-route-sync.cjs --check` exits 0 and `--verify` exits 0
- [ ] `python3 .skilled/skills/sk-doc/scripts/validate_document.py <file>` reports VALID 0 issues on the two edited references
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals --strict --recursive` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Vocabulary repair with a manifest remint.

### Key Components
- **The hub vocabulary**: `hub-router.json` scores each mode from its keyword class and decides which surface bundles beside the winning workflow.
- **The router mirrors**: `sk-code-frontend/ROUTER.md` and the root `sk-code/ROUTER.md` carry the stage-two intent keywords and load sets the compiler reads.
- **The canary fixture**: Records the expected route for each new phrase so a later tie-break change cannot regress it.
- **The two reference files**: Hold the shadow animation pitfall and the session expiry rule that the retired guidance lost.
- **The packet gate**: Runs the validator set and decides whether the phase may close.

### Data Flow
A prompt enters `compiled-route`, the hub scores every mode from its keyword class and a mode that lands within `ambiguityDelta` 1 of the top score bundles its surface beside the winner. The compiled route is served from the sk-code manifest rather than read live from the router, so the manifest remint is what makes a vocabulary edit visible to a replay.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section because the phase plans from a deep-review CONDITIONAL verdict with one P1 and eight P2 findings.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-code/hub-router.json` | Owns the `code-frontend-visual` keyword class and the tie budget | update | The four replays print `selectionKind":"surfaceBundle"` with both modes |
| `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | Owns the stage-two `WEB_VISUAL_HIERARCHY` keywords and load set | update | `verify-router-sync.cjs` passes and the keyword line names both new phrases |
| `.skilled/skills/sk-code/ROUTER.md` | Mirrors the frontend intent and `RESOURCE_MAP` for the root | update | `verify-router-sync.cjs` passes and `rg -n 'web-accessibility-patterns'` prints the prose and map rows |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Records the expected route for each prompt | update | `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` exits 0 |
| The authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` | Archive copy of the served cases | update | `diff` against the served fixture prints no difference |
| `.skilled/skills/sk-design/graph-metadata.json` | Advertises the design hub intent signals | update | `parent-skill-check.cjs .skilled/skills/sk-design` reports OK and the ten old phrases print no line |
| `.skilled/skills/sk-code/SKILL.md` | Describes each sk-code surface to a reader | update | `rg -n 'tokens.css'` prints the surface row, the surface list and the layout comment |
| `.skilled/skills/sk-code/description.json` | Carries the hub description and its date | update | `rg -n '2026-11-05'` prints the date and `parent-skill-check.cjs` reports OK |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Serves the compiled route policy | update | `compiled-route-sync.cjs --check` exits 0 and `--verify` exits 0 |
| `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md` | Records what phase 2 changed | update | `rg -n 'node-to-token-markup'` prints no line |
| `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md` | Records the phase 1 routing proof | update | `rg -n 'AC-005'` prints one row that names the five prompts |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md` | Owns V20 and the five elevation set | update | `validate_document.py` reports VALID 0 issues |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md` | Owns M33 and the motion bands | update | `validate_document.py` reports VALID 0 issues |

Required inventories:
- Same-class producers: `rg -n 'design review|review this design|WEB_VISUAL_HIERARCHY' .skilled/skills/sk-code` lists every place the visual-review vocabulary and its load set appear before the edit.
- Consumers of the changed vocabulary: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<phrase>"`, the canary harness and `ci-router-vocabulary-reach.cjs`.
- Matrix axes: phrase (four), surface (`code-frontend-visual` and `WEB_VISUAL_HIERARCHY`) and document (`hub-router.json` plus both router mirrors). The canary matrix adds case shape (single frontend or surfaceBundle) and three prompts.
- Algorithm invariant: a mode scores distinct keyword hits times weight 4 and bundles only within `ambiguityDelta` 1 of the top score. The adversarial cases are a prompt that hits a review keyword and no visual keyword (stays single) and a prompt that hits both (bundles).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the four phase checkboxes and task state. WS-1 repairs the visual-review routing reach, WS-2 repairs the metadata and the two completed packet rows, WS-3 restores the lost guidance and the gate task remints the manifest and runs the full validator set.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The four route replays and the three canary cases | `compiled-route.cjs` and `node --test` |
| Integration | Both router mirrors, the compiled manifest and the two hubs | `verify-router-sync.cjs`, `compiled-route-sync.cjs` and `parent-skill-check.cjs` |
| Manual | Each edited document read against the finding it fixes | Read, no browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `compiled-route.cjs` and the sk-code manifest | Internal | Green | No replay and no proof that a phrase reaches the frontend surface |
| The canary harness at `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Internal | Green | The three new cases cannot guard against a later tie-break change |
| `parent-skill-check.cjs`, `validate_document.py` and `validate.sh` | Internal | Green | No metadata verdict and no document or packet verdict |
| Node 22 and Python 3 in the repository | Internal | Green | The harness and the validators cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A replay returns a wrong mode for a prompt the canary does not cover, or the packet gate reports an error in an edited file.
- **Procedure**: Revert the phase commit and remint the manifest from the reverted router. Git history keeps the prior vocabulary and the prior fixture.
<!-- /ANCHOR:rollback -->


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
WS-1 ──► Gate run
WS-2 ──► Gate run
WS-3 ──► Gate run
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WS-1 visual-review routing reach | None | Gate run |
| WS-2 metadata and packet accuracy | None | Gate run |
| WS-3 lost guidance and session guidance | None | Gate run |
| Gate run | WS-1, WS-2 and WS-3 | Phase close |
<!-- /ANCHOR:phase-deps -->

---
