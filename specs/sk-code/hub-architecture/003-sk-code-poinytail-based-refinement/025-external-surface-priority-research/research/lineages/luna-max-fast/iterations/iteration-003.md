# Iteration 3: advisor, doctor, docs, and absent surface behavior

## Focus

Q1 part 3: inspect advisor, doctor, install/onboarding docs, and the v4.0.0.4 note outside the hub and compiled-runtime sources. Run deletion and custom-packet probes in an external copy for Q2.

## Actions Taken

- Read config, state, strategy, registry, dashboard, and iterations 1–2. The lineage session is dr-025-luna-max-fast-2026-10-12T16:28:06.444Z; progressiveSynthesis is true, but the explicit artifact allowlist excludes research.md.
- Searched advisor graph/scorer, doctor parent-skill checks, root README, sk-code README, changelog, and sk-doc parent-packet guidance.
- Built /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i3.5HUO with Obsidian and Webflow packet directories excluded. Added an empty specs/ after route-sync first failed because specs/ was excluded; then added a minimal, unregistered sk-code-custom/SKILL.md inside the copy. Repository source files were not changed.
- Copy probes:
  - node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code — exit 1; 113 invariant failures, including missing packet directories/resources, manifest collision, unresolved router paths.
  - node .skilled/bin/compiled-route-guard.cjs --json — exit 0; sk-code reported fresh.
  - node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'implement responsive CSS layout and browser verify' — exit 0; target sk-code-webflow, though the directory was absent.
  - node .skilled/bin/compiled-route-sync.cjs --check — exit 1; first ENOENT for excluded specs/. After adding empty specs/, exit 1; authored resolver specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs was absent. This does not isolate deletion behavior.
  - node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs — exit 0; 6 passed, 0 failed. The generic suite does not establish a sk-code absent-packet assertion.
  - node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement responsive CSS layout and browser verify"}' --format json — exit 0; returned sk-code at confidence 0.95.
  - After adding only sk-code-custom/SKILL.md, parent-skill check exit 1; output included FAIL: 6a for the unregistered child and 114 invariant failures.
- Route-sync could not be attributed to deleted packets because the authorized copy recipe excludes its resolver under specs/. No repository source files or tests were changed.

## Findings

| class | claim | evidence: repo path:line, or command with exit status and decisive output | severity |
|---|---|---|---|
| ORDER | The release note frames OpenCode → Obsidian → Webflow as the order used “everywhere”; the root README calls these shipped surfaces and says to replace them. This presents personal packets as the external default. | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:297]; [SOURCE: README.md:1384]; [SOURCE: .skilled/skills/sk-code/hub-router.json:7] | P1 |
| PRESENCE | The advisor graph routes the single sk-code identity. Its lexical lane includes “obsidian plugin”; explicit “webflow cms” instead boosts MCP code mode and penalizes sk-code. These scorer phrases do not establish either surface packet is installed. | [SOURCE: .skilled/skills/system-skill-advisor/graph-metadata.json:25-27]; [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:37-39]; [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:129-132]; [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl:14] | P2 |
| BREAK | The parent-skill doctor requires registered packet directories and router resources. With both directories absent but registrations left in place, the copy check exited 1 with 113 invariant failures, including missing packet/resources, manifest collision, and unresolved router paths. | node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code in copy, exit 1: FAIL 3c for both packets, FAIL 5d for missing router resources, FAIL 10a-manifest-source, FAIL 12a-router-contract; final 113 invariant failures. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:432-455,1075-1088] | P1 |
| BREAK | Compiled freshness does not prove packet presence: the guard reported sk-code fresh, then runtime selected the absent sk-code-webflow packet for a CSS/browser prompt. | compiled-route-guard --json in copy, exit 0: sk-code fresh; compiled-route --hub sk-code --prompt 'implement responsive CSS layout and browser verify', exit 0: target sk-code-webflow. [SOURCE: .skilled/bin/compiled-route-guard.cjs]; [SOURCE: .skilled/bin/compiled-route.cjs] | P1 |
| BREAK | The copied generic surface-hint suite passed all six tests, and parent check 5k canary passed despite the absent sk-code packet. These checks did not catch the missing-target route. Route-sync was inconclusive because its resolver was excluded. | node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs, exit 0: 6 passed, 0 failed; route-sync exit 1 after retry: authored resolver missing under excluded specs/. [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs]; [SOURCE: .skilled/bin/compiled-route-sync.cjs] | P1 |
| BREAK | A standalone custom packet directory is not discovered automatically. The doctor rejects it as an unregistered child; a real addition must also reach the registry/router/manifest contract. | In copy, after adding only sk-code-custom/SKILL.md, parent-skill check exit 1: FAIL 6a for [sk-code-custom], final 114 invariant failures. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs]; [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20] | P1 |
| DOC | Root and hub READMEs describe three surfaces and say to replace shipped packets but do not label Obsidian/Webflow examples. .skilled/README.md and a dedicated sk-code install guide are absent. sk-doc documents parent packets, registry/router files and tieBreak as an exact list, providing an existing scaffold path to clarify. | [SOURCE: README.md:1384,1447]; [SOURCE: .skilled/skills/sk-code/README.md:23,51-57]; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/README.md:49-50]; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:321-323,332-337]; test -e .skilled/README.md returned false; rg --files .skilled/skills/sk-code | rg -i 'install|getting-started' found no dedicated guide. | P2 |

## Questions Answered

- Q2: The parent/manifest path fails after deletion if registrations remain; compiled guard and generic canary pass while runtime selects a missing packet; advisor routing remains on sk-code; an unregistered custom directory is rejected. Route-sync remains unverified because the copy excludes its authored resolver.

## Questions Remaining

- Q1 remains open for a complete occurrence inventory across advisor batteries, all doctor commands, CI/hooks, and install docs.
- Q3 remains open. Provisional recommendation: retain explicit hub-router.json tieBreak as the single precedence source; when registering a custom surface, place it before OpenCode in the same exact permutation. This is the smallest move because the doctor already validates that list. A rank field or surface-hint policy adds machinery without evidence that editing the existing list is inadequate.
- Q4 remains open: the operator repository can retain its current explicit order as local registry/router data, while an external starter omits example registrations. No packaging mechanism was found in this pass that proves how those configurations are separated.
- Q5 remains open for a concrete doc/doctor plan. Onboarding should call Obsidian/Webflow examples and say replacement means updating packet registration, router resources/signals, tieBreak and leaf manifest together.
- Q6 remains open for a full rejected-ideas pass.

## Options and Recommendation

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Numeric priority in mode-registry | Add a field to surface entries; current declaration has no priority field: [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20] | High: schema, compiler, doctor and canary changes | Two ordering sources unless tieBreak is retired | Edit existing tieBreak; a new field is only needed if manual updates fail in real onboarding. |
| Native/fallback flag on OpenCode | Add a marker and teach compiler/doctor to demote it | Medium | A binary marker cannot order multiple custom surfaces or preserve the operator’s current three-surface order by itself | Explicit tieBreak already orders all registered modes. |
| Derive tieBreak at manifest mint | Replace authored precedence with generated order from packet metadata and a native marker | High | Doctor currently requires an exact permutation; generated and authored contracts need coordinated changes | Update the existing list during registration; derive only if that proves inadequate. |
| --surface-hint | Per-call promotion of a matched surface; generic copied hint suite passed 6/6 but did not catch missing-packet routing | Low | Session-specific; cannot make an absent or unmatched target available | Keep it for session preference; it fails as persistent default precedence. |
| Recommended: explicit tieBreak with OpenCode last in external defaults | Change existing list at [SOURCE: .skilled/skills/sk-code/hub-router.json:7]; document placing registered custom surfaces before OpenCode; doctor requires a full permutation [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088] | Lowest: one existing ordering value plus onboarding text | A user may omit or misorder an entry; doctor checks membership, not desired semantic order | No cheaper option meets the requirement: folder presence leaves stale routes selectable and surface-hint is not persistent. |

Reject for now: a separate advisor identity per surface (graph routes one hub and packets are advisor-invisible); treating directories as optional while stale registry/router references remain (observed doctor/runtime failures); using surface-hint as system-wide priority (wrong scope).

## Sources Consulted

- .skilled/skills/system-skill-advisor/graph-metadata.json:25-27
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:37-39
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:129-132
- .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl:14
- .skilled/commands/doctor/scripts/parent-skill-check.cjs:432-455,1075-1088
- .skilled/commands/doctor/_routes.yaml:141-156
- .skilled/skills/sk-code/mode-registry.json:16-20,61-114
- .skilled/skills/sk-code/hub-router.json:7,31-45
- .skilled/skills/sk-code/leaf-manifest.json:35-36,114-115,270-271
- .skilled/bin/compiled-route-guard.cjs; .skilled/bin/compiled-route.cjs; .skilled/bin/compiled-route-sync.cjs
- .skilled/bin/tests/compiled-route-surface-hint.test.cjs
- README.md:1384,1447
- .skilled/skills/sk-code/README.md:23,51-57
- .skilled/changelog/skilled/v4.0.0.4.md:297,357
- .skilled/skills/sk-doc/sk-create-skill/references/README.md:49-50
- .skilled/skills/sk-doc/sk-create-skill/SKILL.md:321-323,332-337
- Copy: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i3.5HUO

## Assessment

- New information ratio: 0.93 (six findings new; one extends prior compiled-routing evidence with missing-packet behavior).
- Questions addressed: Q2.
- Questions answered: Q2, with the route-sync limitation above.
- Enough observed evidence answers Q2 despite route-sync being unavailable in the prescribed copy.

## Reflection

- What worked and why: the throwaway copy separated metadata freshness from physical packet presence. Doctor and compiled route exposed hard validation failures and a successful-but-invalid route.
- What did not work and why: route-sync could not test deletion behavior because the prescribed copy omits specs/, including an authored resolver. Adding an empty specs/ exposed the missing resolver but did not repair the experiment boundary.
- What I would do differently: use a later authorized copy that includes the specific resolver subtree, then rerun route-sync --check.

## Next Focus

Resolve Q3–Q6: verify the compiler/doctor contract for manual tieBreak edits, find the packaging boundary that separates example data from operator-local registrations, and draft narrow README/doctor guidance for safe surface replacement.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: freshness and parent doctor differ because they check different properties; runtime confirms the missing-packet route remains selectable.
- Missing dependencies: route-sync resolver is absent from the recipe copy.
- Partial success: route-sync was not a valid deletion probe; other copy probes completed.

## SCOPE VIOLATIONS

None. Repository writes are limited to this narrative and delta; the gateway will own the state projection. The custom packet stub exists only in the authorized external copy.

