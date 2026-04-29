const CrmLead = require('../models/CrmLead');

async function getLeads(req, res) {
  try {
    const leads = await CrmLead.query()
      .withGraphFetched('[patient]')
      .orderBy('created_at', 'desc');

    res.json({ leads });
  } catch (error) {
    console.error('Error fetching CRM leads:', error);
    res.status(500).json({ error: 'Failed to fetch CRM leads' });
  }
}

module.exports = { getLeads };
