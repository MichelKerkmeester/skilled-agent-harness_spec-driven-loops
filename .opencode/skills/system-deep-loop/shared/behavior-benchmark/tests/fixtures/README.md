---
title: "Behavior Benchmark Test Fixtures: synthetic scenario and golden data"
description: "Fixture data consumed by the behavior-bench-run hermetic test suite so it runs without a live model session."
---

# Behavior Benchmark Test Fixtures

---

## 1. OVERVIEW

Fixture data consumed by `../behavior-bench-run.test.cjs`. Provides a smoke scenario contract, a fake executor leg and a frozen golden result map so the hermetic test suite exercises the real runner CLI without spawning a live model session.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `SMOKE-000-fake.md` | Hermetic smoke scenario contract (schema v1). The test repoints its `fixture` path at a runtime tmp directory and writes a scenario file from this contract before invoking the runner. |
| `fake-leg.js` | Stand-in executor leg, run as an ES module. Prints the presentation marker, emits one task-dispatch line and writes one fixture artifact, then exits 0. A `FAKE_LEG_HANG` mode prints one line then idles forever to exercise the runner's watchdog kill path. |
| `dab-v1-golden.json` | Frozen scored dimensions and classification for the eleven original `DAB-001..011` v1 scenarios, used as a regression pin against the live alignment scenarios. |

## 3. RELATED

- [`../README.md`](../README.md)
- [`../behavior-bench-run.test.cjs`](../behavior-bench-run.test.cjs)
