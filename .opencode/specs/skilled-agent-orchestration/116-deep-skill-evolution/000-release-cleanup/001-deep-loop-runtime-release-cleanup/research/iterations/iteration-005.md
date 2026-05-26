---
iter: 5
date: "2026-05-23"
executor: cli-devin
model: swe-1.6
permission_mode: auto
prompt_file: research/prompts/iter-05-prompt.md
stdout_log: research/logs/iter-05-stdout.txt
stderr_log: research/logs/iter-05-stderr.txt
wall_clock_seconds: 92
exit_code: 0
focus: "sub-readme-consistency-8-files-plus-secondary-description-drift-sweep"
findings_count: 2
findings_p0: 0
findings_p1: 1
findings_p2: 1
novel_findings: 2
re_reported_findings: 0
new_info_ratio: 1.00
log_only_findings: 0
sc_007_boundary_held: true
---

# Iteration 5 — Sub-README Consistency + Description-Drift Class-of-Bug Sweep

## Objective

Per `research/deep-research-strategy.md` §4 iter 5: verify 8 sub-READMEs (`lib/README.md`, `lib/council/README.md`, `lib/coverage-graph/README.md`, `lib/deep-loop/README.md`, `scripts/README.md`, `tests/README.md`, `tests/helpers/README.md`, `storage/README.md`) for drift vs current code layout. AF-0050 documented these have no sk-doc template and pass spot-check at LOC range 28-47; this iter does the rigorous file/module-list-vs-`ls` comparison + cross-reference resolution + count claim verification.

Secondary focus per iter-4 recommendation: continue the description-drift class-of-bug sweep with 3 more catalog-vs-source spot-checks (DR-025/DR-026 found 2/4 instances; iter 5 samples 3 more to firm the verdict).

## Method

1. **Orchestrator-side ground-truth pre-pass** (5 reads + 1 composite `ls`):
   - Read all 8 sub-READMEs (combined 298 LOC, matching AF-0050 LOC range).
   - `ls` the 8 corresponding directories to baseline actual content.
   - Pre-flagged candidate drift: `lib/README.md:31` lists only 2 of 3 per-domain READMEs (missing `lib/deep-loop/README.md`).
   - Pre-checked secondary-focus catalog descriptions + source MODULE comments + nearest top JSDoc.
2. **Compose RCAF prompt** per cli-devin SKILL.md §3 SWE-1.6 contract: medium-density 3-step pre-planning, ground-truth `ls` snapshots pre-supplied, 15 numbered claim/cross-ref checks, standard bundle-gate language, sequential_thinking mandate (≥5 thoughts), SC-007 + iter-3 DR-023 boundary explicit.
3. **Dispatch cli-devin SWE-1.6** with `gtimeout 1500 devin --prompt-file ... --model swe-1.6 --permission-mode auto -p > stdout 2> stderr </dev/null`. Exit 0, 97-line stdout, 0-byte stderr. Wall-clock ≈ 92s (consistent with iter-1/2 90s baseline).
4. **Post-dispatch bundle gate** (4 checks):
   - **SC-007 invariant** + iter-3 tightening: `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib' '.../scripts' '.../tests' '.../storage' '.../system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs'` → EMPTY ✓
   - **DR-027 evidence spot-check**: read `lib/README.md:31` directly — confirmed "Per-domain READMEs: lib/council/README.md, lib/coverage-graph/README.md" omits `lib/deep-loop/README.md` (which exists per `ls`). Drift is real ✓
   - **DR-028 evidence spot-check**: read `feature_catalog/03--validation/01-post-dispatch-validate.md:3` ("Validates iteration artifacts after dispatch and appends degraded verification events when optional checks fail") + grep'd top JSDocs of `lib/deep-loop/post-dispatch-validate.ts` — found 4 exported functions covering broader scope than "degraded verification events" emphasis. Drift is real but narrower than DR-025/DR-026 (semantic over-specialization, not a different trigger condition) ✓
   - **Cross-reference resolution (6 of 15 verified)**: `test -f` for `deep-ai-council/scripts/orchestrate-topic.cjs`, `orchestrate-session.cjs`, `system-spec-kit/mcp_server/vitest.config.ts`, `system-code-graph/mcp_server/lib/owner-lease.ts`, `system-spec-kit/mcp_server/lib/memory/bounded-cache.ts`, `system-rerank-sidecar/scripts/sidecar_ledger.py` — all 6 RESOLVE ✓
   - **stderr**: 0 bytes ✓
5. **Orchestrator-side expansion check**: scanned other potential drift candidates not flagged by cli-devin:
   - `lib/coverage-graph/README.md:35-36` cross-refs to `lib/deep-loop/` + `storage/deep-loop-graph.sqlite` — both resolve. No drift.
   - `lib/deep-loop/README.md:30-35` 6 arc-009 lifecycle helper paths — 6/6 verified resolve. No drift.
   - `tests/README.md:26-30` integration/ description ("Direct script invocation and review-depth coverage-graph fixtures") matches 7 .vitest.ts (4 *-script + 3 review-depth-*). No drift.
   - `lib/deep-loop/README.md` is the ONLY sub-README of 8 with `trigger_phrases:` frontmatter — minor inconsistency but not a structural drift (sub-READMEs have no shared template per AF-0050; trigger_phrases is opt-in metadata).
6. **Cleanup**: `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*` `/tmp/deep-research-*` per `feedback_proactive_orphan_cleanup`.

## Findings

2 NOVEL findings (DR-027 P1 documentation-drift + DR-028 P2 description-drift). Zero re-reports of DR-001..DR-026 or AF-0001..AF-0080.

| # | ID | Severity | Class | Artifact:Line | Drift |
|---|----|----------|-------|---------------|-------|
| 1 | DR-027 | P1 | documentation-drift-sub-readme-omission | `lib/README.md:31` | "Per-domain READMEs" list at L31 includes only 2 of 3 (lib/council/, lib/coverage-graph/) — omits lib/deep-loop/README.md despite §2 LIBRARY DOMAINS table listing all 3 domains. A reader following the per-domain README link list would miss the deep-loop README. |
| 2 | DR-028 | P2 | description-drift-catalog-vs-source | `feature_catalog/03--validation/01-post-dispatch-validate.md:3` + `manual_testing_playbook/03--validation/005-post-dispatch-validate.md:11` (paired) | Catalog/playbook narrow the description to "appends degraded verification events when optional checks fail" but source `lib/deep-loop/post-dispatch-validate.ts` exports 4 functions covering broader scope: `validateIterationOutputs` (JSONL + iteration markdown + delta validation), `validateOrThrow`, `runOptionalVerificationPass` (the fenced-code verification stage that maps to the catalog's emphasis), `computeVerificationConfidence`. Description over-specializes on one of 4 functions. |

**Severity rollup**: 0 P0 / 1 P1 / 1 P2 = 2 total novel findings.

**Class**: 1× documentation-drift (sub-README internal link list) + 1× description-drift-catalog-vs-source (continues DR-025/DR-026 class-of-bug from iter 4).

DR-027 is P1 (reader navigation impact: missing link to a real README that a reader navigating the lib/ orientation hub would never find via the documented index). DR-028 is P2 (content-quality drift: docs are USEFUL even with the over-specialization, just imprecise about source-code scope).

## Verified Clean (no findings)

- **Module/file list vs `ls`: 7 of 8 sub-READMEs MATCH exactly** (lib/council/, lib/coverage-graph/, lib/deep-loop/, scripts/, tests/, tests/helpers/, storage/). The 1 drift is `lib/README.md:31` per-domain-README-list omission, NOT a module-list drift.
- **Count claims**: 5 .cjs in lib/council/ (claimed = actual), 3 .ts in lib/coverage-graph/ (claimed = actual), 10 .ts in lib/deep-loop/ (claimed = actual), 4 .cjs in scripts/ (claimed = actual), 5 sub-dirs in tests/ (claimed = actual), 1 file in tests/helpers/ + storage/ (claimed = actual).
- **External cross-references (6 spot-checked of 15 enumerated)**: all 6 resolve — deep-ai-council orchestrate-{topic,session}.cjs (from lib/council/README.md:33-34), system-spec-kit vitest.config.ts (from tests/README.md:39-41), arc-009 lifecycle helpers (owner-lease.ts, bounded-cache.ts, sidecar_ledger.py from lib/deep-loop/README.md:30-35). 0 broken.
- **Internal cross-references**: `lib/README.md:30-32` parent SKILL.md + tests/, `scripts/README.md:43-45` parent SKILL.md + lib/ + tests/, `storage/README.md:34-36` Schema (lib/coverage-graph/) + atomic-state (lib/deep-loop/) — all resolve via `ls`.
- **Secondary description-drift sample (3 spot-checks)**: A (prompt-pack) MATCH, B (post-dispatch-validate) DRIFT, C (coverage-graph-db) MATCH. 1 of 3 drift instances.

## Citation Drift Caught

- **DR-027 cli-devin claim**: said "Line 31 claims..." — verified L31 directly, exact text matches. No off-by-one in this iter (vs iter-4 DR-025 where cli-devin's L12 was actually L11).
- **DR-028 cli-devin claim**: cited `lib/deep-loop/post-dispatch-validate.ts:1` as the source MODULE comment — verified directly with `sed -n '1p'`: "// MODULE: Deep-Loop Post-Dispatch Validator". Exact line match.
- **No off-by-one citation drift in this iter** — iter-5 prompt's ground-truth `ls` snapshot + explicit line-number callouts in claim list eliminated the drift pattern seen in iter 4.

## Negative Knowledge

Refuted hypotheses:
- "Multiple sub-READMEs likely have file-list drift since the codebase had renames + migrations" — REFUTED. 7/8 sub-READMEs MATCH `ls` exactly. The single drift (DR-027) is an INTERNAL cross-reference list omission, not a module-list drift. The `helpers/` rename from `_helpers/` (referenced in `tests/README.md:35`) was caught upstream by AF-0050 review.
- "trigger_phrases frontmatter inconsistency might be a finding" — DOWNGRADED. AF-0050 already documents sub-READMEs have no shared template; trigger_phrases is opt-in discoverability metadata. `lib/deep-loop/README.md` is the only one with it, but that's not a structural drift requiring a finding.
- "lib/coverage-graph/README.md heading 'Coverage Graph' might drift from frontmatter title 'Coverage Graph Library'" — DOWNGRADED. Headings can be shorter than titles by editorial convention; not finding-worthy.

## Open Threads

1. **Iter 6 candidate (per strategy.md §4)**: graph-metadata.json freshness — every `key_files` entry resolves, every `related_to` is current. Iter-2 DR-016 already consolidated the council coverage gap in graph-metadata; iter 6 will likely find a narrow surface focused on whether `key_files` paths still resolve after the deep-loop-runtime migration and whether `related_to` arrays reflect current cross-skill state.
2. **Description-drift class-of-bug verdict**: 3 of 7 sampled (DR-025 fallback-router, DR-026 bayesian-scorer, DR-028 post-dispatch-validate) ≈ 43% drift rate across the 7-of-17 sample. Crossed the "high prevalence ≥35%" threshold defined in the iter-5 prompt §E verdict logic. Recommend full-17 catalog-vs-source description sweep as a follow-on remediation packet. The remaining 10 unsampled features: executor-config, fallback-router (sampled iter 4), atomic-state, jsonl-repair, loop-lock, permissions-gate, coverage-graph-query, coverage-graph-signals, convergence-script, upsert-script, query-script, status-script. cli-devin's recommendation in §E aligns: "high prevalence (≥6 of 17 ≈ 35%+) — recommend full-17 remediation packet".
3. **DR-021 follow-on still open**: from iter 3, `manual_testing_playbook/05--coverage-graph/` may have additional scenarios beyond 009 + 010 that reference deep-loop-runtime. Not checked in iter 4 or 5.
4. **README §4/§9 disambiguation still open**: iter-1 DR-009 + iter-4 confirmation. Follow-on remediation packet should standardize "18 manual-test scenarios" (file count) vs "17 entries" (scenario count) to a single metric.

## Self-Critique

- **Dispatch decision**: cli-devin SWE-1.6 was the right call. The 8-sub-README × file/module-list × cross-reference × count-claim matrix is a structural verification task that benefits from cli-devin's table emission discipline + sequential_thinking pre-output reasoning. 92s wall-clock + exit 0 + clean stderr = clean dispatch. The orchestrator-side ground-truth pre-pass (which pre-flagged DR-027 candidate at L31) added value by giving cli-devin a clearer ground-truth baseline than iter-4's hypothesis-only prompt.
- **Severity calibration**: 0 P0 / 1 P1 / 1 P2 = 2 findings. Lower than iter-1 (11), iter-2 (5), iter-3 (8), same as iter-4 (2). The narrowing trend continues but the P1 (DR-027) is a real navigation defect, not just content-quality drift. Severity mix is right.
- **Tool-call budget**: orchestrator used 11 tool calls (3 reads of pre-state JSONL/config/strategy + 1 composite ls of 8 dirs + 1 dashboard read + 1 audit-findings read + 1 cli-devin SKILL.md read + 1 sub-README × 8 composite read + 1 prompt write + 1 dispatch + 1 bundle-gate composite). Plus 3 writes for artifacts (iteration, delta, state.jsonl append, config update, dashboard refresh). Total ≈ 14. Within iter quality envelope.
- **Counting drift detection**: cli-devin's §D total = 2; §C emitted 2 (DR-027, DR-028). §A reported 1 DRIFT verdict + 7 MATCH verdicts. §B reported 1 DRIFT + 2 MATCH. 1+1=2 DRIFT → 2 findings emitted. Internally consistent.
- **Confidence**: high. Both findings spot-check-verified by orchestrator directly. SC-007 boundary held. Cross-references resolved at 6/6 sampled. The 7/8 MATCH baseline for sub-READMEs is strong negative-evidence that catalog/playbook hygiene from iter 4 + sub-README hygiene from iter 5 is genuinely good — drift is concentrated in description fields (the description-drift class-of-bug), not in module lists or cross-references.

## Convergence Signal

- `newInfoRatio = 1.00` (2/2 novel; zero re-reports).
- Trail: [1.00, 1.00, 1.00, 1.00, 1.00] — 5 iters at perfect novelty.
- `consecutiveLowDeltaIters = 0` (far from 0.05 soft-convergence threshold).
- `stopReason = null` (continue to iter 6).
- Distance from hard cap (iter 10): 5 iterations remaining.

**Absolute finding count trail**: [11, 5, 8, 2, 2]. Iter 5 sustains iter-4's narrowing signal (2 findings in 2 consecutive iters). This is the SECOND consecutive low-absolute-count iter, though both have 1 P1+ finding so neither is "trivial". The pattern:
- Iters 1-3 surveyed bespoke documentation (SKILL, README, integration_points) → high yield.
- Iters 4-5 survey structurally-uniform documentation (feature_catalog, playbook, sub-READMEs) → low absolute yield because of upstream hygiene.
- Iter 6 (graph-metadata.json freshness) overlaps with iter-2 DR-016 → expect ≤3 findings.
- Iters 7-8 (council integration in catalog/playbook; SQLite schema accuracy) → some yield because council coverage gap is already documented but the catalog/playbook angle is new.
- Iter 9 (cross-arc references) → unknown yield, may reveal stale arc cross-links.
- Iter 10 (synthesis) → transverse patterns.

**Class-of-bug verdict expansion**: description-drift-catalog-vs-source is now confirmed at 3/7 sampled (43%, above the 35% high-prevalence threshold). A follow-on remediation packet covering the remaining 10 unsampled features (and/or the iter 5/6 synthesis) is recommended. This becomes a P1-class remediation item, not a P2.

**Saturation judgment**: The audit surface IS narrowing (11 → 5 → 8 → 2 → 2 absolute findings) but newInfoRatio holds at 1.00. The soft-convergence rule (`newInfoRatio < 0.05 for 2 consecutive iters`) won't fire on this trajectory until findings genuinely run out. The signal to watch is whether iter 6 + iter 7 each return ≤2 findings AND 0 P1+ — that combination would be the operational "saturation forming" trigger even without the strict-threshold fire. At current state, iter 5 has 1 P1 (DR-027), so we are NOT yet in "P2-only" saturation territory.

**Recommendation**: Continue to iter 6. Soft early-stop pending iter-6 confirmation IF iter 6 returns ≤2 findings AND 0 P1+. Hard convergence still 5+ iters away. The remediation backlog is already large (26+2 = 28 findings; ≥1 follow-on remediation packet plus the now-recommended description-drift sweep packet); operator may want to consider early-stop value-trade if iter 6 confirms low-yield trend.

---

**Evidence trail**:
- Prompt: `research/prompts/iter-05-prompt.md`
- Devin stdout: `research/logs/iter-05-stdout.txt` (97 lines, full §A-§F report)
- Devin stderr: `research/logs/iter-05-stderr.txt` (0 bytes — clean exit)
- Delta: `research/deltas/iter-05.jsonl`
