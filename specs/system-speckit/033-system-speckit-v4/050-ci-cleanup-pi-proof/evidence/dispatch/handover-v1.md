# Handover: Phase 050 CI Cleanup and Pi Gate-3 Proof

**Prepared:** 2026-09-22
**Packet:** `specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof`
**Worktree:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/061-ci-cleanup-pi-proof`
**Branch:** `worktrees/061-ci-cleanup-pi-proof`
**HEAD:** `1cc5dfa692dd3537754d6e614791671509d5d18e`
**Status:** Handover only. The Build plan remains open. No completion claim is made.

## 1. Current objective

Finish Phase 050, `ci-cleanup-pi-proof`, without disturbing the unrelated work in the primary checkout. The phase has four linked outcomes:

1. Prove the Pi Gate-3 contract in a real headless run and a fresh TUI run.
2. Repair the six approved CI failure surfaces or document failures owned by another session.
3. Author and validate the packet evidence, then reconcile the parent packet records.
4. Commit, merge, align the release branch, push, watch CI and remove the temporary worktree only after the final checks pass.

The approved scope does not include re-minting the `sk-design` or `sk-doc` routing hubs. It also does not include fixing the two Markdown links whose targets belong to the other session's untracked routing packet.

## 2. Confirmed completed work

### Pi headless contract

The authorized parent-mode `cli-pi` probe ran from the phase worktree with stdin closed, `--offline`, a provider-qualified model and the child exemption disabled so the parent-mode classifier could observe deferral.

The probe returned:

- Process result: `pi_rc=0`
- Stdout: exactly `HEADLESS PROBE ACK`
- Delivery marker: `status=open`
- Delivery channel: `classify-deferral`
- Delivery count: `1`
- Runtime state residue after cleanup: none
- `docs/hermes-notes.md`: absent

The probe also wrote a fallback warning to stderr:

```text
CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out
```

That warning is recorded as a provider fallback risk. It did not change the required stdout response or the delivery marker.

The exact probe shape was:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/061-ci-cleanup-pi-proof || exit 9
set +e
env -u SYSTEM_SPEC_FOLDER -u SYSTEM_SPEC_GATE_DISABLED AI_SESSION_CHILD=0 SYSTEM_SPEC_GATE_ENFORCE=0 PI_BLACKHOLE_PASSIVE=true pi -p --offline --no-session --no-context-files --no-skills --no-prompt-templates --thinking low --model llmgateway/glm-5.3-flash 'GATE 3 IS PRE-RESOLVED FOR THIS PARENT-MODE EXTENSION PROBE. Do not ask the documentation-scope question. This is a non-interactive parent-mode probe. AI_SESSION_CHILD=0 is intentional so this run can observe classify-deferral. The file work happens in a later turn; later I will ask you to create docs/hermes-notes.md and edit README.md. Return exactly HEADLESS PROBE ACK.' </dev/null > specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/scratch/pi-headless-stdout.txt 2> specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/scratch/pi-headless-stderr.txt
```

The focused verification was:

```bash
test -f specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/scratch/pi-headless-delivery-marker.json
test "$(node -e 'const x=require("./specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/scratch/pi-headless-delivery-marker.json"); process.exit(x.questionDeliveredChannel === "classify-deferral" && x.questionDeliveredCount === 1 && x.status === "open" ? 0 : 1)')" = ''
test "$(grep -c '^HEADLESS PROBE ACK$' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/scratch/pi-headless-stdout.txt)" = 1
test ! -e docs/hermes-notes.md
test "$(ls .skilled/skills/.state/spec-gate/*.json 2>/dev/null | wc -l | tr -d ' ')" = 0
```

That check returned:

```text
headless-marker=classify-deferral count=1
headless-response=HEADLESS PROBE ACK
runtime-state-residue=none
```

### Pi TUI contract

The retained TUI captures establish the interactive path:

- `scratch/pi-tui-select.txt` captures the Gate-3 select surface.
- `scratch/pi-tui-input.txt` captures the spec-folder path input surface.
- `scratch/pi-tui-final.txt` captures the first-write refusal, the retry reason naming the bound path and the later successful edit.
- `scratch/pi-tui-state.json` records `status: satisfied` and the bound folder `specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof`.
- `scratch/pi-tui-warning.log` retains the runtime warning evidence from the session.

The first write was blocked once. The selected path was bound to the session. The retry passed. No second question was recorded for the later write. The reversible probe files and the temporary session state were removed after capture.

### CI repair work already applied

The worktree contains the following uncommitted repair classes:

- Regenerated the four drifted Hermes skill copies for `cli-hermes`, `cli-opencode`, `cli-pi` and `deep-ai-council`.
- Regenerated the compiled `deep-ai-council` command contract.
- Changed the 14 `cli-orca` reference frontmatter records to an accepted context type.
- Corrected `cli-orca` graph metadata and added reciprocal sibling edges in the affected graph files.
- Recaptured the routing scorer baseline at `1cc5dfa692`, preserving the live values rather than weakening the ratchet.
- Repointed four resolvable Markdown links, while retaining the two links owned by the other session.
- Corrected both hardcoded `.opencode/specs` paths in `recursive-child-manifest.vitest.ts` to the tracked `specs` tree.

## 3. Verification evidence

The following checks were run in worktree 061. Their outputs are the evidence available to the next operator.

### Hermes mirror and deep-loop contract checks

```bash
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check
```

Observed results:

- `PASS: 70 Hermes skill copies in sync`
- `PASS: 33 prompts are in sync`

```bash
./node_modules/.bin/vitest run --no-coverage tests/unit/check-contract-drift.vitest.ts tests/unit/render-command-contract.vitest.ts
```

Run from `.skilled/skills/system-deep-loop/runtime`. Observed result: 2 files and 42 tests passed.

The full Deep-Loop runtime suite was not established. Its earlier 900-second baseline timed out. The focused contract suite is the valid evidence currently available.

### Skill frontmatter and routing registry

```bash
bash .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh . --coverage
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only
```

Observed results:

- Frontmatter: 101 documents, 0 violations.
- Graph compiler: 15 metadata files discovered, 1 route-excluded file, validation passed.

```bash
npx --yes vitest@4.0.18 run tests/routing-registry-drift-guard.vitest.ts tests/routing-parity-deep-skills.vitest.ts tests/routing-parity-deep-council.vitest.ts tests/parity/scorer-eval-baseline-ratchet.vitest.ts
```

Run from `.skilled/skills/system-skill-advisor/runtime`. The focused routing run passed 4 files and 28 tests. The scorer-only rerun also passed 1 file and 7 tests.

The scorer baseline now records `full_corpus_top1` as 151/195 and `memory_save` as 26/32. This is a measured recapture at the current fix commit, not an assertion change.

### Spec-Kit CLI project

```bash
npx vitest run --config ../../vitest.config.ts --project cli
```

Run from `.skilled/skills/system-spec-kit/runtime/cli`. Observed result: 143 passed and 3 skipped test files, with 1441 passed and 19 skipped tests out of 1460.

### Derived freshness and Markdown links

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs
node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
```

Observed results:

- Derived freshness: 15 checked, 15 fresh, 0 stale, 0 errors.
- Markdown links: 7834 files and 13510 links checked, with 2 broken links remaining.

The two remaining links target the other session's untracked routing packet. They are intentionally deferred and must not be replaced with fabricated targets.

### Broader drift guard boundary

The broader `run-all-drift-guards.sh` run produced 9 errors that matched the pre-change baseline:

- 6 missing `set -uo pipefail` declarations.
- 2 missing `references/README.md` resources.
- 1 missing `assets/voice-report-template.md` resource.

Those errors are outside the Phase 050 repair set.

## 4. Remaining work

The following work is still open and blocks packet completion:

1. Replace the Phase 050 scaffold placeholders in `spec.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md` with the observed scope, evidence and honest status.
2. Record the Pi proof in the packet evidence, the Phase 048 implementation summary and the Phase 033 timeline.
3. Run repair-derived metadata after the packet documents are authored.
4. Run `validate.sh specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof --strict` and require an explicit `RESULT: PASSED`.
5. Run the packet completion checker and reconcile every acceptance row and verification checklist row.
6. Produce the approved commit and prove the merge against the unrelated dirty set.
7. Align the required branches, push only through the approved guarded flow, watch the resulting CI and remove the temporary worktree only after the final state is verified.

No packet commit, merge, push or worktree removal has been performed for the Phase 050 changes.

## 5. Known boundaries and exclusions

- The two remaining Markdown links belong to the other session's untracked `sk-doc` routing packet. Leave them deferred.
- Do not re-mint `sk-design` or `sk-doc` routing hubs. Their working-tree bytes belong to the other session.
- Do not reset, stash, rebase or clean the primary checkout. It currently has 48 status entries, is on local `main` at `2c8f243607f249afdeefc7b1aadbfffb8f2a91a` and has unrelated in-flight work.
- The primary checkout's `origin/main` and `origin/skilled/v4.0.0.0` both currently resolve to `377a22e1a90436b403a13b847295604e8977a1bf`. Treat those refs as external state, not as permission to rewrite the primary checkout.
- The current Phase 050 worktree is based at `1cc5dfa692`. Its 29 tracked modifications are uncommitted and must be reviewed before any commit.
- No code comments were added by this handover. The comment-hygiene hard block remains active for all later edits.

## 6. Artifacts and residue

The packet scratch directory currently contains:

```text
.gitkeep
pi-headless-delivery-marker.json
pi-headless-stderr.txt
pi-headless-stdout.txt
pi-tui-final.txt
pi-tui-input.txt
pi-tui-select.txt
pi-tui-state.json
pi-tui-warning.log
```

These files are retained as proof artifacts. The following cleanup checks passed:

- `docs/gate3-probe.md` is absent.
- `docs/hermes-notes.md` is absent.
- The spec-gate state directory contains zero per-session JSON files.
- The reversible root `README.md` probe marker is absent from the worktree diff.

The packet directory, its scratch artifacts and `handover.md` are untracked because the packet has not yet been committed.

## 7. Risks

- The Pi provider fallback logged exit 75 during the successful headless run. Repeating the probe may reproduce that warning even when the marker contract passes.
- The TUI capture includes a tmux extended-keys warning. A future live drive may need tmux configuration before Enter key automation is trusted.
- The routing baseline changed from 152 to 151 full-corpus matches and from 27 to 26 memory-save matches. Keep the recapture evidence with the eventual commit and do not silently restore the old counts.
- The full Deep-Loop runtime suite has no completed baseline because the earlier run exceeded 900 seconds. Do not report the focused 42-test result as proof of the full suite.
- The primary checkout has changed since the earlier Gate-3 merge and remains dirty. Reconfirm the dirty path set immediately before merge or push.

## 8. Precise next action

Author the four canonical Phase 050 packet documents from this handover and the retained scratch evidence. Then run packet strict validation and the completion checker before touching commit, merge, push or worktree cleanup.
