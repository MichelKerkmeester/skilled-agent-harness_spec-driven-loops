// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Git Message Contract Gate
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Pi transport over the same message-contract gate the other runtimes run before a shell call.
// Pi reads a tool_call handler's return only for `.block`, so a refusal is a block with the
// gate's reason, which the model reads as the call's outcome. Anything the gate cannot read is
// allowed: the commit-msg hook, the pre-push hook and CI stand behind it. There is no kill
// switch, matching the other runtimes' gate.

type GateModule = { evaluateCommand: (command: string, cwd: string) => string | null };
type ContractModule = { ContractError: new (...args: unknown[]) => Error };

/** Blocks a bash call whose commit message, PR description or branch name breaks the templates. */
export default function gitMessageGate(pi: ExtensionAPI): void {
  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName !== "bash" || typeof event.input.command !== "string") return undefined;

    let gate: GateModule;
    let contract: ContractModule;
    try {
      [gate, contract] = await Promise.all([
        import("../../.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs") as Promise<GateModule>,
        import("../../.skilled/skills/sk-git/scripts/lib/message-contract.mjs") as Promise<ContractModule>,
      ]);
    } catch {
      // Fail open when the gate cannot load: the git hooks still enforce the contract.
      return undefined;
    }

    let reason: string | null = null;
    try {
      reason = gate.evaluateCommand(event.input.command, ctx.cwd);
    } catch (err) {
      // A rulebook that exists but cannot be read would block the commit anyway; say so now.
      if (err instanceof contract.ContractError) {
        reason = `sk-git blocked this command: the repository's rules cannot be read: ${err.message}`;
      }
    }
    return reason ? { block: true, reason } : undefined;
  });
}
