# Iteration 2: Security - the authoring command path and scaffold markers

## Dimension

Security. The command surface the authoring card sends a weak model to (`create.sh`), the new read-only guards (`check-example-drift.sh`, `check-card-sync.sh`), the broad post-edit scanner (`spec/check-placeholders.sh`), and the production rule that watches for scaffold-origin titles.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:130-175,380-420,789-830,1031-1044,1220-1340,1435-1500`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:20-55`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:1-44`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:1-120`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:1-250`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-scaffold-never-touched.sh:1-115`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:130-165`

## Findings by Severity

### P0 Findings

None. No credential exposure, no remote input path, and the new guards are read-only as they claim.

### P1 Findings

1. **The scaffold command accepts a traversing track and creates it outside the repository** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1291` -- `--track` is copied straight into `SPECS_DIR="$SPECS_DIR/$TRACK"` and then `mkdir -p "$SPECS_DIR"` runs before any validation. A track such as `../../outside` resolves above the repository root and the command creates that directory, then scaffolds into it. The card's BOUNDS section says the only allowed writes are the packet folder and its `scratch/`, and step 3 sends the model to this exact command with a model-chosen `<track>`; the sibling `--path` argument is validated for traversal at `create.sh:1223-1270`, so the omission is inconsistent rather than deliberate. `refresh_track_root` rejects a track containing `/` at `create.sh:1035`, but that guard runs after the directory is created.
   Finding class: path-traversal
   Scope proof: the assignment and `mkdir` were read at `create.sh:1291-1295`; the validated sibling is `resolve_and_validate_create_target` at `create.sh:1223`; the card command is at `spec-authoring-card.md:47`.
   Affected surface hints: `create.sh` argument parsing, scaffold destination, authoring card step 3, BOUNDS write contract
   Case: a model runs `create.sh --skip-branch --track ../../outside --short-name x "y"`, and the command creates `<repo>/../outside/001-x/` before any later step can object.

```json
{
  "type": "claim-adjudication",
  "findingId": "R2-P1-001",
  "claim": "create.sh interpolates an unvalidated --track into the specs path and mkdir -p creates a directory outside the repository.",
  "evidenceRefs": [
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1291-1295",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1223-1270",
    ".skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:47"
  ],
  "counterevidenceSought": "Searched create.sh and the cli tests for a track validator or a traversal test; found none. Checked refresh_track_root, which rejects a slash but runs after the mkdir. Checked whether the sandbox blocks the write; the command itself has no such guard.",
  "alternativeExplanation": "The track may be treated as operator-trusted, and the caller already has write access to the host, so no privilege boundary is crossed. Rejected as a full explanation because the card explicitly bounds a weak model's writes to the packet folder, and the tool violates its own contract with a plausible malformed value.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade to P2 if create.sh gains a track-slug validation (or the card requires a slug-only track) and a traversal regression test lands.",
  "transitions": [{ "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

### P2 Findings

1. **A `[template:...]` title token in spec.md is invisible to the production rule that watches for scaffold markers** -- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-scaffold-never-touched.sh:34` -- The rule's file list is `plan.md`, `tasks.md` and `implementation-summary.md`; `spec.md` is read only for its Status value. A hand-copied template title such as `title: "Feature Specification: X [template:level-2/spec.md]"` therefore survives `validate.sh --strict` even when the packet claims Complete, while the shell mirror's Pattern 3 flags exactly that line (`rules/check-placeholders.sh:158`). The scaffolder strips the token, so this needs a hand-copied document, which is the case the shell rule's own comment names.
   Finding class: gate-coverage-gap
   Scope proof: the file list and the title scan were read at `check-scaffold-never-touched.sh:34,79-88`; the mirror pattern was read at `check-placeholders.sh:149-158`.
   Affected surface hints: scaffold-never-touched rule, placeholder rule, spec template title
   Case: a model copies a template into a new packet, fills the body, sets Status Complete, and leaves `[template:level-2/spec.md]` in the title; strict validation passes.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `spec-authoring-card.md:20-55`; `create.sh:1291-1295` | The card's write bound and the tool it prescribes disagree on a traversing track. |
| `checklist_evidence` | pending | hard | `003-versioned-placeholder-gate/acceptance-criteria.md` | Deferred to the checklist pass. |
| `skill_agent` | notApplicable | advisory | - | No skill definition changed by this phase. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition changed by this phase. |
| `feature_catalog_code` | partial | advisory | `versioned-placeholder-gate.md:36` | Same leaf as iteration 1; no new catalog claim audited here. |
| `playbook_capability` | pending | advisory | `manual-testing-playbook/template-authoring/*` | Audited later. |

## Edge Cases

- `create.sh` defaults `SKIP_BRANCH=true`, so the card's "no git state changes" instruction holds unless a caller passes `--branch`.
- `refresh_track_root` is safe for a slash-containing track, but only because it returns early; the earlier `mkdir` is the write that matters.
- `check-example-drift.sh` runs under `set -uo pipefail` without `-e`; a missing example directory fails closed through the `node compare` exit code rather than through the description checks.
- The new guards accept caller-supplied roots (`EXAMPLES`, `--skill-root`) and only read; no write path exists in either script.

## Confirmed-Clean Surfaces

- `check-example-drift.sh` quotes every path expansion and passes the example path as an argument to `node`; no shell interpolation of document content.
- `check-card-sync.sh` uses fixed relative paths under the resolved skill root and `jq -e` predicates; no `eval`, no temporary files, no writes.
- `spec/check-placeholders.sh` skips `scratch/`, `memory/`, `research/`, `review/` and backup directories before scanning, and its `sed` cleanup cannot execute document text.
- `validate.sh` contains no write, no `mktemp` and no trap that could leave state behind.

## Ruled Out

- Command injection through a document line: ruled out; every scanner passes text through `grep`/`sed` arguments, never `eval`.
- Symlink escape through the broad scanner: ruled out as a gate issue; `find -type f` skips symlinks, and the orchestrator reads named docs directly, so a symlinked doc cannot hide a token from `validate.sh`.
- Credential exposure in the new files: ruled out; no keys, tokens or environment values are read or printed.

## Next Focus

Iteration 3 - traceability - `spec_code` across the parent phase map and the nine child implementation summaries: every parent claim about a phase (status, handoff criteria, file ownership) checked against the child's own record and the shipped file.

Review verdict: CONDITIONAL
