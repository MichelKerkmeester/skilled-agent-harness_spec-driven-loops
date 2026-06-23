---
title: "SB-044 -- Contamination Gate For Public Fixtures"
description: "Manual validation scenario for SB-044: Contamination Gate For Public Fixtures."
feature_id: "SB-044"
category: "Skill-Benchmark Mode"
version: 1.17.0.5
---

# SB-044 -- Contamination Gate For Public Fixtures

This document captures the canonical manual-testing contract for `SB-044`.

---

## 1. OVERVIEW

This scenario validates that `scripts/skill-benchmark/contamination-lint.cjs` rejects a public fixture prompt that leaks banned vocabulary and passes a clean, domain-language prompt. `buildBannedVocab()` assembles the banned-substring set from the target skill's own identity — skill id/basename, frontmatter `trigger_phrases` and `name`, router `INTENT_SIGNALS` keys + keywords, `RESOURCE_MAP` keys + path tokens — using the same lowercased-substring match the router uses (`lintFixture()` lowercases the public text and flags any banned term that is a substring). A hard leak is a FIXTURE failure. The standalone CLI is `contamination-lint.cjs --skill <root> --text "<public prompt>"`: it builds the vocab from the skill, lints the text, prints `{ "passed": ..., "hardLeaks": [{ "term": ... }] }`, and exits `1` on a leak / `0` when clean. Inside the orchestrator, a leak yields a scenario row with `firstFailingStage: "contaminated-fixture"`.

---

## 2. SCENARIO CONTRACT

- Objective: Validate that contamination-lint rejects a public prompt leaking a banned term (exit 1, `passed:false`) and passes a clean domain-language prompt (exit 0, `passed:true`).
- Real user request: `Check that the contamination linter blocks a public fixture prompt that names the skill and accepts one written purely in domain language.`
- Prompt: `Validate that contamination-lint flags a public prompt leaking banned skill vocabulary and passes a clean domain-language prompt.`
- Expected execution process: Run `contamination-lint.cjs` twice against a router-bearing skill — once with a prompt that names the skill (leak) and once with a domain-only prompt (clean); capture stdout, stderr, exit code; then execute the verification block against the captured JSON and exit codes.
- Expected signals: the leaking run prints JSON with `"passed": false` and a non-empty `hardLeaks` array and exits `1`; the clean run prints `"passed": true` with an empty `hardLeaks` array and exits `0`; the leaked `hardLeaks[].term` values are lowercased banned substrings drawn from the skill's identity (e.g. the skill id `cli-codex`).
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence from both lint runs.
- Pass/fail: PASS when the leaking prompt fails (exit 1, `passed:false`, non-empty `hardLeaks`) and the clean prompt passes (exit 0, `passed:true`); FAIL if either run produces the wrong verdict or exit code.

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
| SB-044 | Contamination Gate For Public Fixtures | Validate contamination-lint rejects a leaking fixture and passes a clean one | `Validate that contamination-lint flags a public prompt leaking banned skill vocabulary and passes a clean domain-language prompt.` | rm -rf /tmp/sb-044 &amp;&amp; mkdir -p /tmp/sb-044 &amp;&amp; \<br>node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs \<br>  --skill .opencode/skills/cli-codex \<br>  --text "use the cli-codex skill to review this diff" \<br>  &gt; /tmp/sb-044/leak.json ; echo "leak-exit=$?" ; \<br>node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs \<br>  --skill .opencode/skills/cli-codex \<br>  --text "can you take a second look at my changes before i merge them" \<br>  &gt; /tmp/sb-044/clean.json ; echo "clean-exit=$?" ; \<br>node -e "const fs=require('fs');const l=JSON.parse(fs.readFileSync('/tmp/sb-044/leak.json','utf8'));const c=JSON.parse(fs.readFileSync('/tmp/sb-044/clean.json','utf8'));console.log('leak.passed='+l.passed+' leak.hardLeaks='+l.hardLeaks.length);console.log('clean.passed='+c.passed+' clean.hardLeaks='+c.hardLeaks.length);" | leak run: `leak-exit=1`, JSON `"passed": false`, `leak.hardLeaks` &gt; 0; clean run: `clean-exit=0`, JSON `"passed": true`, `clean.hardLeaks=0`; leaked terms are lowercased banned substrings from the skill identity (e.g. `cli-codex`) | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | PASS when the leaking prompt fails (exit 1, `passed:false`, non-empty hardLeaks) and the clean prompt passes (exit 0, `passed:true`, empty hardLeaks); FAIL otherwise. | If the leak run does not fail: confirm the banned term actually appears as a substring (case-insensitive) and that `buildBannedVocab()` is sourcing the skill id / triggers / router keywords from `SKILL.md`<br>If the clean run fails: the domain prompt is accidentally including a banned router keyword or path token — rephrase it in pure domain language per `contaminated_fixture` remediation<br>If exit codes are inverted: check the `process.exit(res.passed ? 0 : 1)` tail of `contamination-lint.cjs` |

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
| `10--skill-benchmark/contamination-gate.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane C: Skill-Benchmark) |
| `../../scripts/skill-benchmark/contamination-lint.cjs` | Pre-dispatch hint-free gate; builds banned vocab and lints the public prompt |
| `../../scripts/skill-benchmark/router-replay.cjs` | Provides `parseRouter()` used by `buildBannedVocab()` for intent keys/keywords/paths |
| `../../scripts/skill-benchmark/run-skill-benchmark.cjs` | Orchestrator that marks a leak as `firstFailingStage: contaminated-fixture` |

---

## 5. SOURCE METADATA

- Group: Skill-Benchmark Mode
- Playbook ID: SB-044
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--skill-benchmark/contamination-gate.md`
