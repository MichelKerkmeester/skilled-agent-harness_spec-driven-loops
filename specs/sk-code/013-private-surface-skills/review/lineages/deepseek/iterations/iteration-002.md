# Review Iteration 002 — Security

**Lineage:** `deepseek` · **Session:** `fanout-deepseek-1792944728998-cwb2cp` · **Iteration:** 2 of 5
**Dimension:** security (private-byte exposure, containment, bypass surface)

## Dimension

Security: can a private skill's name, path or bytes reach a tracked artifact, and what does the packet's own threat model leave open? This pass checks the containment rule (D4), the tracked-output writers (D5), the guard's bypass surface (D3), and the containment code on both the TypeScript and Python sides.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:1-58`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:152-205`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:198-212`
- `.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts:22-52`
- `.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/apply-graph-metadata-patch.ts:36-41`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:78-92`
- `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:52-70`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:270-310`
- `.skilled/scripts/git-hooks/pre-commit:96-121`
- `.skilled/scripts/install-git-hooks.sh:188-208`
- `.skilled/bin/system-skill-advisor-launcher.cjs:138-160`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (whole-file grep)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

#### 1. R2-P2-001 — D3 records four limits but not the one that decides whether the guard runs at all

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/spec.md:102`
- **Claim (as written):** D3 — "The limits are recorded rather than claimed away: `git commit --no-verify` bypasses the guard, removed content stays in git history, a renamed copy passes a name-based guard, and no standing pre-push surface-token guard exists."
- **Evidence:** The guard is a tracked hook script, not an enforced server-side check. Its activation is machine- and clone-scoped in two independent ways: (1) this checkout reaches the hook only through a global `core.hooksPath` (`git config --get core.hooksPath` → `/Users/michelkerkmeester/.config/git/hooks`), which `install-git-hooks.sh:191-194` documents as the usual machine-wide route; and (2) `install-git-hooks.sh:188` states that "Other clones run their own hook scripts only after `git config --local skilled.trustRepoHooks true`", a per-clone opt-in this checkout has (`git config --local --list` → `skilled.trustrepohooks=true`). A fresh clone on an unconfigured machine therefore has the guard present in the tree and inert at commit time. No CI workflow checks for a `local-*` path either (`rg 'local-\*|local-webflow|local-obsidian' .github/` returns no file).
- **Counterevidence sought:** Looked for a CI-side second line of defense and for a repo-committed `core.hooksPath`; found neither. Checked whether `pre-commit` carries a self-install or a trust bypass of its own — it does not (`pre-commit:96-104` states there is no bypass variable for this gate).
- **Alternative explanation:** Git hooks are inherently per-machine, and the repo documents installation; a reviewer may treat activation as environment setup rather than a guard limit. That is fair for the *guard's* contract, but D3 is explicitly the place where this packet records what the guard cannot do, and activation is the largest such limit: every other recorded limit assumes the guard runs.
- **Final severity:** P2. The guard's logic is correct and blocking where installed; the packet's limit list is incomplete.
- **Confidence:** high for the facts; medium for the judgment that D3 is the right home for them.
- **Downgrade trigger:** none (lowest tier). An upgrade would need evidence that a private skill was actually published despite the guard.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | D4 and D5 are implemented as written (below); D3's limit list is incomplete (R2-P2-001). |
| `checklist_evidence` | core | pending | Acceptance-criteria closure is the traceability pass. |

Verified clean this pass:

- **D4 containment (TypeScript).** `private-skill-target.ts:21-58` resolves `realpathSync` for every trusted root and for the target, tests containment with `path.relative` (rejecting `..`, `..${sep}` and absolute results), requires the target to be a directory, and sets `allowSelf: false` for the skills root so a link cannot re-enter the tree. With `SPECKIT_PRIVATE_SKILL_ROOTS` unset, only the skills root is trusted and no external link resolves — fail-closed.
- **D4 containment (Python mirror).** `skill_advisor_runtime.py:155-205` is a faithful port: `os.path.relpath` containment with the same `os.curdir`/`os.pardir`/`isabs` tests, `os.path.realpath` on both sides, `allow_self` only for declared roots, and lazy root resolution once per scan.
- **D5 tracked writers.** Every writer that can reach a tracked artifact skips a `local-*` name before reading it: `skill_graph_compiler.py:203-209` (skip by name, then skip any other top-level link), `sync-skills-hermes.cjs:59` (mirror), `derive-command-bridges.cjs:83` (bridge file), `metadata-loader.ts:38` (cross-skill edges applied into tracked metadata). The committed `skill-graph.json` contains no `local-` entry. The trigger-index walker never follows a directory symlink (`corpus.mjs:287-301`), so it needs no name rule and still cannot index a private skill.
- **No hardcoded private root.** `private-skill-target.ts`, the launcher, the Hermes sync and the guard contain no `/Users/...` path. The launcher only forwards the `SPECKIT_PRIVATE_SKILL_ROOTS` key (`system-skill-advisor-launcher.cjs:145-147`), so the daemon inherits the operator's roots and indexes no private skill without them.

## Ruled Out

- **Edge applier path escape.** `apply-graph-metadata-patch.ts:36-41` uses `resolve()` + `startsWith(root + sep)` + `basename === 'graph-metadata.json'`, which is sound against traversal. It does not use `realpath`, so a symlinked `graph-metadata.json` inside a tracked skill could write through the link; that applier predates this packet and sits outside D6's boundary (generic skill plumbing, not a surface consumer), so it is recorded here as an observation rather than a finding against this packet.
- **Private skill name in the committed trigger index.** The 69 `sk-code-obsidian` rows are `specs/` document paths the packet deliberately retains; no `.skilled/skills/local-` or deleted-hub-surface path appears.
- **Home path in tracked files.** 512 tracked files name the operator's home directory, all pre-existing benchmark reports, launchagents and specs excluded by D6. This packet introduced none.

## Next Dimension

D3 Traceability: phase state versus the record — parent phase map, child statuses, acceptance-criteria rows, and the handoff blocks' expected outputs.

## Verdict

One P2 advisory. No P0 and no P1: the containment rule, the writer skips and the guard logic hold under direct reading, and no path from a private skill to a tracked artifact was found.

Review verdict: PASS
