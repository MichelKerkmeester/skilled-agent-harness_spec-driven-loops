import {
  createEmbeddingModelForIdentity,
  createZvecGrep,
  type EmbeddingModelIdentity,
} from "../engine/service/index.js";
import type {
  CreateZvecGrepOptions,
  ZvecGrep,
  ZvecGrepInfoResult,
} from "../engine/service/types.js";
import { workspaceIndexLocation } from "../engine/service/root.js";
import { readWorkspaceManifest } from "../engine/manifest.js";
import type { EmbeddingRuntimeConfig } from "../engine/config.js";
import type { EmbeddingModelInfo } from "../engine/models/index.js";
import type { IndexProgress, WorkspaceIndexEmbeddingSchema } from "../index.js";
import { indexStatusNeedsRefresh } from "../engine/index-status.js";
import { resolveRequestedRoot } from "../daemon/runtime-manager.js";
import { DaemonError } from "../daemon/errors.js";
import {
  RemoteEmbeddingAuthorizationManager,
  RemoteEmbeddingAuthorizationStore,
  planRemoteIndexAuthorization,
  planRemoteSearchAuthorization,
  withRemoteEmbeddingOperationPermit,
  type RemoteEmbeddingAuthorizationPlan,
  type RemoteEmbeddingAuthorizationScope,
  type RemoteEmbeddingOperationPermit,
} from "../authorization/index.js";
import {
  assertDropOnlyInput,
  contextOptionsFromRgInput,
  contextOptionsFromSearchInput,
  normalizePlainStringList,
  type NormalizedSearchInput,
} from "./input-normalization.js";
import { persistentIndexStatus } from "./result-format.js";
import type {
  ZvecGrepIndexDropInput,
  ZvecGrepIndexRequest,
  ZvecGrepIndexStatusInput,
  ZvecGrepRgInput,
} from "./schemas.js";
import type {
  ZvecGrepDaemonBackend,
  ZvecGrepIndexDropResult,
  ZvecGrepIndexResult,
  ZvecGrepIndexStatusResult,
  ZvecGrepRgResult,
  ZvecGrepSearchResult,
  ZvecGrepServerStatusResult,
} from "./tools.js";

/** Job identifier reported for operations that already ran to completion. */
export const DIRECT_INDEX_JOB_ID = "direct";

export const DIRECT_SERVER_STATUS_UNAVAILABLE_MESSAGE =
  "zvec_grep_server_status is unavailable in direct mode: the tools run in the calling process and no daemon is present.";

export type DirectBackendOptions = {
  serviceOptions?: CreateZvecGrepOptions;
  authorizationStore?: RemoteEmbeddingAuthorizationStore;
  createService?: typeof createZvecGrep;
};

/**
 * Executes the MCP tool contract against an in-process engine instead of the
 * shared daemon.
 *
 * One service instance serves the whole process so the Embedding model is
 * loaded lazily on the first search that needs vectors and then kept in the
 * engine's model cache for the life of the process. Without a daemon there is
 * no watcher, job scheduler, or background refresh: every operation runs
 * synchronously and index freshness is reported from a status scan rather than
 * from tracked runtime state.
 */
export class DirectBackend implements ZvecGrepDaemonBackend {
  private readonly authorizationManager: RemoteEmbeddingAuthorizationManager;
  private service?: Promise<ZvecGrep>;
  private closed = false;

  constructor(private readonly options: DirectBackendOptions) {
    this.authorizationManager = new RemoteEmbeddingAuthorizationManager(
      options.authorizationStore ??
        new RemoteEmbeddingAuthorizationStore({
          signingKeyPath: options.serviceOptions?.authorizationSigningKeyPath,
        }),
    );
  }

  async search(
    input: NormalizedSearchInput,
    options: { authorization?: RemoteEmbeddingOperationPermit } = {},
  ): Promise<ZvecGrepSearchResult> {
    const root = await resolveRequestedRoot(input.root, false);
    const service = await this.openService();
    // Direct mode cannot refresh in the background, so only an explicit
    // wait_for_fresh request updates the index inside the current call.
    const waitForFresh = input.freshness === "wait_for_fresh";
    const result = await withRemoteEmbeddingOperationPermit(
      options.authorization,
      () =>
        service.context({
          ...contextOptionsFromSearchInput(input, {
            autoUpdate: waitForFresh,
          }),
          root,
        }),
    );
    const info = await service.info({ root, includeStatus: true });
    return {
      root: result.root,
      freshness: indexStatusNeedsRefresh(info.status)
        ? "possibly_stale"
        : "fresh",
      result,
    };
  }

  async index(
    input: ZvecGrepIndexRequest,
    options: {
      authorization?: RemoteEmbeddingOperationPermit;
      onProgress?: (progress: IndexProgress) => void;
    } = {},
  ): Promise<ZvecGrepIndexResult> {
    if (input.drop === true) {
      assertDropOnlyInput(input);
      const dropped = await this.dropIndex(input);
      return {
        root: dropped.root,
        jobId: "drop",
        state: "succeeded",
        reused: false,
        action: "drop",
        dropped: dropped.removed,
      };
    }
    const root = await resolveRequestedRoot(input.root, true);
    // Model selection is fixed when a service is created, so a request that
    // overrides it gets its own service instead of silently reusing the
    // process-wide one.
    const overridden = await this.openIndexService(input);
    // No scheduler exists here, so indexing always runs to completion before
    // the tool call returns, whatever `wait` requested.
    try {
      const result = await withRemoteEmbeddingOperationPermit(
        options.authorization,
        () =>
          overridden.service.index({
            root,
            rebuild: input.rebuild,
            resetPaths: input.resetPaths,
            globs: normalizePlainStringList(input.globs),
            insensitiveGlobs: normalizePlainStringList(input.insensitiveGlobs),
            fileTypes: normalizePlainStringList(input.fileTypes),
            excludedFileTypes: normalizePlainStringList(
              input.excludedFileTypes,
            ),
            hidden: input.hidden,
            noIgnore: input.noIgnore,
            ignoreFiles: normalizePlainStringList(input.ignoreFiles),
            maxDepth: input.maxDepth,
            maxFileSizeBytes: input.maxFileSizeBytes,
            follow: input.follow,
            embeddingConcurrency: input.embeddingConcurrency,
            onProgress: options.onProgress,
          }),
      );
      return {
        root,
        jobId: DIRECT_INDEX_JOB_ID,
        state: "succeeded",
        reused: false,
        action: "index",
        ...(input.debug === true
          ? { scanDiagnostics: result.scanDiagnostics }
          : {}),
      };
    } finally {
      if (overridden.temporary) {
        await overridden.service.close();
      }
    }
  }

  async dropIndex(
    input: ZvecGrepIndexDropInput,
  ): Promise<ZvecGrepIndexDropResult> {
    const root = await resolveRequestedRoot(input.root, true);
    const service = await this.openService();
    return { root, removed: await service.dropIndex({ root }) };
  }

  async indexStatus(
    input: ZvecGrepIndexStatusInput,
  ): Promise<ZvecGrepIndexStatusResult> {
    const root = await resolveRequestedRoot(input.root, false);
    const info = await (
      await this.openService()
    ).info({
      root,
      includeStatus: true,
    });
    return {
      root: info.root,
      indexed: info.indexed,
      indexPolicy: info.indexPolicy,
      source: info.source,
      persistent: persistentIndexStatus(info),
      // Runtime state describes daemon runtimes and jobs, neither of which
      // exists in direct mode.
      runtime: undefined,
    };
  }

  async rg(input: ZvecGrepRgInput): Promise<ZvecGrepRgResult> {
    const root = await resolveRequestedRoot(input.root, false);
    const service = await this.openService();
    const result = await service.context({
      ...contextOptionsFromRgInput({ ...input, root }),
      root,
      autoUpdate: false,
    });
    return { root, result };
  }

  async serverStatus(): Promise<ZvecGrepServerStatusResult> {
    throw new DaemonError(
      "DIRECT_MODE_NO_DAEMON",
      DIRECT_SERVER_STATUS_UNAVAILABLE_MESSAGE,
    );
  }

  async planIndexAuthorization(
    input: ZvecGrepIndexRequest,
  ): Promise<RemoteEmbeddingAuthorizationPlan | undefined> {
    if (input.drop === true) return undefined;
    const info = await this.inspect(input.root);
    const identity = remoteEmbeddingIdentity(
      input.embedding ?? this.options.serviceOptions?.embedding,
      info,
    );
    if (!identity) return undefined;
    return await planRemoteIndexAuthorization({
      info,
      model: await this.embeddingModelInfo(identity, info),
      rebuild: input.rebuild,
      store: this.authorizationManager.store,
    });
  }

  async planSearchAuthorization(
    input: NormalizedSearchInput,
  ): Promise<RemoteEmbeddingAuthorizationPlan | undefined> {
    const info = await this.inspect(input.root);
    const identity = remoteEmbeddingIdentity(undefined, info);
    if (!identity) return undefined;
    return await planRemoteSearchAuthorization({
      info,
      model: await this.embeddingModelInfo(identity, info),
      search: input,
      store: this.authorizationManager.store,
    });
  }

  async existingRemoteEmbeddingPermit(
    plan: RemoteEmbeddingAuthorizationPlan,
  ): Promise<RemoteEmbeddingOperationPermit | undefined> {
    return await this.authorizationManager.existingWorkspacePermit(plan);
  }

  async grantRemoteEmbedding(
    plan: RemoteEmbeddingAuthorizationPlan,
    scope: RemoteEmbeddingAuthorizationScope,
  ): Promise<RemoteEmbeddingOperationPermit> {
    return await this.authorizationManager.grant(plan, scope);
  }

  async close(): Promise<void> {
    const service = this.service;
    this.closed = true;
    this.service = undefined;
    if (!service) return;
    await (await service).close();
  }

  private async openService(): Promise<ZvecGrep> {
    if (this.closed) {
      throw new DaemonError(
        "DIRECT_BACKEND_CLOSED",
        "The direct zvec-grep backend is closed.",
      );
    }
    this.service ??= (this.options.createService ?? createZvecGrep)({
      ...this.options.serviceOptions,
    });
    return await this.service;
  }

  private async openIndexService(
    input: ZvecGrepIndexRequest,
  ): Promise<{ service: ZvecGrep; temporary: boolean }> {
    if (
      input.embedding === undefined &&
      input.apiKey === undefined &&
      input.endpoint === undefined &&
      input.device === undefined
    ) {
      return { service: await this.openService(), temporary: false };
    }
    if (this.closed) {
      throw new DaemonError(
        "DIRECT_BACKEND_CLOSED",
        "The direct zvec-grep backend is closed.",
      );
    }
    return {
      service: await (this.options.createService ?? createZvecGrep)({
        ...this.options.serviceOptions,
        embedding: input.embedding ?? this.options.serviceOptions?.embedding,
        apiKey: input.apiKey ?? this.options.serviceOptions?.apiKey,
        endpoint: input.endpoint ?? this.options.serviceOptions?.endpoint,
        device: input.device ?? this.options.serviceOptions?.device,
      }),
      temporary: true,
    };
  }

  private async inspect(root: string): Promise<ZvecGrepInfoResult> {
    const canonicalRoot = await resolveRequestedRoot(root, false);
    return await (
      await this.openService()
    ).info({
      root: canonicalRoot,
      includeStatus: true,
    });
  }

  private async embeddingModelInfo(
    identity: EmbeddingModelIdentity,
    info: ZvecGrepInfoResult,
  ): Promise<EmbeddingModelInfo> {
    const model = createEmbeddingModelForIdentity(
      identity,
      this.options.serviceOptions ?? {},
      workspaceEmbeddingRuntime(info),
    );
    try {
      return model.info;
    } finally {
      await model.dispose();
    }
  }
}

/**
 * The Embedding identity that needs Remote Embedding authorization, or
 * undefined when the operation stays local.
 *
 * Only an explicitly requested model and the model already recorded in the
 * workspace index are resolved here. A first index that would pick a remote
 * model from `ZVEC_GREP_EMBEDDING` or the global default is not planned in
 * direct mode; the engine's authorization guard still fails it closed with an
 * actionable error rather than sending workspace content anywhere.
 */
function remoteEmbeddingIdentity(
  requestedEmbedding: string | undefined,
  info: ZvecGrepInfoResult,
): EmbeddingModelIdentity | undefined {
  const identity = requestedEmbedding
    ? embeddingIdentityFromReference(requestedEmbedding)
    : embeddingIdentityFromSchema(info.workspaceIndex?.embedding);
  return identity?.provider === "qwen" ? identity : undefined;
}

function embeddingIdentityFromReference(
  reference: string,
): EmbeddingModelIdentity | undefined {
  const separator = reference.indexOf("/");
  if (separator <= 0 || separator === reference.length - 1) return undefined;
  return {
    provider: reference.slice(0, separator),
    name: reference.slice(separator + 1),
  };
}

function embeddingIdentityFromSchema(
  schema: WorkspaceIndexEmbeddingSchema | null | undefined,
): EmbeddingModelIdentity | undefined {
  return schema ? { provider: schema.provider, name: schema.model } : undefined;
}

function workspaceEmbeddingRuntime(
  info: ZvecGrepInfoResult,
): EmbeddingRuntimeConfig {
  if (!info.workspaceIndex) return {};
  const location = workspaceIndexLocation(info.root);
  return readWorkspaceManifest(location.home)?.embeddingRuntime ?? {};
}
