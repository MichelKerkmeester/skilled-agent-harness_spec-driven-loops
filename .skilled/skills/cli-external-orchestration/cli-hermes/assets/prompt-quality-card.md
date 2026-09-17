---
title: Hermes CLI - Prompt Quality Card
description: Thin Hermes dispatch delegator. The canonical prompt-models packet owns framework selection and quality checks.
trigger_phrases:
  - "hermes prompt quality card"
  - "hermes dispatch prompt discipline"
  - "hermes prompt framework selection"
  - "hermes clear check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Hermes CLI - Prompt Quality Card

**Two-tier precedence rule: sk-prompt framework first, this card's Hermes dispatch addenda second.**

This is a thin delegator. The canonical prompt-models packet owns the framework table, task mapping, density guidance, anti-hallucination checks, and CLEAR questions. This card adds only mechanics specific to constructing a safe Hermes dispatch.

## 1. OVERVIEW

This card is the Hermes-specific layer over the canonical prompt-quality card: framework choice and quality checks stay canonical, and only the mechanics of a safe Hermes dispatch live here.

---

## 2. CANONICAL SOURCE

Load:

- [Canonical CLI prompt-quality card](../../../sk-prompt/assets/cli-prompt-quality-card.md)

Do not copy the canonical taxonomy into this card. Do not create a second STAR, BUILD, ATLAS, or CONTEXT table here.

---

## 3. HERMES DISPATCH ADDENDA

### Persona goes in the prompt body

Hermes has no native persona surface for a headless chat. Profiles are whole-home islands and `delegate_task` children receive goal and context only, so the resolved agent persona is inlined at the top of the payload, after the child-dispatch preamble, exactly as `cli-codex` and `cli-pi` do. A persona-less leaf runs as a generic assistant and drops its tool scope, verification gates and output contract.

### The prompt travels on stdin or in a file

Use `--query-file <path>` for any prompt longer than a sentence, or `--query-file -` to feed stdin. Hermes reads the file verbatim: quotes, `$(...)` and backticks survive. Argv `-q` is for one-line asks only and risks the argv length limit on an iteration brief.

### Say what the leaf may touch

Hermes has no OS sandbox. The prompt states the write surface explicitly (the lineage directory, or the named files). The `-t` toolset list is what makes a run read-only: a review gets `file,todo`, a write leaf gets the leaf roster without `delegation` and `memory`. `--yolo` travels with every write leaf so a step Hermes flags as dangerous is approved instead of blocked; it never travels with a read-only run.

### Name the verification command

Hermes exits 0 on any completed turn, including a partial answer cut by `--run-budget`. The prompt names the command whose output proves completion, and the caller checks that output rather than the exit code alone.

### Never ask the leaf to change Hermes

A dispatched leaf must not run `hermes skills trust`, `hermes mcp add`, `hermes config set`, `hermes plugins install` or `hermes import-agent`. Those are operator steps; a prompt that needs one stops and reports instead.

---

## 4. PRE-DISPATCH CHECKLIST

- [ ] Preamble from `../../shared/references/child-dispatch-preamble.md` on top, spec folder named.
- [ ] Persona inlined; task, files, acceptance criteria and verification command stated.
- [ ] `--yolo` present exactly when the task writes; `--ignore-rules` present; explicit `-t` list without `delegation` and `memory`.
- [ ] Model is `deepseek-v4.1-flash` or `glm-5.3-flash`; provider is `llmgateway`.
- [ ] `--run-budget` under the caller's timeout; stdin fed by `--query-file -` or closed.
