---
title: "M-010 -- Runtime Lineage Naming Parity"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-010`."
version: 3.6.0.16
---

# M-010 -- Runtime Lineage Naming Parity

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-010`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-010`.
- Real user request: `` Please validate Runtime Lineage Naming Parity against the documented validation surface and tell me whether the expected signals are present: all diff commands produce no output; rg finds no active `research/research.md`. ``
- Prompt: `Validate Runtime Lineage Naming Parity against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: all diff commands produce no output; rg finds no active `research/research.md`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: normalized basenames match and no stale naming.

---

## 3. TEST EXECUTION

### Prompt

`Validate Runtime Lineage Naming Parity against the documented validation surface and report cited pass/fail evidence.`
### Commands

```bash
  diff -u <(find .opencode/agent -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort) <(find .claude/agents -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort)
  diff -u <(find .opencode/agent -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort) <(find .opencode/agents -maxdepth 1 -type f -name '*.toml' -exec basename {} \; | sed 's/\.toml$/.md/' | sort)
  rg -n 'research\.md' .opencode/agent .claude/agents .opencode/agents
  ```
### Expected

all diff commands produce no output; rg finds no active `research/research.md`.
### Evidence

diff output (empty on pass) and rg output (empty on pass).
### Pass/Fail

normalized basenames match and no stale naming.
### Failure Triage

any mismatch or `research/research.md` hit; collect diff output and identify divergence.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling-and-scripts/source-dist-alignment-enforcement.md](../../feature_catalog/tooling-and-scripts/source-dist-alignment-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling-and-scripts/runtime-lineage-naming-parity.md`
