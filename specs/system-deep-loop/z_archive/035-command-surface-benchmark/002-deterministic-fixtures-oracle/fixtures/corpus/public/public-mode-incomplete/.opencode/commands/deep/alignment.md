---
description: Run a bounded alignment workflow through one owned workflow family.
argument-hint: "<target> [:auto|:confirm]"
allowed-tools: Read, Bash
---

# Deep Alignment Router

This workflow router resolves an execution mode and hands the substantive run to
one owned workflow family.

## 1. ROUTER CONTRACT

The workflow YAML owns execution. The presentation contract owns visible wording.

## 2. OWNED ASSETS

| Purpose | Asset |
| --- | --- |
| Presentation | `.opencode/commands/deep/assets/deep_alignment_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_alignment_auto.yaml` |

## 3. MODE ROUTING

`:auto` selects the auto workflow. `:confirm` selects the confirm workflow. Both
remain within the same alignment workflow family.
