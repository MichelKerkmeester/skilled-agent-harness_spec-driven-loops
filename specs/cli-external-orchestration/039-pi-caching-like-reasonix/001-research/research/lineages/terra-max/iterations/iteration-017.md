# Iteration 017 — Checkpoint scope and risk

## Focus

What would real checkpoint/rewind require beyond Pi’s session tree?

## Evidence

- Pi’s documented session operations cover conversation branches and compaction; this lineage found no primary evidence of atomic working-directory snapshot and restoration. [SOURCE: https://pi.dev/docs/latest/sessions]

## Assessment

A true workspace checkpoint needs explicit filesystem or VCS snapshot semantics, locking, retention, and recovery rules. That is high-risk scope and should not be bundled into a cache plugin.

## New Signal

Broadened the recovery angle after cache evidence began converging. The preliminary convergence score is 0.07; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
