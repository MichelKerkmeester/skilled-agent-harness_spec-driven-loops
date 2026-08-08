---
title: "Resource Map — Packet 039 Pi Fork Improvements"
description: "Evidence inventory for the sol detached research lineage."
---

# Resource Map

## Summary

- Local source files: 10 primary implementation/manifest/test surfaces
- Sibling packet evidence: 3 packet branches
- External primary sources: 3 official DeepSeek pages
- Iteration narratives: 7
- Scope: correctness, tests, observability, economics, and maintainability for both packet 039 forks

## Implementation Sources

| Resource | Category | Research use | Status |
|---|---|---|---|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Source | ownership guard, adapters, usage, persistence, telemetry, hook wiring, test exports | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi.ts` | Source | command/report transport and module registration | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts` | Source | canonical DeepPi ownership predicate | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` | Source | cost formula, session report, errors | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts` | Source | atomic writes, compare-and-swap boundary, duplicate interface | Analyzed |

## Test and Packaging Sources

| Resource | Category | Research use | Status |
|---|---|---|---|
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | Test | present coverage and missing runtime boundaries | Analyzed |
| `.pi/extensions/pi-cache-optimizer/package.json` | Config | scripts, package identity, upstream provenance | Analyzed |
| `.pi/extensions/deep-pi/tests/package.test.ts` | Test | broken benchmark contract assertion | Analyzed |
| `.pi/extensions/deep-pi/tests/fake-pi.ts` | Test | basis for credential-independent integration | Analyzed |
| `.pi/extensions/deep-pi/package.json` | Config | absent benchmark artifact, files allowlist, fork identity | Analyzed |

## Packet Evidence

| Resource | Research use | Status |
|---|---|---|
| `specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/` | implemented ownership guard and live evidence | Cited |
| `specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/` | DeepPi hardening scope and decisions | Cited |
| `specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` | RPC limitation and credential block | Cited |

## External Primary Sources

| Resource | Research use | Status |
|---|---|---|
| `https://api-docs.deepseek.com/guides/kv_cache` | automatic/best-effort cache semantics and hit/miss usage | Cited |
| `https://api-docs.deepseek.com/api/create-completion` | completion usage accounting | Cited |
| `https://api-docs.deepseek.com/quick_start/pricing` | mutable current model pricing | Cited |

## Coverage Gaps

- No paid live provider run was performed.
- No two-process negative-control harness currently exists for either persistence transaction.
- No package-level coverage report exists for risk-based coverage baselines.
