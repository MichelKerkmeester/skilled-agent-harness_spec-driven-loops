# Review Report: fan-out write containment hardening (packet 045)

**Review target:** `specs/system-deep-loop/045-fanout-write-containment-hardening` (spec-folder)
**Change set:** commits `5340e39233` through `63b633c62f` — 8 commits, 31 `.opencode` files, +1126/−5876
**Lineage:** `deepseek` (`cli-pi`, model `deepseek-v4.1-flash`) · session `fanout-deepseek-1789404700951-8xtlnk`
**Iterations:** 5 of 5 · **Stop reason:** `maxIterationsReached`
**Overall verdict: FAIL** — 1 active P0, 3 active P1, 20 active P2 (24 open, 0 resolved)

---

## 1. Executive Summary

The containment hardening itself — preserve-by-default, baseline-targeted restore, outcome separation, the churn detector, the index-lock retry, the never-fatal untracked rule — is present, coherent and behaviourally consistent with its specifications; iterations 1, 2, 4 and 5 confirmed the shipped write paths against the packet's requirements, and most of what they found are bounded defects rather than design failures.

The failure is the *migration* the change set's final phase performed. Commit `ca713e3478` deleted the per-lineage worktree mechanism from the runtime, and the documentation, the closure gate, the handoff and one live caller were not brought with it. The packet now reads `Complete` while three of its requirements (`spec.md:133` REQ-005, `:141` REQ-007, `:142` REQ-008) still normatively mandate a mechanism that no longer exists (F-009 — the P0), its acceptance-criteria gate still marks the worktree rows `Met` with evidence that is deleted or out of range (F-010), and the `cli-opencode` dispatch guard in the review command still requires an isolated linked worktree that nothing creates any more, so that supported route now fails closed before dispatch (F-017). Alongside those, the opt-in restore remedy — the one branch that intentionally writes over a file — follows a symlinked path component and can write outside the tree (F-005).

**Verdict counts:** P0 = 1 · P1 = 3 · P2 = 20 · `hasAdvisories`: true. An active P0 was confirmed, so the verdict is FAIL and cannot be relabelled.

**Dimension coverage:** correctness (4 findings), security (4), traceability (10), maintainability (5), completeness (1). `resource_map_present` was false, so this report intentionally omits the Resource Map Coverage Gate section.

---

## 2. Planning Trigger

The verdict routes to **planning**, not a changelog follow-up:

- A P0 exists, so the packet cannot be treated as closed. The spec and the acceptance criteria must be reconciled with what shipped (F-009, F-010) before any closure claim is repeated.
- Two of the P1s change behaviour rather than documentation: the restore writer must stop following symlinks (F-005), and the `cli-opencode` guard must stop failing a supported route (F-017).
- The remaining P1 is the same migration gap as the P0 at a different surface — the command workflow and the review loop protocol still describe and enforce the old model (F-016, F-017).
- The P2 set is ordinary remediation work (guard robustness, documentation hygiene, diagnostics) and does not block planning.

Suggested trigger wording: *"Remediate the deep review of packet 045: reconcile the spec and closure gate with the worktree removal, guard the restore writer, and complete the caller/protocol migration."*

---

## 3. Active Finding Registry

Full entries with evidence, recommendations, adjudication packets and scope proofs: `deep-review-findings-registry.json`.

| ID | Severity | Dimension | Location | Title |
|----|----------|-----------|----------|-------|
| F-001 | P2 | correctness | `runtime/lib/deep-loop/write-containment.ts:833-835` | A path deleted before dispatch is subtracted from detection forever |
| F-002 | P2 | correctness | `runtime/scripts/fanout-run.cjs:1676-1687` | The churn detector's first window is never counted |
| F-003 | P2 | correctness | `runtime/scripts/fanout-run.cjs:3236-3248` | NFR-P01's single-invocation claim undercounts the churn sampler |
| F-004 | P2 | correctness | `runtime/scripts/runtime-bootstrap.cjs:54-73` | The containment repo root can resolve to a subdirectory while all guard paths are repo-relative |
| F-005 | P1 | security | `runtime/lib/deep-loop/write-containment.ts:1184-1187` | Baseline-targeted restore follows a symlink and can write outside the working tree |
| F-006 | P2 | security | `runtime/lib/deep-loop/write-containment.ts:943-951` | The quarantine writer does not canonicalize its destination |
| F-007 | P2 | security | `runtime/lib/deep-loop/write-containment.ts:983-999` | Quarantine copies out-of-scope file content into a publishable artifact plane |
| F-008 | P2 | security | `runtime/lib/deep-loop/executor-config.ts:695-716` | The removed `containment.worktrees` key is silently accepted |
| F-009 | **P0** | traceability | `specs/.../045-.../spec.md:133` | The spec still mandates the worktree mechanism the packet removed while reading Complete |
| F-010 | P1 | traceability | `specs/.../045-.../acceptance-criteria.md:71` | The acceptance criteria remain In Progress and their Met evidence cites deleted files and out-of-range lines |
| F-011 | P2 | traceability | `specs/.../045-.../implementation-summary.md:3` | implementation-summary.md states the reversal in one paragraph and presents the mechanism as shipped everywhere else |
| F-012 | P2 | traceability | `specs/.../045-.../tasks.md:87` | tasks.md still records the removed worktree phase as delivered with deleted-suite evidence |
| F-013 | P2 | traceability | `specs/.../045-.../handover.md:37` | handover.md briefs a cold session on the removed worktree default |
| F-014 | P2 | traceability | `specs/.../045-.../goal.md:16` | goal.md's durable slice still records the worktree default flip as the live decision |
| F-015 | P2 | traceability | `specs/.../045-.../spec.md:192` | The spec's own section-7 justification contradicts REQ-004's shipped thresholds |
| F-016 | P2 | traceability | `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280` | REQ-006's both-loop-protocols clause is half migrated and two stale comment blocks contradict the sweep claim |
| F-017 | P1 | traceability | `.opencode/commands/deep/assets/deep-review-auto.yaml:1308` | The cli-opencode dispatch guard still requires an isolated linked worktree and now always throws |
| F-018 | P2 | traceability | `specs/.../045-.../spec.md:199` | NFR-R01 claims a fail-open property the module does not implement |
| F-019 | P2 | maintainability | `.opencode/commands/deep/assets/deep-review-auto.yaml:1521` | Ten byte-identical inline containment call blocks duplicate the same options and message across four command YAMLs |
| F-020 | P2 | maintainability | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3171` | The index-lock contention warning is drained only by the fan-out runner |
| F-021 | P2 | maintainability | `specs/.../045-.../decision-record.md:234` | The decision record's supersession chain leaves two removed-mechanism ADRs looking live |
| F-022 | P2 | maintainability | `.opencode/commands/deep/assets/deep-review-auto.yaml:1328` | The artifact-scope containment rule is implemented twice with no shared helper |
| F-023 | P2 | maintainability | `.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:3` | The runtime fan-out catalog entry is stale and names its third CLI kind twice |
| F-024 | P2 | completeness | `runtime/scripts/fanout-run.cjs:860-876` | The empty-registry advisory tests the research key and misfires on every review lane |

---

## 4. Remediation Workstreams

**WS-1 — Closure integrity (P0 + P1).** Rescope `spec.md`: mark REQ-005/REQ-007/REQ-008, SC-003/SC-005 and NFR-R02 `Superseded` by ADR-007 (or delete them), and rewrite the frontmatter, executive summary, key decisions and dependency table to the shipped shared-checkout design. Mark acceptance criteria AC-009 and AC-012..AC-018 `Superseded` in the waiver cells with ADR-007 named, re-anchor the remaining citations, and re-date the metadata against HEAD. Covers F-009, F-010.

**WS-2 — Restore-writer safety (P1).** Refuse to restore through a non-regular file: `lstat` the destination (or open with `O_NOFOLLOW`) before `writeFileSync`, and preserve-and-report instead of writing when the check fails. Covers F-005. (F-006's quarantine destination deserves the same canonicalization while the writer is open.)

**WS-3 — Caller and protocol migration (P1 + P2).** Remove the linked-worktree precondition from the `cli-opencode` guard while keeping its artifact-dir and prompt-section checks, or replace it with a deliberate documented refusal; mirror the containment ruleset into `deep-review/references/protocol/loop-protocol.md`; fix the two stale comment blocks above the migrated inline calls and re-run the REQ-006 sweep with the result recorded. Covers F-016, F-017; also F-019/F-020/F-022 if the call sites are collapsed into one helper.

**WS-4 — Guard robustness and diagnostics (P2).** F-001 (deleted-at-baseline path short-circuit), F-002 (seed the churn sampler from the pre-dispatch snapshot), F-003 (amend NFR-P01 or drop the hashing), F-004 (resolve the guard root to the git toplevel), F-008 (`z.never().optional()` for `containment.worktrees`), F-018 (align NFR-R01 with the throw or make it fail open), F-024 (accept `openFindings` for review).

**WS-5 — Record hygiene (P2).** F-011, F-012, F-013, F-014, F-015, F-021, F-023: bring `implementation-summary.md`, `tasks.md`, `handover.md`, `goal.md`, the section-7 prose, the ADR supersession chain and the runtime feature catalog in line with the shipped state.

---

## 5. Spec Seed

Minimal spec delta for the remediation packet:

- **Requirements table:** REQ-005, REQ-007, REQ-008 → `Superseded by ADR-007`; remove or rewrite SC-003, SC-005 and NFR-R02; frontmatter description and trigger phrases, executive summary, Key Decisions and Critical Dependencies reworded to the single shared-checkout path.
- **Threshold consistency:** section 7's rationale prose updated from twelve/forty to the shipped three/twelve (REQ-004 stays as the normative copy).
- **NFR-R01:** state the real behaviour — containment throws when the artifact directory cannot be resolved inside the working tree; either amend the requirement or make the guard fail open.
- **REQ-002 surface:** note that the restore opt-in is reachable from the fan-out runner (`--containment-mode restore`, `containment.mode`) and that inline command iterations always run preserve.
- **NFR-P01:** state the sampler's real per-heartbeat cost (one `status` plus hashing per dirty path) or commit to the narrower implementation.

---

## 6. Plan Seed

1. Open a remediation packet under `specs/system-deep-loop/` (likely a child of 045) referencing this report.
2. WS-1 first: reconcile `spec.md` and `acceptance-criteria.md`; re-run `validate.sh --strict` on the packet and confirm the closure gate reports `Superseded` rows instead of unresolvable `Met` evidence.
3. WS-2: patch the restore writer with an `lstat`/`O_NOFOLLOW` guard; add the missing case to `write-containment.vitest.ts` (symlink at a baseline-captured path under restore) and assert the path is preserved with an advisory instead of written through.
4. WS-3: patch the `cli-opencode` guard, mirror the loop protocol, correct the comment blocks; re-run the documentation sweep across the four command workflows and five documentation surfaces and record the output.
5. WS-4/WS-5 in any order, each with its cheap test (F-001 deleted-at-baseline, F-024 review-shaped registry fixture, F-008 schema rejection) and a doc edit.
6. Re-run the full deep-loop runtime suite from the final state and record file/test counts.
7. Re-review with a fresh lineage against the remediation packet; the P0 clears when spec, closure gate and code agree, not when the documents are merely annotated.

---

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core (hard) | **fail** | Four spec/code contradictions: the worktree requirements (F-009), the thresholds prose (F-015), NFR-R01 (F-018), and the removed key's silent acceptance (F-008). |
| `checklist_evidence` | core (hard) | **not applicable** | No `checklist.md` exists in the packet or any child phase (`git log --diff-filter=D --all` finds none). The packet's verification list lives in `tasks.md` (91 checked boxes, 0 unchecked) and still asserts the worktree mechanism as delivered (F-012). |
| `feature_catalog_code` | overlay | **partial** | The hub entry `feature-catalog/fanout-write-containment/fanout-write-containment.md` was migrated by `ca713e3478` and matches the shipped behaviour. The runtime entry `runtime/feature-catalog/fanout/fanout-run.md` is stale (F-023). |
| `playbook_capability` | overlay | **pass** | `manual-testing-playbook/write-containment/shared-checkout-run.md` describes the preserve path and the advisory outcome accurately; no worktree wording remains. |

Unresolved gaps: the packet's closure evidence is authoritative-looking but false in eight rows; the hub SKILL.md's pointer to a single protocol file leaves the review mode without its own containment rules; and the packet's `decision-record.md` chain terminates cleanly only for ADR-004/ADR-006.

---

## 8. Deferred Items

- **No test execution in this lineage.** The write-surface constraint forbids running the suite (it writes caches outside the lineage). Every finding is static evidence — code reading, `git log`/`git show`, and file-length/path checks. The suite's own result at HEAD (`ca713e3478` message: 151 files, 2568 tests, exit 0) was not independently reproduced.
- **F-003** may be resolved by amending NFR-P01 rather than the sampler; that is a product decision.
- **F-007** (out-of-scope content copied into the artifact plane) needs an operator decision on redaction/retention before any code change.
- **F-002's** first-window gap could be closed by seeding from the pre-dispatch snapshot, but the snapshot costs a status and hashes; the cost/benefit is deferred to the remediation packet.
- **F-019/F-022** (duplication) are refactors that should ride along with WS-3, not block it.
- The sibling lineage(s) for this run were not present during the review, so no cross-lineage comparison was possible; the merged registry will combine this lineage with the others when the fan-out settles.

---

## 9. Audit Appendix

**Iterations and verdicts**

| # | Focus | Verdict | New findings |
|---|-------|---------|--------------|
| 1 | correctness | PASS | 4 P2 |
| 2 | security | CONDITIONAL | 1 P1, 3 P2 |
| 3 | traceability | FAIL | 1 P0, 2 P1, 7 P2 |
| 4 | maintainability | PASS | 5 P2 |
| 5 | completeness | PASS | 1 P2 |

**Coverage.** Dimensions addressed: all four configured dimensions plus a completeness/closure pass. Files reviewed per iteration are recorded in each `iterations/iteration-00N.md` and in the strategy's file table. Two overlay protocols were run (feature catalog, playbook); `checklist_evidence` was ruled not applicable; `spec_code` was run with a hard gate and failed.

**Convergence evidence.** New-findings ratios across iterations: 0.62, 0.55, 0.55, 0.71, 0.25 — diverging while new surfaces were opened, converging on the final pass. Convergence mode was off; the thresholds are telemetry only, and the run stopped on `maxIterationsReached` after all five planned angles were covered.

**Evidence base and its limits.** All findings cite file lines that were read during the run, and each iteration records the counter-evidence it sought. Test line citations were checked against current file lengths; `git log`/`git show` were used to establish what the change set did and did not touch (e.g. the acceptance criteria were never edited in the range; the command YAMLs were not swept). No command was executed that writes outside this lineage directory; no git write was performed. Where a claim depends on runtime behaviour that only a suite run could demonstrate (e.g. the restore symlink path), the finding states that it was reasoned from the code rather than executed.

**Replay.** Registry: `deep-review-findings-registry.json` (24 open findings, `disposition: active`). State log: `deep-review-state.jsonl` (config, five iteration records, one synthesis event). Deltas: `deltas/iter-00N.jsonl`. Verdicts: last line of each iteration file. Where the dashboard and the JSONL disagree, the JSONL wins.

**Verdict statement.** `FAIL` — active P0 count 1, active P1 count 3, active P2 count 20, `hasAdvisories: true`. The packet may not be treated as closed until F-009 and F-010 are resolved and the P1s are fixed.
