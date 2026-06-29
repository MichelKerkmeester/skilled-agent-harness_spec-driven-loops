---
title: Evidence Capture
description: The evidence model for an audit. How to resolve the target, gather browser and deterministic evidence, record screenshot and overlay notes, then label findings honestly when evidence is unavailable.
trigger_phrases:
  - "evidence capture"
  - "audit evidence model"
  - "resolve audit target"
  - "fallback label evidence"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Evidence Capture

This reference defines the evidence model behind design audit findings: stable targets, evidence types, and honest labels when evidence is partial.

---

## 1. OVERVIEW

### Purpose

Explains how to resolve a surface to a stable target, what counts as source, rendered, or design-artifact evidence, and how to label a finding when the evidence you wanted was out of reach. The severity model and the per-finding schema live in `audit_contract.md`; this file decides whether a finding is confirmed or inferred before it ever gets a severity.

The audit gathers and labels evidence. It does not implement the fix, which is `sk-code` work once the user accepts the recommendation.

### When to Use

- Resolving an audit request to a concrete file, URL, screenshot, or design artifact.
- Gathering browser, deterministic, screenshot, overlay, source, rendered, or design-artifact evidence.
- Labeling findings as confirmed, inferred, unavailable, static-risk, or not assessed without overstating confidence.

### Core Principle

Every finding rests on evidence; a report that names its blind spots is stronger than one that hides them.

---

## 2. RESOLVE THE TARGET

Resolve the request to one concrete target before any evidence is gathered. A vague target produces vague findings.

1. **Prefer a source path over a dev-server URL** when both name the same surface. Ports drift and dev servers restart, file paths stay put. Use the URL only when no source path identifies the surface, such as a deployed page you cannot map to a file.
2. **Map the phrasing to a concrete artifact.**
   - "the homepage" resolves to the page source or the rendered route.
   - "the settings modal" resolves to the primary component file.
   - "this page" resolves to the current URL or the open source file.
3. **Pass markup to deterministic scans, not CSS-only files.** A stylesheet alone is not a scannable target.
4. **Narrow a very large tree before scanning.** For a tree of several hundred scannable files, scope to the surface in question or ask which surface to audit. Do not scan the whole repository to review one page.

State the resolved target at the top of the report so the reader knows exactly what was looked at. If the target cannot be resolved to a file, URL, screenshot or concrete design artifact, escalate rather than audit a guess.

---

## 3. THE THREE EVIDENCE TYPES

An audit draws on three kinds of evidence. Each finding cites at least one, and the type is part of the finding.

| Evidence type | What it is | Strength |
|---|---|---|
| Source | The actual file and line, the selector, the declared value | Strongest. A defect read in the code is a confirmed defect. |
| Rendered | A live page, a screenshot, an observed behavior | Confirms what the surface does, not always why. Pair with source when both exist. |
| Design-artifact | A plan, a spec, a wireframe with no built surface yet | Weakest for runtime claims. Good for intent, cannot prove behavior. |

Source plus rendered together is the gold standard: the code explains the cause and the render proves the effect. When only one is available, the finding is still valid, but its label in Section 5 must say which one.

---

## 4. BROWSER EVIDENCE

When browser automation is available and the target is viewable, rendered evidence makes a real difference to hierarchy, contrast, flow and motion claims that source alone cannot settle.

- **Use a local dev or static URL for local files.** Avoid `file://` unless the available browser explicitly supports that workflow.
- **Open a fresh tab for each independent pass.** Do not reuse a tab that is already at the right URL, because residual state contaminates the observation.
- **Run any local server in the background, record how to stop it, then stop it before final reporting** unless the user asks to keep it running.
- **Inspect representative views for a multi-view surface,** not just one. Three to five views across the flow catch state-specific defects a single screen hides.

Browser evidence is rendered evidence. It confirms what the surface does. Pair it with the source when you have both, because the render shows the symptom and the source shows the cause.

---

## 5. DETERMINISTIC SCANS

A deterministic scan is a repeatable check that returns the same finding every run: a contrast measurement, a selector match, a token-usage grep, an automated accessibility pass. Deterministic evidence is strong because anyone can rerun it and get the same answer.

- **Cite the measured value, not an impression.** A contrast finding states the ratio, a touch-target finding states the size. The pass and fail numbers behind these checks live in `accessibility_performance.md`. Do not file a contrast or touch finding on a guess.
- **Reuse a scan result instead of rerunning it.** If a scan has already produced usable counts, rule names and locations, cite those. Rerun only when the prior result was truncated or missing detail.
- **A clean scan is not proof of a strong design.** It proves the absence of the defects the scan checks for, nothing more. Hierarchy, voice, emotional fit and flow still need the judgment lens in `critique_hardening.md`. Pair every clean deterministic pass with that lens before any positive verdict.
- **Anchor judgment first when both run.** Form the design-review read before deterministic counts enter the picture, so the numbers sharpen the judgment rather than replace it.

---

## 6. SCREENSHOT AND OVERLAY NOTES

Screenshots and visual overlays are persuasive, which is exactly why they need honest labeling.

- **A claim about a visual overlay requires that the overlay actually rendered.** Do not say overlays are visible, do not say a detector ran in the page, do not say a scan highlighted issues on screen, unless the injection or the run genuinely succeeded.
- **When a visual pass was attempted but could not run,** say so plainly and report the fallback signal instead of implying a result. A reader who trusts a fabricated overlay ships on false confidence.
- **A finding from a screenshot without the underlying source is inferred,** because a screenshot shows the symptom but not the cause. Label it inferred and state that the source would confirm it.
- **Name the exact element in any visual finding,** the region, the selector or the component. "The submit button on the checkout step," never "some elements."

---

## 7. FALLBACK LABELS WHEN EVIDENCE IS UNAVAILABLE

Evidence is often partial. A missing capability is never a reason to invent a result or to inflate confidence. Label the gap and keep going.

| Situation | Label and behavior |
|---|---|
| Source unavailable, only a screenshot | File the finding as inferred, state that the source would confirm it. |
| Browser or overlay could not run | Report the fallback signal, do not claim a visual result, continue with source and manual review. |
| Deterministic scan unavailable or crashed | Note the scan as unavailable, continue with browser and manual review, do not present a missing scan as a clean pass. |
| Metrics unavailable for a performance claim | File it as a static-risk finding and state the measurement needed to confirm it. |
| A dimension cannot be assessed at all | Mark the dimension not assessed in the score and explain why, rather than scoring it on no evidence. |

The rule under every row: a confirmed finding is read from real evidence, an inferred finding names what would confirm it, a fabricated finding has no place in an audit at all. A report that names its blind spots is worth more than one that hides them.

---

### Impact Claims Need Impact Evidence

Static and visual evidence can support risk language: hard to scan, visually ambiguous, inaccessible, inconsistent, or production-unready. It cannot support claims about conversion, findability, user confidence, behavior change, support load, revenue, retention, or business impact unless the user supplies metrics, a baseline, usability-test evidence, or experiment results.

When impact evidence is missing, phrase the finding as a design risk and name the evidence that would prove the impact.

---

## 8. EVIDENCE TO SEVERITY HANDOFF

Once a finding has evidence and a confirmed-or-inferred label, it carries that into the severity and scoring step in `audit_contract.md`. The handoff rules:

1. Severity reflects user impact, not evidence strength. A confirmed P3 stays P3, and a well-grounded P0 is still a P0.
2. An inferred finding keeps its inferred label all the way into the report. Do not quietly upgrade an inference to a fact between this file and the score.
3. The findings-first order holds: evidence and findings come before the five-dimension score, never after it.
