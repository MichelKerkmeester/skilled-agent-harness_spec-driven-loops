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
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-consumers-and-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the verify loop, When step 2 is read, Then it names the run-verdict fields and the readers that phase 004 wrote | `rg -n 'checker_outputs' .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line inside step 2 | Unmet | - |
| AC-002 | REQ-002 | Given the @code workflow, When its numbered steps are read, Then QUALITY is step 5, VERIFY is step 6 and RETURN is step 7 | `rg -n '^[5-7]\. \*\*(QUALITY\|VERIFY\|RETURN)\*\*' .skilled/agents/code.md` prints three lines numbered 5, 6 and 7 | Unmet | - |
| AC-003 | REQ-002 | Given the @code RETURN body, When it is read, Then it carries a `Quality Gate` field | `rg -n 'Quality Gate:' .skilled/agents/code.md` prints one line inside the RETURN body | Unmet | - |
| AC-004 | REQ-003 | Given an outside graph-metadata block with a malformed `quality` key, When the metadata gate runs, Then it reports `GRAPH_METADATA_INVALID_QUALITY` | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs --test-name-pattern quality` prints `# fail 0` | Unmet | - |
| AC-005 | REQ-003 | Given a hub registry with a malformed quality row, When the registry compiler runs, Then it reports `QUALITY_DECLARATION_INVALID` | `node --test .skilled/bin/tests/quality-declaration.test.cjs` prints `# fail 0` | Unmet | - |
| AC-006 | REQ-013 | Given the phrase "apply yagni to this change", When stage two routes it, Then `surfaceIntents` contains CODE_QUALITY | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs` prints `# fail 0` | Unmet | - |
| AC-007 | REQ-004 | Given the intent carry gate and the stage-one vocabulary, When they are checked, Then the gate passes and "simplify" is absent from `intent_signals` | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub sk-code` prints `missing=0`, and `node -p 'JSON.stringify(["comment hygiene", "yagni", "over-engineering", "simplify"].map((k) => require("./.skilled/skills/sk-code/graph-metadata.json").intent_signals.includes(k)))'` prints `[true,true,true,false]` | Unmet | - |
| AC-008 | REQ-005 | Given `sk-code-review/SKILL.md`, When it is searched for "quality gate", Then only the author-side line remains | `grep -n 'quality gate' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints one line numbered 43 that reads "Author-side quality gates before review" | Unmet | - |
| AC-009 | REQ-006 | Given fixture F15, When the runner test runs, Then the envelope labels EXAMPLE and names no `local-` skill | `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs --test-name-pattern F15` prints `# fail 0` | Unmet | - |
| AC-010 | REQ-007 | Given the authored and derived agent mirrors, When the mirror check runs, Then every mirror matches its canonical body | `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0 | Unmet | - |
| AC-011 | REQ-008 | Given the SKILLED entry in the registry, When its quality rows are read, Then each row points at a `sk-code-skilled` checklist | `node -p 'require("./.skilled/skills/sk-code/mode-registry.json").modes.find((m) => m.workflowMode === "sk-code-skilled").quality.checklists.map((r) => r.file).join(" ")'` prints at least six values, each beginning `hub:sk-code/sk-code-skilled/assets/checklists/` | Unmet | - |
| AC-012 | REQ-008 | Given the sk-code-ci entry in the registry, When its quality row is read, Then it is path-only for `.github/workflows/**` | `node -p 'JSON.stringify(require("./.skilled/skills/sk-code/mode-registry.json").modes.find((m) => m.workflowMode === "sk-code-ci").quality)'` prints `{"checklists":[{"paths":[".github/workflows/**"],"file":"hub:sk-code/sk-code-ci/references/ci-workflow-standards.md"}]}` | Unmet | - |
| AC-013 | REQ-009 | Given the registry aliases and the hub vocabulary, When they are read, Then each moved phrase sits in its new owner only | `node -p 'JSON.stringify(require("./.skilled/skills/sk-code/mode-registry.json").modes.map((m) => [m.workflowMode, m.aliases.filter((a) => ["alignment verifier", "stable jsonl keys"].includes(a))]))'` prints `[["sk-code-quality",[]],["sk-code-review",[]],["sk-code-skilled",["alignment verifier","stable jsonl keys"]],["sk-code-ci",[]]]`, and the hub-router vocabulary check in tasks.md T032 prints `[[],["stable jsonl keys","add set -euo pipefail","alignment verifier"]]` | Unmet | - |
| AC-014 | REQ-010 | Given the allowlist reason at `verify-doc-claims.cjs` line 58, When it is read, Then it names `workflow-verify` | `rg -n 'workflow-verify' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` prints line 58, and `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` prints `doc-claims: 4/4 checks passed` | Unmet | - |
| AC-015 | REQ-011 | Given the four hub version carriers, When they are compared, Then they hold one value | `node -p 'JSON.stringify([require("./.skilled/skills/sk-code/hub-router.json").version, require("./.skilled/skills/sk-code/mode-registry.json").version, require("./.skilled/skills/sk-code/description.json").version])'` prints three identical values, and `rg -n '^version:' .skilled/skills/sk-code/SKILL.md` prints `5:version: 3.4.0.0` | Unmet | - |
| AC-016 | REQ-011 | Given the hub and the three touched packets, When their changelog folders are checked, Then each holds a real file and no symlink | `find .skilled/skills/sk-code -path '*/changelog/*' -type l` prints nothing, and `ls .skilled/skills/sk-code/changelog/v3.4.0.0.md .skilled/skills/sk-code/sk-code-review/changelog/v1.9.0.0.md .skilled/skills/sk-code/sk-code-skilled/changelog/v2.0.3.0.md .skilled/skills/sk-code/sk-code-ci/changelog/v1.1.1.0.md` lists four paths | Unmet | - |
| AC-017 | REQ-012 | Given the derived metadata and the leaf manifest, When their gates run, Then no root is stale | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --format json` prints `"stale": 0`, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code` prints `leaf-manifest.json OK` | Unmet | - |
| AC-018 | REQ-014 | Given the CI canary prompt, When compiled routing runs at stage one, Then `selectionKind` is `surfaceBundle` with sk-code-ci as a surface | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` prints `"selectionKind":"surfaceBundle"` | Unmet | - |
| AC-019 | REQ-004 | Given the ROUTER.md CODE_QUALITY intent, When it is read, Then the restraint words and comment hygiene are present | `rg -n '"CODE_QUALITY": +\{' .skilled/skills/sk-code/ROUTER.md` prints one line that contains `yagni`, `bloat` and `comment hygiene` | Unmet | - |
| AC-020 | REQ-014 | Given canaries 1 and 3, When they run, Then both route to sk-code-quality | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate for my rails app before I claim done"` prints `"workflowMode":"sk-code-quality"` | Unmet | - |
| AC-021 | REQ-014 | Given canaries 4 and 5, When they run, Then sk-code is recommended at 0.8 or above for the comment hygiene prompt and not for the simplify prompt | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check comment hygiene on these files"}' --format json` lists `sk-code` at confidence 0.8 or above, and the same command with the prompt "simplify this README paragraph" does not list `sk-code` at 0.8 or above | Unmet | - |
| AC-022 | REQ-014 | Given each new stage-one phrase in an out-of-domain sentence, When the advisor runs, Then sk-code is not recommended at 0.8 or above | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"write a README paragraph about over-engineering a cake recipe"}' --format json` lists no `sk-code` recommendation at 0.8 or above | Unmet | - |
| AC-023 | REQ-015 | Given `workflow-verify.md`, When its unknown-surface lines are read, Then the asking lines remain at 47 and 55 | `rg -n 'before claiming anything' .skilled/skills/sk-code/shared/references/workflow-verify.md` prints lines 47 and 55 | Unmet | - |
| AC-024 | REQ-016 | Given this packet, When it is validated strictly, Then the validator passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing --strict --no-recursive` prints `RESULT: PASSED` | Unmet | - |
| AC-025 | REQ-016 | Given each packet document, When it is checked with the document validator, Then each exits 0 | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py --type spec specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing/spec.md` exits 0, and the same check passes for `plan.md`, `tasks.md`, `acceptance-criteria.md` and `decision-record.md` | Unmet | - |
| AC-026 | REQ-007 | Given the Codex and Pi generated trees, When their sync checks run, Then both are in sync | `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check` prints `PASS: 11 agents are in sync.`, and `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check` prints the same line | Unmet | - |
| AC-027 | REQ-001 | Given the `sk-code-review` Primary Detection Signal, When it is read, Then one line says a run verdict is input evidence | `rg -n 'run verdict' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints one line inside the Primary Detection Signal section | Unmet | - |

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

**Closeable:** No

Every row is Unmet, because implementation has not started. AC-018 may close only as a waiver under ADR-006, if the stage-one CI canary stays `single` after the vocabulary work.
<!-- /ANCHOR:closure -->
