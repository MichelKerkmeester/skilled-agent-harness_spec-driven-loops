---
title: "Deep Review Strategy - 054-weak-model-spec-authoring (fan-out lineage pi-deepseek-2)"
description: "Persistent review brain for the wave2 fan-out lineage pi-deepseek-2 over the weak-model spec authoring phase parent."
trigger_phrases:
  - "deep review strategy"
  - "weak model spec authoring review"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - 054-weak-model-spec-authoring

## 1. REVIEW CHARTER

- **Target:** `specs/system-speckit/054-weak-model-spec-authoring` (spec-folder, phase parent, Level 2 marker with nine Level 3 phase children).
- **Dimensions:** correctness, security, traceability, maintainability.
- **Stop conditions:** `maxIterations` = 10 under `stopPolicy: max-iterations`; convergence is telemetry only for this lineage.
- **Success criteria:** every dimension covered at least once, every finding carries `[SOURCE: path:line]` evidence, and synthesis reports one derived verdict.
- **Review angle ladder (breadth first, one dimension per iteration):**
  1. Correctness — packet self-consistency of the parent docs (spec.md, goal.md, phase map, description metadata).
  2. Traceability — parent completion criteria against phase 009 closeout evidence artifacts.
  3. Correctness — phase 003 versioned placeholder gate behavior against its stated Draft/later-status contract.
  4. Security — gate bypass surface: status detection, marker parsing, path handling, env precedence in the placeholder gate family.
  5. Correctness — the phase 004/005 guard scripts (`check-example-drift.sh`, `check-card-sync.sh`) versus what they claim to guard.
  6. Traceability — phase 006 claim that every speckit/doctor command and doc-authoring agent names the card, the v2.3 token and the guard scripts.
  7. Maintainability — phase 007 documentation alignment plus phase 008 playbook execution evidence.
  8. Correctness — phase 009 benchmark methodology and metric arithmetic against the recorded run artifacts.
  9. Maintainability — v2.3 template fill guidance and anchor contract consistency across the four core templates.
  10. Security and traceability residuals — unfollowed authoring-contract edges, leftover state, comment hygiene, and anything the first nine passes did not claim.

## 2. TOPIC

An autonomous fan-out review of the phase parent that claims to make system-spec-kit templates followable by a weak-model swarm: nine phases covering template/example repair, a versioned placeholder gate, per-section fill guidance, an authoring card, command and agent alignment, playbook/catalog/README alignment, playbook execution, and a before/after authoring benchmark.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-running the benchmark or the playbooks; the review is observation-only.
- Judging the operator's executor choices recorded in `goal.md` section 4.
- Reviewing `sk-prompt`, which the packet freezes out of scope.
- Any write to the reviewed packet, the templates, or the validator.

---

## 5. STOP CONDITIONS

- Hard ceiling of 10 iterations (`stopPolicy: max-iterations`).
- Convergence signal is recorded but does not shorten the loop; later iterations broaden the angle instead.
- Halt early only on an unrecoverable gateway refusal or a missing artifact directory.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 6
- P2 (Suggestions): 18
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the packet's own planning documents before the implementation surface: the goal log states the intended contract, so a divergence between claim and artifact is visible without re-deriving intent (iteration 1).
- Anchoring every claim to a `path:line` read rather than to a phase summary, because phase summaries themselves are part of the audited surface (iteration 1).

---

## 9. WHAT FAILED

- Treating the parent `spec.md` status table as authoritative evidence: it is a claim under review, not a source of truth (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`agent_cross_runtime` (overlay)**: `.skilled/agents/markdown.md` versus `.claude/agents/markdown.md` differ only in frontmatter (`mode`/`permission` versus `model`/`tools`) and in the one canonical-path line each runtime is required to state. No semantic drift. `code.md`, `context.md`, `markdown.md` and `orchestrate.md` are mirrored into `.hermes/skills/agent-*` by a generator, so a hand edit cannot diverge there without regenerating. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **`agent_cross_runtime` (overlay)**: `.skilled/agents/markdown.md` versus `.claude/agents/markdown.md` differ only in frontmatter (`mode`/`permission` versus `model`/`tools`) and in the one canonical-path line each runtime is required to state. No semantic drift. `code.md`, `context.md`, `markdown.md` and `orchestrate.md` are mirrored into `.hermes/skills/agent-*` by a generator, so a hand edit cannot diverge there without regenerating.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`agent_cross_runtime` (overlay)**: `.skilled/agents/markdown.md` versus `.claude/agents/markdown.md` differ only in frontmatter (`mode`/`permission` versus `model`/`tools`) and in the one canonical-path line each runtime is required to state. No semantic drift. `code.md`, `context.md`, `markdown.md` and `orchestrate.md` are mirrored into `.hermes/skills/agent-*` by a generator, so a hand edit cannot diverge there without regenerating.

### **`checklist_evidence` per phase** (core): `009/acceptance-criteria.md` holds 15 `| Met | - |` rows, `009/spec.md:36`, `009/implementation-summary.md:40` and `009/acceptance-criteria.md:41` all read `Complete`. `rg '\| (Waived|Superseded) \|'` over all nine phase tables returns no rows, so no row closes on a waiver. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`checklist_evidence` per phase** (core): `009/acceptance-criteria.md` holds 15 `| Met | - |` rows, `009/spec.md:36`, `009/implementation-summary.md:40` and `009/acceptance-criteria.md:41` all read `Complete`. `rg '\| (Waived|Superseded) \|'` over all nine phase tables returns no rows, so no row closes on a waiver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`checklist_evidence` per phase** (core): `009/acceptance-criteria.md` holds 15 `| Met | - |` rows, `009/spec.md:36`, `009/implementation-summary.md:40` and `009/acceptance-criteria.md:41` all read `Complete`. `rg '\| (Waived|Superseded) \|'` over all nine phase tables returns no rows, so no row closes on a waiver.

### **`feature_catalog_code` and `playbook_capability`**: still deferred, to iteration 7. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **`feature_catalog_code` and `playbook_capability`**: still deferred, to iteration 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`feature_catalog_code` and `playbook_capability`**: still deferred, to iteration 7.

### **`feature_catalog_code`**: the catalog links resolve, and each of the three new catalog entries named by the index exists (`versioned-placeholder-gate`, `example-drift-guard`, `template-section-fill-guidance`, `spec-authoring-card`). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **`feature_catalog_code`**: the catalog links resolve, and each of the three new catalog entries named by the index exists (`versioned-placeholder-gate`, `example-drift-guard`, `template-section-fill-guidance`, `spec-authoring-card`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`feature_catalog_code`**: the catalog links resolve, and each of the three new catalog entries named by the index exists (`versioned-placeholder-gate`, `example-drift-guard`, `template-section-fill-guidance`, `spec-authoring-card`).

### **`playbook_capability`**: all eight scenario ids the packet added (476 to 483) appear in the index with a title, a relative file link and a catalog link, and each id has a scenario file under `template-authoring/`. Phase 007's handoff criterion holds. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **`playbook_capability`**: all eight scenario ids the packet added (476 to 483) appear in the index with a title, a relative file link and a catalog link, and each id has a scenario file under `template-authoring/`. Phase 007's handoff criterion holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`playbook_capability`**: all eight scenario ids the packet added (476 to 483) appear in the index with a title, a relative file link and a catalog link, and each id has a scenario file under `template-authoring/`. Phase 007's handoff criterion holds.

### **`seconds` is reported, not scored**: the report states the load caveat (`README.md:165`), and the verdict rule names only the three stability metrics, so the timing difference cannot move the verdict. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **`seconds` is reported, not scored**: the report states the load caveat (`README.md:165`), and the verdict rule names only the three stability metrics, so the timing difference cannot move the verdict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`seconds` is reported, not scored**: the report states the load caveat (`README.md:165`), and the verdict rule names only the three stability metrics, so the timing difference cannot move the verdict.

### **`skill_agent` (overlay)**: the `spec-doc` route in `markdown.md:208` is correct and specific — card first, then the matching filled example, with the template described as "the section contract, not a model to copy". This is the shape the criterion wants. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **`skill_agent` (overlay)**: the `spec-doc` route in `markdown.md:208` is correct and specific — card first, then the matching filled example, with the template described as "the section contract, not a model to copy". This is the shape the criterion wants.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`skill_agent` (overlay)**: the `spec-doc` route in `markdown.md:208` is correct and specific — card first, then the matching filled example, with the template described as "the section contract, not a model to copy". This is the shape the criterion wants.

### **`skill_agent` and `agent_cross_runtime`**: closed in iteration 6 with two P2 findings; not reopened. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **`skill_agent` and `agent_cross_runtime`**: closed in iteration 6 with two P2 findings; not reopened.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`skill_agent` and `agent_cross_runtime`**: closed in iteration 6 with two P2 findings; not reopened.

### **`validate.sh` is a front-end only**: its header states it "implements no rules", and it resolves `dist/lib/validation/orchestrator.js` with a freshness check (`validate.sh:21-22,323-353`). The production verdict is therefore the orchestrator's, which is why finding 1 is scoped as a mirror/harness divergence rather than a wrong production verdict. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`validate.sh` is a front-end only**: its header states it "implements no rules", and it resolves `dist/lib/validation/orchestrator.js` with a freshness check (`validate.sh:21-22,323-353`). The production verdict is therefore the orchestrator's, which is why finding 1 is scoped as a mirror/harness divergence rather than a wrong production verdict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`validate.sh` is a front-end only**: its header states it "implements no rules", and it resolves `dist/lib/validation/orchestrator.js` with a freshness check (`validate.sh:21-22,323-353`). The production verdict is therefore the orchestrator's, which is why finding 1 is scoped as a mirror/harness divergence rather than a wrong production verdict.

### **Anchor contract**: the example drift guard compares each hand-written example's anchor set to the template's contract and exits 0, so the v2.3 headings did not desynchronise the anchors; the packet's own `missing_anchors` metric is 0 on the deciding set. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Anchor contract**: the example drift guard compares each hand-written example's anchor set to the template's contract and exits 0, so the v2.3 headings did not desynchronise the anchors; the packet's own `missing_anchors` metric is 0 on the deciding set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Anchor contract**: the example drift guard compares each hand-written example's anchor set to the template's contract and exits 0, so the v2.3 headings did not desynchronise the anchors; the packet's own `missing_anchors` metric is 0 on the deciding set.

### **Arithmetic, re-derived**: the deciding delta's means reproduce from the run rows — baseline `seconds` 242/217/298 gives 252.33, final 189/228/164 gives 193.67, delta `-58.7`; `leftover_hints` 1/0/0 and 0/1/0 both give 0.333, delta 0; `missing_anchors` is 0 on both sides; `strict_passed` is 1 everywhere. The rule scored all three deciding runs `counted=0` (`rule-scores.txt`), which is what makes the anchor cell 0. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Arithmetic, re-derived**: the deciding delta's means reproduce from the run rows — baseline `seconds` 242/217/298 gives 252.33, final 189/228/164 gives 193.67, delta `-58.7`; `leftover_hints` 1/0/0 and 0/1/0 both give 0.333, delta 0; `missing_anchors` is 0 on both sides; `strict_passed` is 1 everywhere. The rule scored all three deciding runs `counted=0` (`rule-scores.txt`), which is what makes the anchor cell 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Arithmetic, re-derived**: the deciding delta's means reproduce from the run rows — baseline `seconds` 242/217/298 gives 252.33, final 189/228/164 gives 193.67, delta `-58.7`; `leftover_hints` 1/0/0 and 0/1/0 both give 0.333, delta 0; `missing_anchors` is 0 on both sides; `strict_passed` is 1 everywhere. The rule scored all three deciding runs `counted=0` (`rule-scores.txt`), which is what makes the anchor cell 0.

### **Baseline reuse is deliberate and stated**: every final set is scored against the same three DeepSeek baseline runs at the packet start commit, and `delta.md` and the report both say so. Reusing one baseline across four final sets is the correct design here, since the baseline tree never changed. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Baseline reuse is deliberate and stated**: every final set is scored against the same three DeepSeek baseline runs at the packet start commit, and `delta.md` and the report both say so. Reusing one baseline across four final sets is the correct design here, since the baseline tree never changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Baseline reuse is deliberate and stated**: every final set is scored against the same three DeepSeek baseline runs at the packet start commit, and `delta.md` and the report both say so. Reusing one baseline across four final sets is the correct design here, since the baseline tree never changed.

### **Brief parity**: `cmp` reports all three deciding briefs (`fresh2/briefs/T005-1..3.txt`) byte-identical to the baseline briefs (`baseline-deepseek/brief-1..3.txt`), so both sides ran one task, not two. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Brief parity**: `cmp` reports all three deciding briefs (`fresh2/briefs/T005-1..3.txt`) byte-identical to the baseline briefs (`baseline-deepseek/brief-1..3.txt`), so both sides ran one task, not two.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Brief parity**: `cmp` reports all three deciding briefs (`fresh2/briefs/T005-1..3.txt`) byte-identical to the baseline briefs (`baseline-deepseek/brief-1..3.txt`), so both sides ran one task, not two.

### **C1 `validate.sh --recursive --strict` prints `RESULT: PASSED`** (`goal.md:90`): `009/scratch/amend3/validate-recursive.txt` ends `RESULT: PASSED`, and `scratch/closeout/criteria.txt:1` records the reproof after the third amendment. Consistent. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **C1 `validate.sh --recursive --strict` prints `RESULT: PASSED`** (`goal.md:90`): `009/scratch/amend3/validate-recursive.txt` ends `RESULT: PASSED`, and `scratch/closeout/criteria.txt:1` records the reproof after the third amendment. Consistent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **C1 `validate.sh --recursive --strict` prints `RESULT: PASSED`** (`goal.md:90`): `009/scratch/amend3/validate-recursive.txt` ends `RESULT: PASSED`, and `scratch/closeout/criteria.txt:1` records the reproof after the third amendment. Consistent.

### **C2 v2.3 Draft-vs-later status behavior** (`goal.md:91`): `criteria.txt:2` records `draft=RESULT: PASSED complete_errors=1 v22_with_tokens_errors=1 clean_v22_complete_placeholder_errors=0 clean_v22_rule_result=RESULT: PASSED`. The four cells are the four cells the criterion names. The implementation itself is audited in iterations 3 and 4. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **C2 v2.3 Draft-vs-later status behavior** (`goal.md:91`): `criteria.txt:2` records `draft=RESULT: PASSED complete_errors=1 v22_with_tokens_errors=1 clean_v22_complete_placeholder_errors=0 clean_v22_rule_result=RESULT: PASSED`. The four cells are the four cells the criterion names. The implementation itself is audited in iterations 3 and 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **C2 v2.3 Draft-vs-later status behavior** (`goal.md:91`): `criteria.txt:2` records `draft=RESULT: PASSED complete_errors=1 v22_with_tokens_errors=1 clean_v22_complete_placeholder_errors=0 clean_v22_rule_result=RESULT: PASSED`. The four cells are the four cells the criterion names. The implementation itself is audited in iterations 3 and 4.

### **C3 recursive strict parity before and after** (`goal.md:92`): verified at the record level rather than accepted. `scratch/closeout/b-final.tsv` has 4688 rows with `192 FAIL` and `4496 PASS`; `b-before.cut` and `b-final.cut` are byte-identical under `cmp` (0 differing rows). The goal log discloses how the merged file was assembled, including `done-part1.tsv` rows that have no committed shard file (`009/goal.md:122`), so the parity claim rests on the merged records, not on a reproducible shard set. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **C3 recursive strict parity before and after** (`goal.md:92`): verified at the record level rather than accepted. `scratch/closeout/b-final.tsv` has 4688 rows with `192 FAIL` and `4496 PASS`; `b-before.cut` and `b-final.cut` are byte-identical under `cmp` (0 differing rows). The goal log discloses how the merged file was assembled, including `done-part1.tsv` rows that have no committed shard file (`009/goal.md:122`), so the parity claim rests on the merged records, not on a reproducible shard set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **C3 recursive strict parity before and after** (`goal.md:92`): verified at the record level rather than accepted. `scratch/closeout/b-final.tsv` has 4688 rows with `192 FAIL` and `4496 PASS`; `b-before.cut` and `b-final.cut` are byte-identical under `cmp` (0 differing rows). The goal log discloses how the merged file was assembled, including `done-part1.tsv` rows that have no committed shard file (`009/goal.md:122`), so the parity claim rests on the merged records, not on a reproducible shard set.

### **C5 deciding set** (`goal.md:94`): `scratch/amend3/fresh2/delta.json` reproduces the goal log's baseline (leftover 1/0/0, seconds 242/217/298, mean 252.33) and the final side (0/1/0, seconds 189/228/164, mean 193.67); `rule-scores.txt` holds three `counted=0` lines, so the counted anchor shortfall is 0 on every run. The no-regression rule holds: leftover max 1 against 1, anchors 0 against 0, out-of-scope 0 against 0. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **C5 deciding set** (`goal.md:94`): `scratch/amend3/fresh2/delta.json` reproduces the goal log's baseline (leftover 1/0/0, seconds 242/217/298, mean 252.33) and the final side (0/1/0, seconds 189/228/164, mean 193.67); `rule-scores.txt` holds three `counted=0` lines, so the counted anchor shortfall is 0 on every run. The no-regression rule holds: leftover max 1 against 1, anchors 0 against 0, out-of-scope 0 against 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **C5 deciding set** (`goal.md:94`): `scratch/amend3/fresh2/delta.json` reproduces the goal log's baseline (leftover 1/0/0, seconds 242/217/298, mean 252.33) and the final side (0/1/0, seconds 189/228/164, mean 193.67); `rule-scores.txt` holds three `counted=0` lines, so the counted anchor shortfall is 0 on every run. The no-regression rule holds: leftover max 1 against 1, anchors 0 against 0, out-of-scope 0 against 0.

### **C6 playbook scenarios** (`goal.md:95`): `.skilled/.../2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv` holds 8 data rows (476 to 483), every one `PASS`, matching the eight scenario ids in `criteria.txt:9`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **C6 playbook scenarios** (`goal.md:95`): `.skilled/.../2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv` holds 8 data rows (476 to 483), every one `PASS`, matching the eight scenario ids in `criteria.txt:9`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **C6 playbook scenarios** (`goal.md:95`): `.skilled/.../2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv` holds 8 data rows (476 to 483), every one `PASS`, matching the eight scenario ids in `criteria.txt:9`.

### **C7 local commits only** (`goal.md:96`): `criteria.txt:10` records `remote_branches_with_head=0` at three successive heads. Not re-derived here: the branch has since received merges from `main`, so a present-day check would measure a different question. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **C7 local commits only** (`goal.md:96`): `criteria.txt:10` records `remote_branches_with_head=0` at three successive heads. Not re-derived here: the branch has since received merges from `main`, so a present-day check would measure a different question.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **C7 local commits only** (`goal.md:96`): `criteria.txt:10` records `remote_branches_with_head=0` at three successive heads. Not re-derived here: the branch has since received merges from `main`, so a present-day check would measure a different question.

### **Card-sync sensitivity**: all nine checks pass on the shipped tree (`card-exists (172 lines)`, four intents, `guide-on-demand-only`, `leaf-manifest`, `leaf-aliases`, `checklist`). Each positive check is an existence assertion over a parsed surface, so removing the card or its manifest entry fails closed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Card-sync sensitivity**: all nine checks pass on the shipped tree (`card-exists (172 lines)`, four intents, `guide-on-demand-only`, `leaf-manifest`, `leaf-aliases`, `checklist`). Each positive check is an existence assertion over a parsed surface, so removing the card or its manifest entry fails closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Card-sync sensitivity**: all nine checks pass on the shipped tree (`card-exists (172 lines)`, four intents, `guide-on-demand-only`, `leaf-manifest`, `leaf-aliases`, `checklist`). Each positive check is an existence assertion over a parsed surface, so removing the card or its manifest entry fails closed.

### **Comment hygiene of the new code**: the added gate functions (`orchestrator.ts:661-762`), the narrowed rule, and both guard scripts carry no spec path, no packet number, no task id and no acceptance id. Their comments state the durable reason ("a doc stamped with this template version or a later one ships every authoring hint as a value token", "only a value token is deferred"). Clean. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Comment hygiene of the new code**: the added gate functions (`orchestrator.ts:661-762`), the narrowed rule, and both guard scripts carry no spec path, no packet number, no task id and no acceptance id. Their comments state the durable reason ("a doc stamped with this template version or a later one ships every authoring hint as a value token", "only a value token is deferred"). Clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Comment hygiene of the new code**: the added gate functions (`orchestrator.ts:661-762`), the narrowed rule, and both guard scripts carry no spec path, no packet number, no task id and no acceptance id. Their comments state the durable reason ("a doc stamped with this template version or a later one ships every authoring hint as a value token", "only a value token is deferred"). Clean.

### **D2 "new docs only"** (`parent goal.md:36`, phase 003 decision): a doc with an older stamp keeps the error it always had, and `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` are scanned only when they carry the token-gate stamp (`rules/check-placeholders.sh:107-111`, `orchestrator.ts:720-723`). No existing packet gains a failure. Holds. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **D2 "new docs only"** (`parent goal.md:36`, phase 003 decision): a doc with an older stamp keeps the error it always had, and `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` are scanned only when they carry the token-gate stamp (`rules/check-placeholders.sh:107-111`, `orchestrator.ts:720-723`). No existing packet gains a failure. Holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **D2 "new docs only"** (`parent goal.md:36`, phase 003 decision): a doc with an older stamp keeps the error it always had, and `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` are scanned only when they carry the token-gate stamp (`rules/check-placeholders.sh:107-111`, `orchestrator.ts:720-723`). No existing packet gains a failure. Holds.

### **Doctor entry**: no file under `.skilled/commands/doctor` mentions the card. This matches the phase 006 goal log, which records a read-only re-audit of 91 doctor files with 0 authoring findings, so no row was owed. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Doctor entry**: no file under `.skilled/commands/doctor` mentions the card. This matches the phase 006 goal log, which records a read-only re-audit of 91 doctor files with 0 authoring findings, so no row was owed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Doctor entry**: no file under `.skilled/commands/doctor` mentions the card. This matches the phase 006 goal log, which records a read-only re-audit of 91 doctor files with 0 authoring findings, so no row was owed.

### **Fill-guidance coverage**: every `##` section of every v2.3 template carries one `FILL:` comment with a GOOD and a WEAK example — `spec.md.tmpl` 24/24, `plan.md.tmpl` 18/18, `tasks.md.tmpl` 22/22, `implementation-summary.md.tmpl` 6/6, `acceptance-criteria.md.tmpl` 3/3. Phase 004's claim holds at the section level. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Fill-guidance coverage**: every `##` section of every v2.3 template carries one `FILL:` comment with a GOOD and a WEAK example — `spec.md.tmpl` 24/24, `plan.md.tmpl` 18/18, `tasks.md.tmpl` 22/22, `implementation-summary.md.tmpl` 6/6, `acceptance-criteria.md.tmpl` 3/3. Phase 004's claim holds at the section level.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Fill-guidance coverage**: every `##` section of every v2.3 template carries one `FILL:` comment with a GOOD and a WEAK example — `spec.md.tmpl` 24/24, `plan.md.tmpl` 18/18, `tasks.md.tmpl` 22/22, `implementation-summary.md.tmpl` 6/6, `acceptance-criteria.md.tmpl` 3/3. Phase 004's claim holds at the section level.

### **Goal documents** are produced from `sk-create-goal` assets in `sk-doc`, not from a system-spec-kit template, so they are outside this packet's template surface and are not counted as a gap. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Goal documents** are produced from `sk-create-goal` assets in `sk-doc`, not from a system-spec-kit template, so they are outside this packet's template surface and are not counted as a gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Goal documents** are produced from `sk-create-goal` assets in `sk-doc`, not from a system-spec-kit template, so they are outside this packet's template surface and are not counted as a gap.

### **Guard sensitivity, proven rather than assumed**: a copy of `templates/examples/level-2` with `<!-- ANCHOR:metadata -->` removed fails with `missing_anchor metadata` and exit 1; the unmodified copy prints `EXAMPLE_DRIFT_OK` and exits 0. The anchor comparison is real and delegated to `template-structure.js compare`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Guard sensitivity, proven rather than assumed**: a copy of `templates/examples/level-2` with `<!-- ANCHOR:metadata -->` removed fails with `missing_anchor metadata` and exit 1; the unmodified copy prints `EXAMPLE_DRIFT_OK` and exits 0. The anchor comparison is real and delegated to `template-structure.js compare`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Guard sensitivity, proven rather than assumed**: a copy of `templates/examples/level-2` with `<!-- ANCHOR:metadata -->` removed fails with `missing_anchor metadata` and exit 1; the unmodified copy prints `EXAMPLE_DRIFT_OK` and exits 0. The anchor comparison is real and delegated to `template-structure.js compare`.

### **Measured tree equals the closed tree's template surface**: `git diff --name-only 74a629a7af 31dcbc2740 -- .skilled/skills/system-spec-kit/templates .skilled/skills/system-spec-kit/runtime` prints nothing, and the closing commit's stat over `.skilled` is five documentation files. The deciding runs therefore measured the template and runtime surface the packet shipped, which the criterion requires. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Measured tree equals the closed tree's template surface**: `git diff --name-only 74a629a7af 31dcbc2740 -- .skilled/skills/system-spec-kit/templates .skilled/skills/system-spec-kit/runtime` prints nothing, and the closing commit's stat over `.skilled` is five documentation files. The deciding runs therefore measured the template and runtime surface the packet shipped, which the criterion requires.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Measured tree equals the closed tree's template surface**: `git diff --name-only 74a629a7af 31dcbc2740 -- .skilled/skills/system-spec-kit/templates .skilled/skills/system-spec-kit/runtime` prints nothing, and the closing commit's stat over `.skilled` is five documentation files. The deciding runs therefore measured the template and runtime surface the packet shipped, which the criterion requires.

### **No dangling command in the new documentation**: `README.md:625-626` names both guard scripts and both files exist and are executable; the earlier `/spec_kit:resume` defect is already recorded as R1-P1-001 and is not restated. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **No dangling command in the new documentation**: `README.md:625-626` names both guard scripts and both files exist and are executable; the earlier `/spec_kit:resume` defect is already recorded as R1-P1-001 and is not restated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **No dangling command in the new documentation**: `README.md:625-626` names both guard scripts and both files exist and are executable; the earlier `/spec_kit:resume` defect is already recorded as R1-P1-001 and is not restated.

### **Overlay protocols**: `skill_agent`, `agent_cross_runtime` and `playbook_capability` passed in iterations 6 and 7; `feature_catalog_code` is partial (R7-P2-002). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Overlay protocols**: `skill_agent`, `agent_cross_runtime` and `playbook_capability` passed in iterations 6 and 7; `feature_catalog_code` is partial (R7-P2-002).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay protocols**: `skill_agent`, `agent_cross_runtime` and `playbook_capability` passed in iterations 6 and 7; `feature_catalog_code` is partial (R7-P2-002).

### **Packet-type templates deliberately stay on their older stamps**: `phase-parent-spec`, `research-record` and `review-record` read `v2.2` and `review-report` reads `v1.0`. That is consistent with D2, which freezes the token gate to v2.3 documents so no existing packet changes verdict; none of the four is on the weak-model authoring path. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Packet-type templates deliberately stay on their older stamps**: `phase-parent-spec`, `research-record` and `review-record` read `v2.2` and `review-report` reads `v1.0`. That is consistent with D2, which freezes the token gate to v2.3 documents so no existing packet changes verdict; none of the four is on the weak-model authoring path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Packet-type templates deliberately stay on their older stamps**: `phase-parent-spec`, `research-record` and `review-record` read `v2.2` and `review-report` reads `v1.0`. That is consistent with D2, which freezes the token gate to v2.3 documents so no existing packet changes verdict; none of the four is on the weak-model authoring path.

### **Phase 004 AC-005/AC-009** (`004/acceptance-criteria.md:58,62`): AC-005's evidence is the guard's own success string, which is exactly the string finding 1 shows can be produced without the comparison having run; AC-009's failing-first evidence (`drift guard: description holds an HTML comment tail`) does prove the description rules fire. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Phase 004 AC-005/AC-009** (`004/acceptance-criteria.md:58,62`): AC-005's evidence is the guard's own success string, which is exactly the string finding 1 shows can be produced without the comparison having run; AC-009's failing-first evidence (`drift guard: description holds an HTML comment tail`) does prove the description rules fire.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 004 AC-005/AC-009** (`004/acceptance-criteria.md:58,62`): AC-005's evidence is the guard's own success string, which is exactly the string finding 1 shows can be produced without the comparison having run; AC-009's failing-first evidence (`drift guard: description holds an HTML comment tail`) does prove the description rules fire.

### **Phase 004's section-guidance claim**: every `##` section of every core template carries one `<!-- FILL: ... GOOD: ... WEAK: ... -->` comment — `spec.md.tmpl` 24/24, `plan.md.tmpl` 18/18, `tasks.md.tmpl` 22/22, `implementation-summary.md.tmpl` 6/6. The fill-test count of 16 in `004/spec.md:43` counts required sections at the tested level, not all sections, so no contradiction. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Phase 004's section-guidance claim**: every `##` section of every core template carries one `<!-- FILL: ... GOOD: ... WEAK: ... -->` comment — `spec.md.tmpl` 24/24, `plan.md.tmpl` 18/18, `tasks.md.tmpl` 22/22, `implementation-summary.md.tmpl` 6/6. The fill-test count of 16 in `004/spec.md:43` counts required sections at the tested level, not all sections, so no contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 004's section-guidance claim**: every `##` section of every core template carries one `<!-- FILL: ... GOOD: ... WEAK: ... -->` comment — `spec.md.tmpl` 24/24, `plan.md.tmpl` 18/18, `tasks.md.tmpl` 22/22, `implementation-summary.md.tmpl` 6/6. The fill-test count of 16 in `004/spec.md:43` counts required sections at the tested level, not all sections, so no contradiction.

### **Phase 008 execution evidence**: every id has a transcript, a command file, a stderr file and a check file in `008/scratch/runs/` (four files per id, eight ids), and `results.csv` holds eight rows, all `PASS`, matching the two parent-facing claims (`goal.md:95`, `criteria.txt` line C6). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Phase 008 execution evidence**: every id has a transcript, a command file, a stderr file and a check file in `008/scratch/runs/` (four files per id, eight ids), and `results.csv` holds eight rows, all `PASS`, matching the two parent-facing claims (`goal.md:95`, `criteria.txt` line C6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 008 execution evidence**: every id has a transcript, a command file, a stderr file and a check file in `008/scratch/runs/` (four files per id, eight ids), and `results.csv` holds eight rows, all `PASS`, matching the two parent-facing claims (`goal.md:95`, `criteria.txt` line C6).

### **Post-edit scanner untouched** by design (`003/goal.md:50` D7, `plan.md:437-441` ADR-003), so its two recorded defects are not restated here; its security surface is iteration 4's subject. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Post-edit scanner untouched** by design (`003/goal.md:50` D7, `plan.md:437-441` ADR-003), so its two recorded defects are not restated here; its security surface is iteration 4's subject.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Post-edit scanner untouched** by design (`003/goal.md:50` D7, `plan.md:437-441` ADR-003), so its two recorded defects are not restated here; its security surface is iteration 4's subject.

### **README alignment**: `README.md:538` and `:624` describe the token lifecycle and the Draft warning correctly, including that a Draft v2.3 packet "may warn and still pass strict". This matches the orchestrator's behaviour and is a correct statement of the contract. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **README alignment**: `README.md:538` and `:624` describe the token lifecycle and the Draft warning correctly, including that a Draft v2.3 packet "may warn and still pass strict". This matches the orchestrator's behaviour and is a correct statement of the contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **README alignment**: `README.md:538` and `:624` describe the token lifecycle and the Draft warning correctly, including that a Draft v2.3 packet "may warn and still pass strict". This matches the orchestrator's behaviour and is a correct statement of the contract.

### **Retired `checklist.md` sweep**: with a pattern that excludes `*-checklist.md`, `rg -n "(^|[^-A-Za-z0-9_])checklist\.md" .skilled/commands .skilled/agents` returns nothing, so the 45-mention remediation in the command assets is complete for the retired template name. The earlier grep hits (`review-checklist.md`, `worktree-checklist.md`, `spec-folder-authoring-checklist.md`) are different files and are not regressions. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Retired `checklist.md` sweep**: with a pattern that excludes `*-checklist.md`, `rg -n "(^|[^-A-Za-z0-9_])checklist\.md" .skilled/commands .skilled/agents` returns nothing, so the 45-mention remediation in the command assets is complete for the retired template name. The earlier grep hits (`review-checklist.md`, `worktree-checklist.md`, `spec-folder-authoring-checklist.md`) are different files and are not regressions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Retired `checklist.md` sweep**: with a pattern that excludes `*-checklist.md`, `rg -n "(^|[^-A-Za-z0-9_])checklist\.md" .skilled/commands .skilled/agents` returns nothing, so the 45-mention remediation in the command assets is complete for the retired template name. The earlier grep hits (`review-checklist.md`, `worktree-checklist.md`, `spec-folder-authoring-checklist.md`) are different files and are not regressions.

### **Review-packet containment**: every artifact this review wrote under `review/wave2/lineages/pi-deepseek-2/` — `iterations/`, `deltas/`, `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md` — sits inside the lineage directory, and no phase folder was modified. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Review-packet containment**: every artifact this review wrote under `review/wave2/lineages/pi-deepseek-2/` — `iterations/`, `deltas/`, `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md` — sits inside the lineage directory, and no phase folder was modified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Review-packet containment**: every artifact this review wrote under `review/wave2/lineages/pi-deepseek-2/` — `iterations/`, `deltas/`, `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md` — sits inside the lineage directory, and no phase folder was modified.

### **Stamp coverage**: exactly five templates carry a `v2.3` `SPECKIT_TEMPLATE_SOURCE` stamp — the four core templates plus the acceptance-criteria addon — which matches phase 003's "seven stamp lines and five manifest entries read v2.3" once the three level-variant lines inside `spec.md.tmpl` are counted. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Stamp coverage**: exactly five templates carry a `v2.3` `SPECKIT_TEMPLATE_SOURCE` stamp — the four core templates plus the acceptance-criteria addon — which matches phase 003's "seven stamp lines and five manifest entries read v2.3" once the three level-variant lines inside `spec.md.tmpl` are counted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stamp coverage**: exactly five templates carry a `v2.3` `SPECKIT_TEMPLATE_SOURCE` stamp — the four core templates plus the acceptance-criteria addon — which matches phase 003's "seven stamp lines and five manifest entries read v2.3" once the three level-variant lines inside `spec.md.tmpl` are counted.

### **Stamp reader parity**: both scan the first 70 lines and both compare major/minor numerically rather than lexically, so `v2.10` outranks `v2.3`. Holds. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Stamp reader parity**: both scan the first 70 lines and both compare major/minor numerically rather than lexically, so `v2.10` outranks `v2.3`. Holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stamp reader parity**: both scan the first 70 lines and both compare major/minor numerically rather than lexically, so `v2.10` outranks `v2.3`. Holds.

### **Status classifier parity**: `speckit_status_trim` (`status-classifier.sh:13-33`) and `specStatusIsDraft` (`orchestrator.ts:694-712`) both strip bold/backticks, quotes, case, repeated spaces and trailing `.,;:!`. Both read the first `| Status |` row only. Holds. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Status classifier parity**: `speckit_status_trim` (`status-classifier.sh:13-33`) and `specStatusIsDraft` (`orchestrator.ts:694-712`) both strip bold/backticks, quotes, case, repeated spaces and trailing `.,;:!`. Both read the first `| Status |` row only. Holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Status classifier parity**: `speckit_status_trim` (`status-classifier.sh:13-33`) and `specStatusIsDraft` (`orchestrator.ts:694-712`) both strip bold/backticks, quotes, case, repeated spaces and trailing `.,;:!`. Both read the first `| Status |` row only. Holds.

### **Status surfaces agree where they are body status**: `spec.md:50` `Complete`, all nine phase rows `Complete`, `009/spec.md:36`, `009/implementation-summary.md:40` and `009/acceptance-criteria.md:41` `Complete`. The disagreement is confined to continuity frontmatter, which finding 1 records. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Status surfaces agree where they are body status**: `spec.md:50` `Complete`, all nine phase rows `Complete`, `009/spec.md:36`, `009/implementation-summary.md:40` and `009/acceptance-criteria.md:41` `Complete`. The disagreement is confined to continuity frontmatter, which finding 1 records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Status surfaces agree where they are body status**: `spec.md:50` `Complete`, all nine phase rows `Complete`, `009/spec.md:36`, `009/implementation-summary.md:40` and `009/acceptance-criteria.md:41` `Complete`. The disagreement is confined to continuity frontmatter, which finding 1 records.

### `[NEEDS CLARIFICATION]` (no colon) is excluded by the broad scan (`:161`) while the canonical rule requires a colon, so an open question without the colon is invisible to both. Checked for real occurrences: `rg '\[NEEDS CLARIFICATION\]'` outside `scratch/` and `changelog/` finds none, so the gap is latent, not live. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `[NEEDS CLARIFICATION]` (no colon) is excluded by the broad scan (`:161`) while the canonical rule requires a colon, so an open question without the colon is invisible to both. Checked for real occurrences: `rg '\[NEEDS CLARIFICATION\]'` outside `scratch/` and `changelog/` finds none, so the gap is latent, not live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `[NEEDS CLARIFICATION]` (no colon) is excluded by the broad scan (`:161`) while the canonical rule requires a colon, so an open question without the colon is invisible to both. Checked for real occurrences: `rg '\[NEEDS CLARIFICATION\]'` outside `scratch/` and `changelog/` finds none, so the gap is latent, not live.

### `check-card-sync.sh` handles its own argument errors (`--skill-root` without a path exits 2, unknown option exits 2) and reads its usage block from its own header, so `--help` cannot drift from the documented contract. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `check-card-sync.sh` handles its own argument errors (`--skill-root` without a path exits 2, unknown option exits 2) and reads its usage block from its own header, so `--help` cannot drift from the documented contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `check-card-sync.sh` handles its own argument errors (`--skill-root` without a path exits 2, unknown option exits 2) and reads its usage block from its own header, so `--help` cannot drift from the documented contract.

### `checklist_evidence` (core, deferred): phase acceptance rows are not yet audited; deferred to iteration 2. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` (core, deferred): phase acceptance rows are not yet audited; deferred to iteration 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core, deferred): phase acceptance rows are not yet audited; deferred to iteration 2.

### `D6` ("every phase is Level 3") is not contradicted by the parent's Level 2 marker: the parent is a phase parent and carries no `plan.md`/`tasks.md`, and each phase child declares `Level: 3`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `D6` ("every phase is Level 3") is not contradicted by the parent's Level 2 marker: the parent is a phase parent and carries no `plan.md`/`tasks.md`, and each phase child declares `Level: 3`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `D6` ("every phase is Level 3") is not contradicted by the parent's Level 2 marker: the parent is a phase parent and carries no `plan.md`/`tasks.md`, and each phase child declares `Level: 3`.

### `description.json` and `graph-metadata.json` are generated artefacts; their drift is recorded once (R1-P2-001) and not re-counted here. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `description.json` and `graph-metadata.json` are generated artefacts; their drift is recorded once (R1-P2-001) and not re-counted here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `description.json` and `graph-metadata.json` are generated artefacts; their drift is recorded once (R1-P2-001) and not re-counted here.

### `description.json`: `level: "2"` agrees with `spec.md:29` `SPECKIT_LEVEL: 2`; `specFolder`, `specId` and `folderSlug` agree with the folder name. `memoryNameHistory` carries one detached-review memory name, which is runtime bookkeeping, not a packet claim. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `description.json`: `level: "2"` agrees with `spec.md:29` `SPECKIT_LEVEL: 2`; `specFolder`, `specId` and `folderSlug` agree with the folder name. `memoryNameHistory` carries one detached-review memory name, which is runtime bookkeeping, not a packet claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `description.json`: `level: "2"` agrees with `spec.md:29` `SPECKIT_LEVEL: 2`; `specFolder`, `specId` and `folderSlug` agree with the folder name. `memoryNameHistory` carries one detached-review memory name, which is runtime bookkeeping, not a packet claim.

### `runs-meta.jsonl` records the per-run rule output and the diff-hash-changed flag per run, so a run that modified the `.skilled` tree would be visible. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `runs-meta.jsonl` records the per-run rule output and the diff-hash-changed flag per run, so a run that modified the `.skilled` tree would be visible.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `runs-meta.jsonl` records the per-run rule output and the diff-hash-changed flag per run, so a run that modified the `.skilled` tree would be visible.

### `spec_code` (core, partial this pass): the parent's "Files to Change" phase owners were spot-checked against the phase folders that exist (`002, 004`, `003`, `005`, `006`, `007`, `008, 009`, `041-006`). All nine phase folders exist with the documented names. Full spec-to-code mapping is deferred to iterations 2, 3 and 6. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` (core, partial this pass): the parent's "Files to Change" phase owners were spot-checked against the phase folders that exist (`002, 004`, `003`, `005`, `006`, `007`, `008, 009`, `041-006`). All nine phase folders exist with the documented names. Full spec-to-code mapping is deferred to iterations 2, 3 and 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core, partial this pass): the parent's "Files to Change" phase owners were spot-checked against the phase folders that exist (`002, 004`, `003`, `005`, `006`, `007`, `008, 009`, `041-006`). All nine phase folders exist with the documented names. Full spec-to-code mapping is deferred to iterations 2, 3 and 6.

### `spec.md.tmpl` carries three stamp lines because it holds the Level 2 and Level 3 variants inline; all three read v2.3, so no level can be scaffolded at an older stamp through that file. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec.md.tmpl` carries three stamp lines because it holds the Level 2 and Level 3 variants inline; all three read v2.3, so no level can be scaffolded at an older stamp through that file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec.md.tmpl` carries three stamp lines because it holds the Level 2 and Level 3 variants inline; all three read v2.3, so no level can be scaffolded at an older stamp through that file.

### `speckit-complete.yaml` names the card three times, including the sk-code checklist carve-out at line 469, which is the correct place for the "spec-folder authoring now lives in system-spec-kit" pointer. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `speckit-complete.yaml` names the card three times, including the sk-code checklist carve-out at line 469, which is the correct place for the "spec-folder authoring now lives in system-spec-kit" pointer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `speckit-complete.yaml` names the card three times, including the sk-code checklist carve-out at line 469, which is the correct place for the "spec-folder authoring now lives in system-spec-kit" pointer.

### A Draft deferral is per packet, not per document, and both implementations read the packet's `spec.md` status, so an unfilled token in `plan.md` of a Draft packet warns in both. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A Draft deferral is per packet, not per document, and both implementations read the packet's `spec.md` status, so an unfilled token in `plan.md` of a Draft packet warns in both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Draft deferral is per packet, not per document, and both implementations read the packet's `spec.md` status, so an unfilled token in `plan.md` of a Draft packet warns in both.

### All seven `speckit/*.md` command surfaces carry zero card references, but only `complete.md` and `plan.md`-adjacent assets describe authoring at all, and `plan.md` itself contains no template, fill or scaffold language beyond the `--start-state placeholder-upgrade` flag, so the absence is not a gap for those files. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: All seven `speckit/*.md` command surfaces carry zero card references, but only `complete.md` and `plan.md`-adjacent assets describe authoring at all, and `plan.md` itself contains no template, fill or scaffold language beyond the `--start-state placeholder-upgrade` flag, so the absence is not a gap for those files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: All seven `speckit/*.md` command surfaces carry zero card references, but only `complete.md` and `plan.md`-adjacent assets describe authoring at all, and `plan.md` itself contains no template, fill or scaffold language beyond the `--start-state placeholder-upgrade` flag, so the absence is not a gap for those files.

### Command-injection surface: the hook spawns the checker with `spawnSync(checkerPath, [absFilePath])` and no shell (`post-edit-router.cjs:472`), and the script quotes `"$FOLDER_PATH"` at `:85` and `:177`. No shell metacharacter in a path reaches a shell. Holds. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Command-injection surface: the hook spawns the checker with `spawnSync(checkerPath, [absFilePath])` and no shell (`post-edit-router.cjs:472`), and the script quotes `"$FOLDER_PATH"` at `:85` and `:177`. No shell metacharacter in a path reaches a shell. Holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command-injection surface: the hook spawns the checker with `spawnSync(checkerPath, [absFilePath])` and no shell (`post-edit-router.cjs:472`), and the script quotes `"$FOLDER_PATH"` at `:85` and `:177`. No shell metacharacter in a path reaches a shell. Holds.

### Neither guard writes a file, matching both headers' "Read-only" statement: `set -euo pipefail`, no redirect, no temp file. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Neither guard writes a file, matching both headers' "Read-only" statement: `set -euo pipefail`, no redirect, no temp file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Neither guard writes a file, matching both headers' "Read-only" statement: `set -euo pipefail`, no redirect, no temp file.

### No `[PLACEHOLDER]` remains in `README.md` or in the four reference files, which is what those two rows assert. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No `[PLACEHOLDER]` remains in `README.md` or in the four reference files, which is what those two rows assert.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `[PLACEHOLDER]` remains in `README.md` or in the four reference files, which is what those two rows assert.

### No core template carries an indented fence (`grep -cE '^[[:space:]]+```'` prints 0 for all four), so finding 2 cannot be triggered by a scaffolded packet as shipped — it needs an author to indent an example fence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No core template carries an indented fence (`grep -cE '^[[:space:]]+```'` prints 0 for all four), so finding 2 cannot be triggered by a scaffolded packet as shipped — it needs an author to indent an example fence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No core template carries an indented fence (`grep -cE '^[[:space:]]+```'` prints 0 for all four), so finding 2 cannot be triggered by a scaffolded packet as shipped — it needs an author to indent an example fence.

### No deleted anchor in any deciding run: `rule-scores.txt` shows `counted=0 excused=[]` three times, and the raw shortfall is 0 as well, so the anchor rule's exemptions were never needed to reach the pass. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No deleted anchor in any deciding run: `rule-scores.txt` shows `counted=0 excused=[]` three times, and the raw shortfall is 0 as well, so the anchor rule's exemptions were never needed to reach the pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No deleted anchor in any deciding run: `rule-scores.txt` shows `counted=0 excused=[]` three times, and the raw shortfall is 0 as well, so the anchor rule's exemptions were never needed to reach the pass.

### No vacuous pass over an empty tree: an empty `level-2` produces exit 1, not success. Ruled out as a fail-open. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No vacuous pass over an empty tree: an empty `level-2` produces exit 1, not success. Ruled out as a fail-open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No vacuous pass over an empty tree: an empty `level-2` produces exit 1, not success. Ruled out as a fail-open.

### Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not applicable to a parent-level document pass; deferred to iterations 6 and 7. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not applicable to a parent-level document pass; deferred to iterations 6 and 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not applicable to a parent-level document pass; deferred to iterations 6 and 7.

### Overlay protocols: `skill_agent` and `agent_cross_runtime` deferred to iteration 6; `playbook_capability` to iteration 7. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: Overlay protocols: `skill_agent` and `agent_cross_runtime` deferred to iteration 6; `playbook_capability` to iteration 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: `skill_agent` and `agent_cross_runtime` deferred to iteration 6; `playbook_capability` to iteration 7.

### Overlay protocols: `skill_agent` and `agent_cross_runtime` remain deferred to iteration 6; `playbook_capability` to iteration 7. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay protocols: `skill_agent` and `agent_cross_runtime` remain deferred to iteration 6; `playbook_capability` to iteration 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: `skill_agent` and `agent_cross_runtime` remain deferred to iteration 6; `playbook_capability` to iteration 7.

### Overlay protocols: `skill_agent` and `agent_cross_runtime` remain deferred to iteration 6. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay protocols: `skill_agent` and `agent_cross_runtime` remain deferred to iteration 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: `skill_agent` and `agent_cross_runtime` remain deferred to iteration 6.

### Overlay protocols: closed in iterations 6 and 7; not reopened. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Overlay protocols: closed in iterations 6 and 7; not reopened.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: closed in iterations 6 and 7; not reopened.

### Overlay protocols: closed in iterations 6 and 7. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Overlay protocols: closed in iterations 6 and 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: closed in iterations 6 and 7.

### Parent status `Complete` (`spec.md:50`) is consistent with the goal log's final entry: the operator's hold on the status was released once criterion 5 passed on the second fresh set, and every phase row in the phase map reads `Complete`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Parent status `Complete` (`spec.md:50`) is consistent with the goal log's final entry: the operator's hold on the status was released once criterion 5 passed on the second fresh set, and every phase row in the phase map reads `Complete`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent status `Complete` (`spec.md:50`) is consistent with the goal log's final entry: the operator's hold on the status was released once criterion 5 passed on the second fresh set, and every phase row in the phase map reads `Complete`.

### Path traversal: `find "$FOLDER_PATH" -name "*.md" -type f` does not follow symlinks (`-type f` is false for a symlink), so a symlinked document outside the folder is not read. Holds. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Path traversal: `find "$FOLDER_PATH" -name "*.md" -type f` does not follow symlinks (`-type f` is false for a symlink), so a symlinked document outside the folder is not read. Holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path traversal: `find "$FOLDER_PATH" -name "*.md" -type f` does not follow symlinks (`-type f` is false for a symlink), so a symlinked document outside the folder is not read. Holds.

### Phase 009's `Met` rows for the census (AC-004 in phase 003, `003/acceptance-criteria.md:57`) and for the deciding set are each backed by a file that exists; no `Met` row cites a path that is absent from the tree. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Phase 009's `Met` rows for the census (AC-004 in phase 003, `003/acceptance-criteria.md:57`) and for the deciding set are each backed by a file that exists; no `Met` row cites a path that is absent from the tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 009's `Met` rows for the census (AC-004 in phase 003, `003/acceptance-criteria.md:57`) and for the deciding set are each backed by a file that exists; no `Met` row cites a path that is absent from the tree.

### The `[NEEDS CLARIFICATION:` escalation inside a Draft is not bypassable by putting both markers on one line: the shell tests the line for the clarification pattern before deferring (`rules/check-placeholders.sh:128`), and the orchestrator tests `CLARIFICATION_MARKER_RE` on the whole line (`orchestrator.ts:743`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The `[NEEDS CLARIFICATION:` escalation inside a Draft is not bypassable by putting both markers on one line: the shell tests the line for the clarification pattern before deferring (`rules/check-placeholders.sh:128`), and the orchestrator tests `CLARIFICATION_MARKER_RE` on the whole line (`orchestrator.ts:743`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `[NEEDS CLARIFICATION:` escalation inside a Draft is not bypassable by putting both markers on one line: the shell tests the line for the clarification pattern before deferring (`rules/check-placeholders.sh:128`), and the orchestrator tests `CLARIFICATION_MARKER_RE` on the whole line (`orchestrator.ts:743`).

### The `009-.../scratch/review/T016-input/` copies of the phase 009 documents are review inputs, not authoring surfaces, and are excluded for the same reason. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The `009-.../scratch/review/T016-input/` copies of the phase 009 documents are review inputs, not authoring surfaces, and are excluded for the same reason.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `009-.../scratch/review/T016-input/` copies of the phase 009 documents are review inputs, not authoring surfaces, and are excluded for the same reason.

### The `C5-history` lines in `criteria.txt` do not break AC-011's count: they do not match `^C[1-7] PASS `, so `grep -c` still prints 7. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The `C5-history` lines in `criteria.txt` do not break AC-011's count: they do not match `^C[1-7] PASS `, so `grep -c` still prints 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `C5-history` lines in `criteria.txt` do not break AC-011's count: they do not match `^C[1-7] PASS `, so `grep -c` still prints 7.

### The `Waived`/`Superseded` ADR clause in the acceptance-criteria template is vacuous for this packet: `rg '\| (Waived|Superseded) \|'` over all nine `acceptance-criteria.md` files returns no rows, so the absence of `decision-record.md` in the phase folders does not break the clause. `folder-structure.md:140` also states `decision-record.md` is created on request and skipped silently when absent. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The `Waived`/`Superseded` ADR clause in the acceptance-criteria template is vacuous for this packet: `rg '\| (Waived|Superseded) \|'` over all nine `acceptance-criteria.md` files returns no rows, so the absence of `decision-record.md` in the phase folders does not break the clause. `folder-structure.md:140` also states `decision-record.md` is created on request and skipped silently when absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `Waived`/`Superseded` ADR clause in the acceptance-criteria template is vacuous for this packet: `rg '\| (Waived|Superseded) \|'` over all nine `acceptance-criteria.md` files returns no rows, so the absence of `decision-record.md` in the phase folders does not break the clause. `folder-structure.md:140` also states `decision-record.md` is created on request and skipped silently when absent.

### The contaminated deciding-set run (run 2 of the second set) is labelled contaminated in the report and excluded from the clean-pass reading, while run 1 alone decides that set's FAIL. The packet does not use a contaminated run as evidence of success. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The contaminated deciding-set run (run 2 of the second set) is labelled contaminated in the report and excluded from the clean-pass reading, while run 1 alone decides that set's FAIL. The packet does not use a contaminated run as evidence of success.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The contaminated deciding-set run (run 2 of the second set) is labelled contaminated in the report and excluded from the clean-pass reading, while run 1 alone decides that set's FAIL. The packet does not use a contaminated run as evidence of success.

### The drift guard's description rules are real and were shown firing: the phase 004 failing-first record holds `drift guard: description holds an HTML comment tail`, and every shipped example satisfies the three rules. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The drift guard's description rules are real and were shown firing: the phase 004 failing-first record holds `drift guard: description holds an HTML comment tail`, and every shipped example satisfies the three rules.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The drift guard's description rules are real and were shown firing: the phase 004 failing-first record holds `drift guard: description holds an HTML comment tail`, and every shipped example satisfies the three rules.

### The feature catalog is a single index file plus per-feature files, so the two new sections cannot drift from their detail pages without the link check failing. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The feature catalog is a single index file plus per-feature files, so the two new sections cannot drift from their detail pages without the link check failing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The feature catalog is a single index file plus per-feature files, so the two new sections cannot drift from their detail pages without the link check failing.

### The first set's `scratch/baseline/` numbers are correctly labelled history everywhere they appear in the report's section 2 table caption and in the `C5-history` lines of `criteria.txt`; the only defect there was the acceptance-row anchoring recorded as R2-P2-001, not the numbers. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The first set's `scratch/baseline/` numbers are correctly labelled history everywhere they appear in the report's section 2 table caption and in the `C5-history` lines of `criteria.txt`; the only defect there was the acceptance-row anchoring recorded as R2-P2-001, not the numbers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first set's `scratch/baseline/` numbers are correctly labelled history everywhere they appear in the report's section 2 table caption and in the `C5-history` lines of `criteria.txt`; the only defect there was the acceptance-row anchoring recorded as R2-P2-001, not the numbers.

### The gate does not fire on the templates themselves: `templates/` paths are skipped by the rule's path filter and the token templates live under `templates/core/`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The gate does not fire on the templates themselves: `templates/` paths are skipped by the rule's path filter and the token templates live under `templates/core/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The gate does not fire on the templates themselves: `templates/` paths are skipped by the rule's path filter and the token templates live under `templates/core/`.

### The heading prefix itself is consistent across templates — the same `## L3+:` spelling everywhere — so a reader who learns the meaning in one template carries it to the other; the defect is the absence of the in-document correction, not a divergent label. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The heading prefix itself is consistent across templates — the same `## L3+:` spelling everywhere — so a reader who learns the meaning in one template carries it to the other; the defect is the absence of the in-document correction, not a divergent label.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The heading prefix itself is consistent across templates — the same `## L3+:` spelling everywhere — so a reader who learns the meaning in one template carries it to the other; the defect is the absence of the in-document correction, not a divergent label.

### The Hermes mirrors (`agent-code`, `agent-context`, `agent-markdown`, `agent-orchestrate`) are generated output and were regenerated in the same commit, so they cannot silently disagree with the four `.skilled` originals. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The Hermes mirrors (`agent-code`, `agent-context`, `agent-markdown`, `agent-orchestrate`) are generated output and were regenerated in the same commit, so they cannot silently disagree with the four `.skilled` originals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The Hermes mirrors (`agent-code`, `agent-context`, `agent-markdown`, `agent-orchestrate`) are generated output and were regenerated in the same commit, so they cannot silently disagree with the four `.skilled` originals.

### The JSON output's `folder` field is the only interpolated value (`:182-185`), and the hook does not consume `--json` (`post-edit-router.cjs:472` passes the path only), so the missing escaping cannot corrupt a live consumer. Recorded as clean rather than as a finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The JSON output's `folder` field is the only interpolated value (`:182-185`), and the hook does not consume `--json` (`post-edit-router.cjs:472` passes the path only), so the missing escaping cannot corrupt a live consumer. Recorded as clean rather than as a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The JSON output's `folder` field is the only interpolated value (`:182-185`), and the hook does not consume `--json` (`post-edit-router.cjs:472` passes the path only), so the missing escaping cannot corrupt a live consumer. Recorded as clean rather than as a finding.

### The narrower rule (`rules/check-placeholders.sh`) is not the hook's path: it is sourced by `validate.sh` and by the isolated rule tests only, so the false positives above do not affect the production verdict, which is why they are scoped to the hook. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The narrower rule (`rules/check-placeholders.sh`) is not the hook's path: it is sourced by `validate.sh` and by the isolated rule tests only, so the false positives above do not affect the production verdict, which is why they are scoped to the hook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The narrower rule (`rules/check-placeholders.sh`) is not the hook's path: it is sourced by `validate.sh` and by the isolated rule tests only, so the false positives above do not affect the production verdict, which is why they are scoped to the hook.

### The packet does not write outside the packet: every path the phases touched is inside `specs/system-speckit/054-weak-model-spec-authoring/` or one of the `.skilled` surfaces named in the parent's Files to Change table. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The packet does not write outside the packet: every path the phases touched is inside `specs/system-speckit/054-weak-model-spec-authoring/` or one of the `.skilled` surfaces named in the parent's Files to Change table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The packet does not write outside the packet: every path the phases touched is inside `specs/system-speckit/054-weak-model-spec-authoring/` or one of the `.skilled` surfaces named in the parent's Files to Change table.

### The phase 007 acceptance rows do not overstate what they checked: AC-005 scopes itself to `README.md` and AC-007 to the four reference files plus `template-guide.md`, so the surviving `template-mapping.md` text is a coverage gap rather than a false `Met`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The phase 007 acceptance rows do not overstate what they checked: AC-005 scopes itself to `README.md` and AC-007 to the four reference files plus `template-guide.md`, so the surviving `template-mapping.md` text is a coverage gap rather than a false `Met`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The phase 007 acceptance rows do not overstate what they checked: AC-005 scopes itself to `README.md` and AC-007 to the four reference files plus `template-guide.md`, so the surviving `template-mapping.md` text is a coverage gap rather than a false `Met`.

### The report's `## 2. AGGREGATE RESULTS` table, which shows the first set's `missing_anchors final max 6`, is not a verdict contradiction: the paragraph immediately under the table reads "Each cell above comes from three runs of the first set (`swe-2-max`, history)", and the section-1 narrative precedes every FAIL sentence with "First set, history (swe-2-max, tree before the L3+ label fix)". Labelled history, so ruled out. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The report's `## 2. AGGREGATE RESULTS` table, which shows the first set's `missing_anchors final max 6`, is not a verdict contradiction: the paragraph immediately under the table reads "Each cell above comes from three runs of the first set (`swe-2-max`, history)", and the section-1 narrative precedes every FAIL sentence with "First set, history (swe-2-max, tree before the L3+ label fix)". Labelled history, so ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The report's `## 2. AGGREGATE RESULTS` table, which shows the first set's `missing_anchors final max 6`, is not a verdict contradiction: the paragraph immediately under the table reads "Each cell above comes from three runs of the first set (`swe-2-max`, history)", and the section-1 narrative precedes every FAIL sentence with "First set, history (swe-2-max, tree before the L3+ label fix)". Labelled history, so ruled out.

### The scan skips `memory/`, `scratch/`, `research/`, `review/` and `.backup-*`, so a review packet's own artifacts — including this lineage's iteration files, which intentionally contain `[None yet]`-shaped text — cannot fail it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The scan skips `memory/`, `scratch/`, `research/`, `review/` and `.backup-*`, so a review packet's own artifacts — including this lineage's iteration files, which intentionally contain `[None yet]`-shaped text — cannot fail it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The scan skips `memory/`, `scratch/`, `research/`, `review/` and `.backup-*`, so a review packet's own artifacts — including this lineage's iteration files, which intentionally contain `[None yet]`-shaped text — cannot fail it.

### The scenario files' slug ids (`template-authoring-placeholder-token-warning-while-draft`) and the index's numeric ids coexist without a mapping table because the index row carries both the number and the relative path; no reader has to guess. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The scenario files' slug ids (`template-authoring-placeholder-token-warning-while-draft`) and the index's numeric ids coexist without a mapping table because the index row carries both the number and the relative path; no reader has to guess.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The scenario files' slug ids (`template-authoring-placeholder-token-warning-while-draft`) and the index's numeric ids coexist without a mapping table because the index row carries both the number and the relative path; no reader has to guess.

### The test fixtures under `001-.../scratch/test/T009-*-packet/` carry `completion_pct: 0` by design — they are scaffolded test packets, not packet documents, and are excluded from finding 1. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The test fixtures under `001-.../scratch/test/T009-*-packet/` carry `completion_pct: 0` by design — they are scaffolded test packets, not packet documents, and are excluded from finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The test fixtures under `001-.../scratch/test/T009-*-packet/` carry `completion_pct: 0` by design — they are scaffolded test packets, not packet documents, and are excluded from finding 1.

### The three `plan.md` `L3+:` fill notes do not invite deletion, unlike the `tasks.md` notes that say "or delete the section when the packet records no ADR". That is why the missing clarifier is advisory rather than a live regression: a run has no instruction to drop those sections, and the anchor rule counts any missing `plan.md` anchor unconditionally, so a deletion there would fail the metric rather than pass it. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The three `plan.md` `L3+:` fill notes do not invite deletion, unlike the `tasks.md` notes that say "or delete the section when the packet records no ADR". That is why the missing clarifier is advisory rather than a live regression: a run has no instruction to drop those sections, and the anchor rule counts any missing `plan.md` anchor unconditionally, so a deletion there would fail the metric rather than pass it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The three `plan.md` `L3+:` fill notes do not invite deletion, unlike the `tasks.md` notes that say "or delete the section when the packet records no ADR". That is why the missing clarifier is advisory rather than a live regression: a run has no instruction to drop those sections, and the anchor rule counts any missing `plan.md` anchor unconditionally, so a deletion there would fail the metric rather than pass it.

### Verdict steering from document content: a document cannot buy the Draft warning by crafting a `Status` cell, because the status is read from `spec.md` only and normalized identically in both readers (iteration 3). A document cannot hide a bracket from the *validator*, only from the broad scan, which is finding 1 above. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Verdict steering from document content: a document cannot buy the Draft warning by crafting a `Status` cell, because the status is read from `spec.md` only and normalized identically in both readers (iteration 3). A document cannot hide a bracket from the *validator*, only from the broad scan, which is finding 1 above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Verdict steering from document content: a document cannot buy the Draft warning by crafting a `Status` cell, because the status is read from `spec.md` only and normalized identically in both readers (iteration 3). A document cannot hide a bracket from the *validator*, only from the broad scan, which is finding 1 above.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Re-running `validate.sh --recursive`: the lineage may not write outside its artifact directory, and the packet's own criterion already claims `RESULT: PASSED`; the claim is checked against recorded artifacts instead (iteration 1).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
No further review iteration is planned: `stopPolicy` is `max-iterations` and this is iteration 10 of 10. Synthesis consolidates 24 findings across four dimensions, derives the verdict from the registry, and records `stopReason: maxIterationsReached`. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** parent `spec.md`, `goal.md`, `description.json`, `graph-metadata.json`, the nine `00N-*/` phase children, `changelog/`, and the implementation surface they claim (`templates/core/*.tmpl`, `runtime/cli/spec/check-placeholders.sh`, `check-example-drift.sh`, `check-card-sync.sh`, `SKILL.md`).
- **Behavior claims to verify:** a v2.3 doc with an unfilled `[YOUR_VALUE_HERE: ...]` token passes strict validation while Draft and fails it at any other status; a v2.2 doc validates as before; recursive strict counts over `specs/` are unchanged between the pre-003 and post-009 trees; both guard scripts exit 0 on the final tree; the DeepSeek final set is not worse than its baseline on three metrics.
- **Reuse and conventions:** the packet is a phase parent, so its authored documents are `spec.md` and `goal.md` only; detail lives in phase children.
- **Review risks and gaps:** the packet references run artifacts (benchmark evidence, playbook reports) that were produced in disposable worktrees; a missing artifact is a traceability gap, not necessarily a defect in the shipped code.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-pi-deepseek-2-1792950661620-vss1cp, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-25T17:52:23Z
<!-- MACHINE-OWNED: END -->
