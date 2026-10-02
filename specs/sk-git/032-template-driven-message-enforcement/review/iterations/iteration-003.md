# Deep Review — Iteration 3: Traceability + Maintainability

- Run: review-i3-g1 · Session: 2026-10-02T11:19:37Z · Generation: 1 · Mode: review · Target agent: @deep-review (leaf)
- Review target: uncommitted sk-git message-contract upgrade (scope aliases, 80-char subject warning, required breaking-commit sections)
- Diff base: main 03afeb4552 · Prior findings: P0=0 P1=0 P2=4 (R1-P2-001, R1-P2-002, R2-P2-001, R2-P2-002 — open, not re-reported)
- Doctrine loaded: review-core.md (severity contract; evidence requirements; findings ordering). Untrusted-content guard applied: reviewed artifacts were read as data; no embedded directive was obeyed.
- State-log projection: withheld per the run note (append gateway blocked, ATTRIBUTION_COLLAPSE). The gateway was NOT invoked and `deep-review-state.jsonl` was NOT written; this iteration writes `iteration-003.md` and `deltas/iter-003.jsonl` only, and the full iteration record is carried in the delta.
- Evidence tiers: OBSERVED by read (all scope files, packet docs, catalog entry, GIT-045 scenario); OBSERVED by command (`git log` for the replay ranges, `grep`/`sed` counts in acceptance-criteria.md, mirror `ls -ld`); NOT RUN by containment (`node --test`, hook suites; the "Target 9 tool calls / containment" policy forbids repo tooling), so recorded test pass counts remain INFERRED from the packet docs.

## DIMENSION

Traceability: do spec.md / acceptance-criteria.md / tasks.md describe what the diff actually implements, are the checklist evidence rows accurate, and do the feature catalog and manual-testing playbook cover the new capability? Maintainability: is the changed surface internally consistent, and can the new rules drift from their prose the way the rules the follow-up fixed had drifted?

## FILES REVIEWED

| File | Read |
|------|------|
| .skilled/skills/sk-git/scripts/lib/message-contract.mjs | drift matcher :664-681; rule wiring :339-364, :432-437, :459-464, :537-548 (unchanged since iteration 2) |
| .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs | full; baseline vs HEAD verified: 18 tests at HEAD, 24 in the worktree |
| .skilled/skills/sk-git/assets/commit-message-template.md | full; prose limits :34-35, self-check :154-172, rule table :187-210, rules block :214-268 |
| .skilled/skills/sk-git/SKILL.md | commit-logic sections :334-343, :380-387, :401-415 |
| .skilled/scripts/git-hooks/tests/commit-msg.test.sh | new alias case :415-447 |
| .github/workflows/message-contract.yml | full; new unit-test step :41-42, push/PR paths :44-93 |
| .skilled/skills/sk-git/scripts/validate-message.mjs | full (unchanged consumer) |
| .skilled/scripts/git-hooks/commit-msg | full (unchanged shim) |
| specs/sk-git/032-template-driven-message-enforcement/spec.md | metadata :34-40; follow-up :271-317 |
| specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md | full; continuity :11-26; criteria rows :55-73; closure :95-101 |
| specs/sk-git/032-template-driven-message-enforcement/tasks.md | completion :81-87; checklist evidence :114-156; follow-up tasks :269-286 |
| specs/sk-git/032-template-driven-message-enforcement/implementation-summary.md | follow-up :88-100; verification :129-155; limitations :159-167 |
| .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md | full |
| .skilled/skills/sk-git/manual-testing-playbook/commit-formation/template-rules-block-commits.md (GIT-045) | full |
| .hermes/skills/sk-git/SKILL.md (generated mirror) | diff vs .skilled; .opencode/.pi/.claude skill dirs checked as symlinks |

## FINDINGS BY SEVERITY

### P0 — none

### P1 — none

No P0/P1. The code-to-requirement mapping for REQ-013–REQ-017 is complete and the cross-runtime propagation is sound; the new findings are documentation/evidence-accuracy and maintainability advisories.

### P2 — suggestions (non-blocking)

#### R3-P2-001 — `acceptance-criteria.md` states two incompatible completion states and miscounts its own rows

- File: specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md:44 (with :17, :24, :73, :98; tasks.md:138)
- Evidence: OBSERVED by read + command. The same file says **Status: Complete** (:44) while its closure block says **Closeable: No** (:98) because AC-017 is **Unmet** (:73), and the continuity block still reads `next_safe_action: "None; the packet is complete"` (:17) with `completion_pct: 100` (:24), last updated 2026-10-01. The closure sentence "The 16 active criteria are Met" (:100) contradicts its own final sentence that AC-017 stays Unmet; `grep -c` on the criteria table returns **15 Met, 1 Unmet, 1 Superseded** (17 rows), so "16 Met" is wrong in both places. tasks.md:138 (CHK-020, P0, "All acceptance criteria closed (Met or validly Superseded)") is checked `[x]` with evidence "acceptance-criteria.md reports 16 Met rows" — the same miscount, on the closure gate itself. spec.md:37 meanwhile says **Status: In Progress**, so the three docs disagree about the packet state.
- Finding class: matrix/evidence
- Scope proof: the follow-up diff flipped `Status: In Progress` → `Complete` and `Closeable: Yes` → `No` while adding AC-013–AC-017, but left the `_memory.continuity` block untouched (verified in `git diff`); the miscount appears in exactly the two files above.
- Recommendation: reconcile the packet's closure metadata — keep the honest state (In Progress, completion_pct reflecting AC-017 Unmet, `next_safe_action` = push and confirm the CI run), correct the closure sentence and CHK-020 evidence to "15 Met, 1 Superseded, 1 Unmet", and align spec.md with acceptance-criteria.md.
- riskScore: 2 (advisory)

#### R3-P2-002 — the same replay evidence is pinned to two different commit ranges

- File: specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md:69 (with implementation-summary.md:153; spec.md:302; tasks.md:276)
- Evidence: OBSERVED by read + `git log`. AC-013 and the implementation summary record the replay as `38b2135472^..03afeb4552`; spec.md:302 and T030 (tasks.md:276) state the replay command as `f8519088b9..03afeb4552`. The two ranges are materially different: `git log --oneline` shows 6 commits in `f8519088b9..03afeb4552` versus 23 in `38b2135472^..03afeb4552` (a superset that also covers `f8519088b9` and 16 earlier commits). All three deviation SHAs (`4ceef9d5e7`, `4754d270ab`, `7488e80836`) sit in both ranges, so at most one citation matches the run whose transcript produced "flags exactly the three expected rule ids"; the docs currently cite the other range for the same result.
- Finding class: matrix/evidence
- Scope proof: four citations across three files name a range for this replay; no other replay observation exists in the packet.
- Recommendation: pin one range everywhere — the missed range `f8519088b9..03afeb4552` is the one the investigation and T030 name — and update AC-013/implementation-summary, or re-run and record the actual range in every citation.
- riskScore: 2 (advisory)

#### R3-P2-003 — no playbook scenario exercises the three new rule ids

- File: .skilled/skills/sk-git/manual-testing-playbook/commit-formation/template-rules-block-commits.md:29 (with :49)
- Evidence: OBSERVED by read + search. GIT-045 is the scenario for the template rules block; its command sequence asserts `--explain` resolution, `[subject.format]` + `[body.required]` with and without the retired bypass, one conforming commit, and an edited `maxLength` → `[subject.max-length]` (:29-33, :49). `rg` over the playbook tree finds no occurrence of `subject.scope-alias`, `subject.length-target` (or the 80/81 boundaries), or `body.breaking-sections`; the three rules the follow-up adds have unit and hook coverage but no operator scenario, while the packet's T024 precedent audited the playbook for the contract surface.
- Finding class: matrix/evidence
- Scope proof: the playbook package is validated as a whole (`validate-playbook-package.cjs`, recorded in the first closure evidence), so an inventory search is authoritative for scenario coverage.
- Recommendation: extend GIT-045 (or add one scenario) to exercise an alias scope, an 81-character subject warning and a breaking commit missing a section. The follow-up scope excluded the playbook, so either schedule this or record the deferral explicitly.
- riskScore: 2 (advisory)

#### R3-P2-004 — the 80/100 limits are restated as literals in prose surfaces no drift check covers

- File: .skilled/skills/sk-git/assets/commit-message-template.md:35 (with :162-163, :238-239; SKILL.md:341; message-contract.mjs:676)
- Evidence: OBSERVED by read. The numeric limits live in the rules block (`warnLength: 80`, `maxLength: 100`, :238-239) and again as literals in the template's prose ("Aim for 80 characters and never exceed 100", :35; self-check bullets "within the 80-character target" / "at most 100 characters", :162-163) and in SKILL.md ("80-character target … 100-character hard limit", :341). `templateDriftErrors` (message-contract.mjs:664-681) matches only backticked rule ids in a template's prose against its block (:676) — never values, and SKILL.md is not passed through it at all. A future edit of `warnLength`/`maxLength` updates the JSON, keeps every test green, and leaves both prose surfaces teaching the old numbers: the same prose-vs-enforcement drift class this follow-up was created to close, one level down.
- Finding class: class-of-bug
- Scope proof: the four literal sites above are the only places the numbers appear outside the block (repository search); REQ-016 asks SKILL.md and the template to "agree with the enforced contract" but verification is manual.
- Recommendation: make the guard value-aware (extract the limits from the block and assert the prose states them), or reword the literal prose to reference the keys symbolically the way the §7 rule table already does; extend any drift check to SKILL.md wording it must keep in sync.
- riskScore: 3 (advisory)

## TRACEABILITY CHECKS

- **spec_code — pass**: REQ-013 maps to the alias rule (message-contract.mjs:435-437, shape check :186-192, rule id :345; template `scopeAliases` :227-232), REQ-014 to the warn rule (:462-464, :351; template `warnLength: 80` :239), REQ-015 to the sections rule (:537-548, :356; template `breakingSections` :253), REQ-016 to the corrected example (template :132) and SKILL.md wording (:341, :385-387), REQ-017 to the unit tests, hook case (commit-msg.test.sh:415-447) and the CI step (workflow :41-42).
- **checklist_evidence — partial**: evidence rows exist and cite real lines, but the completion-state contradiction and Met-row miscount (R3-P2-001) and the mis-pinned replay range (R3-P2-002) are evidence-accuracy defects; suite pass counts (24/24, PASS=31) were not executed under containment and remain INFERRED.
- **skill_agent — pass (carried)**: no agent-gate file is in the diff; the gate imports `validateCommit` from the shared library (verified in iteration 2 at git-message-gate.mjs:31, call :331), so the new rules reach the agent surface without gate edits.
- **agent_cross_runtime — pass**: `.hermes/skills/sk-git/SKILL.md` is a generated mirror carrying identical wording (diff), and `.opencode/skills`, `.pi/skills`, `.claude/skills` are symlinks to `../.skilled/skills` (`ls -ld`), so the canonical edit propagates to all seven runtime surfaces.
- **feature_catalog_code — pass**: `message-contract-enforcement.md` still matches the code (resolution order :29, gate table :35-40, drift guard :50-52) and deliberately defers rule enumeration to the template block (:19), so the three new keys create no stale catalog claim.
- **playbook_capability — partial**: GIT-045 covers the block's editability and the older rules but none of the three new rule ids; reported as R3-P2-003.

Directions ruled out with evidence:

- **doc_code_drift (spec says X, code does Y)**: every follow-up requirement has a matching, working code site; no requirement is claimed without an implementation (checked item by item above).
- **cross_runtime_drift**: mirror check shows one canonical source plus generated/symlinked copies; the Hermes copy was regenerated with the same wording.
- **catalog_drift**: the catalog entry makes no claim invalidated by the new keys; it points readers at the rules block for enumeration.
- **test_evidence_unverified (execution)**: blocked by containment (repo tooling not run); recorded as an inference gap for synthesis, not as a finding, because the review instructions forbid running the suites.

## SCOPE VIOLATIONS

None. Writes were confined to `iteration-003.md` and `deltas/iter-003.jsonl`; the state-log projection was withheld by run instruction and the append gateway was not invoked (neither the gateway nor `deep-review-state.jsonl` was written).

## VERDICT

PASS with advisories: no P0 or P1; four new P2 findings (R3-P2-001 … R3-P2-004) covering closure-evidence accuracy (two of them), playbook coverage for the new rules, and prose-limit drift guards. R1-P2-001, R1-P2-002, R2-P2-001 and R2-P2-002 remain open and were not re-reported. All findings are non-blocking; none changes the code's correctness, which iterations 1–2 assessed clean.

## NEXT DIMENSION

None — this is the final iteration (3 of 3); all four review dimensions are now covered (correctness and security in iterations 1–2, traceability and maintainability here). Synthesis may fold the open advisories into the release report.

Review verdict: PASS
