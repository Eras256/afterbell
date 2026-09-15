import { XSTOCKS } from './stocks.js';

/**
 * Team's own after-hours basket -- equal-weight across all 5 xStocks.
 * Capital is the team's own (see README: "No administramos fondos de
 * terceros"), so an equal-weight starting point is a defensible default
 * for a day-1 demo, not a curated thesis.
 */
export const BASKET_TARGET_WEIGHTS: Record<keyof typeof XSTOCKS, number> = {
  AAPLx: 0.2,
  TSLAx: 0.2,
  GOOGLx: 0.2,
  NVDAx: 0.2,
  AMZNx: 0.2,
};
