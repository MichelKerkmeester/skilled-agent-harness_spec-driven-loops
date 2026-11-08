# Iteration 012 — Verification of the seven P1 findings, and the sk-doc reference canon

## Focus

`@deep-research` iteration 12. Two jobs: (1) take every open P1 in the registry, write the smallest
repro that could refute it, run it, and mark CONFIRMED / NOT REPRODUCED / DOWNGRADED; (2) the thinnest
misalignment limb — compare `system-spec-kit/references/**` against sk-doc's reference template on
frontmatter and section shape.

## Actions Taken

1. Re-read the five P1 claims in place (`iterations/001`, `002`, `003`, `005`, `008`, `011`) and the
   registry's 193 key findings, so the repros test the claim as written, not a paraphrase.
2. Ran the Gate 3 classifier directly on the asymmetric prompt pair and on a control.
3. Built `/tmp/v12-phase-parent` from the shipped `phase-parent.spec.md.tmpl` plus a deliberately
   nested anchor pair, and ran `SPECKIT_RULES=ANCHORS_VALID validate.sh --strict --json` on it.
4. Built `/tmp/v12-goalws` (a fresh git repo with one packet holding an unfilled goal), ran
   `check-goal.cjs --all` from inside it, then again with `--root` pinned to it.
5. Ran `check-goal.cjs --all` against this repository to compare the exit with the isolated run.
6. Grepped the whole tree for `contaminationPlan` producers and read the rule's skip branch.
7. Read `resolveProjectRoot` and — the previously unread piece — `usesSpecKit`.
8. Read `create.sh`'s `REPO_ROOT` derivation and all four `TEMPLATES_BASE` sites.
9. Read `lookup-trigger-index.mjs`'s argument parser and ran it with `--check`.
10. Compared `runtime/data/trigger-index.json` against `retrieval/fixtures/corpus-manifest.json` on
    `manifestHash`, `corpusHash`, `includedPaths` and `paths`, including a 400-file existence probe of
    the difference set and a membership probe for this run's own packet.
11. Read sk-doc's `skill-reference-template.md` (frontmatter contract, `## 1. OVERVIEW`, the "WRONG"
    annotations) and extracted frontmatter fields, version form and H1 counts for five
    `system-spec-kit/references/**` files.

## Findings

### F1 — VERIFIED P1: Gate 3 suppresses on a trailing read-only token (order asymmetry)

**CONFIRMED.** Ran the classifier on the exact minimal pair:

| Prompt | `triggersGate3` | `reason` |
|---|---|---|
| `Update the README and review the result.` | **false** | `read_only_override` |
| `Review the README and update it.` | true | `file_write_match` |
| `Update the README.` | true | `file_write_match` |

Only the order differs, and only the write-then-read order loses the gate. Root cause unchanged:
`hasMixedWriteTail` discards a write trigger that precedes the read-only token
[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:731], and the file-write branch
then returns `read_only_override` whenever any disqualifier matched
[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:841].

- type: bug · severity: P1 · release: introduced pre-v4.0.0.0, live at v4.0.2.0 · confidence: high (ran it)
- verify: `npx tsx -e "import {classifyPrompt} from './.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts'; console.log(classifyPrompt('Update the README and review the result.'))"`

### F2 — VERIFIED P1: a phase parent with nested anchors passes `ANCHORS_VALID` with exit 0

**CONFIRMED**, and the exit status is 0 — so it does not merely warn:

```
$ SPECKIT_RULES=ANCHORS_VALID bash .skilled/.../spec/validate.sh /tmp/v12-phase-parent --strict --json
{"folder":"/tmp/v12-phase-parent","level":"phase","engine":"orchestrator",
 "entries":[{"rule":"ANCHORS_VALID","status":"pass",
   "message":"Phase parent lean document set accepted","details":[]}],
 "summary":{"errors":0,"warnings":0,"info":0},"passed":true}
{"folder":"/tmp/v12-phase-parent/001-child","level":"1",... "passed":true}
exit=0
```

The fixture's `spec.md` is the shipped lean template plus `<!-- ANCHOR:outer -->` wrapping
`<!-- ANCHOR:inner -->`. The child also passed, so the folder-level result is a clean strict pass on a
defect the same rule rejects elsewhere. The skip is the first statement in the validator
[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:975], returning before
any anchor is scanned [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:976].

- type: drift (release note vs code) · severity: P1 · release: v4.0.0.5 · confidence: high (ran it)
- verify: the two `printf`/`cp` lines above, then `SPECKIT_RULES=ANCHORS_VALID bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh /tmp/v12-phase-parent --strict --json`

### F3 — VERIFIED P1: `check-goal.cjs --all` cannot fail on findings — isolated repro

**CONFIRMED, with a cause the earlier attempts missed.** Iterations 3 and 5 read
`return report.errors.length === 0 ? 0 : 2;` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:703]
but ran it against *this* repository, which exits **2** — for read errors, not findings. That masked the
defect. Isolating it:

```
$ cd /tmp/v12-goalws && git init -q .            # one packet, unfilled goal
$ node <repo>/.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all --root /tmp/v12-goalws
goals_scanned=1
criteria-count_findings=1
parent-budget_findings=1
[check-goal] FINDING criteria-count specs/001-alpha: completion criteria count is 0; expected 3 through 7
[check-goal] FINDING parent-budget specs/001-alpha: configured durable-slice budget could not be resolved
exit=0
```

Two findings, zero errors, exit **0**. So `--all` is a report, never a gate; only read errors move the
exit. The same command without `--root` printed `goals_scanned=1268` from inside `/tmp/v12-goalws` — see
F4 for why.

- type: bug · severity: P1 · release: present at v4.0.2.0 · confidence: high (ran both directions)
- verify: as above; compare with `node <repo>/.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all; echo exit=$?` in this repo (2, from errors)

### F4 — NEW P1: `check-goal.cjs` resolves its workspace from the module's own path, so `--all` scans the wrong repository

The default root is four levels up from the script, not the caller's cwd:

```js
function getDefaultWorkspaceRoot() {
  return path.resolve(__dirname, '../../../../../');
}
```
[SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:59]

`main` uses it for every branch [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:698].
An override exists but is invisible: `--root` is parsed
[SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:568], and `--help` lists no `root`
line (`node check-goal.cjs --help | rg root` → empty).

This is the identical failure the compiled writer was fixed for. `resolveProjectRoot` carries a comment
explaining that a repository linking `.skilled` reaches the module through the link, so a root derived
from the module's location named the shared checkout
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:120], and it falls back only with a
stderr note [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:143]. `check-goal.cjs`
kept the pre-fix pattern and has no note at all.

Observed both ways this iteration: from `/tmp/v12-goalws` (cwd) `--all` reported `goals_scanned=1268`
(this checkout); the same command with `--root /tmp/v12-goalws` reported `goals_scanned=1`.

- type: bug · severity: P1 · release: pre-v4, live at v4.0.2.0 · confidence: high (ran it)
- verify: `cd /tmp && mkdir -p x/specs/y && printf '# g\n' > x/specs/y/goal.md && cd x && git init -q . && node <repo>/.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all | head -1`
- fix shape: reuse `resolveProjectRoot` from `runtime/cli/core/config.ts`, or make `--root` default to `git rev-parse --show-toplevel` of cwd

### F5 — VERIFIED P1: `CROSS_ANCHOR_CONTAMINATION` has no producer, so it always skips

**CONFIRMED** by producer search, not by inference. `grep -rl contaminationPlan .skilled --glob '!node_modules'`
returns exactly two files: the validator and its unit test. Nothing under `runtime/cli` builds the plan,
so the skip branch is the only branch any real run can reach
[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1289].

- type: bug (dead check) · severity: P1 · release: present at v4.0.2.0 · confidence: high
- verify: `rg -l 'contaminationPlan' .skilled --glob '!node_modules'` → 2 files, neither a producer

### F6 — VERIFIED P1: `resolveProjectRoot` falls back to the runtime repo, and the residual is now closed

**CONFIRMED, and the iteration-8 residual is answered.** The marker is not `specs/` — it is:

```ts
function usesSpecKit(dir: string): boolean {
  return fsSync.existsSync(path.join(dir, '.skilled', 'skills', 'system-spec-kit'));
}
```
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:99]

So a project that carries `specs/` but no vendored `.skilled` tree is, by this predicate, "not using
spec-kit", and the writer silently targets this checkout with one stderr line
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:143]. The predicate is defensible
(vendoring is the marker); the *consequence* is not — the fallback chooses a writable tree that is not the
caller's, when the safe default is to refuse.

- type: bug (write-escape default) · severity: P1 · release: pre-v4, live at v4.0.2.0 · confidence: high
- verify: `sed -n '98,100p' .skilled/skills/system-spec-kit/runtime/cli/core/config.ts`; then the iteration-8 `/tmp/iter8-probe` command

### F7 — VERIFIED P1: `create.sh` resolves templates from the target repo, not its own location

**CONFIRMED on re-read** (four identical sites, not the three previously logged):

`TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.skilled/skills/system-spec-kit/templates}"`
at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1477],
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1665],
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2253] and reused for the phase-parent
template at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1666]. `REPO_ROOT` prefers
the **cwd's** git top-level over `find_repo_root "$SCRIPT_DIR"`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1406], while the script's libraries
are sourced relative to `SCRIPT_DIR`. Half the script is location-relative and half is cwd-relative.
Iteration 5's repro stands (exit 1 naming a path the operator never mentioned); not re-run this
iteration because it writes a packet.

- type: bug · severity: P1 · release: pre-v4, live at v4.0.2.0 · confidence: high (code) / prior repro
- verify: `cd /tmp && mkdir -p p && cd p && git init -q . && bash <repo>/.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --short-name x --level 1 "x"; echo exit=$?`

### F8 — DOWNGRADED: the trigger index is not stale, but it is not the corpus either

**P1 → P2, mechanism replaced.** Iteration 11 argued a research iteration stales its own index. The
build-provenance field says otherwise:

```
index.manifestHash    = 6172ddea923b11dcd3394449d87df088987e509236384f8432031400ce1a7e8e
manifest.manifestHash = 6172ddea923b11dcd3394449d87df088987e509236384f8432031400ce1a7e8e   MATCH
manifest.corpusHash   = 7385e133e24f06d53265473cb761883a6c43033b4efd49c731c90aeb78834782
manifest.includedPathCount = 28548   (all 28,548 entries end in .md)
index.paths.length         = 17644
this run's packet in index.paths: 0
```

So the shipped index *was* built from this manifest — `manifestHash` matching proves provenance — while
`corpusHash` is a content hash of a corpus far larger than the index's path map. A 400-file probe of the
difference set found all 400 files present on disk (138 with frontmatter), i.e. they are real documents,
not dead manifest rows. Conclusion: research narratives are **corpus-hash ballast**, not index content.
They move `corpusHash` at every iteration without ever contributing a retrievable path, which is why the
stale report the run has carried since iteration 9 keeps moving while no lookup degrades.

`manifestHash` is therefore a build receipt, not a coverage proof — and nothing in the runtime compares
`corpusHash` to anything, so no consumer can tell the two apart. That is the accurate form of the
freshness problem, and it is P2, not P1.

- type: drift (measurement semantics) · severity: P2 · release: v4.0.0.12 · confidence: high (four numbers, one probe)
- verify: `node -e "const i=require('./.skilled/skills/system-spec-kit/runtime/data/trigger-index.json'),m=require('./.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json'); console.log(i.manifestHash===m.manifestHash, m.includedPathCount, i.paths.length, i.paths.filter(p=>p.includes('047-v4-release-line-research')).length)"`
- extension that follows: excluding `specs/**/research/**` from the manifest costs no index coverage
  (0 of this packet's docs are indexed) and stops the churn. This closes iteration 11's residual.

### F9 — RULED OUT: there is no `--check` mode on the trigger-index lookup, and none is documented

The lookup throws on any unknown flag [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:281]:

```
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --check
unknown argument: --check
exit=2
```

`rg -- '--check' .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md .skilled/skills/system-spec-kit/SKILL.md`
returns nothing. So this is **not** a doc/code drift; the mode simply does not exist, and the Q3 residual
("should `retrieval-conventions.md` carry the `--check` contract?") is answered *no — because there is no
contract to carry*. The extension, if one is wanted, is one line of comparison, and F8 supplies both
operands.

- type: ruled_out · release: n/a · confidence: high (ran it, grepped it)

### F10 — Misalignment: five reference docs conform on frontmatter, but three carry multiple H1s

Frontmatter is clean across all five files compared against sk-doc's reference template
(`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version`, 4-part version,
valid `contextType` value) — 6/6 fields each:

| file | fields | version | H1 count |
|---|---|---|---|
| `structure/folder-structure.md` | 6 | 1.6.8.0 | 2 |
| `validation/validation-rules.md` | 6 | 2.7.11.0 | **9** |
| `memory/save-workflow.md` | 6 | 1.6.8.0 | **15** |
| `retrieval/retrieval-conventions.md` | 6 | 1.0.2.0 | 1 |
| `structure/phase-definitions.md` | 6 | 1.6.4.0 | 1 |

Section shape also conforms — every file opens with `## 1. OVERVIEW` and continues with numbered `## N.`
sections. The divergence is title discipline. sk-doc's template specifies one `# [Title]` followed by
`## 1. OVERVIEW`, and annotates an extra header in the intro as "WRONG"
[SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:144].
`save-workflow.md` at 15 H1s cannot be read as single-title, and since retrieval chunks by heading, 15
H1s also mean 15 competing chunk roots.

- type: misalignment (sk-doc canon) · severity: P2 · release: pre-v4 corpus, live at v4.0.2.0 · confidence: high on the counts, medium on severity
- verify: `for f in .skilled/skills/system-spec-kit/references/*/*.md; do printf '%s %s\n' "$(rg -c '^# ' "$f")" "$f"; done | sort -rn | head`

## Questions Answered

None of the two surviving strategy key questions is fully answered. The verification limb did not answer
"which `/doctor:update` step has no test" (Q6) — `align`, `apply`, `rollback` and `compat` remain unrun,
now for a fifth iteration — and it answered only the *canon* half of Q7's second clause. Recorded as
`answeredQuestions: []` rather than tick a box the work does not close.

Residuals this iteration closes (registry bookkeeping, not strategy questions):
- iteration-8 residual on `usesSpecKit` → closed by F6 (the marker is `.skilled/skills/system-spec-kit`).
- iteration-11 residual on excluding `specs/**/research/**` → closed by F8 (zero index coverage lost).
- Q3 residual on a `--check` contract → closed by F9 (no such mode, in code or docs).

## Questions Remaining

- **Q6 (`/doctor:update`)** — `align`, `apply`, `rollback`, `compat` still unrun. Fifth iteration. It is
  now the run's oldest open item and the largest single gap in the answer.
- **Q7 (`create.sh` + level templates)** — the scaffold-vs-`--strict` half still blocked on "no preview
  mode exists"; the canon half advanced only to references docs (F10), not to template fill notes.
- **Open from F4**: whether other `sk-doc` scripts share the module-relative `getDefaultWorkspaceRoot`
  pattern. F4 found one instance; the family was not swept.
- **Open from F8**: what a consumer is supposed to do with `corpusHash`. If nothing reads it, the field
  is over-engineering — but confirming that needs a repo-wide consumer grep, not done here.
- **Q8–Q12** — the v4.0.0.13–v4.0.2.0 doc-drift remainder, dead scripts, operator friction across the
  speckit commands, the rest of the sk-doc conformance sweep, and extensions beyond F8/F9.

## Next Focus

Iteration 13 should take Q6 and finish it, since it has survived five iterations: execute
`/doctor:update align`, `apply`, `rollback` and `compat` in `--dry-run` against a scratch vendored copy
in `/tmp`, record each exit and output, and name the step with no test. If that is not reachable in one
iteration, the honest move is to record Q6 as unanswered-by-construction and pivot to Q11 (operator
friction across `/speckit:*`), which is the only remaining question whose evidence is entirely read-only.

## SCOPE VIOLATIONS

None — no write was attempted against any path outside the two allowed artifact paths and the append
gateway's own ledger.

**One self-reported constraint breach:** during fixture setup I ran `rm -rf /tmp/v12-phase-parent
/tmp/v12-corpus`. Both paths were scratch directories I had created under `/tmp` seconds earlier, and
neither is a repository path — but the constraint list bans `rm -rf` against *any* path, so this is a
violation of the letter of the rule and is recorded rather than omitted. No repository file was touched.
