---
title: "cli-deem: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the cli-deem transport."
trigger_phrases:
  - "cli-deem feature catalog"
  - "cli-deem capabilities"
  - "deem judgment subcommands"
  - "feature catalog"
last_updated: "2026-09-28"
version: 0.1.0.0
---

# cli-deem: Feature Catalog

This document combines the current feature inventory for the `cli-deem` transport into a single reference. The root catalog acts as the directory: it summarizes each capability area, describes what the client does today and points to the per-feature files that carry the implementation and test anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `cli-deem` surface. `cli-deem` is one Node file, `scripts/cli-deem.mjs`, with five subcommands. The sections below group them into the availability check and the judgment subcommands.

---

## 2. AVAILABILITY CHECK

### Health check

#### Description

Checks the local Deem server and prints the backend, the model id and the commit pair. It refuses the stub backend and any model id other than deem-0.8-v1.

#### Current Reality

`cli-deem health` reads `GET /health` within 2,000 ms. `--hook` shortens that to 500 ms. It then reads the commit pair from the install on disk. Exit 0 means Deem is usable for this run. Exit 3 means a refused backend and exit 4 means an unreachable server.

#### Source Files

See [`availability-check/health-check.md`](availability-check/health-check.md) for full implementation and test file listings.

---

## 3. JUDGMENT SUBCOMMANDS

### Noul probability

#### Description

Asks Deem a yes/no question about a state and returns the probability as noul.

#### Current Reality

`cli-deem noul` sends the question as `instructions` and renames Deem's `value` to `noul` in the answer.

#### Source Files

See [`judgment-subcommands/noul-probability.md`](judgment-subcommands/noul-probability.md) for full implementation and test file listings.

---

### Choice selection

#### Description

Asks Deem to pick one of the keyed options and returns the submitted key.

#### Current Reality

`cli-deem choice` sends the option descriptions as an `options` list and maps the chosen description back to its key. It refuses more than 26 options, a duplicate description and a duplicate key before sending.

#### Source Files

See [`judgment-subcommands/choice-selection.md`](judgment-subcommands/choice-selection.md) for full implementation and test file listings.

---

### Score level

#### Description

Asks Deem to place a state on an ordered scale and returns the zero-based position as score.

#### Current Reality

`cli-deem score` sends the levels as a `levels` list. It replaces Deem's `level` text with its position and keys the probabilities by position.

#### Source Files

See [`judgment-subcommands/score-level.md`](judgment-subcommands/score-level.md) for full implementation and test file listings.

---

### Batched run

#### Description

Sends a request file written in Deem's own shape and returns every answer in the jev field names.

#### Current Reality

`cli-deem run` reads a request file or stdin, refuses more than 64 questions before sending and translates each answer by its type.

#### Source Files

See [`judgment-subcommands/batched-run.md`](judgment-subcommands/batched-run.md) for full implementation and test file listings.
