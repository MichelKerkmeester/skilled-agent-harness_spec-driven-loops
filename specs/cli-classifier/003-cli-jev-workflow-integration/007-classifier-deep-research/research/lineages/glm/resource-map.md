# Resource Map — lineage `glm`

Evidence-derived from the five converged deltas (config: `resource_map.emit: true`); the files and pointers the iterations actually leaned on, grouped by what they decided. Every row: counted here, consumed there.

## A. The served 0.8B and its as-built control surface (the A/B/H ground)

| Resource | Role | Counted uses |
|---|---|---|
| `context/deem-local.md` | the orchestrator's measurements — :20-28 (install, 2.1 GB), :34-44 (p50 60.2-60.5 ms, 3,368 MB, 814 MB, ~10 s), :27 (no calibration, temperature 1.0), :50-53 (quality unmeasured, no egress), :55-70 (operate+update; :65 the one-real-`choice` smoke; :66 the rollback; :68-70 the tested paths + the launchd) | 5/5 iterations |
| `~/.local/share/deem/bin/deem-ctl` (ALL-1: read, never executed) | the as-built: :58-68 (health parses `backend`, refuses `stub`), :79-98 (the ONE synthetic smoke; `current_model_sha` = the readlink), :163,167,169-172 (switch-then-smoke, exit-3 restore), :196-198 (status prints the commit pair) | it.001, it.002 |
| `~/Library/LaunchAgents/com.skilled.deem-update.plist` | the cadence: bare `update` (:7-11), StartInterval 21600 (:12-13), RunAtLoad (:14-15) | it.001, it.002 |
| `context/deem-main/serve/deem_server.py` | :535-548 (options/levels), :596-622 (the answer builders — module scope, no provenance), :628-642 (`DeemCore`+`self.model_id`), :772-777 (`/health` = model+backend), :809-811, :837-839 (CORS `*`) | it.001, it.002 |
| `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py` | :364-369, :381-393 (the `criteria`/answer-key side of the field gap) | it.001 |
| `context/deem-main/docs/MODEL_CARD_08B.md:18-29`, `context/deem-main/eval/tare/leaderboard.md:1-25` | the two disagreeing published figures (both VENDOR, labeled) | it.001, it.005 |

## B. The 002 instrument (the A-legalization cluster)

| Resource | Role |
|---|---|
| `002-advisor-jev-tiebreak-arm/spec.md:85-115` | the frozen: :92 (the one-word amendment site), :98 ("this script is the only caller and `--jev` is its own switch"), the Files-to-Change rows (`score-jev-tiebreak.mjs` ~330-530 LOC of which ~180 census; the read-only `routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` — it.001's UNKNOWN, resolved; the hash-pinned `scorer-eval-baseline.json:5-7`) |
| `004-deep-research-expansion/research/research.md:47,59-80` (BASE2 §1 + C1-C6) | the keep rule's numbers: the 55-movable/0.68/80%-power line, the aggregate-flip ≤ 0.10, the capture env |
| `001-deep-research/research/research.md:572,576,594,598` (BASE1) | rows 1/5 (the reopened drops, my own read) + R1/R21 |

## C. The hub question (the G cluster)

| Resource | Role |
|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py:210-232,255-290` | the coupling (registry XOR router → `unclassified`), the compiled-routing readiness, the parent-check invocation |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | 1a (exactly one `graph-metadata.json`), the packetKind discriminator, the toolSurface whitelist, the 18 `description.json` refs |
| `.skilled/repo-rules/skill-hub-routing.md:26-42` | the two stages; the metadata-class vocabulary-merge; the second-`graph-metadata` rejection |
| `.skilled/skills/cli-jev/SKILL.md` + `mode-registry.json` + `hub-router.json` + `ROUTER.md` | the 1-mode precedent: "unreachable while the hub registers one mode"; `stage1-only`; 18,163 B total / 8,270 B routing machinery |
| the `rg` counts | 638/83 (.skilled) + 30 (4 runtimes) + 2,372/467 (specs); the 0/0/0/0 phase-mention count; the advisor's 3 pin files (paths, not opened) |

## D. The question-C battlefield (the recount cluster)

| Resource | Role |
|---|---|
| `mimo/iterations/iteration-001.md` + `iteration-002.md` (+ their `results-mimo-01-recount.txt`, theirs-quoted) | the baseline: fresh-2/carry-384,219; the RETIRED counts (342→1,984 reads; 8.5%→30.1%/16.8%; 0→369 ROUTER reads; the 14.4 MB additionalContext; the 546.2 MB hook_success) |
| `swe/iterations/iteration-003.md` | the three-stage trace; the 1,641/1,572-line reconciliation; "the compiled router does not reach stage 2"; the machine-block replay-source clause (`sk-doc/ROUTER.md:145-152`) |
| `swe/iterations/iteration-004.md` | the counted compaction seam (212+14=226; preTokens ≥ 450,019; 104 s) and the 005-amendment shape |
| `grok/iterations/iteration-003.md` | the 2,225 B schema count; the rows-44/47/49 re-reads; the cache-invalidation mechanism (README:85/87) |
| `deepseek/iterations/iteration-005.md`, `iteration-008.md` | the frozen hook contracts (2,500/2,200/1,800 ms); the precompute route + the printed kill criteria |
| `.skilled/repo-rules/prevent-overengineering.md` + `001-deep-research/context/repo-rules-digest.md:52-109` | the checklist (Q1-Q15) + the red flags — the contrarian's instrument, all five iterations |

## E. The D/E/F cluster

| Resource | Role |
|---|---|
| `.skilled/skills/sk-prompt/SKILL.md:3,38,309-315,321` (my own: :3,:38; theirs: the rest) | the 7-prose (four places) vs the 5-registry; the printed matrix; "CLEAR… not a label set" |
| `grok/iterations/iteration-005.md` | the label-set table; the 36,580+23,081; the 8 playbooks = procedure checks |
| `grok/iterations/iteration-006.md` | "no hub-level Lane C run archived; an empty tree is not a passing score"; the scenario counts (4+12+10+9+…) |
| `mimo/iterations/iteration-002.md:95-113` | the D-residue: correctness 320 / traceability 337 / 62-per-week / "no validator at all" / the labels EXIST |
| `swe/iterations/iteration-002.md` | the validator check map (the residue column = the D-question) |
| `swe/iterations/iteration-006.md`, `deepseek/iterations/iteration-003.md` (via swe-006) | the citation-drift D-neighbor; the `AC_COVERAGE` gap (`validation-rules.md:110-135`) |

## F. The sibling record (cross-read, by path and iteration)

grok: 003, 005, 006, 007, 010 · deepseek: 002, 005, 008, 010 · mimo: 001, 002, 003 · swe: 001, 002, 003, 004, 006 — 18 files; every consumed fact either my-own-eyes-verified, theirs-quoted, or theirs-verified-then-recounted (the mimo-001→002 retirements, recorded at their retirement).

## G. The gaps this map exhibits (the honest vacancies)

- The 014-runtime-engine internals (the stage-2 replay's insertion point) — theirs-quoted, not opened (their it.003 Actions).
- 005's `spec.md:60` problem statement — via swe-004, not opened.
- The advisor's three pin files — paths listed, the in-index edit counts UNKNOWN until a mint.
- The launchd plist/deem-ctl: outside the repository by their nature; cited by absolute path + line per ALL-1.
