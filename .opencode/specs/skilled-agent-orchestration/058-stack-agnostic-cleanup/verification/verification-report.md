# Phase 071 Independent Verification Report

## VERDICT
**Status**: FAIL
**Date**: 2026-05-05
**Verifier**: cli-codex (gpt-5.5, xhigh, fast)

## EXECUTIVE SUMMARY
I ran the requested four-lens verification against the live workspace and pinned the content findings back to commit `61004e357` because the current worktree is dirty with unrelated changes. Routing is healthy: the 8-prompt suite passed, the skill graph compiler passed, `sk-code` remains intact, and the 071 packet itself passes strict spec validation.

The cleanup is not complete. Non-`sk-code` files still contain stack/library/codebase-specific content: `motion_dev` in executable mcp-coco-index defaults, `webflow` routing cues in system-spec-kit advisor source/tests, tracked `anobel` scan/test fixtures, a literal `A. Nobel & Zn` example in mcp-code-mode, and hardcoded local `/Users/michelkerkmeester/...` paths in changed cli-opencode docs. There are also semantic regressions in the MyService replacement: one manual test uses `myservice.myservice_list_sites()` while the rest of the Code Mode docs teach `myservice.myservice_sites_list()`.

## LENS 1 - COVERAGE
### Lens 1.1 - broad recursive content grep
Result: **FAIL**.

- Live workspace command returned 28 file hits, including generated/cache/database artifacts.
- Commit-pinned audit of `61004e357` returned 15 non-protected file hits and 41 matching lines.
- True coverage gaps include:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:68` hardcodes `assets/motion_dev/**`.
  - `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:70` and `skill_advisor.py:1358` still route on `webflow`.
  - `.opencode/skills/system-spec-kit/scripts/.folder-list.txt:17` and `.scan-lines.txt:17` contain `00--anobel.com` paths.
  - `.opencode/skills/mcp-code-mode/references/workflows.md:106` contains `A. Nobel & Zn`, which the original regex missed.

The command also matched `snake_case JSON`; I treated those as false positives because they are generic JSON shape references, not `snake_case JS`.

### Lens 1.2 - uppercase surface tags
Result: **FAIL for taxonomy comments, PASS for allowed runtime mentions**.

Runtime `OpenCode`, `OPENCODE_*`, and generic `UNKNOWN_FALLBACK` hits are expected in cli runtime docs. Actual surface-taxonomy leakage remains in system-spec-kit advisor source:

- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:69`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:1337`

### Lens 1.3 - scripts for hardcoded references
Result: **FAIL**.

Script/source hits remain in:

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/session-enrichment.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/test-subfolder-resolution.js`

### Lens 1.4 - graph-metadata stack tokens
Result: **PASS**.

No non-`sk-code` `graph-metadata.json` file contained the checked stack/library terms.

### Lens 1.5 - compiled skill graph
Result: **CONDITIONAL**.

The exact provided term list returned no hits. A broader hyphen-aware scan still finds `motion-dev integration` in `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:279`, derived from `sk-code` metadata. Either explicitly exempt the `sk-code` node inside the compiled graph or filter stack-specific key topics out of the non-`sk-code` compiled artifact.

### Additional path/codebase scan
Result: **FAIL**.

Changed cli-opencode docs still contain hardcoded local workspace paths:

- `.opencode/skills/cli-opencode/README.md:128`
- `.opencode/skills/cli-opencode/references/opencode_tools.md:52`

## LENS 2 - SEMANTIC CORRECTNESS
### `.opencode/skills/mcp-code-mode/README.md`
Verdict: **PASS**.

The replacement preserves the doubled-prefix lesson. It explicitly says the naming pattern is `{manual_name}.{manual_name}_{tool_name}` and uses `myservice.myservice_sites_list({})`.

### `.opencode/skills/mcp-code-mode/references/naming_convention.md`
Verdict: **PASS**.

The guide explains why the doubled prefix exists: namespace collision prevention, source identification, TypeScript interface generation, and UTCP protocol requirements. The MyService examples are coherent here.

### `.opencode/skills/mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/002-myservice-list-sites.md`
Verdict: **FAIL**.

This file uses `myservice.myservice_list_sites()` at lines 14, 26, 44, and 65, while the rest of the Code Mode docs consistently use `myservice.myservice_sites_list()`. That breaks the replacement lesson and likely makes the scenario non-runnable.

### `.opencode/skills/mcp-coco-index/SKILL.md` and `mcp_server/cocoindex_code/settings.py`
Verdict: **FAIL**.

The docs now use `.opencode/skills/*/assets/<library>/**`, which conveys the generic library-specific subfolder pattern. The executable default still hardcodes `.opencode/skills/*/assets/motion_dev/**` in `settings.py:68`, so the implementation did not follow the doc cleanup.

### `.opencode/skills/sk-code-review/README.md` and `SKILL.md`
Verdict: **PASS**.

`sk-code:<surface>` is consistently used as a placeholder, and README links readers to `../sk-code/SKILL.md` as the source of truth for surface-aware standards.

### `.opencode/skills/system-spec-kit/references/memory/epistemic_vectors.md`
Verdict: **PASS**.

The examples now use generic auth/component scenarios and still illustrate epistemic gaps, model boundary, temporal variability, and situational completeness.

### `.opencode/skills/mcp-code-mode/references/workflows.md`
Verdict: **FAIL**.

The MyService replacement still leaks the former real client in expected logs: `"Getting collections for: A. Nobel & Zn"` at line 106.

### Deterministic random sample
Seed: `61004e357`. Sampled changed non-deleted skill files:

- `.opencode/skills/mcp-code-mode/manual_testing_playbook/07--recovery-and-config/002-disabled-server-omitted.md`: PASS.
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json`: PASS.
- `.opencode/skills/system-spec-kit/references/structure/folder_structure.md`: PASS.
- `.opencode/skills/mcp-chrome-devtools/examples/README.md`: FAIL, dead links to old `sk-code/references/debugging` and `sk-code/references/implementation` paths.
- `.opencode/skills/cli-opencode/SKILL.md`: PASS in sampled region.

## LENS 3 - SK-CODE PRESERVATION
### 3.1 `sk-code/SKILL.md` still names stack specifics
Result: **PASS**.

`Webflow`, `Motion.dev`, `GSAP`, `Lenis`, `Swiper`, and `FilePond` remain in `sk-code/SKILL.md`.

### 3.2 `sk-code/references/` subdirs
Result: **PASS**.

`webflow/` and `motion_dev/` still exist.

### 3.3 `sk-code` untouched in commit `61004e357`
Result: **PASS**.

`git show --stat 61004e357 -- .opencode/skills/sk-code` returned no changes.

### 3.4 `sk-code/graph-metadata.json` still surfaces stack names
Result: **PASS**.

The graph metadata still includes `webflow`, `motion.dev`, `motion-dev`, and `motion_dev`.

## LENS 4 - ROUTING + ADVISOR
### 4.1 8-prompt regression suite
Result: **PASS - 8/8**.

| Prompt | Expected | Actual |
|---|---:|---:|
| iterative review loop for spec folder audit | deep-review | deep-review |
| review this PR for code quality | sk-code-review | sk-code-review |
| single pass code review with security findings | sk-code-review | sk-code-review |
| audit findings drift readiness | sk-code-review | sk-code-review |
| deep research loop with convergence tracked | deep-research | deep-research |
| multi-pass review with convergence detection | deep-review | deep-review |
| code review findings drift | sk-code-review | sk-code-review |
| implement a frontend component | sk-code | sk-code |

### 4.2 Skill graph compiler validation
Result: **PASS**.

`VALIDATION PASSED: all metadata files are valid`.

### 4.3 Strict spec validation
Result: **PARTIAL**.

- `specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup`: PASS.
- `specs/skilled-agent-orchestration`: FAIL. Parent validation reports missing required phase-parent file(s) and one `graph-metadata.json` shape error.

## FINDINGS
| ID | Severity | Lens | File:Line | Issue | Recommendation |
|---|---|---:|---|---|---|
| V-001 | P0 | 1 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:68` | Non-`sk-code` executable default hardcodes `assets/motion_dev/**` and comments `motion.dev`. | Replace with a generic canonical assets pattern or configurable library-asset default, then update tests/docs together. |
| V-002 | P0 | 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:70` | system-spec-kit advisor source still contains `webflow` route keywords and WEBFLOW/OPENCODE surface taxonomy comments outside `sk-code`. | Move stack-specific routing cues into `sk-code` metadata or rename them to generic code-surface examples owned by the advisor. |
| V-003 | P0 | 1 | `.opencode/skills/system-spec-kit/scripts/.folder-list.txt:17` | Tracked scan/cache artifacts and tests still leak `00--anobel.com` paths. | Remove generated scan artifacts from tracked content or regenerate with neutral fixtures; update tests using generic fixture paths. |
| V-004 | P0 | 2 | `.opencode/skills/mcp-code-mode/references/workflows.md:106` | MyService workflow expected logs still mention `A. Nobel & Zn`, a real codebase/client name missed by the regex. | Replace with a neutral example name such as `Example Corp`; broaden future searches to `nobel|a[ ._-]*nobel`. |
| V-005 | P0 | 1 | `.opencode/skills/cli-opencode/README.md:128` | Changed cli-opencode docs still hardcode `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. | Replace local paths with `$REPO_ROOT`, `/path/to/repo`, or a temp sandbox path in all changed cli-opencode examples. |
| V-006 | P1 | 2 | `.opencode/skills/mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/002-myservice-list-sites.md:44` | MyService manual test uses `myservice.myservice_list_sites()` while the naming docs teach `myservice.myservice_sites_list()`. | Align the scenario with the documented placeholder API name and re-check all MyService examples for consistency. |
| V-007 | P2 | 2 | `.opencode/skills/mcp-chrome-devtools/examples/README.md:123` | Example README links to old `sk-code/references/debugging` and `references/implementation` paths that no longer exist. | Point links at existing `sk-code/references/webflow/...` paths or remove surface-specific cross-links from this agnostic skill. |
| V-008 | P2 | 4 | `specs/skilled-agent-orchestration/graph-metadata.json:1` | Parent `specs/skilled-agent-orchestration` fails strict validation while the packet passes. | Restore phase-parent required files/shape, or document why parent validation is intentionally out of scope. |
| V-009 | P2 | 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:279` | Compiled skill graph still contains hyphenated `motion-dev integration`; the provided Lens 1.5 term list misses this variant. | Either explicitly exempt `sk-code` node metadata inside the compiled graph or filter stack-key topics from non-`sk-code` artifacts; add `motion-dev` to verification terms. |

## REMEDIATION RECOMMENDATION
Needs remediation before commit readiness. Fix the P0 coverage leaks first: `mcp-coco-index` settings, system-spec-kit advisor Webflow cues, tracked `anobel` artifacts/tests, mcp-code-mode `A. Nobel & Zn`, and cli-opencode local paths. Then fix the P1 MyService tool-name inconsistency and rerun all four lenses, including a broadened `nobel|a[ ._-]*nobel|motion[._-]?dev` pattern and strict parent validation.
