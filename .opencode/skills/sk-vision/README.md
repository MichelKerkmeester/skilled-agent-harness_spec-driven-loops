# sk-vision

Class S standalone skill for local vision evidence (OCR, inspect, detect) on screenshots and mockups.

## Layout

| Path | Role |
|------|------|
| `SKILL.md` | Skill contract and advisor triggers |
| `graph-metadata.json` | Class S identity (advisor graph) |
| `leaf-manifest.config.json` | Authored manifest config (`references/` only) |
| `leaf-manifest.json` / `leaf-aliases.json` | Generated — run `ci-skill-root-metadata.cjs --fix` |
| `references/` | Routed reference corpus |
| `vision-runtime/` | **Later child** — JSON-RPC runtime lands here; do not populate in scaffold phases |

## Host adapters (later children)

- **OpenCode plugin** — real file under the skill root (not a symlink).
- **Pi extension** — relative symlink to the OpenCode plugin path.

## Tools

The runtime exposes **13** `sk_vision_*` MCP tools (OCR, inspect, detect, and related vision ops). Do not invent extra tool names such as `sk_vision_query`.

## Publishing

This skill is **`sk-vision`**. Do not publish or refer to it as `opencode-senses`.

## Regenerate manifests

```bash
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check
```
