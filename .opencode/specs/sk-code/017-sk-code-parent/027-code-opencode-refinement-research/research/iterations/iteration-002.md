# Iteration 002 — Python/Shell/Config language-standard fidelity (Facet 1b)
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 2 findings — Python/Shell/Config language-standard fidelity

### Python trio

The Python trio is the most accurate of the three. Header, shebang, module-docstring, naming, type-hint, f-string, early-return, and specific-exception guidance all match `skill_advisor.py:1-55`. Two real gaps:

**[P2] Python style_guide import-order example contradicts both reality and the quick_reference**
- `code-opencode doc: python/style_guide.md:99-113` — the "Import Order" block shows non-alphabetical stdlib order: `import sys`, `import json`, `import os`, `import re`, `from pathlib import Path`, `from typing import Tuple, List, Dict, Optional`.
- `reality: skill_advisor.py:23-34` — real imports are strictly alphabetical stdlib: `import argparse; import hashlib; import importlib.util; import json; import os; import re; import sqlite3; import subprocess; import sys`, then `from functools import lru_cache`, `from pathlib import Path`, `from typing import Any, Dict, List, Optional, Set`. The trio's own `quick_reference.md:362-368` says "Standard library (alphabetical)" — so the style_guide example is stale and internally inconsistent with its sibling.
- `recommendation:` Rewrite the style_guide import example to alphabetical order and add `argparse`/`functools.lru_cache`/`sqlite3`/`subprocess` to the "common stdlib seen in this repo" list, or cross-reference quick_reference §10 as authoritative.

**[P2] Docs prescribe manual `sys.argv` parsing; canonical repo Python uses `argparse`**
- `code-opencode doc: python/quick_reference.md:82-92` — file-template entry point teaches `if len(sys.argv) < 2: ... sys.argv[1]`.
- `reality: skill_advisor.py:10-21,23` — the canonical script declares an `argparse`-style interface (`--stdin`, `--health`, `--validate-only`, `--threshold`, `--confidence-only`, `--deep-skill-routing-json`) and `import argparse`. The prescribed pattern is used-but-undocumented; `argparse` appears nowhere in the trio.
- `recommendation:` Add an "argparse for multi-flag CLIs" subsection (pointing at `skill_advisor.py:10-21` as evidence) and demote the `sys.argv` template to "trivial single-arg scripts only".

> Note (not re-covering TS/JS per instructions): the Python trio's reliance on `skill_advisor.py` and `package_skill.py` as the only two evidence files is sound — both exist and roughly match. No fabricated evidence here.

---

### Shell trio

The shell trio's *prescriptions* (strict mode `set -euo pipefail`, `[[ ]]` over `[ ]`, quoted vars, `local`, `printf`>`echo`, `trap … EXIT`) are correct bash doctrine and broadly match real `.sh` files. But its **evidence pointers are systematically stale** — every cited canonical file uses a bare path that no longer resolves after the system-spec-kit relocation.

**[P1] Shell trio's primary evidence file `lib/common.sh` does not exist**
- `code-opencode doc: shell/style_guide.md:52` ("Evidence: `lib/common.sh:1`"), `:124` ("`lib/common.sh:9-35`"), `:161` ("`lib/common.sh:37-45`"), `:187` ("`lib/common.sh:28-31`"), `:215` ("`lib/common.sh:13-22`"), `:260` ("`lib/common.sh:47-88`"), `:272` ("`lib/common.sh:90-92`"); shell/quality_standards.md:48,148,242,403 repeat the same pointer.
- `reality:` `ls .opencode/skills/system-spec-kit/scripts/lib/common.sh` → `No such file or directory`. The real shared-lib file is `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh` (confirmed via glob). So ~11 evidence citations point at a renamed/nonexistent file; line numbers cannot be verified.
- `recommendation:` Global find-replace the bare `lib/common.sh` evidence pointer to `system-spec-kit/scripts/lib/shell-common.sh` (or whichever canonical file now defines `log_pass/log_warn/log_error`), and re-verify each cited line range.

**[P1] Shell trio cites bare `spec/create.sh` which does not resolve from CWD**
- `code-opencode doc: shell/style_guide.md:84` ("Evidence: `spec/create.sh:1-20`"), `:100` ("`spec/create.sh:22`"), `:387` ("`spec/create.sh:27`"), `:500` ("`spec/create.sh:42-60`"); quality_standards.md:64 repeats.
- `reality:` `ls spec/create.sh` from repo root → `No such file or directory`. Real path is `.opencode/skills/system-spec-kit/scripts/spec/create.sh`.
- `recommendation:` Prefix all `spec/create.sh` evidence with the full `system-spec-kit/scripts/` path. Consider documenting the repo-wide convention that shared shell libs/scripts live under `system-spec-kit/scripts/{lib,spec}/` — currently the trio's "Scope" (`shell/style_guide.md:28-31`) lists `.opencode/agents/scripts/` and bare `scripts/`, neither of which is where the evidence actually lives.

**[P2] Shell trio never warns about the `.sh`-extension-with-Python-shebang interpreter trap**
- `code-opencode doc: shell/style_guide.md:44-52` mandates `#!/usr/bin/env bash`; `shell/quality_standards.md:40-48` makes a P0 of the bash shebang. Neither doc addresses the inverse trap.
- `reality:` `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:1` is `#!/usr/bin/env python3`, yet its own documented invocation (`claude-posttooluse.sh:13`) is `bash -c 'cd "…" && bash .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh'` — a `bash` interpreter launched against a Python file, so the shebang is ignored and bash mis-parses `import sys`. (See council-seed verification below.)
- `recommendation:` Add a "Shebang must match invocation interpreter" P0 rule to the shell quality_standards: a `.sh` file invoked via `bash <path>` MUST be bash; a Python file MUST be invoked as `python3 <path>` or made executable and called directly so its `#!/usr/bin/env python3` shebang is honored. This is an empirically-hit repo pitfall, not theory.

---

### Config trio

The config trio teaches JSONC conventions well, but (a) its primary evidence path is stale, (b) it documents a config layout that largely does not exist in this repo, and (c) it entirely omits plain-JSON descriptor files — which are the majority of `.opencode` config by count.

**[P1] Config trio's sole evidence file `config/config.jsonc` does not resolve; layout tree is partly fictional**
- `code-opencode doc: config/style_guide.md:37` ("`config/config.jsonc`"), `:56` ("`config/config.jsonc:1-3`"), and the §9 "FILE LOCATIONS" tree (`:379-389`) showing `.opencode/config/opencode.json` and `.opencode/skill/[skill-name]/config/{config,filters,complexity-config}.jsonc`.
- `reality:` `ls config/config.jsonc` → no such file (real: `.opencode/skills/system-spec-kit/config/config.jsonc`). `ls .opencode/config/` → `No such file or directory`. `ls .opencode/opencode.json` → no such file (the real OpenCode config is `opencode.json` at **repo root**, not under `.opencode/`). The `.opencode/skill/` (singular) path in the tree is also wrong — skills live under `.opencode/skills/` (plural). Only `system-spec-kit` actually has a `config/` dir; `sk-code` does NOT (it uses top-level descriptor files).
- `recommendation:` Rewrite the evidence pointers to the full `system-spec-kit/config/config.jsonc` path; rewrite the §9 tree to reflect reality: repo-root `opencode.json`, and `system-spec-kit/config/*.jsonc` as the only JSONC-config home; drop the fictional `.opencode/config/` and singular `.opencode/skill/` branches.

**[P1] Config trio documents only JSONC; the dominant repo config genre — plain-JSON descriptors — is uncovered**
- `code-opencode doc: config/style_guide.md:28-31` scopes the trio to `*.json`, `*.jsonc` "config files", and every example (§2 JSONC header, §4 section comments, §7 comments) assumes comments are allowed.
- `reality: sk-code/mode-registry.json` (100 lines, the canonical parent-hub routing file) is strict JSON: camelCase keys hold (`workflowMode`, `packetKind`, `backendKind`, `mutatesWorkspace`, `advisorRoutingContract` — all camelCase ✓), but there are **zero comments**, no `// CONFIG:` header, no numbered section dividers — because JSON forbids them. The same strict-JSON, camelCase-but-commentless shape governs `graph-metadata.json`, `description.json`, `hub-router.json`, and every `agents/*.json`/`commands/*.yaml`. The trio's comment/header/section doctrine applies to none of them.
- `recommendation:` Split the config trio into two documented genres: (1) JSONC *behavior config* (`system-spec-kit/config/*.jsonc` — comments, headers, WHY annotations as taught); (2) strict-JSON *descriptors* (`mode-registry.json`, `graph-metadata.json`, `description.json`, agent/command frontmatter) — camelCase keys, no comments/trailing commas, stable key ordering, `$schema` where applicable. Add a quick_reference row for the descriptor genre.

**[P2] config/quality_standards.md verification grep points at a stale path**
- `code-opencode doc: config/quality_standards.md:97` — `rg -n "^// [0-9]+\\. [A-Z0-9 ()/:-]+$" .opencode/skills/sk-code/references/opencode/config`.
- `reality:` the config trio lives at `sk-code/code-opencode/references/config/`, not `sk-code/references/opencode/config`. The grep as written would scan a nonexistent directory.
- `recommendation:` Fix the path to `.opencode/skills/sk-code/code-opencode/references/config` (or to the real JSONC home `system-spec-kit/config`). The same file's §6 cross-link `../../assets/checklists/config_checklist.md` (`:107`) also needs existence verification — council iteration-1 territory flagged "authoring checklists cite nonexistent files"; confirm in a later facet-5 pass.

---

### Council-seed verification

**(a) The bash-invokes-Python-shebang interpreter trap — CONFIRMED.**
`claude-posttooluse.sh:1` = `#!/usr/bin/env python3`; `claude-posttooluse.sh:13` (its own documented hook command) = `bash -c 'cd "…/repo" && bash .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh'`. When `bash <file>` runs a Python file, the `#!` line is a comment to bash and `import sys` (`:18`) is mis-parsed, so the warn-only logic never executes. This is a genuine code bug (owns to `code-quality`, not `code-opencode`), and code-opencode's shell/python docs currently give no rule that would have caught it.

**Caveat on the "exit 2 reads as benign 'file skipped'" sub-claim:** the hook file *itself* uses `sys.exit(0)` exclusively (`:44,49,56,108`), so the specific exit-2-as-benign semantics were NOT confirmable in this file — they likely live in the downstream checker `check-comment-hygiene.sh` / a stack-folder checker (which my grep for `exit [0-9]`/`return [0-9]` returned empty for, suggesting either different exit phrasing or a missing file). **Refute-the-specifics / confirm-the-trap:** the interpreter mismatch is real; the exit-2-benign channel needs one more file read to land.

**(b) `verify_stack_folders.py` parsing for a vanished `STACK_FOLDERS` map — CONFIRMED (root cause proven).**
`verify_stack_folders.py:64` does `extract_dict_literal(text, "STACK_FOLDERS")`; on absence it prints `PROBLEM: could not find STACK_FOLDERS dict in {SKILL_MD}` and `sys.exit(1)` (`:66-67`). `grep -c STACK_FOLDERS .opencode/skills/sk-code/SKILL.md` → **0 occurrences**. Therefore the script is permanently in its failure branch; the playbook scenario requiring it to exit 0 can never pass. This is a real underlying-code bug (the `STACK_FOLDERS` declaration was removed during the v4 two-axis restructure but the verifier was not retired/rewritten) plus a docs artifact: `verify_stack_folders.py` ships under `code-opencode/assets/scripts/` as if it were a working reference implementation.

---

### Used-but-undocumented (worth ADDING)

- **`argparse` multi-flag CLIs** — `skill_advisor.py` uses it; the Python trio teaches only `sys.argv`. (See Python P2 above.)
- **Plain-JSON descriptor genre** — `mode-registry.json` / `graph-metadata.json` / `description.json` / `hub-router.json` and agent/command JSON frontmatter. The camelCase rule transfers; the comment/header/section doctrine does not. (See Config P1 above.)
- **`os.path` for script-dir resolution** — `skill_advisor.py:43-45` uses `os.path.dirname(os.path.realpath(__file__))` while the Python trio pushes `pathlib.Path` exclusively. The repo mixes both; docs should acknowledge the `__file__`+`os.path` idiom for bootstrap path resolution.
- **Strict-JSON key-ordering convention** — `mode-registry.json` follows a stable order (`skill`, `version`, `description`, discriminator, contract, `extensions`, `modes`); config quality_standards.md:84 mentions "keep key ordering stable" only as a P2 aside with no concrete ordering guidance for descriptors.
- **Exit-code semantics for OpenCode tooling** — `validate.sh` uses `0=pass, 1=warn, 2=errors` (per AGENTS.md); the shell trio's exit-code table (`quality_standards.md:346-354`) gives generic Unix semantics (2 = "misuse/syntax") that *contradict* the repo's warn-vs-error split. Worth a repo-specific exit-code table.

---

### Angles to pursue next

1. **Authoring-checklist pointer sweep (Facet 5).** `config/quality_standards.md:107`'s `../../assets/checklists/config_checklist.md` and the council's broader "authoring checklists cite nonexistent files" finding strongly suggest the `code-opencode/assets/checklists/*_authoring.md` ↔ `code-opencode/assets/checklists/*_checklist.md` cross-links are rotted. High-value, low-effort: glob + existence-check every `assets/checklists/` reference in the three trios and `shared/`.
2. **The `shared/` trio + `hooks.md`.** Council seed names `code-opencode/references/shared/hooks.md` as documenting removed hook infrastructure. Combined with the interpreter-trap bug found here, a dedicated hook-contract pass (Facet 3) reading `shared/hooks.md` against `.opencode/hooks/{pre-commit,install-hooks.sh}` and the `code-quality/scripts/hooks/*` family is the natural next step.
3. **Exit-code channel of the interpreter-trap bug.** One targeted read of `check-comment-hygiene.sh` (+ any `check-stack-folders`/`check-dist-staleness.sh`) to land or refute the "exit 2 reads as benign 'file skipped'" sub-claim — close out council seed (a) fully.
4. **`description.json` / `graph-metadata.json` descriptor schema fidelity.** The config trio ignores them; a read of `sk-code/{description,graph-metadata,hub-router}.json` would let the next iteration write the "strict-JSON descriptor genre" subsection with real field shapes (and check whether the one-graph-metadata invariant is representable in the docs).
