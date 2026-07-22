---
title: AI Slop Check
description: Private procedure card for design-audit review of generic AI-template aesthetics and correction routing.
trigger_phrases:
  - "ai slop check"
  - "generic template review"
  - "anti slop audit"
importance_tier: normal
contextType: implementation
version: 1.0.0.1
---

# AI Slop Check

Private procedure card for applying the existing design-audit anti-slop review workflow.

## 1. OVERVIEW

Use this read-only procedure after a design direction exists and before an anti-slop verdict. It establishes intent first, then applies narrow presentation probes, records evidence and exceptions, and routes any supported finding through the existing audit contract.

## 2. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `design-audit` detect generic AI-template aesthetics and route corrections without treating style tropes as neutral defaults. |
| Owning mode | `design-audit` |
| Source reference | `ai-slop-check.md` |
| Trigger | Use when a surface looks generic, AI-generated, templated, over-decorated, or when the user asks for anti-slop review. |
| Output contract | A findings list covering gradients, emoji, default cards, imagery, type defaults, harsh whites/blacks, untraced colors, off-scale spacing, and default warm-editorial patterns. |
| Proof gate | Each finding names the detected pattern, evidence location or artifact, design impact, severity, owner, and a concrete fix direction. |
| Privacy rule | This is private audit guidance and does not create a public AI-slop skill. |

## 3. READ-ONLY COMPATIBILITY

`design-audit` can report findings from files or supplied artifacts and route fixes without requiring edits or command execution.

## 4. PROCEDURE

1. Resolve the surface to review and read relevant styles or artifacts.
2. Run the six-axis pre-emit self-critique first. Record one evidence row for each axis—intent/philosophy, hierarchy, execution, brief specificity, restraint, and structural distance—with `ready`, `blocked`, or `not-assessed`. Resolve blocked axes or carry the limitation into the audit; do not replace missing evidence with a score.
3. Only after that critique, run the targeted presentation sweep in `../references/anti-patterns-production.md` and the AI-navigation / AI-footer fingerprint probes in `../references/ai-fingerprint-tells.md`.
4. Continue the broad scan for generic gradients, decorative emoji, default card patterns, weak imagery, overused type defaults, harsh black/white pairing, untraced colors, off-scale spacing, and overfamiliar warm-editorial combinations.
5. Treat each detection as a hypothesis backed by evidence, not as a blanket ban.
6. Keep legitimate brand or system choices when evidence supports them.
7. Map each correction to interface, foundations, motion, or `sk-code`, using the evidence-first P0-P3 model in `../references/audit-contract.md`.

The order is deliberate: the six-axis critique establishes whether the design has a coherent intent before narrow pattern matching begins. The probe sweep can sharpen findings, but it cannot overturn a supported exception or turn a clean checklist into proof of quality.

## 5. RELATED CARDS

- `../../design-foundations/procedures/hierarchy-rhythm-review.md` for scale and hierarchy cleanup.
- `../../shared/procedures/polish-gate-orchestration.md` for final delivery review.
