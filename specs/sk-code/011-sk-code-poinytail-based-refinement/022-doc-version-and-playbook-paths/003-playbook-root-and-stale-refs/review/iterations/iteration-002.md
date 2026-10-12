# Deep Review — Iteration 002 (D1 Correctness, root path rewrites)

- Run: run-001 · Session: 2026-10-12T10:01:23.529Z · Generation 1 · Lineage: new
- Target: the 13 root `manual-testing-playbook.md` fixes in `b4d4e90192..HEAD` (56-file change set), verified against the ledger in `implementation-summary.md`

## Dimension

Correctness, second pass. The dispatch carried four questions: (1) does each rewritten backticked path name the file the text means; (2) is `hooks/runtime-parity.vitest.ts` really the same subject as the deleted advisor runtime parity test, and are the `manual_namespace` and `tool-input-schema` removals justified by no successor existing; (3) does the cli-opencode CO-013 rewrite match `agent-routing/general-agent-default.md`; (4) did any edit change more than the ledger row says.

## Files Reviewed

- The 13 changed root files, full diff (`-U0` and `-U1`), every hunk mapped to RR-2.01–RR-2.13:
  - `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md:33`
  - `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md:46`
  - `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:223,469`
  - `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md:366,370,372,451,631`
  - `.skilled/skills/cli-external-orchestration/manual-testing-playbook/manual-testing-playbook.md:55`
  - `.skilled/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md` (test cross-reference table, section 16)
  - `.skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:826-834`
  - `.skilled/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:171,186`
  - `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md:180-182`
  - `.skilled/skills/sk-design/sk-design-chart/manual-testing-playbook/manual-testing-playbook.md:374`
  - `.skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md:360`
  - `.skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md:47,98`
  - `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:313-315`
- Ledger and evidence: `implementation-summary.md` (ledger at 79-100, RM-1 at 106), `acceptance-criteria.md`, `goal.md`
- Scenario and contract for Q3: `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md` and `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`
- Successor and removal forensics: `.skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/advisor-rebuild.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/legacy/`; git history for the deleted `advisor-runtime-parity.vitest.ts`, `tool-input-schema.vitest.ts` and `manual_namespace.test.js`
- SR-1..SR-6 diffs: `cli-codex/references/codex-tools.md`, 14 sk-vision catalog files, two cli-cursor hook scenarios, the DAC-002 scenario, `sk-design-diagram/references/import-export/export.md`, the DOC-379 scenario
- `sk-code-obsidian/SKILL.md` §2b and every rewritten target's subject (`head`/titles)

## Findings by Severity

### P0 — none

No P0 findings this iteration.

### P1 — none

No P1 findings this iteration.

### P2

#### R2-P2-001 [P2] The sk-code-obsidian §2b sentence still mixes prefixed and bare file names after the fix

- **Case:** a reader reaches the changed sentence and sees three fully qualified names — `references/setup/setup.md`, `references/operations/operations.md`, `references/quality/doc-quality-gate.md` — beside three bare names, `accessibility.md`, `theme-variables.md` and `skill-reference-integrity.md`, none of which resolves from the root file's directory even though the sentence directly above and §2b itself name all six with the `references/` prefix.
- **File:** [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md:180] and [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md:181]
- **Evidence (OBSERVED):** the diff rewrote exactly the three tokens that carried a `/` (`setup/setup.md`, `operations/operations.md`, `quality/doc-quality-gate.md`) because the checker's token gate requires a slash before it probes bases ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:415]); the preceding sentence at [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md:177] already lists all six with the prefix; §2b carries `references/skill-reference-integrity.md` ([SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:126]), `references/accessibility.md` ([SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:135]) and `references/theme-variables.md` ([SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:136]).
- **Counterevidence sought:** whether bare-name shorthand is the page's convention — the six names appear in exactly two sentences and the other one prefixes all six, so the changed sentence is the outlier.
- **Alternative explanation considered:** the bare tokens can never raise `BACKTICK_PATH_UNRESOLVED` (no slash), so the fix confined itself to warnings. That explains the edit but does not make the mixed forms correct: the sentence now implies the three bare names live somewhere other than `references/`.
- **User impact:** minor — a reader resolving the names by hand lands on the wrong relative path; no checker output or runtime behavior is affected, and the phase's zero-warning criterion is untouched.
- **Finding class:** instance-only (three tokens, one line).
- **Scope proof:** `grep -n` over the file shows the six names in these two sentences only; no other root playbook mixes the two forms on a rewritten line.
- **Affected surface hints:** ["obsidian root summary", "references prefix normalization"]
- **riskScore:** 1 (advisory only)
- **Confidence:** high (direct diff + file reads + §2b).
- **Upgrade trigger:** a reader-facing break traced to the ambiguity — none observed; stays P2. **Downgrade trigger:** none below P2; dropping it would leave the sentence half-normalized.
- **Recommendation:** prefix the remaining three (`references/accessibility.md`, `references/theme-variables.md`, `references/skill-reference-integrity.md`) so the changed sentence matches §2b and its own preceding sentence.

## Verified Clean (ruled out this iteration)

1. **Q1 — every rewritten root path names the file the text means (OBSERVED).** Every rewritten target was probed on disk and exists: the cli-classifier activation manifest, the codex hook-parity scenario, both cursor hook sources, the cli-opencode SKILL.md, the sk-design creation contract, the three advisor runtime files, all 37 mcp-click-up catalog files (38 rows), the four mcp-obsidian vault files, the three obsidian `references/` docs, both sk-doc validator scripts, both sk-doc mode-packet files, and both advisor test files. Subject spot checks match the citing text (`Codex Hook/Plugin Parity`, `Extract Creation Contract`, `clickup_delete_task`, `Version Flag`, `Cap Results`, `Human Voice Rules`, `Agent Template`, `Advisor Rebuild Tests`, `Executor Delegation Resolver`). The cli-classifier manifest content is the generic `selectedPolicy`/`servingAuthority` activation record the sentence describes.
2. **Q2a — the advisor parity successor is the same subject (OBSERVED history + read).** The deleted test was advisor runtime parity across hook adapters (claude/gemini/copilot/codex); the successor asserts advisor brief-shape parity across runtime tags. The `.skilled` path the old row cited was already absent at `b4d4e90192` — the basename was deleted in the spec-081 commit `7a987e8827` — so the row was stale in two ways, and the replacement points at the live equivalent. Observation, outside the diff and not a finding: the successor's own `RUNTIMES` array lists `opencode` twice ([SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts:25]), so its "3-runtime" header overstates its matrix; that does not change the replacement verdict.
3. **Q2b — the `tool-input-schema.vitest.ts` removal is justified (OBSERVED history).** It was deleted in `3095cadc0f` ("delete the memory engine …") together with its schemas and utils (1809 deletions); its schema keys are memory-engine arguments (`query`, `anchors`, `rerank`, `checkpoint_delete`), so the subject went with the memory engine and no successor exists. The advisor's `tests/schemas/advisor-tool-schemas.vitest.ts` is a different subject.
4. **Q2c — the `manual_namespace` row removal is justified (OBSERVED history).** `git log --all -- '*manual_namespace.test.js'` is empty — the file never existed; only `manual_namespace_contract/*.md` scenarios ever matched. The contract's scenarios survive under `manual-namespace-contract/` as CM-005, CM-006 and CM-007, and the remaining cross-reference table keeps the two rows that resolve.
5. **Q3 — the CO-013 rewrite matches its scenario (OBSERVED).** The scenario requires dispatching with `--agent` omitted and states `general` is a built-in the contract forbids at the top level ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md:19]), with expected signals "exit 0, Read tool.call, no `--agent` flag" ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md:53]). The rewritten root summary says the same ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md:366]), and SKILL.md's `--agent` note states the contract ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:159]).
6. **Q4 — no edit beyond the ledger (OBSERVED).** Every diff hunk maps to an RR-2.01–RR-2.13 or SR-1–SR-6 row, plus the doc version bumps the delivery section declares: cli-cursor root shows RR-2.04 (two hook paths) + SR-3 (label line); cli-opencode shows RR-2.05's three fixes (CO-013, CO-033, CO-037); mcp-click-up's 38 `../feature-catalog/` rows equal the ledger's count exactly; SR-2's 14 files match; SR-3 is exactly three label lines (root plus the two hook scenarios); SR-6's `ls .skilled/commands/doctor/assets/doctor-update-*.yaml | wc -l` is six; SR-1's `codex/settings.json` occurrences are gone (four sites now name `.codex/config.toml`).
7. **Wrong-base resolution ruled out.** Each rewritten token resolves from the base its own tree implies (repo root, playbook root's `../`, or skill root) rather than by a coincidental match in another base.

## Traceability Checks

- **core `spec_code` — pass.** Goal criterion 1 and AC-001 observed in iteration 1 still hold, and the CO-013 root rewrite now equals its scenario contract (scenario :19/:53 vs root :366-372), which was one of the drift classes the phase set out to remove.
- **core `checklist_evidence` — partial.** RR-2.01–RR-2.13 and SR-1–SR-6 rows were independently re-executed where cheap: RR-2.07 row count (38), SR-2 file count (14), SR-3 line count (3), SR-6 `ls` count (6), SR-1 grep (0), plus existence/subject probes for every rewritten path. The remaining ledger rows' exact command transcripts were not re-run (their claims are consistent with the diffs).
- **overlay `playbook_capability` — partial.** All 13 root packages' rewritten references resolve on disk; the two removal rows and the one successor row were verified against git history rather than taken from the ledger.
- **overlay `agent_cross_runtime` — partial.** CO-013's alignment with the OpenCode `--agent` contract was checked against SKILL.md; no other cross-runtime contract changed this iteration.
- **overlay `feature_catalog_code` — partial.** The 37 mcp-click-up and 4 mcp-obsidian catalog targets exist; the cupt claim is about an external repository and is unverifiable offline (no finding).
- **overlay `skill_agent` — not exercised this iteration** (the sk-doc 2.3.9.0 release surfaces were not part of the four questions; deferred to a later dimension).

## Verdict

No P0 or P1 findings this iteration. One new P2 (R2-P2-001) joins the still-open R1-P2-001 from iteration 1; both are advisory. The four dispatch questions answer clean on observed evidence.

## Next Dimension

security (strategy NEXT FOCUS), then traceability, then maintainability.

Review verdict: PASS
