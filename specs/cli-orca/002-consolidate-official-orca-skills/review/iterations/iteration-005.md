# Deep Review Iteration 5 — Correctness (Final)

- **Target:** `.skilled/skills/cli-orca` (with its review scope: the packet at `specs/cli-orca/002-consolidate-official-orca-skills`, the mcp-tooling hub boundary, advisor routing surfaces, sk-doc package validators, and the compiled-route tooling)
- **Dimension:** correctness
- **Iteration:** 5 of 5 · **Lineage:** new (generation 1) · **Mode:** review
- **Focus:** final correctness close-out — Smart Router qualification contract (`P1-001`), foreign-owner defer guard, resource guard, and the pending resource-map coverage directive

## FILES REVIEWED

- `.skilled/skills/cli-orca/SKILL.md:1-325` — full read across this iteration: frontmatter and activation contract; Smart Router pseudocode (`INTENT_SIGNALS`, `FOREIGN_OWNERS`, `UNKNOWN_FALLBACK`, `RESOURCE_MAP`, `_guard_in_skill`, `orca_qualified_phrases`, `route`); mutation boundary; ALWAYS/NEVER rules; references and related resources
- `.skilled/skills/cli-orca/SKILL.md:58,101-167,268,302` — qualification rule, signal tables, qualifier function, route decisions, NEVER #7, related-resource handoff
- `specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md:46-117` — coverage rows for benchmark, feature-catalog and playbook artifacts
- `specs/cli-orca/002-consolidate-official-orca-skills/tasks.md:160-175` — verification checklist rows (document validation `checked=31 blocking=0`)
- `specs/cli-orca/002-consolidate-official-orca-skills/applied/` — directive target set (still absent)
- Prior-state artifacts: `review/iterations/iteration-001.md` … `iteration-004.md` (final verdict lines), `review/deltas/iter-004.jsonl` (first record), `review/deep-review-findings-registry.json` (open rows), `review/deep-review-state.jsonl` (tail)
- Runtime append probes: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:178-445` (accepted event shapes) and `append-state-record.cjs`
- Command evidence: `git grep -nE "AIza[0-9A-Za-z_-]{35}" -- specs/cli-orca/ .skilled/skills/cli-orca/` (rc=1, zero hits); `git status --porcelain` over the packet and skill root

## FINDINGS BY SEVERITY

### P0 — Blockers

None.

### P1 — Required

#### P1-001 — Smart Router pseudocode admits generic non-Orca vocabulary, contradicting the qualification rule and NEVER #7 (re-verified, not new)

- **File:** `.skilled/skills/cli-orca/SKILL.md:101`
- **Claim:** the router's keyword sets contain generic, non-Orca vocabulary and `orca_qualified_phrases()` applies no qualifier gate, so requests that never mention Orca can route into Orca lanes.
- **Evidence (re-verified this iteration):**
  - `SKILL.md:104` — `BROWSER` keywords are `["orca browser", "orca embedded browser", "embedded browser"]`; the bare `embedded browser` is generic browser vocabulary.
  - `SKILL.md:103` — `TERMINAL` keywords are `["orca terminal", "paired terminal", "read the terminal", "send to the terminal", "terminal receipt"]`; the last three are generic terminal vocabulary.
  - `SKILL.md:150-153` — `orca_qualified_phrases()` is a plain `keyword in text` substring filter; its docstring claims "Only Orca-qualified phrases count" while nothing enforces qualification.
  - `SKILL.md:155-158` — `route()` returns `UNKNOWN_FALLBACK` only when no keyword matched at all, so a single generic phrase is enough to select a lane.
  - `SKILL.md:58` — "A bare `orca` mention is never sufficient … routing needs an Orca-qualified multi-word phrase or a named Orca surface."
  - `SKILL.md:268` (NEVER #7) — "Never route a bare `orca` token, an `OpenOrca` model label, or generic worktree, terminal, browser or orchestration vocabulary into this skill."
- **Counterevidence sought:** re-read the full pseudocode (`SKILL.md:94-167`). No additional qualification check exists; `FOREIGN_OWNERS` (`SKILL.md:110-117`) defers only when a foreign phrase is present and no matched signal starts with `orca`, so a lone generic phrase (`read the terminal`, `embedded browser`) still routes.
- **Alternative explanation:** the block is labelled pseudocode and may be read as illustrative. However it is the only machine-shaped statement of the routing contract and it contradicts the prose rules in the same document, so the mismatch exists under either reading.
- **Final severity:** P1 (contract mismatch with silent misroute risk; unchanged since iteration 1).
- **Confidence:** 0.85.
- **Downgrade trigger:** a revision that prunes generic keywords from `INTENT_SIGNALS` or adds an explicit qualifier requirement inside `orca_qualified_phrases()` closes this finding.

### P2 — Advisory

No new P2 findings. `P2-001`–`P2-006` remain active; the ones re-confirmed or most relevant to this correctness pass:

- `P2-001` — `SKILL.md:106` still omits `linear-tickets` and the bare `orchestration` name from `ORCA_SKILLS` (`orca-emulator-android` is covered by the `orca-emulator` substring).
- `P2-002` / `P2-005` — `resource-map.md:62-65` carries index-level rows for the catalog and playbook plus one `PLANNED` post-remediation benchmark row, but no rows for the scoped `benchmark/reports/2026-09-20--extraction-routing-verification/` artifacts (`report.md`, `routing-replays.json`) or the twelve catalog/playbook sub-documents.
- `P2-004` — `tasks.md:169` still records `checked=31 blocking=0` against the 32 recorded in `acceptance-criteria.md` and `implementation-summary.md`.
- `P2-003` and `P2-006` carry forward unchanged from iterations 2 and 4; neither was re-checked in this pass.

## TRACEABILITY CHECKS

- **Core `spec_code`** — `P1-001` re-verified against `SKILL.md:58,101-167,268`. Prior REQ-005 (8/8 snapshots byte-identical), REQ-004/REQ-006 and REQ-009 (32/32 documents) evidence stands; REQ-014's literal command re-run this iteration (`rc=1`, zero hits); REQ-011/012/013 remain unmet by design; the `P2-004` conflict remains recorded.
- **Core `checklist_evidence`** — AC-014's exact command re-run this iteration; `tasks.md:160-175` re-read; the iteration-3 row-level replay stands unchanged; `P2-004` is the one conflicting row.
- **Overlay `skill_agent`** — carried pass: no agent definition pins `cli-orca`; advisor identity live at generation 65 per the replay record. No new evidence.
- **Overlay `agent_cross_runtime`** — carried pass: `.pi/skills/cli-orca` is content-identical to `.skilled/skills/cli-orca` (`diff -rq` rc=0, zero differing entries); not re-run.
- **Overlay `feature_catalog_code`** — carried pass: the catalog index maps to its five per-feature documents and 161 relative links resolve with 0 broken. Resource-map rows for the sub-documents remain missing (`P2-005`).
- **Overlay `playbook_capability`** — carried pass: 8 deterministic scenarios across 4 categories exist on disk; execution verdicts are deferred to the AC-013 post-remediation wave.
- **Resource Map Coverage directive** — `applied/T-*.md` still does not exist, so the directive cross-check remains untriggerable; the config's 86-file scope list was used as the fallback inventory and no new coverage gap was found beyond `P2-002`/`P2-005`.

## RULED OUT

- **Foreign-owner defer-guard bypass** — `route()` (`SKILL.md:159-161`) defers when a foreign phrase matches and no matched signal starts with `orca`; every phrase in the when-NOT table either has a `FOREIGN_OWNERS` entry or matches no `INTENT_SIGNALS` keyword and falls to `UNKNOWN_FALLBACK`. No foreign request escapes to an Orca lane.
- **Routed-resource guard evasion** — `_guard_in_skill()` (`SKILL.md:134-140`) confines resolution to `SKILL_ROOT` via `relative_to` and rejects non-markdown suffixes; `route()` (`SKILL.md:163-166`) halts when a mapped resource is missing from `discover_markdown_resources()`. No path escape and no unregistered resource load.
- **Bare-token routing** — a request containing only `orca`, with no multi-word phrase, matches no keyword and returns `UNKNOWN_FALLBACK` (`SKILL.md:119-123,155-158`). The bare token is not routed; `P1-001` concerns the generic vocabulary, not the token itself.
- **Secret exposure in the scoped trees** — AC-014's literal pattern re-run over `specs/cli-orca/` and `.skilled/skills/cli-orca/`: rc=1, zero hits.

## SCOPE VIOLATIONS

None. This iteration created or modified only the allowed state paths (this narrative, `deltas/iter-005.jsonl`, the strategy note) and the sanctioned gateway/state-writer writes into `review/`. The pre-existing working-tree modifications visible in `git status` (`description.json` and unrelated public-repo files) were untouched.

## NEXT DIMENSION

None — iteration 5 of 5 completes the dimension cycle (correctness, security, traceability and maintainability all covered). The run proceeds to synthesis with `P1-001` open and six P2 advisories recorded.

## VERDICT

No new P0/P1 findings this iteration; `P1-001` was re-verified active with direct contract evidence, which keeps the run at CONDITIONAL. `P2-001`–`P2-006` remain advisory and unchanged. Synthesis should carry the active P1 forward as the release gate.

Review verdict: CONDITIONAL
