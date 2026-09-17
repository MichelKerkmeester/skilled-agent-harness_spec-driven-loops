---
title: "Repl"
description: "Deterministic browser steps through aside repl: a persistent Playwright-compatible ES2023+ context for tabs, snapshots, screenshots, and PDFs, with artifacts verified independently of tool responses."
trigger_phrases:
  - "aside repl"
  - "aside deterministic browser"
  - "aside screenshot evidence"
  - "aside snapshot"
version: 1.0.0.0
---

# Repl (deterministic evidence lane over aside repl)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Carries deterministic, evidence-friendly browser steps: open this tab, snapshot it, screenshot it, save the PDF. `aside repl "<JavaScript>"` keeps a persistent JavaScript context with Playwright APIs while its process is alive — the right lane when the steps ARE the deliverable and a nondeterministic agent would waste tokens or blur the proof.

The capability is MUTATING on the browser side (tabs and navigation) and writes evidence artifacts to operator-directed paths. The hard honesty rule: an artifact is proven by its bytes, never by a successful tool response — a screenshot is a non-empty file starting with PNG magic bytes (`89 50 4e 47`), and structured capture must parse.

---

## 2. HOW IT WORKS

Advertised and probe-confirmed helpers on `1.26.626.1517` include `openTab(url)`, `closeTab`, `snapshot(page, options?)`, `page.screenshot(options)`, locator screenshots, `page.pdf`, `annotatedScreenshot`, plus `fetch`, `sleep`, `fs`, `pwd`, `path`, and `Buffer`; the sandbox is ES2023+ with no `import`/`require`. A round trip like `aside repl "await openTab('https://example.com')"` confirms binary, account context, and browser wiring in one step. The packaged evidence script chains open-snapshot-screenshot and validates the PNG magic bytes: `bash examples/repl-evidence-capture.sh <url> <output-dir>`.

Constraints: a REPL call can report "not bound to a browser profile" — a binding state, not an auth failure (see the troubleshoot domain). Keep a single writer per account/profile, capture stderr with `2>&1`, and redact cookies, credentials, private DOM, and request headers/bodies from saved evidence.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/aside-cli-reference.md` | Shared | REPL invocation form and helper boundary rules |
| `references/session-management.md` | Shared | REPL persistence layer and single-writer posture |
| `examples/repl-evidence-capture.sh` | Example | Open-snapshot-screenshot chain with PNG-magic validation |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/repl-evidence/repl-open-tab.md` | Manual playbook | ASD-006 deterministic tab open round trip |
| `manual-testing-playbook/repl-evidence/repl-screenshot-artifact.md` | Manual playbook | ASD-007 screenshot artifact with independent PNG verification |

---

## 4. SOURCE METADATA

- Group: Repl
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `repl/repl-evidence-capture.md`

Related references:
- [agent-tasks.md](../task/agent-tasks.md) covers the outcome-oriented lane for multi-step goals
- [mcp-transport-and-code-mode.md](../mcp/mcp-transport-and-code-mode.md) covers the same REPL surface exposed as the MCP `repl` tool
