# sk-design family deep-review — FINAL cross-model triage

12 reviews complete: opus48 (Opus 4.8 / ~/.claude-account2) + gpt55xhigh (GPT-5.5-fast xhigh), 5 iters each, skill-target mode.
Rule: finding = hypothesis → re-verify at file:line before fixing. CONFIRMED = both models independently flagged it.

## Verdict matrix
| Skill | opus | gpt |
|---|---|---|
| sk-design | CONDITIONAL (P1:1 P2:4) | FAIL* (P1:3 P2:1) |
| sk-design-interface | CONDITIONAL (P1:1 P2:6) | CONDITIONAL (P1:2 P2:1) |
| sk-design-md-generator | CONDITIONAL (P1:1 P2:10) | CONDITIONAL (P1:3 P2:1) |
| sk-design-foundations | CONDITIONAL (P1:1 P2:?) | CONDITIONAL (P1:2 P2:1) |
| sk-design-motion | CONDITIONAL (P1:1 P2:2) | PASS (P1:0 P2:1) |
| sk-design-audit | CONDITIONAL (P1:1 P2:?) | CONDITIONAL (P1:1 P2:?) |
*gpt FAIL on sk-design = spec_code/checklist_evidence HARD gates applied to spec folders; spec-folder-oriented, ~n/a for a skill target (opus marked n/a). Gate-applicability artifact — 0 P0 across all 12.

## TIER 1 — CONFIRMED P1 (both models, verified at source) — fix with high confidence
1. **sk-design — SPEC route → non-existent `sk-design-spec`.** Router authority routes SPEC/DESIGN.md → `sk-design-spec` (absent); real child is `sk-design-md-generator`. `SKILL.md:93` (table), `:146` (`ROUTE_TO_CHILD["SPEC"]`), prose at `:333,350` already says md-generator is current. FIX: point route at `sk-design-md-generator`; keep future-`sk-design-spec` deferral note. [VERIFIED: sk-design-spec absent; lines confirmed]
2. **sk-design-md-generator — documented extract path refused by output guard.** Docs: run from `backend/` + relative `--output .opencode/specs/...` → resolves to `backend/.opencode/...` INSIDE skill → `extract.ts:265-269` rejects. FIX: docs+hint use repo-root-relative or absolute `--output`, or run from repo root. [VERIFIED: guard + doc lines confirmed]
3. **sk-design-interface — `references/aesthetics/` presets vs no-preset contract.** `real_ui_loop.md:103` §8: "No style presets, no pick-a-vibe menu, no named aesthetic dials"; but `aesthetics/README.md` is a named-preset catalog ("pick a design preset"). Orphaned (added 8662196; in no routing/catalog/graph key_files). [VERIFIED] → **DESIGN DECISION: remove vs reframe as non-chooser reference cues.**

## TIER 2 — single-model P1 (plausible; verify-then-fix)
4. **motion — router-default-collision** (opus; gpt PASS missed it). `DEFAULT_RESOURCE == RESOURCE_MAP["STRATEGY"]` → STRATEGY intent emits false "no keyed knowledge base" notice. `SKILL.md:106,116,218`. Fits the family router-pseudocode pattern. [verify]
5. **audit — `Bash` over-granted in allowed-tools** (opus). No shipped Bash use → least-privilege drift. 1-line manifest fix. [verify Bash truly unused]
6. **audit — graph-metadata key_files omit executable target resources** (gpt). [verify]
7. **foundations — color-role contract** (opus): playbook/acceptance expects color-role behavior the skill underspecifies. [verify]
8. **foundations — layout playbook routes to `sk-code` before `sk-design-foundations`** (gpt). `foundations/SKILL.md:23-29`. [verify]
9. **interface — Code Mode reference routing lacks tool-access contract** (gpt). `SKILL.md:4,75` vs `design_references_mcp.md:42-47`. [verify]
10. **md-generator — detector catalog/playbook expect token fields the extractor doesn't emit** (gpt); interaction playbook expects raw captures in tokens.json. [verify]

## TIER 3 — spec-doc / orchestrator-pending (not skill bugs)
- 007 review folder absent from 154 parent phase-map (gpt sk-design F003) — resolved when I build 007.
- 006-integration-validation / 005 strict-validation "complete" claims vs evidence (gpt sk-design F002, foundations F001) — completion-reconciliation check.

## CROSS-CUTTING THEMES
- **Smart-router pseudocode defects recur** (sk-design SPEC-route + F5 dead branches; motion DEFAULT_RESOURCE collision) — systematic issue in the seeded router template; warrants a coordinated family pass.
- **Capability/contract drift**: audit Bash over-grant + key_files omissions; interface tool-access contract; family `sk-design`↔`sk-code` field dual-meaning (P2).
- **Routing-target correctness**: nonexistent/precedence targets in two skills.

## P2 backlog (advisory): router dead-branches, parent changelog/ absent, reverse-edge weights, family-field dual meaning, +interface(6)/md-gen(10)/others. Batch-fixable.
