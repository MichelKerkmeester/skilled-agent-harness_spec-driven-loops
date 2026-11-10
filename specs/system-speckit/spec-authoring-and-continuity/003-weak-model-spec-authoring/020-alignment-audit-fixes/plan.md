---
title: "Implementation Plan: Phase 20: alignment-audit-fixes"
description: "Fix the 46 audit findings lane by lane: DeepSeek V4.1 Flash through cli-pi makes each literal fix from one short brief, Sonnet makes each judgment fix, a fresh verifier re-checks every lane and re-audits the scope gap, and the conductor runs the close gates."
trigger_phrases:
  - "alignment audit fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: alignment-audit-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, bash, Markdown, JSON |
| **Framework** | system-spec-kit runtime and CLI, sk-doc create modes |
| **Storage** | None (the advisor SQLite graph is rebuilt, not changed by hand) |
| **Testing** | vitest (cli and runtime projects), shell guards, sk-doc validators |

### Overview
The fixes land in the files the audit names, one lane per file set. Each lane runs lead, judgment, verify and residual passes, and the conductor runs the close gates. The proof is the AST import check turning from exit 1 to exit 0, plus every check the lanes named passing on the final tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented: `scratch/audit/findings.json` holds 46 findings, each with a file, line, fix and fix class
- [x] Success criteria measurable: each finding names its check
- [x] Dependencies identified: `scratch/audit/scope2.txt` lists the corrected scope (224 lines)

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx tsx evals/check-no-mcp-lib-imports-ast.ts` from `runtime/cli` prints `AST import policy check passed` and exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: four parallel fix lanes over disjoint files.

### Key Components
- **Lane A, code**: the CLI allowlist, `check-example-drift.sh`, the shared stamp parser in `status-classifier.sh`, test headers and the orchestrator TSDoc.
- **Lane B, skill docs**: `SKILL.md`, the feature catalog, the manual testing playbook, `templates/` and `references/`.
- **Lane C, READMEs and changelogs**: the root and skill READMEs, the system-spec-kit release entries and the 054 packet changelogs.
- **Lane D, routing**: the orchestrate agent and its mirrors, the speckit command docs, the advisor metadata and compiled graph, plus the critic's `.env.example`, matrix and example findings.

### Data Flow
`findings.json` feeds one brief per finding. A literal finding goes to DeepSeek through cli-pi, a judgment finding to Sonnet. The lead reviews each diff, and a fresh verifier re-checks the lane and re-audits its share of `scope2.txt`. A residual pass fixes what the verifier found, and the close gates run once on the merged tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/evals/import-policy-allowlist.json` | The shared import policy the CLI gate enforces | update | AST import check exits 0 |
| `lib/status-classifier.sh` `speckit_template_stamp` | Producer of the stamp parse for the shell rules | update | `placeholder-token-gate` and `measured-behavior-rule` tests pass |
| `rules/check-placeholders.sh`, `rules/check-scaffold-never-touched.sh`, `spec/check-placeholders.sh` | Callers of `speckit_carries_token_gate_stamp` | unchanged | `placeholder-token-gate` and `validation-gate-hardening` pass |
| `orchestrator.ts` `carriesTokenGateStamp`, `packet-synopsis.ts` `carriesClauseCutStamp` | TypeScript stamp parses | unchanged, out of scope | same semantics, separate code |
| `.codex`, `.pi`, `.hermes` agent and skill copies | Generated mirrors of the orchestrate agent and `SKILL.md` | regenerated | each sync `--check` prints PASS |
| `skill-graph.json` | Compiled advisor graph CI checks | regenerated | `skill-graph-freshness.cjs --strict` exits 0 |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup holds the audit, Implementation the four lanes, and Verification the close gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Seven CLI test files: measured-behavior-rule, example-drift, card-sync, template-fill-guidance, draft-auto-repair, placeholder-token-gate, post-edit-placeholder-scan | `npx vitest run --config ../../vitest.config.ts --project cli` from `runtime/cli` |
| Integration | CLI `npm run check`, catalog and playbook validators, skill package gate, mirror checks, skill graph freshness, trigger index `--check` | node, python3 |
| Manual | Playbook scenarios 485 and 486 run verbatim, advisor probes before and after | bash, `skill-advisor.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi with `llmgateway/deepseek-v4.1-flash-1017` | External | Green | Literal fixes fall back to a Sonnet implementer |
| `shellcheck` | External | Green | Shell lint skipped and recorded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a targeted check that passed before this phase fails after it, or the advisor sends an sk-doc prompt to system-spec-kit.
- **Procedure**: the work is uncommitted, so revert the named file in the working tree. For the advisor, restore `skill-graph.sqlite.pre-doctor-skill-advisor-rebuild.20261026T200712.bak` and rerun `skill_graph_compiler.py --export-json`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (audit and scope list) | Phases 001 to 019 | Implementation |
| Implementation (four lanes, verify and residual passes) | Setup | Verification |
| Verification (close gates and this folder's validate) | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
