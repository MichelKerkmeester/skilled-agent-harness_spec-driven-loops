---
title: sk-code-ci
description: GitHub Actions workflow rules with their evidence, the protected workflow set, the recorded trigger exception and two scaffold templates: read-only evidence for the sk-code hub, bundled beside a workflow mode and never routed as a primary.
trigger_phrases:
  - "github actions workflow standards"
  - "ci workflow rules"
  - "workflow yaml evidence"
version: 1.0.0.0
---

# sk-code-ci

> A workflow change lands with the repository's own rules already attached: which filter to use, what timeout to size, which workflows never to weaken and which trigger only looks like drift.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Packet kind** | `surface`, backend `evidence-base`, read-only |
| **Tools** | `Read, Bash, Grep, Glob` |
| **Use it for** | Adding, editing or reviewing a GitHub Actions workflow, composite action or workflow script |
| **Invoke with** | No direct invocation. The sk-code hub bundles it beside a workflow mode when a request is about a workflow |
| **Advisor** | invisible (`routingClass: metadata`) |
| **Bundled with** | `sk-code-quality` when authoring, `sk-code-review` when reviewing |
| **Produces** | The rule evidence, the protected set, the exception record and the scaffold templates. The packet itself edits nothing |

---

## 2. OVERVIEW

### Why This Surface Exists

The repository's workflows follow a set of rules that live mostly in review memory. Only path parity between the two source roots is checked by a machine. SHA pinning, a README row per workflow, timeouts, least-privilege permissions, concurrency and the cached setup action are conventions that nothing enforces. Two further facts are easy to misread: a rebuild commit must not start the downstream workflows, and `message-contract.yml` deliberately pushes on every branch.

Without one written source a reviewer cannot tell a deliberate trigger from drift, and an author starts a new workflow from a copy of the nearest one, inheriting its gaps.

### What It Does

The packet states each rule next to the file and line that prove it and says whether anything enforces it. It lists the workflows protected by function, so a change that would weaken one asks for a second confirmation first. It records message-contract's every-branch push trigger as an intentional exception, with the reason, so a report does not flag it. It also holds a whole-workflow template and a job template that start compliant.

The packet never writes. The acting mode or a doctor command applies any change it recommends.

---

## 3. REFERENCE MAP

| File | Carries |
|---|---|
| `references/ci-workflow-standards.md` | The rule index: path parity, SHA pins, README row, `set -euo pipefail`, fork and secret safety, matrix and `fail-fast` |
| `references/trigger-and-filter-rules.md` | The twin rule, the rebuild-commit skip rule, push-only scope and the intentional exceptions table |
| `references/job-shape-rules.md` | Timeouts, permissions, the concurrency template, the composite setup action and the switch `if:` shape |
| `references/protected-set.md` | The workflows protected by function and the rules that follow |
| `assets/workflow-template.yml` | Whole-workflow scaffold |
| `assets/job-block-template.yml` | Single-job scaffold |
| `manual-testing-playbook/` | The routing scenario the hub's router-sync guard replays |

The implement, debug and verify doctrine is symlinked in from `../shared/references/`.

---

## 4. VERIFICATION

| Check | How to run it |
|---|---|
| Hub gate | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` exits 0 |
| Drift guards | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0 |
| Compiled route | `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` exits 0 |
| Playbook replay | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4` exits 0 |
