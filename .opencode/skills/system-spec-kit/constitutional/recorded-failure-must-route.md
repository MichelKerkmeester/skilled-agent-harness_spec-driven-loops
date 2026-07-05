---
title: "Recorded Failure Must Route to a Follow-up"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-07-05"
last_confirmed_source: "008-speckit-surface-alignment/014-recorded-failure-closure"
triggerPhrases:
  - detector fired
  - scenario failed
  - contradiction
  - follow-up
  - unactioned
  - recorded failure
  - governance scenario
  - flag drift
  - already caught it
---

# Recorded Failure Must Route to a Follow-up

## Rule

A detector that fires — a governance scenario that records a FAIL, a loop that flags a contradiction, a validator that emits a warning — is NOT closed by being written down. Unless it is linked to a routed remediation (a tracked follow-up, a spec task, or an explicit accepted-risk decision), it is a HALT-and-record: surface it, and never let a "recorded" status read as "handled".

## Why

The surface-alignment audit found detectors that fired and were faithfully recorded, then sat unactioned: a governance scenario caught the feature-flag-catalog drift and wrote "17 flags missing", and a deep-research loop logged an iteration-cap contradiction "for operator follow-up" — both recorded, neither closed. This is a distinct failure class from "no detector exists" (which a validation gate fixes): here the detector worked and the closure route was missing. A recorded-but-unrouted failure is the most deceptive kind, because the record itself signals diligence while the defect persists.

## How to apply

- When a scenario / validator / loop records FAIL, contradiction, drift, or "follow-up", link it to a remediation in the same pass — a spec task, a tracked issue, or an explicit accepted-risk decision-record. A record without a route is incomplete work, not evidence of work.
- Before claiming a governance/alignment sweep complete, run the surfacer `scripts/validation/unactioned-recorded-failure-audit.mjs` over recorded transcripts and loop-state; an unactioned hit blocks the completion claim.
- Treat "the detector already caught it" as evidence the route is MISSING, not that the work is done.
