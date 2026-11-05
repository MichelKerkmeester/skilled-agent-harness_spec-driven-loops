---
title: "Implementation Plan: Phase 5: advisor-negation-and-routing"
description: "Teach the advisor explicit lane to ignore a negated write, add the design-document and chart-colour phrases to the modes that own them and reopen the v4.0.1.0 release entry, then prove each step with the scorer test, the parity set, the route replays and the packet gate."
trigger_phrases:
  - "advisor negation and routing plan"
  - "negated write scorer plan"
  - "borderline route plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: advisor-negation-and-routing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript advisor runtime and JSON routing assets |
| **Framework** | Skilled skill hubs `sk-doc` and `sk-design` with a compiled route manifest |
| **Storage** | None |
| **Testing** | vitest, the parity set, the scorer eval baseline, the live advisor replay, `compiled-route.cjs`, `parent-skill-check.cjs` and `validate.sh --strict` |

### Overview
Guard the explicit lane against a negated write, then add the two phrases that send a design-document review to `sk-doc` and a chart-colour review to `sk-design`. Rebuild the runtime and replay every prompt to prove the new scores and the five protected routes. Reopen the v4.0.1.0 entry after the routing work is proved and republish its tag.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run tests/scorer/negated-write-surface.vitest.ts` exits 0 in the advisor runtime
- [ ] The live advisor returns sk-code first for rr-iter3-146 and the two borderline prompts return sk-doc and sk-design first
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` and the same check on `.skilled/skills/sk-design` print OK
- [ ] The v4.0.1.0 entry names the retirement and the tag is republished
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/005-advisor-negation-and-routing --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scorer guard and vocabulary additions.

### Key Components
- **The explicit lane**: Scores each prompt and adds the write-doc-surface boost.
- **The negation test**: Pins the affirmed and negated behavior with seven prompts.
- **The sk-doc routing metadata**: Owns the design-document phrase and the quality-control alias class.
- **The sk-design routing metadata**: Owns the two chart-colour phrases.
- **The release entry**: Records the branch work in v4.0.1.0.

### Data Flow
A prompt reaches the advisor and the explicit lane adds the write-doc-surface boost only when an affirmed write phrase co-occurs with a doc word. A prompt reaches a hub and the intent signals and trigger phrases select the mode, then the compiled manifest serves that selection.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section because the phase fixes a labeled routing regression and two borderline routes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Owns the write-doc-surface boost | update | The negated-write test passes and rr-iter3-146 returns sk-code first |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/negated-write-surface.vitest.ts` | Records the affirmed and negated cases | create | Three affirmed and four negated prompts pass |
| `.skilled/skills/sk-doc/graph-metadata.json` | Advertises the hub intent signals and derived trigger phrases | update | `parent-skill-check.cjs` reports OK and the design-document replay returns sk-doc |
| `.skilled/skills/sk-doc/hub-router.json` | Owns the quality-control alias class | update | The replay returns a single `sk-create-quality-control` route |
| `.skilled/skills/sk-doc/ROUTER.md` | Owns the stage-two `DOC_QUALITY` intent | update | The intent is present and the route replay passes |
| `.skilled/skills/sk-design/graph-metadata.json` | Advertises the derived trigger phrases | update | `parent-skill-check.cjs` reports OK and the chart-colour replay returns sk-design |
| `.skilled/changelog/skilled/v4.0.1.0.md` | Records the release impact | update | Open design values point at `sk-code-frontend` and the tag is republished |
| The five protected prompts | Read the routing vocabulary | unchanged | The replay keeps their prior selection |
| Every advisor lane other than the explicit lane | Read the scorer | not a consumer | `rg -n 'NEGATED_WRITE|affirmedWriteText'` finds no other lane |

Required inventories:
- Same-class producers: `rg -n 'write-doc-surface|affirmedWriteText|NEGATED_WRITE' .skilled/skills/system-skill-advisor/runtime/lib/scorer` lists the explicit lane and no other lane.
- Consumers of the changed scorer: `rg -n 'scoreExplicitLane|write-doc-surface' .skilled/skills/system-skill-advisor/runtime/tests` lists the new test and the parity set.
- Matrix axes: negation form (don't, don’t, do not, never, without) and write-surface test (three tests). The test rows are three affirmed and four negated prompts.
- Algorithm invariant: a negated write phrase contributes no write-doc-surface boost and an affirmed phrase still does. The adversarial cases are both apostrophe forms, `do not edit` and `without changing`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Negation fix, Borderline routes, Release notes and Verification task state. The first three workstreams are proved and the release notes task stays open.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The seven negated-write prompts and the parity set | vitest |
| Integration | The live advisor, the two hub replays, the eval baseline and the parent-skill checks | Node scripts and `compiled-route.cjs` |
| Manual | The v4.0.1.0 entry read against the retirement | Read, no browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node and npm in the advisor runtime | Internal | Green | No build and no test run |
| The labeled corpus and the parity fixtures | Internal | Green | No accuracy proof |
| The sk-doc and sk-design routing metadata and compiled manifests | Internal | Green | No route proof |
| The v4.0.1.0 tag publish permission | External | Yellow | The release entry stays local and the tag stays at `10474a9567` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The negation fix moves an affirmed prompt away from sk-doc or one of the five protected routes changes selection.
- **Procedure**: Revert the commit, run `npm run build` in the advisor runtime and rerun the parity set and the two replays. For the release, restore the prior entry and republish the tag at `10474a9567`.
<!-- /ANCHOR:rollback -->


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Negation fix ──► Verification
Borderline routes ──► Verification
Release notes ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Negation fix | None | Verification |
| Borderline routes | None | Verification |
| Release notes | Negation fix and borderline routes | Verification |
| Verification | All three workstreams | Phase close |
<!-- /ANCHOR:phase-deps -->

---
