# Review Iteration 5 — maintainability and traceability

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-2-1794570021136-noekp0`, generation 1, lineageMode new.
- Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/doctor-install-2`.
- Dimension: maintainability and traceability. Budget profile: verify.
- Operator review focus: pass two of the command-surfacing review. This iteration read the remaining unchanged doctor-install files that describe or route the changed surfaces and checked the A10 row against its own manifest. It addressed the docs-that-disagree-with-code part of the focus and the claude, codex, opencode, pi, devin and dsh surfaces named in the route manifest. No holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/_routes.yaml:512-541` (check and embed routes, mutation class, gate-3 location, script invocations)
- `.skilled/commands/doctor/agents-md.md:80-90` (workflow summary)
- `.skilled/commands/doctor/assets/agents-md-manifest.json` (`runtime_copies`, including the report-only entries at `:758` and `:777`)
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:636-654` (A10 count and detail)
- `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:576-600` (the count the test pins)
- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:150-180` (output and repair routing)
- `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:230-245` (embedder plan rows)
- `.skilled/commands/doctor/skill-advisor.md:55-75` (embedder target routing)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:960-990` (shared spec-create surface; no doctor route)
- `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:370-385`, `INSTALL-SKILLED.md:120-155`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A10 counts report-only entries among the "copies as expected"** -- `.skilled/commands/doctor/scripts/agents-md-check.cjs:651` -- the row subtracts failed, unmeasured and pointer-missing entries from the expected count, but two INFO entries with `kind: 'reported only'` (`.cursorrules` and `~/.claude/CLAUDE.md`, both `report_only: true` in `agents-md-manifest.json`) remain in the numerator. In this checkout A10 prints `5/6 copies as expected, 1 pointer missing` while only three of the six entries are PASS; the two report-only paths were never read. The pass-one DR3-P2-001 fix excluded the pointer-missing INFO entry but left the other INFO class in the count.
   Case: `node .skilled/commands/doctor/scripts/agents-md-check.cjs --root .` prints `A10 runtime copies: 5/6 copies as expected, 1 pointer missing (PASS)`; the JSON entries show `CLAUDE.md` INFO pointer missing, `.cursorrules` INFO reported only and `~/.claude/CLAUDE.md` INFO reported only, so five "expected" copies include two paths the check says it never read.
   Finding class: misleading-evidence
   Scope proof: `rowRuntimeCopies` computes `expected` from `entries.length - failed - unmeasured - pointerMissing` at `:651`; neither `report_only` nor `kind === 'reported only'` is subtracted, and the test at `agents-md-check.test.cjs:576-600` pins the 5/6 detail.
   Affected surface hints: ["A10 runtime copies", "report-only manifest entries", "doctor agents-md check"]
   Claim adjudication: `{"type":"traceability","claim":"A10's expected count includes entries its own details classify as report-only, so the numerator claims a checked copy that was never read.","evidenceRefs":[".skilled/commands/doctor/scripts/agents-md-check.cjs:651",".skilled/commands/doctor/assets/agents-md-manifest.json:758",".skilled/commands/doctor/assets/agents-md-manifest.json:777"],"counterevidenceSought":"read the manifest entries and the row loop; report_only returns INFO and the loop prints only FINDING, UNKNOWN and pointer missing, so a report-only entry is invisible except in the count","alternativeExplanation":"as expected may mean expected behaviour of every entry, but the same row separates pointer missing for exactly the opposite reason, so the count reads as checked copies","finalSeverity":"P2","confidence":0.9,"downgradeTrigger":"a documented definition that as expected includes report-only entries"}`

2. **The embed route names the backup folder `<timestamp>` while the engine names it by plan digest and may fall back outside the repository** -- `.skilled/commands/doctor/_routes.yaml:536` -- the route's gate-3 location says a copy of every touched path is taken to `.skilled/output/doctor-agents-md/<timestamp>/`. `planFor` names the directory from the first 16 characters of the plan digest (`agents-md-embed.cjs:954-956`, `:997-1005`), and `backupBase` falls back to `os.tmpdir()/doctor-agents-md` when git does not ignore the output base (`:967-983`). The plan itself prints the actual `backup:` path, so the operator can recover, but the route's stated path is wrong in both its name and its location.
   Case: a fixture with no `.skilled/output` ignore rule: `agents-md-embed.cjs plan --root <dir>` prints `backup: /var/folders/.../doctor-agents-md/<16-hex>` while `_routes.yaml:536` tells the reader to look under `.skilled/output/doctor-agents-md/<timestamp>/`.
   Finding class: documentation-drift
   Scope proof: `rg -n "timestamp|plan digest|backupDirectoryOf|BACKUP_FALLBACK_DIR" agents-md-embed.cjs` shows the digest slice and the temp fallback; the route's `<timestamp>` appears only in `_routes.yaml:536`.
   Affected surface hints: ["agents-md embed route", "gate-3 location", "backup and undo lines"]
   Claim adjudication: `{"type":"traceability","claim":"The route's backup path contract does not match the engine's directory name or its fallback.","evidenceRefs":[".skilled/commands/doctor/_routes.yaml:536",".skilled/commands/doctor/scripts/agents-md-embed.cjs:954",".skilled/commands/doctor/scripts/agents-md-embed.cjs:982"],"counterevidenceSought":"read planFor, backupBase and renderPlan; the plan prints backup: from plan.dir and the directory is the digest slice","alternativeExplanation":"the timestamp may be the record's created_at inside the folder, but the folder segment is the digest and the route says the folder is timestamped","finalSeverity":"P2","confidence":0.9,"downgradeTrigger":"a documented decision that <timestamp> names the record's created_at rather than the directory"}`

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | pass | The route manifest and the parent spec place the embed route in the command-surfacing scope; the docs/code mismatches above are inside that scope. |
| checklist_evidence | core | notApplicable | The parent has no checklist; phase children own theirs. |
| skill_agent | overlay | notApplicable | No skill or agent definition in this area. |
| agent_cross_runtime | overlay | pass | The route manifest names the same six runtimes as `symlink-manifest.json`; dsh has no install row. |
| feature_catalog_code | overlay | notApplicable | The advisor feature catalog does not describe the doctor routes. |
| playbook_capability | overlay | notApplicable | No playbook file in this area. |

## Integration Evidence

- The `agents-md-check.cjs --json` output was read directly for the A10 entries; the two report-only entries and the pointer-missing entry are visible in the JSON but not in the printed lines.
- The engine's plan output was compared with `_routes.yaml:536`; `backupDirectoryOf` and `backupBase` settle the directory name and fallback.
- `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root .` remains `ok claude`, `ok codex`, `ok cursor`, `ok devin`; no route file was executed as a mutating command.

## Edge Cases

- The `.cursorrules` entry is report-only because that file shape is outside the checklist this command rewrites; it is still an entry in the same A10 row, so the count question applies to it.
- `~/.claude/CLAUDE.md` is a home-directory path, not a path under the target root; `copyVerdict` returns INFO before it joins the path, so the check never reads the user's home file. That is the right behaviour for a repository-scoped check; the count is the only defect.
- The route's `<timestamp>` is also inaccurate when the backup stays under `.skilled/output`: the folder segment is the digest slice, not a clock reading.

## Confirmed-Clean Surfaces

- `doctor-runtime-mirrors.yaml:165-170` routes an absent Codex entry to the repair line the check prints and keeps the DSH rows `n/a` while the tree is absent; the YAML is unchanged and consistent with the check.
- `doctor-skill-advisor-presentation.txt:230-245` prints the embedder plan with the install/start/pull rows and their undo; it does not claim a hook-health result.
- `skill-advisor.md:55-75` binds the `embedder` target to the YAML and the presentation contract; the target list matches `_routes.yaml`.
- `agents-md.md:80-90` summarizes plan, approval, write, re-read and restore without contradicting the engine's exit contract; its dropped-line sentence is a subset, not a false universal.
- `create.sh` carries no doctor route; it is in this area as a shared spec-create surface and no finding depends on it.

## Ruled Out

- **The manifest report-only entries are written by the engine** -- ruled out: `copyVerdict` returns INFO before any path join, and the embed allowlist does not include `~/.claude` or `.cursorrules`.
- **The backup always lands under `.skilled/output`** -- not ruled out: `backupBase` falls back to `os.tmpdir()/doctor-agents-md` when the output base is not ignored; this is part of the route finding above.
- **A10's 5/6 count is only the pointer-missing decision** -- ruled out: the pointer-missing fix is correct, but two report-only entries remain in the numerator (iteration 5, evidence: `agents-md-check.cjs:651`).

## Next Focus

- Dimension: maintainability and cross-reference
- Focus area: final consistency pass over the five P2 findings, the reducer registry, and the convergence vote
- Reason: all changed and unchanged area files have been read; the next iteration verifies the finding evidence and the state before synthesis.
- Rotation status: all four dimensions covered; coverage changed this iteration, so one stabilization pass remains.
- Blocked/productive carry-forward: do not re-open the five findings unless a re-read contradicts them.
- Required evidence: registry counts, iteration final lines, and a final read of each finding's cited line.

Review verdict: PASS
