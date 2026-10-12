# Iteration 10: Adversarial surface-priority re-verification

## Focus

Re-open the ORDER, PRESENCE, BREAK, DOC findings and recommendations in iterations 1–9; repeat decisive deletion/addition probes in an external copy. Q1 was the only unchecked strategy question.

## Actions Taken

- Read config, state, strategy, registry, dashboard, and iterations 1–9. Session ID: dr-025-luna-max-fast-2026-10-12T16:28:06.444Z.
- Re-read hub router, registry, hub surface documentation, parent doctor, compiler/runtime contracts, scaffold guidance, and overengineering rule.
- Throwaway copy: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i10.dbahp56h. Recipe setup: rsync, git init/add/base commit all exit 0. Deleted only the Obsidian and Webflow packet directories there; added sk-code-project there.
- Copy probes: parent-skill check exit 1 (missing packets/resources); compiled-route-guard exit 0, failures=0; CSS/Webflow/Obsidian routes exit 0 to absent packet IDs; route-sync exit 1 because the excluded specs resolver is absent; fleet metadata check exit 1 with MODE_LEAF_SET_COLLISION/RRC-006; advisor exit 0, status ok, sk-code confidence 0.95; project-only addition gives doctor FAIL 6a and route action=defer.
- Initial copied probes lacked the prescribed node_modules symlinks, so advisor/fleet/tests first failed on missing dependencies. Added the exact source symlinks inside the copy and reran: advisor succeeded and focused canaries passed 105/105. Fleet doctor still failed on stale deleted-packet references.
- No repository source or reducer-owned file changed. External publisher remains unlocated.

## Findings

| class | claim | evidence: repo path:line, or command with exit status and output | priority |
|---|---|---|---|
| ORDER | The authored precedence is quality, review, OpenCode, Obsidian, Webflow; registry and prose lists also show Webflow/OpenCode/Obsidian as inventory order. | [SOURCE: .skilled/skills/sk-code/hub-router.json:4-12]; [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20]; [SOURCE: .skilled/skills/sk-code/SKILL.md:15,32-42] | P1 |
| PRESENCE | Router resources and mode registry treat Webflow and Obsidian as registered packets. Deleting only their directories leaves live references. | [SOURCE: .skilled/skills/sk-code/hub-router.json:31-45]; [SOURCE: .skilled/skills/sk-code/mode-registry.json:61-114] | P1 |
| BREAK | In the external copy, parent doctor failed for both missing directories/resources; compiled-route-guard passed with failures=0; prompts still routed to absent Webflow/Obsidian packet IDs. | parent-skill-check in copy exit 1: FAIL 3c for both directories, FAIL 5d missing resources; compiled-route-guard --json exit 0 failures=0; compiled-route prompts exit 0 with packetId sk-code-webflow/sk-code-obsidian. | P1 |
| BREAK | Fleet metadata doctor failed with MODE_LEAF_SET_COLLISION and RRC-006 missing Webflow resources. After installing the recipe node_modules symlinks, focused canary tests passed 105/105; these do not catch live stale routes. | ci-skill-root-metadata.cjs copy exit 1: MODE_LEAF_SET_COLLISION and RRC-006; three focused node test suites exit 0: 105 pass, 0 fail. | P1 |
| BREAK | Route-sync deletion behavior remains unproven: the exact copy recipe leaves specs empty, and compiled-route-sync exits 1 because its authored resolver is excluded. | compiled-route-sync.cjs --check in copy exit 1: authored resolver missing at specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs. | P2 |
| PRESENCE | Advisor still recommends sk-code (status ok, confidence 0.95). Adding only sk-code-project produces doctor FAIL 6a and a custom prompt defers with no targets; a packet folder alone is not registration. | advisor_recommend in copy exit 0: sk-code confidence 0.95; after adding sk-code-project only, parent check exit 1 FAIL 6a and compiled-route exit 0 action=defer, targets=[]. | P1 |
| DOC | Hub skill states exactly three surfaces without marking Obsidian/Webflow as examples. Existing parent-surface scaffold accepts surface names; publisher boundary remains UNKNOWN. | [SOURCE: .skilled/skills/sk-code/SKILL.md:32-42]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467]; updater grouping is not proof of external payload: [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:520-561] | P2 |


## Options and Recommendations

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R1 (recommended): retain hub-router tieBreak as persistent precedence; in a consistent external configuration, put the user's registered surface before OpenCode and omit example registrations/resources. | .skilled/skills/sk-code/hub-router.json:4-12,31-45; compiler consumes tieBreak at .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:259-266. | Low: edit existing ordered data. | Manual list can drift; doctor checks membership/order, not intent. | Cheaper: rely on --surface-hint. It is per-call; omission leaves tieBreak precedence unchanged. |
| R2: retain operator-local data and select an example-free data set only at the actual external publisher, after locating it. | .skilled/skills/sk-code/mode-registry.json:16-20,61-114; .skilled/commands/doctor/scripts/release-update.cjs:520-561. | Medium: locate publisher and select consistent source data/derived outputs. | Publisher is UNKNOWN; duplicated sets can drift. | Cheaper: tell users to delete only directories. It fails because doctor/fleet metadata retain stale references and runtime routes to absent IDs. |
| R3: label Obsidian/Webflow as optional examples, explain registry/router replacement, link existing parent scaffold, and add repair guidance to missing-packet doctor output. | .skilled/skills/sk-code/SKILL.md:32-42; .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467; .skilled/commands/doctor/scripts/parent-skill-check.cjs:490-497. | Low: existing prose and diagnostic. | Docs can drift; structural doctor cannot validate semantic priority. | Cheaper: README-only change fails because canonical exact-three inventory and doctor message remain misleading. |

## Rejected Ideas

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Reject numeric rank, native/fallback flag, or deriving order from installed dirs/registry order. | New registry/compiler/doctor/test policy; .skilled/skills/sk-code/mode-registry.json:6-20; compiler: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-266. | Medium-high. | Duplicates precedence or makes presence/display order implicit; cannot order multiple user surfaces safely. | Use existing tieBreak; no observed requirement fails there. |
| Reject --surface-hint as global policy. | .skilled/bin/compiled-route.cjs:47-59. | Low initially, repeated at every caller. | Missing hint leaves default; it cannot add unmatched surfaces. | Persistent tieBreak already covers calls without hints. |
| Reject plugin discovery/new wizard. | Adds discovery lifecycle or duplicates parent scaffold. | High / medium. | New contract without automatic-install requirement. | Use /create:skill-parent with --surfaces; existing scaffold creates parent packets. |
| Reject operator-order feature flag, deleting operator examples, or weakening doctor checks. | Router/registry and doctor contracts: .skilled/skills/sk-code/hub-router.json:7,31-45; .skilled/commands/doctor/scripts/parent-skill-check.cjs:490-497,1075-1088. | Medium / high. | Duplicated policy, lost operator setup, or hidden stale references. | Select starter data at publishing boundary and keep structural checks; copy demonstrates stale routes after deletion. |

## Questions Answered

- Q1: Authored order is in hub-router.json tieBreak. Membership/presence is encoded in mode-registry, routerSignals/resources, hub skill inventory and generated leaf/compiled/canary metadata. Advisor routes the sk-code identity; it does not prove the two leaves are installed. Doctor parent/fleet checks enforce packet/resource presence. The v4.0.0.4 note states “One Surface Order Everywhere.” Prior lineage search found no dedicated sk-code install guide; root/hub documentation is the observed onboarding surface.

## Questions Remaining

- Actual external publisher and whether it selects a different starter remain UNKNOWN. /doctor:update unit grouping does not prove what is shipped.
- Q2–Q6 were answered in prior iterations; this recheck did not overturn the conclusions. Route-sync remains unproven because the required resolver is excluded by the authorized copy recipe.

## Next Focus

Locate the external publisher and verify its payload. Then test a registered user surface across packet, registry, router resources/signals, tieBreak, and generated manifest.

## Assessment

- New information ratio: 0.40; most findings repeat prior evidence, with a corrected copy dependency setup and a sharper boundary on the route-sync failure.
- Questions addressed and answered: Q1.

## Reflection

The prescribed dependency symlinks make advisor and canary probes meaningful. Route-sync still cannot isolate deletion behavior without the authored resolver excluded from the copy.
