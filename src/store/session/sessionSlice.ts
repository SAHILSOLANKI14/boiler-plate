import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SessionState = {
  accessToken: string | null;
};

const initialState: SessionState = {
  accessToken: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionSet(state, action: PayloadAction<string>) {
      if (state.accessToken === action.payload) {
        return;
      }
      state.accessToken = action.payload;
    },
    sessionCleared(state) {
      if (state.accessToken === null) {
        return;
      }
      state.accessToken = null;
    },
  },
});

export const { sessionSet, sessionCleared } = sessionSlice.actions;

export function selectAccessToken(state: { session: SessionState }): string | null {
  return state.session.accessToken;
}

export default sessionSlice.reducer;
