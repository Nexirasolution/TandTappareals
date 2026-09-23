// Single source of truth for shipping cost. Used by both the checkout-page
// preview (/api/admin/settings POST) and order/payment creation
// (lib/orderCalc.js) so they can never drift out of sync with each other.
//
// settings: the Settings mongoose document (or plain object) — needs
//   weightPerPiece, pricePerKg, freeShippingAbove, defaultShippingCharge.
// { subtotal, totalQty }: subtotal in ₹ (after discount) and total piece
//   count across the cart.
export function calculateShipping(settings, { subtotal, totalQty }) {
  const weightPerPiece = settings.weightPerPiece || 0;
  const pricePerKg = settings.pricePerKg || 0;
  const freeShippingAbove = settings.freeShippingAbove ?? Infinity;
  const defaultShippingCharge = settings.defaultShippingCharge || 0;

  const qty = Number(totalQty) || 0;
  const weightConfigured = weightPerPiece > 0 && pricePerKg > 0;

  let billableKg = 0;
  let totalWeightGrams = 0;
  let weightBasedCost;

  if (weightConfigured) {
    // Total order weight = piece count × weight per piece (grams) → kg,
    // rounded UP to the next whole kg since couriers bill by whole-kg slabs.
    totalWeightGrams = qty * weightPerPiece;
    const totalWeightKg = totalWeightGrams / 1000;
    billableKg = qty > 0 ? Math.max(1, Math.ceil(totalWeightKg)) : 0;
    weightBasedCost = billableKg * pricePerKg;
  } else {
    weightBasedCost = defaultShippingCharge;
  }

  const shippingCost = subtotal >= freeShippingAbove ? 0 : weightBasedCost;

  return {
    shippingCost,
    totalWeightGrams,
    billableKg,
    usedFallback: !weightConfigured,
  };
}