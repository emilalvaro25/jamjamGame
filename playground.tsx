import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { marked } from 'marked';

export { marked };

export enum ChatState {
  IDLE,
  THINKING,
  CODING,
  GENERATING,
}

@customElement('playground-component')
export class Playground extends LitElement {
  @property({ type: Function }) sendMessageHandler!: (input: string, role: string, code: string, codeHasChanged: boolean) => Promise<void>;
  @property({ type: Function }) resetHandler!: () => Promise<void>;

  @state() private _code = '';
  @state() private _chatState: ChatState = ChatState.IDLE;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    #root {
      display: flex;
      flex-direction: row;
      height: 100%;
    }
    #chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #ccc;
    }
    #code-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    #messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
    #input-area {
      display: flex;
      padding: 1rem;
      border-top: 1px solid #ccc;
    }
    #input-field {
      flex: 1;
    }
    #code-editor {
      flex: 1;
      width: 100%;
      height: 100%;
    }
    .hidden {
        display: none;
    }
  `;

  render() {
    return html`
      <div id="root">
        <div id="chat-container">
          <div id="messages"></div>
          <div id="input-area">
            <input id="input-field" @keydown=${this._handleInputKeyDown} />
            <button @click=${this._sendMessage}>Send</button>
          </div>
        </div>
        <div id="code-container">
          <textarea id="code-editor" .value=${this._code} @input=${this._onCodeChange}></textarea>
        </div>
      </div>
    `;
  }

  private _onCodeChange(e: Event) {
    this._code = (e.target as HTMLTextAreaElement).value;
  }

  private _handleInputKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._sendMessage();
    }
  }

  private _sendMessage() {
    const inputField = this.shadowRoot!.querySelector('#input-field') as HTMLInputElement;
    const message = inputField.value;
    if (message.trim() && this.sendMessageHandler) {
      this.sendMessageHandler(message, 'USER', this._code, false);
      inputField.value = '';
    }
  }

  public setCode(code: string) {
    this._code = code;
  }

  public getCode(): string {
    return this._code;
  }
}
