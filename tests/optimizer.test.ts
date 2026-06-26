import { describe, it, expect } from 'vitest';

describe('PidController', () => {
  it('should compute output within bounds', async () => {
    const { PidController } = await import('../src/optimizer/index');
    const pid = new PidController(0.1, 0.01, 0.05, 0.5);
    const result = pid.compute(0.5);
    expect(result.output).toBeGreaterThanOrEqual(-0.5);
    expect(result.output).toBeLessThanOrEqual(0.5);
  });

  it('should give negative output when value above setpoint', async () => {
    const { PidController } = await import('../src/optimizer/index');
    const pid = new PidController(0.1, 0.01, 0.05, 0.5);
    const result = pid.compute(0.8);
    expect(result.output).toBeLessThan(0);
  });

  it('should give positive output when value below setpoint', async () => {
    const { PidController } = await import('../src/optimizer/index');
    const pid = new PidController(0.1, 0.01, 0.05, 0.5);
    const result = pid.compute(0.2);
    expect(result.output).toBeGreaterThan(0);
  });

  it('should clamp output between -0.5 and 0.5', async () => {
    const { PidController } = await import('../src/optimizer/index');
    const pid = new PidController(10, 10, 10, 0.5);
    const result = pid.compute(100);
    expect(result.clamped).toBe(true);
    expect(result.output).toBeGreaterThanOrEqual(-0.5);
    expect(result.output).toBeLessThanOrEqual(0.5);
  });
});

describe('optimizeCampaign', () => {
  it('should pause campaign when CTR is too low', async () => {
    const { PidController, optimizeCampaign } = await import('../src/optimizer/index');
    const config = { CPC_TARGET: 0.5, CPO_TARGET: 10, MIN_CTR_PERCENT: 0.5 };
    const pid = new PidController(0.1, 0.01, 0.05, 0.5);
    const result = optimizeCampaign(config, pid, {
      campaignId: 'c1', cpc: 0.5, ctr: 0.001, cpo: 5, conversions: 10, spend: 50, impressions: 2000,
    });
    expect(result.action).toBe('pause');
  });

  it('should not pause when impression count is below threshold', async () => {
    const { PidController, optimizeCampaign } = await import('../src/optimizer/index');
    const config = { CPC_TARGET: 0.5, CPO_TARGET: 10, MIN_CTR_PERCENT: 0.5 };
    const pid = new PidController(0.1, 0.01, 0.05, 0.5);
    const result = optimizeCampaign(config, pid, {
      campaignId: 'c1', cpc: 0.5, ctr: 0.001, cpo: 5, conversions: 10, spend: 50, impressions: 500,
    });
    expect(result.action).not.toBe('pause');
  });

  it('should return none when within acceptable range', async () => {
    const { PidController, optimizeCampaign } = await import('../src/optimizer/index');
    const config = { CPC_TARGET: 0.5, CPO_TARGET: 10, MIN_CTR_PERCENT: 0.5 };
    const pid = new PidController(0.1, 0.01, 0.05, 0.5);
    // Set the internal state to simulate stable condition
    const result = optimizeCampaign(config, pid, {
      campaignId: 'c1', cpc: 0.5, ctr: 0.05, cpo: 5, conversions: 10, spend: 50, impressions: 5000,
    });
    expect(result.action).toBe('none');
  });
});

describe('reallocateBudget', () => {
  it('should distribute more budget to better performing campaigns', async () => {
    const { reallocateBudget } = await import('../src/optimizer/index');
    const campaigns = [
      { campaignId: 'good', cpc: 0.3, ctr: 0.05, cpo: 5, conversions: 100, spend: 500, impressions: 10000 },
      { campaignId: 'bad', cpc: 1.0, ctr: 0.01, cpo: 50, conversions: 5, spend: 250, impressions: 5000 },
    ];
    const result = reallocateBudget(campaigns, 1000);
    expect(result.get('good')!).toBeGreaterThan(result.get('bad')!);
  });

  it('should handle empty campaigns', async () => {
    const { reallocateBudget } = await import('../src/optimizer/index');
    const result = reallocateBudget([], 1000);
    expect(result.size).toBe(0);
  });
});
