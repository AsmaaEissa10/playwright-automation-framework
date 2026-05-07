import { test as base } from '@playwright/test';
import { PoManager } from '../pages/PoManager';

type Fixtures = {
  po: PoManager;
};

export const test = base.extend<Fixtures>({
  po: async ({ page }, use) => {
    const po = new PoManager(page);
    await use(po);
  },
});

export const expect = test.expect;
