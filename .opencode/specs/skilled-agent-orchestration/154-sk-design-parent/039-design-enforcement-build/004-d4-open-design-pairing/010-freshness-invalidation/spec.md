---
title: "D4-R10 — Temporal/subject freshness invalidation + checker support"
description: "Add a canonical subjectDigest, ~300s TTL, single-use, mint-side + boundary-side double check, and extend proof_check.py with --require-design-token."
trigger_phrases:
  - "d4-r10 freshness invalidation"
  - "ttl single use design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R10 — Temporal/subject freshness invalidation + checker support

## 1. OBJECTIVE
Add temporal and subject freshness to the proof token: a canonical `subjectDigest`, a TTL (~300s precedent), single-use semantics, and a mint-side plus boundary-side double check, with `proof_check.py` extended to enforce `--require-design-token`.

## 2. WHY
A valid-but-stale or replayed token otherwise authorizes work for a different subject or long after issuance. TTL + single-use + subject binding, checked on both mint and boundary, makes replay and subject-swap fail closed.

## 3. TARGET & CLASS
- **Target file(s):** `proof_check.py:47` (extend with `--require-design-token`) + token schema
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Define a canonical `subjectDigest` and bind it into the token.
- Enforce a ~300s TTL and single-use/replay rejection at mint and at the tool boundary.
- Extend `proof_check.py` with `--require-design-token` covering presence, TTL, single-use, and subject match.

## 5. ACCEPTANCE
- A token past its TTL, reused after first use, or whose `subjectDigest` differs from the actual subject is DENIED; `proof_check.py --require-design-token` returns non-zero in each case.

## 6. EVIDENCE
- `proof_check.py:47` — the checker entry point the `--require-design-token` validation extends.
- Source: `research/research.md` §7 (D4-R10)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
