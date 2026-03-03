/**
 * Tool Card - Renders and updates tool execution cards (collapsible)
 */

export class ToolCardRenderer {
  constructor(container) {
    this.container = container;
    this.toolCards = new Map(); // toolCallId -> element
  }

  createToolCard(toolExecution) {
    const { toolCallId, toolName, args, status } = toolExecution;

    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.toolCallId = toolCallId;

    const argsPreview = this.getArgsPreview(toolName, args);
    const argsJson = this.formatJson(args);
    const isExpanded = (status === 'streaming' || status === 'pending');

    const isEdit = (toolName === 'edit' || toolName === 'Edit') && args && (args.oldText || args.old_text) && (args.newText || args.new_text);

    card.innerHTML = `
      <div class="tool-card-header" onclick="this.parentElement.querySelector('.tool-card-body').classList.toggle('expanded'); this.querySelector('.tool-card-chevron').classList.toggle('expanded')">
        <div class="tool-header-left">
          <span class="tool-card-chevron${isExpanded ? ' expanded' : ''}"><svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><path d="M2 1l4 3-4 3z"/></svg></span>
          <span class="tool-name">${this.escapeHtml(toolName)}</span>
          ${argsPreview ? `<span class="tool-args-preview">${this.escapeHtml(argsPreview)}</span>` : ''}
        </div>
        <div class="tool-status ${status}">${status}</div>
      </div>
      <div class="tool-card-body${isExpanded ? ' expanded' : ''}">
        ${!isEdit && argsJson ? `<div class="tool-args">${this.escapeHtml(argsJson)}</div>` : ''}
        <div class="tool-output-wrapper">
          <div class="tool-output-header">
            <span>Output</span>
            <button class="copy-btn" onclick="event.stopPropagation(); var t=this.closest('.tool-card').querySelector('.tool-output'); if(!t)return; var s=t.textContent,b=this; var fn=navigator.clipboard?navigator.clipboard.writeText(s):new Promise(function(r){var a=document.createElement('textarea');a.value=s;a.style.cssText='position:fixed;left:-9999px';document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a);r()}); fn.then(function(){b.textContent='Copied!';b.classList.add('copied');setTimeout(function(){b.textContent='Copy';b.classList.remove('copied')},2000)})">Copy</button>
          </div>
          <div class="tool-output"></div>
        </div>
      </div>
    `;

    // Insert diff view for Edit tools
    if (isEdit) {
      const diffEl = this.renderDiff(args.oldText || args.old_text, args.newText || args.new_text);
      const body = card.querySelector('.tool-card-body');
      body.insertBefore(diffEl, body.firstChild);
    }

    this.container.appendChild(card);
    this.toolCards.set(toolCallId, card);
    this.scrollToBottom();

    return card;
  }

  updateToolCard(toolExecution) {
    let card = this.toolCards.get(toolExecution.toolCallId);

    if (!card) {
      card = this.createToolCard(toolExecution);
    }

    // Update status
    const statusElement = card.querySelector('.tool-status');
    if (statusElement) {
      statusElement.className = `tool-status ${toolExecution.status}`;
      statusElement.textContent = toolExecution.status;
    }

    // Auto-expand when streaming
    if (toolExecution.status === 'streaming') {
      const body = card.querySelector('.tool-card-body');
      const chevron = card.querySelector('.tool-card-chevron');
      if (body) body.classList.add('expanded');
      if (chevron) chevron.classList.add('expanded');
    }

    // Update output
    const outputElement = card.querySelector('.tool-output');
    if (outputElement && toolExecution.output) {
      outputElement.textContent = toolExecution.output;
      this.scrollToBottom();
    }
  }

  finalizeToolCard(toolCallId, result, isError) {
    const card = this.toolCards.get(toolCallId);
    if (!card) return;

    // Update status
    const statusElement = card.querySelector('.tool-status');
    if (statusElement) {
      const status = isError ? 'error' : 'complete';
      statusElement.className = `tool-status ${status}`;
      statusElement.textContent = status;
    }

    // Update output with final result
    const outputElement = card.querySelector('.tool-output');
    if (outputElement && result) {
      const output = this.formatResult(result);
      outputElement.textContent = output;
    }

    // Collapse completed cards (less noise)
    if (!isError) {
      const body = card.querySelector('.tool-card-body');
      const chevron = card.querySelector('.tool-card-chevron');
      if (body) body.classList.remove('expanded');
      if (chevron) chevron.classList.remove('expanded');
    }
  }

  /**
   * Create a pre-collapsed card for session history using DOM methods (no innerHTML)
   */
  createHistoryCard(toolExecution) {
    const { toolCallId, toolName, args } = toolExecution;

    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.toolCallId = toolCallId;

    // Header
    const header = document.createElement('div');
    header.className = 'tool-card-header';

    const headerLeft = document.createElement('div');
    headerLeft.className = 'tool-header-left';

    const chevron = document.createElement('span');
    chevron.className = 'tool-card-chevron';
    chevron.innerHTML = '<svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><path d="M2 1l4 3-4 3z"/></svg>';
    headerLeft.appendChild(chevron);

    const name = document.createElement('span');
    name.className = 'tool-name';
    name.textContent = toolName;
    headerLeft.appendChild(name);

    const preview = this.getArgsPreview(toolName, args);
    if (preview) {
      const previewEl = document.createElement('span');
      previewEl.className = 'tool-args-preview';
      previewEl.textContent = preview;
      headerLeft.appendChild(previewEl);
    }

    header.appendChild(headerLeft);

    const status = document.createElement('div');
    status.className = 'tool-status complete';
    status.textContent = 'complete';
    header.appendChild(status);

    // Toggle expand on click
    header.addEventListener('click', () => {
      body.classList.toggle('expanded');
      chevron.classList.toggle('expanded');
    });

    card.appendChild(header);

    // Body (collapsed by default)
    const body = document.createElement('div');
    body.className = 'tool-card-body';

    const isEdit = (toolName === 'edit' || toolName === 'Edit') && args && (args.oldText || args.old_text) && (args.newText || args.new_text);

    if (isEdit) {
      body.appendChild(this.renderDiff(args.oldText || args.old_text, args.newText || args.new_text));
    } else {
      const argsJson = this.formatJson(args);
      if (argsJson) {
        const argsEl = document.createElement('div');
        argsEl.className = 'tool-args';
        argsEl.textContent = argsJson;
        body.appendChild(argsEl);
      }
    }

    const outputEl = document.createElement('div');
    outputEl.className = 'tool-output';
    body.appendChild(outputEl);

    card.appendChild(body);

    this.container.appendChild(card);
    this.toolCards.set(toolCallId, card);

    return card;
  }

  /**
   * Add result to a history card (stays collapsed)
   */
  addHistoryResult(toolCallId, result, isError) {
    const card = this.toolCards.get(toolCallId);
    if (!card) return;

    if (isError) {
      const statusEl = card.querySelector('.tool-status');
      if (statusEl) {
        statusEl.className = 'tool-status error';
        statusEl.textContent = 'error';
      }
    }

    const outputElement = card.querySelector('.tool-output');
    if (outputElement && result) {
      outputElement.textContent = this.formatResult(result);
    }
  }

  /** Compact preview for the header line */
  getArgsPreview(toolName, args) {
    if (!args || Object.keys(args).length === 0) return '';

    // Show the most relevant arg inline
    if (args.path) return args.path;
    if (args.command) return args.command.substring(0, 80);
    if (args.query) return args.query.substring(0, 60);
    if (args.url) return args.url;

    // Fallback: first string value
    for (const val of Object.values(args)) {
      if (typeof val === 'string' && val.length > 0) {
        return val.substring(0, 60);
      }
    }
    return '';
  }

  formatJson(obj) {
    try {
      if (Object.keys(obj).length === 0) return '';
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  }

  /** Render a simple inline diff for Edit tool */
  renderDiff(oldText, newText) {
    const container = document.createElement('div');
    container.className = 'tool-diff';

    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    // Removed lines
    for (const line of oldLines) {
      const el = document.createElement('div');
      el.className = 'diff-line diff-removed';
      el.textContent = '- ' + line;
      container.appendChild(el);
    }

    // Added lines
    for (const line of newLines) {
      const el = document.createElement('div');
      el.className = 'diff-line diff-added';
      el.textContent = '+ ' + line;
      container.appendChild(el);
    }

    return container;
  }

  formatResult(result) {
    if (!result) return '';

    if (result.content && Array.isArray(result.content)) {
      return result.content
        .map(block => {
          if (block.type === 'text') return block.text;
          return JSON.stringify(block);
        })
        .join('\n');
    }

    return JSON.stringify(result, null, 2);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  scrollToBottom() {
    if (this.container) {
      const threshold = 100;
      const isNear =
        this.container.scrollHeight - this.container.scrollTop - this.container.clientHeight < threshold;
      if (isNear) {
        requestAnimationFrame(() => {
          this.container.scrollTop = this.container.scrollHeight;
        });
      }
    }
  }

  clear() {
    this.toolCards.forEach((card) => card.remove());
    this.toolCards.clear();
  }
}
