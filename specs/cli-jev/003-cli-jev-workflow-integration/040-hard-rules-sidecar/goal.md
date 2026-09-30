---
title: "Goal: Phase 40: hard-rules-sidecar"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hard rules sidecar goal"
  - "skill frontmatter migration goal"
  - "hard rules sidecar criteria"
  - "dispatch rule reader goal"
  - "hard rules enforcement goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar"
    last_updated_at: "2026-09-30T18:29:21Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Ticked all five criteria from the build's evidence and recorded the closure"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-040-hard-rules-sidecar"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 40: hard-rules-sidecar

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move every skill's hard rules out of SKILL.md frontmatter into a sidecar the hooks read, with enforcement unchanged.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each rule moves to `hard-rules.json` beside its SKILL.md, copied exactly. Frontmatter keeps no `hard_rules` |
| D2 | The engine stays dependency-free and fail-open: a missing or broken sidecar yields no rules, never a crash |
| D3 | Every reader and test moves in the same change. No dual read of frontmatter is left behind |
| D4 | Enforcement is proved identical: the engine's verdicts on a fixed command set per skill match before and after |
| D5 | sk-doc's frontmatter contract and skill templates say where hard rules live |
| D6 | Executors follow parent D5: DeepSeek writes, MiMo reviews, no Claude workers. Fix P0 and P1, record P2 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The nine skills each have `hard-rules.json`, and a grep for `^hard_rules:` in any SKILL.md finds nothing
- [x] The dispatch engine, the four runtime preflight adapters and both sk-git scripts read the sidecar, and their suites pass
- [x] A recorded before-and-after run of the engine over a fixed command set gives identical verdicts for every skill
- [x] sk-doc's frontmatter contract names the sidecar, and `validate_document.py` is VALID on every changed doc
- [x] `sync-skills-hermes.cjs --check` passes, and `validate.sh --strict` passes for this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec authored | Done | 2026-09-30, docs only, from `scratch/context/context.md` and the operator's "Move rules out of frontmatter". Status Planned, Level 2, priority P1. No build exists |
| Build | Done | Batches 2 to 5 landed as one change in the working tree at start HEAD `b3964f2a3f`: the engine reads the sibling sidecar, `stripQuotes` and `parseHardRules` are deleted, the nine `hard-rules.json` files are emitted from the before snapshots (never retyped), the nine SKILL.md frontmatter blocks lose the key, and the tests that read a SKILL.md move. Batch 6 the docs through sk-doc, batch 7 the Hermes sync (10 of 72 copies written, 0 pruned) and the manifest refresh for cli-classifier, cli-external-orchestration and sk-doc, batch 8 the after verdicts and the comparison |
| Review | Done | MiMo v2.6 Pro at high, `scratch/verify/review-mimo-r1.txt`: `VERDICT: PASS` with all five criteria met. It re-ran HEAD's own parser over the nine HEAD SKILL.md files and matched all 50 rules byte for byte, reproduced all 47 corpus rows live and checked every fail-open case. Two P2s, both fixed: the `evaluate` JSDoc named the old field, and the recorder hardcoded a session scratchpad path |
| Gates | Done | `scratch/verify/`: `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` prints nothing at exit 1; `compare.txt` nine `equal <skill> <n> rows` lines at exit 0; `s1.txt` to `s5.txt` 20 + 75 + 26 + 7 + 7 = 135 passed and 0 failed, equal to `baseline-suites.txt`; `h2.txt` `PASS: 72 Hermes skill copies in sync`; `g2.txt` all seven hubs fresh and `df.txt` derived metadata 15 of 15 fresh; the live hook smoke denied a bad dispatch and passed a compliant one (`hook-smoke-jev.txt`) |
| Closure | Done | This pass: all five criteria ticked, `repair-derived.cjs --apply`, `validate.sh --strict` `RESULT: PASSED`, `check-goal.cjs` `RESULT: PASSED (5/5 checks)` |

### Deviations and findings

| Item | Note |
|------|------|
| Planned state (2026-09-30) | At authoring, nothing is built and the five completion criteria are open. The six open questions in `spec.md` section 10 each carry a proposed answer, and the sidecar contract in `spec.md` section 4 is fixed at spec approval, before any code write |
| Operator basis | The operator asked on 2026-09-30: "you have hard rules in skill frontmatter? Thats not supported or something we should do", then chose "Move rules out of frontmatter": "Put the rules in each SKILL.md body or a sidecar file and change the hook to read them there. This is larger and touches sk-git and 7 cli-* skills outside this packet." The session chose the sidecar because the engine is dependency-free and fail-open and JSON parses without a YAML or markdown parser |
| Reader inventory (observed 2026-09-30) | A read of this tree counts nine SKILL.md files with `hard_rules:` and 50 rules across them, 10 reader files and five test files that pass a SKILL.md path to `readHardRules` or assert on its frontmatter text. `spec.md` section 3 lists each with its line. The criterion above names the engine, the four preflight adapters and both sk-git scripts, and the inventory is wider by the two OpenCode plugin copies, the pi twin of the sk-git advisory and the devin permission policy |
| Hermes copies | `sync-skills-hermes.cjs` walks `.skilled/skills` and matches `entry.name === 'SKILL.md'` at `:61`, so a sidecar is not copied today, and `.hermes/skills/sk-git/SKILL.md` still holds the old `hard_rules` block. Whether a Hermes copy needs the sidecar is the design's to decide and record. This corrects the context's UNKNOWN to an observed sync behavior, with the reader question still open |
| Phase 039 dependency | This phase's predecessor renames `cli-classifier/cli-usage` to `cli-classifier/cli-jev` and runs first. 039 is still a Draft scaffold in this tree, and the registry's cli-classifier row reads `packetPath: 'cli-classifier/cli-usage'`. The design reads the post-039 path before creating that sidecar |
| Out of scope | Changing any rule's meaning, id, check or severity, adding a rule, the unrelated `hardRules` field in `sk-design`, and adding a dependency (D1, D2, REQ-008) |
| Batch grouping (2026-09-30) | The design listed eight batches. Batches 2 to 5 landed as one change, because the engine can read the sidecar only once the nine sidecars exist: the engine and its suite, the reader and adapter wording, the nine sidecars and frontmatter removals, and the tests that read a SKILL.md. Batch 6 the docs, batch 7 the Hermes sync, batch 8 the after verdicts. No batch was dropped |
| Reader inventory wider than the context (2026-09-30) | The design found 12 files that reach `readHardRules`, 6 of them missed by `scratch/context/context.md`: the pi preflight adapter, both OpenCode plugin copies, the sk-git pi twin, the devin permission policy and `git-rule-checks.test.mjs`. Every row was reconciled, the ten files that pass a `…/SKILL.md` path kept their argument, and `dispatch-audit.mjs` and `sync-skills-hermes.cjs` are recorded as non-readers (`scratch/w4-build/design.md` section 1) |
| Hermes copies carry no sidecar (2026-09-30) | Resolves the authoring row: `.hermes/skills/` holds no `readHardRules` caller and `sync-skills-hermes.cjs` matches `entry.name === 'SKILL.md'` only at `:61`, so no sidecar is copied. The ten `.hermes/skills/` copies were still regenerated for the frontmatter change, and `--check` prints `PASS: 72` (`scratch/verify/h2.txt`; `scratch/w4-build/design.md` section 1) |
| sk-git is not a parent hub (2026-09-30) | `parent-skill-check.cjs .skilled/skills/sk-git` fails five hub invariants because sk-git has no mode registry, router or description. The check is not applicable to sk-git and the failure is unchanged by this phase (`scratch/verify/session-evidence.md`) |
| Review P2s fixed (2026-09-30) | Both P2 findings were fixed in the session rather than recorded: `evaluate`'s JSDoc named the deleted frontmatter field, and the scratch recorder hardcoded a session scratchpad path (now `fs.mkdtempSync` under `os.tmpdir()`), so the recordings run on any host (`scratch/verify/session-evidence.md`, fix after review) |
| Sidecar emitted from snapshots (2026-09-30) | The nine sidecars were emitted from the before rule snapshots with `JSON.stringify(rules, null, 2)`, never retyped, so the 16 messages carrying non-ASCII characters and the quoted apostrophes survive field for field (`scratch/w4-build/design.md` section 3; `scratch/verify/review-mimo-r1.txt`) |
| Two checklist rows stay open (2026-09-30) | `CHK-022` and `CHK-FIX-004` keep their symlinked-SKILL.md-path clause open: the four sidecar failure shapes, the folder argument, the non-string, the unimplemented `check` id and the no-rule rows are covered, but no test resolves a SKILL.md through a symlinked directory, the case `plan.md`'s FIX ADDENDUM names. The design's fixed test list does not carry the case |
<!-- /ANCHOR:log -->

---
