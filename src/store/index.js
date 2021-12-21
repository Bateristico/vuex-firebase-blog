import { createStore } from 'vuex';

// firebase imports
import { auth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const store = createStore({
  state: {
    user: null,
    authIsReady: false
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log('user state changed:', state.user);
    },
    setAuthIsReady(state, payload) {
      state.authIsReady = payload;
    }
  },
  actions: {
    async signup(context, { email, password }) {
      console.log('signup action');
      // async code
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log('res', res);
      if (res) {
        context.commit('setUser', res.user);
      } else {
        throw new Error('could not complete sign up');
      }
    },
    async login(context, { email, password }) {
      console.log('login action');
      // async code
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log('res', res);
      if (res) {
        context.commit('setUser', res.user);
      } else {
        throw new Error('could not complete login');
      }
    },
    async logout(context) {
      console.log('logout action');
      await signOut(auth);
      context.commit('setUser', null);
    }
  }
});

const unsub = onAuthStateChanged(auth, user => {
  store.commit('setAuthIsReady', true);
  store.commit('setUser', user);
  unsub();
});

export default store;
