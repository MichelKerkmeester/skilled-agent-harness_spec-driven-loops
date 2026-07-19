---
title: Code Review Quick Reference
description: Lightweight index for review core doctrine and single-pass review UX guidance.
trigger_phrases:
  - "code review quick reference"
  - "review reference map"
  - "split review references index"
  - "which review checklist to load"
importance_tier: normal
contextType: general
version: 1.5.0.15
---

# Code Review Quick Reference

Lightweight index for the split review references in this skill.

---

## 1. OVERVIEW

### Purpose

Route review consumers to the correct reference file based on their intent. This file replaces the former monolithic quick reference with a split architecture: shared doctrine in `review-core.md` and interactive UX rules in `review-ux-single-pass.md`.

### Usage

Use this file as an entry index, not as the primary source of review rules. Load the specific reference that matches your mode:
- **Both modes** (single-pass and deep review): Load `review-core.md`
- **Interactive single-pass only**: Also load `review-ux-single-pass.md`
- **Deep review only**: Core doctrine is loaded via the `@deep-review` agent contract

---

## 2. REFERENCE MAP

| Reference | Scope | Consumers |
|-----------|-------|-----------|
| [review-core.md](./review-core.md) | Shared doctrine: severity, evidence, findings schema, baseline+surface precedence | `@review`, `@deep-review` |
| [review-ux-single-pass.md](./review-ux-single-pass.md) | Interactive UX: report flow, next-step prompts, PR/pre-commit guidance | `@review` only |

---

## 3. SUPPORTING CHECKLISTS

| Checklist | Purpose |
|-----------|---------|
| [security-checklist.md](../assets/security-checklist.md) | Security, reliability, and abuse-prevention checks |
| [code-quality-checklist.md](../assets/code-quality-checklist.md) | Non-security correctness, KISS, and DRY checks |
| [solid-checklist.md](../assets/solid-checklist.md) | Architecture and SOLID (SRP/OCP/LSP/ISP/DIP) checks |
| [removal-plan.md](../assets/removal-plan.md) | Safe-now versus deferred deletion planning |
| [test-quality-checklist.md](../assets/test-quality-checklist.md) | Test quality, coverage, and anti-pattern detection |

Surface portability: apply this baseline with `sk-code` surface evidence.

---

## 4. RELATED RESOURCES

- [SKILL.md](../SKILL.md) - Parent skill definition with activation triggers and resource loading rules
- [review-mode-contract.yaml](../../../system-deep-loop/deep-review/assets/review-mode-contract.yaml) - Canonical review-mode contract manifest (source of truth for deep review taxonomy)

---
