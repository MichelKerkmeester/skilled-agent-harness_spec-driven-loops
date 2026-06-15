---
title: "D5 structural connectivity hard gate"
description: "A static scan of the target skill's router that runs before any dispatch; any P0 finding sets gateFailed and caps the verdict at BLOCKED-BY-STRUCTURE."
trigger_phrases:
  - "d5 structural connectivity hard gate"
  - "d5-connectivity.cjs"
  - "run connectivity gate"
  - "dead resource path detection"
  - "BLOCKED-BY-STRUCTURE verdict"
---

# D5 structural connectivity hard gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`d5-connectivity.cjs` statically scans the target skill's `INTENT_SIGNALS` and `RESOURCE_MAP` against on-disk state before any routing or dispatch runs. It classifies structural defects into P0/P1/P2 severities; any P0 fails the gate and caps the overall verdict at `BLOCKED-BY-STRUCTURE`.

---

## 2. HOW IT WORKS

`scripts/skill-benchmark/d5-connectivity.cjs` exposes `scanConnectivity({ skillRoot })`, which reuses `parseRouter` from `router-replay.cjs`. If `SKILL.md` is missing it returns early with `score: 60, gateFailed: true, routerParseable: false` and a single `missing_skill_md` P0 finding. Otherwise it walks `RESOURCE_MAP` and detects these finding classes:

- `dead_intent_key` [P1] — a `RESOURCE_MAP` intent with no matching `INTENT_SIGNALS` key.
- `path_escape` [P0] — a routed path whose `path.resolve(skillRoot, r)` does not start with `path.resolve(skillRoot)` (resolves outside the skill root).
- `dead_resource_path` [P0] — a routed path that does not exist on disk (`fs.existsSync`).
- `orphan_reference` [P2] — a `.md` file under `references/` or `assets/` (found by `listMarkdownRefs`) that is not reachable from any `RESOURCE_MAP` entry.
- `router_unparseable` [P0] — appended when `router.parseable` is false (neither map parsed).

It returns `{ score, gateFailed, routerParseable, deadResourcePaths, deadIntentKeys, orphanReferences, pathEscapes, findings }`. `gateFailed` is true when any P0 exists OR `!router.parseable`. The `score` is `Math.max(0, 100 - Σ penalties)` with per-finding penalties `{ P0: 40, P1: 12, P2: 3 }`. The orchestrator runs `scanConnectivity` first, before loading fixtures, and the aggregate caps the verdict to `BLOCKED-BY-STRUCTURE` whenever `connectivity.gateFailed` is set, regardless of the weighted score. As a script, exit code is `res.gateFailed ? 1 : 0`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs` | Hard gate | Static P0/P1/P2 connectivity scan (`scanConnectivity`, `listMarkdownRefs`); sets `gateFailed` and the D5 `score`. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Utility (imported) | Supplies `parseRouter` the gate scans for dead/escaping/orphan paths and dead intent keys. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Automated test | Asserts a router-less skill hard-gates (`gateFailed:true`, `routerParseable:false`) and that a router-bearing skill (`cli-codex`) with valid paths is `routerParseable:true` with no dead resource paths. |

---

## 4. SOURCE METADATA

- Group: Skill-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--skill-benchmark/d5-connectivity-gate.md`
Related references:
- [router-replay-and-advisor-probe.md](router-replay-and-advisor-probe.md) — Router replay and advisor probe
- [scoring-and-funnel.md](scoring-and-funnel.md) — D1-D5 scoring and funnel
