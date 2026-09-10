import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Calendar, CreditCard, Wallet, Smartphone, CheckCircle2, ArrowRight, ShieldCheck, QrCode } from 'lucide-react-native';
import { VehicleItem } from '../constants/vehicles';
import { UserProfile, BookingRecord } from '../types';

interface BookingFlowScreenProps {
  vehicle: VehicleItem;
  user: UserProfile;
  existingBookings: BookingRecord[];
  onFinishBooking: (booking: BookingRecord) => void;
  onBackToLobby: () => void;
}

function toDateInputValue(date: Date) {
  return date.toISOString().split('T')[0];
}

function getDefaultBookingDates() {
  const pickup = new Date();
  pickup.setHours(0, 0, 0, 0);
  pickup.setDate(pickup.getDate() + 1);
  const returnDate = new Date(pickup);
  returnDate.setDate(returnDate.getDate() + 3);
  return {
    pickupDate: toDateInputValue(pickup),
    returnDate: toDateInputValue(returnDate),
  };
}

export function BookingFlowScreen({ vehicle, user, existingBookings, onFinishBooking, onBackToLobby }: BookingFlowScreenProps) {
  // Step 1: Calendar | Step 2: Information | Step 3: Payment | Step 4: Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Calendar State
  const defaultDates = getDefaultBookingDates();
  const [pickupDate, setPickupDate] = useState(defaultDates.pickupDate);
  const [returnDate, setReturnDate] = useState(defaultDates.returnDate);
  const [days, setDays] = useState(3);

  // Renter Information
  const [renterName, setRenterName] = useState(user.fullName);
  const [renterEmail, setRenterEmail] = useState(user.email);
  const [renterPhone, setRenterPhone] = useState(user.phone);
  const [licenseId, setLicenseId] = useState('N02-18-984210');
  const [cardHolder, setCardHolder] = useState(user.fullName);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gcash' | 'maya' | 'wallet'>('wallet');

  // Pricing Math
  const subtotal = vehicle.price * days;
  const discount = existingBookings.length === 0 ? Math.round(subtotal * 0.15) : 0;
  const insurance = 500;
  const grandTotal = subtotal + insurance - discount;

  // Generated Booking ID
  const [generatedRef, setGeneratedRef] = useState('SD-' + Math.floor(100000 + Math.random() * 900000));

  const handleProceedPayment = () => {
    const pickup = new Date(`${pickupDate}T00:00:00`);
    const returnDateValue = new Date(`${returnDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(pickup.getTime()) || Number.isNaN(returnDateValue.getTime()) || pickup < today) {
      Alert.alert('Invalid pickup date', 'Pickup date cannot be in the past.');
      return;
    }
    if (returnDateValue <= pickup) {
      Alert.alert('Invalid rental period', 'Return date must be after the pickup date.');
      return;
    }
    if (!renterName.trim() || !renterEmail.trim() || !renterPhone.trim() || !licenseId.trim()) {
      Alert.alert('Missing renter details', 'Please complete your name, email, phone number, and license ID before paying.');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Terms required', 'Please review and accept the terms and conditions before paying.');
      return;
    }
    if (paymentMethod === 'wallet' && user.walletBalance < grandTotal) {
      Alert.alert(
        'Insufficient SR Wallet Balance',
        `Your SR Wallet has ₱${user.walletBalance.toLocaleString()}, but total is ₱${grandTotal.toLocaleString()}. Please choose Card, GCash, or Maya.`
      );
      return;
    }
    if (paymentMethod === 'card') {
      const digits = cardNumber.replace(/\s/g, '');
      if (!cardHolder.trim() || digits.length !== 16 || !/^\d+$/.test(digits) || !/^\d{2}\/\d{2}$/.test(expiryDate) || !/^\d{3,4}$/.test(cvv)) {
        Alert.alert('Invalid card details', 'Enter the cardholder name, 16-digit card number, expiry in MM/YY format, and a valid CVV.');
        return;
      }
    }
    if ((paymentMethod === 'gcash' || paymentMethod === 'maya') && (!paymentReference.trim() || !renterName.trim() || !renterPhone.trim() || !licenseId.trim())) {
      Alert.alert(`Missing ${paymentMethod === 'maya' ? 'Maya' : 'GCash'} details`, `Please fill in the ${paymentMethod === 'maya' ? 'Maya' : 'GCash'} reference number and all customer details to continue.`);
      return;
    }

    setIsProcessing(true);
    const newBooking: BookingRecord = {
      id: generatedRef,
      vehicleName: vehicle.name,
      pickupDate,
      returnDate,
      days,
      totalAmount: grandTotal,
      paymentMethod: paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'gcash' ? 'GCash' : paymentMethod === 'maya' ? 'Maya' : 'SR Digital Cash Wallet',
      status: 'Confirmed'
    };

    setTimeout(() => {
      onFinishBooking(newBooking);
      setIsProcessing(false);
      setStep(4);
    }, 700);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      {/* STEP INDICATOR */}
      <View style={styles.stepBar}>
        <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 1 && styles.stepNumActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 2 && styles.stepNumActive]}>2</Text>
        </View>
        <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
        <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 3 && styles.stepNumActive]}>3</Text>
        </View>
        <View style={[styles.stepLine, step >= 4 && styles.stepLineActive]} />
        <View style={[styles.stepDot, step >= 4 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 4 && styles.stepNumActive]}>4</Text>
        </View>
      </View>

      {/* ================= STEP 1: CALENDAR SELECTION ================= */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.stepTitle}>Step 1: Calendar & Rental Period</Text>
          <Text style={styles.stepSub}>Choose pickup and return dates for {vehicle.name}</Text>

          <View style={styles.dateSelector}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>Pickup Date</Text>
              <View style={styles.dateBox}>
                <Calendar size={16} color="#7C3AED" />
                <TextInput style={styles.dateInput} value={pickupDate} onChangeText={setPickupDate} />
              </View>
            </View>

            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>Return Date</Text>
              <View style={styles.dateBox}>
                <Calendar size={16} color="#7C3AED" />
                <TextInput style={styles.dateInput} value={returnDate} onChangeText={setReturnDate} />
              </View>
            </View>
          </View>

          {/* DURATION PILLS */}
          <Text style={styles.pickerLabel}>Quick Duration (Days)</Text>
          <View style={styles.durationRow}>
            {[1, 2, 3, 5, 7].map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.durationPill, days === d && styles.durationPillActive]}
                onPress={() => setDays(d)}
              >
                <Text style={[styles.durationPillText, days === d && styles.durationPillTextActive]}>
                  {d} {d === 1 ? 'Day' : 'Days'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PRICE ESTIMATE BOX */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Daily Rate (₱{vehicle.price.toLocaleString()} × {days} days)</Text>
              <Text style={styles.summaryVal}>₱{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Comprehensive Insurance</Text>
              <Text style={styles.summaryVal}>₱{insurance.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#16A34A' }]}>VIP 15% Auto-Discount</Text>
              <Text style={[styles.summaryVal, { color: '#16A34A' }]}>-₱{discount.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalVal}>₱{grandTotal.toLocaleString()}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
            <Text style={styles.nextBtnText}>Continue to Renter Details</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* ================= STEP 2: RENTER INFORMATION ================= */}
      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.stepTitle}>Step 2: Driver & Contact Information</Text>
          <Text style={styles.stepSub}>Required for vehicle release and verification</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Legal Name</Text>
            <TextInput style={styles.input} value={renterName} onChangeText={setRenterName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email</Text>
            <TextInput style={styles.input} value={renterEmail} onChangeText={setRenterEmail} keyboardType="email-address" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Phone</Text>
            <TextInput style={styles.input} value={renterPhone} onChangeText={setRenterPhone} keyboardType="phone-pad" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Driver's License Number (LTO)</Text>
            <TextInput style={styles.input} value={licenseId} onChangeText={setLicenseId} autoCapitalize="characters" />
          </View>

          <View style={styles.btnNavRow}>
            <TouchableOpacity style={styles.backStepBtn} onPress={() => setStep(1)}>
              <Text style={styles.backStepText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextStepBtn} onPress={() => setStep(3)}>
              <Text style={styles.nextBtnText}>Select Payment Method</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ================= STEP 3: PAYMENT METHOD ================= */}
      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.stepTitle}>Step 3: Select Payment Method</Text>
          <Text style={styles.stepSub}>Choose how you wish to settle ₱{grandTotal.toLocaleString()}</Text>

          {/* SR DIGITAL WALLET */}
          <TouchableOpacity 
            style={[styles.payOption, paymentMethod === 'wallet' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('wallet')}
            activeOpacity={0.8}
          >
            <View style={styles.payIconBox}>
              <Wallet size={20} color="#6D28D9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payName}>SR Digital Cash Wallet</Text>
              <Text style={styles.payBalance}>Available: ₱{user.walletBalance.toLocaleString()}</Text>
            </View>
            {paymentMethod === 'wallet' && <CheckCircle2 size={18} color="#7C3AED" />}
          </TouchableOpacity>

          {/* GCASH */}
          <TouchableOpacity 
            style={[styles.payOption, paymentMethod === 'gcash' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('gcash')}
            activeOpacity={0.8}
          >
            <View style={[styles.payIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Smartphone size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payName}>GCash E-Wallet</Text>
              <Text style={styles.paySub}>Instant QR / Mobile Number authorization</Text>
            </View>
            {paymentMethod === 'gcash' && <CheckCircle2 size={18} color="#A21CAF" />}
          </TouchableOpacity>

          {/* CARD */}
          <TouchableOpacity
            style={[styles.payOption, paymentMethod === 'maya' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('maya')}
            activeOpacity={0.8}
          >
            <View style={[styles.payIconBox, { backgroundColor: '#FFF7ED' }]}>
              <Smartphone size={20} color="#F97316" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payName}>Maya E-Wallet</Text>
              <Text style={styles.paySub}>Secure mobile wallet authorization</Text>
            </View>
            {paymentMethod === 'maya' && <CheckCircle2 size={18} color="#A21CAF" />}
          </TouchableOpacity>

          {/* CARD */}
          <TouchableOpacity 
            style={[styles.payOption, paymentMethod === 'card' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.8}
          >
            <View style={[styles.payIconBox, { backgroundColor: '#F1F5F9' }]}>
              <CreditCard size={20} color="#0F172A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payName}>Credit / Debit Card</Text>
              <Text style={styles.paySub}>Visa, Mastercard, JCB</Text>
            </View>
            {paymentMethod === 'card' && <CheckCircle2 size={18} color="#7C3AED" />}
          </TouchableOpacity>

          {paymentMethod === 'card' && (
             <View style={styles.paymentDetails}>
               <Text style={styles.paymentDetailsTitle}>Card details</Text>
               <TextInput style={styles.input} value={cardHolder} onChangeText={setCardHolder} placeholder="Cardholder name" />
               <TextInput style={styles.input} value={cardNumber} onChangeText={setCardNumber} keyboardType="number-pad" placeholder="16-digit card number" maxLength={19} />
               <View style={styles.paymentFieldRow}>
                 <TextInput style={[styles.input, styles.paymentHalfInput]} value={expiryDate} onChangeText={setExpiryDate} keyboardType="number-pad" placeholder="MM/YY" maxLength={5} />
                 <TextInput style={[styles.input, styles.paymentHalfInput]} value={cvv} onChangeText={setCvv} keyboardType="number-pad" placeholder="CVV" secureTextEntry maxLength={4} />
               </View>
             </View>
          )}
          {(paymentMethod === 'gcash' || paymentMethod === 'maya') && (
             <View style={styles.paymentDetails}>
               <Text style={styles.paymentDetailsTitle}>{paymentMethod === 'maya' ? 'Maya' : 'GCash'} payment details</Text>
               <Text style={styles.paymentHint}>Complete authorization in your wallet app, then enter the reference number shown on the receipt.</Text>
               <TextInput style={styles.input} value={paymentReference} onChangeText={setPaymentReference} placeholder="Payment reference number" autoCapitalize="characters" />
             </View>
          )}

          <TouchableOpacity style={styles.termsRow} onPress={() => setTermsAccepted(current => !current)} activeOpacity={0.8}>
             <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>{termsAccepted && <Text style={styles.checkboxTick}>✓</Text>}</View>
             <Text style={styles.termsText}>I agree to the rental terms, cancellation policy, and payment authorization.</Text>
          </TouchableOpacity>

          <View style={styles.btnNavRow}>
            <TouchableOpacity style={styles.backStepBtn} onPress={() => setStep(2)}>
              <Text style={styles.backStepText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmPayBtn} onPress={handleProceedPayment} disabled={isProcessing} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>{isProcessing ? 'Processing payment...' : `Authorize & Pay ₱${grandTotal.toLocaleString()}`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ================= STEP 4: CONFIRMATION ================= */}
      {step === 4 && (
        <View style={styles.confirmedCard}>
          <View style={styles.confIconCircle}>
            <CheckCircle2 size={44} color="#16A34A" />
          </View>

          <Text style={styles.confTitle}>Booking Confirmed! 🎉</Text>
          <Text style={styles.confSub}>Your reservation voucher has been generated.</Text>

          <View style={styles.voucherBox}>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Booking Reference</Text>
              <Text style={styles.voucherRef}>{generatedRef}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Vehicle</Text>
              <Text style={styles.voucherVal}>{vehicle.name}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Rental Period</Text>
              <Text style={styles.voucherVal}>{pickupDate} to {returnDate} ({days} Days)</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Payment Settled</Text>
              <Text style={styles.voucherVal}>₱{grandTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Method</Text>
              <Text style={styles.voucherVal}>
                {paymentMethod === 'wallet' ? 'SR Digital Wallet' : paymentMethod === 'gcash' ? 'GCash' : paymentMethod === 'maya' ? 'Maya' : 'Credit Card'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onBackToLobby} activeOpacity={0.8}>
            <Text style={styles.doneBtnText}>Return to Lobby Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5FC' },
  content: { padding: 16, paddingBottom: 40 },
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECE8F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: '#7C3AED' },
  stepNum: { fontSize: 12, fontWeight: '800', color: '#6B6384' },
  stepNumActive: { color: '#FFFFFF' },
  stepLine: { width: 32, height: 3, backgroundColor: '#E3DDF2' },
  stepLineActive: { backgroundColor: '#7C3AED' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3DDF2',
    shadowColor: '#4C1D95',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  stepTitle: { fontSize: 17, lineHeight: 22, fontWeight: '900', color: '#1C1430' },
  stepSub: { fontSize: 11, lineHeight: 16, color: '#6B6384', marginTop: 3, marginBottom: 16 },
  dateSelector: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  dateCol: { flex: 1 },
  dateLabel: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E3DDF2',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#F7F5FC',
  },
  dateInput: { flex: 1, fontSize: 13, color: '#0F172A', fontWeight: '600' },
  pickerLabel: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 8 },
  durationRow: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  durationPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ECE8F7',
    alignItems: 'center',
  },
  durationPillActive: { backgroundColor: '#7C3AED' },
  durationPillText: { fontSize: 12, fontWeight: '700', color: '#6B6384' },
  durationPillTextActive: { color: '#FFFFFF' },
  summaryBox: {
    backgroundColor: '#FAE8FF',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { flex: 1, paddingRight: 8, fontSize: 11, color: '#475569' },
  summaryVal: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  divider: { height: 1, backgroundColor: '#E9D5FF', marginVertical: 4 },
  totalLabel: { fontSize: 14, fontWeight: '900', color: '#0F172A' },
  totalVal: { fontSize: 18, fontWeight: '900', color: '#6D28D9' },
  nextBtn: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  nextBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E3DDF2',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F7F5FC',
  },
  btnNavRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  backStepBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#ECE8F7',
    alignItems: 'center',
  },
  backStepText: { color: '#475569', fontWeight: '800', fontSize: 13 },
  nextStepBtn: {
    flex: 2,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E3DDF2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  payOptionActive: { borderColor: '#7C3AED', backgroundColor: '#EDE9FE' },
  payIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payName: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  payBalance: { fontSize: 12, fontWeight: '700', color: '#16A34A', marginTop: 2 },
  paySub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  paymentDetails: { backgroundColor: '#FAF8FF', borderRadius: 14, padding: 12, marginBottom: 10, gap: 9, borderWidth: 1, borderColor: '#E9D5FF' },
  paymentDetailsTitle: { color: '#4C1D95', fontSize: 12, fontWeight: '900' },
  paymentHint: { color: '#64748B', fontSize: 10, lineHeight: 15 },
  paymentFieldRow: { flexDirection: 'row', gap: 8 },
  paymentHalfInput: { flex: 1 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 4, marginBottom: 5 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: '#C4B5FD', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  checkboxTick: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  termsText: { flex: 1, color: '#475569', fontSize: 10, lineHeight: 14 },
  confirmPayBtn: {
    flex: 2.2,
    backgroundColor: '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  confirmedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  confIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  confSub: { fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 20, textAlign: 'center' },
  voucherBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  voucherRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voucherLabel: { fontSize: 12, color: '#64748B' },
  voucherRef: { fontSize: 14, fontWeight: '900', color: '#6D28D9' },
  voucherVal: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  doneBtn: {
    width: '100%',
    backgroundColor: '#6D28D9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
});
