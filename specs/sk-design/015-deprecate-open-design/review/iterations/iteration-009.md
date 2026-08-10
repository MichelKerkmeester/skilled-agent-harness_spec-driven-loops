# Deep Review Iteration 009

## Dispatcher
- Mode: `review`; target agent: `deep-review`; resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus every live referencing surface and `specs/sk-design/015-deprecate-open-design` deprecation plan.
- Focus: correctness/completeness — adversarial replay of the whole live-reference inventory.
- Budget profile: `verify` (fresh sweep, targeted reads, and skeptic/referee replay; within the declared 13-call ceiling).
- Lineage: session `rvw-2026-08-10-deprecate-open-design`, generation `1`, `lineageMode=new`.

## Files Reviewed
- Fresh tracked/non-ignored workspace sweep, excluding `specs/**`, `**/changelog/**`, `**/benchmark/**`, SQLite files, `.worktrees/**`, `.pi-subagents/**`, and review packets; variants included hyphen/underscore/spaced/camel/uppercase forms, bounded `OD_` names, and `od` near design contexts.
- `.claude/.utcp_config.json`; `.cursor/agents/design.md`; `.cursor/agents/deep-alignment.md`; `.cursor/commands/interface-design.md`; `.cursor/commands/interface-design-reference.md`; `.cursor/commands/doctor-mcp.md`; `.devin/agents/design/AGENT.md`; `.devin/agents/deep-alignment/AGENT.md`.
- `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md`; `lifecycle-routing/age-haircut.md`; `lifecycle-routing/supersession.md`; `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py`.
- `CLAUDE.md`; requested `.opencode/hooks/**`, `.opencode/plugins/**`, `.opencode/bin/**`, `.opencode/commands/deep/**`, `.claude/settings*`, `.codex/config.toml`, `.pi/mcp.json`, `.pi/settings.json`, package scripts, and test/spec surfaces.
- Skeptic rereads: `.opencode/skills/sk-design/shared/design-proof-token.md:40`; `.opencode/skills/sk-design/shared/references/smart-routing.md:83,120`; `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2122-2135`; central Lane-C public/private fixtures at `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:34` and `.../sk-design-alias-foundations-001.private.json:12`.

## Findings - New

### P0 Findings
- None. No exploitable security issue, auth bypass, destructive data loss, or credential disclosure was established.

### P1 Findings

1. **Live `.claude` MCP configuration is omitted from the deprecation inventory** -- `.claude/.utcp_config.json:143-156` -- The duplicate `open_design` server entry remains in a runtime configuration surface, including retired app wiring and `OD_DATA_DIR`/`OD_SIDECAR_IPC_PATH` names. The spec and T021 name only the root `.utcp_config.json`; T025 names `.claude` agent mirrors, not this config. Removing only the root registration can therefore leave a live configuration pointing at the retired transport and makes the NFR-S01 residue claim unverifiable.
   - Finding class: `cross-consumer`
   - Scope proof: The corrected whole-workspace sweep found this exact config as an unmatched hit; direct reread confirmed the `open_design` entry and retired env-name block. It is not under a documented historical exclusion.
   - Affected surface hints: [`.claude/.utcp_config.json`, `open_design` MCP registration, `OD_DATA_DIR`/`OD_SIDECAR_IPC_PATH`, T021, NFR-S01]
   - Claim adjudication:
```json
{"type":"correctness","claim":"The removal plan can leave a live .claude MCP configuration registering the retired transport after deleting only the root registration.","evidenceRefs":[".claude/.utcp_config.json:143-156","specs/sk-design/015-deprecate-open-design/spec.md:101-121","specs/sk-design/015-deprecate-open-design/tasks.md:20-29"],"counterevidenceSought":"Checked whether the .claude config was historical, ignored, or covered by the named root-config/agent actions; no exclusion or explicit config action was found.","alternativeExplanation":"This file could be an unused local-runtime copy, but its shipped .claude location and live MCP schema still require explicit classification before a zero-residue claim.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Prove the file is not a live tracked runtime surface and record an exact exclusion, or add it to T021/T025 with JSON/env-name verification."}
```

2. **Cursor and Devin runtime agents/commands are outside the cross-runtime removal inventory** -- `.cursor/agents/design.md:3,50,65,77-78`; `.devin/agents/design/AGENT.md:3,50,65,77-78`; `.cursor/commands/interface-design.md:28` -- Both additional agent runtimes retain the nested `design-mcp-open-design` mode and Open Design route, while Cursor command surfaces also retain dispatch references. The scope table and T025 enumerate only `.opencode`, `.claude`, `.codex`, and `.pi`, so mirror parity and the final live-surface gate can pass while these active runtime surfaces still route the removed capability.
   - Finding class: `cross-consumer`
   - Scope proof: The corrected sweep found five Cursor files and two Devin agent files outside every plan prefix; direct reads confirmed identical design-agent mode maps and a Cursor interface command reference. These are not historical records or review artifacts.
   - Affected surface hints: [`.cursor/agents/**`, `.cursor/commands/**`, `.devin/agents/**`, runtime parity matrix, T025, REQ-004]
   - Claim adjudication:
```json
{"type":"traceability","claim":"The plan's four-runtime parity list is incomplete and can leave Cursor/Devin dispatch surfaces pointing at the retired transport.","evidenceRefs":[".cursor/agents/design.md:3,50,65,77-78",".cursor/agents/deep-alignment.md:165,435,446,504",".cursor/commands/interface-design.md:28",".devin/agents/design/AGENT.md:3,50,65,77-78",".devin/agents/deep-alignment/AGENT.md:165,435,446,504","specs/sk-design/015-deprecate-open-design/spec.md:119-121","specs/sk-design/015-deprecate-open-design/tasks.md:41-45"],"counterevidenceSought":"Checked the declared runtime list, repository status/classification, and the extra runtime files for historical markers or a documented exclusion; none was found.","alternativeExplanation":"Cursor/Devin may be downstream packaging surfaces rather than the primary runtime, but they are tracked agent/command surfaces and still violate the stated whole-workspace zero-reference objective unless explicitly classified.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Document these runtimes as out of scope with a proof they cannot load repository agents, or add all exact paths and parity checks to T025/REQ-004."}
```

3. **Advisor manual-testing playbooks retain transport paths beyond T029's named corpus files** -- `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md:118`; `.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/age-haircut.md:98`; `.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/supersession.md:125-126` -- Shipped advisor playbook evidence still enumerates `mcp-open-design`/the old packet path. T029 names only `skill_advisor.py` and `skill-graph.json`, so a scorer/graph refresh can leave these source documents and their indexed references unchanged while the plan reports the advisor corpus clean.
   - Finding class: `cross-consumer`
   - Scope proof: Three exact live playbook files were found by the corrected variant sweep; they sit outside `specs/`, changelog, benchmark, and review exclusions and outside T029's exact paths. The auto-indexing corpus explicitly lists the transport skill path.
   - Affected surface hints: [advisor manual-testing-playbook, auto-indexing corpus, lifecycle-routing fixtures, T029, graph/index rebuild]
   - Claim adjudication:
```json
{"type":"traceability","claim":"T029 can complete without removing or classifying transport-specific advisor playbook source entries that feed or explain the advisor corpus.","evidenceRefs":[".opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md:118",".opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/age-haircut.md:98",".opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/supersession.md:125-126","specs/sk-design/015-deprecate-open-design/tasks.md:54","specs/sk-design/015-deprecate-open-design/plan.md:81"],"counterevidenceSought":"Checked T029's exact file list and whether these playbook files were historical or listed exclusions; no named action or exclusion was found.","alternativeExplanation":"The blocks could be frozen evidence snapshots, but they remain in a live skill playbook and the plan's requirement is zero live transport references, so their status must be explicit.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Prove these exact files are not indexed/loaded and add a durable historical exclusion, or remove/regenerate them under T029 with a post-build residue check."}
```

4. **Root `CLAUDE.md` is omitted from root-document cleanup** -- `CLAUDE.md:526` -- The active root quick-reference table still directs UI/design work to `design-mcp-open-design`, but the scope and T030 list only `README.md`, `AGENTS.md`, and `BARTER.md`. A final gate based on the plan's named root files can pass while the canonical Claude runtime guidance remains stale.
   - Finding class: `cross-consumer`
   - Scope proof: The corrected whole-workspace sweep found `CLAUDE.md:526` as an unmatched root hit; direct reread shows it in an active workflow reference table, not a dated report or historical record.
   - Affected surface hints: [`CLAUDE.md`, root runtime guidance, T030, REQ-004, residue allowlist]
   - Claim adjudication:
```json
{"type":"traceability","claim":"T030 can complete while the active root CLAUDE.md still recommends the retired transport.","evidenceRefs":["CLAUDE.md:526","specs/sk-design/015-deprecate-open-design/spec.md:123-126","specs/sk-design/015-deprecate-open-design/tasks.md:56"],"counterevidenceSought":"Checked the root-doc scope and whether CLAUDE.md is historical or excluded; it is a current root guidance file and is not named in the plan.","alternativeExplanation":"CLAUDE.md may be generated or operator-local, but it is tracked root guidance and must be classified before claiming whole-workspace zero residue.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Document an exact generated/ignored exclusion with proof, or add CLAUDE.md to T030 and rerun the root-doc residue check."}
```

## Findings - Carried / Reverified

### P0 Findings
- None carried.

### P1 Findings
- **P1-001 — confirmed, no downgrade** -- `.opencode/skills/sk-design/shared/design-proof-token.md:40`, `.opencode/skills/sk-design/shared/references/smart-routing.md:83,120`. The direct reread still shows `openDesignLineageDigest` and `OPEN_DESIGN` live identifiers while the plan's residue expression remains limited to hyphen/underscore/spaced forms. Full Hunter/Skeptic/Referee status: Hunter found the live variants; Skeptic found no historical exclusion; Referee retains P1. Finding class: `cross-consumer`. Scope proof: corrected variant sweep plus cited shared-routing reads. Affected surface hints: [REQ-003/REQ-004 gate, shared proof token, smart-routing]. Claim adjudication: `{"type":"correctness","claim":"The residue gate can pass while camelCase/uppercase transport identifiers remain live.","evidenceRefs":[".opencode/skills/sk-design/shared/design-proof-token.md:40",".opencode/skills/sk-design/shared/references/smart-routing.md:83,120","specs/sk-design/015-deprecate-open-design/plan.md:58"],"counterevidenceSought":"Re-read the shared files and checked whether the exact identifiers are documented exclusions; they are not.","alternativeExplanation":"They may be proof-schema fields rather than routing tokens, but REQ-003/004 require classification/removal of all live transport references.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Expand the gate/inventory or remove/classify the exact identifiers and prove the rerun."}`
- **P1-010 — confirmed, no downgrade** -- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2122-2135`. The six transport-specific intent boosters and transport comment remain live; the graph's lack of a direct child entry does not remove scorer residue. Finding class: `cross-consumer`. Scope proof: direct reread plus corrected whole-workspace sweep. Affected surface hints: [advisor scorer, graph source/derived corpus, T029, advisor probe]. Claim adjudication: `{"type":"correctness","claim":"Advisor scoring can continue routing Open Design phrases toward sk-design after packet removal because transport-specific boosters remain.","evidenceRefs":[".opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2122-2135","specs/sk-design/015-deprecate-open-design/tasks.md:54"],"counterevidenceSought":"Confirmed the direct child is absent from skill-graph.json but the scorer entries remain active.","alternativeExplanation":"Generic design intent may share the parent skill, but explicit Open Design and OD vocabulary is transport-specific.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Remove/genericize each booster and attach a no-residue advisor probe."}`
- **P1-015 — confirmed, no downgrade** -- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:34`; `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-alias-foundations-001.private.json:12`. Public proof payload and private gold still contain the retired packet label; prior loader run found 43 rows with 42 retired labels/payloads. Finding class: `matrix/evidence`. Scope proof: direct fixture reread plus the live recursive fixture-loader evidence from iteration 008. Affected surface hints: [Lane-C loader, central public/private gold, benchmark rerun, live-surface allowlist]. Claim adjudication: `{"type":"correctness","claim":"The live Lane-C fixture corpus can be skipped as historical even though its loader consumes public/private pairs containing retired transport labels.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:34",".opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-alias-foundations-001.private.json:12",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:270-300","specs/sk-design/015-deprecate-open-design/plan.md:53-58"],"counterevidenceSought":"Re-read representative public/private pairs and retained the loader execution evidence; no historical marker or no-consumer proof exists.","alternativeExplanation":"The fixtures could be frozen negative gold, but they are undated tracked inputs explicitly consumed by benchmark commands.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Regenerate the pairs and rerun the benchmark, or list every exact path as historical with a no-consumer proof."}

The other active P1 findings (`P1-002..009` and `P1-011..014`) remain carried at P1 with no severity change; their prior exact evidence and action requirements remain in the registry and iterations 1-8. No finding was downgraded.

### P2 Findings
- None.

## Traceability Checks

| Protocol | Level | Status | Evidence / finding refs |
|---|---|---|---|
| `spec_code` | core | partial | `specs/sk-design/015-deprecate-open-design/spec.md:101-126`; `tasks.md:20-58`; P1-001, P1-002, P1-005, P1-007, P1-010, P1-015..P1-019 |
| `checklist_evidence` | core | partial | `checklist.md:22-24,88-94`; P1-004 remains active; no new checklist evidence was produced |
| `skill_agent` | overlay | partial | `.cursor/agents/design.md:3,50,65,77-78`; `.devin/agents/design/AGENT.md:3,50,65,77-78`; advisor scorer `:2122-2135`; P1-010, P1-017, P1-018 |
| `agent_cross_runtime` | overlay | partial | `.opencode/.claude/.codex/.pi` parity was previously covered, but `.cursor` and `.devin` add active families; P1-017 |
| `feature_catalog_code` | overlay | partial | central Lane-C fixture public/private proof and loader evidence; P1-015; no additional catalog mismatch proven |
| `playbook_capability` | overlay | partial | advisor playbook files `auto-indexing/corpus-df-idf.md:118`, `lifecycle-routing/age-haircut.md:98`, `lifecycle-routing/supersession.md:125-126`; P1-018; prior P1-008/P1-013 remain |

## Integration Evidence
- Spec/plan/task surfaces: `specs/sk-design/015-deprecate-open-design/spec.md:101-126`, `plan.md:53-81`, `tasks.md:20-58`.
- Runtime/config surfaces: `.claude/.utcp_config.json:143-156`; `.cursor/agents/design.md:3,50,65,77-78`; `.cursor/commands/interface-design.md:28`; `.devin/agents/design/AGENT.md:3,50,65,77-78`.
- Advisor surfaces: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2122-2135`; advisor manual-testing-playbook paths cited above.
- Existing review integration surfaces rechecked through the review-core doctrine at `.opencode/skills/sk-code/sk-code-review/references/review-core.md:20-70`; no commands/workflows/skills were modified.

## Edge Cases
- The first broad shell sweep overcounted `OD_` because it matched substrings such as `METHOD_ENVELOPE`; a second bounded sweep (`OD_` must start at a non-word boundary) was run and is the authoritative result. The false positives in `.opencode/bin/**` calibration code and `worktree-session.test.sh` were ruled out rather than promoted.
- No `OD_` variables were found in the two tracked `.env.example` files; only filenames and variable names were inspected, and no env values were printed.
- `skill-benchmark` fixture paths are not `**/benchmark/**` dated-report exclusions; P1-015 therefore remains active. Historical/changelog/spec records remain excluded per the packet.
- Advisor playbook hits use both the older `mcp-open-design` path and transport label; whether they are frozen evidence or indexed source does not change the need for an explicit classification/action.
- No `.opencode/hooks/**`, `.opencode/plugins/**`, `.opencode/commands/deep/**`, `.claude/settings*`, `.codex/config.toml`, `.pi/mcp.json`, `.pi/settings.json`, package scripts, or unrelated runtime test surface produced a corrected-token hit.
- Memory/code graph was unavailable; direct repository grep/read evidence was used.

## Confirmed-Clean Surfaces
- Corrected token sweep found no hit in the requested hooks, plugins, deep commands, Claude settings, Codex config, Pi MCP/settings config, or `.env*` variable names.
- `.opencode/bin` calibration implementation and `worktree-session.test.sh` matches from the unbounded first sweep were false positives caused by substring `OD_`; no actual retired-transport token was found there after boundary correction.
- No P0 security/auth/data-loss finding; no secret values were exposed.
- Existing plan-covered surfaces were not reclassified as new omissions; P1-001, P1-002, P1-010, and P1-015 were confirmations/refinements, not duplicates.

## Ruled Out
- No P0 exploit, auth bypass, destructive data loss, or credential disclosure established.
- No downgrade of P1-001, P1-010, or P1-015: the cited evidence was reread and counterevidence did not win.
- No new finding for `.opencode/bin` calibration or worktree tests after the bounded `OD_` correction.
- No recommendation to rewrite historical `specs/`, changelog history, dated benchmark reports, SQLite, `.worktrees/`, or `.pi-subagents/` artifacts.
- No review-target edits were made.

## Next Focus
- dimension: correctness
- focus area: final iteration-010 replay of the four newly uncovered surfaces and implementation-ready inventory closure
- reason: the corrected whole-workspace sweep found four live plan gaps while confirming the three requested carried P1s; all four review dimensions and overlays remain conditionally complete
- rotation status: adversarial completeness replay C2 completed conditionally in iteration 009
- blocked/productive carry-forward: productive — preserve P1-001..P1-019; do not retry bounded-OD false positives or ruled-out archive/report directions
- required evidence: exact `.claude` config and Cursor/Devin path disposition, advisor playbook classification, `CLAUDE.md` root action, then final zero-residue gate and strict validation proof
- recovery note: if any newly named surface is proven generated or historical, record its exact path and consumer proof before downgrading; otherwise amend T021/T025/T029/T030 and rerun the gate.

Review verdict: CONDITIONAL