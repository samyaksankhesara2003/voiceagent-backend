exports.seed = async function (knex) {
  // Clear existing data in reverse dependency order
  await knex('ehr_records').del();
  await knex('calendar_events').del();
  await knex('crm_leads').del();
  await knex('intake_records').del();
  await knex('appointments').del();
  await knex('patients').del();
  await knex('availabilities').del();
  await knex('doctors').del();

  // Insert doctors
  const doctors = await knex('doctors').insert([
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'General Dentistry',
      bio: 'Experienced general dentist specializing in preventive care and routine dental procedures.',
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Orthodontics',
      bio: 'Specialist in braces, aligners, and bite correction with over 10 years of experience.',
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Oral Surgery',
      bio: 'Specialist in tooth extractions, wisdom teeth removal, and oral surgical procedures.',
    },
  ]);

  // Get inserted doctor IDs
  const doctorRows = await knex('doctors').select('id');
  const doctorIds = doctorRows.map((d) => d.id);

  // Generate availability slots for the next 14 weekdays
  const slots = [];
  const today = new Date();
  let daysAdded = 0;
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

  while (daysAdded < 14) {
    const dayOfWeek = currentDate.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = currentDate.toISOString().split('T')[0];

      for (const doctorId of doctorIds) {
        // Generate 30-minute slots from 09:00 to 17:00
        for (let hour = 9; hour < 17; hour++) {
          for (let min = 0; min < 60; min += 30) {
            const startTime = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
            const endHour = min === 30 ? hour + 1 : hour;
            const endMin = min === 30 ? 0 : 30;
            const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

            slots.push({
              doctor_id: doctorId,
              date: dateStr,
              start_time: startTime,
              end_time: endTime,
              is_booked: false,
            });
          }
        }
      }
      daysAdded++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Insert in batches of 500 to avoid MySQL packet size limits
  const batchSize = 500;
  for (let i = 0; i < slots.length; i += batchSize) {
    await knex('availabilities').insert(slots.slice(i, i + batchSize));
  }

  console.log(`Seeded ${doctorIds.length} doctors and ${slots.length} availability slots`);
};
