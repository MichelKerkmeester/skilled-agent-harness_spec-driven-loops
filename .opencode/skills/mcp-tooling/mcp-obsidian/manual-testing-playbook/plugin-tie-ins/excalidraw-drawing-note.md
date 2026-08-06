---
title: "OBS-018 -- excalidraw-drawing-note"
description: "This scenario validates the Excalidraw drawing-note contract by copying a skeleton into a throwaway vault, extracting the scene JSON with python3 and verifying every frontmatter key against the data model."
stage: routing
version: "0.10.0.0"
---

# OBS-018 -- excalidraw-drawing-note

## 1. OVERVIEW

This scenario validates that the mode can operate Excalidraw at the file layer: a drawing-note skeleton is copied into a throwaway vault, the scene JSON is extracted and parsed with python3, and every frontmatter key is checked against the verified registry. Rendering itself is in-app and only observable with the Obsidian UI.

### Why This Matters

Every Excalidraw drawing is one Markdown note with a two-part contract: frontmatter keys the plugin recognizes and a scene JSON document that must parse. If the mode can produce a note that satisfies both halves at the file layer, drawing creation is fully delegated to the vault files.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-018
- Feature Name: Excalidraw drawing-note creation and validation
- Scenario Objective: Copy a drawing-note skeleton into a throwaway vault, extract the scene JSON with python3, and verify every frontmatter key against the data-model registry.
- Exact Prompt: Create a new empty Excalidraw drawing note in my vault and confirm the file is a valid drawing before I open it.
- Exact Command Sequence: 1. Create /tmp/_pbtest-excalidraw-drawing-note 2. Copy the skeleton asset 3. Extract the drawing note from the asset wrapper 4. Parse the embedded scene JSON with python3 5. Verify frontmatter keys against the registry 6. Remove the throwaway vault (cleanup)
- Expected Signals: The extracted note has `excalidraw-plugin: parsed` and `tags: [excalidraw]`; the scene JSON parses with `type` equal to `excalidraw`, `version` equal to `2`, an empty `elements` array and a documented `appState`; no frontmatter key falls outside the registry.
- Evidence: Extract script output, frontmatter grep results, scene JSON parse result, cleanup check.
- Pass/Fail Criteria: PASS if the scene JSON parses with the documented envelope, every frontmatter key is in the registry, and the throwaway vault is removed; FAIL if the JSON does not parse, a frontmatter key is outside the registry, or the throwaway vault is left behind.
- Failure Triage: 1. Re-read the skeleton asset. 2. Re-check the frontmatter registry and the scene JSON schema in the data model. 3. Re-run on a fresh throwaway vault.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Work ONLY in the throwaway vault `/tmp/_pbtest-excalidraw-drawing-note`. Never read or write a real vault (MEGA/Documents/Obsidian, iCloud, Barter). The real vaults are out of scope for this scenario.

### Prompt

Create a new empty Excalidraw drawing note in my vault and confirm the file is a valid drawing before I open it.

### Commands

The command blocks below are flush-left so they can be copied and run verbatim in one shell.

1. Create the throwaway vault and confirm the skeleton asset exists.

~~~sh
THROW=/tmp/_pbtest-excalidraw-drawing-note
rm -rf "$THROW"
mkdir -p "$THROW"
SKELETON=.opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/excalidraw/drawing-note.example.excalidraw.md
test -f "$SKELETON" && echo "skeleton asset present"
~~~

2. Extract the drawing note from the asset wrapper. This strips the asset frontmatter and usage text so only the drawing note is written.

~~~sh
python3 - "$SKELETON" "$THROW/Drawing 2026-01-01 10.00.00.excalidraw.md" <<'EOF'
import re, sys
src_path, dst_path = sys.argv[1], sys.argv[2]
src = open(src_path, encoding="utf-8").read()
marker = "## 2. Copyable drawing note"
assert marker in src, "copyable block marker missing"
head = src[src.index(marker):]
m = re.search(r"^(`{3,}|~{3,})[^\n]*\n", head, re.M)
assert m, "no fenced block after marker"
fence = m.group(1)
body = head[m.end():]
end = body.index(fence)
note = body[:end].strip("\n") + "\n"
open(dst_path, "w", encoding="utf-8").write(note)
print("extracted:", dst_path, "bytes:", len(note.encode()))
EOF
~~~

3. Verify the frontmatter keys against the data-model registry. The checks are headless and use no YAML dependency.

~~~sh
NOTE="$THROW/Drawing 2026-01-01 10.00.00.excalidraw.md"
rg -n '^excalidraw-plugin: parsed$' "$NOTE"
rg -n '^tags: \[excalidraw\]$' "$NOTE"
python3 - "$NOTE" <<'EOF'
import re, sys
note = open(sys.argv[1], encoding="utf-8").read()
fm = note.split("---", 2)[1]
keys = set(re.findall(r"^([a-zA-Z0-9_-]+):", fm, re.M))
registry = {
    "excalidraw-plugin", "tags", "excalidraw-export-transparent",
    "excalidraw-mask", "excalidraw-export-dark", "excalidraw-export-padding",
    "excalidraw-export-pngscale", "excalidraw-export-embed-scene",
    "excalidraw-export-internal-links", "excalidraw-link-prefix",
    "excalidraw-url-prefix", "excalidraw-link-brackets",
    "excalidraw-onload-script", "excalidraw-linkbutton-opacity",
    "excalidraw-default-mode", "excalidraw-font", "excalidraw-font-color",
    "excalidraw-border-color", "excalidraw-css", "excalidraw-autoexport",
    "excalidraw-embeddable-theme", "excalidraw-open-md", "excalidraw-embed-md",
}
unknown = keys - registry
assert not unknown, "unknown frontmatter keys: %s" % sorted(unknown)
assert "excalidraw-plugin" in keys
print("frontmatter keys OK:", sorted(keys))
EOF
~~~

4. Parse the embedded scene JSON and verify the documented envelope.

~~~sh
python3 - "$NOTE" <<'EOF'
import json, re, sys
note = open(sys.argv[1], encoding="utf-8").read()
m = re.search(r"^## Drawing\n```json\n(.*?)\n```", note, re.M | re.S)
assert m, "no json fenced block under Drawing section"
doc = json.loads(m.group(1))
assert doc["type"] == "excalidraw", doc.get("type")
assert doc["version"] == 2, doc.get("version")
assert isinstance(doc["elements"], list) and len(doc["elements"]) == 0
assert isinstance(doc["appState"], dict)
documented = {"type", "version", "source", "elements", "appState", "files"}
assert set(doc) <= documented, sorted(set(doc) - documented)
print("scene JSON OK: type=excalidraw version=2 elements=0")
print("keys:", sorted(doc))
EOF
~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Scene JSON parses with the documented envelope, every frontmatter key is in the registry, throwaway vault removed. The PASS proves the file-layer skeleton contract only: the empty `elements` array and default `appState` pass with the limitation that they prove defaults, not a populated drawing, and in-app render is not proven headlessly. |
| FAIL | Scene JSON does not parse, envelope keys deviate, a frontmatter key is outside the registry, or the throwaway vault is left behind |
| SKIP | Skeleton asset missing or python3 unavailable |

---

## 4. CLEANUP

Remove the throwaway vault and confirm the removal headlessly. No real vault file is ever read or written by this scenario.

~~~sh
rm -rf /tmp/_pbtest-excalidraw-drawing-note
test ! -e /tmp/_pbtest-excalidraw-drawing-note && echo "throwaway vault removed"
~~~

---

## 5. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/plugins/excalidraw/excalidraw.md](../../references/plugins/excalidraw/excalidraw.md) | Plugin identity and deep-reference index |
| [../../references/plugins/excalidraw/data-model.md](../../references/plugins/excalidraw/data-model.md) | Excalidraw frontmatter, scene envelope, and drawing-note data model |
| [../../references/plugins/excalidraw/workflows.md](../../references/plugins/excalidraw/workflows.md) | Create, extract, validate, and render workflow |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../assets/plugins/excalidraw/drawing-note.example.excalidraw.md](../../assets/plugins/excalidraw/drawing-note.example.excalidraw.md) | Canonical copyable drawing-note skeleton fixture |
| [../../assets/plugins/excalidraw/drawing-scene.example.json](../../assets/plugins/excalidraw/drawing-scene.example.json) | Canonical empty scene JSON fixture |
| [../../references/plugins/excalidraw/troubleshooting.md](../../references/plugins/excalidraw/troubleshooting.md) | Drawing-note, parsing, render, and compatibility diagnosis |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI boundary |

---

## 6. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-018
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/excalidraw-drawing-note.md
