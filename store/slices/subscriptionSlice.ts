import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionState, SubscriptionPlan } from '@/types';
import { saveSubscription, loadSubscription } from '@/services/storage';

const DEFAULT_BROKER_LINK = 'https://example.com/broker-partner';

const initialState: SubscriptionState = {
  tier: 'free',
  plan: null,
  expiresAt: null,
  trialEndsAt: null,
  isTrialActive: false,
  hasBrokerOfferBeenShown: false,
  brokerLink: DEFAULT_BROKER_LINK,
  customOfferLink: null,
};

export const hydrateSubscription = createAsyncThunk('subscription/hydrate', async () => {
  const data = await loadSubscription();
  return data as SubscriptionState | null;
});

export const persistSubscription = createAsyncThunk(
  'subscription/persist',
  async (_, { getState }) => {
    const state = getState() as { subscription: SubscriptionState };
    await saveSubscription(state.subscription);
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    startFreeTrial(state) {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);
      state.tier = 'pro';
      state.isTrialActive = true;
      state.trialEndsAt = trialEnd.toISOString();
      state.expiresAt = trialEnd.toISOString();
    },
    subscribe(state, action: PayloadAction<SubscriptionPlan>) {
      const now = new Date();
      let expiresAt: Date;

      switch (action.payload) {
        case 'weekly':
          expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
          break;
        case 'yearly':
          expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
          break;
      }

      state.tier = 'pro';
      state.plan = action.payload;
      state.isTrialActive = false;
      state.expiresAt = expiresAt.toISOString();
    },
    cancelSubscription(state) {
      state.tier = 'free';
      state.plan = null;
      state.isTrialActive = false;
    },
    markBrokerOfferShown(state) {
      state.hasBrokerOfferBeenShown = true;
    },
    setBrokerLink(state, action: PayloadAction<string>) {
      state.brokerLink = action.payload;
    },
    setCustomOfferLink(state, action: PayloadAction<string | null>) {
      state.customOfferLink = action.payload;
    },
    checkExpiration(state) {
      if (state.expiresAt) {
        const now = new Date();
        const expires = new Date(state.expiresAt);
        if (now > expires) {
          state.tier = 'free';
          state.plan = null;
          state.isTrialActive = false;
          state.expiresAt = null;
          state.trialEndsAt = null;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateSubscription.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, { ...initialState, ...action.payload });
      }
    });
  },
});

export const {
  startFreeTrial,
  subscribe,
  cancelSubscription,
  markBrokerOfferShown,
  setBrokerLink,
  setCustomOfferLink,
  checkExpiration,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
