---
title: "247 -- Memory Quality KPI Reporting"
description: "This scenario validates memory quality KPI reporting for `247`. It focuses on confirming global and scoped scans, JSON output, and the stderr summary line."
version: 3.6.0.13
id: tooling-and-scripts-memory-quality-kpi-reporting
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 247 -- Memory Quality KPI Reporting

## 1. OVERVIEW

This scenario validates memory quality KPI reporting for `247`. It focuses on confirming global and scoped scans, JSON output, and the stderr summary line.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm global and scoped KPI scans, JSON output, and stderr summary behavior.
- Real user request: `` Please validate Memory Quality KPI Reporting against bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh and tell me whether the expected signals are present: full and scoped scans both emit JSON; stderr summary line is present; scoped output contains `scope`; command exits 0. ``
- Prompt: `Validate Memory Quality KPI Reporting against bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: full and scoped scans both emit JSON; stderr summary line is present; scoped output contains `scope`; command exits 0
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if both scan modes produce structured output and the summary line matches the documented contract

---

## 3. TEST EXECUTION

### Prompt

```
Validate Memory Quality KPI Reporting against bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh`
2. `bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh system-spec-kit/022-hybrid-rag-fusion`
3. `bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh system-spec-kit/022-hybrid-rag-fusion > /tmp/quality-kpi.json`
4. `node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('/tmp/quality-kpi.json','utf8')); console.log(data.scope, data.totalFiles, data.rates.emptyTriggerPhrasesRate)"`

### Expected

Both commands emit JSON; stderr includes `KPI Summary:`; scoped run preserves the requested scope and exits 0

### Evidence

Command 1: `bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh`

```text
{
  "generatedAt": "2026-07-02T21:22:46.228Z",
  "scope": "all-active-specs",
  "totalFiles": 0,
  "rates": {
    "placeholderRate": 0,
    "fallbackRate": 0,
    "contaminationRate": 0,
    "emptyTriggerPhrasesRate": 0
  },
  "counts": {
    "total": 0,
    "placeholders": 0,
    "fallback": 0,
    "contamination": 0,
    "emptyTriggerPhrases": 0
  }
}
KPI Summary: files=0, placeholder=0%, fallback=0%, contamination=0%, empty_trigger=0%
```

Command 2: `bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh system-spec-kit/022-hybrid-rag-fusion`

```text
{
  "generatedAt": "2026-07-02T21:22:54.620Z",
  "scope": "system-spec-kit/022-hybrid-rag-fusion",
  "totalFiles": 0,
  "rates": {
    "placeholderRate": 0,
    "fallbackRate": 0,
    "contaminationRate": 0,
    "emptyTriggerPhrasesRate": 0
  },
  "counts": {
    "total": 0,
    "placeholders": 0,
    "fallback": 0,
    "contamination": 0,
    "emptyTriggerPhrases": 0
  }
}
KPI Summary: files=0, placeholder=0%, fallback=0%, contamination=0%, empty_trigger=0%
```

Command 3: `bash .opencode/skills/system-spec-kit/scripts/kpi/quality-kpi.sh system-spec-kit/022-hybrid-rag-fusion > /tmp/quality-kpi.json`

```text
KPI Summary: files=0, placeholder=0%, fallback=0%, contamination=0%, empty_trigger=0%
```

Command 4: `node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('/tmp/quality-kpi.json','utf8')); console.log(data.scope, data.totalFiles, data.rates.emptyTriggerPhrasesRate)"`

```text
system-spec-kit/022-hybrid-rag-fusion 0 0
```

### Pass / Fail

- **PASS**: the script returned JSON plus the stderr summary for both modes, `/tmp/quality-kpi.json` parsed as JSON, and the scoped JSON reflected `system-spec-kit/022-hybrid-rag-fusion`.

### Failure Triage

Inspect `scripts/kpi/quality-kpi.sh`, markdown traversal logic, and trigger-phrase counting if scope handling or JSON generation is wrong

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/memory_quality_kpi_reporting.md](../../feature_catalog/tooling_and_scripts/memory_quality_kpi_reporting.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 247
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/memory_quality_kpi_reporting.md`
