# Iteration 004 — RQ5 Skill Benchmark Report: Shape, Scoring Rollup, Remediation Taxonomy + RQ6 Rename Surface (MiniMax-2.7)

## Focus
RQ5: The Skill Benchmark Report — how to rank bottlenecks and express concrete, actionable remediations that a follow-up packet (or Lane A) can act on. Report shape, scoring rollup, remediation taxonomy. RQ6: rename surface map for deep-agent-improvement → deep-improvement (secondary focus, building on prior iterations).

---

## Actions Taken

1. **Read the deep-agent-improvement SKILL.md** — confirmed the 5-dimension scoring framework, the three pluggable seams, the lane-aware resource organization, the stop-reason taxonomy, and the evaluator contract.
2. **Read sk-doc SKILL.md** — confirmed the benchmark folder creation pattern, the report template shape, and the DQI scoring approach for skill documentation quality.
3. **Read the sibling 121-deep-agent-improvement-benchmark-mode spec.md** — confirmed the lane architecture, the mode-selector pattern, and the two-lane co-equality model that Phase 003 will extend to three lanes.
4. **Read the Phase 003 spec.md** — confirmed the working Lane C design frame: fixtures, dispatcher, scorer, report, loop-host mode wiring.
5. **Read the Phase 002 spec.md** — confirmed the rename surface scope and the safe-ordering requirements.
6. **Reviewed prior iteration (iter-003)** — confirmed the D1/D2 split, the "properly utilized" conjunction definition, and the RQ4 fixture authorship guidance.
7. **Reviewed research/research.md** — confirmed the RQ5 synthesis already in the research doc (report shape, remediation taxonomy, scoring rollup) and identified the specific gaps to fill with deeper analysis.
8. **Analyzed scoring rollup mechanics** — derived how composite scores roll up from per-dimension scores, how confidence bands form, and how hard-finding gates override composite scores.
9. **Analyzed remediation taxonomy** — mapped each finding type to its remediation target (skill-advisor, skill router, reference owner, content author) and estimated actionability.
10. **Analyzed rename surface** — built on the RQ6 synthesis in research.md to add specific file-path evidence from the Phase 002 and Phase 003 specs.
11. **Designed report artifact structure** — specified the JSON and Markdown dual-output shape with per-section contracts.

---

## Findings

### F-minimax-i4-1: The Skill Benchmark Report is a diagnostic artifact, not a score artifact

The primary output of Lane C is a ranked, actionable bottleneck list — not a single composite score. A composite score is useful for trending across runs, but it masks the specific remediation path needed. The report must always show per-dimension breakdown alongside the composite so that a skill with a high composite but a hard D5 gate still surfaces structural findings.

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:143-155]
[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:46]

### F-minimax-i4-2: Scoring rollup mechanics — composite, confidence band, hard gates

The composite score is not a simple weighted average. It has three layers:

**Layer 1 — Dimension scores (0.0–1.0):** Each dimension D1–D5 produces a normalized score. D1 (routing/activation) is itself a 4-sub-dimension composite: D1a (external advisor, 8pts), D1b (internal router, 10pts), D1c (abstention/near-neighbor, 4pts), D1d (end-to-end utilization, 3pts). D1 max = 25 points (same as D2 and D4).

**Layer 2 — Composite:** `score = 25*D1_norm + 25*D2_norm + 25*D4_norm + 15*D3_norm + 10*D5_norm`. Each `*_norm` is 0.0–1.0. Raw composite range = 0–100.

**Layer 3 — Confidence band:** From k-run variance, fixture count, and contamination lint pass/fail. Report as `score = X [+/- Y]` where Y reflects the variance. Do not report a single number when variance is high — instead report "inconclusive, needs more runs."

**Hard-finding gate override:** Any D5 (structural connectivity) finding with severity `critical` forces the composite to display a `⚠ HARD FINDING` banner regardless of the composite score. The banner names the specific broken path, the file affected, and the D5 finding code. This prevents a high-scoring skill with a broken operational path from appearing clean.

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:250-261]
[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:258-266]

### F-minimax-i4-3: Report shape — 10-section structure with dual JSON/Markdown output

The Skill Benchmark Report has two output formats that must stay synchronized:

**Markdown (operator-facing):**
1. **Run header** — target skill name/version, benchmark version, executor(s), k-run count, timestamp, commit, rename alias map, corpus manifest.
2. **Corpus integrity** — fixture count by source, contamination lint pass/fail, public/private separation proof, missing private keys, excluded fixtures.
3. **Executive scorecard** — composite score with confidence band, D1–D5 sub-scores, hard-finding banner, no-go gates, overall verdict.
4. **D1 activation matrix** — D1a/D1b/D1c/D1d sub-table with advisor selection, in-skill intent routing, abstention, and utilization conjunction.
5. **D2 discovery matrix** — expected resource recall, irrelevant load precision, first useful rank, hallucinated path list.
6. **D3 efficiency** — calls/tokens/time to first expected resource, fallback cycles, over-loaded defaults, late-useful resources.
7. **D4 ablation** — skill-on/skill-off outcome delta, pairwise quality verdict, harm cases, net context cost.
8. **D5 static graph** — orphan references/assets, dead router keys, broken links, inventory mismatches, hard findings list.
9. **Ranked findings** — sorted by severity (critical → high → medium → low) then by dimension; each finding shows: finding code, dimension, affected file/path/key, evidence trace excerpt, likely cause, concrete remediation, and whether it's a follow-up candidate for Lane A.
10. **Artifacts manifest** — `routerTrace.json`, `resource-loads.jsonl`, `tool-trace.raw.jsonl`, final outputs, scorer input key, report JSON.

**JSON (machine-readable, reducer-compatible):**
```json
{
  "reportVersion": "1.0",
  "targetSkill": "deep-improvement",
  "benchmarkVersion": "skill-benchmark-v1",
  "runHeader": { /* timestamp, executor, k-run, commit, aliasMap, corpusManifest */ },
  "corpusIntegrity": { /* fixture counts, lint results, separation proof */ },
  "scorecard": {
    "composite": 72.4,
    "confidenceBand": "+/- 4.2",
    "dimensions": {
      "D1": { "score": 0.76, "sub": { "D1a": 0.72, "D1b": 0.80, "D1c": 0.68, "D1d": 0.85 } },
      "D2": { "score": 0.70 },
      "D3": { "score": 0.65 },
      "D4": { "score": 0.78 },
      "D5": { "score": 0.85, "hardFindings": [] }
    }
  },
  "findings": [
    {
      "id": "f-i4-001",
      "severity": "critical",
      "dimension": "D5",
      "findingCode": "dead_resource_path",
      "affectedPath": "references/model-benchmark/evaluator_contract.md",
      "evidence": "RESOURCE_MAP[MODEL_BENCHMARK] references this file but it does not exist",
      "likelyCause": "File was moved during Lane B reorg but RESOURCE_MAP not updated",
      "remediation": "Restore the file or remove the RESOURCE_MAP entry",
      "laneAActionable": true,
      "laneAPriority": "high"
    }
  ],
  "artifacts": { /* paths to routerTrace, resource-loads, tool-trace, report JSON */ }
}
```

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:143-175]
[SOURCE: .opencode/skills/sk-doc/SKILL.md:147-161]

### F-minimax-i4-4: Remediation taxonomy — 16 finding codes mapped to remediation targets

Each finding code maps to a specific remediation actor and action:

| Finding code | Dimension | Remediation target | Typical action |
|---|---|---|---|
| `advisor_selection_miss` | D1a | skill-advisor aliases, scorer lanes | Update trigger phrases, lane weights, graph metadata |
| `advisor_false_positive` | D1a | skill-advisor trigger phrases | Narrow keyword set, add negative rules |
| `ambiguous_neighbor` | D1a/D1c | skill-advisor confusion matrix | Add disambiguating keywords, regression fixtures |
| `in_skill_intent_miss` | D1b | skill INTENT_SIGNALS / RESOURCE_MAP | Adjust keyword weights, add/remove intent keys |
| `missing_resource_edge` | D1b/D2 | skill RESOURCE_MAP | Add or move map entry for expected resource |
| `dead_resource_path` | D1b/D5 | skill RESOURCE_MAP + filesystem | Rename path to match map, or remove stale entry |
| `orphan_reference` | D5 | skill references/assets organization | Add route, link the asset, or retire orphaned file |
| `overloaded_default` | D3 | skill LOADING_LEVELS | Move resource to ON_DEMAND to reduce eager loading |
| `late_useful_resource` | D3 | skill SKILL.md signposting | Add clearer H2/H3 guidance before the resource is needed |
| `hallucinated_path` | D2 | skill reference/asset naming + trace validation | Improve inventory naming; add path-validation guard in scorer |
| `resource_not_consumed` | D2/D4 | skill reference content quality | Improve reference relevance or narrow task guidance |
| `skill_off_no_delta` | D4 | skill SKILL.md / references / assets | Rewrite content, merge/retire skill, or narrow trigger |
| `net_negative_context_cost` | D3/D4 | skill SKILL.md / references | Shrink SKILL.md, split references, move to conditional loading |
| `fixture_contaminated` | N/A (invalid) | fixture author | Rewrite fixture before scoring; exclude from corpus |
| `rename_alias_mismatch` | D1/D5 | benchmark harness alias map | Regenerate alias map and parser roots |
| `stale_mirror` | D1/D5 | runtime mirror owner | Sync mirror to current canonical skill state |

The `laneAActionable` boolean in each finding row signals whether the finding should be fed into a Lane A improvement loop. Critical and high severity findings that touch INTENT_SIGNALS, RESOURCE_MAP, SKILL.md content, or reference quality are primary Lane A candidates. Structural issues (orphan references, dead paths) are also Lane A candidates but may require physical file changes alongside router changes.

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:156-175]
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:218-238]

### F-minimax-i4-5: Severity assignment is tied to remediation urgency, not just score impact

Severity is not derived from the dimension score alone. It reflects how urgently the finding needs remediation:

- **critical** — An operational path is broken. The skill cannot complete its stated purpose for this scenario class. Immediate fix required before any promotion. Maps to `blockedStop` in the stop-reason taxonomy.
- **high** — A key dimension scores below 0.5, or a D5 hard-finding is present. The skill is meaningfully degraded. Remediation should be the next action after the benchmark run.
- **medium** — One or more sub-dimensions score 0.5–0.7. The skill works but sub-optimally. Improvement is beneficial but not blocking.
- **low** — All dimensions score 0.7+. The skill is healthy; findings are refinements.

A finding with severity `critical` on D5 (structural connectivity) overrides any high composite score. The report must show the hard-finding banner even if the overall score is 80+.

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:309-321]
[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:296-303]

### F-minimax-i4-6: The report's ranked findings list is the primary actionable output

The executive scorecard and dimension breakdowns are for orientation. The ranked findings list is what a follow-up packet (or Lane A) acts on. Each finding row must contain:
1. **Finding ID** — `f-<model>-i<iter>-<NN>` for traceability back to the specific run and iteration.
2. **Severity** — critical/high/medium/low.
3. **Dimension** — which dimension the finding belongs to.
4. **Finding code** — from the 16-code taxonomy.
5. **Affected file/path/key** — the specific skill file, reference path, or config key that needs change.
6. **Evidence trace** — a verbatim excerpt from the resource-load trace or tool trace that proves the finding. Must be specific enough that an operator can reproduce it.
7. **Likely cause** — the simplest explanation for why this failure occurred, based on the skill's known structure.
8. **Concrete remediation** — a specific, executable action. "Update RESOURCE_MAP" is not concrete. "Add `references/model-benchmark/evaluator_contract.md` to RESOURCE_MAP['MODEL_BENCHMARK']" is concrete.
9. **laneAActionable** — boolean; true if this finding should feed into a Lane A improvement loop.
10. **laneAPriority** — high/medium/low; how urgently Lane A should act on this finding.

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:175-178]
[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:46]

### F-minimax-i4-7: RQ6 — Rename surface is broader than just the skill directory

The rename from `deep-agent-improvement` to `deep-improvement` touches 11 surface classes:

| Surface class | Examples | Rename action |
|---|---|---|
| **Canonical skill package** | `.opencode/skills/deep-agent-improvement/` → `deep-improvement/` | `git mv`; update all internal path constants |
| **Skill identity** | `SKILL.md` `name:`, description, triggers, keywords | Rename to `deep-improvement`; preserve lane-specific triggers as aliases |
| **Skill-local lane assets** | `assets/agent-improvement/`, `assets/model-benchmark/`, future `assets/skill-benchmark/` | Keep lane folder names; only update package root paths |
| **Skill-local references** | `references/agent-improvement/`, `references/model-benchmark/`, `references/shared/` | Keep lane folder names; update prose and package root paths |
| **Skill-local scripts/tests** | `scripts/**`, `tests/**`, `test-fixtures/**`, `vitest.config.mjs` | Update path constants and snapshots; preserve lane subdir structure |
| **Feature catalog/playbook** | `feature_catalog/**`, `manual_testing_playbook/**` | Update skill package name, setup helpers, transcripts |
| **Runtime agent** | `.opencode/agents/deep-agent-improvement.md` | Decision: rename to `deep-improvement` or keep lane-specific; record in Phase 002 decision-record |
| **Runtime mirrors** | `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` | Mirror the agent identity decision; update `.codex/config.toml` |
| **Agent indexes** | `README.txt` indexes under `.opencode/agents/`, `.claude/agents/`, `.gemini/agents/` | Update listing and descriptions |
| **Deep commands** | `.opencode/commands/deep/start-agent-improvement-loop.md`, `start-model-benchmark-loop.md` | Keep command verbs; update skill path references |
| **Command assets** | `deep_start-agent-improvement-loop_*.yaml`, `deep_start-model-benchmark-loop_*.yaml` | Update referenced skill package path in prompt text |
| **Advisor source** | `system-skill-advisor/mcp_server/lib/scorer/aliases.ts`, `lanes/explicit.ts`, `fusion.ts` | Canonical node becomes `deep-improvement`; old aliases route compatibly |
| **Advisor generated/cache** | `skill_advisor.py`, `skill-graph.json`, advisor `graph-metadata.json`, regression fixtures | Rebuild after source update; verify generated artifacts |
| **Global docs** | `AGENTS.md`, `CLAUDE.md`, `.opencode/skills/README.md`, install guides | Update active routing entries and skill catalog rows |
| **Cross-skill active references** | `cli-opencode/`, `deep-loop-runtime/references/integration_points.md`, `sk-doc/assets/agent_template.md`, `sk-prompt/graph-metadata.json`, `deep-ai-council/graph-metadata.json` | Update active dependency/graph references; preserve historical changelogs |
| **Memory/spec metadata** | `.opencode/specs/descriptions.json`, packet `graph-metadata.json` | Update active package references; allowlist historical spec slugs |

The command verbs (`/deep:start-agent-improvement-loop`, `/deep:start-model-benchmark-loop`) are NOT renamed — they still describe what the commands do (improve agents, benchmark models). Only the skill package name changes. Lane C's new command (`/deep:start-skill-benchmark-loop`) is added in Phase 003, already under the `deep-improvement` name.

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:180-230]
[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37-44]
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:1-15]

### F-minimax-i4-8: Safe rename ordering — 12 steps with compatibility alias

The rename must follow a specific safe ordering to avoid leaving dangling references:

1. **Freeze inventory** — run `rg 'deep-agent-improvement'` and classify every hit as active operational, active documentation, generated/cache, or historical/archive.
2. **Decide agent identity** — explicitly decide (and record in Phase 002 decision-record) whether `.opencode/agents/deep-agent-improvement.md` becomes `deep-improvement.md` or stays lane-specific as a Lane A proposal-only mutator. This decision gates all mirror updates.
3. **Add compatibility alias** — before renaming, create a temporary old-to-new alias map for advisor compatibility and trace normalization. This prevents Lane C trace parser from miscategorizing runs that happen during the migration window.
4. **`git mv` canonical skill dir** — `git mv .opencode/skills/deep-agent-improvement .opencode/skills/deep-improvement`.
5. **Update renamed skill internals** — SKILL.md name/description/triggers, README, graph metadata, feature catalog, manual testing playbook, references, assets, scripts, tests, and test fixtures.
6. **Update runtime agent and mirrors** — `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` plus `.codex/config.toml` according to the identity decision.
7. **Update deep command docs/assets** — command markdown and YAML assets, keeping `/deep:start-agent-improvement-loop` and `/deep:start-model-benchmark-loop` verbs stable.
8. **Update advisor source and generated artifacts** — aliases.ts, explicit lanes, projection/fusion rules, skill-graph.json, skill_advisor.py, fixtures, and native scorer tests.
9. **Rebuild advisor graph/cache** — run `advisor_rebuild` and verify the new canonical node resolves correctly.
10. **Update global docs and active cross-skill references** — CLAUDE.md, AGENTS.md, skill indexes, install guides, active cross-skill graph metadata.
11. **Residual scan with intentional allowlist** — scan for remaining old-name references; any that remain must be in historical archives, changelogs, or intentional compatibility aliases.
12. **Validate** — run `advisor_validate`, targeted vitest suites, command smoke checks, and `validate.sh --strict` for Phase 002.

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:208-222]
[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:46-55]

### F-minimax-i4-9: The report's Lane A handoff is a concrete artifact, not a recommendation

The report must emit a machine-readable handoff subset that a Lane A follow-up packet can consume directly, without re-interpreting the report. The handoff is a JSON array of findings with `laneAActionable: true`, each with the concrete remediation already expressed as a potential candidate mutation. Lane A then evaluates whether the mutation is safe before promoting it — it does not auto-apply.

The handoff JSON shape:
```json
{
  "handoffVersion": "1.0",
  "sourceReport": "skill-benchmark-report-YYYY-MM-DD-v1.json",
  "targetSkill": "deep-improvement",
  "findings": [
    {
      "id": "f-minimax-i4-001",
      "severity": "critical",
      "dimension": "D5",
      "findingCode": "dead_resource_path",
      "affectedPath": "references/model-benchmark/evaluator_contract.md",
      "candidateMutation": "Restore file at references/model-benchmark/evaluator_contract.md, or remove entry from RESOURCE_MAP['MODEL_BENCHMARK']",
      "laneAPriority": "high",
      "confidence": "high"
    }
  ]
}
```

This is not a full improvement loop — it is the evidence package that a Lane A follow-up uses to create a bounded candidate. The loop-host's `--mode=agent-improvement` then runs the candidate through scoring and promotion as normal.

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:137-140]
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:264-269]

### F-minimax-i4-10: RQ5 synthesis from prior iterations is confirmed with additions

The research.md RQ5 synthesis is confirmed and extended by this iteration's analysis. The report shape (10 sections), remediation taxonomy (16 finding codes), scoring rollup (3-layer composite + confidence + hard gate), and Lane A handoff mechanism are all fully specified. No further RQ5 research iterations are needed. RQ1–RQ4 are also confirmed from prior iterations. RQ6 (rename surface) is confirmed and expanded with Phase 002/003 spec evidence. The remaining open questions from iteration 3 (OQ-i3-1 through OQ-i3-4) are Phase 003 implementation decisions, not research questions.

[SOURCE: synthesized from iterations 001-003 and research/research.md]

---

## Recommendations

1. **Phase 003 builds the 10-section report as the primary output** — start with the Markdown operator-facing version and the JSON machine-readable version in parallel, keeping them synchronized. The ranked findings list (section 9) is the most critical section for follow-up action.

2. **Implement the 3-layer scoring rollup with explicit confidence bands** — do not suppress variance. A skill scored 72 +/- 8 is meaningfully different from 72 +/- 2, and operators need to know which they have before making remediation decisions.

3. **Use the 16-code remediation taxonomy as the canonical finding classification** — every finding emitted by the scorer must map to one of the 16 codes. New finding types that don't fit the taxonomy are recorded as `unknown` with a description, then the taxonomy is updated in a follow-up research pass.

4. **Lane C is advisory by default — emit the handoff JSON as a sidecar, not a mutation** — the report and the handoff JSON are the deliverable. Lane A receives the handoff as candidate evidence, not as an auto-applied fix.

5. **Rename Phase 002 before building Lane C** — the rename changes the skill root, which changes where the benchmark harness looks for `INTENT_SIGNALS`, `RESOURCE_MAP`, and `RUNTIME_ASSETS`. Building Lane C against `deep-agent-improvement` and then renaming to `deep-improvement` would require rebuilding all trace normalization roots.

6. **Add a `skill-benchmark-report-template.md` under `assets/skill-benchmark/`** — following the same pattern as sk-doc's `benchmark_report_template.md`. The template should mirror the 10-section structure and include the JSON schema as an embedded code block.

---

## Open Questions

- **OQ-i4-1**: Should the ranked findings list be sortable by the operator (by severity, by dimension, by affected file), or is the severity-sorted default sufficient? Sorting by dimension would help group findings by remediation actor (skill-advisor vs skill router vs reference owner).

- **OQ-i4-2**: How many findings should appear in the executive summary (section 3)? Should it be a fixed top-N (e.g., top 5), or all critical/high findings regardless of count?

- **OQ-i4-3**: When a finding is `laneAActionable: true`, should the report also suggest which Lane A mode (initialization/proposal-and-evaluation/promotion-and-recovery) is the right entry point for that remediation? Or is that decision always made by the Lane A operator?

---

## Next Focus
Iteration 5 (final): convergence check — confirm all RQ1–RQ7 are answered with stable findings, synthesize the final research.md update if needed, and verify the rename impact map is complete enough to hand to Phase 002.