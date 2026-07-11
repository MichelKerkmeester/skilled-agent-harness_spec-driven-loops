---
title: "SB-045 -- Router-Replay Mode A Determinism"
description: "Manual validation scenario for SB-045: Router-Replay Mode A Determinism."
feature_id: "SB-045"
category: "Skill-Benchmark Mode"
version: 1.17.0.6
---

# SB-045 -- Router-Replay Mode A Determinism

This document captures the canonical manual-testing contract for `SB-045`.

---

## 1. OVERVIEW

This scenario validates that `scripts/skill-benchmark/router-replay.cjs` (Mode A, deterministic) produces stable, repeatable routing decisions for a fixed task — the property that makes it the CI gate. The script reads the target `SKILL.md`, extracts `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` from the fenced router block, then reproduces the in-skill semantics: lowercase the task, score each intent by counting which keywords appear as substrings (weighted), keep intents within `AMBIGUITY_DELTA = 1` of the top score, and union the default resource with `RESOURCE_MAP[intent]` for the selected intents. The standalone CLI is `router-replay.cjs --skill <skill-root> --task "<task text>"`: it prints `{ parseable, intents, resources, missingResources, scores }` and exits `0` on a successful replay (even with zero intents) / `2` on an unparseable router. Determinism is verified by running the identical task twice and diffing the JSON output.

---

## 2. SCENARIO CONTRACT

- Objective: Validate that router-replay (Mode A) is deterministic — the same task on the same skill yields byte-identical routing JSON across runs — and selects the expected intent with existing routed paths.
- Real user request: `Confirm the Mode A router replay returns the same routing decision every time for a given task so it is safe as a CI gate.`
- Prompt: `Validate that router-replay produces stable, repeatable routing decisions for a fixture task and is exit-0 deterministic.`
- Expected execution process: Run `router-replay.cjs` twice with the same `--skill` and `--task`, save both JSON outputs, then diff them and inspect the routed intents/resources; capture stdout, stderr, exit code; then execute the verification block against the saved artifacts.
- Expected signals: both runs exit `0`; both print `"parseable": true`; the two JSON outputs are byte-identical (empty diff); for a REVIEW-class task on `cli-opencode` the `intents` array contains `REVIEW`, `resources` is non-empty, and `missingResources` is `[]` (all routed paths exist on disk).
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence that the replay is deterministic.
- Pass/fail: PASS when both runs exit 0, both are `parseable:true`, the JSON outputs are identical, and the expected intent/resources are present with no missing paths; FAIL if the outputs differ, an exit is non-zero, or the router is unparseable.

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
| SB-045 | Router-Replay Mode A Determinism | Validate deterministic Mode A routing replay across two identical runs | `Validate that router-replay produces stable, repeatable routing decisions for a fixture task and is exit-0 deterministic.` | rm -rf /tmp/sb-045 &amp;&amp; mkdir -p /tmp/sb-045 &amp;&amp; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \<br>  --skill .opencode/skills/cli-external/cli-opencode \<br>  --task "review this diff for security vulnerabilities and give a second opinion" \<br>  &gt; /tmp/sb-045/run1.json ; echo "run1-exit=$?" ; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \<br>  --skill .opencode/skills/cli-external/cli-opencode \<br>  --task "review this diff for security vulnerabilities and give a second opinion" \<br>  &gt; /tmp/sb-045/run2.json ; echo "run2-exit=$?" ; \<br>diff /tmp/sb-045/run1.json /tmp/sb-045/run2.json &amp;&amp; echo "DETERMINISTIC" ; \<br>node -e "const r=require('/tmp/sb-045/run1.json');console.log('parseable='+r.parseable+' hasREVIEW='+r.intents.includes('REVIEW')+' resources='+r.resources.length+' missing='+r.missingResources.length);" | both runs `run1-exit=0` / `run2-exit=0`; `diff` empty and prints `DETERMINISTIC`; JSON `"parseable": true`; `hasREVIEW=true`; `resources` &gt; 0; `missing=0` (`missingResources` empty) | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | PASS when both runs exit 0, are `parseable:true`, the JSON is byte-identical across runs, and the expected REVIEW intent + non-empty existing resources are routed; FAIL otherwise. | If the two outputs differ: routing is not deterministic — inspect `scoreIntents()`/`selectIntents()` and the `scores.sort` order in `router-replay.cjs`<br>If `parseable:false` (exit 2): the target `SKILL.md` lacks a parseable `INTENT_SIGNALS`/`RESOURCE_MAP` block — check `extractDictBody()` and `parseRouter()`<br>If `missingResources` is non-empty: a routed path does not exist on disk — this is the same condition D5 hard-gates (`dead_resource_path`) |

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
| `skill-benchmark/router-replay-mode-a.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane C: Skill-Benchmark) |
| `../../scripts/skill-benchmark/router-replay.cjs` | Mode A deterministic in-skill smart-router replay |
| `../../scripts/skill-benchmark/run-skill-benchmark.cjs` | Orchestrator that calls `routeSkillResources()` per scenario |
| `../../references/skill_benchmark/operator_guide.md` | Documents Mode A as the deterministic CI gate |

---

## 5. SOURCE METADATA

- Group: Skill-Benchmark Mode
- Playbook ID: SB-045
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `skill-benchmark/router-replay-mode-a.md`
