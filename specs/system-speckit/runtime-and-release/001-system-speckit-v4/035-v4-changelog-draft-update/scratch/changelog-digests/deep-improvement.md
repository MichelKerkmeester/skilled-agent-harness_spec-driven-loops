# deep-improvement changelog digest

Skill path: `.opencode/skills/system-deep-loop/deep-improvement/`
Versions covered: v1.11.0.0 through v1.17.1.0 (the last 10 of 24 entries in `changelog/`)
Date range: only one entry carries a date. `v1.13.0.0.md` is dated 2026-06-03. The other nine entries carry no release date.

---

## Per version, newest first

### v1.17.1.0

Documentation-only rewrite of the mode README into the narrative purpose-first voice used by the repo root and the mcp-obsidian pilot, leading with a one-line pitch and a problem-first overview instead of the old tabular reference card. The entry states that all capability and command facts survived the rewrite, including the three lanes, the integration scan, the five scoring dimensions and the guarded promotion gate. It also states that the README version field previously read `1.17.0.38` with no matching changelog entry, so the bump to `1.17.1.0` restores the version-to-entry contract. No command, script, routing or promotion behavior changed. Source: `changelog/v1.17.1.0.md`.

### v1.17.0.1

Bug fix limited to one heading. RENAME of SKILL.md section 6 from "MULTI-ITER METHODOLOGY" to "HOW IT WORKS (Multi-Iteration Methodology)" so the skill passes `package_skill.py --check`, which expects the canonical "HOW IT WORKS" section. The methodology text itself is unchanged and no migration is required. Source: `changelog/v1.17.0.1.md`.

### v1.17.0.0

The agent-mirror-sync check graduated from a deep-improvement promotion-only gate to a repo-wide commit-time and CI gate. A new `scripts/check-agent-mirror-sync.cjs` wraps the existing `verifyMirrorSync` library and fails when any agent's `.claude` or `.codex` mirror drifts from its `.opencode` canonical body, including a deleted mirror or a deleted canonical whose runtime copies linger. It is wired changed-files-scoped into `.opencode/hooks/git/pre-commit` and into a new `.github/workflows/agent-mirror-sync.yml` that fails closed if the checker is removed. The normalizer in `scripts/lib/mirror-sync-verify.cjs` was made accurate enough to run everywhere. It now strips the per-runtime self-description clause and normalizes runtime agent-file paths, and REMOVED the blanket bare-extension collapse that had been masking a real format-extension mismatch. Running the sharpened gate over all agents restored one genuine dropped Tool-Inventory row in `.codex/agents/context.toml` and cleared one false positive on `orchestrate`, leaving all twelve agents in sync. Note that every path in this entry is written under the old `deep-loop-workflows/deep-improvement/` address. Source: `changelog/v1.17.0.0.md`.

### v1.16.0.0

REMOVED. The entry is a retirement stub. It states that the release delivered internal onboarding-kit and gauntlet tooling for a deep-improvement lane that has since been removed from the system, that the change details are no longer applicable, and that the file is kept only to preserve version continuity. Source: `changelog/v1.16.0.0.md`.

### v1.15.0.0

REMOVED. Another retirement stub. Its runtime-specific content was stripped when a deprecated benchmark lane was retired, and the file is retained only for version continuity. The entry does not name which lane. Source: `changelog/v1.15.0.0.md`.

### v1.14.0.0

Content-free release marker. The file says only that it is retained as a version marker and that the active lanes and their current contracts are documented in `README.md` and `SKILL.md`. Source: `changelog/v1.14.0.0.md`.

### v1.13.0.0

BREAKING for model-benchmark callers at the time of release. The `/deep:model-benchmark` command was switched to write all outputs, meaning run data, results and synthesis, to the `sk-prompt-models/benchmarks/{run_label}` hub directory instead of the spec-local default. The entry is explicit that this was hub-only with no spec-local fallback and no override mechanism. Only `SKILL.md`, `assets/model-benchmark/auto.yaml` and `assets/model-benchmark/confirm.yaml` changed, because the `.cjs` scripts were already path-agnostic. Agent-improvement, skill-benchmark and every other mode kept spec-local output, and previously written outputs stayed where they were. Source: `changelog/v1.13.0.0.md`.

### v1.12.0.0

Added the capability-discrimination layer to the model-benchmark framework, all additive over the existing Lane B grader and config-driven sweep, with the Vitest suite at 158. Three new partial-credit fixture packs landed, a hard computational pack, a harder computational pack that saturated frontier models and was reported as a useful negative result, and a strict-validation pack of invalid-dominant validators that turned out to be the real discriminator. Three matching `capability-m3-vs-mimo` profiles were added. A repo-safety fix made `sweep-benchmark.cjs` `dispatchCell` run each dispatch with cwd and `--dir` pointed at a per-cell `os.tmpdir()` directory removed in a `try/finally`, so a stray model file-write lands in a throwaway directory rather than the repo. The release also recorded the first reproducible MiniMax-M3 versus MiMo-V2.5-Pro verdict, M3 clean across 32 of 32 cells with MiMo carrying roughly a 1-in-5 catastrophic-failure rate on hard validation. A P2 follow-up was left open, the trustworthiness reporter printing "TIE-on-format" whenever correctness saturates even when the gate cleanly separates the pair. Source: `changelog/v1.12.0.0.md`.

### v1.11.1.0

Fix-and-hardening release closing all 28 findings from a 10-iteration independent deep review of the v1.11.0.0 skill-benchmark work, with zero deferred and the behavior of the weighted dimensions, the `skill-benchmark-report.v1` report schema and the deterministic CI path preserved. The headline is the D4-R task-outcome grader, now dimension-aware end-to-end because `composeGraderPrompt`, `parseGraderResponse`, the mock dispatcher, the cache key and the cache metadata all thread a `dimId` defaulting to `D4`. A new `normalizeParsedPayload` backs every parse path so a fallback can no longer silently stamp a result `D4` or accept a missing `dim_id`, adding new `*_dim_mismatch` parse statuses. `dispatchReal` moved the rubric to `--append-system-prompt` instead of concatenating it into `-p`. RENAME of the magic pre-grading truncation constant in `live-executor.parseLiveResult` from a bare `2000` to `GRADED_RESPONSE_MAX_CHARS = 8000`, so long task-outcome answers are graded in full rather than clipped and under-scored. Hardening covered POSIX shell-quoting in `dispatch-model.buildResumeHint`, a warning on malformed config JSON, and an explicit `criteriaExecAllowed` gate documenting the `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` opt-out. `scoreScenario` was decomposed into named helpers with byte-identical math. Verification was 358 Vitest tests passing across 28 files. Source: `changelog/v1.11.1.0.md`.

### v1.11.0.0

Content-free release marker, identical in wording to v1.14.0.0. It points the reader at `README.md` and `SKILL.md` for the active lanes and their current contracts. Source: `changelog/v1.11.0.0.md`.

---

## Facts the v4 draft gets wrong or misses

- The draft never reconciles the v1.13.0.0 model-benchmark output routing with the removal of `sk-prompt-models`. `changelog/v1.13.0.0.md` routed all `/deep:model-benchmark` output hub-only to `sk-prompt-models/benchmarks/{run_label}` with, in its own words, no spec-local fallback and no override mechanism. Draft line 367 and draft line 445 both state that the `sk-prompt-models` skill no longer exists. The draft's benchmark paragraph at line 155 says only that "benchmark result paths moved to the new grammar" under `benchmark/reports/`, which does not tell a reader whose scripts point at the deleted hub path that this specific route is the one that died. Verified on disk: `.opencode/skills/` contains `sk-prompt` and no `sk-prompt-models`, and the only remaining references to the hub path anywhere under the mode are inside `changelog/v1.13.0.0.md` itself.
- The draft misses the repo-wide agent-mirror-sync gate from `changelog/v1.17.0.0.md` entirely. This is a new every-commit and every-PR failure mode for anyone editing agent files, not an internal deep-improvement detail. Verified on disk: `.opencode/hooks/git/pre-commit` line 48 sets `MIRROR_CHECKER` to `.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs`, and `.github/workflows/agent-mirror-sync.yml` exists. The draft's deep-loop section at lines 165 to 167 and its migration list at lines 444 to 447 mention neither.
- The draft's "Repoint what moved" bullet at line 444 covers the `deep-loop-workflows` to `system-deep-loop` merge in general terms, which is correct, but it does not flag that `changelog/v1.17.0.0.md` is the entry a reader is most likely to follow into a dead path. Every file path in that entry, including the checker script and the mirror-sync library, is written under `deep-loop-workflows/deep-improvement/`. Both files verified to exist under `system-deep-loop/deep-improvement/scripts/`.
- The draft does not mention the two retirement stubs. `changelog/v1.15.0.0.md` and `changelog/v1.16.0.0.md` both record that a deep-improvement lane and a benchmark lane were removed, and neither stub names the lane. Draft line 445 lists removed surfaces and includes the `deep-alignment` mode, so a reader comparing the two sources cannot tell whether the stubs refer to that removal or to a different one. This is a gap in the changelog entries as much as in the draft, so it is offered as a reconciliation item rather than a draft error.
- Not a draft error but a live drift found while checking the draft's benchmark claim: `SKILL.md` line 269 says the standalone Lane B command writes to `.opencode/skills/system-deep-loop/deep-improvement/benchmark/model-benchmark/{run_label}/`, while the only directory that exists on disk is `benchmark/reports/`, holding `2026-07-10--live-mode-b--live` and `2026-07-10--router-mode-a--router`. The draft's line 155 grammar matches the disk, and the SKILL.md text does not.

## Current version and identity

- `SKILL.md` frontmatter `version` is `1.17.0.1`.
- `README.md` frontmatter `version` is `1.17.0.38`. This contradicts `changelog/v1.17.1.0.md`, which claims the README was bumped from `1.17.0.38` to `1.17.1.0` to restore the version-to-entry contract. The bump is not present on disk, so the newest changelog entry has no matching version anywhere in the mode.
- Identity: deep-improvement is a MODE, not a hub and not standalone. It has no `mode-registry.json` of its own. The registry lives one level up at `.opencode/skills/system-deep-loop/mode-registry.json`, alongside `hub-router.json`, `description.json` and `graph-metadata.json`, which is the hub-root metadata set. That registry lists `"packet": "deep-improvement"` and notes that the three improvement lanes, agent, skill and model, multiplex onto this one shared packet, and that the legacy id `deep-improvement` folds by `advisorDefaultMode` to `agent-improvement`.
