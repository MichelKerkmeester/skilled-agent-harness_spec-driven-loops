---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "sk code rust implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/007-sk-code-rust"
    last_updated_at: "2026-11-26T13:08:00Z"
    last_updated_by: "generate-context"
    recent_action: "Replayed LS-006 through a Vibe worker and recorded all operator answers"
    next_safe_action: "Rerun LS-006 so both trios load, then close the packet"
    packet_purpose: "Purpose: The Rust set covers a Rust app as well as a Rust binding, with every new rule traced to a line of the rust-anything repository or to an existing sk-code rule."
    blockers: []
    key_files:
      - "specs/sk-code/code-surfaces/007-sk-code-rust/research/research.md"
      - "specs/sk-code/code-surfaces/007-sk-code-rust/scratch/binding-check.txt"
      - ".skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md"
      - ".skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-sk-code-rust"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "9214d15c-f092-4715-b003-a7d2c9126ab8"
      workspace: "/Users/michelkerkmeester/worktrees/public/546-sk-code-rust"
      savedAt: "2026-11-26T13:08:00Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
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
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md` | Modified | Regex engine choice and the Java `char` refusal |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Three `cli-mistral-vibe` lineages on `deepseek-flash` researched rust-anything, and the orchestrator merged them into `research/research.md` with 18 ranked edit rows, opening every cited line. A review before writing found four rows that would give wrong guidance as worded, and research.md section 5 records how each was changed or dropped. The Rust examples were checked with a scratch crate: `cargo clippy --all-targets -- -D warnings` exited 0 on the new examples, and it failed with `unfulfilled_lint_expectations` on the old zero comparison, which is why that example changed. The integration test example passed under `cargo test`. Then the router sync check, the package validator, the copy check, the anchor check, the binding comparison and the packet validator ran in that order. Nothing is committed.
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
| LS-006 scenario replay, one Vibe worker | FAIL on one point. Rust and TypeScript were both detected, every Rust part and shared reference loaded and no python, shell or config reference loaded. The worker skipped `typescript/quick-reference/`, which the router selects. Evidence in `scratch/ls006-replay.txt` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No terminal screen rules.** A ratatui or crossterm app, such as restoring raw mode on every exit path, gets no rule yet, because the source repository has none. A later packet can source them from ratatui's own documentation.
2. **LS-006 failed on the TypeScript side.** The worker opened no `typescript/quick-reference/` file, though `ROUTER.md` selects it. This packet changed no routing or TypeScript file, so the cause sits outside it, but the P0 stays open until a replay loads both trios.
<!-- /ANCHOR:limitations -->

---


