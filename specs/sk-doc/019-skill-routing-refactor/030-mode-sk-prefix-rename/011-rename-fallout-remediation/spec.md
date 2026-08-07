---
title: "Feature Specification: Post-rename fallout remediation"
description: "Close the three rename-fallout follow-ups the LUNA review surfaced: a stale pre-rename test import, sk-doc compiled-routing drift, and the blocked strict-validation dist."
trigger_phrases:
  - "rename fallout remediation"
  - "compiled routing drift"
  - "stale create-skill import"
contextType: "specification"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---
# Feature Specification: Post-Rename Fallout Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. PROBLEM

The `sk-create-*` mode rename shipped, but the LUNA review (packet 010) and its remediation surfaced three fallout items the original rename missed. This packet closes them.

## 2. REQUIREMENTS

- **REQ-1 [P1] Stale test import.** `system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts` imports `sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` (pre-rename path). Repoint every such stale reference in that file to `sk-doc/sk-create-skill/...` and confirm the suite loads.
- **REQ-2 [P1] Compiled-routing drift.** The sk-doc compiled-routing manifests were not regenerated after the mode rename, so `compiled-routing-parity` reports `BLOCKED-BY-COMPILED-DRIFT` with 32 drift rows against the frozen route-gold. Regenerate the sk-doc compiled routing (never edit the frozen scorer/gold) so parity returns to matches, or document precisely why regeneration is operator-gated.
- **REQ-3 [P2] Strict-validation dist.** `validate.sh --strict` is blocked by a stale `system-spec-kit/mcp-server` dist. Attempt the rebuild; if it still fails on the in-flight `hooks/pi/*.ts` (another program's files), record the exact blocker and leave it for that program / CI. Do not fix another session's pi-hooks here.

## 3. SCOPE

**In scope:** the one test file (REQ-1), the sk-doc compiled-routing manifest generation path (REQ-2), and a build attempt + honest status for REQ-3.

**Out of scope:** the frozen scorer/route-gold digests; `hooks/pi/*.ts` (owned by the in-flight hook-runtime program); any non-sk-doc compiled routing unless the same regeneration step covers it.

## 4. SUCCESS CRITERIA

- REQ-1: 0 pre-rename `create-skill` path references in the test file; the vitest file loads without the missing-module error.
- REQ-2: `compiled-routing-parity` for sk-doc no longer reports drift rows (or the operator-gate reason is documented with evidence).
- REQ-3: `validate.sh --strict` passes, OR the exact dist blocker is recorded as external.
