# Phase 004 verification — playbook scenarios

Run by `@review` (LEAF verifier) on 2026-11-03 from the repository root
(`/Users/michelkerkmeester/worktrees/public/314-frontend-upstream-proposals`).
Every command below was executed in this session and its output and exit status read.
`rg` exit 1 means "no match", not an execution failure. Nothing was edited except this file.

Rows: AC-001..AC-007 from `acceptance-criteria.md`, plus X-01..X-04, the four extra checks in the brief.

| Row | Verdict | Command | Deciding output |
|---|---|---|---|
| AC-001 | MET | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook` | `PASS package=mcp-tooling/mcp-figma tier=FAIL_CLOSED scenarios=20 categories=7 operator=20 routing_gold_excluded=0 violations=0 warnings=2`; shell `exit=0` |
| AC-002 | MET | same validator with `--package .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook` | `PASS package=sk-design/sk-design-fundamentals tier=FAIL_CLOSED scenarios=14 categories=5 operator=14 routing_gold_excluded=0 violations=0 warnings=0`; shell `exit=0` (14 is inside the allowed 13-14) |
| AC-003 | MET | `rg -n "OVERALL VERDICT\|PASS 5 VERDICT" specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/scratch/check-run.txt` | `342:PASS 5 VERDICT: NOT RUN — reason: no screen reader available...` and `359:OVERALL VERDICT: INCOMPLETE.` |
| AC-004 | MET | `rg -n -i "barter" .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/ .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/profile-load/unknown-project.md .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/value-discipline/value-names-its-source.md` | no output; `rg_exit=1` (no match in any of the five new files) |
| AC-005 | MET | `cat scratch/skd-010-overlap.md` + `ls .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/value-discipline/` + read of `on-scale-values.md` (SKD-010), `conflict-handling/project-system-precedence.md` (SKD-020), `value-names-its-source.md` (SKD-013) | note says `Decision: **add it**, as value-discipline/value-names-its-source.md (SKD-013)`; `ls` prints `value-names-its-source.md`; file's `id: "SKD-013"` and title `Every value names its source`. Decision and reason match disk — see X-04 |
| AC-006 | MET | same mcp-figma validator run as AC-001 | `WARN HAND_TYPED_CENSUS manual-testing-playbook.md root contains a hand-typed census (20 scenarios, 7 categories); derived census is 20 scenarios across 7 categories` — equal |
| AC-007 | UNMET | `rg -n "figma-to-code.md\|profile"` on each of the five new files | hits per file: `check-built-screen.md -> hits=4`, `node-to-token-markup.md -> hits=4`, `token-drift.md -> hits=2`, `unknown-project.md -> hits=19`, `value-names-its-source.md -> hits=0`. The command the row names returns nothing for one of the five new scenarios, so the row's own evidence does not cover it. Case-insensitively the same file matches once (`53:Project Profile Slot`), but that is a precedence citation, not a file it exercises |
| X-01 | MET | `git status --short --untracked-files=all` | outside `specs/`: ` M` on the two root indexes (`mcp-figma/manual-testing-playbook.md`, `sk-design-fundamentals/manual-testing-playbook.md`) and `??` on exactly five new scenario files (`figma-to-code/check-built-screen.md`, `figma-to-code/node-to-token-markup.md`, `figma-to-code/token-drift.md`, `profile-load/unknown-project.md`, `value-discipline/value-names-its-source.md`). No other path outside `specs/`. `git diff --stat`: only those two indexes, 94 insertions, 9 deletions |
| X-02 | MET | `sed -n '1,7p'` for frontmatter keys and `grep -o '^#\{2,3\} ...'` on each new file against a sibling (`read-only/read-only-inspect.md` for mcp-figma, `value-discipline/on-scale-values.md` for fundamentals) | mcp-figma new files: `title, description, version` — same as sibling. Fundamentals new files: `title, description, stage, id, version` — same as sibling. Heading sequences are byte-identical to the sibling in both packages (`## 1. OVERVIEW` .. `## 5. SOURCE METADATA`, including `### Optional Supplemental Checks` and `### Implementation And Test Anchors` for mcp-figma, and `### Exact Command Sequence`..`### Failure Triage` for fundamentals) |
| X-03 | MET | `cat scratch/check-run.txt` + `rg -n "STAND-IN\|PASS 5 VERDICT\|OVERALL VERDICT"` + `rg -n -A3 "The overall result is" .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` | line 3 `FRAME READ USED A LOCAL STAND-IN: this machine has no Figma Desktop, so no live Figma read ran.`; 14 `^exit` status lines across the transcript; 342 Pass 5 `NOT RUN`; 359 `OVERALL VERDICT: INCOMPLETE.` The quoted rule exists verbatim at `figma-to-code.md:107` (`Record a pass that cannot run as NOT RUN ... the overall verdict is then INCOMPLETE, never PASS`), and the recorded verdict follows it. `bdg` 0.6.10, the tool the record claims, is installed here |
| X-04 | MET | `cat scratch/skd-010-overlap.md` compared against the three files it names | SKD-010 prompt is `What padding should this card have` (one spatial value from the spacing scale). SKD-020 prompt is `Our design system says 24px spacing, but you suggested 32px` (project value beats skill default). SKD-013 asks for spacing, radius and shadow at once, two from installed tokens and one from the shadow scale with the missing token stated, and requires every value to name its source. The stated gap is real: neither sibling tests multi-value provenance with a missing token, so SKD-013 is not a duplicate and "add it" is supported |

## Anything that looked wrong

1. **AC-007 fails as written, but the defect is in the criterion.** REQ-007 only covers
   `sk-code-frontend/references/figma-to-code.md` and the fundamentals profile slot, so a fifth
   scenario was outside the requirement's stated scope. The token-or-scale file does name the files
   it exercises (`SKILL.md`, `references/depth-and-detail.md`, `ROUTER.md`), and its
   `Project Profile Slot` citation is a precedence reference, not a probe for `profile`. Either widen
   the command (e.g. `rg -n "figma-to-code\.md|Project Profile Slot|depth-and-detail\.md"`) or narrow
   the row to the four scenarios REQ-007 describes. As it stands the row cannot be marked Met on the
   evidence it names.
2. **The packet's own completion metadata is stale and contradicts the verified state.**
   `acceptance-criteria.md` marks every row `Unmet` with `Closeable: No`; `tasks.md` has every task and
   every CHK unchecked; `implementation-summary.md` says "Nothing is built yet", "Not completed", and
   lists `None yet` under Files Changed. Reality is five new scenario files, two updated indexes and
   two green validators. This is the exact mismatch the completion rule forbids, and it needs a
   reconciliation pass even though the work itself verifies.
3. **`scratch/validator-final.txt` is a reconstructed transcript, not a raw capture.** Its `exit=0`
   lines sit *above* the PASS lines, while the validator prints `exit=0` last (confirmed by my own run;
   `validator-baseline.txt` shows the double `exit=0` that a `cmd; echo exit=$?` capture produces).
   The claims are true — I reran both commands and got exit 0 — but the file should not be cited as an
   unedited capture.
4. **`check-run.txt` is not reproducible from the record.** The fixture (`frame.json`, `index.html`),
   the `bdg` session and all captures lived in a temp directory that line 383 deletes, and several
   command lines are elided (`"expression":"..."`, `{"width":<W>,...}`, `items[1] {...}`). It is
   internally consistent, names the stand-in clearly, and its verdict obeys the rule it quotes, so the
   row stands; but a second party cannot rerun it, only read it.
5. **Minor:** the mcp-figma root still trips `RESULT_PERSISTENCE_MARKER_MISSING`. That warning is
   pre-existing (`validator-baseline.txt` line 5), not a regression from this phase, and AC-001 does
   not ask for it, but it is the one remaining advisory warning in the package.

STATUS=OK ROWS=11
