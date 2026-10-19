// ───────────────────────────────────────────────────────────────────
// MODULE: Node Globals Shim
// ───────────────────────────────────────────────────────────────────

// `tsconfig.pi.json` resolves no `@types/node` (the repository has no root
// `node_modules`), so the Pi extensions declare only the Node surface they
// actually touch. A new global, member, or builtin module shows up as an
// error here instead of being silently available because a shim widened the
// environment. Extend it when an extension starts using more of the runtime.

declare namespace NodeJS {
  type ProcessEnv = Record<string, string | undefined>;
}

declare const process: {
  env: NodeJS.ProcessEnv;
  cwd(): string;
  pid: number;
  execPath: string;
};

declare module "node:child_process" {
  export interface ChildProcess {
    unref(): void;
  }
  export function spawn(
    command: string,
    args: readonly string[],
    options: { detached?: boolean; stdio?: string },
  ): ChildProcess;
}

declare module "node:path" {
  const path: {
    resolve(...segments: string[]): string;
    join(...segments: string[]): string;
  };
  export default path;
}
