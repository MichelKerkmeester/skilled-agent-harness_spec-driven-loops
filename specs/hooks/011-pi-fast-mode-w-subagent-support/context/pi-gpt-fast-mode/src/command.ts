// Parser for `/fast [on|off|toggle|status|<tier>]`.
//
// Tiers (priority, flex, default, auto) both select the service tier AND
// enable Fast Mode in one step, e.g. `/fast flex`.

import { SERVICE_TIERS, isServiceTier, type ServiceTier } from "./types.ts";

export const COMMAND_USAGE =
  "Usage: /fast [on|off|toggle|status|priority|flex|default|auto]";

export type FastAction =
  | { kind: "set"; desired: boolean }
  | { kind: "toggle" }
  | { kind: "status" }
  | { kind: "tier"; tier: ServiceTier };

export class FastCommandError extends Error {
  constructor(message: string = COMMAND_USAGE) {
    super(message);
    this.name = "FastCommandError";
  }
}

export function parseFastCommand(args: string): FastAction {
  const arg = args.trim().toLowerCase();
  if (arg === "" || arg === "toggle") return { kind: "toggle" };
  if (arg === "on") return { kind: "set", desired: true };
  if (arg === "off") return { kind: "set", desired: false };
  if (arg === "status") return { kind: "status" };
  if (isServiceTier(arg)) return { kind: "tier", tier: arg };
  throw new FastCommandError();
}

export function getCommandCompletions(
  prefix: string,
): { value: string; label: string }[] {
  const p = prefix.trim().toLowerCase();
  const labels: Record<string, string> = {
    on: "enable",
    off: "disable",
    toggle: "toggle on/off",
    status: "show current state",
    priority: "fast / premium tier",
    flex: "economy tier (cheaper, slower)",
    default: "standard tier",
    auto: "let OpenAI choose",
  };
  return ["on", "off", "toggle", "status", ...SERVICE_TIERS]
    .filter((o) => o.startsWith(p))
    .map((value) => ({ value, label: `${value} \u2014 ${labels[value]}` }));
}
