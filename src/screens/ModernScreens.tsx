import React, { useState } from 'react';
import {
  Calendar,
  Car,
  CheckCircle2,
  Compass,
  Headphones,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Search,
  Star,
  Wallet,
  HelpCircle,
  Gift,
  Settings,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Target,
  Users,
  MessageCircle,
  RefreshCw,
  Info,
  Bell,
  Lock,
  Trash2,
  Save,
  Percent,
  UserPlus,
  Star as StarIcon,
  Trophy,
  Share2,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FLEET_VEHICLES, VehicleItem } from '../constants/vehicles';
import { BookingRecord, UserProfile } from '../types';
import { Colors } from '../constants/colors';
import { VehicleImage } from '../components/VehicleImage';
import { supabase } from '../lib/supabase';

const PURPLE = Colors.primary;

interface HomeScreenProps {
  user: UserProfile;
  bookings: BookingRecord[];
  vehicles: VehicleItem[];
  onBrowseFleet: () => void;
  onViewVehicle: (vehicle: VehicleItem) => void;
  onOpenWallet: () => void;
}

export function HomeScreen({ user, bookings, vehicles, onBrowseFleet, onViewVehicle, onOpenWallet }: HomeScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#4C1D95', '#7C3AED', '#A21CAF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.homeHero}>
        <View style={styles.heroCopy}>
          <Text style={styles.homeEyebrow}>SMARTDRIVE MOBILITY ✨</Text>
          <Text style={styles.homeHeroTitle}>Drive More.{'\n'}Worry Less.</Text>
          <Text style={styles.homeHeroSub}>Instant verified rentals with 20% PWD discount and 24/7 emergency roadside support.</Text>
          <TouchableOpacity style={styles.homeHeroButton} onPress={onBrowseFleet}>
            <Text style={styles.homeHeroButtonText}>Browse Fleet →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.homeSearchBar}>
        <Search size={16} color="#94A3B8" />
        <Text style={styles.homeSearchPlaceholder}>Search Tesla, Scooters, RV...</Text>
      </View>

      <View style={styles.homeFeatureStrip}>
        <View style={styles.homeFeatureHeader}>
          <View>
            <Text style={styles.homeFeatureTitle}>Why choose SmartDrive?</Text>
            <Text style={styles.homeFeatureSub}>A seamless ride from booking to return.</Text>
          </View>
          <Sparkles size={17} color="#A21CAF" />
        </View>
        <View style={styles.homeFeatureRow}>
          <View style={styles.homeFeatureItem}><ShieldCheck size={17} color="#7C3AED" /><Text style={styles.homeFeatureItemText}>Fully{'\n'}insured</Text></View>
          <View style={styles.homeFeatureItem}><Headphones size={17} color="#C026D3" /><Text style={styles.homeFeatureItemText}>24/7{'\n'}support</Text></View>
          <View style={styles.homeFeatureItem}><Star size={17} color="#F59E0B" /><Text style={styles.homeFeatureItemText}>Premium{'\n'}fleet</Text></View>
        </View>
      </View>

      <View style={styles.homeSectionHeader}>
        <View><Text style={styles.homeSectionTitle}>Featured fleet</Text><Text style={styles.homeSectionSub}>Handpicked rides for your next journey</Text></View>
        <TouchableOpacity onPress={onBrowseFleet}><Text style={styles.homeSeeAll}>See All (12)</Text></TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.homeFleetCarousel}
      >
        {(vehicles.length > 0 ? vehicles : FLEET_VEHICLES).slice(0, 3).map((vehicle) => (
          <TouchableOpacity key={vehicle.id} style={styles.homeVehicleCard} onPress={() => onViewVehicle(vehicle)}>
            <VehicleImage uri={vehicle.image} style={styles.homeVehicleImage} label={vehicle.name} />
            <View style={styles.homeVehicleBody}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.homeVehicleCategory}>{vehicle.category}</Text>
                <Text style={styles.homeVehicleName} numberOfLines={2}>{vehicle.name}</Text>
                <Text style={styles.homeVehiclePrice}>₱{vehicle.price.toLocaleString()} <Text style={styles.perDay}>/day</Text></Text>
              </View>
              <View style={styles.vehicleAction}>
                <TouchableOpacity style={styles.homeStarButton} onPress={() => onViewVehicle(vehicle)} hitSlop={6}>
                  <Star size={17} color="#F59E0B" fill="#F59E0B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.homeBookButton} onPress={() => onViewVehicle(vehicle)} activeOpacity={0.8}>
                  <Text style={styles.homeBookNow}>Book Now</Text>
                  <ArrowRight size={12} color="#FFFFFF" strokeWidth={3} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {bookings[0] && <View style={styles.tripNotice}><CheckCircle2 size={18} color="#10B981" /><Text style={styles.tripText}>Active trip: {bookings[0].vehicleName}</Text></View>}
    </ScrollView>
  );
}

export function AboutScreen({ onBrowseFleet }: { onBrowseFleet: () => void }) {
  const highlights = [
    ['🎯 Our Mission', 'To provide accessible, affordable, and reliable vehicle rentals that help travelers explore the Philippines with confidence and comfort.', Target],
    ['💡 Our Vision', 'To become the Philippines’ most trusted and innovative vehicle rental platform through exceptional value and customer service.', MessageCircle],
    ['🌱 Our Values', 'Integrity, quality, innovation, customer focus, safety, sustainability, and lasting community relationships guide every decision.', RefreshCw],
  ] as const;
  const benefits = [
    ['🛡️ Fully Insured', 'Comprehensive coverage for peace of mind on every trip.', ShieldCheck],
    ['💬 24/7 Support', 'Our customer service team is available whenever you need help.', Headphones],
    ['✨ Premium Fleet', 'Well-maintained vehicles for every budget and adventure.', Star],
    ['⚡ Easy Booking', 'Pick a vehicle, select your dates, and get moving in minutes.', CheckCircle2],
    ['💜 Transparent Pricing', 'Straightforward pricing with no hidden fees.', Wallet],
    ['📍 Nationwide Coverage', 'Locations across major Philippine cities.', Compass],
  ] as const;
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <LinearGradient colors={[Colors.plum, Colors.violet, Colors.accent]} style={styles.aboutHero}>
      <Text style={styles.eyebrow}>SMARTDRIVE MOBILITY</Text>
      <Text style={styles.aboutHeroTitle}>About SmartDrive™</Text>
      <Text style={styles.aboutHeroText}>Redefining vehicle rental experiences across the Philippines with innovation, reliability, and exceptional customer service.</Text>
    </LinearGradient>

    <View style={styles.aboutGrid}>
      {highlights.map(([title, description, Icon]) => <View key={title} style={styles.aboutCard}>
        <View style={styles.aboutIcon}><Icon size={21} color={PURPLE} /></View>
        <Text style={styles.aboutCardTitle}>{title}</Text>
        <Text style={styles.aboutCardText}>{description}</Text>
      </View>)}
    </View>

    <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>📖 Our Story</Text><Text style={styles.sectionKicker}>Made for better journeys</Text></View>
    <View style={styles.storyCard}>
      <Text style={styles.storyLead}>Every great trip starts with the right ride.</Text>
      <Text style={styles.aboutBody}>SmartDrive was developed in February 2026 with a single vision: to revolutionize the vehicle rental industry in the Philippines.</Text>
      <Text style={styles.aboutBody}>Our team saw a need for a rental service that combines affordability, reliability, and exceptional customer experiences. SmartDrive was built to solve those challenges and exceed expectations.</Text>
      <Text style={styles.aboutBody}>Our growing fleet spans major cities including Manila, Cebu, Davao, and Cagayan de Oro—from economical motorcycles to premium SUVs for every journey.</Text>
      <Text style={styles.aboutBody}>With transparent pricing, comprehensive insurance, flexible booking options, and 24/7 support, SmartDrive puts customers first.</Text>
    </View>

    <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>🤝 Contact Us</Text><Text style={styles.sectionKicker}>We’re always happy to help</Text></View>
    <View style={styles.contactGrid}>
      {[
        ['Our Address', 'Near Technological Institute of the Philippines, Quezon City', MapPin],
        ['Phone Number', '(+63) 917 123 4567', Phone],
        ['Email Address', 'contact@smartdrive.com', Mail],
      ].map(([title, value, Icon]) => <View key={title as string} style={styles.contactCard}>
        <Icon size={20} color={PURPLE} /><Text style={styles.contactTitle}>{title as string}</Text><Text style={styles.contactText}>{value as string}</Text>
      </View>)}
    </View>

    <View style={styles.teamCard}>
      <Users size={26} color={PURPLE} />
      <Text style={styles.teamTitle}>Built by Tech Innovators 🚀</Text>
      <Text style={styles.aboutBody}>SmartDrive was developed by students and developers from the Technological Institute of the Philippines, Quezon City Campus, using modern web and mobile technologies.</Text>
    </View>

    <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>💜 Why Choose SmartDrive?</Text><Text style={styles.sectionKicker}>Your comfort comes first</Text></View>
    <View style={styles.aboutGrid}>
      {benefits.map(([title, description, Icon]) => <View key={title} style={styles.aboutCard}>
        <View style={styles.aboutIcon}><Icon size={19} color={PURPLE} /></View>
        <Text style={styles.aboutCardTitle}>{title}</Text>
        <Text style={styles.aboutCardText}>{description}</Text>
      </View>)}
    </View>

    <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>📊 By The Numbers</Text><Text style={styles.sectionKicker}>Growing with every journey</Text></View>
    <View style={styles.statsGrid}>
      {[['500+', 'Vehicles in Fleet'], ['50K+', 'Happy Customers'], ['6+', 'Major Cities'], ['4.9★', 'Customer Rating']].map(([value, label]) => <View key={label} style={styles.statCard}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>)}
    </View>

    <View style={styles.aboutCta}>
      <Text style={styles.aboutCtaTitle}>Ready to Start Your Journey? 🛣️</Text>
      <Text style={styles.aboutCtaText}>Experience the SmartDrive difference and find the perfect vehicle for your next adventure.</Text>
      <TouchableOpacity style={styles.heroButton} onPress={onBrowseFleet}><Text style={styles.heroButtonText}>Browse Our Fleet →</Text></TouchableOpacity>
    </View>
  </ScrollView>;
}

export function DashboardScreen({ user, bookings, onNavigate, onBrowseFleet }: { user: UserProfile; bookings: BookingRecord[]; onNavigate: (screen: string) => void; onBrowseFleet: () => void }) {
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const totalSpent = bookings.reduce((total, booking) => total + booking.totalAmount, 0);
  const hoursDriven = bookings.reduce((total, booking) => total + booking.days * 8, 0);
  const loyaltyPoints = Math.round(totalSpent * 0.1);
  const hasActivity = bookings.length > 0;
  const submitDashboardReview = async () => {
    if (!satisfaction) {
      setReviewMessage('Please select an emoji rating first.');
      return;
    }
    setIsSubmittingReview(true);
    setReviewMessage('');
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error('Please sign in before submitting a review.');
      }
      const customerName = user.fullName || authData.user.email?.split('@')[0] || 'SmartDrive Customer';
      const { error } = await supabase.from('reviews').insert({
        user_id: authData.user.id,
        customer_email: user.email || authData.user.email || '',
        customer_name: customerName,
        rating: satisfaction,
        comment: reviewComment.trim() || null,
      });
      if (error) throw new Error(error.message);
      setSatisfaction(null);
      setReviewComment('');
      setReviewMessage('Thanks! Your rating and comment were sent to SmartDrive.');
    } catch (error) {
      setReviewMessage(error instanceof Error ? error.message : 'We could not save your review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <LinearGradient colors={[Colors.plum, Colors.violet, Colors.accent]} style={styles.dashboardHero}>
      <Text style={styles.eyebrow}>SMARTDRIVE MEMBER AREA</Text>
      <Text style={styles.dashboardWelcome}>Welcome back, {user.fullName.split(' ')[0]}! 👋</Text>
      <Text style={styles.dashboardHeroText}>Here’s what’s happening with your account today.</Text>
    </LinearGradient>
    {bookings.length === 0 && <View style={styles.welcomeBanner}><Text style={styles.welcomeTitle}>🎉 Welcome aboard!</Text><Text style={styles.welcomeText}>Enjoy an exclusive 15% OFF your first rental. Your offer will be applied automatically when you book.</Text></View>}
    {bookings[0] && <View style={styles.activeTrip}><View style={styles.rowBetween}><Text style={styles.cardEyebrow}>YOUR CURRENT RIDE 🚘</Text><View style={styles.activeBadge}><Text style={styles.activeBadgeText}>CONFIRMED</Text></View></View><Text style={styles.tripVehicle}>{bookings[0].vehicleName}</Text><Text style={styles.tripMeta}>{bookings[0].pickupDate} → {bookings[0].returnDate}</Text><View style={styles.rentalProgressTrack}><View style={styles.rentalProgressFill} /></View><Text style={styles.tierSub}>{bookings[0].days} rental days • ₱{bookings[0].totalAmount.toLocaleString()}</Text></View>}
    <View style={styles.statsGrid}>
      {[['ACTIVE BOOKINGS', bookings.length.toString(), Calendar], ['TOTAL SPENT', `₱${totalSpent.toLocaleString()}`, Wallet], ['HOURS DRIVEN', hoursDriven.toString(), Compass]].map(([label, value, Icon]) => <View key={label as string} style={styles.dashboardStat}><Icon size={16} color={PURPLE} /><Text style={styles.dashboardStatLabel}>{label as string}</Text><Text style={styles.dashboardStatValue}>{value as string}</Text></View>)}
    </View>
    <View style={styles.tierCard}><View style={styles.rowBetween}><View><Text style={styles.cardEyebrow}>LOYALTY TIER ✨</Text><Text style={styles.tierName}>{hasActivity ? user.memberTier : 'New Member'}</Text></View><Text style={styles.tierPoints}>{loyaltyPoints.toLocaleString()} pts</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, !hasActivity && { width: '0%' }]} /></View><Text style={styles.tierSub}>{hasActivity ? 'Keep renting to unlock higher rewards.' : 'Complete your first booking to start earning loyalty points.'}</Text></View>
    <View style={styles.activityHeader}><View><Text style={styles.sectionTitle}>Recent Activity</Text><Text style={styles.sectionSubtitle}>Your latest bookings and transactions</Text></View><TouchableOpacity onPress={() => onNavigate('bookings')}><Text style={styles.viewAll}>View All →</Text></TouchableOpacity></View>
    {hasActivity ? bookings.slice(0, 3).map((booking) => <View key={booking.id} style={styles.activityCard}><View style={styles.activityIcon}><Calendar size={16} color={PURPLE} /></View><View style={styles.flex}><Text style={styles.activityTitle}>{booking.vehicleName}</Text><Text style={styles.activityText}>{booking.pickupDate} → {booking.returnDate}</Text></View><View style={styles.activityRight}><Text style={styles.activityAmount}>₱{booking.totalAmount.toLocaleString()}</Text><Text style={styles.bookingStatus}>{booking.status}</Text></View></View>) : <View style={styles.emptyActivity}><Text style={styles.emptyTitle}>No recent activity</Text><Text style={styles.emptySub}>Your bookings and wallet earnings will appear here.</Text></View>}
    <View style={styles.satisfactionCard}>
      <View style={styles.satisfactionHeading}>
        <View style={styles.satisfactionIcon}><MessageCircle size={16} color={PURPLE} /></View>
        <View style={styles.satisfactionHeadingCopy}>
          <Text style={styles.satisfactionTitle}>How was your experience?</Text>
          <Text style={styles.satisfactionText}>Your feedback helps us improve SmartDrive.</Text>
        </View>
      </View>
      <View style={styles.satisfactionScale}>
        {[
          ['😡', 1],
          ['😞', 2],
          ['😐', 3],
          ['😊', 4],
          ['😁', 5],
        ].map(([emoji, value]) => (
          <TouchableOpacity
            key={value as number}
            style={[styles.satisfactionButton, satisfaction === value && styles.satisfactionButtonActive]}
            onPress={() => setSatisfaction(value as number)}
            accessibilityLabel={['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'][(value as number) - 1]}
          >
            <Text style={styles.satisfactionEmoji}>{emoji as string}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.satisfactionFeedback}>
        {satisfaction ? ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'][satisfaction - 1] : 'Choose a rating'}
      </Text>
      <View style={styles.dashboardCommentHeader}>
        <Text style={styles.dashboardCommentLabel}>Add a comment <Text style={styles.dashboardCommentOptional}>Optional</Text></Text>
        <Text style={styles.dashboardCommentCount}>{reviewComment.length}/1000</Text>
      </View>
      <TextInput
        value={reviewComment}
        onChangeText={setReviewComment}
        placeholder="Tell us what you liked or what we can improve..."
        placeholderTextColor="#94A3B8"
        multiline
        maxLength={1000}
        style={styles.dashboardReviewInput}
      />
      <TouchableOpacity style={styles.dashboardReviewButton} onPress={submitDashboardReview} disabled={isSubmittingReview}>
        <Text style={styles.dashboardReviewButtonText}>{isSubmittingReview ? 'Saving your review...' : 'Submit Review'}</Text>
      </TouchableOpacity>
      {reviewMessage ? <Text style={styles.dashboardReviewMessage}>{reviewMessage}</Text> : null}
    </View>
    <LinearGradient colors={[Colors.primaryDark, Colors.plum]} style={styles.dashboardCta}><Text style={styles.dashboardCtaTitle}>Need a ride for your next adventure? 🚗</Text><Text style={styles.dashboardCtaText}>Choose from our premium fleet of electric and luxury vehicles.</Text><TouchableOpacity style={styles.heroButton} onPress={onBrowseFleet}><Text style={styles.heroButtonText}>Book New Vehicle</Text></TouchableOpacity></LinearGradient>
    <View style={styles.dashboardNavDivider} />
    <Text style={styles.dashboardNavTitle}>Quick access</Text>
    <View style={styles.dashboardNav}>
      {[
        ['My Bookings', 'bookings', Calendar],
        ['About', 'about', Info],
        ['FAQs', 'faqs', HelpCircle],
        ['Offers', 'offers', Gift],
        ['SR Wallet', 'wallet', Wallet],
        ['Log Out', 'logout', LogOut],
      ].map(([label, screen, Icon]) => (
        <TouchableOpacity key={label as string} style={styles.dashboardNavItem} onPress={() => onNavigate(screen as string)}>
          <View style={styles.dashboardNavIcon}><Icon size={17} color={screen === 'logout' ? '#DC2626' : PURPLE} /></View>
          <Text style={[styles.dashboardNavText, screen === 'logout' && styles.logoutNavText]}>{label as string}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>;
}

export function DashboardSubScreen({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.pageTitle}>{title}</Text>
    <Text style={styles.pageSub}>{subtitle}</Text>
    {children}
  </ScrollView>;
}

export function BookingsScreen({ bookings }: { bookings: BookingRecord[] }) {
  return <DashboardSubScreen title="My bookings" subtitle="Track your reservations and rental history.">
    {bookings.map(booking => <View key={booking.id} style={styles.subCard}><Text style={styles.subCardTitle}>{booking.vehicleName}</Text><Text style={styles.subCardText}>{booking.pickupDate} → {booking.returnDate} • {booking.days} days</Text><Text style={styles.bookingStatus}>{booking.status}</Text></View>)}
  </DashboardSubScreen>;
}

export function FaqScreen() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([{ sender: 'Assistant', text: 'Hi! I am the SmartDrive assistant. Ask me about vehicles, bookings, payments, or policies.' }]);
  const faqEntries = [
    ['How do I reserve a vehicle?', 'Open Rent, choose a vehicle and dates, then complete the checkout steps.'],
    ['What documents do I need?', 'Bring a valid driver license and the documents shown in your booking details.'],
    ['What payment methods can I use?', 'We accept major cards, GCash, Maya, and SR Wallet. Payment options appear during checkout.'],
    ['Can I cancel a booking?', 'Cancellations are accepted up to 24 hours before pickup; fees may apply.'],
    ['How does SR Wallet work?', 'SR Wallet credits are earned automatically when you confirm a booking. You earn 5% of the booking total and can use the balance toward future SmartDrive reservations.'],
  ];

  const answerQuestion = () => {
    const query = question.trim();
    if (!query) return;
    const normalized = query.toLowerCase();
    let answer = 'I can help with SmartDrive rentals, vehicles, bookings, payments, cancellations, pickup, returns, and support. What would you like to know?';
    if (normalized.includes('book') || normalized.includes('reserv')) answer = 'To book a vehicle, open Rent, choose your vehicle and dates, then complete checkout.';
    else if (normalized.includes('pay') || normalized.includes('gcash') || normalized.includes('maya') || normalized.includes('card')) answer = 'We accept major cards, GCash, Maya, and SR Wallet. Available payment methods appear during checkout.';
    else if (normalized.includes('cancel') || normalized.includes('refund')) answer = 'Cancellations are accepted up to 24 hours before pickup, although fees may apply.';
    else if (normalized.includes('history') || normalized.includes('my booking')) answer = 'Open Dashboard and choose My Bookings to view upcoming and past reservations.';
    else if (normalized.includes('vehicle') || normalized.includes('car') || normalized.includes('available')) answer = 'Browse available vehicles on the Rent page. Availability and pricing depend on your selected dates.';
    else if (normalized.includes('hello') || normalized.includes('hi')) answer = 'Hello! I can help with vehicles, bookings, payments, and SmartDrive policies.';
    setMessages((current) => [...current, { sender: 'You', text: query }, { sender: 'Assistant', text: answer }]);
    setQuestion('');
  };

  return <DashboardSubScreen title="FAQs" subtitle="Quick answers and help for your SmartDrive journey.">
    {faqEntries.map(([title, text], index) => <View key={title} style={styles.subCard}><Text style={styles.subCardTitle}>{index + 1}. {title}</Text><Text style={styles.subCardText}>{text}</Text></View>)}
    <View style={styles.chatCard}>
      <View style={styles.chatHeader}><View style={styles.chatTitleWrap}><MessageCircle size={18} color="#FFFFFF" /><Text style={styles.chatTitle}>AI Assistant</Text></View><TouchableOpacity onPress={() => setMessages([{ sender: 'Assistant', text: 'Conversation cleared. What can I help you with today?' }])}><Text style={styles.chatClear}>Clear</Text></TouchableOpacity></View>
      <View style={styles.chatBody}>{messages.map((message, index) => <View key={`${message.sender}-${index}`} style={styles.chatMessage}><Text style={styles.chatSender}>{message.sender}</Text><Text style={[styles.chatBubble, message.sender === 'You' && styles.chatUserBubble]}>{message.text}</Text></View>)}</View>
      <View style={styles.chatInputRow}><TextInput value={question} onChangeText={setQuestion} onSubmitEditing={answerQuestion} placeholder="Ask about bookings, payments, or policies..." placeholderTextColor="#94A3B8" style={styles.chatInput} returnKeyType="send" /><TouchableOpacity style={styles.chatSend} onPress={answerQuestion}><Text style={styles.chatSendText}>Send</Text></TouchableOpacity></View>
    </View>
  </DashboardSubScreen>;
}

export function OffersScreen() {
  const [promoCode, setPromoCode] = useState('');
  const [validatedCode, setValidatedCode] = useState('');
  const promotions = [
    { tag: 'NEW MEMBERS', title: '15% OFF Your First Ride', description: 'Welcome to SmartDrive! Enjoy a special discount on your first booking.', code: 'WELCOME15', footer: 'Code: WELCOME15' },
    { tag: 'PREMIUM MEMBERS', title: 'Free Upgrade', description: 'As a thank you to our loyal premium members, enjoy a complimentary upgrade.', code: 'PREMIUMUP', footer: 'Status: VIP members' },
    { tag: 'FLASH SALE', title: 'Luxury Car Flash Deal', description: 'Rent a luxury vehicle mid-week and get up to 30% off.', code: 'LUXURY30', footer: 'Tue-Thu Only' },
    { tag: 'WEEKEND DEAL', title: 'Weekend SUV Special', description: 'Planning a weekend getaway? Save on 3-day SUV rentals.', code: 'SUV3DAY', footer: 'Valid: Fri-Sun' },
  ];
  const rewards = [
    { icon: UserPlus, title: 'Refer a Friend', reward: '+15%', description: 'Share your unique code with friends and earn ₱500 discount per successful referral.', steps: ['Invite at least 1 friend', 'Friend makes their first booking'], progress: '0/2 Complete', value: 0 },
    { icon: StarIcon, title: 'Leave a Review', reward: '+10%', description: 'Share your experience and get a 10% discount on your next booking.', steps: ['Complete a booking', 'Leave a 5-star review'], progress: '0/2 Complete', value: 0 },
    { icon: Trophy, title: 'Loyalty Milestone', reward: '+12%', description: 'Reach ₱5,000 lifetime spending and unlock an exclusive discount code.', steps: ['Spend ₱5,000'], progress: '0/1 Complete', value: 0 },
    { icon: Share2, title: 'Share on Social Media', reward: '+8%', description: 'Share SmartDrive on social and get an extra 8% off your next rental.', steps: ['Follow our social media account', 'Share a booking screenshot'], progress: '0/2 Complete', value: 0 },
    { icon: ClipboardCheck, title: 'Weekend Warrior', reward: '+15%', description: 'Book 3 weekend rentals and earn a 15% weekend-only discount code.', steps: ['Complete 3 weekend bookings'], progress: '0/1 Complete', value: 0 },
    { icon: Gift, title: 'Go Premium', reward: '+20%', description: 'Spend ₱10,000 and unlock premium status with exclusive 20% discounts.', steps: ['Spend ₱10,000', 'Complete 5 bookings'], progress: '0/2 Complete', value: 0 },
  ];
  const validatePromo = () => {
    const match = promotions.find((promo) => promo.code.toLowerCase() === promoCode.trim().toLowerCase());
    if (!match) {
      Alert.alert('Invalid promo code', 'Please check the code and try again.');
      return;
    }
    setValidatedCode(match.code);
    Alert.alert('Promo code unlocked', `${match.code} is ready to use during checkout.`);
  };

  return <DashboardSubScreen title="Offers & Promos" subtitle="Take advantage of special promotions to get the best value on your next rental.">
    <View style={styles.offersIntro}><Percent size={24} color="#A855F7" /><Text style={[styles.offersIntroTitle, styles.offerFontBold, styles.offerTitleMobile]}>Exclusive Offers & Promos</Text><Text style={[styles.offersIntroText, styles.offerFont, styles.offerBodyMobile]}>Save more on your next SmartDrive journey with member-only deals.</Text></View>
    <View style={styles.promoGrid}>{promotions.map((promo) => <View key={promo.code} style={styles.promoCard}><Text style={[styles.promoTag, styles.offerFontBold]}>{promo.tag}</Text><Text style={[styles.promoTitle, styles.offerFontBold]}>{promo.title}</Text><Text style={[styles.promoDescription, styles.offerFont]}>{promo.description}</Text><View style={styles.promoDivider} /><View style={styles.promoFooter}><Text style={[styles.promoCode, styles.offerFont]}>{promo.footer}</Text><TouchableOpacity style={styles.promoButton} onPress={() => { setPromoCode(promo.code); Alert.alert('Offer selected', `${promo.code} has been added to your promo field.`); }}><Text style={[styles.promoButtonText, styles.offerFontBold]}>Book Now</Text></TouchableOpacity></View></View>)}</View>
    <View style={styles.rewardsHeading}><Text style={[styles.rewardsTitle, styles.offerFontBold, styles.offerTitleMobile]}>🎁 Claimable Rewards</Text><Text style={[styles.rewardsSubtitle, styles.offerFont, styles.offerBodyMobile]}>Complete tasks and meet requirements to unlock exclusive discount codes.</Text></View>
    <View style={styles.rewardsGrid}>{rewards.map((reward) => { const RewardIcon = reward.icon; return <View key={reward.title} style={styles.rewardCard}><View style={styles.rewardTop}><View style={styles.rewardName}><RewardIcon size={14} color="#7C3AED" /><Text style={[styles.rewardTitle, styles.offerFontBold]}>{reward.title}</Text></View><Text style={[styles.rewardPercent, styles.offerFontBold]}>{reward.reward}</Text></View><Text style={[styles.rewardDescription, styles.offerFont]}>{reward.description}</Text>{reward.steps.map((step) => <Text key={step} style={[styles.rewardStep, styles.offerFont]}>◉  {step}</Text>)}<View style={styles.rewardProgressTrack}><View style={[styles.rewardProgressFill, { width: `${reward.value * 100}%` }]} /></View><Text style={[styles.progressText, styles.offerFontBold]}>{reward.progress}</Text></View>; })}</View>
    <Text style={[styles.codesTitle, styles.offerFontBold]}>Your Loyalty Discount Codes</Text><Text style={[styles.codesSubtitle, styles.offerFont]}>Unlock codes based on your spending and membership level.</Text>
    <View style={styles.promoEntry}><Text style={styles.promoEntryLabel}>Enter Promo Code</Text><View style={styles.promoEntryRow}><TextInput value={promoCode} onChangeText={setPromoCode} placeholder="ENTER YOUR PROMO CODE" placeholderTextColor="#94A3B8" autoCapitalize="characters" style={styles.promoInput} /><TouchableOpacity style={styles.validateButton} onPress={validatePromo}><Text style={styles.validateButtonText}>Validate Code</Text></TouchableOpacity></View>{validatedCode ? <Text style={styles.validatedText}>✓ {validatedCode} is ready for your next booking.</Text> : null}</View>
    <Text style={[styles.codesTitle, styles.offerFontBold]}>Your Available Codes</Text>
  </DashboardSubScreen>;
}

export function SettingsScreen({ user, onSave, onDelete }: { user: UserProfile; onSave: (updates: Partial<UserProfile>) => void; onDelete: () => void }) {
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requestNotifications = async (enabled: boolean) => {
    if (!enabled) {
      setNotificationsEnabled(false);
      return;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === Notifications.PermissionStatus.GRANTED) {
      setNotificationsEnabled(true);
    } else {
      Alert.alert('Permission needed', 'Allow notifications in your phone settings to receive booking updates.');
    }
  };

  const saveProfile = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Missing information', 'Please complete your name, email, and phone number.');
      return;
    }
    onSave({ fullName: name.trim(), email: email.trim(), phone: phone.trim() });
    Alert.alert('Profile updated', 'Your SmartDrive credentials have been saved.');
  };

  const deleteAccount = () => {
    Alert.alert('Delete account?', 'This permanently removes your profile and booking access.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete account', style: 'destructive', onPress: onDelete },
    ]);
  };

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing information', 'Enter your current password, new password, and confirmation.');
      return;
    }
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      Alert.alert('Password not secure', 'Use at least 8 characters with an uppercase letter, lowercase letter, and number.');
      return;
    }
    if (newPassword === oldPassword) {
      Alert.alert('Choose a new password', 'Your new password must be different from your current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Make sure your new password and confirmation are exactly the same.');
      return;
    }
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Password updated', 'Your password has been changed successfully. Keep it private and do not reuse it on other websites.');
  };

  return <DashboardSubScreen title="Settings" subtitle="Manage your account and notifications.">
    <View style={styles.settingsCard}>
      <View style={styles.settingsHeading}><Settings size={19} color={PURPLE} /><Text style={styles.settingsTitle}>Account & profile</Text></View>
      <Text style={styles.settingsLabel}>Full name</Text><TextInput value={name} onChangeText={setName} style={styles.settingsInput} />
      <Text style={styles.settingsLabel}>Email address</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.settingsInput} />
      <Text style={styles.settingsLabel}>Phone number</Text><TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.settingsInput} />
      <TouchableOpacity style={styles.settingsPrimaryButton} onPress={saveProfile}><Save size={16} color="#FFFFFF" /><Text style={styles.settingsPrimaryText}>Save changes</Text></TouchableOpacity>
    </View>
    <View style={styles.settingsCard}>
      <View style={styles.settingsHeading}><Bell size={19} color={PURPLE} /><Text style={styles.settingsTitle}>Notifications</Text></View>
      <View style={styles.settingsRow}><View style={styles.flex}><Text style={styles.settingsRowTitle}>Booking updates</Text><Text style={styles.settingsRowSub}>Receive reminders and reservation status alerts.</Text></View><Switch value={notificationsEnabled} onValueChange={requestNotifications} trackColor={{ false: '#DDD6FE', true: '#C084FC' }} thumbColor={notificationsEnabled ? PURPLE : '#FFFFFF'} /></View>
    </View>
    <View style={styles.settingsCard}>
      <View style={styles.settingsHeading}><Lock size={19} color={PURPLE} /><Text style={styles.settingsTitle}>Security</Text></View>
      <Text style={styles.settingsRowSub}>Use a unique password to help protect your account. It must contain at least 8 characters, including uppercase and lowercase letters and a number.</Text>
      <Text style={styles.settingsLabel}>Current password</Text>
      <TextInput value={oldPassword} onChangeText={setOldPassword} secureTextEntry autoCapitalize="none" style={styles.settingsInput} />
      <Text style={styles.settingsLabel}>New password</Text>
      <TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry autoCapitalize="none" style={styles.settingsInput} />
      <Text style={styles.settingsLabel}>Confirm new password</Text>
      <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" style={styles.settingsInput} />
      <TouchableOpacity style={styles.securityButton} onPress={changePassword}><Text style={styles.securityButtonText}>Update password</Text></TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}><Trash2 size={17} color="#DC2626" /><Text style={styles.deleteButtonText}>Delete account</Text></TouchableOpacity>
  </DashboardSubScreen>;
}

export function SRWalletScreen({ user, bookings, driveRewardRate }: { user: UserProfile; bookings: BookingRecord[]; driveRewardRate: number }) {
  const rewardPercent = Math.round(driveRewardRate * 100);
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.pageTitle}>SR Wallet</Text><Text style={styles.pageSub}>Earn wallet credits every time you book a SmartDrive drive.</Text>
    <LinearGradient colors={[Colors.primaryDark, Colors.primary, Colors.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}><Text style={styles.mutedLight}>AVAILABLE BALANCE</Text><Text style={styles.balance}>₱{user.walletBalance.toLocaleString('en-PH')}.00</Text><Text style={styles.walletCardFooter}>SR WALLET  •  **** 2450</Text></LinearGradient>
    <View style={styles.walletEarnCard}>
      <View style={styles.walletEarnIcon}><Gift size={18} color={PURPLE} /></View>
      <View style={styles.flex}><Text style={styles.walletEarnTitle}>Earn {rewardPercent}% on every drive</Text><Text style={styles.walletEarnSub}>Your reward is credited immediately after a booking is confirmed. Use it toward your next SmartDrive reservation.</Text></View>
    </View>
    <Text style={styles.sectionTitle}>Drive earnings</Text>
    {bookings.length === 0 ? (
      <View style={styles.emptyState}><Text style={styles.emptyTitle}>No drive earnings yet</Text><Text style={styles.emptySub}>Book your first vehicle to start earning SR Wallet credits.</Text></View>
    ) : bookings.slice(0, 5).map((booking) => {
      const reward = Math.round(booking.totalAmount * driveRewardRate);
      return <View key={booking.id} style={styles.transaction}><View style={styles.transactionIcon}><Wallet size={16} color={PURPLE} /></View><View style={styles.flex}><Text style={styles.transactionTitle}>{booking.vehicleName}</Text><Text style={styles.transactionDate}>Booking confirmed • {booking.id}</Text></View><Text style={[styles.transactionAmount, { color: '#10B981' }]}>+₱{reward.toLocaleString()}</Text></View>;
    })}
  </ScrollView>;
}

const styles = StyleSheet.create({
  offerFont: { fontFamily: 'Poppins_400Regular' },
  offerFontBold: { fontFamily: 'Poppins_700Bold' },
  offerTitleMobile: { fontSize: 18, lineHeight: 23 },
  offerBodyMobile: { fontSize: 11, lineHeight: 17 },
  offerSmallMobile: { fontSize: 10, lineHeight: 15 },
  screen: { flex: 1, backgroundColor: '#F7F5FC' }, content: { padding: 16, paddingBottom: 30 },
  homeHero: { minHeight: 136, borderRadius: 18, padding: 13, overflow: 'hidden', marginBottom: 10 },
  homeEyebrow: { fontSize: 8, color: '#E9D5FF', fontWeight: '900', letterSpacing: 1.2 },
  homeHeroTitle: { fontSize: 22, lineHeight: 25, color: '#FFFFFF', fontWeight: '900', marginTop: 5 },
  homeHeroSub: { color: '#F5D0FE', fontSize: 9, lineHeight: 12, marginTop: 5, maxWidth: 280 },
  homeHeroButton: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7, marginTop: 8 },
  homeHeroButtonText: { color: '#6D28D9', fontSize: 9, fontWeight: '900' },
  homeSearchBar: { height: 36, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 11, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E9D5FF', marginBottom: 12 },
  homeSearchPlaceholder: { color: '#94A3B8', fontSize: 10 },
  homeFeatureStrip: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, marginBottom: 13, borderWidth: 1, borderColor: '#E3DDF2', shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  homeFeatureHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  homeFeatureTitle: { color: '#0F172A', fontSize: 12, fontWeight: '900' },
  homeFeatureSub: { color: '#64748B', fontSize: 8, marginTop: 2 },
  homeFeatureRow: { flexDirection: 'row', justifyContent: 'space-between' },
  homeFeatureItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  homeFeatureItemText: { color: '#334155', fontSize: 8, lineHeight: 11, fontWeight: '800' },
  homeSectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 7 },
  homeSectionTitle: { color: '#0F172A', fontSize: 13, fontWeight: '900' },
  homeSectionSub: { color: '#94A3B8', fontSize: 8, marginTop: 2 },
  homeSeeAll: { color: '#7C3AED', fontSize: 8, fontWeight: '900' },
  homeFleetCarousel: { paddingRight: 8 },
  homeVehicleCard: { width: 292, flexDirection: 'row', height: 92, backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#E3DDF2', marginRight: 10, marginBottom: 8, padding: 6, shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  homeVehicleImage: { width: 80, height: 78, borderRadius: 12, backgroundColor: '#EDE9FE' },
  homeVehicleBody: { flex: 1, flexDirection: 'row', paddingLeft: 9, paddingRight: 3, alignItems: 'center' },
  homeVehicleCategory: { color: '#A21CAF', fontSize: 7, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.4 },
  homeVehicleName: { color: '#0F172A', fontSize: 11, lineHeight: 14, fontWeight: '900', marginTop: 3, paddingRight: 4 },
  homeVehiclePrice: { color: '#4C1D95', fontSize: 10, fontWeight: '900', marginTop: 5 },
  homeBookNow: { color: '#FFFFFF', fontSize: 8, fontWeight: '900' },
  homeStarButton: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7ED' },
  homeBookButton: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#7C3AED', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 6 },
  hero: { minHeight: 153, borderRadius: 20, padding: 16, overflow: 'hidden', marginBottom: 14 },
  aboutHero: { borderRadius: 22, padding: 20, marginBottom: 18, overflow: 'hidden' },
  aboutHeroTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 8 },
  aboutHeroText: { color: '#F5D0FE', fontSize: 12, lineHeight: 18, marginTop: 8 },
  aboutGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  aboutCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#E3DDF2', marginBottom: 2, shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  aboutIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  aboutCardTitle: { color: '#0F172A', fontSize: 13, fontWeight: '900', marginBottom: 5 },
  aboutCardText: { color: '#64748B', fontSize: 10, lineHeight: 15 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 9 },
  sectionKicker: { color: '#A21CAF', fontSize: 9, fontWeight: '800' },
  storyCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 17, borderWidth: 1, borderColor: '#EDE9FE', marginBottom: 18, gap: 10, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  storyLead: { color: '#4C1D95', fontSize: 16, lineHeight: 21, fontWeight: '900', marginBottom: 2 },
  aboutBody: { color: '#64748B', fontSize: 11, lineHeight: 18 },
  contactGrid: { gap: 10, marginBottom: 18 },
  contactCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#EDE9FE' },
  contactTitle: { color: '#0F172A', fontSize: 13, fontWeight: '900', marginTop: 9 },
  contactText: { color: '#64748B', fontSize: 11, lineHeight: 16, marginTop: 4 },
  teamCard: { backgroundColor: '#F3E8FF', borderRadius: 18, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: '#DDD6FE' },
  teamTitle: { color: '#4C1D95', fontSize: 17, fontWeight: '900', marginVertical: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E3DDF2', shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 2 },
  statValue: { color: PURPLE, fontSize: 24, fontWeight: '900' },
  statLabel: { color: '#64748B', fontSize: 10, marginTop: 4, textAlign: 'center' },
  aboutCta: { backgroundColor: '#4C1D95', borderRadius: 20, padding: 20, marginBottom: 8 },
  aboutCtaTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '900' },
  aboutCtaText: { color: '#E9D5FF', fontSize: 11, lineHeight: 17, marginTop: 7 },
  heroCopy: { flex: 1 }, eyebrow: { fontSize: 9, color: '#E9D5FF', fontWeight: '900', letterSpacing: 1.2 },   heroTitle: { fontSize: 24, lineHeight: 27, color: '#FFFFFF', fontWeight: '900', marginTop: 7 }, heroSub: { color: '#F5D0FE', fontSize: 10, lineHeight: 15, marginTop: 6, maxWidth: 265 }, heroButton: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8, marginTop: 10 }, heroButtonText: { color: PURPLE, fontSize: 10, fontWeight: '900' },
  walletCard: { borderRadius: 22, padding: 18, marginBottom: 22, overflow: 'hidden' }, rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, mutedLight: { color: Colors.lavender, fontSize: 10, fontWeight: '800', letterSpacing: 1 }, balance: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 4 }, walletIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }, walletBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }, points: { color: '#F5D0FE', fontSize: 11, fontWeight: '700' }, walletLink: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  sectionTitle: { color: '#0F172A', fontSize: 15, fontWeight: '900', marginBottom: 9, marginTop: 4 }, sectionSubtitle: { color: '#64748B', fontSize: 10, marginTop: -5, marginBottom: 9 }, searchBar: { height: 38, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E9D5FF', marginBottom: 14 }, searchPlaceholder: { color: '#94A3B8', fontSize: 10 }, seeAll: { color: PURPLE, fontSize: 10, fontWeight: '900' }, vehicleCard: { flexDirection: 'row', height: 90, backgroundColor: '#FFFFFF', borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#E9D5FF', marginBottom: 10, padding: 7 }, vehicleImage: { width: 66, height: 58, borderRadius: 8 }, vehicleBody: { flex: 1, flexDirection: 'row', paddingHorizontal: 8, alignItems: 'center' }, vehicleInfo: { flex: 1, minWidth: 0 }, vehicleCategory: { color: '#A21CAF', fontSize: 8, fontWeight: '900', textTransform: 'uppercase' }, vehicleName: { color: '#0F172A', fontSize: 10, fontWeight: '900', marginTop: 3 }, vehiclePrice: { color: '#4C1D95', fontSize: 10, fontWeight: '900', marginTop: 5 }, perDay: { color: '#64748B', fontSize: 8, fontWeight: '600' }, vehicleAction: { alignItems: 'flex-end', justifyContent: 'space-between', height: 56 }, bookNow: { color: '#6D28D9', fontSize: 7, fontWeight: '900' }, tripNotice: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#ECFDF5', padding: 11, borderRadius: 13, marginTop: 10 }, tripText: { flex: 1, color: '#047857', fontSize: 10, lineHeight: 14, fontWeight: '800' },
  satisfactionCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 17, marginTop: 10, borderWidth: 1, borderColor: '#E9D5FF', shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  satisfactionHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  satisfactionIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  satisfactionHeadingCopy: { flex: 1 },
  satisfactionTitle: { color: '#0F172A', fontSize: 15, fontWeight: '900' },
  satisfactionText: { color: '#64748B', fontSize: 10, marginTop: 3 },
  satisfactionScale: { flexDirection: 'row', gap: 8, width: '100%' },
  satisfactionButton: { flex: 1, height: 42, borderRadius: 13, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  satisfactionButtonActive: { backgroundColor: '#F3E8FF', borderColor: '#A855F7', transform: [{ scale: 1.06 }] },
  satisfactionEmoji: { fontSize: 21 },
  satisfactionFeedback: { color: PURPLE, fontSize: 10, fontWeight: '800', textAlign: 'center', marginTop: 9, marginBottom: 14 },
  dashboardCommentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dashboardCommentLabel: { color: '#334155', fontSize: 11, fontWeight: '800' },
  dashboardCommentOptional: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
  dashboardCommentCount: { color: '#94A3B8', fontSize: 9 },
  dashboardReviewInput: { width: '100%', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, minHeight: 78, paddingHorizontal: 11, paddingVertical: 10, color: '#0F172A', fontSize: 11, lineHeight: 16, textAlignVertical: 'top' },
  dashboardReviewButton: { width: '100%', backgroundColor: PURPLE, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  dashboardReviewButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  dashboardReviewMessage: { color: PURPLE, fontSize: 10, textAlign: 'center', marginTop: 8 },
  dashboardNavDivider: { height: 1, backgroundColor: '#DDD6FE', marginTop: 22, marginBottom: 14 }, dashboardNavTitle: { color: '#4C1D95', fontSize: 13, fontWeight: '900', marginBottom: 10 }, dashboardNav: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 }, dashboardNavItem: { width: '31%', minHeight: 72, marginBottom: 9, padding: 10, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E9D5FF', alignItems: 'center', justifyContent: 'center' }, dashboardNavIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }, dashboardNavText: { color: '#334155', fontSize: 10, fontWeight: '800', textAlign: 'center' }, logoutNavText: { color: '#DC2626' }, subCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E9D5FF', padding: 15, marginBottom: 10, gap: 6 }, subCardTitle: { color: '#0F172A', fontSize: 14, fontWeight: '900' }, subCardText: { color: '#64748B', fontSize: 11, lineHeight: 16 }, offersIntro: { alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, marginBottom: 14 }, offersIntroTitle: { color: '#9333EA', fontSize: 22, fontWeight: '900', textAlign: 'center', marginTop: 5 }, offersIntroText: { color: '#64748B', fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 4 }, promoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 }, promoCard: { width: '48.5%', minHeight: 230, backgroundColor: '#FFFFFF', borderRadius: 15, borderTopWidth: 2, borderTopColor: '#A855F7', borderWidth: 1, borderColor: '#E9D5FF', padding: 13, marginBottom: 12, shadowColor: '#7C3AED', shadowOpacity: 0.08, shadowRadius: 7, elevation: 2 }, promoTag: { alignSelf: 'flex-start', color: '#7C3AED', backgroundColor: '#F3E8FF', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4, fontSize: 8, fontWeight: '900' }, promoTitle: { color: '#0F172A', fontSize: 14, lineHeight: 18, fontWeight: '900', marginTop: 9 }, promoDescription: { color: '#64748B', fontSize: 10, lineHeight: 15, marginTop: 5, flex: 1 }, promoDivider: { height: 1, backgroundColor: '#E9D5FF', marginVertical: 10 }, promoFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5 }, promoCode: { flex: 1, color: '#64748B', fontSize: 9, lineHeight: 13 }, promoButton: { backgroundColor: '#9333EA', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 7 }, promoButtonText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' }, rewardsHeading: { alignItems: 'center', marginBottom: 14 }, rewardsTitle: { color: '#0F172A', fontSize: 18, lineHeight: 23, fontWeight: '900' }, rewardsSubtitle: { color: '#64748B', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 4 }, rewardsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 }, rewardCard: { width: '48.5%', minHeight: 205, backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: '#E9D5FF', padding: 13, marginBottom: 12 }, rewardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 5 }, rewardName: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }, rewardTitle: { color: '#0F172A', fontSize: 11, lineHeight: 15, fontWeight: '900' }, rewardPercent: { color: '#059669', backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4, fontSize: 9, fontWeight: '900' }, rewardDescription: { color: '#64748B', fontSize: 10, lineHeight: 15, marginTop: 9, minHeight: 45 }, rewardStep: { color: '#64748B', fontSize: 9, lineHeight: 14, marginTop: 4 }, rewardProgressTrack: { height: 7, backgroundColor: '#EDE9FE', borderRadius: 5, marginTop: 11, overflow: 'hidden' }, rewardProgressFill: { height: '100%', backgroundColor: '#A855F7', borderRadius: 5 }, progressText: { color: '#64748B', backgroundColor: '#EDE9FE', borderRadius: 9, paddingVertical: 7, textAlign: 'center', fontSize: 9, fontWeight: '800', marginTop: 6 }, codesTitle: { color: '#0F172A', fontSize: 16, lineHeight: 21, fontWeight: '900', marginTop: 7 }, codesSubtitle: { color: '#64748B', fontSize: 11, lineHeight: 16, marginTop: 3, marginBottom: 10 }, promoEntry: { backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: '#E9D5FF', padding: 14, marginBottom: 18 }, promoEntryLabel: { color: '#334155', fontSize: 11, fontWeight: '900', marginBottom: 8 }, promoEntryRow: { flexDirection: 'row', gap: 8 }, promoInput: { flex: 1, height: 44, borderRadius: 9, borderWidth: 1, borderColor: '#DDD6FE', paddingHorizontal: 10, color: '#334155', fontSize: 11 }, validateButton: { backgroundColor: '#9333EA', borderRadius: 9, paddingHorizontal: 12, justifyContent: 'center' }, validateButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' }, validatedText: { color: '#059669', fontSize: 10, fontWeight: '800', marginTop: 9 }, chatCard: { backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden', marginTop: 8, borderWidth: 1, borderColor: '#DDD6FE' }, chatHeader: { backgroundColor: '#4C1D95', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, chatTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 }, chatTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' }, chatClear: { color: '#E9D5FF', fontSize: 11, fontWeight: '800' }, chatBody: { padding: 12, maxHeight: 260 }, chatMessage: { marginBottom: 10 }, chatSender: { color: '#64748B', fontSize: 9, fontWeight: '800', marginBottom: 4 }, chatBubble: { alignSelf: 'flex-start', backgroundColor: '#F3E8FF', color: '#4C1D95', borderRadius: 10, padding: 10, fontSize: 11, lineHeight: 16, maxWidth: '92%' }, chatUserBubble: { backgroundColor: '#F1F5F9', color: '#334155', alignSelf: 'flex-end' }, chatInputRow: { borderTopWidth: 1, borderTopColor: '#EDE9FE', padding: 10, flexDirection: 'row', gap: 8 }, chatInput: { flex: 1, minHeight: 40, borderWidth: 1, borderColor: '#DDD6FE', borderRadius: 10, paddingHorizontal: 10, color: '#0F172A', fontSize: 11 }, chatSend: { backgroundColor: '#7C3AED', borderRadius: 10, paddingHorizontal: 13, justifyContent: 'center' }, chatSendText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' }, bookingStatus: { color: '#16A34A', fontSize: 11, fontWeight: '900' }, offerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F3E8FF', borderRadius: 16, padding: 16, marginBottom: 10 },
  dashboardHero: { borderRadius: 22, padding: 19, marginBottom: 15, overflow: 'hidden' }, dashboardWelcome: { color: '#FFFFFF', fontSize: 23, fontWeight: '900', marginTop: 7 }, dashboardHeroText: { color: '#E9D5FF', fontSize: 11, marginTop: 6 }, welcomeBanner: { backgroundColor: '#F3E8FF', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#DDD6FE' }, welcomeTitle: { color: '#4C1D95', fontSize: 17, fontWeight: '900' }, welcomeText: { color: '#64748B', fontSize: 11, lineHeight: 17, marginTop: 6 }, dashboardStat: { flex: 1, minWidth: 0, backgroundColor: '#FFFFFF', borderRadius: 15, padding: 14, borderWidth: 1, borderColor: '#E9D5FF' }, dashboardStatLabel: { color: '#94A3B8', fontSize: 8, fontWeight: '900', marginTop: 9 }, dashboardStatValue: { color: '#0F172A', fontSize: 16, fontWeight: '900', marginTop: 5 }, activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 9 }, viewAll: { color: PURPLE, fontSize: 10, fontWeight: '900' }, activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 13, marginBottom: 8, borderWidth: 1, borderColor: '#E9D5FF' }, activityIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 }, activityTitle: { color: '#334155', fontSize: 11, fontWeight: '900' }, activityText: { color: '#94A3B8', fontSize: 9, marginTop: 3 }, activityRight: { alignItems: 'flex-end' }, activityAmount: { color: '#0F172A', fontSize: 11, fontWeight: '900' }, dashboardCta: { borderRadius: 20, padding: 18, marginTop: 14, overflow: 'hidden' }, dashboardCtaTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' }, dashboardCtaText: { color: '#E9D5FF', fontSize: 10, lineHeight: 16, marginTop: 5 }, tierPoints: { color: '#A21CAF', fontSize: 11, fontWeight: '900' }, rentalProgressTrack: { height: 7, borderRadius: 5, backgroundColor: '#EDE9FE', marginTop: 16, overflow: 'hidden' }, rentalProgressFill: { width: '68%', height: '100%', backgroundColor: '#7C3AED', borderRadius: 5 },
  settingsCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E9D5FF', marginBottom: 12 },
  settingsHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 14 },
  settingsTitle: { color: '#0F172A', fontSize: 15, fontWeight: '900' },
  settingsLabel: { color: '#475569', fontSize: 11, fontWeight: '800', marginBottom: 5, marginTop: 7 },
  settingsInput: { height: 43, borderRadius: 11, borderWidth: 1, borderColor: '#E9D5FF', backgroundColor: '#FAF8FF', paddingHorizontal: 12, color: '#0F172A', fontSize: 12 },
  settingsPrimaryButton: { height: 43, borderRadius: 11, backgroundColor: '#4C1D95', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 },
  settingsPrimaryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingsRowTitle: { color: '#334155', fontSize: 12, fontWeight: '900' },
  settingsRowSub: { color: '#64748B', fontSize: 10, lineHeight: 15, marginTop: 3 },
  securityButton: { marginTop: 14, paddingVertical: 11, borderRadius: 11, backgroundColor: '#F3E8FF', alignItems: 'center' },
  securityButtonText: { color: '#6D28D9', fontSize: 12, fontWeight: '900' },
  deleteButton: { height: 46, borderRadius: 13, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FFF1F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 4, marginBottom: 12 },
  deleteButtonText: { color: '#DC2626', fontSize: 12, fontWeight: '900' },
  pageTitle: { color: '#0F172A', fontSize: 26, fontWeight: '900', marginTop: 4 }, pageSub: { color: '#64748B', fontSize: 13, marginTop: 5, marginBottom: 20 }, serviceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#EDE9FE', marginBottom: 10 }, serviceIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' }, flex: { flex: 1 }, serviceTitle: { color: '#0F172A', fontWeight: '900', fontSize: 14 }, serviceSub: { color: '#64748B', fontSize: 11, marginTop: 3 }, servicePrice: { color: PURPLE, fontWeight: '900', fontSize: 12 }, perkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, perk: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, gap: 10, borderWidth: 1, borderColor: '#EDE9FE' }, perkText: { color: '#334155', fontSize: 12, fontWeight: '800' },
  activeTrip: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#EDE9FE' }, cardEyebrow: { color: '#64748B', fontSize: 10, fontWeight: '900', letterSpacing: 1 }, activeBadge: { backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }, activeBadgeText: { color: '#047857', fontSize: 9, fontWeight: '900' }, tripVehicle: { color: '#0F172A', fontSize: 20, fontWeight: '900', marginTop: 18 }, tripMeta: { color: '#64748B', fontSize: 12, marginTop: 5 }, odometer: { flexDirection: 'row', gap: 50, marginTop: 22, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' }, odometerLabel: { color: '#94A3B8', fontSize: 9, fontWeight: '900' }, odometerValue: { color: '#0F172A', fontSize: 17, fontWeight: '900' }, hotline: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF1F2', padding: 15, borderRadius: 17, marginTop: 12 }, hotlineTitle: { color: '#0F172A', fontWeight: '900', fontSize: 13 }, hotlineSub: { color: '#64748B', fontSize: 11, marginTop: 2 }, hotlineNumber: { color: '#EF4444', fontSize: 18, fontWeight: '900' }, tierCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 17, marginTop: 12, borderWidth: 1, borderColor: '#EDE9FE' }, tierName: { color: '#F59E0B', fontWeight: '900', fontSize: 12 }, progressTrack: { height: 8, borderRadius: 5, backgroundColor: '#FEF3C7', marginTop: 17, overflow: 'hidden' }, progressFill: { width: '72%', height: '100%', backgroundColor: '#F59E0B', borderRadius: 5 }, tierSub: { color: '#64748B', fontSize: 11, marginTop: 8 }, emptyActivity: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 18, borderWidth: 1, borderColor: '#E3DDF2', marginBottom: 12 }, balanceCard: { backgroundColor: Colors.plum, borderRadius: 23, padding: 20, minHeight: 164, justifyContent: 'space-between' }, walletCardFooter: { color: Colors.lavender, fontSize: 11, fontWeight: '800', letterSpacing: 1 }, walletEarnCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#F5F3FF', borderRadius: 16, padding: 15, marginBottom: 22, borderWidth: 1, borderColor: '#DDD6FE' }, walletEarnIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, walletEarnTitle: { color: '#4C1D95', fontSize: 13, fontWeight: '900' }, walletEarnSub: { color: '#64748B', fontSize: 11, lineHeight: 17, marginTop: 4 }, emptyState: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 18, borderWidth: 1, borderColor: '#EDE9FE' }, emptyTitle: { color: '#334155', fontSize: 13, fontWeight: '900' }, emptySub: { color: '#64748B', fontSize: 11, lineHeight: 17, marginTop: 5 }, transaction: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#FFFFFF', padding: 13, borderRadius: 15, marginBottom: 8 }, transactionIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }, transactionTitle: { color: '#334155', fontSize: 12, fontWeight: '800' }, transactionDate: { color: '#94A3B8', fontSize: 10, marginTop: 3 }, transactionAmount: { color: '#EF4444', fontSize: 12, fontWeight: '900' },
});
