---
title: "Implementation Summary"
description: "sk-code's Rust set now covers an app-style Rust binary and a port proved against a recorded original, with every new rule traced to rust-anything."
trigger_phrases:
  - "sk code rust implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/007-sk-code-rust"
    last_updated_at: "2026-11-26T19:40:01Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed every alignment finding and reran the gates"
    next_safe_action: "Commit the fix pass on worktrees/546-sk-code-rust, staging by name, no push"
    packet_purpose: "Purpose: The Rust set covers a Rust app as well as a Rust binding, with every new rule traced to a line of the rust-anything repository or to an existing sk-code rule."
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/scripts/tests/rust-language-vocabulary.test.cjs"
      - ".skilled/skills/sk-code/manual-testing-playbook/language-sub-detection/skilled-rust-app.md"
      - ".skilled/skills/sk-code/shared/references/stack-detection.md"
    session_dedup:
      fingerprint: "sha256:ba00becf02e908ab3ce40d1c45c8ec65b5dfaf6d516571c0c013ed32ab27608e"
      session_id: "scaffold-007-sk-code-rust"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "18b5b122-c5b4-40c0-ac3e-13860897d68b"
      workspace: "/Users/michelkerkmeester/worktrees/public/546-sk-code-rust"
      savedAt: "2026-11-26T19:40:01Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-sk-code-rust |
| **Completed** | 2026-11-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

sk-code's Rust set now covers a Rust binary that owns its own entry point, such as a CLI or a terminal screen, and a port proved against a recorded original. Before this change it covered only a napi-rs, WASM or sidecar module held to a TypeScript oracle, and its scope said TypeScript owns CLI wiring.

### Research the rust-anything repository and update the sk-code Rust references and checklist with what it teaches

A reviewer working on a Rust CLI now finds rules that apply to it. The checklist scope names app-style Rust and its process contract, the exit code and the bytes on stdout and stderr. The references say how to lay out a library plus a clap binary, map every outcome to an exit code, test the built executable and prove a port against recorded cases without gaming them. Every new rule is restated in sk-code's own words with a `rust-anything, <file>:<line>` anchor, and every napi-rs and WASM parity rule keeps its meaning.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modified | Scopes the TypeScript-contract rule to Rust that has an oracle, version 2.3.0.0 |
| `.skilled/skills/sk-code/sk-code-skilled/changelog/v2.3.0.0.md` | Created | Names every changed part |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md` | Modified | App-style scope and the process contract row |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md` | Modified | `#[expect]` over `#[allow]`, and the infallible exception to the deny list |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md` | Modified | `anyhow` in a crate with no ABI boundary and §Application Entry Point |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` | Modified | App layout with clap, single-crate lints, binary tests, child stdout, ratatui and crossterm named |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` | Modified | §Porting Against a Recorded Original and the `serde_json` features |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md` | Modified | Regex engine choice and the Java `char` refusal, then the ASCII rule stated per class |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md`, `quick-reference/overview-and-boundary-template.md`, `style-guide/interop-model.md`, `style-guide/overview-and-file-header.md` | Modified | TypeScript ownership scoped to a project where a TypeScript backend owns the process |
| `.skilled/skills/sk-code/sk-code-skilled/ROUTER.md`, `assets/scripts/router-replay-lib.cjs` | Modified | App-crate RUST keywords, bracketed keywords moved last so the replay parser reads them all |
| `.skilled/skills/sk-code/ROUTER.md`, `hub-router.json`, `shared/references/stack-detection.md` | Modified | App-crate RUST keywords and the rule to open every file the route selects |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `changelog/v1.9.19.0.md` | Modified, Created | The open-every-file rule, version 1.9.19.0 |
| `.skilled/skills/sk-code/SKILL.md`, `mode-registry.json`, `description.json`, `graph-metadata.json`, `changelog/v3.12.6.0.md` | Modified, Created | Hub version 3.12.6.0 and the advisor vocabulary |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`, `language-sub-detection/skilled-rust-app.md` | Modified, Created | LS-007, a Rust-only clap CLI scenario |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs`, `scripts/tests/rust-language-vocabulary.test.cjs` | Modified, Created | The keyword parse reads past a bracketed keyword, `#[napi]` selects Rust, and a test pins the Rust words |
| `.skilled/skills/sk-code/ROUTER.md`, `shared/references/stack-detection.md`, `sk-code-skilled/ROUTER.md`, `SKILL.md`, `README.md` | Modified | Every detector marker named, and the shared folder loaded by intent rather than language count |
| `.skilled/skills/sk-code/manual-testing-playbook/` (SD-002, LS-001 to LS-007, `skilled-rust.md`, `skilled-rust-app.md`, `skilled-javascript.md`, `skilled-detection.md`), `sk-code-skilled/manual-testing-playbook/` (OC-007, OC-009) | Modified | Expected refs match the hub route, LS-007 proves the crate words with no `.rs` path |
| `sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md`, `assets/checklists/rust-checklist/overview-and-p0-parity.md` | Modified | The rust-anything URL and commit `beed6fa45fc9` behind every anchor |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, `feature-catalog/`, `changelog/v3.12.7.0.md`, `sk-code-skilled/changelog/v2.3.1.0.md`, `README.md`, `.skilled/changelog/skilled/v4.2.0.0.md` | Modified, Created | Rust named in the hub, its catalog and the root docs, hub 3.12.7.0 and sk-code-skilled 2.3.1.0 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, the two sk-code compiled-routing `manifest.json` copies | Regenerated | The compiled graph and the routing manifest match the edited metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Three `cli-mistral-vibe` lineages on `deepseek-flash` researched rust-anything, and the orchestrator merged them into `research/research.md` with 18 ranked edit rows, opening every cited line. A review before writing found four rows that would give wrong guidance as worded, and research.md section 5 records how each was changed or dropped. The Rust examples were checked with a scratch crate: `cargo clippy --all-targets -- -D warnings` exited 0 on the new examples, and it failed with `unfulfilled_lint_expectations` on the old zero comparison, which is why that example changed. The integration test example passed under `cargo test`. Then the router sync check, the package validator, the copy check, the anchor check, the binding comparison and the packet validator ran in that order. The work was committed as `066a16af103` on `worktrees/546-sk-code-rust`. A fresh Opus review of that commit then found that four unchanged Rust docs still made TypeScript the owner of CLI wiring, and that a whole-pattern `unicode(false)` fails on common patterns. Both findings were checked by hand, the regex one with a `cargo run`, and fixed with three wording fixes. Two LS-006 replays had skipped the TypeScript quick-reference parts, so the operator chose to fix the load inside this packet. The hub router, the review packet and `stack-detection.md` now tell a reader to open every file the route selects. The operator also chose to add the clap, ratatui and crossterm keywords and the LS-007 scenario, which amends decision D1. The router sync check, the node suites, the advisor regression set and the playbook validator ran after those edits, the advisor graph was rebuilt with the operator's approval, and fresh Vibe workers replayed LS-006 and LS-007. The follow-up is committed on `worktrees/546-sk-code-rust`. A `/local-skilled-alignment` run and a `/local-doc-alignment` run on the two commits then found 42 findings, and the operator ordered every one fixed. The replay parser fix was checked by a new test that fails on the old library. Each scenario edit was written from a hub replay of its exact prompt, and the rust-anything commit was pinned by hashing every file of the local copy against the upstream tree. Then the router sync check, both node suites, both playbook validators, the package validator, the freshness check and a `--recheck` of the first alignment run ran from the final state. The fix pass is committed on `worktrees/546-sk-code-rust`. Nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Update the existing parts in place, add no part | Every row fit an existing section, so a new file would add a router entry and nothing else |
| Drop the C ABI contract row | The source maps types for the safe function behind a shim, not the `extern "C"` signature, and the checklist scope names no C ABI binding |
| Name ratatui and crossterm without rules | rust-anything has no terminal UI code, so a rendering rule would have no source line |
| Express the infallible exception as `#[expect(clippy::expect_used, ...)]` | A comment does not satisfy a clippy `deny`, and Skilled has no gate command that reads rust-anything's marker |
| Scope TypeScript-oracle rules instead of rewriting them | Keeps every napi-rs and WASM rule's meaning while letting a non-TypeScript port use its recorded cases |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `verify-router-sync.cjs` | PASS, `router-sync: 5/5 checks passed`, exit 0, same as the baseline |
| `validate_skill_package.py` on sk-code-skilled | PASS, `package_skill.py --check: PASS (exit 0)` |
| Copy check, `comm -12` against rust-anything | PASS, 0 shared lines over 60 characters |
| Anchor check, `scratch/cite-check.txt` | PASS, 29 of 29 anchors resolve, each read by hand |
| Binding comparison, `scratch/binding-check.txt` | PASS, 517 rule lines, 513 verbatim, 4 changed with meaning kept, 0 missing |
| Coverage grep for clap, ratatui and crossterm | PASS, 1 file each |
| Example check in a scratch crate | PASS, clippy exit 0 and the binary test passed |
| LS-006 scenario replay, before the loading fix | FAIL on the TypeScript side in runs 1 and 2. Both workers skipped `typescript/quick-reference/`, which the router selects. Run 3 is void, because it ran without `--auto-approve` and every read was denied |
| LS-006 scenario replay, run 4 after the fix | PASS. Both trios and the shared folder loaded, 7 of 7 TypeScript parts including both quick-reference parts, and no python, shell or config reference. One run cannot separate the fix from worker variance. Evidence in `scratch/ls006-replay.txt` |
| LS-007 scenario replay, run 3 | Pass criteria hold: RUST alone, 17 of 17 Rust parts, 4 of 4 checklist parts, no other language. Two expected signals are unmet, the SKILLED surface label and the universal checklist, because `stack-detection.md` section 2 counts the /tmp fixture path as not SKILLED |
| Follow-up gates | `verify-router-sync.cjs` 5/5. sk-code-skilled node tests 56/56. shared node tests 33/33. Advisor regression 84/84. `validate-playbook-package.cjs` PASS with violations=0. `validate_skill_package.py` PASS for sk-code-skilled and sk-code-review |
| Fix pass gates | `verify-router-sync.cjs` 5/5. sk-code-skilled node tests 65/65, the new Rust vocabulary test 9/9 and 7/9 with the old library. shared node tests 33/33. Both playbook validators `--strict` PASS with violations=0. `validate_skill_package.py` PASS for sk-code, compiled-ready included. `skill-graph-freshness.cjs --strict` exit 0. `check-release-coverage.cjs` required=3 missing=0 |
| Alignment recheck of the first run | 3 resolved, 0 new, 4 still open. The 4 are the skill-root metadata, system-spec-kit playbook, markdown-link and all-package playbook rows, and each passes on main, whose newer commits this branch's base lacks |
| LS-006 run 4, reread | Its PASS counted the shared folder as loaded, but the hub route never selects it for that prompt. The worker opened it on its own, so that part of the PASS rested on a load the router did not ask for. The scenario now expects the folder absent |
| Advisor stage one after the rebuild | sk-code first at 0.8682 for the LS-006 prompt and 0.8706 for the LS-007 prompt, 14 of 14 source files fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No terminal screen rules.** A ratatui or crossterm app, such as restoring raw mode on every exit path, gets no rule yet, because the source repository has none. A later packet can source them from ratatui's own documentation.
2. **LS-006 passed once after the loading fix.** Runs 1 and 2 skipped the TypeScript quick-reference parts and run 4 opened them. A single passing run cannot show whether the fix or worker variance made the difference, so a later replay is the check.
3. **LS-006 still uses a /tmp fixture.** LS-007 moved to the gitignored `.skilled/skills/.state/` path. LS-006 keeps /tmp, where the text route says SKILLED from its `.rs` and `.ts` file names, but the quality selector resolves the real path and reports UNKNOWN. Moving LS-006 the same way would close that gap.
4. **The branch base is older than main.** Four battery rows fail here and pass on main. `skill-graph.json`, the root v4.2.0.0 release notes and the sk-code routing manifest also changed on main, so a rebase should regenerate the graph and manifest rather than hand-merge them.
5. **The v4.2.0.0 notes name unreleased work.** At the operator's direction the Rust entries went into v4.2.0.0, which is already tagged and published without this branch.
<!-- /ANCHOR:limitations -->

---


