# Iteration 1: Q7 — ROUTER.md intent→leaf ownership and the F10 stack-agnostic gap

## Focus

Q7 / F10 deep dive: for every intent in `.skilled/skills/sk-code/ROUTER.md` (prose maps §4–§6 and the machine `RESOURCE_MAP` §11), enumerate the leaves it loads and which packet owns them; inventory `shared/` and `sk-code-skilled` leaves that could serve the stack-agnostic intents (DEBUGGING, PERFORMANCE, DEPLOYMENT, ACCESSIBILITY, IMPLEMENTATION, and siblings) for a user whose only surfaces are opencode + their own; then observe — in a throwaway full-tree copy with `sk-code-webflow` and `sk-code-obsidian` deleted — what the hub's own deterministic router emits per intent; propose the smallest fix (R6).

## Actions Taken

1. Read `ROUTER.md` in full (618 lines): §2 INTENT_SIGNALS prose, §4 WEBFLOW MAP, §5 MOTION_DEV MAP, §6 OPENCODE MAP, §7 VERIFICATION COMMANDS, §11 machine projection (`DEFAULT_RESOURCE`, `INTENT_SIGNALS`, `RESOURCE_MAP`, `SHARED_CONTROL_RESOURCES`, route-time slicing rule).
2. Inventored every file under `shared/` (12 files) and `sk-code-skilled/references` + `assets` (~80 files); read frontmatter of candidate stack-agnostic leaves.
3. Located the hub's own loader: `sk-code-skilled/assets/scripts/router-replay-lib.cjs` exports `routeSkillResources({skillRoot, taskText})` (line 649) — it parses the router (hub-router.json → surface router → `RESOURCE_MAP`), scores intents, assembles resources and reports `missingResources`.
4. Throwaway copy probe: `X=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//r2-swe2max-devin-i1.y8Pl` (APFS clone of prepared base, ~4s). Ran a 16-task battery through `routeSkillResources` BEFORE deletion (all `miss:0`), then `rm -rf .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` inside the copy only, and re-ran.

## Findings

| class | claim | evidence | sev |
| --- | --- | --- | --- |
| BREAK | After deleting the two example packets, the replay still EMITS paths that no longer exist — the route output references dead files wherever an intent's map names the always-loaded Motion overlay or obsidian leaves: MOTION_DEV emits 10 with 7 missing; OBSIDIAN_PLUGIN emits 7 with 4 missing; PERFORMANCE and ACCESSIBILITY each emit 1 dangling path (`sk-code-webflow/references/animation/performance-and-pitfalls.md`, which is also the Motion overlay). | copy `$X`, `XROOT=$X node driver.cjs` AFTER table: `{"want":"MOTION_DEV","res":10,"miss":7}`, `{"want":"OBSIDIAN_PLUGIN","res":7,"miss":4}`, `{"want":"PERFORMANCE","res":5,"miss":1}`, `{"want":"ACCESSIBILITY","res":4,"miss":1}`; detail run listing `- sk-code-webflow/references/animation/performance-and-pitfalls.md` under missing for PERFORMANCE and ACCESSIBILITY | P1 |
| OK | Intents whose mapped leaves are surface-sliced degrade cleanly with `miss:0` for an UNKNOWN-surface task — they emit only the preamble plus mapped `shared/` entries: DEPLOYMENT, TESTING, ANIMATION, FORMS, VIDEO, HOOKS, CONFIG emit preamble-only or preamble+opencode/shared leaves with zero missing. | AFTER table: `{"want":"DEPLOYMENT","res":3,"miss":0}`, `{"want":"DEBUGGING","res":5,"miss":0}`; DEBUGGING detail lists exactly `shared/references/stack-detection.md`, `phase-detection.md`, `universal/code-quality-standards.md`, `universal/error-recovery.md`, `universal-debugging-checklist.md` | P2 |
| ORDER | Union-level leaf ownership (RESOURCE_MAP, ROUTER.md:351–580) is example-dominated for the intents F10 names: DEPLOYMENT 6/6 webflow; TESTING 1/1 webflow; ANIMATION 7/7 webflow; MOTION_DEV 9/9 webflow; ACCESSIBILITY 7/7 webflow; FORMS 5/5 webflow; VIDEO 4/4 webflow; LANGUAGE_STANDARDS 22/22 webflow; OBSIDIAN_PLUGIN 4/4 obsidian; DEBUGGING 8/10 webflow + 2 shared; PERFORMANCE 9/10 webflow + 1 shared; VERIFICATION 3/6 webflow + 1 shared + 2 opencode; IMPLEMENTATION ~21/31 webflow + 1 shared + 9 opencode; CODE_QUALITY 2/15 webflow + 2 shared + 9 opencode + 1 sk-code-review. | ROUTER.md:351-580 (each RESOURCE_MAP row read); ownership by path prefix | P1 |
| OK | F10 needs scoping: §11's route-time slicing rule means a task never pulls another surface's files — UNKNOWN falls back to "preamble plus the shared-tier entries its matched intents map and the Motion overlay only"; a detected OPENCODE surface loads only the opencode slice. So an opencode-surface DEBUGGING task already loads zero webflow files today; the post-delete damage is (a) dangling emitted paths for overlay/obsidian-named rows and (b) union rows pointing at a deleted packet until the re-mint regenerates the projection. | ROUTER.md:602-609 (route-time slicing), replay BEFORE/AFTER showing identical resource lists for DEBUGGING/IMPLEMENTATION (`res:5`/`res:4` both runs) | P1 |
| ORDER | The projection is GENERATED, not hand-maintained: "a drift guard enforces that the parent projection equals the union of all surface maps plus the parent-owned universal/shared tier"; each surface's packet-local map is re-prefixed and unioned. After delete + re-mint, webflow/obsidian rows regenerate out of the map automatically — the dangling state observed in the copy is the pre-re-mint window. | ROUTER.md:41 (Bundled Evidence Surfaces / union invariant); preamble's base control run names compiled-route-guard and compiled-route-sync --check green | P1 |
| PRESENCE | Three authored stack-agnostic workflow leaves exist but are referenced by NO RESOURCE_MAP row — `shared/references/workflow-implement.md`, `shared/references/workflow-debug.md`, `shared/references/workflow-verify.md`, each frontmatter-described as "consumed by every surface packet". They are the cheapest correct coverage for IMPLEMENTATION / DEBUGGING / VERIFICATION once the webflow rows regenerate out. | `grep -n "workflow-debug\|workflow-implement\|workflow-verify" ROUTER.md` → no hits; frontmatter descriptions read from the three files; file list under `shared/` (12 files) | P1 |
| PRESENCE | Other shared/opencode leaves already serving or able to serve: DEBUGGING → `shared/references/universal/error-recovery.md` + `shared/references/universal-debugging-checklist.md` (already mapped, ROUTER.md:404-416); PERFORMANCE → `shared/references/performance-loading-checklist.md` (already mapped, line 447); CODE_QUALITY → `shared/references/universal/code-style-guide.md` + `code-quality-standards.md` + `sk-code-review/assets/code-quality-checklist.md` + 9 opencode checklists (lines 387-403); VERIFICATION → `shared/references/universal-verification-checklist.md` + `sk-code-skilled/references/shared/alignment-verification-automation.md` (lines 417-425); IMPLEMENTATION → `shared/references/universal/multi-agent-research.md` + `sk-code-skilled/references/shared/{universal-patterns,code-organization}/*` + 4 authoring checklists (lines 352-385). | ROUTER.md rows cited per intent | P2 |
| PRESENCE | DEPLOYMENT, ACCESSIBILITY, TESTING, ANIMATION, MOTION_DEV, FORMS, VIDEO, OBSIDIAN_PLUGIN have NO stack-agnostic or opencode leaf anywhere in the repo — every mapped row is an example-packet path. Post-delete these intents correctly map to preamble-only for a non-webflow task; that is absence of generic content, not a routing bug. | ROUTER.md:426-436, 449-497, 502-525, 554-559; `find shared sk-code-skilled/references sk-code-skilled/assets` file inventory (no deployment/accessibility/forms/video/animation leaf outside the example packets) | P1 |
| DOC | §7 VERIFICATION COMMANDS still names three `sk-code-webflow/assets/scripts/*.mjs` commands as required evidence for WEBFLOW surface — a doc pointer that survives any map re-mint and must be handled by the R3/R4 delete-path docs, not by RESOURCE_MAP edits. | ROUTER.md:250 | P2 |

## Options and recommendation (R6)

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| R6 (recommended): map the three orphan shared workflow leaves | Add `"shared/references/workflow-implement.md"` to the IMPLEMENTATION row (ROUTER.md:352), `"shared/references/workflow-debug.md"` to DEBUGGING (ROUTER.md:404), `"shared/references/workflow-verify.md"` to VERIFICATION (ROUTER.md:417); add all three to `SHARED_CONTROL_RESOURCES` (ROUTER.md:589-597 — its contract: "holds every contained shared/ path that RESOURCE_MAP references but that has no single packet owner"); add the matching prose rows in §3 LOAD TIERS ALWAYS-row note or intent notes; then re-mint per R3. | ~6 added lines in one file + the already-required re-mint | Low: union invariant still holds — the additions live in the parent-owned shared tier the invariant explicitly allows (ROUTER.md:41). | Do nothing / rely on UNKNOWN fallback: fails because replay provably emits dangling paths for 4 intents (BREAK row above). Hand-deleting the webflow rows from §11 instead of re-minting: fails the union drift guard and is overwritten/flagged by the generated projection; also leaves prose §4–§5 and §7 pointing at the deleted packet. |
| R6 rejected extension: author new generic DEPLOYMENT/ACCESSIBILITY/TESTING leaves under `shared/` | New `shared/references/universal-*.md` files + map rows + control entries | High: net-new doctrine content, and `prevent-overengineering` — a surface-specific concern (deploy targets, a11y browser checks, test runners) belongs in the user's own surface packet, which the union will pick up at re-mint | Duplicates what R1's "your own surface outranks opencode" design already solves | Adding rows pointing at the user's hypothetical surface: ROUTER.md cannot name files that don't exist in the repo. |

## Ruled Out

- Hand-editing §11 rows to remove webflow paths — defeats the generated-projection contract (ROUTER.md:41) and the re-mint already does it.
- Treating `routeSkillResources` `resources` output as a bug — it faithfully emits the map; the map itself is stale until re-mint.

## Dead Ends

- No per-surface `ROUTER.md`/map file found at `find -maxdepth 2` inside the surface packets — the per-packet maps ROUTER.md:41 describes live deeper or are generated; a later iteration (Q9/Q11) can locate the authored source the re-mint reads.

## Edge Cases

- Missing dependency: the copy's replay ran through `router-replay-lib.cjs` directly (no hub CLI wrapper found at maxdepth 2); a wrapper, if one exists elsewhere, would exercise the same lib.
- Partial success: probe tasks carried no file markers, so surface detection returned UNKNOWN for 15/16 probes (LANGUAGE_STANDARDS → OPENCODE). UNKNOWN is the worst-case fallback and still demonstrates the break; an OPENCODE-surface task would emit even fewer paths.

## Sources Consulted

- [SOURCE: .skilled/skills/sk-code/ROUTER.md:41] union/drift-guard invariant
- [SOURCE: .skilled/skills/sk-code/ROUTER.md:250] WEBFLOW verification commands
- [SOURCE: .skilled/skills/sk-code/ROUTER.md:316-598] machine router block (DEFAULT_RESOURCE, INTENT_SIGNALS, RESOURCE_MAP, SHARED_CONTROL_RESOURCES)
- [SOURCE: .skilled/skills/sk-code/ROUTER.md:602-609] route-time surface slicing
- [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:649] `routeSkillResources` signature/behavior
- [SOURCE: .skilled/skills/sk-code/shared/references/workflow-debug.md:1-4] frontmatter "consumed by every surface packet"
- [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:1-4] same
- [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:1-4] same
- Command evidence: copy `$X` BEFORE/AFTER `routeSkillResources` battery (16 tasks, exit 0, output quoted above); `rm -rf` executed only under `$X`.

## Assessment

- New information ratio: 0.8
- Questions addressed: Q7
- Questions answered: Q7 — the three unmapped `shared/references/workflow-*.md` leaves serve IMPLEMENTATION/DEBUGGING/VERIFICATION; DEPLOYMENT/PERFORMANCE/ACCESSIBILITY/etc. have no stack-agnostic leaf and correctly fall back to preamble after re-mint; R6 = 3 RESOURCE_MAP rows + 3 SHARED_CONTROL_RESOURCES rows + prose row + re-mint.

## Reflection

- What worked: running the hub's own replay lib in the throwaway copy converted F10 from a prose claim into measured per-intent load/miss counts, and revealed the slice rule already limits real damage to overlay-named rows — a sharper result than "loads almost nothing".
- What did not: surface detection needs file markers in the task text; my probe tasks produced UNKNOWN, which is still the right worst case but leaves OPENCODE-surface slicing unmeasured for these intents.
- Do differently: next iteration should pass task text containing `.skilled/` markers to force OPENCODE detection and confirm the opencode slice per intent.

## Recommended Next Focus

Q10 (R1–R4 stress test) or Q9 (`/create:skill-parent update --surfaces` five doctor legs) in the same copy `$X` while it lives; also locate the authored per-surface map source the re-mint reads (ROUTER.md:41) — needed for exact R6 re-mint steps.

## SCOPE VIOLATIONS

None. All mutations (`cp -cR` clone, `rm -rf` of the two example packets, `driver.cjs`) happened only under the throwaway copy `$X`; the repository was read-only.
