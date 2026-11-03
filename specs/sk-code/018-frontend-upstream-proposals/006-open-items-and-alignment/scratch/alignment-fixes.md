# Alignment fixes, first pass

The first pass ran `/local-skilled-alignment` over the branch's first-parent commits. Its lanes and critic ran on `opencode-go/deepseek-v4.1-flash` through `scratch/alignment-executors.json`. The scope and battery were rerun from a worktree copy of the harness, because the worktree's harness folder is a symlink into the main checkout (X-5). The run folders are under `~/.local/state/local-skilled-alignment/314-frontend-upstream-proposals/` (`run1` lanes and critic, `run2` worktree battery and report, `recheck1` the recheck).

Recheck result: 24 resolved, 2 still open, 0 new, 19 needing review. Each open and needs-review item is settled below.

## Fixed

| Finding | Fix | Commit |
|---|---|---|
| B-01, B-02, BAT-02 to BAT-14 | Each frontend reference has an overview H2 and a `---` before every numbered H2; all 15 validate. B-02's recheck "still open" is a false positive: its old text is a substring of its new text, and the divider sits at line 188 | `dddc000f7e` |
| B-03 | `figma-to-code.md` names `bdg cdp Runtime.evaluate` | `dddc000f7e` |
| B-05, D-07 | "six web topic files", without the glob | `dddc000f7e` |
| C-06, B-06, D-03 | The README recipe matches `## 3. MACHINE ROUTER` | `dddc000f7e` |
| B-07, X-4 | mcp-figma SKILL.md and changelog give the repo path | `dddc000f7e` |
| A-4, B-04, C-04, D-02 | `causal_summary` names three surfaces | `dddc000f7e` |
| C-01, C-02 | Root README says three surfaces in both places | `dddc000f7e` |
| C-05 | Skills catalog row lists the three surfaces in tie-break order | `dddc000f7e` |
| C-07 | Schema reference matches the live hub router | `dddc000f7e` |
| D-06 | sk-code-review README names the frontend surface | `dddc000f7e` |
| B-08 | Hub playbook precondition lists `sk-code-frontend/` | `dddc000f7e` |
| X-1 | sk-code ROUTER section 7 no longer forbids the native references | `dddc000f7e` |
| A-3 | Every scorer counts a folded keyword once | `22ef00b553` |
| A-2, D-05 | The system-deep-loop policy card folds hyphens | `22ef00b553` |
| D-01 | The generator seeds provenance on a hub's first write; every hub seeded | `3e75d0d115`, `a37fed8910` |
| A-1, BAT-16 | Skill graph recompiled; freshness reports no signal drift | `a37fed8910` |
| D-04 | Hermes sync contract states 55 and 11 | `3e75d0d115` |
| B-09 | Frontend surface playbook with web, native and Figma-check scenarios | `481d5e7096` |
| X-2, probe P03 | Four aliases route the three missed prompts to the frontend surface; reach 0 outranked | `2db7c31d3e` |
| C-03 | `.skilled/changelog/sk-code/code-frontend` link | `aa0fa6e5ed` |
| D-08 | Durable-directory manifest regenerated with its documented `--write` | `ad9bbed86e` |
| BAT-17 | sk-doc reach outrank fixed on main, brought in by merge `c86580f127` | `c86580f127` |
| BAT-19, X-3 | Packet metadata re-derived and goal metadata reconciled at phase close | phase close commit |
| BAT-01 | Environment, not code: the CLI type check read a stale gitignored runtime build; `npm run build` in `runtime/` fixed it and `tsc` exits 0 | none |

## Left as they are

| Finding | Why |
|---|---|
| BAT-15 | Root README lines 237 and 240 name an example path and `CLAUDE.md`; both came from main's `28b388e81b`, not this branch, and the second-pass battery no longer fires the row |
| BAT-18 (S9) | `.skilled/skills/.state/` and `deep-loop-graph.sqlite` paths are runtime artifacts that exist only after those commands run; predates the branch |
| X-5 | The alignment harness is operator-local and gitignored (`.gitignore:244`, `/.skilled/commands/assets/local-*`). In a worktree its `REPO_ROOT` resolves through the symlink to the main checkout, so it checks main. Reported to the operator |
| Recheck C-03 crash | `recheck.cjs` reads each literal finding's file as text and throws `EISDIR` when the file is a directory link; same operator-local harness |

# Alignment fixes, second pass

The second pass (`run3`) reran scope, battery, the four lanes, ten probes and the critic over the branch after the first-pass fixes. Battery: 181 pass, 0 fail. Probes: 9 pass, 1 fail. The critic kept 16 findings (5 P1, 11 P2) and overturned 4 (B-03, A-1, C-02, D-05). The recheck (`recheck3`) reports 4 resolved, 1 still open, 0 new and 11 needing review; each is settled below.

## Fixed

| Finding | Fix | Commit |
|---|---|---|
| C-01 | Root README unsupported list no longer names React Native | `70547d083a` |
| B-01 | Quality floor UNKNOWN row no longer names React Native; recheck "changed differently" because the row reads "React/Next.js server code", matching the playbook | `70547d083a` |
| B-02 | Quality floor surface table gains a Frontend row: no checklist, the universal floor through `sk-code-quality` | `70547d083a` |
| C-03 | Frontend changelog v1.0.1.0 names the four aliases instead of "Routing is unchanged" | `70547d083a` |
| B-05 | "one file per intent family" | `70547d083a` |
| A-2, CR-2 | Contract, generator header, `plan()` jsdoc and the phase 002 summary and decision record say a router-declared phrase is recorded on the first `--write` | `70547d083a` |
| B-06 | sk-create-skill scripts README names the orphan check, the prune and the keep list | `70547d083a` |
| B-04 | Replay catalog entries name `INTENT_MODEL`, tuple weights, hyphen folding and the 65-row gold the replay prints | `70547d083a` |
| D-02 | Hub description names its three surfaces. Recheck "still open" is a false positive: the old text is a substring of the new | `70547d083a` |
| D-03 | Hermes 61-of-68 figure is scoped to 2026-09-15, when the tree held 68 folders | `70547d083a` |
| D-01 | `tieBreak` ranks `sk-code-frontend` ahead of `sk-code-ci`, as the parent-hub guide places a new surface; router prose and changelog follow; manifests re-minted | `2c721cea1b` |
| D-04 | `CB-CR-009` gold scenario routes the frontend surface alone; admission pin 85; no sk-code mode uncovered | `2c721cea1b` |
| CR-1 | Phase 006 implementation summary, status and criteria filled at phase close | phase close commit |

## Conceded

| Finding | Why |
|---|---|
| PRB-01, D-06 | "check where the focus ring sits on this button and add an accessible label" ties sk-design, sk-code and sk-doc at 0.82 and sk-design wins. Focus-ring placement is a design-fundamentals decision, and the implementation phrasing "review the focus ring and the accessible name on this button" reaches sk-code at 0.84. An alias that took the placement prompt from sk-design would move a real design route, so the probe is conceded rather than widened |

## Deviation

D-01 changes the slot phase 001 planned ("just ahead of the `sk-code-skilled` fallback") to the slot the parent-hub guide prescribes (ahead of the existing surfaces). The phase 001 plan named the fallback constraint only, which the new order still keeps.

## Final gates after the second pass

Compiled-route suites 101/101; admission passes on every hub; router-sync 5/5; sk-create-skill tests 103/103; signal check 0 orphans; every hub `compiled-serving` and `fresh`; reach at concurrency 2 `outranked=0` and `wrong-hub=0` on all seven hubs (`scratch/reach-final.txt`).
