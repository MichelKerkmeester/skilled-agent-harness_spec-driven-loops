---
title: "Implementation Summary"
description: "All 41 mode packet READMEs now follow the skill README template and the Human Voice Rules, and each was fact-checked against its packet."
trigger_phrases:
  - "mode packet readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/002-mode-packet-readmes"
    last_updated_at: "2026-11-16T21:48:21Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded the symlink and model-switch operator decisions"
    next_safe_action: "Commit phase 002 packet docs, then start phase 003 with a codex canary writer"
    packet_purpose: "Purpose: Each of the 41 mode packet READMEs follows the skill README template, passes the validator and the voice scan with zero hard blockers, and states only facts that the packet's own files confirm."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/006-readme-template-conformance/decision-record.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/goal.md"
    session_dedup:
      fingerprint: "sha256:066d4b5527c60af8708faf49c172bfd52a2539af6c0c2467c92a991350b06a2a"
      session_id: "scaffold-002-mode-packet-readmes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "256db329-443e-4697-8e43-b3b7f7c74ec6"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-16T21:48:21Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 30
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-mode-packet-readmes |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every mode packet README under the seven hubs now opens with a one-line pitch and an At a Glance table, then runs through the same eight numbered sections in short sentences. Each one was fact-checked against its own packet, so a reader can run the commands it shows and get the output it promises.

### Phase 2: mode-packet-readmes

The 41 READMEs registered in the hub `mode-registry.json` files were rewritten to the skill README template. Before the rewrite, 12 of them carried 45 voice hard blockers between them and the lowest voice ceiling was 8. After it, none carries a hard blocker and the lowest ceiling is 95. Reviewers checked 4,820 claims. The main session confirmed 109 findings against the code and applied them, such as `codex exec` no longer taking `--full-auto`, the mistral-vibe playbook holding 41 scenarios rather than 38, and `bdg status` printing JSON only with `--json`. It rejected 19, each with a reason.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/<hub>/<mode>/README.md` (41 files) | Modified | Rewritten to the skill README template and checked against each packet. On origin/main in `096fe534033` |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/README.md` | Modified | The review P2: the rules check runs from the repository root |
| `../goal.md` | Modified | D4 amended for the writer and reviewer model, with a log row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One canary writer ran first on sk-code-frontend. It wrote its file without asking a question and passed every check, so the other 40 went out in waves of eight, one README per session. A second set of sessions, none of which wrote the file it checked, fact-checked each README read-only and returned findings with a file and line for each. The main session opened the cited lines, ran the cited command where it was read-only, and only then applied or rejected each finding. It then reran the validator, the voice scan, the structure check, the link check and every consumer test on all 41 files from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fourteen version findings rejected | The parent goal's D3 keeps README `version` lines out of hand edits, because the commit-time bump script raises them |
| Two "every playbook scenario passes" rows kept | They state the check a reader runs, not a claim that a past run passed |
| The cli-claude-code web-research route kept on cli-opencode | The README follows `SKILL.md:43`, which names OpenCode for live web search |
| The last review ran on GPT-6 Luna through cli-codex | The DevPass daily cap stopped DeepSeek V4.1 Flash mid-run, and the operator chose GPT-6 Luna at max on the fast tier. D4 in the parent goal records the amendment |
| The rewrite is on origin/main in `096fe534033`, a commit from another session | The 41 READMEs sat staged while a concurrent session committed, and its `chore(decision-capture)` commit took them with its own files. The content matches what was reviewed. Rewriting pushed history needs the operator's yes and would change nothing in the tree, so the history stays and this record names the commit. Later phases stage in the same command that commits |
| Edits stay inside the 41 READMEs | Reviewers also found stale text in packet references, such as `--full-auto` in the cli-codex references and the Code Connect line in mcp-mobbin's `SKILL.md`. Those files are outside this phase's scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Before numbers come from `baseline-002-before.tsv`, taken on the tree before the first writer ran. After numbers are from the final staged tree.

| Check | Result |
|-------|--------|
| `baseline.sh` on 41 READMEs | Before: 41 of 41 `VALID`, 45 hard blockers across 12 files, no emoji heading. After: 41 of 41 `✅ VALID issues=0 hard=0 emojiH=0` |
| Voice ceilings, before then after | cli-jev 68 to 99, cli-claude-code 85 to 99, cli-codex 89 to 99, cli-cursor 93 to 99, cli-deepseek-harness 82 to 99, cli-devin 94 to 99, cli-mistral-vibe 98 to 99, cli-opencode 90 to 99, cli-pi 98 to 99, mcp-aside-devtools 97 to 100, mcp-chrome-devtools 89 to 99, mcp-click-up 91 to 99, mcp-figma 89 to 99, mcp-mobbin 76 to 95, mcp-notion 8 to 99, mcp-obsidian 86 to 97, mcp-refero 80 to 97, sk-code-ci 99 to 99, sk-code-frontend 94 to 98, sk-code-quality 97 to 99, sk-code-review 97 to 100, sk-code-skilled 97 to 100, sk-design-chart 95 to 99, sk-design-diagram 72 to 100, sk-design-md-generator 92 to 97, sk-create-agent 93 to 99, sk-create-benchmark 96 to 99, sk-create-changelog 98 to 99, sk-create-command 90 to 99, sk-create-diff 97 to 99, sk-create-feature-catalog 95 to 99, sk-create-frontmatter 94 to 99, sk-create-goal 99 to 100, sk-create-manual-testing-playbook 91 to 99, sk-create-quality-control 88 to 97, sk-create-readme 92 to 98, sk-create-repo-rule 78 to 97, sk-create-skill 93 to 99, sk-create-with-human-voice 92 to 99, deep-research 95 to 99, deep-review 93 to 99 |
| Line counts, before then after | cli-jev 133 to 225, cli-claude-code 283 to 267, cli-codex 303 to 245, cli-cursor 295 to 251, cli-deepseek-harness 206 to 254, cli-devin 270 to 236, cli-mistral-vibe 196 to 219, cli-opencode 314 to 325, cli-pi 229 to 280, mcp-aside-devtools 207 to 217, mcp-chrome-devtools 250 to 270, mcp-click-up 255 to 280, mcp-figma 223 to 233, mcp-mobbin 232 to 221, mcp-notion 227 to 201, mcp-obsidian 226 to 237, mcp-refero 226 to 229, sk-code-ci 102 to 185, sk-code-frontend 81 to 211, sk-code-quality 168 to 197, sk-code-review 246 to 245, sk-code-skilled 174 to 174, sk-design-chart 154 to 189, sk-design-diagram 184 to 197, sk-design-md-generator 291 to 227, sk-create-agent 162 to 157, sk-create-benchmark 165 to 172, sk-create-changelog 143 to 181, sk-create-command 167 to 205, sk-create-diff 187 to 214, sk-create-feature-catalog 160 to 183, sk-create-frontmatter 204 to 201, sk-create-goal 197 to 216, sk-create-manual-testing-playbook 182 to 199, sk-create-quality-control 161 to 175, sk-create-readme 187 to 210, sk-create-repo-rule 213 to 202, sk-create-skill 180 to 224, sk-create-with-human-voice 204 to 169, deep-research 237 to 265, deep-review 266 to 257. Total 8,490 to 9,045 |
| `h2model.py` against the template section model | `EXACT` for all 41 |
| Opening shape | All 41 open with an H1, a blockquote pitch and an At a Glance table under `## 1. OVERVIEW` |
| `readme_links.py . <41 READMEs>` | Before and after: `0 problems`. After: 713 outbound links |
| `check-markdown-links.cjs` | `7809 files, 15083 links checked, 0 broken`, exit 0 |
| `test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty` over 1,246 tracked READMEs, so the verdict baseline needed no rebuild |
| `test_readme_manifest.py` | `manifest=reproducible` |
| `deep-research-contract-parity.vitest.ts` and `deep-review-contract-parity.vitest.ts` | `Tests 19 passed (19)`, run from `runtime/cli` with `--config ../../vitest.config.ts --project cli` |
| `check-rule-copies.test.sh` | `All rule-canary test cases passed` |
| `parent-skill-check.cjs` on the seven hubs | `OK`, all hard invariants passed and 0 warnings, for each |
| `check-documentation-drift.cjs` | Exit 0 |
| `generate-trigger-index.mjs --check` | 0 stale documents. No README changed its `trigger_phrases` |
| Secret scan over the 41 files | No token, key or secret value, only prose about those features |
| sk-doc `run-script-tests.sh` | Exit 0, 57 PASS |
| Blocking `@review` | APPROVED, advisory 98/100, no P0 or P1. Its one P2, a `cd` in the cli-deepseek-harness rules check that broke the next block, was applied: the command now runs from the repository root and prints `13 true` |
| Fact checks | cli-jev 112 claims, 4 applied and 1 rejected (version). cli-claude-code 154 claims, 5 applied and 3 rejected (version, web research route and verification row). cli-codex 133 claims, 3 applied. cli-cursor 136 claims, 4 applied and 1 rejected (version). cli-devin 116 claims, 3 applied and 1 rejected (version). cli-mistral-vibe 86 claims, 3 applied. cli-opencode 147 claims, 6 applied and 1 rejected (version). cli-pi 150 claims, 2 applied. mcp-aside-devtools 105 claims, 4 applied and 1 rejected (version). mcp-chrome-devtools 156 claims, 7 applied and 1 rejected (version). mcp-click-up 109 claims, 7 applied and 1 rejected (version). mcp-figma 114 claims, 2 applied. mcp-mobbin 121 claims, 1 applied. mcp-notion 110 claims, 2 applied and 1 rejected (version). mcp-obsidian 214 claims, 2 applied and 1 rejected (an exact prefix of the error text). mcp-refero 120 claims, 1 rejected (version). sk-code-frontend 106 claims, 1 rejected (version). sk-code-ci 142 claims, 3 applied. sk-code-quality 82 claims, 2 applied. sk-code-review 96 claims, 3 applied. sk-code-skilled 125 claims, 3 applied. sk-design-chart 94 claims, 2 applied and 1 rejected (version). sk-design-diagram 156 claims, none. cli-deepseek-harness 190 claims, none. sk-design-md-generator 115 claims, 2 applied. sk-create-agent 61 claims, 1 applied. sk-create-command 88 claims, 1 applied. sk-create-diff 84 claims, 3 applied. sk-create-benchmark 84 claims, 3 applied and 1 rejected (version). sk-create-changelog 71 claims, 2 applied. sk-create-feature-catalog 89 claims, 4 applied. sk-create-frontmatter 94 claims, 2 applied. sk-create-goal 141 claims, 2 applied. sk-create-quality-control 68 claims, 2 applied and 1 rejected (version). sk-create-with-human-voice 112 claims, 2 applied. sk-create-manual-testing-playbook 102 claims, 4 applied. sk-create-readme 118 claims, 3 applied. deep-research 208 claims, 4 applied and 2 rejected (version and verification row). deep-review 135 claims, 2 applied. sk-create-skill 176 claims, 4 applied. sk-create-repo-rule 104 claims, 2 applied and 1 rejected (version). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **README and SKILL.md versions differ for 14 packets.** The template asks them to move together, but this program never edits versions by hand. A skill release that bumps both files closes the gap.
2. **Some packet references still disagree with the corrected READMEs.** The cli-codex references still offer `--full-auto`, the cli-opencode references keep an older version read, and click-up names three different slow-filter thresholds. Fixing them is packet work outside this phase.
3. **Fact checks sampled each README's claims.** Every claim a reviewer named was checked, but long prose can still hold a claim nobody tested.
<!-- /ANCHOR:limitations -->

---
