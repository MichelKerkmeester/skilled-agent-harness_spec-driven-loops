import RemoteKit
import SwiftUI

/// One conversation's turn lifecycle, apart from any screen: send, resume,
/// abort, the event loop, and the blocked-on-you state (permissions,
/// questions). The phone's session screen and the desktop workspace both
/// sit on this — the reconnection design (docs/protocol-v1.md) is subtle
/// enough that it must not be forked twice.
///
/// Reconnection is the design center, not an edge case: every event of a
/// turn is counted, and when the socket dies mid-answer the same turn is
/// resumed from that count — the Mac replays what was missed and streams
/// on. See LiveTurns on the Mac side.
@MainActor
final class TurnController: ObservableObject {
    let project: String
    @Published private(set) var session: String?

    /// The transcript as rendered: parts keyed by id so a re-sent snapshot
    /// updates in place instead of duplicating.
    @Published private(set) var rows: [TurnPart] = []
    @Published private(set) var diffs: [FileDiff] = []
    @Published private(set) var todos: [TodoItem] = []
    @Published private(set) var running = false
    @Published var error: String?
    @Published var permission: PermissionRequest?
    @Published var question: QuestionRequest?
    /// When the running turn began — the working indicator escalates its
    /// wording against this.
    @Published private(set) var turnStartedAt = Date()

    /// The in-flight turn: its client-minted id and how many of its events
    /// arrived — exactly what `resume` needs.
    private var turnID: String?
    private var cursor = 0

    /// Whether the client is on screen right now. Drives the response to an
    /// interrupted socket: reconnect immediately when visible, wait to be
    /// resumed otherwise. The phone mirrors scenePhase into this; the
    /// desktop is simply always active.
    var active = true

    private let makeLink: () -> CompanionLink

    init(
        project: String,
        session: String?,
        makeLink: @escaping () -> CompanionLink = { CompanionLink() }
    ) {
        self.project = project
        self.session = session
        self.makeLink = makeLink
    }

    /// What to say the agent is doing: the newest part that has an opinion,
    /// falling back to the honest generic while the first tokens are still
    /// in flight.
    var activity: String {
        rows.reversed().compactMap(\.activityLabel).first ?? "Working"
    }

    // MARK: - Turn lifecycle

    /// Sends a prompt. The caller owns its input field and clears it; this
    /// owns everything from the trimmed text onward.
    func send(
        _ text: String,
        attachments: PromptAttachments,
        model: AgentModel?,
        agent: String?,
        knownCommands: [AgentCommand]
    ) {
        guard !running else { return }
        // Files alone are a legitimate prompt ("look at this"), but the
        // model does better with a nudge than with nothing at all.
        let files = attachments.wireAttachments()
        guard !text.isEmpty || !files.isEmpty else { return }
        let prompt = text.isEmpty ? "Take a look at the attached file(s)." : text
        error = nil
        diffs = []
        todos = []
        // Name the files in the transcript so the turn reads correctly
        // later, when the thumbnails are long gone.
        let names = attachments.items.map(\.name)
        attachments.clear()
        rows.append(TurnPart(
            type: "user",
            text: names.isEmpty ? prompt : prompt + "\n\n📎 " + names.joined(separator: ", ")
        ))

        var request = Wire.Request(kind: "prompt")
        request.project = project
        request.session = session
        request.attachments = files.isEmpty ? nil : files
        if let slash = SlashInput.command(prompt, known: knownCommands) {
            // The Mac invokes the command by name; OpenCode expands its own
            // template. Nothing here knows what the command actually says.
            request.command = slash.name
            request.arguments = slash.arguments
        } else {
            request.text = prompt
        }
        // Absent means "whatever the Mac would have used" — a deliberate
        // choice the picker offers explicitly.
        request.providerID = model?.providerID
        request.modelID = model?.modelID
        // Absent means OpenCode's own default (build).
        request.agent = agent
        let id = UUID().uuidString
        request.turn = id
        turnID = id
        cursor = 0
        turnStartedAt = Date()
        running = true
        Task { await consume(makeLink().run(request)) }
    }

    func resume() {
        guard let turnID else { return }
        var request = Wire.Request(kind: "resume")
        request.turn = turnID
        request.from = cursor
        Task { await consume(makeLink().run(request)) }
    }

    /// Stops the agent, not just the stream: the Mac tells OpenCode to
    /// abort the session, and the running turn winds down through its own
    /// idle → done, which is what resets `running` honestly.
    func abort() {
        guard let session else { running = false; turnID = nil; return }
        var request = Wire.Request(kind: "abort")
        request.session = session
        request.project = project
        Task {
            for await event in makeLink().run(request) where event.kind == "failed" {
                error = event.text
            }
        }
    }

    /// One event loop for prompt and resume alike — the Mac replays and
    /// then streams, and replayed events look exactly like live ones.
    private func consume(_ stream: AsyncStream<Wire.Event>) async {
        for await event in stream {
            // `ready` belongs to the connection, not the turn: it is not in
            // the Mac's replay buffer, so it must not advance the cursor.
            if event.kind != "ready" { cursor += 1 }
            switch event.kind {
            case "status":
                if let id = event.session { session = id }
            case "part":
                if let part = event.part { upsert(part) }
            case "permission":
                permission = event.permission
            case "question":
                question = event.question
            case "diff":
                diffs = event.diffs ?? []
            case "todos":
                todos = event.todos ?? []
            case "idle", "done":
                if event.kind == "done" { running = false; turnID = nil }
            case "failed":
                error = event.text
                if event.transient != true { running = false; turnID = nil }
            case "interrupted":
                // Socket lost mid-answer. If we're on screen, reconnect now;
                // otherwise the owner resumes us when it returns.
                if active { resume() }
                return
            case "unknown":
                // The Mac never got the question, or it aged out. Honest
                // reset: the user re-sends, nothing pretends otherwise.
                error = "That answer is gone — ask again."
                running = false
                turnID = nil
            default:
                break
            }
        }
    }

    private func upsert(_ part: TurnPart) {
        if let id = part.id, let index = rows.lastIndex(where: { $0.id == id }) {
            rows[index] = part
        } else {
            rows.append(part)
        }
    }

    // MARK: - Approvals

    func answer(_ request: PermissionRequest, reply: String, message: String?) {
        Task {
            // Biometrics stand in front of granting, never of declining.
            if reply != "reject", await !Approver.confirm() { return }
            permission = nil
            var wire = Wire.Request(kind: "permission")
            wire.permissionID = request.id
            wire.project = project
            wire.reply = reply
            wire.message = message
            for await event in makeLink().run(wire) where event.kind == "failed" {
                error = event.text
            }
        }
    }

    func answer(_ request: QuestionRequest, answers: [[String]]) {
        question = nil
        var wire = Wire.Request(kind: "question")
        wire.questionID = request.id
        wire.project = project
        wire.answers = answers
        Task {
            for await event in makeLink().run(wire) where event.kind == "failed" {
                error = event.text
            }
        }
    }

    // MARK: - Continuing an existing session

    func loadTranscript() async {
        guard let session else { return }
        var request = Wire.Request(kind: "transcript")
        request.session = session
        request.project = project
        for await event in makeLink().run(request) {
            switch event.kind {
            case "part": if let part = event.part { upsert(part) }
            case "diff": diffs = event.diffs ?? []
            case "failed": error = event.text
            default: break
            }
        }
    }
}
