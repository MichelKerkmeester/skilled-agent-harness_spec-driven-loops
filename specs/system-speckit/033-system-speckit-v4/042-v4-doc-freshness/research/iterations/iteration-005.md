# Iteration 005 — Q5 and the compatibility surface

## Focus

Q5 (rewrite vs targeted corrections) plus the compatibility surface: classify every `.opencode` / legacy-root reference in `CHANGELOG-v4.0.0.0.md` — and the README's two — as still true (resolves through a tracked alias or symlink), mislabeled (works but names a root the repo now calls non-canonical), or dead; then settle rewrite vs targeted correction.

## Actions Taken

1. Loaded run state (`deep-research-strategy.md`, `findings-registry.json`); carried the Q1/Q5 residuals from iterations 2-4.
2. Grepped the changelog for `.opencode|Upgrade Notes|Migration|migrat` (16 matches) and the README for `.opencode` (2 matches: L591, L638); read the full Upgrade Notes section (L575-600; the file is exactly 600 lines).
3. Probed the live `.opencode` root: `ls -la` map, `readlink` targets, resolution of every changelog-named path, `git ls-files -s` tracking modes, recursive symlink counts under `.opencode/hooks`, the `.skilled/specs` chain and inode identity, the `.hermes` layout, and `git log` dating of the contested entries.
4. Closed the iteration-4 residual: the one un-displayed match line was L583's "over-migrating" — a migration-word match, not a path reference. All 16 matches are accounted for; no `.opencode` reference exists beyond the ten changelog lines classified below.

## Findings

Classification of every `.opencode` / legacy-root reference (live-tree verdicts, 2026-09-19):

| Reference | Line(s) | Live check | Verdict |
|---|---|---|---|
| `.opencode/specs/...` compat | L22, L72, L580 | resolves; same inode as top-level `specs` | **true via tracked symlink** |
| `.opencode/bin/` spec-memory removal | L78 | no memory binary; no `system-spec-memory` plugin | **true (removal accurate)** |
| `.opencode/skills/system-spec-kit/runtime/cli/` | L84, L580 | resolves | **mislabeled-but-live** (canonical: `.skilled/...`) |
| "outermost `.opencode`" anchor | L130 | not read (behavioral) | **residual** |
| `node .opencode/bin/skill-advisor.cjs` | L146, L581 | resolves | **mislabeled-but-live** |
| `.opencode/hooks/` "102 relative symlinks" | L366 | dir live; recursive count 101 | **live; count stale** |
| `.opencode/skills/mcp-tooling/mcp-figma/` | L537 | resolves | **mislabeled-but-live** |
| README "every skill under `.opencode/skills/`" | README L591 | resolves | **mislabeled-but-live** |
| README `.opencode/agents/` "links to ... source" | README L638 | link verified, mode 120000 | **true exactly** |

**F1 — Every `.opencode/...` path the changelog names resolves today through git-tracked symlinks into `.skilled/`; zero dead references (P1, Q1).** The live root maps `.opencode/{agents,bin,changelog,commands,hooks,manual-testing-playbook,scripts,skills,specs}` as relative symlinks into `.skilled/...` (and `.opencode/plugins/sk-vision.js` likewise); all nine root entries are tracked in git as mode `120000`, so the links survive a clone. Resolution probes, all OK: `.opencode/bin/skill-advisor.cjs` (L146, L581); `.opencode/skills/system-spec-kit/runtime/cli` (L84, L580); `.opencode/skills/mcp-tooling/mcp-figma` (L537); `.opencode/specs/system-speckit/...` (L22, L72).

**F2 — `.opencode/specs` is a two-hop chain that lands on the live top-level `specs/` (P2, Q1).** `.opencode/specs -> ../.skilled/specs -> ../specs`; `ls -di` returns the same inode (263860362) for `.opencode/specs/`, `.skilled/specs/` and `specs`; a deep probe through `.opencode/specs/...` reaches this run's state log. The L22/L72 claim — "the old location still resolves through a compatibility symlink" — is true as written. Last touch: commit 8b2b831184 (2026-09-18, "make the compatibility root a real directory") — the links were re-established after `.opencode` itself stopped being a single symlink.

**F3 — The changelog never writes the canonical root `.skilled` (P2, Q1 → Q5).** Case-sensitive grep for `\.skilled`: zero hits (the only other `.<root>` spellings in the file are three `.hermes` mentions). Every path instruction names the compatibility root while the repo's canonical spelling is `.skilled/...` (root `AGENTS.md` routes `node .skilled/bin/skill-advisor.cjs`; README L638 calls `.skilled/agents/` the source of truth). Classification: mislabeled-but-live; the correction is a mechanical repoint, not a rewrite.

**F4 — L366's "102 relative symlinks" is off by one (P2).** Recursive symlink count under `.opencode/hooks/` (= `.skilled/hooks`): **101**, identical in working tree and git index. The descriptor itself holds — entries are relative links back to real homes (e.g. `codex-hooks-watchdog.js -> ../../../plugins/codex-hooks-watchdog.js`; `completion-evidence-stop.cjs -> ../../../skills/system-spec-kit/runtime/hooks/{claude,codex}/completion-evidence-stop.cjs`). Same staleness class as the iter-2 "six modes" and "nine mcp modes" counts; the 2026-09-18 hooks refactor (a099d0c93c) may explain the drift.

**F5 — `.hermes/agents` no longer matches the changelog's mirror description (P2, Q1 residual).** L278: the `.hermes/` folder carries "generated markdown-only copies of every skill and every agent persona (Hermes scans a linked directory in full, so symlinks were rejected on evidence)". Shipped tree: `.hermes/skills/` is a real directory (68 entries, including `agent-ai-council`, `agent-code`, `agent-context`, `agent-debug`, ... persona dirs) and `.hermes/prompts/` a real directory (33 entries) — consistent with the copies story — but `.hermes/agents` is a git-tracked symlink to `../.skilled/agents`, repointed by commit fd8213edb9 (2026-09-17, "point runtime links, hooks and mirrors at .skilled"). The "symlinks were rejected" parenthetical no longer describes the shipped mirror: post-draft drift of the 041 class (Q4), not a draft-time error.

**F6 — L78's removal claim holds.** No spec-memory binary under `.opencode/bin/`; no `system-spec-memory` plugin between `system-spec-gate.js` and `system-speckit-completion.js` in `.opencode/plugins/`. "Went down with it" is accurate.

**F7 — README: one mislabel, one exact.** L591 resolves but is the same mislabel class as F3; L638 is exactly right (verified against the live link and its 120000 tracking mode).

**F8 — Q5 verdict, strengthened: targeted corrections suffice for both documents; no rewrite.** The compatibility surface adds no falsity: every `.opencode` reference is live, none dead, and the systemic issue is one root-label class (`.opencode` vs `.skilled`) correctable by mechanical repointing. Combined with the iter-2 stale counts, the iter-4 additive gaps (041 migration, orca packet, 050 ledger/protocol events, doc-correction commits), and F4/F5, every defect found across five iterations is correction-shaped: a count, a label, a missing paragraph, or a post-draft drift note.

## Questions Answered

- **Q1 (compatibility-surface half): answered.** All ten `.opencode` lines classified (table above): every reference still true through tracked symlinks; five are additionally the mislabeled class; none dead. The iteration-4 un-displayed-match residual is closed. Residuals: L130's anchor behavior (not read); L84's package-level "old `scripts/` and `mcp-server/` paths are gone" (not re-probed this iteration); `.hermes` mirror content-level (markdown-only) verification not performed.
- **Q5: answered for the compat surface.** Targeted corrections, not a rewrite — for both documents.

## Questions Remaining

- Q2 residuals: compiled-router closure for `sk-design`; Rust placement; `@markdown` / `deep-ai-council` renames.
- Q1 residual: L130 anchor-resolver behavior under the two root names.
- Q3 residuals (carried): clone-slug redirect; `ai-council` vs `deep-ai-council` mode-key naming; advisor test counts; `AC_CLOSURE`/`AC_COVERAGE` in `dist/`; Node "18+" engines; `.utcp_config.json` template count; Related Documents links; doctor 12-vs-13 and templates 16-vs-18.
- Q4: additive-gap list stands; F5 adds the `.hermes/agents` repoint to the 041 class.

## Next Focus

Q2 residuals (compiled-router closure for `sk-design`; Rust placement; `@markdown`/`deep-ai-council` renames), then the remaining Q1/Q3 residuals.

## SCOPE VIOLATIONS

None. All writes stayed within `iterations/iteration-005.md`, `deltas/iter-005.jsonl`, and the contract-mandated temp record consumed by the append gateway.
