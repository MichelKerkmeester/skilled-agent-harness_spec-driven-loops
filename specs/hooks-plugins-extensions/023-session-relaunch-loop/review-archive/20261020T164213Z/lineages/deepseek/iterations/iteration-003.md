# Iteration 3: Traceability — parent closure, phase evidence, and the archived review reports

## Focus

- Dimension: traceability
- Scope: the parent phase count and handoff table, phase 007 acceptance evidence against the committed run 10 artifacts, phase 006 review-report dependencies, and the `/speckit:handoff` exit-code contract.
- Review target: `specs/hooks/023-session-relaunch-loop`

## Files Reviewed

- `specs/hooks/023-session-relaunch-loop/spec.md:39,51,62-67,79-86,104-122`
- `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/acceptance-criteria.md:59-61`
- `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/implementation-summary.md:67-73`
- `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/` (directory listing)
- `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/spec.md:40,43`
- `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/acceptance-criteria.md:65-66`
- `specs/hooks/023-session-relaunch-loop/review-archive/20261019T144809Z/review-report.md:1-15`
- `.skilled/commands/speckit/handoff.md:31-35,103-107`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:399-415`
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/README.md:35-50`
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/source.md:15-25`
- `.gitignore:263-264`

## Findings

### P0 Findings

None.

### P1 Findings

1. **Phase 007 cites a live-run log that is absent and permanently ignored by Git** -- `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/acceptance-criteria.md:59-61` -- AC-006, AC-007 and AC-008 each mark themselves `Met` with line citations into `evidence/live-run10-2026-10-19/relaunch-run10.log`; `implementation-summary.md:71` says the file was created; and the benchmark report records its byte count and SHA-256 (`.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/README.md:44-49`, `source.md:19`). The directory contains six files, none named `relaunch-run10.log`; `git ls-files` lists only the launch commands and five pane captures; `git check-ignore -v` reports `.gitignore:263:*.log` for the cited path.
   Case: a fresh checkout or an auditor opens AC-006 and follows `relaunch-run10.log:1` for the prepare line, `:2` for SIGTERM, and `:3` for the relaunch. The file does not exist and cannot be committed under that name; the outcome JSON's hash describes a file the repository does not hold. The same audit cannot verify the three handoff notes either, although `source.md` explicitly labels them gitignored local state. The packet is marked Complete on evidence that is not durable.
   Claim adjudication:
   ```json
   {
     "findingId": "DS-004",
     "claim": "Phase 007's acceptance criteria and benchmark report cite a live-run log that is absent from the repository and excluded by the .gitignore *.log rule.",
     "evidenceRefs": [
       "specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/acceptance-criteria.md:59-61",
       "specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/implementation-summary.md:71",
       ".skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/README.md:44-49",
       ".skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/source.md:19",
       ".gitignore:263"
     ],
     "counterevidenceSought": "Searched the evidence directory, the benchmark folder, the whole repository, and the sibling worktrees for the filename; checked git ls-files and git check-ignore; read the benchmark outcome JSON, which repeats the path and hash without embedding the bytes.",
     "alternativeExplanation": "The log may be intentionally local-only because the repository ignores all *.log files. That explanation is rejected because the acceptance criteria cite it as a Met condition with line numbers and the benchmark declares requireDurableEvidence true, so the packet treats it as durable evidence.",
     "finalSeverity": "P1",
     "confidence": 0.97,
     "downgradeTrigger": "If the acceptance criteria and benchmark are amended to cite the tracked pane captures and outcome JSON as the durable record and the log claim is removed, downgrade to P2 documentation follow-up."
   }
   ```
   Finding class: documentation-evidence-defect
   Scope proof: the three AC rows and the benchmark rows name the missing path directly; `git check-ignore` proves the named path cannot be added without a negation or rename.
   Affected surface hints: ["phase 007 closure", "benchmark run 10 outcomes", "future review provenance"]
   Evidence: directory listing shows only `launch-commands.txt`, three runtime panes, and two receiver panes; `git ls-files` has no log; `.gitignore:263` excludes `*.log`.
   User impact: phase 007 cannot be honestly closed from a fresh checkout, and the live run 10 timings and hash cannot be verified.
   Recommendation: copy the log to a non-ignored name such as `relaunch-run10.txt`, or add a targeted negation for this evidence file; re-hash it, update the AC, implementation summary, benchmark README, source, and outcome JSON to the new path, or amend the AC to cite the tracked panes and outcome JSON and drop the log claim.

### P2 Findings

2. **The parent specification still counts six children and leaves the 006-to-007 handoff row undefined** -- `specs/hooks/023-session-relaunch-loop/spec.md:39,51,62-67,79-86,122` -- the metadata says `All six children are Complete`; the purpose says `The six child phases`; the In Scope list stops at phase 006; the Files to Change table stops at phase 006; and the phase handoff table's final row is `[Criteria TBD]` / `[Verification TBD]` even though the phase map above it lists phase 007 as complete.
   Case: a parent-closure review reads the parent specification and sees six children and an undefined handoff into phase 007, so the phase map and the closure contract disagree.
   Finding class: documentation-drift
   Scope proof: `rg -n "six|007|TBD" specs/hooks/023-session-relaunch-loop/spec.md` shows the phase map's seven and the prose's six in the same file; phase 007's own spec records that it updated the map and binding table, not these rows.
   Affected surface hints: ["parent closure metadata", "phase scope", "phase file map", "006-to-007 handoff verification"]
   Evidence: `spec.md:39`, `:51`, `:62-67`, `:79-86`, and `:122`.
   User impact: the parent reports a different child set from its own phase map and leaves phase 7's transition unverifiable.
   Recommendation: say seven, add phase 007 to In Scope and Files to Change, and fill the 006-to-007 handoff row with the phase 007 acceptance criteria and `validate.sh 007 --strict` plus the run 10 benchmark row.

3. **Phase 006's review evidence cites an absent report path and an ephemeral temp table** -- `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/spec.md:40,43` -- the scope boundary and dependency cite `../review/review-report.md` and an absolute `/private/tmp/.../verification.md`; the parent's 005-to-006 handoff row at `spec.md:121` cites the same report; AC-010 at `acceptance-criteria.md:65` claims the report resolves at 37,457 bytes, and AC-011 at `:66` cites `review/review-report.md:1`. The review tree now holds no `review-report.md`; the generation-2 report was archived to `review-archive/20261019T144809Z/review-report.md`.
   Case: an auditor follows phase 006's scope or AC-010/AC-011 after the generation-2 archive and finds the named report absent; the verification table is outside the repository and will not survive a cleanup.
   Finding class: documentation-evidence-defect
   Scope proof: `find specs/hooks/023-session-relaunch-loop/review -maxdepth 2 -type f` shows only observability files; the archived report exists; `rg -n "review/review-report.md"` lists the stale citations.
   Affected surface hints: ["phase 006 scope", "phase 006 acceptance evidence", "parent 005-to-006 handoff", "phase 004 continuity pointer"]
   Evidence: `006-deep-review-2-remediation/spec.md:40,43`, `acceptance-criteria.md:65-66`, parent `spec.md:121`.
   User impact: phase 006's closure evidence is not reproducible from the repository, and the parent's handoff path is stale.
   Recommendation: repoint all active citations to `review-archive/20261019T144809Z/review-report.md`, copy the verification table into the packet or cite the archived report's section that contains the same dispositions, and update AC-010 and AC-011 so their path claims are true.

4. **The handoff command documents exit 3 as outside-loop only, while the CLI also returns 3 at the hop cap** -- `.skilled/commands/speckit/handoff.md:33,105-107` -- the CLI table and Step 5 say `3` means "not under `skilled-loop`"; `prepare` returns 3 inside the loop when `hops >= maxHops`, after printing the hop-limit line and the manual claim command and logging `prepare-declined reason=hop-cap` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:399-415`). The feature catalog and `ENV-REFERENCE` describe the cap path, but the command document does not.
   Case: a session at the hop cap runs `/speckit:handoff`; the command sees exit 3 and reports the session is not under `skilled-loop`, which is false, so the operator may retry or diagnose the wrapper instead of treating the cap as the intended decline.
   Finding class: documentation-drift
   Scope proof: the CLI code has two return-3 paths at `session-relaunch.cjs:378-381` and `:405-415`; the command doc describes only the first.
   Affected surface hints: ["/speckit:handoff", "operator status line", "hop-cap decline", "auto-compaction fallback message"]
   Evidence: `handoff.md:33` and `:105-107`; `session-relaunch.cjs:399-415`.
   User impact: misleading operator guidance at the cap; the session may retry a handoff that must decline.
   Recommendation: describe exit 3 as "outside the loop or at `SESSION_RELAUNCH_MAX_HOPS`", distinguish the two printed lines and log reasons, and add a command-doc test or a status-line example for the cap.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The parent count and scope drift from the seven-phase map; the handoff command's exit-3 contract drifts from the CLI. |
| `checklist_evidence` | partial | Phase 007 AC-006/007/008 cite a missing log; phase 006 AC-010/011 cite an absent report path. The pane captures and most acceptance rows still resolve. |
| `skill_agent` | notApplicable | The target is a spec folder. |
| `agent_cross_runtime` | pending | Adapter parity is scheduled for iteration 5. |
| `feature_catalog_code` | pending | Catalog claims are scheduled for iteration 5. |
| `playbook_capability` | pending | Playbook claims are scheduled for iteration 5. |

## Ruled Out

- The archived generation-2 report itself is present and states PASS with 12 active P2 findings and a LOGIC-SYNC note; only the live-path citations are stale (`review-archive/20261019T144809Z/review-report.md:1-15`).
- The phase 007 pane captures and launch commands are present; only the log is absent.
- The phase 007 acceptance rows AC-001 to AC-005 and AC-009 resolve to the test and AGENTS.md/opencode.json evidence they name.

## Edge Cases

- The log's absence may be a packaging decision rather than a deletion; the finding is about the citation contract, not about whether run 10 happened. The tracked panes and outcome JSON still support the run, but the AC's exact line references do not.
- The `/private/tmp` verification table exists on this machine; the finding is that a committed spec depends on it, so it is not portable.
- The parent count drift does not change any code behavior; it changes what a closure reviewer can conclude.

## Confirmed-Clean Surfaces

- Phase 007's spec-gate exemption, AGENTS.md sentences, and `opencode.json` model pin match the code and the tracked test evidence.
- The archived report's verdict and registry totals agree with the phase 006 summary.
- The live-run panes show `WRAPPER_EXIT=0` and no operator question, independent of the missing log.

## Next Dimension

Maintainability: stale-lock housekeeping, freshness edge handling, documentation/test coverage of the adapter spec-folder path, and the maintainability cost of the duplicated handoff state.

Review verdict: CONDITIONAL
