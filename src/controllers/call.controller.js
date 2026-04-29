const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function getCallDetails(req, res) {
  const { callId } = req.params;

  if (!callId) {
    return res.status(400).json({ error: 'callId is required' });
  }

  if (!VAPI_API_KEY) {
    return res.status(500).json({ error: 'VAPI_API_KEY not configured' });
  }

  try {
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: { Authorization: `Bearer ${VAPI_API_KEY}` },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch call from Vapi' });
    }

    const call = await response.json();

    res.json({
      callId: call.id,
      status: call.status,
      duration: call.duration,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      recordingUrl: call.recordingUrl || null,
      transcript: call.transcript || null,
      summary: call.summary || null,
      analysis: call.analysis || null,
    });
  } catch (error) {
    console.error('Error fetching Vapi call details:', error);
    res.status(500).json({ error: 'Failed to fetch call details' });
  }
}

module.exports = { getCallDetails };
