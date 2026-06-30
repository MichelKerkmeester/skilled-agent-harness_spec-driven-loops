---
title: "Tasks: D2-R8 — register (Brand/Product) pinnable at command entry"
description: "Ordered build tasks with verification for the registerPolicy block in command-metadata.json, the projected REGISTER wrapper sections, and the extended design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r8 register pinning tasks"
  - "design command register policy tasks"
  - "brand product register command entry tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/008-register-pinning"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark all build tasks complete with checker evidence"
    next_safe_action: "Run D2-R9 pipeline-handoff-visibility phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r8-register-pinning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D2-R8 — register (Brand/Product) pinnable at command entry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Author the registerPolicy SSOT (45–60 min)

- [x] T001 Read `shared/register.md` §2/§3/§4 and `shared/assets/register_card.md` §2/§3; transcribe the per-command dial subset from the plan §3 matrix (`.opencode/skills/sk-design/shared/register.md`, `.opencode/skills/sk-design/shared/assets/register_card.md`, read-only) [15m] — Evidence: dials transcribed into plan §3 matrix; read-only sources `git diff` empty
- [x] T002 Fix the `registerPolicy` shape: `accepted` (string[]), `default` (string), `resolutionOrder` (string[]), `askWhen` (string), `proofFields` (string[]) [10m] — Evidence: `REGISTER_POLICY_FIELDS = ["accepted","default","resolutionOrder","askWhen","proofFields"]` in the checker
- [x] T003 Add the shared keys to all five records — `accepted=["brand","product"]`, `default="auto"`, the shared `resolutionOrder=["explicitFlag","declaredRegister","taskCue","surfaceInFocus","safeDefault"]`, the shared `askWhen` (`.opencode/skills/sk-design/command-metadata.json`) [10m] — Evidence: all 5 records carry identical `accepted`/`default`/`resolutionOrder`/`askWhen`
- [x] T004 Set each record's `proofFields` from the §3 matrix — interface `["register","density","motionBudget","colorStrategy"]`, foundations `["register","colorStrategy","tokenDensity"]`, motion `["register","motionBudget"]`, audit `["register","auditSeverity"]`, md-generator `["register"]`; every list begins with `register` [10m] — Evidence: per-record dump confirms the five distinct `proofFields`, each starting with `register`
- [x] T005 Confirm valid JSON; confirm `registerPolicy.proofFields` is a distinct field, NOT mirrored into `outputContract.requiredFields`; no spec/packet/phase ID or path embedded (evergreen [HARD]) [5m] — Evidence: `command-metadata.json` valid JSON; isolation held (checker line 471 unchanged); evergreen grep clean

**Verify Phase 1:** JSON parses; all five records carry a well-formed `registerPolicy`; `accepted ⊇ {brand,product}`; `default == "auto"`; every `proofFields` is non-empty and starts with `register`; the record-level `proofFields ⇔ outputContract.requiredFields` invariant is untouched.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Extend the checker (1–1.5 hours)

- [x] T006 Add `"registerPolicy"` to `REQUIRED_FIELDS`; add a `REGISTER_POLICY_FIELDS` constant (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [10m] — Evidence: `registerPolicy` in `REQUIRED_FIELDS` (line 18); `REGISTER_POLICY_FIELDS` at line 58
- [x] T007 Implement `validateRegisterPolicy(record, command)`: object check; `accepted` non-empty string[] containing `brand` + `product`; `default` non-empty string `=== "auto"`; `resolutionOrder`/`askWhen` non-empty; `proofFields` non-empty string[] containing `register` → violation exit 2; call it from `validateMetadata` [25m] — Evidence: `validateRegisterPolicy` at line 266, called from `validateMetadata` at line 223
- [x] T008 Confirm `validateRegisterPolicy` does NOT alter `validateOutputContract` — the `proofFields ⇔ requiredFields` rule stays intact; `registerPolicy.proofFields` is never compared to `outputContract.requiredFields` [10m] — Evidence: line 471 still compares record-level `proofFields` to `requiredFields` only; registerPolicy never referenced there
- [x] T009 Implement `expectedRegisterDrift(record, markdown)`: extract the `register` anchor block; assert the `--register` flag token, both postures (`brand`/`product`), the `STATUS=ASK MISSING_REGISTER` token, and every `registerPolicy.proofFields` dial; report `kind=register` drift; wording NOT diffed [20m] — Evidence: `expectedRegisterDrift` at line 563; dial loop over `proofFields` at line 613
- [x] T010 Add `register` to the drift sort order; fold register drift into the single `drift` total; preserve the exit-code contract (0 = pass / 1 = drift / 2 = invalid); keep prior channels on their own `kind` lines [10m] — Evidence: `expectedRegisterDrift` folded into the drift collector (line 557); `kind: "register"` lines; SUMMARY one `drift` total
- [x] T011 `node --check .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` passes; confirm `STATUS=ASK MISSING_REGISTER` is NOT added to `REQUIRED_RETURN_STATUS_TOKENS` (preconditions channel untouched); no spec/packet/phase ID or path embedded (evergreen [HARD]) [10m] — Evidence: `node --check` → NODE_CHECK=OK exit 0; register token enforced only by the register channel; evergreen grep clean

### Project the wrapper sections (30–45 min)

- [x] T012 [P] Insert the anchor-delimited `## REGISTER` section into `interface.md` from the metadata (flag + `register,density,motionBudget,colorStrategy` + ASK token), after `## PRECONDITIONS` (`.opencode/commands/design/interface.md`) [8m] — Evidence: `## REGISTER` at interface.md:37 (after `## 3. PRECONDITIONS`); 4 dials named
- [x] T013 [P] Same for `foundations.md` (dials `register,colorStrategy,tokenDensity`) (`.opencode/commands/design/foundations.md`) [8m] — Evidence: `## REGISTER` block present; dials `register`, `colorStrategy`, `tokenDensity` named
- [x] T014 [P] Same for `motion.md` (dials `register,motionBudget`) (`.opencode/commands/design/motion.md`) [8m] — Evidence: `## REGISTER` block present; dials `register`, `motionBudget` named
- [x] T015 [P] Same for `audit.md` (dials `register,auditSeverity`) (`.opencode/commands/design/audit.md`) [8m] — Evidence: `## REGISTER` block present; dials `register`, `auditSeverity` named
- [x] T016 [P] Same for `md-generator.md` (dial `register`) (`.opencode/commands/design/md-generator.md`) [8m] — Evidence: `## REGISTER` block present; dial `register` named
- [x] T017 Confirm each wrapper preserves its existing PURPOSE / sibling-discriminator / PRECONDITIONS / INSTRUCTIONS / EMIT DELIVERABLE / EXAMPLE sections and the four frontmatter fields (`description` / `argument-hint` / `aliases` / `allowed-tools`) byte-wise; no embedded ID or spec path (evergreen [HARD]) (`.opencode/commands/design/*.md`) [5m] — Evidence: frontmatter drift channel = 0; prior sections preserved; evergreen grep clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (30–45 min)

#### Functional
- [x] T018 Run `node design-command-surface-check.mjs` → `invalid=0 drift=0`, exit 0 (frontmatter + example + emit-deliverable + discriminator + preconditions + register channels all clean) [10m] — Evidence: `STATUS=PASS STAGE=complete` / `SUMMARY invalid=0 drift=0`
- [x] T019 Confirm no-regression: each prior `kind` (frontmatter, example, emit-deliverable, discriminator, preconditions) still reports `drift=0`; `allowed-tools` parity 5/5 preserved [5m] — Evidence: overall drift=0 with the register channel added; prior D2 parity intact
- [x] T020 Run the checker twice; `diff` the two `--json` outputs → byte-identical (determinism) [5m] — Evidence: sorted, timestamp-free output; the new `register` sort key keeps runs byte-identical

#### Integrity
- [x] T021 Synthetic break A — drop one record's `registerPolicy` → checker exits 2 (INVALID); restore → `invalid=0` [5m] — Evidence: STATUS=INVALID "missing required field registerPolicy" invalid=1; restored → invalid=0 drift=0
- [x] T022 Synthetic break B — strip `STATUS=ASK MISSING_REGISTER` from one wrapper → `kind=register` drift, exit 1; restore → `drift=0` [5m] — Evidence: register channel asserts the token (line 603); stripping it raises `kind=register` drift; restore → drift=0
- [x] T023 Confirm `mode-registry.json`, `register.md`, `register_card.md`, and the four frontmatter fields are byte-unchanged (sha / `git diff`); confirm `git status` shows only the three intended runtime targets (metadata, checker, five wrappers) [5m] — Evidence: `git status --porcelain` lists exactly the 7 targets; read-only sources `git diff` empty

#### Documentation
- [x] T024 Re-read the three mutated runtime artifacts; confirm evergreen (no IDs/paths); `node --check` the checker; mark all checklist items with evidence; update `implementation-summary.md` [10m] — Evidence: evergreen grep clean; `node --check` OK; checklist 34/34; `implementation-summary.md` authored

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All five records carry a well-formed `registerPolicy` (`accepted ⊇ {brand,product}`, `default == auto`, `proofFields ∋ register`)
- [x] All five wrappers carry the anchor-delimited `REGISTER` section (flag + both postures + this command's dials + `STATUS=ASK MISSING_REGISTER`)
- [x] `node design-command-surface-check.mjs` exits 0 (`invalid=0 drift=0`); `node --check` passes
- [x] Both synthetic breaks bite (exit 2 / exit 1) and restore cleanly
- [x] `mode-registry.json` / `register.md` / `register_card.md` / four frontmatter fields byte-unchanged
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R8)
- **Upstream SSOT**: See sibling `003-command-metadata-ssot` (D2-R3) — the `command-metadata.json` + checker this phase extends
- **Pattern precedents**: See siblings `006-sibling-discriminator` (D2-R6) and `007-preconditions-and-failure-modes` (D2-R7) — the anchor-delimited section + Stage-1 sub-validator + body-presence channel pattern reused here
- **Derivation source**: `.opencode/skills/sk-design/shared/register.md` + `.opencode/skills/sk-design/shared/assets/register_card.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Authors the registerPolicy block, projects REGISTER wrapper sections, extends the checker
- Every prior D2 channel + frontmatter drift must stay 0 (additive, no-regression)
-->
