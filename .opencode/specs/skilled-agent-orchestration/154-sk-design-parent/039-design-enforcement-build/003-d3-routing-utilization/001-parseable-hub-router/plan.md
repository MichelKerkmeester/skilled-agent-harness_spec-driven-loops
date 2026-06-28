---
title: "Implementation Plan: D3-R1 Parseable hub-router projection"
description: "Author a sibling sk-design/hub-router.json (routerPolicy + routerSignals + typed vocabulary classes) and add a surgical, additive router-replay.cjs reader so the parent hub parses to parseable:true with zero regression for every other skill."
trigger_phrases:
  - "parseable hub router plan"
  - "hub-router.json projection"
  - "router-replay sibling reader"
  - "d3-r1 plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/001-parseable-hub-router"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Confirm the plan against the delivered hub-router projection and reader branch"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D3-R1 Parseable hub-router projection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill data (JSON) + Node.js CommonJS (`.cjs`) benchmark tooling |
| **New artifact** | `.opencode/skills/sk-design/hub-router.json` (sibling routing projection) |
| **Reader change** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` (additive sibling-file branch in `parseRouter`) |
| **Identity source (unchanged)** | `.opencode/skills/sk-design/mode-registry.json` stays identity-only |
| **Verification** | `router-replay.cjs` CLI replay + before/after no-regression diff on existing skills |

### Overview
Today `router-replay.cjs` returns `parseable:false` on the `sk-design` parent hub. The hub's `## 2. SMART ROUTING` is prose ("registry-driven"), so there is no `INTENT_SIGNALS = {` / `RESOURCE_MAP = {` inline block and no referenced `references/smart_routing.md` to fall back to — the whole selection layer is unscored, and ~46.5% of raw hub keywords are uncovered/untyped. This plan projects the hub's routing intent into a NEW sibling `hub-router.json` carrying `routerPolicy`, `routerSignals` (per-mode weighted keyword groups), and typed vocabulary classes that assign every currently-untyped hub keyword to a class. A second deliverable teaches `router-replay.cjs` to read that sibling file and project it into the scorer's existing `intentSignals`/`resourceMap` shape so `parseable` becomes `true`. The reader change is strictly additive and gated on the presence of `hub-router.json`, so every other skill parses byte-identically to today. `mode-registry.json` is NOT touched — identity (`workflowMode`/`backendKind`/`packet`/`packetSkillName`/`advisorRouting`) stays where it is; only the prose default and multi-axis policy move into data.

**Open design decision resolved:** the router-policy home question from research (`mode-registry.json.router` vs a sibling `hub-router.json`) is RESOLVED in favour of the **sibling `hub-router.json`** file, per this phase's spec. The registry stays identity-only.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §1-§3; this plan §1)
- [x] Success criteria measurable (`parseable:true` + routes to expected mode + no regression)
- [x] Real targets read and the `parseable` decision point understood (`router-replay.cjs:166`)
- [x] Reader-change contract designed as additive + presence-gated (no other-skill impact)

### Definition of Done
- [x] `hub-router.json` authored with `routerPolicy` + `routerSignals` + typed vocabulary classes
- [x] `router-replay.cjs` reads the sibling projection; `parseable:true` for sk-design
- [x] Acceptance replay routes `"animate the menu"` to mode `motion`
- [x] No-regression diff: sk-code and design-interface parse exactly as before
- [x] `hub-router.json` + any SKILL.md text carry NO spec/packet/phase IDs or spec paths
- [x] Checklist items verified with evidence


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data-as-contract projection. The hub's routing decision is expressed as declarative data (`hub-router.json`), and the deterministic replay tool projects that data into the scorer's existing dictionary shape. The reader change follows the file's own established precedence ladder: **inline wins → referenced doc → (NEW) sibling `hub-router.json`** — only reached when the first two are absent.

### Key Components
- **`sk-design/hub-router.json`** (new) — `routerPolicy` (defaultMode, ambiguityDelta, tieBreak, outcomes: single|orderedBundle|defer), `routerSignals` (per-mode weight + class list), `vocabularyClasses` (canonical keyword sets, one home per keyword to avoid duplication/drift).
- **`router-replay.cjs` `parseRouter()`** (additive) — after the existing referenced-doc attempt, when the router is still empty and a sibling `hub-router.json` exists, project it into `intentSignals`/`resourceMap`/`defaultResource`, set `routerSource = 'hub-router.json'`, and let line 166 compute `parseable:true`.
- **`mode-registry.json`** (unchanged) — identity-only source of truth for `workflowMode`/`backendKind`/`packet`/`advisorRouting`.

### hub-router.json shape sketch (data contract)
```json
{
  "skill": "sk-design",
  "version": "1.0.0",
  "routerPolicy": {
    "defaultMode": "interface",
    "ambiguityDelta": 1,
    "tieBreak": ["interface", "foundations", "motion", "audit", "md-generator"],
    "outcomes": {
      "single": "one dominant design axis -> route to that mode",
      "orderedBundle": "clearly separate axes -> ordered mode list (e.g. interface then motion)",
      "defer": "no axis clears threshold and defaultMode is unsafe -> defer/disambiguate"
    },
    "defaultResource": ["shared/anti_slop_principles.md", "shared/cognitive_laws.md", "shared/design_token_vocabulary.md"]
  },
  "routerSignals": {
    "interface":    { "weight": 4, "classes": ["interface-build", "interface-taste"], "resources": ["design-interface/SKILL.md"] },
    "foundations":  { "weight": 4, "classes": ["foundations-tokens", "foundations-layout"], "resources": ["design-foundations/SKILL.md"] },
    "motion":       { "weight": 4, "classes": ["motion-temporal", "motion-aliases"], "resources": ["design-motion/SKILL.md"] },
    "audit":        { "weight": 4, "classes": ["audit-critique"], "resources": ["design-audit/SKILL.md"] },
    "md-generator": { "weight": 4, "classes": ["mdgen-extract"], "resources": ["design-md-generator/SKILL.md"] }
  },
  "vocabularyClasses": {
    "motion-temporal": { "keywords": ["animate", "animation", "transition", "micro-interaction", "choreography", "scroll animation", "hover effect"] },
    "motion-aliases":  { "keywords": ["animate this", "animate the menu", "micro-interactions", "transitions", "animatepresence", "exit animation", "reduced motion", "morphing icons", "motion performance"] },
    "interface-build": { "keywords": ["ui build", "redesign the ui", "hero section", "design variations", "frontend design"] },
    "interface-taste": { "keywords": ["make it look good", "looks templated", "visual identity", "polish", "premium ui", "aesthetic", "visual direction", "custom not templated"] }
  }
}
```
> Keyword sets above are illustrative seeds. The implementer MUST seed `routerSignals`/`vocabularyClasses` from `mode-registry.json` aliases PLUS the currently-untyped hub keywords (the `<!-- Keywords: ... -->` block in `sk-design/SKILL.md`) so the ~46.5% untyped keywords are each assigned to a typed class. `"animate the menu"` MUST resolve to `motion` (acceptance). Each keyword lives in exactly ONE `vocabularyClasses` entry (single home → no drift).

### Reader-change contract (router-replay.cjs)
Add a helper `projectHubRouter(filePath)` and a new presence-gated branch inside `parseRouter`, AFTER the existing referenced-doc block:
1. Trigger only when `inlineEmpty` is true, the referenced-doc attempt left the router still empty, and `fs.existsSync(path.join(skillRoot, 'hub-router.json'))`.
2. `projectHubRouter` parses the JSON and builds the scorer shapes:
   - `intentSignals[mode] = { weight: routerSignals[mode].weight ?? 1, keywords: <union of lowercased keywords from each class in routerSignals[mode].classes> }`. One intent per mode → `result.intents` reports the mode key directly (so "routes to the expected mode" holds and accumulation within a mode is additive in `scoreIntents`).
   - `resourceMap[mode] = routerSignals[mode].resources ?? []`.
   - `defaultResource = routerPolicy.defaultResource ?? []` (used only when the existing `defaultResource` is empty).
3. On success set `routerSource = 'hub-router.json'`; line 166 then computes `parseable:true` because `intentSignals` is non-empty.
4. Per-class weights/typed classes beyond the mode-level `weight` are retained in the JSON for the future gated `hubRoute` scorer lane (out of scope here); this projection collapses them to the scorer's flat `{weight, keywords}` shape.

### Data Flow (acceptance path)
1. `routeSkillResources({ skillRoot: sk-design, taskText: "animate the menu" })` calls `parseRouter`.
2. Inline dictionaries empty → referenced-doc lookup returns null (no `references/smart_routing.md`).
3. NEW branch: `hub-router.json` exists → `projectHubRouter` returns `intentSignals` keyed by mode.
4. Line 166: `parseable = true`.
5. `scoreIntents("animate the menu", ...)` → `motion` wins via the `motion-aliases`/`motion-temporal` keywords.
6. CLI prints `parseable:true`, `intents:["motion"]`, exit 0.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the projection data
- [x] Create `sk-design/hub-router.json` with `routerPolicy`, `routerSignals`, `vocabularyClasses`
- [x] Seed keywords from `mode-registry.json` aliases + untyped hub keywords; assign every keyword to one class
- [x] Confirm `mode-registry.json` is NOT modified (identity-only)

### Phase 2: Surgical reader change
- [x] Add `projectHubRouter(filePath)` helper to `router-replay.cjs`
- [x] Add the presence-gated branch in `parseRouter` after the referenced-doc block
- [x] Set `routerSource = 'hub-router.json'`; keep the change additive and backward-compatible

### Phase 3: Verification
- [x] Acceptance replay: `"animate the menu"` → `parseable:true`, routes to `motion`
- [x] No-regression: capture before/after parse output for sk-code and design-interface; assert identical
- [x] Evergreen scan: `hub-router.json` + any SKILL.md text contain no spec/packet/phase IDs or spec paths
- [x] Spot a non-motion prompt (e.g. "audit the design") routes to its expected mode


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Acceptance | sk-design hub parses + routes to expected mode | `node router-replay.cjs --skill .opencode/skills/sk-design --task "animate the menu"` |
| No-regression | Existing skills parse byte-identically | before/after `router-replay.cjs` JSON capture + `diff` on sk-code, design-interface |
| Static | No leaked IDs / one keyword home | `grep` evergreen scan; JSON parse sanity |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `router-replay.cjs` parse ladder (inline → ref → sibling) | Internal | Green | Reader branch has no insertion point |
| `mode-registry.json` aliases | Internal | Green | Lose primary keyword seed source |
| `sk-design/SKILL.md` keyword block | Internal | Green | Untyped-keyword coverage incomplete |
| `_args.cjs` CLI parser (`--skill`/`--task`) | Internal | Green | Acceptance command form unavailable |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: No-regression diff shows any existing skill's parse output changed, or sk-design fails to route correctly
- **Procedure**: Revert the `router-replay.cjs` branch (single additive block) and delete `sk-design/hub-router.json`; the system returns to today's `parseable:false` baseline with no other-skill side effects


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author data) ──> Phase 2 (Reader change) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author data | None | Reader change, Verify |
| Reader change | Author data | Verify |
| Verify | Author data, Reader change | None |


<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author hub-router.json (incl. keyword typing) | Medium | 1.5-2 hours |
| Surgical reader change | Low | 45 minutes |
| Verification (acceptance + no-regression) | Low | 45 minutes |
| **Total** | | **3-3.5 hours** |


<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Before-change parse output captured for sk-code and design-interface (baseline)
- [x] Change is presence-gated on `hub-router.json` (other skills cannot reach the new branch)
- [x] Acceptance + no-regression both green before any completion claim

### Rollback Procedure
1. **Reader**: revert the additive `projectHubRouter` helper + `parseRouter` branch in `router-replay.cjs`
2. **Data**: delete `.opencode/skills/sk-design/hub-router.json`
3. **Verify**: re-run `router-replay.cjs` on sk-code/design-interface → output matches the captured baseline

### Data Reversal
- **Has data migrations?** No (new sibling data file + additive reader branch only)
- **Reversal procedure**: file delete + code revert; no persisted state to unwind

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
