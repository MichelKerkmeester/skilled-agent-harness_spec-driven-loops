---
name: fixture-mode-template
description: A synthetic mode packet whose router is built to the skill router template.
allowed-tools: [Read, Grep, Glob]
version: 1.0.0.0
---
# Mode Template Fixture

## 1. WHEN TO USE

Use this fixture to exercise a router that names its intent map `INTENT_MODEL` and keys it in
lowercase, which is the spelling the mode template allows and the replay reader does not read.

## 2. SMART ROUTING

Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.
