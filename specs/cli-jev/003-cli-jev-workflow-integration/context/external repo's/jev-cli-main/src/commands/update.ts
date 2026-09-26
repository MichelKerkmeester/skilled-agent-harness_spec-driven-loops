import { execFileSync } from "node:child_process";
import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import { CliError, EXIT } from "../errors.js";
import { emit } from "../output.js";

export const PACKAGE_NAME = "jevctl";

export interface UpdateRunner {
  /** Latest published version, e.g. "0.3.0". */
  latestVersion(): string;
  /** Installs the given version globally; throws on failure. */
  install(version: string): void;
}

export function npmRunner(): UpdateRunner {
  return {
    latestVersion() {
      try {
        return execFileSync("npm", ["view", PACKAGE_NAME, "version"], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        }).trim();
      } catch (err) {
        throw new CliError(`Could not reach npm to check the latest version: ${(err as Error).message}`);
      }
    },
    install(version) {
      try {
        execFileSync("npm", ["install", "-g", `${PACKAGE_NAME}@${version}`], { stdio: "inherit" });
      } catch (err) {
        throw new CliError(`npm install failed: ${(err as Error).message}`);
      }
    },
  };
}

/** Compare dotted numeric versions: positive if `a` is newer than `b`. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function updateAction(
  flags: { check?: boolean },
  ctx: CommandContext,
  currentVersion: string,
  runner: UpdateRunner = npmRunner(),
): number {
  const latest = runner.latestVersion();
  const payload = { command: "update", current: currentVersion, latest };

  if (compareVersions(latest, currentVersion) <= 0) {
    emit(ctx.output, { ...payload, updated: false }, () => ({
      head: [`jev is up to date (${currentVersion}).`],
    }));
    return EXIT.OK;
  }

  if (flags.check) {
    emit(ctx.output, { ...payload, updated: false }, () => ({
      head: [`Update available: ${currentVersion} -> ${latest}. Run \`jev update\` to install.`],
    }));
    return EXIT.OK;
  }

  runner.install(latest);
  emit(ctx.output, { ...payload, updated: true }, () => ({
    head: [`Updated jev ${currentVersion} -> ${latest}.`],
  }));
  return EXIT.OK;
}

export function registerUpdate(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
  currentVersion: string,
) {
  program
    .command("update")
    .description("Check npm for a newer jevctl release and install it globally.")
    .option("--check", "only report whether an update is available; do not install")
    .addHelpText(
      "after",
      `
Examples:
  jev update
  jev update --check`,
    )
    .action(async (flags: { check?: boolean }, cmd: Command) => {
      await run(async (ctx) => updateAction(flags, ctx, currentVersion), cmd);
    });
}
