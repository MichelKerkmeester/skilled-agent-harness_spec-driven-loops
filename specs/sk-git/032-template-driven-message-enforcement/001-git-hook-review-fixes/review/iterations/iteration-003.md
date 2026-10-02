# Review Iteration 003 — D3 Traceability

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=traceability
BINDING: specFolder=specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes

- Dispatcher: /deep:review loop, iteration 3 of 5. Mode=review, target_agent=deep-review, run=3.
- Lineage: sessionId=dr-githooks-20261002T103712Z, parentSessionId=null, generation=1, lineageMode=new.
- Budget profile: verify (dispatch raised the ceiling: target 20, hard max 30).
- Target revision observed this iteration: main checkout HEAD `03afeb4552bbfa8ebeb54dc296d19c9981e6d091` (2026-10-02 10:08 +0200), confirmed by `git log -1`. The worktree-075 copies were not read as target; every citation below is a main-checkout path.
- Untrusted-content guard: no reviewed artifact carried directive-like text aimed at the reviewer; all content was treated as data.

## Dimension

D3 Traceability: spec alignment, checklist evidence, cross-reference integrity, runtime parity and named integration touchpoints. Five new P2 findings, all documentation/evidence-chain defects; no new P0 or P1. The active P0 from D2 and the five active P1 from D1 remain untouched and were not re-entered.

## Files Reviewed

Target surfaces (main checkout, absolute paths):
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:235-244`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/validate-message.mjs:6-13,46,57`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/lib/message-contract-gate.sh:38`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-push:58,155-176`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh:80`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-commit` (rg `mass.deletion`: zero hits)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/hooks/git/pre-commit` (rg `mass.deletion`: zero hits)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/install-git-hooks.sh:96-150`

Traceability context surfaces (packet and named integration docs, cited as evidence only):
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-git/032-template-driven-message-enforcement/spec.md:37,69,92,107`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md:44,55-68,93`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-git/032-template-driven-message-enforcement/tasks.md:51,136,150,192,226-227`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:25-52`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/references/continuous-integration.md:99-121`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/SKILL.md:302,317`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/hooks/git/README.md:52`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/README.md:29` and `lib/README.md:38`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/README.md:47`

## Findings by Severity

### P0 Findings

None new. The active P0 from iteration 2 (R2-P0-001, machine-wide hooks sourcing repo-controlled code) remains active at this revision and is the FAIL basis.

### P1 Findings

None new. The five D1 P1 findings remain active and were not re-raised.

### P2 Findings

1. **R3-P2-001 — Acceptance criteria name a git config key the implementation never reads (`skgit.messageContract`)** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md:59` (code: `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:239`; `.skilled/scripts/git-hooks/lib/message-contract-gate.sh:38`).
   - Evidence: AC-003's Given clause is "Given git config `skgit.messageContract`…". The resolver's only config read is `git config --get skgit.contractDir` (message-contract.mjs:239, message-contract-gate.sh:38). `rg 'skgit\.messageContract'` over `.skilled` and `specs` returns exactly one hit — the AC-003 row — while `skgit.contractDir` appears in spec.md:69, plan.md:62, implementation-summary.md:66, SKILL.md:317, all three templates (commit-message-template.md:180, pr-template.md:545, worktree-checklist.md:438), scripts/README.md:47, changelog/v1.8.0.0.md:23 and the feature catalog:29. Same drift class in tasks.md:51, which declares the CLI as `--range`; the shipped flag is `--rev-list` (validate-message.mjs:8,46; spec.md:92 also says `--rev-list`).
   - Scenario: a verifier reproducing AC-003 literally sets `git config skgit.messageContract <dir>` in a repo with no `.sk-git/`; `validate-message.mjs --explain` never reports that directory, so the row's Given state cannot exist and its `Met` evidence (message-contract.test.mjs:152, which sets `skgit.contractDir`) does not cover the key the row names. A reader copying `--range` from tasks.md gets `unknown argument: --range` (validate-message.mjs:57).
   - Finding class: instance-only. Scope proof: `skgit.messageContract` has one occurrence in the entire main checkout; the resolver's config read exists at two sites, both `contractDir`.
   - Affected surface hints: ["acceptance-criteria AC-003","config-key documentation","tasks.md T008 CLI signature","message-contract resolver"]

2. **R3-P2-002 — All acceptance evidence pins `38b2135472`, but four reviewed-file commits postdate it and nothing was re-verified at the reviewed HEAD** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md:55-68`.
   - Evidence: every AC row cites `(38b2135472)` (2026-10-01 20:06). `git merge-base --is-ancestor 38b2135472 HEAD` is true, and `git log 38b2135472..HEAD` over the reviewed paths lists four commits: `0460fee3e6` (guard-library headers), `ecf2897455` "fix(sk-git): accept an on-disk packet in the pre-push Spec check" (message-contract.mjs), `301194d842` (catalog/headers; message-contract.mjs comment changes), and `0b2730da90` "perf(sk-git): check a pushed range in one git call instead of one per commit" (message-contract.mjs + validate-message.mjs). The reviewed target is the later revision `03afeb4552`.
   - Scenario: AC-008's cited evidence run predates 0b2730da90's rewrite of the range-reading path; a closure reviewer at 03afeb4552 has no evidence run for the range code actually shipped. CHK-FIX-007's "pinned to a fix SHA" pin is real but names a superseded revision relative to the review target.
   - Finding class: matrix/evidence. Scope proof: the four commits are the only commits in the range touching the reviewed paths; no AC row cites a SHA at or after 0b2730da90.
   - Affected surface hints: ["acceptance-criteria evidence SHA","pre-push range check","message-contract validator","packet closure gate"]

3. **R3-P2-003 — Feature catalog promises rebase-safe Commit-Id uniqueness the reviewed code still lacks (contradicts active R1-P2-007)** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:48`.
   - Evidence: the catalog states "The `Commit-Id` uniqueness scan ignores `*/HEAD` and the ref being overwritten, so a rebased branch is not compared with its own old copies." Active finding R1-P2-007 (iterations 1-2, still in the registry) shows the scan (`git log --all --not HEAD`, message-contract.mjs:654-662, 687-714) still sees a pre-rebase copy reachable from another local branch. The catalog file was created by 301194d842, after the evidence SHA, and the uniqueness code it describes is unchanged for that case at HEAD.
   - Scenario: `git branch keep <tip>` then rebase/amend the working branch — the catalog tells the operator a rebased branch is not compared with its own old copies, yet the check blocks with `trailer.commit-id-unique` on the copy `keep` still holds.
   - Finding class: cross-consumer (doc vs code). Scope proof: the feature catalog is the canonical documentation surface for this validator; its range-check paragraph is the only place the rebase-safety promise is made.
   - Affected surface hints: ["feature catalog message-contract-enforcement.md","Commit-Id uniqueness scan","active R1-P2-007"]

4. **R3-P2-004 — sk-git CI reference says the mass-deletion ceiling runs at pre-commit; only pre-push runs it** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/references/continuous-integration.md:106`.
   - Evidence: the gate-map row reads "Pre-commit | Mass-deletion ceiling | Yes, before the commit". Neither `git-hooks/pre-commit` nor `hooks/git/pre-commit` contains a mass-deletion reference (rg over both: zero hits). The guard is sourced only at pre-push:58 (`_MASS_DEL_GUARD`) and gate 0 runs at pre-push:155-161; README.md:29 and lib/README.md:38 both say it backs the pre-push gate; the log is written at lib/mass-deletion-guard.sh:80. The same table lists the row again, correctly, at Pre-push (line 115).
   - Scenario: an operator deleting 150 tracked files trusts the pre-commit row and expects `git commit` to block; it commits cleanly and the first block is `git push` — the commit can be shared by any path that bypasses the push gate.
   - Finding class: instance-only. Scope proof: pre-push is the only consumer of the guard among the 14 scope files; both pre-commit copies are clean of it.
   - Affected surface hints: ["continuous-integration.md gate map","pre-push gate 0","mass-deletion-guard.sh"]

5. **R3-P2-005 — Packet completion state is internally contradictory at the reviewed revision** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md:44,93` vs `tasks.md:136,192` and `spec.md:37`.
   - Evidence: spec.md:37 says `Status: Complete` and acceptance-criteria.md:93 says `Closeable: Yes` ("All twelve criteria are met or superseded"). But acceptance-criteria.md:44 says `Status: In Progress`; tasks.md leaves four P0 verification items unchecked — CHK-020 "All acceptance criteria met" (:136), CHK-FIX-004 (:150), CHK-120 (:226), CHK-121 (:227) — and the Verification Summary (:192) reports P0 11/15 and P1 16/23.
   - Scenario: a downstream closure decision reads spec.md or the AC closure statement and closes the packet while the task ledger it points to ("Verification Checklist" per spec.md RELATED DOCUMENTS) reports four open P0 items; two packet docs disagree on whether the criteria are met.
   - Finding class: matrix/evidence. Scope proof: these three files are the packet's completion surfaces; acceptance-criteria.md is self-contradictory between metadata and closure statement.
   - Affected surface hints: ["packet completion metadata","tasks.md verification checklist","acceptance-criteria closure statement"]

## Traceability Checks

- spec_code (core): **pass** — spec.md's claims match the implementation at HEAD: resolution order contractDir → `.sk-git/` → repo sk-git assets (message-contract.mjs:235-244, catalog:29), CLI surface from spec.md:92 present (validate-message.mjs:6-13,46), spec.md:107 `--status` reports the resolved contract via `--explain` (install-git-hooks.sh:140-149), and spec.md:70's declared exception survives alone (`SPECKIT_SKIP_PREPARE_COMMIT_MSG`, prepare-commit-msg:14,28). The drifts found are in AC/tasks/catalog docs, not in spec.md.
- checklist_evidence (core): **fail** — R3-P2-001, R3-P2-002 and R3-P2-005. The AC table is the closure gate; two of its rows are not reproducible as written or not pinned to the reviewed revision, and the task checklist contradicts the closure statement.
- skill_agent (overlay): **pass** — SKILL.md:317 (`skgit.contractDir`) and SKILL.md:302 (autostash guard anchors under `refs/autostash-rescue/<sha>` and alerts) agree with message-contract.mjs:239 and lib/README.md:27-38; scripts/README.md:47 agrees.
- agent_cross_runtime (overlay): **notApplicable** — the 14 reviewed files are native git hooks; `.skilled/hooks/git/README.md:52` states this concern has no per-runtime adapters. The seven-runtime agent gate is a different, out-of-target surface.
- feature_catalog_code (overlay): **partial** — the feature-catalog entry exists and matches the resolution order, gate list, exit codes and source table, but its range-check paragraph overclaims rebase safety (R3-P2-003).
- playbook_capability (overlay): **deferred** — sk-git playbook scenarios exist (`manual-testing-playbook/commit-formation/template-rules-block-commits.md`, `co-authored-by-footer.md`) but were not executed or line-verified within this iteration's budget; deferred, not passed.

## Integration Evidence

- pre-push gate 0 → `lib/mass-deletion-guard.sh` (pre-push:58,155-176; log write at guard:80) — R3-P2-004.
- `install-git-hooks.sh:140-149 --status` → `validate-message.mjs --repo <root> --explain` — verifies spec.md:107.
- Native-hook surface: `.skilled/hooks/git/README.md:52` (no runtime adapters) — R3 overlay notApplicable basis.
- Feature-catalog canonical source: `feature-catalog/feature-catalog.md` → `workflow-playbooks/message-contract-enforcement.md` (created by 301194d842) — R3-P2-003.

## Edge Cases / Ambiguities

- The SHA drift (R3-P2-002) does not by itself prove a behavioral regression; 0b2730da90 rewrote the range path but iteration 1 found the range defects (R1-P1-005, R1-P2-006) against post-0b2730da90 code. The finding is evidence staleness, hence P2.
- R3-P2-003 ties to active R1-P2-007 rather than re-raising it; whether the catalog sentence describes worktree-075's uncommitted fix could not be proven from main alone.
- Playbook scenario verification was deliberately deferred for budget; recorded as `deferred`, never as a pass.
- Iteration timestamp is approximate (run start 10:37:12Z); no clock call was within budget.

## Confirmed-Clean Surfaces

- `validate-message.mjs` CLI surface matches spec.md:92: `--commit`, `--rev-list`, `--pr-body`, `--branch`, `--explain`, `--check-template` (plus `--repo`/`--json`; validate-message.mjs:6-13,46).
- `install-git-hooks.sh:140-149 --status` resolves and prints the contract source — spec.md:107 verified.
- No validating skip switch in the reviewed hooks: `SPECKIT_SKIP_COMMIT_MSG_VALIDATE` appears only in tests (commit-msg.test.sh:196; pre-push-message-contract.test.sh:102); the surviving `SPECKIT_SKIP_PREPARE_COMMIT_MSG` is the spec-declared stamping exception (spec.md:70).
- Resolution order in prose matches code across templates, README and catalog (message-contract.mjs:235-244; commit-message-template.md:180; scripts/README.md:47; catalog:29).

## Ruled Out

- CLI contract drift beyond tasks.md: spec.md:92 matches the implementation exactly; only the tasks.md:51 shorthand `--range` is stale (folded into R3-P2-001), not evidence of a missing feature.
- `--status` contract reporting absent: refuted — install-git-hooks.sh:140-149 invokes `validate-message.mjs --explain`.
- Native-hook runtime parity gap: the concern has no per-runtime adapters by design (hooks/git/README.md:52) → notApplicable, not a gap.

## Verdict

1 active P0 (R2-P0-001) plus 5 active P1 carried from iterations 1-2 → FAIL. Five new P2 traceability findings, no new P0/P1. newFindingsRatio=0.13 (weighted new 5 / accumulated 39). Novelty justification: all five findings are new documentation/evidence-chain defects (AC interface drift, stale evidence SHA, catalog overclaim, CI gate-map error, completion-state contradiction); none duplicates a prior finding, and R3-P2-003 cites active R1-P2-007 without re-raising it.

## Next Dimension

D4 Maintainability — pattern compliance and safe follow-on change cost: duplicated SOURCE_ROOT selection across five hooks, the legacy `.skilled/hooks/git/pre-commit` copy versus `scripts/git-hooks/pre-commit`, hardcoded asset paths in the guard-sourcing logic, and comment/documentation consistency inside the hook scripts.

Review verdict: FAIL
