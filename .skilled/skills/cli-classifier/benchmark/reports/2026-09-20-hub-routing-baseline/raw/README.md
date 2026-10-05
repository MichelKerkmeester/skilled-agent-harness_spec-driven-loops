---
title: "Raw Evidence: Hub-Routing Baseline"
description: "Raw captures of the hub-routing corpus run that backs the hub-routing baseline report beside this folder."
---

# Raw Evidence: Hub-Routing Baseline

---

## 1. OVERVIEW

`raw/` holds the raw evidence of the [hub-routing baseline report](../skill-benchmark-report.md) beside it: the script that ran the corpus from the migrated hub home and the transcript it produced. The scripts are kept exactly as they were run and are not meant to be rerun as tools.

Current state:

- Each script preserves the run that produced the report, not a reusable utility.
- The transcript is the record of the routes, exit codes and values the report cites.

---

## 2. CONTENTS

| File | Holds |
|------|-------|
| `hub-routing-run.sh` | Runs the hub-routing corpus against the compiled front door, then records each route, the kill-switch control and the packet judgment. |
| `hub-routing.txt` | The captured transcript: per-case prompts, routes and return codes plus the judgment value. |

---

## 3. RELATED

- [`skill-benchmark-report.md`](../skill-benchmark-report.md), the report these captures back.
