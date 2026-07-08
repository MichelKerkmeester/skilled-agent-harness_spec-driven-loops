---
title: "SB-048 -- Dual Report And Remediation Taxonomy"
description: "Manual validation scenario for SB-048: Dual Report And Remediation Taxonomy."
feature_id: "SB-048"
category: "Skill-Benchmark Mode"
version: 1.17.0.6
---

# SB-048 -- Dual Report And Remediation Taxonomy

This document captures the canonical manual-testing contract for `SB-048`.

---

## 1. OVERVIEW

This scenario validates that `scripts/skill-benchmark/run-skill-benchmark.cjs` emits a dual artifact — a machine `skill-benchmark-report.json` and a human `skill-benchmark-report.md` — where the markdown is rendered FROM the JSON (anti-drift) by `build-report.cjs`'s `renderReport()`, the only writer of the `.md`. The orchestrator writes `<outputs-dir>/skill-benchmark-report.json` then writes the `.md` beside it (same basename, `.json` → `.md`). `renderReport()` emits the `# Skill Benchmark Report — <id>` header, a `**Verdict: <v>**` line, the Dimension/Funnel/Ranked-bottlenecks/Scenarios tables, and a methodology note. The ranked-bottlenecks table surfaces D5 findings plus any funnel-attrition stage, whose `class` values map to the remediation taxonomy in `assets/skill_benchmark/remediation_taxonomy.json` (`router_unparseable`, `dead_resource_path`, `path_escape`, `dead_intent_key`, `orphan_reference`, `funnel_attrition`, `contaminated_fixture`) — each taxonomy entry carries `severity` (P0/P1/P2), `oneLineFix`, and `handoffLane`. `build-report.cjs` also has a standalone CLI `--report <report.json> [--output <report.md>]` to re-render the markdown from an existing JSON. This scenario verifies the dual artifacts exist, the `.md` derives from the JSON, and bottleneck `class` strings are members of the taxonomy.

---

## 2. SCENARIO CONTRACT

- Objective: Validate that run-skill-benchmark emits both `report.json` and `report.md` (the markdown rendered from the JSON via build-report), and that any reported bottleneck `class` values are members of the remediation taxonomy.
- Real user request: `Confirm the skill benchmark writes both a JSON and a Markdown report that match, and that flagged issues map to the remediation categories.`
- Prompt: `Validate that run-skill-benchmark emits report.json plus report.md rendered from it, and that bottleneck classes map to the remediation taxonomy.`
- Expected execution process: Run `run-skill-benchmark.cjs --skill cli-opencode` into a disposable outputs dir, then re-render the markdown from the JSON with `build-report.cjs --report ... --output ...` to confirm anti-drift; capture stdout, stderr, exit code, and the generated files; then execute the verification block against the JSON, the orchestrator-written `.md`, the re-rendered `.md`, and the taxonomy asset.
- Expected signals: the run exits `0`; both `skill-benchmark-report.json` and `skill-benchmark-report.md` exist in the outputs dir; the orchestrator `.md` begins with `# Skill Benchmark Report —` and contains a `**Verdict:` line plus a `## Ranked bottlenecks` section; re-rendering via `build-report.cjs --report <json> --output <md2>` reproduces the orchestrator `.md` byte-for-byte (anti-drift); every `bottlenecks[].class` in the JSON is a member of `remediation_taxonomy.json`'s `findings[].class` set; the taxonomy includes `router_unparseable`, `dead_resource_path`, `path_escape`, `dead_intent_key`, `orphan_reference`, and `contaminated_fixture`, each with `severity` matching `P[012]`, a non-empty `oneLineFix`, and a non-empty `handoffLane`.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence that the dual report is consistent and remediation-mapped.
- Pass/fail: PASS when both artifacts exist, the re-rendered markdown matches the orchestrator markdown byte-for-byte, and all bottleneck classes are taxonomy members; FAIL if an artifact is missing, the markdown drifts from the JSON, or a bottleneck class is absent from the taxonomy.

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
| SB-048 | Dual Report And Remediation Taxonomy | Validate dual JSON+MD report (anti-drift) and remediation-taxonomy mapping | `Validate that run-skill-benchmark emits report.json plus report.md rendered from it, and that bottleneck classes map to the remediation taxonomy.` | rm -rf /tmp/sb-048 &amp;&amp; mkdir -p /tmp/sb-048/out &amp;&amp; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \<br>  --skill cli-opencode \<br>  --outputs-dir /tmp/sb-048/out ; echo "run-exit=$?" ; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs \<br>  --report /tmp/sb-048/out/skill-benchmark-report.json \<br>  --output /tmp/sb-048/out/rerendered.md ; \<br>diff /tmp/sb-048/out/skill-benchmark-report.md /tmp/sb-048/out/rerendered.md &amp;&amp; echo "ANTI-DRIFT-OK" ; \<br>node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('/tmp/sb-048/out/skill-benchmark-report.json','utf8'));const tax=JSON.parse(fs.readFileSync('.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/remediation_taxonomy.json','utf8'));const classes=new Set(tax.findings.map(f=&gt;f.class));const md=fs.readFileSync('/tmp/sb-048/out/skill-benchmark-report.md','utf8');console.log('mdHeader='+md.startsWith('# Skill Benchmark Report —'));console.log('hasVerdict='+md.includes('**Verdict:'));console.log('hasBottlenecks='+md.includes('## Ranked bottlenecks'));console.log('bottleneckClassesMapped='+(r.bottlenecks||[]).every(b=&gt;!b.class||classes.has(b.class)));console.log('taxOk='+tax.findings.every(f=&gt;/^P[012]$/.test(f.severity)&amp;&amp;f.oneLineFix.length&gt;0&amp;&amp;f.handoffLane.length&gt;0));" | `run-exit=0`; both `skill-benchmark-report.json` and `skill-benchmark-report.md` exist; `diff` empty and prints `ANTI-DRIFT-OK`; `mdHeader=true`; `hasVerdict=true`; `hasBottlenecks=true`; `bottleneckClassesMapped=true`; `taxOk=true`; taxonomy classes include router_unparseable / dead_resource_path / path_escape / dead_intent_key / orphan_reference / contaminated_fixture | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | PASS when both artifacts exist, the re-rendered markdown matches the orchestrator markdown byte-for-byte, and all bottleneck classes are taxonomy members with valid severity/oneLineFix/handoffLane; FAIL otherwise. | If the `.md` is missing: confirm `run-skill-benchmark.cjs` writes the `.md` via `reportJsonPath.replace(/\.json$/, '.md')` and `renderReport(report)`<br>If `diff` is non-empty: the markdown drifted — `build-report.cjs` must be the only `.md` writer and must take only the report object, no score args<br>If a bottleneck class is unmapped: add the finding class to `remediation_taxonomy.json` (or fix the emitter) so every surfaced class carries a remediation entry |

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
| `10--skill-benchmark/dual-report-and-remediation.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane C: Skill-Benchmark) |
| `../../scripts/skill-benchmark/run-skill-benchmark.cjs` | Orchestrator that writes report.json then report.md beside it |
| `../../scripts/skill-benchmark/build-report.cjs` | `renderReport()` — sole writer of report.md, rendered from the JSON (anti-drift) |
| `../../assets/skill_benchmark/remediation_taxonomy.json` | Finding-class → severity/oneLineFix/handoffLane remediation mapping |

---

## 5. SOURCE METADATA

- Group: Skill-Benchmark Mode
- Playbook ID: SB-048
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--skill-benchmark/dual-report-and-remediation.md`
