# sk-code - Surface-Aware Code Skill

`sk-code` is the single code-work skill. It detects whether the current work is Webflow/frontend code or OpenCode system code, then loads the correct resources.

---

## Quick Start

The skill activates automatically for code-related prompts. Manual invocation:

```bash
Read .opencode/skill/sk-code/SKILL.md
```

---

## Code Surface Detection

| Surface | Detection | Route |
| --- | --- | --- |
| WEBFLOW | `src/2_javascript/`, `*.webflow.js`, `Webflow.push`, `--vw-`, motion.dev, GSAP, Lenis, HLS, Swiper, FilePond, `wrangler.toml` | Frontend HTML/CSS/JS, animation, CDN/minification, browser verification |
| OPENCODE | CWD or changed/target files under `.opencode/` | OpenCode skills, agents, commands, MCP/server code, scripts, tests, JSON/JSONC config |
| UNKNOWN | Neither surface matched | Ask for the surface and verification commands |

OPENCODE also performs language sub-detection for JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

---

## Structure Inventory

```text
sk-code/
├── SKILL.md                    Surface-aware router contract
├── README.md                   This file
├── description.json            Auto-discoverable description
├── graph-metadata.json         Skill graph relationships
│
├── references/
│   ├── router/                 Detection, intent, resource loading, lifecycle
│   │   ├── code_surface_detection.md
│   │   ├── intent_classification.md
│   │   ├── resource_loading.md
│   │   └── phase_lifecycle.md
│   ├── universal/              Shared code quality, style, research, error recovery
│   ├── webflow/                Live Webflow/frontend resources
│   └── opencode/               OpenCode system-code standards and references
│       ├── shared/
│       ├── javascript/
│       ├── typescript/
│       ├── python/
│       ├── shell/
│       └── config/
│
├── assets/
│   ├── universal/
│   ├── webflow/
│   └── opencode/checklists/
│
└── scripts/
    ├── minify-webflow.mjs
    ├── verify-minification.mjs
    ├── test-minified-runtime.mjs
    ├── verify_alignment_drift.py
    └── test_verify_alignment_drift.py
```

---

## Verification

| Surface | Evidence |
| --- | --- |
| WEBFLOW | Webflow build/minification scripts plus browser evidence for runtime changes |
| OPENCODE | `python3 .opencode/skill/sk-code/scripts/verify_alignment_drift.py --root <changed-scope>` plus targeted tests |

No completion claim is valid without fresh verification evidence.

---

## Migration Notes

The former standalone OpenCode system-code skill is absorbed into this skill as the OPENCODE surface route. Go and NextJS placeholder branches were removed because they were not maintained live routes.

Use route branches inside `sk-code` for future supported code surfaces rather than creating sibling code skills.

---

## Related Skills

- `sk-code-review` - findings-first review baseline; pair with this skill for surface standards evidence.
- `sk-doc` - documentation and markdown quality.
- `system-spec-kit` - spec folders, validation, memory, and context preservation.
- `mcp-chrome-devtools` - browser evidence for Webflow/frontend work.
- `sk-git` - git workflows, commits, PRs.
