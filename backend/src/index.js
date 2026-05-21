const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

const prisma = new PrismaClient();

// Updated endpoint with pagination, field selection, and total count
app.get('/api/missions', async (req, res) => {
  console.log('--- GET /api/missions called ---');
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  try {
    // Get total mission count for metadata
    const total = await prisma.mission.count();

    // Fetch missions with limited fields and related data (logs removed to reduce payload)
    const missions = await prisma.mission.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        launchDate: true,
        rocket: true,
        crew: {
          select: {
            id: true,
            name: true,
            role: true,
            nationality: true,
          },
        },
        // logs removed to reduce payload size
      },
    });
    console.log('Executed 2 database queries for this request (count + findMany)');
    res.json({ missions, total, page, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
