# Iteration 8: End-to-end external-user journey in a throwaway full-tree copy

## Focus

Operator-added UX focus: act as an external user who clones the repository, follows only what
README.md and the sk-code README say, deletes the obsidian/webflow example surfaces, and runs the
verification tooling. Per step: the doc line that told the user to do it, the command, exit status,
the exact message shown, whether it says what to do next, and what the user had to know that nothing
told them. All probes ran in `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/swe2max-devin-i8-a`
(APFS clone, pristine except the deletions noted).

## Actions Taken

1. Read state (config, state log, strategy, registry); confirmed iteration 8, session `dr-025r2-swe2max-devin-2026-10-12T18:58:06.247Z`, only Q12 open.
2. Copy survey: `ls -d .skilled/skills/sk-code*` then `.skilled/skills/sk-code/sk-code-*`; greps over README.md and `.skilled/skills/sk-code/README.md` for surface/example/adapt wording.
3. Read the doc an external user actually follows: README.md:236-244 ("Adapting to Your Stack") and README.md:1376-1453 (customization guide, five-step adaptation list).
4. Deleted `.skilled/skills/sk-code/sk-code-obsidian` and `.skilled/skills/sk-code/sk-code-webflow` (exit 0), then ran `compiled-route.cjs`, `compiled-route-status.cjs --all`, `compiled-route-sync.cjs --check`, `compiled-route-guard.cjs`, `compiled-route-manifest.cjs refresh`, and `skill-advisor.cjs advisor_recommend`, recording exit status and output.
5. Greps over `hub-router.json` and `mode-registry.json` post-delete to explain observed routing.

## Findings

| class | claim | evidence | severity |
|-------|-------|----------|----------|
| DOC | The public customization guide's step 4 tells the user to hand-edit `ROUTER.md §11` ("Update the RESOURCE_MAP in ROUTER.md §11 so each intent key points at your renamed packet resources"), while ROUTER.md itself declares §11 a machine projection unioned from surface maps with a drift guard enforcing equality — the guide instructs a hand edit that produces authored-drift, and never names the re-mint that regenerates it. | README.md:1450; .skilled/skills/sk-code/ROUTER.md:39-45 | P0 |
| DOC | The adaptation path an external user is given is five manual steps (replace packets; register in mode-registry.json + hub-router.json + SKILL.md §1; stack-detection.md; ROUTER.md §11; changelog). No step names `/create:skill-parent`, any `compiled-route-*` command, a doctor leg, or `5k-canary`. `skill-parent` appears only at README.md:820 and :1146 (catalogue mentions, not the adaptation flow); the sk-code README has zero hits. | README.md:1445-1451; grep -c skill-parent → README.md:2, sk-code README:0 | P0 |
| PRESENCE | Nothing marks obsidian/webflow as examples. README.md:800 calls them "Three ready surfaces"; the sk-code README (lines 23, 55-57, 138-140) lists them as peers of opencode; README.md:1384's "Replace the shipped Webflow + OpenCode + Obsidian surfaces with your own" is the only signal they are replaceable — and it groups opencode, the surface R1 says stays native, into the same replace-list. | README.md:800,1384; .skilled/skills/sk-code/README.md:23,55-57,138-140 | P1 |
| DOC | Surface packets nest at `.skilled/skills/sk-code/sk-code-<name>/`, not `.skilled/skills/sk-code-<name>/`. A user who reads "Replace the surface packets (sk-code-webflow/, …)" at README.md:1447 and deletes at the top level removes nothing; only `ls` inside `sk-code/` reveals the nesting. The doc never gives the path. | `ls -d .skilled/skills/sk-code*` → only `sk-code`; `ls -d .skilled/skills/sk-code/sk-code-*` → five nested dirs; README.md:1447 | P1 |
| BREAK | After deleting the two surface dirs, `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "fix jank in my webflow landing page animation"` still exits 0 and routes to `{"packetId":"sk-code-webflow","packetKind":"surface"}` — the compiled map serves targets into deleted directories with no warning. | command output, ROUTE1=0 | P0 |
| BREAK | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"fix my webflow landing page"}'` exits 0 and recommends sk-code with `compiledRoute.targets[0].packetId = sk-code-webflow` at confidence 0.8735. The Gate-2 tool every runtime consults sends users to the deleted packet. | command output, ADV=0 | P0 |
| BREAK | Every health signal stays green on the broken state: `compiled-route-guard.cjs` exits 0 with "All hubs fresh or excused"; `compiled-route-status.cjs --all` exits 0 reporting `servingAuthority:"compiled"`, `manifestFreshness.fresh:true` for sk-code. Freshness validates runtime-vs-source, never packet existence — the user is told everything is healthy. | GUARD=0 output; STATUS=0 JSON | P0 |
| BREAK | `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` exits 0 (`refreshed:true`, `manifestValid:true`) yet the webflow route is unchanged — refresh re-derives from `hub-router.json` (tieBreak:7, entries :31-45, alias classes :73-90) and `mode-registry.json` (:19,61,98), which still register the deleted surfaces. Even the undocumented correct command cannot heal routing until the user also scrubs both registries, and refresh reports success while doing it. | REFRESH=0 JSON; same route output; hub-router.json:7,31-45,73-90; mode-registry.json:5,19,61,98 | P0 |
| BREAK | A stack-agnostic prompt — `"debug a slow function in my app"` — returns `{"action":"defer","targets":[]}` post-delete: with the webflow surface gone, the debugging intent resolves to nothing at all. User-side corroboration of F10. | ROUTE2=0 output | P1 |
| DOC | The one failing check a user can find, `compiled-route-sync.cjs --check`, exits 1 and prints a 55-line list of authored-closure files under the specs archive — paths the docs never mention — instead of a remediation the user can act on (consistent with the iteration-6 finding that its printed remediation names the command that fails). | SYNC=1 output head | P1 |
| OK | `rm -rf` of the two nested surface dirs exits 0 and no file outside them is touched — the delete step itself is clean; all damage is in the stale registries/compiled map, not the filesystem operation. | RM_EXIT=0; ls shows remaining `sk-code-{opencode,quality,review}` | OK |

## What the user had to know that nothing told them

- The surfaces nest inside `.skilled/skills/sk-code/` (the doc says `sk-code-webflow/` with no path).
- Deleting the packet dirs is not enough: `hub-router.json` and `mode-registry.json` must be scrubbed first, or every route keeps resolving the deleted packets.
- `compiled-route-manifest refresh --hub sk-code --skill-root .skilled/skills/sk-code` exists at all — no doc names it, and its usage error (`REFRESH=2` on a bare `refresh`) is the only hint at its arguments.
- ROUTER.md §11 must NOT be hand-edited despite README step 4 saying to.
- `sync --check`'s 55-file dump refers to the authored closure under `specs/sk-doc/z_archive/019-skill-routing-refactor/`, which no user-facing doc names in this flow.

## Options

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|--------|----------------------------|------|------|-------------------------------|
| A: fix the guide — mark the two surfaces as examples, give the nested path, replace step 4's hand-edit with "remove the entries from mode-registry.json + hub-router.json, then `compiled-route-manifest refresh --hub sk-code --skill-root .skilled/skills/sk-code`", and name `/create:skill-parent update --surfaces` as the add path | README.md:800,1384,1445-1451 only | ~10 doc lines | Low; no tooling change | Naming the surfaces "examples" in prose without fixing step 4 leaves the authored-drift trap; adding the command without the registry scrub order leaves refresh reporting success over stale targets — both halves are needed and both are doc edits |
| B: one doctor/guard leg that fails when a registry-listed packet dir is missing | one check beside `compiled-route-guard.cjs` in `.skilled/bin/` | small new script + wiring | Low; catches silent staleness A cannot | Relying on A alone: docs fix the informed user but nothing flags the broken state for the user who already half-followed them — the cheapest *detection* is one existence check, not a new sync layer |
| C: status quo — document nothing, let users discover registries + refresh | none | zero | High (observed: stale routes at 0.87 confidence, all guards green) | Doing nothing fails on observed evidence: even the correct undocumented command exits 0 while serving deleted targets |

## Before vs after user journey

- **Today:** clone → README presents "three ready surfaces" → user guesses the delete path (wrong depth first time) → routes and the advisor keep sending them to deleted packets at 0.87 confidence → guard and status report everything fresh → a generic debugging prompt defers to nothing → the only visible failure is a 55-line spec-archive file dump → recovery requires knowing two registries, a refresh command, and an authored closure that no doc names.
- **After A+B:** README marks the surfaces as examples, gives the nested path and the exact scrub-then-refresh sequence → routes resolve only live packets → the missing-packet doctor leg prints "sk-code-webflow is registered but .skilled/skills/sk-code/sk-code-webflow is absent — remove the registry entries or restore the packet" → the debugging intent falls back to opencode/shared leaves.

## Questions Answered

None of the strategy checkbox questions — this was the operator-added UX focus; its evidence feeds the Q11-adjacent journey and the R1-R4 stress test rather than Q12 (X1-X9 re-challenge), which remains open.

## Questions Remaining

- Q12 (X1-X9 re-challenge) — untouched this iteration.
- Whether a registry-scrubbed copy heals the debug-intent defer (only the refresh was probed; the full mode-registry + hub-router scrub + re-mint in COPY_B remains unrun — flagged for a later iteration if budget allows).

## Edge Cases

- Contradictory evidence: README.md:1450 (hand-edit §11) vs ROUTER.md:39-45 (machine projection, drift-guarded). Recorded as finding 1; the machine contract is better supported because the guard enforces it at commit time.
- Partial success: the full "add sk-code-rails" leg was not simulated in-budget (creating a conformant packet + registries exceeds the probe budget); the docs-side of add-surface was covered by finding 2 and prior iteration-2 evidence (5k-canary gate exit 1, tieBreak-last).

## Dead Ends

- `compiled-route.cjs --json` — not an option; correct form is `--hub <id> --prompt <text>` (usage line observed). Not a repo defect, just CLI shape.
- Bare `compiled-route-manifest.cjs refresh` — exits 2 usage; requires `--hub` + `--skill-root`.

## Sources Consulted

- README.md:236-244,800,820,1146,1376-1453
- .skilled/skills/sk-code/README.md:23,55-57,138-140
- .skilled/skills/sk-code/ROUTER.md:39-45
- .skilled/skills/sk-code/hub-router.json:7,31-45,73-90
- .skilled/skills/sk-code/mode-registry.json:5,19,61,98
- Command outputs (COPY_A): compiled-route.cjs ×3, compiled-route-status.cjs --all, compiled-route-sync.cjs --check, compiled-route-guard.cjs, compiled-route-manifest.cjs refresh, skill-advisor.cjs advisor_recommend — exits and output lines as recorded above

## Assessment

- New information ratio: 0.85 — 9 of 11 findings are new observed evidence (post-delete tool behavior, doc-line citations); 2 partially new (F10 user-side corroboration, sync-remediation echo of iteration 6).
- Questions addressed: the operator-added UX focus, end to end.
- Questions answered: none of the registry checklist items (Q12 remains).

## Reflection

- What worked and why: treating the README's own instructions as the script and running every health surface the repo ships exposed the silent-failure chain — the copy made deletion safe, and the tool exits plus JSON outputs gave quotable evidence at each step.
- What did not work and why: assuming the documented "replace" step plus a correct refresh would heal routing — refresh is registry-driven, so the deletion persists in hub-router/mode-registry; and assuming `compiled-route.cjs --json` was valid cost one probe (usage error, recovered in the same command block pattern).
- What I would do differently: run the registry-scrub variant in COPY_B in the same command that deletes, to capture whether the debug-intent defer heals — deferred to a later iteration if one has budget.

## Recommended Next Focus

Run the full docs-literal path in COPY_B: scrub `mode-registry.json` + `hub-router.json` of the two surfaces *then* refresh, and observe whether (a) the webflow prompt falls back or defers, (b) the debug intent recovers, (c) `sync --check` and the guard still pass — settling whether doc-fix A alone produces a working journey. Remaining open: Q12 (X1-X9 re-challenge).
