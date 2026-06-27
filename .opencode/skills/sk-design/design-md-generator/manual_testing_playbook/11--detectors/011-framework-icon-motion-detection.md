---
title: "DETECT-001 -- Framework, Icon, And Motion Detection"
description: "Validates that framework-detect.ts, icon-detect.ts, motion-extract.ts, and design-boundary-detect.ts populate their tokens.json sections with measured data or honest absence markers. Tests inline detector enrichment during extraction and confirms no detector fabricates data."
version: 1.0.0.6
expected_intent: EXTRACT_WRITE
expected_resources:
  - references/design_md_format.md
  - references/extraction_workflow.md
---

**Exact prompt**

```
What framework, icons, and motion did the extractor detect?
```

# DETECT-001 -- Framework, Icon, And Motion Detection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DETECT-001`.

---

## 1. OVERVIEW

This scenario validates the four remaining feature detectors for `DETECT-001`. During Phase 1 extraction, `framework-detect.ts` detects Tailwind utility classes, UI framework markers (Material UI, Chakra, Ant Design, Bootstrap, Radix UI, shadcn/ui, Headless UI), and design-system URLs. `icon-detect.ts` identifies icon libraries (lucide, heroicons, phosphor, feather, material-icons, font-awesome), measures stroke widths and size distributions, and classifies color modes (currentColor, fixed, mixed). `motion-extract.ts` captures transition durations, easing functions, and keyframe animation types. `design-boundary-detect.ts` compares multi-page token groups and reports a `relationship` classification (unified/shared-foundation/independent) with dimension scores. Each detector must populate its output field when data exists and record honest absence when it does not: framework lands in `tokens.json` `meta.framework`, icons in `tokens.json` `iconSystem`, motion in `tokens.json` `motionSystem`, and the design boundary in the sibling `extraction-report.json` `designBoundary` (it is a report-level field, not a `tokens.json` field).

### Why This Matters

Detectors are the enrichment layer of the extraction pipeline. If a detector crashes, extraction fails. If a detector fabricates data when none exists, the v3 Style Reference propagates false claims (e.g., "uses Material UI" on a raw HTML page, or "icon system: lucide" on a site with no icons). If a detector finds real data but fails to write it, the Style Reference loses actionable information. Detector mechanics are unchanged by the v3 output format. Each detector runs inline during extraction; a silent failure in any one can poison tokens.json without the operator noticing.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `DETECT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm all four detectors run during extraction and write populated or honestly-empty fields to tokens.json
- Real user request: `What framework, icons, and motion did the extractor detect?`
- Prompt: `What framework, icons, and motion did the extractor detect?`
- Expected execution process: run a full extraction, then inspect `tokens.json` for `meta.framework`, `iconSystem`, and `motionSystem`, and inspect the sibling `extraction-report.json` for `designBoundary`, verifying each field is present and contains either populated sub-fields or honest null/empty markers — never fabricated data
- Expected signals: `tokens.json` has a `meta.framework` object with `tailwind` (null or TailwindResult), `uiFramework` (null or string), `designSystemUrl` (null or URL); a top-level `iconSystem` (null or IconSystemInfo with `library`, `sizeScale`, `strokeWidth`, `colorMode`, `totalCount`); a top-level `motionSystem` (null or MotionSystem with `durationScale`, `primaryTimingFunction`, `keyframeAnimations`). The `extraction-report.json` written next to it carries a `designBoundary` object with `relationship`, `overallSimilarity`, and `dimensionScores` (design boundary is a report-level field, not a `tokens.json` field)
- Desired user-visible outcome: the agent reports which framework, icon system, motion tokens, and design boundary the detectors found, with explicit notes for any detector that returned null
- Pass/fail: PASS if extraction exits 0 AND `tokens.json` contains `meta.framework`, `iconSystem`, and `motionSystem` AND `extraction-report.json` contains `designBoundary`, with no fabricated data; FAIL if any detector field is missing entirely OR a detector fabricates data (e.g., claims Tailwind on a Bootstrap site) OR extraction crashes because of a detector error

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Detector checks stay local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001) must be PASS. The `backend/node_modules/` directory must exist and `npx playwright install chromium` must have completed. A live, publicly reachable URL is required; use a site with known framework markers (e.g., vercel.com for Tailwind, linear.app for lucide icons).

1. agent detects EXTRACT_WRITE phase  # -> phase detection output
2. verify tool readiness: `bash: node --version`, glob `backend/node_modules/`  # -> Node 20+, node_modules exists
3. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts <url> --fast --output .opencode/specs/<track>/<packet>/output`  # -> exits 0, crawl progress on stdout
4. `bash: node -e "const t = require('./<--output>/tokens.json'); const r = require('./<--output>/extraction-report.json'); console.log('meta.framework:', JSON.stringify(t.meta.framework, null, 0)); console.log('iconSystem:', JSON.stringify(t.iconSystem, null, 0)); console.log('motionSystem:', JSON.stringify(t.motionSystem, null, 0)); console.log('designBoundary:', JSON.stringify(r.designBoundary, null, 0))"` (run from the repo root)  # -> each field present, populated or null
5. agent reports detector findings: framework detected (or null), icon library (or null), motion tiers and durations, design boundary relationship

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DETECT-001 | Framework, icon, and motion detection | Verify all four detectors run during extraction and populate the output with honest data | `What framework, icons, and motion did the extractor detect?` | 1. agent detects EXTRACT_WRITE phase -> 2. verify tool readiness (`node --version`, check `backend/node_modules/`) -> 3. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts <url> --fast` -> 4. `node -e "...` inspect `tokens.json` (`meta.framework`, `iconSystem`, `motionSystem`) and `extraction-report.json` (`designBoundary`) -> 5. agent reports findings | Step 1: phase detected as EXTRACT_WRITE. Step 2: Node 20+, tool dependencies present. Step 3: extract exits 0, crawl output on stdout. Step 4: `meta.framework` present (tailwind/null, uiFramework/null, designSystemUrl/null); `iconSystem` present (null or with library, sizeScale, strokeWidth, colorMode, totalCount); `motionSystem` present (null or with durationScale, primaryTimingFunction, keyframeAnimations); `extraction-report.json` `designBoundary` present (with relationship, overallSimilarity, dimensionScores). Step 5: agent reports findings per detector. | Transcript of `extract.ts --fast`, node inspect output of detector fields, detector field presence/population summary | PASS if extraction exits 0 AND `tokens.json` carries `meta.framework`, `iconSystem`, `motionSystem` AND `extraction-report.json` carries `designBoundary`, with no fabricated data (null is acceptable). FAIL if any detector field is missing entirely OR a detector fabricates data (claims unobserved framework) OR extraction crashes with a detector stack trace | 1. If `meta.framework` is missing, confirm `extract.ts` awaits `detectFramework(page)` during Phase 1. Check `framework-detect.ts` for the detectors array (TAILWIND_PATTERN, UI_FRAMEWORK_CHECKS, DESIGN_SYSTEM_PATHS). 2. If `iconSystem` is missing, confirm `extract.ts` calls `detectIcons(domCollections)` after DOM collection. Check `icon-detect.ts` returns null when fewer than 3 SVGs are found. 3. If `motionSystem` is missing, confirm `extract.ts` calls `extractMotion(cssAnalysis, domCollections)`. Check `motion-extract.ts` returns null when no transitions/animations exist. 4. If `designBoundary` is missing from `extraction-report.json`, confirm it is written after the full crawl. Verify `detectBoundaries(pageGroups)` in `design-boundary-detect.ts`. 5. If a detector fabricates data, inspect the raw DOM/CSS output for that page to confirm what was actually present. |

### Optional Supplemental Checks

Test detection-absence directly: extract from a plain-HTML page with no CSS framework, no SVGs, and no CSS transitions/animation. Confirm `tokens.json` `meta.framework.tailwind` is null, `iconSystem` is null, and `motionSystem` is null. Test detection-presence: extract from a Tailwind + lucide site (e.g., vercel.com with its icon system) and confirm `meta.framework.tailwind.detected` is true and `iconSystem.library` is `lucide`. For motion, extract from a site with visible CSS animations (e.g., stripe.com) and confirm `motionSystem.durationScale` has at least one tier with a non-zero duration.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/scripts/framework-detect.ts` | Framework detection: Tailwind pattern matching, UI framework selectors (Material UI, Chakra, Ant Design, Bootstrap, Radix UI, shadcn/ui, Headless UI), design-system URL probing |
| `../../backend/scripts/icon-detect.ts` | Icon system detection: library identification (lucide, heroicons, phosphor, feather, material-icons, font-awesome), stroke width distribution, size scale, color mode classification |
| `../../backend/scripts/motion-extract.ts` | Motion extraction: transition durations and timing functions, keyframe animation classification (entrance/exit/attention/generic), prefers-reduced-motion detection |
| `../../backend/scripts/design-boundary-detect.ts` | Design boundary detection: dimension scoring across page groups (font, color, spacing, radius, component, shadow), relationship classification (unified/shared-foundation/independent), anomaly detection |
| `../../backend/scripts/extract.ts` | Extraction orchestrator: calls all four detectors during Phase 1 crawl and writes results to tokens.json |
| `../../backend/scripts/types.ts` | FrameworkDetection, IconSystemInfo, MotionSystem, DesignBoundary types |
| `../../SKILL.md` | §3 How It Works (Phase 1 detector list), §2 Smart Routing (Phase 1 pipeline description) |

---

## 5. SOURCE METADATA

- Group: Detectors
- Playbook ID: DETECT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--detectors/framework-icon-motion-detection.md`
