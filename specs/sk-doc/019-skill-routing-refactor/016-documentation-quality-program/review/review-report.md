# Deep Review Report: sk-doc Documentation-Quality Program (packet 021)

> Read-only GPT-5.6-SOL (high effort, fast tier) deep review, 20 forced iterations, no early convergence.
> Branch: `sk-doc/0097-documentation-quality` | Scope: 347 changed files vs v4 merge-base `e646d31be`.
> Reviewer sandbox: `--sandbox read-only` (codex could read/`git diff`/grep but could not modify anything).

---

## 1. VERDICT

**FAIL — not merge-ready.** The branch contains at least one confirmed branch-introduced correctness defect (NUL-byte file corruption) plus real broken-reference and non-runnable-command defects. Remediation is required before the v4 ff-merge.

Raw findings: **14 P0, 52 P1, 2 P2** (68 total across 20 passes). After orchestrator verification, the P0 count is materially lower than raw (see calibration): several P0s are confirmed real, one is confirmed false, and one is a sandbox artifact; the rest are plausible and need per-item triage.

---

## 2. METHODOLOGY AND CALIBRATION

- Each pass ran a fresh `codex exec gpt-5.6-sol` at `--sandbox read-only`, reviewing the program's actual changes via `git diff e646d31be..HEAD`. All 20 passes exited `status=0`, no timeouts. Findings are in `iterations/iter-01.md` … `iter-20.md`.
- **Safety:** read-only sandbox meant the reviewer physically could not write; out-of-packet changes stayed at 0 for the whole run. (This review was rebuilt on read-only codex after the workspace-write executor destroyed an out-of-scope file — see the separate `system-deep-loop/038` containment fix.)
- **Calibration caveat (important):** because the reviewer ran read-only, any finding that depends on the reviewer *executing a tool that writes* (e.g. `validate.sh`, `python3 -m py_compile`) can be a **false positive** — those tools fail to write their `.pyc`/DB in a read-only sandbox and look like failures. Findings about **files, links, paths, and content** are reliable; findings about **"command fails" / "validation fails"** must be re-checked in a writable run.

Verification performed by the orchestrator (writable, authoritative):

| Finding | Raw | Verified result |
|---|---|---|
| Header transform wrote NUL bytes into 2 files | P0 | **CONFIRMED REAL** — `writing-style-guide.md` and `vision-audit-benchmark.md` each have 2 NUL bytes; 0 at merge-base → branch-introduced. `## 6. COLOUR NAMING (v0)` became `(\0 0 \0)`. |
| 1,290 style-catalog links one dir too shallow | P0 | **CONFIRMED REAL** — `styles/README.md` links `(099-supply/)` but the target is `library/bundles/099-supply/`; every catalog row is affected. Phase 008 (`a4b492c6`) touched this file. |
| create-skill Quick Start non-runnable | P0 | **CONFIRMED REAL (plausible)** — command mixes `scripts/init_skill.py` (create-skill-relative) with `--path .opencode/skills` (repo-root-relative); no single CWD runs it. |
| All 10 "complete" phases fail strict validation | P0 | **REFUTED (false positive)** — `validate.sh --strict --recursive` on the parent returns `Errors: 0, RESULT: PASSED`. Read-only-sandbox artifact. |
| "Validation commands cannot run from the documented directory" | P0 | **SUSPECT** — same tool-write-failure class as above; re-check in a writable run. |

---

## 3. CONFIRMED BLOCKERS (fix before merge)

1. **NUL-byte corruption (P0, small blast radius).** The header-uppercase transform corrupted two files by inserting NUL bytes where it tried to uppercase a parenthetical token (`(v0)`):
   - `.opencode/skills/sk-design/design-md-generator/references/writing-style-guide.md:149`
   - `.opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md:36`
   Root cause is a bug in the transform's character handling. Fix: restore the intended text in both files and add a NUL-byte guard to the transform. This also implicates the transform's correctness (see the two P1 validator findings below).

2. **1,290 broken style-catalog links (P0).** `.opencode/skills/sk-design/styles/README.md` links each style to `(<slug>/)` but the bundles live under `library/bundles/<slug>/`. Phase 008 edited this file under a "broken-ref cleanup" banner without fixing these. Attribution (pre-existing sk-design vs introduced) should be confirmed, but the branch ships 1,290 dead links in a file the program touched.

3. **Non-runnable Quick-Start commands / false output contracts (P0).** e.g. `create-skill/README.md:45-48` mixes working-directory assumptions. Several rewritten READMEs assert commands/outputs that don't hold. Triage the full set in iter-06 / iter-20.

4. **Validator correctness (P1, but it underpins the transform).** The refined `is_uppercase_section` (iter-01): (a) the internal-capital proper-noun exemption lets arbitrary mixed-case prose (`oVERVIEW`, `tITLE cASE`) pass the ALL-CAPS gate; (b) the parenthetical/URL regex exemptions mis-handle nested delimiters. Given #1, the transform+validator pair needs a correctness fix together.

---

## 4. FINDING INVENTORY (by severity → iteration)

Full detail per finding (file:line, evidence, fix) lives in `iterations/iter-NN.md`. Summary:

**P0 (14 raw):** transform NUL corruption [05,16,20]; broken style-catalog links / styles overview / extractor README [09,17,20]; non-runnable Quick-Start & false output contracts [06,20]; hook-support README → nonexistent test suite, local-LLM README stale refs, "validation cannot run" [10]; Chrome DevTools install-guide dangling symlink [17]; "all phases fail strict validation" [14,20 — REFUTED].

**P1 (52 raw):** content-accuracy gaps between authored READMEs and the code they describe (invented files/exports, stale counts, false capability claims) across system-deep-loop, sk-design, system-spec-kit, sk-code, mcp-tooling, cli-external-orchestration, mcp-code-mode [08–13]; catalog/inventory mismatches (runtime/lib, runtime/tests) [12]; spec-doc honesty issues — checklist item miscounts, phase completion counts not matching the diff (e.g. 270-header/58-file, 131-vs-124 READMEs, 100-vs-64 repaired), obsolete "eight-phase" parent narrative [14–16]; HVR: Oxford commas retained in rewritten prose [19]; uppercase transform mangled case-sensitive path/API tokens [05,19]. These are mostly reliable (file/content class), but the spec-honesty count-mismatches should be reconciled against the actual diff before acting.

**P2 (2):** Figma README `_common.sh` sourcing claim; Chrome overview doctor attribution [11].

---

## 5. DIMENSION COVERAGE

All six requested dimensions were exercised: transform+validator correctness (1,2,5,19); 10a checker + data (3,4); broken-link/ref accuracy (13,17); code-README content accuracy (6–12); spec-doc conformance (14–16); adjacent routing/manifest regressions (18); plus HVR (19) and a whole-program release-readiness synthesis (20).

---

## 6. NEXT STEPS

- **Remediation (recommended):** `/speckit:plan` a fix packet for the confirmed blockers — NUL corruption (2 files + transform guard), validator correctness, the 1,290 catalog links, and the non-runnable Quick-Start commands. Triage the P1 content-accuracy set surface-by-surface against the code.
- **Re-check the sandbox-suspect findings** ("validation/command fails") in a normal writable run before treating them as real.
- **Reconcile the spec-honesty count claims** (270/131/100 etc.) against `git diff` and correct the phase docs.
- Do **not** ff-merge to v4 until at least the NUL corruption and broken-link blockers are fixed and re-verified.
