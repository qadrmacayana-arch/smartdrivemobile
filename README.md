# SmartDrive Mobile — Expo React Native App

Pure Expo React Native mobile application for SmartDrive vehicle and motorcycle rentals.

---

## 📱 Mobile Architecture & PHP Screen Mapping

Every web page from your original PHP application has been transformed into a native mobile screen:

| PHP File | Mobile Screen | Description & Features |
| :--- | :--- | :--- |
| `index.php` | **HomeScreen / LobbyScreen** | Hero banner, quick service shortcuts, featured vehicles & VIP card |
| `rent-a-car.php` | **RentVehicleScreen** | Interactive vehicle catalog, search bar, category pills (Cars, Scooters, Campers) |
| `service-selection.php` | **ServiceSelectionScreen** | Self-Drive (₱1,500/d), Chauffeur (₱2,500/d), Hourly (₱250/hr), Why Choose SmartDrive |
| `services-details.php` | **FleetInfoScreen** | Vehicle hero photo, engine specs, transmission, fuel, pricing & instant booking |
| `calendar-selection.php` | **BookingFlowScreen (Step 1)** | Native calendar picker, pickup & return date calculator, duration |
| `detailsform.php` | **BookingFlowScreen (Step 2)** | Driver full name, mobile number, emergency contact & 20% PWD/Senior Citizen discount |
| `payment.php` | **BookingFlowScreen (Step 3)** | GCash, Maya QR, Credit/Debit card, SR Digital Cash Wallet |
| `confirmation.php` | **BookingFlowScreen (Step 4)** | Booking voucher, reference number (SD-XXXXXX), QR code, download PDF |
| `dashboard.php` | **DashboardScreen** | Active rental tracking, odometer timer, loyalty tier progress (Gold/VIP) |
| `bookings.php` | **BookingsScreen** | History of past and active rentals, digital receipts & trip status |
| `srwallet.php` | **SRWalletScreen** | Balance card (₱24,500.00), drive-based wallet earnings (5% per confirmed booking) & transaction log |
| `offers.php` | **OffersScreen** | Voucher codes, 15% weekend discount, student perks & claimable promos |
| `aboutpage.php` | **AboutScreen** | Technological Institute of the Philippines (TIP QC) project, mission & coverage |
| `faq.php` | **FAQScreen** | Expandable questions & integrated AI Assistant |
| `settings.php` | **SettingsScreen** | Profile editor, email notifications, dark/light theme, security PIN |
| `login.php` | **AuthScreen (Tab 1)** | Member sign in with email/phone and biometric fingerprint |
| `signup.php` | **AuthScreen (Tab 2)** | New account registration with driver's license upload |

---

## 📁 Directory Structure

```
SmartDriveMobile/
├── App.tsx                    # Main Expo React Native App entry
├── app.json                   # Expo configuration (slug: SmartDriveMobile)
├── package.json               # Expo SDK 52 dependencies
├── tsconfig.json              # TypeScript baseUrl configuration
└── src/
    ├── constants/
    │   ├── colors.ts          # SmartDrive purple theme palette
    │   └── vehicles.ts        # Fleet database (Cars, Motorcycles, Recreational)
    ├── types/
    │   └── index.ts           # UserProfile, BookingRecord, VehicleReview types
    ├── screens/
    │   ├── LoadingScreen.tsx  # App loading / splash screen (splash)
    │   ├── AuthScreen.tsx     # Login & Sign-up (login.php, signup.php)
    │   ├── LobbyScreen.tsx    # Home dashboard & VIP wallet (index.php, dashboard.php)
    │   ├── RentVehicleScreen.tsx # Rent catalog with search & category filters (rent-a-car.php)
    │   ├── FleetInfoScreen.tsx   # Detailed specs, horsepower & features (services-details.php)
    │   ├── BookingFlowScreen.tsx # Multi-step booking (calendar-selection.php, detailsform.php, payment.php, confirmation.php)
    │   └── ReviewsModal.tsx   # Verified customer star ratings & reviews
    └── components/
        └── SideMenu.tsx       # Working slide-over side drawer menu
```

---

## 🚀 Running on Your PC (`C:\Users\macay_9vahype\SmartDriveMobile`)

### 1. Open Terminal in your folder:
```powershell
cd "C:\Users\macay_9vahype\SmartDriveMobile"
```

### 2. Install dependencies:
```powershell
npm install
```

### 3. Launch Expo:
```powershell
npx expo start -c
```

- Press `a` to run in Android Emulator
- Scan the QR code with Expo Go on your physical Android/iOS phone
