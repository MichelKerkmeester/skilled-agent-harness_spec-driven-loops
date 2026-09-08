---
title: "Iteration 2: The Validation Lane — spec/, rules/, validation/ Against Their Callers"
trigger_phrases: []
---
# Iteration 2: The Validation Lane — spec/, rules/, validation/ Against Their Callers

## Focus

The packet's heaviest subsystem: who actually invokes the 20 spec/ files, the 31 check-* modules in rules/, and the 7 audits in validation/ — through the five caller surfaces (commands, bin, hooks, plugins, workflows) and the dispatch machinery itself. This was the iteration where the registry question (Q3) turned.

## Actions Taken

1. Listed spec/ (20 files), rules/ (31 check-* + helpers), validation/ (7+test); read the header purpose lines of each validation/ module.
2. Read spec/validate.sh's delegation mechanism (orchestrator-only, line 5-8, 26-27, 360) and its flag surface (97-99, 313-315).
3. Located the real dispatch chain: runtime/lib/validation/orchestrator.ts loads cli/lib/validator-registry.json (line 76) and spawnSync-executes its script_path entries (node bridges at 316, bash wrapper at 363).
4. Programmatic parity check: every validator-registry.json script_path against the disk; every rules/check-* against the registry; every spec/ script against the registry.
5. Searched all five caller surfaces (plus repo-wide, tests included) for every spec/ script and every rules/ reference; classified wired vs doc-only.

## Findings

1. `cli/lib/validator-registry.json:1` (LIVE) vs `scripts-registry.json:4` (INERT) — declared: validator-registry is the "rule metadata and dispatch order" source (rules/README.md:14); scripts-registry is the "Centralized catalog of all scripts for dynamic discovery". Observed: the engine orchestrator reads ONLY validator-registry.json (runtime/lib/validation/orchestrator.ts:76; spawnSync dispatch at 316/363), which holds 39 dispatchable rules (severity: 32 error / 5 warn / 2 info; categories: 20 authored_template + 13 operational_runtime + 6 structural; dispatched dirs: rules/, validation/, plus 6 virtual native:orchestrator / ts:spec-doc-structure entries). scripts-registry.json's designated reader, registry-loader.sh ("Queries scripts-registry.json for script information", its line 4), has NONE-FOUND callers anywhere in .opencode/.github (repo-wide rg, tests included) — one doc mention. Every rule-relevant count in the two registries disagrees (9 rules vs 39; iteration 1 added the internal-count errors). Severity P1 (a dead discovery subsystem mislabeled "centralized"). Recommendation: merge — either regenerate scripts-registry.json from validator-registry.json as a view, or remove the registry+loader pair.

2. `README.md:110` — declared: "validate-command-tree-parity.sh — Policy-aware runtime mirror gate wired into spec/validate.sh as the COMMAND_TREE_PARITY rule". Observed: NONE-FOUND — the literal COMMAND_TREE_PARITY appears nowhere in validator-registry.json (grep: empty), the orchestrator carries only an unrelated comment (orchestrator.ts:654), and validate.sh never references it (grep: only orchestrator/depthness lines). The script's actual wired caller is .github/workflows/command-tree-parity.yml (workflow inventory, this repo). The declared wiring does not exist in the current dispatch path. Severity P1 (misleading: a reader checks the wrong enforcement lane). Recommendation: fix — correct the doc to the workflow-only wiring, or re-register the rule.

3. `spec/check-smart-router.sh` and `spec/sweep-track-roots.mjs` — declared: spec-lifecycle/track-root helpers (README.md:66-67 zone). Observed callers: NONE-FOUND anywhere (repo-wide rg over .opencode + .github, tests and docs included, excluding their own directory). Two files, zero references of any kind. Severity P1 (dead). Recommendation: remove — pending only the dynamic-import sweep planned for iteration 9 (string-concatenated imports are not caught by these greps; no other evidence ofdynamic dispatch exists).

4. PLACEHOLDER_FILLED implemented twice, both alive, different lanes — `rules/check-placeholders.sh` (115L): dispatched by the validation gate via validator-registry.json:~21; the post-edit hook declares it "sourced-only, not CLI-invocable" (.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:32). `spec/check-placeholders.sh` (184L): the hook's canonical placeholders checker (post-edit-router.cjs:41, CHECKER_RELATIVE_PATHS) plus 3 references docs. Two implementations of the same rule_id, 69 lines apart, neither shared. Severity P1 (duplicated check, active divergence risk). Recommendation: merge into one implementation.

5. COMMENT_HYGIENE duplicated across packages — cli/rules/check-comment-hygiene.sh (dispatched via validator-registry.json:~28, reaches the validation gate) vs .opencode/sk.../sk-code/sk-code-quality/scripts/check-comment-hygiene.sh, which is what BOTH the post-edit hook (post-edit-router.cjs:36) and .github/workflows/comment-hygiene.yml:17 invoke. The cli copy therefore runs only inside the spec-folder gate; the sk-code copy runs at edit-time and in CI. Severity P2. Recommendation: merge, or document the intentional two-lane split.

6. Phase-parent detection exists in three places despite "no caller re-implements the traversal" (../lib/MODULE-MAP.md, spec/ section) — (a) runtime/lib/spec/is-phase-parent.ts:19 (engine, canonical; imported by the orchestrator); (b) cli/spec/is-phase-parent.ts (200L, near-duplicate, 208 diff lines, adds a runCli() direct-execution mode, tail of file; NONE-FOUND callers outside its own package); (c) cli/lib/shell-common.sh:48 `is_phase_parent()` (shell mirror; the command contract at .opencode/commands/speckit/assets/speckit-implement-auto.yaml:80 mandates that the TS rule and this mirror "must agree"). All three agree in code (regex /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/ in both TS copies), but the documentation disagrees with the code: the engine file's own header comment (line 6) and MODULE-MAP both document the laxer ^[0-9]{3}-[a-z0-9-]+$, which the implemented regex does not enforce (e.g. `123--x` passes the documented, fails the implemented). Severity P2 (the (b) copy is the removal candidate). Recommendation: merge — drop (b) or fold its CLI mode into the engine copy; fix the documented regex.

7. `spec/upgrade-level.sh`, `spec/archive.sh`, `spec/quality-audit.sh`, `spec/progressive-validate.sh`, `spec/sync-phase-map-status.ts`, `spec/check-template-staleness.sh` — declared: lifecycle/quality entrypoints (scripts-registry.json calledBy "AI Assistant, Developer/Cleanup" for the first two; README.md:64-66 "Validation, evidence and comment-hygiene checks" zone). Observed: NONE-FOUND in any of the five wired surfaces (commands, bin, hooks, plugins, workflows) for all six; references exist only in skill docs (SKILL.md:534, feature-catalog, manual-testing-playbook, references/workflows/quick-reference.md). They run only when a human or AI remembers they exist. Severity P2 (documented-but-unwired; the registry's "calledBy: AI Assistant" is honest). Recommendation: document their unwired status in one place, or wire the important ones into a command.

8. `../ARCHITECTURE.md:193` — declared: "spec/validate.sh enforces 20 rules". Observed: the dispatched registry holds 39 rules (20 of which are the authored_template category — possibly the referent, but the sentence says 20 total). Every plausible count (39 dispatched, 28+5+1 by lane, 20 authored-only) makes the printed number ambiguous. Severity P2. Recommendation: fix — state the total and the category split, or cite the registry.

## Positive Controls (verified, not findings)

- spec/validate.sh:97-99,313-315 really supports --json/--strict/--verbose/--quiet — the registry's declared inputs are honest.
- check-markdown-links.cjs's CI claim (README.md:108) verified: .github/workflows/markdown-link-integrity.yml exists.
- The ONLY rules/ callers outside the validation-gate dispatch: post-edit-router.cjs:41 (rules/check-links.sh, opt-in via SPECKIT_VALIDATE_LINKS at :56, hook README:52,117) — one rule, opt-in, sleeping by default.
- Every validator-registry.json script_path resolves on disk except the 6 intentional virtual entries (native:orchestrator, ts:spec-doc-structure schemes) — no registry entry points at nothing in the LIVE registry.

## Questions Answered

- Q3 (partial): within this lane — 0 registry entries pointing at nothing (live registry); 5 rules/ files unregistered in the dispatch registry (3 helpers + check-doc-pointers.sh + check-links.sh); 14/14 sampled spec/ scripts undispatched; duplication: placeholders (2), comment-hygiene (2, cross-package), phase-parent (3), registries (2), link checks (2, documented as complementary). Root check scripts + package.json parity remain for later iterations.

## Questions Remaining

- Q1 callers for the remaining ~25 directories; Q2 save-pipeline stages; Q3 parity for the other lanes (retrieval, evals, sweeps); Q4 zero-caller directories beyond these; Q5 codex/pi/mirrors/evals; Q6 framing + cross-package duplication.

## What Worked / What Failed

- Worked: treating "which file READS the registry" as the primary question — it flipped three tentative conclusions (rules/ dead → alive via the engine dispatch; validation/ audits orphaned → dispatched; registry → inert) inside one iteration.
- Worked: programmatic parity (existsSync over every script_path) turned "maybe missing" into counted facts.
- Failed: none; no approach exhausted.

## Ruled Out

- "validate.sh implements the rules itself" — it spawns the engine orchestrator (spec/validate.sh:26-27,305,360) which spawns the registered rules; both hops now evidenced.
- "rules/ is dead" — 28 of 31 check-* files are dispatched through the LIVE registry; only the 3 helpers + check-doc-pointers.sh + check-links.sh sit outside it, and check-links.sh has the hook caller.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:5-8,26-27,97-99,305,313-315,360] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:76,102,306-375,654] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1-45,369-393] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json:4,37-38,382-386] [SOURCE: .opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:32-41,56] [SOURCE: .opencode/commands/speckit/assets/speckit-implement-auto.yaml:69,80] [SOURCE: .github/workflows/command-tree-parity.yml, comment-hygiene.yml:17, markdown-link-integrity.yml] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/spec/is-phase-parent.ts:6,19] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts:7,194-200] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/lib/shell-common.sh:45-48] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:193-194]

## Next Iteration

Iteration 3: the save pipeline, stage 1 — continuity/ (9 files) + core/ (29 files): generate-context.js's actual call graph, the three documented save-gate layers (ARCHITECTURE.md:182,195), and which stages still execute after the memory decommission (ADR-001, ARCHITECTURE.md:148-166 ownership table).
