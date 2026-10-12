# Iteration 8: External user's delete-and-adapt path

## Focus

Follow the dispatched Q11 user journey from the repository's existing adaptation instructions through example removal, compiled routing, the parent-skill doctor and the skill advisor. The strategy's Next Focus still names Q12, but the dispatch explicitly selects Q11. I followed the narrower journey focus and did not retry the exhausted assumption that `/create:skill-parent update --surfaces` is a complete removal path.

## Actions Taken

- Read the lineage config, state log and strategy before research. Config identifies this lineage as `new`, gives session identity `dr-025r2-luna-max-fast-r2-2026-10-12T18:58:06.247Z`, and sets `progressiveSynthesis: true`. The state log held seven iteration records before this run. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-config.json:15-16] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-config.json:35-38] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-state.jsonl:2-9]
- Followed the existing root README adaptation guide. It says to replace the Webflow, OpenCode and Obsidian packets, register packets in the registry and hub router, update stack detection and `ROUTER.md`, then bump the version and changelog. [SOURCE: README.md:1445-1453]
- Read the `sk-code` README, hub `SKILL.md`, `ROUTER.md`, `/create:skill-parent` router and its auto workflow. The slash command routes to a presentation contract and workflow YAML, not a shell executable. The auto workflow's update output-scope list does not list surface packet files, while its package-generation step says `--surfaces` generates them. [SOURCE: .skilled/skills/sk-code/README.md:21-24] [SOURCE: .skilled/skills/sk-code/SKILL.md:32-42] [SOURCE: .skilled/commands/create/skill-parent.md:7-17] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:208-220] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:417-429]
- Copy A, `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i8-a`: ran `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'debug a Rails route error' --surface-hint OPENCODE` (exit 0, action `defer`, empty `targets`); `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` (exit 0, `OK: parent-skill-check — all hard invariants passed, 0 warnings`); `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"debug a Rails route error"}' --format json` (exit 0, advisor status `ok`, confidence `0.8403`, compiled route `defer`); and `node .skilled/bin/compiled-route-guard.cjs` (exit 0, `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.`).
- Copy B, `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i8-b`: removed only the `sk-code-webflow` and `sk-code-obsidian` directories with a Node `fs.rmSync` command (exit 0). Ran the documented-in-repository compiled manifest refresh command `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` (exit 0, `fresh:true`, `refreshed:true`), then copied that runtime manifest to the authored closure path under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` (exit 0, 195 bytes). The root README adaptation steps do not name these two commands or the authored-copy path.
- In Copy B, ran `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` (exit 1, summary `FAIL: parent-skill-check — 113 invariant failures, 0 warnings`). The first visible failures were `3c` for each removed packet and `5d` for missing Webflow and Obsidian `SKILL.md` paths. The output also included `10a ... MODE_LEAF_SET_COLLISION` and many `12a ... RRC-006` missing-resource failures. It did not print a recovery command.
- In Copy B, `node .skilled/bin/compiled-route-guard.cjs` still exited 0 with `All hubs fresh or excused`. The Rails-hinted compiled-route call exited 0 with `action:"defer"` and empty targets; the generic debugging prompt with `--surface-hint UNKNOWN` did the same. The explicit OpenCode TypeScript/config prompt exited 0 and routed to `sk-code-opencode`. The Rails skill-advisor call exited 0 with status `ok`, confidence `0.82`, and a compiled route of `defer`.
- Read `.github/workflows/routing-registry-drift.yml`. Its matching local checks include the compiled-route guard, a parent-skill doctor loop over all mode registries and the skill-root metadata generators. I did not run GitHub Actions or its Vitest, npm-install or graph-compiler steps in a third copy because the lineage allows at most two copy commands. The two local checks above are not a full CI pass. [SOURCE: .github/workflows/routing-registry-drift.yml:160-172] [SOURCE: .github/workflows/routing-registry-drift.yml:183-203]
- I could not invoke `/create:skill-parent update --surfaces rails` as an executable in this shell harness. I did not hand-author a substitute Rails packet, so the add-surface, authored routing update and post-add prompt checks remain untested. No GitHub Actions runner was available in the two-copy budget.

## Findings

| class | claim | evidence | priority |
|---|---|---|---|
| DOC | This is additional direct reading of the user-facing guide for round-one F28/F29: its first adaptation step literally says to replace `sk-code-webflow/`, `sk-code-opencode/` and `sk-code-obsidian/`. It does not distinguish the two personal examples from the native OpenCode surface, even though the later steps tell users to register and map their packets. A reader following only this sentence can remove the native fallback as well as the examples. | [SOURCE: README.md:1445-1453] | P1 |
| BREAK | Independent Copy B reproduction of F14: deleting only Webflow and Obsidian directories leaves their modes and resource paths registered. The doctor exits 1 with 113 failures, starting with `3c: mode "sk-code-webflow" packet "sk-code-webflow" is not an existing sub-directory`, the equivalent Obsidian error and `5d` missing paths. It also emits `10a ... MODE_LEAF_SET_COLLISION` and `12a ... RRC-006` missing-resource errors. The final message is `FAIL: parent-skill-check — 113 invariant failures, 0 warnings`; it names no next action. | Command in Copy B: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`; exit 1. The 3c message is emitted at [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:481-500]. | P1 |
| OK | Additional evidence for F15: after deleting the two directories and refreshing the compiled manifest, `compiled-route-guard.cjs` still says all hubs are fresh. That check does not establish that registered packets still exist. I did not test whether the front door still returns the deleted packets in this run. | Copy B: `node .skilled/bin/compiled-route-guard.cjs`; exit 0; output `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.` Guard logic checks manifest freshness and authored drift at [SOURCE: .skilled/bin/compiled-route-guard.cjs:97-116]. | P1 |
| BREAK | In the post-deletion Copy B, a generic debugging prompt with `--surface-hint UNKNOWN` returns `action:"defer"` and no targets, while an OpenCode TypeScript/config prompt routes to `sk-code-opencode`. This is an observed end-state, not proof that deletion alone caused the generic defer because the same generic prompt was not run in Copy A. | Copy B: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'debug a generic application error' --surface-hint UNKNOWN`; exit 0, `defer`, `targets:[]`. Control: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'fix a TypeScript config error in OpenCode' --surface-hint OPENCODE`; exit 0, target `sk-code-opencode`. [SOURCE: .skilled/skills/sk-code/SKILL.md:55-63] | P1 |
| DOC | The parent-skill workflow contract is unclear for the proposed add step. Its `update` output scope lists `SKILL.md`, registry, hub router, root router, description, graph metadata, changelog and mode packets, but not a surface packet. The later generation step says `--surfaces` generates surface packets. I could not execute the slash workflow here, so whether the update branch actually creates Rails remains unknown. | [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:208-220] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:417-429] | P1 |
| OK | The CI workflow includes the same parent-skill structural doctor and compiled-routing freshness check used locally, but this iteration did not run the workflow's install, Vitest, graph metadata, graph compiler or admission stages. A green local guard is therefore not evidence that a fork's full CI passes. | [SOURCE: .github/workflows/routing-registry-drift.yml:160-172] [SOURCE: .github/workflows/routing-registry-drift.yml:183-203] | P2 |

## Options and Recommendations

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Candidate: clarify the existing adaptation guide as a supported add/remove path, keeping OpenCode native and naming the exact registration, leaf-manifest, compiled-manifest plus authored-copy and doctor steps | Existing user-facing root guide and sk-code guide; `README.md:1445-1453`, `.skilled/skills/sk-code/README.md:21-24,53-57` | Medium: focused edits to existing docs and a verified command sequence, without a new removal tool | A prose sequence can drift unless a copy test exercises it; this iteration did not complete the add step or full CI | Cheaper move: only call Webflow and Obsidian examples. That does not tell the user how to reconcile registry/router/leaf state; the observed two-directory deletion still ends in 113 doctor failures. This candidate is not yet a validated R6/R3 change. |

## Questions Answered

- Q11: Partial answer. Following the README through deletion and routing reaches a reproducible doctor failure, a green but insufficient compiled-route freshness guard and a generic prompt that defers. This independently reproduces F14 and adds limited evidence to F15. No Rails surface was successfully added, so the complete user journey is not answered.

## Questions Remaining

- Q10: Exact R1-R4 edits, all touched files, and smallest correct fix remain open.
- Q11: The Rails add step, post-add doctor, prompt routing, full CI and remaining mirrors/release-engine consumers remain untested.
- Q12: Rejected ideas X1-X9 and new rejections were not revisited.

## Next Focus

Use the next isolated full-tree copy to execute the actual `/create:skill-parent update --surfaces rails` workflow in a runtime that exposes the slash-command executor. Then inspect the changed packet and generated artifacts, run the doctor, run the named local CI gates and test Rails, OpenCode and generic debugging prompts. If that executor remains unavailable, record the limitation and inspect the remaining workflow contract rather than pretending the add path ran.

## User Journey Snapshot (today versus proposed)

**Today:** The root README says to replace all three named surfaces. If the user removes only Webflow and Obsidian, the doctor reports 113 failures without recovery guidance. Re-minting the compiled manifest can still leave the guard green, and the Rails and generic-debugging prompts defer. The Rails add step and full CI outcome are unknown because neither was executed.

**After the proposed fixes (not verified):** Label Webflow and Obsidian as optional examples while preserving OpenCode as the native fallback. Give the user a complete add/remove sequence with the registration order, route and leaf-map updates, compiled-manifest refresh plus authored copy, named doctor and CI checks, and expected test prompts. A future copy run must show those checks pass and the new Rails surface routes before this journey can be called verified.

## Edge Cases

- Ambiguous focus: dispatched Q11 overrides the strategy's Next Focus Q12; followed the dispatch.
- Contradictory evidence: the slash-command update contract has an output-scope omission alongside a generation instruction that names `--surfaces`; runtime behavior remains unknown.
- Missing dependencies: no slash-command executor or GitHub Actions runner was available to this worker; two isolated copy command slots were consumed.
- Partial success: deletion, re-mint, doctor, route, advisor and compiled guard checks ran in throwaway copies. Add-surface generation, prompt behavior after adding Rails and complete CI did not run, so status is timeout.

## Sources Consulted

- `README.md:1445-1453`
- `.skilled/skills/sk-code/README.md:21-24,53-57`
- `.skilled/skills/sk-code/SKILL.md:32-42,55-63`
- `.skilled/commands/create/skill-parent.md:7-17`
- `.skilled/commands/create/assets/create-skill-parent-auto.yaml:208-220,417-429`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:481-500`
- `.skilled/bin/compiled-route-guard.cjs:97-116`
- `.github/workflows/routing-registry-drift.yml:160-172,183-203`

## Assessment

- New information ratio: 0.75 (three new command-level outcomes and three partial confirmations or workflow qualifications).
- Questions addressed: Q11 partial.
- Questions answered: none in full.
- Edge case: partial success due the add workflow and full CI not running.
- Duration: the runtime did not expose an iteration start time; the canonical event omits an invented duration.

## Reflection

- What worked and why: independent full-tree copies separated the clean baseline from the example-deletion state. The actual doctor output showed the complete first failure summary, while compiled-route calls exposed the difference between OpenCode routing and an unregistered Rails prompt.
- What did not work and why: the command workflow itself is a slash-command contract, not a directly executable script in this harness. Without its runtime executor, I could not verify whether update creates a surface. The two-copy limit also prevented running the complete GitHub workflow sequence.
- What I would do differently: reserve Copy B's sole command for a managed `/create:skill-parent` invocation with output capture, then run the doctor and routing commands after it finishes. Run the CI-equivalent suite only if the next iteration's command budget includes its dependencies.

## Recommended Next Focus

Complete the add-surface side of Q11 in an executor-enabled copy, then verify the generated surface and all doctor/CI gates. Keep Q10 and Q12 deferred.

## SCOPE VIOLATIONS

None. The only repository writes planned are this iteration narrative, its delta and the append gateway's state projection. Example deletion and manifest refresh/copy occurred only in the two authorized throwaway copies.