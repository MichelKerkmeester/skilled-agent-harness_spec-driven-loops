---
title: "Raw Evidence: Hub-Routing Phrasings"
description: "Raw captures of the hub-routing corpus re-run that backs the hub-routing phrasings report beside this folder."
---

# Raw Evidence: Hub-Routing Phrasings

---

## 1. OVERVIEW

`raw/` holds the raw evidence of the [hub-routing phrasings report](../skill-benchmark-report.md) beside it: the script that re-ran the corpus after the jev-dispatch class gained its verb and preposition phrasings, and the transcript it produced. The scripts are kept exactly as they were run and are not meant to be rerun as tools.

Current state:

- Each script preserves the run that produced the report, not a reusable utility.
- The transcript is the record of the routes, exit codes and values the report cites.

---

## 2. CONTENTS

| File | Holds |
|------|-------|
| `hub-routing-run.sh` | Re-runs the corpus over CJ-001's six advertised phrasings, CJ-002, CJ-003 with its holdout, out-of-domain replays and the compiled-route guard. |
| `hub-routing.txt` | The captured transcript: per-case prompts, routes and return codes plus the guard result. |

---

## 3. RELATED

- [`skill-benchmark-report.md`](../skill-benchmark-report.md), the report these captures back.
