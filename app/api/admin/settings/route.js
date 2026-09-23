export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { requireAdmin } from '@/lib/apiAuth';
import { calculateShipping } from '@/lib/calculateShipping';

export async function GET() {
  await dbConnect();
  let settings = await Settings.findOne({ key: 'global' });
  if (!settings) settings = await Settings.create({ key: 'global' });
  return NextResponse.json({ settings });
}

export const PUT = requireAdmin(async (req) => {
  await dbConnect();
  const body = await req.json();
  const settings = await Settings.findOneAndUpdate({ key: 'global' }, body, { new: true, upsert: true });
  return NextResponse.json({ settings });
});

// POST /api/admin/settings — used by checkout to preview shipping.
// Body: { subtotal, totalQty }
//   subtotal — cart subtotal (after discount) in ₹, checked against the
//              free-shipping threshold.
//   totalQty — total number of pieces in the cart (sum of each line's qty),
//              used to compute the order's total weight.
//
// Uses the same calculateShipping() helper as lib/orderCalc.js so the
// number shown here always matches what Razorpay actually charges.
export async function POST(req) {
  try {
    const { subtotal, totalQty } = await req.json();

    await dbConnect();
    const settings = await Settings.findOne({ key: 'global' });
    if (!settings) {
      return NextResponse.json({ error: 'Settings not configured' }, { status: 500 });
    }

    const result = calculateShipping(settings, { subtotal, totalQty });

    return NextResponse.json({
      shippingCost: result.shippingCost,
      freeShippingAbove: settings.freeShippingAbove,
      weightPerPiece: settings.weightPerPiece,
      pricePerKg: settings.pricePerKg,
      defaultShippingCharge: settings.defaultShippingCharge,
      totalWeightGrams: result.totalWeightGrams,
      billableKg: result.billableKg,
      usedFallback: result.usedFallback,
    });
  } catch (err) {
    console.error('Shipping calculate error:', err);
    return NextResponse.json({ error: 'Could not calculate shipping' }, { status: 500 });
  }
}