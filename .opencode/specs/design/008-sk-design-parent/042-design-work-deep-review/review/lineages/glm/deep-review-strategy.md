# Deep Review Strategy — skill:sk-design

**Review target:** `skill:sk-design`
**Target type:** skill
**Session:** `fanout-glm-1782750389509-8fbzzu` (lineage glm, fan-out)
**Executor:** cli-opencode / `zai-coding-plan/glm-5.2`
**Max iterations:** 10 · **Convergence threshold:** 0.05 · **Stuck threshold:** 2

## Topic

Independent deep-review audit of the `sk-design` skill surface, covering the 4-layer `design-command-surface-check.mjs`, the opt-in proof-check lanes (`proof_check.py`), `naming_doc_check.py`, the numeric/perf/baseline/polish/variant/fingerprint gates, `command-metadata.json`, `context_loading_contract.md`, the OVERVIEW-conformed reference+asset docs, and the `guided-run.ts` MODULE header. Secondary scope: the `deep-improvement` skill-benchmark gate code that asserts on sk-design (`score-skill-benchmark.cjs`, `design-token-lint.cjs/vitest.ts`, and the `assets/skill_benchmark/fixtures/sk-design/` route-gold corpus). Standing invariants to confirm: `design-command-surface-check STATUS=PASS drift=0`; skill-benchmark hubRoute `34/29/5/0`; `naming_doc_check` exit 0; evergreen 0 leaks (no spec/packet/phase IDs in skill code).

## Review Dimensions

- [x] **D1 Correctness** — logic errors, error-handling gaps, exit-code drift, type coercion, async/await correctness, regex correctness across the check scripts and metadata loaders. **Verdict: PASS** (1 P2 advisory F001; standing invariants hold).
- [x] **D2 Security** — untrusted-input handling (URLs, file paths, JSON inputs), command injection in shell helpers, path traversal in fixture loaders, secret leakage in error messages, shell-quoting discipline in any child-process code. **Verdict: PASS** (5 P2 advisories F002-F006; strong existing path/skill guards).
- [x] **D3 Traceability** — `spec_code` (SKILL.md normative claims vs shipped scripts), `checklist_evidence` (where checklists exist), `skill_agent` overlay (SKILL.md ↔ runtime agent files), `feature_catalog_code` overlay (feature_catalog/*.md vs implementation), `playbook_capability` overlay (manual_testing_playbook vs executable reality). **Verdict: PASS** (2 P2 advisories F007-F008; all protocols executed).
- [x] **D4 Maintainability** — dead code, duplicated logic, missing validation, doc drift, naming/structure issues, evergreen-leak exposure. **Verdict: PASS** (2 P2 advisories F009-F010).

## Running Findings

<!-- BEGIN_MACHINE_OWNED:running-findings -->
- P0=0 P1=0 P2=10 (active) — converged
- Verdict: PASS, hasAdvisories=true
- Last updated: 2026-06-29T17:10:00Z (synthesis)
<!-- END_MACHINE_OWNED:running-findings -->

## Files Under Review

| File | Kind | D1 | D2 | D3 | D4 |
|------|------|----|----|----|----|
| `SKILL.md` (parent hub) | doc/contract | ☐ | ☐ | ☐ | ☐ |
| `README.md` | doc | ☐ | ☐ | ☐ | ☐ |
| `command-metadata.json` (37KB) | metadata | ☐ | ☐ | ☐ | ☐ |
| `mode-registry.json` | metadata | ☐ | ☐ | ☐ | ☐ |
| `hub-router.json` | metadata | ☐ | ☐ | ☐ | ☐ |
| `graph-metadata.json` | metadata | ☐ | ☐ | ☐ | ☐ |
| `shared/context_loading_contract.md` | contract | ☐ | ☐ | ☐ | ☐ |
| `shared/scripts/design-command-surface-check.mjs` | 4-layer check | ☐ | ☐ | ☐ | ☐ |
| `shared/scripts/proof_check.py` | proof-gate | ☐ | ☐ | ☐ | ☐ |
| `shared/scripts/numeric_law_check.py` | gate | ☐ | ☐ | ☐ | ☐ |
| `shared/scripts/variant_parameter_check.py` | gate | ☐ | ☐ | ☐ | ☐ |
| `shared/scripts/ai-fingerprint-fixture-check.mjs` | gate | ☐ | ☐ | ☐ | ☐ |
| `shared/scripts/ai-fingerprint-registry-check.mjs` | gate | ☐ | ☐ | ☐ | ☐ |
| `design-foundations/scripts/naming_doc_check.py` | gate | ☐ | ☐ | ☐ | ☐ |
| `design-foundations/scripts/baseline_rhythm_check.py` | gate | ☐ | ☐ | ☐ | ☐ |
| `design-foundations/scripts/contrast_check.py` | gate | ☐ | ☐ | ☐ | ☐ |
| `design-audit/scripts/perf_evidence_check.py` | gate | ☐ | ☐ | ☐ | ☐ |
| `design-audit/scripts/polish_readiness_check.py` | gate | ☐ | ☐ | ☐ | ☐ |
| `design-md-generator/backend/scripts/guided-run.ts` | MODULE header | ☐ | ☐ | ☐ | ☐ |
| `design-md-generator/backend/scripts/proof.ts` | generator | ☐ | ☐ | ☐ | ☐ |
| `design-md-generator/backend/scripts/validate.ts` | generator | ☐ | ☐ | ☐ | ☐ |
| `design-md-generator/backend/scripts/extract.ts` | generator | ☐ | ☐ | ☐ | ☐ |
| `design-md-generator/backend/scripts/css-analyzer.ts` | generator | ☐ | ☐ | ☐ | ☐ |
| `design-md-generator/feature_catalog/*.md` | feature catalog | ☐ | ☐ | ☐ | ☐ |
| `design-md-generator/manual_testing_playbook/*.md` | playbook | ☐ | ☐ | ☐ | ☐ |
| `design-{audit,foundations,interface,motion,md-generator}/SKILL.md` | mode contracts | ☐ | ☐ | ☐ | ☐ |
| `deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | gate (secondary) | ☐ | ☐ | ☐ | ☐ |
| `deep-improvement/scripts/skill-benchmark/design-token-lint.cjs` | gate (secondary) | ☐ | ☐ | ☐ | ☐ |
| `deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs` | gate (secondary) | ☐ | ☐ | ☐ | ☐ |
| `deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` | gate (secondary) | ☐ | ☐ | ☐ | ☐ |
| `assets/skill_benchmark/fixtures/sk-design/**` | gold corpus (secondary) | ☐ | ☐ | ☐ | ☐ |

Out of scope: `design-md-generator/backend/node_modules/**` (vendored deps).

## Cross-Reference Status

### Core Protocols (hard gate)
| Protocol | Applies | Status | Evidence |
|----------|---------|--------|----------|
| `spec_code` | yes (skill) | pending | — |
| `checklist_evidence` | conditional | n/a (no spec-folder checklist) | — |

### Overlay Protocols (advisory, skill target type)
| Protocol | Applies | Status | Evidence |
|----------|---------|--------|----------|
| `skill_agent` | yes | pending | SKILL.md ↔ runtime agents (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`) |
| `agent_cross_runtime` | n/a | n/a | target is skill, not agent |
| `feature_catalog_code` | yes | pending | `design-md-generator/feature_catalog/*.md` ↔ backend/scripts |
| `playbook_capability` | yes | pending | `manual_testing_playbook/**/*.md` ↔ executable scripts |

## Known Context

- Lineage `glm` is the cli-opencode / `zai-coding-plan/glm-5.2` seat in a 2-lineage fan-out (sibling: `codex` on `gpt-5.5`). Merge applies strongest-restriction after both complete.
- Standing invariants from the orchestrator's reviewScopeNote must be confirmed by direct execution where feasible:
  - `design-command-surface-check` → `STATUS=PASS drift=0`
  - skill-benchmark hubRoute → `34/29/5/0`
  - `naming_doc_check` → exit 0
  - evergreen leak check → 0 spec/packet/phase IDs in skill code
- `resource-map.md` not present at init. Skipping coverage gate.

## Review Boundaries

- **Read-only on target.** No edits to anything under `.opencode/skills/sk-design/**` or `.opencode/skills/deep-loop-workflows/deep-improvement/**`.
- **Scope:** only the artifacts listed under "Files Under Review".
- **Severity threshold:** P2 (lowest reported severity).
- **Evidence rule:** every finding cites concrete `file:line`. Re-read cited code before recording any P0.
- **Claim-adjudication:** every new P0/P1 finding carries a typed adjudication packet in its iteration file.

## What Worked
<!-- BEGIN_MACHINE_OWNED:what-worked -->
- (none yet)
<!-- END_MACHINE_OWNED:what-worked -->

## What Failed
<!-- BEGIN_MACHINE_OWNED:what-failed -->
- (none yet)
<!-- END_MACHINE_OWNED:what-failed -->

## Exhausted Approaches
<!-- BEGIN_MACHINE_OWNED:exhausted-approaches -->
- (none yet)
<!-- END_MACHINE_OWNED:exhausted-approaches -->

## Ruled-Out Directions
<!-- BEGIN_MACHINE_OWNED:ruled-out -->
- (none yet)
<!-- END_MACHINE_OWNED:ruled-out -->

## Next Focus
<!-- BEGIN_MACHINE_OWNED:next-focus -->
- Loop converged at iter 5 (composite stop score 0.75, all gates green). Synthesis complete; verdict=PASS with 10 P2 advisories. See review-report.md.
<!-- END_MACHINE_OWNED:next-focus -->
