---
title: Phase Detection and Lifecycle
description: The sk-code phase lifecycle from research through the Phase 1.5 quality gate to verification, its iron laws and the evidence each surface supplies per phase.
trigger_phrases:
  - "sk-code phase lifecycle"
  - "phase detection routing"
  - "implementation testing verification phases"
  - "per surface phase map"
importance_tier: normal
contextType: general
version: 1.6.1.0
---

# Phase Detection and Lifecycle

Every sk-code task that changes code moves through the same gated phases, from research to verified completion. This reference names the phases, the doc that owns each one, the evidence each surface supplies and the laws no phase may skip.

---

## 1. OVERVIEW

### Purpose

Keep research, implementation, the quality gate, debugging and verification in a fixed order, so no task reaches "done" on a skipped gate. The active surface changes which resources and evidence each phase uses. It never changes the order or the gates.

### When to Use

- Planning code work on any sk-code surface.
- Choosing which phase doctrine and checklists to load next.
- Routing a failed quality or verification gate back to debugging or implementation.
- Judging whether the completion evidence is enough to claim "done".

### Core Principle

A phase ends on evidence, not on effort. The next phase starts only when the current one has produced what its exit condition names.

### Key Sources

- [stack-detection.md](./stack-detection.md) selects the surface. It returns SKILLED or UNKNOWN and never `sk-code-ci`, which the hub bundles from request vocabulary alone (`code-ci-aliases` and `code-ci-runtime` in `hub-router.json`).
- `mode-registry.json` declares the workflow modes (`sk-code-quality`, `sk-code-review`) and the surfaces (`sk-code-ci`, `sk-code-skilled`).

---

## 2. PHASE MAP

```text
Phase 0   Research        optional for simple edits, required for complex or risky work
Phase 1   Implementation
Phase 1.5 Code Quality Gate
Phase 2   Debugging       entered when a check fails
Phase 3   Verification
done      only with recorded verification evidence
```

Implement, debug and verify are not modes. Their doctrine lives once in `shared/references/workflow-*.md`, and each surface reaches it through a symlink in its own `references/` folder.

| Phase | Owner | What the phase produces |
| --- | --- | --- |
| 0 Research | [workflow-implement.md](./workflow-implement.md) §2 Research | Target files read, every place the change must reach listed, a plan |
| 1 Implementation | [workflow-implement.md](./workflow-implement.md) | The smallest correct change, plus a baseline and blast-radius note |
| 1.5 Code Quality Gate | `sk-code-quality` mode, [code-quality-standards.md](./universal/code-quality-standards.md) | P0 items pass, P1 items fixed or approved for deferral |
| 2 Debugging | [workflow-debug.md](./workflow-debug.md) | A named root cause and a fix that addresses that one cause |
| 3 Verification | [workflow-verify.md](./workflow-verify.md) | Fresh command output, exit codes and the delta from baseline |

`sk-code-review` runs outside this lifecycle. It writes no tracked file, so it has no Phase 1 and reports findings instead.

---

## 3. PER-SURFACE EVIDENCE

Surface precedence decides which table applies. `sk-code-skilled` is the fallback surface and is checked last. Any other surface that matches the task outranks it, including a private `local-*` surface skill where one is installed. When no surface matches, the surface is UNKNOWN and iron law 3 applies.

### SKILLED (`sk-code-skilled`)

| Phase | Resources and evidence |
| --- | --- |
| 0 Research | `sk-code-skilled/references/shared/`, the affected skill, agent or command and the bound spec folder |
| 1 Implementation | `sk-code-skilled/references/shared/` plus the detected language folders from [stack-detection.md](./stack-detection.md) §3 |
| 1.5 Code Quality | `sk-code-skilled/assets/checklists/universal-checklist.md` plus the checklist for each touched language |
| 2 Debugging | Root-cause analysis, the failing command's output, language-specific patterns |
| 3 Verification | The drift-guard umbrella, plus targeted tests and spec validation |

The drift-guard umbrella runs four guards in one pass: alignment drift, stack folders, router sync and doc claims. It prints one PASS or FAIL line per guard and exits non-zero if any fails.

```bash
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
```

### CI (`sk-code-ci`)

| Phase | Resources and evidence |
| --- | --- |
| 0 Research | `sk-code-ci/references/protected-set.md`, then the workflow files the change touches |
| 1 Implementation | `sk-code-ci/assets/workflow-template.yml` or `job-block-template.yml`, plus the trigger, filter and job-shape rules |
| 1.5 Code Quality | The rule index in `sk-code-ci/references/ci-workflow-standards.md` |
| 2 Debugging | The failing workflow run and the rule it broke |
| 3 Verification | The machine gate the rule index names for each rule, plus a reviewer read for every honour-system rule |

The CI surface writes nothing. The acting agent applies its rules, and a rule the index marks honour-system has no check behind it, so only a careful read catches a lapse.

---

## 4. IRON LAWS

These hold on every surface and in every mode. No phase transition relaxes them.

1. **No completion claim without Phase 3 verification evidence.** A clean read, a green unit test or a successful build each prove less than the claim "it works", so only fresh verification output counts.
2. **No Phase 1 completion claim without the Phase 1.5 quality gate.** Written code is unreviewed code until its P0 items pass.
3. **No claim about an unsupported surface.** An UNKNOWN surface gets the universal floor in [code-quality-standards.md](./universal/code-quality-standards.md), the quality runner's built-in checks and the checks and checklists the repository's quality config names, each with its overrides applied under [rule-overrides.md](./universal/rule-overrides.md). That config can come from `--config`, the git config key `skcode.qualityConfig` or `repository/quality.json` in the `sk-code-quality` packet, and it never supplies a verification command, so the command set still comes from [workflow-verify.md](./workflow-verify.md), which asks for it. The spec-folder authoring checklist applies only where the SKILLED surface resolves. No other standard and no discovered command applies.

---

## 5. TRANSITIONS

| From | To | Condition |
| --- | --- | --- |
| 0 | 1 | Enough context and a plan exist. For implementation intent, the Phase 0 to 1 gate also requires choosing the laziest viable rung of the Design Restraint Ladder in [code-quality-standards.md](./universal/code-quality-standards.md) before any new code |
| 1 | 1.5 | Code was written or changed |
| 1.5 | 2 | A P0 quality issue or a failing check was found |
| 2 | 1.5 | A fix was applied, so the gate runs again on the changed code |
| 1.5 | 3 | Every P0 item passes, and each P1 item is fixed or approved for deferral |
| 3 | 1 | Verification finds required behavior missing or build work incomplete |
| 3 | 1.5 | An author-side check, comment hygiene or a checklist issue blocks verification |
| 3 | 2 | A command, runtime check or test fails, or a test proves nothing |
| 3 | done | Verification evidence is recorded |

---

## 6. RELATED RESOURCES

- [ROUTER.md](../../ROUTER.md) maps intent to resources and declares this file part of the always-loaded preamble.
- [stack-detection.md](./stack-detection.md) covers surface detection and SKILLED language sub-detection.
- [`../../sk-code-quality/SKILL.md`](../../sk-code-quality/SKILL.md) runs the Phase 1.5 gate.
- [`../../sk-code-ci/SKILL.md`](../../sk-code-ci/SKILL.md) holds the CI rule evidence and the protected set.
