# Iteration 4: Real callers (Gate 1, hooks, doctor, save-freshness) vs documented contract

## Focus

Every live caller of the lookup script or ripgrep recipes, checked against the documented contract: Gate 1 in the root docs, runtime hooks, `/speckit:resume` assets, `/doctor` assets, save-workflow freshness discipline, deep-loop agent docs.

## Findings

| # | path:line | Claimed vs actual | Severity | Recommendation |
|---|-----------|-------------------|----------|----------------|
| F4.1 | `AGENTS.md:83` = `CLAUDE.md:83` (byte-identical files, md5 match) | Claimed: Gate 1 step 1 runs the trigger index lookup on every new user message. Actual: the command is complete and flag-correct (`--json -- "<prompt>"`, exit codes match `memory-system.md:31`). But it is prompt-time discipline only: **no hook invokes the lookup**. Grepped all runtime hooks (`runtime/hooks/{claude,codex,cursor,devin,opencode,pi}`), installed adapters (`.claude/hooks/`, `.codex/hooks/`), plugins (`.opencode/plugins/`), and settings registries (`.claude/settings.json`, `.codex/hooks.json`) — zero references to `lookup-trigger-index`. The only automation touching `trigger` strings is `session-prime.ts:153`, which mentions plain `rg`, not the lookup. | **P1** (documented as a gate that runs "EACH new user message" but nothing enforces or executes it; compliance rests entirely on the model reading AGENTS.md) | Document: either wire a UserPromptSubmit hook that runs the lookup and injects context (the hook-system doc's own table claims `lookup-trigger-index.mjs` is a hook concern — see F4.2), or state explicitly that Gate 1 is advisory with no mechanical enforcement. |
| F4.2 | `references/config/hook-system.md:89-93` | Claimed: a five-runtime table pairing `/speckit:resume` **and** `lookup-trigger-index.mjs` as hook-system concerns. Actual: no hook file on any of the five runtimes references the lookup script; the table column appears to describe which surfaces are *relevant to* the hook system, not which commands hooks invoke. A reader implementing a hook from this table would look for existing lookup-hook wiring and find none. | P2 | Fix: clarify the column meaning or name it honestly ("command surfaces referenced by these runtimes' hook docs", not "hook-invoked commands"). |
| F4.3 | `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml:30-35,70,148-149` | Claimed: the doctor diagnostic runs lookup + generator checks. Actual: yaml wires `index_path`, `lookup_command`, `generator_command`, an mtime/size probe, and one hard guard: "never regenerate from the doctor" (line 70). Correct division of labor; the doctor checks presence/staleness signals but regeneration stays an operator command (AGENTS.md:477). Consistent with contract; notably the doctor's staleness probe is mtime+size, **not** manifestHash comparison — the one check that would have caught F1.1 (three-way staleness) is absent. | **P1** (the freshness instrument the doctor could cheaply run — compare index `manifestHash` vs a fresh manifest build or vs the committed fixture manifest — is not wired; F1.1 shipped despite this surface existing) | Fix: extend doctor-speckit-retrieval with a manifestHash consistency check (index vs committed fixtures vs a fresh build). |
| F4.4 | `.opencode/commands/speckit/assets/speckit-resume-auto.yaml:71` | Claimed: resume runs the lookup with a sample prompt. Actual: command, flags, and exit-code semantics match the contract ("exit 0 = hits, 1 = clean no-hit, 2+ = error; a no-hit falls through, never guesses"). Correct caller. | P2 (positive) | Document. |
| F4.5 | deep-loop agent docs (`.claude/agents/deep-research.md:338`, mirrored in `.codex/agents/deep-research.toml`, `.pi/agents/*`) | Claimed: daemon-free retrieval via lookup + conventions recipes. Actual: flag-correct invocation, lexical-only disclaimer present. Consistent. | P2 (positive) | Document. |
| F4.6 | `references/memory/save-workflow.md:274` | Claimed: "the save neither runs it nor depends on it" — regeneration is operator-owned after trigger-phrase changes. Actual: consistent with root-doc wording (AGENTS.md:477) and with the post-save quality review doc (`feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:27` runs after "the trigger-index freshness check" — which itself is save-workflow-internal, not index-internal). No stale freshness claim. | P2 (positive) | Document. |
| F4.7 | `sk-doc`'s GREP_CONVENTION rule (`runtime/cli/rules/check-grep-convention.sh` + `check-grep-convention-helper.mjs`, registered in `runtime/cli/lib/validator-registry.json` as error-severity) | Claimed (charter framing): sk-doc owns a grep-convention check. Actual: the rule lives in **system-spec-kit's** runtime CLI rules directory, not sk-doc's; sk-doc's validation surface merely hosts `shared/scripts/check-frontmatter-versions.sh`. The charter's assumed ownership is wrong; the validator registry ties GREP_CONVENTION (aliases RETRIEVAL_CONVENTION) into spec-folder validation, so `validate.sh` runs trigger-phrase quality + anchor grammar checks over packet docs. This is retrieval's **enforcement surface** — the index's input quality gate — and it lives with the spec-kit runtime. | P2 (ownership correction; positive design) | Document ownership in `runtime/cli/rules/README.md` (it is already listed there per grep) — no defect, correct the mental model. |
| F4.8 | `runtime/cli/tests/trigger-index.vitest.ts`, `runtime/cli/tests/grep-convention-rule.vitest.ts`, `runtime/cli/tests/retrieval-coverage-parity.vitest.ts` (referenced `retrieval-conventions.md:§9`) | Claimed: parity tests enforce the coverage table. Actual: three test files exist covering generator, rule, and lane parity; the conventions doc names the parity test as the enforcement for §9 divergence rows. This is the strongest "index is consulted" evidence after Gate 1 itself: the committed index is validated by tests, read by the doctor, resume, deep-loop agents, and `/speckit:search`. Not a dead surface. | P2 (positive) | Document. |
| F4.9 | empirical: `node lookup-trigger-index.mjs --json -- "save context memory"` under the **committed** (stale) index | Caller behavior under stale artifact: lookups succeed with the old corpus snapshot — no consumer detects staleness at lookup time (shape assertion passes; only manifestHash differs, and no caller compares it). Strengthens F1.1/F4.3: the system's freshness invariant is enforced at generation time only, and today's fixtures/index divergence shows that invariant is process-dependent. | P1 (same root cause as F1.1; separate row because it converts the generator-side finding into a caller-side gap) | Fix: see F1.1 + F4.3 — one manifestHash comparison at doctor time closes the loop. |

Ruled out: "hooks invoke the lookup but reference it via dist build path" (searched `runtime/dist/hooks` names and every installed adapter — none); "save-freshness checks the index" (save-workflow explicitly disclaims it, line 274).

## Sources Consulted

- `AGENTS.md`, `CLAUDE.md` (Gate 1, §5 tools table, quick-reference)
- `REPO RULES.md` (full read), `repo-rules/*.md` (grep sweep)
- `references/config/hook-system.md:85-95`
- `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` (targeted reads)
- `.opencode/commands/speckit/assets/speckit-resume-auto.yaml:71`
- `.claude/settings.json` (hooks block), `.codex/hooks.json` (head), `.claude/hooks/`, `.codex/hooks/`, `.opencode/plugins/` (greps)
- `runtime/hooks/claude/session-prime.ts:153`
- `references/memory/save-workflow.md:144,274,378`
- `feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:27`
- `runtime/cli/rules/check-grep-convention.sh` (full read), `runtime/cli/lib/validator-registry.json` (GREP_CONVENTION entry)
- `runtime/cli/tests/trigger-index.vitest.ts`, `grep-convention-rule.vitest.ts` (existence + references)

## Assessment

- newInfoRatio: 0.85 — new caller-map findings (F4.1, F4.3, F4.7, F4.9); F4.4/F4.5/F4.6 confirmations add bound but are incremental.
- Novelty justification: the no-hook-enforcement gap (F4.1) and the doctor's missing manifestHash check (F4.3) are newly evidenced; neither appears in iterations 1–3.

## Reflection

- Worked: enumerating every runtime's hook directory before concluding "no hook calls the lookup" made F4.1 solid.
- Failed: initial charter assumption that `check-grep-convention.sh` lives in sk-doc was wrong — corrected in-row (F4.7) rather than propagating the error.
- Ruled out: see above.

## Recommended Next Focus

Iteration 5: retrieval's footprint in AGENTS.md/CLAUDE.md (line counts, duplicated blocks) vs REPO RULES.md — could a dedicated `repo-rules/retrieval.md` reduce the root-doc footprint to a pointer? Count exact retrieval-related lines and evaluate what a router row would need to carry.
