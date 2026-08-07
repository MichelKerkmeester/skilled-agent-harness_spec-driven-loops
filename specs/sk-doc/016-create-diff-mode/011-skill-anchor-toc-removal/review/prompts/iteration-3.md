Independent code review (READ-ONLY). You may run git, read files, run `python3`/`node` for validation only (no writes). Do NOT modify any file.

# Task
Audit git commit `1e58d845af` (TOC + `<!-- ANCHOR -->` removal across skill docs + standards/config/template/command edits). Find anything broken **by accident**.

This is **Iteration 3 of 10**. Focus: **standards/config + `/create` command consistency** (correctness + maintainability).

# ALREADY KNOWN (do not re-report)
- P1: orphaned numbered-TOC link lists in ~8 files (install guides + READMEs).
- P1: `sk-doc/assets/readme/readme_template.md:76,293` still recommends "optional anchors" (stale vs new no-anchor policy).
Look for OTHER issues.

# This iteration — inspect
1. **`sk-doc/assets/template_rules.json`**: confirm `tocRequired:false` is set for `readme`, `install_guide`, `playbook` and that no doc type still has `tocRequired:true`. Confirm the JSON is valid and no unrelated fields were damaged. (`python3 -c "import json;json.load(open('.opencode/skills/sk-doc/assets/template_rules.json'))"`)
2. **`sk-doc/references/global/core_standards.md`**: TOC policy table + summary should say Never for all types; check for any leftover "Allowed"/"optional" TOC statements that contradict the new policy.
3. **`sk-doc/scripts/tests/test_validator.py`**: the 2 edited cases (missing_toc, single_dash_anchors) should now expect exit 0. Run the suite read-only: `python3 .opencode/skills/sk-doc/scripts/tests/test_validator.py` — confirm it PASSES (11/11). Report if it fails.
4. **`/create` command YAMLs** (`create_folder_readme_auto.yaml`, `create_folder_readme_confirm.yaml`, `create_feature_catalog_*`, `create_testing_playbook_*`, `folder_readme.md`, `README.txt`): confirm no instruction still GENERATES or REQUIRES a TOC; confirm the YAMLs are still valid (`python3 -c "import yaml;yaml.safe_load(open(PATH))"` for each); in `create_folder_readme_confirm.yaml` a checkpoint option "B) Show TABLE OF CONTENTS" was removed and "C) Proceed"→"B) Proceed" relabeled — verify the option menu is consistent (no dangling reference to the removed option or to an option letter that no longer exists).
5. **Broader contradiction sweep**: any other doc that still mandates/recommends a TOC or `<!-- ANCHOR -->` while the policy now forbids them (excluding carve-outs).

# Carve-outs — do NOT flag
`system-spec-kit/templates/**` anchors; `sk-doc/scripts/tests/**` TOC fixtures (they SHOULD still have TOCs — that is correct test data); `research/research.md` ToC; Webflow "Table of Contents" in `sk-code`; inline anchor *mentions* documenting the live spec-kit anchor system (grep/sed examples, validation-rule descriptions in system-spec-kit).

# Output (stdout only)
1. "## Iteration 3 — Standards/config + /create consistency": what was inspected/run, results.
2. Per finding: `- [P0|P1|P2] <file>:<line> — <claim>` + evidence + why.
3. If none: "No NEW defects found in this dimension/sample."
4. FINAL LINE exactly:
`FINDINGS_JSON: {"iteration":3,"dimension":"correctness","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars"}`
