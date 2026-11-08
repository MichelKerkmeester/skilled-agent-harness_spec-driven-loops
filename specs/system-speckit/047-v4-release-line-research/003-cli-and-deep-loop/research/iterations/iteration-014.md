# Iteration 014 — v4.0.0.4, v4.0.0.5, v4.0.0.12, v4.0.1.0 against the CLI/deep-loop cluster

## Focus

The four unread releases for this cluster (v4.0.0.4, v4.0.0.5, v4.0.0.12, v4.0.1.0). For each: read the note, then check up to three cluster claims (`.skilled/skills/cli-external-orchestration`, `.skilled/skills/cli-classifier`, `.skilled/skills/system-deep-loop`, `.skilled/commands/deep`) against the current tree with `path:line`, running a script where the claim is behavioural. A release with no cluster claim is marked verified-empty.

Secondary aim: the carried-forward "drift method" question — does a per-tag `git diff` actually attribute a release's cluster work? — and the nine-iteration carry-forward "hub canon under `package_skill.py --strict`".

## Actions Taken

1. `lookup-trigger-index.mjs` scoring-only, then listed `.skilled/changelog/skilled/` and read the four notes in full.
2. Path-limited `git diff --name-only <tag>^..<tag>` on the four cluster paths for the three commits (`4d8f403355` = .4–.10, `7fecd5f219` = .12, `6a93a2cfeb` = v4.0.1.0). All three returned **zero** cluster files, so I widened: `git rev-parse` per tag, `git cat-file -t` on the topic's SHAs, `git log -1` per tag commit, then `git log --oneline <prev-tag>..<tag> -- <cluster paths>` for three ranges.
3. Read `findings-registry.json` via node (top-level array shape held 0 entries under the keys tried; I fell back to the carried-forward question list in the pack to avoid repeats).
4. Located `package_skill.py`, confirmed it holds no write calls on the read path, then ran it — first wrong (see SCOPE VIOLATIONS), then correctly with `--check --strict` on the three cluster skills.
5. Counted `ROUTER.md` references and words in the three cluster `SKILL.md` files and read the reference lines of the orchestration hub.

## Findings

### F1 — Release tags are chore commits, so per-tag diff attributes almost no cluster work (drift, P1)

The topic's SHAs are **commit** targets of annotated tags (`git cat-file -t` = `commit` for all four sampled), and each tag points at a *generated-artifact* commit:

- `v4.0.0.4` → `4d8f403355` "chore(system-spec-kit): rebuild the trigger index"
- `v4.0.1.0` → `6a93a2cfeb` "chore(system-spec-kit): rebuild the trigger index"

So `git diff <tag>^..<tag> -- <cluster>` is empty: 0 files for v4.0.0.4, v4.0.0.5, v4.0.0.12; 4 files for v4.0.1.0, all under `.skilled/skills/system-spec-kit`. The release's real work is spread over commits authored *before* the tag. The previous-tag..tag range does see it:

- `v4.0.0.3..v4.0.0.10` → ≥14 cluster commits (doc/version/path repairs, incl. `5c8e05590e docs(sk-doc): stop telling authors a hub ROUTER.md carries the release version`)
- `v4.0.0.16..v4.0.1.0` → ≥11 cluster commits (readability rewrites, `a37fed8910 chore(skills): seed intent-signal provenance on every hub and recompile the skill graph`)
- `v4.0.0.11..v4.0.0.12` → **0** cluster commits

Consequence for this audit: any release checked with a tag diff reports "verified-empty" by construction, which is a false negative for every release whose cluster work landed earlier in the branch. The method must be `git log <prev-tag>..<tag> -- <cluster paths>`, verified against the note's headline list. Reproduced in this iteration.

[SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:2]

Verify: `git diff --name-only v4.0.1.0^..v4.0.1.0 -- .skilled/skills/cli-classifier .skilled/skills/system-deep-loop | wc -l` → `0`, then `git log --oneline v4.0.0.16..v4.0.1.0 -- .skilled/skills/cli-classifier | head` → non-empty. Confidence: high.

### F2 — "SKILL.md links to it in one line" is not the shipped shape in the orchestration hub (drift, P2)

v4.0.1.0 states the router "now sit[s] in a `ROUTER.md` beside each `SKILL.md`, and `SKILL.md` links to it in one line". The cluster files carry 13 (`cli-external-orchestration`), 8 (`cli-classifier`) and 7 (`system-deep-loop`) `ROUTER.md` references. In the orchestration hub those include a nine-line directory tree that re-lists `ROUTER.md` under each of the seven modes — navigation text, not routing tables, but not "one line" either. The claim's *substance* (tables, maps and pseudocode moved out) holds; its *form* does not, and the note is the artifact an operator uses to judge whether a skill is in the current shape.

[SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:48]
[SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:55]
[SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:210]

Verify: `grep -c 'ROUTER\.md' .skilled/skills/cli-external-orchestration/SKILL.md` → `13`; `sed -n '88,145p' .skilled/skills/cli-external-orchestration/SKILL.md`. Confidence: high.

### F3 — Hub canon closes positively at hub level: both cluster hubs pass strict packaging (closure, P2)

Nine-iteration carry-forward resolved for the two hubs: `package_skill.py --check --strict` returns `✅ Skill is valid!` / `Result: PASS` at exit 0 for `cli-classifier`, `cli-external-orchestration` and `system-deep-loop`. The v4.0.1.0 claim "a skill that keeps its router inside `SKILL.md`, or has no `ROUTER.md`, now fails `package_skill.py --strict`" is therefore not violated by any of the three packets, and the render-check set does not fail them either. What remains unproven is the seven *modes* inside `cli-external-orchestration` and the three modes inside `system-deep-loop`; "hub + every mode" was the open question and only the hub half is now answered.

[SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:158]

Verify: `python3 .skilled/skills/sk-doc/scripts/package_skill.py --check --strict .skilled/skills/cli-external-orchestration`. Confidence: high (output and exit status read).

### F4 — `--strict` is not a validation-only flag: omitting `--check` writes a zip into the CWD (operator UX/bug, P2)

`package_skill.py --strict <skill>` is a **write**. The default action is packaging; `--strict` only says "under `--check`/`--json`, promote contract-required warnings to errors". An operator or an AI user who reads `--strict` as "validate strictly" — the natural reading, and the one the v4.0.1.0 note invites by naming `package_skill.py --strict` as the conformance gate — gets a `.zip` written into the current directory instead of a verdict. Nothing in the output warns that validation was skipped; the run reports success. This iteration is the repro: three archives (3.3 KB–33 MB) appeared at the repo root on `--strict` alone, and the same command with `--check` changed nothing. Severity P2 (silent, recoverable, but it writes into a directory the caller did not name). Introduced before v4.0.0.0; no v4 release introduced it, but v4.0.1.0's wording ("fails `package_skill.py --strict`") makes the misreading likely.

[SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:210]

Verify: run `python3 .skilled/skills/sk-doc/scripts/package_skill.py --strict .skilled/skills/cli-classifier` from a scratch directory and list it → `cli-classifier.zip`; add `--check` → no archive. Confidence: high (observed twice in this iteration).

### Verified-empty for this cluster

- **v4.0.0.4** — names `create.sh` series parents, the settled-conclusion rule, bundled lockfiles, Devin rule loading and removed healer/upgrade flags. No path under the four cluster trees; `git log v4.0.0.3..v4.0.0.10` shows only doc/version/path maintenance inside them, matching none of the note's headlines. Verified-empty.
- **v4.0.0.5** — spec-repair lanes, upgrade before-images, nested anchors, PR gate. No cluster claim; `v4.0.0.11..v4.0.0.12` and `.3..10` show no cluster commit corresponding to any claim. Verified-empty.
- **v4.0.0.12** — its only near-cluster claim is doctor routing for deep-loop problems; the commits in `v4.0.0.11..v4.0.0.12` touching the cluster are **zero**, and the doctor commands and advisor hint map live outside these four paths. Verified-empty with respect to the cluster, but note that the note *mentions* deep-loop routing: worth one confirming read of `.skilled/commands/doctor/deep-loop.md` in a future iteration, out of cluster scope here.

## Questions Answered

- **Is there a validator comparing `ROUTER.md` frontmatter version with `SKILL.md`?** No, and canon says it should not: the hub `SKILL.md` states "This file's `version` frontmatter is the hub's release version … `ROUTER.md` keeps its own document version" [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:158], and commit `5c8e05590e` removed the guidance that told authors a hub `ROUTER.md` carries the release version. The earlier "divergence" is a documented split, not drift.
- **Drift method (carried from iteration 11/12):** answered — per-tag diffs are structurally blind here; use `git log <prev-tag>..<tag> -- <path>` (F1).
- **Hub canon for the two hubs:** answered positively (F3); the mode half is narrowed, not closed.

## Questions Remaining

- **Hub canon, mode half:** `package_skill.py --check --strict` across the seven `cli-external-orchestration` modes and the three `system-deep-loop` modes. Two of nine packets proven.
- **Executor failure handling** (v4.0.0.3, v4.0.0.16) — tenth iteration carried, still unread: what a single-executor run records for a devin `resource_exhausted` or a builder throw.
- **`v4.0.0.12` doctor routing for deep-loop:** the note claims deep-loop prompts suggest `/doctor:deep-loop`; no cluster commit corroborates it, so the fix must live in the doctor/advisor trees. One read of `.skilled/commands/doctor/deep-loop.md` and the advisor hint map closes it.
- **`/doctor:setup` "lists all 17 doctor commands"** — uncounted in this iteration; cheap to verify against `.skilled/commands/doctor/`.
- **UX:** two of three `*-presentation.txt` assets remain unread; the `deep-research-*` twin has never been compared with the `deep-review-*` instances.
- **F1's runtime repro** needs write authority the leaf does not have: `--bogus-flag` exiting 0 through the gateway is still unconfirmed.
- **v4.0.0.16 fast-mode half** — "Pi's fast mode also sends GPT-6.1 Terra on the priority service tier": a `priority` grep over `.pi/extensions/pi-fast-mode-w-subagent-support` matched only fixtures, so the tier map still needs a direct read.

## Next Focus

Iteration 15 (final): (a) run `package_skill.py --check --strict` over the ten modes to close or bury hub canon; (b) attempt the executor-failure read that has carried for ten iterations — `fanout-run.cjs` / `codex-dispatch.cjs` error paths for a devin quota error — because a P1-class gap that survives to the last iteration should be reported as a *gap in the run*, not as an open question; (c) if budget allows, compare the `deep-research-*` presentation asset with its `deep-review-*` twins. **Do not use `--strict` without `--check`.**

## SCOPE VIOLATIONS

1. **Three archives written to the repository root.** My first `package_skill.py` invocation omitted `--check`, so the tool packaged instead of validating and wrote:
   - `cli-classifier.zip` (329,647 B)
   - `cli-external-orchestration.zip` (3,082,904 B)
   - `system-deep-loop.zip` (33,206,407 B)

   All three are outside this leaf's allowed-write list. I did **not** delete them: `rm` is on the banned-operations list for any path, and deleting them would be a second, larger containment breach than leaving them. They are unreferenced build artifacts and no tracked file was modified. **Operator cleanup:** `rm /Users/michelkerkmeester/MEGA/Development/Skilled/{cli-classifier,cli-external-orchestration,system-deep-loop}.zip` — and note that `.gitignore` does not cover `<skill>.zip` at the root, which is why the mistake is visible rather than harmless.
2. Root cause recorded as F4 so the next iteration does not repeat it. No other out-of-scope mutation occurred; all research reads were read-only.
