const toolDispatcher = require('../tools');

async function handleVapiWebhook(req, res) {
  try {
    const { message } = req.body;

    if (!message || !message.type) {
      return res.status(200).json({});
    }

    switch (message.type) {
      case 'tool-calls':
        return handleToolCalls(message, res);

      case 'status-update':
        console.log(`[VAPI] Call status: ${message.status}`);
        return res.status(200).json({});

      case 'end-of-call-report':
        console.log(`[VAPI] Call ended. Duration: ${message.endedReason}`);
        return res.status(200).json({});

      default:
        return res.status(200).json({});
    }
  } catch (error) {
    console.error('[VAPI] Webhook error:', error);
    return res.status(200).json({});
  }
}

async function handleToolCalls(message, res) {
  const results = [];

  for (const toolCall of message.toolCallList || []) {
    const handler = toolDispatcher[toolCall.function?.name];

    if (!handler) {
      results.push({
        toolCallId: toolCall.id,
        result: JSON.stringify({ error: `Unknown tool: ${toolCall.function?.name}` }),
      });
      continue;
    }

    try {
      const result = await handler(toolCall.function?.arguments || {}, message.call);
      results.push({
        toolCallId: toolCall.id,
        result: typeof result === 'string' ? result : JSON.stringify(result),
      });
    } catch (error) {
      console.error(`[VAPI] Tool ${toolCall.function?.name} error:`, error);
      results.push({
        toolCallId: toolCall.id,
        result: JSON.stringify({ error: 'An error occurred processing your request.' }),
      });
    }
  }

  return res.status(200).json({ results });
}

module.exports = { handleVapiWebhook };
