# Iteration 2: Security — hook execution trust, credential handling, remap write surface

## Focus

- Dimension: D2 Security.
- Files reviewed: `.opencode/scripts/git-hooks/prepare-commit-msg`, `.opencode/scripts/git-hooks/commit-msg`, `.opencode/scripts/git-hooks/post-merge`, `.opencode/scripts/install-git-hooks.sh`, `.opencode/specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/rewrite-run.sh`, `.opencode/specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/remap-citations.py`, `.opencode/specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/stamp-callback.py`, `.opencode/scripts/git-hooks/README.md`.
- Scope investigated: bypass surfaces, trust boundary of hook execution vs repository content, secrets in logs, path handling of in-place writers, env-var validation, push-gate interaction.

## Scorecard

- Dimensions covered: security
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (four new P2s; no refinements of iteration-1 findings)

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F005**: The new `prepare-commit-msg` executes a repository-controlled path when the hook is deployed through a machine-wide `core.hooksPath`: `ALLOCATOR="$REPO_ROOT/.opencode/skills/sk-git/scripts/commit-id-naming.sh"` then `bash "$ALLOCATOR" allocate` runs whatever content a cloned repository ships at that path, in the operator's context, at commit time. Verified: the operator has `core.hooksPath=/Users/michelkerkmeester/.config/git/hooks` populated with symlinks from the main checkout, and the installer resolves its target through `git rev-parse --git-path hooks` (`.opencode/scripts/install-git-hooks.sh:34-37,132-147`), so the next installer run in the main checkout will add `prepare-commit-msg` there. Severity is deliberately P2, not P0/P1: the same architecture already exists pre-packet (`.opencode/scripts/git-hooks/pre-commit:16-19` sources repo-supplied `hook-flags.sh` under a global install, and `post-merge:24-27` sources the repo's guard), so this packet adds one more execution point of an established, systemic pattern rather than introducing the class. Evidence: `.opencode/scripts/git-hooks/prepare-commit-msg:39-50` (identity by path existence), `:191` (`bash "$ALLOCATOR" allocate`). Systemic remediation belongs to the hook framework (validate the allocator against a trusted checkout, or drop machine-wide deployment), not this packet alone.
- **F006**: `rewrite-run.sh` writes the unredacted `SOURCE` into the run log and the operator push lines. A credentialed clone URL (`https://user:token@host/...`) lands verbatim in `$WORK/rewrite.log`, leaving a long-lived secret in a scratch directory. Evidence: `.opencode/specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/rewrite-run.sh:107` (`log "start: source=$SOURCE ..."`), `:575` (push line with `$SOURCE`). Fix shape: log a redacted source (strip userinfo) or hash it.
- **F007**: `remap-citations.py` rewrites files in place without checking for file symlinks. `os.walk` does not descend symlinked directories, but a symlinked `*.md` file under `--root` is yielded and `path.write_bytes(updated)` follows the link, so the remap can write outside the declared root (and outside the repository) whenever a specs tree contains a file symlink. Evidence: `.opencode/specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/remap-citations.py:125-135` (`iter_scannable_files`), `:160-168` (`path.write_bytes(updated)`). Fix shape: skip entries where `path.is_symlink()`.
- **F008**: `SPECKIT_COMMIT_SPEC` is interpolated into the message without shape validation, so a value containing a newline can forge additional trailer lines (including a `Commit-Id:` line the hook will then validate as content). The documented value shape is `<track>/<packet>[/<phase>...]`; a one-line `^[A-Za-z0-9._/-]+$` check would close it. Evidence: `.opencode/scripts/git-hooks/prepare-commit-msg:242-244` (`printf 'Spec: %s\n' "$SPECKIT_COMMIT_SPEC"`), with no validation earlier; the commit-msg hook accepts any `Spec:` value (`.opencode/scripts/git-hooks/commit-msg:121,133-135` classify it but never shape-check it).

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pending | hard | — | scheduled for the D3 iteration |
| checklist_evidence | pending | hard | — | scheduled for the D3 iteration |

## Assessment

- New findings ratio: 1.0. Severity-weighted: new weight 1(P2)×4 = 4 over prior active weight 8 → cumulative active weight 12, this iteration's share 4/12 ≈ 0.33 considered as a damped ratio; recorded ratio 1.0 reflects that all four are new findings.
- Dimensions addressed: security.
- Novelty justification: four independent surfaces (execution trust, log redaction, symlink writes, env validation) not covered by any packet test or documented limitation. The hook test suites exercise behavior, not these boundaries.

## Ruled Out

- Command injection through the Commit-Id collision scan: `COMMIT_ID` is validated as exactly seven digits before it reaches `git log --grep` (`.opencode/scripts/git-hooks/commit-msg:149-158`); no metacharacter path exists.
- `stamp-callback.py` remote-code surface inside filter-repo: the callbacks import a local file path and process bytes only; no shell, no network (`stamp-callback.py:1-26`).
- Credential exposure in `commit-msg`/`prepare-commit-msg` output: neither prints environment values.
- Push-allowlist bypass from the mirror: `rewrite-run.sh` never pushes; it prints lines for a hand-run push from a hook-less bare mirror, which is the documented operator gate (`.opencode/specs/sk-git/028-crawlable-commit-history/005-history-rewrite/plan.md:79,131`), not a silent bypass.

## Dead Ends

- Trusting `install-git-hooks.sh`'s ownership check to constrain execution: it only protects install/uninstall of symlinks, not the runtime path executed by a globally deployed hook.
- Looking for secret material inside the hooks themselves: none; the exposure is only the logged source URL (F006).

## Recommended Next Focus

D3 Traceability: run the core protocols `spec_code` and `checklist_evidence` across the parent spec and child phases, plus the overlay protocols `feature_catalog_code` (the commit-identity catalog subsection) and `playbook_capability` (GIT-044), verifying every normative claim resolves to shipped behavior.

Review verdict: PASS
