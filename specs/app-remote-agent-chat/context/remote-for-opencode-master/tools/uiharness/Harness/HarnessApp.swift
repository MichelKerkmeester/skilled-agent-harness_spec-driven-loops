import RemoteKit
import SwiftUI

// Renders the app's REAL views against representative content, for design
// iteration and for App Store screenshots. Nothing here reimplements a
// view — every screen below is the code the app ships, so what you see is
// what users get.
//
// Pick a scene at launch:
//   xcrun simctl launch <device> com.timwilliams.harness.ui -scene 2

@main
struct HarnessApp: App {
    var body: some Scene {
        WindowGroup { HarnessView() }
    }
}

struct HarnessView: View {
    @StateObject private var models = ModelStore.shared
    @StateObject private var agents = AgentStore.shared
    @StateObject private var attachments = PromptAttachments()
    @StateObject private var dictation = Dictation()
    @State private var input = ""

    private var scene: Int { UserDefaults.standard.integer(forKey: "scene") }

    var body: some View {
        NavigationStack {
            content
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .principal) { BrandWordmark(height: 15) }
                    if scene != 3 {
                        ToolbarItem(placement: .topBarTrailing) {
                            Image(systemName: "arrow.triangle.branch")
                                .foregroundStyle(Color.ink)
                        }
                    }
                }
        }
        .task {
            models.mockForHarness()
            agents.mockForHarness(plan: scene == 4)
        }
    }

    @ViewBuilder
    private var content: some View {
        switch scene {
        case 2: permission
        case 3: patch
        case 4: planning
        default: working
        }
    }

    private var working: some View {
        VStack(spacing: 0) {
            Transcript(
                rows: [
                    .init(type: "user", text: "The token refresh races when two requests 401 at once. Fix it."),
                    .init(type: "reasoning", id: "r", text: Content.reasoning),
                    .init(type: "tool", id: "t1", tool: "read", status: "completed"),
                    .init(type: "tool", id: "t2", tool: "edit", status: "completed"),
                    .init(type: "text", id: "x", text: Content.answer),
                ],
                diffs: [.init(file: "Sources/Auth/TokenStore.swift", additions: 18, deletions: 6, status: "modified")],
                error: nil, running: true, activity: "Running the test suite",
                turnStartedAt: Date().addingTimeInterval(-14),
                todos: Content.todos
            )
            composer
        }
    }

    private var permission: some View {
        ZStack {
            working
            Color.black.opacity(0.35).ignoresSafeArea()
            VStack {
                Spacer()
                PermissionSheet(request: .init(
                    id: "p", permission: "bash",
                    patterns: ["rm -rf ./build && npm publish --access public"],
                    always: ["rm *"], risk: "high"
                )) { _, _ in }
                .frame(height: 540)
                .background(Color.canvas)
                .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
            }
            .ignoresSafeArea(edges: .bottom)
        }
    }

    private var patch: some View {
        PatchView(diff: .init(
            file: "Sources/Auth/TokenStore.swift", patch: Content.patch,
            additions: 18, deletions: 6, status: "modified"
        ))
    }

    private var planning: some View {
        VStack(spacing: 0) {
            Transcript(
                rows: [
                    .init(type: "user", text: "How would you restructure the sync layer? Don't change anything yet."),
                    .init(type: "reasoning", id: "r2", text: Content.planReasoning),
                    .init(type: "text", id: "x2", text: Content.plan),
                ],
                diffs: [], error: nil, running: false, activity: "",
                turnStartedAt: Date(), todos: []
            )
            composer
        }
    }

    private var composer: some View {
        Composer(
            input: $input, running: scene == 0 || scene == 1,
            dictation: dictation, attachments: attachments,
            models: models, agents: agents,
            onDictate: {}, onSend: {}
        )
    }
}

private enum Content {
    static let reasoning = """
    Two concurrent 401s both call refresh(), so the second overwrites the \
    first's token and one request ends up holding a token that was already \
    replaced. The fix is to make refresh idempotent for the duration of a \
    single refresh — one in-flight task everyone awaits.
    """

    static let answer = """
    Found it. `refresh()` had no guard against concurrent callers, so two \
    401s produced two refreshes and the loser kept a stale token.

    ```swift
    actor TokenStore {
        private var inFlight: Task<Token, Error>?

        func token() async throws -> Token {
            if let inFlight { return try await inFlight.value }
            let task = Task { try await api.refresh(current) }
            inFlight = task
            defer { inFlight = nil }
            return try await task.value
        }
    }
    ```

    Everyone now awaits the same task, so exactly one refresh happens.
    """

    static let planReasoning = """
    Before proposing anything I should be clear about what the sync layer \
    actually owns today: cursor bookkeeping, conflict resolution and the \
    retry policy all live in one type.
    """

    static let plan = """
    Three changes, in the order I'd make them:

    1. **Split `SyncEngine`.** Cursor bookkeeping and conflict resolution are unrelated responsibilities sharing one 600-line file.

    2. **Make retries a policy object.** The backoff is inlined in four places with three different sets of constants.

    3. **Then** move the cursor store behind a protocol, once there is something small enough to test.

    I haven't changed anything — say the word and I'll start with (1).
    """

    static let todos: [TodoItem] = [
        .init(id: "1", content: "Reproduce the race in a test", status: "completed"),
        .init(id: "2", content: "Serialise refresh through one task", status: "completed"),
        .init(id: "3", content: "Run the test suite", status: "in_progress"),
        .init(id: "4", content: "Check the retry path still backs off", status: "pending"),
    ]

    static let patch = """
    diff --git a/Sources/Auth/TokenStore.swift b/Sources/Auth/TokenStore.swift
    index 8f2a1c4..d91b7e0 100644
    --- a/Sources/Auth/TokenStore.swift
    +++ b/Sources/Auth/TokenStore.swift
    @@ -12,18 +12,30 @@ actor TokenStore {
         private var current: Token?
    -    private var refreshing = false
    +    private var inFlight: Task<Token, Error>?

    -    func token() async throws -> Token {
    -        if let current, !current.isExpired { return current }
    -        refreshing = true
    -        let fresh = try await api.refresh(current)
    -        current = fresh
    -        refreshing = false
    -        return fresh
    +    /// Concurrent callers share one refresh. Two requests hitting 401
    +    /// together used to trigger two refreshes, and the loser kept a
    +    /// token the server had already rotated away.
    +    func token() async throws -> Token {
    +        if let current, !current.isExpired { return current }
    +        if let inFlight { return try await inFlight.value }
    +
    +        let task = Task { try await api.refresh(current) }
    +        inFlight = task
    +        defer { inFlight = nil }
    +
    +        let fresh = try await task.value
    +        current = fresh
    +        return fresh
         }
     }
    """
}
