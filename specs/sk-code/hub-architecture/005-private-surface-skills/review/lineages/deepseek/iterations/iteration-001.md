# Review Iteration 001 — Correctness

**Lineage:** `deepseek` · **Session:** `fanout-deepseek-1792944728998-cwb2cp` · **Iteration:** 1 of 5
**Dimension:** correctness (claim-versus-tree verification)

## Dimension

Correctness: do the packet's executable claims hold against the tree as it stands? This pass verifies only what a command can prove — hub composition, tracked-path counts, ignore-rule matches, guard coverage, and the committed trigger index. Behavioral suites are a declared non-goal of this lineage (no writes outside the artifact directory), so every suite claim below is read from source or from the packet's own record and marked as such.

## Files Reviewed

- `specs/sk-code/013-private-surface-skills/goal.md:89-91` (completion criteria)
- `specs/sk-code/013-private-surface-skills/spec.md:108-124` (files-to-change table)
- `.skilled/skills/sk-code/mode-registry.json` (whole file)
- `.gitignore:230-239`
- `.skilled/scripts/git-hooks/pre-commit:105-121`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` (path and phrase corpora)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:270-310`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

#### 1. R1-P2-001 — A completion criterion's command no longer produces its stated output

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/goal.md:91`
- **Claim (as written):** `.skilled/skills/local-*/SKILL.md` exists through its symlink, each skill root holds one `graph-metadata.json`, and `git status --porcelain .skilled` prints nothing.
- **Evidence:** `git status --porcelain .skilled` prints two untracked paths, neither of them a private skill: `.skilled/commands/agent-router.md` and `.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/agent-routing/inlined-persona-via-agent-router-template.md`. Both belong to later work (`74b9b7233d refactor(commands): remove the agent-router command` leaves the untracked replacements), not to this packet.
- **Counterevidence sought:** Checked whether either path is a `local-*` skill or a surface path. Neither matches `local-(webflow|obsidian)` or `sk-code-(webflow|obsidian)`; `git check-ignore` does not cover them. The criterion's *intent* — no private skill staged — still holds.
- **Alternative explanation:** The criterion was written when the tree was clean, and `git status --porcelain .skilled` was chosen as a convenient proxy for "nothing private is staged". The proxy is over-broad: it fails on any unrelated untracked file, so it cannot be re-run as a durable proof.
- **Final severity:** P2. The underlying property holds; the stated proof command does not reproduce.
- **Confidence:** high.
- **Downgrade trigger:** none (already the lowest tier). An upgrade would require evidence that a private skill path is what `git status` prints.

#### 2. R1-P2-002 — The symlink half of the same criterion is unverifiable outside the operator checkout

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/goal.md:91`
- **Claim (as written):** `.skilled/skills/local-*/SKILL.md` exists through its symlink, and each skill root holds one `graph-metadata.json`.
- **Evidence:** In this worktree `.skilled/skills/` contains no `local-*` entry at all (`ls -la .skilled/skills | grep local` prints nothing), so the criterion cannot be observed here. The packet states the scope elsewhere: `spec.md:190-204` (handoff Block 4) says that block runs in the operator's main checkout at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, because phase 004 creates both symlinks there.
- **Counterevidence sought:** Looked for a recorded, checkout-independent proof of the two links. `004-private-local-skills/implementation-summary.md` and the goal's progress row cite the external commits (`4434c1b`, `c6cd64b7`) and the operator approvals file, which is the closest durable record; no artifact inside this checkout proves the links exist.
- **Alternative explanation:** The criterion is deliberately environment-scoped and the scope is documented one document away. A reviewer holding only `goal.md` cannot tell, which is the defect — the qualifier lives in `spec.md`, not at the criterion.
- **Final severity:** P2 (documentation precision, not a false claim).
- **Confidence:** high for the observation; medium for the judgment that the qualifier belongs at the criterion.
- **Downgrade trigger:** none.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Hub composition and ignore rules match the spec; the goal's criteria 3 wording does not match the current tree (R1-P2-001/002). |
| `checklist_evidence` | core | pending | Acceptance-criteria closure is the traceability pass (iteration 3). |

Verified clean this pass:

- **Hub composition.** `.skilled/skills/sk-code/` holds `sk-code-quality`, `sk-code-review`, `sk-code-skilled` (plus `sk-code-ci`, added by packet `014-code-modes-research`), `shared/`, and no `sk-code-webflow` or `sk-code-obsidian`. `mode-registry.json` declares `sk-code-quality`, `sk-code-review` and `sk-code-skilled` as the spec requires.
- **Tracked-path count.** `git ls-tree -r --name-only HEAD` matches `local-(webflow|obsidian)|sk-code-(webflow|obsidian)` 108 times, all under `specs/`; zero live paths outside `specs/`. The 108 retained rows and the 336 rows at `42b41dd286` match `goal.md:92` exactly.
- **Ignore rules.** `git check-ignore -v` matches all four rules for the four roots (`.gitignore:236-239`), and the rules are slash-less as D2 requires.
- **Guard coverage.** `pre-commit:105` matches `^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)` — eight roots, staged `ACMR` paths, NUL-separated names, no bypass variable.
- **Trigger index.** The committed index contains no `.skilled/skills/local-` entry and no deleted hub-surface path. Its 69 `sk-code-obsidian` occurrences are `specs/...` document paths, which the packet deliberately retains. The walker never follows a directory symlink (`corpus.mjs:287-301`), so a `local-*` link cannot enter the index even in the operator's checkout.

## Next Dimension

D2 Security: private-byte exposure and bypass surface — the eight-root guard's limits against D3, the realpath containment rule against D4, and every tracked-output writer against D5.

## Verdict

Two P2 advisories, no P0 and no P1. The packet's central claims — hub sheds both surfaces, nothing live is tracked, the ignore rules and the guard cover the stated roots — hold under direct inspection.

Review verdict: PASS
