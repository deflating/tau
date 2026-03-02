# Tau Roadmap

Ideas and planned features. Nothing here is committed — just captured so it doesn't get lost.

---

## ✅ Done

### PWA / Install to Home Screen
Service worker, manifest, custom icons. Installable on iOS/Android/macOS as a standalone app.

### Full-Text Session Search
Search across all historical sessions by message content, not just titles. Debounced API search with highlighted snippets in the sidebar.

### Context Window Visualiser
Click the token usage pill to see a breakdown of cached tokens, fresh input, and available space. Stacked bar with legend.

### File Browser
Right sidebar with lazy-loaded file tree. Navigate directories, double-click to open files natively (macOS `open`), drag files onto the input to insert their path. Filters out `node_modules`, `.git`, etc.

### Custom Model Picker
Styled dropdown with search/filter, keyboard support, frosted glass menu. Replaces native `<select>`.

### Compaction Support
Manual compact command broadcasts start/end events to Tau. Shows compaction status in the conversation.

### Voice Input
Mic button inside the input bubble. Uses Web Speech API (on-device dictation). Live transcription into the textarea. Pulses red while recording. Hidden if browser doesn't support it.

### Diff Viewer
Edit tool cards render a proper inline diff with red/green lines instead of raw JSON args. Works for both live and history cards.

### Message Queuing
Input stays enabled while the agent is working. Queued messages appear as pills above the input with cancel buttons. Auto-sends in order when the agent finishes. Just like the TUI.

### Image Previews in Chat
Sent images now display inline in user message bubbles. Works for both new messages and session history.

### Six Themes
Dusk (clean neutral dark, default), Dawn (warm blue dark), Midnight (OLED black), Clean (Apple-style light with cyan-blue accents), Terracotta (warm light), Sage (warm olive-green light). Theme picker shows colour palette dots. All shadows flattened — no more clay.

### Frosted Header & Footer
Both header and input area are `position: absolute` with `backdrop-filter: blur(40px) saturate(1.5)`. Messages scroll behind both for the frosted glass effect.

### Settings Panel
Theme picker, auto-compaction toggle, thinking level, show/hide thinking blocks, push notification toggle.

---

## 🚀 Ready to Ship

### Logo & Branding
- Fresh README with feature overview
- Screenshots (Dusk, Clean, mobile, file browser, search)
- Already have the tau icon in multiple sizes

### npm Publishing
- `pi install npm:tau-mirror` for frictionless install
- Needs npm account setup and packaging

---

## 🔜 Low-Hanging Fruit

### Quick Actions on Tool Results
Copy output button on tool cards. Expand/collapse all. Maybe re-run command. ~30 mins.

---

## 🔮 Bigger Ideas

### File Preview Panel
Context-aware split pane that displays files the agent is working on.

- Code → syntax highlighted viewer (Monaco/CodeMirror)
- Images → preview (PNG, SVG, generated images)
- HTML → live iframe preview, hot reloads as agent edits
- Markdown → rendered preview

Desktop: button collapses sidebar and shrinks conversation to narrow feed, preview panel takes 60-70%. Mobile: tap a file reference to open full-screen preview.

Builds on the file browser — could auto-show preview when a file gets edited.

### Agent Teams (bundled)
Ship a subagent/team extension as part of Tau. Spawn agent teams from the web UI, visual grouping in sidebar, team status overview, live-switch between agents. Based on Pi's subagent pattern but tightly integrated.

### Conversation Fork/Branch Visualisation
Pi already has fork support in the RPC. Visualise the conversation as a tree — go back to any point and try a different approach. Like git for conversations.

### Cost Dashboard
Track spending over time, per model, per project. Charts and trends. Data already captured per message.

### Session Templates
Start a new session pre-loaded with context for a specific project. Each with its own CLAUDE.md, working directory, and maybe a starter prompt.

### Multi-Model A/B Testing
Send the same prompt to two models side by side and compare responses. Split view with both responses streaming.

### Live Terminal Embed
Embedded terminal panel (xterm.js) showing real-time bash output from Pi's tool executions. Would need pi-core to expose a PTY stream through the extension API — currently bash tool runs one-shot commands, not a persistent shell. Read-only output display is possible now but limited value over existing tool cards.

### memoryd Dashboard
Standalone viewer for memoryd memory files. Was previously built into Tau, stripped out to keep the core lean. The viewer code is saved at `~/Desktop/memoryd-viewer/`. Now being integrated into the native macOS memoryd menu bar app.
