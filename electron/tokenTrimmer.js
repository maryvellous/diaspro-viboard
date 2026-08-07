class TokenTrimmer {
  static estimateTokenCount(text) {
    if (!text) return 0;
    // Simple heuristic: ~4 chars per token for English/Italian mixed text
    return Math.ceil(text.length / 4);
  }

  static trimMessages(messages, maxTokens = 6000) {
    if (!messages || messages.length <= 4) return messages;

    let currentTokens = 0;
    const trimmed = [];

    // Keep System / Welcome message if present at start
    const systemOrWelcome = messages.find(m => m.id === 'welcome' || m.role === 'system');
    if (systemOrWelcome) {
      trimmed.push(systemOrWelcome);
      currentTokens += this.estimateTokenCount(systemOrWelcome.content);
    }

    // Traverse from latest to oldest
    const reverseSlice = [...messages].reverse().filter(m => m.id !== 'welcome' && m.role !== 'system');
    const acceptedReversed = [];

    for (const msg of reverseSlice) {
      const msgTokens = this.estimateTokenCount(msg.content);
      if (currentTokens + msgTokens > maxTokens) {
        break;
      }
      acceptedReversed.push(msg);
      currentTokens += msgTokens;
    }

    // Re-order chronologically
    acceptedReversed.reverse();

    if (systemOrWelcome) {
      return [systemOrWelcome, ...acceptedReversed];
    }
    return acceptedReversed;
  }
}

module.exports = TokenTrimmer;
