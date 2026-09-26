# Research Synthesis: Pi Skill Orchestrator Mechanisms Against System Skill Advisor

This is the merged synthesis of a two-lineage `/deep:research` run, written on 2026-09-26. MiMo v2.6 Pro ran 10 iterations through cli-pi. SWE-2 MAX ran 5 iterations through cli-devin. Every verdict below was judged against the code, not decided by either lineage's vote.

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Scope, Method and Inputs](#2-scope-method-and-inputs)
- [3. RQ1 Catalog Cost](#3-rq1-catalog-cost)
- [4. RQ2 Push Versus Pull](#4-rq2-push-versus-pull)
- [5. RQ3 Scope Model](#5-rq3-scope-model)
- [6. RQ4 Dependencies](#6-rq4-dependencies)
- [7. RQ5 Ranking Signals](#7-rq5-ranking-signals)
- [8. RQ6 Output Bounds](#8-rq6-output-bounds)
- [9. RQ7 Robustness Patterns](#9-rq7-robustness-patterns)
- [10. Cross-Lineage Agreement](#10-cross-lineage-agreement)
- [11. Recommendations](#11-recommendations)
- [Eliminated Alternatives](#eliminated-alternatives)
- [Divergence Map](#divergence-map)
- [12. Open Questions](#12-open-questions)
- [13. Proposed Refinement Phases](#13-proposed-refinement-phases)
- [14. Citation Verification Ledger](#14-citation-verification-ledger)
- [15. Evidence Quality and Caveats](#15-evidence-quality-and-caveats)
- [16. References](#16-references)
- [17. Convergence Report](#17-convergence-report)

---

## 1. Executive Summary

- Keep the pushed brief as the advisor's main route and take one lesson from the orchestrator: spend nothing on the prompt path that the model does not use. The verdicts are 3 ADOPT, 9 ADAPT and 14 REJECT.
- Adopt first: let the fail-open fallback survive the hook shims (R1), stop the hook path from paying for compiled-route spawns it throws away (R2) and export the byte counts the renderer already computes (R3).
- Code overturns five verdicts that both lineages shared. No skill or command sets `disable-model-invocation`, which was their top item. Truncate-and-keep, the `depends_on` assist, graph health and the count line also change nothing measurable today.
- Two lineage premises fail against code. The prompt-policy gate runs on no prompt-time path. When the advisor CLI runs to its budget, Pi and OpenCode receive the directives-only fallback while Claude, Codex, Cursor and Devin receive `{}`.
- SWE-2 MAX read MiMo's finished synthesis before it wrote any verdict, so agreement between the two lineages' verdicts is not independent corroboration.

---

## 2. Scope, Method and Inputs

**Question.** Which pi-skill-orchestrator mechanisms should `system-skill-advisor` adopt, adapt or reject, for routing precision, prompt cost and robustness? The brief is RQ1 to RQ7 in `spec.md`.

**Scope.** This step read both codebases and both lineages. It wrote only this file. It ran no hook, no test suite, no git write and no live advisor call.

**Path prefixes.** Citations use the prefixes below. Every other path is relative to the repository root.

| Prefix | Path |
|---|---|
| `orch:` | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/context/pi-skill-orchestrator-main/` |
| `adv:` | `.skilled/skills/system-skill-advisor/` |
| `ssk:` | `.skilled/skills/system-spec-kit/` |
| `plugin:` | `.skilled/plugins/system-skill-advisor.js`, 1,499 lines. `.skilled/hooks/skill-advisor/opencode/system-skill-advisor.js` is a symlink to it. |
| `research/` | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research/research/` |

**Finding labels.** `M:F8-3` is a MiMo finding. `M rank 3` is a row of MiMo's ranked table. `S:V2` is a SWE-2 MAX verdict from its ranked table. `S:F19` is a SWE-2 MAX iteration finding. SWE-2 MAX's findings registry reuses some F numbers for different verdicts, so this file never cites a SWE-2 MAX registry id alone. `E1` to `E12` are measurements made for this synthesis, listed in section 14. `O` and `A` rows are ledger rows in section 14.

**Evidence labels.**
- CONFIRMED means the cited lines show the claim, or a measurement in section 14 produced it. A confirmed claim built from several cited facts says "derived".
- INFERRED means the claim goes beyond what was read. Each inferred claim names the check that would confirm it.
- UNKNOWN means nothing read here settles the question.

**Method.**
1. Read both lineage syntheses, all 15 iteration files and the lineages' deltas, registries and logs.
2. Opened every `file:line` that a lineage finding or this file cites and classified it (section 14).
3. Measured what the verdicts depend on with read-only scripts. Orchestrator modules were imported in memory under node v26.8.2 type stripping. The skill graph was opened read-only with `mode=ro&immutable=1`.
4. Judged each mechanism against code. Where the lineages disagree, code settles the point. No disagreement was averaged.

**Run facts.** MiMo ran 10 iterations and SWE-2 MAX ran 5. Both stopped with `maxIterationsReached` under a `max-iterations` stop policy with a 3-iteration minimum. `antiConvergence.divergent` is `{}` in `research/deep-research-config.json`. The orchestration summary records 2 lineages succeeded and 0 failed.

**Excluded inputs.** Both lineages carry containment advisories for `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` and `specs/sk-doc/059-skill-changelog-retrofit/description.json`. Neither file was written by a lineage, so neither appears in the findings. Lineage timestamps are not used as evidence. MiMo's `newInfoRatio` values are self-reports.

---

## 3. RQ1 Catalog Cost

**Answer.** On Pi the eager skill catalog costs about 5,600 characters, roughly 1,400 tokens, on every request. The advisor brief adds to that catalog and never replaces it. A stub plus on-demand search, as the orchestrator builds it, would save about 4,960 characters per Pi request. That idea fits Pi only, because only a Pi extension can rewrite the system prompt.

- **Catalog size (CONFIRMED, E1 to E3).** Pi sees 15 top-level skills through the `.pi/skills` symlink to `.skilled/skills`. Rendered in the orchestrator's fixture format for Pi's catalog (`orch:tests/catalog.test.mjs:17-34`) with absolute paths, the catalog is 5,611 characters. Names take 178 characters, descriptions 2,140 and locations 1,468. The longest description is sk-code's at 405 characters. MiMo's estimate of about 5.5 KB is within 2 percent.
- **Catalog format (INFERRED).** The measurement assumes Pi renders its catalog the way the orchestrator's fixture does, with a name, description and location per skill (`orch:docs/architecture.md:11`). Capturing one Pi system prompt would confirm it.
- **The brief adds (CONFIRMED).** On Pi the hook appends the brief to the user message (`adv:hooks/pi/prompt-advisor.ts:278-285`). On Claude the hook returns `additionalContext` (`adv:hooks/claude/user-prompt-submit.ts:357-362`). On OpenCode the plugin adds a system transform (`plugin:1457`). None of these paths removes anything, so the catalog and the brief are both paid.
- **Brief size (CONFIRMED, E5 and E6).** A typical brief is 258 characters, about 65 tokens. That figure includes a 216-character directive block that the token cap does not count.
- **Stub size (CONFIRMED, E4).** The orchestrator's stub is 651 characters for a fresh Default profile and 652 characters with all 15 skills in one group, about 163 tokens. Both figures assume Token Saver is off, which is its default (`orch:src/config.ts:46`). Replacing the catalog block with the stub saves 4,959 to 4,960 characters, about 1,240 tokens per request.
- **Other runtimes (UNKNOWN).** `.claude/skills` and `.opencode/skills` also link to `.skilled/skills`, so those runtimes may list the same skills in their own formats (INFERRED). `.codex`, `.cursor` and `.devin` have no skills directory. What each of these runtimes spends on a catalog is not settled here (Q3).
- **Where a stub can apply.** The orchestrator rewrites the system prompt in `before_agent_start` (`orch:src/index.ts:281-326`). The advisor has no such handler, because its Pi hook only transforms the user input (`adv:hooks/pi/prompt-advisor.ts:214-286`). Prompt-submit hooks on Claude, Codex, Cursor and Devin can add context but cannot remove it (INFERRED from their hook contracts, confirm from each CLI's hook documentation). So the stub idea reaches Pi only, through a Pi extension (R9).

---

## 4. RQ2 Push Versus Pull

**Answer.** Keep the push. Its worst failure on our code is silent: when the advisor CLI runs to its budget, Claude, Codex, Cursor and Devin receive `{}` instead of the fallback directive. The fix is a nested deadline (R1) and a cheaper CLI path (R2), not a pull tool. A pull tool beside the brief is worth an A/B test on Pi only (R9).

- **The push path (CONFIRMED).** The advisor hook gives the CLI a 2,500 ms budget by default (`adv:hooks/claude/user-prompt-submit.ts:106`), with an environment override at `:163-165`. It calls the CLI front door with that budget (`:271-290`). The CLI builder spends what remains of the budget (`adv:hooks/lib/skill-advisor-cli-fallback.ts:498-505`, `:525`). On a timeout it returns a fail-open result (`:527-538`). The hook then emits the rendered brief or, when none renders, the directives-only fallback (`adv:hooks/claude/user-prompt-submit.ts:302`).
- **The shim kills first (CONFIRMED, derived).** Claude runs the system-spec-kit shim with a 3 s host timeout (`.claude/settings.json:109-110`). The shim spawns the advisor hook with `CHILD_TIMEOUT_MS = 2500` and SIGKILL (`ssk:runtime/hooks/claude/user-prompt-submit.ts:22`, `:102-110`). On `ETIMEDOUT` it writes a CHILD_TIMEOUT diagnostic and returns `{}` (`:111-115`). The shim's clock starts before the child has loaded node and its modules. Therefore, when the CLI uses its whole 2,500 ms, the shim kills the child before the child can print its fallback. This is derived from the lines above. One Claude turn against a CLI stub that sleeps past 2,500 ms would confirm it.
- **The same chain on three more runtimes (CONFIRMED).** The Codex, Cursor and Devin adapters spawn the Claude shim with a 2,800 ms budget (`ssk:runtime/hooks/codex/user-prompt-submit.ts:19`, `ssk:runtime/hooks/cursor/user-prompt-submit.ts:50`, `ssk:runtime/hooks/devin/user-prompt-submit.ts:19`). Their host timeouts are 3 s, 10 s and 10 s (`.codex/hooks.json:48-49`, `.cursor/hooks.json:92-94`, `.devin/hooks.v1.json:45-46`). The inner 2,500 ms kill still fires first, so all three inherit the `{}` outcome.
- **Pi and OpenCode fail softer (CONFIRMED).** Pi imports the advisor handler in process and awaits it with no outer kill (`adv:hooks/pi/prompt-advisor.ts:230-232`, `:242-250`). The OpenCode plugin runs the CLI under its own timers (`plugin:1006-1010`, `:1058-1068`) and falls back to its own copy of the directive (`plugin:61`, `:1316-1318`). Both therefore deliver the directives-only fallback when the CLI times out.
- **The observed event (CONFIRMED, E11).** MiMo's Pi dispatch logged `fail_open` with `durationMs` 2506 and the message "CLI fallback timed out" (`research/lineages/mimo/logs/fanout-lineage.err:3`). The record says `runtime` claude because the Claude handler hard-codes that label (`adv:hooks/claude/user-prompt-submit.ts:203`). It comes from the success-path diagnostic (`:346-355`), which runs after the fallback was selected at `:302`. So on that turn Pi received the directives-only fallback. It did not receive nothing.
- **The 250 ms default (CONFIRMED).** The CLI's 250 ms default applies only when no caller budget is passed (`adv:hooks/lib/skill-advisor-cli-fallback.ts:76`, `:145-158`). The hook always passes one. MiMo read this correctly. SWE-2 MAX described the path as a 250 ms probe.
- **Cause of the timeout (INFERRED).** Three candidates fit a 2,506 ms reading. The CLI may start a cold daemon (`adv:hooks/lib/skill-advisor-cli-fallback.ts:248-252`). When the daemon is unreachable the CLI runs its local scorer (`adv:runtime/skill-advisor-cli.ts:1413-1432`), whose own timeout of 5,000 ms (`:35`) exceeds the whole hook budget. And the daemon may spawn up to three compiled-route children in series (`adv:runtime/handlers/advisor-recommend.ts:370-400`). Timing each stage on a cold and a warm daemon would settle it (Q5).
- **Pull failure modes (CONFIRMED from the orchestrator's design).** A pull design fails by silent non-discovery, because the model has to decide to call `skill_search` (`orch:src/index.ts:583-587`). It costs one or two extra tool round trips. Its substring ranker also finds nothing on a miss, which the automatic global fallback covers (`orch:src/index.ts:666-685`).
- **Would pull help (INFERRED).** Routing accuracy is UNKNOWN without an A/B test. A pull tool runs outside the prompt-submit budget, so a slow CLI would slow a tool call instead of dropping the route. But the observed failure is a budget failure on the push path, and R1 and R2 address it directly. A pull tool beside the brief therefore belongs in the Pi A/B test (R9). Pull as a replacement loses in-turn routing (X6).

---

## 5. RQ3 Scope Model

**Answer.** Nothing in the advisor plays the role of a profile or group scope. The nearest pieces are query-class multipliers in fusion and a global denylist. A soft scope preference might raise precision on ambiguous prompts, but no evidence here shows it, so it waits for a replay (R10). The authorization set has nothing to gate in the advisor (X10).

- **The orchestrator's scopes (CONFIRMED).** A scope is all skills, a profile or a group (`orch:src/scope.ts:4-7`). A profile is the union of its groups' members (`:38-45`). An empty profile exposes zero candidates instead of every skill (`:96-99`). The active profile is the default scope (`orch:src/index.ts:140-145`).
- **Out of the box the scope is empty (CONFIRMED, derived).** The Default profile is built from `DEFAULT_CONFIG` (`orch:src/profiles.ts:135-136`), which has no groups (`orch:src/config.ts:39-47`). With no groups the profile has no members (`orch:src/scope.ts:38-45`). So on a fresh install every active-scope search finds nothing and drops to the automatic global fallback (`orch:src/index.ts:666-685`). Scope preference only works after an operator authors groups (`orch:docs/groups-and-profiles.md:31-40`). SWE-2 MAX reached the same reading of scope authoring (S:F8).
- **The authorization set (CONFIRMED).** Fallback results are authorized for loading (`orch:src/index.ts:617-620`). Every search clears that set (`:602`). A scope switch also clears it (`:196`, `:381`, `:419`, `:813`), as does a profile change (`:207`). The loader refuses a name outside the scope and the set (`:723-735`).
- **The advisor's nearest pieces (CONFIRMED).** Fusion scales lane weights by query class and floors the explicit lane at the strongest other lane (`adv:runtime/lib/scorer/fusion.ts:146-183`, `:176-181`). A global denylist removes routes (`adv:runtime/lib/routing/route-exclusions.ts:4-13`, `:59-99`). Curated boosts and penalties in the explicit lane act on single skills (`adv:runtime/lib/scorer/lanes/explicit.ts:290`, `:299-301`, `:307-309`). None of these holds a per-session scope.
- **Hubs and modes are not scopes (CONFIRMED).** Compiled routing picks a mode inside a hub after the skill is chosen. The flag module states that enrichment never changes which skill is recommended (`adv:runtime/lib/compiled-routing-flag.ts:29`). MiMo's other analog, `adv:runtime/lib/scorer/aliases.ts:148`, is the doc comment of a deep-loop alias-to-mode lookup (drifted, A34).
- **What scope preference would do (INFERRED).** A prior toward the family used earlier in a session could lift the right skill on a prompt that fits two families. The same prior could hold a stale family after the user moves on. A replay that measures top-1 changes with and without the prior would confirm the net effect (P4).

---

## 6. RQ4 Dependencies

**Answer.** The advisor uses `depends_on` and `enhances` edges only to spread score in its graph lane. It never returns a dependency bundle and should not (X7). The orchestrator's body-scan detector is too noisy on our skills to help authors keep `depends_on` current (X4).

- **The orchestrator's loader (CONFIRMED).** `detectDependencies` scans a skill body with five patterns (`orch:src/dependencies.ts:23-38`, `:28-34`). It skips a match when a negation appears within the preceding 64 characters (`:8-11`). Configured autoload entries are added and suppressions removed (`:40-48`). A depth-first walk loads the closure and reports cycles and missing skills as warnings (`:50-93`, `:63-72`). The walk skips manual-only skills (`:77-82`). The result renders as one bundle with dependencies first (`orch:src/skill-io.ts:48-79`), warnings included (`:62-68`).
- **The advisor's use (CONFIRMED).** The graph lane follows edges to depth 2 and breadth 4 (`adv:runtime/lib/scorer/lanes/graph-causal.ts:42-43`). It applies a multiplier per edge type (`:28-34`) and adds the propagated score (`:91-95`). The lane carries weight 0.13 (`adv:runtime/lib/scorer/lane-registry.ts:11`). The brief shows one label, or two when the result is ambiguous (`adv:runtime/lib/render.ts:421-438`). No bundle leaves the advisor.
- **The edge store (CONFIRMED, E8).** The graph has 15 nodes with 3 `depends_on`, 20 `enhances`, 5 `prerequisite_for` and 32 `siblings` edges. None dangles. Foreign keys are present. Three edges have an inverse partner.
- **The detector on our skills (CONFIRMED, E9).** Run over our 15 SKILL.md bodies, the detector proposes 16 edges across 6 skills. It recovers only 1 of the 3 existing `depends_on` edges, mcp-tooling to mcp-code-mode. It links cli-orca to 5 skills and sk-doc to 4, which reads as mentions rather than dependencies.
- **Should the advisor return a bundle (judgment).** No. The brief names a skill so the model can load it. A bundle would multiply the brief's size on every turn and duplicate the loading runtime's job. MiMo ruled closure loading out of the advisor's surface for the same reason (MiMo iteration 5).

---

## 7. RQ5 Ranking Signals

**Answer.** The orchestrator ranks on the skill name and description only, and an exact name match dominates. Two of its signals map onto real gaps in the advisor: substring matching and a name pin. Neither justifies importing the score table (X8). The name pin is worth building only if a replay shows misses (R8).

- **The orchestrator's scorer (CONFIRMED).** Name equality adds 200 (`orch:src/search.ts:27`). A name prefix adds 80 (`:28`) and a name substring adds 60 (`:29`). A description substring adds 35 (`:30`). Token matches add 45, 24, 8 or 4 (`:32-37`). Ranking drops zero scores (`:49`), breaks ties by name (`:50`) and keeps 1 to 8 results with 5 as the default (`:46`).
- **The advisor's scorer (CONFIRMED).** Five lanes are fused with weights of 0.42 explicit, 0.28 lexical, 0.13 graph, 0.12 derived and 0.05 semantic (`adv:runtime/lib/scorer/lane-registry.ts:8-19`). The lexical lane scores token overlap over id, name, domains, intent signals and keywords (`adv:runtime/lib/scorer/lanes/lexical.ts:68-78`). It adds synonyms (`:9-24`) and category hints worth 0.38 (`:26-40`, `:80-85`). Fusion breaks ties by reciprocal rank (`adv:runtime/lib/scorer/fusion.ts:303-308`) and sorts the result (`:749-776`). It abstains on prompts of 3 tokens or fewer (`:791-825`) and on broad prompts (`:827-856`). Scores are calibrated into confidence and uncertainty (`adv:references/scoring/advisor-scorer.md:105-109`).
- **Gap 1, substrings (CONFIRMED).** The lexical lane uses substring matches only to collect evidence, not to score (`adv:runtime/lib/scorer/lanes/lexical.ts:93-95`). SWE-2 MAX's "substring gap" is right on this point and MiMo's "strict superset" is wrong. The cost to routing is INFERRED to be small, because the explicit lane already matches name variants (`adv:runtime/lib/scorer/lanes/explicit.ts:316-323`). The P4 replay would confirm it.
- **Gap 2, the name pin (CONFIRMED gap, INFERRED impact).** The explicit lane adds 1 per matched name variant and clamps at 1 (`adv:runtime/lib/scorer/lanes/explicit.ts:316-323`, `:342`). Fusion weights that lane at 0.42 (`adv:runtime/lib/scorer/lane-registry.ts:9`) and floors it at the strongest other lane (`adv:runtime/lib/scorer/fusion.ts:176-181`). A named skill can therefore still lose rank 1 to a stronger lexical or derived match. How often that happens is unmeasured (Q4). At the agent level, `AGENTS.md:83` already tells agents to follow a skill the user names.
- **Tie-breaks (CONFIRMED).** Both sides already break ties deterministically (`orch:src/search.ts:50`, `adv:runtime/lib/scorer/fusion.ts:306`). There is nothing to import (X9).

---

## 8. RQ6 Output Bounds

**Answer.** The advisor caps only the head of the brief, at 80 tokens or 120 when the result is ambiguous. It then appends a 216-character directive block outside the cap. Real briefs run from 258 to 696 characters. The orchestrator's limits of 5 results, 8 at most, with 160-character descriptions fit a pull tool. They would change nothing in the pushed brief, which already shows at most two labels.

- **The advisor's caps (CONFIRMED).** The caps are 80, 120 and 120 tokens at 4 characters per token (`adv:runtime/lib/render.ts:79-82`). They are clamped (`:113-118`) and applied by `capText` (`:120-127`). The ambiguous form needs a cap above 80 (`:421`). Both forms append the directive block after capping (`:427-430`, `:435-438`). The block carries the comment-hygiene rule (`:99-101`) under the `Directives:` label (`:107`).
- **Measured sizes (CONFIRMED, E5 and E6).** The directive block is 216 characters, about 54 tokens. The fallback is 215 characters. A typical brief is 258 characters, about 65 tokens. The longest single-label brief is 536 characters and the longest ambiguous brief is 696, about 134 and 174 tokens. The lineages' figure of about 138 tokens covers the single-label case only.
- **Upstream bounds (CONFIRMED).** The hook asks for 3 results (`adv:hooks/lib/skill-advisor-cli-fallback.ts:222-234`) and raises the cap to 120 when the result is ambiguous (`:431`). The handler defaults to 3 results (`adv:runtime/handlers/advisor-recommend.ts:507`) and allows at most 3 matched documents (`:255-273`). The CLI reads at most 1 MiB of output (`adv:hooks/lib/skill-advisor-cli-fallback.ts:80`). The hook clamps the prompt to 64 KiB (`adv:hooks/claude/user-prompt-submit.ts:107`, `:115-134`). Metadata values over 512 characters are dropped (`adv:runtime/lib/skill-graph/metadata-sanitizer.ts:11`, `:34`).
- **The orchestrator's bounds (CONFIRMED).** `skill_search` returns 1 to 8 results with 5 as the default (`orch:src/search.ts:46`, `orch:src/index.ts:590`, `:600`). Descriptions are cut to `catalogDescriptionMax`, 160 by default (`orch:src/config.ts:45`), which is clamped to 0 to 240 (`:138-140`) and applied per row (`orch:src/index.ts:603-609`).
- **Truncate-and-keep would change nothing (CONFIRMED, E7).** Of 2,057 sanitized metadata entries, none exceeds 512 characters. The longest is 117 characters, in `key_files`. The 8 strings over 512 characters are all `causal_summary`, a field the sanitizer does not handle (`adv:runtime/lib/skill-graph/metadata-sanitizer.ts:73-106`). So X3 has no effect today.
- **Whole-brief bound (merged into R3).** Both lineages asked to count the directive block rather than clip it (M:F7-2, S:V12). R3 does that by exporting delivered bytes.

---

## 9. RQ7 Robustness Patterns

**Answer.** The advisor already fails open with typed errors, deduplicates directives and sanitizes labels. It lacks four things that matter here: deadlines that nest (R1), byte counts and a true runtime label in its diagnostics (R3), a test on the Pi hook's dist path (R7) and an atomic trim of its bounded logs (R11). Warn-not-delete and manual-only enforcement have nothing to protect today.

- **Warn-not-delete (CONFIRMED).** The orchestrator removes Pi's catalog only when it recognizes the format. Otherwise it warns once and leaves the prompt alone (`orch:src/index.ts:309-318`, `orch:src/catalog.ts:163-189`). The advisor never removes prompt content, so the pattern matters only inside R9 (X11).
- **Atomic writes (CONFIRMED).** The orchestrator writes profiles to a temp file and renames it into place (`orch:src/profiles.ts:61-70`). The advisor's `writeBoundedJsonl` appends atomically with `O_APPEND` (`adv:runtime/lib/metrics.ts:303-307`). Its trim, however, rewrites the file with a plain `writeFile` (`:309-311`). A crash during the trim can therefore leave a truncated log (INFERRED, confirm by killing the process mid-trim). Outcome records always take this path (`:485-492`), called from `adv:runtime/handlers/advisor-validate.ts:643`. Both lineages called the two designs equivalent and rejected the transplant (M:F8-2, S:F22). The trim contradicts that reading (R11). A second plain rewrite targets the git-tracked `graph-metadata.json` (`adv:runtime/lib/cross-skill-edges/apply-graph-metadata-patch.ts:100`, `:121`). Git history lowers the stakes there.
- **Manual-only skills (CONFIRMED, E10).** The orchestrator hides skills that set `disable-model-invocation` (`orch:src/catalog.ts:38`). It blocks loading them (`orch:src/index.ts:716-722`) and skips them as automatic dependencies (`orch:src/dependencies.ts:77-82`). The advisor never reads the flag (`adv:runtime/lib/scorer/projection.ts:676-686`). No SKILL.md in our skill roots sets it. No command file sets it either. The sk-doc contract lists the flag for commands only (`.skilled/skills/sk-doc/shared/assets/skill-contract.json:13`, `:28`). So X1 has no user today.
- **Pi compatibility tests (CONFIRMED).** The orchestrator pins Pi peer ranges, the manifest, a deep-import ban, tool schemas and Token Saver hooks (`orch:tests/pi-compatibility.test.mjs:16-26`, `:28-32`, `:34-43`, `:45-52`, `:55-80`). The advisor's Pi hook imports only types from Pi (`adv:hooks/pi/prompt-advisor.ts:5`), so a deep-import ban passes by construction (X14). Its real exposure is the built path it loads at runtime (`:41-50`, `:230-232`). The three Pi hook tests would not fail if that path stopped resolving (`adv:runtime/tests/hooks/prompt-advisor.vitest.ts:27-56`). R7 closes that gap.
- **Deadline nesting (CONFIRMED, derived).** Neither lineage found this. The shim's inner kill matches the budget the hook gives the CLI, as section 4 shows. R1 fixes it.
- **Diagnostics (CONFIRMED).** The hook diagnostic record has no byte field (`adv:runtime/lib/metrics.ts:347-373`) and its schema is closed (`:376-394`). The runtime enum holds claude, copilot and opencode only (`adv:runtime/lib/advisor-runtime-values.ts:10-14`). The Claude handler hard-codes claude (`adv:hooks/claude/user-prompt-submit.ts:203`), so a Pi call logs as claude. The renderer already counts bytes (`adv:runtime/lib/render.ts:289`) and so does the policy plan (`adv:runtime/lib/policy-plan.ts:851`). Only tests read either count (`adv:runtime/lib/render.ts:199`, `adv:runtime/lib/policy-plan.ts:945-955`). R3 exports them.

---

## 10. Cross-Lineage Agreement

**Classes.** "Both" means each lineage reached the mechanism with a verdict. "Disputed" means both proposed it with different content. "MiMo only" and "SWE-2 MAX only" mean one lineage reached it. "Synthesis only" means neither lineage reached the finding and this synthesis found it in code.

| ID | Mechanism | MiMo | SWE-2 MAX | Class | Synthesis against lineages |
|---|---|---|---|---|---|
| R1 | Nested hook deadlines | rank 5 ADOPT (F9-2), aimed at Pi | V6 ADOPT, aimed at Pi | Synthesis only | Retargets both to the shims |
| R2 | Compiled-route spawns on the hook path | absent | F16 noted it with no verdict | Synthesis only | New |
| R3 | Byte counts and runtime label | rank 6 ADOPT (F2-1), rank 11 ADAPT (F7-2) | V7 ADOPT, V12 ADAPT | Both | Refines: the bytes already exist |
| R4 | Status-aware fallback naming the CLI | rank 3 ADOPT (F3-1, F9-1), rank 8 ADOPT (F4-3) | V1 ADOPT, V4 ADOPT | Both | Refines: merged and gated on R1 |
| R5 | Prompt-policy gate on the hook path | treated as live (F2-1, F2-3, F3-3) | treated as live (F21) | Synthesis only | Overturns the premise |
| R6 | Headless fallback dedup | asked for default-on dedup (F2-1) | asked the same (V7) | Synthesis only | Refines: dedup is already on |
| R7 | Pi dist-path contract test | rank 15 ADAPT, a deep-import ban (F8-4) | V15 ADAPT, a dist-path guard | Disputed | Sides with SWE-2 MAX |
| R8 | Name pin | rank 2 ADOPT (F6-1) | V3 ADOPT | Both | Downgrades to ADAPT |
| R9 | Pi stub with advisor-backed search | ranks 3, 4, 10 and 16 (F9-1, F7-1, F3-2, F1-1, F2-2) | V8 ADOPT, V10 and V16 ADAPT | Both | Refines: no recommend precedent, needs a short-query mode |
| R10 | Soft scope preference | rank 9 ADAPT (F4-1) | V9 ADAPT | Both | Defers behind a replay |
| R11 | Atomic trim of bounded logs | REJECT (F8-2) | REJECT (F22) | Synthesis only | Overturns both |
| R12 | Pi deadline race | rank 5 ADOPT (F9-2) | V6 ADOPT | Both | Downgrades and folds into P1 |
| X1 | `disable-model-invocation` surfacing | rank 1 ADOPT (F8-3) | V2 ADOPT | Both | Overturns: no users |
| X2 | Count line in the brief | rank 7 ADOPT (F1-2) | V5 ADOPT | Both | Overturns: redundant |
| X3 | Truncate-and-keep metadata | rank 12 ADAPT (F7-3) | V13 ADAPT | Both | Overturns: zero effect |
| X4 | `depends_on` detection assist | rank 13 ADAPT (F5-2) | V11 ADAPT | Both | Overturns: noisy |
| X5 | Graph health on `advisor_status` | rank 14 ADAPT (F5-3) | V14 ADAPT | Both | Overturns: already covered |
| X6 | Pull replaces push | REJECT (F3-3) | REJECT | Both | Agrees |
| X7 | Dependency bundle in the brief | REJECT (F5-1) | REJECT | Both | Agrees |
| X8 | Substring score table | REJECT (F6-2) | REJECT | Both | Agrees |
| X9 | Tie-break import | REJECT (F6-3) | REJECT in its RQ5 answer | Both | Agrees |
| X10 | Authorization set and load gate | REJECT (F4-2) | REJECT | Both | Agrees |
| X11 | Warn-not-delete transplant | REJECT (F8-1) | REJECT | Both | Agrees |
| X12 | Brief replaces catalog | REJECT (F1-3) | REJECT | Both | Agrees |
| X13 | Orchestrator cost machinery | REJECT (F2-3) | ruled out Token Saver | MiMo only | Agrees, with a corrected reason |
| X14 | Deep-import ban for the Pi hook | rank 15 ADAPT (F8-4) | proposed V15 instead | Disputed | Overturns MiMo's version |

**Counts.** Of 26 entries, 18 are Both, 5 are Synthesis only, 2 are Disputed, 1 is MiMo only and none is SWE-2 MAX only. This synthesis agrees with the lineages on 8 entries (X6 to X13). It overturns or reverses them on 7 (X1 to X5, X14 and R11).

**Independence.** SWE-2 MAX's verdicts are not independent of MiMo's. Its stdout records a look at the MiMo lineage "for reference structure" before its first iteration began (`research/lineages/swe2max/logs/fanout-lineage.out`). Its iteration 5 then read MiMo's finished 276-line `research.md` (`research/lineages/swe2max/iterations/iteration-005.md:22`) before its synthesis wrote V1 to V16. Its cross-lineage finding cites MiMo's ranked table directly (`research/lineages/mimo/research.md:20-42`). A verdict that both lineages share therefore counts as one opinion, not two. Mechanism readings from SWE-2 MAX iterations 1 to 4 are closer to independent. What it read at that first look is not logged, so even those are INFERRED to be independent.

**Disagreements settled by code.**
1. **Fail-open delivery.** Both lineages described one fail-open outcome. The outcome depends on the runtime. Pi and OpenCode receive the directives-only fallback. Claude, Codex, Cursor and Devin receive `{}` when the CLI runs to its budget (section 4).
2. **The 250 ms default.** MiMo said it yields to the caller's budget. SWE-2 MAX called the path a 250 ms probe. The code uses the caller's budget whenever one is passed (`adv:hooks/lib/skill-advisor-cli-fallback.ts:145-158`), so MiMo is right.
3. **Superset or gap.** MiMo called the advisor's lexical lane a strict superset of the orchestrator's ranker. SWE-2 MAX found a substring gap. The lane scores tokens and uses substrings only as evidence (`adv:runtime/lib/scorer/lanes/lexical.ts:93-95`), so SWE-2 MAX is right.
4. **Dedup semantics.** Pi suppresses a repeated contribution only when it is identical in full (`adv:hooks/pi/prompt-advisor.ts:140`). Claude keeps the route line and drops only the directive block (`adv:hooks/lib/directive-lifecycle.ts:148-149`). Claude also cannot split a fallback that has no route line (`:44-47`). Neither lineage separated the two.
5. **The Pi contract guard.** MiMo's deep-import ban passes by construction (`adv:hooks/pi/prompt-advisor.ts:5`). SWE-2 MAX's dist-path guard tests the path that can actually break (`:41-50`), so SWE-2 MAX is right.
6. **Where the deadline defect lives.** Both lineages proposed a race around Pi's in-process call. The nesting defect that drops the fallback sits in the system-spec-kit shims instead (section 4).

**Premises both lineages got wrong.**
- The prompt-policy gate is not live on any prompt-time path (R5).
- Directive dedup is already on by default (`adv:hooks/lib/directive-lifecycle.ts:38-41`, `adv:hooks/pi/prompt-advisor.ts:66-69`, `plugin:262-265`). Only the plugin's optional transform dedup is off by default (`plugin:390-392`).
- Byte counts already exist, but only tests read them (R3).
- Atomic-write equivalence fails at the trim (R11).
- `doc-frontmatter.ts` is not a SKILL.md flag slot. It parses reference and asset docs, runs only when opted in and returns fixed fields (`adv:runtime/lib/skill-graph/doc-frontmatter.ts:1-7`, `:14-20`, `:22-25`, `:137-143`).
- The flag appears in the sk-doc contract for commands, not skills (`.skilled/skills/sk-doc/shared/assets/skill-contract.json:13`, `:28`).
- The OpenCode tool that MiMo cited as a pull precedent returns status only (`plugin:1459-1496`).
- The skill count is 15, not 16 (E1).

---

## 11. Recommendations

R1 to R12 are the kept changes, ordered by verdict. X1 to X14 are the rejected mechanisms. The verdict counts are 3 ADOPT, 9 ADAPT and 14 REJECT. The citation check of each entry names its ledger rows in section 14. No ADOPT rests on a drifted or failed citation.

### R1. Nest the hook deadlines so the fallback survives the shim

- **Verdict:** ADOPT. The shim kills the advisor hook at the same 2,500 ms that the hook gives the CLI, so on four runtimes a slow CLI yields `{}` instead of the fallback directive.
- **Orchestrator mechanism:** none at prompt time. The orchestrator rewrites the prompt from records it holds in memory (`orch:src/index.ts:282-284`, `:298-301`) and has no subprocess to time out. This finding answers RQ2's observed timeout.
- **Advisor counterpart:** `ssk:runtime/hooks/claude/user-prompt-submit.ts:22`, `:102-110`, `:111-115` against `adv:hooks/claude/user-prompt-submit.ts:106`, `:163-165`, `:287`. The adapters that inherit it are `ssk:runtime/hooks/codex/user-prompt-submit.ts:19`, `ssk:runtime/hooks/cursor/user-prompt-submit.ts:50` and `ssk:runtime/hooks/devin/user-prompt-submit.ts:19`.
- **Change:** When `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` is unset, the shim sets it in the child's environment to `CHILD_TIMEOUT_MS` minus a margin. The margin comes from measured child start-up, meaning node start plus module load. The advisor hook then times out first and emits its fallback directive (`adv:hooks/claude/user-prompt-submit.ts:302`) before the shim's kill.
- **Benefit:** Claude, Codex, Cursor and Devin get the directive block instead of nothing when the CLI is slow. After R4 they also get a recovery line. The mechanism is CONFIRMED, derived from the cited lines. Its frequency is INFERRED and would be confirmed by counting CHILD_TIMEOUT diagnostics.
- **Cost:** A few lines in one shim plus one test. Small.
- **Risk:** Too small a margin keeps the race. Too large a margin starves the CLI. Measure start-up on the slowest host first.
- **Confidence:** High on the mechanism, medium on how often it bites.
- **Lineage agreement:** Synthesis only. It retargets M:F9-2 and S:V6, which both aimed the deadline fix at Pi.
- **Citation check:** A4, A5, A49, A50 and A51 resolved.

### R2. Skip compiled-route enrichment on the hook path

- **Verdict:** ADOPT. The daemon spawns `compiled-route.cjs` for each hub recommendation even when the hook caller throws the result away.
- **Orchestrator mechanism:** `skill_search` builds each result row from memory with no per-result subprocess (`orch:src/index.ts:603-616`).
- **Advisor counterpart:** `adv:runtime/handlers/advisor-recommend.ts:329-368` runs `execFileSync` with a 5,000 ms timeout (`:346`). `enrichCompiledRoutes` maps over the results synchronously, so the spawns run one after another (`:370-400`). It runs on cache hits (`:504`) and on fresh results (`:571`). Enrichment is on by default for seven hubs (`adv:runtime/lib/compiled-routing-flag.ts:14-22`, `:24-40`). The hook's CLI path drops `compiledRoute` (`adv:hooks/lib/skill-advisor-cli-fallback.ts:338-354`). The OpenCode plugin does use it (`plugin:606-609`, `:1347-1352`).
- **Change:** Add a request option to the `advisor_recommend` input, for example `includeCompiledRoute: false`, that skips `enrichCompiledRoutes`. Have `buildSkillAdvisorBriefFromCli` send it. The option belongs in the request because the handler runs in the daemon, where a hook-side environment variable cannot reach.
- **Benefit:** It removes up to three serial subprocess spawns from a 2,500 ms budget whenever a hub is recommended. The waste is CONFIRMED. Its share of the latency is INFERRED and would be confirmed by timing hook turns with `SPECKIT_COMPILED_ROUTING=0` in the daemon's environment.
- **Cost:** One input field, one conditional and one CLI argument. Small to medium.
- **Risk:** The OpenCode plugin must keep enrichment, so the default stays on. The cache stores results before enrichment (`adv:runtime/handlers/advisor-recommend.ts:565-570`), so the option does not split the cache.
- **Confidence:** High on the waste, medium on its share of the observed timeout.
- **Lineage agreement:** Synthesis only. S:F16 noted the per-hub subprocess without a verdict.
- **Citation check:** A8, A21, A22, A52 and A53 resolved.

### R3. Export brief bytes and the real runtime in hook diagnostics

- **Verdict:** ADOPT. Every later decision needs delivered bytes and per-runtime failure counts, and the code computes the bytes only to discard them.
- **Orchestrator mechanism:** The stub's size is a tested property (`orch:tests/scope.test.mjs:107`, "scope prompt size stays effectively constant with forty-plus skills").
- **Advisor counterpart:** Shadow observation computes `emittedByteCount` (`adv:runtime/lib/render.ts:263-313`, `:289`). Observed policy delivery computes `byteCount` (`adv:runtime/lib/policy-plan.ts:836-876`, `:851`). Only tests read either one (`adv:runtime/lib/render.ts:199`, `adv:runtime/lib/policy-plan.ts:945-955`). The persisted diagnostic record has no byte field (`adv:runtime/lib/metrics.ts:347-373`) under a closed schema (`:376-394`). The runtime enum lacks pi, codex, cursor and devin (`adv:runtime/lib/advisor-runtime-values.ts:10-14`). The Claude handler hard-codes claude (`adv:hooks/claude/user-prompt-submit.ts:203`).
- **Change:** Add `emittedBytes` and a directives-suppressed flag to the diagnostic record and its schema. Count the directive block in `emittedBytes`, which is the whole-brief bound of M:F7-2 and S:V12, counted rather than clipped. Extend the runtime enum with pi, codex, cursor and devin. Pass the runtime from each adapter, as an input field on Pi's in-process call and as an environment variable through the shims.
- **Benefit:** The byte and failure questions (Q3, Q5, Q7) become log queries. The gap is CONFIRMED.
- **Cost:** One schema field, four enum values and one argument per adapter. Small.
- **Risk:** Diagnostics are written only with debug on (`adv:runtime/lib/metrics.ts:406-413`), so collection needs the operator to enable it. The schema change touches every reader of the record.
- **Confidence:** High.
- **Lineage agreement:** Both (M rank 6 and rank 11, S:V7 and S:V12), refined because the bytes already exist.
- **Citation check:** A1, A4, A23, A24 and A26 resolved.

### R4. Make the fallback line say what failed and how to recover

- **Verdict:** ADAPT. Both lineages want a recovery line in the fallback. Build it as a status-aware line that names the CLI the model can already run, after R1 makes the fallback reach four more runtimes.
- **Orchestrator mechanism:** Explicit no-match and fallback messages (`orch:src/index.ts:687-696`, `:634`, `:644`) and the stub's fixed instructions (`orch:src/scope.ts:115-116`).
- **Advisor counterpart:** The fallback directive (`adv:runtime/lib/render.ts:443-448`, built at `:445`). A timeout renderer exists with no production caller (`:450-463`). A no-match renders nothing (`:409-413`), so the hook sends the same fallback for a no-match as for an outage (`adv:hooks/claude/user-prompt-submit.ts:302`). The CLI command is documented (`adv:SKILL.md:297`, `AGENTS.md:81`). The plugin keeps its own copy of the directive (`plugin:61`). The Pi debug line classifies a fallback by its `Directives:` prefix (`adv:hooks/pi/prompt-advisor.ts:184`).
- **Change:** On a fail-open result, render one line that names the status and the CLI command, reusing `renderAdvisorTimeoutFallback`. When scoring ran and nothing passed, say that no skill matched. Update the plugin's copy and the Pi debug classifier to match.
- **Benefit:** The model can recover in the same turn by running the CLI. A no-match also becomes distinguishable from an outage. Whether models act on the line is INFERRED and would be confirmed by forcing a timeout and watching for the command (Q6).
- **Cost:** Small. The line adds a few dozen characters to each fallback.
- **Risk:** A no-match line on casual prompts adds bytes to turns that need none. R6 limits repeats.
- **Confidence:** Medium.
- **Lineage agreement:** Both (M rank 3 and rank 8, S:V1 and S:V4), merged into one line.
- **Citation check:** A2, A5, A7, A46, A52 and A57 resolved. A46 notes that `adv:ARCHITECTURE.md:133` is contradicted by code.

### R5. Reconnect or retire the prompt-policy gate

- **Verdict:** ADAPT. The gate that both lineages treated as live runs on no prompt-time path, so every casual prompt pays for a CLI call inside the budget.
- **Orchestrator mechanism:** The model decides when to search (`orch:src/index.ts:583-587`), so a trivial prompt triggers nothing.
- **Advisor counterpart:** `shouldFireAdvisor` (`adv:runtime/lib/prompt-policy.ts:100-197`, casual branch at `:130-143`, thresholds at `:30-58`) is imported only by `adv:runtime/lib/skill-advisor-brief.ts:26`. The builder that uses it (`:401-563`) has no prompt-time caller. The Claude hook imports that builder only for a type (`adv:hooks/claude/user-prompt-submit.ts:15`, `:83`) and calls the CLI front door instead (`:277`, `:284-290`). The built hook does the same (`adv:runtime/dist/hooks/claude/user-prompt-submit.js:17`, `:179`). The only other runtime user is a measurement script (`ssk:runtime/cli/observability/smart-router-measurement.ts:236-240`).
- **Change:** Either call `shouldFireAdvisor` in the Claude handler before `buildCliBrief` and emit the fallback directive when it declines, or delete the dead gate and the docs that describe it. Decide after Q1.
- **Benefit:** A casual prompt skips a subprocess and a daemon round trip, which also removes it from the timeout population. The size of that population is INFERRED and would be confirmed by a replay counting how many gold prompts the gate skips, which must include zero routable prompts.
- **Cost:** Medium, because it touches the hot path and needs a replay.
- **Risk:** A gate that skips a routable prompt loses that route silently. The removal may also have been deliberate, which is UNKNOWN (Q1).
- **Confidence:** High that the gate is dead, low on why.
- **Lineage agreement:** Synthesis only. It overturns the premise in M:F2-1, M:F2-3, M:F3-3, S:F21 and SWE-2 MAX's RQ3 answer.
- **Citation check:** A13, A16 and A19 resolved. A14, A15 and A18 failed, all on the lineages' reading of the gate as live.

### R6. Deduplicate the headless fallback on Claude and OpenCode

- **Verdict:** ADAPT. Pi already suppresses a repeated fallback, while Claude and OpenCode resend the full 215-character block on every turn that finds no route.
- **Orchestrator mechanism:** The stub is constant and sits in the system prompt (`orch:src/index.ts:298-301`), where the orchestrator keeps the prefix stable for caching (`orch:docs/architecture.md:113-117`).
- **Advisor counterpart:** Claude's lifecycle dedup cannot split a text whose directives start at index 0 (`adv:hooks/lib/directive-lifecycle.ts:44-47`) and requires a route line (`:126-127`). The hook therefore falls open to the full fallback (`adv:hooks/claude/user-prompt-submit.ts:303-308`). The plugin also cannot reduce a fallback with no route line (`plugin:267-272`). Pi compares the whole contribution (`adv:hooks/pi/prompt-advisor.ts:129-152`, `:140`), so it suppresses exact repeats, fallback included.
- **Change:** If R4 lands, its status line gives the fallback a route-line equivalent. The existing split can then drop the repeated directive block with no further code. Without R4, suppress an exact repeat of the fallback within a session, as Pi does. Keep the fall-open behavior for unknown sessions. The first path is INFERRED and a unit test that a status-headed fallback is split and suppressed on repeat would confirm it.
- **Benefit:** About 215 characters, roughly 54 tokens, saved per repeated no-route turn. The volume is INFERRED and R3's byte export would measure it.
- **Cost:** None beyond R4 on the first path, small on the second.
- **Risk:** The hook's comment says a guardrail is never dropped. Suppressing a repeated fallback changes that policy, which is the operator's call (Q7).
- **Confidence:** Medium.
- **Lineage agreement:** Synthesis only. It refines M:F2-1 and S:V7, which asked for default-on dedup that already exists.
- **Citation check:** A5, A7, A10 and A52 resolved.

### R7. Guard the Pi hook's dist path with a contract test

- **Verdict:** ADAPT. The Pi hook loads the advisor handler from a built path, and no test fails if that path stops resolving.
- **Orchestrator mechanism:** Pi compatibility tests pin peer ranges, the manifest, a deep-import ban, tool schemas and Token Saver hooks (`orch:tests/pi-compatibility.test.mjs:16-26`, `:28-32`, `:34-43`, `:45-52`, `:55-80`).
- **Advisor counterpart:** The hook imports the dist handler dynamically, with a second candidate path (`adv:hooks/pi/prompt-advisor.ts:41-50`, `:47-50`, `:230-232`). If both fail, the error is caught and the turn carries no brief (`:251-252`). The existing tests cover the kill switch, blank input and the render source (`adv:runtime/tests/hooks/prompt-advisor.vitest.ts:27-56`).
- **Change:** Add one test that resolves both dist candidates from the extension's location and asserts that the module exports `handleClaudeUserPromptSubmit`.
- **Benefit:** A build-layout change fails CI instead of silently removing the brief on Pi.
- **Cost:** Small.
- **Risk:** Low.
- **Confidence:** High.
- **Lineage agreement:** Disputed. S:V15 proposed this guard. M:F8-4 proposed a deep-import ban, which X14 rejects.
- **Citation check:** O21, A7 and A48 resolved.

### R8. Pin a named skill to rank 1, gated by a replay

- **Verdict:** ADAPT, where both lineages said ADOPT. Build it only if a replay shows named-skill misses at rank 1, and define its precedence first.
- **Orchestrator mechanism:** Name equality adds 200 (`orch:src/search.ts:27`). SWE-2 MAX cited `orch:src/search.ts:26`, which is a blank line (O2).
- **Advisor counterpart:** The explicit lane adds 1 per name variant (`adv:runtime/lib/scorer/lanes/explicit.ts:316-323`) and clamps at 1 (`:342`). Fusion weights the lane at 0.42 (`adv:runtime/lib/scorer/lane-registry.ts:9`) with a floor at the strongest other lane (`adv:runtime/lib/scorer/fusion.ts:176-181`). Curated penalties act on single skills (`adv:runtime/lib/scorer/lanes/explicit.ts:290`, `:307-309`). Abstention gates can empty the result (`adv:runtime/lib/scorer/fusion.ts:791-825`, `:827-856`). At the agent level a named skill already wins (`AGENTS.md:83`).
- **Change:** If the replay shows misses, pin a named skill to rank 1 when the name appears in an invocation shape, a verb or a slash as S:V3 proposed. Rank the pin below curated negatives and above abstention.
- **Benefit:** Fewer wrong rank-1 routes when the user names a skill. This is INFERRED and a replay counting named-skill misses would confirm it (Q4).
- **Cost:** Medium, for the replay plus the lane change.
- **Risk:** The pin could override a curated negative such as the -1.0 on command-spec-kit. It could also defeat low-information abstention on a prompt that is only a skill name.
- **Confidence:** Low on the need.
- **Lineage agreement:** Both ADOPT (M rank 2, S:V3), downgraded here.
- **Citation check:** O1, A27, A28, A29 and A57 resolved. O2 drifted.

### R9. On Pi, replace the eager catalog with a stub and an advisor-backed search tool

- **Verdict:** ADAPT. This is the only large byte saving available, about 4,960 characters per Pi request. It needs a Pi-side extension, a short-query mode and an A/B test.
- **Orchestrator mechanism:** Strip and stub (`orch:src/index.ts:281-326`, `orch:src/catalog.ts:95-157`, `orch:src/scope.ts:104-118`), the `skill_search` tool (`orch:src/index.ts:578-698`), the exact-name loader (`:700-756`) and warn-not-delete (`:309-318`).
- **Advisor counterpart:** absent. The advisor has no `before_agent_start` handler and its Pi hook transforms input only (`adv:hooks/pi/prompt-advisor.ts:214-286`). The only plugin tool returns status (`plugin:1459-1496`). The renderer carries no catalog data by design (`adv:runtime/lib/render.ts:377-383`).
- **Change:** Build a Pi extension that strips the native catalog in `before_agent_start` with the orchestrator's recognizer and warn-not-delete behavior. It inserts a constant stub and registers a `skill_search` tool backed by `advisor_recommend`, plus a loader that takes one exact name. The scorer needs a short-query mode for searches of 1 to 3 tokens, ranking by confidence plus name prefix, because low-information abstention (`adv:runtime/lib/scorer/fusion.ts:791-825`) would otherwise return nothing. Results stay at 5 by default, 8 at most, with descriptions of 160 characters or fewer (M:F7-1, S:V8).
- **Alternative:** Install the orchestrator unchanged. That is an install, so it is the operator's call. A fresh install exposes zero candidates, because the Default profile has no groups (`orch:src/config.ts:39-47`, `orch:src/scope.ts:38-45`). Every search then goes through the global fallback (`orch:src/index.ts:666-685`) and the substring ranker.
- **Benefit:** About 4,960 characters, roughly 1,240 tokens, less per Pi request (E3, E4). The size is CONFIRMED. The routing effect is INFERRED and the A/B test would confirm it.
- **Cost:** Large.
- **Risk:** Silent non-discovery if the model never calls the tool, extra round trips and the loss of in-turn routing if the tool replaces the brief. Keep the brief beside the tool. Provider prompt caching may already discount the catalog (Q10).
- **Confidence:** Medium on the saving, low on routing quality.
- **Lineage agreement:** Both (M ranks 3, 4, 10 and 16, S:V8, S:V10 and S:V16). Refined here because the plugin tool is not a recommend precedent and the short-query mode is new.
- **Citation check:** O3, O4, O5, O6, O7, O8, A2, A7, A29 and A53 resolved.

### R10. Prefer the session's skill family softly, after a replay

- **Verdict:** ADAPT, deferred behind the P4 replay.
- **Orchestrator mechanism:** Scope algebra (`orch:src/scope.ts:4-7`, `:38-45`, `:90-101`) with a bounded global fallback (`orch:src/index.ts:666-685`, `orch:docs/architecture.md:57-63`).
- **Advisor counterpart:** absent. The nearest pieces are the query-class multipliers (`adv:runtime/lib/scorer/fusion.ts:146-183`) and the denylist (`adv:runtime/lib/routing/route-exclusions.ts:4-13`, `:59-99`).
- **Change:** A small prior toward the family of the skill used last in the session. It is a prior, never a filter.
- **Benefit:** A possible precision gain on prompts that fit two families. This is INFERRED and the replay would confirm it.
- **Cost:** Medium, since the scorer holds no session state today.
- **Risk:** Stickiness, where the prior keeps a stale family after the user moves on.
- **Confidence:** Low.
- **Lineage agreement:** Both (M rank 9, S:V9), deferred here.
- **Citation check:** O3, O7, O15, A29 and A44 resolved. A34 drifted, which was MiMo's scope analog.

### R11. Make the bounded-log trim atomic

- **Verdict:** ADAPT. The append is atomic but the trim is a plain rewrite, so both lineages' "equivalent" REJECT does not hold.
- **Orchestrator mechanism:** `atomicWriteJson` writes a temp file, renames it and cleans up (`orch:src/profiles.ts:61-70`).
- **Advisor counterpart:** `writeBoundedJsonl` appends with `O_APPEND` (`adv:runtime/lib/metrics.ts:303-307`) and trims with a plain `writeFile` (`:309-311`). Outcome records always use it (`:485-492`), from `adv:runtime/handlers/advisor-validate.ts:643`. A second site rewrites git-tracked `graph-metadata.json` (`adv:runtime/lib/cross-skill-edges/apply-graph-metadata-patch.ts:100`, `:121`).
- **Change:** Write the trimmed content to a temp file and rename it over the log.
- **Benefit:** A crash during a trim can no longer truncate the log. How often that happens is INFERRED and killing the process mid-trim would confirm the failure.
- **Cost:** Small, one helper.
- **Risk:** A rename, like the plain rewrite, loses an append that another process makes between the read and the write. The per-process write queue (`adv:runtime/lib/metrics.ts:180`) does not cover other processes.
- **Confidence:** Medium.
- **Lineage agreement:** Synthesis only. It disputes M:F8-2 and S:F22.
- **Citation check:** O13, A23, A25 and A41 resolved.

### R12. Race the Pi in-process advisor call against a deadline

- **Verdict:** ADAPT, folded into P1. Pi awaits the handler with no race, but the observed call returned at 2,506 ms against a 2,500 ms budget, so the CLI budget already bounds it.
- **Orchestrator mechanism:** none at prompt time. The orchestrator makes no call at that point that could hang (`orch:src/index.ts:282-284`).
- **Advisor counterpart:** `adv:hooks/pi/prompt-advisor.ts:242-250` awaits with no race. The debug line reads the budget from the environment (`:189`). The CLI child is killed by process group at its timeout (`adv:hooks/lib/skill-advisor-cli-fallback.ts:259-273`).
- **Change:** Race the await against the budget plus a margin and emit the fallback directive on expiry.
- **Benefit:** It guards the in-process steps that the CLI budget does not cover, such as the dynamic import (`adv:hooks/pi/prompt-advisor.ts:230-232`).
- **Cost:** Small.
- **Risk:** Low.
- **Confidence:** Medium.
- **Lineage agreement:** Both ADOPT (M rank 5, S:V6), downgraded here.
- **Citation check:** A7 and A8 resolved.

### Rejected mechanisms

Each row carries the verdict reason, both sides, the change the lineages proposed, benefit, cost and risk, confidence, agreement and the citation check.

| ID | Mechanism and reason | Orchestrator | Advisor | Change proposed | Benefit, cost and risk | Confidence | Agreement | Citations |
|---|---|---|---|---|---|---|---|---|
| X1 | `disable-model-invocation` surfacing. REJECT: no skill or command sets the flag (E10). Revisit when one does. Its home is the projection read at `adv:runtime/lib/scorer/projection.ts:676-692`. | `orch:src/catalog.ts:38`, `orch:src/index.ts:716-722`, `orch:src/dependencies.ts:77-82` | absent. The projection reads no such field (`adv:runtime/lib/scorer/projection.ts:676-686`) | Read the flag and demote manual-only skills | Benefit none today. Cost small. Risk none. | High | Both ADOPT (M rank 1, S:V2), overturned | O4, O8, O10 and A36 resolved. A38 and A39 failed. A55 drifted. |
| X2 | Count line in the brief. REJECT: while the runtime's own catalog is present the model already sees every skill. The line belongs in the R9 stub. | `orch:src/scope.ts:113` | absent | Add a skills-indexed count to every brief | Benefit none measurable. Cost about 40 characters per turn. Risk low. | Medium | Both ADOPT (M rank 7, S:V5), overturned | O3 resolved. |
| X3 | Truncate-and-keep metadata. REJECT: no sanitized value exceeds 512 characters (E7). | `orch:src/catalog.ts:5`, `:7-14` | `adv:runtime/lib/skill-graph/metadata-sanitizer.ts:11`, `:34` | Truncate long values instead of dropping them | Benefit zero today. Cost small. Risk low. | High | Both ADAPT (M rank 12, S:V13), overturned | O4 and A35 resolved. |
| X4 | `depends_on` detection assist. REJECT: on our skills the detector proposes 16 edges in 6 skills and finds 1 of the 3 real ones (E9). | `orch:src/dependencies.ts:8-38` | Edges are hand-authored and checked on load (`adv:runtime/lib/cross-skill-edges/metadata-loader.ts:115-140`). An `enhances` detector exists (`adv:runtime/lib/cross-skill-edges/detect-inbound-enhances.ts:177-205`). | Borrow the body scan and the negation guard | Benefit low. Cost medium review load. Risk wrong edges feed the graph lane. | Medium | Both ADAPT (M rank 13, S:V11), overturned | O10 and A41 resolved. A42 and A43 drifted. |
| X5 | Graph health on `advisor_status`. REJECT: foreign keys, the unknown-target warning and the orphan queries already cover it (E8). A naive cycle check would report the 3 inverse pairs as false cycles. | `orch:src/dependencies.ts:63-72`, `orch:src/skill-io.ts:62-68` | `adv:runtime/lib/skill-graph/skill-graph-db.ts:1129`, `adv:runtime/lib/skill-graph/skill-graph-queries.ts:187`, `:371` | Report missing and cyclic edges on the trust surface (`adv:ARCHITECTURE.md:29`) | Benefit low. Cost small. Risk false alarms. | Medium | Both ADAPT (M rank 14, S:V14), overturned | O10, O11, A40 and A46 resolved. |
| X6 | Pull replaces push. REJECT: it loses in-turn routing and adds round trips. | `orch:src/index.ts:281-326`, `:578-698` | `adv:runtime/lib/render.ts:384-441` | Drop the brief for a search tool | Benefit fewer bytes. Cost large. Risk silent non-discovery. | High | Both REJECT, agreed | O6, O7 and A2 resolved. |
| X7 | Dependency bundle in the brief. REJECT: the brief names a skill and loading is the runtime's job. | `orch:src/skill-io.ts:48-79`, `orch:src/dependencies.ts:50-93` | Score propagation only (`adv:runtime/lib/scorer/lanes/graph-causal.ts:91-95`) | Return the closure with the route | Benefit none for routing. Cost many more bytes per turn. Risk stale bundles. | High | Both REJECT, agreed | O10, O11 and A31 resolved. |
| X8 | Substring score table. REJECT: weaker than five fused lanes. The one useful signal is R8. | `orch:src/search.ts:19-39` | `adv:runtime/lib/scorer/lane-registry.ts:8-19` | Import the +200 to +4 table | Benefit none beyond R8. Cost medium. Risk worse ranking. | High | Both REJECT, agreed | O1 and A27 resolved. |
| X9 | Tie-break import. REJECT: the advisor already breaks ties deterministically. | `orch:src/search.ts:50` | `adv:runtime/lib/scorer/fusion.ts:306`, `:749-776` | Alphabetical tie-break | Benefit none. | High | Both REJECT, agreed | O1 and A29 resolved. |
| X10 | Authorization set and load gate. REJECT: the advisor recommends and has no load step to gate. | `orch:src/index.ts:617-620`, `:723-735` | absent | Gate loads on the last search | Benefit none. Cost medium. Risk blocked loads. | High | Both REJECT, agreed | O7 and O8 resolved. |
| X11 | Warn-not-delete transplant. REJECT: the advisor removes no prompt content, so the pattern lives only inside R9. | `orch:src/index.ts:309-318`, `orch:src/catalog.ts:163-189` | absent | Port the recognizer and warning | Benefit none outside R9. | High | Both REJECT, agreed | O4 and O6 resolved. |
| X12 | Brief replaces catalog. REJECT: a hook can add context but cannot remove the runtime's catalog. Only a Pi extension can (R9). | `orch:src/catalog.ts:140-157` | `adv:hooks/pi/prompt-advisor.ts:278-285`, `adv:hooks/claude/user-prompt-submit.ts:357-362` | Suppress the catalog from the brief path | Benefit none reachable. | High | Both REJECT, agreed | O4, A5 and A7 resolved. |
| X13 | Orchestrator cost machinery: Token Saver, tool-schema deferral and prefix stability. REJECT stands. MiMo's reason leaned on a prompt-policy gate that is not live (A15), so the reason is corrected here: a 258-character brief is too small to need that machinery. | `orch:docs/architecture.md:96`, `:98-104`, `:113-117` | absent | Import the cost levers | Benefit small. Cost large. Risk added complexity. | Medium | MiMo only (F2-3) | O15 resolved. A15 failed. |
| X14 | Deep-import ban for the Pi hook. REJECT: the hook imports only types from Pi, so the ban passes by construction. R7 guards the real risk. | `orch:tests/pi-compatibility.test.mjs:34-43` | `adv:hooks/pi/prompt-advisor.ts:5` | Ban deep imports from Pi packages | Benefit none. | High | Disputed (M rank 15 against S:V15) | O21 and A7 resolved. |

---

## Eliminated Alternatives

This table consolidates the rejected mechanisms and every direction the lineages ruled out. The merged registry's `ruledOutDirections` list is empty, so the lineage rows come from the iteration files and deltas.

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Surface `disable-model-invocation` in routing (X1) | No skill or command sets the flag | E10, `adv:runtime/lib/scorer/projection.ts:676-686` | MiMo 8, SWE-2 MAX 5, synthesis |
| Count line in the brief (X2) | Redundant while the runtime's catalog is present | `orch:src/scope.ts:113` | MiMo 1, SWE-2 MAX 1 and 5, synthesis |
| Truncate-and-keep metadata (X3) | No sanitized value exceeds 512 characters | E7, `adv:runtime/lib/skill-graph/metadata-sanitizer.ts:34` | MiMo 7, SWE-2 MAX 3 and 5, synthesis |
| `depends_on` detection assist (X4) | The detector is noisy on our skills | E9, `orch:src/dependencies.ts:23-38` | MiMo 5, SWE-2 MAX 3 and 5, synthesis |
| Graph health on `advisor_status` (X5) | Existing checks cover it and a naive cycle check reports false cycles | E8, `adv:runtime/lib/skill-graph/skill-graph-db.ts:1129` | MiMo 5, SWE-2 MAX 5, synthesis |
| Pull replaces push (X6) | Loses in-turn routing and adds round trips | `orch:src/index.ts:583-587` | MiMo 3, SWE-2 MAX 3 and 5 |
| Dependency bundle in the brief (X7) | Loading is the runtime's job | `orch:src/skill-io.ts:48-79` | MiMo 5, SWE-2 MAX 3 and 5 |
| Substring score table (X8) | Weaker than the fused lanes | `orch:src/search.ts:19-39` | MiMo 6, SWE-2 MAX 3 |
| Tie-break import (X9) | Already deterministic | `adv:runtime/lib/scorer/fusion.ts:306` | MiMo 6, SWE-2 MAX 5 |
| Authorization set and load gate (X10) | No load step to gate | `orch:src/index.ts:723-735` | MiMo 4, SWE-2 MAX 4 and 5 |
| Warn-not-delete transplant (X11) | The advisor removes no prompt content | `orch:src/index.ts:309-318` | MiMo 8, SWE-2 MAX 4 |
| Brief replaces catalog (X12) | Hooks can add context but cannot remove it | `adv:hooks/pi/prompt-advisor.ts:278-285` | MiMo 1, SWE-2 MAX 1 and 3 |
| Orchestrator cost machinery (X13) | Too heavy for a 258-character brief | `orch:docs/architecture.md:98-104` | MiMo 2 |
| Deep-import ban for the Pi hook (X14) | Passes by construction | `adv:hooks/pi/prompt-advisor.ts:5` | MiMo 8 |
| Editing or proposing changes to the orchestrator source | Reference material, read-only by the phase charter | `spec.md` Out of Scope | MiMo 1 |
| Token-perfect reproduction of Pi's catalog renderer | Superseded by E3, which rendered the fixture format directly | E3 | MiMo 2 |
| Token Saver internals as a cost lever | Tool-output compression is out of scope | `spec.md` Out of Scope, `orch:docs/architecture.md:96` | MiMo 2, 7 and 8, SWE-2 MAX 2 |
| Reconstructing the 2026-09-26 dispatch trace | MiMo judged it unnecessary. Audited override: code identifies the emitting diagnostic and the delivered fallback | E11, `adv:hooks/claude/user-prompt-submit.ts:346-355` | MiMo 3 |
| Retry loops around the hook call | A retry doubles worst-case latency inside a 2,500 ms budget | `adv:hooks/claude/user-prompt-submit.ts:106` | MiMo 3 |
| Porting profile and group management UX | Configuration UX, not a routing mechanism | `orch:src/profiles.ts:8` | MiMo 4 |
| Skill-internal routers as the scope model | They run after the skill is chosen | `adv:runtime/lib/compiled-routing-flag.ts:29` | MiMo 4 |
| Automatic `depends_on` patching | Stays eliminated. MiMo's evidence drifted because automated provenance exists | A42, `adv:runtime/lib/cross-skill-edges/apply-graph-metadata-patch.ts:111-116` | MiMo 5 |
| Runtime loading of `depends_on` closures | A question for the loading runtime, outside the advisor | `orch:docs/dependencies.md:9` | MiMo 5 |
| BM25 shadow promotion and lane-weight tuning | Unrelated to the orchestrator. No evidence says the weights are wrong | `adv:runtime/lib/scorer/lane-registry.ts:21-29` | MiMo 6 |
| Changing the 5/8 or 80/120 constants | No evidence says the numbers are wrong | `adv:runtime/lib/render.ts:79-82` | MiMo 7 |
| Runtime-record and notification patterns | Session plumbing, not routing | MiMo iteration 8 notes | MiMo 8 |
| Re-verdicting and re-measuring late in the run | MiMo held its verdicts. The skill count has since drifted to 15 | E1 | MiMo 9 and 10 |
| TUI deep read of `src/ui.ts`, `src/autocomplete.ts` and `src/shortcuts.ts` | Not model-context routing | `orch:docs/architecture.md:82-88` | SWE-2 MAX 1 |
| `projection.ts` deep read and calibration internals | The lane contract sufficed. Partial override: X1's home is in the projection | A36 | SWE-2 MAX 3 |
| Full read of the OpenCode plugin | Section reads covered the divergence points. The synthesis read more sections for R2 and R6 | `plugin:61-70` | SWE-2 MAX 4 |
| `directive-lifecycle.ts` internals | Audited override: the internals decide R6 | A10, `adv:hooks/lib/directive-lifecycle.ts:44-47` | SWE-2 MAX 4 |
| Devin and Cursor hook adapters treated as thin shims | Audited override: their nested timeouts are R1 | A50 | SWE-2 MAX 4 |
| Live `advisor_recommend` invocation | Would write runtime state outside the lineage | SWE-2 MAX delta for iteration 5 | SWE-2 MAX 5 |
| Status and rebuild handler reads | Did not change verdicts | `adv:ARCHITECTURE.md:29` | SWE-2 MAX 5 |

---

## Divergence Map

**No divergent pivots happened.** Neither lineage ran in divergent mode. `antiConvergence.divergent` is `{}` in `research/deep-research-config.json` and in the SWE-2 MAX lineage config. The MiMo lineage config carries no anti-convergence block. Both lineages stopped at their iteration caps with `maxIterationsReached`. This map therefore records breadth inside two planned runs. It does not claim that the topic converged.

**Saturated directions.**
- The mechanism partition. MiMo had sorted every orchestrator mechanism into adopt, adapt or reject by its iteration 8. SWE-2 MAX had done the same by its iteration 5. MiMo iterations 9 and 10 added evidence and two findings, F9-1 and F9-2, without moving an earlier verdict, by their own notes.
- Static reading of the orchestrator. Both lineages read its source, docs and tests. This synthesis opened every cited range again (section 14).

**Pivots taken.** None was divergent. Two ordinary focus shifts occurred. MiMo iteration 9 widened into a sweep that found the OpenCode status tool (`plugin:1459-1496`). SWE-2 MAX iteration 5 turned to citation checks and a read of MiMo's synthesis.

**Evidence and Council artifact references.** No AI Council ran, so there are no Council artifacts. The merged registry's `ruledOutDirections` is empty. The ruled-out rows above come from the lineage iteration files and deltas.

**Pivot failures and audited overrides.** No pivot failed, because none ran. This synthesis overrode the lineages in the places below, each argued where it is cited.
- Five shared verdicts reversed to REJECT: X1 to X5.
- The atomic-write REJECT reversed to ADAPT: R11.
- The Pi deadline race retargeted to the shims as R1, with R12 downgraded.
- The Pi contract guard settled for SWE-2 MAX: R7 and X14.
- Premises corrected: the live prompt-policy gate, dedup being off, missing byte counts, atomic-write equivalence, the `doc-frontmatter` flag slot, the plugin tool as a recommend precedent and the skill count.
- Ruled-out directions reopened: SWE-2 MAX's skipped Devin and Cursor adapters (R1) and its skipped `directive-lifecycle.ts` internals (R6). MiMo's dispatch-trace reconstruction was done from code (section 4).

**Remaining frontier.** Runtime measurement is the open edge, and each item has a named check: catalog cost per runtime (Q3), named-skill misses (Q4), the timeout split (Q5), whether models run a named CLI (Q6), OpenCode catalog control (Q9) and the prompt-cache discount (Q10). Two decisions belong to the operator: the policy-gate intent (Q1) and the documentation drift (Q2).

---

## 12. Open Questions

- **Q1. Was the prompt-policy gate removed on purpose?** The Claude hook moved to the CLI front door, and since then no prompt-time path calls `shouldFireAdvisor`. The git history of `adv:hooks/claude/user-prompt-submit.ts` should answer this before R5 is decided.
- **Q2. LOGIC-SYNC REQUIRED.** `adv:hooks/skill-advisor-hook.md:37`, `:38`, `:43` and `:49` and `adv:ARCHITECTURE.md:133` describe the hook as building through `buildSkillAdvisorBrief`, retrying through `shouldTrySkillAdvisorCliFallback`, emitting `{}` on fail-open and sharing one brief builder across runtimes. The code at `adv:hooks/claude/user-prompt-submit.ts:271-302` calls the CLI front door directly and emits the directives-only fallback. The shims emit `{}` only when they kill the child. Which truth prevails: fix the docs to match the code, or restore the documented design?
- **Q3.** What does each runtime other than Pi spend on its own skill catalog? Capturing one system prompt per runtime answers it.
- **Q4.** How often does a skill the user names miss rank 1? A replay over the gold prompts answers it.
- **Q5.** How does the observed 2.5 s split between a cold daemon, the local scorer and compiled-route spawns? Timing each stage answers it, with R2 and R3 in place.
- **Q6.** Does a model actually run the CLI command when a fallback line names it? A forced-timeout test after P3 answers it.
- **Q7.** Should Claude drop a repeated directives-only fallback, given the hook's stated rule that a guardrail is never dropped (`adv:hooks/claude/user-prompt-submit.ts:303-308`)? This is a policy call for the operator.
- **Q8.** Where did both lineages' 16th skill come from? The tree holds 15 (E1), and MiMo's iteration 10 declined to re-measure.
- **Q9.** Can an OpenCode plugin remove OpenCode's own skill list through the system transform it already uses (`plugin:1457`)? If it can, R9's stub could extend to OpenCode. The OpenCode plugin contract answers it.
- **Q10.** How much of the Pi catalog's cost does provider prompt caching already discount? The answer sets the real value of R9.

---

## 13. Proposed Refinement Phases

The phases below would sit after `001-deep-research`, numbered in order.

### P1 `hook-deadline-and-diagnostics`

- **Recommendations:** R1, R3, R7, R11 and R12.
- **Files:** `ssk:runtime/hooks/claude/user-prompt-submit.ts` (R1), `adv:hooks/claude/user-prompt-submit.ts` (R3), `adv:hooks/pi/prompt-advisor.ts` (R3 and R12), `adv:runtime/lib/metrics.ts` (R3 and R11), `adv:runtime/lib/advisor-runtime-values.ts` (R3), the Codex, Cursor and Devin adapters under `ssk:runtime/hooks/` (R3 runtime label), `adv:runtime/tests/hooks/prompt-advisor.vitest.ts` (R7) and new tests for R1 and R11. About 8 to 10 files.
- **Depends on:** nothing.
- **Size:** small to medium.
- **Observable checks:** A CLI stub that sleeps past 2,500 ms produces the directives fallback on a Claude turn instead of `{}`. With debug on, a Pi turn's diagnostic carries `emittedBytes` and runtime pi. Renaming the dist file fails the new test. Killing the process during a trim leaves parseable JSONL.

### P2 `hook-path-cli-spawn-trim`

- **Recommendations:** R2 and R5.
- **Files:** `adv:runtime/handlers/advisor-recommend.ts`, `adv:hooks/lib/skill-advisor-cli-fallback.ts`, `adv:runtime/skill-advisor-cli.ts` if the option travels as a flag, `adv:hooks/claude/user-prompt-submit.ts` (R5), `adv:runtime/lib/prompt-policy.ts` and the documents named in Q2.
- **Depends on:** P1, whose diagnostics give the baseline. R5 also waits for Q1.
- **Size:** medium.
- **Observable checks:** No `compiled-route.cjs` child starts for a hook-path request. Median hook `durationMs` falls below the P1 baseline. A casual prompt skips the CLI. A policy replay newly skips zero gold prompts.

### P3 `headless-fallback-status-and-dedup`

- **Recommendations:** R4 and R6.
- **Files:** `adv:runtime/lib/render.ts` and `adv:hooks/claude/user-prompt-submit.ts`. `adv:hooks/lib/directive-lifecycle.ts` changes only if the split needs it. `plugin` changes for its directive copy and its dedup. `adv:hooks/pi/prompt-advisor.ts` changes for the debug classifier.
- **Depends on:** P1 as a hard dependency, because R1 makes the fallback reach four more runtimes. P2 as a soft one.
- **Size:** small.
- **Observable checks:** A forced timeout names the CLI command. A no-match says that no skill matched. Five no-route turns in one session deliver one full block followed by suppressed repeats.

### P4 `replay-gated-ranking-priors`

- **Recommendations:** R8 and R10.
- **Files:** `adv:runtime/lib/scorer/lanes/explicit.ts`, `adv:runtime/lib/scorer/fusion.ts` and a replay fixture over the gold prompts.
- **Depends on:** a replay run before any scorer code changes.
- **Size:** medium.
- **Observable checks:** Build R8 only if the replay shows named-skill misses at rank 1. Build R10 only if it shows family-ambiguity misses. After either change, no gold prompt loses its rank-1 skill.

### P5 `pi-lazy-catalog-advisor-search`

- **Recommendations:** R9.
- **Files:** a new Pi extension under `adv:hooks/pi/`, linked from `.pi/extensions/` as the current hook is, plus `adv:runtime/handlers/advisor-recommend.ts` and `adv:runtime/lib/scorer/fusion.ts` for the short-query mode.
- **Depends on:** P1 and P3.
- **Size:** large.
- **Observable checks:** An A/B test on Pi shows about 4,960 fewer characters per request. Rank-1 agreement is not below the push-only arm. Results stay at 5 rows by default and 8 at most, with descriptions of 160 characters or fewer.

**Recommended first phase: P1.** It fixes the one confirmed defect that hides advisor failures on four of six runtimes. It is small. It also installs the byte and runtime measurements that P2 to P5 need as their baselines.

---

## 14. Citation Verification Ledger

**Definitions.**
- **resolved:** the lines exist and show what the citing claim says.
- **drifted:** the content sits elsewhere in the file, the range shows only part of it or the claim mislabels the lines. Code in a module that no prompt-time path reaches is also drifted when the same behavior runs live elsewhere. The Note then names the live lines.
- **failed:** the file or the lines are missing, or the lines contradict the claim. Code cited as live prompt-time behavior fails when nothing on the prompt path reaches it and no live equivalent exists.

Each row groups ranges of one file or module that share a result. Refs counts the ranges in the Citation cell. In Cited by, M is MiMo, S is SWE-2 MAX and Syn is this synthesis. The Result follows the lineages' use, and the Note records the synthesis's own use.

**Tallies.** 576 ranges checked: 548 resolved, 20 drifted, 8 failed and 0 not checked. The orchestrator side has 196 ranges, with 193 resolved, 2 drifted and 1 failed. The advisor side and other files have 380 ranges, with 355 resolved, 18 drifted and 7 failed. No ADOPT rests on a drifted or failed range. Both lineages reported zero failed citations, which this ledger does not reproduce.

### Orchestrator citations

| # | Citation | Cited by | Refs | Result | Note |
|---|---|---|---|---|---|
| O1 | `orch:src/search.ts:19-38`, `:19-39`, `:19-53`, `:27`, `:27-36`, `:27-37`, `:28`, `:29`, `:30`, `:32-37`, `:41-53`, `:46`, `:49`, `:49-50`, `:50` | M, S, Syn | 15 | resolved | Scorer, limit clamp, zero-score filter and name tie-break. |
| O2 | `orch:src/search.ts:26` | S | 1 | drifted | Cited for the +200 name rule in SWE-2 MAX's name-pin reason. The line is blank and the rule is at `:27`. |
| O3 | `orch:src/scope.ts:4-7`, `:38-45`, `:90-101`, `:96-99`, `:96-100`, `:96-118`, `:99`, `:104-117`, `:104-118`, `:108-115`, `:112-115`, `:113`, `:114`, `:115-116` | M, S, Syn | 14 | resolved | Scope kinds, profile membership, empty-profile rule and stub text. |
| O4 | `orch:src/catalog.ts:4-14`, `:5`, `:5-13`, `:7-13`, `:7-14`, `:16-18`, `:38`, `:95-134`, `:95-157`, `:95-188`, `:98`, `:118-120`, `:140-157`, `:163-188`, `:163-189`, `:170-188`, `:170-189` | M, S, Syn | 17 | resolved | Normalization, visibility, recognizer, replacement and the potential-catalog detector. |
| O5 | `orch:src/config.ts:39-47`, `:45`, `:46`, `:138-139`, `:138-140` | M, S, Syn | 5 | resolved | Default config with no groups, description cap and Token Saver off. |
| O6 | `orch:src/index.ts:49-91`, `:140-145`, `:149-152`, `:195-202`, `:196`, `:207`, `:262-268`, `:281-326`, `:282-284`, `:286-302`, `:298-301`, `:302-319`, `:309-318`, `:321-325`, `:381`, `:381-383`, `:419`, `:419-420`, `:813` | M, S, Syn | 19 | resolved | Setup, scope state, the prompt hook and the scope-change clears. |
| O7 | `orch:src/index.ts:578-698`, `:583-587`, `:588-595`, `:590`, `:596-650`, `:600`, `:600-609`, `:600-650`, `:602`, `:603-608`, `:603-609`, `:603-616`, `:610-616`, `:616-619`, `:617-620`, `:621-648`, `:622-648`, `:634`, `:644`, `:651`, `:666-685`, `:666-696`, `:669-685`, `:687-696` | M, S, Syn | 24 | resolved | The `skill_search` tool, its fallback and its messages. |
| O8 | `orch:src/index.ts:700-756`, `:716-721`, `:716-722`, `:716-735`, `:716-746`, `:718`, `:723-734`, `:723-735`, `:724-735`, `:736-746`, `:740-746` | M, S, Syn | 11 | resolved | The `skill` loader, the manual-only block and the authorization gate. |
| O9 | `orch:src/index.ts:638` | S | 1 | drifted | Cited for the rule that a fallback never changes the scope. The line opens a return block. The text is at `:634` and `:644`. |
| O10 | `orch:src/dependencies.ts:4-38`, `:8-11`, `:8-21`, `:8-38`, `:8-93`, `:23-38`, `:28-34`, `:40-48`, `:50-93`, `:63-72`, `:77-82`, `:77-83`, `:81-82` | M, S, Syn | 13 | resolved | Negation guard, detector, effective set and the walk. |
| O11 | `orch:src/skill-io.ts:5-7`, `:9-16`, `:18-29`, `:48-79`, `:62-68` | S, Syn | 5 | resolved | Bundle rendering and its warnings. |
| O12 | `orch:src/skill-io.ts:1-79` | S | 1 | failed | S:F19 places the tmp-and-rename write in `skill_io.ts` with no line. The whole 79-line module performs no writes, and its only file call is a read at `:25`. The atomic writer is `orch:src/profiles.ts:61-70`. |
| O13 | `orch:src/profiles.ts:8`, `:17-20`, `:43-49`, `:61-66`, `:61-68`, `:61-70`, `:72-74`, `:135-136`, `:184-196`, `:191-194`, `:199`, `:204`, `:217`, `:227-245`, `:247-283`, `:261-268`, `:319-325`, `:341-349`, `:352-358`, `:456-483` | M, S, Syn | 20 | resolved | Atomic writer, default profile and persistence guards. |
| O14 | `orch:src/shortcuts.ts:90-112` | M | 1 | resolved | Shortcut handling. |
| O15 | `orch:docs/architecture.md:7`, `:11`, `:21-25`, `:29-41`, `:37`, `:57-63`, `:65`, `:82-88`, `:96`, `:98-104`, `:113-117`, `:121-123` | M, S, Syn | 12 | resolved | Design goals, scope model, fallback and cost machinery. |
| O16 | `orch:docs/groups-and-profiles.md:31-40`, `:77-99`, `:101-107`, `:103`, `:105`, `:109-147`, `:167-174` | M, S | 7 | resolved | Profile and group model. |
| O17 | `orch:docs/dependencies.md:9`, `:25-30`, `:34`, `:52-60` | M, S, Syn | 4 | resolved | Dependency loading rules. |
| O18 | `orch:tests/scope.test.mjs:45`, `:57`, `:84`, `:95`, `:107`, `:131`, `:153` | M, Syn | 7 | resolved | Scope test titles. `:107` holds the constant-size test used by R3. |
| O19 | `orch:tests/dependencies.test.mjs:65`, `:73`, `:73-89`, `:82`, `:91` | M, Syn | 5 | resolved | Dependency test titles and bodies. |
| O20 | `orch:tests/catalog.test.mjs:17-34`, `:41`, `:41-52`, `:86`, `:86-93`, `:97`, `:97-109` | M, Syn | 7 | resolved | `:17-34` is the Pi catalog fixture used for E3. |
| O21 | `orch:tests/pi-compatibility.test.mjs:16-26`, `:16-52`, `:28-32`, `:34-42`, `:34-43`, `:45-52`, `:55-80` | M, Syn | 7 | resolved | Peer ranges, manifest, deep-import ban, schemas and Token Saver hooks. |

### Advisor and other citations

| # | Citation | Cited by | Refs | Result | Note |
|---|---|---|---|---|---|
| A1 | `adv:runtime/lib/render.ts:49-58`, `:79`, `:79-81`, `:79-82`, `:79-85`, `:79-127`, `:82`, `:83-84`, `:83-85`, `:88-89`, `:99-101`, `:101`, `:101-107`, `:107`, `:113-118`, `:120-127`, `:120-145`, `:129-145`, `:199`, `:263-313`, `:289` | M, S, Syn | 21 | resolved | Caps, sanitizer, directive block and shadow byte count. MiMo cites `:79-127` for a brief of at most 120 tokens. The cap covers the head only, and the directive block is appended outside it (A2). `:199` is read only by tests. |
| A2 | `adv:runtime/lib/render.ts:377-383`, `:377-395`, `:377-440`, `:380-383`, `:384-441`, `:388-395`, `:409-412`, `:409-413`, `:409-433`, `:409-438`, `:409-440`, `:415-419`, `:421`, `:421-433`, `:421-438`, `:421-440`, `:427-430`, `:427-438`, `:430`, `:435-438`, `:435-440`, `:438`, `:443-448`, `:445`, `:450-463` | M, S, Syn | 25 | resolved | Brief rendering and fallback. `:450-463` has no production caller. |
| A3 | `adv:runtime/lib/render.ts:415-436` | M | 1 | drifted | M:F1-1 cites a label allowlist. The lines sanitize and render the label. The sanitizer is at `:129-145`. |
| A4 | `adv:hooks/claude/user-prompt-submit.ts:5-6`, `:15`, `:44-53`, `:55-71`, `:83`, `:106`, `:106-134`, `:107`, `:107-134`, `:107-145`, `:115-134`, `:136-145`, `:163-165`, `:196-212`, `:203` | M, S, Syn | 15 | resolved | Budget, clamps, kill switch and the hard-coded runtime label. `:15` and `:83` use `buildSkillAdvisorBrief` only as a type. |
| A5 | `adv:hooks/claude/user-prompt-submit.ts:232`, `:243-254`, `:256-269`, `:271-290`, `:271-302`, `:277`, `:277-290`, `:284-290`, `:287`, `:302`, `:303-308`, `:303-345`, `:328`, `:328-341`, `:346-355`, `:357-362`, `:357-387`, `:370-374`, `:376-387`, `:430-441` | S, Syn | 20 | resolved | CLI front door, fallback selection at `:302`, lifecycle dedup and the envelope. |
| A6 | `adv:hooks/claude/user-prompt-submit.ts:248-250` | M | 1 | drifted | MiMo's synthesis cites the `additionalContext` shape here. The lines sit in the parse-failure path. The envelope is at `:357-362`. |
| A7 | `adv:hooks/pi/prompt-advisor.ts:5`, `:8`, `:8-10`, `:16-30`, `:41-50`, `:47-50`, `:60-69`, `:66-69`, `:76-91`, `:81-85`, `:129-152`, `:140`, `:164-191`, `:171-191`, `:176-191`, `:184`, `:189`, `:206-212`, `:214-286`, `:228`, `:230-232`, `:230-285`, `:242-250`, `:243-247`, `:243-250`, `:248-250`, `:251-252`, `:251-255`, `:261-276`, `:278-285`, `:284-285` | M, S, Syn | 31 | resolved | Pi hook. `:242-250` awaits with no race. `:248-250` reads the envelope the Claude handler returns. |
| A8 | `adv:hooks/lib/skill-advisor-cli-fallback.ts:76`, `:76-122`, `:77`, `:77-122`, `:80`, `:86-91`, `:113-122`, `:145-158`, `:160-197`, `:170-197`, `:170-198`, `:222-234`, `:239-258`, `:248-252`, `:259-273`, `:313-321`, `:323-331`, `:338-354`, `:370-407`, `:387`, `:431`, `:436-445`, `:498-505`, `:506`, `:525`, `:527-538`, `:533` | M, S, Syn | 27 | resolved | `:76` applies only without a caller budget (`:145-158`). `:160-197` is cited for dual-root discovery at `:170-197`. |
| A9 | `adv:hooks/lib/skill-advisor-cli-fallback.ts:160-168` | M, S | 1 | failed | Cited by M:F3-1, S:F18, S:F19 and SWE-2 MAX's RQ7 answer as a live retry into the CLI. The predicate has no production caller because the CLI is the front door, so no retry happens. |
| A10 | `adv:hooks/lib/directive-lifecycle.ts:38-41`, `:44-47`, `:126-127`, `:132`, `:148-149` | Syn | 5 | resolved | Default-on dedup, the split rule and the session requirement. |
| A11 | `adv:hooks/lib/directive-lifecycle-file-store.ts:3-6`, `:4-6`, `:22-23` | M, S, Syn | 3 | resolved | Fail-safe store and helper caps. |
| A12 | `adv:hooks/lib/directive-lifecycle-file-store.ts:26-27` | M | 1 | drifted | Cited for the helper's timeout and output caps. The values are at `:22-23`. These lines are interface fields. |
| A13 | `adv:runtime/lib/prompt-policy.ts:30-58`, `:83-87`, `:100-197`, `:130-140`, `:130-143` | S, Syn | 5 | resolved | Read as code only. Whether the gate runs is decided by A14 to A16 and A19. |
| A14 | `adv:runtime/lib/prompt-policy.ts:83-197` | S | 1 | failed | S:F21 and SWE-2 MAX's RQ3 answer cite the live prompt partition. No prompt-time path calls `shouldFireAdvisor`, and no live equivalent exists. |
| A15 | `adv:runtime/lib/prompt-policy.ts:60-67` | M | 1 | failed | M:F2-1, M:F2-3 and M:F3-3 cite gates that skip trivial prompts. The lines are the result interface only, and the gate is not live. |
| A16 | `adv:runtime/lib/skill-advisor-brief.ts:26`, `:401-563` | Syn | 2 | resolved | The only importer of `shouldFireAdvisor` and the builder no prompt path calls. |
| A17 | `adv:runtime/lib/skill-advisor-brief.ts:110-111`, `:110-135`, `:132-135`, `:196-206`, `:344-373`, `:486-504`, `:550-562` | S | 7 | drifted | Cited as live behavior of a builder that no prompt path calls. The same behavior runs live at `adv:runtime/lib/render.ts:79-81`, `:388-395` and `adv:hooks/lib/skill-advisor-cli-fallback.ts:370-407`, `:431`, `:527-538`. |
| A18 | `adv:runtime/lib/skill-advisor-brief.ts:250`, `:407-427` | M, S | 2 | failed | `:250` caps source refs at 8 and `:407-427` is the policy gate. Both sit in the unreached builder with no live equivalent. The synthesis cites `:407-427` only as unreached code. |
| A19 | `adv:runtime/compat/index.ts:8`, `adv:runtime/dist/hooks/claude/user-prompt-submit.js:17`, `:179`, `ssk:runtime/cli/observability/smart-router-measurement.ts:236-240` | Syn | 4 | resolved | Re-export, the built hook calling the CLI front door and the one measurement caller. |
| A20 | `adv:runtime/lib/prompt-cache.ts:10-13`, `:68-82`, `:69-80` | M, S, Syn | 3 | resolved | TTL, size bound and HMAC key. |
| A21 | `adv:runtime/handlers/advisor-recommend.ts:160-192`, `:255-273`, `:257-273`, `:329-368`, `:336-368`, `:346`, `:370-400`, `:391-399`, `:457-530`, `:504`, `:507`, `:565-570`, `:571` | S, Syn | 13 | resolved | Compiled-route spawns run inside a synchronous map, so they are serial. The cache stores results before enrichment. |
| A22 | `adv:runtime/lib/compiled-routing-flag.ts:14-22`, `:24-40`, `:29`, `:57-65` | Syn | 4 | resolved | Seven hubs, on by default. |
| A23 | `adv:runtime/lib/metrics.ts:176-177`, `:180`, `:203-204`, `:295-310`, `:298-315`, `:298-317`, `:299`, `:303`, `:303-307`, `:309-311`, `:347-373`, `:347-394`, `:376-394`, `:406-413`, `:485-492` | M, S, Syn | 15 | resolved | `:309-311` is the plain rewrite behind R11. Both lineages cite the append as atomic, which it is. |
| A24 | `adv:runtime/lib/advisor-runtime-values.ts:10-14` | Syn | 1 | resolved | Runtime enum without pi, codex, cursor or devin. |
| A25 | `adv:runtime/handlers/advisor-validate.ts:643` | Syn | 1 | resolved | The only caller that writes outcome records. |
| A26 | `adv:runtime/lib/policy-plan.ts:836-876`, `:851`, `:945-955` | Syn | 3 | resolved | Observed byte count, read only by tests. |
| A27 | `adv:runtime/lib/scorer/lane-registry.ts:8-13`, `:8-19`, `:8-29`, `:9`, `:9-13`, `:11`, `:21-29`, `:33-36`, `:37-38`, `:37-50`, `:37-71` | M, S, Syn | 11 | resolved | Lane weights, BM25 shadow and overrides. |
| A28 | `adv:runtime/lib/scorer/lanes/explicit.ts:290`, `:299-301`, `:307-309`, `:310-325`, `:316-323`, `:317-321`, `:342` | M, S, Syn | 7 | resolved | Curated adjustments, name variants and the clamp. |
| A29 | `adv:runtime/lib/scorer/fusion.ts:146-183`, `:176-181`, `:300-310`, `:303-308`, `:306`, `:745-780`, `:749-776`, `:791-825`, `:796-825`, `:827-856` | M, S, Syn | 10 | resolved | Query-class multipliers, tie-break, sort and abstention. |
| A30 | `adv:runtime/lib/scorer/lanes/lexical.ts:9-24`, `:9-40`, `:26-40`, `:60`, `:60-106`, `:68-78`, `:78`, `:80-85`, `:87-90`, `:93-95` | M, S, Syn | 10 | resolved | `:87-90` is the comment on evidence harvesting, and the code is at `:93-95`. |
| A31 | `adv:runtime/lib/scorer/lanes/graph-causal.ts:28-34`, `:42-43`, `:91-95` | S, Syn | 3 | resolved | Edge multipliers, depth, breadth and propagation. |
| A32 | `adv:runtime/lib/scorer/lanes/graph-causal.ts:28-30` | M | 1 | drifted | Cited for the multiplier a `depends_on` edge injects. The table spans `:28-34`, with `depends_on` at `:31`. |
| A33 | `adv:references/scoring/advisor-scorer.md:69`, `:83-85`, `:85`, `:93`, `:105-109`, `:109` | M, Syn | 6 | resolved | Scoring reference. `:109` is the derived-dominant 0.72 pin. |
| A34 | `adv:runtime/lib/scorer/aliases.ts:148` | M | 1 | drifted | MiMo's synthesis files it under explicit-lane hub anchoring. It is the doc comment of `modeForPromptAlias`, a deep-loop alias-to-mode lookup that returns null for broad prompts. |
| A35 | `adv:runtime/lib/skill-graph/metadata-sanitizer.ts:9-11`, `:11`, `:34`, `:73-106` | M, S, Syn | 4 | resolved | 512-character cap and the sanitized fields. |
| A36 | `adv:runtime/lib/scorer/projection.ts:676-686`, `:676-692`, `:688-692`, `:734-735`, `:1186-1187` | Syn | 5 | resolved | SKILL.md fields read into the projection. |
| A37 | `adv:runtime/lib/skill-graph/doc-frontmatter.ts:1-7`, `:14-20`, `:22-25`, `:85-140`, `:88-144`, `:132`, `:135`, `:137-143` | S, Syn | 8 | resolved | Reference and asset docs only, opt-in and fixed fields. `:85-140` is a read-list entry from SWE-2 MAX iteration 5. |
| A38 | `adv:runtime/lib/skill-graph/doc-frontmatter.ts:89-139` | M, S | 1 | failed | M:F8-3 and S:V2 cite a parse slot for a SKILL.md flag. The parser reads reference and asset docs, returns null without trigger phrases (`:135`) and returns fixed fields only (`:137-143`). |
| A39 | `adv:runtime/lib/skill-graph/doc-frontmatter.ts:128` | S | 1 | failed | SWE-2 MAX iteration 5 cites the scalar collection that would hold the flag. The line resets inline-list state. Scalars are collected at `:132` and dropped unless they are fixed fields. |
| A40 | `adv:runtime/lib/skill-graph/skill-graph-db.ts:903`, `:1129`, `adv:runtime/lib/skill-graph/skill-graph-queries.ts:187`, `:371` | Syn | 4 | resolved | Unknown-target warning and orphan queries. |
| A41 | `adv:runtime/lib/cross-skill-edges/metadata-loader.ts:115-140`, `:119-135`, `:123-135`, `adv:runtime/lib/cross-skill-edges/detect-inbound-enhances.ts:1-4`, `:140-162`, `:177-205`, `adv:runtime/lib/cross-skill-edges/apply-graph-metadata-patch.ts:14`, `:85-86`, `:100`, `:111-116`, `:121` | M, S, Syn | 11 | resolved | Edge validation, the `enhances` detector, protected sources and the plain rewrites at `:100` and `:121`. |
| A42 | `adv:runtime/lib/cross-skill-edges/apply-graph-metadata-patch.ts:75-119` | M | 1 | drifted | MiMo iteration 5 cites a staged flow with human apply. Automated provenance is recorded at `:111-116`. Whether a human gate exists depends on the caller, which was not checked. |
| A43 | `adv:runtime/lib/cross-skill-edges/detect-inbound-enhances.ts:142-160` | M | 1 | drifted | MiMo iteration 5 cites composite scoring. The lines hold one of three rules. The rules are summed inside the detector at `:177-205`. |
| A44 | `adv:runtime/lib/routing/route-exclusions.ts:4-13`, `:5-13`, `:59-63`, `:59-99`, `:72-80`, `:86-104` | M, S, Syn | 6 | resolved | Global denylist and its fail-safe loading. |
| A45 | `adv:runtime/lib/subprocess.ts:45-54`, `:86`, `:97-99`, `:114-120`, `:303-321`, `adv:runtime/skill-advisor-cli.ts:35`, `:1380-1400`, `:1413-1432` | S, Syn | 8 | resolved | Live only inside the CLI's local-scorer fallback. The local scorer's 5,000 ms timeout ignores `--timeout-ms`. |
| A46 | `adv:SKILL.md:297`, `adv:ARCHITECTURE.md:29`, `:101`, `:117`, `:133` | M, S, Syn | 5 | resolved | `:133` is contradicted by code (Q2). |
| A47 | `adv:hooks/skill-advisor-hook.md:37`, `:38`, `:43`, `:49`, `:53` | Syn | 5 | resolved | `:37`, `:38`, `:43` and `:49` are contradicted by code (Q2). `:53` matches the shim. |
| A48 | `adv:runtime/tests/hooks/prompt-advisor.vitest.ts:27-56` | Syn | 1 | resolved | None of the three tests would fail if the dist path stopped resolving. |
| A49 | `ssk:runtime/hooks/claude/user-prompt-submit.ts:5-6`, `:19`, `:22`, `:102-110`, `:111-115` | Syn | 5 | resolved | The shim, its 2,500 ms child timeout and the `{}` on a kill. |
| A50 | `ssk:runtime/hooks/codex/user-prompt-submit.ts:19`, `ssk:runtime/hooks/codex/shared.ts:95-118`, `ssk:runtime/hooks/cursor/user-prompt-submit.ts:50`, `ssk:runtime/hooks/cursor/shared.ts:139-160`, `ssk:runtime/hooks/devin/user-prompt-submit.ts:19`, `ssk:runtime/hooks/devin/shared.ts:104-125` | Syn | 6 | resolved | Adapters that spawn the Claude shim with 2,800 ms. |
| A51 | `.claude/settings.json:109-110`, `.codex/hooks.json:48-49`, `.cursor/hooks.json:92-94`, `.devin/hooks.v1.json:45-46` | Syn | 4 | resolved | Host commands and timeouts of 3 s, 3 s, 10 s and 10 s. |
| A52 | `plugin:4-6`, `:61`, `:61-70`, `:62-71`, `:262-265`, `:267-272`, `:390-391`, `:390-392`, `:390-418`, `:418-419`, `:606-609`, `:749-763`, `:751-770`, `:755`, `:805-807` | M, S, Syn | 15 | resolved | Directive copy, dedup settings, CLI arguments and `compiledRoute` use. |
| A53 | `plugin:885`, `:982`, `:982-986`, `:983-990`, `:1006-1010`, `:1009-1010`, `:1058-1068`, `:1061-1078`, `:1286-1318`, `:1302`, `:1316-1318`, `:1341-1343`, `:1347-1352`, `:1457`, `:1459-1496`, `:1459-1497` | M, Syn | 16 | resolved | Coalescing, timers, fallback and the system transform. `:1459-1496` is a status-only tool. |
| A54 | `plugin:985-986`, `:988-995` | M | 2 | drifted | MiMo iteration 9 cites `:985-986` for request coalescing, but the lines are the dedup lifecycle comment and coalescing is at `:981-982`. It cites `:988-995` for per-session dedup, but the lines show epoch fields and unrelated counters. The dedup map and its comment are at `:983-987`. |
| A55 | `.skilled/skills/sk-doc/shared/assets/skill-contract.json:13`, `:28` | M | 2 | drifted | MiMo cites the file without lines as a skill-contract field. The flag is listed for commands at `:28`, and skills list no optional fields at `:13`. The synthesis cites both lines as resolved. |
| A56 | `.skilled/skills/sk-doc/sk-create-command/assets/command-template.md:359` | Syn | 1 | resolved | Positive control for E10. |
| A57 | `AGENTS.md:81`, `:83` | Syn | 2 | resolved | The direct CLI call and the user-named-skill rule. |
| A58 | `.skilled/commands/deep/assets/deep-research-auto.yaml:2004-2025` | Syn | 1 | resolved | The compile step this file follows. |
| A59 | `research/lineages/mimo/research.md:20-42`, `research/lineages/swe2max/iterations/iteration-005.md:22`, `research/lineages/mimo/logs/fanout-lineage.err:3` | S, Syn | 3 | resolved | MiMo's ranked table, SWE-2 MAX's read of it and the observed event. |

### Measurements

| ID | Measurement | Method | Result |
|---|---|---|---|
| E1 | Pi-visible skills | Listed `.pi/skills/*/SKILL.md` | 15 top-level skills. Both lineages said 16. |
| E2 | Metadata sizes | Summed frontmatter names and descriptions | Names 178 characters and descriptions 2,140, 2,318 in total. The longest description is sk-code's at 405. |
| E3 | Pi eager catalog | Rendered the 15 skills in the fixture format of `orch:tests/catalog.test.mjs:17-34` with absolute `.pi` paths, which total 1,468 characters | 5,611 characters (5,615 bytes), about 1,403 tokens. |
| E4 | Orchestrator stub and saving | Imported `renderScopeCatalog`, `resolveSkillScope` and `replaceNativeSkillCatalog` in memory with Token Saver off | The stub is 651 characters for the fresh Default profile, which has 0 candidates. It is 652 characters with 15 candidates, about 163 tokens. Replacement saves 4,960 or 4,959 characters, about 1,240 tokens per request. |
| E5 | Directive block | Rendered from `adv:runtime/lib/render.ts:99-101` and `:107` | 216 characters (218 bytes), about 54 tokens. The fallback is 215 characters. |
| E6 | Brief sizes | Computed from the templates at `adv:runtime/lib/render.ts:427-430` and `:435-438` with a short label and at the caps | Typical 258 characters, about 65 tokens. Worst single label 536, about 134. Worst ambiguous 696, about 174. |
| E7 | Metadata over 512 characters | Scanned all 15 `graph-metadata.json` files | 1,531 derived strings with 8 over 512, all `causal_summary`. 2,057 sanitized entries with 0 over 512, the longest 117 in `key_files`. |
| E8 | Skill graph | Opened the SQLite file with `mode=ro&immutable=1` | 15 nodes. Edges: `depends_on` 3, `enhances` 20, `prerequisite_for` 5 and `siblings` 32. 0 dangling. Foreign keys present. 3 inverse pairs. File modification times unchanged. |
| E9 | Orchestrator detector on our skills | Ran `detectDependencies` in memory under node v26.8.2 over the 15 SKILL.md bodies | 16 candidates in 6 skills. It recovers 1 of 3 existing `depends_on` edges. cli-orca maps to 5 skills and sk-doc to 4. |
| E10 | `disable-model-invocation` users | Searched every SKILL.md and command file | 0 of 58 SKILL.md files in each of four skill roots. 0 of 33, 46 and 46 files in three command roots. The advisor never reads the flag. |
| E11 | Observed hook event | Read `research/lineages/mimo/logs/fanout-lineage.err:3` | `fail_open`, `durationMs` 2506, `errorCode` NONZERO_EXIT, message "CLI fallback timed out", `runtime` claude. |
| E12 | Lineage independence | Read SWE-2 MAX's stdout and its iteration 5 | It looked at the MiMo lineage before iteration 1 and read MiMo's 276-line `research.md` in iteration 5 before writing V1 to V16. Its stderr holds 0 fail-open lines. |

---

## 15. Evidence Quality and Caveats

- **Timestamps.** Lineage timestamps are unreliable. The orchestration summary flags anomalies in 11 of 11 MiMo records and 2 of 7 SWE-2 MAX records. None is used as evidence.
- **Self-reports.** MiMo's `newInfoRatio` values are its own estimates.
- **SWE-2 MAX records.** Its state records carry no findings arrays, so its findings were read from its iteration files. Its registry reuses iteration F numbers for different verdicts.
- **Independence.** SWE-2 MAX read MiMo before writing verdicts (section 10), so shared verdicts count once.
- **Excluded advisories.** The two containment advisories named in section 2 are left out of the findings.
- **Resource map.** `resource-map.md` lists 0 references, so it adds no evidence. It is cited because the workflow requires it.
- **Registry gaps.** The merged registry's `ruledOutDirections` is empty and its `iterationsCompleted` reads 5 although MiMo ran 10. The ruled-out rows come from the lineage iteration files and deltas.
- **Skill graph snapshot.** The graph was read with `immutable=1`, which ignores a 61,832-byte WAL. Edits not yet checkpointed would not show in E8.
- **Token estimates.** Token figures divide characters by 4, the renderer's own estimate (`adv:runtime/lib/render.ts:82`). Real tokenizers differ.
- **No runtime runs.** No hook, test or live advisor call ran. Every runtime effect is derived from code or inferred.
- **One data point.** The event in E11 is the only runtime observation.
- **Single reader.** The synthesis-only findings R1, R2, R5, R6 and R11 rest on one reader. Each names the check that would confirm it.
- **Citation reports.** Both lineages reported zero failed citations. This ledger finds 8 failed and 20 drifted.
- **Catalog formats.** The Pi and Claude catalog formats are inferred (section 3).

---

## 16. References

- Phase spec: `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research/spec.md`
- Resource map: `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research/research/resource-map.md`
- Lineage syntheses: `research/lineages/mimo/research.md` and `research/lineages/swe2max/research.md`
- Lineage iterations: `research/lineages/mimo/iterations/iteration-001.md` to `iteration-010.md` and `research/lineages/swe2max/iterations/iteration-001.md` to `iteration-005.md`
- Lineage deltas: `research/lineages/mimo/deltas/iter-001.jsonl` to `iter-010.jsonl` and `research/lineages/swe2max/deltas/iter-001.jsonl` to `iter-005.jsonl`
- Registries: `research/lineages/mimo/findings-registry.json`, `research/lineages/swe2max/findings-registry.json`, `research/findings-registry.json` and `research/deep-research-findings-registry.json`
- Logs: `research/lineages/mimo/logs/fanout-lineage.err`, `research/lineages/swe2max/logs/fanout-lineage.out` and `research/lineages/swe2max/logs/fanout-lineage.err`
- Run records: `research/fanout-attribution.md`, `research/orchestration-summary.json`, `research/orchestration-status.log` and `research/deep-research-config.json`
- Workflow contract: the `step_compile_research` step of `.skilled/commands/deep/assets/deep-research-auto.yaml` and section 6 of `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`
- Orchestrator source: `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/context/pi-skill-orchestrator-main/`
- Advisor source: `.skilled/skills/system-skill-advisor/` and `.skilled/plugins/system-skill-advisor.js`

---

## 17. Convergence Report

The workflow's `step_convergence_report` appends the convergence block below this heading.
