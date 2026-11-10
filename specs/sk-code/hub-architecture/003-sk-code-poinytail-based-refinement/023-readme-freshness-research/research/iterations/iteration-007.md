# Iteration 7: Q4 part 2 — Hub READMEs for system-spec-kit, system-skill-advisor and sk-git

## Focus

Q4 part 2 per the dispatch: the three hub READMEs named in the focus — `.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-skill-advisor/README.md` and `.skilled/skills/sk-git/README.md` — and their mode READMEs where the root README links them, checked against v4.0.0.4 and the repository. The strategy's machine-owned "Next Focus" matched the dispatch this iteration.

Premise check: the root README's links for these hubs are the hub READMEs themselves (`README.md:524`, `README.md:770`, `README.md:1589`, `README.md:1592`) plus `.skilled/skills/system-spec-kit/runtime/README.md` (`README.md:1590`); it links no per-mode README of any of the three hubs (a targeted `awk` for `sk-git/README` returns 0 matches). No mode README falls in this scope; the runtime README stays on the Q4 inventory for a later iteration.

## Actions Taken

1. Read state first: config (sessionId `dr-023-readme-freshness-research-2026-10-12T14:40:22.000Z`, `progressiveSynthesis: true`, lineageMode `new`), the strategy, the registry head and iteration 6; 6 iteration records on disk → this is iteration 7.
2. Read the full changelog (452 lines) and extracted the items that target these hubs: the hub README version contract (`:199`), unknown-option refusal (`:279-281`), retired deep-loop modes (`:149-151`), advisor CI agreement (`:131-133`), `surfaceHint` (`:355-357`), per-doc versions (`:387-393`) and the install Node floors (`:405`, `:444`).
3. Read all three hub READMEs in full (694 / 253 / 296 lines, tails included) and grepped the root README for the three hub names to fix the link scope.
4. Probed the version model directly: `awk` for the `version:` line in each README and each `SKILL.md`; read the parent-skill doctor's version-parity section (`parent-skill-check.cjs` 13a-13d); parsed `hard-rules.json`, the validator registry and `runtime/cli/package.json`; listed the playbook headings and the doctor command files; grepped the advisor runtime for `surfaceHint`.

## Findings

| README path:line | Claim as written | Evidence | Class | Severity | Smallest proposed fix |
| --- | --- | --- | --- | --- | --- |
| `.skilled/skills/system-spec-kit/README.md:13` | frontmatter `version: 2.7.0.99` | `SKILL.md:5` carries `version: 2.7.13.0` (same `awk` probe on both files). The parent-skill doctor's 13c rule: "a hub README that declares a version is the front page of that release, so it carries the SKILL.md version", soft-failing every hub outside its warn-only set, which lists only cli-classifier, cli-external-orchestration, sk-doc and system-deep-loop [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1802]; v4.0.0.4 states the fixed state as "Each hub README states the version its `SKILL.md` carries" [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:199] | STALE | P1 | set `version: 2.7.13.0` |
| `.skilled/skills/system-skill-advisor/README.md:10` | frontmatter `version: 0.12.0.54` | `SKILL.md:5` carries `version: 0.15.6.0` (the changelog directory holds `v0.15.6.0.md`); same 13c rule and warn-only set [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1802] | STALE | P1 | set `version: 0.15.6.0` |
| `.skilled/skills/sk-git/README.md:11` | frontmatter `version: 1.8.4.0` | `SKILL.md:6` carries `version: 1.8.5.0` and the newest changelog entry is `v1.8.5.0.md`; same 13c rule [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1802] | STALE | P1 | set `version: 1.8.5.0` |
| `.skilled/skills/system-skill-advisor/README.md:113` (repeated in the command table at `:154`) | "`advisor_recommend` accepts six options: `topK` … `includeCompiledRoute`" | the option schema now carries a seventh, `surfaceHint` (string, 1-64 chars, forwarded to the compiled-route front door as `--surface-hint`, unknown surface ignored) [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:251], [SOURCE: .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts:24], [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:381]; v4.0.0.4 added it [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:357] | STALE | P2 | say "seven options" and add `surfaceHint` to the `:113` list and the `:154` table row |
| `.skilled/skills/sk-git/README.md:204` (the "8 categories" phrasing also at `:267`, `:288`) | "38 manual scenarios across 8 categories" | the playbook holds 39 `### GIT-` scenario headings (GIT-001..034 plus GIT-042..046, each exactly once) across the 8 GIT category sections 7-14 [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:167], plus a ninth section with 6 `### DOC-` headings (DOC-369..374); the heading-count command returned 39 | STALE | P2 | change 38 to 39 (or name the 6 doctor-command scenarios separately) |
| `.skilled/skills/system-spec-kit/README.md:49` | "Node.js 20.11 or newer" | the skill-root `package.json` engines say `>=20.11.0`, but the CLI workspace this README documents (`runtime/cli/`) declares `>=22.12.0` (`node -e` on `runtime/cli/package.json` printed `{"node":">=22.12.0"}`), and v4.0.0.4 states "the spec-kit CLI needs 22.12 or newer" [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:444] | STALE | P1 | "Node.js 22.12 or newer (the runtime CLI's floor; Node 24 satisfies every part)" |
| `.skilled/skills/sk-git/README.md:60` | "Evaluates every git command against 17 state-gated rules … (see `scripts/hooks/README.md`)" | `hard-rules.json` holds exactly 17 rules (its array length is 17); `scripts/hooks/README.md` exists in the hooks listing; the "six AI runtimes" breadth was not re-verified this iteration | OK-VERIFIED | P2 | none |
| `.skilled/skills/system-skill-advisor/README.md:194` | `/doctor:skill-advisor` targets: tune, rebuild, skill-graph-freshness, router-reach, skill-budget, parent-skill | `.skilled/commands/doctor/skill-advisor.md` argument-hint and route table list exactly these six targets | OK-VERIFIED | P2 | none |
| `.skilled/skills/system-spec-kit/README.md:63` (also `:462`, `:616`) | "the 41-rule registry with three strict-only rules gated behind `--strict`" | `node -e` parse of `runtime/cli/lib/validator-registry.json` → total 41, strict 3 | OK-VERIFIED | P2 | none |
| `.skilled/skills/system-spec-kit/README.md:431-433,448` | "core/ (28 modules)", "extractors/ (12 extractors)", "utils/ (18 utilities)", "references/ (41 files)" | entry counts by `ls` + `wc -l` → core 28, utils 18; extractors holds 12 `.ts` modules including the `index.ts` barrel; recursive file count under `references/` = 41 | OK-VERIFIED | P2 | none (the extractor wording counts `index.ts`) |
| `.skilled/skills/system-spec-kit/README.md:550-557` | four doctor commands `/doctor:speckit`, `/doctor:runtime-mirrors`, `/doctor:env`, `/doctor:update` | `.skilled/commands/doctor/` holds `speckit.md`, `runtime-mirrors.md`, `env.md`, `update.md` | OK-VERIFIED | P2 | none |

Note: the three version rows are one class of drift — the hub README frontmatter was not carried forward when each SKILL.md released. The doctor check that enforces the contract is `13c-readme-version`; for these three hubs it soft-fails (they are not in `README_VERSION_WARN_ONLY`), so v4.0.0.4's "Hub Checks Report No Warnings" claim [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:199] does not hold on the current tree.

## Questions Answered

None fully. Q4 part 2 is covered; Q4 also spans the remaining hub READMEs and the inventory READMEs, so it stays open.

## Questions Remaining

- Q4: the remaining hub READMEs (sk-doc, sk-code, system-deep-loop, cli-pi) and the inventory READMEs (`.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/bin/lib/README.md`).
- Q5: which v4.0.0.4 user-facing changes the READMEs leave out where a reader would need them, and which statements checked out accurate — this iteration contributes six first-time verifications (five OK rows plus the version-parity check) and six gaps.

## Ruled Out

- Mode READMEs for the three hubs as this iteration's audit target: the root README links no per-mode README for them (0 matches for `sk-git/README`; the only nested README it links is `system-spec-kit/runtime/README.md`, which remains on the Q4 inventory). Do not chase per-mode READMEs for these hubs again.

## Dead Ends

- None this iteration.

## Edge Cases

- Ambiguous input: none material. The dispatch focus and the strategy's machine-owned "Next Focus" agreed this iteration.
- Contradictory evidence: the README version fields versus the SKILL.md versions — resolved by the doctor's own 13c contract (the README carries the SKILL.md version) and by changelog `:199`; classified STALE rather than uncertain.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/README.md:1-694` (full read)
- `.skilled/skills/system-skill-advisor/README.md:1-253` (full read)
- `.skilled/skills/sk-git/README.md:1-296` (full read)
- `.skilled/skills/system-spec-kit/SKILL.md:5`, `.skilled/skills/system-skill-advisor/SKILL.md:5`, `.skilled/skills/sk-git/SKILL.md:6` (version lines)
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1755-1840` (13a-13d version parity)
- `.skilled/commands/doctor/skill-advisor.md` (route targets)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:251`, `runtime/tools/advisor-recommend.ts:24`, `runtime/handlers/advisor-recommend.ts:364-439`, `runtime/skill-advisor-cli-manifest.ts:58`
- `.skilled/skills/sk-git/hard-rules.json`; `.skilled/skills/sk-git/scripts/hooks/` listing
- `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` (heading walk)
- `.skilled/skills/system-spec-kit/package.json`, `runtime/package.json`, `runtime/cli/package.json` (engines)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`
- `.skilled/changelog/skilled/v4.0.0.4.md:1-452` (full read)
- `README.md` grep for the three hub names (53 matches; link lines 524, 770, 1589, 1590, 1592)
- Command outputs: version `awk` probes; `ls -1` walks of the three skill roots, `runtime/cli/`, `extractors/`, `references/`, `.skilled/commands/doctor/`; `node -e` on `hard-rules.json` (17), validator registry (41/3), engines; heading counts (39 GIT, 6 DOC)

## Assessment

- New information ratio: 0.77 (6 fully new findings + 5 first-time verifications at half weight = 8.5/11)
- Questions addressed: Q4 (part 2)
- Questions answered: none

## Reflection

- What worked and why: reading the changelog's hub-contract line (`:199`) before the READMEs turned the version model into a targeted one-command check per hub, and the doctor source then supplied the authoritative rule text, so all three version rows rest on both a release note and the enforcing code. Grepping the advisor runtime for `surfaceHint` confirmed the schema change from three independent files (schema, tool definition, handler) instead of trusting the changelog prose. The full-file reads of all three READMEs kept the OK rows anchored to exact lines.
- What did not work and why: state reads plus full-file reads of three long READMEs and the changelog pushed this iteration to 22 research calls, above the persona's 8-11 target and the pack's 12 cap (the config allows 24 per iteration). The `ls -1t` probe for the newest changelog entry sorted by mtime, not version, and misled at first glance; the version-parity answer had to come from the doctor's `compareVersions` sort instead.
- What I would do differently: run the doctor's version-parity comparison first (one command per hub) and read only the README sections its failures implicate, instead of full-file reads before the cheap check.

## Recommended Next Focus

Q4 part 3: the remaining hub READMEs — sk-doc, sk-code, system-deep-loop and cli-pi (if the root README links it) — applying the same doctor 13c version-parity check first, since it caught all three hubs here; then the inventory READMEs (`.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/bin/lib/README.md`).
