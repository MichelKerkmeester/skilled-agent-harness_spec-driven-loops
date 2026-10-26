---
title: "Acceptance Criteria: Phase 5: consumers-and-routing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "consumers and routing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/005-consumers-and-routing"
    last_updated_at: "2026-10-26T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed every criterion with the output its Verification cell printed"
    next_safe_action: "Hand the phase to the conductor for the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-consumers-and-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The stage-one CI canary question is answered: stage one stays single, stage two carries CI_WORKFLOW, so AC-018 closes as a waiver that the operator confirmed on 2026-10-26"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 5: consumers-and-routing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/005-consumers-and-routing
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver | Evidence |
|-------|-----|---------------------|--------------|--------|--------|----------|
| AC-001 | REQ-001 | Given the verify loop, When step 2 is read, Then it names the run-verdict fields and the readers that phase 004 wrote | `rg -n 'checker_outputs' .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line inside step 2 | Met | - | Evidence 2026-10-26: the `rg` printed one line at `56:`, the step 2 line, exit 0 |
| AC-002 | REQ-002 | Given the @code workflow, When its numbered steps are read, Then QUALITY is step 5, VERIFY is step 6 and RETURN is step 7 | `rg -n '^[5-7]\. \*\*(QUALITY\|VERIFY\|RETURN)\*\*' .skilled/agents/code.md` prints three lines numbered 5, 6 and 7 | Met | - | Evidence 2026-10-26: the `rg` printed three lines at `68:`, `69:` and `70:`, numbered 5, 6 and 7 in that order, exit 0 |
| AC-003 | REQ-002 | Given the @code RETURN body, When it is read, Then it carries a `Quality Gate` field | `rg -n 'Quality Gate:' .skilled/agents/code.md` prints one line inside the RETURN body | Met | - | Evidence 2026-10-26: the `rg` printed one line at `308:`, the Quality Gate field in the RETURN body, exit 0 |
| AC-004 | REQ-003 | Given an outside graph-metadata block with a malformed `quality` key, When the metadata gate runs, Then it reports `GRAPH_METADATA_INVALID_QUALITY` | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs --test-name-pattern quality` prints `# fail 0` | Met | - | Evidence 2026-10-26: the test printed `tests 1`, `pass 1` and `fail 0`, exit 0. Node 26's spec reporter prints `fail 0` where the row writes the TAP form |
| AC-005 | REQ-003 | Given a hub registry with a malformed quality row, When the registry compiler runs, Then it reports `QUALITY_DECLARATION_INVALID` | `node --test .skilled/bin/tests/quality-declaration.test.cjs` prints `# fail 0` | Met | - | Evidence 2026-10-26: the test printed `tests 8`, `pass 8` and `fail 0`, exit 0, and seven of the eight cases fail on that one code |
| AC-006 | REQ-013 | Given the phrase "apply yagni to this change", When stage two routes it, Then `surfaceIntents` contains CODE_QUALITY | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs` prints `# fail 0` | Met | - | Evidence 2026-10-26: the test printed `tests 2`, `pass 2` and `fail 0`, exit 0, and the replay printed `["CODE_QUALITY"]` |
| AC-007 | REQ-004 | Given the intent carry gate and the stage-one vocabulary, When they are checked, Then the gate passes, "comment hygiene" is carried and "simplify" is absent from `intent_signals` | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub sk-code` prints `missing=0`, and `node -p 'JSON.stringify(["comment hygiene", "simplify"].map((k) => require("./.skilled/skills/sk-code/graph-metadata.json").intent_signals.includes(k)))'` prints `[true,false]` | Met | - | Evidence 2026-10-26: the carry check printed `checked=1 hub(s), missing=0` and `RESULT: PASSED`, and the map command printed `[true,false]`, both exit 0 |
| AC-008 | REQ-005 | Given `sk-code-review/SKILL.md`, When it is searched for "quality gate", Then only the author-side line remains | `grep -n 'quality gate' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints one line numbered 43 that reads "Author-side quality gates before review" | Met | - | Evidence 2026-10-26: the `grep` printed one line at `43:`, the author-side line, exit 0 |
| AC-009 | REQ-006 | Given fixture F15, When the runner test runs, Then the envelope labels EXAMPLE and names no `local-` skill | `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs --test-name-pattern F15` prints `# fail 0` | Met | - | Evidence 2026-10-26: the run printed `tests 31`, `pass 31` and `fail 0`, exit 0. Node 26 ignores the trailing pattern after the file path, so the whole file ran, and the two F15 cases are the ones the task rows measure |
| AC-010 | REQ-007 | Given the authored and derived agent mirrors, When the mirror check runs, Then every mirror matches its canonical body | `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0 | Met | - | Evidence 2026-10-26: the check printed `11 agent(s) checked`, `all mirrors in sync` and `OK` on its one line, exit 0 |
| AC-011 | REQ-008 | Given the SKILLED entry in the registry, When its quality rows are read, Then each row points at a `sk-code-skilled` checklist | `node -p 'require("./.skilled/skills/sk-code/mode-registry.json").modes.find((m) => m.workflowMode === "sk-code-skilled").quality.checklists.map((r) => r.file).join(" ")'` prints at least six values, each beginning `sk-code-skilled/assets/checklists/`, since the registry stores each row hub-relative and the runner adds the `hub:sk-code/` prefix when it loads the rows | Met | - | Evidence 2026-10-26: the command printed 13 values, each beginning `sk-code-skilled/assets/checklists/`, exit 0 |
| AC-012 | REQ-008 | Given the sk-code-ci entry in the registry, When its quality row is read, Then it is path-only for `.github/workflows/**` | `node -p 'JSON.stringify(require("./.skilled/skills/sk-code/mode-registry.json").modes.find((m) => m.workflowMode === "sk-code-ci").quality)'` prints `{"checklists":[{"paths":[".github/workflows/**"],"file":"sk-code-ci/references/ci-workflow-standards.md"}]}`, hub-relative because the runner adds the `hub:sk-code/` prefix when it loads the row | Met | - | Evidence 2026-10-26: the command printed exactly that object, exit 0, with no detection block in the entry |
| AC-013 | REQ-009 | Given the registry aliases and the hub vocabulary, When they are read, Then each moved phrase sits in its new owner only | `node -p 'JSON.stringify(require("./.skilled/skills/sk-code/mode-registry.json").modes.map((m) => [m.workflowMode, m.aliases.filter((a) => ["alignment verifier", "stable jsonl keys"].includes(a))]))'` prints `[["sk-code-quality",[]],["sk-code-review",[]],["sk-code-skilled",["alignment verifier","stable jsonl keys"]],["sk-code-ci",[]]]`, and the hub-router vocabulary check in tasks.md T032 prints `[[],["stable jsonl keys","add set -euo pipefail","alignment verifier"]]` | Met | - | Evidence 2026-10-26: both commands printed the expected strings, exit 0 each, as T031 and T032 record |
| AC-014 | REQ-010 | Given the allowlist reason at `verify-doc-claims.cjs` line 58, When it is read, Then it names `workflow-verify` | `rg -n 'workflow-verify' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` prints line 58, and `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` prints `doc-claims: 4/4 checks passed` | Met | - | Evidence 2026-10-26: the `rg` printed one line at `58:` naming `workflow-verify.md` step 2 and the `code-quality-run/v1` verdict, and the checker printed `doc-claims: 4/4 checks passed`, both exit 0 |
| AC-015 | REQ-011 | Given the four hub version carriers, When they are compared, Then they hold one value | `node -p 'JSON.stringify([require("./.skilled/skills/sk-code/hub-router.json").version, require("./.skilled/skills/sk-code/mode-registry.json").version, require("./.skilled/skills/sk-code/description.json").version])'` prints three identical values, and `rg -n '^version:' .skilled/skills/sk-code/SKILL.md` prints `5:version: 3.7.0.0` | Met | - | Evidence 2026-10-26: the carriers printed `["3.7.0.0","3.7.0.0","3.7.0.0"]` and the `rg` printed `5:version: 3.7.0.0`, both exit 0. The tree's hub value is 3.7.0.0, and this row takes it |
| AC-016 | REQ-011 | Given the hub and the three touched packets, When their changelog folders are checked, Then each holds a real file and no symlink | `find .skilled/skills/sk-code -path '*/changelog/*' -type l` prints nothing, and `ls .skilled/skills/sk-code/changelog/v3.7.0.0.md .skilled/skills/sk-code/sk-code-review/changelog/v1.9.0.0.md .skilled/skills/sk-code/sk-code-skilled/changelog/v2.1.1.0.md .skilled/skills/sk-code/sk-code-ci/changelog/v1.1.1.0.md` lists four paths | Met | - | Evidence 2026-10-26: the `find` printed nothing with exit 0, and `ls` listed all four paths with exit 0 |
| AC-017 | REQ-012 | Given the derived metadata and the leaf manifest, When their gates run, Then no root is stale | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --format json` prints `"stale": 0`, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code` prints `leaf-manifest.json OK` | Met | - | Evidence 2026-10-26: the freshness gate printed `"stale": 0` with `"checked": 14`, and the leaf gate printed `leaf-manifest.json OK`, both exit 0 |
| AC-018 | REQ-014 | Given the CI canary prompt, When compiled routing runs at stage one, Then `selectionKind` is `surfaceBundle` with sk-code-ci as a surface | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` prints `"selectionKind":"single"` with the target `sk-code-quality` | Waived | ADR-006 | Evidence 2026-10-26: stage one printed `"selectionKind":"single"` with one target, `packetId` `sk-code-quality`, exit 0. Stage two through `routeSkillResources` returned `surfaceIntents` `["CI_WORKFLOW"]` and loaded four sk-code-ci references, `ci-workflow-standards.md`, `trigger-and-filter-rules.md`, `job-shape-rules.md` and `protected-set.md`, exit 0, so the CI standards still reach the quality run. The CI vocabulary is unchanged from the base commit. The waiver is confirmed by the operator 2026-10-26 |
| AC-019 | REQ-004 | Given the ROUTER.md CODE_QUALITY intent, When it is read, Then the restraint words and comment hygiene are present | `rg -n '"CODE_QUALITY": +\{' .skilled/skills/sk-code/ROUTER.md` prints one line that contains `yagni`, `bloat` and `comment hygiene` | Met | - | Evidence 2026-10-26: the `rg` printed one line at `242:` carrying `comment hygiene`, `restraint`, `yagni`, `simplify`, `over-engineering` and `bloat`, exit 0 |
| AC-020 | REQ-014 | Given canaries 1 and 3, When they run, Then both route to sk-code-quality | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate for my rails app before I claim done"` prints `"workflowMode":"sk-code-quality"` | Met | - | Evidence 2026-10-26: canary 3 printed `"selectionKind":"single"` with `"workflowMode":"sk-code-quality"`, canary 1 printed `single` to `sk-code-quality`, both exit 0 |
| AC-021 | REQ-014 | Given canaries 4 and 5, When they run, Then sk-code is recommended at 0.8 or above for the comment hygiene prompt and not for the simplify prompt | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check comment hygiene on these files"}' --format json` lists `sk-code` at confidence 0.8 or above, and the same command with the prompt "simplify this README paragraph" does not list `sk-code` at 0.8 or above | Met | - | Evidence 2026-10-26: the first prompt listed `sk-code` at `0.8419`, and the second listed `sk-doc` at `0.881` with no `sk-code` row, both exit 0 |
| AC-022 | REQ-014 | Given each new stage-one phrase in an out-of-domain sentence, When the advisor runs, Then sk-code is not recommended at 0.8 or above | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"write a README paragraph about over-engineering a cake recipe"}' --format json` lists no `sk-code` recommendation at 0.8 or above | Met | - | Evidence 2026-10-26: the cake prompt listed `sk-doc` at `0.9302`, `system-spec-kit` at `0.82` and `sk-design` at `0.82` with no `sk-code` row, and the yagni prose prompt listed no recommendation, both exit 0 |
| AC-023 | REQ-015 | Given `workflow-verify.md`, When its unknown-surface lines are read, Then the asking lines remain at 47 and 55 | `rg -n 'before claiming anything' .skilled/skills/sk-code/shared/references/workflow-verify.md` prints lines 47 and 55 | Met | - | Evidence 2026-10-26: the `rg` printed exactly two lines, `47:` and `55:`, exit 0 |
| AC-024 | REQ-016 | Given this packet, When it is validated strictly, Then the validator passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing --strict --no-recursive` prints `RESULT: PASSED` | Met | - | Evidence 2026-10-26: the validator printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0, on the final tree |
| AC-025 | REQ-016 | Given each packet document, When it is checked with the document validator, Then each exits 0 | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py --type spec specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing/spec.md` exits 0, and the same check passes for `plan.md`, `tasks.md`, `acceptance-criteria.md` and `decision-record.md` | Met | - | Evidence 2026-10-26: each of the five documents printed `VALID` and `Total issues: 0`, exit 0 each |
| AC-026 | REQ-007 | Given the Codex and Pi generated trees, When their sync checks run, Then both are in sync | `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check` prints `PASS: 11 agents are in sync.`, and `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check` prints the same line | Met | - | Evidence 2026-10-26: the Codex check printed `[codex-agent-sync] PASS: 11 agents are in sync.` and the Pi check printed `[pi-agent-sync] PASS: 11 agents are in sync.`, both exit 0 |
| AC-027 | REQ-001 | Given the `sk-code-review` Primary Detection Signal, When it is read, Then one line says a run verdict is input evidence | `rg -n 'run verdict' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints one line inside the Primary Detection Signal section | Met | - | Evidence 2026-10-26: the `rg` printed one line at `60:`, inside the Primary Detection Signal section, exit 0 |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All 27 rows are closed: 26 are `Met` and AC-018 is `Waived` under ADR-006. Each was closed on 2026-10-26 by running its Verification cell on the final working tree, and `tasks.md` records the output beside the task that owns it.

AC-018 closes as a waiver. Stage one stays `single` with the target `sk-code-quality`, and stage two carries `CI_WORKFLOW` with the four CI references, so the CI standards still reach the quality run. The CI vocabulary is unchanged from the base commit, and the operator confirmed the waiver on 2026-10-26. ADR-006 records both. AC-015 and AC-016 name the versions this tree carries: hub `3.7.0.0`, sk-code-review `1.9.0.0`, sk-code-skilled `2.1.1.0` and sk-code-ci `1.1.1.0`.
<!-- /ANCHOR:closure -->
