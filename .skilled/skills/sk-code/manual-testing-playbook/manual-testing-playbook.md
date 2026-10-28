---
title: "sk-code: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the sk-code skill."
version: 1.5.14.0
---

# sk-code: Manual Testing Playbook

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and
> reason are persisted through the operator's evidence trail described in §3 GLOBAL EVIDENCE
> REQUIREMENTS below.

> **EXECUTION POLICY**: Every scenario MUST be executed against the live sk-code skill — no mocks, no stubs, no "unautomatable" verdicts. Scenarios verify the AI's actual routing behavior: which surface it detects, which references/assets it loads, which agent it dispatches. Acceptable verdicts are PASS, FAIL, or SKIP (with a documented sandbox or runtime blocker).

This document combines the full manual-validation contract for the `sk-code` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide. Per-feature files provide the deeper execution contract for each scenario, including the user request, expected detection markers, expected resource loading paths, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern. The root document acts as the directory, review surface, and orchestration guide; per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `surface-detection/`
- `language-sub-detection/`
- `routing-disambiguation/`
- `skill-advisor-integration/`
- `design-restraint/`
- `tooling-and-hooks/`
- `plugins-and-hooks/`
- `doctor-commands/`

---

## 1. OVERVIEW

This playbook provides deterministic operator scenarios validating the `sk-code` skill surface, plus one `compiled-routing/` category that is excluded as routing-gold (see the corpus manifest). Each feature keeps a stable ID (numbered `{PREFIX}-NNN` for legacy categories, or a descriptive kebab-slug for newer non-numbered categories) and links to a dedicated feature file with the full execution contract. §16 FEATURE CATALOG CROSS-REFERENCE INDEX carries the authoritative per-scenario listing, the feature-catalog entry each scenario belongs to, and the scenario counts the validator derives from the walked tree.

Coverage note (2026-05-04, with the CI and `/doctor:ci` bullets added 2026-10-25): the playbook covers sk-code's two-axis routing (Code Surface → Intent → Resource Loading) at SKILL.md head-of-main. It exercises:
- SKILLED surface detection (CWD or target path under `.skilled/`).
- UNKNOWN fallback (Go / Swift / React Native markers — disambiguation expected).
- SKILLED language sub-detection (JavaScript, TypeScript, Python, Shell, Rust, Config) with correct sub-language reference loading, LS-005 and LS-006 covering the JavaScript and Rust rows.
- Routing disambiguation and the sk-code vs sk-doc anti-pattern.
- Skill advisor integration: a top-1 win that passes the probe's own threshold for positive controls, no false positives on doc-edit prompts.
- Design restraint scenarios (added 2026-06-13, v3.4.0.0): the pre-write Design Restraint Ladder rung selection, the implementer anti-stall rule, the `ceiling:` intentional-simplification convention, and the STACK_FOLDERS-to-disk validator.
- Tooling and hooks: the two warn-only banner branches of the legacy `claude-posttooluse.sh` PostToolUse hook, kept for direct tests and registered in no runtime — dist-staleness wiring (`check-dist-staleness.sh`; TH-001, added 2026-07-02, v3.5.0.16) and comment-hygiene wiring (`check-comment-hygiene.sh`; TH-002, added 2026-07-07) — each a deterministic stdout/exit-code check independent of skill routing.
- Plugins and hooks: the runtime-neutral `sk-code-post-edit-quality` post-edit quality router shared by the OpenCode plugin adapter (`tool.execute.before`/`tool.execute.after`/`experimental.chat.system.transform`) and the Claude Code `PostToolUse(Write|Edit)` hook (`post-edit-quality-router`, added 2026-07-11) — a live dual-runtime dispatch/checker check independent of skill routing.
- Doctor commands: the `/doctor:sk-code setup` read-only battery, covering its nine legs (provisioning, parent-skill, root-metadata, guard, sync, drift-guards, derived-freshness, the route probe and quality), its exit-code-to-status mapping (0 to `STATUS=OK`, 1 to `STATUS=FAIL` and 2 to `STATUS=ERROR`), its write-nothing guarantee and the pre-v4 checkout where the battery runs no leg and fails provisioning with the v4-layout repair.
- Doctor commands, quality config: the `/doctor:sk-code quality` target (DOC-395), its status, check, init dry run, approval and one-time write, its `CONFIG_EXISTS` refusal of an existing config and its offline `SOURCE="none"` path.
- Doctor commands, CI report: the read-only `/doctor:ci report` route (DOC-392), checked against the report's JSON contract, which now carries the CI profile source, plus its pinned-commit `--sha` path, a fixture `--profile`, the `list` startup menu and its bad-argument exit code. The same route in a repository with its own switch names is the `sk-code-ci` packet's `ci-foreign-repository-profile` scenario.
- Doctor commands, CI scaffold and toggle: the `/doctor:ci scaffold` dry run and no-answer paths that write nothing (DOC-393), and the `/doctor:ci toggle` plan with its second confirmation for a protected workflow, no answer, non-switch refusal and `SKILLED_CI_REPORTS` set-and-clear round trip (DOC-394).
- CI surface bundling and detection precedence: the `ci-surface-ci-standards` scenario lives in `sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md`, because the router-sync guard replays packet-level playbooks only. Detection precedence, where a declared specific surface outranks the SKILLED fallback, is covered by `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` and the advisor plugin vitest suite, not by a scenario here.

### Realistic Test Model

1. A realistic user request is given to an orchestrator that has the sk-code skill registered.
2. The orchestrator (Claude Code, OpenCode, or Copilot) consults the skill advisor and decides whether to invoke sk-code, route to another skill, or ask for disambiguation.
3. The operator captures: which skill won the advisor vote, which surface sk-code detected, which references/assets the AI loaded, which agent (if any) was dispatched, and what the AI's response actually was.
4. The scenario passes only when the routing is correct, the resource-loading is exact (matches expected paths), and the user-visible outcome is sound.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior.
- The expected detection markers (verbatim from `shared/references/stack-detection.md`).
- The expected references and assets the AI MUST load (exact relative paths under `references/` and `assets/`).
- The expected agent dispatch (if any — typically `@code` for write work, or none for read-only).
- The pass/fail criteria with binary grading.
- Failure triage steps.

### How To Read An Advisor Probe

`skill_advisor.py` prints a JSON array of candidate objects, best first. The advisor has two paths, and the output says which one ran:

- The **native** path prints `score`, `dominant_lane` and a `_shadow` block per candidate. `score` is the raw lane score on its own scale: it orders the candidates and never reaches a `--threshold` value.
- The **local fallback** prints `source: "local"`, no `score`, and a stderr banner reading `Native advisor unavailable (NATIVE_DIST_MISSING; freshness=unavailable); falling back to local Python scorer.` It ranks and thresholds on its own signal match, and it can disagree with the native path on the same prompt.

On both paths `confidence` is what `--threshold` compares, and `passes_threshold` reports that comparison. So every probe criterion in this playbook gates on `confidence` / `passes_threshold`, which exist on both paths, and treats `score` as an ordering detail that is available only on the native path. A scenario that compares `score` against a `--threshold` number is ungradeable, because `score` does not live on that scale.

Record which path ran in the evidence. A run on the fallback path is still graded on what it printed: if it misroutes, that is a FAIL and the repair is to restore the native advisor, not to relax the criterion.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root and has `.git/`.
2. The sk-code skill is present at `.skilled/skills/sk-code/` with the `sk-code-quality/`, `sk-code-review/`, `sk-code-ci/` and `sk-code-skilled/` packets intact.
3. The skill advisor at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` is callable and `skill-graph.json` includes the `sk-code` entry with its `signals` list intact.
4. The orchestrator runtime has a Skill Advisor Hook OR can invoke `skill_advisor.py` via Bash.
5. **Concurrency cap**: When running multi-scenario waves, cap at 5 parallel scenarios. Scenarios that invoke `skill_advisor.py` are CPU-light and can run concurrently; scenarios that dispatch `@code` (write work) MUST run serially to avoid scope-collision on the working tree.
6. **Mutating scenarios**: most scenarios in this playbook are read-only against the skill surface, but four change something and MUST run serially with their undo applied before the next scenario starts. DOC-382 creates and then deletes a nested `graph-metadata.json` inside the `sk-code-skilled/` packet. TH-001 appends a newline to `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` and back-dates its compiled `orchestrator.js`, restoring both from a backup copy. DR-004 creates and then removes `sk-code-skilled/references/zzz_fake_language/` in the live references tree. DOC-383 commits a baseline inside a throwaway clone under a `mktemp -d` directory that it deletes. Every other scenario writes only under `/tmp` or reads only. Each per-feature file's SOURCE METADATA names its own undo, and a scenario that cannot complete its undo is a FAIL, not a PASS with a note.
7. For a scenario that needs a shared current-code checkout, the environment is `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`. The doctor-commands category README describes it and its reset steps.
8. The skill advisor serves on its native path for any criterion that compares `score`. `bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --health` reports `"status": "degraded"` when the local fallback is serving and another status when the native path is. A degraded run still records its verdict, with the fallback banner quoted in the evidence.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user prompt that was tested.
- The skill advisor output (top-1 skill, its `confidence` and its `score`, the gap to second, and `passes_threshold`).
- The detected code surface (a declared specific surface, then the SKILLED fallback, then UNKNOWN) reported by sk-code.
- The exact list of references/assets the AI loaded (verbatim relative paths under `.skilled/skills/sk-code/`).
- The agent dispatched (if any) with name and runtime (e.g. `@code` via `.skilled/agents/code.md`).
- The AI's user-visible response (the answer it produced or the action it took).
- The scenario verdict (PASS / FAIL / SKIP) with one-line rationale, and for a SKIP the named blocker.
- Output transcripts saved under `/tmp/skc-NNN*.txt` per scenario, plus the `git status --porcelain` output for every mutating step of DOC-382, TH-001, DR-004 and DOC-383.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Skill advisor probe: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.8`.
- Bash commands: `bash: <command>`.
- AI agent prompts: `As @<agent>: <instruction>`.
- Resource path notation: paths shown relative to `.skilled/skills/sk-code/` (e.g. `shared/references/stack-detection.md`).
- `→` separates sequential steps inside a scenario's Exact Command Sequence.
- All evidence files live under `/tmp/skc-NNN*`. Only DOC-382, TH-001, DR-004 and DOC-383 change anything inside a working tree; DOC-382, TH-001 and DR-004 restore it in place and DOC-383 changes only its own throwaway clone. Every other scenario writes nothing outside a `/tmp` sandbox.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md` (this file).
2. Per-feature files under `manual-testing-playbook/<category-name>/`.
3. Scenario execution evidence (advisor outputs, surface-detection logs, resource-loading transcripts).
4. Feature-to-scenario coverage map (§16 FEATURE CATALOG CROSS-REFERENCE INDEX).
5. Triage notes for all FAIL and SKIP outcomes.

### Scenario Acceptance Rules

For each executed scenario, check:
1. Preconditions (§2) were satisfied.
2. Exact prompt was used verbatim.
3. Skill advisor returned the expected top-1 skill and that candidate's `passes_threshold` is true at the probe's own `--threshold`.
4. sk-code detected the expected surface (or correctly returned UNKNOWN).
5. The AI loaded EXACTLY the expected references/assets (no extra loads, no missed loads).
6. The agent dispatch (if any) matched the expected dispatch.
7. The user-visible outcome would satisfy a real user with the originating request.

### Verdict Rules

- `PASS`: all 7 acceptance checks true.
- `FAIL`: any of (advisor lost, wrong surface, wrong agent, missing required reference, minor resource-loading drift) is true. Resource-loading drift is a FAIL rather than a lesser verdict: the load set is a graded criterion, so an extra or missing load fails it and the named drift goes in the rationale.
- `SKIP`: a documented external blocker (e.g. advisor binary unavailable in the sandbox, `gh` unauthenticated for the DOC-394 round trip alone).

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are PASS.
- `FAIL`: any mapped scenario is FAIL.

Hard rule: any critical-path scenario FAIL forces the feature verdict to FAIL. Critical-path scenarios are SD-002, SD-003, RD-002, and SA-001.

### Release Readiness Rule

Release is READY only when:
1. No feature verdict is FAIL.
2. All critical scenarios (SD-002, SD-003, RD-002, SA-001) are PASS.
3. Every operator scenario listed in §16 has a recorded outcome: 23 of 23, across the 9 operator categories. The `compiled-routing/` files are routing-gold and carry their own verdict through the topology gate, not through this protocol.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic and routing-architecture explanations in this root playbook. Put scenario-specific acceptance caveats and resource-path expectations in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package.

### Operational Rules

1. Probe runtime capacity at start (`pgrep -f "python3 .*skill_advisor" | wc -l`).
2. Reserve one operator (you) as coordinator.
3. Saturate remaining worker slots up to 5 for advisor probes; 1 for `@code` dispatches.
4. Pre-assign explicit scenario IDs to each wave before execution.
5. Run the SA-001 advisor-probe wave LAST so it can reference outputs from SD-* and LS-* scenarios.
6. Keep DOC-382, TH-001, DR-004 and DOC-383 out of every parallel wave, because each changes a tree. Run them one at a time and confirm the undo before starting the next.
7. After each wave, save evidence under `/tmp/skc-wave-NN/`, then begin the next wave.
8. Record utilization, per-feature file references, and evidence paths in the final report.

### What Belongs in Per-Feature Files

- Real user request (the human-language ask the operator simulates).
- Exact prompt to feed into the orchestrator's prompt entry.
- Expected detection markers (cite `shared/references/stack-detection.md` section 3).
- Expected reference/asset load list (exact relative paths).
- Expected agent dispatch (or no-dispatch with rationale).
- Pass/fail criteria.

---

## 7. SURFACE DETECTION (`SD-002..SD-003`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `SD-002` | SKILLED Detection | Verify sk-code routes a system-code task to the SKILLED surface | `Handle empty prompts in .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts with a TypeScript console.error fallback.` | advisor probe → invoke sk-code → inspect surface + loaded refs | advisor: sk-code top-1 with `passes_threshold` true at `--threshold 0.8`; surface: SKILLED; sub-language: TYPESCRIPT; refs: `sk-code-skilled/references/typescript/{style-guide,quality-standards,quick-reference}/` + `sk-code-skilled/references/shared/` | `/tmp/skc-SD002-advisor.txt`, `/tmp/skc-SD002-loaded-refs.txt` | PASS iff surface == SKILLED AND sub-language detected as TYPESCRIPT AND `sk-code-skilled/references/typescript/*` in load set AND the advisor's top-1 is sk-code with `passes_threshold` true | If SKILLED not detected, verify the SKILLED `surfaceDetection` block in `mode-registry.json` and the order in `shared/references/stack-detection.md` section 2 |
| `SD-003` | UNKNOWN Fallback | Verify sk-code asks for disambiguation on unsupported stacks (Go) | `Add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header.` | advisor probe → invoke sk-code → inspect surface | advisor: no candidate clears the threshold for this prompt (the probe returns an empty array); surface: UNKNOWN; AI asks "which runtime / verification commands?" | `/tmp/skc-SD003-advisor.txt`, `/tmp/skc-SD003-response.txt` | PASS iff surface == UNKNOWN AND AI explicitly asks for runtime/verification disambiguation AND no surface-specific refs are loaded | If sk-code silently proceeds, verify the disambiguation rule in `ROUTER.md` section 6 UNKNOWN FALLBACK |

Per-feature files: see `surface-detection/`.

---

## 8. LANGUAGE SUB-DETECTION (`LS-001..LS-006`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `LS-001` | SKILLED/TypeScript | Verify TypeScript sub-language detection within SKILLED | `Refactor the parseExecutorConfig function in .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: SKILLED; sub-language: TYPESCRIPT; refs: `sk-code-skilled/references/typescript/{style-guide,quality-standards,quick-reference}/` + `sk-code-skilled/references/shared/` | `/tmp/skc-LS001-loaded-refs.txt` | PASS iff sub-language == TYPESCRIPT AND all three typescript topic folders loaded AND no python/shell/config refs loaded | Verify the TYPESCRIPT row in `shared/references/stack-detection.md` section 3; check `.ts` is in its extension list |
| `LS-002` | SKILLED/Python | Verify Python sub-language detection within SKILLED | `Update the skill_advisor.py argparse block at .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py to add a --json-output flag that emits results as JSON.` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: SKILLED; sub-language: PYTHON; refs: `sk-code-skilled/references/python/{style-guide,quality-standards,quick-reference}.md` + `sk-code-skilled/references/shared/` | `/tmp/skc-LS002-loaded-refs.txt` | PASS iff sub-language == PYTHON AND all three python refs loaded AND no typescript/shell/config refs loaded | Verify the PYTHON row in `shared/references/stack-detection.md` section 3; check `argparse` is a Python signal |
| `LS-003` | SKILLED/Shell | Verify Shell sub-language detection within SKILLED | `Add set -euo pipefail and a trap to .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh to clean up the temp dir on exit.` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: SKILLED; sub-language: SHELL; refs: `sk-code-skilled/references/shell/{style-guide,quality-standards,quick-reference}/` + `sk-code-skilled/references/shared/` | `/tmp/skc-LS003-loaded-refs.txt` | PASS iff sub-language == SHELL AND all three shell topic folders loaded AND no python/typescript refs loaded | Verify the SHELL row in `shared/references/stack-detection.md` section 3; check `.sh` and the shebang signals |
| `LS-004` | SKILLED/Config | Verify JSON/JSONC sub-language detection within SKILLED | `Add a derived.last_active_child_id field to the graph-metadata.json file with value "001-spec".` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: SKILLED; sub-language: CONFIG; refs: `sk-code-skilled/references/config/{style-guide,quality-standards,quick-reference}.md` + `sk-code-skilled/references/shared/` | `/tmp/skc-LS004-loaded-refs.txt` | PASS iff sub-language == CONFIG AND all three config refs loaded | Verify the CONFIG row in `shared/references/stack-detection.md` section 3 and that no over-broad TS marker claims `.json` |
| `LS-005` | SKILLED/JavaScript | Verify JavaScript sub-language detection within SKILLED | `Add a guard to main in .skilled/skills/sk-code/benchmark/scripts/render-report.cjs so an argv with neither --check nor a source path prints the usage line instead of throwing.` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: SKILLED; sub-language: JAVASCRIPT; refs: `sk-code-skilled/references/javascript/{style-guide.md,quick-reference.md,quality-standards/}` + `sk-code-skilled/references/shared/`; asset `sk-code-skilled/assets/checklists/javascript-checklist.md` | `/tmp/skc-LS005-loaded-refs.txt` | PASS iff sub-language == JAVASCRIPT AND the three javascript refs loaded AND no typescript/python/shell/rust/config refs loaded | Verify the JAVASCRIPT row in `shared/references/stack-detection.md` section 3 covers `.js`, `.mjs` and `.cjs` |
| `LS-006` | SKILLED/Rust | Verify Rust sub-language detection within SKILLED, including the never-overrides rule | `In /tmp/skc-LS006-sandbox I have lib.rs and client.ts, a napi-rs binding and the TypeScript client it has to match byte for byte. Review both together and tell me which standards you applied to each.` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: SKILLED; sub-language: RUST plus TYPESCRIPT, because the task names both languages and Rust never overrides another language; refs: `sk-code-skilled/references/rust/{style-guide,quality-standards,quick-reference}/` + `sk-code-skilled/references/typescript/{style-guide,quality-standards,quick-reference}/` + `sk-code-skilled/references/shared/` | `/tmp/skc-LS006-loaded-refs.txt` | PASS iff RUST is detected for the `.rs`/Cargo evidence AND TYPESCRIPT stays detected for the `.ts` side AND neither set displaces the other AND `sk-code-skilled/assets/checklists/rust-checklist/` loads | Verify the RUST row and the never-overrides paragraph in `shared/references/stack-detection.md` section 3 |

Per-feature files: see `language-sub-detection/`.

---

## 9. ROUTING DISAMBIGUATION (`RD-002`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `RD-002` | sk-code vs sk-doc Anti-Pattern | Verify skill advisor routes doc-edit prompts to sk-doc, NOT sk-code | `Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary at the top.` | advisor probe → inspect top-1, `confidence`, `passes_threshold` and each candidate's `score` | advisor: sk-doc top-1 with `passes_threshold` true, and sk-doc's `score` higher than sk-code's | `/tmp/skc-RD002-advisor.txt` | PASS iff advisor top-1 == sk-doc AND sk-doc's `passes_threshold` is true AND sk-doc's `score` exceeds sk-code's `score` | If sk-code wins despite this being a doc-edit, propose an anti-signal in the `signals` list of `skill-graph.json` and get operator approval before editing |

Per-feature files: see `routing-disambiguation/`.

---

## 10. SKILL ADVISOR INTEGRATION (`SA-001`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `SA-001` | Advisor Probe Battery | Verify sk-code wins ≥80% of positive controls and loses 100% of negative controls | (multi-prompt battery — see per-feature file) | run `skill_advisor.py` for each of the 17 prompts at threshold 0.8 and record one parsed row per prompt | sk-code wins ≥10 of the 12 positives with `passes_threshold` true; sk-code is top-1 on none of the 5 negatives | `/tmp/skc-SA001-advisor-results.jsonl` (17 records), `/tmp/skc-SA001-aggregate.md` | PASS iff positive accuracy ≥ 0.80 AND negative-control false-positive rate == 0 | If positive accuracy < 0.80, propose `signals` list additions in `skill-graph.json` and get operator approval before editing |

Per-feature file: see `skill-advisor-integration/advisor-probe-battery.md`.

---

## 11. DESIGN RESTRAINT (`DR-001..DR-004`)
These scenarios validate the v3.4.0.0 ponytail-based refinement: the pre-write Design Restraint Ladder, the implementer anti-stall rule, the `ceiling:` intentional-simplification convention, and the STACK_FOLDERS-to-disk validator. The first three run after surface and intent routing and change neither surface precedence nor the Iron Law; the fourth is a deterministic exit-code check.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `DR-001` | Design Restraint Ladder | Verify sk-code walks the ladder and selects the laziest viable rung before writing new code | `Add a helper to .skilled/skills/system-spec-kit/runtime/lib/util/unique.ts that removes duplicate strings from an array. Before writing, walk the Design Restraint Ladder and pick the laziest viable rung.` | advisor probe → invoke sk-code → capture surface then ladder trace | advisor: sk-code top-1 with `passes_threshold` true; surface SKILLED emitted before any ladder reasoning; ladder selects a one-line `new Set` rung over a custom loop; the Phase 0 to 1 gate is honored | `/tmp/skc-DR001-advisor.txt`, `/tmp/skc-DR001-ladder.txt` | PASS iff the ladder runs after routing AND the laziest viable rung is selected per `shared/references/universal/code-quality-standards.md` AND the Phase 0 to 1 gate in `shared/references/phase-detection.md` is honored | If the AI writes a custom loop, verify ladder rungs in `shared/references/universal/code-quality-standards.md` |
| `DR-002` | Implementer Anti-Stall | Verify sk-code implements the requirement and raises a scope-amendment note without stalling to ask | `Add a retry wrapper with exponential backoff, jitter, a circuit breaker, and a pluggable metrics sink to the discoverConfig() call in .skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs. It only runs once per gate run.` | advisor probe → invoke sk-code → capture the response shape | advisor: sk-code top-1 with `passes_threshold` true; requirement implemented; scope-amendment recommendation raised in the same response; no stall-to-ask; SCOPE-LOCK held | `/tmp/skc-DR002-advisor.txt`, `/tmp/skc-DR002-response.txt` | PASS iff sk-code implements the requirement AND raises a scope-amendment note in one response without blocking to ask, per the Pre-Write Restraint rule in `shared/references/workflow-implement.md` | If the AI stalls to ask, verify the Pre-Write Restraint paragraph in `shared/references/workflow-implement.md` |
| `DR-003` | Ceiling Comment Convention | Verify sk-code marks a deliberate shortcut with a neutral `ceiling:` comment that passes comment-hygiene without allow-listing | `Add a small process-lifetime memo to readHygieneRules() in .skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs. One gate run reads the table once, so a fixed in-memory cache is fine, and mark the deliberate ceiling.` | invoke sk-code in `/tmp/skc-DR003-sandbox/` → run `check-comment-hygiene.sh` on the result | `ceiling:` comment names shortcut, ceiling, and upgrade trigger as a plain WHY; hygiene exits 0; `ceiling:` not added to the allowed-pattern list | `/tmp/skc-DR003-hygiene.txt` | PASS iff the ceiling comment follows `sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` §3 (neutral WHY, not allow-listed) AND comment-hygiene exits 0 | If hygiene fails, the comment likely embeds a forbidden id. Rewrite it as a durable WHY |
| `DR-004` | STACK_FOLDERS Validator | Verify the validator passes clean and fails non-zero on an orphan surface folder | `Run the language reference folder validator, confirm a clean pass, then add an orphan references/<fake-language> folder and confirm it fails.` | `python3 .../verify_stack_folders.py` (exit 0) → mkdir orphan `references/zzz_fake_language` in the live tree → re-run (exit 1) → rmdir → re-run (exit 0) | clean run exits 0 listing declared surfaces; orphan run exits 1 naming the orphan; cleanup restores exit 0 | `/tmp/skc-DR004-clean.txt`, `/tmp/skc-DR004-orphan.txt` | PASS iff the clean run exits 0 AND an orphan folder in `references/` produces exit 1 naming the orphan, per `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_stack_folders.py` AND the orphan folder is removed afterwards | If the orphan is not caught, verify every directory directly under `references/` is scanned. If the `rmdir` did not run, remove `sk-code-skilled/references/zzz_fake_language/` by hand before any other scenario |

Per-feature files: see `design-restraint/`.

---

## 12. TOOLING AND HOOKS (`TH-001..TH-002`)
This category validates shared tooling hooks that sk-code ships or wires into, independent of skill-advisor routing or surface detection. Scenarios here are deterministic checks against a script's real stdout/exit-code contract, not routing decisions.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `TH-001` | Dist-Staleness Hook Wiring | Verify `claude-posttooluse.sh` prints a STALE DIST WARNING banner for a stale watched package and always exits 0 | `Edit .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts while its compiled dist output is stale, and confirm claude-posttooluse.sh prints a STALE DIST WARNING banner and still exits 0.` | back up the source → make dist stale → invoke checker directly → invoke full hook via stdin JSON → restore the source from the backup and re-touch the dist file | banner: `STALE DIST WARNING: @spec-kit/runtime -- run: ...`; hook exit 0 in all cases; `git diff --stat` on the source empty after the restore | `/tmp/th001-hook-stdout.txt`, `/tmp/th001-hook-stderr.txt` | PASS iff banner reaches hook stdout AND hook exits 0 AND the source file is restored byte-for-byte | If banner is missing but hook still exits 0, check the checker's executable bit (`ls -la check-dist-staleness.sh`) — see per-feature file for the incident this scenario originally caught and how it was fixed |
| `TH-002` | Comment-Hygiene Hook Wiring | Verify `claude-posttooluse.sh` prints a COMMENT HYGIENE WARNING banner for an edit that introduces a forbidden ephemeral-artifact comment and always exits 0, while `check-comment-hygiene.sh` flags rc=1 pre-fix and rc=0 post-fix | `In a /tmp sandbox, add a source file whose comment carries an ephemeral-artifact pointer (an ADR id), and confirm claude-posttooluse.sh prints a COMMENT HYGIENE WARNING banner and still exits 0, that check-comment-hygiene.sh returns rc=1 on that file, then fix the comment in place and confirm rc=0.` | write sandbox `.ts` with a forbidden `ADR-<n>` comment → invoke checker directly (rc=1) → invoke full hook via stdin JSON (banner, exit 0) → rewrite comment as a durable WHY → re-run checker directly (rc=0) | direct checker stdout `<file>:<line>: <excerpt> [<class>]` with `direct_prefix_exit=1`; hook stdout banner `COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.` (blank-line wrapped); `hook_exit=0` in all cases; `direct_postfix_exit=0` after the fix | `/tmp/th002-hook-stdout.txt`, `/tmp/th002-direct-prefix.txt`, `/tmp/th002-direct-postfix.txt` | PASS iff the COMMENT HYGIENE WARNING banner reaches hook stdout AND the hook exits 0 AND `check-comment-hygiene.sh` returns rc=1 pre-fix AND rc=0 post-fix | If the banner is missing, confirm the checker returned rc=1 (not rc=2 skip / rc=0 clean): the comment must sit on a comment line, match a `VIOLATION_PATTERN`, and carry no `hygiene-ok` escape; if rc=1 yet no banner, check the checker's executable bit and the hook's `returncode==1 AND stdout.strip()` guard — see per-feature file |

Per-feature files: see `tooling-and-hooks/`.

---

## 13. PLUGINS AND HOOKS (`plugins-and-hooks`)
This category validates the runtime-neutral `sk-code-post-edit-quality` post-edit quality router shared by the OpenCode plugin adapter and the Claude Code `PostToolUse` hook. Scenarios here exercise the real dispatch/router core, the real Claude hook binary, and the real OpenCode plugin module end-to-end — independent of skill-advisor routing or surface detection. IDs in this category are descriptive kebab-slugs, not numbered `{PREFIX}-NNN` ids.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `post-edit-quality-router` | Post-Edit Quality Router | Verify the shared `sk-code-post-edit-quality` core dispatches identically for the OpenCode plugin and the Claude Code `PostToolUse` hook, is warn-only/fail-open, and fully silences under its kill-switch | (no orchestrator prompt — direct live invocation battery; see per-feature file) | run `node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` → live Claude adapter invocation against a genuine ephemeral-comment fixture → live kill-switch invocation → live dynamic import of the real OpenCode plugin module → adversarial outside-project-root invocation | every unit test passes with `fail 0`; live Claude adapter prints `COMMENT HYGIENE WARNING` banner, exit `0`; kill-switch invocation empty stdout, exit `0`; OpenCode plugin surfaces exactly one `system` entry via `experimental.chat.system.transform` with zero terminal writes; outside-root path resolves to `[]` (no finding) | inline command output captured in the per-feature file's EVIDENCE section (unit-test tail, live adapter stdout, kill-switch stdout, OpenCode plugin JSON output, outside-root stdout) | PASS iff the unit suite is fully green AND the live Claude adapter invocation prints the banner with exit 0 AND the kill-switch and outside-root cases both produce empty output AND the live OpenCode plugin import surfaces the buffered finding with zero terminal writes | If the banner is missing, verify the fixture comment matches a `VIOLATION_PATTERN` in `check-comment-hygiene.sh`; if the kill-switch fails to suppress, verify `SK_CODE_POST_EDIT_QUALITY_DISABLED` is read by both adapters before dispatch; if outside-root still dispatches, verify `relativeSegments()` in `post-edit-router.cjs` |

Per-feature files: see `plugins-and-hooks/`.

---

## 14. DOCTOR COMMANDS (`DOC-382..DOC-383`, `DOC-392..DOC-395`)
This category validates the `/doctor:sk-code` setup battery, the read-only check that reports whether the sk-code surface can route end to end, the `quality` target that shows, checks and once creates the repository quality config, and the three `/doctor:ci` routes for GitHub Actions workflows: the read-only report, the scaffold that writes a new workflow only after a yes, and the toggle that flips one `SKILLED_CI` switch only after a yes. The six scenarios here are deterministic checks against the real stdout and exit-code contracts of those commands, not routing decisions. Category notes: [doctor-commands/README.md](doctor-commands/README.md).

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `DOC-382` | Doctor sk-code setup | Verify the setup battery maps its exit codes to the documented statuses and writes nothing it does not remove | `Run the doctor sk-code setup check and tell me whether the sk-code surface passes its setup battery.` | run `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` in the current-code environment → repeat with `--prompt=<text>` → run with `--bogus` → add a nested graph-metadata.json and rerun → remove the probe file → run with `SPECKIT_COMPILED_ROUTING=0` | exit 0 prints nine PASS lines and `STATUS=OK legs=9`, the prompt flag reaches the probe line, `--bogus` prints the usage line and exits 2, the nested metadata run exits 1 with `STATUS=FAIL failed=1 skipped=0` and the kill-switch run exits 1 with `STATUS=FAIL failed=2 skipped=0` because the probe and quality legs both fail, each failure with a `repair:` line | `/tmp/skc-DOC382-clean.txt`, `/tmp/skc-DOC382-prompt.txt`, `/tmp/skc-DOC382-usage.txt`, `/tmp/skc-DOC382-probe-fail.txt`, `/tmp/skc-DOC382-kill-switch.txt`, and `git status --porcelain` after every step | PASS iff the clean run exits 0 with `STATUS=OK legs=9`, the prompt flag reaches the probe line, the bad argument exits 2 with the usage line, both failure runs exit 1 with their named repair lines, and the tree is clean again after step 8 | If a leg fails on a clean tree, run the `repair:` line the battery printed under that leg. If the probe serves the legacy stub with the flag unset, run the manifest refresh and copy commands the repair line names. If `git status --porcelain` still lists `graph-metadata.json`, step 8 did not run |
| `DOC-383` | Doctor sk-code on a pre-v4 checkout | Verify the battery on a checkout without the v4 tree runs no leg and fails provisioning with the v4-layout repair | `Run the doctor sk-code setup check in a checkout that predates the v4 layout and tell me what it reports.` | shallow-clone `v3.6.0.0` into a `mktemp -d` dir → confirm `.skilled` is absent → copy the command, assets and script into `.opencode/commands/doctor/` → commit the baseline with a throwaway identity → run `node .opencode/commands/doctor/scripts/sk-code-setup-check.cjs` → confirm `git status --porcelain` is empty → rerun with `SPECKIT_COMPILED_ROUTING=0` → confirm the tree is clean → `rm -rf` the temp dir | both runs exit 1 printing the provisioning FAIL with its v4-layout repair, eight SKIP lines reading `needs the v4 layout` and `STATUS=FAIL failed=1 skipped=8`, in well under a second | `/tmp/skc-DOC383-run.txt`, `/tmp/skc-DOC383-kill-switch.txt`, plus the baseline commit hash and the `rm -rf` that removes the fixture | PASS iff both runs exit 1 with `STATUS=FAIL failed=1 skipped=8`, no leg runs, no file is written outside the fixture, and the fixture directory is deleted | If a leg runs, confirm the fixture lacks `.skilled/skills/sk-code/SKILL.md`. If the clone cannot reach GitHub, record `SKIP`. If the temp dir survives, delete it before the next scenario |
| `DOC-392` | Doctor CI report | Verify the read-only CI report reads every workflow file, returns an empty error list on a clean tree, reads every switch variable as unknown offline, honours `--sha` and `--profile`, shows its startup menu for `list`, rejects a bad argument with exit 2 and writes nothing | `Run the doctor CI report and tell me which GitHub Actions workflows have a switch off.` | count the `.yml` files under `.github/workflows/` → run `node .skilled/commands/doctor/scripts/ci-report.cjs --no-gh --json` → run it with `--sha=notasha` → run it with a pinned 40-hex `--sha` → run it with `--profile` naming a fixture copy of the CI profile → run `--bogus` → run `/doctor:ci report --no-gh` and `/doctor:ci list` in the runtime → confirm `git status --porcelain` is empty after each step | the JSON run exits 0 with the keys `repoRoot`, `profile`, `workflowCount`, `variables`, `newestNonRebuildSha`, `newestNonRebuildReason`, `notChecked`, `errors` and `workflows`, `workflowCount` equals the file count, `errors` is empty, the six variables read `unknown`; `--sha=notasha` exits 2 with `ERROR: --sha needs 40 lowercase hex characters`; a valid `--sha` exits 0 with `newestNonRebuildSha` equal to it and `newestNonRebuildReason` reading `given by --sha`; `--profile` moves `profile.path` to the fixture; `--bogus` exits 2 with the usage line; `list` prints the startup menu and loads no workflow | the captured JSON for each run, the stderr and exit code of the bad-argument runs, the route and menu output, and the `git status --porcelain` output after each step | PASS iff the JSON run exits 0 with an empty `errors` list and a `workflowCount` equal to the file count, the malformed `--sha` exits 2 with its message, the valid `--sha` round-trips into `newestNonRebuildSha`, `--profile` moves `profile.path`, `--bogus` exits 2, `list` prints the menu without a workflow table, and no step writes a file | If `errors` is not empty, the named workflow failed to parse, so fix that file and rerun. If the count differs from the file count, compare the `workflows` file names with the directory listing. If `--profile` leaves `profile.path` unchanged, check that the fixture path exists and parses |
| `DOC-393` | Doctor CI scaffold | Verify the scaffold prints its plan and the whole proposed workflow under `--dry-run`, treats a no answer as a cancellation, and refuses a protected, existing or malformed target without writing a file | `Scaffold a new CI workflow called probe-check.yml and show me the file before you write anything.` | confirm no workflow named `probe-check.yml` exists → run `/doctor:ci scaffold --name=probe-check.yml --dry-run` → run `/doctor:ci scaffold --name=probe-check.yml` and answer no → run it with the name of an existing non-protected workflow → run it with a protected name → run it with `Probe_Check.yml` → confirm `git status --porcelain` is empty after each step | the dry run prints `WORKFLOW SCAFFOLD PLAN`, both template paths, the switch group, the timeout and the whole file, ends with `Dry run: nothing was written.` and asks no question; the no answer ends with `STATUS=CANCELLED ACTION=cancelled`; the existing name prints `REFUSE: the target path already exists; scaffold creates new workflows only`; a protected name prints `REFUSE: <name> is a protected workflow` even when that file exists; `Probe_Check.yml` prints `REFUSE: Probe_Check.yml is not a bare lowercase hyphen-case name ending in .yml`; each refusal ends `STATUS=FAIL ERROR="refused"` with no plan | the dry-run output, the no-answer output, the refusal output for all three names and the `git status --porcelain` output after each step | PASS iff the dry run prints the plan and the whole file, the no answer is cancelled, each refused name prints its own `REFUSE:` line without a plan, and no step creates or changes a file | If a dry run writes a file, read `phase_4_plan_and_approval` in `doctor-ci-scaffold.yaml`. If a protected name reports the existing-path refusal, read `phase_2_resolve_target`: the protected list is checked before the filesystem. Remove any file a failed run created |
| `DOC-394` | Doctor CI toggle | Verify the toggle prints the `SKILLED_CI` switch plan, the protected workflows it stops and the approval prompt, changes nothing on a no answer, refuses a variable that is not a switch and, with `gh` authenticated, sets then clears `SKILLED_CI_REPORTS` | `Turn the SKILLED_CI_REPORTS switch off for now, show me the command first, then turn it back on.` | confirm `SKILLED_CI_REPORTS` is unset → run `/doctor:ci toggle --variable=SKILLED_CI_REPORTS --state=off` and answer no → run it with `--variable=SKILLED_CI_BOGUS` → where `gh` is authenticated, run the off change with yes, run `/doctor:ci report` without `--no-gh`, run `--state=on` with yes and rerun the report → confirm the variable is unset and `git status --porcelain` is empty | the plan shows `Command: gh variable set SKILLED_CI_REPORTS --body off` and `Run this command? [yes/no]`, the no answer ends with `STATUS=CANCELLED ACTION=cancelled`, the bogus name prints `REFUSE: SKILLED_CI_BOGUS is not a documented switch`, the yes run reads the variable back as off and the report shows the reports switch off, the `--state=on` run runs `gh variable delete SKILLED_CI_REPORTS` and the variable ends absent | the plan and result output for each run, `gh variable list` after each change, the report row before and after, and the final `git status --porcelain` output | PASS iff the plan and prompt print, the no answer changes nothing, the undocumented name is refused without a plan and, with `gh` authenticated, the variable is set, reported off, deleted and unset at the end. Record `SKIP` for the round trip alone when `gh` is unauthenticated | If the no answer changed the variable, read `phase_3_refuse_or_plan` in `doctor-ci-toggle.yaml`. If the report reads `unknown`, run `gh auth status`. If a failed step left the variable set, run `gh variable delete SKILLED_CI_REPORTS` |
| `DOC-395` | Doctor sk-code quality | Verify the `quality` target reports the config source, its trust state and the applied rules read-only, refuses an existing config with `CONFIG_EXISTS`, and creates the config only after an approved plan | `Run the doctor sk-code quality check and tell me which quality config this repo reads and whether it is valid.` | run `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs status --json` → run `... check --json` → run `... init --json` → run `... init --apply --json` → run `check --json` again → confirm `git status --porcelain` is empty after every step; repeat in a scratch repository with no config to see the plan path | `status` exits 0 ending `STATUS=OK SOURCE="repo" TRUST=trusted` with the `applies` block listing each checklist, its seats and its override rows; `check` exits 0 ending `STATUS=OK SOURCE="repo" TRUST=trusted ERRORS=0`; with a config present `init` exits 1 ending `STATUS=FAIL MODE=DRY_RUN ERROR=CONFIG_EXISTS` and writes nothing; `init --apply` against an existing config exits 1 ending `STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS`; in a repository with no config `status` ends `STATUS=OK SOURCE="none" TRUST=none` and `init` ends `STATUS=OK MODE=DRY_RUN` with the suggested checks and, with no `specs/` folder, a `suggested_hygiene` list of rule names it does not write | the `status` JSON and its last line, the `check` last lines and exit codes, the `init` last line and exit code for both the existing and the absent config, and the `git status --porcelain` output after every step | PASS iff `status` and `check` report the config source and an empty `errors` list read-only, `init` refuses an existing config with `CONFIG_EXISTS` at exit 1 without writing, and in a repository with no config `init` prints its plan at exit 0 and writes only when `--apply` runs | If `status` reports `TRUST=untrusted`, compare the repository field with the checkout's own identity. If `init` writes when a config exists, read `phase_4_apply_and_check` in `doctor-sk-code-quality.yaml`. Delete any `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` a failed run created |

Per-feature files: see `doctor-commands/`.

---

## 15. AUTOMATED TEST CROSS-REFERENCE
The sk-code skill, plus the doctor scripts its scenarios drive, ship these automated tests. The Covers column names what each suite proves and the Overlaps column names the scenario that exercises the same behavior by hand:

| Suite | Runner | Covers | Overlaps |
|---|---|---|---|
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/check-comment-hygiene.test.sh` | bash | One `run_case` per checker input, covering the violation classes, the allowed-pattern short circuits, the `hygiene-ok` escape and the exclusion paths of `check-comment-hygiene.sh` | TH-002, which additionally proves the hook banner and the warn-only exit |
| `.skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh` | bash | The legacy PostToolUse hook's branches, including both checker calls and the always-exit-0 contract | TH-001 and TH-002 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/ceiling-report.test.sh` | bash | The `ceiling:` report the hygiene path emits | DR-003 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh` | bash | The `--disable-rule` flag spellings the hook and CI job read | none |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-hygiene.test.cjs` | `node --test` | The named hygiene fixtures, the secret redaction and the checker's config faults | CQ-002 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-surfaces.test.cjs` | `node --test` | The quality gate's scopes, surface by surface, with the shebang dispatch and the no-git fallback | CQ-003, CQ-004 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-outside-skills.test.cjs` | `node --test` | The outside-skill row faults, both refusals and the scoped-fault warning | CQ-005, CQ-010 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-layers-and-generated.test.cjs` | `node --test` | The layer probe's hook spellings and a repository's generated rows | CQ-017 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-dist.test.cjs` | `node --test` | The dist adapter and the four states it reads | CQ-014 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-explain-and-overrides.test.cjs` | `node --test` | The multi-file explain output and the override pass with its refusal, recording and conflict cases | CQ-012, CQ-013, CQ-021 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-runner-units.test.cjs` | `node --test` | The flags, the envelope, the scope listing, the exit-code precedence and the guard boundary | CQ-018 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config-discovery.test.cjs` | `node --test` | Config discovery, one case per source, and the legacy-path refusal | DOC-395 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config-validation.test.cjs` | `node --test` | The config schema, its error list and the merge rule | DOC-395 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config-hygiene.test.cjs` | `node --test` | The hygiene values a config may not carry, and the `disableRules` cases | CQ-012, CQ-013 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config-help.test.cjs` | `node --test` | `--help` and `-h` printing the usage | none |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks-outcomes.test.cjs` | `node --test` | A configured run's outcomes: an absent tool, a failing check, a mutated workspace and the suggestion lane | CQ-006, CQ-020 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks-trust.test.cjs` | `node --test` | The trust states a committed check resolves to, and the one-time grant | CQ-009 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks-execution.test.cjs` | `node --test` | A configured command's argv execution inside the workspace guard, the timeout kill and the package-folded cwd | CQ-020 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs` | `node --test` | The bounded parallel node-check runner | none |
| `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh` | bash | Rule-table copies staying identical across the review packet | none |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_stack_folders.py` | pytest | Every known language resolving to an on-disk references folder, and an orphan folder being flagged | DR-004 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` | pytest | The SKILLED alignment verifier | none |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/run-all-drift-guards.test.cjs` | `node --test` | The drift-guard runner and its per-guard exit handling | none |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs` | `node --test` | The stage-two resource map the language rows come from | LS-001..LS-006, which additionally grade a live route |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` | `node --test` | `mode-registry.json` `surfaceDetection` blocks against the detection order | SD-002, SD-003 |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs` | `node --test` | The checklist each language folder maps to | LS-005, LS-006 |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs` | `node --test` | Documented claims in the packet against the tree | none |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | `node --test` | Served router copies matching their authored closure | none |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs` | `node --test` | The same sync check's git timeout path | none |
| `.skilled/skills/sk-code/shared/scripts/tests/rule-registry.test.cjs` | `node --test` | The shared rule registry and its ids | none |
| `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` | `node --test` | The `## Rule overrides` linter and the hard floor | none |
| `.skilled/skills/sk-code/shared/scripts/tests/review-lens-overrides.test.cjs` | `node --test` | Lens rules applied, replaced and conflicting at one level | DR-003 |
| `.skilled/skills/sk-code/shared/scripts/tests/repository-identity.test.cjs` | `node --test` | The repository field a config is scoped to | DOC-395 |
| `.skilled/skills/sk-code/benchmark/scripts/tests/render-report.test.cjs` | `node --test` | The benchmark report renderer | LS-005, whose prompt targets this file |
| `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | `node --test` | The shared post-edit quality core, both adapters, the kill-switch and the outside-root guard | `post-edit-quality-router` |
| `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` | `node --test` | The nine setup legs, their verdicts and their repair lines | DOC-382, DOC-383 |
| `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` | `node --test` | The `status`, `check` and `init` modes and the one-time write | DOC-395 |
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | `node --test` | The CI report's JSON contract and its argument handling | DOC-392 |

Behavior the manual playbook alone covers:
- Surface detection routing decisions (SD-002, SD-003): the automation proves the declared blocks against the detection order, not what a live route resolves for a given prompt.
- Language sub-detection within SKILLED (LS-001..LS-006): the automation proves the maps, not the load set a live route produces.
- Advisor anti-pattern routing (RD-002) and end-to-end advisor probe accuracy (SA-001).
- Design restraint behaviors: ladder rung selection, the anti-stall response shape and the `ceiling:` convention's live pass through the hygiene gate (DR-001, DR-002, DR-003). DR-004 wraps the deterministic `verify_stack_folders.py` check, which also has its own pytest suite.
- The warn-only banner reaching stdout through the full hook on a genuinely stale or genuinely dirty file (TH-001, TH-002). The hook suites prove the branch logic with fixtures; the scenarios prove the shipped checker, the executable bit and the banner on the real path.
- The live runtime adapters behind `post-edit-quality-router`: a real OpenCode session and a real Claude Code `Write`/`Edit` tool call. The unit suite covers the same core with fixtures.

---

## 16. FEATURE CATALOG CROSS-REFERENCE INDEX
The Catalog Entry column names the feature-catalog document that owns the behavior, as a path relative to `.skilled/skills/sk-code/`. `none` marks a scenario whose behavior the catalog does not inventory: the design-restraint behaviors (DR-001, DR-002, DR-004), the dist-staleness hook wiring (TH-001) and the runtime-neutral post-edit quality router all live in references and hook code the catalog does not list as features, so no catalog entry applies to them.

| Category | Feature ID | Per-Feature File | Catalog Entry | Critical Path |
|---|---|---|---|---|
| Surface Detection | SD-002 | [surface-detection/skilled-detection.md](surface-detection/skilled-detection.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | Yes |
| Surface Detection | SD-003 | [surface-detection/unknown-fallback.md](surface-detection/unknown-fallback.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | Yes |
| Language Sub-Detection | LS-001 | [language-sub-detection/skilled-typescript.md](language-sub-detection/skilled-typescript.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | No |
| Language Sub-Detection | LS-002 | [language-sub-detection/skilled-python.md](language-sub-detection/skilled-python.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | No |
| Language Sub-Detection | LS-003 | [language-sub-detection/skilled-shell.md](language-sub-detection/skilled-shell.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | No |
| Language Sub-Detection | LS-004 | [language-sub-detection/skilled-config.md](language-sub-detection/skilled-config.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | No |
| Language Sub-Detection | LS-005 | [language-sub-detection/skilled-javascript.md](language-sub-detection/skilled-javascript.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | No |
| Language Sub-Detection | LS-006 | [language-sub-detection/skilled-rust.md](language-sub-detection/skilled-rust.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | No |
| Routing Disambiguation | RD-002 | [routing-disambiguation/skcode-vs-skdoc.md](routing-disambiguation/skcode-vs-skdoc.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | Yes |
| Skill Advisor Integration | SA-001 | [skill-advisor-integration/advisor-probe-battery.md](skill-advisor-integration/advisor-probe-battery.md) | `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | Yes |
| Design Restraint | DR-001 | [design-restraint/design-restraint-ladder.md](design-restraint/design-restraint-ladder.md) | none | No |
| Design Restraint | DR-002 | [design-restraint/implementer-anti-stall.md](design-restraint/implementer-anti-stall.md) | none | No |
| Design Restraint | DR-003 | [design-restraint/ceiling-comment-convention.md](design-restraint/ceiling-comment-convention.md) | `feature-catalog/review-calibration/review-floor-lens-and-overrides.md` | No |
| Design Restraint | DR-004 | [design-restraint/stack-folders-validator.md](design-restraint/stack-folders-validator.md) | none | No |
| Tooling And Hooks | TH-001 | [tooling-and-hooks/check-dist-staleness-hook.md](tooling-and-hooks/check-dist-staleness-hook.md) | none | No |
| Tooling And Hooks | TH-002 | [tooling-and-hooks/comment-hygiene-hook.md](tooling-and-hooks/comment-hygiene-hook.md) | `feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md` | No |
| Plugins And Hooks | `post-edit-quality-router` | [plugins-and-hooks/post-edit-quality-router.md](plugins-and-hooks/post-edit-quality-router.md) | none | No |
| Doctor Commands | DOC-382 | [doctor-commands/doctor-sk-code-setup.md](doctor-commands/doctor-sk-code-setup.md) | `feature-catalog/doctor-commands/sk-code-setup-and-quality-doctor.md` | No |
| Doctor Commands | DOC-383 | [doctor-commands/doctor-sk-code-pre-v4-checkout.md](doctor-commands/doctor-sk-code-pre-v4-checkout.md) | `feature-catalog/doctor-commands/sk-code-setup-and-quality-doctor.md` | No |
| Doctor Commands | DOC-392 | [doctor-commands/doctor-ci-report.md](doctor-commands/doctor-ci-report.md) | `feature-catalog/doctor-commands/ci-workflow-doctor-and-switches.md` | No |
| Doctor Commands | DOC-393 | [doctor-commands/doctor-ci-scaffold.md](doctor-commands/doctor-ci-scaffold.md) | `feature-catalog/doctor-commands/ci-workflow-doctor-and-switches.md` | No |
| Doctor Commands | DOC-394 | [doctor-commands/doctor-ci-toggle.md](doctor-commands/doctor-ci-toggle.md) | `feature-catalog/doctor-commands/ci-workflow-doctor-and-switches.md` | No |
| Doctor Commands | DOC-395 | [doctor-commands/doctor-sk-code-quality.md](doctor-commands/doctor-sk-code-quality.md) | `feature-catalog/doctor-commands/sk-code-setup-and-quality-doctor.md` | No |

**Operator scenarios**: 23, across the 9 operator categories, with 4 on the critical path (SD-002, SD-003, RD-002, SA-001). The package's `compiled-routing/` folder holds 8 further routing-gold files that ship their own verdict through the topology gate, so the walked tree holds 31 scenario files in total. The package validator derives these numbers at run time; this paragraph repeats them so a reader without the validator sees the same figure.
