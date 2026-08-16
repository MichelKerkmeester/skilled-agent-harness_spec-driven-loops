# Iteration 10: Licensing, Notices, Docs, Maintenance (Q10)

## Focus
Final approved lane (10 of 10): MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key. Investigated what the fork (`pi-fast-mode-w-subagent-support`) must do on the licensing/docs/maintenance surface to be publish-ready, grounded in (a) the three pinned upstream snapshots in `context/`, (b) the phase-001 fork contract, (c) the live environment docs (`.pi/PLUGINS.md`, `.pi/SYNC.md`).

## Actions Taken
1. Inventoried `context/**/LICENSE`, `README*`, `package.json`, `THIRD_PARTY_NOTICES*` across all three upstreams (find).
2. Read all three LICENSE files + full package.json manifests (license field, keywords, files, pi key, author, publishConfig).
3. Read `.pi/PLUGINS.md` (installed-plugin reference list) and `.pi/SYNC.md` (pi sync manifest) in the live environment.
4. Read `context/README.md` (snapshot provenance table) and grepped phase docs (001/002/003) + spec.md for license/provenance/notice requirements (CHK-009/CHK-012/CHK-013, REQ-FUNC-4, 003 install-transition plan).
5. Confirmed absence of any THIRD_PARTY_NOTICES/NOTICE file in all context snapshots (negative result, reported honestly).

## Findings
1. **MIT baseline is uniform across all three upstreams.** Each ships a full MIT LICENSE file and `"license": "MIT"` in package.json; copyright holders differ (John Munson 2026 — fork base; devwithpug 2026; TheBinaryGuy 2026). [SOURCE: context/pi-openai-fast-mode/LICENSE:1-2, context/pi-gpt-fast-mode/LICENSE:1-2, context/pi-fast-mode/LICENSE:1-2, package.json license fields]
2. **Fork LICENSE handling is already contractually fixed: copy unchanged.** 001-fork-and-package/spec.md:128 — LICENSE is "Copy | unchanged (LICENSE retains upstream MIT attribution)"; checklist CHK-012 [P1] gates it ("LICENSE retains upstream MIT attribution (third-party notice preserved)"). The fork must NOT re-license or re-copyright the copied baseline. [SOURCE: 001-fork-and-package/spec.md:128, 001-fork-and-package/checklist.md:70]
3. **THIRD_PARTY_NOTICES: no separate file exists in any upstream, and none is required.** `find` across all three context snapshots returned zero `*third*`/`*notice*` files; the retained MIT attribution in the copied LICENSE (finding 2) IS the third-party notice mechanism per CHK-012. A separate THIRD_PARTY_NOTICES file is optional, not mandated. [SOURCE: find result (empty), 001-fork-and-package/checklist.md:70]
4. **README provenance is gated by two P1 checks + one functional requirement.** CHK-009 [P1]: `rg -n "pi-openai-fast-mode" README.md` must return only the provenance note + repository URL; CHK-013 [P1]: README cites upstream repo and commit `9b28456` (v0.3.0); REQ-FUNC-4: upstream git history preserved in `context/` reference and noted in README. [SOURCE: 001-fork-and-package/checklist.md:62,76; 001-fork-and-package/spec.md:143,160; 001-fork-and-package/plan.md:108,125,130]
5. **Context snapshot provenance is already pinned.** `context/README.md` tables all three upstreams with exact commits (pi-openai-fast-mode `9b28456` v0.3.0 as fork base; pi-gpt-fast-mode `2ac61e0` handoff ref; pi-fast-mode `e2827b6` UX ref) and a refresh policy (re-clone/re-pin, never edit snapshots in place). The fork's provenance story rides on this table plus the README note. [SOURCE: context/README.md:3-12]
6. **PLUGINS.md mechanics: alphabetical reference list, `pi list` + repo/homepage as source of truth.** The live `.pi/PLUGINS.md` currently lists pi-gpt-fast-mode v0.1.2; 003 phase plan mandates updating PLUGINS.md (sorted) in the same transition that installs the fork and removes pi-gpt-fast-mode (the /fast-collision-avoidance move from iteration-5). The fork becomes a PLUGINS.md entry after install. [SOURCE: .pi/PLUGINS.md (pi-gpt-fast-mode entry), 003-integration-and-tests/plan.md:52, iteration-005 findings 28-32]
7. **Sync manifest: the fork's install surface is explicitly "not synced".** `.pi/SYNC.md` classifies `npm/` as "operator-local package output — not synced"; the sync checkers (`sync-agents-pi.cjs --check`, `sync-prompts-pi.cjs --check`, agent-roster-mirror-check) cover only generated agents/prompts. So the fork's maintenance duty on the docs side is: PLUGINS.md update + commit per sync manifest — the generators never touch it. [SOURCE: .pi/SYNC.md §2 inventory, §4 sync workflow; 003-integration-and-tests/plan.md:52]
8. **npm keywords + pi key conventions.** All three upstreams open keywords with the constants `pi-package`, `pi-extension` then add component tags (openai/gpt-5/codex, fast-mode, priority, service-tier, flex, pi-coding-agent). The `pi` key carries `extensions` (load gate, iteration-6) and optional `image` (gallery preview — present in openai/gpt, absent in TBG); scoped names add `publishConfig.access: "public"` (TBG). `files` arrays include LICENSE in 2 of 3 (pi-gpt-fast-mode, TBG); pi-openai-fast-mode omits it — low severity because npm auto-includes LICENSE/README/package.json in tarballs regardless of `files`, but explicit inclusion is the safer convention to copy. [SOURCE: package.json of all three; iteration-006 findings 34-41]

## Ruled Out
- Separate THIRD_PARTY_NOTICES file as a fork deliverable — none of the three upstreams ships one and CHK-012 defines retained LICENSE attribution as the notice mechanism. Recorded for reducer "Exhausted Approaches" if desired.
- npm-registry metadata validation of keywords/pi key — respects iteration-6 exhausted entry; shipped manifests + installed docs are ground truth.

## Dead Ends
- None this iteration. No BLOCKED exhausted category applies to lane 10; prior exhausted entries (dist over src, npm-registry spawn hunting) were respected.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: "THIRD_PARTY_NOTICES" does not exist as a file anywhere in scope — a negative result resolved by reading CHK-012, which defines the alternative mechanism. Status classification: `missing-dependency` recorded; evidence is sufficient for a confident answer.
- Partial success: none; all research actions succeeded.
- Scope note: `progressiveSynthesis` is true in config but the dispatch contract's allowed-write list (3 artifacts) excludes `research/research.md`; per packet-scope lock the synthesis update is deliberately skipped this run (reducer owns it).

## SCOPE VIOLATIONS
- None. All writes confined to the three allowed artifact paths; all researched files read-only.

## Sources Consulted
- context/pi-openai-fast-mode/LICENSE, context/pi-gpt-fast-mode/LICENSE, context/pi-fast-mode/LICENSE
- context/pi-openai-fast-mode/package.json, context/pi-gpt-fast-mode/package.json, context/pi-fast-mode/package.json
- context/README.md:3-12
- 001-fork-and-package/checklist.md:62,70,76; 001-fork-and-package/spec.md:128,143,160; 001-fork-and-package/plan.md:108,125,130
- 003-integration-and-tests/plan.md:52
- Public .pi/PLUGINS.md; Public .pi/SYNC.md (§2, §4)
- research/iterations/iteration-006.md (findings 34-41); research/iterations/iteration-005.md (findings 28-32)

## Questions Answered
- Q10: Licensing, notices, docs, maintenance — MIT compliance (uniform MIT baseline, LICENSE copied unchanged per CHK-012); THIRD_PARTY_NOTICES (no separate file; retained attribution is the notice); README provenance (CHK-009/CHK-013, commit `9b28456`); PLUGINS.md and sync-manifest (npm/ not synced; PLUGINS.md entry added in 003 transition); npm keywords and pi key conventions.

## Questions Remaining
- None. All 10 approved lanes answered.

## Assessment
- New information ratio: 0.94
- Questions addressed: 1 (Q10)
- Questions answered: 1 (Q10) — 10/10 lanes complete

## Reflection
- What worked and why: pairing the phase-001 contract (CHK-009/012/013, REQ-FUNC-4) with the live `.pi` docs made every "what must the fork do" claim a citation-backed requirement rather than an opinion — the phase docs define the checks, PLUGINS.md/SYNC.md define the maintenance surface, and the three manifests define the convention.
- What did not work and why: nothing failed; the only negative was the missing THIRD_PARTY_NOTICES file, which was resolvable by reading the CHK-012 definition instead of treating absence as a gap.
- What I would do differently: in the implementation phase, copy pi-gpt-fast-mode/TBG's explicit `LICENSE` in `files` into the fork manifest (safer than relying on npm's auto-include), and keep the README `rg` gate as the final provenance verification.

## Next Focus
Run complete — no next lane. Handoff to implementation:

## Recommended Next Focus
Run complete — no next lane. Handoff to implementation: 001 phase (LICENSE copy, README provenance, PLUGINS.md update) then 003 phase install transition, per the phase docs.
