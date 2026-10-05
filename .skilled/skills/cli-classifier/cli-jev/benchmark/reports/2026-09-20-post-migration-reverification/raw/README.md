---
title: "Raw Evidence: Post-Migration Re-Verification"
description: "Raw captures, probe scripts and comparers from the post-migration re-verification run that backs the report beside this folder."
---

# Raw Evidence: Post-Migration Re-Verification

---

## 1. OVERVIEW

`raw/` holds the raw evidence of the [post-migration re-verification report](../skill-benchmark-report.md) beside it: the probe scripts, the captured transcripts and the comparers used to diff the re-run against the baseline. The scripts are kept exactly as they were run and are not meant to be rerun as tools.

Current state:

- Each script preserves the run that produced the report, not a reusable utility.
- The transcripts are the record of the routes, exit codes, values and lint decisions the report cites.

---

## 2. CONTENTS

| File | Holds |
|------|-------|
| `auth-probe.sh` | Probes the authenticated surface: auth status and test plus the judgment verbs against the stored credential. |
| `auth-probe.txt` | Captured output of the authenticated probes with their return codes. |
| `compare-surface.py` | Diffs the re-run surface capture against the baseline, section by section. |
| `compare.py` | Diffs the re-run probe matrices against the baseline, label by label. |
| `dispatch-audit-live.txt` | Live run of the dispatch audit test suite from the migrated home. |
| `leak-check.py` | Value-blind check that no store token appears in any capture. |
| `mcp-probe.py` | Stdio handshake that prints the tools `jev-mcp` advertises. |
| `preflight-probe.sh` | First dispatch preflight pass: one lint decision per hard-rule case. |
| `preflight-probe.txt` | Captured lint decisions of the first preflight pass. |
| `preflight-probe2.sh` | Second preflight pass over the rule boundaries and the declared legal controls. |
| `preflight-probe2.txt` | Captured lint decisions of the second preflight pass. |
| `probe-matrix.sh` | Runs the CLI matrix with the provider variables cleared and an empty credential store. |
| `probe-matrix.txt` | Captured matrix output with the sentinel leak control. |
| `probe-surface.sh` | Captures the help surfaces, a valid run payload and the MCP tool list. |
| `probe-surface.txt` | Captured help texts, run payload results and the MCP tool list. |
| `rule-checks.txt` | Test output for the dispatch preflight hard rules. |

---

## 3. RELATED

- [`skill-benchmark-report.md`](../skill-benchmark-report.md), the report these captures back.
