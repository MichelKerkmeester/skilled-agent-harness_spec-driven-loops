# Iteration 5: Q2 part 2 — an external user adds their own surface (sk-code-myapp)

## Focus
Q2 part 2 (dispatch): in a throwaway copy with `sk-code-obsidian` and `sk-code-webflow` deleted, add a minimal user surface `sk-code-myapp` (Rails/Python stand-in) the way the documented scaffold path says (sk-doc create-skill parent-hub guidance read first), register it where the hub requires, re-mint or sync the route manifest, then run the same checks plus compiled-route prompts that match both the new surface and opencode. Record hand edits, failures, and which surface wins a tie with opencode.

Copy: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-dsflash-devin-i4.ot15` — the iteration-4 throwaway copy, reused (deviation from "fresh": it survived, still holds the deletion treatment state plus the baseline commit; every command below was re-run in it this iteration). Nothing in the worktree was modified.

## Actions Taken
1. rsync'd the authored runtime-engine closure (`specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/` → copy `specs/...`), exit 0, to unblock the sync script that failed in iteration 4 on a missing resolver (`resolve.cjs` now present).
2. Scaffolded `.skilled/skills/sk-code/sk-code-myapp/SKILL.md` (+ `README.md`, empty `references/`) — minimal surface packet with `packetKind: surface` frontmatter, modeled on the sk-code-obsidian shape.
3. Registered it by hand (node JSON edit, exit 0, printed `EDITS OK; tieBreak= ["sk-code-quality","sk-code-review","sk-code-opencode","sk-code-obsidian","sk-code-webflow","sk-code-myapp"]`): `hub-router.json` routerSignals entry + 2 vocabularyClasses + tieBreak append; `mode-registry.json` modes[] surface entry + `extensions.surface-axis.surfaces` append.
4. Re-mint: `node .skilled/bin/compiled-route-sync.cjs` → exit 1 (all hubs).
5. Probes: guard; four `compiled-route.cjs` runs; `parent-skill-check.cjs`; `ci-skill-root-metadata.cjs`; advisor.
6. Control: `git checkout -- .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json` (copy only, exit 0) → guard fresh, exit 0; the same route prompts return packet-bearing JSON again.

## Findings
Format: `| class | claim | evidence | priority |`. Every row was opened in this iteration; copy-observed rows cite the command run in the copy.

| class | claim | evidence | priority |
| --- | --- | --- | --- |
| BREAK | **Registering a user surface invalidates the compiled manifest and the guard demands a re-mint.** After the two hand edits, `compiled-route-guard.cjs` exits 1 with `sk-code stale-manifest` and `1 hub(s) need attention. Re-mint: sk-code`. Control: restoring the two files returns `All hubs fresh or excused`, exit 0. | copy exec: guard exit 1 (stale) → control exit 0 (fresh); edit target [SOURCE: .skilled/skills/sk-code/hub-router.json:7] | P1 |
| BREAK | **The shipped re-mint tool cannot run in a shipped-tree copy — and fails for all seven hubs, not just sk-code.** `node .skilled/bin/compiled-route-sync.cjs` → exit 1, `SYNC FAILED: authored closure failed to resolve hubs: sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, cli-classifier, sk-doc, sk-design`. The authored closure lives outside the shipped tree; this is not caused by the deletion or the new surface. | copy exec: sync exit 1, quoted line (repeated identically in the myapp state and after control restore) [SOURCE: .skilled/bin/compiled-route-sync.cjs:1] | P1 |
| BREAK | **With the manifest stale the front door silently stops resolving packets.** Four prompts — tie `"fix the myapp python service bug"`, surface-only `"myapp rails controller bug"`, opencode-only `"typescript cli bug"`, and `--surface-hint sk-code-myapp` on the tie prompt — each return exactly `{"servingAuthority":"legacy","hubId":"sk-code"}` with no `targets`/`packetId`, exit 0. Control (fresh manifest): the same tie prompt returns `packetId sk-code-opencode`, `selectionKind single`, `generation 2`, `effectivePolicyHash 8cd6f489…`. The user's registered surface is unreachable, and the degradation is exit-0 silent. | copy exec: 4 stale-state route runs (exit 0, stub) vs control runs R3-R5 (packet-bearing JSON, exit 0) | P1 |
| BREAK | **`parent-skill-check.cjs` on sk-code goes 113 → 118 invariant failures when the user surface is added; the five new ones are exactly its missing artifacts.** `FAIL 3d-files` (missing `changelog/`), `FAIL 6b` (registered mode absent from the hub SKILL.md mode table), `FAIL 5k-alias` (registry alias not a keyword of its routerSignal classes), `FAIL 5k-packet` (packet name not a description keyword), `FAIL 5k-canary` (no canary case routes to it). Final line: `FAIL: parent-skill-check — 118 invariant failures, 0 warnings`. | copy exec: psc exit 1; myapp lines quoted verbatim; FAIL count 120 rows in `psc.out` | P1 |
| BREAK | **The package gate's single failure widens to a three-way `MODE_LEAF_SET_COLLISION`.** `ci-skill-root-metadata.cjs` exit 1: `FAIL [H] sk-code` — `MANIFEST_REGENERATION_FAILED: sk-code: cannot regenerate leaf-manifest.json — MODE_LEAF_SET_COLLISION: workflowModes "sk-code-webflow" and "sk-code-obsidian" and "sk-code-myapp" receive hash-equal leaf sets (4f53cda18c2b); give each mode its own leafScopes in leaf-scopes.json`; `checked=14 passed=13 failed=1`. Adding a surface inherits and widens the existing collision; the `--fix` hint cannot help because authored files must be written by hand. | copy exec: root-metadata exit 1, quoted lines | P1 |
| DOC | **The documented scaffold path names the router files but none of the doctor's extra requirements.** `sk-create-skill/SKILL.md` names "Creating parent-hub router files such as `mode-registry.json`, `hub-router.json`, `description.json`" and ships `parent-skill-registry-template.json` / `parent-skill-hub-router-template.json`; nothing in the read portion names the changelog dir, hub SKILL.md mode table, alias↔keyword agreement, description keyword, canary case, or leafScopes that the rows above fail on. | [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:25] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:59] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:60] | P1 |
| ORDER | **Which surface wins a tie with opencode today: sk-code-opencode.** Unregistered, the tie prompt resolves `sk-code-opencode` single because `code-opencode-runtime` owns "python" and the shipped tieBreak lists `sk-code-opencode` ahead of any user-added surface; registered, the stale manifest prevents the tie from being evaluated at all. A user surface wins only if a working re-mint exists *and* the tieBreak/scores put it first. | copy exec: control route R3 (`packetId sk-code-opencode`) + stale-state stub runs; [SOURCE: .skilled/skills/sk-code/hub-router.json:7] | P1 |
| PRESENCE | **The registry and router still ship the two example surfaces as installed.** `mode-registry.json` surfaces list line 19, webflow mode entry line 61, obsidian mode entry line 98; `hub-router.json` routerSignals webflow line 31, obsidian line 42, tieBreak line 7. (Partially new — iteration 1 anchored the same files; line numbers confirmed here.) | [SOURCE: .skilled/skills/sk-code/mode-registry.json:19] [SOURCE: .skilled/skills/sk-code/mode-registry.json:61] [SOURCE: .skilled/skills/sk-code/mode-registry.json:98] [SOURCE: .skilled/skills/sk-code/hub-router.json:31] [SOURCE: .skilled/skills/sk-code/hub-router.json:42] | P1 |
| OK | **The advisor is unaffected by surface registration.** `advisor_recommend` for "fix a bug in myapp" exits 0, top-1 `sk-code` confidence 0.82 (mcp-tooling also 0.82). The advisor carries no surface ids, so registration edits are invisible to it — consistent with iterations 3-4. | copy exec: advisor exit 0, quoted fields | P2 |

### Options (Q3 evidence from this iteration)

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| A. Priority/rank field in `mode-registry.json` | modes[] entries ([SOURCE: .skilled/skills/sk-code/mode-registry.json:61]) + compiler + guard + doctor | schema change across the compiler chain | guard staleness and the mint dependency still apply | "Hand-edit `tieBreak` instead" — fails: observed guard stale → legacy stub, no packet resolution |
| B. `native`/`fallback` flag on sk-code-opencode, tieBreak derived at mint | one registry flag + compiler rule | needs a working mint | same mint dependency (observed: sync fails for all hubs) | "Document the intended tieBreak order" — fails: prose cannot re-mint, and the guard goes stale on the edit |
| C. `--surface-hint` path | runtime hint | none | operates inside compiled serving only | "Always pass `--surface-hint`" — fails: the hint run returns the same legacy stub while stale |
| D. Ship the default without the two examples, opencode last among surfaces | registry + router + canary regeneration (carried from iterations 3-4) | coordinated data edit + regenerations | parity breakage until all artifacts regenerate | "Docs-only marking" — fails: the doctor and package-gate failures happen on disk regardless of prose |

## Questions Answered
- **Q2 fully** — deletion half (iteration 4) + addition half (this iteration). Caveat recorded: the post-successful-re-mint branch is unobserved because the shipped copy cannot re-mint.

## Questions Remaining
- Q1 (`ROUTER.md:265-618` §8–§11 only) — still open from iteration 3.
- Q3 (now with observed cost data for every option), Q4, Q5, Q6 — untouched.

## Next Focus
Q3 with these cost rows, and settle the mint question first: run `compiled-route-sync.cjs` in a copy that includes the full `specs/` tree (the recipe's `--exclude specs` is why the authored closure cannot resolve), then re-run the tie prompt to see whether a registered user surface can actually reach a tie.

## Ruled Out
- Docs-only registration instructions (hand-edit registry + router): observed to break routing entirely without a working mint.
- `--surface-hint` as the tie fix: same legacy stub under a stale manifest.
- Treating the sync failure as deletion-caused: it fails for all seven hubs with the examples present in the authored inputs.

## Dead Ends
- The mint path cannot be judged inside a `specs`-excluded copy; candidate for the reducer: "re-mint verification requires a full-tree copy" (not promoted to exhausted — one more angle remains).

## Edge Cases
- Missing dependency: copy recipe excludes `specs/`; sync fails on the authored closure. What would settle it: a full-tree copy or the real mint entry point.
- Partial success: registration + probes ran end-to-end; the successful re-mint branch did not. Status `complete` (the in-scope questions are answered; the unobserved branch is named).
- Deviation: reused the iteration-4 copy instead of creating a fresh one; still a throwaway copy outside the worktree, and every command was re-run this iteration.
- Contradictory evidence: none new.

## Sources Consulted
- Copy (throwaway, outside the worktree): `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-dsflash-devin-i4.ot15` — commands: `rsync` (resolver), scaffold heredoc, node JSON edits, `compiled-route-sync.cjs` (×2), `compiled-route-guard.cjs` (×2), `compiled-route.cjs` (×6), `parent-skill-check.cjs`, `ci-skill-root-metadata.cjs` (×2), `skill-advisor.cjs advisor_recommend`, `git checkout --` (×1); all exit statuses quoted above.
- [SOURCE: .skilled/skills/sk-code/hub-router.json:7], [SOURCE: .skilled/skills/sk-code/hub-router.json:31], [SOURCE: .skilled/skills/sk-code/hub-router.json:42]
- [SOURCE: .skilled/skills/sk-code/mode-registry.json:19], [SOURCE: .skilled/skills/sk-code/mode-registry.json:61], [SOURCE: .skilled/skills/sk-code/mode-registry.json:98]
- [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:25], [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:59], [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:60]
- [SOURCE: .skilled/bin/compiled-route-sync.cjs:1]
- State files: `deep-research-config.json`, `deep-research-strategy.md`, `iteration-004.md` (lineage-local)

## Assessment
- New information ratio: 0.88 — 5 fully new (stale-manifest on registration, legacy-stub degradation, five new doctor invariants, hand-edit inventory, scaffold-doc gap), 4 partially new (deeper sync failure, widened leaf-set collision, advisor invisibility confirmation, confirmed anchor line numbers); +0.10 simplicity bonus for answering Q2.
- Questions addressed: Q2 (both halves)
- Questions answered: Q2

## Reflection
- What worked and why: reusing the iteration-4 copy with its baseline commit gave a decisive control pair for free — register (stale) vs `git checkout` restore (fresh) converted causality into before/after evidence inside one exec, and the guard's own message named the re-mint that then failed.
- What did not work and why: the `specs`-excluded copy cannot exercise the mint path, so the successful-re-mint branch stayed unobserved; the scaffold-guide read covered only the first 130 lines of `sk-create-skill/SKILL.md`, leaving the deeper parent-skill references unread.
- What I would do differently: include `specs/` (or at least the authored closure) in the copy whenever the focus names the mint script, and read the parent-skill references up front rather than the hub SKILL.md only.
