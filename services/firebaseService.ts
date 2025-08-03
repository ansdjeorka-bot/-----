
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import type { Client, DayOfWeek } from '../types';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-NnHbjMa5Jve2Kls7m6RMPoic5PWm9es",
  authDomain: "visit-d8ae1.firebaseapp.com",
  projectId: "visit-d8ae1",
  storageBucket: "visit-d8ae1.appspot.com",
  messagingSenderId: "952792455477",
  appId: "1:952792455477:web:0d0f04b0e2d132c3bc947c",
  databaseURL: "https://visit-d8ae1-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
const db = firebase.database();

type ClientData = Omit<Client, 'id'>;

export const listenToClients = (
  userId: string,
  day: DayOfWeek, 
  callback: (clients: Client[]) => void,
  onError: (error: Error) => void
) => {
  const clientsRef = db.ref(`users/${userId}/clients/${day}`);
  const listener = clientsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const clientsList: Client[] = [];
    if (data) {
      for (const id in data) {
        clientsList.push({ id, ...data[id] });
      }
    }
    // 최신 데이터를 위로 보내기 위해 역순으로 정렬
    callback(clientsList.reverse());
  }, (error) => {
    console.error("Firebase read failed: ", error);
    onError(error);
  });

  // Return an unsubscribe function
  return () => clientsRef.off('value', listener);
};

export const addClient = (userId: string, day: DayOfWeek, client: ClientData) => {
  const clientsRef = db.ref(`users/${userId}/clients/${day}`);
  const newClientRef = clientsRef.push();
  return newClientRef.set(client);
};

export const updateClient = (userId: string, day: DayOfWeek, id: string, client: Client) => {
  const clientRef = db.ref(`users/${userId}/clients/${day}/${id}`);
  const { id: clientId, ...clientData } = client;
  return clientRef.set(clientData);
};

export const deleteClient = (userId: string, day: DayOfWeek, id: string) => {
  const clientRef = db.ref(`users/${userId}/clients/${day}/${id}`);
  return clientRef.remove();
};

// --- Auth Functions ---

export const signUpWithEmailAndPassword = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
};

export const signInWithEmailAndPassword = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
};

export const signOutUser = () => {
    return auth.signOut();
};

export const onAuthStateChangedListener = (callback: (user: firebase.User | null) => void) => {
    return auth.onAuthStateChanged(callback);
};
