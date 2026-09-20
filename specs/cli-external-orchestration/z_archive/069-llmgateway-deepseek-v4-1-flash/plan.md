---
title: "Implementation Plan: The DevPass DeepSeek route moves to V4.1 Flash"
description: "Probe the gateway first so the replacement is chosen on evidence, then move the one literal through the runtime, the two skill rosters and the Pi config, letting the test suites prove the three copies of the effort pin agree."
trigger_phrases:
  - "implementation plan"
  - "gateway route repoint approach"
  - "probe before wiring"
  - "effort pin three copies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: The DevPass DeepSeek route moves to V4.1 Flash

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS runtime, Markdown rosters, JSON runtime config |
| **Framework** | The deep-loop external-CLI fan-out, vitest |
| **Storage** | None |
| **Testing** | Two vitest suites, plus live calls against the gateway |

### Overview
The route is probed before anything is wired, because the whole failure is that a documented route stopped existing without anyone noticing. Three calls settle it: the retired id, the candidate, and the candidate under the effort tier the pin forces. Only then does the literal move, and it moves in the runtime first because that is what dispatches, then through the rosters that describe it. The rosters carry what the probe returned rather than what the old row said.

The reopened pass runs the same shape on two routes at once, and the shape is what exposed the difference between them. `opencode-go` probed clean on every axis, so it moves completely, including the cli-opencode mode default. `cline-pass` produced a listing and nothing else, so it moves in the rosters and the config while the row itself says it is unproven and names the fallback. The rule the pass follows: a route that cannot be dispatched is documented as such, never promoted to verified to satisfy a premise.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The candidate confirmed live on the account that will use it
- [x] The forced effort tier confirmed non-erroring before the pin is pointed at it
- [x] The operator's scope confirmed as gateway-only for the first pass, then reopened on 2026-09-11 to include the two sibling DeepSeek routes (ADR-001)

### Definition of Done
- [x] All acceptance criteria met
- [x] Both deep-loop suites pass
- [x] Both skills carry a changelog entry and the anchors follow
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One literal, four wiring points, three descriptions. The literal is the unit of change because one literal maps to one provider, which is what keeps four routes to the same model family apart.

### Key Components
- **The allowlist** decides whether a dispatch is refused before it leaves
- **The provider map** composes the two-segment selector the gateway requires
- **The default** is what an omitted model resolves to, which is where the breakage was
- **The effort pin** forces a tier, so it must name a tier the route has

### Data Flow
A lineage names a model, or does not. The default fills the gap, the allowlist admits it, the provider map prefixes it and the pin sets its effort. The composed selector reaches the gateway, which either serves it or, as here, answers `410`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The gateway's deactivation is the producer. Everything below described or dispatched the id it removed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-run.cjs` allowlist, provider map, default, pin | Builds the dispatch synchronously | Updated | `fanout-run.vitest.ts`, 121 tests |
| `executor-config.ts` | The source of record the script mirrors | Updated | `executor-config.vitest.ts`, 92 tests |
| A private pin regex inside `fanout-run.vitest.ts` | A third copy of the pattern | Updated | It failed first, which is how it was found |
| `.pi/models.json` | Declares the model to the Pi runtime | Updated with measured context, ceiling and rates | Values read from the gateway listing |
| `.pi/settings.json` | The picker entry | Updated | Named in the setup doc |
| `.pi/custom-providers.md` | Gateway setup and verification | Updated | Its own round-trip commands now name a live id |
| Both skills' roster sections | What a dispatcher reads before choosing | Updated | No live reference to the retired id survives |
| The `opencode-go` and `cline-pass` DeepSeek literals | Different routes to the same family | **Updated in the reopened pass.** `opencode-go` moved completely and is dispatch-verified; `cline-pass` moved in the rosters and config and is marked listing-only, with its blocker and fallback named | Live dispatch on `opencode-go`; Cline's own model listing plus the known-good control that proves the quota block on `cline-pass` |
| The OpenRouter literals | A different route to the same family | Not a consumer, deliberately unchanged | Distinct strings, confirmed by the scan |

Required inventories:
- Live references to the retired id: `rg -n 'llmgateway/deepseek-v4-flash-vision-exp' .opencode .pi`, changelogs excluded because they record what was true.
- Copies of the pin pattern: `rg -n 'deepseek-v4-flash\(-latest' .opencode`.
- Algorithm invariant: one literal maps to exactly one provider. A literal that looks like another route's is still a different route, so a replacement must move one string and leave its lookalikes alone.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live probe | Route existence, id shape, effort acceptance | Direct calls to the gateway |
| Unit | Command construction, allowlist, default, pin | `fanout-run.vitest.ts`, `executor-config.vitest.ts` |
| Repository | Version conformance across every authored doc | `check-frontmatter-versions.sh` |
| Scan | No live surface names the retired id | ripgrep, changelogs excluded |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The gateway account | External | Green | Without a key the route cannot be probed, and a listing alone would not have caught the `410` |
| `frontmatter-version.mjs` | Internal | Green | Reconciles the two edited rosters to their new anchors |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fan-out lineage failing to dispatch on the new route
- **Procedure**: `git revert` the commit. Rolling back restores a route the gateway answers `410` for, so the real fallback is a different live model rather than the previous state
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Probe ──► Runtime ──► Rosters and config ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Probe | None | Runtime |
| Runtime | Probe | Rosters and config, Verify |
| Rosters and config | Probe | Verify |
| Verify | Runtime, Rosters and config | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Probe | Low | Four calls |
| Runtime | Medium | Four wiring points across two mirrored files |
| Rosters and config | Medium | Twelve prose edits that must each stay true |
| Verification | Low | Two suites, one gate, one scan |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every touched file is tracked
- [x] The replacement route confirmed live before the old one was removed
- [ ] Feature flag configured. Not applicable, the model id is the switch

### Rollback Procedure
1. `git revert` the commit
2. Re-run both deep-loop suites to confirm the previous state returned
3. Note that the reverted state dispatches at a deactivated id, so a revert is a stopgap and not a fix

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
