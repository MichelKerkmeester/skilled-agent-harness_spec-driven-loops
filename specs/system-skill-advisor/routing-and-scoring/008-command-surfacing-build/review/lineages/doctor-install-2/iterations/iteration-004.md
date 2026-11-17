# Review Iteration 4 — traceability and maintainability

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-2-1794570021136-noekp0`, generation 1, lineageMode new.
- Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/doctor-install-2`.
- Dimension: traceability and maintainability. Budget profile: verify.
- Operator review focus: pass two of the command-surfacing review. This iteration verified the setup, install and embedder fixes, read the shared install docs, and compared each changed sentence with the code that owns it. It addressed the docs-that-disagree-with-code part of the focus and the claude, codex, opencode, pi, devin and dsh install surfaces where those docs name runtimes. No holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/setup.md:70-82` (socket write, status mapping, hook-health repair)
- `.skilled/commands/doctor/assets/doctor-setup.yaml:23-64` (mutation invariant and legs)
- `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:55-65` (delivery repair row)
- `.skilled/commands/doctor/assets/doctor-install-presentation.txt:70-82` (runtime list and DSH decision)
- `.skilled/commands/doctor/assets/doctor-install.yaml:40-60` (runtime input)
- `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:85-130` (resolved URL, local-host refusal, start and pull)
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:451-464` (`persistAdvisorHookDiagnosticRecord`)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:242` (the only hook writer)
- `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:150` (health record contract)
- `.skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs`, `doctor-install-contract.test.cjs`, `skill-advisor-route-contract.test.cjs`
- `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:370-385`, `INSTALL-SKILLED.md:120-155`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:60-90`, `:139-154`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`setup.md` names `SKILL_ADVISOR_DEBUG` as the switch that turns hook-health records on, but the hook records every prompt by default** -- `.skilled/commands/doctor/setup.md:82` -- the new sentence says the absent-hook-health repair is to name `SKILL_ADVISOR_DEBUG`, "the setting that turns the records on". `persistAdvisorHookDiagnosticRecord` writes a prompt-free health record on every hook run and uses `SKILL_ADVISOR_DEBUG` only to add the skill label and error text (`metrics.ts:451-464`); `ARCHITECTURE.md:150` and `feature-catalog/hooks-and-plugin/claude-hook.md:42` say the same. The only source writer is the Claude hook (`hooks/claude/user-prompt-submit.ts:242`), which the Codex, Cursor and Devin adapters spawn. Setting the variable therefore cannot create a record where no hook runs, which is exactly the OpenCode and unapproved-Codex case the same sentence's sibling names.
   Case: a checkout whose Claude prompt hook has never run; `/doctor:setup` prints `hook health not recorded`; the operator follows `setup.md:82` and exports `SKILL_ADVISOR_DEBUG=1`; on OpenCode no record appears because no prompt hook writes one, and on Claude the next run writes the same health record it would have written without the variable, plus `skillLabel` and `errorDetails`.
   Finding class: documentation-drift
   Scope proof: `rg -n "SKILL_ADVISOR_DEBUG" .skilled/commands/doctor .skilled/skills/system-skill-advisor` shows the new sentence only in `setup.md`; `metrics.ts:460` selects the debug record shape, not whether a record is written, and `writeBoundedJsonl` is called with `requireDebug: false` at `:464`.
   Affected surface hints: ["doctor setup advisor leg", "hook health repair", "debug-variable privacy note"]
   Claim adjudication: `{"type":"traceability","claim":"setup.md's repair cannot turn hook health records on, because the record is written by default and the variable only adds two fields.","evidenceRefs":[".skilled/commands/doctor/setup.md:82",".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:460",".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:464",".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:242"],"counterevidenceSought":"read the writer, the status reader and ARCHITECTURE.md; none gates the write on SKILL_ADVISOR_DEBUG","alternativeExplanation":"the sentence may mean the debug record carries the fields needed to diagnose a missing hook, but it says the setting turns the records on","finalSeverity":"P2","confidence":0.95,"downgradeTrigger":"none; the code path is direct"}`

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | pass | The parent spec's scope and phase map place doctor routes and install reach in phases 013 to 015; the reviewed fixes stay inside that scope. The phase-007 open-evidence item is pass-one `iter3-P2-phase007-open-evidence` and is not re-reported. |
| checklist_evidence | core | notApplicable | The parent has no `acceptance-criteria.md`; the pass-one report records `AC_COVERAGE: exempt`. |
| skill_agent | overlay | notApplicable | No skill or agent definition in this area. |
| agent_cross_runtime | overlay | pass | The install presentation names claude, opencode, codex, cursor, devin and pi; DSH is explicitly not offered because `symlink-manifest.json` has no dsh row. `INSTALL-SKILLED.md:133` lists the same six for install. |
| feature_catalog_code | overlay | notApplicable | The advisor feature catalog does not describe the doctor routes. |
| playbook_capability | overlay | notApplicable | No playbook file in this area. |

## Integration Evidence

- `env -u AI_SESSION_CHILD node --test .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs .skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` passed 33 of 33.
- `symlink-manifest.json` was parsed directly: runtime keys are `claude, opencode, codex, cursor, devin, pi`, so the install presentation and `doctor-install.yaml` agree with the engine.
- `advisor_status --workspace-root "$PWD" --format json --warm-only` returned `hookHealth` with 30 invocations and `lastRecordAt`, proving the record path is live in this checkout.

## Edge Cases

- `INSTALL-SKILLED.md:57` says the checkout can be opened in seven runtimes, including DSH, while the install route offers six. The two statements are about different surfaces (opening the checkout versus linking a project), and `INSTALL-SKILLED.md:133` lists the same six for install. Recorded, not raised.
- The embedder refusal names "the install guide's start and pull commands", while the guide carries the cost table and the plan carries the commands. The route itself prints the commands, so the reference is not a broken instruction. Recorded as a wording debt, not a finding.
- `doctor-setup.yaml` says `SKILL_ADVISOR_DEBUG` is not named in the YAML at all; the wrong repair lives only in the markdown router, which is why the contract test passes green.

## Confirmed-Clean Surfaces

- DR2-P2-001 holds: the install presentation names the six runtime names plus "the ones already there" and records the DSH decision; `doctor-install-contract.test.cjs` pins both.
- DR2-P2-002 holds: the embedder refuses a non-loopback host before start or pull and binds `OLLAMA_HOST` from the resolved URL on both mutating steps; `skill-advisor-route-contract.test.cjs` pins the order and the binding.
- DR2-P2-003 holds: `doctor-setup.yaml:25-28` names `/tmp/system-skill-advisor` and `SPECKIT_IPC_SOCKET_DIR` as the one out-of-repository write, and `doctor-setup-contract.test.cjs` pins it.
- Q3 holds in the YAML: the absent `data.hookHealth` branch prints `hook health not recorded` with a reason and names the degraded rate and last record when present. The surviving defect is the markdown repair, not the YAML branch.
- The socket-directory warning is now in both `setup.md` and the workflow, so the mutation boundary and the prose agree.

## Ruled Out

- **The install route still says "the seven"** -- ruled out: the presentation names the six runtimes and the test rejects the count phrase (iteration 4, evidence: `doctor-install-presentation.txt:78`).
- **The embedder start and pull ignore the resolved host** -- ruled out: both steps bind `OLLAMA_HOST` and the refusal comes first (iteration 4, evidence: `doctor-skill-advisor-embedder.yaml:125-127`).
- **`setup.md` documents an out-of-repository write the workflow forbids** -- ruled out: the workflow invariant names the socket directory and the setup.md prose names the same directory (iteration 4, evidence: `doctor-setup.yaml:28`).
- **The setup leg omits the absent hook-health state** -- ruled out: the YAML prints the absent message; the wrong repair is the markdown sentence, reported above (iteration 4, evidence: `doctor-setup.yaml:61`).

## Next Focus

- Dimension: maintainability and cross-reference
- Focus area: the remaining unchanged doctor-install files (`_routes.yaml`, `agents-md.md`, `agents-md-manifest.json`, `doctor-runtime-mirrors.yaml`, `doctor-skill-advisor-presentation.txt`, `skill-advisor.md`, `create.sh`, `INSTALL-GUIDE.md`, `INSTALL-SKILLED.md`) plus a final consistency pass over all three findings
- Reason: every changed file has been read; the remaining scope is the unchanged files that describe or route the changed surfaces, and the three findings need a final evidence check before synthesis.
- Rotation status: final pass; all four dimensions have at least one iteration.
- Blocked/productive carry-forward: do not re-open the three findings unless a file read contradicts them.
- Required evidence: direct read of the route manifest and the two command docs, plus the final report registry counts.

Review verdict: PASS
