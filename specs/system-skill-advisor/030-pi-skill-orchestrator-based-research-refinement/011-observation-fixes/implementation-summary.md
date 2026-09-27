---
title: "Implementation Summary: Fixing the Phase 10 Observations"
description: "A phase appended to an existing parent is now named by its own number, and 24 scaffold labels, most of them wrongly numbered, now carry a real description or the right number. The rest of phase 10's list is closed too, from the drift-guard docs to the Dependabot alerts."
trigger_phrases:
  - "phase 10 observations summary"
  - "appended phase numbering fix"
  - "wrong phase label"
  - "drift guard count fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes"
    last_updated_at: "2026-09-27T14:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Proved the parent goal's six criteria again from the final state"
    next_safe_action: "None. The phase is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts"
      - ".skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md"
      - ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-27-030-phase-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Fixing the Phase 10 Observations

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-observation-fixes |
| **Completed** | 2026-09-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A phase appended to a parent that already has phases is now named by its own number. Before, `create.sh` named it by its position in one run, so phases 5 and 7 to 11 of this packet all read `Phase 1:`. Eighteen folders in other packets carried the same kind of scaffold label. The rest of phase 10's list is closed as well: the drift-guard docs, the advisor's unused import and punctuation, the metrics log modes and the Dependabot alerts.

### Phase 11: observation-fixes

**An appended phase is named by its number (O4).** `create.sh` built each child's `Phase N:` text from its position in one invocation. A phase appended to an existing parent was therefore named Phase 1 in its graph summary, its description and its scaffold headings. It now uses the phase number the folder name already carries. A new test appends a third phase to a parent with two and expects `Phase 3: third-step`. Against the committed script it fails with `Phase 1: third-step`.

The labels the bug had already written were rebuilt too. Phases 5 and 7 to 11 of this packet got descriptions built from their `spec.md`. So did 18 folders in other packets: the thirteen `Phase 1:` labels the operator approved and five more that the final-state check found, where a run that appended three or four phases had numbered them 2, 3 or 4. Seven of the 18 have a `spec.md` that was never written, so they got the numbered label the fixed script writes, such as `Phase 22: source-capabilities-and-structured-preference`. Every rebuilt file kept its `specFolder`, `parentChain` and `specId`.

**The drift-guard docs count two guards (O1).** The sk-code-opencode wrapper runs two drift guards and prints `all 2 guards PASSED`. Its header, `SKILL.md`, both READMEs, the verification playbook scenario and the alignment reference still described three, or named the deleted router-sync suite as live. Each now names the two live guards. The alignment reference also records that the router-sync suite went with the skill-benchmark lane, and it names what tests the bijection module now. The Hermes mirror of `SKILL.md` was rebuilt into a scratch folder and only that file was copied back, so another session's pending `sk-create-changelog` change stayed out of the mirror.

**Advisor hygiene (O2, O3).** The CLI fallback no longer imports the unused `AdvisorHookStatus` type. Two comments, one in the fallback and one at `metrics.ts:238`, lost their em dash. Three doc passages, in the `advisor-recommend` and `opencode-plugin-bridge` feature entries and in `skill-advisor-hook.md`, now hold no em dash, semicolon or serial comma. The advisor dist was rebuilt right after the TypeScript edits, so its CLI never refused a stale build.

**Private metrics logs (O7).** Of the 53 advisor metrics logs, 46 predated phase 10's private-mode fix and kept mode 0644. Each is now 0600, and `evidence/metrics-log-modes.txt` lists every changed file for rollback. The directory was already 0700, so no other user could have opened them. A log written after the change was created at 0600.

**Dependabot alerts dismissed (O5).** On the operator's yes, the six alerts were dismissed as `not_used`, each with a comment naming its vendored snapshot. Five sit in the `supercov-main` lock file under cli-jev and one in the `orca-main` Gemfile lock under cli-orca. Nothing installs or runs either snapshot. The open count reads 0, and `evidence/dependabot-dismissals.txt` holds each number and the command that reopens it.

**O6 was never a defect.** `advisor-tool-schemas.ts:293` bounds `maxMetadataFiles` with a literal `10_000`, which phase 10 took for the prompt limit. It caps how many metadata files one status call may scan, and `advisor-status.ts:34` defaults it to 5,000. No code changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-spec-kit/runtime/cli/spec/create.sh` | Modified | Names an appended child by its phase number |
| `system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modified | The appended-phase test |
| `sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modified | The header names the two live guards |
| `SKILL.md`, `README.md`, `scripts/README.md`, `manual-testing-playbook/authoring-verification/verification-alignment.md` and `references/shared/alignment-verification-automation.md` under `sk-code/sk-code-opencode/` | Modified | Describe the two guards and the deleted suite |
| `.hermes/skills/sk-code-opencode/SKILL.md` | Modified | The rebuilt mirror |
| `system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modified | Drops the unused import and a comment's em dash |
| `system-skill-advisor/runtime/lib/metrics.ts` | Modified | One comment loses its em dash |
| `feature-catalog/cli-surface/advisor-recommend.md`, `feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md` and `hooks/skill-advisor-hook.md` under `system-skill-advisor/` | Modified | Follow the voice rules |
| `description.json` in phases 005, 007, 008, 009, 010 and 011 | Modified | Built from each `spec.md` |
| `description.json` in the 18 folders listed below | Modified | Built from each `spec.md`, or numbered where it was never written |
| `../spec.md`, `../graph-metadata.json` and `../goal.md` | Modified | The phase 11 row, the child list and the log |
| `evidence/` | Created | Validation, log-mode and Dependabot records, plus the parent goal's proof under `goal-reverify/` |

Paths in the first eight rows sit under `.skilled/skills/` unless they start with `.hermes/`.

The 18 folders, under `specs/`:

- `cli-external-orchestration/071-cli-hermes-creation/013-close-silent-preflight-holes`
- `cli-external-orchestration/071-cli-hermes-creation/016-dispatch-enforcement-ci-guard`, found at final state
- `cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin`
- `sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/001-source-audit`
- `system-speckit/033-system-speckit-v4/038-goal-unification/009-close-open-decisions`
- `system-speckit/033-system-speckit-v4/038-goal-unification/011-goal-drift-remediation`, numbered
- `system-speckit/033-system-speckit-v4/` children `045-v4-changelog-voice-rewrite`, `046-v4-changelog-remediation`, `047-v4-changelog-review-fixes`, `048-gate-3-mutation-time-delivery`, `049-gate-3-delivery-residue` and `050-ci-cleanup-pi-proof`
- `system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/phase-quarantine/` children `021` to `026`, all numbered. The final-state check found `022`, `023`, `025` and `026`
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator confirmed each observation in code or data at `eaa02a56f5` and recorded the baselines before any edit. It then made each fix itself and ran that fix's own check before starting the next one. The `create.sh` change went test first: the new test failed against the committed script, and the fix turned it green.

That departed from the parent's frozen D1, which gives code fixes to Grok 4.7 through cli-cursor and their verification to GPT-6 Luna through cli-codex. The plan named the choice, but the operator was not asked before the edits. To keep D1's verification half, one GPT-6 Luna max fast run through cli-codex checked the five code files after they were written. It returned PASS with high confidence. Its reverse check put the committed `create.sh` back, saw the new test fail with `Phase 1: third-step` and restored the fix byte for byte. The close-out report proposed a D1 amendment for edits this small, and the operator adopted it the same day. This phase's goal was written then, because the amendment workflow requires the parent to bind every phase.

The operator answered two questions in one prompt: dismiss the six Dependabot alerts and rebuild the thirteen placeholder labels in other packets. Five more labels from the same bug turned up in the final-state check. They went into `spec.md` under this phase's scope rule before they were touched, and the close-out report names them for the operator.

After the amendment the operator set the parent goal again, so the orchestrator proved its six criteria once more from the final state. Phases 10 and 11 had changed advisor code after phase 9's 45 scenario reruns. Each of the nine scenarios ran again in all five CLIs, two dispatches at a time as in phase 9. Two runs came back BLOCKED for reasons inside the tester and passed when rerun. The Codex tester wrapped a step in a `timeout` binary this machine lacks and never read the log it had captured. The OpenCode tester reported a plan-mode reminder that OpenCode's own log shows it never received. `evidence/goal-reverify/harness-notes.txt` records the layout, the two brief changes and four observations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Number a child from `PHASE_START_INDEX`, not from its position in the run | The folder name already uses that number, so the text and the folder now agree for a new parent and in append mode |
| Keep `_i` for the predecessor and successor links | Those links follow the order within one run, which the fix does not change |
| Give a never-written `spec.md` a numbered label instead of generated text | The generator would copy the template's placeholder sentence into the description |
| Leave the seven containment copies alone | Each is a frozen record of a file at capture time, so changing one would falsify the record |
| Rebuild the Hermes mirror into a scratch folder | A full rebuild would also have written another session's pending `sk-create-changelog` change |
| Leave the three older em dashes in `metrics.ts` | Phase 10 flagged only line 238, and sk-code carries no punctuation rule for code comments |
| Dismiss the alerts as `not_used` | `.github/dependabot.yml` scopes Dependabot to runtime roots, and nothing installs or runs either vendored snapshot |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `create-root-numbering.vitest.ts` against the committed script | FAIL as intended, `expected 'Phase 1: third-step' to be 'Phase 3: third-step'` |
| The same test after the fix | PASS, 6 of 6. The baseline was 5 of 5 |
| The nine create test files | PASS, 68 passed and 1 skipped |
| GPT-6 Luna verifier through cli-codex, five code files | PASS, confidence HIGH, 579 seconds. The reverse check reproduced the failure, and the restored `create.sh` hash matched |
| Advisor typecheck | PASS, exit 0 |
| Advisor suite (`npx vitest run`, final state) | PASS, 129 files, 971 passed and 6 skipped, the same as the `eaa02a56f5` baseline |
| Advisor build and `advisor_status` | PASS, the CLI accepts the rebuilt dist and reports live |
| Drift-guard wrapper | PASS, exit 0 and `all 2 guards PASSED` |
| Residue grep for three-guard claims | PASS, every router-sync mention left is a retirement note |
| sk-doc validator on the eight edited docs | PASS, 0 issues on each |
| Hermes mirror `--check` | PASS for `sk-code-opencode`. The one drift left is the other session's `sk-create-changelog` |
| Word diff of the edited docs and comments | PASS, no em dash added |
| Phase labels, final state | PASS. None of the 4,429 descriptions outside the containment copies names a number other than its folder's |
| Strict validation of the 13 approved folders | Matches the baseline: 10 PASSED, and 3 scratch folders FAILED before and after. The two quarantine folders each lost one warning (`evidence/validate-other-folders.txt`) |
| Strict validation of the five found at final state | Matches the baseline: 016 PASSED, and the four quarantine folders FAILED before and after with one warning fewer each (`evidence/validate-five-more-folders.txt`) |
| Metrics log modes | PASS. All 53 logs were at 0600 after the change, and a log written since was created at 0600 |
| Dependabot open alerts | PASS, 0 open after the six dismissals |
| Parent goal: OpenCode plugin live load, before and after the matrix | PASS. `opencode run --print-logs` exits 0 with no `failed to load plugin` line, and the session lists `spec_kit_skill_advisor_status` |
| Parent goal: the four suites, before and after the matrix | PASS each time. Advisor 129 files with 971 passed and 6 skipped. Spec-kit hook files 237 passed and 7 skipped, with the Copilot file skipping itself because this checkout ships no Copilot hook. Pi dispatch 50 of 50. Plugin 35 of 35 |
| Parent goal: sandboxed daemon (`evidence/goal-reverify/sandbox-daemon-live-state.txt`) | PASS. A sandbox cold start answered live, and the live generation file, the live lease and the live generation were unchanged across it |
| Parent goal: 45 scenario runs (`evidence/goal-reverify/ledger.tsv`) | PASS, 45 of 45 after two reruns. Codex CL-005 and OpenCode CP-004 first came back BLOCKED for tester reasons (`excluded-windows.tsv`). The native `Advisor:` line was live in every Codex, OpenCode and Pi run and in 8 of 9 Devin runs. The ninth failed open under load, and Cursor showed none, its known host limit |
| Parent goal: `install-codex-hooks.mjs --check`, before and after the matrix | PASS, `install-codex-hooks: OK ~/.codex/hooks.json` |
| Repository writes by the testers | None outside the evidence folder. The only other working-tree changes during the matrix were another session's 1,965 changelog files |
| `validate.sh --strict --recursive` on packet 030 | PASS, `RESULT: PASSED` for all 12 folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Descriptions in 39 other folders hold the template's placeholder sentence.** Each held it at `eaa02a56f5`, none carries a phase number and this phase touched none of them. Rebuilding them from each `spec.md` would clear the ones whose spec was written.
2. **`033-system-speckit-v4/038-goal-unification/011-goal-drift-remediation` is an unwritten scaffold that validates.** Its `spec.md` was never written, yet strict validation passes it. It now carries the numbered label, and its docs are still template text.
3. **Seven scratch folders still fail strict validation.** The six quarantine folders and the `001-source-audit` fixture under sk-doc/060 failed before this phase because their spec docs were never written. This phase changed only their labels.
4. **Seven containment copies keep an old `Phase 1:` label.** They are frozen records under deep-loop lineage folders and stay as captured.
<!-- /ANCHOR:limitations -->

---
