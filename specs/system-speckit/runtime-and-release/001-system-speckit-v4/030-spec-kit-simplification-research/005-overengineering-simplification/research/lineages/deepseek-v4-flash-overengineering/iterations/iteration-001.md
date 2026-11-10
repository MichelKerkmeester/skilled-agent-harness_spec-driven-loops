# Iteration 001 — KQ-R1a: checklist.md retirement reach at the runtime and catalog level

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 1 | focus: the 011 acceptance-criteria retirement — did it reach the completion-gate runtime chain (sentinel, check-completion.sh, completion-state.cjs), the level scripts, and every catalog/reference line that describes them?
Evidence reads: `runtime/lib/hooks/completion-evidence-sentinel.cjs` (26,494 bytes, decoded; 1 stray NUL byte makes the file read as `data` — cosmetic), `runtime/cli/lib/completion-state.cjs` (head + spawn constants), `runtime/cli/spec/upgrade-level.sh` (grep), caller graphs via `grep -rln` over runtime + commands + root docs. Reads cost: 6 bash calls. No node/validate/git executed.

## What exists

- `runtime/cli/spec/check-completion.sh` — the checklist release gate — still exists in the checked-in tree (unretired by 011/012).
- `runtime/cli/lib/completion-state.cjs:31` resolves CHECK_COMPLETION_SCRIPT to it; `:141-159` spawns it (`--json`, err.stdout-on-exit-1 parse); the header comment still says "merge a spec folder's inferred level, **checklist P0/P1/P2 completion** (with evidence gaps)". Its `CANONICAL_DOC_FILENAMES` (updated `:64-72`) DOES include `acceptanceCriteria` and `decisionRecord` for level inference — half-updated: level inference speaks the new contract, checklist completion still speaks the old one.
- `runtime/lib/hooks/completion-evidence-sentinel.cjs` — the runtime completion gate fired by 5 adapters (claude/codex/cursor/devin stop hooks, pi `turn_end`, + the OpenCode plugin) — `evaluateCompletionEvidence()`: if `checklist.md` exists → `runCheckCompletion` → `verdictFromChecklistResult` (statuses EVIDENCE_MISSING / PRIORITY_CONTEXT_MISSING / P0_INCOMPLETE / P1_INCOMPLETE); else → `verdictFromImplementationSummary`: a **stat** of `implementation-summary.md` → `ok`. **The string `acceptance-criteria` occurs 0 times in the whole file; `AC_CLOSURE` 0 times.**
- `runtime/cli/spec/upgrade-level.sh` — level inference at `:338` uses `decision-record.md` only; its L1→L2 upgrade creates `acceptance-criteria.md` (`:769-782`); 0 occurrences of `checklist.md` anywhere in the file. The script already speaks the new contract.
- `runtime/cli/spec-folder/nested-changelog.ts:655` — still parses `checklist.md` items (optional read; legacy packets only).
- Doc sites still describing check-completion.sh as the gate: `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:21,39,57`, `.../completion-verification-workflow.md:6,29,33,64` (a whole feature-catalog entry titled "Completion Verification Workflow" = "the spec-kit completion gate... audits checklist.md"), `feature-catalog/feature-catalog.md:130`, `references/workflows/execution-methods.md:56-66`, `references/templates/level-specifications.md:76`, `runtime/cli/spec/README.md:64,101,151,163`.

## Findings

**F2-01 [P1 — remediation left the enforcement consumer behind] The runtime completion-evidence gate still enforces the retired checklist.md contract; acceptance-criteria closure has zero runtime enforcement.**
- Where: `runtime/lib/hooks/completion-evidence-sentinel.cjs` (evaluateCompletionEvidence; `hasChecklist` stat → `runCheckCompletion`; else `verdictFromImplementationSummary` = stat only; 0× "acceptance-criteria").
- What exists: on any completion claim, if `checklist.md` exists the sentinel gates on checklist P0/P1 completeness + evidence markers; if it is absent (the post-011 new-contract case — folder-structure.md no longer requires checklist.md and the workflows author acceptance-criteria.md), the sentinel checks only that implementation-summary.md is a file and returns `ok`.
- Cost: (a) 5 runtime adapters (claude/codex/cursor/devin/pi) + OpenCode plugin all execute this gate on every completion claim; (b) `completion-state.cjs` + `check-completion.sh` + 2 vitest suites maintain a checklist parser; (c) the post-011 "both completion gates" (tasks.md verification checklist + acceptance-criteria closure — SKILL.md:407,469,491,513) are enforced only by workflow steps agents must follow, never by the mechanical backstop — so the backstop's advertised purpose (catch claimed-done with unmet gates) no longer covers the contract it claims to enforce.
- Protects: legacy checklist.md packets only; for new-contract packets it protects nothing (impl-summary stat).
- Severity: P1 — the two contract halves now disagree in the live gate; an agent following the 011 workflow to the letter, with unmet AC rows, passes the sentinel.
- Recommendation: **merge** — make `evaluateCompletionEvidence` gate on acceptance-criteria closure (rows all Met/Waived/Superseded, or the AC_CLOSURE rule's own evidence contract) as the primary path, keep the checklist path only under an explicit legacy-compat flag; delete the checklist path + its docs once legacy packets are gone.

**F2-02 [P2 — documented gate, real but orphaned engine] check-completion.sh is described as THE completion gate in six+ surfaces yet is called by nothing except the sentinel's legacy path and completion-state.cjs.**
- Where: `runtime/cli/spec/check-completion.sh` (exists, unretired); callers = `completion-state.cjs:31` and the sentinel only; doc sites in the bullet list above; `validate.sh` mentions completion 0 times; `.opencode/commands/speckit/**` mentions check-completion 0 times (post-011).
- Cost: 2 scripts + 1 helper chain + 15+ doc lines + 2 vitest files maintained for a document the level contract retired; the feature-catalog entry "Completion Verification Workflow" (completion-verification-workflow.md:19) states the gate "decides whether a spec folder is ready to be claimed as finished" — false today for new-contract packets.
- Protects: nothing beyond F2-01's legacy path.
- Severity: P2 (consequence of F2-01; listed separately because the doc claim is independently false).
- Recommendation: **remove** — once F2-01's merge lands, delete check-completion.sh / completion-state.cjs checklist sections + the 6 doc sites (or demote all to "legacy packets" language).

**F2-03 [P2 — catalog line left behind] feature-catalog's spec-lifecycle-automation.md describes a checklist.md-based upgrade-level.sh that no longer exists.**
- Where: `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:37` ("detects the current level from explicit markers in spec.md or from the presence of checklist.md and decision-record.md … New files are introduced only when needed, such as checklist.md for Level 2") — vs the real script `runtime/cli/spec/upgrade-level.sh:9-10,212-213,338,769-782` (L1→L2 adds acceptance-criteria.md; inference via decision-record.md only; 0 checklist.md references).
- Cost: an agent reading the catalog to decide what an upgrade creates will scaffold checklist.md for a Level 2 upgrade and produce an artifact the contract no longer requires; the catalog is the index an agent consults first.
- Protects: nothing (describes a behavior that does not exist).
- Severity: P2 (document/source mismatch; the 011 remediation touched the workflows but not this catalog entry, which advertises a divergent workflow).
- Recommendation: **merge** — rewrite the line to the script's actual behavior (acceptance-criteria.md for L2, decision-record.md for L3).

**F2-04 [P2 — recorded] nested-changelog.ts still reads checklist.md for change entries.**
- Where: `runtime/cli/spec-folder/nested-changelog.ts:655` (`parseChecklistItems(readOptionalFile(checklist.md))`).
- Cost: one optional-read branch + parser for a retired doc; keeps changelog generation correct for legacy packets.
- Protects: legacy packets' changelog entries.
- Severity: P2 — legitimate legacy compatibility, but it is a consumer the 011 sweep did not enumerate (the fix's "one consumer left behind" class, benign here).
- Recommendation: **keep** (legacy-compat), with a one-line comment marking it legacy and a removal note tied to F2-02 retirement. Also: `check-completion.sh`'s own feature-catalog claim (spec-lifecycle-automation.md:37: "check-completion.sh then evaluates checklist.md as a release gate") is the same divergence class as F2-03.

## Ruled out / corrections

- Hypothesis "the sentinel might also check AC": falsified — 0 occurrences of `acceptance-criteria`/`AC_CLOSURE` in the sentinel (counted, not asserted).
- Hypothesis "check-completion.sh is wired into validate.sh": falsified — validate.sh has 0 completion mentions; the chain is sentinel ↔ completion-state only.
- The OpenCode adapter for the sentinel lives under `.opencode/plugins/` (referenced as "session.idle plugin" in comments); registration file not enumerated here — deferred to the hook-matrix iteration (run 7).

## Provisional counts (referenced, not reused — recount in this tree)

- Sentinel callers: 5 runtime adapters + 1 plugin; 2 test files reference the sentinel.
- `check-completion.sh` doc sites: 7 (4 feature-catalog/reference/README lines counted precisely above; plus spec/README.md ×4 lines, plus execution-methods.md ×3 lines).
