# Iteration 003 — CI Workflows, the AGENTS.md Runtime Cut, and the Commit-Id Gate

## Focus

Iteration 3 of 10. Key questions 5 and 6, plus the open `sk-git` commit-id repro carried from iteration 2:

- Q5: do `.github/workflows` match the v4.0.0.16 CI note and `/doctor:ci` switch state, and does any workflow call a missing script?
- Q6: does `AGENTS.md` match `REPO RULES.md` and the `.skilled/repo-rules` files it routes, and does a runtime limit (Devin's 16,384-byte rule cut) truncate a binding rule?
- Carried: does a message carrying both `Commit-Id: 0000000` and a valid id get refused?

## Actions Taken

1. Enumerated `.github/workflows` (32 `.yml` files plus `README.md`) and scanned every `run:` block for `node`, `bash`, `sh` and `python3` script paths, then resolved the four relative hits against the `cd`/`working-directory` in their job.
2. Read the v4.0.0.16 CI section and the `/doctor:ci` contract (`.skilled/commands/doctor/ci.md`), the repository CI profile (`.skilled/skills/sk-code/sk-code-ci/repository/ci.json`), and the workflow README switch table; cross-checked each switch variable against the workflows that read it.
3. Measured `AGENTS.md` (`wc -c`), located byte 16,384 with a per-line byte-offset scan, and compared the cut point with the rule block Devin actually injected in this session.
4. Extracted every Markdown link from `AGENTS.md` and `REPO RULES.md` and checked existence; compared the root `repo-rules/` tree with `.skilled/repo-rules/` (`diff -rq`, `shasum`, `git log`).
5. Ran the commit-id repro in a throwaway directory under `/tmp` by sourcing `.skilled/scripts/git-hooks/lib/commit-id-policy.sh` and calling `cip_message_has_id` on placeholder-only, valid-only and placeholder-plus-valid messages.
6. Read `git log` for `AGENTS.md`, both rule trees, and workflow deletions since `f459b06479`.

No repository file was modified. Writes were confined to this run directory and the `/tmp` repro directory.

## Findings

### F-003-1 — Devin's 16,384-byte rule cut silently drops 40 percent of AGENTS.md, including all of §5 through §10 and the repository-specific block

- **Type:** bug (runtime rule truncation)
- **Severity:** P1
- **Evidence:** `AGENTS.md` is 27,587 bytes. [SOURCE: AGENTS.md:180] is the line that the 16,384-byte boundary falls inside: `head -c 16384 AGENTS.md | wc -l` returns 179 newlines and the truncated tail ends at `#### `, the heading `#### Execution Behavior` on line 180. In this session the injected rule block ended at exactly that point and carried `[Rule content truncated to 16384 bytes]`, so the loss is observed, not inferred.
- **Sections cut:** the remainder of §3 from line 180 (`#### Execution Behavior`, `### Quality & Restraint` at line 192), §5 `TOOLS, SEARCH & MCP ROUTING` [SOURCE: AGENTS.md:212], §6 `SPEC FOLDER DOCUMENTATION` [SOURCE: AGENTS.md:243], §7 `ESCALATION & CONFLICT` [SOURCE: AGENTS.md:261], §8 `COMMUNICATION QUALITY` [SOURCE: AGENTS.md:273], §9 `AGENT ROUTING` [SOURCE: AGENTS.md:279], §10 `QUICK REFERENCE` [SOURCE: AGENTS.md:285], and `REPOSITORY-SPECIFIC INSTRUCTIONS` [SOURCE: AGENTS.md:297].
- **Visible portion:** §1, §2 (all gates, including Gate 3), §4, and only the heading plus Blast-Radius Management of §3.
- **Release:** pre-existing at the baseline; still present at HEAD after the latest `AGENTS.md` edit `9d4edcbd3b` (2026-11-08), so no release in v4.0.0.0–v4.0.2.0 fixed it.
- **Confidence:** high (1.0, observed in the live rule injection and in the byte scan)
- **Verify:** `wc -c AGENTS.md` → `27587 AGENTS.md`; `head -c 16384 AGENTS.md | tail -c 45` → ends with `A §2 bound child is exempt.` then `#### `.
- **Impact:** a Devin session receives §2 but not the section that explains the spec-folder workflow, the escalation ladder, agent routing or this repository's own instructions. The cut is byte-based, so the misplaced §4 (F-003-2) survives while §3's remaining rules do not.

### F-003-2 — AGENTS.md numbers §4 before §3, so the file's order contradicts its own section numbers

- **Type:** drift (document structure)
- **Severity:** P2
- **Evidence:** `## 4. ✅ VERIFICATION & COMPLETION` is at [SOURCE: AGENTS.md:117]; `## 3. 🛠️ EXECUTION & QUALITY` is at [SOURCE: AGENTS.md:173]. The sequence runs 1, 2, 4, 3, 5, 6, 7, 8, 9, 10.
- **Release:** current HEAD; introduced or left in place by the latest `AGENTS.md` edit `9d4edcbd3b` (2026-11-08).
- **Confidence:** high (1.0, read)
- **Verify:** `rg -n '^## ' AGENTS.md` → `117:## 4.` precedes `173:## 3.`.
- **Impact:** the runtime cut at 16,384 bytes lands inside §3, so the file order decides which sections survive: the out-of-order §4 is delivered and the correctly numbered §3 is mostly lost. A reader following section numbers also jumps backward at line 173.

## Questions Answered

- **Q5 answered, clean.** 32 workflows exist. The v4.0.0.16 note's "33 workflows" describes the pre-release state; the note's own "two overlapping workflows are now one" accounts for 33 → 32, and `git log --diff-filter=D f459b06479..HEAD -- .github/workflows` shows no deletion after the tag. No workflow calls a missing script: the four relative paths my first scan flagged (`chart-corpus.yml:48`, `diagram-corpus.yml:48`, `diagram-corpus.yml:59`, `diagram-corpus.yml:62`, `routing-registry-drift.yml:350`) each run after a `cd` or under a `working-directory` that contains the script. [SOURCE: .github/workflows/chart-corpus.yml:47] switches to `.opencode/skills/sk-design/sk-design-chart` before `node scripts/check-corpus.cjs`. Switch state matches `/doctor:ci`: `ci.json` defines the master plus five groups [SOURCE: .skilled/skills/sk-code/sk-code-ci/repository/ci.json:11], exactly the five variables the workflows read, and only `dependabot-auto-merge.yml` lacks a switch — the one file `ci.json` exempts. `README.md`'s claim that every other job carries a condition holds. [SOURCE: .github/workflows/README.md:80]
- **Q6 answered, two findings.** All 13 rule files linked from `REPO RULES.md` and all 7 linked from `AGENTS.md` exist, and the 13-file set matches the directory exactly. The binding problem is the runtime cut (F-003-1), not a broken link. The root `repo-rules/` tree is byte-identical to `.skilled/repo-rules/` (`diff -rq` exit 0), so no rule text disagrees today.
- **Carried commit-id question answered.** A message carrying `Commit-Id: 0000000` plus a valid id is **accepted**. [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:55] returns true when any matching line is non-zero, so the placeholder line is ignored. Repro: `zero -> REFUSED`, `valid -> ACCEPTED`, `both -> ACCEPTED`.

## Ruled Out

- **Workflow calls a missing script.** False positive from a root-relative scan; all four paths resolve after their `cd`/`working-directory`.
- **33 vs 32 workflows is drift.** The note describes the pre-release count and the same release merged two workflows into one; no post-tag deletion.
- **Root `repo-rules/` duplicate is over-engineering.** Removal would break the "read either layout" compatibility introduced by `7a948d79b4` (2026-09-20). It is byte-identical today, so it is a maintenance watch item, not a defect.
- **Zero-plus-valid Commit-Id is a bug.** The policy's intent is that a real id satisfies the gate; the placeholder is a sentinel for "no id", not a contradiction. Accepting the pair is consistent with that intent.

## Questions Remaining

- Do the v4.0.0.15/v4.0.0.16 worktree behaviors (private `local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes? (Q4, still open.)
- Does the `hook_adapter_fallback_health_checks` battery resolve every listed path, and does the full workflow report a degraded adapter when one is missing?
- Does `pre-push` refuse a pushed non-merge commit without a Commit-Id, and does a wedged git call block with `BLOCKED [gate:git-timeout]` after 20 seconds? Code path present; no live timeout induced.
- Which of the 32 workflows would fail if `/doctor:ci` flipped its group switch, and does any workflow read a group variable its README row does not name?

## Next Focus

Iteration 4: the open half of Q4 (worktree behavior in v4.0.0.15/v4.0.0.16), the `hook_adapter_fallback_health_checks` battery, and the `pre-push` timeout path. F-003-1 should be re-checked against any runtime that documents a different rule-size limit, so the finding names every runtime affected, not only Devin.

## SCOPE VIOLATIONS

None. All writes landed in this run directory and the `/tmp` repro directory; no researched file was modified.
