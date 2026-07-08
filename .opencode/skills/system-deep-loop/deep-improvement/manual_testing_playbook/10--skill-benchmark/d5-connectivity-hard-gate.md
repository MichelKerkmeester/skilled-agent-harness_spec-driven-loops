---
title: "SB-046 -- D5 Connectivity Hard Gate"
description: "Manual validation scenario for SB-046: D5 Connectivity Hard Gate."
feature_id: "SB-046"
category: "Skill-Benchmark Mode"
version: 1.17.0.5
---

# SB-046 -- D5 Connectivity Hard Gate

This document captures the canonical manual-testing contract for `SB-046`.

---

## 1. OVERVIEW

This scenario validates that `scripts/skill-benchmark/d5-connectivity.cjs` is a static structural hard gate that runs FIRST (before any dispatch) and caps the verdict regardless of weighted score. `scanConnectivity()` reads the target `SKILL.md`, parses the router, and detects: dead routed paths (P0, `dead_resource_path`), routed paths escaping the skill root (P0, `path_escape`), an unparseable router (P0, `router_unparseable`), `RESOURCE_MAP` keys absent from `INTENT_SIGNALS` (P1, `dead_intent_key`), and on-disk references never reached from any `RESOURCE_MAP` entry (P2, `orphan_reference`, reported not gated). Any P0 (or an unparseable router) sets `gateFailed: true`. Score starts at 100 and subtracts P0=40 / P1=12 / P2=3, floored at 0. The standalone CLI is `d5-connectivity.cjs --skill <skill-root>`: it prints `{ score, gateFailed, routerParseable, deadResourcePaths, deadIntentKeys, orphanReferences, pathEscapes, findings }` and exits `1` when `gateFailed` / `0` otherwise. A skill whose router cannot be parsed (no `INTENT_SIGNALS`/`RESOURCE_MAP`) is the strongest gate failure: `routerParseable:false`, `gateFailed:true`. In the orchestrator, `run-skill-benchmark.cjs` calls `scanConnectivity()` as step 2 (before fixtures/dispatch) and `aggregate()` maps `gateFailed` to the verdict `BLOCKED-BY-STRUCTURE`.

---

## 2. SCENARIO CONTRACT

- Objective: Validate that the D5 connectivity scan blocks a scenario when the target skill's router is unreachable/unparseable (`gateFailed:true`, exit 1) and does not gate a router-bearing skill with valid paths (`gateFailed:false`, exit 0).
- Real user request: `Confirm the D5 structural scan blocks a skill whose router cannot be parsed and runs before anything else.`
- Prompt: `Validate that the D5 connectivity scan hard-gates a skill with an unparseable/unreachable router and passes a healthy router-bearing skill.`
- Expected execution process: Build a throwaway router-less skill dir under /tmp (a `SKILL.md` with no `INTENT_SIGNALS`/`RESOURCE_MAP`), run `d5-connectivity.cjs` against it (gate fails), then run it against a healthy router-bearing skill (`cli-opencode`, no gate); capture stdout, stderr, exit code; then execute the verification block against both JSON outputs.
- Expected signals: the router-less run prints `"gateFailed": true` and `"routerParseable": false`, includes a P0 `router_unparseable` finding, and exits `1`; the healthy run prints `"gateFailed": false`, `"routerParseable": true`, an empty `deadResourcePaths`, and exits `0`; the router-less `score` is reduced by the P0 penalty (≤ 60).
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence that the gate fired on the broken skill and stayed clear on the healthy one.
- Pass/fail: PASS when the unparseable skill hard-gates (exit 1, `gateFailed:true`, `routerParseable:false`) and the healthy skill does not gate (exit 0, `gateFailed:false`, `deadResourcePaths` empty); FAIL if either verdict or exit code is wrong.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders to disposable /tmp test paths.
3. Run the exact command sequence; capture stdout, stderr, exit code, generated artifacts.
4. Run the verification block against the same artifacts.
5. Compare observed output against expected signals and pass/fail criteria.
6. Record the scenario verdict with decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SB-046 | D5 Connectivity Hard Gate | Validate D5 blocks an unparseable-router skill and passes a healthy one | `Validate that the D5 connectivity scan hard-gates a skill with an unparseable/unreachable router and passes a healthy router-bearing skill.` | rm -rf /tmp/sb-046 &amp;&amp; mkdir -p /tmp/sb-046/norouter &amp;&amp; \<br>printf -- '---\nname: throwaway\n---\n# Throwaway\nNo smart router here.\n' &gt; /tmp/sb-046/norouter/SKILL.md ; \<br>node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs \<br>  --skill /tmp/sb-046/norouter \<br>  &gt; /tmp/sb-046/gate.json ; echo "gate-exit=$?" ; \<br>node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs \<br>  --skill .opencode/skills/cli-opencode \<br>  &gt; /tmp/sb-046/healthy.json ; echo "healthy-exit=$?" ; \<br>node -e "const fs=require('fs');const g=JSON.parse(fs.readFileSync('/tmp/sb-046/gate.json','utf8'));const h=JSON.parse(fs.readFileSync('/tmp/sb-046/healthy.json','utf8'));console.log('gate.gateFailed='+g.gateFailed+' gate.routerParseable='+g.routerParseable+' gate.score='+g.score+' hasP0unparseable='+g.findings.some(f=&gt;f.class==='router_unparseable'));console.log('healthy.gateFailed='+h.gateFailed+' healthy.routerParseable='+h.routerParseable+' healthy.deadPaths='+h.deadResourcePaths.length);" | router-less run: `gate-exit=1`, `gateFailed:true`, `routerParseable:false`, a `router_unparseable` P0 finding present, `score` ≤ 60; healthy run: `healthy-exit=0`, `gateFailed:false`, `routerParseable:true`, `deadResourcePaths` empty | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | PASS when the unparseable skill hard-gates (exit 1, gateFailed/routerParseable false) and the healthy skill does not gate (exit 0, gateFailed false, no dead paths); FAIL otherwise. | If the router-less skill does not gate: confirm `parseRouter()` returns `parseable:false` for a SKILL.md with no `INTENT_SIGNALS`/`RESOURCE_MAP` and that `gateFailed = p0 > 0 || !router.parseable`<br>If the healthy skill gates: a routed path is missing or escapes the root — inspect the `dead_resource_path`/`path_escape` findings and repoint the route<br>If exit codes are inverted: check the `process.exit(res.gateFailed ? 1 : 0)` tail of `d5-connectivity.cjs` |

### Optional Supplemental Checks

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `10--skill-benchmark/d5-connectivity-hard-gate.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane C: Skill-Benchmark) |
| `../../scripts/skill-benchmark/d5-connectivity.cjs` | Static structural scan; the D5 hard gate that runs first |
| `../../scripts/skill-benchmark/run-skill-benchmark.cjs` | Orchestrator that runs `scanConnectivity()` before any dispatch |
| `../../scripts/skill-benchmark/score-skill-benchmark.cjs` | `aggregate()` maps `gateFailed` to the `BLOCKED-BY-STRUCTURE` verdict |

---

## 5. SOURCE METADATA

- Group: Skill-Benchmark Mode
- Playbook ID: SB-046
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--skill-benchmark/d5-connectivity-hard-gate.md`
