import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Mail, Lock, User, Phone, CheckCircle, ArrowRight } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
  onLoginSuccess: (user: Partial<UserProfile>) => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  
  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up Form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleRedirectUri = 'smartdrive://auth-callback';

  const getProfileData = async (authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown>; created_at: string }) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      throw new Error(`Profile could not be loaded: ${error.message}`);
    }

    const metadata = authUser.user_metadata || {};
    return {
      fullName: profile?.full_name || (typeof metadata.full_name === 'string' ? metadata.full_name : authUser.email?.split('@')[0] || 'SmartDrive Member'),
      email: authUser.email || '',
      phone: profile?.phone || (typeof metadata.phone === 'string' ? metadata.phone : ''),
      memberTier: typeof metadata.memberType === 'string' ? metadata.memberType : 'New Member',
    };
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      const authenticatedEmail = data.user?.email?.toLowerCase();

      // Supabase only returns a session for valid credentials belonging to an existing account.
      if (error || !data.session || !data.user || authenticatedEmail !== normalizedEmail) {
        Alert.alert(
          'Sign In Failed',
          'No matching account was found. Please sign up first or check your email and password.',
        );
        return;
      }

      try {
        const profile = await getProfileData(data.user);
        onLoginSuccess(profile);
      } catch (profileError) {
        Alert.alert('Profile Error', profileError instanceof Error ? profileError.message : 'Unable to load your profile.');
      }
    } catch (signInError) {
      Alert.alert('Sign In Error', signInError instanceof Error ? signInError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: googleRedirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data.url) {
        throw new Error(error?.message || 'Google sign in could not be started.');
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, googleRedirectUri);
      if (result.type !== 'success' || !result.url) {
        return;
      }

      const callbackUrl = new URL(result.url);
      const params = new URLSearchParams(callbackUrl.hash.replace(/^#/, ''));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (!accessToken || !refreshToken) {
        throw new Error('Google sign in did not return a valid session.');
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError || !sessionData.user) {
        throw new Error(sessionError?.message || 'Google account could not be signed in.');
      }

      const profile = await getProfileData(sessionData.user);
      onLoginSuccess(profile);
    } catch (googleError) {
      Alert.alert('Google Sign In Failed', googleError instanceof Error ? googleError.message : 'Unable to sign in with Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPhone.trim() || !signupPassword.trim() || !signupConfirmPassword.trim()) {
      Alert.alert('Required Fields', 'Please fill in all registration fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Passwords Do Not Match', 'Please make sure both password fields match.');
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPassword,
      options: {
        data: {
          full_name: signupName.trim(),
          phone: signupPhone.trim(),
          memberType: 'New Member',
          login_source: 'app',
        },
      },
    });
    if (error || !data.user) {
      setIsSubmitting(false);
      Alert.alert('Sign Up Failed', error?.message || 'Account could not be created.');
      return;
    }

    if (data.session) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: signupEmail.trim(),
        full_name: signupName.trim(),
        phone: signupPhone.trim(),
        created_at: data.user.created_at,
      }, { onConflict: 'id' });
      if (profileError) {
        setIsSubmitting(false);
        Alert.alert('Profile Error', `Account created, but profile could not be saved: ${profileError.message}`);
        return;
      }
      onLoginSuccess({
        fullName: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        memberTier: 'New Member',
      });
    } else {
      Alert.alert('Verify Your Email', 'Your account was created. Check your email to confirm the account, then sign in.');
      setTab('login');
      setEmail(signupEmail.trim());
      setPassword('');
    }
    setIsSubmitting(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        
        {/* Header Branding */}
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>SD</Text>
        </View>
        <Text style={styles.title}>SmartDrive<Text style={styles.brandColor}>™</Text></Text>
        <Text style={styles.subtitle}>Sign in or create your account to unlock VIP rates</Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
            onPress={() => setTab('login')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, tab === 'signup' && styles.tabBtnActive]}
            onPress={() => setTab('signup')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {tab === 'login' ? (
          /* LOGIN FORM */
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Mail size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.input} 
                  value={email} 
                  onChangeText={setEmail}
                  placeholder="name@smartdrive.io"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Lock size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.input} 
                  value={password} 
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={isSubmitting} activeOpacity={0.8}>
              <Text style={styles.submitBtnText}>{isSubmitting ? 'Signing in...' : 'Sign In to SmartDrive'}</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleAuth} disabled={isSubmitting} activeOpacity={0.8}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

          </View>
        ) : (
          /* SIGN UP FORM */
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrap}>
                <User size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.input} 
                  value={signupName} 
                  onChangeText={setSignupName}
                  placeholder="e.g. Maria Santos"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Mail size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.input} 
                  value={signupEmail} 
                  onChangeText={setSignupEmail}
                  placeholder="maria@example.ph"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrap}>
                <Phone size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.input} 
                  value={signupPhone} 
                  onChangeText={setSignupPhone}
                  placeholder="+63 917 123 4567"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Create Password</Text>
              <View style={styles.inputWrap}>
                <Lock size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.input} 
                  value={signupPassword} 
                  onChangeText={setSignupPassword}
                  placeholder="Minimum 8 characters"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrap}>
                <Lock size={18} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  value={signupConfirmPassword}
                  onChangeText={setSignupConfirmPassword}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSignup} disabled={isSubmitting} activeOpacity={0.8}>
              <Text style={styles.submitBtnText}>{isSubmitting ? 'Creating account...' : 'Create VIP Account'}</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleAuth} disabled={isSubmitting} activeOpacity={0.8}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleBtnText}>Sign up with Google</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5FC' },
  content: { padding: 18, paddingVertical: 28, justifyContent: 'center', minHeight: '100%' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6D28D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoBadgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  brandColor: { color: '#7C3AED' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 20 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#7C3AED', fontWeight: '800' },
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#FAF8FF',
  },
  input: { flex: 1, fontSize: 14, color: '#0F172A' },
  submitBtn: {
    backgroundColor: '#4C1D95',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    marginTop: 10,
  },
  submitBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  googleBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },
  googleIcon: { color: '#4285F4', fontWeight: '900', fontSize: 18 },
  googleBtnText: { color: '#334155', fontWeight: '800', fontSize: 14 },
  demoBtn: { paddingVertical: 11, alignItems: 'center', marginTop: 6, borderRadius: 12, backgroundColor: '#F3E8FF' },
  demoBtnText: { fontSize: 12, color: '#7C3AED', fontWeight: '700' },
});
