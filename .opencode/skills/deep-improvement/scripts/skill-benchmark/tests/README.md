---
title: "skill-benchmark tests: Lane C Vitest suites"
description: "The three Vitest suites covering the skill-benchmark (Lane C) lane: orchestrator/router-replay/dual-report, playbook mode, and the sk-code router drift guard."
trigger_phrases:
  - "skill-benchmark tests"
  - "lane c vitest"
  - "playbook-mode tests"
  - "sk-code router sync test"
---

# skill-benchmark tests: Lane C Vitest suites

---

## 1. OVERVIEW

`skill-benchmark/tests/` holds the three Vitest suites that cover the Lane C (skill-benchmark) lane. They exercise the lane's pure modules directly (`require` of each `.cjs`) and drive the end-to-end path through `run-skill-benchmark.cjs`, so the suites stay deterministic with no live dispatch or network.

Current state:

- Each suite resolves the lane under test from `SKILL_ROOT` (`resolve(__dirname, '..', '..', '..')`) and reads sibling skills from `REPO_SKILLS` (`resolve(SKILL_ROOT, '..')`), so they are position-stable within this `tests/` dir.
- `skill-benchmark.vitest.ts` and `playbook-mode.vitest.ts` cover the lane's two modes plus scoring; `sk-code-router-sync.vitest.ts` is a drift guard that reads the live `sk-code` skill on disk.
- Fixture skills used as routing targets are real in-repo skills (`cli-codex`, `sk-code`, `deep-improvement`); router-less negative cases are built from a throwaway temp `SKILL.md`.
- End-to-end cases write reports under OS temp dirs and clean them up in `afterAll`.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `skill-benchmark.vitest.ts` | Orchestrator and Mode A coverage: `loop-host.cjs` mode wiring (skill-benchmark as a valid mode, single-step plan, fail-closed args, byte-identical Lane A default), `router-replay.cjs` routing including inline vs reference-following routers, `contamination-lint.cjs`, `d5-connectivity.cjs` hard gate, `score-skill-benchmark.cjs` scoring with negative-activation, `build-report.cjs` report render, `advisor-probe.cjs` D1-inter scoring, malformed-fixture degradation, and the dual `skill-benchmark-report.json` / `.md` artifacts via `run-skill-benchmark.cjs`. |
| `playbook-mode.vitest.ts` | Mode B (playbook corpus) coverage: `load-playbook-scenarios.cjs` parsing the sk-code playbook (24 scenarios, text/browser/advisor split), `executor-dispatch.cjs` router branch + browser routing-out, `score-skill-benchmark.cjs` real-gold scoring, `computeDivergence` A vs B deltas, `live-executor.cjs` (`parseLiveResult`, `extractRoutingJson`, `proseRoutingFallback`), surface-mismatch gating, the asset lane (`assetRecall` separate from D2/D3), `browser-executor.cjs` verdict mapping, `d4-ablation.cjs` D4 and D4-R task-outcome, `playbook-generator.cjs` coverage + gates, `--playbook-dir` threading, and advisory-signal aggregation. |
| `sk-code-router-sync.vitest.ts` | Drift guard for sk-code's machine-readable router. Via `router-replay.cjs` `parseRouter`, asserts the machine block parses by reference-following, every routed path exists on disk, every routable `references/`/`assets/` `.md` (outside the navigation allowlist) is covered, and every explicit full path named in the `smart_routing.md` prose maps is present. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Suites `require` lane modules from `skill-benchmark/` and `shared/loop-host.cjs` by absolute join off `SKILL_ROOT`; only Node builtins (`fs`, `os`, `path`, `child_process`) are used otherwise. No production code imports these tests. |
| Fixtures | Routing targets are real in-repo skills under `REPO_SKILLS` (`cli-codex`, `sk-code`, `deep-improvement`). Negative router-less cases are synthesized as throwaway temp `SKILL.md` dirs, not committed fixtures. |
| Write policy | Read-only against the repo. Any writes (reports, malformed fixtures, custom playbook dirs) go to OS temp dirs and are removed in `afterAll`; the `sk-code` and `cli-codex` skill trees are read but never mutated. |
| Ownership | These suites are co-located with the Lane C lane they cover. The cross-lane index and shared fixtures live in `../../shared/tests/`. |

---

## 4. VALIDATION

Run from the `scripts/` directory.

```bash
npx vitest run skill-benchmark/tests
```

Expected result: 3 suites pass (all tests green); the suites print informational `skill-benchmark: ... verdict=...` lines for their end-to-end report artifacts.

---

## 5. RELATED

- [`shared/tests/README.md`](../../shared/tests/README.md)
- [`deep-improvement SKILL.md`](../../../SKILL.md)
