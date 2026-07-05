---
title: "Implementation Plan: Validate.sh Registry Bridge"
description: "Plan to bridge orchestrator.ts's default validateFolder() path to registry-backed shell rules via a self-healing, live-derived skip-set."
trigger_phrases:
  - "validate sh registry bridge"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/011-followup-remediation/006-validate-sh-registry-bridge"
    last_updated_at: "2026-07-01T21:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Bridge implemented and verified, packet 030 clean"
    next_safe_action: "No implementation action remaining"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Validate.sh Registry Bridge

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js), Bash |
| **Framework** | system-spec-kit validation orchestrator (`orchestrator.ts`) + shell-registry rule framework (`validate.sh` / `scripts/rules/*.sh`) |
| **Testing** | vitest (orchestrator.ts currently has no coverage exercising `validateFolder()` or its dual-path branch logic); manual fixture-folder test |

### Overview
Add a self-healing bridge function to `orchestrator.ts`'s `validateFolder()` that reads `validator-registry.json`, derives the already-implemented rule_id set from the live `entries[]` array, and shells out to any remaining registry rule's script the same way `validate.sh`'s own `run_all_rules()` does — closing the gap where `COMMENT_HYGIENE_MARKER` and `SCAFFOLD_NEVER_TOUCHED` never run under a plain `validate.sh --strict` call.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed via direct Explore research this session: `validateFolder()` (`orchestrator.ts` ~420-455) hardcodes 9 native validator calls and never reads `validator-registry.json` or `scripts/rules/*.sh`; only `SPECKIT_RULES`/`SPECKIT_VALIDATE_LEGACY` reroute to the shell-registry's `run_all_rules()`.
- [x] HARD DEPENDENCY confirmed: siblings 003, 004, and 005 (scaffold-content authoring) must reach Status: Complete before this child is implemented, or enabling `COMMENT_HYGIENE_MARKER`/`SCAFFOLD_NEVER_TOUCHED` by default would fail ~40 packets across phases 002-007.

### Definition of Done
- [x] Bridge function added to `orchestrator.ts`, reading `validator-registry.json` and deriving the skip-set live from `entries[]`.
- [x] Bridge wired into `validateFolder()` immediately after native entries are pushed.
- [x] Registry rules not natively implemented (`COMMENT_HYGIENE_MARKER`, `SCAFFOLD_NEVER_TOUCHED`, and ~18 others) run and produce results under a plain `validate.sh --strict` call.
- [x] No rule runs twice; existing native validator behavior is completely unchanged.
- [x] `validate.sh --strict --recursive` on the whole `030-deep-loop-improved` packet root shows 0 errors (after also fixing `001-reference-research`'s scaffold markers and a metadata regen -- see implementation-summary.md).
- [x] Manual fixture test demonstrates the previously-silent scaffold-marker failure now fires under the default invocation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Self-healing bridge: derive the skip-set from the live `entries[]` array rather than a separately maintained allowlist, so any registry rule that later gets a native TypeScript implementation automatically stops double-running through the bridge without a bridge code change.

### Key Components
- **Bridge function** (new, in `orchestrator.ts`): reads `validator-registry.json`, derives already-implemented rule_ids from `entries[]`, shells out to every remaining registry rule's `script_path`, parses `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS`, pushes a matching `ValidationEntry`.
- **`validateFolder()`**: calls the bridge function after native entries are built.
- **`validator-registry.json`**: 40-entry rule registry (`rule_id`, `aliases[]`, `script_path`, `severity`, `category`, optional `strict_only`, optional `flags[]`, `description`) — read-only input to the bridge.
- **`run_all_rules()` output-parsing convention** (`validate.sh`, shell-registry path): reused for `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` parsing, not modified.

### Data Flow
`validateFolder()` builds native `entries[]` → bridge function reads `validator-registry.json` → derives skip-set from live `entries[]` rule_ids → for each remaining registry rule, shells out to `script_path` → parses `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` → pushes a `ValidationEntry` into the same `entries[]` array → default `validate.sh --strict` output now includes registry-backed shell rules.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm siblings 003-scaffold-content-002-deep-loop-runtime, 004-scaffold-content-003-deep-loop-workflows, and 005-scaffold-content-004-through-007 all show Status: Complete before starting implementation.
- [x] Read `validateFolder()` in `orchestrator.ts` and confirm the current native validator call sequence.
- [x] Read `validator-registry.json` and confirm the `rule_id`/`script_path`/`category`/`strict_only` shape.
- [x] Read `run_all_rules()` in `validate.sh` and confirm its `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` parsing convention.

### Phase 2: Implementation
- [x] Add the bridge function to `orchestrator.ts`: read `validator-registry.json`, derive the skip-set from live `entries[]` rule_ids.
- [x] Implement shell-out plus `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` parsing for each non-native registry rule.
- [x] Wire the bridge function call into `validateFolder()` immediately after native entries are pushed.
- [x] Verify skip-set derivation matches `entries[]` exactly for all currently-native validators (no double-running).

### Phase 3: Verification
- [x] Run `validate.sh --strict --recursive` on the whole `030-deep-loop-improved` packet root; confirm 0 errors.
- [x] Manual test: fixture folder with a known scaffold marker and `Status: Complete` fails under the default invocation (no `SPECKIT_RULES` set).
- [x] Document the pre-existing test-coverage gap (no dual-path equivalence test) in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual (packet-wide) | `validate.sh --strict --recursive` across `030-deep-loop-improved` | bash |
| Manual (fixture) | Known scaffold-marker fixture folder fails under the default invocation | bash |
| Regression (informal) | Existing native validator output unchanged before/after the bridge | manual diff of `validate.sh` output |
| Coverage gap (flagged, not solved) | No vitest suite currently imports or exercises `validateFolder()`'s dual-path branch logic | — |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-scaffold-content-002-deep-loop-runtime | Hard (sequencing) | Pending | Implementing this child before scaffold cleanup completes would break `validate.sh --strict` on packets still carrying scaffold markers |
| 004-scaffold-content-003-deep-loop-workflows | Hard (sequencing) | Pending | Same as above |
| 005-scaffold-content-004-through-007 | Hard (sequencing) | Pending | Same as above; also this child's direct Predecessor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validate.sh --strict --recursive` on the packet root shows new errors after wiring in the bridge, or a native validator's output changes.
- **Procedure**: `git checkout -- .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` (and the test file if touched); no other packet content touched.
<!-- /ANCHOR:rollback -->
