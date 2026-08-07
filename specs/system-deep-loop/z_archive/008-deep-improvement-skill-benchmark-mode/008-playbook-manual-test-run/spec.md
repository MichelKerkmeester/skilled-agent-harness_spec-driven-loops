---
title: "Execute the deep-improvement manual testing playbook (48 scenarios)"
status: not-started
level: 1
---

# 008 — Deep-Improvement Playbook Manual Test Run

## 1. PURPOSE

Run every scenario in `.opencode/skills/deep-improvement/manual_testing_playbook/`
(48 scenarios across 10 categories / 3 lanes) for real in a sandbox, capture
evidence, and produce a PASS/FAIL/SKIP verdict per scenario plus a release
readiness roll-up.

## 2. ENTRY POINT

`handover.md` in this folder is the complete runbook for a fresh agent session:
scenario map, prerequisites, per-scenario execution protocol, wave order,
category-specific gotchas (CP stress-test sandbox seeding + tripwire caveat),
and the results-matrix template.

## 3. SCOPE / OUT OF SCOPE

- In scope: executing the shipped scenarios as written, recording verdicts +
  evidence into `results-matrix.md`, reporting release readiness.
- Out of scope: changing the playbook docs or the skill code. If a scenario
  reveals a real skill bug, record it as a FAIL with evidence — fixing is a
  separate packet.

## 4. ACCEPTANCE

- All 48 scenarios executed or SKIP-with-documented-blocker.
- `results-matrix.md` complete with verdict + decisive evidence per scenario.
- Release-readiness verdict (per the playbook landing §5) stated with its reason.
- Results committed by explicit pathspec (never `git add -A`).
