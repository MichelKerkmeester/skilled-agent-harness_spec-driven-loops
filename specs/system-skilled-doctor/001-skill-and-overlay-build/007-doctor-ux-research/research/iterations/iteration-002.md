# Iteration 002 — Q3: External-Repository Onboarding Friction

## Focus

Q3: What onboarding friction does a brand-new external repository hit when linking or copying Skilled in, from INSTALL-SKILLED.md through /doctor:install, /doctor:symlink and /doctor:setup?

Scope was limited to the new-user path. Overlay-engine correctness was iteration 1's subject and is not re-reported here. All researched files were read-only; no target file was modified.

## Actions Taken

1. Read `INSTALL-SKILLED.md` end to end, both the link path (section 3) and the copy path (section 4), plus the health and troubleshooting tables.
2. Read the three routers that own the onboarding commands: `install.md`, `symlink.md`, `setup.md`, including their target tables and workflow summaries.
3. Checked whether the copy path's `git archive` command can carry the build outputs the framework loads: read `.gitignore` and ran `git ls-files '.skilled/**/dist/**' '.skilled/**/build/**'` (0 tracked files under `.skilled`, 19,333 tracked files total).
4. Inspected the `.skilled/specs` sibling link on disk (`-> ../specs`) to test the guide's link-shape explanation.
5. Cross-checked each claim against the line that makes it; doc-internal contradictions are reported as contradictions, not resolved by assumption.

## Findings

Ranked by user impact on a first-time external repository.

### F1 — P0: The copy path cannot produce a runnable tree; `git archive` carries no build output and section 4 never tells the user to build

Section 4 creates the copy with a single export command: `git archive <commit> .skilled .claude .opencode | tar -x -C /path/to/your-project` [SOURCE: INSTALL-SKILLED.md:184]. `git archive` exports tracked files only. `.gitignore` ignores `build/`, `dist/` and `node_modules/` [SOURCE: .gitignore:59] [SOURCE: .gitignore:60] [SOURCE: .gitignore:52], and a `git ls-files` check found **zero** tracked `dist/` or `build/` files under `.skilled`. The framework itself says the runtimes' session hooks load the Spec Kit build [SOURCE: INSTALL-SKILLED.md:40]. So a clean copy starts with no Spec Kit build, no Skill Advisor runtime build and no `node_modules`, and section 4 never mentions running either build inside the project. The link path at least inherits the checkout's builds through the links; the copy path inherits nothing.

Impact: hooks, the advisor and Code Mode are broken in the new project, and the copy path gives the user no repair step. Recommendation: add the two build commands from section 2 to section 4 step 1, or ship a release archive that includes built artifacts, and make the copy path end with a build/health check.

### F2 — P0: The copy path omits the entire "finish setup" sequence the link path has

The link path is five ordered steps: symlink, `agents-md embed`, `mcp install`, `git setup`, `setup` [SOURCE: INSTALL-SKILLED.md:112]. Section 4 goes create copy → create overlay folder → apply overlays → re-pin, and never mentions an instruction file, Code Mode, git hooks or a verification run [SOURCE: INSTALL-SKILLED.md:178]. The export command also excludes the root `AGENTS.md` because it lists only `.skilled`, `.claude` and `.opencode` [SOURCE: INSTALL-SKILLED.md:184]. A copied project therefore finishes the documented copy path with no embedded instruction sections, no Code Mode registration and no hook check. The guide only surfaces this indirectly, in the health table's "when something looks wrong" row [SOURCE: INSTALL-SKILLED.md:306].

Impact: the copy route is presented as an equal alternative to linking, but it silently skips half of what makes the framework work in a repo. Recommendation: give section 4 the same closing table as section 3, marking what the copy already covers and what the user must still run.

### F3 — P1: `/doctor:install` is a checklist, not an installer, and the checklist contradicts itself about where step 3 runs

The command's own contract says it "writes nothing. Every step that writes is printed for the operator to run" [SOURCE: .skilled/commands/doctor/install.md:10], matching the guide [SOURCE: INSTALL-SKILLED.md:108]. The name promises an install; the behaviour is a five-command checklist spanning two working directories (checkout and project) [SOURCE: INSTALL-SKILLED.md:114]. The contradiction is in step 3: section 2 says `/doctor:mcp install` "registers Code Mode in the seven project config files" [SOURCE: INSTALL-SKILLED.md:75], while the checklist says to run that command **from the checkout** [SOURCE: INSTALL-SKILLED.md:116]. Both cannot be true: a command run in the checkout with no target argument registers the checkout's configs, not the project's. The checklist prints no `--root`, and `install.md`'s argument table does not give the guide one [SOURCE: .skilled/commands/doctor/install.md:50]. Which side is wrong was not verified against `mcp.md` in this iteration; the doc-internal contradiction is confirmed.

Impact: a first-time user follows the table and configures the wrong repository, then step 5 `/doctor:setup` in the project cannot confirm Code Mode. Recommendation: either add a target/`--root` to `/doctor:mcp install` and print it, or correct the "Run it from" cell; then print one copy-paste block per working directory instead of a table the user must re-read.

### F4 — P1: `/doctor:setup`, the guide's triage command, checks neither links nor overlays

The health table tells a linked project to run `/doctor:setup` "when something looks wrong" [SOURCE: INSTALL-SKILLED.md:306]. That command's five legs are the sk-code battery, the sk-git battery, trigger-index freshness, the runtime-mirror check and the advisor probe [SOURCE: .skilled/commands/doctor/setup.md:62]. None of them checks symlink entry status or overlay/pin state. A linked project that has gone `partial-merge` after a `git pull`, or a copied project whose pin is stale, gets a green setup report. The command that actually detects the first case, `/doctor:symlink check`, appears in the guide only as an after-pull action [SOURCE: INSTALL-SKILLED.md:304].

Impact: the advertised triage entry point gives false assurance exactly when onboarding has drifted. Recommendation: add a link-health leg and, when a manifest exists, an overlay-pin leg to `/doctor:setup`; or change the triage row to name both commands explicitly.

### F5 — P1: Re-pin backups are written inside the folder the guide tells you to commit

Each live re-pin saves a backup under `skilled-overlays/repin-runs/<run-id>/` [SOURCE: INSTALL-SKILLED.md:286]. The same guide tells the user to "commit the overlay folder and the copy together" [SOURCE: INSTALL-SKILLED.md:251]. No ignore instruction is given for `repin-runs/`, and the overlay folder is not covered by the checkout's `.gitignore` rules. The first re-pin therefore adds a full backup tree to the project repository, and any backed-up file that is normally ignored (`.env`, build output) becomes committable.

Impact: repository bloat on the first upgrade and a plausible secret-leak path, on the step the guide presents as routine. Recommendation: have the engine write run backups outside the overlay folder (e.g. under `.skilled/output/`, which is already ignored [SOURCE: .gitignore:62]) or add `repin-runs/` to the project's ignore guidance automatically.

### F6 — P1: The guide recommends `auto` but documents `whole` without its `specs` footgun

`INSTALL-SKILLED.md` tells the user to choose `auto` [SOURCE: INSTALL-SKILLED.md:101] and documents three shapes [SOURCE: INSTALL-SKILLED.md:137]. The consequence of `whole` is stated only in the symlink router: "A whole-linked `.skilled` reads the checkout's `specs/` through `.skilled/specs`, so use `merge` when the host's own `specs/` must stay reachable" [SOURCE: .skilled/commands/doctor/symlink.md:60]. The onboarding guide's own explanation instead says `auto` builds a folder entry by entry when it holds a sibling link, naming `.skilled` and its `specs` link as the example [SOURCE: INSTALL-SKILLED.md:145]; that link exists on disk as `.skilled/specs -> ../specs`. A user who picks the simplest-sounding shape from the onboarding table never sees the warning, and the guide's later warning about `/speckit:save` writing into the wrong repo [SOURCE: INSTALL-SKILLED.md:163] is the symptom.

Impact: a project with its own `specs/` can end up reading the checkout's specs and saving sessions into the wrong repository. Recommendation: put the `whole` warning in the shape table next to the option, and state in one sentence what `auto` does with `.skilled/specs`.

### F7 — P2: The first overlay must be hand-authored; the copy path names no scaffold command

Section 4 step 2 tells the user the overlay folder "holds `overlay-manifest.json`" and then shows a full manifest with `schemaVersion`, `pin.upstream`, `pin.commit`, `layoutLinks`, `overlays`, `regenerate` and `verifyGenerated` [SOURCE: INSTALL-SKILLED.md:193]. Nothing in the guide creates that file; the user must hand-write valid JSON and know the exported commit [SOURCE: INSTALL-SKILLED.md:187]. There is no printed validation until `/doctor:overlay status` fails on a typo.

Impact: the very first copy step is the most error-prone one, and the failure arrives several steps later. Recommendation: add `/doctor:overlay init --pin <commit>` (or make `repin` offer to create the manifest) that writes a schema-valid empty manifest and the `.skilled-overlays.json` override when needed.

### F8 — P2: Undo depends on a printed path the guide never tells you how to recover

The guide says each `link` run ends by printing its undo command and that, after several runs, the user should undo the newest first [SOURCE: INSTALL-SKILLED.md:155]. `unlink` requires `--run <dir>` [SOURCE: .skilled/commands/doctor/symlink.md:64]; the run record lives in the checkout under `.skilled/output/doctor-symlink/<digest>/manifest.json` [SOURCE: .skilled/commands/doctor/symlink.md:90], and that output directory is gitignored [SOURCE: .gitignore:62]. There is no `unlink --list`. Close the terminal and the only recovery path is undocumented.

Impact: a user who linked several times cannot safely undo, which makes the writing command feel riskier than it is. Recommendation: add a run-list target (`unlink --list`) or have `symlink check` print prior run directories, and document the output location in `INSTALL-SKILLED.md`.

### F9 — P2: The protected-path troubleshooting row is unreadable to a newcomer

The row reads: "`refusing to inspect a protected path` | An overlay walks a file with `token` in its name | Add that file to the overlay's `protectedPaths`, as the line says" [SOURCE: INSTALL-SKILLED.md:321]. "Walks a file", "with `token` in its name" and "add to `protectedPaths`" are all unexplained in the onboarding guide: the overlay-types table lists `protectedPaths` nowhere [SOURCE: INSTALL-SKILLED.md:226], and the fix sounds like it protects the file further rather than resolving the refusal. The exact error a first overlay is likely to hit has the least comprehensible remedy.

Impact: the user stalls on the first protected-file refusal. Recommendation: rewrite the cause in plain language, show the `protectedPaths` shape inline, and link the exact reference anchor.

## Questions Answered

- **Q3** (verbatim): What onboarding friction does a brand-new external repository hit when linking or copying Skilled in, from INSTALL-SKILLED.md through /doctor:install, /doctor:symlink and /doctor:setup?
  - Answer: the link path is coherent but front-loads five commands across two directories, misstates where Code Mode registration runs, and hands triage to a `/doctor:setup` that does not inspect links. The copy path is materially incomplete: its export cannot carry the builds the framework loads, and it omits the instruction-file, Code Mode, git-hook and verification steps entirely. The remaining friction is manifest hand-authoring, undiscoverable undo, backups written into the folder the guide says to commit, and a `whole`-shape footgun documented only in the router.

## Questions Remaining

- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step? (partially touched by F3, F9; not answered as a whole)
- Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from?
- Q5: Where do `INSTALL-SKILLED.md`, `overlays.md`, the doctor command docs and the skill README disagree with the code, and which improvements rank highest by user impact?
- Carried forward from iteration 1: are `status`/`apply`/`capture` classifications correct for every `skill-root` and `json-entry` shape, and does the engine detect a manifest `pin.commit` that disagrees with the bytes actually in the tree?

## Next Focus

Q4: upgrade and re-pin safety. F5 gives it a concrete entry point (backups inside the committed overlay folder); the next iteration should test rollback completeness, pin-drift detection and the `repin.exclude` escape hatch against the engine.
