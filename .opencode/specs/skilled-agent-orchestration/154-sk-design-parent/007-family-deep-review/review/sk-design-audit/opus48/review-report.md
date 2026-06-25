---
title: "Deep Review Report — sk-design-audit"
session: skreview-sk-design-audit-opus48
target: .opencode/skills/sk-design-audit
target_type: skill
executor: cli-claude-code (claude-opus-4-8)
verdict: CONDITIONAL
release_readiness: converged
generated: 2026-06-25T19:29:40Z
---

# Deep Review Report — `sk-design-audit`

## 1. Executive Summary

**Verdict: CONDITIONAL** — one active P1, no P0.

`sk-design-audit` is a well-built, internally consistent design-QA mode child. Its technical content is accurate (WCAG and Core Web Vitals thresholds are correct and current), its severity/scoring contract is coherent across SKILL.md and the references, and every cross-reference to parent, sibling, and `sk-doc` resources resolves. The skill is shippable **after one fix**.

The single blocking-class finding is a least-privilege drift: the skill declares `Bash` in `allowed-tools` despite being a read-only review skill with no documented Bash use, no `scripts/` directory, and explicit rules against running scans — and it is the **only** read-only child in the `sk-design` family that carries `Bash`. The remaining findings are P2 polish/traceability items, plus one out-of-scope observation.

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 3 |
| Observations (out of scope) | 1 |
| `hasAdvisories` | true |
| Dimensions covered | 4/4 |
| Core protocols | spec_code (PARTIAL), checklist_evidence (PASS) |
| Overlay protocols | skill_agent (PARTIAL), feature_catalog_code (PARTIAL), playbook_capability (PASS) |
| Iterations | 5 (converged) |
| Scope | READ-ONLY; no repo file modified |

## 2. Planning Trigger

The CONDITIONAL verdict routes to **`/speckit:plan`** for a small remediation packet. Exactly one P1 (P1-001) is "fix before release"; the fix is a one-line manifest edit. The P2 items are optional and can be bundled or deferred. After P1-001 is resolved, the skill clears to PASS (`hasAdvisories=true` while P2s remain). No P0 means no human sign-off gate.

## 3. Active Finding Registry

### P1-001 — `Bash` over-granted in `allowed-tools` (least-privilege / capability-contract drift)
- **Severity:** P1 · **Dimension:** Security · **Protocol:** skill_agent (advisory gate) · **Adversarial replay:** survives
- **Evidence:**
  - `SKILL.md:4` — `allowed-tools: [Read, Grep, Glob, Bash, Task]`.
  - No documented Bash/shell/execute use anywhere in the skill (skill-wide grep returned none); no `scripts/` and no `assets/` directory exists.
  - Read-only contract that forbids running scans: `audit_contract.md:67` ("Do not claim … automated scans ran unless they actually ran"); `SKILL.md:299` (NEVER "invent browser, screenshot, or detector evidence"); `SKILL.md:255-256` (review-only, no silent implementation).
  - Sibling parity: parent `../sk-design/SKILL.md:4` = `[Read, Grep, Glob, Task]`; `sk-design-foundations` and `sk-design-motion` both = `[Read, Grep, Glob, Task]`. Only the build/generator skills (`sk-design-interface`, `sk-design-md-generator`) carry Bash, and they Write/Edit/build. `sk-design-audit` is the sole **read-only** child with Bash.
- **Impact:** Arbitrary shell execution granted to a skill whose entire identity is read-only critique — unjustified blast-radius widening and a parity break against its own family.
- **Recommended fix:** Remove `Bash` → `allowed-tools: [Read, Grep, Glob, Task]`. If measurement tooling is genuinely planned, reintroduce `Bash` together with explicit SKILL.md guidance, a `scripts/` entry, and reconciliation with the "never claim scans ran" rule.
- **Owner:** skill author / `sk-design` family maintainers.

### P2-001 — Feature catalog under-covers the routed capability surface
- **Severity:** P2 · **Dimension:** Traceability · **Protocol:** feature_catalog_code
- **Evidence:** `feature_catalog/feature_catalog.md:16-20` lists 3 capability cards; the router defines 4 intents (`SKILL.md:118-123`) and 4 resource domains (`SKILL.md:82-86`). Anti-patterns/production (`anti_patterns_production.md`) is a first-class routed domain folded into card 03 with no dedicated card.
- **Impact:** Anti-slop/theming/production-hardening is not discoverable as its own capability in the catalog. Low impact; reachable elsewhere.
- **Recommended fix:** Add a 4th capability card for anti-patterns/production, or annotate card 03 to span both references.

### P2-002 — Router pseudocode: unreachable AUDIT_CONTRACT zero-score default
- **Severity:** P2 · **Dimension:** Maintainability · **Protocol:** spec_code (doc clarity)
- **Evidence:** `SKILL.md:178-179` defaults a zero-score request to AUDIT_CONTRACT, but `SKILL.md:207-216` returns `UNKNOWN_FALLBACK` whenever `max(scores) < 0.5`; integer weights (`SKILL.md:118-123`) mean zero-score always hits UNKNOWN_FALLBACK first, so the default never applies.
- **Impact:** Two contradictory documented fallbacks for the same input; behavior remains safe. This mirrors the shared `sk-doc` smart-router template idiom (`SKILL.md:102`), so it is a template-level nit.
- **Recommended fix:** Drop the unreachable default, or have the router honor AUDIT_CONTRACT on all-zero scores.

### P2-004 — `corpus_map` regression caveat has no playbook/test guard
- **Severity:** P2 · **Dimension:** Traceability · **Protocol:** playbook_capability
- **Evidence:** `corpus_map.md:33` flags a regression-sensitive modernization ("Do not revert to FID"); `accessibility_performance.md:66` correctly uses INP. No playbook scenario loads `corpus_map.md` or asserts the FID→INP guard (`manual_testing_playbook/*`).
- **Impact:** A future edit could silently reintroduce FID with no scenario to catch it. Low, documentation-level.
- **Recommended fix:** Add a corpus-integrity assertion to the playbook, or note that `corpus_map.md` is doc-only and exempt.

## 4. Remediation Workstreams

| Lane | Findings | Effort | Owner |
|------|----------|--------|-------|
| **A — Manifest least-privilege** (blocking) | P1-001 | trivial (1 line) | skill author + family maintainers |
| **B — Catalog/traceability polish** | P2-001, P2-004 | small | skill author |
| **C — Router pseudocode clarity** | P2-002 | small (consider fixing at the shared `sk-doc` template) | skill author / sk-doc owner |
| **D — Family convention (out of scope)** | P2-003 | n/a here | sk-design family review |

## 5. Spec Seed

> Minimal spec delta for the remediation packet.

- **Goal:** Bring `sk-design-audit`'s declared capabilities in line with its read-only contract and complete its discoverability/traceability surface.
- **In scope:** `sk-design-audit/SKILL.md` (allowed-tools); `feature_catalog/feature_catalog.md` (+ optional new card); `manual_testing_playbook/` (optional corpus assertion).
- **Out of scope:** graph-metadata `family` field (family-wide convention — handle separately); the shared `sk-doc` smart-router template (separate owner) unless co-fixing P2-002 there.
- **Acceptance:** `allowed-tools` matches the parent/sibling read-only set; catalog covers all 4 routed intents; verdict re-runs to PASS.

## 6. Plan Seed

1. **Lane A (required):** Edit `SKILL.md:4` → `allowed-tools: [Read, Grep, Glob, Task]`. (Decide separately whether `Task` is needed for a leaf review child; it currently matches family convention.)
2. **Lane B:** Add an "Anti-patterns & production" capability card to `feature_catalog.md`; add a corpus-integrity note/assertion for the FID→INP caveat.
3. **Lane C:** Resolve the unreachable router default — preferably once in the shared `sk-doc` template so all router-using skills inherit the fix.
4. **Re-verify:** Re-run the skill-target review (or `validate.sh` on the owning spec folder) and confirm verdict → PASS.

## 7. Traceability Status

| Protocol | Class | Result | Gap |
|----------|-------|--------|-----|
| spec_code | core / hard | PARTIAL | `Bash` capability has no resolved shipped use (P1-001) |
| checklist_evidence | core / hard | PASS | none — all changelog claims resolve |
| skill_agent | overlay / advisory | PARTIAL | tool-grant drift (P1-001); family-field dual meaning (P2-003, out of scope) |
| feature_catalog_code | overlay / advisory | PARTIAL | 3 cards vs 4 routed intents (P2-001) |
| playbook_capability | overlay / advisory | PASS | corpus caveat untested (P2-004, minor) |

No `agent_cross_runtime` protocol applies (no runtime agent defines this skill; entry point is the `sk-design` parent router).

## 8. Deferred Items

- **P2-001, P2-002, P2-004** — advisory; bundle into the remediation packet or defer. None block release.
- **P2-003 (observation)** — `graph-metadata family=sk-code` vs `SKILL.md metadata.family=sk-design` is uniform across all six `sk-design` skills; **not** a per-skill defect. Deferred to a family-wide convention review if the dual meaning is deemed confusing. Out of scope to fix here (would break family parity).
- **`Task` tool** — undocumented in a leaf review child but matches family convention; revisit alongside Lane A.

## 9. Audit Appendix

### Coverage
- Dimensions: Correctness (iter-001), Security (iter-002), Traceability (iter-003), Maintainability (iter-004), Stabilization (iter-005). 4/4 + stabilization.
- Protocols: core spec_code + checklist_evidence executed; skill overlays skill_agent + feature_catalog_code + playbook_capability executed. `agent_cross_runtime` N/A.

### Replay validation
- P1-001 survived Hunter/Skeptic/Referee replay (iter-002, re-confirmed iter-005). The "future measurement tooling" counter-argument was rejected as speculative and contradicted by the skill's own no-scan rule.
- All P2 findings re-confirmed in the stabilization pass; no downgrades.

### Convergence evidence
- newFindingsRatio trajectory: 0.10 → 0.45 → 0.12 → 0.00 → 0.00.
- Rolling average (last 2) = 0.00 < rollingStopThreshold 0.08.
- Dimension-coverage signal = 1.0; minStabilizationPasses=1 satisfied at iter-005.
- No active P0 → P0-override not triggered. Composite stop score ≈ 0.82 ≥ 0.60.
- **Stop reason:** converged (coverage + stabilization), reached before maxIterations cutoff effect.

### Strengths preserved (do not regress)
- Accurate WCAG (4.5:1 / 3:1) and current CWV (LCP<2.5s, INP<200ms, CLS<0.1) thresholds.
- Correct WCAG 2.2 AA (24×24) vs AAA/HIG (44×44) touch-target distinction.
- Explicit FID→INP modernization guard.
- Internally consistent P0–P3 + `/20` contract; Nielsen-lens double-count guard.
- All cross-references resolve; strong anti-fabrication evidence rules.

---

**Final verdict: CONDITIONAL** — fix P1-001 (remove `Bash` from `allowed-tools`) to reach PASS. P2 items are advisory (`hasAdvisories=true`).
