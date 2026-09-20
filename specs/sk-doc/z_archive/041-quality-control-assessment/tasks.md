---
title: "Tasks: sk-create-quality-control integration, utilisation and usefulness"
description: "Ordered tasks: enumerate the routing surfaces, replay real requests, classify consumers, measure size, capture the baseline, repair what execution proves broken, then re-run every gate and every command."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "quality control assessment tasks"
  - "doc quality mode audit tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/041-quality-control-assessment"
    last_updated_at: "2026-08-31T20:05:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; every documented command executes and every cross-reference resolves"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-quality-control/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/workflow-examples.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/changelog/v1.0.2.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-31-sk-doc-041"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-create-quality-control integration, utilisation and usefulness

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Assessment

- [x] T-001 Enumerate the mode across every routing surface. Evidence: present in `mode-registry.json` (12 aliases, `command: /doc:quality`), `hub-router.json` `routerSignals` at weight 4 with two vocabulary classes, `routerPolicy.tieBreak`, the hub's only `bundleRules` entry, `ROUTER.md` `INTENT_SIGNALS` owning `DOC_QUALITY` and `OPTIMIZATION`, `RESOURCE_MAP` under both plus `FULL_INVENTORY`, `leaf-manifest.json` with 11 leaves, `leaf-aliases.json` holding 5 of the hub's 6 aliases, two compiled-routing canary cases, and 7 manual-testing-playbook scenarios.
- [x] T-002 Replay real request strings through the router. Evidence: 17 probes through `router-replay.cjs --skill .opencode/skills/sk-doc`, captured in `scratch/baseline/router-replay.txt`. Four probes score 8, four score 4 on a single bare verb, three return `ambiguous-multi-axis` ties against the mode that owns the artifact, and "validate the command template" scores 4 against `sk-create-command`'s 3.
- [x] T-003 Verify the leaf manifest resolves. Evidence: 5 of the 11 declared leaves do not exist inside the packet; all 5 resolve through `leaf-aliases.json` into `shared/`. Not a defect. `sk-create-changelog` has the same shape for one leaf.
- [x] T-004 Find real consumers and classify each. Evidence: live route citations in `sk-create-diff/SKILL.md` "When NOT to Use", `sk-create-agent`, `sk-create-feature-catalog` and `sk-create-manual-testing-playbook` reference maps, `sk-create-skill` creation workflow, and three `shared/references/` standards. Test fixtures in `leaf-resource-contract.test.cjs` and the compiled-routing `registry-compiler.cjs`. Benchmark reports and playbook scenarios counted separately and not as utilisation.
- [x] T-005 Check the declared command surface in every runtime. Evidence: no `.opencode/commands/doc/` directory; no mirror in `.claude`, `.cursor`, `.codex`, `.pi` or `.devin`; all twelve siblings have a `/create:*` file. Confirmed as a tracked dead binding by the single `ALLOWLIST` entry in `system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts`.
- [x] T-006 Trace the four shared scripts to every caller. Evidence: 16 `.opencode/commands/create/assets/*.yaml` files already run `extract_structure.py` and `validate_document.py` inline as the authoring gate; `sk-code-obsidian` and `sk-code-mobile-cli` `references/quality/doc-quality-gate.md` call the scorer directly with a DQI floor of 70. The packet re-implements none of them.
- [x] T-007 Measure all twelve mode packets. Evidence: 73,804 bytes across 12 files, second smallest of twelve, against `sk-create-diagram` at 1,502,397 and `sk-create-changelog` at 64,792.
- [x] T-008 Run the hub vocabulary sync. Evidence: `verdict: VOCAB-DRIFT`, `score: 0`, `triggerPhraseCoverage: 0.714`, 46 `phantomTypedKeywords` of which 12 belong to this mode. Output in `scratch/baseline/vocab-sync.json`. Hub-wide, not mode-local; recorded, not acted on.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Baseline

- [x] T-009 Capture the baseline before any edit. Evidence: `scratch/baseline/packet-baseline.txt` holds per-file byte sizes, per-file DQI and band, per-file `validate_document.py` exit status and the `quick_validate.py` result. Every file passed. No stash used; the tree is shared with concurrent streams.
- [x] T-010 Reproduce the failure with a negative control. Evidence: `python ../shared/scripts/extract_structure.py <file>`, copied verbatim from `SKILL.md` line 157, returns `(eval):3: command not found: python`. `command -v python` reports nothing; `python3` is at `/usr/bin/python3`. This packet was the only one of the twelve still on the bare `python` form; the other eleven use `python3`.
- [x] T-011 Establish `quick_validate.py`'s real argument contract by running it. Evidence: `--help` states "Quick validator for SKILL.md frontmatter and structure" and takes a `skill_directory` positional. Against a file path it prints `SKILL.md not found`; against the packet directory it prints `Skill is valid!`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Repair

- [x] T-012 Correct the interpreter and the script paths. Evidence: 18 invocations across `SKILL.md`, `README.md`, `references/workflows.md`, `references/validation-and-enforcement.md` and `references/workflow-examples.md` moved from `python` to `python3`, and from `../shared/scripts/` to `.opencode/skills/sk-doc/shared/scripts/`, matching the form `README.md` and all eleven sibling packets already use.
- [x] T-013 Restore the historical changelog entry the sweep touched. Evidence: the substitution rewrote one sentence inside `changelog/v1.0.0.0.md`, a historical record. Restored by hand rather than by `git checkout`, since the tree is shared. `git diff --stat` on `changelog/` is empty against the committed state.
- [x] T-014 Make `references/workflow-examples.md` runnable. Evidence: Example 1 changed directory out of the repository root before using paths relative to it; the batch recipe fed every directory under `.opencode/skills/` to a validator that needs a `SKILL.md`; the spec example used `specs/042/spec.md`, a folder shape the spec tree does not use. All three replaced with recipes that were executed before being written down.
- [x] T-015 Correct the two false claims about `quick_validate.py`. Evidence: `SKILL.md` §4 Step 6 said to run it "for the file"; `references/validation-and-enforcement.md` described its action as validating authored names against lowercase kebab-case. Both replaced with what T-011 established, and the filename-case check split out to `check_authored_name_kebab.py` where it belongs.
- [x] T-016 Fix the seven `SKILL.md` section cross-references. Evidence: root cause is recorded in the packet's own `changelog/v1.0.1.0.md`, which renumbered the `SKILL.md` H2 sections from 2-7 to 3-8 and stated no cross-reference depended on the old numbers. True of the file, false of its five siblings. Every wrong reference was off by exactly `+1`. Now `workflows.md` §3 Step 1, `optimization.md` §4 and §4 Step 3, `transformation-patterns.md` §4 Step 3, `validation-and-enforcement.md` §3-§5 and §5, `workflow-examples.md` §3.
- [x] T-017 Collapse the two competing execution-mode vocabularies into one. Evidence: `references/workflows.md` is a routed leaf for the hub's `DOC_QUALITY` intent and named the modes script-assisted review, structure checks, content optimization and audit snapshot, while `SKILL.md` §3 Step 1 named them report-only audit, structure validation, content optimization and batch snapshot. `workflows.md` now uses the `SKILL.md` names, and its mode-selection bullets follow.
- [x] T-018 Remove the stale "Mode 1" labelling. Evidence: three reference titles carried a pre-packet numbered-mode scheme that `workflows.md` itself describes as replaced by `sk-doc` packets. Zero occurrences remain.
- [x] T-019 Stop asserting a command that cannot be typed. Evidence: `SKILL.md` opened with "This packet is invoked by `/doc:quality`" and `README.md` step 1 read "Run `/doc:quality`"; the invoke-with row and a `references/README.md` sentence made the same claim. All four now describe hub routing and name `/doc:quality` as a reserved-but-unbuilt binding. The trigger vocabulary is unchanged, so routing is unaffected.
- [x] T-020 Record the release. Evidence: `changelog/v1.0.2.0.md` written and `validate_document.py --type changelog` exit 0 at DQI 86; `SKILL.md` frontmatter version moved from `1.0.1.1` to `1.0.2.0`, which the frontmatter-versioning standard defines as the anchor of record when the changelog is more current.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [x] T-021 Execute every documented invocation verbatim with real arguments. Evidence: `scratch/post-fix-command-proof.txt`. Seven distinct commands, all exit 0: `extract_structure.py`, `validate_document.py` bare and with `--type readme`, `quick_validate.py` bare and `--json`, `check_authored_name_kebab.py`, and the `SKDOC_ENFORCE_STRUCTURE=0` opt-out form.
- [x] T-022 Execute the corrected batch recipe. Evidence: ran over the real skill tree, 14 skill roots, 0 nonzero exits.
- [x] T-023 Re-run the full gate sweep and diff against the baseline. Evidence: `scratch/after.txt`. Every `validate_document.py` exit 0 across all 12 files; `quick_validate.py` on the packet exit 0; DQI unchanged or improved on every file, with `workflow-examples.md` 87 to 89 and `references/README.md` 82 to 83, and nothing regressed. `check-frontmatter-versions.sh --skill sk-doc` reports 279 files, ok=278, skip-no-frontmatter=1.
- [x] T-024 Read the whole packet diff for collateral damage. Evidence: 8 modified files, 72 insertions, 70 deletions, plus 1 new changelog. The only unintended change found was the `changelog/v1.0.0.0.md` sentence, fixed in T-013. Four added lines carry an em dash, all of them pre-existing prose on lines where only a section number changed; no em dash was newly authored.
- [x] T-025 Confirm no file outside the packet or this spec folder was touched. Evidence: `git status --porcelain` scoped to the packet lists exactly the 8 modified files and the 1 new changelog. No `sk-doc` hub-root file, no `shared/` file, no other stream's file.
- [x] T-026 Validate this spec folder. Evidence: `NODE_PRESERVE_SYMLINKS=1 validate.sh specs/sk-doc/041-quality-control-assessment --strict` reporting `RESULT: PASSED`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- The recommendation is stated with the measurements behind it, and implemented: keep the mode at its current scope and size, repair its executable surface.
- Every documented command executes; every cross-reference resolves; no gate regressed.
- Hub-root changes required by the recommendation: none. Three items recorded for the streams that own those files.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Findings and recommendation: `spec.md` §6 and §7.
- Approach, testing strategy and rollback: `plan.md`.
- Evidence: `scratch/baseline/` and `scratch/post-fix-command-proof.txt`.
- Packet under assessment: `.opencode/skills/sk-doc/sk-create-quality-control/`.
<!-- /ANCHOR:cross-refs -->
