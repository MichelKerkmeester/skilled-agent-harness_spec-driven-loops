# Deep Review — Iteration 003

- Run: `rvw-021-004-routing-parity-20261011T193333Z` (generation 1, lineageMode new)
- Mode: review — `@deep-review`, single review iteration, externalized state
- Dimension: **traceability** (core: `spec_code`, `checklist_evidence`; overlay: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`)
- Review target: commit `f34b01bf0a` (worktrees/115-rem-routing-parity-ci) — the local-vs-native divergence ratchet, the widened holdout independence check, and the two new blocking steps in the `golden-prompt-gate` CI job
- Carried findings: P0=0 P1=0 P2=5 (R1-P2-001..003 correctness; R2-P2-001..002 security)
- New findings this iteration: **P1×1, P2×1** → running total P1=1, P2=6
- Verdict this iteration: **CONDITIONAL**

---

## Dimension

`traceability`. The iteration checks whether the change under review traces to its frozen requirements and whether the packet's required evidence artifacts exist and are consistent. Core protocols: `spec_code` (commit content vs the phase spec's Requirements and Files to Change) and `checklist_evidence` (the ledger rows and Tests table the spec routes into `implementation-summary.md`). Overlay protocols: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.

Correctness and security were completed in iterations 1–2; no direction from those iterations is re-entered here. The prior iterations twice deferred checklist evidence to "packet completion validation"; this iteration executes the packet's own completion criteria and records the result.

---

## Files Reviewed

| Target | Lines read | Purpose |
|--------|------------|---------|
| `.github/workflows/routing-registry-drift.yml` | 1–75, 250–305 | New steps, job placement, triggers, `working-directory` |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | diff hunks (206–341) | R3 pinned clock, R8 regime header |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts` | diff hunks (47–201, 303–360) | R5 declared surfaces, allowed-overlap map, undeclared-corpus scan |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md` | 1–159 | Requirements, ledgers, success criteria, Files to Change |
| `…/044-routing-parity-ci/goal.md` | 40–110 | Frozen decisions D1–D5, executable completion criteria |
| `…/004-routing-parity-ci/implementation-summary.md` | 1–101 | Spec-designated evidence artifact |
| `…/004-routing-parity-ci/plan.md`, `tasks.md` | 1–50 | Packet scaffolding state |
| `.skilled/skills/system-skill-advisor/SKILL.md` | 5 | Skill version line |
| `.skilled/skills/system-skill-advisor/changelog/` | directory listing | Changelog currency |
| `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md`, `manual-testing-playbook/manual-testing-playbook.md` | grep | Overlay documentation claims |
| `.pi/agents`, `.opencode/agents`, `.claude/agents`, `.codex/agents` | grep | Cross-runtime agent references |
| Commit `f34b01bf0a` | full message, `--name-status`, per-file diffs | Change evidence and verification transcript |

---

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required

#### 1 [P1] The change touches the advisor skill but ships no version bump and no changelog entry

- Case: merge this branch as delivered. The packet's frozen decision D5 — "Each touched skill is bumped once, with one changelog entry" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/goal.md:48] — and REQ-005 — "One new file under `.skilled/skills/<skill>/changelog/` and one `version:` change in its `SKILL.md` per touched skill" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:98] — are both unmet at HEAD. The commit touches `.skilled/skills/system-skill-advisor/runtime/tests/parity/` (two files) but `git diff 0039903bde HEAD -- .skilled/skills` adds zero changelog files and the SKILL.md diff has no `+version:` line.
- File: `.skilled/skills/system-skill-advisor/SKILL.md:5` (still `version: 0.15.3.0`; newest changelog remains `v0.15.3.0.md`).
- Evidence (executed, not inferred): the goal's own completion criterion was run verbatim —

  ```
  $ B=$(git log -1 --format=%H --grep='scaffold the open ends remediation phases')   # 0039903bde…
  $ git diff --name-only $B HEAD -- .skilled/skills
  .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts
  .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts
  $ git diff --name-only --diff-filter=A $B HEAD -- .skilled/skills/system-skill-advisor/changelog | wc -l
  0
  $ git diff $B HEAD -- .skilled/skills/system-skill-advisor/SKILL.md | grep '^+version:' || echo NO-VERSION-LINE
  NO-VERSION-LINE
  ```

  The goal check (goal.md completion criteria, criterion 4) prints the offending skill name — `system-skill-advisor` — instead of printing nothing, so the packet's handoff gate cannot pass at HEAD.
- User impact: the branch would merge a behavior-affecting skill change (two CI gates' test logic) with no release note and no version marker; consumers reading the skill's changelog/version see no record of the change, and the packet fails its own exit check.
- Finding class: class-of-bug (the miss is in the commit's artifact set, not a single line).
- Affected surface hints: ["skill release metadata (`SKILL.md` version)", "skill changelog (`changelog/`)", "021 integration step"]
- Recommendation: before this branch merges, add one changelog file under `.skilled/skills/system-skill-advisor/changelog/` describing the two blocking gates and bump `version:` in SKILL.md once (the integrator renumbers on collision per spec.md:149).
- Claim adjudication:
  - claim: REQ-005 / D5 is unmet by the only build commit on the branch.
  - evidenceRefs: `spec.md:98`, `spec.md:148`, `spec.md:149`, `goal.md:48`, the executed goal-check transcript above, `.skilled/skills/system-skill-advisor/SKILL.md:5`.
  - counterevidenceSought: a bump commit before or after `f34b01bf0a` on the branch (none — parent is the scaffold `0039903bde` and HEAD is the build commit); an uncommitted changelog in the worktree (`git status --porcelain` shows only the untracked `review/` run directory); a documented integrator-side bump (spec.md:149 says "the integrator renumbers, and each child still bumps once", i.e. the bump is the child's obligation); a different skill-touch definition (the two test files live under `.skilled/skills/system-skill-advisor/`).
  - alternativeExplanation: the version/changelog could be added centrally at the 021 integration step, making this a scheduling matter rather than a defect. Rejected as the primary reading: the frozen decision text assigns the bump to each child, and the goal's completion check diffs from the scaffold commit, so the criterion fails until a commit writes the artifacts.
  - finalSeverity: P1 (spec mismatch with an executable acceptance check; "must-fix before merge").
  - confidence: high (executed criterion; artifact absence verified twice, by diff and by directory listing).
  - downgradeTrigger: a demonstrated, documented integration step that writes the bump and changelog for every 021 child before the goal check runs → downgrade to P2 (process sequencing, not a content gap).

### P2 — Suggestions

#### 2 [P2] The spec-designated evidence artifact is still the untouched template

- Case: open the packet's completion flow. REQ-003 requires "The ledger lines in `implementation-summary.md` follow the format above, one per row" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:96]; REQ-004 requires the Tests table "recorded in a Tests table in the same file" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:126]; SC-001 counts 9 ledger rows "in `implementation-summary.md`" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:136]. At HEAD, `implementation-summary.md` still carries the v2.2 template body — `[Opening hook: …]` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/implementation-summary.md:48], `| [path] | [Created/Modified/Deleted] | …` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/implementation-summary.md:59], `[Validation, lint, tests, manual check]` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/implementation-summary.md:87] — with `completion_pct: 0` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/implementation-summary.md:21]. `plan.md` and `tasks.md` are likewise the generic scaffolds (e.g. pending `T001`).
- Consequence: the goal's ledger-count and Tests-table completion greps (goal.md completion criteria, criteria 1–3) all return failing values at HEAD, and the builder's before/after proofs (ratchet 2-of-6 → 7 passed; clock 2031-01-01 before 1 failed → after 7 passed; injected overlap before passed → after failed; actionlint exit 0) live only in the commit message body, not in the artifact the spec points readers and validators to.
- File: `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/implementation-summary.md:48`
- Evidence: the commit message's Verification section (executed commands and before/after counts) plus the template state read at HEAD; the spec routes the same evidence to `implementation-summary.md` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:121].
- User impact: a closure validator or reviewer cannot count completion from the designated artifact; the evidence chain runs through git history only.
- Finding class: instance-only (packet-doc backfill).
- Recommendation: when the packet closes, backfill the 9 ledger rows (R1–R9, Fixed with command proofs or Closed with written reasons) and the Tests table into `implementation-summary.md`, carrying the commit message's before/after values — no new work, transcription only.
- Claim adjudication (compact):
  - claim: the artifact required by REQ-003/REQ-004/SC-001 does not exist in substance at HEAD.
  - evidenceRefs: `spec.md:96`, `spec.md:121`, `spec.md:126`, `spec.md:136`, `implementation-summary.md:21`, `implementation-summary.md:48`, `implementation-summary.md:87`.
  - counterevidenceSought: a partly-filled summary behind the template head (read lines 1–101: no ledger or Tests rows anywhere); a different evidence location mandated by the goal (the goal greps the same file).
  - alternativeExplanation: the deep-review completion flow reconciles packet docs (spec, evidence rows, continuity, summary) at closure, which is the expected slot for this content. Accepted for severity: this is a pending closure artifact, not a code defect.
  - finalSeverity: P2.
  - confidence: high on the artifact's state; medium on who writes it and when.
  - upgradeTrigger: packet close/validation attempted without backfill → P1 (spec mismatch at handoff).

---

## Traceability Checks

### Core — `spec_code` — partial

- The commit modifies exactly the three files the spec's Files to Change names [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82]; `git show f34b01bf0a --name-status` lists only the workflow and the two vitest files.
- R1 (blocking step, outside warn-only admission): the two steps are blocking `run:` steps in the `golden-prompt-gate` job [SOURCE: .github/workflows/routing-registry-drift.yml:278] [SOURCE: .github/workflows/routing-registry-drift.yml:289]; no `continue-on-error` in the file; `working-directory: .opencode/skills/system-skill-advisor/runtime` resolves through the tracked `.opencode/skills → ../.skilled/skills` symlink and matches the existing baseline-ratchet step's convention.
- R3 (pinned clock): `ledgerScoringInstant`/`vi.setSystemTime` in the ratchet plus a self-check test that the clock equals the pinned instant (ratchet diff at new lines ~219–341).
- R5 (every scoring surface + allowed-overlap map): `SCORING_SURFACES` with per-surface `allowedOverlap` and reasons, a stale-declaration test, and the undeclared-corpus reader scan in `holdout-independent.vitest.ts` (new lines ~50–201, ~303–360). The spec's worked example (holdout-harder may overlap the lane-weight sweep and the divergence ratchet) is declared in both surfaces.
- R8 (regime header): the header addition states harness-regime parity, not live-daemon parity (ratchet diff, new lines 14–21).
- Gap: REQ-005 (skill bump/changelog) has no matching change — finding R3-P1-001. Status: partial.

### Core — `checklist_evidence` — fail (at HEAD)

- `implementation-summary.md` holds none of the 9 ledger rows and no Tests table; `tasks.md` is the generic scaffold; the goal's three grep-based criteria return failing values. Registered as finding R3-P2-001; expected backfill slot is packet closure.

### Overlay — `skill_agent` — notApplicable

- `SKILL.md` makes no contract claim about these internal CI gates, and the spec's frozen Files to Change admit no SKILL.md body edit; the only SKILL.md obligation is the REQ-005 version line, covered by R3-P1-001. Checked by grep over `SKILL.md` ("divergence ratchet", "holdout-independent", "golden-prompt-gate": no hits).

### Overlay — `agent_cross_runtime` — notApplicable

- No agent definition under `.pi/agents`, `.opencode/agents`, `.claude/agents`, `.codex/agents` references the changed test files or the workflow job; nothing pins expectations the change could break.

### Overlay — `feature_catalog_code` — notApplicable

- The skill's `feature-catalog.md` touches the holdout only via "Holdout top-1 accuracy | 77.5%" [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:39], and the commit changes no baseline/floor, so no catalog claim goes stale. Catalog truth for this phase is owned by phase 003-doc-and-catalog-truth and is outside the frozen Files to Change.

### Overlay — `playbook_capability` — notApplicable

- `manual-testing-playbook.md` contains no parity-gate capability entry to update (grep over ratchet/divergence/golden-prompt/parity gate/holdout: no hits); same scope rationale as the catalog.

### Ruled out this iteration

- Commit scope drift (extra or missing files vs spec.md:80–82): ruled out by `--name-status`.
- Doc/code divergence in SKILL.md, feature catalog or playbook: ruled out — none of the three documents makes a claim about the two gates, and the spec freezes the file set.
- Cross-runtime agent reference drift: ruled out — no references to the changed paths in any agent directory.
- Stale spec evidence pointers: the spec's pre-change line citations (`ratchet:5/31/200`, `holdout:92/108`, `workflow:268`) were probed at HEAD; they land in the same regions they named (header, imports, surface declarations) because the change appends rather than thins those regions. Research-time pointers, not content claims — no reader is misled.

---

## SCOPE VIOLATIONS

None. The review needed no out-of-scope mutation; all writes are confined to the run's state files.

---

## Verdict

**CONDITIONAL** — one P1 (missing skill version bump/changelog, verified by the packet's own executable completion check), one P2 (packet evidence artifact still the template), no P0. The commit itself is faithful to the spec's code scope and implements R1/R3/R5/R8; the required fix is additive and small. Per the iteration contract: any P1 (no P0) → `Review verdict: CONDITIONAL`.

## Next Dimension

maintainability (iteration 4 of 5).

Review verdict: CONDITIONAL
