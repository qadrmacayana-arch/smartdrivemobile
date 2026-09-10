import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eykggdvyxbmtgyhwoguu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5a2dnZHZ5eGJtdGd5aHdvZ3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTUyNjIsImV4cCI6MjEwNDI3MTI2Mn0.2yAfhGx5kxqF6UQlAUrhFWrq8maX-7iN52ckvgokhSU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
