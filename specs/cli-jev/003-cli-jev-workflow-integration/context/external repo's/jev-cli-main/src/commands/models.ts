import { TypeSafeClient } from "@typesafe-ai/sdk";
import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import { CliError, EXIT } from "../errors.js";
import { emit, paint } from "../output.js";
import { resolveProvider } from "../provider.js";

export async function modelsAction(ctx: CommandContext, env: NodeJS.ProcessEnv): Promise<number> {
  const provider = resolveProvider(env, ctx.config.provider);
  if (provider !== "typesafe") {
    throw new CliError(
      `Listing models requires the typesafe provider (resolved: ${provider}). Set TYPESAFE_API_KEY.`,
    );
  }
  const baseURL = (env.TYPESAFE_BASE_URL || "https://api.typesafe.ai").replace(/\/+$/, "");
  if (ctx.dryRun) {
    emit(
      { ...ctx.output, format: "json" },
      { command: "models", provider, method: "GET", url: `${baseURL}/v1/models` },
      () => ({}),
    );
    return EXIT.OK;
  }

  const client = new TypeSafeClient({
    apiKey: env.TYPESAFE_API_KEY,
    baseURL: env.TYPESAFE_BASE_URL || undefined,
    timeout: ctx.config.timeoutMs,
  });
  const models = await client.models.list();
  const payload = { command: "models", provider, models, default: ctx.config.model };
  emit(ctx.output, payload, () => ({
    table: {
      columns: ["Name", "Released", "Description"],
      rows: models.map((m) => [
        m.name === ctx.config.model ? paint(ctx.output.color, "green", m.name) : m.name,
        m.release_date,
        m.description,
      ]),
    },
  }));
  return EXIT.OK;
}

export function registerModels(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("models")
    .description("List the models available to your TypeSafe account.")
    .action(async (_flags: unknown, cmd: Command) => {
      await run((ctx) => modelsAction(ctx, ctx.env), cmd);
    });
}
