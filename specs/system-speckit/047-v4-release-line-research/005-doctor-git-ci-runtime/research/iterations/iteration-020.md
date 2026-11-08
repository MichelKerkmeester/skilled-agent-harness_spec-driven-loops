# Iteration 020 — Symlink-Alias Sweep: Every Path Comparison, Judged

## Focus

Iteration 19's finding f-iter019-001 established that comparing paths as strings across
the `.opencode -> .skilled` aliases produces false results. This iteration turns that
warning into a method: enumerate every path comparison under
`.skilled/commands/doctor/scripts`, `.skilled/scripts` and `.skilled/bin`, and for each
one decide whether an alias path on **one** side would make the comparison wrong.

The starting assumption inherited from iteration 19 — that `.opencode/agents/..` is a
cheap way to reach `.skilled` — turned out to be false, and that correction is itself
the first finding.

## Actions Taken

1. **Alias census.** `ls -ld` on every alias parent and `git ls-files -s` on each
   entry. Three of the four `.opencode` sub-paths are symlinks recorded in git as mode
   `120000`; `.opencode/commands` is a real directory and `.opencode` itself a real
   directory. `readlink` gave the exact link text (`../.skilled/agents`,
   `../.skilled/scripts`, `../.skilled/bin`).
2. **Comparison enumeration.** Two greps over the three directories: the
   `realpathSync|readlink|path.resolve|pwd -P|realpath` family, and equality operators
   applied to path-like variables. 52 canonicalization call sites in
   `symlink-engine.cjs` alone; exactly one shell equality on a path-like pair
   (`pre-commit:509`, repo-relative, not filesystem paths).
3. **Reproduction.** Ran the divergence test three ways (pure `path.resolve` vs
   `fs.realpathSync`, shell `cd`+`pwd -P` vs `git rev-parse --show-toplevel`, and the
   `${x#"$root"}` prefix strip) as read-only string operations. No file was written
   outside this iteration folder.
4. **Judgement.** Each comparison classified as canonical-safe, lexical-by-contract, or
   genuinely wrong-with-an-alias. Two are genuinely wrong; one is a display regression;
   one is a shared-question / different-canonicalization inconsistency.

## Findings

### F20-01 — `path.resolve` and `realpathSync` agree on `alias/..`, so the parent-dir form cannot detect an alias at all (drift, P2)

Iteration 19's trap was described as "comparing paths as strings across the aliases".
The mechanism is narrower than that and worth stating exactly, because it invalidates a
test form that is easy to reach for. A path whose final component is `..` is resolved
**lexically by both** functions — the symlink is consumed and then cancelled, so aliased
and physical spellings come out identical:

```
.opencode/agents/..    path.resolve: .../Skilled/.opencode    realpath: .../Skilled/.opencode    equal: true
.opencode/scripts/..   path.resolve: .../Skilled/.opencode    realpath: .../Skilled/.opencode    equal: true
```

Divergence requires a path that **continues past** the alias component:

```
.opencode/agents/README.txt   path.resolve: .../.opencode/agents/README.txt
                              realpath    : .../.skilled/agents/README.txt      equal: false
.opencode/scripts/git-hooks   path.resolve: .../.opencode/scripts/git-hooks
                              realpath    : .../.skilled/scripts/git-hooks      equal: false
```

The shell agrees with the lexicographic reading: `cd .opencode/agents/..` leaves `$PWD`
and `pwd -P` both at `.opencode`, while `git rev-parse --show-toplevel` from that same
directory prints the physical `/Users/.../Skilled`. Any earlier finding that used an
`..`-terminated alias path to prove either "these are the same file" or "these are
different files" is inconclusive and should be re-run with a descendant path.

- Sources: [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:197],
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:275],
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:284]
- Release: v4.0.1.0 (engine introduced by 28b388e81b, an ancestor of the tag)
- Confidence: high — reproduced this iteration, three independent spellings.
- Verify: `node -e 'const fs=require("fs"),p=require("path");const x=".opencode/agents/README.txt";console.log(p.resolve(x), fs.realpathSync(x), p.resolve(x)===fs.realpathSync(x))'`

### F20-02 — `.opencode/commands` is a real directory while its three siblings are symlinks, so a symmetric alias sweep invents duplication (drift, P2)

The alias set is not uniform, and assuming it is produces false "duplicate copy"
results — which is precisely the class f-iter019-001 flagged. From git:

```
120000 ... .opencode/agents
120000 ... .opencode/bin
120000 ... .opencode/scripts
```

`.opencode/commands` (and `.opencode` itself) carry no `120000` mode and are real
directories. A sweep that maps `.opencode/X` to `.skilled/X` for all four X reports
`.skilled/commands` as a duplicate of a directory that is genuinely separate content, and
a sweep that de-duplicates by resolved path silently collapses two real trees.

- Sources: [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:627],
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:468]
- Release: v4.0.1.0
- Confidence: high — `git ls-files -s` and `ls -ld` both read this iteration.
- Verify: `git ls-files -s .opencode/agents .opencode/scripts .opencode/bin .opencode/commands; ls -ld .opencode/commands`

### F20-03 — `worktree-status.sh` strips the worktree root without a separator, so a sibling checkout prints a non-existent path (bug, P2)

`.skilled/bin/worktree-status.sh:72` does:

```
short_path="${wt_path#"$MAIN_ROOT"}"
```

`MAIN_ROOT` comes from the first `git worktree list --porcelain` record
[SOURCE: .skilled/bin/worktree-status.sh:41]. With no trailing separator in the pattern,
any worktree path whose text merely *extends* the main root is mis-stripped. Reproduced as
a pure string operation:

```
MAIN_ROOT=/Users/dev/Skilled
  /Users/dev/Skilled/work/wt1      -> short_path=./work/wt1        (correct)
  /Users/dev/Skilled-old/work/wt2  -> short_path=.-old/work/wt2    (a path that does not exist)
```

The guard immediately below it (`[ "$short_path" = "$wt_path" ] && short_path="$wt_path"`)
cannot fire, because the strip *did* change the string. The sibling script
`.skilled/bin/worktree-session.sh:248` gets this right with `${WT_ABS#"$MAIN_ROOT"/}` and
a comment naming the intended semantics — so `.skilled/bin` holds both the correct and the
incorrect form of the same operation. This is
[SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:517]'s segment-boundary rule
("a sibling such as Skilled-old never counts as inside Skilled") applied in one file and
omitted in another.

- Sources: [SOURCE: .skilled/bin/worktree-status.sh:72],
  [SOURCE: .skilled/bin/worktree-session.sh:248],
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:515]
- Release: v4.0.0.15 (worktree surface; attribution not tag-diffed this iteration)
- Confidence: high for the string behaviour, medium for the release attribution.
- Verify: `bash -c 'M=/Users/dev/Skilled; for w in $M/work/a $M-old/work/b; do echo "=${w#"$M"}"; done'` then confirm attribution with `git log -S 'short_path="${wt_path#"' --oneline -- .skilled/bin/worktree-status.sh`

### F20-04 — One file answers "is this path inside the source?" twice, once canonicalized and once lexically (misalignment, P2)

`symlink-engine.cjs` contains two functions deciding the same containment question:

- `pointsIntoSource` canonicalizes the longest existing prefix of the link text and then
  compares on a path-segment boundary, with a comment naming the `/var` vs `/private/var`
  alias as the reason [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:516].
- `isHostRelativeLink` asks whether a relative link leaves its manifest folder and answers
  with a raw `path.resolve` against a canonical `entrySource`
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:569].

The two disagree only when a link text traverses a symlinked component that returns inside
the source. On the mirror source as it stands the link texts are plain relative hops
(`../sk-prompt`, `../system-spec-kit`) so no false classification was reproduced — the
finding is that the guard is present in one function and absent in its sibling, which is
exactly the shape that regresses later. The rest of the engine is deliberately
canonical-safe at the entry point: `resolveRoots` realpaths both root and source before
any comparison [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:275], and
`isWholeLink`'s physical branch realpaths both sides
[SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:470].

- Sources: [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:516],
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:569],
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:197]
- Release: v4.0.1.0
- Confidence: medium — the asymmetry is proven by reading; a triggering link text is not
  present in the repository today.
- Verify: `node -e 'const fs=require("fs");for(const f of [".skilled/commands/doctor/scripts/symlink-engine.cjs"]){const t=fs.readFileSync(f,"utf8").split("\n");console.log(t[515].trim());console.log(t[568].trim())}'`

### F20-05 — `check-mcp-mutation-class.sh` mixes a physical root and a logical root in one expression, then reports absolute paths (drift, P2)

```
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"     # line 82
...
ROOT="$(cd "$ROOT" && pwd)"                                    # line 88
```

Line 82 picks git's **physical** toplevel when git succeeds and the shell's **logical**
`$PWD` when it fails; line 88 then re-derives the value with `cd` + `pwd`, which is
logical again. So the physicality of `ROOT` depends on which branch line 82 took, and the
two branches produce different strings for the same checkout whenever the checkout sits
under a symlinked parent (for example a `~/dev -> ~/Development` alias, or macOS's
`/tmp -> /private/tmp`).

The consumer that feels it is the display strip at line 355,
`local rel="${path#"$ROOT"/}"`, where `path` is a manifest-declared absolute path. When
the manifest spelling is physical and `ROOT` is logical the strip is a no-op and every
`PASS`/`FAIL` line prints a full absolute path instead of a repo-relative one. No verdict
flips — the file-existence test uses `$path` directly — so this is a readability
regression rather than a false pass. Inside the Python block the same question *is*
answered canonically: `os.path.realpath` is applied to both the listed and the found
paths [SOURCE: .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:183], which is
why only the shell-side display degrades.

- Sources: [SOURCE: .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:82],
  [SOURCE: .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:88],
  [SOURCE: .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:355]
- Release: unattributed — the script predates the tags examined; not tag-diffed this
  iteration.
- Confidence: medium for the display consequence, high for the mixed-physicality reading.
- Verify: `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh --help 2>&1 | head -5` with `ROOT` forced to a logical spelling via `--root`, then observe whether the reported paths are relative.

### F20-06 — Judgement table: the comparisons that are already canonical-safe (no change needed)

Recorded so the next pass does not re-audit them:

| Site | Comparison | Verdict |
| --- | --- | --- |
| `symlink-engine.cjs:470` | `realpath(root) === realpath(source)` | safe |
| `symlink-engine.cjs:1293` | `path.resolve(root, expected) === absolute`, both derived from the same canonical root | safe |
| `symlink-engine.cjs:484` | `isWithin(realpath(target), realpath(directory))` | safe |
| `sk-skill-check.cjs:422` | `realpathSync(target)` vs `realpathSync(skillsDir)` | safe |
| `agents-md-manifest.cjs:126` | `realpathSync(a) === realpathSync(b)` | safe |
| `opencode-version-battery.cjs:337` | `realpathSync(root)`, falling back to `path.resolve` only when realpath throws | safe in the normal branch |
| `git-setup-check.cjs:1697` | `path.resolve(opts.repo)` vs `path.resolve(git toplevel)` at `:1699` — the two spellings coexist but are never compared to each other; `repoRoot` becomes the single `ctx` root | safe |
| `pre-push:594`, `worktree-session.sh:248` | prefix strip with an explicit trailing separator | safe |

`git-setup-check.cjs` is worth one caution even though it is safe today: it keeps
`requested` (possibly logical) and `repoRoot` (git's physical answer) as separate
variables in the same scope [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1701],
so any future check that compares a hook link against `requested` rather than
`repoRoot` would be alias-sensitive.

- Sources: [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1697],
  [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1698],
  [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1699],
  [SOURCE: .skilled/commands/doctor/scripts/sk-skill-check.cjs:422],
  [SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:126],
  [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:337],
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1293]
- Release: n/a (survey)
- Confidence: high — all nine sites read this iteration.

## Questions Answered

None of the strategy's open key questions. Q1 (hooks behave as the v4.0.0.3 /
v4.0.0.10 / v4.0.0.15 / v4.0.0.16 notes say, with a repro) remains unanswerable inside
this run's write authority: an accept/reject repro needs a scratch repository.

The iteration did settle an *internal* question carried since iteration 16 — whether the
ancestor-symlink trap voids other registry entries — by supplying the exact test that
distinguishes the two cases: a finding is only voided if it compared two spellings that
diverge **past** the alias component. Under that test F20-02 shows the trap is real for the
copy/duplicate family (because `.opencode/commands` is not a link), while the containment
checks in F20-06 stand.

## Questions Remaining

- **Q1 (hooks half), dominant and unchanged.** `pre-push` without a `Commit-Id`, the 20 s
  `BLOCKED [gate:git-timeout]`, and a message carrying both `Commit-Id: 0000000` and a
  valid id all still need a scratch repo. `validate-message-git-timeout.test.mjs` and
  `commit-id-naming.test.sh` remain the cheapest route.
- Does `isHostRelativeLink` (F20-04) ever see a link text that traverses a symlinked
  component in a *linked* repository created by `/doctor:link`? The mirror source has no
  such link today; a linked host could.
- Which release introduced `worktree-status.sh`'s separator-less strip (F20-03)? The
  string behaviour is proven; the attribution is not.
- **Q11** — command and skill format against sk-code / sk-doc canon. Untouched for a
  fifth iteration.
- Devin's 16,384-byte rule cut against the concatenated repo-rules size; still
  unmeasured.

## Next Focus

The last iteration in this lineage should spend its budget on the one question that has
been open since iteration 2 and never required new evidence, only write authority: run the
two existing hook suites (`validate-message-git-timeout.test.mjs`,
`commit-id-naming.test.sh`) on a `/tmp` copy and report pass or fail at HEAD. Everything
else in this cluster has been read at least twice; the hook behaviour has never been
executed once.

## SCOPE VIOLATIONS

None. Every reproduction in this iteration was a pure string operation or a read
(`ls -ld`, `readlink`, `git ls-files -s`, `git rev-parse`). No file outside this iteration
folder was created, renamed or deleted.
