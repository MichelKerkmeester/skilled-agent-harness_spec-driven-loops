// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Bundle Registry
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
  validateEventTypeNamespace,
} from '../event-envelope/index.js';
import { GaugeRegistry } from '../stream-fold-gauges/index.js';
import {
  TransactionalProjectionError,
  TransactionalProjectionErrorCodes,
} from './transactional-projection-errors.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  AcceptedProjectionEvent,
  ProjectionBundleDefinition,
  ProjectionBundleManifest,
  ProjectionGaugeBinding,
  ProjectionGaugeManifestEntry,
  ProjectionViewDefinition,
  ProjectionViewManifestEntry,
} from './transactional-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. INTERNAL CONTRACTS
// ───────────────────────────────────────────────────────────────────

export interface RegisteredProjectionView extends ProjectionViewDefinition {
  readonly acceptedEvents: readonly AcceptedProjectionEvent[];
  readonly dependencies: readonly string[];
  readonly configuration: Readonly<JsonObject>;
  readonly initialState: Readonly<JsonObject>;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly definitionDigest: string;
}

export interface RegisteredProjectionBundle {
  readonly manifest: ProjectionBundleManifest;
  readonly dependencyOrder: readonly string[];
  readonly views: ReadonlyMap<string, RegisteredProjectionView>;
  readonly gaugeBindings: ReadonlyMap<string, ProjectionGaugeBinding>;
}

const SEMANTIC_VERSION_PATTERN = /^\d+\.\d+\.\d+$/u;
const STABLE_VERSION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,255}$/u;
const AMBIENT_PATTERNS: readonly RegExp[] = Object.freeze([
  /\bDate\s*[.(]/u,
  /\bMath\.random\b/u,
  /\bcrypto\.(?:random|randomUUID)\b/u,
  /\bprocess\b/u,
  /\bglobalThis\b/u,
  /\bperformance\.now\b/u,
  /\bIntl\b/u,
  /\.localeCompare\s*\(/u,
  /\brequire\s*\(/u,
  /\bfetch\s*\(/u,
  /\b(?:readFile|readdir|stat|open|writeFile)Sync\s*\(/u,
]);

// ───────────────────────────────────────────────────────────────────
// 2. NORMALIZATION HELPERS
// ───────────────────────────────────────────────────────────────────

function compareCodePoints(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function bundleKey(bundleId: string, bundleVersion: string): string {
  return `${bundleId}\u0000${bundleVersion}`;
}

function frozenJson<T extends JsonValue>(value: T): T {
  const clone = JSON.parse(canonicalJson(value)) as T;
  const freeze = (entry: JsonValue): void => {
    if (entry !== null && typeof entry === 'object') {
      Object.values(entry).forEach(freeze);
      Object.freeze(entry);
    }
  };
  freeze(clone);
  return clone;
}

function registeredJson<T extends JsonValue>(value: T, viewId: string, field: string): T {
  try {
    return frozenJson(value);
  } catch {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection registry value is not canonical JSON',
      { viewId, field },
    );
  }
}

function requireStableVersion(value: string, field: string): string {
  if (!STABLE_VERSION_PATTERN.test(value)) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection version fields require bounded stable identities',
      { field },
    );
  }
  return value;
}

function functionDigest(functions: readonly Function[]): string {
  return sha256Bytes(canonicalBytes(
    functions.map((implementation) => Function.prototype.toString.call(implementation)),
  ));
}

function assertNoAmbientDependency(definition: ProjectionViewDefinition): void {
  const source = [definition.reduce, definition.finalize]
    .map((implementation) => Function.prototype.toString.call(implementation))
    .join('\n');
  if (AMBIENT_PATTERNS.some((pattern) => pattern.test(source))) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection reducers cannot depend on ambient process capabilities',
      { viewId: definition.viewId },
    );
  }
}

function normalizeAcceptedEvents(
  viewId: string,
  acceptedEvents: readonly AcceptedProjectionEvent[],
): readonly AcceptedProjectionEvent[] {
  if (!Array.isArray(acceptedEvents) || acceptedEvents.length === 0) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection views require at least one accepted event schema',
      { viewId },
    );
  }
  const seen = new Set<string>();
  const normalized = acceptedEvents.map((entry) => {
    const eventType = validateEventTypeNamespace(entry.eventType);
    const effectiveVersions = [...entry.effectiveVersions].sort((left, right) => left - right);
    if (
      seen.has(eventType)
      || effectiveVersions.length === 0
      || new Set(effectiveVersions).size !== effectiveVersions.length
      || effectiveVersions.some((version) => !Number.isSafeInteger(version) || version < 1)
    ) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
        'registry',
        'Projection event schemas require unique types and positive versions',
        { viewId, eventType },
      );
    }
    seen.add(eventType);
    return Object.freeze({ eventType, effectiveVersions: Object.freeze(effectiveVersions) });
  });
  normalized.sort((left, right) => compareCodePoints(left.eventType, right.eventType));
  return Object.freeze(normalized);
}

function normalizeView(definition: ProjectionViewDefinition): RegisteredProjectionView {
  const viewId = validateEventTypeNamespace(definition.viewId);
  if (
    !SEMANTIC_VERSION_PATTERN.test(definition.viewVersion)
    || typeof definition.reduce !== 'function'
    || typeof definition.finalize !== 'function'
    || typeof definition.validateState !== 'function'
    || typeof definition.validateOutput !== 'function'
    || (definition.unknownEventPolicy !== 'ignore' && definition.unknownEventPolicy !== 'reject')
  ) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection view identity, policy, validators, and reducers are required',
      { viewId },
    );
  }
  assertNoAmbientDependency(definition);
  const viewVersion = definition.viewVersion;
  const outputSchemaVersion = requireStableVersion(
    definition.outputSchemaVersion,
    'outputSchemaVersion',
  );
  const reducerIdentity = requireStableVersion(definition.reducerIdentity, 'reducerIdentity');
  const acceptedEvents = normalizeAcceptedEvents(viewId, definition.acceptedEvents);
  const dependencies = Object.freeze([...definition.dependencies].sort(compareCodePoints));
  if (new Set(dependencies).size !== dependencies.length) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection view dependencies must be unique',
      { viewId },
    );
  }
  const configuration = registeredJson(definition.configuration as JsonObject, viewId, 'configuration');
  const initialState = registeredJson(definition.initialState as JsonObject, viewId, 'initialState');
  let initialStateValid = false;
  try {
    initialStateValid = definition.validateState(initialState);
  } catch {
    initialStateValid = false;
  }
  if (!initialStateValid) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection initial state fails its registered validator',
      { viewId },
    );
  }
  let initialOutput: JsonObject;
  let repeatedInitialOutput: JsonObject;
  try {
    initialOutput = registeredJson(
      definition.finalize(registeredJson(initialState, viewId, 'initialState')),
      viewId,
      'initialOutput',
    );
    repeatedInitialOutput = registeredJson(
      definition.finalize(registeredJson(initialState, viewId, 'initialState')),
      viewId,
      'initialOutput',
    );
  } catch (error: unknown) {
    if (error instanceof TransactionalProjectionError) throw error;
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection finalizer rejected its registered initial state',
      { viewId },
    );
  }
  let initialOutputValid = false;
  try {
    initialOutputValid = definition.validateOutput(initialOutput);
  } catch {
    initialOutputValid = false;
  }
  if (
    canonicalJson(initialOutput) !== canonicalJson(repeatedInitialOutput)
    || !initialOutputValid
  ) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection finalizer is unstable or fails its registered output validator',
      { viewId },
    );
  }
  const configurationDigest = sha256Bytes(canonicalBytes(configuration));
  const reducerDigest = sha256Bytes(canonicalBytes({
    reducerIdentity,
    implementationDigest: functionDigest([
      definition.reduce,
      definition.finalize,
      definition.validateState,
      definition.validateOutput,
    ]),
  }));
  const descriptor = {
    viewId,
    viewVersion,
    outputSchemaVersion,
    reducerIdentity,
    reducerDigest,
    configurationDigest,
    acceptedEvents,
    unknownEventPolicy: definition.unknownEventPolicy,
    dependencies,
    initialStateHash: sha256Bytes(canonicalBytes(initialState)),
  };
  return Object.freeze({
    ...definition,
    ...descriptor,
    configuration,
    initialState,
    definitionDigest: sha256Bytes(canonicalBytes(descriptor)),
  });
}

function viewManifest(view: RegisteredProjectionView): ProjectionViewManifestEntry {
  return frozenJson({
    viewId: view.viewId,
    viewVersion: view.viewVersion,
    outputSchemaVersion: view.outputSchemaVersion,
    reducerIdentity: view.reducerIdentity,
    reducerDigest: view.reducerDigest,
    configurationDigest: view.configurationDigest,
    definitionDigest: view.definitionDigest,
    acceptedEvents: view.acceptedEvents.map((entry) => ({
      eventType: entry.eventType,
      effectiveVersions: [...entry.effectiveVersions],
    })),
    unknownEventPolicy: view.unknownEventPolicy,
    dependencies: [...view.dependencies],
  }) as ProjectionViewManifestEntry;
}

function gaugeManifest(
  gaugeRegistry: GaugeRegistry,
  binding: ProjectionGaugeBinding,
): ProjectionGaugeManifestEntry {
  const registered = gaugeRegistry.resolve(binding.gaugeId, binding.gaugeVersion);
  const dependencies = Object.freeze([
    ...new Set([...(registered.dependencies ?? []), ...(binding.dependencies ?? [])]),
  ].sort(compareCodePoints));
  return frozenJson({
    gaugeId: registered.gaugeId,
    gaugeVersion: registered.gaugeVersion,
    reducerDigest: registered.reducerDigest,
    configurationDigest: registered.configurationDigest,
    definitionDigest: registered.definitionDigest,
    dependencies: [...dependencies],
  }) as ProjectionGaugeManifestEntry;
}

function dependencyOrder(
  viewEntries: readonly ProjectionViewManifestEntry[],
  gaugeEntries: readonly ProjectionGaugeManifestEntry[],
): readonly string[] {
  const dependencies = new Map<string, readonly string[]>();
  for (const entry of [...viewEntries, ...gaugeEntries]) {
    const unitId = String('viewId' in entry ? entry.viewId : entry.gaugeId);
    if (dependencies.has(unitId)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REGISTRY_DUPLICATE,
        'registry',
        'View and gauge identities must be unique inside one bundle',
        { unitId },
      );
    }
    dependencies.set(unitId, Object.freeze([...(entry.dependencies as string[])]));
  }
  for (const [unitId, required] of dependencies) {
    const missing = required.find((dependency) => !dependencies.has(dependency));
    if (missing) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
        'registry',
        'Projection dependency is not registered in the atomic bundle',
        { unitId, dependency: missing },
      );
    }
  }

  const order: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (unitId: string): void => {
    if (visiting.has(unitId)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.DEPENDENCY_CYCLE,
        'registry',
        'Projection bundle dependency graph must remain acyclic',
        { unitId },
      );
    }
    if (visited.has(unitId)) return;
    visiting.add(unitId);
    for (const dependency of dependencies.get(unitId) ?? []) visit(dependency);
    visiting.delete(unitId);
    visited.add(unitId);
    order.push(unitId);
  };
  for (const unitId of [...dependencies.keys()].sort(compareCodePoints)) visit(unitId);
  return Object.freeze(order);
}

function normalizeBundle(
  definition: ProjectionBundleDefinition,
  gaugeRegistry: GaugeRegistry,
): RegisteredProjectionBundle {
  const bundleId = validateEventTypeNamespace(definition.bundleId);
  if (
    !SEMANTIC_VERSION_PATTERN.test(definition.bundleVersion)
    || definition.views.length === 0
    || definition.gauges.length === 0
  ) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Projection bundles require a semantic version, views, and gauges',
      { bundleId },
    );
  }
  const projectionSchemaVersion = requireStableVersion(
    definition.projectionSchemaVersion,
    'projectionSchemaVersion',
  );
  const views = definition.views.map(normalizeView);
  const viewMap = new Map<string, RegisteredProjectionView>();
  for (const view of views) {
    if (viewMap.has(view.viewId)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REGISTRY_DUPLICATE,
        'registry',
        'Projection bundle contains a duplicate view identity',
        { viewId: view.viewId },
      );
    }
    viewMap.set(view.viewId, view);
  }
  const gaugeMap = new Map<string, ProjectionGaugeBinding>();
  const gaugeEntries = definition.gauges.map((binding) => {
    const entry = gaugeManifest(gaugeRegistry, binding);
    if (gaugeMap.has(entry.gaugeId)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REGISTRY_DUPLICATE,
        'registry',
        'Projection bundle contains a duplicate gauge identity',
        { gaugeId: entry.gaugeId },
      );
    }
    gaugeMap.set(entry.gaugeId, Object.freeze({
      gaugeId: entry.gaugeId,
      gaugeVersion: entry.gaugeVersion,
      dependencies: Object.freeze([...entry.dependencies]),
    }));
    return entry;
  });
  const viewEntries = views.map(viewManifest);
  const order = dependencyOrder(viewEntries, gaugeEntries);
  const reducerDigest = sha256Bytes(canonicalBytes([
    ...viewEntries.map(({ viewId, reducerDigest: digest }) => ({ unitId: viewId, digest })),
    ...gaugeEntries.map(({ gaugeId, reducerDigest: digest }) => ({ unitId: gaugeId, digest })),
  ].sort((left, right) => compareCodePoints(left.unitId, right.unitId))));
  const configurationDigest = sha256Bytes(canonicalBytes([
    ...viewEntries.map(({ viewId, configurationDigest: digest }) => ({ unitId: viewId, digest })),
    ...gaugeEntries.map(({ gaugeId, configurationDigest: digest }) => ({ unitId: gaugeId, digest })),
  ].sort((left, right) => compareCodePoints(left.unitId, right.unitId))));
  const manifestCore = {
    bundleId,
    bundleVersion: definition.bundleVersion,
    projectionSchemaVersion,
    dependencyOrder: [...order],
    views: viewEntries,
    gauges: gaugeEntries,
    reducerDigest,
    configurationDigest,
  };
  const manifest: ProjectionBundleManifest = frozenJson({
    ...manifestCore,
    bundleDigest: sha256Bytes(canonicalBytes(manifestCore)),
  }) as ProjectionBundleManifest;
  return Object.freeze({
    manifest,
    dependencyOrder: order,
    views: viewMap,
    gaugeBindings: gaugeMap,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Immutable exact-version registry for atomic projection bundles. */
export class ProjectionBundleRegistry {
  public readonly digest: string;
  readonly #bundles: ReadonlyMap<string, RegisteredProjectionBundle>;
  readonly #inspection: readonly ProjectionBundleManifest[];

  public constructor(
    definitions: readonly ProjectionBundleDefinition[],
    gaugeRegistry: GaugeRegistry,
  ) {
    if (!(gaugeRegistry instanceof GaugeRegistry) || definitions.length === 0) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
        'registry',
        'Projection registry requires bundles and the shipped gauge registry',
      );
    }
    const bundles = new Map<string, RegisteredProjectionBundle>();
    for (const definition of definitions) {
      const bundle = normalizeBundle(definition, gaugeRegistry);
      const key = bundleKey(bundle.manifest.bundleId, bundle.manifest.bundleVersion);
      if (bundles.has(key)) {
        throw new TransactionalProjectionError(
          TransactionalProjectionErrorCodes.REGISTRY_DUPLICATE,
          'registry',
          'Projection bundle identity and version must be unique',
          {
            bundleId: bundle.manifest.bundleId,
            bundleVersion: bundle.manifest.bundleVersion,
          },
        );
      }
      bundles.set(key, bundle);
    }
    this.#bundles = bundles;
    this.#inspection = Object.freeze([...bundles.values()]
      .map((bundle) => bundle.manifest)
      .sort((left, right) => compareCodePoints(
        bundleKey(left.bundleId, left.bundleVersion),
        bundleKey(right.bundleId, right.bundleVersion),
      )));
    this.digest = sha256Bytes(canonicalBytes(this.#inspection as unknown as JsonValue));
    Object.freeze(this);
  }

  /** Return function-free immutable manifests in canonical identity order. */
  public inspect(): readonly ProjectionBundleManifest[] {
    return this.#inspection;
  }

  /** Resolve one exact bundle implementation or reject ambiguous processing. */
  public resolve(bundleId: string, bundleVersion: string): RegisteredProjectionBundle {
    const bundle = this.#bundles.get(bundleKey(bundleId, bundleVersion));
    if (!bundle) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REGISTRY_INCOMPLETE,
        'registry',
        'Projection bundle identity and version are not registered',
        { bundleId, bundleVersion },
      );
    }
    return bundle;
  }
}
