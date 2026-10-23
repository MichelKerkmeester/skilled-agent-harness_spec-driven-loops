---
title: "Tasks: Phase 5: leak-and-routing-verification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "leak and routing verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: leak-and-routing-verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Every task names one file, the anchor it reads or edits, the exact edit, its writer branch and its proof command. A task is done only when its proof command has been run and its output is quoted in the file the task writes. Every evidence path below is packet-relative and written out in full under `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`. Run the tasks in order: T003 needs T002's commit pushed, T007 needs the CI rebuild that follows it, and T017 is the final commit that carries the evidence and the closed packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the phase order and the baselines (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md` (create)
  - **Anchor**: no repository line is edited; the task reads `git log`, `git ls-files` and the tool versions
  - **Edit**: run `mkdir -p specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence`, then write a short table with the command, its output and the expected value for each of these five checks: `git log --oneline -3`; `git ls-files .skilled/skills/sk-code | grep -c -E "sk-code-(webflow|obsidian)"`; `git ls-files | grep -c -E "local-(webflow|obsidian)"`; `gh auth status`; `sqlite3 --version` and `jq --version`. Then copy the four `42b41dd286` baselines from `plan.md` step 0 (336, 1528, 200, 1) into a second table.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `git ls-files .skilled/skills/sk-code | grep -c -E "sk-code-(webflow|obsidian)"` prints `0`, and `git ls-files | grep -c -E "local-(webflow|obsidian)"` prints `0`. A non-zero value means an earlier phase did not land, so stop and report it.

- [ ] T002 Sweep the phase commit before pushing (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md` (create)
  - **Anchor**: the tracked tree at `HEAD`; no line is edited
  - **Edit**: quote all three commands and their output. First `git ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"`, expected no output. Second `git grep -n -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l`, expected `0`. Third, the bare-token sweep over both sk-code trees: `rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l`, expected `0`. The `grep -v 'WEBFLOW:'` stage is the kept list phase 2 keeps: the comment-hygiene platform tag lines in `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`, the allowed-token list in `sk-code-quality/scripts/check-comment-hygiene.sh` and the tag row in `shared/references/universal/code-style-guide.md`; the two globs keep the dated `changelog/` and `benchmark/reports/` records. Every other `WEBFLOW` or `OBSIDIAN` occurrence in either tree is a leak, because the tokens name the surfaces this packet removes. The filter is line-level, so a line that carries the tag form is excused whole: quote every line the filter removed, and name any of them that is a surface instruction rather than a tag as a leak the filter would otherwise hide. Note that `specs/` is excluded on purpose, because this packet's own documents name the surfaces.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `git grep -n -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*' | wc -l` prints `0`, and the third command prints `0`. A non-zero value is fixed before the push by the phase that owns the file; this phase never edits outside its own folder.

- [ ] T003 Commit, push and clone `origin/main` (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md` (create)
  - **Anchor**: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` `gitIgnoredPaths` at line 200 is the reason the index honours D2 without a code change; quote that line number as the recorded reason, not as an edit
  - **Edit**: commit the packet documents on branch `deepseekpihigh` (stage files by name, prose body in the message), push `HEAD:main`, then run `rm -rf /tmp/psurf-clone-main`, `git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git /tmp/psurf-clone-main`, and quote `git -C /tmp/psurf-clone-main rev-parse HEAD` plus `git -C /tmp/psurf-clone-main status --porcelain`. The evidence files do not exist yet at this point, so T017 commits them and pushes again; this commit carries the packet plan only.
  - **Branch**: `deepseekpihigh`
  - **Proof**: the clone HEAD equals the pushed phase commit, and `git -C /tmp/psurf-clone-main status --porcelain` prints nothing.

- [ ] T004 Sweep the fresh clone for leaked paths and content (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` (create)
  - **Anchor**: the clone's tracked tree; no line is edited
  - **Edit**: quote `git -C /tmp/psurf-clone-main ls-files | grep -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)"` (expected no output) and `git -C /tmp/psurf-clone-main grep -l -E "sk-code-(webflow|obsidian)|local-(webflow|obsidian)" -- ':!specs' ':!*/changelog/*' ':!.skilled/changelog' ':!*/benchmark/reports/*'`. Then list every printed path under one of the two D6 prefixes from `plan.md` step 3, and name any path outside them as a leak. Third, run the same bare-token sweep T002 runs, inside the clone: `rg -n 'WEBFLOW|OBSIDIAN' /tmp/psurf-clone-main/.skilled/skills/sk-code /tmp/psurf-clone-main/.hermes/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | grep -v 'WEBFLOW:' | wc -l`, expected `0`, with the same kept list as T002: the `WEBFLOW:` comment-hygiene platform tag lines and the dated `changelog/` and `benchmark/reports/` records. Quote every line the `grep -v` stage removed, and name any surface instruction among them as a leak the line-level filter hides.
  - **Branch**: `deepseekpihigh`
  - **Proof**: the first command prints nothing, every path from the second starts with `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` or `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/`, and the third prints `0`.

- [ ] T005 Prove the D6 kept records are unchanged (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md` (create)
  - **Anchor**: `fusion.ts` lines 600-602, `explicit.ts` line 131 and `skill_advisor.py` line 2181 are the kept Webflow CMS vocabulary; the task reads them and edits nothing
  - **Edit**: run the ten-path `git -C /tmp/psurf-clone-main diff --stat 42b41dd286 HEAD -- ...` command from `plan.md` step 4, quote its output, and note that empty output means unchanged. Record that the phase routes a non-empty diff to the phase that owns the file instead of repairing it.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `git -C /tmp/psurf-clone-main diff --stat 42b41dd286 HEAD -- <the ten paths>` prints nothing and exits `0`.

- [ ] T006 Build a throwaway advisor database from the clone (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md` (create)
  - **Anchor**: `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` `resolveSkillGraphDbDir` at line 271 reads `SYSTEM_SKILL_ADVISOR_DB_DIR`; `.skilled/skills/system-skill-advisor/runtime/database/.gitignore` holds `*.sqlite`
  - **Edit**: run `rm -rf /tmp/psurf-db && mkdir -p /tmp/psurf-db`, then `SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/psurf-db node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true,"workspaceRoot":"/tmp/psurf-clone-main"}' --format json | jq -r '.data.skillCount, (.data.summary.warnings // [] | .[])`. Then run the sk-code-family `sqlite3 -readonly` query from `plan.md` step 5 and quote `count(*)`.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `skillCount` is greater than `0`, no `EMPTY-SKILL-SCAN` warning appears, and the query prints `0`. A `0` produced by a zero-skill rebuild is a failure, because the rebuild then preserved the previous graph.

- [ ] T007 Count the trigger index after the CI rebuild (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` (create)
  - **Anchor**: `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`; it carries 200 matching lines at `42b41dd286`
  - **Edit**: poll `gh run list --branch main --limit 5 --json status,conclusion,headSha,displayTitle` for at most 30 minutes until a `chore(system-spec-kit): rebuild the trigger index` run completes above the phase commit, then `git -C /tmp/psurf-clone-main pull --ff-only`, quote `git log --oneline -3`, and run `grep -c -E "local-(webflow|obsidian)|sk-code-(webflow|obsidian)" /tmp/psurf-clone-main/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `grep -c` prints `0` and the rebuild commit is visible in the clone's log. Past 30 minutes, record the last `gh run list` output and mark the task blocked.

- [ ] T008 Probe the three local routes (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` (create)
  - **Anchor**: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` lines 37-39, where phase 003 removes the `'obsidian plugin'` token from the `'sk-code'` array; this task reads the file to confirm the token is gone and edits nothing
  - **Edit**: in the operator's main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` (phase 004 creates the private skills there, and they are gitignored so they exist on no other checkout), run `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json`, then `sqlite3 -readonly .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id"`, then the three `advisor_recommend` probes from `plan.md` step 7 with `jq -r '.data.recommendations[0].skillId'`. Quote each result and record `ls -ld` for both private skill paths plus which folder mode the operator chose.
  - **Branch**: `deepseekpihigh`
  - **Proof**: the node query lists `local-obsidian` and `local-webflow`, and the three probes print `local-webflow`, `local-obsidian`, `sk-code` in that order. A wrong top result is recorded and routed to phase 004, never repaired here.

- [ ] T009 Prove the private skills are invisible to git (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md` (create)
  - **Anchor**: the root `.gitignore` rules `/.skilled/skills/local-*` and `/.hermes/skills/local-*` (D2, no trailing slash so a symlink matches too)
  - **Edit**: in the operator's main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, where the private skills sit on disk, run `git status --porcelain | grep -E "local-(webflow|obsidian)"` and `git check-ignore -v .skilled/skills/local-webflow .hermes/skills/local-obsidian`, quote both outputs, and note that `git check-ignore` evaluates the patterns whether or not the path exists.
  - **Branch**: `deepseekpihigh`
  - **Proof**: the first command prints nothing and the second prints two lines naming the root `.gitignore` rules.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Record CI on `main` (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md` (create)
  - **Anchor**: no repository line; the task reads GitHub Actions
  - **Edit**: run `gh run list --branch main --limit 10 --json status,conclusion,headSha | jq -r '.[] | "\(.status)/\(.conclusion)"' | sort | uniq -c`, quote the output, and record the head sha each run belongs to. The file also states the one limit this record carries: it covers every run on `main` up to the push that carries it, and the runs of that push cannot appear in it, because a commit cannot contain the CI result of the push that creates it. Those runs are reported in the phase handoff message with their run ids and head sha.
  - **Branch**: `deepseekpihigh`
  - **Proof**: every line is `completed/success` or `completed/skipped`; no `failure`, `cancelled` or `timed_out` appears, and the file names the phase handoff message as the place the evidence push's own runs are recorded.

- [ ] T011 Transcribe the evidence into the implementation summary (implementation-summary.md)
  - **File**: `implementation-summary.md` (modify)
  - **Anchor**: read the file and locate `[Opening hook: 2-3 sentences on what changed and why it matters. Lead with impact.]`, `[What this feature does and why it exists. 1-2 paragraphs. Use direct address.`, `| [path] | [Created/Modified/Deleted] | [What this change accomplishes] |`, `[How was this tested, verified and shipped? What was the rollout approach?]`, `| [What was decided] | [Active-voice rationale with specific reasoning] |`, `| [Validation, lint, tests, manual check] | [PASS/FAIL with specifics] |` and `1. **[Limitation]** [Specific detail with workaround if one exists.]`
  - **Edit**: replace each quoted placeholder. The Files Changed table gets one row per evidence file with `Created`. Verification gets one row per check, each citing its `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/NN-*.md` path and the observed value. Known Limitations states the three recorded limits: removed content stays in git history (D7), `git commit --no-verify` bypasses the pre-commit guard so the fresh-clone sweep carries the proof, and the CI runs of the evidence push itself are not committed because a commit cannot contain the result of the push that creates it, so those runs are reported in the phase handoff message with their run ids. Keep every heading and anchor in the file.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `grep -c "specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/" implementation-summary.md` prints at least `11`, and `grep -n "no-verify" implementation-summary.md` prints at least one line.

- [ ] T012 Reviewer round on a separate read-only session (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` (create)
  - **Anchor**: the reviewer reads `acceptance-criteria.md`, the eleven evidence files and `implementation-summary.md`; it edits nothing
  - **Edit**: dispatch a separate read-only DeepSeek reviewer session on branch `deepseekpi` with the packet path and the instruction to re-run each criterion's command and compare the output with the quoted value. At most 2 rounds. Record a verdict table with one row per AC-ID (`| AC-001 | Met/Unmet | the output the reviewer saw |`) and a findings table with one row per finding (`| F-001 | P0/P1/P2 | AC-ID | the finding | the resolution | round |`).
  - **Branch**: `deepseekpi` (read-only reviewer; the writer records the outcome on `deepseekpihigh`)
  - **Proof**: `grep -c "^| AC-" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` prints `11`, and no round beyond the second is recorded.

- [ ] T013 Answer the reviewer findings (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` (modify)
  - **Anchor**: read the file and locate the findings table written by T012
  - **Edit**: for each finding, either re-run the command and correct the quoted output and the criterion status, or record why the finding does not hold. A finding about a file outside this folder is recorded and routed to the owning phase, not repaired here. Append the round number to each entry. Stop after 2 rounds.
  - **Branch**: `deepseekpihigh`
  - **Proof**: every row of the findings table has a resolution cell, and `grep -c "^| F-" specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` equals the number of findings the reviewer raised.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Mark the criteria from the evidence (acceptance-criteria.md)
  - **File**: `acceptance-criteria.md` (modify)
  - **Anchor**: read the file and locate the row beginning `| AC-001 | REQ-001 |` and the rows through `| AC-011 | REQ-011 |`, the `**Status:** Draft` line, and `**Closeable:** No`
  - **Edit**: set each AC row's Status cell to `Met` with the observed value quoted in the Verification cell, or leave it `Unmet` and name the blocking command. Then replace the closure statement paragraph with which criteria carried the packet and which checks are left blocked. Change `**Closeable:** No` to `**Closeable:** Yes` only when every row is `Met`.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `grep -c "| Unmet |" acceptance-criteria.md` prints `0` when the packet is closeable; a non-zero count keeps `Closeable: No`.

- [ ] T015 Reconcile the completion status (spec.md)
  - **File**: `spec.md` (modify)
  - **Anchor**: read the file and locate the metadata row `| **Status** | Draft |` and the `**Status:** Draft` line in `acceptance-criteria.md`
  - **Edit**: set `spec.md` `Status` to `Complete` and `acceptance-criteria.md` `Status` to `Complete`, and add a `| **Status** | Complete |` row to the `implementation-summary.md` metadata table, so the three documents agree. If any AC row is `Unmet`, change nothing here and report blocked instead.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `grep -n "Status" spec.md acceptance-criteria.md implementation-summary.md` shows `Complete` in all three, and `git diff --stat` lists no file outside this folder.

- [ ] T016 Run the packet validator (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification)
  - **File**: the four documents edited above (modify only what the validator names)
  - **Anchor**: read the validator output line by line; each failing rule names its file
  - **Edit**: run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification --strict` and fix only what it names, keeping every template heading, anchor comment and frontmatter key. Re-run until it passes.
  - **Branch**: `deepseekpihigh`
  - **Proof**: the command prints `RESULT: PASSED`. Require that exact line: an exit status of `0` and the absence of `FAILED` are not a substitute.

- [ ] T017 Commit and push the evidence and the closed packet (specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence, implementation-summary.md, acceptance-criteria.md, spec.md)
  - **File**: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/` (the eleven files T001-T013 wrote), `implementation-summary.md`, `acceptance-criteria.md` and `spec.md` (commit only)
  - **Anchor**: no line is edited; the task stages the files the tasks above wrote, and the evidence directory holds nothing but those eleven files
  - **Edit**: stage the evidence directory and the three packet documents by name - `git add specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/implementation-summary.md specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md` - never `git add -A`. Commit on `deepseekpihigh` with a prose body saying the evidence and the closed packet are added and no code changes, then push `HEAD:main`. T003 pushed a commit that predates the evidence, so this is the commit a reader can actually re-run. Nothing is appended to `09-ci.md` after the push: the committed evidence covers every run up to this push, and the runs of this push are reported in the phase handoff message with their run ids and head sha instead, because a commit cannot carry the CI result of the push that creates it. That gap is recorded as a known limit in `09-ci.md` and `implementation-summary.md`, not papered over.
  - **Branch**: `deepseekpihigh`
  - **Proof**: `git status --porcelain` prints nothing, `git rev-parse HEAD` equals `git rev-parse origin/main` after `git fetch origin main`, and the committed `09-ci.md` block shows only `completed/success` or `completed/skipped` for the runs it covers. A red run on this sha, observed in the handoff report, leaves REQ-007 `Unmet`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] `scratch/` holds only the evidence record - no temporary working file remains
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---

