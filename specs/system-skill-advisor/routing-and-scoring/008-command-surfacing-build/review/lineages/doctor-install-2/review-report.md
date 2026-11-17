# Review Report: Doctor Install Pass Two (doctor-install lineage)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Run: detached fan-out lineage `doctor-install-2`, session `fanout-doctor-install-2-1794570021136-noekp0`, six iterations, executor `cli-opencode` `opencode-go/deepseek-v4.1-flash`
- Reviewed range: `320e7b64d4..HEAD` (`087888ec4a`), 21 changed doctor-install files plus the 30-file area scope
- Inputs: `review/review-report-pass-1.md` (43 merged findings, 17 in this area), the current working tree, and six iteration files in this lineage
- State: `deep-review-findings-registry.json` reports 5 open P2, 0 P0, 0 P1, 0 resolved; `review/resource-map.md` is emitted beside this report

---

## 1. Executive Summary

- **Verdict: PASS**, with five advisory P2 findings. No P0 or P1 remains.
- **hasAdvisories: true**
- **Active counts:** P0 0, P1 0, P2 5.
- **Pass-one verification:** all 17 doctor-install fixes hold for the case their pass-one finding named. Two carry a related new defect: the A10 count still includes report-only entries (DR2-P2-007), and the Q3 markdown repair names the wrong switch (DR2-P2-006).
- **New findings:** five P2 items, four in the changed surfaces and one in the unchanged route manifest that describes the changed engine.
- **Operator review focus:** code review of command surfacing, PASS TWO; verify each pass-one fix in the doctor-install area, review every file changed since pass one, then look for new defects, with concrete inputs and no holdout text. The focus is recorded verbatim in `deep-review-config.json` `reviewFocus`.
- **Convergence:** six iterations; ratios 1.00, 0.00, 0.50, 0.33, 0.40, 0.00; the last two average 0.20, the MAD signal passes at 0.37, dimension coverage is 1.00, and the composite vote is 0.70. All four dimensions are covered and the coverage age is 1.
- **Release readiness:** `converged`.

---

## 2. Pass-One Fix Verification

Every doctor-install finding from `review/review-report-pass-1.md` section 3.1 was re-read against the remediation diff and its owning test file. The verdicts below use the pass-one ids.

| Pass-one id | Fix that was verified | Verdict |
|---|---|---|
| DR1-P1-001 (now P2) | The apply write loop catches a throw, restores from the backup, prints backup and undo, and returns exit 3 (`agents-md-embed.cjs:1413-1440`). | Holds. The new tree-digest test proves the tree returns to its pre-run state. The route text for a second restore fault is the new DR2-P2-004. |
| DR4-P1-001 (now P2) | `compose` refuses a symlinked router or Cursor mirror when the action would create, replace or remove (`agents-md-embed.cjs:819-829`). | Holds. Both new symlink tests pass and the link target stays unchanged. |
| DR4-P2-001 | `restoreFromBackup` proves every recorded copy against its hash before the first path moves (`agents-md-embed.cjs:1313-1321`). | Holds. The damaged-backup test keeps the tree as the write left it. |
| DR1-P2-003 | Plan and apply fail on `foreign` as well as `dropped` (`agents-md-embed.cjs:1281`, `:1377`, `:1461`). | Holds. The planted-foreign test restores and exits 1. |
| DR1-P2-001 | `copyVerdict` reads `expectsAbsent` before the symlink pass (`agents-md-check.cjs:713-719`). | Holds. A linked `.codex/AGENTS.md` now reads FINDING. |
| DR1-P2-002 | The pointer detail says the file names the root and carries no shipped line (`agents-md-check.cjs:740-742`). | Holds. The wording matches `namesRoot`'s `.some` test. |
| DR3-P2-001 | The pointer-missing entry is subtracted from the expected count and named separately (`agents-md-check.cjs:649-653`). | Holds for the pointer entry. Two report-only entries remain in the numerator; that is the new DR2-P2-007. |
| DR5-P2-003 | `parseTableRows` keeps a width-mismatched row and A11 prints its line and width (`agents-md-check.cjs:803-826`). | Holds. The malformed-row test names the line and the rule is not reported missing. |
| DR3-P2-004 | The README and module header say four children and name the A12 manifest generator. | Holds. `rowTemplatePurity` spawns the generator at `agents-md-check.cjs:875-884`. |
| DR5-P2-001 | The Codex check refuses a flag value that starts with `-` (`codex-hook-approval-check.cjs:58-62`). | Holds. `--root --json` exits 2. |
| DR5-P2-002 | `collectCommands` reads `type: command` entries and `runsMarker` confirms node starts the marker (`hook-wiring-check.cjs:114-148`). | Holds for the shipped `bash -c` shape. A wrapper false negative is the new DR2-P2-005. |
| DR3-P2-002 | The absent Codex entry prints the copy-and-approve repair (`codex-hook-approval-check.cjs:171-183`), and the setup and runtime-mirrors text route to that line. | Holds. |
| DR3-P2-003 | The symlink-check output block maps hook-wiring exit 1 to WARN, exit 2 to FAIL and states the worse-status rule (`doctor-symlink-check.yaml:69-72`). | Holds. |
| DR2-P2-001 | The install presentation names the six runtimes plus the ones already there and records the DSH decision (`doctor-install-presentation.txt:78`). | Holds. The test rejects the old count phrase. |
| DR2-P2-002 | The embedder refuses a non-loopback host and binds `OLLAMA_HOST` from the resolved URL on start and pull (`doctor-skill-advisor-embedder.yaml:125-127`). | Holds. The contract test pins the order and the binding. |
| DR2-P2-003 | The setup mutation invariant names `/tmp/system-skill-advisor` and `SPECKIT_IPC_SOCKET_DIR` (`doctor-setup.yaml:25-28`). | Holds. The contract test pins it. |
| Q3 (queued item iii) | The setup YAML prints `hook health not recorded` when `data.hookHealth` is absent (`doctor-setup.yaml:61`). | The YAML holds. The markdown repair names `SKILL_ADVISOR_DEBUG`, which is the new DR2-P2-006. |

No deferred item from report section 8, no R4-P2-003 and no refuted finding is re-reported.

---

## 3. Planning Trigger

`/speckit:plan` is not required for the verdict. The five findings are P2 advisories; the PASS path routes to a changelog. The Planning Packet below groups them for a follow-on remediation pass if the coordinator wants the debt closed before the next release.

```json Planning Packet
{
  "triggered": false,
  "triggerReason": "No P0 or P1 remains; five P2 advisories are recorded and the next release can ship with them tracked.",
  "verdict": "PASS",
  "hasAdvisories": true,
  "counts": { "p0": 0, "p1": 0, "p2": 5, "resolved": 0 },
  "activeFindings": [
    { "id": "DR2-P2-004", "severity": "P2", "location": ".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:104", "title": "Exit-3 contract has no branch for a restore that throws", "findingClass": "latent-doc-code-drift", "workGroup": "WG1" },
    { "id": "DR2-P2-005", "severity": "P2", "location": ".skilled/commands/doctor/scripts/hook-wiring-check.cjs:133", "title": "Hook matcher reports env node and bash -lc wrappers as missing", "findingClass": "false-clean-diagnostic", "workGroup": "WG2" },
    { "id": "DR2-P2-006", "severity": "P2", "location": ".skilled/commands/doctor/setup.md:82", "title": "Hook-health repair names SKILL_ADVISOR_DEBUG as the switch", "findingClass": "documentation-drift", "workGroup": "WG3" },
    { "id": "DR2-P2-007", "severity": "P2", "location": ".skilled/commands/doctor/scripts/agents-md-check.cjs:651", "title": "A10 counts report-only entries as copies as expected", "findingClass": "misleading-evidence", "workGroup": "WG4" },
    { "id": "DR2-P2-008", "severity": "P2", "location": ".skilled/commands/doctor/_routes.yaml:536", "title": "Embed route names the backup folder timestamp while the engine uses the plan digest", "findingClass": "documentation-drift", "workGroup": "WG5" }
  ],
  "remediationWorkstreams": [
    { "id": "WG1", "order": 1, "lane": "advisory", "title": "Exit-3 restore-failure branch", "files": [".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml", ".skilled/commands/doctor/assets/doctor-agents-md-presentation.txt"], "findings": ["DR2-P2-004"] },
    { "id": "WG2", "order": 2, "lane": "advisory", "title": "Hook matcher wrappers", "files": [".skilled/commands/doctor/scripts/hook-wiring-check.cjs", ".skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs"], "findings": ["DR2-P2-005"] },
    { "id": "WG3", "order": 3, "lane": "advisory", "title": "Hook-health repair text", "files": [".skilled/commands/doctor/setup.md"], "findings": ["DR2-P2-006"] },
    { "id": "WG4", "order": 4, "lane": "advisory", "title": "A10 expected count", "files": [".skilled/commands/doctor/scripts/agents-md-check.cjs", ".skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs"], "findings": ["DR2-P2-007"] },
    { "id": "WG5", "order": 5, "lane": "advisory", "title": "Embed backup path contract", "files": [".skilled/commands/doctor/_routes.yaml"], "findings": ["DR2-P2-008"] }
  ],
  "specSeed": [
    "An embed apply that cannot restore names the failed restore and says whether the tree was partly restored, never claims it was as the plan found it",
    "The hook-wiring check accepts any command that starts node on the marker path, including env and login-shell wrappers",
    "The setup hook-health repair names what actually creates a record, not a debug flag that only adds fields",
    "A10 counts only copies it checked, and names report-only and pointer-missing entries separately",
    "The embed route names the backup folder by the plan digest and records the temp fallback"
  ],
  "planSeed": [
    "WG1 and WG2 first: they change operator-facing failure and diagnostic text on mutating or safety-adjacent paths",
    "WG3 to WG5 next: one-line documentation and count repairs with their owning contract tests",
    "Rerun the five owning test files and the doctor contract tests; no new P0/P1 is expected"
  ],
  "findingClasses": ["latent-doc-code-drift", "false-clean-diagnostic", "documentation-drift", "misleading-evidence"],
  "affectedSurfacesSeed": [
    "agents-md embed exit 3 and the failure summary",
    "hook-wiring check and the setup delivery leg",
    "setup advisor hook-health repair",
    "agents-md check A10 expected count",
    "agents-md embed route manifest and backup path"
  ],
  "fixCompletenessRequired": true
}
```

---

## 4. Active Finding Registry

| Id | Sev | Dimension | Location | Disposition |
|---|---|---|---|---|
| DR2-P2-004 | P2 | correctness | `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:104` | active |
| DR2-P2-005 | P2 | correctness | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:133` | active |
| DR2-P2-006 | P2 | traceability | `.skilled/commands/doctor/setup.md:82` | active |
| DR2-P2-007 | P2 | traceability | `.skilled/commands/doctor/scripts/agents-md-check.cjs:651` | active |
| DR2-P2-008 | P2 | traceability | `.skilled/commands/doctor/_routes.yaml:536` | active |

### DR2-P2-004 -- Exit-3 contract has no branch for a restore that throws

- Evidence: `agents-md-embed.cjs:1425-1439` prints `restored:`, `nothing was restored`, or `ERROR: the restore failed` for the three outcomes; `doctor-agents-md-embed.yaml:104` describes only the first two.
- Impact: a second fault in the undo leaves the operator reply without a tree-state sentence; the engine's own test `agents-md-embed.test.cjs:744` produces the third output.
- Fix: add the `the restore failed` branch to the YAML and the presentation's failure summary; say the tree may be partly restored and name the undo.
- Case: second write throws and the write hook damages `manifest.json`; the engine exits 3 with `ERROR: the restore failed`.
- Finding class: latent-doc-code-drift. Scope proof: the three engine outcomes are in one catch block; the route has two branches.
- Affected surfaces: apply exit 3, failure summary, operator undo path.

### DR2-P2-005 -- Hook matcher reports env node and bash -lc wrappers as missing

- Evidence: `hook-wiring-check.cjs:133-148` recognises `node` only at index 0 or after `&&`, `||`, `;`, `|`, `bash -c`/`sh -c`, and requires the next token to be the marker.
- Impact: a valid wrapper is reported `hook-missing`, so `/doctor:setup` says DEGRADED for a hook the runtime runs.
- Fix: accept `env`, a flag between node and the script, and `bash -lc`/`sh -lc`; add one test per wrapper.
- Case: `.claude/settings.json` with `env node .claude/hooks/claude/user-prompt-submit.js` or `bash -lc "node .claude/hooks/claude/user-prompt-submit.js"` prints `hook-missing claude` and exits 1.
- Finding class: false-clean-diagnostic. Scope proof: temporary fixtures reproduce both lines; the owning tests cover only direct node forms.
- Affected surfaces: hook-wiring matcher, setup delivery leg, symlink check.

### DR2-P2-006 -- Hook-health repair names SKILL_ADVISOR_DEBUG as the switch

- Evidence: `metrics.ts:451-464` writes a prompt-free record on every hook run with `requireDebug: false`; `SKILL_ADVISOR_DEBUG` only adds `skillLabel` and `errorDetails`. `ARCHITECTURE.md:150` says the same. `setup.md:82` says the variable turns the records on.
- Impact: an operator on OpenCode or an unapproved Codex hook sets a flag that cannot create a record; a Claude operator only exposes two prompt-derived fields.
- Fix: say the record is written by the Claude adapter on every prompt and that the absence means no hook run reached this checkout; name the hook-wiring repair, not the debug flag.
- Case: a checkout with no Claude prompt-hook run; `/doctor:setup` prints `hook health not recorded`; exporting `SKILL_ADVISOR_DEBUG=1` changes nothing on OpenCode and only adds fields on Claude.
- Finding class: documentation-drift. Scope proof: the writer and the status reader were read; no branch gates the write on the variable.
- Affected surfaces: setup advisor leg, hook-health repair, debug-variable privacy note.

### DR2-P2-007 -- A10 counts report-only entries as copies as expected

- Evidence: `agents-md-check.cjs:651` subtracts failed, unmeasured and pointer-missing entries only; `agents-md-manifest.json:758` and `:777` mark two entries `report_only: true`, which `copyVerdict` returns as INFO.
- Impact: this checkout prints `5/6 copies as expected, 1 pointer missing` while only three entries are PASS; two report-only paths were never read.
- Fix: subtract `state === INFO && kind !== 'pointer missing'` and name the count separately, or count only PASS entries.
- Case: `agents-md-check.cjs --root .` prints `5/6 copies as expected` with `.cursorrules` and `~/.claude/CLAUDE.md` both INFO reported only.
- Finding class: misleading-evidence. Scope proof: the row loop prints only FINDING, UNKNOWN and pointer missing; the two report-only entries are invisible except in the count.
- Affected surfaces: A10 runtime copies, report-only manifest entries.

### DR2-P2-008 -- Embed route names the backup folder timestamp while the engine uses the plan digest

- Evidence: `agents-md-embed.cjs:954-956` names the folder from the first 16 characters of the plan digest; `:967-983` falls back to `os.tmpdir()/doctor-agents-md` when git does not ignore `.skilled/output`. `_routes.yaml:536` says `.skilled/output/doctor-agents-md/<timestamp>/`.
- Impact: the route's gate-3 location is wrong in both name and location; the plan's own `backup:` line is the only correct source.
- Fix: say `<plan-digest-prefix>` and name the temp fallback, or point at the plan's `backup:` line only.
- Case: a fixture with no ignore rule prints `backup: /var/folders/.../doctor-agents-md/<16-hex>`; the route text says a timestamped folder under `.skilled/output`.
- Finding class: documentation-drift. Scope proof: `backupDirectoryOf` and `backupBase` are the only producers; the route is the only `<timestamp>` statement.
- Affected surfaces: agents-md embed route, gate-3 location, backup and undo lines.

---

## 5. Remediation Workstreams

The five P2 items are independent and file-disjoint. The safety-adjacent pair goes first because it changes operator-facing failure and diagnostic text.

1. **WG1 -- Exit-3 restore-failure branch.** `doctor-agents-md-embed.yaml` and `doctor-agents-md-presentation.txt`. Add the third branch and one assertion.
2. **WG2 -- Hook matcher wrappers.** `hook-wiring-check.cjs` and its test. Accept `env`, a flag between node and the script, and `bash -lc`/`sh -lc`; add one test per wrapper.
3. **WG3 -- Hook-health repair text.** `setup.md`. Replace the debug-switch sentence with the writer and the wiring repair.
4. **WG4 -- A10 expected count.** `agents-md-check.cjs` and its test. Subtract report-only INFO entries and name them.
5. **WG5 -- Embed backup path contract.** `_routes.yaml`. Name the digest prefix and the temp fallback, or defer to the plan's `backup:` line.

---

## 6. Spec Seed

- An embed apply that cannot restore names the failed restore and says whether the tree was partly restored; it never claims the tree is as the plan found it.
- The hook-wiring check accepts any command that starts node on the marker path, including `env` and login-shell wrappers.
- The setup hook-health repair names the writer that creates a record and the hook-wiring repair, not a debug flag that only adds fields.
- A10 counts only copies it checked and names report-only and pointer-missing entries separately.
- The embed route names the backup folder by the plan digest and records the temp fallback.

---

## 7. Plan Seed

1. Dispatch WG1 and WG2 first; both change operator-facing text on mutating or safety-adjacent paths.
2. Dispatch WG3 to WG5 next; each is a one-line documentation or count repair with an owning contract test.
3. Rerun `agents-md-embed.test.cjs`, `agents-md-check.test.cjs`, `hook-wiring-check.test.cjs`, the three contract tests and `doctor-setup-contract.test.cjs`.
4. No new P0/P1 is expected; the pass-two lineage has none.

---

## 8. Traceability Status

### Core protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | The parent spec's scope and phase map place doctor routes and install reach in phases 013 to 015; every reviewed fix stays inside that boundary. The phase-007 open item is pass-one `iter3-P2-phase007-open-evidence` and is not re-reported. |
| `checklist_evidence` | notApplicable | The parent has no `acceptance-criteria.md`; the phase children own theirs. |
| `AC_COVERAGE` | exempt | The parent has no acceptance-criteria file; the pass-one report records the same exemption. |

### Overlay protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | notApplicable | No skill or agent definition in this area. |
| `agent_cross_runtime` | pass | The install route names the six `symlink-manifest.json` runtimes (claude, opencode, codex, cursor, devin, pi); DSH is explicitly not offered. `hook-wiring-check` reports claude, codex, cursor and devin wired in this checkout; opencode, pi and dsh have no advisor hook entry. |
| `feature_catalog_code` | notApplicable | The advisor feature catalog does not describe the doctor routes. |
| `playbook_capability` | notApplicable | No playbook file in this area. |

Resource Map Coverage Gate: skipped. `resource-map.md` does not exist in the spec folder, so `resource_map_present` is false; this lineage emitted its own `resource-map.md` from the deltas.

---

## 9. Deferred Items

- **Pass-one deferred DR1-P1-001 reach on sandboxed runtimes.** If a default install has a sandbox that denies an allowlisted write, the mid-apply fault becomes reachable on a default path. Not verified here; the write path now restores and exits 3.
- **Pass-one deferred `run` commands that write.** `/doctor:deep-loop` and `/doctor:speckit` remain `run` with add-only writes; the decision belongs in a decision record, not this review.
- **Pass-one deferred dsh install path.** `/doctor:install` still cannot link dsh because `symlink-manifest.json` has no dsh row; the install presentation now records the decision explicitly.
- **`parseTableRows` header assumption.** The first row after the table heading is treated as the column header; every shipped router has a header, so no input in reach fails.
- **Cursor native delivery.** The repository benchmark reports say `beforeSubmitPrompt` is registered but native firing is unconfirmed; `hook-wiring-check` reports wiring, not native delivery.
- **Embedder guide command reference.** The non-local refusal names "the install guide's start and pull commands"; the guide carries the cost table and the route prints the commands. A wording debt, not a finding.
- **Plan-side foreign branch.** `commandPlan`'s `foreign` branch is unreachable from a composed document because the composition is built only from shipped bodies plus the block; the live guard is the apply-time check. Recorded so the dead branch is not mistaken for proof.

---

## 10. Dimension Expansion Map

- All four dimensions were covered: correctness (iterations 1 to 6), security (3 and 6), traceability (1, 2, 4, 5, 6) and maintainability (4, 5, 6).
- No divergence pivot started, completed or failed; no audited override, no saturated direction and no remaining frontier.
- Selected directions: the embed write path, the AGENTS.md check truth, the hook checks and workflow contracts, the setup and install docs, and the unchanged route manifest.
- This map records breadth only and changes no verdict.

---

## 11. Search Ledger

| Iteration | Bug classes | Disposition |
|---|---|---|
| 1 | partial_write, restore_failure_contract, proof_contract, symlink_write_target | 1 finding (restore_failure_contract); 3 ruled out |
| 2 | false_clean_diagnostic, misleading_evidence, pointer_count, malformed_router_row, readme_child_count | 5 ruled out |
| 3 | mention_as_wiring, wrapper_false_negative, absent_repair_routing, symlink_exit_mapping, flag_value_swallow | 1 finding (wrapper_false_negative); 4 ruled out |
| 4 | runtime_list_count, embedder_host_binding, socket_mutation_boundary, hook_health_message, hook_health_repair | 1 finding (hook_health_repair); 4 ruled out |
| 5 | report_only_count, backup_path_contract, route_runtime_list, command_summary_subset, shared_spec_create | 2 findings; 3 ruled out |
| 6 | pass_one_fix_replay, state_integrity, convergence_vote, holdout_hygiene | 4 ruled out |

`searchDebt`: none. `candidateCoverage`: covered 28 bug classes across the lineage, ruled out 23, deferred 0, blocked 0. `graphCoverageMode`: `graphless_fallback`; every iteration used direct reads and exact searches. `hasSearchDebt: false`. The graph convergence script was not run because its writes land outside this lineage; the inline composite vote is the stop authority.

---

## 12. Audit Appendix

### Convergence

| Iteration | Focus | Ratio | P0/P1/P2 | Status |
|---|---|---|---|---|
| 1 | correctness | 1.00 | 0/0/1 | complete |
| 2 | correctness and traceability | 0.00 | 0/0/0 | complete |
| 3 | correctness and security | 0.50 | 0/0/1 | complete |
| 4 | traceability and maintainability | 0.33 | 0/0/1 | complete |
| 5 | maintainability and traceability | 0.40 | 0/0/2 | complete |
| 6 | final consistency pass | 0.00 | 0/0/0 | complete |

Rolling average of the last two ratios: 0.20 (floor 0.08, not met). MAD noise floor: 0.37; latest 0.00, met. Dimension coverage: 1.00, met. Composite vote: 0.70 (threshold 0.60). All nine legal-stop gates pass: no P0/P1, all dimensions covered at age 1, evidence is direct, claim adjudication is vacuous, and the security-sensitive replay rows (write restore, symlink refusal, embedder host binding) all pass with test evidence.

### Probes and tests run

- `env -u AI_SESSION_CHILD node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` -- 43/43.
- `env -u AI_SESSION_CHILD node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` -- 44/44.
- `env -u AI_SESSION_CHILD node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs .skilled/commands/doctor/scripts/tests/codex-hook-approval-check.test.cjs` -- 13/13.
- `env -u AI_SESSION_CHILD node --test .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs .skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` -- 33/33.
- `hook-wiring-check.cjs --root .` -- `ok claude`, `ok codex`, `ok cursor`, `ok devin`, exit 0.
- `codex-hook-approval-check.cjs --root .` -- `WARN codex-hooks-unapproved`, exit 1; the checked-in state, not a defect.
- `agents-md-check.cjs --root .` -- `STATUS=OK rows=12 findings=0 unknown=0`.
- Temporary `.claude/settings.json` fixtures for `env node` and `bash -lc` wrappers; both printed `hook-missing` and were removed.
- `advisor_status --workspace-root "$PWD" --format json --warm-only` -- `hookHealth` present with 30 invocations and `lastRecordAt`.

### Ruled-out claims

- A marker mentioned in a description is not a wired hook; only `type: command` entries are read.
- A malformed router row is not reported as missing; it is kept and named with its line and width.
- A missing pointer is not counted as an expected copy; it is named separately. Two report-only entries still are, which is DR2-P2-007.
- The install route does not say "the seven"; it names the six manifest runtimes and the DSH decision.
- The embedder start and pull do not ignore the resolved host; both bind `OLLAMA_HOST` and refuse a non-loopback URL first.
- `setup.md` does not document an out-of-repository write the workflow forbids; both name the socket directory.
- The setup leg does not omit the absent hook-health state; the YAML prints it. The markdown repair is the defect.
- No pass-one fix regressed; each was re-read and its owning test file passed.

### Holdout handling

The doctor-install area opens no holdout file. No prompt text, row, or count from `command-prompts.jsonl` or `holdout-prompts.jsonl` was read or printed. The accuracy-runner lineage owns that surface.

---

End of lineage report. The cross-lineage merge owns the final release verdict; this report is the doctor-install contribution.
