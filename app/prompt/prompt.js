import { encode } from 'gpt-3-encoder';
import config from '../../config/index.js';
import { t } from '../../locales/index.js';
import { ROLE_AI, ROLE_HUMAN, ROLE_SYSTEM } from '../../services/openai.js';
import Message from './message.js';

const MAX_MESSAGES = config.APP_MAX_PROMPT_MESSAGES;
const MAX_TOKENS = config.APP_MAX_PROMPT_TOKENS;

class Prompt {
  messages = [];

  constructor() {
    this
      .write(ROLE_SYSTEM, `${t('__COMPLETION_DEFAULT_SYSTEM_PROMPT')}`)
      .write(ROLE_HUMAN, `${t('__COMPLETION_DEFAULT_HUMAN_PROMPT')(config.HUMAN_NAME)}${config.HUMAN_INIT_PROMPT}。`)
      .write(ROLE_AI, `${t('__COMPLETION_DEFAULT_AI_PROMPT')(config.BOT_NAME)}${config.BOT_INIT_PROMPT}。`);
  }

  /**
   * @returns {Message}
   */
  get lastMessage() {
    return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
  }

  get tokenCount() {
    const encoded = encode(this.toString());
    return encoded.length;
  }

  erase() {
    if (this.messages.length > 0) {
      this.messages.pop();
    }
    return this;
  }

  /**
   * @param {string} role
   * @param {string} content
   */
  write(role, content = '') {
    if (this.messages.length >= MAX_MESSAGES || this.tokenCount >= MAX_TOKENS) {
      this.messages.splice(2, 1);
    }
    this.messages.push(new Message({ role, content }));
    return this;
  }

  /**
   * @param {string} content
   */
  patch(content) {
    this.messages[this.messages.length - 1].content += content;
  }

  toString() {
    return this.messages.map((sentence) => sentence.toString()).join('');
  }
}

export default Prompt;
