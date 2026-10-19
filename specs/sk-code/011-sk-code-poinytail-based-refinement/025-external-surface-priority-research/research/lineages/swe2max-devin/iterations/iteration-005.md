# Iteration 5: Q10 R2 stress test — drift-guard coupling to the obsidian/webflow examples

## Focus

Read every script `run-all-drift-guards.sh` runs plus every test/fixture naming
sk-code-webflow or sk-code-obsidian; classify each as stack-agnostic tooling (R2
scope) vs example-owned content; write the exact R2 code change; then in a
throwaway copy delete both examples, apply the change to verify-router-sync.cjs
only, rerun the suite, and judge whether R2 as written is complete.

## Actions Taken

- Read `run-all-drift-guards.sh` (4 guards: verify_alignment_drift.py --check-router,
  verify_stack_folders.py, verify-router-sync.cjs --checks 1a,1b,2,3,4, verify-doc-claims.cjs).
- rg'd all four guard scripts + the four test/fixture files for obsidian|webflow|surface.
- Read verify-router-sync.cjs end to end; extracted mode-registry.json mode entries,
  compared sk-code-webflow vs sk-code-obsidian SKILL.md router blocks.
- Throwaway copy `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-swe2max-devin-i5.5TtS`
  (APFS clone of prepared base). Deleted `.skilled/skills/sk-code/sk-code-obsidian` and
  `sk-code-webflow`, ran the suite (BASELINE_EXIT=1, 2 guards failed), applied a
  registry-derivation patch to verify-router-sync.cjs, re-ran (still 2 guards failed,
  but check 2 went PASS), then `git checkout -- .` restored the tree and re-applied the
  patch as a pristine-tree control (check 2 FAILED with 35 false problems).

## Findings

| class | claim | evidence | sev |
|---|---|---|---|
| ORDER | verify-router-sync.cjs is the only guard script that hardcodes the examples: `SURFACES=['sk-code-webflow','sk-code-skilled']`, `SURFACE_PACKETS=+sk-code-obsidian`; verify_alignment_drift.py and verify_stack_folders.py contain zero obsidian/webflow/surface-name hits. | .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:31-32; `rg -n -i 'obsidian\|webflow\|surface'` over the four scripts (exit 0; no hits in the two .py files) | P1 |
| BREAK | Baseline (examples deleted, no fix): suite exits 1 — router-sync check 1a 99 dead routes (hub-router/surface router still list deleted resources), check 2 `threw: ENOENT ... sk-code-webflow/SKILL.md`; doc-claims check `paths` 260 unresolved refs (ROUTER.md, shared/, sk-code-quality, hub SKILL.md:203). 1b, 3, 4 PASS; alignment-drift, stack-folders PASS. | `bash run-all-drift-guards.sh` in copy, exit 1: `FAIL check 1a ... (99 problem(s))`, `threw: ENOENT`, `doc-claims: 3/4`, `2 guard(s) FAILED` | P0 |
| BREAK | Naive R2 patch (derive both sets from mode-registry.json `packetKind==="surface"`, existence-filtered, SURFACES=those with non-empty parseRouter resourceMap) repairs check 2 post-deletion (PASS) but does NOT green the suite: 1a still 99 dead routes, doc-claims still 260 — so even a perfect tooling fix cannot pass without re-mint + doc scrub (R3 territory). | patched copy rerun: `PASS check 2`, `FAIL check 1a (99)`, `FAIL check paths (260)`, `2 guard(s) FAILED` | P0 |
| PRESENCE | The naive patch is NOT behavior-preserving: on the pristine control tree the same patch makes check 2 FAIL with 35 `parent map <INTENT> is missing child path sk-code-obsidian/...` — obsidian's SKILL.md RESOURCE_MAP is non-empty (SKILL.md:92), so a non-empty-map filter wrongly promotes it to union child. | control run: `FAIL check 2 ... (35 problem(s))` vs baseline `router-sync: 4/5 checks passed`; .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:92 | P0 |
| ORDER | mode-registry.json carries no union-child discriminator: all three surfaces are identical `packetKind:"surface", backendKind:"evidence-base"` entries; the two-tier model (union children webflow+opencode vs cite-only packet obsidian) exists ONLY in the guard's hardcoded lists. | `node -e` dump of mode-registry.json modes (exit 0) | P0 |
| DOC | sk-code-obsidian's own SKILL.md comment claims "The parent sk-code hub RESOURCE_MAP is the union of this map ... A drift guard enforces that equality" — but the guard does NOT union it and the parent map omits its per-intent paths. The doc asserts a contract the data violates. | .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:76-79 vs control-run 35 missing-child-path problems | P1 |
| ORDER | Second-order couplings in the same file: `proseExplicitPaths` anchors on literal `'## 4. WEBFLOW MAP'` (line 126) and the path regex hardcodes `webflow\|opencode\|animation` prefixes (line 132); ROUTER.md enumerates union children as `## N. <NAME> MAP` sections (4=WEBFLOW, 5=MOTION_DEV, 6=OPENCODE — no OBSIDIAN section). | verify-router-sync.cjs:126,132; `rg -n '^## ' .skilled/skills/sk-code/ROUTER.md` | P1 |
| PRESENCE | verify-doc-claims.cjs names the examples in the retired-name regex `code-(?:webflow\|opencode)` (line 38) and the "hub has three surfaces" count claim (lines 42-44, 319). Post-deletion its `names`/`surfaces`/`tiers` checks still PASS (only `paths` fails) — coupling is cosmetic-but-real: the retired-name set is hub history, not stack-agnostic. | verify-doc-claims.cjs:38,44,319; copy run `PASS check names`, `PASS check surfaces`, `PASS check tiers` | P2 |
| OK | verify_alignment_drift.py --check-router and verify_stack_folders.py pass with examples deleted (no example coupling); playbook leg 4 and compiled-bijection leg 3 pass — leaf-manifest.json still declares the deleted modes (ownsLeaf covers stale parent-map cites). | copy run: `PASS: alignment-drift`, `PASS: stack-folders`, `PASS check 3`, `PASS check 4` | — |
| PRESENCE | Test classification: `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` hard-asserts live routes incl. sk-code-webflow/sk-code-obsidian expectedModes (lines 65,74-76,89,112) — stack-agnostic test infra bound to the examples → R2 scope (must derive expectations from fixtures or be marked example-dependent). | rg hits in compiled-route-surface-hint.test.cjs:24-25,65,72-76,89,112 | P1 |
| PRESENCE | `canary-cases.v1.json` fixtures name the live surfaces throughout — but they are generated routing-closure data for THIS hub, not stack-agnostic tooling; they become stale on deletion and are regenerated by re-mint → example-owned-by-generation, R3 not R2. | .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:61-238 | P2 |
| OK | verify-router-sync.test.cjs:102-109 and verify-doc-claims.test.cjs:57-108 use the names only as synthetic fixture strings inside fake hubs — test data, not coupling; but any R2 change that reads mode-registry.json forces the fixture harness to write a mode-registry.json too. | rg hits in both test files (lines cited) | — |
| DOC | External-user stuck point: after deleting examples the suite prints `FAIL: router-sync`, `FAIL: doc-claims` and ~359 file-level problem lines with zero remediation text — nothing says "re-mint compiled routing" or "update the citing docs". The baseline check-2 failure is a raw `threw: ENOENT` stack line, not an actionable message. | copy run output: `run-all-drift-guards: 2 guard(s) FAILED`, `threw: ENOENT` | P1 |

## Options / Recommendations

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R2-minimal (WRONG) | verify-router-sync.cjs:31-32 → derive both sets from mode-registry.json `packetKind==="surface"` | 2 lines | breaks pristine control: obsidian promoted to union child → 35 false problems (observed) | n/a — this IS the cheap move, proven to fail |
| R2-correct: minted discriminator | add a per-mode flag in mode-registry.json (e.g. `surfaceRole:"union-child"\|"packet"`) or a `surfaceChildren` list in hub-router.json routerPolicy; guard reads it, falls back to dir-scan | schema addition + mint regeneration + guard read | low; preserves both tiers semantically; external user's surface picks a role at authoring time | filtering by non-empty resourceMap — fails (obsidian has one); parsing ROUTER.md `## N. MAP` headers — prose anchor, drifts silently; inferring membership from parent-map containment — tautological, masks union drift |
| Guard UX (cross-cutting lens) | run-all-drift-guards.sh / verify-router-sync.cjs print one remediation line on dead-route failures ("N routes point at removed packets; re-mint compiled routing or restore the packet") | a few lines of echo | none | documenting the fix in prose only — the user hits the wall before reaching the doc |

Exact patch text for the R2-correct variant (applied and tested this iteration; the
registry field is the only piece still missing — without it the patch is the
proven-wrong naive version):

```js
// replaces verify-router-sync.cjs:31-32 once the registry carries a discriminator:
const SURFACE_MODES = (JSON.parse(fs.readFileSync(path.join(SKCODE, 'mode-registry.json'), 'utf8')).modes || [])
  .filter((m) => m.packetKind === 'surface' && fs.existsSync(path.join(SKCODE, m.packet, 'SKILL.md')));
const SURFACES = SURFACE_MODES.filter((m) => m.surfaceRole === 'union-child').map((m) => m.packet);
const SURFACE_PACKETS = new Set(SURFACE_MODES.map((m) => m.packet));
```

## Ruled Out

- "Just read surfaces from mode-registry.json" (the change the focus suggested as the
  R2 example): implemented and falsified on the pristine control — the registry has no
  field separating union children from cite-only surface packets.
- Treating canary-cases.v1.json as R2 scope: it is generated closure data; re-mint owns it.

## Dead Ends

- mode-registry.json `backendKind`/`packetKind`/`aliases`/`toolSurface` — all identical
  across the three surfaces; no discriminator exists there.

## Edge Cases

- Contradictory evidence: sk-code-obsidian/SKILL.md:76-79 claims parent-union; the guard
  and parent map deny it. Better supported: the guard/data (pristine control is green
  only with obsidian excluded). Recorded as DOC finding above; unresolved which side is
  intended — matters for R6/R3 wording.
- Missing dependency: none for this slice; throwaway copy worked as designed.
- Partial success: suite still fails post-fix — that IS the finding, not a task failure.

## Sources Consulted

- .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh (whole file)
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:1-367
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:38,42-44,79-330
- .skilled/skills/sk-code/mode-registry.json, leaf-manifest.json, hub-router.json (routerPolicy.tieBreak)
- .skilled/skills/sk-code/ROUTER.md section anchors; sk-code-webflow/SKILL.md:55-100; sk-code-obsidian/SKILL.md:70-100
- .skilled/bin/tests/compiled-route-surface-hint.test.cjs; .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json; scripts/tests/verify-router-sync.test.cjs; scripts/tests/verify-doc-claims.test.cjs
- Throwaway copy runs: baseline exit 1 (2 guards failed); patched exit 1 (2 guards failed, check 2 PASS); pristine-control router-sync exit 1 (check 2, 35 problems)

## Assessment

- New information ratio: 0.8 (4 fully new: missing discriminator + control failure,
  obsidian doc/data contradiction, test classifications, remediation-less failure output;
  2 partially new: residual failure set — anticipated by the focus, now measured).
- Questions addressed: R2 exact edit text, files touched, what still breaks, smallest-fix test.
- Questions answered: none fully — the R2 slice of Q10 is answered but Q10 spans R1-R4.

## Reflection

- Worked: baseline→patch→control three-run design. The control run caught a regression
  the delete-only run hid (check 2 PASS post-deletion looked like success; it was
  vacuous because stale leaf-manifest's ownsLeaf covered the parent-map cites).
- Did not work: assuming the registry discriminates surfaces — cost one failed patch
  cycle; recovered by reading the actual mode entries.
- Do differently: verify discriminators exist before writing patch text.

## Recommended Next Focus

Q10 residual: R1/R3/R4 file-touch lists (tieBreak edit, README tables, create-skill-parent
twin) — plus one decision the synthesis needs: where the union-child bit SHOULD live
(mode-registry.json flag vs hub-router.json list), which is a mint-schema question.
External-flow lens still open: which of the post-deletion failures a re-mint clears vs
leaves for hand-editing (the 260 doc-claims paths look hand-edit-only).
