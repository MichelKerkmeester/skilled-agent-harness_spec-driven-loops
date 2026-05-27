# Focus

F2 - PC-005 bench runner: determine the correct documented invocation, explain the warm_p95 and cold_p95 failures, and identify concrete remediation targets.

# Actions Taken

1. Read the Python bench harness, PC-005 scenario, adjacent PC-004 dataset scenario, feature catalog entry, stress wrapper, and TypeScript latency bench sources. Evidence is captured in the delta record at `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:2-12`.
2. Ran the documented bare PC-005 command; argparse exited 2 because `--dataset` is required by the script. The requirement is visible in the script usage and parser definition at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:8` and `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:241`.
3. Ran the bench with the checked-in regression fixture and `--runs 1`; the report showed warm p95 25.2627 ms, cold subprocess p95 876.8873 ms, throughput multiplier 37.799, and overall failure from warm/cold gates only. The captured report is cited in `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:5`.
4. Ran the TypeScript scorer bench from the built dist output; it reported cache-hit p95 3.686 ms, uncached p95 6.708 ms, and `passed=true`. The captured report and source gate are cited in `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:7`.

# Findings[file:line]

## F2.1 Correct invocation

The scenario doc is wrong: `--dataset` is genuinely required by `skill_advisor_bench.py`. The script advertises `Usage: python3 skill_advisor_bench.py --dataset <jsonl-path>` and argparse marks `--dataset` as required; PC-005 instead documents a bare invocation. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:8`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:241`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md:33`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md:36`.

The best documented invocation should use the checked-in regression fixture unless the playbook wants to define a dedicated mini bench fixture. PC-004 already points at `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl`, and the bench loader only requires JSONL objects with a non-empty `prompt` field. Evidence: `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/004-regression-suite.md:35`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/004-regression-suite.md:37`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:54`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:73`.

Recommended doc command:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py \
  --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 1 \
  --out /tmp/skill-advisor-bench.json
```

The `--out` flag is already supported by the script. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:245`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:287`.

## F2.2 warm_p95 failure

warm_p95 is a threshold calibration problem, not evidence of a native scorer regression. The Python script defaults `--max-warm-p95-ms` to 20 ms, while the feature catalog describes a 50 ms cache-hit design envelope and explicitly says those measurements are not enforceable CI gates because p95 varies with sandbox load. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:246`, `.opencode/skills/system-skill-advisor/feature_catalog/08--python-compat/03-bench-runner.md:21`.

The measured Python warm p95 on this machine was 25.2627 ms, so it fails only the script's 20 ms default and remains under the documented 50 ms envelope. Evidence: `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:5`, `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:9`.

## F2.3 cold_p95 failure

cold_p95 is a subprocess/cold-start artifact. `benchmark_subprocess` runs a fresh `python3 skill_advisor.py` for every prompt, while the batch path runs one subprocess for the whole prompt file. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:111`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:114`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:174`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:190`.

The one-shot Python path can also probe or call the compiled native advisor through a Node bridge, so a single cold sample may include Python startup plus Node bridge startup/import work. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:328`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:342`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:388`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:469`.

The measured cold p95 was 876.8873 ms, but batch throughput was 50.6771 prompts/sec and the throughput multiplier was 37.799. That pattern points at fixed process overhead, because the amortized batch path stays fast once startup is paid. Evidence: `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:5`, `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:10`.

The native TypeScript scorer itself is not regressing in this run: the scorer bench gates cache-hit p95 <= 50 ms and uncached p95 <= 60 ms, and the measured dist bench reported 3.686 ms / 6.708 ms with `passed=true`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/bench/scorer-bench.ts:56`, `.opencode/skills/system-skill-advisor/mcp_server/bench/scorer-bench.ts:61`, `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:7`.

## F2.4 Remediation targets

Doc remediation: update `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md` to include `--dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl`, and describe `--runs 1` as manual smoke guidance rather than the performance baseline. Evidence: `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:11`.

Gate remediation: update `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py` so warm p95 defaults to the documented 50 ms envelope, and stop treating one-shot subprocess cold p95 as a 60 ms native-scorer gate. Better options are to make cold p95 advisory/opt-in, rename it to make subprocess scope explicit, or raise it to a workstation-calibrated subprocess budget while preserving `throughput_multiplier` as the Python-surface regression gate. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:246`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:247`, `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:12`.

Test/doc alignment target: keep `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` aligned with the chosen contract, because it already states the p95 thresholds are captured workstation measurements and that the wrapper validates subprocess reachability and JSON shape rather than hard p95. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts:93`, `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts:97`.

# Questions Answered

- The scenario doc is wrong; `--dataset` is required by the script. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:241`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md:36`.
- The correct documented dataset should be the checked-in regression fixture unless a dedicated mini bench fixture is added. Evidence: `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/004-regression-suite.md:37`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:73`.
- warm_p95 fails because the Python bench's 20 ms default is tighter than the documented 50 ms envelope and tighter than this machine's measured 25.2627 ms warm p95. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:246`, `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:5`.
- cold_p95 fails because the gate is applied to one fresh subprocess per prompt, not to the native scorer's in-process uncached path. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:114`, `.opencode/skills/system-skill-advisor/mcp_server/bench/scorer-bench.ts:53`.
- A scorer perf fix is not the first remediation, because the native TypeScript scorer bench passed in this run. Evidence: `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl:7`, `.opencode/skills/system-skill-advisor/mcp_server/bench/scorer-bench.ts:61`.

# Questions Remaining

- The exact cold subprocess budget should be calibrated with repeated serial runs on the intended benchmark host before hard-coding a new default. Evidence for current volatility concern: `.opencode/skills/system-skill-advisor/feature_catalog/08--python-compat/03-bench-runner.md:21`.
- The playbook should decide whether PC-005 is a manual smoke test of the Python bench runner or a stable-host performance certification. The stress wrapper currently treats it as subprocess reachability plus JSON shape, not strict p95 enforcement. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts:77`, `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts:97`.

# Next Focus

F3 semantic_shadow lane weight
