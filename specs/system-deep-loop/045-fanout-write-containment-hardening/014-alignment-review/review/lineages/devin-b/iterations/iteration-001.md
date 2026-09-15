# Iteration 1: Lane A - sk-code and OpenCode alignment

## Dispatcher
- Lineage: devin-b (fan-out lane 2 of 3), executor cli-devin model=deepseek-v4-flash-max
- Session: fanout-devin-b-1789432854146-6hhsgk, generation 1, lineageMode new
- BINDING: target=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review
- BINDING: maxIterations=5
- BINDING: convergence=0.1 (mode off, telemetry only)
- BINDING: mode=review
- BINDING: dimensions=correctness,traceability,maintainability
- BINDING: specFolder=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review

## Focus
Lane A of spec.md scope: `.opencode/skills/sk-code/` (SKILL.md, mode-registry.json, ROUTER.md, leaf-manifest.json) against the deep-loop runtime (write-containment.ts, fanout-run.cjs), the command YAML executor contracts, and the OpenCode surfaces (opencode.json, .opencode/agents/deep-review.md). Severity angles: correctness (claims vs shipped behavior), traceability (cross-reference integrity of router pointers), maintainability (doc completeness).

## Scorecard
- Dimensions covered: correctness, traceability, maintainability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (first iteration, weighted 3/3)

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F001**: Hub SKILL.md surface axis is under-specified vs the registry. `.opencode/skills/sk-code/SKILL.md:65` lists only `sk-code-webflow` and `sk-code-opencode` as surface discriminators, and the Layout tree (SKILL.md:150-156) omits the `sk-code-mobile-cli/` and `sk-code-obsidian/` packets, while `.opencode/skills/sk-code/mode-registry.json:16-20` registers four surfaces (`sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli`, `sk-code-obsidian`) and all four packet directories exist on disk. Finding class: doc-consistency, scope proof: registry `extensions.surface-axis.surfaces` lists four; hub prose names two, affected surface hints: sk-code SKILL.md §2/§3, mode-registry.json.
  - Dimension: maintainability. Evidence: `[SOURCE: .opencode/skills/sk-code/SKILL.md:65]`, `[SOURCE: .opencode/skills/sk-code/SKILL.md:150-156]`, `[SOURCE: .opencode/skills/sk-code/mode-registry.json:16-20]`.
- **F002**: sk-code-review's ephemeral cache write path is not carved out of deep-loop containment attribution. `.opencode/skills/sk-code/mode-registry.json:50` and `.opencode/skills/sk-code/sk-code-review/SKILL.md:482` scope sk-code-review's Write to `.opencode/.code-review-cache/<repo-ref>.jsonl`, but the fan-out runner's static unattributable dirs (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3358-3366`) list only sibling lineage dirs, CLI legit dirs, and the lineages artifact plane. A lane that triggers the sk-code-review content-hash dedup gate would have its cache write attributed as an out-of-lineage violation and quarantined (preserve mode) or baseline-restored (opt-in restore). Latent write-model misalignment between the two systems; no active lane currently runs the dedup gate, so this is advisory. Finding class: cross-surface-write-model, scope proof: containment carve-out list read at fanout-run.cjs:3358-3366, affected surface hints: write-containment.ts, fanout-run.cjs, sk-code-review SKILL.md.
  - Dimension: traceability. Evidence: `[SOURCE: .opencode/skills/sk-code/mode-registry.json:50]`, `[SOURCE: .opencode/skills/sk-code/sk-code-review/SKILL.md:482]`, `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3358-3366]`.
- **F003**: ROUTER.md prose overview names only `PI_REMOTE` as a bundled evidence surface. `.opencode/skills/sk-code/ROUTER.md:39-41` describes the surface bundle with one example and never names the obsidian evidence surface in prose, while the machine RESOURCE_MAP projection (ROUTER.md:348, 593-596) and mode-registry.json:19 register `sk-code-obsidian`. Prose lags the machine map. Finding class: doc-consistency, scope proof: machine map rows at ROUTER.md:593-596, affected surface hints: ROUTER.md §1.
  - Dimension: maintainability. Evidence: `[SOURCE: .opencode/skills/sk-code/ROUTER.md:39-41]`, `[SOURCE: .opencode/skills/sk-code/ROUTER.md:593-596]`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| skill_agent | partial | advisory | sk-code SKILL.md vs .opencode/agents/deep-review.md | Agent loads `sk-code-review/references/review-core.md` (agent:188); file exists and hub routes it; hub prose incomplete re surface count (F001/F003) |
| feature_catalog_code | pass | advisory | leaf-manifest.json leaves vs disk | All spot-checked leaf paths exist; verification scripts exist (verify_alignment_drift.py, minify-webflow.mjs) |
| spec_code | partial | hard | spec.md lanes vs reviewed surfaces | Lane A surface read; full spec_code replay scheduled for lanes D/F |

## Integration Evidence
- `.opencode/agents/deep-review.md:188` loads sk-code-review doctrine for severity classification — consistent with sk-code hub routing claims (SKILL.md:190).
- `opencode.json` declares mcp `code_mode` launcher and permission block; no hooks key at config level (hooks live under `.opencode/hooks/`), consistent with ROUTER.md HOOKS intent pointing at hook files, not config.
- ROUTER.md:242 spec-folder authoring pointers resolve on disk (system-spec-kit workflows both exist).

## Edge Cases
- Hub frontmatter `allowed-tools` (SKILL.md:4) is a superset of per-mode tool surfaces in mode-registry.json — aggregate vs per-mode contract, not a contradiction; recorded clean.
- F002 depends on a lane actually running the sk-code-review dedup gate; not observed in this lineage. If the gate is never invoked inside lanes, downgrade to doc-note.

## Confirmed-Clean Surfaces
- mode-registry.json entries all have matching packet dirs and `grandfatheredFolderMismatch: false` matches folder==packetSkillName.
- leaf-manifest.json mode keys exactly match mode-registry workflowMode keys (6 modes).
- ROUTER.md verification commands point at existing scripts.
- opencode.json agent/MCP config consistent with .opencode/agents/ contents.

## Ruled Out
- Hub/registry version skew (SKILL.md 4.2.2.0 vs mode-registry 4.1.0.1): registry versions itself independently; not a misalignment.
- `.sk-code-review-cache` vs `.code-review-cache` naming: old changelog digests mention the former; live SKILL.md, README, and mode-registry all use `.code-review-cache` — internally consistent now.

## Dead Ends
- Full leaf-manifest existence sweep: 300+ leaves, spot-checked representative set per packet instead; deep sweep deferred to lane B/F if needed.

## Recommended Next Focus
- Dimension: lane B (feature catalog and playbook alignment) + traceability overlay protocols `feature_catalog_code` and `playbook_capability`.
- Files: `.opencode/skills/system-deep-loop/runtime/feature-catalog/`, `deep-review/feature-catalog/feature-catalog.md`, `manual-testing-playbook/` fan-out entries vs `fanout-run.cjs` shipped flags and containment behavior.
- Reason: the containment remediation touched catalog and playbook docs (parent spec REQ-006); verify the docs describe the shipped preserve-by-default model.

Review verdict: PASS
