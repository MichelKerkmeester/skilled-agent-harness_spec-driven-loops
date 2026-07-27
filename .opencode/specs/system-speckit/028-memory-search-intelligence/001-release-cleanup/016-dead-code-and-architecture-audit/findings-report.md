---
title: "Findings Report: Dead Code, Legacy Artifact and Architecture Simplification Audit"
description: "Eighty-eight raw findings from twenty forced-depth research passes across three model families, with an independently verified high-risk subset, two refuted dead-code claims, and a ranked remediation order."
trigger_phrases:
  - "dead code findings report"
  - "release cleanup 016 findings"
  - "architecture audit findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/016-dead-code-and-architecture-audit"
    last_updated_at: "2026-07-27T08:56:02Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Completed the twenty-pass research program and authored the findings report"
    next_safe_action: "Operator ranks findings, then a separate remediation phase verifies each candidate before touching it"
    blockers: []
    key_files:
      - "findings-report.md"
      - "research/findings-registry.json"
      - "research/devin-findings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-016-dead-code-audit"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "Which findings does the operator approve for the remediation phase?"
    answered_questions: []
---
# Findings Report: Dead Code, Legacy Artifact and Architecture Simplification Audit

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. SUMMARY

Twenty forced-depth research passes across three model families produced **88 raw findings**. No lineage stopped on early convergence. Nothing in the repository was deleted, moved, or modified.

| Source | Model | Passes | Findings |
|--------|-------|--------|----------|
| Fan-out lineage `sol` | `openai/gpt-5.6-sol`, effort high | 10 | 10 |
| Fan-out lineage `composer` | `composer-2.5-fast` | 5 | 22 |
| Manual `devin-01` | `glm-5-2` (GLM 5.2 High) | 1 | 21 |
| Manual `devin-02` | `glm-5-2` | 1 | 6 |
| Manual `devin-03` | `glm-5-2` | 1 | 12 |
| Manual `devin-04` | `glm-5-2` | 1 | 14 |
| Manual `devin-05` | `glm-5-2` | 1 | 3 |
| **Total** | | **20** | **88** |

Raw category spread (pre-dedup): CAT-1 16, CAT-2 10, CAT-3 10, CAT-4 11, CAT-5 35, CAT-6 13.

**The single most important result is not a finding. It is a refutation.** See section 3.

---

## 2. VERIFICATION STATUS — READ BEFORE ACTING

This report distinguishes three tiers. Treat the tiers as load-bearing.

| Tier | Meaning | Count |
|------|---------|-------|
| **CONFIRMED** | Independently re-verified during this audit against the real tree | 6 |
| **REFUTED** | Claimed by a research pass, disproved on verification | 2 |
| **UNVERIFIED** | Path-checked only; the finding's own claim has NOT been independently re-tested | 80 |

Path existence was checked for every finding and is clean: all Devin finding paths resolve once `:line` suffixes and brace expansions are parsed, and all composer paths resolve or are findings *about* an absent target.

**Path existence is not claim verification.** A path can exist while the claim about it is wrong — which is exactly what happened twice. Every UNVERIFIED finding must be re-tested by the remediation phase before anything is deleted.

---

## 3. REFUTED CLAIMS

### R-001 — `validate-doc-model-refs.js` is NOT dead code (refutes `devin-01 F11`, CAT-1)

**Claim**: "`validate-doc-model-refs.js` has no reachable callers. No references in any `.md`/`.json`/`.yaml`/`.py`/`.cjs`/`.js` across the hub; not in CI or package.json."

**Reality**: it runs on every commit in this repository.

- `.opencode/scripts/git-hooks/pre-commit:22` — `VALIDATOR="$REPO_ROOT/.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js"`
- `.git/hooks/pre-commit` is a live symlink to `.opencode/scripts/git-hooks/pre-commit`
- `.opencode/scripts/install-git-hooks.sh:10` documents it as part of the installed hook chain

**Root cause of the error**: the pass scoped its reachability search to the `sk-doc` hub and never looked at `.opencode/scripts/`. This is precisely the dynamic-invocation blind spot the audit was designed to guard against — a hook invokes the script by path string, so no import graph shows it.

**Blast radius had this been actioned**: deleting the file breaks the installed pre-commit gate for every commit.

**Verify**:
```bash
rg -n "validate-doc-model-refs" .opencode/scripts/git-hooks/pre-commit .opencode/scripts/install-git-hooks.sh
ls -la .git/hooks/pre-commit
```

### R-002 — `chokidar` is NOT an unused dependency (partially refutes `devin-04 F5`, CAT-1)

**Claim**: "Root `package.json` dependencies (`chokidar`, `cors`, `express`) have zero imports in the codebase."

**Reality**: `chokidar` has 5 importing files. The pass's grep used `--include=*.js --include=*.cjs --include=*.mjs` and therefore never searched `.ts` sources.

`cors` and `express` are confirmed unused — the claim is correct for two of three.

**Verify**:
```bash
rg -l -e "require\(.chokidar.\)" -e "from .chokidar." --glob '!node_modules' .   # 5 files
rg -l -e "require\(.express.\)" -e "from .express."  --glob '!node_modules' .    # 0 files
```

---

## 4. CONFIRMED FINDINGS — RANKED

Ranked by remediation value against blast radius. These six were independently re-verified.

### C-001 — CAT-1: A test file has been silently not running since it was created

**Path**: `.opencode/skills/system-spec-kit/scripts/tests/detector-regression-floor.vitest.ts.test.ts`

**Claim**: the file is named `*.vitest.ts.test.ts`; the vitest `include` globs are `tests/**/*.vitest.ts`, `scripts/tests/**/*.vitest.ts`, `mcp-server/tests/**/*.vitest.ts`. The trailing `.test.ts` means no glob matches it, and no other test imports it. Both modules it exercises exist, so the only defect is the filename.

**Value**: high. Two `it()` cases covering deterministic-extractor provenance and evidence-gap-detector framing have never executed.

**Blast radius**: renaming it to `detector-regression-floor.vitest.ts` adds two live cases. If either frozen outcome drifted while the file was hidden, the rename surfaces a real regression — which is the point, but expect it to fail first.

**Verify**:
```bash
grep -A4 'include' .opencode/skills/system-spec-kit/vitest.config.ts
ls .opencode/skills/system-spec-kit/scripts/tests/*.vitest.ts | grep -c detector-regression-floor   # 0
rg -l 'detector-regression-floor' .opencode/skills/system-spec-kit --glob '*.vitest.ts' | wc -l     # 0
```

### C-002 — CAT-5: `cli-devin` documents a runtime capability that does not exist

**Path**: `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:171,277`

**Claim**: the skill states that orchestrated execution delegates to `fanout-run.cjs` "using executor kind `cli-devin`", and makes it a hard rule. That executor kind is not in `EXECUTOR_KINDS` (`executor-config.ts:11`, which lists exactly `native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`), and the string `cli-devin` appears nowhere in `fanout-run.cjs`.

**Value**: high. This audit hit it directly — the Devin passes had to be run as manual dispatches because the documented orchestration path does not exist.

**Blast radius**: low to fix as documentation; high if someone instead implements the adapter to match the doc without checking whether it is wanted.

**Verify**:
```bash
grep -n "EXECUTOR_KINDS = " .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
grep -c "cli-devin" .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs   # 0
```

### C-003 — CAT-5: `--convergence-mode` is silently dropped by the fan-out path

**Path**: `.opencode/commands/deep/research.md:3` (documented flag) vs `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1034-1052`

**Claim**: `/deep:research` accepts `--convergence-mode=default|off|sliding-window|divergent`. On a fan-out run the lineage prompt is built from a fixed parameter list — `spec_folder`, lineage dir, session id, executor, `loop_type`, `config.stopPolicy`, `research_topic`, `config.maxIterations`, `config.convergenceThreshold`. `convergenceMode` is absent from `fanout-run.cjs` entirely, so the flag has no effect and no warning is emitted.

**Value**: high. A caller asking for divergent expansion on a fan-out silently gets ordinary convergence behavior. This audit had to compensate with prompt-level instructions.

**Blast radius**: medium. Threading it through is additive; the risk is behavioral change in existing fan-out runs that unknowingly relied on the drop.

**Verify**:
```bash
grep -c "convergenceMode" .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs   # 0
grep -n "convergence-mode" .opencode/commands/deep/research.md
```

### C-004 — CAT-5: `--lineage-timeout-hours` is documented as raising a ceiling it cannot raise

**Path**: `.opencode/commands/deep/research.md:142` vs `fanout-run.cjs:1130-1139`

**Claim**: the docs say the flag "raises the per-lineage wall-clock timeout ceiling above the default 4 hours". The runtime defines `LINEAGE_LIFETIME_HARD_MAX_HOURS = 4` and throws `INPUT_VALIDATION` for any override above it. A positive override may only narrow, never widen.

**Value**: medium-high. It is a hard dispatch failure, not a silent one — this audit's first fan-out attempt died on it.

**Blast radius**: low. Documentation fix.

**Verify**:
```bash
grep -n "LINEAGE_LIFETIME_HARD_MAX_HOURS" .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
sed -n '142p' .opencode/commands/deep/research.md
```

### C-005 — CAT-1: Dead npm script and two genuinely unused dependencies

**Path**: `package.json:4-9`

**Claim**: `"dev": "node src/3_staging/server.js"` targets a path that does not exist — there is no `src/` directory at the repo root. `cors` and `express` have zero importers outside `node_modules`. (`chokidar` does have importers — see R-002.)

**Value**: medium. Small, clean, low-risk cleanup.

**Blast radius**: low. Confirm no external tooling shells out to `npm run dev` before removing.

**Verify**:
```bash
ls src/3_staging/server.js          # No such file or directory
rg -l -e "from .express." -e "require\(.express.\)" --glob '!node_modules' . | wc -l   # 0
```

### C-006 — CAT-3/CAT-4: Dangling install-guide symlink from a naming-convention mismatch

**Path**: `.opencode/install-guides/MCP - Chrome Dev Tools.md`

**Claim**: the symlink targets `../skills/mcp-chrome-devtools/INSTALL_GUIDE.md` (underscore). Its four sibling symlinks all target `INSTALL-GUIDE.md` (hyphen), and the hyphen form is what exists. The link is dangling.

**Value**: medium. Broken operator-facing documentation entry point.

**Blast radius**: low. Re-point the symlink.

**Verify**:
```bash
ls -la .opencode/install-guides/ | grep Chrome
find .opencode/install-guides -maxdepth 1 -type l ! -exec test -e {} \; -print
```

---

## 5. UNVERIFIED REMAINDER (80 findings)

Full records: `research/findings-registry.json` (32 fan-out, with per-lineage attribution in `research/fanout-attribution.md`) and `research/devin-findings.json` (56 manual, normalized).

Concentrations worth the operator's attention:

| Area | Findings | Notes |
|------|----------|-------|
| CAT-5 architecture | 35 | Largest category by far. Heaviest in `commands/` + `agents/` (7) and the CLI/MCP orchestration hubs (5) |
| CAT-6 over-engineering | 13 | Mostly from the `sol` lineage, which carried this category almost alone |
| Superseded benchmark trees | several | `sk-code/benchmark/{after,baseline,full,live,live-remediated}` and `sk-git/benchmark/…` — the owning READMEs already label these superseded |
| Legacy changelogs | 8 files | `sk-code/changelog/v3.*.md` describe an architecture two restructures out of date |

**None of these has been re-tested.** Given that 2 of the 6 claims spot-checked in the highest-risk category turned out wrong, assume a comparable error rate here.

---

## 6. CROSS-SOURCE OBSERVATIONS

**The models were complementary, not redundant.** `sol` produced zero CAT-1 and zero CAT-2 findings across 10 deep iterations; `composer` supplied all seven of those in 5 fast iterations. `sol` carried CAT-5 and CAT-6. The Devin passes covered four hubs on which the entire fan-out produced nothing.

**Gap-driven focus selection outperformed the pre-planned list.** The briefing's example focuses for the manual passes duplicated ground `composer` had already walked. Re-targeting them at surfaces with zero fan-out coverage yielded 56 findings, including 6 CAT-1 items in the runtime mirrors and root config — more than the entire fan-out produced in that category.

**No cross-source contradictions were found.** The two errors were single-source overreach, not disagreement between sources.

---

## 7. CAVEATS ON THE EVIDENCE BASE

1. **`composer` state log carries fabricated timestamps.** The orchestrator logged a `timestamp_anomaly`: 6 of 9 state records bear future clock values (06:36–06:41, written before 06:32). Its *findings* verified on spot-check, but its iteration metrics are not trustworthy. `sol`'s state log is clean and shows 10 genuine `type:iteration` records.

2. **`devin-05` initially returned a summary instead of its findings** — "Audit complete. Three findings (F1–F3)" with none of them printed, exiting 0. Caught by checking output size, not exit status. Preserved as `.pass-05-summary-only-attempt1.txt`; the retry with an explicit output contract produced the real report.

3. **`composer` completed 5 iterations in 5.2 minutes.** Fast enough to warrant the spot-checking it received. Its findings held up, but the depth per iteration is not comparable to `sol`'s.

4. **A concurrent session was active throughout.** It committed this packet mid-audit and landed 5 commits, one of which is `feat(cli-devin): implement phase 013 PermissionRequest adapter` — meaning `cli-devin` was being modified while being audited. C-002 should be re-checked against current `HEAD` before action.

---

## 8. HANDOFF

This phase reports; it does not remediate. Recommended order for a bounded remediation phase:

1. **C-001** — rename the hidden test file, then fix whatever regression it surfaces.
2. **C-004, C-003, C-002** — the three doc-vs-runtime drifts, cheapest first. Decide per case whether the doc or the runtime is wrong.
3. **C-006, C-005** — small mechanical cleanups.
4. **Triage the 80 unverified findings** before any of them is actioned; start with CAT-3 residue, which is the lowest-risk category to verify and clear.

**Do not delete anything on the strength of an unverified finding.** R-001 is the proof of why.
