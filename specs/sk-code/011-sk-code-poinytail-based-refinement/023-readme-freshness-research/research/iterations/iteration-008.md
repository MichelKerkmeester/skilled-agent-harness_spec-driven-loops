# Iteration 8: Q4 part 3 — Hub READMEs for sk-doc, sk-code, system-deep-loop and cli-external-orchestration/cli-pi

## Focus

Q4 part 3 per the dispatch: the hub READMEs for `.skilled/skills/sk-doc`, `.skilled/skills/sk-code`, `.skilled/skills/system-deep-loop` and `.skilled/skills/cli-external-orchestration`, plus the `cli-pi` mode README the Q1 inventory names (`.skilled/skills/cli-external-orchestration/cli-pi/README.md`), checked against v4.0.0.4 and the repository. The strategy's machine-owned "Next Focus" agreed with the dispatch.

Premise check for cli-devin: iteration 1's related-README find pattern lists seven hub READMEs (sk-doc, sk-code, sk-git, system-spec-kit, system-skill-advisor, system-deep-loop, cli-pi) and does not include cli-devin, so the dispatch's "plus cli-devin if in the inventory" resolves to not-audited this iteration. Its version lines were observed during the probe and are recorded under Ruled Out for a later iteration.

## Actions Taken

1. Read state first: config (sessionId `dr-023-readme-freshness-research-2026-10-12T14:40:22.000Z`, `progressiveSynthesis: true`), the strategy, the registry and iteration 7; 7 iteration records on disk → this is iteration 8.
2. Ran the version-parity probe first, as iteration 7 recommended: an `awk` for the `version:` line in each hub README and its `SKILL.md`, plus changelog tails. This found two drifts in scope (sk-doc, system-deep-loop) and two mode-README version lines (cli-pi, cli-devin) whose classification needed the contract.
3. Read the four hub READMEs in full (sk-doc 232, sk-code 140, system-deep-loop 121, cli-external-orchestration 138 lines) and the cli-pi README (225 lines).
4. Probed structural claims: mode-registry `packetKind` and mode counts, per-packet `graph-metadata.json` absence, the workflow symlinks, `hub-router.json` `tieBreak` and `defaultMode`, `mutatesWorkspace`, mode-dir completeness, script and path existence loops, the `.skilled/commands/create` and `.skilled/commands/deep` listings, and the 28 §9 link targets in the sk-doc README.
5. Read the authoritative contracts before classifying versions: the parent-skill doctor's 13c/13d blocks [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1802] and the frontmatter versioning standard [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:17].
6. Verified the cli-hermes contradiction [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:47] against the hub README [SOURCE: .skilled/skills/cli-external-orchestration/README.md:94], and the chart-form count mismatch [SOURCE: .skilled/skills/sk-design/sk-design-chart/README.md:32] against the sk-doc pointer [SOURCE: .skilled/skills/sk-doc/README.md:220]; confirmed neither was previously recorded (awk over `findings-registry.json` and iteration 5 for `twenty-one|Twenty-nine|chart forms` → no matches).

## Findings

| README path:line | Claim as written | Evidence | Class | Severity | Smallest proposed fix |
| --- | --- | --- | --- | --- | --- |
| `.skilled/skills/sk-doc/README.md:22` | frontmatter `version: 2.3.4.0` | `SKILL.md:5` carries `version: 2.3.9.0` (same `awk` probe on both files) and the newest changelog entry is `v2.3.9.0.md`. The parent-skill doctor's 13c rule: "a hub README that declares a version is the front page of that release, so it carries the SKILL.md version" [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1806]; a mismatch on sk-doc warns instead of failing because sk-doc sits in the four-name `README_VERSION_WARN_ONLY` set [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804], [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1818]. v4.0.0.4 states the fixed state as "Each hub README states the version its `SKILL.md` carries" and "reports zero warnings on every hub" [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:199] | STALE | P1 | set `version: 2.3.9.0` |
| `.skilled/skills/system-deep-loop/README.md:9` | frontmatter `version: 1.6.1.0` | `SKILL.md:3` carries `version: 1.6.3.0` and the newest changelog entry is `v1.6.3.0.md`; same 13c rule and warn-only set [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804] | STALE | P1 | set `version: 1.6.3.0` |
| `.skilled/skills/cli-external-orchestration/README.md:94` | "`cli-devin`, `cli-pi` and `cli-hermes` gate routing on `command -v`, and `cli-hermes` also reads `hermes status` for a configured provider" | the `command -v` half is corroborated (`command -v pi` at [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:53], `command -v devin` at [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:1213], `command -v hermes` at [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:62]); the `hermes status` half is contradicted by the packet's own contract: "`hermes status` does not show custom provider blocks, so it is not the probe" [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:47]. The probe steps run `command -v hermes` plus `hermes config get providers.llmgateway.base_url` [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:63], [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:211] | WRONG | P2 | replace "reads `hermes status` for a configured provider" with "reads `hermes config get providers.llmgateway.base_url` for a configured provider" |
| `.skilled/skills/sk-doc/README.md:220` | "Standalone HTML data charts: twenty-one forms across six families, the colour system and the corpus validator" | the linked doc's own summary row says "Twenty-nine chart forms across six question families, plus three stock colour systems and provenance-gated design-md deliveries" [SOURCE: .skilled/skills/sk-design/sk-design-chart/README.md:32]; an `awk '/[Tt]wenty/'` over the chart catalog's prose returned no other count | STALE | P2 | change "twenty-one" to "twenty-nine" |
| `.skilled/skills/sk-code/README.md:23` (also `:38`, `:51`, `:106`) | "the three surfaces the hub `SKILL.md` lists (WEBFLOW, OPENCODE and OBSIDIAN)"; "one of two workflow modes"; "the hub contains five packets" | `mode-registry.json` holds 5 entries with `packetKind` workflow ×2 (quality, review) and surface ×3 (webflow, opencode, obsidian); `SKILL.md:40` states "exactly three surfaces … and two workflow modes" as the sentence other sk-code docs point to [SOURCE: .skilled/skills/sk-code/SKILL.md:40]; none of the five packets nor `shared/` holds a `graph-metadata.json`; `workflow-implement.md`, `workflow-debug.md` and `workflow-verify.md` are symlinks into `shared/references/` in all three surface packets | OK-VERIFIED | P2 | none |
| `.skilled/skills/cli-external-orchestration/README.md:33` (also `:35`, `:88`) | "seven external CLI runtimes"; route list; "`routerPolicy.tieBreak` orders `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` and `cli-hermes`"; "`defaultMode` is `null`" | `mode-registry.json` holds exactly 7 modes; `hub-router.json` `routerPolicy.tieBreak` is exactly `["cli-opencode","cli-claude-code","cli-codex","cli-cursor","cli-devin","cli-pi","cli-hermes"]` and `defaultMode` is `null` [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json]; all 7 modes carry `command: null` [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json] | OK-VERIFIED | P2 | none |
| `.skilled/skills/cli-external-orchestration/README.md:35` (also `:96`, `:97`) | "all mutating packets, `mutatesWorkspace: true`"; "One `graph-metadata.json` carries the single advisor identity for all seven modes"; each mode keeps `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/` and `changelog/` | the registry holds `mutatesWorkspace: true` exactly 7 times; all seven packet dirs hold all six surfaces and none holds a `graph-metadata.json`; the hub root holds the single `graph-metadata.json` | OK-VERIFIED | P2 | none |
| `.skilled/skills/system-deep-loop/README.md:14` (also `:62`, `:82`, `:87`, `:89`) | "routes to every active deep-loop workflow: research, review and AI Council"; `runtimeLoopType` one of `research`, `review` or `council`; layout lists `deep-research/`, `deep-review/`, `deep-ai-council/`; agents `deep-research`, `deep-review` and `ai-council`; `/doctor:deep-loop [--scope=research|review|council|both|all]` | `mode-registry.json` holds 3 modes with loop types `research|review|council` and the three packets exist; `shared/synthesis/` exists; `.skilled/agents/` holds `ai-council.md`, `deep-research.md`, `deep-review.md` and `context.md`; the doctor argument-hint matches the scope list verbatim [SOURCE: .skilled/commands/doctor/deep-loop.md]; `.skilled/commands/deep/` holds only `research.md`, `review.md` and `ai-council.md`, matching the v4.0.0.4 retirement of the two unused modes [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:149]; the drift-guard test path exists [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts] | OK-VERIFIED | P2 | none |
| `.skilled/skills/sk-doc/README.md:134` (also `:191`, `:193`, §9) | "thirteen `/create:*` commands"; flowchart validator path; cite-drift scripts and env names; the §9 RELATED DOCUMENTS table | `.skilled/commands/create/` holds exactly the 13 named command files (agent, benchmark, changelog, command, diff, feature-catalog, goal, manual-testing-playbook, readme, repo-rule, skill-parent, skill, with-human-voice); `.skilled/skills/sk-design/sk-design-diagram/scripts/validate-flowchart.sh` exists; `validate_document.py` names `JEV_FEATURE_CITE_DRIFT` and the older `SKDOC_CITE_DRIFT_CHECK` and lists both in `CITE_DRIFT_SWITCHES` [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:1510], [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:3303]; all 28 §9 targets exist (existence loop over each linked path) | OK-VERIFIED | P2 | none |
| `.skilled/skills/cli-external-orchestration/cli-pi/README.md:10` (also `:34`, §5, §10) | own-edition `version: 1.5.0.8`; references/assets inventory; pinned-contract link | mode packet READMEs carry their own edition, raised by the bump rule, not the hub release [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:17], [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], so the README's 1.5.0.8 is not drift; the packet's `SKILL.md:5` `1.5.15.0` equals its newest changelog entry `v1.5.15.0.md` (13d parity); all seven `references/` files and both `assets/` files exist; the pinned-contract link at `:34` resolves through `.skilled/specs -> ../specs` to `specs/cli-external-orchestration/z_archive/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md` | OK-VERIFIED | P2 | none |

Note: the two version rows are the same drift class iteration 7 found on three other hubs; unlike those three, sk-doc and system-deep-loop sit in the doctor's warn-only set [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804], so the release note's "zero warnings on every hub" claim [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:199] still does not hold on the current tree. The other two in-scope hubs are at parity (sk-code 2.2.12.0 and cli-external-orchestration 1.7.3.0 both equal their `SKILL.md`), so the warn-only set is only half-exercised.

## Questions Answered

None fully. Q4 part 3 is covered; Q4 also spans the six inventory READMEs, so it stays open.

## Questions Remaining

- Q4: the inventory READMEs (`.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/bin/lib/README.md`) and the deferred cli-devin README confirmation.
- Q5: which v4.0.0.4 user-facing changes the READMEs leave out where a reader would need them, and which statements checked out accurate — this iteration contributes four findings and six first-time verifications.

## Ruled Out

- Mode-packet README version parity as a drift class: closed by the frontmatter versioning standard — a mode README carries its own edition, raised by the bump rule, and only the parent-skill doctor's README check compares a hub root README with its `SKILL.md` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122]. Do not re-chase cli-pi 1.5.0.8 vs 1.5.15.0.
- cli-devin README as an audit target this iteration: not in the Q1 inventory. Its observed lines (`README.md:12` `version: 1.4.0.11`, `SKILL.md:5` `version: 1.4.6.0`, newest changelog `v1.4.6.0.md`) are consistent with the own-edition model and are deferred.

## Dead Ends

- None beyond Ruled Out.

## Edge Cases

- Ambiguous input: none material. The dispatch focus and the strategy's machine-owned "Next Focus" agreed this iteration.
- Contradictory evidence: hub README `:94` versus the cli-hermes packet's own contract (`SKILL.md:47`) — resolved in favor of the packet, which is the release authority for its own probe; classified WRONG rather than uncertain.
- Missing dependencies: none.
- Partial success: none. One bounded non-result: the cli-pi README `:92` guard description ("Process ancestry is checked first, then a .pi project-directory heuristic") was not re-verified this iteration; a token search over `cli-pi/SKILL.md` surfaced no corroborating line, so it stays unclassified rather than reported as a finding.

## Sources Consulted

- `.skilled/skills/sk-doc/README.md:1-232`, `.skilled/skills/sk-code/README.md:1-140`, `.skilled/skills/system-deep-loop/README.md:1-121`, `.skilled/skills/cli-external-orchestration/README.md:1-138`, `.skilled/skills/cli-external-orchestration/cli-pi/README.md:1-225` (full reads)
- `.skilled/skills/sk-doc/SKILL.md:5`, `.skilled/skills/system-deep-loop/SKILL.md:3`, `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:5`, `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:5` (version lines)
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1802-1857` (13c/13d version parity)
- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (headings and version-rule lines)
- `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:47-63`, `:183-236`; `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:53-223`; `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:1213-1476`
- `.skilled/skills/sk-code/SKILL.md:40`, `:74`, `:139`; `.skilled/skills/sk-code/mode-registry.json`; `.skilled/skills/cli-external-orchestration/mode-registry.json`; `.skilled/skills/cli-external-orchestration/hub-router.json`; `.skilled/skills/system-deep-loop/mode-registry.json`
- `.skilled/skills/sk-design/sk-design-chart/README.md:32`
- `.skilled/skills/sk-doc/scripts/validate_document.py:1510`, `:3303`
- `.skilled/commands/doctor/deep-loop.md`; `.skilled/commands/create/` listing; `.skilled/commands/deep/` listing; `.skilled/agents/` listing
- `.skilled/changelog/skilled/v4.0.0.4.md` (grep: `:14`, `:41`, `:149`, `:199`, `:281`, `:293`, `:297`, `:389`)
- `README.md` (link grep: `:655`, `:1594`); `specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/iterations/iteration-001.md:40` (inventory find pattern)
- Command outputs: version `awk` probes; registry `node -e` summaries; `ls` existence loops over the five sk-code packets, the seven cli-external mode dirs, the 28 sk-doc §9 targets and the cli-pi references/assets; `ls -la .skilled/` (`specs -> ../specs`); changelog tails (`v2.3.9.0`, `v1.6.3.0`, `v1.5.15.0`, `v1.4.6.0`)

## Assessment

- New information ratio: 0.70 (4 fully new findings + 6 first-time verifications at half weight = 7/10)
- Questions addressed: Q4 (part 3)
- Questions answered: none

## Reflection

- What worked and why: running the version-parity probe before reading anything caught two of the four findings in one command, and reading the doctor's 13c block plus the frontmatter versioning standard before classifying turned the cli-pi/cli-devin version lines from apparent drift into a verified non-finding — the contract, not intuition, decided it. The bounded existence loops (28 §9 targets, seven mode dirs, five packets) produced six defensible OK rows at one call each. Checking the registry and iteration 5 for prior chart-count findings before writing prevented a duplicate row.
- What did not work and why: two chained probes aborted early because an expected `ls` failure on a missing file broke an `&&` chain, costing a re-run and an overflow read; the pack's 12-call cap was exceeded again (about 25 calls; the config allows 24 per iteration and iteration 7 used 22) because full README reads plus contract reads plus artifact writes do not fit 12.
- What I would do differently: use `;` separators in evidence probes from the start, and check inventory membership (one awk) before probing any conditional target such as cli-devin.

## Recommended Next Focus

Q4 part 4: the six inventory READMEs (`.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/bin/lib/README.md`), applying the version-parity probe first where a `SKILL.md` sits above the README; then the deferred cli-devin README confirmation (own-edition model, already consistent) and the Q5 synthesis pass.
