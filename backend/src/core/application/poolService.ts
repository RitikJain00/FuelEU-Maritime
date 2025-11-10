// core/application/poolService.ts
import { prisma } from "../../lib/prisma"

interface PoolMemberInput {
  shipId: string
  cb_before: number
}

export class PoolService {
  async getShips(year: number) {
    // Fetch ships with adjusted CB
    const ships = await prisma.shipCompliance.findMany({
      where: { year },
      select: {
        ship_id: true,
        cb_gco2eq: true,
      },
    })

    // Map to frontend-friendly format
    return ships.map((s) => ({
      shipId: s.ship_id,
      adjustedCB: s.cb_gco2eq, // for simplicity, use CB as adjustedCB
    }))
  }

  async createPool(year: number, members: PoolMemberInput[]) {
    if (members.length === 0) throw new Error("No members selected");
  
    // Sum of CB
    const totalCB = members.reduce((sum, m) => sum + m.cb_before, 0);
    if (totalCB < 0) throw new Error("Pool sum must be >= 0");
  
    // Fetch ShipCompliance IDs for members
    const compliances = await prisma.shipCompliance.findMany({
      where: {
        ship_id: { in: members.map((m) => m.shipId) },
        year,
      },
    });
  
    if (compliances.length !== members.length) {
      throw new Error("Some selected ships do not have compliance data for this year");
    }
  
    // Map members to include ship_compliance_id
    const membersData = members.map((m) => {
      const compliance = compliances.find((c) => c.ship_id === m.shipId);
      if (!compliance) throw new Error(`ShipCompliance not found for ${m.shipId}`);
      return {
        ship_id: m.shipId,
        ship_compliance_id: compliance.id,
        cb_before: m.cb_before,
        cb_after: m.cb_before, // initially same as before
      };
    });
  
    // Create Pool
    const pool = await prisma.pool.create({
      data: {
        year,
        total_cb_gco2eq: totalCB,
        members: {
          create: membersData,
        },
      },
      include: { members: true },
    });
  
    return pool;
  }
  
}
