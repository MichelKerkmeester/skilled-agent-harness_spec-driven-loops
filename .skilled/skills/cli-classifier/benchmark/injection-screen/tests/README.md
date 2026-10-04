---
title: "Injection screen tests"
description: "Node test cases for the injection-screen scorer, run against fixture repositories and a stub jev binary."
trigger_phrases:
  - "injection screen tests"
  - "score-injection-screen tests"
  - "injection screen fixture tests"
---

# Injection screen tests

---

## 1. OVERVIEW

`tests/` holds one self-running Node test file for the injection-screen scorer. It drives `score-injection-screen.mjs` through the exports that file publishes and through its `main` entrypoint, then asserts the printed lines, the exit codes and the written files.

Every case runs against a fixture repository in the OS temp directory and a stub `jev` binary placed first on `PATH`. Three cases also put a stand-in Pi package ahead of it, whose runtime answers in-process, to check the Pi route. No case reaches a real backend, and the file holds no credential.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `score-injection-screen.test.mjs` | Tests tracked paths and head commit, the fetch census, section splitting, corpus walking and its dotenv refusal, lexical hits, seeded draws, planted insertion, the 90-row label gate, baseline headroom, the keep, kill and stop verdict rules, the backend gate and arm on a stub binary, and the model the verdict and each call record name on the CLI, Pi and mixed routes. |

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
```

Expected result: every case passes and the runner prints its passing summary. The parent README documents the same command.

---

## 4. RELATED

- [`Injection screen`](../README.md)
- [`cli-classifier Benchmark Artifacts`](../../README.md)
