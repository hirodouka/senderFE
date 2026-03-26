// Pricing calculations for PakiShip

import { VehicleType, DeliveryMode, ServiceOption } from "../config/businessRules";

export interface PricingBreakdown {
  basePrice: number;
  distanceFee: number;
  sizeFee: number;
  urgencyFee: number;
  specialHandlingFee: number;
  volumeDiscount: number;
  relayDiscount: number;
  surgeFee: number;
  subtotal: number;
  platformFee: number;
  finalTotal: number;
}

export interface PricingParams {
  distanceKm: number;
  packageSize?: "small" | "medium" | "large" | "xl";
  vehicleType: VehicleType;
  deliveryMode: DeliveryMode;
  serviceOption: ServiceOption;
  totalParcels?: number;
  isSurge?: boolean;
  hops?: number;
  applyDiscount?: boolean;
  isUrgent?: boolean;
  requiresSpecialHandling?: boolean;
}

export function calculatePricing(params: PricingParams): PricingBreakdown {
  const {
    distanceKm,
    packageSize = "small",
    vehicleType,
    deliveryMode,
    serviceOption,
    totalParcels = 1,
    isSurge = false,
    hops = 0,
    applyDiscount = false,
    isUrgent = false,
    requiresSpecialHandling = false,
  } = params;

  // Base pricing by vehicle type
  const basePrices: Record<VehicleType, number> = {
    [VehicleType.MOTORCYCLE]: 50,
    [VehicleType.SEDAN]: 120,
    [VehicleType.PUV_RELAY]: 35,
  };

  const basePrice = basePrices[vehicleType];

  // Distance fee calculation
  const distanceFee = distanceKm * (vehicleType === VehicleType.MOTORCYCLE ? 8 : 12);

  // Size fee
  const sizeFees: Record<string, number> = {
    small: 0,
    medium: 20,
    large: 50,
    xl: 100,
  };
  const sizeFee = sizeFees[packageSize];

  // Urgency fee for fast service
  const urgencyFee = serviceOption === ServiceOption.FAST || isUrgent ? 30 : 0;

  // Special handling fee
  const specialHandlingFee = requiresSpecialHandling ? 25 : 0;

  // Volume discount (10+ parcels)
  const volumeDiscount = applyDiscount && totalParcels >= 10 ? -50 : 0;

  // Relay discount
  const relayDiscount = deliveryMode === DeliveryMode.RELAY ? -30 : 0;

  // Surge pricing
  const subtotalBeforeSurge = basePrice + distanceFee + sizeFee + urgencyFee + specialHandlingFee + volumeDiscount + relayDiscount;
  const surgeFee = isSurge ? subtotalBeforeSurge * 0.2 : 0;

  const subtotal = subtotalBeforeSurge + surgeFee;

  // Platform fee (5%)
  const platformFee = subtotal * 0.05;

  const finalTotal = subtotal + platformFee;

  return {
    basePrice,
    distanceFee,
    sizeFee,
    urgencyFee,
    specialHandlingFee,
    volumeDiscount,
    relayDiscount,
    surgeFee,
    subtotal,
    platformFee,
    finalTotal,
  };
}
