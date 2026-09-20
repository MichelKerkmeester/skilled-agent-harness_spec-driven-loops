---
title: "cli-jev Playbook Run: 2026-09-20 unauthenticated pass"
description: "Recorded verdicts for the cli-jev manual testing playbook executed on 2026-09-20 with no Jev provider credential available."
trigger_phrases:
  - "cli-jev playbook run"
  - "2026-09-20 cli-jev validation"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# cli-jev Playbook Run — 2026-09-20

_Derived after the fact from this run's stored record, not written at run time._

---

## 1. RUN IDENTITY

| Field | Value |
|---|---|
| Date | 2026-09-20 |
| Playbook | `cli-jev/manual-testing-playbook/manual-testing-playbook.md` |
| Binary | `jev 0.6.2` (`uv tool install jev-cli`) |
| Provider keys | all cleared: `TYPESAFE_API_KEY`, `AI_GATEWAY_API_KEY`, `OPENROUTER_API_KEY`, `JEV_API_KEY`, `JEV_PROVIDER`, `JEV_ENDPOINT`, `JEV_MODEL` |
| Executor | the orchestrator session for `074-cli-jev-creation` phase 001 probes and phase 004 |

---

## 2. VERDICT

**20 PASS, 0 FAIL, 2 SKIP.** Twenty-two scenarios across five categories, one file per scenario; the two skips are the rows whose observable only exists behind a live judgment call, and neither is counted as a pass.

| Scenario | Verdict | Evidence |
|---|---|---|
| JEV-001 | PASS | `jev 0.6.2`, exit 0 |
| JEV-002 | PASS | six subcommands listed, exit 0 |
| JEV-003 | PASS | `--value` present, `--endpoint` absent in both help surfaces |
| JEV-004 | PASS | exit 3, empty stdout, credential JSON on stderr |
| JEV-005 | PASS | `cannot read state file`, exit 2 |
| JEV-006 | PASS | `invalid JSON state`, exit 2 |
| JEV-007 | PASS | three usage blocks, exit 2 |
| JEV-008 | PASS | invalid choice list, exit 2 |
| JEV-009 | PASS | exit 2 without endpoint, exit 3 with one and no key |
| JEV-010 | PASS | `API connection failed`, exit 4 |
| JEV-011 | PASS | sentinel count `0` |
| JEV-012 | PASS | exit 3 (single option not refused by the CLI) |
| JEV-013 | PASS | exit 3 (single level not refused by the CLI) |
| JEV-014 | PASS | `invalid JEV_PROVIDER`, exit 2 |
| JEV-015 | PASS | exit 3 for both `run -` forms |
| JEV-016 | PASS | `must be an object containing state and questions`, exit 2 |
| JEV-017 | PASS | vitest: `jev noul` and `jev-mcp` resolve to `cli-jev` |
| JEV-018 | PASS | vitest: prose occurrences resolve to `null` |
| JEV-019 | PASS | `node --test`: fixture pairs flip, bijection guard green |
| JEV-020 | PASS | four tools, required sets as documented |
| JEV-021 | SKIP | unauthenticated half observed (exit 3, credential error); the authenticated half needs a key |
| JEV-022 | SKIP | blocker: no provider credential, so no live judgment per type |

---

## 3. RAW EVIDENCE

- `specs/cli-external-orchestration/074-cli-jev-creation/001-jev-contract-research-and-pin/scratch/probe-matrix.txt`
- `specs/cli-external-orchestration/074-cli-jev-creation/001-jev-contract-research-and-pin/scratch/probe-surface.txt`
- `specs/cli-external-orchestration/074-cli-jev-creation/001-jev-contract-research-and-pin/scratch/mcp-probe.py`

The two `.txt` files are the captured matrices; each entry carries the command, the exit status,
stdout and stderr as observed.

---

## 4. DELTA AGAINST BASELINE

This is the packet's first run, so it is its own baseline. The next run compares against the table
above, and any row that moves is reported with its cause.
