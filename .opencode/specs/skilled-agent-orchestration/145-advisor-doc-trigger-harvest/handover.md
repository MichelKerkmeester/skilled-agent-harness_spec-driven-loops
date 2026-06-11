---
title: "Session Handover: Advisor Doc-Trigger Harvest Rollout"
description: "Rollout, governance, validator/CI and the full 009 authoring campaign (355/355) are complete; the only remaining work is the T025 live daemon matchedDocs smoke, gated on a full session cycle."
trigger_phrases:
  - "advisor doc harvest handover"
  - "resume doc trigger rollout"
  - "matchedDocs live smoke"
  - "t025 daemon adoption"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-advisor-doc-trigger-harvest"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "T018+T026 done; 009 campaign complete 355/355; T025 open"
    next_safe_action: "Live smoke T025 after all advisor sessions cycle"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-145-advisor-doc-trigger-harvest"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Session Handover Document

Continuation state for the skill-doc frontmatter program: Option B (advisor-as-consumer) decided, consumer built and pilot-verified, flag armed in all three runtime configs.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use handover.md when:**
- Ending a session with incomplete work that needs continuation
- Context needs to be preserved for a future session (same or different agent)
- Transitioning work between team members or AI sessions
- Complex multi-session features requiring state preservation
- Session compaction detected and recovery needed

**Status values:** in_progress
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-06-11 (session 1: investigation → decision → consumer build → pilot → flag flip; session 2: T020 smoke → two rollout fixes → T018 governance → Workstream C validator/CI → full 009 campaign, 22/22 phases)
- **To Session:** next fresh session, opened ONLY after every advisor-attached session has ended (pre-fix launchers respawn flag-less daemons from in-memory code)
- **Phase Completed:** everything except T025 — implementation, verification, governance, validator + CI (now `--coverage`), and the 009 authoring campaign (355/355 docs contract-valid)
- **Handover Time:** 2026-06-11T12:35:00Z
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision     | Rationale | Impact                 |
| ------------ | --------- | ---------------------- |
| Option B, advisor-as-consumer; Spec Kit Memory NEVER indexes skill docs | Operator directive 2026-06-11; advisor owns skill knowledge, memory stays a continuity plane | Zero spec-kit memory edits; advisor mcp_server is the only code surface; recorded in 009/001 research.md + implementation-summary.md |
| Full frontmatter block (title/description/trigger_phrases 3-8/importance_tier/contextType) on ALL references+assets, READMEs exempt | Operator picked refs+assets scope; enums borrowed from fsrs-scheduler.ts vocabulary | 009 phases 002-022 author ~270 more docs; contract stated in 009 parent spec.md |
| Doc signal rides derived_generated lane; top-3 docs, tier-weighted, 0.45 cap | No lane-weight redistribution; volume cannot buy routing (sk-code 95 docs vs mcp-click-up 3) | Doc-only confidence ~0.68 at normal tier — annotates and assists, cannot hard-route alone |
| matchedDocs via doc: evidence strings + handler allowlist | Evidence already flows lane→fusion→handler; allowlist closes traversal/injection | `matchedDocsFromContributions` exported in advisor-recommend.ts |
| Consumer packet lives in skilled-agent-orchestration track (145), not under 027/000-release-cleanup | 000-release-cleanup spec excludes source-code changes | Cross-referenced from 009 parent spec Out-of-Scope |

### 2.2 Blockers Encountered
| Blocker     | Status          | Resolution/Workaround |
| ----------- | --------------- | --------------------- |
| 2 advisor test files failing (settings-driven-invocation-parity 35/41; one daemon-lease respawn case) | open (pre-existing) | Proven NOT caused by this work via stash-rerun; do not chase under packet 145 |
| Stash round-trip left unmerged index entry on mcp_server/database/.spec-memory-owner.json | resolved | `git rm --cached` on the unmerged path; worktree file intact; avoid stashing in this shared-index repo |
| `create.sh` without `--track` landed packet at specs root | resolved | Deleted and re-created with `--track skilled-agent-orchestration` |
| Parser bug: quote stripped before trim left `"gamma delta` | resolved | cleanScalar trims first; regression covered by inline-list vitest case |
| projection.ts joins MK_SKILL_ADVISOR_DB_DIR override onto workspaceRoot (absolute-path join quirk) | open (pre-existing, cosmetic) | Pilot worked around with workspaceRoot '/'; live daemon unaffected (no override env mismatch) |
| Launcher `CHILD_ENV_ALLOWLIST` stripped the new flag from the daemon child — live daemon ran flag-off despite all three configs (T020 smoke, 2026-06-11) | resolved | Flag added to the allowlist in `mk-skill-advisor-launcher.cjs`; `createChildEnv` unit-verified; 28/28 launcher/bridge/harvest vitest |
| Python doc parity dead on the live path: only the legacy JSON loader merged `_load_source_graph_signal_map()`; the sqlite loader (always wins) didn't | resolved | Source-map merge added to `_load_skill_graph_sqlite()`; flag-on local smoke ranks deep-loop-runtime 0.95 via doc signal; flag-off byte-identical; pytest 4/4 |
| Live `matchedDocs` smoke cannot complete while any pre-fix launcher process survives (they respawn flag-less daemons from in-memory code) | open (T025) | End all advisor-attached sessions, start one fresh session, run trusted scan + recommend |

### 2.3 Files Modified
| File        | Change Summary | Status                 |
| ----------- | -------------- | ---------------------- |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts` | NEW: flag gate, tier weights, list-aware parser, capped refs/assets walker | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | skill_docs DDL (schema+migration), harvestSkillDocs, result.docs counters | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/{types,projection}.ts` | SkillDocTriggerProjection; flag-gated, missing-table-tolerant docTriggers load | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts` | scoreDocTriggers: top-3, tier-weighted, 0.45 cap, doc: evidence first | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/{schemas/advisor-tool-schemas.ts,handlers/advisor-recommend.ts}` | matchedDocs optional field; sanitized extraction; doc_reference_signal | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts` | doc-frontmatter watch targets when flag on | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Gate-2 parity doc harvest under same flag | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts` | NEW: 11 cases, flag-off invariance is the hard contract | complete (11/11) |
| `opencode.json`, `.claude/mcp.json` (real target of .mcp.json symlink), `.codex/config.toml` | SPECKIT_ADVISOR_DOC_TRIGGERS="true" + _NOTE_DOC_TRIGGERS in advisor env | complete (parse-validated) |
| `.opencode/specs/skilled-agent-orchestration/145-advisor-doc-trigger-harvest/*` | All 5 packet docs authored with evidence; strict validate PASSED 0/0 | complete |
| `.opencode/specs/system-spec-kit/027-.../000-release-cleanup/009-skill-frontmatter-alignment/**` | Phase parent + 001 investigation (complete, evidence-cited) + 21 seeded skill children; 23/23 strict PASS | complete (scaffold) |
| dist rebuilt (`npm run build` in advisor mcp_server) | New code compiled; live daemon still runs OLD dist until fresh session | complete (adoption pending) |
| `mcp_server/scripts/check-skill-doc-frontmatter.{sh,mjs}` + `.github/workflows/skill-doc-frontmatter.yml` | Workstream C contract checker (shape/coverage, `--skill` filter) + CI guard, flipped to `--coverage` after the campaign closed | complete |
| Advisor governance surfaces (README §4, ARCHITECTURE §4, feature_catalog 38th entry, playbook AI-006 + inventory vitest 45→46, `changelog/v0.8.0.md`, ENV_REFERENCE row) | T018 complete | complete |
| `.opencode/skills/*/references/**` + `assets/**` (all 21 skills) + 22 child packets under `027-.../009-skill-frontmatter-alignment/` | 009 campaign: 355/355 docs carry the exact 5-field contract; every child packet strict-validates; parent map/status Complete | complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** `.opencode/specs/skilled-agent-orchestration/145-advisor-doc-trigger-harvest/tasks.md` (T025 is the only open task)
- **Context:** PRECONDITION FIRST — verify no stale `mk-skill-advisor-launcher.cjs` processes survive from before 2026-06-11 ~11:00 (`ps aux | grep mk-skill-advisor`). Pre-fix launchers strip the flag from any daemon they spawn, so the smoke is meaningless until they are all gone.

### 3.2 Priority Tasks Remaining
1. **Live smoke (T025, final T020 leg — the ONLY remaining work)**: PRECONDITION — every advisor-attached session has ended since 2026-06-11 ~11:00 (pre-fix launchers respawn flag-less daemons; verify no stale `mk-skill-advisor-launcher.cjs` processes). Then in one fresh session: `node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted` (no args; expect `docs` counters ~355 scanned / ~355 indexed — the campaign authored phrases on every doc, superseding the original 84) and `advisor_recommend --json '{"prompt":"coverage graph script exit codes"}'` → deep-loop-runtime carrying `matchedDocs: ["references/script_interface_contract.md"]`. On PASS: mark T025/CHK-025 `[x]`, flip 145 spec Status to Complete, run the completion verification rule (strict validate + checklist), and re-pin evidence to the landing SHA at commit time. Negative memory check already PASSED 2026-06-11.
2. **Governance surfaces (T018)**: DONE 2026-06-11 — README §4 subsection, ARCHITECTURE §4 paragraph, feature_catalog entry + per-feature file (38 features), playbook AI-006 + root rows with `manual-testing-playbook.vitest.ts` bumped 45→46 (green), skill-local `changelog/v0.8.0.md`, ENV_REFERENCE.md SKILL ADVISOR row.
3. **009 mass authoring**: DONE 2026-06-11 — all 22 phases Complete, full corpus 355/355 contract-valid (`check-skill-doc-frontmatter.sh --coverage` global PASS), every child packet strict-validated, parent phase map + status flipped, CI guard switched `--shape` → `--coverage`. Only T025 (live daemon smoke) remains for this program.

### 3.3 Critical Context to Load
- [ ] Master plan: `~/.claude/plans/cost-is-no-issue-spicy-hare.md` (Workstreams A-F: ALL complete except F step "live adoption" = T025)
- [ ] Spec file: `spec.md` (REQ-008's live-smoke clause is the only open acceptance; §6 risks carry both launcher gotchas)
- [ ] Tasks: `tasks.md` T025 (blocked) and T021-T024/T026 evidence rows
- [ ] Uncommitted work inventory: §2.3 table — operator lands commits with `git commit --only -- <paths>` (shared-index repo; sweep risk)
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before handover, verify:
- [x] All in-progress work saved to the working tree (uncommitted by design — shared-index repo, operator commits; use `git commit --only -- <paths>` when landing)
- [x] Current context saved via packet docs + this handover (continuity blocks updated in all five 145 docs)
- [x] No breaking changes left mid-implementation (flag-off invariance tested; build green; live daemon untouched)
- [x] Tests passing (11/11 new; suite failures proven pre-existing via stash-rerun)
- [x] This handover document is complete
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

- **Hard boundary (operator directive, do not re-litigate):** Spec Kit Memory must never index skill docs. A memory-side design (`SPECKIT_INDEX_SKILL_DOCS`) was produced during planning and explicitly REJECTED — do not implement it. Consider codifying as a constitutional memory.
- **Deploy gotcha:** the advisor launcher EXITS when its daemon child is SIGTERMed (unlike mk-spec-memory's transparent recycle). Adoption path = fresh session (or `/mcp` reconnect after rebuild). Never SIGTERM-recycle the advisor daemon.
- **Calibration note:** doc-only matches at `normal` tier reach ~0.68 confidence — below the 0.8 pass threshold by design. If 009 authoring shows important-tier docs deserve to clear the floor unaided, tune `DOC_PHRASE_FACTOR`/`DOC_CONTRIBUTION_CAP` in `lanes/derived.ts` (test expectations encode current constants).
- **Validator trivia learned this session:** `recent_action`/`next_safe_action` reject the words "summary/details/because/..." (narrative detector) and >96 chars; tasks.md H2 phase headers must stay `Phase 1: Setup` / `Phase 2: Implementation` / `Phase 3: Verification`.
- **009 children are deliberate Draft stubs** seeded with per-skill frontmatter counts; the investigation child (001) is the only completed one. The 145 packet description.json `title` field is auto-generated and refreshes on next canonical save.
- **Corpus numbers (2026-06-11, post-campaign):** 355 harvestable docs after README exclusion; 355/355 carry the exact 5-field contract (`check-skill-doc-frontmatter.sh --coverage` global PASS). The pre-campaign 84-doc figure survives only in T017 pilot evidence.
- **Campaign recipe that worked (session 2):** pilot one skill end-to-end (008), then parallel agent waves of ~5 skills each with the pilot as the literal model; central re-verification per wave (coverage per skill + parent row flips stay with the orchestrator — agents never touch the parent spec). Per-phase routing smoke = Python local mode with the flag on (daemon-independent).
- **016-sk-doc note:** a concurrent session had pre-staged most sk-doc work; the phase agent verified rather than redid it. The two benchmark template assets keep copyable skeleton fences as their leading frontmatter by design (whole-file `cp` workflow) — enum-fixed in place, bounded routing noise accepted and recorded in that packet's limitations.
- **CI guard is now `--coverage`:** any new reference/asset doc must be born with the full block or PRs touching skill docs fail `skill-doc-frontmatter.yml`. sk-doc's scaffolding templates now emit the block.
<!-- /ANCHOR:session-notes -->

---

<!-- ANCHOR:template-instructions -->
## TEMPLATE INSTRUCTIONS

**How to use this template:**
1. Fill in all placeholders with actual values
2. Complete all validation checklist items before handover
3. Ensure memory file is saved with current context
4. Prioritize tasks clearly for next session
5. Remove placeholder text after filling in content

**Common mistakes to avoid:**
- Handover without saving memory context
- Incomplete validation checklist
- Vague task descriptions that lose context
- Missing file references or line numbers

**Related templates:**
- Use with `/memory:save` so the main agent can capture end-of-session continuity
- Reference `handover.md`, `_memory.continuity` in `implementation-summary.md`, and canonical spec docs for context recovery
- Link to spec.md, plan.md, and tasks.md for complete picture
- Run `generate-context.js` before handover when the session also needs an indexed save
<!-- /ANCHOR:template-instructions -->
