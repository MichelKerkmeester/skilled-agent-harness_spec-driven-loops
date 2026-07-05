---
title: "Iteration 008 — Final Adversarial Sweep"
description: "Last cli-devin pass: untouched surfaces, multi-runtime sync check, and convergence test."
iteration: 8
model: "SWE-1.6 (cli-devin)"
mode: "adversarial"
focus: "Untouched assets, reference accuracy, multi-runtime sync, and convergence validation"
---

# Iteration 008 — Final Adversarial Sweep

**Role**: Last devin iter. Final adversarial sweep on areas iters 1-7 may have skimmed. Aim for HIGH precision (0 false-positives) rather than coverage.

---

## 1. EXECUTION SUMMARY

### Probed Surfaces

**Step 1: Untouched surface inventory**
- `assets/` — 9 files (benchmark fixtures, profiles, config templates, strategy, charter)
- `references/` — 10 files (operator guides, policy docs, contracts)
- `feature_catalog/` — 14 files (feature descriptions with source metadata)
- `manual_testing_playbook/` — 33 scenarios across 8 categories

**Step 2: Multi-runtime sync check**
- Verified 4 runtime mirrors exist: `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`
- Confirmed `.agents/agents/` does NOT exist at repo root (only in external dependencies)
- Checked scanner template vs reference documentation alignment

**Step 3: Last-pass convergence test**
- Searched for substantive new findings not in DAI-001..020
- Found 2 new findings (DAI-021, DAI-022)

---

## 2. FINDINGS

### DAI-021: P0 — Mirror template drift in scan-integration.cjs

**Location**: `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs:15-19`

**Issue**: The scanner's `MIRROR_TEMPLATES` array contains `.gemini/agents/{name}.md`, but multiple reference documents claim it checks `.agents/agents/{name}.md` instead.

**Evidence**:
- Actual code (line 18): `'.gemini/agents/{name}.md'`
- `references/integration_scanning.md:39`: ".agents mirror | `.agents/agents/{name}.md`"
- `references/integration_scanning.md:78`: example shows `.agents/agents/{agent-name}.md`
- `feature_catalog/02--integration-scanning/02-runtime-mirrors.md:20`: "currently checks `.claude/agents/{name}.md`, `.codex/agents/{name}.toml`, and `.agents/agents/{name}.md`"
- `manual_testing_playbook/01--integration-scanner/scan-known-agent.md:45`: failure triage references `.agents/agents/`

**Root Cause**: Documentation drift after mirror template changes. The code was updated to use `.gemini/agents/` (correct path), but reference docs and test playbooks were not synchronized.

**Impact**:
- Operators are misled about which mirrors the scanner checks
- Manual testing playbook failure triage points to non-existent directory
- Breaks "single source of truth" principle between code and docs

**Recommended Fix**:
1. Update `references/integration_scanning.md` table to show `.gemini/agents/{name}.md` instead of `.agents/agents/{name}.md`
2. Update example output in same file
3. Update `feature_catalog/02--integration-scanning/02-runtime-mirrors.md` to match actual code
4. Update `manual_testing_playbook/01--integration-scanner/scan-known-agent.md` failure triage to reference `.gemini/agents/`

**Severity**: P0 — Documentation actively misleads operators and test scenarios reference non-existent paths.

---

### DAI-022: P1 — Promotion gate contract mismatch

**Location**: `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:156-161`

**Issue**: The promotion helper requires `score.recommendation === 'candidate-better'` AND a valid `score.delta`, but the scorer only emits `candidate-better` when a baseline is provided. Without a baseline, the scorer emits `candidate-acceptable` or `needs-improvement`, making promotion impossible in baseline-less scenarios.

**Evidence**:
- `promote-candidate.cjs:156`: `if (score.recommendation !== 'candidate-better')` → exit
- `promote-candidate.cjs:161`: `if (Number(score.delta || 0) < threshold)` → exit
- `score-candidate.cjs:430-433`: Recommendation logic only emits `candidate-better` when `baselineResult` exists AND `delta.total >= thresholdDelta`
- `score-candidate.cjs:434`: Without baseline, emits `candidate-acceptable` (if score >= 70) or `needs-improvement`

**Root Cause**: Promotion gate was designed for baseline-comparison mode but dynamic scoring often runs without baselines (first-time evaluations, single-candidate runs).

**Impact**:
- Promotion is blocked in baseline-less scenarios even for high-scoring candidates
- Feature catalog `04-promotion-gates.md:20` acknowledges this: "The promotion gate is therefore shipped, but it is not satisfied by an untouched dynamic score file from the current scorer alone"
- Creates a hidden contract violation between scorer output and promotion helper expectations

**Recommended Fix**:
1. Either: Update promotion helper to accept `candidate-acceptable` with explicit operator approval when no baseline exists
2. Or: Update scorer to emit `candidate-better` for high-scoring candidates even without baseline (with a flag indicating baseline-less mode)
3. Or: Document that promotion requires baseline comparison and make this explicit in operator guides

**Severity**: P1 — Functional contract mismatch that blocks a documented workflow path, but acknowledged in feature catalog.

---

## 3. CONVERGENCE ASSESSMENT

### New Findings This Iteration
- **P0**: 1 (DAI-021)
- **P1**: 1 (DAI-022)
- **P2**: 0

### Total Across All Iterations
- **P0**: ~5 (including DAI-021)
- **P1**: ~11 (including DAI-022)
- **P2**: ~5

### Convergence Status
**WEAKENED** — Found 2 substantive new findings (DAI-021, DAI-022) in untouched surface areas that prior iterations did not cover. Convergence does not hold yet.

**Reason**: Iteration 8 focused on adversarial probes of assets, references, and multi-runtime sync — areas iters 1-7 did not systematically cover. The findings are real defects (not false positives), indicating the adversarial sweep added value.

**Recommendation**: One more iteration (cli-codex synthesis) to cross-validate findings and check for any remaining gaps in documentation-to-code alignment.

---

## 4. SURFACE COVERAGE

### Assets (9 files)
- ✅ `benchmark-fixtures/*.json` — fixture contracts validated
- ✅ `benchmark-profiles/default.json` — profile structure validated
- ✅ `improvement_config.json` — config schema validated
- ✅ `target_manifest.jsonc` — manifest policy validated
- ✅ `improvement_charter.md` — charter structure validated
- ✅ `improvement_strategy.md` — strategy template validated
- ✅ `improvement_config_reference.md` — reference docs validated

### References (10 files)
- ✅ `mirror_drift_policy.md` — policy validated (found prose drift vs code)
- ✅ `integration_scanning.md` — found documentation drift (DAI-021)
- ✅ `target_onboarding.md` — onboarding workflow validated
- ✅ `benchmark_operator_guide.md` — operator guide validated
- ✅ `evaluator_contract.md` — contract referenced indirectly

### Feature Catalog (14 files)
- ✅ `02-runtime-mirrors.md` — found documentation drift (DAI-021)
- ✅ `04-promotion-gates.md` — found contract mismatch (DAI-022)
- ✅ `01-five-dimension-rubric.md` — rubric validated
- ✅ `02-dynamic-profiling.md` — profiling validated

### Manual Testing Playbook (33 scenarios)
- ✅ `scan-known-agent.md` — found reference to non-existent path (DAI-021)
- ✅ Directory structure validated — confirmed `.agents/agents/` does not exist at root

---

## 5. MULTI-RUNTIME SYNC CHECK

### Mirror Inventory
| Runtime | Path | Exists | Sample Agent |
|---------|------|--------|--------------|
| OpenCode (canonical) | `.opencode/agents/` | ✅ | deep-agent-improvement.md |
| Claude Code | `.claude/agents/` | ✅ | deep-agent-improvement.md |
| Codex | `.codex/agents/` | ✅ | deep-agent-improvement.toml |
| Gemini | `.gemini/agents/` | ✅ | deep-agent-improvement.md |
| .agents (legacy) | `.agents/agents/` | ❌ | N/A |

### Sync Status
- ✅ Scanner code correctly checks `.gemini/agents/{name}.md`
- ❌ Reference docs incorrectly claim `.agents/agents/{name}.md`
- ✅ All 4 actual runtime mirrors exist for sample agent
- ❌ Documentation drift creates operator confusion (DAI-021)

### Deep-Agent-Improvement Agent Sync
Checked `deep-agent-improvement` across 4 runtimes:
- All have consistent description: "Proposal-only mutator for bounded deep-agent-improvement candidate generation with evaluator-first rules"
- All have proposal-only constraint documented
- All reference canonical path correctly (`.opencode/agents/*.md` for OpenCode, respective runtime paths for mirrors)
- No evidence of drift in the agent definitions themselves

---

## 6. NEXT STEPS

### Iteration 9 (cli-codex synthesis)
- Cross-validate DAI-021 and DAI-022 with Codex
- Check for any remaining documentation-to-code alignment gaps
- Synthesize findings into final report
- Prepare adjudication package

### Final Deliverables
- Consolidated findings list (DAI-001..022)
- Severity-ranked remediation plan
- Documentation sync checklist
- Multi-runtime sync verification report
