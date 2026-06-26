export interface OptimizationResult {
  action: 'raise' | 'lower' | 'reallocate' | 'pause' | 'none';
  reason: string;
  bidAdjustment: number;
  budgetAdjustment: number;
}

export class PidController {
  private integral = 0;
  private previousError = 0;
  private lastTime: number;

  constructor(
    private kp: number,
    private ki: number,
    private kd: number,
    private setpoint: number
  ) {
    this.lastTime = Date.now();
  }

  compute(currentValue: number): { output: number; clamped: boolean } {
    const error = this.setpoint - currentValue;
    const now = Date.now();
    const dt = Math.max((now - this.lastTime) / 1000, 0.001);

    this.integral += error * dt;
    const derivative = (error - this.previousError) / dt;

    let output = this.kp * error + this.ki * this.integral + this.kd * derivative;
    const clamped = Math.abs(output) > 0.5;

    output = Math.max(-0.5, Math.min(0.5, output));

    this.previousError = error;
    this.lastTime = now;

    return { output, clamped };
  }

  reset(): void {
    this.integral = 0;
    this.previousError = 0;
    this.lastTime = Date.now();
  }
}

export interface CampaignMetrics {
  campaignId: string;
  cpc: number;
  ctr: number;
  cpo: number;
  conversions: number;
  spend: number;
  impressions: number;
}

export function optimizeCampaign(
  config: { CPC_TARGET: number; CPO_TARGET: number; MIN_CTR_PERCENT: number },
  controller: PidController,
  metrics: CampaignMetrics
): OptimizationResult {
  const { output, clamped } = controller.compute(metrics.cpc);

  if (metrics.impressions > 1000 && metrics.ctr < (config.MIN_CTR_PERCENT / 100)) {
    return { action: 'pause', reason: 'CTR too low', bidAdjustment: 0, budgetAdjustment: 0 };
  }

  if (clamped && output < 0) {
    return {
      action: 'lower',
      reason: `CPC ${metrics.cpc.toFixed(4)} significantly above target ${config.CPC_TARGET}`,
      bidAdjustment: output,
      budgetAdjustment: output * 0.5,
    };
  }

  if (Math.abs(output) < 0.01) {
    return { action: 'none', reason: 'Within acceptable range', bidAdjustment: 0, budgetAdjustment: 0 };
  }

  if (output > 0) {
    return {
      action: 'raise',
      reason: `CPC ${metrics.cpc.toFixed(4)} below target ${config.CPC_TARGET}`,
      bidAdjustment: output,
      budgetAdjustment: output * 0.5,
    };
  }

  return {
    action: 'lower',
    reason: `CPC ${metrics.cpc.toFixed(4)} above target ${config.CPC_TARGET}`,
    bidAdjustment: output,
    budgetAdjustment: output * 0.5,
  };
}

export function reallocateBudget(
  campaigns: CampaignMetrics[],
  totalBudget: number
): Map<string, number> {
  const allocation = new Map<string, number>();

  const active = campaigns.filter(c => c.impressions > 0 && c.conversions >= 0);
  if (active.length === 0) {
    const equalShare = totalBudget / Math.max(campaigns.length, 1);
    campaigns.forEach(c => allocation.set(c.campaignId, equalShare));
    return allocation;
  }

  const inverseCpo = active.map(c => ({
    id: c.campaignId,
    weight: Math.max(1 / (c.cpo + 0.01), 0.01),
  }));

  const totalWeight = inverseCpo.reduce((sum, c) => sum + c.weight, 0);

  for (const c of campaigns) {
    const weight = inverseCpo.find(i => i.id === c.campaignId)?.weight ?? 1;
    const share = (weight / totalWeight) * totalBudget;
    allocation.set(c.campaignId, Math.round(share * 100) / 100);
  }

  return allocation;
}
