# Deep Review Report: `sk-code/013-private-surface-skills` (synthesis)

**Mode:** fan-out synthesis over two lineages, `deepseek` (cli-pi, deepseek-v4.1-flash-1017, 5 iterations) and `luna` (cli-codex, gpt-6-luna, 5 iterations)
**Target:** `specs/sk-code/013-private-surface-skills` (Level 2 phase parent, children 001 to 005) and the code, hooks, advisor, registry, doc and command surfaces it changed
**Stop reason:** `maxIterationsReached` in both lineages
**Synthesis date:** 2026-10-25, worktree `218-ci-efficiency-build` at `d31d9667b6`

---

## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is not PASS)
- **Active findings (confirmed by this synthesis):** P0 = 0, P1 = 4, P2 = 19
- **Lineage findings adjudicated:** 20 in the merged registry. 15 CONFIRMED (4 P1, 11 P2), 2 DUPLICATE, 3 REFUTED. This pass added 8 new P2 findings from the operator-focus checks the lineages did not run.
- **Review scope:** parent `spec.md` and `goal.md`; every child's `spec.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and `decision-record.md` where status is carried; root `.gitignore`; `.skilled/scripts/git-hooks/pre-commit`, its harness and README; the advisor containment helper and its scan sites; the sk-code hub registries, routers, README, SKILL.md, feature catalog, playbook and benchmark fixtures; `.skilled/commands/` and the runtime mirrors; the research folder's citations.

What holds, from commands this pass ran:

- The shipped outcome is real. Every packet commit (`7648ae8b56`, `e3beac65f4`, `1218b94938`, `e00fef3e76`, `e8256b8044`, `ff993936c7`, `01742752c1`, `ee0fdc94eb`) is an ancestor of `origin/main`.
- Handoff Block 1: `pre-commit.test.sh` exit 0, `pre-commit gates: 131 passed, 0 failed`; `git check-ignore -v` names `.gitignore:236` and `:237`.
- Handoff Block 2: `doc-claims: 4/4 checks passed`, `router-sync: 5/5 checks passed`, scoped `rg` for the removed packet names exit 1 with no output.
- Handoff Block 3: the graph check prints `[]`; the two vitest files print `Tests  19 passed (19)`, exit 0. The spec still expects 16 (see R3-P2-003).
- `validate.sh specs/sk-code/013-private-surface-skills --recursive --strict`: six `RESULT: PASSED`, parent `Errors: 0  Warnings: 1` (the six unresolved SOURCE tags, SYN-P2-007).
- `run-all-drift-guards.sh` (the sk-code-skilled completion gate): all 4 guards PASSED, 10 warnings, none in a file this packet changed.
- `validate_skill_package.py --strict .skilled/skills/sk-code`: PASS. `validate_catalog_package.py --package sk-code --strict`: PASS, 0 violations. `validate-playbook-package.cjs --package sk-code`: PASS, 18 scenarios, 0 violations. `validate_document.py` reports 0 issues on the hub README, SKILL.md, catalog leaves, playbook root (`--type playbook`), the three packet READMEs, the hooks README and the advisor README.
- `sync-skills-hermes.cjs --check`: `PASS: 67 Hermes skill copies in sync`.
- The AC-013 probe now reproduces: `advisor_recommend` for `implement a typescript script` returns `sk-code` with a `compiledRoute` targeting `sk-code-skilled`.
- Added code comments in the packet commits carry no ephemeral labels (scan of the added lines for AC, REQ, ADR, T, CHK, phase and packet ids came back empty).

What does not hold:

- The packet's own records cannot show it is complete. The parent says Complete while its phase map, continuity blocks and derived metadata say phase 2 is in progress. Phase 2 and phase 3 still carry Unmet closure rows and unworked task checklists, even though their commits are on `origin/main` and their proofs now pass.
- The new private-skill guard and the private-root environment variable are missing from the docs that list gates and advisor settings. Small stale references to the removed Webflow surface remain in the hub's benchmark fixtures, one hub playbook and one speckit command asset.

---

## 2. Planning Trigger

`/speckit:plan` is required. The four P1 findings are all documentation-state corrections, and no code change is needed to close them. P2 work splits into one small code fix (the guard's type-change filter), one scanner inventory change, and doc corrections.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 4, "P2": 19, "total": 23 },
  "remediationWorkstreams": [
    "W1-close-phase-002-records",
    "W2-close-phase-003-records",
    "W3-reconcile-parent-and-goal",
    "W4-guard-and-scanner-hardening",
    "W5-docs-coverage-and-surface-residue"
  ],
  "specSeed": [
    "Parent spec.md: phase map rows 2-4 to Done with commit ids; continuity block to the closed state; D1 amendment note for sk-code-ci; D3 gains the hook-activation limit; Block 3 expected count 19.",
    "Phase 002 and 003: closure rows re-decided against commit ancestry and the recursive strict PASSED run; tasks.md verification checklists worked.",
    "Phase 003 scanner inventory: add the derived-freshness gate and decide the rule for the other unlisted skill-root readers."
  ],
  "planSeed": [
    "Close phase 002 AC-013 and AC-014, its tasks.md checklist and its status fields.",
    "Close phase 003 AC-026 and AC-027 with durable proofs, its tasks.md checklist and its status fields.",
    "Tick phase 004 tasks.md:4320 with the commit evidence.",
    "Update parent spec.md and goal.md, then re-save through /speckit:save so description.json and graph-metadata.json re-derive.",
    "Widen the pre-commit private-skill filter to ACMRT and add one harness case.",
    "Add the local-* skip to ci-skill-derived-freshness.cjs or route it through listSkillRoots.",
    "Document the private-skill gate in the hooks README and the private-root variable in the advisor README, catalog and playbook.",
    "Remove the Webflow residue from the hub benchmark fixtures, the quality playbook and speckit-complete.yaml.",
    "Rewrite the six unresolved research SOURCE tags."
  ],
  "findingClasses": [
    "doc-state-contradiction",
    "closure-gate-contradiction",
    "stale-closure-gate",
    "stale-narrative",
    "stale-verification-command",
    "non-durable-evidence",
    "unrecorded-guard-limit",
    "stale-frozen-decision",
    "rule-duplication",
    "undocumented-capability",
    "commit-guard-diff-filter-gap",
    "scanner-inventory-omission",
    "removed-surface-residue",
    "public-api-doc-gap",
    "unresolved-citation"
  ],
  "affectedSurfacesSeed": [
    "specs/sk-code/013-private-surface-skills/spec.md",
    "specs/sk-code/013-private-surface-skills/goal.md",
    "specs/sk-code/013-private-surface-skills/002-hub-surface-removal/",
    "specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/",
    "specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md",
    "specs/sk-code/013-private-surface-skills/research/",
    ".skilled/scripts/git-hooks/pre-commit",
    ".skilled/scripts/git-hooks/tests/pre-commit.test.sh",
    ".skilled/scripts/git-hooks/README.md",
    ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs",
    ".skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts",
    ".skilled/skills/system-skill-advisor/README.md",
    ".skilled/skills/sk-code/benchmark/fixtures/sk-code/",
    ".skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md",
    ".skilled/commands/speckit/assets/speckit-complete.yaml"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

Each entry gives severity, location, the evidence this pass observed, and a remediation precise enough to apply without re-investigating. "Operator decision" marks a fix that needs a choice first.

### P1

#### R3-P1-001 (merged with LUNA-R1-P1-001): the parent claims Complete while its own records say phase 2 is in progress

- **Dimension / class:** traceability / `doc-state-contradiction`
- **Location:** `specs/sk-code/013-private-surface-skills/spec.md:50`
- **Evidence:** `spec.md:50` reads `Status | Complete`. The same file's phase map at `:136-138` reads phase 2 `In progress`, phases 3 and 4 `Pending`, and its continuity at `:13-14` and `:23` says "phase 002 in progress uncommitted", next action "Finish phase 002 T039", `completion_pct: 27`. `goal.md:16-17` and `:26` carry the same stale continuity, while its log at `goal.md:111-114` records every phase Done. `graph-metadata.json` has `derived.status: in_progress` and `derived.last_active_child_id: .../002-hub-surface-removal`. All eight packet commits are on `origin/main` (checked with `git merge-base --is-ancestor`).
- **Impact:** a resume or a status query reads the packet as 27 percent done and points at a finished phase.
- **Remediation:** after W1 and W2 close, edit `spec.md:136-138` to `Done (e3beac65f4, 1218b94938)`, `Done (e00fef3e76)`, `Done (e8256b8044, ff993936c7)`; set the `_memory.continuity` block in `spec.md` and `goal.md` to the closed state (`recent_action` naming phase 005 closure, `next_safe_action` "None; optional history-rewrite decision", `completion_pct: 100`). Then run `/speckit:save` on the parent so `generate-context.js` re-derives `description.json` and `graph-metadata.json`. Do not hand-edit the derived fields.
- **Disposition:** CONFIRMED. LUNA-R1-P1-001 is the same finding at the same line and is DUPLICATE.

#### R3-P1-002: phase 2 AC-013 says Met in its row and Unmet in its evidence

- **Dimension / class:** traceability / `closure-gate-contradiction`
- **Location:** `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:69`
- **Evidence:** the row at `:69` ends `Met`. The progress note at `:86` says "AC-013 - Unmet ... compiledRoute was absent", and the frontmatter at `:13` says "AC-013-014 Unmet". This pass reran the probe. `advisor_recommend` for `implement a typescript script` returns `sk-code` with `compiledRoute.targets[0].packetId = sk-code-skilled`, so the row's `Met` is now true and the note is stale.
- **Remediation:** rewrite the `:86` note to "AC-013 - Met. Re-observed 2026-10-25: top `skillId` `sk-code`, `compiledRoute` target `sk-code-skilled`." Update the frontmatter `recent_action` at `:13` to drop AC-013 from the Unmet list.
- **Disposition:** CONFIRMED.

#### R3-P1-003: phase 2's closure gate stays Unmet although the phase shipped and validates

- **Dimension / class:** traceability / `stale-closure-gate`
- **Location:** `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:70`
- **Evidence:** AC-014 is `Unmet` at `:70`, and its note at `:87` says T105, T106 and T108 remain open. `e3beac65f4` and `1218b94938` are ancestors of `origin/main`. The recursive strict validation this pass ran prints `RESULT: PASSED` for the child. `002-hub-surface-removal/tasks.md` has 27 open boxes against 9 ticked, including the whole Completion Criteria block at `:2429-2437` and CHK-020, CHK-030 to CHK-051 at `:2495-2541`. `spec.md:33` still reads `In progress (~90%)`.
- **Remediation:** in `acceptance-criteria.md`, set AC-014 to `Met` with the evidence "`e3beac65f4` and `1218b94938` ancestors of `origin/main`; recursive strict validation `RESULT: PASSED` 2026-10-25", and rewrite `:87` the same way. In `tasks.md`, tick each box in `:2429-2541` that its recorded evidence supports, adding the evidence inline the way CHK-001 does. Any box the phase never did, such as CHK-FIX-006 (the hostile `git add -f` variant), stays open or gets the not-applicable marker phase 004's `tasks.md:4314` uses, with a one-line reason. Set `spec.md:33` to `Complete`. Do this before R3-P1-001.
- **Disposition:** CONFIRMED.

#### R3-P1-004: phase 3's closure gate is Unmet while the goal records the phase Done

- **Dimension / class:** traceability / `stale-closure-gate`
- **Location:** `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md:79`
- **Evidence:** AC-026 (`:79`) and AC-027 (`:80`) are `Unmet`, and the status line at `:41` says they wait on review, commit and push. `goal.md:112` records the phase Done, and `e00fef3e76` is an ancestor of `origin/main`. The review evidence AC-027 needs already exists in the tree. `decision-record.md:772-841` records review rounds 1 to 4, each finding and its resolution, ending "New criteria: none. Counts after round 4". `003-advisor-vocabulary-cleanup/tasks.md` has 23 open boxes, including its Completion Criteria from `:2926` and CHK-010 to CHK-020 at `:2970-2981`.
- **Remediation:** set AC-026 to `Met` with "`e00fef3e76` ancestor of `origin/main` (`git merge-base --is-ancestor e00fef3e76 origin/main`, exit 0)". The `git status --porcelain` half was a delivery-moment check and cannot be replayed, so say so in the cell. Set AC-027 to `Met` with "every round 1 to 4 finding resolved or recorded in `decision-record.md` section Review follow-up amendments". Update `:41` to `Status: Complete`. Tick the `tasks.md` boxes the recorded evidence supports, same rule as R3-P1-003. Pair this with R3-P2-002 and R3-P2-004.
- **Disposition:** CONFIRMED.

### P2

#### R3-P2-001: phase 2's summary still calls the work uncommitted

- **Location:** `002-hub-surface-removal/implementation-summary.md:41`
- **Evidence:** `:41` reads "In progress (~90%); implementation remains uncommitted". `:54` and `:82` repeat "The phase is uncommitted" and cite "Worker reports" that are not in the tree. Frontmatter `:14` gives next action "SWE-2 review (T105), validate (T106), commit and push (T108)", and `:23` reads `completion_pct: 90`.
- **Remediation:** set `:41` to `Complete (e3beac65f4, 1218b94938 on origin/main)`. Rewrite `:54` and `:82` in the past tense, replacing "Worker reports record" with "acceptance-criteria.md progress notes record". Set frontmatter `next_safe_action` to "Phase complete; continue in phase 003" and `completion_pct: 100`.
- **Disposition:** CONFIRMED.

#### R3-P2-002: phase 3's spec and summary still point at review, commit and push

- **Location:** `003-advisor-vocabulary-cleanup/spec.md:33`
- **Evidence:** `spec.md:33` reads `In Progress`. `implementation-summary.md:14` gives next action "Run the next independent review (T084), then commit and push (T074, T075)". `:43` reads "independent review, commit and push pending", `:46` reads `In Progress`, and `:24` reads `completion_pct: 90`.
- **Remediation:** set `spec.md:33` and `implementation-summary.md:46` to `Complete`. Change `:43` to "2026-10-24 (committed as e00fef3e76)". Set `:14` to "Phase complete; continue in phase 004" and `:24` to `100`.
- **Disposition:** CONFIRMED.

#### R3-P2-004: AC-027's proof reads a temp file that cannot survive the session

- **Location:** `003-advisor-vocabulary-cleanup/acceptance-criteria.md:347`
- **Evidence:** the AC-027 proof block is `tail -1 /tmp/phase3-review.txt`. No such file exists in the packet.
- **Remediation:** replace the block with `rg -n '^### Review follow-up amendments' decision-record.md`, which should print four headings (`:772`, `:789`, `:820`, `:833`), and change the Expected line to match.
- **Disposition:** CONFIRMED.

#### R1-P2-001 (merged with R1-P2-002): goal completion criterion 3 does not reproduce where it is read

- **Location:** `specs/sk-code/013-private-surface-skills/goal.md:91`
- **Evidence:** `git status --porcelain .skilled` in this worktree prints `?? .skilled/commands/agent-router.md` and `?? .skilled/skills/cli-external-orchestration/cli-hermes/.../inlined-persona-via-agent-router-template.md`, which are unrelated untracked files, so the "prints nothing" proof fails for reasons that have nothing to do with leaks. No `local-*` entry exists under `.skilled/skills/` here either. The criterion only holds in the operator's main checkout, and the goal never says so.
- **Remediation:** rewrite the criterion as: "In the operator checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, `.skilled/skills/local-*/SKILL.md` exists through its symlink, each skill root holds one `graph-metadata.json`, and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints exactly two `!!` lines." Keep the box ticked only after rerunning it there.
- **Disposition:** CONFIRMED. R1-P2-002 (the symlink half) is DUPLICATE, because the same rewrite fixes it.

#### R2-P2-001: D3 omits the limit that decides whether the guard runs at all

- **Location:** `specs/sk-code/013-private-surface-skills/spec.md:102`
- **Evidence:** D3 lists four limits (`--no-verify`, history, renamed copy, no pre-push token guard). The guard lives in `.skilled/scripts/git-hooks/pre-commit`, which only runs where the hooks are installed through `core.hooksPath` and, for a foreign clone, where `skilled.trustRepoHooks=true` (hooks README `:24`, last bullet). A clone on a machine without the install has only the `.gitignore` rules, which `git add -f` overrides. Phase 001's docs do not record this limit. The only mention is a verification note at `001-ignore-and-commit-guard/implementation-summary.md:161`.
- **Remediation:** append to D3 in `spec.md:102` and `goal.md:53`: "and the guard runs only where the repo hooks are installed (`core.hooksPath`) and trusted; elsewhere only the ignore rules apply, which `git add -f` overrides."
- **Disposition:** CONFIRMED.

#### R3-P2-003: the 003 to 004 handoff expects 16 tests and the suite has 19

- **Location:** `specs/sk-code/013-private-surface-skills/spec.md:188`
- **Evidence:** this pass ran the Block 3 vitest command and got `Tests  19 passed (19)`, exit 0. The files define 8 and 11 cases.
- **Remediation:** change `spec.md:188` to "`Tests  19 passed (19)` and exit 0 from the vitest run (eight containment cases plus eleven graph cases)".
- **Disposition:** CONFIRMED.

#### R3-P2-005: D1 and the purpose statement predate the hub's fourth packet

- **Location:** `specs/sk-code/013-private-surface-skills/spec.md:100`
- **Evidence:** `mode-registry.json` declares `sk-code-quality`, `sk-code-review`, `sk-code-skilled`, `sk-code-ci`. `sk-code-ci` arrived in `028bd0f5cd` (2026-10-24, "add the read-only CI surface"), after this packet's D1. `spec.md:68` ("The hub keeps only ..."), `:100` and `goal.md:51` state a three-packet hub. Goal criterion 2 (`goal.md:90`) still holds, because it only requires the three to be declared.
- **Remediation:** add one sentence after the D1 row in `spec.md` and `goal.md`: "Amendment 2026-10-25: `sk-code-ci` joined the hub later in `028bd0f5cd`; D1 governs only the two removed surfaces." Change `spec.md:68` "keeps only" to "keeps".
- **Disposition:** CONFIRMED.

#### R4-P2-001: sixteen scan sites restate the `local-*` rule, and nothing detects one that omits it

- **Location:** `003-advisor-vocabulary-cleanup/implementation-summary.md:58`
- **Evidence:** each scan carries its own name check, and only containment is shared (`private-skill-target.ts` plus its Python mirror). LUNA-R4-P2-001 and SYN-P2-008 below are live counterexamples, so the gap is real and not hypothetical.
- **Remediation:** add a test under `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/` (or the advisor runtime tests) that greps the repository for top-level `readdirSync`, `os.listdir` and `iterdir` calls over a skills root and fails when a call site is neither in the phase 3 inventory nor carries a `local-` rule. Extracting a shared predicate stays optional.
- **Disposition:** CONFIRMED.

#### R5-P2-001: the hooks README gate inventory omits the private-skill gate

- **Location:** `.skilled/scripts/git-hooks/README.md:24`
- **Evidence:** `:20` and `:24` say pre-commit runs ten blocking sub-gates and name ten. The diagram at `:44`, the tree at `:73` and the table at `:110` repeat "10". `rg -i private` finds nothing in the README, but `pre-commit:95-118` adds `gate:private-skill`, which blocks with no bypass.
- **Remediation:** change "ten" or "10" to "eleven" or "11" at `:20`, `:24`, `:44`, `:73` and `:110`. Add "private skill" to the `:24` list, and add one sentence there: "The private-skill gate refuses a staged `local-*` path under the eight skill roots and has no bypass flag."
- **Disposition:** CONFIRMED.

#### LUNA-R2-P2-001: a staged type change slips past the private-skill guard

- **Dimension / class:** security / `commit-guard-diff-filter-gap`
- **Location:** `.skilled/scripts/git-hooks/pre-commit:111`
- **Evidence:** the guard reads `git diff --cached --name-only -z --diff-filter=ACMR`. Git status `T` (a tracked path changing type, for example a file becoming a symlink) is excluded, so a `local-*` path that was once force-tracked can change type without a block. The comment at `:99-100` justifies dropping only `D`. The harness cases at `pre-commit.test.sh:1001-1072` cover add, symlink and gitlink, but not a type change.
- **Remediation:** change `:111` to `--diff-filter=ACMRT` and the comment at `:100` to `--diff-filter=ACMRT`. Add a harness case after case 80 that commits a regular file at `.skilled/skills/local-tc/SKILL.md` with `--no-verify`, replaces it with a symlink, stages it and expects exit 1 naming the path. Bump the expected total in parent `spec.md:169` from 131 to 132.
- **Disposition:** CONFIRMED.

#### LUNA-R4-P2-001: the derived-freshness CI gate scans the skills root without the `local-*` rule and is missing from the inventory

- **Dimension / class:** maintainability / `scanner-inventory-omission`
- **Location:** `003-advisor-vocabulary-cleanup/spec.md:164`
- **Evidence:** `.github/workflows/routing-registry-drift.yml:202` runs `ci-skill-derived-freshness.cjs`, whose root list at `:51-54` filters only dot-names and `node_modules`. The canonical `listSkillRoots` in `regenerate-skill-derived.cjs:213-217`, from the same folder, also drops `local-`. A real `local-*` directory reaches this checker. The supported symlink layout is skipped only by accident, through `Dirent.isDirectory()`. The inventory at `spec.md:164-183` lists 16 scans and not this one.
- **Remediation:** in `ci-skill-derived-freshness.cjs:51-54`, replace the inline enumeration with `regen.listSkillRoots(skillsDir)` (the module is already imported as `regen`). Alternatively add `&& !e.name.startsWith('local-')` to the filter. Add row 17 "Derived-freshness CI gate | `sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` | Exclude" to the inventory, and update the counts in `spec.md:162` and `implementation-summary.md:58`.
- **Disposition:** CONFIRMED.

#### SYN-P2-001 (new): sk-code benchmark fixtures still route to the removed Webflow surface

- **Dimension / class:** traceability / `removed-surface-residue`
- **Location:** `.skilled/skills/sk-code/benchmark/fixtures/sk-code/sk-code-loadspeed-001.private.json:18`, `sk-code-motion-002.private.json:18`
- **Evidence:** both `notes` fields name gold paths from the deleted packet (`references/webflow/performance/*`, `references/webflow/implementation/performance_patterns.md`, `references/motion_dev/*.md`, `references/webflow/implementation/animation_workflows.md`). The motion rubric also says "after surface detection, not a third surface". The public prompts ("frontend marketing site", "on-enter reveal") are Webflow-surface tasks, and in the operator checkout `local-webflow` would now win them. Phase 2's AC-007 scan looked for packet names and upper-case tokens, so these lower-case paths passed it. D6 excludes `benchmark/reports/`, not `benchmark/fixtures/`.
- **Remediation (operator decision):** either (a) retire both scenario pairs by deleting the four `sk-code-loadspeed-001.*.json` and `sk-code-motion-002.*.json` files, or (b) keep them as negative or neutral routing cases, rewriting each `notes` to drop every `references/webflow/` and `references/motion_dev/` path and the "third surface" rubric line. The decision: should the public hub benchmark keep frontend-site scenarios now that the frontend surface is private?
- **Disposition:** CONFIRMED (new).

#### SYN-P2-002 (new): a hub playbook still contrasts against a "Webflow-only standard"

- **Location:** `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md:28`, `:58`
- **Evidence:** both lines say the prompt must load code-quality's checklist rather than "a Webflow-only standard". No such standard ships in the hub after phase 2.
- **Remediation:** delete " or a Webflow-only standard" at `:28` and at `:58`.
- **Disposition:** CONFIRMED (new).

#### SYN-P2-003 (new): `speckit-complete.yaml` still names the removed Webflow and motion_dev routes

- **Location:** `.skilled/commands/speckit/assets/speckit-complete.yaml:473`
- **Evidence:** `cross_skill_authoring_load.not_for` reads "Webflow stack writes (separate path), motion_dev work (cross-stack), or non-.opencode/ targets." The separate Webflow path and the motion_dev cross-stack route were the deleted `sk-code-webflow` packet. `.opencode/commands` is a symlink to `.skilled/commands`, so one edit fixes both. No command `.md` file was touched by this packet. The other command hits (`create-skill-parent-*` "e.g. webflow" examples, the doctor `obsidian-cli` MCP rows) are generic D6 vocabulary and are not findings.
- **Remediation:** change `:473` to `not_for: "targets outside .skilled/, or a target an advisor-named local-* skill owns."`
- **Disposition:** CONFIRMED (new).

#### SYN-P2-004 (new): the private-root variable and the private-skill gate are documented nowhere a user looks

- **Dimension / class:** maintainability / `undocumented-capability`
- **Location:** `.skilled/skills/system-skill-advisor/README.md` (no entry), its `feature-catalog/` and `manual-testing-playbook/`, and `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:247`
- **Evidence:** outside specs and tests, `SPECKIT_PRIVATE_SKILL_ROOTS` appears only in code (`.skilled/bin/system-skill-advisor-launcher.cjs`, `private-skill-target.ts`, `skill_advisor_runtime.py`). The advisor README documents comparable variables (`SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` at `:113`, `SPECKIT_ADVISOR_DOC_TRIGGERS` at `:144`) but not this one, and every advisor process needs it for the local skills to route. The system-spec-kit playbook covers sibling commit gates (scenario 473, template phrase lint blocked commit), but has no scenario for the private-skill gate.
- **Remediation:** (1) add a "Private local skills" paragraph to the advisor README, next to `:144`, covering the `local-*` include rule, realpath containment, the colon-separated `SPECKIT_PRIVATE_SKILL_ROOTS`, the launcher forwarding it, and the tracked writers skipping `local-*`. (2) Add a feature-catalog leaf under `feature-catalog/auto-indexing/` authored per `sk-create-feature-catalog`, with source anchors to `private-skill-target.ts` and test anchors to `private-skill-target.vitest.ts`. (3) Add a playbook scenario per `sk-create-manual-testing-playbook` in the system-spec-kit `tooling-and-scripts/` category, modelled on scenario 473: stage a `local-probe/SKILL.md`, expect `BLOCKED [gate:private-skill]`. Validate each with `validate_document.py` and the package validators.
- **Disposition:** CONFIRMED (new).

#### SYN-P2-005 (new): the containment helper's exports carry no TSDoc

- **Dimension / class:** maintainability / `public-api-doc-gap`
- **Location:** `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:12`, `:51`, `:57`
- **Evidence:** `PRIVATE_SKILL_ROOTS_ENV`, `isTrustedPrivateSkillLink` and `createPrivateSkillLinkCheck` are exported with no `/** */` comment (`:55-56` is a `//` comment). The sk-code-skilled TypeScript checklist requires TSDoc on exported functions in its P1 REQUIRED tier (`assets/checklists/typescript-checklist.md:212-216`). The Python mirror (`skill_advisor_runtime.py:166-184`) does carry docstrings. The file meets the module-header rule, and at 63 lines it falls under the section-divider rule's size threshold.
- **Remediation:** add one-line TSDoc above each export, for example `/** Environment variable naming extra trusted roots, joined by the platform path delimiter. */`, `/** True when a top-level local-* entry resolves to a directory inside a trusted root. */`, and convert `:55-56` to `/** Return a per-scan check that resolves the trusted roots at most once. */`.
- **Disposition:** CONFIRMED (new).

#### SYN-P2-006 (new): phase 4 leaves one completion box open although it reports Complete

- **Location:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:4320`
- **Evidence:** `- [ ] The phase commit is on main and both working trees are clean` stays open, while `spec.md` says `Complete`, `implementation-summary.md:13` says "both commits pushed", and `e8256b8044` and `ff993936c7` are ancestors of `origin/main`.
- **Remediation:** tick `:4320` and append "Evidence: e8256b8044 and ff993936c7 ancestors of origin/main; external commits 4434c1b and c6cd64b7".
- **Disposition:** CONFIRMED (new).

#### SYN-P2-007 (new): six research SOURCE tags cite files the packet deleted

- **Dimension / class:** traceability / `unresolved-citation`
- **Location:** `research/iterations/iteration-004.md:98` (two tags), `research/iterations/iteration-005.md:67`, `research/research.md:122`, `:130`, `:146`
- **Evidence:** the parent validation prints `! SOURCE_TAGS: 6 of 1120 ... do not resolve`. Five tags cite `.skilled/skills/sk-code/sk-code-obsidian/README.md:75`, which is gone because phase 2 deleted it. One cites `.skilled/skills/sk-code/shared/references/stack-detection.md:139`, but the file is now 96 lines. Both lines exist at `42b41dd286`: README line 75 is the plugin-repo symlink sentence, and stack-detection line 139 is the OBSIDIAN detection table row. The resolver (`cite-drift-scan.mjs` `resolveCitation`) has no commit-pinned form, and per `validation-rules.md:115` a tag holding prose is not checked.
- **Remediation:** in each of the six places, rewrite the tag body as prose pinned to the base commit, keeping the bracket form: `sk-code-obsidian README line 75 at commit 42b41dd286` and `shared stack-detection.md line 139 at commit 42b41dd286`. The prose must contain no `path:digits` pair. Rerun `validate.sh ... --recursive --strict` and expect parent `Warnings: 0`.
- **Disposition:** CONFIRMED (new; the six citations named in the brief).

#### SYN-P2-008 (new): other skill-root readers sit outside the inventory, and one follows the private links

- **Location:** `.skilled/commands/doctor/scripts/audit_descriptions.py:197-206`; also `system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:186-189` and `sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:688-692`
- **Evidence:** `walk_skills` iterates `.skilled/skills` with `Path.iterdir()` and keeps every entry whose `SKILL.md` `is_file()`. `is_file()` follows symlinks, so in the operator checkout `local-webflow` and `local-obsidian` enter the `/doctor:skill-budget` report and its exit status. Parent D5 says no private skill reaches "a doctor finding". This is inferred from Python semantics, not run, because this worktree has no `local-*` link. Running `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --json` in the operator checkout would confirm it. The two JavaScript readers use `Dirent.isDirectory()`, so they skip a symlink only by accident and would read a real `local-*` folder. None of the three writes a tracked file.
- **Remediation (operator decision):** decide whether the local skill budget should count the private skills, since their descriptions do reach the local advisor. If not, add `if skill_dir.name.startswith("local-"): continue` at `audit_descriptions.py:203`. Either way, add all three to the phase 3 inventory with their rule (Exclude or Include), and amend D5's "doctor finding" wording if the budget keeps them.
- **Disposition:** CONFIRMED (new).

---

## 4. Remediation Workstreams

P1 first. Inside W1 to W3 the order matters: close the children before the parent.

1. **W1, close phase 002 records (P1: R3-P1-002, R3-P1-003; P2: R3-P2-001).** Fix the AC-013 note, set AC-014 Met, work the `tasks.md` checklist, set the spec and summary status.
2. **W2, close phase 003 records (P1: R3-P1-004; P2: R3-P2-002, R3-P2-004).** Set AC-026 and AC-027 Met with durable proofs, work the checklist, set the status fields.
3. **W3, reconcile parent and goal (P1: R3-P1-001; P2: R1-P2-001, R2-P2-001, R3-P2-003, R3-P2-005, SYN-P2-006, SYN-P2-007).** Update the phase map, continuity, D1 and D3, Block 3 count and goal criterion 3. Tick phase 004's box, rewrite the six citations, then `/speckit:save` and rerun recursive strict validation.

P2 advisories:

4. **W4, guard and scanner hardening (LUNA-R2-P2-001, LUNA-R4-P2-001, R4-P2-001, SYN-P2-008).** Use the `ACMRT` filter plus one harness case, the `listSkillRoots` reuse, an inventory omission test, and the doctor budget decision.
5. **W5, docs coverage and surface residue (R5-P2-001, SYN-P2-001 to SYN-P2-005).** Cover the hooks README count, the advisor README, catalog and playbook entries, the benchmark fixture decision, the quality playbook line, the speckit asset line and the TSDoc.

---

## 5. Spec Seed

- The shipped claim, that the hub sheds both surfaces and nothing private reaches a tracked file, is verified by the commands in section 1. Every P1 is about the record, not the outcome.
- A closure row whose proof is a moment in time (a clean `git status`, an HEAD-equals-remote check) needs a replayable proxy recorded beside it, such as commit ancestry.
- A frozen decision that states an inventory needs an amendment line when a later packet changes that inventory.
- Every skill-root reader must be in the scanner inventory with an explicit `local-*` rule, and a test must enforce that.

## 6. Plan Seed

1. `002-hub-surface-removal/acceptance-criteria.md`: rewrite the `:86` and `:87` notes and set AC-014 Met. Tick `tasks.md:2429-2541` against evidence. Set `spec.md:33` and the summary fields.
2. `003-advisor-vocabulary-cleanup/acceptance-criteria.md`: set AC-026 and AC-027 Met, `:41` Complete, and replace the `:347` proof block. Tick `tasks.md` against evidence. Set the `spec.md:33` and summary fields.
3. `004-private-local-skills/tasks.md:4320`: tick with evidence.
4. Parent `spec.md`: rows `:136-138`, continuity, D1 amendment, D3 limit, `:188` count, `:169` count after W4. Mirror D1 and D3 in `goal.md` and rewrite `goal.md:91`. Then `/speckit:save`.
5. `research/`: rewrite the six citation tags, then rerun `validate.sh --recursive --strict` and require parent `Warnings: 0`.
6. `pre-commit:100,111` to `ACMRT`, plus a new harness case. Rerun `pre-commit.test.sh` and expect 132 passed.
7. `ci-skill-derived-freshness.cjs:51-54` to `regen.listSkillRoots`. Add inventory row 17 and the omission test.
8. Hooks README counts; advisor README paragraph; catalog leaf; playbook scenario; quality playbook and speckit asset one-liners; TSDoc.
9. Operator decisions: benchmark fixtures (SYN-P2-001) and doctor budget (SYN-P2-008).

---

## 7. Traceability Status

### Core Protocols

- **spec_code: partial.** The code matches D2, D4 and D5 for the 16 inventoried scans. The inventory misses the derived-freshness gate (LUNA-R4-P2-001) and three other readers (SYN-P2-008), and D1 and D3 are stale (R3-P2-005, R2-P2-001).
- **checklist_evidence: fail.** Phase 002 and 003 closure rows are Unmet while their proofs pass now. Their `tasks.md` verification checklists are 27 and 23 boxes open, and phase 004 has one open box (R3-P1-002 to R3-P1-004, SYN-P2-006).
- **AC_COVERAGE: exempt.** The parent has no `checklist.md` and no `implementation-summary.md`, so the lifecycle predicate does not apply at the parent.

### Overlay Protocols

- **skill_agent: pass.** All agent mirrors that exist carry the same `local-*` fallback (12 mentions each in `.skilled`, `.opencode`, `.claude`, `.codex`, `.pi`, `.cursor`, `.hermes`).
- **agent_cross_runtime: pass.** TypeScript and Python containment helpers match. `sync-skills-hermes.cjs --check` reports 67 copies in sync.
- **feature_catalog_code: partial.** The sk-code catalog passes its package validator and carries no removed-surface token. The advisor catalog has no entry for private-skill containment (SYN-P2-004).
- **playbook_capability: partial.** The sk-code playbook passes its package validator (18 scenarios). The quality playbook carries one stale Webflow line (SYN-P2-002), and no playbook covers the private-skill gate (SYN-P2-004).
- **sk-code-skilled alignment: pass with one gap.** The drift-guard entry point passes 4 of 4, and the comment-hygiene scan of added lines is clean. TSDoc is missing on the helper's exports (SYN-P2-005).
- **sk-doc mode alignment: pass with residue.** Every touched README, SKILL.md, catalog and playbook validates under its mode. Content residue is listed in SYN-P2-001 to SYN-P2-003.
- **commands: pass with one stale asset line.** No command `.md` was changed by this packet, and runtime mirrors are symlinks or carry no surface reference. One asset is stale (SYN-P2-003).

Resource map: absent, so the Resource Map Coverage Gate does not apply.

---

## 8. Deferred Items

- **Out of packet scope:** `sk-code/ROUTER.md:26` still describes the detected surface as `SKILLED / UNKNOWN`, while `SKILL.md:39` names two surfaces, SKILLED and CI. That drift came with `028bd0f5cd`, not with this packet, so it belongs to the packet that added `sk-code-ci`.
- **Out of packet scope:** `speckit-complete.yaml` (near `:470`) also cites `{matching_target}_authoring.md` (the files are hyphenated) and `.opencode/specs/`. These are pre-existing and unrelated to the removed surfaces.
- **History rewrite:** still an optional operator decision after `005/scratch/evidence/12-history-inventory.md`, unchanged by this review.

## Dimension Expansion Map

- **Lineage dimensions completed:** correctness, security, traceability, maintainability (both lineages); deepseek added a completeness pass.
- **Synthesis directions added:** spec-versus-code drift and stale cross-references; sk-code-skilled code alignment; sk-doc mode alignment for READMEs, SKILL.md, catalogs and playbooks; commands and runtime mirrors.
- **Completed pivots:** 0. **Failed pivots:** 0. **Audited overrides:** 0. **Council artifacts:** none.
- **Saturated directions:** none recorded.
- **Remaining frontier:** the doctor budget behavior in the operator checkout (SYN-P2-008) has not been run.

## 9. Search Ledger

- **searchCoverage:** graphless in both lineages. This pass used exact `rg` over the tracked tree (excluding `specs/`, `changelog/`, `benchmark/reports/` and symlinked runtime roots), git ancestry checks, and the packet's own handoff commands.
- **candidateCoverage:** removed-surface residue in the hub, advisor, commands and mirrors (covered; three hits). Generated retrieval data (covered; the 69, 69 and 38 mentions all come from `specs/sk-code/007-sk-code-obsidian-surface/`, which phase 5 allowlisted under AC-003). Skill-root enumerators (covered; four outside the inventory). Doc mode validators (covered; all pass).
- **ruledOutCandidates:** a private path in the trigger index or the compiled graph (the graph's only `obsidian` signals belong to `mcp-tooling`); Hermes mirror drift; agent mirror drift; ephemeral labels in added comments; command `.md` drift; `create-skill-parent` "webflow" examples (generic D6 vocabulary).
- **searchDebt:** none. `hasSearchDebt: false`.

## 10. Audit Appendix

### Finding adjudication

- **CONFIRMED (15):** R3-P1-001, R3-P1-002, R3-P1-003, R3-P1-004, R1-P2-001, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R3-P2-004, R3-P2-005, R4-P2-001, R5-P2-001, LUNA-R2-P2-001, LUNA-R4-P2-001.
- **DUPLICATE (2):** LUNA-R1-P1-001 duplicates R3-P1-001 (same `spec.md:50` contradiction). R1-P2-002 is folded into R1-P2-001 (same `goal.md:91` criterion, one rewrite).
- **REFUTED (3):**
  - R4-P2-002: the claim that the guard does not record why only four roots need ignore rules is false. The reason sits beside the four rules at `.gitignore:229-234`: runtime roots that link to `.skilled/skills` cannot stage beneath a symlink. A guard root list wider than the ignore list is deliberate defense in depth, not an inconsistency.
  - R4-P2-003: phase 002's own CHK-051 requires `scratch/` to hold only `.gitkeep`, so an empty scratch folder is by design. The durable proofs are the fenced commands and recorded outputs in each `acceptance-criteria.md`, and this pass replayed Blocks 1 to 3 from them successfully. The one true part, the "Worker reports" citation at `implementation-summary.md:82`, is covered by R3-P2-001.
  - R5-P2-002: `graph-metadata.json` does contain `derived.last_active_child_id`. Its value is stale (it points at 002), which R3-P1-001 covers.
- **Adversarial check on the P1 set:** each P1 was re-read at its line and challenged on severity. They stay P1 because each one makes a closure gate (`acceptance-criteria.md` or the parent status) state the opposite of verifiable fact. The repo's completion rule treats those gates as authoritative, so a resume or an `AC_CLOSURE` read on these documents gets a wrong answer. None is P0, because no shipped behavior is wrong.

### Commands run by this synthesis (output and exit read)

- `git merge-base --is-ancestor` for the eight packet commits plus `42b41dd286` and `634c32b3c7`: all ancestors of `origin/main`.
- `pre-commit.test.sh`: exit 0, `131 passed, 0 failed`. `git check-ignore -v`: exit 0, two lines.
- `verify-doc-claims.cjs`: exit 0, `4/4`. `verify-router-sync.cjs`: exit 0, `5/5`. Scoped `rg`: exit 1, no output.
- Block 3 graph check: `[]`. Block 3 vitest: exit 0, `Tests  19 passed (19)`.
- `validate.sh --recursive --strict`: exit 0, six `RESULT: PASSED`, parent `Warnings: 1`.
- `run-all-drift-guards.sh`: exit 0, 4 of 4 guards PASSED.
- `validate_skill_package.py --strict` (sk-code): exit 0, PASS. `validate_catalog_package.py --package sk-code --strict`: exit 0, PASS. `validate-playbook-package.cjs --package sk-code`: exit 0, PASS. `validate_document.py` on 13 docs: all valid.
- `sync-skills-hermes.cjs --check`: exit 0, 67 in sync.
- `advisor_recommend` for `implement a typescript script`: exit 0, `sk-code` with compiled route to `sk-code-skilled`.

### Sources reviewed

Parent `spec.md`, `goal.md`, `graph-metadata.json`; every child's `spec.md`, `acceptance-criteria.md`, `implementation-summary.md`, `tasks.md` (status and checklist regions) and phase 003's `decision-record.md` review amendments; both lineage `review-report.md` files, registries and iteration headings; the merged registry and `fanout-attribution.md`; `.gitignore`; the pre-commit hook, harness and hooks README; `private-skill-target.ts`; `skill_advisor_runtime.py`; `ci-skill-derived-freshness.cjs`; `regenerate-skill-derived.cjs`; `audit_descriptions.py`; the routing-registry-drift workflow; the sk-code hub's `mode-registry.json`, `SKILL.md`, `README.md`, `ROUTER.md`, feature catalog, playbook and benchmark fixtures; the sk-code-skilled `SKILL.md` and TypeScript checklist; the sk-doc `sk-create-readme`, `sk-create-skill`, `sk-create-feature-catalog`, `sk-create-manual-testing-playbook` and `sk-create-command` contracts and validators; `.skilled/commands/` and the runtime command mirrors; `validation-rules.md`; the research folder's flagged citations.

### Cross-reference appendix

#### Core Protocols

- spec_code: partial (LUNA-R4-P2-001, SYN-P2-008, R3-P2-005, R2-P2-001).
- checklist_evidence: fail (R3-P1-002, R3-P1-003, R3-P1-004, SYN-P2-006).

#### Overlay Protocols

- skill_agent: pass. agent_cross_runtime: pass. feature_catalog_code: partial (SYN-P2-004). playbook_capability: partial (SYN-P2-002, SYN-P2-004).

Review verdict: CONDITIONAL
