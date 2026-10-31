# swe lineage: lead reviews

Written by the swe lead (Opus 5.5 high) as review annotations for the synthesis leaf, one entry per iteration, with a short steering note in case a later iteration reads this file. Wave 1 entries carry no sibling finding.

## Review of iteration 1 (swe-01)

**Verdict: strong.** It took the angle, stayed within wave 1 ("Independent" line present) and wrote only inside `swe/`. No `steer.md` existed when it ran. Refinements ALL-1, ALL-4, ALL-8 and swe-01 applied, so the placeholder-key record was prompted by ALL-8. The code evidence is the iteration's own.

- STRONG-FINDING: the field gap is settled from both sides of the wire, and it is asymmetric. `noul` requests pass, while `choice` and `score` get a 400 because `criteria` is sent (`jev_cli/__init__.py:364-378`) and `options` or `levels` is required (`deem_server.py:535-544`). On the response side `choice` aligns, while `value` and `level` diverge (`:594-621` against `jev_cli/__init__.py:389-393`). Lead reopened all four: resolved.
- STRONG-FINDING: `run` is a clean passthrough (`provider_request` transforms only `vercel`, `jev_cli/__init__.py:221-235`), and Deem ignores the request `model` (`deem_server.py:880-894`). Resolved.
- STRONG-FINDING: a `JEV_API_KEY` placeholder in the child environment satisfies `api_key("custom")` (`jev_cli/__init__.py:90-92`, bearer always sent at `:280`) without touching the credential store. Resolved.
- DEFECT: the choice-count pre-check uses the 2 to 255 bound from the module docstring (`deem_server.py:18`). The served torch backend reads at most 26 letters (`:166`) and returns 400 `unsupported_option_count` above that (`:224-230`). The client's bound, and its 256-option test, must be 26 for `torch` and the minimum across members for `ensemble:` (`:273-274`).
- WEAK-CLAIM: "`health_ok` lacks a model pin, so a stale checkpoint would pass." The `model` field is a launch label (`--model-id` from `DEEM_MODEL_ID`, `deem_server.py:930`; set by `deem-ctl:115`), never read from the weights. A pin catches a server started outside `deem-ctl` (the default is `deem-1.5`, `:107`), not a stale checkpoint. Weights identity lives only in `models/current` and `deem-ctl status` (`deem-ctl:195-198`).
- WEAK-CLAIM: build-now for N-swe-01-1, whose savings row reads "saves nothing directly". A transport with no measured consumer does not meet spec risk row 3's bar. It fits better as "next, built with its first consumer".
- DRIFTED-CITE: the ordering in which `--value` is refused after the call is at `cli-reference.md:73-76`, not `:23-25`. The code cite `jev_cli/__init__.py:391`, `:429-431` resolves.
- Open, not a defect: the exit-3 reuse for "stub backend" collides with the Python `jev-cli` meaning of exit 3 (credential failure, `cli-reference.md:153`). The iteration flags it itself.

**Steering for iterations 2 and 3 (optional, wave 1):**
- swe-02 and swe-03 are unrelated to `cli-deem`. Do not carry swe-01 forward except the corrected 26-option bound where a `choice` over leaves appears (swe-03 Q2: a ROUTER leaf set larger than 26 cannot be one Deem `choice`).
- Give every residue or router slice a counted baseline per ALL-6, or UNKNOWN with the `rg` method. No estimates presented as counts.
- Name functions that exist by `file:line`, and label new ones "proposed". Give LOC per function, as iteration 1 did.

## Review of iteration 2 (swe-02)

**Verdict: adequate.** It took the angle, wave 1 held ("Independent" line), and it wrote only inside `swe/`. There is no sign it read `steer.md`: it names none, and the 26-option correction from review 1 does not appear. The check map is new ground, since BASE2 examined only `hvr_scan.py`. The answer shape is missing.

- STRONG-FINDING: a 16-row sk-doc check map with a residue per check. The silent `readme` fallback resolves (`validate_document.py:255-256`). The warning-versus-blocking asymmetry for a non-FQ MCP token between skill and command resolves (`quick_validate.py:249-252`). The DQI bands resolve (`extract_structure.py:1132-1143`), and so do HVR's nine reader-needed categories (`hvr_scan.py:17-21`).
- STRONG-FINDING: a citation-drift residue (its R-d) and a description-to-body fit residue (R-b). Both are new against BASE2, and each has a bounded unit (one citation, one description).
- DEFECT: "`validate_general_structure` is env-gated off by default" is inverted. `_structure_enforcement_enabled` defaults to `'1'` and is opted out with `SKDOC_ENFORCE_STRUCTURE=0` (`validate_document.py:540-545`). Drop the map cell and the New against baseline row.
- DEFECT: wrong counts. `template-rules.json` holds 13 `documentTypes`, not 12 (it adds `feature_catalog`). `.claude/agents/` holds 12 agent `.md` files plus `README.txt`, not 10. Its hand-off "choice over the 12 types" should read 13.
- DEFECT: none of the five residues has a per-idea record. It gives no two-backend gate, no metric with a counted baseline (ALL-6), no verdict and no confidence. The labels R-a to R-e look like baseline `R` ids (contract item 13). They should be `N-swe-02-1` to `N-swe-02-5`.
- WEAK-CLAIM: R-a (the HVR §2, §4 and §5 residue) is BASE2's R22 widened from one category to nine, not a new idea. The table marks it "confirms BASE". Treat R-a as an R22 extension.
- WEAK-CLAIM: "citation drift is what the synthesis ledger does by hand" is asserted with no count of `file:line` citations in any doc set, and `reference_checker*.py` (4 files under `DOC/shared/scripts/`) is described without a line cite.

**Steering for iterations 3 and 4:**
- swe-03 (wave 1): trace ROUTER leaf selection with `file:line` and count the gold scenarios. A `choice` over leaves is bounded by the served torch backend's 26 options (`deem_server.py:166`).
- swe-04 (wave 2), and later swe-06: every candidate needs a per-idea record with the two-backend gate and a counted baseline, or UNKNOWN plus the `rg` method. For swe-06, pick between R-b and R-d on a count: how many `file:line` citations or descriptions exist in a named doc set. Then write the label schema.
- Stop asserting validator behavior from docstrings or names alone. Open the function and cite the line that decides.

## Review of iteration 3 (swe-03)

**Verdict: adequate.** It took the angle, wave 1 held, and it wrote only inside `swe/`. There is no sign it read `steer.md`: it names none and does not cite the 26-option cap. The stage trace is strong new ground, but two of its census numbers do not reproduce.

- STRONG-FINDING: compiled routing stops at the mode level. `normalizeTargets` emits destination ids only (`014-runtime-engine/lib/compiled-route.cjs:87-92`). Any failure falls back to the legacy sentinel (`resolve.cjs:105-125`, `:151-152`). Leaf choice is the model following `ROUTER.md` prose, with the machine block at `sk-code/ROUTER.md:307-309`. Resolved.
- STRONG-FINDING: N-swe-03-2, an offline leaf replay whose keyword-scorer arm needs no backend. It is the first deterministic leaf baseline anyone has proposed.
- DEFECT: the canary count contests BASE1 wrongly. A lead recount of all seven `canary-cases.v1.json` by `expectedAction` gives clarify 3 and defer 10, so 13 rows, which matches BASE1 row 19. Route is 62, not 63. Its "contests BASE" row should read "confirms BASE with new evidence".
- DEFECT: the leaf-gold census does not reproduce. `rg -l '^expected_leaf_resources:'` under `manual-testing-playbook/**/*.md` gives sk-doc 26 files with 1 empty array (25 usable, not 34), system-deep-loop 20 with 14 empty, cli-external-orchestration 10 with 5 empty, mcp-tooling 16 with 1 empty, sk-design 4 and sk-code 1. The iteration states no method, so treat its 92 as lineage-reported. The conclusion "only sk-doc has enough gold" survives.
- DEFECT: N-swe-03-1's Deem check (`/health` ok plus `/v1/models` listing `deem-0.8-v1`) passes a stub launched with `DEEM_MODEL_ID` set (`deem_server.py:930`). ALL-4 requires parsing `backend` and refusing `stub`.
- WEAK-CLAIM: the token savings are underestimated. By bytes/4, sk-doc's `ROUTER.md` (27,808 B) is about 7k tokens and sk-code's (44,407 B) about 11k, not 3-4k and 5-6k. Whether a model loads the whole file per route is unmeasured.
- WEAK-CLAIM: "the model never opens ROUTER.md". The machine block declares itself lossy (`sk-code/ROUTER.md:311`), and surface detection plus the trio rule live in prose. Emitting `RESOURCE_MAP[intent]` alone drops them.
- DRIFTED-CITE: `lookup-trigger-index.mjs` is described "from iter-001/002 session reading", but neither iteration's actions list opened it (contract item 5).

**ALL-7 correction (orchestrator):** dedupe by `message.id` only for token usage. To count tool calls, count every `tool_use` block across all records, because one message's blocks span several records and first-record-only counting loses about 84% of them. Any tool-call count built on the old rule is a DEFECT.

**Steering for iterations 4 and 5 (wave 2):**
- swe-04: carry N-swe-03-2 forward with a stated count method. Fix the Deem probe per ALL-4 and give the byte count per `ROUTER.md`. Read the newest grok, deepseek and mimo iteration files. One sibling contests swe-01's `cli-deem` build-now on zero runtime callers; answer it with code or concede.
- swe-05: count ties from named scenario files (swe-05 refinement), and state the counting command for every number.

## Review of iteration 4 (swe-04)

**Verdict: strong.** It took the angle and wrote only inside `swe/`, and its Sibling check names mimo-001, deepseek-004 and 009, grok-010 and glm-001. It builds past them rather than repeating them: deepseek's PreCompact budget and grok's census-first ordering are cited as theirs, and the new work is a function-level 005 amendment ported from vendored code it opened. It does not say it read `steer.md`. Its probe now refuses `stub` and pins the model id (review 3's DEFECT is fixed, and it cites deepseek-04 F10 for this), but it repeats the ROUTER token estimate that review 3 corrected, so the read is unclear.

- STRONG-FINDING: N-swe-04-1, an offline deletion arm as a 005 amendment. It rides the census's `toMessages()` and the truncation bound (005 `plan.md:64-71`), is gated on the printed stop line (005 `spec.md:170-178`), and has a keep-or-kill rule written as printed comparisons. The ported question shape (`compact.ts:58-67`) and `decideCall` (`:104-118`) resolve.
- STRONG-FINDING: it prefers Deem for this arm only, on privacy grounds, citing 005's payload class (005 `spec.md:91`). It contests a general Jev-first ordering with a reason specific to this payload.
- DEFECT: "census-first is the only ordering four lineages independently reached" is false independence. grok-010 and deepseek-009 are W4 iterations that read their siblings. Count it as cross-read agreement, not corroboration.
- DEFECT: the vendored procedure is the npm `jevctl` 0.2.3 tree (`R/jev-cli-main/src/vendor/compaction/`), and the iteration never names the package. Its Jev leg "posts `{state, questions}`" would need a key in the script. Under D5 the Jev leg must shell the Python `jev-cli` 0.6.2 `run`.
- DEFECT: the port fails open. The vendored orchestration defaults a missing answer to keep (`compact.ts:283-284`, `{ keepCall: 1, keepResult: 1 }`). The record promises `unasked` and no default, but it never names that line or says how `unasked` calls enter `additional_reduction`.
- WEAK-CLAIM: "agree ≥ 0.68" reuses BASE2's R1 power figure (the true win rate needed for 80% power, BASE2 §1) as an agreement threshold. That is a different quantity, and it needs its own derivation.
- WEAK-CLAIM: "compaction wins by two orders of magnitude" compares boundaries to routes with no route count on either side.
- WEAK-CLAIM: Deem is preferred with a request of up to 30,000 tokens (`compact.ts:25`). No context limit for the 0.8B was found in `DEEM/`, and the server serializes passes under one lock with no length cap (deepseek lineage summary, `deem_server.py:201-211`), so latency and fidelity at that length are UNKNOWN.
- DRIFTED-CITE: the 212-boundary count is at 005 `spec.md:66`, not `:60`.

**Steering for iterations 5 and 6:**
- swe-05: grok's summary says `sk-design` sits outside the compiled closure (`sk-design/SKILL.md:202-203`) and that `classify_intents` has no code definition. Open both before placing a tie-break seam. Count ties from named scenario files only.
- swe-06: deepseek found that `AC_COVERAGE` checks a `file:line` is present and never that the file exists (`check-ac-coverage.sh:280-382`). Weigh the citation-drift residue (N-swe-02 R-d) against that zero-call fix before proposing a classifier. Write a full per-idea record.

## Review of iteration 5 (swe-05)

**Verdict: adequate.** It took the angle and wrote only inside `swe/`. There is no sign it read `steer.md`: it did not open `sk-design/SKILL.md:202-203`, as review 4 asked. Its tie census is new and reproduces, but it skipped the wave 2 cross-read, and its top idea's savings contradict its own seam.

- STRONG-FINDING: 0 ties within `AMBIGUITY_DELTA = 1` across the 9 prompts it scored. The lead recomputed two by hand from `sk-prompt/SKILL.md` `INTENT_MODEL` and substring scoring (`:186-192`). The playbook's real-user tiebreaker line scores FRAMEWORK 14 against TEXT_ENHANCE 7, and the scenario's prompt line scores 14 against 4, both as reported. The scenario named for the tie-break does not tie.
- STRONG-FINDING, contests grok with code: sk-design is served compiled at the hub edge. It is in `DEFAULT_ON_HUBS` (`resolve.cjs:36-44`), and its activation manifest reads `servingAuthority: compiled` (`013-live-activation/activation/sk-design/manifest.json`, lead-read). grok's "outside the compiled closure" rests on `sk-design/SKILL.md:203-204`, which the code contradicts. That is doc drift in the repository. Whether identity binding (`resolve.cjs:115-119`) serves a route at runtime is UNKNOWN until the orchestrator runs `compiled-route.cjs --hub sk-design`.
- DEFECT: the wave 2 rule is broken. grok-05 and grok-06 exist and were "not opened". Coverage "stands from swe-04" does not satisfy the requirement that each iteration read the newest sibling files first. Its sk-design finding is therefore uncontested in-file rather than reconciled.
- DEFECT: N-swe-05-1's savings contradict its seam. The pseudocode sits inside `SKILL.md`, which loads whole on invocation, and the record keeps the block there ("SKILL.md keeps the prose contract"). A port then saves 0 context tokens unless the block moves out. It is a model-free port, a build-nothing competitor (Q3), not a classifier finding.
- WEAK-CLAIM: "no seat" rests on 9 authored scenario prompts, 5 of them test-description lines that embed intent names. That shows the corpus has no ties, not that real use has none. No transcript count of sk-prompt invocations was taken.
- WEAK-CLAIM: the tie scores come from a port it ran, but no script is saved in `swe/` and no command is cited, so the synthesis cannot rerun it (ALL-6 spirit). Minor: `sk-prompt/manual-testing-playbook/` holds 29 `.md` files, not 30.
- The optional tie-break probe again reads `/health` plus `/v1/models`. It should refuse `stub` per ALL-4, as swe-04's probe does.

**Steering for iterations 6 and 7:**
- swe-06: read the newest grok, deepseek, mimo and glm files first and name them. Weigh the citation-drift residue against deepseek's zero-call `AC_COVERAGE` existence fix (`check-ac-coverage.sh:280-382`) before choosing a classifier. Save any counting script in `swe/` and cite it.
- swe-07: deepseek's summary puts the `cli-jev` move at 81 files plus 45 outside. Verify it with `rg` before writing the migration commands. Name the file every registry entry must pass (`ci-skill-root-metadata.cjs`, `validate_skill_package.py`).

## Review of iteration 6 (swe-06)

**Verdict: adequate.** It took the angle, wrote only inside `swe/`, and gives the first complete per-idea record in this lineage for a validator residue. There is no sign it read `steer.md`: review 4's request to weigh deepseek's zero-call `AC_COVERAGE` existence fix is not addressed. Its cross-read is thin, and one premise it reuses is wrong.

- STRONG-FINDING: N-swe-06-1, a citation-drift scan. It is exit-0 and advisory, and it never edits a validator. `dead` (missing file or line past EOF) is settled with no model call, and only live citations reach a `noul`. It has a label schema, a precision and recall scorer, 8 named tests, and a no-backend line that is exactly today's behavior. Its probe refuses `stub` and pins the model id (ALL-4 held).
- STRONG-FINDING: labels can be manufactured by drifting a citation on purpose. That is the only constructible gold proposed in round 3 so far.
- DEFECT: "`reference_checker*.py` verifies a cite's shape and target existence" is wrong. `reference_checker.py:5-12` builds a disposition ledger from a semantic rename map, and `reference_checker_core.py:431-446` checks source and target paths of map entries. It never parses `file:line` citations. The claim was inherited from swe-02 without reopening. The residue still stands, but "confirms BASE with the population counted" rests on a false premise.
- DEFECT: the wave 2 cross-read is incomplete. "mimo still only iteration-001" is false: `mimo/iterations/iteration-002.md` (mimo-02, the angle's named target on judgment calls after validators pass) is timestamped 08:56:51, before this iteration. It read deepseek-003 but not deepseek's newest, and read no grok or glm file.
- DEFECT: the counts do not reproduce and give no command. A lead `rg -o '[\w./-]+\.(ts|cjs|mjs|js|py|md|json|sh):\d+' .skilled/skills --glob '**/*.md'` gives 403 occurrences in 369 lines, not 456. `rg -c '^description:'` gives 3,658, not 3,551. Mark both as lineage-reported. "~10 agent docs" repeats review 2's DEFECT (12 files).
- WEAK-CLAIM: manufactured drift labels skew toward easy cases (a whole-line change). Precision on them overstates natural drift, where a line still half-supports its claim. The label set needs natural samples beside the manufactured ones.
- WEAK-CLAIM: the saving of 8 to 15 hours is an estimate of 1 to 2 minutes per citation, with no count of how often anyone audits citations today.

**Steering for iterations 7 and 8 (wave 3: new skills and workflows with measured value):**
- swe-07: read the newest file of every sibling first and name it. Verify deepseek's migration count (81 files plus 45 outside) with a stated `rg` before writing the `git mv` list. Write the `mode-registry.json` and `hub-router.json` entries out, and check them against `ci-skill-root-metadata.cjs` and `validate_skill_package.py` by reading, not running.
- swe-08: count the callers of a shared probe from the records so far: swe-03 leaf, swe-04 arm, swe-05 fallback and swe-06 citation scan, plus `deem-ctl:58-66` and 002, 003, 005 and 006. Say which of them are certain (a Planned phase) versus proposed, since row 27's third-caller rule counts only certain ones.

## Review of iteration 7 (swe-07)

**Verdict: adequate.** It took the angle and wrote only inside `swe/`. It builds on glm-02 and deepseek-07 by name and adds the concrete registry and router JSON plus a list of what the validators would reject. There is no sign it read `steer.md`: review 6 asked it to verify the migration count with `rg`, and it reuses deepseek-07's 53 and 39. Two claims that the design leans on are wrong.

- STRONG-FINDING: both `mode-registry.json` entries and the `hub-router.json` block are written out, with `tieBreak` an exact permutation of `modes[]`. The mint is gated on a count of live callers (`cli-deem` callers = 0), and the iteration resolves the deepseek-07 against glm-02 disagreement with that count rather than by tally. It adds `cli-deem`'s lifecycle as documentation over `deem-ctl`, with no reimplementation.
- DEFECT: "a shared helper at hub root is structurally impossible" is false. `skill-root-metadata-contract.cjs` governs only the nine `METADATA_FILES` (`:45-55`; `isContractFile` at `:316-318`), and `legalFilesForClass` (`:321-330`) applies to those names. `cli-jev/shared/README.md` and `sk-design/shared/` already sit at hub roots. The placement conclusion it hands to swe-08 is unsupported.
- DEFECT: the migration loses files. It `git mv`s only `cli-jev/cli-usage` (59 files) and then runs `rm -rf .skilled/skills/cli-jev`. That deletes the hub's other 22 files, including `manual-testing-playbook/` (the 3 hub-routing gold scenarios), `benchmark/`, `changelog/` and `shared/`.
- DEFECT: stale counts. The lead counts 81 files under `cli-jev/` and 49 files outside `specs/` that name `cli-jev` (`rg -l 'cli-jev' --hidden`, excluding `specs/`, `.git/` and the hub itself). That agrees with deepseek's lead correction ("81 files plus 45 outside, not 53 and 39") in `deepseek/steer.md`, not with the 53 and 39 used here.
- DEFECT: the Sibling check calls mimo-001 "newest" while `mimo/iterations/iteration-003.md` existed (timestamped 09:03). It is the third iteration in a row to under-read siblings.
- DRIFTED-CITE: `deem-no-key-ceremony` cites `deem_server.py:809-811` for "no auth". Those lines send the CORS header. The no-auth evidence is `do_POST` at `:867-904`.

**Steering for iterations 8 and 9:**
- swe-08: do not build on "no helper at hub root". Weigh the placement options (a hub `shared/`, a packet `scripts/`, or a runtime dir) against who imports the helper. Count certain callers (Planned phases only) apart from proposed ones.
- swe-09 (wave 4: cost, order and kill criteria): read all ten own iterations and the newest sibling files, and carry forward the corrected numbers from this file, not the originals: 403 citations, 13 clarify/defer rows, 25 usable sk-doc leaf gold, the 26-option cap, and 81 plus 49 for the move.

## Review of iteration 8 (swe-08)

**Verdict: adequate.** It took the angle and wrote only inside `swe/`. It gives the first by-phase census of the probe's callers and a full probe contract with eight weight-free tests. There is no sign it read `steer.md`: it builds on the hub-root claim that review 7 marked false. Its sibling read is again stale: it calls mimo-001 "folded", while `mimo/iterations/iteration-003.md` was on disk at 09:03, before this iteration.

- STRONG-FINDING: callers counted by phase. 0 are built. Every existing gate is Jev-only, and REQ-002 and REQ-012 carry the same three checks (002 `spec.md`, 006 `spec.md:151`). 002 forbids a shared helper inside 002 (`002/spec.md:97`, lead-read, agreeing with glm's summary item 3). Row 27 applied: align the skip lines now, extract at the third built caller.
- STRONG-FINDING: the probe contract. Deem and Jev probes are independent and never fuse (the custom-provider trap). The Deem pass is an allowlist (`torch` or `ensemble:` without `stub`) plus a model pin. Memoization is per process only, because `deem-ctl update` swaps weights; this agrees with glm's summary item 1 (`deem-ctl:163-167`). Skip lines are copy-ready.
- DEFECT: "helper home decided by elimination" rests on swe-07's false "hub root is impossible". The contract covers only the nine `METADATA_FILES` (`skill-root-metadata-contract.cjs:45-55`), and `cli-jev/shared/` exists. `.skilled/bin/` may still be right because callers span three packages. Argue it on that ground alone.
- DEFECT: test case 5's fixture prints `jevctl 0.2.3`. BASE2's shared gate contract records that the npm `jevctl` prints a bare `0.2.3`. The fixture should match the real output, or the test proves a case that never happens.
- WEAK-CLAIM: a 500 ms probe budget inside a hook, with three `jev` spawns of a Python CLI on the Jev side. Spawn cost is unmeasured (`LOCAL:50` names the same gap), so "fits the hook" is inferred.
- DRIFTED-CITE: the stub refusal is quoted from deepseek as `deem_server.py:972-977`. Those lines build an `EnsembleBackend`. The stub class is at `:137-154`, with `name = "stub"` at `:145`.

**Steering for iterations 9 and 10 (wave 4):**
- Read `glm/steer.md`'s lineage summary. Its defect list names the unsourced 0.68 bar that swe-04 reused. Replace it or derive it.
- swe-09: order by what each slice needs first (labels, a gate outcome or nothing). Use the corrected numbers from reviews 3, 6 and 7, and drop the hub-root placement argument.
- swe-10: the first PR should need no labels and no backend. The candidates the records support are the leaf replay's keyword arm (N-swe-03-2) and the citation scan's `dead` check (N-swe-06-1, no model call). State its observable check and rollback.

## Review of iteration 9 (swe-09)

**Steering for iteration 10 (swe-10, the final iteration). Read this first:**
1. Choose the first PR by one stated criterion: no labels, no backend, and a check a reviewer can run. Say whether it is BASE2's R1 census (002 `plan.md:101`, about 180 LOC, already fully specified, so round 3 adds only the gate text) or a round-3 slice: the leaf replay's keyword arm (N-swe-03-2) or the citation scan's zero-call `dead` check (N-swe-06-1). Name what it proves with neither backend: a stub `jev` placed first on `PATH` logs nothing, and no request reaches `127.0.0.1:8300`.
2. Write its kill rule as a printed comparison with a sourced threshold. The 0.68 bar is unsourced (glm's summary, review 4), so derive a replacement or drop it.
3. Carry the corrected numbers, not the originals: 81 files plus 49 outside for the move, 403 citations, 13 clarify/defer rows, 25 usable sk-doc leaf gold rows and the 26-option torch cap.

**Verdict: adequate.** It took the angle and wrote only inside `swe/`. This is its best sibling read: deepseek-009 and 010 and grok-010 are named, and the glm and mimo counts (5 and 4) match the disk at 09:17. There is no sign it read `steer.md`: it again uses 53 files and 39 references, and it keeps swe-04's 0.68 bar.

- STRONG-FINDING: a dependency-ordered plan (spec text, then zero-call wave, Deem client, gated arms, extraction on counts). The per-step switch, rollback and printed line are stated. 002's census size is confirmed at `002/plan.md:101` (about 180 LOC), and the Pi census path at `003/plan.md:90`.
- STRONG-FINDING: a new Deem failure line, `deem arm stopped: server gone`. The update schedule restarts a running server (`LOCAL:55-70`), so a run can lose its server mid-way. No sibling table had this row.
- DEFECT: "a standalone `cli-deem` skill becomes the hub's mode verbatim" is false. A standalone skill needs its own `graph-metadata.json`, and a hub allows exactly one, at its root (`parent-skill-check.cjs:268-275`, check 1a). The move changes the advisor identity and deletes files; it is not verbatim.
- DEFECT: stale numbers carried from swe-07. The move is 81 files plus 49 outside (review 7), not 53 and 39.
- WEAK-CLAIM: the total of about 2,600 to 3,100 LOC mixes BASE2's already planned phase code (the censuses and the lint) with round-3 additions. The round-3 delta, meaning the client, the new arms, the probe and the new scripts, is what the synthesis needs apart.
- WEAK-CLAIM: the Deem client emits "`{verdicts|options|scores}`", which contradicts swe-01's translation to the `jev-cli` answer fields (`noul`, `choice`, `score`). Pick one shape.
- WEAK-CLAIM: the step 2 client lands before any Deem caller. Grok, glm and review 1 each put it in the same PR as its first Deem arm. Moving it there costs nothing and answers the zero-caller contest.
- WEAK-CLAIM: 50 minutes of citation labeling has no source.

## Review of iteration 10 (swe-10)

**Verdict: adequate.** It took the angle and wrote only inside `swe/`, and its Sibling check names grok-010 and deepseek-010. There is no clear sign it read `steer.md`: it takes option 1 of review 9's steer, but it never weighs the round-3 alternatives named there and never uses the corrected numbers. The slice is sound. Most of it is BASE2's, which the iteration's own table overstates.

- STRONG-FINDING: the first PR is 002's zero-call census. The corpus claims resolve: 177 and 64 skill-firing rows (002 `spec.md:83`, `:128`), 53/70 (`:111`), and `scorer-eval-baseline.json` present in `routing-accuracy/`. Its reviewer checklist and its three pre-registered exits can be run as written.
- DEFECT: "a slice boundary BASE2 leaves as one script" is marked new. 002 `plan.md:100` already specifies "the census with no Jev code path at all, about 180 LOC" as its own step. That row is restated.
- WEAK-CLAIM: the `--jev` refusal line adds a Jev code path that 002 `plan.md:100` excludes. The renamed functions (`readCorpus`, `clusterColumns`) diverge from the plan's approved names (`loadCorpora`, `clusterFor`, `classifyRows`, `reprintBaseline`). Follow the plan or state the amendment.
- WEAK-CLAIM: "backend-neutral sizing" is true for the row count only. The power line's win rate assumes one arm's rerun behavior, and Deem's temperature 1.0 is uncalibrated (`LOCAL:27`).

## Lineage summary for the synthesis leaf

1. Top findings (lead-verified): (a) the wire gap. With `--provider custom`, `noul` reaches Deem while `choice` and `score` get a 400 (`jev_cli/__init__.py:364-378` against `deem_server.py:535-544`). `run` passes through (`jev_cli/__init__.py:221-235`), and the answer fields diverge except `choice` (`deem_server.py:594-621` against `jev_cli/__init__.py:389-393`). Prompted by the angle file's §7 text, and agreed with grok's summary item 1.
2. (b) Compiled routing emits modes only (`014-runtime-engine/lib/compiled-route.cjs:87-92`, `resolve.cjs:105-125`, `:151-152`). Leaf choice is the model following `ROUTER.md` prose. sk-design is served compiled (`resolve.cjs:36-44` plus its activation manifest), which contests grok; the orchestrator confirmed swe here.
3. (c) N-swe-04-1, an offline deletion arm as a 005 amendment gated on the census stop line (005 `spec.md:170-178`). It ports the npm `jevctl` `compact.ts:58-118` but must not port the fail-open at `:283-284`.
4. (d) N-swe-06-1, a citation-drift scan with a zero-call `dead` check and manufacturable labels. No validator checks citation fidelity; `reference_checker.py:5-12` is a rename ledger.
5. (e) N-swe-08-1, the probe contract plus a by-phase caller census: 0 built, and 002 forbids a shared helper (`002/spec.md:97`). Align the skip lines now and extract at the third built caller. Memoize per process only (`deem-ctl:163-167`). Also found: 0 ties within `AMBIGUITY_DELTA` in 9 scored prompts (`sk-prompt/SKILL.md:186-200`), and the first PR is 002's census (002 `plan.md:100`).
6. Defects not to repeat, part 1: the option cap is 26 for torch (`deem_server.py:166`, `:224-230`), not 255. swe-07's migration moves only `cli-usage`, and its `rm -rf` deletes 22 hub files.
7. Part 2: a hub-root helper is allowed, since the contract covers only `METADATA_FILES` (`skill-root-metadata-contract.cjs:45-55`). A standalone `cli-deem` cannot move into the hub verbatim, because a hub allows one `graph-metadata.json` (`parent-skill-check.cjs:268-275`).
8. Stale counts: use 81 files plus 49 references, 403 citations, 13 clarify/defer rows, 25 sk-doc leaf gold rows, 13 doc types and 12 agents.
9. More defects: the structure gate is on by default (`validate_document.py:540-545`). The 0.68 bar is unsourced. The Deem probes in swe-03 and swe-05 accept `stub`. The ROUTER token estimates are about half the byte count.
10. Contested, part 1: swe-01's `cli-deem` build-now is contested by grok and glm on zero callers; swe itself moved it to step 2 and next (swe-07, swe-09). swe-05 contests grok on sk-design, and swe is right.
11. Contested, part 2: swe-09 contests deepseek-010's hub-first order. swe-04's Deem-first choice for compaction contests deepseek-09's general Jev-first ordering.
12. Steer uptake: no iteration showed a clear sign of reading `steer.md`, so none of the lead corrections above are in the iteration files. Apply them from this file. Every sibling read in iterations 4 to 8 was stale for mimo.
