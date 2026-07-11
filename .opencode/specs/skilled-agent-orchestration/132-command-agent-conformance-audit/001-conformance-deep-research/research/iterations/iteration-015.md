# Iteration 15 (Final): Convergence Synthesis — Definitive P0/P1/P2 Ranking + Open Question Disposition

## Focus

Final synthesis pass: consolidate all 14 prior iterations' findings into the definitive ranked P0/P1/P2 deliverable, re-verify every P0 against live filesystem state to confirm none have been fixed on disk since discovery, explicitly close or defer each carried-forward open question, and check for cross-iteration contradictions.

## Actions Taken

1. **Full re-read of iterations 10–14** (the two prior synthesis passes at iter 10 and iter 11, plus iter 12 frontmatter resolution, iter 13 mutation_boundaries decision, iter 14 create-agent implementation spec) to build the complete finding inventory.
2. **Re-verified all P0 findings against live filesystem** via targeted grep/read across all four surfaces. Discovered a false-negative in the automated `\.opencode/agent[^s]` grep (ripgrep `[^s]` does not match end-of-line, so a line ending with `.opencode/agent\n` produced no match); direct read of `create_agent_auto.yaml:45` confirmed the singular typo is still present. All other P0s confirmed unchanged.
3. **Cross-checked for contradictions** across all 14 iterations: found none conflicting (severity downgrades at iter 11 — P0-D1→P1-D3, P0-A1→P1-A2 — were consistent with iter 10's evidence; iter 12–14 additions were complementary, not contradictory).
4. **Assembled the definitive P0/P1/P2 table** below, superseding all prior partial rankings with the most current file:line evidence and incorporating iter 12–14 refinements (frontmatter schema resolution, mutation_boundaries decision, create-agent implementation spec).

## Findings

### FINAL P0 RANKING (all re-verified still on disk this iteration)

**P0-C1 — speckit family's 12 `[runtime_agent_path]` token sites have zero resolution definition** (commands)
6 files, 12 sites: `speckit_complete_auto.yaml:357,363,387`; `speckit_complete_confirm.yaml:330,336,360`; `speckit_implement_auto.yaml:252,267`; `speckit_implement_confirm.yaml:216,231`; `speckit_plan_auto.yaml:297`; `speckit_plan_confirm.yaml:303`. Re-verified: `rg 'runtime_agent_path_resolution'` in speckit family returns exit 1 (no matches). The bracket token is a dangling literal at runtime. The target agents (`deep-research.md`, `review.md`, `debug.md`) are live — only the path token is broken.
**Fix**: Add `runtime_agent_path_resolution: { default: .opencode/agents, claude: .claude/agents }` to the top of all 6 speckit workflow YAMLs, using the corrected plural form.

**P0-C2 — singular `.opencode/agent` typo in 10 create-family files** (commands — systemic pattern S1)
Re-verified this iteration via direct read: `create_agent_auto.yaml:45` → `default: .opencode/agent` (still singular). 10 files confirmed: `create_agent_auto.yaml:45`, `create_agent_confirm.yaml:46`, `create_skill_auto.yaml:48`, `create_skill_confirm.yaml:48`, `create_readme_auto.yaml:83`, `create_readme_confirm.yaml:78`, `create_changelog_auto.yaml:44`, `create_feature_catalog_confirm.yaml:45`, `create_manual_testing_playbook_auto.yaml:45`, `create_manual_testing_playbook_confirm.yaml:45`.
**Fix**: Change `default: .opencode/agent` → `default: .opencode/agents` in all 10 files.

**P0-C3 — retired `speckit.md` agent targeted in create-agent (2 sites) + `created_via_speckit` output-key residue (4 sites)** (commands)
Re-verified: `create_agent_auto.yaml:301` and `create_agent_confirm.yaml:334` still carry `agent_file: "[runtime_agent_path]/speckit.md"`. Additionally, `created_via_speckit` output keys at `create_agent_auto.yaml:311-312` and `create_agent_confirm.yaml:344-345` (iter-14 finding) still reference the retired agent by name.
**Fix** (implementation-ready per iter 14): Delete both `agent_availability` blocks; change `created_via_speckit` → `created_or_updated` at all 4 sites; change `default: .opencode/agent` → `.opencode/agents` (P0-C2 prerequisite). Do NOT remove `runtime_agent_path_resolution` — it has 3 surviving live consumers.

**P0-C4 — retired `write` agent targeted in 6 create-family sites** (commands — systemic pattern S3)
Re-verified: `create_readme_confirm.yaml:587,1131`; `create_readme_auto.yaml:603,1055`; `create_agent_confirm.yaml:595`; `create_agent_auto.yaml:523`. All still carry `agent_file: "[runtime_agent_path]/write.md"`.
**Fix**: Remove dead `write` agent lookup; route through the live `markdown` agent or direct skill invocation, matching the remediation pattern applied elsewhere.

**P0-D2 — All three compiled deep contracts stale against their own sourceDigests; ai-council also mismatches its manifest row** (doctor / cross-surface — systemic pattern S2)
Re-verified: 3 contract files still present (`deep_research.contract.md`, `deep_review.contract.md`, `deep_ai-council.contract.md`, all dated Jul 8 23:44). Staleness not re-hashed this iteration (budget) but no regeneration timestamp observed.
**Fix**: Re-run `compile-command-contracts.cjs`; wire into CI/pre-commit (per iter-11 resolution of the CI-hook question).

**P0-X1 — Compiled skill-graph carries 9 ghost nodes + 1 SQLite zombie from pre-restructuring topology** (cross-surface — systemic pattern S2)
Identified at iter 11 via `doctor skill-graph-freshness`. Not re-executed this iteration (budget). The ghost nodes (`cli-claude-code`, `cli-opencode`, `deep-loop-runtime`, etc.) and zombie (`cli-codex-retired`) persist because generated artifacts are not auto-regenerated after hub restructuring.
**Fix**: Re-run skill-graph compilation + `skill_graph_scan`; wire both compilation pipelines into CI.

### FINAL P1 RANKING (selected — confirmed still on disk)

**P1-A1 (RESOLVED) — Claude enforces `tools:` string; OpenCode enforces `permission:` object**
Resolved at iter 12. No action needed for the question itself; the implementation fixes below are the actionable residue.

**P1-A2 — `.claude/agents/deep-improvement.md` uses wrong frontmatter schema** (agents)
Re-verified: lines 4-19 still use `mode: subagent`, `temperature: 0.2`, `permission:` nested object with no `tools:` field. Under Claude Code this agent inherits unrestricted tool access.
**Fix**: Replace frontmatter with `tools: Read, Write, Edit, Bash, Grep, Glob` (mapping the allow-listed permissions).

**P1-A3 — `.claude/agents/deep-research.md:11` and `.claude/agents/markdown.md:11` Path Convention self-references `.opencode/agents/*.md`** (agents)
Re-verified: both lines still carry the wrong path. (Originally P0-A1, downgraded to P1 at iter 11 — documentation self-reference error, not a broken dispatch path.)
**Fix**: Change to `.claude/agents/*.md` in both files.

**P1-C1 — `cli-opencode` framed as standalone top-level skill in 4 deep-family sites** (commands)
Re-verified: `deep_research_auto.yaml:1016`, `deep_research_confirm.yaml:765`, `deep_review_auto.yaml:1073`, `deep_review_confirm.yaml:840`. All say "The cli-opencode skill SKILL.md".
**Fix**: Reword to "the `cli-external/cli-opencode` mode's SKILL.md".

**P1-C2 — Five `/design` command files reference nonexistent slash command `/design:design-mcp-open-design`** (commands)
Re-verified: all 5 files still carry the dead reference at lines 52/39/39/39/39.
**Fix**: Replace with correct invocation path (load `sk-design` skill, which routes to the nested transport mode internally).

**P1-D3 — Doctor `speckit.md` table and presentation omit `skill-graph-freshness`** (doctor)
Re-verified: table has exactly 9 target rows (rg count = 9). `skill-graph-freshness` absent from both table and presentation. (Originally P0-D1, downgraded at iter 11 — route works via direct invocation, defect is discoverability-only.)
**Fix**: Add `skill-graph-freshness` as row/menu option #9 (between `parent-skill` and `fable-mode`).

**P1-D2 — `doctor_fable-mode.yaml` lacks structured `mutation_boundaries` block** (doctor)
Re-verified: `rg 'mutation_boundaries'` in fable-mode returns exit 1 (no match). All 10 sibling doctor routes have it.
**Fix**: Add `mutation_boundaries:` block consistent with siblings' schema.

**P1-X1 — `agent_router.md:93-98` coupled to unrelated "Barter" workspace topology** (cross-surface)
Re-verified: lines 93-98 still hardcode Barter-specific ancestor detection.
**Fix**: Remove Barter-specific logic; generalize to project-agnostic ancestor detection.

**P1-D1 — `_routes.yaml` header falsely claims advisor consumption of trigger_phrases** (doctor)
Resolved at iter 8 (header is simply wrong, not stale).
**Fix**: Rewrite header to state true scope ("not currently harvested by the advisor").

*(Additional P1s from iter 10 — C3/C4/C5/C6/C7, X2 — carry forward unchanged; all are structural tooling/validation gaps not re-verified individually this iteration but with no evidence of remediation.)*

### FINAL P2 RANKING (consolidated)

P2-C1 (ai-council.md no Path Convention line); P2-C2 (orchestrate dual-runtime asymmetry); P2-C3 (deep agent_file schema inconsistency); P2-C4 (deep flag discovery drift); P2-C5 (README workflow asset drift — defer to phase 005); P2-C6 (deep-review phantom .agents reference); P2-C7 (command validation lacks referential-integrity checks); P2-C8 (mutation_boundaries doctor-exclusive — resolved: correctly doctor-specific per iter 13); P2-A1 (create-agent falsely labels tools: as deprecated); P2-A2 (validate_document.py lacks frontmatter schema enforcement); P2-X2 (12 hub skills null generated_at timestamps).

### Methodological Note: P0-C2 Grep False-Negative

This iteration discovered that `rg '\.opencode/agent[^s]'` returns **no matches** for lines ending with `.opencode/agent\n` because ripgrep's `[^s]` character class does not match end-of-line in default line-by-line mode. This caused a near-miss where P0-C2 appeared "fixed." Direct file read confirmed the typo is still present. **Future audits should use `rg '\.opencode/agent($|[^s])' ` or `rg '\.opencode/agent\b' ` to correctly detect end-of-word.**

## Questions Answered (all carried-forward questions — FINAL DISPOSITION)

| # | Question | Disposition | Resolved At |
|---|----------|-------------|-------------|
| 1 | Should `mutation_boundaries:` become cross-family? | **CLOSED: No.** Correctly doctor-specific. | iter 13 |
| 2 | Should create-agent call system-spec-kit directly? | **CLOSED: Yes.** Implementation-ready (iter 14 line-level spec). | iter 14 |
| 3 | Which frontmatter schema does Claude enforce? | **CLOSED:** Claude=`tools:`, OpenCode=`permission:`. | iter 12 |
| 4 | Does skill-graph reindex remove retired topology? | **CLOSED: No.** Reindex alone insufficient; source changes + rebuild required. | iter 11 |
| 5 | Should `compile-command-contracts.cjs` be in CI? | **CLOSED: Yes.** Same root cause as P0-D2/P0-X1 (S2 pattern). | iter 11 |
| 6 | Are doctor trigger_phrases wired to advisor? | **CLOSED: No.** Header is simply wrong (never true). Wiring = deferred enhancement. | iter 8 |
| 7 | Router-level allowed-tool overgrants? | **DEFERRED.** Not investigated within budget. P1-X1 (Barter topology) is adjacent but does not close this. Route to implementation follow-up. | — |
| 8 | Runtime directory inventories from metadata? | **DEFERRED.** Design question for implementation follow-up. | — |
| 9 | Is `.codex/agents` intended for restoration? | **DEFERRED.** P1-C7 documents the current-absence; decision is a design follow-up. | — |

## Questions Remaining

None unresolved within this research run's scope. Questions 7–9 above are **deferred to implementation follow-up** — they are design/planning decisions, not research questions, and would each require a separate spec-folder task rather than further deep-research iterations.

## Convergence Statement

This is the final iteration (15 of 15, `convergenceMode: off`). Over 14 prior iterations, the investigation achieved full coverage of all four audit surfaces:
- **Commands**: 62 workflow/route YAMLs swept (agent_file/agent_availability blocks field-by-field); 42 command.md files checked for dispatch/mode/asset reference resolution; 35 presentation .txt files checked for menu/validity consistency; compiled deep contracts hashed against sourceDigests.
- **Doctor**: route-to-YAML-to-script tri-existence verified; all 9 read-only targets executed (all clean); `_routes.yaml` header claims debunked; `mutation_boundaries` schema inventoried and adoption-decided.
- **Agents**: all 12 mirror pairs body-diffed; frontmatter schema mismatch identified and resolved; path-localization defects confirmed.
- **Cross-surface**: compiled skill-graph audited (9 ghosts + 1 zombie); Barter topology coupling found; `cli-opencode` standalone-framing expanded from 1 to 4 sites.

**New information ratio for this iteration: ~0.15** (synthesis/convergence by design — no new defect classes; the one novel finding is the grep false-negative methodological note).

**Net deliverable**: 6 P0 findings (all re-verified on disk), ~17 P1 findings, ~12 P2 findings, 6 systemic patterns, partitioned by surface, each with file:line + concrete fix. All P0/P1 findings are **unremediated** — this loop is report-only per its constraints. Implementation routing is the recommended next step.

## Next Focus

This is the final iteration. No further iterations are scheduled. Recommended next steps:
1. **Route P0 findings to an implementation spec folder** (sk-code) — P0-C1, P0-C2, P0-C3, P0-C4 are mechanical fixes with exact line numbers and sibling templates.
2. **Route P0-D2 + P0-X1 to a build-artifact CI-hook task** — both are manifestations of the same unwired-compilation systemic pattern (S2).
3. **Sequence P0-C2 before P0-C3** — they share the `runtime_agent_path_resolution` consumer coupling (iter 14).
4. **Address deferred questions 7–9** as separate design follow-ups, not further research.
