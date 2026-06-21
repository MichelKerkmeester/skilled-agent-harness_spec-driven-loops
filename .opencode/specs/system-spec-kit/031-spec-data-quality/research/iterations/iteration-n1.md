# Iteration N1: Cross-Artifact Consistency Gate and Self-Verification (Angle adherence)

Prove-first design for three adherence levers: a /analyze-style coverage-consistency gate, an embedded self-verification step, and generated-from provenance linking. Grounded in the real validator and templates. The loop frame holds: the prod retrieval floor (3 results) taxes RETRIEVAL candidates only, so every lever here is a write-time or completion-time adherence gate that BYPASSES the truncation law. Its value is the adherence and logic registers, not retrieval rank.

---

## FINDINGS (file:line)

### What spec-kit already verifies cross-artifact

- `validate.sh` is a rule orchestrator. It reads a rule registry, sources each rule's `run_check()`, and aggregates errors/warnings into exit codes 0/1/2. See `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:589` (`run_all_rules`) and `:1036` (`main`).
- The rule set is data-driven from `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:1`. Each entry has `rule_id`, `script_path`, `severity`, `category`. Adding a rule = one registry row plus one `rules/check-*.sh` file with a `run_check()`.
- An acceptance-criteria traceability scan ALREADY EXISTS: `AC_COVERAGE` at `validator-registry.json:51`, implemented in `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:167`. It counts spec ACs (`_ac_count_requirement_table:80`, `_ac_count_story_criteria:66`) and matches them against checklist traceability rows with file:line evidence (`_ac_analyze_traceability:125`). It is gated `info` severity, default-OFF behind `SPECKIT_AC_COVERAGE` (`check-ac-coverage.sh:9`, registry `flags:56`), and only fires when lifecycle is active (`_ac_lifecycle_active:50`).

### The three real gaps (confirmed, not inferred)

1. **No requirement-to-task coverage.** `AC_COVERAGE` checks spec-AC -> checklist-evidence. It does NOT check spec-REQ -> tasks.md. The tasks template has no requirement-id column at all: `templates/manifest/tasks.md.tmpl:46` declares the task format as `T### [P?] Description (file path)` with zero REQ linkage, and the phase bodies (`:51-78`) are generic `T001..T010` with no spec reference. So a P0 requirement (`spec.md.tmpl:94` REQ-001) can have zero tasks and nothing flags it. This is the GitHub spec-kit `/analyze` gap the brief names (stage-0 line 21).
2. **No constitution-conflict check.** The repo constitution is the durable behavior rules in `.opencode/skills/system-spec-kit/constitutional/` (confirmed dir listing: `comment-hygiene.md`, `scope-lock` via `spec-folder-naming.md`, `main-branch-direct-push.md`, `verify-before-completion-claims.md`, plus 14 more). No validator rule reads these against a spec. Grep for `constitution` across `scripts/rules/` returns zero rule logic, only unrelated staleness tooling (`constitutional-rule-staleness.cjs`).
3. **Self-verification is advisory prose, not an enforced step.** Templates carry HTML `SELF-CHECK:` comment blocks (`spec.md.tmpl:34-40`, `checklist.md.tmpl:32-38`) and `tasks.md.tmpl` completion criteria (`:82-88`). These are read-by-AI hints with no mechanical re-check. `EVIDENCE_CITED` (`check-evidence.sh:30`) verifies that completed checklist items cite evidence, but never re-derives the requirement list to confirm each requirement was actually addressed.

---

## CONCRETE CHANGE

### (a) /analyze-style coverage-consistency gate as a validate.sh extension

A new rule `REQ_COVERAGE` plus a complementary `CONSTITUTION_CONSISTENCY` rule, both registered the same way `AC_COVERAGE` is.

REQ_COVERAGE (`rules/check-req-coverage.sh`, registry severity `warn`, default-OFF behind `SPECKIT_REQ_COVERAGE`, mirroring the `AC_COVERAGE` opt-in shape at `check-ac-coverage.sh:9`):
- Extract every requirement id from the spec requirements anchor. The anchor and id shape already exist: `spec.md.tmpl:91` `<!-- ANCHOR:requirements -->` and `:98` `| REQ-001 | ... |`. Parse `REQ-[0-9]+` and `SC-[0-9]+` (`spec.md.tmpl:112`) inside the `requirements` and `success-criteria` anchors only, fence-blind like `_ac_count_requirement_table` (`check-ac-coverage.sh:85`).
- Extract every requirement reference from tasks.md. This requires the template change below: tasks gain an optional `(REQ-001)` or `[REQ-001]` token. Parse those tokens across all phase anchors.
- Report: for each spec REQ, the count of covering tasks. Zero-coverage P0/P1 requirements -> WARN with the orphan list; coverage at or above floor -> PASS. Reuse the floor mechanics from `_ac_required_count` (`check-ac-coverage.sh:39`) and `SPECKIT_REQ_COVERAGE_FLOOR`.
- Run the inverse direction too: tasks that reference a REQ id absent from the spec -> WARN (a contradiction signal, the spec-kit `/analyze` "ambiguity/conflict" class).

CONSTITUTION_CONSISTENCY (`rules/check-constitution-consistency.sh`, `info` first, default-OFF behind `SPECKIT_CONSTITUTION_CHECK`):
- This is the honest-scope version. A bash rule CANNOT semantically judge whether a spec contradicts `comment-hygiene.md`. What it CAN do deterministically: scan the spec scope/files-to-change table (`spec.md.tmpl:84`) and detect declared touches that collide with a HARD constitutional rule, by keyword. Concrete deterministic checks: a `Files to Change` row touching `main` branch policy, or a scope line proposing to write code comments with artifact ids (the exact thing `comment-hygiene.md` HARD-blocks). Emit each hit as an `info` pointer to the relevant `constitutional/*.md`, never an auto-fail.
- The semantic half (does this requirement contradict a constitutional principle) is left to the self-verification step (b) and the LLM-judge candidate from another angle, NOT claimed by this bash rule. State that boundary in the rule's own message.

Both rules slot into `run_all_rules` with no orchestrator change, because the registry-driven loop (`validate.sh:474` `get_rule_scripts`) already discovers any registry row whose `script_path` resolves to a `rules/check-*.sh` with `run_check()`.

### (b) Embedded self-verification step (Addy Osmani pattern)

Two parts, because the advisory SELF-CHECK comments already prove the prose-only version does not bind.

Part 1, template binding: add a dedicated `<!-- ANCHOR:self-verification -->` section to `implementation-summary.md.tmpl` (the completion artifact) with an explicit re-check table the AI must fill before claiming done:

```
| REQ id | Addressed by | Re-checked against AC | Verdict |
|--------|--------------|-----------------------|---------|
| REQ-001 | T004, T006 | spec.md:98 AC | PASS (evidence: file:line) |
```

This makes the Osmani "re-check output against the requirements list before completion" a structured artifact, not a hidden hint.

Part 2, completion-gate enforcement: extend the COMPLETION VERIFICATION RULE path. The completion gate already runs `validate.sh --strict` (CLAUDE.md COMPLETION VERIFICATION RULE step 1) and loads `checklist.md`. Add a `strict_only` rule `SELF_VERIFICATION_PRESENT` (mirroring `CONTINUITY_FRESHNESS` strict-only shape at `validator-registry.json:296`) that, under `--strict`, fails when an `implementation-summary.md` claims a Complete/Done status (status parsing already exists at `check-ac-coverage.sh:61`) but the self-verification table has unfilled placeholders or a REQ with no `Addressed by` entry. This converts the prose self-check into a mechanical completion blocker, which is the only version that survives the adherence ceiling.

### (c) Generated-from / numbered-requirement provenance linking (Kiro pattern)

Add a requirement-id column to the tasks template and a generated-from marker to checklist items.

tasks.md.tmpl change: extend the task format line (`tasks.md.tmpl:46`) from `T### [P?] Description (file path)` to `T### [P?] Description (file path) [REQ-NNN]`, and add a notation-table row documenting `[REQ-NNN]` as the satisfied-requirement back-pointer. Phase bodies (`:54-77`) get one example each, eg `T004 [Implement core feature 1] (src/x.js) [REQ-001]`. This is the load-bearing token REQ_COVERAGE (a) parses.

checklist.md.tmpl change: the checklist already has CHK-ids (`checklist.md.tmpl:60` `CHK-001`). Add an optional `<- REQ-NNN` provenance suffix convention so each verification item declares which spec requirement it satisfies, eg `CHK-020 [P0] All acceptance criteria met <- REQ-001`. This is the Kiro generated-from marker: every downstream item names its upstream source.

The provenance link is then machine-traversable in BOTH directions: REQ_COVERAGE (a) reads task `[REQ-NNN]` tokens; a checklist-side variant reads `<- REQ-NNN` suffixes; and `AC_COVERAGE` (already shipped) continues to read the checklist evidence column. The three compose into a coverage graph spec-REQ -> task -> checklist-item -> evidence with no new storage.

---

## EVIDENCE

- Registry-driven extensibility is proven, not hoped: `AC_COVERAGE` is a working, shipped instance of exactly this pattern (opt-in spec-AC traceability rule), `check-ac-coverage.sh:167` + `validator-registry.json:51`. REQ_COVERAGE reuses its floor math (`:39`), lifecycle gate (`:50`), fence-blind parse (`:85`), and status parse (`:61`) verbatim in shape.
- The orphan-requirement gap is confirmed by the tasks template carrying zero REQ linkage: `tasks.md.tmpl:46` format line and `:51-78` generic phase bodies.
- The constitution exists as real files (dir listing of `constitutional/` returned 19 `.md` rules) and is referenced by CLAUDE.md as HARD blockers, yet zero rule logic reads them (grep of `scripts/rules/` for `constitution` = no rule hits).
- The self-verification ceiling is acknowledged in the brief itself (stage-0:25, Fowler/Bockeler): no spec format guarantees adherence, so pair structure with a verification GATE. The (b) Part-2 completion blocker is that gate.

External anchors from the brief: GitHub spec-kit `/analyze` cross-artifact consistency gate (stage-0:21), Addy Osmani embedded self-verification + three-tier constraints (stage-0:23), Kiro generated-from markers (stage-0:22).

---

## READER

- (a) REQ_COVERAGE serves the IMPLEMENTING AGENT at plan/task time and the COMPLETION GATE: it answers "did every P0/P1 requirement get a task" before code is claimed done. Second reader: a future maintainer auditing whether scope was actually delivered.
- (a) CONSTITUTION_CONSISTENCY serves the AUTHORING AGENT: surfaces a spec scope line that collides with a known HARD rule before work starts.
- (b) Self-verification serves the COMPLETION GATE and the OPERATOR reviewing the impl-summary: it turns "I'm done" into a per-requirement re-check ledger.
- (c) Provenance linking serves RETRIEVAL-ADJACENT READERS too: a deterministic header-path-style chain (the confirmed quick-win) means a retrieved task chunk can name its parent REQ inline, improving the logic register of any single chunk even under the 3-result truncation floor.

---

## ON-WRITE OR RETROACTIVE

- (a) REQ_COVERAGE: ON-WRITE for new packets (template-driven, the `[REQ-NNN]` token is authored). RETROACTIVE for existing packets is a NO-OP-safe pass: with default-OFF flag and `info`/`warn` severity it never breaks the existing corpus, exactly as `AC_COVERAGE` ships disabled. Old tasks.md without tokens simply report zero-coverage-unknown, not a failure.
- (a) CONSTITUTION_CONSISTENCY: ON-WRITE advisory at spec-authoring time; default-OFF and `info` so it is silent on the legacy corpus.
- (b) Self-verification table: ON-WRITE (new `implementation-summary` anchor). The `SELF_VERIFICATION_PRESENT` strict gate is ON-WRITE for new completions; legacy completed packets are grandfathered via the same `legacy_grandfathered` flag the validator already honors (`validate.sh:175` `detect_legacy_grandfathered`).
- (c) Template token changes: ON-WRITE only. No migration of existing tasks/checklists; the parsers treat a missing token as "unlinked", never as an error.

This staged shape matches the corpus reality: hundreds of existing packets cannot be retro-tokenized cheaply, so every lever is additive, default-OFF or grandfathered, and graduates to `warn`/blocking only for packets authored after adoption.

---

## RISK

- **Adherence ceiling is the headline caveat.** None of these force the AI to write CORRECT tasks or HONEST self-checks. REQ_COVERAGE proves a `[REQ-NNN]` token exists on some task, not that the task actually implements the requirement. Self-verification proves the ledger is filled, not that the re-check was genuine. The brief states this directly (stage-0:25). The honest ceiling: these raise the floor (orphan requirements and empty completion ledgers become mechanically visible) but cannot close the gap between a filled cell and a true claim. The only hard backstop remains an independent reviewer or LLM-judge, which is a different angle's lever.
- **Gaming risk.** A `[REQ-NNN]` token is trivially pasteable. Mitigation is to keep REQ_COVERAGE at `warn` and lean on the self-verification ledger plus human/LLM review for substance, never to treat token-presence as proof of delivery.
- **Constitution check is semantically shallow by design.** The bash CONSTITUTION_CONSISTENCY rule does keyword collision detection only. Calling it a "constitution consistency gate" risks overclaiming; the rule message must state it is a deterministic pointer, not a semantic judge. The real semantic check belongs to self-verification (b) and the LLM-judge candidate.
- **Severity drift.** Promoting REQ_COVERAGE from `warn` to `error` prematurely would break legacy packets that lack tokens. Keep it default-OFF and `warn` until the token convention has propagated through the active corpus, then graduate per-packet via grandfathering, mirroring how `EVIDENCE_MARKER_LINT` stays strict-only (`validator-registry.json:305`).
- **Template churn.** Adding columns/anchors to tasks/checklist/impl-summary touches the template-source provenance (`TEMPLATE_SOURCE` rule, `validator-registry.json:240`) and template hashes (`templates/.hashes`); the change must bump the template version (`tasks.md.tmpl:32` `tasks-core | v2.2`) and the hash file or `validate_template_hashes` (`validate.sh:226`) stays silent-but-stale.
