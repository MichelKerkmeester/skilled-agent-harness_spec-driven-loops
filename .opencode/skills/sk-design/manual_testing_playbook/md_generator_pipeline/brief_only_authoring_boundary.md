---
title: "MG-004: Brief-Only Authoring Boundary"
description: "Verify a brief-only DESIGN.md request with no live site to crawl stays inside md-generator's authoring-boundary contract instead of fabricating a measured token table."
version: 1.0.0.0
id: MG-004
expected_workflow_mode: md-generator
expected_leaf_resources:
  - workflow_mode: md-generator
    leaf_resource_id: references/design_md_format.md
  - workflow_mode: md-generator
    leaf_resource_id: references/writing_style_guide.md
  - workflow_mode: md-generator
    leaf_resource_id: references/authoring_boundary.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/cardinal_rules_card.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/source_of_truth_router_card.md
---

# MG-004: Brief-Only Authoring Boundary

## 1. OVERVIEW

This scenario verifies that a brief-only Style Reference request, with no live site to crawl, still resolves `md-generator` via its aliases but does not cross into forward-authoring: brief-supplied values must never land in an unlabeled Tokens table, and the response must cite the two dedicated authoring-boundary resources rather than silently handing the request to `foundations`.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator has only a written brief for a not-yet-built product and wants a `DESIGN.md` Style Reference before any site exists to crawl.

**Exact prompt**:
```text
Generate a DESIGN.md style reference for our new checkout product from this brief: primary blue #1a73e8, Inter font family, 8px spacing scale, and 12px rounded cards. We do not have a live site to crawl yet -- just the brief.
```

**Expected mode resolution**: `md-generator`.

**Why**:
- `mode-registry.json` lists `style reference`, `create design reference`, and `design-to-markdown` among the `md-generator` aliases; the prompt's `DESIGN.md style reference` phrasing matches on `style reference` alone.
- `hub-router.json` maps `md-generator-aliases` keyword `style reference` and `md-generator-artifacts` keywords `design.md` and `style-reference` to `md-generator`.
- `design-md-generator/SKILL.md`'s Smart Router `INTENT_SIGNALS` scores `EXTRACT_WRITE` on the prompt's `generate`, `design.md`, and `design system`-adjacent keywords, so the router still resolves this mode by default rather than falling through to `foundations`.
- The same `SKILL.md`'s Resource Loading Levels table has a CONDITIONAL row keyed exactly to this case — "A value's origin is unclear (brief vs measured), **or a brief-only request with no live site**" — that loads `references/authoring_boundary.md` and `assets/source_of_truth_router_card.md` before any value is written.
- `SKILL.md` Section 1 "When NOT to Use" states that authoring a Style Reference from a brief alone with no live site is forward-authoring and OUT OF SCOPE for this mode, routed to a separate design-spec decision rather than satisfied by loosening fidelity.

**Expected packet loaded**:
- `design-md-generator/SKILL.md`

**Expected shared resources loaded or cited**:
- UNKNOWN. The boundary check is scoped to the md-generator packet.

**Expected mode resources loaded or cited**:
- `design-md-generator/references/design_md_format.md`
- `design-md-generator/references/writing_style_guide.md`
- `design-md-generator/assets/cardinal_rules_card.md`
- `design-md-generator/references/authoring_boundary.md`
- `design-md-generator/assets/source_of_truth_router_card.md`

**Expected pipeline stage named**:
- None. `EXTRACT_WRITE` intent is scored by keyword match, but Phase 1 `EXTRACT` (crawl) never runs because no live URL is present, and Phase 2 `WRITE` never renders a Tokens table from the brief. The authoring-boundary check intercepts before any stage produces artifacts.

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. No `/tmp/skd-MG004/` fixture artifacts exist beforehand; this scenario intentionally supplies no live URL and no prior `tokens.json`.
2. No mock server or live site is stood up for the "checkout product" — the absence of a crawlable target is the condition under test, not a setup gap to fill.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MG004-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, cited resources, and the full boundary response (request-for-URL or explicit out-of-scope statement) in `/tmp/skd-MG004-response.txt`.
4. Confirm no `tokens.json` or `DESIGN.md` file was written anywhere in `/tmp/skd-MG004/` or elsewhere.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, mode is `md-generator`, packet is `design-md-generator/SKILL.md`, the response cites both `references/authoring_boundary.md` and `assets/source_of_truth_router_card.md`, every brief-supplied value (`#1a73e8`, `Inter`, `8px`, `12px`) appears only as labeled brief-provided prose and never as an unlabeled Tokens-table entry, and the response either asks for a live URL to extract from or explicitly states — per `SKILL.md` Section 1 — that brief-only authoring is out of scope and names the separate design-spec decision (or `foundations`) as where that routes.
- **FAIL** iff any brief value appears unlabeled in a Tokens table, iff `extract.ts` or `Write` is invoked to fabricate `tokens.json` from the brief values, or iff the mode silently defers to `foundations` without naming the boundary.

### Failure Triage

1. If a brief value appears unlabeled in a token table, inspect the cardinal fidelity rule in `design_md_format.md` Section 0 and the pre-write gate in `assets/cardinal_rules_card.md`.
2. If neither `references/authoring_boundary.md` nor `assets/source_of_truth_router_card.md` is cited, inspect the Resource Loading Levels CONDITIONAL row for "brief-only request with no live site" in `design-md-generator/SKILL.md`.
3. If the mode defers to `foundations` without comment, inspect `SKILL.md` Section 1 "When NOT to Use" and the Section 2 routing line "Do not route brief-only token-system authoring here; that belongs to `foundations`" for how the deferral must name the boundary, not happen silently.
4. If `tokens.json` or `DESIGN.md` is written despite no live URL, stop and treat as a cardinal-rule breach; inspect the Phase 1 `EXTRACT` tool-readiness check for a missing live-URL precondition.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md`
- `.opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No — the scenario asserts no `tokens.json` or `DESIGN.md` write occurs
- **Sandbox**: `/tmp/skd-MG004/`
- **Concurrent-safe**: No
- **Last validated**: pending manual run
