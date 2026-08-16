# Spec 002 — Pi Remote feature parity (research → build)

One **phase per feature**. Inside each feature phase, the first sub-phase is
**research (`001-research/`)**; no build work starts until a feature's research is
complete and synthesized into a build-ready decision.

Target bar: the Claude iOS app and the Kimi Code app. Fixed and out of scope to
change: the ink-on-parchment design system (bone/ink/clay, light + dark, WCAG) and
the security posture (read-only default, one-use ticketed + revision-checked
mutations, redaction everywhere, host/extension-enforced plan mode, content-free
push, operator-only full-access). UI-only unless a feature inherently needs a new
lane — flagged and designed security-first.

## Features and research budgets

| Phase | Feature | Tier | Research budget (models) |
|-------|---------|------|--------------------------|
| F1 | Change AI model | YES — harden + improve | 5 × DeepSeek v4 Flash |
| F2 | Change effort level | YES — harden + improve | 5 × DeepSeek v4 Flash |
| F3 | Typed `/` commands, real inline list | PARTIAL — reach desired | 5 × SOL high + 5 × Grok 4.6 xhigh |
| F4 | Plan-mode switch incl. Tab affordance | PARTIAL — reach desired | 5 × SOL high + 5 × Grok 4.6 xhigh |
| F6 | See/preview a file like Claude | PARTIAL — reach desired | 5 × SOL high + 5 × Grok 4.6 xhigh |
| F5 | Upload media from iOS gallery | NO — reach desired, security-safe | 5 × SOL high + 5 × Grok 4.6 xhigh + 5 × DeepSeek v4 Flash |

Total: **55 research iterations**, no early convergence.

DeepSeek v4 Flash is dispatched via the OpenCode Go gateway
(`opencode-go/deepseek-v4-flash`) because the direct DeepSeek provider is out of
credit (operator decision).

## Layout

```
specs/002/<Fn-feature>/001-research/
  BRIEF.md            the research question + target + output contract
  iter-NN-<model>.md  one independent, cited research pass per iteration
  SYNTHESIS.md        (written after iters complete) build-ready decision
```
