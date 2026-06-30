---
title: "Deep-review report: spec-150 Open Design terminal + interface integration"
---

# Deep-review report: spec-150 work

10-iteration adversarial deep review of the spec-150 work (the new `mcp-open-design` skill, the `sk-design-interface` de-vendor + Open Design integration, and the 150 research/spec packet), held against the verified research ground-truth (`001-.../research/seats/seat-a.findings.md` + `research/research.md`).

- **Fleet:** 10 narrow-slice read-only seats, 2 executors. Seats 01-05 = claude2-opus (judgment-heavy); seats 06-10 = gpt-5.5-fast (mechanical). Three concurrency-capped waves. Raw seat outputs in `seats/seat-NN.out` (gitignored).
- **Method:** each seat owned one narrow slice (narrow dodges the gpt-5.5 timeout). Round-2 verification was done at-location during remediation (each finding re-checked against the cited file before fixing); 0 false positives, all 10 P0/P1 reproduced.

## Verdicts (raw)

| Seat | Executor | Slice | Verdict | P0 | P1 | P2 |
|------|----------|-------|---------|----|----|----|
| 01 | claude2-opus | mcp-open-design SKILL.md accuracy | PASS-WITH-FINDINGS | 0 | 0 | 3 |
| 02 | claude2-opus | sk-design-interface de-vendor licensing | PASS-WITH-FINDINGS | 0 | 2 | 1 |
| 03 | claude2-opus | Open Design integration soundness | PASS-WITH-FINDINGS | 0 | 0 | 5 |
| 04 | claude2-opus | research honesty + spec validity | PASS-WITH-FINDINGS | 0 | 1 | 7 |
| 05 | claude2-opus | cross-skill coherence | PASS-WITH-FINDINGS | 0 | 2 | 3 |
| 06 | gpt-5.5-fast | mcp-open-design references accuracy | PASS-WITH-FINDINGS | 0 | 2 | 1 |
| 07 | gpt-5.5-fast | mcp-open-design catalog + playbook | PASS-WITH-FINDINGS | 0 | 2 | 1 |
| 08 | gpt-5.5-fast | sk-design-interface catalog + playbook | FAIL | 1 | 2 | 0 |
| 09 | gpt-5.5-fast | graph-metadata correctness | PASS-WITH-FINDINGS | 0 | 1 | 3 |
| 10 | gpt-5.5-fast | link + reference integrity | PASS-WITH-FINDINGS | 0 | 3 | 0 |

No P0 was a real license violation; the one FAIL (seat-08) was a broken relative path in a manual-test doc. No finding contradicted the shipped license state (Apache-2.0 only is correct).

## P0/P1 findings - all FIXED + re-validated

| # | Sev | Location | Issue | Fix | Found by |
|---|-----|----------|-------|-----|----------|
| 1 | P0 | sk-design-interface playbook `07--claude-design-parity/preview-image-fidelity-check.md` + root index | `design_fidelity.py` relative path did not resolve (`../mcp-magicpath/...`) | Corrected to `../../../mcp-magicpath/...` (per-scenario) and `../../mcp-magicpath/...` (root index); both resolve | 08, 10 |
| 2 | P1 | sk-design-interface playbook index ID-007 (lines 324, 330) | Stale MIT-attribution/notices text contradicting the de-vendor | Rewritten to Apache-2.0-only / no-MIT-remaining | 02, 08, 10 |
| 3 | P1 | sk-design-interface playbook index ID-004 precondition (line 174) | Stale "script and data preconditions" | Rewritten to Open Design live-read via mcp-open-design | 08 |
| 4 | P1 | sk-design-interface `graph-metadata.json` | Missing reciprocal edge for mcp-open-design (asymmetric) | Added `mcp-open-design` to `prerequisite_for` (0.7) + `manual.related_to` | 05, 09 |
| 5 | P1 | 150 parent `spec.md` phase map | Phases 002/003 marked "Planned" but shipped | Marked Complete with landing notes; phase 004 re-scoped to the live verify; continuity updated | 04 |
| 6 | P1 | mcp-open-design `SKILL.md` (line 88) | Broken cross-skill path to `claude_design_parity.md` (missing `../`) | Fixed to `../sk-design-interface/references/claude_design_parity.md` | 10 |
| 7 | P1 | mcp-open-design `references/od_cli_reference.md` (line 149) | "Every one is mutating" wrongly included read-only `get_run`/`get_artifact` | Clarified read-only vs mutating | 06 |
| 8 | P1 | mcp-open-design `references/tool_surface.md` (line 68) | `od daemon status`/`doctor` surfaced as read-only but unverified | Marked UNVERIFIED (not in the confirmed verb table) | 06 |
| 9 | P1 | mcp-open-design `feature_catalog/04--runs/headless-runs.md` (line 33) | `write_file` listed as gated, but policy omits it (overwrites) | Moved to the omit/reference-only group | 07 |
| 10 | P1 | mcp-open-design playbook index Section 10 (lines 203-206) | Catalog-file paths did not resolve from the index | Prefixed `../feature_catalog/`; all resolve | 07 |

### Remediation validation (verbatim)
- `package_skill.py --check` mcp-open-design → PASS; sk-design-interface → PASS
- `validate.sh --strict --recursive` 150 → parent + child both PASSED (0 errors / 0 warnings)
- `validate_document.py` on all 4 affected indexes → VALID (0 issues)
- Every fixed path resolved against its real target on disk

## P2 backlog (resolved 2026-06-14)

All record-integrity and doc-consistency items below are now FIXED in the P2-remediation commit. Three by-convention items remain WONTFIX with rationale retained. (Earlier inline fixes: the 8 em-dashes in mcp-open-design SKILL.md and the stale 150 spec.md description.)

Record-integrity - FIXED:
- `research.md:45` attributes the live `curl :7456` probe to `seat-a Task 4` + `seat-c §5c`, but only seat-c ran `curl` (seat-a ran `--help`/`--version` only). Mis-attributed evidence.
- `research.md:62` states the installed MCP `command`/`OD_DATA_DIR` without an inline INFERRED marker (seat-a flags both UNVERIFIED); the caveat appears only later in §5.
- `research.md:117` NEEDS-LIVE-VERIFICATION list dropped seat-a UNCERTAIN #8 (the `od mcp install` 7456-fallback-vs-socket-mode case).
- 150 `graph-metadata.json` `children_ids` lists `002/003/004` folders that do not exist (the build/de-vendor/validate work shipped into the skills, not separate folders); parent `completion_pct: 0` + `Status: In Progress` are stale; `research.md` frontmatter still `completion_pct: 80` / "build mcp-open-design skill" next-action.

Doc consistency - FIXED:
- sk-design-interface `SKILL.md:153` names only mcp-magicpath as the parity partner (now mcp-open-design too); `SKILL.md §7` Related Skills omits mcp-magicpath.
- `claude_design_parity.md` frontmatter description omits mcp-open-design; `:108`/`:119` "data"/"catalog" wording references the now-removed CSV inventory.
- mcp-open-design `tool_surface.md:82` `daemon stop`/`db vacuum` listed without an UNVERIFIED tag (same class as #8).
- feature_catalog directory numbering gap (no `06--`) so section numbers drift after 5.

Cosmetic / by-convention - WONTFIX (rationale retained):
- All three skills' `graph-metadata.json` lack `sanitizer_version` in the derived block (`skill_graph_validate` DERIVED-FRESHNESS warn) - matches the mcp-magicpath template, so a convention gap, not a regression.
- mcp-open-design `SKILL.md` `metadata.author: nexu-io (Open Design)` attributes to the upstream app vendor - matches the mcp-magicpath convention (author = upstream tool vendor).
- sk-design-interface `SKILL.md` STEP 0-4 (§2) vs STEP 1-5 (§3) numbering for the same phases - pre-existing (packet 148).

## Remaining (gated)
- Phase 004 live verification: `od mcp install opencode` + `tools/list` against the running app (writes the real `~/.config/opencode/opencode.json`; operator-gated).
- Push branch 027 to origin (operator-gated).
