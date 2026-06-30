# Deep Review Iteration 003 - Correctness Playbook Pass

Session: `2026-05-07T17:08:57Z`
Generation: `1`
Lineage mode: `new`
Dimension: correctness
Focus: packets 093/094/095 playbooks, RCAF naturalization integrity, sk-code-review playbook execution
Verdict: **FAIL**

## Scope Reviewed

- `.opencode/specs/skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/`
- `.opencode/skills/sk-code-review/manual_testing_playbook/`
- `.opencode/skills/sk-git/manual_testing_playbook/`
- `.opencode/skills/cli-codex/manual_testing_playbook/`
- `.opencode/skills/sk-doc/assets/testing_playbook/`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skills/system-spec-kit/scripts/dist/`

`review_core.md` was loaded before final severity calls. Its P1 standard covers correctness bugs, spec mismatches, and must-fix gate issues; both new findings below meet that bar.

## Findings

### P1-017 [P1] Packet 095 reports impossible execution results and cites missing cross-runtime transcripts

- File: `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/implementation-summary.md:57`
- Evidence: The summary first says 15 of 18 scenarios executed with 3 skips at lines 3 and 51, but the aggregate table claims `PASS 18 / 18` and `SKIP 0 / 18` at lines 57-58. The per-scenario table then marks CR-016, CR-017, and CR-018 PASS at lines 81-83, while the decision table says CR-016/017/018 were marked SKIP at line 112 and verification says `15 PASS, 3 SKIP` at lines 123-126. The cited transcript pattern only covers `/tmp/095-CR-001.log` through `/tmp/095-CR-015.log` at line 90; spot-checking `/tmp` found CR-016 and CR-018 missing, with only CR-017 present among the cross-runtime set.
- Finding class: matrix/evidence
- Scope proof: `ls -l /tmp/095-CR-001.log /tmp/095-CR-002.log /tmp/095-CR-015.log /tmp/095-CR-016.log /tmp/095-CR-017.log /tmp/095-CR-018.log` showed CR-016 and CR-018 do not exist. Lines 57-58, 81-83, 112, and 123-126 contradict each other inside the same implementation summary.
- Affected surface hints: `["095 implementation-summary", "cross-CLI scenario evidence", "agent_cross_runtime traceability"]`
- Recommendation: Reconstruct the actual CR-016/017/018 execution state from durable logs. If scenarios were skipped, mark them SKIP consistently and remove PASS claims; if executed, add durable transcript paths and update the Files Changed and verification tables.
- Claim: Packet 095 cannot currently support its claimed 18/18 PASS verdict.
- EvidenceRefs: `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/implementation-summary.md:3`, `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/implementation-summary.md:57`, `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/implementation-summary.md:81`, `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/implementation-summary.md:90`, `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/implementation-summary.md:112`, `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/implementation-summary.md:123`
- Counterevidence sought: durable CR-016 and CR-018 logs, a corrected table proving 15 PASS/3 SKIP was the intended final state, or a non-`/tmp` evidence ledger that maps CR-016/017/018 to real transcripts.
- Alternative explanation: The table may have been partially updated after CR-017 was later executed, leaving stale 15/3 prose behind. That still leaves CR-016 and CR-018 unsupported.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Make the aggregate, per-scenario, decisions, verification, and evidence-path claims internally consistent, then prove every PASS has a durable transcript or mark unsupported scenarios SKIP.

### P1-018 [P1] The new 093 playbooks are not reachable from their owning skill files

- File: `.opencode/skills/sk-code-review/SKILL.md:66`
- Evidence: The sk-code-review router says it discovers resources under `references/` and `assets/` at lines 66-82, and the explicit reference list at lines 361-402 names only review references/checklists plus related skills. It never links or routes to `.opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md`, even though packet 093 created that package and the root playbook says it is the operator directory. sk-git has the same defect: resource loading is limited to references/assets at `.opencode/skills/sk-git/SKILL.md:78-88`, and the related-resources section at lines 436-440 omits `.opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md`.
- Finding class: cross-consumer
- Scope proof: `rg -n "manual_testing_playbook|Manual Testing|testing playbook|playbook" .opencode/skills/sk-code-review/SKILL.md .opencode/skills/sk-git/SKILL.md` returned no matches for either owning skill, while `find` confirms both packages exist: sk-code-review has root + 18 scenario files; sk-git has root + 22 scenario files.
- Affected surface hints: `["sk-code-review skill routing", "sk-git skill routing", "manual_testing_playbook discovery"]`
- Recommendation: Add explicit manual testing playbook links to both SKILL files, preferably in the resource/related-resources sections and routing notes, so operators and skill-routing readers can discover the scenario packages from the skill entrypoint.
- Claim: Packet 093 produced the playbook packages, but the owning skill entrypoints do not expose them.
- EvidenceRefs: `.opencode/skills/sk-code-review/SKILL.md:66`, `.opencode/skills/sk-code-review/SKILL.md:361`, `.opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md:48`, `.opencode/skills/sk-git/SKILL.md:78`, `.opencode/skills/sk-git/SKILL.md:436`, `.opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md:44`
- Counterevidence sought: any SKILL.md link to the playbook package, any router path that includes `manual_testing_playbook/`, or another canonical entrypoint referenced from the owning skill.
- Alternative explanation: The playbooks may be intended for direct filesystem discovery only. That contradicts the focus requirement that scenarios be reachable from SKILL.md and leaves the packages hidden from normal skill readers.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Link both playbook roots from their owning SKILL.md files and, if desired, add routing text that names manual-testing use cases as an on-demand resource.

### P1-007 [P1] Checklist evidence remains active

- File: `.opencode/specs/skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/checklist.md:58`
- Evidence: The 093 child checklists still show unchecked P0/P1 verification items at lines 58-73 and 96-108 for sk-code-review, and lines 58-74 and 98-110 for sk-git. This pass also found a concrete sync mismatch: sk-code-review checklist line 59 still says "All 17 per-feature files", while the package contains 18 per-feature scenario files plus the root playbook.
- Status: Still active.

### P1-015 [P1] `skill_graph_scan` source default still points at the deleted singular skills root

- File: `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:40`
- Evidence: Source still defaults `args.skillsRoot` to `.opencode/skill` at line 40, while checked-in dist defaults to `.opencode/skills` at `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/skill-graph/scan.js:22`. Tool schema text still advertises the singular default at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:700`.
- Status: Still active; prior line evidence stands.

### P1-016 [P1] `scripts/dist` still contains stale singular `.opencode/skill` references

- File: `.opencode/skills/system-spec-kit/scripts/dist/observability/smart-router-measurement.js:14`
- Evidence: A targeted `scripts/dist` grep found 12 singular references, including smart-router measurement defaults at lines 14-17, live wrapper commentary at `live-session-wrapper.js:6`, graph backfill command examples at `backfill-graph-metadata.js:4-5`, smart-router analyze defaults at `smart-router-analyze.js:9-10`, and redaction calibration inputs at `collect-redaction-calibration-inputs.js:42-43`.
- Status: Still active; count remains 12.

## Prompt-Equality and RCAF Spot Checks

- sk-code-review CR-001 passes the natural prompt contract. The real request at `.opencode/skills/sk-code-review/manual_testing_playbook/01--baseline-review-flow/001-small-pr-single-file.md:27` asks for a staged one-file review, and the prompt at line 28 preserves that exact scope with findings-first/file-line requirements.
- sk-git GIT-008 correctly retains RCAF. ADR-001 explicitly allows safety-refusal RCAF when role context changes expected behavior at `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/decision-record.md:53-56`, and the retained prompt at `.opencode/skills/sk-git/manual_testing_playbook/03--safety-refusals/001-no-verify-bypass-refused.md:28` matches the dangerous precondition at line 27.
- cli-codex CX-012 correctly retains RCAF because the actor is a cross-AI orchestrator delegating `codex exec -p review`; the prompt and exact command stay aligned at `.opencode/skills/cli-codex/manual_testing_playbook/04--agent-routing/001-review-profile.md:28` and line 48.
- sk-doc templates were updated to natural-human defaults with RCAF as an exception at `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:313` and `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md:67`.

No sed-collateral was found in the sampled prompts. The integrity problem this pass found is not prompt wording; it is reachability and execution-evidence correctness.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| spec_code | fail | P1-015 and P1-016 still show source/dist and dist-staleness drift. |
| checklist_evidence | fail | P1-007 remains active; 095 plan/tasks verification boxes are also unchecked at `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/plan.md:94-102` and `tasks.md:69-72`. |
| skill_agent | pass | Review doctrine loaded; sampled playbooks cite the expected skill/reference anchors. |
| agent_cross_runtime | fail | P1-017 invalidates CR-016/018 PASS claims and leaves cross-runtime evidence incomplete. |
| feature_catalog_code | fail | Prior singular-root code/schema drift remains active. |
| playbook_capability | fail | P1-018: playbooks exist but are not reachable from owning SKILL.md entrypoints. |

## Coverage and Ratio

- Prior findings: P0=0, P1=3, P2=4.
- Current active/carry-forward findings after this pass: P0=0, P1=5, P2=4.
- New findings this iteration: P1-017, P1-018.
- New findings ratio: 2 / 9 = 0.2222.
- Coverage age: 0.

## Provisional Verdict

**FAIL**. Packet 094's prompt naturalization spot-checks look sound, but packet 095's execution evidence is internally contradictory and packet 093's playbook packages are not exposed from the owning skill entrypoints. The review cannot move toward PASS until those correctness failures and the existing source/dist drift are resolved.
