---
title: "Implementation Plan: Post-rename fallout remediation"
description: "Repoint the stale rename references in the router-sync test; assess the compiled-routing drift and the strict-validation dist against their documented-alternative outcomes."
contextType: "planning"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---
# Implementation Plan: Post-Rename Fallout Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. SUMMARY

Three independent follow-ups. REQ-1 is a scoped test-reference fix. REQ-2 and REQ-3 are investigations that resolve to their spec-permitted documented outcomes (operator-gated / external blocker) rather than risky in-scope changes.

## 2. APPROACH

- **REQ-1:** grep the router-sync test for every pre-rename mode literal and mode-prefixed path (both the `create-*` contract import and the hardcoded `code-*` surfaces), repoint each to the canonical `sk-*` name, and re-run the suite to green.
- **REQ-2:** reproduce the drift, then probe the live serving authority. If the compiled path already falls back to legacy (no live mis-route) and no clean recompile entrypoint exists, document it as an operator-gated recompile rather than driving the gated pipeline by hand.
- **REQ-3:** attempt the dist rebuild; if it fails on the in-flight `hooks/pi/*.ts`, record the exact errors and leave the rebuild to that program / CI.

## 3. VERIFICATION

- REQ-1: `npx vitest run …/sk-code-router-sync.vitest.ts` → all pass; 0 stale literals remain.
- REQ-2: `compiled-route-status --hub sk-doc` shows the live authority; parity reproduces the drift count.
- REQ-3: `npm run build` in the mcp-server captures the blocking errors.

## 4. ROLLBACK

REQ-1 is a single revertible test edit. REQ-2/REQ-3 make no runtime changes, so there is nothing to roll back.
