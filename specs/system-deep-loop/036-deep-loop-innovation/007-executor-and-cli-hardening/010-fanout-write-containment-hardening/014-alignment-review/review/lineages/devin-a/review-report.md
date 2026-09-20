# Deep Review Report — Lineage devin-a

- Lineage: `devin-a` (cli-devin / deepseek-v4-flash-max)
- Session: `fanout-devin-a-1789432854146-6hhsgk` | Generation 1 | lineageMode: new
- Target: `specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review` (spec-folder)
- Iterations: 5 of 5 (stopPolicy: max-iterations; convergenceMode: off — convergence telemetry only)

## 1. Executive Summary

**Verdict: CONDITIONAL** — no active P0; 5 active P1; 6 active P2 (advisories, `hasAdvisories: true`).

Scope: six alignment lanes of the 045 remediated deep-loop tree read against the repo rules — sk-code/OpenCode (it. 1), deep-loop command alignment (it. 2), deep-loop agent alignment (it. 3), SKILL.md-vs-references/assets plus feature catalog and playbook alignment (it. 4), general architecture (it. 5). 57 files reviewed across the lineage. Every P0/P1 finding carries file:line evidence and a claim-adjudication packet; all findings verified against the repository in this lineage.

Stop reason: `maxIterationsReached` (cap 5). Convergence is disabled by policy; the ratio trend (1.0 → 0.85 → 0.32 → 0.27 → 0.16) is telemetry only and shows the expected descending pattern as lanes saturated.

## 2. Planning Trigger

CONDITIONAL verdict routes to `/speckit:plan` for remediation of the five P1 findings (F003, F005, F006, F008, F011). All five are doc/asset-level contradictions in the shipped deep-loop surface — no runtime code path was found broken in this lineage, but each P1 describes a shipped contract that can fail a real run (state-log write mechanism confusion, dropped convergence flag, non-delegatable orchestrator mirror, phantom catalog mode, full-loop LEAF dispatch). P2 findings are deferred advisory work for the same planning packet.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First/Last Iteration |
|----|----------|-----------|-------|----------|----------------------|
| F003 | P1 | correctness | Prompt-pack and workflow YAML contradict each other on the state-log write mechanism (gateway projection does not exist) | `.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:98-139` vs `.opencode/commands/deep/assets/deep-review-auto.yaml:97-135`; `append-mode-event.cjs:6`; `fanout-run.cjs:727-754` | 2 / 2 |
| F005 | P1 | correctness | YAML fan-out call sites drop `--convergence-mode` (confirm also drops threshold/stop-policy) | `.opencode/commands/deep/assets/deep-review-auto.yaml:235-242`, `deep-research-auto.yaml:220-228`, `deep-review-confirm.yaml:199-206`; `fanout-run.cjs:2910`; `compiled/deep-review.contract.md:265` | 2 / 2 |
| F006 | P1 | correctness | orchestrate delegation tool surface inconsistent across runtimes and absent from its own permission blocks | `.opencode/agents/orchestrate.md:38` vs `:9-18`; `.pi/agents/orchestrate.md:31` vs `:4-8`; `.claude/agents/orchestrate.md:1-6` | 3 / 3 |
| F008 | P1 | traceability | Hub feature catalog claims non-existent `alignment` workflowMode and seven-mode registry (actual: five modes, two improvement lanes) | `.opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:15,31,35` vs `mode-registry.json` | 4 / 4 |
| F011 | P1 | correctness | deep-review-confirm.yaml native fan-out branch dispatches the LEAF deep-review agent as a full-loop executor | `.opencode/commands/deep/assets/deep-review-confirm.yaml:208-221` vs `deep-review-auto.yaml:224-227`, `.opencode/agents/deep-review.md:30,50-60`, `deep-review/SKILL.md:51` | 5 / 5 |
| F001 | P2 | maintainability | sk-code hub SKILL.md version (4.2.2.0) vs mode-registry.json/hub-router.json (4.1.0.1) | `.opencode/skills/sk-code/SKILL.md:5`; `mode-registry.json:3`; `hub-router.json:3` | 1 / 1 |
| F002 | P2 | maintainability | sk-code-opencode surface packet names review/quality modes by bare aliases | `.opencode/skills/sk-code/sk-code-opencode/SKILL.md:24-25` | 1 / 1 |
| F004 | P2 | maintainability | Duplicated banner comment block in both deep-review YAMLs | `.opencode/commands/deep/assets/deep-review-auto.yaml:1-5`, `deep-review-confirm.yaml:1-5` | 2 / 2 |
| F007 | P2 | traceability | .pi mirrors drop webfetch/external_directory with declared unmapping comments | `.pi/agents/deep-research.md:8`; `.pi/agents/deep-improvement.md:8` | 3 / 3 |
| F009 | P2 | maintainability | system-deep-loop SKILL.md contradicts itself on improvement-lane count (2 vs 3) | `.opencode/skills/system-deep-loop/SKILL.md:27,57-60,120,161` | 4 / 4 |
| F010 | P2 | traceability | cli-external-orchestration ROUTER.md stage-2 leaf sets cover six modes; registry/leaf-manifest register seven (cli-hermes missing) | `.opencode/skills/cli-external-orchestration/ROUTER.md:24-70` vs `mode-registry.json`/`leaf-manifest.json` | 4 / 4 |

## 4. Remediation Workstreams

- **WS-1 — State-write mechanism reconciliation (F003).** Decide the live contract: either implement the projection refresh the prompt pack describes (`append-mode-event.cjs` gains a review-mode projection) or rewrite the prompt pack to match the YAML's direct-write-plus-gateway-intent mechanism. Owner: deep-review command surface; verification: grep both artifacts for agreement + one fan-out run with gateway call observed.
- **WS-2 — Fan-out flag forwarding (F005).** Add `--convergence-mode {convergence_mode}` (and `--convergence-threshold`/`--stop-policy` in the confirm variant) to the three `fanout-run.cjs` call sites in `deep-{review,research}-{auto,confirm}.yaml`. Verification: `grep fanout-run.cjs` on the YAMLs shows the flags; a fan-out run with `--convergence-mode=off` carries `config.convergenceMode: off` in the leaf prompt.
- **WS-3 — orchestrate delegation surface (F006).** Grant the task/Agent tool in `.opencode/agents/orchestrate.md` and `.pi/agents/orchestrate.md` frontmatter (or document the runtime default), matching `.claude/agents/orchestrate.md`. Verification: frontmatter parity diff across four runtimes.
- **WS-4 — Catalog and lane-count truth (F008, F009, F010).** Rewrite `feature-catalog.md` to the five-mode registry (drop `alignment`, two improvement lanes); unify SKILL.md lane wording on two lanes; add the cli-hermes leaf set to `cli-external-orchestration/ROUTER.md` or document the deliberate exclusion. Verification: programmatic registry read vs catalog claims; ROUTER.md mode-key grep.
- **WS-5 — Confirm native fan-out rewire (F011).** Replace the raw LEAF dispatch in `deep-review-confirm.yaml` `step_fanout_spawn_native` with the command-surface single-lineage invocation (`config.fanout_lineage_artifact_dir`), matching the auto path. Verification: confirm-mode fan-out with a native executor produces a compliant lineage dir.
- **WS-6 — Housekeeping advisories (F001, F002, F004, F007).** Version-field parity for sk-code hub; canonical workflowMode keys in sk-code-opencode; remove duplicated YAML banners; document pi webfetch drop in the canonical deep-research agent.

## 5. Spec Seed

- `014-alignment-review/spec.md` REQ-003: satisfied for this lineage — every P0/P1 finding verified against the repository; binding recommendations above name the phase-relevant files (the parent packet's next phases should cover WS-1..WS-5).
- Success criteria SC-001/SC-002: lane-level evidence recorded; merged attribution and parent-goal check are the fan-out merge step's responsibility (devin-a contributes its registry + report).

## 6. Plan Seed

1. (WS-1) Update `prompt-pack-iteration.md.tmpl` or `append-mode-event.cjs`; add parity test. (F003)
2. (WS-2) Forward convergence/stop-policy flags at all fan-out call sites in the four deep-* YAMLs. (F005)
3. (WS-3) Add task/Agent grants to orchestrate frontmatter in `.opencode/` and `.pi/`. (F006)
4. (WS-4) Rewrite hub `feature-catalog.md` (five modes), unify SKILL.md lane wording, add cli-hermes ROUTER leaf set. (F008/F009/F010)
5. (WS-5) Rewire confirm-mode native fan-out to the command surface. (F011)
6. (WS-6) Version-parity fix + banner cleanup + pi unmapping doc. (F001/F002/F004/F007)

## 7. Traceability Status

| Protocol | Level | Status | Iteration(s) | Evidence |
|----------|-------|--------|--------------|----------|
| `spec_code` | core (hard) | **fail** | 2, 5 | F003/F005 (it. 2), F011 (it. 5) — shipped command assets contradict each other and their own contracts |
| `checklist_evidence` | core (hard) | notApplicable | 1 | No checklist.md in target packet (Level-2 scaffold) |
| `skill_agent` | overlay | partial | 1, 4 | F002 naming drift; F009 lane-count contradiction |
| `agent_cross_runtime` | overlay | partial | 3 | F006 orchestrate delegation tool; F007 pi unmappings |
| `feature_catalog_code` | overlay | **fail** | 1, 4 | F008 phantom `alignment` mode; seven-vs-five mode count |
| `playbook_capability` | overlay | partial | 4, 5 | Fan-out scenario + DL-CR-001 + merge semantics verified structurally; no end-to-end execution |

## 8. Deferred Items

- P2 advisories (F001, F002, F004, F007, F009, F010) — grouped in WS-4/WS-6, none blocking.
- Full end-to-end playbook scenario execution (interactive CLI runs) — out of scope for a read-only lineage.
- Body-level full-diff of 600-line agent files across runtimes — frontmatter + contract-critical lines audited; the merged fan-out may extend this.
- `fanout-pool.cjs` cap logic and `fanout-salvage.cjs` internals — exercised only under multi-lineage load; not deep-read.

## 9. Audit Appendix

### Iteration table

| It | Focus | Ratio | New findings | Verdict |
|----|-------|-------|--------------|---------|
| 1 | Lane 1: sk-code + OpenCode alignment | 1.0 | 0/0/2 | PASS |
| 2 | Lane 4: deep-loop command alignment | 0.85 | 0/2/1 | CONDITIONAL |
| 3 | Lane 5: deep-loop agent alignment | 0.32 | 0/1/1 | CONDITIONAL |
| 4 | Lane 3+2: SKILL.md vs refs + catalogs/playbooks | 0.27 | 0/1/2 | CONDITIONAL |
| 5 | Lane 6: general architecture | 0.16 | 0/1/0 | CONDITIONAL |

### Convergence replay (telemetry; convergence off)

- Severity-weighted new-findings ratios: 1.0, 0.85, 0.32, 0.27, 0.16 — strictly descending as lanes saturated; no false-positive STOP; cap reached at 5/5.
- Stop decision recorded: `maxIterationsReached` (policy: max-iterations; convergenceMode: off per packet goal D3).
- No stuck events; no blocked stops; no pause events.

### File coverage matrix

Covered per lane: sk-code hub + surfaces + compiled-route bin + opencode.json + plugins (it. 1); deep-review/research auto+confirm YAML fan-out call sites, compiled contract, prompt pack, gateway, runner (it. 2); four deep-loop agents × four runtimes (it. 3); system-deep-loop + cli-external-orchestration hubs, registries, catalogs, playbooks, ROUTERs (it. 4); fanout-merge, confirm-native branch, lock model (it. 5). 57 files cumulative.

### Quality gates

- Evidence: every finding has file:line evidence; no inference-only findings.
- Scope: all writes confined to `review/lineages/devin-a/`; review targets read-only.
- Coverage: all six packet lanes covered; route-proof fields (`target_agent`, `resolved_route`, `agent_definition_loaded`, `mode`) present on every iteration record (REQ-001).
- Claim adjudication: typed packets for F003, F005, F006, F008, F011 (all P1s) with counterevidence and downgrade triggers.
- Adversarial P0 replay: no P0 asserted in any iteration; no downgrades required.
- Lineage state: config/state-log/registry/strategy/dashboard consistent; JSONL parse-verified.

### Report metadata

- Verdict: CONDITIONAL | activeP0: 0 | activeP1: 5 | activeP2: 6 | hasAdvisories: true
- stopReason: maxIterationsReached
- dimensionCoverage: 1.0 (correctness, security, traceability, maintainability all covered across the five lanes)
