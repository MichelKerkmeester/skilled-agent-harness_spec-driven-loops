<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 4 — Accessibility, visual hardening, and device proof

## Summary

This phase closes the remaining quality risks at real mobile dimensions and proves the feature against the target interaction density on a real standalone iPhone. It adds no new product behavior; it verifies accessibility, redaction, responsive styling, motion, screenshots, and device recovery paths on top of the completed slices.

## Problem & Goal

A visually correct desktop-narrowed view is insufficient for this mobile feature: focus, VoiceOver, large text, safe areas, RTL, reduced motion, contrast, and recovery states must be proven on the actual target surfaces. The goal is a final evidence pass showing that all acceptance criteria hold at 320px/390px and on an enrolled iPhone without weakening the fixed design system or security posture.

## Scope

### In scope

- Final accessibility and internationalization assertions for the sheet and radio group.
- Contrast, reflow, text inflation, zoom, RTL, reduced-motion, keyboard-viewport, safe-area, and light/dark verification.
- Fixture coverage and true 390px CDP screenshots for all listed runtime states.
- Manual standalone PWA verification on a real enrolled iPhone, including VoiceOver and recovery paths.
- Redacted evidence recording and final security/Plan-mode isolation review.

### Out of scope

- New product behavior or a new interaction model.
- Changes to the fixed bone/carbon/clay design system, Inter/Source Serif 4 typography, light/dark themes, or WCAG AA baseline.
- Mid-turn effort semantics, defaults, cost metadata, adaptive widgets, per-level host reasons, new authority, or automatic replay.

## User-facing behavior + states

The shipped surface remains the Phase 3 sheet and Phase 2 state machine. It must be usable and announce outcomes correctly in closed, model-open, effort-open, pending, streaming, offline, stale, and delivery-unknown states across light/dark, 320px/390px, 200% zoom, large text, RTL, reduced motion, keyboard-open, and safe-area conditions. VoiceOver announces pending, accepted, stale, and failure outcomes once through the single polite atomic status region; raw host text and competing alerts are absent.

## Acceptance criteria

- All acceptance criteria in `spec.md` have a recorded automated or manual check result; no criterion is waived because the screenshot looks correct.
- VoiceOver announces pending, accepted, stale, and failure outcomes once, with no raw host text and no competing alert.
- The sheet is usable at 320px, 390px, 200% zoom, large text, RTL, reduced motion, light, dark, and safe-area conditions.
- A final security review confirms no new authority, no ticket leakage, no automatic replay, no optimistic commit, no Plan-mode bypass, and no redaction regression.
- The shipped feature is limited to the synthesis decision; mid-turn semantics, defaults, cost metadata, adaptive widgets, and per-level host reasons remain explicitly deferred.

## Security & Redaction

Accessibility trees, screenshots, logs, and diagnostics are data surfaces. Host strings, issue codes, raw IDs, tickets, cookies, enrollment payloads, paths, secrets, raw host responses, and prompt text must not appear in evidence. Verify that only the existing explicit, ticketed, revision-checked mutation path can change effort; no automatic replay, optimistic commit, authority transfer, tool approval, Build enablement, or Plan-mode bypass is introduced. Preserve the fixed read-only-by-default posture and record only redacted test evidence.

## Dependencies & affected areas

- `apps/pi-remote-web/src/ModelEffortSheet.tsx`
- `apps/pi-remote-web/src/EffortRadioGroup.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/tests/contrast.test.tsx`
- Sheet/radio component tests under `apps/pi-remote-web/tests/`
- The project’s web CDP verification harness and fixture setup
- A real enrolled iPhone running the standalone PWA
- Existing typecheck, repository, web, contrast, accessibility, relay/security, and runtime suites

This phase depends on the Phase 1 protocol/relay contract, Phase 2 runtime lifecycle, and Phase 3 canonical sheet. No new third-party UI primitive or authority is introduced.
