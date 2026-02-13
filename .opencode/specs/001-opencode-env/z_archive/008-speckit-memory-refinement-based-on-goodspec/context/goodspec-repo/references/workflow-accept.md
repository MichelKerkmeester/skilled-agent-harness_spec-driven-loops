# Workflow: Accept Phase

**GoopSpec Voice:** Critical, Celebratory, Final.

The Accept phase answers: **Did we deliver what we promised?** It is the final quality gate.

## Position in Workflow

```
┌─────────────┐     ┌─────────────┐
│   EXECUTE   │ ──▶ │   ACCEPT    │
│   (Build)   │     │  (Verify)   │
└─────────────┘     └─────────────┘
                          ↑
                    (You are here)

       ╔══════════════════════════════════════════════╗
       ║          ACCEPTANCE GATE                     ║
       ║   User MUST confirm completion               ║
       ╚══════════════════════════════════════════════╝
```

## Verification Protocol

Before asking the user, the agent runs the **Verifier**.

### 1. Automated Checks
*   Linting
*   Type Checking
*   Unit/Integration Tests
*   Build Verification

### 2. Spec Compliance
Compare `CHRONICLE.md` against `SPEC.md`.
*   Are all "Must Haves" marked complete?
*   Are there any open deviations?

## The Acceptance Gate

Present the evidence clearly.

```text
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  ✓ ACCEPTANCE GATE                                 │
│                                                    │
│  Implementation complete. Verification results:    │
│                                                    │
│  MUST HAVES:                                       │
│  ☑ Login Form - VERIFIED                           │
│  ☑ API Integration - VERIFIED                      │
│                                                    │
│  QUALITY METRICS:                                  │
│  ✓ Tests: 14/14 Passing                            │
│  ✓ Build: Success                                  │
│                                                    │
│  ─────────────────────────────────────────────     │
│  ► Type "accept" to Archive and Complete.          │
│  ► Type "issues: [details]" to Reject.             │
│                                                    │
╰────────────────────────────────────────────────────╯
```

## Handling Rejection

If the user types `issues: ...`:
1.  **Log:** Create a new "Fix" Wave in `BLUEPRINT.md`.
2.  **Execute:** Return to Execute Phase.
3.  **Verify:** Re-run verification.
4.  **Gate:** Re-present Acceptance Gate.

## Completion Activities

Once accepted:

1.  **Archive:** Move documents to `.goopspec/archive/`.
2.  **Retrospective:** Generate `RETROSPECTIVE.md`.
3.  **Memory Extraction:** The most important step for future intelligence.

### Memory Extraction
Extract **Patterns**, **Decisions**, and **Learnings**.

```javascript
// Example Extraction
memory_save({
  type: "observation",
  title: "Completed: Auth Feature",
  content: "Successfully implemented Auth0. Key learning: User prefers JWT over session cookies.",
  concepts: ["auth", "completion", "preference"],
  importance: 0.9 // High importance for future recall
})
```

## Commands

| Command | Effect |
| :--- | :--- |
| `/goop-accept` | Trigger the Acceptance Gate. |
| `/goop-complete` | Finalize, archive, and reset state. |
| `/goop-milestone` | Start a new milestone after completion. |

## The "Celebrate" Pattern

End on a high note.

```text
⬢ Milestone Completed: Auth Feature 🚀
  Saved to Archive: .goopspec/archive/v1.0-auth/
  Memory Updated: +3 new patterns
  
  Ready for next plan?
```
